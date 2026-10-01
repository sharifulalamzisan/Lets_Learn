/* ---- chemistry chapter 12 widgets: chemistry in our lives ---- */
const B12 = x => bnNum(x, LANG);
const n12 = (x, d = 1) => B12((+(+x).toFixed(d)).toString()).replace("-", "−");
const fx12 = s => String(s).replace(/\^([0-9]*[+−-])/g, "<sup>$1</sup>").replace(/([A-Za-z)\]])(\d+)/g, "$1<sub>$2</sub>");
const chips12 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const lerp12 = (a, b, t) => a + (b - a) * t;
/* universal-indicator colours (real dye colours) */
const UNI12 = ["#c8102e", "#e0301e", "#e8401f", "#f5801f", "#f9b233", "#f3d02c", "#cfdc22", "#6fbf44", "#2fa84f", "#1c9a8a", "#2b7bb9", "#3a55a4", "#4b3c96", "#5b2d86", "#4a1f6e"];
const hx12 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix12 = (a, b, t) => { const A = hx12(a), C = hx12(b); t = Math.max(0, Math.min(1, t)); return "rgb(" + A.map((v, i) => Math.round(v + (C[i] - v) * t)).join(",") + ")"; };
const uni12 = pH => { const p = Math.max(0, Math.min(14, pH)), i = Math.min(13, Math.floor(p)); return mix12(UNI12[i], UNI12[i + 1], p - i); };

/* tabbed hub: each tab mounts a fresh pane (old animations stop when their pane leaves the DOM) */
const hub12 = (el, tabs) => {
  el.innerHTML = `<div class="chipset k12tabs" role="group" aria-label="${L2("Choose an activity", "একটি কাজ বেছে নাও")}">${tabs.map((t, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${t.n()}</button>`).join("")}</div><div class="k12pane"></div>`;
  const show = i => { const old = $(".k12pane", el), nw = document.createElement("div"); nw.className = "k12pane"; nw.style.marginTop = "10px"; old.replaceWith(nw); tabs[i].f(nw); };
  chips12(el, ".k12tabs", b => show(+b.dataset.i));
  show(0);
};
const stepper12 = (id, n, i) => `<div class="w-row" style="margin-top:8px;align-items:center"><button class="btn" id="${id}p" ${i === 0 ? "disabled" : ""}>◀ ${L2("Back", "আগে")}</button><span class="muted" style="min-width:64px;text-align:center">${L2("Step", "ধাপ")} ${B12(i + 1)}/${B12(n)}</span><button class="btn solid" id="${id}n" ${i === n - 1 ? "disabled" : ""}>${L2("Next", "পরে")} ▶</button></div>`;

/* ================= 12.1 (a) salt from the sea ================= */
W.k12salt = (el) => {
  let st = 0, t = 0;
  const S = [
    { h: () => L2("1. High tide fills the plot", "১. জোয়ারে জমি ভরে যায়"), o: () => L2("Sea water flows through the opening in the mud wall. It contains about 3.5% dissolved salts, mostly NaCl with some MgCl₂.", "মাটির বাঁধের খোলা মুখ দিয়ে সমুদ্রের পানি ঢোকে। এতে প্রায় ৩.৫% লবণ দ্রবীভূত, বেশিরভাগ NaCl, সাথে কিছু MgCl₂।") },
    { h: () => L2("2. Close the gate; the sun evaporates the water", "২. মুখ বন্ধ; রোদে পানি বাষ্পীভূত হয়"), o: () => L2("Removed: <b>water</b> (as vapour). Sun and wind do the work over several dry-season days.", "দূর হয়: <b>পানি</b> (বাষ্প হয়ে)। শুকনো মৌসুমের কয়েক দিনে রোদ আর বাতাস কাজটা করে।") },
    { h: () => L2("3. Crude salt appears", "৩. অপরিশোধিত লবণ দেখা দেয়"), o: () => L2("This is salt harvesting. The white crystals are mixed with sand and mud, so they must be purified.", "এটাই সল্ট হারভেস্টিং। সাদা দানার সাথে বালু-কাদা মেশানো, তাই বিশুদ্ধ করতে হয়।") },
    { h: () => L2("4. Dissolve in water", "৪. পানিতে দ্রবীভূত করো"), o: () => L2("Salt dissolves; sand does not, and settles at the bottom.", "লবণ গলে যায়; বালু গলে না, নিচে থিতিয়ে পড়ে।") },
    { h: () => L2("5. Filter", "৫. ছেঁকে নাও"), o: () => L2("Removed: <b>sand and dirt</b> (stay on the filter paper). The clear salt solution (filtrate) passes through.", "দূর হয়: <b>বালু ও ময়লা</b> (ফিল্টার পেপারে থেকে যায়)। স্বচ্ছ লবণ-দ্রবণ (পরিস্রুত) নিচে নামে।") },
    { h: () => L2("6. Evaporate the solution", "৬. দ্রবণ বাষ্পীভূত করো"), o: () => L2("Removed: <b>water</b> again. Clean white salt is left, ready to be iodised and packed.", "আবার দূর হয়: <b>পানি</b>। পরিষ্কার সাদা লবণ পড়ে থাকে, আয়োডিন মিশিয়ে প্যাকেট করার জন্য তৈরি।") }];
  const sandDots = (x0, x1, y0, y1, n, seed) => { let s = ""; for (let i = 0; i < n; i++) { const a = (i * 73 + seed * 31) % 97 / 97, b = (i * 41 + seed * 17) % 89 / 89; s += `<circle cx="${lerp12(x0, x1, a).toFixed(1)}" cy="${lerp12(y0, y1, b).toFixed(1)}" r="2" fill="#9a7b4f"/>`; } return s; };
  const crystals = (x0, x1, y0, y1, n) => { let s = ""; for (let i = 0; i < n; i++) { const a = (i * 53 % 101) / 101, b = (i * 29 % 67) / 67; s += `<rect x="${lerp12(x0, x1, a).toFixed(1)}" y="${lerp12(y0, y1, b).toFixed(1)}" width="5" height="5" fill="var(--sheet)" stroke="var(--muted)" stroke-width=".8" transform="rotate(${i * 37 % 90} ${lerp12(x0, x1, a).toFixed(1)} ${lerp12(y0, y1, b).toFixed(1)})"/>`; } return s; };
  const wave = (y, x0, x1, ph) => { let d = `M${x0} ${y}`; for (let x = x0; x <= x1; x += 6) d += ` L${x} ${(y + 2.5 * Math.sin(x / 9 + ph)).toFixed(1)}`; return d; };
  const draw = () => {
    let g = `<svg viewBox="${st <= 2 ? "0 40 360 180" : "0 20 360 200"}" role="img" aria-label="${S[st].h()}">${arrowDefs("k12sa", "var(--c)")}`;
    if (st <= 2) {
      g += `<rect x="0" y="150" width="360" height="70" fill="#c9a86a" opacity=".45"/>`;
      g += `<path d="${wave(150, 0, 92, t * 2)} L92 220 L0 220 Z" fill="#3b82c4" opacity=".55"/><text x="46" y="200" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("sea", "সমুদ্র")}</text>`;
      const lvl = st === 0 ? 1 : st === 1 ? Math.max(0.15, 1 - (t % 6) / 7) : 0;
      if (lvl > 0) g += `<rect x="116" y="${150 + (1 - lvl) * 22}" width="222" height="${lvl * 22 + 6}" fill="#3b82c4" opacity="${0.25 + 0.3 * lvl}"/>`;
      g += `<path d="M112 136 V178 H342 V136" fill="none" stroke="#7a5a33" stroke-width="7" stroke-linejoin="round"/>`;
      if (st === 0) { g += `<rect x="108" y="150" width="9" height="24" fill="#3b82c4" opacity=".7"/><line x1="70" y1="140" x2="130" y2="140" stroke="var(--c)" stroke-width="2.5" marker-end="url(#k12sa)"/><text x="100" y="128" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("high tide", "জোয়ার")}</text>`; }
      else g += `<rect x="107" y="146" width="10" height="30" fill="#7a5a33"/>`;
      if (st === 1) {
        g += `<circle cx="300" cy="78" r="16" fill="#f5b82e"/>`;
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g += `<line x1="${300 + 21 * Math.cos(a)}" y1="${78 + 21 * Math.sin(a)}" x2="${300 + 28 * Math.cos(a)}" y2="${78 + 28 * Math.sin(a)}" stroke="#f5b82e" stroke-width="3"/>`; }
        for (let k = 0; k < 4; k++) { const x = 140 + k * 40, off = (t * 18 + k * 13) % 30; g += `<path d="M${x} ${140 - off} q6 -8 0 -16 q-6 -8 0 -16" fill="none" stroke="var(--muted)" stroke-width="2" opacity="${1 - off / 30}"/>`; }
        g += `<text x="200" y="92" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("water vapour", "জলীয় বাষ্প")}</text>`;
      }
      if (st === 2) g += crystals(122, 332, 158, 172, 40) + sandDots(122, 332, 160, 174, 22, 1) + `<text x="227" y="128" font-size="14" text-anchor="middle" fill="var(--ink)">${L2("crude salt + sand", "অপরিশোধিত লবণ + বালু")}</text>`;
    } else if (st === 3) {
      g += `<path d="M130 60 V190 H230 V60" fill="none" stroke="var(--ink)" stroke-width="2.5"/><rect x="132" y="95" width="96" height="94" fill="#7fb2df" opacity=".35"/>`;
      for (let i = 0; i < 26; i++) g += `<circle cx="${140 + (i * 37 % 80) + 2 * Math.sin(t * 2 + i)}" cy="${105 + (i * 23 % 70) + 2 * Math.cos(t * 1.6 + i)}" r="1.6" fill="var(--c)" opacity=".7"/>`;
      g += sandDots(138, 222, 178, 186, 26, 2);
      g += `<text x="250" y="120" font-size="13" fill="var(--ink)">${L2("dissolved salt", "দ্রবীভূত লবণ")}</text><text x="250" y="186" font-size="13" fill="var(--ink)">${L2("sand settles", "বালু থিতিয়ে পড়ে")}</text>`;
    } else if (st === 4) {
      g += `<path d="M110 40 L250 40 L190 110 V130 H170 V110 Z" fill="none" stroke="var(--ink)" stroke-width="2.2"/><path d="M122 46 L238 46 L180 104 Z" fill="var(--sheet)" stroke="var(--muted)"/>`;
      g += sandDots(160, 200, 70, 96, 18, 3);
      const dy = (t * 40) % 40; g += `<circle cx="180" cy="${136 + dy}" r="2.5" fill="#3b82c4" opacity="${1 - dy / 40}"/>`;
      g += `<path d="M135 150 V206 H225 V150" fill="none" stroke="var(--ink)" stroke-width="2.2"/><rect x="137" y="180" width="86" height="25" fill="#7fb2df" opacity=".4"/>`;
      g += `<text x="262" y="80" font-size="13" fill="var(--ink)">${L2("sand stays", "বালু থেকে যায়")}</text><text x="232" y="196" font-size="13" fill="var(--ink)">${L2("clear filtrate", "স্বচ্ছ পরিস্রুত")}</text>`;
    } else {
      g += `<path d="M110 110 Q180 170 250 110 Z" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.2"/>` + crystals(150, 208, 116, 128, 18);
      g += `<line x1="140" y1="150" x2="220" y2="150" stroke="var(--muted)" stroke-width="3"/><path d="M180 196 q-14 -18 0 -38 q14 20 0 38 z" fill="#f59e0b"/><rect x="170" y="196" width="20" height="16" fill="var(--muted)"/>`;
      for (let k = 0; k < 3; k++) { const off = (t * 16 + k * 14) % 42; g += `<path d="M${160 + k * 20} ${100 - off} q5 -7 0 -14 q-5 -7 0 -14" fill="none" stroke="var(--muted)" stroke-width="2" opacity="${1 - off / 42}"/>`; }
      g += `<text x="262" y="124" font-size="13" fill="var(--ink)">${L2("pure salt", "বিশুদ্ধ লবণ")}</text>`;
    }
    g += `</svg>`;
    $("#k12ssv", el).innerHTML = g;
  };
  const render = () => {
    el.innerHTML = `<div style="font-weight:600;margin-bottom:4px">${S[st].h()}</div><div class="svgwrap fit" id="k12ssv"></div><div class="w-out">${S[st].o()}</div>${stepper12("k12s", S.length, st)}`;
    $("#k12sp", el).addEventListener("click", () => { st = Math.max(0, st - 1); t = 0; render(); });
    $("#k12sn", el).addEventListener("click", () => { st = Math.min(S.length - 1, st + 1); t = 0; render(); });
    draw();
  };
  render();
  if (!REDUCED) animate(el, dt => { t += dt; if ($("#k12ssv", el)) draw(); });
};

