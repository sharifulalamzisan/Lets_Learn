/* ---- chemistry chapter 7 widgets: chemical reactions ---- */
const B7 = x => bnNum(x, LANG);
/* rounded number → string with Bangla digits and a real minus sign */
const f7 = (x, d = 2) => { if (!isFinite(x)) return "—"; return B7((+(+x).toFixed(d)).toString()).replace("-", "−"); };
const sg7 = (x, d = 2) => (x > 0 ? "+" : "") + f7(x, d);
const chips7 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const onIn7 = (el, fn, sel = "input") => el.querySelectorAll(sel).forEach(i => i.addEventListener("input", fn));
/* chemical colours (used with opacity so they read in light and dark themes) */
const CC7 = { blue: "#2f7bf0", green: "#6aa51c", dgreen: "#4d7c0f", brown: "#a3471c", copper: "#c2671e", yellow: "#d19a12", litBlue: "#3d6fe0", litRed: "#e0413d", litPurple: "#8b4fc9", white: "#eef2f6", grey: "#8a929c", zinc: "#b9c0c8", rust: "#b5561f" };
/* seeded pseudo-random (stable pictures) */
const rnd7 = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ================= 7.1 physical or chemical? ================= */
W.k7change = (el) => {
  const I = [
    ["Ice melting on a plate", "প্লেটে বরফ গলা", "p", "H₂O(s) → H₂O(l): the same H₂O molecules, now free to slide past each other. Cool it and you get ice back.", "H₂O(s) → H₂O(l): একই H₂O অণু, এখন একে অপরের পাশ দিয়ে সরতে পারে। ঠান্ডা করলে আবার বরফ পাবে।"],
    ["Gas burning in the chula", "চুলায় গ্যাস জ্বলা", "c", "CH₄ + 2O₂ → CO₂ + 2H₂O + heat: methane and oxygen disappear; new substances form, with heat and light.", "CH₄ + 2O₂ → CO₂ + 2H₂O + তাপ: মিথেন ও অক্সিজেন হারিয়ে যায়; তাপ ও আলোসহ নতুন পদার্থ তৈরি হয়।"],
    ["Sugar dissolving in tea", "চায়ে চিনি গোলা", "p", "Sugar molecules only spread out among the water molecules; evaporate the water and the sugar comes back.", "চিনির অণু শুধু পানির অণুর মাঝে ছড়িয়ে পড়ে; পানি বাষ্প করলে চিনি ফিরে আসে।"],
    ["An iron nail rusting", "লোহার পেরেকে মরিচা পড়া", "c", "Iron + oxygen + water → rust (Fe₂O₃·nH₂O): a new brown, flaky substance. Colour change is a sign.", "লোহা + অক্সিজেন + পানি → মরিচা (Fe₂O₃·nH₂O): নতুন বাদামি, ঝুরঝুরে পদার্থ। রং বদল একটি লক্ষণ।"],
    ["Tearing a sheet of paper", "কাগজ ছেঁড়া", "p", "Only the size and shape change; each piece is still the same paper (cellulose).", "শুধু আকার-আকৃতি বদলায়; প্রতিটি টুকরা একই কাগজ (সেলুলোজ)।"],
    ["Milk turning into doi", "দুধ থেকে দই হওয়া", "c", "Bacteria turn milk sugar (lactose) into lactic acid: a new sour taste, and the milk sets. It can't be turned back into milk.", "ব্যাকটেরিয়া দুধের চিনিকে (ল্যাকটোজ) ল্যাকটিক এসিডে পরিণত করে: নতুন টক স্বাদ, দুধ জমে যায়। আর দুধে ফেরানো যায় না।"],
    ["Naphthalene balls shrinking in an almirah", "আলমারিতে ন্যাপথালিন ছোট হয়ে যাওয়া", "p", "Sublimation: solid naphthalene turns directly into vapour; the molecules are unchanged (you can smell the same substance).", "ঊর্ধ্বপাতন: কঠিন ন্যাপথালিন সরাসরি বাষ্প হয়; অণু একই থাকে (একই পদার্থের গন্ধ পাও)।"],
    ["Marble fizzing in hydrochloric acid", "হাইড্রোক্লোরিক এসিডে মার্বেলের বুদ্‌বুদ্", "c", "CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O: a new gas (CO₂) is given off.", "CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O: নতুন গ্যাস (CO₂) বের হয়।"],
    ["Candle wax melting", "মোম গলা", "p", "Solid wax becomes liquid wax; cool it and it sets again. No new substance.", "কঠিন মোম তরল মোম হয়; ঠান্ডা করলে আবার জমে। নতুন পদার্থ নেই।"],
    ["Frying an egg", "ডিম ভাজা", "c", "Heat changes the egg proteins permanently: clear, runny white becomes solid and white. It can't be reversed.", "তাপে ডিমের প্রোটিন স্থায়ীভাবে বদলে যায়: স্বচ্ছ, তরল অংশ শক্ত ও সাদা হয়। আর ফেরানো যায় না।"],
    ["A bulb glowing when switched on", "সুইচ দিলে বাল্ব জ্বলা", "p", "The filament gets hot and glows, but it is the same metal; switch off and it is unchanged.", "ফিলামেন্ট গরম হয়ে আলো দেয়, কিন্তু একই ধাতু থাকে; সুইচ বন্ধ করলে অপরিবর্তিত।"]];
  let i = 0, score = 0, done = 0, answered = false;
  el.innerHTML = `<div class="w-out" id="k7cq" style="font-size:1.1em;font-weight:700;text-align:center"></div>
  <div class="w-row" style="justify-content:center;gap:10px;margin:8px 0"><button class="btn" id="k7cp">${L2("Physical change", "ভৌত পরিবর্তন")}</button><button class="btn" id="k7cc">${L2("Chemical change", "রাসায়নিক পরিবর্তন")}</button></div>
  <div class="svgwrap fit" id="k7csv"></div><div class="w-out" id="k7co"></div>
  <div class="w-row" style="justify-content:space-between;align-items:center"><span class="muted" id="k7cs"></span><button class="btn solid" id="k7cn">${L2("Next", "পরেরটি")} →</button></div>`;
  const pic = (kind) => {
    // particle picture: physical = same molecules rearranged; chemical = atoms regrouped
    let g = `<svg viewBox="0 0 360 150" role="img" aria-label="${L2("particle picture", "কণার চিত্র")}">${arrowDefs("k7ca", "var(--c)")}
      <rect x="6" y="18" width="140" height="110" rx="10" fill="var(--c-soft)" stroke="var(--rule)"/><rect x="214" y="18" width="140" height="110" rx="10" fill="var(--c-soft)" stroke="var(--rule)"/>
      <line x1="156" y1="73" x2="204" y2="73" stroke="var(--c)" stroke-width="3" marker-end="url(#k7ca)"/>
      <text x="76" y="144" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("before", "আগে")}</text><text x="284" y="144" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("after", "পরে")}</text>`;
    const water = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="${CC7.litRed}" opacity=".85"/><circle cx="${x - 7}" cy="${y + 6}" r="4" fill="var(--muted)"/><circle cx="${x + 7}" cy="${y + 6}" r="4" fill="var(--muted)"/>`;
    if (kind === "p") {
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) g += water(30 + c * 31, 44 + r * 30);
      for (let k = 0; k < 12; k++) g += water(232 + rnd7(k) * 104, 36 + rnd7(k + 40) * 80);
      g += `<text x="180" y="12" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("same molecules, new arrangement", "একই অণু, নতুন বিন্যাস")}</text>`;
    } else {
      const ch4 = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="var(--ink)"/>${[[-9, -7], [9, -7], [-9, 7], [9, 7]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="4" fill="var(--muted)"/>`).join("")}`;
      const o2 = (x, y) => `<circle cx="${x - 5}" cy="${y}" r="7" fill="${CC7.litRed}" opacity=".85"/><circle cx="${x + 5}" cy="${y}" r="7" fill="${CC7.litRed}" opacity=".85"/>`;
      const co2 = (x, y) => `<circle cx="${x - 12}" cy="${y}" r="7" fill="${CC7.litRed}" opacity=".85"/><circle cx="${x}" cy="${y}" r="8" fill="var(--ink)"/><circle cx="${x + 12}" cy="${y}" r="7" fill="${CC7.litRed}" opacity=".85"/>`;
      g += ch4(44, 50) + ch4(104, 96) + o2(104, 44) + o2(36, 100) + o2(78, 72) + o2(128, 70);
      g += co2(252, 44) + co2(316, 100) + water(318, 46) + water(240, 96) + water(282, 70) + water(334, 76);
      g += `<text x="180" y="12" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("bonds break, atoms regroup into new molecules", "বন্ধন ভাঙে, পরমাণু জুড়ে নতুন অণু")}</text>`;
    }
    return g + `</svg>`;
  };
  const show = () => {
    const it = I[i]; answered = false;
    $("#k7cq", el).textContent = L2(it[0], it[1]);
    $("#k7csv", el).innerHTML = "";
    $("#k7co", el).innerHTML = L2("Is it a physical or a chemical change? Ask: is a new substance formed?", "এটি ভৌত না রাসায়নিক পরিবর্তন? প্রশ্ন করো: নতুন কোনো পদার্থ তৈরি হয়েছে কি?");
    $("#k7cs", el).textContent = L2(`Score ${score}/${done} · card ${i + 1} of ${I.length}`, `স্কোর ${B7(score)}/${B7(done)} · কার্ড ${B7(i + 1)}/${B7(I.length)}`);
    ["#k7cp", "#k7cc"].forEach(s => { $(s, el).disabled = false; $(s, el).classList.remove("solid"); });
  };
  const answer = (k) => {
    if (answered) return; answered = true; done++;
    const it = I[i], ok = k === it[2]; if (ok) score++;
    $(k === "p" ? "#k7cp" : "#k7cc", el).classList.add("solid");
    $("#k7csv", el).innerHTML = pic(it[2]);
    const kind = it[2] === "p" ? L2("physical", "ভৌত") : L2("chemical", "রাসায়নিক");
    $("#k7co", el).innerHTML = `<b style="color:var(${ok ? "--good" : "--bad"})">${ok ? L2("Correct!", "ঠিক!") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${L2(`It is a <b>${kind}</b> change. `, `এটি <b>${kind}</b> পরিবর্তন। `)}${L2(it[3], it[4])}`;
    $("#k7cs", el).textContent = L2(`Score ${score}/${done} · card ${i + 1} of ${I.length}`, `স্কোর ${B7(score)}/${B7(done)} · কার্ড ${B7(i + 1)}/${B7(I.length)}`);
  };
  $("#k7cp", el).addEventListener("click", () => answer("p"));
  $("#k7cc", el).addEventListener("click", () => answer("c"));
  $("#k7cn", el).addEventListener("click", () => { i = (i + 1) % I.length; if (i === 0) { score = 0; done = 0; } show(); });
  show();
};

/* ================= 7.2.1 CaCO3 in an open vs a closed container ================= */
W.k7rev = (el) => {
  const N = 16, X0 = 80, X1 = 280, TOP = 40, BED = 196, CW = (X1 - X0) / N;
  let closed = false, heat = false, cells, gas, escaped, flying, tAcc = 0;
  el.innerHTML = `<div class="chipset k7vc" role="group"><button data-v="0" aria-pressed="true">${L2("Open container", "খোলা পাত্র")}</button><button data-v="1" aria-pressed="false">${L2("Closed container", "বন্ধ পাত্র")}</button></div>
  <div class="w-row" style="margin:8px 0;gap:8px"><button class="btn solid" id="k7vh">${L2("Start heating", "তাপ দেওয়া শুরু")}</button><button class="btn" id="k7vr">${L2("Reset", "আবার শুরু")}</button>${REDUCED ? `<button class="btn" id="k7vs">${L2("Advance 2 s", "২ s এগোও")}</button>` : ""}</div>
  <div class="svgwrap fit" id="k7vsv"></div><div class="w-out" id="k7vo"></div>`;
  const reset = () => { cells = Array(N).fill(1); gas = []; flying = []; escaped = 0; };
  const step = (dt) => {
    if (heat) cells.forEach((c, k) => { if (c && Math.random() < 0.22 * dt) { cells[k] = 0; const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6; gas.push({ x: X0 + (k + 0.5) * CW, y: BED - 8, vx: 70 * Math.cos(a), vy: 70 * Math.sin(a) }); } });
    for (let j = gas.length - 1; j >= 0; j--) {
      const m = gas[j]; m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.x < X0 + 8) { m.x = X0 + 8; m.vx = Math.abs(m.vx); } if (m.x > X1 - 8) { m.x = X1 - 8; m.vx = -Math.abs(m.vx); }
      if (m.y < TOP + 8) { if (closed) { m.y = TOP + 8; m.vy = Math.abs(m.vy); } else if (m.y < TOP - 4) { gas.splice(j, 1); escaped++; flying.push({ x: m.x, y: m.y, vx: m.vx * 0.4, vy: -40 }); continue; } }
      if (m.y > BED - 8) {
        const k = Math.max(0, Math.min(N - 1, Math.floor((m.x - X0) / CW)));
        if (!cells[k] && Math.random() < 0.3) { cells[k] = 1; gas.splice(j, 1); continue; }
        m.y = BED - 8; m.vy = -Math.abs(m.vy);
      }
    }
    for (let j = flying.length - 1; j >= 0; j--) { const f = flying[j]; f.x += f.vx * dt; f.y += f.vy * dt; if (f.y < -10) flying.splice(j, 1); }
  };
  const co2 = (x, y) => `<circle cx="${x - 6}" cy="${y}" r="4" fill="${CC7.litRed}"/><circle cx="${x + 6}" cy="${y}" r="4" fill="${CC7.litRed}"/><circle cx="${x}" cy="${y}" r="4.5" fill="var(--ink)"/>`;
  const draw = () => {
    const nC = cells.reduce((a, b) => a + b, 0), nO = N - nC;
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("heating calcium carbonate", "ক্যালসিয়াম কার্বনেট উত্তপ্ত করা")}">
      <path d="M${X0} ${TOP} V${BED + 14} H${X1} V${TOP}" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2.5"/>`;
    if (closed) g += `<rect x="${X0 - 6}" y="${TOP - 8}" width="${X1 - X0 + 12}" height="8" rx="3" fill="var(--muted)"/>`;
    else g += `<text x="180" y="${TOP - 10}" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("open top: CO₂ can escape", "খোলা মুখ: CO₂ বেরিয়ে যেতে পারে")}</text>`;
    cells.forEach((c, k) => { g += `<rect x="${X0 + k * CW + 1}" y="${BED}" width="${CW - 2}" height="13" rx="2" fill="${c ? "var(--note)" : "var(--sheet)"}" stroke="${c ? "var(--note)" : "var(--muted)"}"/>`; });
    gas.forEach(m => g += co2(m.x, m.y));
    flying.forEach(f => g += `<g opacity=".45">${co2(f.x, f.y)}</g>`);
    // burner
    g += `<rect x="150" y="226" width="60" height="12" rx="3" fill="var(--muted)"/>`;
    if (heat) g += `<path d="M168 224 q12 -26 12 -8 q0 -18 12 8 z" fill="${CC7.copper}" opacity=".9"/>`;
    // legend
    g += `<rect x="290" y="70" width="14" height="10" fill="var(--note)"/><text x="308" y="80" font-size="12" fill="var(--ink)">CaCO₃</text>
      <rect x="290" y="90" width="14" height="10" fill="var(--sheet)" stroke="var(--muted)"/><text x="308" y="100" font-size="12" fill="var(--ink)">CaO</text>
      <g transform="translate(297 118)">${co2(0, 0)}</g><text x="308" y="122" font-size="12" fill="var(--ink)">CO₂</text>
      <text x="6" y="80" font-size="12" fill="var(--muted)">CaCO₃: ${B7(nC)}</text><text x="6" y="98" font-size="12" fill="var(--muted)">CaO: ${B7(nO)}</text>
      <text x="6" y="116" font-size="12" fill="var(--muted)">${L2("CO₂ inside", "ভেতরে CO₂")}: ${B7(gas.length)}</text>${closed ? "" : `<text x="6" y="134" font-size="12" fill="var(--muted)">${L2("escaped", "বেরিয়ে গেছে")}: ${B7(escaped)}</text>`}</svg>`;
    $("#k7vsv", el).innerHTML = g;
    let msg;
    if (!heat && nC === N) msg = L2("Press “Start heating”. CaCO₃(s) → CaO(s) + CO₂(g)", "“তাপ দেওয়া শুরু” চাপো। CaCO₃(s) → CaO(s) + CO₂(g)");
    else if (!closed) msg = L2(`Open container: CO₂ drifts away, so CaO has nothing to recombine with. The reaction goes <b>one way</b> until all CaCO₃ is used up (${nC} left): CaCO₃ → CaO + CO₂.`, `খোলা পাত্র: CO₂ ভেসে চলে যায়, তাই CaO-এর আবার যুক্ত হওয়ার কেউ থাকে না। সব CaCO₃ শেষ না হওয়া পর্যন্ত বিক্রিয়া <b>এক দিকে</b> চলে (${B7(nC)}টি বাকি): CaCO₃ → CaO + CO₂।`);
    else msg = L2(`Closed container: trapped CO₂ hits the CaO and some joins it again (backward reaction). Both reactions run at once: <b>CaCO₃ ⇌ CaO + CO₂</b>. Watch the numbers level off: that is equilibrium.`, `বন্ধ পাত্র: আটকে থাকা CO₂ CaO-কে ধাক্কা দেয় আর কিছু আবার যুক্ত হয় (পশ্চাৎমুখী বিক্রিয়া)। দুটি বিক্রিয়া একসাথে চলে: <b>CaCO₃ ⇌ CaO + CO₂</b>। সংখ্যাগুলো স্থির হয়ে আসছে কি না দেখো: এটাই সাম্যাবস্থা।`);
    $("#k7vo", el).innerHTML = msg;
  };
  const hbtn = $("#k7vh", el);
  const setHeat = (h) => { heat = h; hbtn.textContent = heat ? L2("Stop heating", "তাপ বন্ধ") : L2("Start heating", "তাপ দেওয়া শুরু"); };
  hbtn.addEventListener("click", () => { setHeat(!heat); if (REDUCED) { for (let k = 0; k < 40; k++) step(0.05); } draw(); });
  $("#k7vr", el).addEventListener("click", () => { reset(); setHeat(false); draw(); });
  if (REDUCED) $("#k7vs", el).addEventListener("click", () => { for (let k = 0; k < 40; k++) step(0.05); draw(); });
  chips7(el, ".k7vc", b => { closed = b.dataset.v === "1"; reset(); setHeat(false); draw(); });
  reset(); draw();
  if (!REDUCED) animate(el, dt => { step(dt); tAcc += dt; if (tAcc > 0.06) { tAcc = 0; draw(); } });
};

