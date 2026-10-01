/* ---- chemistry chapter 5 widgets: chemical bond ---- */
const B5 = x => bnNum(x, LANG);
const SUB5 = "₀₁₂₃₄₅₆₇₈₉", SUP5 = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const usub5 = s => String(s).replace(/\d/g, d => SUB5[d]);
const chg5 = q => q === 0 ? "" : (Math.abs(q) === 1 ? "" : String(Math.abs(q)).replace(/\d/g, d => SUP5[d])) + (q > 0 ? "⁺" : "⁻");
const chips5 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const gcd5 = (a, b) => b ? gcd5(b, a % b) : a;
const ok5 = t => `<b style="color:var(--good)">${t}</b>`, bad5 = t => `<b style="color:var(--bad)">${t}</b>`;
/* elements 1–20: symbol, English, Bangla */
const EL5 = [null, ["H", "Hydrogen", "হাইড্রোজেন"], ["He", "Helium", "হিলিয়াম"], ["Li", "Lithium", "লিথিয়াম"], ["Be", "Beryllium", "বেরিলিয়াম"], ["B", "Boron", "বোরন"],
  ["C", "Carbon", "কার্বন"], ["N", "Nitrogen", "নাইট্রোজেন"], ["O", "Oxygen", "অক্সিজেন"], ["F", "Fluorine", "ফ্লোরিন"], ["Ne", "Neon", "নিয়ন"],
  ["Na", "Sodium", "সোডিয়াম"], ["Mg", "Magnesium", "ম্যাগনেসিয়াম"], ["Al", "Aluminium", "অ্যালুমিনিয়াম"], ["Si", "Silicon", "সিলিকন"], ["P", "Phosphorus", "ফসফরাস"],
  ["S", "Sulfur", "সালফার"], ["Cl", "Chlorine", "ক্লোরিন"], ["Ar", "Argon", "আর্গন"], ["K", "Potassium", "পটাশিয়াম"], ["Ca", "Calcium", "ক্যালসিয়াম"]];
