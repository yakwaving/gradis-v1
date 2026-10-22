function scr(n){S.scr=n;render()}
const DEPTH={boot:-1,home:0,error:0,subjects:1,hist:1,subres:2,list:2,landing:3,q:4,done:5,result:5,review:6},TABS=["home","subjects","hist"];
const calm=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
/* page transition: the old screen is copied, slides out and fades; the new one slides in. fwd=true goes deeper, false goes back. */
function slideIn(A,old,fwd){const nu=A.firstElementChild;if(!nu||!old||calm())return;
 const c=old.cloneNode(true);c.querySelectorAll("[id]").forEach(e=>e.removeAttribute("id"));c.classList.remove("an");c.classList.add("out");c.setAttribute("aria-hidden","true");
 c.style.setProperty("--ox",fwd?"-26px":"26px");nu.style.setProperty("--dx",fwd?"38px":"-38px");nu.classList.add("an");A.insertBefore(c,nu);setTimeout(()=>c.remove(),340)}
function render(){document.querySelectorAll(".modal").forEach(m=>m.remove());const A=$("app"),old=A.firstElementChild,prev=S.shown;A.innerHTML=SCR[S.scr]();
 if(prev&&prev!==S.scr){const a=DEPTH[prev]==null?0:DEPTH[prev],b=DEPTH[S.scr]==null?0:DEPTH[S.scr];slideIn(A,old,b!==a?b>a:TABS.indexOf(S.scr)>=TABS.indexOf(prev))}
 S.shown=S.scr;bind()}
const SCR={};
const stat=n=>{const h=HIST.filter(x=>x.s===n);return{done:new Set(h.map(x=>x.q)).size,avg:h.length?Math.round(h.reduce((a,x)=>a+x.p,0)/h.length):null}};
const sh=(d,k)=>Array.from({length:k},(_,i)=>`${i+1}px ${i+1}px 0 ${d}`).join(",");
const subIcon=(x,sz)=>x.ic?x.ic:`<span style="font:800 ${sz||26}px 'DM Sans';color:#fff">${esc(x.g)}</span>`;
const topBar=(t,r)=>`<div class="top"><div class="logo">${LOGO.badge(44)}${t==="gradis"?LOGO.word(38):`<div class="lw">${t}</div>`}</div>${r||""}</div>`;
const streak=()=>{let k=HIST.some(h=>h.ago===0)?0:1;const s=k;while(HIST.some(h=>h.ago===k))k++;return k-s};
const PER={day:{n:"LAST ATTEMPT",sub:"Today vs yesterday",cmp:"yesterday",cur:h=>h.ago===0,prev:h=>h.ago===1},week:{n:"WEEK",sub:"This week vs last week",cmp:"last week",cur:h=>h.ago<7,prev:h=>h.ago>=7&&h.ago<14},all:{n:"OVERALL",sub:"Everything so far",cur:h=>true}};
const agg=a=>{const n=a.length,by={};a.forEach(h=>(by[h.s]=by[h.s]||[]).push(h.p));const subs=Object.entries(by).map(([s,v])=>({s,avg:Math.round(v.reduce((x,y)=>x+y,0)/v.length)})).sort((x,y)=>y.avg-x.avg);return{n,avg:n?Math.round(a.reduce((x,h)=>x+h.p,0)/n):null,marks:a.reduce((x,h)=>x+h.got,0),subs,best:subs[0]||null}};
const dl=(c,p,u)=>{if(p==null||c==null)return `<em class="dl n">NEW</em>`;const d=c-p;if(!d)return `<em class="dl n">＝ SAME</em>`;return `<em class="dl ${d>0?"up":"dn"}">${d>0?"▲ +":"▼ −"}${Math.abs(d)}${u||""}</em>`};
function seriesFor(k){const H=HIST.slice().reverse();
 if(k==="day"){const f=a=>H.filter(h=>h.ago===a).map(h=>h.p);const m=(v)=>v.map((y,i)=>({x:v.length>1?i/(v.length-1):.5,y}));return{cur:m(f(0)),prev:m(f(1)),l:["",""]}}
 if(k==="week"){const f=(lo,base)=>{const o=[];for(let d=0;d<7;d++){const v=H.filter(h=>h.ago===base-d);if(v.length)o.push({x:d/6,y:Math.round(v.reduce((a,h)=>a+h.p,0)/v.length)})}return o};return{cur:f(0,6),prev:f(0,13),l:["6 DAYS AGO","TODAY"]}}
 return{cur:H.map((h,i)=>({x:H.length>1?i/(H.length-1):.5,y:h.p})),prev:[],l:["FIRST","LATEST"]}}
