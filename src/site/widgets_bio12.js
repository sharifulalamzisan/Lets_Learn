/* ---- biology chapter 12 widgets: heredity and biological evolution ---- */
const B12 = x => bnNum(x, LANG);
const chips12 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T12 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "") => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}>${s}</text>`;
const tabs12 = (cls, items, cur) => `<div class="chipset ${cls}" role="group">${items.map(([k, l]) => `<button data-v="${k}" aria-pressed="${k === cur}">${l}</button>`).join("")}</div>`;
const rnd12 = n => Math.floor(Math.random() * n);
const shuf12 = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd12(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct12 = (a, b) => B12(b ? Math.round(a / b * 1000) / 10 : 0) + "%";
const sw12 = (c, t) => `<span style="white-space:nowrap"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${c};vertical-align:-1px"></span> ${t}</span>`;
const BASE12 = { A: "#3f9d5a", T: "#d8a520", G: "#c8473d", C: "#3b76b8" };
const PAIR12 = { A: "T", T: "A", G: "C", C: "G" };
const base12 = (x, y, b, w = 30, h = 30, extra = "") => `<g${extra}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${BASE12[b]}" fill-opacity=".3" stroke="${BASE12[b]}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + 5.5}" font-size="16" font-weight="700" text-anchor="middle" fill="var(--ink)">${b}</text></g>`;
/* hydrogen bonds between a pair: 2 dashes for A-T, 3 for G-C */
const hb12 = (cx, y1, y2, b) => (b === "A" || b === "T" ? [-5, 5] : [-8, 0, 8]).map(d => `<line x1="${cx + d}" y1="${y1}" x2="${cx + d}" y2="${y2}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="3 3"/>`).join("");
/* Punnett square frame: 2 column gametes, 2 row gametes, cell(r,c,x,y,w,h) returns svg */
const grid12 = (o, cell, head) => {
  const { x0, y0, hw, hh, cw, ch } = o; let s = "";
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) s += cell(r, c, x0 + hw + c * cw, y0 + hh + r * ch, cw, ch);
  for (let c = 0; c < 2; c++) s += head("col", c, x0 + hw + c * cw, y0, cw, hh);
  for (let r = 0; r < 2; r++) s += head("row", r, x0, y0 + hh + r * ch, hw, ch);
  s += `<path d="M${x0 + hw} ${y0} V${y0 + hh + 2 * ch} M${x0 + hw + cw} ${y0} V${y0 + hh + 2 * ch} M${x0} ${y0 + hh} H${x0 + hw + 2 * cw} M${x0} ${y0 + hh + ch} H${x0 + hw + 2 * cw}" fill="none" stroke="var(--muted)" stroke-width="1.5"/><rect x="${x0}" y="${y0}" width="${hw + 2 * cw}" height="${hh + 2 * ch}" rx="8" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`;
  return s;
};

