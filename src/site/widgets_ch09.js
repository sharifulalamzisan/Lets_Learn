/* ---- chapter 9 widgets: refraction of light ---- */
const B9 = x => bnNum(x, LANG);
const f9 = (x, d = 1) => bnNum((+x).toFixed(d), LANG).replace(/^-/, "−");
const chips9 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const ln9 = (x1, y1, x2, y2, col, w = 2, dash = "", op = 1) => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}${op < 1 ? ` opacity="${op.toFixed(2)}"` : ""} stroke-linecap="round"/>`;
const mid9 = (x1, y1, x2, y2, col, s = 7, at = 0.5, op = 1) => { const a = Math.atan2(y2 - y1, x2 - x1), x = x1 + (x2 - x1) * at, y = y1 + (y2 - y1) * at;
  const p = (da, r) => `${(x + r * Math.cos(a + da)).toFixed(1)},${(y + r * Math.sin(a + da)).toFixed(1)}`;
  return `<path d="M${p(0, s)} L${p(2.6, s)} L${p(-2.6, s)} z" fill="${col}"${op < 1 ? ` opacity="${op.toFixed(2)}"` : ""}/>`; };
const far9 = (x1, y1, x2, y2, L = 900) => { const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1; return [x1 + dx / n * L, y1 + dy / n * L]; };
const H9 = `paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"`;
const R9 = Math.PI / 180;
const svgPt9 = (wrap, e, W) => { const s = wrap.querySelector("svg"), r = s.getBoundingClientRect(), k = W / r.width; return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]; };
/* average (unpolarised) Fresnel reflectance; 1 for total internal reflection */
const fres9 = (n1, n2, t1) => { const s2 = n1 / n2 * Math.sin(t1); if (s2 >= 1) return 1; const ci = Math.cos(t1), ct = Math.sqrt(1 - s2 * s2);
  const rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct), rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci); return (rs * rs + rp * rp) / 2; };
const MED9 = () => [["air", L2("Air", "বাতাস"), 1.00], ["water", L2("Water", "পানি"), 1.33], ["glass", L2("Glass", "কাচ"), 1.52], ["dia", L2("Diamond", "হীরা"), 2.42]];
const tint9 = n => (0.08 + (n - 1) * 0.35).toFixed(2);
/* angle arc measured from a vertical normal: dir = -1 (up) or +1 (down), side = -1 (left) or +1 (right) */
const arc9 = (Ox, Oy, r, a, dir, side) => { const x2 = Ox + side * r * Math.sin(a), y2 = Oy + dir * r * Math.cos(a), sw = (dir === -1) === (side === -1) ? 0 : 1;
  return `M${Ox},${Oy + dir * r} A${r} ${r} 0 0 ${sw} ${x2.toFixed(1)},${y2.toFixed(1)}`; };

/* 9.1 speed of light in different media */
W.c9speed = (el) => {
  const PRE = [["vac", L2("Vacuum", "শূন্যস্থান"), 1.00], ["air", L2("Air", "বাতাস"), 1.00], ["water", L2("Water", "পানি"), 1.33], ["glass", L2("Glass", "কাচ"), 1.52], ["dia", L2("Diamond", "হীরা"), 2.42]];
  el.innerHTML = `<div class="chipset c9sp" role="group">${PRE.map((p, i) => `<button data-n="${p[2]}" data-k="${p[0]}" aria-pressed="${i === 2}">${p[1]}</button>`).join("")}</div>` +
    slider("c9sn", L2("Refractive index n", "প্রতিসরণাঙ্ক n"), 1, 2.5, 0.01, 1.33, "") + `<div class="svgwrap fit" id="c9ssv"></div><div class="w-out" id="c9so"></div>`;
  const X0 = 30, X1 = 390, T = 3.2; let n = 1.33, name = L2("Water", "পানি");
  const pulse = (id, col) => `<g id="${id}"><line x1="-26" y1="0" x2="-4" y2="0" stroke="${col}" stroke-width="5" stroke-linecap="round"/><path d="M0,0 L-11,-7 L-11,7 z" fill="${col}"/></g>`;
  const build = () => {
    n = sv(el, "c9sn", "", 2);
    let g = `<svg viewBox="0 0 420 200" role="img" aria-label="${L2("light racing in vacuum and in a medium", "শূন্যস্থান ও মাধ্যমে আলোর দৌড়")}">`;
    g += `<rect x="${X0}" y="118" width="${X1 - X0}" height="44" rx="6" fill="var(--c)" opacity="${tint9(n)}"/><rect x="${X0}" y="38" width="${X1 - X0}" height="44" rx="6" fill="none" stroke="var(--rule)"/>`;
    g += `<text x="${X0}" y="30" font-size="15" fill="var(--ink)" font-weight="700">${L2("Vacuum", "শূন্যস্থান")} (n = ${B9(1)})</text><text x="${X0}" y="110" font-size="15" fill="var(--ink)" font-weight="700">${name} (n = ${f9(n, 2)})</text>`;
    for (let k = 0; k <= 30; k += 5) { const x = X0 + k / 30 * (X1 - X0); g += ln9(x, 172, x, 178, "var(--muted)", 1.2) + `<text x="${x}" y="194" font-size="13" text-anchor="middle" fill="var(--muted)">${B9(k)}</text>`; }
    g += `<text x="${X0 - 8}" y="194" font-size="13" text-anchor="end" fill="var(--muted)">cm</text>`;
    const xe = X0 + (X1 - X0) / n; g += ln9(xe, 114, xe, 166, "var(--bad)", 1.5, "4 3") + ln9(X1, 34, X1, 86, "var(--c)", 1.5, "4 3");
    g += pulse("c9p0", "var(--c)") + pulse("c9p1", "var(--bad)") + `</svg>`;
    $("#c9ssv", el).innerHTML = g; place(REDUCED ? T : 0);
    const v = 3 / n;
    $("#c9so", el).innerHTML = L2(`v = c ÷ n = 3 × 10⁸ ÷ ${f9(n, 2)} = <b>${f9(v, 2)} × 10⁸ m/s</b>. In 1 nanosecond light goes 30 cm in vacuum but only <b>${f9(30 / n, 1)} cm</b> here${n > 1.001 ? ` (${f9(n, 2)} times slower)` : ""}.`,
      `v = c ÷ n = ৩ × ১০⁸ ÷ ${f9(n, 2)} = <b>${f9(v, 2)} × ১০⁸ m/s</b>। ১ ন্যানোসেকেন্ডে আলো শূন্যস্থানে ৩০ cm যায়, কিন্তু এখানে মাত্র <b>${f9(30 / n, 1)} cm</b>${n > 1.001 ? ` (${f9(n, 2)} গুণ ধীর)` : ""}।`);
  };
  const place = (t) => { const s = Math.min(1, (t % (T + 0.8)) / T), a = $("#c9p0", el), b = $("#c9p1", el); if (!a || !b) return;
    a.setAttribute("transform", `translate(${(X0 + 12 + s * (X1 - X0 - 12)).toFixed(1)},60)`); b.setAttribute("transform", `translate(${(X0 + 12 + s * (X1 - X0) / n - 12 * s / n).toFixed(1)},140)`); };
  chips9(el, ".c9sp", b => { $("#c9sn", el).value = b.dataset.n; name = b.textContent; build(); });
  $("#c9sn", el).addEventListener("input", () => { const v = +$("#c9sn", el).value; let hit = null;
    el.querySelectorAll(".c9sp button").forEach(b => { const on = !hit && Math.abs(+b.dataset.n - v) < 0.005 && b.dataset.k !== "vac"; if (on) hit = b; b.setAttribute("aria-pressed", on); });
    name = hit ? hit.textContent : L2("Your medium", "তোমার মাধ্যম"); build(); });
  build();
  if (!REDUCED) animate(el, place);
};

