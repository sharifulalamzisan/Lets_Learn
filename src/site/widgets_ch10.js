/* ---- chapter 10 widgets: static electricity ---- */
const B10 = x => bnNum(x, LANG);
const chips10 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const K10 = 9e9;
const POS10 = "var(--bad)", NEG10 = "var(--c)";
/* a small charge sign drawn in SVG */
const sgn10 = (x, y, s, r = 7) => s > 0
  ? `<g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${POS10}" stroke-width="1.5"/><path d="M${x-r*0.55} ${y}h${r*1.1}M${x} ${y-r*0.55}v${r*1.1}" stroke="${POS10}" stroke-width="2"/></g>`
  : `<g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${NEG10}" stroke-width="1.5"/><path d="M${x-r*0.55} ${y}h${r*1.1}" stroke="${NEG10}" stroke-width="2"/></g>`;
const sci10 = (x, d = 2) => { if (x === 0) return B10("0"); const a = Math.abs(x); if (a >= 1e4 || a < 1e-2) { const e = Math.floor(Math.log10(a)); let m = x / Math.pow(10, e); m = +m.toFixed(d); return B10(String(m).replace("-","−")) + " × " + B10("10") + "<sup>" + B10(e) + "</sup>"; } return B10(String(+x.toPrecision(3)).replace("-","−")); };

/* 10.1 atom: remove / add electrons, see the charge */
W.c10atom = (el) => {
  const ATOMS = [[1,0,L2("Hydrogen","হাইড্রোজেন")],[2,2,L2("Helium","হিলিয়াম")],[3,4,L2("Lithium","লিথিয়াম")],[6,6,L2("Carbon","কার্বন")]];
  let Z = 3, N = 4, ne = 3, name = ATOMS[2][2];
  el.innerHTML = `<div class="chipset c10a" role="group">${ATOMS.map((a,i)=>`<button data-i="${i}" aria-pressed="${i===2}">${a[2]}</button>`).join("")}</div>
  <div class="svgwrap fit" id="c10asv"></div>
  <div class="w-row" style="flex-wrap:wrap;gap:6px"><button class="btn solid" id="c10arm">${L2("Remove an electron","একটি ইলেকট্রন সরাও")}</button><button class="btn solid" id="c10aad">${L2("Add an electron","একটি ইলেকট্রন যোগ করো")}</button><button class="btn" id="c10ars">${L2("Neutral again","আবার নিস্তড়িৎ")}</button></div>
  <div class="w-out" id="c10ao"></div>`;
  const draw = () => {
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("atom","পরমাণু")}">`;
    const cx = 180, cy = 115, shells = [48, 88];
    shells.forEach(r => g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--rule)" stroke-dasharray="4 4"/>`);
    const A = Z + N; const k = A > 1 ? 7 : 0;
    for (let i = 0; i < A; i++) { const r = k * Math.sqrt(i + 0.3), th = i * 2.4; const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
      const isP = Math.floor((i + 1) * Z / A) > Math.floor(i * Z / A);
      g += isP ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${POS10}"/><path d="M${(x-3.5).toFixed(1)} ${y.toFixed(1)}h7M${x.toFixed(1)} ${(y-3.5).toFixed(1)}v7" stroke="var(--sheet)" stroke-width="1.6"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="var(--muted)"/>`; }
    const inner = Math.min(ne, 2), outer = ne - inner;
    for (let i = 0; i < inner; i++) { const th = Math.PI * i + 0.4; g += `<circle cx="${cx+48*Math.cos(th)}" cy="${cy+48*Math.sin(th)}" r="6" fill="${NEG10}"/><path d="M${cx+48*Math.cos(th)-3} ${cy+48*Math.sin(th)}h6" stroke="var(--sheet)" stroke-width="1.6"/>`; }
    for (let i = 0; i < outer; i++) { const th = 2 * Math.PI * i / Math.max(outer, 1) - 1.2; g += `<circle cx="${cx+88*Math.cos(th)}" cy="${cy+88*Math.sin(th)}" r="6" fill="${NEG10}"/><path d="M${cx+88*Math.cos(th)-3} ${cy+88*Math.sin(th)}h6" stroke="var(--sheet)" stroke-width="1.6"/>`; }
    const q = Z - ne;
    g += `<text x="10" y="22" font-size="14" fill="${POS10}">${L2("protons","প্রোটন")}: ${B10(Z)}</text><text x="10" y="42" font-size="14" fill="${NEG10}">${L2("electrons","ইলেকট্রন")}: ${B10(ne)}</text><text x="10" y="62" font-size="14" fill="var(--muted)">${L2("neutrons","নিউট্রন")}: ${B10(N)}</text>`;
    g += `<text x="350" y="22" font-size="16" text-anchor="end" font-weight="700" fill="${q>0?POS10:q<0?NEG10:"var(--ink)"}">${q===0?L2("neutral","নিস্তড়িৎ"):(q>0?"+":"−")+(Math.abs(q)===1?"":B10(Math.abs(q)))+"e"}</text></svg>`;
    $("#c10asv", el).innerHTML = g;
    const Cq = sci10(q * 1.6e-19);
    $("#c10ao", el).innerHTML = q === 0
      ? L2(`${name}: ${Z} protons and ${ne} electrons. The charges cancel, so the atom is <b>neutral</b>.`, `${name}: ${B10(Z)}টি প্রোটন আর ${B10(ne)}টি ইলেকট্রন। চার্জ কাটাকাটি, তাই পরমাণু <b>নিস্তড়িৎ</b>।`)
      : L2(`${q>0?"Lost":"Gained"} ${Math.abs(q)} electron${Math.abs(q)>1?"s":""} → a <b>${q>0?"positive":"negative"} ion</b>. Charge q = ${q>0?"+":"−"}${Math.abs(q)}e = <b>${q>0?"+":""}${Cq} C</b>. The protons never moved.`,
            `${B10(Math.abs(q))}টি ইলেকট্রন ${q>0?"হারিয়েছে":"পেয়েছে"} → <b>${q>0?"ধনাত্মক":"ঋণাত্মক"} আয়ন</b>। চার্জ q = ${q>0?"+":"−"}${B10(Math.abs(q))}e = <b>${q>0?"+":""}${Cq} C</b>। প্রোটন একটুও সরেনি।`);
    $("#c10arm", el).disabled = ne <= 0; $("#c10aad", el).disabled = ne >= Z + 2;
  };
  chips10(el, ".c10a", b => { const a = ATOMS[+b.dataset.i]; Z = a[0]; N = a[1]; name = a[2]; ne = Z; draw(); });
  $("#c10arm", el).addEventListener("click", () => { if (ne > 0) ne--; draw(); });
  $("#c10aad", el).addEventListener("click", () => { if (ne < Z + 2) ne++; draw(); });
  $("#c10ars", el).addEventListener("click", () => { ne = Z; draw(); });
  draw();
};