/* ================= 12.1 (b) baking powder / soda / yeast ================= */
W.k12bake = (el) => {
  let mode = 0, p = 0, run = false;
  const M = [() => L2("Baking powder", "বেকিং পাউডার"), () => L2("Baking soda only", "শুধু বেকিং সোডা"), () => L2("Yeast", "ইস্ট")];
  el.innerHTML = `<div class="chipset k12bm" role="group">${M.map((m, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${m()}</button>`).join("")}</div>
  <div id="k12bsl"></div>
  <div class="w-row" style="margin-top:6px"><button class="btn solid" id="k12bgo">${L2("Bake", "বেক করো")}</button><button class="btn" id="k12brs">${L2("Reset", "আবার")}</button></div>
  <div class="svgwrap fit" id="k12bsv"></div><div class="w-out" id="k12bo"></div>`;
  const setSl = () => {
    $("#k12bsl", el).innerHTML = mode < 2 ? slider("k12bg", L2("Baking soda in the mix", "মিশ্রণে বেকিং সোডা"), 0, 8.4, 0.42, 4.2, "g") : slider("k12bt", L2("Time in a warm place before baking", "বেক করার আগে উষ্ণ জায়গায় রাখার সময়"), 0, 90, 5, 45, L2("min", "মিনিট"));
    $("#k12bsl input", el).addEventListener("input", () => { p = 0; run = false; draw(); });
  };
  const calc = () => {
    if (mode < 2) { const g = sv(el, "k12bg", "g", 2), mol = g / 84 * (mode === 0 ? 1 : 0.5); return { g, mol, L: mol * 22.4, rise: Math.min(1, mol * 22.4 / 1.6) }; }
    const tm = sv(el, "k12bt", L2("min", "মিনিট")); return { tm, rise: 1 - Math.exp(-tm / 30) };
  };
  const draw = () => {
    const c = calc(), r = c.rise * p, h = 34 + 70 * r, y = 180 - h;
    const baked = p >= 1;
    let g = `<svg viewBox="0 50 360 150" role="img" aria-label="${L2("cake rising", "কেক ফুলছে")}">
      <rect x="20" y="186" width="320" height="8" rx="3" fill="var(--muted)"/>
      <path d="M90 ${y + 14} Q90 ${y} 110 ${y} H250 Q270 ${y} 270 ${y + 14} V180 H90 Z" fill="${baked ? "#c98a3d" : "#ecd29a"}" stroke="#8a5a2b" stroke-width="1.5"/>
      <path d="M84 110 V182 H276 V110" fill="none" stroke="var(--ink)" stroke-width="2.5"/>`;
    const nb = Math.round(40 * r);
    for (let i = 0; i < nb; i++) { const bx = 98 + (i * 47 % 164), by = y + 10 + (i * 29 % Math.max(8, h - 16)); g += `<circle cx="${bx}" cy="${Math.min(176, by)}" r="${1.5 + (i % 3)}" fill="var(--paper)" stroke="#8a5a2b" stroke-width=".6" opacity=".9"/>`; }
    g += `<text x="306" y="${Math.max(70, y + 10)}" font-size="13" fill="var(--ink)" text-anchor="middle">${L2("height", "উচ্চতা")}</text><text x="306" y="${Math.max(86, y + 26)}" font-size="14" font-weight="700" fill="var(--c)" text-anchor="middle">×${n12(h / 34, 1)}</text>`;
    if (p > 0 && p < 1) g += `<text x="180" y="66" font-size="14" text-anchor="middle" fill="var(--muted)">${L2("CO₂ bubbles forming…", "CO₂ বুদবুদ তৈরি হচ্ছে…")}</text>`;
    g += `</svg>`;
    $("#k12bsv", el).innerHTML = g;
    let o;
    if (mode === 0) o = `<b>2NaHCO<sub>3</sub> + C<sub>4</sub>H<sub>6</sub>O<sub>6</sub> → C<sub>4</sub>H<sub>4</sub>Na<sub>2</sub>O<sub>6</sub> + 2CO<sub>2</sub> + 2H<sub>2</sub>O</b><br>` + L2(`${n12(c.g, 2)} g NaHCO₃ = ${n12(c.mol, 3)} mol → ${n12(c.mol, 3)} mol CO₂ ≈ <b>${n12(c.L, 2)} L</b> at STP. Tasty and soft: the acid uses up all the soda.`, `${n12(c.g, 2)} g NaHCO₃ = ${n12(c.mol, 3)} mol → ${n12(c.mol, 3)} mol CO₂ ≈ STP-তে <b>${n12(c.L, 2)} L</b>। নরম আর সুস্বাদু: এসিড সব সোডা খরচ করে ফেলে।`);
    else if (mode === 1) o = `<b>2NaHCO<sub>3</sub> → Na<sub>2</sub>CO<sub>3</sub> + H<sub>2</sub>O + CO<sub>2</sub></b> (${L2("on heating", "তাপে")})<br>` + L2(`Only half the carbon becomes gas: ${n12(c.mol, 3)} mol CO₂ ≈ <b>${n12(c.L, 2)} L</b>. Na₂CO₃ stays in the cake, so it tastes <b>bitter and soapy</b>.`, `কার্বনের মাত্র অর্ধেক গ্যাস হয়: ${n12(c.mol, 3)} mol CO₂ ≈ <b>${n12(c.L, 2)} L</b>। Na₂CO₃ কেকে থেকে যায়, তাই স্বাদ <b>তেতো আর সাবানের মতো</b>।`);
    else o = L2(`Yeast feeds on sugar and releases CO₂ while the dough rests in a warm place (${n12(c.tm, 0)} min). In the oven the heat kills the yeast, and rising stops.`, `ময়দার দলা উষ্ণ জায়গায় থাকার সময় (${n12(c.tm, 0)} মিনিট) ইস্ট চিনি খেয়ে CO₂ ছাড়ে। ওভেনের তাপে ইস্ট মারা যায়, ফোলা বন্ধ হয়।`);
    $("#k12bo", el).innerHTML = o;
  };
  chips12(el, ".k12bm", b => { mode = +b.dataset.i; p = 0; run = false; setSl(); draw(); });
  $("#k12bgo", el).addEventListener("click", () => { if (REDUCED) { p = 1; draw(); } else { p = 0; run = true; } });
  $("#k12brs", el).addEventListener("click", () => { p = 0; run = false; draw(); });
  setSl(); draw();
  if (!REDUCED) animate(el, dt => { if (run) { p = Math.min(1, p + dt / 3); if (p >= 1) run = false; draw(); } });
};

/* ================= 12.1 (c) household pH shelf ================= */
W.k12ph = (el) => {
  const I = [
    { ph: 1, n: () => L2("Acid toilet cleaner", "এসিড টয়লেট ক্লিনার"), c: "HCl", w: () => L2("Dissolves scale and rust stains; kills germs by very low pH.", "খর পানির আস্তর ও মরিচার দাগ গলায়; খুব কম pH-এ জীবাণু মারে।"), warn: 1 },
    { ph: 2.2, n: () => L2("Lemon juice", "লেবুর রস"), c: L2("citric acid", "সাইট্রিক এসিড"), w: () => L2("Sour taste; a weak food acid.", "টক স্বাদ; খাবারের মৃদু এসিড।") },
    { ph: 2.8, n: () => L2("Vinegar", "ভিনেগার"), c: "CH3COOH", w: () => L2("4–10% ethanoic acid; its H⁺ ions stop bacteria in pickles.", "৪–১০% ইথানয়িক এসিড; এর H⁺ আয়ন আচারে ব্যাকটেরিয়া থামায়।") },
    { ph: 3.2, n: () => L2("Soft drink", "কোমল পানীয়"), c: "H2CO3", w: () => L2("CO₂ dissolved under pressure; acid + sugar can harm teeth.", "চাপে দ্রবীভূত CO₂; এসিড ও চিনি দাঁতের ক্ষতি করতে পারে।") },
    { ph: 5.2, n: () => L2("Healthy skin", "সুস্থ ত্বক"), c: "pH 4.8–5.5", w: () => L2("Slightly acidic; this helps keep germs away. Toiletries should suit it.", "সামান্য এসিডীয়; এটা জীবাণু দূরে রাখে। প্রসাধনী এর সাথে মানানসই হওয়া উচিত।") },
    { ph: 7, n: () => L2("Pure water", "বিশুদ্ধ পানি"), c: "H2O", w: () => L2("Neutral.", "নিরপেক্ষ।") },
    { ph: 8.3, n: () => L2("Baking soda solution", "বেকিং সোডার দ্রবণ"), c: "NaHCO3", w: () => L2("Mildly alkaline; neutralises acids (used as a quick antacid).", "মৃদু ক্ষারীয়; এসিড প্রশমিত করে (তাৎক্ষণিক এন্টাসিড হিসেবে)।") },
    { ph: 9.8, n: () => L2("Soap", "সাবান"), c: "R–COONa", w: () => L2("Alkaline; much higher than skin pH, so harsh soaps can dry the skin.", "ক্ষারীয়; ত্বকের pH-এর চেয়ে অনেক বেশি, তাই কড়া সাবান ত্বক শুষ্ক করতে পারে।") },
    { ph: 10.5, n: () => L2("Antacid (milk of magnesia)", "এন্টাসিড (মিল্ক অব ম্যাগনেসিয়া)"), c: "Mg(OH)2", w: () => L2("A weak base that neutralises extra stomach acid.", "মৃদু ক্ষারক, পাকস্থলীর বাড়তি এসিড প্রশমিত করে।") },
    { ph: 11.2, n: () => L2("Glass cleaner", "গ্লাস ক্লিনার"), c: "NH4OH", w: () => L2("Ammonia solution + isopropyl alcohol; strong fumes: ventilate.", "অ্যামোনিয়া দ্রবণ + আইসোপ্রোপাইল অ্যালকোহল; ঝাঁঝালো গন্ধ: বাতাস চলাচল রাখো।"), warn: 2 },
    { ph: 11.6, n: () => L2("Washing soda solution", "কাপড় কাচা সোডার দ্রবণ"), c: "Na2CO3·10H2O", w: () => L2("Alkaline; loosens grease and softens hard water.", "ক্ষারীয়; চর্বি আলগা করে ও খর পানি মৃদু করে।") },
    { ph: 12.5, n: () => L2("Bleach (hypochlorite)", "ব্লিচ (হাইপোক্লোরাইট)"), c: "NaOCl", w: () => L2("Gives HOCl → [O]; removes colour and kills germs.", "HOCl → [O] দেয়; রং তোলে ও জীবাণু মারে।"), warn: 3 }];
  let si = 2;
  el.innerHTML = `<div class="chipset k12pc" role="group">${I.map((it, i) => `<button data-i="${i}" aria-pressed="${i === si}">${it.n()}</button>`).join("")}</div><div class="svgwrap fit" id="k12psv" style="margin-top:8px"></div><div class="w-out" id="k12po"></div>`;
  const X = pH => 20 + pH / 14 * 320;
  const draw = () => {
    const it = I[si];
    let g = `<svg viewBox="0 0 360 120" role="img" aria-label="pH">`;
    for (let k = 0; k < 140; k++) g += `<rect x="${(20 + k * 320 / 140).toFixed(2)}" y="56" width="${(320 / 140 + 0.4).toFixed(2)}" height="22" fill="${uni12(k / 10)}"/>`;
    for (let k = 0; k <= 14; k += 1) g += `<line x1="${X(k)}" y1="78" x2="${X(k)}" y2="${k % 7 ? 83 : 87}" stroke="var(--ink)"/>` + (k % 2 === 0 ? `<text x="${X(k)}" y="100" font-size="13" text-anchor="middle" fill="var(--ink)">${B12(k)}</text>` : "");
    I.forEach((q, i) => { if (i !== si) g += `<circle cx="${X(q.ph)}" cy="52" r="3" fill="var(--muted)"/>`; });
    g += `<text x="${X(3)}" y="116" font-size="13" text-anchor="middle" fill="var(--bad)">${L2("acidic", "এসিডীয়")}</text><text x="${X(7)}" y="116" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("neutral", "নিরপেক্ষ")}</text><text x="${X(11)}" y="116" font-size="13" text-anchor="middle" fill="var(--c)">${L2("alkaline", "ক্ষারীয়")}</text>`;
    const x = X(it.ph), lx = Math.max(70, Math.min(290, x));
    g += `<path d="M${x} 54 l-8 -14 h16 z" fill="var(--ink)"/><text x="${lx}" y="30" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${it.n()}</text></svg>`;
    $("#k12psv", el).innerHTML = g;
    const kind = it.ph < 6.5 ? L2("acidic", "এসিডীয়") : it.ph > 7.5 ? L2("alkaline (basic)", "ক্ষারীয়") : L2("neutral", "নিরপেক্ষ");
    const warn = it.warn ? `<div style="margin-top:6px;padding:6px 8px;border-left:4px solid var(--bad);color:var(--ink)"><b style="color:var(--bad)">⚠ ${L2("Safety", "সতর্কতা")}:</b> ${it.warn === 1 ? L2("Never mix with bleach or bleaching powder: poisonous gas forms. Wear gloves.", "কখনো ব্লিচ বা ব্লিচিং পাউডারের সাথে মেশাবে না: বিষাক্ত গ্যাস তৈরি হয়। গ্লাভস পরো।") : it.warn === 2 ? L2("Never mix with bleach: poisonous gas forms.", "কখনো ব্লিচের সাথে মেশাবে না: বিষাক্ত গ্যাস তৈরি হয়।") : L2("Never mix with acid cleaners, vinegar or ammonia: poisonous gases form. Keep away from eyes and skin.", "কখনো এসিড ক্লিনার, ভিনেগার বা অ্যামোনিয়ার সাথে মেশাবে না: বিষাক্ত গ্যাস তৈরি হয়। চোখ ও ত্বক থেকে দূরে রাখো।")}</div>` : "";
    $("#k12po", el).innerHTML = `<b>${it.n()}</b>: pH ≈ ${n12(it.ph, 1)} (${kind}) · ${fx12(it.c)}<br>${it.w()}${warn}<div class="hint">${L2("Values are typical, approximate pH values.", "মানগুলো সাধারণ, আনুমানিক pH।")}</div>`;
  };
  chips12(el, ".k12pc", b => { si = +b.dataset.i; draw(); });
  draw();
};

W.k12home = (el) => hub12(el, [
  { n: () => L2("Salt from the sea", "সমুদ্র থেকে লবণ"), f: W.k12salt },
  { n: () => L2("Bake a cake", "কেক বানাও"), f: W.k12bake },
  { n: () => L2("pH of household things", "গৃহস্থালি জিনিসের pH"), f: W.k12ph }]);

/* ================= 12.2 (a) soap micelle ================= */
W.k12micelle = (el) => {
  const N = 16, TL = 17;
  let phase = 0, t = 0;
  const blob = { cx: 180, cy: 192, rx: 50, ry: 13 };
  const mol = Array.from({ length: N }, (_, i) => ({ x: 40 + (i * 53) % 280, y: -20 - (i * 17) % 40, ux: 0, uy: 1, tx: 0, ty: 0, tux: 0, tuy: 1 }));
  el.innerHTML = `<div class="w-row"><button class="btn solid" id="k12m1">1 · ${L2("Add soap", "সাবান দাও")}</button><button class="btn" id="k12m2">2 · ${L2("Rub", "ঘষো")}</button><button class="btn" id="k12m3">3 · ${L2("Rinse", "ধুয়ে ফেলো")}</button><button class="btn" id="k12m0">${L2("Reset", "আবার")}</button></div>
  <div class="svgwrap fit" id="k12msv"></div><div class="w-out" id="k12mo"></div>`;
  const targets = () => {
    const B = phase >= 2 ? bT : blobTarget();
    mol.forEach((m, i) => {
      if (phase === 0) { m.tx = 40 + (i * 53) % 280; m.ty = -30; m.tux = 0; m.tuy = 1; return; }
      if (phase === 1) {
        if (i % 4 === 3) { m.tx = 40 + (i * 61) % 280; m.ty = 40 + (i * 37) % 90; const a = i * 1.7; m.tux = Math.cos(a); m.tuy = Math.sin(a); return; }
        const k = Math.floor(i * 3 / 4), nOn = 12, phi = Math.PI + (k + 0.5) / nOn * Math.PI;
        const px = B.cx + B.rx * Math.cos(phi), py = B.cy + B.ry * Math.sin(phi);
        let nx = Math.cos(phi) / B.rx, ny = Math.sin(phi) / B.ry; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
        m.tx = px + nx * (TL - 5); m.ty = py + ny * (TL - 5); m.tux = -nx; m.tuy = -ny; return;
      }
      const a = (i + 0.5) / N * 2 * Math.PI, R = B.rx;
      m.tx = B.cx + (R + TL - 5) * Math.cos(a); m.ty = B.cy + (R + TL - 5) * Math.sin(a); m.tux = -Math.cos(a); m.tuy = -Math.sin(a);
    });
  };
  let bT = { cx: 180, cy: 192, rx: 50, ry: 13 };
  const blobTarget = () => phase < 2 ? { cx: 180, cy: 192, rx: 50, ry: 13 } : phase === 2 ? { cx: 180, cy: 110, rx: 26, ry: 26 } : { cx: 460, cy: 70, rx: 26, ry: 26 };
  const msg = () => [
    L2("An oily stain on cloth, with dust stuck to it. Water alone just rolls over it: oil and water do not mix.", "কাপড়ে তেলের দাগ, তাতে ধুলা লেগে আছে। শুধু পানি এর ওপর দিয়ে গড়িয়ে যায়: তেল আর পানি মেশে না।"),
    L2("Soap ions spread through the water. Their oil-loving <b>tails</b> dig into the oil; their water-loving <b>heads</b> stay in the water.", "সাবানের আয়ন পানিতে ছড়িয়ে পড়ে। তেলপ্রেমী <b>লেজগুলো</b> তেলে ঢুকে যায়; পানিপ্রেমী <b>মাথাগুলো</b> পানিতে থাকে।"),
    L2("Rubbing lifts the oil into a droplet completely wrapped by soap ions, heads outward: a <b>micelle</b>. The negative heads make droplets repel each other, so they stay suspended.", "ঘষলে তেল একটি ফোঁটা হয়ে ওঠে, চারদিক সাবান আয়নে মোড়া, মাথা বাইরের দিকে: একে বলে <b>মিসেল</b>। ঋণাত্মক মাথার জন্য ফোঁটাগুলো একে অপরকে বিকর্ষণ করে এবং পানিতে ভেসে থাকে।"),
    L2("Rinsing water carries the micelles, with the oil and dust inside, away. The cloth is clean!", "ধোয়ার পানি ভেতরে তেল-ধুলাসহ মিসেলগুলোকে ভাসিয়ে নিয়ে যায়। কাপড় পরিষ্কার!")][phase];
  const snap = () => { Object.assign(bT, blobTarget()); targets(); mol.forEach(m => { m.x = m.tx; m.y = m.ty; m.ux = m.tux; m.uy = m.tuy; }); };
  const draw = () => {
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("soap removing oil", "সাবান তেল তুলছে")}">
      <rect x="0" y="0" width="360" height="205" fill="#7fb2df" opacity=".22"/>
      <rect x="0" y="205" width="360" height="35" fill="#b08968"/>`;
    for (let x = 6; x < 360; x += 12) g += `<line x1="${x}" y1="207" x2="${x + 6}" y2="238" stroke="#8a6a4a" stroke-width="1"/>`;
    if (phase === 3) for (let k = 0; k < 4; k++) { const xx = ((t * 60 + k * 90) % 400) - 40; g += `<path d="M${xx} ${60 + k * 22} h30" stroke="var(--c)" stroke-width="2" marker-end="url(#k12ma)" opacity=".6"/>`; }
    g += arrowDefs("k12ma", "var(--c)");
    const b = bT;
    g += `<ellipse cx="${b.cx.toFixed(1)}" cy="${b.cy.toFixed(1)}" rx="${b.rx.toFixed(1)}" ry="${b.ry.toFixed(1)}" fill="#e9b949" stroke="#b8860b" stroke-width="1"/>`;
    for (let k = 0; k < 5; k++) g += `<circle cx="${(b.cx + (k - 2) * b.rx * 0.32).toFixed(1)}" cy="${(b.cy + ((k % 2) - 0.3) * b.ry * 0.35).toFixed(1)}" r="2" fill="#6b4f2a"/>`;
    mol.forEach(m => { if (m.y < -10) return; const ex = m.x + m.ux * TL, ey = m.y + m.uy * TL, nx = -m.uy * 2.5, ny = m.ux * 2.5;
      g += `<polyline points="${m.x.toFixed(1)},${m.y.toFixed(1)} ${(m.x + m.ux * TL * .33 + nx).toFixed(1)},${(m.y + m.uy * TL * .33 + ny).toFixed(1)} ${(m.x + m.ux * TL * .66 - nx).toFixed(1)},${(m.y + m.uy * TL * .66 - ny).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="var(--ink)" stroke-width="1.8"/><circle cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="4.8" fill="var(--c)"/><text x="${m.x.toFixed(1)}" y="${(m.y + 3.5).toFixed(1)}" font-size="9" text-anchor="middle" fill="var(--paper)">−</text>`; });
    if (phase === 0) g += `<text x="180" y="170" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("oil + dust", "তেল + ধুলা")}</text>`;
    if (phase === 3 && b.cx > 380) g += `<text x="180" y="190" font-size="15" font-weight="700" text-anchor="middle" fill="var(--good)">${L2("clean cloth ✓", "পরিষ্কার কাপড় ✓")}</text>`;
    g += `<g font-size="14" fill="var(--ink)"><circle cx="16" cy="16" r="5" fill="var(--c)"/><text x="26" y="20">${L2("head: hydrophilic", "মাথা: পানি আকর্ষী")}</text><line x1="186" y1="16" x2="204" y2="16" stroke="var(--ink)" stroke-width="2"/><text x="208" y="20">${L2("tail: hydrophobic", "লেজ: পানি বিকর্ষী")}</text></g></svg>`;
    $("#k12msv", el).innerHTML = g;
    $("#k12mo", el).innerHTML = msg();
  };
  const go = ph => { phase = ph; targets(); if (REDUCED) snap(); draw(); };
  $("#k12m1", el).addEventListener("click", () => go(1));
  $("#k12m2", el).addEventListener("click", () => { if (phase < 1) { phase = 1; targets(); snap(); } go(2); });
  $("#k12m3", el).addEventListener("click", () => { if (phase < 2) { phase = 2; targets(); snap(); } go(3); });
  $("#k12m0", el).addEventListener("click", () => { phase = 0; targets(); snap(); mol.forEach((m, i) => { m.y = -30; }); draw(); });
  targets(); snap(); draw();
  if (!REDUCED) animate(el, dt => {
    t += dt; const k = Math.min(1, dt * 2.2), B = blobTarget();
    ["cx", "cy", "rx", "ry"].forEach(q => bT[q] = lerp12(bT[q], B[q], k * (phase === 3 ? 0.6 : 1)));
    if (phase >= 2) targets();
    mol.forEach((m, i) => { const wig = phase === 1 && i % 4 === 3 ? 6 * Math.sin(t * 1.5 + i) : 0; m.x = lerp12(m.x, m.tx + wig, k); m.y = lerp12(m.y, m.ty, k); m.ux = lerp12(m.ux, m.tux, k); m.uy = lerp12(m.uy, m.tuy, k); const L = Math.hypot(m.ux, m.uy) || 1; m.ux /= L; m.uy /= L; });
    draw();
  });
};