/* 9.1.1 Snell's law between two chosen media */
W.c9snell = (el) => {
  const ch = (cls, sel) => `<div class="chipset ${cls}" role="group">${MED9().map((m, i) => `<button data-i="${i}" aria-pressed="${i === sel}">${m[1]}</button>`).join("")}</div>`;
  el.innerHTML = `<p class="hint" style="margin:0 0 4px">${L2("Top medium (light comes from here)", "ওপরের মাধ্যম (আলো এখান থেকে আসে)")}</p>${ch("c9s1", 0)}<p class="hint" style="margin:6px 0 4px">${L2("Bottom medium", "নিচের মাধ্যম")}</p>${ch("c9s2", 2)}` +
    slider("c9si", L2("Angle of incidence θ₁", "আপতন কোণ θ₁"), 0, 89, 1, 40, "°") + `<div class="svgwrap fit" id="c9nsv"></div><div class="w-out" id="c9no"></div><p class="hint">${L2("Tip: you can also drag the round handle on the incident ray.", "টিপস: আপতিত রশ্মির গোল হাতলটি টেনেও কোণ বদলাতে পারো।")}</p>`;
  let a = 0, b = 2; const Ox = 210, Oy = 140, L = 128, wrap = $("#c9nsv", el);
  const go = () => {
    const M = MED9(), t1d = sv(el, "c9si", "°", 0), t1 = t1d * R9, n1 = M[a][2], n2 = M[b][2], s2 = n1 / n2 * Math.sin(t1), tir = s2 > 1, t2 = tir ? 0 : Math.asin(s2), R = fres9(n1, n2, t1);
    let g = `<svg viewBox="0 0 420 280" role="img" aria-label="${L2("refraction at a boundary", "বিভেদতলে প্রতিসরণ")}">`;
    g += `<rect x="0" y="0" width="420" height="${Oy}" fill="var(--c)" opacity="${tint9(n1)}"/><rect x="0" y="${Oy}" width="420" height="${280 - Oy}" fill="var(--c)" opacity="${tint9(n2)}"/>` + ln9(0, Oy, 420, Oy, "var(--c)", 2);
    g += `<text x="8" y="22" font-size="15" fill="var(--ink)" ${H9}>${M[a][1]} n₁ = ${f9(n1, 2)}</text><text x="8" y="270" font-size="15" fill="var(--ink)" ${H9}>${M[b][1]} n₂ = ${f9(n2, 2)}</text>`;
    g += ln9(Ox, 12, Ox, 268, "var(--muted)", 1.5, "5 4") + `<text x="${Ox + 5}" y="${Oy - 112}" font-size="14" fill="var(--muted)" ${H9}>${L2("normal", "অভিলম্ব")}</text>`;
    const Ax = Ox - L * Math.sin(t1), Ay = Oy - L * Math.cos(t1);
    /* reflected (partial) */
    const Rx = Ox + L * Math.sin(t1), Ry = Ay, rop = Math.max(0.12, Math.min(1, 0.15 + R * 1.6));
    g += ln9(Ox, Oy, Rx, Ry, "var(--note)", 1.5 + 2 * R, "", rop) + mid9(Ox, Oy, Rx, Ry, "var(--note)", 6, 0.6, rop);
    g += ln9(Ax, Ay, Ox, Oy, "var(--c)", 3.5) + mid9(Ax, Ay, Ox, Oy, "var(--c)", 8);
    if (t1d > 2) g += `<path d="${arc9(Ox, Oy, 44, t1, -1, -1)}" fill="none" stroke="var(--c)" stroke-width="2"/><text x="${Ox - 58 * Math.sin(t1 / 2)}" y="${Oy - 58 * Math.cos(t1 / 2) + 5}" font-size="15" text-anchor="middle" fill="var(--c)" font-weight="700" ${H9}>θ₁</text>`;
    if (!tir) { const Bx = Ox + L * Math.sin(t2), By = Oy + L * Math.cos(t2);
      g += ln9(Ox, Oy, Bx, By, "var(--bad)", 3.5) + mid9(Ox, Oy, Bx, By, "var(--bad)", 8);
      if (Math.abs(n1 - n2) > 0.001) { const [ux, uy] = far9(Ox, Oy, 2 * Ox - Ax, 2 * Oy - Ay, 100); g += ln9(Ox, Oy, ux, uy, "var(--muted)", 1.2, "3 4"); }
      if (t2 > 2 * R9) g += `<path d="${arc9(Ox, Oy, 44, t2, 1, 1)}" fill="none" stroke="var(--bad)" stroke-width="2"/><text x="${Ox + 60 * Math.sin(t2 / 2)}" y="${Oy + 60 * Math.cos(t2 / 2) + 5}" font-size="15" text-anchor="middle" fill="var(--bad)" font-weight="700" ${H9}>θ₂</text>`; }
    else g += `<text x="${Ox + 12}" y="${Oy + 60}" font-size="15" fill="var(--bad)" font-weight="700" ${H9}>${L2("no refracted ray", "প্রতিসৃত রশ্মি নেই")}</text>`;
    g += `<circle cx="${Ax}" cy="${Ay}" r="13" fill="var(--c)" opacity=".25" data-h="1" style="cursor:grab;touch-action:none"/><circle cx="${Ax}" cy="${Ay}" r="6" fill="var(--c)" data-h="1" style="cursor:grab;touch-action:none"/></svg>`;
    wrap.innerHTML = g;
    const lhs = n1 * Math.sin(t1), rel = n2 / n1;
    let o = L2(`n₁ sin θ₁ = ${f9(n1, 2)} × sin ${B9(t1d)}° = <b>${f9(lhs, 3)}</b>`, `n₁ sin θ₁ = ${f9(n1, 2)} × sin ${B9(t1d)}° = <b>${f9(lhs, 3)}</b>`) + "<br>";
    if (tir) { const tc = Math.asin(n2 / n1) / R9;
      o += L2(`sin θ₂ = ${f9(lhs, 3)} ÷ ${f9(n2, 2)} = ${f9(s2, 3)}, which is more than 1: <b>no refracted ray</b>. The light is totally reflected (critical angle here ≈ ${f9(tc, 1)}°). See lesson 9.2.`,
        `sin θ₂ = ${f9(lhs, 3)} ÷ ${f9(n2, 2)} = ${f9(s2, 3)}, যা ১-এর বেশি: <b>প্রতিসৃত রশ্মি নেই</b>। আলো পুরোপুরি প্রতিফলিত হয় (এখানে ক্রান্তি কোণ ≈ ${f9(tc, 1)}°)। পাঠ ৯.২ দেখো।`); }
    else { const t2d = t2 / R9, dir = Math.abs(n1 - n2) < 0.001 || t1d === 0 ? L2("goes straight on (no bending)", "সোজা চলে যায় (বাঁকে না)") : n2 > n1 ? L2("bends <b>towards</b> the normal (into a denser medium)", "অভিলম্বের <b>দিকে</b> বাঁকে (ঘন মাধ্যমে ঢুকছে)") : L2("bends <b>away from</b> the normal (into a rarer medium)", "অভিলম্ব থেকে <b>দূরে</b> সরে (হালকা মাধ্যমে ঢুকছে)");
      o += L2(`sin θ₂ = ${f9(lhs, 3)} ÷ ${f9(n2, 2)} = ${f9(s2, 3)} → <b>θ₂ = ${f9(t2d, 1)}°</b>. The ray ${dir}.`, `sin θ₂ = ${f9(lhs, 3)} ÷ ${f9(n2, 2)} = ${f9(s2, 3)} → <b>θ₂ = ${f9(t2d, 1)}°</b>। রশ্মি ${dir}।`); }
    o += "<br>" + L2(`Relative index ₁n₂ = n₂ ÷ n₁ = ${f9(rel, 2)}. Reflected share ≈ ${B9(Math.round(R * 100))}%.`, `আপেক্ষিক প্রতিসরণাঙ্ক ₁n₂ = n₂ ÷ n₁ = ${f9(rel, 2)}। প্রতিফলিত অংশ ≈ ${B9(Math.round(R * 100))}%।`);
    $("#c9no", el).innerHTML = o;
  };
  let drag = false;
  const mv = e => { if (!drag) return; const [x, y] = svgPt9(wrap, e, 420); let i = Math.atan2(Math.abs(Ox - x), Math.max(1, Oy - y)) / R9; $("#c9si", el).value = Math.round(Math.min(89, Math.max(0, i))); go(); e.preventDefault(); };
  wrap.addEventListener("pointerdown", e => { if (e.target.dataset && e.target.dataset.h) { drag = true; e.preventDefault(); } });
  window.addEventListener("pointermove", mv); window.addEventListener("pointerup", () => { drag = false; });
  chips9(el, ".c9s1", btn => { a = +btn.dataset.i; go(); }); chips9(el, ".c9s2", btn => { b = +btn.dataset.i; go(); });
  $("#c9si", el).addEventListener("input", go); go();
};

