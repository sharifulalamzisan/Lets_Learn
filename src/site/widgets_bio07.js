/* ---- biology chapter 7 widgets: exchange of gases ---- */
const B7 = x => bnNum(x, LANG);
const chipsB7 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T7 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "", halo = false) => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${halo ? ` paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"` : ""}>${s}</text>`;
const AR7 = (x1, y1, x2, y2, id, c, w = 2.5, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;
const LD7 = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1"/>`;
const O27 = "var(--bad)", CO27 = "#3b82c4", LEAF7 = "#4a9d5b", MUS7 = "#b0643c", MUC7 = "#d9c35a";
const UL7 = a => `<ul style="margin:4px 0 0;padding-left:20px">${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
const along7 = (pts, u) => {
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const k = seg[i] ? d / seg[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } d -= seg[i]; }
  return pts[pts.length - 1];
};

/* 7.1 gas exchange in a plant: day-night balance + the two doors (stoma, lenticel) */
W.b7plant = (el) => {
  let view = "day", door = "stoma", open = true;
  const R = 2;
  el.innerHTML = `<div class="chipset b7pv" role="group"><button data-v="day" aria-pressed="true">${B7(1)}. ${L2("Day and night", "দিন ও রাত")}</button><button data-v="door" aria-pressed="false">${B7(2)}. ${L2("The doors", "গ্যাসের দরজা")}</button></div><div id="b7pb" style="margin-top:8px"></div>`;
  const clock = t => { const h = Math.floor(t), m = Math.round((t - h) * 60); return B7(String(h % 24).padStart(2, "0") + ":" + String(m).padStart(2, "0")); };
  const drawDay = () => {
    const t = +$("#b7pt", el).value;
    const light = t > 6 && t < 18 ? Math.sin((t - 6) / 12 * Math.PI) : 0;
    const P = Math.round(12 * light), net = P - R, rec = Math.min(P, R);
    const phase = P === 0 ? L2("night", "রাত") : P <= R ? (t < 12 ? L2("dawn", "ভোর") : L2("dusk", "সন্ধ্যা")) : L2("day", "দিন");
    $("#b7pt-v", el).textContent = clock(t) + " · " + phase;
    let s = `<svg viewBox="0 0 360 296" role="img" aria-label="${L2("Gas exchange of a leaf through the day", "দিনের বিভিন্ন সময়ে পাতার গ্যাসীয় বিনিময়")}">${arrowDefs("b7pa", O27)}${arrowDefs("b7pc", CO27)}`;
    s += `<rect x="2" y="2" width="356" height="54" rx="12" fill="${P > 0 ? "#f2b233" : "var(--ink)"}" opacity="${P > 0 ? (0.1 + 0.16 * light).toFixed(2) : 0.16}"/>`;
    if (t > 6 && t < 18) {
      const sx = 24 + (t - 6) / 12 * 312, sy = 46 - 30 * light;
      s += [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const c = Math.cos(a * Math.PI / 180), n = Math.sin(a * Math.PI / 180); return `<line x1="${(sx + c * 11).toFixed(1)}" y1="${(sy + n * 11).toFixed(1)}" x2="${(sx + c * 16).toFixed(1)}" y2="${(sy + n * 16).toFixed(1)}" stroke="#e0a021" stroke-width="2" stroke-linecap="round"/>`; }).join("") + `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="8" fill="#f2b233"/>`;
    } else {
      s += `<path d="M300 14 a13 13 0 1 0 11 20 a10 10 0 1 1 -11 -20 z" fill="#d8d2a8" stroke="var(--muted)" stroke-width="1"/>` + [[60, 20], [120, 38], [190, 16], [240, 34], [338, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="var(--ink)"/>`).join("");
    }
    s += `<rect x="14" y="64" width="332" height="150" rx="30" fill="var(--c-soft)" stroke="${LEAF7}" stroke-width="2.5"/>` + T7(180, 83, L2("inside a green leaf", "সবুজ পাতার ভেতরে"), "middle", 12, "var(--muted)");
    const box = (x, on, col, title, rate, sub) => `<g opacity="${on ? 1 : 0.6}"><rect x="${x}" y="92" width="132" height="68" rx="10" fill="var(--paper)" stroke="${on ? col : "var(--muted)"}" stroke-width="${on ? 2.5 : 1.5}"${on ? "" : ` stroke-dasharray="5 4"`}/>${T7(x + 66, 111, title, "middle", 13, "var(--ink)", "700")}<rect x="${x + 12}" y="120" width="108" height="10" rx="5" fill="var(--rule)"/><rect x="${x + 12}" y="120" width="${(108 * rate / 12).toFixed(1)}" height="10" rx="5" fill="${col}"/>${T7(x + 66, 150, sub, "middle", 12, "var(--ink)")}</g>`;
    s += box(26, P > 0, LEAF7, L2("Photosynthesis", "সালোকসংশ্লেষণ"), P, P > 0 ? L2(`rate ${P}`, `হার ${B7(P)}`) : L2("stopped: no light", "বন্ধ: আলো নেই"));
    s += box(202, true, "var(--note)", L2("Respiration", "শ্বসন"), R, L2(`rate ${R}, never stops`, `হার ${B7(R)}, থামে না`));
    if (rec > 0) s += AR7(161, 117, 199, 117, "b7pa", O27, 2.5) + T7(180, 106, "O₂", "middle", 12, O27, "700") + AR7(199, 139, 161, 139, "b7pc", CO27, 2.5) + T7(180, 159, "CO₂", "middle", 12, CO27, "700");
    s += `<rect x="158" y="208" width="44" height="12" fill="var(--sheet)"/><ellipse cx="162" cy="214" rx="6" ry="10" fill="${LEAF7}" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="198" cy="214" rx="6" ry="10" fill="${LEAF7}" stroke="var(--ink)" stroke-width="1.2"/>` + T7(180, 197, L2("stoma", "পত্ররন্ধ্র"), "middle", 12, "var(--muted)");
    if (net > 0) s += `<path d="M172 207 Q112 205 92 163" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    if (net < 0) s += `<path d="M188 207 Q248 205 268 163" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    const w = 2 + Math.min(5, Math.abs(net) * 0.5), n = Math.abs(net);
    if (net > 0) s += AR7(148, 288, 172, 228, "b7pc", CO27, w) + AR7(188, 226, 212, 284, "b7pa", O27, w) + T7(140, 268, L2(`CO₂ in: ${n}`, `CO₂ ঢোকে: ${B7(n)}`), "end", 13, CO27, "700") + T7(222, 268, L2(`O₂ out: ${n}`, `O₂ বের হয়: ${B7(n)}`), "start", 13, O27, "700");
    else if (net < 0) s += AR7(148, 288, 172, 228, "b7pa", O27, w) + AR7(188, 226, 212, 284, "b7pc", CO27, w) + T7(140, 268, L2(`O₂ in: ${n}`, `O₂ ঢোকে: ${B7(n)}`), "end", 13, O27, "700") + T7(222, 268, L2(`CO₂ out: ${n}`, `CO₂ বের হয়: ${B7(n)}`), "start", 13, CO27, "700");
    else s += T7(180, 256, L2("almost nothing goes in or out", "প্রায় কিছুই ঢোকে না, বেরোয় না"), "middle", 13, "var(--muted)", "700");
    s += T7(354, 292, L2("outside air", "বাইরের বাতাস"), "end", 12, "var(--muted)");
    $("#b7ps", el).innerHTML = s + `</svg>`;
    let o;
    if (P === 0) o = `<b>${L2("Night.", "রাত।")}</b> ${L2(`No light, so the light phase has stopped and no O₂ is made. Respiration goes on: the plant takes in ${R} units of O₂ and gives out ${R} units of CO₂.`, `আলো নেই, তাই আলোক পর্যায় বন্ধ, O₂ তৈরি হচ্ছে না। শ্বসন চলছে: উদ্ভিদ ${B7(R)} একক O₂ নিচ্ছে আর ${B7(R)} একক CO₂ ছাড়ছে।`)}`;
    else if (net < 0) o = `<b>${L2("Very dim light.", "খুব মৃদু আলো।")}</b> ${L2("Photosynthesis is running, but it is still slower than respiration. A little O₂ still goes in and a little CO₂ still comes out.", "সালোকসংশ্লেষণ চলছে, তবে এখনো শ্বসনের চেয়ে ধীর। এখনো সামান্য O₂ ঢুকছে আর সামান্য CO₂ বেরোচ্ছে।")}`;
    else if (net === 0) o = `<b>${L2("The two are balanced.", "দুই প্রক্রিয়া সমান সমান।")}</b> ${L2("Photosynthesis is exactly as fast as respiration. The leaf uses up the CO₂ it makes, and the O₂ it makes covers its own respiration. Almost nothing passes through the stoma.", "সালোকসংশ্লেষণ ঠিক শ্বসনের সমান হারে চলছে। পাতা নিজের তৈরি CO₂ নিজেই খরচ করছে, আর নিজের তৈরি O₂ দিয়েই শ্বসন চালাচ্ছে। পত্ররন্ধ্র দিয়ে প্রায় কিছুই যাওয়া-আসা করছে না।")}`;
    else o = `<b>${L2("Daylight.", "দিনের আলো।")}</b> ${L2(`Photosynthesis (${P}) is faster than respiration (${R}). ${R} units of each gas are reused inside the leaf. On the whole ${n} units of CO₂ go in and ${n} units of O₂ come out.`, `সালোকসংশ্লেষণ (${B7(P)}) শ্বসনের (${B7(R)}) চেয়ে দ্রুত। দুই গ্যাসেরই ${B7(R)} একক পাতার ভেতরেই আবার কাজে লাগছে। সব মিলিয়ে ${B7(n)} একক CO₂ ঢুকছে আর ${B7(n)} একক O₂ বেরোচ্ছে।`)}`;
    $("#b7po", el).innerHTML = o + `<br><span class="muted" style="font-size:13px">${L2("The numbers are only illustrative units, to show the pattern.", "সংখ্যাগুলো শুধু ধরনটা বোঝানোর জন্য কাল্পনিক একক।")}</span>`;
  };
  const drawDoor = () => {
    let s, o;
    if (door === "stoma") {
      const g = open ? 36 : 4, oc = open ? 112 : 94, cxo = (oc / 2 + g / 2) / 2;
      s = `<svg viewBox="0 0 360 210" role="img" aria-label="${L2("A stoma seen from the leaf surface", "পাতার তল থেকে দেখা একটি পত্ররন্ধ্র")}"><rect x="8" y="8" width="344" height="194" rx="14" fill="var(--c-soft)" stroke="${LEAF7}" stroke-width="1.5"/>`;
      s += `<path d="M8 70 q40 -18 80 0 t58 -4 M214 64 q40 14 80 -4 t58 6 M8 150 q50 16 90 -2 t50 4 M212 150 q40 -14 80 0 t60 -4 M100 8 q-12 30 0 62 M270 8 q10 28 -4 56 M96 148 q-10 26 4 54 M268 148 q12 28 0 54" fill="none" stroke="${LEAF7}" stroke-width="1.2" opacity=".6"/>`;
      s += `<path d="M180 36 Q${180 - g} 105 180 174 Q${180 + g} 105 180 36 Z" fill="var(--ink)" opacity=".85"/>`;
      s += [-1, 1].map(d => `<path d="M180 36 Q${180 + d * oc} 105 180 174 Q${180 + d * g} 105 180 36 Z" fill="${LEAF7}" stroke="var(--ink)" stroke-width="1.5"/>` + [[0.82, 76], [1, 105], [0.82, 134]].map(([k, y]) => `<ellipse cx="${(180 + d * cxo * k).toFixed(1)}" cy="${y}" rx="3.5" ry="5" fill="#2f6f3c"/>`).join("")).join("");
      s += LD7(70, 36, 138, 86) + T7(18, 32, L2("guard cell", "রক্ষীকোষ"), "start", 13, "var(--ink)", "700", true);
      s += LD7(296, 178, open ? 186 : 181, 118) + T7(342, 192, open ? L2("pore: open", "ছিদ্র: খোলা") : L2("pore: nearly closed", "ছিদ্র: প্রায় বন্ধ"), "end", 13, "var(--ink)", "700", true);
      s += T7(342, 32, L2("cell of the leaf skin", "পাতার ত্বকের কোষ"), "end", 12, "var(--muted)", "", true) + `</svg>`;
      o = open ? `<b>${L2("Stoma, open.", "পত্ররন্ধ্র, খোলা।")}</b> ${L2("Two bean-shaped guard cells surround a pore in the skin of the leaf. When the guard cells are full of water they bend apart and the pore opens. CO₂ and O₂ diffuse through it, and water vapour escapes too. This is the usual state in daylight.", "পাতার ত্বকের একটি ছিদ্রকে ঘিরে থাকে শিমের বিচির মতো দুটি রক্ষীকোষ। রক্ষীকোষ পানিতে ভরে উঠলে দুই দিকে বেঁকে যায়, ছিদ্র খুলে যায়। এ পথে CO₂ ও O₂ ব্যাপিত হয়, জলীয় বাষ্পও বেরিয়ে যায়। দিনের আলোয় সাধারণত এ অবস্থাই থাকে।")}` : `<b>${L2("Stoma, nearly closed.", "পত্ররন্ধ্র, প্রায় বন্ধ।")}</b> ${L2("When the guard cells lose water they straighten and the pore almost closes. In most plants this happens at night, and also whenever the plant is short of water. Very little gas can pass now.", "রক্ষীকোষ পানি হারালে সোজা হয়ে আসে, ছিদ্র প্রায় বন্ধ হয়ে যায়। বেশির ভাগ উদ্ভিদে রাতে এমন হয়, পানির অভাব হলেও হয়। তখন খুব সামান্য গ্যাসই চলাচল করতে পারে।")}`;
    } else {
      s = `<svg viewBox="0 0 360 210" role="img" aria-label="${L2("A lenticel in the bark, cut across", "বাকলের একটি লেন্টিসেলের প্রস্থচ্ছেদ")}">${arrowDefs("b7la", O27)}${arrowDefs("b7lb", CO27)}`;
      for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) { const x = 6 + i * 32 - (r ? 16 : 0), y = 66 + r * 20; if (x + 30 > 130 && x < 230) continue; s += `<rect x="${x}" y="${y}" width="30" height="18" rx="2" fill="#a67c52" stroke="var(--ink)" stroke-width="1"/>`; }
      s += `<path d="M128 106 Q180 10 232 106 Z" fill="#d9b98c" opacity=".5" stroke="#a67c52" stroke-width="1.5"/>`;
      s += [[148, 97], [164, 96], [180, 97], [196, 96], [212, 97], [158, 82], [174, 80], [190, 81], [204, 83], [172, 67], [188, 67]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="var(--paper)" stroke="#a67c52" stroke-width="1.5"/>`).join("");
      for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) s += `<rect x="${8 + i * 43}" y="${110 + r * 26}" width="41" height="24" rx="6" fill="var(--c-soft)" stroke="${LEAF7}" stroke-width="1.2"/>`;
      s += AR7(166, 20, 166, 128, "b7la", O27, 3) + AR7(194, 128, 194, 20, "b7lb", CO27, 3) + T7(158, 34, "O₂", "end", 13, O27, "700", true) + T7(202, 34, "CO₂", "start", 13, CO27, "700", true);
      s += T7(8, 50, L2("bark: dead, airtight cork", "বাকল: মৃত, বায়ুরোধী কর্ক"), "start", 12, "var(--ink)", "", true) + T7(352, 50, L2("lenticel: loose cells", "লেন্টিসেল: ঢিলেঢালা কোষ"), "end", 12, "var(--ink)", "700", true);
      s += T7(352, 204, L2("living cells under the bark", "বাকলের নিচের সজীব কোষ"), "end", 12, "var(--ink)") + `</svg>`;
      o = `<b>${L2("Lenticel.", "লেন্টিসেল।")}</b> ${L2("The bark of a mature stem is made of dead cork cells that let no air through. At a lenticel they are replaced by loosely packed cells with air gaps between them. O₂ diffuses in to the living cells underneath and CO₂ diffuses out. A lenticel has no guard cells, so it is always open.", "পরিণত কাণ্ডের বাকল মৃত কর্ক কোষ দিয়ে তৈরি, যার ভেতর দিয়ে বাতাস যেতে পারে না। লেন্টিসেলের জায়গায় থাকে ঢিলেঢালাভাবে সাজানো কোষ, মাঝে মাঝে ফাঁক। এ পথে O₂ ব্যাপিত হয়ে নিচের সজীব কোষে পৌঁছায় আর CO₂ বেরিয়ে আসে। লেন্টিসেলে রক্ষীকোষ নেই, তাই এটি সব সময় খোলা থাকে।")}`;
    }
    $("#b7ds", el).innerHTML = s; $("#b7do", el).innerHTML = o;
    $(".b7pg", el).style.display = door === "stoma" ? "" : "none";
  };
  const setView = () => {
    const b = $("#b7pb", el);
    if (view === "day") {
      b.innerHTML = `<div class="svgwrap fit" id="b7ps"></div>${slider("b7pt", L2("Time of day", "দিনের সময়"), 0, 24, 0.5, 12, "")}<div class="w-out" id="b7po"></div>`;
      $("#b7pt", el).addEventListener("input", drawDay); drawDay();
    } else {
      b.innerHTML = `<div class="chipset b7pd" role="group"><button data-d="stoma" aria-pressed="${door === "stoma"}">${L2("Stoma (leaf)", "পত্ররন্ধ্র (পাতা)")}</button><button data-d="lent" aria-pressed="${door === "lent"}">${L2("Lenticel (bark)", "লেন্টিসেল (বাকল)")}</button></div>
        <div class="svgwrap fit" id="b7ds" style="margin-top:8px"></div>
        <div class="chipset b7pg" role="group" style="margin-top:6px"><button data-o="1" aria-pressed="${open}">${L2("Open", "খোলা")}</button><button data-o="0" aria-pressed="${!open}">${L2("Nearly closed", "প্রায় বন্ধ")}</button></div>
        <div class="w-out" id="b7do" style="margin-top:8px"></div>`;
      chipsB7(el, ".b7pd", q => { door = q.dataset.d; drawDoor(); });
      chipsB7(el, ".b7pg", q => { open = q.dataset.o === "1"; drawDoor(); });
      drawDoor();
    }
  };
  chipsB7(el, ".b7pv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 7.2 the human respiratory system: tap the parts / follow the air; swallow or breathe */
W.b7system = (el) => {
  const PARTS = [
    ["nose", L2("Nasal passage", "নাসাপথ"), L2("Where the system begins. Hairs and sticky mucus trap dust and germs, and the air is warmed and moistened. Nerve endings here give the sense of smell.", "শ্বসনতন্ত্রের শুরু। লোম আর আঠালো শ্লেষ্মা ধুলা ও জীবাণু আটকায়, বাতাস উষ্ণ ও আর্দ্র হয়। এখানকার স্নায়ুপ্রান্ত গন্ধের অনুভূতি দেয়।"), [150, 84]],
    ["pharynx", L2("Pharynx", "গলবিল"), L2("The space behind the nose and mouth, shared by air and food. When you swallow, the soft palate closes the way to the nose.", "নাক ও মুখের পেছনের অংশ; বাতাস ও খাদ্যের সাধারণ পথ। গেলার সময় আলাজিহ্বা নাকের দিকের পথ বন্ধ করে দেয়।"), [181, 104]],
    ["larynx", L2("Larynx", "স্বরযন্ত্র"), L2("The voice box, at the top of the trachea. Its two vocal cords vibrate to make the voice. Its lid, the epiglottis, covers it when food is swallowed.", "শ্বাসনালির মাথায় থাকা স্বরযন্ত্র। এর দুটি স্বররজ্জুর কম্পনে স্বর তৈরি হয়। খাবার গেলার সময় এর ঢাকনা, উপজিহ্বা, একে ঢেকে দেয়।"), [180, 140]],
    ["trachea", L2("Trachea", "শ্বাসনালি"), L2("The windpipe, in front of the food pipe. C-shaped rings of cartilage keep it open. Mucus traps particles and the cilia sweep them out.", "খাদ্যনালির সামনে থাকা শ্বাসনালি (ট্রাকিয়া)। C আকৃতির তরুণাস্থির বলয় একে খোলা রাখে। শ্লেষ্মা কণা আটকায়, সিলিয়া তা বাইরে ঠেলে দেয়।"), [180, 196]],
    ["bronchus", L2("Bronchus", "ব্রংকাস"), L2("The trachea divides into two bronchi, one for each lung. They are built like the trachea.", "শ্বাসনালি ভাগ হয়ে দুটি ব্রংকাস হয়, প্রতিটি ফুসফুসে একটি করে ঢোকে। এদের গঠন শ্বাসনালির মতোই।"), [160, 250]],
    ["bronchiole", L2("Bronchioles", "অণুক্লোম শাখা"), L2("Inside the lung each bronchus divides again and again into finer and finer tubes, the bronchioles. They end at the air sacs.", "ফুসফুসের ভেতরে প্রতিটি ব্রংকাস বারবার ভাগ হয়ে সরু থেকে আরও সরু নল, অর্থাৎ অণুক্লোম শাখা তৈরি করে। এরা বায়ুথলিতে গিয়ে শেষ হয়।"), [120, 286]],
    ["alveoli", L2("Alveoli", "বায়ুথলি"), L2("Tiny air sacs at the ends of the bronchioles, each wrapped in blood capillaries. Their walls are so thin that O₂ and CO₂ pass straight through. Gas exchange happens here.", "অণুক্লোম শাখার প্রান্তের ক্ষুদ্র থলি (অ্যালভিওলাস), প্রতিটি রক্তের কৈশিকনালিতে ঘেরা। প্রাচীর এত পাতলা যে O₂ ও CO₂ সরাসরি ভেদ করে যায়। গ্যাসীয় বিনিময় ঘটে এখানেই।"), [300, 78]],
    ["lung", L2("Lungs", "ফুসফুস"), L2("The main organs: soft, spongy and light red. The right lung has 3 lobes; the left has 2 and leaves room for the heart. The person in the picture faces you, so the right lung is on your left.", "প্রধান অঙ্গ: স্পঞ্জের মতো নরম, হালকা লালচে। ডান ফুসফুসে ৩টি খণ্ড; বাম ফুসফুসে ২টি, হৃৎপিণ্ডের জন্য জায়গা ছেড়ে। ছবির মানুষটি তোমার দিকে মুখ করে আছে, তাই ডান ফুসফুস তোমার বাঁ দিকে।"), [124, 318]],
    ["pleura", L2("Pleura", "প্লুরা"), L2("A two-layered covering around each lung. The fluid between the layers stops the lung from rubbing against the chest wall.", "প্রতিটি ফুসফুসের দুই ভাঁজের আবরণ। ভাঁজের মাঝের রস ফুসফুস ও বক্ষগাত্রের ঘর্ষণ ঠেকায়।"), [270, 262]],
    ["diaphragm", L2("Diaphragm", "মধ্যচ্ছদা"), L2("A sheet of muscle between the chest and the abdomen, shaped like an open umbrella. It contracts and moves down when you breathe in, then relaxes and rises again.", "বক্ষ ও উদরের মাঝের পেশিবহুল পর্দা, দেখতে খোলা ছাতার মতো। প্রশ্বাসের সময় সংকুচিত হয়ে নিচে নামে, তারপর শিথিল হয়ে আবার ওপরে ওঠে।"), [180, 366]]];
  let view = "parts", sel = 0, mode = "br", u = 0;
  el.innerHTML = `<div class="chipset b7sv" role="group"><button data-v="parts" aria-pressed="true">${B7(1)}. ${L2("The parts", "অংশগুলো")}</button><button data-v="throat" aria-pressed="false">${B7(2)}. ${L2("Swallow or breathe?", "গেলা না শ্বাস?")}</button></div><div id="b7sb" style="margin-top:8px"></div>`;
  const drawParts = () => {
    const k = PARTS[sel][0], on = q => q === k;
    const hl = q => on(q) ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.5"`;
    const lab = (q, x, y, t, a = "start") => `<text data-k="${q}" x="${x}" y="${y}" font-size="13" text-anchor="${a}" fill="${on(q) ? "var(--bad)" : "var(--ink)"}" font-weight="${on(q) ? 700 : 400}" paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" style="cursor:pointer">${t}</text>`;
    const air = q => on(q) ? "var(--bad)" : "var(--c)";
    let s = `<svg viewBox="0 0 360 412" role="img" aria-label="${L2("Human respiratory system", "মানব শ্বসনতন্ত্র")}">`;
    s += `<path d="M160 150 Q156 172 82 184 Q40 190 36 236 L36 404 M218 150 Q222 172 278 184 Q320 190 324 236 L324 404" fill="none" stroke="var(--rule)" stroke-width="2"/>`;
    s += `<path d="M160 152 L160 128 Q140 130 131 120 L127 106 L122 100 L126 94 L110 86 Q122 74 127 62 Q126 30 160 16 Q210 6 226 50 Q234 90 218 116 L218 152" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.5"/>`;
    s += `<path d="M130 104 Q150 99 170 104 L170 112 Q150 115 132 111 Z" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1"/>`;
    s += `<g data-k="nose" style="cursor:pointer"><path d="M118 86 Q142 68 172 78 L174 92 Q146 88 120 91 Z" fill="var(--c-soft)" ${hl("nose")}/></g>`;
    s += `<g data-k="pharynx" style="cursor:pointer"><path d="M171 76 Q192 78 192 100 L190 128 L171 128 Z" fill="var(--note-soft)" ${hl("pharynx")}/></g>`;
    s += `<g data-k="larynx" style="cursor:pointer"><rect x="169" y="128" width="22" height="24" rx="5" fill="var(--paper)" ${hl("larynx")}/><path d="M171 130 q-8 -7 -3 -15" fill="none" stroke="${MUS7}" stroke-width="3.5" stroke-linecap="round"/></g>`;
    s += `<g data-k="trachea" style="cursor:pointer"><rect x="172" y="152" width="16" height="86" fill="${air("trachea")}" opacity=".75"/>${[160, 169, 178, 187, 196, 205, 214, 223, 232].map(y => `<path d="M172 ${y} h16" stroke="var(--sheet)" stroke-width="2.5"/>`).join("")}<rect x="172" y="152" width="16" height="86" fill="none" ${hl("trachea")}/></g>`;
    const RL = "M158 204 Q124 196 100 238 Q78 284 80 336 Q82 352 104 348 Q142 340 166 326 Q170 284 168 244 Q168 216 158 204 Z", LL = "M202 204 Q236 196 260 238 Q282 284 280 336 Q278 352 256 348 Q234 344 216 336 Q220 300 204 276 Q190 250 192 230 Q194 212 202 204 Z";
    s += `<g data-k="pleura" style="cursor:pointer"><path d="${RL}" fill="none" stroke="${on("pleura") ? "var(--bad)" : "var(--note)"}" stroke-width="8" opacity="${on("pleura") ? 1 : 0.55}"/><path d="${LL}" fill="none" stroke="${on("pleura") ? "var(--bad)" : "var(--note)"}" stroke-width="8" opacity="${on("pleura") ? 1 : 0.55}"/></g>`;
    s += `<ellipse cx="189" cy="302" rx="17" ry="24" fill="var(--bad)" opacity=".16"/>`;
    s += `<g data-k="lung" style="cursor:pointer"><path d="${RL}" fill="var(--c-soft)" ${hl("lung")}/><path d="${LL}" fill="var(--c-soft)" ${hl("lung")}/><path d="M97 258 Q134 266 168 256 M84 304 Q128 300 166 318 M204 262 Q244 286 279 312" fill="none" stroke="var(--c)" stroke-width="1.5" opacity=".7"/></g>`;
    const BR = [[146, 262, 122, 250], [146, 262, 118, 286], [146, 262, 140, 296], [122, 250, 110, 240], [122, 250, 110, 264], [118, 286, 100, 294], [118, 286, 108, 308], [140, 296, 132, 314], [140, 296, 152, 312],
      [214, 262, 238, 250], [214, 262, 242, 286], [214, 262, 230, 300], [238, 250, 250, 240], [238, 250, 250, 264], [242, 286, 262, 294], [242, 286, 254, 310], [230, 300, 232, 320], [230, 300, 246, 318]];
    s += `<g data-k="bronchiole" style="cursor:pointer">${BR.map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${air("bronchiole")}" stroke-width="${on("bronchiole") ? 3.5 : 2.5}" stroke-linecap="round"/>`).join("")}</g>`;
    s += `<g data-k="alveoli" style="cursor:pointer">${BR.slice(3, 9).concat(BR.slice(12)).map(([, , c, d]) => `<circle cx="${c}" cy="${d}" r="3.6" fill="${on("alveoli") ? "var(--bad)" : "var(--sheet)"}" stroke="${air("alveoli")}" stroke-width="1.5"/>`).join("")}</g>`;
    s += `<g data-k="bronchus" style="cursor:pointer"><path d="M180 236 L146 262 M180 236 L214 262" fill="none" stroke="${air("bronchus")}" stroke-width="9" stroke-linecap="round" opacity=".85"/></g>`;
    s += `<g data-k="diaphragm" style="cursor:pointer"><path d="M36 386 Q110 346 180 366 Q250 346 324 386" fill="none" stroke="${on("diaphragm") ? "var(--bad)" : MUS7}" stroke-width="${on("diaphragm") ? 8 : 6}" stroke-linecap="round"/></g>`;
    s += `<line x1="284" y1="124" x2="262" y2="292" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"/>`;
    s += `<g data-k="alveoli" style="cursor:pointer"><circle cx="300" cy="74" r="50" fill="var(--sheet)" stroke="${on("alveoli") ? "var(--bad)" : "var(--muted)"}" stroke-width="${on("alveoli") ? 3 : 1.5}" stroke-dasharray="${on("alveoli") ? "" : "5 3"}"/><path d="M266 40 L290 62" stroke="var(--c)" stroke-width="6" stroke-linecap="round"/>${[[288, 72], [310, 64], [324, 84], [306, 100], [284, 96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`).join("")}<path d="M268 92 q8 22 34 24 q24 0 34 -24" fill="none" stroke="var(--bad)" stroke-width="2"/><path d="M276 58 q18 -18 42 -10 q14 8 16 24" fill="none" stroke="${CO27}" stroke-width="2"/></g>`;
    s += lab("alveoli", 300, 140, L2("alveoli (enlarged)", "বায়ুথলি (বড় করে)"), "middle");
    s += LD7(58, 62, 122, 86) + lab("nose", 4, 60, L2("nasal passage", "নাসাপথ"));
    s += LD7(238, 156, 191, 114) + lab("pharynx", 240, 162, L2("pharynx", "গলবিল"));
    s += LD7(136, 138, 169, 140) + lab("larynx", 134, 142, L2("larynx", "স্বরযন্ত্র"), "end");
    s += LD7(146, 192, 172, 194) + lab("trachea", 144, 196, L2("trachea", "শ্বাসনালি"), "end");
    s += LD7(240, 196, 208, 252) + lab("bronchus", 240, 194, L2("bronchus", "ব্রংকাস"));
    s += LD7(70, 262, 110, 264) + (LANG === "bn" ? lab("bronchiole", 4, 258, "অণুক্লোম") + lab("bronchiole", 4, 274, "শাখা") : lab("bronchiole", 4, 266, "bronchiole"));
    s += LD7(298, 258, 270, 262) + lab("pleura", 300, 262, L2("pleura", "প্লুরা"));
    s += lab("lung", 124, 338, L2("right lung", "ডান ফুসফুস"), "middle") + lab("lung", 246, 334, L2("left lung", "বাম ফুসফুস"), "middle");
    s += lab("diaphragm", 180, 402, L2("diaphragm", "মধ্যচ্ছদা"), "middle");
    const [px, py] = PARTS[sel][3];
    s += `<circle cx="${px}" cy="${py}" r="6" fill="var(--bad)" stroke="var(--sheet)" stroke-width="2.5" pointer-events="none"/>`;
    $("#b7ss", el).innerHTML = s + `</svg>`;
    $("#b7si", el).textContent = L2(`Part ${sel + 1} of ${PARTS.length}`, `অংশ ${B7(sel + 1)} / ${B7(PARTS.length)}`);
    $("#b7so", el).innerHTML = `<b>${B7(sel + 1)}. ${PARTS[sel][1]}</b><br>${PARTS[sel][2]}`;
    el.querySelectorAll(".b7sp button").forEach((b, i) => b.setAttribute("aria-pressed", i === sel));
    el.querySelectorAll("#b7ss [data-k]").forEach(g => g.addEventListener("click", () => { sel = PARTS.findIndex(p => p[0] === g.dataset.k); drawParts(); }));
  };
  const AIRP = [[10, 54], [196, 54], [212, 74], [212, 134], [180, 146], [166, 166], [166, 256]], FOODP = [[14, 92], [150, 92], [202, 108], [212, 140], [212, 256]];
  const drawThroat = () => {
    const sw = mode === "sw", pts = sw ? FOODP : AIRP, col = sw ? "var(--note)" : CO27;
    let s = `<svg viewBox="0 0 360 270" role="img" aria-label="${L2("Side view of the throat", "গলার পাশ থেকে দেখা ছবি")}">${arrowDefs("b7ta", CO27)}${arrowDefs("b7tb", "var(--note)")}`;
    s += `<rect x="4" y="6" width="352" height="258" rx="16" fill="var(--bad-soft)" stroke="var(--rule)" stroke-width="1.5"/>`;
    s += `<g fill="var(--sheet)"><rect x="6" y="40" width="222" height="28"/><rect x="196" y="40" width="32" height="112"/><rect x="6" y="84" width="222" height="44"/><rect x="150" y="68" width="78" height="16"/><rect x="150" y="128" width="78" height="24"/><rect x="150" y="150" width="32" height="112"/></g>`;
    s += `<rect x="${sw ? 198 : 206}" y="152" width="${sw ? 28 : 12}" height="110" fill="var(--note-soft)" stroke="var(--note)" stroke-width="1"/>`;
    s += `<rect x="6" y="68" width="144" height="16" fill="var(--muted)" opacity=".4"/>`;
    s += `<path d="M40 128 Q80 ${sw ? 94 : 100} 140 ${sw ? 100 : 106} Q170 110 172 128 Z" fill="#e79a94" stroke="#b86158" stroke-width="1"/>` + T7(104, 123, L2("tongue", "জিভ"), "middle", 12, "#3a1f1c");
    s += [162, 176, 190, 204, 218, 232, 246].map(y => `<path d="M150 ${y} h6 M176 ${y} h6" stroke="var(--c)" stroke-width="3"/>`).join("");
    s += `<path d="${pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ")}" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#${sw ? "b7tb" : "b7ta"})"/>`;
    s += `<line x1="150" y1="76" x2="${sw ? 223 : 182}" y2="${sw ? 73 : 100}" stroke="#d2695e" stroke-width="11" stroke-linecap="round"/>`;
    s += `<line x1="153" y1="149" x2="${sw ? 184 : 164}" y2="${sw ? 149 : 118}" stroke="${MUS7}" stroke-width="8" stroke-linecap="round"/>`;
    const [dx, dy] = along7(pts, REDUCED ? 0.55 : u);
    s += `<circle id="b7sd" cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${sw ? 8 : 5.5}" fill="${sw ? "#c98a2b" : CO27}" stroke="var(--sheet)" stroke-width="2"/>`;
    s += T7(12, 32, L2("nasal passage", "নাসাপথ"), "start", 12.5) + T7(12, 146, "↑ " + L2("mouth", "মুখগহ্বর"), "start", 12.5);
    s += LD7(238, 60, sw ? 226 : 186, sw ? 70 : 96) + T7(240, 64, L2("soft palate", "আলাজিহ্বা"), "start", 12.5);
    s += LD7(238, 104, 228, 104) + T7(240, 108, L2("pharynx", "গলবিল"), "start", 12.5);
    s += LD7(238, 136, sw ? 186 : 168, sw ? 147 : 124) + T7(240, 140, L2("epiglottis", "উপজিহ্বা"), "start", 12.5);
    s += LD7(238, 200, 227, 200) + T7(240, 204, L2("oesophagus", "খাদ্যনালি"), "start", 12.5) + (LANG === "bn" ? "" : T7(240, 219, "(food pipe)", "start", 12, "var(--muted)"));
    s += LD7(144, 170, 151, 162) + T7(142, 176, L2("larynx", "স্বরযন্ত্র"), "end", 12.5);
    s += LD7(144, 216, 150, 216) + T7(142, 220, L2("trachea", "শ্বাসনালি"), "end", 12.5) + (LANG === "bn" ? "" : T7(142, 235, "(windpipe)", "end", 12, "var(--muted)"));
    s += T7(348, 28, sw ? L2("food →", "খাদ্য →") : L2("air →", "বাতাস →"), "end", 13, col, "700");
    $("#b7ts", el).innerHTML = s + `</svg>`;
    $("#b7to", el).innerHTML = sw ? `<b>${L2("Swallowing.", "খাবার গেলা।")}</b> ${L2("The soft palate lifts and closes the back of the nasal passage, so food cannot go up into the nose. The epiglottis folds down over the larynx, so food cannot enter the windpipe. The lump of food slides into the oesophagus. Breathing pauses for this short moment.", "আলাজিহ্বা ওপরে উঠে নাসাপথের পেছনের পথ বন্ধ করে দেয়, তাই খাদ্য নাকে উঠতে পারে না। উপজিহ্বা নেমে স্বরযন্ত্রের মুখ ঢেকে দেয়, তাই খাদ্য শ্বাসনালিতে ঢুকতে পারে না। খাবারের দলা পিছলে খাদ্যনালিতে চলে যায়। এই অল্প সময়টুকু শ্বাস বন্ধ থাকে।")}` : `<b>${L2("Breathing.", "শ্বাস নেওয়া।")}</b> ${L2("The soft palate hangs down, so the way from the nose is open. The epiglottis stands up, so the larynx is open. Air goes from the nasal passage through the pharynx and larynx into the trachea. The oesophagus stays flat and closed.", "আলাজিহ্বা নিচে ঝুলে থাকে, তাই নাকের দিকের পথ খোলা। উপজিহ্বা খাড়া থাকে, তাই স্বরযন্ত্রের মুখও খোলা। বাতাস নাসাপথ থেকে গলবিল ও স্বরযন্ত্র হয়ে শ্বাসনালিতে যায়। খাদ্যনালি তখন চুপসে বন্ধ থাকে।")}`;
  };
  const setView = () => {
    const b = $("#b7sb", el);
    if (view === "parts") {
      b.innerHTML = `<div class="svgwrap fit" id="b7ss"></div>
        <div class="w-row" style="margin:8px 0"><button class="btn" id="b7sp">${L2("‹ Back", "‹ আগের")}</button><button class="btn solid" id="b7sn">${L2("Next ›", "পরের ›")}</button><span class="muted" id="b7si"></span></div>
        <div class="w-out" id="b7so"></div>
        <div class="chipset b7sp" role="group" style="margin-top:8px">${PARTS.map((p, i) => `<button data-i="${i}" aria-pressed="false">${p[1]}</button>`).join("")}</div>`;
      $("#b7sp", el).addEventListener("click", () => { sel = (sel + PARTS.length - 1) % PARTS.length; drawParts(); });
      $("#b7sn", el).addEventListener("click", () => { sel = (sel + 1) % PARTS.length; drawParts(); });
      el.querySelectorAll(".b7sp button").forEach(q => q.addEventListener("click", () => { sel = +q.dataset.i; drawParts(); }));
      drawParts();
    } else {
      b.innerHTML = `<div class="chipset b7tm" role="group"><button data-m="br" aria-pressed="${mode === "br"}">${L2("Breathing", "শ্বাস নেওয়া")}</button><button data-m="sw" aria-pressed="${mode === "sw"}">${L2("Swallowing", "খাবার গেলা")}</button></div>
        <div class="svgwrap fit" id="b7ts" style="margin-top:8px"></div><div class="w-out" id="b7to" style="margin-top:8px"></div>`;
      chipsB7(el, ".b7tm", q => { mode = q.dataset.m; u = 0; drawThroat(); });
      drawThroat();
    }
  };
  chipsB7(el, ".b7sv", b => { view = b.dataset.v; setView(); });
  setView();
  if (!REDUCED) animate(el, dt => {
    if (view !== "throat") return;
    const d = $("#b7sd", el); if (!d) return;
    u += dt * 0.4; if (u > 1.15) u = 0;
    const [x, y] = along7(mode === "sw" ? FOODP : AIRP, u);
    d.setAttribute("cx", x.toFixed(1)); d.setAttribute("cy", y.toFixed(1));
  });
};

