/* ---------- events ---------- */
document.addEventListener("scroll",e=>{const t=e.target;if(t.id==="slr"){const i=Math.round(t.scrollLeft/(t.firstElementChild.offsetWidth+12));document.querySelectorAll("#dts i").forEach((d,k)=>d.classList.toggle("on",k===i))}},true);
function bind(){const g=$("gi");if(g)requestAnimationFrame(()=>{const R=S.run,m=R.qz.questions.length*2;g.style.left=Math.max(0,Math.min(100,(R.cal+m)/(2*m)*100))+"%"})}
function save(){const b=document.querySelector(".body");if(b)S.run.keepScroll=b.scrollTop}
document.addEventListener("input",e=>{if(e.target.id==="sq"){S.q=e.target.value;$("sl").innerHTML=subRows();return}const R=S.run;if(!R||S.scr!=="q")return;const q=curQ(),t=e.target;
 if(t.dataset.gap!=null)R.ans[R.i][+t.dataset.gap]=t.value;else if(t.id==="sh")R.ans[R.i]=t.value;else if(t.id==="nv")R.ans[R.i].v=t.value;else if(t.id==="nu")R.ans[R.i].u=t.value;else if(t.dataset.g!=null)R.ans[R.i][t.dataset.g]=t.value;else if(t.dataset.st!=null)R.ans[R.i].x[+t.dataset.st]=t.value;
 refreshBtn()});
document.addEventListener("change",e=>{const R=S.run;if(R&&S.scr==="q"&&e.target.dataset.g!=null){R.ans[R.i][e.target.dataset.g]=e.target.value;refreshBtn()}});
function refreshBtn(){const R=S.run,q=curQ(),b=$("main");if(!b)return;const conf=R.qz.confidence&&R.mode!=="study";b.classList.toggle("off",!(answered(q,R.ans[R.i])&&(!conf||R.conf[R.i]!=null)))}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const [k,...r]=b.dataset.a.split(":"),v=r.join(":"),R=S.run;
 switch(k){
 case"toast":return toast(v);
 case"home":S.tab="home";return scr("home");
 case"tab":S.tab=v;return scr(v==="results"?"hist":v);
 case"subjgo":{const j=v.lastIndexOf(":"),n=v.slice(0,j),f=v.slice(j+1);S.subj=n;S.from=f;return scr("list")}
 case"quizgo":{const j=v.lastIndexOf(":"),n=v.slice(0,j),i=v.slice(j+1);S.subj=n;S.from="home";S.quiz=DATA[n][+i];S.mode="practice";return scr("landing")}
 case"backlist":S.tab=S.from;return scr(S.from==="subjects"?"subjects":"home");
 case"dtab":S.dash=v;$("dash").innerHTML=dashHtml();return;
 case"rsub":S.rsub=v;return scr("subres");
 case"backres":S.tab="results";return scr("hist");
 case"flt":S.flt=v;return scr("subjects");
 case"back-list":return scr("list");
 case"quiz":S.quiz=DATA[S.subj][+v];S.mode=S.quiz.confidence?"practice":"practice";return scr("landing");
 case"landing":return scr("landing");
 case"resume":return resumeRun();
 case"mode":S.mode=v;return scr("landing");
 case"start":return startRun();
 case"quit":return quitModal();
 case"keep":closeModal();return;
 case"settings":return settingsModal();
 case"export":if(!HIST.length){toast("NO RESULTS YET");return}exportResults();toast("RESULTS EXPORTED");return;
 case"clear":return modal(`<h3>Delete all results?</h3><p>This removes your scores and history from this device. It can't be undone.</p><button class="btn" data-a="clear2" style="background:var(--cor);box-shadow:1px 1px 0 var(--cord),2px 2px 0 var(--cord),3px 3px 0 var(--cord),4px 4px 0 var(--cord)">DELETE</button><button class="btn w" data-a="keep" style="margin-bottom:0">CANCEL</button>`);
 case"clear2":HIST=[];saveHist();clearRun();closeModal();S.tab="home";return scr("home");
 case"install":if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}closeModal();return;
 case"reload":return applyUpdate();
 case"retry":return boot();
 case"leave":clearInterval(S.tm);clearRun();return scr("landing");
 case"result":return scr("result");
 case"review":return scr("review");
 case"rev":scr("review");const el=$("rv"+v);if(el)el.scrollIntoView();return;
 }
 if(!R||S.scr!=="q")return;if(R.checked||R.mode==="study"){if(k==="main"){return mainAct()}if(k!=="hint")return}
 const q=curQ(),a=R.ans[R.i];save();
 switch(k){
 case"main":return mainAct();
 case"hint":R.hint=true;return renderQ();
 case"conf":R.conf[R.i]=+v;return renderQ();
 case"pick":R.ans[R.i]=+v;break;
 case"tog":{const i=+v,s=a.indexOf(i);s>=0?a.splice(s,1):a.push(i);break}
 case"tf":R.ans[R.i]=v==="true";break;
 case"as":R.ans[R.i]=v;break;
 case"ml":{const i=+v;if(a[i]!=null){delete a[i];R.ui.l=null}else R.ui.l=i;break}
 case"mr":{const ri=+v,ex=Object.keys(a).find(l=>a[l]===ri);if(ex!=null){delete a[ex];break}if(R.ui.l==null){toast("TAP A TERM FIRST");return}a[R.ui.l]=ri;R.ui.l=null;break}
 case"up":case"dn":{const p=+v,t=k==="up"?p-1:p+1;if(t<0||t>=a.length)return;[a[p],a[t]]=[a[t],a[p]];break}
 case"lab":R.ui.l=R.ui.l===v?null:v;if(R.ui.l&&R.ui.t!=null){a[R.ui.t]=v;R.ui.l=null;R.ui.t=null}break;
 case"dot":{const i=+v;if(a[i]){delete a[i];break}if(R.ui.l){Object.keys(a).forEach(x=>{if(a[x]===R.ui.l)delete a[x]});a[i]=R.ui.l;R.ui.l=null}else{R.ui.t=R.ui.t===i?null:i;toast("NOW PICK A LABEL")}break}
 case"scheme":a.show=true;break;
 case"tick":{const[i,kk]=v.split(":").map(Number);a.t[i][kk]=!a.t[i][kk];break}
 default:return}
 renderQ()});