/* 9.2 critical angle and total internal reflection (denser medium below, air above) */
W.c9tir = (el) => {
  const DEN = MED9().slice(1);
  el.innerHTML = `<div class="chipset c9tm" role="group">${DEN.map((m, i) => `<button data-i="${i}" aria-pressed="${i === 1}">${m[1]} (${f9(m[2], 2)})</button>`).join("")}</div>` +
    slider("c9ti", L2("Angle of incidence θ₁ (inside the denser medium)", "আপতন কোণ θ₁ (ঘন মাধ্যমের ভেতরে)"), 0, 89, 0.5, 30, "°") + `<div class="svgwrap fit" id="c9tsv"></div><div class="w-out" id="c9to"></div>`;
  let k = 1; const Ox = 210, Oy = 120, L = 118;
  const go = () => {
    const n1 = DEN[k][2], n2 = 1, t1d = sv(el, "c9ti", "°", 1), t1 = t1d * R9, tc = Math.asin(n2 / n1), tcd = tc / R9, s2 = n1 * Math.sin(t1), tir = s2 >= 1, R = fres9(n1, n2, t1);
    let g = `<svg viewBox="0 0 420 260" role="img" aria-label="${L2("total internal reflection", "পূর্ণ অভ্যন্তরীণ প্রতিফলন")}">`;
    g += `<rect x="0" y="${Oy}" width="420" height="${260 - Oy}" fill="var(--c)" opacity="${tint9(n1)}"/>` + ln9(0, Oy, 420, Oy, "var(--c)", 2);
    g += `<text x="8" y="22" font-size="15" fill="var(--ink)">${L2("Air (rarer), n = 1", "বাতাস (হালকা), n = ১")}</text><text x="8" y="250" font-size="15" fill="var(--ink)" ${H9}>${DEN[k][1]} (${L2("denser", "ঘন")}), n = ${f9(n1, 2)}</text>`;
    g += ln9(Ox, 10, Ox, 250, "var(--muted)", 1.5, "5 4");
    /* critical-angle guide on the incident side */
    const cx = Ox - 112 * Math.sin(tc), cy = Oy + 112 * Math.cos(tc);
    g += ln9(Ox, Oy, cx, cy, "var(--muted)", 1.5, "2 4") + `<text x="${cx - 4}" y="${cy + 16}" font-size="14" text-anchor="middle" fill="var(--muted)" ${H9}>θc = ${f9(tcd, 1)}°</text>`;
    const Ax = Ox - L * Math.sin(t1), Ay = Oy + L * Math.cos(t1), Rx = Ox + L * Math.sin(t1), Ry = Ay;
    const rop = Math.max(0.15, Math.min(1, 0.12 + R)), top = 1 - R;
    g += ln9(Ax, Ay, Ox, Oy, "var(--c)", 3.5) + mid9(Ax, Ay, Ox, Oy, "var(--c)", 8);
    g += ln9(Ox, Oy, Rx, Ry, "var(--note)", 1 + 3.5 * R, "", rop) + mid9(Ox, Oy, Rx, Ry, "var(--note)", 7, 0.6, rop);
    if (!tir) { const t2 = Math.asin(s2), Bx = Ox + L * Math.sin(t2), By = Oy - L * Math.cos(t2), op = Math.max(0.15, top);
      g += ln9(Ox, Oy, Bx, By, "var(--bad)", 1 + 3 * top, "", op) + mid9(Ox, Oy, Bx, By, "var(--bad)", 7, 0.6, op);
      if (t2 > 3 * R9) g += `<path d="${arc9(Ox, Oy, 40, t2, -1, 1)}" fill="none" stroke="var(--bad)" stroke-width="2"/><text x="${Ox + 54 * Math.sin(t2 / 2)}" y="${Oy - 54 * Math.cos(t2 / 2) + 5}" font-size="15" text-anchor="middle" fill="var(--bad)" font-weight="700" ${H9}>θ₂</text>`; }
    if (t1d > 2) g += `<path d="${arc9(Ox, Oy, 40, t1, 1, -1)}" fill="none" stroke="var(--c)" stroke-width="2"/><text x="${Ox - 52 * Math.sin(t1 / 2)}" y="${Oy + 52 * Math.cos(t1 / 2) + 5}" font-size="15" text-anchor="middle" fill="var(--c)" font-weight="700" ${H9}>θ₁</text>`;
    /* share bar */
    const bw = 160, bx = 250, by = 14;
    g += `<rect x="${bx}" y="${by}" width="${bw}" height="14" fill="var(--bad)" opacity=".75"/><rect x="${bx}" y="${by}" width="${(bw * R).toFixed(1)}" height="14" fill="var(--note)"/><text x="${bx + bw}" y="${by + 30}" font-size="13" text-anchor="end" fill="var(--muted)">${L2("reflected", "প্রতিফলিত")} ${B9(Math.round(R * 100))}% · ${L2("refracted", "প্রতিসৃত")} ${B9(Math.round((1 - R) * 100))}%</text>`;
    g += `</svg>`; $("#c9tsv", el).innerHTML = g;
    let o = L2(`Critical angle: sin θc = 1 ÷ ${f9(n1, 2)} = ${f9(1 / n1, 3)} → <b>θc = ${f9(tcd, 1)}°</b>.<br>`, `ক্রান্তি কোণ: sin θc = ১ ÷ ${f9(n1, 2)} = ${f9(1 / n1, 3)} → <b>θc = ${f9(tcd, 1)}°</b>।<br>`);
    if (tir && t1d - tcd > 0.05) o += L2(`θ₁ = ${f9(t1d, 1)}° is <b>greater than θc</b>: n₁ sin θ₁ = ${f9(s2, 2)} > 1, so there is no refracted ray. <b>Total internal reflection</b>: all the light stays inside.`, `θ₁ = ${f9(t1d, 1)}° কোণটি <b>θc-এর চেয়ে বড়</b>: n₁ sin θ₁ = ${f9(s2, 2)} > ১, তাই প্রতিসৃত রশ্মি নেই। <b>পূর্ণ অভ্যন্তরীণ প্রতিফলন</b>: সব আলো ভেতরেই থাকে।`);
    else if (Math.abs(t1d - tcd) <= 0.6) o += L2(`θ₁ ≈ θc: the refracted ray just grazes along the surface (θ₂ ≈ 90°).`, `θ₁ ≈ θc: প্রতিসৃত রশ্মি তল ঘেঁষে চলে যায় (θ₂ ≈ ৯০°)।`);
    else o += L2(`θ₁ = ${f9(t1d, 1)}° is less than θc: the ray refracts out at θ₂ = ${f9(Math.asin(Math.min(1, s2)) / R9, 1)}° (away from the normal), and a little light is reflected.`, `θ₁ = ${f9(t1d, 1)}° কোণটি θc-এর চেয়ে ছোট: রশ্মি θ₂ = ${f9(Math.asin(Math.min(1, s2)) / R9, 1)}° কোণে প্রতিসৃত হয়ে বের হয় (অভিলম্ব থেকে দূরে), আর সামান্য আলো প্রতিফলিত হয়।`);
    $("#c9to", el).innerHTML = o;
  };
  chips9(el, ".c9tm", b => { k = +b.dataset.i; go(); });
  $("#c9ti", el).addEventListener("input", go); go();
};

