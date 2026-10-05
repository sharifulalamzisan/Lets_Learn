/* ---- biology chapter 2 widgets: cells and tissues of organisms ---- */
const b2n = x => bnNum(x, LANG);
const b2chips = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const b2shuf = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const b2ok = (good, txt) => `<b style="color:${good ? "var(--good)" : "var(--bad)"}">${good ? L2("Correct! ", "ঠিক! ") : L2("Not quite. ", "হয়নি। ")}</b>${txt}`;
const b2F = () => LANG === "bn" ? 14.5 : 13;   /* Bangla glyphs look smaller, so SVG labels get a slightly larger size */
const b2T = (x, y, s, a = "start", sz = 13, c = "var(--ink)", w = 400) => `<text x="${x}" y="${y}" font-size="${sz === 13 ? b2F() : sz}" text-anchor="${a}" fill="${c}" font-weight="${w}">${s}</text>`;
const b2ln = (x1, y1, x2, y2, c = "var(--muted)", w = 1) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"/>`;
/* label joined to a point of the drawing by a thin line; long labels wrap onto two lines */
const b2L = (px, py, x, y, s, a = "start", max = 19) => {
  const sp = [...s.matchAll(/ /g)].map(m => m.index), wrap = s.length > max && sp.length > 0;
  let t;
  if (!wrap) t = b2T(x, y + 4, s, a);
  else { const c = sp.reduce((p, q) => Math.abs(q - s.length / 2) < Math.abs(p - s.length / 2) ? q : p); t = `<text x="${x}" y="${y - 3}" font-size="${b2F()}" text-anchor="${a}" fill="var(--ink)">${s.slice(0, c)}<tspan x="${x}" dy="${LANG === "bn" ? 16 : 15}">${s.slice(c + 1)}</tspan></text>`; }
  const ex = a === "start" ? x - 4 : a === "end" ? x + 4 : x, ey = a !== "middle" ? y : y < py ? y + (wrap ? 17 : 9) : y - (wrap ? 16 : 9);
  return b2ln(px, py, ex, ey) + `<circle cx="${px}" cy="${py}" r="2.2" fill="var(--ink)"/>` + t;
};
const b2tap = (root, sel, fn) => root.querySelectorAll(sel).forEach(n => { n.style.cursor = "pointer"; n.setAttribute("tabindex", "0"); n.setAttribute("role", "button"); n.addEventListener("click", () => fn(n)); n.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(n); } }); });
const b2dots = (pts, r = 1.8, c = "var(--ink)") => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("");
/* a small organelle shape reused in several drawings */
const b2mito = (x, y, a = 0, k = 1) => `<g transform="translate(${x},${y}) rotate(${a}) scale(${k})"><ellipse rx="13" ry="6.5" fill="var(--note)" fill-opacity=".55" stroke="var(--ink)" stroke-width="1.3"/><path d="M-8 0 l3 -4 l3 7 l3 -7 l3 7 l3 -4" fill="none" stroke="var(--ink)" stroke-width="1"/></g>`;
const b2chl = (x, y, a = 0) => `<g transform="translate(${x},${y}) rotate(${a})"><ellipse rx="15" ry="8" fill="var(--good)" fill-opacity=".8" stroke="var(--ink)" stroke-width="1.2"/><path d="M-8 -3 v6 M-3 -4 v8 M3 -4 v8 M8 -3 v6" stroke="var(--sheet)" stroke-width="1.6"/></g>`;

/* 2.1 prokaryotic and eukaryotic cells: compare, then sort statements */
W.b2types = (el) => {
  const DRAW = {
    pro: () => `<rect x="14" y="54" width="176" height="84" rx="42" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="4"/>
      <rect x="22" y="62" width="160" height="68" rx="34" fill="none" stroke="var(--c)" stroke-width="1.6"/>
      <path d="M62 98 q6 -22 20 -4 t20 0 t22 -6 q10 14 -8 18 t-24 -4 t-22 6 q-12 -2 -8 -10 Z" fill="none" stroke="var(--bad)" stroke-width="2.4"/>
      ${b2dots([[40, 84], [46, 108], [150, 80], [158, 104], [132, 116], [70, 118], [104, 76], [128, 78], [56, 76], [162, 92]], 2.4)}
      ${b2L(112, 92, 214, 32, L2("DNA (nucleoid): no membrane around it", "DNA (নিউক্লিওয়েড): চারপাশে পর্দা নেই"))}
      ${b2L(158, 104, 214, 82, L2("ribosomes", "রাইবোজোম"))}
      ${b2L(180, 110, 214, 114, L2("cell membrane", "কোষঝিল্লি"))}
      ${b2L(160, 137, 214, 146, L2("cell wall", "কোষপ্রাচীর"))}
      ${b2T(14, 184, L2("A bacterium: one prokaryotic cell", "ব্যাকটেরিয়া: একটি আদিকোষ"), "start", 13, "var(--muted)")}`,
    euk: () => `<ellipse cx="102" cy="96" rx="90" ry="70" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2.2"/>
      <circle cx="84" cy="88" r="29" fill="var(--sheet)" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="84" cy="88" r="24.5" fill="none" stroke="var(--ink)" stroke-width="1"/>
      <path d="M68 80 q8 -10 14 0 t12 2 q6 8 -4 12 t-14 -2 q-8 4 -10 -4" fill="none" stroke="var(--bad)" stroke-width="1.8"/>
      <circle cx="92" cy="96" r="6.5" fill="var(--c)"/>
      ${b2mito(150, 66, -25)}${b2mito(58, 140, 20)}${b2mito(148, 130, 40)}
      <path d="M118 92 q12 6 4 16 q-8 8 4 16 M126 88 q12 8 4 18 q-8 8 4 16" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
      ${b2dots([[110, 50], [128, 150], [96, 140], [40, 80], [44, 108], [170, 100], [118, 112], [126, 104], [124, 122], [70, 46]], 2)}
      ${b2L(98, 64, 214, 28, L2("nucleus inside a nuclear membrane", "নিউক্লিয়ার ঝিল্লিঘেরা নিউক্লিয়াস"))}
      ${b2L(156, 62, 214, 70, L2("mitochondrion", "মাইটোকন্ড্রিয়া"))}
      ${b2L(130, 104, 214, 104, L2("endoplasmic reticulum", "এন্ডোপ্লাজমিক রেটিকুলাম"), "start", 14)}
      ${b2L(170, 100, 214, 140, L2("ribosomes", "রাইবোজোম"))}
      ${b2L(176, 136, 214, 166, L2("cell membrane", "কোষঝিল্লি"))}
      ${b2T(14, 190, L2("A eukaryotic cell (animal type)", "একটি প্রকৃত কোষ (প্রাণিকোষ)"), "start", 13, "var(--muted)")}`
  };
  const NAME = { pro: L2("Prokaryotic cell", "আদিকোষ"), euk: L2("Eukaryotic cell", "প্রকৃত কোষ") };
  const ROWS = [
    [L2("Nucleus", "নিউক্লিয়াস"), L2("no true nucleus; no nuclear membrane", "সুগঠিত নিউক্লিয়াস নেই; নিউক্লিয়ার ঝিল্লি নেই"), L2("true nucleus enclosed by a nuclear membrane", "নিউক্লিয়ার ঝিল্লিঘেরা সুগঠিত নিউক্লিয়াস")],
    [L2("DNA", "DNA"), L2("lies free in the cytoplasm (nucleoid); no histone", "সাইটোপ্লাজমে ছড়ানো (নিউক্লিওয়েড); হিস্টোন নেই"), L2("inside the nucleus, with histone and other proteins", "নিউক্লিয়াসের ভেতরে; সাথে হিস্টোন ও অন্যান্য প্রোটিন")],
    [L2("Membrane-bound organelles", "ঝিল্লিঘেরা অঙ্গাণু"), L2("absent: no mitochondria, plastids or ER", "নেই: মাইটোকন্ড্রিয়া, প্লাস্টিড, এন্ডোপ্লাজমিক রেটিকুলাম থাকে না"), L2("present: mitochondria, ER, Golgi body and others", "আছে: মাইটোকন্ড্রিয়া, এন্ডোপ্লাজমিক রেটিকুলাম, গলজি বস্তু ইত্যাদি")],
    [L2("Ribosomes", "রাইবোজোম"), L2("present", "আছে"), L2("present", "আছে")],
    [L2("Examples", "উদাহরণ"), L2("bacteria, blue-green algae", "ব্যাকটেরিয়া, নীলাভ সবুজ শৈবাল"), L2("plants, animals, fungi, amoeba", "উদ্ভিদ, প্রাণী, ছত্রাক, অ্যামিবা")]
  ];
  /* P = prokaryotic only, E = eukaryotic only, B = both */
  const DECK = [
    ["E", L2("The nucleus is enclosed by a nuclear membrane.", "নিউক্লিয়াস নিউক্লিয়ার ঝিল্লি দিয়ে ঘেরা।"), L2("A membrane-bound nucleus is the mark of a eukaryotic cell.", "পর্দাঘেরা নিউক্লিয়াস প্রকৃত কোষের চিহ্ন।")],
    ["P", L2("The DNA lies free in the cytoplasm.", "DNA সাইটোপ্লাজমে খোলা অবস্থায় থাকে।"), L2("With no nuclear membrane, the DNA of a prokaryotic cell lies in the nucleoid region.", "নিউক্লিয়ার ঝিল্লি না থাকায় আদিকোষের DNA নিউক্লিওয়েড অঞ্চলে থাকে।")],
    ["B", L2("It has ribosomes.", "এতে রাইবোজোম থাকে।"), L2("Ribosomes are found in all living cells.", "রাইবোজোম সব জীবকোষেই থাকে।")],
    ["E", L2("It has mitochondria.", "এতে মাইটোকন্ড্রিয়া থাকে।"), L2("Membrane-bound organelles such as mitochondria occur only in eukaryotic cells.", "মাইটোকন্ড্রিয়ার মতো ঝিল্লিঘেরা অঙ্গাণু শুধু প্রকৃত কোষে থাকে।")],
    ["B", L2("It is surrounded by a cell membrane.", "এটি কোষঝিল্লি দিয়ে ঘেরা।"), L2("Every cell, of either kind, has a cell membrane.", "দুই ধরনের সব কোষেই কোষঝিল্লি থাকে।")],
    ["P", L2("Bacteria are made of this kind of cell.", "ব্যাকটেরিয়া এ ধরনের কোষ দিয়ে গঠিত।"), L2("Bacteria and blue-green algae are prokaryotic.", "ব্যাকটেরিয়া ও নীলাভ সবুজ শৈবাল আদিকোষী।")],
    ["E", L2("Its chromosomes contain DNA with histone proteins.", "এর ক্রোমোজোমে DNA-র সাথে হিস্টোন প্রোটিন থাকে।"), L2("Prokaryotic DNA is not wrapped with histone; eukaryotic DNA is.", "আদিকোষের DNA হিস্টোনে জড়ানো থাকে না; প্রকৃত কোষের থাকে।")],
    ["B", L2("DNA is its hereditary material.", "DNA এর বংশগতির বস্তু।"), L2("Both kinds of cell have DNA; only its packing differs.", "দুই ধরনের কোষেই DNA থাকে; শুধু রাখার ধরন আলাদা।")],
    ["E", L2("Onion cells and human cells are of this kind.", "পেঁয়াজ ও মানুষের কোষ এ ধরনের।"), L2("All plants and animals are eukaryotic.", "সব উদ্ভিদ ও প্রাণী প্রকৃতকোষী।")],
    ["P", L2("Blue-green algae are made of this kind of cell.", "নীলাভ সবুজ শৈবাল এ ধরনের কোষ দিয়ে গঠিত।"), L2("Blue-green algae (cyanobacteria) have no nuclear membrane.", "নীলাভ সবুজ শৈবালে (সায়ানোব্যাকটেরিয়া) নিউক্লিয়ার ঝিল্লি নেই।")],
    ["E", L2("It has endoplasmic reticulum and may have plastids.", "এতে এন্ডোপ্লাজমিক রেটিকুলাম থাকে, প্লাস্টিডও থাকতে পারে।"), L2("These membrane-bound organelles are absent from prokaryotic cells.", "এই ঝিল্লিঘেরা অঙ্গাণুগুলো আদিকোষে থাকে না।")],
    ["B", L2("It has cytoplasm.", "এতে সাইটোপ্লাজম থাকে।"), L2("Cytoplasm is found in every living cell.", "সাইটোপ্লাজম প্রতিটি জীবকোষে থাকে।")]
  ];
  const ANS = { P: NAME.pro, E: NAME.euk, B: L2("Both", "দুটোই") };
  let mode = "ex", k = "pro", deck = b2shuf(DECK), di = 0, sc = 0, sn = 0, answered = false;
  el.innerHTML = `<div class="chipset b2tm" role="group"><button data-m="ex" aria-pressed="true">${L2("Compare", "তুলনা")}</button><button data-m="so" aria-pressed="false">${L2("Sort", "সাজাও")}</button></div><div id="b2tb" style="margin-top:8px"></div>`;
  const explore = () => {
    $("#b2tb", el).innerHTML = `<div class="chipset b2tk" role="group"><button data-k="pro" aria-pressed="${k === "pro"}">${NAME.pro}</button><button data-k="euk" aria-pressed="${k === "euk"}">${NAME.euk}</button></div>
      <div class="svgwrap fit" style="margin-top:6px"><svg viewBox="0 0 360 196" role="img" aria-label="${NAME[k]}">${DRAW[k]()}</svg></div>
      <div class="w-out" style="font-size:15px;line-height:1.5">${ROWS.map(r => `<div style="margin:2px 0 8px"><b>${r[0]}</b>
        <div style="${k === "pro" ? "font-weight:600" : "color:var(--muted)"}">${NAME.pro}: ${r[1]}</div>
        <div style="${k === "euk" ? "font-weight:600" : "color:var(--muted)"}">${NAME.euk}: ${r[2]}</div></div>`).join("")}</div>`;
    b2chips(el, ".b2tk", b => { k = b.dataset.k; explore(); });
  };
  const sortv = () => {
    if (di >= deck.length) {
      $("#b2tb", el).innerHTML = `<div class="w-out">${L2(`Finished! You got ${sc} of ${sn} right.`, `শেষ! ${b2n(sn)}টির মধ্যে ${b2n(sc)}টি ঠিক হয়েছে।`)}<div class="w-row" style="margin-top:8px"><button class="btn solid" id="b2tr">${L2("Play again", "আবার খেলো")}</button></div></div>`;
      $("#b2tr", el).addEventListener("click", () => { deck = b2shuf(DECK); di = sc = sn = 0; sortv(); }); return;
    }
    answered = false; const o = deck[di];
    $("#b2tb", el).innerHTML = `<p class="muted" style="margin:4px 0">${L2(`Statement ${di + 1} of ${deck.length}`, `কথা ${b2n(di + 1)}/${b2n(deck.length)}`)}</p>
      <div style="font-size:19px;font-weight:700;margin-bottom:8px">${o[1]}</div>
      <p class="hint" style="margin:0 0 6px">${L2("True for which kind of cell?", "কোন ধরনের কোষের জন্য সত্যি?")}</p>
      <div class="w-row">${["P", "E", "B"].map(a => `<button class="btn" data-a="${a}">${ANS[a]}</button>`).join("")}</div>
      <div class="w-out" id="b2to" style="margin-top:10px">${sn ? L2(`Score: ${sc} / ${sn}`, `স্কোর: ${b2n(sc)} / ${b2n(sn)}`) : L2("Think: is a nucleus or a membrane-bound organelle involved?", "ভাবো: এখানে কি নিউক্লিয়াস বা ঝিল্লিঘেরা অঙ্গাণুর কথা আছে?")}</div>`;
    el.querySelectorAll("#b2tb button[data-a]").forEach(b => b.addEventListener("click", () => {
      if (answered) return; answered = true; const right = b.dataset.a === o[0]; sn++; if (right) sc++;
      el.querySelectorAll("#b2tb button[data-a]").forEach(q => { if (q.dataset.a === o[0]) q.classList.add("done"); else if (q === b) q.style.borderColor = "var(--bad)"; });
      $("#b2to", el).innerHTML = b2ok(right, `<b>${ANS[o[0]]}</b>${L2(". ", "। ")}${o[2]}`) + `<br><span class="muted">${L2(`Score: ${sc} / ${sn}`, `স্কোর: ${b2n(sc)} / ${b2n(sn)}`)}</span><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b2tn">${L2("Next", "পরেরটি")}</button></div>`;
      $("#b2tn", el).addEventListener("click", () => { di++; sortv(); });
    }));
  };
  b2chips(el, ".b2tm", b => { mode = b.dataset.m; mode === "ex" ? explore() : sortv(); });
  explore();
};

