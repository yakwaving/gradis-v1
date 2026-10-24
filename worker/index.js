/* Gradis accounts + sync API (Cloudflare Worker + D1).
   Static files are served by Cloudflare; only /api/* reaches this code. */
const enc = new TextEncoder();
const NOW = () => Date.now();
const SESSION_DAYS = 180, PAIR_MS = 5 * 60 * 1000, MAX_RESULTS = 3000, BATCH = 500, ITER = 100000;

/* ---------- small helpers ---------- */
const b64u = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
const rand = n => crypto.getRandomValues(new Uint8Array(n));
const token = () => b64u(rand(32));
async function sha(s) { return b64u(await crypto.subtle.digest("SHA-256", enc.encode(s))); }
async function pbkdf2(secret, salt) {
  const k = await crypto.subtle.importKey("raw", enc.encode(secret), "PBKDF2", false, ["deriveBits"]);
  return b64u(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unb64u(salt), iterations: ITER }, k, 256));
}
function same(a, b) { if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
class Err extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const bad = (msg, status = 400) => { throw new Err(status, msg); };

/* recovery key: 6 pronounceable words, e.g. bako-tide-mura-selo-nipa-kuze (72 bits) */
const C = "bdfghklmnprstvzj", V = "aeio";
function recoveryKey() {
  const w = []; for (let i = 0; i < 6; i++) { const r = rand(4); w.push(C[r[0] % 16] + V[r[1] % 4] + C[r[2] % 16] + V[r[3] % 4]); } return w.join("-");
}
const normKey = s => String(s || "").toLowerCase().replace(/[^a-z]/g, "");

const userName = s => { s = String(s || "").trim().toLowerCase(); if (!/^[a-z0-9_.]{3,24}$/.test(s)) bad("Username: 3 to 24 letters, numbers, dots or underscores."); return s; };
const passWord = s => { s = String(s || ""); if (s.length < 8) bad("Password must be at least 8 characters."); if (s.length > 200) bad("Password is too long."); return s; };
const devName = s => String(s || "Unknown device").replace(/[<>]/g, "").slice(0, 60);

/* ---------- rate limiting (per key, in D1) ---------- */
async function limit(env, key, max, windowSec) {
  const now = Math.floor(NOW() / 1000);
  const row = await env.DB.prepare("SELECT n,t FROM rl WHERE k=?").bind(key).first();
  if (!row || row.t + windowSec < now) { await env.DB.prepare("INSERT OR REPLACE INTO rl(k,n,t) VALUES(?,?,?)").bind(key, 1, now).run(); return; }
  if (row.n >= max) bad("Too many attempts. Please wait a few minutes and try again.", 429);
  await env.DB.prepare("UPDATE rl SET n=n+1 WHERE k=?").bind(key).run();
}
const clearLimit = (env, key) => env.DB.prepare("DELETE FROM rl WHERE k=?").bind(key).run();

/* ---------- sessions ---------- */
async function newSession(env, userId, device) {
  const t = token(), now = NOW();
  await env.DB.prepare("INSERT INTO sessions(id,user_id,device,created,last_seen) VALUES(?,?,?,?,?)").bind(await sha(t), userId, devName(device), now, now).run();
  return t;
}
async function auth(env, req) {
  const h = req.headers.get("authorization") || ""; const t = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!t) bad("Please sign in.", 401);
  const id = await sha(t), now = NOW();
  const s = await env.DB.prepare("SELECT s.id sid, s.last_seen ls, u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=?").bind(id).first();
  if (!s || s.ls < now - SESSION_DAYS * 864e5) bad("Your session ended. Please sign in again.", 401);
  if (now - s.ls > 36e5) await env.DB.prepare("UPDATE sessions SET last_seen=? WHERE id=?").bind(now, id).run();
  return s;
}
const ip = req => req.headers.get("cf-connecting-ip") || "local";
const me = u => ({ username: u.username, google: u.google_email || null, hasPassword: !!u.pw_hash });
async function setPassword(env, id, pw) {
  const salt = b64u(rand(16)); await env.DB.prepare("UPDATE users SET pw_hash=?, pw_salt=? WHERE id=?").bind(await pbkdf2(pw, salt), salt, id).run();
}
async function setRecovery(env, id) {
  const key = recoveryKey(), salt = b64u(rand(16));
  await env.DB.prepare("UPDATE users SET rk_hash=?, rk_salt=? WHERE id=?").bind(await pbkdf2(normKey(key), salt), salt, id).run();
  return key;
}
async function checkPassword(u, pw) { return !!u && !!u.pw_hash && same(await pbkdf2(String(pw || ""), u.pw_salt), u.pw_hash); }