/* 9.3 optical fibre and prism */
W.c9fibre = (el) => {
  el.innerHTML = `<div class="chipset c9fm" role="group"><button data-m="f" aria-pressed="true">${L2("Optical fibre", "অপটিক্যাল ফাইবার")}</button><button data-m="p" aria-pressed="false">${L2("Prism", "প্রিজম")}</button></div><div id="c9fin"></div><div class="svgwrap fit" id="c9fsv"></div><div class="w-out" id="c9fo"></div>`;
  let mode = "f";
  const build = () => { $("#c9fin", el).innerHTML = mode === "f" ? slider("c9fa", L2("Angle of the light entering the fibre (in air)", "ফাইবারে ঢোকা আলোর কোণ (বাতাসে)"), 0, 40, 1, 12, "°") + slider("c9fc", L2("Refractive index of the clad (core = 1.50)", "ক্ল্যাডের প্রতিসরণাঙ্ক (কোর = ১.৫০)"), 1.3, 1.49, 0.01, 1.45, "")
      : slider("c9pi", L2("Angle of incidence on the prism", "প্রিজমে আপতন কোণ"), 36, 80, 1, 50, "°");
    el.querySelectorAll("#c9fin input").forEach(i => i.addEventListener("input", go)); go(); };
  const fibre = () => {
    const al = sv(el, "c9fa", "°", 0) * R9, nc = sv(el, "c9fc", "", 2), n1 = 1.5, r = Math.asin(Math.sin(al) / n1), wall = 90 - r / R9, tc = Math.asin(nc / n1) / R9, ok = wall >= tc - 1e-9, amax = Math.asin(Math.min(1, Math.sqrt(n1 * n1 - nc * nc))) / R9;
    const X0 = 40, X1 = 408, Yc = 88, hw = 34;
    let g = `<svg viewBox="0 0 420 190" role="img" aria-label="${L2("light in an optical fibre", "অপটিক্যাল ফাইবারে আলো")}">`;
    g += `<rect x="${X0}" y="${Yc - hw - 22}" width="${X1 - X0 + 12}" height="${2 * hw + 44}" fill="var(--c)" opacity=".12" stroke="var(--rule)"/><rect x="${X0}" y="${Yc - hw}" width="${X1 - X0 + 12}" height="${2 * hw}" fill="var(--c)" opacity=".3"/>`;
    g += `<text x="${X0 + 6}" y="${Yc - hw - 7}" font-size="14" fill="var(--ink)">${L2("clad", "ক্ল্যাড")} n = ${f9(nc, 2)}</text><text x="${X0 + 6}" y="${Yc + hw + 17}" font-size="14" fill="var(--ink)">${L2("clad", "ক্ল্যাড")}</text><text x="${X0 + 6}" y="${Yc + hw - 7}" font-size="14" fill="var(--ink)" ${H9}>${L2("core", "কোর")} n = ${B9("1.50")}</text>`;
    /* incoming ray in air */
    const sx = X0 - 34, sy = Yc + 34 * Math.tan(al);
    g += ln9(sx, sy, X0, Yc, "var(--c)", 3) + mid9(sx, sy, X0, Yc, "var(--c)", 7);
    if (al > 0.03) g += ln9(X0 - 30, Yc, X0 + 30, Yc, "var(--muted)", 1, "3 3");
    /* zigzag */
    let x = X0, y = Yc, dx = Math.cos(r), dy = -Math.sin(r), op = 1, seg = 0, leak = "";
    while (x < X1 && seg < 80) { const ty = dy < 0 ? (Yc - hw - y) / dy : dy > 0 ? (Yc + hw - y) / dy : Infinity, tx = (X1 - x) / dx, t = Math.min(ty, tx);
      const nx = x + dx * t, ny = y + dy * t; g += ln9(x, y, nx, ny, "var(--bad)", 2.5, "", op); if (seg === 0) g += mid9(x, y, nx, ny, "var(--bad)", 7, 0.5, op);
      x = nx; y = ny; seg++; if (t === tx) break;
      if (!ok) { const tt = Math.asin(Math.min(1, n1 * Math.sin(wall * R9) / nc)), sgn = dy < 0 ? -1 : 1, ex = x + Math.sin(tt) * 60, ey = y + sgn * Math.cos(tt) * 60;
        if (seg < 5) leak += ln9(x, y, ex, ey, "var(--note)", 2.5, "", op) + mid9(x, y, ex, ey, "var(--note)", 6, 0.7, op); op *= 0.45; if (op < 0.06) break; }
      dy = -dy; }
    g += leak;
    if (ok && x >= X1 - 1) g += `<circle cx="${X1}" cy="${y}" r="6" fill="var(--bad)"/>`;
    g += `<text x="${X0}" y="182" font-size="15" fill="var(--muted)">${L2("angle at the wall", "দেয়ালে আপতন কোণ")} = ${f9(wall, 1)}°, θc = ${f9(tc, 1)}°</text></svg>`;
    $("#c9fsv", el).innerHTML = g;
    $("#c9fo", el).innerHTML = L2(`Inside the core the ray makes ${f9(r / R9, 1)}° with the axis, so it meets the core–clad wall at <b>${f9(wall, 1)}°</b>. Critical angle θc = sin⁻¹(${f9(nc, 2)} ÷ 1.50) = <b>${f9(tc, 1)}°</b>.<br>`,
      `কোরের ভেতরে রশ্মি অক্ষের সাথে ${f9(r / R9, 1)}° কোণ করে, তাই কোর-ক্ল্যাড দেয়ালে পড়ে <b>${f9(wall, 1)}°</b> কোণে। ক্রান্তি কোণ θc = sin⁻¹(${f9(nc, 2)} ÷ ১.৫০) = <b>${f9(tc, 1)}°</b>।<br>`) +
      (ok ? L2(`${f9(wall, 1)}° ≥ θc: <b>total internal reflection</b> at every bounce; the light is trapped all the way.`, `${f9(wall, 1)}° ≥ θc: প্রতিবারই <b>পূর্ণ অভ্যন্তরীণ প্রতিফলন</b>; আলো পুরো পথ আটকে থাকে।`)
        : L2(`${f9(wall, 1)}° < θc: at each bounce some light <b>leaks out</b> into the clad, and the signal fades.`, `${f9(wall, 1)}° < θc: প্রতিবার ধাক্কায় কিছু আলো ক্ল্যাডে <b>বেরিয়ে যায়</b>, সংকেত ক্ষীণ হয়ে পড়ে।`)) +
      L2(` Light entering at up to about ${f9(amax, 1)}° stays trapped.`, ` প্রায় ${f9(amax, 1)}° পর্যন্ত কোণে ঢোকা আলো আটকে থাকে।`);
  };
  const COL = [["#e53935", 1.5143, L2("red", "লাল")], ["#fb8c00", 1.5155, ""], ["#fdd835", 1.5168, ""], ["#43a047", 1.5195, ""], ["#1e88e5", 1.5238, ""], ["#3949ab", 1.5267, ""], ["#8e24aa", 1.5302, L2("violet", "বেগুনি")]];
  const refr = (d, nr, n1, n2) => { const eta = n1 / n2, ci = -(d[0] * nr[0] + d[1] * nr[1]), k = 1 - eta * eta * (1 - ci * ci); if (k < 0) return null; const c = eta * ci - Math.sqrt(k); return [eta * d[0] + c * nr[0], eta * d[1] + c * nr[1]]; };
  const prism = () => {
    const i = sv(el, "c9pi", "°", 0) * R9, A = [210, 22], B = [100, 212.5], C = [320, 212.5], EX = 4;
    const nL = [-0.866, -0.5], nR = [0.866, -0.5]; /* outward normals of left and right faces */
    const P = [A[0] + (B[0] - A[0]) * 0.55, A[1] + (B[1] - A[1]) * 0.55];
    const d0 = [Math.cos(30 * R9 - i), Math.sin(30 * R9 - i)];
    let g = `<svg viewBox="0 0 420 250" role="img" aria-label="${L2("dispersion by a prism", "প্রিজমে বিচ্ছুরণ")}"><path d="M${A} L${B} L${C} z" fill="var(--c)" fill-opacity=".22" stroke="var(--c)" stroke-width="2"/>`;
    g += ln9(P[0] - 260 * d0[0], P[1] - 260 * d0[1], P[0], P[1], "var(--ink)", 3.5) + mid9(P[0] - 120 * d0[0], P[1] - 120 * d0[1], P[0], P[1], "var(--ink)", 8);
    g += ln9(P[0] + 26 * nL[0], P[1] + 26 * nL[1], P[0] - 26 * nL[0], P[1] - 26 * nL[1], "var(--muted)", 1.2, "3 3");
    g += ln9(P[0], P[1], P[0] + 330 * d0[0], P[1] + 330 * d0[1], "var(--muted)", 1.2, "5 5");
    const dev = []; let lab = "", ok = true;
    COL.forEach(([c, nt, name], j) => {
      const devOf = (n) => { const d1 = refr(d0, nL, 1, n); const t = ((C[0] - A[0]) * (P[1] - A[1]) - (C[1] - A[1]) * (P[0] - A[0])) / ((C[1] - A[1]) * d1[0] - (C[0] - A[0]) * d1[1]); const Q = [P[0] + d1[0] * t, P[1] + d1[1] * t]; const d2 = refr(d1, [-nR[0], -nR[1]], n, 1); return [d1, Q, d2]; };
      const [d1, Q, d2] = devOf(1.5168 + (nt - 1.5168) * EX), tr = refr(refr(d0, nL, 1, nt) || [1, 0], [-nR[0], -nR[1]], nt, 1);
      dev.push(tr ? Math.acos(Math.max(-1, Math.min(1, tr[0] * d0[0] + tr[1] * d0[1]))) / R9 : null);
      g += ln9(P[0], P[1], Q[0], Q[1], c, 1.6);
      if (!d2) { ok = false; return; }
      const E = [Q[0] + d2[0] * 240, Q[1] + d2[1] * 240]; g += ln9(Q[0], Q[1], E[0], E[1], c, 2.6);
      if (name) { const tx = Math.min(410, Q[0] + d2[0] * 120), ty = Q[1] + d2[1] * 120; lab += `<text x="${tx}" y="${ty + (j ? 18 : -8)}" font-size="14" text-anchor="end" fill="${c}" font-weight="700" ${H9}>${name}</text>`; } });
    g += lab + `<text x="8" y="16" font-size="13" fill="var(--muted)">${L2("colour spread drawn 4× larger", "রঙের ছড়ানো ৪ গুণ বড় করে আঁকা")}</text><text x="${(B[0] + C[0]) / 2}" y="234" font-size="15" text-anchor="middle" fill="var(--ink)">${L2("base", "ভূমি")}</text></svg>`;
    $("#c9fsv", el).innerHTML = g;
    $("#c9fo", el).innerHTML = !ok || dev[0] == null || dev[6] == null ? L2("At this small angle some light is totally reflected at the second face and does not come out. Increase the angle.", "এত ছোট কোণে কিছু আলো দ্বিতীয় তলে পূর্ণ প্রতিফলিত হয়ে বের হয় না। কোণ বাড়াও।")
      : L2(`The white ray bends <b>towards the base</b> at both faces. Angle of deviation (glass, apex 60°): red <b>${f9(dev[0], 1)}°</b>, violet <b>${f9(dev[6], 1)}°</b>. Violet has the larger n, so it deviates about ${f9(dev[6] - dev[0], 1)}° more: white light is <b>dispersed</b>.`,
        `সাদা রশ্মি দুই তলেই <b>ভূমির দিকে</b> বাঁকে। বিচ্যুতি কোণ (কাচ, শীর্ষকোণ ৬০°): লাল <b>${f9(dev[0], 1)}°</b>, বেগুনি <b>${f9(dev[6], 1)}°</b>। বেগুনির n বেশি, তাই এটি প্রায় ${f9(dev[6] - dev[0], 1)}° বেশি বিচ্যুত হয়: সাদা আলো <b>বিচ্ছুরিত</b> হয়।`);
  };
  const go = () => mode === "f" ? fibre() : prism();
  chips9(el, ".c9fm", b => { mode = b.dataset.m; build(); }); build();
};

