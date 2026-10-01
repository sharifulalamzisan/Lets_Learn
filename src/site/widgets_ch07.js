/* ---- chapter 7 widgets: waves and sound ---- */
const B7 = x => bnNum(x, LANG);
/* number → readable string: groups of 3 with a space, or a × 10^n form for very large/small values */
const f7 = (x, d = 0) => {
  if (!isFinite(x)) return "—";
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e7 || a < 1e-3)) { const e = Math.floor(Math.log10(a)); let m = x / Math.pow(10, e); m = +m.toFixed(2); return B7(m + " × 10<sup>" + e + "</sup>"); }
  let s = (+x.toFixed(d)).toFixed(d);
  const [i, fr] = s.split("."); const g = Math.abs(+i) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  return B7(fr ? g + "." + fr : g);
};
const chips7 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const onIn7 = (el, fn) => el.querySelectorAll("input").forEach(i => i.addEventListener("input", fn));
const arr7 = (x1, y1, x2, y2, col, w = 2.5) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, hl = Math.min(9, L * 0.6), bx = x2 - ux * hl, by = y2 - uy * hl;
  return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${col}" stroke-width="${w}"/><path d="M${x2} ${y2} L${bx - uy * 5} ${by + ux * 5} L${bx + uy * 5} ${by - ux * 5} Z" fill="${col}"/>`; };
/* play / pause button that drives an animation; returns an object whose .on says whether it is running */
const playBtn7 = (el, id, startOn) => {
  const st = { on: startOn && !REDUCED };
  const b = $("#" + id, el);
  const lab = () => { b.textContent = st.on ? L2("Pause", "থামাও") : L2("Play", "চালাও"); };
  b.addEventListener("click", () => { st.on = !st.on; lab(); }); lab();
  return st;
};
const T2 = Math.PI * 2;

/* 7.1 simple harmonic motion: mass on a spring, x–t graph and energy bars */
W.c7shm = (el) => {
  el.innerHTML = slider("c7sm", L2("Mass m", "ভর m"), 0.1, 2, 0.1, 0.5, "kg") + slider("c7sk", L2("Spring constant k", "স্প্রিং ধ্রুবক k"), 10, 60, 1, 20, "N/m") + slider("c7sa", L2("Amplitude a", "বিস্তার a"), 1, 5, 0.5, 4, "cm") +
    `<div class="w-row"><button class="btn solid" id="c7sp"></button><button class="btn" id="c7ss">${L2("Step ⅛ T", "⅛ T এগোও")}</button></div><div class="svgwrap fit" id="c7ssv"></div><div class="w-out" id="c7so"></div>`;
  let t = 0; const run = playBtn7(el, "c7sp", true);
  const hist = []; // recent (t, x) samples
  const draw = () => {
    const m = sv(el, "c7sm", "kg", 1), k = sv(el, "c7sk", "N/m"), a = sv(el, "c7sa", "cm", 1);
    const T = T2 * Math.sqrt(m / k), w = T2 / T, x = a * Math.cos(w * t), v = -a * w * Math.sin(w * t);
    const eq = 120, sc = 9, my = eq + x * sc, top = 12, sx = 60; // down = positive x on screen
    // spring zigzag from ceiling to top of mass
    const bot = my - 20; let p = `M${sx} ${top} L${sx} ${top + 8}`; const n = 12;
    for (let i = 1; i <= n; i++) { const yy = top + 8 + (bot - top - 16) * i / n; p += ` L${sx + (i % 2 ? -12 : 12)} ${yy}`; }
    p += ` L${sx} ${bot - 0} L${sx} ${bot + 2}`;
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("mass on a spring", "স্প্রিংয়ে ভর")}">
      <rect x="20" y="4" width="80" height="8" fill="var(--muted)"/>
      <path d="${p}" fill="none" stroke="var(--c)" stroke-width="2"/>
      <rect x="${sx - 20}" y="${my - 20}" width="40" height="40" rx="4" fill="var(--c)" opacity=".85"/>
      <text x="${sx}" y="${my + 5}" font-size="13" text-anchor="middle" fill="var(--sheet)">m</text>
      <line x1="12" y1="${eq}" x2="108" y2="${eq}" stroke="var(--note)" stroke-dasharray="4 3"/>
      <line x1="226" y1="12" x2="250" y2="12" stroke="var(--note)" stroke-dasharray="4 3"/><text x="254" y="16" font-size="12" fill="var(--note)">${L2("equilibrium", "সাম্যাবস্থা")}</text>`;
    // restoring force arrow (towards equilibrium), length ∝ x
    if (Math.abs(x) > 0.15) g += arr7(sx + 32, my, sx + 32, my - x * 7, "var(--bad)", 2.5) + `<text x="${sx + 38}" y="${my - x * 3.5 + 4}" font-size="13" fill="var(--bad)">F</text>`;
    // x–t graph (last 4 s)
    const gx = 130, gw = 220, gy = eq, W4 = 4;
    const X = tt => gx + gw - (t - tt) / W4 * gw;
    g += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--note)" stroke-dasharray="4 3"/><line x1="${gx}" y1="${gy - 55}" x2="${gx}" y2="${gy + 55}" stroke="var(--rule)"/>
      <text x="${gx + gw}" y="${gy + 70}" font-size="12" text-anchor="end" fill="var(--muted)">${L2("time →", "সময় →")}</text><text x="${gx + 4}" y="${gy - 58}" font-size="12" fill="var(--muted)">${L2("displacement", "সরণ")}</text>`;
    let pts = ""; for (let tt = t - W4; tt <= t + 1e-9; tt += 0.02) pts += `${X(tt).toFixed(1)},${(gy + a * Math.cos(w * tt) * sc).toFixed(1)} `;
    g += `<polyline points="${pts}" fill="none" stroke="var(--c)" stroke-width="2"/><line x1="${sx + 20}" y1="${my}" x2="${gx + gw}" y2="${my}" stroke="var(--muted)" stroke-dasharray="2 4"/><circle cx="${gx + gw}" cy="${my}" r="5" fill="var(--bad)"/>`;
    // energy bars
    const KE = 0.5 * k * (a * a - x * x) / 1e4, PE = 0.5 * k * x * x / 1e4, E = 0.5 * k * a * a / 1e4, bw = 150;
    g += `<text x="12" y="208" font-size="13" fill="var(--ink)">${L2("Kinetic", "গতিশক্তি")}</text><rect x="95" y="197" width="${bw}" height="14" rx="3" fill="none" stroke="var(--rule)"/><rect x="95" y="197" width="${bw * KE / E}" height="14" rx="3" fill="var(--good)"/>
      <text x="12" y="232" font-size="13" fill="var(--ink)">${L2("Potential", "বিভবশক্তি")}</text><rect x="95" y="221" width="${bw}" height="14" rx="3" fill="none" stroke="var(--rule)"/><rect x="95" y="221" width="${bw * PE / E}" height="14" rx="3" fill="var(--note)"/>
      <text x="255" y="220" font-size="12" fill="var(--muted)">${L2("total", "মোট")} = ${f7(E * 1000, 1)} mJ</text></svg>`;
    $("#c7ssv", el).innerHTML = g;
    const where = Math.abs(x) > a * 0.97 ? L2("at an end: momentarily at rest, all energy is potential", "এক প্রান্তে: ক্ষণিক স্থির, সব শক্তি বিভবশক্তি") : Math.abs(x) < a * 0.05 ? L2("passing equilibrium: fastest, all energy is kinetic", "সাম্যাবস্থা পার হচ্ছে: সবচেয়ে দ্রুত, সব শক্তি গতিশক্তি") : (v < 0 ? L2("moving up", "ওপরে যাচ্ছে") : L2("moving down", "নিচে নামছে"));
    $("#c7so", el).innerHTML = L2(`T = 2π√(m/k) = 2π√(${f7(m, 1)} ÷ ${f7(k)}) = <b>${f7(T, 2)} s</b>, f = 1/T = <b>${f7(1 / T, 2)} Hz</b>. The mass is ${where}. Change the amplitude: T does not change.`,
      `T = 2π√(m/k) = 2π√(${f7(m, 1)} ÷ ${f7(k)}) = <b>${f7(T, 2)} s</b>, f = 1/T = <b>${f7(1 / T, 2)} Hz</b>। ভরটি ${where}। বিস্তার বদলাও: T বদলায় না।`);
  };
  $("#c7ss", el).addEventListener("click", () => { const m = +$("#c7sm", el).value, k = +$("#c7sk", el).value; t += T2 * Math.sqrt(m / k) / 8; draw(); });
  onIn7(el, draw);
  if (REDUCED) t = 0; draw();
  animate(el, dt => { if (!run.on) return; t += dt; draw(); });
};