/* ---------- Google sign-in (ID token verified here) ---------- */
let JWKS = null, JWKS_AT = 0;
async function googleKeys() {
  if (JWKS && NOW() - JWKS_AT < 36e5) return JWKS;
  const r = await fetch("https://www.googleapis.com/oauth2/v3/certs"); if (!r.ok) bad("Could not reach Google. Try again.", 502);
  JWKS = (await r.json()).keys || []; JWKS_AT = NOW(); return JWKS;
}
async function googleUser(env, credential) {
  if (!env.GOOGLE_CLIENT_ID) bad("Google sign-in is not set up yet.", 501);
  const parts = String(credential || "").split("."); if (parts.length !== 3) bad("Invalid Google sign-in.");
  let head, body; try { head = JSON.parse(new TextDecoder().decode(unb64u(parts[0]))); body = JSON.parse(new TextDecoder().decode(unb64u(parts[1]))); } catch (e) { bad("Invalid Google sign-in."); }
  const jwk = (await googleKeys()).find(k => k.kid === head.kid); if (!jwk || head.alg !== "RS256") bad("Invalid Google sign-in.");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, unb64u(parts[2]), enc.encode(parts[0] + "." + parts[1]));
  if (!ok) bad("Invalid Google sign-in.");
  if (!["accounts.google.com", "https://accounts.google.com"].includes(body.iss) || body.aud !== env.GOOGLE_CLIENT_ID || body.exp * 1000 < NOW() || !body.sub) bad("Invalid Google sign-in.");
  return { sub: String(body.sub), email: body.email_verified ? String(body.email || "") : "" };
}

/* ---------- results ---------- */
function cleanResult(r) {
  if (!r || typeof r !== "object") return null;
  const s = v => String(v == null ? "" : v).slice(0, 200), n = v => (Number.isFinite(+v) ? +v : null);
  const id = String(r.id || "").slice(0, 40), ts = n(r.ts), p = n(r.p), got = n(r.got), max = n(r.max);
  if (!id || ts == null || p == null || got == null || max == null || !r.s || !r.q) return null;
  return { id, ts, s: s(r.s), q: s(r.q), t: s(r.t), p, got, max, m: s(r.m).slice(0, 20), cal: r.cal == null ? null : n(r.cal) };
}

