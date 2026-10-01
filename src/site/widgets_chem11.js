/* ---- chemistry chapter 11 widgets: mineral resources: fossils ---- */
const B11 = x => bnNum(x, LANG);
const n11 = (x, d = 1) => B11((+(+x).toFixed(d)).toString()).replace("-", "−");
const chips11 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
/* "C2H6" -> HTML with <sub>; "(CH2)4" works too */
const fx11 = s => String(s).replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>").replace(/\^([0-9]*[+−-])/g, "<sup>$1</sup>");
/* SVG-safe: Unicode subscripts */
const us11 = s => String(s).replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + d.replace(/\d/g, c => "₀₁₂₃₄₅₆₇₈₉"[c]));
/* molecular formula from counts, Hill-like order C,H,then others */
const mf11 = (c, h, o = 0, extra = "") => "C" + (c > 1 ? c : "") + "H" + (h > 1 ? h : "") + (o ? "O" + (o > 1 ? o : "") : "") + extra;
const ATC11 = a => /^(Br)/.test(a) ? "var(--bad)" : /^Cl/.test(a) ? "var(--good)" : /O|N/.test(a) ? "var(--c)" : a === "H" ? "var(--muted)" : "var(--ink)";

/* ---------- structural formula drawer ----------
   spec: {C:[{u,d,l,r}], b:[bond orders between C_i and C_i+1]}
   labels: "H","Br","Cl","OH","HO"(left),"=O" (double bond), "CH₃" */
const mol11 = (spec, o = {}) => {
  const dx = o.dx || 50, fs = o.fs || 20, n = spec.C.length;
  const hasL = spec.C[0].l, last = spec.C[n - 1], rl = last.r ? String(last.r).length : 0;
  const x0 = hasL ? (String(spec.C[0].l).length > 1 ? 70 : 48) : 22;
  const W = x0 + (n - 1) * dx + (rl ? (rl > 1 ? 78 : 48) : 22), H = 124, y = 62;
  let g = "";
  const line = (x1, y1, x2, y2, k = 1, vert = false) => {
    const offs = k === 1 ? [0] : k === 2 ? [-3.5, 3.5] : [-5.5, 0, 5.5];
    offs.forEach(d => g += vert ? `<line x1="${x1 + d}" y1="${y1}" x2="${x2 + d}" y2="${y2}" stroke="var(--ink)" stroke-width="2"/>`
      : `<line x1="${x1}" y1="${y1 + d}" x2="${x2}" y2="${y2 + d}" stroke="var(--ink)" stroke-width="2"/>`);
  };
  const txt = (x, yy, s, anc = "middle", col) => g += `<text x="${x}" y="${yy + fs * 0.35}" font-size="${fs}" text-anchor="${anc}" fill="${col || ATC11(s)}" font-weight="${s === "C" ? 700 : 500}">${s}</text>`;
  spec.C.forEach((a, i) => {
    const x = x0 + i * dx;
    if (i < n - 1) line(x + 10, y, x + dx - 10, y, spec.b[i] || 1);
    txt(x, y, "C");
    if (a.u) { const dbl = a.u[0] === "=", s = dbl ? a.u.slice(1) : a.u; line(x, y - 12, x, y - 30, dbl ? 2 : 1, true); txt(x, y - 42, s); }
    if (a.d) { const dbl = a.d[0] === "=", s = dbl ? a.d.slice(1) : a.d; line(x, y + 12, x, y + 30, dbl ? 2 : 1, true); txt(x, y + 44, s); }
    if (a.l) { const s = a.l; line(x - 11, y, x - 27, y); txt(s.length > 1 ? x - 29 : x - 37, y, s, s.length > 1 ? "end" : "middle"); }
    if (a.r) { const s = a.r; line(x + 11, y, x + 27, y); txt(s.length > 1 ? x + 29 : x + 37, y, s, s.length > 1 ? "start" : "middle"); }
  });
  return { g, W, H };
};
const molSvg11 = (spec, label, o) => { const m = mol11(spec, o); return `<svg viewBox="0 0 ${m.W} ${m.H}" role="img" aria-label="${label || ""}" style="max-height:170px">${m.g}</svg>`; };

/* straight-chain family builder: kind = ane|ene|yne|ol|al|oic ; c = carbons */
const chain11 = (kind, c) => {
  const C = [], b = [];
  for (let i = 0; i < c; i++) C.push({ u: "H", d: "H" });
  for (let i = 0; i < c - 1; i++) b.push(1);
  C[0].l = "H";
  const L = C[c - 1];
  if (kind === "ane") L.r = "H";
  if (kind === "ene") { b[0] = 2; delete C[0].l; C[1].d = null; if (c === 2) C[1].r = "H"; else C[c - 1].r = "H"; if (c === 2) { C[1].u = "H"; C[1].d = "H"; delete C[1].r; } }
  if (kind === "yne") { b[0] = 3; C[0].u = C[0].d = null; C[1].u = C[1].d = null; if (c === 2) C[1].r = "H"; else C[c - 1].r = "H"; }
  if (kind === "ol") L.r = "OH";
  if (kind === "al") { L.u = "=O"; L.d = null; L.r = "H"; }
  if (kind === "oic") { L.u = "=O"; L.d = null; L.r = "OH"; if (c === 1) { L.l = "H"; } }
  if (kind === "ane" && c === 1) { C[0].r = "H"; }
  return { C, b };
};
const ST11 = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
const SB11 = ["মিথ", "ইথ", "প্রোপ", "বিউট", "পেন্ট", "হেক্স", "হেপ্ট", "অক্ট", "নন", "ডেক"];
const name11 = (kind, c) => {
  const s = ST11[c - 1], t = SB11[c - 1], p = c >= 4, p3 = c >= 3;
  switch (kind) {
    case "ane": return L2(s + "ane", t + "েন");
    case "ene": return p ? L2(s + "-1-ene", t + "-১-ইন") : L2(s + "ene", t + "িন");
    case "yne": return p ? L2(s + "-1-yne", t + "-১-আইন") : L2(s + "yne", t + "াইন");
    case "ol": return p3 ? L2(s + "an-1-ol", t + "ান-১-অল") : L2(s + "anol", t + "ানল");
    case "al": return L2(s + "anal", t + "ান্যাল");
    case "oic": return L2(s + "anoic acid", t + "ানয়িক এসিড");
  }
};
const FAM11 = {
  ane: { en: "Alkane", bn: "অ্যালকেন", gen: "C<sub>n</sub>H<sub>2n+2</sub>", min: 1, grp: () => L2("only C–C single bonds", "শুধু C–C একক বন্ধন") },
  ene: { en: "Alkene", bn: "অ্যালকিন", gen: "C<sub>n</sub>H<sub>2n</sub>", min: 2, grp: () => "C=C" },
  yne: { en: "Alkyne", bn: "অ্যালকাইন", gen: "C<sub>n</sub>H<sub>2n−2</sub>", min: 2, grp: () => "C≡C" },
  ol: { en: "Alcohol", bn: "অ্যালকোহল", gen: "C<sub>n</sub>H<sub>2n+1</sub>OH", min: 1, grp: () => "–OH" },
  al: { en: "Aldehyde", bn: "অ্যালডিহাইড", gen: "C<sub>n</sub>H<sub>2n+1</sub>CHO", min: 1, grp: () => "–CHO" },
  oic: { en: "Carboxylic acid", bn: "কার্বক্সিলিক এসিড", gen: "C<sub>n</sub>H<sub>2n+1</sub>COOH", min: 1, grp: () => "–COOH" }
};
/* formula in series style, counts, Mr */
const form11 = (kind, c) => {
  const alk = n => n === 0 ? "H" : n === 1 ? "CH3" : "C" + n + "H" + (2 * n + 1);
  switch (kind) {
    case "ane": return { f: mf11(c, 2 * c + 2), mf: mf11(c, 2 * c + 2), m: 12 * c + 2 * c + 2 };
    case "ene": return { f: mf11(c, 2 * c), mf: mf11(c, 2 * c), m: 14 * c };
    case "yne": return { f: mf11(c, 2 * c - 2), mf: mf11(c, 2 * c - 2), m: 14 * c - 2 };
    case "ol": return { f: alk(c) + "OH", mf: mf11(c, 2 * c + 2, 1), m: 14 * c + 18 };
    case "al": return { f: alk(c - 1) + "CHO", mf: mf11(c, 2 * c, 1), m: 14 * c + 16 };
    case "oic": return { f: alk(c - 1) + "COOH", mf: mf11(c, 2 * c, 2), m: 14 * c + 32 };
  }
};
const tabs11 = (el, id, list, cb) => {
  el.insertAdjacentHTML("afterbegin", `<div class="chipset ${id}" role="tablist">${list.map((t, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>`);
  chips11(el, "." + id, b => cb(+b.dataset.i));
};

