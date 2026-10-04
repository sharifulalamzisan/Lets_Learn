/* ---- BGS chapter 3 widgets: the solar system and the Earth ---- */
const { B, SRC, chips, chipHtml, card, list, tiles, bars, legend, flow, stepper, worldMap, bdMap } = window.G;
const rad = a => a * Math.PI / 180;

/* planet facts as the textbook gives them: [key, en, bn, distance (crore km), period text, period in days, diameter km, moons, colour, radius on the sketch, facts en, facts bn] */
const PL = [
  ["mercury", "Mercury", "বুধ", 5.8, ["88 days", "৮৮ দিন"], 88, 4850, 0, "#9a8f86", 2.6,
    ["Nearest to the Sun and the smallest planet", "Very hot because it is so close to the Sun", "Its surface has plains, countless craters and hills", "No satellite"],
    ["সূর্যের সবচেয়ে কাছের এবং সবচেয়ে ছোট গ্রহ", "সূর্যের খুব কাছে বলে তাপমাত্রা অত্যধিক", "ভূত্বকে সমতল ভূমি, অসংখ্য গর্ত ও পাহাড় আছে", "কোনো উপগ্রহ নেই"]],
  ["venus", "Venus", "শুক্র", 10.8, ["225 days", "২২৫ দিন"], 225, 12104, 0, "#d9a857", 3.6,
    ["The planet nearest to the Earth; called the Earth's twin", "Seen as the evening star in the west and the morning star in the east", "Atmosphere is about 96% carbon dioxide, with no oxygen; acid rain falls", "Air pressure is about 90 times the Earth's; spins very slowly; no satellite"],
    ["পৃথিবীর নিকটতম গ্রহ; পৃথিবীর যমজ গ্রহ বলা হয়", "সন্ধ্যায় পশ্চিম আকাশে সন্ধ্যাতারা, ভোরে পূর্ব আকাশে শুকতারা", "বায়ুমণ্ডলের প্রায় ৯৬% কার্বন ডাই-অক্সাইড, অক্সিজেন নেই; এসিড বৃষ্টি হয়", "বাতাসের চাপ পৃথিবীর প্রায় ৯০ গুণ; খুব ধীরে ঘোরে; উপগ্রহ নেই"]],
  ["earth", "Earth", "পৃথিবী", 15, ["365 d 5 h 48 min 47 s", "৩৬৫ দিন ৫ ঘণ্টা ৪৮ মিনিট ৪৭ সেকেন্ড"], 365.24, 12752, 1, "#3f84c4", 3.8,
    ["Third planet from the Sun", "Has oxygen, nitrogen and water; average surface temperature 13.90 °C", "The only planet known to have living things", "One satellite, the Moon, about 3,81,500 km away"],
    ["সূর্যের তৃতীয় নিকটতম গ্রহ", "অক্সিজেন, নাইট্রোজেন ও পানি আছে; পৃষ্ঠের গড় তাপমাত্রা ১৩.৯০ °সে", "একমাত্র গ্রহ যেখানে জীব আছে বলে জানা যায়", "একটি উপগ্রহ: চাঁদ, দূরত্ব প্রায় ৩,৮১,৫০০ কিমি"]],
  ["mars", "Mars", "মঙ্গল", 22.8, ["687 days", "৬৮৭ দিন"], 687, 6779, 2, "#c2603a", 3.1,
    ["Looks red because the iron in its rocks has rusted", "Much colder than the Earth; very little water", "Has canyons and volcanoes; one spin takes 24 h 37 min", "Two satellites: Deimos and Phobos"],
    ["পাথরে মরিচা পড়ায় লালচে দেখায়", "পৃথিবীর চেয়ে অনেক ঠান্ডা; পানি খুব কম", "গিরিখাত ও আগ্নেয়গিরি আছে; নিজ অক্ষে একবার ঘুরতে ২৪ ঘণ্টা ৩৭ মিনিট", "দুটি উপগ্রহ: ডিমোস ও ফোবোস"]],
  ["jupiter", "Jupiter", "বৃহস্পতি", 77.8, ["12 years", "১২ বছর"], 4380, 142800, 97, "#c9a27a", 7.2,
    ["The largest planet: about 1,300 times the Earth in volume", "Spins once in only 9 h 53 min", "Deep atmosphere; cold on top, very hot inside", "97 satellites, such as Io, Europa, Ganymede and Callisto"],
    ["সবচেয়ে বড় গ্রহ: আয়তনে পৃথিবীর প্রায় ১,৩০০ গুণ", "নিজ অক্ষে একবার ঘোরে মাত্র ৯ ঘণ্টা ৫৩ মিনিটে", "গভীর বায়ুমণ্ডল; ওপরে খুব ঠান্ডা, ভেতরে খুব গরম", "৯৭টি উপগ্রহ; যেমন আইও, ইউরোপা, গ্যানিমেড, ক্যালিস্টো"]],
  ["saturn", "Saturn", "শনি", 143, ["29 years 5 months", "২৯ বছর ৫ মাস"], 10746, 116464, 62, "#d8c08a", 6.2,
    ["The second largest planet; can be seen with the naked eye", "Three bright rings go round it", "Atmosphere of hydrogen and helium with methane and ammonia", "The textbook counts 62 satellites, such as Titan, Tethys and Rhea"],
    ["দ্বিতীয় বৃহত্তম গ্রহ; খালি চোখে দেখা যায়", "তিনটি উজ্জ্বল বলয় একে ঘিরে আছে", "বায়ুমণ্ডলে হাইড্রোজেন ও হিলিয়াম, সাথে মিথেন ও অ্যামোনিয়া", "বইয়ে ৬২টি উপগ্রহের কথা আছে; যেমন টাইটান, টেথিস, রিয়া"]],
  ["uranus", "Uranus", "ইউরেনাস", 287, ["84 years", "৮৪ বছর"], 30681, 49000, 27, "#8ecfd2", 4.8,
    ["The third largest planet", "About 64 times the Earth in volume but only 15 times as heavy", "Its atmosphere has a lot of methane; it has rings like Saturn", "27 satellites, such as Miranda, Ariel, Oberon, Umbriel and Titania"],
    ["তৃতীয় বৃহত্তম গ্রহ", "আয়তনে পৃথিবীর প্রায় ৬৪ গুণ, কিন্তু ওজনে মাত্র ১৫ গুণ", "বায়ুমণ্ডলে মিথেন বেশি; শনির মতো বলয় আছে", "২৭টি উপগ্রহ; যেমন মিরান্ডা, এরিয়েল, ওবেরন, আম্ব্রিয়েল, টাইটানিয়া"]],
  ["neptune", "Neptune", "নেপচুন", 450, ["165 years", "১৬৫ বছর"], 60266, 49244, 14, "#4a6fd0", 4.7,
    ["The farthest planet, so it is very cold", "Looks bluish", "One trip round the Sun takes 165 years", "14 satellites; Triton and Nereid are the well-known ones"],
    ["সবচেয়ে দূরের গ্রহ, তাই খুব শীতল", "দেখতে নীলাভ", "সূর্যকে একবার ঘুরতে ১৬৫ বছর লাগে", "১৪টি উপগ্রহ; ট্রাইটন ও নেরাইড উল্লেখযোগ্য"]]
];
const plName = p => L2(p[1], p[2]);
const crore = v => L2(`${v * 10 >= 100 ? Math.round(v * 10).toLocaleString("en-US") : +(v * 10).toFixed(0)} million km`, `${B(v)} কোটি কিমি`);
const km = v => L2(v.toLocaleString("en-US") + " km", B(v.toLocaleString("en-IN")) + " কিমি");

