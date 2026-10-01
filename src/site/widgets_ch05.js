/* ---- chapter 5 widgets: state of matter and pressure ---- */
const B5 = x => bnNum(x, LANG);
/* number → readable string: groups of 3 with a space, or a × 10^n form for very large/small values */
const f5 = (x, d = 0) => {
  if (!isFinite(x)) return "—";
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e7 || a < 1e-3)) { const e = Math.floor(Math.log10(a)); let m = x / Math.pow(10, e); m = +m.toFixed(2); return B5(m + " × 10<sup>" + e + "</sup>"); }
  let s = (+x.toFixed(d)).toFixed(d);
  const [i, fr] = s.split("."); const g = Math.abs(+i) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  return B5(fr ? g + "." + fr : g);
};
const chips5 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const onIn5 = (el, fn) => el.querySelectorAll("input").forEach(i => i.addEventListener("input", fn));
/* arrow from (x1,y1) to tip (x2,y2) with a fixed-size head */
const arr5 = (x1, y1, x2, y2, col, w = 3) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, hl = Math.min(11, L * 0.6), bx = x2 - ux * hl, by = y2 - uy * hl;
  return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${col}" stroke-width="${w}"/><path d="M${x2} ${y2} L${bx - uy * 6} ${by + ux * 6} L${bx + uy * 6} ${by - ux * 6} Z" fill="${col}"/>`; };

