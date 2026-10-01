/* ---- chemistry chapter 6 widgets: mole concept and chemical counting ---- */
const B6 = x => bnNum(x, LANG);
const NA6 = 6.023e23;
/* number → string; scientific form for very large/small values; Bangla digits when needed */
const f6 = (x, d = 2) => {
  if (!isFinite(x)) return "—";
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) { const e = Math.floor(Math.log10(a)); let m = +(x / Math.pow(10, e)).toFixed(3); return B6(m + " × 10<sup>" + e + "</sup>").replace("-", "−"); }
  let s = (+x.toFixed(d)).toString();
  return B6(s).replace("-", "−");
};
/* SVG-safe version: superscript as tspan */
const f6s = (x, d = 2) => f6(x, d).replace(/<sup>(.*?)<\/sup>/, '<tspan dy="-6" font-size="11">$1</tspan>');
const chips6 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const onIn6 = (el, fn, sel = "input") => el.querySelectorAll(sel).forEach(i => i.addEventListener("input", fn));
/* atomic masses used by the book */
const AM6 = { H: 1, He: 4, Li: 7, C: 12, N: 14, O: 16, F: 19, Ne: 20, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40, K: 39, Ca: 40, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Pb: 207 };
/* parse "Al2(SO4)3", "CuSO4.5H2O", "CuSO4·5H2O" (Unicode subscripts allowed) → {El: count} in order of first appearance; null if invalid */
const parse6 = (raw) => {
  let s = String(raw).replace(/[₀-₉]/g, c => "₀₁₂₃₄₅₆₇₈₉".indexOf(c)).replace(/\s+/g, "").replace(/[·*•]/g, ".");
  if (!s || /[^A-Za-z0-9().]/.test(s)) return null;
  const tot = {}, order = [];
  for (const part0 of s.split(".")) {
    if (!part0) return null;
    const m = part0.match(/^(\d*)(.+)$/); const k = +(m[1] || 1); const part = m[2];
    const st = [{}]; let i = 0;
    while (i < part.length) {
      const c = part[i];
      if (c === "(") { st.push({}); i++; }
      else if (c === ")") { i++; const n = (part.slice(i).match(/^\d*/)[0]); i += n.length; if (st.length < 2) return null; const d = st.pop(); for (const e in d) st[st.length - 1][e] = (st[st.length - 1][e] || 0) + d[e] * (+n || 1); }
      else { const em = part.slice(i).match(/^[A-Z][a-z]?/); if (!em || !(em[0] in AM6)) return null; i += em[0].length; const n = part.slice(i).match(/^\d*/)[0]; i += n.length; st[st.length - 1][em[0]] = (st[st.length - 1][em[0]] || 0) + (+n || 1); if (!order.includes(em[0])) order.push(em[0]); }
    }
    if (st.length !== 1) return null;
    for (const e in st[0]) tot[e] = (tot[e] || 0) + st[0][e] * k;
  }
  const out = {}; order.forEach(e => out[e] = tot[e]); return out;
};
const mass6 = (f) => { const p = typeof f === "string" ? parse6(f) : f; if (!p) return NaN; return Object.keys(p).reduce((s, e) => s + AM6[e] * p[e], 0); };
/* "H2SO4" → H<sub>2</sub>SO<sub>4</sub>; a leading hydrate number stays full size */
const fx6 = s => String(s).replace(/[·.]\s*(\d+)/g, "·$1 ").replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>").replace(/·(\d+) /g, "·$1");
/* SVG-safe formula: Unicode subscripts */
const us6 = f => String(f).replace(/[.]/g, "·").replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + d.replace(/\d/g, c => "₀₁₂₃₄₅₆₇₈₉"[c]));
/* element colours (theme variables only) */
const EC6 = { H: "var(--muted)", C: "var(--ink)", O: "var(--bad)", N: "var(--c)", S: "var(--note)", Cl: "var(--good)", Na: "var(--c)", Al: "var(--note)", Cu: "var(--c)", Ca: "var(--good)", Fe: "var(--bad)", Mg: "var(--good)", K: "var(--c)" };
const ec6 = (e, i) => EC6[e] || ["var(--c)", "var(--note)", "var(--good)", "var(--bad)"][i % 4];

/* 6.1 mole ↔ mass ↔ particles, counted in mole-packets */
W.k6mole = (el) => {
  const S = ["C", "H2O", "CO2", "NaCl", "H2SO4", "O2", "CaCO3"];
  let f = "H2O";
  el.innerHTML = `<div class="chipset k6mc" role="group">${S.map(s => `<button data-f="${s}" aria-pressed="${s === f}">${fx6(s)}</button>`).join("")}</div>
  <div class="w-row" style="margin:8px 0"><label for="k6mw">${L2("Mass w (g)", "ভর w (g)")}</label><input class="w-in" id="k6mw" type="number" min="0" step="any" value="18"></div>
  ${slider("k6mn", L2("Moles n", "মোল n"), 0.05, 5, 0.05, 1, "mol")}
  <div class="svgwrap fit" id="k6msv"></div><div class="w-out" id="k6mo"></div>`;
  const inp = $("#k6mw", el), sl = $("#k6mn", el);
  const draw = (n) => {
    const M = mass6(f), w = n * M, N = n * NA6;
    $("#k6mn-v", el).textContent = B6((+n.toFixed(3)).toString()) + " mol";
    const box = (x, lab, val) => `<rect x="${x}" y="14" width="104" height="50" rx="8" fill="var(--c-soft)" stroke="var(--c)"/><text x="${x + 52}" y="33" font-size="13" text-anchor="middle" fill="var(--muted)">${lab}</text><text x="${x + 52}" y="54" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${val}</text>`;
    let g = `<svg viewBox="0 0 380 190" role="img" aria-label="${L2("mole conversions", "মোল রূপান্তর")}">${arrowDefs("k6ma", "var(--c)")}
      ${box(4, L2("mass", "ভর"), f6(w) + " g")}${box(138, L2("moles", "মোল"), f6(n, 3) + " mol")}${box(272, L2("particles", "কণা"), f6s(N))}
      <line x1="110" y1="39" x2="134" y2="39" stroke="var(--c)" stroke-width="2" marker-end="url(#k6ma)"/><line x1="244" y1="39" x2="268" y2="39" stroke="var(--c)" stroke-width="2" marker-end="url(#k6ma)"/>
      <text x="122" y="80" font-size="13" text-anchor="middle" fill="var(--c)">÷ ${B6(M)}</text><text x="256" y="80" font-size="13" text-anchor="middle" fill="var(--c)">× Nₐ</text>`;
    // mole packets: each bag = 1 mol = 6.023×10^23 particles
    const full = Math.floor(n + 1e-9), part = n - full, bags = Math.min(5, Math.ceil(n - 1e-9));
    for (let i = 0; i < bags; i++) {
      const x = 14 + i * 72, y = 100, fr = i < full ? 1 : part;
      g += `<path d="M${x} ${y + 12} q0 -12 12 -12 h36 q12 0 12 12 v52 q0 8 -8 8 h-44 q-8 0 -8 -8 z" fill="none" stroke="var(--c)" stroke-width="2"/>
        <rect x="${x + 2}" y="${y + 70 - 60 * fr}" width="56" height="${60 * fr}" rx="4" fill="var(--c)" opacity=".35"/>
        <text x="${x + 30}" y="${y + 44}" font-size="12" text-anchor="middle" fill="var(--ink)">${fr === 1 ? B6("1") + " mol" : f6(fr, 2)}</text>`;
    }
    g += `<text x="190" y="186" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("each full bag = 1 mole = 6.023 × 10²³ particles", "প্রতিটি ভরা থলে = ১ মোল = ৬.০২৩ × ১০²³টি কণা")}</text></svg>`;
    $("#k6msv", el).innerHTML = g;
    $("#k6mo", el).innerHTML = L2(`M(${fx6(f)}) = ${f6(M)} g/mol. n = w ÷ M = ${f6(w)} ÷ ${f6(M)} = <b>${f6(n, 3)} mol</b>; N = n × Nₐ = <b>${f6(N)}</b> ${f === "C" ? "atoms" : f === "NaCl" ? "formula units" : "molecules"}. One particle weighs ${f6(M / NA6)} g.`,
      `M(${fx6(f)}) = ${f6(M)} g/mol। n = w ÷ M = ${f6(w)} ÷ ${f6(M)} = <b>${f6(n, 3)} mol</b>; N = n × Nₐ = <b>${f6(N)}</b>টি ${f === "C" ? "পরমাণু" : f === "NaCl" ? "সংকেত-একক" : "অণু"}। একটি কণার ভর ${f6(M / NA6)} g।`);
  };
  const fromSlider = () => { const n = +sl.value; inp.value = +(n * mass6(f)).toFixed(3); draw(n); };
  inp.addEventListener("input", () => { const w = Math.max(0, +inp.value || 0); const n = Math.min(5, w / mass6(f)); sl.value = n; draw(Math.max(0, n)); });
  sl.addEventListener("input", fromSlider);
  chips6(el, ".k6mc", b => { f = b.dataset.f; fromSlider(); });
  fromSlider();
};