/* 3.1.1 the Sun and its family (orbits are a sketch, not to scale) */
W.g3solar = (el) => {
  const cx = 180, cy = 152, R = i => 31 + i * 18.8, RY = .8;
  let t = 0, run = !REDUCED, sel = null;
  el.innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 300" role="img" aria-label="${L2("The solar system", "সৌরজগৎ")}">
    <g fill="none" stroke="var(--rule)" stroke-width="1">${PL.map((p, i) => `<ellipse cx="${cx}" cy="${cy}" rx="${R(i)}" ry="${R(i) * RY}"/>`).join("")}</g>
    <ellipse cx="${cx}" cy="${cy}" rx="${R(3.5)}" ry="${R(3.5) * RY}" fill="none" stroke="var(--faint)" stroke-width="4" stroke-dasharray="1.5 4" opacity=".75"/>
    <circle cx="${cx}" cy="${cy}" r="19" fill="#f2b632" data-k="sun" style="cursor:pointer"/><text x="${cx}" y="${cy + 4}" font-size="12.5" font-weight="700" text-anchor="middle" fill="#3a2a00" pointer-events="none">${L2("Sun", "সূর্য")}</text>
    <g id="g3s-pl"></g></svg></div>
    <div class="w-row"><button type="button" class="btn" id="g3s-run"></button><span class="hint">${L2("Tap the Sun or a planet. Sizes and distances are not to scale.", "সূর্য বা কোনো গ্রহে চাপ দাও। আকার ও দূরত্ব স্কেল অনুযায়ী নয়।")}</span></div>
    <div class="g-card" id="g3s-card"></div>`;
  const ang = (p, i) => [0.5, 2.2, 3.9, 5.5, 1.2, 3.0, 4.7, 0.1][i] + t * 2 * Math.PI / (p[5] / 30);
  /* the planet groups are made once and only moved afterwards, so a tap always lands on a live element */
  $("#g3s-pl", el).innerHTML = PL.map(p => `<g data-k="${p[0]}" style="cursor:pointer"><circle r="13" fill="transparent"/>${p[0] === "saturn" ? `<ellipse rx="${p[9] + 5}" ry="2.6" fill="none" stroke="${p[8]}" stroke-width="1.5"/>` : ""}<circle class="b" r="${p[9]}" fill="${p[8]}" stroke-width="2"/><text y="${-p[9] - 4}" font-size="12.5" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--sheet)" stroke-width="2.5" pointer-events="none">${plName(p)}</text></g>`).join("");
  const gs = [...$("#g3s-pl", el).children];
  const draw = () => {
    PL.forEach((p, i) => { const a = ang(p, i), on = sel === p[0]; gs[i].setAttribute("transform", `translate(${(cx + R(i) * Math.cos(a)).toFixed(1)} ${(cy - R(i) * RY * Math.sin(a)).toFixed(1)})`); $(".b", gs[i]).setAttribute("stroke", on ? "var(--ink)" : "none"); $("text", gs[i]).setAttribute("font-weight", on ? 700 : 500); });
    $("#g3s-run", el).textContent = run ? L2("❚❚ Pause", "❚❚ থামাও") : L2("▶ Play", "▶ চালাও");
  };
  const show = k => {
    sel = k; const c = $("#g3s-card", el);
    if (k === "sun") c.innerHTML = card(L2("The Sun", "সূর্য"), list(L2(["A bright star at the centre; it controls all the planets and satellites", "About 13 lakh (1.3 million) times bigger than the Earth; about 13,84,000 km across", "About 15 crore (150 million) km from the Earth", "Made of gas: mostly hydrogen and helium; dark, cooler patches on it are sunspots", "Spins on its own axis once in about 25 days"],
      ["কেন্দ্রের উজ্জ্বল নক্ষত্র; সব গ্রহ ও উপগ্রহের নিয়ন্ত্রক", "পৃথিবীর চেয়ে প্রায় ১৩ লক্ষ গুণ বড়; ব্যাস প্রায় ১৩ লক্ষ ৮৪ হাজার কিমি", "পৃথিবী থেকে প্রায় ১৫ কোটি কিমি দূরে", "গ্যাসে গঠিত: প্রধানত হাইড্রোজেন ও হিলিয়াম; এর কালো, অপেক্ষাকৃত কম গরম দাগগুলো সৌরকলঙ্ক", "প্রায় ২৫ দিনে নিজ অক্ষে একবার আবর্তন করে"])));
    else if (k === "belt") c.innerHTML = card(L2("Asteroid belt", "গ্রহাণুপুঞ্জ"), `<p>${L2("Countless small bodies, 1.6 km to 805 km across, go round the Sun together between Mars and Jupiter. There is no planet in this gap.", "মঙ্গল ও বৃহস্পতির মাঝখানে ১.৬ থেকে ৮০৫ কিমি ব্যাসের অসংখ্য ছোট গ্রহাণু একসাথে সূর্যকে ঘুরছে। এই ফাঁকে আর কোনো গ্রহ নেই।")}</p>`);
    else if (k) { const p = PL.find(q => q[0] === k), n = PL.indexOf(p) + 1; c.innerHTML = card(`${B(n)}. ${plName(p)}`, tiles([[crore(p[3]), L2("from the Sun", "সূর্য থেকে দূরত্ব")], [L2(p[4][0], p[4][1]), L2("to go round the Sun", "সূর্যকে একবার ঘুরতে")], [B(p[7]), L2("satellites", "উপগ্রহ")]]) + list(L2(p[10], p[11]))); }
    else c.innerHTML = `<p>${L2("Order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. The dotted ring between Mars and Jupiter is the asteroid belt.", "সূর্য থেকে ক্রম: বুধ, শুক্র, পৃথিবী, মঙ্গল, বৃহস্পতি, শনি, ইউরেনাস, নেপচুন। মঙ্গল ও বৃহস্পতির মাঝের ফুটকি-বলয়টি গ্রহাণুপুঞ্জ।")}</p>`;
    draw();
  };
  $("svg", el).addEventListener("click", e => { const g = e.target.closest("[data-k]"); if (g) show(g.dataset.k); else { const r = $("svg", el).getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 360 - cx, y = ((e.clientY - r.top) / r.height * 300 - cy) / RY, dd = Math.hypot(x, y); if (Math.abs(dd - R(3.5)) < 7) show("belt"); } });
  $("#g3s-run", el).addEventListener("click", () => { run = !run; draw(); });
  show(null);
  animate(el, dt => { if (run) { t += dt * 0.9; draw(); } });
};

/* 3.1.2 compare the planets on one quantity at a time */
W.g3planets = (el) => {
  const M = { dist: [L2("Distance from the Sun", "সূর্য থেকে দূরত্ব"), p => p[3], L2(" crore km", " কোটি কিমি")], per: [L2("Time to go round the Sun", "সূর্যকে ঘোরার সময়"), p => p[5], ""], dia: [L2("Diameter", "ব্যাস"), p => p[6], L2(" km", " কিমি")], moon: [L2("Number of satellites", "উপগ্রহের সংখ্যা"), p => p[7], ""] };
  el.innerHTML = chipHtml("g3p-m", Object.keys(M).map(k => [k, M[k][0]]), "dist") + `<div id="g3p-b" style="margin-top:10px"></div><div class="g-card" id="g3p-c" style="margin-top:10px"></div>`;
  const draw = k => {
    const [, f, unit] = M[k], mx = Math.max(...PL.map(f));
    $("#g3p-b", el).innerHTML = `<div class="g-bars">${PL.map(p => `<div class="row"><span>${plName(p)}</span><span class="trk"><i style="width:${Math.max(1.5, 100 * f(p) / mx)}%;background:${p[8]}"></i></span><span class="val">${k === "per" ? L2(p[4][0], p[4][1]) : k === "dia" ? km(p[6]) : B(f(p)) + unit}</span></div>`).join("")}</div>`;
    const big = PL.reduce((a, p) => f(p) > f(a) ? p : a), small = PL.reduce((a, p) => f(p) < f(a) ? p : a);
    const notes = {
      dist: L2("The farther a planet is from the Sun, the colder it is and the longer its year. Neptune is about 78 times as far away as Mercury.", "গ্রহ সূর্য থেকে যত দূরে, তত ঠান্ডা এবং তার বছর তত লম্বা। নেপচুন বুধের চেয়ে প্রায় ৭৮ গুণ দূরে।"),
      per: L2("Mercury finishes a trip in 88 days; Neptune needs 165 years. A farther planet has a longer path and also moves more slowly.", "বুধ ৮৮ দিনে একবার ঘুরে আসে; নেপচুনের লাগে ১৬৫ বছর। দূরের গ্রহের পথ লম্বা, গতিও কম।"),
      dia: L2("Jupiter is the largest and Mercury the smallest. The four inner planets are small and rocky; the four outer planets are giants.", "বৃহস্পতি সবচেয়ে বড়, বুধ সবচেয়ে ছোট। ভেতরের চারটি গ্রহ ছোট ও পাথুরে; বাইরের চারটি বিশাল।"),
      moon: L2("Mercury and Venus have no satellite, the Earth has one, and the giant planets have many. These are the textbook's numbers; astronomers keep finding more small moons.", "বুধ ও শুক্রের কোনো উপগ্রহ নেই, পৃথিবীর একটি, আর বিশাল গ্রহগুলোর অনেক। এগুলো বইয়ের সংখ্যা; জ্যোতির্বিদরা এখনও নতুন ছোট উপগ্রহ খুঁজে পাচ্ছেন।")
    };
    $("#g3p-c", el).innerHTML = `<p><b>${L2("Most", "সবচেয়ে বেশি")}:</b> ${plName(big)} · <b>${L2("Least", "সবচেয়ে কম")}:</b> ${plName(small)}</p><p>${notes[k]}</p>`;
  };
  chips(el, ".g3p-m", draw); draw("dist");
};