/* 2.2 labelled plant and animal cell: tap a part */
W.b2cell = (el) => {
  const WHERE = { p: L2("Only in plant cells", "শুধু উদ্ভিদকোষে"), a: L2("Only in animal cells", "শুধু প্রাণিকোষে"), b: L2("In both plant and animal cells", "উদ্ভিদ ও প্রাণী দুই কোষেই"), m: L2("Mainly in animal cells", "প্রধানত প্রাণিকোষে") };
  const P = {
    cw: [L2("Cell wall", "কোষপ্রাচীর"), "p", L2("Firm, non-living outer covering made mainly of cellulose. It gives the cell strength and a fixed shape.", "প্রধানত সেলুলোজে তৈরি শক্ত, জড় বাইরের আবরণ। কোষকে দৃঢ়তা ও নির্দিষ্ট আকৃতি দেয়।")],
    cm: [L2("Cell membrane (plasmalemma)", "কোষঝিল্লি (প্লাজমালেমা)"), "b", L2("Thin, flexible, double-layered covering of lipid and protein. It is selectively permeable: it controls what enters and leaves the cell.", "লিপিড ও প্রোটিনের পাতলা, স্থিতিস্থাপক, দুই স্তরের আবরণ। এটি বৈষম্যভেদ্য: কোষে কী ঢুকবে ও বেরোবে তা নিয়ন্ত্রণ করে।")],
    cy: [L2("Cytoplasm", "সাইটোপ্লাজম"), "b", L2("Jelly-like substance inside the cell membrane and outside the nucleus. The organelles lie in it.", "কোষঝিল্লির ভেতরে ও নিউক্লিয়াসের বাইরে জেলির মতো বস্তু। অঙ্গাণুগুলো এর মধ্যেই থাকে।")],
    nu: [L2("Nucleus", "নিউক্লিয়াস"), "b", L2("Control centre of the cell; it carries the chromosomes. In a mature plant cell the big vacuole pushes it to one side; in an animal cell it lies near the centre.", "কোষের নিয়ন্ত্রণকেন্দ্র; ক্রোমোজোম বহন করে। পরিণত উদ্ভিদকোষে বড় কোষগহ্বরের চাপে এক পাশে থাকে; প্রাণিকোষে মাঝামাঝি থাকে।")],
    va: [L2("Vacuole", "কোষগহ্বর"), "p", L2("A plant cell has one large central vacuole filled with cell sap, which keeps the cell firm. An animal cell has none, or only very small ones.", "উদ্ভিদকোষে কোষরসে ভরা একটি বড় কেন্দ্রীয় কোষগহ্বর থাকে, যা কোষকে টানটান রাখে। প্রাণিকোষে থাকে না, থাকলেও খুব ছোট।")],
    ch: [L2("Chloroplast (a plastid)", "ক্লোরোপ্লাস্ট (একটি প্লাস্টিড)"), "p", L2("Green plastid containing chlorophyll. It makes food by photosynthesis.", "ক্লোরোফিলযুক্ত সবুজ প্লাস্টিড। সালোকসংশ্লেষণে খাদ্য তৈরি করে।")],
    mi: [L2("Mitochondria", "মাইটোকন্ড্রিয়া"), "b", L2("The power house: releases the energy of food by respiration.", "শক্তিঘর: শ্বসনের মাধ্যমে খাদ্যের শক্তি বের করে আনে।")],
    er: [L2("Endoplasmic reticulum", "এন্ডোপ্লাজমিক রেটিকুলাম"), "b", L2("Network of membrane channels along which materials move. Where ribosomes sit on it, proteins are made.", "ঝিল্লির নালিকা-জাল, যার পথে পদার্থ চলাচল করে। যেখানে গায়ে রাইবোজোম থাকে, সেখানে প্রোটিন তৈরি হয়।")],
    go: [L2("Golgi body", "গলজি বস্তু"), "b", L2("Stack of flat sacs that packs and secretes substances made in the cell.", "চ্যাপ্টা থলির স্তূপ, যা কোষে তৈরি পদার্থ মোড়কজাত ও নিঃসরণ করে।")],
    ri: [L2("Ribosomes", "রাইবোজোম"), "b", L2("Tiny grains with no membrane. Proteins are made on them.", "ঝিল্লিবিহীন অতি ক্ষুদ্র দানা। এতে প্রোটিন তৈরি হয়।")],
    ly: [L2("Lysosome", "লাইসোজোম"), "m", L2("Small bag of digestive enzymes that destroys germs entering the cell.", "পরিপাককারী উৎসেচকের ছোট থলি, যা কোষে ঢোকা জীবাণু ধ্বংস করে।")],
    ce: [L2("Centrosome", "সেন্ট্রোজোম"), "a", L2("Two rod-shaped centrioles near the nucleus. They help the cell to divide.", "নিউক্লিয়াসের কাছে দুটি দণ্ডাকার সেন্ট্রিওল। কোষ বিভাজনে সাহায্য করে।")],
    sv: [L2("Small vacuole", "ছোট কোষগহ্বর"), "b", L2("Animal cells usually have no vacuole; if present, it is very small, unlike the large central vacuole of a plant cell.", "প্রাণিকোষে সাধারণত কোষগহ্বর থাকে না; থাকলেও খুব ছোট, উদ্ভিদকোষের বড় কেন্দ্রীয় কোষগহ্বরের মতো নয়।")]
  };
  const LIST = { plant: ["cw", "cm", "cy", "nu", "va", "ch", "mi", "er", "go", "ri"], animal: ["cm", "cy", "nu", "ce", "mi", "er", "go", "ri", "ly", "sv"] };
  let kind = "plant", sel = null;
  const G = (key, inner) => `<g data-p="${key}" opacity="${sel && sel !== key ? 0.28 : 1}">${inner}</g>`;
  const golgi = (x, y) => `${[0, 7, 14, 21].map(d => `<path d="M${x} ${y + d} q14 -9 28 0" fill="none" stroke="var(--bad)" stroke-width="3.2" stroke-linecap="round"/>`).join("")}<circle cx="${x + 34}" cy="${y + 2}" r="3" fill="var(--bad)"/><circle cx="${x - 5}" cy="${y + 20}" r="2.6" fill="var(--bad)"/>`;
  const plant = () => `
    ${G("cy", `<rect x="34" y="14" width="292" height="202" rx="10" fill="var(--c-soft)"/>`)}
    ${G("va", `<ellipse cx="196" cy="118" rx="94" ry="60" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.6"/><text x="196" y="122" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("cell sap", "কোষরস")}</text>`)}
    ${G("er", `<path d="M102 82 q14 6 6 18 q-8 10 6 20 M110 76 q14 8 6 20 q-8 10 6 20" fill="none" stroke="var(--ink)" stroke-width="1.6"/><path d="M86 60 h30" stroke="transparent" stroke-width="1"/><rect x="96" y="72" width="34" height="52" fill="transparent"/>`)}
    ${G("ch", b2chl(140, 40, -12) + b2chl(252, 38, 8) + b2chl(304, 100, 82) + b2chl(66, 150, 72) + b2chl(132, 196, 4) + b2chl(272, 194, -8))}
    ${G("mi", b2mito(200, 36, 0) + b2mito(58, 112, 90) + b2mito(212, 198, 0))}
    ${G("go", golgi(288, 150) + `<rect x="278" y="142" width="50" height="34" fill="transparent"/>`)}
    ${G("ri", b2dots([[92, 30], [170, 48], [226, 46], [300, 60], [312, 140], [296, 184], [240, 204], [170, 204], [96, 190], [52, 180], [48, 78], [118, 142]], 2.2))}
    ${G("nu", `<circle cx="74" cy="66" r="25" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.6"/><circle cx="80" cy="70" r="7.5" fill="var(--c)"/><path d="M58 62 q6 -8 12 -2 t10 -6" fill="none" stroke="var(--bad)" stroke-width="1.5"/>`)}
    ${G("cm", `<rect x="34" y="14" width="292" height="202" rx="10" fill="none" stroke="var(--ink)" stroke-width="1.8"/><rect x="34" y="14" width="292" height="202" rx="10" fill="none" stroke="transparent" stroke-width="9"/>`)}
    ${G("cw", `<rect x="25" y="5" width="310" height="220" rx="14" fill="none" stroke="var(--good)" stroke-width="8"/>`)}`;
  const animal = () => `
    ${G("cy", `<path d="M70 44 C110 4 250 8 296 48 C340 86 330 164 280 190 C220 220 120 214 72 180 C26 146 30 82 70 44 Z" fill="var(--c-soft)"/>`)}
    ${G("er", `<path d="M132 84 q-14 12 -6 28 q8 14 -4 26 M122 80 q-14 14 -6 30 q8 14 -4 26" fill="none" stroke="var(--ink)" stroke-width="1.6"/><rect x="104" y="78" width="34" height="62" fill="transparent"/>`)}
    ${G("mi", b2mito(108, 62, -20) + b2mito(266, 148, 30) + b2mito(140, 180, 8))}
    ${G("go", golgi(70, 110) + `<rect x="60" y="102" width="50" height="34" fill="transparent"/>`)}
    ${G("ly", [[232, 178], [284, 96], [160, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="var(--bad)" fill-opacity=".7" stroke="var(--ink)" stroke-width="1"/>`).join(""))}
    ${G("sv", [[212, 50], [96, 158]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.5"/>`).join(""))}
    ${G("ri", b2dots([[90, 80], [150, 62], [250, 50], [290, 130], [250, 186], [190, 198], [110, 190], [62, 140], [226, 150], [182, 60], [270, 76]], 2.2))}
    ${G("ce", `<circle cx="240" cy="92" r="14" fill="var(--sheet)" fill-opacity=".6" stroke="var(--muted)" stroke-dasharray="3 2"/><rect x="230" y="89" width="13" height="5.5" rx="1.5" fill="var(--ink)"/><rect x="244" y="84" width="5.5" height="13" rx="1.5" fill="var(--ink)"/>`)}
    ${G("nu", `<circle cx="184" cy="116" r="31" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.6"/><circle cx="192" cy="122" r="8.5" fill="var(--c)"/><path d="M166 108 q6 -10 14 -2 t12 -6 M170 128 q8 6 14 0" fill="none" stroke="var(--bad)" stroke-width="1.5"/>`)}
    ${G("cm", `<path d="M70 44 C110 4 250 8 296 48 C340 86 330 164 280 190 C220 220 120 214 72 180 C26 146 30 82 70 44 Z" fill="none" stroke="var(--ink)" stroke-width="2.4"/><path d="M70 44 C110 4 250 8 296 48 C340 86 330 164 280 190 C220 220 120 214 72 180 C26 146 30 82 70 44 Z" fill="none" stroke="transparent" stroke-width="12"/>`)}`;
  const CMP = [
    [L2("Cell wall", "কোষপ্রাচীর"), L2("present", "আছে"), L2("absent", "নেই")],
    [L2("Plastids", "প্লাস্টিড"), L2("present", "আছে"), L2("absent", "নেই")],
    [L2("Vacuole", "কোষগহ্বর"), L2("one large, central", "একটি বড়, কেন্দ্রীয়"), L2("none, or very small", "নেই, বা খুব ছোট")],
    [L2("Centrosome", "সেন্ট্রোজোম"), L2("absent (higher plants)", "নেই (উচ্চশ্রেণির উদ্ভিদে)"), L2("present", "আছে")],
    [L2("Shape", "আকৃতি"), L2("fixed, box-like", "নির্দিষ্ট, বাক্সের মতো"), L2("rounded or irregular", "গোলাকার বা অনিয়মিত")],
    [L2("Nucleus", "নিউক্লিয়াস"), L2("pushed to one side", "এক পাশে"), L2("near the centre", "মাঝামাঝি")],
    [L2("Stored food", "সঞ্চিত খাদ্য"), L2("starch", "শ্বেতসার"), L2("glycogen", "গ্লাইকোজেন")]
  ];
  el.innerHTML = `<div class="chipset b2ck" role="group"><button data-k="plant" aria-pressed="true">${L2("Plant cell", "উদ্ভিদকোষ")}</button><button data-k="animal" aria-pressed="false">${L2("Animal cell", "প্রাণিকোষ")}</button><button data-k="cmp" aria-pressed="false">${L2("Differences", "পার্থক্য")}</button></div><div id="b2cb" style="margin-top:8px"></div>`;
  const draw = () => {
    if (kind === "cmp") {
      const td = "padding:5px 6px;border-bottom:1px solid var(--rule);vertical-align:top";
      $("#b2cb", el).innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:14.5px;line-height:1.35"><tr><th style="${td};text-align:left"></th><th style="${td};text-align:left;color:var(--good)">${L2("Plant cell", "উদ্ভিদকোষ")}</th><th style="${td};text-align:left;color:var(--note)">${L2("Animal cell", "প্রাণিকোষ")}</th></tr>
        ${CMP.map(r => `<tr><td style="${td};font-weight:600">${r[0]}</td><td style="${td}">${r[1]}</td><td style="${td}">${r[2]}</td></tr>`).join("")}</table>
        <p class="hint">${L2("Both have a cell membrane, cytoplasm, nucleus, mitochondria, ER, Golgi body and ribosomes.", "দুটোতেই কোষঝিল্লি, সাইটোপ্লাজম, নিউক্লিয়াস, মাইটোকন্ড্রিয়া, এন্ডোপ্লাজমিক রেটিকুলাম, গলজি বস্তু ও রাইবোজোম আছে।")}</p>`;
      return;
    }
    const d = sel ? P[sel] : null;
    let where = d ? WHERE[d[1]] : "";
    if (sel === "va" || sel === "sv") where = L2("Large in plant cells; absent or very small in animal cells", "উদ্ভিদকোষে বড়; প্রাণিকোষে নেই বা খুব ছোট");
    $("#b2cb", el).innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 230" role="img" aria-label="${kind === "plant" ? L2("plant cell", "উদ্ভিদকোষ") : L2("animal cell", "প্রাণিকোষ")}">${kind === "plant" ? plant() : animal()}</svg></div>
      <div class="chipset b2cp" role="group" style="margin-top:6px">${LIST[kind].map(key => `<button data-p="${key}" aria-pressed="${sel === key}">${P[key][0]}</button>`).join("")}</div>
      <div class="w-out" style="margin-top:8px">${d ? `<b>${d[0]}</b><br><span style="color:var(--c);font-weight:600">${where}</span><br>${d[2]}` : L2("Tap a part of the cell, or a name above, to see what it does.", "কোষের কোনো অংশে বা ওপরের কোনো নামে চাপ দিয়ে দেখো সেটি কী কাজ করে।")}</div>`;
    b2tap(el, "#b2cb svg g[data-p]", n => { sel = sel === n.dataset.p ? null : n.dataset.p; draw(); });
    el.querySelectorAll(".b2cp button").forEach(b => b.addEventListener("click", () => { sel = sel === b.dataset.p ? null : b.dataset.p; draw(); }));
  };
  b2chips(el, ".b2ck", b => { kind = b.dataset.k; sel = null; draw(); });
  draw();
};

/* 2.2.2 organelles close up, and a "who am I?" matching game */
W.b2organelle = (el) => {
  const fingers = () => {
    let s = "", dots = [];
    const yt = x => 90 - 44 * Math.sqrt(1 - ((x - 104) / 84) ** 2), yb = x => 90 + 44 * Math.sqrt(1 - ((x - 104) / 84) ** 2);
    [48, 78, 108, 138].forEach(x => { const y = yt(x) + 1, len = 44; s += `<path d="M${x - 6} ${y} v${len} a6 6 0 0 0 12 0 v${-len}" fill="var(--sheet)" stroke="var(--bad)" stroke-width="1.8"/>`; [10, 22, 34].forEach(d => dots.push([x - 9, y + d], [x + 9, y + d])); });
    [63, 93, 123, 153].forEach(x => { const y = yb(x) - 1, len = 44; s += `<path d="M${x - 6} ${y} v${-len} a6 6 0 0 1 12 0 v${len}" fill="var(--sheet)" stroke="var(--bad)" stroke-width="1.8"/>`; [10, 22, 34].forEach(d => dots.push([x - 9, y - d], [x + 9, y - d])); });
    return s + b2dots(dots, 1.5);
  };
  const grana = (x, y, n = 4) => Array.from({ length: n }, (_, i) => `<rect x="${x - 12}" y="${y + i * 7}" width="24" height="5.4" rx="2.7" fill="var(--good)" stroke="var(--ink)" stroke-width=".8"/>`).join("");
  const D = {
    mit: () => `<ellipse cx="104" cy="90" rx="94" ry="54" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.6"/>
      <ellipse cx="104" cy="90" rx="84" ry="44" fill="var(--note)" fill-opacity=".22" stroke="var(--bad)" stroke-width="1.8"/>${fingers()}
      ${b2L(166, 46, 216, 24, L2("outer membrane", "বহিঃঝিল্লি"))}${b2L(178, 68, 216, 56, L2("inner membrane", "অন্তঃঝিল্লি"))}
      ${b2L(138, 84, 216, 88, L2("crista (fold)", "ক্রিস্টি (ভাঁজ)"))}${b2L(147, 104, 216, 120, L2("oxysomes", "অক্সিজোম"))}${b2L(170, 100, 216, 152, L2("matrix", "ম্যাট্রিক্স"))}`,
    chl: () => `<ellipse cx="104" cy="90" rx="94" ry="52" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.6"/>
      <ellipse cx="104" cy="90" rx="86" ry="44" fill="var(--good)" fill-opacity=".16" stroke="var(--good)" stroke-width="1.6"/>
      <path d="M52 92 H86 M110 80 H134 M110 104 H134 M158 94 H170" stroke="var(--good)" stroke-width="2"/>
      ${grana(40, 76, 5)}${grana(98, 62, 4)}${grana(98, 98, 4)}${grana(146, 76, 5)}
      ${b2L(170, 50, 216, 28, L2("two membranes", "দুই স্তরের ঝিল্লি"))}${b2L(146, 78, 216, 72, L2("granum: traps light", "গ্রানা: আলো ধরে"))}
      ${b2L(124, 124, 216, 116, L2("stroma: makes sugar", "স্ট্রোমা: শর্করা তৈরি"))}${b2T(216, 156, L2("green: chlorophyll", "সবুজ: ক্লোরোফিল"), "start", 13, "var(--muted)")}`,
    gol: () => `${[0, 1, 2, 3, 4].map(i => `<path d="M${40 - i * 2} ${52 + i * 19} q${62 + i * 2} ${-24 + i * 2} ${124 + i * 4} 0" fill="none" stroke="var(--bad)" stroke-opacity=".75" stroke-width="9" stroke-linecap="round"/>`).join("")}
      ${[[184, 44, 5], [192, 70, 8], [190, 104, 5], [18, 62, 5], [14, 96, 7], [186, 140, 9], [26, 142, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--bad)" fill-opacity=".3" stroke="var(--bad)" stroke-width="1.5"/>`).join("")}
      ${b2L(150, 46, 220, 26, L2("cisternae (flat sacs)", "সিস্টার্নি (চ্যাপ্টা থলি)"))}${b2L(189, 104, 220, 84, L2("small vesicle", "ক্ষুদ্র ভেসিকল"))}${b2L(193, 138, 220, 142, L2("large vesicle", "বড় ভেসিকল"))}`,
    er: () => `<circle cx="-6" cy="70" r="56" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="3"/>${b2L(22, 112, 32, 168, L2("nucleus", "নিউক্লিয়াস"), "middle")}
      <path d="M64 30 h112 a9 9 0 0 1 0 18 h-104 a9 9 0 0 0 0 18 h104 a9 9 0 0 1 0 18 h-104" fill="none" stroke="var(--ink)" stroke-width="2.6"/>
      ${b2dots([70, 90, 110, 130, 150, 170].flatMap(x => [[x, 25], [x + 6, 53], [x, 89]]).concat([[84, 43], [124, 43], [164, 43], [90, 71], [130, 71], [168, 71]]), 2.6)}
      <path d="M60 128 q20 -18 40 0 t40 0 t40 0 M70 156 q20 -16 40 0 t40 0 t34 -6 M100 128 v20 M140 128 v22" fill="none" stroke="var(--ink)" stroke-width="2.6"/>
      ${b2L(170, 25, 220, 22, L2("ribosome", "রাইবোজোম"))}${b2L(182, 60, 220, 62, L2("rough ER: makes protein", "অমসৃণ ER: প্রোটিন তৈরি"))}${b2L(180, 128, 220, 132, L2("smooth ER: no ribosomes", "মসৃণ ER: রাইবোজোম নেই"))}`,
    vac: () => `<rect x="14" y="16" width="184" height="146" rx="10" fill="var(--c-soft)" stroke="var(--good)" stroke-width="6"/>
      <ellipse cx="112" cy="90" rx="70" ry="56" fill="var(--sheet)" stroke="var(--muted)" stroke-width="2"/>
      <circle cx="38" cy="44" r="13" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/><circle cx="40" cy="46" r="4" fill="var(--c)"/>
      ${b2chl(40, 130, 60)}${b2chl(176, 30, 20)}
      ${b2L(140, 70, 220, 30, L2("large vacuole full of cell sap", "কোষরসে ভরা বড় কোষগহ্বর"))}${b2L(180, 104, 220, 84, L2("vacuole membrane", "কোষগহ্বরের পর্দা"))}
      ${b2L(186, 142, 220, 128, L2("cytoplasm pushed to the edge", "কিনারায় সরে যাওয়া সাইটোপ্লাজম"))}`,
    lys: () => `<circle cx="84" cy="92" r="58" fill="var(--bad)" fill-opacity=".12" stroke="var(--ink)" stroke-width="3"/>
      ${b2dots([[60, 66], [84, 54], [108, 66], [50, 92], [118, 96], [62, 122], [90, 134], [112, 122], [76, 80], [100, 84], [70, 104]], 3.4, "var(--bad)")}
      <rect x="76" y="94" width="30" height="13" rx="6.5" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="3 3"/>
      <rect x="160" y="24" width="30" height="13" rx="6.5" fill="var(--muted)"/><path d="M158 40 L138 56" stroke="var(--ink)" stroke-width="1.6" marker-end="url(#b2oa)"/>
      ${b2T(196, 22, L2("germ", "জীবাণু"), "start", 13, "var(--muted)")}
      ${b2L(138, 72, 220, 60, L2("lipid membrane", "লিপিড ঝিল্লি"))}${b2L(118, 96, 220, 98, L2("digestive enzymes", "পরিপাককারী উৎসেচক"))}${b2L(100, 106, 220, 140, L2("germ being digested", "হজম হতে থাকা জীবাণু"))}`,
    rib: () => `<ellipse cx="80" cy="96" rx="46" ry="32" fill="var(--c)" fill-opacity=".55" stroke="var(--ink)" stroke-width="2"/>
      <ellipse cx="80" cy="136" rx="38" ry="15" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2"/>
      ${[[102, 66], [114, 54], [128, 46], [143, 42], [158, 44], [172, 50], [184, 60]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="var(--note)" fill-opacity="${0.45 + i * 0.07}" stroke="var(--ink)" stroke-width="1.2"/>`).join("")}
      ${b2L(60, 100, 220, 112, L2("ribosome: no membrane", "রাইবোজোম: ঝিল্লি নেই"))}${b2L(172, 50, 220, 30, L2("amino acids joined into a chain", "অ্যামিনো এসিড জুড়ে চেইন"))}
      ${b2T(220, 68, L2("= protein", "= প্রোটিন"), "start", 13, "var(--muted)")}${b2T(14, 172, L2("found in every living cell", "সব জীবকোষেই থাকে"), "start", 13, "var(--muted)")}`,
    cen: () => `${Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return b2ln(100 + 62 * Math.cos(a), 92 + 62 * Math.sin(a), 100 + 82 * Math.cos(a), 92 + 82 * Math.sin(a), "var(--muted)", 1.6); }).join("")}
      <circle cx="100" cy="92" r="60" fill="var(--c-soft)" stroke="var(--muted)" stroke-dasharray="5 4"/>
      <g fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"><rect x="64" y="74" width="50" height="22" rx="5"/><rect x="110" y="88" width="22" height="50" rx="5"/></g>
      <path d="M68 80 h42 M68 85 h42 M68 90 h42 M116 92 v42 M121 92 v42 M126 92 v42" stroke="var(--ink)" stroke-width="1"/>
      ${b2L(96, 78, 222, 28, L2("centriole (two)", "সেন্ট্রিওল (দুটি)"))}${b2L(146, 110, 222, 80, L2("centrosphere", "সেন্ট্রোস্ফিয়ার"))}${b2L(176, 122, 222, 134, L2("aster rays", "অ্যাস্টার রে"))}`,
    cyt: () => `<ellipse cx="104" cy="92" rx="94" ry="68" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2.2"/>
      ${[20, 70, 115, 160, 205, 250, 300, 340].map(a => { const r = a * Math.PI / 180; return b2ln(104 + 22 * Math.cos(r), 92 + 22 * Math.sin(r), 104 + 88 * Math.cos(r), 92 + 62 * Math.sin(r), "var(--c)", 3.4); }).join("")}
      <path d="M22 70 l40 -36 M30 120 l34 30 M140 30 l44 30 M150 152 l36 -34 M60 26 l60 -2 M70 158 l70 0 M16 92 l14 -34 M190 80 l-4 40" stroke="var(--bad)" stroke-width="1.3"/>
      <path d="M40 60 q20 14 40 2 t38 6 M60 130 q24 -16 48 -2 t50 -10" fill="none" stroke="var(--note)" stroke-width="2.2"/>
      <circle cx="104" cy="92" r="22" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.2"/>
      ${b2L(170, 54, 222, 26, L2("microtubule", "মাইক্রোটিউবিউল"))}${b2L(150, 124, 222, 78, L2("intermediate filament", "ইন্টারমিডিয়েট ফিলামেন্ট"), "start", 12)}${b2L(176, 128, 222, 136, L2("microfilament", "মাইক্রোফিলামেন্ট"))}`
  };
  const MEM = { 2: L2("two membranes", "দুই স্তরের ঝিল্লি"), 1: L2("membrane-bound", "ঝিল্লিযুক্ত"), 0: L2("no membrane", "ঝিল্লিবিহীন") };
  const O = {
    mit: [L2("Mitochondrion", "মাইটোকন্ড্রিয়া"), 2, L2("almost all plant and animal cells", "প্রায় সব উদ্ভিদ ও প্রাণিকোষ"), L2("The power house. Steps 2, 3 and 4 of respiration happen here, releasing most of the cell's energy. Cristae give a large surface for the enzymes.", "শক্তিঘর। শ্বসনের ২য়, ৩য় ও ৪র্থ ধাপ এখানে ঘটে এবং কোষের বেশিরভাগ শক্তি উৎপন্ন হয়। ক্রিস্টি থাকায় উৎসেচকের জন্য তল অনেক বেড়ে যায়।")],
    chl: [L2("Chloroplast", "ক্লোরোপ্লাস্ট"), 2, L2("green parts of plants", "উদ্ভিদের সবুজ অংশ"), L2("A green plastid. Its grana trap sunlight and its stroma uses that energy to make sugar from carbon dioxide and water: photosynthesis.", "সবুজ প্লাস্টিড। গ্রানা সূর্যের আলো ধরে, আর স্ট্রোমা সেই শক্তি দিয়ে কার্বন ডাই-অক্সাইড ও পানি থেকে শর্করা তৈরি করে: সালোকসংশ্লেষণ।")],
    gol: [L2("Golgi body", "গলজি বস্তু"), 1, L2("mainly animal cells; many plant cells too", "প্রধানত প্রাণিকোষ; অনেক উদ্ভিদকোষেও"), L2("Collects substances made in the cell, packs them and sends them out (secretion), including hormones. Sometimes stores protein.", "কোষে তৈরি পদার্থ সংগ্রহ করে, মোড়কজাত করে বাইরে পাঠায় (নিঃসরণ), হরমোনও। কখনো কখনো প্রোটিন সঞ্চয় করে।")],
    er: [L2("Endoplasmic reticulum (ER)", "এন্ডোপ্লাজমিক রেটিকুলাম (ER)"), 1, L2("plant and animal cells", "উদ্ভিদ ও প্রাণিকোষ"), L2("A network of channels for moving materials through the cell. Proteins are made where ribosomes are attached (rough ER).", "কোষের ভেতরে পদার্থ চলাচলের নালিকা-জাল। যেখানে রাইবোজোম লেগে থাকে (অমসৃণ ER), সেখানে প্রোটিন তৈরি হয়।")],
    vac: [L2("Vacuole", "কোষগহ্বর"), 1, L2("large in plant cells; small or absent in animal cells", "উদ্ভিদকোষে বড়; প্রাণিকোষে ছোট বা নেই"), L2("Holds cell sap: water with salts, sugars, proteins, organic acids and pigments. It keeps a plant cell firm.", "কোষরস ধারণ করে: পানিতে লবণ, শর্করা, আমিষ, জৈব এসিড ও রঞ্জক। উদ্ভিদকোষকে টানটান রাখে।")],
    lys: [L2("Lysosome", "লাইসোজোম"), 1, L2("mainly animal cells", "প্রধানত প্রাণিকোষ"), L2("A bag of digestive enzymes that digests germs entering the cell. The membrane keeps the enzymes away from the cell's own organelles.", "পরিপাককারী উৎসেচকের থলি, যা কোষে ঢোকা জীবাণু হজম করে। ঝিল্লি থাকায় উৎসেচক কোষের নিজের অঙ্গাণুর সংস্পর্শে আসে না।")],
    rib: [L2("Ribosome", "রাইবোজোম"), 0, L2("all living cells", "সব জীবকোষ"), L2("The protein maker: amino acids are joined into polypeptide chains here. Also found inside mitochondria and plastids.", "প্রোটিন তৈরির যন্ত্র: এখানে অ্যামিনো এসিড জুড়ে পলিপেপটাইড চেইন তৈরি হয়। মাইটোকন্ড্রিয়া ও প্লাস্টিডের ভেতরেও থাকে।")],
    cen: [L2("Centrosome", "সেন্ট্রোজোম"), 0, L2("animal cells (rare in lower plants)", "প্রাণিকোষ (নিম্নশ্রেণির উদ্ভিদে কদাচিৎ)"), L2("Two centrioles in a dense centrosphere. During cell division they form aster rays and help build the spindle.", "ঘন সেন্ট্রোস্ফিয়ারের মধ্যে দুটি সেন্ট্রিওল। কোষ বিভাজনের সময় অ্যাস্টার রে তৈরি করে এবং স্পিন্ডল যন্ত্র গঠনে সাহায্য করে।")],
    cyt: [L2("Cytoskeleton", "কোষকঙ্কাল"), 0, L2("plant and animal cells", "উদ্ভিদ ও প্রাণিকোষ"), L2("A net of protein fibres (made of actin, myosin, tubulin) that holds the cell in shape from inside and keeps organelles in place.", "প্রোটিন তন্তুর জাল (অ্যাকটিন, মায়োসিন, টিউবিউলিনে তৈরি), যা ভেতর থেকে কোষের আকৃতি ধরে রাখে এবং অঙ্গাণুকে জায়গামতো রাখে।")]
  };
  const KEYS = Object.keys(O);
  const DECK = [
    ["mit", L2("I release the energy of food by respiration. People call me the power house.", "আমি শ্বসনের মাধ্যমে খাদ্যের শক্তি বের করে আনি। লোকে আমাকে শক্তিঘর বলে।")],
    ["mit", L2("My inner membrane is folded into cristae.", "আমার ভেতরের ঝিল্লি ভাঁজ হয়ে ক্রিস্টি তৈরি করে।")],
    ["chl", L2("I am green, and I make food using sunlight.", "আমি সবুজ, আর সূর্যের আলো দিয়ে খাদ্য তৈরি করি।")],
    ["chl", L2("My grana trap light and my stroma makes sugar.", "আমার গ্রানা আলো ধরে আর স্ট্রোমা শর্করা তৈরি করে।")],
    ["gol", L2("I pack the substances made in the cell and send them out.", "আমি কোষে তৈরি পদার্থ মোড়কজাত করে বাইরে পাঠাই।")],
    ["er", L2("I am a network of channels; proteins are made where ribosomes sit on me.", "আমি নালিকার জাল; আমার গায়ে যেখানে রাইবোজোম বসে, সেখানে প্রোটিন তৈরি হয়।")],
    ["vac", L2("I am the big space filled with cell sap in a plant cell.", "আমি উদ্ভিদকোষের কোষরসে ভরা বড় ফাঁকা জায়গা।")],
    ["lys", L2("My digestive enzymes destroy germs that enter the cell.", "আমার পরিপাককারী উৎসেচক কোষে ঢোকা জীবাণু ধ্বংস করে।")],
    ["rib", L2("I have no membrane, and proteins are made on me. I am in every living cell.", "আমার ঝিল্লি নেই, আর আমার গায়ে প্রোটিন তৈরি হয়। আমি সব জীবকোষে থাকি।")],
    ["cen", L2("My two centrioles form aster rays when an animal cell divides.", "প্রাণিকোষ বিভাজনের সময় আমার দুটি সেন্ট্রিওল অ্যাস্টার রে তৈরি করে।")],
    ["cyt", L2("I am a net of protein fibres that holds the cell's shape from inside.", "আমি প্রোটিন তন্তুর জাল, ভেতর থেকে কোষের আকৃতি ধরে রাখি।")]
  ];
  let mode = "ex", k = "mit", deck = b2shuf(DECK), di = 0, sc = 0, sn = 0, answered = false, opts = [];
  el.innerHTML = `<div class="chipset b2om" role="group"><button data-m="ex" aria-pressed="true">${L2("Explore", "দেখো")}</button><button data-m="who" aria-pressed="false">${L2("Who am I?", "আমি কে?")}</button></div><div id="b2ob" style="margin-top:8px"></div>`;
  const explore = () => {
    const d = O[k];
    $("#b2ob", el).innerHTML = `<div class="chipset b2oc" role="group">${KEYS.map(key => `<button data-k="${key}" aria-pressed="${key === k}">${O[key][0].replace(/ \(ER\)/, "")}</button>`).join("")}</div>
      <div class="svgwrap fit" style="margin-top:6px"><svg viewBox="0 0 360 180" role="img" aria-label="${d[0]}">${arrowDefs("b2oa", "var(--ink)")}${D[k]()}</svg></div>
      <div class="w-out"><b>${d[0]}</b> <span class="muted">(${MEM[d[1]]})</span><br><span class="muted">${L2("Found in: ", "কোথায় থাকে: ")}</span>${d[2]}<br>${d[3]}</div>`;
    b2chips(el, ".b2oc", b => { k = b.dataset.k; explore(); });
  };
  const who = () => {
    if (di >= deck.length) {
      $("#b2ob", el).innerHTML = `<div class="w-out">${L2(`Finished! You got ${sc} of ${sn} right.`, `শেষ! ${b2n(sn)}টির মধ্যে ${b2n(sc)}টি ঠিক হয়েছে।`)}<div class="w-row" style="margin-top:8px"><button class="btn solid" id="b2or">${L2("Play again", "আবার খেলো")}</button></div></div>`;
      $("#b2or", el).addEventListener("click", () => { deck = b2shuf(DECK); di = sc = sn = 0; who(); }); return;
    }
    answered = false; const o = deck[di];
    opts = b2shuf([o[0], ...b2shuf(KEYS.filter(x => x !== o[0])).slice(0, 3)]);
    $("#b2ob", el).innerHTML = `<p class="muted" style="margin:4px 0">${L2(`Clue ${di + 1} of ${deck.length}`, `সূত্র ${b2n(di + 1)}/${b2n(deck.length)}`)}</p>
      <div style="font-size:18px;font-weight:700;margin-bottom:8px">“${o[1]}”</div>
      <div class="w-row">${opts.map(a => `<button class="btn" data-a="${a}">${O[a][0].replace(/ \(ER\)/, "")}</button>`).join("")}</div>
      <div class="w-out" id="b2oo" style="margin-top:10px">${sn ? L2(`Score: ${sc} / ${sn}`, `স্কোর: ${b2n(sc)} / ${b2n(sn)}`) : L2("Which organelle is speaking?", "কোন অঙ্গাণু কথা বলছে?")}</div>`;
    el.querySelectorAll("#b2ob button[data-a]").forEach(b => b.addEventListener("click", () => {
      if (answered) return; answered = true; const right = b.dataset.a === o[0]; sn++; if (right) sc++;
      el.querySelectorAll("#b2ob button[data-a]").forEach(q => { if (q.dataset.a === o[0]) q.classList.add("done"); else if (q === b) q.style.borderColor = "var(--bad)"; });
      $("#b2oo", el).innerHTML = b2ok(right, `<b>${O[o[0]][0]}</b>${L2(". ", "। ")}${O[o[0]][3]}`) + `<br><span class="muted">${L2(`Score: ${sc} / ${sn}`, `স্কোর: ${b2n(sc)} / ${b2n(sn)}`)}</span><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b2on">${L2("Next", "পরেরটি")}</button></div>`;
      $("#b2on", el).addEventListener("click", () => { di++; who(); });
    }));
  };
  b2chips(el, ".b2om", b => { mode = b.dataset.m; mode === "ex" ? explore() : who(); });
  explore();
};

/* 2.2.3 the nucleus, and chromatin condensing into a chromosome */
W.b2nucleus = (el) => {
  const P = {
    nm: [L2("Nuclear membrane", "নিউক্লিয়ার ঝিল্লি"), L2("The two-layered covering of the nucleus, made of lipid and protein. It keeps the contents of the nucleus apart from the cytoplasm and controls what passes in and out.", "নিউক্লিয়াসের দুই স্তরবিশিষ্ট আবরণ; লিপিড ও প্রোটিনে তৈরি। নিউক্লিয়াসের বস্তুকে সাইটোপ্লাজম থেকে আলাদা রাখে এবং কী ঢুকবে-বেরোবে তা নিয়ন্ত্রণ করে।")],
    np: [L2("Nuclear pore", "নিউক্লিয়ার রন্ধ্র"), L2("An opening in the nuclear membrane. Certain substances move through it between the nucleus and the cytoplasm.", "নিউক্লিয়ার ঝিল্লির ছিদ্র। এর ভেতর দিয়ে নিউক্লিয়াস ও সাইটোপ্লাজমের মধ্যে কিছু বস্তু চলাচল করে।")],
    pl: [L2("Nucleoplasm", "নিউক্লিওপ্লাজম"), L2("The jelly-like sap inside the nuclear membrane. It contains nucleic acids, proteins, enzymes and some mineral salts.", "নিউক্লিয়ার ঝিল্লির ভেতরের জেলির মতো রস। এতে নিউক্লিক এসিড, প্রোটিন, উৎসেচক ও কিছু খনিজ লবণ থাকে।")],
    no: [L2("Nucleolus", "নিউক্লিওলাস"), L2("A dense round body made of RNA and protein, attached to a chromosome. It makes ribosomes.", "RNA ও প্রোটিনে তৈরি ঘন গোলাকার বস্তু; ক্রোমোজোমের সাথে লেগে থাকে। এটি রাইবোজোম তৈরি করে।")],
    cr: [L2("Chromatin reticulum", "ক্রোমাটিন জালিকা"), L2("A tangle of fine threads of DNA and protein. It carries the hereditary information. During cell division the threads shorten and thicken into chromosomes.", "DNA ও প্রোটিনের সূক্ষ্ম সুতার জট। এটি বংশগতির তথ্য বহন করে। কোষ বিভাজনের সময় সুতাগুলো খাটো ও মোটা হয়ে ক্রোমোজোমে পরিণত হয়।")]
  };
  const KEYS = ["nm", "np", "pl", "no", "cr"];
  const tangle = "M70 96 q10 -34 30 -10 t26 -16 q22 -6 18 18 t-22 14 q-20 6 -6 22 t30 8 q16 6 -2 20 t-34 -6 q-18 -14 -30 4 t-14 -24 q-8 -16 10 -22 t24 12 q10 12 22 -2 t14 -24 q-4 -14 -22 -8";
  const STEPS = [
    [L2("1. Chromatin", "১. ক্রোমাটিন"), L2("In a cell that is not dividing, the hereditary material is a tangle of very long, thin threads. You cannot count them, just as you cannot count the blades of a spinning fan.", "বিভাজন চলছে না এমন কোষে বংশগতির বস্তু খুব লম্বা, সরু সুতার জট হয়ে থাকে। ঘুরন্ত ফ্যানের ব্লেডের মতো এগুলো গোনা যায় না।")],
    [L2("2. Condensing", "২. ঘন হচ্ছে"), L2("When division begins, each thread coils up and becomes shorter and thicker. Now separate threads can be told apart: these are chromosomes.", "বিভাজন শুরু হলে প্রতিটি সুতা পেঁচিয়ে খাটো ও মোটা হতে থাকে। এখন আলাদা আলাদা সুতা চেনা যায়: এগুলোই ক্রোমোজোম।")],
    [L2("3. Metaphase", "৩. মেটাফেজ"), L2("At metaphase a chromosome is seen best. The DNA was copied before division, so it has two identical chromatids, joined at the centromere.", "মেটাফেজে ক্রোমোজোম সবচেয়ে ভালো দেখা যায়। বিভাজনের আগেই DNA-র প্রতিলিপি হয়েছে, তাই এতে দুটি হুবহু একই ক্রোমাটিড সেন্ট্রোমিয়ারে যুক্ত থাকে।")],
    [L2("4. Anaphase", "৪. অ্যানাফেজ"), L2("The two chromatids separate at the centromere and are pulled to opposite sides. From now on each chromatid counts as one chromosome.", "দুটি ক্রোমাটিড সেন্ট্রোমিয়ার বরাবর আলাদা হয়ে বিপরীত দিকে সরে যায়। এখন থেকে প্রতিটি ক্রোমাটিডকে একটি ক্রোমোজোম ধরা হয়।")]
  ];
  let view = "nuc", sel = null, st = 0;
  const op = key => sel && sel !== key ? 0.25 : 1;
  const nuc = () => `<svg viewBox="0 0 360 214" role="img" aria-label="${L2("nucleus", "নিউক্লিয়াস")}">
    <g data-p="pl" opacity="${op("pl")}"><circle cx="112" cy="108" r="74" fill="var(--c-soft)"/></g>
    <g data-p="cr" opacity="${op("cr")}"><path d="${tangle}" transform="translate(6,2)" fill="none" stroke="var(--bad)" stroke-width="2"/><path d="M52 118 q12 20 30 16 M138 150 q20 -4 26 -22 M92 52 q22 -10 44 2" fill="none" stroke="var(--bad)" stroke-width="2"/></g>
    <g data-p="no" opacity="${op("no")}"><circle cx="132" cy="122" r="17" fill="var(--c)"/></g>
    <g data-p="nm" opacity="${op("nm")}"><circle cx="112" cy="108" r="81" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-dasharray="54 9.6"/><circle cx="112" cy="108" r="74" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="49.33 8.77"/><circle cx="112" cy="108" r="77.5" fill="none" stroke="transparent" stroke-width="12"/></g>
    <g data-p="np" opacity="${op("np")}">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = (54 + 4.8 + i * 63.6) / 81, x = 112 + 77.5 * Math.cos(a), y = 108 + 77.5 * Math.sin(a); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${sel === "np" ? "var(--bad)" : "transparent"}" fill-opacity=".35" stroke="${sel === "np" ? "var(--bad)" : "transparent"}" stroke-width="1.5"/>`; }).join("")}</g>
    <g pointer-events="none">${b2L(138, 31.5, 218, 22, P.nm[0])}${b2L(136, 54, 218, 62, P.cr[0])}${b2L(146, 122, 218, 102, P.no[0])}${b2L(166, 142, 218, 142, P.pl[0])}${b2L(170, 159.5, 218, 182, P.np[0])}</g></svg>`;
  const chromo = () => {
    const circ = `<circle cx="110" cy="100" r="88" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2" stroke-dasharray="${st < 2 ? "none" : "5 5"}"/>`;
    if (st === 0) return `${circ}<path d="${tangle}" transform="translate(-10,-12) scale(1.12)" fill="none" stroke="var(--bad)" stroke-width="1.6"/><path d="${tangle}" transform="translate(212,196) rotate(180) scale(1.05)" fill="none" stroke="var(--bad)" stroke-width="1.6"/>
      ${b2L(150, 74, 222, 44, L2("long, thin chromatin threads", "লম্বা, সরু ক্রোমাটিন সুতা"))}${b2T(222, 110, L2("nucleus of a", "বিভাজন চলছে না"), "start", 13, "var(--muted)")}${b2T(222, 126, L2("non-dividing cell", "এমন কোষের নিউক্লিয়াস"), "start", 13, "var(--muted)")}`;
    if (st === 1) return `${circ}${[[62, 60, 20], [120, 46, -30], [150, 96, 70], [70, 120, -50], [110, 150, 10], [44, 92, 80], [112, 96, -10]].map(([x, y, a]) => `<path d="M-20 0 q8 -12 18 -2 t20 -4" transform="translate(${x},${y}) rotate(${a})" fill="none" stroke="var(--bad)" stroke-width="5" stroke-linecap="round"/>`).join("")}
      ${b2L(160, 92, 222, 50, L2("shorter, thicker threads", "খাটো, মোটা সুতা"))}${b2T(222, 110, L2("separate chromosomes", "আলাদা আলাদা ক্রোমোজোম"), "start", 13, "var(--muted)")}${b2T(222, 126, L2("begin to appear", "দেখা দিতে শুরু করে"), "start", 13, "var(--muted)")}`;
    if (st === 2) return `<g fill="none" stroke="var(--c)" stroke-width="17" stroke-linecap="round"><path d="M116 22 Q134 60 148 100 Q134 140 116 178"/><path d="M196 22 Q178 60 164 100 Q178 140 196 178"/></g>
      <circle cx="156" cy="100" r="8" fill="var(--bad)"/><rect x="133" y="92" width="5" height="16" rx="2" fill="var(--ink)"/><rect x="174" y="92" width="5" height="16" rx="2" fill="var(--ink)"/>
      <path d="M226 24 h8 v70 h-8 M226 106 h8 v70 h-8" fill="none" stroke="var(--muted)" stroke-width="1.5"/>
      ${b2T(240, 63, L2("arm", "বাহু"), "start", 13)}${b2T(240, 145, L2("arm", "বাহু"), "start", 13)}
      ${b2T(116, 200, L2("chromatid", "ক্রোমাটিড"), "middle", 13)}${b2T(196, 200, L2("chromatid", "ক্রোমাটিড"), "middle", 13)}
      ${b2L(160, 100, 272, 100, L2("centromere", "সেন্ট্রোমিয়ার"))}${b2L(133, 100, 86, 100, L2("kinetochore", "কাইনেটোকোর"), "end")}`;
    return `${arrowDefs("b2na", "var(--muted)")}<path d="M96 100 H22 M264 100 H338" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3"/>
      <path d="M70 100 H30" stroke="var(--muted)" stroke-width="2" marker-end="url(#b2na)"/><path d="M290 100 H330" stroke="var(--muted)" stroke-width="2" marker-end="url(#b2na)"/>
      <g fill="none" stroke="var(--c)" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"><path d="M150 50 Q120 76 96 100 Q120 124 150 150"/><path d="M210 50 Q240 76 264 100 Q240 124 210 150"/></g>
      <circle cx="98" cy="100" r="6" fill="var(--bad)"/><circle cx="262" cy="100" r="6" fill="var(--bad)"/>
      ${b2T(120, 178, L2("1 chromosome", "১টি ক্রোমোজোম"), "middle", 13)}${b2T(240, 178, L2("1 chromosome", "১টি ক্রোমোজোম"), "middle", 13)}
      ${b2T(180, 22, L2("spindle fibres pull the chromatids apart", "স্পিন্ডল তন্তু ক্রোমাটিড দুটিকে দূরে টানে"), "middle", 13, "var(--muted)")}`;
  };
  el.innerHTML = `<div class="chipset b2nv" role="group"><button data-v="nuc" aria-pressed="true">${L2("Nucleus", "নিউক্লিয়াস")}</button><button data-v="chr" aria-pressed="false">${L2("Chromosome", "ক্রোমোজোম")}</button></div><div id="b2nb" style="margin-top:8px"></div>`;
  const draw = () => {
    if (view === "nuc") {
      const d = sel ? P[sel] : null;
      $("#b2nb", el).innerHTML = `<div class="svgwrap fit">${nuc()}</div>
        <div class="chipset b2np" role="group" style="margin-top:6px">${KEYS.map(key => `<button data-p="${key}" aria-pressed="${sel === key}">${P[key][0]}</button>`).join("")}</div>
        <div class="w-out" style="margin-top:8px">${d ? `<b>${d[0]}</b><br>${d[1]}` : L2("Tap a part of the nucleus, or a name above.", "নিউক্লিয়াসের কোনো অংশে বা ওপরের কোনো নামে চাপ দাও।")}</div>`;
      b2tap(el, "#b2nb svg g[data-p]", n => { sel = sel === n.dataset.p ? null : n.dataset.p; draw(); });
      el.querySelectorAll(".b2np button").forEach(b => b.addEventListener("click", () => { sel = sel === b.dataset.p ? null : b.dataset.p; draw(); }));
    } else {
      $("#b2nb", el).innerHTML = `<div class="chipset b2ns" role="group">${STEPS.map((s, i) => `<button data-i="${i}" aria-pressed="${i === st}">${s[0]}</button>`).join("")}</div>
        <div class="svgwrap fit" style="margin-top:6px"><svg viewBox="0 0 360 204" role="img" aria-label="${STEPS[st][0]}">${chromo()}</svg></div>
        <div class="w-out">${STEPS[st][1]}</div>
        <div class="w-row" style="margin-top:8px"><button class="btn" id="b2npv" ${st === 0 ? 'disabled style="opacity:.4"' : ""}>${L2("← Back", "← আগে")}</button><button class="btn solid" id="b2nnx" ${st === 3 ? 'disabled style="opacity:.4"' : ""}>${L2("Next →", "পরে →")}</button></div>`;
      b2chips(el, ".b2ns", b => { st = +b.dataset.i; draw(); });
      $("#b2npv", el).addEventListener("click", () => { if (st > 0) { st--; draw(); } });
      $("#b2nnx", el).addEventListener("click", () => { if (st < 3) { st++; draw(); } });
    }
  };
  b2chips(el, ".b2nv", b => { view = b.dataset.v; draw(); });
  draw();
};