function quitModal(){const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="card"><h3>Leave this quiz?</h3><p>Your progress in this attempt will be lost.</p><button class="btn" data-a="keep">KEEP GOING</button><button class="btn w" data-a="leave" style="margin-bottom:0">LEAVE QUIZ</button></div>`;$("st").appendChild(m)}
/* drag to reorder */
let drag=null;
document.addEventListener("pointerdown",e=>{const h=e.target.closest("[data-h]");if(!h||S.scr!=="q")return;const R=S.run;drag={pos:+h.dataset.h};e.preventDefault();redrawOrd()});
function redrawOrd(){const R=S.run,q=curQ();$("ol").innerHTML=ordHtml(q,R.ans[R.i],false,drag?drag.pos:-1)}
document.addEventListener("pointermove",e=>{if(!drag)return;const R=S.run,a=R.ans[R.i],rows=[...document.querySelectorAll("#ol .ord")];const y=e.clientY;let t=drag.pos;rows.forEach((r,i)=>{const b=r.getBoundingClientRect();if(y>=b.top&&y<=b.bottom)t=i});if(t!==drag.pos){const [it]=a.splice(drag.pos,1);a.splice(t,0,it);drag.pos=t;redrawOrd()}});
["pointerup","pointercancel"].forEach(ev=>document.addEventListener(ev,()=>{if(drag){drag=null;redrawOrd()}}));
function settingsModal(){modal(`<h3>Settings</h3><p>Gradis ${APP_VERSION} · ${navigator.onLine?"online":"offline"}${HIST.length?" · "+HIST.length+" result"+(HIST.length>1?"s":"")+" saved":""}</p>${deferredPrompt?'<button class="btn" data-a="install">INSTALL APP</button>':""}<button class="btn w" data-a="export">EXPORT RESULTS</button><button class="btn w" data-a="clear">CLEAR RESULTS</button><button class="btn w" data-a="keep" style="margin-bottom:0">CLOSE</button>`)}