function chartSvg(k,ser){const W=500,Ht=150,L=34,R=12,T=12,B=24,{cur,prev,l}=ser||seriesFor(k);
 const X=x=>L+x*(W-L-R),Y=y=>T+(100-y)/100*(Ht-T-B);
 const path=pts=>{if(!pts.length)return"";const P=pts.map(q=>[X(q.x),Y(q.y)]);if(P.length===1)return`M${P[0][0]-6},${P[0][1]}h12`;let d=`M${P[0][0]},${P[0][1]}`;for(let i=0;i<P.length-1;i++){const p0=P[i-1]||P[i],p1=P[i],p2=P[i+1],p3=P[i+2]||p2;const c=(a,b)=>Math.max(Y(100),Math.min(Y(0),b));d+=` C${p1[0]+(p2[0]-p0[0])/6},${c(0,p1[1]+(p2[1]-p0[1])/6)} ${p2[0]-(p3[0]-p1[0])/6},${c(0,p2[1]-(p3[1]-p1[1])/6)} ${p2[0]},${p2[1]}`}return d};
 const grid=[0,50,100].map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#d5def5" stroke-width="2" ${v?'stroke-dasharray="4 5"':''}/><text x="${L-8}" y="${Y(v)+4}" text-anchor="end" font="" style="font:800 10px 'DM Sans'" fill="#5b6a9a">${v}</text>`).join("");
 const dots=cur.map((q,i)=>`<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="${i===cur.length-1?7:5}" fill="${i===cur.length-1?"#ffcb3d":"#1c2a5e"}" stroke="#1c2a5e" stroke-width="3"/>`).join("");
 const pd=prev.map(q=>`<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="3.5" fill="#fff" stroke="#97a5c9" stroke-width="2.5"/>`).join("");
 return `<svg viewBox="0 0 ${W} ${Ht}" class="chart">${grid}${prev.length?`<path d="${path(prev)}" fill="none" stroke="#97a5c9" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>`:""}${pd}<path d="${path(cur)}" fill="none" stroke="#1c2a5e" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}${l[0]?`<text x="${L}" y="${Ht-5}" style="font:800 10px 'DM Sans';letter-spacing:.12em" fill="#5b6a9a">${l[0]}</text><text x="${W-R}" y="${Ht-5}" text-anchor="end" style="font:800 10px 'DM Sans';letter-spacing:.12em" fill="#5b6a9a">${l[1]}</text>`:""}</svg>`}
