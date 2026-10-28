/* ---------- events ---------- */
document.addEventListener("scroll",e=>{const t=e.target;if(t.id==="slr"){const i=Math.round(t.scrollLeft/(t.firstElementChild.offsetWidth+12));document.querySelectorAll("#dts i").forEach((d,k)=>d.classList.toggle("on",k===i))}},true);
document.addEventListener("scroll",e=>{const t=e.target;if(t.classList&&t.classList.contains("tk")){const i=Math.round(t.scrollLeft/t.clientWidth);t.parentNode.querySelectorAll(".tkd i").forEach((d,k)=>d.classList.toggle("on",k===i))}},true);
function ddShut(d){d.classList.remove("open");const b=d.querySelector(".ddb");if(b)b.setAttribute("aria-expanded","false")}
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.classList&&e.target.classList.contains("gap")){e.preventDefault();const g=[...document.querySelectorAll(".gap")],i=g.indexOf(e.target);if(g[i+1])g[i+1].focus();else e.target.blur()}if(e.key==="Escape")document.querySelectorAll(".dd.open").forEach(ddShut)});
function syncRail(){document.querySelectorAll(".cpl").forEach(p=>p.classList.toggle("on",!!document.querySelector('.qg[data-gi="'+p.dataset.gi+'"].open')))}
function bind(){const g=$("gi");if(g)requestAnimationFrame(()=>{const R=S.run,m=R.qz.questions.length*2;g.style.left=Math.max(0,Math.min(100,(R.cal+m)/(2*m)*100))+"%"});
 document.querySelectorAll("[data-cu]").forEach(el=>{const to=+el.dataset.cu,d=+el.dataset.d||0;if(calm()||!isFinite(to))return;const t0=performance.now()+300,D=900;el.textContent=(0).toFixed(d);const f=now=>{const k=Math.max(0,Math.min(1,(now-t0)/D)),v=1-Math.pow(1-k,3);el.textContent=(to*v).toFixed(d);if(k<1&&document.contains(el))requestAnimationFrame(f)};requestAnimationFrame(f)})}
function save(){const b=document.querySelector(".body");if(b)S.run.keepScroll=b.scrollTop}
document.addEventListener("input",e=>{if(e.target.id==="sq"){S.q=e.target.value;$("sl").innerHTML=subRows();return}const R=S.run;if(!R||S.scr!=="q")return;const q=curQ(),t=e.target;
 if(t.dataset.gap!=null){R.ans[R.i][+t.dataset.gap]=t.value;t.classList.toggle("has",!!t.value);t.style.width=gapW(t.value)+"px"}else if(t.id==="sh")R.ans[R.i]=t.value;else if(t.id==="nv")R.ans[R.i].v=t.value;else if(t.id==="nu")R.ans[R.i].u=t.value;else if(t.dataset.g!=null)R.ans[R.i][t.dataset.g]=t.value;else if(t.dataset.st!=null)R.ans[R.i].x[+t.dataset.st]=t.value;else if(t.dataset.fc!=null)R.ans[R.i].text[t.dataset.fc]=t.value;else if(t.dataset.bf!=null)R.ans[R.i].f=t.value;else if(t.dataset.mt!=null){mathInput(t,R.ans[R.i]);return}
 refreshBtn()});