/* lens outline */
const lens9 = (x, Y, h, cvx, bulge = 16) => cvx ? `<path d="M${x},${Y - h} Q${x + bulge * 2},${Y} ${x},${Y + h} Q${x - bulge * 2},${Y} ${x},${Y - h} z" fill="var(--c)" fill-opacity=".22" stroke="var(--c)" stroke-width="2.5"/>`
  : `<path d="M${x - bulge},${Y - h} L${x + bulge},${Y - h} Q${x + 3 - bulge},${Y} ${x + bulge},${Y + h} L${x - bulge},${Y + h} Q${x - 3 + bulge},${Y} ${x - bulge},${Y - h} z" fill="var(--c)" fill-opacity=".22" stroke="var(--c)" stroke-width="2.5"/>`;
const dot9 = (x, Y, lab, col = "var(--ink)", dy = 20) => `<circle cx="${x}" cy="${Y}" r="3.5" fill="${col}"/><text x="${x}" y="${Y + dy}" font-size="15" text-anchor="middle" fill="${col}" font-weight="700" ${H9}>${lab}</text>`;

/* 9.4 lens terms */
W.c9terms = (el) => {
  const T = [["O", L2("Optical centre O", "আলোকীয় কেন্দ্র O")], ["ax", L2("Principal axis", "প্রধান অক্ষ")], ["C", L2("Centres of curvature", "বক্রতার কেন্দ্র")], ["F", L2("Principal focus F", "প্রধান ফোকাস F")], ["f", L2("Focal length f", "ফোকাস দূরত্ব f")]];
  el.innerHTML = `<div class="chipset c9lt" role="group"><button data-t="cx" aria-pressed="true">${L2("Convex", "উত্তল")}</button><button data-t="cc" aria-pressed="false">${L2("Concave", "অবতল")}</button></div>
  <div class="chipset c9lk" role="group">${T.map((t, i) => `<button data-k="${t[0]}" aria-pressed="${i === 3}">${t[1]}</button>`).join("")}</div><div class="svgwrap fit" id="c9lsv"></div><div class="w-out" id="c9lo"></div>`;
  let cx = true, key = "F";
  const go = () => {
    const X = 210, Y = 120, h = 80, fp = 118, hl = k => key === k ? "var(--bad)" : "var(--muted)";
    let g = `<svg viewBox="0 0 420 240" role="img" aria-label="${L2("lens terms", "লেন্সের সংজ্ঞা")}">`;
    g += ln9(4, Y, 416, Y, hl("ax"), key === "ax" ? 3 : 1.3);
    /* curvature circles */
    const Rr = cx ? 200 : 190, c1 = cx ? X + 19 - Rr : X - 4 - Rr, c2 = cx ? X - 19 + Rr : X + 4 + Rr;
    if (key === "C") g += `<circle cx="${c1}" cy="${Y}" r="${Rr}" fill="none" stroke="var(--bad)" stroke-width="1.2" stroke-dasharray="4 5" opacity=".7"/><circle cx="${c2}" cy="${Y}" r="${Rr}" fill="none" stroke="var(--bad)" stroke-width="1.2" stroke-dasharray="4 5" opacity=".7"/>`;
    g += lens9(X, Y, h, cx, cx ? 16 : 13);
    /* parallel rays */
    const on = key === "F" || key === "f", rc = on ? "var(--note)" : "var(--rule)", rw = on ? 2.2 : 1.4, F1 = X - fp, F2 = X + fp;
    [-60, -30, 30, 60].forEach(o => { const y = Y + o; g += ln9(8, y, X, y, rc, rw) + mid9(8, y, X, y, rc, 5, 0.45);
      if (cx) { const [ex, ey] = far9(X, y, F2, Y, 260); g += ln9(X, y, ex, ey, rc, rw) + mid9(X, y, F2, Y, rc, 5, 0.5); }
      else { const [ex, ey] = far9(F1, Y, X, y, 400); g += ln9(X, y, ex, ey, rc, rw) + mid9(X, y, ex, ey, rc, 5, 0.25) + ln9(F1, Y, X, y, rc, 1.1, "4 4"); } });
    if (key === "O") { g += ln9(40, Y - 70, 380, Y + 70 * 170 / 170, "var(--bad)", 2.5) + mid9(40, Y - 70, X, Y, "var(--bad)", 7) + mid9(X, Y, 380, Y + 70, "var(--bad)", 7); }
    if (key === "C") g += dot9(c1 < 8 ? 10 : c1, Y, "C₁", "var(--bad)") + dot9(c2 > 412 ? 410 : c2, Y, "C₂", "var(--bad)");
    const fc = key === "F" ? "var(--bad)" : "var(--ink)";
    g += dot9(F1, Y, "F", fc) + dot9(F2, Y, "F", fc) + dot9(X, Y, "O", key === "O" ? "var(--bad)" : "var(--ink)", -12 - h + 70 > 0 ? 20 : 20);
    if (key === "f") { const fx = cx ? F2 : F1; g += `<path d="M${X},${Y + 44} L${fx},${Y + 44} M${X},${Y + 38} L${X},${Y + 50} M${fx},${Y + 38} L${fx},${Y + 50}" stroke="var(--bad)" stroke-width="2.5"/><text x="${(X + fx) / 2}" y="${Y + 64}" font-size="16" text-anchor="middle" fill="var(--bad)" font-weight="700" ${H9}>f</text>`; }
    if (key === "ax") g += `<text x="10" y="${Y - 8}" font-size="15" fill="var(--bad)" ${H9}>${L2("principal axis", "প্রধান অক্ষ")}</text>`;
    g += `<text x="${cx ? 410 : 10}" y="232" font-size="14" text-anchor="${cx ? "end" : "start"}" fill="var(--muted)">${cx ? L2("rays really meet at F: real focus", "রশ্মি সত্যিই F-এ মেলে: বাস্তব ফোকাস") : L2("rays seem to come from F: virtual focus", "রশ্মি F থেকে আসছে মনে হয়: অবাস্তব ফোকাস")}</text></svg>`;
    $("#c9lsv", el).innerHTML = g;
    const TX = { O: L2("Optical centre (O): the middle point of a thin lens. A ray aimed at O passes straight through without changing direction.", "আলোকীয় কেন্দ্র (O): পাতলা লেন্সের মাঝের বিন্দু। O লক্ষ্য করে আসা রশ্মি দিক না বদলে সোজা চলে যায়।"),
      ax: L2("Principal axis: the straight line through the two centres of curvature and the optical centre.", "প্রধান অক্ষ: দুটি বক্রতার কেন্দ্র ও আলোকীয় কেন্দ্র দিয়ে যাওয়া সরলরেখা।"),
      C: L2("Centres of curvature (C₁, C₂): the centres of the two spheres (dashed circles) whose surfaces form the lens.", "বক্রতার কেন্দ্র (C₁, C₂): যে দুটি গোলকের (ড্যাশ দেওয়া বৃত্ত) তল দিয়ে লেন্স তৈরি, তাদের কেন্দ্র।"),
      F: cx ? L2("Principal focus (F): rays parallel to the principal axis actually <b>meet</b> here after passing through a convex lens. There is one F on each side.", "প্রধান ফোকাস (F): প্রধান অক্ষের সমান্তরাল রশ্মি উত্তল লেন্স পার হয়ে এখানে সত্যিই <b>মিলিত হয়</b>। দুই পাশে একটি করে F আছে।")
        : L2("Principal focus (F): after a concave lens, parallel rays spread out as if <b>coming from</b> this point on the side the light came from (dashed lines). There is one F on each side.", "প্রধান ফোকাস (F): অবতল লেন্স পার হয়ে সমান্তরাল রশ্মি ছড়িয়ে যায়, যেন আলো যে পাশ থেকে এসেছে সেই পাশের এই বিন্দু থেকে <b>আসছে</b> (ড্যাশ রেখা)। দুই পাশে একটি করে F আছে।"),
      f: cx ? L2("Focal length (f): the distance OF. For a convex lens the focus is real, so f is <b>positive</b>.", "ফোকাস দূরত্ব (f): OF দূরত্ব। উত্তল লেন্সের ফোকাস বাস্তব, তাই f <b>ধনাত্মক</b>।") : L2("Focal length (f): the distance OF. For a concave lens the focus is virtual, so f is <b>negative</b>.", "ফোকাস দূরত্ব (f): OF দূরত্ব। অবতল লেন্সের ফোকাস অবাস্তব, তাই f <b>ঋণাত্মক</b>।") };
    $("#c9lo", el).innerHTML = TX[key];
  };
  chips9(el, ".c9lt", b => { cx = b.dataset.t === "cx"; go(); }); chips9(el, ".c9lk", b => { key = b.dataset.k; go(); }); go();
};