function rankCard(r,lb){if(!r)return `<div class="card rc e"><small>${lb}</small><b>—</b><span>Not enough data</span></div>`;const c=sub(r.s);return `<div class="card rc" style="border-left:9px solid ${c.c}" data-a="subjgo:${esc(r.s)}:home"><small>${lb}</small><b>${esc(r.s)}</b><div class="g">${grade(r.avg)[1]}<span>${r.avg}%</span></div><div class="bar"><i style="width:${r.avg}%;background:${c.c}"></i></div></div>`}
function tilesHtml(k){const P=PER[k],c=agg(HIST.filter(P.cur)),p=P.prev?agg(HIST.filter(P.prev)):null,all=k==="all";
 const pv=p&&p.n?p:null;const D=(cv,pvv,u)=>all?`<em class="dl x"></em>`:dl(cv,pvv,u);
 const prog=pv&&c.avg!=null?c.avg-pv.avg:null;
 const progTile=all?`<div class="card tl"><small>DAY STREAK</small><b>${streak()}</b><em class="dl x"></em></div>`:`<div class="card tl ${prog==null?"":prog>0?"upb":prog<0?"dnb":""}"><small>PROGRESSION</small><b>${prog==null?"—":(prog>0?"▲":prog<0?"▼":"＝")}</b>${prog==null?'<em class="dl n">NEW</em>':`<em class="dl ${prog>0?"up":prog<0?"dn":"n"}">${prog>0?"+":prog<0?"−":""}${Math.abs(prog)} PTS</em>`}</div>`;
 return `<div class="tiles"><div class="card tl"><small>QUIZZES</small><b>${c.n}</b>${D(c.n,pv&&pv.n)}</div><div class="card tl"><small>AVERAGE</small><b>${c.avg==null?"—":c.avg+"%"}</b>${D(c.avg,pv&&pv.avg,"%")}</div><div class="card tl"><small>TOTAL MARKS</small><b>${c.marks}</b>${D(c.marks,pv&&pv.marks)}</div>
<div class="card tl"><small>BEST SUBJECT</small><b class="nm">${c.best?c.best.s:"—"}</b><em class="dl x"></em></div><div class="card tl"><small>BEST %</small><b>${c.best?c.best.avg+"%":"—"}</b>${D(c.best&&c.best.avg,pv&&pv.best&&pv.best.avg,"%")}</div>${progTile}</div>`}
const chartCard=k=>`<div class="card chw"><div class="lbl">SCORE TREND</div>${chartSvg(k)}</div>`;
function ranksHtml(k){const sb=agg(HIST.filter(PER[k].cur)).subs;return `<div class="ranks">${rankCard(sb[0],"BEST")}${rankCard(sb.length>2?sb[1]:null,"2ND BEST")}${rankCard(sb.length>1?sb[sb.length-1]:null,"WORST")}</div>`}
function dashHtml(){const P=PER[S.dash],all=S.dash==="all";
 return `<div class="dt">${Object.keys(PER).map(k=>`<button class="${S.dash===k?"on":""}" data-a="dtab:${k}">${PER[k].n}</button>`).join("")}</div>
<div class="dcap">${P.sub}${all?"":'<span class="lg"><i></i>now<i class="p"></i>'+P.cmp+'</span>'}</div>${tilesHtml(S.dash)}${chartCard(S.dash)}${ranksHtml(S.dash)}`}
function homeDash(){return `<div class="lbl rowl">THIS WEEK<span class="lg"><i></i>now<i class="p"></i>last week</span></div>${tilesHtml("week")}<div class="lbl rowl" style="margin-top:4px">OVERALL</div>${chartCard("all")}${ranksHtml("all")}`}
const gi=p=>GRADES.findIndex(g=>p>=g[0]);
const gcol=p=>{const i=gi(p);return i<=1?"#2fb5a3":i<=3?"#ffcb3d":"#ff7a59"};
const pdl=d=>d==null?`<em class="dl n">FIRST</em>`:!d?`<em class="dl n">＝ SAME</em>`:`<em class="dl ${d>0?"up":"dn"}">${d>0?"▲ +":"▼ −"}${Math.abs(d)}</em>`;
function resSubjects(){return SUBJ.filter(x=>real(x.n)&&HIST.some(h=>h.s===x.n)).map(x=>{const H=HIST.filter(h=>h.s===x.n),st=stat(x.n),l=H[0],pr=H[1];
 return `<div class="card srow" data-a="rsub:${esc(x.n)}"><div class="sq" style="background:${x.c};box-shadow:${sh(x.d,3)}">${subIcon(x,24)}</div><div style="flex:1;min-width:0"><b>${esc(x.n)}</b><small>${H.length} result${H.length>1?"s":""} · latest ${l.p}%</small><div class="bar"><i style="width:${st.avg}%;background:${x.c}"></i></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><div class="gr sm">${grade(st.avg)[1]}</div>${pdl(pr?l.p-pr.p:null)}</div></div>`}).join("")}
