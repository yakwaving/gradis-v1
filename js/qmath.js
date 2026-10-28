/* Maths question types.
   "math":     type an expression or a list of numbers on the maths keypad. Marked by EQUIVALENCE, not by text:
               (x-1)(x+1) and x^2-1 are the same answer. A live preview draws what was typed.
   "stepline": a worked solution is shown step by step; tap the faulty step(s).
   "stepfix":  tap the faulty step, then choose the correct replacement step. */

/* ---------- expression parser: text -> tree ---------- */
const MFN=new Set("sqrt cbrt ln log exp sin cos tan cot sec csc asin acos atan arcsin arccos arctan sinh cosh tanh abs".split(" "));
function mtoks(src){
 let s=String(src).replace(/−|–/g,"-").replace(/[×·]/g,"*").replace(/÷/g,"/").replace(/π/g," pi ").replace(/√/g," sqrt ").replace(/²/g,"^2").replace(/³/g,"^3").replace(/\s+/g," ").trim();
 const out=[];let i=0;
 while(i<s.length){const c=s[i];
  if(c===" "){i++;continue}
  let m;
  if((m=/^\d+(\.\d+)?|^\.\d+/.exec(s.slice(i)))){out.push({k:"n",v:parseFloat(m[0])});i+=m[0].length;continue}
  if((m=/^[A-Za-z]+/.exec(s.slice(i)))){let w=m[0],lw=w.toLowerCase();i+=w.length;
   if(MFN.has(lw)||lw==="pi"){out.push({k:"i",v:lw});continue}
   /* a run of letters that is not a function: single-letter variables multiplied (xy = x*y) */
   let rest=lw;while(rest.length){let f=null;for(const n of [...MFN,"pi"].sort((a,b)=>b.length-a.length))if(rest.startsWith(n)){f=n;break}
    if(f){out.push({k:"i",v:f});rest=rest.slice(f.length)}else{out.push({k:"i",v:rest[0]});rest=rest.slice(1)}}
   continue}
  if("+-*/^()|_=,;".includes(c)){out.push({k:"o",v:c});i++;continue}
  throw new Error("char")}
 return out}
function mparse(src){
 const T=mtoks(src);let p=0;const peek=()=>T[p],eat=()=>T[p++];
 const isO=(t,v)=>t&&t.k==="o"&&t.v===v;
 const startsFactor=t=>t&&(t.k==="n"||t.k==="i"||isO(t,"(")||isO(t,"|"));
 let absOpen=false;
 function expr(){let l=term();while(peek()&&(isO(peek(),"+")||isO(peek(),"-"))){const o=eat().v;l={t:"bin",o,l,r:term()}}return l}
 function term(){let l=unary();for(;;){const t=peek();
   if(isO(t,"*")||isO(t,"/")){const o=eat().v;l={t:"bin",o,l,r:unary()}}
   else if(startsFactor(t)&&!(isO(t,"|")&&absOpen)){l={t:"bin",o:"*",imp:true,l,r:power()}}
   else break}return l}
 function unary(){const t=peek();if(isO(t,"-")){eat();return{t:"neg",e:unary()}}if(isO(t,"+")){eat();return unary()}return power()}
 function power(){const b=atom();if(isO(peek(),"^")){eat();return{t:"pow",b,e:unary()}}return b}
 function atom(){const t=eat();if(!t)throw new Error("end");
  if(t.k==="n")return{t:"num",v:t.v};
  if(isO(t,"(")){const e=expr();if(!isO(eat(),")"))throw new Error(")");return{t:"par",e}}
  if(isO(t,"|")){const was=absOpen;absOpen=true;const e=expr();absOpen=was;if(!isO(eat(),"|"))throw new Error("|");return{t:"call",f:"abs",a:e,bar:true}}
  if(t.k==="i"){
   if(t.v==="pi")return{t:"const",v:"pi"};
   if(MFN.has(t.v)){
    if(t.v==="log"&&isO(peek(),"_")){eat();const b=atom();const a=fnArg();return{t:"logb",b,a}}
    return{t:"call",f:t.v,a:fnArg()}}
   if(t.v==="e"&&!(M_VARS&&M_VARS.has("e")))return{t:"const",v:"e"};
   return{t:"var",v:t.v}}
  throw new Error("tok")}
 function fnArg(){const t=peek();if(!t)throw new Error("arg");
  if(isO(t,"-")){eat();return{t:"neg",e:fnArg()}}
  if(isO(t,"("))return atom();
  return power()}
 const e=expr();if(p<T.length)throw new Error("rest");return e}
