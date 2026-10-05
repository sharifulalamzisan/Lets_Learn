/* ---- biology chapter 10 widgets: co-ordination ---- */
const B10 = x => bnNum(x, LANG);
const chips10 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T10 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "", halo = false) => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${halo ? ` paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"` : ""}>${s}</text>`;
const LD10 = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1"/>`;
const SUN10 = "#f2b233", LEAF10 = "#4a9d5b", AUX10 = "#c2571a", MY10 = "#e3c56a", MUS10 = "#b0643c", BLU10 = "#3b82c4", GLU10 = "#e08a1e";
const F10 = n => (+n).toFixed(1);

/* 10.1 phototropism (auxin on the shaded side) + photoperiodism (day length and flowering) */
W.b10plant = (el) => {
  let view = "light", dir = "left", b = -1;
  el.innerHTML = `<div class="chipset b10pv" role="group"><button data-v="light" aria-pressed="true">${B10(1)}. ${L2("Light and bending", "আলো ও বেঁকে যাওয়া")}</button><button data-v="day" aria-pressed="false">${B10(2)}. ${L2("Day length and flowers", "দিনের দৈর্ঘ্য ও ফুল")}</button></div><div id="b10pb" style="margin-top:8px"></div>`;
  const target = () => dir === "left" ? -1 : dir === "right" ? 1 : 0;
  const drawLight = () => {
    const tx = 100 + 46 * b, ty = 96 + 14 * Math.abs(b), ang = Math.atan2(ty - 150, tx - 100) * 180 / Math.PI;
    const [sx, sy] = dir === "left" ? [30, 40] : dir === "right" ? [170, 40] : [100, 26];
    let s = `<svg viewBox="0 0 360 290" role="img" aria-label="${L2("A stem bending towards light", "আলোর দিকে কাণ্ডের বেঁকে যাওয়া")}">${arrowDefs("b10pa", SUN10)}`;
    s += [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const c = Math.cos(a * Math.PI / 180), n = Math.sin(a * Math.PI / 180); return `<line x1="${F10(sx + c * 14)}" y1="${F10(sy + n * 14)}" x2="${F10(sx + c * 20)}" y2="${F10(sy + n * 20)}" stroke="${SUN10}" stroke-width="2.5" stroke-linecap="round"/>`; }).join("") + `<circle cx="${sx}" cy="${sy}" r="10" fill="${SUN10}"/>`;
    const rays = dir === "left" ? [[52, 56, 82, 84], [50, 78, 78, 110], [56, 44, 92, 66]] : dir === "right" ? [[148, 56, 118, 84], [150, 78, 122, 110], [144, 44, 108, 66]] : [[84, 46, 84, 76], [100, 50, 100, 78], [116, 46, 116, 76]];
    s += rays.map(([a, c, d, e]) => `<line x1="${a}" y1="${c}" x2="${d}" y2="${e}" stroke="${SUN10}" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#b10pa)"/>`).join("");
    s += `<path d="M72 238 L128 238 L120 278 L80 278 Z" fill="${MUS10}" stroke="var(--ink)" stroke-width="1.2"/><path d="M70 238 h60" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M100 238 C100 192 100 152 ${F10(tx)} ${F10(ty)}" fill="none" stroke="${LEAF10}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<ellipse cx="80" cy="204" rx="20" ry="8" transform="rotate(-24 80 204)" fill="${LEAF10}" opacity=".85"/><ellipse cx="121" cy="180" rx="20" ry="8" transform="rotate(24 121 180)" fill="${LEAF10}" opacity=".85"/>`;
    s += `<g transform="translate(${F10(tx)} ${F10(ty)}) rotate(${F10(ang)})"><ellipse cx="12" cy="-7" rx="14" ry="6" transform="rotate(-28 12 -7)" fill="${LEAF10}"/><ellipse cx="12" cy="7" rx="14" ry="6" transform="rotate(28 12 7)" fill="${LEAF10}"/></g>`;
    s += T10(100, 288, L2("plant in a pot", "টবের গাছ"), "middle", 12, "var(--muted)");
    /* enlarged tip: two columns of cells */
    s += `<rect x="212" y="6" width="144" height="278" rx="12" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5" stroke-dasharray="5 4"/>` + T10(284, 24, L2("inside the stem tip", "কাণ্ডের ডগার ভেতরে"), "middle", 12.5, "var(--ink)", "700") + T10(284, 39, L2("(enlarged)", "(বড় করে)"), "middle", 12, "var(--muted)");
    const hL = 30 * (1 + 0.4 * Math.max(0, b)), hR = 30 * (1 + 0.4 * Math.max(0, -b)), base = 226;
    const col = (x, h) => [0, 1, 2, 3].map(i => `<rect x="${x}" y="${F10(base - h * (i + 1))}" width="40" height="${F10(h)}" rx="5" fill="var(--c-soft)" stroke="${LEAF10}" stroke-width="2"/>`).join("");
    s += col(240, hL) + col(288, hR);
    const nL = Math.round(6 + 4 * b), nR = 12 - nL;
    const dots = (x, h, n) => Array.from({ length: n }, (_, i) => `<circle cx="${x + 8 + (i * 17) % 25}" cy="${F10(base - 8 - (i + 0.5) * (4 * h - 14) / n)}" r="3.4" fill="${AUX10}"/>`).join("");
    s += dots(240, hL, nL) + dots(288, hR, nR);
    const lit = L2("lit side", "আলোকিত পাশ"), sh = L2("shaded side", "অন্ধকার পাশ");
    if (dir === "up") s += T10(284, 243, L2("both sides get", "দুই পাশে"), "middle", 12.5) + T10(284, 258, L2("equal light", "সমান আলো"), "middle", 12.5);
    else s += T10(218, 243, dir === "left" ? lit : sh, "start", 12.5, dir === "left" ? "var(--note)" : "var(--ink)", "700") + T10(350, 258, dir === "left" ? sh : lit, "end", 12.5, dir === "left" ? "var(--ink)" : "var(--note)", "700") + LD10(260, 230, 260, 233) + LD10(308, 230, 308, 247);
    if (dir !== "up") { const lx = dir === "left" ? 226 : 342; s += `<circle cx="${lx}" cy="150" r="6" fill="${SUN10}"/>`; }
    s += `<circle cx="254" cy="272" r="4" fill="${AUX10}"/>` + T10(264, 276, L2("= auxin", "= অক্সিন"), "start", 12.5);
    $("#b10ps", el).innerHTML = s + `</svg>`;
  };
  const outLight = () => {
    const side = dir === "left" ? L2("left", "বাম") : L2("right", "ডান"), other = dir === "left" ? L2("right", "ডান") : L2("left", "বাম");
    $("#b10po", el).innerHTML = dir === "up"
      ? `<b>${L2("Light from above.", "আলো ওপর থেকে।")}</b> ${L2("Both sides of the tip get the same light, so auxin is spread equally. Both sides grow at the same rate and the stem grows straight up.", "ডগার দুই পাশ সমান আলো পায়, তাই অক্সিন দুই পাশে সমানভাবে থাকে। দুই পাশ সমান হারে বাড়ে, আর কাণ্ড সোজা ওপরে ওঠে।")}`
      : `<b>${L2(`Light from the ${side}.`, `আলো ${side} দিক থেকে।`)}</b> ${L2(`Auxin gathers on the shaded (${other}) side. The cells there grow longer than the cells on the lit side, so the stem bends to the ${side}, towards the light. This is positive phototropism.`, `অক্সিন অন্ধকার (${other}) পাশে জমে। সেখানকার কোষ আলোকিত পাশের কোষের চেয়ে বেশি লম্বা হয়, তাই কাণ্ড ${side} দিকে, অর্থাৎ আলোর দিকে বেঁকে যায়। এটিই পজিটিভ ফটোট্রপিজম।`)}`;
  };
  const PL = [
    [L2("Chrysanthemum", "চন্দ্রমল্লিকা"), 0, "#e8b923", "#b5791a"], [L2("Lettuce", "লেটুস"), 1, "#e6d85a", "#b59c1a"], [L2("Cucumber", "শসা"), 2, "#f0c832", "#b5791a"],
    [L2("Dahlia", "ডালিয়া"), 0, "#d6457a", "#f0c832"], [L2("Ridge gourd", "ঝিঙা"), 1, "#f0c832", "#b5791a"], [L2("Sunflower", "সূর্যমুখী"), 2, "#f2a900", "#6b4423"]];
  const drawDay = () => {
    const h = sv(el, "b10ph", L2("h", "ঘণ্টা"), 0), ok = g => g === 2 || (g === 0 ? h <= 12 : h >= 12), lw = 336 * h / 24;
    let s = `<svg viewBox="0 0 360 296" role="img" aria-label="${L2("Which plants flower at this day length", "এই দিনের দৈর্ঘ্যে কোন গাছে ফুল ফোটে")}">`;
    s += `<rect x="12" y="6" width="336" height="26" rx="8" fill="var(--ink)" opacity=".78"/><rect x="12" y="6" width="${F10(lw)}" height="26" rx="8" fill="${SUN10}"/>`;
    s += T10(12 + lw / 2, 24, L2(`light ${h} h`, `আলো ${B10(h)} ঘণ্টা`), "middle", 12.5, "#3a2a00", "700") + T10(12 + lw + (336 - lw) / 2, 24, L2(`dark ${24 - h} h`, `অন্ধকার ${B10(24 - h)} ঘণ্টা`), "middle", 12.5, "var(--sheet)", "700");
    const HD = [[L2("Short-day", "ছোটদিনের"), L2("8–12 h", "৮–১২ ঘণ্টা")], [L2("Long-day", "বড়দিনের"), L2("12–16 h", "১২–১৬ ঘণ্টা")], [L2("Day-neutral", "আলোক নিরপেক্ষ"), L2("any length", "যেকোনো দৈর্ঘ্য")]];
    HD.forEach(([a, c], i) => { s += T10(64 + i * 116, 50, a, "middle", 12.5, "var(--ink)", "700") + T10(64 + i * 116, 65, c, "middle", 12, "var(--muted)"); });
    PL.forEach(([name, g, pc, cc], i) => {
      const x = 8 + (i % 3) * 116, y = 72 + Math.floor(i / 3) * 112, cx = x + 56, f = ok(g);
      s += `<rect x="${x}" y="${y}" width="112" height="106" rx="10" fill="var(--paper)" stroke="${f ? "var(--good)" : "var(--rule)"}" stroke-width="${f ? 2.5 : 1.5}"/>`;
      s += `<path d="M${cx} ${y + 80} V${y + 42}" stroke="${LEAF10}" stroke-width="4" stroke-linecap="round"/><ellipse cx="${cx - 13}" cy="${y + 66}" rx="13" ry="5" transform="rotate(-25 ${cx - 13} ${y + 66})" fill="${LEAF10}"/><ellipse cx="${cx + 13}" cy="${y + 58}" rx="13" ry="5" transform="rotate(25 ${cx + 13} ${y + 58})" fill="${LEAF10}"/>`;
      if (f) s += [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<circle cx="${F10(cx + 11 * Math.cos(a * Math.PI / 180))}" cy="${F10(y + 28 + 11 * Math.sin(a * Math.PI / 180))}" r="5.5" fill="${pc}"/>`).join("") + `<circle cx="${cx}" cy="${y + 28}" r="6" fill="${cc}"/>`;
      else s += `<ellipse cx="${cx}" cy="${y + 36}" rx="5" ry="8" fill="${LEAF10}" opacity=".7"/>`;
      s += T10(cx, y + 98, name, "middle", name.length > 11 ? 12 : 12.5, f ? "var(--ink)" : "var(--muted)", f && name.length <= 11 ? "700" : "");
    });
    $("#b10ds", el).innerHTML = s + `</svg>`;
    const n = L2(`${h} hours of light`, `${B10(h)} ঘণ্টা আলো`);
    $("#b10do", el).innerHTML = h === 12
      ? `<b>${n}.</b> ${L2("This is the border line in your book's figures (8–12 h and 12–16 h), so both the short-day and the long-day plants can flower.", "বইয়ের হিসাবে (৮–১২ ঘণ্টা ও ১২–১৬ ঘণ্টা) এটি ঠিক সীমারেখা, তাই ছোটদিনের ও বড়দিনের দুই দলের উদ্ভিদেই ফুল ফুটতে পারে।")}`
      : h < 12
        ? `<b>${n}.</b> ${L2("The day is short: chrysanthemum and dahlia flower. It is too short for lettuce and ridge gourd. Cucumber and sunflower do not depend on day length.", "দিন ছোট: চন্দ্রমল্লিকা ও ডালিয়ায় ফুল ফোটে। লেটুস ও ঝিঙার জন্য এটি কম। শসা ও সূর্যমুখী দিনের দৈর্ঘ্যের ওপর নির্ভর করে না।")}`
        : `<b>${n}.</b> ${L2("The day is long: lettuce and ridge gourd flower. It is too long for chrysanthemum and dahlia. Cucumber and sunflower do not depend on day length.", "দিন বড়: লেটুস ও ঝিঙায় ফুল ফোটে। চন্দ্রমল্লিকা ও ডালিয়ার জন্য এটি বেশি। শসা ও সূর্যমুখী দিনের দৈর্ঘ্যের ওপর নির্ভর করে না।")}`;
  };
  const setView = () => {
    const box = $("#b10pb", el);
    if (view === "light") {
      box.innerHTML = `<div class="w-row"><span class="muted">${L2("Light comes from:", "আলো আসছে:")}</span><div class="chipset b10pd" role="group"><button data-d="left" aria-pressed="${dir === "left"}">${L2("the left", "বাম থেকে")}</button><button data-d="up" aria-pressed="${dir === "up"}">${L2("above", "ওপর থেকে")}</button><button data-d="right" aria-pressed="${dir === "right"}">${L2("the right", "ডান থেকে")}</button></div></div>
        <div class="svgwrap fit" id="b10ps" style="margin-top:8px"></div><div class="w-out" id="b10po" style="margin-top:8px"></div>`;
      chips10(el, ".b10pd", q => { dir = q.dataset.d; if (REDUCED) b = target(); drawLight(); outLight(); });
      drawLight(); outLight();
    } else {
      box.innerHTML = slider("b10ph", L2("Hours of light in a day", "দিনে আলো থাকে"), 8, 16, 1, 10, "h") + `<div class="svgwrap fit" id="b10ds" style="margin-top:8px"></div><div class="w-out" id="b10do" style="margin-top:8px"></div>`;
      $("#b10ph", el).addEventListener("input", drawDay);
      drawDay();
    }
  };
  chips10(el, ".b10pv", q => { view = q.dataset.v; setView(); });
  setView();
  if (!REDUCED) animate(el, dt => {
    if (view !== "light" || !$("#b10ps", el)) return;
    const t = target(); if (Math.abs(b - t) < 0.005) return;
    b += Math.sign(t - b) * Math.min(Math.abs(t - b), dt * 1.4); drawLight();
  });
};

/* 10.3 the neuron: tap the parts, then send an impulse (node-to-node jumps, one-way synapse) */
W.b10neuron = (el) => {
  const PARTS = [
    ["dendrite", L2("Dendrite", "ডেনড্রাইট"), L2("Short, branched processes around the cell body (the main branches are dendrons, the finer ones dendrites). They receive impulses from other neurons and bring them to the cell body.", "কোষদেহের চারদিকের ছোট, শাখাযুক্ত প্রলম্বিত অংশ (মূল শাখা ডেনড্রন, সূক্ষ্ম শাখা ডেনড্রাইট)। এরা অন্য নিউরন থেকে তাড়না গ্রহণ করে কোষদেহে আনে।")],
    ["body", L2("Cell body", "কোষদেহ"), L2("The round, oval or star-shaped part with the plasma membrane, cytoplasm and nucleus. Its cytoplasm has mitochondria, Golgi bodies, lysosomes and many Nissl granules.", "গোলাকার, ডিম্বাকার বা তারকাকার অংশ; এতে প্লাজমামেমব্রেন, সাইটোপ্লাজম ও নিউক্লিয়াস থাকে। সাইটোপ্লাজমে থাকে মাইটোকন্ড্রিয়া, গলজিবস্তু, লাইসোজোম ও অসংখ্য নিসল দানা।")],
    ["nucleus", L2("Nucleus", "নিউক্লিয়াস"), L2("The control centre of the neuron, inside the cell body.", "কোষদেহের ভেতরে থাকা নিউরনের নিয়ন্ত্রণকেন্দ্র।")],
    ["axon", L2("Axon", "অ্যাক্সন"), L2("The single long fibre that leaves the cell body. It carries the impulse away from the cell body. The membrane around its axis is the axolemma.", "কোষদেহ থেকে বের হওয়া একটিমাত্র লম্বা তন্তু। এটি তাড়নাকে কোষদেহ থেকে দূরে বয়ে নেয়। এর মূল অক্ষের আবরণী হলো অ্যাক্সলেমা।")],
    ["myelin", L2("Myelin", "মায়েলিন"), L2("A layer of fatty material between the neurilemma and the axon. It works like the plastic coating of a wire and lets the impulse travel fast.", "নিউরিলেমা ও অ্যাক্সনের মাঝের স্নেহ পদার্থের স্তর। এটি তারের প্লাস্টিকের আবরণের মতো কাজ করে, আর তাড়নাকে দ্রুত চলতে দেয়।")],
    ["neurilemma", L2("Neurilemma", "নিউরিলেমা"), L2("The thin outer covering of the axon, outside the myelin.", "অ্যাক্সনের বাইরের পাতলা আবরণ; এটি থাকে মায়েলিনের বাইরে।")],
    ["node", L2("Node of Ranvier", "র‍্যানভিয়ারের পর্ব"), L2("A gap in the myelin. Only here does the neurilemma touch the axon directly. The impulse jumps from one node to the next.", "মায়েলিনের ফাঁক। শুধু এখানেই নিউরিলেমা সরাসরি অ্যাক্সনকে ছোঁয়। তাড়না এক পর্ব থেকে পরের পর্বে লাফিয়ে যায়।")],
    ["terminal", L2("Axon terminal", "অ্যাক্সন টারমিনাল"), L2("The branches at the far end of the axon. They pass the impulse on to the dendrites of the next neuron (or to a muscle or gland).", "অ্যাক্সনের শেষ মাথার শাখা। এরা তাড়নাকে পরের নিউরনের ডেনড্রাইটে (অথবা পেশি বা গ্রন্থিতে) পৌঁছে দেয়।")],
    ["synapse", L2("Synapse", "সিন্যাপস"), L2("The fine gap between an axon terminal and the next dendrite. The terminal releases a chemical, neurohumor, which crosses the gap and starts a new impulse. It works in one direction only.", "অ্যাক্সন টারমিনাল ও পরের ডেনড্রাইটের মাঝের সূক্ষ্ম ফাঁক। টারমিনাল থেকে নিউরোহিউমার নামের রাসায়নিক পদার্থ বেরিয়ে ফাঁক পার হয় এবং নতুন তাড়না শুরু করে। এটি কাজ করে কেবল একদিকে।")]];
  const SEG = [[[22, 50], [58, 92], 0.7, 0, 0], [[58, 92], [90, 92], 0.4, 1, 0], [[90, 92], [140, 92], 0.32, 2, 1], [[140, 92], [188, 92], 0.32, 2, 1], [[188, 92], [236, 92], 0.32, 2, 1], [[236, 92], [286, 92], 0.32, 2, 1], [[286, 92], [318, 116], 0.45, 3, 0], [[318, 116], [318, 116], 1.5, 4, 0], [[318, 138], [312, 186], 0.55, 5, 0], [[312, 186], [216, 186], 0.9, 5, 0]];
  const STG = [
    L2("1. A dendrite receives the impulse and brings it to the cell body.", "১. ডেনড্রাইট তাড়না গ্রহণ করে কোষদেহে আনে।"),
    L2("2. The impulse leaves the cell body along the axon.", "২. তাড়না কোষদেহ ছেড়ে অ্যাক্সন বেয়ে চলে।"),
    L2("3. In the myelinated axon it jumps from node to node.", "৩. মায়েলিনযুক্ত অ্যাক্সনে তাড়না এক পর্ব থেকে আরেক পর্বে লাফায়।"),
    L2("4. It reaches the axon terminals.", "৪. তাড়না অ্যাক্সন টারমিনালে পৌঁছায়।"),
    L2("5. Synapse: neurohumor crosses the gap and starts a new impulse. One way only.", "৫. সিন্যাপস: নিউরোহিউমার ফাঁক পার হয়ে নতুন তাড়না শুরু করে। কেবল একদিকে।"),
    L2("6. The next neuron carries the impulse onwards.", "৬. পরের নিউরন তাড়নাটি সামনে বয়ে নেয়।")];
  const TOT = SEG.reduce((a, s) => a + s[2], 0);
  let sel = 0, t = -1, rs = -1, shown = -2;
  el.innerHTML = `<div class="svgwrap fit" id="b10ns"></div>
    <div class="w-row" style="margin:8px 0"><button class="btn solid" id="b10ng">${L2("Send an impulse", "একটি তাড়না পাঠাও")}</button><span class="hint" id="b10nt"></span></div>
    <div class="w-out" id="b10no"></div><div class="chipset b10np" role="group" style="margin-top:8px">${PARTS.map((p, i) => `<button data-i="${i}" aria-pressed="false">${p[1]}</button>`).join("")}</div>`;
  const NH = [[70, 250], [78, 262], [70, 274], [80, 240], [80, 282]];
  const draw = () => {
    const k = PARTS[sel][0], on = q => q === k, st = (q, c, w) => on(q) ? `stroke="var(--bad)" stroke-width="${w + 1.5}"` : `stroke="${c}" stroke-width="${w}"`;
    const lab = (q, x, y, tx, a = "start") => `<text data-k="${q}" x="${x}" y="${y}" font-size="12.5" text-anchor="${a}" fill="${on(q) ? "var(--bad)" : "var(--ink)"}" font-weight="${on(q) ? 700 : 400}" paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" style="cursor:pointer">${tx}</text>`;
    let s = `<svg viewBox="0 0 360 340" role="img" aria-label="${L2("A neuron and a synapse", "একটি নিউরন ও সিন্যাপস")}">${arrowDefs("b10na", "var(--bad)")}`;
    const DEN = [[58, 92, 22, 50], [22, 50, 10, 60], [22, 50, 30, 34], [58, 92, 14, 92], [14, 92, 4, 82], [14, 92, 6, 104], [58, 92, 26, 132], [26, 132, 12, 128], [26, 132, 32, 146], [58, 92, 52, 54], [52, 54, 44, 42], [52, 54, 62, 44]];
    s += `<g data-k="dendrite" style="cursor:pointer">${DEN.map(([a, c, d, e]) => `<line x1="${a}" y1="${c}" x2="${d}" y2="${e}" ${st("dendrite", "var(--c)", 3)} stroke-linecap="round"/>`).join("")}</g>`;
    s += `<g data-k="axon" style="cursor:pointer"><line x1="78" y1="92" x2="290" y2="92" ${st("axon", "var(--c)", 5)}/></g>`;
    s += `<g data-k="terminal" style="cursor:pointer">${[[302, 122], [318, 116], [334, 110]].map(([x, y]) => `<line x1="290" y1="92" x2="${x}" y2="${y}" ${st("terminal", "var(--c)", 3)} stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="4.5" fill="var(--c)" ${on("terminal") ? `stroke="var(--bad)" stroke-width="2.5"` : ""}/>`).join("")}</g>`;
    s += [96, 144, 192, 240].map(x => `<g data-k="myelin" style="cursor:pointer"><rect x="${x}" y="82" width="40" height="20" rx="9" fill="${on("myelin") ? "var(--bad)" : MY10}" ${on("neurilemma") ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.3"`}/></g>`).join("");
    s += [140, 188, 236].map(x => `<g data-k="node" style="cursor:pointer"><rect x="${x - 7}" y="80" width="14" height="24" fill="transparent"/>${on("node") ? `<circle cx="${x}" cy="92" r="9" fill="none" stroke="var(--bad)" stroke-width="2.5"/>` : ""}</g>`).join("");
    s += `<g data-k="body" style="cursor:pointer"><circle cx="58" cy="92" r="23" fill="var(--c-soft)" ${st("body", "var(--c)", 2.5)}/></g><g data-k="nucleus" style="cursor:pointer"><circle cx="58" cy="92" r="9" fill="var(--c)" opacity=".85" ${on("nucleus") ? `stroke="var(--bad)" stroke-width="3"` : ""}/></g>`;
    /* neuron 2 */
    s += `<g opacity=".8">${[[312, 186, 302, 144], [312, 186, 318, 138], [312, 186, 334, 132], [312, 186, 344, 200], [312, 186, 330, 216]].map(([a, c, d, e]) => `<line x1="${a}" y1="${c}" x2="${d}" y2="${e}" stroke="var(--note)" stroke-width="3" stroke-linecap="round"/>`).join("")}<line x1="292" y1="186" x2="214" y2="186" stroke="var(--note)" stroke-width="5" stroke-dasharray="60 6 6 6 6 6"/><rect x="236" y="176" width="40" height="20" rx="9" fill="${MY10}" stroke="var(--ink)" stroke-width="1.3"/><circle cx="312" cy="186" r="20" fill="var(--note-soft)" stroke="var(--note)" stroke-width="2.5"/><circle cx="312" cy="186" r="8" fill="var(--note)" opacity=".85"/></g>`;
    s += T10(312, 240, L2("next neuron", "পরের নিউরন"), "middle", 12, "var(--muted)");
    s += `<g data-k="synapse" style="cursor:pointer"><circle cx="318" cy="127" r="24" fill="transparent" stroke="${on("synapse") ? "var(--bad)" : "var(--muted)"}" stroke-width="${on("synapse") ? 2.5 : 1.2}" stroke-dasharray="4 3"/></g>`;
    /* labels */
    s += LD10(30, 24, 26, 40) + lab("dendrite", 4, 20, L2("dendrite", "ডেনড্রাইট"));
    s += LD10(100, 38, 62, 86) + lab("nucleus", 96, 34, L2("nucleus", "নিউক্লিয়াস"));
    s += LD10(40, 158, 50, 113) + lab("body", 6, 172, L2("cell body", "কোষদেহ"));
    s += LD10(100, 116, 88, 96) + lab("axon", 94, 130, L2("axon", "অ্যাক্সন"));
    s += LD10(164, 66, 164, 82) + lab("myelin", 164, 62, L2("myelin", "মায়েলিন"), "middle");
    s += LD10(236, 44, 256, 81) + lab("neurilemma", 232, 40, L2("neurilemma", "নিউরিলেমা"), "middle");
    s += LD10(188, 116, 188, 104) + lab("node", 190, 130, L2("node of Ranvier", "র‍্যানভিয়ারের পর্ব"), "middle");
    s += LD10(326, 76, 332, 104) + lab("terminal", 356, 72, L2("axon terminal", "অ্যাক্সন টারমিনাল"), "end");
    s += LD10(262, 154, 296, 136) + lab("synapse", 260, 160, L2("synapse", "সিন্যাপস"), "end");
    /* enlarged synapse */
    s += `<line x1="200" y1="204" x2="298" y2="142" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"/>`;
    s += `<g data-k="synapse" style="cursor:pointer"><rect x="6" y="204" width="196" height="132" rx="12" fill="var(--paper)" stroke="${on("synapse") ? "var(--bad)" : "var(--muted)"}" stroke-width="${on("synapse") ? 2.5 : 1.2}" stroke-dasharray="${on("synapse") ? "" : "5 4"}"/></g>`;
    s += T10(104, 221, L2("synapse (enlarged)", "সিন্যাপস (বড় করে)"), "middle", 12.5, "var(--ink)", "700");
    s += `<path d="M10 250 H58 Q64 234 80 234 Q94 234 94 262 Q94 290 80 290 Q64 290 58 274 H10 Z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2.5" pointer-events="none"/>`;
    s += `<path d="M198 248 H140 Q128 234 116 236 Q110 262 116 288 Q128 290 140 276 H198 Z" fill="var(--note-soft)" stroke="var(--note)" stroke-width="2.5" pointer-events="none"/>`;
    s += NH.map(([x, y], i) => `<circle id="b10nh${i}" cx="${x}" cy="${y}" r="3.6" fill="${AUX10}" pointer-events="none"/>`).join("");
    s += `<line x1="92" y1="262" x2="113" y2="262" stroke="var(--bad)" stroke-width="2" marker-end="url(#b10na)" pointer-events="none" opacity=".0" id="b10nw"/>`;
    s += T10(50, 308, L2("axon terminal", "অ্যাক্সন টারমিনাল"), "middle", 12.5) + T10(160, 308, L2("dendrite", "ডেনড্রাইট"), "middle", 12.5);
    s += `<circle cx="64" cy="322" r="3.6" fill="${AUX10}"/>` + T10(72, 326, L2("= neurohumor", "= নিউরোহিউমার"), "start", 12.5);
    s += `<circle id="b10nd" cx="22" cy="50" r="7" fill="var(--bad)" stroke="var(--sheet)" stroke-width="2.5" pointer-events="none" opacity="0"/>`;
    $("#b10ns", el).innerHTML = s + `</svg>`;
    $("#b10no", el).innerHTML = `<b>${PARTS[sel][1]}</b><br>${PARTS[sel][2]}`;
    el.querySelectorAll(".b10np button").forEach((q, i) => q.setAttribute("aria-pressed", i === sel));
    el.querySelectorAll("#b10ns [data-k]").forEach(g => g.addEventListener("click", () => { sel = PARTS.findIndex(p => p[0] === g.dataset.k); draw(); place(); }));
  };
  const setNH = k => NH.forEach(([x, y], i) => { const c = $("#b10nh" + i, el); if (c) { c.setAttribute("cx", F10(x + (118 - x + (i % 2) * 6) * k)); c.setAttribute("cy", F10(y + (262 - y) * 0.5 * k)); } });
  const stage = i => { if (i === shown) return; shown = i; $("#b10nt", el).textContent = i < 0 ? (i === -1 ? "" : L2("The message has been passed on. Press again to repeat.", "বার্তাটি পরের কোষে পৌঁছে গেছে। আবার দেখতে বোতাম চাপো।")) : STG[i]; };
  const place = () => {
    const d = $("#b10nd", el); if (!d) return;
    if (REDUCED) {
      if (rs < 0) { d.setAttribute("opacity", 0); setNH(0); return; }
      const sg = SEG[rs]; d.setAttribute("opacity", 1); d.setAttribute("cx", sg[1][0]); d.setAttribute("cy", sg[1][1]); setNH(sg[3] === 4 ? 0.7 : 0); return;
    }
    if (t < 0) { d.setAttribute("opacity", 0); setNH(0); return; }
    let a = t, i = 0; while (i < SEG.length - 1 && a > SEG[i][2]) { a -= SEG[i][2]; i++; }
    const sg = SEG[i], k = Math.min(1, a / sg[2]), e = sg[4] ? k * k * (3 - 2 * k) : k;
    d.setAttribute("opacity", 1); d.setAttribute("cx", F10(sg[0][0] + (sg[1][0] - sg[0][0]) * e)); d.setAttribute("cy", F10(sg[0][1] + (sg[1][1] - sg[0][1]) * e - (sg[4] ? 16 * Math.sin(Math.PI * k) : 0)));
    setNH(sg[3] === 4 ? k : 0); stage(sg[3]);
  };
  $("#b10ng", el).addEventListener("click", () => {
    if (REDUCED) { const order = [0, 1, 5, 6, 7, 9]; const cur = order.indexOf(rs); rs = cur + 1 < order.length ? order[cur + 1] : -1; shown = -2; stage(rs < 0 ? -3 : SEG[rs][3]); place(); return; }
    t = 0; shown = -2; place();
  });
  el.querySelectorAll(".b10np button").forEach(q => q.addEventListener("click", () => { sel = +q.dataset.i; draw(); place(); }));
  draw();
  if (REDUCED) $("#b10ng", el).textContent = L2("Next step of the impulse", "তাড়নার পরের ধাপ");
  else animate(el, dt => { if (t < 0) return; t += dt; if (t >= TOT) { t = -1; stage(-3); } place(); });
};

/* 10.3.1 the brain in section (tap the parts) + the reflex arc step by step */
W.b10brain = (el) => {
  const FB = L2("Forebrain", "অগ্রমস্তিষ্ক"), MB = L2("Midbrain", "মধ্যমস্তিষ্ক"), HB = L2("Hindbrain", "পশ্চাৎমস্তিষ্ক");
  const PARTS = [
    ["cerebrum", L2("Cerebrum", "সেরিব্রাম"), FB, L2("The largest part. Two hemispheres: the left one controls the right side of the body and the right one the left side. Centre of thought, consciousness, knowledge, memory, will, speech, sensation and voluntary muscles. Grey matter (cortex) outside, white matter inside.", "সবচেয়ে বড় অংশ। দুটি হেমিস্ফিয়ার: বামটি দেহের ডান পাশ, ডানটি বাম পাশ নিয়ন্ত্রণ করে। চিন্তা, চেতনা, জ্ঞান, স্মৃতি, ইচ্ছা, বাকশক্তি, অনুভূতি ও ঐচ্ছিক পেশির কেন্দ্র। বাইরে ধূসর পদার্থ (কর্টেক্স), ভেতরে শ্বেত পদার্থ।")],
    ["callosum", L2("Corpus callosum", "কর্পাস ক্যালোসাম"), FB, L2("A bundle of nerve fibres that joins the right and left cerebral hemispheres, so the two halves can work together.", "একগুচ্ছ স্নায়ুতন্তু, যা ডান ও বাম সেরিব্রাল হেমিস্ফিয়ারকে যুক্ত করে; ফলে দুই অর্ধেক মিলেমিশে কাজ করতে পারে।")],
    ["thalamus", L2("Thalamus", "থ্যালামাস"), FB, L2("A part deep inside the forebrain, shown in the figure in your book.", "অগ্রমস্তিষ্কের গভীরের একটি অংশ; তোমার বইয়ের চিত্রে দেখানো আছে।")],
    ["hypo", L2("Hypothalamus", "হাইপোথ্যালামাস"), FB, L2("A small part below the thalamus. It controls the pituitary gland, and so links the nervous system with the hormones.", "থ্যালামাসের নিচের ছোট অংশ। এটি পিটুইটারি গ্রন্থিকে নিয়ন্ত্রণ করে, ফলে স্নায়ুতন্ত্র ও হরমোনের মধ্যে সংযোগ ঘটায়।")],
    ["mid", L2("Midbrain", "মধ্যমস্তিষ্ক"), MB, L2("Above the hindbrain; it connects the forebrain and the hindbrain. It helps to co-ordinate muscles and keep balance, and has an important part in seeing and hearing.", "পশ্চাৎমস্তিষ্কের ওপরে; অগ্র ও পশ্চাৎমস্তিষ্ককে যুক্ত করে। পেশির কাজের সমন্বয় ও ভারসাম্য রক্ষায় সাহায্য করে; দর্শন ও শ্রবণে এর গুরুত্বপূর্ণ ভূমিকা আছে।")],
    ["pons", L2("Pons", "পনস"), HB, L2("Between the midbrain and the medulla. Tube-shaped, made of a bundle of nerves; it connects the cerebellum with the medulla oblongata.", "মধ্যমস্তিষ্ক ও মেডুলার মাঝখানে। নলাকার, একগুচ্ছ স্নায়ু দিয়ে তৈরি; সেরিবেলাম ও মেডুলা অবলংগাটাকে যুক্ত করে।")],
    ["medulla", L2("Medulla oblongata", "মেডুলা অবলংগাটা"), HB, L2("The rearmost part of the brain; it joins the spinal cord. Its nerves control some of the work of the heart, lungs and pharynx and the swallowing of food.", "মস্তিষ্কের সবচেয়ে পেছনের অংশ; সুষুম্নাকাণ্ডের সাথে যুক্ত। এর স্নায়ু হৃৎপিণ্ড, ফুসফুস, গলবিল ও খাদ্য গলাধঃকরণের কিছু কাজ নিয়ন্ত্রণ করে।")],
    ["cerebellum", L2("Cerebellum", "সেরিবেলাম"), HB, L2("Behind the pons. It controls muscle tone, co-ordinates movement and keeps the body balanced, for example in running and jumping.", "পনসের পেছনে। এটি পেশির টান নিয়ন্ত্রণ করে, চলনে সমন্বয় আনে এবং দেহের ভারসাম্য রক্ষা করে, যেমন দৌড়ানো ও লাফানোর সময়।")],
    ["cord", L2("Spinal cord", "সুষুম্নাকাণ্ড"), L2("Central nervous system", "কেন্দ্রীয় স্নায়ুতন্ত্র"), L2("Runs from the foramen magnum to the lumbar vertebrae, inside the backbone. White matter outside, grey matter inside. 31 pairs of spinal nerves leave it. It controls reflex actions.", "ফোরামেন ম্যাগনাম থেকে কটিদেশের কশেরুকা পর্যন্ত, মেরুদণ্ডের ভেতরে। বাইরে শ্বেত পদার্থ, ভেতরে ধূসর পদার্থ। এখান থেকে ৩১ জোড়া সুষুম্না স্নায়ু বের হয়। এটি প্রতিবর্তী ক্রিয়া নিয়ন্ত্রণ করে।")]];
  const STEPS = [
    [L2("Receptor", "গ্রাহক অঙ্গ"), L2("The needle pricks the finger. The endings of the sensory neuron in the skin receive the stimulus of pain. The skin is the receptor.", "আঙুলে সুচ ফুটল। ত্বকে থাকা সংবেদী নিউরনের প্রান্ত ব্যথার উদ্দীপনা গ্রহণ করে। ত্বক এখানে গ্রাহক অঙ্গ।")],
    [L2("Sensory neuron", "সংবেদী নিউরন"), L2("The axon of the sensory (afferent) neuron carries the impulse to the grey matter of the spinal cord.", "সংবেদী (অনুভূতিবাহী) নিউরনের অ্যাক্সন তাড়নাটি সুষুম্নাকাণ্ডের ধূসর অংশে পৌঁছে দেয়।")],
    [L2("Relay neuron", "রিলে নিউরন"), L2("Inside the grey matter the impulse crosses a synapse to a relay (intermediate) neuron, which passes it to the motor neuron.", "ধূসর অংশের ভেতরে তাড়না সিন্যাপস পার হয়ে মধ্যবর্তী (রিলে) নিউরনে যায়, আর সেটি তা আজ্ঞাবাহী নিউরনে পৌঁছে দেয়।")],
    [L2("Motor neuron", "আজ্ঞাবাহী নিউরন"), L2("The axon of the motor (efferent) neuron carries the impulse out of the spinal cord to the muscle of the arm.", "আজ্ঞাবাহী (মোটর) নিউরনের অ্যাক্সন তাড়নাটি সুষুম্নাকাণ্ড থেকে হাতের পেশিতে নিয়ে যায়।")],
    [L2("Effector", "সাড়া অঙ্গ"), L2("The muscle contracts and the hand is pulled away from the needle. A message also goes up to the brain, so the pain is felt a moment later.", "পেশি সংকুচিত হয়, আর হাত সুচ থেকে সরে যায়। একটি খবর মস্তিষ্কেও যায়, তাই ব্যথা টের পাওয়া যায় এক মুহূর্ত পরে।")]];
  let view = "brain", sel = 0, step = 0, u = 0;
  el.innerHTML = `<div class="chipset b10bv" role="group"><button data-v="brain" aria-pressed="true">${B10(1)}. ${L2("Parts of the brain", "মস্তিষ্কের অংশ")}</button><button data-v="reflex" aria-pressed="false">${B10(2)}. ${L2("Reflex arc", "প্রতিবর্ত চক্র")}</button></div><div id="b10bb" style="margin-top:8px"></div>`;
  const drawBrain = () => {
    const k = PARTS[sel][0], on = q => q === k, hl = q => on(q) ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.3"`;
    const lab = (q, x, y, tx, a = "start", w = "") => `<text data-k="${q}" x="${x}" y="${y}" font-size="13" text-anchor="${a}" fill="${on(q) ? "var(--bad)" : "var(--ink)"}" font-weight="${on(q) || w ? 700 : 400}" paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" style="cursor:pointer">${tx}</text>`;
    let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("Section through the human brain", "মানুষের মস্তিষ্কের লম্বচ্ছেদ")}">`;
    s += `<path d="M34 160 C16 84 74 12 172 10 C266 6 348 60 344 136 C342 190 320 230 292 248" fill="none" stroke="var(--muted)" stroke-width="3" stroke-linecap="round" opacity=".6"/>` + T10(350, 20, L2("skull", "করোটিকা"), "end", 12, "var(--muted)");
    s += `<g data-k="cerebrum" style="cursor:pointer"><path d="M50 150 C38 96 84 36 170 30 C250 24 320 62 326 128 C330 160 304 178 276 176 C258 176 246 168 232 172 C214 184 172 186 150 184 C118 192 66 190 50 150 Z" fill="var(--c-soft)" ${hl("cerebrum")}/><path d="M78 112 q20 -30 46 -22 M112 66 q30 -12 52 10 M196 54 q34 -6 52 22 M262 96 q30 6 40 36 M72 152 q24 12 42 -6 M250 148 q20 12 44 2" fill="none" stroke="var(--c)" stroke-width="1.6" opacity=".7"/></g>`;
    s += `<g data-k="callosum" style="cursor:pointer"><path d="M122 138 C132 104 222 100 246 134" fill="none" stroke="${on("callosum") ? "var(--bad)" : "#c9b27a"}" stroke-width="11" stroke-linecap="round"/></g>`;
    s += `<g data-k="cerebellum" style="cursor:pointer"><ellipse cx="264" cy="210" rx="44" ry="30" fill="#8fc49a" ${hl("cerebellum")}/><path d="M228 204 q36 -14 72 0 M226 216 q38 -12 76 0 M234 228 q30 -8 60 0" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".5"/></g>`;
    s += `<g data-k="thalamus" style="cursor:pointer"><ellipse cx="192" cy="148" rx="22" ry="12" fill="#c9a37a" ${hl("thalamus")}/></g>`;
    s += `<g data-k="hypo" style="cursor:pointer"><ellipse cx="166" cy="172" rx="13" ry="8" fill="#e09a6a" ${hl("hypo")}/></g>`;
    s += `<g data-k="mid" style="cursor:pointer"><path d="M184 164 L214 164 L218 196 L190 198 Z" fill="#a99ad8" ${hl("mid")}/></g>`;
    s += `<g data-k="medulla" style="cursor:pointer"><path d="M186 226 L214 226 L208 258 L194 258 Z" fill="#e08a84" ${hl("medulla")}/></g>`;
    s += `<g data-k="pons" style="cursor:pointer"><ellipse cx="194" cy="213" rx="21" ry="16" fill="#e6b25a" ${hl("pons")}/></g>`;
    s += `<g data-k="cord" style="cursor:pointer"><rect x="194" y="258" width="14" height="42" fill="#bfc4c9" ${hl("cord")}/></g>`;
    s += lab("cerebrum", 178, 70, L2("cerebrum", "সেরিব্রাম"), "middle", "700") + lab("callosum", 184, 97, L2("corpus callosum", "কর্পাস ক্যালোসাম"), "middle");
    const LL = [["thalamus", 206, L2("thalamus", "থ্যালামাস"), 172, 148], ["hypo", 222, L2("hypothalamus", "হাইপোথ্যালামাস"), 154, 174], ["mid", 238, L2("midbrain", "মধ্যমস্তিষ্ক"), 186, 186], ["pons", 254, L2("pons", "পনস"), 174, 214], ["medulla", 270, L2("medulla oblongata", "মেডুলা অবলংগাটা"), 189, 242], ["cord", 286, L2("spinal cord", "সুষুম্নাকাণ্ড"), 193, 280]];
    LL.forEach(([q, y, tx, x2, y2]) => { s += LD10(Math.min(120, 8 + tx.length * 7), y - 4, 124, y - 4) + LD10(124, y - 4, x2, y2) + lab(q, 4, y, tx); });
    s += LD10(306, 262, 280, 236) + lab("cerebellum", 356, 278, L2("cerebellum", "সেরিবেলাম"), "end");
    s += T10(20, 20, L2("← front", "← সামনে"), "start", 12, "var(--muted)");
    $("#b10bs", el).innerHTML = s + `</svg>`;
    $("#b10bo", el).innerHTML = `<b>${PARTS[sel][1]}</b> <span class="muted">· ${PARTS[sel][2]}</span><br>${PARTS[sel][3]}`;
    el.querySelectorAll(".b10bp button").forEach((q, i) => q.setAttribute("aria-pressed", i === sel));
    el.querySelectorAll("#b10bs [data-k]").forEach(g => g.addEventListener("click", () => { sel = PARTS.findIndex(p => p[0] === g.dataset.k); drawBrain(); }));
  };
  /* reflex arc paths as polylines */
  const bez = (p, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, m = 1 - t; return [m * m * m * p[0] + 3 * m * m * t * p[2] + 3 * m * t * t * p[4] + t * t * t * p[6], m * m * m * p[1] + 3 * m * m * t * p[3] + 3 * m * t * t * p[5] + t * t * t * p[7]]; });
  const SEN = bez([62, 204, 60, 110, 140, 56, 240, 74]), MOT = bez([240, 120, 186, 130, 150, 172, 152, 236]), REL = [[240, 78], [250, 98], [240, 116]];
  const along = (pts, q) => { const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; } let d = Math.max(0, Math.min(1, q)) * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = seg[i] ? d / seg[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } d -= seg[i]; } return pts[pts.length - 1]; };
  const poly = pts => pts.map((p, i) => (i ? "L" : "M") + F10(p[0]) + " " + F10(p[1])).join(" ");
  const dotAt = () => step === 0 ? [62, 204] : step === 1 ? along(SEN, REDUCED ? 0.6 : u) : step === 2 ? along(REL, REDUCED ? 0.5 : u) : step === 3 ? along(MOT, REDUCED ? 0.6 : u) : [152, 242];
  const drawReflex = () => {
    const on = i => step === i, w = i => on(i) ? 4.5 : 2.5, op = i => on(i) || step === 4 && i === 3 ? 1 : 0.55;
    let s = `<svg viewBox="0 0 360 290" role="img" aria-label="${L2("Reflex arc of a needle prick", "সুচ ফোটার প্রতিবর্ত চক্র")}">`;
    s += `<ellipse cx="262" cy="96" rx="64" ry="54" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<g transform="translate(-12 8)"><path d="M252 54 Q262 76 274 78 Q286 76 296 54 Q308 62 300 86 Q296 100 304 122 Q292 128 284 106 Q274 98 264 106 Q256 128 244 122 Q252 100 248 86 Q240 62 252 54 Z" fill="#a9adb3" stroke="var(--ink)" stroke-width="1"/><circle cx="274" cy="91" r="2.5" fill="var(--sheet)"/></g>`;
    s += T10(262, 18, L2("spinal cord (cross-section)", "সুষুম্নাকাণ্ড (প্রস্থচ্ছেদ)"), "middle", 12.5, "var(--ink)", "700");
    s += `<rect x="246" y="178" width="13" height="10" rx="2" fill="#a9adb3" stroke="var(--ink)" stroke-width="1"/>` + T10(265, 188, L2("grey matter", "ধূসর পদার্থ"), "start", 12.5);
    s += `<rect x="246" y="194" width="13" height="10" rx="2" fill="var(--paper)" stroke="var(--ink)" stroke-width="1"/>` + T10(265, 204, L2("white matter", "শ্বেত পদার্থ"), "start", 12.5);
    /* hand with needle */
    const lift = step === 4 ? -16 : 0;
    s += `<g transform="translate(0 ${lift})"><path d="M4 236 Q4 214 26 212 L52 206 Q66 204 66 212 Q66 220 54 222 L40 226 L40 262 L4 262 Z" fill="#e7b89a" stroke="var(--ink)" stroke-width="1.3"/></g>`;
    s += `<line x1="92" y1="178" x2="66" y2="204" stroke="var(--ink)" stroke-width="2"/><circle cx="94" cy="176" r="3" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    if (step === 0) s += `<path d="M70 196 l8 -4 M72 206 l10 0 M70 214 l8 4" stroke="var(--bad)" stroke-width="2" stroke-linecap="round"/>`;
    /* muscle */
    s += `<path d="M104 252 Q152 ${step === 4 ? 222 : 232} 200 252 Q152 ${step === 4 ? 282 : 272} 104 252 Z" fill="${MUS10}" stroke="${on(4) ? "var(--bad)" : "var(--ink)"}" stroke-width="${on(4) ? 3 : 1.3}"/><path d="M92 252 h12 M200 252 h12" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="${poly(SEN)}" fill="none" stroke="${BLU10}" stroke-width="${w(1)}" opacity="${op(1)}"/><circle cx="${F10(SEN[11][0])}" cy="${F10(SEN[11][1])}" r="6" fill="${BLU10}" opacity="${op(1)}"/>`;
    s += `<path d="${poly(REL)}" fill="none" stroke="var(--note)" stroke-width="${w(2)}" opacity="${on(2) ? 1 : 0.7}"/><circle cx="250" cy="98" r="4.5" fill="var(--note)"/>`;
    s += `<path d="${poly(MOT)}" fill="none" stroke="var(--bad)" stroke-width="${w(3)}" opacity="${op(3)}"/><circle cx="240" cy="120" r="6" fill="var(--bad)" opacity="${op(3)}"/>`;
    s += `<circle cx="62" cy="${204 + lift}" r="${on(0) ? 7 : 4.5}" fill="${BLU10}" stroke="var(--sheet)" stroke-width="1.5"/>`;
    const tl = (i, x, y, tx, a = "start", c = "var(--ink)") => `<text x="${x}" y="${y}" font-size="12.5" text-anchor="${a}" fill="${on(i) ? "var(--bad)" : c}" font-weight="${on(i) ? 700 : 400}" paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round">${tx}</text>`;
    s += tl(0, 4, 284, L2("skin of finger (receptor)", "আঙুলের ত্বক (গ্রাহক অঙ্গ)"));
    s += tl(1, 74, 92, L2("sensory neuron", "সংবেদী নিউরন"), "start", BLU10);
    s += tl(2, 262, 168, L2("relay neuron", "রিলে নিউরন"), "start", "var(--note)") + LD10(268, 156, 252, 104);
    s += tl(3, 172, 226, L2("motor neuron", "আজ্ঞাবাহী নিউরন"), "start", "var(--bad)");
    s += tl(4, 356, 258, L2("arm muscle (effector)", "হাতের পেশি (সাড়া অঙ্গ)"), "end");
    const [dx, dy] = dotAt();
    s += `<circle id="b10rd" cx="${F10(dx)}" cy="${F10(dy)}" r="6.5" fill="${SUN10}" stroke="var(--ink)" stroke-width="1.5"/>`;
    $("#b10rs", el).innerHTML = s + `</svg>`;
    $("#b10ri", el).textContent = L2(`Step ${step + 1} of 5`, `ধাপ ${B10(step + 1)} / ${B10(5)}`);
    $("#b10ro", el).innerHTML = `<b>${B10(step + 1)}. ${STEPS[step][0]}</b><br>${STEPS[step][1]}`;
  };
  const setView = () => {
    const box = $("#b10bb", el);
    if (view === "brain") {
      box.innerHTML = `<div class="svgwrap fit" id="b10bs"></div><div class="w-out" id="b10bo" style="margin-top:8px"></div><div class="chipset b10bp" role="group" style="margin-top:8px">${PARTS.map((p, i) => `<button data-i="${i}" aria-pressed="false">${p[1]}</button>`).join("")}</div>`;
      el.querySelectorAll(".b10bp button").forEach(q => q.addEventListener("click", () => { sel = +q.dataset.i; drawBrain(); }));
      drawBrain();
    } else {
      box.innerHTML = `<div class="svgwrap fit" id="b10rs"></div><div class="w-row" style="margin:8px 0"><button class="btn" id="b10rp">${L2("‹ Back", "‹ আগের")}</button><button class="btn solid" id="b10rn">${L2("Next ›", "পরের ›")}</button><span class="muted" id="b10ri"></span></div><div class="w-out" id="b10ro"></div>`;
      $("#b10rp", el).addEventListener("click", () => { step = (step + 4) % 5; u = 0; drawReflex(); });
      $("#b10rn", el).addEventListener("click", () => { step = (step + 1) % 5; u = 0; drawReflex(); });
      drawReflex();
    }
  };
  chips10(el, ".b10bv", q => { view = q.dataset.v; setView(); });
  setView();
  if (!REDUCED) animate(el, dt => {
    if (view !== "reflex" || step === 0 || step === 4) return;
    const d = $("#b10rd", el); if (!d) return;
    u += dt * (step === 2 ? 1.1 : 0.55); if (u > 1.25) u = 0;
    const [x, y] = dotAt(); d.setAttribute("cx", F10(x)); d.setAttribute("cy", F10(y));
  });
};

