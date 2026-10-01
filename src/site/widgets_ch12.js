/* ---- chapter 12 widgets: magnetic effects of current ---- */
const B12 = x => bnNum(x, LANG);
const chips12 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const NCOL12 = "var(--bad)", SCOL12 = "var(--c)";
/* number with space grouping, up to 3 significant figures for small values */
const f12 = (x, d) => { if (d === undefined) d = Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2; let s = (+x.toFixed(d)).toString(); const [a, b] = s.split("."); const g = a.replace(/\B(?=(\d{3})+(?!\d))/g, " "); return B12(b ? g + "." + b : g); };
/* a compass needle centred at x,y pointing at angle a (radians, screen coords) */
const needle12 = (x, y, a, L, op = 1) => { const c = Math.cos(a), s = Math.sin(a); const w = L * 0.28, px = -s * w, py = c * w;
  return `<g opacity="${op.toFixed(2)}"><path d="M${(x + c * L).toFixed(1)} ${(y + s * L).toFixed(1)}L${(x + px).toFixed(1)} ${(y + py).toFixed(1)}L${(x - px).toFixed(1)} ${(y - py).toFixed(1)}Z" fill="${NCOL12}"/><path d="M${(x - c * L).toFixed(1)} ${(y - s * L).toFixed(1)}L${(x + px).toFixed(1)} ${(y + py).toFixed(1)}L${(x - px).toFixed(1)} ${(y - py).toFixed(1)}Z" fill="var(--muted)"/></g>`; };
/* bar magnet: x1..x2, centre y, nRight = true if N is on the right */
const bar12 = (x1, x2, y, nRight, h = 26) => { const m = (x1 + x2) / 2; const L = nRight ? SCOL12 : NCOL12, R = nRight ? NCOL12 : SCOL12;
  return `<rect x="${x1}" y="${y - h / 2}" width="${m - x1}" height="${h}" fill="${L}"/><rect x="${m}" y="${y - h / 2}" width="${x2 - m}" height="${h}" fill="${R}"/><rect x="${x1}" y="${y - h / 2}" width="${x2 - x1}" height="${h}" fill="none" stroke="var(--ink)" stroke-width="1"/><text x="${x1 + 12}" y="${y + 5}" font-size="15" font-weight="700" fill="var(--sheet)" text-anchor="middle">${nRight ? "S" : "N"}</text><text x="${x2 - 12}" y="${y + 5}" font-size="15" font-weight="700" fill="var(--sheet)" text-anchor="middle">${nRight ? "N" : "S"}</text>`; };
const svgPt12 = (svg, ev) => { const r = svg.getBoundingClientRect(); const vb = svg.viewBox.baseVal; return [(ev.clientX - r.left) / r.width * vb.width, (ev.clientY - r.top) / r.height * vb.height]; };

/* 12.1 magnet field map: one magnet / attract / repel, needle grid + tap-to-place compass */
W.c12mag = (el) => {
  let mode = "one", probe = [200, 40];
  el.innerHTML = `<div class="chipset c12mm" role="group"><button data-m="one" aria-pressed="true">${L2("One magnet","একটি চুম্বক")}</button><button data-m="att" aria-pressed="false">${L2("N facing S","N-এর মুখোমুখি S")}</button><button data-m="rep" aria-pressed="false">${L2("N facing N","N-এর মুখোমুখি N")}</button></div>
  <div class="svgwrap fit" id="c12msv" style="touch-action:none"></div><p class="hint">${L2("Tap anywhere on the picture to place the big compass there.","ছবির যেকোনো জায়গায় ছুঁয়ে বড় কম্পাসটি সেখানে রাখো।")}</p><div class="w-out" id="c12mo"></div>`;
  const poles = () => mode === "one" ? { bars: [[140, 260, true]], q: [[250, 1], [150, -1]] }
    : mode === "att" ? { bars: [[30, 150, true], [250, 370, true]], q: [[140, 1], [40, -1], [360, 1], [260, -1]] }
    : { bars: [[30, 150, true], [250, 370, false]], q: [[140, 1], [40, -1], [260, 1], [360, -1]] };
  const Y = 130;
  const field = (x, y, P) => { let bx = 0, by = 0; P.q.forEach(([px, s]) => { const dx = x - px, dy = y - Y, r2 = dx * dx + dy * dy + 30, r3 = r2 * Math.sqrt(r2); bx += s * dx / r3; by += s * dy / r3; }); return [bx, by]; };
  const inBar = (x, y, P) => P.bars.some(([a, b]) => x > a - 8 && x < b + 8 && Math.abs(y - Y) < 22);
  const draw = () => {
    const P = poles();
    let g = `<svg viewBox="0 0 400 260" role="img" aria-label="${L2("magnetic field map","চৌম্বক ক্ষেত্রের নকশা")}">`;
    for (let y = 14; y <= 250; y += 22) for (let x = 12; x <= 392; x += 22) {
      if (inBar(x, y, P)) continue;
      const [bx, by] = field(x, y, P); const m = Math.hypot(bx, by); const op = Math.max(0.18, Math.min(1, 0.35 + 0.22 * Math.log10(m * 1e6)));
      g += needle12(x, y, Math.atan2(by, bx), 7, op); }
    P.bars.forEach(([a, b, nr]) => g += bar12(a, b, Y, nr));
    const [bx, by] = field(probe[0], probe[1], P);
    g += `<circle cx="${probe[0]}" cy="${probe[1]}" r="19" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>${needle12(probe[0], probe[1], Math.atan2(by, bx), 15)}`;
    if (mode !== "one") { const att = mode === "att"; g += `<defs>${arrowDefs("c12ma", att ? "var(--good)" : "var(--bad)").replace(/^<defs>|<\/defs>$/g, "")}</defs>`;
      g += att ? `<line x1="162" y1="${Y + 44}" x2="186" y2="${Y + 44}" stroke="var(--good)" stroke-width="3" marker-end="url(#c12ma)"/><line x1="238" y1="${Y + 44}" x2="214" y2="${Y + 44}" stroke="var(--good)" stroke-width="3" marker-end="url(#c12ma)"/>`
        : `<line x1="140" y1="${Y + 44}" x2="110" y2="${Y + 44}" stroke="var(--bad)" stroke-width="3" marker-end="url(#c12ma)"/><line x1="260" y1="${Y + 44}" x2="290" y2="${Y + 44}" stroke="var(--bad)" stroke-width="3" marker-end="url(#c12ma)"/>`; }
    g += `</svg>`;
    $("#c12msv", el).innerHTML = g;
    $("svg", $("#c12msv", el)).addEventListener("pointerdown", ev => { const p = svgPt12(ev.currentTarget, ev); if (!inBar(p[0], p[1], poles())) { probe = p; draw(); } });
    $("#c12mo", el).innerHTML = mode === "one" ? L2("Outside the magnet the needles point from <b>N to S</b>. They are darkest near the poles, where the field is strongest.", "চুম্বকের বাইরে কাঁটাগুলো <b>N থেকে S</b>-এর দিকে। মেরুর কাছে কাঁটা সবচেয়ে গাঢ়, সেখানে ক্ষেত্র সবচেয়ে শক্তিশালী।")
      : mode === "att" ? L2("<b>Unlike poles attract.</b> The field lines run straight across the gap from N to S, as if pulling the magnets together.", "<b>বিপরীত মেরু আকর্ষণ করে।</b> বলরেখা ফাঁকের ওপর দিয়ে সোজা N থেকে S-এ যায়, যেন চুম্বক দুটিকে টেনে কাছে আনছে।")
      : L2("<b>Like poles repel.</b> The lines from the two N poles push against each other and turn away. In the middle there is a point where the field is almost zero.", "<b>সমমেরু বিকর্ষণ করে।</b> দুই N মেরুর বলরেখা পরস্পরকে ঠেলে বেঁকে সরে যায়। মাঝখানে একটি বিন্দুতে ক্ষেত্র প্রায় শূন্য।");
  };
  chips12(el, ".c12mm", b => { mode = b.dataset.m; draw(); });
  draw();
};

