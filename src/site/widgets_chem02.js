/* ---- chemistry chapter 2 widgets: states of matter ---- */
const B2 = x => bnNum(x, LANG);
const f2 = (x, d = 0) => {
  if (!isFinite(x)) return "—";
  let s = (+x.toFixed(d)).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return B2(s.replace("-", "−"));
};
const chipsK2 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const chipHtmlK2 = (cls, arr, on) => `<div class="chipset ${cls}" role="group">${arr.map(([k, n]) => `<button data-k="${k}" aria-pressed="${k === on}">${n}</button>`).join("")}</div>`;
const rndK2 = (a, b) => a + Math.random() * (b - a);
const gaussK2 = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); };
/* push overlapping discs apart (soft liquid model) */
const sepK2 = (P, R) => { for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) { const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy); if (d > 0 && d < 2 * R) { const o = (2 * R - d) / 2, ux = dx / d, uy = dy / d; a.x -= ux * o; a.y -= uy * o; b.x += ux * o; b.y += uy * o; } } };
/* start an animation, or give a step button when motion is reduced */
const runK2 = (el, btnId, stepFn, drawFn) => {
  if (REDUCED) { for (let i = 0; i < 40; i++) stepFn(0.03); drawFn(); const b = $("#" + btnId, el); if (b) b.addEventListener("click", () => { for (let i = 0; i < 12; i++) stepFn(0.03); drawFn(); }); }
  else { drawFn(); animate(el, dt => { stepFn(dt); drawFn(); }); }
};
const stepBtnK2 = id => REDUCED ? `<div class="w-row"><button class="btn" id="${id}">${L2("Step forward", "এক ধাপ এগোও")}</button></div>` : "";

/* 2.1 solid, liquid, gas in different containers, with a piston */
W.k2states = (el) => {
  let st = "s", ct = "t", parts = [], t = 0;
  el.innerHTML = chipHtmlK2("k2ss", [["s", L2("Solid", "কঠিন")], ["l", L2("Liquid", "তরল")], ["g", L2("Gas", "গ্যাস")]], st) +
    chipHtmlK2("k2sc", [["t", L2("Tall jar", "লম্বা পাত্র")], ["w", L2("Wide tray", "চওড়া পাত্র")]], ct) +
    slider("k2sp", L2("Push the piston down", "পিস্টন নিচে চাপো"), 0, 100, 1, 0, "%") +
    `<div class="svgwrap fit" id="k2ssv"></div><div class="w-out" id="k2so"></div>` + stepBtnK2("k2sst");
  const BOT = 205, CX = 180, R = 5.5, S = 13, NC = 7, NR = 5, BH = NR * S, BW = NC * S, LA = 7280;
  const dims = () => ct === "t" ? { w: 130, h: 160 } : { w: 270, h: 100 };
  const geom = () => {
    const d = dims(), x0 = CX - d.w / 2, x1 = CX + d.w / 2, top0 = BOT - d.h, p = +$("#k2sp", el).value / 100;
    const want = top0 + p * 0.7 * d.h, lh = LA / d.w;
    const lim = st === "s" ? BOT - BH - 3 : st === "l" ? BOT - lh - 3 : top0 + 0.7 * d.h;
    return { d, x0, x1, top0, lh, top: Math.min(want, lim), stopped: want > lim + 0.5, p };
  };
  const setup = () => {
    const g = geom(); parts = [];
    if (st === "s") for (let i = 0; i < NC; i++) for (let j = 0; j < NR; j++) parts.push({ x0: CX - BW / 2 + S / 2 + i * S, y0: BOT - BH + S / 2 + j * S, ph: rndK2(0, 6.28), x: 0, y: 0 });
    if (st === "l") { const cols = Math.floor((g.d.w - 2 * R) / (2 * R + 1)); for (let i = 0; i < 35; i++) parts.push({ x: g.x0 + R + 1 + (i % cols) * (2 * R + 1), y: BOT - R - 1 - Math.floor(i / cols) * (2 * R + 1), vx: rndK2(-1, 1), vy: rndK2(-1, 1) }); }
    if (st === "g") for (let i = 0; i < 18; i++) { const a = rndK2(0, 6.28); parts.push({ x: rndK2(g.x0 + 8, g.x1 - 8), y: rndK2(g.top + 8, BOT - 8), vx: Math.cos(a), vy: Math.sin(a) }); }
  };
  const step = dt => {
    t += dt; const g = geom();
    if (st === "s") parts.forEach(p => { p.x = p.x0 + 1.1 * Math.sin(t * 19 + p.ph); p.y = p.y0 + 1.1 * Math.cos(t * 16 + p.ph * 1.4); });
    else {
      const sp = st === "l" ? 22 : 120, ytop = st === "l" ? BOT - g.lh : g.top;
      parts.forEach(p => {
        if (st === "l") { p.vx += rndK2(-1, 1) * 0.7; p.vy += rndK2(-1, 1) * 0.7 + 0.1; const n = Math.hypot(p.vx, p.vy) || 1; p.vx /= n; p.vy /= n; }
        p.x += p.vx * sp * dt; p.y += p.vy * sp * dt;
        if (p.x < g.x0 + R) { p.x = g.x0 + R; p.vx = Math.abs(p.vx); } if (p.x > g.x1 - R) { p.x = g.x1 - R; p.vx = -Math.abs(p.vx); }
        if (p.y < ytop + R) { p.y = ytop + R; p.vy = Math.abs(p.vy); } if (p.y > BOT - R) { p.y = BOT - R; p.vy = -Math.abs(p.vy); }
      });
      if (st === "l") sepK2(parts, R);
    }
  };
  const draw = () => {
    const g = geom(), pv = Math.round(g.p * 100);
    $("#k2sp-v", el).textContent = B2(pv) + "%";
    let s = `<svg viewBox="0 0 360 225" role="img" aria-label="${L2("states in a container", "পাত্রে পদার্থের অবস্থা")}">`;
    if (st === "l") s += `<rect x="${g.x0}" y="${BOT - g.lh}" width="${g.d.w}" height="${g.lh}" fill="var(--c-soft)"/>`;
    parts.forEach(p => s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R}" fill="var(--c)" stroke="var(--ink)" stroke-width=".5"/>`);
    s += `<path d="M${g.x0 - 2} ${g.top0 - 12} V${BOT + 2} H${g.x1 + 2} V${g.top0 - 12}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="${g.x0 + 1}" y="${g.top - 9}" width="${g.d.w - 2}" height="9" rx="2" fill="var(--muted)"/><line x1="${CX}" y1="${g.top - 9}" x2="${CX}" y2="4" stroke="var(--muted)" stroke-width="5"/>`;
    if (st === "g") s += `<text x="8" y="20" font-size="14" fill="var(--ink)">V = ${B2(Math.round((BOT - g.top) / g.d.h * 100))}%</text>`;
    if (g.stopped) s += `<text x="${CX}" y="${g.top - 16}" font-size="13" text-anchor="middle" fill="var(--bad)">${L2("stuck!", "আটকে গেছে!")}</text>`;
    s += `</svg>`;
    $("#k2ssv", el).innerHTML = s;
    const T = {
      s: [L2("Shape: keeps its own shape in any container.", "আকার: যেকোনো পাত্রে নিজের আকার ধরে রাখে।"), L2("Volume: fixed.", "আয়তন: নির্দিষ্ট।"),
        g.stopped ? L2("Squeeze: the piston stops at the block. The particles are already touching, so a solid cannot be compressed.", "চাপ: পিস্টন ব্লকে এসে থেমে যায়। কণাগুলো আগে থেকেই ঘেঁষাঘেঁষি, তাই কঠিনকে সংকুচিত করা যায় না।") : L2("Squeeze: push the piston down to test it.", "চাপ: পরীক্ষা করতে পিস্টন নিচে চাপো।")],
      l: [L2("Shape: takes the shape of the bottom of the container.", "আকার: পাত্রের তলার আকার নেয়।"), L2(`Volume: fixed. The same liquid is ${ct === "t" ? "deep in the tall jar" : "shallow in the wide tray"}, but the amount does not change.`, `আয়তন: নির্দিষ্ট। একই তরল ${ct === "t" ? "লম্বা পাত্রে গভীর" : "চওড়া পাত্রে অগভীর"}, কিন্তু পরিমাণ বদলায় না।`),
        g.stopped ? L2("Squeeze: the piston stops at the surface. A liquid is almost incompressible.", "চাপ: পিস্টন তরলের তলে এসে থেমে যায়। তরল প্রায় অসংকোচনীয়।") : L2("Squeeze: push the piston down to test it.", "চাপ: পরীক্ষা করতে পিস্টন নিচে চাপো।")],
      g: [L2("Shape and volume: the gas spreads out to fill the whole space below the piston.", "আকার ও আয়তন: গ্যাস ছড়িয়ে পিস্টনের নিচের পুরো জায়গা ভরে ফেলে।"), L2(`Volume now: ${f2((BOT - g.top) / g.d.h * 100)}% of the container.`, `এখন আয়তন: পাত্রের ${f2((BOT - g.top) / g.d.h * 100)}%।`),
        pv > 0 ? L2("Squeeze: the gas is compressed easily; its particles just move closer together.", "চাপ: গ্যাস সহজেই সংকুচিত হয়; কণাগুলো শুধু কাছাকাছি চলে আসে।") : L2("Squeeze: push the piston down to test it.", "চাপ: পরীক্ষা করতে পিস্টন নিচে চাপো।")]
    }[st];
    $("#k2so", el).innerHTML = T.join("<br>");
  };
  chipsK2(el, ".k2ss", b => { st = b.dataset.k; setup(); step(0.01); draw(); });
  chipsK2(el, ".k2sc", b => { ct = b.dataset.k; setup(); step(0.01); draw(); });
  $("#k2sp", el).addEventListener("input", () => { step(0.001); draw(); });
  setup(); step(0.01);
  runK2(el, "k2sst", step, draw);
};

