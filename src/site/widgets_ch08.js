/* ---- chapter 8 widgets: reflection of light ---- */
const B8 = x => bnNum(x, LANG);
const f8 = (x, d = 1) => bnNum((+x).toFixed(d), LANG).replace(/^-/, "−");
const chips8 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const ln8 = (x1, y1, x2, y2, col, w = 2, dash = "") => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} stroke-linecap="round"/>`;
/* small arrowhead in the middle of a segment, pointing from (x1,y1) to (x2,y2) */
const mid8 = (x1, y1, x2, y2, col, s = 7, at = 0.5) => { const a = Math.atan2(y2 - y1, x2 - x1), x = x1 + (x2 - x1) * at, y = y1 + (y2 - y1) * at;
  const p = (da, r) => `${(x + r * Math.cos(a + da)).toFixed(1)},${(y + r * Math.sin(a + da)).toFixed(1)}`;
  return `<path d="M${p(0, s)} L${p(2.6, s)} L${p(-2.6, s)} z" fill="${col}"/>`; };
/* point far along the ray from (x1,y1) through (x2,y2) */
const far8 = (x1, y1, x2, y2, L = 900) => { const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1; return [x1 + dx / n * L, y1 + dy / n * L]; };
const refl8 = (dx, dy, nx, ny) => { const k = 2 * (dx * nx + dy * ny); return [dx - k * nx, dy - k * ny]; };
const svgPt8 = (wrap, e, W) => { const s = wrap.querySelector("svg"), r = s.getBoundingClientRect(), k = W / r.width; return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]; };
const eye8 = (x, y, col = "var(--ink)", flip = false) => `<g transform="translate(${x},${y})${flip ? " scale(-1,1)" : ""}"><path d="M-10,0 Q0,-9 10,0 Q0,9 -10,0 z" fill="var(--paper)" stroke="${col}" stroke-width="1.5"/><circle cx="3" cy="0" r="3.2" fill="${col}"/></g>`;
const H8 = `paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"`;
const hatch8 = (pts, side, col = "var(--muted)") => pts.map(([x, y]) => ln8(x, y, x + side * 7, y + 6, col, 1.2)).join("");

/* wavelength (nm) → approximate display colour */
const wl2rgb8 = (w) => { let r = 0, g = 0, b = 0;
  if (w < 440) { r = (440 - w) / 60; b = 1; } else if (w < 490) { g = (w - 440) / 50; b = 1; } else if (w < 510) { g = 1; b = (510 - w) / 20; }
  else if (w < 580) { r = (w - 510) / 70; g = 1; } else if (w < 645) { r = 1; g = (645 - w) / 65; } else { r = 1; }
  let k = 1; if (w < 420) k = 0.3 + 0.7 * (w - 380) / 40; else if (w > 680) k = 0.3 + 0.7 * (780 - w) / 100;
  const c = v => Math.round(255 * Math.pow(Math.max(0, v) * k, 0.8)); return `rgb(${c(r)},${c(g)},${c(b)})`; };
const sci8 = (x, d = 2) => { const n = Math.floor(Math.log10(x)), a = x / Math.pow(10, n); return `${f8(a, d)} × 10<sup>${B8(n).replace("-", "−")}</sup>`; };

/* 8.1 electromagnetic spectrum and the visible band */
W.c8spectrum = (el) => {
  el.innerHTML = slider("c8lg", L2("Wavelength (whole spectrum, log scale)", "তরঙ্গদৈর্ঘ্য (পুরো বর্ণালী, লগ স্কেল)"), -12, 3, 0.01, -6.26, "") +
    slider("c8nm", L2("Visible wavelength", "দৃশ্যমান তরঙ্গদৈর্ঘ্য"), 400, 700, 5, 550, "nm") +
    `<div class="svgwrap fit" id="c8spsv"></div><div class="w-out" id="c8spo"></div>`;
  const X0 = 20, X1 = 400, xl = lg => X0 + (lg + 12) / 15 * (X1 - X0);
  const REG = [[-12, -11, "γ", "γ", L2("gamma rays", "গামা রে"), 1], [-11, -8, "X-ray", "এক্স-রে", L2("X-rays", "এক্স-রে"), 0], [-8, Math.log10(4e-7), "UV", "অতিবেগুনি", L2("ultraviolet", "অতিবেগুনি"), 0],
    [Math.log10(4e-7), Math.log10(7e-7), "", "", L2("visible light", "দৃশ্যমান আলো"), 2], [Math.log10(7e-7), -3, "IR", "অবলোহিত", L2("infrared", "অবলোহিত (ইনফ্রারেড)"), 0],
    [-3, -0.5, L2("microwave", "মাইক্রোওয়েভ"), "", L2("microwaves", "মাইক্রোওয়েভ"), 1], [-0.5, 3, L2("radio", "রেডিও"), "", L2("radio waves", "রেডিও তরঙ্গ"), 0]];
  const V = nm => Math.min(1, 1.019 * Math.exp(-285.4 * Math.pow(nm / 1000 - 0.559, 2)));
  const cname = nm => nm < 450 ? L2("violet", "বেগুনি") : nm < 495 ? L2("blue", "নীল") : nm < 570 ? L2("green", "সবুজ") : nm < 590 ? L2("yellow", "হলুদ") : nm < 620 ? L2("orange", "কমলা") : L2("red", "লাল");
  const len = l => l >= 1 ? f8(l, l < 10 ? 1 : 0) + " m" : l >= 1e-3 ? f8(l * 1e3, 1) + " mm" : l >= 1e-6 ? f8(l * 1e6, 1) + " µm" : l >= 1e-9 ? f8(l * 1e9, 0) + " nm" : sci8(l, 1) + " m";
  let grad = ""; for (let w = 400; w <= 700; w += 20) grad += `<stop offset="${(w - 400) / 300}" stop-color="${wl2rgb8(w)}"/>`;
  const go = () => {
    const lg = +$("#c8lg", el).value, lam = Math.pow(10, lg), nm = lam * 1e9, vis = nm >= 399.5 && nm <= 700.5;
    $("#c8lg-v", el).innerHTML = len(lam); sv(el, "c8nm", "nm");
    const reg = REG.find(r => lg >= r[0] && lg < r[1]) || REG[REG.length - 1];
    let g = `<svg viewBox="0 0 420 228" role="img" aria-label="${L2("electromagnetic spectrum", "বিদ্যুৎ চৌম্বকীয় বর্ণালী")}"><defs><linearGradient id="c8rg">${grad}</linearGradient></defs>`;
    REG.forEach((r, i) => { const a = xl(r[0]), b = xl(r[1]);
      g += `<rect x="${a.toFixed(1)}" y="44" width="${(b - a).toFixed(1)}" height="24" fill="${r[5] === 2 ? "url(#c8rg)" : i % 2 ? "var(--c-soft)" : "var(--paper)"}" stroke="var(--rule)"/>`;
      const lab = LANG === "bn" && r[3] ? r[3] : r[2]; if (lab) g += `<text x="${((a + b) / 2).toFixed(1)}" y="${r[5] === 1 ? 86 : 38}" font-size="15" text-anchor="middle" fill="${reg === r ? "var(--c)" : "var(--muted)"}" font-weight="${reg === r ? 700 : 400}">${lab}</text>`; });
    g += `<text x="${X0}" y="12" font-size="14" fill="var(--muted)">${L2("short λ, high f", "ছোট λ, বেশি f")}</text><text x="${X1}" y="12" font-size="14" text-anchor="end" fill="var(--muted)">${L2("long λ, low f", "বড় λ, কম f")}</text>`;
    const va = xl(REG[3][0]), vb = xl(REG[3][1]);
    g += `<path d="M${va},68 L${X0},126 L${X1},126 L${vb},68 z" fill="var(--c-soft)" opacity=".45"/>`;
    /* eye sensitivity curve over the visible strip */
    let p = ""; for (let w = 400; w <= 700; w += 5) p += `${(X0 + (w - 400) / 300 * (X1 - X0)).toFixed(1)},${(176 - V(w) * 44).toFixed(1)} `;
    g += `<polyline points="${p}" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="${X0 + 4}" y="142" font-size="14" fill="var(--muted)">${L2("eye's sensitivity", "চোখের সংবেদনশীলতা")}</text>`;
    g += `<rect x="${X0}" y="178" width="${X1 - X0}" height="20" fill="url(#c8rg)"/>`;
    [400, 500, 600, 700].forEach(w => { const x = X0 + (w - 400) / 300 * (X1 - X0); g += `<text x="${x}" y="218" font-size="15" text-anchor="${w === 400 ? "start" : w === 700 ? "end" : "middle"}" fill="var(--muted)">${B8(w)} nm</text>`; });
    const mx = xl(lg); g += ln8(mx, 40, mx, 72, "var(--bad)", 3);
    if (vis) { const sx = X0 + (nm - 400) / 300 * (X1 - X0); g += ln8(sx, 126, sx, 202, "var(--bad)", 2.5) + `<circle cx="${sx.toFixed(1)}" cy="${(176 - V(nm) * 44).toFixed(1)}" r="5" fill="var(--bad)"/>`; }
    g += `</svg>`; $("#c8spsv", el).innerHTML = g;
    const f = 3e8 / lam;
    let o = L2(`<b>${reg[4]}</b>: λ = ${len(lam)}, f = c ÷ λ = ${sci8(f)} Hz.`, `<b>${reg[4]}</b>: λ = ${len(lam)}, f = c ÷ λ = ${sci8(f)} Hz।`);
    if (vis) o += `<br><span style="display:inline-block;width:1.1em;height:1.1em;border-radius:3px;vertical-align:-2px;background:${wl2rgb8(nm)};border:1px solid var(--rule)"></span> ` + L2(`Looks <b>${cname(nm)}</b>. Eye sensitivity here ≈ ${Math.round(V(nm) * 100)}% of the peak (yellow-green, about 555 nm).`, `দেখায় <b>${cname(nm)}</b>। এখানে চোখের সংবেদনশীলতা সর্বোচ্চের প্রায় ${B8(Math.round(V(nm) * 100))}% (হলদে-সবুজ, প্রায় ৫৫৫ nm-এ সর্বোচ্চ)।`);
    else o += "<br>" + L2("Our eyes cannot see this at all. Move the top slider to the narrow coloured band (400–700 nm).", "আমাদের চোখ এটি একেবারেই দেখতে পায় না। ওপরের স্লাইডারটি সরু রঙিন অংশে (৪০০–৭০০ nm) আনো।");
    $("#c8spo", el).innerHTML = o;
  };
  $("#c8lg", el).addEventListener("input", () => { const nm = Math.pow(10, +$("#c8lg", el).value) * 1e9; if (nm >= 400 && nm <= 700) $("#c8nm", el).value = Math.round(nm / 5) * 5; go(); });
  $("#c8nm", el).addEventListener("input", () => { $("#c8lg", el).value = Math.log10(+$("#c8nm", el).value * 1e-9).toFixed(2); go(); });
  $("#c8lg", el).value = Math.log10(550e-9).toFixed(2); go();
};

