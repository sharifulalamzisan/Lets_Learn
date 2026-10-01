/* ---- chemistry chapter 8 widgets: chemistry and energy, electrochemistry, nuclear ---- */
const B8 = x => bnNum(x, LANG);
/* number → string with proper minus sign and Bangla digits */
const f8 = (x, d = 0) => { if (!isFinite(x)) return "—"; let s = (+(+x).toFixed(d)).toString(); return B8(s).replace("-", "−"); };
const sg8 = (x, d = 0) => (x > 0 ? "+" : "") + f8(x, d);
const chips8 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
/* scientific notation for outputs (HTML) */
const sci8 = (x, d = 2) => { if (x === 0) return B8("0"); const e = Math.floor(Math.log10(Math.abs(x))); if (e >= -2 && e < 6) return f8(x, d); const m = +(x / Math.pow(10, e)).toFixed(d); return B8(m + " × 10<sup>" + e + "</sup>").replace(/-/g, "−"); };

/* ============ 8.1.2 energy profile: exothermic vs endothermic ============ */
W.k8profile = (el) => {
  const P = [
    ["b1", L2("Book: 50 → 20", "বই: ৫০ → ২০"), 50, 20, 40],
    ["b2", L2("Book: 70 → 80", "বই: ৭০ → ৮০"), 70, 80, 45],
    ["ch4", "CH₄ + 2O₂", 900, 10, 200],
    ["cao", "CaO + H₂O", 100, 36, 40],
    ["caco3", "CaCO₃ → CaO + CO₂", 50, 227, 240],
    ["nh4", L2("NH₄Cl dissolving", "NH₄Cl দ্রবীভবন"), 100, 115, 30]
  ];
  el.innerHTML = `<div class="chipset k8pc" role="group">${P.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${p[1]}</button>`).join("")}</div>
  ${slider("k8pr", L2("Energy of reactants H₁", "বিক্রিয়কের শক্তি H₁"), 0, 1000, 1, 50, "kJ/mol")}
  ${slider("k8pp", L2("Energy of products H₂", "উৎপাদের শক্তি H₂"), 0, 1000, 1, 20, "kJ/mol")}
  ${slider("k8pe", L2("Activation energy", "সক্রিয়ণ শক্তি"), 5, 400, 1, 40, "kJ/mol")}
  <div class="svgwrap fit" id="k8psv"></div><div class="w-out" id="k8po"></div>
  <p class="hint">${L2("Only the difference ΔH can be measured. For the real reactions the starting level is arbitrary and the hump height is only illustrative.", "শুধু পার্থক্য ΔH মাপা যায়। বাস্তব বিক্রিয়াগুলোর শুরুর স্তর ইচ্ছামতো ধরা, আর কুঁজের উচ্চতা শুধু বোঝানোর জন্য।")}</p>`;
  const draw = () => {
    const H1 = sv(el, "k8pr", "kJ/mol"), H2 = sv(el, "k8pp", "kJ/mol"), Ea = sv(el, "k8pe", "kJ/mol");
    const dH = H2 - H1, top = Math.max(H1 + Ea, H2 + 5) * 1.12 + 1;
    const y = v => 220 - v / top * 190;
    const yr = y(H1), yp = y(H2), yt = y(H1 + Ea), exo = dH < 0, col = exo ? "var(--bad)" : dH > 0 ? "var(--c)" : "var(--muted)";
    let s = `<svg viewBox="0 0 400 270" role="img" aria-label="${L2("energy profile diagram", "শক্তি চিত্র")}">${arrowDefs("k8pa", "var(--ink)")}${arrowDefs("k8pb", col)}
      <line x1="34" y1="228" x2="34" y2="16" stroke="var(--ink)" stroke-width="1.6" marker-end="url(#k8pa)"/>
      <line x1="34" y1="228" x2="330" y2="228" stroke="var(--ink)" stroke-width="1.6" marker-end="url(#k8pa)"/>
      <text x="20" y="130" font-size="13" fill="var(--muted)" transform="rotate(-90 20 130)" text-anchor="middle">${L2("energy", "শক্তি")}</text>
      <text x="182" y="248" font-size="13" fill="var(--muted)" text-anchor="middle">${L2("progress of reaction →", "বিক্রিয়ার অগ্রগতি →")}</text>
      <path d="M44 ${yr} H104 C150 ${yr} 150 ${yt} 178 ${yt} C206 ${yt} 206 ${yp} 252 ${yp} H312" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <text x="74" y="${yr - 7}" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("reactants", "বিক্রিয়ক")}</text>
      <text x="282" y="${yp - 7}" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("products", "উৎপাদ")}</text>
      <line x1="104" y1="${yt}" x2="178" y2="${yt}" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <line x1="120" y1="${yr}" x2="120" y2="${yt + 3}" stroke="var(--note)" stroke-width="2" marker-end="url(#k8pa)"/>
      <text x="114" y="${(yr + yt) / 2 + 4}" font-size="13" text-anchor="end" fill="var(--note)">Eₐ</text>
      <line x1="252" y1="${yr}" x2="330" y2="${yr}" stroke="var(--muted)" stroke-dasharray="4 4"/>`;
    if (Math.abs(yr - yp) > 6) s += `<line x1="322" y1="${yr}" x2="322" y2="${yp + (exo ? -3 : 3)}" stroke="${col}" stroke-width="2.5" marker-end="url(#k8pb)"/>`;
    s += `<text x="${exo ? 318 : 318}" y="${(yr + yp) / 2 + 4}" font-size="14" font-weight="700" text-anchor="end" fill="${col}">ΔH</text>`;
    /* thermometer: surroundings warm (exo) or cool (endo) */
    const lvl = Math.max(-1, Math.min(1, -dH / Math.max(40, Math.abs(dH))));
    const h = 50 + lvl * 34;
    s += `<rect x="360" y="40" width="14" height="150" rx="7" fill="var(--paper)" stroke="var(--ink)"/>
      <circle cx="367" cy="198" r="12" fill="${col}" stroke="var(--ink)"/>
      <rect x="363" y="${190 - h}" width="8" height="${h}" fill="${col}"/>
      <text x="396" y="30" font-size="12" text-anchor="end" fill="var(--muted)">${L2("surroundings", "চারপাশ")}</text>
      <text x="367" y="232" font-size="13" text-anchor="middle" fill="${col}" font-weight="700">${exo ? L2("warmer", "গরম") : dH > 0 ? L2("colder", "ঠান্ডা") : "—"}</text></svg>`;
    $("#k8psv", el).innerHTML = s;
    const kind = exo ? L2("<b>exothermic</b>: heat is given out, so ΔH is negative and the products sit lower", "<b>তাপোৎপাদী</b>: তাপ নির্গত হয়, তাই ΔH ঋণাত্মক আর উৎপাদ নিচে থাকে")
      : dH > 0 ? L2("<b>endothermic</b>: heat is absorbed, so ΔH is positive and the products sit higher", "<b>তাপহারী</b>: তাপ শোষিত হয়, তাই ΔH ধনাত্মক আর উৎপাদ ওপরে থাকে")
      : L2("no net heat change", "নিট তাপের পরিবর্তন নেই");
    $("#k8po", el).innerHTML = L2(`ΔH = H₂ − H₁ = ${f8(H2)} − ${f8(H1)} = <b>${sg8(dH)} kJ/mol</b>: ${kind}. Activation energy to climb the hump: ${f8(Ea)} kJ/mol.`,
      `ΔH = H₂ − H₁ = ${f8(H2)} − ${f8(H1)} = <b>${sg8(dH)} kJ/mol</b>: ${kind}। কুঁজ পার হতে সক্রিয়ণ শক্তি: ${f8(Ea)} kJ/mol।`);
  };
  chips8(el, ".k8pc", b => { const p = P[+b.dataset.i]; $("#k8pr", el).value = p[2]; $("#k8pp", el).value = p[3]; $("#k8pe", el).value = p[4]; draw(); });
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", () => { el.querySelectorAll(".k8pc button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); }));
  draw();
};

/* ============ 8.1.3 bond energy calculator ============ */
const BE8 = { "C–H": 414, "C–Cl": 326, "C–C": 344, "C=C": 615, "N≡N": 946, "Br–Br": 193, "H–Cl": 431, "H–I": 299, "N–H": 391, "O–H": 464, "O=O": 498, "Cl–Cl": 244, "I–I": 151, "H–H": 436, "H–Br": 366 };
W.k8bond = (el) => {
  const R = [
    ["CH₄ + Cl₂ → CH₃Cl + HCl", [["C–H", 1], ["Cl–Cl", 1]], [["C–Cl", 1], ["H–Cl", 1]]],
    ["H₂ + Cl₂ → 2HCl", [["H–H", 1], ["Cl–Cl", 1]], [["H–Cl", 2]]],
    ["H₂ + Br₂ → 2HBr", [["H–H", 1], ["Br–Br", 1]], [["H–Br", 2]]],
    ["H₂ + I₂ → 2HI", [["H–H", 1], ["I–I", 1]], [["H–I", 2]]],
    ["2H₂ + O₂ → 2H₂O", [["H–H", 2], ["O=O", 1]], [["O–H", 4]]],
    ["N₂ + 3H₂ → 2NH₃", [["N≡N", 1], ["H–H", 3]], [["N–H", 6]]],
    ["C₂H₄ + H₂ → C₂H₆", [["C=C", 1], ["H–H", 1]], [["C–C", 1], ["C–H", 2]]],
    ["2H₂O → 2H₂ + O₂", [["O–H", 4]], [["H–H", 2], ["O=O", 1]]],
    ["2NH₃ → N₂ + 3H₂", [["N–H", 6]], [["N≡N", 1], ["H–H", 3]]]
  ];
  let ri = 0;
  el.innerHTML = `<div class="chipset k8bc" role="group">${R.map((r, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${r[0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k8bsv"></div><div class="w-out" id="k8bo"></div>`;
  const tones = ["var(--c)", "var(--note)", "var(--good)"];
  const draw = () => {
    const [eq, br, fo] = R[ri];
    const sum = L => L.reduce((a, [b, n]) => a + BE8[b] * n, 0);
    const B1 = sum(br), B2 = sum(fo), dH = B1 - B2, mx = Math.max(B1, B2), W0 = 300, sc = W0 / mx;
    let s = `<svg viewBox="0 0 400 250" role="img" aria-label="${L2("bond energy bars", "বন্ধন শক্তির বার")}">
      <text x="200" y="22" font-size="15" font-weight="700" text-anchor="middle" fill="var(--ink)">${eq}</text>`;
    const bar = (y, lab, L, tot, note) => {
      let x = 50, g = `<text x="50" y="${y - 8}" font-size="13" fill="var(--ink)" font-weight="700">${lab}</text><text x="${50 + W0}" y="${y - 8}" font-size="13" text-anchor="end" fill="var(--muted)">${note}</text>`;
      L.forEach(([b, n], i) => { for (let k = 0; k < n; k++) { const w = BE8[b] * sc; g += `<rect x="${x}" y="${y}" width="${w}" height="34" fill="${tones[i % 3]}" opacity="${k % 2 ? .45 : .7}" stroke="var(--paper)"/>`; if (w > 34) g += `<text x="${x + w / 2}" y="${y + 22}" font-size="12" text-anchor="middle" fill="var(--ink)">${b}</text>`; x += w; } });
      return g + `<text x="${x + 6}" y="${y + 22}" font-size="13" font-weight="700" fill="var(--ink)">${f8(tot)}</text>`;
    };
    s += bar(58, L2("B₁: bonds broken (energy in)", "B₁: ভাঙা বন্ধন (শক্তি শোষণ)"), br, B1, "");
    s += bar(138, L2("B₂: bonds formed (energy out)", "B₂: গড়া বন্ধন (শক্তি নির্গমন)"), fo, B2, "");
    const x1 = 50 + B1 * sc, x2 = 50 + B2 * sc, col = dH < 0 ? "var(--bad)" : "var(--c)";
    s += `<line x1="${x1}" y1="96" x2="${x1}" y2="182" stroke="var(--muted)" stroke-dasharray="3 3"/><line x1="${x2}" y1="96" x2="${x2}" y2="182" stroke="var(--muted)" stroke-dasharray="3 3"/>
      <rect x="${Math.min(x1, x2)}" y="194" width="${Math.max(2, Math.abs(x1 - x2))}" height="14" fill="${col}" opacity=".8"/>
      <text x="200" y="236" font-size="15" font-weight="700" text-anchor="middle" fill="${col}">ΔH = ${f8(B1)} − ${f8(B2)} = ${sg8(dH)} kJ</text></svg>`;
    $("#k8bsv", el).innerHTML = s;
    const lst = L => L.map(([b, n]) => `${B8(n)} × ${b} (${B8(BE8[b])})`).join(" + ");
    $("#k8bo", el).innerHTML = L2(`Broken: ${lst(br)} = <b>${f8(B1)} kJ</b>. Formed: ${lst(fo)} = <b>${f8(B2)} kJ</b>. ΔH = B₁ − B₂ = <b>${sg8(dH)} kJ</b>, so the reaction is <b>${dH < 0 ? "exothermic" : "endothermic"}</b>: ${dH < 0 ? "making the new bonds releases more energy than breaking the old ones costs." : "breaking the old bonds costs more energy than making the new ones gives back."}`,
      `ভাঙা: ${lst(br)} = <b>${f8(B1)} kJ</b>। গড়া: ${lst(fo)} = <b>${f8(B2)} kJ</b>। ΔH = B₁ − B₂ = <b>${sg8(dH)} kJ</b>, তাই বিক্রিয়াটি <b>${dH < 0 ? "তাপোৎপাদী" : "তাপহারী"}</b>: ${dH < 0 ? "নতুন বন্ধন গড়ায় পুরোনো বন্ধন ভাঙার খরচের চেয়ে বেশি শক্তি বের হয়।" : "পুরোনো বন্ধন ভাঙার খরচ নতুন বন্ধন গড়ায় ফেরত পাওয়ার চেয়ে বেশি।"}`);
  };
  chips8(el, ".k8bc", b => { ri = +b.dataset.i; draw(); });
  draw();
};

/* ============ 8.2 fuels: heat of combustion comparison ============ */
W.k8fuel = (el) => {
  /* [id, label en, label bn, ΔHc kJ/mol, M g/mol, C atoms] */
  const F = [
    ["H2", "Hydrogen H₂", "হাইড্রোজেন H₂", 286, 2, 0],
    ["CH4", "Natural gas CH₄", "প্রাকৃতিক গ্যাস CH₄", 890, 16, 1],
    ["C4H10", "LPG (butane)", "এলপিজি (বিউটেন)", 2877, 58, 4],
    ["C8H18", "Petrol (octane)", "পেট্রোল (অকটেন)", 5470, 114, 8],
    ["C2H5OH", "Ethanol", "ইথানল", 1367, 46, 2],
    ["C", "Charcoal (C)", "কাঠকয়লা (C)", 393.5, 12, 1]
  ];
  let fi = 1;
  el.innerHTML = `<div class="chipset k8fc" role="group">${F.map((f, i) => `<button data-i="${i}" aria-pressed="${i === fi}">${L2(f[1], f[2])}</button>`).join("")}</div>
    ${slider("k8fm", L2("Mass of fuel burnt", "পোড়ানো জ্বালানির ভর"), 1, 100, 1, 10, "g")}
    <div class="svgwrap fit" id="k8fsv"></div><div class="w-out" id="k8fo"></div>`;
  const draw = () => {
    const m = sv(el, "k8fm", "g"), f = F[fi], kpg = f[3] / f[4], heat = m * kpg, co2 = m / f[4] * f[5] * 44, water = 313.5 / kpg;
    let s = `<svg viewBox="0 0 400 300" role="img" aria-label="${L2("fuel comparison", "জ্বালানির তুলনা")}">
      <text x="10" y="18" font-size="13" font-weight="700" fill="var(--ink)">${L2("heat per gram (kJ/g)", "প্রতি গ্রামে তাপ (kJ/g)")}</text>
      <text x="10" y="164" font-size="13" font-weight="700" fill="var(--ink)">${L2("CO₂ per MJ of heat (g)", "প্রতি MJ তাপে CO₂ (g)")}</text>`;
    F.forEach((q, i) => {
      const k = q[3] / q[4], c = q[5] * 44 / q[3] * 1000, y1 = 28 + i * 21, y2 = 174 + i * 20, on = i === fi, col = on ? "var(--bad)" : "var(--c)";
      const nm = L2(q[1], q[2]).split(" (")[0];
      s += `<text x="118" y="${y1 + 13}" font-size="12.5" text-anchor="end" fill="var(--ink)" font-weight="${on ? 700 : 400}">${nm}</text>
        <rect x="124" y="${y1 + 2}" width="${k / 143 * 220}" height="14" rx="3" fill="${col}" opacity="${on ? .85 : .45}"/>
        <text x="${128 + k / 143 * 220}" y="${y1 + 13}" font-size="12.5" fill="var(--muted)">${f8(k, 1)}</text>
        <text x="118" y="${y2 + 13}" font-size="12.5" text-anchor="end" fill="var(--ink)" font-weight="${on ? 700 : 400}">${nm}</text>
        <rect x="124" y="${y2 + 2}" width="${Math.max(1, c / 112 * 220)}" height="14" rx="3" fill="${on ? "var(--bad)" : "var(--note)"}" opacity="${on ? .85 : .5}"/>
        <text x="${128 + Math.max(1, c / 112 * 220)}" y="${y2 + 13}" font-size="12.5" fill="var(--muted)">${f8(c, 0)}</text>`;
    });
    $("#k8fsv", el).innerHTML = s + `</svg>`;
    $("#k8fo", el).innerHTML = L2(`Burning <b>${f8(m)} g</b> of ${f[1]} (ΔH = −${f8(f[3], 1)} kJ/mol, M = ${f8(f[4])} g/mol) releases ${f8(m)} × ${f8(kpg, 1)} ≈ <b>${f8(heat)} kJ</b> and makes <b>${f8(co2, 1)} g of CO₂</b>. To heat 1 L of water from 25 °C to 100 °C (313.5 kJ) you would need at least <b>${f8(water, 1)} g</b> of this fuel, with no heat wasted.`,
      `${f[2]}-এর <b>${f8(m)} g</b> পোড়ালে (ΔH = −${f8(f[3], 1)} kJ/mol, M = ${f8(f[4])} g/mol) নির্গত হয় ${f8(m)} × ${f8(kpg, 1)} ≈ <b>${f8(heat)} kJ</b>, আর তৈরি হয় <b>${f8(co2, 1)} g CO₂</b>। ১ L পানি ২৫ °C থেকে ১০০ °C-এ গরম করতে (৩১৩.৫ kJ) কোনো অপচয় না হলেও এই জ্বালানির অন্তত <b>${f8(water, 1)} g</b> লাগবে।`);
  };
  chips8(el, ".k8fc", b => { fi = +b.dataset.i; draw(); });
  el.querySelector("input").addEventListener("input", draw);
  draw();
};

/* ============ 8.3.1 conductivity tester ============ */
W.k8cond = (el) => {
  /* [en, bn, glow 0..1, kind, state s|l|aq, ions?] kind: e electronic, S strong, w weak, n non, x solid ionic */
  const S = [
    ["Copper wire", "কপারের তার", 1, "e", "s"], ["Graphite rod", "গ্রাফাইট দণ্ড", 0.9, "e", "s"],
    ["Solid NaCl", "কঠিন NaCl", 0, "x", "s"], ["Molten NaCl", "গলিত NaCl", 1, "S", "l"],
    ["NaCl solution", "NaCl দ্রবণ", 0.95, "S", "aq"], ["Dilute H₂SO₄", "লঘু H₂SO₄", 1, "S", "aq"],
    ["CuSO₄ solution", "CuSO₄ দ্রবণ", 0.9, "S", "aq"], ["Vinegar (CH₃COOH)", "ভিনেগার (CH₃COOH)", 0.3, "w", "aq"],
    ["Pure water", "বিশুদ্ধ পানি", 0.04, "w", "l"], ["Sugar solution", "চিনির দ্রবণ", 0, "n", "aq"]
  ];
  let si = 4, t = 0;
  el.innerHTML = `<div class="chipset k8cc" role="group">${S.map((q, i) => `<button data-i="${i}" aria-pressed="${i === si}">${L2(q[0], q[1])}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k8csv"></div><div class="w-out" id="k8co"></div>`;
  const draw = () => {
    const [en, bn, g, kind, st] = S[si], solid = st === "s";
    let s = `<svg viewBox="0 0 400 260" role="img" aria-label="${L2("conductivity tester", "পরিবাহিতা পরীক্ষক")}">
      <rect x="40" y="26" width="46" height="24" rx="3" fill="var(--c-soft)" stroke="var(--ink)"/><text x="63" y="43" font-size="13" text-anchor="middle" fill="var(--ink)">+ −</text>
      <path d="M40 38 H20 V${solid ? 140 : 100} H120 ${solid ? "" : "V130"} M86 38 H200" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="222" cy="38" r="${14 + g * 26}" fill="var(--note)" opacity="${g * 0.45}"/>
      <circle cx="222" cy="38" r="15" fill="${g > 0.02 ? "var(--note)" : "var(--paper)"}" opacity="${g > 0.02 ? 0.35 + g * 0.65 : 1}" stroke="var(--ink)" stroke-width="2"/>
      <path d="M216 44 l3 -10 l3 8 l3 -8 l3 10" fill="none" stroke="var(--ink)" stroke-width="1.3"/>
      <path d="M237 38 H300 V${solid ? 140 : 100} H280 ${solid ? "" : "V130"}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    if (solid) {
      const fill = kind === "x" ? "var(--paper)" : "var(--muted)";
      s += `<rect x="120" y="132" width="160" height="18" rx="4" fill="${fill}" stroke="var(--ink)"/>`;
      if (kind === "x") for (let i = 0; i < 16; i++) s += `<text x="${128 + i * 10}" y="${145}" font-size="10" text-anchor="middle" fill="${i % 2 ? "var(--good)" : "var(--c)"}">${i % 2 ? "−" : "+"}</text>`;
      else if (g > 0) for (let i = 0; i < 8; i++) { const x = 124 + ((i * 20 + t * 60) % 152); s += `<circle cx="${x}" cy="141" r="3" fill="var(--bad)"/>`; }
      s += `<text x="200" y="176" font-size="13" text-anchor="middle" fill="var(--muted)">${kind === "x" ? L2("ions locked in the crystal", "কেলাসে আটকে থাকা আয়ন") : L2("free electrons flow ←", "মুক্ত ইলেকট্রন চলে ←")}</text>`;
    } else {
      s += `<path d="M110 110 V230 H290 V110" fill="none" stroke="var(--ink)" stroke-width="2"/>
        <rect x="112" y="140" width="176" height="88" fill="${si === 6 ? "var(--c)" : "var(--c-soft)"}" opacity="${si === 6 ? .25 : .6}"/>
        <rect x="116" y="130" width="8" height="90" fill="var(--muted)"/><rect x="276" y="130" width="8" height="90" fill="var(--muted)"/>
        <path d="M120 130 V140 M280 130 V140" stroke="var(--ink)"/>
        <text x="104" y="126" font-size="14" text-anchor="middle" fill="var(--ink)">+</text><text x="296" y="126" font-size="14" text-anchor="middle" fill="var(--ink)">−</text>`;
      const nIon = kind === "S" ? 12 : kind === "w" ? (si === 8 ? 1 : 3) : 0, nMol = kind === "S" ? 0 : 9;
      for (let i = 0; i < nMol; i++) { const x = 140 + (i * 47) % 130, y = 155 + (i * 29) % 60; s += `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" fill="none" stroke="var(--muted)"/>`; }
      for (let i = 0; i < nIon; i++) {
        const pos = i % 2 === 0, base = 135 + ((i * 53) % 130), dir = pos ? 1 : -1, sp = g > 0.02 ? 18 : 0;
        let x = base + dir * ((t * sp + i * 7) % 60) - dir * 20; x = Math.max(130, Math.min(270, x));
        const y = 152 + (i * 23) % 66;
        s += `<circle cx="${x}" cy="${y}" r="7" fill="${pos ? "var(--c)" : "var(--good)"}" opacity=".85"/><text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle" fill="var(--paper)">${pos ? "+" : "−"}</text>`;
      }
      s += `<text x="200" y="252" font-size="13" text-anchor="middle" fill="var(--muted)">${nIon ? L2("+ ions → cathode (−), − ions → anode (+)", "+ আয়ন → ক্যাথোড (−), − আয়ন → অ্যানোড (+)") : L2("whole molecules, no ions", "পুরো অণু, আয়ন নেই")}</text>`;
    }
    const verdict = g > 0.6 ? L2("bright", "উজ্জ্বল") : g > 0.1 ? L2("dim", "টিমটিমে") : g > 0.02 ? L2("barely glows", "প্রায় জ্বলে না") : L2("off", "নেভা");
    s += `<text x="330" y="44" font-size="14" font-weight="700" fill="var(--ink)">${verdict}</text></svg>`;
    $("#k8csv", el).innerHTML = s;
    const K = { e: L2("an <b>electronic conductor</b>: free electrons carry the current and the substance does not change.", "একটি <b>ইলেকট্রনীয় পরিবাহী</b>: মুক্ত ইলেকট্রন বিদ্যুৎ বহন করে, পদার্থের কোনো পরিবর্তন হয় না।"),
      S: L2("a <b>strong electrolyte</b>: completely ionised, so many ions carry the current (and are changed at the electrodes).", "একটি <b>তীব্র তড়িৎ বিশ্লেষ্য</b>: সম্পূর্ণ আয়নিত, তাই অনেক আয়ন বিদ্যুৎ বহন করে (আর তড়িৎদ্বারে পরিবর্তিত হয়)।"),
      w: L2("a <b>weak electrolyte</b>: only slightly ionised, so few ions and a weak current.", "একটি <b>মৃদু তড়িৎ বিশ্লেষ্য</b>: সামান্য আয়নিত, তাই আয়ন কম আর প্রবাহ দুর্বল।"),
      n: L2("a <b>non-electrolyte</b>: it dissolves as whole molecules, with no ions, so no current.", "একটি <b>অ-তড়িৎ বিশ্লেষ্য</b>: পুরো অণু হিসেবে দ্রবীভূত হয়, আয়ন নেই, তাই প্রবাহও নেই।"),
      x: L2("ionic, but in the <b>solid</b> state its ions cannot move, so it does not conduct. Melt or dissolve it and it will.", "আয়নিক, কিন্তু <b>কঠিন</b> অবস্থায় এর আয়ন চলতে পারে না, তাই পরিবহণ করে না। গলালে বা দ্রবীভূত করলে করবে।") };
    $("#k8co", el).innerHTML = `${L2(en, bn)}: ${K[kind]}`;
  };
  chips8(el, ".k8cc", b => { si = +b.dataset.i; draw(); });
  draw();
  if (!REDUCED) animate(el, dt => { t += dt; draw(); });
};

/* ============ 8.3.2 electrolysis cell ============ */
W.k8elec = (el) => {
  /* species: [label, charge sign, colour, discharged?] ; products */
  const E = {
    molten: { n: L2("Molten NaCl", "গলিত NaCl"), sp: [["Na⁺", 1, "var(--c)", 1, 7], ["Cl⁻", -1, "var(--good)", 1, 7]], cat: ["Na", "metal"], an: ["Cl₂", "gas"], blue: 0,
      eq: ["2Cl⁻ → Cl₂ + 2e⁻", "2Na⁺ + 2e⁻ → 2Na"], left: L2("Only Na⁺ and Cl⁻ are present, so both are discharged.", "শুধু Na⁺ ও Cl⁻ আছে, তাই দুটোই চার্জমুক্ত হয়।") },
    brine: { n: L2("Conc. NaCl solution", "গাঢ় NaCl দ্রবণ"), sp: [["Na⁺", 1, "var(--c)", 0, 6], ["Cl⁻", -1, "var(--good)", 1, 6], ["H⁺", 1, "var(--bad)", 1, 3], ["OH⁻", -1, "var(--note)", 0, 3]], cat: ["H₂", "gas"], an: ["Cl₂", "gas"], blue: 0,
      eq: ["2Cl⁻ → Cl₂ + 2e⁻", "2H⁺ + 2e⁻ → H₂"], left: L2("H⁺ is discharged instead of Na⁺ (lower in the series); Cl⁻ wins over OH⁻ because it is far more concentrated. Na⁺ and OH⁻ stay behind as NaOH.", "Na⁺-এর বদলে H⁺ চার্জমুক্ত হয় (সারিতে নিচে); OH⁻-এর চেয়ে Cl⁻ জেতে কারণ এর ঘনমাত্রা অনেক বেশি। Na⁺ ও OH⁻ থেকে যায় NaOH হিসেবে।") },
    water: { n: L2("Acidified water", "অম্লীয় পানি"), sp: [["H⁺", 1, "var(--bad)", 1, 7], ["OH⁻", -1, "var(--note)", 1, 4], ["SO₄²⁻", -1, "var(--good)", 0, 4]], cat: ["H₂", "gas"], an: ["O₂", "gas"], blue: 0,
      eq: ["4OH⁻ → O₂ + 2H₂O + 4e⁻", "4H⁺ + 4e⁻ → 2H₂"], left: L2("SO₄²⁻ is above OH⁻, so OH⁻ is discharged. Twice as much hydrogen as oxygen forms; the acid is not used up.", "SO₄²⁻ সারিতে OH⁻-এর ওপরে, তাই OH⁻ চার্জমুক্ত হয়। অক্সিজেনের দ্বিগুণ হাইড্রোজেন হয়; এসিড খরচ হয় না।") },
    cuso4: { n: L2("CuSO₄ solution", "CuSO₄ দ্রবণ"), sp: [["Cu²⁺", 1, "var(--c)", 1, 6], ["H⁺", 1, "var(--bad)", 0, 2], ["SO₄²⁻", -1, "var(--good)", 0, 5], ["OH⁻", -1, "var(--note)", 1, 3]], cat: ["Cu", "metal"], an: ["O₂", "gas"], blue: 1,
      eq: ["4OH⁻ → O₂ + 2H₂O + 4e⁻", "2Cu²⁺ + 4e⁻ → 2Cu"], left: L2("Cu²⁺ is below H⁺, so copper plates the cathode; OH⁻ is discharged at the anode. The blue colour fades and the solution becomes acidic.", "Cu²⁺ সারিতে H⁺-এর নিচে, তাই ক্যাথোডে কপার জমে; অ্যানোডে OH⁻ চার্জমুক্ত হয়। নীল রং ফিকে হয় আর দ্রবণ অম্লীয় হয়।") }
  };
  let k = "brine", on = true, P = [], bub = [], dep = 0, done = 0;
  el.innerHTML = `<div class="chipset k8ec" role="group">${Object.keys(E).map(q => `<button data-k="${q}" aria-pressed="${q === k}">${E[q].n}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k8esv"></div>
    <div class="w-row"><button class="btn solid" id="k8ego">${L2("Switch off", "বন্ধ করো")}</button>${REDUCED ? `<button class="btn" id="k8est">${L2("Step", "এক ধাপ")}</button>` : ""}</div>
    <div class="w-out" id="k8eo"></div>`;
  const XA = 110, XC = 290, Y0 = 120, Y1 = 250;
  const reset = () => { P = []; bub = []; dep = 0; done = 0; E[k].sp.forEach((q, i) => { for (let j = 0; j < q[4]; j++) P.push({ s: i, x: 130 + Math.random() * 140, y: Y0 + 12 + Math.random() * (Y1 - Y0 - 24), ph: Math.random() * 6 }); }); };
  const step = dt => {
    const e = E[k];
    P.forEach(p => {
      const q = e.sp[p.s]; p.ph += dt * 3;
      if (on) p.x += (q[1] > 0 ? 1 : -1) * 28 * dt; p.y += Math.sin(p.ph) * 12 * dt; p.x += Math.cos(p.ph * 1.3) * 8 * dt;
      p.y = Math.max(Y0 + 10, Math.min(Y1 - 10, p.y));
      const atA = p.x < XA + 14, atC = p.x > XC - 14;
      if ((atA && q[1] < 0) || (atC && q[1] > 0)) {
        if (q[3]) { done++; const pr = q[1] > 0 ? e.cat : e.an, x = q[1] > 0 ? XC : XA;
          if (pr[1] === "gas") bub.push({ x: x + (q[1] > 0 ? -12 : 12) + Math.random() * 6 - 3, y: p.y, r: 3 + Math.random() * 2, g: pr[0] }); else dep = Math.min(10, dep + 0.25);
          p.x = 140 + Math.random() * 120; p.y = Y0 + 12 + Math.random() * (Y1 - Y0 - 24); }
        else { p.x = q[1] > 0 ? XC - 16 : XA + 16; }
      }
      p.x = Math.max(XA + 12, Math.min(XC - 12, p.x));
    });
    bub.forEach(b => b.y -= 40 * dt); bub = bub.filter(b => b.y > Y0 - 2);
  };
  const draw = () => {
    const e = E[k], fade = e.blue ? Math.max(0.05, 0.35 - done * 0.004) : 0;
    let s = `<svg viewBox="0 0 400 290" role="img" aria-label="${L2("electrolytic cell", "তড়িৎ বিশ্লেষ্য কোষ")}">${arrowDefs("k8ea", "var(--bad)")}
      <rect x="170" y="14" width="60" height="26" rx="3" fill="var(--c-soft)" stroke="var(--ink)"/><text x="182" y="32" font-size="15" font-weight="700" fill="var(--ink)">+</text><text x="212" y="32" font-size="15" font-weight="700" fill="var(--ink)">−</text>
      <path d="M170 27 H${XA} V${Y0 - 10} M230 27 H${XC} V${Y0 - 10}" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <path d="M80 100 V272 H320 V100" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="82" y="${Y0}" width="236" height="${270 - Y0}" fill="${e.blue ? "var(--c)" : k === "molten" ? "var(--note)" : "var(--c-soft)"}" opacity="${e.blue ? fade : k === "molten" ? .18 : .5}"/>
      <rect x="${XA - 8}" y="${Y0 - 20}" width="16" height="140" fill="var(--muted)"/><rect x="${XC - 8}" y="${Y0 - 20}" width="16" height="140" fill="var(--muted)"/>`;
    if (dep > 0) s += `<rect x="${XC - 8 - dep}" y="${Y0}" width="${16 + 2 * dep}" height="120" rx="3" fill="${k === "cuso4" ? "var(--bad)" : "var(--ink)"}" opacity=".55"/>`;
    s += `<text x="${XA}" y="${Y0 - 28}" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2("anode (+)", "অ্যানোড (+)")}</text>
      <text x="${XC}" y="${Y0 - 28}" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2("cathode (−)", "ক্যাথোড (−)")}</text>`;
    if (on) s += `<path d="M150 20 H125" stroke="var(--bad)" stroke-width="2" marker-end="url(#k8ea)"/><path d="M275 20 H250" stroke="var(--bad)" stroke-width="2" marker-end="url(#k8ea)"/><text x="138" y="12" font-size="12" text-anchor="middle" fill="var(--bad)">e⁻</text><text x="262" y="12" font-size="12" text-anchor="middle" fill="var(--bad)">e⁻</text>`;
    P.forEach(p => { const q = e.sp[p.s]; s += `<circle cx="${p.x}" cy="${p.y}" r="12.5" fill="${q[2]}" opacity=".88"/><text x="${p.x}" y="${p.y + 4}" font-size="${q[0].length > 3 ? 10 : 11.5}" text-anchor="middle" fill="var(--paper)" font-weight="700">${q[0]}</text>`; });
    bub.forEach(b => { s += `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="none" stroke="var(--ink)" stroke-width="1.2"/>`; });
    s += `<text x="${XA}" y="286" font-size="13" text-anchor="middle" fill="var(--good)" font-weight="700">${e.an[0]}</text><text x="${XC}" y="286" font-size="13" text-anchor="middle" fill="var(--c)" font-weight="700">${e.cat[0]}</text>`;
    $("#k8esv", el).innerHTML = s + `</svg>`;
    $("#k8eo", el).innerHTML = L2(`<b>Anode (oxidation):</b> ${e.eq[0]}<br><b>Cathode (reduction):</b> ${e.eq[1]}<br>${e.left}`, `<b>অ্যানোড (জারণ):</b> ${e.eq[0]}<br><b>ক্যাথোড (বিজারণ):</b> ${e.eq[1]}<br>${e.left}`);
  };
  chips8(el, ".k8ec", b => { k = b.dataset.k; reset(); if (REDUCED && on) for (let i = 0; i < 200; i++) step(0.05); draw(); });
  $("#k8ego", el).addEventListener("click", () => { on = !on; $("#k8ego", el).textContent = on ? L2("Switch off", "বন্ধ করো") : L2("Switch on", "চালু করো"); if (REDUCED && on) for (let i = 0; i < 200; i++) step(0.05); draw(); });
  if (REDUCED) $("#k8est", el).addEventListener("click", () => { for (let i = 0; i < 20; i++) step(0.05); draw(); });
  reset(); if (REDUCED) for (let i = 0; i < 200; i++) step(0.05); draw();
  if (!REDUCED) animate(el, dt => { step(dt); draw(); });
};

/* ============ 8.3.3 electroplating / refining / aluminium ============ */
W.k8plate = (el) => {
  const M = {
    ag: { n: L2("Silver plating a spoon", "চামচে সিলভার প্রলেপ"), an: L2("silver foil", "সিলভার পাত"), ca: L2("iron spoon", "লোহার চামচ"), ion: "Ag⁺", sol: "AgNO₃(aq)", ac: "var(--muted)", dc: "var(--muted)",
      eq: ["Ag → Ag⁺ + e⁻", "Ag⁺ + e⁻ → Ag"], note: L2("The spoon (cathode) gets a silver coat while the silver anode wears away; the Ag⁺ concentration stays the same.", "চামচে (ক্যাথোড) সিলভারের প্রলেপ পড়ে আর সিলভার অ্যানোড ক্ষয় হয়; Ag⁺-এর ঘনমাত্রা একই থাকে।") },
    cu: { n: L2("Refining copper", "কপার পরিশোধন"), an: L2("impure copper", "অবিশুদ্ধ কপার"), ca: L2("pure copper", "বিশুদ্ধ কপার"), ion: "Cu²⁺", sol: "CuSO₄(aq)", ac: "var(--bad)", dc: "var(--bad)",
      eq: ["Cu → Cu²⁺ + 2e⁻", "Cu²⁺ + 2e⁻ → Cu"], note: L2("The impure anode dissolves; pure copper builds up on the cathode; impurities fall as anode mud.", "অবিশুদ্ধ অ্যানোড দ্রবীভূত হয়; ক্যাথোডে বিশুদ্ধ কপার জমে; ভেজাল অ্যানোড মাড হিসেবে নিচে পড়ে।") },
    al: { n: L2("Extracting aluminium", "অ্যালুমিনিয়াম নিষ্কাশন"), an: L2("carbon anodes", "কার্বন অ্যানোড"), ca: L2("carbon lining (cathode)", "কার্বনের আস্তরণ (ক্যাথোড)"), ion: "Al³⁺", sol: L2("Al₂O₃ in molten cryolite", "গলিত ক্রায়োলাইটে Al₂O₃"), ac: "var(--ink)", dc: "var(--muted)",
      eq: ["6O²⁻ → 3O₂ + 12e⁻", "4Al³⁺ + 12e⁻ → 4Al"], note: L2("Molten aluminium collects at the bottom (cathode). Oxygen at the hot carbon anodes burns them to CO₂, so they shrink and must be replaced.", "গলিত অ্যালুমিনিয়াম তলায় (ক্যাথোডে) জমে। গরম কার্বন অ্যানোডে অক্সিজেন তাদের পুড়িয়ে CO₂ বানায়, তাই অ্যানোড ছোট হয় আর বদলাতে হয়।") }
  };
  let k = "ag", play = false;
  el.innerHTML = `<div class="chipset k8lc" role="group">${Object.keys(M).map(q => `<button data-k="${q}" aria-pressed="${q === k}">${M[q].n}</button>`).join("")}</div>
    ${slider("k8lt", L2("Time current flows", "বিদ্যুৎপ্রবাহের সময়"), 0, 60, 1, 0, L2("min", "মিনিট"))}
    <div class="w-row"><button class="btn solid" id="k8lgo">${L2("Run", "চালাও")}</button></div>
    <div class="svgwrap fit" id="k8lsv"></div><div class="w-out" id="k8lo"></div>`;
  const draw = () => {
    const T = sv(el, "k8lt", L2("min", "মিনিট")), f = T / 60, m = M[k];
    let s = `<svg viewBox="0 0 400 270" role="img" aria-label="${m.n}">
      <rect x="170" y="10" width="60" height="24" rx="3" fill="var(--c-soft)" stroke="var(--ink)"/><text x="182" y="27" font-size="15" font-weight="700" fill="var(--ink)">+</text><text x="212" y="27" font-size="15" font-weight="700" fill="var(--ink)">−</text>
      <path d="M60 80 V255 H340 V80" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="62" y="100" width="276" height="153" fill="${k === "cu" ? "var(--c)" : k === "al" ? "var(--note)" : "var(--c-soft)"}" opacity="${k === "cu" ? .22 : k === "al" ? .2 : .5}"/>`;
    const ions = [];
    if (k === "al") {
      const pool = 4 + f * 34, aw = 60 * (1 - 0.45 * f);
      s += `<path d="M170 22 H120 V60 M230 22 H330 V250" fill="none" stroke="var(--ink)" stroke-width="2"/>
        <rect x="62" y="${253 - pool}" width="276" height="${pool}" fill="var(--muted)" opacity=".8"/>
        <text x="200" y="${249 - pool / 2 + 5}" font-size="13" text-anchor="middle" fill="var(--paper)" font-weight="700">${pool > 16 ? L2("molten Al", "গলিত Al") : ""}</text>`;
      [120, 200].forEach(x => { s += `<rect x="${x - aw / 2}" y="60" width="${aw}" height="${100 - 40 * f}" fill="var(--ink)" opacity=".75"/>`; });
      s += `<path d="M120 60 H200" stroke="var(--ink)" stroke-width="2"/>`;
      for (let i = 0; i < 6; i++) { const x = 105 + (i % 3) * 15 + (i > 2 ? 80 : 0), y = 170 - 40 * f - ((i * 13 + T * 7) % 50); if (y > 100) s += `<circle cx="${x}" cy="${y}" r="3.5" fill="none" stroke="var(--ink)"/>`; }
      for (let i = 0; i < 8; i++) { const fr = ((i / 8) + f * 3) % 1, x = 90 + i * 30, y = 175 + fr * (70 - pool); ions.push([x, Math.min(y, 250 - pool), "Al³⁺", "var(--c)"]); }
      s += `<text x="345" y="${250 - pool / 2}" font-size="12" fill="var(--muted)">−</text>
        <text x="200" y="266" font-size="13" text-anchor="middle" fill="var(--muted)">${m.sol}</text>
        <text x="160" y="52" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2("anodes (+) → CO₂", "অ্যানোড (+) → CO₂")}</text>`;
    } else {
      const aw = 22 * (1 - 0.6 * f), coat = 1 + f * 7;
      s += `<path d="M170 22 H110 V80 M230 22 H290 V80" fill="none" stroke="var(--ink)" stroke-width="2"/>
        <rect x="${110 - aw / 2}" y="80" width="${aw}" height="150" fill="${m.ac}" opacity="${k === "cu" ? .6 : .75}"/>`;
      if (k === "ag") s += `<path d="M290 80 V180" stroke="var(--ink)" stroke-width="6"/><ellipse cx="290" cy="205" rx="${12 + coat / 2}" ry="${26 + coat / 2}" fill="var(--muted)" opacity="${.35 + f * .5}" stroke="var(--ink)" stroke-width="${1 + f * 2}"/>`;
      else s += `<rect x="${285 - coat}" y="80" width="${10 + 2 * coat}" height="150" fill="var(--bad)" opacity=".75"/>`;
      if (k === "cu") for (let i = 0; i < Math.round(f * 10); i++) s += `<circle cx="${100 + (i * 7) % 24}" cy="${247 - (i % 3) * 3}" r="2.5" fill="var(--ink)" opacity=".6"/>`;
      for (let i = 0; i < 7; i++) { const fr = ((i / 7) + T * 0.05) % 1, x = 126 + fr * 150, y = 120 + (i * 37) % 100; ions.push([x, y, m.ion, "var(--c)"]); }
      s += `<text x="110" y="74" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2("anode (+)", "অ্যানোড (+)")}</text>
        <text x="290" y="74" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2("cathode (−)", "ক্যাথোড (−)")}</text>
        <text x="110" y="268" font-size="12.5" text-anchor="middle" fill="var(--muted)">${m.an}</text><text x="290" y="268" font-size="12.5" text-anchor="middle" fill="var(--muted)">${m.ca}</text>
        <text x="200" y="250" font-size="12.5" text-anchor="middle" fill="var(--muted)">${m.sol}</text>`;
    }
    ions.forEach(([x, y, lab, c]) => { s += `<circle cx="${x}" cy="${y}" r="11" fill="${c}" opacity=".8"/><text x="${x}" y="${y + 4}" font-size="9.5" text-anchor="middle" fill="var(--paper)" font-weight="700">${lab}</text>`; });
    $("#k8lsv", el).innerHTML = s + `</svg>`;
    $("#k8lo", el).innerHTML = L2(`<b>Anode:</b> ${m.eq[0]} &nbsp; <b>Cathode:</b> ${m.eq[1]}<br>${m.note}`, `<b>অ্যানোড:</b> ${m.eq[0]} &nbsp; <b>ক্যাথোড:</b> ${m.eq[1]}<br>${m.note}`);
  };
  chips8(el, ".k8lc", b => { k = b.dataset.k; $("#k8lt", el).value = 0; draw(); });
  $("#k8lt", el).addEventListener("input", draw);
  $("#k8lgo", el).addEventListener("click", () => { const i = $("#k8lt", el); if (REDUCED) { i.value = 60; draw(); return; } if (+i.value >= 60) i.value = 0; play = true; });
  if (!REDUCED) animate(el, dt => { if (!play) return; const i = $("#k8lt", el); const v = Math.min(60, +i.value + dt * 6); i.value = v; if (v >= 60) play = false; draw(); });
  draw();
};

/* ============ 8.4 Daniell / galvanic cell ============ */
W.k8daniell = (el) => {
  /* metal: [symbol, ion, E° (V, for the voltage estimate), electrons, colour] */
  const MT = { Mg: ["Mg", "Mg²⁺", -2.37, 2, "var(--muted)"], Zn: ["Zn", "Zn²⁺", -0.76, 2, "var(--muted)"], Fe: ["Fe", "Fe²⁺", -0.44, 2, "var(--ink)"], Cu: ["Cu", "Cu²⁺", 0.34, 2, "var(--bad)"], Ag: ["Ag", "Ag⁺", 0.80, 1, "var(--note)"] };
  const PR = [["Zn", "Cu"], ["Cu", "Ag"], ["Mg", "Cu"], ["Zn", "Ag"], ["Fe", "Cu"]];
  let pi = 0, closed = true, bridge = true, t = 0, run = 0;
  el.innerHTML = `<div class="chipset k8dc" role="group">${PR.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${p[0]} | ${p[1]}</button>`).join("")}</div>
    <div class="w-row"><button class="btn" id="k8dsw" aria-pressed="true">${L2("Open switch", "সুইচ খোলো")}</button><button class="btn" id="k8dbr" aria-pressed="true">${L2("Remove salt bridge", "লবণ সেতু সরাও")}</button></div>
    <div class="svgwrap fit" id="k8dsv"></div><div class="w-out" id="k8do"></div>`;
  const half = (m, ox) => { const q = MT[m]; const n = q[3]; return ox ? `${m} → ${q[1]} + ${n > 1 ? n : ""}e⁻` : `${q[1]} + ${n > 1 ? n : ""}e⁻ → ${m}`; };
  const cellEq = (a, c) => { const A = MT[a], C = MT[c]; const na = A[3], nc = C[3]; const l = na * nc / (na === nc ? na : 1); const ka = l / na, kc = l / nc; const co = (k, s) => (k > 1 ? k : "") + s; return `${co(ka, a)} + ${co(kc, C[1])} → ${co(ka, A[1])} + ${co(kc, c)}`; };
  const draw = () => {
    const [a, c] = PR[pi], flow = closed && bridge, V = (MT[c][2] - MT[a][2]);
    const wa = 18 - Math.min(8, run * 0.6), wc = 18 + Math.min(8, run * 0.6);
    let s = `<svg viewBox="0 0 400 300" role="img" aria-label="${L2("galvanic cell", "গ্যালভানিক কোষ")}">${arrowDefs("k8da", "var(--bad)")}
      <path d="M40 120 V270 H160 V120 M240 120 V270 H360 V120" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="42" y="140" width="116" height="128" fill="var(--c-soft)" opacity=".6"/><rect x="242" y="140" width="116" height="128" fill="${c === "Cu" ? "var(--c)" : "var(--c-soft)"}" opacity="${c === "Cu" ? .22 : .6}"/>
      <rect x="${100 - wa / 2}" y="90" width="${wa}" height="160" fill="${MT[a][4]}" opacity=".75"/><rect x="${300 - wc / 2}" y="90" width="${wc}" height="160" fill="${MT[c][4]}" opacity=".75"/>
      <path d="M100 90 V40 H180 M220 40 H300 V90" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="200" cy="40" r="14" fill="${flow ? "var(--note)" : "var(--paper)"}" opacity="${flow ? .9 : 1}" stroke="var(--ink)" stroke-width="2"/>
      ${flow ? `<circle cx="200" cy="40" r="26" fill="var(--note)" opacity=".25"/>` : ""}
      ${closed ? "" : `<path d="M180 40 l-14 -12" stroke="var(--ink)" stroke-width="2"/>`}
      <text x="100" y="284" font-size="13" text-anchor="middle" fill="var(--ink)">${a} | ${MT[a][1]}</text><text x="300" y="284" font-size="13" text-anchor="middle" fill="var(--ink)">${c} | ${MT[c][1]}</text>
      <text x="100" y="82" font-size="13" text-anchor="middle" font-weight="700" fill="var(--ink)">${L2("anode (−)", "অ্যানোড (−)")}</text><text x="300" y="82" font-size="13" text-anchor="middle" font-weight="700" fill="var(--ink)">${L2("cathode (+)", "ক্যাথোড (+)")}</text>`;
    if (bridge) s += `<path d="M138 200 V118 H262 V200" fill="none" stroke="var(--note)" stroke-width="18" stroke-linejoin="round" opacity=".35"/><text x="200" y="106" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("salt bridge (KCl)", "লবণ সেতু (KCl)")}</text>`;
    if (flow) {
      const path = u => { /* along wire from anode(100,90) up, across, down to cathode(300,90) */ const L1 = 50, L2_ = 200, L3 = 50, d = u * (L1 + L2_ + L3); if (d < L1) return [100, 90 - d]; if (d < L1 + L2_) return [100 + (d - L1), 40]; return [300, 40 + (d - L1 - L2_)]; };
      for (let i = 0; i < 8; i++) { const [x, y] = path(((i / 8) + t * 0.25) % 1); s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--bad)"/>`; }
      s += `<text x="140" y="30" font-size="13" fill="var(--bad)" font-weight="700">e⁻ →</text>`;
      const br = u => { const d = u * 288; if (d < 82) return [138, 200 - d]; if (d < 206) return [138 + d - 82, 118]; return [262, 118 + d - 206]; };
      for (let i = 0; i < 3; i++) { const [x, y] = br(((i / 3) + t * 0.12) % 1); s += `<text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle" fill="var(--c)" font-weight="700">K⁺</text>`; const [x2, y2] = br(1 - (((i / 3) + 0.15 + t * 0.12) % 1)); s += `<text x="${x2}" y="${y2 + 4}" font-size="11" text-anchor="middle" fill="var(--good)" font-weight="700">Cl⁻</text>`; }
      for (let i = 0; i < 3; i++) { const u = ((i / 3) + t * 0.3) % 1; s += `<text x="${100 - wa / 2 - 6 - u * 40}" y="${170 + i * 30}" font-size="12" text-anchor="end" fill="var(--ink)" opacity="${1 - u}">${MT[a][1]}</text><text x="${356 - u * (50 - wc / 2)}" y="${185 + i * 28}" font-size="12" text-anchor="end" fill="var(--ink)" opacity="${1 - u * 0.8}">${MT[c][1]}</text>`; }
    }
    s += `<text x="392" y="46" font-size="15" font-weight="700" text-anchor="end" fill="var(--ink)">${flow ? "≈ " + f8(V, 2) + " V" : "0 V"}</text></svg>`;
    $("#k8dsv", el).innerHTML = s;
    const why = !closed ? L2("The switch is open: no path for electrons, so no current.", "সুইচ খোলা: ইলেকট্রনের চলার পথ নেই, তাই প্রবাহ নেই।") : !bridge ? L2("Without the salt bridge the anode solution becomes positive and the cathode solution negative within moments, and the current stops.", "লবণ সেতু ছাড়া মুহূর্তেই অ্যানোডের দ্রবণ ধনাত্মক আর ক্যাথোডের দ্রবণ ঋণাত্মক হয়ে যায়, আর প্রবাহ থেমে যায়।") : L2(`${a} is higher (more reactive) in the electrochemical series, so it is oxidised and becomes the anode. Electrons flow through the wire from ${a} to ${c}; in the salt bridge Cl⁻ moves to the anode side and K⁺ to the cathode side.`, `তড়িৎ রাসায়নিক সারিতে ${a} ওপরে (বেশি সক্রিয়), তাই এটি জারিত হয়ে অ্যানোড হয়। তার দিয়ে ইলেকট্রন ${a} থেকে ${c}-এর দিকে যায়; লবণ সেতুতে Cl⁻ অ্যানোডের দিকে আর K⁺ ক্যাথোডের দিকে যায়।`);
    $("#k8do", el).innerHTML = L2(`<b>Anode (oxidation):</b> ${half(a, 1)}<br><b>Cathode (reduction):</b> ${half(c, 0)}<br><b>Cell:</b> ${cellEq(a, c)} &nbsp;(about ${f8(V, 2)} V under standard conditions)<br>${why}`,
      `<b>অ্যানোড (জারণ):</b> ${half(a, 1)}<br><b>ক্যাথোড (বিজারণ):</b> ${half(c, 0)}<br><b>কোষ:</b> ${cellEq(a, c)} &nbsp;(প্রমাণ অবস্থায় প্রায় ${f8(V, 2)} V)<br>${why}`);
  };
  chips8(el, ".k8dc", b => { pi = +b.dataset.i; run = 0; draw(); });
  $("#k8dsw", el).addEventListener("click", e => { closed = !closed; e.target.textContent = closed ? L2("Open switch", "সুইচ খোলো") : L2("Close switch", "সুইচ বন্ধ করো"); draw(); });
  $("#k8dbr", el).addEventListener("click", e => { bridge = !bridge; e.target.textContent = bridge ? L2("Remove salt bridge", "লবণ সেতু সরাও") : L2("Put salt bridge back", "লবণ সেতু ফিরিয়ে দাও"); draw(); });
  if (REDUCED) { t = 0.4; run = 6; }
  draw();
  if (!REDUCED) animate(el, dt => { if (closed && bridge) { t += dt; run += dt; draw(); } });
};