/* 5.1 pressure = force / area, on soft mud */
W.c5press = (el) => {
  const P = [
    [L2("Lying down", "শুয়ে থাকা"), 490, 0.5],
    [L2("Standing", "দাঁড়িয়ে থাকা"), 490, 0.03],
    [L2("On one foot", "এক পায়ে"), 490, 0.015],
    [L2("Blunt knife", "ভোঁতা ছুরি"), 20, 1e-4],
    [L2("Sharp knife", "ধারালো ছুরি"), 20, 1e-5]];
  el.innerHTML = `<div class="chipset c5pc" role="group">${P.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 1}">${p[0]}</button>`).join("")}</div>
  ${slider("c5pF", L2("Force F", "বল F"), 1, 1000, 1, 490, "N")}
  ${slider("c5pA", L2("Area A", "ক্ষেত্রফল A"), -5, 0, 0.01, Math.log10(0.03), "")}
  <div class="svgwrap fit" id="c5psv"></div><div class="w-out" id="c5po"></div>`;
  let exactA = 0.03;
  const draw = () => {
    const F = sv(el, "c5pF", "N"), lg = exactA ? Math.log10(exactA) : +$("#c5pA", el).value, A = exactA || Math.pow(10, lg);
    $("#c5pA-v", el).innerHTML = f5(A, A >= 0.01 ? 3 : 5) + " m²";
    const Pr = F / A;
    const w = 20 + (lg + 5) / 5 * 220;              // contact width grows with log(area)
    const sink = Math.max(0, Math.min(46, (Math.log10(Pr) - 2) * 9)); // deeper for higher pressure
    const cx = 130, top = 110;
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("pressure", "চাপ")}">
    <rect x="0" y="${top}" width="260" height="90" fill="var(--c-soft)"/><line x1="0" y1="${top}" x2="260" y2="${top}" stroke="var(--muted)" stroke-width="2"/>
    <rect x="${cx - w / 2}" y="${top + sink - 40}" width="${w}" height="40" rx="3" fill="var(--c)" opacity=".85"/>
    ${arr5(cx, top + sink - 100, cx, top + sink - 42, "var(--bad)", 2 + F / 250)}
    <text x="${cx + 8}" y="${top + sink - 84}" font-size="14" fill="var(--bad)">F</text>
    <text x="8" y="195" font-size="13" fill="var(--muted)">${L2("soft mud", "নরম কাদা")}</text>`;
    // log pressure meter 10^0 .. 10^8 Pa
    const my = y => 185 - (Math.log10(y)) / 8 * 165;
    g += `<rect x="290" y="20" width="18" height="165" rx="9" fill="none" stroke="var(--rule)"/>`;
    const yp = Math.max(20, Math.min(185, my(Pr)));
    g += `<rect x="292" y="${yp}" width="14" height="${185 - yp}" rx="7" fill="var(--bad)" opacity=".8"/>`;
    [0, 2, 4, 6, 8].forEach(e => g += `<text x="314" y="${my(Math.pow(10, e)) + 5}" font-size="13" fill="var(--muted)">${B5("10")}<tspan dy="-6" font-size="12">${B5(e)}</tspan></text>`);
    g += `<text x="299" y="14" font-size="13" text-anchor="middle" fill="var(--ink)">Pa</text></svg>`;
    $("#c5psv", el).innerHTML = g;
    $("#c5po", el).innerHTML = L2(`P = F ÷ A = ${f5(F)} N ÷ ${f5(A, A >= 0.01 ? 3 : 5)} m² = <b>${f5(Pr)} Pa</b>. Smaller area → bigger pressure → deeper dent.`,
      `P = F ÷ A = ${f5(F)} N ÷ ${f5(A, A >= 0.01 ? 3 : 5)} m² = <b>${f5(Pr)} Pa</b>। ক্ষেত্রফল ছোট → চাপ বড় → গভীর দাগ।`);
  };
  chips5(el, ".c5pc", b => { const p = P[+b.dataset.i]; $("#c5pF", el).value = p[1]; $("#c5pA", el).value = Math.log10(p[2]); exactA = p[2]; draw(); });
  $("#c5pA", el).addEventListener("input", () => { exactA = 0; });
  onIn5(el, () => { el.querySelectorAll(".c5pc button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); });
  draw();
};

/* 5.2 density = mass / volume, on a scale of familiar substances */
W.c5dens = (el) => {
  const S = [[L2("cork", "কর্ক"), 0.25], [L2("wood", "কাঠ"), 0.45], [L2("water", "পানি"), 1], [L2("glass", "কাচ"), 2.6], [L2("iron", "লোহা"), 7.8], [L2("mercury", "পারদ"), 13.6], [L2("gold", "সোনা"), 19.3]];
  el.innerHTML = slider("c5dm", L2("Mass m", "ভর m"), 10, 2000, 10, 300, "g") + slider("c5dv", L2("Volume V", "আয়তন V"), 10, 1000, 10, 600, "cc") +
    `<div class="svgwrap fit" id="c5dsv"></div><div class="w-out" id="c5do"></div>`;
  const draw = () => {
    const m = sv(el, "c5dm", "g"), V = sv(el, "c5dv", "cc"), r = m / V;
    const sx = d => 20 + (Math.log10(d) + 1) / (Math.log10(25) + 1) * 320; // 0.1 .. 25 g/cc
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("density", "ঘনত্ব")}">`;
    // tank
    const wl = 70, bot = 130, side = 14 + Math.cbrt(V) * 3.3; const frac = Math.min(1, r);
    let by = r < 1 ? wl - side * (1 - frac) : bot - side;
    g += `<rect x="100" y="${wl}" width="160" height="${bot - wl}" fill="var(--c-soft)"/><path d="M100 30 V${bot} H260 V30" fill="none" stroke="var(--muted)" stroke-width="2"/>
      <rect x="${180 - side / 2}" y="${by}" width="${side}" height="${side}" fill="var(--c)" opacity=".85" stroke="var(--ink)" stroke-width=".5"/>
      <line x1="100" y1="${wl}" x2="260" y2="${wl}" stroke="var(--c)" stroke-width="1.5"/>`;
    // scale
    g += `<line x1="20" y1="185" x2="340" y2="185" stroke="var(--muted)" stroke-width="2"/>`;
    S.forEach(([n, d], i) => { const x = sx(d); g += `<line x1="${x}" y1="179" x2="${x}" y2="191" stroke="var(--muted)"/><text x="${x}" y="${i % 2 ? 222 : 206}" font-size="13" text-anchor="middle" fill="var(--muted)">${n}</text>`; });
    const xr = sx(Math.max(0.1, Math.min(25, r)));
    g += `<path d="M${xr} 182 l-7 -12 h14 z" fill="var(--bad)"/><text x="${Math.min(320, Math.max(40, xr))}" y="164" font-size="14" text-anchor="middle" fill="var(--bad)">${f5(r, 2)} g/cc</text></svg>`;
    $("#c5dsv", el).innerHTML = g;
    const state = r < 0.995 ? L2(`It is less dense than water, so it <b>floats</b> with ${f5(frac * 100)}% under water.`, `এটি পানির চেয়ে কম ঘন, তাই <b>ভাসে</b>; ${f5(frac * 100)}% পানির নিচে থাকে।`)
      : r <= 1.005 ? L2("Same density as water: it stays wherever you put it.", "পানির সমান ঘনত্ব: যেখানে রাখো সেখানেই থাকে।")
        : L2("It is denser than water, so it <b>sinks</b>.", "এটি পানির চেয়ে বেশি ঘন, তাই <b>ডুবে যায়</b>।");
    $("#c5do", el).innerHTML = L2(`ρ = m ÷ V = ${f5(m)} g ÷ ${f5(V)} cc = <b>${f5(r, 2)} g/cc = ${f5(r * 1000)} kg/m³</b>. `, `ρ = m ÷ V = ${f5(m)} g ÷ ${f5(V)} cc = <b>${f5(r, 2)} g/cc = ${f5(r * 1000)} kg/m³</b>। `) + state;
  };
  onIn5(el, draw); draw();
};

/* 5.3 pressure in a liquid: P = hρg */
W.c5depth = (el) => {
  const LQ = [["k", L2("Kerosene", "কেরোসিন"), 800], ["w", L2("Water", "পানি"), 1000], ["m", L2("Mercury", "পারদ"), 13600]];
  let li = 1;
  el.innerHTML = `<div class="chipset c5lq" role="group">${LQ.map((q, i) => `<button data-i="${i}" aria-pressed="${i === 1}">${q[1]}</button>`).join("")}</div>
  ${slider("c5h", L2("Depth h", "গভীরতা h"), 0, 10, 0.05, 0.5, "m")}<div class="svgwrap fit" id="c5hsv"></div><div class="w-out" id="c5ho"></div>`;
  const draw = () => {
    const h = sv(el, "c5h", "m", 2), rho = LQ[li][2], P = h * rho * 9.8;
    const top = 30, bot = 200, y = top + h / 10 * (bot - top), x = 95;
    const col = li === 2 ? "var(--muted)" : li === 0 ? "var(--note)" : "var(--c)";
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("liquid pressure", "তরলের চাপ")}">
      <rect x="10" y="${top}" width="140" height="${bot - top}" fill="${col}" opacity=".25"/><path d="M10 14 V${bot} H150 V14" fill="none" stroke="var(--muted)" stroke-width="2"/>
      <line x1="10" y1="${top}" x2="150" y2="${top}" stroke="${col}" stroke-width="2"/>
      <line x1="24" y1="${top}" x2="24" y2="${y}" stroke="var(--ink)" stroke-dasharray="3 3"/><line x1="18" y1="${y}" x2="30" y2="${y}" stroke="var(--ink)"/><text x="30" y="${Math.max(top + 14, (top + y) / 2 + 5)}" font-size="13" fill="var(--ink)">h</text>`;
    const Pm = 10 * rho * 9.8, Lc = h > 0 ? 8 + 28 * P / Pm : 0;
    const arr = (dx, dy) => { const ex = x + dx * 8, ey = y + dy * 8, sx0 = x + dx * (Lc + 8), sy0 = y + dy * (Lc + 8), px_ = -dy, py_ = dx;
      return `<line x1="${sx0}" y1="${sy0}" x2="${ex + dx * 6}" y2="${ey + dy * 6}" stroke="var(--bad)" stroke-width="2.5"/><path d="M${ex} ${ey} L${ex + dx * 8 + px_ * 5} ${ey + dy * 8 + py_ * 5} L${ex + dx * 8 - px_ * 5} ${ey + dy * 8 - py_ * 5} Z" fill="var(--bad)"/>`; };
    if (Lc > 0) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => g += arr(dx, dy));
    g += `<circle cx="${x}" cy="${y}" r="4" fill="var(--bad)"/>`;
    // graph P (kPa) vs h, scaled to the chosen liquid; other liquids shown faint
    const gx = 200, gw = 150, gy = 200, gh = 170, Pk = Pm / 1000;
    const px = hh => gx + hh / 10 * gw, py = pp => gy - pp / Pk * gh;
    g += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
      <text x="${gx + gw}" y="${gy + 18}" font-size="13" text-anchor="end" fill="var(--muted)">h (m)</text><text x="${gx + 4}" y="${gy - gh - 6}" font-size="13" fill="var(--muted)">P (kPa)</text>
      <text x="${gx - 4}" y="${gy - gh + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${f5(Pk)}</text><text x="${gx - 4}" y="${gy + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B5(0)}</text>
      <text x="${gx + gw}" y="${gy + 18}" font-size="13" text-anchor="end" fill="var(--muted)"></text>`;
    LQ.forEach((q, i) => { const pe = 10 * q[2] * 9.8 / 1000; const hEnd = pe > Pk ? 10 * Pk / pe : 10;
      g += `<line x1="${gx}" y1="${gy}" x2="${px(hEnd)}" y2="${py(Math.min(Pk, pe))}" stroke="${i === li ? "var(--bad)" : "var(--rule)"}" stroke-width="${i === li ? 2.5 : 1.5}"/>`; });
    g += `<circle cx="${px(h)}" cy="${py(P / 1000)}" r="5" fill="var(--bad)"/></svg>`;
    $("#c5hsv", el).innerHTML = g;
    $("#c5ho", el).innerHTML = L2(`P = hρg = ${f5(h, 2)} × ${f5(rho)} × 9.8 = <b>${f5(P)} Pa</b> ≈ ${f5(P / 101325, 2)} atm. The four arrows are equal: at a point the pressure is the same in all directions.`,
      `P = hρg = ${f5(h, 2)} × ${f5(rho)} × ৯.৮ = <b>${f5(P)} Pa</b> ≈ ${f5(P / 101325, 2)} atm। চারটি তীর সমান: একটি বিন্দুতে চাপ সব দিকে সমান।`);
  };
  chips5(el, ".c5lq", b => { li = +b.dataset.i; draw(); });
  onIn5(el, draw); draw();
};

