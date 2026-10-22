/* Icon layer: Google Material Symbols paths (js/icons-material.js) when present, otherwise the built-in drawings below.
   gicon("name", "optional inline style") returns an <svg> that takes its colour from the text colour. */
const _f=(w,d)=>`<svg class="gi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const GI_FALLBACK={
 close:_f(3,"M6 6l12 12M18 6L6 18"),
 arrow_back:_f(3,"M15 5l-7 7 7 7"),
 arrow_forward:_f(3,"M5 12h14M13 6l6 6-6 6"),
 schedule:_f(3,"M12 5a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 9v4l3 2M9 2h6"),
 menu_book:_f(2.6,"M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5"),
 home:_f(2.6,"M3 11l9-8 9 8M5 9.5V21h14V9.5"),
 bar_chart:_f(2.6,"M4 20V10M10 20V4M16 20v-7M22 20H2"),
 search:_f(3,"M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16.5 16.5L21 21"),
 settings:_f(2.6,"M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"),
 ios_share:_f(2.8,"M12 15V3M7 8l5-5 5 5M4 15v5h16v-5"),
 trending_up:_f(3,"M4 17l6-6 4 4 7-8M15 7h6v6"),
 check:_f(3,"M5 12l5 5 9-10"),
 keyboard_arrow_up:_f(3,"M6 15l6-6 6 6"),
 keyboard_arrow_down:_f(3,"M6 9l6 6 6-6"),
 drag_indicator:'<svg class="gi" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>',
 lightbulb:'<span class="gi gi-t">💡</span>'
};
function gicon(n,st){const p=typeof MAT!=="undefined"&&MAT[n],s=st?` style="${st}"`:"";
 if(p)return `<svg class="gi" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"${s}><path d="${p}"/></svg>`;
 return (GI_FALLBACK[n]||"").replace('class="gi','aria-hidden="true"'+s+' class="gi')}