let M_VARS=null;

/* ---------- evaluation ---------- */
function meval(n,env){switch(n.t){
 case"num":return n.v;case"const":return n.v==="pi"?Math.PI:Math.E;
 case"var":{if(!(n.v in env))throw new Error("var");return env[n.v]}
 case"par":return meval(n.e,env);case"neg":return-meval(n.e,env);
 case"bin":{const a=meval(n.l,env),b=meval(n.r,env);return n.o==="+"?a+b:n.o==="-"?a-b:n.o==="*"?a*b:a/b}
 case"pow":{const b=meval(n.b,env),e=meval(n.e,env);if(b<0&&Math.abs(e-Math.round(e))>1e-9){/* odd roots of negatives, e.g. x^(1/3) */
   const inv=1/e;if(Math.abs(inv-Math.round(inv))<1e-9&&Math.round(inv)%2!==0)return-Math.pow(-b,e);return NaN}return Math.pow(b,e)}
 case"logb":{const b=meval(n.b,env),a=meval(n.a,env);return Math.log(a)/Math.log(b)}
 case"call":{const x=meval(n.a,env);switch(n.f){
  case"sqrt":return Math.sqrt(x);case"cbrt":return Math.cbrt(x);case"ln":return Math.log(x);case"log":return Math.log10(x);case"exp":return Math.exp(x);
  case"sin":return Math.sin(x);case"cos":return Math.cos(x);case"tan":return Math.tan(x);case"cot":return 1/Math.tan(x);case"sec":return 1/Math.cos(x);case"csc":return 1/Math.sin(x);
  case"asin":case"arcsin":return Math.asin(x);case"acos":case"arccos":return Math.acos(x);case"atan":case"arctan":return Math.atan(x);
  case"sinh":return Math.sinh(x);case"cosh":return Math.cosh(x);case"tanh":return Math.tanh(x);case"abs":return Math.abs(x)}}}
 throw new Error("eval")}
function mvars(n,s){s=s||new Set();if(!n)return s;if(n.t==="var")s.add(n.v);["l","r","e","b","a"].forEach(k=>{if(n[k]&&typeof n[k]==="object")mvars(n[k],s)});return s}

/* ---------- tree -> TeX (for the live preview and the shown answer) ---------- */
const MTF={sqrt:"\\sqrt",ln:"\\ln",log:"\\log",exp:"\\exp",sin:"\\sin",cos:"\\cos",tan:"\\tan",cot:"\\cot",sec:"\\sec",csc:"\\csc",asin:"\\arcsin",arcsin:"\\arcsin",acos:"\\arccos",arccos:"\\arccos",atan:"\\arctan",arctan:"\\arctan",sinh:"\\sinh",cosh:"\\cosh",tanh:"\\tanh"};
const unp=n=>n.t==="par"?n.e:n;
function mtex(n){switch(n.t){
 case"num":return String(n.v);case"const":return n.v==="pi"?"\\pi":"e";case"var":return n.v;
 case"par":return "\\left("+mtex(n.e)+"\\right)";case"neg":return "-"+mtex(n.e);
 case"bin":{const l=mtex(n.l),r=mtex(n.r);if(n.o==="/")return "\\frac{"+mtex(unp(n.l))+"}{"+mtex(unp(n.r))+"}";if(n.o==="*")return n.imp?l+" "+r:l+"\\times "+r;return l+n.o+r}
 case"pow":return mtex(n.b)+"^{"+mtex(unp(n.e))+"}";
 case"logb":return "\\log_{"+mtex(unp(n.b))+"}"+(n.a.t==="par"?mtex(n.a):"\\left("+mtex(n.a)+"\\right)");
 case"call":{if(n.f==="abs")return "\\left|"+mtex(n.a)+"\\right|";if(n.f==="cbrt")return "\\sqrt[3]{"+mtex(unp(n.a))+"}";if(n.f==="sqrt")return "\\sqrt{"+mtex(unp(n.a))+"}";return MTF[n.f]+(n.a.t==="par"?mtex(n.a):" "+mtex(n.a))}}
 return ""}