/* ================= 12.2 (b) saponification ================= */
W.k12sapon = (el) => {
  let st = 0;
  const zig = (x, y, n, dx, up) => { let d = `M${x} ${y}`; for (let i = 1; i <= n; i++) d += ` L${x + i * dx} ${y + (i % 2 ? (up ? -6 : 6) : 0)}`; return d; };
  const chain = (x, y, lab) => `<path d="${zig(x, y, 9, 11, true)}" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="${x + 50}" y="${y + 19}" font-size="13" text-anchor="middle" fill="var(--muted)">${lab}</text>`;
  const S = [
    { h: () => L2("1. Fat + caustic soda", "১. চর্বি + কস্টিক সোডা") },
    { h: () => L2("2. Heat: the ester bonds break", "২. তাপ: এস্টার বন্ধন ভাঙে") },
    { h: () => L2("3. Add salt (NaCl): salting out", "৩. লবণ (NaCl) যোগ: সাবান পৃথককরণ") },
    { h: () => L2("4. Strain, add scent, mould", "৪. ছেঁকে, সুগন্ধি দিয়ে, ছাঁচে ঢালো") }];
  const draw = () => {
    let g = `<svg viewBox="0 0 360 210" role="img" aria-label="${S[st].h()}">`;
    if (st === 0) {
      g += `<text x="20" y="22" font-size="13" fill="var(--muted)">${L2("glyceryl tristearate (a fat)", "গ্লিসারাইল ট্রাইস্টিয়ারেট (চর্বি)")}</text>`;
      [50, 100, 150].forEach(y => { g += `<text x="20" y="${y + 5}" font-size="14" fill="var(--ink)">CH${y === 100 ? "" : "₂"}–O–C(=O)</text>` + chain(128, y, "C₁₇H₃₅"); });
      g += `<line x1="30" y1="58" x2="30" y2="140" stroke="var(--ink)" stroke-width="1.5"/>`;
      g += `<text x="300" y="80" font-size="15" text-anchor="middle" fill="var(--c)" font-weight="700">+ 3NaOH</text><text x="300" y="104" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("heat", "তাপ")}</text>`;
    } else if (st === 1) {
      [40, 90, 140].forEach(y => { g += chain(20, y, "C₁₇H₃₅") + `<text x="124" y="${y + 5}" font-size="14" fill="var(--ink)">–COO<tspan fill="var(--c)" font-weight="700">⁻ Na⁺</tspan></text>`; });
      g += `<text x="100" y="190" font-size="13" text-anchor="middle" fill="var(--c)">${L2("3 soap (sodium stearate)", "৩টি সাবান (সোডিয়াম স্টিয়ারেট)")}</text>`;
      g += `<text x="290" y="70" font-size="14" text-anchor="middle" fill="var(--ink)">CH₂–OH</text><text x="290" y="95" font-size="14" text-anchor="middle" fill="var(--ink)">CH–OH</text><text x="290" y="120" font-size="14" text-anchor="middle" fill="var(--ink)">CH₂–OH</text><text x="290" y="150" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("glycerine", "গ্লিসারিন")}</text>`;
    } else if (st === 2) {
      g += `<path d="M90 30 V190 H270 V30" fill="none" stroke="var(--ink)" stroke-width="2.5"/><rect x="92" y="95" width="176" height="94" fill="#7fb2df" opacity=".35"/>`;
      g += `<rect x="92" y="70" width="176" height="25" fill="#efe3c2" stroke="#b8a070"/><text x="180" y="87" font-size="13" text-anchor="middle" fill="#5b4a2a">${L2("soap cake", "সোপ কেক")}</text>`;
      g += `<text x="180" y="150" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("glycerine + salt water", "গ্লিসারিন + লবণ-পানি")}</text><text x="300" y="60" font-size="13" fill="var(--ink)">+ NaCl</text>`;
    } else {
      [60, 150, 240].forEach((x, i) => { g += `<rect x="${x}" y="80" width="70" height="42" rx="12" fill="${["#f2d7e6", "#dcefd6", "#f6e7b9"][i]}" stroke="var(--muted)"/><text x="${x + 35}" y="106" font-size="13" text-anchor="middle" fill="#333">${L2("soap", "সাবান")}</text>`; });
      g += `<text x="180" y="160" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("toilet soap: less alkali + scent", "প্রসাধনী সাবান: কম ক্ষার + সুগন্ধি")}</text><text x="180" y="180" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("laundry soap: more alkali, no scent", "লন্ড্রি সাবান: বেশি ক্ষার, সুগন্ধি নেই")}</text>`;
    }
    g += `</svg>`;
    return g;
  };
  const atoms = () => {
    const rows = [["C", 57, 57], ["H", 113, 113], ["O", 9, 9], ["Na", 3, 3]];
    return `<table style="border-collapse:collapse;margin-top:6px;font-size:14px"><tr><th style="padding:2px 8px;text-align:left">${L2("atom", "পরমাণু")}</th><th style="padding:2px 8px">${L2("left", "বাম")}</th><th style="padding:2px 8px">${L2("right", "ডান")}</th></tr>${rows.map(r => `<tr><td style="padding:2px 8px">${r[0]}</td><td style="padding:2px 8px;text-align:center">${B12(r[1])}</td><td style="padding:2px 8px;text-align:center">${B12(r[2])} <span style="color:var(--good)">✓</span></td></tr>`).join("")}</table>`;
  };
  const txt = () => [
    L2("A fat is a triester of glycerine with three long fatty-acid chains. It is heated with sodium hydroxide solution.", "চর্বি হলো গ্লিসারিনের সাথে তিনটি লম্বা ফ্যাটি এসিড শিকলের ট্রাই-এস্টার। একে সোডিয়াম হাইড্রোক্সাইড দ্রবণের সাথে তাপ দেওয়া হয়।"),
    `<b>(C<sub>17</sub>H<sub>35</sub>COO)<sub>3</sub>C<sub>3</sub>H<sub>5</sub> + 3NaOH → 3C<sub>17</sub>H<sub>35</sub>COONa + C<sub>3</sub>H<sub>5</sub>(OH)<sub>3</sub></b>` + atoms(),
    L2("Soap is much less soluble in salty water, so it separates and floats as the soap cake; glycerine stays dissolved below.", "লোনা পানিতে সাবান অনেক কম দ্রবণীয়, তাই আলাদা হয়ে সোপ কেক হিসেবে ভেসে ওঠে; গ্লিসারিন নিচে দ্রবীভূত থাকে।"),
    L2("Oil and alkali must be in the right proportion: leftover oil makes greasy soap with little lather; leftover alkali harms the skin.", "তেল ও ক্ষার সঠিক অনুপাতে লাগে: বাড়তি তেল সাবানকে তৈলাক্ত করে ও ফেনা কমায়; বাড়তি ক্ষার ত্বকের ক্ষতি করে।")][st];
  const render = () => {
    el.innerHTML = `<div style="font-weight:600;margin-bottom:4px">${S[st].h()}</div><div class="svgwrap fit">${draw()}</div><div class="w-out">${txt()}<div class="hint">${L2("Lab safety: NaOH is corrosive; goggles and gloves, teacher supervision.", "ল্যাব সতর্কতা: NaOH ক্ষয়কারী; গগলস ও গ্লাভস, শিক্ষকের তত্ত্বাবধান।")}</div></div>${stepper12("k12sp", S.length, st)}`;
    $("#k12spp", el).addEventListener("click", () => { st = Math.max(0, st - 1); render(); });
    $("#k12spn", el).addEventListener("click", () => { st = Math.min(S.length - 1, st + 1); render(); });
  };
  render();
};