const nm5 = z => L2(EL5[z][1], EL5[z][2]);
const zOf5 = s => EL5.findIndex(e => e && e[0] === s);
/* shell filling for Z ≤ 20 (2, 8, 8, 2) */
const shells5 = n => { const cap = [2, 8, 8, 8], out = []; let left = n; for (let i = 0; i < 4 && left > 0; i++) { const k = Math.min(cap[i], left); out.push(k); left -= k; } return out; };
const NOBLE5 = { 2: ["He", "helium", "হিলিয়াম"], 10: ["Ne", "neon", "নিয়ন"], 18: ["Ar", "argon", "আর্গন"] };
const cfgTxt5 = sh => B5(sh.join(", "));
/* Bohr diagram: shells array; outer shell highlighted */
const bohr5 = (cx, cy, sh, o = {}) => {
  const r0 = o.r0 || 30, dr = o.dr || 24; let g = "";
  sh.forEach((n, i) => {
    const r = r0 + dr * i, outer = i === sh.length - 1;
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${outer && o.hl !== false ? "var(--c)" : "var(--rule)"}" stroke-width="${outer && o.hl !== false ? 2.2 : 1.4}"/>`;
    for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + 2 * Math.PI * k / n + (i % 2 ? 0.3 : 0);
      g += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="5" fill="${outer && o.hl !== false ? "var(--c)" : "var(--muted)"}" stroke="var(--sheet)" stroke-width="1"/>`; }
  });
  g += `<circle cx="${cx}" cy="${cy}" r="${r0 - 9}" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.2"/><text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="var(--ink)">${o.sym || ""}</text>`;
  return g;
};

/* ============ 5.1 valence electrons ============ */
W.k5valence = (el) => {
  el.innerHTML = `${slider("k5vz", L2("Atomic number Z", "পারমাণবিক সংখ্যা Z"), 1, 20, 1, 11, "")}
    <div class="svgwrap fit" id="k5vs"></div><div class="w-out" id="k5vo"></div>`;
  const draw = () => {
    const z = sv(el, "k5vz", ""), sh = shells5(z), v = sh[sh.length - 1], sym = EL5[z][0];
    const grp = z <= 2 ? (z === 1 ? 1 : 18) : (v <= 2 ? v : v + 10);
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("shells of ", "কক্ষপথ: ") + nm5(z)}">`;
    s += bohr5(150, 125, sh, { sym, r0: 30, dr: 24 });
    s += `<text x="352" y="30" text-anchor="end" font-size="16" font-weight="700" fill="var(--ink)">${nm5(z)}</text>`;
    s += `<text x="352" y="52" text-anchor="end" font-size="14" fill="var(--muted)">Z = ${B5(z)}</text>`;
    s += `<text x="352" y="215" text-anchor="end" font-size="14" fill="var(--c)">${L2("outer shell", "বাইরের কক্ষপথ")}</text><text x="352" y="235" text-anchor="end" font-size="14" fill="var(--c)" font-weight="700">${L2("valence e⁻ = ", "যোজ্যতা e⁻ = ")}${B5(v)}</text></svg>`;
    $("#k5vs", el).innerHTML = s;
    let tip;
    if (z === 2 || v === 8) tip = ok5(L2("Outer shell already full (noble gas): no need to bond.", "বাইরের কক্ষপথ আগে থেকেই পূর্ণ (নিষ্ক্রিয় গ্যাস): বন্ধনের দরকার নেই।"));
    else if (z === 1) tip = L2("Needs 1 more electron for a duet (2), like helium: it usually shares its 1 electron.", "হিলিয়ামের মতো দ্বিত্ব (২) পেতে আর ১টি দরকার: সাধারণত নিজের ১টি ইলেকট্রন ভাগাভাগি করে।");
    else if (v <= 3) tip = L2(`Easiest route: give away ${v} electron${v > 1 ? "s" : ""} → the shell below (full) becomes the outer shell.`, `সহজ পথ: ${B5(v)}টি ইলেকট্রন ছেড়ে দেওয়া → নিচের পূর্ণ কক্ষপথটি বাইরের কক্ষপথ হয়ে যায়।`);
    else if (v === 4) tip = L2("4 to give or 4 to take: it usually shares 4 electrons (4 bonds).", "৪টি দেওয়া বা ৪টি নেওয়া: সাধারণত ৪টি ইলেকট্রন ভাগাভাগি করে (৪টি বন্ধন)।");
    else tip = L2(`Needs ${8 - v} more for an octet: it takes or shares ${8 - v} electron${8 - v > 1 ? "s" : ""}.`, `অষ্টক পূর্ণ করতে আর ${B5(8 - v)}টি দরকার: ${B5(8 - v)}টি ইলেকট্রন নেয় বা ভাগাভাগি করে।`);
    $("#k5vo", el).innerHTML = `<b>${sym}</b> (${nm5(z)}): ${L2("shells", "কক্ষপথ")} ${cfgTxt5(sh)} · ${L2("group", "গ্রুপ")} ${B5(grp)}<br>${L2("Valence electrons", "যোজ্যতা ইলেকট্রন")}: <b>${B5(v)}</b><br>${tip}`;
  };
  el.querySelector("#k5vz").addEventListener("input", draw); draw();
};

/* ============ 5.4 criss-cross formula builder ============ */
W.k5criss = (el) => {
  const POS = [["Na", 1, "Sodium", "সোডিয়াম"], ["K", 1, "Potassium", "পটাশিয়াম"], ["NH₄", 1, "Ammonium", "অ্যামোনিয়াম", 1], ["Mg", 2, "Magnesium", "ম্যাগনেসিয়াম"], ["Ca", 2, "Calcium", "ক্যালসিয়াম"],
    ["Zn", 2, "Zinc", "জিংক"], ["Fe", 2, "Iron(II)", "আয়রন(II)", 0, "Fe(II)"], ["Fe", 3, "Iron(III)", "আয়রন(III)", 0, "Fe(III)"], ["Al", 3, "Aluminium", "অ্যালুমিনিয়াম"]];
  const NEG = [["Cl", 1, "chloride", "ক্লোরাইড"], ["OH", 1, "hydroxide", "হাইড্রোক্সাইড", 1], ["NO₃", 1, "nitrate", "নাইট্রেট", 1], ["O", 2, "oxide", "অক্সাইড"], ["S", 2, "sulfide", "সালফাইড"],
    ["SO₄", 2, "sulfate", "সালফেট", 1], ["CO₃", 2, "carbonate", "কার্বনেট", 1], ["PO₄", 3, "phosphate", "ফসফেট", 1], ["N", 3, "nitride", "নাইট্রাইড"]];
  const NOPE = ["NH₄|O", "NH₄|N", "Al|CO₃", "Fe(III)|CO₃"];
  let p = 8, n = 5, stage = 0, token = 0;
  const chip = (a, i, on) => `<button data-i="${i}" aria-pressed="${on}">${a[5] || a[0]} <small style="opacity:.7">${B5(a[1])}</small></button>`;
  el.innerHTML = `<div class="hint">${L2("Positive part (metal or positive radical) · valency", "ধনাত্মক অংশ (ধাতু বা ধনাত্মক যৌগমূলক) · যোজনী")}</div>
    <div class="chipset" id="k5cp" role="group">${POS.map((a, i) => chip(a, i, i === p)).join("")}</div>
    <div class="hint">${L2("Negative part (non-metal or negative radical) · valency", "ঋণাত্মক অংশ (অধাতু বা ঋণাত্মক যৌগমূলক) · যোজনী")}</div>
    <div class="chipset" id="k5cn" role="group">${NEG.map((a, i) => chip(a, i, i === n)).join("")}</div>
    <div class="svgwrap fit" id="k5cs"></div><div class="w-out" id="k5co"></div>
    <div class="w-row"><button class="btn" id="k5cstep">${L2("Next step", "পরের ধাপ")}</button><button class="btn" id="k5crep">${L2("Replay", "আবার দেখাও")}</button></div>`;
  const part = (sym, k, rad, showOne) => rad ? (k > 1 || showOne ? `(${sym})${usub5(k)}` : sym) : sym + (k > 1 || showOne ? usub5(k) : "");
  const draw = () => {
    const A = POS[p], Bn = NEG[n], a = A[1], b = Bn[1], g = gcd5(a, b), x = b / g, y = a / g;
    const raw = part(A[0], b, A[4], true) + part(Bn[0], a, Bn[4], true), fin = part(A[0], x, A[4], false) + part(Bn[0], y, Bn[4], false);
    let s = `<svg viewBox="0 0 360 210" role="img" aria-label="criss-cross">${arrowDefs("k5ca", "var(--c)")}`;
    s += `<text x="110" y="92" text-anchor="middle" font-size="34" font-weight="700" fill="var(--ink)">${A[0]}</text><text x="250" y="92" text-anchor="middle" font-size="34" font-weight="700" fill="var(--ink)">${Bn[0]}</text>`;
    s += `<text x="110" y="36" text-anchor="middle" font-size="22" font-weight="700" fill="var(--c)">${B5(a)}</text><text x="250" y="36" text-anchor="middle" font-size="22" font-weight="700" fill="var(--c)">${B5(b)}</text>`;
    s += `<text x="180" y="36" text-anchor="middle" font-size="13" fill="var(--muted)">${L2("valency", "যোজনী")}</text>`;
    if (stage >= 1) {
      s += `<path d="M118,42 C170,70 220,80 272,104" fill="none" stroke="var(--c)" stroke-width="2.2" marker-end="url(#k5ca)"/><path d="M242,42 C190,70 140,80 88,104" fill="none" stroke="var(--c)" stroke-width="2.2" marker-end="url(#k5ca)"/>`;
      s += `<text x="${A[0].length > 2 ? 150 : 138}" y="116" font-size="20" font-weight="700" fill="var(--c)">${B5(b)}</text><text x="${Bn[0].length > 2 ? 292 : 278}" y="116" font-size="20" font-weight="700" fill="var(--c)">${B5(a)}</text>`;
    }
    if (stage >= 1) s += `<text x="180" y="152" text-anchor="middle" font-size="22" fill="var(--muted)">${raw}${g > 1 && stage >= 2 ? "  → ÷" + B5(g) : ""}</text>`;
    if (stage >= 3) s += `<rect x="90" y="166" width="180" height="40" rx="10" fill="var(--c-soft)" stroke="var(--c)"/><text x="180" y="196" text-anchor="middle" font-size="28" font-weight="700" fill="var(--ink)">${fin}</text>`;
    $("#k5cs", el).innerHTML = s + "</svg>";
    const steps = [L2("Step 1: write the positive part first, then the negative part, each with its valency above.", "ধাপ ১: ধনাত্মক অংশ আগে, ঋণাত্মক অংশ পরে লেখো, প্রতিটির ওপরে যোজনী।"),
      L2(`Step 2: cross over. ${A[5] || A[0]} takes ${B5(b)}, ${Bn[0]} takes ${B5(a)}: ${raw}.`, `ধাপ ২: আড়াআড়ি নামাও। ${A[5] || A[0]} পায় ${B5(b)}, ${Bn[0]} পায় ${B5(a)}: ${raw}।`),
      g > 1 ? L2(`Step 3: both numbers divide by ${g}, so simplify to ${B5(x)} : ${B5(y)}.`, `ধাপ ৩: দুটি সংখ্যাই ${B5(g)} দিয়ে ভাগ যায়, তাই সরল করে ${B5(x)} : ${B5(y)}।`) : L2("Step 3: no common factor, nothing to simplify.", "ধাপ ৩: সাধারণ গুণনীয়ক নেই, সরল করার কিছু নেই।"),
      L2("Step 4: drop any 1; bracket a radical used 2 or more times.", "ধাপ ৪: ১ বাদ দাও; যৌগমূলক ২ বা বেশিবার লাগলে বন্ধনী দাও।")];
    let out = steps.slice(0, stage + 1).join("<br>");
    if (stage >= 3) {
      out += `<br><b>${L2(A[2] + " " + Bn[2], A[3] + " " + Bn[3])}: ${fin}</b><br>${L2("Check", "যাচাই")}: ${B5(a)} × ${B5(x)} = ${B5(b)} × ${B5(y)} = ${B5(a * x)} ✓`;
      if (NOPE.includes((A[5] || A[0]) + "|" + Bn[0])) out += `<br><span class="muted">${L2("Practice only: this compound is not a stable, everyday substance, but the formula method is the same.", "শুধু অনুশীলনের জন্য: এই যৌগটি স্থিতিশীল, পরিচিত পদার্থ নয়, তবে সংকেত লেখার নিয়ম একই।")}</span>`;
    }
    $("#k5co", el).innerHTML = out;
  };
  const play = () => { const my = ++token; stage = 0; draw(); if (REDUCED) { stage = 3; draw(); return; }
    const tick = () => { if (my !== token || !el.isConnected) return; if (stage < 3) { stage++; draw(); setTimeout(tick, 1100); } }; setTimeout(tick, 900); };
  chips5(el, "#k5cp", b => { p = +b.dataset.i; play(); });
  chips5(el, "#k5cn", b => { n = +b.dataset.i; play(); });
  $("#k5cstep", el).addEventListener("click", () => { token++; stage = (stage + 1) % 4; draw(); });
  $("#k5crep", el).addEventListener("click", play);
  play();
};

/* ============ 5.5 molecular vs structural formula ============ */
W.k5struct = (el) => {
  const VAL = { H: 1, C: 4, N: 3, O: 2 };
  const M = {
    H2O: ["H₂O", L2("water", "পানি"), [["O", 0, 0], ["H", -1.1, 0.8], ["H", 1.1, 0.8]], [[0, 1, 1], [0, 2, 1]]],
    NH3: ["NH₃", L2("ammonia", "অ্যামোনিয়া"), [["N", 0, 0], ["H", -1.2, 0.6], ["H", 1.2, 0.6], ["H", 0, 1.3]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]],
    CH4: ["CH₄", L2("methane", "মিথেন"), [["C", 0, 0], ["H", 0, -1.2], ["H", 1.3, 0], ["H", 0, 1.2], ["H", -1.3, 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]],
    CO2: ["CO₂", L2("carbon dioxide", "কার্বন ডাই-অক্সাইড"), [["C", 0, 0], ["O", -1.5, 0], ["O", 1.5, 0]], [[0, 1, 2], [0, 2, 2]]],
    N2: ["N₂", L2("nitrogen", "নাইট্রোজেন"), [["N", -0.8, 0], ["N", 0.8, 0]], [[0, 1, 3]]],
    C3H8: ["C₃H₈", L2("propane", "প্রোপেন"), [["C", -1.2, 0], ["C", 0, 0], ["C", 1.2, 0], ["H", -1.2, -1.1], ["H", -1.2, 1.1], ["H", -2.4, 0], ["H", 0, -1.1], ["H", 0, 1.1], ["H", 1.2, -1.1], ["H", 1.2, 1.1], ["H", 2.4, 0]],
      [[0, 1, 1], [1, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1], [1, 6, 1], [1, 7, 1], [2, 8, 1], [2, 9, 1], [2, 10, 1]]],
    ETH: ["C₂H₆O", L2("ethanol", "ইথানল"), [["C", -1.3, 0], ["C", 0, 0], ["O", 1.3, 0], ["H", 2.4, 0], ["H", -1.3, -1.1], ["H", -1.3, 1.1], ["H", -2.4, 0], ["H", 0, -1.1], ["H", 0, 1.1]],
      [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 4, 1], [0, 5, 1], [0, 6, 1], [1, 7, 1], [1, 8, 1]]],
    DME: ["C₂H₆O", L2("dimethyl ether", "ডাইমিথাইল ইথার"), [["C", -1.3, 0], ["O", 0, 0], ["C", 1.3, 0], ["H", -1.3, -1.1], ["H", -1.3, 1.1], ["H", -2.4, 0], ["H", 1.3, -1.1], ["H", 1.3, 1.1], ["H", 2.4, 0]],
      [[0, 1, 1], [1, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1], [2, 6, 1], [2, 7, 1], [2, 8, 1]]]
  };
  const keys = Object.keys(M); let k = "C3H8", count = false;
  el.innerHTML = `<div class="chipset" id="k5sm" role="group">${keys.map(q => `<button data-k="${q}" aria-pressed="${q === k}">${M[q][1]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k5ss"></div><div class="w-row"><button class="btn" id="k5sc" aria-pressed="false">${L2("Count bonds", "বন্ধন গোনো")}</button></div><div class="w-out" id="k5so"></div>`;
  const draw = () => {
    const [mf, name, at, bo] = M[k], S = 44, cx = 180, cy = 128;
    const P = at.map(a => [cx + a[1] * S, cy + a[2] * S]);
    let s = `<svg viewBox="0 0 360 230" role="img" aria-label="${name}"><text x="180" y="26" text-anchor="middle" font-size="16" fill="var(--muted)">${L2("Molecular formula", "আণবিক সংকেত")}: <tspan font-weight="700" fill="var(--ink)">${mf}</tspan></text>`;
    bo.forEach(([i, j, o]) => { const [x1, y1] = P[i], [x2, y2] = P[j], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d, px = -uy, py = ux;
      for (let q = 0; q < o; q++) { const off = (q - (o - 1) / 2) * 6;
        s += `<line x1="${(x1 + ux * 13 + px * off).toFixed(1)}" y1="${(y1 + uy * 13 + py * off).toFixed(1)}" x2="${(x2 - ux * 13 + px * off).toFixed(1)}" y2="${(y2 - uy * 13 + py * off).toFixed(1)}" stroke="var(--ink)" stroke-width="2.2"/>`; } });
    at.forEach((a, i) => { const [x, y] = P[i];
      s += `<text x="${x}" y="${y + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="${a[0] === "H" ? "var(--ink)" : "var(--c)"}">${a[0]}</text>`;
      if (count) { const nb = bo.reduce((t, [p, q, o]) => t + (p === i || q === i ? o : 0), 0), good = nb === VAL[a[0]];
        s += `<circle cx="${x + 14}" cy="${y - 14}" r="9" fill="${good ? "var(--good)" : "var(--bad)"}"/><text x="${x + 14}" y="${y - 9.5}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--sheet)">${B5(nb)}</text>`; } });
    $("#k5ss", el).innerHTML = s + "</svg>";
    const nbTot = bo.reduce((t, b) => t + b[2], 0), cnt = {};
    at.forEach(a => cnt[a[0]] = (cnt[a[0]] || 0) + 1);
    let out = `<b>${name}</b>: ${L2("molecular formula", "আণবিক সংকেত")} ${mf} → ${Object.entries(cnt).map(([e, c]) => B5(c) + " " + e).join(", ")}. `;
    out += L2(`The structural formula shows which atom is joined to which: ${nbTot} bond line${nbTot > 1 ? "s" : ""} in all.`, `গাঠনিক সংকেত দেখায় কোন পরমাণু কার সাথে যুক্ত: মোট ${B5(nbTot)}টি বন্ধন-রেখা।`);
    if (count) out += `<br>${L2("Green badge = lines at that atom equal its valency (C 4, N 3, O 2, H 1).", "সবুজ ব্যাজ = ওই পরমাণুর রেখার সংখ্যা তার যোজনীর সমান (C ৪, N ৩, O ২, H ১)।")}`;
    if (k === "ETH" || k === "DME") out += `<br><b>${L2("Ethanol and dimethyl ether have the SAME molecular formula, C₂H₆O, but different structures, so they are different substances.", "ইথানল আর ডাইমিথাইল ইথারের আণবিক সংকেত একই, C₂H₆O, কিন্তু গঠন আলাদা, তাই এরা ভিন্ন পদার্থ।")}</b>`;
    $("#k5so", el).innerHTML = out;
  };
  chips5(el, "#k5sm", b => { k = b.dataset.k; draw(); });
  $("#k5sc", el).addEventListener("click", e => { count = !count; e.currentTarget.setAttribute("aria-pressed", count); draw(); });
  draw();
};

/* ---------- Lewis / dot-and-cross molecules (5.6, 5.11) ---------- */
const EN5 = { H: 2.2, C: 2.6, N: 3.0, O: 3.4, F: 4.0, Cl: 3.2, B: 2.0, Be: 1.6 };
/* atoms: [sym, x, y, owner(0 = ×, 1 = •)], bonds: [a, b, order], lone: {atom: count}, la: {atom: [angles°]} for central atoms */
const LEW5 = {
  H2: { f: "H₂", atoms: [["H", -0.75, 0, 0], ["H", 0.75, 0, 1]], bonds: [[0, 1, 1]], lone: {} },
  Cl2: { f: "Cl₂", atoms: [["Cl", -0.85, 0, 0], ["Cl", 0.85, 0, 1]], bonds: [[0, 1, 1]], lone: { 0: 3, 1: 3 } },
  O2: { f: "O₂", atoms: [["O", -0.8, 0, 0], ["O", 0.8, 0, 1]], bonds: [[0, 1, 2]], lone: { 0: 2, 1: 2 } },
  N2: { f: "N₂", atoms: [["N", -0.8, 0, 0], ["N", 0.8, 0, 1]], bonds: [[0, 1, 3]], lone: { 0: 1, 1: 1 } },
  HCl: { f: "HCl", atoms: [["H", -0.85, 0, 1], ["Cl", 0.85, 0, 0]], bonds: [[0, 1, 1]], lone: { 1: 3 } },
  H2O: { f: "H₂O", atoms: [["O", 0, -0.2, 0], ["H", -1.15, 0.65, 1], ["H", 1.15, 0.65, 1]], bonds: [[0, 1, 1], [0, 2, 1]], lone: { 0: 2 }, la: { 0: [235, 305] }, dp: { 0: [0, 0.6] } },
  NH3: { f: "NH₃", atoms: [["N", 0, -0.25, 0], ["H", -1.25, 0.4, 1], ["H", 1.25, 0.4, 1], ["H", 0, 1.15, 1]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lone: { 0: 1 }, la: { 0: [270] }, dp: { 0: [0.62, -0.3], 3: [0.5, -0.12] } },
  CH4: { f: "CH₄", atoms: [["C", 0, 0, 0], ["H", 0, -1.3, 1], ["H", 1.35, 0, 1], ["H", 0, 1.3, 1], ["H", -1.35, 0, 1]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], lone: {} },
  CO2: { f: "CO₂", atoms: [["C", 0, 0, 0], ["O", -1.55, 0, 1], ["O", 1.55, 0, 1]], bonds: [[0, 1, 2], [0, 2, 2]], lone: { 1: 2, 2: 2 }, dp: { 0: [0, -0.6] } },
  CCl4: { f: "CCl₄", atoms: [["C", 0, 0, 0], ["Cl", 0, -1.45, 1], ["Cl", 1.5, 0, 1], ["Cl", 0, 1.45, 1], ["Cl", -1.5, 0, 1]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], lone: { 1: 3, 2: 3, 3: 3, 4: 3 } },
  BF3: { f: "BF₃", atoms: [["B", 0, 0.15, 0], ["F", 0, -1.3, 1], ["F", 1.3, 0.9, 1], ["F", -1.3, 0.9, 1]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lone: { 1: 3, 2: 3, 3: 3 } },
  BeCl2: { f: "BeCl₂", atoms: [["Be", 0, 0, 0], ["Cl", -1.55, 0, 1], ["Cl", 1.55, 0, 1]], bonds: [[0, 1, 1], [0, 2, 1]], lone: { 1: 3, 2: 3 } }
};
const loneAng5 = (m, i) => {
  if (m.la && m.la[i]) return m.la[i];
  const n = m.lone[i] || 0; if (!n) return [];
  const b = m.bonds.find(q => q[0] === i || q[1] === i), j = b[0] === i ? b[1] : b[0];
  const th = Math.atan2(m.atoms[i][2] - m.atoms[j][2], m.atoms[i][1] - m.atoms[j][1]) * 180 / Math.PI;
  return n === 1 ? [th] : n === 2 ? [th - 55, th + 55] : [th - 90, th, th + 90];
};
const mark5 = (x, y, owner, big) => owner === 0
  ? `<text x="${x.toFixed(1)}" y="${(y + 5.5).toFixed(1)}" text-anchor="middle" font-size="${big ? 17 : 16}" font-weight="700" fill="var(--bad)">×</text>`
  : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big ? 4 : 3.8}" fill="var(--c)"/>`;
/* mode: "dots" (dot-and-cross) or "lines"; opt.polar: shift shared pairs; opt.sel: highlighted atom */
const drawLew5 = (m, cx, cy, S, mode, opt = {}) => {
  const xs = m.atoms.map(a => a[1]), ys = m.atoms.map(a => a[2]), mx0 = (Math.min(...xs) + Math.max(...xs)) / 2, my0 = (Math.min(...ys) + Math.max(...ys)) / 2;
  if (!S) { const [bw, bh] = opt.box || [340, 190]; S = Math.min(82, bw / (Math.max(...xs) - Math.min(...xs) + 1.9), bh / (Math.max(...ys) - Math.min(...ys) + 1.7)); }
  const P = m.atoms.map(a => [cx + (a[1] - mx0) * S, cy + (a[2] - my0) * S]); let g = "";
  if (opt.sel != null) { const [x, y] = P[opt.sel]; g += `<circle cx="${x}" cy="${y}" r="${S * 0.82}" fill="none" stroke="var(--c)" stroke-width="2.2" stroke-dasharray="5 4"/>`; }
  m.bonds.forEach(([i, j, o]) => {
    const [x1, y1] = P[i], [x2, y2] = P[j], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d, px = -uy, py = ux;
    if (mode === "lines") {
      for (let q = 0; q < o; q++) { const off = (q - (o - 1) / 2) * 6, hl = opt.sel === i || opt.sel === j;
        g += `<line x1="${(x1 + ux * 14 + px * off).toFixed(1)}" y1="${(y1 + uy * 14 + py * off).toFixed(1)}" x2="${(x2 - ux * 14 + px * off).toFixed(1)}" y2="${(y2 - uy * 14 + py * off).toFixed(1)}" stroke="${hl ? "var(--c)" : "var(--ink)"}" stroke-width="${hl ? 3 : 2.2}"/>`; }
    } else {
      let t = 0.5; if (opt.polar) { const ea = EN5[m.atoms[i][0]], eb = EN5[m.atoms[j][0]], df = eb - ea; if (Math.abs(df) >= 0.5) t = 0.5 + Math.sign(df) * Math.min(0.12, Math.abs(df) * 0.09); }
      const mx = x1 + (x2 - x1) * t, my = y1 + (y2 - y1) * t;
      for (let q = 0; q < o; q++) { const off = (q - (o - 1) / 2) * 13, bx = mx + px * off, by = my + py * off;
        g += `<ellipse cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" rx="14" ry="8" transform="rotate(${(Math.atan2(uy, ux) * 180 / Math.PI).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)})" fill="var(--c-soft)" stroke="var(--rule)"/>`;
        g += mark5(bx - ux * 6, by - uy * 6, m.atoms[i][3]) + mark5(bx + ux * 6, by + uy * 6, m.atoms[j][3]); }
    }
  });
  m.atoms.forEach((a, i) => {
    const [x, y] = P[i];
    loneAng5(m, i).forEach(th => { const r = th * Math.PI / 180, R = a[0] === "H" ? 18 : 25, lx = x + R * Math.cos(r), ly = y + R * Math.sin(r), qx = -Math.sin(r) * 6, qy = Math.cos(r) * 6;
      g += mode === "lines" ? `<circle cx="${(lx + qx).toFixed(1)}" cy="${(ly + qy).toFixed(1)}" r="2.6" fill="var(--ink)"/><circle cx="${(lx - qx).toFixed(1)}" cy="${(ly - qy).toFixed(1)}" r="2.6" fill="var(--ink)"/>`
        : mark5(lx + qx, ly + qy, a[3]) + mark5(lx - qx, ly - qy, a[3]); });
    g += `<text x="${x}" y="${y + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="var(--ink)">${a[0]}</text>`;
    if (opt.hit) g += `<circle data-a="${i}" cx="${x}" cy="${y}" r="${Math.min(24, S * 0.55)}" fill="transparent" style="cursor:pointer" role="button" aria-label="${a[0]}"/>`;
  });
  if (opt.polar) {
    const q = m.atoms.map(() => 0);
    m.bonds.forEach(([i, j]) => { const df = EN5[m.atoms[j][0]] - EN5[m.atoms[i][0]]; if (Math.abs(df) >= 0.5) { q[i] += df > 0 ? 1 : -1; q[j] += df > 0 ? -1 : 1; } });
    const gx = xs.reduce((t, v) => t + v, 0) / xs.length, gy = ys.reduce((t, v) => t + v, 0) / ys.length;
    m.atoms.forEach((a, i) => { if (!q[i]) return; const [x, y] = P[i]; let dx, dy;
      if (m.dp && m.dp[i]) [dx, dy] = m.dp[i]; else { let ux = a[1] - gx, uy = a[2] - gy; const L = Math.hypot(ux, uy) || 1; dx = ux / L * 0.55; dy = uy / L * 0.55 - 0.45; }
      g += `<text x="${(x + dx * S).toFixed(1)}" y="${(y + dy * S + 6).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="700" fill="${q[i] > 0 ? "var(--note)" : "var(--c)"}">δ${q[i] > 0 ? "⁺" : "⁻"}</text>`; });
  }
  return g;
};
const pairs5 = (m, i) => { const b = m.bonds.reduce((t, [p, q, o]) => t + (p === i || q === i ? o : 0), 0); return [b, m.lone[i] || 0]; };

/* ============ 5.6 octet / duet counter ============ */
W.k5octet = (el) => {
  const keys = ["CH4", "NH3", "H2O", "CCl4", "BF3", "BeCl2"]; let k = "CH4", sel = 0;
  el.innerHTML = `<div class="chipset" id="k5om" role="group">${keys.map(q => `<button data-k="${q}" aria-pressed="${q === k}">${LEW5[q].f}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k5os"></div><p class="hint">${L2("Tap an atom to count the electrons around it (× and • are electrons from different atoms; shaded pairs are shared).", "কোনো পরমাণুতে চাপ দিয়ে তার চারপাশের ইলেকট্রন গোনো (× ও • ভিন্ন পরমাণুর ইলেকট্রন; রং করা জোড়াগুলো ভাগের)।")}</p><div class="w-out" id="k5oo"></div>`;
  const draw = () => {
    const m = LEW5[k];
    $("#k5os", el).innerHTML = `<svg viewBox="0 0 360 230" role="img" aria-label="${m.f}">${drawLew5(m, 180, 118, 0, "dots", { sel, hit: true, box: [330, 200] })}</svg>`;
    const a = m.atoms[sel][0], [b, l] = pairs5(m, sel), e = 2 * (b + l);
    let v;
    if (a === "H") v = ok5(L2("Duet: 2 electrons, like helium.", "দ্বিত্ব: হিলিয়ামের মতো ২টি ইলেকট্রন।"));
    else if (e === 8) v = ok5(L2("Octet: 8 electrons, like a noble gas.", "অষ্টক: নিষ্ক্রিয় গ্যাসের মতো ৮টি ইলেকট্রন।"));
    else v = `<b style="color:var(--note)">${L2(`Only ${e} electrons: NOT an octet. But they are in ${b + l} whole pairs, so the book's duet (pair) rule holds.`, `মাত্র ${B5(e)}টি ইলেকট্রন: অষ্টক নয়। তবে এগুলো ${B5(b + l)}টি পূর্ণ জোড়ায় আছে, তাই বইয়ের দুই-এর (জোড়ের) নিয়ম মানা হয়েছে।`)}</b>`;
    $("#k5oo", el).innerHTML = `${L2(`<b>${a}</b> in ${m.f}`, `${m.f}-এ <b>${a}</b>`)}: ${L2("shared pairs", "ভাগের জোড়")} ${B5(b)} (${B5(2 * b)} e⁻) + ${L2("lone pairs", "নিঃসঙ্গ জোড়")} ${B5(l)} (${B5(2 * l)} e⁻) = <b>${B5(e)}</b>${L2(" electrons", "টি ইলেকট্রন")}<br>${v}`;
  };
  chips5(el, "#k5om", b => { k = b.dataset.k; sel = 0; draw(); });
  $("#k5os", el).addEventListener("click", e => { const t = e.target.closest("[data-a]"); if (t) { sel = +t.dataset.a; draw(); } });
  draw();
};

/* ============ 5.9 cation / anion maker ============ */
W.k5ion = (el) => {
  const LIST = [3, 11, 19, 12, 20, 13, 7, 8, 9, 16, 17];
  let z = 11, u = 0, done = false, token = 0;
  el.innerHTML = `<div class="chipset" id="k5ie" role="group">${LIST.map(q => `<button data-z="${q}" aria-pressed="${q === z}">${EL5[q][0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k5is"></div><div class="w-row"><button class="btn solid" id="k5ib"></button><button class="btn" id="k5ir">${L2("Reset", "আবার শুরু")}</button></div><div class="w-out" id="k5io"></div>`;
  const info = () => { const sh = shells5(z), v = sh[sh.length - 1], metal = v <= 3; return { sh, v, metal, d: metal ? -v : 8 - v }; };
  const draw = () => {
    const { sh, v, metal, d } = info(), cx = 170, cy = 125, r0 = 30, dr = 24, sym = EL5[z][0], nOut = sh.length - 1, R = r0 + dr * nOut;
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${nm5(z)}">`;
    sh.forEach((n, i) => { if (i === nOut) return; const r = r0 + dr * i, last = i === nOut - 1 && metal && u >= 1;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${last ? "var(--c)" : "var(--rule)"}" stroke-width="${last ? 2.2 : 1.4}"/>`;
      for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + 2 * Math.PI * k / n + (i % 2 ? 0.3 : 0);
        s += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="5" fill="${last ? "var(--c)" : "var(--muted)"}"/>`; } });
    const ringOp = metal ? Math.max(0, 1 - u) : 1;
    if (ringOp > 0) s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--c)" stroke-width="2.2" opacity="${ringOp.toFixed(2)}" ${metal && u > 0 ? 'stroke-dasharray="6 5"' : ""}/>`;
    if (metal) {
      for (let k = 0; k < v; k++) { const a = -Math.PI / 2 + 2 * Math.PI * k / v, rr = R + 130 * u, op = 1 - u;
        if (op > 0.02) s += `<circle cx="${(cx + rr * Math.cos(a)).toFixed(1)}" cy="${(cy + rr * Math.sin(a)).toFixed(1)}" r="5.5" fill="var(--bad)" opacity="${op.toFixed(2)}"/>`; }
    } else {
      const slot = q => -Math.PI / 2 + 2 * Math.PI * q / 8, used = [];
      for (let k = 0; k < v; k++) { const q = Math.round(k * 8 / v) % 8; used.push(q); const a0 = -Math.PI / 2 + 2 * Math.PI * k / v, a1 = slot(q), a = a0 + (a1 - a0) * u;
        s += `<circle cx="${(cx + R * Math.cos(a)).toFixed(1)}" cy="${(cy + R * Math.sin(a)).toFixed(1)}" r="5" fill="var(--c)"/>`; }
      const free = [0, 1, 2, 3, 4, 5, 6, 7].filter(q => !used.includes(q));
      free.slice(0, d).forEach(q => { const a = slot(q), rr = R + 130 * (1 - u);
        if (u > 0) s += `<circle cx="${(cx + rr * Math.cos(a)).toFixed(1)}" cy="${(cy + rr * Math.sin(a)).toFixed(1)}" r="5.5" fill="var(--note)" stroke="var(--ink)" stroke-width="1" opacity="${Math.min(1, u * 2).toFixed(2)}"/>`; });
    }
    const q = done ? -d : 0, lab = sym + (done ? chg5(metal ? v : -(8 - v)) : "");
    s += `<circle cx="${cx}" cy="${cy}" r="${r0 - 9}" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.2"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">+${B5(z)}</text>`;
    s += `<text x="352" y="32" text-anchor="end" font-size="26" font-weight="700" fill="${done ? (metal ? "var(--note)" : "var(--c)") : "var(--ink)"}">${lab}</text>`;
    const e = z + (done ? d : 0);
    s += `<text x="352" y="200" text-anchor="end" font-size="14" fill="var(--muted)">${L2("protons", "প্রোটন")} ${B5(z)}</text><text x="352" y="220" text-anchor="end" font-size="14" fill="var(--muted)">${L2("electrons", "ইলেকট্রন")} ${B5(e)}</text>`;
    s += `<text x="352" y="240" text-anchor="end" font-size="14" font-weight="700" fill="var(--ink)">${L2("charge", "আধান")} ${done ? (q > 0 ? "+" : "−") + B5(Math.abs(q)) : B5(0)}</text></svg>`;
    $("#k5is", el).innerHTML = s;
    $("#k5ib", el).textContent = metal ? L2(`Remove ${v} electron${v > 1 ? "s" : ""}`, `${B5(v)}টি ইলেকট্রন সরাও`) : L2(`Add ${8 - v} electron${8 - v > 1 ? "s" : ""}`, `${B5(8 - v)}টি ইলেকট্রন যোগ করো`);
    $("#k5ib", el).disabled = done || u > 0;
    const shN = metal ? sh.slice(0, -1) : sh.slice(0, -1).concat([8]), eN = shN.reduce((t, x) => t + x, 0), ng = NOBLE5[eN];
    let out = `<b>${sym}</b> (${nm5(z)}): ${cfgTxt5(sh)} · ${metal ? L2("metal: few outer electrons, low ionization energy", "ধাতু: বাইরের ইলেকট্রন কম, আয়নিকরণ শক্তি কম") : L2("non-metal: nearly full outer shell, high electron affinity", "অধাতু: বাইরের কক্ষপথ প্রায় পূর্ণ, ইলেকট্রন আসক্তি বেশি")}`;
    if (done) out += `<br>${metal ? `${sym} → ${lab} + ${v > 1 ? v : ""}e⁻` : `${sym} + ${8 - v > 1 ? 8 - v : ""}e⁻ → ${lab}`}<br>${metal ? L2("Cation", "ক্যাটায়ন") : L2("Anion", "অ্যানায়ন")} <b>${lab}</b>: ${cfgTxt5(shN)}, ${L2("the same arrangement as", "বিন্যাস একই রকম:")} <b>${L2(ng[1], ng[2])} (${ng[0]})</b>. ${L2("The nucleus (+" + z + ") did not change.", "নিউক্লিয়াস (+" + B5(z) + ") বদলায়নি।")}`;
    $("#k5io", el).innerHTML = out;
  };
  const go = () => { if (done || u > 0) return; const my = ++token;
    if (REDUCED) { u = 1; done = true; draw(); return; }
    animate(el, dt => { if (my !== token || done) return; u = Math.min(1, u + dt * 0.8); if (u >= 1) done = true; draw(); }); };
  const reset = () => { token++; u = 0; done = false; draw(); };
  chips5(el, "#k5ie", b => { z = +b.dataset.z; reset(); });
  $("#k5ib", el).addEventListener("click", go); $("#k5ir", el).addEventListener("click", reset);
  draw();
};

/* ============ 5.10 ionic bond: electron transfer ============ */
W.k5ionic = (el) => {
  /* atoms: [sym, x, metal?, outer e⁻], transfers: [from, to] per electron */
  const C = {
    NaCl: ["NaCl", [["Na", 110, 1, 1], ["Cl", 280, 0, 7]], [[0, 1]]],
    MgO: ["MgO", [["Mg", 110, 1, 2], ["O", 280, 0, 6]], [[0, 1], [0, 1]]],
    CaO: ["CaO", [["Ca", 110, 1, 2], ["O", 280, 0, 6]], [[0, 1], [0, 1]]],
    NaH: ["NaH", [["Na", 110, 1, 1], ["H", 270, 0, 1]], [[0, 1]]],
    CaCl2: ["CaCl₂", [["Cl", 62, 0, 7], ["Ca", 200, 1, 2], ["Cl", 338, 0, 7]], [[1, 0], [1, 2]]],
    Na2O: ["Na₂O", [["Na", 62, 1, 1], ["O", 200, 0, 6], ["Na", 338, 1, 1]], [[0, 1], [2, 1]]]
  };
  const keys = Object.keys(C); let k = "NaCl", stage = 0, u = 0, token = 0;
  el.innerHTML = `<div class="chipset" id="k5xm" role="group">${keys.map(q => `<button data-k="${q}" aria-pressed="${q === k}">${C[q][0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k5xs"></div>
    <div class="w-row"><button class="btn solid" id="k5xp">${L2("Play", "চালাও")}</button><button class="btn" id="k5xn">${L2("Step", "ধাপে ধাপে")}</button><button class="btn" id="k5xr">${L2("Reset", "আবার শুরু")}</button></div>
    <div class="w-out" id="k5xo"></div>`;
  const cy = 112;
  const geo = () => {
    const [f, A, T] = C[k];
    const pos = (a, deg, R) => [a[1] + R * Math.cos(deg * Math.PI / 180), cy + R * Math.sin(deg * Math.PI / 180)];
    const angd = (x, y) => { const d = Math.abs(((x - y) % 360 + 540) % 360 - 180); return d; };
    /* non-metal slots: incoming electrons take the slots facing their donor; own electrons fill the rest */
    const own = A.map(() => []), land = [];
    A.forEach((a, j) => {
      if (a[2]) return;
      const inc = T.map((t, n) => [t, n]).filter(([t]) => t[1] === j);
      const dir = n => (A[T[n][0]][1] < a[1] ? 180 : 0);
      let slots;
      if (a[0] === "H") { const d0 = dir(inc[0][1]); slots = [d0 - 14, d0 + 14]; }
      else { slots = []; [-90, 0, 90, 180].forEach(d => { slots.push(d - 13, d + 13); }); }
      const taken = new Set();
      inc.forEach(([t, n]) => { let best = -1, bd = 1e9; slots.forEach((sl, q) => { if (taken.has(q)) return; const d = angd(sl, dir(n)); if (d < bd) { bd = d; best = q; } }); taken.add(best); land[n] = pos(a, slots[best], 36); });
      own[j] = slots.filter((sl, q) => !taken.has(q)).slice(0, a[3]).map(sl => pos(a, sl, 36));
    });
    const fly = T.map(([i, j], n) => {
      const a = A[i], b = A[j], toward = b[1] > a[1] ? 0 : 180, sameFrom = T.filter(t => t[0] === i), idx = sameFrom.indexOf(T[n]), spread = sameFrom.length > 1 && sameFrom.every(t => t[1] === j) ? (idx ? 18 : -18) : 0;
      return [pos(a, toward + spread, 28), land[n]]; });
    return { f, A, T, fly, own };
  };
  const draw = () => {
    const { A, T, fly, own } = geo();
    let s = `<svg viewBox="0 0 400 225" role="img" aria-label="${C[k][0]}">${arrowDefs("k5xa", "var(--ink)")}`;
    A.forEach((a, i) => {
      const R = a[2] ? 28 : 36, ion = stage >= 2, lost = T.filter(t => t[0] === i).length, got = T.filter(t => t[1] === i).length;
      s += `<circle cx="${a[1]}" cy="${cy}" r="${R}" fill="${ion && a[2] ? "none" : "var(--paper)"}" stroke="${a[2] ? "var(--bad)" : "var(--c)"}" stroke-width="2" ${ion && a[2] ? 'stroke-dasharray="5 5" opacity=".45"' : ""}/>`;
      s += `<text x="${a[1]}" y="${cy + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="var(--ink)">${a[0]}</text>`;
      if (!a[2]) own[i].forEach(([x, y]) => { s += mark5(x, y, 1, true); });
      if (ion) { const q = a[2] ? lost : -got, bx = R + 10;
        s += `<path d="M${a[1] - bx + 6},${cy - R - 8} h-6 v${2 * R + 16} h6 M${a[1] + bx - 6},${cy - R - 8} h6 v${2 * R + 16} h-6" fill="none" stroke="var(--ink)" stroke-width="1.6"/>`;
        s += `<text x="${a[1] + bx + 3}" y="${cy - R - 2}" font-size="17" font-weight="700" fill="${q > 0 ? "var(--bad)" : "var(--c)"}">${chg5(q)}</text>`;
        const e = zOf5(a[0]) - q, sh = shells5(e), ng = NOBLE5[e];
        s += `<text x="${a[1]}" y="${cy + R + 36}" text-anchor="middle" font-size="13" fill="var(--muted)">${cfgTxt5(sh)}${ng ? " (" + ng[0] + ")" : ""}</text>`; }
    });
    fly.forEach(([p0, p1]) => { const t = stage === 0 ? 0 : stage === 1 ? u : 1, x = p0[0] + (p1[0] - p0[0]) * t, y = p0[1] + (p1[1] - p0[1]) * t - Math.sin(Math.PI * t) * 40;
      if (stage === 0 || (stage === 1 && u < 1)) s += `<path d="M${p0[0]},${p0[1]} Q${(p0[0] + p1[0]) / 2},${Math.min(p0[1], p1[1]) - 80} ${p1[0]},${p1[1]}" fill="none" stroke="var(--bad)" stroke-width="1" stroke-dasharray="3 4" opacity=".5"/>`;
      s += mark5(x, y, 0, true); });
    if (stage >= 3) { for (let i = 0; i < A.length - 1; i++) { const x1 = A[i][1] + (A[i][2] ? 42 : 50), x2 = A[i + 1][1] - (A[i + 1][2] ? 42 : 50);
        const xm = (x1 + x2) / 2; s += `<line x1="${x1}" y1="${cy}" x2="${xm - 3}" y2="${cy}" stroke="var(--ink)" stroke-width="2" marker-end="url(#k5xa)"/><line x1="${x2}" y1="${cy}" x2="${xm + 3}" y2="${cy}" stroke="var(--ink)" stroke-width="2" marker-end="url(#k5xa)"/>`; }
      s += `<text x="200" y="24" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">${L2("electrostatic attraction = ionic bond", "স্থির বৈদ্যুতিক আকর্ষণ = আয়নিক বন্ধন")}</text>`; }
    $("#k5xs", el).innerHTML = s + "</svg>";
    /* text */
    const metals = A.filter(a => a[2]), nons = A.filter(a => !a[2]), lost = T.length;
    const eqs = [];
    const mm = metals[0][0], mv = metals[0][3], nn = nons[0][0], ng = nons[0][0] === "H" ? 1 : 8 - nons[0][3];
    eqs.push(`${metals.length > 1 ? "2" : ""}${mm} → ${metals.length > 1 ? "2" : ""}${mm}${chg5(mv)} + ${lost > 1 ? lost : ""}e⁻`);
    eqs.push(`${nons.length > 1 ? "2" : ""}${nn} + ${lost > 1 ? lost : ""}e⁻ → ${nons.length > 1 ? "2" : ""}${nn}${chg5(-ng)}`);
    const msg = [L2("Crosses (×) are the metal's outer electrons; dots (•) are the non-metal's.", "ক্রস (×) ধাতুর বাইরের ইলেকট্রন; ডট (•) অধাতুর।"),
      L2("The metal transfers its outer electron(s) to the non-metal…", "ধাতু তার বাইরের ইলেকট্রন অধাতুকে স্থানান্তর করছে…"),
      L2("Ions formed: each now has a noble-gas arrangement (shown below each ion).", "আয়ন তৈরি হয়েছে: প্রতিটির এখন নিষ্ক্রিয় গ্যাসের বিন্যাস (প্রতিটি আয়নের নিচে দেখানো)।"),
      L2("Opposite charges attract: this electrostatic force is the ionic bond.", "বিপরীত আধান পরস্পরকে আকর্ষণ করে: এই স্থির বৈদ্যুতিক বলই আয়নিক বন্ধন।")][stage];
    let out = msg;
    if (stage >= 2) out += `<br>${eqs.join("<br>")}<br>${L2("Electrons lost", "হারানো ইলেকট্রন")} = ${B5(lost)} · ${L2("electrons gained", "পাওয়া ইলেকট্রন")} = ${B5(lost)} ✓ → <b>${C[k][0]}</b>`;
    $("#k5xo", el).innerHTML = out;
  };
  const run = (auto) => { const my = ++token;
    if (stage === 0) stage = 1, u = 0;
    if (REDUCED) { u = 1; if (stage === 1) stage = auto ? 3 : 2; else if (stage < 3) stage++; draw(); return; }
    animate(el, dt => { if (my !== token) return; if (stage === 1) { u = Math.min(1, u + dt * 0.7); if (u >= 1) { stage = 2; if (!auto) token++; } }
      else if (auto && stage === 2) { u += dt; if (u > 1.9) { stage = 3; token++; } } draw(); }); };
  $("#k5xp", el).addEventListener("click", () => { if (stage >= 3) { stage = 0; u = 0; } run(true); });
  $("#k5xn", el).addEventListener("click", () => { if (stage === 0) run(false); else { token++; stage = stage >= 3 ? 0 : stage + 1; u = stage === 1 ? 1 : 0; if (stage === 1) stage = 2; draw(); } });
  $("#k5xr", el).addEventListener("click", () => { token++; stage = 0; u = 0; draw(); });
  chips5(el, "#k5xm", b => { k = b.dataset.k; token++; stage = 0; u = 0; draw(); });
  draw();
};

/* ============ 5.11 covalent dot-and-cross + polarity ============ */
W.k5covalent = (el) => {
  const keys = ["H2", "Cl2", "O2", "N2", "HCl", "H2O", "NH3", "CH4", "CO2"]; let k = "H2O", polar = false;
  const NAME = { H2: L2("hydrogen", "হাইড্রোজেন"), Cl2: L2("chlorine", "ক্লোরিন"), O2: L2("oxygen", "অক্সিজেন"), N2: L2("nitrogen", "নাইট্রোজেন"), HCl: L2("hydrogen chloride", "হাইড্রোজেন ক্লোরাইড"),
    H2O: L2("water", "পানি"), NH3: L2("ammonia", "অ্যামোনিয়া"), CH4: L2("methane", "মিথেন"), CO2: L2("carbon dioxide", "কার্বন ডাই-অক্সাইড") };
  const MPOL = { HCl: 1, H2O: 1, NH3: 1 };
  el.innerHTML = `<div class="chipset" id="k5km" role="group">${keys.map(q => `<button data-k="${q}" aria-pressed="${q === k}">${LEW5[q].f}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k5ks"></div>
    <div class="w-row"><button class="btn" id="k5kp" aria-pressed="false">${L2("Polarity (δ⁺ / δ⁻)", "পোলারিটি (δ⁺ / δ⁻)")}</button></div><div class="w-out" id="k5ko"></div>`;
  const draw = () => {
    const m = LEW5[k];
    let s = `<svg viewBox="0 0 360 230" role="img" aria-label="${m.f}">${drawLew5(m, 180, 112, 0, "dots", { polar, box: [340, 190] })}`;
    const s0 = m.atoms[0][0], s1 = m.atoms.find(a => a[3] === 1)[0];
    s += `<text x="10" y="222" font-size="13" fill="var(--muted)">${s0 === s1 ? L2("× and • : electrons from the two different atoms", "× ও • : দুটি আলাদা পরমাণুর ইলেকট্রন") : L2(`× electrons of ${s0}   • electrons of ${s1}`, `× ${s0}-এর ইলেকট্রন   • ${s1}-এর ইলেকট্রন`)}</text></svg>`;
    $("#k5ks", el).innerHTML = s;
    const shared = m.bonds.reduce((t, b) => t + b[2], 0), lone = Object.values(m.lone).reduce((t, x) => t + x, 0);
    const kind = m.bonds.map(b => b[2]).includes(3) ? L2("triple bond (≡)", "ত্রিবন্ধন (≡)") : m.bonds.map(b => b[2]).includes(2) ? L2("double bonds (=)", "দ্বিবন্ধন (=)") : L2("single bonds (–)", "একবন্ধন (–)");
    let out = `<b>${m.f}</b> (${NAME[k]}): ${B5(shared)}${L2(" shared pair(s)", "টি ভাগের জোড়")}, ${B5(lone)}${L2(" lone pair(s)", "টি নিঃসঙ্গ জোড়")}; ${kind}.<br>`;
    out += m.atoms.map((a, i) => { const [b, l] = pairs5(m, i); return `${a[0]}: ${B5(2 * (b + l))}`; }).filter((x, i, arr) => arr.indexOf(x) === i).join(" · ") + L2(" electrons around each atom (H: duet 2, others: octet 8)", "টি করে ইলেকট্রন প্রতিটি পরমাণুর চারপাশে (H: দ্বিত্ব ২, বাকিরা: অষ্টক ৮)");
    if (polar) {
      const seen = {}; const bl = [];
      m.bonds.forEach(([i, j]) => { const a = m.atoms[i][0], b = m.atoms[j][0], key = [a, b].sort().join("–"); if (seen[key]) return; seen[key] = 1;
        const df = Math.abs(EN5[a] - EN5[b]); bl.push(`${a}–${b}: |${B5(EN5[a].toFixed(1))} − ${B5(EN5[b].toFixed(1))}| = ${B5(df.toFixed(1))} → ${df >= 0.5 ? L2("polar", "পোলার") : df > 0 ? L2("almost non-polar", "প্রায় অপোলার") : L2("non-polar", "অপোলার")}`); });
      out += `<br>${L2("Electronegativity difference", "তড়িৎ ঋণাত্মকতার পার্থক্য")}: ${bl.join("; ")}`;
      out += `<br>${MPOL[k] ? L2("The shared pairs are pulled toward the more electronegative atom: the molecule is polar.", "ভাগের জোড়াগুলো বেশি তড়িৎ ঋণাত্মক পরমাণুর দিকে টানা: অণুটি পোলার।") : k === "CO2" ? L2("Each C=O bond is polar, but the two pulls are equal and opposite in the straight molecule, so CO₂ as a whole is non-polar.", "প্রতিটি C=O বন্ধন পোলার, কিন্তু সোজা অণুতে দুটি টান সমান ও বিপরীত, তাই সামগ্রিকভাবে CO₂ অপোলার।") : L2("Equal (or nearly equal) sharing: the molecule is non-polar.", "সমান (বা প্রায় সমান) ভাগাভাগি: অণুটি অপোলার।")}`;
    }
    $("#k5ko", el).innerHTML = out;
  };
  chips5(el, "#k5km", b => { k = b.dataset.k; draw(); });
  $("#k5kp", el).addEventListener("click", e => { polar = !polar; e.currentTarget.setAttribute("aria-pressed", polar); draw(); });
  draw();
};

/* ============ 5.12 ionic vs covalent: bulb test ============ */
W.k5props = (el) => {
  /* [label en, label bn, formula, ionic?, m.p. °C, soluble?, ions [cation, anion, anions per cation], note] */
  const S = [
    ["Common salt", "খাবার লবণ", "NaCl", 1, 801, 1, ["Na⁺", "Cl⁻", 1]],
    ["Potassium chloride", "পটাশিয়াম ক্লোরাইড", "KCl", 1, 770, 1, ["K⁺", "Cl⁻", 1]],
    ["Calcium chloride", "ক্যালসিয়াম ক্লোরাইড", "CaCl₂", 1, 772, 1, ["Ca²⁺", "Cl⁻", 2]],
    ["Sugar (sucrose)", "চিনি (সুক্রোজ)", "C₁₂H₂₂O₁₁", 0, 186, 1, null, "dec"],
    ["Glucose", "গ্লুকোজ", "C₆H₁₂O₆", 0, 146, 1, null],
    ["Naphthalene", "ন্যাপথালিন", "C₁₀H₈", 0, 80, 0, null],
    ["Hydrogen chloride", "হাইড্রোজেন ক্লোরাইড", "HCl", 0, -114, 1, ["H⁺", "Cl⁻", 1], "hcl"]];
  const COND = [["solid", L2("Solid", "কঠিন")], ["molten", L2("Melted (liquid)", "গলিত (তরল)")], ["water", L2("Dissolved in water", "পানিতে দ্রবীভূত")]];
  let si = 0, cond = "water", parts = [], t = 0;
  el.innerHTML = `<div class="chipset" id="k5ps" role="group">${S.map((x, i) => `<button data-i="${i}" aria-pressed="${i === si}">${L2(x[0], x[1])}</button>`).join("")}</div>
    <div class="hint">${L2("Condition", "অবস্থা")}</div><div class="chipset" id="k5pc" role="group">${COND.map(c => `<button data-c="${c[0]}" aria-pressed="${c[0] === cond}">${c[1]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k5pv"></div><div class="w-out" id="k5po"></div><div id="k5pt" style="overflow-x:auto"></div>`;
  const conducts = (x, c) => x[3] ? c !== "solid" : (x[7] === "hcl" && c === "water");
  const mobileIons = (x, c) => conducts(x, c);
  const setup = () => {
    const x = S[si]; parts = [];
    const R = (() => { let q = si * 31 + cond.length * 7 + 5; return () => (q = (q * 16807) % 2147483647) / 2147483647; })();
    if (x[3] && cond === "solid") { for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) parts.push({ x: 128 + c * 21, y: 178 + r * 17, q: (r + c) % 2 ? -1 : 1, fixed: 1 }); }
    else if (mobileIons(x, cond)) { const per = x[6][2]; for (let n = 0; n < 7; n++) { parts.push({ x: 110 + R() * 140, y: 170 + R() * 60, q: 1 }); for (let m = 0; m < per; m++) parts.push({ x: 110 + R() * 140, y: 170 + R() * 60, q: -1 }); }
      if (x[7] === "hcl") for (let n = 0; n < 6; n++) parts.push({ x: 110 + R() * 140, y: 170 + R() * 60, q: 0, w: 1 }); }
    else if (!x[3] && cond === "solid") { for (let n = 0; n < 12; n++) parts.push({ x: 130 + (n % 6) * 20, y: 200 + Math.floor(n / 6) * 16, q: 0, fixed: 1 }); }
    else if (cond === "water" && !x[5]) { for (let n = 0; n < 7; n++) parts.push({ x: 140 + n * 14 + R() * 6, y: 226 + R() * 6, q: 0, fixed: 1, lump: 1 }); }
    else { for (let n = 0; n < 12; n++) parts.push({ x: 110 + R() * 140, y: 170 + R() * 60, q: 0 }); }
    parts.forEach(p => { p.vx = 0; p.vy = 0; });
  };
  const draw = () => {
    const x = S[si], on = conducts(x, cond), liquid = cond !== "solid";
    let s = `<svg viewBox="0 0 360 260" role="img" aria-label="${L2("conductivity test", "বিদ্যুৎ পরিবাহিতা পরীক্ষা")}">`;
    /* wires, battery, bulb */
    s += `<path d="M130,150 V40 H150 M172,40 H235 M265,40 H290 V110 H230 V150" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    s += `<line x1="150" y1="26" x2="150" y2="54" stroke="var(--ink)" stroke-width="2.5"/><line x1="157" y1="33" x2="157" y2="47" stroke="var(--ink)" stroke-width="5"/><line x1="165" y1="26" x2="165" y2="54" stroke="var(--ink)" stroke-width="2.5"/><line x1="172" y1="33" x2="172" y2="47" stroke="var(--ink)" stroke-width="5"/>`;
    s += `<text x="146" y="20" text-anchor="end" font-size="14" font-weight="700" fill="var(--ink)">+</text><text x="176" y="20" font-size="14" font-weight="700" fill="var(--ink)">−</text><text x="160" y="70" text-anchor="middle" font-size="12" fill="var(--muted)">${L2("battery", "ব্যাটারি")}</text>`;
    if (on) for (let r = 0; r < 8; r++) { const a = r * Math.PI / 4; s += `<line x1="${250 + 20 * Math.cos(a)}" y1="${40 + 20 * Math.sin(a)}" x2="${250 + 30 * Math.cos(a)}" y2="${40 + 30 * Math.sin(a)}" stroke="var(--note)" stroke-width="2.5"/>`; }
    s += `<circle cx="250" cy="40" r="15" fill="${on ? "var(--note)" : "var(--paper)"}" stroke="var(--ink)" stroke-width="2"/><path d="M243,46 l4,-10 l3,8 l3,-8 l4,10" fill="none" stroke="var(--ink)" stroke-width="1.3"/>`;
    s += `<text x="250" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="${on ? "var(--good)" : "var(--muted)"}">${on ? L2("bulb ON", "বাল্ব জ্বলছে") : L2("bulb off", "বাল্ব নিভে আছে")}</text>`;
    /* container */
    if (cond === "water") s += `<path d="M95,140 V244 Q95,252 103,252 H257 Q265,252 265,244 V140" fill="none" stroke="var(--muted)" stroke-width="2.5"/><rect x="97" y="160" width="166" height="90" fill="var(--c-soft)" opacity=".8"/>`;
    else if (cond === "molten") s += `<path d="M100,150 L110,246 H250 L260,150" fill="none" stroke="var(--muted)" stroke-width="3"/><path d="M104,168 L111,244 H249 L256,168 Z" fill="var(--note)" opacity=".25"/><text x="180" y="146" text-anchor="middle" font-size="12" fill="var(--muted)">${x[4] < 0 ? L2("liquefied, very cold", "তরলীকৃত, খুব ঠান্ডা") : L2("heated above", "উত্তপ্ত, ") + " " + B5(x[4]) + " °C" + L2("", "-এর ওপরে")}</text>`;
    /* electrodes */
    s += `<rect x="124" y="150" width="12" height="${cond === "solid" ? 60 : 88}" fill="var(--muted)"/><rect x="284" y="150" width="12" height="${cond === "solid" ? 60 : 88}" fill="var(--muted)" transform="translate(-60,0)"/>`;
    s += `<text x="118" y="164" text-anchor="end" font-size="14" font-weight="700" fill="var(--ink)">+</text><text x="244" y="164" font-size="14" font-weight="700" fill="var(--ink)">−</text>`;
    parts.forEach(p => {
      if (p.q) s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7" fill="${p.q > 0 ? "var(--bad)" : "var(--c)"}"/><text x="${p.x.toFixed(1)}" y="${(p.y + 4.5).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--sheet)">${p.q > 0 ? "+" : "−"}</text>`;
      else if (p.lump) s += `<rect x="${p.x - 6}" y="${p.y - 5}" width="12" height="10" rx="3" fill="var(--paper)" stroke="var(--ink)"/>`;
      else s += `<ellipse cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" rx="${p.w ? 7 : 9}" ry="${p.w ? 5 : 6}" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.5"/>`;
    });
    $("#k5pv", el).innerHTML = s + "</svg>";
    let why;
    if (x[3] && cond === "solid") why = L2("The ions are locked in the crystal lattice and cannot move: no current.", "আয়নগুলো কেলাস জালিতে আটকানো, নড়তে পারে না: বিদ্যুৎ প্রবাহ নেই।");
    else if (x[3]) why = L2(`Free ${x[6][0]} and ${x[6][1]} ions move: ${x[6][0]} toward the − electrode, ${x[6][1]} toward the + electrode. Current flows.`, `মুক্ত ${x[6][0]} ও ${x[6][1]} আয়ন চলাচল করে: ${x[6][0]} − তড়িৎদ্বারের দিকে, ${x[6][1]} + তড়িৎদ্বারের দিকে। বিদ্যুৎ প্রবাহিত হয়।`);
    else if (x[7] === "hcl" && cond === "water") why = L2("HCl is covalent, but it reacts with water and splits into H⁺ (really H₃O⁺) and Cl⁻ ions, so the solution conducts: an exception.", "HCl সমযোজী, কিন্তু পানির সাথে বিক্রিয়া করে H⁺ (আসলে H₃O⁺) ও Cl⁻ আয়নে ভেঙে যায়, তাই দ্রবণ বিদ্যুৎ পরিবহণ করে: একটি ব্যতিক্রম।");
    else if (x[7] === "hcl") why = L2("Pure HCl is a gas at room temperature; even as a cold liquid or solid it is made of neutral molecules: no ions, no current.", "বিশুদ্ধ HCl সাধারণ তাপমাত্রায় গ্যাস; ঠান্ডায় তরল বা কঠিন হলেও এটি আধানহীন অণু দিয়ে তৈরি: আয়ন নেই, বিদ্যুৎ নেই।");
    else if (cond === "water" && !x[5]) why = L2("It does not dissolve (non-polar): lumps stay undissolved and there are no ions.", "এটি দ্রবীভূত হয় না (অপোলার): দলা অদ্রবীভূত থাকে, কোনো আয়ন নেই।");
    else if (cond === "water") why = L2("It dissolves as whole neutral molecules (polar covalent), not as ions: no current.", "এটি আয়ন হিসেবে নয়, পুরো আধানহীন অণু হিসেবে দ্রবীভূত হয় (পোলার সমযোজী): বিদ্যুৎ প্রবাহ নেই।");
    else if (cond === "molten" && x[7] === "dec") why = L2("Sugar does not melt cleanly: it starts to break down (caramelise). Either way, there are no ions: no current.", "চিনি ঠিকমতো গলে না: ভেঙে যেতে (ক্যারামেল হতে) শুরু করে। যেভাবেই হোক, আয়ন নেই: বিদ্যুৎ নেই।");
    else why = L2("Neutral molecules only; no charged particles to carry current.", "শুধু আধানহীন অণু; বিদ্যুৎ বহনের মতো আধানযুক্ত কণা নেই।");
    let out = `<b>${L2(x[0], x[1])} (${x[2]})</b> · ${x[3] ? L2("ionic", "আয়নিক") : L2("covalent", "সমযোজী")} — ${on ? ok5(L2("conducts", "বিদ্যুৎ পরিবাহী")) : bad5(L2("does not conduct", "বিদ্যুৎ অপরিবাহী"))}<br>${why}`;
    if (cond === "molten" && x[3]) out += `<br><span class="muted">${L2("Molten salts are far too hot for a school lab; this is shown only as a thought experiment.", "গলিত লবণ স্কুলের ল্যাবের জন্য অনেক বেশি গরম; এটি শুধু চিন্তন-পরীক্ষা হিসেবে দেখানো হলো।")}</span>`;
    $("#k5po", el).innerHTML = out;
  };
  const table = () => {
    const yn = b => b ? "✓" : "✗";
    $("#k5pt", el).innerHTML = `<table style="border-collapse:collapse;font-size:14px;width:100%;min-width:320px;margin-top:8px"><thead><tr style="text-align:left;border-bottom:1.5px solid var(--rule)"><th style="padding:4px 5px">${L2("Substance", "পদার্থ")}</th><th style="padding:4px 5px">${L2("Bond", "বন্ধন")}</th><th style="padding:4px 5px">${L2("m.p. °C", "গলনাঙ্ক °C")}</th><th style="padding:4px 5px">${L2("In water", "পানিতে")}</th><th style="padding:4px 5px" title="${L2("conducts: solid / melted / in water", "বিদ্যুৎ: কঠিন / গলিত / পানিতে")}">${L2("Conducts s / l / aq", "পরিবাহী ক / গ / পা")}</th></tr></thead><tbody>${S.map((x, i) => `<tr style="border-bottom:1px solid var(--rule);${i === si ? "background:var(--c-soft)" : ""}"><td style="padding:4px 5px">${x[2]}</td><td style="padding:4px 5px">${x[3] ? L2("ionic", "আয়নিক") : L2("covalent", "সমযোজী")}</td><td style="padding:4px 5px">${(x[4] < 0 ? "−" : "") + B5(Math.abs(x[4]))}${x[7] === "dec" ? "*" : ""}</td><td style="padding:4px 5px">${x[5] ? L2("dissolves", "দ্রবণীয়") : L2("insoluble", "অদ্রবণীয়")}</td><td style="padding:4px 5px">${["solid", "molten", "water"].map(c => yn(conducts(x, c))).join(" / ")}</td></tr>`).join("")}</tbody></table><p class="hint">* ${L2("sugar breaks down (caramelises) around its melting point", "গলনাঙ্কের কাছাকাছি চিনি ভেঙে যায় (ক্যারামেল হয়)")}</p>`;
  };
  const step = dt => {
    const on = conducts(S[si], cond);
    parts.forEach(p => { if (p.fixed) return;
      p.vx += (Math.random() - 0.5) * 60 * dt * 10; p.vy += (Math.random() - 0.5) * 60 * dt * 10; p.vx *= 0.9; p.vy *= 0.9;
      if (on && p.q) p.vx += (p.q > 0 ? 1 : -1) * 18 * dt * 10 * 0.35;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const x0 = 142, x1 = 218, y0 = cond === "molten" ? 172 : 166, y1 = 240;
      if (p.x < x0) { p.x = x0; if (on && p.q < 0) p.x = x1 - 4; p.vx = Math.abs(p.vx); }
      if (p.x > x1) { p.x = x1; if (on && p.q > 0) p.x = x0 + 4; p.vx = -Math.abs(p.vx); }
      if (p.y < y0) { p.y = y0; p.vy = Math.abs(p.vy); } if (p.y > y1) { p.y = y1; p.vy = -Math.abs(p.vy); } });
  };
  const reset = () => { setup(); for (let n = 0; n < 20; n++) step(0.03); draw(); table(); };
  chips5(el, "#k5ps", b => { si = +b.dataset.i; reset(); });
  chips5(el, "#k5pc", b => { cond = b.dataset.c; reset(); });
  reset();
  if (!REDUCED) animate(el, dt => { step(dt); draw(); });
};

/* ============ 5.13 metallic bond: sea of electrons ============ */
W.k5metal = (el) => {
  const MET = [["Na", 1], ["Mg", 2], ["Al", 3]]; let mi = 1, mode = "none", off = 0, offT = 0, off0 = 0, T = [], es = [];
  const COLS = 8, ROWS = 4, SP = 42, X0 = 53, Y0 = 70;
  el.innerHTML = `<div class="chipset" id="k5mm" role="group">${MET.map((m, i) => `<button data-i="${i}" aria-pressed="${i === mi}">${m[0]}</button>`).join("")}</div>
    <div class="chipset" id="k5md" role="group"><button data-m="none" aria-pressed="true">${L2("Just the metal", "শুধু ধাতু")}</button><button data-m="battery" aria-pressed="false">${L2("Connect a battery", "ব্যাটারি যুক্ত করো")}</button><button data-m="heat" aria-pressed="false">${L2("Heat the left end", "বাম প্রান্ত গরম করো")}</button><button data-m="hammer" aria-pressed="false">${L2("Hammer it", "হাতুড়ি দিয়ে পেটাও")}</button></div>
    <div class="svgwrap fit" id="k5mv"></div>${REDUCED ? `<div class="w-row"><button class="btn" id="k5mst">${L2("Step", "এক ধাপ")}</button></div>` : ""}<div class="w-out" id="k5mo"></div>`;
  const seed = () => { const q = MET[mi][1], n = Math.min(80, COLS * ROWS * q); let r = 7; const R = () => (r = (r * 16807) % 2147483647) / 2147483647;
    es = []; for (let i = 0; i < n; i++) { const a = R() * 6.283; es.push({ x: 34 + R() * 332, y: 52 + R() * 142, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40 }); }
    T = new Array(COLS).fill(0); off = 0; offT = 0; };
  const draw = () => {
    const q = MET[mi][1];
    let s = `<svg viewBox="0 0 400 252" role="img" aria-label="${L2("metal lattice", "ধাতব জালি")}">${arrowDefs("k5ma", "var(--ink)")}`;
    s += `<rect x="28" y="44" width="344" height="158" rx="10" fill="var(--c-soft)" opacity=".55" stroke="var(--rule)"/>`;
    if (mode === "battery") { s += `<rect x="16" y="44" width="10" height="158" fill="var(--muted)"/><rect x="374" y="44" width="10" height="158" fill="var(--muted)"/><text x="21" y="38" text-anchor="middle" font-size="18" font-weight="700" fill="var(--ink)">−</text><text x="379" y="38" text-anchor="middle" font-size="18" font-weight="700" fill="var(--ink)">+</text>`;
      s += `<line x1="140" y1="244" x2="260" y2="244" stroke="var(--c)" stroke-width="2.5" marker-end="url(#k5ma)"/><text x="200" y="234" text-anchor="middle" font-size="13" fill="var(--c)">${L2("electron flow", "ইলেকট্রন প্রবাহ")}</text>`; }
    if (mode === "heat") s += `<path d="M6,200 q8,-20 0,-40 q14,14 10,40 z M8,150 q8,-18 0,-34 q12,12 9,34 z" fill="var(--note)"/>`;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const sh = mode === "hammer" && r < 2 ? off : 0; let x = X0 + c * SP + sh; if (x > X0 + (COLS - 0.5) * SP) x -= COLS * SP;
      const tc = T[c] || 0, j = mode === "heat" ? (1 + 5 * tc) : 1, jx = Math.sin(performance.now() / 70 + c * 1.7 + r) * j * 0.8, jy = Math.cos(performance.now() / 83 + r * 2.1 + c) * j * 0.8;
      const cx = x + (REDUCED ? 0 : jx), cy = Y0 + r * SP + (REDUCED ? 0 : jy);
      s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="15" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.3"/>`;
      if (mode === "heat" && tc > 0.02) s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="15" fill="var(--bad)" opacity="${Math.min(0.75, tc * 0.8).toFixed(2)}"/>`;
      s += `<text x="${cx.toFixed(1)}" y="${(cy + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">${q > 1 ? B5(q) : ""}+</text>`;
    }
    es.forEach(e => { s += `<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="3.6" fill="var(--c)"/>`; });
    if (mode === "hammer") s += `<g transform="translate(200,${14 - 10 * Math.max(0, Math.sin(offT * Math.PI))})"><rect x="-26" y="-4" width="52" height="18" rx="3" fill="var(--muted)"/><rect x="-4" y="-40" width="8" height="38" fill="var(--note)"/></g>`;
    $("#k5mv", el).innerHTML = s + "</svg>";
    const ion = MET[mi][0] + chg5(q);
    const msg = { none: L2(`Each circle is an atomic core, ${ion}. Each atom gave ${q} electron${q > 1 ? "s" : ""} to the sea; the blue dots wander through the whole metal and hold all the cores together.`, `প্রতিটি বৃত্ত একটি পারমাণবিক শাঁস, ${ion}। প্রতিটি পরমাণু সাগরে ${B5(q)}টি ইলেকট্রন দিয়েছে; নীল বিন্দুগুলো পুরো ধাতুজুড়ে ঘোরে আর সব শাঁসকে একসাথে ধরে রাখে।`),
      battery: L2("The free electrons drift from the − end toward the + end: that drift is the electric current. The cores stay in place. (Conventional current is taken from + to −.)", "মুক্ত ইলেকট্রনগুলো − প্রান্ত থেকে + প্রান্তের দিকে সরে যায়: এই সরে যাওয়াই বিদ্যুৎ প্রবাহ। শাঁসগুলো জায়গায় থাকে। (প্রচলিত প্রবাহ ধরা হয় + থেকে −।)"),
      heat: L2("At the hot end electrons speed up and rush toward the cooler end, carrying energy; the cores there vibrate harder. Heat spreads quickly along the metal.", "গরম প্রান্তে ইলেকট্রনগুলো দ্রুত হয়ে ঠান্ডা প্রান্তের দিকে ছোটে, সাথে শক্তি বয়ে নেয়; সেখানকার শাঁসগুলোও জোরে কাঁপে। তাপ দ্রুত ধাতুজুড়ে ছড়িয়ে পড়ে।"),
      hammer: L2("The top layers slide over the bottom ones, but the electron sea still surrounds every core, so the metal bends instead of breaking (malleable, ductile). Tap again to hit once more.", "ওপরের স্তরগুলো নিচের স্তরের ওপর দিয়ে সরে যায়, কিন্তু ইলেকট্রন সাগর তখনো প্রতিটি শাঁসকে ঘিরে রাখে, তাই ধাতু না ভেঙে বেঁকে যায় (ঘাতসহ, নমনীয়)। আবার চাপ দিলে আরেকবার পেটানো হবে।") }[mode];
    const nE = es.length;
    $("#k5mo", el).innerHTML = `${msg}<br><span class="muted">${B5(COLS * ROWS)}${L2(" cores", "টি শাঁস")} × ${B5(q)} = ${B5(COLS * ROWS * q)}${L2(" delocalised electrons", "টি সঞ্চরণশীল ইলেকট্রন")}${nE < COLS * ROWS * q ? L2(` (only ${nE} drawn)`, ` (আঁকা হয়েছে ${B5(nE)}টি)`) : ""}</span>`;
  };
  const step = dt => {
    if (mode === "heat") { const k = 3 * dt, N = T.slice(); N[0] = 1; for (let i = 1; i < COLS; i++) N[i] = T[i] + k * (T[i - 1] - 2 * T[i] + (i < COLS - 1 ? T[i + 1] : T[i])); T = N; }
    if (mode === "hammer" && offT > 0) { offT = Math.max(0, offT - dt * 1.4); off = off0 + (1 - offT) * SP / 2; }
    es.forEach(e => {
      const c = Math.max(0, Math.min(COLS - 1, Math.round((e.x - X0) / SP))), sp = mode === "heat" ? 1 + 2.2 * (T[c] || 0) : 1;
      if (Math.random() < dt * 3) { const a = Math.random() * 6.283; e.vx = Math.cos(a) * 42; e.vy = Math.sin(a) * 42; }
      e.x += (e.vx * sp + (mode === "battery" ? 55 : 0)) * dt; e.y += e.vy * sp * dt;
      if (e.x < 34) { e.x = 34; e.vx = Math.abs(e.vx); } if (e.x > 366) { if (mode === "battery") e.x = 36; else { e.x = 366; e.vx = -Math.abs(e.vx); } }
      if (e.y < 52) { e.y = 52; e.vy = Math.abs(e.vy); } if (e.y > 194) { e.y = 194; e.vy = -Math.abs(e.vy); } });
  };
  chips5(el, "#k5mm", b => { mi = +b.dataset.i; seed(); draw(); });
  el.querySelectorAll("#k5md button").forEach(b => b.addEventListener("click", () => {
    el.querySelectorAll("#k5md button").forEach(q => q.setAttribute("aria-pressed", q === b));
    const m = b.dataset.m;
    if (m === "hammer") { if (mode !== "hammer") off = 0; off = off % SP; off0 = off; offT = 1; if (REDUCED) { offT = 0; off = off0 + SP / 2; } }
    if (m !== "heat") T = new Array(COLS).fill(0);
    mode = m; draw(); }));
  seed();
  if (REDUCED) $("#k5mst", el).addEventListener("click", () => { for (let n = 0; n < 15; n++) step(0.04); draw(); });
  else animate(el, dt => { step(dt); draw(); });
  draw();
};
