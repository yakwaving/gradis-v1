function startRun(){const qz=S.quiz,whole=qz.timerType==="wholeQuiz";
 S.run={qz:runQuiz(qz,S.mode),mode:S.mode,i:0,ans:qz.questions.map(q=>initA(q)),res:[],conf:[],checked:false,left:qz.totalTime,hint:false,ui:{},t:0};
 clearInterval(S.tm);S.tm=setInterval(tick,1000);scr("q")}
function initA(q){switch(q.type){case"multiple":return[];case"fill":return q.blanks.map(()=>"");case"numeric":return{v:"",u:q.unit||""};case"matching":return{};case"ordering":return q.items.map((_,i)=>q.items.length-1-i);case"labelling":return{};case"grid":return{};case"code":return{};case"bugline":case"stepline":return[];case"bugfix":case"stepfix":return{l:null,f:null};case"math":return{v:""};case"flowchart":return{shapes:{},text:{}};case"structured":return{x:q.parts.map(()=>""),t:q.parts.map(p=>p.markScheme.map(()=>false)),show:false};default:return null}}
function tick(){const R=S.run;if(!R||S.scr!=="q"||R.mode==="study")return;R.t++;R.left--;if(R.t%5===0)persistRun();const e=$("tm");if(e){e.lastChild.textContent=fmtT(Math.max(0,R.left));e.classList.toggle("u",R.left<=10)}
 if(R.left<=0){if(R.qz.timerType==="perQuestion"){toast("TIME UP");next(true)}else{toast("TIME UP");finish()}}}
const curQ=()=>S.run.qz.questions[S.run.i];
function mainAct(){const R=S.run,q=curQ();const needC=R.qz.confidence&&R.mode!=="study";
 if(R.mode==="study")return next();
 if(!R.checked&&(!answered(q,R.ans[R.i])||(needC&&R.conf[R.i]==null))){const b=$("main");b.classList.remove("nope");void b.offsetWidth;b.classList.add("nope");toast(!answered(q,R.ans[R.i])?"ANSWER FIRST":"PICK HOW SURE YOU ARE");return}
 if(R.mode==="practice"&&!R.checked){R.checked=true;R.res[R.i]=mark(q,R.ans[R.i]);renderQ();return}
 next()}
function prev(){const R=S.run;if(R.i<=0)return;R.i--;R.hint=false;R.ui={};R.checked=R.mode==="practice"&&!!R.res[R.i];renderQ(-1)}
function next(force){const R=S.run;if(!R.res[R.i]||R.mode==="exam")R.res[R.i]=mark(curQ(),R.ans[R.i]);if(R.i>=R.qz.questions.length-1)return finish();R.i++;R.checked=R.mode==="practice"&&!!R.res[R.i];R.hint=false;R.ui={};if(R.qz.timerType==="perQuestion")R.left=R.qz.totalTime;renderQ(true)}
function finish(){const R=S.run;clearInterval(S.tm);R.qz.questions.forEach((q,i)=>{if(!R.res[i]||R.mode==="exam")R.res[i]=mark(q,R.ans[i])});
 if(R.mode==="study"){clearRun();scr("done");return}
 const got=R.res.reduce((a,r)=>a+r.got,0),max=R.res.reduce((a,r)=>a+r.max,0);R.got=got;R.max=max;R.pct=Math.round(got/max*100);
 R.cal=R.conf.length?R.qz.questions.reduce((a,q,i)=>{const c=R.conf[i];if(c==null)return a;const right=R.res[i].got>=R.res[i].max;return a+[[.5,1,2],[0,-1,-2]][right?0:1][c]},0):null;
 addResult({s:S.subj,q:R.qz.qid,t:R.qz.title,p:R.pct,got:R.got,max:R.max,m:R.mode,cal:R.cal});syncNow();clearRun();scr("result");Ads.afterQuiz(R.mode)}