SCR.subres=()=>{const x=sub(S.rsub),H=HIST.filter(h=>h.s===S.rsub).slice().reverse(),n=H.length,first=H[0],last=H[n-1];
 const ser={cur:H.map((h,i)=>({x:n>1?i/(n-1):.5,y:h.p})),prev:[],l:["FIRST","LATEST"]};
 const best=Math.max(...H.map(h=>h.p)),avg=stat(S.rsub).avg,dd=n>1?last.p-H[n-2].p:null,steps=gi(first.p)-gi(last.p);
 const path=H.map((h,i)=>`${i?'<span class="ar">›</span>':""}<span class="gc" style="background:${gcol(h.p)}">${grade(h.p)[1]}</span>`).join("");
 const rows=H.map((h,i)=>({h,d:i?h.p-H[i-1].p:null})).reverse().map(({h,d})=>`<div class="card hist" style="border-left:10px solid ${x.c}"><div class="gr">${grade(h.p)[1]}</div><div><b>${esc(h.t)}</b><small>${h.d} · ${esc(h.m.toUpperCase())} · ${fmt(h.got)}/${h.max} marks</small></div><div style="margin-left:auto;text-align:right"><div class="pc" style="margin:0 0 5px">${h.p}%</div>${pdl(d)}</div></div>`).join("");
 return `<div class="scr"><div class="ph"><button class="iconb" data-a="backres" aria-label="Back">${icoB}</button><h2>${esc(x.n)}</h2></div><div class="body">
<div class="card chw"><div class="lbl">ALL RESULTS · ${n} QUIZ${n>1?"ZES":""}</div>${chartSvg("all",ser)}</div>
<div class="tiles"><div class="card tl"><small>AVERAGE</small><b>${avg}%</b><em class="dl x"></em></div><div class="card tl"><small>LATEST</small><b>${last.p}%</b>${pdl(dd)}</div><div class="card tl"><small>BEST</small><b>${best}%</b><em class="dl x"></em></div></div>
<div class="sec">GRADE PROGRESSION</div>
<div class="card gp"><div class="gpath">${path}</div><div class="gsum ${steps>0?"up":steps<0?"dn":"n"}">${n<2?"Take more quizzes to see progress":steps===0?"Same grade as your first result":(steps>0?"▲ Up ":"▼ Down ")+Math.abs(steps)+" grade"+(Math.abs(steps)>1?"s":"")+" since your first result ("+grade(first.p)[1]+" → "+grade(last.p)[1]+")"}</div></div>
<div class="sec" style="margin-top:20px">EACH RESULT</div>${rows}</div>${navHtml()}</div>`};
function subRows(){const q=S.q.trim().toLowerCase();
 let L=SUBJ.filter(x=>x.n.toLowerCase().includes(q));
 if(S.flt==="started")L=L.filter(x=>real(x.n)&&stat(x.n).done);
 if(S.flt==="new")L=L.filter(x=>!(real(x.n)&&stat(x.n).done));
 L.sort((a,b)=>a.n.localeCompare(b.n));
 if(!L.length)return `<div class="empty"><b>No subjects found</b><small>Try a different word or filter.</small></div>`;
 let cur="";return L.map(x=>{const r=real(x.n),st=r?stat(x.n):{done:0,avg:null},n=r?DATA[x.n].length:0,L1=x.n[0].toUpperCase();
  const hd=L1!==cur?(cur=L1,`<div class="az">${L1}</div>`):"";
  const pr=n?Math.min(100,Math.round(st.done/n*100)):0;
  return hd+`<div class="card srow" data-a="${r?"subjgo:"+x.n+":subjects":"toast:Quizzes for this subject are coming soon"}"><div class="sq" style="background:${x.c};box-shadow:${sh(x.d,3)}">${subIcon(x,24)}</div><div style="flex:1;min-width:0"><b>${esc(x.n)}</b><small>${n?n+" quiz"+(n>1?"zes":"")+(st.done?" · "+st.done+" done":""):"Coming soon"}</small><div class="bar"><i style="width:${pr}%;background:${x.c}"></i></div></div>${st.avg!=null?`<div class="gr sm">${grade(st.avg)[1]}</div>`:(r?'<span class="chip">NEW</span>':'<span class="chip">SOON</span>')}</div>`}).join("")}