/* ================= 7.2.2 energy diagram, exothermic vs endothermic ================= */
W.k7energy = (el) => {
  const R = [
    ["N₂ + 3H₂ → 2NH₃", -92, "NH₃", 2, L2("Haber process", "হেবার প্রণালি")],
    ["CH₄ + 2O₂ → CO₂ + 2H₂O", -890, "CH₄", 1, L2("burning methane", "মিথেন পোড়া")],
    ["H⁺ + OH⁻ → H₂O", -57.34, "H₂O", 1, L2("neutralisation", "প্রশমন")],
    ["N₂ + O₂ → 2NO", 180, "NO", 2, L2("lightning", "বজ্রপাত")],
    ["CaCO₃ → CaO + CO₂", 178, "CaCO₃", 1, L2("lime kiln", "চুনের ভাটা")]];
  let ri = 0;
  el.innerHTML = `<div class="chipset k7ec" role="group">${R.map((r, i) => `<button data-i="${i}" aria-pressed="${i === ri}">${r[4]}</button>`).join("")}</div>
  ${slider("k7en", L2("Amount", "পরিমাণ"), 0.5, 6, 0.5, 2, "mol")}<div class="svgwrap fit" id="k7esv"></div><div class="w-out" id="k7eo"></div>`;
  const draw = () => {
    const r = R[ri], dH = r[1], exo = dH < 0, n = +$("#k7en", el).value;
    $("#k7en-v", el).textContent = f7(n, 1) + " mol " + r[2];
    const q = n / r[3] * Math.abs(dH);
    const d = Math.min(110, 24 + Math.sqrt(Math.abs(dH)) * 3.2);
    const yR = exo ? 80 : 80 + d, yP = exo ? 80 + d : 80, peak = Math.min(yR, yP) - 44;
    const col = exo ? "var(--bad)" : CC7.litBlue;
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("energy diagram", "শক্তি-চিত্র")}">${arrowDefs("k7eax", "var(--muted)")}${arrowDefs("k7eah", col)}
      <line x1="30" y1="222" x2="30" y2="20" stroke="var(--muted)" stroke-width="2" marker-end="url(#k7eax)"/>
      <text x="22" y="120" font-size="12" fill="var(--muted)" transform="rotate(-90 22 120)" text-anchor="middle">${L2("energy", "শক্তি")}</text>
      <line x1="30" y1="222" x2="270" y2="222" stroke="var(--muted)" stroke-width="2"/><text x="150" y="238" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("progress of reaction", "বিক্রিয়ার অগ্রগতি")}</text>
      <line x1="40" y1="${yR}" x2="100" y2="${yR}" stroke="var(--ink)" stroke-width="3"/><line x1="200" y1="${yP}" x2="262" y2="${yP}" stroke="var(--ink)" stroke-width="3"/>
      <path d="M100 ${yR} C130 ${yR} 130 ${peak} 150 ${peak} C170 ${peak} 170 ${yP} 200 ${yP}" fill="none" stroke="var(--c)" stroke-width="2.5" stroke-dasharray="5 4"/>
      <text x="70" y="${yR - 8}" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("reactants", "বিক্রিয়ক")}</text><text x="231" y="${yP - 8}" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("products", "উৎপাদ")}</text>
      <line x1="208" y1="${yR}" x2="208" y2="${yP + (exo ? -10 : 10)}" stroke="${col}" stroke-width="3" marker-end="url(#k7eah)"/>
      <line x1="200" y1="${yR}" x2="262" y2="${yR}" stroke="var(--muted)" stroke-dasharray="3 3"/>
      <text x="200" y="${(yR + yP) / 2 + 5}" font-size="14" font-weight="700" text-anchor="end" fill="${col}" dx="-12">ΔH = ${sg7(dH, 2)} kJ</text>`;
    // thermometer showing the surroundings
    const tx = 312, base = 200, lvl = exo ? 60 : 150;
    g += `<rect x="${tx - 8}" y="40" width="16" height="${base - 40}" rx="8" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="${tx}" cy="${base + 10}" r="13" fill="${col}"/>
      <rect x="${tx - 4}" y="${lvl}" width="8" height="${base - lvl + 4}" fill="${col}"/>
      <line x1="${tx - 18}" y1="110" x2="${tx - 10}" y2="110" stroke="var(--muted)"/><text x="${tx}" y="32" font-size="12" text-anchor="middle" fill="${col}" font-weight="700">${exo ? L2("warms up", "গরম হয়") : L2("cools down", "ঠান্ডা হয়")}</text></svg>`;
    $("#k7esv", el).innerHTML = g;
    $("#k7eo", el).innerHTML = L2(`<b>${r[0]}</b>; ΔH = ${sg7(dH, 2)} kJ (for ${r[3]} mol ${r[2]} as written). ${exo ? "Products have <b>less</b> energy than reactants: the difference is <b>given out</b> as heat (exothermic)." : "Products have <b>more</b> energy than reactants: heat must be <b>taken in</b> (endothermic)."} For ${f7(n, 1)} mol ${r[2]}: heat = ${f7(n, 1)} ÷ ${r[3]} × ${f7(Math.abs(dH), 2)} = <b>${f7(q, 1)} kJ ${exo ? "released" : "absorbed"}</b>.${ri === 1 ? " (Value for methane is approximate; it is not given in the book.)" : ""}`,
      `<b>${r[0]}</b>; ΔH = ${sg7(dH, 2)} kJ (লিখিত সমীকরণের ${B7(r[3])} mol ${r[2]}-এর জন্য)। ${exo ? "উৎপাদে বিক্রিয়কের চেয়ে <b>কম</b> শক্তি: পার্থক্যটুকু তাপ হিসেবে <b>বেরিয়ে যায়</b> (তাপোৎপাদী)।" : "উৎপাদে বিক্রিয়কের চেয়ে <b>বেশি</b> শক্তি: তাপ <b>শোষণ</b> করতে হয় (তাপহারী)।"} ${f7(n, 1)} mol ${r[2]}-এর জন্য: তাপ = ${f7(n, 1)} ÷ ${B7(r[3])} × ${f7(Math.abs(dH), 2)} = <b>${f7(q, 1)} kJ ${exo ? "নির্গত" : "শোষিত"}</b>।${ri === 1 ? " (মিথেনের মানটি আনুমানিক; বইয়ে দেওয়া নেই।)" : ""}`);
  };
  chips7(el, ".k7ec", b => { ri = +b.dataset.i; $("#k7en", el).value = R[ri][3]; draw(); });
  onIn7(el, draw); draw();
};

/* ================= 7.2.3 oxidation numbers + metal displacement ================= */
W.k7redox = (el) => {
  // [display, target, [[el, count, ox|null]], charge, note en, note bn]
  const C = [
    ["KMnO₄", "Mn", [["K", 1, 1], ["Mn", 1, null], ["O", 4, -2]], 0],
    ["H₂SO₄", "S", [["H", 2, 1], ["S", 1, null], ["O", 4, -2]], 0],
    ["K₂Cr₂O₇", "Cr", [["K", 2, 1], ["Cr", 2, null], ["O", 7, -2]], 0],
    ["HNO₃", "N", [["H", 1, 1], ["N", 1, null], ["O", 3, -2]], 0],
    ["H₃PO₄", "P", [["H", 3, 1], ["P", 1, null], ["O", 4, -2]], 0],
    ["MnO₂", "Mn", [["Mn", 1, null], ["O", 2, -2]], 0],
    ["Na₂S₂O₃", "S", [["Na", 2, 1], ["S", 2, null], ["O", 3, -2]], 0],
    ["FeCl₃", "Fe", [["Fe", 1, null], ["Cl", 3, -1]], 0, "Cl is −1 in a metal halide.", "ধাতব হ্যালাইডে Cl −১।"],
    ["NH₃", "N", [["N", 1, null], ["H", 3, 1]], 0],
    ["NH₄⁺", "N", [["N", 1, null], ["H", 4, 1]], 1, "For an ion the total equals its charge (+1).", "আয়নে যোগফল আধানের (+১) সমান।"],
    ["SO₄²⁻", "S", [["S", 1, null], ["O", 4, -2]], -2, "For an ion the total equals its charge (−2).", "আয়নে যোগফল আধানের (−২) সমান।"],
    ["H₂O₂", "O", [["H", 2, 1], ["O", 2, null]], 0, "A peroxide: oxygen is −1.", "পার-অক্সাইড: অক্সিজেন −১।"],
    ["KO₂", "O", [["K", 1, 1], ["O", 2, null]], 0, "A superoxide: oxygen is −½.", "সুপার-অক্সাইড: অক্সিজেন −½।"],
    ["LiAlH₄", "Al", [["Li", 1, 1], ["Al", 1, null], ["H", 4, -1]], 0, "A metal hydride: hydrogen is −1.", "ধাতব হাইড্রাইড: হাইড্রোজেন −১।"],
    ["Fe₃O₄", "Fe", [["Fe", 3, null], ["O", 4, -2]], 0, "An average value: oxidation numbers can be fractions.", "গড় মান: জারণ সংখ্যা ভগ্নাংশও হতে পারে।"],
    ["CH₄", "C", [["C", 1, null], ["H", 4, 1]], 0],
    ["CO₂", "C", [["C", 1, null], ["O", 2, -2]], 0]];
  const M = [["Mg", 5, 2], ["Zn", 4, 2], ["Fe", 3, 2], ["Cu", 1, 2], ["Ag", 0, 1]]; // symbol, reactivity rank, ion charge
  const SOL = [["Mg", "MgSO₄"], ["Zn", "ZnSO₄"], ["Fe", "FeSO₄"], ["Cu", "CuSO₄"], ["Ag", "AgNO₃"]];
  const solCol = { Mg: ["var(--c-soft)", 1], Zn: ["var(--c-soft)", 1], Fe: [CC7.green, 0.3], Cu: [CC7.blue, 0.45], Ag: ["var(--c-soft)", 1] };
  const depCol = { Zn: CC7.zinc, Fe: "#555b63", Cu: CC7.copper, Ag: "#c9ced4", Mg: CC7.zinc };
  const barCol = { Mg: CC7.zinc, Zn: CC7.zinc, Fe: CC7.grey, Cu: CC7.copper, Ag: "#c9ced4" };
  let mode = 0, ci = 0, mi = 1, si = 3, prog = 1;
  el.innerHTML = `<div class="chipset k7rm" role="group"><button data-m="0" aria-pressed="true">${L2("Oxidation number", "জারণ সংখ্যা")}</button><button data-m="1" aria-pressed="false">${L2("Metal + salt solution", "ধাতু + লবণের দ্রবণ")}</button></div><div id="k7rbody" style="margin-top:8px"></div>`;
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (num, den) => { if (den < 0) { num = -num; den = -den; } const g = gcd(num, den) || 1; num /= g; den /= g; const s = num > 0 ? "+" : num < 0 ? "−" : ""; return den === 1 ? s + B7(Math.abs(num)) : s + B7(Math.abs(num)) + "/" + B7(den); };
  const oxView = () => {
    $("#k7rbody", el).innerHTML = `<div class="chipset k7rc" role="group">${C.map((c, i) => `<button data-i="${i}" aria-pressed="${i === ci}">${c[0]}</button>`).join("")}</div><div class="svgwrap fit" id="k7rsv"></div><div class="w-out" id="k7ro"></div>`;
    chips7(el, ".k7rc", b => { ci = +b.dataset.i; oxDraw(); });
    oxDraw();
  };
  const oxDraw = () => {
    const c = C[ci], parts = c[2], tgt = parts.find(p => p[2] === null);
    const known = parts.filter(p => p[2] !== null).reduce((s, p) => s + p[1] * p[2], 0);
    const num = c[3] - known, den = tgt[1], xs = frac(num, den);
    const W0 = 360, bw = Math.min(96, (W0 - 20) / parts.length), x0 = (W0 - bw * parts.length) / 2;
    let g = `<svg viewBox="0 0 360 150" role="img" aria-label="${L2("oxidation numbers", "জারণ সংখ্যা")}">`;
    parts.forEach((p, k) => {
      const x = x0 + k * bw + bw / 2, unk = p[2] === null, v = unk ? xs : frac(p[2] * 2, 2).replace(/\/১$|\/1$/, "");
      g += `<rect x="${x - bw / 2 + 4}" y="20" width="${bw - 8}" height="46" rx="8" fill="${unk ? "var(--c)" : "var(--c-soft)"}" opacity="${unk ? .9 : 1}"/>
        <text x="${x}" y="50" font-size="17" font-weight="700" text-anchor="middle" fill="${unk ? "var(--sheet)" : "var(--ink)"}">${unk ? "x = " + xs : v}</text>
        <text x="${x}" y="92" font-size="20" font-weight="700" text-anchor="middle" fill="var(--ink)">${p[0]}<tspan font-size="14" dy="4">${p[1] > 1 ? B7(p[1]) : ""}</tspan></text>
        <text x="${x}" y="116" font-size="12" text-anchor="middle" fill="var(--muted)">× ${B7(p[1])} ${L2(p[1] > 1 ? "atoms" : "atom", "টি")}</text>`;
    });
    g += `<text x="180" y="142" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("total must be", "যোগফল হতে হবে")} ${c[3] === 0 ? B7(0) + L2(" (neutral)", " (নিরপেক্ষ)") : sg7(c[3], 0) + L2(" (charge of the ion)", " (আয়নের আধান)")}</text></svg>`;
    $("#k7rsv", el).innerHTML = g;
    const terms = parts.map(p => p[2] === null ? (p[1] > 1 ? B7(p[1]) + "x" : "x") : `(${sg7(p[2], 0)}) × ${B7(p[1])}`).join(" + ");
    $("#k7ro", el).innerHTML = `${terms} = ${f7(c[3], 0)} → ${den > 1 ? B7(den) + "x" : "x"} = ${f7(num, 0)} → <b>${c[1]} = ${xs}</b>${den > 1 && num % den ? ` (≈ ${sg7(num / den, 2)})` : ""}. ${c[4] ? L2(c[4], c[5]) : L2("Known values: H +1, O −2, alkali metal +1.", "জানা মান: H +১, O −২, ক্ষার ধাতু +১।")}`;
  };
  const dispView = () => {
    $("#k7rbody", el).innerHTML = `<div class="muted" style="font-size:.9em">${L2("Metal strip", "ধাতুর পাত")}</div><div class="chipset k7rmt" role="group">${M.map((m, i) => `<button data-i="${i}" aria-pressed="${i === mi}">${m[0]}</button>`).join("")}</div>
      <div class="muted" style="font-size:.9em;margin-top:6px">${L2("Solution", "দ্রবণ")}</div><div class="chipset k7rsl" role="group">${SOL.map((s, i) => `<button data-i="${i}" aria-pressed="${i === si}">${s[1]}</button>`).join("")}</div>
      <div class="svgwrap fit" id="k7rsv"></div><div class="w-out" id="k7ro"></div>`;
    chips7(el, ".k7rmt", b => { mi = +b.dataset.i; dip(); });
    chips7(el, ".k7rsl", b => { si = +b.dataset.i; dip(); });
    dispDraw();
  };
  const dip = () => { prog = REDUCED ? 1 : 0; dispDraw(); };
  const dispDraw = () => {
    const m = M[mi], s = SOL[si], sm = M.find(q => q[0] === s[0]), same = m[0] === s[0], reacts = !same && m[1] > sm[1];
    const p = reacts ? prog : 0;
    // solution colour: fades from the original towards the new salt's colour
    const [c0, o0] = solCol[s[0]], [c1, o1] = solCol[m[0]];
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("metal in salt solution", "লবণের দ্রবণে ধাতু")}">
      <path d="M40 60 V200 q0 14 14 14 H166 q14 0 14 -14 V60" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="42" y="96" width="136" height="116" rx="10" fill="${c0}" opacity="${o0 * (1 - p)}"/><rect x="42" y="96" width="136" height="116" rx="10" fill="${c1}" opacity="${o1 * p}"/>
      <rect x="96" y="30" width="28" height="160" rx="3" fill="${barCol[m[0]]}" stroke="var(--muted)"/>
      <text x="110" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="var(--ink)">${m[0]}</text>
      <text x="110" y="226" font-size="13" text-anchor="middle" fill="var(--ink)">${s[1]}(aq)</text>`;
    if (p > 0) for (let k = 0; k < Math.round(26 * p); k++) { const yy = 100 + rnd7(k + 3) * 86, left = k % 2 === 0; g += `<circle cx="${left ? 96 - rnd7(k) * 4 : 124 + rnd7(k) * 4}" cy="${yy}" r="${3 + rnd7(k + 9) * 2.5}" fill="${depCol[s[0]]}" stroke="var(--muted)" stroke-width=".5"/>`; }
    // reactivity ladder
    const lad = [["Mg", 5], ["Zn", 4], ["Fe", 3], ["(H)", 2], ["Cu", 1], ["Ag", 0]];
    g += `<text x="276" y="26" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("more reactive", "বেশি সক্রিয়")} ↑</text>`;
    lad.forEach((q, k) => { const y = 40 + k * 28, isM = q[0] === m[0], isS = q[0] === s[0];
      g += `<rect x="232" y="${y}" width="88" height="24" rx="6" fill="${isM ? "var(--c)" : isS ? "var(--note)" : "var(--c-soft)"}" opacity="${isM || isS ? .9 : 1}"/>
        <text x="276" y="${y + 17}" font-size="14" font-weight="${isM || isS ? 700 : 400}" text-anchor="middle" fill="${isM ? "var(--sheet)" : "var(--ink)"}">${q[0]}</text>`; });
    g += `<text x="276" y="222" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("less reactive", "কম সক্রিয়")} ↓</text></svg>`;
    $("#k7rsv", el).innerHTML = g;
    let out;
    if (same) out = L2(`No reaction: the metal and the metal in the salt are the same (${m[0]}).`, `কোনো বিক্রিয়া নেই: ধাতু আর লবণের ধাতু একই (${m[0]})।`);
    else if (!reacts) out = L2(`<b>No reaction.</b> ${m[0]} is <b>less</b> reactive than ${s[0]}, so it cannot give its electrons to ${s[0]} ions and push ${s[0]} out of the solution.`, `<b>কোনো বিক্রিয়া নেই।</b> ${m[0]} ${s[0]}-এর চেয়ে <b>কম</b> সক্রিয়, তাই এটি ${s[0]} আয়নকে ইলেকট্রন দিয়ে দ্রবণ থেকে ${s[0]}-কে বের করতে পারে না।`);
    else {
      const ag = s[0] === "Ag", salt = ag ? `${m[0]}(NO₃)₂` : `${m[0]}SO₄`;
      const eq = ag ? `${m[0]}(s) + 2AgNO₃(aq) → ${salt}(aq) + 2Ag(s)` : `${m[0]}(s) + ${s[1]}(aq) → ${salt}(aq) + ${s[0]}(s)`;
      const red = ag ? `2Ag⁺ + 2e⁻ → 2Ag` : `${s[0]}²⁺ + 2e⁻ → ${s[0]}`;
      const look = { Cu: L2("reddish-brown copper coats the strip", "পাতের গায়ে লালচে-বাদামি কপার জমে"), Ag: L2("shiny grey silver crystals grow on the strip", "পাতে চকচকে ধূসর সিলভারের কেলাস জমে"), Fe: L2("a dark grey iron coating forms", "গাঢ় ধূসর লোহার আস্তরণ পড়ে"), Zn: L2("a grey zinc coating forms", "ধূসর জিংকের আস্তরণ পড়ে") }[s[0]];
      const col = s[0] === "Cu" ? (m[0] === "Fe" ? L2(" and the blue solution turns pale green", " আর নীল দ্রবণ হালকা সবুজ হয়") : L2(" and the blue colour fades", " আর নীল রং ফিকে হয়ে যায়")) : m[0] === "Cu" ? L2(" and the solution turns blue", " আর দ্রবণ নীল হয়") : m[0] === "Fe" ? L2(" and the solution turns pale green", " আর দ্রবণ হালকা সবুজ হয়") : "";
      out = L2(`<b>Reaction!</b> ${look}${col}.<br>${eq}<br>Oxidation: ${m[0]} → ${m[0]}²⁺ + 2e⁻ (${m[0]}: 0 → +2, reducing agent)<br>Reduction: ${red} (${s[0]}: ${ag ? "+1" : "+2"} → 0; ${s[0]} ions are the oxidising agent)`,
        `<b>বিক্রিয়া ঘটে!</b> ${look}${col}।<br>${eq}<br>জারণ: ${m[0]} → ${m[0]}²⁺ + 2e⁻ (${m[0]}: ০ → +২, বিজারক)<br>বিজারণ: ${red} (${s[0]}: ${ag ? "+১" : "+২"} → ০; ${s[0]} আয়ন জারক)`);
    }
    $("#k7ro", el).innerHTML = out;
  };
  chips7(el, ".k7rm", b => { mode = +b.dataset.m; mode ? dispView() : oxView(); });
  oxView();
  if (!REDUCED) animate(el, dt => { if (mode === 1 && prog < 1 && $("#k7rsv", el)) { prog = Math.min(1, prog + dt / 2.5); dispDraw(); } });
};

