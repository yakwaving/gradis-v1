/* Two question types for computing subjects.
   "code":      complete a code listing by placing blocks into its gaps.
   "flowchart": a flowchart drawn from data; each node can ask for its shape, its text, or both. */
const FSHAPES={terminator:"Start / End",process:"Process",decision:"Decision",io:"Input / Output"};
const FDEF={terminator:[34,12],process:[34,13],decision:[40,19],io:[36,13]};
const fcn=s=>norm(s).replace(/\s+/g,"");            /* typed flowchart text: capitals and spaces don't matter */
const fcSize=n=>[n.w||FDEF[n.shape][0],n.h||FDEF[n.shape][1]];
const fcAsk=n=>n.ask||[];
const fcHeight=q=>q.height||Math.ceil(Math.max(...q.nodes.map(n=>n.y+fcSize(n)[1]/2))+6);

/* ---------- validation (called from normQ) ---------- */
function qcheck(q){
 if(q.type==="code"){
  if(typeof q.code!=="string"||!Array.isArray(q.blocks)||!Array.isArray(q.answers))return"code, blocks and answers are needed";
  const g=[...q.code.matchAll(/\{\{(\d+)\}\}/g)].map(m=>+m[1]).sort((a,b)=>a-b);
  if(!g.length||g.some((x,i)=>x!==i+1))return"gaps must be {{1}}, {{2}}, ... each used once";
  if(g.length!==q.answers.length)return"there are "+g.length+" gaps but "+q.answers.length+" answers";
  const pool=q.blocks.map(b=>String(b).trim());
  for(const a of q.answers){const k=pool.indexOf(String(a).trim());if(k<0)return'answer "'+a+'" is not in blocks';pool.splice(k,1)}
 }
 if(q.type==="flowchart"){
  if(!Array.isArray(q.nodes)||!q.nodes.length)return"nodes are needed";
  const ids=new Set();let asks=0;
  for(const n of q.nodes){
   if(!n.id||ids.has(n.id))return"every node needs its own id";ids.add(n.id);
   if(!FSHAPES[n.shape])return"node "+n.id+": shape must be terminator, process, decision or io";
   if(typeof n.x!=="number"||typeof n.y!=="number")return"node "+n.id+": x and y are needed";
   for(const k of fcAsk(n)){asks++;if(k!=="shape"&&k!=="text")return"node "+n.id+': ask can only hold "shape" and "text"';
    if(k==="text"&&(!Array.isArray(n.accepted)||!n.accepted.length))return"node "+n.id+": accepted is needed when text is asked"}}
  if(!asks)return'at least one node needs "ask"';
  for(const e of q.edges||[])if(!ids.has(e.from)||!ids.has(e.to))return"an edge points to a node that does not exist"}
 return null}

/* ---------- marking ---------- */
const codeOk=(q,a,i)=>a[i]!=null&&String(q.blocks[a[i]]).trim()===String(q.answers[i]).trim();
function codeScore(q,a){let ok=0;q.answers.forEach((_,i)=>{if(codeOk(q,a,i))ok++});return[ok,q.answers.length]}
const fcOk=(n,k,a)=>k==="shape"?(a.shapes||{})[n.id]===n.shape:n.accepted.map(fcn).includes(fcn((a.text||{})[n.id]));
function flowScore(q,a){let ok=0,t=0;q.nodes.forEach(n=>fcAsk(n).forEach(k=>{t++;if(fcOk(n,k,a))ok++}));return[ok,t]}
const flowAnswered=a=>!!a&&(Object.keys(a.shapes||{}).length>0||Object.values(a.text||{}).some(x=>x&&x.trim()));
const flowAsked=q=>q.nodes.filter(n=>fcAsk(n).length);
const flowLine=(q,a,right)=>flowAsked(q).map((n,i)=>(i+1)+") "+fcAsk(n).map(k=>k==="shape"?(right?FSHAPES[n.shape]:FSHAPES[(a.shapes||{})[n.id]]||"—"):(right?n.accepted[0]:((a.text||{})[n.id]||"—"))).join(" · ")).join("   ");

/* ---------- code blocks ---------- */
function codeUI(q,a,ch,R){
 const used=Object.values(a);
 const code=esc(q.code).replace(/\{\{(\d+)\}\}/g,(_,n)=>{const i=n-1,v=a[i];let c=v!=null?" f":"";if(ch)c+=codeOk(q,a,i)?" ok":" bad";if(R.ui.g===i)c+=" sel";return `<button class="cg${c}" data-a="cg:${i}">${v!=null?esc(q.blocks[v]):n}</button>`});
 return `<div class="note">Tap a block, then the gap it belongs in. Tap a filled gap to take its block back.</div><div class="codebox">${q.language?`<span class="clang">${esc(q.language)}</span>`:""}<pre class="code">${code}</pre></div>`
 +`<div class="tray">${q.blocks.map((b,i)=>used.includes(i)?"":`<button class="cbk${R.ui.b===i?" sel":""}" data-a="cb:${i}">${esc(b)}</button>`).join("")||'<span class="note" style="margin:auto">All blocks placed</span>'}</div>`
 +`<div style="height:14px"></div>`}