/* 3.1.3 the layers of air that make the Earth liveable */
W.g3atmos = (el) => {
  const LY = [
    ["tropo", 150, 232, L2("Troposphere", "ট্রপোমণ্ডল"), L2(["The lowest layer, touching the ground; about 13 km deep on average", "Moisture, fog, cloud, rain and wind are all found here", "Almost all weather and climate processes happen in this layer", "The most useful layer for us: this is the air we breathe"], ["ভূপৃষ্ঠ-সংলগ্ন সবচেয়ে নিচের স্তর; গড় গভীরতা প্রায় ১৩ কিমি", "আর্দ্রতা, কুয়াশা, মেঘ, বৃষ্টি, বায়ুপ্রবাহ সব এই স্তরে", "আবহাওয়া ও জলবায়ুর প্রায় সব প্রক্রিয়া এই স্তরেই ঘটে", "মানুষের সবচেয়ে প্রয়োজনীয় স্তর: এই বাতাসেই আমরা শ্বাস নিই"])],
    ["pause", 128, 150, L2("Tropopause", "ট্রপোপস"), L2(["The upper limit of the troposphere; a thin layer", "The air here is still, with no storms or rain", "So aircraft fly through it smoothly"], ["ট্রপোমণ্ডলের ঊর্ধ্বসীমা; পাতলা স্তর", "এখানে বায়ু স্থির, ঝড়-বৃষ্টি নেই", "তাই বিমান এ স্তর দিয়ে নির্বিঘ্নে চলে"])],
    ["ozone", 62, 128, L2("Ozone layer", "ওজোন স্তর"), L2(["A layer of ozone gas, about 12 to 16 km deep", "It absorbs the Sun's harmful ultraviolet rays", "Absorbing those rays warms this layer", "Without it, living things could not survive on land"], ["ওজোন গ্যাসের স্তর; গভীরতা প্রায় ১২-১৬ কিমি", "সূর্যের ক্ষতিকর অতিবেগুনি রশ্মি শোষণ করে", "এই রশ্মি শোষণ করায় স্তরটির তাপমাত্রা বাড়ে", "এটি না থাকলে স্থলে জীব টিকতে পারত না"])]
  ];
  el.innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 262" role="img" aria-label="${L2("Layers of the atmosphere", "বায়ুমণ্ডলের স্তর")}">
    <rect x="0" y="0" width="360" height="62" fill="#1f2a44"/><text x="10" y="20" font-size="12" fill="#cfd6e6">${L2("thinner air above ↑", "ওপরে বায়ু পাতলা ↑")}</text>
    ${LY.map((l, i) => `<g data-k="${l[0]}" style="cursor:pointer"><rect x="0" y="${l[1]}" width="360" height="${l[2] - l[1]}" fill="${["#9ccbe9", "#c9dff0", "#7b9bd6"][i]}"/><text x="10" y="${l[1] + 18}" font-size="13" font-weight="700" fill="#10233a">${l[3]}</text></g>`).join("")}
    <rect x="0" y="232" width="360" height="30" fill="#5d9a57"/><text x="10" y="252" font-size="12.5" fill="#fff">${L2("Earth's surface", "ভূপৃষ্ঠ")}</text>
    <g fill="#fff" opacity=".95" pointer-events="none"><ellipse cx="250" cy="196" rx="26" ry="9"/><ellipse cx="268" cy="189" rx="18" ry="9"/><ellipse cx="150" cy="208" rx="20" ry="7"/></g>
    <g stroke="#3f6fa8" stroke-width="1.6" pointer-events="none"><line x1="244" y1="207" x2="240" y2="218"/><line x1="256" y1="207" x2="252" y2="218"/><line x1="268" y1="207" x2="264" y2="218"/></g>
    <path d="M196 139 l22 -5 l-5 4 l14 1 l-14 2 l5 4 z" fill="#35414f" pointer-events="none"/>
    <circle cx="322" cy="34" r="15" fill="#f2b632" pointer-events="none"/>
    <g stroke="#b06ad0" stroke-width="2.2" pointer-events="none"><line x1="306" y1="46" x2="268" y2="92"/><line x1="298" y1="40" x2="238" y2="88"/><path d="M262 84 l6 8 l3 -10" fill="none"/><path d="M233 80 l5 8 l4 -9" fill="none"/></g>
    <text x="198" y="104" font-size="12.5" fill="#fff" pointer-events="none">${L2("ultraviolet rays stopped", "অতিবেগুনি রশ্মি আটকে যায়")}</text>
    <g stroke="#f2b632" stroke-width="2" pointer-events="none"><line x1="318" y1="52" x2="304" y2="226"/><path d="M299 218 l5 9 l5 -9" fill="none"/></g>
    <text x="298" y="176" font-size="12.5" fill="#10233a" text-anchor="end" pointer-events="none">${L2("light and heat", "আলো ও তাপ")}</text></svg></div>
    <div class="g-card" id="g3a-c"></div>`;
  const show = k => { const l = LY.find(x => x[0] === k); $("#g3a-c", el).innerHTML = l ? card(l[3], list(l[4])) : `<p>${L2("Tap a layer. The picture is a sketch: real thicknesses are not drawn to scale.", "কোনো স্তরে চাপ দাও। ছবিটি একটি নকশা: স্তরের আসল পুরুত্ব স্কেল অনুযায়ী আঁকা হয়নি।")}</p>`; };
  $("svg", el).addEventListener("click", e => { const g = e.target.closest("[data-k]"); if (g) show(g.dataset.k); });
  show(null);
};

/* 3.1.4 inside the Earth, drawn to scale along the radius */
W.g3interior = (el) => {
  const k = 150 / 6371, cx = 180, cy = 172;
  const LY = [
    ["crust", 6371, "#8a6a4a", L2("Lithosphere / crust (Sial)", "অশ্মমণ্ডল / ভূত্বক (সিয়াল)"), L2(["The thin, hard outer cover of the Earth, made of many kinds of rock and minerals", "Depth is taken as 30 to 64 km: greatest under continents, least under oceans", "Rich in silicon (Si) and aluminium (Al), so it is called Sial", "The crust itself is 3 km (under oceans) to 40 km (under mountains) thick; about 17 km on average"], ["পৃথিবীর পাতলা, কঠিন বহিরাবরণ; নানা শিলা ও খনিজে গঠিত", "গভীরতা ৩০ থেকে ৬৪ কিমি ধরা হয়: মহাদেশের নিচে সবচেয়ে বেশি, মহাসাগরের নিচে সবচেয়ে কম", "সিলিকন (Si) ও অ্যালুমিনিয়াম (Al) বেশি, তাই নাম সিয়াল", "ভূত্বকের গভীরতা ৩ কিমি (সমুদ্রের তলদেশে) থেকে ৪০ কিমি (পর্বতের নিচে); গড়ে ১৭ কিমি"])],
    ["mantle", 6335, "#d0763a", L2("Mantle (Sima)", "গুরুমণ্ডল (সিমা)"), L2(["Lies around the core, about 2,885 km thick", "Made of heavy materials such as silicon (Si) and magnesium (Mg), so it is called Sima", "Its upper 1,448 km is of basalt-like material: the basalt zone"], ["কেন্দ্রমণ্ডলের চারদিকে, প্রায় ২,৮৮৫ কিমি পুরু", "সিলিকন (Si), ম্যাগনেসিয়াম (Mg) প্রভৃতি ভারী উপাদানে গঠিত, তাই নাম সিমা", "ওপরের ১,৪৪৮ কিমি ব্যাসল্ট জাতীয় উপাদানে গঠিত: ব্যাসল্ট অঞ্চল"])],
    ["outer", 3486, "#e9a23b", L2("Core: outer part (liquid)", "কেন্দ্রমণ্ডল: বাইরের অংশ (তরল)"), L2(["The core is a ball of about 3,486 km radius round the centre", "Mostly nickel (Ni) and iron (Fe), so it is called Nife", "The outer part, about 2,270 km thick, is thought to be liquid", "10 to 12 times as dense as water"], ["কেন্দ্রের চারদিকে প্রায় ৩,৪৮৬ কিমি ব্যাসার্ধের গোলক হলো কেন্দ্রমণ্ডল", "নিকেল (Ni) ও লোহা (Fe) বেশি, তাই নাম নাইফ (Nife)", "বাইরের অংশ প্রায় ২,২৭০ কিমি বিস্তৃত; তরল বলে অনুমান করা হয়", "পানির চেয়ে ১০-১২ গুণ ঘন"])],
    ["inner", 1216, "#f4d35e", L2("Core: inner part (solid)", "কেন্দ্রমণ্ডল: ভেতরের অংশ (কঠিন)"), L2(["Within about 1,216 km of the centre", "Thought to be solid, because the pressure there is enormous", "We know this only from the way earthquake waves travel through the Earth"], ["কেন্দ্র থেকে প্রায় ১,২১৬ কিমি ব্যাসার্ধের মধ্যে", "প্রচণ্ড চাপের কারণে কঠিন অবস্থায় আছে বলে অনুমান করা হয়", "ভূকম্পন তরঙ্গ ভেতর দিয়ে কীভাবে চলে তা দেখেই এটি জানা গেছে"])]
  ];
  const arc = r => `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`;
  el.innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 200" role="img" aria-label="${L2("Layers inside the Earth", "ভূ-অভ্যন্তরের স্তর")}">
    ${LY.map(l => `<path data-k="${l[0]}" d="${arc(l[1] * k + (l[0] === "crust" ? 2.5 : 0))}" fill="${l[2]}" stroke="var(--sheet)" stroke-width="1" style="cursor:pointer"/>`).join("")}
    <g font-size="12.5" fill="#2a1a08" text-anchor="middle" pointer-events="none"><text x="${cx}" y="${cy - 8}">${L2("inner core", "ভেতরের কেন্দ্র")}</text><text x="${cx}" y="${cy - 50}">${L2("outer core", "বাইরের কেন্দ্র")}</text><text x="${cx}" y="${cy - 108}" fill="#fff">${L2("mantle", "গুরুমণ্ডল")}</text></g>
    <line x1="${cx + 106}" y1="${cy - 107}" x2="${cx + 130}" y2="${cy - 132}" stroke="var(--ink)"/><text x="${cx + 132}" y="${cy - 136}" font-size="12.5" fill="var(--ink)" text-anchor="middle">${L2("crust", "ভূত্বক")}</text>
    <line x1="${cx}" y1="${cy + 9}" x2="${cx + 150}" y2="${cy + 9}" stroke="var(--muted)"/><text x="${cx + 75}" y="${cy + 24}" font-size="12.5" fill="var(--muted)" text-anchor="middle">${L2("radius about 6,371 km", "ব্যাসার্ধ প্রায় ৬,৩৭১ কিমি")}</text></svg></div>
    <div class="g-card" id="g3i-c"></div>`;
  const show = key => { const l = LY.find(x => x[0] === key); el.querySelectorAll("path[data-k]").forEach(p => p.setAttribute("opacity", !key || p.dataset.k === key ? 1 : .45)); $("#g3i-c", el).innerHTML = l ? card(l[3], list(l[4])) : `<p>${L2("Tap a layer of this half-Earth. The layers are drawn to scale; the crust is so thin that it is only the outer line.", "অর্ধেক পৃথিবীর কোনো স্তরে চাপ দাও। স্তরগুলো স্কেল অনুযায়ী আঁকা; ভূত্বক এত পাতলা যে তা শুধু বাইরের রেখাটুকু।")}</p>`; };
  $("svg", el).addEventListener("click", e => { const g = e.target.closest("[data-k]"); show(g ? g.dataset.k : null); });
  show(null);
};