SCR.subjects=()=>`<div class="scr">${topBar("subjects")}
<div class="srch">${gicon("search")}<input id="sq" placeholder="Search ${SUBJ.length} subject${SUBJ.length===1?"":"s"}" value="${esc(S.q)}" autocomplete="off"></div>
<div class="flt">${[["all","ALL"],["started","STARTED"],["new","NOT STARTED"]].map(([k,t])=>`<button class="${S.flt===k?"on":""}" data-a="flt:${k}">${t}</button>`).join("")}</div>
<div class="body" id="sl">${subRows()}</div>${navHtml()}</div>`;
function navHtml(){const T=[["home","HOME",icoHome],["subjects","SUBJECTS",icoBook],["results","RESULTS",icoChart]];return `<div class="nav">${T.map(([k,t,i])=>`<button class="${S.tab===k?"on":""}" data-a="tab:${k}">${i}${t}</button>`).join("")}</div>`}
SCR.hist=()=>`<div class="scr"><div class="top"><div class="logo">${LOGO.badge(44)}<div class="lw">results</div></div><button class="iconb" data-a="export" aria-label="Export">${gicon("ios_share")}</button></div>
<div class="body"><div id="dash">${dashHtml()}</div><div class="sec" style="margin-top:24px">YOUR SUBJECTS</div>${resSubjects()}</div>${navHtml()}</div>`;
SCR.list=()=>{const s=sub(S.subj),qs=DATA[S.subj];return `<div class="scr"><div class="ph"><button class="iconb" data-a="backlist" aria-label="Back">${icoB}</button><h2>${esc(s.n)}</h2></div>
<div class="body" style="padding:0"><div class="hero" style="background:${s.c};box-shadow:1px 1px 0 ${s.d},2px 2px 0 ${s.d},3px 3px 0 ${s.d},4px 4px 0 ${s.d}"><h1>${qs.length} quiz${qs.length>1?"zes":""}</h1><p>${esc(s.desc||[qs[0].topic,qs[0].level].filter(Boolean).join(" · "))}</p></div><div style="padding:0 20px">${qs.map((qz,i)=>{const b=HIST.filter(h=>h.q===qz.qid).sort((a,b)=>b.p-a.p)[0];return `<div class="card qrow" data-a="quiz:${i}"><div class="qn" style="background:${s.c}">${String(i+1).padStart(2,"0")}</div><div style="flex:1"><b>${esc(qz.title)}</b><div class="chips"><span class="chip">${esc(qz.difficulty.toUpperCase())}</span><span class="chip">${qz.questions.length} QUESTIONS</span><span class="chip">${gicon("schedule","width:13px;height:13px")}${qz.timerType==="wholeQuiz"?Math.round(qz.totalTime/60)+" MIN":qz.totalTime+" S EACH"}</span>${qz.confidence?'<span class="chip y">CONFIDENCE</span>':''}${qz.pre&&qz.pre.length?'<span class="chip b">SUMMARY</span>':''}</div></div>${b?`<div class="gr">${grade(b.p)[1]}</div>`:'<div class="gr n">NEW</div>'}</div>`}).join("")}</div></div></div>`};
SCR.landing=()=>{const qz=S.quiz,s=sub(S.subj),tp=[...new Set(qz.questions.map(q=>q.type))],tm=qz.questions.reduce((a,q)=>a+q.marks,0);return `<div class="scr"><div class="ph"><button class="iconb" data-a="back-list" aria-label="Back">${icoB}</button><h2>${esc(s.n)}</h2></div>
<div class="body" style="padding:0"><div class="hero" style="background:${s.c};box-shadow:1px 1px 0 ${s.d},2px 2px 0 ${s.d},3px 3px 0 ${s.d},4px 4px 0 ${s.d}"><h1>${esc(qz.title)}</h1><p>${esc(qz.description)}</p><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><span class="chip n">${esc(qz.level)}</span><span class="chip n">${esc(qz.difficulty.toUpperCase())}</span>${qz.confidence?'<span class="chip y">CONFIDENCE ON</span>':''}</div></div>
<div class="stats"><div class="card stat"><b>${qz.questions.length}</b><small>QUESTIONS</small></div><div class="card stat"><b>${tm}</b><small>MARKS</small></div><div class="card stat"><b>${qz.timerType==="wholeQuiz"?Math.round(qz.totalTime/60)+"m":qz.totalTime+"s"}</b><small>${qz.timerType==="wholeQuiz"?"TOTAL":"PER QUESTION"}</small></div></div>
<div style="padding:0 20px"><div class="lbl" style="margin-bottom:8px">QUESTION TYPES</div><div style="display:flex;gap:7px;flex-wrap:wrap">${tp.map(t=>`<span class="chip">${TYPES[t]}</span>`).join("")}</div></div>
<div class="lbl" style="margin:20px 20px 0">MODE</div><div class="seg3">${MODES.map(m=>`<button class="${S.mode===m[0]?"on":""}" data-a="mode:${m[0]}">${m[1]}<small>${m[2]}</small></button>`).join("")}</div>
${S.mode==="study"&&qz.pre&&qz.pre.length?`<div class="card sumn"><b>${qz.pre.length} summary page${qz.pre.length>1?"s":""} in Study mode</b><small>${qz.pre.map(p=>esc(p.title)).join(" · ")}</small></div>`:""}<div class="card inst"><div class="lbl">BEFORE YOU START</div><ul>${qz.instructions.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div><div style="height:16px"></div></div>
<div class="foot"><button class="btn" id="go" data-a="start">START ${S.mode.toUpperCase()}</button></div></div>`};
/* ---------- result / review / done ---------- */
SCR.result=()=>{const R=S.run,g=grade(R.pct);const qs=R.qz.questions;const cal=R.cal,calMax=qs.length*2,pos=cal==null?0:Math.max(0,Math.min(100,(cal+calMax)/(2*calMax)*100));
 const calMsg=cal==null?"":cal>=calMax*.5?"Your confidence matched your answers. Great calibration.":cal>=0?"Mostly well calibrated. Watch the few you were certain about.":"You were often certain and wrong. Those are the ones to review first.";
 return `<div class="scr"><div class="body" style="padding:0"><div class="rt"><div class="lbl">${esc(R.qz.title.toUpperCase())}</div><div class="stamp">${g[1]}</div><h1>${g[2]}</h1><p>${R.mode.toUpperCase()} · ${fmtT(R.t)} taken</p></div>
<div class="sc2"><div class="card"><b>${fmt(R.got)}<span style="font-size:20px;opacity:.5">/${R.max}</span></b><small>MARKS</small></div><div class="card"><b>${R.pct}%</b><small>SCORE</small></div></div>
${cal!=null?`<div class="card cal"><h4>Calibration score<em>${cal>0?"+":""}${fmt(cal)}</em></h4><div class="gauge"><i style="left:50%" id="gi"></i></div><p>${calMsg}</p><p style="margin-top:6px;opacity:.8">Marks are never changed by confidence. This is a separate score.</p></div>`:""}
<div id="adbox"></div><div class="lbl" style="margin:0 20px 8px">YOUR ANSWERS</div><div class="strip">${R.res.map((r,i)=>`<button class="${stateOf(r)}" data-a="rev:${i}">${i+1}</button>`).join("")}</div><div style="height:12px"></div></div>
<div class="foot"><button class="btn w" data-a="home" style="flex:.6">HOME</button><button class="btn" data-a="review">REVIEW</button></div></div>`};
SCR.review=()=>{const R=S.run,qs=R.qz.questions;const items=qs.map((q,i)=>({q,i,r:R.res[i],a:R.ans[i],c:R.conf[i]}));const cbw=items.filter(x=>x.c===2&&x.r.got<x.r.max);const rest=items.filter(x=>!cbw.includes(x));
 const card=(x,flag)=>{const st=stateOf(x.r),col={ok:"var(--ok)",part:"var(--part)",bad:"var(--bad)"}[st];return `<div class="card rv" id="rv${x.i}" style="border-left:10px solid ${col}">${flag?`<div class="flag">⚠ CERTAIN BUT WRONG</div>`:""}<div class="h"><span class="n" style="background:${col};${st==="part"?"color:#1c2a5e":""}">${x.i+1}</span><span class="chip">${TYPES[x.q.type]}</span>${x.c!=null?`<span class="chip">${["GUESS","FAIRLY SURE","CERTAIN"][x.c]}</span>`:""}<em>${fmt(x.r.got)}/${x.r.max}</em></div><div class="q">${md(x.q.type==="assertion"?x.q.assertion:x.q.question.split("\n")[0])}</div><div class="a ${st==="ok"?"c":"y"}"><b>YOURS</b><span>${md(showA(x.q,x.a))}</span></div><div class="a c"><b>CORRECT</b><span>${md(showC(x.q))}</span></div><div class="ex">${md(x.q.explanation)}</div></div>`};
 return `<div class="scr"><div class="ph"><button class="iconb" data-a="result" aria-label="Back">${icoB}</button><h2>Review</h2></div><div class="body">${cbw.length?`<div class="sec">REVIEW THESE FIRST</div>${cbw.map(x=>card(x,1)).join("")}<div class="sec">ALL OTHER QUESTIONS</div>`:""}${rest.map(x=>card(x)).join("")}</div></div>`};