/* 7.2 superposition of two pulses on a rope; a marked particle only moves up and down */
W.c7super = (el) => {
  let mode = "same";
  el.innerHTML = `<div class="chipset c7pm" role="group"><button data-k="same" aria-pressed="true">${L2("Both upward", "দুটোই ওপরে")}</button><button data-k="opp" aria-pressed="false">${L2("One up, one down", "একটি ওপরে, একটি নিচে")}</button></div>
  ${slider("c7pt", L2("Time", "সময়"), 0, 1, 0.005, 0.2, "")}<div class="w-row"><button class="btn solid" id="c7pp"></button></div><div class="svgwrap fit" id="c7psv"></div><div class="w-out" id="c7po"></div>`;
  const run = playBtn7(el, "c7pp", true);
  const draw = () => {
    const s = +$("#c7pt", el).value; $("#c7pt-v", el).textContent = "";
    const x1 = 40 + s * 280, x2 = 320 - s * 280, A = 45, wd = 22, A2 = mode === "same" ? A : -A, y0 = 110;
    const p1 = x => A * Math.exp(-(((x - x1) / wd) ** 2)), p2 = x => A2 * Math.exp(-(((x - x2) / wd) ** 2));
    let a = "", b = "", c = "";
    for (let x = 0; x <= 360; x += 3) { a += `${x},${(y0 - p1(x)).toFixed(1)} `; b += `${x},${(y0 - p2(x)).toFixed(1)} `; c += `${x},${(y0 - p1(x) - p2(x)).toFixed(1)} `; }
    const mx = 110, my = y0 - p1(mx) - p2(mx);
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("superposition", "উপরিপাতন")}">
      <line x1="0" y1="${y0}" x2="360" y2="${y0}" stroke="var(--rule)" stroke-dasharray="3 4"/>
      <polyline points="${a}" fill="none" stroke="var(--note)" stroke-width="1.5" stroke-dasharray="5 4"/>
      <polyline points="${b}" fill="none" stroke="var(--good)" stroke-width="1.5" stroke-dasharray="5 4"/>
      <polyline points="${c}" fill="none" stroke="var(--c)" stroke-width="3.5"/>
      <line x1="${mx}" y1="${y0 - 58}" x2="${mx}" y2="${y0 + 58}" stroke="var(--bad)" stroke-width="1" opacity=".35"/>
      <circle cx="${mx}" cy="${my.toFixed(1)}" r="6" fill="var(--bad)"/>
      ${arr7(x1 - 18, 185, x1 + 14, 185, "var(--note)", 2)}${arr7(x2 + 18, 185, x2 - 14, 185, "var(--good)", 2)}
      <text x="8" y="20" font-size="13" fill="var(--muted)">${L2("dashed: each pulse alone · thick: the rope", "ড্যাশ: আলাদা স্পন্দ · মোটা: দড়ি")}</text></svg>`;
    $("#c7psv", el).innerHTML = g;
    const meet = Math.abs(x1 - x2) < 12;
    $("#c7po", el).innerHTML = meet
      ? (mode === "same" ? L2("They overlap: the displacements <b>add</b>, making a pulse twice as tall.", "মিলে গেছে: সরণগুলো <b>যোগ হয়ে</b> দ্বিগুণ উঁচু স্পন্দ তৈরি করেছে।")
        : L2("They overlap: +45 and −45 add to <b>zero</b>. The rope is flat for an instant.", "মিলে গেছে: +৪৫ আর −৪৫ যোগ হয়ে <b>শূন্য</b>। এক মুহূর্তের জন্য দড়ি সমতল।"))
      : L2("Move the time slider or press Play. After meeting, each pulse carries on unchanged. The red particle only moves up and down; it never travels along the rope.",
        "সময় স্লাইডার সরাও বা চালাও চাপো। মিলনের পর প্রতিটি স্পন্দ অপরিবর্তিত এগিয়ে যায়। লাল কণাটি শুধু ওঠানামা করে; দড়ি বরাবর কখনো সরে না।");
  };
  chips7(el, ".c7pm", b => { mode = b.dataset.k; draw(); });
  $("#c7pt", el).addEventListener("input", () => { run.on = false; $("#c7pp", el).textContent = L2("Play", "চালাও"); draw(); });
  draw();
  animate(el, dt => { if (!run.on) return; const s = $("#c7pt", el); let v = +s.value + dt * 0.22; if (v > 1) v = 0; s.value = v; draw(); });
};

/* 7.2.2 transverse vs longitudinal: particles vibrate, the wave travels */
W.c7types = (el) => {
  let kind = "t", t = 0;
  el.innerHTML = `<div class="chipset c7tk" role="group"><button data-k="t" aria-pressed="true">${L2("Transverse", "অনুপ্রস্থ")}</button><button data-k="l" aria-pressed="false">${L2("Longitudinal", "অনুদৈর্ঘ্য")}</button></div>
  <div class="w-row"><button class="btn solid" id="c7tp"></button></div><div class="svgwrap fit" id="c7tsv"></div><p class="hint" id="c7tx"></p>`;
  const run = playBtn7(el, "c7tp", true);
  const lam = 150, per = 1.6, N = 25, x0 = 18, dx = 13.5, hi = 8;
  const draw = () => {
    const k = T2 / lam, w = T2 / per, ph = x => k * x - w * t; // wave travels to the right
    let g = `<svg viewBox="0 0 360 215" role="img" aria-label="${kind === "t" ? L2("transverse wave", "অনুপ্রস্থ তরঙ্গ") : L2("longitudinal wave", "অনুদৈর্ঘ্য তরঙ্গ")}">`;
    const mod = (a, b) => ((a % b) + b) % b;
    if (kind === "t") {
      const y0 = 95, A = 38;
      let pl = ""; for (let x = x0; x <= x0 + dx * (N - 1); x += 3) pl += `${x},${(y0 - A * Math.sin(ph(x))).toFixed(1)} `;
      g += `<line x1="${x0}" y1="${y0}" x2="${x0 + dx * (N - 1)}" y2="${y0}" stroke="var(--rule)" stroke-dasharray="3 4"/><polyline points="${pl}" fill="none" stroke="var(--c-soft)" stroke-width="6"/>`;
      for (let i = 0; i < N; i++) { const x = x0 + i * dx, y = y0 - A * Math.sin(ph(x)); g += `<circle cx="${x}" cy="${y.toFixed(1)}" r="${i === hi ? 6.5 : 4.5}" fill="${i === hi ? "var(--bad)" : "var(--c)"}"/>`; }
      const xh = x0 + hi * dx; g += arr7(xh + 12, y0, xh + 12, y0 - A - 4, "var(--bad)", 2) + arr7(xh + 12, y0, xh + 12, y0 + A + 4, "var(--bad)", 2);
      // crest and trough labels (sin = 1 → crest, sin = −1 → trough)
      [[Math.PI / 2, L2("crest", "শীর্ষ"), -1], [3 * Math.PI / 2, L2("trough", "পাদ"), 1]].forEach(([p0, lb, s]) => {
        for (let n = -2; n <= 3; n++) { const x = (p0 + w * t + T2 * n) / k; if (x > x0 + 10 && x < x0 + dx * (N - 1) - 10) g += `<text x="${x.toFixed(1)}" y="${y0 + s * (A + 20) + (s > 0 ? 6 : 0)}" font-size="13" text-anchor="middle" fill="var(--muted)">${lb}</text>`; }
      });
    } else {
      const A = 11, rows = [52, 72, 92, 112, 132];
      rows.forEach(y => { for (let i = 0; i < N; i++) { const xe = x0 + i * dx, x = xe + A * Math.sin(ph(xe)); const me = i === hi && y === 92; g += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${me ? 6.5 : 3.8}" fill="${me ? "var(--bad)" : "var(--c)"}"/>`; } });
      const xh = x0 + hi * dx; g += arr7(xh, 30, xh - A - 6, 30, "var(--bad)", 2) + arr7(xh, 30, xh + A + 6, 30, "var(--bad)", 2);
      // compression where cos(phase) = −1, rarefaction where cos(phase) = +1
      [[Math.PI, L2("C", "সং"), "var(--bad)"], [0, L2("R", "প্র"), "var(--good)"]].forEach(([p0, lb, col]) => {
        for (let n = -2; n <= 3; n++) { const x = (p0 + w * t + T2 * n) / k; if (x > x0 + 6 && x < x0 + dx * (N - 1) - 6) g += `<text x="${x.toFixed(1)}" y="156" font-size="14" font-weight="700" text-anchor="middle" fill="${col}">${lb}</text>`; }
      });
      g += `<text x="8" y="176" font-size="12" fill="var(--muted)">${L2("C = compression, R = rarefaction", "সং = সংকোচন, প্র = প্রসারণ")}</text>`;
    }
    g += arr7(110, 200, 250, 200, "var(--ink)", 2.5) + `<text x="255" y="204" font-size="13" fill="var(--ink)">${L2("wave travels", "তরঙ্গের গতি")}</text>`;
    g += `<text x="8" y="204" font-size="13" fill="var(--bad)">${L2("● particle", "● কণা")}</text></svg>`;
    $("#c7tsv", el).innerHTML = g;
    $("#c7tx", el).innerHTML = kind === "t"
      ? L2("The red particle moves <b>up and down</b>, at right angles to the direction the wave travels. The humps (crests) and hollows (troughs) move right; the particles don't.", "লাল কণাটি <b>ওপর-নিচ</b> করে, তরঙ্গের গতির সাথে সমকোণে। শীর্ষ আর পাদ ডানে সরে; কণাগুলো সরে না।")
      : L2("The red particle moves <b>back and forth</b>, along the direction the wave travels. Crowded regions (compressions) and spread-out regions (rarefactions) move right; this is how sound travels in air.", "লাল কণাটি তরঙ্গের গতির দিক বরাবর <b>সামনে-পেছনে</b> কাঁপে। ঘন অংশ (সংকোচন) আর ফাঁকা অংশ (প্রসারণ) ডানে সরে; বাতাসে শব্দ এভাবেই চলে।");
  };
  chips7(el, ".c7tk", b => { kind = b.dataset.k; draw(); });
  if (REDUCED) t = 0.3; draw();
  animate(el, dt => { if (!run.on) return; t += dt; draw(); });
};