/* 7.2.2 breathing mechanics, gas exchange in an alveolus, and the lime water test */
W.b7breath = (el) => {
  let view = "br", f = 0, target = 0, started = false, gas = "o2", ph = 0, nA = 0, nB = 0, lastT = "";
  el.innerHTML = `<div class="chipset b7bv" role="group"><button data-v="br" aria-pressed="true">${B7(1)}. ${L2("Breathing", "শ্বাসক্রিয়া")}</button><button data-v="al" aria-pressed="false">${B7(2)}. ${L2("Alveolus", "বায়ুথলি")}</button><button data-v="lw" aria-pressed="false">${B7(3)}. ${L2("Lime water test", "চুনের পানি পরীক্ষা")}</button></div><div id="b7bb" style="margin-top:8px"></div>`;
  const drawBreath = () => {
    const inh = target === 1, moving = Math.abs(f - target) > 0.001;
    let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("Chest during breathing", "শ্বাসক্রিয়ার সময় বক্ষ")}">${arrowDefs("b7ba", CO27)}${arrowDefs("b7bm", MUS7)}`;
    s += `<rect x="172" y="14" width="16" height="68" fill="var(--c)" opacity=".7"/>${[24, 34, 44, 54, 64, 74].map(y => `<path d="M172 ${y} h16" stroke="var(--sheet)" stroke-width="2.5"/>`).join("")}<rect x="172" y="14" width="16" height="68" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    if (started) s += inh ? AR7(156, 8, 156, 46, "b7ba", CO27, 3.5) + AR7(204, 8, 204, 46, "b7ba", CO27, 3.5) : AR7(156, 48, 156, 10, "b7ba", CO27, 3.5) + AR7(204, 48, 204, 10, "b7ba", CO27, 3.5);
    if (started) s += T7(216, 32, inh ? L2("air in", "বাতাস ঢুকছে") : L2("air out", "বাতাস বেরোচ্ছে"), "start", 13, CO27, "700");
    s += `<g transform="translate(180 84) scale(${(0.9 + 0.12 * f).toFixed(3)} ${(0.88 + 0.14 * f).toFixed(3)}) translate(-180 -84)"><path d="M180 80 L150 112 M180 80 L210 112" fill="none" stroke="var(--c)" stroke-width="7" stroke-linecap="round" opacity=".8"/><path d="M168 88 Q136 84 112 124 Q92 164 94 214 Q96 230 118 226 Q150 220 170 208 Z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><path d="M192 88 Q224 84 248 124 Q268 164 266 214 Q264 230 242 226 Q210 220 190 208 Z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/></g>`;
    s += `<g transform="translate(180 0) scale(${(1 + 0.07 * f).toFixed(3)} 1) translate(-180 ${(-7 * f).toFixed(1)})"><rect x="174" y="88" width="12" height="138" rx="5" fill="var(--muted)" opacity=".45"/>${[0, 1, 2, 3, 4, 5].map(i => { const y = 98 + i * 25; return `<path d="M174 ${y} Q118 ${y - 12} ${72 - i * 2} ${y + 18} M186 ${y} Q242 ${y - 12} ${288 + i * 2} ${y + 18}" fill="none" stroke="var(--muted)" stroke-width="5" stroke-linecap="round" opacity=".5"/>`; }).join("")}</g>`;
    s += `<path d="M${(56 - 5 * f).toFixed(1)} 252 Q180 ${(196 + 46 * f).toFixed(1)} ${(304 + 5 * f).toFixed(1)} 252" fill="none" stroke="${MUS7}" stroke-width="7" stroke-linecap="round"/>`;
    s += T7(8, 60, started ? (inh ? L2("ribs: up and out ↗", "পাঁজর: ওপরে ও বাইরে ↗") : L2("ribs: down and in ↙", "পাঁজর: নিচে ও ভেতরে ↙")) : L2("ribs", "পাঁজর"), "start", 13, "var(--ink)", "700");
    s += T7(180, 284, started ? (inh ? L2("diaphragm contracts, moves down ↓", "মধ্যচ্ছদা সংকুচিত, নিচে নামে ↓") : L2("diaphragm relaxes, moves up ↑", "মধ্যচ্ছদা শিথিল, ওপরে ওঠে ↑")) : L2("diaphragm", "মধ্যচ্ছদা"), "middle", 13, MUS7, "700");
    s += T7(128, 178, L2("lung", "ফুসফুস"), "middle", 13) + T7(232, 178, L2("lung", "ফুসফুস"), "middle", 13);
    $("#b7bs", el).innerHTML = s + `</svg>`;
    const bar = `<span style="display:inline-block;vertical-align:middle;width:110px;height:12px;border-radius:6px;background:var(--rule)"><span style="display:block;height:12px;border-radius:6px;background:var(--c);width:${(55 + 45 * f).toFixed(0)}%"></span></span>`;
    const pres = !started ? L2("same as outside", "বাইরের সমান") : moving ? (inh ? L2("lower than outside → air flows in", "বাইরের চেয়ে কম → বাতাস ঢোকে") : L2("higher than outside → air flows out", "বাইরের চেয়ে বেশি → বাতাস বের হয়")) : L2("equal to outside again → flow stops", "আবার বাইরের সমান → প্রবাহ থামে");
    const head = !started ? L2("The chest at rest. Press “Breathe in”.", "বিশ্রামে থাকা বক্ষ। “শ্বাস নাও” চাপো।") : inh ? `<b>${L2("Inhalation", "প্রশ্বাস")}:</b> ${L2("rib muscles and diaphragm contract → the chest cavity grows → pressure in the lungs falls → air flows in.", "পাঁজরের পেশি ও মধ্যচ্ছদা সংকুচিত → বক্ষগহ্বর বড় হয় → ফুসফুসের ভেতরের চাপ কমে → বাতাস ঢোকে।")}` : `<b>${L2("Exhalation", "নিঃশ্বাস")}:</b> ${L2("the muscles relax → the chest cavity returns to normal → pressure in the lungs rises → air rich in CO₂ and water vapour flows out.", "পেশি শিথিল → বক্ষগহ্বর স্বাভাবিক আয়তনে ফেরে → ফুসফুসের ভেতরের চাপ বাড়ে → CO₂ ও জলীয় বাষ্পসমৃদ্ধ বাতাস বের হয়।")}`;
    $("#b7bo", el).innerHTML = `${head}<div style="margin-top:6px;font-size:15px">${L2("Volume of the chest cavity", "বক্ষগহ্বরের আয়তন")}: ${bar}</div><div style="font-size:15px">${L2("Pressure in the lungs", "ফুসফুসের ভেতরের চাপ")}: <b>${pres}</b></div>`;
  };
  const QX = uu => 360 * uu, QY = uu => (1 - uu) * (1 - uu) * 214 + 2 * uu * (1 - uu) * 150 + uu * uu * 214;
  const posAlv = () => {
    el.querySelectorAll("#b7as .b7r").forEach((c, i) => { const uu = (i / 7 + ph) % 1; c.setAttribute("cx", QX(uu).toFixed(1)); c.setAttribute("cy", QY(uu).toFixed(1)); c.setAttribute("fill", uu < 0.45 ? "#7b5aa6" : "#d9483b"); });
    el.querySelectorAll("#b7as .b7o").forEach((c, i) => { const uu = (i / 4 + ph * 3) % 1; c.setAttribute("cy", (104 + 92 * uu).toFixed(1)); c.setAttribute("opacity", Math.sin(Math.PI * uu).toFixed(2)); });
    el.querySelectorAll("#b7as .b7c").forEach((c, i) => { const uu = (i / 4 + 0.13 + ph * 3) % 1; c.setAttribute("cy", (196 - 120 * uu).toFixed(1)); c.setAttribute("opacity", Math.sin(Math.PI * uu).toFixed(2)); });
  };
  const drawAlv = () => {
    const o = gas === "o2";
    let s = `<svg viewBox="0 0 360 252" role="img" aria-label="${L2("Gas exchange between an alveolus and a capillary", "বায়ুথলি ও কৈশিকনালির মধ্যে গ্যাসীয় বিনিময়")}"><defs><linearGradient id="b7ag" x1="0" x2="1" y1="0" y2="0"><stop offset="0.3" stop-color="#8f7fc4"/><stop offset="0.62" stop-color="#ef8a80"/></linearGradient></defs>${arrowDefs("b7aa", O27)}${arrowDefs("b7ab", CO27)}`;
    s += `<path d="M-6 214 Q180 150 366 214" fill="none" stroke="#b5544c" stroke-width="38"/><path d="M-6 214 Q180 150 366 214" fill="none" stroke="url(#b7ag)" stroke-width="32"/>`;
    s += [0, 1, 2, 3, 4, 5, 6].map(() => `<ellipse class="b7r" rx="9" ry="6" fill="#d9483b" stroke="var(--sheet)" stroke-width="1"/>`).join("");
    s += `<circle cx="180" cy="96" r="74" fill="var(--sheet)" stroke="var(--c)" stroke-width="4"/><rect x="166" y="-4" width="28" height="36" fill="var(--sheet)"/><path d="M164 0 V27 M196 0 V27" stroke="var(--c)" stroke-width="4" fill="none"/>`;
    s += T7(180, 56, L2("alveolus", "বায়ুথলি"), "middle", 13, "var(--ink)", "700") + T7(180, 72, L2("(fresh air)", "(তাজা বাতাস)"), "middle", 12, "var(--muted)");
    s += T7(204, 14, "← " + L2("from a bronchiole", "অণুক্লোম শাখা থেকে"), "start", 12, "var(--muted)");
    s += LD7(98, 128, 112, 128) + T7(4, 132, L2("wall of alveolus", "বায়ুথলির প্রাচীর"), "start", 12) + T7(4, 168, L2("blood capillary", "রক্তের কৈশিকনালি"), "start", 12);
    if (REDUCED) s += `<g opacity="${o ? 1 : 0.35}">${AR7(148, 112, 148, 192, "b7aa", O27, o ? 4 : 2.5)}</g><g opacity="${o ? 0.35 : 1}">${AR7(212, 192, 212, 106, "b7ab", CO27, o ? 2.5 : 4)}</g>`;
    else s += `<g opacity="${o ? 1 : 0.3}">${[0, 1, 2, 3].map(i => `<circle class="b7o" cx="${132 + i * 10}" cy="110" r="${o ? 5 : 4}" fill="${O27}"/>`).join("")}</g><g opacity="${o ? 0.3 : 1}">${[0, 1, 2, 3].map(i => `<circle class="b7c" cx="${198 + i * 10}" cy="190" r="${o ? 4 : 5}" fill="${CO27}"/>`).join("")}</g>`;
    s += T7(146, 98, "O₂ ↓", "middle", 13, O27, "700", true) + T7(214, 98, "CO₂ ↑", "middle", 13, CO27, "700", true);
    s += T7(6, 246, L2("blood in: rich in CO₂", "রক্ত ঢুকছে: CO₂ বেশি"), "start", 12, "var(--ink)", "700") + T7(354, 246, L2("blood out: rich in O₂", "রক্ত বেরোচ্ছে: O₂ বেশি"), "end", 12, "var(--ink)", "700");
    $("#b7as", el).innerHTML = s + `</svg>`;
    posAlv();
    $("#b7ao", el).innerHTML = o ? `<b>${L2("The journey of oxygen", "অক্সিজেনের যাত্রা")}</b>` + UL7([
      L2("The air in the alveolus has more O₂ than the blood arriving from the heart, so O₂ diffuses across the two thin walls into the blood.", "বায়ুথলির বাতাসে O₂ হৃৎপিণ্ড থেকে আসা রক্তের চেয়ে বেশি, তাই O₂ ব্যাপিত হয়ে দুটি পাতলা প্রাচীর ভেদ করে রক্তে ঢোকে।"),
      L2("A little dissolves in the plasma. Most joins loosely to the iron part of haemoglobin in the red blood cells: oxyhaemoglobin.", "সামান্য অংশ রক্তরসে দ্রবীভূত হয়। বেশির ভাগ লোহিত রক্তকণিকার হিমোগ্লোবিনের লৌহ অংশের সাথে হালকা বন্ধনে যুক্ত হয়: অক্সিহিমোগ্লোবিন।"),
      L2("The pulmonary veins carry this bright red blood to the heart, which pumps it to the body.", "পালমোনারি শিরা এই উজ্জ্বল লাল রক্ত হৃৎপিণ্ডে নিয়ে যায়, হৃৎপিণ্ড তা সারা দেহে পাঠায়।"),
      L2("In the tissues oxyhaemoglobin gives up its O₂, which passes through the capillary wall and the lymph into the cells.", "টিস্যুতে অক্সিহিমোগ্লোবিন O₂ ছেড়ে দেয়; তা কৈশিকনালির প্রাচীর ও লসিকা পেরিয়ে কোষে ঢোকে।")]) : `<b>${L2("The journey of carbon dioxide", "কার্বন ডাই-অক্সাইডের যাত্রা")}</b>` + UL7([
      L2("CO₂ is made in the cells when food is oxidised. It passes through the lymph into the blood plasma.", "খাদ্য জারণের সময় কোষে CO₂ তৈরি হয়। তা লসিকা হয়ে রক্তরসে ঢোকে।"),
      L2("It travels mainly as bicarbonate: NaHCO₃ in the plasma and KHCO₃ in the red blood cells.", "এটি প্রধানত বাইকার্বোনেট রূপে বাহিত হয়: রক্তরসে NaHCO₃ আর লোহিত রক্তকণিকায় KHCO₃।"),
      L2("The pulmonary artery brings this blood from the heart to the lungs.", "পালমোনারি ধমনি এই রক্ত হৃৎপিণ্ড থেকে ফুসফুসে আনে।"),
      L2("In the capillary around the alveolus the CO₂ is set free. There is more CO₂ in the blood than in the alveolus, so it diffuses out and leaves with the exhaled air.", "বায়ুথলির চারপাশের কৈশিকনালিতে CO₂ মুক্ত হয়। রক্তে CO₂ বায়ুথলির চেয়ে বেশি, তাই তা ব্যাপিত হয়ে বেরিয়ে আসে আর নিঃশ্বাসের সাথে চলে যায়।")]);
  };
  const drawLime = () => {
    const turb = Math.min(0.94, nB * 0.32);
    const tube = (x, tb, bub) => `<path d="M${x - 21} 96 V168 a21 21 0 0 0 42 0 V96 Z" fill="${CO27}" opacity=".16"/><path d="M${x - 21} 96 V168 a21 21 0 0 0 42 0 V96 Z" fill="#f3efe2" opacity="${tb.toFixed(2)}"/><path d="M${x - 22} 34 V168 a22 22 0 0 0 44 0 V34" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="${x - 21}" y1="96" x2="${x + 21}" y2="96" stroke="var(--ink)" stroke-width="1" opacity=".5"/>` + (bub ? [[-8, 150, 4], [7, 138, 5], [-5, 122, 4], [9, 110, 3.5]].map(([dx, y, r]) => `<circle cx="${x + dx}" cy="${y}" r="${r}" fill="none" stroke="${tb > 0.5 ? "#6b6b6b" : "var(--ink)"}" stroke-width="1.2"/>`).join("") : "");
    let s = `<svg viewBox="0 0 360 236" role="img" aria-label="${L2("Lime water test with two test tubes", "দুটি টেস্টটিউবে চুনের পানি পরীক্ষা")}">`;
    s += tube(100, 0, lastT === "a") + tube(260, turb, lastT === "b");
    s += `<path d="M76 16 H100 V164" fill="none" stroke="var(--muted)" stroke-width="4" stroke-linejoin="round"/><rect x="26" y="8" width="46" height="16" rx="3" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.5"/><rect x="${lastT === "a" ? 58 : 34}" y="9" width="6" height="14" fill="var(--ink)"/><line x1="${lastT === "a" ? 58 : 34}" y1="16" x2="${lastT === "a" ? 30 : 10}" y2="16" stroke="var(--ink)" stroke-width="3"/><rect x="72" y="13" width="6" height="6" fill="var(--ink)"/>`;
    s += `<path d="M300 16 H260 V164" fill="none" stroke="var(--muted)" stroke-width="4" stroke-linejoin="round"/><circle cx="318" cy="18" r="15" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/><path d="M304 14 q-5 4 0 8" fill="none" stroke="var(--bad)" stroke-width="2.5" stroke-linecap="round"/><circle cx="322" cy="12" r="1.8" fill="var(--ink)"/>` + T7(318, 48, L2("mouth", "মুখ"), "middle", 12, "var(--muted)");
    s += T7(44, 42, L2("syringe", "সিরিঞ্জ"), "middle", 12, "var(--muted)");
    s += T7(100, 208, L2("ordinary air", "সাধারণ বাতাস"), "middle", 13, "var(--ink)", "700") + T7(100, 226, L2(`pushes: ${nA}`, `চাপ: ${B7(nA)} বার`), "middle", 12, "var(--muted)");
    s += T7(260, 208, L2("exhaled air", "নিঃশ্বাসের বাতাস"), "middle", 13, "var(--ink)", "700") + T7(260, 226, L2(`breaths: ${nB}`, `নিঃশ্বাস: ${B7(nB)} বার`), "middle", 12, "var(--muted)");
    s += T7(180, 120, L2("lime", "চুনের"), "middle", 12, "var(--muted)") + T7(180, 136, L2("water", "পানি"), "middle", 12, "var(--muted)");
    $("#b7ls", el).innerHTML = s + `</svg>`;
    const stB = nB === 0 ? L2("clear", "স্বচ্ছ") : nB < 3 ? L2("turning cloudy", "ঘোলা হতে শুরু করেছে") : L2("milky white", "দুধের মতো সাদা");
    let o = `${L2("Tube 1 (ordinary air)", "টিউব ১ (সাধারণ বাতাস)")}: <b>${L2("clear", "স্বচ্ছ")}</b><br>${L2("Tube 2 (exhaled air)", "টিউব ২ (নিঃশ্বাসের বাতাস)")}: <b>${stB}</b><br>`;
    if (nA + nB === 0) o += L2("Both tubes hold the same clear lime water. Push ordinary air through tube 1, and breathe out through tube 2.", "দুই টিউবেই একই স্বচ্ছ চুনের পানি। টিউব ১-এ সাধারণ বাতাস চালাও, আর টিউব ২-এ নিঃশ্বাস ছাড়ো।");
    else if (nB >= 3) o += `<b>${L2("Conclusion:", "সিদ্ধান্ত:")}</b> ${L2("exhaled air has far more CO₂ (about 4%) than ordinary air (about 0.04%). The CO₂ reacts with lime water and forms white, insoluble calcium carbonate:", "নিঃশ্বাসের বাতাসে CO₂ (প্রায় ৪%) সাধারণ বাতাসের (প্রায় ০.০৪%) চেয়ে অনেক বেশি। এই CO₂ চুনের পানির সাথে বিক্রিয়া করে সাদা, অদ্রবণীয় ক্যালসিয়াম কার্বনেট তৈরি করে:")}<br>Ca(OH)₂ + CO₂ → CaCO₃ + H₂O` + (nA === 0 ? `<br><span class="muted" style="font-size:14px">${L2("Now push the syringe a few times to check the control tube.", "এবার তুলনার টিউবটি যাচাই করতে সিরিঞ্জ কয়েকবার চাপো।")}</span>` : "");
    else if (nB > 0) o += L2("A faint cloudiness is appearing in tube 2. Breathe out a few more times.", "টিউব ২-এ হালকা ঘোলাটে ভাব দেখা দিচ্ছে। আরও কয়েকবার নিঃশ্বাস ছাড়ো।");
    else o += L2("Ordinary air has only about 0.04% CO₂, far too little to show in this short time. Tube 1 is the control. Now try exhaled air.", "সাধারণ বাতাসে CO₂ মাত্র প্রায় ০.০৪%, এত অল্প সময়ে চোখে পড়ার মতো নয়। টিউব ১ হলো তুলনার (নিয়ন্ত্রিত) নমুনা। এবার নিঃশ্বাসের বাতাস দিয়ে দেখো।");
    $("#b7lo", el).innerHTML = o;
  };
  const setView = () => {
    const b = $("#b7bb", el);
    if (view === "br") {
      b.innerHTML = `<div class="svgwrap fit" id="b7bs"></div><div class="w-row" style="margin:8px 0"><button class="btn solid" data-b="1">${L2("Breathe in", "শ্বাস নাও")}</button><button class="btn" data-b="0">${L2("Breathe out", "শ্বাস ছাড়ো")}</button></div><div class="w-out" id="b7bo"></div>`;
      b.querySelectorAll("button[data-b]").forEach(q => q.addEventListener("click", () => { target = +q.dataset.b; started = true; if (REDUCED) f = target; drawBreath(); }));
      drawBreath();
    } else if (view === "al") {
      b.innerHTML = `<div class="chipset b7ag" role="group"><button data-g="o2" aria-pressed="${gas === "o2"}">${L2("Follow O₂", "O₂-এর পথ")}</button><button data-g="co2" aria-pressed="${gas === "co2"}">${L2("Follow CO₂", "CO₂-এর পথ")}</button></div><div class="svgwrap fit" id="b7as" style="margin-top:8px"></div><div class="w-out" id="b7ao" style="margin-top:8px"></div>`;
      chipsB7(el, ".b7ag", q => { gas = q.dataset.g; drawAlv(); });
      drawAlv();
    } else {
      b.innerHTML = `<div class="svgwrap fit" id="b7ls"></div><div class="w-row" style="margin:8px 0"><button class="btn" data-t="a">${L2("Push the syringe", "সিরিঞ্জ চাপো")}</button><button class="btn solid" data-t="b">${L2("Breathe out into tube 2", "টিউব ২-এ নিঃশ্বাস ছাড়ো")}</button><button class="btn" data-t="r">${L2("Reset", "নতুন করে")}</button></div><div class="w-out" id="b7lo"></div>`;
      b.querySelectorAll("button[data-t]").forEach(q => q.addEventListener("click", () => { const t = q.dataset.t; if (t === "a") nA++; else if (t === "b") nB++; else { nA = 0; nB = 0; } lastT = t === "r" ? "" : t; drawLime(); }));
      drawLime();
    }
  };
  chipsB7(el, ".b7bv", b => { view = b.dataset.v; setView(); });
  setView();
  if (!REDUCED) animate(el, dt => {
    if (view === "br" && f !== target) { const d = dt / 1.5; f = target > f ? Math.min(target, f + d) : Math.max(target, f - d); drawBreath(); }
    else if (view === "al") { ph = (ph + dt * 0.1) % 1; posAlv(); }
  });
};

