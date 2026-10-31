function scr(n){S.scr=n;render()}
const DEPTH={boot:-1,home:0,error:0,subjects:1,hist:1,subres:2,list:2,landing:3,q:4,done:5,result:5,review:6,acct:1},TABS=["home","subjects","hist"];
const calm=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
/* page transition: the old screen is copied, slides out and fades; the new one slides in. fwd=true goes deeper, false goes back. */
function slideIn(A,old,fwd){const nu=A.firstElementChild;if(!nu||!old||calm())return;
 const c=old.cloneNode(true);c.querySelectorAll("[id]").forEach(e=>e.removeAttribute("id"));c.classList.remove("an");c.classList.add("out");c.setAttribute("aria-hidden","true");
 c.style.setProperty("--ox",fwd?"-26px":"26px");nu.style.setProperty("--dx",fwd?"38px":"-38px");nu.classList.add("an");A.insertBefore(c,nu);setTimeout(()=>c.remove(),340)}
function render(){document.querySelectorAll(".modal").forEach(m=>m.remove());const A=$("app"),old=A.firstElementChild,prev=S.shown;A.innerHTML=SCR[S.scr]();
 if(prev&&prev!==S.scr){const a=DEPTH[prev]==null?0:DEPTH[prev],b=DEPTH[S.scr]==null?0:DEPTH[S.scr];slideIn(A,old,b!==a?b>a:TABS.indexOf(S.scr)>=TABS.indexOf(prev))}
 S.shown=S.scr;bind();if(S.scr==="acct")acPost()}