/* ================= 11.1 fossil fuels: formation, refinery column, natural gas ================= */
W.k11fuel = (el) => {
  el.innerHTML = `<div id="k11fb"></div>`;
  const box = $("#k11fb", el);
  tabs11(el, "k11ft", [L2("Formation", "গঠন"), L2("Distillation column", "আংশিক পাতন কলাম"), L2("Natural gas", "প্রাকৃতিক গ্যাস")], i => show(i));
  /* ---- tab 0: formation ---- */
  const formation = () => {
    let kind = 0;
    box.innerHTML = `<div class="chipset k11fk" role="group"><button data-k="0" aria-pressed="true">${L2("Coal (land plants)", "কয়লা (স্থলজ উদ্ভিদ)")}</button><button data-k="1" aria-pressed="false">${L2("Oil and gas (plankton)", "তেল ও গ্যাস (প্লাংকটন)")}</button></div>
    ${slider("k11fT", L2("Time since burial", "চাপা পড়ার পর সময়"), 0, 300, 5, 120, "")}
    <div class="svgwrap fit" id="k11fsv"></div><div class="w-out" id="k11fo"></div><p class="hint">${L2("Depths, temperatures and times are rough typical values.", "গভীরতা, তাপমাত্রা ও সময় আনুমানিক সাধারণ মান।")}</p>`;
    const draw = () => {
      const t = +$("#k11fT", el).value;
      $("#k11fT-v", el).textContent = B11(t) + L2(" million years", " মিলিয়ন বছর");
      const depth = Math.min(6, t / 50);                 // km
      const T = Math.round(25 + 30 * depth);             // °C, about 30 °C per km
      const top = 40, bot = 250, ky = (bot - top) / 6;
      const oy = top + depth * ky;
      let stage, col, extra;
      if (kind === 0) {
        const S = [[0, L2("plant debris in a swamp", "জলাভূমিতে উদ্ভিদের ধ্বংসাবশেষ"), "#6f8f3a", "—"], [5, L2("peat", "পিট"), "#7a5a35", "≈ ৬০%"], [60, L2("lignite (brown coal)", "লিগনাইট (বাদামি কয়লা)"), "#5b4128", "≈ ৭০%"], [140, L2("bituminous coal", "বিটুমিনাস কয়লা"), "#33291f", "≈ ৮৫%"], [230, L2("anthracite", "অ্যানথ্রাসাইট"), "#15130f", "≈ ৯৫%"]];
        let s = S[0]; S.forEach(q => { if (t >= q[0]) s = q; });
        stage = s[1]; col = s[2]; extra = s[3] === "—" ? "" : L2("carbon content ", "কার্বনের ভাগ ") + (LANG === "bn" ? s[3] : s[3].replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d)));
      } else {
        let s;
        if (t < 5) s = [L2("dead plankton in sea-floor mud", "সমুদ্রতলের কাদায় মৃত প্লাংকটন"), "#7a8f55"];
        else if (depth < 2) s = [L2("kerogen: waxy 'pre-oil' in the source rock", "কেরোজেন: উৎস-শিলায় মোমের মতো 'প্রাক-তেল'"), "#6b5a3a"];
        else if (depth < 4) s = [L2("oil window (about 60–120 °C): petroleum forms", "তেল-জানালা (প্রায় ৬০–১২০ °C): পেট্রোলিয়াম তৈরি হয়"), "#2a2218"];
        else s = [L2("gas window (above about 120 °C): oil cracks into natural gas", "গ্যাস-জানালা (প্রায় ১২০ °C-এর ওপরে): তেল ভেঙে প্রাকৃতিক গ্যাস হয়"), "#8fb4d6"];
        stage = s[0]; col = s[1]; extra = "";
      }
      let g = `<svg viewBox="0 0 360 270" role="img" aria-label="${L2("burial of remains", "দেহাবশেষ চাপা পড়া")}">
      <rect x="0" y="0" width="360" height="${top}" fill="var(--c-soft)" opacity=".5"/>`;
      // surface
      g += kind === 0 ? `<g>${[40, 90, 140, 250, 300].map(x => `<line x1="${x}" y1="${top}" x2="${x}" y2="${top - 26}" stroke="#4f7a2b" stroke-width="4"/><circle cx="${x}" cy="${top - 30}" r="10" fill="#6aa33a"/>`).join("")}</g>`
        : `<rect x="0" y="${top - 18}" width="360" height="18" fill="#3a7bbf" opacity=".55"/>`;
      // sediment layers above the organic layer
      const nl = Math.max(0, Math.floor((oy - top) / 16));
      for (let i = 0; i < nl; i++) g += `<rect x="0" y="${top + i * 16}" width="360" height="16" fill="${i % 2 ? "#b89b6a" : "#cdb487"}" opacity=".55"/>`;
      g += `<rect x="0" y="${oy}" width="360" height="${bot - oy + 20}" fill="#9a8a70" opacity=".35"/>`;
      g += `<rect x="30" y="${oy}" width="300" height="12" rx="4" fill="${col}"/>`;
      if (kind === 1 && depth >= 4) for (let i = 0; i < 12; i++) g += `<circle cx="${40 + i * 25}" cy="${oy - 8 - (i % 3) * 5}" r="4" fill="#8fb4d6" stroke="var(--ink)" stroke-width=".6"/>`;
      if (kind === 1 && depth >= 2 && depth < 4) for (let i = 0; i < 10; i++) g += `<ellipse cx="${45 + i * 28}" cy="${oy - 6}" rx="6" ry="4" fill="#2a2218"/>`;
      // depth scale
      for (let k = 0; k <= 6; k += 2) g += `<text x="354" y="${top + k * ky + 5}" font-size="13" text-anchor="end" fill="var(--muted)">${B11(k)} km</text>`;
      g += `<text x="8" y="${Math.min(bot + 12, oy + 30)}" font-size="14" fill="var(--ink)">${B11(T)} °C · ${n11(depth, 1)} km</text>`;
      // arrows for pressure
      if (depth > 0.3) g += `${arrowDefs("k11pa", "var(--bad)")}<line x1="180" y1="${oy - 40}" x2="180" y2="${oy - 4}" stroke="var(--bad)" stroke-width="3" marker-end="url(#k11pa)"/>`;
      g += `</svg>`;
      $("#k11fsv", el).innerHTML = g;
      $("#k11fo", el).innerHTML = `<b>${stage}</b>${extra ? " · " + extra : ""}<br>` + (depth < 0.05 ? L2("Just buried in mud. Move the time slider forward.", "সবে কাদায় চাপা পড়েছে। সময়ের স্লাইডার সামনে সরাও।") : L2(`Buried ${n11(depth, 1)} km deep, no air, about ${B11(T)} °C and huge pressure from the rock above.`, `${n11(depth, 1)} km গভীরে চাপা, বায়ু নেই, তাপমাত্রা প্রায় ${B11(T)} °C, ওপরের শিলার বিপুল চাপ।`));
    };
    chips11(el, ".k11fk", b => { kind = +b.dataset.k; draw(); });
    $("#k11fT", el).addEventListener("input", draw);
    draw();
  };
  /* ---- tab 1: fractional distillation ---- */
  const FR = [
    { n: () => L2("Petroleum gas (LPG)", "পেট্রোলিয়াম গ্যাস (এলপিজি)"), sn: () => L2("Petroleum gas (LPG)", "পেট্রোলিয়াম গ্যাস"), bp: [null, 20], c: "C₁–C₄", p: 2, u: () => L2("cooking gas cylinders, heating", "রান্নার গ্যাস সিলিন্ডার, তাপ উৎপাদন"), col: "#9cc3e6" },
    { n: () => L2("Petrol (gasoline)", "পেট্রোল (গ্যাসোলিন)"), bp: [21, 70], c: "C₅–C₁₀", p: 5, u: () => L2("car and motorcycle fuel", "গাড়ি ও মোটরসাইকেলের জ্বালানি"), col: "#f3e3a0" },
    { n: () => L2("Naphtha", "ন্যাপথা"), bp: [71, 120], c: "C₇–C₁₄", p: 10, u: () => L2("petrochemicals: plastics, chemicals; fuel", "পেট্রোকেমিক্যাল: প্লাস্টিক, রাসায়নিক; জ্বালানি"), col: "#eccf73" },
    { n: () => L2("Kerosene", "কেরোসিন"), bp: [121, 170], c: "C₁₁–C₁₆", p: 13, u: () => L2("jet fuel, lamps and stoves", "জেট জ্বালানি, কুপিবাতি ও স্টোভ"), col: "#dfb24e" },
    { n: () => L2("Diesel", "ডিজেল"), bp: [171, 270], c: "C₁₇–C₂₀", p: null, u: () => L2("buses, trucks, irrigation pumps, generators", "বাস, ট্রাক, সেচপাম্প, জেনারেটর"), col: "#c98f33" },
    { n: () => L2("Lubricating oil, paraffin wax", "লুব্রিকেটিং তেল, প্যারাফিন মোম"), sn: () => L2("Lubricating oil, wax", "লুব্রিকেটিং তেল, মোম"), bp: [271, 340], c: "C₂₀–C₃₀", p: null, u: () => L2("lubricants, candles, Vaseline", "পিচ্ছিলকারক, মোমবাতি, ভ্যাসলিন"), col: "#9b6526" },
    { n: () => L2("Bitumen (pitch)", "বিটুমিন (পিচ)"), bp: [340, null], c: L2("more than C₃₀", "৩০-এর বেশি C"), p: null, u: () => L2("road surfacing, roofing", "রাস্তা তৈরি, ছাদ"), col: "#3a2c20" }];
  const column = () => {
    let sel = 3, dots = [];
    box.innerHTML = `<div class="chipset k11fr" role="group">${FR.map((f, i) => `<button data-i="${i}" aria-pressed="${i === sel}">${f.n()}</button>`).join("")}</div>
      <div class="svgwrap fit" id="k11csv"></div><div class="w-out" id="k11co"></div>`;
    const cx = 110, top = 22, h = 34, bot = top + 7 * h;
    const draw = () => {
      let g = `<svg viewBox="0 0 360 330" role="img" aria-label="${L2("fractionating column", "আংশিক পাতন কলাম")}">
      <defs><linearGradient id="k11grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fa8dc" stop-opacity=".35"/><stop offset="1" stop-color="#e06030" stop-opacity=".45"/></linearGradient></defs>
      <rect x="${cx - 50}" y="${top}" width="100" height="${7 * h}" rx="14" fill="url(#k11grad)" stroke="var(--ink)" stroke-width="2"/>`;
      FR.forEach((f, i) => {
        const y = top + i * h + h / 2, on = i === sel;
        if (i > 0) g += `<line x1="${cx - 50}" y1="${top + i * h}" x2="${cx + 50}" y2="${top + i * h}" stroke="var(--ink)" stroke-dasharray="4 4" opacity=".5"/>`;
        g += `<line x1="${cx + 50}" y1="${y}" x2="${cx + 80}" y2="${y}" stroke="var(--ink)" stroke-width="${on ? 4 : 2}"/><rect x="${cx + 80}" y="${y - 12}" width="26" height="24" rx="4" fill="${f.col}" stroke="var(--ink)" stroke-width="${on ? 2.5 : 1}"/>`;
        g += `<text x="${cx + 114}" y="${y + 5}" font-size="14" fill="${on ? "var(--c)" : "var(--ink)"}" font-weight="${on ? 700 : 400}">${f.sn ? f.sn() : f.n()}</text>`;
        const tl = f.bp[0] == null ? "< " + B11(20) : f.bp[1] == null ? "> " + B11(340) : B11(f.bp[0]) + "–" + B11(f.bp[1]);
        g += `<text x="${cx - 56}" y="${y + 5}" font-size="13" text-anchor="end" fill="var(--muted)">${tl}°</text>`;
        g += `<rect class="k11hit" data-i="${i}" x="${cx - 50}" y="${top + i * h}" width="250" height="${h}" fill="transparent" style="cursor:pointer"/>`;
      });
      dots.forEach(d => g += `<circle cx="${d.x}" cy="${d.y}" r="3" fill="${FR[d.f].col}" stroke="var(--ink)" stroke-width=".6"/>`);
      g += `<text x="${cx}" y="${top - 6}" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("cool", "ঠান্ডা")} ↑</text>`;
      g += `<path d="M20 ${bot + 30} L${cx - 20} ${bot + 30} L${cx - 20} ${bot}" fill="none" stroke="var(--bad)" stroke-width="4"/><text x="20" y="${bot + 52}" font-size="13" fill="var(--bad)">${L2("hot crude oil vapour (≈ 350–400 °C)", "গরম অপরিশোধিত তেলের বাষ্প (≈ ৩৫০–৪০০ °C)")}</text>`;
      g += `</svg>`;
      $("#k11csv", el).innerHTML = g;
      el.querySelectorAll(".k11hit").forEach(r => r.addEventListener("click", () => pick(+r.dataset.i)));
    };
    const out = () => {
      const f = FR[sel];
      const tl = f.bp[0] == null ? L2("below 20 °C", "২০ °C-এর নিচে") : f.bp[1] == null ? L2("above 340 °C", "৩৪০ °C-এর ওপরে") : B11(f.bp[0]) + "–" + B11(f.bp[1]) + " °C";
      $("#k11co", el).innerHTML = `<b>${f.n()}</b><br>${L2("Boiling range", "স্ফুটনাঙ্কের পরিসর")}: ${tl} · ${L2("carbon atoms", "কার্বন সংখ্যা")}: ${f.c}${f.p ? " · " + L2("about ", "প্রায় ") + B11(f.p) + L2("% of crude oil", "% অপরিশোধিত তেলে") : ""}<br>${L2("Uses", "ব্যবহার")}: ${f.u()}<br><span class="muted">${L2("Lower in the column → bigger molecules, higher boiling point, thicker and harder to ignite.", "কলামের যত নিচে → অণু তত বড়, স্ফুটনাঙ্ক তত বেশি, তরল তত ঘন ও কঠিনে জ্বলে।")}</span>`;
    };
    const pick = i => { sel = i; el.querySelectorAll(".k11fr button").forEach(q => q.setAttribute("aria-pressed", +q.dataset.i === i)); draw(); out(); };
    chips11(el, ".k11fr", b => pick(+b.dataset.i));
    draw(); out();
    if (!REDUCED) animate($("#k11csv", el), dt => {
      if (Math.random() < dt * 8 && dots.length < 30) { const f = Math.floor(Math.random() * 7); dots.push({ x: cx - 30 + Math.random() * 60, y: bot - 4, f, ty: top + f * h + h / 2 }); }
      dots.forEach(d => d.y -= dt * 60);
      dots = dots.filter(d => d.y > d.ty);
      const svg = $("#k11csv svg", el); if (!svg) return;
      svg.querySelectorAll(".k11dot").forEach(c => c.remove());
      dots.forEach(d => svg.insertAdjacentHTML("beforeend", `<circle class="k11dot" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="3.2" fill="${FR[d.f].col}" stroke="var(--ink)" stroke-width=".6" pointer-events="none"/>`));
    });
  };
  /* ---- tab 2: natural gas composition ---- */
  const gas = () => {
    const G = [[L2("Methane CH₄", "মিথেন CH₄"), 93, 98], [L2("Ethane C₂H₆", "ইথেন C₂H₆"), 0.2, 3.9], [L2("Propane C₃H₈", "প্রোপেন C₃H₈"), 0.05, 1.2], [L2("Butane C₄H₁₀", "বিউটেন C₄H₁₀"), 0.1, 0.72], [L2("Pentane C₅H₁₂", "পেন্টেন C₅H₁₂"), 1.2, 1.2]];
    let zoom = false;
    box.innerHTML = `<div class="chipset k11gz" role="group"><button data-z="0" aria-pressed="true">${L2("Scale 0–100%", "স্কেল ০–১০০%")}</button><button data-z="1" aria-pressed="false">${L2("Zoom 0–5% (minor gases)", "জুম ০–৫% (অল্প পরিমাণের গ্যাস)")}</button></div><div class="svgwrap fit" id="k11gsv"></div><div class="w-out" id="k11go"></div>`;
    const draw = () => {
      const max = zoom ? 5 : 100, X0 = 130, X1 = 340, px = v => X0 + Math.min(v, max) / max * (X1 - X0);
      let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("composition of natural gas", "প্রাকৃতিক গ্যাসের উপাদান")}">`;
      for (let k = 0; k <= 4; k++) { const v = max * k / 4, x = px(v); g += `<line x1="${x}" y1="20" x2="${x}" y2="210" stroke="var(--rule)"/><text x="${x}" y="230" font-size="13" text-anchor="middle" fill="var(--muted)">${n11(v, zoom ? 2 : 0)}%</text>`; }
      G.forEach((r, i) => {
        const y = 36 + i * 38, a = px(r[1]), b = px(r[2]), off = zoom && r[1] > max;
        g += `<text x="${X0 - 6}" y="${y + 5}" font-size="13" text-anchor="end" fill="var(--ink)">${r[0]}</text>`;
        g += `<rect x="${X0}" y="${y - 9}" width="${Math.max(3, a - X0)}" height="18" fill="var(--c)" opacity=".85"/>`;
        if (b > a) g += `<rect x="${a}" y="${y - 9}" width="${b - a}" height="18" fill="var(--c)" opacity=".35"/>`;
        if (off) g += `<text x="${X1 - 4}" y="${y + 5}" font-size="13" text-anchor="end" fill="var(--paper)">→ ${B11(r[1])}–${B11(r[2])}%</text>`;
      });
      g += `</svg>`;
      $("#k11gsv", el).innerHTML = g;
      $("#k11go", el).innerHTML = L2("Dark bar = lowest reported value, light part = range found in Bangladesh's gas fields (pentane: about 1.2%). Methane is 93–98%, so the gas burns cleanly: CH₄ + 2O₂ → CO₂ + 2H₂O.<br>Uses: electricity (largest), urea fertiliser, industry, household cooking, CNG vehicles.",
        "গাঢ় অংশ = সর্বনিম্ন পাওয়া মান, হালকা অংশ = বাংলাদেশের গ্যাসক্ষেত্রে পাওয়া পরিসর (পেন্টেন প্রায় ১.২%)। মিথেন ৯৩–৯৮%, তাই গ্যাসটি পরিষ্কারভাবে পোড়ে: CH₄ + 2O₂ → CO₂ + 2H₂O।<br>ব্যবহার: বিদ্যুৎ (সবচেয়ে বেশি), ইউরিয়া সার, শিল্প, গৃহস্থালি রান্না, সিএনজি যানবাহন।");
    };
    chips11(el, ".k11gz", b => { zoom = b.dataset.z === "1"; draw(); });
    draw();
  };
  const show = i => { box.innerHTML = ""; [formation, column, gas][i](); };
  show(0);
};