/* 3.2.1 / 3.2.2 lines of latitude and longitude on the world map */
W.g3latlon = (el, lang, L) => {
  let mode = L && L.id === "3.2.2" ? "lon" : "lat";
  el.innerHTML = chipHtml("g3l-m", [["lat", L2("Latitude (east–west lines)", "অক্ষরেখা (পূর্ব-পশ্চিম)")], ["lon", L2("Longitude (north–south lines)", "দ্রাঘিমারেখা (উত্তর-দক্ষিণ)")]], mode) + `<div class="g3l-map" style="margin-top:8px"></div><div id="g3l-s"></div><div class="g-card" id="g3l-c"></div><div class="g-src">${SRC.world()}</div>`;
  worldMap($(".g3l-map", el), { view: [-180, 180, -86, 86], grid: 0, zoom: false }).then(m => {
    const fs = m.fs, KEY = [[66.5, L2("Arctic Circle 66.5° N", "সুমেরুবৃত্ত ৬৬.৫° উ")], [23.5, L2("Tropic of Cancer 23.5° N", "কর্কটক্রান্তি ২৩.৫° উ")], [0, L2("Equator 0°", "নিরক্ষরেখা ০°")], [-23.5, L2("Tropic of Capricorn 23.5° S", "মকরক্রান্তি ২৩.৫° দ")], [-66.5, L2("Antarctic Circle 66.5° S", "কুমেরুবৃত্ত ৬৬.৫° দ")]];
    const render = () => {
      $("#g3l-s", el).innerHTML = mode === "lat" ? slider("g3l-v", L2("Move the line", "রেখাটি সরাও"), -90, 90, 0.5, 23.5, "°") : slider("g3l-v", L2("Move the line", "রেখাটি সরাও"), -180, 180, 1, 90, "°");
      $("#g3l-v", el).addEventListener("input", upd); upd();
    };
    const upd = () => {
      const v = +$("#g3l-v", el).value; let h = "";
      if (mode === "lat") {
        h += KEY.map(([la, t]) => `<line x1="${m.vx}" x2="${m.vx + m.vw}" y1="${m.Y(la)}" y2="${m.Y(la)}" stroke="${la === 0 ? "var(--ink)" : "var(--muted)"}" stroke-width="${fs / (la === 0 ? 7 : 12)}" stroke-dasharray="${la === 0 ? "" : fs / 2 + " " + fs / 3}"/><text x="${m.vx + fs / 2}" y="${m.Y(la) - fs / 4}" font-size="${fs * .82}" fill="var(--ink)" paint-order="stroke" stroke="var(--g-sea)" stroke-width="${fs / 5}">${t}</text>`).join("");
        h += `<line x1="${m.vx}" x2="${m.vx + m.vw}" y1="${m.Y(v)}" y2="${m.Y(v)}" stroke="var(--bad)" stroke-width="${fs / 5}"/>`;
        const a = Math.abs(v), hemi = v > 0 ? L2("north", "উত্তর") : v < 0 ? L2("south", "দক্ষিণ") : "", zone = a <= 30 ? L2("low latitude (0° to 30°)", "নিম্ন অক্ষাংশ (০° থেকে ৩০°)") : a <= 60 ? L2("middle latitude (30° to 60°)", "মধ্য অক্ষাংশ (৩০° থেকে ৬০°)") : L2("high latitude (60° to 90°)", "উচ্চ অক্ষাংশ (৬০° থেকে ৯০°)");
        $("#g3l-v-v", el).textContent = B(a) + "° " + (v > 0 ? L2("N", "উ") : v < 0 ? L2("S", "দ") : "");
        const circ = Math.round(40075 * Math.cos(rad(a)));
        $("#g3l-c", el).innerHTML = `<p><b>${B(a)}° ${hemi} ${L2("latitude", "অক্ষাংশ")}</b>: ${v === 0 ? L2("the equator, which divides the Earth into the northern and southern hemispheres.", "নিরক্ষরেখা, যা পৃথিবীকে উত্তর ও দক্ষিণ গোলার্ধে ভাগ করেছে।") : a === 90 ? L2("a pole: here the circle shrinks to a single point.", "মেরু: এখানে বৃত্তটি ছোট হতে হতে একটি বিন্দু।") : L2(`${v > 0 ? "northern" : "southern"} hemisphere, ${zone}.`, `${v > 0 ? "উত্তর" : "দক্ষিণ"} গোলার্ধ, ${zone}।`)}</p><p>${L2(`Every place on this line has the same latitude. This parallel is a full circle about ${circ.toLocaleString("en-US")} km round: the circles get smaller towards the poles.`, `এই রেখার সব স্থানের অক্ষাংশ একই। এই সমাক্ষরেখাটি একটি পূর্ণবৃত্ত, পরিধি প্রায় ${B(circ.toLocaleString("en-IN"))} কিমি: মেরুর দিকে বৃত্ত ছোট হয়।`)}</p>`;
      } else {
        h += [[0, L2("Prime meridian 0° (Greenwich)", "মূল মধ্যরেখা ০° (গ্রিনিচ)")], [180, L2("180°", "১৮০°")], [-180, ""]].map(([lo, t]) => `<line y1="${m.vy}" y2="${m.vy + m.vh}" x1="${m.X(lo)}" x2="${m.X(lo)}" stroke="var(--ink)" stroke-width="${fs / 7}" stroke-dasharray="${lo ? fs / 2 + " " + fs / 3 : ""}"/>${t ? `<text x="${m.X(lo) + (lo ? -fs / 3 : fs / 3)}" y="${m.vy + m.vh - fs / 2}" font-size="${fs * .82}" text-anchor="${lo ? "end" : "start"}" fill="var(--ink)" paint-order="stroke" stroke="var(--g-sea)" stroke-width="${fs / 5}">${t}</text>` : ""}`).join("");
        h += `<line y1="${m.vy}" y2="${m.vy + m.vh}" x1="${m.X(v)}" x2="${m.X(v)}" stroke="var(--bad)" stroke-width="${fs / 5}"/>` + m.dot(90.4, 23.7, "var(--c)") + m.label(90.4, 23.7, L2("Dhaka", "ঢাকা"), { dy: -fs * .6, k: .9 });
        const a = Math.abs(v), mins = a * 4, hh = Math.floor(mins / 60), mm = mins % 60;
        $("#g3l-v-v", el).textContent = B(a) + "° " + (v > 0 ? L2("E", "পূ") : v < 0 ? L2("W", "প") : "");
        $("#g3l-c", el).innerHTML = `<p><b>${B(a)}° ${v > 0 ? L2("east", "পূর্ব") : v < 0 ? L2("west", "পশ্চিম") : ""} ${L2("longitude", "দ্রাঘিমা")}</b>: ${v === 0 ? L2("the prime meridian through Greenwich, from which all longitudes are measured.", "গ্রিনিচের ওপর দিয়ে যাওয়া মূল মধ্যরেখা; এখান থেকেই সব দ্রাঘিমা মাপা হয়।") : a === 180 ? L2("180° east and 180° west are the same line, on the opposite side of the Earth from Greenwich.", "১৮০° পূর্ব ও ১৮০° পশ্চিম একই রেখা, গ্রিনিচের ঠিক উল্টো পাশে।") : L2(`${a}° ${v > 0 ? "east" : "west"} of Greenwich.`, `গ্রিনিচ থেকে ${B(a)}° ${v > 0 ? "পূর্বে" : "পশ্চিমে"}।`)}</p><p>${v === 0 ? "" : L2(`Local time here is ${hh ? hh + " h " : ""}${mm ? mm + " min " : ""}${v > 0 ? "ahead of" : "behind"} Greenwich (${a}° × 4 minutes).`, `এখানকার স্থানীয় সময় গ্রিনিচের চেয়ে ${hh ? B(hh) + " ঘণ্টা " : ""}${mm ? B(mm) + " মিনিট " : ""}${v > 0 ? "এগিয়ে" : "পিছিয়ে"} (${B(a)}° × ৪ মিনিট)।`)} ${L2("All meridians are half circles of the same length, meeting at the two poles.", "সব দ্রাঘিমারেখা সমান দৈর্ঘ্যের অর্ধবৃত্ত; দুই মেরুতে গিয়ে মিলেছে।")}</p>`;
      }
      m.draw(h);
    };
    chips(el, ".g3l-m", k => { mode = k; render(); }); render();
  }).catch(() => {});
};

/* 3.2.3 longitude difference -> time difference */
W.g3time = (el) => {
  const C = [["dhaka", L2("Dhaka", "ঢাকা"), 90], ["seoul", L2("Seoul", "সিউল"), 128], ["chennai", L2("Chennai", "চেন্নাই"), 80.25], ["green", L2("Greenwich", "গ্রিনিচ"), 0], ["tokyo", L2("Tokyo", "টোকিও"), 139.75], ["ny", L2("New York", "নিউইয়র্ক"), -74]];
  let b = 128;
  el.innerHTML = `<p class="hint" style="margin:0 0 6px">${L2("It is exactly 12 noon at Dhaka (90° E). Choose the other place:", "ঢাকায় (৯০° পূ) এখন ঠিক দুপুর ১২টা। অন্য স্থানটি বেছে নাও:")}</p>` + chipHtml("g3t-c", C.slice(1).map(c => [c[0], c[1]]), "seoul") + slider("g3t-b", L2("or set its longitude", "অথবা এর দ্রাঘিমা ঠিক করো"), -180, 180, 0.25, 128, "°") + `<div class="g3t-map"></div><div class="g-card" id="g3t-o" style="margin-top:8px"></div><div class="g-src">${SRC.world()}</div>`;
  const dms = v => { const a = Math.abs(v), d = Math.floor(a), mi = Math.round((a - d) * 60); return B(d) + "°" + (mi ? " " + B(mi) + "′" : "") + " " + (v >= 0 ? L2("E", "পূ") : L2("W", "প")); };
  const clock = mins => { mins = ((mins % 1440) + 1440) % 1440; const h = Math.floor(mins / 60), mi = Math.round(mins % 60); const h12 = h % 12 === 0 ? 12 : h % 12; const part = L2(h < 12 ? "a.m." : "p.m.", h < 5 ? "রাত" : h < 12 ? "সকাল" : h < 16 ? "দুপুর" : h < 18 ? "বিকেল" : h < 20 ? "সন্ধ্যা" : "রাত"); return L2(`${h12}:${String(mi).padStart(2, "0")} ${part}`, `${part} ${B(h12)}টা${mi ? " " + B(mi) + " মিনিট" : ""}`); };
  worldMap($(".g3t-map", el), { view: [-180, 180, -58, 80], grid: 15, zoom: false }).then(m => {
    const upd = () => {
      b = +$("#g3t-b", el).value; $("#g3t-b-v", el).textContent = dms(b);
      const diff = b - 90, mins = diff * 4, fs = m.fs;
      const a = Math.abs(diff), dh = Math.floor(Math.abs(mins) / 60), dm = Math.round(Math.abs(mins) % 60), day = 720 + mins < 0 ? L2(" (the previous day)", " (আগের দিন)") : 720 + mins >= 1440 ? L2(" (the next day)", " (পরের দিন)") : "";
      m.draw(`<line y1="${m.vy}" y2="${m.vy + m.vh}" x1="${m.X(90)}" x2="${m.X(90)}" stroke="var(--c)" stroke-width="${fs / 5}"/><line y1="${m.vy}" y2="${m.vy + m.vh}" x1="${m.X(b)}" x2="${m.X(b)}" stroke="var(--bad)" stroke-width="${fs / 5}"/>
        <circle cx="${m.X(90)}" cy="${m.vy + fs * 1.3}" r="${fs * .8}" fill="#f2b632"/>${m.label(90, 23.7, L2("Dhaka 12:00", "ঢাকা ১২টা"), { dy: fs * 2.2, col: "var(--c)", k: .95 })}
        <text x="${m.X(b)}" y="${m.vy + m.vh - fs * .6}" font-size="${fs}" font-weight="700" text-anchor="middle" fill="var(--bad)" paint-order="stroke" stroke="var(--g-sea)" stroke-width="${fs / 4}">${clock(720 + mins)}</text>
        <path d="M${m.X(90)} ${m.Y(-40)} H${m.X(b)}" stroke="var(--ink)" stroke-width="${fs / 8}" fill="none"/><text x="${(m.X(90) + m.X(b)) / 2}" y="${m.Y(-40) - fs * .4}" font-size="${fs * .9}" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--g-sea)" stroke-width="${fs / 4}">${B(+a.toFixed(2))}°</text>`);
      $("#g3t-o", el).innerHTML = diff === 0 ? `<p>${L2("Same meridian as Dhaka, so the local time is the same: 12 noon.", "ঢাকার সাথে একই মধ্যরেখায়, তাই স্থানীয় সময়ও একই: দুপুর ১২টা।")}</p>` : list([
        L2(`Difference of longitude = ${+a.toFixed(2)}°`, `দ্রাঘিমার পার্থক্য = ${B(+a.toFixed(2))}°`),
        L2(`Difference of time = ${+a.toFixed(2)} × 4 = ${+(a * 4).toFixed(0)} minutes = ${dh ? dh + " h " : ""}${dm} min`, `সময়ের পার্থক্য = ${B(+a.toFixed(2))} × ৪ = ${B(+(a * 4).toFixed(0))} মিনিট = ${dh ? B(dh) + " ঘণ্টা " : ""}${B(dm)} মিনিট`),
        L2(`The place is ${diff > 0 ? "east of Dhaka, so its time is ahead: add" : "west of Dhaka, so its time is behind: subtract"}.`, `স্থানটি ঢাকার ${diff > 0 ? "পূর্বে, তাই সময় এগিয়ে: যোগ করো" : "পশ্চিমে, তাই সময় পিছিয়ে: বিয়োগ করো"}।`),
        `<b>${L2("Local time there", "সেখানকার স্থানীয় সময়")}: ${clock(720 + mins)}${day}</b>`], true);
    };
    $("#g3t-b", el).addEventListener("input", () => { el.querySelectorAll(".g3t-c button").forEach(q => q.setAttribute("aria-pressed", false)); upd(); });
    chips(el, ".g3t-c", k => { $("#g3t-b", el).value = C.find(c => c[0] === k)[2]; upd(); }); upd();
  }).catch(() => {});
};