/* 2.3.1 plant tissues: pick a tissue from the chart, see its cells */
W.b2ptissue = (el) => {
  const HEX = [[36, 46], [86, 46], [136, 46], [186, 46], [61, 90], [111, 90], [161, 90], [36, 134], [86, 134], [136, 134], [186, 134]];
  const spindle = (x, w, fill) => `<path d="M${x} 12 L${x + w} 44 V146 L${x} 178 L${x - w} 146 V44 Z" fill="${fill}" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/>`;
  const flow = (x, ys, v, c) => ys.map(y => `<circle class="b2f" data-v="${v}" cx="${x}" cy="${y}" r="3.4" fill="${c}"/>`).join("");
  const D = {
    mer: () => `${[0, 1, 2, 3].flatMap(r => [0, 1, 2, 3, 4].map(c => { const x = 14 + c * 37, y = 22 + r * 37; return `<rect x="${x}" y="${y}" width="37" height="37" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.5"/>` + (r === 1 && c === 2 ? `<circle cx="${x + 11}" cy="${y + 18}" r="6" fill="var(--c)"/><circle cx="${x + 26}" cy="${y + 18}" r="6" fill="var(--c)"/><path d="M${x + 18.5} ${y + 3} v31" stroke="var(--ink)" stroke-dasharray="3 2"/>` : `<circle cx="${x + 18.5}" cy="${y + 18.5}" r="9.5" fill="var(--c)"/>`); })).join("")}
      ${b2L(88, 22, 216, 26, L2("thin wall, no gaps between cells", "পাতলা প্রাচীর, কোষের মাঝে ফাঁক নেই"))}${b2L(150, 40, 216, 68, L2("large nucleus", "বড় নিউক্লিয়াস"))}
      ${b2L(114, 78, 216, 104, L2("a cell dividing", "বিভাজনরত কোষ"))}${b2L(176, 142, 216, 142, L2("dense protoplasm", "ঘন প্রোটোপ্লাজম"))}`,
    par: () => `${HEX.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="24" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="${x + 3}" cy="${y + 2}" r="13" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1"/><circle cx="${x - 14}" cy="${y - 10}" r="4.5" fill="var(--c)"/>`).join("")}
      ${b2L(203, 30, 222, 24, L2("thin cellulose wall", "সেলুলোজের পাতলা প্রাচীর"))}${b2L(186, 75, 222, 66, L2("intercellular space", "আন্তঃকোষীয় ফাঁক"))}
      ${b2L(172, 124, 222, 108, L2("nucleus: living cell", "নিউক্লিয়াস: জীবিত কোষ"))}${b2L(192, 138, 222, 150, L2("vacuole", "কোষগহ্বর"))}`,
    col: () => `<defs><clipPath id="b2cc"><rect x="12" y="22" width="198" height="136" rx="10"/></clipPath></defs><g clip-path="url(#b2cc)"><rect x="0" y="0" width="230" height="190" fill="var(--muted)"/>
      ${[[-14, 46], [236, 46], [11, 90], [211, 90], [-14, 134], [236, 134], [61, 2], [111, 2], [161, 2], [11, 2], [211, 2], [61, 178], [111, 178], [161, 178], [11, 178], [211, 178]].concat(HEX).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26.5" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.2"/><circle cx="${x - 8}" cy="${y - 6}" r="4.5" fill="var(--c)"/>`).join("")}</g>
      ${b2L(111, 61, 222, 34, L2("wall thick at the corners", "কোনায় পুরু প্রাচীর"))}${b2T(222, 68, L2("(cellulose + pectin)", "(সেলুলোজ + পেকটিন)"), "start", 13, "var(--muted)")}
      ${b2L(150, 128, 222, 112, L2("living protoplasm", "জীবিত প্রোটোপ্লাজম"))}`,
    scl: () => `<defs><clipPath id="b2sc"><rect x="12" y="22" width="198" height="136" rx="10"/></clipPath></defs><g clip-path="url(#b2sc)"><rect x="0" y="0" width="230" height="190" fill="var(--muted)"/>
      ${[[-14, 46], [236, 46], [11, 90], [211, 90], [-14, 134], [236, 134], [61, 2], [111, 2], [161, 2], [11, 2], [211, 2], [61, 178], [111, 178], [161, 178], [11, 178], [211, 178]].concat(HEX).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26.5" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="18" fill="none" stroke="var(--ink)" stroke-opacity=".35"/><circle cx="${x}" cy="${y}" r="7.5" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/><path d="M${x - 24} ${y} h14 M${x + 10} ${y} h14" stroke="var(--sheet)" stroke-width="1.6"/>`).join("")}</g>
      ${b2L(96, 46, 222, 28, L2("very thick wall with lignin", "লিগনিনযুক্ত খুব পুরু প্রাচীর"))}${b2L(161, 90, 222, 78, L2("empty centre: dead, no protoplasm", "ফাঁকা কেন্দ্র: মৃত, প্রোটোপ্লাজম নেই"))}${b2L(175, 134, 222, 134, L2("pit", "কূপ"))}`,
    xyl: () => `<rect x="18" y="8" width="46" height="174" fill="var(--sheet)" stroke="var(--ink)" stroke-width="3"/><path d="M18 8 h46 M18 182 h46" stroke="var(--sheet)" stroke-width="4"/>
      <path d="M18 64 h7 M57 64 h7 M18 124 h7 M57 124 h7" stroke="var(--ink)" stroke-width="3"/>
      ${[14, 34, 54, 74, 94, 114, 134, 154].map(y => `<path d="M21 ${y + 18} L61 ${y}" stroke="var(--muted)" stroke-width="2.4"/>`).join("")}
      ${spindle(93, 13, "var(--sheet)")}${b2dots([[86, 60], [100, 60], [86, 84], [100, 84], [86, 108], [100, 108], [86, 132], [100, 132]], 2.6, "var(--muted)")}
      ${[0, 1, 2, 3].map(i => `<rect x="122" y="${22 + i * 37}" width="28" height="37" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="136" cy="${40 + i * 37}" r="5" fill="var(--c)"/>`).join("")}
      ${spindle(176, 8, "var(--muted)")}<path d="M176 30 V160" stroke="var(--sheet)" stroke-width="2"/>
      ${flow(41, [20, 62, 104, 146], -34, "var(--c)")}${flow(93, [40, 110, 160], -26, "var(--c)")}
      ${b2L(60, 34, 216, 22, L2("vessel: one long open pipe", "ভেসেল: লম্বা খোলা নল"))}${b2L(104, 70, 216, 62, L2("tracheid", "ট্রাকিড"))}
      ${b2L(148, 100, 216, 96, L2("xylem parenchyma (living)", "জাইলেম প্যারেনকাইমা (জীবিত)"))}${b2L(183, 130, 216, 134, L2("xylem fibre", "জাইলেম ফাইবার"))}
      ${b2T(214, 174, L2("↑ water + minerals", "↑ পানি ও খনিজ লবণ"), "start", 13, "var(--c)", 700)}`,
    phl: () => `<rect x="20" y="8" width="46" height="174" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.8"/><rect x="26" y="8" width="34" height="174" fill="var(--sheet)"/>
      ${[8, 66, 124, 182].map(y => `<path d="M20 ${y} h46" stroke="var(--ink)" stroke-width="4.5" stroke-dasharray="5 3.2"/>`).join("")}
      ${[0, 1, 2].map(i => `<rect x="66" y="${12 + i * 58}" width="19" height="50" fill="var(--c)" fill-opacity=".35" stroke="var(--ink)" stroke-width="1.5"/><ellipse cx="75.5" cy="${37 + i * 58}" rx="5.5" ry="10" fill="var(--ink)" fill-opacity=".75"/>`).join("")}
      ${[0, 1, 2, 3].map(i => `<rect x="104" y="${22 + i * 37}" width="28" height="37" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="118" cy="${40 + i * 37}" r="5" fill="var(--c)"/>`).join("")}
      ${spindle(160, 8, "var(--muted)")}<path d="M160 30 V160" stroke="var(--sheet)" stroke-width="2"/>
      ${flow(36, [30, 90, 150], -24, "var(--note)")}${flow(50, [50, 110, 170], 24, "var(--note)")}
      ${b2L(48, 28, 214, 15, L2("sieve tube: living, no nucleus", "সিভনল: জীবিত, নিউক্লিয়াস নেই"))}${b2L(62, 66, 214, 49, L2("sieve plate", "সিভপ্লেট"))}
      ${b2L(78, 92, 214, 78, L2("companion cell: large nucleus", "সঙ্গীকোষ: বড় নিউক্লিয়াস"))}${b2L(130, 116, 214, 113, L2("phloem parenchyma", "ফ্লোয়েম প্যারেনকাইমা"), "start", 12)}${b2L(167, 140, 214, 147, L2("phloem (bast) fibre", "ফ্লোয়েম (বাস্ট) ফাইবার"), "start", 12)}
      ${b2T(214, 186, L2("↑↓ prepared food", "↑↓ প্রস্তুত খাদ্য"), "start", 13, "var(--note)", 700)}`
  };
  const LIVE = [L2("living", "জীবিত"), L2("dead when mature", "পরিণত অবস্থায় মৃত"), L2("living and dead cells together", "জীবিত ও মৃত কোষ একসাথে")];
  const T = {
    mer: [L2("Meristematic tissue", "ভাজক টিস্যু"), 0, L2("Cells can divide. Found at growing points such as root tips and shoot tips; every new cell of the plant comes from here.", "কোষ বিভাজিত হতে পারে। মূল ও কাণ্ডের আগার মতো বর্ধনশীল অংশে থাকে; উদ্ভিদের প্রতিটি নতুন কোষ এখান থেকে আসে।")],
    par: [L2("Parenchyma", "প্যারেনকাইমা"), 0, L2("Found in almost every part of the plant. Forms the body, and makes, stores and transports food. With chloroplasts it is chlorenchyma; with large air chambers (water plants) it is aerenchyma.", "উদ্ভিদের প্রায় সব অংশে থাকে। দেহ গঠন করে এবং খাদ্য তৈরি, সঞ্চয় ও পরিবহণ করে। ক্লোরোপ্লাস্ট থাকলে ক্লোরেনকাইমা; বড় বায়ুকুঠুরি থাকলে (জলজ উদ্ভিদে) অ্যারেনকাইমা।")],
    col: [L2("Collenchyma", "কোলেনকাইমা"), 0, L2("Gives strength while staying flexible. Found in leaf veins, leaf stalks and tender stems such as gourd. Makes food if it has chloroplasts.", "নমনীয় থেকেই দৃঢ়তা দেয়। পাতার শিরা, পত্রবৃন্ত এবং কুমড়ার মতো নরম কাণ্ডে থাকে। ক্লোরোপ্লাস্ট থাকলে খাদ্য তৈরি করে।")],
    scl: [L2("Sclerenchyma", "স্ক্লেরেনকাইমা"), 1, L2("Gives mechanical strength. Two kinds of cell: long fibres (such as jute fibre) and short stone cells or sclereids (as in coconut shell).", "যান্ত্রিক শক্তি দেয়। কোষ দুই রকম: লম্বা ফাইবার (যেমন পাটের আঁশ) এবং খাটো স্টোন সেল বা স্ক্লেরাইড (যেমন নারকেলের খোলে)।")],
    xyl: [L2("Xylem", "জাইলেম"), 2, L2("Carries water and mineral salts upwards from the roots and strengthens the plant. Four kinds of cell; only xylem parenchyma is living.", "মূল থেকে পানি ও খনিজ লবণ ওপরে বহন করে এবং উদ্ভিদকে দৃঢ়তা দেয়। চার ধরনের কোষ; শুধু জাইলেম প্যারেনকাইমা জীবিত।")],
    phl: [L2("Phloem", "ফ্লোয়েম"), 2, L2("Carries food made in the leaves to all parts, up and down. Four kinds of cell; only the phloem fibre is dead.", "পাতায় তৈরি খাদ্য ওপরে-নিচে সব অংশে পৌঁছে দেয়। চার ধরনের কোষ; শুধু ফ্লোয়েম ফাইবার মৃত।")]
  };
  let k = "par", dots = [];
  const btn = key => `<button data-k="${key}" aria-pressed="${key === k}">${T[key][0]}</button>`;
  const box = "border:1px solid var(--rule);border-radius:10px;padding:8px 10px;background:var(--paper)";
  el.innerHTML = `<div id="b2pc"></div><div id="b2pb"></div>`;
  const draw = () => {
    $("#b2pc", el).innerHTML = `<div style="display:grid;gap:8px"><div style="${box}"><div class="chipset b2pk">${btn("mer")}</div><span class="hint">${L2("cells can divide", "কোষ বিভাজিত হতে পারে")}</span></div>
      <div style="${box}"><b>${L2("Permanent tissue", "স্থায়ী টিস্যু")}</b> <span class="hint">${L2("cells cannot divide", "কোষ বিভাজিত হতে পারে না")}</span>
        <div style="margin-top:6px"><span class="muted">${L2("Simple: one kind of cell", "সরল: এক রকম কোষ")}</span><div class="chipset b2pk" style="margin-top:4px">${btn("par")}${btn("col")}${btn("scl")}</div></div>
        <div style="margin-top:8px"><span class="muted">${L2("Complex: several kinds of cell", "জটিল: কয়েক রকম কোষ")}</span><div class="chipset b2pk" style="margin-top:4px">${btn("xyl")}${btn("phl")}</div></div></div></div>`;
    const d = T[k];
    $("#b2pb", el).innerHTML = `<div class="svgwrap fit" style="margin-top:8px"><svg viewBox="0 0 360 190" role="img" aria-label="${d[0]}">${D[k]()}</svg></div>
      <div class="w-out"><b>${d[0]}</b> <span class="muted">(${k === "xyl" || k === "phl" ? L2("lengthwise section", "লম্বচ্ছেদ") : L2("cross-section", "প্রস্থচ্ছেদ")})</span><br><span style="color:var(--c);font-weight:600">${L2("Cells: ", "কোষ: ")}${LIVE[d[1]]}</span><br>${d[2]}</div>`;
    dots = [...el.querySelectorAll("#b2pb .b2f")];
    el.querySelectorAll(".b2pk button").forEach(b => b.addEventListener("click", () => { k = b.dataset.k; draw(); }));
  };
  draw();
  if (!REDUCED) animate(el, dt => dots.forEach(c => { let y = +c.getAttribute("cy") + (+c.dataset.v) * dt; if (y < 14) y += 164; if (y > 178) y -= 164; c.setAttribute("cy", y.toFixed(1)); }));
};

/* 2.3.2 animal tissues: four types and their kinds */
W.b2atissue = (el) => {
  const bm = (y = 114) => `<path d="M14 ${y} H346" stroke="var(--note)" stroke-width="4" stroke-linecap="round"/>`;
  const BML = L2("basement membrane", "ভিত্তিপর্দা");
  const cellR = (x, y, w, h, nx, ny, rx, ry) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.4"/><ellipse cx="${nx}" cy="${ny}" rx="${rx}" ry="${ry}" fill="var(--c)"/>`;
  const stripes = (x1, x2, y, h, step = 7) => { let d = ""; for (let x = x1 + step; x < x2; x += step) d += `M${x} ${y + 1.5}v${h - 3}`; return `<path d="${d}" stroke="var(--bad)" stroke-opacity=".55" stroke-width="1.5"/>`; };
  const band = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="var(--bad)" fill-opacity=".16" stroke="var(--ink)" stroke-width="1.5"/>`;
  const nucl = (x, y, rx = 9, ry = 4) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="var(--ink)" fill-opacity=".75"/>`;
  const D = {
    sq: () => `${[0, 1, 2, 3, 4].map(i => { const x = 20 + i * 64; return `<path d="M${x} 112 C${x + 14} 108 ${x + 20} 92 ${x + 32} 92 C${x + 44} 92 ${x + 50} 108 ${x + 64} 112 Z" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.4"/><ellipse cx="${x + 32}" cy="${103}" rx="10" ry="5" fill="var(--c)"/>`; }).join("")}${bm()}
      ${b2L(60, 106, 46, 160, L2("flat cell", "চ্যাপ্টা কোষ"), "middle")}${b2L(180, 104, 150, 160, L2("large nucleus", "বড় নিউক্লিয়াস"), "middle")}${b2L(282, 114, 282, 160, BML, "middle")}`,
    cu: () => `${[0, 1, 2, 3, 4, 5, 6, 7].map(i => cellR(20 + i * 40, 72, 40, 40, 40 + i * 40, 92, 10, 10)).join("")}${bm()}
      ${b2L(48, 104, 62, 160, L2("cube-shaped cell", "ঘনাকার কোষ"), "middle")}${b2L(180, 96, 172, 160, L2("nucleus", "নিউক্লিয়াস"), "middle")}${b2L(282, 114, 282, 160, BML, "middle")}`,
    co: () => `${Array.from({ length: 13 }, (_, i) => cellR(24 + i * 24, 38, 24, 74, 36 + i * 24, 92, 7, 11)).join("")}${bm()}
      ${b2L(60, 60, 60, 160, L2("tall cell", "লম্বা কোষ"), "middle")}${b2L(180, 96, 168, 160, L2("nucleus", "নিউক্লিয়াস"), "middle")}${b2L(282, 114, 282, 160, BML, "middle")}`,
    st: () => `<defs><clipPath id="b2as"><rect x="20" y="30" width="320" height="84"/></clipPath></defs><g clip-path="url(#b2as)">
      ${Array.from({ length: 7 }, (_, i) => cellR(-7 + i * 54, 40, 54, 11, 20 + i * 54, 45.5, 7, 2.6)).join("")}
      ${Array.from({ length: 9 }, (_, i) => cellR(10 + i * 40, 51, 40, 16, 30 + i * 40, 59, 6, 4)).join("")}
      ${Array.from({ length: 11 }, (_, i) => cellR(4 + i * 32, 67, 32, 21, 20 + i * 32, 77.5, 5.5, 5.5)).join("")}
      ${Array.from({ length: 10 }, (_, i) => cellR(20 + i * 32, 88, 32, 24, 36 + i * 32, 100, 6, 7)).join("")}</g>${bm()}
      ${b2L(48, 45, 64, 160, L2("flat cells on top", "ওপরে চ্যাপ্টা কোষ"), "middle")}${b2L(180, 100, 180, 160, L2("many layers", "অনেক স্তর"), "middle")}${b2L(282, 114, 282, 160, BML, "middle")}`,
    ps: () => `<defs><clipPath id="b2ap"><rect x="20" y="24" width="320" height="90"/></clipPath></defs><g clip-path="url(#b2ap)">
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const x = 20 + i * 40; return `<path d="M${x - 4} 40 H${x + 32} L${x + 20} 112 H${x + 8} Z" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.4"/><ellipse cx="${x + 14}" cy="62" rx="6" ry="9" fill="var(--c)"/>
        <path d="M${x + 20} 112 H${x + 48} L${x + 38} 62 H${x + 30} Z" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.4"/><ellipse cx="${x + 34}" cy="95" rx="5.5" ry="8" fill="var(--c)"/>
        <path d="M${x + 2} 40 v-9 M${x + 10} 40 v-10 M${x + 18} 40 v-9 M${x + 26} 40 v-10" stroke="var(--ink)" stroke-width="1.3"/>`; }).join("")}</g>${bm()}
      ${b2L(292, 32, 292, 12, L2("cilia", "সিলিয়া"), "middle")}${b2L(74, 62, 100, 160, L2("one layer, but nuclei at different heights", "এক স্তর, তবে নিউক্লিয়াস ভিন্ন ভিন্ন উচ্চতায়"), "middle")}${b2L(282, 114, 282, 160, BML, "middle")}`,
    fi: () => `<rect x="14" y="14" width="332" height="122" rx="10" fill="var(--c-soft)" fill-opacity=".6"/>
      <path d="M14 42 q40 -22 80 0 t80 0 t80 0 t92 -4 M14 78 q46 20 92 0 t92 0 t92 0 t56 4 M14 114 q40 -18 80 0 t80 0 t80 0 t92 -8" fill="none" stroke="var(--note)" stroke-width="6" stroke-linecap="round"/>
      <path d="M22 130 L120 22 M100 134 L224 30 M196 20 L338 118 M64 18 L150 132 M260 134 L330 24" stroke="var(--ink)" stroke-width="1.2"/>
      ${[[72, 60, -20], [236, 122, 8], [272, 56, 30], [150, 96, 12]].map(([x, y, a]) => `<g transform="translate(${x},${y}) rotate(${a})"><path d="M-17 0 q17 -10 34 0 q-17 10 -34 0 Z" fill="var(--c)"/><circle r="3" fill="var(--ink)"/></g>`).join("")}
      ${b2L(48, 113, 52, 164, L2("collagen fibre", "কোলাজেন তন্তু"), "middle")}${b2L(112, 124, 160, 164, L2("elastic fibre", "স্থিতিস্থাপক তন্তু"), "middle")}${b2L(236, 126, 240, 164, L2("cell", "কোষ"), "middle")}${b2L(316, 130, 312, 164, L2("matrix", "মাতৃকা"), "middle")}`,
    ca: () => `<rect x="14" y="14" width="332" height="122" rx="10" fill="var(--c-soft)"/>
      ${[[60, 48, 2], [134, 40, 1], [206, 60, 2], [284, 42, 1], [92, 102, 1], [170, 108, 2], [250, 104, 1], [318, 94, 1]].map(([x, y, n]) => `<ellipse cx="${x}" cy="${y}" rx="${n === 2 ? 23 : 16}" ry="14" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.5"/>` + (n === 2 ? `<circle cx="${x - 9}" cy="${y}" r="7.5" fill="var(--c)"/><circle cx="${x + 9}" cy="${y}" r="7.5" fill="var(--c)"/>` : `<circle cx="${x}" cy="${y}" r="8" fill="var(--c)"/>`)).join("")}
      ${b2L(92, 104, 70, 164, L2("cartilage cell", "কোমলাস্থি কোষ"), "middle")}${b2L(188, 118, 184, 164, L2("lacuna (space)", "ল্যাকুনা (গহ্বর)"), "middle")}${b2L(300, 128, 292, 164, L2("elastic matrix", "স্থিতিস্থাপক মাতৃকা"), "middle")}`,
    bo: () => `<rect x="14" y="10" width="332" height="128" rx="10" fill="var(--note)" fill-opacity=".2"/>
      ${[[108, 74], [252, 74]].map(([cx, cy]) => `${[22, 36, 50].map(r => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--muted)" stroke-width="1.4"/>`).join("")}<circle cx="${cx}" cy="${cy}" r="9" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.6"/>
        ${[[22, 80], [22, 200], [22, 320], [36, 20], [36, 140], [36, 260], [50, 50], [50, 170], [50, 290]].map(([r, a]) => { const t = a * Math.PI / 180, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="2.6" transform="rotate(${a + 90} ${x.toFixed(1)} ${y.toFixed(1)})" fill="var(--ink)"/>`; }).join("")}`).join("")}
      ${b2L(108, 78, 64, 164, L2("central canal", "কেন্দ্রীয় নালি"), "middle")}${b2L(140.1, 112.3, 168, 164, L2("bone cell", "অস্থিকোষ"), "middle")}${b2L(322, 126, 290, 164, L2("hard matrix with calcium", "ক্যালসিয়ামযুক্ত শক্ত মাতৃকা"), "middle", 14)}`,
    bl: () => `<rect x="14" y="10" width="332" height="128" rx="10" fill="var(--note)" fill-opacity=".16"/>
      ${[[44, 40], [86, 100], [56, 110], [150, 36], [180, 108], [206, 62], [228, 26], [300, 40], [316, 84], [280, 118], [96, 52], [336, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="var(--bad)" fill-opacity=".7"/><circle cx="${x}" cy="${y}" r="5" fill="var(--sheet)" fill-opacity=".45"/>`).join("")}
      ${[[130, 82], [258, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="${x - 6}" cy="${y - 4}" r="6.5" fill="var(--c)"/><circle cx="${x + 5}" cy="${y - 5}" r="6" fill="var(--c)"/><circle cx="${x + 1}" cy="${y + 6}" r="6.5" fill="var(--c)"/>`).join("")}
      ${[[30, 76], [72, 26], [118, 120], [176, 70], [236, 122], [240, 52], [296, 66], [330, 20], [200, 24], [148, 126]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="2.6" transform="rotate(${i * 40} ${x} ${y})" fill="var(--note)" stroke="var(--ink)" stroke-width=".6"/>`).join("")}
      ${b2L(56, 114, 58, 164, L2("red blood cell", "লোহিত রক্তকোষ"), "middle")}${b2L(134, 94, 162, 164, L2("white blood cell", "শ্বেত রক্তকোষ"), "middle")}${b2L(236, 123, 248, 164, L2("platelet", "অণুচক্রিকা"), "middle")}${b2L(312, 130, 318, 164, L2("plasma", "রক্তরস"), "middle")}`,
    vo: () => `${[24, 66, 108].map((y, i) => band(14, y, 216, 30) + stripes(14, 230, y, 30) + [[50, 5], [120, 25], [190, 5]].map(([x, d]) => nucl(x + i * 12, y + d)).join("")).join("")}
      ${b2L(96, 39, 244, 26, L2("cross stripes", "আড়াআড়ি ডোরা"))}${b2L(132, 91, 244, 76, L2("several nuclei, at the edge", "একাধিক নিউক্লিয়াস, কিনারায়"))}${b2L(226, 123, 244, 130, L2("unbranched fibre", "শাখাবিহীন তন্তু"), "start", 12)}`,
    iv: () => `<defs><clipPath id="b2ai"><rect x="12" y="18" width="220" height="138" rx="6"/></clipPath></defs><g clip-path="url(#b2ai)">
      ${[[36, [14, 118]], [62, [-38, 66, 170]], [88, [14, 118]], [114, [-38, 66, 170]], [140, [14, 118]]].flatMap(([y, xs]) => xs.map(x => `<path d="M${x} ${y} q52 -14 104 0 q-52 14 -104 0 Z" fill="var(--bad)" fill-opacity=".16" stroke="var(--ink)" stroke-width="1.3"/>${nucl(x + 52, y, 9, 3.6)}`)).join("")}</g>
      ${b2L(196, 37, 244, 28, L2("spindle-shaped cell", "মাকু আকৃতির কোষ"))}${b2L(170, 88, 244, 82, L2("one nucleus in the middle", "মাঝখানে একটি নিউক্লিয়াস"))}${b2L(210, 114, 244, 136, L2("no stripes", "ডোরা নেই"))}`,
    cd: () => `${band(14, 22, 216, 26)}${band(14, 70, 216, 26)}${band(14, 118, 216, 26)}
      <path d="M80 47 H112 L142 71 H110 Z M160 95 H192 L152 119 H120 Z" fill="var(--bad)" fill-opacity=".16" stroke="var(--ink)" stroke-width="1.5"/>
      ${stripes(14, 230, 22, 26)}${stripes(14, 230, 70, 26)}${stripes(14, 230, 118, 26)}
      <path d="M60 22 v26 M150 22 v26 M44 70 v26 M100 70 v26 M190 70 v26 M80 118 v26 M170 118 v26" stroke="var(--ink)" stroke-width="3.6"/>
      ${[[36, 35], [104, 35], [192, 35], [72, 83], [146, 83], [212, 83], [46, 131], [126, 131], [200, 131]].map(([x, y]) => nucl(x, y, 8, 4.5)).join("")}
      ${b2L(150, 30, 244, 24, L2("intercalated disc", "ইন্টারক্যালাটেড ডিস্ক"), "start", 12)}${b2L(128, 59, 244, 64, L2("branch", "শাখা"))}${b2L(212, 83, 244, 98, L2("nucleus in the centre", "মাঝখানে নিউক্লিয়াস"), "start", 12)}${b2L(214, 138, 244, 142, L2("cross stripes", "আড়াআড়ি ডোরা"))}`,
    ne: () => `${arrowDefs("b2ta", "var(--bad)")}<g fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round">
      <path d="M56 70 L30 44 M38 52 L20 56 M40 54 L42 32 M52 92 L20 108 M32 102 L24 124 M34 101 L12 94 M72 62 L78 30 M76 40 L92 26 M75 46 L62 28 M66 106 L56 138 M60 124 L42 132 M59 130 L68 148"/>
      <path d="M92 86 H262" stroke-width="4.5"/><path d="M262 86 L288 66 M262 86 H290 M262 86 L288 106"/></g>
      <circle cx="72" cy="84" r="23" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2.2"/><circle cx="72" cy="84" r="8.5" fill="var(--c)"/>
      ${b2dots([[290, 65], [293, 86], [290, 107]], 4.6)}
      <g fill="none" stroke="var(--muted)" stroke-width="2.4" stroke-linecap="round"><path d="M336 76 L304 64 M336 86 H306 M338 96 L304 108"/></g><circle cx="358" cy="86" r="24" fill="var(--c-soft)" stroke="var(--muted)" stroke-width="2"/>
      <path d="M120 70 H226" stroke="var(--bad)" stroke-width="2" marker-end="url(#b2ta)"/>${b2T(176, 62, L2("direction of the message", "বার্তার দিক"), "middle", 13, "var(--bad)")}
      <circle id="b2pulse" cx="96" cy="86" r="5" fill="var(--bad)"/>
      ${b2L(42, 33, 52, 12, L2("dendrites", "ডেনড্রাইট"), "middle")}${b2L(80, 100, 122, 160, L2("cell body with nucleus", "নিউক্লিয়াসসহ কোষদেহ"), "middle")}${b2L(200, 87, 212, 132, L2("axon (only one)", "অ্যাক্সন (একটিই)"), "middle")}${b2L(298, 86, 300, 160, L2("synapse", "সিন্যাপস"), "middle")}
      ${b2T(356, 50, L2("next neuron", "পরের নিউরন"), "end", 13, "var(--muted)")}`
  };
  const TY = {
    epi: [L2("Epithelial", "আবরণী"), L2("Covers and lines. Cells sit close together on a basement membrane, with almost no matrix.", "ঢেকে রাখে ও আস্তরণ তৈরি করে। কোষগুলো ভিত্তিপর্দার ওপর গা ঘেঁষে থাকে, মাতৃকা প্রায় নেই।"), ["sq", "cu", "co", "st", "ps"]],
    con: [L2("Connective", "যোজক"), L2("Joins, supports and transports. Much matrix, few cells.", "জোড়া লাগায়, অবলম্বন দেয় ও পরিবহণ করে। মাতৃকা বেশি, কোষ কম।"), ["fi", "ca", "bo", "bl"]],
    mus: [L2("Muscle", "পেশি"), L2("Contracts and relaxes to cause movement. Long, fibre-like cells; almost no matrix.", "সংকুচিত ও প্রসারিত হয়ে নড়াচড়া ঘটায়। লম্বা, তন্তুর মতো কোষ; মাতৃকা প্রায় নেই।"), ["vo", "iv", "cd"]],
    ner: [L2("Nervous", "স্নায়ু"), L2("Receives stimuli and carries messages. Made of neurons.", "উদ্দীপনা গ্রহণ করে ও বার্তা বহন করে। নিউরন দিয়ে গঠিত।"), ["ne"]]
  };
  const S = {
    sq: [L2("Squamous", "স্কোয়ামাস"), L2("Bowman's capsule of the kidney", "বৃক্কের বোম্যান্স ক্যাপসুলের প্রাচীর"), L2("Flat like fish scales. Covers, and also works as a filter.", "মাছের আঁশের মতো চ্যাপ্টা। আবরণ দেয়, ছাঁকনির কাজও করে।")],
    cu: [L2("Cuboidal", "কিউবয়ডাল"), L2("collecting tubules of the kidney", "বৃক্কের সংগ্রাহক নালিকা"), L2("Cube-shaped: length, width and height nearly equal. Absorbs and covers.", "ঘনকের মতো: দৈর্ঘ্য, প্রস্থ ও উচ্চতা প্রায় সমান। পরিশোষণ করে ও আবরণ দেয়।")],
    co: [L2("Columnar", "কলামনার"), L2("inner lining of the intestine", "অন্ত্রের অন্তঃপ্রাচীর"), L2("Tall and narrow like pillars. Secretes, protects and absorbs.", "স্তম্ভের মতো সরু ও লম্বা। ক্ষরণ, রক্ষণ ও শোষণ করে।")],
    st: [L2("Stratified", "স্ট্র্যাটিফাইড"), L2("skin of vertebrates", "মেরুদণ্ডী প্রাণীর ত্বক"), L2("Cells arranged in several layers on the basement membrane. Good protection against wear.", "ভিত্তিপর্দার ওপর কোষ একাধিক স্তরে সাজানো। ঘষা ও আঘাত থেকে ভালো সুরক্ষা দেয়।")],
    ps: [L2("Pseudostratified", "সিউডোস্ট্র্যাটিফাইড"), L2("trachea (windpipe)", "ট্রাকিয়া (শ্বাসনালি)"), L2("A single layer: every cell touches the basement membrane. The cells differ in height, so it only looks layered. In the trachea it carries cilia.", "একটিই স্তর: প্রতিটি কোষ ভিত্তিপর্দা ছুঁয়ে থাকে। কোষগুলোর উচ্চতা আলাদা, তাই শুধু দেখতে স্তরীভূত মনে হয়। শ্বাসনালিতে এতে সিলিয়া থাকে।")],
    fi: [L2("Fibrous", "ফাইব্রাস"), L2("under the skin and among the muscles", "ত্বকের নিচে ও পেশির মধ্যে"), L2("The matrix is full of fibres of different kinds, with a few cells scattered in it. It binds parts together.", "মাতৃকায় নানা ধরনের তন্তুর আধিক্য, মাঝে অল্প কিছু কোষ ছড়ানো। এটি বিভিন্ন অংশকে বেঁধে রাখে।")],
    ca: [L2("Cartilage", "কোমলাস্থি"), L2("nose, outer ear, ends of bones", "নাক, কানের পিনা, অস্থির প্রান্ত"), L2("Flexible skeletal tissue with a firm, elastic matrix. At the ends of bones it prevents rubbing.", "নমনীয় স্কেলিটাল টিস্যু; মাতৃকা দৃঢ় ও স্থিতিস্থাপক। অস্থির প্রান্তে থেকে ঘর্ষণ ঠেকায়।")],
    bo: [L2("Bone", "অস্থি"), L2("the skeleton", "কঙ্কাল"), L2("Hard, rigid skeletal tissue: calcium salts are deposited in its matrix. Gives shape, protects soft organs and makes blood cells.", "শক্ত, অনমনীয় স্কেলিটাল টিস্যু: মাতৃকায় ক্যালসিয়াম-জাতীয় পদার্থ জমা থাকে। দেহকে আকৃতি দেয়, নরম অঙ্গ রক্ষা করে এবং রক্তকণিকা উৎপাদন করে।")],
    bl: [L2("Blood", "রক্ত"), L2("arteries, veins and capillaries", "ধমনি, শিরা ও কৈশিকনালি"), L2("Fluid connective tissue: plasma 55%, cells 45%. Red cells carry oxygen, white cells destroy germs, platelets help clotting.", "তরল যোজক টিস্যু: রক্তরস ৫৫%, রক্তকোষ ৪৫%। লোহিত কোষ অক্সিজেন বহন করে, শ্বেত কোষ জীবাণু ধ্বংস করে, অণুচক্রিকা রক্ত জমাট বাঁধায়।")],
    vo: [L2("Voluntary", "ঐচ্ছিক"), L2("attached to bones: arms, legs", "অস্থির সাথে: হাত, পা"), L2("Striated, unbranched, with several nuclei. Works at our will and contracts quickly. Also called skeletal muscle.", "ডোরাকাটা, শাখাবিহীন, একাধিক নিউক্লিয়াস। আমাদের ইচ্ছামতো কাজ করে ও দ্রুত সংকুচিত হয়। একে কঙ্কাল পেশিও বলে।")],
    iv: [L2("Involuntary", "অনৈচ্ছিক"), L2("walls of the alimentary canal and blood vessels", "পৌষ্টিকনালি ও রক্তনালির প্রাচীর"), L2("Smooth (no stripes), spindle-shaped cells. Not under our will; moves internal organs, as in peristalsis.", "মসৃণ (ডোরা নেই), মাকু আকৃতির কোষ। ইচ্ছাধীন নয়; অভ্যন্তরীণ অঙ্গের সঞ্চালন ঘটায়, যেমন ক্রমসংকোচন।")],
    cd: [L2("Cardiac", "হৃৎপেশি"), L2("only in the heart", "শুধু হৃৎপিণ্ডে"), L2("Striated and branched, with intercalated discs. Looks like voluntary muscle but works involuntarily, beating in rhythm for life.", "ডোরাযুক্ত ও শাখান্বিত, ইন্টারক্যালাটেড ডিস্ক আছে। গঠনে ঐচ্ছিক পেশির মতো, কিন্তু কাজে অনৈচ্ছিক; সারা জীবন ছন্দে ছন্দে স্পন্দিত হয়।")],
    ne: [L2("Neuron", "নিউরন"), L2("brain, spinal cord and nerves", "মস্তিষ্ক, মেরুরজ্জু ও স্নায়ু"), L2("Dendrites bring the message in, the cell body receives it, and the single axon carries it to the next neuron across a synapse. Neurons cannot divide.", "ডেনড্রাইট বার্তা আনে, কোষদেহ তা গ্রহণ করে, আর একটিমাত্র অ্যাক্সন সিন্যাপস পেরিয়ে তা পরের নিউরনে পৌঁছে দেয়। নিউরন বিভাজিত হতে পারে না।")]
  };
  const VB = { sq: [70, 184], cu: [52, 184], co: [22, 184], st: [24, 184], vo: [10, 152], iv: [10, 164], cd: [8, 158], fi: [4, 184], ca: [4, 184], bo: [2, 184], bl: [2, 184] };   /* crop empty margins of the shorter drawings */
  let t = "epi", k = "sq", pulse = null, px = 96;
  el.innerHTML = `<div class="chipset b2at" role="group">${Object.keys(TY).map(key => `<button data-t="${key}" aria-pressed="${key === t}">${TY[key][0]}</button>`).join("")}</div><div id="b2ab" style="margin-top:8px"></div>`;
  const draw = () => {
    const d = S[k];
    $("#b2ab", el).innerHTML = `<p class="hint" style="margin:0 0 6px"><b>${TY[t][0]}${L2(" tissue", " টিস্যু")}:</b> ${TY[t][1]}</p>
      ${TY[t][2].length > 1 ? `<div class="chipset b2ak" role="group">${TY[t][2].map(key => `<button data-k="${key}" aria-pressed="${key === k}">${S[key][0]}</button>`).join("")}</div>` : ""}
      <div class="svgwrap fit" style="margin-top:6px"><svg viewBox="0 ${(VB[k] || [0, 184])[0]} 360 ${(VB[k] || [0, 184])[1] - (VB[k] || [0, 184])[0]}" role="img" aria-label="${d[0]}">${D[k]()}</svg></div>
      <div class="w-out"><b>${d[0]}</b><br><span class="muted">${L2("Where: ", "কোথায়: ")}</span>${d[1]}<br>${d[2]}</div>`;
    pulse = $("#b2pulse", el); px = 96;
    b2chips(el, ".b2ak", b => { k = b.dataset.k; draw(); });
  };
  b2chips(el, ".b2at", b => { t = b.dataset.t; k = TY[t][2][0]; draw(); });
  draw();
  if (!REDUCED) animate(el, dt => { if (!pulse || !pulse.isConnected) return; px += 90 * dt; if (px > 330) px = 96; const x = px > 292 ? 304 + (px - 292) * 0.8 : px; pulse.setAttribute("cx", x.toFixed(1)); pulse.setAttribute("opacity", px > 292 ? 0.5 : 1); });
};

/* 2.4 levels of organisation, and "which system?" */
W.b2levels = (el) => {
  const ICON = [
    `<circle cx="17" cy="17" r="13" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.6"/><circle cx="19" cy="18" r="4.5" fill="var(--c)"/>`,
    `${[[3, 5], [14, 5], [25, 5], [3, 18], [14, 18], [25, 18]].map(([x, y]) => `<rect x="${x}" y="${y}" width="11" height="13" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.2"/><circle cx="${x + 5.5}" cy="${y + 6.5}" r="2.2" fill="var(--c)"/>`).join("")}`,
    `<path d="M10 4 C10 14 4 14 5 22 C6 31 22 33 28 24 C33 16 27 10 20 12 C16 13 15 8 15 4" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>`,
    `<path d="M8 6 V28 M8 16 H26 M26 8 V26" stroke="var(--muted)" stroke-width="1.6" fill="none"/><circle cx="8" cy="6" r="4.5" fill="var(--c)"/><rect x="3" y="23" width="10" height="8" rx="2" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.2"/><circle cx="26" cy="8" r="4.5" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.2"/><rect x="21" y="22" width="10" height="9" rx="4" fill="var(--c)"/>`,
    `<circle cx="17" cy="6.5" r="4.5" fill="var(--c)"/><path d="M17 11 V22 M8 15 H26 M17 22 L10 32 M17 22 L24 32" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
  ];
  const LV = [
    [L2("Cell", "কোষ"), L2("The unit of life.", "জীবনের একক।")],
    [L2("Tissue", "টিস্যু"), L2("Many similar cells doing the same job together.", "একই কাজ করা অনেকগুলো একই রকম কোষ।")],
    [L2("Organ", "অঙ্গ"), L2("One or more kinds of tissue joined to do a particular job.", "এক বা একাধিক ধরনের টিস্যু মিলে একটি নির্দিষ্ট কাজ করে।")],
    [L2("Organ system", "তন্ত্র"), L2("Several organs that together carry out one major function.", "কয়েকটি অঙ্গ মিলে একটি বড় কাজ সম্পন্ন করে।")],
    [L2("Organism", "জীব"), L2("All the systems working together make a living body.", "সব তন্ত্র একসাথে কাজ করে একটি জীবদেহ গঠন করে।")]
  ];
  const CH = {
    dig: [L2("Digestion", "পরিপাক"), [
      [L2("Smooth muscle cell", "মসৃণ পেশিকোষ"), L2("A spindle-shaped cell that can contract.", "মাকু আকৃতির কোষ, যা সংকুচিত হতে পারে।")],
      [L2("Smooth muscle tissue", "মসৃণ পেশি টিস্যু"), L2("Sheets of these cells contract together to squeeze and churn.", "এই কোষের স্তর একসাথে সংকুচিত হয়ে চাপ দেয় ও মন্থন করে।")],
      [L2("Stomach", "পাকস্থলী"), L2("Muscle tissue + epithelial lining + connective + nervous tissue; it churns and digests food.", "পেশি টিস্যু + আবরণী আস্তরণ + যোজক + স্নায়ু টিস্যু; খাবার মন্থন ও পরিপাক করে।")],
      [L2("Digestive system", "পরিপাকতন্ত্র"), L2("Mouth, oesophagus, stomach, intestine, liver, pancreas ... together digest and absorb food.", "মুখ, অন্ননালি, পাকস্থলী, অন্ত্র, যকৃৎ, অগ্ন্যাশয় ... মিলে খাদ্য পরিপাক ও শোষণ করে।")],
      [L2("Human being", "মানুষ"), L2("The digestive system feeds every other system of the body.", "পরিপাকতন্ত্র দেহের অন্য সব তন্ত্রকে পুষ্টি জোগায়।")]]],
    ner: [L2("Messages", "বার্তা"), [
      [L2("Neuron", "নিউরন"), L2("A nerve cell with dendrites and one axon.", "ডেনড্রাইট ও একটি অ্যাক্সনযুক্ত স্নায়ুকোষ।")],
      [L2("Nervous tissue", "স্নায়ু টিস্যু"), L2("Huge numbers of neurons linked at synapses.", "সিন্যাপসে যুক্ত অসংখ্য নিউরন।")],
      [L2("Brain", "মস্তিষ্ক"), L2("Mostly nervous tissue, with connective tissue and blood vessels; it analyses messages and decides.", "প্রধানত স্নায়ু টিস্যু, সাথে যোজক টিস্যু ও রক্তনালি; বার্তা বিশ্লেষণ করে সিদ্ধান্ত নেয়।")],
      [L2("Nervous system", "স্নায়ুতন্ত্র"), L2("Brain, spinal cord and nerves receive stimuli and send responses.", "মস্তিষ্ক, সুষুম্নাকাণ্ড ও স্নায়ু উদ্দীপনা গ্রহণ করে ও সাড়া পাঠায়।")],
      [L2("Human being", "মানুষ"), L2("The nervous system keeps all the other systems working in step.", "স্নায়ুতন্ত্র অন্য সব তন্ত্রের কাজে তাল মিলিয়ে রাখে।")]]],
    exc: [L2("Excretion", "রেচন"), [
      [L2("Epithelial cell", "আবরণী কোষ"), L2("A flat or cube-shaped cell that can filter or absorb.", "চ্যাপ্টা বা ঘনাকার কোষ, যা ছাঁকতে বা শোষণ করতে পারে।")],
      [L2("Epithelial tissue", "আবরণী টিস্যু"), L2("Lines Bowman's capsule (squamous) and the collecting tubules (cuboidal).", "বোম্যান্স ক্যাপসুল (স্কোয়ামাস) ও সংগ্রাহক নালিকার (কিউবয়ডাল) আস্তরণ তৈরি করে।")],
      [L2("Kidney", "বৃক্ক"), L2("Epithelial tubules with blood vessels, connective and nervous tissue; it filters wastes from blood.", "আবরণী নালিকা, রক্তনালি, যোজক ও স্নায়ু টিস্যু মিলে; রক্ত থেকে বর্জ্য ছেঁকে নেয়।")],
      [L2("Excretory system", "রেচনতন্ত্র"), L2("Two kidneys, two ureters, one urinary bladder and one urethra remove nitrogenous waste.", "দুটি বৃক্ক, দুটি ইউরেটার, একটি মূত্রথলি ও একটি মূত্রনালি নাইট্রোজেনঘটিত বর্জ্য বের করে।")],
      [L2("Human being", "মানুষ"), L2("Without excretion, harmful wastes would build up in every tissue.", "রেচন না হলে প্রতিটি টিস্যুতে ক্ষতিকর বর্জ্য জমে যেত।")]]]
  };
  const SYS = { D: L2("Digestive", "পরিপাক"), R: L2("Respiratory", "শ্বসন"), N: L2("Nervous", "স্নায়ু"), E: L2("Excretory", "রেচন"), P: L2("Reproductive", "জনন"), I: L2("Integumentary", "ত্বক"), H: L2("Endocrine", "অন্তঃক্ষরা গ্রন্থি") };
  const ORG = [
    ["D", L2("Stomach", "পাকস্থলী"), L2("part of the alimentary canal; digests food", "পৌষ্টিক নালির অংশ; খাদ্য পরিপাক করে")],
    ["D", L2("Liver", "যকৃৎ"), L2("a digestive gland", "একটি পৌষ্টিক গ্রন্থি")],
    ["D", L2("Oesophagus", "অন্ননালি"), L2("the food pipe of the alimentary canal", "পৌষ্টিক নালির খাদ্য বহনকারী অংশ")],
    ["D", L2("Salivary gland", "লালাগ্রন্থি"), L2("a digestive gland in the mouth", "মুখের একটি পৌষ্টিক গ্রন্থি")],
    ["D", L2("Duodenum", "ডিওডেনাম"), L2("part of the alimentary canal after the stomach", "পাকস্থলীর পরে পৌষ্টিক নালির অংশ")],
    ["R", L2("Lungs", "ফুসফুস"), L2("where oxygen is taken in", "যেখানে অক্সিজেন গ্রহণ করা হয়")],
    ["R", L2("Trachea", "ট্রাকিয়া"), L2("the windpipe carrying air to the lungs", "ফুসফুসে বাতাস নেওয়ার শ্বাসনালি")],
    ["R", L2("Larynx", "ল্যারিংস"), L2("the voice box in the air passage", "বায়ুপথের স্বরযন্ত্র")],
    ["R", L2("Alveoli", "অ্যালভিওলাই"), L2("tiny air sacs of the lungs", "ফুসফুসের ক্ষুদ্র বায়ুথলি")],
    ["N", L2("Brain", "মস্তিষ্ক"), L2("receives stimuli and decides the response", "উদ্দীপনা গ্রহণ করে ও সাড়া ঠিক করে")],
    ["N", L2("Spinal cord", "সুষুম্নাকাণ্ড"), L2("carries messages between brain and body", "মস্তিষ্ক ও দেহের মধ্যে বার্তা বহন করে")],
    ["E", L2("Kidney", "বৃক্ক"), L2("filters nitrogenous waste from the blood", "রক্ত থেকে নাইট্রোজেনঘটিত বর্জ্য ছেঁকে নেয়")],
    ["E", L2("Urinary bladder", "মূত্রথলি"), L2("stores urine", "মূত্র জমা রাখে")],
    ["E", L2("Ureter", "ইউরেটার"), L2("carries urine from kidney to bladder", "বৃক্ক থেকে মূত্রথলিতে মূত্র নেয়")],
    ["P", L2("Ovary", "ডিম্বাশয়"), L2("produces ova (female gametes)", "ডিম্বাণু (স্ত্রী জননকোষ) তৈরি করে")],
    ["P", L2("Testis", "শুক্রাশয়"), L2("produces sperm (male gametes)", "শুক্রাণু (পুং জননকোষ) তৈরি করে")],
    ["I", L2("Skin", "ত্বক"), L2("covers and protects the body", "দেহ ঢেকে রাখে ও রক্ষা করে")],
    ["H", L2("Thyroid", "থাইরয়েড"), L2("a ductless gland; its hormone travels in the blood", "নালিহীন গ্রন্থি; এর হরমোন রক্তের মাধ্যমে চলে")],
    ["H", L2("Pituitary", "পিটুইটারি"), L2("a ductless gland that makes hormones", "হরমোন তৈরিকারী নালিহীন গ্রন্থি")],
    ["H", L2("Suprarenal (adrenal) gland", "সুপ্রারেনাল (অ্যাড্রেনাল) গ্রন্থি"), L2("a ductless gland above the kidney", "বৃক্কের ওপরের নালিহীন গ্রন্থি")]
  ];
  let mode = "lad", c = "dig", lv = 0, deck = b2shuf(ORG), di = 0, sc = 0, sn = 0, answered = false;
  el.innerHTML = `<div class="chipset b2lm" role="group"><button data-m="lad" aria-pressed="true">${L2("Ladder", "সিঁড়ি")}</button><button data-m="sys" aria-pressed="false">${L2("Which system?", "কোন তন্ত্র?")}</button></div><div id="b2lb" style="margin-top:8px"></div>`;
  const ladder = () => {
    const items = CH[c][1];
    $("#b2lb", el).innerHTML = `<div class="chipset b2lc" role="group">${Object.keys(CH).map(key => `<button data-c="${key}" aria-pressed="${key === c}">${CH[key][0]}</button>`).join("")}</div>
      <div style="display:grid;gap:6px;margin-top:8px">${items.map((it, i) => `<button class="b2lr" data-i="${i}" aria-pressed="${i === lv}" style="display:flex;align-items:center;gap:10px;text-align:left;font:inherit;color:var(--ink);cursor:pointer;min-height:48px;padding:6px 10px;border-radius:10px;width:${60 + i * 10}%;border:${i === lv ? "2px solid var(--c)" : "1px solid var(--rule)"};background:${i === lv ? "var(--c-soft)" : "var(--paper)"}">
        <svg viewBox="0 0 34 34" width="34" height="34" style="flex:none" aria-hidden="true">${ICON[i]}</svg><span style="min-width:0"><span class="muted" style="font-size:13px;display:block;line-height:1.2">${b2n(i + 1)}. ${LV[i][0]}</span><b style="line-height:1.25;display:block">${it[0]}</b></span></button>`).join("")}</div>
      <div class="w-out" style="margin-top:8px"><b>${LV[lv][0]}:</b> ${LV[lv][1]}<br><b>${items[lv][0]}:</b> ${items[lv][1]}</div>
      <p class="hint">${L2("Tap each step, from 1 up to 5.", "১ থেকে ৫ পর্যন্ত প্রতিটি ধাপে চাপ দাও।")}</p>`;
    b2chips(el, ".b2lc", b => { c = b.dataset.c; lv = 0; ladder(); });
    el.querySelectorAll(".b2lr").forEach(b => b.addEventListener("click", () => { lv = +b.dataset.i; ladder(); }));
  };
  const game = () => {
    if (di >= deck.length) {
      $("#b2lb", el).innerHTML = `<div class="w-out">${L2(`Finished! You placed ${sc} of ${sn} correctly.`, `শেষ! ${b2n(sn)}টির মধ্যে ${b2n(sc)}টি ঠিক জায়গায় বসিয়েছ।`)}<div class="w-row" style="margin-top:8px"><button class="btn solid" id="b2lg">${L2("Play again", "আবার খেলো")}</button></div></div>`;
      $("#b2lg", el).addEventListener("click", () => { deck = b2shuf(ORG); di = sc = sn = 0; game(); }); return;
    }
    answered = false; const o = deck[di];
    $("#b2lb", el).innerHTML = `<p class="muted" style="margin:4px 0">${L2(`Organ ${di + 1} of ${deck.length}`, `অঙ্গ ${b2n(di + 1)}/${b2n(deck.length)}`)}</p>
      <div style="font-size:21px;font-weight:700;margin-bottom:8px">${o[1]}</div>
      <p class="hint" style="margin:0 0 6px">${L2("Which organ system does it belong to?", "এটি কোন তন্ত্রের অংশ?")}</p>
      <div class="w-row">${Object.keys(SYS).map(a => `<button class="btn" data-a="${a}">${SYS[a]}</button>`).join("")}</div>
      <div class="w-out" id="b2lo" style="margin-top:10px">${sn ? L2(`Score: ${sc} / ${sn}`, `স্কোর: ${b2n(sc)} / ${b2n(sn)}`) : L2("Think: what is this organ's main job?", "ভাবো: এই অঙ্গের প্রধান কাজ কী?")}</div>`;
    el.querySelectorAll("#b2lb button[data-a]").forEach(b => b.addEventListener("click", () => {
      if (answered) return; answered = true; const right = b.dataset.a === o[0]; sn++; if (right) sc++;
      el.querySelectorAll("#b2lb button[data-a]").forEach(q => { if (q.dataset.a === o[0]) q.classList.add("done"); else if (q === b) q.style.borderColor = "var(--bad)"; });
      $("#b2lo", el).innerHTML = b2ok(right, `<b>${o[1]}</b> → ${SYS[o[0]]}${L2(" system: ", "তন্ত্র: ")}${o[2]}${L2(".", "।")}`) + `<br><span class="muted">${L2(`Score: ${sc} / ${sn}`, `স্কোর: ${b2n(sc)} / ${b2n(sn)}`)}</span><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b2ln2">${L2("Next", "পরেরটি")}</button></div>`;
      $("#b2ln2", el).addEventListener("click", () => { di++; game(); });
    }));
  };
  b2chips(el, ".b2lm", b => { mode = b.dataset.m; mode === "lad" ? ladder() : game(); });
  ladder();
};