SCR.done=()=>`<div class="scr"><div class="body" style="padding:0"><div class="rt" style="padding-top:150px"><div class="stamp" style="background:var(--blu);color:#fff;box-shadow:1px 1px 0 var(--blud),2px 2px 0 var(--blud),3px 3px 0 var(--blud),4px 4px 0 var(--blud),5px 5px 0 var(--blud)">✓</div><h1>Study complete</h1><p>${S.run.qz.questions.filter(q=>q.type!=="summary").length} questions read · nothing graded</p></div></div><div class="foot"><button class="btn w" data-a="home" style="flex:.6">HOME</button><button class="btn" data-a="landing">TEST YOURSELF</button></div></div>`;
const iconSm=x=>x.ic?x.ic.replace(/<svg /,'<svg style="width:30px;height:30px;display:block" '):`<span style="font:800 24px 'DM Sans';color:#fff">${esc(x.g)}</span>`;
SCR.home=()=>{
 const sk=streak(),sv=savedRun(),has=HIST.length>0,cards=[];
 const ring=(x,bg)=>`<div class="ring" style="background:${bg||"rgba(255,255,255,.25)"}"><i style="background:none;width:auto;height:auto">${x}</i></div>`;
 if(sv){const n=sv.qz.questions.length;cards.push(`<div class="card cont sl" data-a="resume"><div class="ring" style="background:conic-gradient(var(--y) ${Math.round(sv.i/n*100)}%,rgba(255,255,255,.25) 0)"><i>${sv.i}/${n}</i></div><div style="flex:1;min-width:0"><small>CONTINUE</small><b>${esc(sv.qz.title)}</b><small>Question ${sv.i+1} · ${sv.mode.charAt(0).toUpperCase()+sv.mode.slice(1)} mode</small></div><span class="chip y">GO ›</span></div>`)}
 if(has){
  const last=HIST[0],ls=sub(last.s),lq=DATA[last.s]||[];
  if(lq.length){const nxt=lq.findIndex(z=>!HIST.some(h=>h.q===z.qid)),qi=nxt<0?0:nxt;
   cards.push(`<div class="card cont sl" style="background:${ls.c};box-shadow:${sh(ls.d,4)}" data-a="quizgo:${esc(ls.n)}:${qi}">${ring(iconSm(ls))}<div style="flex:1;min-width:0"><small>LATEST SUBJECT</small><b>${esc(ls.n)}</b><small>${nxt<0?"Try again":"Next up"}: ${esc(lq[qi].title)}</small></div><span class="chip y">GO ›</span></div>`)}
  const ov=agg(HIST.filter(h=>real(h.s))).subs;
  if(ov.length){const ws=sub(ov[ov.length-1].s),w=HIST.filter(h=>h.s===ws.n).sort((a,b)=>a.p-b.p)[0],wi=Math.max(0,DATA[ws.n].findIndex(z=>z.qid===w.q));
   cards.push(`<div class="card cont sl" style="background:var(--cor);box-shadow:${sh("#c4492b",4)}" data-a="quizgo:${esc(ws.n)}:${wi}">${ring(gicon("trending_up","width:30px;height:30px;color:#fff"))}<div style="flex:1;min-width:0"><small>IMPROVE YOUR WEAKNESS</small><b>${esc(w.t)}</b><small>${esc(ws.n)} · best so far ${w.p}% · retry it</small></div><span class="chip y">GO ›</span></div>`)}
 }else{
  cards.push(`<div class="card cont sl" style="background:var(--blu);box-shadow:${sh("#3a5fc4",4)}" data-a="tab:subjects">${ring(gicon("arrow_forward","width:30px;height:30px;color:#fff"))}<div style="flex:1;min-width:0"><small>GET STARTED</small><b>Take your first quiz</b><small>Pick a subject to begin</small></div><span class="chip y">GO ›</span></div>`)}
 return `<div class="scr">${topBar("gradis",`<button class="iconb" data-a="settings" aria-label="Settings">${gicon("settings")}</button>`)}
<div class="body" style="padding:0"><div class="hi"><h1>${has?"Welcome back":"Welcome"}</h1><p>${has?(sk?sk+"-day streak. Every quiz counts, keep going.":"Every quiz counts. Let's go."):"Pick a subject and take your first quiz."}</p></div>
<div class="slider" id="slr">${cards.join("")}</div><div class="dots" id="dts">${cards.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div>
${has?`<div class="pad" style="padding-top:8px">${homeDash()}</div>
<div class="pad"><div class="lbl rowl">RECENT RESULTS<button class="lnk" data-a="tab:results">ALL ›</button></div>${HIST.slice(0,2).map(h=>{const g=grade(h.p);return `<div class="card hist" style="border-left:10px solid ${sub(h.s).c}"><div class="gr">${g[1]}</div><div><b>${esc(h.t)}</b><small>${h.d} · ${esc(h.m.toUpperCase())} · ${fmt(h.got)}/${h.max} marks</small></div><div class="pc">${h.p}%</div></div>`}).join("")}</div>`
 :`<div class="card empty-home"><b>Your stats will appear here</b><small>Scores, streaks and your best subjects show up after your first quiz.</small></div>`}<div style="height:10px"></div></div>${navHtml()}</div>`};
SCR.error=()=>`<div class="scr"><div class="boot">${LOGO.badge(84)}<div>Couldn't load the quizzes</div><div style="font:600 14px 'DM Sans';letter-spacing:0;padding:0 30px">${(S.err&&S.err.message)||"Check your connection and try again."}</div><button class="btn" data-a="retry">TRY AGAIN</button></div></div>`;
