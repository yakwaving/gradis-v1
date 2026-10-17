const APP_VERSION="1.1.1";
const loaderHtml=()=>'<div class="ldr" role="status" aria-label="Loading"><i class="ldp"></i><i class="ldq"></i></div>';
const $=id=>document.getElementById(id);
const TYPES={single:"SINGLE CHOICE",multiple:"MULTIPLE CHOICE",truefalse:"TRUE / FALSE",fill:"FILL IN THE GAPS",short:"SHORT ANSWER",numeric:"NUMERIC",matching:"MATCHING",ordering:"ORDERING",labelling:"LABELLING",grid:"TABLE",assertion:"ASSERTION–REASON",structured:"STRUCTURED"};
const ASR={A:"Both true, and the reason explains the assertion",B:"Both true, but the reason does not explain it",C:"Assertion true, reason false",D:"Assertion false, reason true",E:"Both false"};
const PC=["#5b8cff","#ff7a59","#2fb5a3","#c58bff","#ffb400"];
const MODES=[["exam","EXAM","Timer · no hints · answers at the end"],["practice","PRACTICE","Feedback after every answer"],["study","STUDY","Explanations first · not graded"]];
const GRADES=[[85,"A*","Outstanding work!"],[75,"A","Excellent. You really know this."],[65,"B","Well done. Nearly there."],[50,"C","Good effort. Review the misses."],[35,"D","Keep practising, it is coming together."],[0,"E","Tough one. Try Study mode, then retry."]];
const grade=p=>GRADES.find(g=>p>=g[0]);
const icoX='<svg viewBox="0 0 24 24" fill="none" stroke="#1c2a5e" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const icoB='<svg viewBox="0 0 24 24" fill="none" stroke="#1c2a5e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
const icoClock='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>';
const icoBook='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5"/></svg>';
const icoHome='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8M5 9.5V21h14V9.5"/></svg>';
const icoChart='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>';
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;$("st").appendChild(e);setTimeout(()=>e.remove(),1800)}
/* ---------- text helpers ---------- */
function mx(s){return s.replace(/\$([^$]+)\$/g,(_,m)=>'<span class="mx">'+m.replace(/\\ /g,' ').replace(/\\text\{([^}]*)\}/g,'$1').replace(/\\times/g,'×').replace(/\^\{([^}]*)\}/g,'<sup>$1</sup>').replace(/\^(-?\w)/g,'<sup>$1</sup>')+'</span>')}
function md(s){s=String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');s=s.replace(/```\n?([\s\S]*?)```/g,(_,c)=>'<pre>'+c.replace(/\n$/,'')+'</pre>');s=s.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');s=mx(s);return s.split(/(<pre>[\s\S]*?<\/pre>)/).map(p=>p.startsWith('<pre>')?p:p.replace(/\n/g,'<br>')).join('')}
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