/* 8.2 law of reflection: drag the incident ray */
W.c8law = (el) => {
  el.innerHTML = slider("c8i", L2("Angle of incidence i", "আপতন কোণ i"), 0, 85, 1, 40, "°") + `<div class="svgwrap fit" id="c8lsv"></div><div class="w-out" id="c8lo"></div>
  <p class="hint">${L2("Tip: drag the round handle at the start of the incident ray.", "টিপস: আপতিত রশ্মির শুরুর গোল হাতলটি টেনে সরাও।")}</p>`;
  const Ox = 210, Oy = 195, L = 165, wrap = $("#c8lsv", el);
  const arc = (r, a1, a2, sweep) => `M${Ox + r * Math.sin(a1)},${Oy - r * Math.cos(a1)} A${r} ${r} 0 0 ${sweep} ${Ox + r * Math.sin(a2)},${Oy - r * Math.cos(a2)}`;
  const go = () => {
    const i = sv(el, "c8i", "°"), a = i * Math.PI / 180, Ax = Ox - L * Math.sin(a), Ay = Oy - L * Math.cos(a), Bx = Ox + L * Math.sin(a), By = Ay;
    let g = `<svg viewBox="0 0 420 240" role="img" aria-label="${L2("law of reflection", "প্রতিফলনের সূত্র")}">`;
    g += `<rect x="25" y="${Oy}" width="370" height="8" fill="var(--c-soft)" stroke="var(--c)"/>` + hatch8(Array.from({ length: 24 }, (_, k) => [30 + k * 15, Oy + 9]), 1);
    g += ln8(Ox, Oy, Ox, 22, "var(--muted)", 1.5, "5 4") + `<text x="${Ox + 5}" y="20" font-size="15" fill="var(--muted)">${L2("normal", "অভিলম্ব")}</text>`;
    g += `<path d="${arc(46, 0, -a, 0)}" fill="none" stroke="var(--c)" stroke-width="2"/><path d="${arc(46, 0, a, 1)}" fill="none" stroke="var(--bad)" stroke-width="2"/>`;
    if (i > 3) { const h = a / 2; g += `<text x="${Ox - 62 * Math.sin(h)}" y="${Oy - 62 * Math.cos(h) + 5}" font-size="16" text-anchor="middle" fill="var(--c)" font-weight="700">i</text><text x="${Ox + 62 * Math.sin(h)}" y="${Oy - 62 * Math.cos(h) + 5}" font-size="16" text-anchor="middle" fill="var(--bad)" font-weight="700">r</text>`; }
    if (i < 80) { g += `<path d="M${Ox - 88},${Oy} A88 88 0 0 1 ${Ox - 88 * Math.sin(a)},${Oy - 88 * Math.cos(a)}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="3 3"/>`;
      const h = (a + Math.PI / 2) / 2; g += `<text x="${Ox - 100 * Math.sin(h)}" y="${Oy - 100 * Math.cos(h) + 4}" font-size="14" text-anchor="middle" fill="var(--muted)">${B8(90 - i)}°</text>`; }
    g += ln8(Ax, Ay, Ox, Oy, "var(--c)", 3) + mid8(Ax, Ay, Ox, Oy, "var(--c)", 8) + ln8(Ox, Oy, Bx, By, "var(--bad)", 3) + mid8(Ox, Oy, Bx, By, "var(--bad)", 8);
    g += `<circle cx="${Ax}" cy="${Ay}" r="13" fill="var(--c)" opacity=".25" data-h="1" style="cursor:grab;touch-action:none"/><circle cx="${Ax}" cy="${Ay}" r="6" fill="var(--c)" data-h="1" style="cursor:grab;touch-action:none"/>`;
    g += `<text x="${Ox}" y="${Oy + 30}" font-size="15" text-anchor="middle" fill="var(--ink)">O</text>`;
    g += `<text x="30" y="${Oy + 32}" font-size="15" fill="var(--c)">${L2("incident ray", "আপতিত রশ্মি")}</text><text x="390" y="${Oy + 32}" font-size="15" text-anchor="end" fill="var(--bad)">${L2("reflected ray", "প্রতিফলিত রশ্মি")}</text></svg>`;
    wrap.innerHTML = g;
    $("#c8lo", el).innerHTML = L2(`i = ${i}° → <b>r = ${i}°</b>. The ray makes ${90 - i}° with the mirror surface; the angle between the incident and reflected rays is ${2 * i}°.${i === 0 ? " Along the normal, the ray comes straight back." : ""}`,
      `i = ${B8(i)}° → <b>r = ${B8(i)}°</b>। রশ্মিটি আয়নার তলের সাথে ${B8(90 - i)}° কোণ করে; আপতিত ও প্রতিফলিত রশ্মির মধ্যবর্তী কোণ ${B8(2 * i)}°।${i === 0 ? " অভিলম্ব বরাবর পড়লে রশ্মি সোজা ফিরে আসে।" : ""}`);
  };
  let drag = false;
  const mv = e => { if (!drag) return; const [x, y] = svgPt8(wrap, e, 420); let i = Math.atan2(Math.abs(Ox - x), Math.max(1, Oy - y)) * 180 / Math.PI; i = Math.round(Math.min(85, Math.max(0, i))); $("#c8i", el).value = i; go(); e.preventDefault(); };
  wrap.addEventListener("pointerdown", e => { if (e.target.dataset && e.target.dataset.h) { drag = true; e.preventDefault(); } });
  window.addEventListener("pointermove", mv); window.addEventListener("pointerup", () => { drag = false; });
  $("#c8i", el).addEventListener("input", go); go();
};