/* 7.2.3 wave quantities: displacement–position snapshot and displacement–time graph, v = fλ */
W.c7wave = (el) => {
  el.innerHTML = slider("c7wa", L2("Amplitude a", "বিস্তার a"), 0.5, 2, 0.1, 1.5, "cm") + slider("c7wl", L2("Wavelength λ", "তরঙ্গদৈর্ঘ্য λ"), 0.5, 3, 0.1, 2, "m") + slider("c7wf", L2("Frequency f", "কম্পাঙ্ক f"), 0.2, 2, 0.1, 0.5, "Hz") +
    `<div class="w-row"><button class="btn solid" id="c7wp"></button></div><div class="svgwrap fit" id="c7wsv"></div><div class="w-out" id="c7wo"></div>`;
  let t = 0; const run = playBtn7(el, "c7wp", true); const xp = 1; // red particle at x = 1 m
  const mod = (a, b) => ((a % b) + b) % b;
  const draw = () => {
    const a = sv(el, "c7wa", "cm", 1), lam = sv(el, "c7wl", "m", 1), f = sv(el, "c7wf", "Hz", 1), T = 1 / f, v = f * lam;
    const y = (x, tt) => a * Math.sin(T2 * (f * tt - x / lam));
    const gx = 38, gw = 310, s = 14; // 1 cm = 14 px
    // top: y vs x (0–6 m) at time t
    const X = x => gx + x / 6 * gw, y1 = 62;
    let g = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("wave graphs", "তরঙ্গের লেখচিত্র")}">
      <text x="${gx}" y="14" font-size="13" fill="var(--ink)">${L2("① displacement vs position (a snapshot)", "① অবস্থানের সাপেক্ষে সরণ (এক মুহূর্তের ছবি)")}</text>
      <line x1="${gx}" y1="${y1}" x2="${gx + gw}" y2="${y1}" stroke="var(--rule)"/><line x1="${gx}" y1="${y1 - 34}" x2="${gx}" y2="${y1 + 34}" stroke="var(--rule)"/>
      <text x="${X(6)}" y="${y1 + 48}" font-size="12" text-anchor="end" fill="var(--muted)">${B7(6)} m</text>`;
    [0, 2, 4].forEach(xx => g += `<text x="${X(xx)}" y="${y1 + 48}" font-size="12" text-anchor="middle" fill="var(--muted)">${B7(xx)}</text>`);
    g += `<text x="${X(5)}" y="${y1 + 48}" font-size="12" text-anchor="middle" fill="var(--muted)">x →</text>`;
    let pl = ""; for (let x = 0; x <= 6.001; x += 0.03) pl += `${X(x).toFixed(1)},${(y1 - y(x, t) * s).toFixed(1)} `;
    g += `<polyline points="${pl}" fill="none" stroke="var(--c)" stroke-width="2.5"/><circle cx="${X(xp)}" cy="${(y1 - y(xp, t) * s).toFixed(1)}" r="5.5" fill="var(--bad)"/>`;
    // λ bracket between two neighbouring crests
    const xc = mod(lam * (f * t - 0.25), lam); if (xc + lam <= 6) { const yb = y1 - a * s - 8;
      g += `<line x1="${X(xc)}" y1="${yb}" x2="${X(xc + lam)}" y2="${yb}" stroke="var(--note)" stroke-width="1.5"/><line x1="${X(xc)}" y1="${yb - 4}" x2="${X(xc)}" y2="${yb + 4}" stroke="var(--note)"/><line x1="${X(xc + lam)}" y1="${yb - 4}" x2="${X(xc + lam)}" y2="${yb + 4}" stroke="var(--note)"/>
      <text x="${(X(xc) + X(xc + lam)) / 2}" y="${yb - 5}" font-size="13" text-anchor="middle" fill="var(--note)">λ</text>`; }
    // amplitude marker
    g += `<line x1="${gx - 8}" y1="${y1}" x2="${gx - 8}" y2="${y1 - a * s}" stroke="var(--good)" stroke-width="2"/><text x="${gx - 12}" y="${y1 - a * s / 2 + 4}" font-size="13" text-anchor="end" fill="var(--good)">a</text>`;
    // bottom: y vs t (0–4 s) at x = xp
    const y2 = 210, TX = tt => gx + tt / 4 * gw;
    g += `<text x="${gx}" y="${y2 - 50}" font-size="13" fill="var(--ink)">${L2("② displacement vs time (the red particle)", "② সময়ের সাপেক্ষে সরণ (লাল কণা)")}</text>
      <line x1="${gx}" y1="${y2}" x2="${gx + gw}" y2="${y2}" stroke="var(--rule)"/><line x1="${gx}" y1="${y2 - 34}" x2="${gx}" y2="${y2 + 34}" stroke="var(--rule)"/>
      <text x="${TX(4)}" y="${y2 + 48}" font-size="12" text-anchor="end" fill="var(--muted)">${B7(4)} s</text><text x="${TX(3.5)}" y="${y2 + 48}" font-size="12" text-anchor="middle" fill="var(--muted)">t →</text>`;
    [0, 1, 2, 3].forEach(tt => g += `<text x="${TX(tt)}" y="${y2 + 48}" font-size="12" text-anchor="middle" fill="var(--muted)">${B7(tt)}</text>`);
    let pt = ""; for (let tt = 0; tt <= 4.001; tt += 0.02) pt += `${TX(tt).toFixed(1)},${(y2 - y(xp, tt) * s).toFixed(1)} `;
    const tc = mod(t, 4);
    g += `<polyline points="${pt}" fill="none" stroke="var(--c)" stroke-width="2.5"/><line x1="${TX(tc)}" y1="${y2 - 34}" x2="${TX(tc)}" y2="${y2 + 34}" stroke="var(--bad)" stroke-dasharray="3 3"/><circle cx="${TX(tc)}" cy="${(y2 - y(xp, tc) * s).toFixed(1)}" r="5.5" fill="var(--bad)"/>`;
    const t0 = mod((0.25 + xp / lam) / f, T); if (t0 + T <= 4) { const yb = y2 - a * s - 8;
      g += `<line x1="${TX(t0)}" y1="${yb}" x2="${TX(t0 + T)}" y2="${yb}" stroke="var(--note)" stroke-width="1.5"/><line x1="${TX(t0)}" y1="${yb - 4}" x2="${TX(t0)}" y2="${yb + 4}" stroke="var(--note)"/><line x1="${TX(t0 + T)}" y1="${yb - 4}" x2="${TX(t0 + T)}" y2="${yb + 4}" stroke="var(--note)"/>
      <text x="${(TX(t0) + TX(t0 + T)) / 2}" y="${yb - 5}" font-size="13" text-anchor="middle" fill="var(--note)">T</text>`; }
    g += `</svg>`;
    $("#c7wsv", el).innerHTML = g;
    $("#c7wo", el).innerHTML = L2(`T = 1/f = 1 ÷ ${f7(f, 1)} = <b>${f7(T, 2)} s</b><br>v = fλ = ${f7(f, 1)} × ${f7(lam, 1)} = <b>${f7(v, 2)} m/s</b><br><span class="muted">Graph ① gives a and λ; graph ② gives a and T. You need both to find v.</span>`,
      `T = 1/f = ১ ÷ ${f7(f, 1)} = <b>${f7(T, 2)} s</b><br>v = fλ = ${f7(f, 1)} × ${f7(lam, 1)} = <b>${f7(v, 2)} m/s</b><br><span class="muted">① থেকে a ও λ; ② থেকে a ও T পাওয়া যায়। v বের করতে দুটোই লাগে।</span>`);
  };
  onIn7(el, draw);
  if (REDUCED) t = 0.4; draw();
  animate(el, dt => { if (!run.on) return; t += dt; draw(); });
};

/* 7.3 range of hearing on a log frequency scale */
W.c7range = (el) => {
  el.innerHTML = slider("c7rf", L2("Frequency (log scale)", "কম্পাঙ্ক (লগ স্কেল)"), 0, 5.3, 0.01, 2.64, "") + `<div class="svgwrap fit" id="c7rsv"></div><div class="w-out" id="c7ro"></div>`;
  const fmtF = f => f >= 1000 ? f7(f / 1000, f >= 10000 ? 0 : 1) + " kHz" : f7(f, f < 10 ? 1 : 0) + " Hz";
  const fmtL = l => l >= 1 ? f7(l, 2) + " m" : l >= 0.01 ? f7(l * 100, 1) + " cm" : f7(l * 1000, 1) + " mm";
  const MK = [[85, 1100, L2("human voice", "মানুষের গলা"), 0], [440, 440, L2("tuning fork A (440 Hz)", "সুরশলাকা A (৪৪০ Hz)"), 1], [23000, 54000, L2("dog whistle", "কুকুরের বাঁশি"), 2], [20000, 110000, L2("bat calls", "বাদুড়ের ডাক"), 3], [1, 18, L2("earthquake rumble", "ভূমিকম্পের গুমগুম"), 4]];
  const draw = () => {
    const lg = +$("#c7rf", el).value, f = Math.pow(10, lg); $("#c7rf-v", el).textContent = B7(fmtF(f).replace(/<[^>]+>/g, ""));
    const X = ff => 20 + Math.log10(ff) / 5.3 * 320, y = 70;
    let g = `<svg viewBox="0 0 360 212" role="img" aria-label="${L2("range of hearing", "শ্রুতিসীমা")}">
      <rect x="${X(1)}" y="${y}" width="${X(20) - X(1)}" height="28" fill="var(--note)" opacity=".35"/>
      <rect x="${X(20)}" y="${y}" width="${X(20000) - X(20)}" height="28" fill="var(--good)" opacity=".35"/>
      <rect x="${X(20000)}" y="${y}" width="${X(200000) - X(20000)}" height="28" fill="var(--c)" opacity=".35"/>
      <text x="${(X(1) + X(20)) / 2}" y="${y + 19}" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("infra", "শব্দেতর")}</text>
      <text x="${(X(20) + X(20000)) / 2}" y="${y + 19}" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("audible", "শ্রাব্য")}</text>
      <text x="${(X(20000) + X(200000)) / 2}" y="${y + 19}" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("ultra", "শব্দোত্তর")}</text>`;
    [[1, "1 Hz"], [20, "20 Hz"], [1000, "1 kHz"], [20000, "20 kHz"], [200000, "200 kHz"]].forEach(([ff, lb]) => g += `<line x1="${X(ff)}" y1="${y + 28}" x2="${X(ff)}" y2="${y + 34}" stroke="var(--muted)"/><text x="${X(ff)}" y="${y + 47}" font-size="12" text-anchor="${ff === 1 ? "start" : ff === 200000 ? "end" : "middle"}" fill="var(--muted)">${B7(lb)}</text>`);
    MK.forEach(([a, b, lb, row]) => { const yy = y + 62 + row * 16, x1 = X(a), x2 = Math.max(X(b), x1 + 3);
      g += `<rect x="${x1}" y="${yy - 7}" width="${x2 - x1}" height="6" rx="3" fill="var(--muted)" opacity=".7"/><text x="${x1 > 200 ? x1 - 4 : x2 + 4}" y="${yy}" font-size="12" text-anchor="${x1 > 200 ? "end" : "start"}" fill="var(--muted)">${lb}</text>`; });
    const xf = X(f);
    g += `<path d="M${xf} ${y - 2} l-8 -14 h16 z" fill="var(--bad)"/><text x="${Math.min(300, Math.max(50, xf))}" y="${y - 22}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--bad)">${fmtF(f)}</text></svg>`;
    $("#c7rsv", el).innerHTML = g;
    const zone = f < 20 ? L2("<b>Infrasound</b> (below 20 Hz): we can't hear it, but elephants and many animals can sense it.", "<b>শব্দেতর</b> (২০ Hz-এর কম): আমরা শুনি না, কিন্তু হাতি আর অনেক প্রাণী টের পায়।")
      : f <= 20000 ? L2("<b>Audible</b> (20 Hz – 20 kHz): a healthy human ear can hear it.", "<b>শ্রাব্য</b> (২০ Hz – ২০ kHz): সুস্থ মানুষের কান শুনতে পায়।")
        : L2("<b>Ultrasound</b> (above 20 kHz): too high for us; bats, dolphins and ultrasonography use it.", "<b>শব্দোত্তর</b> (২০ kHz-এর বেশি): আমাদের জন্য খুব উঁচু; বাদুড়, ডলফিন আর আলট্রাসনোগ্রাফি এটি ব্যবহার করে।");
    $("#c7ro", el).innerHTML = zone + "<br>" + L2(`Wavelength in air: λ = v/f = 330 ÷ ${f7(f, f < 10 ? 1 : 0)} ≈ <b>${fmtL(330 / f)}</b>`, `বাতাসে তরঙ্গদৈর্ঘ্য: λ = v/f = ৩৩০ ÷ ${f7(f, f < 10 ? 1 : 0)} ≈ <b>${fmtL(330 / f)}</b>`);
  };
  onIn7(el, draw); draw();
};

/* 7.3.1 echo: distance, temperature, round-trip time and the 0.1 s rule */
W.c7echo = (el) => {
  const PR = [[L2("Farhan, winter (17.25 m, 10°C)", "ফারহান, শীত (১৭.২৫ m, ১০°C)"), 17.25, 10], [L2("Farhan, summer (17.25 m, 30°C)", "ফারহান, গ্রীষ্ম (১৭.২৫ m, ৩০°C)"), 17.25, 30], [L2("Classroom wall (5 m)", "ক্লাসরুমের দেয়াল (৫ m)"), 5, 25]];
  el.innerHTML = `<div class="chipset c7ep" role="group">${PR.map((p, i) => `<button data-i="${i}" aria-pressed="false">${p[0]}</button>`).join("")}</div>
  ${slider("c7ed", L2("Distance to wall d", "দেয়ালের দূরত্ব d"), 2, 60, 0.25, 25, "m")}${slider("c7et", L2("Air temperature", "বাতাসের তাপমাত্রা"), 0, 40, 1, 25, "°C")}
  <div class="w-row"><button class="btn solid" id="c7ec">${L2("Clap!", "হাততালি!")}</button></div><div class="svgwrap fit" id="c7esv"></div><div class="w-out" id="c7eo"></div>`;
  let ph = -1; // pulse progress 0..2 (0→1 going, 1→2 returning), −1 = none
  const draw = () => {
    const d = sv(el, "c7ed", "m", 2), th = sv(el, "c7et", "°C"), v = 332 * Math.sqrt((273 + th) / 273), t = 2 * d / v, ok = t >= 0.1 - 1e-9;
    const px = 34, wx = 34 + d / 60 * 300, y = 70;
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("echo", "প্রতিধ্বনি")}">
      <line x1="0" y1="120" x2="360" y2="120" stroke="var(--muted)" stroke-width="2"/>
      <circle cx="${px - 12}" cy="${y + 8}" r="8" fill="var(--ink)"/><path d="M${px - 12} ${y + 16} V${y + 36} M${px - 12} ${y + 36} l-7 14 M${px - 12} ${y + 36} l7 14 M${px - 22} ${y + 24} H${px - 2}" stroke="var(--ink)" stroke-width="3" fill="none"/>
      <rect x="${wx}" y="30" width="14" height="90" fill="var(--muted)"/>
      <line x1="${px}" y1="136" x2="${wx}" y2="136" stroke="var(--ink)"/><line x1="${px}" y1="131" x2="${px}" y2="141" stroke="var(--ink)"/><line x1="${wx}" y1="131" x2="${wx}" y2="141" stroke="var(--ink)"/>
      <text x="${(px + wx) / 2}" y="152" font-size="13" text-anchor="middle" fill="var(--ink)">d = ${f7(d, 2)} m</text>`;
    if (ph >= 0) { const go = ph <= 1, xx = go ? px + (wx - px) * ph : wx - (wx - px) * (ph - 1), col = go ? "var(--c)" : "var(--bad)";
      for (let i = 0; i < 3; i++) g += `<path d="M${xx + (go ? -i * 7 : i * 7)} ${y - 8} q${go ? 7 : -7} 18 0 36" fill="none" stroke="${col}" stroke-width="2.5" opacity="${1 - i * 0.3}"/>`; }
    // timeline 0–0.4 s
    const T0 = 20, TW = 320, TX = tt => T0 + Math.min(tt, 0.4) / 0.4 * TW, ty = 178;
    g += `<rect x="${T0}" y="${ty - 8}" width="${TX(0.1) - T0}" height="16" fill="var(--bad)" opacity=".15"/><line x1="${T0}" y1="${ty}" x2="${T0 + TW}" y2="${ty}" stroke="var(--muted)"/>
      <line x1="${TX(0.1)}" y1="${ty - 12}" x2="${TX(0.1)}" y2="${ty + 12}" stroke="var(--bad)" stroke-dasharray="3 2"/><text x="${TX(0.1) + 4}" y="${ty - 12}" font-size="12" fill="var(--bad)">${B7("0.1 s")}</text>
      <circle cx="${T0}" cy="${ty}" r="5" fill="var(--c)"/><text x="${T0}" y="${ty + 20}" font-size="12" fill="var(--muted)">${L2("clap", "তালি")}</text>
      <circle cx="${TX(t)}" cy="${ty}" r="6" fill="${ok ? "var(--good)" : "var(--bad)"}"/><text x="${Math.min(330, TX(t))}" y="${ty + 20}" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("echo", "প্রতিধ্বনি")}${t > 0.4 ? " →" : ""}</text>
      <text x="${T0 + TW}" y="${ty - 12}" font-size="12" text-anchor="end" fill="var(--muted)">${B7("0.4 s")}</text></svg>`;
    $("#c7esv", el).innerHTML = g;
    const dmin = v * 0.1 / 2;
    $("#c7eo", el).innerHTML = L2(`v = 332 × √(${273 + th} ÷ 273) = ${f7(v, 1)} m/s<br>t = 2d/v = ${f7(2 * d, 2)} ÷ ${f7(v, 1)} = <b>${f7(t, 3)} s</b> → ${ok ? "<b style='color:var(--good)'>echo heard separately</b>" : "<b style='color:var(--bad)'>too soon: it merges with the clap</b>"}<br><span class="muted">Minimum distance at this temperature: v × 0.1 ÷ 2 = ${f7(dmin, 2)} m</span>`,
      `v = ৩৩২ × √(${f7(273 + th)} ÷ ২৭৩) = ${f7(v, 1)} m/s<br>t = ২d/v = ${f7(2 * d, 2)} ÷ ${f7(v, 1)} = <b>${f7(t, 3)} s</b> → ${ok ? "<b style='color:var(--good)'>প্রতিধ্বনি আলাদা শোনা যায়</b>" : "<b style='color:var(--bad)'>খুব তাড়াতাড়ি: তালির সাথে মিশে যায়</b>"}<br><span class="muted">এই তাপমাত্রায় সর্বনিম্ন দূরত্ব: v × ০.১ ÷ ২ = ${f7(dmin, 2)} m</span>`);
  };
  chips7(el, ".c7ep", b => { const p = PR[+b.dataset.i]; $("#c7ed", el).value = p[1]; $("#c7et", el).value = p[2]; ph = -1; draw(); });
  onIn7(el, () => { el.querySelectorAll(".c7ep button").forEach(q => q.setAttribute("aria-pressed", "false")); ph = -1; draw(); });
  $("#c7ec", el).addEventListener("click", () => { if (REDUCED) { ph = 1.5; draw(); } else ph = 0; });
  draw();
  animate(el, dt => { if (ph < 0) return; ph += dt * 1.2; if (ph > 2) ph = -1; draw(); });
};