/* 10.3.2 the divisions of the nervous system as a tree + the two autonomic states */
W.b10tree = (el) => {
  const N = [
    ["ns", 0, L2("Nervous system", "স্নায়ুতন্ত্র"), L2("Co-ordinates the organs and systems of the body, carries impulses everywhere and keeps the body in touch with its surroundings.", "দেহের অঙ্গ ও তন্ত্রগুলোর মধ্যে সমন্বয় করে, সব জায়গায় তাড়না বহন করে এবং পরিবেশের সাথে দেহের সম্পর্ক রক্ষা করে।")],
    ["cns", 1, L2("Central nervous system", "কেন্দ্রীয় স্নায়ুতন্ত্র"), L2("The brain and the spinal cord. It receives impulses, decides and sends orders.", "মস্তিষ্ক ও সুষুম্নাকাণ্ড। এটি তাড়না গ্রহণ করে, সিদ্ধান্ত নেয় ও নির্দেশ পাঠায়।")],
    ["brain", 2, L2("Brain", "মস্তিষ্ক"), L2("Inside the skull; the director of the nervous system. Forebrain, midbrain and hindbrain.", "করোটিকার ভেতরে; স্নায়ুতন্ত্রের পরিচালক। অগ্রমস্তিষ্ক, মধ্যমস্তিষ্ক ও পশ্চাৎমস্তিষ্ক।")],
    ["cord", 2, L2("Spinal cord", "সুষুম্নাকাণ্ড"), L2("Inside the backbone; links the brain with the body and controls reflex actions.", "মেরুদণ্ডের ভেতরে; মস্তিষ্ককে দেহের সাথে যুক্ত করে এবং প্রতিবর্তী ক্রিয়া নিয়ন্ত্রণ করে।")],
    ["pns", 1, L2("Peripheral nervous system", "প্রান্তীয় স্নায়ুতন্ত্র"), L2("All the nerves that leave the brain and spinal cord and branch through the whole body.", "মস্তিষ্ক ও সুষুম্নাকাণ্ড থেকে বের হয়ে সারা দেহে ছড়িয়ে পড়া সব স্নায়ু।")],
    ["cran", 2, L2("Cranial nerves: 12 pairs", "করোটিক স্নায়ু: ১২ জোড়া"), L2("Leave the brain. They serve the eyes, nose, ears, tongue, teeth, face, heart and stomach. Sensory, motor or mixed.", "মস্তিষ্ক থেকে বের হয়। চোখ, নাক, কান, জিহ্বা, দাঁত, মুখমণ্ডল, হৃৎপিণ্ড ও পাকস্থলীর কাজে জড়িত। সংবেদী, মোটর অথবা মিশ্র।")],
    ["spin", 2, L2("Spinal nerves: 31 pairs", "সুষুম্না স্নায়ু: ৩১ জোড়া"), L2("Leave the spinal cord. They move the limbs and carry sensations from the body to the brain. All are mixed nerves.", "সুষুম্নাকাণ্ড থেকে বের হয়। অঙ্গ-প্রত্যঙ্গ চালায় এবং দেহের অনুভূতি মস্তিষ্কে নিয়ে যায়। সবগুলো মিশ্র স্নায়ু।")],
    ["auto", 2, L2("Autonomic nervous system", "স্বয়ংক্রিয় স্নায়ুতন্ত্র"), L2("Runs the organs we cannot control by will: heart, stomach, intestine, pancreas.", "যেসব অঙ্গ আমরা ইচ্ছা করে নিয়ন্ত্রণ করতে পারি না, সেগুলো চালায়: হৃৎপিণ্ড, পাকস্থলী, অন্ত্র, অগ্ন্যাশয়।")],
    ["sym", 3, L2("Sympathetic nerves", "সিম্প্যাথেটিক স্নায়ু"), L2("Prepare the body for action: faster heart, wider pupils and air passages, slower digestion.", "দেহকে কাজের জন্য প্রস্তুত করে: হৃৎস্পন্দন দ্রুত, চোখের তারা ও বায়ুপথ প্রসারিত, পরিপাক ধীর।")],
    ["para", 3, L2("Parasympathetic nerves", "প্যারাসিম্প্যাথেটিক স্নায়ু"), L2("Take over during rest: slower heart, narrower pupils, more saliva and faster digestion.", "বিশ্রামের সময় দায়িত্ব নেয়: হৃৎস্পন্দন ধীর, চোখের তারা ছোট, লালা বেশি, পরিপাক দ্রুত।")]];
  let sel = 0, mode = "sym", ph = 0;
  el.innerHTML = `<div class="svgwrap fit" id="b10ts"></div><div class="w-out" id="b10to" style="margin-top:8px"></div>
    <div class="w-row" style="margin-top:12px"><span class="muted">${L2("Autonomic nerves at work:", "স্বয়ংক্রিয় স্নায়ুর কাজ:")}</span><div class="chipset b10tm" role="group"><button data-m="sym" aria-pressed="true">${L2("Excited", "উত্তেজিত")}</button><button data-m="para" aria-pressed="false">${L2("Resting", "বিশ্রামে")}</button></div></div>
    <div class="svgwrap fit" id="b10ta" style="margin-top:8px"></div><div class="hint" id="b10th"></div>`;
  const H = 33, Y0 = 6;
  const drawTree = () => {
    let s = `<svg viewBox="0 0 360 ${Y0 + N.length * H + 2}" role="img" aria-label="${L2("Divisions of the nervous system", "স্নায়ুতন্ত্রের বিভাগ")}">`;
    const xy = i => [8 + N[i][1] * 26, Y0 + i * H];
    N.forEach((n, i) => {
      if (!i) return; let p = i - 1; while (N[p][1] >= n[1]) p--;
      const [px, py] = xy(p), [x, y] = xy(i);
      s += `<path d="M${px + 12} ${py + 27} V${y + 13} H${x}" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`;
    });
    N.forEach((n, i) => {
      const [x, y] = xy(i), on = i === sel, w = Math.min(352 - x, 232);
      s += `<g data-i="${i}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${w}" height="27" rx="8" fill="${on ? "var(--c)" : n[1] < 2 ? "var(--c-soft)" : "var(--paper)"}" stroke="${on ? "var(--c)" : "var(--rule)"}" stroke-width="1.5"/><text x="${x + 10}" y="${y + 18.5}" font-size="13.5" fill="${on ? "var(--sheet)" : "var(--ink)"}" font-weight="${n[1] < 2 ? 700 : 400}">${n[2]}</text></g>`;
    });
    $("#b10ts", el).innerHTML = s + `</svg>`;
    $("#b10to", el).innerHTML = `<b>${N[sel][2]}</b><br>${N[sel][3]}`;
    el.querySelectorAll("#b10ts [data-i]").forEach(g => g.addEventListener("click", () => { sel = +g.dataset.i; drawTree(); }));
  };
  const drawAuto = () => {
    const ex = mode === "sym", hs = REDUCED ? 1 : 1 + 0.1 * Math.max(0, Math.sin(ph));
    let s = `<svg viewBox="0 0 360 122" role="img" aria-label="${L2("Heart, pupil and stomach under autonomic control", "স্বয়ংক্রিয় নিয়ন্ত্রণে হৃৎপিণ্ড, চোখের তারা ও পাকস্থলী")}">`;
    [0, 1, 2].forEach(i => { s += `<rect x="${4 + i * 120}" y="2" width="112" height="118" rx="10" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>`; });
    s += `<g id="b10hh" transform="translate(60 46) scale(${hs.toFixed(3)})"><path d="M0 16 C-28 -4 -16 -24 0 -10 C16 -24 28 -4 0 16 Z" fill="var(--bad)"/></g>`;
    s += T10(60, 86, L2("Heart", "হৃৎপিণ্ড"), "middle", 13, "var(--ink)", "700") + T10(60, 104, ex ? L2("beats faster", "দ্রুত চলে") : L2("beats slower", "ধীরে চলে"), "middle", 12.5);
    s += `<ellipse cx="180" cy="44" rx="32" ry="20" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="180" cy="44" r="17" fill="#8a5a2b"/><circle cx="180" cy="44" r="${ex ? 11 : 5}" fill="#111"/>`;
    s += T10(180, 86, L2("Pupil", "চোখের তারা"), "middle", 13, "var(--ink)", "700") + T10(180, 104, ex ? L2("widens", "বড় হয়") : L2("narrows", "ছোট হয়"), "middle", 12.5);
    s += `<path d="M288 16 C288 30 280 34 276 44 C270 60 284 72 302 68 C320 64 326 46 320 32 C318 26 310 24 306 28 C304 36 296 34 298 16 Z" fill="#e7b89a" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += (ex ? [[292, 56]] : [[288, 54], [300, 60], [310, 50], [296, 46]]).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${GLU10}"/>`).join("");
    s += T10(300, 86, L2("Stomach", "পাকস্থলী"), "middle", 13, "var(--ink)", "700") + T10(300, 104, ex ? L2("digests slowly", "পরিপাক ধীর") : L2("digests faster", "পরিপাক দ্রুত"), "middle", 12.5);
    $("#b10ta", el).innerHTML = s + `</svg>`;
    $("#b10th", el).textContent = ex ? L2("Fear or excitement: the sympathetic nerves take the lead.", "ভয় বা উত্তেজনা: সিম্প্যাথেটিক স্নায়ু এগিয়ে আসে।") : L2("Calm, after a meal: the parasympathetic nerves take over.", "শান্ত অবস্থা, খাওয়ার পর: প্যারাসিম্প্যাথেটিক স্নায়ু দায়িত্ব নেয়।");
  };
  chips10(el, ".b10tm", q => { mode = q.dataset.m; drawAuto(); });
  drawTree(); drawAuto();
  if (!REDUCED) animate(el, dt => {
    ph += dt * (mode === "sym" ? 13 : 6);
    const g = $("#b10hh", el); if (g) g.setAttribute("transform", `translate(60 46) scale(${(1 + 0.1 * Math.max(0, Math.sin(ph))).toFixed(3)})`);
  });
};