/* 5.3.1 Archimedes: pressure difference on top and bottom faces gives upthrust */
W.c5archi = (el) => {
  const LQ = [[L2("Water", "পানি"), 1000], [L2("Sea water", "সমুদ্রের পানি"), 1030], [L2("Kerosene", "কেরোসিন"), 800]];
  let li = 0; const A = 0.05, H = 0.2, Wt = 200; // block: 0.05 m² × 0.2 m, weight 200 N
  el.innerHTML = `<div class="chipset c5al" role="group">${LQ.map((q, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${q[0]}</button>`).join("")}</div>
  ${slider("c5ad", L2("Depth of bottom face h₂", "নিচের তলের গভীরতা h₂"), 0, 1, 0.01, 0.4, "m")}<div class="svgwrap fit" id="c5asv"></div><div class="w-out" id="c5ao"></div>`;
  const draw = () => {
    const h2 = sv(el, "c5ad", "m", 2), h1 = h2 - H, rho = LQ[li][1];
    const F1 = h1 > 0 ? h1 * rho * 9.8 * A : 0, F2 = h2 * rho * 9.8 * A, U = F2 - F1, app = Wt - U;
    const s = 120, wl = 50, x0 = 90, bw = 70, byb = wl + h2 * s, byt = byb - H * s;
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("buoyancy", "প্লবতা")}">
      <rect x="10" y="${wl}" width="230" height="195" fill="var(--c-soft)"/><line x1="10" y1="${wl}" x2="240" y2="${wl}" stroke="var(--c)" stroke-width="2"/>
      <line x1="${x0 + bw / 2}" y1="4" x2="${x0 + bw / 2}" y2="${byt}" stroke="var(--ink)"/><rect x="${x0 + bw / 2 - 8}" y="4" width="16" height="16" fill="none" stroke="var(--ink)"/>
      <rect x="${x0}" y="${byt}" width="${bw}" height="${H * s}" fill="var(--muted)" opacity=".8"/>`;
    const k = 0.12; // px per N
    if (F1 > 0) g += arr5(x0 + bw - 14, byt - 8 - F1 * k, x0 + bw - 14, byt, "var(--bad)") + `<text x="${x0 + bw + 4}" y="${byt - 6}" font-size="13" fill="var(--bad)">F₁</text>`;
    if (F2 > 0) g += arr5(x0 + 14, byb + 8 + F2 * k, x0 + 14, byb, "var(--good)") + `<text x="${x0 - 22}" y="${byb + 18}" font-size="13" fill="var(--good)">F₂</text>`;
    // spring balance reading bar
    g += `<text x="300" y="24" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("balance", "নিক্তি")}</text><rect x="285" y="32" width="30" height="200" rx="4" fill="none" stroke="var(--rule)"/>
      <rect x="289" y="${232 - app / Wt * 196}" width="22" height="${app / Wt * 196}" fill="var(--c)"/><line x1="280" y1="36" x2="320" y2="36" stroke="var(--muted)" stroke-dasharray="3 3"/>
      <text x="300" y="248" font-size="13" text-anchor="middle" fill="var(--ink)">${f5(app, 1)} N</text></svg>`;
    $("#c5asv", el).innerHTML = g;
    $("#c5ao", el).innerHTML = L2(`F₁ (down, on top) = ${f5(F1, 1)} N; F₂ (up, on bottom) = ${f5(F2, 1)} N<br>Upthrust = F₂ − F₁ = <b>${f5(U, 1)} N</b> = weight of displaced liquid. Apparent weight = ${Wt} − ${f5(U, 1)} = <b>${f5(app, 1)} N</b>${h1 >= 0 ? ". Go deeper: F₁ and F₂ both grow, but the upthrust stays the same." : "."}`,
      `F₁ (ওপরের তলে, নিচের দিকে) = ${f5(F1, 1)} N; F₂ (নিচের তলে, ওপরের দিকে) = ${f5(F2, 1)} N<br>প্লবতা = F₂ − F₁ = <b>${f5(U, 1)} N</b> = অপসারিত তরলের ওজন। আপাত ওজন = ${B5(Wt)} − ${f5(U, 1)} = <b>${f5(app, 1)} N</b>${h1 >= 0 ? "। আরও গভীরে নাও: F₁ ও F₂ দুটোই বাড়ে, কিন্তু প্লবতা একই থাকে।" : "।"}`);
  };
  chips5(el, ".c5al", b => { li = +b.dataset.i; draw(); });
  onIn5(el, draw); draw();
};