/* ================= 11.2 homologous series explorer ================= */
W.k11series = (el) => {
  let kind = "ane";
  el.innerHTML = `<div class="chipset k11sk" role="group">${Object.keys(FAM11).map(k => `<button data-k="${k}" aria-pressed="${k === kind}">${L2(FAM11[k].en, FAM11[k].bn)}</button>`).join("")}</div>
  ${slider("k11sc", L2("Number of carbon atoms", "কার্বন পরমাণুর সংখ্যা"), 1, 10, 1, 2, "")}
  <div class="svgwrap fit" id="k11ssv"></div><div class="w-out" id="k11so"></div>`;
  const draw = () => {
    const F = FAM11[kind], inp = $("#k11sc", el);
    inp.min = F.min; if (+inp.value < F.min) inp.value = F.min;
    const c = +inp.value; $("#k11sc-v", el).textContent = B11(c);
    const f = form11(kind, c);
    $("#k11ssv", el).innerHTML = molSvg11(chain11(kind, c), name11(kind, c), { fs: 20 });
    const nIn = (kind === "al" || kind === "oic") ? c - 1 : c;
    const prev = c > F.min ? name11(kind, c - 1) : null;
    $("#k11so", el).innerHTML = `<b style="font-size:1.1em">${name11(kind, c)}</b> · ${fx11(f.f)}${f.f !== f.mf ? " (" + fx11(f.mf) + ")" : ""}<br>
      ${L2("Series", "শ্রেণি")}: ${L2(F.en, F.bn)} · ${L2("general formula", "সাধারণ সংকেত")} ${F.gen.replace(/n/g, "<i>n</i>").replace("<sub>2<i>n</i>","<sub>2<i>n</i>")} ${L2("with", "যেখানে")} <i>n</i> = ${B11(nIn)} · ${L2("functional group", "কার্যকরী মূলক")}: ${F.grp()}<br>
      M<sub>r</sub> = ${B11(f.m)}${prev ? ` · ${L2("previous member", "আগের সদস্য")} ${prev} + CH<sub>2</sub> (+${B11(14)})` : ""}`;
  };
  chips11(el, ".k11sk", b => { kind = b.dataset.k; draw(); });
  $("#k11sc", el).addEventListener("input", draw);
  draw();
};