/* 12.1 base pairing, replication step-through, Mendel's pea cross */
W.b12dna = (el) => {
  let view = "pair";
  const NM = { A: L2("adenine", "অ্যাডেনিন"), T: L2("thymine", "থাইমিন"), G: L2("guanine", "গুয়ানিন"), C: L2("cytosine", "সাইটোসিন") };
  el.innerHTML = tabs12("b12dv", [["pair", L2("Pair the bases", "বেস মেলাও")], ["copy", L2("Copy the DNA", "DNA-এর নকল")], ["pea", L2("Pea cross", "মটরের সংকরায়ণ")]], view) + `<div id="b12db" style="margin-top:8px"></div>`;
  const body = $("#b12db", el);

  /* --- pair the bases --- */
  let seq = [], done = 0, msg = "";
  const newSeq = () => { const all = ["A", "T", "G", "C"]; seq = shuf12(all.concat([0, 1, 2, 3].map(() => all[rnd12(4)]))); done = 0; msg = ""; };
  const drawPair = () => {
    const X = i => 26 + i * 39;
    let s = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("Two strands of DNA joined by base pairs", "বেস জোড় দিয়ে যুক্ত DNA-এর দুটি সূত্র")}">`;
    s += T12(18, 18, L2("given strand", "দেওয়া সূত্র"), "start", 13, "var(--muted)") + T12(342, 194, L2("partner strand (you build it)", "সঙ্গী সূত্র (তুমি বানাও)"), "end", 13, "var(--c)");
    s += `<line x1="18" y1="34" x2="330" y2="34" stroke="var(--muted)" stroke-width="6" stroke-linecap="round"/><path d="M344 34 l-12 -8 v16 z" fill="var(--muted)"/>`;
    s += `<line x1="30" y1="166" x2="342" y2="166" stroke="var(--c)" stroke-width="6" stroke-linecap="round" opacity="${done ? 1 : .35}"/><path d="M16 166 l12 -8 v16 z" fill="var(--c)" opacity="${done ? 1 : .35}"/>`;
    seq.forEach((b, i) => {
      s += base12(X(i), 44, b);
      if (i < done) s += hb12(X(i) + 15, 76, 124, b) + base12(X(i), 126, PAIR12[b]);
      else if (i === done) s += `<rect x="${X(i)}" y="126" width="30" height="30" rx="5" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2.5" stroke-dasharray="5 3"/>` + T12(X(i) + 15, 147, "?", "middle", 17, "var(--c)", "700");
      else s += `<rect x="${X(i)}" y="126" width="30" height="30" rx="5" fill="none" stroke="var(--rule)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    });
    $("#b12ds", el).innerHTML = s + `</svg>`;
    const fin = done >= seq.length, o = $("#b12do", el);
    el.querySelectorAll("#b12dk button[data-b]").forEach(b => b.disabled = fin);
    $("#b12dn", el).style.display = fin ? "" : "none";
    if (fin) {
      const at = seq.filter(b => b === "A" || b === "T").length, gc = seq.length - at;
      o.innerHTML = `<b>${L2("Done!", "হয়ে গেছে!")}</b> ${L2(`A–T pairs: ${at} × 2 = ${at * 2}; G–C pairs: ${gc} × 3 = ${gc * 3}. Total <b>${at * 2 + gc * 3}</b> hydrogen bonds. The new strand is complementary to the given one, not identical.`, `A–T জোড়: ${B12(at)} × ২ = ${B12(at * 2)}; G–C জোড়: ${B12(gc)} × ৩ = ${B12(gc * 3)}। মোট <b>${B12(at * 2 + gc * 3)}টি</b> হাইড্রোজেন বন্ধন। নতুন সূত্রটি দেওয়া সূত্রের পরিপূরক, হুবহু এক নয়।`)}`;
    } else {
      const b = seq[done];
      o.innerHTML = (msg ? msg + "<br>" : "") + L2(`Which base pairs with <b>${b}</b> (${NM[b]})?`, `<b>${b}</b>-এর (${NM[b]}) সাথে কোন বেস জোড় বাঁধে?`);
    }
  };
  const tryBase = k => {
    const b = seq[done];
    if (PAIR12[b] === k) { const n = b === "A" || b === "T" ? 2 : 3; msg = `<span style="color:var(--good)">✓</span> ` + L2(`${b}–${k}: ${n} hydrogen bonds.`, `${b}–${k}: ${B12(n)}টি হাইড্রোজেন বন্ধন।`); done++; }
    else msg = `<span style="color:var(--bad)">✗</span> ` + L2(`${k} does not pair with ${b}. Remember: A pairs with T, and G pairs with C.`, `${k} জোড় বাঁধে না ${b}-এর সাথে। মনে রেখো: A জোড় বাঁধে T-এর সাথে, আর G জোড় বাঁধে C-এর সাথে।`);
    drawPair();
  };

  /* --- replication --- */
  let step = 0;
  const CS = ["A", "G", "T", "C", "A", "T"], CC = CS.map(b => PAIR12[b]);
  const COPY = [
    L2("The DNA before copying: two strands held together by hydrogen bonds between the bases.", "নকলের আগে DNA: বেসগুলোর মধ্যের হাইড্রোজেন বন্ধনে দুটি সূত্র জোড়া লেগে আছে।"),
    L2("The hydrogen bonds break and the two strands separate, like a zip opening. The bases of each old strand are now exposed.", "হাইড্রোজেন বন্ধন ভেঙে যায়, আর চেইন খোলার মতো সূত্র দুটি আলাদা হয়ে যায়। প্রতিটি পুরোনো সূত্রের বেস এখন খোলা।"),
    L2("Free nucleotides floating in the cell pair up with the exposed bases: A with T, G with C. A new strand grows along each old strand.", "কোষে ভাসমান মুক্ত নিউক্লিওটাইড খোলা বেসগুলোর সাথে জোড় বাঁধে: A-এর সাথে T, G-এর সাথে C। প্রতিটি পুরোনো সূত্রের গা ঘেঁষে একটি নতুন সূত্র বাড়তে থাকে।"),
    L2("Two DNA molecules, exactly alike. Each has <b>one old strand and one new strand</b>: this is the semi-conservative method.", "দুটি DNA অণু, হুবহু এক রকম। প্রতিটিতে <b>একটি পুরোনো ও একটি নতুন সূত্র</b>: এটাই অর্ধ-রক্ষণশীল পদ্ধতি।")];
  const drawCopy = () => {
    const X = i => 52 + i * 46, OLD = "var(--ink)", NEW = "var(--c)";
    const rail = (y, i0, i1, col) => `<line x1="${X(i0) - 8}" y1="${y}" x2="${X(i1) + 38}" y2="${y}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
    const row = (y, arr, i0 = 0, i1 = 5) => arr.map((b, i) => i >= i0 && i <= i1 ? base12(X(i), y, b) : "").join("");
    const bonds = (y1, y2, i0 = 0, i1 = 5) => CS.map((b, i) => i >= i0 && i <= i1 ? hb12(X(i) + 15, y1, y2, b) : "").join("");
    let s = `<svg viewBox="0 0 360 262" role="img" aria-label="${L2("DNA replication, step by step", "ধাপে ধাপে DNA অনুলিপন")}">`;
    if (step === 0) s += rail(88, 0, 5, OLD) + row(95, CS) + bonds(127, 135) + row(137, CC) + rail(174, 0, 5, OLD);
    else {
      s += rail(22, 0, 5, OLD) + row(29, CS) + row(203, CC) + rail(240, 0, 5, OLD);
      if (step === 2) {
        s += bonds(61, 69, 0, 2) + row(71, CC, 0, 2) + rail(108, 0, 2, NEW) + bonds(193, 201, 3, 5) + row(161, CS, 3, 5) + rail(154, 3, 5, NEW);
        [[214, 76, CC[3], -10], [268, 100, CC[4], 12], [62, 150, CS[1], 9], [128, 166, CS[2], -12], [306, 60, CC[5], 6], [24, 116, CS[0], -8]].forEach(([x, y, b, r]) => s += base12(x, y, b, 26, 26, ` transform="rotate(${r} ${x + 13} ${y + 13})" opacity=".85"`));
      }
      if (step === 3) s += bonds(61, 69) + row(71, CC) + rail(108, 0, 5, NEW) + rail(154, 0, 5, NEW) + row(161, CS) + bonds(193, 201) + T12(180, 136, L2("each: one old + one new strand", "প্রতিটিতে: একটি পুরোনো + একটি নতুন সূত্র"), "middle", 13, "var(--muted)");
      if (step === 1) s += `<path d="M180 118 V84 M180 144 V178" stroke="var(--muted)" stroke-width="2" fill="none"/><path d="M180 76 l-6 10 h12 z M180 186 l-6 -10 h12 z" fill="var(--muted)"/>` + T12(180, 136, L2("strands separate", "সূত্র দুটি আলাদা হয়"), "middle", 13, "var(--muted)");
    }
    $("#b12ds", el).innerHTML = s + `</svg>`;
    $("#b12dc", el).textContent = L2(`Step ${step + 1} of 4`, `ধাপ ${B12(step + 1)} / ৪`);
    $("#b12do", el).innerHTML = COPY[step];
  };

  /* --- pea cross --- */
  let p1 = "Tt", p2 = "Tt";
  const plant = (x, y, tall) => { const h = tall ? 40 : 18; let g = `<path d="M${x} ${y} V${y - h}" stroke="var(--c)" stroke-width="3" stroke-linecap="round"/>`; for (let k = 8; k < h; k += 11) g += `<path d="M${x} ${y - k} q-9 -7 -13 -1 q6 5 13 1 M${x} ${y - k - 4} q9 -7 13 -1 q-6 5 -13 1" fill="var(--c)"/>`; return g + `<path d="M${x - 9} ${y} H${x + 9}" stroke="var(--muted)" stroke-width="2"/>`; };
  const drawPea = () => {
    const kids = [];
    const cell = (r, c, x, y, w, h) => { const g = [p1[r], p2[c]].sort().join(""), tall = g !== "tt"; kids.push(g);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tall ? "var(--c-soft)" : "var(--note-soft)"}"/>` + T12(x + 40, y + 36, g, "middle", 20, "var(--ink)", "700") + T12(x + 40, y + 57, tall ? L2("tall", "লম্বা") : L2("short", "খাটো"), "middle", 13, tall ? "var(--c)" : "var(--note)", "700") + plant(x + 96, y + h - 12, tall); };
    const head = (kind, i, x, y, w, h) => { const a = kind === "col" ? p2[i] : p1[i]; return `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="15" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>` + T12(x + w / 2, y + h / 2 + 6, a, "middle", 17, "var(--ink)", "700"); };
    let s = `<svg viewBox="0 0 360 226" role="img" aria-label="${L2("Punnett square of the pea cross", "মটরের সংকরায়ণের পানেট স্কয়ার")}">` + grid12({ x0: 10, y0: 8, hw: 80, hh: 50, cw: 130, ch: 80 }, cell, head);
    s += T12(50, 28, L2("pollen →", "পরাগরেণু →"), "middle", 13, "var(--muted)") + T12(50, 46, L2("egg cell ↓", "ডিম্বাণু ↓"), "middle", 13, "var(--muted)");
    $("#b12ds", el).innerHTML = s + `</svg>`;
    const n = g => kids.filter(k => k === g).length, tall = 4 - n("tt");
    let t = L2(`Of the 4 boxes: TT ${n("TT")}, Tt ${n("Tt")}, tt ${n("tt")}. <b>Tall ${tall} (${tall * 25}%), short ${4 - tall} (${(4 - tall) * 25}%).</b>`, `৪টি ঘরের মধ্যে: TT ${B12(n("TT"))}টি, Tt ${B12(n("Tt"))}টি, tt ${B12(n("tt"))}টি। <b>লম্বা ${B12(tall)}টি (${B12(tall * 25)}%), খাটো ${B12(4 - tall)}টি (${B12((4 - tall) * 25)}%)।</b>`);
    if (p1 === "Tt" && p2 === "Tt") t += " " + L2("Both parents are tall, yet a short plant comes back: 3 : 1, as Mendel found in F<sub>2</sub>.", "দুই জনিতৃই লম্বা, তবু খাটো গাছ ফিরে আসে: ৩ : ১, মেন্ডেল F<sub>2</sub>-তে যেমন পেয়েছিলেন।");
    else if (n("Tt") === 4) t += " " + L2("All are tall, but every one hides a t allele. This is Mendel's F<sub>1</sub>.", "সবাই লম্বা, কিন্তু প্রত্যেকের মধ্যে একটি t অ্যালিল লুকিয়ে আছে। এটাই মেন্ডেলের F<sub>1</sub>।");
    else if (tall === 2) t += " " + L2("Half tall and half short: 1 : 1.", "অর্ধেক লম্বা, অর্ধেক খাটো: ১ : ১।");
    $("#b12do", el).innerHTML = t;
  };

  const setView = () => {
    if (view === "pair") {
      body.innerHTML = `<div class="svgwrap fit" id="b12ds"></div><div class="w-row" id="b12dk" style="margin:6px 0;justify-content:center">${["A", "T", "G", "C"].map(b => `<button class="btn" data-b="${b}" style="min-width:56px;justify-content:center;font-size:19px;border-color:${BASE12[b]};color:var(--ink)" aria-label="${NM[b]}">${b}</button>`).join("")}<button class="btn solid" id="b12dn" style="display:none">${L2("New strand", "নতুন সূত্র")}</button></div><div class="w-out" id="b12do"></div>`;
      el.querySelectorAll("#b12dk button[data-b]").forEach(b => b.addEventListener("click", () => tryBase(b.dataset.b)));
      $("#b12dn", el).addEventListener("click", () => { newSeq(); drawPair(); });
      if (!seq.length) newSeq();
      drawPair();
    } else if (view === "copy") {
      body.innerHTML = `<div class="svgwrap fit" id="b12ds"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b12dx">${L2("Next", "পরের ধাপ")} ▶</button><span class="hint" id="b12dc"></span><span class="hint">${sw12("var(--ink)", L2("old strand", "পুরোনো সূত্র"))} &nbsp; ${sw12("var(--c)", L2("new strand", "নতুন সূত্র"))}</span></div><div class="w-out" id="b12do"></div>`;
      $("#b12dx", el).addEventListener("click", () => { step = (step + 1) % 4; drawCopy(); });
      drawCopy();
    } else {
      const ch = (cls, cur) => `<div class="chipset ${cls}" role="group">${["TT", "Tt", "tt"].map(g => `<button data-g="${g}" aria-pressed="${g === cur}">${g}</button>`).join("")}</div>`;
      body.innerHTML = `<div class="w-row"><span class="hint">${L2("Parent 1 (egg cells):", "জনিতৃ ১ (ডিম্বাণু):")}</span>${ch("b12d1", p1)}</div><div class="w-row" style="margin:6px 0"><span class="hint">${L2("Parent 2 (pollen):", "জনিতৃ ২ (পরাগরেণু):")}</span>${ch("b12d2", p2)}</div><div class="svgwrap fit" id="b12ds"></div><div class="w-out" id="b12do"></div>`;
      chips12(el, ".b12d1", b => { p1 = b.dataset.g; drawPea(); });
      chips12(el, ".b12d2", b => { p2 = b.dataset.g; drawPea(); });
      drawPea();
    }
  };
  chips12(el, ".b12dv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 12.1.2 DNA fingerprint: match the band patterns */
W.b12test = (el) => {
  let view = "crime", pick = -1, showMom = false;
  const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], num = (a, b) => a - b;
  const pickN = (pool, n) => shuf12(pool).slice(0, n).sort(num);
  let crime = { scene: [2, 4, 7, 9, 11], sus: [[2, 4, 7, 9, 11], [1, 4, 6, 9, 12], [2, 5, 7, 10, 11]] };
  let kid = { child: [3, 6, 8, 11], mom: [3, 5, 8, 12], men: [[2, 6, 9, 11], [4, 6, 7, 10]] };
  const newCrime = () => { const scene = pickN(ALL, 5), who = rnd12(3);
    crime = { scene, sus: [0, 1, 2].map(i => { if (i === who) return scene.slice(); const keep = pickN(scene, 2 + rnd12(2)); return keep.concat(pickN(ALL.filter(p => !scene.includes(p)), 5 - keep.length)).sort(num); }) }; pick = -1; };
  const newKid = () => { const mom = pickN(ALL, 4), dad = pickN(ALL.filter(p => !mom.includes(p)), 4), fromD = pickN(dad, 2);
    const other = [fromD[rnd12(2)]].concat(pickN(ALL.filter(p => !dad.includes(p)), 3)).sort(num);
    kid = { child: pickN(mom, 2).concat(fromD).sort(num), mom, men: rnd12(2) ? [dad, other] : [other, dad] }; pick = -1; showMom = false; };
  const list = a => a.map(B12).join(", ");
  const BY = p => 66 + (p - 1) * 15, CX = i => 70 + i * 80, MOMC = "#3b76b8", DADC = "#c9781f";
  /* lanes: [{lab:[..], bands:[[pos,colour]], miss:[pos], k, on}] */
  const gel = (lanes, guides, aria) => {
    let s = `<svg viewBox="0 0 360 262" role="img" aria-label="${aria}"><rect x="30" y="40" width="320" height="212" rx="6" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>`;
    s += T12(15, 58, "−", "middle", 20, "var(--muted)", "700") + T12(15, 250, "+", "middle", 18, "var(--muted)", "700") + `<path d="M15 68 V222" stroke="var(--muted)" stroke-width="2"/><path d="M15 232 l-6 -11 h12 z" fill="var(--muted)"/>`;
    lanes.forEach((L, i) => {
      const cx = CX(i);
      if (L.on) s += `<rect x="${cx - 38}" y="42" width="76" height="208" rx="5" fill="var(--c-soft)"/>`;
      s += `<rect x="${cx - 26}" y="46" width="52" height="7" rx="2" fill="var(--rule)" stroke="var(--muted)" stroke-width="1"/>`;
      L.lab.forEach((t, j) => s += T12(cx, (L.lab.length > 1 ? 14 : 24) + j * 16, t, "middle", 13, L.on ? "var(--c)" : "var(--ink)", L.on ? "700" : ""));
    });
    (guides || []).forEach(p => s += `<line x1="34" y1="${BY(p)}" x2="346" y2="${BY(p)}" stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 4" opacity=".7"/>`);
    lanes.forEach((L, i) => {
      const cx = CX(i);
      (L.miss || []).forEach(p => s += `<rect x="${cx - 26}" y="${BY(p) - 4}" width="52" height="8" rx="2" fill="none" stroke="var(--bad)" stroke-width="1.8" stroke-dasharray="4 3"/>`);
      L.bands.forEach(([p, c]) => s += `<rect x="${cx - 26}" y="${BY(p) - 3.5}" width="52" height="7" rx="2" fill="${c || "var(--ink)"}"/>`);
      if (L.k !== undefined) s += `<rect data-k="${L.k}" x="${cx - 40}" y="0" width="80" height="262" fill="transparent" style="cursor:pointer"/>`;
    });
    return s + `</svg>`;
  };
  const draw = () => {
    const o = $("#b12to", el);
    if (view === "crime") {
      const sc = crime.scene;
      const lanes = [{ lab: [L2("Crime scene", "অপরাধস্থল")], bands: sc.map(p => [p]) }].concat(crime.sus.map((b, i) => ({ lab: [L2("Suspect", "সন্দেহভাজন"), B12(i + 1)], k: i, on: i === pick,
        bands: b.map(p => [p, i === pick ? (sc.includes(p) ? "var(--good)" : "var(--bad)") : ""]), miss: i === pick ? sc.filter(p => !b.includes(p)) : [] })));
      $("#b12ts", el).innerHTML = gel(lanes, pick >= 0 ? sc : [], L2("DNA band patterns from a crime scene and three suspects", "অপরাধস্থল ও তিন সন্দেহভাজনের DNA ব্যান্ডের নকশা"));
      if (pick < 0) o.innerHTML = L2("Whose DNA was left at the scene? Tap a suspect to compare the bands, one by one.", "ঘটনাস্থলে কার DNA পাওয়া গেছে? একজন সন্দেহভাজনকে চেপে ব্যান্ডগুলো একটি একটি করে মিলিয়ে দেখো।");
      else { const m = crime.sus[pick].filter(p => sc.includes(p)).length, n = B12(pick + 1);
        o.innerHTML = m === sc.length ? `<span style="color:var(--good)">✓</span> ` + L2(`<b>Suspect ${n}: all ${m} bands match.</b> The DNA at the scene came from this person. How it got there is for the court to judge.`, `<b>সন্দেহভাজন ${n}: ${B12(m)}টি ব্যান্ডই মিলেছে।</b> ঘটনাস্থলের DNA এই ব্যক্তিরই। সেটি সেখানে কীভাবে গেল, তা আদালত বিচার করবে।`)
          : `<span style="color:var(--bad)">✗</span> ` + L2(`<b>Suspect ${n}: only ${m} of ${sc.length} bands match.</b> A few shared bands mean nothing. This is not the same person.`, `<b>সন্দেহভাজন ${n}: ${B12(sc.length)}টির মধ্যে মাত্র ${B12(m)}টি ব্যান্ড মিলেছে।</b> দু-একটি ব্যান্ড মিললে কিছু বোঝায় না। ইনি সেই ব্যক্তি নন।`); }
    } else {
      const { child, mom, men } = kid, need = child.filter(p => !mom.includes(p)), mark = showMom || pick >= 0;
      const lanes = [{ lab: [L2("Mother", "মা")], bands: mom.map(p => [p, mark && child.includes(p) ? MOMC : ""]) },
        { lab: [L2("Child", "সন্তান")], bands: child.map(p => [p, mark ? (mom.includes(p) ? MOMC : DADC) : ""]) }]
        .concat(men.map((b, i) => ({ lab: [L2("Mr " + "AB"[i], "ব্যক্তি " + "কখ"[i])], k: i, on: i === pick, bands: b.map(p => [p, i === pick && need.includes(p) ? "var(--good)" : ""]), miss: i === pick ? need.filter(p => !b.includes(p)) : [] })));
      $("#b12ts", el).innerHTML = gel(lanes, mark ? child : [], L2("DNA band patterns of a mother, a child and two men", "মা, সন্তান ও দুজন ব্যক্তির DNA ব্যান্ডের নকশা"));
      const key = `<br><span style="font-size:14px">${sw12(MOMC, L2("came from the mother", "মায়ের কাছ থেকে"))} &nbsp; ${sw12(DADC, L2("must come from the father", "বাবার কাছ থেকে আসতেই হবে"))}</span>`;
      if (pick < 0) o.innerHTML = mark ? L2(`The child's bands ${list(child.filter(p => mom.includes(p)))} are also in the mother. Bands <b>${list(need)}</b> are left: the father must have both. Now tap each man.`, `সন্তানের ${list(child.filter(p => mom.includes(p)))} নম্বর ব্যান্ড মায়েরও আছে। বাকি থাকল <b>${list(need)}</b> নম্বর ব্যান্ড: বাবার নকশায় দুটিই থাকতে হবে। এবার একজন একজন করে ব্যক্তিকে চাপো।`) + key
        : L2("Every band of the child came from the mother or the father. First press “Mother's bands”.", "সন্তানের প্রতিটি ব্যান্ড এসেছে মা অথবা বাবার কাছ থেকে। আগে “মায়ের ব্যান্ড” চাপো।");
      else { const lack = need.filter(p => !men[pick].includes(p)), nm = L2("Mr " + "AB"[pick], "ব্যক্তি " + "কখ"[pick]);
        o.innerHTML = (lack.length ? `<span style="color:var(--bad)">✗</span> ` + L2(`<b>${nm} does not have band ${list(lack)}.</b> He cannot be the father.`, `<b>${nm}-এর ${list(lack)} নম্বর ব্যান্ড নেই।</b> তিনি বাবা হতে পারেন না।`)
          : `<span style="color:var(--good)">✓</span> ` + L2(`<b>${nm} has both bands ${list(need)}.</b> He can be the father. Notice that the child did not get all of his bands: a parent passes on only half.`, `<b>${nm}-এর ${list(need)} দুটি ব্যান্ডই আছে।</b> তিনি বাবা হতে পারেন। লক্ষ করো, তাঁর সব ব্যান্ড সন্তানে আসেনি: মা বা বাবা অর্ধেকই দেন।`)) + key; }
    }
    el.querySelectorAll("#b12ts [data-k]").forEach(r => r.addEventListener("click", () => { pick = +r.dataset.k; draw(); }));
    el.querySelectorAll(".b12tp button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.k === pick));
  };
  const setView = () => {
    pick = -1; showMom = false;
    const people = view === "crime" ? [0, 1, 2].map(i => L2("Suspect ", "সন্দেহভাজন ") + B12(i + 1)) : [L2("Mr A", "ব্যক্তি ক"), L2("Mr B", "ব্যক্তি খ")];
    $("#b12tb", el).innerHTML = `<div class="svgwrap fit" id="b12ts"></div><p class="hint" style="margin:2px 0 6px">${L2("DNA moves from − to +. Short pieces travel farther, so they are lower down.", "DNA − থেকে +-এর দিকে চলে। ছোট টুকরা বেশি দূর যায়, তাই সেগুলো নিচের দিকে থাকে।")}</p><div class="w-row" style="margin-bottom:6px">${view === "kid" ? `<button class="btn" id="b12tm">${L2("Mother's bands", "মায়ের ব্যান্ড")}</button>` : ""}<div class="chipset b12tp" role="group">${people.map((t, i) => `<button data-k="${i}" aria-pressed="false">${t}</button>`).join("")}</div><button class="btn" id="b12tn">${L2("New case", "নতুন ঘটনা")}</button></div><div class="w-out" id="b12to"></div>`;
    el.querySelectorAll(".b12tp button").forEach(b => b.addEventListener("click", () => { pick = +b.dataset.k; draw(); }));
    $("#b12tn", el).addEventListener("click", () => { if (view === "crime") newCrime(); else newKid(); draw(); });
    if (view === "kid") $("#b12tm", el).addEventListener("click", () => { showMom = true; pick = -1; draw(); });
    draw();
  };
  el.innerHTML = tabs12("b12tv", [["crime", L2("Crime scene", "অপরাধস্থল")], ["kid", L2("Whose child?", "কার সন্তান?")]], view) + `<div id="b12tb" style="margin-top:8px"></div>`;
  chips12(el, ".b12tv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 12.2 sex determination: XX x XY, one birth at a time */
W.b12sex = (el) => {
  let girls = 0, boys = 0, last = -1, note = "";
  const GC = "#b0569a", BC = "#3b76b8";
  el.innerHTML = `<div class="svgwrap fit" id="b12xs"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b12x1">${L2("One baby", "একটি শিশু")}</button><button class="btn" id="b12x100">${L2("100 babies", "১০০টি শিশু")}</button><button class="btn" id="b12xr">${L2("Reset", "আবার শুরু")}</button></div><div class="w-out" id="b12xo"></div>`;
  const sperm = (x, y, t) => `<path d="M${x + 12} ${y} q9 -9 17 0 t17 0" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/><ellipse cx="${x}" cy="${y}" rx="14" ry="11" fill="${t === "Y" ? BC : GC}" fill-opacity=".25" stroke="${t === "Y" ? BC : GC}" stroke-width="2"/>` + T12(x, y + 5, t, "middle", 15, "var(--ink)", "700");
  const egg = (x, y) => `<circle cx="${x}" cy="${y}" r="19" fill="${GC}" fill-opacity=".2" stroke="${GC}" stroke-width="2"/>` + T12(x, y + 5.5, "X", "middle", 16, "var(--ink)", "700");
  const draw = () => {
    const cell = (r, c, x, y, w, h) => { const g = c === 0, on = last === r * 2 + c;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${g ? GC : BC}" fill-opacity="${on ? .38 : .13}"/>` + (on ? `<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="6" fill="none" stroke="var(--ink)" stroke-width="3"/>` : "")
        + T12(x + w / 2, y + 30, g ? "XX" : "XY", "middle", 21, "var(--ink)", "700") + T12(x + w / 2, y + 52, g ? L2("daughter", "কন্যা") : L2("son", "পুত্র"), "middle", 14, "var(--ink)"); };
    const head = (kind, i, x, y, w, h) => kind === "col" ? sperm(x + w / 2 - 14, y + 26, i ? "Y" : "X") + T12(x + w / 2, y + 58, L2("sperm 22 + ", "শুক্রাণু ২২ + ") + (i ? "Y" : "X"), "middle", 13, "var(--muted)")
      : egg(x + w / 2, y + 28) + T12(x + w / 2, y + 62, L2("egg 22 + X", "ডিম্বাণু ২২ + X"), "middle", 13, "var(--muted)");
    let s = `<svg viewBox="0 0 360 262" role="img" aria-label="${L2("Punnett square for the sex of a child", "সন্তানের লিঙ্গ নির্ধারণের পানেট স্কয়ার")}">` + grid12({ x0: 8, y0: 6, hw: 104, hh: 68, cw: 120, ch: 72 }, cell, head);
    s += T12(60, 34, L2("father's →", "বাবার →"), "middle", 13, "var(--muted)") + T12(60, 54, L2("mother's ↓", "মায়ের ↓"), "middle", 13, "var(--muted)");
    const n = girls + boys, gw = n ? Math.round(344 * girls / n) : 172;
    s += `<rect x="8" y="232" width="${gw}" height="20" fill="${GC}" fill-opacity="${n ? .75 : .15}"/><rect x="${8 + gw}" y="232" width="${344 - gw}" height="20" fill="${BC}" fill-opacity="${n ? .75 : .15}"/><rect x="8" y="232" width="344" height="20" rx="4" fill="none" stroke="var(--muted)" stroke-width="1.2"/><line x1="180" y1="228" x2="180" y2="256" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 2"/>`;
    s += n ? T12(14, 247, L2("daughters ", "কন্যা ") + B12(girls), "start", 13, "var(--sheet)", "700") + T12(346, 247, L2("sons ", "পুত্র ") + B12(boys), "end", 13, "var(--sheet)", "700") : T12(180, 247, L2("no babies yet", "এখনো কোনো শিশু নেই"), "middle", 13, "var(--muted)");
    $("#b12xs", el).innerHTML = s + `</svg>`;
    $("#b12xo", el).innerHTML = n ? note + " " + L2(`<b>Total ${n}:</b> daughters ${girls} (${pct12(girls, n)}), sons ${boys} (${pct12(boys, n)}).`, `<b>মোট ${B12(n)}টি:</b> কন্যা ${B12(girls)}টি (${pct12(girls, n)}), পুত্র ${B12(boys)}টি (${pct12(boys, n)})।`)
      : L2("Mother's cells are 44 + XX, so every egg carries X. Father's cells are 44 + XY, so half of the sperms carry X and half carry Y. Which sperm arrives is pure chance.", "মায়ের কোষ ৪৪ + XX, তাই প্রতিটি ডিম্বাণুতে X। বাবার কোষ ৪৪ + XY, তাই অর্ধেক শুক্রাণুতে X আর অর্ধেকে Y। কোন শুক্রাণুটি পৌঁছাবে তা পুরোপুরি দৈবের ব্যাপার।");
  };
  $("#b12x1", el).addEventListener("click", () => { const r = rnd12(2), c = rnd12(2); last = r * 2 + c; if (c) boys++; else girls++;
    note = c ? L2("A <b>Y</b> sperm reached the egg: XY, a son.", "একটি <b>Y</b> শুক্রাণু ডিম্বাণুতে পৌঁছাল: XY, পুত্র।") : L2("An <b>X</b> sperm reached the egg: XX, a daughter.", "একটি <b>X</b> শুক্রাণু ডিম্বাণুতে পৌঁছাল: XX, কন্যা।"); draw(); });
  $("#b12x100", el).addEventListener("click", () => { for (let i = 0; i < 100; i++) { if (rnd12(2)) boys++; else girls++; } last = -1; note = L2("100 more births.", "আরও ১০০টি জন্ম।"); draw(); });
  $("#b12xr", el).addEventListener("click", () => { girls = boys = 0; last = -1; note = ""; draw(); });
  draw();
};

/* 12.3 X-linked colour blindness and autosomal recessive thalassaemia: choose the parents */
W.b12disorder = (el) => {
  let view = "cb", m = 1, f = 1, tm = 1, tf = 1;
  const CBM = [["X", "X"], ["X", "X'"], ["X'", "X'"]], CBF = [["X", "Y"], ["X'", "Y"]], TH = [["R", "R"], ["R", "r"], ["r", "r"]];
  const ST = { ok: ["var(--good-soft)", "var(--good)"], car: ["var(--note-soft)", "var(--note)"], bad: ["var(--bad-soft)", "var(--bad)"] };
  const NAME = { cb: { ok: L2("normal", "স্বাভাবিক"), car: L2("carrier", "বাহক"), bad: L2("colour blind", "বর্ণান্ধ") }, th: { ok: L2("healthy", "সুস্থ"), car: L2("carrier", "বাহক"), bad: L2("thalassaemia major", "থ্যালাসেমিয়া মেজর") } };
  const MANY = { ok: L2("normal", "স্বাভাবিক"), car: L2("carriers", "বাহক"), bad: L2("colour blind", "বর্ণান্ধ") };
  const cbStat = g => g.includes("Y") ? (g.includes("'") ? "bad" : "ok") : (g === "X'X'" ? "bad" : g === "XX'" ? "car" : "ok");
  const thStat = g => g === "rr" ? "bad" : g === "Rr" ? "car" : "ok";
  el.innerHTML = tabs12("b12gv", [["cb", L2("Colour blindness", "বর্ণান্ধতা")], ["th", L2("Thalassaemia", "থ্যালাসেমিয়া")]], view) + `<div id="b12gb" style="margin-top:8px"></div>`;
  const draw = () => {
    const cb = view === "cb", rows = cb ? CBM[m] : TH[tm], cols = cb ? CBF[f] : TH[tf], kids = [];
    const cell = (r, c, x, y, w, h) => { const g = cols[c] === "Y" ? rows[r] + "Y" : [rows[r], cols[c]].sort().join(""), st = cb ? cbStat(g) : thStat(g); kids.push([g, st]);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${ST[st][0]}"/>` + T12(x + w / 2, y + (cb ? 27 : 35), g, "middle", 20, "var(--ink)", "700") + T12(x + w / 2, y + (cb ? 47 : 56), NAME[view][st], "middle", 13, ST[st][1], "700")
        + (cb ? T12(x + w / 2, y + 64, g.includes("Y") ? L2("son", "ছেলে") : L2("daughter", "মেয়ে"), "middle", 13, "var(--muted)") : ""); };
    const head = (kind, i, x, y, w, h) => { const a = kind === "col" ? cols[i] : rows[i]; return `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="17" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>` + T12(x + w / 2, y + h / 2 + 5.5, a, "middle", 16, "var(--ink)", "700"); };
    let s = `<svg viewBox="0 0 360 218" role="img" aria-label="${L2("Punnett square of the chosen parents", "বেছে নেওয়া মা-বাবার পানেট স্কয়ার")}">` + grid12({ x0: 10, y0: 6, hw: 84, hh: 54, cw: 128, ch: 76 }, cell, head);
    s += T12(52, 28, L2("sperm →", "শুক্রাণু →"), "middle", 13, "var(--muted)") + T12(52, 46, L2("egg ↓", "ডিম্বাণু ↓"), "middle", 13, "var(--muted)");
    $("#b12gs", el).innerHTML = s + `</svg>`;
    let t;
    if (cb) {
      const grp = a => a[0] === a[1] ? L2(`all ${MANY[a[0]]}`, `সবাই ${MANY[a[0]]}`) : L2(`half ${MANY[a[0]]}, half ${MANY[a[1]]}`, `অর্ধেক ${MANY[a[0]]}, অর্ধেক ${MANY[a[1]]}`);
      const d = kids.filter(k => !k[0].includes("Y")).map(k => k[1]), b = kids.filter(k => k[0].includes("Y")).map(k => k[1]);
      t = `<b>${L2("Daughters:", "মেয়েরা:")}</b> ${grp(d)}${L2(".", "।")}<br><b>${L2("Sons:", "ছেলেরা:")}</b> ${grp(b)}${L2(".", "।")}<br><span style="font-size:15px">`;
      t += f === 1 && m === 0 ? L2("The father gives his X' to every daughter and his Y to every son, so no son gets the gene from him.", "বাবা তাঁর X' দেন প্রতিটি মেয়েকে আর Y দেন প্রতিটি ছেলেকে, তাই কোনো ছেলেই তাঁর কাছ থেকে জিনটি পায় না।")
        : m === 0 ? L2("No X' anywhere: every child is normal.", "কোথাও X' নেই: সব সন্তানই স্বাভাবিক।")
        : m === 2 ? L2("A son's only X comes from his mother, so every son is colour blind.", "ছেলের একমাত্র X আসে মায়ের কাছ থেকে, তাই সব ছেলেই বর্ণান্ধ।")
        : f === 1 ? L2("The cross in your book: four results, each with a chance of 25%.", "তোমার বইয়ের সংকরায়ণ: চার রকম ফল, প্রতিটির সম্ভাবনা ২৫%।")
        : L2("Both parents see colours normally, yet half of the sons may be colour blind.", "মা-বাবা দুজনই রং স্বাভাবিক দেখেন, তবু ছেলেদের অর্ধেক বর্ণান্ধ হতে পারে।");
      t += `</span>`;
    } else {
      const n = st => kids.filter(k => k[1] === st).length, part = st => `${NAME.th[st]} ${B12(n(st))}/${B12(4)} (${B12(n(st) * 25)}%)`;
      t = `<b>${L2("For each child:", "প্রতিটি সন্তানের জন্য:")}</b> ${["ok", "car", "bad"].filter(n).map(part).join(L2("; ", "; "))}${L2(".", "।")}<br><span style="font-size:15px">`;
      t += n("bad") === 0 ? L2("No child can have thalassaemia major. The disease needs the gene from both parents.", "কোনো সন্তানেরই থ্যালাসেমিয়া মেজর হতে পারে না। রোগ হতে হলে জিনটি মা ও বাবা দুজনের কাছ থেকেই আসতে হয়।")
        : tm === 1 && tf === 1 ? L2("Two healthy carriers: a 1 in 4 risk at every birth. This is why testing before marriage matters.", "দুজন সুস্থ বাহক: প্রতিটি জন্মে চার ভাগের এক ভাগ ঝুঁকি। এ কারণেই বিয়ের আগে পরীক্ষা জরুরি।")
        : n("bad") === 4 ? L2("Both parents have the disease, so every child receives two thalassaemia genes.", "মা-বাবা দুজনই রোগী, তাই প্রতিটি সন্তান দুটি থ্যালাসেমিয়া জিন পায়।")
        : L2("One parent is a patient and the other a carrier: half of the children are at risk.", "একজন রোগী আর অন্যজন বাহক: অর্ধেক সন্তান ঝুঁকিতে।");
      t += `</span>`;
    }
    $("#b12go", el).innerHTML = t;
  };
  const setView = () => {
    const cb = view === "cb";
    const ch = (cls, arr, cur) => `<div class="chipset ${cls}" role="group">${arr.map((a, i) => { const g = a.join(""), st = cb ? cbStat(g) : thStat(g); return `<button data-i="${i}" aria-pressed="${i === cur}">${g} · ${cb ? NAME.cb[st] : (st === "bad" ? L2("patient", "রোগী") : NAME.th[st])}</button>`; }).join("")}</div>`;
    $("#b12gb", el).innerHTML = `<div class="w-row"><span class="hint">${L2("Mother:", "মা:")}</span>${ch("b12gm", cb ? CBM : TH, cb ? m : tm)}</div><div class="w-row" style="margin:6px 0"><span class="hint">${L2("Father:", "বাবা:")}</span>${ch("b12gf", cb ? CBF : TH, cb ? f : tf)}</div><div class="svgwrap fit" id="b12gs"></div><div class="w-out" id="b12go"></div>`;
    chips12(el, ".b12gm", b => { if (cb) m = +b.dataset.i; else tm = +b.dataset.i; draw(); });
    chips12(el, ".b12gf", b => { if (cb) f = +b.dataset.i; else tf = +b.dataset.i; draw(); });
    draw();
  };
  chips12(el, ".b12gv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 12.4 from the hot young earth to many-celled life; allele frequency and the meaning of evolution */
W.b12origin = (el) => {
  let view = "story", step = 0, opt = "lessA";
  const SEA = "#3b76b8", ROCK = "#8a6a4a", AA = "#c9781f", NA = "#8a6fb5", GRN = "#3f9d5a", AMB = "#d8a520";
  const sub = s => s.replace(/(\d)/g, "<tspan baseline-shift=\"sub\" font-size=\"11\">$1</tspan>");
  const squig = (x, y, n, c, w = 3) => { let d = `M${x} ${y}`; for (let i = 0; i < n; i++) d += ` q5 ${i % 2 ? 9 : -9} 10 0`; return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
  const land = () => `<path d="M236 150 L286 62 H306 L356 150 Z" fill="#7a5a48"/><path d="M286 62 H306 L300 76 H292 Z" fill="#d9532b"/><path d="M0 146 H360 V200 H0 Z" fill="${ROCK}" opacity=".75"/>`;
  const sea = () => `<path d="M0 138 q20 -7 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V200 H0 Z" fill="${SEA}" opacity=".6"/>`;
  const cloud = (x, y) => `<g fill="var(--muted)" opacity=".55"><ellipse cx="${x}" cy="${y}" rx="26" ry="12"/><ellipse cx="${x - 16}" cy="${y + 5}" rx="16" ry="9"/><ellipse cx="${x + 18}" cy="${y + 5}" rx="18" ry="9"/></g>`;
  const water = () => `<rect x="0" y="0" width="360" height="200" fill="${SEA}" opacity=".16"/><path d="M0 22 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="${SEA}" stroke-width="2.5"/>`;
  const protein = (x, y) => [[0, -9], [10, 8], [20, -9], [30, 8], [40, -9]].map(([a, b]) => `<circle cx="${x + a + 5}" cy="${y + b}" r="6" fill="${AA}"/>`).join("");
  const SC = [
    () => `<defs><radialGradient id="b12og"><stop offset="0" stop-color="#ffd27a"/><stop offset=".7" stop-color="#ee7a33"/><stop offset="1" stop-color="#c2412a"/></radialGradient></defs><circle cx="180" cy="100" r="72" fill="url(#b12og)"/><path d="M140 80 q20 -14 36 4 M190 120 q22 10 34 -10 M150 130 q14 12 26 0" fill="none" stroke="#c2412a" stroke-width="3" opacity=".6"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="180" y1="16" x2="180" y2="4" stroke="#ee7a33" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 180 100)"/>`).join(""),
    () => land() + sea() + cloud(70, 34) + cloud(160, 26) + cloud(240, 40) + [40, 62, 84, 106, 128, 150, 172, 194, 216].map((x, i) => `<line x1="${x}" y1="${58 + i % 3 * 8}" x2="${x - 6}" y2="${80 + i % 3 * 8}" stroke="${SEA}" stroke-width="2.5" stroke-linecap="round"/><line x1="${x + 6}" y1="${96 + i % 2 * 9}" x2="${x}" y2="${116 + i % 2 * 9}" stroke="${SEA}" stroke-width="2.5" stroke-linecap="round"/>`).join("") + T12(110, 178, L2("sea", "সমুদ্র"), "middle", 14, "var(--sheet)", "700"),
    () => land() + sea() + `<g fill="var(--muted)" opacity=".5"><circle cx="296" cy="50" r="10"/><circle cx="306" cy="36" r="12"/><circle cx="292" cy="24" r="9"/></g><path d="M222 6 l-12 26 h9 l-11 26" fill="none" stroke="${AMB}" stroke-width="3.5" stroke-linejoin="round"/>`
      + [["CH4", 34, 36], ["NH3", 100, 24], ["H2S", 160, 48], ["H2O", 44, 84], ["N2", 172, 96], ["CO2", 110, 70]].map(([g, x, y]) => `<text x="${x}" y="${y}" font-size="15" font-weight="700" fill="var(--ink)" text-anchor="middle">${sub(g)}</text>`).join("")
      + `<text x="52" y="124" font-size="15" font-weight="700" fill="var(--bad)" text-anchor="middle">${sub("O2")}</text><line x1="36" y1="130" x2="68" y2="108" stroke="var(--bad)" stroke-width="2.5"/>` + T12(96, 124, L2("none", "নেই"), "middle", 13, "var(--bad)") + T12(246, 22, "UV", "start", 13, "var(--note)", "700") + `<path d="M252 28 l-8 22 M266 28 l-8 22" stroke="var(--note)" stroke-width="2" stroke-dasharray="4 3"/>`,
    () => water() + `<path d="M176 0 l-10 22 h8 l-9 20" fill="none" stroke="${AMB}" stroke-width="3" stroke-linejoin="round"/>` + [[50, 70], [90, 120], [66, 150], [130, 84], [40, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${AA}"/>`).join("") + squig(210, 80, 5, NA) + squig(250, 130, 4, NA) + squig(190, 160, 5, NA)
      + T12(86, 186, L2("amino acids", "অ্যামাইনো এসিড"), "middle", 13.5, "var(--ink)", "700") + T12(250, 186, L2("nucleic acids", "নিউক্লিক এসিড"), "middle", 13.5, "var(--ink)", "700"),
    () => water() + squig(40, 96, 5, NA, 4) + protein(40, 96) + `<path d="M118 96 H158" stroke="var(--ink)" stroke-width="2.5"/><path d="M168 96 l-11 -6 v12 z" fill="var(--ink)"/>` + squig(196, 66, 5, NA, 4) + protein(196, 66) + squig(196, 128, 5, NA, 4) + protein(196, 128)
      + T12(66, 140, L2("nucleoprotein", "নিউক্লিওপ্রোটিন"), "middle", 13.5, "var(--ink)", "700") + T12(286, 100, L2("copies", "নিজের নকল"), "middle", 13, "var(--muted)") + T12(286, 116, L2("itself", "বানায়"), "middle", 13, "var(--muted)"),
    () => water() + `<circle cx="80" cy="100" r="24" fill="${AA}" fill-opacity=".3" stroke="${AA}" stroke-width="2.5"/>` + squig(60, 100, 4, NA) + `<path d="M124 100 H170" stroke="var(--ink)" stroke-width="2.5"/><path d="M180 100 l-11 -6 v12 z" fill="var(--ink)"/><path d="M250 58 l34 20 v40 l-34 20 l-34 -20 v-40 z" fill="${AA}" fill-opacity=".3" stroke="${AA}" stroke-width="3" stroke-linejoin="round"/>` + squig(228, 98, 4, NA, 3.5)
      + T12(80, 150, L2("protovirus", "প্রোটোভাইরাস"), "middle", 13.5, "var(--ink)", "700") + T12(250, 162, L2("virus", "ভাইরাস"), "middle", 13.5, "var(--ink)", "700"),
    () => water() + `<path d="M246 96 q16 -18 30 0 t30 0 t26 0" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="92" y="62" width="156" height="70" rx="35" fill="${GRN}" fill-opacity=".22" stroke="var(--ink)" stroke-width="4"/><rect x="92" y="62" width="156" height="70" rx="35" fill="none" stroke="${GRN}" stroke-width="1.5"/>` + squig(126, 90, 5, NA, 3.5) + squig(150, 108, 5, NA, 3.5) + [[116, 112], [206, 84], [222, 104], [196, 114]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="var(--ink)"/>`).join("")
      + T12(170, 156, L2("bacterium: DNA lies free, no true nucleus", "ব্যাকটেরিয়া: DNA মুক্ত, সুগঠিত নিউক্লিয়াস নেই"), "middle", 13, "var(--ink)", "700"),
    () => water() + `<path d="M96 96 q-10 -40 34 -38 q20 -22 48 -6 q40 -14 56 22 q30 20 4 44 q-6 30 -44 22 q-30 22 -56 0 q-40 6 -42 -44 z" fill="${AMB}" fill-opacity=".25" stroke="var(--ink)" stroke-width="2.5"/><circle cx="170" cy="100" r="22" fill="${NA}" fill-opacity=".45" stroke="${NA}" stroke-width="3"/><circle cx="170" cy="100" r="7" fill="${NA}"/><circle cx="224" cy="96" r="9" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.5"/><circle cx="124" cy="118" r="6" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.5"/>`
      + T12(170, 172, L2("protozoan: a well-formed nucleus", "প্রোটোজোয়া: সুগঠিত নিউক্লিয়াস"), "middle", 13, "var(--ink)", "700"),
    () => water() + `<circle cx="32" cy="2" r="16" fill="${AMB}"/><path d="M52 14 l22 22 M40 26 l12 28 M62 4 l28 10" stroke="${AMB}" stroke-width="3" stroke-linecap="round"/><ellipse cx="150" cy="118" rx="56" ry="40" fill="${GRN}" fill-opacity=".25" stroke="var(--ink)" stroke-width="2.5"/>` + [[122, 108], [150, 132], [176, 104], [146, 98], [176, 130], [124, 132]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="${GRN}"/>`).join("")
      + [[232, 112, 9], [250, 78, 11], [236, 46, 8], [272, 50, 10]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--sheet)" fill-opacity=".7" stroke="${SEA}" stroke-width="2"/>`).join("") + `<text x="292" y="86" font-size="16" font-weight="700" fill="${SEA}">${sub("O2")}</text><path d="M252 32 V8" stroke="${SEA}" stroke-width="2.5"/><path d="M252 0 l-6 10 h12 z" fill="${SEA}"/>` + T12(150, 180, L2("chlorophyll", "ক্লোরোফিল"), "middle", 13.5, "var(--ink)", "700"),
    () => water() + [[52, 80], [70, 70], [72, 92], [90, 82], [56, 102], [78, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${AMB}" fill-opacity=".3" stroke="var(--ink)" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="3.5" fill="${NA}"/>`).join("")
      + `<path d="M150 190 q-14 -30 0 -56 q14 -26 0 -56 M170 190 q12 -30 0 -52 q-10 -22 2 -40" fill="none" stroke="${GRN}" stroke-width="6" stroke-linecap="round"/><path d="M226 74 q28 -40 56 0 z" fill="${NA}" fill-opacity=".5" stroke="${NA}" stroke-width="2"/><path d="M234 76 q-6 16 2 30 M246 76 q6 18 -2 34 M258 76 q-6 16 4 32 M272 76 q6 14 -2 28" fill="none" stroke="${NA}" stroke-width="2"/><path d="M214 160 q16 -18 32 0 t32 0 t30 -4" fill="none" stroke="${AA}" stroke-width="7" stroke-linecap="round"/>`
      + T12(72, 142, L2("many cells", "বহু কোষ"), "middle", 13, "var(--ink)", "700")];
  const TXT = [
    [L2("A hot young earth", "উত্তপ্ত নবীন পৃথিবী"), L2("About 450 crore years ago the earth is a glowing hot mass. It keeps giving out heat and slowly cools.", "প্রায় ৪৫০ কোটি বছর আগে পৃথিবী একটি জ্বলন্ত উত্তপ্ত পিণ্ড। এটি তাপ ছড়াতে ছড়াতে ধীরে ধীরে ঠান্ডা হয়।")],
    [L2("Crust, clouds, rain, sea", "বহিঃস্তর, মেঘ, বৃষ্টি, সমুদ্র"), L2("The outside hardens into a solid crust. Water vapour forms clouds, rain falls for ages, and the seas appear.", "বাইরের দিকটা শক্ত হয়ে কঠিন বহিঃস্তর হয়। জলীয় বাষ্প থেকে মেঘ হয়, দীর্ঘকাল বৃষ্টি পড়ে, আর সমুদ্রের আবির্ভাব ঘটে।")],
    [L2("An air without oxygen", "অক্সিজেনহীন বায়ুমণ্ডল"), L2("The air has methane, ammonia, hydrogen sulphide, water vapour, nitrogen and carbon dioxide, but no oxygen. Volcanic heat, lightning and ultraviolet rays supply energy.", "বাতাসে আছে মিথেন, অ্যামোনিয়া, হাইড্রোজেন সালফাইড, জলীয় বাষ্প, নাইট্রোজেন ও কার্বন ডাই-অক্সাইড, কিন্তু অক্সিজেন নেই। অগ্ন্যুৎপাতের তাপ, বজ্রপাত ও অতিবেগুনি রশ্মি শক্তি জোগায়।")],
    [L2("Building units form", "গাঠনিক একক তৈরি"), L2("With that energy the simple compounds join and form amino acids and nucleic acids.", "সেই শক্তিতে সরল যৌগগুলো মিলিত হয়ে অ্যামাইনো এসিড ও নিউক্লিক এসিড তৈরি করে।")],
    [L2("A molecule that copies itself", "নিজের নকল বানানো অণু"), L2("Amino acids and nucleic acids combine into nucleoprotein. It gains the power of replication, and life begins. Up to here the story is called <b>chemical evolution</b>.", "অ্যামাইনো এসিড ও নিউক্লিক এসিড মিলে হয় নিউক্লিওপ্রোটিন। এটি প্রতিরূপ গঠনের ক্ষমতা পায়, আর জীবনের সূত্রপাত ঘটে। এ পর্যন্ত গল্পটির নাম <b>রাসায়নিক অভিব্যক্তি</b>।")],
    [L2("Protovirus and virus", "প্রোটোভাইরাস ও ভাইরাস"), L2("In your book's sequence, nucleoprotein gives rise to the protovirus and then the virus: a state between the living and the non-living. (Scientists still discuss this step.)", "তোমার বইয়ের ক্রমে নিউক্লিওপ্রোটিন থেকে আসে প্রোটোভাইরাস, তারপর ভাইরাস: জীব ও জড়ের মধ্যবর্তী অবস্থা। (এই ধাপটি নিয়ে বিজ্ঞানীরা এখনো আলোচনা করছেন।)")],
    [L2("Bacteria", "ব্যাকটেরিয়া"), L2("The first true cells. Their nucleus is of a primitive kind, so they are called prokaryotic cells.", "প্রথম সত্যিকারের কোষ। এদের নিউক্লিয়াস আদি প্রকৃতির, তাই এদের বলে আদি কোষ।")],
    [L2("Protozoa", "প্রোটোজোয়া"), L2("Later come single cells with a well-formed nucleus.", "পরে আসে সুগঠিত নিউক্লিয়াসযুক্ত এককোষী জীব।")],
    [L2("Chlorophyll and oxygen", "ক্লোরোফিল ও অক্সিজেন"), L2("Chlorophyll forms in some single-celled organisms. They make their own food, and oxygen comes out as a by-product. Now aerobic organisms can increase.", "কিছু এককোষী জীবে ক্লোরোফিল সৃষ্টি হয়। এরা নিজের খাদ্য সংশ্লেষ করে, আর উপজাত হিসেবে অক্সিজেন বের হয়। এবার সবাত শ্বসনকারী জীব বাড়তে পারে।")],
    [L2("Many-celled life", "বহুকোষী জীব"), L2("Multicellular organisms arise from single cells, and then more and more complex ones. Evolution goes on in countless branches at once, not in one straight line.", "এককোষী থেকে আসে বহুকোষী জীব, তারপর জটিল থেকে জটিলতর জীব। অভিব্যক্তি চলে অসংখ্য শাখা-প্রশাখায় একসাথে, একটি সরলরেখায় নয়।")]];
  const drawStory = () => {
    let s = `<svg viewBox="0 0 360 222" role="img" aria-label="${TXT[step][0]}"><clipPath id="b12oc"><rect x="0" y="0" width="360" height="200" rx="10"/></clipPath><rect x="0" y="0" width="360" height="200" rx="10" fill="var(--paper)"/><g clip-path="url(#b12oc)">${SC[step]()}</g><rect x="0" y="0" width="360" height="200" rx="10" fill="none" stroke="var(--rule)" stroke-width="1.5"/>`;
    for (let i = 0; i < 10; i++) s += `<circle cx="${81 + i * 22}" cy="213" r="${i === step ? 6 : 4}" fill="${i === step ? "var(--c)" : i < step ? "var(--muted)" : "var(--rule)"}"/>`;
    $("#b12os", el).innerHTML = s + `</svg>`;
    $("#b12on", el).textContent = L2(`Step ${step + 1} of 10`, `ধাপ ${B12(step + 1)} / ১০`);
    $("#b12oo", el).innerHTML = `<b>${TXT[step][0]}.</b> ${TXT[step][1]}`;
  };
  const GEN = { same: [8, 8, 4], lessA: [4, 8, 8], moreA: [14, 4, 2], mix: [10, 4, 6] };
  const drawAllele = () => {
    const pop = (y, [AAn, Aan], title) => { let g = T12(10, y, title, "start", 13, "var(--ink)", "700"); const nA = AAn * 2 + Aan;
      for (let i = 0; i < 20; i++) { const x = 27 + (i % 10) * 34, yy = y + 20 + Math.floor(i / 10) * 24, a = i < AAn ? "AA" : i < AAn + Aan ? "Aa" : "aa";
        g += `<rect x="${x - 15}" y="${yy - 9}" width="30" height="18" rx="9" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1"/><circle cx="${x - 6.5}" cy="${yy}" r="6" fill="${a[0] === "A" ? GRN : AMB}"/><circle cx="${x + 6.5}" cy="${yy}" r="6" fill="${a[1] === "A" ? GRN : AMB}"/>`; }
      g += T12(10, y + 73, "A:", "start", 13, "var(--ink)", "700") + `<rect x="34" y="${y + 62}" width="208" height="14" rx="3" fill="${AMB}"/><rect x="34" y="${y + 62}" width="${208 * nA / 40}" height="14" rx="3" fill="${GRN}"/>` + T12(350, y + 74, B12(nA) + "/" + B12(40) + " = " + B12(nA * 2.5) + "%", "end", 13.5, "var(--ink)", "700");
      return g; };
    const cnt = a => L2(`${a[0]} AA, ${a[1]} Aa, ${a[2]} aa`, `${B12(a[0])}টি AA, ${B12(a[1])}টি Aa, ${B12(a[2])}টি aa`), g1 = GEN.same, g2 = GEN[opt];
    let s = `<svg viewBox="0 0 360 212" role="img" aria-label="${L2("Alleles in two generations of a population", "একটি পপুলেশনের দুই প্রজন্মের অ্যালিল")}">` + pop(16, g1, L2("Earlier generation: ", "আগের প্রজন্ম: ") + cnt(g1)) + pop(122, g2, L2("Later generation: ", "পরের প্রজন্ম: ") + cnt(g2));
    $("#b12os", el).innerHTML = s + `</svg>`;
    const f1 = 60, f2 = (g2[0] * 2 + g2[1]) * 2.5;
    $("#b12oo", el).innerHTML = (f1 === f2 ? (opt === "same" ? L2("Nothing has changed: the share of A is 60% in both generations. <b>No evolution.</b>", "কিছুই বদলায়নি: দুই প্রজন্মেই A-এর অংশ ৬০%। <b>অভিব্যক্তি ঘটেনি।</b>")
      : L2("The animals are mixed differently, but count the alleles: A is still 24 out of 40 = 60%. The allele frequency has not changed, so by the modern definition <b>no evolution</b> has taken place.", "প্রাণীগুলোর মিশ্রণ আলাদা, কিন্তু অ্যালিল গুনে দেখো: A এখনো ৪০টির মধ্যে ২৪টি = ৬০%। অ্যালিল ফ্রিকোয়েন্সি বদলায়নি, তাই আধুনিক সংজ্ঞায় <b>অভিব্যক্তি ঘটেনি</b>।"))
      : L2(`The share of A has gone from 60% to ${f2}%. The allele frequency has changed between generations: <b>evolution has taken place</b> in this population.`, `A-এর অংশ ৬০% থেকে ${B12(f2)}% হয়েছে। প্রজন্ম থেকে প্রজন্মে অ্যালিল ফ্রিকোয়েন্সি বদলেছে: এই পপুলেশনে <b>অভিব্যক্তি ঘটেছে</b>।`))
      + `<br><span style="font-size:14px">${sw12(GRN, L2("allele A", "A অ্যালিল"))} &nbsp; ${sw12(AMB, L2("allele a", "a অ্যালিল"))} &nbsp; ${L2("each animal has two", "প্রতিটি প্রাণীর দুটি করে")}</span>`;
  };
  const setView = () => {
    const b = $("#b12ob", el);
    if (view === "story") {
      b.innerHTML = `<div class="svgwrap fit" id="b12os"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b12ox">${L2("Next", "পরের ধাপ")} ▶</button><button class="btn" id="b12op">◀ ${L2("Back", "আগের ধাপ")}</button><span class="hint" id="b12on"></span></div><div class="w-out" id="b12oo"></div>`;
      $("#b12ox", el).addEventListener("click", () => { step = (step + 1) % 10; drawStory(); });
      $("#b12op", el).addEventListener("click", () => { step = (step + 9) % 10; drawStory(); });
      drawStory();
    } else {
      b.innerHTML = `<div class="w-row" style="margin-bottom:6px"><span class="hint">${L2("Later generation:", "পরের প্রজন্ম:")}</span>` + tabs12("b12og2", [["same", L2("Same as before", "আগের মতোই")], ["lessA", L2("More aa", "aa বেশি")], ["moreA", L2("More AA", "AA বেশি")], ["mix", L2("Different mix", "ভিন্ন মিশ্রণ")]], opt) + `</div><div class="svgwrap fit" id="b12os"></div><div class="w-out" id="b12oo"></div>`;
      chips12(el, ".b12og2", q => { opt = q.dataset.v; drawAllele(); });
      drawAllele();
    }
  };
  el.innerHTML = tabs12("b12ov", [["story", L2("Story of life", "জীবনের গল্প")], ["allele", L2("Is it evolution?", "অভিব্যক্তি ঘটছে কি?")]], view) + `<div id="b12ob" style="margin-top:8px"></div>`;
  chips12(el, ".b12ov", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 12.4.2 natural selection on beetles; homologous forelimbs */
W.b12select = (el) => {
  let view = "sel", bg = "b", bugs = [], phase = "hunt", gen = 0, hist = [50], note = "", bone = "all";
  const COL = { g: ["#5aa646", "#2c6422"], b: ["#8a5a33", "#4a2c14"] }, BGC = { g: "#74b85c", b: "#9c7651" };
  const N = 30, MAXG = 10;
  const place = cols => shuf12(cols).map((c, i) => ({ c, dead: false, x: 36 + (i % 6) * 57.6 + rnd12(21) - 10, y: 24 + Math.floor(i / 6) * 36 + rnd12(13) - 6, r: rnd12(360) }));
  const reset = () => { bugs = place(Array.from({ length: N }, (_, i) => i < N / 2 ? "g" : "b")); phase = "hunt"; gen = 0; hist = [50]; note = ""; };
  const cnt = (c, alive) => bugs.filter(b => b.c === c && (!alive || !b.dead)).length;
  const cname = c => c === "g" ? L2("green", "সবুজ") : L2("brown", "বাদামি");
  const drawSel = () => {
    let s = `<svg viewBox="0 0 360 192" role="img" aria-label="${L2("Green and brown beetles on a background", "পটভূমির ওপর সবুজ ও বাদামি বিটল")}"><clipPath id="b12nc"><rect x="0" y="0" width="360" height="192" rx="10"/></clipPath><g clip-path="url(#b12nc)"><rect x="0" y="0" width="360" height="192" fill="${BGC[bg]}"/>`;
    if (bg === "b") for (let i = 0; i < 9; i++) s += `<path d="M${14 + i * 42} 0 q10 48 -4 96 t4 96" fill="none" stroke="#6b4a2e" stroke-width="${2 + i % 3}" opacity=".45"/>`;
    else for (let i = 0; i < 6; i++) s += `<path d="M${-20 + i * 70} ${i % 2 ? 150 : 60} q60 -60 120 0 q-60 60 -120 0 z M${-20 + i * 70} ${i % 2 ? 150 : 60} h120" fill="#63a84d" stroke="#4d8a3a" stroke-width="1.5" opacity=".8"/>`;
    bugs.forEach(b => { const [f, k] = COL[b.c];
      s += `<g transform="translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.r})" opacity="${b.dead ? .28 : 1}"><path d="M-6 -6 l-4 -6 M0 -7 v-7 M6 -6 l4 -6 M-6 6 l-4 6 M0 7 v7 M6 6 l4 6" stroke="${k}" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="0" rx="11" ry="8" fill="${f}" stroke="${k}" stroke-width="1.5"/><path d="M-10 0 H8" stroke="${k}" stroke-width="1.2"/><circle cx="12" cy="0" r="4.2" fill="${k}"/></g>`;
      if (b.dead) s += `<path d="M${b.x - 8} ${b.y - 8} l16 16 m0 -16 l-16 16" stroke="var(--bad)" stroke-width="3" stroke-linecap="round"/>`; });
    $("#b12ns", el).innerHTML = s + `</g></svg>`;
    /* graph: share of each colour over the generations */
    const GX = g => 46 + g * 29.4, GY = p => 92 - p * .76;
    let g = `<svg viewBox="0 0 360 134" role="img" aria-label="${L2("Share of brown and green beetles in each generation", "প্রতি প্রজন্মে বাদামি ও সবুজ বিটলের অংশ")}">`;
    [0, 50, 100].forEach(p => g += `<line x1="46" y1="${GY(p)}" x2="340" y2="${GY(p)}" stroke="var(--rule)" stroke-width="1.2"/>` + T12(40, GY(p) + 4.5, B12(p) + "%", "end", 13, "var(--muted)"));
    for (let i = 0; i <= MAXG; i += 2) g += T12(GX(i), 110, B12(i), "middle", 13, "var(--muted)");
    g += T12(193, 129, L2("generation", "প্রজন্ম"), "middle", 13, "var(--muted)");
    [["b", p => p], ["g", p => 100 - p]].forEach(([c, fn]) => { g += `<polyline points="${hist.map((p, i) => GX(i).toFixed(1) + "," + GY(fn(p)).toFixed(1)).join(" ")}" fill="none" stroke="${COL[c][0]}" stroke-width="3" stroke-linejoin="round"/>` + hist.map((p, i) => `<circle cx="${GX(i).toFixed(1)}" cy="${GY(fn(p)).toFixed(1)}" r="4" fill="${COL[c][0]}" stroke="var(--sheet)" stroke-width="1.2"/>`).join(""); });
    $("#b12ng", el).innerHTML = g + `</svg>`;
    const h = $("#b12nh", el), n = $("#b12nb", el), over = gen >= MAXG && phase === "hunt";
    h.disabled = phase !== "hunt" || over; n.disabled = phase !== "breed"; [h, n].forEach(b => b.style.opacity = b.disabled ? .45 : 1);
    const share = `<b>${L2(`Generation ${gen}:`, `প্রজন্ম ${B12(gen)}:`)}</b> ${L2(`brown ${cnt("b")}, green ${cnt("g")}`, `বাদামি ${B12(cnt("b"))}টি, সবুজ ${B12(cnt("g"))}টি`)}${L2(".", "।")} `;
    $("#b12no", el).innerHTML = share + (note || L2(`The beetles are on ${bg === "b" ? "brown bark" : "green leaves"}. Which colour will the birds find more easily?`, `বিটলগুলো আছে ${bg === "b" ? "বাদামি বাকলের" : "সবুজ পাতার"} ওপর। পাখিরা কোন রঙের বিটল সহজে খুঁজে পাবে?`))
      + (over ? " " + L2("Ten generations are done. Press Reset, or change the background.", "দশ প্রজন্ম শেষ। “আবার শুরু” চাপো, অথবা পটভূমি বদলাও।") : "")
      + `<br><span style="font-size:14px">${sw12(COL.b[0], L2("brown share", "বাদামির অংশ"))} &nbsp; ${sw12(COL.g[0], L2("green share", "সবুজের অংশ"))}</span>`;
  };
  const hunt = () => {
    const before = { g: cnt("g"), b: cnt("b") };
    bugs.forEach(b => b.dead = Math.random() < (b.c === bg ? .2 : .5));
    if (!bugs.some(b => !b.dead)) bugs[rnd12(N)].dead = false;
    const eg = before.g - cnt("g", true), eb = before.b - cnt("b", true), easy = bg === "b" ? "g" : "b";
    note = L2(`Birds ate ${eg} of the ${before.g} green and ${eb} of the ${before.b} brown beetles. The ${cname(easy)} ones stand out against the background.`, `পাখিরা ${B12(before.g)}টি সবুজ বিটলের ${B12(eg)}টি আর ${B12(before.b)}টি বাদামি বিটলের ${B12(eb)}টি খেয়ে ফেলেছে। এই পটভূমিতে ${cname(easy)} বিটল সহজেই চোখে পড়ে।`);
    phase = "breed"; drawSel();
  };
  const breed = () => {
    const alive = bugs.filter(b => !b.dead);
    bugs = place(Array.from({ length: N }, () => alive[rnd12(alive.length)].c)); gen++; hist.push(Math.round(cnt("b") / N * 100));
    const lost = ["g", "b"].find(c => cnt(c) === 0);
    note = lost ? L2(`No ${cname(lost)} beetles are left. With no variation, selection has nothing more to choose between.`, `${cname(lost)} বিটল আর একটিও নেই। প্রকরণ না থাকলে নির্বাচনের বাছার মতো কিছুই থাকে না।`)
      : L2("The survivors bred, and the young have the colour of their parents. No beetle changed its own colour.", "বেঁচে থাকা বিটলরা বংশবৃদ্ধি করেছে, আর বাচ্চারা পেয়েছে মা-বাবার রং। কোনো বিটল নিজের রং বদলায়নি।");
    phase = "hunt"; drawSel();
  };

  /* forelimbs: [name, offset, soft outline, humerus, forearm (2 bones), wrist dots, digits] */
  const BC = { h: "#c8473d", f: "#3b76b8", w: "#d8a520", d: "#3f9d5a" };
  const LIMB = [
    [L2("Human arm", "মানুষের হাত"), [0, 14], `<path d="M30 30 L78 62 L130 90 L160 98" fill="none" stroke="var(--muted)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity=".16"/>`, [[30, 30], [78, 62]], [[[78, 59], [128, 85]], [[76, 67], [125, 93]]], [[134, 89], [139, 95], [133, 97], [139, 102]],
      [[[141, 87], [150, 78], [157, 70]], [[145, 92], [160, 90], [173, 88]], [[146, 97], [162, 98], [176, 99]], [[145, 102], [160, 106], [172, 110]], [[142, 106], [153, 113], [162, 119]]]],
    [L2("Bat wing", "বাদুড়ের ডানা"), [180, 14], `<path d="M22 84 L52 58 L112 33 L172 22 L174 74 L150 108 L112 126 L40 112 Z" fill="var(--muted)" opacity=".16"/>`, [[22, 84], [52, 58]], [[[52, 57], [108, 33]], [[55, 63], [100, 43]]], [[112, 33], [116, 38], [110, 39]],
      [[[115, 29], [121, 19]], [[118, 33], [150, 26], [172, 22]], [[118, 37], [150, 52], [174, 74]], [[116, 40], [138, 72], [150, 108]], [[112, 42], [116, 84], [112, 126]]]],
    [L2("Whale flipper", "তিমির ফ্লিপার"), [0, 172], `<path d="M16 42 Q50 22 100 40 Q160 56 174 80 Q150 114 104 114 Q58 110 28 78 Z" fill="var(--muted)" opacity=".16"/>`, [[30, 48], [56, 58]], [[[58, 55], [90, 62]], [[55, 65], [86, 75]]], [[97, 62], [95, 70], [102, 67], [93, 79], [100, 76]],
      [[[104, 59], [124, 57]], [[108, 65], [136, 68], [162, 75]], [[107, 72], [134, 80], [156, 91]], [[104, 80], [124, 93], [138, 103]], [[98, 85], [110, 99]]]],
    [L2("Bird wing", "পাখির ডানা"), [180, 172], `<path d="M20 94 L60 52 L116 60 L172 48 L168 112 L112 128 L50 124 Z" fill="var(--muted)" opacity=".16"/>`, [[22, 90], [60, 56]], [[[61, 54], [112, 61]], [[60, 61], [110, 70]]], [[116, 62], [115, 69]],
      [[[120, 61], [152, 54], [172, 50]], [[120, 67], [150, 60]], [[121, 58], [131, 48]]]]];
  const BTXT = {
    all: L2("Four limbs for four jobs: holding, flying, swimming, flying. Yet each has the same bones in the same order. These are <b>homologous organs</b>.", "চার রকম কাজের চারটি অঙ্গ: ধরা, ওড়া, সাঁতার, ওড়া। অথচ প্রতিটিতে একই হাড় একই ক্রমে আছে। এরা <b>সমসংস্থ অঙ্গ</b>।"),
    h: L2("<b>One bone in the upper arm</b> (the humerus). Long in the human arm, short and thick in the whale.", "<b>বাহুতে একটি হাড়</b> (হিউমেরাস)। মানুষের হাতে লম্বা, তিমিতে খাটো ও মোটা।"),
    f: L2("<b>Two bones in the forearm</b> (the radius and the ulna), side by side in all four.", "<b>অগ্রবাহুতে দুটি হাড়</b> (রেডিয়াস ও আলনা), চারটিতেই পাশাপাশি।"),
    w: L2("<b>A group of small wrist bones</b> (the carpals).", "<b>কবজির একগুচ্ছ ছোট হাড়</b> (কার্পাল)।"),
    d: L2("<b>The bones of the hand and fingers.</b> In the bat they are very long and hold the wing membrane. In the whale they are many short pieces inside the flipper. In the bird they are few and partly joined.", "<b>হাতের তালু ও আঙুলের হাড়।</b> বাদুড়ে এগুলো খুব লম্বা, ডানার পর্দা টেনে ধরে। তিমিতে এগুলো ফ্লিপারের ভেতরে অনেকগুলো ছোট ছোট টুকরা। পাখিতে এগুলো সংখ্যায় কম, আংশিক জোড়া লাগা।") };
  const drawBone = () => {
    const op = k => bone === "all" || bone === k ? 1 : .28, pts = a => a.map(p => p.join(",")).join(" "), hit = a => `<polyline points="${pts(a)}" fill="none" stroke="transparent" stroke-width="18" stroke-linecap="round"/>`;
    let s = `<svg viewBox="0 0 360 334" role="img" aria-label="${L2("Forelimb bones of a human, a bat, a whale and a bird", "মানুষ, বাদুড়, তিমি ও পাখির অগ্রপদের হাড়")}"><path d="M180 6 V328 M6 168 H354" stroke="var(--rule)" stroke-width="1.5"/>`;
    LIMB.forEach(([nm, [ox, oy], skin, h, f, w, d], li) => {
      s += `<g transform="translate(${ox} ${oy})"><g style="pointer-events:none">${skin}</g><g data-b="h" style="cursor:pointer" opacity="${op("h")}">${hit(h)}<polyline points="${pts(h)}" fill="none" stroke="${BC.h}" stroke-width="${li === 2 ? 11 : 8}" stroke-linecap="round"/></g><g data-b="f" style="cursor:pointer" opacity="${op("f")}">${f.map(hit).join("")}${f.map(b => `<polyline points="${pts(b)}" fill="none" stroke="${BC.f}" stroke-width="${li === 2 ? 7 : 5}" stroke-linecap="round"/>`).join("")}</g><g data-b="w" style="cursor:pointer" opacity="${op("w")}">${w.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="transparent"/>`).join("")}${w.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.3" fill="${BC.w}"/>`).join("")}</g>`;
      s += `<g data-b="d" style="cursor:pointer" opacity="${op("d")}">${d.map(hit).join("")}${d.map(b => `<polyline points="${pts(b)}" fill="none" stroke="${BC.d}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"${li === 2 ? ` stroke-dasharray="7 4"` : ""}/>` + (li === 2 ? "" : b.slice(1, -1).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="var(--sheet)"/>`).join(""))).join("")}</g>` + T12(90, 146, nm, "middle", 14, "var(--ink)", "700") + `</g>`;
    });
    $("#b12ns", el).innerHTML = s + `</svg>`;
    $("#b12no", el).innerHTML = BTXT[bone];
    el.querySelectorAll("#b12ns [data-b]").forEach(g => g.addEventListener("click", () => { bone = bone === g.dataset.b ? "all" : g.dataset.b; el.querySelectorAll(".b12nq button").forEach(q => q.setAttribute("aria-pressed", q.dataset.v === bone)); drawBone(); }));
  };
  const setView = () => {
    const b = $("#b12nv", el);
    if (view === "sel") {
      b.innerHTML = `<div class="w-row" style="margin-bottom:6px"><span class="hint">${L2("Background:", "পটভূমি:")}</span>` + tabs12("b12nk", [["b", L2("Brown bark", "বাদামি বাকল")], ["g", L2("Green leaves", "সবুজ পাতা")]], bg) + `</div><div class="svgwrap fit" id="b12ns"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b12nh">${L2("Birds hunt", "পাখি শিকার করুক")}</button><button class="btn solid" id="b12nb">${L2("Next generation", "পরের প্রজন্ম")}</button><button class="btn" id="b12nr">${L2("Reset", "আবার শুরু")}</button></div><div class="svgwrap fit" id="b12ng"></div><div class="w-out" id="b12no"></div>`;
      chips12(el, ".b12nk", q => { bg = q.dataset.v; reset(); drawSel(); });
      $("#b12nh", el).addEventListener("click", hunt); $("#b12nb", el).addEventListener("click", breed);
      $("#b12nr", el).addEventListener("click", () => { reset(); drawSel(); });
      if (!bugs.length) reset();
      drawSel();
    } else {
      b.innerHTML = tabs12("b12nq", [["all", L2("All bones", "সব হাড়")], ["h", L2("Upper arm", "বাহু")], ["f", L2("Forearm", "অগ্রবাহু")], ["w", L2("Wrist", "কবজি")], ["d", L2("Hand and fingers", "হাত ও আঙুল")]], bone) + `<div class="svgwrap fit" id="b12ns" style="margin-top:6px"></div><div class="w-out" id="b12no"></div>`;
      el.querySelectorAll(".b12nq button").forEach(q => { const k = q.dataset.v; if (BC[k]) q.style.borderColor = BC[k]; });
      chips12(el, ".b12nq", q => { bone = q.dataset.v; drawBone(); });
      drawBone();
    }
  };
  el.innerHTML = tabs12("b12nt", [["sel", L2("Natural selection", "প্রাকৃতিক নির্বাচন")], ["bone", L2("Same bones", "একই হাড়")]], view) + `<div id="b12nv" style="margin-top:8px"></div>`;
  chips12(el, ".b12nt", b => { view = b.dataset.v; setView(); });
  setView();
};