/* 5.3.2 floating and sinking: fraction immersed = ρ/ρ_liquid */
W.c5float = (el) => {
  const LQ = [[L2("Fresh water", "মিঠা পানি"), 1000], [L2("Sea water", "সমুদ্রের পানি"), 1030], [L2("Kerosene", "কেরোসিন"), 800], [L2("Mercury", "পারদ"), 13600]];
  const OB = [[L2("cork", "কর্ক"), 250], [L2("wood", "কাঠ"), 500], [L2("ice", "বরফ"), 920], [L2("iron", "লোহা"), 7800]];
  let li = 0;
  el.innerHTML = `<p class="hint">${L2("Liquid", "তরল")}</p><div class="chipset c5fl" role="group">${LQ.map((q, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${q[0]}</button>`).join("")}</div>
  <p class="hint">${L2("Block", "ব্লক")}</p><div class="chipset c5fo" role="group">${OB.map((q, i) => `<button data-i="${i}" aria-pressed="${i === 1}">${q[0]}</button>`).join("")}</div>
  ${slider("c5fr", L2("Density of block ρ", "ব্লকের ঘনত্ব ρ"), 100, 15000, 10, 500, "kg/m³")}<div class="svgwrap fit" id="c5fsv"></div><div class="w-out" id="c5fo2"></div>`;
  const draw = () => {
    const r = sv(el, "c5fr", "kg/m³"), rl = LQ[li][1], fr = r / rl;
    const wl = 70, bot = 190, s = 80, x = 140;
    const col = li === 3 ? "var(--muted)" : li === 2 ? "var(--note)" : "var(--c)";
    const floats = fr < 0.995, hover = !floats && fr <= 1.005;
    const top = floats ? wl - s * (1 - fr) : hover ? (wl + bot) / 2 - s / 2 : bot - s;
    let g = `<svg viewBox="0 0 360 210" role="img" aria-label="${L2("floating", "ভাসা")}"><rect x="20" y="${wl}" width="320" height="${bot - wl}" fill="${col}" opacity=".25"/>
      <path d="M20 10 V${bot} H340 V10" fill="none" stroke="var(--muted)" stroke-width="2"/>
      <rect x="${x}" y="${top}" width="${s}" height="${s}" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.5"/>`;
    if (floats) g += `<rect x="${x}" y="${wl}" width="${s}" height="${s * fr}" fill="var(--c)" opacity=".5"/>`;
    else g += `<rect x="${x}" y="${top}" width="${s}" height="${s}" fill="var(--c)" opacity=".5"/>`;
    g += `<line x1="20" y1="${wl}" x2="340" y2="${wl}" stroke="${col}" stroke-width="2"/>`;
    if (floats) g += `<text x="${x + s + 10}" y="${wl + s * fr / 2 + 5}" font-size="14" fill="var(--ink)">${f5(fr * 100, 1)}%</text><text x="${x + s + 10}" y="${wl - 8}" font-size="13" fill="var(--muted)">${L2("above", "ওপরে")} ${f5((1 - fr) * 100, 1)}%</text>`;
    g += `</svg>`;
    $("#c5fsv", el).innerHTML = g;
    $("#c5fo2", el).innerHTML = floats ? L2(`ρ/ρ(liquid) = ${f5(r)} ÷ ${f5(rl)} = ${f5(fr, 3)}. The block <b>floats</b> with <b>${f5(fr * 100, 1)}%</b> of its volume under the surface.`, `ρ/ρ(তরল) = ${f5(r)} ÷ ${f5(rl)} = ${f5(fr, 3)}। ব্লকটি <b>ভাসে</b>, এর আয়তনের <b>${f5(fr * 100, 1)}%</b> তলের নিচে।`)
      : hover ? L2("Densities are equal: upthrust = weight, so the block stays wherever it is placed.", "ঘনত্ব সমান: প্লবতা = ওজন, তাই ব্লক যেখানে রাখা সেখানেই থাকে।")
        : L2(`ρ = ${f5(r)} kg/m³ is more than ${f5(rl)} kg/m³: even fully under, the upthrust is less than the weight, so the block <b>sinks</b>.`, `ρ = ${f5(r)} kg/m³, যা ${f5(rl)} kg/m³-এর চেয়ে বেশি: পুরো ডুবলেও প্লবতা ওজনের চেয়ে কম, তাই ব্লক <b>ডুবে যায়</b>।`);
  };
  chips5(el, ".c5fl", b => { li = +b.dataset.i; draw(); });
  chips5(el, ".c5fo", b => { $("#c5fr", el).value = OB[+b.dataset.i][1]; draw(); });
  $("#c5fr", el).addEventListener("input", () => { el.querySelectorAll(".c5fo button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); });
  draw();
};

/* 5.3.3 hydraulic press: force multiplied, work conserved */
W.c5hyd = (el) => {
  el.innerHTML = slider("c5y1", L2("Small piston area A₁", "ছোট পিস্টনের ক্ষেত্রফল A₁"), 1, 50, 1, 10, "cm²") + slider("c5y2", L2("Large piston area A₂", "বড় পিস্টনের ক্ষেত্রফল A₂"), 50, 1000, 10, 500, "cm²") + slider("c5yF", L2("Force on small piston F₁", "ছোট পিস্টনে বল F₁"), 10, 200, 5, 50, "N") +
    `<div class="w-row"><button class="btn solid" id="c5yp">${L2("Press the small piston 20 cm", "ছোট পিস্টন ২০ cm চাপো")}</button><button class="btn" id="c5yr">${L2("Reset", "আবার")}</button></div>
    <div class="svgwrap fit" id="c5ysv"></div><div class="w-out" id="c5yo"></div>`;
  let p = 0, run = false;
  const draw = () => {
    const A1 = sv(el, "c5y1", "cm²"), A2 = sv(el, "c5y2", "cm²"), F1 = sv(el, "c5yF", "N");
    const l1 = 0.2 * p, l2 = l1 * A1 / A2, F2 = F1 * A2 / A1, L1 = 0.2, L2_ = L1 * A1 / A2;
    const w1 = 10 + Math.sqrt(A1) * 3.2, w2 = 30 + Math.sqrt(A2) * 4.2, x1 = 70, x2 = 250, lvl = 80;
    const y1 = lvl + l1 * 400, y2 = lvl - l2 * 400; // 20 cm → 80 px
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("hydraulic press", "জলবাহী প্রেস")}">
      <path d="M${x1 - w1 / 2} 40 V200 H${x2 + w2 / 2} V20 M${x2 - w2 / 2} 20 V170 H${x1 + w1 / 2} V40" fill="none" stroke="var(--muted)" stroke-width="2"/>
      <path d="M${x1 - w1 / 2} ${y1} H${x1 + w1 / 2} V170 H${x2 - w2 / 2} V${y2} H${x2 + w2 / 2} V200 H${x1 - w1 / 2} Z" fill="var(--c)" opacity=".3"/>
      <rect x="${x1 - w1 / 2}" y="${y1 - 8}" width="${w1}" height="8" fill="var(--ink)"/><rect x="${x2 - w2 / 2}" y="${y2 - 10}" width="${w2}" height="10" fill="var(--ink)"/>
      ${arr5(x1, y1 - 50, x1, y1 - 10, "var(--bad)")}<text x="${x1 + 6}" y="${y1 - 36}" font-size="14" fill="var(--bad)">F₁</text>
      ${arr5(x2, y2 - 12, x2, Math.max(4, y2 - 12 - Math.min(70, 20 + Math.log10(F2 / F1) * 25)), "var(--good)", 3 + Math.min(4, F2 / 2000))}
      <text x="${x2 + w2 / 2 + 4}" y="${y2 - 14}" font-size="14" fill="var(--good)">F₂</text>
      <text x="180" y="222" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("same pressure everywhere in the liquid", "তরলের সবখানে একই চাপ")}</text></svg>`;
    $("#c5ysv", el).innerHTML = g;
    $("#c5yo", el).innerHTML = L2(`P = F₁/A₁ = ${f5(F1 / (A1 * 1e-4))} Pa, the same on both pistons.<br>F₂ = F₁ × A₂/A₁ = ${F1} × ${f5(A2 / A1, 1)} = <b>${f5(F2)} N</b><br>For a full press: l₁ = 20 cm, l₂ = ${f5(L2_ * 100, 2)} cm → work in F₁l₁ = ${f5(F1 * L1, 2)} J, work out F₂l₂ = ${f5(F2 * L2_, 2)} J (equal).`,
      `P = F₁/A₁ = ${f5(F1 / (A1 * 1e-4))} Pa, দুই পিস্টনে একই।<br>F₂ = F₁ × A₂/A₁ = ${B5(F1)} × ${f5(A2 / A1, 1)} = <b>${f5(F2)} N</b><br>পুরো চাপে: l₁ = ২০ cm, l₂ = ${f5(L2_ * 100, 2)} cm → প্রদত্ত কাজ F₁l₁ = ${f5(F1 * L1, 2)} J, প্রাপ্ত কাজ F₂l₂ = ${f5(F2 * L2_, 2)} J (সমান)।`);
  };
  $("#c5yp", el).addEventListener("click", () => { if (REDUCED) { p = 1; draw(); } else { p = 0; run = true; } });
  $("#c5yr", el).addEventListener("click", () => { p = 0; run = false; draw(); });
  onIn5(el, draw); draw();
  if (!REDUCED) animate(el, dt => { if (!run) return; p = Math.min(1, p + dt * 0.6); if (p >= 1) run = false; draw(); });
};

/* 5.4 air pressure with height + Torricelli tube */
W.c5baro = (el) => {
  let liq = "hg";
  el.innerHTML = `<div class="chipset c5bl" role="group"><button data-k="hg" aria-pressed="true">${L2("Mercury barometer", "পারদ ব্যারোমিটার")}</button><button data-k="w" aria-pressed="false">${L2("Water barometer", "পানির ব্যারোমিটার")}</button></div>
  ${slider("c5bh", L2("Height above sea level", "সমুদ্রপৃষ্ঠ থেকে উচ্চতা"), 0, 12, 0.1, 0, "km")}<div class="svgwrap fit" id="c5bsv"></div><div class="w-out" id="c5bo"></div>`;
  const PL = [[0, L2("sea level", "সমুদ্রপৃষ্ঠ")], [5.5, L2("½ pressure", "½ চাপ")], [8.849, L2("Everest", "এভারেস্ট")], [11, L2("jet plane", "জেট বিমান")]];
  const draw = () => {
    const h = sv(el, "c5bh", "km", 1), P = Math.exp(-h / 8); // simple model: halves about every 5.5 km
    const gx = 36, gy = 210, gw = 170, gh = 180; const X = pp => gx + pp * gw, Y = hh => gy - hh / 12 * gh;
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("air pressure and height", "উচ্চতা ও বাতাসের চাপ")}">
      <line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
      <text x="${gx + gw}" y="${gy + 16}" font-size="13" text-anchor="end" fill="var(--muted)">P (atm)</text><text x="${gx - 4}" y="${gy - gh - 6}" font-size="13" fill="var(--muted)">${L2("height (km)", "উচ্চতা (km)")}</text>
      <text x="${gx}" y="${gy + 16}" font-size="13" text-anchor="middle" fill="var(--muted)">${B5(0)}</text><text x="${gx + gw / 2}" y="${gy + 16}" font-size="13" text-anchor="middle" fill="var(--muted)">${B5("0.5")}</text>`;
    let pts = ""; for (let hh = 0; hh <= 12; hh += 0.25) pts += `${X(Math.exp(-hh / 8))},${Y(hh)} `;
    g += `<polyline points="${pts}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
    PL.forEach(([hh, n]) => g += hh ? `<text x="${X(Math.exp(-hh / 8)) + 6}" y="${Y(hh) + 4}" font-size="12" fill="var(--muted)">${n}</text>` : `<text x="${X(1) - 4}" y="${Y(0) - 10}" font-size="12" text-anchor="end" fill="var(--muted)">${n}</text>`);
    [0, 5, 10].forEach(hh => g += `<line x1="${gx - 4}" y1="${Y(hh)}" x2="${gx}" y2="${Y(hh)}" stroke="var(--muted)"/><text x="${gx - 7}" y="${Y(hh) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B5(hh)}</text>`);
    g += `<circle cx="${X(P)}" cy="${Y(h)}" r="6" fill="var(--bad)"/>`;
    // tube
    const full = liq === "hg" ? 76 : 1034, unit = "cm", col = liq === "hg" ? "var(--muted)" : "var(--c)";
    const colTxt = liq === "hg" ? f5(76 * P, 1) + " cm" : f5(10.34 * P, 2) + " m";
    const tx = 290, tb = 215, tl = 190, colH = P * tl * 0.8; // 0.8 of tube = column at sea level
    g += `<rect x="255" y="${tb - 12}" width="70" height="22" fill="${col}" opacity=".5"/><rect x="${tx - 8}" y="${tb - tl}" width="16" height="${tl}" rx="7" fill="none" stroke="var(--ink)"/>
      <rect x="${tx - 6}" y="${tb - colH}" width="12" height="${colH}" fill="${col}"/>
      <text x="${tx - 13}" y="${tb - colH + 5}" font-size="13" text-anchor="end" fill="var(--ink)">${colTxt}</text>
      <line x1="${tx + 8}" y1="${tb - tl + 12}" x2="${tx + 14}" y2="${tb - tl + 12}" stroke="var(--muted)"/><text x="${tx + 16}" y="${tb - tl + 16}" font-size="12" fill="var(--muted)">${L2("vacuum", "শূন্যস্থান")}</text></svg>`;
    $("#c5bsv", el).innerHTML = g;
    $("#c5bo", el).innerHTML = L2(`At ${f5(h, 1)} km: P ≈ <b>${f5(P, 2)} atm</b> ≈ ${f5(P * 101.3, 1)} kPa. The ${liq === "hg" ? "mercury" : "water"} column is ${colTxt} tall. Each breath holds about ${f5(P * 100)}% of the oxygen it would at sea level.`,
      `${f5(h, 1)} km উচ্চতায়: P ≈ <b>${f5(P, 2)} atm</b> ≈ ${f5(P * 101.3, 1)} kPa। ${liq === "hg" ? "পারদ" : "পানি"} স্তম্ভ ${colTxt} উঁচু। প্রতি নিঃশ্বাসে সমুদ্রপৃষ্ঠের প্রায় ${f5(P * 100)}% অক্সিজেন আসে।`) +
      `<br><span class="muted">${L2("Simple model: pressure halves about every 5.5 km.", "সরল মডেল: প্রায় প্রতি ৫.৫ km-এ চাপ অর্ধেক হয়।")}</span>`;
  };
  chips5(el, ".c5bl", b => { liq = b.dataset.k; draw(); });
  onIn5(el, draw); draw();
};