/* 7.3.2 speed of sound in different media: a 1 km race, and air speed vs temperature */
W.c7speed = (el) => {
  const M = [[L2("Air", "বাতাস"), 0], [L2("Hydrogen", "হাইড্রোজেন"), 1284], [L2("Mercury", "পারদ"), 1450], [L2("Water", "পানি"), 1493], [L2("Iron", "লোহা"), 5130], [L2("Diamond", "হীরা"), 12000]];
  el.innerHTML = slider("c7vt", L2("Air temperature θ", "বাতাসের তাপমাত্রা θ"), -20, 45, 1, 20, "°C") +
    `<div class="w-row"><button class="btn solid" id="c7vr">${L2("Race 1 km", "১ km দৌড়")}</button><button class="btn" id="c7vx">${L2("Reset", "আবার")}</button></div><div class="svgwrap fit" id="c7vsv"></div><div class="w-out" id="c7vo"></div>`;
  let tr = 0, run = false;
  const draw = () => {
    const th = sv(el, "c7vt", "°C"), va = 332 * Math.sqrt((273 + th) / 273);
    const sp = M.map(m => m[1] || va);
    const lx = 80, rx = 340;
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("speed of sound race", "শব্দের বেগের দৌড়")}"><text x="${lx}" y="14" font-size="12" fill="var(--muted)">${L2("start", "শুরু")}</text><text x="${rx}" y="14" font-size="12" text-anchor="end" fill="var(--muted)">${B7("1 km")}</text>`;
    M.forEach((m, i) => { const y = 34 + i * 34, v = sp[i], fr = Math.min(1, v * tr / 1000), done = fr >= 1, tt = 1000 / v;
      g += `<text x="4" y="${y + 4}" font-size="13" fill="var(--ink)">${m[0]}</text><line x1="${lx}" y1="${y}" x2="${rx}" y2="${y}" stroke="var(--rule)" stroke-width="2"/>
        <circle cx="${lx + fr * (rx - lx)}" cy="${y}" r="6.5" fill="${i === 0 ? "var(--bad)" : "var(--c)"}"/>
        <text x="${lx}" y="${y + 18}" font-size="12" fill="var(--muted)">${f7(v)} m/s${done || !tr ? " · " + f7(tt, tt < 1 ? 3 : 2) + " s" : ""}</text>`; });
    g += `<line x1="${rx}" y1="22" x2="${rx}" y2="222" stroke="var(--ink)" stroke-dasharray="4 3"/></svg>`;
    $("#c7vsv", el).innerHTML = g;
    $("#c7vo", el).innerHTML = L2(`Air at ${f7(th)}°C: T = ${f7(th)} + 273 = ${f7(th + 273)} K, v = 332 × √(${f7(th + 273)} ÷ 273) = <b>${f7(va, 1)} m/s</b>. Warmer air → faster sound.<br>Clock: ${f7(tr, 2)} s. Sound travels about ${f7(5130 / va, 0)} times faster in iron than in this air.`,
      `${f7(th)}°C-এ বাতাস: T = ${f7(th)} + ২৭৩ = ${f7(th + 273)} K, v = ৩৩২ × √(${f7(th + 273)} ÷ ২৭৩) = <b>${f7(va, 1)} m/s</b>। গরম বাতাস → দ্রুত শব্দ।<br>ঘড়ি: ${f7(tr, 2)} s। লোহায় শব্দ এই বাতাসের চেয়ে প্রায় ${f7(5130 / va, 0)} গুণ দ্রুত চলে।`);
  };
  $("#c7vr", el).addEventListener("click", () => { if (REDUCED) { tr = 4; draw(); } else { tr = 0; run = true; } });
  $("#c7vx", el).addEventListener("click", () => { tr = 0; run = false; draw(); });
  onIn7(el, draw); draw();
  animate(el, dt => { if (!run) return; tr += dt; if (tr >= 3.6) run = false; draw(); });
};

