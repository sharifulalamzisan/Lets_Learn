/* ---- chemistry chapter 9 widgets: acid–base balance ---- */
const B9 = x => bnNum(x, LANG);
const n9 = (x, d = 2) => B9((+(+x).toFixed(d)).toString()).replace("-", "−");
const chips9 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
/* "H2SO4" → H<sub>2</sub>SO<sub>4</sub>; charges written with ^ e.g. "SO4^2-" */
const fx9 = s => String(s).replace(/\^([0-9]*[+−-])/g, "<sup>$1</sup>").replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>");
/* SVG-safe formula with Unicode subscripts */
const us9 = f => String(f).replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + d.replace(/\d/g, c => "₀₁₂₃₄₅₆₇₈₉"[c]));
/* 10^x as HTML with Bangla digits */
const pow9 = (e) => { const r = Math.round(e * 100) / 100; return B9("10") + "<sup>" + B9(String(r)).replace("-", "−") + "</sup>"; };
/* number in a × 10^n form (HTML) */
const sci9 = (x, d = 2) => { if (!isFinite(x) || x <= 0) return B9("0"); const e = Math.floor(Math.log10(x)); const m = x / Math.pow(10, e); if (e >= -2 && e <= 3) return n9(x, e < 0 ? 4 : d); return n9(m, d) + " × " + B9("10") + "<sup>" + B9(String(e)).replace("-", "−") + "</sup>"; };

/* ---------- indicator colours (real dye colours, so hex is intended) ---------- */
const UNI9 = ["#c8102e", "#e0301e", "#e8401f", "#f5801f", "#f9b233", "#f3d02c", "#cfdc22", "#6fbf44", "#2fa84f", "#1c9a8a", "#2b7bb9", "#3a55a4", "#4b3c96", "#5b2d86", "#4a1f6e"];
const hx9 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix9 = (a, b, t) => { const A = hx9(a), Bc = hx9(b); t = Math.max(0, Math.min(1, t)); return "rgb(" + A.map((v, i) => Math.round(v + (Bc[i] - v) * t)).join(",") + ")"; };
const uni9 = pH => { const p = Math.max(0, Math.min(14, pH)), i = Math.min(13, Math.floor(p)); return mix9(UNI9[i], UNI9[i + 1], p - i); };
const litmus9 = pH => pH <= 5 ? "#d23b45" : pH >= 8 ? "#3566cc" : mix9("#d23b45", "#3566cc", (pH - 5) / 3);
/* phenolphthalein: colourless → pink; returns [colour, opacity] */
const phth9 = pH => pH < 8.2 ? ["#e0409a", 0] : [mix9("#f3a6cf", "#d6278a", (pH - 8.2) / 1.8), Math.min(1, 0.35 + (pH - 8.2) / 1.8 * 0.65)];
const mo9 = pH => pH <= 3.1 ? "#e0452b" : pH >= 4.4 ? "#f2c230" : mix9("#e0452b", "#f2c230", (pH - 3.1) / 1.3);
const IND9 = {
  lit: { n: () => L2("Litmus", "লিটমাস"), c: pH => [litmus9(pH), 1], w: pH => pH <= 5 ? L2("red", "লাল") : pH >= 8 ? L2("blue", "নীল") : L2("purple (changing)", "বেগুনি (বদলাচ্ছে)") },
  php: { n: () => L2("Phenolphthalein", "ফেনলফথ্যালিন"), c: phth9, w: pH => pH < 8.2 ? L2("colourless", "বর্ণহীন") : pH < 10 ? L2("light pink", "হালকা গোলাপি") : L2("pink", "গোলাপি") },
  mo: { n: () => L2("Methyl orange", "মিথাইল অরেঞ্জ"), c: pH => [mo9(pH), 1], w: pH => pH <= 3.1 ? L2("red", "লাল") : pH >= 4.4 ? L2("yellow", "হলুদ") : L2("orange", "কমলা") },
  uni: { n: () => L2("Universal indicator", "ইউনিভার্সাল নির্দেশক"), c: pH => [uni9(pH), 1], w: pH => pH < 3 ? L2("red", "লাল") : pH < 5 ? L2("orange", "কমলা") : pH < 6.5 ? L2("yellow", "হলুদ") : pH < 7.5 ? L2("green", "সবুজ") : pH < 10.5 ? L2("blue", "নীল") : L2("violet", "বেগুনি") }
};
const sw9 = (col, op, big) => `<span style="display:inline-block;width:${big ? 26 : 18}px;height:${big ? 26 : 18}px;border-radius:50%;vertical-align:middle;border:1.5px solid var(--muted);background:${op ? col : "transparent"};opacity:${op ? Math.max(.35, op) : 1}"></span>`;