/* ---------- equivalence ---------- */
function mrng(seed){let s=seed>>>0||1;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
const mclose=(a,b)=>Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(a),Math.abs(b));
function msplit(s){return String(s).split(/\s*(?:;|,|\bor\b|\band\b)\s*/i).map(x=>x.trim()).filter(Boolean)}
const mstrip=s=>{const t=String(s).trim();const m=/^\s*[A-Za-z]\w*(\s*\([A-Za-z,\s]*\))?\s*=\s*([^=]+)$/.exec(t);return m?m[2]:t};
function mequiv(a,b){      /* two expression texts -> are they the same function? */
 try{
  const A=mstrip(a),B=mstrip(b);const hasEq=x=>/=/.test(x);
  if(hasEq(A)||hasEq(B)){   /* equations: compare L - R up to a constant factor */
   if(!(hasEq(A)&&hasEq(B)))return false;const ea=A.split("="),eb=B.split("=");if(ea.length!==2||eb.length!==2)return false;
   const pa=[mparse(ea[0]),mparse(ea[1])],pb=[mparse(eb[0]),mparse(eb[1])];return mratio(pa,pb)}
  const ta=mparse(A),tb=mparse(B),vs=new Set([...mvars(ta),...mvars(tb)]);
  const R=mrng(12345);let good=0,miss=0;
  for(let k=0;k<60&&good<12;k++){const env={};vs.forEach(v=>{env[v]=(R()*6-3)||0.5;if(k%3===0)env[v]=Math.abs(env[v])+0.1});
   let x,y;try{x=meval(ta,env)}catch(_){return false}try{y=meval(tb,env)}catch(_){return false}
   const fx=Number.isFinite(x),fy=Number.isFinite(y);
   if(fx&&fy){if(!mclose(x,y))return false;good++}else if(fx!==fy)miss++}
  return good>=3&&miss<=2}
 catch(_){return false}}
function mratio(pa,pb){const vs=new Set();[...pa,...pb].forEach(t=>mvars(t,vs));const R=mrng(777);let ratio=null,good=0;
 for(let k=0;k<50&&good<10;k++){const env={};vs.forEach(v=>env[v]=(R()*6-3)||0.5);
  let fa,fb;try{fa=meval(pa[0],env)-meval(pa[1],env);fb=meval(pb[0],env)-meval(pb[1],env)}catch(_){return false}
  if(!Number.isFinite(fa)||!Number.isFinite(fb))continue;if(Math.abs(fa)<1e-9&&Math.abs(fb)<1e-9){good++;continue}if(Math.abs(fa)<1e-9||Math.abs(fb)<1e-9)return false;
  const r=fb/fa;if(ratio==null)ratio=r;else if(!mclose(ratio,r))return false;good++}
 return good>=3}
