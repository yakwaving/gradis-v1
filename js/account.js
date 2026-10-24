/* Accounts and sync (optional). Talks to the small server in worker/ (see worker/SETUP.md).
   Without an account everything stays on this device exactly as before. */
const K_SES="gradis.v1.session",K_OWNER="gradis.v1.owner",K_CFG="gradis.v1.cfg",K_SEQ="gradis.v1.seq";
const AC={ses:null,cfg:null,view:"main",key:null,keyOk:false,pair:null,devs:null,syncing:false,last:0,err:"",seq:0,gis:null};
const acGet=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}};
const acPut=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function devLabel(){const u=navigator.userAgent,os=/Android/.test(u)?"Android":/iPhone|iPad/.test(u)?"iOS":/Windows/.test(u)?"Windows":/Mac/.test(u)?"Mac":/Linux/.test(u)?"Linux":"Device";
 const br=/Edg\//.test(u)?"Edge":/OPR\//.test(u)?"Opera":/Chrome\//.test(u)?"Chrome":/Firefox\//.test(u)?"Firefox":/Safari\//.test(u)?"Safari":"app";return isNative()?os+" app":os+" · "+br}
async function api(path,body){
 const o={method:body===undefined?"GET":"POST",headers:{"content-type":"application/json"}};
 if(AC.ses)o.headers.authorization="Bearer "+AC.ses.token;if(body!==undefined)o.body=JSON.stringify(body);
 let r,j={};try{r=await fetch((window.API_BASE||"")+path,o)}catch(e){throw new Error("Could not reach the server. Check your connection.")}
 try{j=await r.json()}catch(e){}
 if(!r.ok){if(r.status===401&&AC.ses&&!/\/(login|recover|pair)/.test(path))acDrop();
  throw new Error(r.status===404||r.status===405?"Accounts are not available right now.":(j.error||"Something went wrong. Try again."))}
 return j}
function acDrop(){AC.ses=null;AC.devs=null;acPut(K_SES,null);toast("SIGNED OUT");if(S.scr==="acct"){AC.view="main";render()}}
/* ---------- start-up ---------- */
function acInit(){AC.ses=acGet(K_SES);AC.seq=0;AC.cfg=acGet(K_CFG);
 fetch((window.API_BASE||"")+"/api/config").then(r=>r.ok?r.json():null).then(c=>{if(c&&typeof c.google==="string"){AC.cfg={google:c.google};acPut(K_CFG,AC.cfg);if(!S.run&&(S.scr==="home"||S.scr==="hist"))render()}}).catch(()=>{});
 if(AC.ses)syncNow()}
/* ---------- results: merge and sync ---------- */
function legacyId(h){let x=0;const s=String(h.q||"")+"|"+h.p+"|"+h.got;for(let i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))>>>0;return "l"+h.ts.toString(36)+x.toString(36)}
const plain=h=>{const{ago,d,sy,...r}=h;return r};
function mergeIn(list){const have=new Set(HIST.map(h=>h.id));let add=0;
 list.forEach(r=>{if(!r||!r.id||have.has(r.id))return;const{seq,...x}=r;x.sy=1;HIST.push(hydrate(x));have.add(r.id);add++});
 if(add){HIST.sort((a,b)=>b.ts-a.ts);if(HIST.length>500)HIST.length=500;saveHist()}return add}
async function syncNow(){
 if(!AC.ses||AC.syncing||!navigator.onLine)return;AC.syncing=true;AC.err="";const before=HIST.length;let changed=0;
 try{for(let g=0;g<30;g++){
   const up=HIST.filter(h=>!h.sy).slice(0,500),r=await api("/api/sync",{since:AC.seq,results:up.map(plain)});
   up.forEach(h=>h.sy=1);changed+=mergeIn(r.results);AC.seq=r.seq;
   if(!r.more&&!HIST.some(h=>!h.sy))break}
  saveHist();AC.last=Date.now()}
 catch(e){AC.err=e.message}
 finally{AC.syncing=false}
 if(AC.ses&&!S.run&&(changed||S.scr==="acct")&&!document.querySelector(".modal")&&["home","hist","subjects","subres","list","acct"].includes(S.scr))render()}