/* 8.2.2 colour of objects + regular vs diffuse reflection */
W.c8colour = (el) => {
  el.innerHTML = `<div class="chipset c8m" role="group"><button data-m="c" aria-pressed="true">${L2("Colour of objects", "বস্তুর রং")}</button><button data-m="s" aria-pressed="false">${L2("Smooth vs rough", "মসৃণ বনাম অমসৃণ")}</button></div>
  <div class="chipset c8lt" role="group"><button data-l="rgb" aria-pressed="true">${L2("White light", "সাদা আলো")}</button><button data-l="r" aria-pressed="false">${L2("Red light", "লাল আলো")}</button><button data-l="g" aria-pressed="false">${L2("Green light", "সবুজ আলো")}</button><button data-l="b" aria-pressed="false">${L2("Blue light", "নীল আলো")}</button></div>
  <div class="svgwrap fit" id="c8csv"></div><div class="w-out" id="c8co"></div>`;
  let mode = "c", light = "rgb";
  const OBJ = [["r", L2("red rose", "লাল গোলাপ")], ["g", L2("green leaf", "সবুজ পাতা")], ["rgb", L2("white paper", "সাদা কাগজ")], ["", L2("black cloth", "কালো কাপড়")]];
  const col = ch => `rgb(${ch.includes("r") ? 230 : 22},${ch.includes("g") ? (ch === "g" ? 185 : 230) : 22},${ch.includes("b") ? 230 : 22})`;
  const lname = { rgb: L2("white", "সাদা"), r: L2("red", "লাল"), g: L2("green", "সবুজ"), b: L2("blue", "নীল") };
  const cn = ch => ch === "" ? L2("black", "কালো") : ch === "rgb" ? L2("white", "সাদা") : lname[ch];
  const colourScene = () => {
    let g = `<svg viewBox="0 0 420 200" role="img" aria-label="${L2("objects under coloured light", "রঙিন আলোতে বস্তু")}">`;
    g += `<path d="M190,22 L230,22 L410,120 L10,120 z" fill="${col(light)}" opacity=".3" stroke="var(--rule)"/><rect x="185" y="6" width="50" height="18" rx="5" fill="var(--muted)"/><circle cx="210" cy="26" r="7" fill="${col(light)}" stroke="var(--muted)"/>`;
    const res = [];
    OBJ.forEach(([ref, nm], k) => { const cx = 55 + k * 103, out = [...light].filter(c => ref.includes(c)).join(""), c = col(out); res.push([nm, out]);
      if (k === 0) g += [0, 72, 144, 216, 288].map(a => `<circle cx="${cx + 13 * Math.cos(a * Math.PI / 180)}" cy="${130 + 13 * Math.sin(a * Math.PI / 180)}" r="12" fill="${c}" stroke="var(--muted)"/>`).join("") + `<circle cx="${cx}" cy="130" r="8" fill="${c}" stroke="var(--muted)"/>`;
      if (k === 1) g += `<ellipse cx="${cx}" cy="130" rx="32" ry="15" transform="rotate(-20 ${cx} 130)" fill="${c}" stroke="var(--muted)"/>` + ln8(cx - 30, 141, cx + 28, 119, "var(--muted)", 1);
      if (k === 2) g += `<rect x="${cx - 26}" y="106" width="52" height="46" fill="${c}" stroke="var(--muted)"/>`;
      if (k === 3) g += `<path d="M${cx - 30},108 Q${cx - 10},100 ${cx + 30},108 L${cx + 26},152 Q${cx},146 ${cx - 28},152 z" fill="${c}" stroke="var(--muted)"/>`;
      g += `<text x="${cx}" y="176" font-size="15" text-anchor="middle" fill="var(--ink)">${nm}</text><text x="${cx}" y="193" font-size="15" text-anchor="middle" fill="var(--muted)">→ ${cn(out)}</text>`; });
    g += `</svg>`; $("#c8csv", el).innerHTML = g;
    $("#c8co", el).innerHTML = L2(`In <b>${lname[light]}</b> light: `, `<b>${lname[light]}</b> আলোতে: `) + res.map(([nm, out]) => `${nm} ${L2("looks", "দেখায়")} <b>${cn(out)}</b>`).join("; ") + L2(". An object can only reflect colours that are actually in the light falling on it.", "। বস্তু শুধু সেই রংই প্রতিফলিত করতে পারে, যা তার ওপর পড়া আলোতে আছে।");
  };
  const roughScene = () => {
    let g = `<svg viewBox="0 0 420 200" role="img" aria-label="${L2("regular and diffuse reflection", "নিয়মিত ও ব্যাপ্ত প্রতিফলন")}">${ln8(210, 10, 210, 190, "var(--rule)", 1)}`;
    const d = [Math.SQRT1_2, Math.SQRT1_2], tilt = [-28, 18, -8, 32, -22];
    [0, 1].forEach(side => { const x0 = side ? 225 : 15, Y = 150;
      let surf = ""; const hits = [];
      for (let k = 0; k < 5; k++) { const hx = x0 + 45 + k * 30, a = side ? tilt[k] * Math.PI / 180 : 0, nx = Math.sin(a), ny = -Math.cos(a); hits.push([hx, nx, ny]);
        surf += `${(hx - 15 * Math.cos(a)).toFixed(1)},${(Y - 15 * Math.sin(a)).toFixed(1)} ${(hx + 15 * Math.cos(a)).toFixed(1)},${(Y + 15 * Math.sin(a)).toFixed(1)} `; }
      g += `<polyline points="${x0 + 10},${Y} ${surf}${x0 + 190},${Y}" fill="none" stroke="var(--c)" stroke-width="3" stroke-linejoin="round"/>`;
      hits.forEach(([hx, nx, ny]) => { const sx = hx - 95, sy = Y - 95; const [rx, ry] = refl8(d[0], d[1], nx, ny);
        g += ln8(sx, sy, hx, Y, "var(--note)", 2) + mid8(sx, sy, hx, Y, "var(--note)", 6) + ln8(hx, Y, hx + rx * 95, Y + ry * 95, "var(--bad)", 2) + mid8(hx, Y, hx + rx * 95, Y + ry * 95, "var(--bad)", 6, 0.6);
        if (side) g += ln8(hx, Y, hx + nx * 22, Y + ny * 22, "var(--muted)", 1, "3 3"); });
      g += `<text x="${x0 + 100}" y="178" font-size="16" text-anchor="middle" fill="var(--ink)" font-weight="700">${side ? L2("Rough surface", "অমসৃণ তল") : L2("Smooth surface", "মসৃণ তল")}</text><text x="${x0 + 100}" y="195" font-size="15" text-anchor="middle" fill="var(--muted)">${side ? L2("diffuse reflection", "ব্যাপ্ত প্রতিফলন") : L2("regular reflection", "নিয়মিত প্রতিফলন")}</text>`; });
    g += `</svg>`; $("#c8csv", el).innerHTML = g;
    $("#c8co", el).innerHTML = L2("Every ray obeys r = i on both surfaces. On the rough surface the little patches (dashed normals) face different ways, so parallel rays leave in different directions: no image, but the surface can be seen from anywhere.", "দুই তলেই প্রতিটি রশ্মি r = i মানে। অমসৃণ তলের ছোট ছোট অংশ (ড্যাশ দেওয়া অভিলম্ব) নানা দিকে মুখ করে থাকে, তাই সমান্তরাল রশ্মি নানা দিকে ফিরে যায়: প্রতিবিম্ব হয় না, কিন্তু তলটি যেকোনো দিক থেকে দেখা যায়।");
  };
  const go = () => { $(".c8lt", el).style.display = mode === "c" ? "" : "none"; mode === "c" ? colourScene() : roughScene(); };
  chips8(el, ".c8m", b => { mode = b.dataset.m; go(); }); chips8(el, ".c8lt", b => { light = b.dataset.l; go(); }); go();
};