/* 5.5 Hooke's law with Fahim's rubber-band data */
W.c5hooke = (el) => {
  const M = [0, 0.4, 1, 1.4, 2.2, 3, 4, 5], Ld = [10, 12, 15, 17, 21, 25, 30, 36], Ad = [10, 10, 10, 10, 10, 10, 10.2, 10.6];
  const interp = (m, arr) => { for (let i = 1; i < M.length; i++) if (m <= M[i]) return arr[i - 1] + (arr[i] - arr[i - 1]) * (m - M[i - 1]) / (M[i] - M[i - 1]); return arr[arr.length - 1]; };
  let hung = true;
  el.innerHTML = slider("c5km", L2("Mass hung M", "ঝোলানো ভর M"), 0, 5, 0.1, 2.7, "kg") +
    `<div class="w-row"><button class="btn solid" id="c5kt">${L2("Remove the mass", "ভর সরিয়ে নাও")}</button></div><div class="svgwrap fit" id="c5ksv"></div><div class="w-out" id="c5ko"></div>`;
  let maxM = 0;
  const draw = () => {
    const m = sv(el, "c5km", "kg", 1); maxM = Math.max(maxM, m);
    const Lon = interp(m, Ld), after = interp(maxM, Ad), L = hung ? Lon : after;
    const k = 5; const hx = 50, hy = 20, ly = hy + L * k;
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("rubber band", "রাবার ব্যান্ড")}">
      <rect x="${hx - 30}" y="${hy - 10}" width="60" height="10" fill="var(--muted)"/><path d="M${hx - 5} ${hy} V${ly} M${hx + 5} ${hy} V${ly}" stroke="var(--note)" stroke-width="3"/>
      <line x1="${hx - 24}" y1="${hy + 50}" x2="${hx + 24}" y2="${hy + 50}" stroke="var(--rule)" stroke-dasharray="3 3"/><text x="${hx + 26}" y="${hy + 54}" font-size="12" fill="var(--muted)">${B5(10)} cm</text>`;
    if (hung && m > 0) { const s = 14 + Math.sqrt(m) * 10; g += `<rect x="${hx - s / 2}" y="${ly}" width="${s}" height="${s}" fill="var(--c)"/><text x="${hx}" y="${ly + s / 2 + 5}" font-size="12" text-anchor="middle" fill="var(--sheet)">${f5(m, 1)}</text>`; }
    // graph L vs M
    const gx = 150, gy = 205, gw = 195, gh = 180, X = mm => gx + mm / 5 * gw, Y = ll => gy - (ll - 10) / 26 * gh;
    g += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
      <text x="${gx + gw}" y="${gy + 18}" font-size="13" text-anchor="end" fill="var(--muted)">M (kg)</text><text x="${gx + 4}" y="${gy - gh + 4}" font-size="13" fill="var(--muted)">L (cm)</text>
      <rect x="${X(3)}" y="${gy - gh}" width="${X(4) - X(3)}" height="${gh}" fill="var(--bad)" opacity=".1"/><text x="${(X(3) + X(4)) / 2}" y="${gy - 6}" font-size="11" text-anchor="middle" fill="var(--bad)">${L2("limit?", "সীমা?")}</text>
      <line x1="${X(0)}" y1="${Y(10)}" x2="${X(5)}" y2="${Y(35)}" stroke="var(--rule)" stroke-dasharray="5 4"/>`;
    M.forEach((mm, i) => g += `<circle cx="${X(mm)}" cy="${Y(Ld[i])}" r="4" fill="var(--c)"/><circle cx="${X(mm)}" cy="${Y(Ad[i])}" r="3.5" fill="none" stroke="var(--note)" stroke-width="1.5"/>`);
    g += `<circle cx="${X(m)}" cy="${Y(Lon)}" r="6" fill="var(--bad)"/></svg>`;
    $("#c5ksv", el).innerHTML = g;
    const within = maxM <= 3;
    $("#c5ko", el).innerHTML = hung
      ? L2(`With ${f5(m, 1)} kg: L ≈ <b>${f5(Lon, 1)} cm</b>, stretch ΔL = ${f5(Lon - 10, 1)} cm, strain = ΔL/L₀ = ${f5((Lon - 10) / 10, 2)}.${m <= 3 ? " On the straight line: stretch ∝ load (Hooke's law), 5 cm per kg." : " Past 3 kg the points leave the pattern: the band has gone past its elastic limit."}`,
        `${f5(m, 1)} kg-এ: L ≈ <b>${f5(Lon, 1)} cm</b>, দৈর্ঘ্য বৃদ্ধি ΔL = ${f5(Lon - 10, 1)} cm, বিকৃতি = ΔL/L₀ = ${f5((Lon - 10) / 10, 2)}।${m <= 3 ? " সরলরেখার ওপর: দৈর্ঘ্য বৃদ্ধি ∝ ভার (হুকের সূত্র), প্রতি kg-এ ৫ cm।" : " ৩ kg-এর পর বিন্দুগুলো ধারা ছেড়ে যায়: ব্যান্ড স্থিতিস্থাপক সীমা পেরিয়েছে।"}`)
      : within ? L2(`Mass removed: the band returns to <b>10 cm</b>. It behaved elastically.`, `ভর সরানো হলো: ব্যান্ড <b>১০ cm</b>-এ ফিরে এসেছে। এটি স্থিতিস্থাপক আচরণ করেছে।`)
        : L2(`Mass removed: the band stays at <b>${f5(after, 2)} cm</b>, a permanent stretch. Fahim saw this after 4 kg but not after 3 kg, so the elastic limit lies between 3 and 4 kg.`, `ভর সরানো হলো: ব্যান্ড <b>${f5(after, 2)} cm</b>-এ থেকে যায়, স্থায়ী দৈর্ঘ্য বৃদ্ধি। ফাহিম এটা ৪ kg-এর পর দেখেছে, ৩ kg-এর পর নয়; তাই স্থিতিস্থাপক সীমা ৩ থেকে ৪ kg-এর মধ্যে।`);
    $("#c5kt", el).textContent = hung ? L2("Remove the mass", "ভর সরিয়ে নাও") : L2("Hang a new band", "নতুন ব্যান্ড ঝোলাও");
  };
  $("#c5kt", el).addEventListener("click", () => { if (!hung) { maxM = +$("#c5km", el).value; } hung = !hung; draw(); });
  $("#c5km", el).addEventListener("input", () => { if (!hung) { hung = true; maxM = 0; } draw(); });
  draw();
};