function acEnter(r){ /* a sign-in succeeded */
 AC.ses={token:r.token,username:r.username||null,google:r.google||null};acPut(K_SES,AC.ses);AC.seq=0;AC.devs=null;
 const who=r.username||r.google||"account",owner=acGet(K_OWNER);
 const go=()=>{acPut(K_OWNER,who);syncNow()};
 if(owner&&owner!==who&&HIST.length){if(S.scr==="acct")render();modal(`<h3>Results from another account</h3><p>This device still has results saved from "${esc(owner)}". Add them to "${esc(who)}", or remove them from this device first?</p><button class="btn" data-a="own:merge">ADD TO THIS ACCOUNT</button><button class="btn w" data-a="own:drop" style="margin-bottom:0">REMOVE FROM THIS DEVICE</button>`);AC.pendingGo=go;return}
go();if(S.scr==="acct"&&!document.querySelector(".modal"))render()}
/* ---------- helpers for the screens ---------- */
const acAgo=t=>{const s=Math.max(0,Math.round((Date.now()-t)/1000));return s<60?"just now":s<3600?Math.round(s/60)+" min ago":s<86400?Math.round(s/3600)+" h ago":Math.round(s/86400)+" d ago"};
const fld=(id,label,type,extra)=>`<label class="fl" for="${id}">${label}</label><input class="fld" id="${id}" type="${type}" spellcheck="false" autocapitalize="none" autocorrect="off" ${extra||""}>`;
const pwFld=(id,label,auto)=>`<label class="fl" for="${id}">${label}<button type="button" class="lnk" data-a="showpw:${id}" style="float:right">SHOW</button></label><input class="fld" id="${id}" type="password" autocomplete="${auto}" spellcheck="false" autocapitalize="none">`;
const ferrBox=`<div class="ferr" id="ferr" role="alert"></div>`;
function ferr(m){const e=$("ferr");if(e){e.textContent=m||"";e.style.display=m?"block":"none"}else if(m)toast(m.slice(0,38))}
async function busy(btn,fn){const t=btn&&btn.textContent;if(btn){btn.disabled=true;btn.textContent="…"}ferr("");
 try{await fn()}catch(e){ferr(e.message)}finally{if(btn&&btn.isConnected){btn.disabled=false;btn.textContent=t}}}