/* shared ray diagram for thin lenses (real-is-positive: convex f = +10 cm, concave f = −10 cm) */
const rayLens9 = (el, cx) => {
  const f = cx ? 10 : -10, S = cx ? 5 : 8, P = cx ? 200 : 300, Y = 130, H = 110, ho = cx ? 52 : 62, id = cx ? "c9cv" : "c9cc", af = Math.abs(f) * S;
  const ROWS = [["i", L2("Between O and F", "O ও F-এর মাঝে"), L2("Same side, beyond the object", "একই পাশে, বস্তুর পেছনে"), L2("Virtual, erect, magnified", "অবাস্তব, সোজা, বিবর্ধিত")],
    ["F", L2("At F", "F-এ"), L2("At infinity", "অসীমে"), L2("No image formed", "প্রতিবিম্ব হয় না")],
    ["F2F", L2("Between F and 2F", "F ও 2F-এর মাঝে"), L2("Beyond 2F (other side)", "2F-এর বাইরে (অপর পাশে)"), L2("Real, inverted, magnified", "বাস্তব, উল্টো, বিবর্ধিত")],
    ["2F", L2("At 2F", "2F-এ"), L2("At 2F (other side)", "2F-এ (অপর পাশে)"), L2("Real, inverted, same size", "বাস্তব, উল্টো, সমান")],
    ["b2F", L2("Beyond 2F", "2F-এর বাইরে"), L2("Between F and 2F (other side)", "F ও 2F-এর মাঝে (অপর পাশে)"), L2("Real, inverted, diminished", "বাস্তব, উল্টো, খর্বিত")]];
  const td = `style="padding:4px;border-top:1px solid var(--rule)"`;
  el.innerHTML = slider(id, L2("Object distance u", "বস্তুর দূরত্ব u"), cx ? 3 : 2, cx ? 38 : 30, 0.5, cx ? 25 : 20, "cm") + `<div class="svgwrap fit" id="${id}s"></div><div class="w-out" id="${id}o"></div>` +
    (cx ? `<table id="c9tab" style="width:100%;border-collapse:collapse;font-size:13px;margin-top:10px;line-height:1.3"><tr><th style="text-align:left;padding:4px">${L2("Object", "বস্তু")}</th><th style="text-align:left;padding:4px">${L2("Image", "প্রতিবিম্ব")}</th><th style="text-align:left;padding:4px">${L2("Nature", "প্রকৃতি")}</th></tr>${ROWS.map(r => `<tr data-r="${r[0]}"><td ${td}>${r[1]}</td><td ${td}>${r[2]}</td><td ${td}>${r[3]}</td></tr>`).join("")}</table>` : "");
  const arrow = (x, y0, y1, col, dash) => { const s = y1 < y0 ? 1 : -1; return ln9(x, y0, x, y1, col, 3, dash) + `<path d="M${x - 6},${y1 + 9 * s} L${x},${y1} L${x + 6},${y1 + 9 * s}" fill="none" stroke="${col}" stroke-width="3"/>`; };
  const go = () => {
    const u = sv(el, id, "cm", 1), inf = cx && Math.abs(u - f) < 1e-9, v = inf ? Infinity : 1 / (1 / f - 1 / u), m = inf ? Infinity : -v / u;
    const xo = P - u * S, yt = Y - ho, F1 = P - af, F2 = P + af;
    let g = `<svg viewBox="0 0 420 260" role="img" aria-label="${L2("lens ray diagram", "লেন্সের রশ্মিচিত্র")}">`;
    g += ln9(0, Y, 420, Y, "var(--rule)", 1.2) + lens9(P, Y, H, cx, cx ? 14 : 11);
    g += dot9(F1, Y, "F") + dot9(F2, Y, "F") + `<circle cx="${P}" cy="${Y}" r="3" fill="var(--ink)"/><text x="${P + 7}" y="${Y + 18}" font-size="15" fill="var(--ink)" font-weight="700" ${H9}>O</text>`;
    if (cx) g += dot9(P - 2 * af, Y, "2F") + dot9(P + 2 * af, Y, "2F");
    const c1 = "var(--note)", c2 = "var(--c)", c3 = "var(--bad)";
    const ix = P + v * S, iy = Y - m * ho, virt = !inf && v < 0, okImg = !inf && isFinite(v);
    const back = (x0, y0) => okImg && virt ? ln9(x0, y0, ix, iy, "var(--muted)", 1.3, "5 4") : "";
    /* ray 1: parallel, then through F2 (convex) or as if from F1 (concave) */
    g += ln9(xo, yt, P, yt, c1, 2.2) + mid9(xo, yt, P, yt, c1, 6);
    { const [ex, ey] = cx ? far9(P, yt, F2, Y, 600) : far9(F1, Y, P, yt, 600); g += ln9(P, yt, ex, ey, c1, 2.2) + mid9(P, yt, ex, ey, c1, 6, 0.12); if (!cx) g += ln9(F1, Y, P, yt, c1, 1.1, "3 4"); g += back(P, yt); }
    /* ray 2: through O, straight */
    { const [ex, ey] = far9(xo, yt, P, Y, 700); g += ln9(xo, yt, ex, ey, c2, 2.2) + mid9(xo, yt, P, Y, c2, 6, 0.5); g += back(P, Y); }
    /* ray 3: through (or from/towards) the focus, emerging parallel */
    { const Fx = cx ? F1 : F2, y3 = yt + (Y - yt) * (P - xo) / (Fx - xo);
      if (isFinite(y3) && Math.abs(y3 - Y) < H - 4 && Math.abs(Fx - xo) > 1) {
        if (cx && u < f) { g += ln9(Fx, Y, xo, yt, c3, 1.1, "3 4"); }
        g += ln9(xo, yt, P, y3, c3, 2.2) + mid9(xo, yt, P, y3, c3, 6) + ln9(P, y3, 420, y3, c3, 2.2) + mid9(P, y3, 420, y3, c3, 6, 0.4);
        if (!cx) g += ln9(P, y3, Fx, Y, c3, 1.1, "3 4"); g += back(P, y3); } }
    g += arrow(xo, Y, yt, "var(--ink)", "") + `<text x="${xo}" y="${yt - 8}" font-size="15" text-anchor="${xo < 40 ? "start" : "middle"}" fill="var(--ink)" ${H9}>${L2("object", "বস্তু")}</text>`;
    if (okImg && ix > 6 && ix < 414) { const ch = Math.max(-(260 - Y - 6), Math.min(Y - 6, m * ho)), ty = Y - ch; const lab = L2("image", "প্রতিবিম্ব");
      g += arrow(ix, Y, ty, "var(--bad)", virt ? "6 4" : "") + `<text x="${Math.min(404, Math.max(16, ix))}" y="${ty < Y ? Math.max(14, ty - 8) : Math.min(254, ty + 18)}" font-size="15" text-anchor="middle" fill="var(--bad)" ${H9}>${lab}</text>`; }
    else if (!inf) g += `<text x="${v > 0 ? 412 : 8}" y="18" font-size="15" text-anchor="${v > 0 ? "end" : "start"}" fill="var(--bad)" ${H9}>${v > 0 ? "" : "← "}${L2("image off the picture", "প্রতিবিম্ব ছবির বাইরে")}${v > 0 ? " →" : ""}</text>`;
    g += `</svg>`; $("#" + id + "s", el).innerHTML = g;
    let o;
    if (inf) o = L2(`u = f = 10 cm: 1/v = 1/10 − 1/10 = 0, so the rays leave the lens <b>parallel</b>. The image is at infinity.`, `u = f = ১০ cm: ১/v = ১/১০ − ১/১০ = ০, তাই রশ্মিগুলো লেন্স থেকে <b>সমান্তরাল</b> হয়ে বের হয়। প্রতিবিম্ব অসীমে।`);
    else { const am = Math.abs(m), size = Math.abs(am - 1) < 0.005 ? L2("same size", "সমান আকার") : am > 1 ? L2("magnified", "বিবর্ধিত") : L2("diminished", "খর্বিত"), real = v > 0;
      const nat = real ? L2("real, inverted", "বাস্তব, উল্টো") : L2("virtual, erect", "অবাস্তব, সোজা");
      o = L2(`u = ${f9(u)} cm, f = ${cx ? "+" : "−"}10 cm → 1/v = 1/f − 1/u → <b>v = ${real ? "+" : ""}${f9(v)} cm</b> (${real ? "on the other side of the lens" : f9(-v) + " cm from the lens, on the object's side"}).<br>m = |v| ÷ u = ${f9(am, 2)} → <b>${nat}, ${size}</b>.`,
        `u = ${f9(u)} cm, f = ${cx ? "+" : "−"}১০ cm → ১/v = ১/f − ১/u → <b>v = ${real ? "+" : ""}${f9(v)} cm</b> (${real ? "লেন্সের অপর পাশে" : "বস্তুর পাশে, লেন্স থেকে " + f9(-v) + " cm দূরে"})।<br>m = |v| ÷ u = ${f9(am, 2)} → <b>${nat}, ${size}</b>।`);
      if (!cx) o += L2(` The image always stays between O and F (10 cm).`, ` প্রতিবিম্ব সবসময় O ও F (১০ cm)-এর মাঝে থাকে।`); }
    $("#" + id + "o", el).innerHTML = o;
    if (cx) { const r = u < 10 ? "i" : u === 10 ? "F" : u < 20 ? "F2F" : u === 20 ? "2F" : "b2F";
      el.querySelectorAll("#c9tab tr[data-r]").forEach(tr => { const on = tr.dataset.r === r; tr.style.background = on ? "var(--c-soft)" : ""; tr.style.fontWeight = on ? "700" : ""; }); }
  };
  $("#" + id, el).addEventListener("input", go); go();
};
W.c9convex = (el) => rayLens9(el, true);
W.c9concave = (el) => rayLens9(el, false);