/* 6.1.1 molar volume of gases at STP */
W.k6gas = (el) => {
  const G = [["H2", "H₂"], ["N2", "N₂"], ["O2", "O₂"], ["CO2", "CO₂"], ["CH4", "CH₄"], ["NH3", "NH₃"]];
  let gi = 3;
  el.innerHTML = `<div class="chipset k6gc" role="group">${G.map((q, i) => `<button data-i="${i}" aria-pressed="${i === gi}">${q[1]}</button>`).join("")}</div>
  ${slider("k6gn", L2("Moles n", "মোল n"), 0.1, 3, 0.1, 1, "mol")}<div class="svgwrap fit" id="k6gsv"></div><div class="w-out" id="k6go"></div>`;
  const draw = () => {
    const n = sv(el, "k6gn", "mol", 1), f = G[gi][0], M = mass6(f), V = n * 22.4;
    const side = 30 * Math.cbrt(V / 22.4) * 2.2, cx = 90, base = 160, d = side * 0.35;
    let g = `<svg viewBox="0 0 380 250" role="img" aria-label="${L2("molar volume", "মোলার আয়তন")}">
      <path d="M${cx - side / 2} ${base} h${side} v${-side} h${-side} z" fill="var(--c)" opacity=".25" stroke="var(--c)" stroke-width="2"/>
      <path d="M${cx - side / 2} ${base - side} l${d} ${-d} h${side} l${-d} ${d} M${cx + side / 2} ${base} l${d} ${-d} v${-side} " fill="none" stroke="var(--c)" stroke-width="2"/>`;
    for (let i = 0; i < Math.min(60, Math.round(n * 20)); i++) { const px = cx - side / 2 + 6 + ((i * 37) % 97) / 97 * (side - 12), py = base - 6 - ((i * 53) % 89) / 89 * (side - 12); g += `<circle cx="${px}" cy="${py}" r="2.2" fill="var(--ink)" opacity=".6"/>`; }
    g += `<text x="${cx}" y="${base + 22}" font-size="15" font-weight="700" text-anchor="middle" fill="var(--ink)">${f6(V, 2)} L</text>
      <text x="${cx}" y="${base + 40}" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("at STP", "প্রমাণ অবস্থায়")} (0 °C, 1 atm)</text>`;
    // same-volume comparison: mass of 22.4 L of each gas
    g += `<text x="200" y="22" font-size="13" fill="var(--muted)">${L2("mass of 22.4 L (1 mol):", "২২.৪ L-এর (১ mol) ভর:")}</text>`;
    G.forEach((q, i) => { const m = mass6(q[0]), y = 40 + i * 30, w = m / 44 * 110;
      g += `<text x="200" y="${y + 14}" font-size="14" fill="${i === gi ? "var(--bad)" : "var(--ink)"}" font-weight="${i === gi ? 700 : 400}">${q[1]}</text>
        <rect x="240" y="${y + 2}" width="${w}" height="16" rx="3" fill="${i === gi ? "var(--bad)" : "var(--c)"}" opacity="${i === gi ? .85 : .45}"/>
        <text x="${244 + w}" y="${y + 15}" font-size="12" fill="var(--muted)">${B6(m)} g</text>`; });
    g += `</svg>`;
    $("#k6gsv", el).innerHTML = g;
    $("#k6go", el).innerHTML = L2(`V = n × 22.4 = ${f6(n, 1)} × 22.4 = <b>${f6(V, 2)} L</b>; mass w = n × M = ${f6(n, 1)} × ${M} = <b>${f6(n * M, 2)} g</b>; molecules N = <b>${f6(n * NA6)}</b>. Every gas gives the same volume per mole; only the mass differs.`,
      `V = n × ২২.৪ = ${f6(n, 1)} × ২২.৪ = <b>${f6(V, 2)} L</b>; ভর w = n × M = ${f6(n, 1)} × ${B6(M)} = <b>${f6(n * M, 2)} g</b>; অণু N = <b>${f6(n * NA6)}</b>। প্রতি মোলে সব গ্যাসের আয়তন একই; শুধু ভর আলাদা।`);
  };
  chips6(el, ".k6gc", b => { gi = +b.dataset.i; draw(); });
  onIn6(el, draw); draw();
};

