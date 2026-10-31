/* ---------- master book: an optional reference book for a subject ----------
   A master book is one markdown file. Name it in subjects-manifest.json, on the subject:
     "book": "subjects/FUNDAMENTALS OF ALGORITHMS/master-book.md"
   and the subject's quiz list shows a blue MASTER BOOK button at the bottom. No "book" key, no button.
   Markdown understood:
     # Title            then one line under it: the subtitle
     ## 1. Section      each section is a tappable row that opens and closes; the number is optional
     ### Sub-heading
     paragraphs · - bullets · 1. numbered lists · | tables | · ```pascal code``` (```text is shown as Pseudocode)
     **bold** · `inline code` · a paragraph that starts with **Trap or **Traps: is shown as a warning box
   Inside a table cell or a list item the text goes through md(), so bold and `code` work there too. */
const BOOKS={};
const bookPlain=t=>String(t).replace(/[`*]/g,"");
function bookTable(rows){
 const cells=r=>r.replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(c=>c.trim());
 const head=cells(rows[0]),body=rows.slice(2).map(cells);
 return `<div class="bkt"><table class="bk"><thead><tr>${head.map(h=>`<th>${md(h)}</th>`).join("")}</tr></thead><tbody>${body.map(r=>`<tr>${head.map((_,i)=>`<td>${md(r[i]||"")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
function bookParse(src){
 const L=String(src).replace(/\r/g,"").split("\n"),B={title:"Master book",sub:"",secs:[]};
 let sec=null,i=0,seenH1=false;
 const add=(html,txt)=>{if(!sec)return;sec.html+=html;sec.text+=" "+bookPlain(txt)};
 while(i<L.length){const ln=L[i];let m;
  if(/^\s*$/.test(ln)){i++;continue}
  if((m=/^# (.+)/.exec(ln))){B.title=m[1].trim();seenH1=true;i++;continue}
  if((m=/^## (.+)/.exec(ln))){const t=m[1].trim(),n=/^(\d+)\.\s+(.*)$/.exec(t);sec={t:bookPlain(n?n[2]:t),n:n?n[1]:"",html:"",text:bookPlain(t)};B.secs.push(sec);i++;continue}
  if(!sec){if(seenH1&&!B.sub)B.sub=bookPlain(ln.trim());i++;continue}
  if((m=/^### (.+)/.exec(ln))){add(`<h4 class="bkh">${md(m[1])}</h4>`,m[1]);i++;continue}
  if(/^```/.test(ln)){const lang=ln.slice(3).trim(),code=[];let j=i+1;while(j<L.length&&!/^```/.test(L[j]))code.push(L[j++]);i=j+1;
   add(codePanel(code.join("\n"),{lang:lang==="text"?"Pseudocode":lang?lang[0].toUpperCase()+lang.slice(1):"Code"}),code.join(" "));continue}
  if(/^\s*\|/.test(ln)&&i+1<L.length&&/^\s*\|[\s:|-]+\|\s*$/.test(L[i+1])){const rows=[];while(i<L.length&&/^\s*\|/.test(L[i]))rows.push(L[i++]);add(bookTable(rows),rows.join(" "));continue}
  if(/^\s*(?:[-*]|\d+\.)\s+/.test(ln)){const ord=/^\s*\d+\./.test(ln),items=[];while(i<L.length&&/^\s*(?:[-*]|\d+\.)\s+/.test(L[i]))items.push(L[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/,""));
   add(`<${ord?"ol":"ul"} class="bkl">${items.map(x=>`<li>${md(x)}</li>`).join("")}</${ord?"ol":"ul"}>`,items.join(" "));continue}
  const para=[];while(i<L.length&&!/^\s*$/.test(L[i])&&!/^(#{1,3} |```)/.test(L[i])&&!/^\s*\|/.test(L[i])&&!/^\s*(?:[-*]|\d+\.)\s+/.test(L[i]))para.push(L[i++].trim());
  const t=para.join(" "),cls=/^\*\*Traps?:/.test(t)?"bkp trap":/^\*\*[^*]+\*\*\.?$/.test(t)?"bkp bklab":"bkp";
  add(`<p class="${cls}">${md(t)}</p>`,t)}
 B.secs.forEach(s=>{s.text=s.text.toLowerCase()});
 return B}
async function bookLoad(name){
 if(BOOKS[name])return BOOKS[name];
 const s=sub(name);if(!s||!s.book)throw new Error("no book");
 const r=await fetch(encodeURI(s.book));if(!r.ok)throw new Error("HTTP "+r.status);
 return BOOKS[name]=bookParse(await r.text())}
const bookBtn=s=>s&&s.book?`<div class="foot"><button class="btn bkb" data-a="book">${gicon("menu_book")}<span>MASTER BOOK</span></button></div>`:"";
function bookRows(){
 const B=BOOKS[S.subj],q=(S.bq||"").trim().toLowerCase();S.bo=S.bo||{};
 const list=B.secs.map((s,i)=>({s,i})).filter(o=>!q||o.s.text.includes(q));
 if(!list.length)return `<div class="bkno">Nothing in the book matches “${esc(S.bq.trim())}”.</div>`;
 return list.map(({s,i})=>{const open=(i in S.bo)?S.bo[i]:!!q;
  return `<section class="bks${open?" open":""}" id="bks${i}" style="--sc:${sub(S.subj).c}"><button class="bksh" data-a="bksec:${i}" aria-expanded="${open}"><span class="bksn">${s.n||gicon("menu_book")}</span><span class="bkst">${esc(s.t)}</span><span class="bkv">${gicon("keyboard_arrow_down")}</span></button>${open?`<div class="bksb">${s.html}</div>`:""}</section>`}).join("")}
SCR.book=()=>{const s=sub(S.subj),B=BOOKS[S.subj];
 const head=`<div class="ph"><button class="iconb" data-a="bookback" aria-label="Back">${icoB}</button><h2>Master book</h2></div>`;
 if(!B)return `<div class="scr">${head}<div class="body" style="display:grid;place-items:center">${loaderHtml()}</div></div>`;
 return `<div class="scr">${head}<div class="body" style="padding:0"><div class="hero" style="background:${s.c};box-shadow:1px 1px 0 ${s.d},2px 2px 0 ${s.d},3px 3px 0 ${s.d},4px 4px 0 ${s.d}"><h1>${esc(B.title)}</h1><p>${esc(B.sub)}</p><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><span class="chip n">${B.secs.length} SECTIONS</span><span class="chip y">${esc(s.n)}</span></div></div>
<div style="padding:0 20px"><label class="srch bksr">${gicon("search")}<input id="bq" type="search" placeholder="Search the book…" autocomplete="off" enterkeyhint="search" value="${esc(S.bq||"")}"></label><div id="bl">${bookRows()}</div></div><div style="height:28px"></div></div></div>`};
async function bookOpen(){
 S.bo={};S.bq="";
 if(!BOOKS[S.subj]){scr("book");try{await bookLoad(S.subj)}catch(e){toast("THE BOOK IS NOT AVAILABLE OFFLINE YET");return scr("list")}}
 scr("book")}
function bookAction(k,v,b){
 if(k==="book"){bookOpen();return true}
 if(k==="bookback"){S.bq="";scr("list");return true}
 if(k==="bksec"){const i=+v,q=(S.bq||"").trim();S.bo=S.bo||{};S.bo[i]=!((i in S.bo)?S.bo[i]:!!q);
  const sc=document.querySelector(".body"),y=sc?sc.scrollTop:0;$("bl").innerHTML=bookRows();
  const el=$("bks"+i);if(el&&S.bo[i]&&sc){const top=el.getBoundingClientRect().top-sc.getBoundingClientRect().top+sc.scrollTop-8;sc.scrollTo({top,behavior:calm()?"auto":"smooth"})}else if(sc)sc.scrollTop=y;
  return true}
 return false}
document.addEventListener("input",e=>{if(e.target.id==="bq"&&S.scr==="book"){S.bq=e.target.value;$("bl").innerHTML=bookRows()}});