/* ================= 12.2 (c) soap vs detergent in hard water ================= */
W.k12hard = (el) => {
  let det = false, shake = 0;
  el.innerHTML = `<div class="chipset k12hc" role="group"><button data-d="0" aria-pressed="true">${L2("Soap", "সাবান")}</button><button data-d="1" aria-pressed="false">${L2("Detergent", "ডিটারজেন্ট")}</button></div>
  ${slider("k12hh", L2("Hardness (Ca²⁺/Mg²⁺ ions)", "খরতা (Ca²⁺/Mg²⁺ আয়ন)"), 0, 6, 1, 3, "")}
  <div class="w-row"><button class="btn solid" id="k12hs">${L2("Shake", "ঝাঁকাও")}</button></div>
  <div class="svgwrap fit" id="k12hsv"></div><div class="w-out" id="k12ho"></div>`;
  const draw = () => {
    const ca = sv(el, "k12hh", ""), soap = 12, used = det ? 0 : Math.min(soap, 2 * ca), left = soap - used, curd = det ? 0 : Math.min(ca, 6);
    const foamH = (left / 12) * 52 * (0.35 + 0.65 * Math.min(1, shake));
    let g = `<svg viewBox="0 0 360 220" role="img" aria-label="${L2("lather test", "ফেনা পরীক্ষা")}">
      <path d="M110 30 V196 Q110 206 120 206 H240 Q250 206 250 196 V30" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="112" y="110" width="136" height="94" fill="#7fb2df" opacity=".35"/>`;
    for (let i = 0; i < Math.round(foamH * 1.4); i++) { const bx = 118 + (i * 37 % 124), by = 108 - (i * 13 % Math.max(4, foamH)); g += `<circle cx="${bx}" cy="${by}" r="${3 + i % 4}" fill="var(--paper)" stroke="var(--muted)" stroke-width=".8"/>`; }
    for (let i = 0; i < curd; i++) g += `<path d="M${124 + i * 20} ${198 - (i % 2) * 4} q6 -7 12 0 q-6 4 -12 0" fill="#9aa0a6" stroke="#6b7076"/>`;
    for (let i = 0; i < ca * 2; i++) if (det || i >= curd * 2) g += `<text x="${126 + (i * 29 % 110)}" y="${130 + (i * 17 % 50)}" font-size="11" fill="var(--c)">Ca²⁺</text>`;
    g += `<text x="300" y="${Math.max(40, 108 - foamH / 2)}" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("lather", "ফেনা")}</text>`;
    if (curd) g += `<text x="300" y="196" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("curd (scum)", "তলানি")}</text>`;
    g += `</svg>`;
    $("#k12hsv", el).innerHTML = g;
    const hard = ca === 0 ? L2("soft water", "মৃদু পানিতে") : ca <= 2 ? L2("slightly hard water", "সামান্য খর পানিতে") : ca <= 4 ? L2("hard water", "খর পানিতে") : L2("very hard water", "খুব খর পানিতে");
    $("#k12ho", el).innerHTML = (det
      ? L2(`<b>Detergent</b> in ${hard}: its calcium and magnesium salts are <b>soluble</b>, so all of it keeps cleaning and lathers well.`, `${hard} <b>ডিটারজেন্ট</b>: এর ক্যালসিয়াম ও ম্যাগনেসিয়াম লবণ <b>দ্রবণীয়</b>, তাই পুরোটাই পরিষ্কার করতে থাকে এবং ভালো ফেনা হয়।`)
      : L2(`<b>Soap</b> in ${hard}: ${B12(used)} of 12 soap units are wasted as insoluble curd; ${B12(left)} left to clean.`, `${hard} <b>সাবান</b>: ১২ একক সাবানের ${B12(used)} একক অদ্রবণীয় তলানি হয়ে নষ্ট; পরিষ্কারের জন্য বাকি ${B12(left)} একক।`) + `<br>2C<sub>17</sub>H<sub>35</sub>COONa + Ca<sup>2+</sup> → (C<sub>17</sub>H<sub>35</sub>COO)<sub>2</sub>Ca↓ + 2Na<sup>+</sup>`);
  };
  chips12(el, ".k12hc", b => { det = b.dataset.d === "1"; draw(); });
  $("#k12hh", el).addEventListener("input", draw);
  $("#k12hs", el).addEventListener("click", () => { shake = REDUCED ? 1 : 0; draw(); });
  shake = 1; draw();
  if (!REDUCED) animate(el, dt => { if (shake < 1) { shake = Math.min(1, shake + dt / 1.2); draw(); } });
};