/* 6.1.2 molar mass calculator from a formula */
W.k6molar = (el) => {
  const P = ["H2O", "CO2", "H2SO4", "Al2(SO4)3", "CuSO4.5H2O", "C6H12O6", "CO(NH2)2"];
  el.innerHTML = `<div class="chipset k6fc" role="group">${P.map((s, i) => `<button data-f="${s}" aria-pressed="${i === 4}">${fx6(s)}</button>`).join("")}</div>
  <div class="w-row" style="margin:8px 0"><label for="k6fi">${L2("Formula", "সংকেত")}</label><input class="w-in" id="k6fi" type="text" value="CuSO4.5H2O" autocomplete="off" spellcheck="false" style="width:12em"></div>
  <div class="tablewrap" id="k6ft"></div><div class="w-out" id="k6fo"></div>`;
  const inp = $("#k6fi", el);
  const draw = () => {
    const p = parse6(inp.value);
    if (!p || !Object.keys(p).length) { $("#k6ft", el).innerHTML = ""; $("#k6fo", el).innerHTML = L2("Type a formula such as H2SO4, Al2(SO4)3 or CuSO4.5H2O (capital letter for each element).", "H2SO4, Al2(SO4)3 বা CuSO4.5H2O-এর মতো সংকেত লেখো (প্রতিটি মৌলের প্রথম অক্ষর বড় হাতের)।"); return; }
    const M = mass6(p);
    let t = `<table class="terms"><tr><th>${L2("Element", "মৌল")}</th><th>${L2("Atoms per molecule", "অণুপ্রতি পরমাণু")}</th><th>${L2("Mass in 1 mol", "১ mol-এ ভর")}</th></tr>`;
    Object.keys(p).forEach(e => t += `<tr><td>${e}</td><td>${B6(p[e])} × ${B6(AM6[e])}</td><td>${f6(p[e] * AM6[e], 2)} g <span class="muted">(${B6(p[e])} mol ${L2("atoms", "পরমাণু")})</span></td></tr>`);
    t += `</table>`;
    $("#k6ft", el).innerHTML = t;
    const nat = Object.values(p).reduce((a, b) => a + b, 0);
    $("#k6fo", el).innerHTML = L2(`M = <b>${f6(M, 2)} g/mol</b>, so 1 mole of ${fx6(inp.value)} weighs ${f6(M, 2)} g. One molecule has ${B6(nat)} atoms; 1 mole contains ${f6(NA6)} molecules and ${f6(nat * NA6)} atoms in all.`,
      `M = <b>${f6(M, 2)} g/mol</b>, তাই ১ মোল ${fx6(inp.value)}-এর ভর ${f6(M, 2)} g। একটি অণুতে ${B6(nat)}টি পরমাণু; ১ মোলে ${f6(NA6)}টি অণু আর মোট ${f6(nat * NA6)}টি পরমাণু।`);
  };
  chips6(el, ".k6fc", b => { inp.value = b.dataset.f; draw(); });
  inp.addEventListener("input", () => { el.querySelectorAll(".k6fc button").forEach(q => q.setAttribute("aria-pressed", q.dataset.f === inp.value)); draw(); });
  draw();
};

/* 6.1.3 molarity: preparing a solution in a volumetric flask */
W.k6flask = (el) => {
  const S = [["NaCl", "NaCl"], ["Na2CO3", "Na₂CO₃"], ["NaOH", "NaOH"], ["CuSO4.5H2O", "CuSO₄·5H₂O"]], VV = [100, 250, 500, 1000];
  let si = 1, vi = 1;
  el.innerHTML = `<div class="chipset k6sc" role="group">${S.map((q, i) => `<button data-i="${i}" aria-pressed="${i === si}">${q[1]}</button>`).join("")}</div>
  <div class="chipset k6vc" role="group" style="margin-top:6px">${VV.map((v, i) => `<button data-i="${i}" aria-pressed="${i === vi}">${B6(v)} mL</button>`).join("")}</div>
  ${slider("k6fs", L2("Molarity S", "মোলারিটি S"), 0.05, 2, 0.05, 0.1, "M")}<div class="svgwrap fit" id="k6fsv"></div><div class="w-out" id="k6fo2"></div>`;
  const draw = () => {
    const Sm = sv(el, "k6fs", "M", 2), f = S[si][0], M = mass6(f), V = VV[vi], w = Sm * V * M / 1000, n = Sm * V / 1000;
    const blue = si === 3, op = Math.min(0.85, 0.12 + Sm * 0.36);
    const cx = 110, by = 210, R = 58, neckW = 22, neckTop = 30, mark = 70;
    let g = `<svg viewBox="0 0 380 240" role="img" aria-label="${L2("volumetric flask", "আয়তনিক ফ্লাস্ক")}"><defs><clipPath id="k6clip"><path d="M${cx - neckW / 2} ${mark} V${by - 2 * R + 14} A${R} ${R} 0 1 0 ${cx + neckW / 2} ${by - 2 * R + 14} V${mark} Z"/></clipPath></defs>
      <rect x="${cx - R - 4}" y="${mark}" width="${2 * R + 8}" height="${by - mark + 6}" fill="${blue ? "var(--c)" : "var(--note)"}" opacity="${op}" clip-path="url(#k6clip)"/>`;
    const dots = Math.round(Sm * 40);
    for (let i = 0; i < dots; i++) { const a = (i * 2.399) % (2 * Math.PI), r = Math.sqrt(((i * 0.618) % 1)) * (R - 8); g += `<circle cx="${cx + r * Math.cos(a)}" cy="${by - R + 4 + r * Math.sin(a)}" r="2.3" fill="var(--ink)" opacity=".7"/>`; }
    g += `<path d="M${cx - neckW / 2} ${neckTop} V${by - 2 * R + 14} A${R} ${R} 0 1 0 ${cx + neckW / 2} ${by - 2 * R + 14} V${neckTop}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <line x1="${cx - neckW / 2 - 5}" y1="${mark}" x2="${cx + neckW / 2 + 5}" y2="${mark}" stroke="var(--bad)" stroke-width="2"/>
      <text x="${cx + neckW / 2 + 9}" y="${mark + 5}" font-size="13" fill="var(--bad)">${B6(V)} mL ${L2("mark", "দাগ")}</text>
      <text x="${cx}" y="${by - R + 8}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${f6(Sm, 2)} M</text>`;
    // balance pan with the mass to weigh
    const bx = 290;
    g += `<rect x="${bx - 60}" y="180" width="120" height="30" rx="6" fill="var(--c-soft)" stroke="var(--rule)"/><text x="${bx}" y="200" font-size="15" font-weight="700" text-anchor="middle" fill="var(--ink)">${f6(w, 3)} g</text>
      <path d="M${bx - 44} 172 h88" stroke="var(--muted)" stroke-width="3"/><path d="M${bx - 22} 172 q22 -${Math.min(40, 8 + w / 4)} 44 0 z" fill="${blue ? "var(--c)" : "var(--sheet)"}" stroke="var(--muted)"/>
      <text x="${bx}" y="228" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("weigh this much", "এতটুকু ওজন করো")}</text></svg>`;
    $("#k6fsv", el).innerHTML = g;
    const tag = Math.abs(Sm - 1) < 1e-9 ? L2(" (molar)", " (মোলার)") : Math.abs(Sm - 0.5) < 1e-9 ? L2(" (semimolar)", " (সেমিমোলার)") : Math.abs(Sm - 0.1) < 1e-9 ? L2(" (decimolar)", " (ডেসিমোলার)") : "";
    $("#k6fo2", el).innerHTML = L2(`w = S × V × M ÷ 1000 = ${f6(Sm, 2)} × ${V} × ${f6(M, 1)} ÷ 1000 = <b>${f6(w, 3)} g</b> of ${S[si][1]} (${f6(n, 4)} mol) for ${V} mL of ${f6(Sm, 2)} M solution${tag}. Dissolve it, then add water only up to the mark.`,
      `w = S × V × M ÷ ১০০০ = ${f6(Sm, 2)} × ${B6(V)} × ${f6(M, 1)} ÷ ১০০০ = <b>${f6(w, 3)} g</b> ${S[si][1]} (${f6(n, 4)} mol), ${B6(V)} mL ${f6(Sm, 2)} M দ্রবণের জন্য${tag}। দ্রবীভূত করে শুধু দাগ পর্যন্ত পানি দাও।`);
  };
  chips6(el, ".k6sc", b => { si = +b.dataset.i; draw(); });
  chips6(el, ".k6vc", b => { vi = +b.dataset.i; draw(); });
  onIn6(el, draw); draw();
};