/* ============ 8.5 nuclear chain reaction ============ */
W.k8chain = (el) => {
  let mode = "u", gen = 3;
  el.innerHTML = `<div class="chipset k8nc" role="group"><button data-m="u" aria-pressed="true">${L2("Uncontrolled", "অনিয়ন্ত্রিত")}</button><button data-m="c" aria-pressed="false">${L2("Controlled (reactor)", "নিয়ন্ত্রিত (চুল্লি)")}</button></div>
    <div class="w-row"><button class="btn solid" id="k8nn">${L2("Next generation", "পরের প্রজন্ম")}</button><button class="btn" id="k8nr">${L2("Reset", "আবার শুরু")}</button></div>
    <div class="svgwrap fit" id="k8nsv"></div><div class="w-out" id="k8no"></div>`;
  const draw = () => {
    const rows = Math.min(gen, 4), rowY = g => 50 + g * 58;
    const HH = rowY(Math.min(gen, 5) - 1) + (gen > 4 ? 10 : 30);
    let s = `<svg viewBox="0 0 400 ${HH}" role="img" aria-label="${L2("chain reaction", "চেইন বিক্রিয়া")}">${arrowDefs("k8na", "var(--c)")}
      <text x="200" y="18" font-size="13" text-anchor="middle" fill="var(--ink)">²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n + ${L2("energy", "শক্তি")}</text>
      <line x1="200" y1="26" x2="200" y2="${rowY(0) - 14}" stroke="var(--c)" stroke-width="2" marker-end="url(#k8na)"/>`;
    let prev = [200];
    for (let g = 0; g < rows; g++) {
      const n = mode === "u" ? Math.pow(3, g) : 1, xs = mode === "u" ? Array.from({ length: n }, (_, i) => 200 + (i - (n - 1) / 2) * Math.min(60, 372 / n)) : [200];
      if (g > 0) {
        if (mode === "u") xs.forEach((x, i) => { const px = prev[Math.floor(i / 3)]; s += `<line x1="${px}" y1="${rowY(g - 1) + 10}" x2="${x}" y2="${rowY(g) - 10}" stroke="var(--c)" stroke-width="1.4"/>`; });
        else { s += `<line x1="200" y1="${rowY(g - 1) + 10}" x2="200" y2="${rowY(g) - 12}" stroke="var(--c)" stroke-width="1.6" marker-end="url(#k8na)"/>`;
          [-1, 1].forEach(d => { s += `<line x1="200" y1="${rowY(g - 1) + 10}" x2="${200 + d * 60}" y2="${rowY(g - 1) + 34}" stroke="var(--c)" stroke-width="1.4"/><rect x="${200 + d * 60 - 5}" y="${rowY(g - 1) + 26}" width="10" height="20" fill="var(--ink)" opacity=".7"/>`; }); }
      }
      const r = n > 9 ? 5 : 11;
      xs.forEach(x => { s += `<circle cx="${x}" cy="${rowY(g)}" r="${r}" fill="var(--bad)" opacity=".75"/>${r > 6 ? `<text x="${x}" y="${rowY(g) + 4}" font-size="10" text-anchor="middle" fill="var(--paper)" font-weight="700">U</text>` : ""}`; });
      s += `<text x="8" y="${rowY(g) + 4}" font-size="12" fill="var(--muted)">${B8(g + 1)}</text>`;
      prev = xs;
    }
    if (mode === "c" && rows > 1) s += `<text x="300" y="${rowY(0) + 40}" font-size="12" fill="var(--muted)">${L2("control rods absorb 2", "নিয়ন্ত্রক দণ্ড ২টি শোষণ করে")}</text>`;
    if (gen > 4) s += `<text x="200" y="${rowY(4) - 6}" font-size="14" text-anchor="middle" fill="var(--bad)" font-weight="700">… ${L2("generation", "প্রজন্ম")} ${B8(gen)}: ${mode === "u" ? f8(Math.pow(3, gen - 1)) : B8(1)} ${L2("fissions", "ফিশন")}</text>`;
    $("#k8nsv", el).innerHTML = s + `</svg>`;
    const now = mode === "u" ? Math.pow(3, gen - 1) : 1, tot = mode === "u" ? (Math.pow(3, gen) - 1) / 2 : gen, E = tot * 3.2e-11;
    $("#k8no", el).innerHTML = L2(`Generation ${B8(gen)}: <b>${f8(now)}</b> fission${now > 1 ? "s" : ""}; total so far ${f8(tot)} fission${tot > 1 ? "s" : ""} ≈ ${sci8(E)} J. ${mode === "u" ? "Each fission's 3 neutrons all cause new fissions, so the number triples every generation: an explosive chain." : "Control rods absorb 2 of the 3 neutrons, so exactly one causes the next fission: steady power, as in a reactor."}`,
      `প্রজন্ম ${B8(gen)}: <b>${f8(now)}</b>টি ফিশন; এ পর্যন্ত মোট ${f8(tot)}টি ফিশন ≈ ${sci8(E)} J। ${mode === "u" ? "প্রতিটি ফিশনের ৩টি নিউট্রনই নতুন ফিশন ঘটায়, তাই প্রতি প্রজন্মে সংখ্যা তিন গুণ হয়: বিস্ফোরক চেইন।" : "নিয়ন্ত্রক দণ্ড ৩টির মধ্যে ২টি নিউট্রন শোষণ করে, তাই ঠিক একটি পরের ফিশন ঘটায়: চুল্লির মতো স্থির শক্তি।"}`);
  };
  chips8(el, ".k8nc", b => { mode = b.dataset.m; gen = 1; draw(); });
  $("#k8nn", el).addEventListener("click", () => { if (gen < 12) gen++; draw(); });
  $("#k8nr", el).addEventListener("click", () => { gen = 1; draw(); });
  draw();
};