/* 2.2 kinetic theory: water particles from −40 °C to 140 °C */
W.k2kinetic = (el) => {
  el.innerHTML = slider("k2kT", L2("Temperature", "তাপমাত্রা"), -40, 140, 1, -20, "°C") + `<div class="svgwrap fit" id="k2ksv"></div><p class="hint" id="k2ktx"></p>` + stepBtnK2("k2kst");
  const BX = 10, BY = 8, BW = 340, BH = 150, R = 7, PAD = R + 2; let st = null, parts = [], t = 0;
  const stOf = T => T < 0 ? "s" : T < 100 ? "l" : "g";
  const setup = () => {
    parts = [];
    if (st === "s") for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) parts.push({ x0: 180 - 64 + i * 16, y0: BY + BH - 8 - 48 + j * 16, ph: rndK2(0, 6.28), x: 0, y: 0 });
    if (st === "l") for (let i = 0; i < 36; i++) parts.push({ x: 110 + (i % 9) * 16 + rndK2(-2, 2), y: BY + BH - 8 - Math.floor(i / 9) * 16, vx: rndK2(-1, 1), vy: rndK2(-1, 1) });
    if (st === "g") for (let i = 0; i < 18; i++) { const a = rndK2(0, 6.28); parts.push({ x: rndK2(BX + 20, BX + BW - 20), y: rndK2(BY + 20, BY + BH - 20), vx: Math.cos(a), vy: Math.sin(a) }); }
  };
  const step = dt => {
    const T = +$("#k2kT", el).value, Tk = T + 273, s = stOf(T); t += dt;
    if (s !== st) { st = s; setup(); }
    if (st === "s") { const a = 0.4 + (T + 40) / 40 * 2.2; parts.forEach(p => { p.x = p.x0 + a * Math.sin(t * 21 + p.ph); p.y = p.y0 + a * Math.cos(t * 17 + p.ph * 1.3); }); return; }
    const sp = st === "l" ? 26 * Math.sqrt(Tk / 273) : 150 * Math.sqrt(Tk / 373);
    parts.forEach(p => {
      if (st === "l") { p.vx += rndK2(-1, 1) * 0.6; p.vy += rndK2(-1, 1) * 0.6 + 0.09; const n = Math.hypot(p.vx, p.vy) || 1; p.vx /= n; p.vy /= n; }
      p.x += p.vx * sp * dt; p.y += p.vy * sp * dt;
      if (p.x < BX + PAD) { p.x = BX + PAD; p.vx = Math.abs(p.vx); } if (p.x > BX + BW - PAD) { p.x = BX + BW - PAD; p.vx = -Math.abs(p.vx); }
      if (p.y < BY + PAD) { p.y = BY + PAD; p.vy = Math.abs(p.vy); } if (p.y > BY + BH - PAD) { p.y = BY + BH - PAD; p.vy = -Math.abs(p.vy); }
    });
    if (st === "l") sepK2(parts, R);
  };
  const draw = () => {
    const T = +$("#k2kT", el).value, Tk = T + 273;
    $("#k2kT-v", el).textContent = f2(T) + " °C";
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("particles of water", "পানির কণা")}"><rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="4" fill="none" stroke="var(--muted)" stroke-width="2"/>`;
    parts.forEach(p => s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R}" fill="var(--c)" stroke="var(--ink)" stroke-width=".6"/>`);
    const name = { s: L2("ICE (solid)", "বরফ (কঠিন)"), l: L2("WATER (liquid)", "পানি (তরল)"), g: L2("STEAM (gas)", "জলীয় বাষ্প (গ্যাস)") }[st];
    s += `<text x="${BX + 8}" y="${BY + 18}" font-size="14" font-weight="700" fill="var(--ink)">${name}</text>`;
    // kinetic energy bar with melting and boiling marks (∝ absolute temperature)
    const x0 = 20, bw = 320, y = 186, X = k => x0 + k / 413 * bw;
    s += `<text x="${x0}" y="${y - 10}" font-size="13" fill="var(--ink)">${L2("Kinetic energy of the particles", "কণাগুলোর গতিশক্তি")}</text>
      <rect x="${x0}" y="${y}" width="${bw}" height="14" rx="7" fill="none" stroke="var(--rule)"/><rect x="${x0}" y="${y}" width="${X(Tk) - x0}" height="14" rx="7" fill="var(--bad)" opacity=".8"/>`;
    [[273, L2("melts (0 °C)", "গলে (০ °C)"), 18], [373, L2("boils (100 °C)", "ফোটে (১০০ °C)"), 36]].forEach(([k, n, dy]) => s += `<line x1="${X(k)}" y1="${y - 4}" x2="${X(k)}" y2="${y + dy + 2}" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 2"/><text x="${X(k) - 4}" y="${y + dy + 12}" font-size="13" text-anchor="end" fill="var(--muted)">${n}</text>`);
    s += `</svg>`;
    $("#k2ksv", el).innerHTML = s;
    let tx = { s: L2("Attraction wins: particles stay in fixed places and only vibrate. Warmer ice → stronger vibration.", "আকর্ষণ জেতে: কণাগুলো নির্দিষ্ট জায়গায় থেকে শুধু কাঁপে। বরফ যত গরম → কম্পন তত জোরালো।"),
      l: L2("Particles have partly broken free: they slide past one another but stay close together (fixed volume, no fixed shape).", "কণাগুলো আংশিক মুক্ত: একে অপরের পাশ দিয়ে সরে যায়, তবে কাছাকাছি থাকে (নির্দিষ্ট আয়তন, নির্দিষ্ট আকার নেই)।"),
      g: L2("Kinetic energy wins: particles are almost free of attraction and fly about in the whole box. Hotter steam → faster particles.", "গতিশক্তি জেতে: কণাগুলো আকর্ষণ থেকে প্রায় মুক্ত হয়ে পুরো বাক্সে ছোটে। বাষ্প যত গরম → কণা তত দ্রুত।") }[st];
    if (T === 0) tx += L2(" At exactly 0 °C ice and water can exist together while the ice melts.", " ঠিক ০ °C-এ বরফ গলার সময় বরফ ও পানি একসাথে থাকতে পারে।");
    if (T === 100) tx += L2(" At exactly 100 °C water and steam exist together while the water boils.", " ঠিক ১০০ °C-এ পানি ফোটার সময় পানি ও বাষ্প একসাথে থাকে।");
    $("#k2ktx", el).textContent = tx;
  };
  $("#k2kT", el).addEventListener("input", () => { step(0.001); draw(); });
  step(0.01);
  runK2(el, "k2kst", step, draw);
};