/* expanded / factorised form checks (the maths is equal, but the form asked for must be met) */
function mform(text,form){try{const t=mparse(mstrip(text));
 const prodGroup=n=>{if(!n||typeof n!=="object")return false;if(n.t==="bin"&&n.o==="*"&&(hasPar(n.l)||hasPar(n.r)))return true;return["l","r","e","b","a"].some(k=>n[k]&&prodGroup(n[k]))};
 const hasPar=n=>n&&(n.t==="par"||(n.t==="pow"&&n.b&&n.b.t==="par"));
 const anyPar=n=>{if(!n||typeof n!=="object")return false;if(n.t==="par"&&!n.fnArg)return true;return["l","r","e","b","a"].some(k=>n[k]&&anyPar(n[k]))};
 if(form==="rationalised"){let ok=true;const hasRoot=n=>!!n&&typeof n==="object"&&((n.t==="call"&&(n.f==="sqrt"||n.f==="cbrt"))||["l","r","e","b","a"].some(k=>n[k]&&hasRoot(n[k])));
  const sqf=v=>{for(let k=2;k*k<=v;k++)if(v%(k*k)===0)return false;return true};
  (function w(n){if(!n||typeof n!=="object")return;if(n.t==="bin"&&n.o==="/"&&hasRoot(n.r))ok=false;
   if(n.t==="call"&&n.f==="sqrt"){const a=unp(n.a);if(a.t==="num"){if(!Number.isInteger(a.v)||!sqf(a.v))ok=false}else if(a.t==="bin"&&a.o==="/")ok=false}
   ["l","r","e","b","a"].forEach(k=>n[k]&&w(n[k]))})(t);return ok}
 if(form==="single"){let n=t;while(n.t==="neg"||n.t==="par")n=n.e;return n.t==="logb"||(n.t==="call"&&(n.f==="log"||n.f==="ln"))}
 if(form==="factorised")return prodGroup(t)||(t.t==="pow"&&t.b.t==="par");
 if(form==="expanded")return !prodGroup(t)&&!(t.t==="pow"&&t.b.t==="par"&&t.e.t==="num"&&t.e.v>1);
 return true}catch(_){return false}}
/* the answer list as numbers (for "set" answers such as x = 2 or x = -3) */
function mnums(text){return msplit(text).map(x=>{const v=meval(mparse(mstrip(x)),{});if(!Number.isFinite(v))throw new Error("nan");return v})}
function msetScore(q,a){let want;try{want=mnums(Array.isArray(q.answer)?q.answer.join(";"):q.answer)}catch(_){return 0}
 let got;try{got=mnums(a.v)}catch(_){return 0}
 const used=new Set();let right=0,wrong=0;got.forEach(g=>{const j=want.findIndex((w,i)=>!used.has(i)&&mclose(w,g));if(j>=0){used.add(j);right++}else wrong++});
 return Math.max(0,right-wrong)/want.length}
function mathScore(q,a){const v=(a&&a.v||"").trim();if(!v)return 0;
 if(q.set)return msetScore(q,a);
 const ans=[].concat(q.answer,q.accepted||[]);
 if(!ans.some(x=>mequiv(v,x)))return 0;
 if(q.form&&!mform(v,q.form))return 0;return 1}
const mathOk=(q,a)=>mathScore(q,a)>=1;
function mathTex(text,q){try{
 if(q&&q.set)return msplit(text).map(x=>mtex(mparse(mstrip(x)))).join(",\\ ");
 const m=/^\s*([A-Za-z]\w*(?:\s*\([A-Za-z,\s]*\))?)\s*=\s*([^=]+)$/.exec(text);
 if(m)return m[1]+"="+mtex(mparse(m[2]));
 if(String(text).includes("=")){const[l,r]=text.split("=");return mtex(mparse(l))+"="+mtex(mparse(r))}
 return mtex(mparse(text))}catch(_){return null}}
const mathShow=(t,q)=>{const x=mathTex(t,q);return x==null?String(t):"$"+x+"$"};
/* for review/feedback: "Answer: $...$" */
function mathAnswerText(q){const a0=[].concat(q.answer)[0];return q.set?(Array.isArray(q.answer)?q.answer:[q.answer]).map(x=>mathShow(x,q)).join("  "):mathShow(a0,q)}

