let deferredPrompt=null;
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e});
function fit(){const iw=innerWidth,ih=innerHeight,st=$("st");let W,H,k,x=0,y=0;
 if(iw/0.9<540){k=0.9;W=iw/k;H=ih/k}            /* phones: fill the screen */
 else{W=540;H=960;k=Math.min(iw/540,ih/960);x=(iw-540*k)/2;y=(ih-960*k)/2}   /* wide screens: centred phone-shaped column */
 st.style.width=W+"px";st.style.height=H+"px";st.style.transform=`translate(${x}px,${y}px) scale(${k})`;
 const p=document.createElement("div");p.style.cssText="position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)";document.body.appendChild(p);
 const cs=getComputedStyle(p),root=document.documentElement.style;root.setProperty("--sat",(parseFloat(cs.paddingTop)||0)/k+"px");root.setProperty("--sab",(parseFloat(cs.paddingBottom)||0)/k+"px");p.remove()}
function applyUpdate(){closeModal();const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="card" style="display:grid;justify-items:center;gap:18px;padding:34px 20px"><b>Updating…</b>${loaderHtml()}</div>`;$("st").appendChild(m);
 navigator.serviceWorker.getRegistration().then(r=>{if(r&&r.waiting)r.waiting.postMessage("skip");setTimeout(()=>location.reload(),1200)})}
function registerSW(){if(!("serviceWorker" in navigator)||isNative())return;   /* the Android app already carries all its files */
 navigator.serviceWorker.register("sw.js").then(reg=>{
  const offer=()=>modal(`<h3>New version ready</h3><p>Reload to get the latest Gradis. Your results are kept.</p><button class="btn" data-a="reload">RELOAD</button><button class="btn w" data-a="keep" style="margin-bottom:0">LATER</button>`);
  if(reg.waiting&&navigator.serviceWorker.controller)offer();
  reg.addEventListener("updatefound",()=>{const nw=reg.installing;if(nw)nw.addEventListener("statechange",()=>{if(nw.state==="installed"&&navigator.serviceWorker.controller)offer()})})
 }).catch(e=>console.warn("service worker not registered",e))}
/* Opening: badge pops in, then the letters arrive from the right and settle next to it; the loader square spins until the quizzes are ready. */
async function boot(){
 fit();
 const t0=performance.now(),quick=calm();let err=null;
 $("app").innerHTML=`<div class="scr splash"><div class="spl-in">${LOGO.full()}</div><div class="spl-ld">${loaderHtml()}</div></div>`;S.shown="boot";
 try{await loadAll()}catch(e){err=e}
 const left=(quick?200:2500)-(performance.now()-t0);if(left>0)await new Promise(r=>setTimeout(r,left));
 if(err){S.err=err;return scr("error")}
 loadHist();acInit();
 if(S.warn)setTimeout(()=>toast(S.warn+" QUESTION"+(S.warn>1?"S":"")+" SKIPPED · SEE CONSOLE"),600);
 render();registerSW();Ads.init()}
/* Android back button: close a dialog, step back one screen, or leave the app from Home */
function goBack(){
 if(document.querySelector(".modal")){closeModal();return true}
 if(S.scr==="q"){quitModal();return true}
 const b=document.querySelector('[data-a="backlist"],[data-a="back-list"],[data-a="backres"],[data-a="acback"],[data-a="bookback"]');if(b){b.click();return true}
 if(S.scr==="review"){scr("result");return true}
 if(["result","done","subjects","hist","subres","list","landing","error"].includes(S.scr)){S.tab="home";scr("home");return true}
 return false}
function nativeBack(){const A=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App;if(!isNative()||!A)return;A.addListener("backButton",()=>{if(!goBack())A.exitApp()})}
nativeBack();
addEventListener("resize",fit);
addEventListener("online",()=>{});
boot();