/* 10.2 charging by friction + like/unlike test */
W.c10rub = (el) => {
  /* [A name, B name, electrons go from A to B?] A = rod on left */
  const PAIRS = [[L2("Glass rod","কাচদণ্ড"),L2("Silk","সিল্ক"),true],[L2("Plastic rod","প্লাস্টিক দণ্ড"),L2("Flannel","ফ্লানেল"),false],[L2("Plastic comb","প্লাস্টিকের চিরুনি"),L2("Dry hair","শুকনো চুল"),false]];
  let p = 0, moved = 0, sA = 1, sB = -1, busy = false;
  el.innerHTML = `<p class="hint">${L2("1. Rub a pair","১. একজোড়া ঘষো")}</p><div class="chipset c10p" role="group">${PAIRS.map((q,i)=>`<button data-i="${i}" aria-pressed="${i===0}">${q[0]} + ${q[1]}</button>`).join("")}</div>
  <div class="svgwrap fit" id="c10rsv"></div><div class="w-row" style="gap:6px"><button class="btn solid" id="c10rgo">${L2("Rub","ঘষো")}</button><button class="btn" id="c10rrs">${L2("Reset","আবার শুরু")}</button></div><div class="w-out" id="c10ro"></div>
  <p class="hint" style="margin-top:14px">${L2("2. Bring a charged rod near a hanging charged rod","২. ঝুলন্ত আহিত দণ্ডের কাছে আরেকটি আহিত দণ্ড আনো")}</p>
  <div class="w-row" style="flex-wrap:wrap;gap:8px"><span class="muted">${L2("Hanging","ঝুলন্ত")}:</span><div class="chipset c10h" role="group"><button data-s="1" aria-pressed="true">${L2("glass (+)","কাচ (+)")}</button><button data-s="-1" aria-pressed="false">${L2("plastic (−)","প্লাস্টিক (−)")}</button></div></div>
  <div class="w-row" style="flex-wrap:wrap;gap:8px"><span class="muted">${L2("Brought near","কাছে আনা")}:</span><div class="chipset c10n" role="group"><button data-s="1" aria-pressed="false">${L2("glass (+)","কাচ (+)")}</button><button data-s="-1" aria-pressed="true">${L2("plastic (−)","প্লাস্টিক (−)")}</button></div></div>
  <div class="svgwrap fit" id="c10fsv"></div><div class="w-out" id="c10fo"></div>`;
  const drawRub = (anim = 0) => {
    const [a, b, aToB] = PAIRS[p];
    let g = `<svg viewBox="0 0 360 150" role="img" aria-label="${L2("rubbing","ঘষা")}">${arrowDefs("c10ra","var(--c)")}`;
    g += `<rect x="20" y="50" width="130" height="36" rx="8" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1"/><text x="85" y="40" font-size="14" text-anchor="middle" fill="var(--ink)">${a}</text>`;
    g += `<rect x="210" y="46" width="130" height="44" rx="14" fill="var(--paper)" stroke="var(--muted)" stroke-dasharray="3 2"/><text x="275" y="40" font-size="14" text-anchor="middle" fill="var(--ink)">${b}</text>`;
    const qa = aToB ? moved : -moved, qb = -qa;
    const put = (x0, q) => { let s = ""; for (let i = 0; i < Math.abs(q); i++) s += sgn10(x0 + 14 + (i % 6) * 20, 68, q > 0 ? 1 : -1, 7); return s; };
    g += put(20, qa) + put(210, qb);
    if (anim > 0) { const t = anim; const x = aToB ? 150 + 60 * t : 210 - 60 * t; g += `<circle cx="${x}" cy="68" r="6" fill="${NEG10}"/>`; }
    g += `<line x1="${aToB?140:220}" y1="118" x2="${aToB?220:140}" y2="118" stroke="var(--c)" stroke-width="2" marker-end="url(#c10ra)"/><text x="180" y="140" font-size="14" text-anchor="middle" fill="var(--c)">${L2("electrons move this way","ইলেকট্রন এদিকে যায়")}</text></svg>`;
    $("#c10rsv", el).innerHTML = g;
    $("#c10ro", el).innerHTML = moved === 0 ? L2("Both are neutral. Press <b>Rub</b>.", "দুটোই নিস্তড়িৎ। <b>ঘষো</b> চাপো।")
      : L2(`${moved} electron${moved>1?"s":""} moved from the ${aToB?a.toLowerCase():b.toLowerCase()} to the ${aToB?b.toLowerCase():a.toLowerCase()}. ${a}: <b>${qa>0?"+":"−"}${moved}</b>, ${b.toLowerCase()}: <b>${qb>0?"+":"−"}${moved}</b>. Equal and opposite, total still zero.`,
           `${B10(moved)}টি ইলেকট্রন ${aToB?a:b} থেকে ${aToB?b:a}-তে গেছে। ${a}: <b>${qa>0?"+":"−"}${B10(moved)}</b>, ${b}: <b>${qb>0?"+":"−"}${B10(moved)}</b>। সমান ও বিপরীত, মোট চার্জ এখনো শূন্য।`);
  };
  const rub = () => { if (busy || moved >= 6) return; if (REDUCED) { moved++; drawRub(); return; } busy = true; let t = 0; animate(el, dt => { if (!busy) return; t += dt * 2.5; if (t >= 1) { busy = false; moved++; drawRub(); return; } drawRub(t); }); };
  const drawForce = () => {
    const like = sA === sB; const ang = like ? 18 : -14; /* degrees: + = swing away (to the left) */
    const px = 150, py = 20, L = 110;
    const th = ang * Math.PI / 180; const bx = px - L * Math.sin(th), by = py + L * Math.cos(th);
    let g = `<svg viewBox="0 0 360 170" role="img" aria-label="${L2("force test","বলের পরীক্ষা")}"><line x1="100" y1="${py}" x2="200" y2="${py}" stroke="var(--muted)" stroke-width="3"/><line x1="${px}" y1="${py}" x2="${bx}" y2="${by}" stroke="var(--muted)"/>`;
    g += `<g transform="translate(${bx},${by})"><rect x="-50" y="-8" width="100" height="16" rx="6" fill="${sA>0?"var(--bad-soft)":"var(--c-soft)"}" stroke="${sA>0?POS10:NEG10}"/>${sgn10(35,0,sA,6)}</g>`;
    g += `<rect x="250" y="${by-8}" width="100" height="16" rx="6" fill="${sB>0?"var(--bad-soft)":"var(--c-soft)"}" stroke="${sB>0?POS10:NEG10}"/>${sgn10(265,by,sB,6)}`;
    g += `<text x="180" y="162" font-size="15" text-anchor="middle" font-weight="700" fill="${like?"var(--bad)":"var(--good)"}">${like?L2("REPEL: swings away","বিকর্ষণ: দূরে সরে যায়"):L2("ATTRACT: swings closer","আকর্ষণ: কাছে আসে")}</text></svg>`;
    $("#c10fsv", el).innerHTML = g;
    $("#c10fo", el).innerHTML = like ? L2("Like charges repel each other.", "সমধর্মী চার্জ পরস্পরকে বিকর্ষণ করে।") : L2("Unlike charges attract each other.", "বিপরীতধর্মী চার্জ পরস্পরকে আকর্ষণ করে।");
  };
  chips10(el, ".c10p", b => { p = +b.dataset.i; moved = 0; busy = false; drawRub(); });
  chips10(el, ".c10h", b => { sA = +b.dataset.s; drawForce(); });
  chips10(el, ".c10n", b => { sB = +b.dataset.s; drawForce(); });
  $("#c10rgo", el).addEventListener("click", rub);
  $("#c10rrs", el).addEventListener("click", () => { moved = 0; busy = false; drawRub(); });
  drawRub(); drawForce();
};

