/* ---- chapter 6 widgets: effect of heat on matter ---- */
const B6 = x => bnNum(x, LANG);
/* number → readable string (Bangla digits when LANG is bn); × 10^n form for very large/small values */
const f6 = (x, d = 0) => {
  if (!isFinite(x)) return "—";
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e7 || a < 1e-3)) { const e = Math.floor(Math.log10(a)); let m = x / Math.pow(10, e); m = +m.toFixed(2); return B6(m + " × 10<sup>" + e + "</sup>"); }
  let s = (+x.toFixed(d)).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  const [i, fr] = s.split("."); const g = Math.abs(+i) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  return B6((fr ? g + "." + fr : g).replace("-", "−"));
};
const chips6 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const onIn6 = (el, fn) => el.querySelectorAll("input").forEach(i => i.addEventListener("input", fn));
const arr6 = (x1, y1, x2, y2, col, w = 3) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, hl = Math.min(11, L * 0.6), bx = x2 - ux * hl, by = y2 - uy * hl;
  return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${col}" stroke-width="${w}"/><path d="M${x2} ${y2} L${bx - uy * 6} ${by + ux * 6} L${bx + uy * 6} ${by - ux * 6} Z" fill="${col}"/>`; };
/* a vertical thermometer: x centre, top y, bottom y (bulb centre below), fraction filled 0..1 */
const therm6 = (x, yt, yb, fr, col = "var(--bad)") => { fr = Math.max(0, Math.min(1, fr)); const yc = yb - fr * (yb - yt);
  return `<rect x="${x - 7}" y="${yt - 6}" width="14" height="${yb - yt + 12}" rx="7" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.2"/>
    <circle cx="${x}" cy="${yb + 14}" r="12" fill="${col}" stroke="var(--ink)" stroke-width="1.2"/><rect x="${x - 3.5}" y="${yc}" width="7" height="${yb + 6 - yc}" fill="${col}"/>`; };

/* 6.1 two water tanks: level = temperature, amount = heat */
W.c6level = (el) => {
  el.innerHTML = `<div class="w-row" style="gap:12px;flex-wrap:wrap"><div style="flex:1;min-width:150px">${slider("c6lhA", L2("Tank A level (temperature)", "ট্যাংক A-র উচ্চতা (তাপমাত্রা)"), 5, 100, 1, 80, "")}${slider("c6lwA", L2("Tank A width", "ট্যাংক A-র চওড়া"), 1, 4, 0.5, 1, "")}</div>
    <div style="flex:1;min-width:150px">${slider("c6lhB", L2("Tank B level (temperature)", "ট্যাংক B-র উচ্চতা (তাপমাত্রা)"), 5, 100, 1, 30, "")}${slider("c6lwB", L2("Tank B width", "ট্যাংক B-র চওড়া"), 1, 4, 0.5, 4, "")}</div></div>
    <div class="w-row"><button class="btn solid" id="c6lgo">${L2("Open the valve", "ভালভ খোলো")}</button><button class="btn" id="c6lrs">${L2("Reset", "আবার")}</button></div>
    <div class="svgwrap fit" id="c6lsv"></div><div class="w-out" id="c6lo"></div>`;
  let hA = 80, hB = 30, open = false, moved = 0;
  const read = () => { hA = sv(el, "c6lhA", ""); hB = sv(el, "c6lhB", ""); open = false; moved = 0; };
  const draw = () => {
    const wA = sv(el, "c6lwA", "", 1), wB = sv(el, "c6lwB", "", 1);
    $("#c6lhA-v", el).textContent = B6(Math.round(hA)); $("#c6lhB-v", el).textContent = B6(Math.round(hB));
    const bot = 185, k = 1.5, pw = 34;
    const xA = 12, WA = wA * pw, xB = 348 - wB * pw, WB = wB * pw;
    let g = `<svg viewBox="0 0 360 225" role="img" aria-label="${L2("two connected tanks", "যুক্ত দুটি ট্যাংক")}">
      <rect x="${xA + WA}" y="${bot - 12}" width="${xB - xA - WA}" height="10" fill="var(--c-soft)" stroke="var(--muted)"/>
      <rect x="${(xA + WA + xB) / 2 - 7}" y="${bot - 18}" width="14" height="22" rx="3" fill="${open ? "var(--good)" : "var(--muted)"}"/>
      <rect x="${xA}" y="${bot - hA * k}" width="${WA}" height="${hA * k}" fill="var(--bad)" opacity=".35"/>
      <rect x="${xB}" y="${bot - hB * k}" width="${WB}" height="${hB * k}" fill="var(--c)" opacity=".35"/>
      <path d="M${xA} 20 V${bot} H${xA + WA} V20 M${xB} 20 V${bot} H${xB + WB} V20" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <text x="${xA + WA / 2}" y="16" font-size="14" text-anchor="middle" fill="var(--ink)">A</text><text x="${xB + WB / 2}" y="16" font-size="14" text-anchor="middle" fill="var(--ink)">B</text>
      <text x="${xA + 3}" y="${bot + 18}" font-size="13" fill="var(--muted)">${L2("amount", "পরিমাণ")} ${f6(wA * hA)}</text>
      <text x="${xB + WB - 3}" y="${bot + 18}" font-size="13" text-anchor="end" fill="var(--muted)">${L2("amount", "পরিমাণ")} ${f6(wB * hB)}</text>`;
    if (open && Math.abs(hA - hB) > 0.3) { const dir = hA > hB ? 1 : -1, cx = (xA + WA + xB) / 2; g += arr6(cx - dir * 30, bot - 36, cx + dir * 30, bot - 36, "var(--note)"); }
    g += `</svg>`;
    $("#c6lsv", el).innerHTML = g;
    const hi = hA > hB + 0.3 ? "A" : hB > hA + 0.3 ? "B" : "";
    const more = wA * hA > wB * hB ? "A" : "B";
    let t;
    if (!open) t = L2(`Tank ${hi || "A"} has the ${hi ? "higher level (temperature)" : "same level"}; tank ${more} holds more water (energy). ${hi ? `When the valve opens, water will flow from <b>${hi}</b>${hi !== more ? ", even though it holds less water!" : "."}` : "No water will flow."}`,
      `ট্যাংক ${hi || "A"}-র ${hi ? "উচ্চতা (তাপমাত্রা) বেশি" : "উচ্চতা সমান"}; ট্যাংক ${more}-তে পানি (শক্তি) বেশি। ${hi ? `ভালভ খুললে পানি যাবে <b>${hi}</b> থেকে${hi !== more ? ", যদিও এতে পানি কম!" : "।"}` : "কোনো পানি যাবে না।"}`);
    else if (hi) t = L2(`Flowing from ${hi}… water moved so far: ${f6(moved)}`, `${hi} থেকে পানি যাচ্ছে… এ পর্যন্ত গেছে: ${f6(moved)}`);
    else t = L2(`Levels are equal at ${f6(hA)}: flow has stopped. This is <b>thermal equilibrium</b>. Water moved: ${f6(moved)} (this is the "heat" that flowed).`,
      `দুই তলই ${f6(hA)}-এ সমান: প্রবাহ থেমেছে। এটাই <b>তাপীয় সাম্যাবস্থা</b>। মোট গেছে: ${f6(moved)} (এটাই প্রবাহিত "তাপ")।`);
    $("#c6lo", el).innerHTML = t;
  };
  const settle = () => { const wA = +$("#c6lwA", el).value, wB = +$("#c6lwB", el).value, f = (wA * hA + wB * hB) / (wA + wB); moved += Math.abs(hA - f) * wA; hA = hB = f; };
  $("#c6lgo", el).addEventListener("click", () => { open = true; if (REDUCED) settle(); draw(); });
  $("#c6lrs", el).addEventListener("click", () => { read(); draw(); });
  onIn6(el, () => { read(); draw(); });
  read(); draw();
  if (!REDUCED) animate(el, dt => { if (!open || Math.abs(hA - hB) < 0.05) { if (open && hA !== hB) { settle(); draw(); } return; }
    const wA = +$("#c6lwA", el).value, wB = +$("#c6lwB", el).value, q = (hA - hB) * 2.2 * dt; hA -= q / wA; hB += q / wB; moved += Math.abs(q); draw(); });
};