/* 8.3 plane mirror: image of an object, and the half-length mirror */
W.c8plane = (el) => {
  el.innerHTML = `<div class="chipset c8pm" role="group"><button data-m="o" aria-pressed="true">${L2("Image of an object", "বস্তুর প্রতিবিম্ব")}</button><button data-m="f" aria-pressed="false">${L2("Full-length mirror", "পূর্ণদৈর্ঘ্য আয়না")}</button></div><div id="c8pin"></div><div class="svgwrap fit" id="c8psv"></div><div class="w-out" id="c8po"></div>`;
  let mode = "o";
  const build = () => { $("#c8pin", el).innerHTML = mode === "o" ? slider("c8pd", L2("Object distance from mirror", "আয়না থেকে বস্তুর দূরত্ব"), 1, 8, 0.5, 4, "cm") + slider("c8pe", L2("Eye height", "চোখের উচ্চতা"), 1, 9, 0.5, 6, "cm")
    : slider("c8ph", L2("Person's height", "মানুষের উচ্চতা"), 1, 1.9, 0.05, 1.5, "m") + slider("c8px", L2("Distance from mirror", "আয়না থেকে দূরত্ব"), 0.4, 2.4, 0.1, 1, "m");
    el.querySelectorAll("#c8pin input").forEach(i => i.addEventListener("input", go)); go(); };
  const go = () => {
    let g = `<svg viewBox="0 0 420 246" role="img" aria-label="${L2("plane mirror image", "সমতল আয়নার প্রতিবিম্ব")}">`, o;
    if (mode === "o") {
      const d = sv(el, "c8pd", "cm", 1), eh = sv(el, "c8pe", "cm", 1), M = 250, S = 20, base = 200, top = 140, ox = M - d * S, ix = M + d * S, Ex = 22, Ey = base - eh * 18;
      g += `<rect x="${M}" y="14" width="6" height="200" fill="var(--c-soft)" stroke="var(--c)"/>` + hatch8(Array.from({ length: 13 }, (_, k) => [M + 6, 18 + k * 15]), 1);
      g += ln8(10, base, 410, base, "var(--rule)", 1);
      [[top, "var(--c)"], [base - 2, "var(--note)"]].forEach(([y, c]) => { const t = (M - Ex) / (ix - Ex), my = Ey + t * (y - Ey);
        g += ln8(ox, y, M, my, c, 2) + mid8(ox, y, M, my, c, 6) + ln8(M, my, Ex + 10, Ey + (my - Ey) * 10 / (M - Ex), c, 2) + mid8(M, my, Ex, Ey, c, 6) + ln8(M, my, ix, y, c, 1.5, "5 4"); });
      g += ln8(ox, base, ox, top, "var(--ink)", 3) + `<path d="M${ox - 7},${top + 10} L${ox},${top} L${ox + 7},${top + 10}" fill="none" stroke="var(--ink)" stroke-width="3"/>`;
      g += ln8(ix, base, ix, top, "var(--muted)", 3, "6 4") + `<path d="M${ix - 7},${top + 10} L${ix},${top} L${ix + 7},${top + 10}" fill="none" stroke="var(--muted)" stroke-width="3"/>`;
      g += eye8(Ex, Ey) + `<text x="${ox}" y="${base + 16}" font-size="15" text-anchor="middle" fill="var(--ink)" ${H8}>${L2("object", "বস্তু")}</text><text x="${ix}" y="${base + 16}" font-size="15" text-anchor="middle" fill="var(--muted)" ${H8}>${L2("image", "প্রতিবিম্ব")}</text>`;
      g += `<path d="M${ox},228 L${M},228 M${M},228 L${ix},228" stroke="var(--muted)" stroke-width="1"/><text x="${(ox + M) / 2}" y="243" font-size="15" text-anchor="middle" fill="var(--ink)">${f8(d)} cm</text><text x="${(ix + M) / 2}" y="243" font-size="15" text-anchor="middle" fill="var(--ink)">${f8(d)} cm</text>`;
      o = L2(`Object ${f8(d)} cm in front → image <b>${f8(d)} cm behind</b> the mirror; object and image are ${f8(2 * d)} cm apart. The image is virtual (only the dashed lines reach it), erect and the same size. Move the eye: the image does not move.`,
        `বস্তু আয়নার ${f8(d)} cm সামনে → প্রতিবিম্ব আয়নার <b>${f8(d)} cm পেছনে</b>; বস্তু ও প্রতিবিম্বের দূরত্ব ${f8(2 * d)} cm। প্রতিবিম্ব অবাস্তব (শুধু ড্যাশ রেখা সেখানে পৌঁছায়), সোজা ও সমান আকারের। চোখ সরাও: প্রতিবিম্ব নড়ে না।`);
    } else {
      const H = sv(el, "c8ph", "m", 2), D = sv(el, "c8px", "m", 1), M = 215, S = 80, V = 100, floor = 225, px = M - D * S, ix = M + D * S, eyeH = H - 0.1, yy = h => floor - h * V;
      const lo = eyeH / 2, hi = (H + eyeH) / 2;
      g += ln8(0, floor, 420, floor, "var(--muted)", 2) + `<rect x="${M}" y="${yy(2.05)}" width="5" height="${2.05 * V}" fill="var(--c-soft)" stroke="var(--rule)"/>` + `<rect x="${M - 1}" y="${yy(hi)}" width="7" height="${(hi - lo) * V}" fill="var(--c)"/>`;
      const person = (x, c, dash) => `<circle cx="${x}" cy="${yy(H) + 9}" r="9" fill="none" stroke="${c}" stroke-width="2"${dash ? ' stroke-dasharray="3 3"' : ""}/>` + ln8(x, yy(H) + 18, x, yy(H * 0.48), c, 2.5, dash ? "5 4" : "") + ln8(x, yy(H * 0.48), x - 9, floor, c, 2.5, dash ? "5 4" : "") + ln8(x, yy(H * 0.48), x + 9, floor, c, 2.5, dash ? "5 4" : "") + ln8(x - 14, yy(H * 0.7), x + 14, yy(H * 0.7), c, 2.5, dash ? "5 4" : "");
      g += person(px, "var(--ink)", false) + person(ix, "var(--muted)", true);
      const E = [px + 3, yy(eyeH)];
      [[H, hi, "var(--c)"], [0, lo, "var(--note)"]].forEach(([h, m, c]) => { g += ln8(px, yy(h), M, yy(m), c, 2) + mid8(px, yy(h), M, yy(m), c, 6) + ln8(M, yy(m), E[0], E[1], c, 2) + mid8(M, yy(m), E[0], E[1], c, 6) + ln8(M, yy(m), ix, yy(h), c, 1.3, "4 4"); });
      g += `<circle cx="${E[0]}" cy="${E[1]}" r="2.5" fill="var(--bad)"/><text x="${M + 12}" y="${yy((hi + lo) / 2) + 4}" font-size="15" fill="var(--c)" font-weight="700" ${H8}>${f8(hi - lo, 2)} m</text>`;
      o = L2(`Mirror needed: from ${f8(lo, 2)} m to ${f8(hi, 2)} m above the floor, length <b>${f8(hi - lo, 2)} m = ½ × ${f8(H, 2)} m</b>. Change the distance: the needed mirror stays exactly the same.`,
        `দরকারি আয়না: মেঝে থেকে ${f8(lo, 2)} m থেকে ${f8(hi, 2)} m উচ্চতা পর্যন্ত, দৈর্ঘ্য <b>${f8(hi - lo, 2)} m = ½ × ${f8(H, 2)} m</b>। দূরত্ব বদলাও: দরকারি আয়না হুবহু একই থাকে।`);
    }
    $("#c8psv", el).innerHTML = g + `</svg>`; $("#c8po", el).innerHTML = o;
  };
  chips8(el, ".c8pm", b => { mode = b.dataset.m; build(); }); build();
};

/* 8.4 spherical mirror terms */
W.c8terms = (el) => {
  const T = [["P", L2("Pole P", "মেরু P"), L2("Pole (P): the middle point of the mirror's reflecting surface.", "মেরু (P): আয়নার প্রতিফলক তলের মধ্যবিন্দু।")],
    ["C", L2("Centre C", "বক্রতার কেন্দ্র C"), L2("Centre of curvature (C): the centre of the sphere the mirror is cut from.", "বক্রতার কেন্দ্র (C): যে গোলকের অংশ দিয়ে আয়নাটি তৈরি, তার কেন্দ্র।")],
    ["r", L2("Radius r", "ব্যাসার্ধ r"), L2("Radius of curvature (r): the radius of that sphere, the distance PC.", "বক্রতার ব্যাসার্ধ (r): সেই গোলকের ব্যাসার্ধ, অর্থাৎ PC দূরত্ব।")],
    ["ax", L2("Principal axis", "প্রধান অক্ষ"), L2("Principal axis: the straight line through the pole P and the centre of curvature C.", "প্রধান অক্ষ: মেরু P ও বক্রতার কেন্দ্র C দিয়ে যাওয়া সরলরেখা।")],
    ["F", L2("Focus F", "প্রধান ফোকাস F"), ""], ["f", L2("Focal length f", "ফোকাস দূরত্ব f"), L2("Focal length (f): the distance PF from the pole to the principal focus. f = r/2.", "ফোকাস দূরত্ব (f): মেরু থেকে প্রধান ফোকাস পর্যন্ত দূরত্ব PF। f = r/২।")]];
  el.innerHTML = `<div class="chipset c8tm" role="group"><button data-t="cc" aria-pressed="true">${L2("Concave", "অবতল")}</button><button data-t="cx" aria-pressed="false">${L2("Convex", "উত্তল")}</button></div>
  <div class="chipset c8tt" role="group">${T.map((t, i) => `<button data-k="${t[0]}" aria-pressed="${i === 4}">${t[1]}</button>`).join("")}</div><div class="svgwrap fit" id="c8tsv"></div><div class="w-out" id="c8to"></div>`;
  let type = "cc", key = "F";
  const go = () => {
    const cc = type === "cc", R = 230, Y = 120, P = cc ? 330 : 120, C = cc ? P - R : P + R, F = (P + C) / 2, th = 24 * Math.PI / 180;
    const ax = y => cc ? C + Math.sqrt(R * R - y * y) : C - Math.sqrt(R * R - y * y);
    const hl = k => key === k ? "var(--bad)" : "var(--muted)", hw = k => key === k ? 3 : 1.5;
    let g = `<svg viewBox="0 0 420 240" role="img" aria-label="${L2("spherical mirror terms", "গোলীয় আয়নার সংজ্ঞা")}">`;
    g += `<path d="M${cc ? C + R * Math.cos(th) : C - R * Math.cos(th)},${Y - R * Math.sin(th)} A${R} ${R} 0 0 ${cc ? 1 : 0} ${cc ? C + R * Math.cos(th) : C - R * Math.cos(th)},${Y + R * Math.sin(th)}" fill="none" stroke="var(--c)" stroke-width="4"/>`;
    for (let k = -5; k <= 5; k++) { const y = k * 17, x = ax(y); g += ln8(x + 2, Y + y, x + 11, Y + y + 6, "var(--muted)", 1.2); }
    g += ln8(5, Y, 415, Y, hl("ax"), hw("ax"));
    /* parallel rays */
    [-60, -30, 30, 60].forEach(h => { const hx = ax(h), c = key === "F" ? "var(--note)" : "var(--rule)", w = key === "F" ? 2 : 1.2;
      g += ln8(8, Y + h, hx, Y + h, c, w) + mid8(8, Y + h, hx, Y + h, c, 5);
      if (cc) { const [x2, y2] = far8(hx, Y + h, F, Y, 330); g += ln8(hx, Y + h, x2, y2, c, w); }
      else { const [x2, y2] = far8(F, Y, hx, Y + h, 900); g += ln8(hx, Y + h, x2, y2, c, w) + ln8(hx, Y + h, F, Y, c, 1.2, "4 4"); } });
    if (key === "r") g += ln8(P, Y, C, Y, "var(--bad)", 3) + `<text x="${(P + C) / 2}" y="${Y + 20}" font-size="16" text-anchor="middle" fill="var(--bad)" font-weight="700">r</text>`;
    if (key === "r" || key === "C") g += ln8(C, Y, ax(-80), Y - 80, key === "r" ? "var(--bad)" : "var(--muted)", 1.5, "5 4");
    if (key === "f") g += `<path d="M${P},${Y + 30} L${F},${Y + 30} M${P},${Y + 24} L${P},${Y + 36} M${F},${Y + 24} L${F},${Y + 36}" stroke="var(--bad)" stroke-width="2.5"/><text x="${(P + F) / 2}" y="${Y + 50}" font-size="16" text-anchor="middle" fill="var(--bad)" font-weight="700">f = r/2</text>`;
    [[P, "P", "P"], [C, "C", "C"], [F, "F", "F"]].forEach(([x, lab, k]) => { const on = key === k; g += `<circle cx="${x}" cy="${Y}" r="${on ? 6 : 4}" fill="${on ? "var(--bad)" : "var(--ink)"}"/><text x="${x + (lab === "P" ? (cc ? 10 : -10) : 0)}" y="${Y - 10}" font-size="17" text-anchor="${lab === "P" ? (cc ? "start" : "end") : "middle"}" fill="${on ? "var(--bad)" : "var(--ink)"}" font-weight="700">${lab}</text>`; });
    if (key === "ax") g += `<text x="10" y="${Y + 18}" font-size="15" fill="var(--bad)">${L2("principal axis", "প্রধান অক্ষ")}</text>`;
    g += `<text x="${cc ? 12 : 408}" y="${cc ? 232 : 232}" font-size="15" text-anchor="${cc ? "start" : "end"}" fill="var(--muted)">${cc ? L2("C and F in front: real focus", "C ও F সামনে: বাস্তব ফোকাস") : L2("C and F behind: virtual focus", "C ও F পেছনে: অবাস্তব ফোকাস")}</text></svg>`;
    $("#c8tsv", el).innerHTML = g;
    const t = T.find(x => x[0] === key);
    $("#c8to", el).innerHTML = key === "F" ? (cc ? L2("Principal focus (F): rays parallel to the principal axis actually <b>meet</b> here after reflecting from a concave mirror (real focus, in front).", "প্রধান ফোকাস (F): অবতল আয়নায় প্রতিফলনের পর প্রধান অক্ষের সমান্তরাল রশ্মিগুলো এখানে সত্যিই <b>মিলিত হয়</b> (বাস্তব ফোকাস, সামনে)।")
      : L2("Principal focus (F): rays parallel to the principal axis, after reflecting from a convex mirror, <b>seem to spread out from</b> this point behind the mirror (virtual focus).", "প্রধান ফোকাস (F): উত্তল আয়নায় প্রতিফলনের পর প্রধান অক্ষের সমান্তরাল রশ্মিগুলো আয়নার পেছনের এই বিন্দু থেকে <b>ছড়িয়ে আসছে বলে মনে হয়</b> (অবাস্তব ফোকাস)।")) : t[2];
  };
  chips8(el, ".c8tm", b => { type = b.dataset.t; go(); }); chips8(el, ".c8tt", b => { key = b.dataset.k; go(); }); go();
};