/* 10.3 induction: two spheres step-through, and the electroscope */
W.c10induce = (el) => {
  let mode = "s", step = 0, qe = 0, rod = 0; /* electroscope: qe = its own charge (units), rod = +1/-1/0 near the disc */
  el.innerHTML = `<div class="chipset c10m" role="group"><button data-m="s" aria-pressed="true">${L2("Two spheres","দুটি গোলক")}</button><button data-m="e" aria-pressed="false">${L2("Electroscope","তড়িৎবীক্ষণ যন্ত্র")}</button></div><div class="svgwrap fit" id="c10isv"></div><div id="c10ictl"></div><div class="w-out" id="c10io"></div>`;
  const STEPS = [
    [L2("Two neutral metal spheres A and B touch, on insulating stands.","অপরিবাহী স্ট্যান্ডে দুটি নিস্তড়িৎ ধাতব গোলক A ও B পরস্পর লেগে আছে।")],
    [L2("Bring a + rod near A. Electrons are pulled into A; B is left +. Nothing flows from the rod.","A-এর কাছে + দণ্ড আনো। ইলেকট্রন A-তে টেনে আসে; B থাকে +। দণ্ড থেকে কিছুই আসে না।")],
    [L2("Keep the rod there and pull the spheres apart. The separated charges are trapped.","দণ্ড সেখানে রেখেই গোলক দুটো আলাদা করো। আলাদা হওয়া চার্জ আটকে যায়।")],
    [L2("Now remove the rod. A is left negative and B positive, by equal amounts.","এবার দণ্ড সরাও। A থাকে ঋণাত্মক আর B ধনাত্মক, সমপরিমাণে।")]];
  const drawS = () => {
    const gap = step >= 2 ? 44 : 0; const R = 36, ax = 184 - R - gap / 2, bx = 184 + R + gap / 2, cy = 88;
    let g = `<svg viewBox="0 0 360 180" role="img" aria-label="${L2("induction","আবেশ")}">`;
    [ax, bx].forEach((x, i) => g += `<line x1="${x}" y1="${cy+R}" x2="${x}" y2="160" stroke="var(--muted)" stroke-width="4"/><rect x="${x-18}" y="158" width="36" height="6" fill="var(--muted)"/><circle cx="${x}" cy="${cy}" r="${R}" fill="var(--paper)" stroke="var(--ink)"/><text x="${x}" y="${cy-R-8}" font-size="14" text-anchor="middle" fill="var(--ink)">${i?"B":"A"}</text>`);
    if (step === 0) { [ax, bx].forEach(x => { g += sgn10(x-10, cy-10, 1, 6) + sgn10(x+10, cy+10, 1, 6) + sgn10(x+10, cy-10, -1, 6) + sgn10(x-10, cy+10, -1, 6); }); }
    else if (step <= 2) { /* electrons crowd on the left of A, positives on the right of B */
      g += sgn10(ax-R+10, cy-12, -1, 6) + sgn10(ax-R+8, cy+4, -1, 6) + sgn10(ax-R+14, cy+18, -1, 6);
      g += sgn10(bx+R-10, cy-12, 1, 6) + sgn10(bx+R-8, cy+4, 1, 6) + sgn10(bx+R-14, cy+18, 1, 6); }
    else { g += sgn10(ax-12, cy-10, -1, 6) + sgn10(ax+12, cy-6, -1, 6) + sgn10(ax, cy+14, -1, 6); g += sgn10(bx-12, cy-10, 1, 6) + sgn10(bx+12, cy-6, 1, 6) + sgn10(bx, cy+14, 1, 6); }
    if (step >= 1 && step <= 2) { const re = ax - R - 10, rs = re - 76; g += `<rect x="${rs}" y="${cy-9}" width="76" height="18" rx="6" fill="var(--bad-soft)" stroke="${POS10}"/>` + sgn10(rs+18, cy, 1, 6) + sgn10(rs+38, cy, 1, 6) + sgn10(rs+58, cy, 1, 6) + `<text x="${rs+38}" y="${cy-16}" font-size="14" text-anchor="middle" fill="var(--muted)">${L2("glass rod","কাচদণ্ড")}</text>`; }
    g += `<text x="350" y="20" font-size="14" text-anchor="end" fill="var(--muted)">${L2("step","ধাপ")} ${B10(step+1)}/${B10(4)}</text></svg>`;
    $("#c10isv", el).innerHTML = g; $("#c10io", el).innerHTML = STEPS[step][0];
    $("#c10ib", el).disabled = step === 0; $("#c10in", el).disabled = step === 3;
  };
  const drawE = () => {
    const L = qe + rod; /* charge on leaves (units) */
    const disc = -rod; /* induced on disc */
    const ang = Math.min(40, Math.abs(L) * 13); const cx = 180, top = 100;
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("electroscope","তড়িৎবীক্ষণ যন্ত্র")}">`;
    g += `<path d="M110 110 Q110 90 130 90 H230 Q250 90 250 110 V205 H110 Z" fill="var(--c-soft)" fill-opacity=".35" stroke="var(--muted)"/><rect x="165" y="80" width="30" height="16" fill="var(--muted)"/>`;
    g += `<rect x="${cx-40}" y="44" width="80" height="8" rx="3" fill="var(--ink)"/><line x1="${cx}" y1="52" x2="${cx}" y2="${top}" stroke="var(--ink)" stroke-width="4"/>`;
    const leaf = s => { const a = s * ang * Math.PI / 180, l = 62; return `<line x1="${cx}" y1="${top}" x2="${cx+l*Math.sin(a)}" y2="${top+l*Math.cos(a)}" stroke="var(--note)" stroke-width="5" stroke-linecap="round"/>`; };
    g += leaf(-1) + leaf(1);
    if (L !== 0) { const s = L > 0 ? 1 : -1; for (let i = 0; i < Math.min(2, Math.abs(L)); i++) { const a = (ang) * Math.PI / 180, d = 26 + i * 20; g += sgn10(cx - d * Math.sin(a) - 10, top + d * Math.cos(a), s, 6) + sgn10(cx + d * Math.sin(a) + 10, top + d * Math.cos(a), s, 6); } }
    if (disc !== 0) g += sgn10(cx - 20, 36, disc, 6) + sgn10(cx + 20, 36, disc, 6);
    if (rod !== 0) { g += `<rect x="${cx-55}" y="4" width="110" height="16" rx="6" fill="${rod>0?"var(--bad-soft)":"var(--c-soft)"}" stroke="${rod>0?POS10:NEG10}"/>` + sgn10(cx-30, 12, rod, 5) + sgn10(cx, 12, rod, 5) + sgn10(cx+30, 12, rod, 5); }
    g += `<text x="20" y="220" font-size="14" fill="var(--muted)">${L2("own charge","নিজের চার্জ")}: ${qe===0?B10(0):(qe>0?"+":"−")+B10(Math.abs(qe))}</text></svg>`;
    $("#c10isv", el).innerHTML = g;
    let t;
    if (rod === 0) t = qe === 0 ? L2("Uncharged: the leaves hang together.", "চার্জহীন: পাত দুটো একসাথে ঝুলে আছে।") : L2(`The electroscope is ${qe>0?"positively":"negatively"} charged. Both leaves have the same charge, so they repel and stay open.`, `যন্ত্রটি ${qe>0?"ধনাত্মক":"ঋণাত্মক"} চার্জে আহিত। দুটি পাতের চার্জ একই, তাই বিকর্ষণ করে খোলা থাকে।`);
    else if (qe === 0) t = L2(`Induction: the ${rod>0?"+":"−"} rod pulls opposite charge to the disc and pushes like charge to the leaves, so they open. Remove the rod and they close.`, `আবেশ: ${rod>0?"+":"−"} দণ্ড চাকতিতে বিপরীত চার্জ টানে আর পাতে সমধর্মী চার্জ ঠেলে দেয়, তাই পাত খোলে। দণ্ড সরালে বন্ধ হয়ে যায়।`);
    else if (Math.sign(qe) === rod) t = L2("The rod has the SAME charge as the electroscope: more like charge is pushed down, and the leaves open WIDER.", "দণ্ডের চার্জ যন্ত্রের চার্জের মতোই: আরও সমধর্মী চার্জ নিচে নামে, পাতের ফাঁক আরও বাড়ে।");
    else t = L2("The rod has the OPPOSITE charge: it pulls some of the leaves' charge up to the disc, so the gap DECREASES.", "দণ্ডের চার্জ বিপরীত: এটি পাতের কিছু চার্জ চাকতিতে টেনে নেয়, তাই ফাঁক কমে যায়।");
    $("#c10io", el).innerHTML = t;
  };
  const build = () => {
    if (mode === "s") { $("#c10ictl", el).innerHTML = `<div class="w-row" style="gap:6px"><button class="btn" id="c10ib">${L2("◀ Back","◀ আগে")}</button><button class="btn solid" id="c10in">${L2("Next ▶","পরে ▶")}</button></div>`;
      $("#c10ib", el).addEventListener("click", () => { if (step > 0) step--; drawS(); }); $("#c10in", el).addEventListener("click", () => { if (step < 3) step++; drawS(); }); drawS(); }
    else { $("#c10ictl", el).innerHTML = `<div class="w-row" style="flex-wrap:wrap;gap:6px"><button class="btn" data-a="p">${L2("Bring + rod near","+ দণ্ড কাছে আনো")}</button><button class="btn" data-a="n">${L2("Bring − rod near","− দণ্ড কাছে আনো")}</button><button class="btn" data-a="x">${L2("Take rod away","দণ্ড সরাও")}</button><button class="btn solid" data-a="tp">${L2("Touch disc with + rod","+ দণ্ড দিয়ে চাকতি ছোঁও")}</button><button class="btn solid" data-a="tn">${L2("Touch disc with − rod","− দণ্ড দিয়ে চাকতি ছোঁও")}</button><button class="btn" data-a="e">${L2("Earth it (touch with finger)","ভূসংযোগ দাও (আঙুলে ছোঁও)")}</button></div>`;
      el.querySelectorAll("#c10ictl button").forEach(b => b.addEventListener("click", () => { const a = b.dataset.a;
        if (a === "p") rod = 1; else if (a === "n") rod = -1; else if (a === "x") rod = 0;
        else if (a === "tp") { qe = 2; rod = 0; } else if (a === "tn") { qe = -2; rod = 0; }
        else if (a === "e") { qe = rod !== 0 ? -rod : 0; if (rod !== 0) { rod = 0; } }
        drawE(); if (a === "e" && qe !== 0) $("#c10io", el).innerHTML += L2(" (Earthing while the rod was near, then removing the rod, left the electroscope with the opposite charge: charging by induction.)", " (দণ্ড কাছে থাকা অবস্থায় ভূসংযোগ দিয়ে পরে দণ্ড সরানোয় যন্ত্রটি বিপরীত চার্জ পেল: আবেশে আহিতকরণ।)"); }));
      drawE(); }
  };
  chips10(el, ".c10m", b => { mode = b.dataset.m; build(); });
  build();
};