/* 10.4 the endocrine glands on a body outline: where, which hormone, what it does */
W.b10glands = (el) => {
  const G = [
    ["pit", L2("Pituitary", "পিটুইটারি"), L2("Under the brain, just below the hypothalamus.", "মস্তিষ্কের নিচের অংশে, হাইপোথ্যালামাসের ঠিক নিচে।"), L2("Growth (somatotropic) hormone, TSH, adrenocorticotropic and gonadotropic hormones, prolactin.", "বৃদ্ধির (সোমাটোট্রপিক) হরমোন, TSH, অ্যাডরেনোকর্টিকোট্রপিক ও গোনাডোট্রপিক হরমোন, প্রোল্যাকটিন।"), L2("Makes the body grow and controls several other glands. The chief endocrine gland.", "দেহের বৃদ্ধি ঘটায় এবং আরও কয়েকটি গ্রন্থিকে নিয়ন্ত্রণ করে। প্রধান নালিবিহীন গ্রন্থি।")],
    ["thy", L2("Thyroid", "থাইরয়েড"), L2("In the neck, on the upper part of the trachea.", "গলায়, ট্রাকিয়ার ওপরের অংশে।"), L2("Thyroxine; calcitonin.", "থাইরক্সিন; ক্যালসিটোনিন।"), L2("Thyroxine controls growth and metabolism (it needs iodine). Calcitonin takes part in calcium metabolism.", "থাইরক্সিন বৃদ্ধি ও বিপাক নিয়ন্ত্রণ করে (এটি তৈরিতে আয়োডিন লাগে)। ক্যালসিটোনিন ক্যালসিয়াম বিপাকের সাথে জড়িত।")],
    ["para", L2("Parathyroid", "প্যারাথাইরয়েড"), L2("Four tiny glands on the back of the thyroid.", "থাইরয়েডের পেছনে চারটি ছোট্ট গ্রন্থি।"), L2("Parathormone.", "প্যারাথরমোন।"), L2("Controls the metabolism of calcium and phosphorus.", "ক্যালসিয়াম ও ফসফরাসের বিপাক নিয়ন্ত্রণ করে।")],
    ["thm", L2("Thymus", "থাইমাস"), L2("In the upper chest, behind the breastbone (your book says the neck region).", "বুকের ওপরের অংশে, বক্ষাস্থির পেছনে (তোমার বইয়ে গ্রীবা অঞ্চল বলা হয়েছে)।"), L2("Thymosin.", "থাইমোসিন।"), L2("Helps immunity to develop. Large in a child, it shrinks with age.", "রোগ প্রতিরোধ ক্ষমতা বিকাশে সাহায্য করে। শিশুকালে বড় থাকে, বয়সের সাথে ছোট হয়ে যায়।")],
    ["adr", L2("Adrenal", "অ্যাডরেনাল"), L2("One on top of each kidney.", "প্রতিটি কিডনির ওপরে একটি করে।"), L2("Adrenaline (one of its hormones).", "অ্যাডরেনালিন (এর হরমোনগুলোর একটি)।"), L2("Helps the body to cope with severe mental and physical stress; controls essential metabolic activities.", "কঠিন মানসিক ও শারীরিক চাপ সামলাতে সাহায্য করে; অত্যাবশ্যকীয় বিপাকীয় কাজ নিয়ন্ত্রণ করে।")],
    ["isl", L2("Islets of Langerhans", "আইলেটস অফ ল্যাংগারহ্যানস"), L2("Small groups of cells inside the pancreas.", "অগ্ন্যাশয়ের ভেতরের ছোট ছোট কোষগুচ্ছ।"), L2("Insulin; glucagon.", "ইনসুলিন; গ্লুকাগন।"), L2("Control the glucose level of the blood: insulin lowers it, glucagon raises it.", "রক্তের গ্লুকোজের মাত্রা নিয়ন্ত্রণ করে: ইনসুলিন কমায়, গ্লুকাগন বাড়ায়।")],
    ["gon", L2("Gonads", "গোনাড"), L2("The ovaries in a female, the testes in a male (both are drawn here on one outline).", "মেয়েদের ডিম্বাশয়, ছেলেদের শুক্রাশয় (এখানে একই রেখাচিত্রে দুটিই আঁকা)।"), L2("Oestrogen (ovary); testosterone (testis).", "ইস্ট্রোজেন (ডিম্বাশয়); টেস্টোস্টেরন (শুক্রাশয়)।"), L2("Develop the features of adulthood, help the reproductive organs to grow and control the reproductive cycle.", "পরিণত বয়সের লক্ষণ বিকশিত করে, জনন অঙ্গের বৃদ্ধিতে সাহায্য করে এবং জননচক্র নিয়ন্ত্রণ করে।")]];
  let sel = 0;
  el.innerHTML = `<div class="svgwrap fit" id="b10gs"></div><div class="w-out" id="b10go" style="margin-top:8px"></div><div class="chipset b10gp" role="group" style="margin-top:8px">${G.map((g, i) => `<button data-i="${i}" aria-pressed="false">${g[1]}</button>`).join("")}</div>`;
  const draw = () => {
    const k = G[sel][0], on = q => q === k, hl = q => on(q) ? `stroke="var(--bad)" stroke-width="3"` : `stroke="var(--ink)" stroke-width="1.2"`;
    const lab = (q, x, y, tx, a = "start") => `<text data-k="${q}" x="${x}" y="${y}" font-size="13" text-anchor="${a}" fill="${on(q) ? "var(--bad)" : "var(--ink)"}" font-weight="${on(q) ? 700 : 400}" paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" style="cursor:pointer">${tx}</text>`;
    let s = `<svg viewBox="0 0 360 420" role="img" aria-label="${L2("Main endocrine glands of the human body", "মানবদেহের মুখ্য নালিবিহীন গ্রন্থি")}">`;
    s += `<path d="M166 84 V104 Q124 108 106 130 L112 250 Q106 316 122 390 H238 Q254 316 248 250 L254 130 Q236 108 194 104 V84 Z" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.8"/><circle cx="180" cy="50" r="38" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.8"/>`;
    s += `<path d="M152 44 C150 20 176 14 190 18 C210 20 214 44 204 52 C196 58 184 54 176 56 C164 60 154 56 152 44 Z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="1.2"/><path d="M178 56 V66" stroke="var(--c)" stroke-width="2"/>`;
    s += `<rect x="176" y="86" width="8" height="46" rx="4" fill="var(--rule)"/><path d="M180 132 L164 150 M180 132 L196 150" stroke="var(--rule)" stroke-width="6" stroke-linecap="round"/>`;
    s += `<ellipse cx="150" cy="240" rx="12" ry="19" fill="var(--rule)"/><ellipse cx="210" cy="240" rx="12" ry="19" fill="var(--rule)"/>`;
    s += `<g data-k="pit" style="cursor:pointer"><circle cx="178" cy="68" r="10" fill="transparent"/><ellipse cx="178" cy="68" rx="5" ry="4.5" fill="#d6457a" ${hl("pit")}/></g>`;
    s += `<g data-k="thy" style="cursor:pointer"><ellipse cx="171" cy="98" rx="7" ry="9.5" fill="#e08a5a" ${hl("thy")}/><ellipse cx="189" cy="98" rx="7" ry="9.5" fill="#e08a5a" ${hl("thy")}/><rect x="174" y="96" width="12" height="5" fill="#e08a5a"/></g>`;
    s += `<g data-k="para" style="cursor:pointer">${[[170, 93], [170, 103], [190, 93], [190, 103]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${on("para") ? 3.4 : 2.6}" fill="${on("para") ? "var(--bad)" : "#7a4fbf"}" stroke="var(--sheet)" stroke-width=".8"/>`).join("")}</g>`;
    s += `<g data-k="thm" style="cursor:pointer"><ellipse cx="173" cy="156" rx="8" ry="14" fill="#d9a05a" ${hl("thm")}/><ellipse cx="187" cy="156" rx="8" ry="14" fill="#d9a05a" ${hl("thm")}/></g>`;
    s += `<g data-k="adr" style="cursor:pointer"><path d="M139 224 Q150 206 161 224 Z" fill="#e0b030" ${hl("adr")}/><path d="M199 224 Q210 206 221 224 Z" fill="#e0b030" ${hl("adr")}/></g>`;
    s += `<g data-k="isl" style="cursor:pointer"><path d="M158 282 Q160 268 182 270 Q206 268 218 262 Q224 270 214 278 Q196 288 176 286 Q162 290 158 282 Z" fill="#edc98f" ${hl("isl")}/>${[[168, 280], [180, 277], [192, 278], [204, 273], [212, 269]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${BLU10}"/>`).join("")}</g>`;
    s += `<g data-k="gon" style="cursor:pointer"><ellipse cx="156" cy="340" rx="9" ry="6.5" fill="#d6457a" ${hl("gon")}/><ellipse cx="204" cy="340" rx="9" ry="6.5" fill="#d6457a" ${hl("gon")}/><ellipse cx="173" cy="400" rx="6" ry="8.5" fill="#5a8fd0" ${hl("gon")}/><ellipse cx="187" cy="400" rx="6" ry="8.5" fill="#5a8fd0" ${hl("gon")}/></g>`;
    s += LD10(70, 62, 172, 68) + lab("pit", 4, 66, L2("pituitary", "পিটুইটারি"));
    s += LD10(64, 116, 164, 100) + lab("thy", 4, 120, L2("thyroid", "থাইরয়েড"));
    s += LD10(284, 88, 193, 93) + lab("para", 356, 82, L2("parathyroid", "প্যারাথাইরয়েড"), "end");
    s += LD10(300, 152, 196, 156) + lab("thm", 356, 156, L2("thymus", "থাইমাস"), "end");
    s += LD10(74, 206, 140, 220) + lab("adr", 4, 210, L2("adrenal", "অ্যাডরেনাল"));
    s += T10(4, 246, L2("(kidney)", "(কিডনি)"), "start", 12, "var(--muted)") + LD10(60, 242, 138, 242);
    s += LD10(266, 276, 220, 272) + lab("isl", 356, 272, L2("islets of", "আইলেটস অফ"), "end") + lab("isl", 356, 288, L2("Langerhans", "ল্যাংগারহ্যানস"), "end") + T10(356, 304, L2("(in the pancreas)", "(অগ্ন্যাশয়ে)"), "end", 12, "var(--muted)");
    s += LD10(60, 336, 146, 340) + lab("gon", 4, 340, L2("ovary", "ডিম্বাশয়")) + T10(4, 355, L2("(female)", "(স্ত্রীদেহে)"), "start", 12, "var(--muted)");
    s += LD10(292, 396, 194, 400) + lab("gon", 356, 400, L2("testis", "শুক্রাশয়"), "end") + T10(356, 415, L2("(male)", "(পুরুষদেহে)"), "end", 12, "var(--muted)");
    $("#b10gs", el).innerHTML = s + `</svg>`;
    const g = G[sel];
    $("#b10go", el).innerHTML = `<b>${g[1]}</b><br><span class="muted">${L2("Where:", "অবস্থান:")}</span> ${g[2]}<br><span class="muted">${L2("Hormone:", "হরমোন:")}</span> ${g[3]}<br><span class="muted">${L2("Work:", "কাজ:")}</span> ${g[4]}`;
    el.querySelectorAll(".b10gp button").forEach((q, i) => q.setAttribute("aria-pressed", i === sel));
    el.querySelectorAll("#b10gs [data-k]").forEach(n => n.addEventListener("click", () => { sel = G.findIndex(p => p[0] === n.dataset.k); draw(); }));
  };
  el.querySelectorAll(".b10gp button").forEach(q => q.addEventListener("click", () => { sel = +q.dataset.i; draw(); }));
  draw();
};