/* ---------- validation ---------- */
function mcheck(q){
 if(q.type==="math"){
  const list=[].concat(q.answer,q.accepted||[]);
  if(!list.length||list.some(x=>typeof x!=="string"&&typeof x!=="number"))return"answer must be text such as x^2-1";
  if(q.set){try{mnums(Array.isArray(q.answer)?q.answer.join(";"):String(q.answer))}catch(_){return"a set answer must be numbers, e.g. \"2, -3\""}}
  else for(const x of list){try{const s=mstrip(String(x));if(!/=/.test(s))mparse(s)}catch(_){return'cannot read the answer "'+x+'"'}}
  if(q.form&&!["expanded","factorised","rationalised","single"].includes(q.form))return'form can only be "expanded", "factorised", "rationalised" or "single"';
  if(q.form&&!mform(String(list[0]),q.form))return"the answer itself is not in the form you asked for"}
 if(q.type==="stepline"||q.type==="stepfix"){
  if(!Array.isArray(q.steps)||q.steps.length<2||q.steps.some(s=>typeof s!=="string"))return"steps must list at least 2 lines of maths";
  const n=q.steps.length,okL=x=>Number.isInteger(x)&&x>=1&&x<=n;
  if(q.type==="stepline"){if(!Array.isArray(q.bugs)||!q.bugs.length||!q.bugs.every(okL))return"bugs must list step numbers (1 to "+n+")"}
  else{if(!okL(q.bug))return"bug must be a step number (1 to "+n+")";if(!Array.isArray(q.options)||q.options.length<2)return"options (replacement steps) are needed";if(!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options.length)return"correct must be the number of the right option"}}
 return null}

/* ---------- the maths answer box ---------- */
const MKEYS={x:{l:"x",i:"x"},y:{l:"y",i:"y"},pow:{l:"xⁿ",i:"^"},sq:{l:"x²",i:"^2"},div:{l:"a⁄b",i:"/"},sqrt:{l:"√",i:"sqrt("},cbrt:{l:"∛",i:"cbrt("},lp:{l:"(",i:"("},rp:{l:")",i:")"},pi:{l:"π",i:"π"},e:{l:"e",i:"e"},ln:{l:"ln",i:"ln("},log:{l:"log",i:"log("},logb:{l:"logₙ",i:"log_("},exp:{l:"eˣ",i:"e^"},sin:{l:"sin",i:"sin("},cos:{l:"cos",i:"cos("},tan:{l:"tan",i:"tan("},abs:{l:"|x|",i:"|"},mul:{l:"×",i:"*"},plus:{l:"+",i:"+"},minus:{l:"−",i:"-"},eq:{l:"=",i:"="},comma:{l:",",i:", "},del:{l:"⌫",i:""}};
const MKEYSET=["x","pow","sq","div","sqrt","lp","rp","pi","e","ln","log","exp","sin","cos","tan","abs","plus","minus","mul","del"];
function mathUI(q,a,ch,R){
 const keys=(q.keys||(q.set?["minus","div","sqrt","pi","comma","del"]:MKEYSET)).filter(k=>MKEYS[k]);
 const ok=ch?mathOk(q,a):null,pv=mathTex(a.v||"",q);
 const hint=q.set?"Type the values separated by commas, e.g. 2, -3":q.form==="expanded"?"Give your answer fully expanded":q.form==="factorised"?"Give your answer factorised":q.form==="rationalised"?"Rationalise the denominator and simplify the root":q.form==="single"?"Give your answer as a single logarithm":"Any equivalent form is accepted";
 return `<div class="note">${hint}</div>`
 +`<div class="mpv${ch?(ok?" ok":" bad"):""}" id="mpv">${mpvHtml(a.v,pv)}</div>`
 +`<input class="inp mono${ch?(ok?" ok":" bad"):""}" data-mt="1" placeholder="${q.set?"2, -3":"Type your answer"}" value="${esc(a.v||"")}" ${ch?"readonly":""} autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">`
 +(ch?"":`<div class="mkeys">${keys.map(k=>`<button type="button" class="mk${k==="del"?" del":""}" data-a="mk:${k}" aria-label="${k}">${MKEYS[k].l}</button>`).join("")}</div>`)
 +`<div style="height:10px"></div>`}