/* ---------- question screen ---------- */
function renderQ(slide){const A=$("app"),old=slide?A.firstElementChild:null;A.innerHTML=SCR.q();if(slide)slideIn(A,old,slide!==-1);bind();persistRun();const b=document.querySelector(".body");if(b&&S.run.keepScroll){b.scrollTop=S.run.keepScroll}}
SCR.q=()=>{const R=S.run,q=curQ(),a=R.ans[R.i],qz=R.qz,N=qz.questions.length,ch=R.checked||R.mode==="study",rs=R.res[R.i]||mark(q,a),conf=qz.confidence&&R.mode!=="study";
 const segs=qz.questions.map((_,i)=>{let c=i<R.i?"d":i===R.i?"cur":"";if(qz.questions[i].type==="summary")c+=" sm";else if(R.mode==="practice"&&R.res[i]&&(i<R.i||ch&&i===R.i))c=stateOf(R.res[i]);return `<i class="${c}"></i>`}).join("");
 const tmr=R.mode==="study"?`<div class="tmr" style="background:var(--blu)">STUDY</div>`:`<div class="tmr${R.left<=10?" u":""}" id="tm">${icoClock}<span>${fmtT(Math.max(0,R.left))}</span></div>`;
 const img=q.image&&q.type!=="labelling"?`<div class="qimg">${imgHtml(q.image)}</div>`:"";
 let fb="";
 if(R.mode==="study")fb=`<div class="fb study"><h3>Study mode <em>not graded</em></h3><p>${md(q.explanation)}</p><div class="ac">Answer: ${md(showC(q))}</div></div>`;
 else if(R.checked){const st=stateOf(rs);fb=`<div class="fb ${st}"><h3>${ST[st][1]} ${ST[st][0]}<em>${fmt(rs.got)}/${rs.max}</em></h3>${st!=="ok"?`<div class="ac">Answer: ${md(showC(q))}</div>`:""}<p>${md(q.explanation)}</p></div>`}
 const hint=q.hint&&R.mode==="practice"&&!ch?`<button class="btn w hint" data-a="hint">HINT</button>`:"";
 const confH=conf?`<div class="conf${R.checked?" lock":""}"><span class="lbl">HOW SURE ARE YOU?</span><div class="row">${[["GUESS","+0.5 / 0",1],["FAIRLY SURE","+1 / −1",2],["CERTAIN","+2 / −2",3]].map((c,i)=>`<button class="${R.conf[R.i]===i?"on":""}" data-a="conf:${i}"><span class="bars">${[0,1,2].map(k=>`<i style="height:${5+k*4}px;${k<=i?"":"opacity:.4"}"></i>`).join("")}</span>${c[0]}<small>${c[1]}</small></button>`).join("")}</div></div>`:"";
 const ready=R.checked||(answered(q,a)&&(!conf||R.conf[R.i]!=null));
 const qp=qpos(R),pvB=R.i>0&&!(R.mode==="exam"&&qz.timerType==="perQuestion")?`<button class="btn w pv" data-a="prev" aria-label="Previous">‹</button>`:"";
 if(q.type==="summary")return `<div class="scr"><div class="qtop"><button class="iconb" data-a="quit" aria-label="Close">${icoX}</button><div class="segs">${segs}</div>${tmr}</div>
<div class="body"><div class="qmeta"><span class="chip b">SUMMARY</span><span class="chip">${qp.n} QUESTIONS AHEAD</span></div>${sumBody(q)}<div style="height:14px"></div></div>
<div class="qfoot"><div class="frow">${pvB}<button class="btn" id="main" data-a="main">GOT IT ›</button></div></div></div>`;
 const lbl=R.mode==="study"?(R.i===N-1?"DONE":"NEXT ›"):R.mode==="practice"&&!R.checked?"CHECK":R.i===N-1?"FINISH":"NEXT ›";
 return `<div class="scr"><div class="qtop"><button class="iconb" data-a="quit" aria-label="Close">${icoX}</button><div class="segs">${segs}</div>${tmr}</div>
<div class="body"><div class="qmeta"><span class="chip n">${qp.i} / ${qp.n}</span><span class="chip">${TYPES[q.type]}</span><span class="chip y">${q.marks} MARK${q.marks>1?"S":""}</span></div>
${q.type==="assertion"?"":`<div class="card qcard">${q.type==="fill"?fillQ(q,a,ch,rs):md(q.question)}${img}</div>`}
${R.hint&&q.hint?`<div class="hbox">${gicon("lightbulb","width:18px;height:18px;display:inline-block;vertical-align:-3px;margin-right:4px")} ${md(q.hint)}</div>`:""}
${typeUI(q,a,ch,R)}${fb}</div>
<div class="qfoot">${confH}<div class="frow">${pvB}${hint}<button class="btn${!ready&&R.mode!=="study"?" off":""}" id="main" data-a="main">${lbl}</button></div></div></div>`};
function fillQ(q,a,ch,rs){return md(q.question).replace(/\{\{(\d)\}\}([.,;:!?)]*)/g,(_,n,p)=>{const i=n-1,ok=ch&&q.blanks[i].answers.map(norm).includes(norm(a[i]));const inp=`<input class="gap${ch?(ok?" ok":" bad"):""}" data-gap="${i}" value="${esc(a[i]||"")}" ${ch?"readonly":""} autocomplete="off" autocapitalize="off">`;return `<span class="gw">${inp}${p}</span>`})}
function typeUI(q,a,ch,R){const lock=ch?" lock":"";
 switch(q.type){
 case"single":return q.options.map((o,i)=>{let c=a===i?" sel":"";if(ch){c=i===q.correct?" ok":a===i?" bad":""}return `<button class="opt${c}${lock}" data-a="pick:${i}"><span class="k">${"ABCDEF"[i]}</span>${oHtml(o)}</button>`}).join("");
 case"multiple":return `<div class="note">Choose all that apply · ${q.scoring==="partial"?"+1 per right pick, −1 per wrong pick":"all or nothing"}</div>`+q.options.map((o,i)=>{const on=(a||[]).includes(i);let c=on?" sel":"";if(ch){c=q.correct.includes(i)?(on?" ok":" miss"):on?" bad":""}return `<button class="opt${c}${lock}" data-a="tog:${i}"><span class="k cb">${on||ch&&q.correct.includes(i)?"✓":""}</span>${oHtml(o)}</button>`}).join("");
 case"truefalse":return `<div class="tf">${[[true,"True","✓"],[false,"False","✗"]].map(([v,t,s])=>{let c=a===v?" sel":"";if(ch)c=v===q.correct?" ok":a===v?" bad":"";return `<button class="opt${c}${lock}" data-a="tf:${v}"><span class="k">${s}</span>${t}</button>`}).join("")}</div>`;
 case"fill":return `<div class="note">Type into each gap · capital letters don't matter</div>`;
 case"short":return `<input class="inp${ch?(mark(q,a).got?" ok":" bad"):""}" id="sh" placeholder="Type your answer" value="${esc(a||"")}" ${ch?"readonly":""} autocomplete="off" autocapitalize="off">`;
 case"numeric":return `<div class="nrow"><input class="inp${ch?(mark(q,a).got?" ok":" bad"):""}" id="nv" inputmode="decimal" placeholder="Number" value="${esc(a.v)}" ${ch?"readonly":""}>${q.unit!=null?`<input class="inp u" id="nu" placeholder="unit" value="${esc(a.u)}" ${ch?"readonly":""} autocapitalize="off">`:""}</div><div class="note" style="margin-top:10px">${q.unit?"Include the unit · right number, wrong unit = half marks":"Type a number · decimals use a point"}</div>`;
 case"matching":return matchUI(q,a,ch,R);
 case"ordering":return `<div class="note">Drag the handle, or use the arrows</div><div id="ol">${ordHtml(q,a,ch,-1)}</div>`;
 case"labelling":return labUI(q,a,ch,R);
 case"grid":return gridUI(q,a,ch);
 case"code":return codeUI(q,a,ch,R);
 case"bugline":case"bugfix":return bugUI(q,a,ch,R);
 case"math":return mathUI(q,a,ch,R);
 case"stepline":case"stepfix":return stepUI(q,a,ch,R);
 case"flowchart":return flowUI(q,a,ch,R);
 case"assertion":return `<div class="assert"><div class="qq"><b>ASSERTION</b>${md(q.assertion)}</div><div class="qq r"><b>REASON</b>${md(q.reason)}</div></div>`+Object.keys(ASR).map(k=>{let c=a===k?" sel":"";if(ch)c=k===q.correct?" ok":a===k?" bad":"";return `<button class="opt${c}${lock}" data-a="as:${k}"><span class="k">${k}</span>${ASR[k]}</button>`}).join("");
 case"structured":return structUI(q,a,R)}return""}