/* 12.2 compasses around a straight wire (top view) */
W.c12wire = (el) => {
  let dir = 0; const ang = []; let target = [];
  el.innerHTML = `<div class="chipset c12wd" role="group"><button data-d="0" aria-pressed="true">${L2("No current","প্রবাহ নেই")}</button><button data-d="1" aria-pressed="false">${L2("Out of page ⊙","কাগজ থেকে বাইরে ⊙")}</button><button data-d="-1" aria-pressed="false">${L2("Into page ⊗","কাগজের ভেতরে ⊗")}</button></div>
  ${slider("c12wi", L2("Current I", "প্রবাহ I"), 1, 10, 1, 6, "A")}<div class="svgwrap fit" id="c12wsv"></div><div class="w-out" id="c12wo"></div>`;
  const CX = 180, CY = 150, pts = [];
  [[78, 8], [128, 12]].forEach(([r, n]) => { for (let i = 0; i < n; i++) { const t = 2 * Math.PI * i / n + (n === 12 ? 0.26 : 0); pts.push([CX + r * Math.cos(t), CY + r * Math.sin(t)]); } });
  pts.forEach(() => ang.push(-Math.PI / 2));
  const calc = () => { const I = sv(el, "c12wi", "A");
    target = pts.map(([x, y]) => { const dx = x - CX, dy = y - CY, r2 = dx * dx + dy * dy; const k = 42 * I * dir / r2 * Math.sqrt(r2) / Math.sqrt(r2); /* B ∝ I/r */
      const bx = 0 + k * dy * Math.sqrt(r2) / Math.sqrt(r2) / Math.sqrt(r2) * 1, by = -1 - k * dx / Math.sqrt(r2); return Math.atan2(by, bx); });
    $("#c12wo", el).innerHTML = dir === 0 ? L2("No current: every compass points <b>north</b> (Earth's field).", "প্রবাহ নেই: প্রতিটি কম্পাস <b>উত্তর</b> দিকে (পৃথিবীর ক্ষেত্র)।")
      : L2(`Current ${dir > 0 ? "out of the page" : "into the page"}: the needles line up in <b>${dir > 0 ? "anticlockwise" : "clockwise"}</b> circles. Right-hand rule: thumb ${dir > 0 ? "towards you" : "into the page"}, fingers curl ${dir > 0 ? "anticlockwise" : "clockwise"}. ${I <= 3 ? "With a small current the outer needles still lean towards north: the wire's field is weak far away." : "Near the wire the circle is almost perfect; further out the Earth's field still pulls a little."}`,
        `প্রবাহ ${dir > 0 ? "কাগজ থেকে বাইরে" : "কাগজের ভেতরে"}: কাঁটাগুলো <b>${dir > 0 ? "ঘড়ির কাঁটার বিপরীত দিকে" : "ঘড়ির কাঁটার দিকে"}</b> বৃত্তে সাজে। ডান হাতের নিয়ম: বুড়ো আঙুল ${dir > 0 ? "তোমার দিকে" : "কাগজের ভেতরে"}, আঙুল মোড়ে ${dir > 0 ? "ঘড়ির কাঁটার বিপরীতে" : "ঘড়ির কাঁটার দিকে"}। ${I <= 3 ? "প্রবাহ কম বলে বাইরের কাঁটাগুলো এখনো উত্তরের দিকে হেলে আছে: দূরে তারের ক্ষেত্র দুর্বল।" : "তারের কাছে বৃত্ত প্রায় নিখুঁত; আরও দূরে পৃথিবীর ক্ষেত্র এখনো একটু টানে।"}`);
  };
  const draw = () => {
    let g = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("compasses around a wire","তারের চারপাশে কম্পাস")}"><rect x="20" y="10" width="320" height="280" rx="6" fill="var(--c-soft)" stroke="var(--rule)"/>`;
    g += `<g transform="translate(318,40)"><line x1="0" y1="18" x2="0" y2="-14" stroke="var(--muted)" stroke-width="2"/><path d="M-5 -8L0 -18L5 -8Z" fill="var(--muted)"/><text x="0" y="-22" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("N","উ")}</text></g>`;
    if (dir !== 0) { [55, 100, 145].forEach(r => { g += `<circle cx="${CX}" cy="${CY}" r="${r}" fill="none" stroke="var(--c)" stroke-width="1" stroke-dasharray="3 5" opacity="0.7"/>`;
      /* small arrowhead at the left of each circle showing direction */ const x = CX - r, y = CY, s = dir > 0 ? 1 : -1; g += `<path d="M${x - 5} ${y - 6 * s}L${x} ${y + 3 * s}L${x + 5} ${y - 6 * s}" fill="none" stroke="var(--c)" stroke-width="2"/>`; }); }
    pts.forEach(([x, y], i) => { g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="var(--paper)" stroke="var(--ink)" stroke-width="1"/>${needle12(x, y, ang[i], 11)}`; });
    g += `<circle cx="${CX}" cy="${CY}" r="12" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>`;
    if (dir > 0) g += `<circle cx="${CX}" cy="${CY}" r="3.5" fill="var(--ink)"/>`;
    if (dir < 0) g += `<path d="M${CX - 7} ${CY - 7}L${CX + 7} ${CY + 7}M${CX + 7} ${CY - 7}L${CX - 7} ${CY + 7}" stroke="var(--ink)" stroke-width="2.5"/>`;
    g += `<text x="${CX}" y="${CY + 30}" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("wire","তার")}</text></svg>`;
    $("#c12wsv", el).innerHTML = g;
  };
  const settle = () => { let moved = false; ang.forEach((a, i) => { let d = target[i] - a; d = Math.atan2(Math.sin(d), Math.cos(d)); if (Math.abs(d) > 0.002) { ang[i] = a + d * (REDUCED ? 1 : 0.18); moved = true; } }); return moved; };
  const update = () => { calc(); if (REDUCED) { settle(); draw(); } };
  chips12(el, ".c12wd", b => { dir = +b.dataset.d; update(); });
  $("#c12wi", el).addEventListener("input", update);
  calc(); settle(); draw();
  if (!REDUCED) animate(el, () => { if (settle()) draw(); });
};

/* 12.2.1 solenoid / electromagnet */
W.c12sol = (el) => {
  let dir = 1, core = false;
  el.innerHTML = slider("c12sn", L2("Turns (shown)", "পাকসংখ্যা (দেখানো)"), 4, 16, 1, 10, "") + slider("c12si", L2("Current I", "প্রবাহ I"), 0, 5, 0.5, 3, "A") +
    `<div class="w-row" style="flex-wrap:wrap;gap:8px"><div class="chipset c12sd" role="group"><button data-d="1" aria-pressed="true">${L2("Current one way","প্রবাহ এক দিকে")}</button><button data-d="-1" aria-pressed="false">${L2("Reversed","উল্টো দিকে")}</button></div><div class="chipset c12sc" role="group"><button data-c="0" aria-pressed="true">${L2("No core","মজ্জা নেই")}</button><button data-c="1" aria-pressed="false">${L2("Soft iron core","কাঁচা লোহার মজ্জা")}</button></div></div>
    <div class="svgwrap fit" id="c12ssv"></div><div class="w-out" id="c12so"></div>`;
  const go = () => {
    const n = sv(el, "c12sn", ""), I = sv(el, "c12si", "A", 1);
    const x1 = 110, x2 = 290, cy = 105, ry = 34, rx = 7, step = (x2 - x1) / n;
    const S = n * I * (core ? 1 : 0.12); /* relative strength */
    const clips = Math.min(10, Math.floor(S / 7));
    const nRight = dir > 0; /* front current downward → N on the right */
    const lw = I === 0 ? 0 : Math.min(2.4, 0.6 + S / 40), lop = I === 0 ? 0 : Math.min(0.95, 0.25 + S / 70);
    let g = `<svg viewBox="0 0 400 250" role="img" aria-label="${L2("solenoid","সলিনয়েড")}">${arrowDefs("c12sa", "var(--c)")}${arrowDefs("c12sb", "var(--bad)")}`;
    /* field lines (behind) */
    if (I > 0) { const ah = nRight ? 1 : -1; const sp = 1 + Math.min(2, S / 30);
      [0, 1, 2].forEach(k => { const hgt = 26 + k * 24 * (1.25 - 0.1 * sp); const top = cy - ry - hgt, bot = cy + ry + hgt;
        const pU = `M${x2 + 4} ${cy - 8 - k * 7}C${x2 + 60 + k * 18} ${top} ${x1 - 60 - k * 18} ${top} ${x1 - 4} ${cy - 8 - k * 7}`;
        const pD = `M${x2 + 4} ${cy + 8 + k * 7}C${x2 + 60 + k * 18} ${bot} ${x1 - 60 - k * 18} ${bot} ${x1 - 4} ${cy + 8 + k * 7}`;
        g += `<path d="${pU}" fill="none" stroke="var(--c)" stroke-width="${lw}" opacity="${lop}"/><path d="${pD}" fill="none" stroke="var(--c)" stroke-width="${lw}" opacity="${lop}"/>`; });
      /* arrows on the outside lines (N → S outside) and inside (S → N) */
      const ax = 200, ayT = cy - ry - 26 - 4, ayB = cy + ry + 26 + 4;
      g += `<line x1="${ax + 12 * ah}" y1="${ayT - 10}" x2="${ax - 12 * ah}" y2="${ayT - 10}" stroke="var(--c)" stroke-width="2" marker-end="url(#c12sa)" opacity="${lop}"/><line x1="${ax + 12 * ah}" y1="${ayB + 10}" x2="${ax - 12 * ah}" y2="${ayB + 10}" stroke="var(--c)" stroke-width="2" marker-end="url(#c12sa)" opacity="${lop}"/>`;
      [-14, 0, 14].forEach(dy => g += `<line x1="${x1 - 30}" y1="${cy + dy}" x2="${x2 + 30}" y2="${cy + dy}" stroke="var(--c)" stroke-width="${lw}" opacity="${lop}" ${dy === 0 ? `marker-end="url(#c12sa)"` : ""} ${nRight ? "" : `transform="rotate(180 200 ${cy})"`}/>`); }
    if (core) g += `<rect x="${x1 - 22}" y="${cy - 20}" width="${x2 - x1 + 44}" height="40" rx="4" fill="var(--muted)" opacity="0.55"/>`;
    /* back halves of turns */
    for (let i = 0; i < n; i++) { const x = x1 + step * (i + 0.5); g += `<path d="M${x} ${cy - ry}A${rx} ${ry} 0 0 0 ${x} ${cy + ry}" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="3 3"/>`; }
    /* front halves */
    for (let i = 0; i < n; i++) { const x = x1 + step * (i + 0.5); g += `<path d="M${x} ${cy - ry}A${rx} ${ry} 0 0 1 ${x} ${cy + ry}" fill="none" stroke="var(--note)" stroke-width="3"/>`; }
    /* current arrows on a few front turns */
    if (I > 0) for (let i = 1; i < n; i += 3) { const x = x1 + step * (i + 0.5) + rx; const y0 = dir > 0 ? cy - 8 : cy + 8, y1 = dir > 0 ? cy + 8 : cy - 8; g += `<line x1="${x + 4}" y1="${y0}" x2="${x + 4}" y2="${y1}" stroke="var(--bad)" stroke-width="2" marker-end="url(#c12sb)"/>`; }
    /* poles */
    if (I > 0) { g += `<text x="${x1 - 34}" y="${cy - ry - 4}" font-size="18" font-weight="700" text-anchor="middle" fill="${nRight ? SCOL12 : NCOL12}">${nRight ? "S" : "N"}</text><text x="${x2 + 34}" y="${cy - ry - 4}" font-size="18" font-weight="700" text-anchor="middle" fill="${nRight ? NCOL12 : SCOL12}">${nRight ? "N" : "S"}</text>`; }
    /* battery leads */
    g += `<path d="M${x1 + step * 0.5} ${cy + ry}V222H175M${x2 - step * 0.5} ${cy + ry}V222H225" fill="none" stroke="var(--ink)" stroke-width="1.5"/><line x1="185" y1="210" x2="185" y2="234" stroke="var(--ink)" stroke-width="2.5"/><line x1="195" y1="215" x2="195" y2="229" stroke="var(--ink)" stroke-width="4"/><line x1="175" y1="222" x2="185" y2="222" stroke="var(--ink)" stroke-width="1.5"/><line x1="195" y1="222" x2="225" y2="222" stroke="var(--ink)" stroke-width="1.5"/>`;
    g += `<text x="${dir > 0 ? 180 : 200}" y="206" font-size="13" text-anchor="middle" fill="var(--muted)">+</text>`;
    /* paper clips hanging from the right end */
    const ex = x2 + 26; for (let i = 0; i < clips; i++) { const cx = ex + 10 + (i % 5) * 14, cyy = cy + ry + 16 + Math.floor(i / 5) * 26; g += `<rect x="${cx - 4}" y="${cyy - 10}" width="8" height="20" rx="4" fill="none" stroke="var(--muted)" stroke-width="1.6"/>`; }
    g += `</svg>`;
    $("#c12ssv", el).innerHTML = g;
    $("#c12so", el).innerHTML = I === 0 ? L2("No current, no magnetic field: the coil is not a magnet.", "প্রবাহ নেই, চৌম্বক ক্ষেত্রও নেই: কুণ্ডলী চুম্বক নয়।")
      : L2(`The <b>${nRight ? "right" : "left"}</b> end is <b>N</b>. Seen from that end, the current goes round anticlockwise. Relative strength ≈ <b>${f12(S, 0)}</b> (turns × current${core ? " × iron boost" : ""}); it holds <b>${clips}</b> paper clip${clips === 1 ? "" : "s"}.${core ? " Switch the current off and the iron loses almost all its magnetism." : " Put the iron core in to see a big jump."}`,
        `<b>${nRight ? "ডান" : "বাম"}</b> প্রান্ত <b>N</b>। ঐ প্রান্ত থেকে দেখলে প্রবাহ ঘড়ির কাঁটার বিপরীত দিকে ঘোরে। আপেক্ষিক শক্তি ≈ <b>${f12(S, 0)}</b> (পাক × প্রবাহ${core ? " × লোহার প্রভাব" : ""}); এটি <b>${B12(clips)}</b>টি কাগজের ক্লিপ ধরে রাখে।${core ? " প্রবাহ বন্ধ করলে লোহা প্রায় সব চৌম্বকত্ব হারায়।" : " বড় লাফ দেখতে লোহার মজ্জা ঢোকাও।"}`);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go));
  chips12(el, ".c12sd", b => { dir = +b.dataset.d; go(); });
  chips12(el, ".c12sc", b => { core = b.dataset.c === "1"; go(); });
  go();
};

/* 12.2.3 force on a wire (field-line crowding) + DC motor with/without commutator */
W.c12motor = (el) => {
  let mode = "wire", cur = 1, flip = 1; /* wire mode */
  let th = 0.35, om = 0, comm = true, run = false, flips = 0, lastI = 0; /* motor mode */
  el.innerHTML = `<div class="chipset c12om" role="group"><button data-m="wire" aria-pressed="true">${L2("Wire in a field","ক্ষেত্রে একটি তার")}</button><button data-m="motor" aria-pressed="false">${L2("DC motor","ডিসি মোটর")}</button></div><div id="c12octl"></div><div class="svgwrap fit" id="c12osv"></div><div class="w-out" id="c12oo"></div>`;
  const ctl = () => {
    $("#c12octl", el).innerHTML = mode === "wire"
      ? `<div class="w-row" style="flex-wrap:wrap;gap:8px"><div class="chipset c12oc" role="group"><button data-c="1" aria-pressed="${cur === 1}">${L2("Current ⊙","প্রবাহ ⊙")}</button><button data-c="-1" aria-pressed="${cur === -1}">${L2("Current ⊗","প্রবাহ ⊗")}</button><button data-c="0" aria-pressed="${cur === 0}">${L2("Off","বন্ধ")}</button></div><button class="btn" id="c12ofl">${L2("Flip the magnet","চুম্বক উল্টাও")}</button></div>`
      : `<div class="w-row" style="flex-wrap:wrap;gap:8px"><button class="btn solid" id="c12orun">${run ? L2("Pause","থামাও") : L2("Switch on","চালু করো")}</button><div class="chipset c12ocm" role="group"><button data-c="1" aria-pressed="${comm}">${L2("With commutator","কম্যুটেটরসহ")}</button><button data-c="0" aria-pressed="${!comm}">${L2("No commutator","কম্যুটেটর ছাড়া")}</button></div><button class="btn" id="c12ors">${L2("Reset","আবার শুরু")}</button></div>`;
    if (mode === "wire") { chips12(el, ".c12oc", b => { cur = +b.dataset.c; draw(); }); $("#c12ofl", el).addEventListener("click", () => { flip = -flip; draw(); }); }
    else { $("#c12orun", el).addEventListener("click", () => { run = !run; ctl(); draw(); });
      chips12(el, ".c12ocm", b => { comm = b.dataset.c === "1"; draw(); });
      $("#c12ors", el).addEventListener("click", () => { th = 0.35; om = 0; flips = 0; run = false; ctl(); draw(); }); }
  };
  const poles = (lN) => `<rect x="4" y="30" width="46" height="200" rx="4" fill="${lN ? NCOL12 : SCOL12}"/><text x="27" y="137" font-size="22" font-weight="700" text-anchor="middle" fill="var(--sheet)">${lN ? "N" : "S"}</text><rect x="350" y="30" width="46" height="200" rx="4" fill="${lN ? SCOL12 : NCOL12}"/><text x="373" y="137" font-size="22" font-weight="700" text-anchor="middle" fill="var(--sheet)">${lN ? "S" : "N"}</text>`;
  const sym = (x, y, s, r = 12) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>` + (s > 0 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="var(--ink)"/>` : s < 0 ? `<path d="M${(x - 6).toFixed(1)} ${(y - 6).toFixed(1)}l12 12m0 -12l-12 12" stroke="var(--ink)" stroke-width="2.3"/>` : "");
  const Imot = () => { const c = Math.cos(th); if (!comm) return 1; if (Math.abs(c) < 0.06) return 0; return c > 0 ? 1 : -1; };
  const drawWire = () => {
    const WX = 200, WY = 130, B0 = flip, c = 34 * cur; /* wire field strength so the neutral point is ~34 px away */
    let g = `<svg viewBox="0 0 400 260" role="img" aria-label="${L2("wire in a magnetic field","চৌম্বক ক্ষেত্রে তার")}">${arrowDefs("c12oa", "var(--bad)")}${arrowDefs("c12ob", "var(--c)")}${poles(flip > 0)}`;
    const F = (x, y) => { const dx = x - WX, dy = y - WY, r2 = dx * dx + dy * dy; return [B0 + c * dy / r2, -c * dx / r2]; };
    for (let y0 = 38; y0 <= 222; y0 += 13) {
      let x = flip > 0 ? 52 : 348, y = y0, p = `M${x} ${y}`, ok = true;
      for (let k = 0; k < 500; k++) { const [bx, by] = F(x, y); const m = Math.hypot(bx, by); if (m < 1e-3) { ok = false; break; } x += 2.2 * bx / m; y += 2.2 * by / m; if ((x - WX) ** 2 + (y - WY) ** 2 < 150) { ok = false; break; } if (k % 2 === 0) p += `L${x.toFixed(1)} ${y.toFixed(1)}`; if (x < 50 || x > 350 || y < 4 || y > 256) break; }
      if (ok) g += `<path d="${p}" fill="none" stroke="var(--c)" stroke-width="1.5" opacity="0.8"/>`; }
    g += `<line x1="${flip > 0 ? 70 : 330}" y1="16" x2="${flip > 0 ? 110 : 290}" y2="16" stroke="var(--c)" stroke-width="2" marker-end="url(#c12ob)"/><text x="200" y="20" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("field of the magnet","চুম্বকের ক্ষেত্র")}</text>`;
    g += sym(WX, WY, cur);
    const fy = -cur * flip; /* screen y direction of force */
    if (cur !== 0) g += `<line x1="${WX}" y1="${WY + fy * 16}" x2="${WX}" y2="${WY + fy * 70}" stroke="var(--bad)" stroke-width="4" marker-end="url(#c12oa)"/><text x="${WX + 12}" y="${WY + fy * 58}" font-size="15" font-weight="700" fill="var(--bad)">F</text>`;
    g += `</svg>`; $("#c12osv", el).innerHTML = g;
    $("#c12oo", el).innerHTML = cur === 0 ? L2("No current: the field lines run straight from N to S and the wire feels no force.", "প্রবাহ নেই: বলরেখা N থেকে S-এ সোজা চলে, তার কোনো বল পায় না।")
      : L2(`The lines are <b>crowded ${fy < 0 ? "below" : "above"}</b> the wire (the two fields add) and <b>thin ${fy < 0 ? "above" : "below"}</b> it (they oppose). The wire is pushed <b>${fy < 0 ? "up" : "down"}</b>, towards the thin side. Reverse the current or flip the magnet and the force reverses.`,
        `তারের <b>${fy < 0 ? "নিচে" : "ওপরে"} বলরেখা ঘন</b> (দুই ক্ষেত্র যোগ হয়) আর <b>${fy < 0 ? "ওপরে" : "নিচে"} পাতলা</b> (বিপরীতমুখী)। তার <b>${fy < 0 ? "ওপরে" : "নিচে"}</b> ঠেলা খায়, পাতলা দিকের দিকে। প্রবাহ বা চুম্বক উল্টালে বলও উল্টায়।`);
  };
  const drawMotor = () => {
    const CX = 200, CY = 120, R = 72, I = run ? Imot() : 0;
    const ax = CX + R * Math.cos(th), ay = CY + R * Math.sin(th), bx = CX - R * Math.cos(th), by = CY - R * Math.sin(th);
    let g = `<svg viewBox="0 0 400 260" role="img" aria-label="${L2("DC motor","ডিসি মোটর")}">${arrowDefs("c12oa", "var(--bad)")}${poles(true)}`;
    for (let y = 44; y <= 216; y += 24) g += `<line x1="52" y1="${y}" x2="348" y2="${y}" stroke="var(--c)" stroke-width="1" opacity="0.35"/>`;
    g += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="var(--rule)" stroke-dasharray="3 5"/><line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="var(--note)" stroke-width="6" stroke-linecap="round"/><circle cx="${CX}" cy="${CY}" r="5" fill="var(--ink)"/>`;
    g += sym(ax, ay, I, 11) + sym(bx, by, -I, 11);
    if (I !== 0) { g += `<line x1="${ax.toFixed(1)}" y1="${(ay - I * 14).toFixed(1)}" x2="${ax.toFixed(1)}" y2="${(ay - I * 46).toFixed(1)}" stroke="var(--bad)" stroke-width="3.5" marker-end="url(#c12oa)"/><line x1="${bx.toFixed(1)}" y1="${(by + I * 14).toFixed(1)}" x2="${bx.toFixed(1)}" y2="${(by + I * 46).toFixed(1)}" stroke="var(--bad)" stroke-width="3.5" marker-end="url(#c12oa)"/>`; }
    /* commutator inset */
    const kx = 300, ky = 232, kr = 14;
    if (comm) { const a0 = th + Math.PI / 2; const gap = 0.35; const arc = (s, e, col) => `<path d="M${(kx + kr * Math.cos(s)).toFixed(1)} ${(ky + kr * Math.sin(s)).toFixed(1)}A${kr} ${kr} 0 0 1 ${(kx + kr * Math.cos(e)).toFixed(1)} ${(ky + kr * Math.sin(e)).toFixed(1)}" fill="none" stroke="${col}" stroke-width="6"/>`;
      g += arc(a0 + gap / 2, a0 + Math.PI - gap / 2, "var(--note)") + arc(a0 + Math.PI + gap / 2, a0 + 2 * Math.PI - gap / 2, "var(--muted)"); }
    else g += `<circle cx="${kx}" cy="${ky}" r="${kr}" fill="none" stroke="var(--note)" stroke-width="3"/>`;
    g += `<rect x="${kx - kr - 12}" y="${ky - 5}" width="9" height="10" fill="var(--ink)"/><rect x="${kx + kr + 3}" y="${ky - 5}" width="9" height="10" fill="var(--ink)"/><text x="${kx - kr - 18}" y="${ky + 5}" font-size="14" text-anchor="end" fill="var(--bad)">+</text><text x="${kx + kr + 18}" y="${ky + 5}" font-size="14" fill="var(--muted)">−</text>`;
    g += `<text x="${kx - 42}" y="${ky + 5}" font-size="13" text-anchor="end" fill="var(--muted)">${comm ? L2("commutator", "কম্যুটেটর") : L2("fixed wires", "স্থির সংযোগ")}</text>`;
    g += `<text x="200" y="22" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("end view of the coil", "কুণ্ডলীর প্রান্ত থেকে দৃশ্য")}</text></svg>`;
    $("#c12osv", el).innerHTML = g;
    const rev = Math.abs(th) / (2 * Math.PI);
    $("#c12oo", el).innerHTML = !run ? L2("Press <b>Switch on</b>. The two sides of the coil carry opposite currents (⊙ and ⊗), so one is pushed up and the other down.", "<b>চালু করো</b> চাপো। কুণ্ডলীর দুই পাশে প্রবাহ বিপরীত (⊙ ও ⊗), তাই একটি ওপরে আর অন্যটি নিচে ঠেলা খায়।")
      : comm ? L2(`The commutator has reversed the coil current <b>${flips}</b> times (once every half turn), so the push always turns the coil the same way. Turns so far: <b>${f12(rev, 1)}</b>.`, `কম্যুটেটর এ পর্যন্ত <b>${B12(flips)}</b> বার কুণ্ডলীর প্রবাহ উল্টেছে (প্রতি অর্ধেক পাকে একবার), তাই ঠেলা সবসময় কুণ্ডলীকে একই দিকে ঘোরায়। মোট পাক: <b>${f12(rev, 1)}</b>।`)
      : L2("Without a commutator the current never reverses. Once the coil passes the vertical position, the forces pull it back: it rocks and <b>stops</b>.", "কম্যুটেটর ছাড়া প্রবাহ কখনো উল্টায় না। কুণ্ডলী খাড়া অবস্থান পার হলেই বল একে পেছনে টানে: এটি দুলে <b>থেমে যায়</b>।");
  };
  const draw = () => mode === "wire" ? drawWire() : drawMotor();
  const stepSim = dt => { const I = Imot(); if (I !== 0 && lastI !== 0 && I !== lastI) flips++; if (I !== 0) lastI = I; const tau = -9 * I * Math.cos(th); om += (tau - 1.6 * om) * dt; th += om * dt; };
  chips12(el, ".c12om", b => { mode = b.dataset.m; ctl(); draw(); });
  ctl(); draw();
  animate(el, dt => { if (mode === "motor" && run) { for (let i = 0; i < 4; i++) stepSim(dt / 4); draw(); } });
};