/* 10.4 Coulomb's law: charges, distance, inverse square */
W.c10coulomb = (el) => {
  el.innerHTML = slider("c10q1", L2("Charge q₁", "চার্জ q₁"), -5, 5, 1, 3, "µC") + slider("c10q2", L2("Charge q₂", "চার্জ q₂"), -5, 5, 1, -2, "µC") + slider("c10r", L2("Distance r", "দূরত্ব r"), 0.1, 1, 0.05, 0.3, "m") +
    `<div class="svgwrap fit" id="c10csv"></div><div class="svgwrap fit" id="c10cgr"></div><div class="w-out" id="c10co"></div>`;
  const go = () => {
    const q1 = sv(el, "c10q1", "µC"), q2 = sv(el, "c10q2", "µC"), r = sv(el, "c10r", "m", 2);
    const F = K10 * q1 * 1e-6 * q2 * 1e-6 / (r * r);
    const d = 40 + r * 250, x1 = 180 - d / 2, x2 = 180 + d / 2, y = 60;
    let g = `<svg viewBox="0 0 360 120" role="img" aria-label="${L2("two charges","দুটি চার্জ")}"><defs><marker id="c10ca" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="var(--note)"/></marker></defs>`;
    g += `<line x1="${x1}" y1="100" x2="${x2}" y2="100" stroke="var(--muted)"/><line x1="${x1}" y1="94" x2="${x1}" y2="106" stroke="var(--muted)"/><line x1="${x2}" y1="94" x2="${x2}" y2="106" stroke="var(--muted)"/><text x="180" y="116" font-size="14" text-anchor="middle" fill="var(--muted)">r = ${B10(r.toFixed(2))} m</text>`;
    if (F !== 0) { const len = 8 + 30 * (Math.log10(Math.abs(F)) + 2.1); /* log scale: F spans 10⁻² to 10¹ N */ const rep = F > 0;
      const maxIn = d / 2 - 22; const Lh = rep ? Math.min(len, 150) : Math.min(len, maxIn);
      if (Lh > 2) { g += rep ? `<line x1="${x1-18}" y1="${y}" x2="${x1-18-Lh}" y2="${y}" stroke="var(--note)" stroke-width="4" marker-end="url(#c10ca)"/><line x1="${x2+18}" y1="${y}" x2="${x2+18+Lh}" y2="${y}" stroke="var(--note)" stroke-width="4" marker-end="url(#c10ca)"/>`
        : `<line x1="${x1+18}" y1="${y}" x2="${x1+18+Lh}" y2="${y}" stroke="var(--note)" stroke-width="4" marker-end="url(#c10ca)"/><line x1="${x2-18}" y1="${y}" x2="${x2-18-Lh}" y2="${y}" stroke="var(--note)" stroke-width="4" marker-end="url(#c10ca)"/>`; } }
    const ball = (x, q) => q === 0 ? `<circle cx="${x}" cy="${y}" r="16" fill="var(--paper)" stroke="var(--muted)"/><text x="${x}" y="${y+5}" font-size="14" text-anchor="middle" fill="var(--muted)">0</text>` : `<circle cx="${x}" cy="${y}" r="16" fill="${q>0?"var(--bad-soft)":"var(--c-soft)"}" stroke="${q>0?POS10:NEG10}" stroke-width="2"/><text x="${x}" y="${y+6}" font-size="16" font-weight="700" text-anchor="middle" fill="${q>0?POS10:NEG10}">${q>0?"+":"−"}${B10(Math.abs(q))}</text>`;
    g += ball(x1, q1) + ball(x2, q2) + `</svg>`;
    $("#c10csv", el).innerHTML = g;
    /* graph |F| against r */
    const Fm = K10 * Math.abs(q1 * q2) * 1e-12 / 0.01; let gr = `<svg viewBox="0 0 360 140" role="img" aria-label="${L2("force against distance","দূরত্বের সাথে বল")}"><line x1="44" y1="118" x2="350" y2="118" stroke="var(--muted)"/><line x1="44" y1="10" x2="44" y2="118" stroke="var(--muted)"/><text x="48" y="22" font-size="14" fill="var(--muted)">|F|</text><text x="350" y="110" font-size="14" text-anchor="end" fill="var(--muted)">r (m)</text>`;
    [0.1, 0.5, 1].forEach(v => gr += `<text x="${44+(v-0.1)/0.9*300}" y="135" font-size="13.5" text-anchor="middle" fill="var(--muted)">${B10(v)}</text>`);
    if (Fm > 0) { let pts = ""; for (let x = 0.1; x <= 1.0001; x += 0.01) pts += `${(44+(x-0.1)/0.9*300).toFixed(1)},${(118-100*0.01/(x*x)).toFixed(1)} `; gr += `<polyline points="${pts}" fill="none" stroke="var(--c)" stroke-width="2.5"/><circle cx="${44+(r-0.1)/0.9*300}" cy="${118-100*0.01/(r*r)}" r="6" fill="var(--note)"/>`; }
    gr += `</svg>`; $("#c10cgr", el).innerHTML = gr;
    const kind = F > 0 ? L2("repulsion (like charges)", "বিকর্ষণ (সমধর্মী চার্জ)") : F < 0 ? L2("attraction (unlike charges)", "আকর্ষণ (বিপরীতধর্মী চার্জ)") : L2("no force: one charge is zero", "বল নেই: একটি চার্জ শূন্য");
    $("#c10co", el).innerHTML = L2(`F = kq₁q₂/r² = 9 × 10⁹ × (${q1} × 10⁻⁶) × (${q2} × 10⁻⁶) ÷ ${r.toFixed(2)}² = <b>${sci10(F)} N</b><br>${kind}`,
      `F = kq₁q₂/r² = ৯ × ১০⁹ × (${B10(q1)} × ১০⁻⁶) × (${B10(q2)} × ১০⁻⁶) ÷ ${B10(r.toFixed(2))}² = <b>${sci10(F)} N</b><br>${kind}`);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 10.5 electric field lines, with a tap-to-probe test charge */
W.c10field = (el) => {
  const SETS = [
    [L2("+q","+q"), [[180, 130, 1]]],
    [L2("−q","−q"), [[180, 130, -1]]],
    [L2("+q and −q","+q ও −q"), [[120, 130, 1], [240, 130, -1]]],
    [L2("+q and +q","+q ও +q"), [[120, 130, 1], [240, 130, 1]]],
    [L2("+q and −2q","+q ও −২q"), [[125, 130, 1], [235, 130, -2]]]];
  let si = 2, probe = null;
  el.innerHTML = `<div class="chipset c10fs" role="group">${SETS.map((s,i)=>`<button data-i="${i}" aria-pressed="${i===si}">${s[0]}</button>`).join("")}</div><div class="svgwrap fit" id="c10fsv" style="cursor:crosshair"></div><p class="hint">${L2("Tap inside the picture to place a small + test charge.","ছবির ভেতরে ট্যাপ করে একটি ছোট + টেস্ট চার্জ রাখো।")}</p><div class="w-out" id="c10fo"></div>`;
  const Wd = 360, Ht = 260, PXM = 200; /* 200 px = 1 m; unit charge = 1 µC */
  const field = (Q, x, y) => { let ex = 0, ey = 0; for (const [cx, cy, q] of Q) { const dx = x - cx, dy = y - cy, r2 = dx * dx + dy * dy, r = Math.sqrt(r2); ex += q * dx / (r2 * r); ey += q * dy / (r2 * r); } return [ex, ey]; };
  const trace = (Q, x, y, dir) => { const pts = [[x, y]]; let end = "out";
    for (let i = 0; i < 700; i++) { const [ex, ey] = field(Q, x, y); const m = Math.hypot(ex, ey); if (!m) { end = "stuck"; break; } x += dir * 2.2 * ex / m; y += dir * 2.2 * ey / m; pts.push([x, y]);
      if (x < -5 || x > Wd + 5 || y < -5 || y > Ht + 5) { end = "out"; break; }
      let hit = false; for (const [cx, cy] of Q) if (Math.hypot(x - cx, y - cy) < 9) hit = true; if (hit && i > 3) { end = "hit"; break; } }
    return [pts, end]; };
  const path = (pts, dir) => { let d = "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L"); const m = Math.floor(pts.length * 0.4); let arr = "";
    if (pts.length > 12) { const [x0, y0] = pts[m], [x1, y1] = pts[m + 2]; const a = Math.atan2((y1 - y0) * dir, (x1 - x0) * dir) * 180 / Math.PI; arr = `<path d="M-5 -4 L4 0 L-5 4 z" transform="translate(${x0.toFixed(1)},${y0.toFixed(1)}) rotate(${a.toFixed(0)})" fill="var(--note)"/>`; }
    return `<path d="${d}" fill="none" stroke="var(--note)" stroke-width="1.4" opacity=".85"/>${arr}`; };
  const draw = () => {
    const Q = SETS[si][1]; const net = Q.reduce((s, c) => s + c[2], 0);
    let g = `<svg viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="${L2("electric lines of force","তড়িৎ বলরেখা")}">${arrowDefs("c10fa","var(--ink)")}<rect x="0" y="0" width="${Wd}" height="${Ht}" fill="var(--paper)"/>`;
    const PER = 10;
    for (const [cx, cy, q] of Q) { if (q <= 0) continue; const n = PER * q; for (let i = 0; i < n; i++) { const a = (i + 0.5) * 2 * Math.PI / n; const [pts] = trace(Q, cx + 10 * Math.cos(a), cy + 10 * Math.sin(a), 1); g += path(pts, 1); } }
    for (const [cx, cy, q] of Q) { if (q >= 0) continue; const hasPos = Q.some(c => c[2] > 0); if (hasPos && net >= 0) continue; const n = PER * -q;
      for (let i = 0; i < n; i++) { const a = (i + 0.5) * 2 * Math.PI / n; const [pts, end] = trace(Q, cx + 10 * Math.cos(a), cy + 10 * Math.sin(a), -1); if (hasPos && end === "hit") continue; g += path(pts, -1); } }
    if (si === 3) g += `<circle cx="180" cy="130" r="5" fill="none" stroke="var(--good)" stroke-width="2"/><text x="180" y="116" font-size="14" text-anchor="middle" fill="var(--good)">E = ${B10(0)}</text>`;
    for (const [cx, cy, q] of Q) g += `<circle cx="${cx}" cy="${cy}" r="${q===-2?15:12}" fill="${q>0?POS10:NEG10}"/><text x="${cx}" y="${cy+5}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--sheet)">${q>0?"+":"−"}${Math.abs(q)>1?B10(Math.abs(q)):""}</text>`;
    let out = L2("Lines start on + charges and end on − charges. Where they crowd, the field is strong.", "বলরেখা + চার্জ থেকে শুরু হয়ে − চার্জে শেষ হয়। যেখানে রেখা ঘন, সেখানে ক্ষেত্র প্রবল।");
    if (probe) { const [px, py] = probe; const [ex, ey] = field(Q, px, py); const m = Math.hypot(ex, ey);
      const E = K10 * 1e-6 * m * PXM * PXM; /* N/C */
      if (m > 0) { const L = 34; g += `<line x1="${px}" y1="${py}" x2="${px + L * ex / m}" y2="${py + L * ey / m}" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#c10fa)"/>`; }
      g += sgn10(px, py, 1, 6);
      out = L2(`At the test charge: E ≈ <b>${sci10(E)} N/C</b> (taking each charge as 1 µC and the picture 1.8 m wide). The arrow shows the direction of the force on a + charge, along the tangent to the line of force.`,
               `টেস্ট চার্জের জায়গায়: E ≈ <b>${sci10(E)} N/C</b> (প্রতিটি চার্জ ১ µC আর ছবিটি ১.৮ m চওড়া ধরে)। তীরটি + চার্জের ওপর বলের দিক দেখায়, বলরেখার স্পর্শক বরাবর।`); }
    else if (si === 3) out += L2(" Midway between the two equal + charges the fields cancel: a neutral point.", " সমান দুটি + চার্জের মাঝখানে ক্ষেত্র কাটাকাটি হয়: নিরপেক্ষ বিন্দু।");
    else if (si === 4) out += L2(" Twice as many lines end on −2q as start on +q; the extra lines come in from far away.", " +q থেকে যত রেখা বের হয়, −২q-তে শেষ হয় তার দ্বিগুণ; বাড়তি রেখাগুলো আসে অনেক দূর থেকে।");
    g += `</svg>`; $("#c10fsv", el).innerHTML = g; $("#c10fo", el).innerHTML = out;
    const svg = $("#c10fsv svg", el);
    svg.addEventListener("click", ev => { const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      if (Q.some(c => Math.hypot(p.x - c[0], p.y - c[1]) < 16)) return; probe = [p.x, p.y]; draw(); });
  };
  chips10(el, ".c10fs", b => { si = +b.dataset.i; probe = null; draw(); });
  draw();
};

/* 10.6 potential hill / well: V = kq/r */
W.c10pot = (el) => {
  el.innerHTML = slider("c10pq", L2("Charge q", "চার্জ q"), -5, 5, 1, 5, "µC") + slider("c10pr", L2("Distance r", "দূরত্ব r"), 0.05, 1, 0.05, 0.1, "m") + `<div class="svgwrap fit" id="c10psv"></div><div class="w-out" id="c10po"></div>`;
  const go = () => {
    const q = sv(el, "c10pq", "µC"), r = sv(el, "c10pr", "m", 2);
    const V = K10 * q * 1e-6 / r, E = K10 * Math.abs(q) * 1e-6 / (r * r);
    const X = x => 50 + (x - 0.05) / 0.95 * 295, Vmax = 9e5, Y = v => 120 - v / Vmax * 100;
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("potential against distance","দূরত্বের সাথে বিভব")}"><line x1="50" y1="120" x2="350" y2="120" stroke="var(--muted)"/><line x1="50" y1="14" x2="50" y2="226" stroke="var(--muted)"/>`;
    g += `<text x="46" y="24" font-size="13.5" text-anchor="end" fill="var(--muted)">+${B10("9")}</text><text x="46" y="226" font-size="13.5" text-anchor="end" fill="var(--muted)">−${B10("9")}</text><text x="46" y="124" font-size="13.5" text-anchor="end" fill="var(--muted)">${B10(0)}</text><text x="56" y="14" font-size="13.5" fill="var(--muted)">V (× ${B10("10")}⁵ V)</text>`;
    [0.05, 0.5, 1].forEach(v => g += `<text x="${X(v)}" y="136" font-size="13.5" text-anchor="middle" fill="var(--muted)">${B10(v)}</text>`); g += `<text x="350" y="150" font-size="13.5" text-anchor="end" fill="var(--muted)">r (m)</text>`;
    if (q !== 0) { let pts = ""; for (let x = 0.05; x <= 1.0001; x += 0.005) pts += `${X(x).toFixed(1)},${Y(K10 * q * 1e-6 / x).toFixed(1)} `; g += `<polyline points="${pts}" fill="none" stroke="${q>0?POS10:NEG10}" stroke-width="2.5"/>`; }
    g += `<line x1="${X(r)}" y1="120" x2="${X(r)}" y2="${Y(V)}" stroke="var(--note)" stroke-dasharray="3 3"/><circle cx="${X(r)}" cy="${Y(V)}" r="6" fill="var(--note)"/>`;
    g += `<text x="345" y="${q>=0?200:50}" font-size="14" text-anchor="end" fill="var(--ink)">${q>0?L2("a potential “hill”","বিভবের “পাহাড়”"):q<0?L2("a potential “well”","বিভবের “গর্ত”"):L2("no charge: V = 0 everywhere","চার্জ নেই: সর্বত্র V = ০")}</text></svg>`;
    $("#c10psv", el).innerHTML = g;
    const W1 = 1e-6 * V;
    $("#c10po", el).innerHTML = L2(`V = kq/r = 9 × 10⁹ × ${q} × 10⁻⁶ ÷ ${r.toFixed(2)} = <b>${sci10(V)} V</b><br>Work to bring +1 µC here from infinity: W = qV = <b>${sci10(W1)} J</b>${W1<0?" (negative: it is pulled in)":""}<br><span class="muted">Compare: field E = kq/r² = ${sci10(E)} N/C. Halve r and V doubles, but E becomes 4 times.</span>`,
      `V = kq/r = ৯ × ১০⁹ × ${B10(q)} × ১০⁻⁶ ÷ ${B10(r.toFixed(2))} = <b>${sci10(V)} V</b><br>অসীম থেকে এখানে +১ µC আনতে কাজ: W = qV = <b>${sci10(W1)} J</b>${W1<0?" (ঋণাত্মক: চার্জটি ভেতরে টেনে নেওয়া হয়)":""}<br><span class="muted">তুলনা করো: ক্ষেত্র E = kq/r² = ${sci10(E)} N/C। r অর্ধেক করলে V দ্বিগুণ হয়, কিন্তু E হয় ৪ গুণ।</span>`);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 10.7 parallel-plate capacitor: Q = CV, U = ½CV² */
W.c10cap = (el) => {
  el.innerHTML = slider("c10cc", L2("Capacitance C", "ধারকত্ব C"), 5, 100, 5, 50, "µF") + slider("c10cv", L2("Voltage V", "ভোল্টেজ V"), 0, 24, 1, 12, "V") + `<div class="svgwrap fit" id="c10ksv"></div><div class="w-out" id="c10ko"></div>`;
  const go = () => {
    const C = sv(el, "c10cc", "µF"), V = sv(el, "c10cv", "V"); const Q = C * 1e-6 * V, U = 0.5 * C * 1e-6 * V * V;
    const n = Math.round(Q / 1e-4); /* one sign = 100 µC */ const lines = Math.round(V / 24 * 7);
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("capacitor","ধারক")}">`;
    const xl = 140, xr = 220, yt = 30, yb = 150;
    for (let i = 0; i < lines; i++) { const y = yt + 10 + (i + 0.5) * (yb - yt - 20) / lines; g += `<line x1="${xl+8}" y1="${y}" x2="${xr-12}" y2="${y}" stroke="var(--note)" stroke-width="1.3"/><path d="M${xr-16} ${y-4} L${xr-8} ${y} L${xr-16} ${y+4} z" fill="var(--note)"/>`; }
    g += `<rect x="${xl-6}" y="${yt}" width="8" height="${yb-yt}" fill="var(--ink)"/><rect x="${xr-2}" y="${yt}" width="8" height="${yb-yt}" fill="var(--ink)"/>`;
    for (let i = 0; i < n; i++) { const y = yt + 6 + (i % 12) * 10, c = Math.floor(i / 12) * 12; g += sgn10(xl - 16 - c, y, 1, 5) + sgn10(xr + 14 + c, y, -1, 5); }
    g += sgn10(18, 191, 1, 5) + `<text x="28" y="196" font-size="14" fill="var(--muted)">= ${B10(100)} µC</text>`;
    /* wires and battery */
    g += `<path d="M${xl-2} ${yb} V180 H160 M200 180 H${xr+2} V${yb}" fill="none" stroke="var(--muted)" stroke-width="2"/><line x1="172" y1="168" x2="172" y2="192" stroke="var(--ink)" stroke-width="2"/><line x1="186" y1="173" x2="186" y2="187" stroke="var(--ink)" stroke-width="4"/><path d="M160 180 H172 M186 180 H200" stroke="var(--muted)" stroke-width="2"/><text x="166" y="164" font-size="13.5" fill="var(--ink)">+</text><text x="190" y="164" font-size="13.5" fill="var(--ink)">−</text>`;
    g += `<text x="${xl-22}" y="20" font-size="14" text-anchor="middle" fill="${POS10}">+Q</text><text x="${xr+20}" y="20" font-size="14" text-anchor="middle" fill="${NEG10}">−Q</text><text x="180" y="20" font-size="14" text-anchor="middle" fill="var(--note)">E</text>`;
    const bw = Math.min(1, U / (0.5 * 100e-6 * 576)) * 70;
    g += `<text x="290" y="60" font-size="14" fill="var(--muted)">${L2("energy","শক্তি")}</text><rect x="300" y="70" width="24" height="70" fill="none" stroke="var(--muted)"/><rect x="300" y="${140-bw}" width="24" height="${bw}" fill="var(--note)"/></svg>`;
    $("#c10ksv", el).innerHTML = g;
    $("#c10ko", el).innerHTML = L2(`Q = CV = ${C} × 10⁻⁶ × ${V} = <b>${sci10(Q)} C</b><br>U = ½CV² = ½ × ${C} × 10⁻⁶ × ${V}² = <b>${sci10(U)} J</b><br><span class="muted">Double V: Q doubles but U becomes 4 times.</span>`,
      `Q = CV = ${B10(C)} × ১০⁻⁶ × ${B10(V)} = <b>${sci10(Q)} C</b><br>U = ½CV² = ½ × ${B10(C)} × ১০⁻⁶ × ${B10(V)}² = <b>${sci10(U)} J</b><br><span class="muted">V দ্বিগুণ করো: Q দ্বিগুণ হয়, কিন্তু U হয় ৪ গুণ।</span>`);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 10.8 thunderstorm with / without a lightning arrester, and flash-to-thunder distance */
W.c10light = (el) => {
  let arr = 1, step = 0;
  el.innerHTML = `<div class="chipset c10l" role="group"><button data-a="1" aria-pressed="true">${L2("With lightning arrester","বজ্রনিরোধকসহ")}</button><button data-a="0" aria-pressed="false">${L2("Without arrester","বজ্রনিরোধক ছাড়া")}</button></div><div class="svgwrap fit" id="c10lsv"></div>
  <div class="w-row" style="gap:6px"><button class="btn" id="c10lb">${L2("◀ Back","◀ আগে")}</button><button class="btn solid" id="c10ln">${L2("Next ▶","পরে ▶")}</button></div><div class="w-out" id="c10lo"></div>
  <p class="hint" style="margin-top:14px">${L2("How far away? Count the seconds from flash to thunder.","কত দূরে? ঝলক থেকে শব্দ পর্যন্ত সেকেন্ড গোনো।")}</p>${slider("c10lt", L2("Time from flash to thunder", "ঝলক থেকে শব্দ পর্যন্ত সময়"), 0, 15, 0.5, 6, "s")}<div class="w-out" id="c10lto"></div>`;
  const TXT = {
    0: L2("Rising water vapour rubs and separates charge: electrons gather at the cloud base (−), the top is left +.", "ওপরে ওঠা জলীয় বাষ্পের ঘর্ষণে চার্জ আলাদা হয়: ইলেকট্রন জমে মেঘের তলায় (−), ওপরের অংশ থাকে +।"),
    1: L2("Induction: the negative cloud base induces + charge on the ground and on tall objects below it.", "আবেশ: মেঘের ঋণাত্মক তলা নিচের মাটি আর উঁচু বস্তুতে + চার্জ আবিষ্ট করে।"),
    "2_1": L2("Point discharge: + charge crowds at the sharp tips, the strong field ionises the air, and ions drift up to neutralise part of the cloud's charge.", "সুচালো প্রান্তের ক্ষরণ: সুচালো মাথায় + চার্জ ঘন হয়, প্রবল ক্ষেত্র বাতাস আয়নিত করে, আয়ন ওপরে উঠে মেঘের চার্জের কিছুটা প্রশমিত করে।"),
    "2_0": L2("No escape path: charge keeps building up on the cloud and on the roof until the air breaks down.", "বের হওয়ার পথ নেই: মেঘে আর ছাদে চার্জ জমতেই থাকে, যতক্ষণ না বাতাস ভেদ হয়ে যায়।"),
    "3_1": L2("If lightning strikes, the rod catches it and the thick wire carries the charge safely into the earth plate. The building is safe.", "বজ্রপাত হলে দণ্ড তা ধরে নেয়, মোটা তার চার্জকে নিরাপদে মাটির পাতে পৌঁছে দেয়। ভবন নিরাপদ।"),
    "3_0": L2("The strike tears through the building to reach the ground: fire, cracked walls and danger to people inside.", "বজ্রপাত ভবন চিরে মাটিতে যায়: আগুন, ফাটা দেয়াল আর ভেতরের মানুষের বিপদ।") };
  const draw = () => {
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("thunderstorm","বজ্রঝড়")}">`;
    const cloudQ = step >= 2 && arr ? 3 : 5;
    g += `<path d="M40 70 Q30 40 70 36 Q90 8 130 22 Q160 2 200 20 Q240 6 262 34 Q310 36 300 70 Z" fill="var(--rule)" stroke="var(--muted)"/>`;
    for (let i = 0; i < 5; i++) g += sgn10(90 + i * 40, 36, 1, 6);
    for (let i = 0; i < cloudQ; i++) g += sgn10(70 + i * (200 / Math.max(cloudQ - 1, 1)), 60, -1, 6);
    g += `<line x1="0" y1="205" x2="360" y2="205" stroke="var(--muted)" stroke-width="2"/><rect x="0" y="205" width="360" height="45" fill="var(--c-soft)" opacity=".4"/>`;
    const bx = 190, bw = 60, btop = 140;
    g += `<rect x="${bx}" y="${btop}" width="${bw}" height="${205-btop}" fill="var(--paper)" stroke="var(--ink)"/>`;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) g += `<rect x="${bx+10+c*24}" y="${btop+12+r*26}" width="14" height="14" fill="var(--c-soft)" stroke="var(--muted)"/>`;
    const tip = btop - 26;
    if (arr) { g += `<line x1="${bx+bw/2}" y1="${btop}" x2="${bx+bw/2}" y2="${tip}" stroke="var(--note)" stroke-width="3"/><path d="M${bx+bw/2-4} ${tip+4} L${bx+bw/2} ${tip-6} L${bx+bw/2+4} ${tip+4}" fill="var(--note)"/>`;
      g += `<path d="M${bx+bw/2} ${btop} H${bx+bw+8} V228 H${bx+bw+30}" fill="none" stroke="var(--note)" stroke-width="${step===3?5:3}"/><rect x="${bx+bw+22}" y="224" width="30" height="8" fill="var(--note)"/><text x="${bx+bw+38}" y="246" font-size="13.5" text-anchor="middle" fill="var(--muted)">${L2("earth plate","মাটির পাত")}</text>`; }
    if (step >= 1) { for (let i = 0; i < 6; i++) g += sgn10(20 + i * 28, 214, 1, 5); g += sgn10(bx + 12, btop - 8, 1, 5) + sgn10(bx + bw - 12, btop - 8, 1, 5); if (arr) g += sgn10(bx + bw / 2 + 12, tip, 1, 5); }
    if (step === 2 && arr) for (let i = 0; i < 5; i++) g += `<circle cx="${bx+bw/2+(i%2?8:-8)}" cy="${tip-12-i*10}" r="3" fill="${POS10}" opacity="${1-i*0.15}"/>`;
    if (step === 3) { const x0 = 150, tx = bx + bw / 2, ty = arr ? tip - 6 : btop;
      g += `<path d="M${tx-34} 70 L${tx-12} ${(70+ty)/2-6} L${tx-24} ${(70+ty)/2+2} L${tx} ${ty}" fill="none" stroke="var(--note)" stroke-width="4" stroke-linejoin="round"/>`;
      if (!arr) g += `<path d="M${tx} ${btop} L${tx-10} ${btop+30} L${tx+8} ${btop+55} L${tx-6} 205" fill="none" stroke="var(--bad)" stroke-width="3"/><text x="${bx-8}" y="${btop+40}" font-size="15" text-anchor="end" font-weight="700" fill="var(--bad)">${L2("danger!","বিপদ!")}</text>`;
      else g += `<text x="${bx-8}" y="${btop+40}" font-size="15" text-anchor="end" font-weight="700" fill="var(--good)">${L2("safe","নিরাপদ")}</text>`; }
    g += `<text x="352" y="100" font-size="14" text-anchor="end" fill="var(--muted)">${L2("step","ধাপ")} ${B10(step+1)}/${B10(4)}</text></svg>`;
    $("#c10lsv", el).innerHTML = g;
    $("#c10lo", el).innerHTML = TXT[step] || TXT[step + "_" + arr];
    $("#c10lb", el).disabled = step === 0; $("#c10ln", el).disabled = step === 3;
  };
  const dist = () => { const t = sv(el, "c10lt", "s", 1); const d = 330 * t;
    $("#c10lto", el).innerHTML = L2(`distance ≈ 330 × ${t} = <b>${Math.round(d)} m ≈ ${(d/1000).toFixed(1)} km</b>${t<=3?" · very close: take shelter now!":""}`, `দূরত্ব ≈ ৩৩০ × ${B10(t)} = <b>${B10(Math.round(d))} m ≈ ${B10((d/1000).toFixed(1))} km</b>${t<=3?" · খুব কাছে: এখনই আশ্রয় নাও!":""}`); };
  chips10(el, ".c10l", b => { arr = +b.dataset.a; draw(); });
  $("#c10lb", el).addEventListener("click", () => { if (step > 0) step--; draw(); });
  $("#c10ln", el).addEventListener("click", () => { if (step < 3) step++; draw(); });
  $("#c10lt", el).addEventListener("input", dist);
  draw(); dist();
};