/* ================= 11.3 alkane builder + chlorination of methane ================= */
W.k11alkane = (el) => {
  const BP = [-161.5, -88.6, -42.1, -0.5, 36.1, 68.7, 98.4, 125.7, 150.8, 174.1];
  el.innerHTML = `<div id="k11ab"></div>`;
  const box = $("#k11ab", el);
  tabs11(el, "k11at", [L2("Alkane builder", "অ্যালকেন বানাও"), L2("Chlorine + methane (UV)", "ক্লোরিন + মিথেন (UV)")], i => i ? chlor() : build());
  const build = () => {
    box.innerHTML = `${slider("k11an", L2("Carbon atoms n", "কার্বন পরমাণু n"), 1, 10, 1, 3, "")}<div class="svgwrap fit" id="k11asv"></div><div class="svgwrap fit" id="k11abp"></div><div class="w-out" id="k11ao"></div>`;
    const draw = () => {
      const n = +$("#k11an", el).value; $("#k11an-v", el).textContent = B11(n);
      $("#k11asv", el).innerHTML = molSvg11(chain11("ane", n), name11("ane", n));
      // boiling point chart
      const X = i => 52 + i * 31, Y = t => 150 - (t + 170) / 350 * 130;
      let g = `<svg viewBox="0 0 360 185" role="img" aria-label="${L2("boiling points", "স্ফুটনাঙ্ক")}"><line x1="42" y1="${Y(25)}" x2="350" y2="${Y(25)}" stroke="var(--note)" stroke-dasharray="5 4"/><text x="350" y="${Y(25) - 5}" font-size="13" text-anchor="end" fill="var(--muted)">${L2("room temp. 25 °C", "কক্ষ তাপমাত্রা ২৫ °C")}</text>`;
      [-150, 0, 150].forEach(t => g += `<text x="38" y="${Y(t) + 4}" font-size="13" text-anchor="end" fill="var(--muted)">${n11(t, 0)}</text>`);
      BP.forEach((b, i) => { const on = i + 1 === n; g += `<rect x="${X(i) - 9}" y="${Math.min(Y(b), Y(0))}" width="18" height="${Math.abs(Y(b) - Y(0))}" fill="var(--c)" opacity="${on ? 1 : .3}"/><text x="${X(i)}" y="172" font-size="13" text-anchor="middle" fill="${on ? "var(--c)" : "var(--muted)"}">${B11(i + 1)}</text>`; });
      g += `<line x1="42" y1="${Y(0)}" x2="350" y2="${Y(0)}" stroke="var(--muted)"/><text x="4" y="12" font-size="13" fill="var(--muted)">${L2("b.p. / °C", "স্ফুটনাঙ্ক / °C")}</text><text x="354" y="186" font-size="13" text-anchor="end" fill="var(--muted)">n</text></svg>`;
      $("#k11abp", el).innerHTML = g;
      const o2 = (3 * n + 1) / 2, k = Number.isInteger(o2) ? 1 : 2;
      const co = a => a === 1 ? "" : a;  // coefficients stay Latin in equations
      const eq = `${co(k)}${fx11(mf11(n, 2 * n + 2))} + ${co(o2 * k)}O<sub>2</sub> → ${co(n * k)}CO<sub>2</sub> + ${co((n + 1) * k)}H<sub>2</sub>O`;
      const st = BP[n - 1] < 25 ? L2("gas", "গ্যাস") : L2("liquid", "তরল");
      $("#k11ao", el).innerHTML = `<b>${name11("ane", n)}</b> · ${fx11(mf11(n, 2 * n + 2))} · M<sub>r</sub> = ${B11(14 * n + 2)}<br>${L2("Boiling point", "স্ফুটনাঙ্ক")} ${n11(BP[n - 1], 1)} °C → ${L2("at 25 °C it is a", "২৫ °C-এ এটি")} <b>${st}</b><br>${L2("Complete combustion", "সম্পূর্ণ দহন")}: ${eq}`;
    };
    $("#k11an", el).addEventListener("input", draw); draw();
  };
  const chlor = () => {
    let step = 0, uv = true;
    const P = [["CH4", L2("methane", "মিথেন")], ["CH3Cl", L2("chloromethane", "ক্লোরোমিথেন")], ["CH2Cl2", L2("dichloromethane", "ডাইক্লোরোমিথেন")], ["CHCl3", L2("trichloromethane (chloroform)", "ট্রাইক্লোরোমিথেন (ক্লোরোফর্ম)")], ["CCl4", L2("tetrachloromethane", "টেট্রাক্লোরোমিথেন")]];
    box.innerHTML = `<div class="chipset k11uv" role="group"><button data-u="1" aria-pressed="true">${L2("UV light / sunlight", "অতিবেগুনি আলো / সূর্যালোক")}</button><button data-u="0" aria-pressed="false">${L2("Dark", "অন্ধকার")}</button></div>
    <div class="w-row"><button class="btn solid" id="k11cs">${L2("Add Cl₂ (next step)", "Cl₂ যোগ করো (পরের ধাপ)")}</button><button class="btn" id="k11cr">${L2("Reset", "আবার")}</button></div><div class="svgwrap fit" id="k11chs"></div><div class="w-out" id="k11cho"></div>`;
    const draw = (msg) => {
      const pos = [[0, -1, "u"], [1, 0, "r"], [0, 1, "d"], [-1, 0, "l"]];
      let g = `<svg viewBox="0 0 360 206" role="img" aria-label="${P[step][1]}">`;
      if (uv) for (let i = 0; i < 5; i++) g += `<line x1="${300 + i * 8}" y1="10" x2="${270 + i * 8}" y2="50" stroke="var(--note)" stroke-width="3"/>`;
      g += `<text x="330" y="70" font-size="13" text-anchor="middle" fill="var(--muted)">${uv ? "UV" : L2("dark", "অন্ধকার")}</text>`;
      const cx = 150, cy = 95;
      pos.forEach((p, i) => {
        const cl = i < step, x = cx + p[0] * 62, y = cy + p[1] * 62;
        g += `<line x1="${cx + p[0] * 14}" y1="${cy + p[1] * 14}" x2="${x - p[0] * (cl ? 18 : 12)}" y2="${y - p[1] * (cl ? 18 : 12)}" stroke="var(--ink)" stroke-width="2.5"/>`;
        g += `<circle cx="${x}" cy="${y}" r="${cl ? 18 : 12}" fill="${cl ? "var(--good)" : "var(--sheet)"}" stroke="var(--ink)" opacity="${cl ? .9 : 1}"/><text x="${x}" y="${y + 5}" font-size="15" text-anchor="middle" fill="${cl ? "var(--paper)" : "var(--ink)"}" font-weight="700">${cl ? "Cl" : "H"}</text>`;
      });
      g += `<circle cx="${cx}" cy="${cy}" r="15" fill="var(--c)"/><text x="${cx}" y="${cy + 6}" font-size="17" text-anchor="middle" fill="var(--paper)" font-weight="700">C</text>`;
      g += `<text x="${cx}" y="201" font-size="14" text-anchor="middle" fill="var(--ink)">${us11(P[step][0])}: ${P[step][1]}</text>`;
      if (step) g += `<text x="290" y="120" font-size="14" text-anchor="middle" fill="var(--muted)">+ ${B11(step)} HCl</text>`;
      g += `</svg>`;
      $("#k11chs", el).innerHTML = g;
      const eq = step ? `${fx11(P[step - 1][0])} + Cl<sub>2</sub> → ${fx11(P[step][0])} + HCl` : "";
      $("#k11cho", el).innerHTML = msg || (step ? L2(`Step ${step}: `, `ধাপ ${B11(step)}: `) + eq + "<br>" + L2("Substitution: one H is replaced by one Cl; the H leaves as HCl.", "প্রতিস্থাপন: একটি H-এর জায়গায় একটি Cl বসে; H বেরিয়ে যায় HCl হিসেবে।")
        : L2("Methane CH₄. Press the button to add chlorine.", "মিথেন CH₄। ক্লোরিন যোগ করতে বোতাম চাপো।"));
    };
    $("#k11cs", el).addEventListener("click", () => {
      if (!uv) return draw(L2("No reaction: in the dark the Cl–Cl bond is not split, so substitution cannot start.", "বিক্রিয়া হয় না: অন্ধকারে Cl–Cl বন্ধন ভাঙে না, তাই প্রতিস্থাপন শুরু হতে পারে না।"));
      if (step < 4) { step++; draw(); } else draw(L2("All four H atoms are replaced: CCl₄ cannot react further by substitution.", "চারটি H-ই প্রতিস্থাপিত: CCl₄ আর প্রতিস্থাপন বিক্রিয়া দিতে পারে না।"));
    });
    $("#k11cr", el).addEventListener("click", () => { step = 0; draw(); });
    chips11(el, ".k11uv", b => { uv = b.dataset.u === "1"; draw(); });
    draw();
  };
  build();
};