/* ================= 7.2.4 neutralisation and precipitation ================= */
W.k7neut = (el) => {
  const P = [
    ["NaCl", "AgNO₃", "NaCl(aq) + AgNO₃(aq) → AgCl(s)↓ + NaNO₃(aq)", "Ag⁺ + Cl⁻ → AgCl↓", "Na⁺, NO₃⁻", "AgCl", CC7.white, L2("white", "সাদা"), "var(--c-soft)", "var(--c-soft)"],
    ["Na₂SO₄", "BaCl₂", "Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)", "Ba²⁺ + SO₄²⁻ → BaSO₄↓", "Na⁺, Cl⁻", "BaSO₄", CC7.white, L2("white", "সাদা"), "var(--c-soft)", "var(--c-soft)"],
    ["FeSO₄", "NaOH", "FeSO₄(aq) + 2NaOH(aq) → Fe(OH)₂(s)↓ + Na₂SO₄(aq)", "Fe²⁺ + 2OH⁻ → Fe(OH)₂↓", "Na⁺, SO₄²⁻", "Fe(OH)₂", CC7.dgreen, L2("green", "সবুজ"), CC7.green, "var(--c-soft)"],
    ["FeCl₃", "NaOH", "FeCl₃(aq) + 3NaOH(aq) → Fe(OH)₃(s)↓ + 3NaCl(aq)", "Fe³⁺ + 3OH⁻ → Fe(OH)₃↓", "Na⁺, Cl⁻", "Fe(OH)₃", CC7.brown, L2("reddish-brown", "লালচে-বাদামি"), CC7.yellow, "var(--c-soft)"],
    ["CuSO₄", "NaOH", "CuSO₄(aq) + 2NaOH(aq) → Cu(OH)₂(s)↓ + Na₂SO₄(aq)", "Cu²⁺ + 2OH⁻ → Cu(OH)₂↓", "Na⁺, SO₄²⁻", "Cu(OH)₂", "#6aa8f5", L2("pale blue", "হালকা নীল"), CC7.blue, "var(--c-soft)"],
    ["NaCl", "KNO₃", "", "", "Na⁺, Cl⁻, K⁺, NO₃⁻", "", "", "", "var(--c-soft)", "var(--c-soft)"]];
  let mode = 0, pi = 0, mixed = 0, V = 0;
  el.innerHTML = `<div class="chipset k7nm" role="group"><button data-m="0" aria-pressed="true">${L2("Neutralisation", "প্রশমন")}</button><button data-m="1" aria-pressed="false">${L2("Precipitation", "অধঃক্ষেপণ")}</button></div><div id="k7nbody" style="margin-top:8px"></div>`;
  const tint = (c) => c.startsWith("var") ? `fill="${c}"` : `fill="${c}" opacity=".35"`;
  /* --- neutralisation: 10 mL of 1 M NaOH; add 1 M HCl --- */
  const nView = () => {
    $("#k7nbody", el).innerHTML = `${slider("k7nv", L2("HCl added (1 M)", "যোগ করা HCl (১ M)"), 0, 20, 0.5, V, "mL")}<div class="svgwrap fit" id="k7nsv"></div><div class="w-out" id="k7no"></div>`;
    onIn7(el, nDraw, "#k7nv"); nDraw();
  };
  const nDraw = () => {
    V = sv(el, "k7nv", "mL", 1);
    const oh = Math.max(0, 10 - V), h = Math.max(0, V - 10), w = Math.min(V, 10), vol = (10 + V) / 1000;
    const pH = Math.abs(V - 10) < 1e-9 ? 7 : V < 10 ? 14 + Math.log10(oh * 1e-3 / vol) : -Math.log10(h * 1e-3 / vol);
    const lit = pH > 8.3 ? CC7.litBlue : pH < 4.5 ? CC7.litRed : CC7.litPurple;
    const litName = pH > 8.3 ? L2("blue", "নীল") : pH < 4.5 ? L2("red", "লাল") : L2("purple", "বেগুনি");
    const dT = w * 1e-3 * 57340 / ((10 + V) * 4.18), T = 25 + dT;
    const ions = []; const add = (n, lab, col) => { for (let k = 0; k < Math.round(n); k++) ions.push([lab, col]); };
    add(5, "Na⁺", "var(--note)"); add(oh / 2, "OH⁻", CC7.litBlue); add(V / 2, "Cl⁻", "var(--good)"); add(h / 2, "H⁺", CC7.litRed);
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("neutralisation", "প্রশমন")}">
      <rect x="108" y="4" width="14" height="46" fill="var(--c-soft)" stroke="var(--ink)"/><path d="M112 50 h6 v10 h-6 z" fill="var(--muted)"/><text x="130" y="22" font-size="12" fill="var(--muted)">HCl</text>
      ${V > 0 && V < 20 ? `<circle cx="115" cy="70" r="3" fill="${CC7.litRed}" opacity=".7"/>` : ""}
      <path d="M20 80 V226 q0 12 12 12 H198 q12 0 12 -12 V80" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="22" y="${96 - V * 1.1}" width="186" height="${140 + V * 1.1}" rx="8" fill="var(--c-soft)"/>`;
    ions.forEach((q, k) => { const cols = 6, x = 42 + (k % cols) * 29 + (Math.floor(k / cols) % 2) * 6, y = 122 - V * 1.1 + Math.floor(k / cols) * 29;
      g += `<circle cx="${x}" cy="${y}" r="13.5" fill="${q[1]}" opacity=".85"/><text x="${x}" y="${y + 4.5}" font-size="12" text-anchor="middle" fill="var(--sheet)" font-weight="700">${q[0]}</text>`; });
    // litmus strip + thermometer + pH readout
    g += `<rect x="232" y="80" width="22" height="80" rx="3" fill="${lit}"/><text x="243" y="176" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("litmus", "লিটমাস")}</text>
      <text x="243" y="192" font-size="12" text-anchor="middle" fill="var(--muted)">${litName}</text>
      <rect x="290" y="60" width="14" height="130" rx="7" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="297" cy="198" r="11" fill="var(--bad)"/>
      <rect x="294" y="${180 - dT * 14}" width="8" height="${20 + dT * 14}" fill="var(--bad)"/>
      <text x="297" y="50" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${f7(T, 1)} °C</text>
      <text x="290" y="232" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">pH ${f7(pH, 1)}</text></svg>`;
    $("#k7nsv", el).innerHTML = g;
    const state = Math.abs(V - 10) < 1e-9 ? L2("<b>Exactly neutralised</b>: only Na⁺, Cl⁻ and water remain (a solution of salt).", "<b>ঠিক প্রশমিত</b>: শুধু Na⁺, Cl⁻ আর পানি আছে (লবণের দ্রবণ)।") : V < 10 ? L2(`Still alkaline: ${f7(oh, 1)} mmol of OH⁻ left.`, `এখনো ক্ষারীয়: ${f7(oh, 1)} mmol OH⁻ বাকি।`) : L2(`Now acidic: ${f7(h, 1)} mmol of extra H⁺.`, `এখন অম্লীয়: ${f7(h, 1)} mmol বাড়তি H⁺।`);
    $("#k7no", el).innerHTML = L2(`10 mL of 1 M NaOH + ${f7(V, 1)} mL of 1 M HCl (each circle = 0.002 mol). H⁺ + OH⁻ → H₂O has formed <b>${f7(w * 1e-3, 4)} mol water</b>, releasing ${f7(w * 1e-3, 4)} × 57 340 = <b>${f7(w * 57.34, 1)} J</b>, so the mixture warms by about ${f7(dT, 1)} °C. ${state} Na⁺ and Cl⁻ are spectator ions.`,
      `১০ mL ১ M NaOH + ${f7(V, 1)} mL ১ M HCl (প্রতিটি বৃত্ত = ০.০০২ mol)। H⁺ + OH⁻ → H₂O বিক্রিয়ায় <b>${f7(w * 1e-3, 4)} mol পানি</b> তৈরি হয়েছে, নির্গত তাপ ${f7(w * 1e-3, 4)} × ৫৭ ৩৪০ = <b>${f7(w * 57.34, 1)} J</b>, তাই মিশ্রণ প্রায় ${f7(dT, 1)} °C গরম হয়েছে। ${state} Na⁺ ও Cl⁻ দর্শক আয়ন।`);
  };
  /* --- precipitation --- */
  const pView = () => {
    $("#k7nbody", el).innerHTML = `<div class="chipset k7np" role="group">${P.map((q, i) => `<button data-i="${i}" aria-pressed="${i === pi}">${q[0]} + ${q[1]}</button>`).join("")}</div>
      <div class="w-row" style="margin:8px 0"><button class="btn solid" id="k7nmix">${L2("Mix the solutions", "দ্রবণ দুটি মেশাও")}</button></div><div class="svgwrap fit" id="k7nsv"></div><div class="w-out" id="k7no"></div>`;
    chips7(el, ".k7np", b => { pi = +b.dataset.i; mixed = 0; pDraw(); });
    $("#k7nmix", el).addEventListener("click", () => { mixed = REDUCED ? 1 : 0.001; pDraw(); });
    pDraw();
  };
  const tube = (x, top, bot, fillAttr, lab) => `<path d="M${x - 16} ${top} V${bot - 16} a16 16 0 0 0 32 0 V${top}" fill="none" stroke="var(--ink)" stroke-width="2"/>
    <path d="M${x - 14} ${top + 30} V${bot - 16} a14 14 0 0 0 28 0 V${top + 30} z" ${fillAttr}/><text x="${x}" y="${bot + 18}" font-size="12" text-anchor="middle" fill="var(--ink)">${lab}</text>`;
  const pDraw = () => {
    const q = P[pi], none = !q[2];
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("precipitation", "অধঃক্ষেপণ")}">${arrowDefs("k7npa", "var(--c)")}`;
    g += tube(40, 30, 150, tint(q[8]), q[0] + "(aq)") + tube(110, 30, 150, tint(q[9]), q[1] + "(aq)");
    g += `<line x1="140" y1="95" x2="190" y2="95" stroke="var(--c)" stroke-width="3" marker-end="url(#k7npa)"/>`;
    // mixed tube
    const x = 250, top = 20, bot = 170;
    g += `<path d="M${x - 24} ${top} V${bot - 24} a24 24 0 0 0 48 0 V${top}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>`;
    if (mixed > 0) {
      const mixCol = q[0] === "CuSO₄" || q[0] === "FeCl₃" || q[0] === "FeSO₄" ? q[8] : "var(--c-soft)";
      const clearing = none ? 0 : Math.min(1, mixed);
      g += `<path d="M${x - 22} ${top + 40} V${bot - 24} a22 22 0 0 0 44 0 V${top + 40} z" ${mixCol.startsWith("var") ? `fill="${mixCol}"` : `fill="${mixCol}" opacity="${.35 * (1 - .8 * clearing)}"`}/>`;
      if (!none) {
        for (let k = 0; k < 46; k++) {
          const sx = x - 18 + rnd7(k) * 36, sy0 = top + 46 + rnd7(k + 50) * 90, sy1 = bot - 8 - rnd7(k + 99) * 14 - (Math.abs(sx - x) > 14 ? -2 : 0);
          const y = sy0 + (sy1 - sy0) * Math.min(1, mixed);
          g += `<circle cx="${sx}" cy="${y}" r="3.2" fill="${q[6]}" stroke="var(--muted)" stroke-width=".6"/>`;
        }
        if (mixed >= 1) g += `<text x="${x + 32}" y="${bot - 6}" font-size="12" fill="var(--ink)">${q[5]}↓</text>`;
      }
    } else g += `<text x="${x}" y="100" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("empty", "খালি")}</text>`;
    g += `</svg>`;
    $("#k7nsv", el).innerHTML = g;
    let out;
    if (!mixed) out = L2("Both solutions are clear. Press “Mix” and watch.", "দুটি দ্রবণই স্বচ্ছ। “মেশাও” চাপো আর দেখো।");
    else if (none) out = L2(`<b>No precipitate.</b> NaCl + KNO₃: every possible product (NaNO₃, KCl) is soluble, so the ions ${q[4]} simply stay dissolved. No reaction happens.`, `<b>কোনো অধঃক্ষেপ নেই।</b> NaCl + KNO₃: সম্ভাব্য সব উৎপাদ (NaNO₃, KCl) দ্রবণীয়, তাই ${q[4]} আয়নগুলো দ্রবীভূতই থাকে। কোনো বিক্রিয়া ঘটে না।`);
    else out = L2(`A <b>${q[7]}</b> precipitate of <b>${q[5]}</b> forms and settles.<br>${q[2]}<br>Net ionic equation: <b>${q[3]}</b>; spectator ions: ${q[4]}. No oxidation number changes, so it is non-redox.`,
      `<b>${q[5]}</b>-এর <b>${q[7]}</b> অধঃক্ষেপ তৈরি হয়ে তলায় জমে।<br>${q[2]}<br>নিট আয়নিক সমীকরণ: <b>${q[3]}</b>; দর্শক আয়ন: ${q[4]}। কোনো জারণ সংখ্যা বদলায় না, তাই এটি নন-রেডক্স।`);
    $("#k7no", el).innerHTML = out;
  };
  chips7(el, ".k7nm", b => { mode = +b.dataset.m; mode ? pView() : nView(); });
  nView();
  if (!REDUCED) animate(el, dt => { if (mode === 1 && mixed > 0 && mixed < 1 && $("#k7nsv", el)) { mixed = Math.min(1, mixed + dt / 2.2); pDraw(); } });
};