/* 2.3 diffusion: KMnO4 in cold and hot water; NH3 + HCl tube */
W.k2diff = (el) => {
  let mode = "ink";
  el.innerHTML = chipHtmlK2("k2dm", [["ink", L2("KMnO₄ in water", "পানিতে KMnO₄")], ["tube", L2("NH₃ + HCl tube", "NH₃ + HCl নল")]], mode) + `<div id="k2dbox"></div>`;
  const box = $("#k2dbox", el);
  let ink = null, tube = null;
  /* --- ink mode --- */
  const inkSetup = () => {
    const mk = cx => Array.from({ length: 150 }, () => ({ x: cx + rndK2(-5, 5), y: 172 + rndK2(-4, 3) }));
    ink = { t: 0, A: mk(90), B: mk(270) };
    box.innerHTML = `<div class="w-row"><button class="btn solid" id="k2dgo">${L2("Drop the crystals again", "আবার দানা ফেলো")}</button></div><div class="svgwrap fit" id="k2dsv"></div><div class="w-out" id="k2do"></div>` + stepBtnK2("k2dst");
    $("#k2dgo", el).addEventListener("click", () => { const k = inkSetup; k(); inkDraw(); });
  };
  const even = P => { const c = new Array(20).fill(0); P.forEach(p => { const i = Math.min(4, Math.max(0, Math.floor((p.x % 180 - 15) / 30))), j = Math.min(3, Math.max(0, Math.floor((p.y - 42) / 35))); c[j * 5 + i]++; }); return c.filter(n => n >= 3).length / 20 * 100; };
  const inkStep = dt => {
    if (!ink) return; ink.t += dt;
    [[ink.A, 9], [ink.B, 20]].forEach(([P, sg]) => P.forEach(p => {
      p.x += gaussK2() * sg * Math.sqrt(dt); p.y += gaussK2() * sg * Math.sqrt(dt);
      const x0 = p.x < 180 ? 15 : 195;
      if (p.x < x0 + 2) p.x = 2 * (x0 + 2) - p.x; if (p.x > x0 + 148) p.x = 2 * (x0 + 148) - p.x;
      if (p.y < 44) p.y = 88 - p.y; if (p.y > 178) p.y = 356 - p.y;
    }));
  };
  const inkDraw = () => {
    if (!ink || !$("#k2dsv", el)) return;
    let s = `<svg viewBox="0 0 360 215" role="img" aria-label="${L2("diffusion of potassium permanganate", "পটাশিয়াম পারম্যাঙ্গানেটের ব্যাপন")}">`;
    [[15, L2("Cold water, 20 °C", "ঠান্ডা পানি, ২০ °C"), ink.A], [195, L2("Hot water, 70 °C", "গরম পানি, ৭০ °C"), ink.B]].forEach(([x, n, P]) => {
      s += `<rect x="${x}" y="42" width="150" height="138" fill="var(--c-soft)" opacity=".45"/>`;
      P.forEach(p => s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.3" fill="var(--c)" opacity=".75"/>`);
      s += `<path d="M${x} 26 V180 H${x + 150} V26" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="${x}" y1="42" x2="${x + 150}" y2="42" stroke="var(--c)" stroke-width="1.2"/>
        <text x="${x + 75}" y="200" font-size="13" text-anchor="middle" fill="var(--ink)">${n}</text><text x="${x + 75}" y="16" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("spread", "ছড়িয়েছে")}: ${f2(even(P))}%</text>`;
    });
    s += `</svg>`;
    $("#k2dsv", el).innerHTML = s;
    $("#k2do", el).innerHTML = L2(`Model time: ${f2(ink.t, 0)} s (sped up). The particles move at random in both beakers, but in hot water they have more kinetic energy, so the pink colour spreads out much faster.`,
      `মডেল সময়: ${f2(ink.t, 0)} s (দ্রুত করা)। দুই বিকারেই কণাগুলো এলোমেলো ছোটে, কিন্তু গরম পানিতে এদের গতিশক্তি বেশি, তাই গোলাপি রং অনেক দ্রুত ছড়ায়।`);
  };
  /* --- tube mode --- */
  const G = [["H₂", 2], ["He", 4], ["NH₃", 17], ["N₂", 28], ["O₂", 32], ["HCl", 36.5], ["CO₂", 44]];
  const tubeSetup = () => {
    tube = { p: 0, run: false };
    box.innerHTML = slider("k2dL", L2("Tube length", "নলের দৈর্ঘ্য"), 20, 100, 5, 40, "cm") +
      `<div class="w-row"><button class="btn solid" id="k2dgo">${L2("Insert the cotton plugs", "তুলা ঢোকাও")}</button><button class="btn" id="k2drs">${L2("Reset", "আবার")}</button></div><div class="svgwrap fit" id="k2dsv"></div><div class="w-out" id="k2do"></div>`;
    $("#k2dgo", el).addEventListener("click", () => { if (REDUCED) { tube.p = 1; } else { tube.p = 0; tube.run = true; } tubeDraw(); });
    $("#k2drs", el).addEventListener("click", () => { tube.p = 0; tube.run = false; tubeDraw(); });
    $("#k2dL", el).addEventListener("input", tubeDraw);
  };
  const tubeStep = dt => { if (tube && tube.run) { tube.p = Math.min(1, tube.p + dt / 3.5); if (tube.p >= 1) tube.run = false; } };
  const tubeDraw = () => {
    if (!tube || !$("#k2dsv", el)) return;
    const L = sv(el, "k2dL", "cm"), k = Math.sqrt(36.5 / 17), dN = L * k / (1 + k), dH = L - dN;
    const xa = 30, xb = 330, W_ = xb - xa, X = cm => xa + cm / L * W_, fN = tube.p * dN, fH = tube.p * dH;
    let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("ammonia and hydrogen chloride tube", "অ্যামোনিয়া ও হাইড্রোজেন ক্লোরাইড নল")}">
      <defs><linearGradient id="k2gN" x1="0" x2="1"><stop offset="0" style="stop-color:var(--c);stop-opacity:.55"/><stop offset="1" style="stop-color:var(--c);stop-opacity:0"/></linearGradient>
      <linearGradient id="k2gH" x1="1" x2="0"><stop offset="0" style="stop-color:var(--note);stop-opacity:.6"/><stop offset="1" style="stop-color:var(--note);stop-opacity:0"/></linearGradient></defs>`;
    if (fN > 0) s += `<rect x="${xa}" y="52" width="${X(fN) - xa}" height="26" fill="url(#k2gN)"/>`;
    if (fH > 0) s += `<rect x="${X(L - fH)}" y="52" width="${xb - X(L - fH)}" height="26" fill="url(#k2gH)"/>`;
    s += `<rect x="${xa - 16}" y="50" width="${W_ + 32}" height="30" rx="8" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <rect x="${xa - 14}" y="52" width="16" height="26" rx="3" fill="var(--sheet)" stroke="var(--c)" stroke-width="2"/><rect x="${xb - 2}" y="52" width="16" height="26" rx="3" fill="var(--sheet)" stroke="var(--note)" stroke-width="2"/>
      <text x="${xa - 14}" y="40" font-size="13" fill="var(--c)">NH₃ (NH₄OH)</text><text x="${xb + 14}" y="40" font-size="13" text-anchor="end" fill="var(--ink)">HCl</text>`;
    if (tube.p >= 1) {
      const xm = X(dN);
      s += `<ellipse cx="${xm}" cy="65" rx="7" ry="15" fill="var(--ink)" opacity=".4"/><ellipse cx="${xm}" cy="65" rx="3" ry="13" fill="var(--ink)" opacity=".35"/>
        <text x="${xm}" y="${24}" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">NH₄Cl</text>
        <line x1="${xa}" y1="92" x2="${xm}" y2="92" stroke="var(--c)" stroke-width="1.5"/><line x1="${xm}" y1="98" x2="${xb}" y2="98" stroke="var(--note)" stroke-width="1.5"/>
        <text x="${(xa + xm) / 2}" y="112" font-size="13" text-anchor="middle" fill="var(--c)">${f2(dN, 1)} cm</text><text x="${(xm + xb) / 2}" y="112" font-size="13" text-anchor="middle" fill="var(--ink)">${f2(dH, 1)} cm</text>`;
    } else s += `<line x1="180" y1="86" x2="180" y2="96" stroke="var(--muted)"/><text x="180" y="110" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("middle", "মাঝখান")}</text>`;
    // relative rates bar chart
    const y0 = 142, bx = 70, bwid = 230;
    s += `<text x="10" y="${y0 - 8}" font-size="13" fill="var(--ink)">${L2("Rate of diffusion compared with H₂ (∝ 1/√M)", "H₂-এর তুলনায় ব্যাপন হার (∝ 1/√M)")}</text>`;
    G.forEach(([n, M], i) => { const r = Math.sqrt(2 / M), y = y0 + i * 22, hi = n === "NH₃" || n === "HCl";
      s += `<text x="${bx - 6}" y="${y + 13}" font-size="13" text-anchor="end" fill="var(--ink)">${n} (${f2(M, M % 1 ? 1 : 0)})</text><rect x="${bx}" y="${y + 2}" width="${r * bwid}" height="14" rx="3" fill="${hi ? "var(--c)" : "var(--muted)"}" opacity="${hi ? .9 : .55}"/><text x="${bx + r * bwid + 5}" y="${y + 13}" font-size="12" fill="var(--muted)">${f2(r, 2)}</text>`; });
    s += `</svg>`;
    $("#k2dsv", el).innerHTML = s;
    $("#k2do", el).innerHTML = tube.p >= 1 ? L2(`The white ring forms where the gases meet: ${f2(dN, 1)} cm from the NH₃ end and ${f2(dH, 1)} cm from the HCl end, nearer the HCl end.<br>d(NH₃)/d(HCl) = √(36.5/17) ≈ ${f2(k, 2)}: ammonia (M = 17) diffuses faster than hydrogen chloride (M = 36.5).<br>NH₃(g) + HCl(g) → NH₄Cl(s)`,
      `দুই গ্যাস যেখানে মিলিত হয় সেখানে সাদা বলয় তৈরি হয়: NH₃ প্রান্ত থেকে ${f2(dN, 1)} cm এবং HCl প্রান্ত থেকে ${f2(dH, 1)} cm দূরে, অর্থাৎ HCl প্রান্তের কাছে।<br>d(NH₃)/d(HCl) = √(৩৬.৫/১৭) ≈ ${f2(k, 2)}: অ্যামোনিয়া (M = ১৭) হাইড্রোজেন ক্লোরাইডের (M = ৩৬.৫) চেয়ে দ্রুত ব্যাপিত হয়।<br>NH₃(g) + HCl(g) → NH₄Cl(s)`)
      : L2("Press the button to put both cotton plugs in at the same moment and watch the two gases diffuse towards each other.", "বোতাম চেপে একই মুহূর্তে দুই তুলা ঢোকাও, আর দেখো গ্যাস দুটি কীভাবে একে অপরের দিকে ব্যাপিত হয়।");
  };
  const show = () => { if (mode === "ink") { tube = null; inkSetup(); inkDraw(); } else { ink = null; tubeSetup(); tubeDraw(); } };
  chipsK2(el, ".k2dm", b => { mode = b.dataset.k; show(); });
  show();
  const step = dt => { inkStep(dt); tubeStep(dt); };
  const draw = () => { if (ink) inkDraw(); else if (tube && (tube.run || tube.p === 0 || tube.p >= 1)) tubeDraw(); };
  if (REDUCED) {
    for (let i = 0; i < 200; i++) inkStep(0.05); inkDraw();
    el.addEventListener("click", e => { if (e.target && e.target.id === "k2dst") { for (let i = 0; i < 40; i++) inkStep(0.05); inkDraw(); } });
  } else animate(el, dt => { const was = tube && tube.run; step(dt); if (ink || was) draw(); });
};

/* 2.4 effusion through a pinhole: two balloons race */
W.k2eff = (el) => {
  const G = [["H2", "H₂", 2], ["He", "He", 4], ["CH4", "CH₄", 16], ["N2", "N₂", 28], ["O2", "O₂", 32], ["CO2", "CO₂", 44]];
  let a = "He", b = "O2", run = false, t = 0, balls = [];
  el.innerHTML = `<p class="hint">${L2("Balloon A", "বেলুন A")}</p>` + chipHtmlK2("k2ea", G.map(g => [g[0], g[1]]), a) + `<p class="hint">${L2("Balloon B", "বেলুন B")}</p>` + chipHtmlK2("k2eb", G.map(g => [g[0], g[1]]), b) +
    `<div class="w-row"><button class="btn solid" id="k2ego">${L2("Start", "শুরু")}</button><button class="btn" id="k2ers">${L2("Reset", "আবার")}</button></div><div class="svgwrap fit" id="k2esv"></div><div class="w-out" id="k2eo"></div>`;
  const N = 60, RR = 68, HOLE = 0.3, CY = 100;
  const M = k => G.find(g => g[0] === k)[2], NM = k => G.find(g => g[0] === k)[1];
  const setup = () => {
    t = 0; run = false;
    balls = [[a, 90], [b, 270]].map(([k, cx]) => ({ k, cx, left: N, gone: [], P: Array.from({ length: N }, () => { const r = RR * Math.sqrt(Math.random()) * 0.9, th = rndK2(0, 6.28), d = rndK2(0, 6.28); return { x: cx + r * Math.cos(th), y: CY + r * Math.sin(th), vx: Math.cos(d), vy: Math.sin(d) }; }) }));
  };
  const step = dt => {
    if (!run) return; t += dt;
    balls.forEach(B => {
      const v = 620 / Math.sqrt(M(B.k));
      B.P = B.P.filter(p => {
        p.x += p.vx * v * dt; p.y += p.vy * v * dt;
        const dx = p.x - B.cx, dy = p.y - CY, r = Math.hypot(dx, dy);
        if (r > RR - 3) {
          const ang = Math.atan2(dy, dx);           // hole centred at the bottom (π/2)
          if (Math.abs(ang - Math.PI / 2) < HOLE / 2) { B.gone.push({ x: p.x, y: p.y, vx: dx / r, vy: dy / r, life: 1 }); B.left--; return false; }
          const nx = dx / r, ny = dy / r, dot = p.vx * nx + p.vy * ny; p.vx -= 2 * dot * nx; p.vy -= 2 * dot * ny; p.x = B.cx + nx * (RR - 3); p.y = CY + ny * (RR - 3);
        }
        return true;
      });
      B.gone.forEach(g => { g.x += g.vx * 40 * dt; g.y += g.vy * 40 * dt; g.life -= dt; }); B.gone = B.gone.filter(g => g.life > 0);
    });
    if (t > 90 || balls.some(B => B.left <= N * 0.15)) run = false;
  };
  const draw = () => {
    let s = `<svg viewBox="0 0 360 215" role="img" aria-label="${L2("effusion through a pinhole", "সুচছিদ্র দিয়ে নিঃসরণ")}">`;
    balls.forEach((B, i) => {
      const h1 = Math.PI / 2 + HOLE / 2, h0 = Math.PI / 2 - HOLE / 2, P1 = [B.cx + RR * Math.cos(h1), CY + RR * Math.sin(h1)], P0 = [B.cx + RR * Math.cos(h0), CY + RR * Math.sin(h0)];
      s += `<circle cx="${B.cx}" cy="${CY}" r="${RR}" fill="var(--c-soft)" opacity=".5"/><path d="M${P1[0].toFixed(1)} ${P1[1].toFixed(1)} A${RR} ${RR} 0 1 1 ${P0[0].toFixed(1)} ${P0[1].toFixed(1)}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>`;
      B.P.forEach(p => s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="${i ? "var(--note)" : "var(--c)"}"/>`);
      B.gone.forEach(g => s += `<circle cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" r="3" fill="${i ? "var(--note)" : "var(--c)"}" opacity="${Math.max(0, g.life).toFixed(2)}"/>`);
      s += `<text x="${B.cx}" y="${CY - RR - 8}" font-size="14" text-anchor="middle" fill="var(--ink)" font-weight="700">${i ? "B" : "A"}: ${NM(B.k)} (M = ${B2(M(B.k))})</text>
        <text x="${B.cx}" y="${CY + RR + 30}" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("escaped", "বেরিয়েছে")}: ${B2(N - B.left)} / ${B2(N)}</text>`;
    });
    s += `<text x="180" y="${CY + RR + 12}" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("↓ pinholes ↓", "↓ সুচছিদ্র ↓")}</text></svg>`;
    $("#k2esv", el).innerHTML = s;
    const A = balls[0], Bb = balls[1], th = Math.sqrt(M(Bb.k) / M(A.k));
    let out = L2(`Theory (Graham): rate A / rate B = √(M<sub>B</sub>/M<sub>A</sub>) = √(${B2(M(Bb.k))}/${B2(M(A.k))}) = <b>${f2(th, 2)}</b>`, `তত্ত্ব (গ্রাহাম): হার A / হার B = √(M<sub>B</sub>/M<sub>A</sub>) = √(${B2(M(Bb.k))}/${B2(M(A.k))}) = <b>${f2(th, 2)}</b>`);
    if (A.left < N && Bb.left < N && t > 1) {
      const meas = Math.log(N / A.left) / Math.log(N / Bb.left);
      out += "<br>" + L2(`Measured so far (from the fraction left in each balloon): ≈ <b>${f2(meas, 2)}</b>. The few particles make it a little noisy; run it again to see.`, `এ পর্যন্ত মাপা (প্রতিটি বেলুনে বাকি অংশ থেকে): ≈ <b>${f2(meas, 2)}</b>। কণা কম বলে ফল একটু এদিক-সেদিক হয়; আবার চালিয়ে দেখো।`);
    }
    out += "<br>" + L2(`Model time: ${f2(t, 0)} s. The lighter gas moves faster, reaches the hole more often and escapes first, one particle at a time.`, `মডেল সময়: ${f2(t, 0)} s। হালকা গ্যাস দ্রুত ছোটে, বেশি বার ছিদ্রে পৌঁছায় আর একটি একটি করে আগে বেরিয়ে যায়।`);
    $("#k2eo", el).innerHTML = out;
  };
  chipsK2(el, ".k2ea", x => { a = x.dataset.k; setup(); draw(); });
  chipsK2(el, ".k2eb", x => { b = x.dataset.k; setup(); draw(); });
  $("#k2ego", el).addEventListener("click", () => { if (!run && balls.some(B => B.left < N)) setup(); run = true; if (REDUCED) { for (let i = 0; i < 400 && run; i++) step(0.05); draw(); } });
  $("#k2ers", el).addEventListener("click", () => { setup(); draw(); });
  setup(); draw();
  if (!REDUCED) animate(el, dt => { if (run || balls.some(B => B.gone.length)) { step(dt); if (!run) balls.forEach(B => { B.gone.forEach(g => g.life -= dt); B.gone = B.gone.filter(g => g.life > 0); }); draw(); } });
};