const MC=["#5b8cff","#ff7a59","#2fb5a3","#c58bff","#ffb400","#ff6fb5"];
function matchUI(q,a,ch,R){const ui=R.ui,rev={};Object.entries(a).forEach(([l,r])=>rev[r]=+l);
 const rs=ui.rs||(ui.rs=q.right.map((_,i)=>i).sort((x,y)=>(x*5+2)%7-(y*5+2)%7));
 const L=q.left.map((t,i)=>{const p=a[i]!=null;let c=(p?" p":"")+(ui.l===i?" act":"");if(ch)c=" p "+(q.pairs.some(([l,r])=>l===i&&a[i]===r)?"ok":"bad");return `<button class="mi${c}" style="--pc:${MC[i]}" data-a="ml:${i}"><span class="pn" style="background:${MC[i]}">${"ABCDEF"[i]}</span>${esc(t)}${p?`<span class="b">${rs.indexOf(a[i])+1}</span>`:""}</button>`}).join("");
 const Rr=rs.map((ri,pos)=>{const l=rev[ri];const p=l!=null;let c=p?" p":"";if(ch&&p)c+=q.pairs.some(([x,y])=>x===l&&y===ri)?" ok":" bad";return `<button class="mi${c}" style="--pc:${p?MC[l]:"#d4def5"}" data-a="mr:${ri}"><span class="pn" style="background:#1c2a5e">${pos+1}</span>${esc(q.right[ri])}${p?`<span class="b">${"ABCDEF"[l]}</span>`:""}</button>`}).join("");
 return `<div class="note">Tap a term, then its match. Tap a matched term to undo.</div><div class="mt"><div>${L}</div><div>${Rr}</div></div>`}