/* ================= 12.2 (d) bleaching a stain ================= */
W.k12bleach = (el) => {
  let bl = true, p = 0, run = false;
  const G = [[70, 60], [290, 70], [95, 170], [270, 165], [180, 45], [60, 120], [300, 120], [200, 185]];
  el.innerHTML = `<div class="chipset k12lc" role="group"><button data-b="0" aria-pressed="false">${L2("Soap only", "শুধু সাবান")}</button><button data-b="1" aria-pressed="true">${L2("Bleaching powder + water", "ব্লিচিং পাউডার + পানি")}</button></div>
  <div class="w-row" style="margin-top:6px"><button class="btn solid" id="k12lgo">${L2("Apply", "প্রয়োগ করো")}</button><button class="btn" id="k12lrs">${L2("Reset", "আবার")}</button></div>
  <div class="svgwrap fit" id="k12lsv"></div><div class="w-out" id="k12lo"></div>
  <div class="w-out" style="border-left:4px solid var(--bad)"><b style="color:var(--bad)">⚠ ${L2("Safety", "সতর্কতা")}</b>: ${L2("Never mix bleach or bleaching powder with acid toilet cleaners, vinegar or ammonia (glass cleaner): poisonous gases are released. Use one product at a time, wear gloves, keep the room airy.", "ব্লিচ বা ব্লিচিং পাউডার কখনো এসিড টয়লেট ক্লিনার, ভিনেগার বা অ্যামোনিয়ার (গ্লাস ক্লিনার) সাথে মেশাবে না: বিষাক্ত গ্যাস বের হয়। একবারে একটি পণ্য ব্যবহার করো, গ্লাভস পরো, ঘরে বাতাস চলাচল রাখো।")}</div>`;
  const draw = () => {
    const stain = bl ? 1 - p : 1 - 0.15 * p, kill = bl ? p : 0.1 * p;
    let g = `<svg viewBox="0 0 360 220" role="img" aria-label="${L2("stain and germs", "দাগ ও জীবাণু")}">
      <rect x="20" y="20" width="320" height="180" rx="8" fill="var(--sheet)" stroke="var(--muted)"/>`;
    for (let y = 30; y < 200; y += 10) g += `<line x1="22" y1="${y}" x2="338" y2="${y}" stroke="var(--rule)" stroke-width=".6"/>`;
    g += `<path d="M140 90 q20 -30 55 -12 q30 10 22 38 q-8 30 -45 26 q-40 -4 -32 -52 z" fill="#1f3fa8" opacity="${(0.85 * stain).toFixed(2)}"/><path d="M200 70 l18 -8 M150 140 l-10 12" stroke="#1f3fa8" stroke-width="4" opacity="${(0.85 * stain).toFixed(2)}"/>`;
    G.forEach(([x, y], i) => { const dead = kill > (i + 1) / (G.length + 1); g += `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${dead ? "#9aa0a6" : "#3aa655"}"/>` + (dead ? `<path d="M${x - 5} ${y - 5} l10 10 M${x + 5} ${y - 5} l-10 10" stroke="var(--bad)" stroke-width="2"/>` : `<path d="M${x - 9} ${y} l-4 -3 M${x + 9} ${y} l4 -3" stroke="#3aa655" stroke-width="1.5"/>`); });
    if (bl && p > 0 && p < 1) for (let i = 0; i < 10; i++) g += `<text x="${40 + (i * 67 % 280)}" y="${40 + (i * 43 % 150)}" font-size="12" fill="var(--c)" opacity=".8">[O]</text>`;
    g += `</svg>`;
    $("#k12lsv", el).innerHTML = g;
    const step = Math.min(3, Math.floor(p * 4));
    const E = [`2Ca(OCl)Cl + 2H<sub>2</sub>O → CaCl<sub>2</sub> + Ca(OH)<sub>2</sub> + 2HOCl`, `HOCl → HCl + [O]`, L2("coloured matter + [O] → colourless matter", "রঙিন পদার্থ + [O] → বর্ণহীন পদার্থ"), L2("germs + [O] → dead germs", "জীবাণু + [O] → মৃত জীবাণু")];
    $("#k12lo", el).innerHTML = bl ? E.map((e, i) => `<div style="${p > 0 && i <= step ? "color:var(--ink);font-weight:600" : "color:var(--muted)"}">${e}</div>`).join("") + `<div class="hint">${L2("The [O] (nascent oxygen) picture is the textbook's simple model; HOCl/OCl⁻ are the real oxidisers.", "[O] (জায়মান অক্সিজেন) হলো পাঠ্যবইয়ের সরল মডেল; আসলে HOCl/OCl⁻ জারণ ঘটায়।")}</div>`
      : L2("Soap lifts oily dirt, but it cannot change the coloured ink molecules or reliably kill germs: the ink stain stays.", "সাবান তৈলাক্ত ময়লা তোলে, কিন্তু কালির রঙিন অণু বদলাতে বা নিশ্চিতভাবে জীবাণু মারতে পারে না: কালির দাগ থেকে যায়।");
  };
  chips12(el, ".k12lc", b => { bl = b.dataset.b === "1"; p = 0; run = false; draw(); });
  $("#k12lgo", el).addEventListener("click", () => { if (REDUCED) { p = 1; draw(); } else { p = 0; run = true; } });
  $("#k12lrs", el).addEventListener("click", () => { p = 0; run = false; draw(); });
  draw();
  if (!REDUCED) animate(el, dt => { if (run) { p = Math.min(1, p + dt / 3.5); if (p >= 1) run = false; draw(); } });
};