/* 6.2 percentage composition as a 100 g bar */
W.k6pct = (el) => {
  const P = ["HCl", "H2O", "H2SO4", "Al2(SO4)3", "NaCl", "CO(NH2)2", "CuSO4.5H2O"];
  el.innerHTML = `<div class="chipset k6pc" role="group">${P.map((s, i) => `<button data-f="${s}" aria-pressed="${i === 2}">${fx6(s)}</button>`).join("")}</div>
  <div class="w-row" style="margin:8px 0"><label for="k6pi">${L2("Formula", "সংকেত")}</label><input class="w-in" id="k6pi" type="text" value="H2SO4" autocomplete="off" spellcheck="false" style="width:12em"></div>
  <div class="svgwrap fit" id="k6psv"></div><div class="w-out" id="k6po"></div>`;
  const inp = $("#k6pi", el);
  const draw = () => {
    const p = parse6(inp.value);
    if (!p || !Object.keys(p).length) { $("#k6psv", el).innerHTML = ""; $("#k6po", el).innerHTML = L2("Type a valid formula, e.g. NH3 or CaCO3.", "সঠিক সংকেত লেখো, যেমন NH3 বা CaCO3।"); return; }
    const M = mass6(p), els = Object.keys(p);
    const hyd = String(inp.value).replace(/[·*•]/g, ".").split(".");
    const water = hyd.length === 2 && /^\d*H2O$/.test(hyd[1]) ? mass6(hyd[1]) : 0;
    const X0 = 14, W0 = 352, H = 40 + els.length * 26 + (water ? 70 : 0);
    let g = `<svg viewBox="0 0 380 ${H}" role="img" aria-label="${L2("percentage composition", "শতকরা সংযুতি")}"><text x="${X0}" y="14" font-size="13" fill="var(--muted)">${L2("100 g of the compound contains:", "১০০ g যৌগে আছে:")}</text>`;
    let x = X0;
    els.forEach((e, i) => { const pc = AM6[e] * p[e] * 100 / M, w = pc / 100 * W0; g += `<rect x="${x}" y="20" width="${Math.max(0.5, w)}" height="22" fill="${ec6(e, i)}" opacity=".8"/>`; if (w > 26) g += `<text x="${x + w / 2}" y="36" font-size="12" text-anchor="middle" fill="var(--sheet)" font-weight="700">${e}</text>`; x += w; });
    els.forEach((e, i) => { const pc = AM6[e] * p[e] * 100 / M, y = 62 + i * 26;
      g += `<rect x="${X0}" y="${y - 12}" width="14" height="14" fill="${ec6(e, i)}" opacity=".8"/><text x="${X0 + 22}" y="${y}" font-size="14" fill="var(--ink)">${e}: ${B6(AM6[e])} × ${B6(p[e])} × ${B6(100)} ÷ ${f6(M, 1)} = <tspan font-weight="700">${f6(pc, 2)}%</tspan></text>`; });
    if (water) {
      const y = 62 + els.length * 26 + 6, pw = water * 100 / M;
      g += `<text x="${X0}" y="${y + 4}" font-size="13" fill="var(--muted)">${L2("Split as salt + water of crystallisation:", "লবণ + কেলাস পানি হিসেবে ভাগ:")}</text>
        <rect x="${X0}" y="${y + 12}" width="${W0 * (100 - pw) / 100}" height="22" fill="var(--note)" opacity=".7"/><rect x="${X0 + W0 * (100 - pw) / 100}" y="${y + 12}" width="${W0 * pw / 100}" height="22" fill="var(--c)" opacity=".75"/>
        <text x="${X0 + 6}" y="${y + 28}" font-size="12" fill="var(--ink)">${us6(hyd[0])} ${f6(100 - pw, 2)}%</text><text x="${X0 + W0 - 6}" y="${y + 28}" font-size="12" text-anchor="end" fill="var(--sheet)" font-weight="700">H₂O ${f6(pw, 2)}%</text>`;
    }
    g += `</svg>`;
    $("#k6psv", el).innerHTML = g;
    $("#k6po", el).innerHTML = L2(`Molecular mass M = <b>${f6(M, 2)}</b>. The percentages add up to 100%.${water ? ` Water of crystallisation = ${f6(water)} × 100 ÷ ${f6(M, 1)} = <b>${f6(water * 100 / M, 2)}%</b>.` : ""}`,
      `আণবিক ভর M = <b>${f6(M, 2)}</b>। শতকরা মানগুলোর যোগফল ১০০%।${water ? ` কেলাস পানি = ${f6(water)} × ১০০ ÷ ${f6(M, 1)} = <b>${f6(water * 100 / M, 2)}%</b>।` : ""}`);
  };
  chips6(el, ".k6pc", b => { inp.value = b.dataset.f; draw(); });
  inp.addEventListener("input", () => { el.querySelectorAll(".k6pc button").forEach(q => q.setAttribute("aria-pressed", q.dataset.f === inp.value)); draw(); });
  draw();
};