/* 12.3 electromagnetic induction: magnet and coil, or switched coil */
W.c12induce = (el) => {
  let mode = "mag", pol = 1, p = 0, pPrev = 0, target = null, speed = 1, needle = 0, emf = 0; /* magnet mode */
  let sw = false, I1 = 0; /* coil mode */
  el.innerHTML = `<div class="chipset c12im" role="group"><button data-m="mag" aria-pressed="true">${L2("Magnet and coil","চুম্বক ও কুণ্ডলী")}</button><button data-m="coil" aria-pressed="false">${L2("Two coils + switch","দুটি কুণ্ডলী + সুইচ")}</button></div><div id="c12ictl"></div><div class="svgwrap fit" id="c12isv"></div><div class="w-out" id="c12io"></div>`;
  const ctl = () => {
    $("#c12ictl", el).innerHTML = mode === "mag"
      ? `<div class="w-row" style="flex-wrap:wrap;gap:6px"><button class="btn solid" id="c12iin">${L2("Push in","ঢোকাও")}</button><button class="btn solid" id="c12iout">${L2("Pull out","বের করো")}</button><button class="btn" id="c12ist">${L2("Stop","থামাও")}</button><div class="chipset c12ip" role="group"><button data-p="1" aria-pressed="${pol > 0}">${L2("N faces coil","N কুণ্ডলীর দিকে")}</button><button data-p="-1" aria-pressed="${pol < 0}">${L2("S faces coil","S কুণ্ডলীর দিকে")}</button></div></div>${slider("c12isp", L2("Speed", "দ্রুতি"), 1, 3, 1, speed, "×")}<p class="hint">${L2("You can also drag the magnet with this slider:","এই স্লাইডার টেনেও চুম্বক নাড়াতে পারো:")}</p>${slider("c12ips", L2("Magnet position", "চুম্বকের অবস্থান"), 0, 100, 1, Math.round(p * 100), "%")}`
      : `<div class="w-row" style="gap:6px"><button class="btn solid" id="c12isw">${sw ? L2("Switch OFF","সুইচ অফ করো") : L2("Switch ON","সুইচ অন করো")}</button></div>`;
    if (mode === "mag") {
      $("#c12iin", el).addEventListener("click", () => { target = 1; });
      $("#c12iout", el).addEventListener("click", () => { target = 0; });
      $("#c12ist", el).addEventListener("click", () => { target = null; });
      chips12(el, ".c12ip", b => { pol = +b.dataset.p; draw(); });
      $("#c12isp", el).addEventListener("input", () => { speed = sv(el, "c12isp", "×"); }); sv(el, "c12isp", "×");
      $("#c12ips", el).addEventListener("input", () => { target = null; p = sv(el, "c12ips", "%") / 100; if (REDUCED) { emf = (p - pPrev) * 6 * dPhi(p); pPrev = p; needle = emf; draw(); } }); sv(el, "c12ips", "%");
    } else $("#c12isw", el).addEventListener("click", () => { sw = !sw; ctl(); if (REDUCED) { needle = sw ? 1 : -1; I1 = sw ? 1 : 0; draw(); } });
  };
  const Phi = q => 1 / (1 + Math.exp(-(q - 0.55) * 9));
  const dPhi = q => { const f = Phi(q); return 9 * f * (1 - f); };
  const coil = (x1, x2, cy, ry, n, col) => { let s = ""; const st = (x2 - x1) / n; for (let i = 0; i < n; i++) { const x = x1 + st * (i + 0.5); s += `<path d="M${x} ${cy - ry}A6 ${ry} 0 0 0 ${x} ${cy + ry}" fill="none" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="3 3"/>`; } for (let i = 0; i < n; i++) { const x = x1 + st * (i + 0.5); s += `<path d="M${x} ${cy - ry}A6 ${ry} 0 0 1 ${x} ${cy + ry}" fill="none" stroke="${col}" stroke-width="3"/>`; } return s; };
  const galv = (cx, cy, a) => { const A = Math.max(-1, Math.min(1, a)) * 1.05; let s = `<path d="M${cx - 46} ${cy}A46 46 0 0 1 ${cx + 46} ${cy}Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>`;
    for (let k = -4; k <= 4; k++) { const t = -Math.PI / 2 + k * 0.26; s += `<line x1="${cx + 38 * Math.cos(t)}" y1="${cy + 38 * Math.sin(t)}" x2="${cx + 44 * Math.cos(t)}" y2="${cy + 44 * Math.sin(t)}" stroke="var(--muted)" stroke-width="${k === 0 ? 2 : 1}"/>`; }
    const t = -Math.PI / 2 + A; s += `<line x1="${cx}" y1="${cy}" x2="${(cx + 40 * Math.cos(t)).toFixed(1)}" y2="${(cy + 40 * Math.sin(t)).toFixed(1)}" stroke="var(--bad)" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="4" fill="var(--ink)"/><text x="${cx}" y="${cy + 18}" font-size="13" text-anchor="middle" fill="var(--muted)">G</text>`; return s; };
  const draw = () => {
    let g = `<svg viewBox="0 0 400 250" role="img" aria-label="${L2("electromagnetic induction","তড়িৎ চুম্বকীয় আবেশ")}">`;
    if (mode === "mag") {
      const cx1 = 230, cx2 = 350, cy = 80;
      g += coil(cx1, cx2, cy, 34, 9, "var(--note)").replace(/<path[^>]*stroke-width="3"\/>/g, "");
      const mx2 = 115 + p * 205, mx1 = mx2 - 110; /* magnet right end */
      g += bar12(mx1, mx2, cy, pol > 0, 24);
      g += coil(cx1, cx2, cy, 34, 9, "var(--note)").replace(/<path[^>]*stroke-dasharray="3 3"\/>/g, "");
      g += `<path d="M${cx1 + 6} ${cy + 34}V205H${290 - 46}M${cx2 - 6} ${cy + 34}V205H${290 + 46}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
      g += galv(290, 205, needle);
    } else {
      g += coil(40, 160, 90, 34, 7, "var(--c)") + coil(240, 360, 90, 34, 7, "var(--note)");
      if (I1 > 0.02) [-12, 0, 12].forEach(dy => g += `<line x1="30" y1="${90 + dy}" x2="370" y2="${90 + dy}" stroke="var(--c)" stroke-width="1.6" opacity="${(0.8 * I1).toFixed(2)}"/>`);
      g += `<path d="M46 124V210H70M154 124V210H120" fill="none" stroke="var(--ink)" stroke-width="1.5"/><line x1="80" y1="198" x2="80" y2="222" stroke="var(--ink)" stroke-width="2.5"/><line x1="88" y1="203" x2="88" y2="217" stroke="var(--ink)" stroke-width="4"/><line x1="70" y1="210" x2="80" y2="210" stroke="var(--ink)" stroke-width="1.5"/><line x1="88" y1="210" x2="100" y2="210" stroke="var(--ink)" stroke-width="1.5"/>`;
      g += `<circle cx="100" cy="210" r="3" fill="var(--ink)"/><circle cx="120" cy="210" r="3" fill="var(--ink)"/><line x1="100" y1="210" x2="${sw ? 120 : 116}" y2="${sw ? 210 : 196}" stroke="var(--ink)" stroke-width="2"/>`;
      g += `<text x="100" y="40" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("coil 1", "কুণ্ডলী ১")}</text><text x="300" y="40" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("coil 2", "কুণ্ডলী ২")}</text>`;
      g += `<path d="M246 124V205H${300 - 46}M354 124V205H${300 + 46}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>` + galv(300, 205, needle);
    }
    g += `</svg>`; $("#c12isv", el).innerHTML = g;
    const n = needle;
    let t;
    if (mode === "mag") t = Math.abs(n) < 0.04 ? (p > 0.8 ? L2("The magnet is inside the coil but <b>not moving</b>: the field is steady, so there is <b>no current</b>.", "চুম্বক কুণ্ডলীর ভেতরে কিন্তু <b>নড়ছে না</b>: ক্ষেত্র স্থির, তাই <b>প্রবাহ নেই</b>।") : L2("Needle at zero. Move the magnet to change the field through the coil.", "কাঁটা শূন্যে। কুণ্ডলীর ভেতরের ক্ষেত্র বদলাতে চুম্বক নাড়াও।"))
      : L2(`The field through the coil is <b>${emf * pol > 0 ? "increasing" : "decreasing"}</b> → induced current; the needle swings <b>${n > 0 ? "right" : "left"}</b>. ${Math.abs(n) > 0.7 ? "Big kick: the change is fast." : "Move faster for a bigger kick."}`,
          `কুণ্ডলীর ভেতরের ক্ষেত্র <b>${emf * pol > 0 ? "বাড়ছে" : "কমছে"}</b> → আবিষ্ট প্রবাহ; কাঁটা <b>${n > 0 ? "ডানে" : "বামে"}</b> ঘোরে। ${Math.abs(n) > 0.7 ? "বড় ঝটকা: পরিবর্তন দ্রুত।" : "আরও বড় ঝটকার জন্য দ্রুত নাড়াও।"}`);
    else t = Math.abs(n) < 0.04 ? (sw ? L2("Switch is ON and the current in coil 1 is steady: the field is not changing, so the needle stays at <b>zero</b>.", "সুইচ অন, কুণ্ডলী ১-এর প্রবাহ স্থির: ক্ষেত্র বদলাচ্ছে না, তাই কাঁটা <b>শূন্যে</b>।") : L2("Switch is OFF. Turn it on and watch the needle of coil 2.", "সুইচ অফ। অন করে কুণ্ডলী ২-এর কাঁটা দেখো।"))
      : L2(`The field of coil 1 is ${n > 0 ? "<b>appearing</b>" : "<b>disappearing</b>"}, so a current is induced in coil 2 and the needle kicks <b>${n > 0 ? "right" : "left"}</b>. No wire joins the two coils!`, `কুণ্ডলী ১-এর ক্ষেত্র ${n > 0 ? "<b>তৈরি হচ্ছে</b>" : "<b>মিলিয়ে যাচ্ছে</b>"}, তাই কুণ্ডলী ২-এ প্রবাহ আবিষ্ট হয় আর কাঁটা <b>${n > 0 ? "ডানে" : "বামে"}</b> ঝটকা দেয়। দুই কুণ্ডলীর মাঝে কোনো তার নেই!`);
    $("#c12io", el).innerHTML = t;
  };
  chips12(el, ".c12im", b => { mode = b.dataset.m; needle = 0; emf = 0; ctl(); draw(); });
  ctl(); draw();
  if (!REDUCED) animate(el, dt => {
    if (dt <= 0) return; let changed = false;
    if (mode === "mag") {
      if (target !== null) { const v = 0.45 * speed * dt; const d = target - p; if (Math.abs(d) <= v) { p = target; target = null; } else p += Math.sign(d) * v; const s = $("#c12ips", el); if (s) { s.value = Math.round(p * 100); sv(el, "c12ips", "%"); } }
      const rate = (p - pPrev) / dt; pPrev = p;
      emf = rate * dPhi(p) * 0.55; const goal = pol * emf;
      const old = needle; needle += (goal - needle) * Math.min(1, dt * 14); if (Math.abs(needle) < 0.002) needle = 0; changed = Math.abs(old - needle) > 1e-4 || rate !== 0;
    } else {
      const old = I1; const goalI = sw ? 1 : 0; I1 += (goalI - I1) * Math.min(1, dt * 5); if (Math.abs(I1 - goalI) < 0.002) I1 = goalI;
      const e = (I1 - old) / dt * 0.9; const on = needle; needle += (e - needle) * Math.min(1, dt * 14); if (Math.abs(needle) < 0.002) needle = 0; changed = on !== needle || old !== I1;
    }
    if (changed) draw();
  });
};