/* 10.5 blood glucose model: insulin keys open cell doors; without them glucose spills into the urine */
W.b10sugar = (el) => {
  let mode = "ok", treat = false, ph = 0, tm = 0;
  el.innerHTML = `<div class="chipset b10sm" role="group"><button data-m="ok" aria-pressed="true">${L2("Healthy", "সুস্থ")}</button><button data-m="t1" aria-pressed="false">${L2("Type 1 diabetes", "টাইপ-১ ডায়াবেটিস")}</button><button data-m="t2" aria-pressed="false">${L2("Type 2 diabetes", "টাইপ-২ ডায়াবেটিস")}</button></div>
    <div class="w-row" style="margin:8px 0"><button class="btn solid" id="b10se">${L2("Eat a meal", "খাবার খাও")}</button><div class="chipset" role="group"><button id="b10st" aria-pressed="false">${L2("With treatment", "চিকিৎসাসহ")}</button></div></div>
    <div class="svgwrap fit" id="b10ss"></div><div class="w-out" id="b10so" style="margin-top:8px"></div><div class="hint" style="margin-top:6px">${L2("A simple model: the counts are only for comparison, not real measurements.", "এটি একটি সহজ মডেল: সংখ্যাগুলো শুধু তুলনার জন্য, প্রকৃত পরিমাপ নয়।")}</div>`;
  const keys = () => mode === "ok" || treat ? 6 : mode === "t1" ? 0 : 2;
  const hex = (x, y, r = 7.5) => `<path d="M${x - r} ${y} L${x - r / 2} ${F10(y - r * 0.87)} L${x + r / 2} ${F10(y - r * 0.87)} L${x + r} ${y} L${x + r / 2} ${F10(y + r * 0.87)} L${x - r / 2} ${F10(y + r * 0.87)} Z" fill="${GLU10}" stroke="var(--ink)" stroke-width=".8"/>`;
  const key = (x, y) => `<circle cx="${x}" cy="${y - 7}" r="5" fill="none" stroke="${BLU10}" stroke-width="3"/><path d="M${x} ${y - 2} V${y + 8} M${x} ${y + 3} h4 M${x} ${y + 7} h4" stroke="${BLU10}" stroke-width="3" stroke-linecap="round"/>`;
  const draw = () => {
    const k = keys(), taken = ph >= 3 ? 2 * k : 0;
    let blood = ph === 0 ? 4 : 16 - taken, spill = 0;
    if (ph >= 4 && blood > 8) { spill = (blood - 4) / 2; blood -= spill; }
    const high = blood > 6;
    let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("Model of blood glucose and insulin", "রক্তের গ্লুকোজ ও ইনসুলিনের মডেল")}">`;
    s += `<path d="M10 38 Q26 12 66 20 Q108 24 120 38 Q102 60 64 52 Q26 60 10 38 Z" fill="#edc98f" stroke="var(--ink)" stroke-width="1.3"/>${[[34, 38], [54, 30], [72, 42], [92, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${BLU10}"/>`).join("")}`;
    s += T10(8, 74, L2("pancreas (islets)", "অগ্ন্যাশয় (আইলেটস)"), "start", 12.5);
    const kt = ph < 2 ? "" : mode === "ok" ? L2("insulin: enough", "ইনসুলিন: যথেষ্ট") : treat ? (mode === "t1" ? L2("insulin by injection", "ইনজেকশনের ইনসুলিন") : L2("medicine helps: enough", "ঔষধের সাহায্যে: যথেষ্ট")) : mode === "t1" ? L2("insulin: none", "ইনসুলিন: নেই") : L2("insulin: too little", "ইনসুলিন: খুব কম");
    if (kt) s += T10(8, 90, kt, "start", 12.5, k === 6 ? "var(--good)" : "var(--bad)", "700");
    /* gauge */
    s += T10(350, 18, L2("blood glucose", "রক্তের গ্লুকোজ"), "end", 12.5, "var(--ink)", "700");
    s += `<rect x="190" y="26" width="64" height="14" rx="5" fill="var(--good)" opacity=".75"/><rect x="254" y="26" width="96" height="14" rx="5" fill="var(--bad)" opacity=".6"/>`;
    const gx = 196 + (blood / 16) * 148;
    s += `<path d="M${F10(gx)} 42 l-7 12 h14 Z" fill="var(--ink)"/>` + T10(222, 70, L2("normal", "স্বাভাবিক"), "middle", 12, high ? "var(--muted)" : "var(--good)", high ? "" : "700") + T10(302, 70, L2("high", "বেশি"), "middle", 12, high ? "var(--bad)" : "var(--muted)", high ? "700" : "");
    /* blood vessel and kidney */
    s += `<rect x="6" y="100" width="302" height="68" rx="14" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/>` + T10(14, 115, L2("blood", "রক্ত"), "start", 12, "var(--bad)", "700");
    s += `<path d="M308 124 h8 M308 146 h8" stroke="var(--bad)" stroke-width="2"/><path d="M324 104 Q352 104 352 134 Q352 166 324 166 Q312 158 318 136 Q312 114 324 104 Z" fill="#c9837a" stroke="var(--ink)" stroke-width="1.3"/>` + T10(334, 96, L2("kidney", "বৃক্ক"), "middle", 12);
    for (let i = 0; i < blood; i++) s += hex(48 + (i % 8) * 34, 126 + Math.floor(i / 8) * 26);
    /* cells */
    for (let i = 0; i < 6; i++) {
      const x = 8 + i * 49, open = ph >= 2 && i < k, fed = ph >= 3 && i < k;
      s += `<rect x="${x}" y="188" width="43" height="56" rx="9" fill="${fed ? "var(--good-soft)" : "var(--paper)"}" stroke="${fed ? "var(--good)" : "var(--ink)"}" stroke-width="1.6"/>`;
      s += open ? `<rect x="${x + 28}" y="184" width="12" height="8" rx="2" fill="var(--good)"/><rect x="${x + 14}" y="186" width="14" height="4" fill="var(--sheet)"/>` + key(x + 34, 174) : `<rect x="${x + 14}" y="184" width="14" height="8" rx="2" fill="var(--ink)"/>`;
      if (fed) s += hex(x + 13, 222, 7) + hex(x + 30, 222, 7);
      else if (ph >= 3) s += T10(x + 21.5, 226, L2("empty", "খালি"), "middle", 12, "var(--muted)");
    }
    s += T10(150, 262, L2("body cells (the dark bar is a closed door)", "দেহকোষ (কালো দাগটি বন্ধ দরজা)"), "middle", 12, "var(--muted)");
    /* urine */
    s += `<path d="M334 168 V184" stroke="var(--muted)" stroke-width="3"/><rect x="314" y="186" width="40" height="70" rx="8" fill="#f4e7a1" stroke="var(--ink)" stroke-width="1.2" opacity=".9"/>`;
    for (let i = 0; i < spill; i++) s += hex(325 + (i % 2) * 18, 200 + Math.floor(i / 2) * 20, 6.5);
    s += T10(334, 272, L2("urine", "প্রস্রাব"), "middle", 12.5) + (ph >= 4 ? T10(354, 288, spill ? L2("glucose in urine", "প্রস্রাবে গ্লুকোজ") : L2("no glucose", "গ্লুকোজ নেই"), "end", 12, spill ? "var(--bad)" : "var(--good)", "700") : "");
    s += hex(16, 286, 7) + T10(28, 290, L2("= glucose", "= গ্লুকোজ"), "start", 12.5) + key(118, 285) + T10(128, 290, L2("= insulin", "= ইনসুলিন"), "start", 12.5);
    $("#b10ss", el).innerHTML = s + `</svg>`;
    const O = $("#b10so", el), dia = mode !== "ok" && !treat;
    if (ph === 0) O.innerHTML = `<b>${L2("Before the meal.", "খাওয়ার আগে।")}</b> ${L2("A small, normal amount of glucose is in the blood. Press \"Eat a meal\".", "রক্তে অল্প, স্বাভাবিক পরিমাণ গ্লুকোজ আছে। \"খাবার খাও\" চাপো।")}`;
    else if (ph === 1) O.innerHTML = `<b>${B10(1)}. ${L2("Glucose enters the blood.", "গ্লুকোজ রক্তে ঢোকে।")}</b> ${L2("The meal is digested and the glucose level of the blood rises.", "খাবার পরিপাক হয়, আর রক্তে গ্লুকোজের মাত্রা বেড়ে যায়।")}`;
    else if (ph === 2) O.innerHTML = `<b>${B10(2)}. ${L2("Insulin.", "ইনসুলিন।")}</b> ` + (mode === "ok" ? L2("The islets of the pancreas release insulin. It works like a key at the door of each cell.", "অগ্ন্যাশয়ের আইলেটস থেকে ইনসুলিন নিঃসৃত হয়। এটি প্রতিটি কোষের দরজায় চাবির মতো কাজ করে।") : treat ? (mode === "t1" ? L2("The pancreas makes no insulin, but insulin taken by injection supplies the keys.", "অগ্ন্যাশয়ে ইনসুলিন তৈরি হয় না, তবে ইনজেকশনের মাধ্যমে নেওয়া ইনসুলিন চাবির জোগান দেয়।") : L2("With the medicine the doctor has given, a controlled diet and exercise, enough insulin is at work again.", "ডাক্তারের দেওয়া ঔষধ, খাদ্য নিয়ন্ত্রণ ও ব্যায়ামের ফলে আবার যথেষ্ট ইনসুলিন কাজ করছে।")) : mode === "t1" ? L2("The pancreas makes no insulin at all, so no keys arrive.", "অগ্ন্যাশয়ে একেবারেই ইনসুলিন তৈরি হয় না, তাই কোনো চাবি আসে না।") : L2("The pancreas supplies only a little insulin: too few keys for all the cells.", "অগ্ন্যাশয় অল্প ইনসুলিন জোগায়: সব কোষের জন্য চাবি কম পড়ে।"));
    else if (ph === 3) O.innerHTML = `<b>${B10(3)}. ${L2("The cells.", "কোষ।")}</b> ` + (k === 6 ? L2("Every door opens and the cells take in glucose to use for energy.", "সব দরজা খুলে যায়, আর কোষগুলো শক্তির জন্য গ্লুকোজ ভেতরে নেয়।") : k === 0 ? L2("No door opens. The glucose stays in the blood and the cells get none.", "কোনো দরজা খোলে না। গ্লুকোজ রক্তেই থেকে যায়, কোষ কিছুই পায় না।") : L2("Only a few doors open. Most of the glucose stays in the blood.", "অল্প কয়েকটি দরজা খোলে। বেশির ভাগ গ্লুকোজ রক্তেই থেকে যায়।"));
    else O.innerHTML = `<b>${B10(4)}. ${L2("The result.", "ফলাফল।")}</b> ` + (dia ? L2("Blood glucose stays high. The kidneys cannot take it all back, so glucose passes into the urine, taking water with it. The cells are short of fuel, so the person feels weak, hungry and thirsty.", "রক্তের গ্লুকোজ বেশিই থেকে যায়। বৃক্ক সবটা ফিরিয়ে নিতে পারে না, তাই গ্লুকোজ প্রস্রাবে চলে যায় এবং সাথে পানিও টেনে নেয়। কোষে জ্বালানি কম পড়ে, তাই মানুষটি দুর্বল, ক্ষুধার্ত ও পিপাসার্ত বোধ করে।") : mode === "ok" ? L2("Blood glucose is back to normal and no glucose is lost in the urine.", "রক্তের গ্লুকোজ স্বাভাবিকে ফিরে এসেছে, আর প্রস্রাবে কোনো গ্লুকোজ যায়নি।") : L2("With proper treatment the blood glucose comes back to normal. The disease is not cured, but it is under control.", "যথাযথ চিকিৎসায় রক্তের গ্লুকোজ স্বাভাবিকে ফিরে আসে। রোগটি সেরে যায়নি, তবে নিয়ন্ত্রণে আছে।"));
  };
  const sync = () => { const b = $("#b10st", el); b.disabled = mode === "ok"; b.style.opacity = mode === "ok" ? 0.45 : 1; b.setAttribute("aria-pressed", treat && mode !== "ok"); };
  chips10(el, ".b10sm", q => { mode = q.dataset.m; if (mode === "ok") treat = false; ph = 0; sync(); draw(); });
  $("#b10st", el).addEventListener("click", () => { if (mode === "ok") return; treat = !treat; ph = 0; sync(); draw(); });
  $("#b10se", el).addEventListener("click", () => { ph = REDUCED ? 4 : 1; tm = 0; draw(); });
  sync(); draw();
  if (!REDUCED) animate(el, dt => { if (ph < 1 || ph > 3) return; tm += dt; if (tm > 1.7) { tm = 0; ph++; draw(); } });
};

/* 10.6 stroke: clot or bleeding, and the crossed control of the body */
W.b10stroke = (el) => {
  let type = "clot", side = "R";
  el.innerHTML = `<div class="w-row"><span class="muted">${L2("Kind of stroke:", "স্ট্রোকের ধরন:")}</span><div class="chipset b10kt" role="group"><button data-t="clot" aria-pressed="true">${L2("Blood clot", "রক্ত জমাট বাঁধা")}</button><button data-t="bleed" aria-pressed="false">${L2("Bleeding", "রক্তক্ষরণ")}</button></div></div>
    <div class="w-row" style="margin-top:6px"><span class="muted">${L2("Where:", "কোথায়:")}</span><div class="chipset b10ks" role="group"><button data-s="R" aria-pressed="true">${L2("Right half of the brain", "মস্তিষ্কের ডান অর্ধেক")}</button><button data-s="L" aria-pressed="false">${L2("Left half of the brain", "মস্তিষ্কের বাম অর্ধেক")}</button></div></div>
    <div class="svgwrap fit" id="b10ks" style="margin-top:8px"></div><div class="w-out" id="b10ko" style="margin-top:8px"></div>`;
  const draw = () => {
    const m = side === "R" ? 1 : -1, X = x => 100 - m * (100 - x);   /* person faces you: their right half is on your left */
    let s = `<svg viewBox="0 0 360 304" role="img" aria-label="${L2("A stroke in one half of the brain and the weak side of the body", "মস্তিষ্কের এক অর্ধেকে স্ট্রোক ও দেহের দুর্বল পাশ")}">${arrowDefs("b10ka", BLU10)}`;
    s += `<path d="M26 128 C22 60 60 24 100 24 C140 24 178 60 174 128 C172 196 140 238 100 238 C60 238 28 196 26 128 Z" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.8"/><rect x="74" y="234" width="52" height="32" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.8"/>`;
    s += `<circle cx="74" cy="184" r="5" fill="var(--ink)"/><circle cx="126" cy="184" r="5" fill="var(--ink)"/><path d="M82 ${side === "L" ? 222 : 216} Q100 222 118 ${side === "R" ? 222 : 216}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>`;
    const hemi = f => `M${100 - f * 3} 34 C${100 - f * 50} 32 ${100 - f * 70} 76 ${100 - f * 66} 116 C${100 - f * 62} 150 ${100 - f * 30} 160 ${100 - f * 3} 154 Z`;
    s += `<path d="${hemi(1)}" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.4"/><path d="${hemi(-1)}" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.4"/>`;
    s += `<path d="${hemi(m)}" fill="var(--ink)" opacity=".22"/>`;
    s += T10(60, 14, L2("right half", "ডান অর্ধেক"), "middle", 12.5, "var(--ink)", "700") + T10(140, 14, L2("left half", "বাম অর্ধেক"), "middle", 12.5, "var(--ink)", "700");
    const art = (f, hit) => {
      const x = v => 100 - f * (100 - v), c = hit ? "var(--muted)" : "var(--bad)", d = hit ? ` stroke-dasharray="5 4"` : "";
      return `<path d="M${x(82)} 264 V206 C${x(82)} 180 ${x(76)} 162 ${x(68)} 140" fill="none" stroke="var(--bad)" stroke-width="4.5" stroke-linecap="round"/><path d="M${x(68)} 140 C${x(62)} 122 ${x(52)} 108 ${x(50)} 90 M${x(66)} 134 C${x(74)} 116 ${x(82)} 104 ${x(84)} 84" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"${d}/>`;
    };
    s += art(1, side === "R") + art(-1, side === "L");
    const ex = X(68), ey = 140;
    /* nerve pathway from the damaged half crosses to the other side on its way down */
    s += `<path d="M${X(54)} 100 C${X(56)} 160 ${X(100)} 172 ${X(109)} 204 L${X(109)} 256" fill="none" stroke="${BLU10}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#b10ka)"/>`;
    if (type === "clot") s += `<circle cx="${ex}" cy="${ey}" r="7" fill="#3a1f1c" stroke="var(--sheet)" stroke-width="1.5"/>`;
    else s += `<path d="M${ex - 16} ${ey - 4} q6 -18 20 -12 q16 -4 14 12 q8 14 -8 18 q-14 10 -22 -2 q-10 -6 -4 -16 Z" fill="var(--bad)" opacity=".8"/><path d="M${ex - 4} ${ey + 3} l8 -6" stroke="var(--sheet)" stroke-width="2"/>`;
    s += T10(side === "R" ? 4 : 192, 282, type === "clot" ? L2("clot: no blood beyond it", "জমাট রক্ত: এর পরে রক্ত যায় না") : L2("burst vessel: bleeding", "ফেটে যাওয়া রক্তনালি: রক্তক্ষরণ"), side === "R" ? "start" : "end", 12.5, "var(--bad)", "700");
    s += T10(100, 299, L2("(the person is facing you)", "(মানুষটি তোমার দিকে মুখ করে আছে)"), "middle", 12, "var(--muted)");
    /* body: weak side is opposite */
    const weakViewerRight = side === "R", fl = w => w ? `fill="var(--bad)" opacity=".8"` : `fill="var(--c-soft)"`;
    s += `<circle cx="290" cy="52" r="16" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><rect x="270" y="72" width="40" height="84" rx="9" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>`;
    s += `<rect x="251" y="74" width="15" height="78" rx="7" ${fl(!weakViewerRight)} stroke="var(--ink)" stroke-width="1.4"/><rect x="314" y="74" width="15" height="78" rx="7" ${fl(weakViewerRight)} stroke="var(--ink)" stroke-width="1.4"/>`;
    s += `<rect x="271" y="160" width="17" height="88" rx="8" ${fl(!weakViewerRight)} stroke="var(--ink)" stroke-width="1.4"/><rect x="292" y="160" width="17" height="88" rx="8" ${fl(weakViewerRight)} stroke="var(--ink)" stroke-width="1.4"/>`;
    s += T10(290, 22, L2("the body", "দেহ"), "middle", 12.5, "var(--ink)", "700");
    s += T10(290, 268, side === "R" ? L2("left side weak", "বাম পাশ দুর্বল") : L2("right side weak", "ডান পাশ দুর্বল"), "middle", 12.5, "var(--bad)", "700");
    s += `<path d="M200 281 h18" stroke="${BLU10}" stroke-width="2.5" stroke-dasharray="6 4"/>` + T10(224, 285, L2("nerve path", "স্নায়ুপথ উল্টো"), "start", 12) + T10(224, 299, L2("crosses over", "পাশে যায়"), "start", 12);
    $("#b10ks", el).innerHTML = s + `</svg>`;
    const half = side === "R" ? L2("right", "ডান") : L2("left", "বাম"), opp = side === "R" ? L2("left", "বাম") : L2("right", "ডান");
    $("#b10ko", el).innerHTML = (type === "clot"
      ? `<b>${L2("Stroke from a clot.", "রক্ত জমাট বাঁধাজনিত স্ট্রোক।")}</b> ${L2("Blood has clotted inside a vessel of the brain and blocks the flow. The part beyond the clot gets no blood.", "মস্তিষ্কের একটি রক্তনালির ভেতরে রক্ত জমাট বেঁধে চলাচল আটকে দিয়েছে। জমাট রক্তের পরের অংশ আর রক্ত পাচ্ছে না।")}`
      : `<b>${L2("Stroke from bleeding.", "রক্তক্ষরণজনিত স্ট্রোক।")}</b> ${L2("A vessel in the brain has burst, usually because of high blood pressure. This kind is more dangerous.", "মস্তিষ্কের একটি রক্তনালি ফেটে গেছে, সাধারণত উচ্চ রক্তচাপের কারণে। এ ধরনটি বেশি মারাত্মক।")}`)
      + ` ${L2(`The damage is in the ${half} half of the brain, which controls the ${opp} side of the body, so the ${opp} arm and leg become weak.`, `ক্ষতি হয়েছে মস্তিষ্কের ${half} অর্ধেকে, যা দেহের ${opp} পাশ নিয়ন্ত্রণ করে; তাই ${opp} হাত ও পা দুর্বল হয়ে পড়ে।`)} <b>${L2("Whichever kind it is, the person must reach a hospital as fast as possible.", "ধরন যেটিই হোক, রোগীকে যত দ্রুত সম্ভব হাসপাতালে নিতে হবে।")}</b>`;
  };
  chips10(el, ".b10kt", q => { type = q.dataset.t; draw(); });
  chips10(el, ".b10ks", q => { side = q.dataset.s; draw(); });
  draw();
};