/* 6.2.1 empirical and molecular formula, step by step */
W.k6emp = (el) => {
  const P = [
    [L2("Benzene", "বেনজিন"), [["C", 92.31], ["H", 7.69]], 78],
    [L2("Sulfuric acid", "সালফিউরিক এসিড"), [["H", 2.04], ["S", 32.65], ["O", 65.30]], 98],
    [L2("Iron oxide", "আয়রন অক্সাইড"), [["Fe", 70], ["O", 30]], 160],
    [L2("Glucose", "গ্লুকোজ"), [["C", 40], ["H", 6.67], ["O", 53.33]], 180],
    [L2("Ethene", "ইথিন"), [["C", 85.71], ["H", 14.29]], 28]];
  let pi = 0;
  el.innerHTML = `<div class="chipset k6ec" role="group">${P.map((q, i) => `<button data-i="${i}" aria-pressed="${i === pi}">${q[0]}</button>`).join("")}</div>
  <div class="w-row" id="k6ein" style="margin:8px 0"></div><div class="tablewrap" id="k6et"></div><div class="w-out" id="k6eo"></div>`;
  const build = () => {
    const q = P[pi];
    $("#k6ein", el).innerHTML = q[1].map(([e, v], i) => `<label for="k6e${i}">${e} %</label><input class="w-in k6ev" id="k6e${i}" type="number" step="any" min="0" value="${v}" style="width:5.5em">`).join("") +
      `<label for="k6eM">${L2("Molecular mass", "আণবিক ভর")}</label><input class="w-in k6ev" id="k6eM" type="number" step="any" min="1" value="${q[2]}" style="width:5.5em">`;
    onIn6(el, draw, ".k6ev"); draw();
  };
  const draw = () => {
    const q = P[pi], els = q[1].map(r => r[0]);
    const pct = els.map((e, i) => Math.max(0, +$("#k6e" + i, el).value || 0)), Mm = +$("#k6eM", el).value || 0;
    const r1 = pct.map((v, i) => v / AM6[els[i]]), mn = Math.min(...r1.filter(v => v > 0));
    const r2 = r1.map(v => v / mn);
    let k = 1; for (let t = 1; t <= 6; t++) { if (r2.every(v => Math.abs(v * t - Math.round(v * t)) < 0.1)) { k = t; break; } k = 0; }
    let t = `<table class="terms"><tr><th>${L2("Step", "ধাপ")}</th>${els.map(e => `<th>${e}</th>`).join("")}</tr>
      <tr><td>% ÷ ${L2("atomic mass", "পারমাণবিক ভর")}</td>${r1.map((v, i) => `<td>${f6(pct[i], 2)} ÷ ${B6(AM6[els[i]])} = ${f6(v, 3)}</td>`).join("")}</tr>
      <tr><td>÷ ${L2("smallest", "ক্ষুদ্রতম")} (${f6(mn, 3)})</td>${r2.map(v => `<td>${f6(v, 2)}</td>`).join("")}</tr>`;
    if (k > 1) t += `<tr><td>× ${B6(k)} ${L2("(make whole)", "(পূর্ণসংখ্যা বানাও)")}</td>${r2.map(v => `<td>${f6(v * k, 2)}</td>`).join("")}</tr>`;
    t += `</table>`;
    $("#k6et", el).innerHTML = t;
    if (!k || !isFinite(mn)) { $("#k6eo", el).innerHTML = L2("These percentages do not give a simple whole-number ratio (check that they add up to about 100).", "এই শতকরা মানগুলো থেকে সরল পূর্ণসংখ্যার অনুপাত আসে না (যোগফল প্রায় ১০০ কি না দেখো)।"); return; }
    const sub = r2.map(v => Math.round(v * k));
    const emp = els.map((e, i) => e + (sub[i] > 1 ? sub[i] : "")).join(""), E = els.reduce((s, e, i) => s + AM6[e] * sub[i], 0);
    const n = Mm / E, nr = Math.round(n), ok = nr >= 1 && Math.abs(n - nr) < 0.05;
    const mol = els.map((e, i) => e + (sub[i] * nr > 1 ? sub[i] * nr : "")).join("");
    const sum = pct.reduce((a, b) => a + b, 0);
    $("#k6eo", el).innerHTML = L2(`Empirical formula: <b>${fx6(emp)}</b> (mass ${f6(E, 1)}). n = ${f6(Mm, 1)} ÷ ${f6(E, 1)} = ${f6(n, 2)}${ok ? ` → molecular formula (${fx6(emp)})<sub>${nr}</sub> = <b>${fx6(mol)}</b>.` : ": not a whole number, so check the molecular mass."}${Math.abs(sum - 100) > 0.5 ? ` Note: your percentages add up to ${f6(sum, 2)}, not 100.` : ""}`,
      `স্থূল সংকেত: <b>${fx6(emp)}</b> (ভর ${f6(E, 1)})। n = ${f6(Mm, 1)} ÷ ${f6(E, 1)} = ${f6(n, 2)}${ok ? ` → আণবিক সংকেত (${fx6(emp)})<sub>${B6(nr)}</sub> = <b>${fx6(mol)}</b>।` : ": পূর্ণসংখ্যা নয়, তাই আণবিক ভর যাচাই করো।"}${Math.abs(sum - 100) > 0.5 ? ` লক্ষ করো: তোমার শতকরা মানের যোগফল ${f6(sum, 2)}, ১০০ নয়।` : ""}`);
  };
  chips6(el, ".k6ec", b => { pi = +b.dataset.i; build(); });
  build();
};