/* ================= 7.3 sort reactions by type ================= */
W.k7sort = (el) => {
  const T = [["add", "Addition / synthesis", "সংযোজন / সংশ্লেষণ"], ["dec", "Decomposition", "বিয়োজন"], ["disp", "Displacement", "প্রতিস্থাপন"], ["comb", "Combustion", "দহন"], ["neut", "Neutralisation", "প্রশমন"], ["ppt", "Precipitation", "অধঃক্ষেপণ"], ["hydl", "Hydrolysis", "আর্দ্র বিশ্লেষণ"], ["hydr", "Hydration", "পানিযোজন"], ["iso", "Isomerisation", "সমাণুকরণ"], ["poly", "Polymerisation", "পলিমারকরণ"]];
  // [equation, [types], redox?, note en, note bn]
  const E = [
    ["N₂ + 3H₂ → 2NH₃", ["add"], 1, "Two elements join into one compound (synthesis). N: 0 → −3, H: 0 → +1.", "দুটি মৌল যুক্ত হয়ে একটি যৌগ (সংশ্লেষণ)। N: ০ → −৩, H: ০ → +১।"],
    ["CuSO₄ + 5H₂O → CuSO₄·5H₂O", ["hydr"], 0, "Water joins the crystal as water of crystallisation; white → blue.", "পানি কেলাস পানি হিসেবে কেলাসে যুক্ত হয়; সাদা → নীল।"],
    ["Zn + CuSO₄ → ZnSO₄ + Cu", ["disp"], 1, "More reactive zinc pushes copper out. Zn: 0 → +2, Cu: +2 → 0.", "বেশি সক্রিয় জিংক কপারকে বের করে দেয়। Zn: ০ → +২, Cu: +২ → ০।"],
    ["HCl + NaOH → NaCl + H₂O", ["neut"], 0, "Acid + base → salt + water; really H⁺ + OH⁻ → H₂O.", "এসিড + ক্ষার → লবণ + পানি; আসলে H⁺ + OH⁻ → H₂O।"],
    ["PCl₅ → PCl₃ + Cl₂", ["dec"], 1, "One compound breaks into two. P: +5 → +3, Cl: −1 → 0.", "একটি যৌগ ভেঙে দুটি। P: +৫ → +৩, Cl: −১ → ০।"],
    ["CH₄ + 2O₂ → CO₂ + 2H₂O", ["comb"], 1, "Burning in oxygen to form oxides, with heat. C: −4 → +4, O: 0 → −2.", "অক্সিজেনে পুড়ে অক্সাইড তৈরি, তাপসহ। C: −৪ → +৪, O: ০ → −২।"],
    ["NaCl + AgNO₃ → AgCl↓ + NaNO₃", ["ppt"], 0, "Insoluble white AgCl settles out; ions only swap partners.", "অদ্রবণীয় সাদা AgCl তলায় জমে; আয়নগুলো শুধু সঙ্গী বদলায়।"],
    ["SiCl₄ + 4H₂O → Si(OH)₄ + 4HCl", ["hydl"], 0, "Water breaks up SiCl₄. Si stays +4, Cl stays −1.", "পানি SiCl₄-কে ভাঙে। Si +৪ আর Cl −১ থাকে।"],
    ["NH₄CNO → H₂N–CO–NH₂", ["iso"], 0, "Same formula (CH₄N₂O), atoms rearranged: ammonium cyanate → urea.", "একই সংকেত (CH₄N₂O), পরমাণু নতুনভাবে সাজে: অ্যামোনিয়াম সায়ানেট → ইউরিয়া।"],
    ["n CH₂=CH₂ → (–CH₂–CH₂–)ₙ", ["poly"], 0, "Many ethylene monomers join into polythene.", "অসংখ্য ইথিলিন মনোমার জুড়ে পলিথিন হয়।"],
    ["2Mg + O₂ → 2MgO", ["comb", "add"], 1, "It is both combustion (burning in oxygen) and addition (two elements combine). Mg: 0 → +2, O: 0 → −2.", "এটি একাধারে দহন (অক্সিজেনে পোড়া) ও সংযোজন (দুটি মৌল যুক্ত হয়)। Mg: ০ → +২, O: ০ → −২।"],
    ["AlCl₃ + 3H₂O → Al(OH)₃↓ + 3HCl", ["hydl", "ppt"], 0, "Both hydrolysis (water breaks AlCl₃) and precipitation (insoluble Al(OH)₃).", "একাধারে আর্দ্র বিশ্লেষণ (পানি AlCl₃ ভাঙে) ও অধঃক্ষেপণ (অদ্রবণীয় Al(OH)₃)।"],
    ["2FeCl₂ + Cl₂ → 2FeCl₃", ["add"], 1, "Two substances join into one. Fe: +2 → +3, Cl: 0 → −1.", "দুটি পদার্থ যুক্ত হয়ে একটি। Fe: +২ → +৩, Cl: ০ → −১।"],
    ["CaCO₃ → CaO + CO₂", ["dec"], 0, "A decomposition, but look: Ca +2, C +4, O −2 on both sides. Not every decomposition is redox!", "বিয়োজন, কিন্তু দেখো: দুই পাশে Ca +২, C +৪, O −২। সব বিয়োজন রেডক্স নয়!"],
    ["Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl", ["ppt"], 0, "White BaSO₄ precipitates; Na⁺ and Cl⁻ are spectators.", "সাদা BaSO₄ অধঃক্ষিপ্ত হয়; Na⁺ ও Cl⁻ দর্শক।"],
    ["Zn + H₂SO₄ → ZnSO₄ + H₂", ["disp"], 1, "Zinc displaces hydrogen from the acid. Zn: 0 → +2, H: +1 → 0.", "জিংক এসিড থেকে হাইড্রোজেনকে প্রতিস্থাপন করে। Zn: ০ → +২, H: +১ → ০।"]];
  let i = 0, score = 0, done = 0, answered = false;
  el.innerHTML = `<div class="w-out" id="k7sq" style="font-size:1.15em;font-weight:700;text-align:center;letter-spacing:.01em"></div>
  <div class="chipset k7st" role="group" style="margin:8px 0">${T.map(t => `<button data-t="${t[0]}" aria-pressed="false">${L2(t[1], t[2])}</button>`).join("")}</div>
  <div class="w-out" id="k7so"></div><div class="w-row" style="justify-content:space-between;align-items:center"><span class="muted" id="k7ss"></span><button class="btn solid" id="k7sn">${L2("Next", "পরেরটি")} →</button></div>`;
  const name = k => { const t = T.find(q => q[0] === k); return L2(t[1], t[2]); };
  const stat = () => $("#k7ss", el).textContent = L2(`Score ${score}/${done} · ${i + 1} of ${E.length}`, `স্কোর ${B7(score)}/${B7(done)} · ${B7(i + 1)}/${B7(E.length)}`);
  const show = () => { answered = false; $("#k7sq", el).textContent = E[i][0]; el.querySelectorAll(".k7st button").forEach(b => b.setAttribute("aria-pressed", "false")); $("#k7so", el).innerHTML = L2("What type of reaction is this? Tap a type.", "এটি কোন ধরনের বিক্রিয়া? একটি ধরন বেছে নাও।"); stat(); };
  el.querySelectorAll(".k7st button").forEach(b => b.addEventListener("click", () => {
    if (answered) return; answered = true; done++;
    const e = E[i], ok = e[1].includes(b.dataset.t); if (ok) score++;
    el.querySelectorAll(".k7st button").forEach(q => q.setAttribute("aria-pressed", String(q === b || e[1].includes(q.dataset.t))));
    const correct = e[1].map(name).join(L2(" and ", " ও "));
    $("#k7so", el).innerHTML = `<b style="color:var(${ok ? "--good" : "--bad"})">${ok ? L2("Correct!", "ঠিক!") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${L2("Type", "ধরন")}: <b>${correct}</b>. ${L2(e[3], e[4])} <span class="muted">${e[2] ? L2("Redox: oxidation numbers change.", "রেডক্স: জারণ সংখ্যা বদলায়।") : L2("Non-redox: no oxidation number changes.", "নন-রেডক্স: কোনো জারণ সংখ্যা বদলায় না।")}</span>`;
    stat();
  }));
  $("#k7sn", el).addEventListener("click", () => { i = (i + 1) % E.length; if (i === 0) { score = 0; done = 0; } show(); });
  show();
};