/* tapping the text box of a node that also asks for its shape selects that node's slot, so the next shape tapped lands there */
document.addEventListener("focusin",e=>{const t=e.target,R=S.run;if(!R||S.scr!=="q"||R.checked||t.dataset.fc==null)return;const q=curQ(),n=q.nodes.find(x=>x.id===t.dataset.fc);if(!n||!fcAsk(n).includes("shape"))return;R.ui.n=n.id;document.querySelectorAll(".fn.sel").forEach(x=>x.classList.remove("sel"));t.closest(".fn").classList.add("sel")});
document.addEventListener("change",e=>{const R=S.run;if(R&&S.scr==="q"&&e.target.dataset.g!=null){R.ans[R.i][e.target.dataset.g]=e.target.value;refreshBtn()}});
function refreshBtn(){const R=S.run,q=curQ(),b=$("main");if(!b)return;const conf=R.qz.confidence&&R.mode!=="study";b.classList.toggle("off",!(answered(q,R.ans[R.i])&&(!conf||R.conf[R.i]!=null)))}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const [k,...r]=b.dataset.a.split(":"),v=r.join(":"),R=S.run;
 if(typeof acAction==="function"&&acAction(k,v,b))return;
 switch(k){
 case"toast":return toast(v);
 case"tkflip":{const t=b.querySelector(".tk"),n=t.children.length,i=Math.round(t.scrollLeft/t.clientWidth);t.scrollTo({left:((i+1)%n)*t.clientWidth,behavior:calm()?"auto":"smooth"});return}
 case"dot":{const[id,s,i]=v.split(":"),c=CH[id];if(!c)return;const p=(s==="c"?c.cur:c.prev)[+i],el=$("cd-"+id);if(!p||!el)return;el.textContent=(s==="p"?(c.pl||"Before")+" · ":"")+p.t;const svg=b.closest("svg");if(svg)svg.querySelectorAll(".dtp.sel").forEach(x=>x.classList.remove("sel"));const d=$("dt-"+id+"-"+s+"-"+i);if(d)d.classList.add("sel");return}
 case"home":S.tab="home";return scr("home");
 case"tab":S.tab=v;return scr(v==="results"?"hist":v);
 case"subjgo":{const j=v.lastIndexOf(":"),n=v.slice(0,j),f=v.slice(j+1);S.subj=n;S.from=f;return scr("list")}
 case"quizgo":{const j=v.lastIndexOf(":"),n=v.slice(0,j),i=v.slice(j+1);S.subj=n;S.from="home";S.quiz=DATA[n][+i];S.mode="practice";return scr("landing")}
 case"backlist":S.tab=S.from;return scr(S.from==="subjects"?"subjects":"home");
 case"dtab":S.dash=v;$("dash").innerHTML=dashHtml();return;
 case"rsub":S.rsub=v;return scr("subres");
 case"backres":S.tab="results";return scr("hist");
 case"flt":S.flt=v;return scr("subjects");
 case"grp":{const key=S.subj+"|"+v,el=b.closest(".qg"),o=!el.classList.contains("open");S.open=S.open||{};S.open[key]=o;el.classList.toggle("open",o);b.setAttribute("aria-expanded",o);syncRail();return}
 case"chj":{const key=S.subj+"|";S.open=S.open||{};document.querySelectorAll(".qg").forEach(el=>{const on=el.dataset.gi===v;el.classList.toggle("open",on);S.open[key+el.dataset.gi]=on;const h=el.querySelector(".qg-h");if(h)h.setAttribute("aria-expanded",on)});syncRail();const tg=document.querySelector('.qg[data-gi="'+v+'"]');setTimeout(()=>{if(tg)tg.scrollIntoView({block:"start",behavior:calm()?"auto":"smooth"})},calm()?0:340);return}
 case"back-list":return scr("list");
 case"quiz":S.quiz=DATA[S.subj][+v];S.mode=S.quiz.confidence?"practice":"practice";return scr("landing");
 case"landing":return scr("landing");
 case"resume":return resumeRun();
 case"notes":return notesModal();
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
 case"ddt":{const dd=b.closest(".dd");document.querySelectorAll(".dd.open").forEach(x=>{if(x!==dd)ddShut(x)});const o=!dd.classList.contains("open");dd.classList.toggle("open",o);b.setAttribute("aria-expanded",o);if(o)setTimeout(()=>dd.scrollIntoView({block:"nearest",behavior:calm()?"auto":"smooth"}),calm()?0:260);return}
 case"ddp":{const j=v.indexOf(":"),key=v.slice(0,j),val=v.slice(j+1),dd=b.closest(".dd");a[key]=val;dd.querySelector(".ddv").textContent=val||"–";dd.querySelectorAll(".ddo").forEach(x=>x.classList.toggle("on",x===b&&!!val));ddShut(dd);dd.classList.add("ddpick");setTimeout(()=>dd.classList.remove("ddpick"),400);refreshBtn();return}
 case"hint":R.sx=null;R.hint=true;return renderQ();
 case"conf":R.sx=null;R.conf[R.i]=+v;return renderQ();
 case"pick":R.ans[R.i]=+v;R.sx={i:R.i,v:+v};break;
 case"tog":{const i=+v,s=a.indexOf(i);s>=0?a.splice(s,1):a.push(i);R.sx={i:R.i,v:i};break}
 case"tf":R.ans[R.i]=v==="true";R.sx={i:R.i,v:v==="true"};break;
 case"as":R.ans[R.i]=v;R.sx={i:R.i,v};break;
 case"ml":{const i=+v;if(a[i]!=null){delete a[i];R.ui.l=null}else R.ui.l=i;break}
 case"mr":{const ri=+v,ex=Object.keys(a).find(l=>a[l]===ri);if(ex!=null){delete a[ex];break}if(R.ui.l==null){toast("TAP A TERM FIRST");return}R.mx={l:R.ui.l,s:0};R.sx={i:R.i,v:R.ui.l};a[R.ui.l]=ri;R.ui.l=null;break}
 case"up":case"dn":{const p=+v,t=k==="up"?p-1:p+1;if(t<0||t>=a.length)return;ORDP=ordRects();[a[p],a[t]]=[a[t],a[p]];buzz(6);break}
 case"lab":R.ui.l=R.ui.l===v?null:v;if(R.ui.l&&R.ui.t!=null){a[R.ui.t]=v;R.sx={i:R.i,v:R.ui.t};R.ui.l=null;R.ui.t=null}break;
 case"dot":{const i=+v;if(a[i]){delete a[i];break}if(R.ui.l){Object.keys(a).forEach(x=>{if(a[x]===R.ui.l)delete a[x]});a[i]=R.ui.l;R.sx={i:R.i,v:i};R.ui.l=null}else{R.ui.t=R.ui.t===i?null:i;toast("NOW PICK A LABEL")}break}
 case"cb":{const i=+v;R.sx={i:R.i,v:R.ui.g!=null?"g"+R.ui.g:"b"+i};if(R.ui.g!=null){Object.keys(a).forEach(x=>{if(a[x]===i)delete a[x]});a[R.ui.g]=i;R.ui.g=null;R.ui.b=null}else R.ui.b=R.ui.b===i?null:i;break}
 case"cg":{const i=+v;if(a[i]!=null){delete a[i];break}if(R.ui.b!=null){a[i]=R.ui.b;R.sx={i:R.i,v:"g"+i};R.ui.b=null}else{R.ui.g=R.ui.g===i?null:i;toast("NOW PICK A BLOCK")}break}
 case"fcn":{if(a.shapes[v]){delete a.shapes[v];break}R.ui.n=R.ui.n===v?null:v;break}
 case"fcs":{let id=R.ui.n;if(!id){const f=q.nodes.filter(n=>fcAsk(n).includes("shape")&&!a.shapes[n.id]);if(f.length===1)id=f[0].id}if(!id){toast("TAP A DASHED SLOT FIRST");return}a.shapes[id]=v;R.sx={i:R.i,v:"n"+id};R.ui.n=null;break}
 case"mk":mathKey(v,a);return;
 case"prev":return prev();
 case"bl":{const n=+v;R.sx={i:R.i,v:"l"+n};if(q.type==="bugfix"||q.type==="stepfix")a.l=a.l===n?null:n;else{const s=a.indexOf(n);if(s>=0)a.splice(s,1);else{if(q.bugs.length===1)a.length=0;a.push(n)}}break}
 case"bf":a.f=+v;R.sx={i:R.i,v:"f"+v};break;
 case"scheme":a.show=true;break;
 case"tick":{const[i,kk]=v.split(":").map(Number);a.t[i][kk]=!a.t[i][kk];break}
 default:return}
 renderQ()});