/* 12.3.1 generator: rotating coil, AC (slip rings) or DC (commutator), live graph */
W.c12gen = (el) => {
  let dc = false, th = 0, run = !REDUCED; const hist = []; let tt = 0;
  el.innerHTML = `<div class="w-row" style="flex-wrap:wrap;gap:8px"><div class="chipset c12gm" role="group"><button data-d="0" aria-pressed="true">${L2("Slip rings (AC)","স্লিপ রিং (এসি)")}</button><button data-d="1" aria-pressed="false">${L2("Commutator (DC)","কম্যুটেটর (ডিসি)")}</button></div><button class="btn" id="c12grun">${run ? L2("Pause","থামাও") : L2("Play","চালাও")}</button></div>${slider("c12gs", L2("Rotations per second (slow motion)", "প্রতি সেকেন্ডে ঘূর্ণন (ধীর গতিতে)"), 0, 2, 0.25, 0.75, "")}<div class="svgwrap fit" id="c12gsv"></div><div class="w-out" id="c12go"></div>`;
  const rps = () => sv(el, "c12gs", "", 2);
  const volt = () => { const e = rps() * Math.cos(th); return dc ? Math.abs(e) : e; };
  const draw = () => {
    const CX = 110, CY = 90, R = 52, e = volt(), f = rps();
    let g = `<svg viewBox="0 0 400 300" role="img" aria-label="${L2("generator","জেনারেটর")}">`;
    g += `<rect x="18" y="30" width="26" height="120" rx="3" fill="${NCOL12}"/><text x="31" y="95" font-size="16" font-weight="700" text-anchor="middle" fill="var(--sheet)">N</text><rect x="176" y="30" width="26" height="120" rx="3" fill="${SCOL12}"/><text x="189" y="95" font-size="16" font-weight="700" text-anchor="middle" fill="var(--sheet)">S</text>`;
    for (let y = 44; y <= 136; y += 23) g += `<line x1="46" y1="${y}" x2="174" y2="${y}" stroke="var(--c)" stroke-width="1" opacity="0.35"/>`;
    const ax = CX + R * Math.cos(th), ay = CY + R * Math.sin(th);
    g += `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${(2 * CX - ax).toFixed(1)}" y2="${(2 * CY - ay).toFixed(1)}" stroke="var(--note)" stroke-width="6" stroke-linecap="round"/><circle cx="${CX}" cy="${CY}" r="4" fill="var(--ink)"/>`;
    /* bulb */
    const br = Math.min(1, Math.abs(e) / 1.6);
    g += `<circle cx="300" cy="70" r="${22 + 14 * br}" fill="var(--note)" opacity="${(0.15 + 0.35 * br).toFixed(2)}"/><circle cx="300" cy="70" r="20" fill="var(--note)" opacity="${(0.2 + 0.8 * br).toFixed(2)}" stroke="var(--ink)"/><rect x="292" y="90" width="16" height="12" fill="var(--muted)"/>`;
    g += `<text x="300" y="130" font-size="13" text-anchor="middle" fill="var(--muted)">${dc ? L2("DC output", "ডিসি আউটপুট") : L2("AC output", "এসি আউটপুট")}</text>`;
    /* graph */
    const gx1 = 36, gx2 = 388, gy = 232, gh = 52;
    g += `<line x1="${gx1}" y1="${gy}" x2="${gx2}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx1}" y1="${gy - gh - 6}" x2="${gx1}" y2="${gy + gh + 6}" stroke="var(--muted)"/><text x="${gx1 - 6}" y="${gy - gh + 4}" font-size="13" text-anchor="end" fill="var(--muted)">+</text><text x="${gx1 - 6}" y="${gy + gh + 4}" font-size="13" text-anchor="end" fill="var(--muted)">−</text><text x="${gx2}" y="${gy + gh + 12}" font-size="13" text-anchor="end" fill="var(--muted)">${L2("time →", "সময় →")}</text><text x="${gx1 + 6}" y="${gy - gh - 10}" font-size="13" fill="var(--muted)">${L2("voltage", "ভোল্টেজ")}</text>`;
    if (hist.length > 1) { const t0 = hist[hist.length - 1][0]; let pth = ""; hist.forEach(([t, v], i) => { const x = gx2 - (t0 - t) / 4 * (gx2 - gx1); if (x < gx1) return; pth += `${pth ? "L" : "M"}${x.toFixed(1)} ${(gy - v / 2 * gh).toFixed(1)}`; }); g += `<path d="${pth}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`; }
    g += `</svg>`; $("#c12gsv", el).innerHTML = g;
    $("#c12go", el).innerHTML = f === 0 ? L2("The coil is not turning: no change in the field, <b>no voltage</b>.", "কুণ্ডলী ঘুরছে না: ক্ষেত্রের পরিবর্তন নেই, <b>ভোল্টেজ নেই</b>।")
      : L2(`${dc ? "The commutator flips the connections every half turn, so the output never goes negative: <b>DC</b> (one direction, but it still rises and falls)." : "The output rises, falls and <b>reverses every half turn</b>: <b>AC</b>. It is largest when the coil is level (cutting across the field lines fastest) and zero when it is upright."} Turn faster and the peaks get taller.`,
        `${dc ? "কম্যুটেটর প্রতি অর্ধেক পাকে সংযোগ বদলে দেয়, তাই আউটপুট কখনো ঋণাত্মক হয় না: <b>ডিসি</b> (এক দিকে, তবে এখনো বাড়ে-কমে)।" : "আউটপুট বাড়ে, কমে আর <b>প্রতি অর্ধেক পাকে উল্টায়</b>: <b>এসি</b>। কুণ্ডলী আনুভূমিক হলে (সবচেয়ে দ্রুত বলরেখা কাটলে) এটি সর্বোচ্চ, খাড়া হলে শূন্য।"} দ্রুত ঘোরালে চূড়াগুলো উঁচু হয়।`);
  };
  chips12(el, ".c12gm", b => { dc = b.dataset.d === "1"; hist.length = 0; draw(); });
  $("#c12gs", el).addEventListener("input", draw);
  $("#c12grun", el).addEventListener("click", () => { run = !run; $("#c12grun", el).textContent = run ? L2("Pause", "থামাও") : L2("Play", "চালাও"); });
  if (REDUCED) { /* static frame: pre-fill one window of the graph */ for (let i = 0; i <= 200; i++) { const t = i * 0.02; th = -2 * Math.PI * 0.75 * t; hist.push([t, volt()]); } }
  draw();
  animate(el, dt => { if (!run) return; tt += dt; th -= 2 * Math.PI * rps() * dt; hist.push([tt, volt()]); while (hist.length && tt - hist[0][0] > 4.2) hist.shift(); draw(); });
};

