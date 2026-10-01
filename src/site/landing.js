/* ===== Let's Learn — logo + landing page ===== */
let LL_G = 0;
function logoMark(cls=""){ const g="llg"+(++LL_G);
  return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#4f8fe0"/><stop offset=".55" stop-color="#b169b6"/><stop offset="1" stop-color="#5aa653"/></linearGradient></defs>
  <path d="M13 9 V51 H55" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20 44 C31 44 33 21 47 17" fill="none" stroke="url(#${g})" stroke-width="6.5" stroke-linecap="round"/>
  <circle cx="49" cy="16.4" r="5.6" fill="#5aa653"/></svg>`; }

const LL = {
  en:{ h:["Learn.","Understand.","Explore."],
    lede:"Every chapter of Class 9–10 Physics, Chemistry and Biology, explained the way a good teacher would: simply first, then exactly, in Bangla and English, with visuals you can move and test yourself.",
    start:"Start learning", cont:"Continue learning", explore:"Explore topics",
    facts:(l,s)=>`<b>${l}</b> lessons ready · <b>${s}</b> subjects · Bangla and English · free`,
    contLine:(t)=>`Last time you were reading <a href="${t.href}">${t.label}</a>.`,
    uniHint:"Tap a subject to see what's inside. Each small dot is one chapter; filled dots are ready to read.",
    ready:"ready", notyet:"coming", openS:(n)=>`Open ${n}`,
    chapters:" chapters", lessonsReady:" lessons ready",
    desc:{physics:"Motion, force, energy, waves, light, electricity and the atom, with sliders, ray diagrams and circuits you can try.",
      chemistry:"Atoms, bonds, the periodic table, moles and reactions. Balance equations and watch particles move.",
      biology:"Life, cells, the human body, heredity and the environment, explained step by step."},
    exploreH:"What do you want to learn?", exploreI:"Pick a subject and chapter, or search for any word, formula or topic, in Bangla or English.",
    more:(n)=>`and ${n} more`, mine:(d,n)=>`${d} of ${n} lessons finished on this device`,
    prevH:"Everything you need to understand a concept.",
    prevI:"Each lesson walks through the same parts, in order, so you always know where you are. Here is a real lesson, Acceleration (Physics 2.6).",
    parts:[["what","What is this?","One or two lines on the idea"],["simple","Understand simply","Explained like a teacher beside you"],["analogy","Picture it like this","An everyday picture that makes it click"],["definition","Scientific definition","The exact textbook wording"],["why","Why does it happen?","The reason behind it"],["formula","Formula","With a formula triangle to rearrange it"],["visual","See it","An interactive visual to play with"],["example","Worked example","Given, formula, calculation, answer, with why"],["mistakes","Common mistakes","What students often get wrong"],["quiz","Check your understanding","Quick questions with explanations"]],
    open:"Open the full lesson", tryQ:"Try it:",
    howH:"How it works", steps:[["Choose a chapter","Physics, Chemistry or Biology, following your textbook chapter by chapter."],["Learn with visuals","Read the simple idea, then move sliders, solve examples and answer quick questions."],["Track your progress","Mark lessons as finished and pick up exactly where you left off."]],
    backH:"Welcome back", backI:"Pick up where you left off.", backNote:"Your progress is saved in this browser on this device.", contBtn:"Continue",
    finalH:"Your next concept is waiting.", finalP:"Start today and build your understanding one concept at a time.",
    fSubjects:"Subjects", fSite:"Site", fHow:"How it works", fTop:"Back to top",
    credit:"Based on the NCTB Class 9–10 Physics, Chemistry and Biology textbooks (2026). Not an official NCTB publication; your textbook remains the main reference. Explanations and visuals are original.",
    seeIt:"Velocity grows by the same amount every second: that is uniform acceleration." },
  bn:{ h:["শিখি।","বুঝি।","খুঁজে দেখি।"],
    lede:"নবম-দশম শ্রেণির পদার্থবিজ্ঞান, রসায়ন আর জীববিজ্ঞানের প্রতিটি অধ্যায়, একজন ভালো শিক্ষক যেভাবে বোঝান: আগে সহজ করে, তারপর ঠিকঠাক, বাংলা ও ইংরেজিতে, আর এমন ছবিসহ যা তুমি নিজে নাড়িয়ে দেখতে পারো।",
    start:"শেখা শুরু করো", cont:"আবার শুরু করো", explore:"বিষয়গুলো দেখো",
    facts:(l,s)=>`<b>${l}</b>টি পাঠ তৈরি · <b>${s}</b>টি বিষয় · বাংলা ও ইংরেজি · বিনামূল্যে`,
    contLine:(t)=>`গতবার তুমি পড়ছিলে <a href="${t.href}">${t.label}</a>।`,
    uniHint:"ভেতরে কী আছে দেখতে একটি বিষয়ে চাপ দাও। প্রতিটি ছোট বিন্দু একটি অধ্যায়; ভরা বিন্দুগুলো পড়ার জন্য তৈরি।",
    ready:"তৈরি", notyet:"আসছে", openS:(n)=>`${n} খোলো`,
    chapters:"টি অধ্যায়", lessonsReady:"টি পাঠ তৈরি",
    desc:{physics:"গতি, বল, শক্তি, তরঙ্গ, আলো, বিদ্যুৎ আর পরমাণু; স্লাইডার, রশ্মিচিত্র আর বর্তনী নিজে চালিয়ে দেখো।",
      chemistry:"পরমাণু, বন্ধন, পর্যায় সারণি, মোল আর বিক্রিয়া। সমীকরণ মেলাও, কণাদের চলাচল দেখো।",
      biology:"জীবন, কোষ, মানবদেহ, বংশগতি আর পরিবেশ, ধাপে ধাপে বোঝানো।"},
    exploreH:"তুমি কী শিখতে চাও?", exploreI:"একটি বিষয় আর অধ্যায় বেছে নাও, অথবা যেকোনো শব্দ, সূত্র বা বিষয় খোঁজো, বাংলা বা ইংরেজিতে।",
    more:(n)=>`আরও ${n}টি`, mine:(d,n)=>`এই ডিভাইসে ${n}টির মধ্যে ${d}টি পাঠ শেষ`,
    prevH:"একটি ধারণা বুঝতে যা যা দরকার, সব এক জায়গায়।",
    prevI:"প্রতিটি পাঠ একই ক্রমে এগোয়, তাই তুমি সবসময় জানো কোথায় আছ। এই যে একটি আসল পাঠ, ত্বরণ (পদার্থবিজ্ঞান ২.৬)।",
    parts:[["what","এটা কী?","এক-দুই লাইনে মূল ধারণা"],["simple","সহজভাবে বুঝি","পাশে বসা শিক্ষকের মতো ব্যাখ্যা"],["analogy","এভাবে ভেবে দেখো","রোজকার একটি ছবি, যাতে সহজে মাথায় ঢোকে"],["definition","বৈজ্ঞানিক সংজ্ঞা","বইয়ের নির্ভুল সংজ্ঞা"],["why","কেন এমন হয়?","পেছনের কারণ"],["formula","সূত্র","সূত্র ঘুরিয়ে লেখার ত্রিভুজসহ"],["visual","চোখে দেখি","নিজে নাড়িয়ে দেখার ছবি"],["example","উদাহরণ","দেওয়া আছে, সূত্র, হিসাব, উত্তর, কারণসহ"],["mistakes","সাধারণ ভুল","শিক্ষার্থীরা যেখানে প্রায়ই ভুল করে"],["quiz","নিজেকে যাচাই করো","ব্যাখ্যাসহ ছোট প্রশ্ন"]],
    open:"পুরো পাঠটি খোলো", tryQ:"চেষ্টা করো:",
    howH:"কীভাবে কাজ করে", steps:[["অধ্যায় বেছে নাও","পদার্থবিজ্ঞান, রসায়ন বা জীববিজ্ঞান, তোমার পাঠ্যবইয়ের অধ্যায় ধরে ধরে।"],["ছবি দেখে শেখো","আগে সহজ ধারণা পড়ো, তারপর স্লাইডার নাড়াও, উদাহরণ মেলাও, ছোট প্রশ্নের উত্তর দাও।"],["অগ্রগতি দেখো","পড়া শেষ হলে চিহ্ন দাও, আর যেখানে থেমেছিলে ঠিক সেখান থেকে আবার শুরু করো।"]],
    backH:"আবার স্বাগতম", backI:"যেখানে থেমেছিলে সেখান থেকে শুরু করো।", backNote:"তোমার অগ্রগতি এই ডিভাইসের ব্রাউজারে জমা থাকে।", contBtn:"চালিয়ে যাও",
    finalH:"তোমার পরের ধারণাটি অপেক্ষা করছে।", finalP:"আজই শুরু করো, একটি একটি ধারণা দিয়ে নিজের বোঝাপড়া গড়ে তোলো।",
    fSubjects:"বিষয়", fSite:"সাইট", fHow:"কীভাবে কাজ করে", fTop:"ওপরে যাও",
    credit:"এনসিটিবির নবম-দশম শ্রেণির পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞান পাঠ্যবই (২০২৬) অনুসারে তৈরি। এটি এনসিটিবির কোনো সরকারি প্রকাশনা নয়; মূল ভরসা তোমার পাঠ্যবই। ব্যাখ্যা ও ছবিগুলো নিজস্ব।",
    seeIt:"প্রতি সেকেন্ডে বেগ একই পরিমাণ বাড়ে: এটাই সুষম ত্বরণ।" }
};
const SUBJ_COL = {physics:"var(--phy-l)",chemistry:"var(--chem-l)",biology:"var(--bio-l)"};
function subjMotif(key,col,size=60){ // simple drawings: wave, benzene ring, cell
  const s=size/60;
  if(key==="physics") return `<g transform="scale(${s})" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"><path d="M-24 0 C-18 -16 -12 -16 -6 0 S6 16 12 0 S18 -16 24 0"/><path d="M-24 14 H24" stroke-width="2" opacity=".55"/><path d="M18 10 L24 14 L18 18" stroke-width="2" opacity=".55"/></g>`;
  if(key==="chemistry") return `<g transform="scale(${s})" fill="none" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"><path d="M0 -20 L17.3 -10 L17.3 10 L0 20 L-17.3 10 L-17.3 -10 Z"/><circle r="9" stroke-width="2.2"/><circle cx="0" cy="-20" r="3.4" fill="${col}"/><circle cx="17.3" cy="10" r="3.4" fill="${col}"/><circle cx="-17.3" cy="10" r="3.4" fill="${col}"/></g>`;
  return `<g transform="scale(${s})" fill="none" stroke="${col}" stroke-width="3.2"><ellipse rx="24" ry="17" transform="rotate(-18)"/><circle cx="-4" cy="-2" r="7" fill="${col}" fill-opacity=".35"/><circle cx="11" cy="6" r="2.6" fill="${col}"/><circle cx="8" cy="-9" r="2" fill="${col}"/><circle cx="-14" cy="8" r="2" fill="${col}"/></g>`;
}
function llCounts(){ let lessons=0; const per={}; MAP.forEach(s=>{ const ready=s.chapters.flatMap(c=>c.topics).filter(t=>t.ready).length; per[s.key]={ch:s.chapters.length, chReady:s.chapters.filter(c=>c.ready).length, lessons:ready}; lessons+=ready; }); return {lessons,per}; }
function llLast(){ const l=store.get("c10-last",null); if(!l) return null; const f=findTopic(l.s,l.id); if(!f) return null; return {href:href(l.s,l.id), label:`${bnNum(l.id,LANG)} ${title(f.t)}`, s:l.s}; }

function universeSVG(){
  const {per}=llCounts(); const C=[260,250], R=168;
  const pos={physics:-90,chemistry:30,biology:150};
  let s=`<svg viewBox="0 0 520 520" role="group" aria-label="${LANG==="bn"?"বিষয়ের মানচিত্র":"Map of subjects"}">`;
  s+=`<circle class="orbit" cx="${C[0]}" cy="${C[1]}" r="${R}"/>`;
  MAP.forEach(sub=>{ const a=pos[sub.key]*Math.PI/180, x=C[0]+R*Math.cos(a), y=C[1]+R*Math.sin(a); s+=`<line class="link" data-k="${sub.key}" x1="${C[0]}" y1="${C[1]}" x2="${x}" y2="${y}"/>`; });
  s+=`<circle class="pulse" cx="${C[0]}" cy="${C[1]}" r="66" fill="var(--chalk)"/>`;
  s+=`<g class="core"><circle cx="${C[0]}" cy="${C[1]}" r="56" fill="var(--chalk)"/><g transform="translate(${C[0]-20},${C[1]-38}) scale(.62)" color="var(--night)">${logoMark().replace('<svg class=""','<svg width="64" height="64"')}</g><text x="${C[0]}" y="${C[1]+30}" font-size="15">Let's Learn</text></g>`;
  MAP.forEach(sub=>{ const a=pos[sub.key]*Math.PI/180, x=C[0]+R*Math.cos(a), y=C[1]+R*Math.sin(a), col=SUBJ_COL[sub.key], p=per[sub.key];
    const n=sub.chapters.length, rr=86;
    let dots=""; sub.chapters.forEach((c,i)=>{ const b=(i/n)*Math.PI*2-Math.PI/2, dx=x+rr*Math.cos(b), dy=y+rr*Math.sin(b); dots+= c.ready?`<circle cx="${dx}" cy="${dy}" r="5.5" fill="${col}"/>`:`<circle cx="${dx}" cy="${dy}" r="4.5" fill="none" stroke="${col}" stroke-width="1.6" opacity=".7"/>`; });
    s+=`<g class="sat"><g class="spin ${sub.key==="chemistry"?"r":""}" style="transform-origin:${x}px ${y}px">${dots}</g></g>`;
    s+=`<g class="node" data-k="${sub.key}" tabindex="0" role="button" aria-label="${title(sub)}"><circle class="disc" cx="${x}" cy="${y}" r="56" stroke="${col}"/><g transform="translate(${x},${y-10})">${subjMotif(sub.key,col,52)}</g><text class="lbl" x="${x}" y="${y+28}" font-size="${LANG==="bn"?17:16}">${title(sub)}</text></g>`;
  });
  return s+`</svg>`;
}
function uniCard(key){ const L=LL[LANG]; const sub=subjOf(key); const p=llCounts().per[key];
  return `<h3 style="color:${SUBJ_COL[key]}">${title(sub)}</h3><p>${L.desc[key]}</p><div class="row"><span class="cnt">${bnNum(p.ch,LANG)}${L.chapters} · ${bnNum(p.lessons,LANG)}${L.lessonsReady}</span><a href="${href(key)}">${L.openS(title(sub))}</a></div>`; }

function viewLanding(){
  const L=LL[LANG]; const {lessons,per}=llCounts(); const last=llLast();
  const startHref = last ? last.href : href("physics","1.1");
  const subjRows = MAP.map(sub=>{ const p=per[sub.key]; const [d,n]=progressOf(sub);
    const ready=sub.chapters.filter(c=>c.ready); const chips=ready.slice(0,6).map(c=>`<a href="${href(sub.key,"c"+c.n)}">${bnNum(c.n,LANG)}. ${esc(title(c))}</a>`).join("");
    const extra = sub.chapters.length-Math.min(6,ready.length);
    return `<article class="ll-subj s-${sub.key}"><svg class="art" viewBox="-40 -40 80 80" aria-hidden="true"><circle r="38" fill="var(--c-soft)"/>${subjMotif(sub.key,"var(--c)",58)}</svg>
      <div><h3>${title(sub)}</h3><p class="d">${L.desc[sub.key]}</p><div class="meta">${bnNum(p.ch,LANG)}${L.chapters} · ${bnNum(p.lessons,LANG)}${L.lessonsReady}</div>
      <div class="ll-chips">${chips}${extra>0?`<span>${L.more(bnNum(extra,LANG))}</span>`:""}</div>
      ${d>0?`<div class="ll-mine"><span>${L.mine(bnNum(d,LANG),bnNum(n,LANG))}</span><span class="bar"><i style="width:${100*d/n}%"></i></span></div>`:""}</div>
      <a class="ll-btn line go" href="${href(sub.key)}">${L.openS(title(sub))}</a></article>`; }).join("");
  const showBack = last || DONE.size>0 || AUTH.user;
  const ring=(sub)=>{ const [d,n]=progressOf(sub); const f=n?d/n:0, r=18, c=2*Math.PI*r; return `<span class="ring s-${sub.key}"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="${r}" fill="none" stroke="var(--rule)" stroke-width="5"/><circle cx="22" cy="22" r="${r}" fill="none" stroke="var(--c)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c*f} ${c}" transform="rotate(-90 22 22)"/></svg>${title(sub)}: ${bnNum(d,LANG)}/${bnNum(n,LANG)}</span>`; };
  return `
  <section class="ll-hero" aria-labelledby="ll-h1"><div class="ll-wrap">
    <div>
      <h1 id="ll-h1">${L.h.map(x=>`<span>${x}</span>`).join("")}</h1>
      <p class="ll-lede">${L.lede}</p>
      <div class="ll-ctas"><a class="ll-btn primary" href="${startHref}">${last?L.cont:L.start}</a><a class="ll-btn ghost" href="#" data-jump="ll-explore">${L.explore}</a></div>
      ${last?`<p class="ll-cont">${L.contLine(last)}</p>`:""}
      <p class="ll-facts">${L.facts(bnNum(lessons,LANG),bnNum(MAP.length,LANG))}</p>
    </div>
    <div class="ll-uni">${universeSVG()}<div class="ll-card" id="ll-card" aria-live="polite">${uniCard("physics")}</div>
      <p class="ll-legend"><span><i style="background:var(--chalk-2)"></i>${L.ready}</span><span><i style="border:1.5px solid var(--chalk-2)"></i>${L.notyet}</span></p></div>
  </div></section>

  ${showBack?`<section class="ll-sec" style="padding-bottom:0"><div class="ll-wrap"><div class="ll-back"><div><h2>${AUTH.user?AU[LANG].hello(esc(AUTH.user.name.split(" ")[0])):L.backH}</h2><p class="muted" style="margin:4px 0 0">${last?`${L.backI} <b>${esc(title(subjOf(last.s)))} → ${last.label}</b>`:L.backI}</p><div class="rings">${MAP.map(ring).join("")}</div><p class="note">${AUTH.user?AU[LANG].synced:L.backNote}</p></div>${last?`<a class="ll-btn ink" href="${last.href}">${L.contBtn}</a>`:""}</div></div></section>`:""}

  <section class="ll-sec" id="ll-explore" aria-labelledby="ll-ex"><div class="ll-wrap">
    <h2 id="ll-ex">${L.exploreH}</h2><p class="intro">${L.exploreI}</p>
    <form class="ll-search searchbox" id="homesearch" role="search"><input id="q" type="search" placeholder="${esc(UI[LANG].searchPh)}" autocomplete="off" aria-label="${esc(UI[LANG].search)}"></form>
    <div class="results" id="results" style="margin:-14px 0 24px;max-width:620px"></div>
    <div class="ll-subjects">${subjRows}</div>
  </div></section>

  <section class="ll-sec" style="background:var(--sheet);border-block:1px solid var(--rule)" aria-labelledby="ll-pv"><div class="ll-wrap ll-prev">
    <div><h2 id="ll-pv">${L.prevH}</h2><p class="intro">${L.prevI}</p>
      <ol class="ll-parts">${L.parts.map(p=>`<li><span><b>${p[1]}</b><small>${p[2]}</small></span></li>`).join("")}</ol></div>
    <div class="ll-stack" id="ll-stack"><p class="muted">…</p></div>
  </div></section>

  <section class="ll-sec" id="ll-how" aria-labelledby="ll-hw"><div class="ll-wrap">
    <h2 id="ll-hw" style="margin-bottom:26px">${L.howH}</h2>
    <ol class="ll-steps">${L.steps.map(s=>`<li><b>${s[0]}</b><p>${s[1]}</p></li>`).join("")}</ol>
  </div></section>

  <section class="ll-final" aria-labelledby="ll-fn"><div class="ll-wrap">
    <h2 id="ll-fn">${L.finalH}</h2><p>${L.finalP}</p>
    <div class="ll-ctas"><a class="ll-btn primary" href="${startHref}">${last?L.cont:L.start}</a><a class="ll-btn ghost" href="#" data-jump="ll-explore">${L.explore}</a></div>
  </div></section>
  <footer class="ll-foot"><div class="ll-wrap">
    <div><div class="fb" style="color:var(--chalk)">${logoMark()}<span>Let's Learn</span></div><p style="margin:0;max-width:36em">${L.credit}</p><p style="margin:10px 0 0;color:var(--chalk)">${CREDIT[LANG]}</p></div>
    <div><h4>${L.fSubjects}</h4>${MAP.map(s=>`<a href="${href(s.key)}">${title(s)}</a>`).join("")}</div>
    <div><h4>${L.fSite}</h4><a href="#" data-jump="ll-how">${L.fHow}</a><a href="#" data-jump="ll-explore">${L.explore}</a><a href="#" data-jump="ll-h1">${L.fTop}</a></div>
  </div></footer>`;
}

async function wireLanding(root){
  const L=LL[LANG];
  // universe interaction
  const card=$("#ll-card",root);
  const pick=(k)=>{ root.querySelectorAll(".ll-uni .node").forEach(n=>{ const on=n.dataset.k===k; n.querySelector(".disc").setAttribute("r",on?62:56); n.setAttribute("aria-pressed",on); });
    root.querySelectorAll(".ll-uni .link").forEach(l=>l.style.stroke = l.dataset.k===k ? SUBJ_COL[k] : ""); card.innerHTML=uniCard(k); };
  root.querySelectorAll(".ll-uni .node").forEach(n=>{ const k=n.dataset.k; n.addEventListener("click",()=>pick(k)); n.addEventListener("mouseenter",()=>pick(k)); n.addEventListener("focus",()=>pick(k)); n.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); location.hash=href(k); } }); });
  pick("physics");
  // pause the slow orbit when the hero is off screen
  if("IntersectionObserver" in window){ const hero=$(".ll-hero",root); const io=new IntersectionObserver(es=>es.forEach(e=>root.querySelectorAll(".ll-uni .spin,.ll-uni .pulse").forEach(g=>g.style.animationPlayState=e.isIntersecting?"running":"paused"))); io.observe(hero); }
  // real lesson preview (Physics 2.6)
  const stack=$("#ll-stack",root); if(!stack) return;
  try{
    const data=await loadChapter("physics",2); const les=data && data.lessons["2.6"]; if(!les) throw 0; const X=les[LANG]; const u=UI[LANG];
    const cut=(h,n)=>{ const t=strip(h); return t.length>n? t.slice(0,n).replace(/\s+\S*$/,"")+"…" : t; };
    const ex=(X.examples||[])[0]; const q=(X.quiz||[])[0];
    const exAns = ex ? ex.steps.find(s=>/Answer/.test(s.label)) : null;
    const g=`<svg viewBox="0 0 300 120" aria-hidden="true"><line x1="34" y1="100" x2="290" y2="100" stroke="var(--muted)"/><line x1="34" y1="10" x2="34" y2="100" stroke="var(--muted)"/>${[0,1,2,3,4,5].map(i=>`<line x1="${34+i*48}" y1="${100-i*16}" x2="${34+i*48}" y2="100" stroke="var(--rule)" stroke-dasharray="3 3"/>`).join("")}<polyline points="34,100 274,20" fill="none" stroke="var(--phy)" stroke-width="3.5"/>${[1,2,3,4,5].map(i=>`<circle cx="${34+i*48}" cy="${100-i*16}" r="4" fill="var(--phy)"/>`).join("")}<text x="288" y="114" font-size="12" text-anchor="end" fill="var(--muted)">t (s)</text><text x="40" y="18" font-size="12" fill="var(--muted)">v (m/s)</text></svg>`;
    stack.innerHTML = `
      <div class="ll-pc"><p class="h"><i>${bnNum(1,LANG)}</i>${u.s.what}</p><p>${cut(X.what,170)}</p></div>
      ${X.analogy?`<div class="ll-pc analogy"><p class="h" style="color:var(--note)">💡 ${u.analogy}</p><p>${cut(X.analogy,200)}</p></div>`:""}
      ${X.formula?`<div class="ll-pc"><p class="h"><i>${bnNum(6,LANG)}</i>${u.s.formula}</p><span class="eq">${X.formula.lines.slice(0,2).join(" &nbsp;·&nbsp; ")}</span></div>`:""}
      <div class="ll-pc"><p class="h"><i>${bnNum(7,LANG)}</i>${u.s.visual}</p>${g}<p class="muted" style="font-size:14px">${L.seeIt}</p></div>
      ${ex?`<div class="ll-pc"><p class="h"><i>${bnNum(8,LANG)}</i>${u.s.example}</p><p>${cut(ex.q,150)}</p>${exAns?`<p style="margin-top:6px"><b>${u.labels.Answer}:</b> ${exAns.html}</p>`:""}</div>`:""}
      ${q?`<div class="ll-pc" id="ll-q"><p class="h"><i>${bnNum(10,LANG)}</i>${u.s.quiz}</p><p><b>${L.tryQ}</b> ${q.q}</p><div class="opts">${q.options.map((o,i)=>`<button data-i="${i}">${o}</button>`).join("")}</div><p class="fb" hidden></p></div>`:""}
      <a class="open" href="${href("physics","2.6")}">${L.open}</a>`;
    const qq=$("#ll-q",stack); if(qq){ qq.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ const i=+b.dataset.i; qq.querySelectorAll("button").forEach(x=>x.classList.remove("right","wrong")); b.classList.add(i===q.answer?"right":"wrong"); if(i!==q.answer) qq.querySelectorAll("button")[q.answer].classList.add("right"); const fb=$(".fb",qq); fb.hidden=false; fb.innerHTML=`<b>${i===q.answer?u.correct:u.wrong}</b> ${q.explain}`; })); }
  }catch(e){ stack.innerHTML=`<a class="ll-btn line" href="${href("physics","2.6")}">${L.open}</a>`; }
}