/* ================= 11.4 test for unsaturation / addition reactions ================= */
W.k11brom = (el) => {
  const HC = [
    { id: "ethane", n: () => L2("Ethane", "ইথেন"), f: "C2H6", s: chain11("ane", 2), u: 0 },
    { id: "ethene", n: () => L2("Ethene", "ইথিন"), f: "C2H4", s: chain11("ene", 2), u: 1 },
    { id: "propene", n: () => L2("Propene", "প্রোপিন"), f: "C3H6", s: chain11("ene", 3), u: 1 },
    { id: "ethyne", n: () => L2("Ethyne", "ইথাইন"), f: "C2H2", s: chain11("yne", 2), u: 2 }];
  const RG = [
    { id: "br", n: () => L2("Bromine water", "ব্রোমিন পানি"), col: "#d9772b" },
    { id: "mn", n: () => L2("Alkaline KMnO₄", "ক্ষারীয় KMnO₄"), col: "#a3308f" },
    { id: "h2", n: () => L2("H₂ (Ni, 180–200 °C)", "H₂ (Ni, ১৮০–২০০ °C)"), col: null }];
  const PR = {
    ethene: {
      br: { eq: "CH2=CH2 + Br2 → CH2Br–CH2Br", p: () => L2("1,2-dibromoethane", "১,২-ডাইব্রোমোইথেন"), s: { C: [{ l: "H", u: "Br", d: "H" }, { r: "H", u: "Br", d: "H" }], b: [1] } },
      mn: { eq: "CH2=CH2 + H2O + [O] → HO–CH2–CH2–OH", p: () => L2("ethylene glycol (ethane-1,2-diol)", "ইথিলিন গ্লাইকল (ইথেন-১,২-ডাইঅল)"), s: { C: [{ l: "H", u: "OH", d: "H" }, { r: "H", u: "OH", d: "H" }], b: [1] } },
      h2: { eq: "CH2=CH2 + H2 → CH3–CH3", p: () => L2("ethane", "ইথেন"), s: chain11("ane", 2) } },
    propene: {
      br: { eq: "CH3–CH=CH2 + Br2 → CH3–CHBr–CH2Br", p: () => L2("1,2-dibromopropane", "১,২-ডাইব্রোমোপ্রোপেন"), s: { C: [{ l: "H", u: "H", d: "H" }, { u: "Br", d: "H" }, { r: "H", u: "Br", d: "H" }], b: [1, 1] } },
      mn: { eq: "CH3–CH=CH2 + H2O + [O] → CH3–CH(OH)–CH2OH", p: () => L2("propane-1,2-diol", "প্রোপেন-১,২-ডাইঅল"), s: { C: [{ l: "H", u: "H", d: "H" }, { u: "OH", d: "H" }, { r: "H", u: "OH", d: "H" }], b: [1, 1] } },
      h2: { eq: "CH3–CH=CH2 + H2 → CH3–CH2–CH3", p: () => L2("propane", "প্রোপেন"), s: chain11("ane", 3) } },
    ethyne: {
      br: { eq: "HC≡CH + 2Br2 → CHBr2–CHBr2", p: () => L2("1,1,2,2-tetrabromoethane (2 mol Br₂ added)", "১,১,২,২-টেট্রাব্রোমোইথেন (২ mol Br₂ যুক্ত)"), s: { C: [{ l: "H", u: "Br", d: "Br" }, { r: "H", u: "Br", d: "Br" }], b: [1] } },
      mn: { eq: null, p: () => L2("ethyne is oxidised (products are beyond this book)", "ইথাইন জারিত হয় (উৎপাদগুলো এই বইয়ের বাইরে)"), s: null },
      h2: { eq: "HC≡CH + 2H2 → CH3–CH3", p: () => L2("ethane (via ethene; 2 mol H₂ added)", "ইথেন (ইথিন হয়ে; ২ mol H₂ যুক্ত)"), s: chain11("ane", 2) } }
  };
  let hi = 1, ri = 0, p = 0, run = false;
  el.innerHTML = `<div class="chipset k11bh" role="group">${HC.map((h, i) => `<button data-i="${i}" aria-pressed="${i === hi}">${h.n()} ${fx11(h.f)}</button>`).join("")}</div>
  <div class="chipset k11br" role="group" style="margin-top:6px">${RG.map((r, i) => `<button data-i="${i}" aria-pressed="${i === ri}">${r.n()}</button>`).join("")}</div>
  <div class="w-row" style="margin-top:8px"><button class="btn solid" id="k11bgo">${L2("Add the hydrocarbon", "হাইড্রোকার্বন যোগ করো")}</button><button class="btn" id="k11brs">${L2("Reset", "আবার")}</button></div>
  <div class="svgwrap fit" id="k11bsv"></div><div class="svgwrap fit" id="k11bmol"></div><div class="w-out" id="k11bo"></div>`;
  const draw = () => {
    const h = HC[hi], r = RG[ri], react = h.u > 0, fade = react ? p : 0;
    let g = `<svg viewBox="0 0 360 170" role="img" aria-label="${L2("test tube", "টেস্টটিউব")}">`;
    // gas bubbles and tube
    const liq = r.col ? `<path d="M140 70 L140 140 A30 30 0 0 0 200 140 L200 70 Z" fill="${r.col}" opacity="${(1 - fade) * 0.85 + 0.04}"/>` : `<path d="M140 70 L140 140 A30 30 0 0 0 200 140 L200 70 Z" fill="var(--c-soft)" opacity=".4"/>`;
    g += liq + `<path d="M140 10 L140 140 A30 30 0 0 0 200 140 L200 10" fill="none" stroke="var(--ink)" stroke-width="2.5"/>`;
    if (run || p > 0 && p < 1) for (let i = 0; i < 6; i++) { const yy = 150 - ((p * 400 + i * 23) % 80); g += `<circle cx="${160 + (i % 3) * 10}" cy="${yy}" r="4" fill="none" stroke="var(--ink)" stroke-width="1.2"/>`; }
    g += `<line x1="170" y1="0" x2="170" y2="130" stroke="var(--muted)" stroke-width="3" opacity=".6"/>`;
    g += `<text x="40" y="60" font-size="14" fill="var(--ink)">${h.n()}</text><text x="40" y="80" font-size="14" fill="var(--muted)">${us11(h.f)} ↓</text>`;
    g += `<text x="230" y="100" font-size="14" fill="var(--ink)">${r.n()}</text>`;
    if (p >= 1) g += `<text x="230" y="124" font-size="14" fill="${react ? "var(--good)" : "var(--bad)"}" font-weight="700">${react ? (r.col ? L2("decolourised!", "রং দূর হলো!") : L2("reacted", "বিক্রিয়া হলো")) : L2("no change", "কোনো পরিবর্তন নেই")}</text>`;
    g += `</svg>`;
    $("#k11bsv", el).innerHTML = g;
    const pr = react ? PR[h.id][r.id] : null;
    $("#k11bmol", el).innerHTML = p >= 1 ? molSvg11(pr && pr.s ? pr.s : h.s, "", { fs: 20 }) : molSvg11(h.s, h.n(), { fs: 20 });
    let o;
    if (p < 1) o = L2(`${h.n()} is ${h.u ? "unsaturated (" + (h.u === 1 ? "C=C" : "C≡C") + ")" : "saturated (only single bonds)"}. Press the button to bubble it through the reagent.`,
      `${h.n()} ${h.u ? "অসম্পৃক্ত (" + (h.u === 1 ? "C=C" : "C≡C") + ")" : "সম্পৃক্ত (শুধু একক বন্ধন)"}। বোতাম চেপে বিকারকের মধ্য দিয়ে চালনা করো।`);
    else if (!react) o = L2("No reaction: a saturated alkane has no double or triple bond to add to. The colour stays.", "বিক্রিয়া হয় না: সম্পৃক্ত অ্যালকেনে যুক্ত হওয়ার মতো দ্বিবন্ধন বা ত্রিবন্ধন নেই। রং থেকে যায়।");
    else o = `<b>${L2("Addition", "সংযোজন")}</b> → ${pr.p()}${pr.eq ? "<br>" + fx11(pr.eq) : ""}${r.id === "br" ? "<br>" + L2("The orange-red colour disappears: test for unsaturation.", "লালচে-কমলা রং মিলিয়ে যায়: অসম্পৃক্ততার পরীক্ষা।") : r.id === "mn" ? "<br>" + L2("The pink-purple colour disappears (Baeyer's test).", "গোলাপি-বেগুনি রং মিলিয়ে যায় (বেয়ার পরীক্ষা)।") : ""}`;
    $("#k11bo", el).innerHTML = o;
  };
  const reset = () => { p = 0; run = false; draw(); };
  chips11(el, ".k11bh", b => { hi = +b.dataset.i; reset(); });
  chips11(el, ".k11br", b => { ri = +b.dataset.i; reset(); });
  $("#k11bgo", el).addEventListener("click", () => { if (REDUCED) { p = 1; draw(); } else { p = 0.001; run = true; } });
  $("#k11brs", el).addEventListener("click", reset);
  if (!REDUCED) animate(el, dt => { if (run) { p = Math.min(1, p + dt * 0.5); if (p >= 1) run = false; draw(); } });
  draw();
};

