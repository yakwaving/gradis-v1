/* Gradis service worker: makes the app work offline.
   To release an update: change VERSION below, then upload the files. Installed apps offer a "New version ready" prompt. */
const VERSION="gradis-1.5.0";
const SHELL=["./", "index.html", "manifest.webmanifest", "css/fonts.css", "css/style.css", "js/icons-material.js", "js/icons.js", "js/util.js", "js/ads-config.js", "js/ads.js", "js/logo.js", "js/store.js", "js/marking.js", "js/screens.js", "js/qcode.js", "js/quiz.js", "js/events.js", "js/main.js", "fonts/DMSans-Medium.woff2", "fonts/DMSans-Bold.woff2", "fonts/DMSans-ExtraBold.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];
const MANIFEST="subjects-manifest.json";
const imagePaths=(o,out)=>{if(Array.isArray(o))o.forEach(x=>imagePaths(x,out));else if(o&&typeof o==="object")for(const[k,v]of Object.entries(o)){if(k==="image"&&typeof v==="string")out.add(v);else imagePaths(v,out)}return out};
self.addEventListener("install",e=>e.waitUntil((async()=>{
  const c=await caches.open(VERSION);
  await c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"})));
  try{
    const mr=await fetch(MANIFEST,{cache:"reload"});await c.put(MANIFEST,mr.clone());const m=await mr.json();const imgs=new Set();
    for(const[name,v]of Object.entries(m.subjects||{})){const list=Array.isArray(v)?v:(v.quizzes||[]);
      for(const q of list){const u=encodeURI("subjects/"+name+"/"+q+".json");
        try{const r=await fetch(u,{cache:"reload"});if(r.ok){await c.put(u,r.clone());imagePaths(await r.json(),imgs)}}catch(_){}}}
    for(const p of imgs){const u=encodeURI(p);try{const r=await fetch(u,{cache:"reload"});if(r.ok)await c.put(u,r)}catch(_){}}
  }catch(_){}
})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==VERSION)await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
const isShell=url=>SHELL.some(s=>new URL(s,self.registration.scope).href===url.href);
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;const url=new URL(req.url);if(url.origin!==location.origin||url.pathname.includes("/.well-known/"))return;
  e.respondWith((async()=>{
    const c=await caches.open(VERSION);
    const hit=await c.match(req,{ignoreSearch:true});
    if(hit&&(isShell(url)||req.mode==="navigate"))return hit;          /* app files: always from the installed version */
    const net=fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r}).catch(()=>null);   /* quizzes: show saved copy, refresh in background */
    if(hit){e.waitUntil(net);return hit}
    const r=await net;if(r)return r;
    if(req.mode==="navigate"){const idx=await c.match("index.html");if(idx)return idx}
    return Response.error();
  })())});