/* 2.5 burning candle: three states of wax, blow out and relight through the smoke */
W.k2candle = (el) => {
  let zone = "l", lit = true, smoke = [], outT = 0, match = null, t = 0, inset = [];
  el.innerHTML = chipHtmlK2("k2cz", [["s", L2("Solid wax", "কঠিন মোম")], ["l", L2("Liquid wax", "তরল মোম")], ["g", L2("Wax vapour", "মোমের বাষ্প")]], zone) +
    `<div class="w-row"><button class="btn solid" id="k2cb">${L2("Blow it out", "ফুঁ দিয়ে নেভাও")}</button><button class="btn" id="k2cr" disabled>${L2("Relight through the smoke", "ধোঁয়ার মধ্য দিয়ে আবার জ্বালাও")}</button></div>
    <div class="svgwrap fit" id="k2csv"></div><div class="w-out" id="k2co"></div>`;
  const IX = 250, IY = 60, IW = 100, IH = 100, r = 5;
  const setInset = () => {
    inset = [];
    if (zone === "s") for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) inset.push({ x0: IX + 15 + i * 14, y0: IY + 15 + j * 14, ph: rndK2(0, 6.28), x: 0, y: 0 });
    if (zone === "l") for (let i = 0; i < 26; i++) inset.push({ x: IX + 10 + (i % 7) * 12, y: IY + IH - 8 - Math.floor(i / 7) * 12, vx: rndK2(-1, 1), vy: rndK2(-1, 1) });
    if (zone === "g") for (let i = 0; i < 8; i++) { const a = rndK2(0, 6.28); inset.push({ x: rndK2(IX + 10, IX + IW - 10), y: rndK2(IY + 10, IY + IH - 10), vx: Math.cos(a), vy: Math.sin(a) }); }
  };
  const step = dt => {
    t += dt;
    if (zone === "s") inset.forEach(p => { p.x = p.x0 + 1.1 * Math.sin(t * 20 + p.ph); p.y = p.y0 + 1.1 * Math.cos(t * 17 + p.ph); });
    else { const sp = zone === "l" ? 18 : 90;
      inset.forEach(p => { if (zone === "l") { p.vx += rndK2(-1, 1) * .7; p.vy += rndK2(-1, 1) * .7 + .1; const n = Math.hypot(p.vx, p.vy) || 1; p.vx /= n; p.vy /= n; }
        p.x += p.vx * sp * dt; p.y += p.vy * sp * dt;
        if (p.x < IX + r) { p.x = IX + r; p.vx = Math.abs(p.vx); } if (p.x > IX + IW - r) { p.x = IX + IW - r; p.vx = -Math.abs(p.vx); }
        if (p.y < IY + r) { p.y = IY + r; p.vy = Math.abs(p.vy); } if (p.y > IY + IH - r) { p.y = IY + IH - r; p.vy = -Math.abs(p.vy); } });
      if (zone === "l") sepK2(inset, r); }
    if (!lit) { outT += dt; if (outT < 9) for (let i = 0; i < 2; i++) smoke.push({ x: 150 + rndK2(-1, 1), y: 92, life: 1, ph: rndK2(0, 6.28) }); }
    smoke.forEach(s => { s.y -= 32 * dt; s.x += Math.sin(t * 2 + s.ph + s.y / 18) * 7 * dt; s.life -= dt / 2.6; }); smoke = smoke.filter(s => s.life > 0);
    if (match) { match.y += 70 * dt; if (match.y >= 86) { match = null; lit = true; outT = 0; } }
    $("#k2cr", el).disabled = lit || !smoke.length || !!match;
    $("#k2cb", el).textContent = lit ? L2("Blow it out", "ফুঁ দিয়ে নেভাও") : L2("Light with a match", "দিয়াশলাই দিয়ে জ্বালাও");
  };
  const draw = () => {
    const cx = 150, top = 112, fl = lit ? 1 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 29) : 0;
    let s = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("burning candle", "জ্বলন্ত মোমবাতি")}">`;
    // body with drips (solid wax)
    s += `<path d="M${cx - 34} ${top} V228 H${cx + 34} V${top} Z" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.5"/>
      <path d="M${cx + 34} ${top + 4} q6 10 2 26 q-3 8 -2 16" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" opacity=".25"/>
      <path d="M${cx - 34} ${top + 2} q-5 8 -1 18" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" opacity=".25"/>`;
    // pool of liquid wax
    s += `<ellipse cx="${cx}" cy="${top + 1}" rx="${lit || outT < 4 ? 26 : 20}" ry="6" fill="var(--c)" opacity="${lit ? .45 : .25}"/>`;
    // wick
    s += `<path d="M${cx} ${top} Q${cx + 1} ${top - 10} ${cx + 3} ${top - 18}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>`;
    // flame
    if (lit) {
      const h = 58 * fl;
      s += `<path d="M${cx} ${top - 12 - h} C${cx + 16} ${top - 30 - h * .35} ${cx + 15} ${top - 6} ${cx} ${top - 4} C${cx - 15} ${top - 6} ${cx - 16} ${top - 30 - h * .35} ${cx} ${top - 12 - h} Z" fill="var(--note)" opacity=".9"/>
        <ellipse cx="${cx + 1}" cy="${top - 18}" rx="6" ry="11" fill="var(--c-soft)" opacity=".95"/>`;
    }
    smoke.forEach(m => s += `<circle cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="${(3 + (1 - m.life) * 5).toFixed(1)}" fill="var(--muted)" opacity="${(m.life * .16).toFixed(2)}"/>`);
    if (match) s += `<line x1="${cx + 30}" y1="${match.y - 34}" x2="${cx + 4}" y2="${match.y}" stroke="var(--muted)" stroke-width="3"/><circle cx="${cx + 3}" cy="${match.y}" r="5" fill="var(--note)"/>`;
    // zone highlight + leader to inset
    const Z = { s: [cx - 30, 150, "var(--ink)"], l: [cx + 20, top, "var(--c)"], g: [cx + 4, top - 18, "var(--bad)"] }[zone];
    const ok = zone !== "g" || lit;
    s += `<circle cx="${Z[0]}" cy="${Z[1]}" r="9" fill="none" stroke="${Z[2]}" stroke-width="2" stroke-dasharray="3 2"/><line x1="${Z[0] + 9}" y1="${Z[1]}" x2="${IX}" y2="${IY + IH / 2}" stroke="${Z[2]}" stroke-width="1.2" stroke-dasharray="4 3"/>
      <rect x="${IX}" y="${IY}" width="${IW}" height="${IH}" rx="6" fill="var(--paper)" stroke="${Z[2]}" stroke-width="1.5"/>`;
    if (ok) inset.forEach(p => s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" fill="var(--c)" stroke="var(--ink)" stroke-width=".5"/>`);
    else s += `<text x="${IX + IW / 2}" y="${IY + IH / 2 + 5}" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("no vapour", "বাষ্প নেই")}</text>`;
    s += `<text x="${IX + IW / 2}" y="${IY - 8}" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("particles", "কণা")}</text>`;
    s += `<text x="12" y="200" font-size="13" fill="var(--muted)">${L2("solid", "কঠিন")}</text><line x1="48" y1="196" x2="${cx - 36}" y2="190" stroke="var(--muted)"/>
      <text x="12" y="118" font-size="13" fill="var(--muted)">${L2("liquid", "তরল")}</text><line x1="50" y1="114" x2="${cx - 27}" y2="${top}" stroke="var(--muted)"/>
      ${lit ? `<text x="12" y="70" font-size="13" fill="var(--muted)">${L2("vapour burns", "বাষ্প জ্বলে")}</text><line x1="${LANG === "bn" ? 88 : 98}" y1="66" x2="${cx - 8}" y2="${top - 20}" stroke="var(--muted)"/>` : ""}</svg>`;
    $("#k2csv", el).innerHTML = s;
    const T = {
      s: L2("Solid wax: hydrocarbon molecules packed closely in fixed places, only vibrating. The drips on the side are liquid wax that cooled and became solid again.", "কঠিন মোম: হাইড্রোকার্বন অণুগুলো নির্দিষ্ট জায়গায় ঘেঁষাঘেঁষি করে থেকে শুধু কাঁপে। গায়ের ফোঁটাগুলো হলো তরল মোম, যা ঠান্ডা হয়ে আবার কঠিন হয়েছে।"),
      l: L2("Liquid wax: the flame's heat melts the wax around the wick (solid → liquid). The molecules slide past one another, and the wick soaks the liquid up towards the flame.", "তরল মোম: শিখার তাপে সলতের চারপাশের মোম গলে (কঠিন → তরল)। অণুগুলো একে অপরের পাশ দিয়ে সরে যায়, আর সলতে তরলকে শিখার দিকে শুষে তোলে।"),
      g: L2("Wax vapour: near the flame the liquid wax vaporises (liquid → gas). The free vapour molecules mix with air and burn with oxygen.", "মোমের বাষ্প: শিখার কাছে তরল মোম বাষ্পে পরিণত হয় (তরল → গ্যাস)। মুক্ত বাষ্পের অণু বাতাসে মিশে অক্সিজেনের সাথে জ্বলে।")
    }[zone];
    let extra = lit ? "" : smoke.length ? L2("<br>The white smoke is wax vapour cooling into tiny droplets. It can still burn: try relighting through it.", "<br>সাদা ধোঁয়া হলো ঠান্ডা হয়ে ক্ষুদ্র ফোঁটা হওয়া মোমের বাষ্প। এটি এখনো জ্বলতে পারে: এর মধ্য দিয়ে আবার জ্বালিয়ে দেখো।") : L2("<br>The smoke has gone, so it can no longer be relit from above.", "<br>ধোঁয়া চলে গেছে, তাই ওপর থেকে আর জ্বালানো যাবে না।");
    $("#k2co", el).innerHTML = T + extra + `<br><span class="muted">C₂₅H₅₂ + 38O₂ → 25CO₂ + 26H₂O + ${L2("heat + light", "তাপ + আলো")}</span>`;
  };
  chipsK2(el, ".k2cz", b => { zone = b.dataset.k; setInset(); step(0.001); draw(); });
  $("#k2cb", el).addEventListener("click", () => { if (lit) { lit = false; outT = 0; } else { lit = true; smoke = []; } step(0.001); draw(); if (REDUCED && !lit) { for (let i = 0; i < 40; i++) step(0.05); draw(); } });
  $("#k2cr", el).addEventListener("click", () => { if (REDUCED) { lit = true; outT = 0; smoke = []; step(0.001); draw(); return; } match = { y: 30 }; });
  setInset(); step(0.01);
  runK2(el, "none", step, draw);
};