/* 5.6 states of matter: particles in solid, liquid, gas and plasma */
W.c5states = (el) => {
  const K = [["s", L2("Solid", "কঠিন")], ["l", L2("Liquid", "তরল")], ["g", L2("Gas", "গ্যাস")], ["p", L2("Plasma", "প্লাজমা")]];
  const TX = {
    s: L2("Molecules are packed closely in fixed places and only vibrate: definite shape and volume.", "অণুগুলো নির্দিষ্ট জায়গায় ঘেঁষাঘেঁষি করে থাকে আর শুধু কাঁপে: নির্দিষ্ট আকার ও আয়তন।"),
    l: L2("Molecules stay close but slide past one another: definite volume, takes the container's shape.", "অণুগুলো কাছাকাছি থাকে কিন্তু পাশ দিয়ে সরে যায়: নির্দিষ্ট আয়তন, পাত্রের আকার নেয়।"),
    g: L2("Molecules are far apart and fly freely, hitting the walls: those hits are the gas pressure.", "অণুগুলো দূরে দূরে, মুক্তভাবে ছুটে দেয়ালে ধাক্কা দেয়: সেই ধাক্কাই গ্যাসের চাপ।"),
    p: L2("Atoms have lost electrons: positive ions (+) and fast free electrons (−) move separately.", "পরমাণু ইলেকট্রন হারিয়েছে: ধনাত্মক আয়ন (+) আর দ্রুত মুক্ত ইলেকট্রন (−) আলাদাভাবে চলে।")};
  let k = "s", t = 0, hits = 0, rate = 0, acc = 0, parts = [];
  el.innerHTML = `<div class="chipset c5sk" role="group">${K.map(([a, b]) => `<button data-k="${a}" aria-pressed="${a === k}">${b}</button>`).join("")}</div>
  ${slider("c5sT", L2("Temperature", "তাপমাত্রা"), 1, 10, 1, 4, "")}<div class="svgwrap fit" id="c5ssv"></div><p class="hint" id="c5stx"></p>
  ${REDUCED ? `<button class="btn" id="c5sst">${L2("Step", "এক ধাপ")}</button>` : ""}`;
  const BX = 10, BY = 10, BW = 340, BH = 180, R = 8;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const setup = () => {
    parts = []; hits = 0; rate = 0; acc = 0;
    if (k === "s") { for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) parts.push({ x0: 110 + i * 17, y0: 118 + j * 17, x: 0, y: 0, ph: rnd(0, 6.28) }); }
    if (k === "l") { for (let i = 0; i < 40; i++) parts.push({ x: rnd(BX + R, BX + BW - R), y: rnd(110, BY + BH - R), vx: rnd(-1, 1), vy: rnd(-1, 1) }); }
    if (k === "g") { for (let i = 0; i < 16; i++) { const a = rnd(0, 6.28); parts.push({ x: rnd(30, 330), y: rnd(30, 170), vx: Math.cos(a), vy: Math.sin(a) }); } }
    if (k === "p") { for (let i = 0; i < 10; i++) { const a = rnd(0, 6.28); parts.push({ ion: 1, x: rnd(30, 330), y: rnd(30, 170), vx: Math.cos(a) * 0.5, vy: Math.sin(a) * 0.5 }); }
      for (let i = 0; i < 14; i++) { const a = rnd(0, 6.28); parts.push({ ion: 0, x: rnd(30, 330), y: rnd(30, 170), vx: Math.cos(a) * 2.5, vy: Math.sin(a) * 2.5 }); } }
  };
  const step = (dt) => {
    const T = +$("#c5sT", el).value; t += dt;
    if (k === "s") parts.forEach(p => { const a = 0.6 * T; p.x = p.x0 + a * Math.sin(t * 20 + p.ph); p.y = p.y0 + a * Math.cos(t * 17 + p.ph * 1.3); });
    else {
      const sp = (k === "l" ? 10 : 55) * Math.sqrt(T);
      parts.forEach(p => {
        const r = k === "p" && !p.ion ? 3 : R;
        if (k === "l") { p.vx += rnd(-1, 1) * 0.6; p.vy += rnd(-1, 1) * 0.6 + 0.08; const n = Math.hypot(p.vx, p.vy) || 1; p.vx /= n; p.vy /= n; }
        p.x += p.vx * sp * dt; p.y += p.vy * sp * dt;
        const ytop = k === "l" ? 100 : BY;
        if (p.x < BX + r) { p.x = BX + r; p.vx = Math.abs(p.vx); hits++; } if (p.x > BX + BW - r) { p.x = BX + BW - r; p.vx = -Math.abs(p.vx); hits++; }
        if (p.y < ytop + r) { p.y = ytop + r; p.vy = Math.abs(p.vy); if (k !== "l") hits++; } if (p.y > BY + BH - r) { p.y = BY + BH - r; p.vy = -Math.abs(p.vy); hits++; }
      });
      if (k === "l") for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) { const a = parts[i], b = parts[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy); if (d > 0 && d < 2 * R) { const o = (2 * R - d) / 2, ux = dx / d, uy = dy / d; a.x -= ux * o; a.y -= uy * o; b.x += ux * o; b.y += uy * o; } }
    }
    acc += dt; if (acc >= 1) { rate = hits / acc; hits = 0; acc = 0; }
  };
  const draw = () => {
    const T = +$("#c5sT", el).value;
    let g = `<svg viewBox="0 0 360 225" role="img" aria-label="${L2("particles", "কণা")}"><rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="none" stroke="var(--muted)" stroke-width="2"/>`;
    if (k === "p") g += `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="var(--note)" opacity=".12"/>`;
    parts.forEach(p => {
      if (k === "p" && !p.ion) g += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="var(--c)"/>`;
      else if (k === "p") g += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R}" fill="var(--bad)" opacity=".85"/><text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(1)}" font-size="12" text-anchor="middle" fill="var(--sheet)">+</text>`;
      else g += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R}" fill="var(--c)" stroke="var(--ink)" stroke-width=".6"/>`;
    });
    if (k === "g") g += `<text x="${BX}" y="215" font-size="13" fill="var(--ink)">${L2("wall hits per second (≈ pressure):", "প্রতি সেকেন্ডে দেয়ালে ধাক্কা (≈ চাপ):")} <tspan font-weight="700">${B5(Math.round(rate))}</tspan></text>`;
    else g += `<text x="${BX}" y="215" font-size="13" fill="var(--muted)">${L2("temperature", "তাপমাত্রা")}: ${B5(T)} / ${B5(10)}</text>`;
    g += `</svg>`;
    $("#c5ssv", el).innerHTML = g; $("#c5stx", el).textContent = TX[k] + (k === "g" ? L2(" Raise the temperature: faster molecules hit harder and more often.", " তাপমাত্রা বাড়াও: দ্রুততর অণু আরও জোরে আর ঘন ঘন ধাক্কা দেয়।") : "");
    $("#c5sT-v", el).textContent = B5(T);
  };
  chips5(el, ".c5sk", b => { k = b.dataset.k; setup(); step(0.01); draw(); });
  $("#c5sT", el).addEventListener("input", draw);
  setup(); step(0.01);
  if (REDUCED) { for (let i = 0; i < 40; i++) step(0.03); draw(); $("#c5sst", el).addEventListener("click", () => { for (let i = 0; i < 10; i++) step(0.03); draw(); }); }
  else { draw(); animate(el, dt => { step(dt); draw(); }); }
};