function copyText(t){const done=()=>toast("COPIED");if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,()=>fallback())}else fallback();
 function fallback(){const a=document.createElement("textarea");a.value=t;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");done()}catch(e){toast("COPY FAILED")}a.remove()}}
/* ---------- screens ---------- */
const keyHtml=()=>`<div class="card kcard"><small>YOUR RECOVERY KEY</small><div class="kbox" id="kbox">${esc(AC.key)}</div>
 <p>If you ever forget your password or lose your phone, this key lets you back in. <b>It is shown only once.</b> Save it somewhere safe: a screenshot, a note, or send it to yourself.</p>
 <div class="krow"><button class="btn w" data-a="copykey">COPY</button>${navigator.share?'<button class="btn w" data-a="sharekey">SHARE</button>':""}</div>
 <div class="chk${AC.keyOk?" on":""}" data-a="keychk"><i></i><span>I have saved my recovery key</span></div></div>
 <div class="foot" style="padding:6px 0 0"><button class="btn${AC.keyOk?"":" off"}" data-a="keydone">DONE</button></div>`;
function acBody(){const v=AC.view,s=AC.ses;
 if(v==="key")return keyHtml();
 if(v==="signup")return `<form data-f="signup" class="fm"><p class="lead">Pick a username and a password. No email needed.</p>${fld("u","USERNAME","text",'autocomplete="username" maxlength="24"')}${pwFld("p","PASSWORD","new-password")}<div class="hint">Username: letters, numbers, dots and underscores. Password: at least 8 characters.</div>${ferrBox}<button class="btn" type="submit">CREATE ACCOUNT</button><button type="button" class="lnk c" data-a="acv:signin">ALREADY HAVE AN ACCOUNT? SIGN IN</button></form>`;
 if(v==="signin")return `<form data-f="signin" class="fm">${fld("u","USERNAME","text",'autocomplete="username"')}${pwFld("p","PASSWORD","current-password")}${ferrBox}<button class="btn" type="submit">SIGN IN</button>${AC.cfg&&AC.cfg.google&&!isNative()?'<div class="gwrap"><div id="gbtn"></div></div>':""}<button type="button" class="lnk c" data-a="acv:recover">FORGOT YOUR PASSWORD?</button><button type="button" class="lnk c" data-a="acv:usepair">USE A CODE FROM ANOTHER DEVICE</button><button type="button" class="lnk c" data-a="acv:signup">CREATE AN ACCOUNT</button></form>`;
 if(v==="recover")return `<form data-f="recover" class="fm"><p class="lead">Enter your username, the recovery key you saved when you signed up, and a new password.</p>${fld("u","USERNAME","text",'autocomplete="username"')}${fld("k","RECOVERY KEY","text",'placeholder="bako-tide-mura-selo-nipa-kuze"')}${pwFld("p","NEW PASSWORD","new-password")}${ferrBox}<button class="btn" type="submit">RESET PASSWORD</button><button type="button" class="lnk c" data-a="acv:signin">BACK TO SIGN IN</button></form>`;
 if(v==="usepair")return `<form data-f="usepair" class="fm"><p class="lead">On a device where you are already signed in, open Account and tap "Link a new device". Type the 6 digits it shows here.</p>${fld("c","6-DIGIT CODE","text",'inputmode="numeric" maxlength="7" autocomplete="one-time-code" style="text-align:center;font-size:28px;letter-spacing:.2em"')}${ferrBox}<button class="btn" type="submit">LINK THIS DEVICE</button><button type="button" class="lnk c" data-a="acv:signin">BACK TO SIGN IN</button></form>`;
 if(!s)return `<div class="card acin"><b>Keep your results safe</b><p>Create a free account to sync your results across your devices, and never lose them if you lose your phone. It is optional: Gradis works fine without one.</p></div>
  <button class="btn" data-a="acv:signup">CREATE ACCOUNT</button><button class="btn w" data-a="acv:signin">SIGN IN</button>
  ${AC.cfg&&AC.cfg.google&&!isNative()?'<div class="gwrap"><div id="gbtn"></div></div>':""}
  <button class="lnk c" data-a="acv:usepair">I HAVE A CODE FROM ANOTHER DEVICE</button><button class="lnk c" data-a="privacy">WHAT WE STORE</button>`;
 const st=AC.syncing?"Syncing…":AC.err?"Couldn't sync: "+AC.err:AC.last?"Synced "+acAgo(AC.last):"Not synced yet";
 const devs=AC.devs?AC.devs.map(d=>`<div class="card dev"><div><b>${esc(d.device)}${d.current?' <span class="chip b">THIS DEVICE</span>':""}</b><small>Last used ${acAgo(d.last)}</small></div>${d.current?"":`<button class="lnk" data-a="revoke:${esc(d.id)}">SIGN OUT</button>`}</div>`).join(""):`<div class="hint">Loading…</div>`;
 return `<div class="card acin"><div class="who"><div class="av">${esc((s.username||s.google||"?")[0].toUpperCase())}</div><div><b>${esc(s.username||s.google)}</b><small>${s.google&&s.username?"Google linked":s.google?"Signed in with Google":"Username account"}</small></div></div>
  <div class="sync"><span class="dot${AC.err?" er":AC.syncing?" sp":""}"></span><span>${esc(st)} · ${HIST.length} result${HIST.length===1?"":"s"}</span><button class="lnk" data-a="acsync">SYNC NOW</button></div></div>
  <div class="sec">LINK A NEW DEVICE</div><button class="btn w" data-a="pairnew">SHOW A 6-DIGIT CODE</button>
  <div class="sec">BACKUP</div>
  ${AC.cfg&&AC.cfg.google&&!isNative()?(s.google?`<div class="card dev"><div><b>Google</b><small>${esc(s.google)}</small></div><span class="chip y">LINKED</span></div>`:`<div class="hint">Link Google so you can sign in without a password.</div><div class="gwrap"><div id="gbtn"></div></div>`):""}
  ${s.username?`<button class="btn w" data-a="newkey">NEW RECOVERY KEY</button><button class="btn w" data-a="chpw">CHANGE PASSWORD</button>`:`<button class="btn w" data-a="addcred">ADD USERNAME & PASSWORD</button>`}
  <div class="sec">YOUR DEVICES</div>${devs}
  <div class="sec">ACCOUNT</div><button class="btn w" data-a="signout">SIGN OUT</button><button class="btn w" data-a="signoutall">SIGN OUT ALL DEVICES</button><button class="lnk c" data-a="privacy">WHAT WE STORE</button><button class="lnk c" data-a="acdelete" style="color:var(--cord)">DELETE MY ACCOUNT AND DATA</button>`}
SCR.acct=()=>{const t={key:"Save your key",signup:"Create account",signin:"Sign in",recover:"Reset password",usepair:"Link this device"}[AC.view]||"Account";
 return `<div class="scr"><div class="ph"><button class="iconb" data-a="acback" aria-label="Back">${icoB}</button><h2>${t}</h2></div><div class="body acbody">${acBody()}<div style="height:16px"></div></div></div>`};
function acPost(){ /* after the screen is drawn */
 if(AC.ses&&AC.view==="main"&&!AC.devs&&navigator.onLine)api("/api/devices").then(r=>{AC.devs=r.devices;if(S.scr==="acct"&&AC.view==="main"&&!document.querySelector(".modal"))render()}).catch(()=>{});
 const el=$("gbtn");if(!el||!AC.cfg||!AC.cfg.google||!navigator.onLine)return;
 const draw=()=>{try{google.accounts.id.initialize({client_id:AC.cfg.google,callback:x=>acGoogle(x.credential)});google.accounts.id.renderButton(el,{theme:"outline",size:"large",shape:"pill",text:"continue_with",width:280})}catch(e){}};
 if(window.google&&google.accounts)return draw();
 if(!AC.gis){AC.gis=new Promise((ok,no)=>{const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
 AC.gis.then(()=>{if($("gbtn")===el)draw()}).catch(()=>{AC.gis=null})}
async function acGoogle(credential){
 try{const r=await api("/api/google",{credential,device:devLabel()});
  if(r.linked){AC.ses.google=r.google;acPut(K_SES,AC.ses);toast("GOOGLE LINKED");if(S.scr==="acct")render()}else{AC.view="main";acEnter(r)}}catch(e){toast(e.message.slice(0,38))}}
/* ---------- actions ---------- */
const AC_KEYS=new Set(["account","acback","acv","showpw","copykey","sharekey","keychk","keydone","acsync","pairnew","pairclose","newkey","chpw","addcred","signout","signout1","signout2","signoutall","signoutall2","revoke","acdelete","privacy","own"]);
function acAction(k,v,el){if(!AC_KEYS.has(k))return false;
 switch(k){
 case"account":AC.view="main";AC.devs=null;if(S.scr!=="acct")AC.back=S.scr;closeModal();scr("acct");if(AC.ses)syncNow();return true;
 case"acback":if(AC.view==="key"&&!AC.keyOk){toast("TICK THE BOX WHEN YOU HAVE SAVED IT");return true}
  if(AC.view!=="main"&&AC.view!=="key"){AC.view="main";render();return true}
  AC.view="main";{const b=["home","hist","subjects"].includes(AC.back)?AC.back:"home";S.tab=b==="hist"?"results":b;scr(b)}return true;
 case"acv":AC.view=v;render();return true;
 case"showpw":{const i=$(v);if(i){const t=i.type==="password";i.type=t?"text":"password";el.textContent=t?"HIDE":"SHOW"}return true}
 case"copykey":copyText(AC.key);return true;
 case"sharekey":navigator.share({title:"Gradis recovery key",text:"My Gradis recovery key: "+AC.key}).catch(()=>{});return true;
 case"keychk":AC.keyOk=!AC.keyOk;document.querySelector(".chk").classList.toggle("on",AC.keyOk);document.querySelector('[data-a="keydone"]').classList.toggle("off",!AC.keyOk);return true;
 case"keydone":if(!AC.keyOk)return true;AC.key=null;AC.keyOk=false;AC.view="main";AC.devs=null;closeModal();scr("acct");return true;
 case"acsync":if(!navigator.onLine){toast("YOU ARE OFFLINE");return true}syncNow();render();return true;
 case"pairnew":busy(el,async()=>{const r=await api("/api/pair/new",{});AC.pair={code:r.code,exp:Date.now()+r.seconds*1000};
   modal(`<h3>Link a new device</h3><p>On the other device, open Gradis, tap Account → Sign in → "Use a code from another device", and type:</p><div class="pcode" id="pcode">${r.code.slice(0,3)} ${r.code.slice(3)}</div><p id="pleft" style="margin-top:0">Expires in 5:00</p><button class="btn w" data-a="pairclose" style="margin-bottom:0">DONE</button>`);
   const tm=setInterval(()=>{const e=$("pleft");if(!e){clearInterval(tm);return}const s=Math.max(0,Math.round((AC.pair.exp-Date.now())/1000));e.textContent=s?"Expires in "+Math.floor(s/60)+":"+String(s%60).padStart(2,"0"):"Expired. Close this and make a new one.";if(!s){clearInterval(tm);const c=$("pcode");if(c)c.style.opacity=.3}},1000)});return true;
 case"pairclose":AC.pair=null;closeModal();return true;
 case"newkey":modal(`<h3>New recovery key</h3><p>The old key will stop working. Enter your password to make a new one.</p><form data-f="newkey" class="fm">${pwFld("p","PASSWORD","current-password")}${ferrBox}<button class="btn" type="submit">MAKE NEW KEY</button><button type="button" class="btn w" data-a="pairclose" style="margin-bottom:0">CANCEL</button></form>`);return true;
 case"chpw":modal(`<h3>Change password</h3><p>Your other devices will be signed out.</p><form data-f="chpw" class="fm">${pwFld("o","CURRENT PASSWORD","current-password")}${pwFld("p","NEW PASSWORD","new-password")}${ferrBox}<button class="btn" type="submit">CHANGE PASSWORD</button><button type="button" class="btn w" data-a="pairclose" style="margin-bottom:0">CANCEL</button></form>`);return true;
 case"addcred":modal(`<h3>Add a username</h3><p>Then you can sign in with a username and password too, and get a recovery key.</p><form data-f="addcred" class="fm">${fld("u","USERNAME","text",'autocomplete="username" maxlength="24"')}${pwFld("p","PASSWORD","new-password")}${ferrBox}<button class="btn" type="submit">SAVE</button><button type="button" class="btn w" data-a="pairclose" style="margin-bottom:0">CANCEL</button></form>`);return true;
 case"signout":modal(`<h3>Sign out?</h3><p>Your results can stay on this device, or be removed from it. They remain safe in your account either way.</p><button class="btn" data-a="signout1">SIGN OUT, KEEP RESULTS HERE</button><button class="btn w" data-a="signout2">SIGN OUT AND REMOVE RESULTS</button><button class="btn w" data-a="pairclose" style="margin-bottom:0">CANCEL</button>`);return true;
 case"signout1":case"signout2":{const rm=k==="signout2";api("/api/signout",{}).catch(()=>{});AC.ses=null;AC.devs=null;acPut(K_SES,null);AC.seq=0;
  if(rm){HIST=[];saveHist();clearRun();acPut(K_OWNER,null)}else{HIST.forEach(h=>delete h.sy);saveHist()}
  closeModal();AC.view="main";toast("SIGNED OUT");render();return true}
 case"signoutall":modal(`<h3>Sign out everywhere?</h3><p>Every device, including this one, will need to sign in again.</p><button class="btn" data-a="signoutall2">SIGN OUT ALL DEVICES</button><button class="btn w" data-a="pairclose" style="margin-bottom:0">CANCEL</button>`);return true;
 case"signoutall2":busy(el,async()=>{await api("/api/signout-all",{});AC.ses=null;AC.devs=null;acPut(K_SES,null);AC.seq=0;HIST.forEach(h=>delete h.sy);saveHist();closeModal();AC.view="main";toast("SIGNED OUT");render()});return true;
 case"revoke":api("/api/devices/revoke",{id:v}).then(()=>{AC.devs=null;render()}).catch(e=>toast(e.message.slice(0,38)));return true;
 case"acdelete":modal(`<h3>Delete your account?</h3><p>This permanently deletes your account and all your synced results from our server. Results saved on this device stay here.</p><form data-f="delete" class="fm">${AC.ses&&AC.ses.username?pwFld("p","PASSWORD","current-password"):""}${fld("c","TYPE DELETE TO CONFIRM","text",'autocomplete="off"')}${ferrBox}<button class="btn" type="submit" style="background:var(--cor);box-shadow:1px 1px 0 var(--cord),2px 2px 0 var(--cord),3px 3px 0 var(--cord),4px 4px 0 var(--cord)">DELETE EVERYTHING</button><button type="button" class="btn w" data-a="pairclose" style="margin-bottom:0">CANCEL</button></form>`);return true;
 case"privacy":modal(`<h3>What we store</h3><p style="text-align:left">Without an account, nothing leaves your device.<br><br>With an account we keep: your username (and Google email if you link Google), a scrambled version of your password (never the password itself), and your quiz results so they can sync. We do not sell your data or share it with anyone.<br><br>You can delete your account and all synced data any time from Account.</p><button class="btn w" data-a="pairclose" style="margin-bottom:0">CLOSE</button>`);return true;
 case"own":{const go=AC.pendingGo;AC.pendingGo=null;closeModal();if(v==="drop"){HIST=[];saveHist();clearRun()}else{HIST.forEach(h=>delete h.sy);saveHist()}if(go)go();if(S.scr==="acct")render();return true}
 }return false}
/* forms (also lets the browser offer to save the password) */
document.addEventListener("submit",e=>{const f=e.target.closest&&e.target.closest("form[data-f]");if(!f)return;e.preventDefault();
 const v=id=>{const i=f.querySelector("#"+id);return i?i.value:""},btn=f.querySelector('button[type="submit"]'),dev=devLabel();
 switch(f.dataset.f){
 case"signup":return busy(btn,async()=>{const r=await api("/api/signup",{username:v("u"),password:v("p"),device:dev});AC.key=r.recovery;AC.keyOk=false;AC.view="key";acEnter(r)});
 case"signin":return busy(btn,async()=>{const r=await api("/api/login",{username:v("u"),password:v("p"),device:dev});AC.view="main";acEnter(r)});
 case"recover":return busy(btn,async()=>{const r=await api("/api/recover",{username:v("u"),key:v("k"),password:v("p"),device:dev});AC.key=r.recovery;AC.keyOk=false;AC.view="key";acEnter(r)});
 case"usepair":return busy(btn,async()=>{const r=await api("/api/pair/use",{code:v("c"),device:dev});AC.view="main";acEnter(r)});
 case"chpw":return busy(btn,async()=>{await api("/api/password",{old:v("o"),password:v("p")});closeModal();toast("PASSWORD CHANGED");AC.devs=null;render()});
 case"newkey":return busy(btn,async()=>{const r=await api("/api/recovery-new",{password:v("p")});closeModal();AC.key=r.recovery;AC.keyOk=false;AC.view="key";render()});
 case"addcred":return busy(btn,async()=>{const r=await api("/api/credentials",{username:v("u"),password:v("p")});AC.ses.username=r.username;acPut(K_SES,AC.ses);closeModal();AC.key=r.recovery;AC.keyOk=false;AC.view="key";render()});
 case"delete":return busy(btn,async()=>{await api("/api/delete",{confirm:v("c").trim(),password:v("p")});AC.ses=null;AC.devs=null;acPut(K_SES,null);acPut(K_OWNER,null);AC.seq=0;HIST.forEach(h=>delete h.sy);saveHist();closeModal();AC.view="main";toast("ACCOUNT DELETED");render()});
 }});
addEventListener("online",()=>{syncNow()});