/* 7.3.3 SONAR: ship pings the sea bed (or a shoal of fish) and uses d = vt/2 */
W.c7sonar = (el) => {
  el.innerHTML = slider("c7ox", L2("Ship position", "জাহাজের অবস্থান"), 0, 100, 1, 30, "%") +
    `<div class="w-row"><button class="btn solid" id="c7op">${L2("Send pulse", "স্পন্দ পাঠাও")}</button></div><div class="svgwrap fit" id="c7osv"></div><div class="w-out" id="c7oo"></div>`;
  const V = 1493, sea = 40, H = 170; // screen: surface at y = 40, 1600 m → 170 px
  const depth = x => 900 + 450 * Math.sin(x / 55) + 180 * Math.sin(x / 17 + 1); // metres, x in px
  const fish = [90, 150, 400]; // shoal: x from 90 to 150 px at 400 m
  const Y = dm => sea + dm / 1600 * H;
  let ph = -1, got = null;
  const draw = () => {
    const pc = sv(el, "c7ox", "%"), sx = 20 + pc / 100 * 320;
    const hitFish = sx >= fish[0] && sx <= fish[1], dTrue = hitFish ? fish[2] : depth(sx), t = 2 * dTrue / V;
    let bed = `M0 ${Y(depth(0)).toFixed(1)}`; for (let x = 4; x <= 360; x += 4) bed += ` L${x} ${Y(depth(x)).toFixed(1)}`;
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="SONAR">
      <rect x="0" y="${sea}" width="360" height="${H + 20}" fill="var(--c-soft)"/><path d="${bed} L360 230 L0 230 Z" fill="var(--muted)" opacity=".55"/>
      <line x1="0" y1="${sea}" x2="360" y2="${sea}" stroke="var(--c)" stroke-width="2"/>`;
    for (let i = 0; i < 9; i++) { const fx = fish[0] + 6 + (i % 5) * 12, fy = Y(fish[2]) + (i > 4 ? 9 : 0) + (i % 2) * 3; g += `<path d="M${fx} ${fy} l7 -3 v6 z M${fx + 7} ${fy} q4 -4 8 0 q-4 4 -8 0" fill="var(--note)"/>`; }
    g += `<path d="M${sx - 22} ${sea - 12} h44 l-7 12 h-30 z" fill="var(--ink)"/><rect x="${sx - 4}" y="${sea - 22}" width="10" height="10" fill="var(--ink)"/>`;
    if (ph >= 0) { const go = ph <= 1, yy = sea + (Y(dTrue) - sea) * (go ? ph : 2 - ph), col = go ? "var(--c)" : "var(--bad)";
      for (let i = 0; i < 3; i++) g += `<path d="M${sx - 14 + i * 2} ${yy + (go ? -i * 6 : i * 6)} q${14 - i * 2} ${go ? 8 : -8} ${28 - i * 4} 0" fill="none" stroke="${col}" stroke-width="2.5" opacity="${1 - i * 0.3}"/>`; }
    if (got) g += `<line x1="${sx}" y1="${sea}" x2="${sx}" y2="${Y(dTrue)}" stroke="var(--bad)" stroke-dasharray="4 3"/><text x="${sx + (sx > 250 ? -6 : 6)}" y="${(sea + Y(dTrue)) / 2}" font-size="13" text-anchor="${sx > 250 ? "end" : "start"}" fill="var(--ink)">${f7(dTrue, 0)} m</text>`;
    g += `<text x="6" y="${sea - 26}" font-size="12" fill="var(--muted)">${L2("sea surface", "সমুদ্রপৃষ্ঠ")}</text></svg>`;
    $("#c7osv", el).innerHTML = g;
    $("#c7oo", el).innerHTML = got ? L2(`Echo time t = <b>${f7(t, 3)} s</b>. Depth d = vt/2 = 1493 × ${f7(t, 3)} ÷ 2 = <b>${f7(dTrue, 0)} m</b>${hitFish ? " — that's the shoal of fish, not the sea bed!" : "."}`,
      `প্রতিধ্বনির সময় t = <b>${f7(t, 3)} s</b>। গভীরতা d = vt/২ = ১৪৯৩ × ${f7(t, 3)} ÷ ২ = <b>${f7(dTrue, 0)} m</b>${hitFish ? " — এটা মাছের ঝাঁক, সমুদ্রতল নয়!" : "।"}`)
      : L2("Press “Send pulse” to time the echo. (Speed of sound in water: 1493 m/s)", "প্রতিধ্বনির সময় মাপতে “স্পন্দ পাঠাও” চাপো। (পানিতে শব্দের বেগ: ১৪৯৩ m/s)");
  };
  $("#c7ox", el).addEventListener("input", () => { got = null; ph = -1; draw(); });
  $("#c7op", el).addEventListener("click", () => { got = null; if (REDUCED) { got = true; ph = -1; draw(); } else ph = 0; draw(); });
  draw();
  animate(el, dt => { if (ph < 0) return; ph += dt * 1.1; if (ph >= 2) { ph = -1; got = true; } draw(); });
};

/* 7.3.4 musical sound vs noise: wave shapes, pitch (frequency) and loudness (amplitude) */
W.c7music = (el) => {
  let kind = "f";
  const K = [["f", L2("Tuning fork", "সুরশলাকা")], ["m", L2("Musical note", "সুরযুক্ত শব্দ")], ["n", L2("Noise", "কোলাহল")]];
  el.innerHTML = `<div class="chipset c7mk" role="group">${K.map(([a, b]) => `<button data-k="${a}" aria-pressed="${a === kind}">${b}</button>`).join("")}</div>
  ${slider("c7mf", L2("Frequency f", "কম্পাঙ্ক f"), 100, 1000, 10, 300, "Hz")}${slider("c7ma", L2("Amplitude", "বিস্তার"), 0.2, 1, 0.05, 0.7, "")}
  <div class="w-row"><button class="btn" id="c7mp">${L2("▶ Listen", "▶ শোনো")}</button></div><div class="svgwrap fit" id="c7msv"></div><div class="w-out" id="c7mo"></div>`;
  // fixed pseudo-random noise so the picture doesn't flicker
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const NZ = []; for (let i = 0; i <= 200; i++) NZ.push(rnd() * 2 - 1);
  const HM = [[1, 1], [2, 0.5], [3, 0.35], [4, 0.2]];
  const draw = () => {
    const f = sv(el, "c7mf", "Hz"), A = sv(el, "c7ma", "", 2), gx = 20, gw = 330, y0 = 90, sc = 60, win = 0.01; // 10 ms window
    const val = tt => kind === "f" ? Math.sin(T2 * f * tt) : HM.reduce((s, [n, a]) => s + a * Math.sin(T2 * n * f * tt + n * 0.7), 0) / 1.6;
    let pl = "";
    if (kind === "n") NZ.forEach((v, i) => { const s2 = v * 0.7 + (NZ[i + 1] || 0) * 0.3; pl += `${(gx + i / 200 * gw).toFixed(1)},${(y0 - A * sc * s2 * 0.9).toFixed(1)} `; });
    else for (let i = 0; i <= 400; i++) { const tt = i / 400 * win; pl += `${(gx + i / 400 * gw).toFixed(1)},${(y0 - A * sc * val(tt)).toFixed(1)} `; }
    let g = `<svg viewBox="0 0 360 185" role="img" aria-label="${L2("wave shape", "তরঙ্গের আকার")}">
      <line x1="${gx}" y1="${y0}" x2="${gx + gw}" y2="${y0}" stroke="var(--rule)"/><polyline points="${pl}" fill="none" stroke="${kind === "n" ? "var(--bad)" : "var(--c)"}" stroke-width="2"/>
      <text x="${gx + gw}" y="${y0 + 82}" font-size="12" text-anchor="end" fill="var(--muted)">${L2("time: 10 ms shown", "সময়: ১০ ms দেখানো হয়েছে")}</text>`;
    if (kind !== "n") { const T = 1 / f, x1 = gx, x2 = gx + T / win * gw; if (x2 < gx + gw) g += `<line x1="${x1}" y1="${y0 + 66}" x2="${x2}" y2="${y0 + 66}" stroke="var(--note)" stroke-width="1.5"/><line x1="${x2}" y1="${y0 + 60}" x2="${x2}" y2="${y0 + 72}" stroke="var(--note)"/><text x="${x2 + 4}" y="${y0 + 70}" font-size="12" fill="var(--note)">T = ${f7(T * 1000, 2)} ms</text>`; }
    g += `</svg>`;
    $("#c7msv", el).innerHTML = g;
    const pitch = f < 250 ? L2("low (deep)", "খাদের (মোটা)") : f < 600 ? L2("medium", "মাঝারি") : L2("high (shrill)", "চড়া (তীক্ষ্ণ)");
    const loud = A < 0.45 ? L2("soft", "মৃদু") : A < 0.8 ? L2("moderate", "মাঝারি") : L2("loud", "জোরালো");
    $("#c7mo", el).innerHTML = kind === "n" ? L2(`Irregular: no pattern repeats, so there is no definite frequency or pitch. This is <b>noise</b>. (Loudness: ${loud})`, `অনিয়মিত: কোনো নকশা পুনরাবৃত্ত হয় না, তাই নির্দিষ্ট কম্পাঙ্ক বা তীক্ষ্ণতা নেই। এটি <b>কোলাহল</b>। (প্রাবল্য: ${loud})`)
      : L2(`${kind === "f" ? "A single pure frequency: a smooth, perfectly repeating wave." : "The main frequency plus waves at 2f, 3f, 4f superposed: still periodic, but richer. This mix gives the instrument its quality."}<br>Pitch: <b>${pitch}</b> (set by f = ${f7(f)} Hz) · Loudness: <b>${loud}</b> (set by the amplitude)`,
        `${kind === "f" ? "একটিমাত্র বিশুদ্ধ কম্পাঙ্ক: মসৃণ, নিখুঁতভাবে পুনরাবৃত্ত তরঙ্গ।" : "মূল কম্পাঙ্কের সাথে ২f, ৩f, ৪f কম্পাঙ্কের তরঙ্গ উপরিপাতিত: এখনো পর্যাবৃত্ত, কিন্তু আরও ভরাট। এই মিশ্রণই যন্ত্রটির গুণ দেয়।"}<br>তীক্ষ্ণতা: <b>${pitch}</b> (f = ${f7(f)} Hz ঠিক করে) · প্রাবল্য: <b>${loud}</b> (বিস্তার ঠিক করে)`);
  };
  let ctx = null;
  $("#c7mp", el).addEventListener("click", () => {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const f = +$("#c7mf", el).value, A = +$("#c7ma", el).value * 0.15, now = ctx.currentTime, gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(A, now + 0.03); gain.gain.setValueAtTime(A, now + 0.7); gain.gain.linearRampToValueAtTime(0, now + 0.8); gain.connect(ctx.destination);
      if (kind === "n") { const buf = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(); s.buffer = buf; s.connect(gain); s.start(now); }
      else (kind === "f" ? [[1, 1]] : HM).forEach(([n, a]) => { const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = f * n; og.gain.value = a / (kind === "f" ? 1 : 2.05); o.connect(og); og.connect(gain); o.start(now); o.stop(now + 0.82); });
    } catch (e) { /* audio not available */ }
  });
  chips7(el, ".c7mk", b => { kind = b.dataset.k; draw(); });
  onIn7(el, draw); draw();
};

/* 7.3.5 decibel scale with everyday sources */
W.c7db = (el) => {
  const S = [[L2("Jet engine", "জেট ইঞ্জিন"), 110, 140], [L2("Heavy traffic", "যানজট"), 80, 90], [L2("Car", "গাড়ি"), 60, 80], [L2("Television", "টেলিভিশন"), 50, 60], [L2("Conversation", "কথাবার্তা"), 40, 60], [L2("Breathing", "নিঃশ্বাস"), 10, 10], [L2("Faintest sound", "সবচেয়ে ক্ষীণ শব্দ"), 0, 0]];
  el.innerHTML = slider("c7dl", L2("Sound level", "শব্দের মাত্রা"), 0, 140, 1, 85, "dB") + `<div class="svgwrap fit" id="c7dsv"></div><div class="w-out" id="c7do"></div>`;
  const draw = () => {
    const L = sv(el, "c7dl", "dB"), X = d => 118 + d / 140 * 228;
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("decibel scale", "ডেসিবেল স্কেল")}">
      <rect x="${X(0)}" y="10" width="${X(70) - X(0)}" height="190" fill="var(--good)" opacity=".12"/>
      <rect x="${X(70)}" y="10" width="${X(85) - X(70)}" height="190" fill="var(--note)" opacity=".15"/>
      <rect x="${X(85)}" y="10" width="${X(140) - X(85)}" height="190" fill="var(--bad)" opacity=".13"/>`;
    S.forEach(([n, a, b], i) => { const y = 28 + i * 26, on = L >= a - 0.5 && L <= b + 0.5;
      g += `<text x="112" y="${y + 5}" font-size="13" text-anchor="end" fill="${on ? "var(--ink)" : "var(--muted)"}" font-weight="${on ? 700 : 400}">${n}</text>
        <rect x="${X(a) - (a === b ? 3 : 0)}" y="${y - 6}" width="${Math.max(6, X(b) - X(a))}" height="12" rx="6" fill="${on ? "var(--c)" : "var(--muted)"}" opacity="${on ? 1 : 0.55}"/>`; });
    [0, 20, 40, 60, 80, 100, 120, 140].forEach(d => g += `<line x1="${X(d)}" y1="200" x2="${X(d)}" y2="206" stroke="var(--muted)"/><text x="${X(d)}" y="220" font-size="12" text-anchor="middle" fill="var(--muted)">${B7(d)}</text>`);
    g += `<line x1="${X(L)}" y1="10" x2="${X(L)}" y2="200" stroke="var(--bad)" stroke-width="2.5"/><text x="${X(140)}" y="240" font-size="12" text-anchor="end" fill="var(--muted)">dB</text>
      <text x="${X(0) + 2}" y="240" font-size="12" fill="var(--good)">${L2("safe", "নিরাপদ")}</text><text x="${X(88)}" y="240" font-size="12" fill="var(--bad)">${L2("harmful", "ক্ষতিকর")}</text></svg>`;
    $("#c7dsv", el).innerHTML = g;
    const r = Math.pow(10, (L - 50) / 10);
    const eff = L < 70 ? L2("Comfortable for the ear.", "কানের জন্য আরামদায়ক।") : L < 85 ? L2("Tiring and disturbing if it goes on for long.", "অনেকক্ষণ চললে ক্লান্তিকর ও বিরক্তিকর।")
      : L < 120 ? L2("<b>Harmful</b>: hours of exposure can permanently damage hearing.", "<b>ক্ষতিকর</b>: ঘণ্টার পর ঘণ্টা থাকলে শ্রবণশক্তি স্থায়ীভাবে নষ্ট হতে পারে।") : L2("<b>Painful</b>: can damage hearing almost at once.", "<b>যন্ত্রণাদায়ক</b>: প্রায় সাথে সাথে শ্রবণশক্তির ক্ষতি করতে পারে।");
    $("#c7do", el).innerHTML = L2(`${f7(L)} dB is ${r >= 1 ? f7(r, r < 10 ? 1 : 0) + " times as intense as" : "1/" + f7(1 / r, 1 / r < 10 ? 1 : 0) + " the intensity of"} a 50 dB conversation (each +10 dB = 10 × intensity). ${eff}`,
      `${f7(L)} dB হলো ৫০ dB কথাবার্তার ${r >= 1 ? f7(r, r < 10 ? 1 : 0) + " গুণ" : f7(1 / r, 1 / r < 10 ? 1 : 0) + " ভাগের এক ভাগ"} তীব্র (প্রতি +১০ dB = ১০ × তীব্রতা)। ${eff}`);
  };
  onIn7(el, draw); draw();
};
