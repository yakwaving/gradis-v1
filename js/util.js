const APP_VERSION="1.22.0";
/* true inside the Android app (Capacitor); false in a normal browser */
const isNative=()=>{const C=window.Capacitor;return !!(C&&(C.isNativePlatform?C.isNativePlatform():(C.getPlatform&&C.getPlatform()!=="web")))};
const loaderHtml=()=>'<div class="ldr" role="status" aria-label="Loading"><i class="ldp"></i><i class="ldq"></i></div>';
const $=id=>document.getElementById(id);
const TYPES={single:"SINGLE CHOICE",multiple:"MULTIPLE CHOICE",truefalse:"TRUE / FALSE",fill:"FILL IN THE GAPS",short:"SHORT ANSWER",numeric:"NUMERIC",matching:"MATCHING",ordering:"ORDERING",labelling:"LABELLING",grid:"TABLE",assertion:"ASSERTION–REASON",structured:"STRUCTURED",code:"CODE BLOCKS",bugline:"FIND THE ERROR",bugfix:"FIX THE CODE",flowchart:"FLOWCHART",summary:"SUMMARY",math:"MATHS ANSWER",stepline:"FIND THE FAULTY STEP",stepfix:"FIX THE STEP"};
const ASR={A:"Both true, and the reason explains the assertion",B:"Both true, but the reason does not explain it",C:"Assertion true, reason false",D:"Assertion false, reason true",E:"Both false"};
const PC=["#5b8cff","#ff7a59","#2fb5a3","#c58bff","#ffb400"];
const MODES=[["exam","EXAM","Timer · no hints · answers at the end"],["practice","PRACTICE","Feedback after every answer"],["study","STUDY","Explanations first · not graded"]];
const GRADES=[[85,"A*","Outstanding work!"],[75,"A","Excellent. You really know this."],[65,"B","Well done. Nearly there."],[50,"C","Good effort. Review the misses."],[35,"D","Keep practising, it is coming together."],[0,"E","Tough one. Try Study mode, then retry."]];
const grade=p=>GRADES.find(g=>p>=g[0]);
const icoX=gicon("close");
const icoB=gicon("arrow_back");
const icoClock=gicon("schedule","width:16px;height:16px");
const icoBook=gicon("menu_book");
const icoHome=gicon("home");
const icoChart=gicon("bar_chart");
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;$("st").appendChild(e);setTimeout(()=>e.remove(),1800)}
/* ---------- text helpers ---------- */
function mx(s){return s}
function kx(m,disp){try{if(window.katex)return katex.renderToString(m,{displayMode:disp,throwOnError:false,strict:"ignore",trust:false})}catch(_){}return '<span class="mx">'+esc(m)+'</span>'}
function md(s){const hold=[],keep=h=>"\u0001"+(hold.push(h)-1)+"\u0001";
 s=String(s).replace(/```([A-Za-z]*)\n([\s\S]*?)```/g,(_,l,c)=>keep(codePanel(c.replace(/\n$/,""),{lang:l})))
  .replace(/```([\s\S]*?)```/g,(_,c)=>keep(codePanel(c.replace(/\n$/,""))))
  .replace(/`([^`\n]+)`/g,(_,c)=>keep("<code>"+hl(c)+"</code>"))
  .replace(/\$\$([\s\S]+?)\$\$/g,(_,m)=>keep('<div class="mxd">'+kx(m,true)+'</div>'))
  .replace(/\$([^$\n]+)\$/g,(_,m)=>keep(kx(m,false)));
 s=s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
 return s.replace(/\u0001(\d+)\u0001/g,(_,i)=>hold[+i])}
const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const norm=s=>String(s==null?"":s).trim().toLowerCase().replace(/\s+/g," ");
const fmt=n=>String(Math.round(n*10)/10);
const fmtT=s=>Math.floor(s/60)+":"+String(Math.max(0,s%60)).padStart(2,"0");
const stateOf=m=>m.got>=m.max?"ok":m.got>0?"part":"bad";
const ST={ok:["Correct!","✓"],part:["Partly right","≈"],bad:["Not quite","✗"]};


/* Illustration kit: small drawn icons (24x24) in the app's palette. Strokes draw themselves in, fills pop in. kit("check",{size:28,c:"#2fb5a3",still:true}) */
const KIT={
 check:o=>`<path class="dr" pathLength="1" d="M5 12.6l4.6 4.6L19.2 7" fill="none" stroke="${o.c||"#2fb5a3"}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`,
 cross:o=>`<path class="dr" pathLength="1" d="M6.5 6.5l11 11" fill="none" stroke="${o.c||"#ff7a59"}" stroke-width="3.4" stroke-linecap="round"/><path class="dr d2" pathLength="1" d="M17.5 6.5l-11 11" fill="none" stroke="${o.c||"#ff7a59"}" stroke-width="3.4" stroke-linecap="round"/>`,
 star:o=>`<path class="pp" d="M12 2.8l2.8 5.9 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.7 3.1 1.1-6.4-4.6-4.5 6.4-.9z" fill="${o.c||"#ffcb3d"}" stroke="#1c2a5e" stroke-width="1.6" stroke-linejoin="round"/>`,
 spark:o=>`<path class="pp" d="M12 2l2.1 7.2L21.5 12l-7.4 2.8L12 22l-2.1-7.2L2.5 12l7.4-2.8z" fill="${o.c||"#ffcb3d"}" stroke="#1c2a5e" stroke-width="1.4" stroke-linejoin="round"/>`,
 trophy:o=>`<path class="pp" d="M7 3.5h10v6a5 5 0 0 1-10 0z" fill="${o.c||"#ffcb3d"}" stroke="#1c2a5e" stroke-width="1.6" stroke-linejoin="round"/><path class="dr" pathLength="1" d="M7 5.5H3.8c0 3.4 1.4 5 3.6 5.4M17 5.5h3.2c0 3.4-1.4 5-3.6 5.4M12 14.5v3.3M8 20.5h8M9.2 17.8h5.6" fill="none" stroke="#1c2a5e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
 book:o=>`<path class="pp" d="M3.5 5.5c3-1.2 6-1 8.5 1v13c-2.5-2-5.5-2.2-8.5-1z" fill="${o.c||"#5b8cff"}" stroke="#1c2a5e" stroke-width="1.6" stroke-linejoin="round"/><path class="pp d2" d="M20.5 5.5c-3-1.2-6-1-8.5 1v13c2.5-2 5.5-2.2 8.5-1z" fill="${o.c2||"#8fb0ff"}" stroke="#1c2a5e" stroke-width="1.6" stroke-linejoin="round"/>`
};
const kit=(n,o)=>{o=o||{};const s=o.size||24;return `<svg class="kt kt-${n}${o.still?" still":" go"}${o.cls?" "+o.cls:""}" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${KIT[n](o)}</svg>`};
const dayLbl=(a,ts)=>a===0?"Today":a===1?"Yesterday":a<7?a+" days ago":a<14?"Last week":new Date(ts).toLocaleDateString(undefined,{day:"numeric",month:"short"});
const encPath=p=>encodeURI(p);
function optText(o){return typeof o==="string"?o:(o&&o.text)||"(image)"}
function oHtml(o){if(typeof o==="string")return md(o);return (o.image?`<img class="oimg" src="${esc(encPath(o.image))}" alt="${esc(o.text||"")}">`:"")+(o.text?md(o.text):"")}
function imgHtml(p){return IMGS[p]?IMGS[p]:`<img src="${esc(encPath(p))}" alt="">`}
function modal(html){closeModal();const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="card">${html}</div>`;$("st").appendChild(m)}
function closeModal(){document.querySelectorAll(".modal").forEach(m=>m.remove())}