/* ================= 11.5 reaction map: hydrocarbons → alcohol → aldehyde → acid ================= */
W.k11oxid = (el) => {
  const N = {
    ane: { x: 60, y: 40, f: "C2H6", n: () => L2("ethane", "ইথেন"), s: chain11("ane", 2), g: () => L2("alkane", "অ্যালকেন") },
    ene: { x: 180, y: 40, f: "C2H4", n: () => L2("ethene", "ইথিন"), s: chain11("ene", 2), g: () => L2("alkene, C=C", "অ্যালকিন, C=C") },
    yne: { x: 300, y: 40, f: "C2H2", n: () => L2("ethyne", "ইথাইন"), s: chain11("yne", 2), g: () => L2("alkyne, C≡C", "অ্যালকাইন, C≡C") },
    hal: { x: 60, y: 175, f: "C2H5X", n: () => L2("haloethane (X = Cl, Br)", "হ্যালোইথেন (X = Cl, Br)"), s: { C: [{ l: "H", u: "H", d: "H" }, { r: "X", u: "H", d: "H" }], b: [1] }, g: () => L2("alkyl halide", "অ্যালকাইল হ্যালাইড") },
    ol: { x: 180, y: 250, f: "C2H5OH", n: () => L2("ethanol", "ইথানল"), s: chain11("ol", 2), g: () => L2("alcohol, –OH", "অ্যালকোহল, –OH") },
    al: { x: 300, y: 250, f: "CH3CHO", n: () => L2("ethanal", "ইথান্যাল"), s: chain11("al", 2), g: () => L2("aldehyde, –CHO", "অ্যালডিহাইড, –CHO") },
    oic: { x: 300, y: 370, f: "CH3COOH", n: () => L2("ethanoic acid", "ইথানয়িক এসিড"), s: chain11("oic", 2), g: () => L2("carboxylic acid, –COOH", "কার্বক্সিলিক এসিড, –COOH") }
  };
  const A = [
    { a: "ane", b: "hal", c: () => L2("Cl₂, UV light", "Cl₂, অতিবেগুনি আলো"), eq: "CH3–CH3 + Cl2 → CH3–CH2Cl + HCl", t: () => L2("substitution", "প্রতিস্থাপন") },
    { a: "ene", b: "hal", c: () => L2("HBr (H₂O₂)", "HBr (H₂O₂)"), eq: "CH2=CH2 + HBr → CH3–CH2Br", t: () => L2("addition", "সংযোজন") },
    { a: "hal", b: "ol", c: () => L2("NaOH (aqueous)", "NaOH (জলীয়)"), eq: "CH3–CH2Cl + NaOH → CH3–CH2OH + NaCl", t: () => L2("substitution", "প্রতিস্থাপন") },
    { a: "ene", b: "ol", c: () => L2("steam, H₃PO₄, 300 °C, 60 atm", "জলীয় বাষ্প, H₃PO₄, ৩০০ °C, ৬০ atm"), eq: "CH2=CH2 + H2O → CH3–CH2OH", t: () => L2("addition of water", "পানি সংযোজন"), off: -9 },
    { a: "ol", b: "ene", c: () => L2("conc. H₂SO₄, ≈ 170 °C", "গাঢ় H₂SO₄, ≈ ১৭০ °C"), eq: "CH3–CH2OH → CH2=CH2 + H2O", t: () => L2("dehydration", "পানি অপসারণ"), off: -9 },
    { a: "ene", b: "ane", c: () => L2("H₂, Ni, 180–200 °C", "H₂, Ni, ১৮০–২০০ °C"), eq: "CH2=CH2 + H2 → CH3–CH3", t: () => L2("addition (hydrogenation)", "সংযোজন (হাইড্রোজেনেশন)") },
    { a: "yne", b: "ene", c: () => L2("H₂, Ni", "H₂, Ni"), eq: "HC≡CH + H2 → CH2=CH2", t: () => L2("addition (hydrogenation)", "সংযোজন (হাইড্রোজেনেশন)") },
    { a: "yne", b: "al", c: () => L2("H₂O, 20% H₂SO₄, 2% HgSO₄, 80 °C", "H₂O, ২০% H₂SO₄, ২% HgSO₄, ৮০ °C"), eq: "HC≡CH + H2O → CH3CHO", t: () => L2("addition of water", "পানি সংযোজন") },
    { a: "ol", b: "al", c: () => L2("[O]: K₂Cr₂O₇ + H₂SO₄", "[O]: K₂Cr₂O₇ + H₂SO₄"), eq: "CH3CH2OH + [O] → CH3CHO + H2O", t: () => L2("oxidation (orange → green)", "জারণ (কমলা → সবুজ)") },
    { a: "al", b: "oic", c: () => L2("[O]: K₂Cr₂O₇ + H₂SO₄", "[O]: K₂Cr₂O₇ + H₂SO₄"), eq: "CH3CHO + [O] → CH3COOH", t: () => L2("oxidation", "জারণ") }];
  let selN = "ol", selA = -1, path = [], pi = -1;
  el.innerHTML = `<div class="w-row"><button class="btn solid" id="k11op1">${L2("Play: ethane → acid", "চালাও: ইথেন → এসিড")}</button><button class="btn" id="k11op2">${L2("Play: ethene → acid", "চালাও: ইথিন → এসিড")}</button></div>
  <div class="svgwrap fit" id="k11osv"></div><div class="svgwrap fit" id="k11omol"></div><div class="w-out" id="k11oo"></div>`;
  const W0 = 92, H0 = 36;
  const draw = () => {
    let g = `<svg viewBox="0 0 360 400" role="img" aria-label="${L2("reaction map", "বিক্রিয়া-মানচিত্র")}">${arrowDefs("k11oa", "var(--muted)")}${arrowDefs("k11ob", "var(--c)")}`;
    A.forEach((r, i) => {
      const a = N[r.a], b = N[r.b], on = i === selA;
      let x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      const cut = (ux2, uy2) => Math.min(Math.abs(ux2) > 1e-6 ? (W0 / 2 + 6) / Math.abs(ux2) : 1e9, Math.abs(uy2) > 1e-6 ? (H0 / 2 + 6) / Math.abs(uy2) : 1e9);
      const c1 = cut(ux, uy), o = r.off || 0, oxp = -uy * o, oyp = ux * o;
      const sx = x1 + ux * c1 + oxp, sy = y1 + uy * c1 + oyp, ex = x2 - ux * (c1 + 4) + oxp, ey = y2 - uy * (c1 + 4) + oyp;
      g += `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${on ? "var(--c)" : "var(--muted)"}" stroke-width="${on ? 3.5 : 2}" marker-end="url(#${on ? "k11ob" : "k11oa"})"/>`;
      g += `<line class="k11ohit" data-i="${i}" x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="transparent" stroke-width="20" style="cursor:pointer"/>`;
    });
    Object.keys(N).forEach(k => {
      const q = N[k], on = k === selN;
      g += `<g class="k11onode" data-k="${k}" style="cursor:pointer"><rect x="${q.x - W0 / 2}" y="${q.y - H0 / 2}" width="${W0}" height="${H0}" rx="10" fill="${on ? "var(--c)" : "var(--sheet)"}" stroke="var(--c)" stroke-width="2"/><text x="${q.x}" y="${q.y + 6}" font-size="16" text-anchor="middle" fill="${on ? "var(--paper)" : "var(--ink)"}" font-weight="600">${us11(q.f)}</text></g>`;
    });
    g += `</svg>`;
    $("#k11osv", el).innerHTML = g;
    el.querySelectorAll(".k11ohit").forEach(h => h.addEventListener("click", () => { path = []; pickA(+h.dataset.i); }));
    el.querySelectorAll(".k11onode").forEach(h => h.addEventListener("click", () => { path = []; selN = h.dataset.k; selA = -1; draw(); out(); }));
  };
  const out = () => {
    if (selA >= 0) {
      const r = A[selA];
      $("#k11omol", el).innerHTML = molSvg11(N[r.b].s, N[r.b].n(), { fs: 20 });
      $("#k11oo", el).innerHTML = `<b>${N[r.a].n()} → ${N[r.b].n()}</b> (${r.t()})<br>${L2("Reagent/conditions", "বিকারক/শর্ত")}: ${r.c()}<br>${fx11(r.eq)}`;
    } else {
      const q = N[selN];
      $("#k11omol", el).innerHTML = molSvg11(q.s, q.n(), { fs: 20 });
      $("#k11oo", el).innerHTML = `<b>${q.n()}</b> · ${fx11(q.f)} · ${q.g()}<br><span class="muted">${L2("Tap an arrow to see how one compound is changed into the next.", "একটি যৌগ কীভাবে পরেরটিতে বদলায় দেখতে একটি তীরে চাপ দাও।")}</span>`;
    }
  };
  const pickA = i => { selA = i; selN = A[i].b; draw(); out(); };
  const play = seq => { path = seq; pi = 0; pickA(path[0]); if (REDUCED) return; };
  $("#k11op1", el).addEventListener("click", () => play([0, 2, 8, 9]));
  $("#k11op2", el).addEventListener("click", () => play([3, 8, 9]));
  let tt = 0;
  animate(el, dt => { if (!path.length) return; tt += dt; if (tt > (REDUCED ? 99 : 2.2)) { tt = 0; pi++; if (pi < path.length) pickA(path[pi]); else path = []; } });
  draw(); out();
};