/* 3.2.4 antipode: tap the map or move the sliders */
W.g3antipode = (el) => {
  el.innerHTML = `<div class="g3n-map"></div>` + slider("g3n-la", L2("Latitude of the place", "স্থানটির অক্ষাংশ"), -80, 80, 0.5, 23.5, "°") + slider("g3n-lo", L2("Longitude of the place", "স্থানটির দ্রাঘিমা"), -180, 180, 1, 90, "°") + `<div class="g-card" id="g3n-o"></div><div class="g-src">${SRC.world()}</div>`;
  worldMap($(".g3n-map", el), { view: [-180, 180, -86, 86], grid: 30, zoom: false }).then(m => {
    const ns = v => B(Math.abs(v)) + "° " + (v > 0 ? L2("N", "উ") : v < 0 ? L2("S", "দ") : ""), ew = v => B(Math.abs(v)) + "° " + (v > 0 ? L2("E", "পূ") : v < 0 ? L2("W", "প") : "");
    const upd = () => {
      const la = +$("#g3n-la", el).value, lo = +$("#g3n-lo", el).value, ala = -la, alo = lo > 0 ? lo - 180 : lo + 180, fs = m.fs;
      $("#g3n-la-v", el).textContent = ns(la); $("#g3n-lo-v", el).textContent = ew(lo);
      m.draw(`<line x1="${m.vx}" x2="${m.vx + m.vw}" y1="${m.Y(0)}" y2="${m.Y(0)}" stroke="var(--ink)" stroke-width="${fs / 9}"/>` + m.dot(lo, la, "var(--c)", 1.5) + m.label(lo, la, L2("place", "স্থান"), { dy: -fs * .7, col: "var(--c)" }) + m.dot(alo, ala, "var(--bad)", 1.5) + m.label(alo, ala, L2("antipode", "প্রতিপাদ স্থান"), { dy: fs * 1.5, col: "var(--bad)" }));
      $("#g3n-o", el).innerHTML = list([
        L2(`Latitude: same number, opposite hemisphere: ${ns(la)} → <b>${ns(ala)}</b>`, `অক্ষাংশ: সংখ্যা একই, গোলার্ধ উল্টো: ${ns(la)} → <b>${ns(ala)}</b>`),
        L2(`Longitude: 180° − ${Math.abs(lo)}° = ${180 - Math.abs(lo)}°, on the other side: ${ew(lo)} → <b>${ew(alo)}</b>`, `দ্রাঘিমা: ১৮০° − ${B(Math.abs(lo))}° = ${B(180 - Math.abs(lo))}°, উল্টো দিকে: ${ew(lo)} → <b>${ew(alo)}</b>`),
        L2("The two places are 12 hours apart in time: noon here is midnight there.", "দুই স্থানের সময়ের পার্থক্য ১২ ঘণ্টা: এখানে দুপুর হলে সেখানে মধ্যরাত।")], true) + (Math.abs(la - 23.5) < 2 && Math.abs(lo - 90) < 3 ? `<p>${L2("This is about where Dhaka is. Its antipode falls in the Pacific Ocean near Chile in South America.", "এটি প্রায় ঢাকার অবস্থান। এর প্রতিপাদ স্থান দক্ষিণ আমেরিকার চিলির কাছে প্রশান্ত মহাসাগরে।")}</p>` : "");
    };
    m.svg.addEventListener("click", e => { const r = m.svg.getBoundingClientRect(); const lon = (m.vx + (e.clientX - r.left) / r.width * m.vw) / 2 - 180, lat = 90 - (m.vy + (e.clientY - r.top) / r.height * m.vh) / 2; $("#g3n-la", el).value = Math.max(-80, Math.min(80, Math.round(lat))); $("#g3n-lo", el).value = Math.round(lon); upd(); });
    m.svg.style.cursor = "crosshair";
    el.querySelectorAll("input").forEach(i => i.addEventListener("input", upd)); upd();
  }).catch(() => {});
};

/* 3.2.5 crossing the International Date Line */
W.g3idl = (el) => {
  el.innerHTML = `<div class="g3d-map"></div><div id="g3d-st" style="margin-top:8px"></div><div class="g-card" id="g3d-c" style="margin-top:8px"></div><div class="g-src">${SRC.world()}</div>`;
  worldMap($(".g3d-map", el), { view: [120, 240, -58, 74], grid: 15, zoom: false }).then(m => {
    const fs = m.fs, X = m.X;
    const base = `<line y1="${m.vy}" y2="${m.vy + m.vh}" x1="${X(180)}" x2="${X(180)}" stroke="var(--muted)" stroke-width="${fs / 8}" stroke-dasharray="${fs / 2} ${fs / 3}"/>
      ${m.G0}<path d="${m.d.idl}" fill="none" stroke="var(--bad)" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>
      ${m.label(180, 70, L2("180°", "১৮০°"), { dx: -fs * 1.4, k: .85, col: "var(--muted)" })}
      ${m.dot(178.44, -18.13, "var(--ink)", .8)}${m.label(178.44, -18.13, L2("Fiji", "ফিজি"), { anchor: "end", dx: -fs * .5, dy: fs * .3, k: .85 })}
      ${m.dot(-171.74 + 360, -13.84, "var(--ink)", .8)}${m.label(-171.74 + 360, -13.84, L2("Samoa", "সামোয়া"), { anchor: "start", dx: fs * .5, dy: fs * .3, k: .85 })}
      ${m.dot(-157.86 + 360, 21.31, "var(--ink)", .8)}${m.label(-157.86 + 360, 21.31, L2("Hawaii", "হাওয়াই"), { anchor: "start", dx: fs * .5, dy: fs * .3, k: .85 })}
      ${m.label(184, 52, L2("Aleutian Islands", "অ্যালিউশিয়ান দ্বীপপুঞ্জ"), { k: .8, dy: fs * 1.3 })}${m.label(183.5, -44, L2("Chatham Is.", "চ্যাথাম দ্বীপপুঞ্জ"), { k: .8, anchor: "start", dx: fs * .4 })}
      ${m.label(140, 38, L2("Asia", "এশিয়া"), { k: 1.1, col: "var(--muted)", dy: fs * 2 })}${m.label(232, 46, L2("N. America", "উ. আমেরিকা"), { k: .9, col: "var(--muted)", anchor: "end", dx: fs * 1.5 })}`;
    const ST = [
      [null, L2("The red line is the International Date Line. It follows the 180° meridian, but bends so that it stays over water and does not cut through island groups or land. The map shows the line as it is today; the big eastward bend in the middle was made later for the island country Kiribati, so your textbook's figure looks simpler.", "লাল রেখাটি আন্তর্জাতিক তারিখ রেখা। এটি ১৮০° দ্রাঘিমারেখা ধরে গেছে, তবে বেঁকে বেঁকে পুরোটাই জলভাগের ওপর দিয়ে গেছে, যাতে কোনো দ্বীপপুঞ্জ বা স্থলভাগ দু-ভাগ না হয়। মানচিত্রে রেখাটির এখনকার রূপ দেখানো হয়েছে; মাঝখানের বড় পূর্বমুখী বাঁকটি দ্বীপদেশ কিরিবাতির জন্য পরে করা, তাই বইয়ের ছবিতে রেখাটি আরও সরল।")],
      [[0, 0], L2("When it is 10 a.m. Monday at Greenwich: going east, 180° is 12 hours ahead, so it is 10 p.m. Monday. Going west, 180° is 12 hours behind, so it is 10 p.m. Sunday. One line, two different days!", "গ্রিনিচে যখন সোমবার সকাল ১০টা: পূর্ব দিকে গেলে ১৮০°-তে ১২ ঘণ্টা বেশি, অর্থাৎ সোমবার রাত ১০টা। পশ্চিম দিকে গেলে ১২ ঘণ্টা কম, অর্থাৎ রবিবার রাত ১০টা। একই রেখায় দুটি আলাদা দিন!")],
      [[1, 0], L2("A ship sails east (from Asia towards America) and crosses the line. It has moved from the Monday side to the Sunday side, so it subtracts one day: Monday becomes Sunday.", "একটি জাহাজ পূর্ব দিকে (এশিয়া থেকে আমেরিকার দিকে) গিয়ে রেখাটি পার হলো। সে সোমবারের পাশ থেকে রবিবারের পাশে এল, তাই এক দিন বিয়োগ করে: সোমবার হয়ে যায় রবিবার।")],
      [[-1, 0], L2("A ship sails west (from America towards Asia) and crosses the line. It has moved from the Sunday side to the Monday side, so it adds one day: Sunday becomes Monday.", "একটি জাহাজ পশ্চিম দিকে (আমেরিকা থেকে এশিয়ার দিকে) গিয়ে রেখাটি পার হলো। সে রবিবারের পাশ থেকে সোমবারের পাশে এল, তাই এক দিন যোগ করে: রবিবার হয়ে যায় সোমবার।")]];
    stepper($("#g3d-st", el), ST.length, i => {
      let h = base;
      if (i >= 1) h += `<g font-size="${fs * 1.05}" font-weight="700" text-anchor="middle"><rect x="${X(150) - fs * 4}" y="${m.Y(5) - fs * 1.3}" width="${fs * 8}" height="${fs * 2}" rx="${fs / 2}" fill="var(--sheet)" stroke="var(--c)" stroke-width="${fs / 8}"/><text x="${X(150)}" y="${m.Y(5)}" fill="var(--c)">${L2("Monday", "সোমবার")}</text>
        <rect x="${X(212) - fs * 4}" y="${m.Y(5) - fs * 1.3}" width="${fs * 8}" height="${fs * 2}" rx="${fs / 2}" fill="var(--sheet)" stroke="var(--bad)" stroke-width="${fs / 8}"/><text x="${X(212)}" y="${m.Y(5)}" fill="var(--bad)">${L2("Sunday", "রবিবার")}</text></g>`;
      if (i >= 2) { const dir = ST[i][0][0], y = m.Y(-32), x1 = X(dir > 0 ? 160 : 202), x2 = X(dir > 0 ? 202 : 160); h += `<path d="M${x1} ${y} H${x2}" stroke="var(--ink)" stroke-width="${fs / 4}" fill="none"/><path d="M${x2} ${y} l${-dir * fs} ${-fs * .6} v${fs * 1.2} z" fill="var(--ink)"/><text x="${X(181)}" y="${y - fs * .7}" font-size="${fs}" font-weight="700" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--g-sea)" stroke-width="${fs / 4}">${dir > 0 ? L2("eastward: − 1 day", "পূর্বগামী: − ১ দিন") : L2("westward: + 1 day", "পশ্চিমগামী: + ১ দিন")}</text>`; }
      m.draw(h); $("#g3d-c", el).innerHTML = `<p>${ST[i][1]}</p>`;
    }, { ms: 4200 });
  }).catch(() => {});
};