function ordHtml(q,a,ch,drag){return a.map((it,pos)=>{let c=pos===drag?" drag":"";if(ch)c=" "+(it===q.correctOrder[pos]?"ok":"bad");return `<div class="ord${c}" data-pos="${pos}"><span class="n">${pos+1}</span><span class="t">${md(q.items[it])}</span>${ch?"":`<span class="ar"><button data-a="up:${pos}" aria-label="Up">${gicon("keyboard_arrow_up")}</button><button data-a="dn:${pos}" aria-label="Down">${gicon("keyboard_arrow_down")}</button></span><span class="hd" data-h="${pos}">${gicon("drag_indicator")}</span>`}</div>`}).join("")}
function labUI(q,a,ch,R){const used=Object.values(a),labels=q.labels.concat(q.decoys||[]).sort((x,y)=>x.length-y.length);
 return `<div class="note">Tap a label, then tap its spot on the diagram${q.decoys&&q.decoys.length?" · one label is a decoy":""}</div><div class="card" style="padding:10px;margin-bottom:14px"><div class="dia">${imgHtml(q.image)}${q.targets.map((t,i)=>{const v=a[i];let c=v?" f":"";if(ch&&v)c+=v===t.answer?" ok":" bad";if(R.ui.t===i)c+=" sel";return `<button class="dot${c}" style="left:${t.x}%;top:${t.y}%" data-a="dot:${i}">${v||i+1}</button>`}).join("")}</div></div><div class="tray">${labels.filter(l=>!used.includes(l)).map(l=>`<button class="lab${R.ui.l===l?" sel":""}" data-a="lab:${esc(l)}">${esc(l)}</button>`).join("")||'<span class="note" style="margin:auto">All labels placed</span>'}</div><div style="height:14px"></div>`}
function gridUI(q,a,ch){return `<div class="gridw"><table class="g"><tr>${q.columns.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>${q.rows.map((row,ri)=>`<tr>${row.map((c,ci)=>{if(c.given!=null)return `<td class="gv">${esc(c.given)}</td>`;const k=ri+","+ci,v=a[k]||"",ok=ch&&c.answer.map(norm).includes(norm(v));const cls=ch?(ok?"ok":"bad"):"";if(c.choices)return `<td><select data-g="${k}" class="${cls}" ${ch?"disabled":""}><option value="">–</option>${c.choices.map(o=>`<option${v===o?" selected":""}>${esc(o)}</option>`).join("")}</select>${ch&&!ok?`<small>${esc(c.answer[0])}</small>`:""}</td>`;return `<td><input data-g="${k}" class="${cls}" value="${esc(v)}" ${ch?"readonly":""} inputmode="text" autocomplete="off">${ch&&!ok?`<small>${esc(c.answer[0])}</small>`:""}</td>`}).join("")}</tr>`).join("")}</table></div>`}
function structUI(q,a,R){const sh=a.show;return `<div class="note">Write your answers, then self-mark against the scheme · automatic AI marking is planned for later</div>`+q.parts.map((p,i)=>`<div class="card part"><h4><span>${esc(p.label)}</span><div style="flex:1">${md(p.question)}</div><span class="chip y" style="margin-left:6px">${p.marks}</span></h4><textarea data-st="${i}" placeholder="Your answer…" ${sh?"readonly":""}>${esc(a.x[i]||"")}</textarea>${sh?`<div class="ms">${p.markScheme.map((m,k)=>`<button class="${a.t[i][k]?"t":""}" data-a="tick:${i}:${k}"><i>${a.t[i][k]?"✓":""}</i>${esc(m)}</button>`).join("")}</div>`:""}</div>`).join("")+(sh?`<div class="note" style="text-align:center">Tap each point you made · max ${q.marks} marks · you scored ${fmt(mark(q,a).got)}</div>`:`<button class="btn w" style="width:100%;margin-bottom:8px" data-a="scheme">SHOW MARK SCHEME & SELF-MARK</button>`)}