/* ================= 7.4 rusting test tubes ================= */
W.k7rust = (el) => {
  const Tb = [
    ["A", 1, "air", L2("Air + tap water", "বাতাস + কলের পানি"), L2("Oxygen and water are both present, so the nail rusts steadily.", "অক্সিজেন ও পানি দুটোই আছে, তাই পেরেকে নিয়মিত মরিচা পড়ে।")],
    ["B", 0, "dry", L2("Dry air (anhydrous CaCl₂)", "শুকনো বাতাস (অনার্দ্র CaCl₂)"), L2("Calcium chloride soaks up the moisture. No water → no rust.", "ক্যালসিয়াম ক্লোরাইড আর্দ্রতা শুষে নেয়। পানি নেই → মরিচা নেই।")],
    ["C", 0.04, "oil", L2("Boiled water under an oil layer", "তেলের স্তরের নিচে ফোটানো পানি"), L2("Boiling drives out dissolved air and the oil stops more from dissolving. Almost no oxygen → hardly any rust.", "ফোটালে দ্রবীভূত বাতাস বেরিয়ে যায়, আর তেল নতুন বাতাস ঢুকতে দেয় না। প্রায় অক্সিজেন নেই → মরিচা প্রায় পড়ে না।")],
    ["D", 2.2, "salt", L2("Salt water + air", "লবণপানি + বাতাস"), L2("Salt speeds up rusting: this nail rusts fastest (think of boats and bridges near the sea).", "লবণ মরিচাকে দ্রুত করে: এই পেরেকে সবচেয়ে দ্রুত মরিচা পড়ে (সাগরের কাছের নৌকা আর সেতুর কথা ভাবো)।")],
    ["E", 0, "paint", L2("Painted nail in water", "পানিতে রং করা পেরেক"), L2("The paint keeps air and water away from the iron.", "রং লোহা থেকে বাতাস ও পানি দূরে রাখে।")],
    ["F", 0, "zinc", L2("Galvanised (zinc-coated) nail", "গ্যালভানাইজড (জিংক প্রলেপযুক্ত) পেরেক"), L2("Zinc is more reactive, so the zinc corrodes (a dull white layer) instead of the iron.", "জিংক বেশি সক্রিয়, তাই লোহার বদলে জিংক ক্ষয় হয় (নিষ্প্রভ সাদা আস্তরণ)।")]];
  let sel = 0;
  el.innerHTML = `${slider("k7ud", L2("Time", "সময়"), 0, 14, 1, 7, L2("days", "দিন"))}<div class="svgwrap fit" id="k7usv"></div>
  <div class="chipset k7uc" role="group">${Tb.map((t, k) => `<button data-i="${k}" aria-pressed="${k === sel}">${t[0]}: ${t[3]}</button>`).join("")}</div><div class="w-out" id="k7uo"></div>`;
  const draw = () => {
    const d = sv(el, "k7ud", L2("days", "দিন"));
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("rusting experiment", "মরিচার পরীক্ষা")}">`;
    Tb.forEach((t, k) => {
      const x = 32 + k * 59, top = 30, bot = 190, fr = Math.min(1, t[1] * d / 10), on = k === sel;
      g += `<rect x="${x - 25}" y="10" width="50" height="206" rx="8" fill="${on ? "var(--c-soft)" : "none"}"/>`;
      // liquid
      if (t[2] !== "dry") g += `<path d="M${x - 15} 90 V${bot - 15} a15 15 0 0 0 30 0 V90 z" fill="${t[2] === "salt" ? CC7.blue : CC7.litBlue}" opacity="${t[2] === "salt" ? .22 : .18}"/>`;
      if (t[2] === "oil") g += `<rect x="${x - 15}" y="80" width="30" height="12" fill="${CC7.yellow}" opacity=".55"/>`;
      if (t[2] === "dry") for (let j = 0; j < 9; j++) g += `<circle cx="${x - 9 + (j % 3) * 9}" cy="${bot - 6 - Math.floor(j / 3) * 7}" r="3.5" fill="${CC7.white}" stroke="var(--muted)" stroke-width=".7"/>`;
      if (t[2] === "dry" || t[2] === "oil") g += `<rect x="${x - 18}" y="${top - 12}" width="36" height="14" rx="3" fill="var(--muted)"/>`;
      g += `<path d="M${x - 16} ${top} V${bot - 16} a16 16 0 0 0 32 0 V${top}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
      // nail
      const ny0 = 44, ny1 = t[2] === "dry" ? 160 : 180, ncol = t[2] === "paint" ? "var(--c)" : t[2] === "zinc" ? CC7.zinc : CC7.grey;
      g += `<rect x="${x - 10}" y="${ny0 - 5}" width="20" height="5" rx="2" fill="${ncol}"/><path d="M${x - 3} ${ny0} V${ny1 - 8} L${x} ${ny1} L${x + 3} ${ny1 - 8} V${ny0} z" fill="${ncol}"/>`;
      const spots = Math.round(fr * 14);
      for (let j = 0; j < spots; j++) g += `<circle cx="${x - 3 + rnd7(j + k * 20) * 6}" cy="${ny0 + 6 + rnd7(j * 3 + k) * (ny1 - ny0 - 16)}" r="${2.5 + rnd7(j + 7) * 2.5}" fill="${CC7.rust}" opacity=".9"/>`;
      if (t[2] === "zinc" && d > 0) for (let j = 0; j < Math.min(8, d); j++) g += `<circle cx="${x - 3 + rnd7(j + 60) * 6}" cy="${ny0 + 10 + rnd7(j + 70) * 110}" r="2" fill="${CC7.white}" stroke="var(--muted)" stroke-width=".5"/>`;
      g += `<text x="${x}" y="212" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${t[0]}</text>`;
      g += `<rect x="${x - 18}" y="222" width="36" height="5" rx="2" fill="var(--rule)"/><rect x="${x - 18}" y="222" width="${36 * fr}" height="5" rx="2" fill="${CC7.rust}"/>`;
    });
    g += `</svg>`;
    $("#k7usv", el).innerHTML = g;
    const t = Tb[sel], fr = Math.min(1, t[1] * d / 10);
    $("#k7uo", el).innerHTML = L2(`<b>${t[0]}. ${t[3]}</b>, after ${d} days: rust ${fr >= 1 ? "covers the nail" : fr > 0.4 ? "is heavy" : fr > 0.05 ? "is visible" : fr > 0 ? "has barely started" : "has not formed"}. ${t[4]} (The bar under each tube shows how much rust.)`,
      `<b>${t[0]}. ${t[3]}</b>, ${B7(d)} দিন পর: মরিচা ${fr >= 1 ? "পুরো পেরেক ঢেকে ফেলেছে" : fr > 0.4 ? "অনেক" : fr > 0.05 ? "দেখা যাচ্ছে" : fr > 0 ? "সবে শুরু হয়েছে" : "পড়েনি"}। ${t[4]} (প্রতিটি টিউবের নিচের বার মরিচার পরিমাণ দেখায়।)`);
  };
  chips7(el, ".k7uc", b => { sel = +b.dataset.i; draw(); });
  onIn7(el, draw); draw();
};

/* ================= 7.5 rate of reaction: gas volume vs time ================= */
W.k7rate = (el) => {
  let rx = 0, size = 1, cat = 1, tNow = 300, run = false;
  el.innerHTML = `<div class="chipset k7qr" role="group"><button data-r="0" aria-pressed="true">${L2("Marble + HCl → CO₂", "মার্বেল + HCl → CO₂")}</button><button data-r="1" aria-pressed="false">${L2("H₂O₂ → O₂", "H₂O₂ → O₂")}</button></div>
  ${slider("k7qt", L2("Temperature", "তাপমাত্রা"), 15, 55, 5, 25, "°C")}${slider("k7qc", L2("Concentration", "ঘনমাত্রা"), 0.5, 2, 0.25, 1, "M")}
  <div id="k7qx"></div>
  <div class="w-row" style="margin:6px 0"><button class="btn solid" id="k7qgo">${L2("Run the experiment", "পরীক্ষাটি চালাও")}</button></div>
  <div class="svgwrap fit" id="k7qsv"></div><div class="w-out" id="k7qo"></div>`;
  const extra = () => {
    $("#k7qx", el).innerHTML = rx === 0
      ? `<div class="chipset k7qs" role="group">${[L2("large lumps", "বড় দলা"), L2("small chips", "ছোট টুকরা"), L2("powder", "গুঁড়া")].map((s, k) => `<button data-s="${k}" aria-pressed="${k === size}">${s}</button>`).join("")}</div>`
      : `<div class="chipset k7qk" role="group"><button data-k="0" aria-pressed="${cat === 0}">${L2("no catalyst", "প্রভাবক নেই")}</button><button data-k="1" aria-pressed="${cat === 1}">${L2("MnO₂ catalyst", "MnO₂ প্রভাবক")}</button></div>`;
    chips7(el, ".k7qs", b => { size = +b.dataset.s; tNow = 300; draw(); });
    chips7(el, ".k7qk", b => { cat = +b.dataset.k; tNow = 300; draw(); });
  };
  const model = (T, c, s, k) => rx === 0
    ? { V: 60, k: 0.02 * Math.pow(2, (T - 25) / 10) * c * [0.35, 1, 4][s] }
    : { V: 40 * c, k: 0.03 * Math.pow(2, (T - 25) / 10) * (k ? 1 : 0.004) };
  const draw = () => {
    const T = sv(el, "k7qt", "°C"), c = sv(el, "k7qc", "M", 2);
    const m = model(T, c, size, cat), b = model(25, 1, 1, 1);
    const X0 = 44, Y0 = 200, WW = 230, HH = 170, xm = 300, ym = 100;
    const px = t => X0 + t / xm * WW, py = v => Y0 - v / ym * HH;
    const path = (mm, tEnd) => { let d = ""; for (let t = 0; t <= tEnd + 1e-9; t += 3) d += (t ? "L" : "M") + px(t).toFixed(1) + " " + py(mm.V * (1 - Math.exp(-mm.k * t))).toFixed(1) + " "; return d; };
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("gas volume against time", "গ্যাসের আয়তন বনাম সময়")}">
      <line x1="${X0}" y1="${Y0}" x2="${X0 + WW}" y2="${Y0}" stroke="var(--muted)" stroke-width="1.5"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - HH}" stroke="var(--muted)" stroke-width="1.5"/>`;
    [0, 100, 200, 300].forEach(t => g += `<text x="${px(t)}" y="${Y0 + 16}" font-size="12" text-anchor="middle" fill="var(--muted)">${B7(t)}</text>`);
    [0, 50, 100].forEach(v => g += `<text x="${X0 - 6}" y="${py(v) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B7(v)}</text><line x1="${X0}" y1="${py(v)}" x2="${X0 + WW}" y2="${py(v)}" stroke="var(--rule)" stroke-width=".7"/>`);
    g += `<text x="${X0 + WW / 2}" y="${Y0 + 34}" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("time (s)", "সময় (s)")}</text>
      <text x="14" y="${Y0 - HH / 2}" font-size="12" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 14 ${Y0 - HH / 2})">${L2("gas volume (mL)", "গ্যাসের আয়তন (mL)")}</text>
      <path d="${path(b, 300)}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="${path(m, tNow)}" fill="none" stroke="var(--c)" stroke-width="3"/>`;
    const vNow = m.V * (1 - Math.exp(-m.k * tNow));
    // gas syringe
    const sx = 292, sy = 60;
    g += `<rect x="${sx}" y="${sy}" width="60" height="22" rx="4" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <rect x="${sx + 2}" y="${sy + 2}" width="${56 * Math.min(1, vNow / 100)}" height="18" fill="var(--c)" opacity=".3"/>
      <line x1="${sx + 2 + 56 * Math.min(1, vNow / 100)}" y1="${sy - 4}" x2="${sx + 2 + 56 * Math.min(1, vNow / 100)}" y2="${sy + 26}" stroke="var(--ink)" stroke-width="3"/>
      <text x="${sx + 30}" y="${sy - 10}" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("gas syringe", "গ্যাস সিরিঞ্জ")}</text>
      <text x="${sx + 30}" y="${sy + 44}" font-size="15" font-weight="700" text-anchor="middle" fill="var(--ink)">${f7(vNow, 0)} mL</text>
      <text x="${sx + 30}" y="${sy + 62}" font-size="12" text-anchor="middle" fill="var(--muted)">t = ${f7(tNow, 0)} s</text>
      <line x1="${sx}" y1="${sy + 86}" x2="${sx + 20}" y2="${sy + 86}" stroke="var(--c)" stroke-width="3"/><text x="${sx + 24}" y="${sy + 90}" font-size="12" fill="var(--ink)">${L2("yours", "তোমার")}</text>
      <line x1="${sx}" y1="${sy + 104}" x2="${sx + 20}" y2="${sy + 104}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/><text x="${sx + 24}" y="${sy + 108}" font-size="12" fill="var(--ink)">${L2("standard", "আদর্শ")}</text></svg>`;
    $("#k7qsv", el).innerHTML = g;
    const r0 = m.V * m.k, t90 = Math.log(10) / m.k;
    const std = rx === 0 ? L2("25 °C, 1 M, small chips", "২৫ °C, ১ M, ছোট টুকরা") : L2("25 °C, 1 M, with MnO₂", "২৫ °C, ১ M, MnO₂ সহ");
    $("#k7qo", el).innerHTML = L2(`${rx === 0 ? "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ (acid in excess)" : "2H₂O₂ → 2H₂O + O₂"}. Starting rate ≈ <b>${f7(r0, 2)} mL/s</b> (${f7(r0 / (b.V * b.k), 1)} × the standard, ${std}). ${t90 > 3000 ? "Far too slow to finish in this time." : `90% of the gas is collected by about <b>${f7(t90, 0)} s</b>.`} Total gas: ${f7(m.V, 0)} mL${rx === 0 ? " (set by the mass of marble, so it doesn't change)" : " (more H₂O₂ gives more O₂)"}.`,
      `${rx === 0 ? "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ (এসিড অতিরিক্ত)" : "2H₂O₂ → 2H₂O + O₂"}। শুরুর হার ≈ <b>${f7(r0, 2)} mL/s</b> (আদর্শের ${f7(r0 / (b.V * b.k), 1)} গুণ; আদর্শ: ${std})। ${t90 > 3000 ? "এই সময়ে শেষ হওয়ার পক্ষে খুবই ধীর।" : `প্রায় <b>${f7(t90, 0)} s</b>-এ ৯০% গ্যাস জমে।`} মোট গ্যাস: ${f7(m.V, 0)} mL${rx === 0 ? " (মার্বেলের ভর দিয়ে নির্ধারিত, তাই বদলায় না)" : " (বেশি H₂O₂ মানে বেশি O₂)"}।`);
  };
  chips7(el, ".k7qr", b => { rx = +b.dataset.r; tNow = 300; extra(); draw(); });
  onIn7(el, () => { tNow = 300; run = false; draw(); }, ".w-range");
  $("#k7qgo", el).addEventListener("click", () => { if (REDUCED) { tNow = 300; draw(); return; } tNow = 0; run = true; });
  extra(); draw();
  if (!REDUCED) animate(el, dt => { if (run) { tNow = Math.min(300, tNow + dt * 40); if (tNow >= 300) run = false; draw(); } });
};

/* ================= 7.5.1 equilibrium and Le Chatelier ================= */
W.k7equil = (el) => {
  const RX = [
    { eq: "N₂ + 3H₂ ⇌ 2NH₃", dh: -92, gasL: 4, gasR: 2, kf: 0.3, kb: 0.1, R: "N₂ + 3H₂", P: "NH₃" },
    { eq: "N₂ + O₂ ⇌ 2NO", dh: 180, gasL: 2, gasR: 2, kf: 0.1, kb: 0.3, R: "N₂ + O₂", P: "NO" }];
  let ri = 0, R, P, t, hist, ev, temp, pres, cat, msg = "";
  const A = [["add", L2("+ reactant", "+ বিক্রিয়ক")], ["rem", L2("remove product", "উৎপাদ সরাও")], ["hot", L2("heat ↑", "তাপ ↑")], ["cold", L2("cool ↓", "ঠান্ডা ↓")], ["pup", L2("pressure ↑", "চাপ ↑")], ["pdn", L2("pressure ↓", "চাপ ↓")], ["cat", L2("add catalyst", "প্রভাবক দাও")], ["reset", L2("start again", "আবার শুরু")]];
  el.innerHTML = `<div class="chipset k7qe" role="group">${RX.map((r, i) => `<button data-i="${i}" aria-pressed="${i === ri}">${r.eq}</button>`).join("")}</div>
  <div class="w-row" style="flex-wrap:wrap;gap:6px;margin:8px 0">${A.map(a => `<button class="btn" data-a="${a[0]}">${a[1]}</button>`).join("")}</div>
  <div class="svgwrap fit" id="k7qesv"></div><div class="w-out" id="k7qeo"></div>`;
  const reset = () => { R = 1; P = 0; t = 0; hist = []; ev = []; temp = 0; pres = 1; cat = 1; msg = ""; };
  const ks = () => { const r = RX[ri], exo = r.dh < 0;
    let kf = r.kf * cat * Math.pow(exo ? 1.25 : 2, temp), kb = r.kb * cat * Math.pow(exo ? 2 : 1.25, temp);
    if (r.gasL !== r.gasR) kf *= Math.pow(pres, (r.gasL - r.gasR) / 2);
    return [kf, kb]; };
  const step = (dt) => { const [kf, kb] = ks(), rf = kf * R, rb = kb * P, d = (rf - rb) * dt; R -= d; P += d; t += dt;
    hist.push([t, rf, rb, R, P]); while (hist.length && hist[0][0] < t - 30) hist.shift(); };
  const draw = () => {
    const X0 = 40, WW = 300, t0 = Math.max(0, t - 30), px = x => X0 + (x - t0) / 30 * WW;
    const mr = Math.max(0.12, ...hist.map(h => Math.max(h[1], h[2]))) * 1.1, mc = Math.max(1, ...hist.map(h => Math.max(h[3], h[4]))) * 1.1;
    const line = (idx, top, H, mx) => hist.map((h, k) => (k ? "L" : "M") + px(h[0]).toFixed(1) + " " + (top + H - h[idx] / mx * H).toFixed(1)).join(" ");
    const r = RX[ri];
    let g = `<svg viewBox="0 0 360 270" role="img" aria-label="${L2("equilibrium graphs", "সাম্যাবস্থার লেখচিত্র")}">`;
    const panel = (top, H, lab) => `<line x1="${X0}" y1="${top + H}" x2="${X0 + WW}" y2="${top + H}" stroke="var(--muted)"/><line x1="${X0}" y1="${top}" x2="${X0}" y2="${top + H}" stroke="var(--muted)"/><text x="${X0 - 6}" y="${top + H / 2}" font-size="12" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 ${X0 - 6} ${top + H / 2})">${lab}</text>`;
    g += panel(14, 100, L2("rate", "হার")) + panel(146, 100, L2("amount", "পরিমাণ"));
    ev.filter(e => e[0] >= t0).forEach(e => g += `<line x1="${px(e[0])}" y1="10" x2="${px(e[0])}" y2="246" stroke="var(--note)" stroke-dasharray="3 3"/><text x="${px(e[0]) + 3}" y="24" font-size="12" fill="var(--note)">${e[1]}</text>`);
    if (hist.length > 1) g += `<path d="${line(1, 14, 100, mr)}" fill="none" stroke="var(--c)" stroke-width="2.5"/><path d="${line(2, 14, 100, mr)}" fill="none" stroke="var(--note)" stroke-width="2.5"/>
      <path d="${line(3, 146, 100, mc)}" fill="none" stroke="var(--bad)" stroke-width="2.5"/><path d="${line(4, 146, 100, mc)}" fill="none" stroke="var(--good)" stroke-width="2.5"/>`;
    g += `<rect x="${X0 + 8}" y="116" width="12" height="4" fill="var(--c)"/><text x="${X0 + 24}" y="122" font-size="12" fill="var(--ink)">${L2("forward", "সম্মুখমুখী")}</text>
      <rect x="${X0 + 120}" y="116" width="12" height="4" fill="var(--note)"/><text x="${X0 + 136}" y="122" font-size="12" fill="var(--ink)">${L2("backward", "পশ্চাৎমুখী")}</text>
      <rect x="${X0 + 8}" y="254" width="12" height="4" fill="var(--bad)"/><text x="${X0 + 24}" y="260" font-size="12" fill="var(--ink)">${r.R}</text>
      <rect x="${X0 + 120}" y="254" width="12" height="4" fill="var(--good)"/><text x="${X0 + 136}" y="260" font-size="12" fill="var(--ink)">${r.P}</text></svg>`;
    $("#k7qesv", el).innerHTML = g;
    const [kf, kb] = ks(), rf = kf * R, rb = kb * P, eqm = Math.abs(rf - rb) < 0.012 * Math.max(rf, rb, 0.05);
    const st = eqm ? L2("<b>Equilibrium</b>: forward rate = backward rate, amounts constant (both reactions still going).", "<b>সাম্যাবস্থা</b>: সম্মুখমুখী হার = পশ্চাৎমুখী হার, পরিমাণ স্থির (দুটি বিক্রিয়াই চলছে)।")
      : rf > rb ? L2("Forward faster → shifting <b>right</b> (more product).", "সম্মুখমুখী দ্রুত → <b>ডানে</b> সরছে (বেশি উৎপাদ)।") : L2("Backward faster → shifting <b>left</b> (more reactant).", "পশ্চাৎমুখী দ্রুত → <b>বাঁয়ে</b> সরছে (বেশি বিক্রিয়ক)।");
    $("#k7qeo", el).innerHTML = `<b>${r.eq}</b>; ΔH = ${sg7(r.dh, 0)} kJ; ${L2("gas moles", "গ্যাস-মোল")} ${B7(r.gasL)} → ${B7(r.gasR)}. ${st}${msg ? "<br>" + msg : ""}`;
  };
  const act = (a) => {
    const r = RX[ri], exo = r.dh < 0; let lab = "";
    if (a === "reset") { reset(); if (REDUCED) for (let k = 0; k < 500; k++) step(0.05); draw(); return; }
    if (a === "add") { R += 0.5; lab = "+R"; msg = L2("Added reactant → Le Chatelier: the system uses some up, shifting right.", "বিক্রিয়ক যোগ → লা-শাতেলিয়ার: ব্যবস্থাটি এর কিছু খরচ করে, ডানে সরে।"); }
    if (a === "rem") { P *= 0.4; lab = "−P"; msg = L2("Removed product → the system makes more to replace it, shifting right.", "উৎপাদ সরানো → ব্যবস্থাটি তা পূরণে আরও বানায়, ডানে সরে।"); }
    if (a === "hot" || a === "cold") { const up = a === "hot"; temp = Math.max(-2, Math.min(2, temp + (up ? 1 : -1))); lab = up ? "T↑" : "T↓";
      msg = up ? (exo ? L2("Heated: the endothermic backward reaction absorbs the heat → shifts left.", "তাপ দেওয়া: তাপহারী পশ্চাৎমুখী বিক্রিয়া তাপ শোষণ করে → বাঁয়ে সরে।") : L2("Heated: the endothermic forward reaction absorbs the heat → shifts right.", "তাপ দেওয়া: তাপহারী সম্মুখমুখী বিক্রিয়া তাপ শোষণ করে → ডানে সরে।"))
        : (exo ? L2("Cooled: the exothermic forward reaction replaces the heat → shifts right.", "ঠান্ডা করা: তাপোৎপাদী সম্মুখমুখী বিক্রিয়া তাপ পূরণ করে → ডানে সরে।") : L2("Cooled: the exothermic backward reaction replaces the heat → shifts left.", "ঠান্ডা করা: তাপোৎপাদী পশ্চাৎমুখী বিক্রিয়া তাপ পূরণ করে → বাঁয়ে সরে।")); }
    if (a === "pup" || a === "pdn") { const up = a === "pup"; pres = Math.max(0.25, Math.min(4, pres * (up ? 2 : 0.5))); lab = up ? "p↑" : "p↓";
      msg = r.gasL === r.gasR ? L2("Same number of gas moles on both sides → pressure has no effect.", "দুই পাশে গ্যাস-মোল সমান → চাপের কোনো প্রভাব নেই।")
        : up ? L2("Pressure up → shifts to fewer gas moles (right).", "চাপ বাড়ানো → কম গ্যাস-মোলের দিকে (ডানে) সরে।") : L2("Pressure down → shifts to more gas moles (left).", "চাপ কমানো → বেশি গ্যাস-মোলের দিকে (বাঁয়ে) সরে।"); }
    if (a === "cat") { if (cat < 3) { cat = 3; lab = L2("cat", "প্রভা"); } msg = L2("Catalyst: both rates rise equally, so equilibrium comes sooner but the amounts don't change.", "প্রভাবক: দুই হার সমানভাবে বাড়ে, তাই দ্রুত সাম্যাবস্থা আসে, কিন্তু পরিমাণ বদলায় না।"); }
    if (lab) ev.push([t, lab]);
    if (REDUCED) for (let k = 0; k < 300; k++) step(0.05);
    draw();
  };
  el.querySelectorAll("button[data-a]").forEach(b => b.addEventListener("click", () => act(b.dataset.a)));
  chips7(el, ".k7qe", b => { ri = +b.dataset.i; act("reset"); });
  reset();
  if (REDUCED) for (let k = 0; k < 500; k++) step(0.05);
  draw();
  let acc = 0;
  if (!REDUCED) animate(el, dt => { step(dt * 1.5); acc += dt; if (acc > 0.08) { acc = 0; draw(); } });
};