/* 3.3.1 the Earth turning from west to east, seen from above the North Pole */
W.g3daynight = (el) => {
  let hr = 12, run = false;
  el.innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 230" role="img" aria-label="${L2("Day and night", "দিন ও রাত")}"><g id="g3dn"></g></svg></div>` + slider("g3dn-h", L2("Time at the red place", "লাল স্থানটির সময়"), 0, 24, 0.25, 12, "") + `<div class="w-row"><button type="button" class="btn" id="g3dn-run"></button></div><div class="g-card" id="g3dn-c" style="margin-top:8px"></div>`;
  const cx = 150, cy = 115, R = 78;
  const draw = () => {
    const a = rad((hr - 12) * 15), x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);   // noon faces the Sun (right); anticlockwise = west to east
    const names = hr < 4.5 ? L2("Night", "রাত") : hr < 5.5 ? L2("Dawn: faint light before sunrise", "ঊষা: সূর্যোদয়ের আগের ক্ষীণ আলো") : hr < 6.5 ? L2("Morning: the place crosses the shadow circle into the light", "প্রভাত: স্থানটি ছায়াবৃত্ত পার হয়ে আলোতে এল") : hr < 11.5 ? L2("Daytime", "দিন") : hr < 12.5 ? L2("Noon: the Sun is highest in the sky", "মধ্যাহ্ন: সূর্য আকাশের সবচেয়ে উঁচুতে") : hr < 17.5 ? L2("Afternoon", "বিকেল") : hr < 18.5 ? L2("Evening: the place crosses the shadow circle into the dark", "সন্ধ্যা: স্থানটি ছায়াবৃত্ত পার হয়ে অন্ধকারে গেল") : hr < 19.5 ? L2("Twilight: faint light lingers", "গোধূলি: ক্ষীণ আলো রয়ে গেছে") : L2("Night", "রাত");
    $("#g3dn", el).innerHTML = `<rect width="360" height="230" fill="#0f1a2c" rx="10"/>
      <g stroke="#f2b632" stroke-width="2" opacity=".8">${[40, 78, 115, 152, 190].map(yy => `<line x1="352" y1="${yy}" x2="${cx + 96}" y2="${yy}"/><path d="M${cx + 104} ${yy - 5} l-9 5 l9 5" fill="none"/>`).join("")}</g>
      <text x="350" y="20" font-size="12" fill="#f2b632" text-anchor="end">${L2("sunlight", "সূর্যের আলো")}</text>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="#1c2f4a"/><path d="M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx} ${cy + R} Z" fill="#7fb7e6"/>
      <line x1="${cx}" y1="${cy - R - 12}" x2="${cx}" y2="${cy + R + 12}" stroke="#fff" stroke-dasharray="4 4"/><text x="${cx - 6}" y="${cy + R + 26}" font-size="12.5" fill="#cfd6e6" text-anchor="middle">${L2("shadow circle", "ছায়াবৃত্ত")}</text>
      <circle cx="${cx}" cy="${cy}" r="3" fill="#fff"/><text x="${cx}" y="${cy + 17}" font-size="12.5" fill="#fff" text-anchor="middle">${L2("North Pole", "উত্তর মেরু")}</text>
      <path d="M${cx - 34} ${cy - 30} A46 46 0 0 0 ${cx - 34} ${cy + 30}" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M${cx - 39} ${cy + 22} l5 9 l6 -8" fill="none" stroke="#fff" stroke-width="1.6"/>
      <text x="10" y="22" font-size="12.5" fill="#cfd6e6">${L2("turning west → east", "ঘুরছে পশ্চিম → পূর্ব")}</text>
      <text x="${cx - R - 8}" y="${cy + 4}" font-size="12.5" fill="#cfd6e6" text-anchor="end">${L2("midnight", "মধ্যরাত")}</text>
      <circle cx="${x}" cy="${y}" r="7" fill="#e0483a" stroke="#fff" stroke-width="2"/>`;
    const h = Math.floor(hr), mi = Math.round((hr - h) * 60);
    $("#g3dn-h-v", el).textContent = B(String(h % 24).padStart(2, "0")) + ":" + B(String(mi).padStart(2, "0"));
    $("#g3dn-c", el).innerHTML = `<p><b>${names}</b></p><p>${L2("The lit half has day and the dark half has night. As the Earth turns, every place is carried from light into dark and back again in about 24 hours.", "আলোকিত অর্ধেকে দিন, অন্ধকার অর্ধেকে রাত। পৃথিবী ঘোরে বলে প্রতিটি স্থান প্রায় ২৪ ঘণ্টায় একবার আলো থেকে অন্ধকারে গিয়ে আবার আলোয় ফেরে।")}</p>`;
    $("#g3dn-run", el).textContent = run ? L2("❚❚ Pause", "❚❚ থামাও") : L2("▶ Spin the Earth", "▶ পৃথিবী ঘোরাও");
  };
  $("#g3dn-h", el).addEventListener("input", () => { hr = +$("#g3dn-h", el).value; draw(); });
  $("#g3dn-run", el).addEventListener("click", () => { run = !run; draw(); });
  animate(el, dt => { if (run) { hr = (hr + dt * 2.4) % 24; $("#g3dn-h", el).value = hr; draw(); } });
  draw();
};