/* shared ray diagram for spherical mirrors (paraxial, real-is-positive signs) */
const rayDiagram8 = (el, cc) => {
  const f = cc ? 10 : -10, S = cc ? 7 : 8, Y = 125, P = cc ? 280 : 180, ho = 5, Rd = 600, id = cc ? "c8cv" : "c8xv";
  const ROWS = [["inf", L2("At infinity", "অসীম দূরে"), L2("At F", "F-এ"), L2("Real, point-sized", "বাস্তব, বিন্দুর মতো")],
    ["bC", L2("Beyond C", "C-এর বাইরে"), L2("Between F and C", "F ও C-এর মাঝে"), L2("Real, inverted, diminished", "বাস্তব, উল্টো, খর্বিত")],
    ["C", L2("At C", "C-তে"), L2("At C", "C-তে"), L2("Real, inverted, same size", "বাস্তব, উল্টো, সমান")],
    ["CF", L2("Between C and F", "C ও F-এর মাঝে"), L2("Beyond C", "C-এর বাইরে"), L2("Real, inverted, magnified", "বাস্তব, উল্টো, বিবর্ধিত")],
    ["F", L2("At F", "F-এ"), L2("At infinity", "অসীমে"), L2("No image formed", "প্রতিবিম্ব হয় না")],
    ["FP", L2("Between F and P", "F ও P-এর মাঝে"), L2("Behind the mirror", "আয়নার পেছনে"), L2("Virtual, erect, magnified", "অবাস্তব, সোজা, বিবর্ধিত")],
    ["P", L2("At P", "P-তে"), L2("At P", "P-তে"), L2("Virtual, erect, same size", "অবাস্তব, সোজা, সমান")]];
  el.innerHTML = slider(id, L2("Object distance u", "বস্তুর দূরত্ব u"), cc ? 3 : 2, cc ? 38 : 22, 0.5, cc ? 30 : 15, "cm") + `<div class="svgwrap fit" id="${id}s"></div><div class="w-out" id="${id}o"></div>` +
    (cc ? `<table id="c8tab" style="width:100%;border-collapse:collapse;font-size:13px;margin-top:10px;line-height:1.3"><tr><th style="text-align:left;padding:4px">${L2("Object", "বস্তু")}</th><th style="text-align:left;padding:4px">${L2("Image", "প্রতিবিম্ব")}</th><th style="text-align:left;padding:4px">${L2("Nature", "প্রকৃতি")}</th></tr>${ROWS.map(r => `<tr data-r="${r[0]}"><td style="padding:4px;border-top:1px solid var(--rule)">${r[1]}</td><td style="padding:4px;border-top:1px solid var(--rule)">${r[2]}</td><td style="padding:4px;border-top:1px solid var(--rule)">${r[3]}</td></tr>`).join("")}</table>` : "");
  const mx = y => cc ? P - (Rd - Math.sqrt(Rd * Rd - y * y)) : P + (Rd - Math.sqrt(Rd * Rd - y * y));
  /* intersection of the ray from (x,y) with direction (dx,dy) and the mirror */
  const hit = (x, y, dx, dy) => { let X = P; for (let k = 0; k < 3; k++) { const t = (X - x) / dx; X = mx(y + t * dy - Y); } const t = (X - x) / dx; return [X, y + t * dy]; };
  const go = () => {
    const u = sv(el, id, "cm", 1), inf = cc && u === 10, v = inf ? Infinity : 1 / (1 / f - 1 / u), m = inf ? Infinity : -v / u;
    const xo = P - u * S, yt = Y - ho * S, Fx = P - f * S, Cx = P - 2 * f * S;
    let g = `<svg viewBox="0 0 420 250" role="img" aria-label="${L2("ray diagram", "রশ্মিচিত্র")}">`;
    g += ln8(0, Y, 420, Y, "var(--rule)", 1.2);
    let ap = ""; for (let y = -105; y <= 105; y += 5) ap += `${mx(y).toFixed(1)},${Y + y} `;
    g += `<polyline points="${ap}" fill="none" stroke="var(--c)" stroke-width="4"/>`;
    for (let y = -100; y <= 100; y += 14) { const x = mx(y), s = 1; g += ln8(x + 2 * s, Y + y, x + 9 * s, Y + y + 6, "var(--muted)", 1.2); }
    [[Fx, "F"], [Cx, "C"], [P, "P"]].forEach(([x, lab]) => { g += `<circle cx="${x}" cy="${Y}" r="3.5" fill="var(--ink)"/><text x="${x + (lab === "P" ? (cc ? 8 : -8) : 0)}" y="${Y + 20}" font-size="16" text-anchor="${lab === "P" ? (cc ? "start" : "end") : "middle"}" fill="var(--ink)" font-weight="700">${lab}</text>`; });
    const c1 = "var(--note)", c2 = "var(--c)";
    /* ray 1: parallel to the axis */
    const [h1x, h1y] = hit(xo, yt, 1, 0);
    g += ln8(xo, yt, h1x, h1y, c1, 2) + mid8(xo, yt, h1x, h1y, c1, 6);
    if (cc) { const [ex, ey] = far8(h1x, h1y, Fx, Y); g += ln8(h1x, h1y, ex, ey, c1, 2) + mid8(h1x, h1y, Fx, Y, c1, 6, 0.6); }
    else { const [ex, ey] = far8(Fx, Y, h1x, h1y, 900); g += ln8(h1x, h1y, ex, ey, c1, 2) + mid8(h1x, h1y, h1x - 60, h1y - 60 * (Y - h1y) / (Fx - h1x), c1, 6) + ln8(h1x, h1y, Fx, Y, c1, 1.3, "5 4"); }
    /* ray 2: along the line through C (or through F when the object is at C) */
    let ray2 = "C";
    if (cc && Math.abs(xo - Cx) < 5) ray2 = "F";
    if (ray2 === "C") { const dx = cc ? (xo < Cx ? Cx - xo : xo - Cx) : Cx - xo, dy = cc ? (xo < Cx ? Y - yt : yt - Y) : Y - yt, n = Math.hypot(dx, dy);
      const [h2x, h2y] = hit(xo, yt, dx / n, dy / n); g += ln8(xo, yt, h2x, h2y, c2, 2) + mid8(xo, yt, h2x, h2y, c2, 6);
      const [ex, ey] = far8(h2x, h2y, h2x - dx, h2y - dy, 900); g += ln8(h2x, h2y, ex, ey, c2, 2) + mid8(h2x, h2y, h2x - dx / n * 60, h2y - dy / n * 60, c2, 6);
      if (!cc) g += ln8(h2x, h2y, Cx, Y, c2, 1.3, "5 4");
      else if (v < 0) { const ix = P - v * S, iy = Y - m * ho * S; g += ln8(h2x, h2y, ix, iy, c2, 1.3, "5 4"); } }
    else { const dx = Fx - xo, dy = Y - yt, n = Math.hypot(dx, dy); const [h2x, h2y] = hit(xo, yt, dx / n, dy / n);
      g += ln8(xo, yt, h2x, h2y, c2, 2) + mid8(xo, yt, h2x, h2y, c2, 6) + ln8(h2x, h2y, -10, h2y, c2, 2) + mid8(h2x, h2y, h2x - 60, h2y, c2, 6); }
    if (cc && v < 0 && isFinite(v)) { const ix = P - v * S, iy = Y - m * ho * S; g += ln8(h1x, h1y, ix, iy, c1, 1.3, "5 4"); }
    /* object and image arrows */
    const arrow = (x, y0, y1, col, dash) => { const s = y1 < y0 ? 1 : -1; return ln8(x, y0, x, y1, col, 3, dash) + `<path d="M${x - 6},${y1 + 9 * s} L${x},${y1} L${x + 6},${y1 + 9 * s}" fill="none" stroke="${col}" stroke-width="3"/>`; };
    g += arrow(xo, Y, yt, "var(--ink)", "") + (xo > 70 ? `<text x="${xo - 7}" y="${yt + 14}" font-size="15" text-anchor="end" fill="var(--ink)" ${H8}>${L2("object", "বস্তু")}</text>` : `<text x="${xo < 40 ? xo - 4 : xo}" y="${Y + 20}" font-size="15" text-anchor="${xo < 40 ? "start" : "middle"}" fill="var(--ink)" ${H8}>${L2("object", "বস্তু")}</text>`);
    const ix = P - v * S, iy = Y - m * ho * S;
    if (isFinite(v) && ix > 8 && ix < 412) { const real = v > 0, anc = ix < 45 ? "start" : ix > 375 ? "end" : "middle", lx = ix < 45 ? ix + 4 : ix > 375 ? ix - 4 : ix; g += arrow(ix, Y, iy, "var(--bad)", real ? "" : "6 4") + `<text x="${lx}" y="${iy < Y ? Math.max(14, iy - 8) : Math.min(246, iy + 18)}" font-size="15" text-anchor="${anc}" fill="var(--bad)" ${H8}>${L2("image", "প্রতিবিম্ব")}</text>`; }
    else if (!inf) g += `<text x="${v > 0 ? 8 : 412}" y="20" font-size="15" text-anchor="${v > 0 ? "start" : "end"}" fill="var(--bad)">${v > 0 ? "← " : ""}${L2("image off the picture", "প্রতিবিম্ব ছবির বাইরে")}${v > 0 ? "" : " →"}</text>`;
    g += `</svg>`; $("#" + id + "s", el).innerHTML = g;
    /* result */
    let o;
    if (inf) o = L2(`u = f = 10 cm: 1/v = 1/10 − 1/10 = 0, so the reflected rays are <b>parallel</b>. The image is at infinity (no image forms).`, `u = f = ১০ cm: ১/v = ১/১০ − ১/১০ = ০, তাই প্রতিফলিত রশ্মিগুলো <b>সমান্তরাল</b>। প্রতিবিম্ব অসীমে (কোনো প্রতিবিম্ব হয় না)।`);
    else { const am = Math.abs(m), size = Math.abs(am - 1) < 0.005 ? L2("same size", "সমান আকার") : am > 1 ? L2("magnified", "বিবর্ধিত") : L2("diminished", "খর্বিত"), real = v > 0;
      const nat = real ? L2("real, inverted", "বাস্তব, উল্টো") : L2("virtual, erect", "অবাস্তব, সোজা");
      o = L2(`u = ${f8(u)} cm, f = ${cc ? "+" : "−"}10 cm → 1/v = 1/f − 1/u → <b>v = ${real ? "+" : ""}${f8(v)} cm</b> (${real ? "in front of the mirror" : f8(-v) + " cm behind the mirror"}).<br>m = |v| ÷ u = ${f8(am, 2)} → <b>${nat}, ${size}</b>.`,
        `u = ${f8(u)} cm, f = ${cc ? "+" : "−"}১০ cm → ১/v = ১/f − ১/u → <b>v = ${real ? "+" : ""}${f8(v)} cm</b> (${real ? "আয়নার সামনে" : "আয়নার " + f8(-v) + " cm পেছনে"})।<br>m = |v| ÷ u = ${f8(am, 2)} → <b>${nat}, ${size}</b>।`);
      if (!cc) o += L2(` The image always lies between P and F (F is 10 cm behind).`, ` প্রতিবিম্ব সবসময় P ও F-এর মাঝে থাকে (F আয়নার ১০ cm পেছনে)।`); }
    $("#" + id + "o", el).innerHTML = o;
    if (cc) { const r = u > 20 ? "bC" : u === 20 ? "C" : u > 10 ? "CF" : u === 10 ? "F" : "FP";
      el.querySelectorAll("#c8tab tr[data-r]").forEach(tr => { const on = tr.dataset.r === r; tr.style.background = on ? "var(--c-soft)" : ""; tr.style.fontWeight = on ? "700" : ""; }); }
  };
  $("#" + id, el).addEventListener("input", go); go();
};
W.c8convex = (el) => rayDiagram8(el, false);
W.c8concave = (el) => rayDiagram8(el, true);