/* 2.6 heating and cooling curve of water (−40 °C to 140 °C) */
W.k2heat = (el) => {
  let mode = "h", tru = false, play = false;
  el.innerHTML = chipHtmlK2("k2hm", [["h", L2("Heating curve", "তাপ প্রয়োগের লেখচিত্র")], ["c", L2("Cooling curve", "শীতলীকরণের লেখচিত্র")]], mode) +
    `<div class="chipset k2ht" role="group"><button aria-pressed="false">${L2("True energy scale", "প্রকৃত শক্তির স্কেল")}</button></div>` +
    slider("k2hp", L2("Time", "সময়"), 0, 100, 0.5, 8, "") + `<div class="w-row"><button class="btn solid" id="k2hgo">${L2("Play", "চালাও")}</button></div><div class="svgwrap fit" id="k2hsv"></div><div class="w-out" id="k2ho"></div>`;
  // heating segments for 1 g: [energy J, T start, T end, kind]
  const SEG = [[84, -40, 0, "ice"], [334, 0, 0, "melt"], [418, 0, 100, "water"], [2260, 100, 100, "boil"], [80, 100, 140, "steam"]];
  const SCH = [15, 20, 25, 25, 15];
  const widths = () => { if (!tru) return SCH; const tot = SEG.reduce((a, s) => a + s[0], 0); return SEG.map(s => s[0] / tot * 100); };
  const at = pr => { // heating-order position (0..100) → {T, seg, f, E}
    const w = widths(); let acc = 0, E = 0;
    for (let i = 0; i < 5; i++) { if (pr <= acc + w[i] || i === 4) { const f = Math.max(0, Math.min(1, (pr - acc) / w[i])); const sg = SEG[i]; return { T: sg[1] + (sg[2] - sg[1]) * f, i, f, E: E + sg[0] * f }; } acc += w[i]; E += SEG[i][0]; }
  };
  const draw = () => {
    const p = +$("#k2hp", el).value, hp = mode === "h" ? p : 100 - p, st = at(hp), w = widths();
    $("#k2hp-v", el).textContent = f2(p, 0) + "%";
    const gx = 150, gy = 205, gw = 196, gh = 175, X = q => gx + q / 100 * gw, Y = T => gy - (T + 40) / 180 * gh;
    let s = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("heating curve", "তাপ প্রয়োগের লেখচিত্র")}">`;
    // axes and grid
    s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh - 6}" stroke="var(--muted)"/>`;
    [-40, 0, 100, 140].forEach(T => s += `<line x1="${gx - 3}" y1="${Y(T)}" x2="${gx + gw}" y2="${Y(T)}" stroke="var(--rule)" stroke-dasharray="${T === 0 || T === 100 ? "4 3" : "1 4"}"/><text x="${gx - 5}" y="${Y(T) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${f2(T)}</text>`);
    s += `<text x="${gx + 3}" y="${gy - gh - 10}" font-size="12" fill="var(--muted)">°C</text><text x="${gx + gw}" y="${gy + 16}" font-size="12" text-anchor="end" fill="var(--muted)">${tru ? (mode === "h" ? L2("heat supplied →", "প্রদত্ত তাপ →") : L2("heat released →", "বর্জিত তাপ →")) : L2("time →", "সময় →")}</text>`;
    // curve in display order
    let pts = [], acc = 0; const order = mode === "h" ? [0, 1, 2, 3, 4] : [4, 3, 2, 1, 0];
    pts.push([0, mode === "h" ? -40 : 140]);
    order.forEach(i => { acc += w[i]; pts.push([acc, mode === "h" ? SEG[i][2] : SEG[i][1]]); });
    s += `<polyline points="${pts.map(q => X(q[0]).toFixed(1) + "," + Y(q[1]).toFixed(1)).join(" ")}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
    // A B C D labels (flat parts)
    const flat = mode === "h" ? [[1, "A", "B"], [3, "C", "D"]] : [[3, "C", "D"], [1, "A", "B"]];
    let a2 = 0; order.forEach((i, k) => { const f = flat.find(z => z[0] === i); if (f) { const T = SEG[i][1];
      s += `<text x="${X(a2)}" y="${Y(T) - 6}" font-size="12" text-anchor="middle" fill="var(--ink)" font-weight="700">${mode === "h" ? f[1] : f[2]}</text><text x="${X(a2 + w[i])}" y="${Y(T) - 6}" font-size="12" text-anchor="middle" fill="var(--ink)" font-weight="700">${mode === "h" ? f[2] : f[1]}</text>`; }
      a2 += w[i]; });
    s += `<circle cx="${X(p)}" cy="${Y(st.T)}" r="6" fill="var(--bad)"/>`;
    // beaker with contents
    const bx = 18, by = 60, bw = 90, bh = 130, kind = SEG[st.i][3], f = st.f;
    const iceFrac = kind === "ice" ? 1 : kind === "melt" ? 1 - f : 0, waterFrac = kind === "melt" ? f : kind === "water" ? 1 : kind === "boil" ? 1 - f : 0, steam = kind === "boil" || kind === "steam";
    s += `<path d="M${bx} ${by} V${by + bh} H${bx + bw} V${by}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    const lv = by + bh - 8 - 60 * (waterFrac + iceFrac * 0.9);
    if (waterFrac > 0) s += `<rect x="${bx + 2}" y="${by + bh - 60 * waterFrac - 2}" width="${bw - 4}" height="${60 * waterFrac}" fill="var(--c)" opacity=".3"/>`;
    for (let k = 0; k < Math.round(6 * iceFrac); k++) s += `<rect x="${bx + 8 + (k % 3) * 26}" y="${by + bh - 24 - Math.floor(k / 3) * 22 - (waterFrac > 0 ? 4 : 0)}" width="20" height="18" rx="3" fill="var(--sheet)" stroke="var(--c)" stroke-width="1.5"/>`;
    if (kind === "boil") for (let k = 0; k < 6; k++) s += `<circle cx="${bx + 14 + k * 12}" cy="${by + bh - 10 - (k * 7 % 30) * waterFrac}" r="3" fill="none" stroke="var(--c)"/>`;
    if (steam) for (let k = 0; k < 5; k++) s += `<path d="M${bx + 16 + k * 15} ${Math.min(lv, by + bh - 10) - 6} q6 -10 0 -20 q-6 -10 0 -20" fill="none" stroke="var(--muted)" stroke-width="1.5" opacity="${kind === "steam" ? .8 : .5}"/>`;
    // thermometer
    const tx = bx + bw - 12; s += `<line x1="${tx}" y1="${by - 30}" x2="${tx}" y2="${by + bh - 14}" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" opacity=".35"/>
      <text x="${bx + bw / 2}" y="${by - 38}" font-size="15" text-anchor="middle" fill="var(--bad)" font-weight="700">${f2(st.T, 0)} °C</text>`;
    s += `<text x="${bx + bw / 2}" y="${by + bh + 22}" font-size="13" text-anchor="middle" fill="var(--muted)">${mode === "h" ? L2("heat absorbed", "তাপ শোষণ") : L2("heat released", "তাপ বর্জন")}</text></svg>`;
    $("#k2hsv", el).innerHTML = s;
    const D = mode === "h" ? {
      ice: L2("The ice warms up: the particles vibrate more strongly.", "বরফ গরম হচ্ছে: কণাগুলো আরও জোরে কাঁপছে।"),
      melt: L2("<b>Melting point line AB (0 °C):</b> ice and water together. The heat breaks the attractions, so the temperature does not rise.", "<b>গলনাঙ্ক রেখা AB (০ °C):</b> বরফ ও পানি একসাথে। তাপ আকর্ষণ ভাঙছে, তাই তাপমাত্রা বাড়ছে না।"),
      water: L2("The water warms up from 0 °C to 100 °C.", "পানি ০ °C থেকে ১০০ °C পর্যন্ত গরম হচ্ছে।"),
      boil: L2("<b>Boiling point line CD (100 °C):</b> water and vapour together. All the heat goes into turning water into vapour.", "<b>স্ফুটনাঙ্ক রেখা CD (১০০ °C):</b> পানি ও বাষ্প একসাথে। সব তাপ পানিকে বাষ্পে পরিণত করতে খরচ হচ্ছে।"),
      steam: L2("All the water has become vapour; now the vapour gets hotter.", "সব পানি বাষ্প হয়ে গেছে; এখন বাষ্প আরও গরম হচ্ছে।") } : {
      steam: L2("The vapour cools from 140 °C towards 100 °C.", "বাষ্প ১৪০ °C থেকে ১০০ °C-এর দিকে ঠান্ডা হচ্ছে।"),
      boil: L2("<b>At 100 °C</b> the vapour condenses to water. It gives out heat, so the temperature stays constant until all of it is liquid.", "<b>১০০ °C-এ</b> বাষ্প ঘনীভূত হয়ে পানি হচ্ছে। এটি তাপ ছাড়ে, তাই সবটুকু তরল না হওয়া পর্যন্ত তাপমাত্রা স্থির।"),
      water: L2("The water cools from 100 °C to 0 °C.", "পানি ১০০ °C থেকে ০ °C পর্যন্ত ঠান্ডা হচ্ছে।"),
      melt: L2("<b>At 0 °C</b> the water freezes to ice; the temperature stays constant until all of it is solid.", "<b>০ °C-এ</b> পানি জমে বরফ হচ্ছে; সবটুকু কঠিন না হওয়া পর্যন্ত তাপমাত্রা স্থির।"),
      ice: L2("The ice cools below 0 °C (to −40 °C).", "বরফ ০ °C-এর নিচে (−৪০ °C পর্যন্ত) ঠান্ডা হচ্ছে।") };
    const E = mode === "h" ? st.E : 3176 - st.E;
    $("#k2ho", el).innerHTML = D[kind] + "<br>" + L2(`Heat ${mode === "h" ? "absorbed" : "released"} so far by 1 g of water: ≈ <b>${f2(E, 0)} J</b> (of 3176 J).`, `১ g পানি এ পর্যন্ত ${mode === "h" ? "শোষণ" : "বর্জন"} করেছে: ≈ <b>${f2(E, 0)} J</b> (৩১৭৬ J-এর মধ্যে)।`) +
      (tru ? "<br><span class='muted'>" + L2("On the true energy scale, boiling needs about 71% of all the heat: turning water into vapour takes far more energy than anything else.", "প্রকৃত শক্তির স্কেলে মোট তাপের প্রায় ৭১% লাগে স্ফুটনে: পানিকে বাষ্প বানাতে অন্য যেকোনো ধাপের চেয়ে অনেক বেশি শক্তি লাগে।") + "</span>" : "");
  };
  chipsK2(el, ".k2hm", b => { mode = b.dataset.k; draw(); });
  const tb = $(".k2ht button", el); tb.addEventListener("click", () => { tru = !tru; tb.setAttribute("aria-pressed", tru); draw(); });
  $("#k2hp", el).addEventListener("input", () => { play = false; draw(); });
  $("#k2hgo", el).addEventListener("click", () => { if (REDUCED) { $("#k2hp", el).value = 100; draw(); return; } if (+$("#k2hp", el).value >= 100) $("#k2hp", el).value = 0; play = true; });
  draw();
  if (!REDUCED) animate(el, dt => { if (!play) return; const i = $("#k2hp", el); const v = Math.min(100, +i.value + dt * 9); i.value = v; if (v >= 100) play = false; draw(); });
};