/* ---------- routes ---------- */
const routes = {
  "GET /api/config": async (env) => json({ google: env.GOOGLE_CLIENT_ID || "" }),

  "POST /api/signup": async (env, req, b) => {
    await limit(env, "signup:" + ip(req), 10, 3600);
    const username = userName(b.username), pw = passWord(b.password);
    if (await env.DB.prepare("SELECT 1 x FROM users WHERE username=?").bind(username).first()) bad("That username is taken.", 409);
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users(id,username,created) VALUES(?,?,?)").bind(id, username, NOW()).run();
    await setPassword(env, id, pw); const recovery = await setRecovery(env, id);
    return json({ token: await newSession(env, id, b.device), username, recovery });
  },

  "POST /api/login": async (env, req, b) => {
    const username = String(b.username || "").trim().toLowerCase();
    await limit(env, "login:ip:" + ip(req), 30, 600); await limit(env, "login:u:" + username, 8, 900);
    const u = await env.DB.prepare("SELECT * FROM users WHERE username=?").bind(username).first();
    if (!(await checkPassword(u, b.password))) bad("Wrong username or password.", 401);
    await clearLimit(env, "login:u:" + username);
    return json({ token: await newSession(env, u.id, b.device), ...me(u) });
  },

  "POST /api/recover": async (env, req, b) => {
    const username = String(b.username || "").trim().toLowerCase();
    await limit(env, "rec:ip:" + ip(req), 10, 3600); await limit(env, "rec:u:" + username, 5, 3600);
    const u = await env.DB.prepare("SELECT * FROM users WHERE username=?").bind(username).first();
    if (!u || !u.rk_hash || !same(await pbkdf2(normKey(b.key), u.rk_salt), u.rk_hash)) bad("That username and recovery key do not match.", 401);
    const pw = passWord(b.password);
    await setPassword(env, u.id, pw);
    await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(u.id).run();
    const recovery = await setRecovery(env, u.id);
    await clearLimit(env, "rec:u:" + username);
    return json({ token: await newSession(env, u.id, b.device), ...me(u), recovery });
  },

  /* Google: signs in, creates an account, or (when already signed in) links Google to this account */
  "POST /api/google": async (env, req, b) => {
    await limit(env, "google:" + ip(req), 30, 600);
    const g = await googleUser(env, b.credential);
    const hasAuth = (req.headers.get("authorization") || "").startsWith("Bearer ");
    const owner = await env.DB.prepare("SELECT * FROM users WHERE google_sub=?").bind(g.sub).first();
    if (hasAuth) {
      const s = await auth(env, req);
      if (owner && owner.id !== s.id) bad("That Google account is already linked to another Gradis account.", 409);
      await env.DB.prepare("UPDATE users SET google_sub=?, google_email=? WHERE id=?").bind(g.sub, g.email, s.id).run();
      return json({ linked: true, google: g.email });
    }
    let u = owner;
    if (!u) {
      const id = crypto.randomUUID();
      await env.DB.prepare("INSERT INTO users(id,google_sub,google_email,created) VALUES(?,?,?,?)").bind(id, g.sub, g.email, NOW()).run();
      u = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(id).first();
    }
    return json({ token: await newSession(env, u.id, b.device), ...me(u), isNew: !owner });
  },

  "GET /api/me": async (env, req) => { const u = await auth(env, req); return json(me(u)); },

  "POST /api/signout": async (env, req) => { const u = await auth(env, req); await env.DB.prepare("DELETE FROM sessions WHERE id=?").bind(u.sid).run(); return json({ ok: true }); },
  "POST /api/signout-all": async (env, req) => { const u = await auth(env, req); await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(u.id).run(); return json({ ok: true }); },

  "GET /api/devices": async (env, req) => {
    const u = await auth(env, req);
    const r = await env.DB.prepare("SELECT id,device,created,last_seen FROM sessions WHERE user_id=? ORDER BY last_seen DESC").bind(u.id).all();
    return json({ devices: r.results.map(d => ({ id: d.id.slice(0, 12), device: d.device, created: d.created, last: d.last_seen, current: d.id === u.sid })) });
  },
  "POST /api/devices/revoke": async (env, req, b) => {
    const u = await auth(env, req); const r = await env.DB.prepare("SELECT id FROM sessions WHERE user_id=?").bind(u.id).all();
    const t = r.results.find(d => d.id.slice(0, 12) === String(b.id)); if (t) await env.DB.prepare("DELETE FROM sessions WHERE id=?").bind(t.id).run();
    return json({ ok: true, self: !!t && t.id === u.sid });
  },

  "POST /api/pair/new": async (env, req) => {
    const u = await auth(env, req); await limit(env, "pairnew:" + u.id, 10, 600);
    await env.DB.prepare("DELETE FROM pairs WHERE user_id=? OR expires<?").bind(u.id, NOW()).run();
    const code = String(new DataView(rand(4).buffer).getUint32(0) % 1000000).padStart(6, "0");
    await env.DB.prepare("INSERT INTO pairs(code_hash,user_id,expires) VALUES(?,?,?)").bind(await sha("pair:" + code), u.id, NOW() + PAIR_MS).run();
    return json({ code, seconds: PAIR_MS / 1000 });
  },
  "POST /api/pair/use": async (env, req, b) => {
    await limit(env, "pair:" + ip(req), 10, 600);
    const code = String(b.code || "").replace(/\D/g, ""); if (code.length !== 6) bad("Enter the 6-digit code.");
    const h = await sha("pair:" + code), p = await env.DB.prepare("SELECT * FROM pairs WHERE code_hash=?").bind(h).first();
    if (!p || p.expires < NOW()) bad("That code is wrong or has expired.", 401);
    await env.DB.prepare("DELETE FROM pairs WHERE code_hash=?").bind(h).run();
    const u = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(p.user_id).first();
    return json({ token: await newSession(env, u.id, b.device), ...me(u) });
  },

  "POST /api/sync": async (env, req, b) => {
    const u = await auth(env, req); const list = Array.isArray(b.results) ? b.results.slice(0, BATCH).map(cleanResult).filter(Boolean) : [];
    if (list.length) await env.DB.batch(list.map(r => env.DB.prepare("INSERT OR IGNORE INTO results(user_id,rid,ts,d) VALUES(?,?,?,?)").bind(u.id, r.id, r.ts, JSON.stringify(r))));
    const cnt = await env.DB.prepare("SELECT COUNT(*) c FROM results WHERE user_id=?").bind(u.id).first();
    if (cnt.c > MAX_RESULTS) await env.DB.prepare("DELETE FROM results WHERE user_id=? AND seq IN (SELECT seq FROM results WHERE user_id=? ORDER BY ts ASC LIMIT ?)").bind(u.id, u.id, cnt.c - MAX_RESULTS).run();
    const since = Number(b.since) || 0;
    const rows = (await env.DB.prepare("SELECT seq,d FROM results WHERE user_id=? AND seq>? ORDER BY seq LIMIT ?").bind(u.id, since, BATCH).all()).results;
    return json({ results: rows.map(r => ({ ...JSON.parse(r.d), seq: r.seq })), seq: rows.length ? rows[rows.length - 1].seq : since, more: rows.length === BATCH, accepted: list.map(r => r.id) });
  },

  "POST /api/password": async (env, req, b) => {
    const u = await auth(env, req); if (!u.pw_hash) bad("This account has no password yet.");
    await limit(env, "pw:" + u.id, 8, 900);
    if (!(await checkPassword(u, b.old))) bad("Your current password is wrong.", 401);
    await setPassword(env, u.id, passWord(b.password));
    await env.DB.prepare("DELETE FROM sessions WHERE user_id=? AND id<>?").bind(u.id, u.sid).run();
    return json({ ok: true });
  },
  /* Google-only account adds a username and password */
  "POST /api/credentials": async (env, req, b) => {
    const u = await auth(env, req); if (u.username) bad("This account already has a username.");
    const username = userName(b.username), pw = passWord(b.password);
    if (await env.DB.prepare("SELECT 1 x FROM users WHERE username=?").bind(username).first()) bad("That username is taken.", 409);
    await env.DB.prepare("UPDATE users SET username=? WHERE id=?").bind(username, u.id).run();
    await setPassword(env, u.id, pw);
    return json({ username, recovery: await setRecovery(env, u.id) });
  },
  "POST /api/recovery-new": async (env, req, b) => {
    const u = await auth(env, req); await limit(env, "pw:" + u.id, 8, 900);
    if (!(await checkPassword(u, b.password))) bad("Your password is wrong.", 401);
    return json({ recovery: await setRecovery(env, u.id) });
  },
  "POST /api/delete": async (env, req, b) => {
    const u = await auth(env, req); if (b.confirm !== "DELETE") bad("Type DELETE to confirm.");
    if (u.pw_hash) { await limit(env, "pw:" + u.id, 8, 900); if (!(await checkPassword(u, b.password))) bad("Your password is wrong.", 401); }
    await env.DB.batch(["sessions", "pairs", "results"].map(t => env.DB.prepare(`DELETE FROM ${t} WHERE user_id=?`).bind(u.id)).concat(env.DB.prepare("DELETE FROM users WHERE id=?").bind(u.id)));
    return json({ ok: true });
  }
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS ? env.ASSETS.fetch(req) : new Response("Not found", { status: 404 });
    const fn = routes[req.method + " " + url.pathname];
    if (!fn) return json({ error: "Not found" }, 404);
    try {
      let b = {}; if (req.method === "POST") { try { b = await req.json(); } catch (e) { bad("Bad request."); } if (!b || typeof b !== "object") bad("Bad request."); }
      return await fn(env, req, b);
    } catch (e) {
      if (e instanceof Err) return json({ error: e.message }, e.status);
      console.log("api error", e && e.stack || e); return json({ error: "Something went wrong. Try again." }, 500);
    }
  }
};