/* 3.3.2 / 3.3.3 / 3.3.4 four positions of the Earth on its orbit */
W.g3orbit = (el, lang, L) => {
  const id = L && L.id || "3.3.4";
  const POS = [
    { k: "jun", date: L2("21 June", "২১শে জুন"), name: L2("Summer solstice (northern solstice)", "উত্তর অয়নান্ত"), dec: 23.5, x: 52, y: 92, tilt: 23.5, sun: 1,
      ray: L2("Rays fall vertically on the Tropic of Cancer (23.5° N)", "সূর্যরশ্মি কর্কটক্রান্তি রেখায় (২৩.৫° উ) লম্বভাবে পড়ে"), dn: L2("Northern hemisphere: longest day, shortest night. Southern hemisphere: the opposite. 24-hour day north of the Arctic Circle; 24-hour night south of the Antarctic Circle.", "উত্তর গোলার্ধে দীর্ঘতম দিন, ক্ষুদ্রতম রাত। দক্ষিণ গোলার্ধে উল্টো। সুমেরুবৃত্তের উত্তরে ২৪ ঘণ্টা দিন; কুমেরুবৃত্তের দক্ষিণে ২৪ ঘণ্টা রাত।"), sn: L2("Summer in the north, winter in the south", "উত্তর গোলার্ধে গ্রীষ্মকাল, দক্ষিণ গোলার্ধে শীতকাল") },
    { k: "sep", date: L2("23 September", "২৩শে সেপ্টেম্বর"), name: L2("Equinox", "বিষুব"), dec: 0, x: 180, y: 150, tilt: 0, sun: 0,
      ray: L2("Rays fall vertically on the equator", "সূর্যরশ্মি নিরক্ষরেখায় লম্বভাবে পড়ে"), dn: L2("Both poles are equally far from the Sun. Day and night are equal everywhere on the Earth.", "দুই মেরু সূর্য থেকে সমান দূরে। পৃথিবীর সর্বত্র দিন ও রাত সমান।"), sn: L2("Autumn in the north, spring in the south", "উত্তর গোলার্ধে শরৎকাল, দক্ষিণ গোলার্ধে বসন্তকাল") },
    { k: "dec", date: L2("22 December", "২২শে ডিসেম্বর"), name: L2("Winter solstice (southern solstice)", "দক্ষিণ অয়নান্ত"), dec: -23.5, x: 308, y: 92, tilt: 23.5, sun: -1,
      ray: L2("Rays fall vertically on the Tropic of Capricorn (23.5° S)", "সূর্যরশ্মি মকরক্রান্তি রেখায় (২৩.৫° দ) লম্বভাবে পড়ে"), dn: L2("Southern hemisphere: longest day, shortest night. Northern hemisphere: shortest day, longest night.", "দক্ষিণ গোলার্ধে দীর্ঘতম দিন, ক্ষুদ্রতম রাত। উত্তর গোলার্ধে ক্ষুদ্রতম দিন, দীর্ঘতম রাত।"), sn: L2("Winter in the north, summer in the south", "উত্তর গোলার্ধে শীতকাল, দক্ষিণ গোলার্ধে গ্রীষ্মকাল") },
    { k: "mar", date: L2("21 March", "২১শে মার্চ"), name: L2("Vernal equinox", "বাসন্ত বিষুব"), dec: 0, x: 180, y: 38, tilt: 0, sun: 0,
      ray: L2("Rays fall vertically on the equator", "সূর্যরশ্মি নিরক্ষরেখায় লম্বভাবে পড়ে"), dn: L2("Both poles are again equally far from the Sun. Day and night are equal everywhere.", "দুই মেরু আবার সূর্য থেকে সমান দূরে। সর্বত্র দিন ও রাত সমান।"), sn: L2("Spring in the north, autumn in the south", "উত্তর গোলার্ধে বসন্তকাল, দক্ষিণ গোলার্ধে শরৎকাল") }];
  let lat = 23.5;
  const dayLen = (la, dec) => { const v = -Math.tan(rad(la)) * Math.tan(rad(dec)); return v >= 1 ? 0 : v <= -1 ? 24 : 2 * Math.acos(v) * 180 / Math.PI / 15; };
  el.innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 318" role="img" aria-label="${L2("The Earth's orbit", "পৃথিবীর কক্ষপথ")}"><g id="g3o"></g></svg></div><div id="g3o-st"></div>` + (id === "3.3.3" ? slider("g3o-la", L2("Latitude of your place", "তোমার স্থানের অক্ষাংশ"), -90, 90, 0.5, 23.5, "°") + `<div id="g3o-bar"></div>` : "") + `<div class="g-card" id="g3o-c" style="margin-top:8px"></div>`;
  const earth = (x, y, r, tiltDeg, on) => `<g transform="rotate(${tiltDeg} ${x} ${y})"><line x1="${x}" y1="${y - r - 7}" x2="${x}" y2="${y + r + 7}" stroke="var(--ink)" stroke-width="1.2"/></g><circle cx="${x}" cy="${y}" r="${r}" fill="#3f84c4" stroke="${on ? "var(--bad)" : "var(--sheet)"}" stroke-width="${on ? 2.5 : 1}"/>`;
  let cur = 0;
  const render = i => {
    cur = i; const p = POS[i];
    // top: the orbit (sketch). bottom: side view of the Earth with the Sun's rays coming from the right
    let h = `<ellipse cx="180" cy="94" rx="128" ry="56" fill="none" stroke="var(--rule)" stroke-width="1.5"/><circle cx="180" cy="94" r="17" fill="#f2b632"/><text x="180" y="98" font-size="12.5" text-anchor="middle" fill="#3a2a00" font-weight="700">${L2("Sun", "সূর্য")}</text>`;
    h += POS.map((q, j) => `<g data-i="${j}" style="cursor:pointer"><circle cx="${q.x}" cy="${q.y}" r="24" fill="transparent"/>${earth(q.x, q.y, 10, 23.5, j === i)}<text x="${q.x}" y="${q.y + (j === 3 ? -22 : 31)}" font-size="12.5" text-anchor="middle" fill="var(--ink)" font-weight="${j === i ? 700 : 500}">${q.date}</text></g>`).join("");
    h += `<path d="M96 138 q28 14 60 16" fill="none" stroke="var(--muted)" stroke-width="1.2"/><path d="M150 149 l8 5 l-9 4" fill="none" stroke="var(--muted)" stroke-width="1.2"/>`;
    if (id === "3.3.2") h += `<text x="12" y="16" font-size="12.5" fill="var(--muted)">${L2("Aphelion (farthest): 1–4 July", "অপসূর (সবচেয়ে দূরে): ১-৪ জুলাই")}</text><text x="348" y="16" font-size="12.5" fill="var(--muted)" text-anchor="end">${L2("Perihelion (nearest): 1–3 January", "অনুসূর (সবচেয়ে কাছে): ১-৩ জানুয়ারি")}</text>`;
    // close-up
    const ex = 132, ey = 250, R = 46, t = p.sun * 23.5;                 // axis leans towards the Sun (right) in June, away in December, sideways at the equinoxes
    const pt = (la, side) => { const a = rad(la); const lx = side * R * Math.cos(a), ly = -R * Math.sin(a); const c = Math.cos(rad(t)), s = Math.sin(rad(t)); return [ex + lx * c - ly * s, ey + lx * s + ly * c]; };
    const lineLat = (la, col, w, dash) => { const a = pt(la, -1), b = pt(la, 1); return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`; };
    h += `<rect x="6" y="184" width="348" height="130" rx="10" fill="#0f1a2c"/><clipPath id="g3o-clip"><circle cx="${ex}" cy="${ey}" r="${R}"/></clipPath>
      <circle cx="${ex}" cy="${ey}" r="${R}" fill="#1c2f4a"/><rect x="${ex}" y="${ey - R}" width="${R}" height="${2 * R}" fill="#7fb7e6" clip-path="url(#g3o-clip)"/>
      <g clip-path="url(#g3o-clip)">${lineLat(0, "#fff", 1.6)}${lineLat(23.5, "#ffd27a", 1, "3 3")}${lineLat(-23.5, "#ffd27a", 1, "3 3")}${lineLat(66.5, "#cfe6ff", 1, "2 3")}${lineLat(-66.5, "#cfe6ff", 1, "2 3")}${id === "3.3.3" ? lineLat(lat, "#ff6b5e", 2.4) : ""}</g>
      <g transform="rotate(${t} ${ex} ${ey})"><line x1="${ex}" y1="${ey - R - 12}" x2="${ex}" y2="${ey + R + 12}" stroke="#fff" stroke-width="1.6"/><text x="${ex}" y="${ey - R - 15}" font-size="12.5" fill="#fff" text-anchor="middle">${L2("N", "উ")}</text></g>
      <g stroke="#f2b632" stroke-width="1.8">${[-30, -10, 10, 30].map(d => `<line x1="346" y1="${ey + d}" x2="${ex + R + 14}" y2="${ey + d}"/><path d="M${ex + R + 21} ${ey + d - 4} l-8 4 l8 4" fill="none"/>`).join("")}</g>
      <circle cx="${pt(p.dec, 1)[0] + (p.sun === 0 ? 0 : 0)}" cy="${pt(p.dec, 1)[1]}" r="4" fill="#f2b632" stroke="#fff"/>
      <text x="346" y="202" font-size="12.5" fill="#f2b632" text-anchor="end">${L2("Sun's rays →  side view", "সূর্যের রশ্মি → পাশ থেকে দেখা")}</text>
      <text x="${ex + R + 26}" y="${ey + 52}" font-size="12.5" fill="#cfd6e6">${p.sun === 0 ? L2("axis leans sideways", "অক্ষ পাশের দিকে হেলে") : p.sun > 0 ? L2("N pole leans to the Sun", "উ. মেরু সূর্যের দিকে হেলে") : L2("N pole leans away", "উ. মেরু উল্টো দিকে হেলে")}</text>`;
    $("#g3o", el).innerHTML = h;
    $("#g3o", el).querySelectorAll("[data-i]").forEach(g => g.addEventListener("click", () => st.go(+g.dataset.i)));
    let body = `<p>${p.ray}.</p>`;
    if (id === "3.3.2") body += `<p>${L2("The Earth goes round the Sun along an oval (elliptical) path at about 30 km every second, always leaning the same way. One full trip takes 365 days 5 hours 48 minutes 47 seconds: a solar year.", "পৃথিবী একটি উপবৃত্তাকার পথে সেকেন্ডে প্রায় ৩০ কিমি বেগে সূর্যকে ঘোরে; অক্ষ সবসময় একই দিকে হেলে থাকে। একবার ঘুরতে লাগে ৩৬৫ দিন ৫ ঘণ্টা ৪৮ মিনিট ৪৭ সেকেন্ড: এক সৌরবছর।")}</p>`;
    else if (id === "3.3.3") body += `<p>${p.dn}</p>`;
    else body += `<p><b>${p.sn}.</b> ${L2("Where the rays fall straight down the ground gets most heat; where they slant, the same heat is spread over more ground.", "যেখানে রশ্মি খাড়াভাবে পড়ে সেখানে তাপ বেশি; যেখানে তির্যকভাবে পড়ে, সেখানে একই তাপ বেশি জায়গায় ছড়িয়ে যায়।")}</p>`;
    $("#g3o-c", el).innerHTML = card(`${p.date}: ${p.name}`, body);
    if (id === "3.3.3") {
      const d = dayLen(lat, p.dec), hh = Math.floor(d), mm = Math.round((d - hh) * 60);
      $("#g3o-la-v", el).textContent = B(Math.abs(lat)) + "° " + (lat > 0 ? L2("N", "উ") : lat < 0 ? L2("S", "দ") : "");
      $("#g3o-bar", el).innerHTML = `<div style="display:flex;height:22px;border-radius:99px;overflow:hidden;border:1px solid var(--rule);margin:4px 0"><span style="width:${100 * d / 24}%;background:#f2c14e"></span><span style="flex:1;background:#27354f"></span></div><div class="hint">${d >= 24 ? L2("24-hour day: the Sun does not set", "২৪ ঘণ্টা দিন: সূর্য অস্ত যায় না") : d <= 0 ? L2("24-hour night: the Sun does not rise", "২৪ ঘণ্টা রাত: সূর্য ওঠে না") : L2(`Day about ${hh} h ${mm} min, night about ${23 - hh + (mm ? 0 : 1)} h ${mm ? 60 - mm : 0} min (calculated from the geometry; the red line in the picture is your latitude)`, `দিন প্রায় ${B(hh)} ঘণ্টা ${B(mm)} মিনিট, রাত প্রায় ${B(23 - hh + (mm ? 0 : 1))} ঘণ্টা ${B(mm ? 60 - mm : 0)} মিনিট (জ্যামিতি থেকে হিসাব করা; ছবির লাল রেখাটি তোমার অক্ষাংশ)`)}</div>`;
    }
  };
  const st = stepper($("#g3o-st", el), 4, render, { ms: 3200 });
  if (id === "3.3.3") $("#g3o-la", el).addEventListener("input", () => { lat = +$("#g3o-la", el).value; render(cur); });
};

/* 3.4.1 the Moon pulls the sea into two bulges */
W.g3tide = (el) => {
  let a = 0;
  el.innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 250" role="img" aria-label="${L2("High and low tide", "জোয়ার ও ভাটা")}"><g id="g3td"></g></svg></div>` + slider("g3td-a", L2("Move the Moon round the Earth", "চাঁদকে পৃথিবীর চারদিকে ঘোরাও"), 0, 360, 5, 0, "°") + `<div class="g-card" id="g3td-c"></div>`;
  const cx = 180, cy = 125;
  const draw = () => {
    const r = rad(a), mx = cx + 118 * Math.cos(r), my = cy - 100 * Math.sin(r), deg = -a;
    const lab = (ang, d, txt, col) => { const q = rad(a + ang); return `<text x="${cx + d * Math.cos(q)}" y="${cy - d * Math.sin(q) * .9 + (ang % 180 === 0 ? -14 : 4)}" font-size="12.5" text-anchor="middle" fill="${col}" font-weight="600" paint-order="stroke" stroke="var(--sheet)" stroke-width="3">${txt}</text>`; };
    $("#g3td", el).innerHTML = `<ellipse cx="${cx}" cy="${cy}" rx="118" ry="100" fill="none" stroke="var(--rule)" stroke-dasharray="4 5"/>
      <g transform="rotate(${deg} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="54" ry="36" fill="#6fb2e6"/></g><circle cx="${cx}" cy="${cy}" r="33" fill="#5d9a57" stroke="var(--sheet)"/><text x="${cx}" y="${cy + 4}" font-size="12" text-anchor="middle" fill="#fff" font-weight="700">${L2("Earth", "পৃথিবী")}</text>
      <line x1="${cx + 58 * Math.cos(r)}" y1="${cy - 58 * Math.sin(r) * .85}" x2="${mx - 16 * Math.cos(r)}" y2="${my + 16 * Math.sin(r)}" stroke="var(--muted)" stroke-dasharray="3 3"/>
      <circle cx="${mx}" cy="${my}" r="12" fill="#d8d8d0" stroke="var(--muted)"/><text x="${mx}" y="${my + (my < cy ? -17 : 26)}" font-size="12.5" text-anchor="middle" fill="var(--ink)">${L2("Moon", "চাঁদ")}</text>
      ${lab(0, 74, L2("direct high tide", "মুখ্য জোয়ার"), "var(--c)")}${lab(180, 76, L2("indirect high tide", "গৌণ জোয়ার"), "var(--c)")}${lab(90, 56, L2("low tide", "ভাটা"), "var(--bad)")}${lab(270, 56, L2("low tide", "ভাটা"), "var(--bad)")}`;
    $("#g3td-a-v", el).textContent = B(a) + "°";
  };
  $("#g3td-c", el).innerHTML = list(L2(["The side of the Earth facing the Moon is pulled most strongly: water gathers there. This is the direct (primary) high tide.", "On the opposite side the solid Earth is pulled towards the Moon more than the water is, and the water is left bulging outwards: the indirect (secondary) high tide.", "Water is drawn away from the places in between, so they have low tide.", "The Earth turns under these two bulges, so every coast gets two high tides and two low tides in a little more than a day. (The bulges are drawn far too big; in mid-ocean the rise is only about 1 to 3 feet.)"],
    ["পৃথিবীর যে পাশ চাঁদের দিকে, সেখানে আকর্ষণ সবচেয়ে বেশি: পানি এসে ফুলে ওঠে। এটি মুখ্য (প্রত্যক্ষ) জোয়ার।", "উল্টো পাশে পানির চেয়ে কঠিন ভূভাগ চাঁদের দিকে বেশি আকৃষ্ট হয়, ফলে পানি বাইরের দিকে ফুলে থাকে: গৌণ (পরোক্ষ) জোয়ার।", "মাঝখানের স্থানগুলো থেকে পানি সরে যায়, তাই সেখানে ভাটা।", "পৃথিবী এই দুই স্ফীতির নিচ দিয়ে ঘোরে, তাই প্রতিটি উপকূলে এক দিনের কিছু বেশি সময়ে দুবার জোয়ার ও দুবার ভাটা হয়। (ছবিতে স্ফীতি অনেক বড় করে আঁকা; মাঝসমুদ্রে পানি ওঠে মাত্র ১ থেকে ৩ ফুট।)"]), true);
  $("#g3td-a", el).addEventListener("input", () => { a = +$("#g3td-a", el).value; draw(); }); draw();
};

/* 3.4.2 spring and neap tides through one lunar month, and the timing of the tides */
W.g3spring = (el) => {
  const ST = [
    [0, L2("New moon", "অমাবস্যা"), true, L2("The Sun and the Moon are on the same side of the Earth, in one line. Their pulls add up, so the tide is very strong: a spring tide.", "সূর্য ও চাঁদ পৃথিবীর একই পাশে, একই সরলরেখায়। দুটির আকর্ষণ যোগ হয়, তাই জোয়ার খুব প্রবল: তেজ কটাল বা ভরা কটাল।")],
    [90, L2("Seventh / eighth day", "সপ্তমী / অষ্টমী তিথি"), false, L2("The Sun and the Moon are at right angles as seen from the Earth. The Moon raises a tide towards itself, but the Sun's pull works against it, so the tide is weak: a neap tide.", "পৃথিবী থেকে দেখলে সূর্য ও চাঁদ সমকোণে। চাঁদের দিকে জোয়ার হয়, কিন্তু সূর্যের আকর্ষণ তার বিপরীতে কাজ করে, তাই জোয়ার দুর্বল: মরা কটাল।")],
    [180, L2("Full moon", "পূর্ণিমা"), true, L2("The Moon is on one side of the Earth and the Sun on the other, again in one line. The tide is very strong again: a spring tide.", "পৃথিবীর এক পাশে চাঁদ, অন্য পাশে সূর্য; আবার একই সরলরেখায়। জোয়ার আবার খুব প্রবল: ভরা কটাল।")],
    [270, L2("Seventh / eighth day after full moon", "পূর্ণিমার পরের সপ্তমী / অষ্টমী"), false, L2("Right angles again: a second neap tide. So one month has two spring tides and two neap tides.", "আবার সমকোণ: দ্বিতীয় মরা কটাল। অর্থাৎ এক মাসে দুবার ভরা কটাল ও দুবার মরা কটাল হয়।")]];
  el.innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 200" role="img" aria-label="${L2("Spring and neap tides", "ভরা কটাল ও মরা কটাল")}"><g id="g3sp"></g></svg></div><div id="g3sp-st"></div><div class="g-card" id="g3sp-c" style="margin-top:8px"></div>
    <div class="g-card" style="margin-top:8px;background:var(--paper);border:1px dashed var(--rule)"><h4>${L2("Clock of the tides at one place", "একটি স্থানে জোয়ার-ভাটার সময়")}</h4><div class="g-bars">${[[0, L2("direct high tide", "মুখ্য জোয়ার"), 1], [373, L2("low tide", "ভাটা"), 0], [746, L2("indirect high tide", "গৌণ জোয়ার"), 1], [1119, L2("low tide", "ভাটা"), 0], [1492, L2("direct high tide again", "আবার মুখ্য জোয়ার"), 1]].map(([mn, t, hi]) => `<div class="row"><span>${t}</span><span class="trk"><i style="width:${hi ? 100 : 30}%;background:${hi ? "var(--c)" : "var(--faint)"}"></i></span><span class="val">+ ${B(Math.floor(mn / 60))} ${L2("h", "ঘ")} ${B(mn % 60)} ${L2("min", "মি")}</span></div>`).join("")}</div></div>`;
  const cx = 214, cy = 100;
  stepper($("#g3sp-st", el), 4, i => {
    const [ang, name, spring, txt] = ST[i]; const r = rad(180 - ang), mx = cx + 68 * Math.cos(r), my = cy - 68 * Math.sin(r);  // angle 0 = towards the Sun (left)
    $("#g3sp", el).innerHTML = `<circle cx="20" cy="${cy}" r="34" fill="#f2b632"/><text x="26" y="${cy + 4}" font-size="12" fill="#3a2a00" font-weight="700" text-anchor="middle">${L2("Sun", "সূর্য")}</text>
      <circle cx="${cx}" cy="${cy}" r="68" fill="none" stroke="var(--rule)" stroke-dasharray="4 5"/>
      <g transform="rotate(${ang} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${spring ? 52 : 40}" ry="${spring ? 30 : 34}" fill="#6fb2e6"/></g>
      <circle cx="${cx}" cy="${cy}" r="29" fill="#5d9a57" stroke="var(--sheet)"/><text x="${cx}" y="${cy + 4}" font-size="12.5" fill="#fff" text-anchor="middle" font-weight="700">${L2("Earth", "পৃথিবী")}</text>
      <circle cx="${mx}" cy="${my}" r="10" fill="#d8d8d0" stroke="var(--muted)"/><text x="${mx + (mx > cx + 30 ? 0 : 0)}" y="${my + (my > cy + 10 ? 24 : -15)}" font-size="12.5" text-anchor="middle" fill="var(--ink)">${L2("Moon", "চাঁদ")}</text>
      <line x1="56" y1="${cy}" x2="${cx - 56}" y2="${cy}" stroke="#f2b632" stroke-dasharray="3 4"/>
      <text x="352" y="18" font-size="12.5" text-anchor="end" font-weight="700" fill="${spring ? "var(--c)" : "var(--muted)"}">${spring ? L2("SPRING TIDE", "ভরা কটাল") : L2("NEAP TIDE", "মরা কটাল")}</text>`;
    $("#g3sp-c", el).innerHTML = card(name, `<p>${txt}</p>`);
  }, { ms: 3400 });
};

/* 3.4.3 where tides matter in Bangladesh */
W.g3tidebd = (el) => {
  const PT = {
    chattogram: [L2("Chattogram port", "চট্টগ্রাম বন্দর"), L2("At high tide the Karnaphuli becomes deeper, so large ships enter or leave the port. Ships wait at anchor in the estuary for the tide.", "জোয়ারের সময় কর্ণফুলীর গভীরতা বাড়ে, তখন বড় জাহাজ বন্দরে ঢোকে বা বন্দর ছাড়ে। জাহাজগুলো জোয়ারের অপেক্ষায় মোহনায় নোঙর করে থাকে।")],
    mongla: [L2("Mongla port", "মোংলা বন্দর"), L2("Here too, large ships use the deeper water of high tide to come in and go out.", "এখানেও বড় জাহাজ জোয়ারের বাড়তি গভীরতা কাজে লাগিয়ে আসা-যাওয়া করে।")],
    goalanda: [L2("Goalanda, on the Padma", "গোয়ালন্দ, পদ্মা নদীতে"), L2("The tidal water of the Bay of Bengal is felt up the Padma as far as near Goalanda.", "বঙ্গোপসাগরের জোয়ারের পানি পদ্মা নদীতে গোয়ালন্দের কাছ পর্যন্ত পৌঁছায়।")],
    bhairab: [L2("Bhairab Bazar, on the Meghna", "ভৈরব বাজার, মেঘনা নদীতে"), L2("On the Meghna the tide is felt up to near Bhairab Bazar. Strong tidal bores also occur in the Meghna.", "মেঘনা নদীতে জোয়ার ভৈরব বাজারের কাছাকাছি পর্যন্ত পৌঁছায়। মেঘনায় প্রবল বানও হয়।")] };
  el.innerHTML = `<div class="g3tb-map"></div><div class="g-card" id="g3tb-c" style="margin-top:8px"><p>${L2("Tap a red point to see how the tide matters there.", "লাল বিন্দুতে চাপ দিয়ে দেখো সেখানে জোয়ার-ভাটার কী ভূমিকা।")}</p></div><div class="g-src">${SRC.bd()}</div>`;
  bdMap($(".g3tb-map", el), { rivers: ["padma", "jamuna", "meghna", "karnaphuli"], nbLabels: false, tap: (d) => { if (d.mark) $("#g3tb-c", el).innerHTML = card(PT[d.mark][0], `<p>${PT[d.mark][1]}</p>`); } }).then(m => {
    m.marks([{ place: "chattogram", k: "chattogram", col: "var(--bad)", r: 5, anchor: "end", dx: -7 }, { place: "mongla", k: "mongla", col: "var(--bad)", r: 5, anchor: "end", dx: -7 }, { place: "goalanda", k: "goalanda", col: "var(--bad)", r: 5, anchor: "end", dx: -7 }, { place: "bhairab", k: "bhairab", col: "var(--bad)", r: 5 }]);
    m.draw(`<path d="M${m.X(90.9)} ${m.Y(21.2)} L${m.X(90.75)} ${m.Y(22.25)}" stroke="var(--c)" stroke-width="2.5" fill="none"/><path d="M${m.X(90.75) - 6} ${m.Y(22.25) + 8} L${m.X(90.75)} ${m.Y(22.25)} l7 7" stroke="var(--c)" stroke-width="2.5" fill="none"/><text x="${m.X(91.0)}" y="${m.Y(21.35)}" font-size="12.5" fill="var(--c)" font-weight="600">${L2("tide comes in", "জোয়ার ঢোকে")}</text>`);
  }).catch(() => {});
};