/* ---------- flowchart ---------- */
function fcShape(shape,w,h,cls){const W=w*10,H=h*10,s=4,k=W*.12;
 const sh={terminator:`<rect x="${s}" y="${s}" width="${W-2*s}" height="${H-2*s}" rx="${(H-2*s)/2}"/>`,process:`<rect x="${s}" y="${s}" width="${W-2*s}" height="${H-2*s}" rx="10"/>`,
  decision:`<polygon points="${W/2},${s} ${W-s},${H/2} ${W/2},${H-s} ${s},${H/2}"/>`,io:`<polygon points="${k+s},${s} ${W-s},${s} ${W-k},${H-s} ${s},${H-s}"/>`}[shape];
 return `<svg viewBox="0 0 ${W} ${H}" class="${cls||""}" aria-hidden="true">${sh}</svg>`}
function fcAnchor(n,s){const[w,h]=fcSize(n);return s==="b"?[n.x,n.y+h/2]:s==="t"?[n.x,n.y-h/2]:s==="r"?[n.x+w/2,n.y]:[n.x-w/2,n.y]}
function fcSide(n,p){const[w,h]=fcSize(n),dx=p[0]-n.x,dy=p[1]-n.y;return Math.abs(dy)/h>=Math.abs(dx)/w?(dy>0?"b":"t"):(dx>0?"r":"l")}
function fcRoute(e,N){const A=N[e.from],B=N[e.to];
 if(e.via&&e.via.length){const f=e.via[0],l=e.via[e.via.length-1];return[fcAnchor(A,fcSide(A,f)),...e.via,fcAnchor(B,fcSide(B,l))]}
 const sa=fcSide(A,[B.x,B.y]),sb={b:"t",t:"b",r:"l",l:"r"}[sa],p=fcAnchor(A,sa),r=fcAnchor(B,sb);
 if(sa==="b"||sa==="t"){if(Math.abs(p[0]-r[0])<.5)return[p,r];const m=(p[1]+r[1])/2;return[p,[p[0],m],[r[0],m],r]}
 if(Math.abs(p[1]-r[1])<.5)return[p,r];const m=(p[0]+r[0])/2;return[p,[m,p[1]],[m,r[1]],r]}
function flowUI(q,a,ch,R){
 const H=fcHeight(q),N={};q.nodes.forEach(n=>N[n.id]=n);let num=0;
 const edges=(q.edges||[]).map(e=>{const pts=fcRoute(e,N),d=pts.map(p=>p.map(v=>Math.round(v*10)/10).join(",")).join(" ");
  const[p0,p1]=pts,down=Math.abs(p1[1]-p0[1])>=Math.abs(p1[0]-p0[0]);
  const lb=e.label?(down?`<text x="${p0[0]+1.6}" y="${p0[1]+4.6}" class="fel">${esc(e.label)}</text>`:`<text x="${(p0[0]+p1[0])/2}" y="${p0[1]-1.8}" class="fel" text-anchor="middle">${esc(e.label)}</text>`):"";
  return `<polyline points="${d}" class="fep" marker-end="url(#fca)"/>${lb}`}).join("");
 const nodes=q.nodes.map(n=>{
  const[w,h]=fcSize(n),ask=fcAsk(n),aS=ask.includes("shape"),aT=ask.includes("text"),shp=aS?(a.shapes||{})[n.id]:n.shape;
  let c=ask.length?" ask":"";if(aS)c+=" slot"+(shp?"":" empty");if(R.ui.n===n.id)c+=" sel";
  if(ch&&ask.length)c+=ask.every(k=>fcOk(n,k,a))?" ok":" bad";
  const badge=ask.length?`<i class="fnb">${++num}</i>`:"";
  const txt=aT?`<input class="fcin${ch?(fcOk(n,"text",a)?" ok":" bad"):""}" data-fc="${esc(n.id)}" value="${esc((a.text||{})[n.id]||"")}" ${ch?"readonly":""} autocomplete="off" autocapitalize="off" aria-label="Text for shape ${num}">`:esc(n.text||"");
  return `<div class="fn ${n.shape}${c}" style="left:${n.x-w/2}%;top:${(n.y-h/2)/H*100}%;width:${w}%;height:${h/H*100}%"><div class="fs"${aS&&!ch?` data-a="fcn:${esc(n.id)}"`:""}>${fcShape(shp||"process",w,h)}</div><div class="ft${n.shape==="decision"?" dc":""}">${txt}</div>${badge}</div>`}).join("");
 const anyShape=q.nodes.some(n=>fcAsk(n).includes("shape"));
 const pal=anyShape?`<div class="fpal">${(q.shapes||Object.keys(FSHAPES)).map(s=>`<button class="fps" data-a="fcs:${s}">${fcShape(s,5.2,3,"fpi")}<span>${FSHAPES[s]}</span></button>`).join("")}</div>`:"";
 const note=anyShape?"Tap a dashed slot, then the shape that belongs there. Tap a placed shape to remove it."+(q.nodes.some(n=>fcAsk(n).includes("text"))?" Type the missing text into the boxes.":""):"Type the missing text into the boxes.";
 return `<div class="note">${note}</div><div class="card fcb"><div class="fcw" style="aspect-ratio:100/${H}"><svg class="fce" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="fca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1c2a5e"/></marker></defs>${edges}</svg>${nodes}</div></div>${pal}`
 +`<div style="height:14px"></div>`}