/* ================= 11.7 polymerisation ================= */
W.k11poly = (el) => {
  const M = [
    { n: () => L2("Ethene → polythene", "ইথিন → পলিথিন"), sub: ["H", "H", "H", "H"], m: 28, unit: "–CH2–CH2–", pol: () => L2("polythene", "পলিথিন") },
    { n: () => L2("Propene → polypropene", "প্রোপিন → পলিপ্রোপিন"), sub: ["H", "H", "H", "CH₃"], m: 42, unit: "–CH2–CH(CH3)–", pol: () => L2("polypropene", "পলিপ্রোপিন") },
    { n: () => L2("Vinyl chloride → PVC", "ভিনাইল ক্লোরাইড → পিভিসি"), sub: ["H", "H", "H", "Cl"], m: 62.5, unit: "–CH2–CHCl–", pol: () => L2("PVC", "পিভিসি") },
    { n: () => L2("Nylon 6,6 (condensation)", "নাইলন ৬,৬ (ঘনীভবন)"), nylon: true, m: 226, unit: "–OC–(CH2)4–CO–NH–(CH2)6–NH–", pol: () => L2("nylon 6,6", "নাইলন ৬,৬") }];
  let mi = 0, p = 0, run = false;
  el.innerHTML = `<div class="chipset k11pm" role="group">${M.map((m, i) => `<button data-i="${i}" aria-pressed="${i === mi}">${m.n()}</button>`).join("")}</div>
  <div class="w-row" style="margin-top:8px"><button class="btn solid" id="k11pgo">${L2("Join", "জোড়া লাগাও")}</button><button class="btn" id="k11prs">${L2("Separate", "আলাদা করো")}</button></div>
  <div class="svgwrap fit" id="k11psv"></div>${slider("k11pn", L2("Number of repeating units n", "পুনরাবৃত্ত এককের সংখ্যা n"), 2, 4, 0.05, 3, "")}<div class="w-out" id="k11po"></div>`;
  const draw = () => {
    const m = M[mi], e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    let g = `<svg viewBox="0 0 380 190" role="img" aria-label="${m.pol()}">`;
    const fs = 17, y = 95;
    if (!m.nylon) {
      const gap = 16 * (1 - e), dx = 44, mw = dx + 44;
      for (let k = 0; k < 4; k++) {
        const x = 36 + k * (mw + gap) - 1.5 * gap, x2 = x + dx;
        const s = m.sub;
        // C=C (second line fades)
        g += `<line x1="${x + 10}" y1="${y - 3.5}" x2="${x2 - 10}" y2="${y - 3.5}" stroke="var(--ink)" stroke-width="2"/><line x1="${x + 10}" y1="${y + 3.5}" x2="${x2 - 10}" y2="${y + 3.5}" stroke="var(--ink)" stroke-width="2" opacity="${1 - e}"/>`;
        [[x, s[0], s[1]], [x2, s[2], s[3]]].forEach(([cx, a, b]) => {
          g += `<text x="${cx}" y="${y + 6}" font-size="${fs}" text-anchor="middle" font-weight="700" fill="var(--ink)">C</text>`;
          g += `<line x1="${cx}" y1="${y - 11}" x2="${cx}" y2="${y - 27}" stroke="var(--ink)" stroke-width="2"/><text x="${cx}" y="${y - 32}" font-size="${fs}" text-anchor="middle" fill="${ATC11(a)}">${a}</text>`;
          g += `<line x1="${cx}" y1="${y + 11}" x2="${cx}" y2="${y + 27}" stroke="var(--ink)" stroke-width="2"/><text x="${cx}" y="${y + 45}" font-size="${fs}" text-anchor="middle" fill="${ATC11(b)}">${b}</text>`;
        });
        if (k < 3) g += `<line x1="${x2 + 10}" y1="${y}" x2="${x2 + 10 + 24 * e}" y2="${y}" stroke="var(--c)" stroke-width="2.5" opacity="${e}"/>`;
        if (k === 0 || k === 3) g += `<line x1="${k ? x2 + 10 : x - 10}" y1="${y}" x2="${k ? x2 + 22 : x - 22}" y2="${y}" stroke="var(--c)" stroke-width="2.5" opacity="${e}"/>`;
      }
      if (e > .95) g += `<text x="190" y="180" font-size="14" text-anchor="middle" fill="var(--c)">…${us11(m.unit)}…  ${L2("(n times)", "(n বার)")}</text>`;
    } else {
      const bw = 104, gap = 20 * (1 - e);
      const blocks = [["HOOC", "(CH₂)₄", "COOH"], ["H₂N", "(CH₂)₆", "NH₂"], ["HOOC", "(CH₂)₄", "COOH"]];
      blocks.forEach((b, k) => {
        const x = 16 + k * (bw + 8) + (k - 1) * gap;
        g += `<rect x="${x}" y="${y - 20}" width="${bw}" height="40" rx="8" fill="${k === 1 ? "var(--c-soft)" : "var(--sheet)"}" stroke="var(--c)" stroke-width="2"/>`;
        g += `<text x="${x + bw / 2}" y="${y + 6}" font-size="15" text-anchor="middle" fill="var(--ink)">${b[1]}</text>`;
        g += `<text x="${x + 3}" y="${y - 26}" font-size="13" fill="var(--c)">${k > 0 && e > .9 ? (k === 1 ? "NH" : "CO") : b[0]}</text>`;
        g += `<text x="${x + bw - 3}" y="${y - 26}" font-size="13" text-anchor="end" fill="var(--c)">${k < 2 && e > .9 ? (k === 0 ? "CO" : "NH") : b[2]}</text>`;
      });
      [0, 1].forEach(k => { const x = 16 + (k + 1) * (bw + 8) - 4 + (k - 0.5) * gap; g += `<text x="${x}" y="${y + 50 + e * 25}" font-size="14" text-anchor="middle" fill="var(--c)" opacity="${e}">H₂O ↓</text>`; });
      if (e > .95) g += `<text x="190" y="186" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("amide link –CO–NH– forms, water leaves", "অ্যামাইড সংযোগ –CO–NH– তৈরি, পানি বের হয়")}</text>`;
    }
    g += `</svg>`;
    $("#k11psv", el).innerHTML = g;
    const lg = +$("#k11pn", el).value, n = Math.round(Math.pow(10, lg));
    $("#k11pn-v", el).textContent = B11(n);
    const mr = n * m.m;
    const nice = x => B11((Math.round(x * 10) / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
    $("#k11po", el).innerHTML = `<b>${m.pol()}</b>: ${L2("repeating unit", "পুনরাবৃত্ত একক")} ${fx11(m.unit)} (M<sub>r</sub> ${n11(m.m, 1)})<br>M<sub>r</sub>(${L2("polymer", "পলিমার")}) = n × ${n11(m.m, 1)} = ${nice(n)} × ${n11(m.m, 1)} ≈ <b>${nice(mr)}</b>` +
      (m.nylon ? "<br>" + L2(`Condensation: ${nice(2 * n)} water molecules released (2n).`, `ঘনীভবন: ${nice(2 * n)}টি পানির অণু বের হয় (২n)।`) : "<br>" + L2("Addition: nothing is given off; the double bonds open and join.", "সংযোজন: কিছুই বের হয় না; দ্বিবন্ধন খুলে জুড়ে যায়।"));
  };
  chips11(el, ".k11pm", b => { mi = +b.dataset.i; p = 0; run = false; draw(); });
  $("#k11pgo", el).addEventListener("click", () => { if (REDUCED) { p = 1; draw(); } else run = true; });
  $("#k11prs", el).addEventListener("click", () => { p = 0; run = false; draw(); });
  $("#k11pn", el).addEventListener("input", draw);
  if (!REDUCED) animate(el, dt => { if (run) { p = Math.min(1, p + dt * 0.6); if (p >= 1) run = false; draw(); } });
  draw();
};