/* 8.7 magnification of a concave mirror vs object distance */
W.c8mag = (el) => {
  el.innerHTML = slider("c8mu", L2("Object distance u (f = 10 cm)", "বস্তুর দূরত্ব u (f = ১০ cm)"), 1, 50, 0.5, 15, "cm") + `<div class="svgwrap fit" id="c8msv"></div><div class="w-out" id="c8mo"></div>`;
  const f = 10, gx = u => 42 + u / 50 * 250, gy = m => 190 - Math.min(m, 6) / 6 * 165;
  const go = () => {
    const u = sv(el, "c8mu", "cm", 1), inf = u === f, v = inf ? Infinity : 1 / (1 / f - 1 / u), m = inf ? Infinity : Math.abs(v) / u;
    let g = `<svg viewBox="0 0 420 225" role="img" aria-label="${L2("magnification graph", "বিবর্ধনের লেখচিত্র")}">`;
    g += ln8(42, 190, 296, 190, "var(--muted)", 1.2) + ln8(42, 20, 42, 190, "var(--muted)", 1.2);
    [0, 1, 2, 3, 4, 5, 6].forEach(k => { g += `<text x="36" y="${gy(k) + 4}" font-size="14" text-anchor="end" fill="var(--muted)">${B8(k)}</text>`; });
    [0, 10, 20, 30, 40, 50].forEach(k => { g += `<text x="${gx(k)}" y="206" font-size="14" text-anchor="middle" fill="var(--muted)">${B8(k)}</text>`; });
    g += `<text x="296" y="221" font-size="14" text-anchor="end" fill="var(--muted)">u (cm)</text><text x="48" y="16" font-size="15" fill="var(--muted)">m</text>`;
    g += ln8(42, gy(1), 296, gy(1), "var(--rule)", 1, "4 4") + ln8(gx(10), 20, gx(10), 190, "var(--rule)", 1, "4 4") + `<text x="${gx(10) + 4}" y="184" font-size="15" fill="var(--ink)">F</text><circle cx="${gx(20)}" cy="${gy(1)}" r="4" fill="var(--ink)"/><text x="${gx(20) + 4}" y="${gy(1) - 7}" font-size="15" fill="var(--ink)">C</text>`;
    [[1, 9.6, "var(--c)"], [10.4, 50, "var(--bad)"]].forEach(([a, b, c]) => { let p = ""; for (let x = a; x <= b + 1e-9; x += 0.1) { const mm = f / Math.abs(x - f); if (mm <= 6.2) p += `${gx(x).toFixed(1)},${gy(mm).toFixed(1)} `; } g += `<polyline points="${p}" fill="none" stroke="${c}" stroke-width="2.5"/>`; });
    if (!inf) g += `<circle cx="${gx(u)}" cy="${gy(m)}" r="6" fill="var(--ink)" stroke="var(--paper)" stroke-width="2"/>`;
    /* height bars */
    const base = 105, k = 26, real = v > 0;
    g += ln8(308, base, 416, base, "var(--rule)", 1);
    const arr = (x, h, col, dash) => { const s = h > 0 ? 1 : -1, cl = Math.max(-92, Math.min(92, h)), yy = base - cl; return ln8(x, base, x, yy, col, 4, dash) + (Math.abs(h) <= 92 ? `<path d="M${x - 6},${yy + 9 * s} L${x},${yy} L${x + 6},${yy + 9 * s}" fill="none" stroke="${col}" stroke-width="3"/>` : `<text x="${x}" y="${yy - 4 * s + (s < 0 ? 10 : 0)}" font-size="15" text-anchor="middle" fill="${col}">…</text>`); };
    g += arr(335, k, "var(--ink)", "");
    g += `<text x="335" y="${base - k - 8}" font-size="14" text-anchor="middle" fill="var(--ink)">l</text>`;
    if (!inf) g += arr(390, real ? -m * k : m * k, "var(--bad)", real ? "" : "5 3") + `<text x="390" y="${real ? Math.min(218, base + Math.min(92, m * k) + 16) : Math.max(12, base - Math.min(92, m * k) - 8)}" font-size="14" text-anchor="middle" fill="var(--bad)">l′</text>`;
    g += `</svg>`; $("#c8msv", el).innerHTML = g;
    let o;
    if (inf) o = L2("u = f: the reflected rays are parallel, the image is at infinity, and m has no finite value.", "u = f: প্রতিফলিত রশ্মি সমান্তরাল, প্রতিবিম্ব অসীমে, তাই m-এর কোনো নির্দিষ্ট মান নেই।");
    else { const size = Math.abs(m - 1) < 0.005 ? L2("same size", "সমান আকার") : m > 1 ? L2("magnified", "বিবর্ধিত") : L2("diminished", "খর্বিত");
      o = L2(`u = ${f8(u)} cm → |v| = ${f8(Math.abs(v))} cm (${real ? "real, inverted" : "virtual, erect"}).<br>m = v/u = ${f8(Math.abs(v))} ÷ ${f8(u)} = <b>${f8(m, 2)}</b> → ${size}.`,
        `u = ${f8(u)} cm → |v| = ${f8(Math.abs(v))} cm (${real ? "বাস্তব, উল্টো" : "অবাস্তব, সোজা"})।<br>m = v/u = ${f8(Math.abs(v))} ÷ ${f8(u)} = <b>${f8(m, 2)}</b> → ${size}।`); }
    $("#c8mo", el).innerHTML = o;
  };
  $("#c8mu", el).addEventListener("input", go); go();
};