/* ================= 9.1 reactions of dilute acids ================= */
W.k9acid = (el) => {
  const A = [
    { id: "HCl", f: "HCl", s: 1, nm: () => L2("hydrochloric acid", "হাইড্রোক্লোরিক এসিড") },
    { id: "H2SO4", f: "H2SO4", s: 1, nm: () => L2("sulfuric acid", "সালফিউরিক এসিড") },
    { id: "AcOH", f: "CH3COOH", s: 0.18, nm: () => L2("ethanoic acid (weak)", "ইথানয়িক এসিড (মৃদু)") }];
  // reagent: label, kind, gas, equation per acid
  const R = [
    { id: "bl", lab: () => L2("Blue litmus", "নীল লিটমাস"), kind: "litmus", eq: null },
    { id: "rl", lab: () => L2("Red litmus", "লাল লিটমাস"), kind: "litmus", eq: null },
    { id: "Mg", lab: () => "Mg", kind: "metal", gas: "H2", eq: { HCl: "Mg(s) + 2HCl(aq) → MgCl2(aq) + H2(g)", H2SO4: "Mg(s) + H2SO4(aq) → MgSO4(aq) + H2(g)", AcOH: "Mg(s) + 2CH3COOH(aq) → (CH3COO)2Mg(aq) + H2(g)" } },
    { id: "Zn", lab: () => "Zn", kind: "metal", gas: "H2", k: 0.45, eq: { HCl: "Zn(s) + 2HCl(aq) → ZnCl2(aq) + H2(g)", H2SO4: "Zn(s) + H2SO4(aq) → ZnSO4(aq) + H2(g)", AcOH: "Zn(s) + 2CH3COOH(aq) → (CH3COO)2Zn(aq) + H2(g)" } },
    { id: "CaCO3", lab: () => "CaCO3", kind: "carb", gas: "CO2", eq: { HCl: "CaCO3(s) + 2HCl(aq) → CaCl2(aq) + H2O(l) + CO2(g)", H2SO4: "CaCO3(s) + H2SO4(aq) → CaSO4(s) + H2O(l) + CO2(g)", AcOH: "CaCO3(s) + 2CH3COOH(aq) → (CH3COO)2Ca(aq) + H2O(l) + CO2(g)" } },
    { id: "NaHCO3", lab: () => "NaHCO3", kind: "carb", gas: "CO2", k: 1.4, eq: { HCl: "NaHCO3(s) + HCl(aq) → NaCl(aq) + H2O(l) + CO2(g)", H2SO4: "2NaHCO3(s) + H2SO4(aq) → Na2SO4(aq) + 2H2O(l) + 2CO2(g)", AcOH: "NaHCO3(s) + CH3COOH(aq) → CH3COONa(aq) + H2O(l) + CO2(g)" } },
    { id: "CuO", lab: () => "CuO", kind: "oxide", eq: { HCl: "CuO(s) + 2HCl(aq) → CuCl2(aq) + H2O(l)", H2SO4: "CuO(s) + H2SO4(aq) → CuSO4(aq) + H2O(l)", AcOH: "CuO(s) + 2CH3COOH(aq) → (CH3COO)2Cu(aq) + H2O(l)" } },
    { id: "NaOH", lab: () => "NaOH", kind: "alkali", eq: { HCl: "NaOH(aq) + HCl(aq) → NaCl(aq) + H2O(l)", H2SO4: "2NaOH(aq) + H2SO4(aq) → Na2SO4(aq) + 2H2O(l)", AcOH: "NaOH(aq) + CH3COOH(aq) → CH3COONa(aq) + H2O(l)" } }];
  let ai = 0, ri = 2, p = 0, run = false, bub = [], t0 = 0;
  el.innerHTML = `<div class="chipset k9aa" role="group" aria-label="${L2("acid", "এসিড")}">${A.map((a, i) => `<button data-i="${i}" aria-pressed="${i === ai}">${L2("dil. ", "লঘু ")}${fx9(a.f)}</button>`).join("")}</div>
  <div class="chipset k9ar" role="group" style="margin-top:6px" aria-label="${L2("add", "যোগ করো")}">${R.map((r, i) => `<button data-i="${i}" aria-pressed="${i === ri}">${fx9(r.lab())}</button>`).join("")}</div>
  <div class="w-row" style="margin-top:8px"><button class="btn solid" id="k9ago">${L2("Add to the acid", "এসিডে যোগ করো")}</button><button class="btn" id="k9ars">${L2("Reset", "আবার")}</button></div>
  <div class="svgwrap fit" id="k9asv"></div><div class="w-out" id="k9ao"></div>`;
  const rate = () => { const r = R[ri]; return A[ai].s * (r.k || 1) * (r.kind === "oxide" ? 0.35 : 1); };
  const draw = () => {
    const a = A[ai], r = R[ri], sp = rate();
    const X = 70, top = 24, bot = 196, w = 50, liq = 100;
    let sol = "var(--c-soft)", solOp = .55;
    if (r.kind === "oxide" && p > 0) { sol = a.id === "HCl" ? "#3fa39b" : "#3b82d6"; solOp = 0.15 + 0.55 * p; }
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("test tube reaction", "টেস্টটিউবে বিক্রিয়া")}">
      <path d="M${X - w / 2} ${top} V${bot - w / 2} A${w / 2} ${w / 2} 0 0 0 ${X + w / 2} ${bot - w / 2} V${top}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <clipPath id="k9aclip"><path d="M${X - w / 2 + 2} ${liq} V${bot - w / 2} A${w / 2 - 2} ${w / 2 - 2} 0 0 0 ${X + w / 2 - 2} ${bot - w / 2} V${liq} Z"/></clipPath>
      <rect x="${X - w}" y="${liq}" width="${2 * w}" height="${bot - liq + 4}" fill="${sol}" opacity="${solOp}" clip-path="url(#k9aclip)"/>
      <line x1="${X - w / 2 + 2}" y1="${liq}" x2="${X + w / 2 - 2}" y2="${liq}" stroke="var(--c)" stroke-width="1.5"/>`;
    if (r.kind === "litmus") {
      const blue = r.id === "bl", col = p > 0 ? (blue ? mix9("#3566cc", "#d23b45", p) : "#d23b45") : (blue ? "#3566cc" : "#d23b45");
      g += `<rect x="${X - 7}" y="${liq - 55}" width="14" height="${70 + p * 50}" rx="2" fill="${col}" stroke="var(--ink)" stroke-width=".8"/>`;
    } else if (r.kind !== "alkali") {
      const left = Math.max(0, 1 - p), cols = { metal: "var(--muted)", carb: "var(--sheet)", oxide: "#222" }, n = r.kind === "metal" ? 1 : 7;
      if (r.kind === "metal") g += `<rect x="${X - 16}" y="${bot - 30}" width="${32 * left + 0.5}" height="7" rx="2" fill="${cols.metal}" stroke="var(--ink)" stroke-width=".8" transform="rotate(-18 ${X} ${bot - 26})"/>`;
      else for (let i = 0; i < n; i++) { const rr = (r.kind === "oxide" ? 3.2 : 5) * Math.sqrt(left); if (rr > .3) g += `<circle cx="${X - 15 + (i * 37) % 31}" cy="${bot - 12 - (i % 3) * 7}" r="${rr}" fill="${cols[r.kind]}" stroke="var(--ink)" stroke-width=".8"/>`; }
    } else if (p > 0) {
      g += `<text x="${X + 34}" y="${liq + 20}" font-size="13" fill="var(--bad)">${L2("warm", "গরম")}</text>`;
    }
    bub.forEach(b => g += `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".7"/>`);
    g += `<text x="${X}" y="${bot + 20}" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("dil.", "লঘু")} ${us9(a.f)}</text>`;
    // gas test panel
    const gx = 200;
    if (r.gas === "H2") {
      const pop = p > 0.15;
      g += `<text x="${gx + 70}" y="22" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("Test the gas: lighted splint", "গ্যাস পরীক্ষা: জ্বলন্ত কাঠি")}</text>
        <line x1="${gx + 20}" y1="140" x2="${gx + 110}" y2="80" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/>
        ${pop ? `<path d="M${gx + 112} 78 l10 -14 l2 12 l12 -8 l-6 13 l14 1 l-13 6 l8 10 l-14 -4" fill="none" stroke="var(--bad)" stroke-width="2"/><text x="${gx + 140}" y="120" font-size="16" font-weight="700" text-anchor="middle" fill="var(--bad)">${L2("pop!", "পপ!")}</text>`
        : `<path d="M${gx + 110} 80 q-6 -14 2 -26 q10 12 2 26 z" fill="#f59e0b"/>`}
        <text x="${gx + 70}" y="170" font-size="13" text-anchor="middle" fill="var(--ink)">${pop ? L2("H₂ burns with a pop", "H₂ পপ শব্দে জ্বলে") : L2("waiting for gas…", "গ্যাসের অপেক্ষা…")}</text>`;
    } else if (r.gas === "CO2") {
      const milky = Math.min(1, p * 1.6);
      g += `<text x="${gx + 64}" y="84" font-size="13" text-anchor="end" fill="var(--muted)">${L2("Test the gas: lime water", "গ্যাস পরীক্ষা: চুনের পানি")}</text>
        <path d="M${X + 10} ${top + 4} V14 H${gx + 70} V${120}" fill="none" stroke="var(--muted)" stroke-width="2.5"/>
        <path d="M${gx + 35} 90 V180 q0 10 10 10 h50 q10 0 10 -10 V90" fill="none" stroke="var(--ink)" stroke-width="2.2"/>
        <rect x="${gx + 37}" y="110" width="66" height="79" rx="6" fill="#b9c2c8" opacity="${0.1 + milky * 0.85}"/>
        <text x="${gx + 70}" y="212" font-size="13" text-anchor="middle" fill="var(--ink)">${milky > .3 ? L2("turns milky: CO₂", "ঘোলা হয়: CO₂") : L2("clear", "স্বচ্ছ")}</text>`;
    } else {
      const msg = r.kind === "litmus" ? (r.id === "bl" ? L2("Acids turn blue litmus red", "এসিড নীল লিটমাসকে লাল করে") : L2("Red litmus stays red in acid", "এসিডে লাল লিটমাস লালই থাকে"))
        : r.kind === "oxide" ? L2("Black oxide dissolves; no gas", "কালো অক্সাইড দ্রবীভূত হয়; গ্যাস নেই") : L2("No gas, no colour: the tube warms", "গ্যাস বা রং নেই: টিউব গরম হয়");
      g += `<foreignObject x="${gx - 20}" y="70" width="170" height="90"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:14px;color:var(--ink);line-height:1.35">${msg}</div></foreignObject>`;
    }
    g += `</svg>`;
    $("#k9asv", el).innerHTML = g;
    // output text
    let o = "";
    if (r.kind === "litmus") o = r.id === "bl" ? L2(`H⁺ ions from ${a.nm()} change the litmus dye from blue to <b>red</b>. Weak acids do it too; they just have fewer H⁺.`, `${a.nm()}-এর H⁺ আয়ন লিটমাস রঞ্জকের রং নীল থেকে <b>লাল</b> করে। মৃদু এসিডও তা করে, শুধু H⁺ কম থাকে।`)
      : L2("Red litmus does not change in an acid; only an alkali turns it blue.", "এসিডে লাল লিটমাসের রং বদলায় না; শুধু ক্ষার একে নীল করে।");
    else {
      const eq = fx9(r.eq[a.id]);
      const type = r.kind === "metal" ? L2("acid + metal → salt + hydrogen", "এসিড + ধাতু → লবণ + হাইড্রোজেন") : r.kind === "carb" ? L2("acid + carbonate/bicarbonate → salt + water + CO₂", "এসিড + কার্বনেট/বাইকার্বনেট → লবণ + পানি + CO₂") : L2("acid + base → salt + water (neutralisation)", "এসিড + ক্ষারক → লবণ + পানি (প্রশমন)");
      let extra = "";
      if (a.id === "AcOH" && r.kind !== "alkali") extra = L2(" Ethanoic acid is weak, so it reacts much more slowly.", " ইথানয়িক এসিড মৃদু, তাই অনেক ধীরে বিক্রিয়া করে।");
      if (a.id === "H2SO4" && r.id === "CaCO3") extra = L2(" CaSO₄ hardly dissolves, so it coats the marble and the fizzing soon slows down.", " CaSO₄ প্রায় অদ্রবণীয়, তাই মার্বেলের গায়ে আস্তর পড়ে বুদবুদ শিগগিরই কমে যায়।");
      if (r.kind === "oxide") extra += L2(" (Warming helps oxides dissolve faster.)", " (গরম করলে অক্সাইড দ্রুত দ্রবীভূত হয়।)");
      o = `<b>${type}</b><br>${eq}${extra}`;
    }
    $("#k9ao", el).innerHTML = o + `<div class="hint">${L2("Safety: in the lab use small amounts of dilute acid, wear goggles, and never taste anything.", "সতর্কতা: গবেষণাগারে অল্প পরিমাণ লঘু এসিড নাও, গগলস পরো, কখনো কিছুর স্বাদ নেবে না।")}</div>`;
  };
  const step = (dt) => {
    const r = R[ri];
    if (run) { p = Math.min(1, p + dt * 0.12 * rate() * (r.kind === "litmus" ? 4 : 1)); if (p >= 1) run = false; }
    if (r.gas && p > 0 && p < 1) { const k = rate() * 14 * dt; const nb = Math.min(6, Math.floor(k) + (Math.random() < k - Math.floor(k) ? 1 : 0)); for (let i = 0; i < nb; i++) bub.push({ x: 52 + Math.random() * 36, y: 186 - Math.random() * 12, r: 1.5 + Math.random() * 2.5 }); }
    bub.forEach(b => b.y -= dt * (40 + b.r * 12)); bub = bub.filter(b => b.y > 103);
  };
  $("#k9ago", el).addEventListener("click", () => { if (p >= 1) { p = 0; bub = []; } if (REDUCED) { p = 1; bub = []; draw(); } else run = true; });
  $("#k9ars", el).addEventListener("click", () => { p = 0; run = false; bub = []; draw(); });
  chips9(el, ".k9aa", b => { ai = +b.dataset.i; p = 0; run = false; bub = []; draw(); });
  chips9(el, ".k9ar", b => { ri = +b.dataset.i; p = 0; run = false; bub = []; draw(); });
  draw();
  if (!REDUCED) animate(el, dt => { if (run || bub.length) { step(Math.min(dt, 0.05)); draw(); } });
};

