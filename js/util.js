const APP_VERSION="1.13.0";
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

const dayLbl=(a,ts)=>a===0?"Today":a===1?"Yesterday":a<7?a+" days ago":a<14?"Last week":new Date(ts).toLocaleDateString(undefined,{day:"numeric",month:"short"});
const encPath=p=>encodeURI(p);
function optText(o){return typeof o==="string"?o:(o&&o.text)||"(image)"}
function oHtml(o){if(typeof o==="string")return md(o);return (o.image?`<img class="oimg" src="${esc(encPath(o.image))}" alt="${esc(o.text||"")}">`:"")+(o.text?md(o.text):"")}
function imgHtml(p){return IMGS[p]?IMGS[p]:`<img src="${esc(encPath(p))}" alt="">`}
function modal(html){closeModal();const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="card">${html}</div>`;$("st").appendChild(m)}
function closeModal(){document.querySelectorAll(".modal").forEach(m=>m.remove())}