/* 2.5 compound microscope: parts, and total magnification */
W.b2micro = (el) => {
  const P = {
    ey: [L2("Eyepiece", "আইপিস"), L2("The lens you look through, usually 10×. It magnifies the image formed by the objective.", "যে লেন্সে চোখ রেখে দেখা হয়; সাধারণত ১০×। অবজেকটিভের তৈরি প্রতিবিম্বকে এটি আবার বড় করে।")],
    bt: [L2("Body tube", "বডি টিউব"), L2("The tube that holds the eyepiece at its top and the objectives at its bottom.", "যে নলের ওপরের প্রান্তে আইপিস আর নিচের প্রান্তে অবজেকটিভ লাগানো থাকে।")],
    no: [L2("Nosepiece", "নোজপিস"), L2("The revolving disc that carries the objectives. Turn it to change the objective.", "অবজেকটিভ ধরে রাখা ঘূর্ণনশীল চাকতি। এটি ঘুরিয়ে অবজেকটিভ বদলানো হয়।")],
    ob: [L2("Objectives", "অবজেকটিভ"), L2("The lenses nearest the slide: low power 10×–12×, high power 40×–45×, oil immersion 100× (some microscopes also have a 4×–5× scanning objective).", "স্লাইডের সবচেয়ে কাছের লেন্স: লো পাওয়ার ১০×–১২×, হাই পাওয়ার ৪০×–৪৫×, অয়েল ইমারশন ১০০× (কোনো কোনো যন্ত্রে ৪×–৫× স্ক্যানিং অবজেকটিভও থাকে)।")],
    sg: [L2("Stage and clips", "স্টেজ ও ক্লিপ"), L2("The platform on which the slide is placed. Clips hold the slide; light comes up through a hole in the stage.", "যে পাটাতনে স্লাইড রাখা হয়। ক্লিপ স্লাইড আটকে রাখে; স্টেজের ছিদ্র দিয়ে নিচ থেকে আলো আসে।")],
    di: [L2("Condenser and diaphragm", "কনডেন্সার ও ডায়াফ্রাম"), L2("Under the stage. The condenser gathers light onto the object; the diaphragm controls how much light passes.", "স্টেজের নিচে থাকে। কনডেন্সার আলোকে বস্তুর ওপর জড়ো করে; ডায়াফ্রাম ঠিক করে কতটুকু আলো ঢুকবে।")],
    mr: [L2("Mirror (light source)", "আয়না (আলোর উৎস)"), L2("Reflects light up through the stage. Some microscopes have an electric lamp instead. Never point the mirror at the Sun.", "আলো প্রতিফলিত করে স্টেজের ভেতর দিয়ে ওপরে পাঠায়। কোনো কোনো যন্ত্রে এর বদলে বৈদ্যুতিক বাতি থাকে। আয়না কখনো সূর্যের দিকে ধরবে না।")],
    co: [L2("Coarse adjustment knob", "কোর্স অ্যাডজাস্টমেন্ট নব"), L2("The large knob. A small turn moves the stage a lot: rough focus. Use it first.", "বড় নব। অল্প ঘোরালেই স্টেজ অনেকখানি সরে: স্থূল ফোকাস। এটি আগে ব্যবহার করো।")],
    fi: [L2("Fine adjustment knob", "ফাইন অ্যাডজাস্টমেন্ট নব"), L2("The small knob. A large turn moves the stage only slightly: sharp focus. Use it after the coarse knob.", "ছোট নব। অনেকখানি ঘোরালে স্টেজ সামান্য সরে: সূক্ষ্ম ফোকাস। কোর্স নবের পরে ব্যবহার করো।")],
    ar: [L2("Arm", "আর্ম"), L2("The curved part above the stand. Hold the microscope here, with your other hand under the base, when you carry it.", "স্ট্যান্ডের ওপরের বাঁকানো অংশ। যন্ত্র বহনের সময় এখানে ধরো, আর অন্য হাত বেজের নিচে রাখো।")],
    sd: [L2("Stand", "স্ট্যান্ড"), L2("The vertical pillar that rises from the base.", "বেজের ওপর দাঁড়ানো উল্লম্ব পিলার।")],
    ba: [L2("Base (foot)", "বেজ (ফুট)"), L2("The platform on which the whole microscope stands.", "যে পাটাতনের ওপর পুরো যন্ত্রটি দাঁড়িয়ে থাকে।")]
  };
  const KEYS = Object.keys(P);
  let mode = "parts", sel = null, E = 10, O = 10;
  const G = (key, inner) => `<g data-p="${key}" opacity="${sel && sel !== key ? 0.22 : 1}">${inner}</g>`;
  const scope = () => `<svg viewBox="0 0 360 286" role="img" aria-label="${L2("compound microscope", "যৌগিক অণুবীক্ষণ যন্ত্র")}">
    <path d="M70 206 L160 240 M166 234 V18" stroke="var(--note)" stroke-width="1.8" stroke-dasharray="5 4" fill="none"/>
    ${b2T(64, 198, L2("light", "আলো"), "middle", 13, "var(--note)")}${b2T(120, 22, L2("eye", "চোখ"), "middle", 13, "var(--muted)")}<path d="M134 18 H150" stroke="var(--muted)"/>
    ${G("ba", `<rect x="96" y="262" width="184" height="16" rx="8" fill="var(--ink)"/>`)}
    ${G("sd", `<rect x="232" y="186" width="18" height="78" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.2"/>`)}
    ${G("ar", `<path d="M241 188 C270 150 264 92 206 64" fill="none" stroke="var(--ink)" stroke-width="15" stroke-linecap="round"/><rect x="180" y="56" width="30" height="16" rx="3" fill="var(--ink)"/>`)}
    ${G("mr", `<path d="M166 246 V262 M150 262 H182" stroke="var(--ink)" stroke-width="2.4"/><ellipse cx="166" cy="240" rx="20" ry="6.5" transform="rotate(-18 166 240)" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.4"/><rect x="142" y="228" width="48" height="36" fill="transparent"/>`)}
    ${G("di", `<path d="M153 199 H179 L174 215 H158 Z" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.4"/><path d="M178 207 H192" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/><rect x="148" y="199" width="46" height="18" fill="transparent"/>`)}
    ${G("sg", `<rect x="110" y="190" width="132" height="9" rx="2" fill="var(--ink)"/><rect x="140" y="185.500" width="52" height="4.500" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/><path d="M128 189 L144 183 M204 189 L188 183" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/><rect x="110" y="180" width="132" height="20" fill="transparent"/>`)}
    ${G("bt", `<rect x="150" y="44" width="32" height="92" rx="3" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2"/>`)}
    ${G("ey", `<rect x="155" y="16" width="22" height="30" rx="3" fill="var(--c)" stroke="var(--ink)" stroke-width="1.6"/>`)}
    ${G("ob", `<g fill="var(--c)" stroke="var(--ink)" stroke-width="1.4"><rect x="142" y="148" width="11" height="17" rx="1.5"/><rect x="160.500" y="149" width="11" height="31" rx="1.500"/><rect x="179" y="148" width="11" height="13" rx="1.500"/></g><rect x="138" y="150" width="56" height="32" fill="transparent"/>`)}
    ${G("no", `<ellipse cx="166" cy="142" rx="29" ry="9" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.6"/>`)}
    ${G("co", `<circle cx="241" cy="214" r="13.500" fill="var(--sheet)" stroke="var(--ink)" stroke-width="3"/><path d="M241 204 V224 M231 214 H251" stroke="var(--ink)" stroke-width="1.2"/>`)}
    ${G("fi", `<circle cx="241" cy="243" r="8" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.6"/><circle cx="241" cy="243" r="14" fill="transparent"/>`)}
  </svg>`;
  const fmt = x => b2n(String(+x.toFixed(2)));
  const view = () => {
    const M = E * O, k = M * 200 / 180, cw = 0.3 * k, ch = 0.08 * k, cx = 120, cy = 112;
    const R = Math.ceil(100 / ch) + 1, C = Math.ceil(100 / cw) + 1, nr = Math.min(ch * 0.3, cw * 0.11);
    let walls = "", nuc = "", pd = "", vac = "";
    for (let r = -R; r <= R; r++) {
      const y = cy - ch / 2 + r * ch, off = (r & 1) ? cw / 2 : 0;
      walls += `M18 ${y.toFixed(1)}H222`;
      for (let c = -C - 1; c <= C; c++) {
        const x = cx - cw / 2 + c * cw + off;
        if (x > 224 || x + cw < 16) continue;
        walls += `M${x.toFixed(1)} ${y.toFixed(1)}v${ch.toFixed(1)}`;
        const nx = x + cw * 0.27, ny = y + ch * 0.52;
        if (nr >= 2.2) nuc += `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="${nr.toFixed(1)}" fill="var(--bad)" fill-opacity=".8"/>` + (M >= 400 ? `<circle cx="${(nx + nr * 0.25).toFixed(1)}" cy="${(ny - nr * 0.2).toFixed(1)}" r="${(nr * 0.3).toFixed(1)}" fill="var(--ink)" fill-opacity=".6"/>` : "");
        else pd += `M${nx.toFixed(1)} ${ny.toFixed(1)}h.01`;
        if (M >= 400) vac += `<ellipse cx="${(x + cw * 0.66).toFixed(1)}" cy="${(y + ch * 0.5).toFixed(1)}" rx="${(cw * 0.27).toFixed(1)}" ry="${(ch * 0.33).toFixed(1)}" fill="var(--sheet)" fill-opacity=".75"/>`;
      }
    }
    const note = M < 100 ? L2("Low magnification: many cells in rows, like a brick wall. The nuclei are only tiny dots.", "কম বিবর্ধন: ইটের দেয়ালের মতো সারি সারি অনেক কোষ। নিউক্লিয়াসগুলো শুধু ছোট্ট বিন্দু।")
      : M < 400 ? L2("The cell walls are clear and each cell shows a nucleus, stained red by safranin.", "কোষপ্রাচীর স্পষ্ট, আর প্রতিটি কোষে স্যাফ্রানিনে লাল হওয়া নিউক্লিয়াস দেখা যাচ্ছে।")
      : M < 1000 ? L2("High power: only a few cells fit in view. The nucleus lies to one side and the vacuole is clear.", "হাই পাওয়ার: দৃশ্যক্ষেত্রে অল্প কয়েকটি কোষ ধরে। নিউক্লিয়াস এক পাশে, কোষগহ্বরও স্পষ্ট।")
      : L2("Oil immersion: the image is huge, but a light microscope still cannot show details smaller than about 200 nm, such as ribosomes.", "অয়েল ইমারশন: ছবি বিশাল, কিন্তু আলোক অণুবীক্ষণ যন্ত্রে প্রায় ২০০ nm-এর চেয়ে ছোট জিনিস, যেমন রাইবোজোম, তবুও দেখা যায় না।");
    return `<div class="svgwrap fit"><svg viewBox="0 0 360 224" role="img" aria-label="${L2("field of view", "দৃশ্যক্ষেত্র")}">
      <defs><clipPath id="b2mf"><circle cx="${cx}" cy="${cy}" r="100"/></clipPath></defs>
      <circle cx="${cx}" cy="${cy}" r="100" fill="var(--sheet)"/><g clip-path="url(#b2mf)"><rect x="16" y="8" width="208" height="208" fill="var(--bad)" fill-opacity=".07"/>${vac}
      <path d="${walls}" fill="none" stroke="var(--ink)" stroke-width="${Math.min(3, 0.7 + M / 400).toFixed(2)}"/>${nuc}${pd ? `<path d="${pd}" stroke="var(--bad)" stroke-width="${Math.max(1.4, nr * 2).toFixed(1)}" stroke-linecap="round"/>` : ""}</g>
      <circle cx="${cx}" cy="${cy}" r="100" fill="none" stroke="var(--ink)" stroke-width="4"/>
      ${b2T(292, 46, L2("total", "মোট বিবর্ধন"), "middle", 13, "var(--muted)")}${b2T(292, 82, b2n(M) + "×", "middle", 30, "var(--c)", 700)}
      ${b2T(292, 108, `${b2n(E)}× × ${b2n(O)}×`, "middle", 14)}
      ${b2T(292, 150, L2("field of view", "দৃশ্যক্ষেত্র"), "middle", 13, "var(--muted)")}${b2T(292, 170, `≈ ${fmt(180 / M)} mm`, "middle", 14)}
      ${b2T(292, 200, L2("onion cells", "পেঁয়াজের কোষ"), "middle", 13, "var(--muted)")}</svg></div>
      <div class="w-out">M = E × O = ${b2n(E)} × ${b2n(O)} = <b>${b2n(M)}</b><br>${L2(`An onion cell 0.3 mm long now looks 0.3 × ${M} = <b>${+(0.3 * M).toFixed(1)} mm</b> long.`, `০.৩ mm লম্বা একটি পেঁয়াজকোষ এখন দেখাবে ০.৩ × ${b2n(M)} = <b>${fmt(0.3 * M)} mm</b> লম্বা।`)}<br><span class="muted">${note}</span></div>`;
  };
  el.innerHTML = `<div class="chipset b2mm" role="group"><button data-m="parts" aria-pressed="true">${L2("Parts", "অংশ")}</button><button data-m="mag" aria-pressed="false">${L2("Magnify", "বিবর্ধন")}</button></div><div id="b2mb" style="margin-top:8px"></div>`;
  const draw = () => {
    if (mode === "parts") {
      const d = sel ? P[sel] : null;
      $("#b2mb", el).innerHTML = `<div class="svgwrap fit">${scope()}</div>
        <div class="chipset b2mp" role="group" style="margin-top:6px">${KEYS.map(key => `<button data-p="${key}" aria-pressed="${sel === key}">${P[key][0]}</button>`).join("")}</div>
        <div class="w-out" style="margin-top:8px">${d ? `<b>${d[0]}</b><br>${d[1]}` : L2("Tap a part of the microscope, or a name above.", "অণুবীক্ষণ যন্ত্রের কোনো অংশে বা ওপরের কোনো নামে চাপ দাও।")}</div>`;
      b2tap(el, "#b2mb svg g[data-p]", n => { sel = sel === n.dataset.p ? null : n.dataset.p; draw(); });
      el.querySelectorAll(".b2mp button").forEach(b => b.addEventListener("click", () => { sel = sel === b.dataset.p ? null : b.dataset.p; draw(); }));
    } else {
      $("#b2mb", el).innerHTML = `<div class="w-row"><label>${L2("Eyepiece", "আইপিস")}</label><div class="chipset b2me" role="group">${[10, 15].map(v => `<button data-v="${v}" aria-pressed="${v === E}">${b2n(v)}×</button>`).join("")}</div></div>
        <div class="w-row" style="margin-top:6px"><label>${L2("Objective", "অবজেকটিভ")}</label><div class="chipset b2mo" role="group">${[4, 10, 40, 100].map(v => `<button data-v="${v}" aria-pressed="${v === O}">${b2n(v)}×</button>`).join("")}</div></div>
        <div style="margin-top:8px">${view()}</div>`;
      b2chips(el, ".b2me", b => { E = +b.dataset.v; draw(); });
      b2chips(el, ".b2mo", b => { O = +b.dataset.v; draw(); });
    }
  };
  b2chips(el, ".b2mm", b => { mode = b.dataset.m; draw(); });
  draw();
};
