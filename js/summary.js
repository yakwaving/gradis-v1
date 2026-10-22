/* Summary pages: Study mode only. A summary is a page that prepares the questions that follow:
   formulas to remember, things not to forget, hints, the format an answer must take.
   In subjects-manifest.json a summary file sits in the quiz list, just before the first quiz it prepares.
   One summary covers a whole group of quizzes (all the trig formulae once), and is never repeated. */
const SBK={remember:"REMEMBER",formula:"FORMULA",dont:"DON'T FORGET",hint:"HINT",format:"THE FORMAT OF",example:"EXAMPLE"};
function normSummary(raw,name,file){
 const blocks=Array.isArray(raw.blocks)?raw.blocks:[];
 const ok=b=>b&&SBK[b.kind]&&(typeof b.body==="string"||(Array.isArray(b.items)&&b.items.length));
 if(!raw.title||!blocks.length||!blocks.every(ok)){console.warn(name+"/"+file,"summary needs a title and blocks (kind + body or items); kinds:",Object.keys(SBK).join(", "));return null}
 return{summary:true,id:name+"/"+file,title:String(raw.title),intro:raw.intro||"",builds:raw.builds||"",at:Math.max(1,parseInt(raw.at)||1),blocks}}
/* In Study mode the summary pages are put into the question list as pages that are never graded. */
function runQuiz(qz,mode){
 if(mode!=="study"||!qz.pre||!qz.pre.length)return qz;
 const out=[],n=qz.questions.length;
 for(let i=0;i<=n;i++){
  qz.pre.forEach(p=>{if(Math.min(p.at,n)-1===i||(i===n&&p.at-1>=n))out.push({type:"summary",marks:0,id:"s:"+p.id,title:p.title,intro:p.intro,builds:p.builds,blocks:p.blocks,explanation:"",question:""})});
  if(i<n)out.push(qz.questions[i])}
 return Object.assign({},qz,{questions:out})}
const qpos=R=>{const Q=R.qz.questions;let n=0,i=0;Q.forEach((q,k)=>{if(q.type!=="summary"){n++;if(k<=R.i)i=n}});return{i,n}};
function sumBlock(b){
 const body=Array.isArray(b.items)&&b.items.length?`<ul>${b.items.map(x=>`<li>${md(x)}</li>`).join("")}</ul>`:md(b.body);
 return `<div class="sb ${b.kind}"><div class="sbh"><span>${SBK[b.kind]}</span>${b.title?`<em>${md(b.title)}</em>`:""}</div><div class="sbb">${body}</div></div>`}
function sumBody(q){
 return `<div class="card sumh"><h2>${md(q.title)}</h2>${q.intro?`<p>${md(q.intro)}</p>`:""}${q.builds?`<span class="chip b">BUILDS ON: ${esc(q.builds.toUpperCase())}</span>`:""}</div>${q.blocks.map(sumBlock).join("")}`}