/* 12.3.2 transformer calculator */
W.c12trans = (el) => {
  let ac = true;
  const PRE = [[L2("Book example","বইয়ের উদাহরণ"), 12, 100, 1000, 1], [L2("Phone charger","ফোন চার্জার"), 220, 1100, 60, 0.05], [L2("Equal turns","সমান পাক"), 220, 500, 500, 1]];
  el.innerHTML = `<div class="chipset c12tp" role="group">${PRE.map((q, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${q[0]}</button>`).join("")}</div>
  ${slider("c12tv", L2("Primary voltage Vp", "মুখ্য ভোল্টেজ Vp"), 1, 240, 1, 12, "V")}${slider("c12tnp", L2("Primary turns Np", "মুখ্য পাক Np"), 10, 2000, 10, 100, "")}${slider("c12tns", L2("Secondary turns Ns", "গৌণ পাক Ns"), 10, 2000, 10, 1000, "")}${slider("c12ti", L2("Primary current Ip", "মুখ্য প্রবাহ Ip"), 0.05, 5, 0.05, 1, "A")}
  <div class="chipset c12ta" role="group"><button data-a="1" aria-pressed="true">${L2("AC supply","এসি উৎস")}</button><button data-a="0" aria-pressed="false">${L2("DC (battery)","ডিসি (ব্যাটারি)")}</button></div><div class="svgwrap fit" id="c12tsv"></div><div class="w-out" id="c12to"></div>`;
  const go = () => {
    const Vp = sv(el, "c12tv", "V"), Np = sv(el, "c12tnp", ""), Ns = sv(el, "c12tns", ""), Ip = sv(el, "c12ti", "A", 2);
    const Vs = ac ? Vp * Ns / Np : 0, Is = ac ? Ip * Np / Ns : 0, P = Vp * Ip;
    const tp = Math.max(2, Math.min(14, Math.round(Np / 80))), ts = Math.max(2, Math.min(14, Math.round(Ns / 80)));
    let g = `<svg viewBox="0 0 400 230" role="img" aria-label="${L2("transformer","ট্রান্সফরমার")}">`;
    g += `<path d="M120 40H280V190H120Z M144 64H256V166H144Z" fill="var(--muted)" fill-rule="evenodd" opacity="0.55"/>`;
    const wind = (x, n, col) => { let s = ""; const y1 = 60, y2 = 170, st = (y2 - y1) / n; for (let i = 0; i < n; i++) { const y = y1 + st * (i + 0.5); s += `<path d="M${x - 16} ${y - st * 0.3}L${x + 16} ${y + st * 0.3}" stroke="${col}" stroke-width="2.5"/>`; } return s; };
    g += wind(132, tp, "var(--c)") + wind(268, ts, "var(--note)");
    g += `<path d="M116 70H70M116 160H70" stroke="var(--c)" stroke-width="1.5"/><path d="M284 70H330M284 160H330" stroke="var(--note)" stroke-width="1.5"/>`;
    /* input and output signals */
    const wave = (cx, amp, col, flat) => { let s = ""; for (let i = 0; i <= 40; i++) { const x = cx - 30 + i * 1.5, y = 115 - (flat ? amp : amp * Math.sin(i / 40 * 4 * Math.PI)); s += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; } return `<line x1="${cx - 32}" y1="115" x2="${cx + 32}" y2="115" stroke="var(--rule)"/><path d="${s}" fill="none" stroke="${col}" stroke-width="2.2"/>`; };
    const sc = v => v <= 0 ? 0 : Math.min(34, 6 + 9 * Math.log10(1 + v));
    g += wave(40, sc(Vp), "var(--c)", !ac) + wave(360, sc(Vs), "var(--note)", false);
    g += `<text x="40" y="30" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("primary", "মুখ্য")}</text><text x="40" y="200" font-size="14" text-anchor="middle" fill="var(--c)">${f12(Vp)} V</text><text x="40" y="218" font-size="13" text-anchor="middle" fill="var(--muted)">Np = ${f12(Np, 0)}</text>`;
    g += `<text x="360" y="30" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("secondary", "গৌণ")}</text><text x="360" y="200" font-size="14" text-anchor="middle" fill="var(--note)">${f12(Vs)} V</text><text x="360" y="218" font-size="13" text-anchor="middle" fill="var(--muted)">Ns = ${f12(Ns, 0)}</text>`;
    g += `<text x="200" y="215" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("iron core", "লোহার মজ্জা")}</text></svg>`;
    $("#c12tsv", el).innerHTML = g;
    const kind = Ns > Np ? L2("step-up", "স্টেপ আপ") : Ns < Np ? L2("step-down", "স্টেপ ডাউন") : L2("1 : 1 (no change)", "১ : ১ (পরিবর্তন নেই)");
    $("#c12to", el).innerHTML = !ac ? L2("<b>DC gives zero output.</b> A steady current makes a steady field in the core, and a steady field induces nothing in the secondary. Vs = 0 V, Is = 0 A.", "<b>ডিসিতে আউটপুট শূন্য।</b> স্থির প্রবাহ মজ্জায় স্থির ক্ষেত্র তৈরি করে, আর স্থির ক্ষেত্র গৌণ কুণ্ডলীতে কিছুই আবিষ্ট করে না। Vs = ০ V, Is = ০ A।")
      : L2(`Vs = (Ns/Np) × Vp = (${f12(Ns, 0)}/${f12(Np, 0)}) × ${f12(Vp)} = <b>${f12(Vs)} V</b> → <b>${kind}</b><br>Is = (Np/Ns) × Ip = (${f12(Np, 0)}/${f12(Ns, 0)}) × ${f12(Ip)} = <b>${f12(Is)} A</b><br>Power: VpIp = ${f12(P)} W = VsIs (ideal transformer)`,
        `Vs = (Ns/Np) × Vp = (${f12(Ns, 0)}/${f12(Np, 0)}) × ${f12(Vp)} = <b>${f12(Vs)} V</b> → <b>${kind}</b><br>Is = (Np/Ns) × Ip = (${f12(Np, 0)}/${f12(Ns, 0)}) × ${f12(Ip)} = <b>${f12(Is)} A</b><br>ক্ষমতা: VpIp = ${f12(P)} W = VsIs (আদর্শ ট্রান্সফরমার)`);
  };
  chips12(el, ".c12tp", b => { const q = PRE[+b.dataset.i]; $("#c12tv", el).value = q[1]; $("#c12tnp", el).value = q[2]; $("#c12tns", el).value = q[3]; $("#c12ti", el).value = q[4]; go(); });
  chips12(el, ".c12ta", b => { ac = b.dataset.a === "1"; go(); });
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go));
  go();
};