/* 7.3 five diseases: healthy vs diseased picture, facts by tab, and an identify-the-disease game */
W.b7disease = (el) => {
  const D = [
    { k: "asthma", n: L2("Asthma", "হাঁপানি"), kind: "air", st: 1, germ: L2("No germ · not contagious", "জীবাণু নেই · ছোঁয়াচে নয়"),
      cap: L2(["muscles tighten, lining swells:", "the air passage is narrow"], ["পেশি সংকুচিত, আবরণ ফোলা:", "বাতাসের পথ সরু"]),
      what: L2("The body's defence system over-reacts to dust, smoke, pollen or certain foods. The muscles around the small airways tighten and the lining swells, so the passage for air becomes narrow.", "ধুলা, ধোঁয়া, ফুলের রেণু বা কিছু খাবারের প্রতি দেহের প্রতিরোধ-ব্যবস্থা অতিরিক্ত প্রতিক্রিয়া দেখায়। ছোট শ্বাসপথের চারপাশের পেশি সংকুচিত হয়, ভেতরের আবরণ ফুলে ওঠে, ফলে বাতাসের পথ সরু হয়ে যায়।"),
      cause: L2(["Over-reaction of the body's defence (immune) system", "Dust, smoke or pollen breathed in", "Foods that cause allergy in that person (for some: prawn, beef, hilsa)", "Colds in children; a particular season or a change of season", "Often runs in the family"], ["রোগ প্রতিরোধ-ব্যবস্থার অতিরিক্ত প্রতিক্রিয়া", "শ্বাসের সাথে ঢোকা ধুলা, ধোঁয়া বা ফুলের রেণু", "যে খাবারে ওই ব্যক্তির অ্যালার্জি হয় (কারও চিংড়ি, গরুর মাংস, ইলিশ)", "শিশুদের সর্দি-কাশি; বিশেষ ঋতু বা ঋতু পরিবর্তন", "অনেক সময় বংশে থাকে"]),
      symp: L2(["Sudden breathlessness, a feeling of suffocation", "Whistling sound in the chest", "Usually no fever", "Skin between the ribs is pulled in while breathing in", "Lips may turn blue; neck veins swell; weakness"], ["হঠাৎ শ্বাসকষ্ট, দম বন্ধ হওয়ার মতো অবস্থা", "বুকের ভেতর বাঁশির মতো আওয়াজ", "সাধারণত জ্বর থাকে না", "শ্বাস নেওয়ার সময় পাঁজরের মাঝের চামড়া ভেতরে ঢুকে যায়", "ঠোঁট নীল হতে পারে; গলার শিরা ফোলে; দুর্বলতা"]),
      rem: L2(["Not cured completely, but medicine gives relief", "Treatment as the doctor advises", "Avoid the foods and things (animal fur, artificial fibre) that bring on an attack", "No smoking, gul, shada pata or jorda", "Liquid food during an attack"], ["সম্পূর্ণ সারে না, তবে ঔষধে আরাম হয়", "ডাক্তারের পরামর্শ অনুযায়ী চিকিৎসা", "যে খাবার ও জিনিসে (পশুর লোম, কৃত্রিম আঁশ) শ্বাসকষ্ট বাড়ে তা এড়ানো", "ধূমপান, গুল, সাদা পাতা, জর্দা পরিহার", "শ্বাসকষ্টের সময় তরল খাবার"]),
      prev: L2(["Live in healthy surroundings with light and air", "Avoid polluted air and whatever brings on breathlessness at home or work", "Keep the prescribed medicine at hand", "Stay away from quacks who give high doses of steroids"], ["আলো-বাতাসপূর্ণ স্বাস্থ্যকর পরিবেশে বাস", "বায়ুদূষণ এবং ঘরে-বাইরে যা শ্বাসকষ্ট ঘটায় তা এড়ানো", "ডাক্তারের দেওয়া ঔষধ সব সময় সাথে রাখা", "উচ্চমাত্রার স্টেরয়েড দেয় এমন হাতুড়ে চিকিৎসক থেকে দূরে থাকা"]) },
    { k: "bronchitis", n: L2("Bronchitis", "ব্রংকাইটিস"), kind: "air", st: 2, germ: L2("Germ: bacteria (as the book says)", "জীবাণু: ব্যাকটেরিয়া (বই অনুযায়ী)"),
      cap: L2(["lining red and swollen,", "with a lot of mucus (phlegm)"], ["আবরণ লাল ও ফোলা,", "প্রচুর শ্লেষ্মা (কফ)"]),
      what: L2("The inner lining of the bronchi becomes inflamed: red, swollen and covered with extra mucus, which is coughed up as phlegm. Smoke and dust are the main reasons; the book names bacteria as the germ.", "ব্রংকাসের ভেতরের আবরণে প্রদাহ হয়: তা লাল হয়ে ফুলে ওঠে আর বাড়তি শ্লেষ্মায় ঢেকে যায়, যা কাশির সাথে কফ হয়ে বের হয়। প্রধান কারণ ধোঁয়া ও ধুলা; জীবাণু হিসেবে বইয়ে ব্যাকটেরিয়ার নাম আছে।"),
      cause: L2(["Smoking", "Dust and smoke of factories; polluted, unhealthy surroundings", "Damp, dusty weather; catching a cold", "Bacterial attack on the lining"], ["ধূমপান", "কলকারখানার ধুলা ও ধোঁয়া; দূষিত, অস্বাস্থ্যকর পরিবেশ", "স্যাঁতসেঁতে, ধুলাময় আবহাওয়া; ঠান্ডা লাগা", "ঝিল্লিতে ব্যাকটেরিয়ার আক্রমণ"]),
      symp: L2(["Cough, often with phlegm", "Chest pain, severe while coughing", "Breathing difficulty; fever and weakness", "Cannot eat solid food", "Chronic: cough with phlegm for 3 months at a stretch, 2 years running"], ["কাশি, অনেক সময় কফসহ", "বুকে ব্যথা, কাশির সময় প্রচণ্ড", "শ্বাসকষ্ট; জ্বর ও দুর্বলতা", "শক্ত খাবার খেতে পারে না", "ক্রনিক: একটানা ৩ মাস কফসহ কাশি, পরপর ২ বছর"]),
      rem: L2(["Stop smoking, alcohol and tobacco", "Treatment as the doctor advises", "Keep the patient comfortably warm and dry", "Warm, nutritious liquid food (warm milk, soup)", "Full rest"], ["ধূমপান, মদ্যপান ও তামাক বন্ধ করা", "ডাক্তারের পরামর্শ অনুযায়ী চিকিৎসা", "রোগীকে সহনীয় উষ্ণতা ও শুষ্ক পরিবেশে রাখা", "গরম, পুষ্টিকর তরল খাবার (গরম দুধ, স্যুপ)", "পূর্ণ বিশ্রাম"]),
      prev: L2(["Give up smoking and tobacco", "Do not work in dust and smoke", "Protect children and old people from chill"], ["ধূমপান ও তামাক সেবন ত্যাগ করা", "ধুলা ও ধোঁয়াপূর্ণ পরিবেশে কাজ না করা", "শিশু ও বয়স্কদের ঠান্ডা লাগা থেকে রক্ষা করা"]) },
    { k: "pneumonia", n: L2("Pneumonia", "নিউমোনিয়া"), kind: "alv", st: 1, germ: L2("Germ: Pneumococcus bacteria (also viruses, fungi)", "জীবাণু: নিউমোকক্কাস ব্যাকটেরিয়া (ভাইরাস, ছত্রাকও)"),
      cap: L2(["air sacs fill with fluid:", "less room for air"], ["বায়ুথলি তরলে ভরে যায়:", "বাতাসের জায়গা কমে"]),
      what: L2("The lungs themselves are infected. The air sacs fill with a mucus-like fluid, so less oxygen can pass into the blood. It is dangerous for children and the elderly.", "খোদ ফুসফুসে সংক্রমণ হয়। বায়ুথলি শ্লেষ্মা-জাতীয় তরলে ভরে যায়, ফলে রক্তে কম অক্সিজেন যেতে পারে। শিশু ও বয়স্কদের জন্য এটি মারাত্মক।"),
      cause: L2(["Pneumococcus bacteria (one of the main causes)", "Other bacteria, viruses and fungi", "May follow a severe chill, measles or bronchitis", "Fluid from the food pipe entering the windpipe after choking"], ["নিউমোকক্কাস ব্যাকটেরিয়া (অন্যতম প্রধান কারণ)", "অন্য ব্যাকটেরিয়া, ভাইরাস ও ছত্রাক", "অত্যধিক ঠান্ডা লাগা, হাম বা ব্রংকাইটিসের পর হতে পারে", "বিষম খেয়ে খাদ্যনালির রস শ্বাসনালিতে ঢুকলে"]),
      symp: L2(["High fever", "Cough with phlegm", "Breathing difficulty and chest pain", "Final stage: rattling sound in the chest, severe breathlessness"], ["বেশি জ্বর", "কফসহ কাশি", "শ্বাসকষ্ট ও বুকে ব্যথা", "চূড়ান্ত পর্যায়ে বুকে ঘড়ঘড় আওয়াজ, মারাত্মক শ্বাসকষ্ট"]),
      rem: L2(["A doctor's treatment without delay", "Warm, liquid, nutritious food", "Plenty of water to drink"], ["দেরি না করে ডাক্তারের চিকিৎসা", "গরম, তরল, পুষ্টিকর খাবার", "বেশি করে পানি পান"]),
      prev: L2(["Protect children and old people from chill", "Avoid smoking", "Live in a house with light and air", "Keep the patient comfortably warm and dry"], ["শিশু ও বয়স্কদের ঠান্ডা লাগা থেকে রক্ষা করা", "ধূমপান পরিহার করা", "আলো-বাতাসপূর্ণ ঘরে বাস করা", "রোগীকে সহনীয় উষ্ণতায় ও শুষ্ক পরিবেশে রাখা"]) },
    { k: "tb", n: L2("Tuberculosis", "যক্ষ্মা"), kind: "lung", st: 1, germ: L2("Germ: a bacterium · spreads through air", "জীবাণু: ব্যাকটেরিয়া · বায়ুবাহিত"),
      cap: L2(["TB bacteria slowly damage", "patches of the lung"], ["যক্ষ্মার ব্যাকটেরিয়া ধীরে ধীরে", "ফুসফুসের নানা অংশ নষ্ট করে"]),
      what: L2("TB bacteria enter with the air and slowly damage the lungs. They can also settle in other organs, such as the intestine and the bones. The signs appear only when the germs overpower the white blood cells that defend the body.", "যক্ষ্মার ব্যাকটেরিয়া বাতাসের সাথে ঢুকে ধীরে ধীরে ফুসফুসের ক্ষতি করে। অন্ত্র, হাড়ের মতো অন্য অঙ্গেও এরা বাসা বাঁধতে পারে। জীবাণু যখন দেহের রক্ষক শ্বেত রক্তকণিকাকে পরাস্ত করে, তখনই লক্ষণ প্রকাশ পায়।"),
      cause: L2(["<i>Mycobacterium tuberculosis</i>, a bacterium; spreads through the air", "Sometimes through the milk of an infected cow or an infected skin wound", "Easier in people who are weak, undernourished or overworked", "Damp, unhealthy housing; living with a TB patient"], ["<i>Mycobacterium tuberculosis</i> নামের ব্যাকটেরিয়া; বাতাসে ছড়ায়", "কখনো সংক্রমিত গরুর দুধ বা জীবাণুযুক্ত ত্বকের ক্ষত থেকে", "দুর্বল, অপুষ্ট বা অতি পরিশ্রমী মানুষ সহজে আক্রান্ত হয়", "স্যাঁতসেঁতে অস্বাস্থ্যকর বাসস্থান; যক্ষ্মা রোগীর সাথে বসবাস"]),
      symp: L2(["Cough for more than 3 weeks, sometimes with blood", "Mild fever towards evening; sweating at night", "Loss of weight, slowly growing weakness", "Pain in the chest and back; indigestion"], ["৩ সপ্তাহের বেশি কাশি, কখনো কাশির সাথে রক্ত", "বিকেলের দিকে হালকা জ্বর; রাতে ঘাম", "ওজন কমা, ধীরে ধীরে দুর্বলতা", "বুকে ও পিঠে ব্যথা; অজীর্ণ"]),
      rem: L2(["Long treatment, exactly as the doctor advises", "Never stop the medicine without the doctor's instruction", "Keep the patient's things separate; bury the phlegm in the soil", "Nutritious food; hospital or sanatorium if needed"], ["ডাক্তারের পরামর্শমতো দীর্ঘমেয়াদি চিকিৎসা", "ডাক্তারের নির্দেশ ছাড়া কখনো ঔষধ বন্ধ না করা", "রোগীর জিনিসপত্র আলাদা রাখা; কফ মাটিতে পুঁতে ফেলা", "পুষ্টিকর খাবার; প্রয়োজনে হাসপাতাল বা স্যানাটোরিয়াম"]),
      prev: L2(["BCG vaccine for every child, within one year of birth", "BCG does not give lifelong protection", "Healthy, airy living conditions and good food"], ["প্রতিটি শিশুকে জন্মের এক বছরের মধ্যে বিসিজি টিকা", "বিসিজি আজীবন সুরক্ষা দেয় না", "স্বাস্থ্যকর, আলো-বাতাসপূর্ণ পরিবেশ ও পুষ্টিকর খাবার"]) },
    { k: "cancer", n: L2("Lung cancer", "ফুসফুসের ক্যান্সার"), kind: "lung", st: 2, germ: L2("No germ · not contagious", "জীবাণু নেই · ছোঁয়াচে নয়"),
      cap: L2(["cells divide without control", "and form a growing lump"], ["কোষ অনিয়ন্ত্রিতভাবে বিভাজিত", "হয়ে বাড়ন্ত পিণ্ড তৈরি করে"]),
      what: L2("Cells of the lung start dividing without control and form a growing lump. The earlier it is found, the better the chance of treatment.", "ফুসফুসের কোষ অনিয়ন্ত্রিতভাবে বিভাজিত হতে শুরু করে আর একটি বাড়ন্ত পিণ্ড তৈরি হয়। যত আগে ধরা পড়ে, চিকিৎসার সুযোগ তত ভালো।"),
      cause: L2(["Smoking (one of the main causes)", "Air and environmental pollution", "Asbestos, arsenic, chromium, nickel and hard-metal dust at home or work", "Old damage to the lung (the book mentions TB and some pneumonia)"], ["ধূমপান (অন্যতম প্রধান কারণ)", "বায়ু ও পরিবেশদূষণ", "বাসস্থান বা কর্মক্ষেত্রে অ্যাসবেস্টস, আর্সেনিক, ক্রোমিয়াম, নিকেল, কঠিন ধাতুর গুঁড়া", "ফুসফুসের পুরোনো ক্ষত (বইয়ে যক্ষ্মা ও কিছু নিউমোনিয়ার কথা আছে)"]),
      symp: L2(["Dry cough and chest pain lasting a long time", "Hoarse voice", "Loss of weight and appetite", "Breathlessness and frequent fever", "Bronchitis or pneumonia again and again"], ["দীর্ঘদিন ধরে খুসখুসে কাশি ও বুকে ব্যথা", "ভগ্নস্বর", "ওজন কমা ও ক্ষুধামান্দ্য", "শ্বাসকষ্ট ও ঘন ঘন জ্বর", "বারবার ব্রংকাইটিস বা নিউমোনিয়া"]),
      rem: L2(["See a doctor without delay", "Tests: sputum, chest X-ray, CT scan, MRI; then cyto- and histopathology", "Treatment as advised; radiation therapy if needed"], ["অনতিবিলম্বে ডাক্তারের পরামর্শ নেওয়া", "পরীক্ষা: কফ, বুকের এক্স-রে, সিটি স্ক্যান, এমআরআই; পরে সাইটো ও হিস্টোপ্যাথলজি", "পরামর্শ অনুযায়ী চিকিৎসা; প্রয়োজনে রেডিয়েশন থেরাপি"]),
      prev: L2(["No smoking and no alcohol", "Not too much fatty food", "Regular exercise", "Enough vegetables every day"], ["ধূমপান ও মদ্যপান না করা", "অতিরিক্ত চর্বিজাতীয় খাবার না খাওয়া", "নিয়মিত ব্যায়াম", "পরিমাণমতো শাকসবজি খাওয়া"]) }];
  const TABS = [["what", L2("What happens", "কী ঘটে")], ["cause", L2("Cause", "কারণ")], ["symp", L2("Symptoms", "লক্ষণ")], ["rem", L2("Remedy", "প্রতিকার")], ["prev", L2("Prevention", "প্রতিরোধ")]];
  const QS = [
    [L2("Sudden breathlessness with a whistling sound in the chest. No fever. The skin between the ribs is pulled in.", "হঠাৎ শ্বাসকষ্ট, বুকের ভেতর বাঁশির মতো আওয়াজ। জ্বর নেই। পাঁজরের মাঝের চামড়া ভেতরে ঢুকে যাচ্ছে।"), "asthma"],
    [L2("Cough with phlegm for more than three months at a stretch, two years running. The patient has smoked for many years.", "একটানা তিন মাসের বেশি কফসহ কাশি, পরপর দুই বছর। রোগী বহু বছর ধরে ধূমপান করেন।"), "bronchitis"],
    [L2("A small child has high fever, cough with phlegm and a rattling sound in the chest, soon after measles.", "হামের পরপরই একটি ছোট শিশুর বেশি জ্বর, কফসহ কাশি আর বুকে ঘড়ঘড় আওয়াজ।"), "pneumonia"],
    [L2("Cough for more than three weeks, sometimes with blood. Mild fever in the evening, sweating at night, loss of weight.", "তিন সপ্তাহের বেশি কাশি, কখনো কাশির সাথে রক্ত। বিকেলে হালকা জ্বর, রাতে ঘাম, ওজন কমছে।"), "tb"],
    [L2("Long-lasting dry cough, hoarse voice and loss of weight in a man who worked with asbestos for years. Tests show cells dividing without control.", "বহু বছর অ্যাসবেস্টস নিয়ে কাজ করা এক ব্যক্তির দীর্ঘদিনের খুসখুসে কাশি, ভগ্নস্বর, ওজন কমা। পরীক্ষায় দেখা গেল কোষ অনিয়ন্ত্রিতভাবে বিভাজিত হচ্ছে।"), "cancer"],
    [L2("Children are protected from it by the BCG vaccine, given within a year of birth.", "জন্মের এক বছরের মধ্যে দেওয়া বিসিজি টিকা শিশুদের এ রোগ থেকে সুরক্ষা দেয়।"), "tb"],
    [L2("Not contagious and not caused by a germ. Often runs in the family. Gets worse in a particular season.", "ছোঁয়াচে নয়, জীবাণুঘটিতও নয়। অনেক সময় বংশে থাকে। বিশেষ ঋতুতে বেড়ে যায়।"), "asthma"],
    [L2("Caused mainly by Pneumococcus bacteria. Mucus-like fluid collects in the air sacs of the lungs.", "প্রধানত নিউমোকক্কাস ব্যাকটেরিয়ার আক্রমণে হয়। ফুসফুসের বায়ুথলিতে শ্লেষ্মা-জাতীয় তরল জমে।"), "pneumonia"],
    [L2("Inflammation of the inner lining of the bronchi.", "ব্রংকাসের ভেতরের আবরণের প্রদাহ।"), "bronchitis"],
    [L2("Radiation therapy may be used. Finding it early is very important.", "চিকিৎসায় রেডিয়েশন থেরাপি লাগতে পারে। শুরুতেই ধরা পড়া খুব জরুরি।"), "cancer"],
    [L2("It can also affect the intestine and the bones, not only the lungs.", "শুধু ফুসফুস নয়, অন্ত্র ও হাড়েও হতে পারে।"), "tb"]];
  let view = "info", di = 0, tab = "what", order = [], qi = 0, score = 0, picked = null;
  el.innerHTML = `<div class="chipset b7dv" role="group"><button data-v="info" aria-pressed="true">${B7(1)}. ${L2("Five diseases", "পাঁচটি রোগ")}</button><button data-v="game" aria-pressed="false">${B7(2)}. ${L2("Which disease?", "কোন রোগ?")}</button></div><div id="b7db" style="margin-top:8px"></div>`;
  const ring = (cx, st) => {
    const cy = 92, rm = st === 1 ? 47 : 52, rl = st === 1 ? 35 : 44, ra = st === 0 ? 36 : st === 1 ? 15 : 25;
    let s = `<circle cx="${cx}" cy="${cy}" r="${rm}" fill="${st === 1 ? "#a8502c" : "#cf8f76"}" stroke="var(--ink)" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="${rl}" fill="${st === 0 ? "#f1c9bf" : "#e2675b"}" stroke="var(--ink)" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${ra}" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/>`;
    if (st === 0) s += T7(cx, cy + 5, L2("air", "বাতাস"), "middle", 13);
    if (st === 1) s += [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([a, b]) => AR7(cx + a * 70, cy + b * 62, cx + a * 53, cy + b * 51, "b7dm", "var(--ink)", 2.5)).join("") + `<circle cx="${cx - 5}" cy="${cy + 6}" r="5" fill="${MUC7}" stroke="#a8922f" stroke-width="1"/><circle cx="${cx + 7}" cy="${cy - 5}" r="3.5" fill="${MUC7}" stroke="#a8922f" stroke-width="1"/>`;
    if (st === 2) s += `<path d="M${cx - 24.5} ${cy + 5} A25 25 0 0 0 ${cx + 24.5} ${cy + 5} Q${cx + 8} ${cy - 6} ${cx - 4} ${cy + 3} Q${cx - 14} ${cy + 9} ${cx - 24.5} ${cy + 5} Z" fill="${MUC7}" stroke="#a8922f" stroke-width="1"/><circle cx="${cx - 8}" cy="${cy - 12}" r="4" fill="${MUC7}" stroke="#a8922f" stroke-width="1"/>`;
    return s;
  };
  const alv = (cx, ill) => [[-34, -22, 1], [0, -36, 0.55], [34, -22, 1], [-20, 18, 0.7], [20, 18, 1]].map(([dx, dy, fr], i) => {
    const x = cx + dx, y = 98 + dy, r = 22;
    let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--sheet)" stroke="${LEAF7}" stroke-width="2.5"/>`;
    if (ill) {
      if (fr >= 1) s += `<circle cx="${x}" cy="${y}" r="${r - 1.5}" fill="${MUC7}" opacity=".85"/>`;
      else { const y0 = y + (r - 1.5) * (1 - 2 * fr), hc = Math.sqrt((r - 1.5) ** 2 - (y0 - y) ** 2); s += `<path d="M${(x - hc).toFixed(1)} ${y0.toFixed(1)} A${r - 1.5} ${r - 1.5} 0 ${fr > 0.5 ? 1 : 0} 0 ${(x + hc).toFixed(1)} ${y0.toFixed(1)} Z" fill="${MUC7}" opacity=".85"/>`; }
      s += [[-7, 8], [6, 12], [0, 2 + i]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="2" fill="#5b3d1e"/>`).join("");
    } else if (i === 1) s += T7(x, y + 5, L2("air", "বাতাস"), "middle", 12);
    return s;
  }).join("");
  const lungs = (cx, st) => {
    const Lp = `M${cx - 8} 44 Q${cx - 40} 38 ${cx - 58} 84 Q${cx - 72} 124 ${cx - 68} 150 Q${cx - 64} 162 ${cx - 46} 158 Q${cx - 22} 152 ${cx - 6} 140 Z`, Rp = `M${cx + 8} 44 Q${cx + 40} 38 ${cx + 58} 84 Q${cx + 72} 124 ${cx + 68} 150 Q${cx + 64} 162 ${cx + 46} 158 Q${cx + 22} 152 ${cx + 6} 140 Z`;
    let s = `<path d="${Lp}" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.5"/><path d="${Rp}" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.5"/><rect x="${cx - 5}" y="24" width="10" height="34" rx="4" fill="var(--c)" opacity=".7"/><path d="M${cx} 56 L${cx - 24} 80 M${cx} 56 L${cx + 24} 80" stroke="var(--c)" stroke-width="5" stroke-linecap="round" opacity=".7" fill="none"/>`;
    if (st === 1) s += [[-34, 70, 8], [-48, 100, 6], [-26, 108, 4], [32, 66, 6], [44, 96, 9], [28, 120, 4]].map(([dx, y, r]) => `<circle cx="${cx + dx}" cy="${y}" r="${r}" fill="#8a6d3b" opacity=".85" stroke="#5b3d1e" stroke-width="1"/>`).join("") + [[-20, 84, 30], [-52, 124, -20], [18, 88, -40], [52, 122, 15], [-40, 134, 60], [36, 140, 80]].map(([dx, y, a]) => `<line x1="${cx + dx - 4}" y1="${y}" x2="${cx + dx + 4}" y2="${y}" stroke="#5b3d1e" stroke-width="2.2" stroke-linecap="round" transform="rotate(${a} ${cx + dx} ${y})"/>`).join("");
    if (st === 2) { const tx = cx + 38, ty = 104; s += [[0, 0, 13], [10, -7, 9], [-10, -6, 9], [-7, 10, 9], [9, 9, 10]].map(([a, b, r]) => `<circle cx="${tx + a}" cy="${ty + b}" r="${r}" fill="#6b3f63" stroke="var(--ink)" stroke-width="1"/>`).join("") + [[0, 0, 12], [10, -7, 8], [-10, -6, 8], [-7, 10, 8], [9, 9, 9]].map(([a, b, r]) => `<circle cx="${tx + a}" cy="${ty + b}" r="${r}" fill="#6b3f63"/>`).join("") + [[-26, -18, 4], [-20, 22, 3.5], [14, 30, 3]].map(([a, b, r]) => `<circle cx="${tx + a}" cy="${ty + b}" r="${r}" fill="#6b3f63"/>`).join(""); }
    return s;
  };
  const drawInfo = () => {
    const d = D[di];
    let s = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("Healthy and diseased compared", "সুস্থ ও রোগাক্রান্ত অবস্থার তুলনা")}">${arrowDefs("b7dm", "var(--ink)")}`;
    s += `<line x1="180" y1="8" x2="180" y2="162" stroke="var(--rule)" stroke-width="2"/>` + T7(90, 16, L2("Healthy", "সুস্থ"), "middle", 13, "var(--good)", "700") + T7(270, 16, d.n, "middle", 13, "var(--bad)", "700");
    s += d.kind === "air" ? ring(90, 0) + ring(270, d.st) : d.kind === "alv" ? alv(90, false) + alv(270, true) : lungs(90, 0) + lungs(270, d.st);
    const hc = d.kind === "air" ? L2(["an airway cut across:", "wide open for air"], ["শ্বাসপথের প্রস্থচ্ছেদ:", "বাতাসের জন্য খোলা"]) : d.kind === "alv" ? L2(["air sacs (alveoli):", "full of air"], ["বায়ুথলি (অ্যালভিওলি):", "বাতাসে ভরা"]) : L2(["healthy lungs:", "clean and spongy"], ["সুস্থ ফুসফুস:", "পরিষ্কার, স্পঞ্জের মতো"]);
    s += hc.map((t, i) => T7(90, 178 + i * 15, t, "middle", 12)).join("") + d.cap.map((t, i) => T7(270, 178 + i * 15, t, "middle", 12)).join("");
    $("#b7ds2", el).innerHTML = s + `</svg>`;
    const key = d.kind === "air" ? L2("Outer ring: muscle. Inner ring: lining. Yellow: mucus.", "বাইরের বলয়: পেশি। ভেতরের বলয়: আবরণ। হলুদ: শ্লেষ্মা।") : d.kind === "alv" ? L2("Yellow: fluid. Dots: germs.", "হলুদ: তরল। ফুটকি: জীবাণু।") : d.st === 1 ? L2("Brown patches: damaged parts. Small rods: bacteria.", "বাদামি দাগ: ক্ষতিগ্রস্ত অংশ। ছোট দণ্ড: ব্যাকটেরিয়া।") : L2("Dark lump: the growing mass of cells (tumour).", "গাঢ় পিণ্ড: বাড়তে থাকা কোষের দলা (টিউমার)।");
    $("#b7dg", el).innerHTML = `<div class="muted" style="font-size:13px;margin-bottom:6px">${key}</div><span style="display:inline-block;font-size:14px;font-weight:600;padding:3px 10px;border-radius:99px;background:var(--note-soft);color:var(--note)">${d.germ}</span>`;
    $("#b7do2", el).innerHTML = `<b>${d.n}: ${TABS.find(t => t[0] === tab)[1]}</b>` + (tab === "what" ? `<br>${d.what}` : UL7(d[tab]));
  };
  const drawGame = () => {
    const b = $("#b7db", el), n = order.length;
    if (qi >= n) {
      b.innerHTML = `<div class="w-out"><b>${L2(`You identified ${score} out of ${n}.`, `${B7(n)}টির মধ্যে ${B7(score)}টি ঠিক চিনেছ।`)}</b><br>${score === n ? L2("Excellent! You know all five diseases by their signs.", "চমৎকার! লক্ষণ দেখে পাঁচটি রোগই চিনতে পারো।") : L2("Look again at the diseases you missed in “Five diseases”, then try once more.", "যেগুলো ভুল হয়েছে সেগুলো “পাঁচটি রোগ” থেকে আবার দেখে নাও, তারপর আরেকবার চেষ্টা করো।")}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b7gr">${L2("Play again", "আবার খেলো")}</button></div>`;
      $("#b7gr", el).addEventListener("click", startGame); return;
    }
    const q = QS[order[qi]], ans = D.find(d => d.k === q[1]);
    b.innerHTML = `<p class="hint" style="margin:0 0 6px">${L2(`Clue ${qi + 1} of ${n} · correct so far: ${score}`, `সূত্র ${B7(qi + 1)} / ${B7(n)} · এ পর্যন্ত ঠিক: ${B7(score)}`)}</p>
      <div class="w-out">${q[0]}</div>
      <div class="chipset b7gc" role="group" style="margin:8px 0">${D.map(d => `<button data-k="${d.k}" aria-pressed="${picked !== null && d.k === q[1]}"${picked !== null ? " disabled" : ""}>${d.n}</button>`).join("")}</div>
      <div id="b7gf">${picked === null ? "" : `<p style="margin:0 0 8px">${picked === q[1] ? `<b style="color:var(--good)">${L2("Correct.", "ঠিক বলেছ।")}</b>` : `<b style="color:var(--bad)">${L2("Not quite.", "ঠিক হয়নি।")}</b> ${L2("The answer is", "সঠিক উত্তর")}: <b>${ans.n}</b>${L2(".", "।")}`} ${ans.what}</p><button class="btn solid" id="b7gn">${qi === n - 1 ? L2("See the result", "ফলাফল দেখো") : L2("Next clue ›", "পরের সূত্র ›")}</button>`}</div>`;
    if (picked === null) b.querySelectorAll(".b7gc button").forEach(x => x.addEventListener("click", () => { picked = x.dataset.k; if (picked === q[1]) score++; drawGame(); }));
    else $("#b7gn", el).addEventListener("click", () => { qi++; picked = null; drawGame(); });
  };
  function startGame() { order = QS.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 8); qi = 0; score = 0; picked = null; drawGame(); }
  const setView = () => {
    const b = $("#b7db", el);
    if (view === "info") {
      b.innerHTML = `<div class="chipset b7dd" role="group">${D.map((d, i) => `<button data-i="${i}" aria-pressed="${i === di}">${d.n}</button>`).join("")}</div>
        <div class="svgwrap fit" id="b7ds2" style="margin-top:8px"></div><div id="b7dg" style="margin:6px 0"></div>
        <div class="chipset b7dt" role="group">${TABS.map(t => `<button data-t="${t[0]}" aria-pressed="${t[0] === tab}">${t[1]}</button>`).join("")}</div>
        <div class="w-out" id="b7do2" style="margin-top:8px"></div>`;
      chipsB7(el, ".b7dd", q => { di = +q.dataset.i; drawInfo(); });
      chipsB7(el, ".b7dt", q => { tab = q.dataset.t; drawInfo(); });
      drawInfo();
    } else startGame();
  };
  chipsB7(el, ".b7dv", b => { view = b.dataset.v; setView(); });
  setView();
};