function quitModal(){const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="card"><h3>Leave this quiz?</h3><p>Your progress in this attempt will be lost.</p><button class="btn" data-a="keep">KEEP GOING</button><button class="btn w" data-a="leave" style="margin-bottom:0">LEAVE QUIZ</button></div>`;$("st").appendChild(m)}
/* drag to reorder: rows glide to their new places (FLIP), the lifted row follows the finger and settles with a spring when dropped */
let drag=null,ORDP=null;
const stk=()=>{const s=$("st");return s.getBoundingClientRect().width/s.offsetWidth||1};
const buzz=n=>{try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
function ordRects(){const m={};document.querySelectorAll("#ol .ord").forEach(r=>{m[r.dataset.it]=r.getBoundingClientRect().top});return m}
function ordFlip(){const P=ORDP;ORDP=null;if(!P||calm())return;const k=stk(),rows=[...document.querySelectorAll("#ol .ord")];
 rows.forEach(r=>{if(r.classList.contains("drag"))return;const d=(P[r.dataset.it]-r.getBoundingClientRect().top)/k;if(!d)return;r.style.transition="none";r.style.transform=`translateY(${d}px)`});
 void document.body.offsetHeight;
 rows.forEach(r=>{if(!r.style.transform)return;r.style.transition="transform .32s cubic-bezier(.34,1.4,.64,1)";r.style.transform="";setTimeout(()=>{r.style.transition=""},360)})}
document.addEventListener("pointerdown",e=>{const h=e.target.closest("[data-h]");if(!h||S.scr!=="q")return;drag={pos:+h.dataset.h};e.preventDefault();buzz(8);redrawOrd()});
function redrawOrd(){const R=S.run,q=curQ();ORDP=ordRects();$("ol").innerHTML=ordHtml(q,R.ans[R.i],false,drag?drag.pos:-1);ordFlip()}
document.addEventListener("pointermove",e=>{if(!drag)return;const R=S.run,a=R.ans[R.i],rows=[...document.querySelectorAll("#ol .ord")];const y=e.clientY;let t=drag.pos;rows.forEach((r,i)=>{const b=r.getBoundingClientRect();if(y>=b.top&&y<=b.bottom)t=i});if(t!==drag.pos){const [it]=a.splice(drag.pos,1);a.splice(t,0,it);drag.pos=t;buzz(5);redrawOrd()}});
["pointerup","pointercancel"].forEach(ev=>document.addEventListener(ev,()=>{if(drag){const p=drag.pos;drag=null;redrawOrd();const el=document.querySelector('#ol .ord[data-pos="'+p+'"]');if(el&&!calm())el.classList.add("settle")}}));
/* matching: a coloured line joins each pair (it draws itself when you make the pair); after checking, wrong pairs show the right line dashed in green */
function matchLines(){const mt=document.querySelector(".mt"),R=S.run;if(!mt||!R||S.scr!=="q")return;const q=curQ(),a=R.ans[R.i],svg=mt.querySelector(".mln");if(!svg)return;
 const mr=mt.getBoundingClientRect(),k=stk(),ch=R.checked;let h="";
 const pt=(l,r)=>{const L=mt.querySelector('[data-a="ml:'+l+'"]'),Rr=mt.querySelector('[data-a="mr:'+r+'"]');if(!L||!Rr)return null;const lb=L.getBoundingClientRect(),rb=Rr.getBoundingClientRect();return[(lb.right-mr.left)/k,(lb.top+lb.height/2-mr.top)/k,(rb.left-mr.left)/k,(rb.top+rb.height/2-mr.top)/k]};
 const path=(p,col,cls)=>{const mx=(p[0]+p[2])/2;return `<path class="${cls||""}" pathLength="1" d="M${p[0]},${p[1]} C${mx},${p[1]} ${mx},${p[3]} ${p[2]},${p[3]}" stroke="${col}"/><circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${col}"/><circle cx="${p[2]}" cy="${p[3]}" r="5" fill="${col}"/>`};
 if(ch)q.pairs.forEach(([l,r])=>{if(a[l]!==r){const p=pt(l,r);if(p)h+=path(p,"#2fb5a3","fix")}});
 Object.entries(a).forEach(([l,r])=>{const p=pt(l,r);if(!p)return;const fresh=!ch&&R.mx&&R.mx.l==l&&!R.mx.s;const ok=q.pairs.some(([x,y])=>x==l&&y===r);h+=path(p,ch?(ok?"#2fb5a3":"#ff7a59"):MC[l],fresh?"new":"")});
 if(R.mx)R.mx.s=1;svg.innerHTML=h}
function settingsModal(){modal(`<h3>Settings</h3><p>Gradis ${APP_VERSION} · ${navigator.onLine?"online":"offline"}${HIST.length?" · "+HIST.length+" result"+(HIST.length>1?"s":"")+" saved":""}</p>${deferredPrompt?'<button class="btn" data-a="install">INSTALL APP</button>':""}${AC.cfg?'<button class="btn" data-a="account" style="background:#fff;box-shadow:1px 1px 0 var(--sh),2px 2px 0 var(--sh),3px 3px 0 var(--sh),4px 4px 0 var(--sh)">ACCOUNT &amp; SYNC</button>':""}<button class="btn w" data-a="export">EXPORT RESULTS</button><button class="btn w" data-a="clear">CLEAR RESULTS</button><button class="btn w" data-a="keep" style="margin-bottom:0">CLOSE</button>`)}
/* maths keypad: keep the cursor in the text box while keys are tapped */
document.addEventListener("pointerdown",e=>{if(e.target.closest&&e.target.closest(".mk"))e.preventDefault()});