/* 6.3 balancing equations with atom counters */
W.k6bal = (el) => {
  const E = [
    [["H2", "O2"], ["H2O"]], [["Mg", "HCl"], ["MgCl2", "H2"]], [["Na2CO3", "HCl"], ["NaCl", "H2O", "CO2"]],
    [["Al2O3", "HCl"], ["AlCl3", "H2O"]], [["CH4", "O2"], ["CO2", "H2O"]], [["Fe", "O2"], ["Fe2O3"]], [["N2", "H2"], ["NH3"]], [["CaCO3", "HCl"], ["CaCl2", "CO2", "H2O"]]];
  let ei = 0, co = [];
  const lab = e => e[0].join(" + ") + " → " + e[1].join(" + ");
  el.innerHTML = `<div class="w-row"><label for="k6bs">${L2("Equation", "সমীকরণ")}</label><select class="w-in" id="k6bs">${E.map((e, i) => `<option value="${i}">${lab(e).replace(/(\d)/g, d => "₀₁₂₃₄₅₆₇₈₉"[d])}</option>`).join("")}</select></div>
  <div id="k6beq" style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:10px 0"></div><div class="svgwrap fit" id="k6bsv"></div><div class="w-out" id="k6bo"></div>
  <div class="w-row" style="margin-top:8px"><button class="btn" id="k6breset">${L2("Reset", "আবার শুরু")}</button></div>`;
  const sp = () => E[ei][0].concat(E[ei][1]);
  const buildEq = () => {
    const e = E[ei], all = sp(); let h = "";
    all.forEach((s, i) => {
      if (i > 0) h += `<span style="font-size:18px;color:var(--muted)">${i === e[0].length ? "→" : "+"}</span>`;
      h += `<span style="display:inline-flex;align-items:center;gap:3px;border:1px solid var(--rule);border-radius:10px;padding:3px 5px;background:var(--paper)">
        <button class="btn" data-i="${i}" data-d="-1" aria-label="${L2("decrease", "কমাও")}" style="min-width:30px;padding:2px 6px">−</button>
        <b style="min-width:1.1em;text-align:center;color:var(--c);font-size:18px">${B6(co[i])}</b><span style="font-size:18px">${fx6(s)}</span>
        <button class="btn" data-i="${i}" data-d="1" aria-label="${L2("increase", "বাড়াও")}" style="min-width:30px;padding:2px 6px">+</button></span>`;
    });
    $("#k6beq", el).innerHTML = h;
    el.querySelectorAll("#k6beq button").forEach(b => b.addEventListener("click", () => { const i = +b.dataset.i; co[i] = Math.max(1, Math.min(9, co[i] + +b.dataset.d)); buildEq(); }));
    draw();
  };
  const draw = () => {
    const e = E[ei], all = sp(), nl = e[0].length, cnt = [{}, {}], order = [];
    all.forEach((s, i) => { const p = parse6(s); for (const k in p) { cnt[i < nl ? 0 : 1][k] = (cnt[i < nl ? 0 : 1][k] || 0) + p[k] * co[i]; if (!order.includes(k)) order.push(k); } });
    const mx = Math.max(...order.map(k => Math.max(cnt[0][k] || 0, cnt[1][k] || 0)));
    let g = `<svg viewBox="0 0 380 ${30 + order.length * 34}" role="img" aria-label="${L2("atom count", "পরমাণু গণনা")}">
      <text x="160" y="16" font-size="13" text-anchor="end" fill="var(--muted)">${L2("left (reactants)", "বাম (বিক্রিয়ক)")}</text><text x="220" y="16" font-size="13" fill="var(--muted)">${L2("right (products)", "ডান (উৎপাদ)")}</text>`;
    let bal = true;
    order.forEach((k, j) => { const a = cnt[0][k] || 0, b = cnt[1][k] || 0, y = 28 + j * 34, ok = a === b; if (!ok) bal = false;
      const col = ok ? "var(--good)" : "var(--bad)", wa = a / mx * 140, wb = b / mx * 140;
      g += `<rect x="${170 - wa}" y="${y}" width="${wa}" height="22" rx="3" fill="${col}" opacity=".6"/><rect x="210" y="${y}" width="${wb}" height="22" rx="3" fill="${col}" opacity=".6"/>
        <text x="190" y="${y + 16}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${k}</text>
        <text x="${166 - wa}" y="${y + 16}" font-size="13" text-anchor="end" fill="var(--ink)">${B6(a)}</text><text x="${214 + wb}" y="${y + 16}" font-size="13" fill="var(--ink)">${B6(b)}</text>`; });
    g += `</svg>`;
    $("#k6bsv", el).innerHTML = g;
    const gcd = (x, y) => y ? gcd(y, x % y) : x, G = co.reduce(gcd);
    const eq = all.map((s, i) => (co[i] > 1 ? co[i] : "") + fx6(s)).map((t, i) => (i === 0 ? "" : i === nl ? " = " : " + ") + t).join("");
    $("#k6bo", el).innerHTML = bal ? (G > 1 ? L2(`Balanced, but every coefficient can be divided by ${G}. Use the smallest whole numbers.`, `সমতা হয়েছে, কিন্তু সব সহগকে ${B6(G)} দিয়ে ভাগ করা যায়। সবচেয়ে ছোট পূর্ণসংখ্যা ব্যবহার করো।`)
      : L2(`<b>Balanced!</b> ${eq}`, `<b>সমতা হয়েছে!</b> ${eq}`))
      : L2("Not balanced yet: the red elements have different numbers of atoms on the two sides. Change only the coefficients.", "এখনো সমতা হয়নি: লাল মৌলগুলোর পরমাণুর সংখ্যা দুই পাশে আলাদা। শুধু সহগ বদলাও।");
  };
  const reset = () => { co = sp().map(() => 1); buildEq(); };
  $("#k6bs", el).addEventListener("change", e => { ei = +e.target.value; reset(); });
  $("#k6breset", el).addEventListener("click", reset);
  reset();
};

/* 6.3.2 stoichiometry: scale a balanced equation */
W.k6stoich = (el) => {
  // [formula, coefficient, side (0 reactant, 1 product), gas?]
  const R = [
    [["Mg", 2, 0, 0], ["O2", 1, 0, 1], ["MgO", 2, 1, 0]],
    [["N2", 1, 0, 1], ["H2", 3, 0, 1], ["NH3", 2, 1, 1]],
    [["CaCO3", 1, 0, 0], ["HCl", 2, 0, 0], ["CaCl2", 1, 1, 0], ["CO2", 1, 1, 1], ["H2O", 1, 1, 0]],
    [["CH4", 1, 0, 1], ["O2", 2, 0, 1], ["CO2", 1, 1, 1], ["H2O", 2, 1, 0]],
    [["H2", 2, 0, 1], ["O2", 1, 0, 1], ["H2O", 2, 1, 0]]];
  const eqs = r => r.map((s, i) => (i === 0 ? "" : s[2] !== r[i - 1][2] ? " → " : " + ") + (s[1] > 1 ? s[1] : "") + fx6(s[0])).join("");
  let ri = 0;
  el.innerHTML = `<div class="chipset k6rc" role="group">${R.map((r, i) => `<button data-i="${i}" aria-pressed="${i === ri}">${eqs(r)}</button>`).join("")}</div>
  <div id="k6rsl"></div><div class="tablewrap" id="k6rt"></div><div class="svgwrap fit" id="k6rsv"></div><div class="w-out" id="k6ro"></div>`;
  const setup = () => { const f = R[ri][0][0]; $("#k6rsl", el).innerHTML = slider("k6rw", L2(`Mass of ${f}`, `${f}-এর ভর`), 1, 100, 1, ri === 0 ? 5 : ri === 2 ? 10 : 8, "g"); onIn6(el, draw, "#k6rw"); draw(); };
  const draw = () => {
    const r = R[ri], w0 = sv(el, "k6rw", "g"), n0 = w0 / mass6(r[0][0]) / r[0][1];  // "reaction units"
    let t = `<table class="terms"><tr><th>${L2("Substance", "পদার্থ")}</th><th>mol</th><th>g</th><th>${L2("L at STP", "প্রমাণ অবস্থায় L")}</th></tr>`;
    const ms = [0, 0];
    r.forEach(s => { const n = n0 * s[1], w = n * mass6(s[0]); ms[s[2]] += w;
      t += `<tr><td>${B6(s[1] > 1 ? s[1] : "")}${fx6(s[0])} <span class="muted">${s[2] ? L2("product", "উৎপাদ") : L2("reactant", "বিক্রিয়ক")}</span></td><td>${f6(n, 3)}</td><td>${f6(w, 2)}</td><td>${s[3] ? f6(n * 22.4, 2) : "—"}</td></tr>`; });
    t += `</table>`;
    $("#k6rt", el).innerHTML = t;
    const mx = Math.max(ms[0], ms[1]);
    let g = `<svg viewBox="0 0 380 90" role="img" aria-label="${L2("mass balance", "ভরের হিসাব")}">`;
    [0, 1].forEach(side => { let x = 110; const y = 12 + side * 38;
      g += `<text x="104" y="${y + 17}" font-size="13" text-anchor="end" fill="var(--muted)">${side ? L2("products", "উৎপাদ") : L2("reactants", "বিক্রিয়ক")}</text>`;
      r.filter(s => s[2] === side).forEach((s, j) => { const w = n0 * s[1] * mass6(s[0]) / mx * 200; g += `<rect x="${x}" y="${y}" width="${w}" height="24" fill="${["var(--c)", "var(--note)", "var(--good)"][j % 3]}" opacity=".7" stroke="var(--sheet)"/>`; if (w > 34) g += `<text x="${x + w / 2}" y="${y + 17}" font-size="12" text-anchor="middle" fill="var(--ink)">${us6(s[0])}</text>`; x += w; });
      g += `<text x="${x + 6}" y="${y + 17}" font-size="13" font-weight="700" fill="var(--ink)">${f6(ms[side], 2)} g</text>`; });
    g += `</svg>`;
    $("#k6rsv", el).innerHTML = g;
    $("#k6ro", el).innerHTML = L2(`${f6(w0, 0)} g ${fx6(r[0][0])} = ${f6(w0 / mass6(r[0][0]), 3)} mol. Every other amount follows from the coefficients. Total mass of reactants = total mass of products = <b>${f6(ms[0], 2)} g</b>.`,
      `${f6(w0, 0)} g ${fx6(r[0][0])} = ${f6(w0 / mass6(r[0][0]), 3)} mol। বাকি সব পরিমাণ সহগ থেকে আসে। বিক্রিয়কের মোট ভর = উৎপাদের মোট ভর = <b>${f6(ms[0], 2)} g</b>।`);
  };
  chips6(el, ".k6rc", b => { ri = +b.dataset.i; setup(); });
  setup();
};