/* ================= 12.2 (e) Haber process ================= */
W.k12haber = (el) => {
  /* approximate equilibrium % NH3 (N2:H2 = 1:3); classic data table */
  const TT = [300, 400, 500, 600], PP = [10, 30, 50, 100, 300];
  const Y = [[14.7, 30.3, 39.4, 52.0, 71.0], [3.9, 10.2, 15.3, 25.1, 47.0], [1.2, 3.5, 5.6, 10.6, 26.4], [0.5, 1.4, 2.3, 4.5, 13.8]];
  const yld = (T, P) => {
    const lp = Math.log(P), lps = PP.map(Math.log);
    let j = 0; while (j < PP.length - 2 && lp > lps[j + 1]) j++;
    let i = 0; while (i < TT.length - 2 && T > TT[i + 1]) i++;
    const u = (lp - lps[j]) / (lps[j + 1] - lps[j]), v = (T - TT[i]) / (TT[i + 1] - TT[i]);
    const L = (a, b) => Math.log(Y[a][b]);
    const top = L(i, j) + (L(i, j + 1) - L(i, j)) * u, bot = L(i + 1, j) + (L(i + 1, j + 1) - L(i + 1, j)) * u;
    return Math.exp(top + (bot - top) * v);
  };
  el.innerHTML = `${slider("k12aT", L2("Temperature", "তাপমাত্রা"), 300, 600, 10, 450, "°C")}${slider("k12aP", L2("Pressure", "চাপ"), 10, 300, 10, 200, "atm")}
  <div class="chipset k12ac" role="group"><button data-c="1" aria-pressed="true">${L2("Fe catalyst on", "Fe প্রভাবক আছে")}</button><button data-c="0" aria-pressed="false">${L2("No catalyst", "প্রভাবক নেই")}</button></div>
  <div class="svgwrap fit" id="k12asv" style="margin-top:6px"></div><div class="w-out" id="k12ao"></div>`;
  let cat = true;
  const draw = () => {
    const T = sv(el, "k12aT", "°C"), P = sv(el, "k12aP", "atm"), y = yld(T, P);
    const rate = Math.exp(-(cat ? 8000 : 20000) * (1 / (T + 273) - 1 / 773)) * (cat ? 1 : 0.02) * Math.sqrt(P / 200);
    const X = t => 40 + (t - 300) / 300 * 250, Yp = v => 170 - v / 80 * 140;
    let g = `<svg viewBox="0 0 360 215" role="img" aria-label="${L2("ammonia yield graph", "অ্যামোনিয়ার পরিমাণের লেখচিত্র")}">
      <rect x="${X(450)}" y="30" width="${X(550) - X(450)}" height="140" fill="var(--c-soft)" opacity=".6"/>
      <text x="${X(500)}" y="44" font-size="12" text-anchor="middle" fill="var(--c)">${L2("used in industry", "শিল্পে ব্যবহৃত")}</text>
      <line x1="40" y1="170" x2="290" y2="170" stroke="var(--ink)"/><line x1="40" y1="30" x2="40" y2="170" stroke="var(--ink)"/>`;
    [0, 20, 40, 60, 80].forEach(v => g += `<text x="34" y="${Yp(v) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B12(v)}</text><line x1="40" y1="${Yp(v)}" x2="290" y2="${Yp(v)}" stroke="var(--rule)" stroke-width=".6"/>`);
    [300, 400, 500, 600].forEach(t => g += `<text x="${X(t)}" y="186" font-size="12" text-anchor="middle" fill="var(--muted)">${B12(t)}</text>`);
    let d = ""; for (let t = 300; t <= 600; t += 5) d += (t === 300 ? "M" : " L") + X(t).toFixed(1) + " " + Yp(yld(t, P)).toFixed(1);
    g += `<path d="${d}" fill="none" stroke="var(--c)" stroke-width="2.5"/><circle cx="${X(T)}" cy="${Yp(y)}" r="6" fill="var(--ink)"/>`;
    g += `<text x="165" y="204" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("temperature (°C)", "তাপমাত্রা (°C)")}</text><text x="14" y="22" font-size="12" fill="var(--ink)">% NH₃</text>`;
    const rb = Math.min(1, rate / 3);
    g += `<text x="325" y="22" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("speed", "গতি")}</text><rect x="312" y="30" width="26" height="140" fill="none" stroke="var(--muted)"/><rect x="312" y="${170 - 140 * rb}" width="26" height="${140 * rb}" fill="var(--note)"/>`;
    g += `</svg>`;
    $("#k12asv", el).innerHTML = g;
    let note = [];
    if (T < 420) note.push(L2("More NH₃ at equilibrium, but the reaction is slow.", "সাম্যাবস্থায় NH₃ বেশি, কিন্তু বিক্রিয়া ধীর।"));
    if (T > 560) note.push(L2("Fast, but the exothermic reaction shifts back: little NH₃.", "দ্রুত, কিন্তু তাপোৎপাদী বিক্রিয়া পেছনে সরে যায়: NH₃ কম।"));
    if (P < 100) note.push(L2("Low pressure favours the side with more gas molecules (N₂ + 3H₂).", "কম চাপ বেশি গ্যাস অণুর দিক (N₂ + 3H₂) সমর্থন করে।"));
    if (!cat) note.push(L2("Without the iron catalyst, equilibrium is reached far too slowly (the equilibrium amount itself is unchanged).", "লোহা প্রভাবক ছাড়া সাম্যাবস্থায় পৌঁছাতে অনেক বেশি সময় লাগে (সাম্যাবস্থার পরিমাণ নিজে বদলায় না)।"));
    if (T >= 450 && T <= 550 && P >= 200 && P <= 250 && cat) note.push(L2("This is the book's industrial window: a compromise between amount and speed.", "এটাই বইয়ের শিল্প-শর্ত: পরিমাণ আর গতির মধ্যে আপস।"));
    $("#k12ao", el).innerHTML = `N<sub>2</sub>(g) + 3H<sub>2</sub>(g) ⇌ 2NH<sub>3</sub>(g) + 92 kJ<br>${L2("NH₃ in the equilibrium mixture", "সাম্য মিশ্রণে NH₃")} ≈ <b>${n12(y, 1)}%</b>. ${note.join(" ")}<div class="hint">${L2("Approximate equilibrium data; real plants liquefy the NH₃ and recycle unreacted gases.", "আনুমানিক সাম্য-উপাত্ত; বাস্তব কারখানায় NH₃ তরল করে আলাদা করা হয় আর অবিক্রিত গ্যাস আবার ফেরত পাঠানো হয়।")}</div>`;
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", draw));
  chips12(el, ".k12ac", b => { cat = b.dataset.c === "1"; draw(); });
  draw();
};

W.k12clean = (el) => hub12(el, [
  { n: () => L2("Soap in action", "সাবানের কাজ"), f: W.k12micelle },
  { n: () => L2("Make soap", "সাবান তৈরি"), f: W.k12sapon },
  { n: () => L2("Hard water", "খর পানি"), f: W.k12hard },
  { n: () => L2("Bleach a stain", "দাগ তোলা"), f: W.k12bleach },
  { n: () => L2("Haber process", "হেবার পদ্ধতি"), f: W.k12haber }]);

/* ================= 12.3 (a) soil pH ================= */
W.k12soil = (el) => {
  let lime = true;
  el.innerHTML = `${slider("k12o0", L2("Soil pH before treatment", "প্রয়োগের আগে মাটির pH"), 4, 9, 0.1, 4.8, "")}
  <div class="chipset k12oc" role="group"><button data-l="1" aria-pressed="true">${L2("Limestone (CaCO₃)", "চুনাপাথর (CaCO₃)")}</button><button data-l="0" aria-pressed="false">${L2("Ammonium sulphate", "অ্যামোনিয়াম সালফেট")}</button></div>
  ${slider("k12od", L2("Amount added (illustrative)", "প্রয়োগের পরিমাণ (উদাহরণমাত্র)"), 0, 10, 1, 0, L2("units", "একক"))}
  <div class="svgwrap fit" id="k12osv"></div><div class="w-out" id="k12oo"></div>`;
  const draw = () => {
    const p0 = sv(el, "k12o0", "", 1), d = sv(el, "k12od", L2("units", "একক"));
    let p = p0;
    if (lime) { if (p0 < 8.2) p = p0 + (8.2 - p0) * (1 - Math.exp(-0.16 * d)); }
    else { if (p0 > 4.5) p = p0 - (p0 - 4.5) * (1 - Math.exp(-0.12 * d)); }
    const good = p >= 6 && p <= 7.5, ok = p >= 5.5 && p <= 8, hgt = good ? 1 : ok ? 0.7 : 0.4, col = good ? "#3f9b3a" : ok ? "#8fb33a" : "#c9b340";
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("field and soil pH", "জমি ও মাটির pH")}">
      <rect x="0" y="168" width="360" height="32" fill="#8b6b45"/><rect x="0" y="168" width="360" height="32" fill="${uni12(p)}" opacity=".3"/>`;
    for (let k = 0; k < 9; k++) { const x = 25 + k * 38; for (let j = -2; j <= 2; j++) g += `<path d="M${x} 168 q${j * 3} ${-55 * hgt} ${j * 8} ${-100 * hgt}" fill="none" stroke="${col}" stroke-width="2.6"/>`; }
    const X = v => 20 + v / 14 * 320;
    for (let k = 0; k < 70; k++) g += `<rect x="${(20 + k * 320 / 70).toFixed(1)}" y="20" width="${(320 / 70 + .4).toFixed(2)}" height="12" fill="${uni12(k / 5)}"/>`;
    g += `<rect x="${X(6)}" y="17" width="${X(7.5) - X(6)}" height="18" fill="none" stroke="var(--good)" stroke-width="2"/>`;
    g += `<path d="M${X(p0)} 36 l-5 8 h10 z" fill="var(--muted)"/><path d="M${X(p)} 36 l-6 10 h12 z" fill="var(--ink)"/>`;
    [0, 4, 7, 10, 14].forEach(v => g += `<text x="${X(v)}" y="60" font-size="13" text-anchor="middle" fill="var(--muted)">${B12(v)}</text>`);
    g += `<text x="${X(6.75)}" y="12" font-size="12" text-anchor="middle" fill="var(--good)">${L2("best for most crops", "বেশিরভাগ ফসলের জন্য ভালো")}</text></svg>`;
    $("#k12osv", el).innerHTML = g;
    const eq = lime ? `CaCO<sub>3</sub> + 2H<sup>+</sup> → Ca<sup>2+</sup> + CO<sub>2</sub> + H<sub>2</sub>O` : `(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub> ${L2("solution is slightly acidic: NH₄⁺ ⇌ NH₃ + H⁺", "দ্রবণ সামান্য এসিডীয়: NH₄⁺ ⇌ NH₃ + H⁺")}`;
    let adv = "";
    if (lime && p0 >= 7.5 && d > 0) adv = L2(" Limestone does not help alkaline soil; it can only remove H⁺.", " ক্ষারীয় মাটিতে চুনাপাথর কাজে আসে না; এটি শুধু H⁺ সরাতে পারে।");
    if (!lime && p0 <= 5.5 && d > 0) adv = L2(" Careful: this soil is already acidic, and ammonium sulphate makes it more acidic.", " সাবধান: মাটি আগেই এসিডীয়, অ্যামোনিয়াম সালফেট একে আরও এসিডীয় করে।");
    $("#k12oo", el).innerHTML = `${eq}<br>pH: ${n12(p0, 1)} → <b>${n12(p, 1)}</b> · ${good ? L2("good for most crops ✓", "বেশিরভাগ ফসলের জন্য ভালো ✓") : p < 6 ? L2("still too acidic", "এখনো বেশি এসিডীয়") : L2("too alkaline", "বেশি ক্ষারীয়")}.${adv}<div class="hint">${L2("A simple picture only: real doses are decided from a soil test.", "শুধু একটি সরল ছবি: আসল মাত্রা ঠিক হয় মাটি পরীক্ষা করে।")}</div>`;
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", draw));
  chips12(el, ".k12oc", b => { lime = b.dataset.l === "1"; draw(); });
  draw();
};

/* ================= 12.3 (b) preserving food ================= */
W.k12preserve = (el) => {
  const F = [
    { n: () => L2("Fish (ilish)", "মাছ (ইলিশ)"), m: [
      { n: () => L2("Ice", "বরফ"), r: 0.28, w: () => L2("Cold slows bacteria and the fish's own enzymes.", "ঠান্ডায় ব্যাকটেরিয়া আর মাছের নিজের এনজাইমের কাজ ধীর হয়।") },
      { n: () => L2("Salt + drying (shutki)", "লবণ + শুকানো (শুঁটকি)"), r: 0.12, w: () => L2("Salt and drying pull water out of microbes (osmosis).", "লবণ আর শুকানো জীবাণুর দেহ থেকে পানি টেনে নেয় (অভিস্রবণ)।") },
      { n: () => L2("Formalin", "ফরমালিন"), bad: () => L2("Formalin (formaldehyde solution) is poisonous. The fish may look fresh, but eating it harms the body and can even kill. Never use it on food.", "ফরমালিন (ফরমালডিহাইড দ্রবণ) বিষাক্ত। মাছ টাটকা দেখালেও খেলে শরীরের ক্ষতি হয়, মৃত্যুও হতে পারে। খাবারে কখনো নয়।") }] },
    { n: () => L2("Green mango achar", "কাঁচা আমের আচার"), m: [
      { n: () => L2("Vinegar", "ভিনেগার"), r: 0.08, w: () => L2("Ethanoic acid's H⁺ ions make it too acidic for bacteria.", "ইথানয়িক এসিডের H⁺ আয়ন একে ব্যাকটেরিয়ার জন্য বেশি এসিডীয় করে তোলে।") },
      { n: () => L2("Salt + oil", "লবণ + তেল"), r: 0.16, w: () => L2("Salt draws out water; oil keeps air away.", "লবণ পানি টেনে নেয়; তেল বাতাস আটকে রাখে।") },
      { n: () => L2("Sodium benzoate", "সোডিয়াম বেনজোয়েট"), r: 0.12, w: () => L2("An approved preservative, safe within the permitted amount.", "অনুমোদিত সংরক্ষক, নির্ধারিত মাত্রায় নিরাপদ।") }] },
    { n: () => L2("Mango (to ripen)", "আম (পাকাতে)"), m: [
      { n: () => L2("Ripen naturally", "প্রাকৃতিকভাবে পাকানো"), r: 1, ripe: 1, w: () => L2("Ripe fruit releases ethylene, the natural ripening hormone; nearby fruit ripen slowly and evenly.", "পাকা ফল ইথিলিন ছাড়ে, যা প্রাকৃতিক পাকানোর হরমোন; পাশের ফল ধীরে ও সমানভাবে পাকে।") },
      { n: () => L2("Calcium carbide", "ক্যালসিয়াম কার্বাইড"), bad: () => L2("CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂. The acetylene forces quick ripening, and industrial carbide can carry arsenic and phosphorus impurities. The fruit may look yellow but be unripe inside. Not allowed.", "CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂। অ্যাসিটিলিন জোর করে দ্রুত পাকায়, আর শিল্পের কার্বাইডে আর্সেনিক ও ফসফরাস অপদ্রব্য থাকতে পারে। ফল হলুদ দেখালেও ভেতরে কাঁচা থাকতে পারে। অনুমোদিত নয়।") }] },
    { n: () => L2("Guava jam", "পেয়ারার জ্যাম"), m: [
      { n: () => L2("Lots of sugar", "প্রচুর চিনি"), r: 0.1, w: () => L2("Concentrated sugar pulls water out of microbes by osmosis.", "ঘন চিনি অভিস্রবণে জীবাণুর দেহ থেকে পানি টেনে নেয়।") },
      { n: () => L2("Sugar + sodium benzoate", "চিনি + সোডিয়াম বেনজোয়েট"), r: 0.06, w: () => L2("Sugar plus an approved preservative keeps an opened jar good longer.", "চিনির সাথে অনুমোদিত সংরক্ষক খোলা বয়ামকে আরও বেশিদিন ভালো রাখে।") }] }];
  let fi = 0, mi = 0;
  el.innerHTML = `<div class="chipset k12ff" role="group">${F.map((f, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${f.n()}</button>`).join("")}</div><div class="chipset k12fm" role="group" style="margin-top:6px"></div><div class="svgwrap fit" id="k12fsv" style="margin-top:6px"></div><div class="w-out" id="k12fo"></div>`;
  const setM = () => {
    $(".k12fm", el).innerHTML = F[fi].m.map((m, i) => `<button data-i="${i}" aria-pressed="${i === mi}" ${m.bad ? 'style="border-color:var(--bad)"' : ""}>${m.n()}</button>`).join("");
    chips12(el, ".k12fm", b => { mi = +b.dataset.i; draw(); });
  };
  const curve = r => { let d = ""; for (let i = 0; i <= 50; i++) { const x = 40 + i * 5.6, tt = i / 50 * 10, y = 1 / (1 + Math.exp(-(r * tt * 1.6 - 4))); d += (i ? " L" : "M") + x.toFixed(1) + " " + (160 - 120 * y).toFixed(1); } return d; };
  const draw = () => {
    const m = F[fi].m[mi];
    let g = `<svg viewBox="0 0 360 190" role="img" aria-label="${L2("microbe growth", "জীবাণুর বৃদ্ধি")}">`;
    if (m.bad) {
      g += `<rect x="20" y="20" width="320" height="150" rx="10" fill="none" stroke="var(--bad)" stroke-width="3"/><text x="180" y="80" font-size="40" text-anchor="middle" fill="var(--bad)">⚠</text><text x="180" y="125" font-size="17" font-weight="700" text-anchor="middle" fill="var(--bad)">${L2("Unsafe: not allowed", "অনিরাপদ: অনুমোদিত নয়")}</text>`;
    } else if (m.ripe) {
      [0, 1, 2, 3].forEach(k => g += `<ellipse cx="${70 + k * 72}" cy="95" rx="26" ry="34" fill="${mix12("#5a9e3a", "#f2b632", k / 3)}" transform="rotate(-15 ${70 + k * 72} 95)"/><text x="${70 + k * 72}" y="155" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("day", "দিন")} ${B12(k * 2 + 1)}</text>`);
      g += `<text x="180" y="30" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("ethylene from ripe fruit → slow, even ripening", "পাকা ফলের ইথিলিন → ধীর, সমান পাকা")}</text>`;
    } else {
      g += `<line x1="40" y1="160" x2="330" y2="160" stroke="var(--ink)"/><line x1="40" y1="30" x2="40" y2="160" stroke="var(--ink)"/>`;
      g += `<path d="${curve(1)}" fill="none" stroke="var(--bad)" stroke-width="2.5" stroke-dasharray="6 4"/><path d="${curve(m.r)}" fill="none" stroke="var(--good)" stroke-width="3"/>`;
      g += `<text x="200" y="176" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("time →", "সময় →")}</text><text x="46" y="26" font-size="12" fill="var(--ink)">${L2("microbes", "জীবাণু")}</text>`;
      g += `<text x="330" y="24" font-size="12" text-anchor="end" fill="var(--bad)">${L2("left at room temperature", "সাধারণ তাপমাত্রায় রাখলে")}</text><text x="230" y="${m.r < 0.5 ? 150 : 90}" font-size="12" fill="var(--good)">${m.n()}</text>`;
    }
    g += `</svg>`;
    $("#k12fsv", el).innerHTML = g;
    $("#k12fo", el).innerHTML = m.bad ? `<b style="color:var(--bad)">${m.n()}</b>: ${m.bad()}` : `<b>${m.n()}</b>: ${m.w()}` + (m.ripe ? "" : `<div class="hint">${L2("A qualitative picture of how fast microbes multiply.", "জীবাণু কত দ্রুত বাড়ে তার একটি গুণগত ছবি।")}</div>`);
  };
  chips12(el, ".k12ff", b => { fi = +b.dataset.i; mi = 0; setM(); draw(); });
  setM(); draw();
};

/* ================= 12.3 (c) industrial waste pathways ================= */
W.k12waste = (el) => {
  const S = [
    { n: () => L2("Tannery", "ট্যানারি"), m: "Cr", w: () => L2("Chromium salts used to tan leather end up in the waste water.", "চামড়া ট্যান করার ক্রোমিয়াম লবণ বর্জ্য পানিতে চলে যায়।") },
    { n: () => L2("Paint", "রং শিল্প"), m: "Pb", w: () => L2("Lead compounds in some paints; lead harms children's growing brains.", "কিছু রঙে লেড যৌগ থাকে; লেড শিশুদের বেড়ে ওঠা মস্তিষ্কের ক্ষতি করে।") },
    { n: () => L2("Pesticide", "কীটনাশক"), m: "Hg, Cd", w: () => L2("Mercury and cadmium compounds in waste from pesticide industries.", "কীটনাশক শিল্পের বর্জ্যে মার্কারি ও ক্যাডমিয়াম যৌগ।") },
    { n: () => L2("Soap factory", "সাবান কারখানা"), m: "NaOH", w: () => L2("Caustic soda raises the pH of water; fish and water plants cannot live properly.", "কস্টিক সোডা পানির pH বাড়ায়; মাছ ও জলজ উদ্ভিদ ঠিকমতো বাঁচতে পারে না।") }];
  let si = 0, etp = false;
  el.innerHTML = `<div class="chipset k12wc" role="group">${S.map((s, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${s.n()}</button>`).join("")}</div>
  <div class="chipset k12we" role="group" style="margin-top:6px"><button data-e="0" aria-pressed="true">${L2("Waste dumped untreated", "অপরিশোধিত বর্জ্য")}</button><button data-e="1" aria-pressed="false">${L2("With an ETP", "ETP দিয়ে পরিশোধিত")}</button></div>
  <div class="svgwrap fit" id="k12wsv" style="margin-top:6px"></div><div class="w-out" id="k12wo"></div>`;
  const box = (x, y, w, h, t1, t2, on) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${on ? "var(--c-soft)" : "var(--sheet)"}" stroke="${on ? "var(--c)" : "var(--muted)"}" stroke-width="${on ? 2 : 1}"/><text x="${x + w / 2}" y="${y + (t2 ? h / 2 - 2 : h / 2 + 5)}" font-size="13" text-anchor="middle" fill="var(--ink)">${t1}</text>${t2 ? `<text x="${x + w / 2}" y="${y + h / 2 + 14}" font-size="12" text-anchor="middle" fill="var(--muted)">${t2}</text>` : ""}`;
  const draw = () => {
    const s = S[si], metal = s.m !== "NaOH", on = !etp;
    let g = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("path of pollution", "দূষণের পথ")}">${arrowDefs("k12wa", on ? "var(--bad)" : "var(--muted)")}`;
    g += box(110, 8, 140, 44, s.n(), s.m, true);
    if (etp) g += box(256, 10, 98, 40, "ETP", L2("cleans water", "পানি পরিশোধন"), true);
    const ar = (x1, y1, x2, y2, act) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${act ? "var(--bad)" : "var(--muted)"}" stroke-width="${act ? 2.5 : 1.5}" ${act ? "" : 'stroke-dasharray="5 4"'} marker-end="url(#k12wa)"/>`;
    g += ar(160, 52, 90, 104, on) + ar(200, 52, 270, 104, on);
    g += box(30, 108, 120, 40, L2("River / pond", "নদী / পুকুর"), "", on) + box(210, 108, 120, 40, L2("Soil", "মাটি"), "", on);
    g += ar(90, 148, 90, 186, on) + ar(270, 148, 270, 186, on && metal) + ar(140, 148, 230, 186, on && metal);
    g += box(30, 190, 120, 40, L2("Fish", "মাছ"), on ? (metal ? s.m : "pH ↑") : "", on) + box(210, 190, 120, 40, L2("Crops, fruit", "ফসল, ফল"), on && metal ? s.m : "", on && metal);
    g += ar(90, 230, 160, 256, on && metal) + ar(270, 230, 200, 256, on && metal);
    g += box(110, 256, 140, 40, L2("People", "মানুষ"), on && metal ? L2("kidney, liver", "কিডনি, লিভার") : "", on && metal);
    g += `</svg>`;
    $("#k12wsv", el).innerHTML = g;
    $("#k12wo", el).innerHTML = etp
      ? L2("An effluent treatment plant removes most metals and neutralises alkali before the water is released, breaking the chain at the start.", "বর্জ্য পরিশোধনাগার পানি ছাড়ার আগে বেশিরভাগ ধাতু সরিয়ে ফেলে এবং ক্ষার প্রশমিত করে, ফলে শুরুতেই শিকল ভেঙে যায়।")
      : `<b>${s.n()}</b>: ${s.w()} ` + (metal ? L2("Heavy metals are not broken down; they build up along the food chain (bioaccumulation) and damage the kidneys and liver.", "ভারী ধাতু ভাঙে না; খাদ্যশিকল ধরে জমতে থাকে (জৈব সঞ্চয়ন) এবং কিডনি ও লিভারের ক্ষতি করে।") : "");
  };
  chips12(el, ".k12wc", b => { si = +b.dataset.i; draw(); });
  chips12(el, ".k12we", b => { etp = b.dataset.e === "1"; draw(); });
  draw();
};

W.k12agri = (el) => hub12(el, [
  { n: () => L2("Fix soil pH", "মাটির pH ঠিক করো"), f: W.k12soil },
  { n: () => L2("Preserve food", "খাদ্য সংরক্ষণ"), f: W.k12preserve },
  { n: () => L2("Industrial waste", "শিল্প বর্জ্য"), f: W.k12waste }]);