/* 6.2 the same temperature on Celsius, Fahrenheit and Kelvin thermometers */
W.c6therm = (el) => {
  const PR = [[-40, L2("−40 (C = F)", "−৪০ (C = F)")], [0, L2("Ice melts", "বরফ গলে")], [25, L2("Room", "ঘর")], [37, L2("Body", "দেহ")], [100, L2("Water boils", "পানি ফোটে")]];
  el.innerHTML = `<div class="chipset c6tp" role="group">${PR.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 3}">${p[1]}</button>`).join("")}</div>
    ${slider("c6tc", L2("Temperature", "তাপমাত্রা"), -50, 150, 0.5, 37, "°C")}<div class="svgwrap fit" id="c6tsv"></div><div class="w-out" id="c6to"></div>`;
  const draw = () => {
    const C = sv(el, "c6tc", "°C", 1), F = 9 * C / 5 + 32, K = C + 273.15;
    const yt = 40, yb = 200, y = c => yb - (c + 50) / 200 * (yb - yt);
    const cols = [[70, "°C", c => c, 0], [180, "°F", c => 9 * c / 5 + 32, 1], [290, "K", c => c + 273.15, 2]];
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("three thermometers", "তিনটি থার্মোমিটার")}">`;
    [-40, 0, 37, 100].forEach(c => g += `<line x1="20" y1="${y(c)}" x2="345" y2="${y(c)}" stroke="var(--rule)" stroke-dasharray="3 4"/>`);
    cols.forEach(([x, u, fn, d]) => {
      g += therm6(x, yt, yb, (C + 50) / 200);
      [-40, 0, 37, 100].forEach(c => g += `<line x1="${x + 7}" y1="${y(c)}" x2="${x + 13}" y2="${y(c)}" stroke="var(--ink)"/><text x="${x + 16}" y="${y(c) + 4}" font-size="13" fill="var(--muted)">${f6(fn(c), c === 37 && d === 1 ? 1 : d === 2 ? 2 : 0)}</text>`);
      g += `<text x="${x}" y="22" font-size="15" text-anchor="middle" font-weight="700" fill="var(--ink)">${f6(fn(C), d === 2 ? 2 : 1)} ${u}</text>`;
    });
    g += `<text x="180" y="244" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("dashed lines: the same temperature on all three scales", "ড্যাশ রেখা: তিন স্কেলে একই তাপমাত্রা")}</text></svg>`;
    $("#c6tsv", el).innerHTML = g;
    $("#c6to", el).innerHTML = L2(`T<sub>F</sub> = 9 × ${f6(C, 1)}/5 + 32 = <b>${f6(F, 1)} °F</b><br>T<sub>K</sub> = ${f6(C, 1)} + 273.15 = <b>${f6(K, 2)} K</b><br><span class="muted">Absolute zero, 0 K = −273.15 °C = −459.67 °F, lies far below this scale.</span>`,
      `T<sub>F</sub> = ৯ × ${f6(C, 1)}/৫ + ৩২ = <b>${f6(F, 1)} °F</b><br>T<sub>K</sub> = ${f6(C, 1)} + ২৭৩.১৫ = <b>${f6(K, 2)} K</b><br><span class="muted">পরম শূন্য, ০ K = −২৭৩.১৫ °C = −৪৫৯.৬৭ °F, এই স্কেলের অনেক নিচে।</span>`);
  };
  chips6(el, ".c6tp", b => { $("#c6tc", el).value = PR[+b.dataset.i][0]; draw(); });
  $("#c6tc", el).addEventListener("input", () => { el.querySelectorAll(".c6tp button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); });
  draw();
};

/* 6.3.1 linear expansion of four materials, magnified */
W.c6lin = (el) => {
  const M = [[L2("Glass", "কাচ"), 9e-6], [L2("Steel", "ইস্পাত"), 12e-6], [L2("Copper", "তামা"), 17e-6], [L2("Aluminium", "অ্যালুমিনিয়াম"), 23e-6]];
  let mi = 1;
  el.innerHTML = `<div class="chipset c6lm" role="group">${M.map((m, i) => `<button data-i="${i}" aria-pressed="${i === mi}">${m[0]}</button>`).join("")}</div>
    ${slider("c6lL", L2("Length at start L₁", "শুরুর দৈর্ঘ্য L₁"), 1, 20, 0.5, 10, "m")}${slider("c6lT", L2("Temperature rise ΔT", "তাপমাত্রা বৃদ্ধি ΔT"), 0, 200, 5, 100, "K")}
    <div class="svgwrap fit" id="c6lnsv"></div><div class="w-out" id="c6lno"></div>`;
  const MAG = 50;
  const draw = () => {
    const L = sv(el, "c6lL", "m", 1), dT = sv(el, "c6lT", "K");
    const base = 60 + L * 10;
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("expanding bars", "প্রসারিত দণ্ড")}">
      <line x1="20" y1="18" x2="20" y2="200" stroke="var(--ink)" stroke-width="3"/>
      <text x="350" y="14" font-size="13" text-anchor="end" fill="var(--muted)">${L2("growth magnified ×", "বৃদ্ধি বড় করে দেখানো ×")}${B6(MAG)}</text>`;
    M.forEach(([n, a], i) => {
      const y = 30 + i * 44, grow = base * a * dT * MAG, sel = i === mi;
      g += `<rect x="20" y="${y}" width="${base + grow}" height="18" fill="${sel ? "var(--bad)" : "var(--muted)"}" opacity="${sel ? .75 : .35}"/>
        <rect x="20" y="${y}" width="${base}" height="18" fill="none" stroke="var(--ink)" stroke-dasharray="4 3"/>
        <text x="24" y="${y + 33}" font-size="13" fill="${sel ? "var(--ink)" : "var(--muted)"}">${n}: ΔL = ${f6(L * a * dT * 1000, L * a * dT * 1000 < 10 ? 2 : 1)} mm</text>`;
    });
    g += `<text x="${20 + base}" y="222" font-size="13" text-anchor="middle" fill="var(--muted)">L₁</text><line x1="${20 + base}" y1="200" x2="${20 + base}" y2="210" stroke="var(--muted)"/></svg>`;
    $("#c6lnsv", el).innerHTML = g;
    const a = M[mi][1], dL = L * a * dT;
    $("#c6lno", el).innerHTML = L2(`${M[mi][0]}: α = ${f6(a * 1e6)} × 10<sup>−6</sup> K<sup>−1</sup><br>ΔL = αL₁ΔT = ${f6(a * 1e6)} × 10<sup>−6</sup> × ${f6(L, 1)} × ${f6(dT)} = <b>${f6(dL * 1000, dL * 1000 < 10 ? 2 : 1)} mm</b>, so L₂ = ${f6(L + dL, 5)} m<br>A 1 m² plate grows by β ΔT = 2αΔT → <b>${f6(2 * a * dT * 1e4, 1)} cm²</b>; a 1 m³ block by γΔT = 3αΔT → <b>${f6(3 * a * dT * 1e6)} cm³</b>.`,
      `${M[mi][0]}: α = ${f6(a * 1e6)} × ১০<sup>−৬</sup> K<sup>−১</sup><br>ΔL = αL₁ΔT = ${f6(a * 1e6)} × ১০<sup>−৬</sup> × ${f6(L, 1)} × ${f6(dT)} = <b>${f6(dL * 1000, dL * 1000 < 10 ? 2 : 1)} mm</b>, তাই L₂ = ${f6(L + dL, 5)} m<br>১ m² পাত বাড়ে βΔT = ২αΔT → <b>${f6(2 * a * dT * 1e4, 1)} cm²</b>; ১ m³ ব্লক বাড়ে γΔT = ৩αΔT → <b>${f6(3 * a * dT * 1e6)} cm³</b>।`);
  };
  chips6(el, ".c6lm", b => { mi = +b.dataset.i; draw(); });
  onIn6(el, draw); draw();
};

/* 6.3.2 real and apparent expansion: the level first dips, then rises; gas comparison */
W.c6real = (el) => {
  const LQ = [[L2("Mercury", "পারদ"), 1.82e-4, "var(--muted)"], [L2("Alcohol", "অ্যালকোহল"), 1.1e-3, "var(--bad)"]];
  const GG = 2.7e-5, V0 = 50, TG = 0.8, TL = 2.5; // glass γ, bulb volume (cc), time constants (s)
  let li = 0, t = 0, run = false;
  el.innerHTML = `<div class="chipset c6rl" role="group">${LQ.map((q, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${q[0]}</button>`).join("")}</div>
    ${slider("c6rdT", L2("Final temperature rise", "শেষ তাপমাত্রা বৃদ্ধি"), 10, 60, 5, 40, "K")}${slider("c6rtm", L2("Heating time", "তাপ দেওয়ার সময়"), 0, 12, 0.1, 0, "s")}
    <div class="w-row"><button class="btn solid" id="c6rgo">${L2("Heat", "তাপ দাও")}</button></div>
    <div class="svgwrap fit" id="c6rsv"></div><div class="w-out" id="c6ro"></div>`;
  const state = (tt, dT) => { const tg = dT * (1 - Math.exp(-tt / TG)), tl = dT * (1 - Math.exp(-Math.max(0, tt - 1.5) / TL)); const cont = V0 * GG * tg, real = V0 * LQ[li][1] * tl; return { cont, real, app: real - cont }; };
  const draw = () => {
    const dT = sv(el, "c6rdT", "K"); $("#c6rtm", el).value = t; sv(el, "c6rtm", "s", 1);
    const fin = state(40, dT), sc = 120 / (V0 * LQ[li][1] * 60); // px per cc (scaled so max rise fits)
    const now = state(t, dT);
    let minA = 0, tMin = 0; for (let tt = 0; tt <= 12; tt += 0.05) { const a = state(tt, dT).app; if (a < minA) { minA = a; tMin = tt; } }
    const yA = 165, col = LQ[li][2], sx = 70, lvl = yA - now.app * sc;
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("liquid in a bulb", "বাল্বে তরল")}">
      <circle cx="${sx}" cy="208" r="${30 + (t > 0 ? now.cont / (V0 * GG * 60) * 3 : 0)}" fill="${col}" opacity=".55" stroke="var(--ink)" stroke-width="1.5"/>
      <rect x="${sx - 6}" y="18" width="12" height="165" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.2"/>
      <rect x="${sx - 4}" y="${lvl}" width="8" height="${190 - lvl}" fill="${col}"/>
      <line x1="${sx - 16}" y1="${yA}" x2="${sx + 16}" y2="${yA}" stroke="var(--ink)"/><text x="${sx - 20}" y="${yA + 4}" font-size="13" text-anchor="end" fill="var(--ink)">A</text>`;
    if (t >= tMin && minA < 0) g += `<line x1="${sx + 8}" y1="${yA - minA * sc}" x2="${sx + 20}" y2="${yA - minA * sc}" stroke="var(--c)" stroke-width="2"/><text x="${sx + 23}" y="${yA - minA * sc + 10}" font-size="13" fill="var(--c)">B</text>`;
    if (t >= 11.9) g += `<line x1="${sx - 16}" y1="${lvl}" x2="${sx + 16}" y2="${lvl}" stroke="var(--bad)"/><text x="${sx - 20}" y="${lvl + 4}" font-size="13" text-anchor="end" fill="var(--bad)">C</text>`;
    if (t > 0 && run) g += `<path d="M${sx - 18} 246 q6 -10 0 -18 M${sx} 246 q6 -10 0 -18 M${sx + 18} 246 q6 -10 0 -18" fill="none" stroke="var(--bad)" stroke-width="2"/>`;
    // graph: level above A vs time
    const gx = 160, gy = 180, gw = 185, gh = 150, ymax = V0 * LQ[li][1] * 60, ymin = -Math.max(0.15 * ymax, -minA * 1.3);
    const X = tt => gx + tt / 12 * gw, Y = v => gy - (v - ymin) / (ymax - ymin) * gh;
    g += `<line x1="${gx}" y1="${Y(0)}" x2="${gx + gw}" y2="${Y(0)}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
      <text x="${gx + gw}" y="${Y(0) + 16}" font-size="13" text-anchor="end" fill="var(--muted)">${L2("time", "সময়")}</text><text x="${gx + 4}" y="${gy - gh - 6}" font-size="13" fill="var(--muted)">${L2("level above A (cc)", "A-র ওপরে তল (cc)")}</text>
      <text x="${gx - 3}" y="${Y(0) + 4}" font-size="13" text-anchor="end" fill="var(--muted)">A</text>`;
    let pts = ""; for (let tt = 0; tt <= t + 1e-9; tt += 0.1) pts += `${X(tt).toFixed(1)},${Y(state(tt, dT).app).toFixed(1)} `;
    g += `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.5"/><circle cx="${X(t)}" cy="${Y(now.app)}" r="5" fill="var(--bad)"/></svg>`;
    $("#c6rsv", el).innerHTML = g;
    const air = 100 * dT / 300;
    $("#c6ro", el).innerHTML = L2(`Glass bulb (container) grew by <b>${f6(now.cont, 3)} cc</b>; ${LQ[li][0].toLowerCase()} really grew by <b>${f6(now.real, 3)} cc</b>; level shows apparent expansion <b>${f6(now.app, 3)} cc</b>${now.app < 0 ? " (below A: the glass warmed first!)" : ""}.<br>Real = apparent + container: ${f6(now.app, 3)} + ${f6(now.cont, 3)} = ${f6(now.real, 3)} cc.<br><span class="muted">For comparison, ${B6(100)} cc of air at 300 K heated by ${f6(dT)} K at constant pressure grows by about ${f6(air, 1)} cc; ${B6(100)} cc of ${LQ[li][0].toLowerCase()} by only ${f6(100 * LQ[li][1] * dT, 2)} cc.</span>`,
      `কাচের বাল্ব (পাত্র) বেড়েছে <b>${f6(now.cont, 3)} cc</b>; ${LQ[li][0]} আসলে বেড়েছে <b>${f6(now.real, 3)} cc</b>; তল দেখাচ্ছে আপাত প্রসারণ <b>${f6(now.app, 3)} cc</b>${now.app < 0 ? " (A-র নিচে: কাচ আগে গরম হয়েছে!)" : ""}।<br>প্রকৃত = আপাত + পাত্র: ${f6(now.app, 3)} + ${f6(now.cont, 3)} = ${f6(now.real, 3)} cc।<br><span class="muted">তুলনা করো: ৩০০ K-এর ${B6(100)} cc বাতাস স্থির চাপে ${f6(dT)} K গরম করলে প্রায় ${f6(air, 1)} cc বাড়ে; ${B6(100)} cc ${LQ[li][0]} বাড়ে মাত্র ${f6(100 * LQ[li][1] * dT, 2)} cc।</span>`);
  };
  chips6(el, ".c6rl", b => { li = +b.dataset.i; draw(); });
  $("#c6rdT", el).addEventListener("input", draw);
  $("#c6rtm", el).addEventListener("input", () => { run = false; t = +$("#c6rtm", el).value; draw(); });
  $("#c6rgo", el).addEventListener("click", () => { if (REDUCED) { t = 12; draw(); } else { t = 0; run = true; } });
  draw();
  if (!REDUCED) animate(el, dt => { if (!run) return; t = Math.min(12, t + dt * 1.5); if (t >= 12) run = false; draw(); });
};

/* 6.4 heating curve of ice → water → steam, and factors of evaporation */
W.c6curve = (el) => {
  const SI = 2100, SW = 4200, SS = 2010, LF = 334000, LV = 2260000;
  let mode = "h", p = 0, run = false;
  el.innerHTML = `<div class="chipset c6cm" role="group"><button data-k="h" aria-pressed="true">${L2("Heating curve", "তাপ দেওয়ার লেখ")}</button><button data-k="e" aria-pressed="false">${L2("Evaporation", "বাষ্পায়ন")}</button></div><div id="c6cbox"></div>`;
  const box = $("#c6cbox", el);
  const segs = (m) => { const q = [m * SI * 20, m * LF, m * SW * 100, m * LV, m * SS * 20]; let c = 0; return q.map(v => (c += v)); }; // cumulative J
  const tempAt = (Q, m) => { const c = segs(m);
    if (Q <= c[0]) return [-20 + Q / (m * SI), 0, 0]; if (Q <= c[1]) return [0, 1, (Q - c[0]) / (m * LF)];
    if (Q <= c[2]) return [(Q - c[1]) / (m * SW), 2, 1]; if (Q <= c[3]) return [100, 3, (Q - c[2]) / (m * LV)];
    return [100 + (Q - c[3]) / (m * SS), 4, 1]; };
  const heat = () => {
    box.innerHTML = slider("c6cm1", L2("Mass of ice", "বরফের ভর"), 0.2, 2, 0.1, 1, "kg") + slider("c6cpow", L2("Heater power", "হিটারের ক্ষমতা"), 500, 3000, 100, 2000, "W") + slider("c6cprog", L2("Heat supplied so far", "এ পর্যন্ত দেওয়া তাপ"), 0, 100, 0.5, p * 100, "%") +
      `<div class="w-row"><button class="btn solid" id="c6cgo">${L2("Heat", "তাপ দাও")}</button></div><div class="svgwrap fit" id="c6csv"></div><div class="w-out" id="c6co"></div>`;
    const draw = () => {
      const m = sv(el, "c6cm1", "kg", 1), P = sv(el, "c6cpow", "W"); $("#c6cprog", el).value = p * 100; sv(el, "c6cprog", "%");
      const c = segs(m), tot = c[4], Q = p * tot, [T, ph, fr] = tempAt(Q, m), tTot = tot / P;
      const gx = 44, gy = 200, gw = 200, gh = 170, X = q => gx + q / tot * gw, Y = tt => gy - (tt + 30) / 160 * gh;
      let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("heating curve", "তাপ দেওয়ার লেখ")}">
        <line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
        <text x="${gx + gw}" y="${gy + 30}" font-size="13" text-anchor="end" fill="var(--muted)">${L2("time (min)", "সময় (min)")}</text><text x="${gx - 36}" y="${gy - gh - 8}" font-size="13" fill="var(--muted)">T (°C)</text>`;
      [-20, 0, 50, 100, 120].forEach(tt => g += `<line x1="${gx - 4}" y1="${Y(tt)}" x2="${gx}" y2="${Y(tt)}" stroke="var(--muted)"/><text x="${gx - 7}" y="${Y(tt) + 4}" font-size="13" text-anchor="end" fill="var(--muted)">${f6(tt)}</text>`);
      [0, 0.5, 1].forEach(f => g += `<text x="${gx + f * gw}" y="${gy + 16}" font-size="13" text-anchor="middle" fill="var(--muted)">${f6(f * tTot / 60, 1)}</text>`);
      const pts = [[0, -20], [c[0], 0], [c[1], 0], [c[2], 100], [c[3], 100], [c[4], 120]];
      g += `<polyline points="${pts.map(([q, tt]) => `${X(q)},${Y(tt)}`).join(" ")}" fill="none" stroke="var(--rule)" stroke-width="2"/>`;
      const done = pts.filter(([q]) => q <= Q).concat([[Q, T]]);
      g += `<polyline points="${done.map(([q, tt]) => `${X(q).toFixed(1)},${Y(tt).toFixed(1)}`).join(" ")}" fill="none" stroke="var(--bad)" stroke-width="3"/><circle cx="${X(Q)}" cy="${Y(T)}" r="5" fill="var(--bad)"/>
        <text x="${X(c[1]) + 6}" y="${Y(0) + 16}" font-size="13" text-anchor="start" fill="var(--c)">${L2("melting", "গলন")}</text>
        <text x="${(X(c[2]) + X(c[3])) / 2}" y="${Y(100) - 7}" font-size="13" text-anchor="middle" fill="var(--c)">${L2("boiling", "স্ফুটন")}</text>`;
      // pot with contents
      const px = 268, pw = 80, pb = 200, iceF = ph === 0 ? 1 : ph === 1 ? 1 - fr : 0, watF = ph === 1 ? fr : ph === 2 ? 1 : ph === 3 ? 1 - fr : 0;
      g += `<path d="M${px} 110 V${pb} H${px + pw} V110" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
      const hW = 60 * watF, hI = 60 * iceF;
      if (hW > 0) g += `<rect x="${px + 2}" y="${pb - hW}" width="${pw - 4}" height="${hW}" fill="var(--c)" opacity=".45"/>`;
      if (hI > 0) for (let i = 0; i < 3; i++) g += `<rect x="${px + 8 + i * 23}" y="${pb - hW - hI * (0.9 - i * 0.12)}" width="18" height="${hI * (0.9 - i * 0.12)}" rx="3" fill="var(--sheet)" stroke="var(--c)" stroke-width="1.5"/>`;
      if (ph >= 3) for (let i = 0; i < 4; i++) g += `<path d="M${px + 14 + i * 18} 100 q7 -12 0 -24 q-7 -12 0 -24" fill="none" stroke="var(--muted)" stroke-width="2" opacity="${ph === 4 ? 0.9 : 0.4 + fr * 0.5}"/>`;
      if (ph === 3) for (let i = 0; i < 6; i++) g += `<circle cx="${px + 12 + i * 11}" cy="${pb - 8 - ((i * 13) % Math.max(4, hW - 6))}" r="3" fill="none" stroke="var(--ink)"/>`;
      g += `<text x="${px + pw / 2}" y="${pb + 18}" font-size="15" text-anchor="middle" font-weight="700" fill="var(--bad)">${f6(T, 1)} °C</text></svg>`;
      $("#c6csv", el).innerHTML = g;
      const PH = [L2("Warming the ice", "বরফ গরম হচ্ছে"), L2(`Melting: ${f6(fr * 100)}% melted. Temperature stays at 0 °C; the heat is latent heat of fusion.`, `গলন: ${f6(fr * 100)}% গলেছে। তাপমাত্রা ০ °C-এ স্থির; তাপটা গলনের সুপ্ততাপ।`),
        L2("Warming the water", "পানি গরম হচ্ছে"), L2(`Boiling: ${f6(fr * 100)}% turned to steam. Temperature stays at 100 °C; the heat is latent heat of vaporization.`, `স্ফুটন: ${f6(fr * 100)}% বাষ্প হয়েছে। তাপমাত্রা ১০০ °C-এ স্থির; তাপটা বাষ্পীভবনের সুপ্ততাপ।`), L2("Heating the steam", "বাষ্প গরম হচ্ছে")];
      $("#c6co", el).innerHTML = `<b>${PH[ph]}</b><br>` + L2(`Heat so far Q = ${f6(Q / 1000)} kJ, time = ${f6(Q / P / 60, 1)} min. Melting needs mL<sub>f</sub> = ${f6(m * LF / 1000)} kJ; boiling away needs mL<sub>v</sub> = ${f6(m * LV / 1000)} kJ, the longest flat step.`,
        `এ পর্যন্ত তাপ Q = ${f6(Q / 1000)} kJ, সময় = ${f6(Q / P / 60, 1)} min। গলাতে লাগে mL<sub>f</sub> = ${f6(m * LF / 1000)} kJ; সব বাষ্প করতে লাগে mL<sub>v</sub> = ${f6(m * LV / 1000)} kJ, সবচেয়ে লম্বা সমতল ধাপ।`);
    };
    $("#c6cgo", el).addEventListener("click", () => { if (REDUCED) { p = Math.min(1, p + 0.1); draw(); } else { if (p >= 1) p = 0; run = true; } });
    $("#c6cprog", el).addEventListener("input", () => { run = false; p = +$("#c6cprog", el).value / 100; draw(); });
    onIn6(box, () => { if (!run) p = +$("#c6cprog", el).value / 100; draw(); });
    draw();
    return draw;
  };
  const evap = () => {
    const F = { area: 1, liq: 0, pres: 0 };
    box.innerHTML = slider("c6ew", L2("Wind speed", "বাতাসের বেগ"), 0, 3, 1, 1, "") + slider("c6et", L2("Air temperature", "বাতাসের তাপমাত্রা"), 10, 40, 1, 30, "°C") + slider("c6eh", L2("Humidity (moisture in air)", "আর্দ্রতা (বাতাসে জলীয় বাষ্প)"), 20, 95, 5, 60, "%") +
      `<div class="chipset c6ea" role="group"><button data-v="0" aria-pressed="false">${L2("Folded", "ভাঁজ করা")}</button><button data-v="1" aria-pressed="true">${L2("Spread out", "মেলে দেওয়া")}</button></div>
      <div class="chipset c6el" role="group"><button data-v="0" aria-pressed="true">${L2("Water", "পানি")}</button><button data-v="1" aria-pressed="false">${L2("Spirit (volatile)", "স্পিরিট (উদ্বায়ী)")}</button></div>
      <div class="chipset c6ep" role="group"><button data-v="0" aria-pressed="true">${L2("Normal air pressure", "স্বাভাবিক বায়ুচাপ")}</button><button data-v="1" aria-pressed="false">${L2("Low pressure", "কম চাপ")}</button></div>
      <div class="svgwrap fit" id="c6esv"></div><div class="w-out" id="c6eo"></div>`;
    const ps = T => Math.exp(17.27 * T / (T + 237.3)); // relative saturation vapour pressure
    const draw = () => {
      const w = sv(el, "c6ew", ""), T = sv(el, "c6et", "°C"), h = sv(el, "c6eh", "%");
      $("#c6ew-v", el).textContent = [L2("still", "স্থির"), L2("light", "মৃদু"), L2("breezy", "ঝিরঝিরে"), L2("strong", "জোরালো")][w];
      const rate = (1 + 0.9 * w) * (F.area ? 3 : 1) * (F.liq ? 4 : 1) * (F.pres ? 1.8 : 1) * ps(T) / ps(30) * (1 - h / 100) / 0.4 / 5.7;
      const hours = 3 / rate; // calibrated: spread shirt, light wind, 30 °C, 60% → about 3 h
      let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("drying clothes", "কাপড় শুকানো")}">
        <line x1="20" y1="40" x2="250" y2="40" stroke="var(--ink)" stroke-width="2"/>`;
      if (h < 70) g += `<circle cx="320" cy="40" r="${10 + (T - 10) / 3}" fill="var(--note)" opacity=".8"/>`; else g += `<path d="M290 50 q0 -18 18 -18 q6 -14 22 -8 q18 0 16 18 q10 4 4 14 h-56 q-10 -2 -4 -6z" fill="var(--muted)" opacity=".6"/>`;
      for (let i = 0; i < w; i++) g += arr6(20, 90 + i * 22, 70, 90 + i * 22, "var(--c)", 2);
      const wet = Math.min(1, hours / 8);
      if (F.area) g += `<path d="M100 40 h110 l20 30 -22 10 v90 h-86 v-90 l-22 -10z" fill="var(--c)" opacity="${0.15 + wet * 0.6}" stroke="var(--ink)"/>`;
      else g += `<rect x="130" y="40" width="50" height="60" fill="var(--c)" opacity="${0.15 + wet * 0.6}" stroke="var(--ink)"/><line x1="130" y1="60" x2="180" y2="60" stroke="var(--ink)"/><line x1="130" y1="80" x2="180" y2="80" stroke="var(--ink)"/>`;
      g += `<text x="20" y="194" font-size="14" fill="var(--ink)">${L2("time to dry ≈", "শুকাতে সময় ≈")} <tspan font-weight="700">${hours < 1 ? f6(hours * 60) + " min" : f6(hours, 1) + " h"}</tspan></text>
        <rect x="200" y="182" width="150" height="12" rx="6" fill="none" stroke="var(--rule)"/><rect x="200" y="182" width="${Math.max(3, Math.min(150, 150 * rate / 6))}" height="12" rx="6" fill="var(--good)"/></svg>`;
      $("#c6esv", el).innerHTML = g;
      $("#c6eo", el).innerHTML = L2(`Relative evaporation rate: <b>${f6(rate, 2)}</b> (green bar). More wind, larger surface, a volatile liquid, lower pressure, higher temperature and drier air all make it faster.<br><span class="muted">A simple model for comparison, not an exact forecast.</span>`,
        `আপেক্ষিক বাষ্পায়নের হার: <b>${f6(rate, 2)}</b> (সবুজ দণ্ড)। বেশি বাতাস, বড় তল, উদ্বায়ী তরল, কম চাপ, বেশি তাপমাত্রা আর শুষ্ক বাতাস, সবই বাষ্পায়ন দ্রুত করে।<br><span class="muted">তুলনার জন্য একটি সরল মডেল, নিখুঁত পূর্বাভাস নয়।</span>`);
    };
    chips6(el, ".c6ea", b => { F.area = +b.dataset.v; draw(); }); chips6(el, ".c6el", b => { F.liq = +b.dataset.v; draw(); }); chips6(el, ".c6ep", b => { F.pres = +b.dataset.v; draw(); });
    onIn6(box, draw); draw();
  };
  let drawH = heat();
  chips6(el, ".c6cm", b => { mode = b.dataset.k; run = false; if (mode === "h") drawH = heat(); else { drawH = null; evap(); } });
  if (!REDUCED) animate(el, dt => { if (!run || !drawH) return; p = Math.min(1, p + dt * 0.08); if (p >= 1) run = false; drawH(); });
};

/* 6.5 same heat into 1 kg of different materials */
W.c6spec = (el) => {
  const S = [[L2("Water", "পানি"), 4200], [L2("Aluminium", "অ্যালুমিনিয়াম"), 900], [L2("Iron", "লোহা"), 450], [L2("Copper", "তামা"), 390], [L2("Gold", "সোনা"), 130]];
  el.innerHTML = slider("c6sQ", L2("Heat given Q", "প্রদত্ত তাপ Q"), 1, 50, 1, 10, "kJ") + slider("c6sm", L2("Mass of each m", "প্রতিটির ভর m"), 0.1, 2, 0.1, 1, "kg") + `<div class="svgwrap fit" id="c6ssv"></div><div class="w-out" id="c6so"></div>`;
  const draw = () => {
    const Q = sv(el, "c6sQ", "kJ") * 1000, m = sv(el, "c6sm", "kg", 1);
    const yt = 40, yb = 180, T0 = 25, Tmax = 125, Y = T => yb - (T - T0) / (Tmax - T0) * (yb - yt);
    let g = `<svg viewBox="0 0 360 245" role="img" aria-label="${L2("thermometers", "থার্মোমিটার")}">`;
    [25, 50, 75, 100, 125].forEach(T => g += `<line x1="30" y1="${Y(T)}" x2="350" y2="${Y(T)}" stroke="var(--rule)" stroke-dasharray="3 4"/><text x="26" y="${Y(T) + 4}" font-size="13" text-anchor="end" fill="var(--muted)">${f6(T)}</text>`);
    g += `<text x="4" y="24" font-size="13" fill="var(--muted)">°C</text>`;
    S.forEach(([n, s], i) => {
      const x = 62 + i * 66, dT = Q / (m * s), T = T0 + dT, off = T > Tmax;
      g += therm6(x, yt, yb, (Math.min(T, Tmax) - T0) / (Tmax - T0), i === 0 ? "var(--c)" : "var(--bad)");
      g += `<text x="${x}" y="${yt - 12}" font-size="13" text-anchor="middle" font-weight="700" fill="var(--ink)">${off ? "↑ " : "+"}${f6(dT, dT < 10 ? 1 : 0)} K</text>
        <text x="${x}" y="218" font-size="13" text-anchor="middle" fill="var(--ink)">${n}</text><text x="${x}" y="236" font-size="13" text-anchor="middle" fill="var(--muted)">${f6(s)}</text>`;
    });
    g += `</svg>`;
    $("#c6ssv", el).innerHTML = g;
    const dW = Q / (m * 4200), dF = Q / (m * 450);
    $("#c6so", el).innerHTML = L2(`All start at 25 °C. ΔT = Q/(ms). Water: ${f6(Q)} ÷ (${f6(m, 1)} × 4200) = <b>${f6(dW, 2)} K</b>; iron: ${f6(Q)} ÷ (${f6(m, 1)} × 450) = <b>${f6(dF, 1)} K</b>, about ${f6(dF / dW, 1)} times more.<br>Heat capacity C = ms: water ${f6(m * 4200)} J/K, iron ${f6(m * 450)} J/K. <span class="muted">(Numbers under the names: s in J kg⁻¹ K⁻¹.)</span>`,
      `সবাই শুরু করে ২৫ °C থেকে। ΔT = Q/(ms)। পানি: ${f6(Q)} ÷ (${f6(m, 1)} × ৪২০০) = <b>${f6(dW, 2)} K</b>; লোহা: ${f6(Q)} ÷ (${f6(m, 1)} × ৪৫০) = <b>${f6(dF, 1)} K</b>, প্রায় ${f6(dF / dW, 1)} গুণ বেশি।<br>তাপ ধারণক্ষমতা C = ms: পানি ${f6(m * 4200)} J/K, লোহা ${f6(m * 450)} J/K। <span class="muted">(নামের নিচের সংখ্যা: s, J kg⁻¹ K⁻¹ এককে।)</span>`);
  };
  onIn6(el, draw); draw();
};

/* 6.6 mixing: heat lost = heat gained */
W.c6mix = (el) => {
  const PRE = [
    { n: L2("Hot + cold water", "গরম + ঠান্ডা পানি"), hot: L2("Hot water", "গরম পানি"), sh: 4200, mh: [0.1, 5, 0.1, 2], th: [30, 100, 1, 75], mc: [0.1, 5, 0.1, 1], tc: [0, 60, 1, 20], ice: false },
    { n: L2("Hot iron in water", "পানিতে গরম লোহা"), hot: L2("Iron", "লোহা"), sh: 450, mh: [0.01, 2, 0.01, 0.01], th: [50, 500, 5, 120], mc: [0.1, 5, 0.1, 1], tc: [0, 60, 1, 30], ice: false },
    { n: L2("Ice in water", "পানিতে বরফ"), hot: L2("Warm water", "কুসুম গরম পানি"), sh: 4200, mh: [0.1, 5, 0.1, 1], th: [10, 100, 1, 30], mc: [0.01, 1, 0.01, 0.1], tc: [0, 0, 1, 0], ice: true }];
  let pi = 0;
  el.innerHTML = `<div class="chipset c6xp" role="group">${PRE.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${p.n}</button>`).join("")}</div><div id="c6xc"></div><div class="svgwrap fit" id="c6xsv"></div><div class="w-out" id="c6xo"></div>`;
  const SW = 4200, LF = 334000;
  const build = () => {
    const P = PRE[pi];
    $("#c6xc", el).innerHTML = slider("c6xmh", L2(`${P.hot}: mass`, `${P.hot}: ভর`), ...P.mh, "kg") + slider("c6xth", L2(`${P.hot}: temperature`, `${P.hot}: তাপমাত্রা`), ...P.th, "°C") +
      slider("c6xmc", P.ice ? L2("Ice at 0 °C: mass", "০ °C-এর বরফ: ভর") : L2("Cold water: mass", "ঠান্ডা পানি: ভর"), ...P.mc, "kg") + (P.ice ? "" : slider("c6xtc", L2("Cold water: temperature", "ঠান্ডা পানি: তাপমাত্রা"), ...P.tc, "°C"));
    onIn6($("#c6xc", el), draw); draw();
  };
  const draw = () => {
    const P = PRE[pi], mh = sv(el, "c6xmh", "kg", 2), th = sv(el, "c6xth", "°C"), mc = sv(el, "c6xmc", "kg", 2), tc = P.ice ? 0 : sv(el, "c6xtc", "°C");
    const Ch = mh * P.sh; let T, lost, melt = 0, warm = 0, left = 0;
    if (!P.ice) { T = (Ch * th + mc * SW * tc) / (Ch + mc * SW); lost = Ch * (th - T); warm = mc * SW * (T - tc); }
    else { const need = mc * LF;
      if (Ch * th <= need) { T = 0; lost = Ch * th; melt = lost; left = mc - lost / LF; }
      else { T = (Ch * th - need) / (Ch + mc * SW); lost = Ch * (th - T); melt = need; warm = mc * SW * T; } }
    const yt = 40, yb = 170, Y = t => (t - 0) / Math.max(100, th) ;
    const fr = t => t / Math.max(100, th);
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("mixing", "মিশ্রণ")}">
      ${therm6(40, yt, yb, fr(th))}<text x="40" y="24" font-size="13" text-anchor="middle" fill="var(--bad)" font-weight="700">${f6(th)} °C</text>
      ${therm6(110, yt, yb, fr(tc), "var(--c)")}<text x="110" y="24" font-size="13" text-anchor="middle" fill="var(--c)" font-weight="700">${f6(tc)} °C</text>
      ${therm6(180, yt, yb, fr(T), "var(--note)")}<text x="180" y="24" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${f6(T, 1)} °C</text>
      <text x="40" y="218" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("hot", "গরম")}</text><text x="110" y="218" font-size="13" text-anchor="middle" fill="var(--muted)">${P.ice ? L2("ice", "বরফ") : L2("cold", "ঠান্ডা")}</text><text x="180" y="218" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("final", "শেষ")}</text>`;
    const gain = melt + warm, mx = Math.max(lost, gain, 1), H = 150, bx = 240;
    g += `<line x1="228" y1="${yb + 14}" x2="355" y2="${yb + 14}" stroke="var(--muted)"/>
      <rect x="${bx}" y="${yb + 14 - lost / mx * H}" width="44" height="${lost / mx * H}" fill="var(--bad)" opacity=".75"/>
      <rect x="${bx + 58}" y="${yb + 14 - warm / mx * H}" width="44" height="${warm / mx * H}" fill="var(--c)" opacity=".75"/>
      <rect x="${bx + 58}" y="${yb + 14 - gain / mx * H}" width="44" height="${melt / mx * H}" fill="var(--c)" opacity=".35" stroke="var(--c)" stroke-dasharray="3 2"/>
      <text x="${bx + 22}" y="202" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("lost", "হারানো")}</text><text x="${bx + 80}" y="202" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("gained", "গৃহীত")}</text>
      <text x="${bx + 51}" y="218" font-size="13" text-anchor="middle" fill="var(--muted)">${f6(lost / 1000, 1)} kJ = ${f6(gain / 1000, 1)} kJ</text>`;
    if (melt > 0) g += `<text x="${bx + 80}" y="${yb + 14 - gain / mx * H + 14}" font-size="12" text-anchor="middle" fill="var(--c)">mL</text>`;
    g += `</svg>`;
    $("#c6xsv", el).innerHTML = g;
    let o;
    if (!P.ice) o = L2(`Heat lost = m₁s₁(T₁ − T) = ${f6(mh, 2)} × ${f6(P.sh)} × (${f6(th)} − ${f6(T, 1)}) = <b>${f6(lost)} J</b><br>Heat gained = m₂s₂(T − T₂) = ${f6(mc, 2)} × 4200 × (${f6(T, 1)} − ${f6(tc)}) = <b>${f6(warm)} J</b><br>Final temperature T = <b>${f6(T, 1)} °C</b>`,
      `হারানো তাপ = m₁s₁(T₁ − T) = ${f6(mh, 2)} × ${f6(P.sh)} × (${f6(th)} − ${f6(T, 1)}) = <b>${f6(lost)} J</b><br>গৃহীত তাপ = m₂s₂(T − T₂) = ${f6(mc, 2)} × ৪২০০ × (${f6(T, 1)} − ${f6(tc)}) = <b>${f6(warm)} J</b><br>শেষ তাপমাত্রা T = <b>${f6(T, 1)} °C</b>`);
    else if (left > 0) o = L2(`The warm water can give only ${f6(lost)} J by cooling to 0 °C, but melting all the ice needs ${f6(mc * LF)} J. So the mixture stays at <b>0 °C</b> with <b>${f6(left * 1000)} g of ice left</b>.`,
      `কুসুম গরম পানি ০ °C পর্যন্ত ঠান্ডা হয়ে দিতে পারে মাত্র ${f6(lost)} J, কিন্তু সব বরফ গলাতে লাগে ${f6(mc * LF)} J। তাই মিশ্রণ <b>০ °C</b>-এ থাকে, আর <b>${f6(left * 1000)} g বরফ থেকে যায়</b>।`);
    else o = L2(`Heat to melt the ice mL = ${f6(mc, 2)} × 334 000 = ${f6(melt)} J; to warm the melted water to T: ${f6(warm)} J. Total gained <b>${f6(gain)} J</b> = heat lost by warm water <b>${f6(lost)} J</b>.<br>Final temperature T = <b>${f6(T, 1)} °C</b>`,
      `বরফ গলাতে mL = ${f6(mc, 2)} × ৩৩৪ ০০০ = ${f6(melt)} J; গলা পানিকে T পর্যন্ত গরম করতে ${f6(warm)} J। মোট গৃহীত <b>${f6(gain)} J</b> = কুসুম গরম পানির হারানো তাপ <b>${f6(lost)} J</b>।<br>শেষ তাপমাত্রা T = <b>${f6(T, 1)} °C</b>`);
    $("#c6xo", el).innerHTML = o;
  };
  chips6(el, ".c6xp", b => { pi = +b.dataset.i; build(); });
  build();
};

/* 6.7 boiling point of water vs pressure; melting point of ice */
W.c6press = (el) => {
  const PL = [[0.33, L2("Everest top", "এভারেস্ট চূড়া")], [0.89, L2("Hill, ~1000 m", "পাহাড়, ~১০০০ m")], [1, L2("Dhaka", "ঢাকা")], [2, L2("Pressure cooker", "প্রেশার কুকার")]];
  const Tb = P => { const mm = P * 760, [A, B, C] = mm <= 760 ? [8.07131, 1730.63, 233.426] : [8.14019, 1810.94, 244.485]; return B / (A - Math.log10(mm)) - C; };
  el.innerHTML = `<div class="chipset c6pp" role="group">${PL.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 2}">${p[1]}</button>`).join("")}</div>
    ${slider("c6pP", L2("Pressure above the water", "পানির ওপরের চাপ"), 0.2, 3, 0.01, 1, "atm")}<div class="svgwrap fit" id="c6psv"></div><div class="w-out" id="c6po"></div>`;
  let t = 0;
  const draw = () => {
    const P = sv(el, "c6pP", "atm", 2), T = Tb(P);
    const gx = 44, gy = 200, gw = 190, gh = 170, X = p => gx + (p - 0.2) / 2.8 * gw, Y = tt => gy - (tt - 50) / 90 * gh;
    let g = `<svg viewBox="0 0 360 235" role="img" aria-label="${L2("boiling point and pressure", "স্ফুটনাঙ্ক ও চাপ")}">
      <line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
      <text x="${gx + gw}" y="${gy + 30}" font-size="13" text-anchor="end" fill="var(--muted)">P (atm)</text><text x="${gx - 38}" y="${gy - gh - 8}" font-size="13" fill="var(--muted)">${L2("boiling point (°C)", "স্ফুটনাঙ্ক (°C)")}</text>`;
    [60, 80, 100, 120, 140].forEach(tt => g += `<line x1="${gx}" y1="${Y(tt)}" x2="${gx + gw}" y2="${Y(tt)}" stroke="var(--rule)" stroke-dasharray="2 4"/><text x="${gx - 6}" y="${Y(tt) + 4}" font-size="13" text-anchor="end" fill="var(--muted)">${f6(tt)}</text>`);
    [0.5, 1, 2, 3].forEach(p => g += `<text x="${X(p)}" y="${gy + 16}" font-size="13" text-anchor="middle" fill="var(--muted)">${f6(p, p === 0.5 ? 1 : 0)}</text>`);
    let pts = ""; for (let p = 0.2; p <= 3.001; p += 0.05) pts += `${X(p).toFixed(1)},${Y(Tb(p)).toFixed(1)} `;
    g += `<polyline points="${pts}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
    PL.forEach(([p]) => g += `<circle cx="${X(p)}" cy="${Y(Tb(p))}" r="3" fill="var(--muted)"/>`);
    g += `<line x1="${X(P)}" y1="${gy}" x2="${X(P)}" y2="${Y(T)}" stroke="var(--bad)" stroke-dasharray="3 3"/><line x1="${gx}" y1="${Y(T)}" x2="${X(P)}" y2="${Y(T)}" stroke="var(--bad)" stroke-dasharray="3 3"/><circle cx="${X(P)}" cy="${Y(T)}" r="6" fill="var(--bad)"/>`;
    // pot with bubbles
    const px = 262, pw = 86, pb = 200, top = 120;
    g += `<rect x="${px + 2}" y="${top + 10}" width="${pw - 4}" height="${pb - top - 10}" fill="var(--c)" opacity=".35"/><path d="M${px} ${top - 10} V${pb} H${px + pw} V${top - 10}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    for (let i = 0; i < 6; i++) { const ph = (t * 0.7 + i / 6) % 1; g += `<circle cx="${px + 12 + i * 12}" cy="${pb - 6 - ph * (pb - top - 20)}" r="${2 + ph * 3}" fill="none" stroke="var(--ink)" opacity="${1 - ph * 0.6}"/>`; }
    const n = Math.round(Math.min(8, P * 3));
    for (let i = 0; i < n; i++) g += arr6(px + 10 + i * (pw - 20) / Math.max(1, n - 1 || 1), top - 40, px + 10 + i * (pw - 20) / Math.max(1, n - 1 || 1), top - 14, "var(--muted)", 2);
    g += `<text x="${px + pw / 2}" y="${pb + 20}" font-size="15" text-anchor="middle" font-weight="700" fill="var(--bad)">${f6(T, 1)} °C</text></svg>`;
    $("#c6psv", el).innerHTML = g;
    const dm = -0.0075 * (P - 1);
    $("#c6po", el).innerHTML = L2(`At ${f6(P, 2)} atm water boils at about <b>${f6(T, 1)} °C</b>${P < 0.98 ? ": lower than 100 °C, so food cooks more slowly." : P > 1.02 ? ": hotter than 100 °C, so food cooks faster." : "."}<br>Melting point of ice at this pressure: about ${f6(dm, 4)} °C <span class="muted">(pressure lowers it only very slightly, about 0.0075 °C per atm).</span>`,
      `${f6(P, 2)} atm চাপে পানি ফোটে প্রায় <b>${f6(T, 1)} °C</b>-এ${P < 0.98 ? ": ১০০ °C-এর কম, তাই রান্না ধীরে হয়।" : P > 1.02 ? ": ১০০ °C-এর বেশি, তাই রান্না তাড়াতাড়ি হয়।" : "।"}<br>এই চাপে বরফের গলনাঙ্ক: প্রায় ${f6(dm, 4)} °C <span class="muted">(চাপ একে খুব সামান্যই কমায়, প্রতি atm-এ প্রায় ০.০০৭৫ °C)।</span>`);
  };
  chips6(el, ".c6pp", b => { $("#c6pP", el).value = PL[+b.dataset.i][0]; draw(); });
  $("#c6pP", el).addEventListener("input", () => { el.querySelectorAll(".c6pp button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); });
  draw();
  if (!REDUCED) animate(el, dt => { t += dt; draw(); });
};