function mpvHtml(raw,tex){if(!raw||!raw.trim())return'<span class="mph">Your answer appears here</span>';return tex==null?'<span class="mph">'+esc(raw)+'</span>':kx(tex,false)}
function mathInput(t,a){a.v=t.value;const p=document.getElementById("mpv"),q=curQ();if(p)p.innerHTML=mpvHtml(a.v,mathTex(a.v,q))}
function mathKey(k,a){const inp=document.querySelector("input[data-mt]");if(!inp)return;
 const d=MKEYS[k];let v=inp.value,s=inp.selectionStart==null?v.length:inp.selectionStart,e=inp.selectionEnd==null?v.length:inp.selectionEnd;
 if(k==="del"){if(s!==e){v=v.slice(0,s)+v.slice(e)}else if(s>0){const m=/(sqrt\(|cbrt\(|log_\(|log\(|sin\(|cos\(|tan\(|ln\(|, )$/.exec(v.slice(0,s));const n=m?m[0].length:1;v=v.slice(0,s-n)+v.slice(s);s-=n-1}inp.value=v;inp.setSelectionRange(s-(s!==e?0:1),s-(s!==e?0:1))}
 else{v=v.slice(0,s)+d.i+v.slice(e);inp.value=v;const c=s+d.i.length;inp.setSelectionRange(c,c)}
 inp.focus();mathInput(inp,a);refreshBtn()}

/* ---------- worked-solution steps: find the faulty step / fix it ---------- */
function stepUI(q,a,ch,R){
 const fix=q.type==="stepfix",sel=fix?(a.l!=null?[a.l]:[]):a,bugs=fix?[q.bug]:q.bugs;
 const rep=fix&&a.l!=null&&a.f!=null?q.options[a.f]:null;
 const rows=q.steps.map((s,i)=>{const n=i+1,on=sel.includes(n),isb=bugs.includes(n);let c="";
  if(ch)c=on?(isb?"ok":"bad"):isb?"miss":"";else if(on)c="sel"+sxc(R,"l"+n);
  const edited=rep!=null&&a.l===n;if(edited)c+=" ed";
  const tex=edited?rep:s,label=q.labels&&q.labels[i]?`<span class="slb">${esc(q.labels[i])}</span>`:"";
  return `<button type="button" class="sr ${c}" ${ch?"":`data-a="bl:${n}"`}><i class="sn">${n}</i><span class="sm">${label}${kx(tex,false)}</span></button>`}).join("");
 const many=!fix&&bugs.length>1;
 const note=fix?"1 · Tap the faulty step.  2 · Choose the correct step to put in its place.":many?`There are ${bugs.length} faulty steps. Tap each one. A wrong tap costs a point.`:"One step has a mistake. Tap it.";
 let out=`<div class="note">${note}</div><div class="steps">${rows}</div>`;
 if(fix)out+=q.options.map((o,i)=>{let c=a.f===i?" sel"+sxc(R,"f"+i):"";if(ch)c=i===q.correct?" ok":a.f===i?" bad":"";return `<button class="opt${c}${ch?" lock":""}" data-a="bf:${i}"><span class="k">${"ABCDEF"[i]}</span><span class="oc mo">${kx(o,false)}</span></button>`}).join("")+`<div style="height:6px"></div>`;
 else out+=`<div style="height:10px"></div>`;
 return out}
const stepShowC=q=>q.type==="stepline"?"step"+(q.bugs.length>1?"s ":" ")+q.bugs.join(", "):"step "+q.bug+" → $"+q.options[q.correct]+"$";
const stepShowA=(q,a)=>q.type==="stepline"?((a&&a.length)?"step"+(a.length>1?"s ":" ")+[...a].sort((x,y)=>x-y).join(", "):"—"):"step "+(a&&a.l!=null?a.l:"—")+" → "+(a&&a.f!=null?"$"+q.options[a.f]+"$":"—");