/* ================= 9.2 dilute NaOH with metal salts ================= */
W.k9ppt = (el) => {
  const S = [
    { f: "Al(NO3)3", sol: null, ppt: "#f1f1ee", pf: "Al(OH)3", k: 3, amph: true, c: () => L2("white", "সাদা"), eq: "Al(NO3)3 + 3NaOH → Al(OH)3↓ + 3NaNO3" },
    { f: "Fe(NO3)2", sol: "#b9d9a0", ppt: "#5f7f45", pf: "Fe(OH)2", k: 2, c: () => L2("dirty green", "ময়লা সবুজ"), eq: "Fe(NO3)2 + 2NaOH → Fe(OH)2↓ + 2NaNO3" },
    { f: "Fe(NO3)3", sol: "#e6c27a", ppt: "#9c4a1a", pf: "Fe(OH)3", k: 3, c: () => L2("reddish-brown", "লালচে বাদামি"), eq: "Fe(NO3)3 + 3NaOH → Fe(OH)3↓ + 3NaNO3" },
    { f: "Cu(NO3)2", sol: "#5aa2ea", ppt: "#86c0ef", pf: "Cu(OH)2", k: 2, c: () => L2("light blue", "হালকা নীল"), eq: "Cu(NO3)2 + 2NaOH → Cu(OH)2↓ + 2NaNO3" },
    { f: "Zn(NO3)2", sol: null, ppt: "#f1f1ee", pf: "Zn(OH)2", k: 2, amph: true, c: () => L2("white", "সাদা"), eq: "Zn(NO3)2 + 2NaOH → Zn(OH)2↓ + 2NaNO3" },
    { f: "NH4Cl", sol: null, ppt: null, k: 1, nh4: true, eq: "NH4Cl + NaOH → NH3↑ + NaCl + H2O" }];
  let si = 3, drops = 0, warm = false, fall = 0;
  el.innerHTML = `<div class="chipset k9pc" role="group">${S.map((s, i) => `<button data-i="${i}" aria-pressed="${i === si}">${fx9(s.f)}</button>`).join("")}</div>
  <div class="w-row" style="margin-top:8px"><button class="btn solid" id="k9pd">${L2("Add a drop of NaOH", "এক ফোঁটা NaOH দাও")}</button><button class="btn" id="k9pw">${L2("Warm gently", "হালকা গরম করো")}</button><button class="btn" id="k9pr">${L2("Reset", "আবার")}</button></div>
  <div class="svgwrap fit" id="k9psv"></div><div class="w-out" id="k9po"></div>`;
  const draw = () => {
    const s = S[si], X = 120, top = 40, bot = 212, w = 56, liq = 110;
    const made = s.ppt ? Math.min(drops, s.k) / s.k : 0;
    const excess = s.amph ? Math.max(0, Math.min(1, (drops - s.k - 1) / 3)) : 0;
    const amt = made * (1 - excess);
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("precipitation test", "অধঃক্ষেপ পরীক্ষা")}">
      <clipPath id="k9pclip"><path d="M${X - w / 2 + 2} ${liq} V${bot - w / 2} A${w / 2 - 2} ${w / 2 - 2} 0 0 0 ${X + w / 2 - 2} ${bot - w / 2} V${liq} Z"/></clipPath>
      <rect x="${X - w}" y="${liq}" width="${2 * w}" height="${bot - liq + 4}" fill="${s.sol || "var(--c-soft)"}" opacity="${s.sol ? .55 : .45}" clip-path="url(#k9pclip)"/>`;
    if (amt > 0) {
      // cloudy suspension that settles into a layer
      const settled = Math.min(1, fall), layer = 28 * amt;
      g += `<rect x="${X - w}" y="${liq}" width="${2 * w}" height="${bot - liq}" fill="${s.ppt}" opacity="${0.55 * amt * (1 - settled)}" clip-path="url(#k9pclip)"/>
        <rect x="${X - w}" y="${bot - layer * settled - 2}" width="${2 * w}" height="${layer * settled + 6}" fill="${s.ppt}" opacity=".95" clip-path="url(#k9pclip)"/>`;
      for (let i = 0; i < 26 * amt; i++) { const px = X - w / 2 + 6 + ((i * 37) % 97) / 97 * (w - 12), py = liq + 8 + (((i * 53) % 89) / 89) * (bot - liq - 20) * (1 - settled) + settled * (bot - 12 - liq - 8); g += `<circle cx="${px}" cy="${py}" r="2" fill="${s.ppt}" stroke="var(--ink)" stroke-width=".4"/>`; }
    }
    g += `<path d="M${X - w / 2} ${top} V${bot - w / 2} A${w / 2} ${w / 2} 0 0 0 ${X + w / 2} ${bot - w / 2} V${top}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <text x="${X}" y="${bot + 20}" font-size="14" text-anchor="middle" fill="var(--ink)">${us9(s.f)} (aq)</text>`;
    // dropper
    if (!(s.nh4 && warm)) g += `<path d="M${X - 8} 2 h16 v16 l-5 12 h-6 l-5 -12 z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="1.5"/><text x="${X - 14}" y="16" font-size="13" text-anchor="end" fill="var(--c)">NaOH</text>`;
    if (s.nh4 && warm && drops > 0) {
      for (let i = 0; i < 3; i++) g += `<path d="M${X - 14 + i * 14} ${top - 2} q-8 -12 0 -22 q8 -10 0 -20" fill="none" stroke="var(--muted)" stroke-width="2" opacity=".7"/>`;
      g += `<rect x="${X + 36}" y="${top - 30}" width="60" height="12" rx="2" fill="#3566cc" stroke="var(--ink)" stroke-width=".8"/><text x="${X + 104}" y="${top - 20}" font-size="12" fill="var(--ink)">${L2("moist litmus: blue", "ভেজা লিটমাস: নীল")}</text>`;
      g += `<text x="${X + 40}" y="${top + 20}" font-size="14" font-weight="700" fill="var(--c)">NH₃↑</text>`;
    } else if (s.nh4) {
      g += `<rect x="${X + 36}" y="${top - 30}" width="60" height="12" rx="2" fill="#d23b45" stroke="var(--ink)" stroke-width=".8"/><text x="${X + 104}" y="${top - 20}" font-size="12" fill="var(--ink)">${L2("moist red litmus", "ভেজা লাল লিটমাস")}</text>`;
    }
    // side panel: drop counter and colour key
    g += `<text x="250" y="${liq + 6}" font-size="13" fill="var(--muted)">${L2("drops added", "যোগ করা ফোঁটা")}</text><text x="250" y="${liq + 30}" font-size="22" font-weight="700" fill="var(--ink)">${B9(drops)}</text>`;
    if (s.ppt) g += `<rect x="250" y="${liq + 48}" width="22" height="22" rx="4" fill="${s.ppt}" stroke="var(--ink)" stroke-width=".8"/><text x="278" y="${liq + 64}" font-size="13" fill="var(--ink)">${us9(s.pf)}</text>`;
    g += `</svg>`;
    $("#k9psv", el).innerHTML = g;
    $("#k9pw", el).style.display = s.nh4 ? "" : "none";
    let o;
    if (s.nh4) o = drops === 0 ? L2("Add some NaOH, then warm the tube.", "কিছু NaOH দাও, তারপর টিউবটি গরম করো।") : !warm ? L2("No precipitate: ammonium hydroxide is soluble. Now warm it gently.", "কোনো অধঃক্ষেপ নেই: অ্যামোনিয়াম হাইড্রোক্সাইড দ্রবণীয়। এবার হালকা গরম করো।")
      : L2(`Ammonia gas comes off: sharp smell, turns moist red litmus <b>blue</b>. This is the test for an ammonium salt.<br>${fx9(s.eq)}`, `অ্যামোনিয়া গ্যাস বের হয়: ঝাঁঝালো গন্ধ, ভেজা লাল লিটমাসকে <b>নীল</b> করে। এটাই অ্যামোনিয়াম লবণের পরীক্ষা।<br>${fx9(s.eq)}`);
    else if (drops === 0) o = L2("Add dilute NaOH drop by drop and watch.", "ফোঁটায় ফোঁটায় লঘু NaOH দাও আর লক্ষ করো।");
    else {
      o = L2(`A <b>${s.c()}</b> precipitate of ${fx9(s.pf)} forms; NaNO₃ stays dissolved (colourless).<br>${fx9(s.eq)}`, `${fx9(s.pf)}-এর <b>${s.c()}</b> অধঃক্ষেপ পড়ে; NaNO₃ দ্রবীভূত (বর্ণহীন) থাকে।<br>${fx9(s.eq)}`);
      if (drops < s.k) o += `<div class="hint">${L2(`The equation needs ${s.k} NaOH per formula unit: keep adding.`, `সমীকরণ অনুযায়ী প্রতি সংকেত-এককে ${B9(s.k)}টি NaOH লাগে: আরও দাও।`)}</div>`;
      if (excess > 0) o += `<div class="hint">${L2("With a large excess of NaOH this white hydroxide dissolves again (it is amphoteric). Fe and Cu hydroxides do not.", "অনেক বেশি NaOH দিলে এই সাদা হাইড্রোক্সাইড আবার দ্রবীভূত হয় (এটি উভধর্মী)। Fe ও Cu-এর হাইড্রোক্সাইড হয় না।")}</div>`;
    }
    $("#k9po", el).innerHTML = o;
  };
  const reset = () => { drops = 0; warm = false; fall = 0; draw(); };
  $("#k9pd", el).addEventListener("click", () => { if (drops < 9) drops++; fall = REDUCED ? 1 : 0; draw(); });
  $("#k9pw", el).addEventListener("click", () => { warm = true; draw(); });
  $("#k9pr", el).addEventListener("click", reset);
  chips9(el, ".k9pc", b => { si = +b.dataset.i; reset(); });
  draw();
  if (!REDUCED) animate(el, dt => { if (fall < 1 && drops > 0) { fall = Math.min(1, fall + dt * 0.35); draw(); } });
};

