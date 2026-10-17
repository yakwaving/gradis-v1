/* Data: subjects and quizzes are loaded from subjects-manifest.json and subjects/<Subject>/<quiz>.json */
const DATA={},IMGS={},SUBJ=[];
let HIST=[];
let S={scr:"home",dash:"day",from:"home",q:"",flt:"all",subj:null,quiz:null,mode:"practice",run:null,tab:"home",warn:0};
const K_RES="gradis.v1.results",K_RUN="gradis.v1.run";
const PAL=[["#5b8cff","#3a5fc4"],["#2fb5a3","#1d8174"],["#ff7a59","#c4492b"],["#ffcb3d","#c98a00"],["#4cc46a","#2e8f48"],["#c58bff","#8f56d6"],["#2fa8e0","#1d79a8"],["#ff9f43","#c4701c"],["#ff6fa5","#c43d73"],["#6c7bd6","#4553a8"]];
const SV=(p)=>`<svg viewBox="0 0 40 40" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICONS={check:SV('<rect x="7" y="7" width="26" height="26" rx="6"/><path d="M13 20l5 5 9-10"/>'),book:SV('<path d="M8 9a3 3 0 0 1 3-3h20v26H11a3 3 0 0 0-3 3zM8 32V9"/>'),flask:SV('<path d="M15 5h10M17 5v11L8 32a3 3 0 0 0 2.6 4.5h18.8A3 3 0 0 0 32 32L23 16V5"/>'),chip:SV('<rect x="10" y="10" width="20" height="20" rx="3"/><path d="M16 4v6M24 4v6M16 30v6M24 30v6M4 16h6M4 24h6M30 16h6M30 24h6"/>'),calc:SV('<rect x="9" y="5" width="22" height="30" rx="4"/><path d="M14 12h12M14 20h2M20 20h2M14 27h2M20 27h2"/>')};
const REQ={single:["options","correct"],multiple:["options","correct"],truefalse:["correct"],fill:["blanks"],short:["accepted"],numeric:["correct"],matching:["left","right","pairs"],ordering:["items","correctOrder"],labelling:["image","labels","targets"],grid:["columns","rows"],assertion:["assertion","reason","correct"],structured:["parts"]};
const sub=n=>SUBJ.find(s=>s.n===n)||{n,c:"#8a94a6",d:"#5d6678",g:(n||"?")[0].toUpperCase()};
const real=n=>!!(DATA[n]&&DATA[n].length);

async function getJSON(u){const r=await fetch(encPath(u));if(!r.ok)throw new Error(u+" ("+r.status+")");return r.json()}
function normQ(q,i,where){
  q=Object.assign({},q);q.type=q.type||"single";q.marks=Number(q.marks)||1;q.explanation=q.explanation||"";q.id=q.id||("q"+(i+1));
  if(!TYPES[q.type]){console.warn(where,"question",i+1,"unknown type",q.type);return null}
  const miss=REQ[q.type].filter(k=>q[k]==null);
  if(miss.length){console.warn(where,"question",i+1,"("+q.type+") is missing",miss.join(", "));return null}
  if(q.type==="grid"&&!q.rows.some(r=>r.some(c=>c.answer))){console.warn(where,"question",i+1,"table has no blank cells");return null}
  return q}
function normQuiz(raw,name,file){
  const qz=Object.assign({title:file,description:"",difficulty:"",level:"",topic:"",timerType:"wholeQuiz",confidence:false,instructions:[]},raw);
  qz.qid=name+"/"+file;const before=(raw.questions||[]).length;
  qz.questions=(raw.questions||[]).map((q,i)=>normQ(q,i,qz.qid)).filter(Boolean);
  S.warn+=before-qz.questions.length;
  if(!qz.totalTime)qz.totalTime=qz.timerType==="perQuestion"?45:Math.max(60,qz.questions.length*60);
  return qz}
function imagePaths(o,out){if(Array.isArray(o))o.forEach(x=>imagePaths(x,out));else if(o&&typeof o==="object")for(const[k,v]of Object.entries(o)){if(k==="image"&&typeof v==="string")out.add(v);else imagePaths(v,out)}return out}
async function loadAll(){
  const man=await getJSON("subjects-manifest.json");
  SUBJ.length=0;Object.keys(DATA).forEach(k=>delete DATA[k]);S.warn=0;
  const entries=Object.entries(man.subjects||{});
  entries.forEach(([name,val],i)=>{const m=Array.isArray(val)?{quizzes:val}:(val||{}),p=PAL[i%PAL.length];
    const hex=v=>/^#[0-9a-f]{3,8}$/i.test(v||"")?v:null;
    SUBJ.push({n:name,c:hex(m.color)||p[0],d:hex(m.dark)||p[1],ic:ICONS[m.icon]||null,g:m.glyph||name[0].toUpperCase(),desc:m.description||"",files:m.quizzes||[]});DATA[name]=[]});
  const imgs=new Set();
  await Promise.all(SUBJ.map(async s=>{
    const got=await Promise.all(s.files.map(async f=>{try{const raw=await getJSON(`subjects/${s.n}/${f}.json`);imagePaths(raw,imgs);return normQuiz(raw,s.n,f)}catch(e){console.warn("could not load quiz",s.n,f,e.message);S.warn++;return null}}));
    DATA[s.n]=got.filter(z=>z&&z.questions.length)}));
  await Promise.all([...imgs].filter(p=>/\.svg$/i.test(p)).map(async p=>{try{const r=await fetch(encPath(p));if(r.ok)IMGS[p]=await r.text()}catch(e){}}));
}

/* Results: saved on this device */
function hydrate(h){const d=new Date(h.ts),t=new Date();const a=Math.max(0,Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate())-new Date(d.getFullYear(),d.getMonth(),d.getDate()))/864e5));h.ago=a;h.d=dayLbl(a,h.ts);return h}
function saveHist(){try{localStorage.setItem(K_RES,JSON.stringify(HIST.map(({ago,d,...r})=>r)))}catch(e){}}
function loadHist(){try{const a=JSON.parse(localStorage.getItem(K_RES)||"[]");HIST=a.filter(h=>h&&h.ts&&h.p!=null).map(hydrate).sort((x,y)=>y.ts-x.ts)}catch(e){HIST=[]}}
function addResult(r){r.ts=Date.now();HIST.unshift(hydrate(r));if(HIST.length>500)HIST.length=500;saveHist()}
function exportResults(){const blob=new Blob([JSON.stringify({app:"gradis",version:1,exported:new Date().toISOString(),results:HIST.map(({ago,d,...r})=>r)},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="gradis-results-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}

/* Quiz in progress: saved so it can be resumed */
function persistRun(){const R=S.run;if(!R||S.scr!=="q")return;try{localStorage.setItem(K_RUN,JSON.stringify({subj:S.subj,qid:R.qz.qid,mode:R.mode,i:R.i,ans:R.ans,res:R.res,conf:R.conf,checked:R.checked,left:R.left,t:R.t,ts:Date.now()}))}catch(e){}}
function clearRun(){try{localStorage.removeItem(K_RUN)}catch(e){}}
function savedRun(){try{const s=JSON.parse(localStorage.getItem(K_RUN)||"null");if(!s)return null;const qz=(DATA[s.subj]||[]).find(z=>z.qid===s.qid);if(!qz||s.i>=qz.questions.length)return null;s.qz=qz;return s}catch(e){return null}}
function resumeRun(){const s=savedRun();if(!s){toast("NOTHING TO RESUME");return scr("home")}
  S.subj=s.subj;S.from="home";S.quiz=s.qz;S.mode=s.mode;
  S.run={qz:s.qz,mode:s.mode,i:s.i,ans:s.ans,res:s.res||[],conf:s.conf||[],checked:!!s.checked,left:s.left,hint:false,ui:{},t:s.t||0};
  clearInterval(S.tm);S.tm=setInterval(tick,1000);scr("q")}