const SCR={};
const stat=n=>{const h=HIST.filter(x=>x.s===n);return{done:new Set(h.map(x=>x.q)).size,avg:h.length?Math.round(h.reduce((a,x)=>a+x.p,0)/h.length):null}};
const sh=(d,k)=>Array.from({length:k},(_,i)=>`${i+1}px ${i+1}px 0 ${d}`).join(",");
const subIcon=(x,sz)=>x.ic?x.ic:`<span style="font:800 ${sz||26}px 'DM Sans';color:#fff">${esc(x.g)}</span>`;
const topBar=(t,r)=>`<div class="top"><div class="logo">${LOGO.badge(44)}${t==="gradis"?LOGO.word(38):`<div class="lw">${t}</div>`}</div>${r||""}</div>`;
const streak=()=>streakInfo().cur;
const PER={day:{n:"LAST ATTEMPT",get sub(){const a=prevActiveAgo();return a==null?"Today":"Today vs "+(a===1?"yesterday":dayLbl(a,Date.now()-a*864e5).toLowerCase())},get cmp(){const a=prevActiveAgo();return a==null?"":a===1?"yesterday":dayLbl(a,Date.now()-a*864e5).toLowerCase()},cur:h=>h.ago===0,prev:h=>{const a=prevActiveAgo();return a!=null&&h.ago===a}},week:{n:"WEEK",sub:"This week vs last week",cmp:"last week",cur:h=>inWeek(h,0),prev:h=>inWeek(h,1)},all:{n:"OVERALL",sub:"Everything so far",cur:h=>true}};
const agg=a=>{const n=a.length,by={};a.forEach(h=>(by[h.s]=by[h.s]||[]).push(h.p));const subs=Object.entries(by).map(([s,v])=>({s,avg:Math.round(v.reduce((x,y)=>x+y,0)/v.length)})).sort((x,y)=>y.avg-x.avg);return{n,avg:n?Math.round(a.reduce((x,h)=>x+h.p,0)/n):null,marks:a.reduce((x,h)=>x+h.got,0),subs,best:subs[0]||null}};
const dl=(c,p,u)=>{if(p==null||c==null)return `<em class="dl n">NEW</em>`;const d=c-p;if(!d)return `<em class="dl n">＝ SAME</em>`;return `<em class="dl ${d>0?"up":"dn"}">${d>0?"▲ +":"▼ −"}${Math.abs(d)}${u||""}</em>`};
const dlab=ts=>new Date(ts).toLocaleDateString(undefined,{day:"numeric",month:"short"});
function seriesFor(k){const H=HIST.slice().reverse();
 if(k==="day"){const pa=prevActiveAgo(),f=a=>a==null?[]:H.filter(h=>h.ago===a);const m=v=>v.map((h,i)=>({x:v.length>1?i/(v.length-1):.5,y:h.p,t:h.t+" · "+h.p+"%"}));
  return{cur:m(f(0)),prev:m(f(pa)),l:["",""],empty:"No quiz yet today",hint:"Tap a dot to see the quiz",pl:"Earlier"}}
 if(k==="week"){const ti=(dayNum(Date.now())+3)%7;
  const slot=off=>{const base=(weekNum(Date.now())-off)*7-3,o=[];for(let d=0;d<7;d++){const v=H.filter(h=>dayNum(h.ts)===base+d);if(v.length){const av=Math.round(v.reduce((a,h)=>a+h.p,0)/v.length);o.push({x:d/6,i:d,y:av,t:new Date((base+d)*864e5).toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short",timeZone:"UTC"})+" · "+v.length+" quiz"+(v.length>1?"zes":"")+" · avg "+av+"%"})}}return o};
  return{cur:slot(0),prev:slot(1),xl:["M","T","W","T","F","S","S"],ti,l:["",""],empty:"No quizzes this week yet",hint:"Tap a dot to see the day",pl:"Last week"}}
 return{cur:H.map((h,i)=>({x:H.length>1?i/(H.length-1):.5,y:h.p,t:dlab(h.ts)+" · "+h.t+" · "+h.p+"%"})),prev:[],l:["FIRST","LATEST"],empty:"No results yet",hint:"Tap a dot to see the quiz"}}
let CH={},CHN=0;
function chartSvg(k,ser){ser=ser||seriesFor(k);const W=500,Ht=150,L=34,R=12,T=12,B=24,{cur,prev,l,xl,ti}=ser,id=++CHN;CH[id]=ser;
 const X=x=>L+x*(W-L-R),Y=y=>T+(100-y)/100*(Ht-T-B);
 const curve=P=>{let d=`M${P[0][0]},${P[0][1]}`;for(let i=0;i<P.length-1;i++){const p0=P[i-1]||P[i],p1=P[i],p2=P[i+1],p3=P[i+2]||p2;const c=(a,b)=>Math.max(Y(100),Math.min(Y(0),b));d+=` C${p1[0]+(p2[0]-p0[0])/6},${c(0,p1[1]+(p2[1]-p0[1])/6)} ${p2[0]-(p3[0]-p1[0])/6},${c(0,p2[1]-(p3[1]-p1[1])/6)} ${p2[0]},${p2[1]}`}return d};
 const runs=pts=>{const o=[];let r=[];pts.forEach((q,i)=>{if(i&&q.i!=null&&pts[i-1].i!=null&&q.i-pts[i-1].i>1){o.push(r);r=[]}r.push(q)});if(r.length)o.push(r);return o};
 const path=pts=>runs(pts).map(r=>{const P=r.map(q=>[X(q.x),Y(q.y)]);return P.length>1?curve(P):(pts.length===1?`M${P[0][0]-6},${P[0][1]}h12`:"")}).join("");
 const slotW=(W-L-R)/6;
 const band=xl&&ti!=null?`<rect x="${X(ti/6)-slotW/2+3}" y="${T-4}" width="${slotW-6}" height="${Ht-T-B+8}" rx="9" fill="#fff3c4" opacity=".75"/>`:"";
 const guides=xl?xl.map((c,i)=>`<line x1="${X(i/6)}" x2="${X(i/6)}" y1="${T}" y2="${Y(0)}" stroke="#e6ecfb" stroke-width="2"/>`).join(""):"";
 const grid=[0,50,100].map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#d5def5" stroke-width="2" ${v?'stroke-dasharray="4 5"':''}/><text x="${L-8}" y="${Y(v)+4}" text-anchor="end" style="font:800 10px 'DM Sans'" fill="#5b6a9a">${v}</text>`).join("");
 const dots=cur.map((q,i)=>`<circle id="dt-${id}-c-${i}" class="dtp" cx="${X(q.x)}" cy="${Y(q.y)}" r="${i===cur.length-1?7:5}" fill="${i===cur.length-1?"#ffcb3d":"#1c2a5e"}" stroke="#1c2a5e" stroke-width="3"/>`).join("");
 const pd=prev.map((q,i)=>`<circle id="dt-${id}-p-${i}" class="dtp" cx="${X(q.x)}" cy="${Y(q.y)}" r="3.5" fill="#fff" stroke="#97a5c9" stroke-width="2.5"/>`).join("");
 const hit=(arr,s)=>arr.map((q,i)=>`<circle class="hit" cx="${X(q.x)}" cy="${Y(q.y)}" r="17" fill="transparent" data-a="dot:${id}:${s}:${i}"/>`).join("");
 const xlab=xl?xl.map((c,i)=>`<text x="${X(i/6)}" y="${Ht-5}" text-anchor="middle" style="font:800 11px 'DM Sans'" fill="${i===ti?"#1c2a5e":"#5b6a9a"}" ${ti!=null&&i>ti?'opacity=".4"':""}>${c}</text>`).join(""):(l[0]?`<text x="${L}" y="${Ht-5}" style="font:800 10px 'DM Sans';letter-spacing:.12em" fill="#5b6a9a">${l[0]}</text><text x="${W-R}" y="${Ht-5}" text-anchor="end" style="font:800 10px 'DM Sans';letter-spacing:.12em" fill="#5b6a9a">${l[1]}</text>`:"");
 const emp=!cur.length?`<text x="${W/2}" y="${Y(50)+4}" text-anchor="middle" style="font:800 12px 'DM Sans'" fill="#8a97c0">${prev.length||!ser.empty?(ser.empty||""):ser.empty}</text>`:"";
 return `<svg viewBox="0 0 ${W} ${Ht}" class="chart">${band}${guides}${grid}${prev.length?`<path d="${path(prev)}" fill="none" stroke="#97a5c9" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>`:""}${pd}<path d="${path(cur)}" fill="none" stroke="#1c2a5e" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}${emp}${xlab}${hit(prev,"p")}${hit(cur,"c")}</svg><div class="cdet" id="cd-${id}">${ser.hint||""}</div>`}
function rankCard(r,lb){if(!r)return `<div class="card rc e"><small>${lb}</small><b>—</b><span>Not enough data</span></div>`;const c=sub(r.s);return `<div class="card rc" style="border-left:9px solid ${c.c}" data-a="subjgo:${esc(r.s)}:home"><small>${lb}</small><b>${esc(r.s)}</b><div class="g">${grade(r.avg)[1]}<span>${r.avg}%</span></div><div class="bar"><i style="width:${r.avg}%;background:${c.c}"></i></div></div>`}
const FX={
 flame:(a,b,c)=>`<svg class="fx ${c||""}" viewBox="0 0 24 24"><path d="M12 2c.6 3.6 6 6 6 12a6 6 0 0 1-12 0c0-2.6 1.4-4.2 2.6-5.8.4 1.6 1.2 2.4 2.1 2.8C10.3 7.6 10.6 4.6 12 2z" fill="${a}" stroke="#1c2a5e" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 12c.5 1.6 2.7 2.4 2.7 4.7a2.7 2.7 0 0 1-5.4 0c0-1.3.7-2 1.2-2.7.3.6.8.9 1.1 1 0-1-.4-1.8.4-3z" fill="${b}"/></svg>`,
 ice:`<svg class="fx ic" viewBox="0 0 24 24" fill="none" stroke="#2fa8e0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="M9.4 4.6L12 7l2.6-2.4M9.4 19.4L12 17l2.6 2.4"/></svg>`,
 snuff:`<svg class="fx" viewBox="0 0 24 24"><path d="M12 6c.6 3.2 5.4 5.2 5.4 10.4a5.4 5.4 0 0 1-10.8 0c0-2.3 1.2-3.7 2.3-5.1.4 1.4 1.1 2.1 1.9 2.5C10.6 11.6 10.8 8.6 12 6z" fill="#c3cde8" stroke="#8d9bc4" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 2.5c-1.6 1.2 1.2 2.2-.2 3.6M11 1.5c-1.2 1 .8 1.6 0 2.6" fill="none" stroke="#a9b5d6" stroke-width="1.6" stroke-linecap="round"/></svg>`,
 bolt:(f,c)=>`<svg class="fx ${c||""}" viewBox="0 0 24 24"><path d="M13.5 2L5 13.6h5.6L9.6 22 19 9.8h-5.8z" fill="${f}" stroke="${f==="#c3cde8"?"#8d9bc4":"#1c2a5e"}" stroke-width="1.6" stroke-linejoin="round"/></svg>`};
const tkPage=(lb,icon,num,cap,cls)=>`<div class="tkp"><small>${lb}</small><div class="tkn">${icon}<b>${num}</b></div><em class="dl ${cls}">${cap}</em></div>`;
const tkTile=(pages,pl)=>pages.length===1?`<div class="card tl tk1${pl?" pl":""}">${pages[0]}</div>`:`<div class="card tl tks${pl?" pl":""}" data-a="tkflip"><div class="tk">${pages.join("")}</div><div class="tkd">${pages.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div></div>`;
function streakTile(){const s=streakInfo(),rec=s.cur===s.best&&s.cur>0;
 const ic=s.state==="lit"?FX.flame("#ff7a59","#ffcb3d","fl"):s.state==="ice"?FX.ice:FX.snuff;
 const cap=s.state==="lit"?[rec?"RECORD":"ACTIVE","up"]:s.state==="ice"?["STUDY TODAY","ice"]:s.state==="out"?["LOST","dn"]:["START TODAY","n"];
 const p=[tkPage("DAY STREAK",ic,s.cur,cap[0],cap[1])];
 if(s.cur!==s.best)p.push(tkPage("BEST STREAK",FX.flame("#ffcb3d","#fff3b0"),s.best,"DAYS","n"));
 return tkTile(p,S.tab==="home"&&(homeMsg()||{}).kind==="streak")}
function comboTile(){const c=comboInfo(),rec=c.cur===c.best&&c.cur>0;
 const ic=c.state==="live"||c.state==="fading"?FX.bolt("#ffcb3d",c.state==="fading"?"wn":"bz"):FX.bolt("#c3cde8");
 const cap=c.state==="live"?[rec?"RECORD":"IN A ROW","up"]:c.state==="fading"?[c.left===0?"LAST DAY":c.left+(c.left>1?" DAYS":" DAY")+" LEFT","warn"]:c.state==="out"?["ENDED","dn"]:["NO RUN YET","n"];
 const p=[tkPage("COMBO",ic,c.cur,cap[0],cap[1])];
 if(c.cur!==c.best)p.push(tkPage("BEST COMBO",FX.bolt("#ffcb3d"),c.best,c.bestTs?dlab(c.bestTs).toUpperCase():"ANSWERS","n"));
 return tkTile(p,S.tab==="home"&&(homeMsg()||{}).kind==="combo")}
function allProg(){const H=HIST.slice(0,5),r=HIST.slice(5);if(!r.length)return null;return Math.round(H.reduce((a,h)=>a+h.p,0)/H.length)-Math.round(r.reduce((a,h)=>a+h.p,0)/r.length)}
function tilesHtml(k){const P=PER[k],c=agg(HIST.filter(P.cur)),p=P.prev?agg(HIST.filter(P.prev)):null,all=k==="all";
 const pv=p&&p.n?p:null;const D=(cv,pvv,u)=>all?`<em class="dl x"></em>`:dl(cv,pvv,u);
 const prog=all?allProg():(pv&&c.avg!=null?c.avg-pv.avg:null);
 const progTile=`<div class="card tl ${prog==null?"":prog>0?"upb":prog<0?"dnb":""}"><small>PROGRESSION</small><b>${prog==null?"—":(prog>0?"▲":prog<0?"▼":"＝")}</b>${prog==null?'<em class="dl n">NEW</em>':`<em class="dl ${prog>0?"up":prog<0?"dn":"n"}">${prog>0?"+":prog<0?"−":""}${Math.abs(prog)} PTS</em>`}</div>`;
 return `<div class="tiles"><div class="card tl"><small>QUIZZES</small><b>${c.n}</b>${D(c.n,pv&&pv.n)}</div><div class="card tl"><small>AVERAGE</small><b>${c.avg==null?"—":c.avg+"%"}</b>${D(c.avg,pv&&pv.avg,"%")}</div>${progTile}
<div class="card tl"><small>BEST SUBJECT</small><b class="nm">${c.best?esc(c.best.s):"—"}</b><em class="dl x"></em></div>${streakTile()}${comboTile()}</div>`}
const chartCard=k=>`<div class="card chw"><div class="lbl">SCORE TREND</div>${chartSvg(k)}</div>`;
function ranksHtml(k){const sb=agg(HIST.filter(PER[k].cur)).subs;return `<div class="ranks">${rankCard(sb[0],"BEST")}${rankCard(sb.length>2?sb[1]:null,"2ND BEST")}${rankCard(sb.length>1?sb[sb.length-1]:null,"WORST")}</div>`}
function dashHtml(){const P=PER[S.dash],all=S.dash==="all";
 return `<div class="dt">${Object.keys(PER).map(k=>`<button class="${S.dash===k?"on":""}" data-a="dtab:${k}">${PER[k].n}</button>`).join("")}</div>
<div class="dcap">${P.sub}${all?"":'<span class="lg"><i></i>now<i class="p"></i>'+P.cmp+'</span>'}</div>${tilesHtml(S.dash)}${chartCard(S.dash)}${ranksHtml(S.dash)}`}
function homeDash(){const P=PER.day,a=prevActiveAgo();return `<div class="lbl rowl">THIS WEEK<span class="lg"><i></i>now<i class="p"></i>last week</span></div>${tilesHtml("week")}<div class="lbl rowl" style="margin-top:4px">${P.sub.toUpperCase()}<span class="lg"><i></i>now${a==null?"":'<i class="p"></i>'+P.cmp}</span></div>${chartCard("day")}${ranksHtml("all")}`}
const gi=p=>GRADES.findIndex(g=>p>=g[0]);
const gcol=p=>{const i=gi(p);return i<=1?"#2fb5a3":i<=3?"#ffcb3d":"#ff7a59"};
const pdl=d=>d==null?`<em class="dl n">FIRST</em>`:!d?`<em class="dl n">＝ SAME</em>`:`<em class="dl ${d>0?"up":"dn"}">${d>0?"▲ +":"▼ −"}${Math.abs(d)}</em>`;
function resSubjects(){return SUBJ.filter(x=>real(x.n)&&HIST.some(h=>h.s===x.n)).map(x=>{const H=HIST.filter(h=>h.s===x.n),st=stat(x.n),l=H[0],pr=H[1];
 return `<div class="card srow" data-a="rsub:${esc(x.n)}"><div class="sq" style="background:${x.c};box-shadow:${sh(x.d,3)}">${subIcon(x,24)}</div><div style="flex:1;min-width:0"><b>${esc(x.n)}</b><small>${H.length} result${H.length>1?"s":""} · latest ${l.p}%</small><div class="bar"><i style="width:${st.avg}%;background:${x.c}"></i></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><div class="gr sm">${grade(st.avg)[1]}</div>${pdl(pr?l.p-pr.p:null)}</div></div>`}).join("")}
SCR.subres=()=>{const x=sub(S.rsub),H=HIST.filter(h=>h.s===S.rsub).slice().reverse(),n=H.length,first=H[0],last=H[n-1];
 const ser={cur:H.map((h,i)=>({x:n>1?i/(n-1):.5,y:h.p,t:dlab(h.ts)+" · "+h.t+" · "+h.p+"%"})),prev:[],l:["FIRST","LATEST"],hint:"Tap a dot to see the quiz"};
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
 let L=SUBJ.filter(x=>!x.hidden&&x.n.toLowerCase().includes(q));
 if(S.flt==="started")L=L.filter(x=>real(x.n)&&stat(x.n).done);
 if(S.flt==="new")L=L.filter(x=>!(real(x.n)&&stat(x.n).done));
 L.sort((a,b)=>(a.sample-b.sample)||a.n.localeCompare(b.n));
 if(!L.length)return `<div class="empty"><b>No subjects found</b><small>Try a different word or filter.</small></div>`;
 let cur="";return L.map(x=>{const smp=!!x.sample,r=real(x.n),st=r?stat(x.n):{done:0,avg:null},n=r?DATA[x.n].length:0,L1=x.n[0].toUpperCase();
  const hd=smp?(cur!=="~"?(cur="~",`<div class="az">SAMPLES</div>`):""):L1!==cur?(cur=L1,`<div class="az">${L1}</div>`):"";
  const pr=n?Math.min(100,Math.round(st.done/n*100)):0;
  return hd+`<div class="card srow" data-a="${r?"subjgo:"+x.n+":subjects":"toast:Quizzes for this subject are coming soon"}"><div class="sq" style="background:${x.c};box-shadow:${sh(x.d,3)}">${subIcon(x,24)}</div><div style="flex:1;min-width:0"><b>${esc(x.n)}</b><small>${n?n+" quiz"+(n>1?"zes":"")+(st.done?" · "+st.done+" done":"")+(lastStudied(x.n)?" · studied "+lastStudied(x.n).toLowerCase():""):"Coming soon"}</small><div class="bar"><i style="width:${pr}%;background:${x.c}"></i></div></div>${st.avg!=null?`<div class="gr sm">${grade(st.avg)[1]}</div>`:(r?(smp?'<span class="chip">SAMPLE</span>':'<span class="chip">NEW</span>'):'<span class="chip">SOON</span>')}</div>`}).join("")}
SCR.subjects=()=>`<div class="scr">${topBar("subjects")}
<div class="srch">${gicon("search")}<input id="sq" placeholder="Search ${SUBJ.length} subject${SUBJ.length===1?"":"s"}" value="${esc(S.q)}" autocomplete="off"></div>
<div class="flt">${[["all","ALL"],["started","STARTED"],["new","NOT STARTED"]].map(([k,t])=>`<button class="${S.flt===k?"on":""}" data-a="flt:${k}">${t}</button>`).join("")}</div>
<div class="body" id="sl">${subRows()}</div>${navHtml()}</div>`;
function navHtml(){const T=[["home","HOME",icoHome],["subjects","SUBJECTS",icoBook],["results","RESULTS",icoChart]];return `<div class="nav">${T.map(([k,t,i])=>`<button class="${S.tab===k?"on":""}" data-a="tab:${k}">${i}${t}</button>`).join("")}</div>`}
SCR.hist=()=>`<div class="scr"><div class="top"><div class="logo">${LOGO.badge(44)}<div class="lw">results</div></div><button class="iconb" data-a="export" aria-label="Export">${gicon("ios_share")}</button></div>
<div class="body"><div id="dash">${dashHtml()}</div><div class="sec" style="margin-top:24px">YOUR SUBJECTS</div>${resSubjects()}</div>${navHtml()}</div>`;
/* ---------- quiz list, grouped by chapter ---------- */
/* A quiz belongs to a chapter by its "chapter" field, or by its title ("Chapter 3 Quiz 5" -> "Chapter 3", "Tenses Quiz 2" -> "Tenses"). Short or unnamed lists stay flat. */
const chapOf=qz=>qz.chapter||(/\s+Quiz\s+\d+$/i.test(qz.title)?qz.title.replace(/\s+Quiz\s+\d+$/i,""):"");
function quizGroups(qs){const g=[],ix={};qs.forEach((qz,i)=>{const k=chapOf(qz);if(!(k in ix)){ix[k]=g.length;g.push({k,items:[]})}g[ix[k]].items.push({qz,i})});return g}
const bestOf=qz=>{const h=HIST.filter(x=>x.q===qz.qid);return h.length?Math.max(...h.map(x=>x.p)):null};
function qrowHtml(qz,i,n,s,tag){const b=bestOf(qz);return `<div class="card qrow" data-a="quiz:${i}"><div class="qn" style="background:${s.c}">${String(n).padStart(2,"0")}</div><div style="flex:1"><b>${esc(qz.title)}</b><div class="chips">${tag?`<span class="chip y">${tag}</span>`:""}<span class="chip">${esc(qz.difficulty.toUpperCase())}</span><span class="chip">${qz.questions.length} QUESTIONS</span><span class="chip">${gicon("schedule","width:13px;height:13px")}${qz.timerType==="wholeQuiz"?Math.round(qz.totalTime/60)+" MIN":qz.totalTime+" S EACH"}</span>${qz.confidence?'<span class="chip y">CONFIDENCE</span>':''}${qz.pre&&qz.pre.length?'<span class="chip b">SUMMARY</span>':''}</div></div>${b!=null?`<div class="gr">${grade(b)[1]}</div>`:'<div class="gr n">NEW</div>'}</div>`}
/* chapter-finished rewards are remembered so each plays once (chapters already finished before this version are seeded silently) */
const CHK="gradis.v1.chdone",chDone=g=>g.items.every(x=>bestOf(x.qz)!=null);
const isGrouped=(gs,qs)=>gs.length>=2&&qs.length>=8&&gs.every(g=>g.k);
function chSeed(){try{if(localStorage.getItem(CHK)!=null)return;const a=[];Object.keys(DATA).forEach(n=>{const qs=DATA[n],gs=quizGroups(qs);if(isGrouped(gs,qs))gs.forEach(g=>{if(chDone(g))a.push(n+"|"+g.k)})});localStorage.setItem(CHK,JSON.stringify(a))}catch(e){}}
function chNew(n,g){try{const a=JSON.parse(localStorage.getItem(CHK)||"[]"),k=n+"|"+g.k;if(a.includes(k))return false;a.push(k);localStorage.setItem(CHK,JSON.stringify(a));return true}catch(e){return false}}
const diffC=d=>({easy:"#2fb5a3",medium:"#ffcb3d",hard:"#ff7a59",difficult:"#1c2a5e"})[(d||"").toLowerCase()]||"#97a5c9";
const ringHtml=(p,c,txt,sz,done,nw)=>`<div class="clr${done?" dn":""}${nw?" nw":""}" style="--p:${p};--sc:${done?"#ffcb3d":c};width:${sz}px;height:${sz}px"><i style="width:${sz-14}px;height:${sz-14}px">${done?kit("star",{size:Math.round(sz*.5),still:!nw}):txt}</i></div>`;
function qr2(qz,i,n,s,tag,k){const b=bestOf(qz);return `<div class="card qr2${b!=null?" dn":""}" style="--n:${Math.min(k,8)}" data-a="quiz:${i}"><span class="qn2" style="background:${s.c}">${String(n).padStart(2,"0")}</span><div class="qr2t"><b>${esc(qz.title)}</b><small><i class="dfd" style="background:${diffC(qz.difficulty)}"></i><span class="dfn">${esc(qz.difficulty||"")}</span> · ${qz.questions.length} Q · ${qz.timerType==="wholeQuiz"?Math.round(qz.totalTime/60)+" min":qz.totalTime+" s each"}${qz.pre&&qz.pre.length?" · notes":""}</small>${tag?`<span class="chip y">${tag}</span>`:""}</div>${b!=null?`<div class="gr">${grade(b)[1]}</div>`:'<div class="gr n">NEW</div>'}</div>`}
SCR.list=()=>{const s=sub(S.subj),qs=DATA[S.subj];S.open=S.open||{};chSeed();
 const gs=quizGroups(qs),grouped=isGrouped(gs,qs),any=qs.some(z=>bestOf(z)!=null);
 const nu=nextUp(),ci=nu&&nu.s===S.subj?nu.i:qs.findIndex(z=>bestOf(z)==null);
 const tagFor=i=>i===ci?(any?"NEXT UP":"START HERE"):"";
 let body;
 if(!grouped)body=qs.map((qz,i)=>qrowHtml(qz,i,i+1,s,tagFor(i))).join("");
 else{const ng=ci<0?0:gs.findIndex(g=>g.items.some(x=>x.i===ci));
  const isOpen=gi=>(S.subj+"|"+gi) in S.open?S.open[S.subj+"|"+gi]:gi===ng;
  const info=gs.map(g=>{const bests=g.items.map(x=>bestOf(x.qz)).filter(v=>v!=null);return{done:bests.length,pct:Math.round(bests.length/g.items.length*100),avg:bests.length?Math.round(bests.reduce((a,v)=>a+v,0)/bests.length):null,all:chDone(g),nw:false,m:/^Chapter\s+(\d+)$/i.exec(g.k)}});
  info.forEach((f,gi)=>{if(f.all)f.nw=chNew(S.subj,gs[gi])&&!calm()});
  let cont="";
  if(ci>=0){const gi=gs.findIndex(g=>g.items.some(x=>x.i===ci)),f=info[gi];cont=`<div class="card clc" style="border-left:9px solid ${s.c}" data-a="quiz:${ci}"><div style="flex:1;min-width:0"><small>${any?"CONTINUE":"START HERE"}</small><b>${esc(qs[ci].title)}</b><small>${esc(chLabel(S.subj,gs[gi].k))} · ${f.done} of ${gs[gi].items.length} done</small></div><span class="chip y">GO ›</span></div>`}
  const rail=gs.length>=3?`<div class="crail">${gs.map((g,gi)=>{const f=info[gi];return `<button class="cpl${isOpen(gi)?" on":""}" data-gi="${gi}" data-a="chj:${gi}">${ringHtml(f.pct,s.c,f.m?f.m[1]:gi+1,32,f.all,false)}<span>${esc(f.m?"Ch "+f.m[1]:g.k.length>16?g.k.slice(0,15)+"…":g.k)}</span></button>`}).join("")}</div>`:"";
  body=cont+rail+gs.map((g,gi)=>{const f=info[gi],open=isOpen(gi),topics=f.m?`<em class="qg-tp">${esc(g.items.map(x=>x.qz.topic).filter(Boolean).join(" · "))}</em>`:"";
   return `<div class="qg${open?" open":""}" data-gi="${gi}" style="--sc:${s.c}"><button class="qg-h" data-a="grp:${gi}" aria-expanded="${open}">${ringHtml(f.pct,s.c,f.m?f.m[1]:gi+1,54,f.all,f.nw)}<div class="qg-t"><b>${esc(g.k)}</b>${chName(S.subj,g.k)?`<em class="qg-nm">${esc(chName(S.subj,g.k))}</em>`:""}<small>${f.all?"Chapter complete":f.done+" of "+g.items.length+" done"}</small>${topics}</div>${f.avg!=null?`<div class="gr">${grade(f.avg)[1]}</div>`:""}<span class="qg-v">${gicon("keyboard_arrow_down")}</span></button><div class="qg-b"><div class="qg-c"><div class="qg-i">${g.items.map((x,n)=>qr2(x.qz,x.i,n+1,s,tagFor(x.i),n)).join("")}</div></div></div></div>`}).join("")}
 return `<div class="scr"><div class="ph"><button class="iconb" data-a="backlist" aria-label="Back">${icoB}</button><h2>${esc(s.n)}</h2></div>
<div class="body" style="padding:0"><div class="hero" style="background:${s.c};box-shadow:1px 1px 0 ${s.d},2px 2px 0 ${s.d},3px 3px 0 ${s.d},4px 4px 0 ${s.d}"><h1>${qs.length} quiz${qs.length>1?"zes":""}</h1><p>${esc(s.desc||[qs[0].topic,qs[0].level].filter(Boolean).join(" · "))}</p></div><div style="padding:0 20px">${body}</div></div>${bookBtn(s)}</div>`};
SCR.landing=()=>{const qz=S.quiz,s=sub(S.subj),tp=[...new Set(qz.questions.map(q=>q.type))],tm=qz.questions.reduce((a,q)=>a+q.marks,0);return `<div class="scr"><div class="ph"><button class="iconb" data-a="back-list" aria-label="Back">${icoB}</button><h2>${esc(s.n)}</h2></div>
<div class="body" style="padding:0"><div class="hero" style="background:${s.c};box-shadow:1px 1px 0 ${s.d},2px 2px 0 ${s.d},3px 3px 0 ${s.d},4px 4px 0 ${s.d}"><h1>${esc(qz.title)}</h1><p>${esc(qz.description)}</p><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><span class="chip n">${esc(qz.level)}</span><span class="chip n">${esc(qz.difficulty.toUpperCase())}</span>${qz.confidence?'<span class="chip y">CONFIDENCE ON</span>':''}</div></div>
<div class="stats"><div class="card stat"><b>${qz.questions.length}</b><small>QUESTIONS</small></div><div class="card stat"><b>${tm}</b><small>MARKS</small></div><div class="card stat"><b>${qz.timerType==="wholeQuiz"?Math.round(qz.totalTime/60)+"m":qz.totalTime+"s"}</b><small>${qz.timerType==="wholeQuiz"?"TOTAL":"PER QUESTION"}</small></div></div>
<div style="padding:0 20px"><div class="lbl" style="margin-bottom:8px">QUESTION TYPES</div><div style="display:flex;gap:7px;flex-wrap:wrap">${tp.map(t=>`<span class="chip">${TYPES[t]}</span>`).join("")}</div></div>
<div class="lbl" style="margin:20px 20px 0">MODE</div><div class="seg3">${MODES.map(m=>`<button class="${S.mode===m[0]?"on":""}" data-a="mode:${m[0]}">${m[1]}<small>${m[2]}</small></button>`).join("")}</div>
${S.mode==="study"&&qz.pre&&qz.pre.length?`<div class="card sumn"><b>${qz.pre.length} summary page${qz.pre.length>1?"s":""} in Study mode</b><small>${qz.pre.map(p=>esc(p.title)).join(" · ")}</small></div>`:""}<div class="card inst"><div class="lbl">BEFORE YOU START</div><ul>${qz.instructions.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div><div style="height:16px"></div></div>
<div class="foot"><button class="btn" id="go" data-a="start">START ${S.mode.toUpperCase()}</button></div></div>`};
/* ---------- result / review / done ---------- */
SCR.result=()=>{const R=S.run,g=grade(R.pct);const qs=R.qz.questions;const cal=R.cal,calMax=qs.length*2,pos=cal==null?0:Math.max(0,Math.min(100,(cal+calMax)/(2*calMax)*100));
 const first=!R.rs;R.rs=1;const tone=R.pct>=75?"hi":R.pct>=50?"mid":"lo";
 const missed=R.res.filter(r=>r.got<r.max).length,cw=qs.filter((q,i)=>R.conf[i]===2&&R.res[i].got<R.res[i].max).length;
 const msg=tone==="hi"?(missed?missed+(missed>1?" questions":" question")+" to double-check below.":"Not a single slip. Flawless."):tone==="mid"?missed+(missed>1?" questions":" question")+" to review. "+(cw?"Start with the "+(cw>1?cw+" you were certain about.":"one you were certain about."):"Tap Review to see why."):"Review what you missed, then try again.";
 const pr=HIST.slice(1).find(h=>h.q===R.qz.qid),dd=pr?R.pct-pr.p:null;
 const prg=`<div class="prg${first?" first":""}">${pr?`<em class="dl ${dd>0?"up":dd<0?"dn":"n"}">${dd>0?"▲ +"+dd+"%":dd<0?"▼ −"+Math.abs(dd)+"%":"＝ SAME"} vs last attempt</em>`:'<em class="dl n">FIRST ATTEMPT</em>'}</div>`;
 const spots=[[8,0],[22,.25],[36,.1],[64,.35],[78,.05],[90,.3],[15,.5],[84,.55]];
 const cel=tone==="hi"&&first&&!calm()?`<div class="cel">${spots.map(([x,d],i)=>`<span style="left:${x}%;animation-delay:${d+.3}s">${kit(i%2?"star":"spark",{size:i%3?14:20})}</span>`).join("")}</div>`:"";
 const calMsg=cal==null?"":cal>=calMax*.5?"Your confidence matched your answers. Great calibration.":cal>=0?"Mostly well calibrated. Watch the few you were certain about.":"You were often certain and wrong. Those are the ones to review first.";
 return `<div class="scr"><div class="body" style="padding:0"><div class="rt">${cel}<div class="lbl">${esc(R.qz.title.toUpperCase())}</div><div class="stamp${tone==="hi"?" hi":""}">${g[1]}</div><h1>${g[2]}</h1><p>${R.mode.toUpperCase()} · ${fmtT(R.t)} taken</p><p class="rm">${msg}</p>${prg}</div>
<div class="sc2"><div class="card"><b><span${first?` data-cu="${R.got}" data-d="${String(R.got).includes(".")?String(R.got).split(".")[1].length:0}"`:""}>${fmt(R.got)}</span><span style="font-size:20px;opacity:.5">/${R.max}</span></b><small>MARKS</small></div><div class="card"><b><span${first?` data-cu="${R.pct}"`:""}>${R.pct}</span>%</b><small>SCORE</small></div></div>
${R.cbq>=2?`<div class="card cbres">${FX.bolt("#ffcb3d")}<div style="flex:1"><b>Best run: ${R.cbq} in a row</b><small>Combo now: ${comboInfo().cur}</small></div>${R.cbRec?'<span class="chip y">NEW RECORD</span>':""}</div>`:""}${cal!=null?`<div class="card cal"><h4>Calibration score<em>${cal>0?"+":""}${fmt(cal)}</em></h4><div class="gauge"><i style="left:50%" id="gi"></i></div><p>${calMsg}</p><p style="margin-top:6px;opacity:.8">Marks are never changed by confidence. This is a separate score.</p></div>`:""}
<div class="lbl" style="margin:0 20px 8px">YOUR ANSWERS</div><div class="strip">${R.res.map((r,i)=>`<button class="${stateOf(r)}" data-a="rev:${i}">${i+1}</button>`).join("")}</div><div style="height:14px"></div><div id="adbox"></div><div style="height:12px"></div></div>
<div class="foot"><button class="btn w" data-a="home" style="flex:.6">HOME</button><button class="btn${tone==="lo"?" calm":""}" data-a="review">${tone==="lo"?"REVIEW WHAT YOU MISSED":"REVIEW"}</button></div></div>`};
SCR.review=()=>{const R=S.run,qs=R.qz.questions;const items=qs.map((q,i)=>({q,i,r:R.res[i],a:R.ans[i],c:R.conf[i]}));const cbw=items.filter(x=>x.c===2&&x.r.got<x.r.max);const rest=items.filter(x=>!cbw.includes(x));
 const card=(x,flag)=>{const st=stateOf(x.r),col={ok:"var(--ok)",part:"var(--part)",bad:"var(--bad)"}[st];return `<div class="card rv" id="rv${x.i}" style="border-left:10px solid ${col}">${flag?`<div class="flag">⚠ CERTAIN BUT WRONG</div>`:""}<div class="h"><span class="n" style="background:${col};${st==="part"?"color:#1c2a5e":""}">${x.i+1}</span><span class="chip">${TYPES[x.q.type]}</span>${x.c!=null?`<span class="chip">${["GUESS","FAIRLY SURE","CERTAIN"][x.c]}</span>`:""}<em>${fmt(x.r.got)}/${x.r.max}</em></div><div class="q">${md(x.q.type==="assertion"?x.q.assertion:x.q.question.split("\n")[0])}</div><div class="a ${st==="ok"?"c":"y"}"><b>YOURS</b><span>${md(showA(x.q,x.a))}</span></div><div class="a c"><b>CORRECT</b><span>${md(showC(x.q))}</span></div><div class="ex">${md(x.q.explanation)}</div></div>`};
 return `<div class="scr"><div class="ph"><button class="iconb" data-a="result" aria-label="Back">${icoB}</button><h2>Review</h2></div><div class="body">${cbw.length?`<div class="sec">REVIEW THESE FIRST</div>${cbw.map(x=>card(x,1)).join("")}<div class="sec">ALL OTHER QUESTIONS</div>`:""}${rest.map(x=>card(x)).join("")}</div></div>`};
SCR.done=()=>`<div class="scr"><div class="body" style="padding:0"><div class="rt" style="padding-top:150px"><div class="stamp" style="background:var(--blu);color:#fff;box-shadow:1px 1px 0 var(--blud),2px 2px 0 var(--blud),3px 3px 0 var(--blud),4px 4px 0 var(--blud),5px 5px 0 var(--blud)">✓</div><h1>Study complete</h1><p>${S.run.qz.questions.filter(q=>q.type!=="summary").length} questions read · nothing graded</p></div></div><div class="foot"><button class="btn w" data-a="home" style="flex:.6">HOME</button><button class="btn" data-a="landing">TEST YOURSELF</button></div></div>`;
const iconSm=x=>x.ic?x.ic.replace(/<svg /,'<svg style="width:30px;height:30px;display:block" '):`<span style="font:800 24px 'DM Sans';color:#fff">${esc(x.g)}</span>`;
/* Where to continue: the next quiz you have not done in the chapter you were last working in; when that chapter is finished, the next chapter with one left. */
function nextUp(){
 const done=z=>HIST.some(h=>h.q===z.qid);
 let h0=null,qs=null,li=-1;
 for(const h of HIST){const L=DATA[h.s]||[],i=L.findIndex(z=>z.qid===h.q);if(i>=0){h0=h;qs=L;li=i;break}}
 if(!h0)return null;
 const gs=quizGroups(qs),named=gs.length>=2&&qs.length>=8&&gs.every(g=>g.k);
 const info=i=>{if(!named)return{chap:"",done:0,total:0};const g=gs.find(g=>g.items.some(x=>x.i===i));return{chap:g.k,done:g.items.filter(x=>done(x.qz)).length,total:g.items.length}};
 const pick=(i,again)=>({s:h0.s,i,qz:qs[i],again:!!again,...info(i)});
 const cur=named?gs.findIndex(g=>g.items.some(x=>x.i===li)):0,order=named?gs:[{items:qs.map((qz,i)=>({qz,i}))}];
 const inG=order[cur];
 let f=inG.items.find(x=>x.i>li&&!done(x.qz))||inG.items.find(x=>!done(x.qz));
 if(f)return pick(f.i);
 for(let k=1;k<order.length;k++){const g=order[(cur+k)%order.length];f=g.items.find(x=>!done(x.qz));if(f)return pick(f.i)}
 return pick((li+1)%qs.length,true)}
/* Home message: shows either the day streak or the combo, never both. Chosen once per app open; combo is favoured when both qualify, but it stays random. */
const HMK="gradis.v1.hm";let HMC=null;
function homeMsg(){const s=streakInfo(),c=comboInfo();
 const sOk=s.cur>=3||(s.cur>=2&&(s.cur>=.7*s.best||s.state==="ice")),cOk=c.cur>=5||(c.cur>=3&&(c.cur>=.7*c.best||c.state==="fading"));
 if(!HMC){let h=[];try{h=JSON.parse(localStorage.getItem(HMK)||"[]")}catch(e){}HMC={u:Math.random(),base:h.slice(),h,logged:false}}
 const rep=k=>HMC.base.length>=3&&HMC.base.slice(-3).every(x=>x===k);
 let kind=null;
 if(sOk&&cOk){kind=HMC.u<.65?"combo":"streak";if(rep(kind))kind=kind==="combo"?"streak":"combo"}else kind=cOk?"combo":sOk?"streak":null;
 if(kind&&!HMC.logged){HMC.logged=true;HMC.h.push(kind);try{localStorage.setItem(HMK,JSON.stringify(HMC.h.slice(-6)))}catch(e){}}
 return kind?{kind,s,c}:null}
function hmHtml(m){const nx=nextUp(),go=nx?"quizgo:"+esc(nx.s)+":"+nx.i:"tab:subjects",s=m.s,c=m.c;let cls,ic,head,sub,cta;
 if(m.kind==="streak"){
  if(s.state==="ice"){cls="hw";ic=FX.ice;head=`Keep your ${s.cur}-day streak`;sub="You haven't studied yet today. One quiz keeps the fire lit.";cta="START A QUIZ"}
  else{cls="hs";ic=FX.flame("#ff7a59","#ffcb3d","fl");head=`${s.cur} days in a row`;sub=`Study again tomorrow to make it ${s.cur+1}.`;cta="ONE MORE"}
 }else{
  if(c.state==="fading"){cls="hw";ic=FX.bolt("#ffcb3d","wn");head=`Your ${c.cur}-combo is fading`;sub=c.left===0?"Last day. Answer a few questions to keep it alive.":`${c.left} day${c.left>1?"s":""} left to keep it alive.`;cta="SAVE IT"}
  else{cls="hc";ic=FX.bolt("#ffcb3d","bz");head=`${c.cur} in a row`;sub=c.cur>=c.best?"That's your record. Don't break it.":`Don't break it. Your best is ${c.best}.`;cta="KEEP GOING"}}
 return `<div class="card hm ${cls}"><div class="hmi">${ic}</div><div class="hmt"><b>${head}</b><small>${sub}</small></div><span class="chip y" data-a="${go}">${cta} ›</span></div>`}
SCR.home=()=>{
 const sk=streak(),sv=savedRun(),has=HIST.length>0,cards=[],hm=has?homeMsg():null;
 const ring=(x,bg)=>`<div class="ring" style="background:${bg||"rgba(255,255,255,.25)"}"><i style="background:none;width:auto;height:auto">${x}</i></div>`;
 if(sv){const n=sv.qz.questions.length;cards.push(`<div class="card cont sl" data-a="resume"><div class="ring" style="background:conic-gradient(var(--y) ${Math.round(sv.i/n*100)}%,rgba(255,255,255,.25) 0)"><i>${sv.i}/${n}</i></div><div style="flex:1;min-width:0"><small>RESUME QUIZ</small><b>${esc(sv.qz.title)}</b><small>Question ${sv.i+1} · ${sv.mode.charAt(0).toUpperCase()+sv.mode.slice(1)} mode</small></div><span class="chip y">GO ›</span></div>`)}
 if(has){
  const nx=nextUp();
  if(nx){const ls=sub(nx.s);
   cards.push(`<div class="card cont sl" style="background:${ls.c};box-shadow:${sh(ls.d,4)}" data-a="quizgo:${esc(ls.n)}:${nx.i}">${ring(iconSm(ls))}<div style="flex:1;min-width:0"><small>CONTINUE · ${esc(ls.n)}</small><b>${esc(nx.qz.title)}</b><small>${nx.again?"Practise again":"Next up"}${nx.chap?" · "+esc(nx.chap)+" · "+nx.done+" of "+nx.total+" done":""}</small></div><span class="chip y">GO ›</span></div>`)}
  const ov=agg(HIST.filter(h=>real(h.s))).subs;
  if(ov.length){const ws=sub(ov[ov.length-1].s),w=HIST.filter(h=>h.s===ws.n).sort((a,b)=>a.p-b.p)[0],wi=Math.max(0,DATA[ws.n].findIndex(z=>z.qid===w.q));
   cards.push(`<div class="card cont sl" style="background:var(--cor);box-shadow:${sh("#c4492b",4)}" data-a="quizgo:${esc(ws.n)}:${wi}">${ring(gicon("trending_up","width:30px;height:30px;color:#fff"))}<div style="flex:1;min-width:0"><small>IMPROVE YOUR WEAKNESS</small><b>${esc(w.t)}</b><small>${esc(ws.n)} · best so far ${w.p}% · retry it</small></div><span class="chip y">GO ›</span></div>`)}
 }else{
  cards.push(`<div class="card cont sl" style="background:var(--blu);box-shadow:${sh("#3a5fc4",4)}" data-a="tab:subjects">${ring(gicon("arrow_forward","width:30px;height:30px;color:#fff"))}<div style="flex:1;min-width:0"><small>GET STARTED</small><b>Take your first quiz</b><small>Pick a subject to begin</small></div><span class="chip y">GO ›</span></div>`)}
 if(!AC.ses&&AC.cfg&&HIST.length>=3)cards.push(`<div class="card cont sl" style="background:var(--teal);box-shadow:${sh("#1d8174",4)}" data-a="account">${ring(gicon("person","width:30px;height:30px;color:#fff"))}<div style="flex:1;min-width:0"><small>KEEP YOUR RESULTS SAFE</small><b>Create a free account</b><small>Sync across devices, never lose your scores</small></div><span class="chip y">GO ›</span></div>`);
 return `<div class="scr">${topBar("gradis",`<div class="tr">${AC.cfg?`<button class="iconb${AC.ses?" on":""}" data-a="account" aria-label="Account">${gicon("person")}</button>`:""}<button class="iconb" data-a="settings" aria-label="Settings">${gicon("settings")}</button></div>`)}
<div class="body" style="padding:0"><div class="hi"><h1>${has?"Welcome back":"Welcome"}</h1>${hm?"":`<p>${has?(sk?sk+"-day streak. Every quiz counts, keep going.":"Every quiz counts. Let's go."):"Pick a subject and take your first quiz."}</p>`}</div>${hm?hmHtml(hm):""}
<div class="slider" id="slr">${cards.join("")}</div><div class="dots" id="dts">${cards.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div>
${has?`<div class="pad" style="padding-top:8px">${homeDash()}</div>
<div class="pad"><div class="lbl rowl">RECENT RESULTS<button class="lnk" data-a="tab:results">ALL ›</button></div>${HIST.slice(0,2).map(h=>{const g=grade(h.p);return `<div class="card hist" style="border-left:10px solid ${sub(h.s).c}"><div class="gr">${g[1]}</div><div><b>${esc(h.t)}</b><small>${h.d} · ${esc(h.m.toUpperCase())} · ${fmt(h.got)}/${h.max} marks</small></div><div class="pc">${h.p}%</div></div>`}).join("")}</div>`
 :`<div class="card empty-home"><div class="eh"><span class="ehs a">${kit("spark",{size:18})}</span><span class="ehs b">${kit("star",{size:16})}</span><span class="ehs c">${kit("spark",{size:12})}</span><div class="ehb">${kit("book",{size:46})}</div></div><b>Your stats will appear here</b><small>Scores, streaks and your best subjects show up after your first quiz.</small></div>`}<div style="height:10px"></div></div>${navHtml()}</div>`};
SCR.error=()=>`<div class="scr"><div class="boot">${LOGO.badge(84)}<div>Couldn't load the quizzes</div><div style="font:600 14px 'DM Sans';letter-spacing:0;padding:0 30px">${(S.err&&S.err.message)||"Check your connection and try again."}</div><button class="btn" data-a="retry">TRY AGAIN</button></div></div>`;