/* ================= 9.3 strong vs weak: particles and a bulb ================= */
W.k9ionise = (el) => {
  const S = [
    { f: "HCl", a: "H^+", b: "Cl^−", fr: 1, t: () => L2("strong acid", "তীব্র এসিড") },
    { f: "CH3COOH", a: "H^+", b: "CH3COO^−", fr: 0.12, t: () => L2("weak acid", "মৃদু এসিড") },
    { f: "NaOH", a: "Na^+", b: "OH^−", fr: 1, t: () => L2("strong alkali", "তীব্র ক্ষার") },
    { f: "NH4OH", a: "NH4^+", b: "OH^−", fr: 0.12, t: () => L2("weak alkali", "মৃদু ক্ষার") },
    { f: "H2O", fr: 0, t: () => L2("pure water", "বিশুদ্ধ পানি") },
    { f: "C12H22O11", fr: 0, t: () => L2("sugar solution", "চিনির দ্রবণ") }];
  let si = 0, T = 0;
  const N = 16;
  el.innerHTML = `<div class="chipset k9ic" role="group">${S.map((s, i) => `<button data-i="${i}" aria-pressed="${i === si}">${fx9(s.f)}</button>`).join("")}</div>
  <div class="svgwrap fit" id="k9isv"></div><div class="w-out" id="k9io"></div>`;
  // fixed pseudo-random home positions
  const home = Array.from({ length: N }, (_, i) => [((i * 61) % 97) / 97, ((i * 37 + 11) % 89) / 89, i * 1.7]);
  const draw = () => {
    const s = S[si], nIon = Math.round(N * s.fr), bx = 40, by = 90, bw = 170, bh = 130;
    const glow = s.fr === 1 ? 1 : s.fr > 0 ? 0.28 : 0.02;
    let g = `<svg viewBox="0 -10 360 270" role="img" aria-label="${L2("conductivity test", "পরিবাহিতা পরীক্ষা")}">
      <path d="M${bx} ${by - 20} V${by + bh} q0 8 8 8 h${bw - 16} q8 0 8 -8 V${by - 20}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="${bx + 2}" y="${by}" width="${bw - 4}" height="${bh + 6}" fill="var(--c-soft)" opacity=".5"/>
      <rect x="${bx + 30}" y="${by - 50}" width="10" height="${bh + 20}" fill="var(--muted)"/><rect x="${bx + bw - 40}" y="${by - 50}" width="10" height="${bh + 20}" fill="var(--muted)"/>
      <path d="M${bx + 35} ${by - 50} V26 H150 M${bx + bw - 35} ${by - 50} V26 H240 M300 26 H340 V120 H320" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
      <rect x="296" y="112" width="24" height="40" rx="3" fill="none" stroke="var(--ink)" stroke-width="1.8"/><line x1="304" y1="108" x2="312" y2="108" stroke="var(--ink)" stroke-width="3"/>
      <text x="308" y="170" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("battery", "ব্যাটারি")}</text>
      <path d="M296 132 H${bx + bw + 10} " fill="none" stroke="var(--ink)" stroke-width="0"/>
      <circle cx="195" cy="26" r="${14 + 22 * glow}" fill="#ffd54a" opacity="${0.12 + 0.55 * glow}"/>
      <circle cx="195" cy="26" r="13" fill="${glow > .5 ? "#ffe27a" : glow > .1 ? "#e9d38a" : "var(--sheet)"}" stroke="var(--ink)" stroke-width="1.8"/>
      <path d="M189 26 q3 -7 6 0 q3 7 6 0" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
      <line x1="150" y1="26" x2="182" y2="26" stroke="var(--ink)" stroke-width="1.8"/><line x1="208" y1="26" x2="240" y2="26" stroke="var(--ink)" stroke-width="1.8"/>
      <path d="M240 26 H300" stroke="var(--ink)" stroke-width="1.8"/>`;
    const px = (u) => bx + 22 + u * (bw - 44), py = (v) => by + 12 + v * (bh - 20);
    const wob = (k, i) => REDUCED ? 0 : Math.sin(T * 1.7 + i * 2.1 + k) * 5;
    for (let i = 0; i < N; i++) {
      const [u, v] = home[i];
      if (s.fr === 0) {
        if (i < 10) g += `<circle cx="${px(u) + wob(0, i)}" cy="${py(v) + wob(1, i)}" r="5" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.5"/>`;
      } else if (i < nIon) {
        const x1 = px(u) + wob(0, i) - 9, y1 = py(v) + wob(1, i), x2 = px(u) - wob(2, i) + 9, y2 = py(v) - wob(3, i) + 3;
        g += `<circle cx="${x1}" cy="${y1}" r="6.5" fill="var(--bad)" opacity=".85"/><text x="${x1}" y="${y1 + 4.5}" font-size="12" text-anchor="middle" fill="var(--sheet)" font-weight="700">+</text>
          <circle cx="${x2}" cy="${y2}" r="7.5" fill="var(--c)" opacity=".85"/><text x="${x2}" y="${y2 + 4.5}" font-size="13" text-anchor="middle" fill="var(--sheet)" font-weight="700">−</text>`;
      } else {
        const x = px(u) + wob(0, i) * .5, y = py(v) + wob(1, i) * .5;
        g += `<circle cx="${x - 5}" cy="${y}" r="6" fill="var(--bad)" opacity=".35" stroke="var(--ink)" stroke-width="1"/><circle cx="${x + 5}" cy="${y}" r="7" fill="var(--c)" opacity=".35" stroke="var(--ink)" stroke-width="1"/>`;
      }
    }
    g += `<text x="${bx + bw / 2}" y="${by + bh + 28}" font-size="13" text-anchor="middle" fill="var(--ink)">${us9(s.f)}: ${s.t()}</text>`;
    // legend
    if (s.fr > 0) g += `<circle cx="262" cy="200" r="6" fill="var(--bad)"/><text x="272" y="204" font-size="12" fill="var(--ink)">${us9(s.a.replace("^", ""))}</text><circle cx="262" cy="222" r="6" fill="var(--c)"/><text x="272" y="226" font-size="12" fill="var(--ink)">${us9(s.b.replace("^", ""))}</text>`;
    g += `</svg>`;
    $("#k9isv", el).innerHTML = g;
  };
  const out = () => {
    const s = S[si];
    let o;
    if (s.fr === 1) o = L2(`${fx9(s.f)} → ${fx9(s.a)} + ${fx9(s.b)} <b>completely</b>. Every unit gives ions, so the bulb glows <b>brightly</b>.`, `${fx9(s.f)} → ${fx9(s.a)} + ${fx9(s.b)} <b>সম্পূর্ণ</b>। প্রতিটি একক আয়ন দেয়, তাই বাল্ব <b>উজ্জ্বল</b> জ্বলে।`);
    else if (s.fr > 0) o = L2(`${fx9(s.f)} ⇌ ${fx9(s.a)} + ${fx9(s.b)} only <b>partly</b>. Most units stay whole (faded pairs), so the bulb is <b>dim</b>. (Drawn exaggerated: really only about 1 in 100 ionise at 0.1 M.)`, `${fx9(s.f)} ⇌ ${fx9(s.a)} + ${fx9(s.b)} শুধু <b>আংশিক</b>। বেশির ভাগ একক অবিয়োজিত থাকে (ফিকে জোড়া), তাই বাল্ব <b>মিটমিটে</b>। (বাড়িয়ে আঁকা: ০.১ M-এ আসলে প্রায় ১০০টিতে ১টি আয়নিত হয়।)`);
    else o = L2("Almost no ions, so almost no current: the bulb stays dark. Sugar dissolves as whole molecules.", "আয়ন প্রায় নেই, তাই বিদ্যুৎও প্রায় নেই: বাল্ব জ্বলে না। চিনি পুরো অণু হিসেবেই দ্রবীভূত হয়।");
    $("#k9io", el).innerHTML = o + `<div class="hint">${L2("Use only dilute solutions for this test, and switch off before touching the rods.", "এই পরীক্ষায় শুধু লঘু দ্রবণ ব্যবহার করো, আর দণ্ড ছোঁয়ার আগে সংযোগ বিচ্ছিন্ন করো।")}</div>`;
  };
  chips9(el, ".k9ic", b => { si = +b.dataset.i; draw(); out(); });
  draw(); out();
  if (!REDUCED) animate(el, dt => { T += dt; draw(); });
};