/* 6.4 limiting reactant: particles (Mg + O2) and masses (H2 + Cl2) */
W.k6limit = (el) => {
  let mode = 0;
  el.innerHTML = `<div class="chipset k6lc" role="group"><button data-m="0" aria-pressed="true">${L2("Particles: 2Mg + O₂", "কণা: 2Mg + O₂")}</button><button data-m="1" aria-pressed="false">${L2("Masses: H₂ + Cl₂", "ভর: H₂ + Cl₂")}</button></div>
  <div id="k6lsl"></div><div class="svgwrap fit" id="k6lsv"></div><div class="w-out" id="k6lo"></div>`;
  const setup = () => {
    $("#k6lsl", el).innerHTML = mode === 0 ? slider("k6la", L2("Mg atoms", "Mg পরমাণু"), 0, 20, 1, 4, "") + slider("k6lb", L2("O₂ molecules", "O₂ অণু"), 0, 12, 1, 4, "")
      : slider("k6la", L2("Mass of H₂", "H₂-এর ভর"), 0.5, 10, 0.5, 5, "g") + slider("k6lb", L2("Mass of Cl₂", "Cl₂-এর ভর"), 5, 200, 5, 75, "g");
    onIn6(el, draw, ".w-range"); draw();
  };
  const atom = (x, y, r, fill, t) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="var(--ink)" stroke-width=".8"/><text x="${x}" y="${y + 4}" font-size="${r > 11 ? 12 : 11}" text-anchor="middle" fill="var(--sheet)" font-weight="700">${t}</text>`;
  const draw = () => {
    if (mode === 0) {
      const a = sv(el, "k6la", ""), b = sv(el, "k6lb", "");
      const pairs = Math.min(Math.floor(a / 2), b), mgo = 2 * pairs, mgL = a - 2 * pairs, o2L = b - pairs;
      const rF = Math.max(1, Math.ceil(mgo / 8)), rM = Math.ceil(mgL / 8), rO = Math.ceil(o2L / 6);
      const ySep = 34 + rF * 36, yM = ySep + 44, yO = yM + rM * 34 + (rM ? 4 : 0), H = yO + rO * 34 + 6;
      let g = `<svg viewBox="0 0 380 ${H}" role="img" aria-label="${L2("limiting reactant", "লিমিটিং বিক্রিয়ক")}">
        <text x="8" y="18" font-size="14" fill="var(--muted)">${L2("Formed", "তৈরি হলো")}: ${B6(mgo)} MgO</text>`;
      for (let i = 0; i < mgo; i++) { const x = 22 + (i % 8) * 45, y = 44 + Math.floor(i / 8) * 36; g += atom(x, y, 13, "var(--good)", "Mg") + atom(x + 20, y, 10, "var(--bad)", "O"); }
      g += `<line x1="0" y1="${ySep}" x2="380" y2="${ySep}" stroke="var(--rule)"/><text x="8" y="${ySep + 22}" font-size="14" fill="var(--muted)">${L2("Left over", "অবশিষ্ট")}: ${B6(mgL)} Mg, ${B6(o2L)} O₂</text>`;
      for (let i = 0; i < mgL; i++) g += atom(22 + (i % 8) * 45, yM + Math.floor(i / 8) * 34, 13, "var(--good)", "Mg");
      for (let i = 0; i < o2L; i++) { const x = 22 + (i % 6) * 58, y = yO + 12 + Math.floor(i / 6) * 34; g += atom(x, y, 10, "var(--bad)", "O") + atom(x + 18, y, 10, "var(--bad)", "O"); }
      g += `</svg>`;
      $("#k6lsv", el).innerHTML = g;
      const lim = a === 0 || b === 0 ? "" : a / 2 < b ? "Mg" : a / 2 > b ? "O₂" : "=";
      $("#k6lo", el).innerHTML = lim === "" ? L2("Add both reactants.", "দুটি বিক্রিয়কই যোগ করো।") : lim === "=" ? L2(`Exactly the right ratio (2 : 1): both are used up and ${mgo} MgO form.`, `ঠিক সঠিক অনুপাত (২ : ১): দুটোই শেষ হয় আর ${B6(mgo)}টি MgO তৈরি হয়।`)
        : L2(`${a} Mg would need ${a / 2} O₂; there are ${b}. <b>${lim} is the limiting reactant</b>; ${lim === "Mg" ? o2L + " O₂ molecules are" : mgL + " Mg atoms are"} left over.`,
          `${B6(a)}টি Mg-এর দরকার ${B6(a / 2)}টি O₂; আছে ${B6(b)}টি। <b>${lim} লিমিটিং বিক্রিয়ক</b>; ${lim === "Mg" ? B6(o2L) + "টি O₂ অণু" : B6(mgL) + "টি Mg পরমাণু"} অবশিষ্ট থাকে।`);
    } else {
      const h = sv(el, "k6la", "g", 1), c = sv(el, "k6lb", "g", 0);
      const nh = h / 2, nc = c / 71, nr = Math.min(nh, nc), hL = (nh - nr) * 2, cL = (nc - nr) * 71, hcl = nr * 73;
      const mx = Math.max(h + c, 1), sc = 250 / mx;
      const bar = (y, lab, used, left, col) => `<text x="8" y="${y + 17}" font-size="14" fill="var(--ink)">${lab}</text><rect x="60" y="${y}" width="${used * sc}" height="24" fill="${col}" opacity=".75"/><rect x="${60 + used * sc}" y="${y}" width="${left * sc}" height="24" fill="none" stroke="${col}" stroke-dasharray="4 3"/>`;
      let g = `<svg viewBox="0 0 380 150" role="img" aria-label="${L2("limiting reactant by mass", "ভর দিয়ে লিমিটিং বিক্রিয়ক")}">
        ${bar(10, "H₂", nr * 2, hL, "var(--c)")}${bar(46, "Cl₂", nr * 71, cL, "var(--good)")}${bar(82, "HCl", hcl, 0, "var(--note)")}
        <text x="8" y="136" font-size="12" fill="var(--muted)">${L2("solid = reacts / forms · dashed = left over", "ভরাট = বিক্রিয়া করে / তৈরি হয় · ড্যাশ = অবশিষ্ট")}</text></svg>`;
      $("#k6lsv", el).innerHTML = g;
      const lim = nh < nc ? "H₂" : nh > nc ? "Cl₂" : "=";
      $("#k6lo", el).innerHTML = L2(`${f6(h, 1)} g H₂ = ${f6(nh, 3)} mol; ${f6(c, 0)} g Cl₂ = ${f6(nc, 3)} mol (ratio 1 : 1). ${lim === "=" ? "Both are used up exactly." : `<b>${lim} is limiting</b>; left over: ${lim === "Cl₂" ? f6(hL, 2) + " g H₂ (" + f6(hL / 2, 2) + " mol)" : f6(cL, 2) + " g Cl₂ (" + f6(cL / 71, 2) + " mol)"}.`} HCl formed = <b>${f6(hcl, 2)} g</b>.`,
        `${f6(h, 1)} g H₂ = ${f6(nh, 3)} mol; ${f6(c, 0)} g Cl₂ = ${f6(nc, 3)} mol (অনুপাত ১ : ১)। ${lim === "=" ? "দুটোই ঠিক ঠিক শেষ হয়।" : `<b>${lim} লিমিটিং</b>; অবশিষ্ট: ${lim === "Cl₂" ? f6(hL, 2) + " g H₂ (" + f6(hL / 2, 2) + " mol)" : f6(cL, 2) + " g Cl₂ (" + f6(cL / 71, 2) + " mol)"}।`} উৎপন্ন HCl = <b>${f6(hcl, 2)} g</b>।`);
    }
  };
  chips6(el, ".k6lc", b => { mode = +b.dataset.m; setup(); });
  setup();
};

/* 6.5 percentage yield */
W.k6yield = (el) => {
  // [label, reactant, product, product mass per gram of reactant]
  const R = [["2Mg + O₂ → 2MgO", "Mg", "MgO", 80 / 48, 2, 3.25], ["CaCO₃ → CaO + CO₂", "CaCO₃", "CaO", 56 / 100, 80, 39]];
  let ri = 0;
  el.innerHTML = `<div class="chipset k6yc" role="group">${R.map((r, i) => `<button data-i="${i}" aria-pressed="${i === ri}">${r[0]}</button>`).join("")}</div><div id="k6ysl"></div>
  <div class="svgwrap fit" id="k6ysv"></div><div class="w-out" id="k6yo"></div>`;
  const setup = () => { const r = R[ri];
    $("#k6ysl", el).innerHTML = slider("k6yw", L2(`Mass of ${r[1]}`, `${r[1]}-এর ভর`), ri ? 10 : 0.5, ri ? 200 : 10, ri ? 5 : 0.5, r[4], "g") + slider("k6ya", L2(`Actual ${r[2]} collected`, `সংগৃহীত প্রকৃত ${r[2]}`), 0, 110, 0.5, r[5] / (r[4] * r[3]) * 100, "%");
    onIn6(el, draw, ".w-range"); draw(); };
  const draw = () => {
    const r = R[ri], w = sv(el, "k6yw", "g", 1), th = w * r[3], fr = +$("#k6ya", el).value / 100, act = th * fr;
    $("#k6ya-v", el).textContent = B6(act.toFixed(2)) + " g";
    const pc = act / th * 100, sc = 250 / (th * 1.1);
    let g = `<svg viewBox="0 0 380 110" role="img" aria-label="${L2("percentage yield", "উৎপাদের শতকরা পরিমাণ")}">
      <text x="8" y="26" font-size="13" fill="var(--muted)">${L2("theoretical", "তাত্ত্বিক")}</text><rect x="90" y="10" width="${th * sc}" height="24" fill="none" stroke="var(--c)" stroke-width="2" stroke-dasharray="5 3"/><text x="${96 + th * sc}" y="27" font-size="13" fill="var(--ink)">${f6(th, 2)} g</text>
      <text x="8" y="66" font-size="13" fill="var(--muted)">${L2("actual", "প্রকৃত")}</text><rect x="90" y="50" width="${act * sc}" height="24" fill="${pc > 100 ? "var(--bad)" : "var(--c)"}" opacity=".75"/><text x="${96 + act * sc}" y="67" font-size="13" fill="var(--ink)">${f6(act, 2)} g</text>
      <text x="90" y="100" font-size="15" font-weight="700" fill="${pc > 100 ? "var(--bad)" : "var(--ink)"}">${L2("yield", "উৎপাদ")} = ${f6(pc, 1)}%</text></svg>`;
    $("#k6ysv", el).innerHTML = g;
    $("#k6yo", el).innerHTML = L2(`Theoretical yield = ${f6(w, 1)} g × ${f6(r[3], 3)} = ${f6(th, 3)} g ${r[2]}. % yield = ${f6(act, 2)} × 100 ÷ ${f6(th, 3)} = <b>${f6(pc, 1)}%</b>.${pc > 100 ? " More than 100% is impossible: the product must be wet or impure." : ""}`,
      `তাত্ত্বিক উৎপাদ = ${f6(w, 1)} g × ${f6(r[3], 3)} = ${f6(th, 3)} g ${r[2]}। উৎপাদের % = ${f6(act, 2)} × ১০০ ÷ ${f6(th, 3)} = <b>${f6(pc, 1)}%</b>।${pc > 100 ? " ১০০%-এর বেশি অসম্ভব: উৎপাদ নিশ্চয়ই ভেজা বা অবিশুদ্ধ।" : ""}`);
  };
  chips6(el, ".k6yc", b => { ri = +b.dataset.i; setup(); });
  setup();
};
