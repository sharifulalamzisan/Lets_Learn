/* ---- biology chapter 5 widgets: food, nutrition and digestion ---- */
const B5 = x => bnNum(x, LANG);
const F5 = (v, d = 2) => B5(String(+(+v).toFixed(d)));
const chips5 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T5 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "") => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}>${s}</text>`;
const LEAF5 = "#4a9d5b", BROWN5 = "#8a5a2b", CARB5 = "#d99a1c", PROT5 = "#3b82c4", FAT5 = "#c0564a";

/* 5.1 plant nutrients: pick an element, see its job and the deficiency symptom on a leaf */
W.b5plant = (el) => {
  const MAC = ["N", "K", "P", "Ca", "Mg", "C", "H", "O", "S"], MIC = ["Zn", "Mn", "Mo", "B", "Cu", "Cl", "Fe"];
  const air = L2("Taken from the air as CO₂. A raw material of the carbohydrate made in photosynthesis.", "বায়ু থেকে CO₂ হিসেবে আসে। সালোকসংশ্লেষণে তৈরি শর্করার কাঁচামাল।");
  const D = {
    N: [L2("Nitrogen", "নাইট্রোজেন"), L2("Part of nucleic acids, proteins and chlorophyll; needed for general growth.", "নিউক্লিক এসিড, প্রোটিন ও ক্লোরোফিলের অংশ; সাধারণ দৈহিক বৃদ্ধিতে লাগে।"), L2("Green leaves slowly turn yellow all over (chlorosis); growth falls.", "সবুজ পাতা ধীরে ধীরে পুরোটাই হলুদ হয়ে যায় (ক্লোরোসিস); বৃদ্ধি কমে।")],
    K: [L2("Potassium", "পটাশিয়াম"), L2("Opens and closes the stomata; helps absorb water; growth of roots, flowers and fruits.", "পত্ররন্ধ্র খোলা-বন্ধ করে; পানি শোষণে সাহায্য করে; মূল, ফুল ও ফলের বৃদ্ধি।"), L2("Tip and margin turn yellow, then look scorched and brown; the top bud and side buds die.", "পাতার শীর্ষ ও কিনারা হলুদ হয়, পরে পুড়ে যাওয়ার মতো বাদামি; শীর্ষ ও পার্শ্ব মুকুল মরে যায়।")],
    P: [L2("Phosphorus", "ফসফরাস"), L2("Part of DNA, RNA and ATP; very important for root growth.", "DNA, RNA ও ATP-র গাঠনিক উপাদান; মূলের বৃদ্ধির জন্য খুব দরকারি।"), L2("Leaves turn purple with dead patches; leaves, flowers and fruits fall; the plant is stunted.", "পাতা বেগুনি হয়, মৃত অঞ্চল তৈরি হয়; পাতা, ফুল ও ফল ঝরে যায়; গাছ খর্বাকার হয়।")],
    Ca: [L2("Calcium", "ক্যালসিয়াম"), L2("Needed for the normal working of mitochondria and the endoplasmic reticulum.", "মাইটোকন্ড্রিয়া ও এন্ডোপ্লাজমিক রেটিকুলামের স্বাভাবিক কাজের জন্য দরকার।"), L2("Growing tips die, especially along the leaf margins; leaves curl; the plant wilts suddenly at flowering.", "বর্ধনশীল শীর্ষ অঞ্চল মরে যায়, বিশেষ করে পাতার কিনারা বরাবর; পাতা কুঁকড়ে যায়; ফুল ফোটার সময় গাছ হঠাৎ নেতিয়ে পড়ে।")],
    Mg: [L2("Magnesium", "ম্যাগনেসিয়াম"), L2("An important part of the chlorophyll molecule; helps respiration.", "ক্লোরোফিল অণুর গুরুত্বপূর্ণ অংশ; শ্বসনে সাহায্য করে।"), L2("Strong chlorosis between the veins: the veins stay green, the rest fades.", "শিরার মাঝের জায়গায় বেশি ক্লোরোসিস: শিরা সবুজ থাকে, বাকিটা ফ্যাকাশে হয়।")],
    C: [L2("Carbon", "কার্বন"), air, ""],
    H: [L2("Hydrogen", "হাইড্রোজেন"), L2("Taken from water. A raw material of the carbohydrate made in photosynthesis.", "পানি থেকে আসে। সালোকসংশ্লেষণে তৈরি শর্করার কাঁচামাল।"), ""],
    O: [L2("Oxygen", "অক্সিজেন"), L2("Taken from the air and from water. Needed for respiration and present in almost every compound of the plant.", "বায়ু ও পানি থেকে আসে। শ্বসনে লাগে, আর উদ্ভিদের প্রায় সব যৌগেই থাকে।"), ""],
    S: [L2("Sulphur", "সালফার"), L2("Part of proteins, hormones and vitamins; keeps the water balance of the cell.", "প্রোটিন, হরমোন ও ভিটামিনের গাঠনিক উপাদান; কোষে পানির সমতা রক্ষা করে।"), L2("Young leaves pale green with red and purple spots; dieback from the tips; short internodes.", "কচি পাতা হালকা সবুজ, তাতে লাল ও বেগুনি দাগ; শীর্ষ থেকে ডাইব্যাক; মধ্যপর্ব ছোট।")],
    Zn: [L2("Zinc", "দস্তা (জিংক)"), L2("Needed in tiny amounts; linked to the making of chlorophyll, so a shortage can cause chlorosis.", "অতি সামান্য লাগে; ক্লোরোফিল তৈরির সাথে জড়িত, তাই অভাবে ক্লোরোসিস হতে পারে।"), ""],
    Mn: [L2("Manganese", "ম্যাংগানিজ"), L2("Builds and maintains chloroplasts; a shortage can cause chlorosis.", "ক্লোরোপ্লাস্ট গঠন ও সংরক্ষণ করে; অভাবে ক্লোরোসিস হতে পারে।"), ""],
    Mo: [L2("Molybdenum", "মোলিবডেনাম"), L2("Needed for the fixing of nitrogen from the air by microorganisms.", "অণুজীবের সাহায্যে বায়ুর নাইট্রোজেন সংবন্ধনের জন্য আবশ্যক।"), ""],
    B: [L2("Boron", "বোরন"), L2("Sits in the cell wall and gives the cell firmness; needed by actively growing regions; helps sugar transport.", "কোষপ্রাচীরে থেকে কোষকে দৃঢ়তা দেয়; বর্ধনশীল অঞ্চলের জন্য দরকার; চিনি পরিবহনে সাহায্য করে।"), L2("Growing tips die; young leaves are misshapen; the stem is rough and cracks; flower buds fail.", "বর্ধনশীল অগ্রভাগ মরে যায়; কচি পাতা বিকৃত হয়; কাণ্ড খসখসে হয়ে ফেটে যায়; ফুলের কুঁড়ি হয় না।")],
    Cu: [L2("Copper", "তামা (কপার)"), L2("Has a role in respiration; needed for the normal growth of tomato and sunflower.", "শ্বসনে ভূমিকা আছে; টমেটো ও সূর্যমুখীর স্বাভাবিক বৃদ্ধির জন্য দরকার।"), ""],
    Cl: [L2("Chlorine", "ক্লোরিন"), L2("Needed for the growth of the root and stem of sugar beet.", "সুগারবিটের মূল ও কাণ্ডের বৃদ্ধির জন্য প্রয়োজন।"), ""],
    Fe: [L2("Iron", "লৌহ (আয়রন)"), L2("Part of cytochrome, so aerobic respiration depends on it; needed to form chlorophyll.", "সাইটোক্রোমের অংশ, তাই সবাত শ্বসন এর ওপর নির্ভর করে; ক্লোরোফিল তৈরিতে লাগে।"), L2("Young leaves turn pale first, starting between the fine veins; the stem is weak and short.", "প্রথমে কচি পাতা ফ্যাকাশে হয়, সরু শিরার মাঝ থেকে শুরু; কাণ্ড দুর্বল ও ছোট।")] };
  let sel = "";
  const row = (arr) => arr.map(k => `<button data-k="${k}" aria-pressed="false">${k}</button>`).join("");
  el.innerHTML = `<div class="svgwrap fit" id="b5ps"></div>
    <p class="hint" style="margin:8px 0 4px">${L2("Macronutrients (9), needed in large amounts:", "ম্যাক্রোনিউট্রিয়েন্ট (৯টি), বেশি পরিমাণে লাগে:")}</p><div class="chipset b5pe" role="group">${row(MAC)}</div>
    <p class="hint" style="margin:8px 0 4px">${L2("Micronutrients (7), needed in tiny amounts:", "মাইক্রোনিউট্রিয়েন্ট (৭টি), অতি সামান্য লাগে:")}</p><div class="chipset b5pe" role="group">${row(MIC)}</div>
    <div class="w-row" style="margin:10px 0"><button class="btn" id="b5pr">${L2("Healthy leaf", "সুস্থ পাতা")}</button></div><div class="w-out" id="b5po"></div>`;
  const LP = "M56 122 C 96 36 250 22 330 96 C 262 190 110 200 56 122 Z";
  const LP2 = "M56 122 C 80 70 120 82 140 56 C 168 30 200 68 230 52 C 262 38 282 70 300 98 C 276 132 250 120 228 150 C 200 182 170 150 140 172 C 110 190 76 160 56 122 Z";
  const VE = "M56 122 Q 190 104 328 97 M110 115 q14 -30 44 -48 M170 108 q14 -30 46 -46 M230 102 q12 -22 40 -34 M118 114 q22 22 52 34 M178 108 q22 22 56 32 M238 101 q20 16 46 20";
  const VE2 = "M56 122 Q 180 108 298 98 M120 114 q10 -22 24 -40 M190 106 q10 -20 30 -38 M130 114 q16 20 26 40 M196 106 q20 16 30 34";
  const draw = () => {
    const has = sel && D[sel][2];
    const k = has ? sel : "ok";
    const C = { ok: [LEAF5, "#2f6f3f", 2], N: ["#d8cf52", "#a39a30", 2], P: ["#73608a", "#4d3d60", 2], K: [LEAF5, "#2f6f3f", 2], Ca: [LEAF5, "#2f6f3f", 2], Mg: ["#ddd45c", "#2f6f3f", 2], Fe: ["#eeeab0", "#3f8a50", 3.5], S: ["#b7d37c", "#6f9440", 2], B: ["#3f8a50", "#2a5f37", 2] }[k];
    const deform = k === "B", lp = deform ? LP2 : LP, ve = deform ? VE2 : VE;
    const deadBud = ["K", "Ca", "S", "B"].includes(k);
    const spot = (x, y, r, c) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${c}"/>`;
    let ex = "";
    if (k === "P") ex = spot(150, 92, 12, BROWN5) + spot(222, 132, 14, BROWN5) + spot(262, 86, 10, BROWN5);
    if (k === "K") ex = `<path d="${lp}" fill="none" stroke="#dccf4a" stroke-width="44"/><path d="${lp}" fill="none" stroke="${BROWN5}" stroke-width="16"/><ellipse cx="322" cy="98" rx="26" ry="24" fill="${BROWN5}"/>` + spot(190, 80, 6, BROWN5) + spot(226, 138, 6, BROWN5);
    if (k === "Ca") ex = [[120, 60], [200, 38], [278, 62], [252, 162], [156, 178]].map(([x, y]) => spot(x, y, 18, BROWN5)).join("") + `<ellipse cx="326" cy="98" rx="24" ry="22" fill="${BROWN5}"/>`;
    if (k === "Mg") ex = `<path d="${ve}" fill="none" stroke="${LEAF5}" stroke-width="12" stroke-linecap="round"/>`;
    if (k === "S") ex = spot(140, 96, 6, "#b3372f") + spot(190, 132, 6, "#7a4a8c") + spot(214, 78, 6, "#b3372f") + spot(250, 122, 6, "#7a4a8c") + spot(160, 140, 5, "#b3372f") + `<ellipse cx="322" cy="98" rx="30" ry="26" fill="${BROWN5}"/>`;
    if (k === "B") ex = `<ellipse cx="292" cy="98" rx="20" ry="18" fill="${BROWN5}"/>`;
    let s = `<svg viewBox="0 0 360 206" role="img" aria-label="${L2("A leaf showing the effect of the chosen element", "বাছাই করা উপাদানের প্রভাব দেখানো একটি পাতা")}"><defs><clipPath id="b5pc"><path d="${lp}"/></clipPath></defs>`;
    s += `<path d="M22 204 V72" stroke="#6f8f4e" stroke-width="7" stroke-linecap="round"/><path d="M22 150 L56 122" stroke="#6f8f4e" stroke-width="5" stroke-linecap="round"/>`;
    if (k === "B") s += `<path d="M18 168 l8 5 l-8 5 l8 5 M18 104 l8 5 l-8 5" fill="none" stroke="var(--bad)" stroke-width="2"/>`;
    s += `<ellipse cx="22" cy="60" rx="8" ry="15" fill="${deadBud ? BROWN5 : LEAF5}" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += T5(36, 58, deadBud ? L2("tip dead", "শীর্ষ মৃত") : L2("growing tip", "বর্ধনশীল শীর্ষ"), "start", 13, deadBud ? "var(--bad)" : "var(--muted)", deadBud ? "700" : "");
    s += `<path d="${lp}" fill="${C[0]}"/><g clip-path="url(#b5pc)">${ex}</g><path d="${ve}" fill="none" stroke="${C[1]}" stroke-width="${C[2]}" stroke-linecap="round"/><path d="${lp}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    const tag = !sel ? L2("healthy leaf", "সুস্থ পাতা") : !has ? L2("no picture in your book", "বইয়ে লক্ষণের ছবি নেই") : (k === "Fe" || k === "S") ? L2(`young leaf, short of ${sel}`, `কচি পাতা, ${sel}-এর অভাব`) : L2(`leaf short of ${sel}`, `${sel}-এর অভাবে পাতা`);
    s += T5(352, 20, tag, "end", 13, has ? "var(--bad)" : "var(--muted)", has ? "700" : "") + `</svg>`;
    $("#b5ps", el).innerHTML = s;
    let o;
    if (!sel) o = L2("This is a healthy green leaf. Tap any of the 16 essential elements to see what it does and what happens when it is short.", "এটি একটি সুস্থ সবুজ পাতা। ১৬টি অত্যাবশ্যকীয় উপাদানের যেকোনোটিতে চাপ দিয়ে দেখো সেটি কী করে আর অভাব হলে কী ঘটে।");
    else {
      const d = D[sel], mac = MAC.includes(sel);
      o = `<b>${d[0]} (${sel})</b> <span class="muted">· ${mac ? L2("macronutrient", "ম্যাক্রোনিউট্রিয়েন্ট") : L2("micronutrient", "মাইক্রোনিউট্রিয়েন্ট")}</span><br><b>${L2("Work", "কাজ")}:</b> ${d[1]}<br>` +
        (d[2] ? `<b style="color:var(--bad)">${L2("If short", "অভাব হলে")}:</b> ${d[2]}` : `<span class="muted">${L2("Your book gives no separate deficiency picture for this element, so the leaf is shown healthy.", "তোমার বইয়ে এই উপাদানের আলাদা অভাবজনিত লক্ষণ দেওয়া নেই, তাই পাতাটি সুস্থ দেখানো হয়েছে।")}</span>`);
    }
    $("#b5po", el).innerHTML = o;
  };
  el.querySelectorAll(".b5pe button").forEach(b => b.addEventListener("click", () => { sel = b.dataset.k; el.querySelectorAll(".b5pe button").forEach(q => q.setAttribute("aria-pressed", q === b)); draw(); }));
  $("#b5pr", el).addEventListener("click", () => { sel = ""; el.querySelectorAll(".b5pe button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); });
  draw();
};

/* 5.2 build a plate: which of the six nutrients and roughage does the meal cover? */
W.b5plate = (el) => {
  /* order: protein, carbohydrate, fat, vitamins, minerals, water, roughage (2 = main source, 1 = some) */
  const NUT = [L2("Protein", "আমিষ"), L2("Carbohydrate", "শর্করা"), L2("Fat", "স্নেহ"), L2("Vitamins", "ভিটামিন"), L2("Minerals", "খনিজ লবণ"), L2("Water", "পানি"), L2("Roughage", "রাফেজ")];
  const COL = [PROT5, CARB5, FAT5, "#4a9d5b", "#8a6fb0", "#3aa6b9", "#8a5a2b"];
  const FOOD = [
    [L2("Rice", "ভাত"), [1, 2, 0, 0, 0, 0, 0]], [L2("Ruti (red ata)", "রুটি (লাল আটা)"), [1, 2, 0, 1, 0, 0, 1]], [L2("Dal", "ডাল"), [2, 1, 0, 0, 1, 0, 1]],
    [L2("Mola fish", "মলা মাছ"), [2, 0, 1, 2, 2, 0, 0]], [L2("Egg", "ডিম"), [2, 0, 1, 1, 1, 0, 0]], [L2("Milk", "দুধ"), [1, 1, 1, 1, 2, 2, 0]],
    [L2("Cooking oil", "রান্নার তেল"), [0, 0, 2, 1, 0, 0, 0]], [L2("Lal shak", "লাল শাক"), [0, 0, 0, 2, 2, 1, 2]], [L2("Guava", "পেয়ারা"), [0, 1, 0, 2, 1, 1, 2]],
    [L2("Potato", "আলু"), [0, 2, 0, 1, 0, 0, 0]], [L2("Peanuts", "চিনাবাদাম"), [2, 0, 2, 0, 1, 0, 0]], [L2("Water", "পানি"), [0, 0, 0, 0, 0, 2, 0]]];
  const on = new Set();
  el.innerHTML = `<div class="chipset b5lf" role="group">${FOOD.map((f, i) => `<button data-i="${i}" aria-pressed="false">${f[0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="b5ls" style="margin-top:8px"></div>
    <div class="w-row" style="margin:8px 0"><button class="btn solid" id="b5lm">${L2("Dal-bhat meal", "ডাল-ভাতের থালা")}</button><button class="btn" id="b5lc">${L2("Empty the plate", "থালা খালি করো")}</button></div><div class="w-out" id="b5lo"></div>`;
  const draw = () => {
    const tot = NUT.map((_, j) => [...on].reduce((a, i) => a + FOOD[i][1][j], 0));
    let s = `<svg viewBox="0 0 360 178" role="img" aria-label="${L2("Plate and nutrient check", "থালা ও পুষ্টি উপাদান যাচাই")}">`;
    s += `<circle cx="66" cy="84" r="60" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><circle cx="66" cy="84" r="44" fill="none" stroke="var(--rule)" stroke-width="1.5"/>`;
    [...on].forEach((i, n) => { const a = (n / Math.max(on.size, 1)) * 2 * Math.PI - Math.PI / 2, r = on.size === 1 ? 0 : 27, main = FOOD[i][1].indexOf(2); s += `<circle cx="${(66 + r * Math.cos(a)).toFixed(1)}" cy="${(84 + r * Math.sin(a)).toFixed(1)}" r="11" fill="${COL[main < 0 ? 1 : main]}" stroke="var(--ink)" stroke-width="1"/>`; });
    s += T5(66, 166, L2(`${on.size} food${on.size === 1 ? "" : "s"} on the plate`, `থালায় ${B5(on.size)}টি খাবার`), "middle", 13, "var(--muted)");
    NUT.forEach((n, j) => {
      const y = 12 + j * 23, v = tot[j], w = Math.min(v, 4) / 4 * 80;
      s += T5(140, y + 12, n, "start", 14, "var(--ink)", v >= 2 ? "700" : "") + `<rect x="254" y="${y}" width="80" height="14" rx="7" fill="none" stroke="var(--rule)" stroke-width="1.5"/>` + (w > 0 ? `<rect x="254" y="${y}" width="${Math.max(w, 14)}" height="14" rx="7" fill="${COL[j]}"/>` : "");
      s += T5(348, y + 12, v >= 2 ? "✓" : v === 1 ? "~" : "✗", "middle", 14, v >= 2 ? "var(--good)" : v === 1 ? "var(--note)" : "var(--bad)", "700");
    });
    $("#b5ls", el).innerHTML = s + `</svg>`;
    const miss = NUT.filter((_, j) => tot[j] === 0), low = NUT.filter((_, j) => tot[j] === 1), ok = NUT.length - miss.length - low.length;
    let o;
    if (!on.size) o = L2("The plate is empty. Tap foods above to add them. ✓ = well covered, ~ = only a little, ✗ = missing.", "থালা খালি। ওপরের খাবারে চাপ দিয়ে যোগ করো। ✓ = ভালোভাবে আছে, ~ = সামান্য আছে, ✗ = নেই।");
    else o = `<b>${L2(`Well covered: ${ok} of 7`, `ভালোভাবে আছে: ৭টির মধ্যে ${B5(ok)}টি`)}</b><br>` + (miss.length ? `<span style="color:var(--bad)">${L2("Missing", "নেই")}: ${miss.join(", ")}</span><br>` : "") + (low.length ? `${L2("Only a little", "সামান্য আছে")}: ${low.join(", ")}<br>` : "") +
      (!miss.length && !low.length ? `<b style="color:var(--good)">${L2("All six nutrients and roughage are on your plate. No single food could do this: variety did.", "ছয়টি পুষ্টি উপাদান আর রাফেজ সবই তোমার থালায় আছে। একটিমাত্র খাবারে এটা হতো না: হয়েছে বৈচিত্র্যের কারণে।")}</b>` : L2("Add another food that fills the gap.", "ঘাটতি পূরণ করে এমন আরেকটি খাবার যোগ করো।"));
    $("#b5lo", el).innerHTML = o;
  };
  const sync = () => { el.querySelectorAll(".b5lf button").forEach(b => b.setAttribute("aria-pressed", on.has(+b.dataset.i))); draw(); };
  el.querySelectorAll(".b5lf button").forEach(b => b.addEventListener("click", () => { const i = +b.dataset.i; on.has(i) ? on.delete(i) : on.add(i); sync(); }));
  $("#b5lm", el).addEventListener("click", () => { on.clear(); [0, 2, 6, 7, 11].forEach(i => on.add(i)); sync(); });
  $("#b5lc", el).addEventListener("click", () => { on.clear(); sync(); });
  draw();
};

/* 5.2.2 the ideal food pyramid */
W.b5pyramid = (el) => {
  const TR = [
    [L2("Carbohydrate foods", "শর্করাজাতীয় খাদ্য"), L2("Rice, ruti, potato", "ভাত, রুটি, আলু"), L2("Eat the most. They are the body's main, cheapest source of energy.", "সবচেয়ে বেশি খাও। এগুলোই দেহের শক্তির প্রধান ও সবচেয়ে সস্তা উৎস।"), CARB5],
    [L2("Vegetables and fruits", "শাকসবজি ও ফলমূল"), L2("Vegetables, fruits", "শাকসবজি, ফল"), L2("Less than rice and ruti, more than fish and meat. They bring vitamins, minerals and roughage with very few calories.", "ভাত-রুটির চেয়ে কম, মাছ-মাংসের চেয়ে বেশি। খুব কম ক্যালরিতে এরা দেয় ভিটামিন, খনিজ লবণ ও রাফেজ।"), LEAF5],
    [L2("Protein foods", "আমিষজাতীয় খাদ্য"), L2("Fish, egg, dal", "মাছ, ডিম, ডাল"), L2("Fish, meat, egg, milk, dal, cheese, chhana, curd: less than vegetables and fruits. They build and repair the body.", "মাছ, মাংস, ডিম, দুধ, ডাল, পনির, ছানা, দই: শাকসবজি ও ফলের চেয়ে কম। এরা দেহ গঠন ও ক্ষয়পূরণ করে।"), PROT5],
    [L2("Fats, oils and sweets", "তেল, চর্বি ও মিষ্টি"), L2("fats, oils, sweets", "তেল, চর্বি, মিষ্টি"), L2("Eat the least. They are so rich in energy that a little is enough; the extra is stored as body fat.", "সবচেয়ে কম খাও। এতে এত বেশি শক্তি যে অল্পই যথেষ্ট; বাড়তিটুকু দেহে মেদ হয়ে জমে।"), FAT5]];
  let sel = 0;
  el.innerHTML = `<div class="svgwrap fit" id="b5ys"></div><div class="chipset b5yc" role="group" style="margin-top:6px">${TR.map((t, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${B5(i + 1)}. ${t[0]}</button>`).join("")}</div><div class="w-out" id="b5yo" style="margin-top:8px"></div>`;
  const Y = [202, 156, 112, 66, 14], hw = y => 150 * (y - 14) / 188, CX = 182;
  const draw = () => {
    let s = `<svg viewBox="0 0 360 226" role="img" aria-label="${L2("Ideal food pyramid", "আদর্শ খাদ্য পিরামিড")}">${arrowDefs("b5ya", "var(--muted)")}`;
    TR.forEach((t, i) => {
      const y1 = Y[i], y2 = Y[i + 1], a = hw(y1), b = hw(y2), on = i === sel;
      s += `<g data-i="${i}" style="cursor:pointer"><polygon points="${CX - a},${y1} ${CX + a},${y1} ${CX + b},${y2} ${CX - b},${y2}" fill="${t[3]}" opacity="${on ? 1 : 0.55}" stroke="${on ? "var(--ink)" : "var(--sheet)"}" stroke-width="${on ? 3 : 2}"/>`;
      if (i < 3) s += T5(CX, (y1 + y2) / 2 + 5, t[1], "middle", 13, "var(--sheet)", "700");
      s += `</g>`;
    });
    s += `<g data-i="3" style="cursor:pointer">${T5(CX + 22, 34, "← " + TR[3][1], "start", 12.5, sel === 3 ? "var(--bad)" : "var(--ink)", sel === 3 ? "700" : "")}</g>`;
    s += `<line x1="18" y1="186" x2="18" y2="40" stroke="var(--muted)" stroke-width="2" marker-end="url(#b5ya)"/>` + T5(18, 28, L2("less", "কম"), "middle", 12.5, "var(--muted)") + T5(18, 204, L2("more", "বেশি"), "middle", 12.5, "var(--muted)");
    s += T5(CX, 220, L2("wider level = eat more of it", "স্তর যত চওড়া, খাবে তত বেশি"), "middle", 13, "var(--muted)") + `</svg>`;
    $("#b5ys", el).innerHTML = s;
    $("#b5yo", el).innerHTML = `<b>${L2("Level", "স্তর")} ${B5(sel + 1)}: ${TR[sel][0]}</b><br>${TR[sel][2]}`;
    el.querySelectorAll(".b5yc button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.i === sel));
    el.querySelectorAll("#b5ys [data-i]").forEach(g => g.addEventListener("click", () => { sel = +g.dataset.i; draw(); }));
  };
  el.querySelectorAll(".b5yc button").forEach(b => b.addEventListener("click", () => { sel = +b.dataset.i; draw(); }));
  draw();
};

/* 5.3 deficiency diseases: where on the body, which nutrient, which foods */
W.b5defic = (el) => {
  const DS = {
    go: [L2("Goitre", "গলগণ্ড"), L2("Iodine", "আয়োডিন"), L2("The thyroid gland in the neck swells, because without iodine it cannot make enough hormone.", "গলার থাইরয়েড গ্রন্থি ফুলে যায়, কারণ আয়োডিন ছাড়া সে যথেষ্ট হরমোন তৈরি করতে পারে না।"), [L2("iodised salt", "আয়োডিনযুক্ত লবণ"), L2("sea fish", "সামুদ্রিক মাছ")]],
    nb: [L2("Night blindness", "রাতকানা"), L2("Vitamin A", "ভিটামিন A"), L2("Rod cells of the eye are damaged: poor sight in dim light. It is the first stage of xerophthalmia.", "চোখের রড কোষ ক্ষতিগ্রস্ত হয়: অল্প আলোয় দেখতে অসুবিধা। এটি জেরোফথ্যালমিয়ার প্রথম মাত্রা।"), [L2("mola fish", "মলা মাছ"), L2("liver", "কলিজা"), L2("green shak", "সবুজ শাক"), L2("carrot", "গাজর"), L2("ripe mango", "পাকা আম")]],
    ri: [L2("Rickets", "রিকেটস"), L2("Vitamin D", "ভিটামিন D"), L2("Calcium and phosphorus are poorly absorbed, so bones are weak and bend, especially the leg bones.", "ক্যালসিয়াম ও ফসফরাস ঠিকমতো শোষিত হয় না, তাই হাড় দুর্বল হয়ে বেঁকে যায়, বিশেষ করে পায়ের হাড়।"), [L2("milk", "দুধ"), L2("butter", "মাখন"), L2("egg", "ডিম"), L2("cod-liver oil", "কডলিভার তেল"), L2("sunlight", "রোদ")]],
    an: [L2("Anaemia", "রক্তশূন্যতা"), L2("Iron", "লৌহ"), L2("Too little haemoglobin in the blood, so less oxygen reaches the cells: weakness, headache, a pounding heart.", "রক্তে হিমোগ্লোবিন কম, তাই কোষে অক্সিজেন কম পৌঁছায়: দুর্বলতা, মাথাব্যথা, বুক ধড়ফড়।"), [L2("liver", "কলিজা"), L2("meat", "মাংস"), L2("egg", "ডিম"), L2("lentils", "মসুর ডাল"), L2("green shak", "সবুজ শাক"), L2("date gur", "খেজুরের গুড়")]] };
  let sel = "go";
  el.innerHTML = `<div class="chipset b5dc" role="group">${Object.keys(DS).map((k, i) => `<button data-k="${k}" aria-pressed="${i === 0}">${DS[k][0]}</button>`).join("")}</div><div class="svgwrap fit" id="b5ds" style="margin-top:8px"></div><div class="w-out" id="b5do" style="margin-top:8px"></div>`;
  const draw = () => {
    const d = DS[sel], skin = sel === "an" ? "#eadfcd" : "#d9a878", hl = "var(--bad)";
    let s = `<svg viewBox="0 0 360 262" role="img" aria-label="${d[0]}">`;
    /* legs */
    s += sel === "ri" ? `<path d="M78 160 C52 196 56 222 74 250 M102 160 C128 196 124 222 106 250" fill="none" stroke="${skin}" stroke-width="15" stroke-linecap="round"/><path d="M78 160 C52 196 56 222 74 250 M102 160 C128 196 124 222 106 250" fill="none" stroke="${hl}" stroke-width="2" stroke-dasharray="5 4"/>`
      : `<path d="M80 160 V250 M100 160 V250" fill="none" stroke="${skin}" stroke-width="15" stroke-linecap="round"/>`;
    /* arms, torso, neck, head */
    s += `<path d="M62 84 L40 142 M118 84 L140 142" fill="none" stroke="${skin}" stroke-width="12" stroke-linecap="round"/><rect x="60" y="74" width="60" height="94" rx="16" fill="var(--c)"/><rect x="82" y="56" width="16" height="22" fill="${skin}"/>`;
    if (sel === "go") s += `<ellipse cx="90" cy="68" rx="15" ry="9" fill="${skin}" stroke="${hl}" stroke-width="3"/>`;
    s += `<circle cx="90" cy="34" r="25" fill="${skin}" stroke="var(--ink)" stroke-width="1.5"/><path d="M82 46 q8 5 16 0" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round"/>`;
    s += `<circle cx="81" cy="31" r="3" fill="var(--ink)"/><circle cx="99" cy="31" r="3" fill="var(--ink)"/>` + (sel === "nb" ? `<circle cx="81" cy="31" r="8" fill="none" stroke="${hl}" stroke-width="3"/><circle cx="99" cy="31" r="8" fill="none" stroke="${hl}" stroke-width="3"/>` : "");
    if (sel === "an") s += `<path d="M90 100 C80 114 76 122 76 130 a14 14 0 0 0 28 0 C104 122 100 114 90 100 Z" fill="#d99a94" stroke="${hl}" stroke-width="3"/>` + T5(90, 136, "Hb↓", "middle", 12, "var(--ink)", "700");
    const tip = { go: [106, 68, 134, 68, L2("swollen thyroid", "থাইরয়েড ফোলা")], nb: [108, 30, 136, 22, L2("dim-light sight fails", "অল্প আলোয় দেখে না")], ri: [126, 206, 154, 206, L2("bent leg bones", "পায়ের হাড় বাঁকা")], an: [103, 112, 150, 62, L2("pale: less haemoglobin", "ফ্যাকাশে: হিমোগ্লোবিন কম")] }[sel];
    s += `<line x1="${tip[0]}" y1="${tip[1]}" x2="${tip[2]}" y2="${tip[3]}" stroke="${hl}" stroke-width="2"/>` + T5(tip[2] + 5, tip[3] + 4, tip[4], "start", 13, hl, "700");
    /* nutrient card */
    s += `<rect x="186" y="${sel === "ri" ? 40 : 86}" width="168" height="${44 + d[3].length * 19}" rx="10" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>`;
    const y0 = sel === "ri" ? 40 : 86;
    s += T5(196, y0 + 19, L2("Lacking", "অভাব") + ":", "start", 12, "var(--muted)") + T5(346, y0 + 19, d[1], "end", 14, "var(--bad)", "700") + T5(196, y0 + 38, L2("Foods that help", "যা খেলে উপকার") + ":", "start", 12, "var(--muted)");
    d[3].forEach((f, i) => { s += `<circle cx="202" cy="${y0 + 52 + i * 19}" r="3.5" fill="var(--good)"/>` + T5(212, y0 + 57 + i * 19, f, "start", 13); });
    $("#b5ds", el).innerHTML = s + `</svg>`;
    $("#b5do", el).innerHTML = `<b>${d[0]}</b> <span class="muted">· ${L2("lack of", "অভাব")}: ${d[1]}</span><br>${d[2]}`;
  };
  chips5(el, ".b5dc", b => { sel = b.dataset.k; draw(); });
  draw();
};

/* 5.4 energy from carbohydrate, protein and fat: the 4-4-9 rule */
W.b5kcal = (el) => {
  const PRE = [[L2("20 g chira", "২০ g চিড়া"), 15.4, 1.32, 0.24], [L2("100 g rice", "১০০ g চাল"), 79, 6.4, 0.4], [L2("100 g egg", "১০০ g ডিম"), 0, 13.3, 13.3], [L2("100 g milk", "১০০ g দুধ"), 4.4, 3.2, 4.1], [L2("100 g hilsa", "১০০ g ইলিশ"), 2.9, 21.8, 19.4], [L2("10 g oil", "১০ g তেল"), 0, 0, 10]];
  const g = L2("g", "g");
  let v = [15.4, 1.32, 0.24];
  el.innerHTML = `<div class="chipset b5kp" role="group">${PRE.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${p[0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="b5ks" style="margin-top:8px"></div>
    ${slider("b5kc", L2("Carbohydrate", "শর্করা"), 0, 100, 0.5, 15.4, g)}${slider("b5kq", L2("Protein", "আমিষ"), 0, 50, 0.5, 1.32, g)}${slider("b5kf", L2("Fat", "স্নেহ"), 0, 50, 0.5, 0.24, g)}
    <div class="w-out" id="b5ko"></div>`;
  const ids = ["b5kc", "b5kq", "b5kf"], NM = [L2("Carbs", "শর্করা"), L2("Protein", "আমিষ"), L2("Fat", "স্নেহ")], K = [4, 4, 9], COL = [CARB5, PROT5, FAT5];
  const draw = () => {
    ids.forEach((id, i) => { $("#" + id + "-v", el).textContent = F5(v[i]) + " g"; });
    const e = v.map((x, i) => x * K[i]), tot = e[0] + e[1] + e[2], kj = tot * 4.2;
    let s = `<svg viewBox="0 0 360 126" role="img" aria-label="${L2("Energy from the three nutrients", "তিনটি উপাদান থেকে শক্তি")}">`;
    s += T5(10, 20, `${L2("Total", "মোট")}: ${F5(tot)} kcal`, "start", 16, "var(--c)", "700") + T5(350, 20, `= ${F5(kj, 1)} kJ`, "end", 14, "var(--ink)", "700");
    s += `<rect x="10" y="30" width="340" height="28" rx="6" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>`;
    let x = 10;
    if (tot > 0) e.forEach((q, i) => { const w = q / tot * 340; if (w > 0.5) s += `<rect x="${x.toFixed(1)}" y="30" width="${w.toFixed(1)}" height="28" fill="${COL[i]}"/>` + (w > 46 ? T5(x + w / 2, 49, F5(q, 1), "middle", 12.5, "var(--sheet)", "700") : ""); x += w; });
    e.forEach((q, i) => { const lx = 10 + i * 118; s += `<rect x="${lx}" y="70" width="12" height="12" rx="3" fill="${COL[i]}"/>` + T5(lx + 17, 81, `${NM[i]} ${F5(q, 1)}`, "start", 13.5); });
    const pct = Math.min(tot / 2000, 1);
    s += `<rect x="10" y="94" width="340" height="8" rx="4" fill="var(--paper)" stroke="var(--rule)" stroke-width="1"/><rect x="10" y="94" width="${(pct * 340).toFixed(1)}" height="8" rx="4" fill="var(--c)"/>`;
    s += T5(10, 120, L2(`${F5(tot / 20, 1)}% of a 2000 kcal day`, `দিনে ২০০০ kcal চাহিদার ${F5(tot / 20, 1)}%`), "start", 13, "var(--muted)") + `</svg>`;
    $("#b5ks", el).innerHTML = s;
    $("#b5ko", el).innerHTML = v.map((x, i) => `${NM[i]}: ${F5(x)} g × ${B5(K[i])} = <b>${F5(e[i])} kcal</b>`).join("<br>") + `<br>${L2("Total", "মোট")} = <b>${F5(tot)} kcal</b> = ${F5(tot)} × ${B5("4.2")} = <b>${F5(kj, 1)} kJ</b>` +
      (v[2] > 0 && e[2] > e[0] && e[2] > e[1] ? `<br><span class="muted">${L2("Fat gives the largest share here, because each gram of fat carries 9 kcal.", "এখানে সবচেয়ে বড় অংশ স্নেহের, কারণ প্রতি গ্রাম স্নেহে ৯ kcal থাকে।")}</span>` : "");
  };
  chips5(el, ".b5kp", b => { const p = PRE[+b.dataset.i]; v = [p[1], p[2], p[3]]; ids.forEach((id, i) => { $("#" + id, el).value = v[i]; }); draw(); });
  ids.forEach((id, i) => $("#" + id, el).addEventListener("input", () => { v[i] = +$("#" + id, el).value; el.querySelectorAll(".b5kp button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); }));
  draw();
};

/* 5.5 BMI scale with BMR and daily energy need */
W.b5bmi = (el) => {
  const ACT = [[1.2, L2("not hard-working", "পরিশ্রমী নয়")], [1.375, L2("light, sport 2–3 days", "হালকা, ২–৩ দিন খেলা")], [1.55, L2("active, sport 2–3 days", "পরিশ্রমী, ২–৩ দিন খেলা")], [1.725, L2("active, sport daily", "পরিশ্রমী, রোজ খেলা")], [1.9, L2("very hard-working", "অত্যন্ত পরিশ্রমী")]];
  let male = true, act = 1;
  el.innerHTML = `<div class="svgwrap fit" id="b5ms"></div>
    ${slider("b5mw", L2("Weight", "ওজন"), 30, 120, 1, 62, "kg")}${slider("b5mh", L2("Height", "উচ্চতা"), 120, 195, 1, 170, "cm")}${slider("b5ma", L2("Age", "বয়স"), 12, 70, 1, 16, "")}
    <div class="chipset b5mx" role="group" style="margin:6px 0"><button data-m="1" aria-pressed="true">${L2("Male", "ছেলে")}</button><button data-m="0" aria-pressed="false">${L2("Female", "মেয়ে")}</button></div>
    <div class="chipset b5mc" role="group" style="margin-bottom:8px">${ACT.map((a, i) => `<button data-i="${i}" aria-pressed="${i === act}">× ${B5(a[0])} ${a[1]}</button>`).join("")}</div>
    <div class="w-out" id="b5mo"></div>`;
  const X = b => 10 + (Math.max(14, Math.min(42, b)) - 14) / 28 * 340;
  const Z = [[14, 18.5, "#6fa8dc", L2("Under", "কম")], [18.5, 25, "#4a9d5b", L2("Ideal", "আদর্শ")], [25, 30, "#d99a1c", L2("Over", "বেশি")], [30, 42, "#c0564a", L2("Obesity", "স্থূলতা")]];
  const draw = () => {
    const w = sv(el, "b5mw", "kg", 0), hc = sv(el, "b5mh", "cm", 0), a = sv(el, "b5ma", L2("years", "বছর"), 0), h = hc / 100;
    const bmi = w / (h * h), bmr = male ? 66 + 13.7 * w + 5 * hc - 6.8 * a : 655 + 9.6 * w + 1.8 * hc - 4.7 * a, need = bmr * ACT[act][0];
    const cat = bmi < 18.5 ? L2("underweight", "ওজন কম") : bmi < 25 ? L2("ideal range", "আদর্শ মান") : bmi < 30 ? L2("overweight", "ওজন অতিরিক্ত") : bmi < 35 ? L2("obesity, first stage", "স্থূলতার প্রথম স্তর") : bmi < 40 ? L2("obesity, second stage", "স্থূলতার দ্বিতীয় স্তর") : L2("extreme obesity", "অতিরিক্ত স্থূলতা");
    let s = `<svg viewBox="0 0 360 96" role="img" aria-label="${L2("BMI scale", "BMI স্কেল")}">`;
    Z.forEach(z => { const x1 = X(z[0]), x2 = X(z[1]); s += `<rect x="${x1}" y="40" width="${x2 - x1}" height="20" fill="${z[2]}"/>` + T5((x1 + x2) / 2, 55, z[3], "middle", 13, "var(--sheet)", "700"); });
    [18.5, 25, 30].forEach(t => { s += `<line x1="${X(t)}" y1="36" x2="${X(t)}" y2="64" stroke="var(--ink)" stroke-width="1.5"/>` + T5(X(t), 78, B5(t), "middle", 12.5, "var(--muted)"); });
    const mx = X(bmi), lx = Math.max(52, Math.min(308, mx));
    s += `<polygon points="${mx - 8},24 ${mx + 8},24 ${mx},38" fill="var(--ink)"/>` + T5(lx, 18, `BMI ${F5(bmi, 1)}`, "middle", 15, "var(--ink)", "700") + T5(350, 92, L2("adult scale", "প্রাপ্তবয়স্কদের মানদণ্ড"), "end", 12.5, "var(--muted)") + `</svg>`;
    $("#b5ms", el).innerHTML = s;
    $("#b5mo", el).innerHTML = `<b>BMI</b> = ${B5(w)} ÷ (${F5(h)} × ${F5(h)}) = <b>${F5(bmi, 1)}</b> <span class="muted">(${cat})</span><br>` +
      `<b>BMR</b> = ${male ? `${B5(66)} + (${B5("13.7")} × ${B5(w)}) + (${B5(5)} × ${B5(hc)}) − (${B5("6.8")} × ${B5(a)})` : `${B5(655)} + (${B5("9.6")} × ${B5(w)}) + (${B5("1.8")} × ${B5(hc)}) − (${B5("4.7")} × ${B5(a)})`} = <b>${F5(bmr, 1)} kcal</b><br>` +
      `${L2("Daily need", "দৈনিক চাহিদা")} = ${F5(bmr, 1)} × ${B5(ACT[act][0])} = <b>${F5(need, 0)} kcal</b>` +
      (a < 18 ? `<br><span class="muted">${L2("Under 18: the body is still growing, so doctors read BMI with age-and-sex charts. Treat these numbers only as practice.", "১৮ বছরের নিচে: শরীর এখনো বাড়ছে, তাই ডাক্তাররা বয়স ও লিঙ্গভিত্তিক চার্ট দিয়ে BMI বিচার করেন। এই সংখ্যাগুলো শুধু অনুশীলনের জন্য।")}</span>` : "");
  };
  chips5(el, ".b5mx", b => { male = b.dataset.m === "1"; draw(); });
  chips5(el, ".b5mc", b => { act = +b.dataset.i; draw(); });
  ["b5mw", "b5mh", "b5ma"].forEach(id => $("#" + id, el).addEventListener("input", draw));
  draw();
};

/* 5.6 energy balance: food in against energy out */
W.b5balance = (el) => {
  const ACT = [[1.2, L2("sitting all day", "সারা দিন বসে")], [1.375, L2("light activity", "হালকা কাজকর্ম")], [1.55, L2("active", "পরিশ্রমী")], [1.725, L2("sport every day", "রোজ খেলাধুলা")], [1.9, L2("very hard work", "অত্যন্ত পরিশ্রম")]];
  const BMR = 1600;
  let act = 0;
  el.innerHTML = `<div class="svgwrap fit" id="b5bs"></div>
    ${slider("b5bi", L2("Food eaten in a day", "এক দিনে খাওয়া খাদ্য"), 1400, 3400, 50, 2300, "kcal")}
    <p class="hint" style="margin:6px 0 4px">${L2("Activity in a day (BMR of this adult = 1600 kcal):", "এক দিনের কাজকর্ম (এই প্রাপ্তবয়স্কের BMR = ১৬০০ kcal):")}</p>
    <div class="chipset b5bc" role="group" style="margin-bottom:8px">${ACT.map((a, i) => `<button data-i="${i}" aria-pressed="${i === act}">${a[1]}</button>`).join("")}</div><div class="w-out" id="b5bo"></div>`;
  const draw = () => {
    const inn = sv(el, "b5bi", "kcal", 0), out = BMR * ACT[act][0], d = inn - out;
    const ang = Math.max(-1, Math.min(1, d / 1000)) * 13, r = ang * Math.PI / 180;
    const lx = 180 - 120 * Math.cos(r), ly = 70 + 120 * Math.sin(r), rx = 180 + 120 * Math.cos(r), ry = 70 - 120 * Math.sin(r);
    const pan = (x, y, col, t1, t2) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 26}" stroke="var(--ink)" stroke-width="2"/><rect x="${x - 54}" y="${y + 26}" width="108" height="44" rx="8" fill="${col}" stroke="var(--ink)" stroke-width="1.5"/>${T5(x, y + 44, t1, "middle", 12.5, "var(--sheet)", "700")}${T5(x, y + 62, t2, "middle", 14, "var(--sheet)", "700")}`;
    let s = `<svg viewBox="0 0 360 196" role="img" aria-label="${L2("Energy balance", "শক্তির ভারসাম্য")}">`;
    s += `<polygon points="180,70 162,176 198,176" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><rect x="130" y="176" width="100" height="10" rx="4" fill="var(--ink)"/>`;
    s += `<line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${rx.toFixed(1)}" y2="${ry.toFixed(1)}" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><circle cx="180" cy="70" r="7" fill="var(--c)" stroke="var(--ink)" stroke-width="2"/>`;
    s += pan(+lx.toFixed(1), +ly.toFixed(1), CARB5, L2("food in", "খাদ্য থেকে আসে"), `${B5(inn)} kcal`) + pan(+rx.toFixed(1), +ry.toFixed(1), PROT5, L2("energy out", "খরচ হয়"), `${F5(out, 0)} kcal`);
    s += T5(180, 22, Math.abs(d) <= 100 ? L2("balanced", "ভারসাম্যে") : d > 0 ? L2("more in than out", "খরচের চেয়ে আয় বেশি") : L2("more out than in", "আয়ের চেয়ে খরচ বেশি"), "middle", 15, Math.abs(d) <= 100 ? "var(--good)" : "var(--note)", "700") + `</svg>`;
    $("#b5bs", el).innerHTML = s;
    $("#b5bo", el).innerHTML = `${L2("Energy out", "খরচ")} = BMR × ${B5(ACT[act][0])} = ${B5(BMR)} × ${B5(ACT[act][0])} = <b>${F5(out, 0)} kcal</b><br>${L2("Difference", "পার্থক্য")} = ${B5(inn)} − ${F5(out, 0)} = <b>${d > 0 ? "+" : d < 0 ? "−" : ""}${F5(Math.abs(d), 0)} kcal</b><br>` +
      (Math.abs(d) <= 100 ? L2("Energy in and energy out nearly match, so body weight stays steady.", "আয় আর খরচ প্রায় সমান, তাই দেহের ওজন স্থির থাকে।") : d > 0 ? L2("If this goes on day after day, the extra energy is stored in the body as fat. More activity moves the balance back.", "দিনের পর দিন এমন চললে বাড়তি শক্তি দেহে মেদ হিসেবে জমে। কাজকর্ম বাড়ালে পাল্লা আবার সমান হয়।") : L2("If this goes on day after day, the body uses up its stores and becomes thin and weak. A hard-working body needs more food.", "দিনের পর দিন এমন চললে দেহ নিজের সঞ্চয় ভেঙে খায়, রোগা ও দুর্বল হয়ে পড়ে। পরিশ্রমী দেহের বেশি খাদ্য দরকার।"));
  };
  chips5(el, ".b5bc", b => { act = +b.dataset.i; draw(); });
  $("#b5bi", el).addEventListener("input", draw);
  draw();
};

/* 5.7 approved preservation or harmful adulterant? */
W.b5safe = (el) => {
  const IT = [
    [L2("Table salt on hilsa (nona ilish)", "ইলিশে খাবার লবণ (লোনা ইলিশ)"), 1, L2("Sodium chloride is an approved preservative. Salt draws water out of microbes, so they cannot grow.", "সোডিয়াম ক্লোরাইড অনুমোদিত সংরক্ষক। লবণ অণুজীবের কোষ থেকে পানি টেনে নেয়, তাই তারা বাড়তে পারে না।")],
    [L2("Formalin on fish", "মাছে ফরমালিন"), 0, L2("Formalin is for preserving dead bodies. It forms a compound inside the fish that washing cannot remove, and it can cause cancer.", "ফরমালিন মৃতদেহ সংরক্ষণের রাসায়নিক। এটি মাছের ভেতরে যৌগ তৈরি করে, যা ধুলেও যায় না, আর ক্যান্সার ঘটাতে পারে।")],
    [L2("Sodium benzoate in sauce, in the permitted amount", "সসে অনুমোদিত মাত্রায় সোডিয়াম বেনজোয়েট"), 1, L2("It is on the approved list. It stops bacteria and fungi from multiplying. The amount must stay within the limit.", "এটি অনুমোদিত তালিকায় আছে। ব্যাকটেরিয়া ও ছত্রাকের বংশবৃদ্ধি থামায়। মাত্রা অবশ্যই সীমার মধ্যে থাকতে হবে।")],
    [L2("Textile dye in an ice lolly", "গোলা আইসক্রিমে কাপড়ের রং"), 0, L2("Commercial dyes are made for cloth, not food. They slowly damage the liver.", "বাণিজ্যিক রং কাপড়ের জন্য, খাদ্যের জন্য নয়। এগুলো ধীরে ধীরে যকৃতের ক্ষতি করে।")],
    [L2("Keeping fish on ice", "মাছ বরফে রাখা"), 1, L2("Cold slows the enzymes of microbes. Nothing harmful is added to the food.", "ঠান্ডায় অণুজীবের এনজাইম ধীর হয়ে পড়ে। খাদ্যে ক্ষতিকর কিছুই মেশানো হয় না।")],
    [L2("Carbide to ripen mangoes fast", "আম তাড়াতাড়ি পাকাতে কারবাইড"), 0, L2("An unapproved chemical. Fruit should be given time to ripen naturally.", "অননুমোদিত রাসায়নিক। ফলকে প্রাকৃতিকভাবে পাকার সময় দিতে হবে।")],
    [L2("Drying fish in the sun (shutki)", "রোদে মাছ শুকানো (শুঁটকি)"), 1, L2("Drying removes the water that microbes need. It is a traditional, safe method.", "শুকালে অণুজীবের দরকারি পানি চলে যায়। এটি প্রচলিত ও নিরাপদ উপায়।")],
    [L2("DDT sprinkled on dried fish", "শুঁটকিতে DDT ছিটানো"), 0, L2("DDT is an insecticide. Its poison stays in the fish and harms children most of all.", "DDT একটি কীটনাশক। এর বিষ মাছে থেকে যায় আর সবচেয়ে বেশি ক্ষতি করে শিশুদের।")]];
  let i = 0, score = 0, done = false;
  el.innerHTML = `<p class="hint" id="b5sp" style="margin:0 0 6px"></p><div class="w-out" id="b5sq" style="font-weight:600;min-height:3.2em"></div>
    <div class="w-row" style="margin:10px 0"><button class="btn solid" data-a="1">${L2("Approved way", "অনুমোদিত উপায়")}</button><button class="btn" data-a="0">${L2("Harmful adulterant", "ক্ষতিকর ভেজাল")}</button></div>
    <div class="w-out" id="b5so" style="min-height:4.4em"></div><div class="w-row" style="margin-top:8px"><button class="btn" id="b5sn">${L2("Next", "পরেরটি")} →</button></div>`;
  const show = () => {
    if (i >= IT.length) {
      $("#b5sp", el).textContent = L2("Finished", "শেষ");
      $("#b5sq", el).innerHTML = L2(`You sorted ${score} of ${IT.length} correctly.`, `${B5(IT.length)}টির মধ্যে ${B5(score)}টি ঠিকভাবে বাছাই করেছ।`);
      $("#b5so", el).innerHTML = L2("The test is always the same: does the method keep the food safe, or does it only make bad food look good?", "যাচাইয়ের প্রশ্ন সব সময় একটাই: উপায়টি খাদ্যকে নিরাপদ রাখছে, নাকি শুধু খারাপ খাদ্যকে ভালো দেখাচ্ছে?");
      $("#b5sn", el).textContent = L2("Start again", "আবার শুরু");
      return;
    }
    done = false;
    $("#b5sp", el).textContent = L2(`Item ${i + 1} of ${IT.length}`, `${B5(IT.length)}টির মধ্যে ${B5(i + 1)} নম্বর`);
    $("#b5sq", el).textContent = IT[i][0];
    $("#b5so", el).innerHTML = `<span class="muted">${L2("Which is it? Choose one.", "কোনটি? একটি বেছে নাও।")}</span>`;
    $("#b5sn", el).innerHTML = L2("Next", "পরেরটি") + " →";
  };
  el.querySelectorAll("button[data-a]").forEach(b => b.addEventListener("click", () => {
    if (i >= IT.length || done) return;
    done = true;
    const right = +b.dataset.a === IT[i][1];
    if (right) score++;
    $("#b5so", el).innerHTML = `<b style="color:var(--${right ? "good" : "bad"})">${right ? L2("Correct.", "ঠিক বলেছ।") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${IT[i][1] ? L2("Approved way of preserving food.", "খাদ্য সংরক্ষণের অনুমোদিত উপায়।") : L2("Harmful adulterant.", "ক্ষতিকর ভেজাল।")} ${IT[i][2]}`;
  }));
  $("#b5sn", el).addEventListener("click", () => { if (i >= IT.length) { i = 0; score = 0; } else i++; show(); });
  show();
};

/* shared drawing of the gut for 5.8 and 5.9 (viewBox 0 0 360 400) */
const gut5 = (hl) => {
  const on = k => hl.includes(k);
  const tube = (k, d, w, col) => `<g data-k="${k}" style="cursor:pointer"><path d="${d}" fill="none" stroke="${on(k) ? "var(--bad)" : "var(--ink)"}" stroke-width="${w + (on(k) ? 7 : 3)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const st = k => on(k) ? `stroke="var(--bad)" stroke-width="4"` : `stroke="var(--ink)" stroke-width="1.5"`;
  let s = "";
  s += tube("pharynx", "M180 40 V60", 15, "#e9a8a0");
  s += tube("oeso", "M180 64 C180 100 182 128 201 149", 8, "#e3b0a0");
  s += `<g data-k="liver" style="cursor:pointer"><path d="M70 170 C70 140 110 128 150 132 C175 134 190 142 196 152 C190 172 160 196 120 204 C90 208 70 196 70 170 Z" fill="#9c5a45" ${st("liver")}/></g>`;
  s += tube("duo", "M190 219 C168 214 141 218 141 236 C141 249 152 254 168 254", 11, "#edc3a2");
  s += `<path d="M118 218 C122 228 132 234 142 238" fill="none" stroke="#3f7a3a" stroke-width="3" stroke-linecap="round"/>`;
  s += `<g data-k="pancreas" style="cursor:pointer"><path d="M150 231 C170 222 216 222 250 230 C257 234 255 243 246 243 C216 239 176 241 153 245 C146 243 145 235 150 231 Z" fill="#e6c66a" ${st("pancreas")}/><path d="M240 236 C210 232 176 234 150 238" fill="none" stroke="#a8862a" stroke-width="2" stroke-linecap="round"/></g>`;
  s += `<g data-k="gall" style="cursor:pointer"><ellipse cx="116" cy="207" rx="9" ry="14" transform="rotate(18 116 207)" fill="#5a9a4a" ${st("gall")}/></g>`;
  s += `<g data-k="stomach" style="cursor:pointer"><path d="M198 146 C215 138 250 146 256 176 C260 204 236 228 208 226 C196 226 190 222 188 216 C200 214 214 204 212 190 C210 172 200 160 198 146 Z" fill="#e3a08f" ${st("stomach")}/></g>`;
  s += tube("small", "M168 254 C150 262 132 268 130 284 C128 296 232 286 232 298 C232 310 128 304 128 316 C128 328 232 322 232 334 C232 346 150 348 110 334", 10, "#f0cdae");
  s += tube("appendix", "M100 354 C97 364 93 370 86 375", 4, "#d9a27e");
  s += tube("large", "M100 352 V276 C100 264 108 260 120 260 H242 C256 260 262 266 262 278 V338 C262 352 244 358 220 360 C200 362 184 364 180 372", 15, "#d9a27e");
  s += tube("rectum", "M180 372 V386", 15, "#c98f6a");
  s += `<g data-k="anus" style="cursor:pointer"><circle cx="180" cy="394" r="5" fill="var(--ink)" ${on("anus") ? `stroke="var(--bad)" stroke-width="4"` : ""}/></g>`;
  s += `<g data-k="saliv" style="cursor:pointer">${[[140, 20, 9, 7], [148, 36, 8, 6], [163, 44, 7, 5]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#e6c66a" ${st("saliv")}/>`).join("")}</g>`;
  s += `<g data-k="mouth" style="cursor:pointer"><ellipse cx="184" cy="26" rx="30" ry="15" fill="#e9a0a0" ${st("mouth")}/><path d="M160 20 h6 v6 h-6 z M168 17 h6 v6 h-6 z M176 16 h6 v6 h-6 z M184 16 h6 v6 h-6 z M192 17 h6 v6 h-6 z M200 20 h6 v6 h-6 z" fill="var(--sheet)" stroke="var(--ink)" stroke-width="0.8"/><path d="M166 34 q18 -8 36 0" fill="none" stroke="#b3564f" stroke-width="4" stroke-linecap="round"/></g>`;
  return s;
};

/* 5.8 labelled alimentary canal and glands, plus a tooth in section */
W.b5canal = (el) => {
  const P = {
    mouth: [L2("Mouth and buccal cavity", "মুখ ও মুখগহ্বর"), L2("The canal begins here. Teeth chew the food, the tongue moves and tastes it, and saliva mixes with it.", "এখান থেকে নালির শুরু। দাঁত খাদ্য চিবায়, জিহ্বা নাড়াচাড়া করে ও স্বাদ নেয়, লালা এর সাথে মেশে।")],
    pharynx: [L2("Pharynx", "গলবিল"), L2("The part just behind the buccal cavity. Food passes through it into the oesophagus.", "মুখগহ্বরের ঠিক পরের অংশ। খাদ্য এর ভেতর দিয়ে অন্ননালিতে যায়।")],
    oeso: [L2("Oesophagus", "অন্ননালি"), L2("The tube from the pharynx to the stomach. Peristalsis pushes food down; no digestion happens here.", "গলবিল থেকে পাকস্থলী পর্যন্ত নালি। পেরিস্টালসিসে খাদ্য নিচে নামে; এখানে পরিপাক হয় না।")],
    stomach: [L2("Stomach", "পাকস্থলী"), L2("A thick-walled muscular bag. It churns food into chyme, and its gastric glands add hydrochloric acid and pepsin.", "পুরু, পেশিবহুল প্রাচীরের থলি। খাদ্যকে মন্থন করে পাকমণ্ড বানায়; এর গ্যাস্ট্রিক গ্রন্থি হাইড্রোক্লোরিক এসিড ও পেপসিন যোগ করে।")],
    duo: [L2("Duodenum", "ডিওডেনাম"), L2("The first part of the small intestine. Bile and pancreatic juice enter here through a common duct.", "ক্ষুদ্রান্ত্রের প্রথম অংশ। পিত্তরস ও অগ্ন্যাশয় রস একটি মিলিত নালি দিয়ে এখানে ঢোকে।")],
    small: [L2("Small intestine (jejunum and ileum)", "ক্ষুদ্রান্ত্র (জেজুনাম ও ইলিয়াম)"), L2("The long coiled tube. Its intestinal glands finish digestion, and its villi absorb the digested food.", "লম্বা প্যাঁচানো নল। এর আন্ত্রিক গ্রন্থি পরিপাক শেষ করে, আর ভিলাই পরিপাক হওয়া খাদ্য শোষণ করে।")],
    large: [L2("Large intestine (caecum and colon)", "বৃহদন্ত্র (সিকাম ও কোলন)"), L2("The wide tube around the small intestine. Mainly water is absorbed here and faeces are formed.", "ক্ষুদ্রান্ত্রকে ঘিরে থাকা মোটা নল। এখানে মূলত পানি শোষিত হয় আর মল তৈরি হয়।")],
    appendix: [L2("Appendix", "অ্যাপেনডিক্স"), L2("A small tube-like outgrowth attached to the caecum. Its infection is appendicitis.", "সিকামের সাথে যুক্ত ছোট নলের মতো প্রবৃদ্ধি। এর সংক্রমণই অ্যাপেনডিসাইটিস।")],
    rectum: [L2("Rectum", "মলাশয়"), L2("The last part of the large intestine. Faeces are stored here.", "বৃহদন্ত্রের শেষ অংশ। এখানে মল জমা থাকে।")],
    anus: [L2("Anus", "পায়ু"), L2("The opening at the end of the canal, through which faeces leave.", "নালির শেষ প্রান্তের ছিদ্রপথ; এ পথে মল বেরিয়ে যায়।")],
    saliv: [L2("Salivary glands", "লালাগ্রন্থি"), L2("Three pairs: parotid, submaxillary and sublingual. Saliva has mucin, which makes food slippery, and ptyalin, which starts to digest starch.", "তিন জোড়া: প্যারোটিড, সাবম্যাক্সিলারি ও সাবলিঙ্গুয়াল। লালায় থাকে মিউসিন, যা খাদ্যকে পিচ্ছিল করে, আর টায়ালিন, যা শ্বেতসারের পরিপাক শুরু করে।")],
    liver: [L2("Liver", "যকৃৎ"), L2("The largest gland. It makes bile (no enzyme), stores extra glucose as glycogen and turns extra amino acids into urea.", "সবচেয়ে বড় গ্রন্থি। পিত্তরস তৈরি করে (এনজাইম নেই), উদ্বৃত্ত গ্লুকোজকে গ্লাইকোজেন হিসেবে জমায়, অতিরিক্ত অ্যামাইনো এসিড থেকে ইউরিয়া তৈরি করে।")],
    gall: [L2("Gall bladder", "পিত্তথলি"), L2("A small sac under the liver. It stores the bile and sends it down the bile duct to the duodenum.", "যকৃতের নিচের ছোট থলি। পিত্তরস জমা রাখে আর পিত্তনালি দিয়ে ডিওডেনামে পাঠায়।")],
    pancreas: [L2("Pancreas", "অগ্ন্যাশয়"), L2("A mixed gland behind the stomach. Its juice has trypsin, lipase and amylase; it also releases the hormones insulin and glucagon into the blood.", "পাকস্থলীর পেছনের মিশ্রগ্রন্থি। এর রসে ট্রিপসিন, লাইপেজ ও অ্যামাইলেজ থাকে; এটি রক্তে ইনসুলিন ও গ্লুকাগন হরমোনও নিঃসরণ করে।")] };
  const CAN = ["mouth", "pharynx", "oeso", "stomach", "duo", "small", "large", "appendix", "rectum", "anus"], GL = ["saliv", "liver", "gall", "pancreas"];
  const SH = { mouth: L2("Mouth", "মুখ"), pharynx: P.pharynx[0], oeso: P.oeso[0], stomach: P.stomach[0], duo: P.duo[0], small: L2("Small intestine", "ক্ষুদ্রান্ত্র"), large: L2("Large intestine", "বৃহদন্ত্র"), appendix: P.appendix[0], rectum: P.rectum[0], anus: P.anus[0], saliv: P.saliv[0], liver: P.liver[0], gall: P.gall[0], pancreas: P.pancreas[0] };
  const TP = {
    crown: [L2("Crown", "মুকুট"), L2("The part of the tooth above the gum.", "মাড়ির ওপরের অংশ।")], neck: [L2("Neck", "গ্রীবা"), L2("The part between the crown and the root.", "মুকুট ও মূলের মাঝের অংশ।")], root: [L2("Root", "মূল"), L2("The part inside the gum.", "মাড়ির ভেতরের অংশ।")],
    enamel: [L2("Enamel", "এনামেল"), L2("The covering of the crown and the hardest substance of the tooth. It is made of calcium phosphate, calcium carbonate and fluoride.", "মুকুটের আবরণ, দাঁতের সবচেয়ে কঠিন উপাদান। ক্যালসিয়াম ফসফেট, ক্যালসিয়াম কার্বনেট ও ফ্লোরাইড দিয়ে তৈরি।")],
    dentine: [L2("Dentine", "ডেন্টিন"), L2("The hard material that forms most of the tooth.", "যে শক্ত উপাদানে দাঁতের বেশির ভাগ গঠিত।")],
    pulp: [L2("Pulp", "দন্তমজ্জা"), L2("The soft, hollow centre with an artery, a vein and nerves. It carries nourishment and oxygen to the dentine.", "ভেতরের ফাঁপা নরম অংশ; এতে ধমনি, শিরা ও স্নায়ু থাকে। ডেন্টিনে পুষ্টি ও অক্সিজেন পৌঁছে দেয়।")],
    cement: [L2("Cement", "সিমেন্ট"), L2("A thin layer over the dentine of the root. It fixes the tooth in the gum.", "মূল অংশে ডেন্টিনের ওপরের পাতলা আবরণ। দাঁতকে মাড়ির সাথে আটকে রাখে।")],
    gum: [L2("Gum", "মাড়ি"), L2("The soft tissue around the neck of the tooth.", "দাঁতের গ্রীবাকে ঘিরে থাকা নরম টিস্যু।")] };
  let view = "sys", sel = "mouth";
  el.innerHTML = `<div class="chipset b5cv" role="group"><button data-v="sys" aria-pressed="true">${L2("Digestive system", "পরিপাকতন্ত্র")}</button><button data-v="tooth" aria-pressed="false">${L2("Inside a tooth", "দাঁতের ভেতর")}</button></div>
    <div class="svgwrap fit" id="b5cs" style="margin-top:8px"></div><div class="w-out" id="b5co" style="margin:8px 0"></div><div id="b5cp"></div>`;
  const lab = (k, lines, x, y, a, tx, ty) => {
    const on = k === sel, c = on ? "var(--bad)" : "var(--ink)", w = Math.max(...lines.map(l => l.length)) * 6.4, ex = a === "start" ? x + Math.min(w, 84) + 3 : x - Math.min(w, 84) - 3;
    return `<g data-k="${k}" data-a="${a}" class="b5lab" style="cursor:pointer"><line x1="${ex}" y1="${y - 4 + (lines.length - 1) * 7}" x2="${tx}" y2="${ty}" stroke="${on ? "var(--bad)" : "var(--muted)"}" stroke-width="${on ? 2 : 1}"/><circle cx="${tx}" cy="${ty}" r="2.5" fill="${c}"/>${lines.map((l, i) => `<text x="${x}" y="${y + i * 14}" font-size="12.5" text-anchor="${a}" fill="${c}" font-weight="${on ? 700 : 400}">${l}</text>`).join("")}</g>`;
  };
  const sys = () => {
    let s = `<svg viewBox="0 0 360 402" role="img" aria-label="${L2("Human digestive system", "মানুষের পরিপাকতন্ত্র")}">` + gut5([sel]);
    const two = (en1, en2, bn) => LANG === "bn" ? [bn] : [en1, en2];
    s += lab("saliv", two("Salivary", "glands", "লালাগ্রন্থি"), 2, 14, "start", 136, 24);
    s += lab("liver", [SH.liver], 2, 138, "start", 86, 160);
    s += lab("gall", two("Gall", "bladder", "পিত্তথলি"), 2, 212, "start", 110, 210);
    s += lab("duo", [SH.duo], 2, 250, "start", 139, 240);
    s += lab("large", two("Large", "intestine", "বৃহদন্ত্র"), 2, 296, "start", 95, 306);
    s += lab("appendix", [SH.appendix], 2, 390, "start", 88, 374);
    s += lab("mouth", [SH.mouth], 358, 16, "end", 212, 24);
    s += lab("pharynx", [SH.pharynx], 358, 54, "end", 188, 52);
    s += lab("oeso", [SH.oeso], 358, 100, "end", 186, 104);
    s += lab("stomach", [SH.stomach], 358, 172, "end", 252, 178);
    s += lab("pancreas", [SH.pancreas], 358, 226, "end", 252, 236);
    s += lab("small", two("Small", "intestine", "ক্ষুদ্রান্ত্র"), 358, 300, "end", 228, 310);
    s += lab("rectum", [SH.rectum], 358, 372, "end", 189, 380);
    s += lab("anus", [SH.anus], 358, 396, "end", 186, 394);
    return s + `</svg>`;
  };
  const tooth = () => {
    const on = k => k === sel, st = k => on(k) ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.5"`;
    const OUT = "M120 120 C104 84 112 42 150 36 C164 34 172 46 180 46 C188 46 196 34 210 36 C248 42 256 84 240 120 L236 146 C234 180 228 208 220 216 C212 210 206 184 200 164 C196 150 184 146 180 156 C176 146 164 150 160 164 C154 184 148 210 140 216 C132 208 126 180 124 146 Z";
    const DEN = "M130 120 C117 88 123 55 152 48 C164 47 172 57 180 57 C188 57 196 47 208 48 C237 55 243 88 230 120 L231 146 C229 178 225 200 220 208 C215 200 210 180 205 162 C200 142 186 138 180 148 C174 138 160 142 155 162 C150 180 145 200 140 208 C135 200 131 178 129 146 Z";
    const PUL = "M160 102 C158 84 170 76 180 78 C190 76 202 84 200 102 C202 124 211 150 215 176 C217 190 219 198 220 202 C215 196 211 186 207 170 C203 150 190 128 180 128 C170 128 157 150 153 170 C149 186 145 196 140 202 C141 198 143 190 145 176 C149 150 158 124 160 102 Z";
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("Section of a tooth", "দাঁতের লম্বচ্ছেদ")}"><defs><clipPath id="b5tc"><path d="${OUT}"/></clipPath><clipPath id="b5te"><rect x="90" y="10" width="180" height="113"/></clipPath><clipPath id="b5tm"><rect x="90" y="123" width="180" height="110"/></clipPath></defs>`;
    s += `<rect x="92" y="146" width="176" height="96" rx="8" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>`;
    s += `<g data-k="gum" style="cursor:pointer"><path d="M92 128 C104 112 116 112 124 124 L124 150 H92 Z M268 128 C256 112 244 112 236 124 L236 150 H268 Z" fill="#e39a9a" ${st("gum")}/></g>`;
    s += `<g clip-path="url(#b5tc)"><g data-k="enamel" style="cursor:pointer"><rect x="100" y="20" width="160" height="104" fill="#f1ead8"/></g><g data-k="cement" style="cursor:pointer"><rect x="100" y="124" width="160" height="100" fill="#c9a66b"/></g></g>`;
    s += `<path d="${OUT}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>` + (on("enamel") || on("cement") ? `<path d="${OUT}" fill="none" stroke="var(--bad)" stroke-width="3.5" clip-path="url(#${on("enamel") ? "b5te" : "b5tm"})"/>` : "");
    s += `<g data-k="dentine" style="cursor:pointer"><path d="${DEN}" fill="#e6cf9a" ${st("dentine")}/></g><g data-k="pulp" style="cursor:pointer"><path d="${PUL}" fill="#e9a0a8" ${st("pulp")}/><path d="M142 198 C150 170 164 130 176 96" fill="none" stroke="#b3372f" stroke-width="2"/><path d="M218 198 C210 170 196 130 184 96" fill="none" stroke="#3b6fb0" stroke-width="2"/><path d="M146 196 C156 168 170 134 180 104" fill="none" stroke="#b08a1a" stroke-width="1.5" stroke-dasharray="4 3"/></g>`;
    const br = (k, y1, y2, t) => `<g data-k="${k}" style="cursor:pointer"><path d="M84 ${y1} h-8 V${y2} h8" fill="none" stroke="${on(k) ? "var(--bad)" : "var(--muted)"}" stroke-width="${on(k) ? 2.5 : 1.5}"/>${T5(70, (y1 + y2) / 2 + 4, t, "end", 12.5, on(k) ? "var(--bad)" : "var(--ink)", on(k) ? "700" : "")}</g>`;
    s += br("crown", 36, 112, TP.crown[0]) + br("neck", 116, 144, TP.neck[0]) + br("root", 148, 216, TP.root[0]);
    s += lab("enamel", [TP.enamel[0]], 358, 40, "end", 240, 62) + lab("dentine", [TP.dentine[0]], 358, 82, "end", 226, 96) + lab("pulp", [TP.pulp[0]], 358, 118, "end", 196, 112) + lab("gum", [TP.gum[0]], 358, 150, "end", 258, 134) + lab("cement", [TP.cement[0]], 358, 196, "end", 231, 186);
    return s + `</svg>`;
  };
  const put = () => {
    const sy = view === "sys", M = sy ? P : TP, p = M[sel];
    $("#b5cs", el).innerHTML = sy ? sys() : tooth();
    $("#b5co", el).innerHTML = `<b>${p[0]}</b><br>${p[1]}`;
    el.querySelectorAll("#b5cs .b5lab").forEach(g => { try { const ln = g.querySelector("line"); let x0 = 1e9, x1 = -1e9; g.querySelectorAll("text").forEach(t => { const b = t.getBBox(); x0 = Math.min(x0, b.x); x1 = Math.max(x1, b.x + b.width); }); if (x1 > x0) ln.setAttribute("x1", g.dataset.a === "start" ? x1 + 4 : x0 - 4); } catch (e) {} });
    el.querySelectorAll("#b5cp button").forEach(b => b.setAttribute("aria-pressed", b.dataset.k === sel));
    el.querySelectorAll("#b5cs [data-k]").forEach(g => g.addEventListener("click", () => { if (M[g.dataset.k]) { sel = g.dataset.k; put(); } }));
  };
  const setView = () => {
    const row = (ks, M) => `<div class="chipset" role="group">${ks.map(k => `<button data-k="${k}" aria-pressed="false">${M[k]}</button>`).join("")}</div>`;
    $("#b5cp", el).innerHTML = view === "sys" ? `<p class="hint" style="margin:0 0 4px">${L2("Alimentary canal:", "পৌষ্টিকনালি:")}</p>${row(CAN, SH)}<p class="hint" style="margin:8px 0 4px">${L2("Digestive glands:", "পরিপাক গ্রন্থি:")}</p>${row(GL, SH)}` : row(Object.keys(TP), Object.fromEntries(Object.keys(TP).map(k => [k, TP[k][0]])));
    el.querySelectorAll("#b5cp button").forEach(b => b.addEventListener("click", () => { sel = b.dataset.k; put(); }));
    sel = view === "sys" ? "mouth" : "enamel"; put();
  };
  chips5(el, ".b5cv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 5.8.3 the journey of a meal: digestion, absorption, faeces */
W.b5digest = (el) => {
  /* [name, juice, starch%, protein%, fat% still undigested, starch product, protein product, fat product, surroundings, text] */
  const none = L2("no change yet", "এখনো পরিবর্তন নেই");
  const ST = [
    [L2("Mouth", "মুখ"), L2("Saliva: ptyalin", "লালা: টায়ালিন"), 85, 100, 100, L2("some → maltose", "কিছুটা → মলটোজ"), none, none, L2("nearly neutral", "প্রায় নিরপেক্ষ"), L2("Teeth cut and grind the food. Ptyalin of saliva begins to change starch into maltose. Protein and fat are not changed.", "দাঁত খাদ্য কাটে ও পেষে। লালার টায়ালিন শ্বেতসারকে মলটোজে পরিণত করা শুরু করে। আমিষ ও স্নেহের পরিবর্তন হয় না।")],
    [L2("Oesophagus", "অন্ননালি"), L2("No juice", "কোনো রস নেই"), 85, 100, 100, L2("no further change", "নতুন পরিবর্তন নেই"), none, none, L2("nearly neutral", "প্রায় নিরপেক্ষ"), L2("Peristalsis, a wave of muscle contraction and relaxation, pushes the food to the stomach. No digestion takes place here.", "পেরিস্টালসিস, অর্থাৎ পেশির সংকোচন-প্রসারণের ঢেউ, খাদ্যকে পাকস্থলীতে ঠেলে নেয়। এখানে কোনো পরিপাক হয় না।")],
    [L2("Stomach", "পাকস্থলী"), L2("Gastric juice: HCl, pepsin", "গ্যাস্ট্রিক রস: HCl, পেপসিন"), 85, 55, 100, L2("no further change", "নতুন পরিবর্তন নেই"), L2("→ polypeptides", "→ পলিপেপটাইড"), none, L2("strongly acidic", "তীব্র অম্লীয়"), L2("Hydrochloric acid kills bacteria and turns pepsinogen into pepsin. Pepsin breaks protein into polypeptides. Churning makes the soup-like chyme.", "হাইড্রোক্লোরিক এসিড ব্যাকটেরিয়া মারে আর পেপসিনোজেনকে পেপসিন করে। পেপসিন আমিষকে পলিপেপটাইডে ভাঙে। মন্থনে তৈরি হয় স্যুপের মতো পাকমণ্ড।")],
    [L2("Small intestine: digestion", "ক্ষুদ্রান্ত্র: পরিপাক"), L2("Bile, pancreatic juice, intestinal juice", "পিত্তরস, অগ্ন্যাশয় রস, আন্ত্রিক রস"), 0, 0, 0, L2("→ glucose", "→ গ্লুকোজ"), L2("→ amino acids", "→ অ্যামাইনো এসিড"), L2("→ fatty acids + glycerol", "→ ফ্যাটি এসিড + গ্লিসারল"), L2("alkaline", "ক্ষারীয়"), L2("Bile neutralises the acid and breaks fat into tiny droplets. Amylase and maltase give glucose, trypsin gives amino acids, lipase gives fatty acids and glycerol.", "পিত্তরস অম্লভাব প্রশমিত করে আর চর্বিকে ক্ষুদ্র দানায় ভাঙে। অ্যামাইলেজ ও মলটেজ দেয় গ্লুকোজ, ট্রিপসিন দেয় অ্যামাইনো এসিড, লাইপেজ দেয় ফ্যাটি এসিড ও গ্লিসারল।")],
    [L2("Small intestine: absorption", "ক্ষুদ্রান্ত্র: শোষণ"), "", 0, 0, 0, "", "", "", "", L2("The villi of the ileum absorb the digested food. Glucose and amino acids enter the blood capillaries and go to the liver by the hepatic portal vein. Fat enters the lacteal and travels in the lymph.", "ইলিয়ামের ভিলাই পরিপাক হওয়া খাদ্য শোষণ করে। গ্লুকোজ ও অ্যামাইনো এসিড রক্তজালকে ঢুকে হেপাটিক পোর্টাল শিরা দিয়ে যকৃতে যায়। স্নেহ ল্যাকটিয়ালে ঢুকে লসিকায় বাহিত হয়।")],
    [L2("Large intestine", "বৃহদন্ত্র"), "", 0, 0, 0, "", "", "", "", L2("No digestion happens here. Water and salts are absorbed into the blood, bacteria act on the undigested remains, and faeces are formed and stored in the rectum.", "এখানে পরিপাক হয় না। পানি ও লবণ শোষিত হয়ে রক্তে যায়, ব্যাকটেরিয়া অপাচ্য অংশের ওপর কাজ করে, আর মল তৈরি হয়ে মলাশয়ে জমা থাকে।")]];
  let i = 0;
  el.innerHTML = `<div class="svgwrap fit" id="b5gs"></div><div class="w-row" style="margin:8px 0"><button class="btn" id="b5gp">← ${L2("Back", "আগের ধাপ")}</button><button class="btn solid" id="b5gn">${L2("Next stop", "পরের ধাপ")} →</button></div><div class="w-out" id="b5go"></div>`;
  const draw = () => {
    const S = ST[i];
    let s = `<svg viewBox="0 0 360 248" role="img" aria-label="${L2("Journey of a meal through the alimentary canal", "পৌষ্টিকনালিতে খাদ্যের যাত্রা")}">${arrowDefs("b5ga", "var(--bad)")}${arrowDefs("b5gb", "#a8862a")}${arrowDefs("b5gw", PROT5)}`;
    s += `<line x1="30" y1="22" x2="330" y2="22" stroke="var(--rule)" stroke-width="4"/>`;
    ST.forEach((_, j) => { const x = 30 + j * 60, on = j === i; s += `<g data-j="${j}" style="cursor:pointer"><circle cx="${x}" cy="22" r="${on ? 15 : 12}" fill="${j <= i ? "var(--c)" : "var(--paper)"}" stroke="${on ? "var(--ink)" : "var(--c)"}" stroke-width="${on ? 3 : 1.5}"/>${T5(x, 27, B5(j + 1), "middle", 13, j <= i ? "var(--sheet)" : "var(--ink)", "700")}</g>`; });
    s += T5(180, 60, `${B5(i + 1)}. ${S[0]}`, "middle", 15, "var(--c)", "700");
    if (i < 4) {
      s += T5(180, 78, S[1], "middle", 12.5, "var(--muted)");
      [[L2("Starch", "শ্বেতসার"), S[2], S[5], CARB5], [L2("Protein", "আমিষ"), S[3], S[6], PROT5], [L2("Fat", "স্নেহ"), S[4], S[7], FAT5]].forEach((b, n) => {
        const y = 92 + n * 44, w = 246 * b[1] / 100;
        s += T5(8, y + 14, b[0], "start", 13, "var(--ink)", "700") + `<rect x="104" y="${y}" width="246" height="18" rx="5" fill="var(--c-soft)" stroke="var(--rule)" stroke-width="1"/>` + (w > 0 ? `<rect x="104" y="${y}" width="${w}" height="18" rx="5" fill="${b[3]}"/>` : "");
        s += T5(350, y + 34, `${L2("undigested", "অপরিপাককৃত")} ${B5(b[1])}% · ${b[2]}`, "end", 12.5, "var(--muted)");
      });
      s += T5(8, 240, `${L2("Surroundings", "পরিবেশ")}: ${S[8]}`, "start", 13, "var(--ink)", "700");
    } else if (i === 4) {
      s += `<path d="M20 232 H110 V120 C110 60 190 60 190 120 V232 H340" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2"/>`;
      s += `<path d="M126 232 V124 C126 86 174 86 174 124 V232" fill="none" stroke="#b3372f" stroke-width="3"/><path d="M150 232 V112" stroke="#c9a62a" stroke-width="7" stroke-linecap="round"/>`;
      s += T5(268, 224, L2("one villus", "একটি ভিলাস"), "middle", 13, "var(--ink)", "700");
      s += `<line x1="86" y1="130" x2="120" y2="140" stroke="var(--bad)" stroke-width="2.5" marker-end="url(#b5ga)"/>` + T5(4, 108, L2("glucose,", "গ্লুকোজ,"), "start", 13) + T5(4, 123, L2("amino acids", "অ্যামাইনো এসিড"), "start", 13);
      s += T5(204, 108, L2("blood capillaries", "রক্তজালক"), "start", 13.5, "#b3372f", "700") + T5(204, 124, L2("→ hepatic portal vein", "→ হেপাটিক পোর্টাল শিরা"), "start", 13) + T5(204, 140, L2("→ liver", "→ যকৃৎ"), "start", 13) + `<line x1="200" y1="104" x2="178" y2="112" stroke="#b3372f" stroke-width="1.5"/>`;
      s += `<line x1="86" y1="186" x2="141" y2="178" stroke="#a8862a" stroke-width="2.5" marker-end="url(#b5gb)"/>` + T5(4, 176, L2("fatty acids,", "ফ্যাটি এসিড,"), "start", 13) + T5(4, 191, L2("glycerol", "গ্লিসারল"), "start", 13);
      s += T5(204, 176, L2("lacteal", "ল্যাকটিয়াল"), "start", 13.5, "#a8862a", "700") + T5(204, 192, L2("→ lymph → blood", "→ লসিকা → রক্ত"), "start", 13) + `<line x1="200" y1="172" x2="155" y2="166" stroke="#a8862a" stroke-width="1.5"/>`;
    } else {
      s += `<path d="M30 130 H260 C300 130 300 200 260 200 H250" fill="none" stroke="var(--ink)" stroke-width="35" stroke-linecap="round"/><path d="M30 130 H260 C300 130 300 200 260 200 H250" fill="none" stroke="#d9a27e" stroke-width="30" stroke-linecap="round"/>`;
      [70, 130, 190].forEach(x => { s += `<line x1="${x}" y1="118" x2="${x}" y2="92" stroke="${PROT5}" stroke-width="2.5" marker-end="url(#b5gw)"/>`; });
      s += T5(130, 84, L2("water + salts → blood", "পানি + লবণ → রক্ত"), "middle", 12.5, PROT5, "700");
      [[60, 132], [96, 126], [140, 134], [176, 128], [214, 133]].forEach(([x, y]) => { s += `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="var(--good)" opacity=".8"/>`; });
      s += T5(130, 166, L2("bacteria act on the remains", "অপাচ্য অংশে ব্যাকটেরিয়ার কাজ"), "middle", 12, "var(--muted)");
      s += `<ellipse cx="262" cy="200" rx="16" ry="10" fill="${BROWN5}"/>` + T5(200, 236, L2("faeces → rectum → anus", "মল → মলাশয় → পায়ু"), "middle", 12.5, "var(--ink)", "700");
    }
    $("#b5gs", el).innerHTML = s + `</svg>`;
    $("#b5go", el).innerHTML = `<b>${S[0]}</b>${S[1] ? ` <span class="muted">· ${S[1]}</span>` : ""}<br>${S[9]}` + (i < 4 ? `<br><span class="muted">${L2("The lengths of the bars are only illustrative.", "বারগুলোর দৈর্ঘ্য শুধু ধারণা দেওয়ার জন্য, মাপা মান নয়।")}</span>` : "");
    el.querySelectorAll("#b5gs [data-j]").forEach(g => g.addEventListener("click", () => { i = +g.dataset.j; draw(); }));
    $("#b5gp", el).disabled = i === 0; $("#b5gn", el).disabled = i === ST.length - 1;
  };
  $("#b5gp", el).addEventListener("click", () => { if (i > 0) { i--; draw(); } });
  $("#b5gn", el).addEventListener("click", () => { if (i < ST.length - 1) { i++; draw(); } });
  draw();
};

/* 5.9 gut problems: where, why, signs, prevention */
W.b5ills = (el) => {
  const c = L2("Cause", "কারণ"), g = L2("Signs", "লক্ষণ"), p = L2("Prevention", "প্রতিরোধ"), todo = L2("What to do", "করণীয়");
  const IL = {
    dy: [L2("Dyspepsia", "অজীর্ণতা"), ["stomach"], [[c, L2("Many: infection of the stomach, low mood, diseases of the pancreas or thyroid.", "নানা কারণ: পাকস্থলীতে সংক্রমণ, বিষণ্নতা, অগ্ন্যাশয় বা থাইরয়েডের রোগ।")], [g, L2("Pain in the upper abdomen, bloating, heartburn, sour belching, nausea.", "পেটের ওপরের দিকে ব্যথা, পেট ফাঁপা, বুক জ্বালা, টক ঢেকুর, বমি বমি ভাব।")], [p, L2("Do not overeat; chew slowly and well; do not smoke. Sudden trouble after the age of 40 may be a heart attack: go to hospital.", "অতিভোজন নয়; আস্তে আস্তে ভালো করে চিবিয়ে খাও; ধূমপান নয়। চল্লিশের পর হঠাৎ এমন হলে হার্ট অ্যাটাকও হতে পারে: হাসপাতালে নিতে হবে।")]]],
    ds: [L2("Dysentery", "আমাশয়"), ["large"], [[c, L2("<i>Entamoeba histolytica</i> (protozoan) or <i>Shigella</i> (bacterium).", "<i>Entamoeba histolytica</i> (প্রোটোজোয়া) বা সিগেলা (<i>Shigella</i>, ব্যাকটেরিয়া)।")], [g, L2("Frequent stools with mucus, often blood; abdominal pain.", "ঘন ঘন মলত্যাগ, মলে শ্লেষ্মা, প্রায়ই রক্ত; পেটে ব্যথা।")], [p, L2("Safe water; wash fruit and vegetables; soap after the toilet; sanitary latrine.", "বিশুদ্ধ পানি; ফল ও শাকসবজি ধোয়া; মলত্যাগের পর সাবান; স্বাস্থ্যসম্মত পায়খানা।")]]],
    co: [L2("Constipation", "কোষ্ঠকাঠিন্য"), ["large", "rectum"], [[c, L2("Stool moves slowly and too much water is absorbed; little roughage, little movement, holding back the urge.", "মল ধীরে এগোয়, বেশি পানি শোষিত হয়; আঁশ ও নড়াচড়া কম, বেগ চেপে রাখা।")], [g, L2("Hard stool, or none for two or more days; discomfort and pain.", "শক্ত পায়খানা, বা দুই দিন বা তার বেশি না হওয়া; অস্বস্তি ও ব্যথা।")], [p, L2("Roughage-rich vegetables and fruits, plenty of water, walking, a regular habit.", "আঁশযুক্ত শাকসবজি ও ফল, প্রচুর পানি, হাঁটাচলা, নিয়মিত অভ্যাস।")]]],
    ul: [L2("Peptic ulcer", "পেপটিক আলসার"), ["stomach", "duo"], [[c, L2("Mainly the bacterium <i>Helicobacter pylori</i>; irregular meals and excess acid add to it.", "প্রধানত <i>Helicobacter pylori</i> ব্যাকটেরিয়া; খাওয়ায় অনিয়ম ও অম্লের আধিক্যও দায়ী।")], [g, L2("Dull pain just above the navel, worse on an empty stomach; sometimes vomiting, blood in vomit or stool.", "নাভির একটু ওপরে একঘেয়ে ব্যথা, খালি পেটে বাড়ে; কখনো বমি, বমি বা মলে রক্ত।")], [p, L2("Regular, easily digested meals; less oil and spice; no smoking. Full cure: antibiotics on a doctor's advice.", "নিয়মিত সহজপাচ্য খাবার; তেল-মশলা কম; ধূমপান নয়। পূর্ণ আরোগ্যে ডাক্তারের পরামর্শে অ্যান্টিবায়োটিক।")]]],
    ap: [L2("Appendicitis", "অ্যাপেনডিসাইটিস"), ["appendix"], [[c, L2("Infection of the appendix, the small pouch on the caecum.", "সিকামের সাথে যুক্ত ছোট থলে অ্যাপেনডিক্সের সংক্রমণ।")], [g, L2("Pain around the navel that moves in a few hours to the lower right abdomen; vomiting, no appetite.", "নাভির চারদিকের ব্যথা কয়েক ঘণ্টায় তলপেটের ডান দিকে সরে যায়; বমি, ক্ষুধামান্দ্য।")], [todo, L2("See a doctor at once. The appendix may need to be removed by surgery; if it bursts, life is in danger.", "দ্রুত ডাক্তার দেখাও। অস্ত্রোপচারে অ্যাপেনডিক্স অপসারণ করতে হতে পারে; ফেটে গেলে জীবনের ঝুঁকি।")]]],
    wo: [L2("Worm diseases", "কৃমিজনিত রোগ"), ["small"], [[c, L2("Roundworm, threadworm and tapeworm living as parasites in the intestine.", "অন্ত্রে পরজীবী হিসেবে থাকা গোলকৃমি, সুতাকৃমি ও ফিতাকৃমি।")], [g, L2("Abdominal pain, weakness, no appetite, pale face, anaemia, swollen belly.", "পেটে ব্যথা, দুর্বলতা, অরুচি, ফ্যাকাশে চেহারা, রক্তাল্পতা, পেট ফোলা।")], [p, L2("Wash raw fruit and hands; sanitary latrine; wear footwear; eat well-cooked food.", "কাঁচা ফল ও হাত ধোয়া; স্বাস্থ্যসম্মত পায়খানা; খালি পায়ে না হাঁটা; ভালো করে সিদ্ধ খাবার।")]]],
    di: [L2("Diarrhoea", "ডায়রিয়া"), ["small", "large"], [[c, L2("Viruses (rotavirus), bacteria or protozoa from dirty water, food and hands.", "দূষিত পানি, খাবার ও হাত থেকে আসা ভাইরাস (রোটা ভাইরাস), ব্যাকটেরিয়া বা প্রোটোজোয়া।")], [g, L2("Loose stools three or more times a day; thirst, dry mouth, sunken eyes: water and salts are lost.", "দিনে তিনবার বা তার বেশি পাতলা পায়খানা; পিপাসা, মুখ শুকনো, চোখ বসা: পানি ও লবণ বেরিয়ে যায়।")], [todo, L2("Start oral saline at once and continue even after vomiting; keep feeding. Hospital if the patient cannot drink.", "সাথে সাথে খাবার স্যালাইন শুরু করো, বমি হলেও চালিয়ে যাও; খাওয়ানো বন্ধ নয়। পান করতে না পারলে হাসপাতালে নাও।")]]] };
  const PN = { stomach: L2("stomach", "পাকস্থলী"), duo: L2("duodenum", "ডিওডেনাম"), large: L2("large intestine", "বৃহদন্ত্র"), rectum: L2("rectum", "মলাশয়"), appendix: L2("appendix", "অ্যাপেনডিক্স"), small: L2("small intestine", "ক্ষুদ্রান্ত্র") };
  let sel = "dy";
  el.innerHTML = `<div class="chipset b5ic" role="group">${Object.keys(IL).map((k, i) => `<button data-k="${k}" aria-pressed="${i === 0}">${IL[k][0]}</button>`).join("")}</div><div class="svgwrap fit" id="b5is" style="margin-top:8px"></div><div class="w-out" id="b5io" style="margin-top:8px"></div>`;
  const draw = () => {
    const d = IL[sel];
    let s = `<svg viewBox="0 0 360 256" role="img" aria-label="${d[0]}"><g transform="translate(118 2) scale(0.63)">${gut5(d[1])}${d[1].includes("appendix") ? `<circle cx="92" cy="366" r="24" fill="none" stroke="var(--bad)" stroke-width="4" stroke-dasharray="7 5"/>` : ""}</g>`;
    s += T5(6, 22, d[0], "start", 15, "var(--bad)", "700") + T5(6, 46, L2("Where:", "কোথায়:"), "start", 13.5, "var(--muted)");
    d[1].forEach((k, n) => { s += T5(6, 66 + n * 19, PN[k], "start", 14, "var(--ink)", "700"); });
    s += `<rect x="6" y="226" width="16" height="10" rx="2" fill="none" stroke="var(--bad)" stroke-width="3"/>` + T5(28, 236, L2("red outline =", "লাল রেখা ="), "start", 13, "var(--muted)") + T5(6, 252, L2("part affected", "আক্রান্ত অংশ"), "start", 13, "var(--muted)") + `</svg>`;
    $("#b5is", el).innerHTML = s;
    $("#b5io", el).innerHTML = d[2].map(r => `<b>${r[0]}:</b> ${r[1]}`).join("<br>");
  };
  chips5(el, ".b5ic", b => { sel = b.dataset.k; draw(); });
  draw();
};