/* 8.8 uses of mirrors */
W.c8uses = (el) => {
  const SC = [["lat", L2("Lateral inversion", "পার্শ্বীয় পরিবর্তন")], ["peri", L2("Periscope", "পেরিস্কোপ")], ["rear", L2("Rear-view mirror", "রিয়ার-ভিউ আয়না")], ["torch", L2("Torch / searchlight", "টর্চ / সার্চলাইট")], ["hill", L2("Hill-road turn", "পাহাড়ি রাস্তার বাঁক")]];
  el.innerHTML = `<div class="chipset c8us" role="group">${SC.map((s, i) => `<button data-s="${s[0]}" aria-pressed="${i === 0}">${s[1]}</button>`).join("")}</div><div id="c8uin"></div><div class="svgwrap fit" id="c8usv"></div><div class="w-out" id="c8uo"></div>`;
  let sc = "lat";
  const build = () => { $("#c8uin", el).innerHTML = sc === "torch" ? slider("c8ub", L2("Bulb distance from the mirror (f = 8 cm)", "আয়না থেকে বাল্বের দূরত্ব (f = ৮ cm)"), 4, 14, 0.5, 8, "cm") : "";
    const i = $("#c8ub", el); if (i) i.addEventListener("input", go); go(); };
  const go = () => {
    let g = `<svg viewBox="0 0 420 230" role="img" aria-label="${L2("uses of mirrors", "আয়নার ব্যবহার")}">`, o = "";
    if (sc === "lat") {
      g += `<rect x="10" y="40" width="185" height="110" rx="10" fill="var(--paper)" stroke="var(--muted)"/><text x="102" y="30" font-size="15" text-anchor="middle" fill="var(--muted)">${L2("Written on the ambulance", "অ্যাম্বুলেন্সের সামনে লেখা")}</text>`;
      g += `<text transform="translate(102,103) scale(-1,1)" font-size="24" font-weight="700" text-anchor="middle" fill="var(--bad)">AMBULANCE</text>`;
      g += `<rect x="207" y="30" width="6" height="130" fill="var(--c-soft)" stroke="var(--c)"/><text x="210" y="178" font-size="15" text-anchor="middle" fill="var(--c)">${L2("mirror", "আয়না")}</text>`;
      g += `<rect x="225" y="40" width="185" height="110" rx="10" fill="var(--paper)" stroke="var(--muted)"/><text x="318" y="30" font-size="15" text-anchor="middle" fill="var(--muted)">${L2("Seen in the mirror", "আয়নায় দেখা")}</text><text x="318" y="103" font-size="24" font-weight="700" text-anchor="middle" fill="var(--bad)">AMBULANCE</text>`;
      g += `<text transform="translate(80,210) scale(-1,1)" font-size="30" font-weight="700" text-anchor="middle" fill="var(--ink)">R</text><text x="130" y="210" font-size="22" text-anchor="middle" fill="var(--muted)">→</text>`;
      g += `<text x="290" y="210" font-size="22" text-anchor="middle" fill="var(--muted)">←</text><text x="340" y="210" font-size="30" font-weight="700" text-anchor="middle" fill="var(--ink)">R</text>`;
      o = L2("A plane mirror swaps left and right (lateral inversion). So AMBULANCE is painted back-to-front: in the rear-view mirror of the car ahead it reads correctly. Two mirrors at 90° reflect twice and keep left and right unchanged.", "সমতল আয়না ডান-বাম উল্টে দেয় (পার্শ্বীয় পরিবর্তন)। তাই AMBULANCE লেখাটি উল্টো করে লেখা হয়: সামনের গাড়ির রিয়ার-ভিউ আয়নায় সেটি ঠিকভাবে পড়া যায়। ৯০° কোণে রাখা দুটি আয়না দুবার প্রতিফলিত করে ডান-বাম অপরিবর্তিত রাখে।");
    } else if (sc === "peri") {
      g += `<rect x="75" y="80" width="55" height="140" fill="var(--c-soft)" stroke="var(--muted)"/><text x="102" y="160" font-size="15" text-anchor="middle" fill="var(--muted)">${L2("wall", "দেয়াল")}</text>`;
      g += `<path d="M185,40 L185,30 L215,30 L215,182 M185,74 L185,222 L215,222 L215,214" fill="none" stroke="var(--ink)" stroke-width="2.5"/>`;
      g += ln8(186, 42, 214, 70, "var(--c)", 5) + ln8(186, 184, 214, 212, "var(--c)", 5);
      g += `<path d="M28,56 l0,-26 l18,8 l-18,8" fill="var(--bad)" stroke="var(--ink)" stroke-width="1.5"/>` + ln8(28, 30, 28, 220, "var(--ink)", 2);
      const c = "var(--note)"; g += ln8(30, 56, 200, 56, c, 2.5) + mid8(30, 56, 200, 56, c, 7) + ln8(200, 56, 200, 198, c, 2.5) + mid8(200, 56, 200, 198, c, 7) + ln8(200, 198, 318, 198, c, 2.5) + mid8(200, 198, 318, 198, c, 7) + eye8(330, 198);
      g += `<text x="232" y="62" font-size="15" fill="var(--c)">45°</text><text x="232" y="190" font-size="15" fill="var(--c)">45°</text>`;
      o = L2("Two plane mirrors at 45°, one above the other: light from the flag turns down at the top mirror and turns again towards the eye at the bottom mirror. You see over the wall without raising your head.", "একটির ওপরে আরেকটি ৪৫° কোণে রাখা দুটি সমতল আয়না: পতাকার আলো ওপরের আয়নায় নিচে বাঁকে, নিচের আয়নায় আবার চোখের দিকে বাঁকে। মাথা না তুলেই দেয়ালের ওপারে দেখা যায়।");
    } else if (sc === "rear") {
      [[105, false], [315, true]].forEach(([cx, cvx]) => { const ey = 150, E = [cx, ey], M = 40; let edges, draw;
        if (!cvx) { edges = [[cx - 30, M, 0, 1], [cx + 30, M, 0, 1]]; draw = ln8(cx - 30, M, cx + 30, M, "var(--c)", 5); }
        else { const R = 95, Cy = M - R; edges = [-1, 1].map(s => { const x = cx + 30 * s, y = Cy + Math.sqrt(R * R - 900); return [x, y, (x - cx) / R, (y - Cy) / R]; }); draw = `<path d="M${cx - 30},${edges[0][1]} A${R} ${R} 0 0 0 ${cx + 30},${edges[1][1]}" fill="none" stroke="var(--c)" stroke-width="5"/>`; }
        const ends = edges.map(([x, y, nx, ny]) => { const dx = x - E[0], dy = y - E[1], n = Math.hypot(dx, dy); const [rx, ry] = refl8(dx / n, dy / n, nx, ny); return [x, y, x + rx * 400, y + ry * 400]; });
        const cid = "c8cl" + (cvx ? 1 : 0); g += `<clipPath id="${cid}"><rect x="${cx - 105}" y="0" width="210" height="230"/></clipPath><g clip-path="url(#${cid})">`;
        g += `<path d="M${ends[0][0]},${ends[0][1]} L${ends[0][2]},${ends[0][3]} L${ends[1][2]},${ends[1][3]} L${ends[1][0]},${ends[1][1]} z" fill="var(--note)" opacity=".2"/>`;
        ends.forEach(([x, y, x2, y2]) => { g += ln8(E[0], E[1], x, y, "var(--muted)", 1.2, "4 3") + ln8(x, y, x2, y2, "var(--note)", 2); }); g += `</g>`;
        g += draw + eye8(E[0], E[1] - 2) + `<text x="${cx}" y="20" font-size="16" text-anchor="middle" fill="var(--ink)" font-weight="700">${cvx ? L2("Convex", "উত্তল") : L2("Plane", "সমতল")}</text><text x="${cx}" y="222" font-size="15" text-anchor="middle" fill="var(--muted)">${cvx ? L2("wide view behind", "পেছনের বড় এলাকা") : L2("narrow view behind", "পেছনের সরু এলাকা")}</text>`; });
      g += ln8(210, 10, 210, 225, "var(--rule)", 1);
      o = L2("Seen from above. For the same mirror width, the convex mirror spreads the lines of sight over a much wider area behind the driver (shaded). Things look smaller, but far more of the road fits in.", "ওপর থেকে দেখা ছবি। একই চওড়া আয়নায় উত্তল আয়না চালকের পেছনের অনেক বড় এলাকা (ছায়া দেওয়া অংশ) দেখায়। জিনিস ছোট দেখায়, কিন্তু রাস্তার অনেক বেশি অংশ ধরা পড়ে।");
    } else if (sc === "torch") {
      const u = sv(el, "c8ub", "cm", 1), f = 8, S = 10, R = 2 * f * S, Y = 115, Cx = 40 + R, Fx = 40 + f * S, bx = 40 + u * S, v = u === f ? Infinity : 1 / (1 / f - 1 / u), vx = 40 + v * S;
      const th = 34 * Math.PI / 180;
      g += `<path d="M${Cx - R * Math.cos(th)},${Y - R * Math.sin(th)} A${R} ${R} 0 0 0 ${Cx - R * Math.cos(th)},${Y + R * Math.sin(th)}" fill="none" stroke="var(--c)" stroke-width="5"/>` + ln8(0, Y, 420, Y, "var(--rule)", 1, "4 4");
      [-28, -18, -9, 9, 18, 28].forEach(a => { const t = a * Math.PI / 180, hx = Cx - R * Math.cos(t), hy = Y + R * Math.sin(t);
        g += ln8(bx, Y, hx, hy, "var(--note)", 1.8) + mid8(bx, Y, hx, hy, "var(--note)", 5);
        let ex, ey; if (!isFinite(v)) { ex = 420; ey = hy; } else if (v > 0) { [ex, ey] = far8(hx, hy, vx, Y, 600); } else { [ex, ey] = far8(vx, Y, hx, hy, 900); }
        g += ln8(hx, hy, ex, ey, "var(--note)", 1.8) + mid8(hx, hy, hx + 80, hy + (ey - hy) * 80 / (ex - hx), "var(--note)", 5); });
      g += `<circle cx="${Fx}" cy="${Y}" r="3" fill="var(--ink)"/><text x="${Fx}" y="${Y + 34}" font-size="16" text-anchor="middle" fill="var(--ink)" font-weight="700">F</text><circle cx="${bx}" cy="${Y}" r="8" fill="var(--note)" stroke="var(--ink)"/>`;
      o = u === f ? L2("The bulb is exactly at the focus: every reflected ray leaves <b>parallel</b> to the axis, giving a strong straight beam that stays bright far away.", "বাল্ব ঠিক ফোকাসে: প্রতিটি প্রতিফলিত রশ্মি অক্ষের <b>সমান্তরাল</b> হয়ে বের হয়, তাই জোরালো সোজা আলোকরশ্মিগুচ্ছ তৈরি হয়, যা দূরেও উজ্জ্বল থাকে।")
        : u < f ? L2("The bulb is inside the focus: the reflected rays <b>spread out</b>, so the beam gets weak quickly. Move the bulb to F.", "বাল্ব ফোকাসের ভেতরে: প্রতিফলিত রশ্মি <b>ছড়িয়ে পড়ে</b>, তাই আলো দ্রুত দুর্বল হয়। বাল্বটি F-এ আনো।")
        : L2("The bulb is beyond the focus: the reflected rays <b>converge</b> to a point and then spread out again. Move the bulb to F.", "বাল্ব ফোকাসের বাইরে: প্রতিফলিত রশ্মি একটি বিন্দুতে <b>মিলিত হয়ে</b> আবার ছড়িয়ে পড়ে। বাল্বটি F-এ আনো।");
    } else {
      g += `<rect x="0" y="0" width="420" height="230" fill="var(--c-soft)" opacity=".35"/><path d="M0,40 L300,40 L300,230 L240,230 L240,95 L0,95 z" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.5"/>`;
      g += `<path d="M0,95 L240,95 L240,230 L0,230 z" fill="var(--good-soft)" stroke="var(--good)"/><text x="115" y="170" font-size="17" text-anchor="middle" fill="var(--good)" font-weight="700">${L2("Hill", "পাহাড়")}</text>`;
      const A = [270, 200], B = [45, 67], M = [322, 22];
      const u1 = [B[0] - M[0], B[1] - M[1]], u2 = [A[0] - M[0], A[1] - M[1]], n1 = Math.hypot(...u1), n2 = Math.hypot(...u2), nx = u1[0] / n1 + u2[0] / n2, ny = u1[1] / n1 + u2[1] / n2, nn = Math.hypot(nx, ny), tx = -ny / nn, ty = nx / nn;
      g += ln8(M[0] - tx * 24, M[1] - ty * 24, M[0] + tx * 24, M[1] + ty * 24, "var(--c)", 5);
      g += `<rect x="${A[0] - 9}" y="${A[1] - 14}" width="18" height="28" rx="4" fill="var(--c)"/><rect x="${B[0] - 14}" y="${B[1] - 9}" width="28" height="18" rx="4" fill="var(--bad)"/>`;
      g += ln8(B[0] + 14, B[1], M[0], M[1], "var(--note)", 2.5) + mid8(B[0], B[1], M[0], M[1], "var(--note)", 7) + ln8(M[0], M[1], A[0], A[1] - 16, "var(--note)", 2.5) + mid8(M[0], M[1], A[0], A[1], "var(--note)", 7);
      g += ln8(B[0], B[1], A[0], A[1], "var(--bad)", 1.5, "4 4") + `<text x="${(B[0] + A[0]) / 2 - 20}" y="${(B[1] + A[1]) / 2 + 5}" font-size="18" fill="var(--bad)" font-weight="700">✗</text>`;
      g += `<text x="${A[0] + 14}" y="${A[1] + 5}" font-size="16" fill="var(--c)" font-weight="700">A</text><text x="${B[0]}" y="${B[1] - 14}" font-size="16" text-anchor="middle" fill="var(--bad)" font-weight="700">B</text><text x="${M[0] - 30}" y="${M[1] + 4}" font-size="15" text-anchor="end" fill="var(--c)">${L2("mirror ≈ 45°", "আয়না ≈ ৪৫°")}</text>`;
      o = L2("Top view of a sharp, nearly 90° bend. The hill blocks the direct view (red dashes), but light from car B reflects from the mirror at the corner into the eyes of driver A, and the other way round. The book describes a plane mirror at 45°; real roads often use convex mirrors for a wider view.", "প্রায় ৯০° তীক্ষ্ণ বাঁকের ওপর থেকে দেখা ছবি। পাহাড় সরাসরি দেখা আটকে দেয় (লাল ড্যাশ), কিন্তু গাড়ি B-এর আলো কোনার আয়নায় প্রতিফলিত হয়ে চালক A-এর চোখে আসে, উল্টোটাও ঘটে। বইয়ে ৪৫° কোণে সমতল আয়নার কথা আছে; বাস্তবে বড় এলাকা দেখতে প্রায়ই উত্তল আয়না লাগানো হয়।");
    }
    $("#c8usv", el).innerHTML = g + `</svg>`; $("#c8uo", el).innerHTML = o;
  };
  chips8(el, ".c8us", b => { sc = b.dataset.s; build(); }); build();
};