/* 2.7 distillation of salt water; sublimation separating mixtures */
W.k2sep = (el) => {
  let mode = "d";
  el.innerHTML = chipHtmlK2("k2pm", [["d", L2("Distillation", "পাতন")], ["s", L2("Sublimation", "ঊর্ধ্বপাতন")]], mode) + `<div id="k2pbox"></div>`;
  const box = $("#k2pbox", el);
  let D = null, S = null;
  /* ---- distillation ---- */
  const PATH = [[70, 150], [70, 104], [84, 100], [118, 104], [284, 170], [300, 172], [300, 196]];
  const segL = PATH.slice(1).map((q, i) => Math.hypot(q[0] - PATH[i][0], q[1] - PATH[i][1])), totL = segL.reduce((a, b) => a + b, 0);
  const onPath = s => { let d = s; for (let i = 0; i < segL.length; i++) { if (d <= segL[i]) { const f = d / segL[i]; return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * f, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * f, i]; } d -= segL[i]; } return [...PATH[PATH.length - 1], segL.length]; };
  const dSetup = () => {
    D = { heat: false, T: 25, V: 200, got: 0, dots: [], salt: Array.from({ length: 22 }, () => [rndK2(-24, 24), rndK2(0, 1)]) };
    box.innerHTML = `<div class="w-row"><button class="btn solid" id="k2pgo">${L2("Heat", "তাপ দাও")}</button><button class="btn" id="k2prs">${L2("Reset", "আবার")}</button></div><div class="svgwrap fit" id="k2psv"></div><div class="w-out" id="k2po"></div>`;
    $("#k2pgo", el).addEventListener("click", () => { D.heat = !D.heat; if (REDUCED && D.heat) { for (let i = 0; i < 300 && D.V > 20; i++) dStep(0.05); D.dots = []; } dDraw(); });
    $("#k2prs", el).addEventListener("click", () => { dSetup(); dDraw(); });
  };
  const dStep = dt => {
    if (!D) return;
    if (D.heat && D.V > 20) { D.T = Math.min(100, D.T + dt * 30); if (D.T >= 100) { const dv = dt * 9; D.V = Math.max(20, D.V - dv); if (Math.random() < dt * 14) D.dots.push({ s: 0 }); } }
    else if (!D.heat) D.T = Math.max(25, D.T - dt * 8);
    if (D.V <= 20) D.heat = false;
    D.dots.forEach(d => d.s += dt * 95); D.dots = D.dots.filter(d => d.s < totL);
  };
  const dDraw = () => {
    if (!D || !$("#k2psv", el)) return;
    const lvlFrac = D.V / 200, fy = 170 + 34 - lvlFrac * 50; // liquid top inside flask
    let s = `<svg viewBox="0 0 360 245" role="img" aria-label="${L2("distillation apparatus", "পাতন যন্ত্র")}"><defs><clipPath id="k2fc"><circle cx="70" cy="170" r="34"/></clipPath></defs>`;
    // condenser jacket + inner tube
    s += `<line x1="118" y1="104" x2="284" y2="170" stroke="var(--c-soft)" stroke-width="24" stroke-linecap="round"/><line x1="118" y1="104" x2="284" y2="170" stroke="var(--ink)" stroke-width="1" opacity=".5"/>
      <path d="M270 176 v14 M140 101 v-14" stroke="var(--c)" stroke-width="3" fill="none"/><text x="236" y="200" font-size="12" text-anchor="middle" fill="var(--c)">${L2("cold water in", "ঠান্ডা পানি ঢোকে")}</text><text x="146" y="80" font-size="12" text-anchor="middle" fill="var(--c)">${L2("water out", "পানি বের হয়")}</text>
      <text x="205" y="${LANG === "bn" ? 126 : 124}" font-size="13" text-anchor="middle" fill="var(--ink)" transform="rotate(21.7 205 124)">${L2("condenser", "শীতক")}</text>`;
    // flask
    s += `<rect x="4" y="${fy}" width="140" height="80" fill="var(--c)" opacity=".28" clip-path="url(#k2fc)"/>`;
    D.salt.forEach(([dx, fr]) => { const yy = Math.min(200, fy + 4 + fr * (200 - fy)); s += `<rect x="${70 + dx * Math.min(1, (204 - yy) / 34)}" y="${yy}" width="3.5" height="3.5" fill="var(--ink)" opacity=".7"/>`; });
    s += `<circle cx="70" cy="170" r="34" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M62 138 V96 M78 138 V112 L118 104 M78 100 V96" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <line x1="70" y1="72" x2="70" y2="104" stroke="var(--ink)" stroke-width="3"/><circle cx="70" cy="104" r="3" fill="var(--bad)"/><text x="70" y="64" font-size="14" text-anchor="middle" fill="var(--bad)" font-weight="700">${f2(D.T, 0)} °C</text>`;
    // burner
    s += `<path d="M58 238 L62 216 H78 L82 238 Z" fill="var(--muted)"/>`;
    if (D.heat) s += `<path d="M70 213 q-6 -6 0 -9 q6 3 0 9" fill="var(--note)"/>`;
    // receiver
    const rv = Math.min(1, (200 - D.V) / 200);
    s += `<rect x="283" y="${232 - rv * 34}" width="40" height="${rv * 34}" fill="var(--c)" opacity=".28"/><path d="M281 188 V232 H325 V188" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    // moving vapour / drops
    D.dots.forEach(d => { const [x, y, i] = onPath(d.s); s += i < 4 && !(i === 3 && d.s > segL[0] + segL[1] + segL[2] + segL[3] * 0.45) ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="none" stroke="var(--c)" stroke-width="1.5"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="var(--c)"/>`; });
    s += `<text x="70" y="226" font-size="12" text-anchor="start" dx="16" fill="var(--muted)">${L2("salt water", "লবণপানি")}</text><text x="303" y="245" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("distillate", "পাতিত পানি")}</text></svg>`;
    $("#k2psv", el).innerHTML = s;
    $("#k2pgo", el).textContent = D.heat ? L2("Stop heating", "তাপ বন্ধ করো") : L2("Heat", "তাপ দাও");
    $("#k2po", el).innerHTML = L2(`Flask: ${f2(D.V)} mL of salt water left · Receiver: ${f2(200 - D.V)} mL of pure water.<br>`, `ফ্লাস্ক: ${f2(D.V)} mL লবণপানি বাকি · গ্রাহক পাত্র: ${f2(200 - D.V)} mL বিশুদ্ধ পানি।<br>`) +
      (D.V <= 20 ? L2("Stop before the flask boils dry: the salt stays behind and crystallises. Distillation = vaporisation + condensation.", "ফ্লাস্ক শুকিয়ে যাওয়ার আগেই থামাও: লবণ পড়ে থাকে ও কেলাসিত হয়। পাতন = বাষ্পীভবন + ঘনীভবন।")
        : D.T >= 100 && D.heat ? L2("Water vapour (open circles) leaves the salt behind, is cooled in the condenser and condenses into drops (filled). The thermometer at the side arm reads the vapour: 100 °C.", "জলীয় বাষ্প (ফাঁপা বৃত্ত) লবণ ফেলে রেখে ওপরে ওঠে, শীতকে ঠান্ডা হয়ে ফোঁটায় (ভরাট বৃত্ত) ঘনীভূত হয়। পাশের নলের মুখের থার্মোমিটার বাষ্পের তাপমাত্রা দেখায়: ১০০ °C।")
          : L2("Press Heat. The salt water warms up until it boils; salt does not vaporise at this temperature.", "তাপ দাও চাপো। লবণপানি গরম হয়ে ফুটতে শুরু করবে; এই তাপমাত্রায় লবণ বাষ্প হয় না।"));
  };
  /* ---- sublimation ---- */
  const MIX = { i: [L2("Iodine + sand", "আয়োডিন + বালু"), "var(--c)", "var(--note)", true, L2("iodine", "আয়োডিন"), L2("sand", "বালু")],
    n: [L2("NH₄Cl + table salt", "নিশাদল + খাদ্য লবণ"), "var(--muted)", "var(--sheet)", true, L2("ammonium chloride", "নিশাদল"), L2("salt", "লবণ")],
    g: [L2("Sand + glucose", "বালু + গ্লুকোজ"), "var(--note)", "var(--sheet)", false, L2("sand", "বালু"), L2("glucose", "গ্লুকোজ")] };
  let mix = "i";
  const sSetup = () => {
    S = { heat: false, t: 0, pile: [], vap: [], dep: [] };
    for (let k = 0; k < 44; k++) S.pile.push({ x: rndK2(150, 210), y: 176 - rndK2(0, 12) * (1 - Math.abs(k % 11 - 5) / 7), a: k % 2 === 0 });
    box.innerHTML = chipHtmlK2("k2px", Object.keys(MIX).map(k => [k, MIX[k][0]]), mix) + `<div class="w-row"><button class="btn solid" id="k2pgo">${L2("Heat", "তাপ দাও")}</button><button class="btn" id="k2prs">${L2("Reset", "আবার")}</button></div><div class="svgwrap fit" id="k2psv"></div><div class="w-out" id="k2po"></div>`;
    chipsK2(el, ".k2px", b => { mix = b.dataset.k; sSetup(); sDraw(); });
    $("#k2pgo", el).addEventListener("click", () => { S.heat = !S.heat; if (REDUCED && S.heat) { for (let i = 0; i < 400; i++) sStep(0.05); S.vap = []; } sDraw(); });
    $("#k2prs", el).addEventListener("click", () => { sSetup(); sDraw(); });
  };
  const wallX = y => 186 + (y - 70) / (173 - 70) * 54; // right inner wall of funnel at height y (left wall mirrored)
  const sStep = dt => {
    if (!S) return; if (S.heat) S.t += dt;
    if (S.heat && MIX[mix][3] && Math.random() < dt * 5) { const i = S.pile.findIndex(p => p.a); if (i >= 0) { const p = S.pile.splice(i, 1)[0]; S.vap.push({ x: p.x, y: p.y, vx: rndK2(-1, 1), vy: -1 }); } }
    S.vap.forEach(v => { v.vx += rndK2(-1, 1) * 0.5; v.vy += rndK2(-1, 1) * 0.5 - 0.15; const n = Math.hypot(v.vx, v.vy) || 1; v.vx /= n; v.vy /= n; v.x += v.vx * 50 * dt; v.y += v.vy * 50 * dt;
      if (v.y > 170) v.y = 170; const wx = wallX(Math.max(70, v.y)) - 4;
      if (Math.abs(v.x - 180) > wx - 180 || v.y < 76) { if (v.y < 150) { v.stick = true; const side = v.x < 180 ? -1 : 1, yy = Math.max(78, Math.min(150, v.y)); S.dep.push({ x: 180 + side * (wallX(yy) - 180 - 5), y: yy }); } else { v.x = 180 + Math.sign(v.x - 180) * (wx - 181); } } });
    S.vap = S.vap.filter(v => !v.stick);
  };
  const sDraw = () => {
    if (!S || !$("#k2psv", el)) return;
    const m = MIX[mix];
    let s = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("sublimation", "ঊর্ধ্বপাতন")}">`;
    // tripod and burner
    s += `<line x1="118" y1="186" x2="242" y2="186" stroke="var(--muted)" stroke-width="3"/><path d="M128 186 L116 236 M232 186 L244 236" stroke="var(--muted)" stroke-width="3"/><path d="M168 236 L172 216 H188 L192 236 Z" fill="var(--muted)"/>`;
    if (S.heat) s += `<path d="M180 213 q-8 -10 0 -18 q8 8 0 18" fill="var(--note)"/>`;
    // dish
    s += `<path d="M126 170 Q180 200 234 170" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>`;
    S.pile.forEach(p => s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.4" fill="${p.a ? m[1] : m[2]}" stroke="var(--ink)" stroke-width=".6"/>`);
    // funnel (inverted) with cotton plug
    s += `<path d="M120 173 L174 70 V30 M240 173 L186 70 V30" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="173" y="24" width="14" height="12" rx="3" fill="var(--sheet)" stroke="var(--muted)"/>`;
    S.dep.forEach(d => s += `<rect x="${(d.x - 2.5).toFixed(1)}" y="${(d.y - 2.5).toFixed(1)}" width="5" height="5" transform="rotate(45 ${d.x.toFixed(1)} ${d.y.toFixed(1)})" fill="${m[1]}" stroke="var(--ink)" stroke-width=".5"/>`);
    S.vap.forEach(v => s += `<circle cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r="3" fill="${m[1]}" opacity=".5"/>`);
    s += `<text x="252" y="92" font-size="13" fill="var(--muted)">${L2("cold funnel", "ঠান্ডা ফানেল")}</text><text x="252" y="108" font-size="12" fill="var(--muted)">${L2("(wet cloth outside)", "(বাইরে ভেজা কাপড়)")}</text>
      <circle cx="18" cy="206" r="4" fill="${m[1]}" stroke="var(--ink)" stroke-width=".6"/><text x="28" y="210" font-size="12" fill="var(--ink)">${m[4]}</text><circle cx="18" cy="224" r="4" fill="${m[2]}" stroke="var(--ink)" stroke-width=".6"/><text x="28" y="228" font-size="12" fill="var(--ink)">${m[5]}</text></svg>`;
    $("#k2psv", el).innerHTML = s;
    $("#k2pgo", el).textContent = S.heat ? L2("Stop heating", "তাপ বন্ধ করো") : L2("Heat", "তাপ দাও");
    const left = S.pile.filter(p => p.a).length;
    let msg;
    if (!m[3]) msg = S.t > 3 ? L2("Nothing rises: neither sand nor glucose sublimes (strong heating would only melt and char the glucose). Separate them instead by dissolving the glucose in water, filtering off the sand and evaporating the water.", "কিছুই ওপরে ওঠে না: বালু বা গ্লুকোজ কোনোটিই ঊর্ধ্বপাতিত হয় না (জোরে তাপ দিলে গ্লুকোজ শুধু গলে পুড়ে যাবে)। এর বদলে গ্লুকোজ পানিতে গুলে, ছেঁকে বালু আলাদা করে, পানি বাষ্পীভূত করো।") : L2("Press Heat and watch.", "তাপ দাও চাপো আর লক্ষ করো।");
    else if (!S.heat && S.t === 0) msg = L2(`Press Heat. Only the ${m[4]} can change directly from solid to vapour.`, `তাপ দাও চাপো। শুধু ${m[4]} সরাসরি কঠিন থেকে বাষ্পে পরিণত হতে পারে।`);
    else msg = L2(`The ${m[4]} sublimes: solid → vapour → solid again on the cold funnel wall (${B2(S.dep.length)} crystals so far). The ${m[5]} stays in the dish${left === 0 ? " — separation complete!" : "."}`, `${m[4]} ঊর্ধ্বপাতিত হচ্ছে: কঠিন → বাষ্প → ঠান্ডা ফানেলের দেয়ালে আবার কঠিন (এ পর্যন্ত ${B2(S.dep.length)}টি কেলাস)। ${m[5]} বাটিতেই থেকে যায়${left === 0 ? " — পৃথকীকরণ সম্পূর্ণ!" : "।"}`) +
      (mix === "n" ? "<br><span class='muted'>" + L2("Strictly, NH₄Cl splits into NH₃ and HCl gases, which recombine on the cold surface.", "সূক্ষ্মভাবে বললে, NH₄Cl ভেঙে NH₃ ও HCl গ্যাস হয়, যা ঠান্ডা পৃষ্ঠে আবার যুক্ত হয়।") + "</span>" : "");
    $("#k2po", el).innerHTML = msg + "<br><span class='muted'>" + L2("Teacher demonstration in a fume cupboard.", "শিক্ষক ফিউম কাবার্ডে প্রদর্শন করবেন।") + "</span>";
  };
  const show = () => { if (mode === "d") { S = null; dSetup(); dDraw(); } else { D = null; sSetup(); sDraw(); } };
  chipsK2(el, ".k2pm", b => { mode = b.dataset.k; show(); });
  show();
  if (!REDUCED) animate(el, dt => { if (D) { const busy = D.heat || D.dots.length || D.T > 25; dStep(dt); if (busy) dDraw(); } if (S && (S.heat || S.vap.length)) { sStep(dt); sDraw(); } });
};