/* ================= 9.4 pH scale with substances and indicators ================= */
W.k9ph = (el) => {
  const SUB = [
    [L2("Battery acid", "ব্যাটারির এসিড"), 0.5], [L2("Stomach juice", "পাকস্থলীর রস"), 1.5], [L2("Lemon juice", "লেবুর রস"), 2.2], [L2("Vinegar", "ভিনেগার"), 2.9],
    [L2("Tomato", "টমেটো"), 4.4], [L2("Clean rain", "পরিষ্কার বৃষ্টি"), 5.6], [L2("Milk", "দুধ"), 6.6], [L2("Pure water", "বিশুদ্ধ পানি"), 7], [L2("Blood", "রক্ত"), 7.4],
    [L2("Baking soda", "বেকিং সোডা"), 8.4], [L2("Toothpaste", "টুথপেস্ট"), 9], [L2("Soap", "সাবান"), 10], [L2("Ammonia cleaner", "অ্যামোনিয়া ক্লিনার"), 11.5], [L2("Bleach", "ব্লিচ"), 12.5], [L2("Drain cleaner (NaOH)", "ড্রেন ক্লিনার (NaOH)"), 13.8]];
  let pick = 2;
  el.innerHTML = `<div class="chipset k9hc" role="group">${SUB.map((s, i) => `<button data-i="${i}" aria-pressed="${i === pick}">${s[0]}</button>`).join("")}</div>
  ${slider("k9hp", "pH", 0, 14, 0.1, SUB[pick][1], "")}
  <div class="svgwrap fit" id="k9hsv"></div><div id="k9hind" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px;margin:6px 0"></div><div class="w-out" id="k9ho"></div>`;
  const sl = $("#k9hp", el);
  const draw = () => {
    const pH = +sl.value; $("#k9hp-v", el).textContent = n9(pH, 1);
    const X0 = 14, W0 = 332, x = X0 + pH / 14 * W0;
    let g = `<svg viewBox="0 0 360 118" role="img" aria-label="${L2("pH scale", "pH স্কেল")}"><defs><linearGradient id="k9hg" x1="0" x2="1">${UNI9.map((c, i) => `<stop offset="${i / 14}" stop-color="${c}"/>`).join("")}</linearGradient></defs>
      <rect x="${X0}" y="40" width="${W0}" height="26" rx="6" fill="url(#k9hg)"/>`;
    for (let i = 0; i <= 14; i++) { const xi = X0 + i / 14 * W0; g += `<line x1="${xi}" y1="66" x2="${xi}" y2="72" stroke="var(--muted)"/>${i % 2 === 0 ? `<text x="${xi}" y="86" font-size="12" text-anchor="middle" fill="var(--muted)">${B9(i)}</text>` : ""}`; }
    SUB.forEach(s => { const xs = X0 + s[1] / 14 * W0; g += `<circle cx="${xs}" cy="53" r="2.5" fill="var(--sheet)" opacity=".85"/>`; });
    g += `<path d="M${x} 38 l-7 -12 h14 z" fill="var(--ink)"/><line x1="${x}" y1="38" x2="${x}" y2="68" stroke="var(--ink)" stroke-width="2"/>
      <text x="${Math.max(40, Math.min(320, x))}" y="18" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">pH ${n9(pH, 1)}</text>
      <text x="${X0}" y="106" font-size="13" fill="var(--bad)">← ${L2("acidic", "এসিডীয়")}</text><text x="${X0 + W0 / 2}" y="106" font-size="13" text-anchor="middle" fill="var(--good)">${L2("neutral", "নিরপেক্ষ")}</text><text x="${X0 + W0}" y="106" font-size="13" text-anchor="end" fill="var(--c)">${L2("alkaline", "ক্ষারীয়")} →</text></svg>`;
    $("#k9hsv", el).innerHTML = g;
    $("#k9hind", el).innerHTML = ["lit", "php", "mo", "uni"].map(k => { const I = IND9[k], [c, op] = I.c(pH); return `<div style="display:flex;gap:8px;align-items:center;border:1px solid var(--rule);border-radius:8px;padding:6px 8px">${sw9(c, op, true)}<div><div style="font-size:13px;color:var(--muted)">${I.n()}</div><div style="font-weight:600">${I.w(pH)}</div></div></div>`; }).join("");
    const H = Math.pow(10, -pH), f = Math.pow(10, 7 - pH);
    const near = SUB.filter(s => Math.abs(s[1] - pH) < 0.35).map(s => s[0]).join(", ");
    const nature = pH < 6.95 ? L2("acidic", "এসিডীয়") : pH > 7.05 ? L2("alkaline", "ক্ষারীয়") : L2("neutral", "নিরপেক্ষ");
    const cmp = pH < 6.95 ? L2(`<b>${sci9(f)}</b> times more H⁺ than pure water`, `বিশুদ্ধ পানির চেয়ে <b>${sci9(f)}</b> গুণ বেশি H⁺`) : pH > 7.05 ? L2(`<b>${sci9(1 / f)}</b> times fewer H⁺ than pure water`, `বিশুদ্ধ পানির চেয়ে <b>${sci9(1 / f)}</b> গুণ কম H⁺`) : L2("same H⁺ as pure water", "বিশুদ্ধ পানির সমান H⁺");
    $("#k9ho", el).innerHTML = L2(`[H⁺] = ${pow9(-pH)} = ${sci9(H)} mol/L → <b>${nature}</b>; ${cmp}. [OH⁻] = ${sci9(Math.pow(10, pH - 14))} mol/L.${near ? ` <span class="muted">(${near})</span>` : ""}`,
      `[H⁺] = ${pow9(-pH)} = ${sci9(H)} mol/L → <b>${nature}</b>; ${cmp}। [OH⁻] = ${sci9(Math.pow(10, pH - 14))} mol/L।${near ? ` <span class="muted">(${near})</span>` : ""}`);
  };
  sl.addEventListener("input", () => { el.querySelectorAll(".k9hc button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); });
  chips9(el, ".k9hc", b => { pick = +b.dataset.i; sl.value = SUB[pick][1]; draw(); });
  draw();
};

/* ================= 9.5 titration with pH curve ================= */
W.k9titr = (el) => {
  const Va = 25, Ca = 0.1, Cb = 0.1, Kw = 1e-14;
  const A = [
    { f: "HCl", n: 1, Ka: 0, salt: "NaCl", eq: "HCl(aq) + NaOH(aq) → NaCl(aq) + H2O(l)", nat: () => L2("neutral (strong acid + strong base)", "নিরপেক্ষ (তীব্র এসিড + তীব্র ক্ষার)") },
    { f: "H2SO4", n: 2, Ka: 0, salt: "Na2SO4", eq: "H2SO4(aq) + 2NaOH(aq) → Na2SO4(aq) + 2H2O(l)", nat: () => L2("neutral (strong acid + strong base)", "নিরপেক্ষ (তীব্র এসিড + তীব্র ক্ষার)") },
    { f: "CH3COOH", n: 1, Ka: 1.8e-5, salt: "CH3COONa", eq: "CH3COOH(aq) + NaOH(aq) → CH3COONa(aq) + H2O(l)", nat: () => L2("basic (weak acid + strong base), pH ≈ 8.7", "ক্ষারীয় (মৃদু এসিড + তীব্র ক্ষার), pH ≈ ৮.৭") }];
  let ai = 0, ind = "php", V = 0;
  const pHof = (a, Vb) => {
    const Vt = (Va + Vb) / 1000, Ctot = Ca * Va / 1000 / Vt, Na = Cb * Vb / 1000 / Vt;
    const F = (H) => H + Na - Kw / H - (a.Ka ? Ctot * a.Ka / (a.Ka + H) : a.n * Ctot);
    let lo = -15, hi = 1;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (F(Math.pow(10, m)) > 0) hi = m; else lo = m; }
    return -(lo + hi) / 2;
  };
  el.innerHTML = `<div class="chipset k9ta" role="group">${A.map((a, i) => `<button data-i="${i}" aria-pressed="${i === ai}">${B9("25")} mL ${B9("0.1")} M ${fx9(a.f)}</button>`).join("")}</div>
  <div class="chipset k9ti" role="group" style="margin-top:6px">${["php", "mo", "uni"].map(k => `<button data-k="${k}" aria-pressed="${k === ind}">${IND9[k].n()}</button>`).join("")}</div>
  ${slider("k9tv", L2("NaOH added (0.1 M)", "যোগ করা NaOH (০.১ M)"), 0, 60, 0.05, 0, "mL")}
  <div class="w-row"><button class="btn" id="k9t1">+${B9("1")} mL</button><button class="btn" id="k9td">+${L2("1 drop", "১ ফোঁটা")}</button><button class="btn" id="k9t0">${L2("Empty flask", "ফ্লাস্ক খালি করো")}</button></div>
  <div class="svgwrap fit" id="k9tsv"></div><div class="w-out" id="k9to"></div>`;
  const sl = $("#k9tv", el);
  const draw = () => {
    V = +sl.value; $("#k9tv-v", el).textContent = n9(V, 2) + " mL";
    const a = A[ai], pH = pHof(a, V), Veq = a.n * Ca * Va / Cb, [col, op] = IND9[ind].c(pH);
    // apparatus
    const fx = 62;
    const lvl = 30 + (V / 60) * 90;
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("titration", "টাইট্রেশন")}">
      <rect x="${fx - 6}" y="10" width="12" height="120" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
      <rect x="${fx - 5}" y="${lvl}" width="10" height="${130 - lvl}" fill="var(--c-soft)"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="${fx + 6}" y1="${30 + i * 15}" x2="${fx + 10}" y2="${30 + i * 15}" stroke="var(--muted)"/>`).join("")}
      <path d="M${fx - 6} 130 L${fx - 2} 142 V150 M${fx + 6} 130 L${fx + 2} 142 V150" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
      <rect x="${fx - 10}" y="136" width="20" height="5" fill="var(--muted)"/>
      <text x="${fx + 14}" y="24" font-size="12" fill="var(--muted)">NaOH</text>
      <path d="M${fx - 9} 160 V176 L${fx - 38} 228 q-3 8 6 8 h66 q9 0 6 -8 L${fx + 9} 176 V160" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <path d="M${fx - 30} 214 L${fx - 38} 228 q-3 8 6 8 h66 q9 0 6 -8 L${fx + 30} 214 Z" fill="${op ? col : "var(--c-soft)"}" opacity="${op ? Math.max(.4, op) : .5}"/>
      <text x="${fx}" y="206" font-size="12" text-anchor="middle" fill="var(--ink)">${us9(a.f)}</text>`;
    // graph
    const gx = 150, gy = 20, gw = 196, gh = 190, X = v => gx + v / 60 * gw, Y = p => gy + gh - p / 14 * gh;
    g += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="none" stroke="var(--rule)"/>`;
    // indicator range band
    const band = ind === "php" ? [8.2, 10] : ind === "mo" ? [3.1, 4.4] : null;
    if (band) g += `<rect x="${gx}" y="${Y(band[1])}" width="${gw}" height="${Y(band[0]) - Y(band[1])}" fill="var(--note)" opacity=".18"/>`;
    for (let p = 0; p <= 14; p += 7) g += `<line x1="${gx}" y1="${Y(p)}" x2="${gx + gw}" y2="${Y(p)}" stroke="var(--rule)" stroke-dasharray="3 3"/><text x="${gx - 4}" y="${Y(p) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B9(p)}</text>`;
    for (let v = 0; v <= 60; v += 20) g += `<text x="${X(v)}" y="${gy + gh + 15}" font-size="12" text-anchor="middle" fill="var(--muted)">${B9(v)}</text>`;
    g += `<text x="${gx + gw}" y="${gy + gh + 30}" font-size="12" text-anchor="end" fill="var(--muted)">V(NaOH) mL</text><text x="${gx + 4}" y="${gy + 13}" font-size="12" fill="var(--muted)">pH</text>`;
    let d = "", dd = "";
    for (let v = 0; v <= 60.001; v += 0.25) { const pt = `${X(v).toFixed(1)} ${Y(pHof(a, v)).toFixed(1)}`; (v <= V ? (d += (d ? " L" : "M") + pt) : (dd += (dd ? " L" : "M") + pt)); }
    if (dd && d) dd = "M" + `${X(V).toFixed(1)} ${Y(pH).toFixed(1)} L` + dd.slice(1);
    g += `<path d="${dd}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="3 4" opacity=".6"/><path d="${d}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
    g += `<line x1="${X(Veq)}" y1="${gy}" x2="${X(Veq)}" y2="${gy + gh}" stroke="var(--good)" stroke-dasharray="4 3"/><text x="${X(Veq) + 3}" y="${gy + gh - 6}" font-size="12" fill="var(--good)">${B9(Veq)} mL</text>`;
    g += `<circle cx="${X(V)}" cy="${Y(pH)}" r="5" fill="${op ? col : "var(--sheet)"}" stroke="var(--ink)" stroke-width="1.5"/></svg>`;
    $("#k9tsv", el).innerHTML = g;
    const nA = Ca * Va / 1000, nB = Cb * V / 1000;
    const state = Math.abs(V - Veq) < 0.06 ? L2("<b>End point!</b> Acid and base exactly balanced.", "<b>প্রশমন বিন্দু!</b> এসিড ও ক্ষারক ঠিক সমান।") : V < Veq ? L2(`Acid still in excess: ${n9(Veq - V, 2)} mL more NaOH needed.`, `এসিড এখনো বেশি: আরও ${n9(Veq - V, 2)} mL NaOH লাগবে।`) : L2(`NaOH in excess by ${n9(V - Veq, 2)} mL.`, `NaOH ${n9(V - Veq, 2)} mL বেশি হয়ে গেছে।`);
    const indNote = ai === 2 && ind === "mo" ? L2(" Methyl orange changes too early for a weak acid; phenolphthalein is the right choice here.", " মৃদু এসিডে মিথাইল অরেঞ্জ অনেক আগেই রং বদলায়; এখানে ফেনলফথ্যালিনই সঠিক।") : "";
    $("#k9to", el).innerHTML = L2(`pH = <b>${n9(pH, 2)}</b>; ${IND9[ind].n()}: <b>${IND9[ind].w(pH)}</b>. ${state}<br>${fx9(a.eq)}<br>Acid: ${n9(nA * 1000, 2)} mmol ${fx9(a.f)} gives ${n9(a.n * nA * 1000, 2)} mmol H⁺; NaOH added: ${n9(nB * 1000, 2)} mmol OH⁻. Salt formed: ${fx9(a.salt)}, whose solution is ${a.nat()}.${indNote}`,
      `pH = <b>${n9(pH, 2)}</b>; ${IND9[ind].n()}: <b>${IND9[ind].w(pH)}</b>। ${state}<br>${fx9(a.eq)}<br>এসিড: ${n9(nA * 1000, 2)} mmol ${fx9(a.f)} দেয় ${n9(a.n * nA * 1000, 2)} mmol H⁺; যোগ করা NaOH: ${n9(nB * 1000, 2)} mmol OH⁻। উৎপন্ন লবণ: ${fx9(a.salt)}, যার দ্রবণ ${a.nat()}।${indNote}`);
  };
  const add = (dv) => { sl.value = Math.min(60, Math.round((+sl.value + dv) * 100) / 100); draw(); };
  $("#k9t1", el).addEventListener("click", () => add(1));
  $("#k9td", el).addEventListener("click", () => add(0.05));
  $("#k9t0", el).addEventListener("click", () => { sl.value = 0; draw(); });
  sl.addEventListener("input", draw);
  chips9(el, ".k9ta", b => { ai = +b.dataset.i; sl.value = 0; draw(); });
  chips9(el, ".k9ti", b => { ind = b.dataset.k; draw(); });
  draw();
};

/* ================= 9.6 acid rain ================= */
W.k9rain = (el) => {
  el.innerHTML = `${slider("k9rs", L2("Sulfur-rich fuel burnt (coal, brick kilns)", "সালফারযুক্ত জ্বালানি পোড়ানো (কয়লা, ইটভাটা)"), 0, 10, 1, 3, "")}
  ${slider("k9rn", L2("Vehicle and factory exhaust (NOₓ)", "যানবাহন ও কারখানার ধোঁয়া (NOₓ)"), 0, 10, 1, 3, "")}
  <div class="svgwrap fit" id="k9rsv"></div><div class="w-out" id="k9ro"></div>`;
  let T = 0, drops = Array.from({ length: 22 }, (_, i) => [30 + (i * 53) % 300, (i * 37) % 120]);
  const calc = () => { const s = +$("#k9rs", el).value, n = +$("#k9rn", el).value; const H = 2.5e-6 + s * 1.2e-5 + n * 6e-6; return { s, n, H, pH: -Math.log10(H) }; };
  const draw = () => {
    const { s, n, H, pH } = calc();
    $("#k9rs-v", el).textContent = B9(s); $("#k9rn-v", el).textContent = B9(n);
    const dc = uni9(pH), bad = Math.max(0, Math.min(1, (5.6 - pH) / 1.8));
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("acid rain scene", "এসিড বৃষ্টির দৃশ্য")}">
      <rect x="0" y="0" width="360" height="250" fill="var(--c-soft)" opacity=".25"/>`;
    // cloud
    g += `<g opacity=".9"><ellipse cx="150" cy="34" rx="70" ry="20" fill="var(--muted)" opacity="${0.35 + bad * 0.45}"/><ellipse cx="200" cy="28" rx="50" ry="18" fill="var(--muted)" opacity="${0.35 + bad * 0.45}"/><ellipse cx="110" cy="40" rx="40" ry="14" fill="var(--muted)" opacity="${0.35 + bad * 0.45}"/></g>`;
    // rain
    drops.forEach(([x, y]) => { const yy = 55 + ((y + T * 90) % 110); if (x > 40 && x < 330) g += `<line x1="${x}" y1="${yy}" x2="${x - 2}" y2="${yy + 9}" stroke="${dc}" stroke-width="2.4" stroke-linecap="round"/>`; });
    // ground
    g += `<rect x="0" y="176" width="360" height="74" fill="#7a5c3a" opacity=".35"/>`;
    // brick kiln chimney with smoke
    g += `<rect x="16" y="104" width="18" height="72" fill="#9c4a1a" opacity=".85"/>`;
    for (let i = 0; i < s; i++) g += `<circle cx="${30 + i * 7 + Math.sin(T + i) * 3}" cy="${96 - i * 6}" r="${5 + i * 1.2}" fill="var(--muted)" opacity="${0.5 - i * 0.03}"/>`;
    // car with exhaust
    g += `<rect x="250" y="160" width="46" height="14" rx="4" fill="var(--c)"/><rect x="258" y="150" width="26" height="12" rx="3" fill="var(--c)" opacity=".8"/><circle cx="260" cy="176" r="5" fill="var(--ink)"/><circle cx="288" cy="176" r="5" fill="var(--ink)"/>`;
    for (let i = 0; i < n; i++) g += `<circle cx="${300 + i * 5}" cy="${168 - i * 3 + Math.sin(T * 1.3 + i) * 2}" r="${3 + i * 0.8}" fill="var(--muted)" opacity="${0.45 - i * 0.03}"/>`;
    // pond with fish
    g += `<ellipse cx="120" cy="212" rx="70" ry="22" fill="${mix9("#4f9be8", "#9aa35a", bad)}" opacity=".7"/>`;
    const fish = pH >= 5.5 ? 3 : pH >= 5 ? 2 : pH >= 4.5 ? 1 : 0;
    for (let i = 0; i < 3; i++) { const fx = 88 + i * 26 + (REDUCED ? 0 : Math.sin(T * 1.5 + i * 2) * 5), fy = 212 + (i % 2) * 6; if (i < fish) g += `<path d="M${fx - 8} ${fy} q8 -7 16 0 q-8 7 -16 0 z M${fx + 8} ${fy} l6 -5 v10 z" fill="var(--note)"/>`; else g += `<path d="M${fx - 8} ${fy - 8} q8 7 16 0 q-8 -7 -16 0 z" fill="var(--muted)" opacity=".7"/><text x="${fx}" y="${fy - 12}" font-size="12" text-anchor="middle" fill="var(--bad)">×</text>`; }
    // marble statue eroding
    const er = bad * 10;
    g += `<rect x="208" y="150" width="26" height="26" fill="var(--sheet)" stroke="var(--muted)"/><path d="M212 150 V${104 + er} q9 -${12 - er * 0.8} 18 0 V150 Z" fill="var(--sheet)" stroke="var(--muted)"/><circle cx="221" cy="${98 + er}" r="${9 - er * 0.4}" fill="var(--sheet)" stroke="var(--muted)"/>`;
    // crop
    const leaf = mix9("#3f9b43", "#b08b2f", bad);
    for (let i = 0; i < 4; i++) { const cx = 320 + (i % 2) * 14 - 8, cy = 200 + Math.floor(i / 2) * 18; g += `<path d="M${cx} ${cy + 14} V${cy} M${cx} ${cy + 6} q-8 -4 -10 -10 M${cx} ${cy + 4} q8 -4 10 -10" stroke="${leaf}" stroke-width="2.4" fill="none"/>`; }
    g += `<rect x="252" y="4" width="104" height="30" rx="8" fill="var(--sheet)" stroke="var(--rule)"/><text x="304" y="25" font-size="16" font-weight="700" text-anchor="middle" fill="var(--ink)">pH ${n9(pH, 1)}</text></svg>`;
    $("#k9rsv", el).innerHTML = g;
    const ratio = H / 2.5e-6;
    const eff = pH >= 5.5 ? L2("Normal, slightly acidic rain: CO₂ + H₂O ⇌ H₂CO₃. Fish, crops and marble are fine.", "স্বাভাবিক, সামান্য এসিডীয় বৃষ্টি: CO₂ + H₂O ⇌ H₂CO₃। মাছ, ফসল ও মার্বেল ঠিক আছে।")
      : pH >= 4.5 ? L2("Acid rain: fish eggs stop hatching, leaves are damaged, marble starts to dissolve (CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂).", "এসিড বৃষ্টি: মাছের ডিম ফোটে না, পাতা নষ্ট হয়, মার্বেল গলতে শুরু করে (CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂)।")
      : L2("Severe acid rain: most fish die, soil loses nutrients and crops wither, statues and iron structures corrode quickly.", "তীব্র এসিড বৃষ্টি: বেশির ভাগ মাছ মরে যায়, মাটি পুষ্টি হারায়, ফসল শুকিয়ে যায়, মূর্তি ও লোহার কাঠামো দ্রুত ক্ষয় হয়।");
    $("#k9ro", el).innerHTML = L2(`Rain pH ≈ <b>${n9(pH, 1)}</b>: about <b>${n9(ratio, ratio < 10 ? 1 : 0)}</b> times the H⁺ of clean rain. ${eff}<br><span class="muted">SO₂ + H₂O → H₂SO₃; 2SO₂ + O₂ → 2SO₃; SO₃ + H₂O → H₂SO₄; 4NO₂ + O₂ + 2H₂O → 4HNO₃. (A simple illustrative model.)</span>`,
      `বৃষ্টির pH ≈ <b>${n9(pH, 1)}</b>: পরিষ্কার বৃষ্টির প্রায় <b>${n9(ratio, ratio < 10 ? 1 : 0)}</b> গুণ H⁺। ${eff}<br><span class="muted">SO₂ + H₂O → H₂SO₃; 2SO₂ + O₂ → 2SO₃; SO₃ + H₂O → H₂SO₄; 4NO₂ + O₂ + 2H₂O → 4HNO₃। (একটি সরল উদাহরণমূলক মডেল।)</span>`);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", draw));
  draw();
  if (!REDUCED) animate(el, dt => { T += dt; draw(); });
};

/* ================= 9.7 hard water and soap ================= */
W.k9hard = (el) => {
  const WS = [
    { t: 0, p: 0, n: () => L2("Rain water", "বৃষ্টির পানি") },
    { t: 1, p: 0, n: () => L2("Temporary hard", "অস্থায়ী খর"), s: "Ca(HCO3)2" },
    { t: 0, p: 1, n: () => L2("Permanent hard", "স্থায়ী খর"), s: "CaCl2, MgSO4" },
    { t: 1, p: 1, n: () => L2("Tube-well (both)", "নলকূপ (দুটোই)"), s: "Ca(HCO3)2, CaCl2" }];
  const TR = [() => L2("No treatment", "শোধন নেই"), () => L2("Boil and filter", "ফুটিয়ে ছাঁকো"), () => L2("Add washing soda", "কাপড় কাচার সোডা দাও")];
  let wi = 3, ti = 0, shake = 0, go = false;
  el.innerHTML = `<div class="chipset k9hw" role="group">${WS.map((w, i) => `<button data-i="${i}" aria-pressed="${i === wi}">${w.n()}</button>`).join("")}</div>
  <div class="chipset k9ht" role="group" style="margin-top:6px">${TR.map((t, i) => `<button data-i="${i}" aria-pressed="${i === ti}">${t()}</button>`).join("")}</div>
  <div class="w-row" style="margin-top:8px"><button class="btn solid" id="k9hs">${L2("Shake with soap", "সাবান দিয়ে ঝাঁকাও")}</button></div>
  <div class="svgwrap fit" id="k9hsv2"></div><div class="w-out" id="k9ho2"></div>`;
  const state = () => { const w = WS[wi]; let t = w.t, p = w.p; if (ti === 1) t = 0; if (ti === 2) { t = 0; p = 0; } return { t, p, h: t + p }; };
  const draw = () => {
    const w = WS[wi], { t, p, h } = state(), X = 100, top = 40, bot = 220, bw = 110;
    const lather = shake * (h === 0 ? 1 : h === 1 ? 0.3 : 0.08), scum = shake * h / 2;
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("soap and hard water", "সাবান ও খর পানি")}">
      <rect x="${X - bw / 2 + 2}" y="120" width="${bw - 4}" height="${bot - 120}" fill="${(w.t || w.p) && ti === 0 ? "#cfd8c9" : "var(--c-soft)"}" opacity=".6"/>`;
    // precipitate from treatment
    const removed = (w.t || w.p) && ti > 0 ? (ti === 1 ? w.t : w.t + w.p) : 0;
    if (removed) g += `<rect x="${X - bw / 2 + 4}" y="${bot - 6 - removed * 6}" width="${bw - 8}" height="${6 + removed * 6}" fill="var(--sheet)" stroke="var(--muted)" stroke-width=".8"/><text x="${X + bw / 2 + 8}" y="${bot - 4}" font-size="12" fill="var(--muted)">${ti === 1 ? L2("scale (CaCO₃)", "স্কেল (CaCO₃)") : L2("CaCO₃/MgCO₃ ↓", "CaCO₃/MgCO₃ ↓")}</text>`;
    // lather bubbles
    for (let i = 0; i < Math.round(lather * 40); i++) { const bx = X - bw / 2 + 8 + ((i * 37) % 97) / 97 * (bw - 16), by = 118 - ((i * 53) % 89) / 89 * 60 * lather; g += `<circle cx="${bx}" cy="${by}" r="${4 + (i % 3) * 2}" fill="var(--sheet)" stroke="var(--c)" stroke-width="1"/>`; }
    // scum
    for (let i = 0; i < Math.round(scum * 30); i++) { const sx = X - bw / 2 + 8 + ((i * 41) % 83) / 83 * (bw - 16), sy = 124 + ((i * 29) % 71) / 71 * 60; g += `<rect x="${sx}" y="${sy}" width="6" height="3" rx="1" fill="#b8a98a" opacity=".9"/>`; }
    g += `<path d="M${X - bw / 2} ${top} V${bot} q0 8 8 8 h${bw - 16} q8 0 8 -8 V${top}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <line x1="${X - bw / 2}" y1="120" x2="${X + bw / 2}" y2="120" stroke="var(--c)" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    // hardness meter
    g += `<text x="220" y="60" font-size="13" fill="var(--muted)">${L2("Ca²⁺/Mg²⁺ left", "অবশিষ্ট Ca²⁺/Mg²⁺")}</text>`;
    for (let i = 0; i < 2; i++) g += `<rect x="${220 + i * 58}" y="70" width="52" height="18" rx="4" fill="${i < h ? "var(--bad)" : "var(--rule)"}" opacity="${i < h ? .8 : .6}"/>`;
    g += `<text x="220" y="112" font-size="13" fill="var(--muted)">${L2("lather", "ফেনা")}</text><rect x="220" y="120" width="110" height="14" rx="4" fill="var(--rule)"/><rect x="220" y="120" width="${110 * lather}" height="14" rx="4" fill="var(--good)"/>
      <text x="220" y="158" font-size="13" fill="var(--muted)">${L2("scum", "গাদ")}</text><rect x="220" y="166" width="110" height="14" rx="4" fill="var(--rule)"/><rect x="220" y="166" width="${110 * scum}" height="14" rx="4" fill="#b8a98a"/></svg>`;
    $("#k9hsv2", el).innerHTML = g;
    const eqs = [];
    if (ti === 1 && w.t) eqs.push("Ca(HCO3)2 → CaCO3↓ + CO2↑ + H2O " + L2("(heat)", "(তাপ)"));
    if (ti === 2 && w.t) eqs.push("Ca(HCO3)2 + Na2CO3 → CaCO3↓ + 2NaHCO3");
    if (ti === 2 && w.p) eqs.push("CaCl2 + Na2CO3 → CaCO3↓ + 2NaCl", "MgSO4 + Na2CO3 → MgCO3↓ + Na2SO4");
    if (shake > 0.5 && h > 0) eqs.push("2C17H35COONa + CaCl2 → (C17H35COO)2Ca↓ + 2NaCl");
    let msg;
    if (!w.t && !w.p) msg = L2("Rain water is soft: soap lathers at once.", "বৃষ্টির পানি মৃদু: সাবানে সাথে সাথে ফেনা হয়।");
    else if (h === 0) msg = L2("All the hardness has been removed: the water is now soft.", "সব খরতা দূর হয়েছে: পানি এখন মৃদু।");
    else if (ti === 1 && w.p) msg = L2("Boiling removed only the temporary (bicarbonate) hardness; chlorides and sulfates stay dissolved.", "ফোটানোয় শুধু অস্থায়ী (বাইকার্বনেট) খরতা দূর হয়েছে; ক্লোরাইড ও সালফেট দ্রবীভূতই থাকে।");
    else msg = L2(`This water is hard (${fx9(w.s)}): soap is used up forming scum before any lather appears.`, `এই পানি খর (${fx9(w.s)}): ফেনা হওয়ার আগেই সাবান গাদ তৈরিতে খরচ হয়ে যায়।`);
    $("#k9ho2", el).innerHTML = msg + (eqs.length ? "<br>" + eqs.map(fx9).join("<br>") : "") + (shake === 0 ? `<div class="hint">${L2("Press “Shake with soap” to test the lather.", "ফেনা পরীক্ষা করতে “সাবান দিয়ে ঝাঁকাও” চাপো।")}</div>` : "");
  };
  $("#k9hs", el).addEventListener("click", () => { if (REDUCED) { shake = 1; draw(); } else { shake = 0; go = true; } });
  chips9(el, ".k9hw", b => { wi = +b.dataset.i; shake = 0; go = false; draw(); });
  chips9(el, ".k9ht", b => { ti = +b.dataset.i; shake = 0; go = false; draw(); });
  draw();
  if (!REDUCED) animate(el, dt => { if (!go) return; shake = Math.min(1, shake + Math.min(dt, .05) * 0.8); if (shake >= 1) go = false; draw(); });
};
