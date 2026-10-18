/* One ad after a finished quiz. Website/web app: an AdSense display ad on the results screen. Android app: an AdMob full-screen ad.
   Any failure is silent: an ad can never block the results. */
const Ads=(()=>{
 const C=window.ADS_CONFIG||{},K="gradis.ads";let ready=false,started=false,last=0;
 const P=()=>{const c=window.Capacitor;return c&&c.Plugins&&c.Plugins.AdMob};
 const get=()=>{try{return JSON.parse(localStorage.getItem(K))||{n:0}}catch(e){return{n:0}}};
 const put=o=>{try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}};
 const usable=()=>!!(C.enabled&&typeof isNative==="function"&&isNative()&&P());
 async function load(){const a=P();if(!a)return;ready=false;try{await a.prepareInterstitial({adId:C.interstitialId,isTesting:!!C.testMode});ready=true}catch(e){ready=false}}
 async function init(){
  if(started||!usable())return;started=true;const a=P();
  try{
   await a.initialize({initializeForTesting:!!C.testMode,tagForChildDirectedTreatment:!!C.childDirected,tagForUnderAgeOfConsent:!!C.childDirected,maxAdContentRating:C.maxRating||"G"});
   try{const i=await a.requestConsentInfo();if(i&&i.isConsentFormAvailable&&i.status==="REQUIRED")await a.showConsentForm()}catch(e){}
   try{a.addListener("interstitialAdDismissed",()=>load());a.addListener("interstitialAdFailedToLoad",()=>{ready=false})}catch(e){}
   await load()
  }catch(e){started=false}}
 /* ---- website / installed web app: AdSense ---- */
 let adJs=null;
 const loadAdJs=W=>adJs||(adJs=new Promise((ok,bad)=>{const s=document.createElement("script");s.async=true;s.crossOrigin="anonymous";s.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(W.client);s.onload=ok;s.onerror=()=>{adJs=null;bad()};document.head.appendChild(s)}));
 function webAd(mode){
  const W=C.web||{};if(!W.enabled||!W.client||!W.slot||mode==="study"||!navigator.onLine)return;
  const s=get();s.w=(s.w||0)+1;put(s);if(s.w%(W.every||1)!==0)return;
  loadAdJs(W).then(()=>{const box=document.getElementById("adbox");if(!box||S.scr!=="result")return;
   box.innerHTML=`<div class="adlab">ADVERTISEMENT</div><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(W.client)}" data-ad-slot="${esc(W.slot)}" data-ad-format="auto" data-full-width-responsive="true" data-tag-for-age-treatment="${+W.ageTreatment||0}"></ins>`;
   try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){box.innerHTML=""}}).catch(()=>{})}
 function afterQuiz(mode){
  if(typeof isNative==="function"&&!isNative())return webAd(mode);
  if(!usable()||mode==="study")return;
  const s=get();s.n=(s.n||0)+1;put(s);
  const k=s.n-(C.skipFirst||0);if(k<1||k%(C.every||2)!==0)return;
  if(Date.now()-last<(C.minGapSec??180)*1000||!ready)return;
  setTimeout(()=>{if(S.scr!=="result")return;last=Date.now();ready=false;P().showInterstitial().catch(()=>{})},900)}
 return{init,afterQuiz}})();