/* 9.4.3 power of a lens */
W.c9power = (el) => {
  el.innerHTML = slider("c9pp", L2("Power P", "ক্ষমতা P"), -5, 5, 0.5, -2, "D") + `<div class="svgwrap fit" id="c9psv"></div><div class="w-out" id="c9po"></div>`;
  const go = () => {
    const P = sv(el, "c9pp", "D", 1), X = 210, Y = 115, h = 78, K = 140; /* px per metre */
    let g = `<svg viewBox="0 0 420 240" role="img" aria-label="${L2("power of a lens", "লেন্সের ক্ষমতা")}">` + ln9(0, Y, 420, Y, "var(--rule)", 1.2);
    const cx = P > 0, flat = P === 0, f = flat ? Infinity : 1 / P, fx = X + f * K;
    if (flat) g += `<rect x="${X - 5}" y="${Y - h}" width="10" height="${2 * h}" fill="var(--c)" fill-opacity=".22" stroke="var(--c)" stroke-width="2.5"/>`;
    else g += cx ? lens9(X, Y, h, true, 3 + 3.2 * P) : lens9(X, Y, h, false, 4 + 2.4 * -P);
    [-56, -28, 28, 56].forEach(o => { const y = Y + o, c = "var(--note)"; g += ln9(6, y, X, y, c, 2) + mid9(6, y, X, y, c, 5, 0.5);
      if (flat) g += ln9(X, y, 414, y, c, 2);
      else if (cx) { const [ex, ey] = far9(X, y, fx, Y, 520); g += ln9(X, y, ex, ey, c, 2); }
      else { const [ex, ey] = far9(fx, Y, X, y, 520); g += ln9(X, y, ex, ey, c, 2) + (fx > -40 ? ln9(fx, Y, X, y, c, 1.1, "4 4") : ""); } });
    if (!flat && fx > 6 && fx < 414) g += dot9(fx, Y, "F", "var(--bad)") + `<path d="M${X},${Y + 96} L${fx},${Y + 96} M${X},${Y + 90} L${X},${Y + 102} M${fx},${Y + 90} L${fx},${Y + 102}" stroke="var(--bad)" stroke-width="2"/><text x="${(X + fx) / 2}" y="${Y + 116}" font-size="15" text-anchor="middle" fill="var(--bad)" ${H9}>|f| = ${f9(Math.abs(f), 2)} m</text>`;
    else if (!flat) g += `<text x="${cx ? 412 : 8}" y="${Y + 112}" font-size="14" text-anchor="${cx ? "end" : "start"}" fill="var(--bad)">${cx ? "" : "← "}F ${L2("is off the picture", "ছবির বাইরে")}${cx ? " →" : ""}</text>`;
    g += ln9(12, 18, 12 + 0.5 * K, 18, "var(--muted)", 2) + ln9(12, 13, 12, 23, "var(--muted)", 2) + ln9(12 + 0.5 * K, 13, 12 + 0.5 * K, 23, "var(--muted)", 2) + `<text x="${12 + 0.25 * K}" y="38" font-size="13" text-anchor="middle" fill="var(--muted)">${B9("0.5")} m</text></svg>`;
    $("#c9psv", el).innerHTML = g;
    let o;
    if (flat) o = L2("P = 0: a flat piece of glass. Parallel rays stay parallel; the focal length is infinite.", "P = ০: সমতল কাচ। সমান্তরাল রশ্মি সমান্তরালই থাকে; ফোকাস দূরত্ব অসীম।");
    else { const sg = cx ? "+" : "−";
      o = L2(`f = 1 ÷ P = 1 ÷ (${sg}${f9(Math.abs(P))}) = <b>${sg}${f9(Math.abs(f), 2)} m</b> (${f9(Math.abs(f) * 100, 0)} cm). ${cx ? "Positive power: a <b>convex</b> (converging) lens." : "Negative power: a <b>concave</b> (diverging) lens."}<br>${cx ? "Used for long sight / reading glasses." : "Used for short sight (like Shiuli's −2 D glasses)."} ${Math.abs(P) >= 3 ? "High power: short focal length, bends light strongly." : "Low power: long focal length, bends light gently."}`,
        `f = ১ ÷ P = ১ ÷ (${sg}${f9(Math.abs(P))}) = <b>${sg}${f9(Math.abs(f), 2)} m</b> (${f9(Math.abs(f) * 100, 0)} cm)। ${cx ? "ধনাত্মক ক্ষমতা: <b>উত্তল</b> (অভিসারী) লেন্স।" : "ঋণাত্মক ক্ষমতা: <b>অবতল</b> (অপসারী) লেন্স।"}<br>${cx ? "দূরদৃষ্টি / পড়ার চশমায় ব্যবহৃত।" : "ক্ষীণদৃষ্টিতে ব্যবহৃত (যেমন শিউলির −২ D চশমা)।"} ${Math.abs(P) >= 3 ? "বেশি ক্ষমতা: ছোট ফোকাস দূরত্ব, আলোকে জোরে বাঁকায়।" : "কম ক্ষমতা: বড় ফোকাস দূরত্ব, আলোকে অল্প বাঁকায়।"}`); }
    $("#c9po", el).innerHTML = o;
  };
  $("#c9pp", el).addEventListener("input", go); go();
};
