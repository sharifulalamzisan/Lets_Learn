/* ---- biology chapter 13 widgets: environment of life ---- */
const B13 = x => bnNum(x, LANG);
const chips13 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
/* text: sizes below 13.5 are raised to 13.5, so that it stays 12 px or more when the 360-wide drawing is shown about 320 px wide */
const T13 = (x, y, s, a = "middle", sz = 13.5, c = "var(--ink)", w = "", halo = false) => `<text x="${x}" y="${y}" font-size="${Math.max(sz, 13.5)}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${halo ? ` paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"` : ""}>${s}</text>`;
const ok13 = (good, html) => `<span style="color:var(--${good ? "good" : "bad"});font-weight:700">${good ? "✓" : "✗"}</span> ${html}`;
const shuf13 = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const GRN13 = "#4f9d58", WAT13 = "#4a90c8", EARTH13 = "#b08a5a", MUD13 = "#7a5a3a", SUN13 = "#f2b632", HEAT13 = "#d1492e", NRG13 = "#d9822b", ZOO13 = "#d98a3d";
/* whole numbers with a thin gap: 10 000 in English, 1 00 000 (lakh grouping) in Bangla; small values keep up to 3 significant figures */
const num13 = v => {
  if (v < 1) return B13(String(+v.toPrecision(3)));
  let s = String(Math.round(v));
  if (s.length > 4) s = LANG === "bn" ? s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, " ") + " " + s.slice(-3) : s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return B13(s);
};
/* sorting game: items = [text, category key, reason]; cats = [key, label] */
const sort13 = (body, items, cats, o) => {
  let order = [], k = 0, right = 0, answered = false;
  const name = key => cats.find(c => c[0] === key)[1];
  const show = () => {
    if (k >= order.length) {
      body.innerHTML = `<div class="w-out"><b>${L2("Finished!", "শেষ!")}</b> ${L2(`You got ${right} out of ${order.length} right.`, `${B13(order.length)}টির মধ্যে ${B13(right)}টি ঠিক হয়েছে।`)}${o.end ? "<br>" + o.end : ""}</div><div class="w-row" style="margin-top:10px"><button class="btn solid" data-re="1">${L2("Play again", "আবার খেলো")}</button></div>`;
      body.querySelector("[data-re]").addEventListener("click", start); return;
    }
    const t = order[k]; answered = false;
    body.innerHTML = `<p class="hint" style="margin:0 0 6px">${B13(k + 1)} / ${B13(order.length)} · ${L2(`${right} right so far`, `এ পর্যন্ত ${B13(right)}টি ঠিক`)}</p>
      <div class="w-out" style="font-size:17px">${t[0]}</div>
      <div class="w-row" style="margin:10px 0">${cats.map(c => `<button class="btn" data-a="${c[0]}">${c[1]}</button>`).join("")}</div>
      <div data-f="1" class="hint">${o.q}</div>`;
    body.querySelectorAll("button[data-a]").forEach(b => b.addEventListener("click", () => {
      if (answered) return; answered = true;
      const good = b.dataset.a === t[1]; if (good) right++;
      body.querySelectorAll("button[data-a]").forEach(x => { x.disabled = true; if (x.dataset.a === t[1]) x.classList.add("solid"); });
      body.querySelector("[data-f]").innerHTML = `<div class="w-out">${ok13(good, `<b>${name(t[1])}.</b> ${t[2]}`)}</div><div class="w-row" style="margin-top:10px"><button class="btn solid" data-nx="1">${k + 1 < order.length ? L2("Next", "পরেরটি") : L2("See result", "ফলাফল দেখো")} →</button></div>`;
      body.querySelector("[data-nx]").addEventListener("click", () => { k++; show(); });
    }));
  };
  const start = () => { order = shuf13(items); k = 0; right = 0; show(); };
  start();
};
/* ---- small drawings ---- */
const fish13 = (x, y, L, col, d = 1) => { const X = v => (x + d * v * L).toFixed(1), Y = v => (y + v * L).toFixed(1); return `<path d="M${X(-0.44)} ${Y(0)} L${X(-0.78)} ${Y(-0.22)} L${X(-0.68)} ${Y(0)} L${X(-0.78)} ${Y(0.22)} Z" fill="${col}" stroke="var(--ink)" stroke-width=".8" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y}" rx="${(L * 0.5).toFixed(1)}" ry="${(L * 0.2).toFixed(1)}" fill="${col}" stroke="var(--ink)" stroke-width=".8"/><circle cx="${X(0.32)}" cy="${Y(-0.05)}" r="${Math.max(1.3, L * 0.035).toFixed(1)}" fill="var(--ink)"/>`; };
const frog13 = (x, y, s = 1) => `<ellipse cx="${x}" cy="${y}" rx="${10 * s}" ry="${6.5 * s}" fill="#6aa84f" stroke="var(--ink)" stroke-width=".9"/><circle cx="${x - 4.5 * s}" cy="${y - 6 * s}" r="${3 * s}" fill="#6aa84f" stroke="var(--ink)" stroke-width=".9"/><circle cx="${x + 4.5 * s}" cy="${y - 6 * s}" r="${3 * s}" fill="#6aa84f" stroke="var(--ink)" stroke-width=".9"/><circle cx="${x - 4.5 * s}" cy="${y - 6.3 * s}" r="${1.1 * s}" fill="var(--ink)"/><circle cx="${x + 4.5 * s}" cy="${y - 6.3 * s}" r="${1.1 * s}" fill="var(--ink)"/>`;
/* heron standing with its feet at (x, y), looking left when d = -1 */
const heron13 = (x, y, s = 1, d = 1) => { const X = v => (x + d * v * s).toFixed(1), Y = v => (y - v * s).toFixed(1); return `<path d="M${X(-2)} ${Y(0)} L${X(-2)} ${Y(24)} M${X(3)} ${Y(0)} L${X(3)} ${Y(24)}" stroke="var(--ink)" stroke-width="1.4" fill="none"/><ellipse cx="${X(0)}" cy="${Y(30)}" rx="${12 * s}" ry="${7.5 * s}" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.1"/><path d="M${X(8)} ${Y(34)} Q${X(18)} ${Y(42)} ${X(10)} ${Y(50)}" fill="none" stroke="var(--ink)" stroke-width="4.6" stroke-linecap="round"/><path d="M${X(8)} ${Y(34)} Q${X(18)} ${Y(42)} ${X(10)} ${Y(50)}" fill="none" stroke="var(--paper)" stroke-width="2.6" stroke-linecap="round"/><circle cx="${X(11)}" cy="${Y(52)}" r="${3.6 * s}" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.1"/><path d="M${X(14)} ${Y(53)} L${X(26)} ${Y(49)} L${X(14)} ${Y(50)} Z" fill="${SUN13}" stroke="var(--ink)" stroke-width=".7"/><circle cx="${X(12)}" cy="${Y(53)}" r="${0.9 * s}" fill="var(--ink)"/>`; };
const tree13 = (x, y, s = 1, col = GRN13) => `<rect x="${x - 2.5 * s}" y="${y - 22 * s}" width="${5 * s}" height="${22 * s}" fill="${MUD13}"/><circle cx="${x}" cy="${y - 30 * s}" r="${13 * s}" fill="${col}"/><circle cx="${x - 9 * s}" cy="${y - 23 * s}" r="${8 * s}" fill="${col}"/><circle cx="${x + 9 * s}" cy="${y - 23 * s}" r="${8 * s}" fill="${col}"/>`;
const sun13 = (x, y, r) => { let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${SUN13}"/>`; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += `<line x1="${(x + Math.cos(a) * (r + 3)).toFixed(1)}" y1="${(y + Math.sin(a) * (r + 3)).toFixed(1)}" x2="${(x + Math.cos(a) * (r + 8)).toFixed(1)}" y2="${(y + Math.sin(a) * (r + 8)).toFixed(1)}" stroke="${SUN13}" stroke-width="2" stroke-linecap="round"/>`; } return s; };

/* 13.1 components of an ecosystem: tappable chart + sorting game */
W.b13eco = (el) => {
  const TREE = ["root", L2("Components of an ecosystem", "বাস্তুতন্ত্রের উপাদান"), [
    ["nl", L2("(a) Non-living matter", "(ক) জড় উপাদান"), [
      ["inorg", L2("Inorganic matter", "অজৈব বস্তু"), []],
      ["org", L2("Organic matter", "জৈব বস্তু"), []]]],
    ["phy", L2("(b) Physical components", "(খ) ভৌত উপাদান"), []],
    ["liv", L2("(c) Living components", "(গ) জীবজ উপাদান"), [
      ["prod", L2("Producers", "উৎপাদক"), []],
      ["cons", L2("Consumers", "খাদক"), [
        ["c1", L2("First-level consumers", "প্রথম স্তরের খাদক"), []],
        ["c2", L2("Second-level consumers", "দ্বিতীয় স্তরের খাদক"), []],
        ["c3", L2("Third-level and top consumers", "তৃতীয় স্তরের ও সর্বোচ্চ খাদক"), []]]],
      ["dec", L2("Decomposers", "বিয়োজক"), []]]]]];
  const INFO = {
    root: [L2("Any unit of land or water where these three groups are present and properly linked is an ecosystem. They work as one unit by exchanging matter and energy.", "স্থল বা জলের যে এককে এই তিন দলের উপাদান আছে এবং তারা যথাযথভাবে সম্পর্কযুক্ত, সেটিই বাস্তুতন্ত্র। বস্তু ও শক্তির আদান-প্রদানের মাধ্যমে এরা একটি একক হিসেবে কাজ করে।"), ""],
    nl: [L2("Gives living things a place to live, oxygen for respiration and many nutrients. It is of two kinds.", "জীবের বাসস্থান তৈরি করে, শ্বসনের অক্সিজেন ও অনেক পুষ্টি উপাদান যোগায়। এটি দুই রকম।"), ""],
    inorg: [L2("Matter that did not come from any living body; it was on the Earth before life appeared.", "যে বস্তু কোনো জীবদেহ থেকে আসেনি; জীবের উদ্ভবের আগে থেকেই পৃথিবীতে ছিল।"), L2("water, air, calcium, potassium, iron, nitrogen, oxygen, carbon dioxide", "পানি, বায়ু, ক্যালসিয়াম, পটাশিয়াম, লৌহ, নাইট্রোজেন, অক্সিজেন, কার্বন ডাই-অক্সাইড")],
    org: [L2("Wastes of plants and animals and the remains of their dead bodies. In soil it is called humus, and it is rich food for plants.", "উদ্ভিদ ও প্রাণীর বর্জ্য এবং মৃতদেহের অবশেষ। মাটিতে একে হিউমাস বলে; উদ্ভিদের জন্য এটি খুব পুষ্টিকর।"), L2("rotting leaves, cow dung, dead cells and tissues, compost", "পচা পাতা, গোবর, মৃত কোষ ও টিস্যু, কম্পোস্ট")],
    phy: [L2("The conditions of the place. Together they make its weather and climate, and they decide which organisms can live there.", "জায়গাটির অবস্থা। এরা মিলে সেখানকার আবহাওয়া ও জলবায়ু তৈরি করে, আর ঠিক করে দেয় কোন জীব সেখানে বাঁচতে পারবে।"), L2("sunlight, temperature, humidity, air pressure, wind, depth and height", "সূর্যালোক, তাপমাত্রা, আর্দ্রতা, বায়ুর চাপ, বায়ুপ্রবাহ, গভীরতা ও উচ্চতা")],
    liv: [L2("The active part of the ecosystem: by their work they keep changing the environment. They are of three kinds.", "বাস্তুতন্ত্রের সক্রিয় অংশ: নিজেদের কাজের মাধ্যমে এরা পরিবেশে অবিরাম পরিবর্তন আনে। এরা তিন প্রকার।"), ""],
    prod: [L2("Green plants and algae. They make food from carbon dioxide and water using sunlight (photosynthesis) and give out oxygen. They are autotrophs.", "সবুজ উদ্ভিদ ও শৈবাল। সূর্যালোকের সাহায্যে কার্বন ডাই-অক্সাইড ও পানি থেকে খাদ্য তৈরি করে (সালোকসংশ্লেষণ), অক্সিজেন ত্যাগ করে। এরা স্বভোজী।"), L2("paddy plant, grass, mango tree, algae, phytoplankton", "ধানগাছ, ঘাস, আমগাছ, শৈবাল, ফাইটোপ্ল্যাংকটন")],
    cons: [L2("Animals. They cannot make food and depend on producers directly or indirectly, so they are heterotrophs. Scavengers (vulture, crow) and omnivores (humans) are consumers too.", "প্রাণীরা। এরা খাদ্য তৈরি করতে পারে না, প্রত্যক্ষ বা পরোক্ষভাবে উৎপাদকের ওপর নির্ভর করে; তাই এরা পরভোজী। আবর্জনাভুক (শকুন, কাক) ও সর্বভুক (মানুষ) প্রাণীরাও খাদক।"), ""],
    c1: [L2("Herbivores: they eat plants directly.", "তৃণভোজী: এরা সরাসরি উদ্ভিদ খায়।"), L2("grasshopper, cow, goat, deer", "ঘাসফড়িং, গরু, ছাগল, হরিণ")],
    c2: [L2("Carnivores that eat herbivores.", "মাংসাশী: এরা তৃণভোজীদের খায়।"), L2("frog, fox", "ব্যাঙ, শিয়াল")],
    c3: [L2("Carnivores that eat second-level consumers. A consumer that nothing else hunts is a top consumer.", "মাংসাশী: এরা দ্বিতীয় স্তরের খাদকদের খায়। যাকে আর কেউ শিকার করে না, সে সর্বোচ্চ খাদক।"), L2("snake, peacock; top consumer: tiger", "সাপ, ময়ূর; সর্বোচ্চ খাদক: বাঘ")],
    dec: [L2("Microorganisms that feed on wastes and dead bodies and break them down into simple substances that plants can use again. They are also called transformers.", "অণুজীব, যারা বর্জ্য ও মৃতদেহ থেকে খাদ্য নেয় এবং সেগুলো ভেঙে উদ্ভিদের আবার ব্যবহারের উপযোগী সরল পদার্থে পরিণত করে। এদের পরিবর্তকও বলে।"), L2("bacteria, fungi", "ব্যাকটেরিয়া, ছত্রাক")]};
  let tab = "chart", sel = "prod";
  el.innerHTML = `<div class="chipset b13et" role="group"><button data-t="chart" aria-pressed="true">${L2("The chart", "ছক")}</button><button data-t="sort" aria-pressed="false">${L2("Sort it", "সাজাও")}</button></div><div id="b13eb" style="margin-top:10px"></div>`;
  const body = $("#b13eb", el);
  const node = (n) => {
    const on = n[0] === sel, i = INFO[n[0]];
    let s = `<button data-k="${n[0]}" aria-expanded="${on}" style="display:block;width:100%;text-align:left;font:inherit;font-size:15px;font-weight:600;padding:6px 10px;margin:4px 0 0;border-radius:8px;cursor:pointer;min-height:36px;border:1.5px solid ${on ? "var(--c)" : "var(--rule)"};background:${on ? "var(--c)" : "var(--paper)"};color:${on ? "var(--sheet)" : "var(--ink)"}">${n[1]}</button>`;
    if (on) s += `<div style="font-size:15px;background:var(--c-soft);border-radius:8px;padding:8px 10px;margin:4px 0 2px">${i[0]}${i[1] ? `<br><b>${L2("Examples:", "উদাহরণ:")}</b> ${i[1]}` : ""}</div>`;
    if (n[2].length) s += `<div style="margin-left:10px;padding-left:10px;border-left:2px solid var(--c-soft)">${n[2].map(node).join("")}</div>`;
    return s;
  };
  const chart = () => {
    body.innerHTML = node(TREE) + `<p class="hint" style="margin:8px 0 0">${L2("Tap a box to open it.", "কোনো ঘরে চাপ দিলে সেটি খুলবে।")}</p>`;
    body.querySelectorAll("button[data-k]").forEach(b => b.addEventListener("click", () => { sel = b.dataset.k; chart(); }));
  };
  const sort = () => sort13(body, [
    [L2("Sunlight falling on the field", "খেতে পড়া সূর্যালোক"), "phy", L2("Light is a condition of the place, not a substance and not alive.", "আলো জায়গাটির একটি অবস্থা; এটি বস্তুও নয়, জীবও নয়।")],
    [L2("The paddy plant", "ধানগাছ"), "prod", L2("It makes its own food by photosynthesis.", "এটি সালোকসংশ্লেষণে নিজের খাদ্য নিজে তৈরি করে।")],
    [L2("The water standing in the field", "খেতে জমে থাকা পানি"), "inorg", L2("Water is non-living matter that did not come from a living body.", "পানি এমন জড় বস্তু, যা কোনো জীবদেহ থেকে আসেনি।")],
    [L2("A grasshopper chewing a leaf", "পাতা খেতে থাকা ঘাসফড়িং"), "cons", L2("It eats the producer, so it is a first-level consumer.", "এটি উৎপাদককে খায়, তাই প্রথম স্তরের খাদক।")],
    [L2("Cow dung spread on the soil", "মাটিতে ছড়ানো গোবর"), "org", L2("It is non-living now, but it came from a living body.", "এটি এখন জড়, তবে এসেছে জীবদেহ থেকে।")],
    [L2("A frog waiting for insects", "পোকার অপেক্ষায় থাকা ব্যাঙ"), "cons", L2("It eats herbivorous insects, so it is a second-level consumer.", "এটি তৃণভোজী পোকা খায়, তাই দ্বিতীয় স্তরের খাদক।")],
    [L2("The temperature of the air", "বায়ুর তাপমাত্রা"), "phy", L2("Temperature is a condition; with light, humidity and wind it makes the weather.", "তাপমাত্রা একটি অবস্থা; আলো, আর্দ্রতা ও বায়ুপ্রবাহের সাথে মিলে এটি আবহাওয়া তৈরি করে।")],
    [L2("The fungus growing on rotting straw", "পচা খড়ে জন্মানো ছত্রাক"), "dec", L2("It feeds on dead matter and returns the minerals to the soil.", "এটি মৃত বস্তু থেকে খাদ্য নেয় আর খনিজ মাটিতে ফিরিয়ে দেয়।")],
    [L2("Nitrogen salts dissolved in the water", "পানিতে দ্রবীভূত নাইট্রোজেনঘটিত লবণ"), "inorg", L2("Mineral salts are inorganic matter; plants take them in as nutrients.", "খনিজ লবণ অজৈব বস্তু; উদ্ভিদ এগুলো পুষ্টি উপাদান হিসেবে নেয়।")],
    [L2("A snake that eats frogs", "ব্যাঙখেকো সাপ"), "cons", L2("It eats a second-level consumer, so it is a third-level consumer.", "এটি দ্বিতীয় স্তরের খাদককে খায়, তাই তৃতীয় স্তরের খাদক।")],
    [L2("Last season's rotting straw", "গত মৌসুমের পচা খড়"), "org", L2("Dead remains of plants are organic matter; in time they become humus.", "উদ্ভিদের মৃত অবশেষ জৈব বস্তু; ধীরে ধীরে এটি হিউমাসে পরিণত হয়।")],
    [L2("Bacteria in the wet mud", "ভেজা কাদার ব্যাকটেরিয়া"), "dec", L2("They rot wastes and dead bodies into simple substances.", "এরা বর্জ্য ও মৃতদেহ পচিয়ে সরল পদার্থে পরিণত করে।")],
    [L2("Green algae floating on the water", "পানিতে ভাসা সবুজ শৈবাল"), "prod", L2("Algae have chlorophyll and make food, just like green plants.", "শৈবালে ক্লোরোফিল আছে, সবুজ উদ্ভিদের মতোই এরা খাদ্য তৈরি করে।")],
    [L2("The wind blowing over the field", "খেতের ওপর দিয়ে বয়ে যাওয়া বাতাস"), "phy", L2("Wind is a physical condition of the place.", "বায়ুপ্রবাহ জায়গাটির একটি ভৌত অবস্থা।")]],
    [["phy", L2("Physical", "ভৌত উপাদান")], ["inorg", L2("Inorganic matter", "অজৈব বস্তু")], ["org", L2("Organic matter", "জৈব বস্তু")], ["prod", L2("Producer", "উৎপাদক")], ["cons", L2("Consumer", "খাদক")], ["dec", L2("Decomposer", "বিয়োজক")]],
    { q: L2("Something from a paddy field. Which component of the ecosystem is it?", "ধানখেতের একটি জিনিস। এটি বাস্তুতন্ত্রের কোন উপাদান?"), end: L2("Three questions help: is it a condition, a substance or alive? If a substance, did it come from a living body? If alive, how does it get its food?", "তিনটি প্রশ্ন কাজে লাগে: এটি অবস্থা, বস্তু, নাকি জীব? বস্তু হলে জীবদেহ থেকে এসেছে কি? জীব হলে খাদ্য পায় কীভাবে?") });
  chips13(el, ".b13et", b => { tab = b.dataset.t; (tab === "chart" ? chart : sort)(); });
  chart();
};

/* 13.2 pond ecosystem: tappable scene with group highlighting */
W.b13pond = (el) => {
  const GR = {
    all: [L2("Whole pond", "পুরো পুকুর"), L2("All", "সব"), L2("Tap anything in the pond. The plankton, larvae and bacteria are drawn far bigger than they really are.", "পুকুরের যেকোনো কিছুতে চাপ দাও। প্ল্যাংকটন, শূককীট আর ব্যাকটেরিয়া আসলের চেয়ে অনেক বড় করে আঁকা।")],
    prod: [L2("Producers", "উৎপাদক"), L2("Producers", "উৎপাদক"), L2("They make food by photosynthesis and give oxygen to the water. All the food of the pond starts here.", "এরা সালোকসংশ্লেষণে খাদ্য তৈরি করে আর পানিতে অক্সিজেন দেয়। পুকুরের সব খাদ্যের শুরু এখানেই।")],
    c1: [L2("First-level consumers", "প্রথম স্তরের খাদক"), L2("1st level", "১ম স্তর"), L2("They cannot make food, so they live by eating the producers directly.", "এরা খাদ্য তৈরি করতে পারে না, তাই সরাসরি উৎপাদককে খেয়ে বাঁচে।")],
    c2: [L2("Second-level consumers", "দ্বিতীয় স্তরের খাদক"), L2("2nd level", "২য় স্তর"), L2("They do not feed on the producers directly. They eat the first-level consumers.", "এরা সরাসরি উৎপাদককে খায় না। এরা খায় প্রথম স্তরের খাদকদের।")],
    c3: [L2("Third-level consumers", "তৃতীয় স্তরের খাদক"), L2("3rd level", "৩য় স্তর"), L2("They eat the second-level consumers. In a pond they are usually the top consumers.", "এরা দ্বিতীয় স্তরের খাদকদের খায়। পুকুরে সাধারণত এরাই সর্বোচ্চ খাদক।")],
    dec: [L2("Decomposers", "বিয়োজক"), L2("Decomposers", "বিয়োজক"), L2("They rot wastes and dead bodies, and the substances the producers need are formed again.", "এরা বর্জ্য ও মৃতদেহ পচায়, ফলে উৎপাদকের দরকারি পদার্থ আবার তৈরি হয়।")],
    nl: [L2("Non-living components", "জড় উপাদান"), L2("Non-living", "জড়"), L2("Water, sunlight, dissolved gases, minerals and dead organic matter. The living components cannot do without them.", "পানি, সূর্যালোক, দ্রবীভূত গ্যাস, খনিজ ও মৃত জৈব বস্তু। এগুলো ছাড়া জীবজ উপাদান চলতে পারে না।")]};
  /* key: [group, name, text, hit rect [x,y,w,h], label [x,y,anchor]] */
  const IT = {
    sun: ["nl", L2("Sunlight", "সূর্যালোক"), L2("The source of energy for the whole pond. Light is strong near the surface and weak in deep or muddy water, so most food is made in the upper layer.", "পুরো পুকুরের শক্তির উৎস। পানির ওপরের দিকে আলো বেশি, গভীর বা ঘোলা পানিতে কম; তাই বেশির ভাগ খাদ্য তৈরি হয় ওপরের স্তরে।"), [90, 4, 40, 40], [134, 28, "start"]],
    water: ["nl", L2("Water", "পানি"), L2("The home of the pond's organisms. Oxygen and carbon dioxide are dissolved in it, and so are minerals such as calcium (Ca) and phosphorus (P).", "পুকুরের জীবদের বাসস্থান। এতে অক্সিজেন ও কার্বন ডাই-অক্সাইড দ্রবীভূত থাকে, থাকে ক্যালসিয়াম (Ca) ও ফসফরাসের (P) মতো খনিজও।"), null, [298, 204, "end"]],
    dead: ["nl", L2("Dead leaves and wastes", "মরা পাতা ও বর্জ্য"), L2("Organic matter. It sinks to the bottom and is the food of the decomposers.", "জৈব বস্তু। এগুলো তলায় জমে আর বিয়োজকদের খাদ্য হয়।"), [100, 222, 44, 16], [122, 218, "middle"]],
    phyto: ["prod", L2("Phytoplankton", "ফাইটোপ্ল্যাংকটন"), L2("Microscopic floating algae. Each one is tiny, but together they fill the sunlit water and make most of the pond's food.", "ভাসমান আণুবীক্ষণিক শৈবাল। একেকটি খুবই ছোট, কিন্তু সবাই মিলে আলো পৌঁছানো পুরো পানিতে ছড়িয়ে থাকে আর পুকুরের বেশির ভাগ খাদ্য তৈরি করে।"), [186, 66, 112, 30], [242, 110, "middle"]],
    lily: ["prod", L2("Water lily", "শাপলা"), L2("A plant of shallow water. Its leaves float in the light and make food; its roots are in the mud.", "অগভীর পানির উদ্ভিদ। এর পাতা আলোয় ভেসে থেকে খাদ্য তৈরি করে; মূল থাকে কাদায়।"), [58, 46, 62, 24], [124, 54, "start"]],
    zoo: ["c1", L2("Zooplankton", "জুপ্ল্যাংকটন"), L2("Tiny floating animals. They graze on the phytoplankton.", "ভাসমান ক্ষুদ্র প্রাণী। এরা ফাইটোপ্ল্যাংকটন খেয়ে বাঁচে।"), [142, 118, 66, 30], [176, 162, "middle"]],
    larva: ["c1", L2("Mosquito larvae", "মশার শূককীট"), L2("They hang just under the surface and feed on algae and tiny floating bits of food.", "এরা পানির ঠিক ওপরের তলে ঝুলে থাকে আর শৈবাল ও ভাসমান ক্ষুদ্র খাদ্যকণা খায়।"), [124, 62, 36, 24], [142, 100, "middle"]],
    rui: ["c1", L2("Rui", "রুই"), L2("A fish that feeds on plankton. Your book places rui and catla with the first-level consumers.", "প্ল্যাংকটনভোজী মাছ। তোমার বইয়ে রুই ও কাতলাকে প্রথম স্তরের খাদকের দলে রাখা হয়েছে।"), [236, 128, 58, 26], [266, 172, "middle"]],
    sfish: ["c2", L2("Small fish", "ছোট মাছ"), L2("They eat zooplankton and other first-level consumers.", "এরা জুপ্ল্যাংকটন ও অন্যান্য প্রথম স্তরের খাদককে খায়।"), [72, 140, 60, 42], [102, 196, "middle"]],
    frog: ["c2", L2("Frog", "ব্যাঙ"), L2("It eats insects and their larvae.", "এটি পোকামাকড় ও তাদের শূককীট খায়।"), [2, 30, 34, 28], [36, 40, "start"]],
    shoal: ["c3", L2("Shoal", "শোল"), L2("A big fish that eats small fish and prawns. Boal and bhetki are of the same level.", "বড় মাছ; ছোট মাছ ও চিংড়ি খায়। বোয়াল ও ভেটকিও একই স্তরের।"), [154, 186, 94, 28], [212, 182, "middle"]],
    heron: ["c3", L2("Heron", "বক"), L2("It stands at the edge and spears small fish with its beak.", "এটি পাড়ে দাঁড়িয়ে ঠোঁট দিয়ে ছোট মাছ গেঁথে তোলে।"), [320, 2, 40, 54], [316, 22, "end"]],
    decomp: ["dec", L2("Bacteria and fungi", "ব্যাকটেরিয়া ও ছত্রাক"), L2("They live as saprophytes in the bottom mud and floating in the water. They rot wastes and dead bodies and return the materials.", "এরা মৃতজীবী হিসেবে তলার কাদায় ও পানিতে ভাসমান অবস্থায় থাকে। বর্জ্য ও মৃতদেহ পচিয়ে উপাদানগুলো ফিরিয়ে দেয়।"), [150, 230, 132, 24], [216, 274, "middle"]]};
  let grp = "all", sel = "phyto", last = "item";
  el.innerHTML = `<div class="chipset b13pg" role="group">${Object.keys(GR).map(k => `<button data-g="${k}" aria-pressed="${k === grp}">${GR[k][1]}</button>`).join("")}</div><div class="svgwrap fit" id="b13ps" style="margin-top:8px"></div><div class="w-out" id="b13po"></div>`;
  const WATER = "M36 62 H324 Q308 196 288 244 Q180 262 72 244 Q52 196 36 62 Z";
  const draw = () => {
    const op = k => grp === "all" || IT[k][0] === grp ? 1 : 0.18;
    const g = (k, inner) => { const h = IT[k][3]; return `<g data-k="${k}" style="cursor:pointer" opacity="${op(k)}">${inner}${h ? `<rect x="${h[0]}" y="${h[1]}" width="${h[2]}" height="${h[3]}" rx="6" fill="transparent" stroke="${sel === k ? "var(--bad)" : "none"}" stroke-width="1.6" stroke-dasharray="4 3"/>` : ""}</g>`; };
    let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("A pond ecosystem", "একটি পুকুরের বাস্তুতন্ত্র")}">`;
    s += `<path d="M0 46 L36 62 Q52 196 72 244 Q180 262 288 244 Q308 196 324 62 L360 44 V300 H0 Z" fill="${EARTH13}" opacity=".55"/>`;
    s += `<g data-k="water" style="cursor:pointer" opacity="${op("water")}"><path d="${WATER}" fill="${WAT13}" opacity=".3" stroke="${sel === "water" ? "var(--bad)" : WAT13}" stroke-width="${sel === "water" ? 2.2 : 1.4}"/>` + T13(300, 122, "O₂", "end", 12, "var(--muted)") + T13(300, 184, "CO₂", "end", 12, "var(--muted)") + T13(276, 224, "Ca, P", "end", 12, "var(--muted)") + `<circle cx="306" cy="108" r="2.5" fill="none" stroke="var(--muted)"/><circle cx="302" cy="98" r="1.8" fill="none" stroke="var(--muted)"/></g>`;
    s += `<path d="M72 244 Q180 262 288 244 L294 228 Q180 246 66 228 Z" fill="${MUD13}" opacity=".85"/>`;
    s += g("sun", sun13(110, 24, 11));
    s += g("lily", `<path d="M78 64 Q86 150 80 236 M104 65 Q98 150 92 238" fill="none" stroke="${GRN13}" stroke-width="1.6"/><ellipse cx="78" cy="62" rx="15" ry="4.5" fill="${GRN13}" stroke="var(--ink)" stroke-width=".7"/><ellipse cx="104" cy="63" rx="11" ry="3.6" fill="${GRN13}" stroke="var(--ink)" stroke-width=".7"/><path d="M88 60 L84 50 L90 55 L92 47 L95 55 L100 50 L97 60 Z" fill="#e58fb0" stroke="var(--ink)" stroke-width=".7" stroke-linejoin="round"/>`);
    let d = ""; [[194, 74], [206, 84], [218, 72], [230, 88], [242, 76], [254, 86], [266, 73], [278, 84], [290, 76], [212, 92], [262, 92]].forEach(p => { d += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${GRN13}"/>`; });
    s += g("phyto", d);
    d = ""; [132, 142, 152].forEach((x, i) => { d += `<path d="M${x} 63 q3 5 -1 9 q-4 4 1 9" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/><circle cx="${x}" cy="64" r="1.6" fill="var(--ink)"/>`; });
    s += g("larva", d);
    d = ""; [[152, 126], [168, 138], [182, 124], [198, 136], [162, 142]].forEach(p => { d += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="4" ry="2.4" fill="${ZOO13}" stroke="var(--ink)" stroke-width=".6"/><path d="M${p[0] + 3} ${p[1] - 1} l5 -4 M${p[0] + 3} ${p[1] + 1} l5 3" stroke="var(--ink)" stroke-width=".8" fill="none"/>`; });
    s += g("zoo", d);
    s += g("rui", fish13(268, 141, 40, "#c9a36a", -1));
    s += g("sfish", fish13(98, 150, 18, "#9fb7c9") + fish13(116, 164, 18, "#9fb7c9") + fish13(90, 174, 18, "#9fb7c9"));
    s += g("shoal", fish13(210, 200, 66, "#6f7f5c"));
    s += g("dead", `<ellipse cx="116" cy="231" rx="10" ry="3.4" fill="#c58a3c" stroke="var(--ink)" stroke-width=".6" transform="rotate(-10 116 231)"/><ellipse cx="132" cy="233" rx="7" ry="2.6" fill="#a8742f" stroke="var(--ink)" stroke-width=".6" transform="rotate(12 132 233)"/>`);
    d = ""; [[160, 242], [176, 246], [192, 240], [208, 247], [224, 242], [240, 246], [256, 240], [270, 244]].forEach((p, i) => { d += i % 2 ? `<rect x="${p[0] - 4}" y="${p[1] - 1.6}" width="8" height="3.2" rx="1.6" fill="${SUN13}"/>` : `<path d="M${p[0]} ${p[1] + 3} v-6 m0 2 l-3 -3 m3 3 l3 -3" stroke="var(--paper)" stroke-width="1.3" fill="none" stroke-linecap="round"/>`; });
    s += g("decomp", d);
    s += g("frog", frog13(18, 47, 0.95));
    s += g("heron", heron13(340, 54, 0.86, -1));
    Object.keys(IT).forEach(k => { const it = IT[k], l = it[4]; if ((grp !== "all" && it[0] === grp) || sel === k) s += T13(l[0], l[1], it[1], l[2], 12.5, sel === k ? "var(--bad)" : "var(--ink)", "700", true); });
    $("#b13ps", el).innerHTML = s + `</svg>`;
    $("#b13ps", el).querySelectorAll("[data-k]").forEach(q => q.addEventListener("click", () => { sel = q.dataset.k; last = "item"; if (grp !== "all" && IT[sel][0] !== grp) { grp = "all"; el.querySelectorAll(".b13pg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.g === "all")); } draw(); }));
    const it = IT[sel];
    $("#b13po", el).innerHTML = last === "group" ? `<b>${GR[grp][0]}</b><br>${GR[grp][2]}${grp === "all" ? "" : `<br><span class="muted">${L2("In this pond:", "এই পুকুরে:")} ${Object.keys(IT).filter(k => IT[k][0] === grp).map(k => IT[k][1]).join(", ")}</span>`}` : `<b>${it[1]}</b> <span class="muted">(${GR[it[0]][0]})</span><br>${it[2]}`;
  };
  chips13(el, ".b13pg", b => { grp = b.dataset.g; last = "group"; if (grp !== "all" && (!sel || IT[sel][0] !== grp)) sel = ""; draw(); });
  draw();
};

/* 13.3 food chain: build a chain + the three kinds */
W.b13chain = (el) => {
  /* organism: [name, question asked after it is placed] */
  const PL = {
    field: [L2("Grass field", "ঘাসের মাঠ"), [
      [L2("grass", "ঘাস"), L2("Who eats grass?", "ঘাস কে খায়?")],
      [L2("grasshopper", "ঘাসফড়িং"), L2("Who eats the grasshopper?", "ঘাসফড়িংকে কে খায়?")],
      [L2("frog", "ব্যাঙ"), L2("Who swallows the frog?", "ব্যাঙকে কে গিলে খায়?")],
      [L2("snake", "সাপ"), L2("Who can eat a small snake?", "ছোট সাপকে কে খেতে পারে?")],
      [L2("monitor lizard", "গুঁইসাপ"), ""]]],
    pond: [L2("Pond", "পুকুর"), [
      [L2("phytoplankton", "ফাইটোপ্ল্যাংকটন"), L2("Who grazes on phytoplankton?", "ফাইটোপ্ল্যাংকটন কে খায়?")],
      [L2("zooplankton", "জুপ্ল্যাংকটন"), L2("Who eats zooplankton?", "জুপ্ল্যাংকটনকে কে খায়?")],
      [L2("small fish", "ছোট মাছ"), L2("Who eats small fish?", "ছোট মাছকে কে খায়?")],
      [L2("shoal", "শোল"), ""]]],
    sb: [L2("Sundarbans", "সুন্দরবন"), [
      [L2("keora leaves", "কেওড়ার পাতা"), L2("Who eats keora leaves?", "কেওড়ার পাতা কে খায়?")],
      [L2("spotted deer", "চিত্রা হরিণ"), L2("Who hunts the deer?", "হরিণকে কে শিকার করে?")],
      [L2("tiger", "বাঘ"), ""]]]};
  const LV = [L2("producer", "উৎপাদক"), L2("first-level consumer", "প্রথম স্তরের খাদক"), L2("second-level consumer", "দ্বিতীয় স্তরের খাদক"), L2("third-level consumer", "তৃতীয় স্তরের খাদক"), L2("fourth-level consumer", "চতুর্থ স্তরের খাদক")];
  let tab = "build", place = "field", done = 0, pool = [], msg = "", kind = "pred";
  el.innerHTML = `<div class="chipset b13ct" role="group"><button data-t="build" aria-pressed="true">${L2("Build a chain", "শিকল বানাও")}</button><button data-t="kinds" aria-pressed="false">${L2("Three kinds", "তিন রকম")}</button></div><div id="b13cb" style="margin-top:10px"></div>`;
  const body = $("#b13cb", el);
  const box = (name, sub, on) => `<span style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;min-height:46px;padding:4px 10px;border-radius:10px;border:1.5px ${on ? "solid var(--c)" : "dashed var(--rule)"};background:${on ? "var(--c-soft)" : "transparent"};font-size:15px;line-height:1.25"><b>${name}</b><span style="font-size:12.5px;color:var(--muted)">${sub}</span></span>`;
  const drawBuild = () => {
    const ch = PL[place][1], n = ch.length, fin = done === n;
    let s = `<div class="chipset b13cp" role="group">${Object.keys(PL).map(k => `<button data-p="${k}" aria-pressed="${k === place}">${PL[k][0]}</button>`).join("")}</div>`;
    s += `<div class="w-row" style="margin:10px 0;gap:4px 6px;align-items:stretch">`;
    for (let i = 0; i < n; i++) {
      if (i) s += `<span style="align-self:center;font-size:20px;color:${i <= done - 1 ? "var(--c)" : "var(--rule)"}">→</span>`;
      s += i < done ? box(ch[i][0], i === n - 1 && fin ? (n === 5 ? L2("top-level consumer", "সর্বোচ্চ স্তরের খাদক") : LV[i] + L2(" (top)", " (সর্বোচ্চ)")) : LV[i], true) : box("?", B13(i + 1), false);
    }
    s += `</div>`;
    if (!fin) s += `<div class="w-row" style="margin-bottom:10px">${pool.map(i => `<button class="btn" data-o="${i}">${ch[i][0]}</button>`).join("")}</div>`;
    s += `<div class="w-out">${msg || (done === 0 ? L2("Start with the <b>producer</b>: the one that makes its own food.", "<b>উৎপাদক</b> দিয়ে শুরু করো: যে নিজের খাদ্য নিজে তৈরি করে।") : "")}</div>`;
    if (fin) s += `<div class="w-row" style="margin-top:10px"><button class="btn solid" id="b13cr">${L2("Build it again", "আবার বানাও")}</button></div>`;
    body.innerHTML = s;
    chips13(body, ".b13cp", b => { place = b.dataset.p; reset(); });
    body.querySelectorAll("button[data-o]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.o;
      if (i === done) {
        done++; pool = pool.filter(q => q !== i);
        msg = done === n ? ok13(true, L2(`<b>Complete!</b> A predator food chain with ${n} links. The arrow means "is eaten by": the energy stored by the producer passes ${n - 1} times.`, `<b>শিকল সম্পূর্ণ!</b> ${B13(n)}টি আংটার একটি শিকারজীবী খাদ্যশিকল। তীরের অর্থ "যাকে খায়": উৎপাদকের জমা করা শক্তি ${B13(n - 1)} বার হাতবদল হলো।`)) : ok13(true, `${L2("Right.", "ঠিক।")} ${ch[i][1]}`);
      } else msg = ok13(false, done === 0 ? L2(`The ${ch[i][0]} cannot make its own food. Start with the producer.`, `${ch[i][0]} নিজের খাদ্য নিজে তৈরি করতে পারে না। উৎপাদক দিয়ে শুরু করো।`) : `${L2("Not that one.", "এটি নয়।")} ${ch[done - 1][1]}`);
      drawBuild();
    }));
    if (fin) $("#b13cr", el).addEventListener("click", reset);
  };
  const reset = () => { done = 0; msg = ""; pool = shuf13(PL[place][1].map((q, i) => i)); if (pool[0] === 0) pool.push(pool.shift()); drawBuild(); };
  const KD = {
    pred: [L2("Predator", "শিকারজীবী"), true, [[L2("grass", "ঘাস"), 0], [L2("grasshopper", "ঘাসফড়িং"), 9], [L2("frog", "ব্যাঙ"), 14], [L2("snake", "সাপ"), 19], [L2("monitor lizard", "গুঁইসাপ"), 25]],
      L2("<b>Predator food chain.</b> It starts from a producer. The first-level consumer is the smallest, and at each step a higher consumer hunts and eats the one below. Going up, the animals usually get <b>bigger</b>.", "<b>শিকারজীবী খাদ্যশিকল।</b> এটি উৎপাদক থেকে শুরু হয়। প্রথম স্তরের খাদক সবচেয়ে ছোট, আর প্রতি ধাপে ওপরের খাদক নিচের খাদককে শিকার করে খায়। ওপরের দিকে প্রাণীরা সাধারণত <b>বড়</b> হতে থাকে।")],
    para: [L2("Parasitic", "পরজীবী"), false, [[L2("human", "মানুষ"), 26], [L2("mosquito", "মশা"), 12], [L2("dengue virus", "ডেঙ্গু ভাইরাস"), 5]],
      L2("<b>Parasitic food chain.</b> A parasite takes its food from a living host that is usually much larger. Along the chain the organisms get <b>smaller</b>. It need not begin with a green plant.", "<b>পরজীবী খাদ্যশিকল।</b> পরজীবী খাদ্য নেয় জীবিত পোষকের দেহ থেকে, যে সাধারণত তার চেয়ে অনেক বড়। শিকল ধরে জীবগুলো <b>ছোট</b> হতে থাকে। এর শুরুতে সবুজ উদ্ভিদ না-ও থাকতে পারে।")],
    sap: [L2("Saprophytic", "মৃতজীবী"), false, [[L2("dead body", "মৃতদেহ"), 0], [L2("fungi", "ছত্রাক"), 13], [L2("earthworm", "কেঁচো"), 15]],
      L2("<b>Saprophytic (detritus) food chain.</b> It starts from the dead bodies of organisms and passes through more than one food level.", "<b>মৃতজীবী (ডেট্রিটাস) খাদ্যশিকল।</b> এটি জীবের মৃতদেহ থেকে শুরু হয়ে একাধিক খাদ্যস্তরে সাজানো থাকে।")]};
  const drawKinds = () => {
    const [, complete, nodes, txt] = KD[kind], n = nodes.length, xs = n === 5 ? [30, 100, 168, 236, 310] : [66, 180, 294];
    let s = `<svg viewBox="0 0 360 150" role="img" aria-label="${L2("A food chain drawn with body sizes", "দেহের আকারসহ একটি খাদ্যশিকল")}">${arrowDefs("b13ca", "var(--c)")}`;
    nodes.forEach((q, i) => {
      const x = xs[i], r = q[1];
      if (r === 0) s += kind === "pred" ? `<path d="M${x - 16} 78 q4 -24 6 0 q4 -30 8 0 q4 -26 8 0 q4 -20 8 0 Z" fill="${GRN13}" stroke="${GRN13}" stroke-width="2" stroke-linejoin="round"/>` : `<rect x="${x - 22}" y="56" width="44" height="18" rx="9" fill="var(--rule)" stroke="var(--muted)" stroke-width="1.2"/>`;
      else s += `<circle cx="${x}" cy="62" r="${r}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
      s += n === 5 && i === 4 ? T13(356, 108, q[0], "end", 13.5, "var(--ink)", "700") : T13(x, n === 5 && i % 2 ? 124 : 108, q[0], "middle", 13.5, "var(--ink)", "700");
      if (i < n - 1) { const a = x + Math.max(r, 18) + 5, b = xs[i + 1] - Math.max(nodes[i + 1][1], 6) - 7; s += `<line x1="${a}" y1="62" x2="${b}" y2="62" stroke="var(--c)" stroke-width="2.4" marker-end="url(#b13ca)"/>`; }
    });
    s += T13(180, 16, kind === "pred" ? L2("body size grows →", "দেহের আকার বাড়ে →") : kind === "para" ? L2("body size shrinks →", "দেহের আকার কমে →") : L2("starts from dead matter", "মৃত বস্তু থেকে শুরু"), "middle", 12.5, "var(--muted)");
    s += T13(180, 145, complete ? L2("complete: it starts with a producer", "সম্পূর্ণ: উৎপাদক দিয়ে শুরু") : L2("incomplete: no producer at the start", "অসম্পূর্ণ: শুরুতে উৎপাদক নেই"), "middle", 12.5, complete ? "var(--good)" : "var(--bad)", "700");
    body.innerHTML = `<div class="chipset b13ck" role="group">${Object.keys(KD).map(k => `<button data-k="${k}" aria-pressed="${k === kind}">${KD[k][0]}</button>`).join("")}</div><div class="svgwrap fit" style="margin-top:8px">${s}</svg></div><div class="w-out">${txt}${complete ? "" : " " + L2("Such a chain is incomplete and depends on the predator food chain.", "এ রকম শিকল অসম্পূর্ণ, আর শিকারজীবী খাদ্যশিকলের ওপর নির্ভরশীল।")}</div>`;
    chips13(body, ".b13ck", b => { kind = b.dataset.k; drawKinds(); });
  };
  chips13(el, ".b13ct", b => { tab = b.dataset.t; if (tab === "build") reset(); else drawKinds(); });
  reset();
};

/* 13.4 food web (remove a species / trace the chains), energy pyramid, energy flow vs nutrient cycle */
W.b13web = (el) => {
  const N = {
    A: [L2("Algae", "শৈবাল"), [172, 224], L2("producer", "উৎপাদক")],
    Z: [L2("Zooplankton", "জুপ্ল্যাংকটন"), [286, 164], ""],
    S: [L2("Small fish", "ছোট মাছ"), [78, 130], ""],
    B: [L2("Big fish", "বড় মাছ"), [290, 86], ""],
    H: [L2("Hawk", "বাজ পাখি"), [170, 26], ""]};
  const E = [["A", "Z"], ["A", "S"], ["Z", "S"], ["Z", "B"], ["S", "B"], ["S", "H"], ["B", "H"]];
  const CH = ["ASH", "AZBH", "ASBH", "AZSBH", "AZSH"];
  const FX = {
    A: L2("Without the producer no food is made. The zooplankton and small fish starve first, then the big fish and the hawk. The whole web collapses: every chain needs its first link.", "উৎপাদক না থাকলে খাদ্যই তৈরি হয় না। আগে না খেয়ে মরে জুপ্ল্যাংকটন ও ছোট মাছ, পরে বড় মাছ ও বাজ পাখি। পুরো জালই ভেঙে পড়ে: প্রতিটি শিকলের প্রথম আংটাটি চাই-ই।"),
    Z: L2("The small fish still have algae to eat, so the web survives. But the big fish now have only small fish to eat, so the small fish are hunted harder. With no zooplankton grazing, the algae may increase.", "ছোট মাছের খাওয়ার জন্য শৈবাল আছে, তাই জাল টিকে যায়। তবে বড় মাছের খাদ্য এখন শুধু ছোট মাছ, তাই ছোট মাছের ওপর চাপ বাড়ে। জুপ্ল্যাংকটন না থাকায় শৈবাল বেড়ে যেতে পারে।"),
    S: L2("Only one path is left. The hawk now depends on big fish alone, and the big fish on zooplankton alone. A web with a single path is as fragile as a single chain.", "পথ বাকি থাকল মাত্র একটি। বাজ পাখি এখন শুধু বড় মাছের ওপর আর বড় মাছ শুধু জুপ্ল্যাংকটনের ওপর নির্ভরশীল। এক পথের জাল একটিমাত্র শিকলের মতোই ভঙ্গুর।"),
    B: L2("The small fish lose an enemy and may increase; then the zooplankton and algae are eaten more. The hawk still has small fish, so it survives, but it has lost one of its foods.", "ছোট মাছ একটি শত্রু হারাল, তাই বাড়তে পারে; তখন জুপ্ল্যাংকটন ও শৈবাল বেশি খাওয়া পড়ে। বাজ পাখির জন্য ছোট মাছ আছে, তাই সে টিকে থাকে, তবে তার একটি খাদ্য কমে গেল।"),
    H: L2("The top consumer is gone. Nothing hunts the fish now, so their numbers may rise at first, and later they run short of food. Top consumers keep the levels below them in check.", "সর্বোচ্চ খাদক আর নেই। মাছকে এখন কেউ শিকার করে না, তাই শুরুতে তাদের সংখ্যা বাড়তে পারে, পরে তাদেরই খাদ্যে টান পড়ে। সর্বোচ্চ খাদকেরা নিচের স্তরগুলোকে নিয়ন্ত্রণে রাখে।")};
  let tab = "web", gone = "", ci = -1, flow = "energy";
  el.innerHTML = `<div class="chipset b13wt" role="group"><button data-t="web" aria-pressed="true">${L2("Food web", "খাদ্যজাল")}</button><button data-t="pyr" aria-pressed="false">${L2("Energy pyramid", "শক্তি পিরামিড")}</button><button data-t="flow" aria-pressed="false">${L2("Two flows", "দুই প্রবাহ")}</button></div><div id="b13wb" style="margin-top:10px"></div>`;
  const body = $("#b13wb", el);
  const HW = 56, HH = 15;
  const clip = (c, hw, hh, dx, dy) => { const t = Math.min(dx ? hw / Math.abs(dx) : 1e9, dy ? hh / Math.abs(dy) : 1e9); return [c[0] + dx * t, c[1] + dy * t]; };
  const paths = () => { /* all chains from algae to an organism that nothing left in the pond eats */
    if (gone === "A") return [];
    const out = k => E.filter(e => e[0] === k && e[1] !== gone).map(e => e[1]), res = [];
    const go = p => { const o = out(p[p.length - 1]); if (!o.length) { if (p.length > 1) res.push(p.join("")); } else o.forEach(q => go(p.concat(q))); };
    go(["A"]); return res;
  };
  const chainTxt = c => c.split("").map(k => N[k][0]).join(" → ");
  const drawWeb = () => {
    const cur = ci >= 0 ? CH[ci] : "";
    let s = `<svg viewBox="0 0 360 246" role="img" aria-label="${L2("Food web of a pond", "পুকুরের খাদ্যজাল")}">${arrowDefs("b13wa", "var(--ink)")}${arrowDefs("b13wh", "var(--bad)")}${arrowDefs("b13wf", "var(--rule)")}`;
    E.forEach(([a, b]) => {
      const p = N[a][1], q = N[b][1], dx = q[0] - p[0], dy = q[1] - p[1], st = clip(p, HW, HH, dx, dy), en = clip(q, HW + 4, HH + 4, -dx, -dy);
      const dead = gone === a || gone === b, hot = cur && cur.includes(a + b);
      s += `<line x1="${st[0].toFixed(1)}" y1="${st[1].toFixed(1)}" x2="${en[0].toFixed(1)}" y2="${en[1].toFixed(1)}" stroke="${dead ? "var(--rule)" : hot ? "var(--bad)" : "var(--ink)"}" stroke-width="${hot ? 3 : 1.6}"${dead ? ` stroke-dasharray="4 4"` : ""} opacity="${cur && !hot ? 0.3 : 1}" marker-end="url(#${dead ? "b13wf" : hot ? "b13wh" : "b13wa"})"/>`;
    });
    Object.keys(N).forEach(k => {
      const [nm, p] = N[k], dead = gone === k, hot = cur && cur.includes(k);
      s += `<g data-k="${k}" style="cursor:pointer" opacity="${cur && !hot ? 0.45 : 1}"><rect x="${p[0] - HW}" y="${p[1] - HH}" width="${HW * 2}" height="${HH * 2}" rx="10" fill="${dead ? "var(--paper)" : k === "A" ? "var(--c)" : "var(--c-soft)"}" stroke="${dead ? "var(--bad)" : hot ? "var(--bad)" : "var(--c)"}" stroke-width="${hot || dead ? 2.4 : 1.6}"${dead ? ` stroke-dasharray="5 4"` : ""}/>${T13(p[0], p[1] + 4.5, nm, "middle", 13, dead ? "var(--muted)" : k === "A" ? "var(--sheet)" : "var(--ink)", "700")}${dead ? `<path d="M${p[0] - HW + 6} ${p[1] - HH + 5} L${p[0] + HW - 6} ${p[1] + HH - 5}" stroke="var(--bad)" stroke-width="2"/>` : ""}</g>`;
    });
    let o;
    if (cur) o = `<b>${L2("Chain", "শিকল")} ${B13(ci + 1)} / ${B13(CH.length)}:</b> ${chainTxt(cur)}<br>${L2(`${cur.length} trophic levels; the hawk is at level ${cur.length}.`, `${B13(cur.length)}টি ট্রফিক লেভেল; বাজ পাখি আছে ${B13(cur.length)} নম্বর লেভেলে।`)}`;
    else if (gone) { const ps = paths(); o = `<b>${L2(`${N[gone][0]} removed.`, `${N[gone][0]} সরিয়ে দেওয়া হলো।`)}</b> ${FX[gone]}<br><b>${L2(`Food chains left: ${ps.length}`, `বাকি খাদ্যশিকল: ${B13(ps.length)}টি`)}</b>${ps.length ? `<span style="font-size:14.5px">` + ps.map(c => "<br>• " + chainTxt(c)).join("") + `</span>` : ""}`; }
    else o = L2("Five organisms, seven arrows, <b>five food chains</b>. Tap an organism to take it out of the pond, or trace the chains one by one.", "পাঁচটি জীব, সাতটি তীর, <b>পাঁচটি খাদ্যশিকল</b>। কোনো জীবে চাপ দিয়ে তাকে পুকুর থেকে সরাও, অথবা শিকলগুলো একটি একটি করে দেখো।");
    body.innerHTML = `<div class="svgwrap fit">${s}</svg></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b13wc">${L2("Show the chains", "শিকলগুলো দেখাও")} ▶</button><button class="btn" id="b13wr">${L2("Reset", "আগের মতো")}</button><span class="hint">${L2("→ means \"is eaten by\"", "→ মানে \"যাকে খায়\"")}</span></div><div class="w-out">${o}</div>`;
    body.querySelectorAll("[data-k]").forEach(g => g.addEventListener("click", () => { ci = -1; gone = gone === g.dataset.k ? "" : g.dataset.k; drawWeb(); }));
    $("#b13wc", el).addEventListener("click", () => { gone = ""; ci = ci + 1 >= CH.length ? -1 : ci + 1; drawWeb(); });
    $("#b13wr", el).addEventListener("click", () => { gone = ""; ci = -1; drawWeb(); });
  };
  const LVN = [L2("Producers", "উৎপাদক"), L2("1st-level consumers", "প্রথম স্তরের খাদক"), L2("2nd-level consumers", "দ্বিতীয় স্তরের খাদক"), L2("3rd-level consumers", "তৃতীয় স্তরের খাদক"), L2("4th-level consumers", "চতুর্থ স্তরের খাদক"), L2("5th-level consumers", "পঞ্চম স্তরের খাদক")];
  const drawPyr = () => {
    const E1 = sv(el, "b13pe", "kJ", 0), n = sv(el, "b13pn", "", 0);
    $("#b13pe-v", el).textContent = num13(E1) + " kJ";
    const bh = Math.min(38, 196 / n), base = 8 + n * bh, COL = [GRN13, "#8fb84e", SUN13, NRG13, HEAT13, "#a3382a"];
    let s = `<svg viewBox="0 0 360 ${(base + 46 + n * 8).toFixed(0)}" role="img" aria-label="${L2("Energy pyramid", "শক্তি পিরামিড")}">`;
    for (let i = 0; i < n; i++) {
      const w = 196 - i * (164 / 5), y = base - (i + 1) * bh, e = E1 * Math.pow(0.1, i);
      s += `<rect x="${(104 - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(bh - 2).toFixed(1)}" rx="3" fill="${COL[i]}" opacity=".85" stroke="var(--ink)" stroke-width="1"/>`;
      s += T13(104, y + bh / 2 + 5, B13(i + 1), "middle", 14, "var(--ink)", "700");
      s += T13(212, y + bh / 2 - 3, LVN[i], "start", 13.5, "var(--muted)") + T13(212, y + bh / 2 + 12, num13(e) + " kJ", "start", 13.5, "var(--ink)", "700");
    }
    s += T13(180, base + 16, L2("1, 2, 3 … = trophic level; widths not to scale", "১, ২, ৩ … = ট্রফিক লেভেল; চওড়া মাপমতো নয়"), "middle", 13.5, "var(--muted)");
    s += T13(10, base + 36, L2("The same energies drawn to scale:", "একই শক্তিগুলো মাপমতো আঁকলে:"), "start", 12.5, "var(--ink)", "700");
    for (let i = 0; i < n; i++) { const w = Math.max(340 * Math.pow(0.1, i), 1.2); s += `<rect x="10" y="${(base + 42 + i * 8).toFixed(1)}" width="${w.toFixed(1)}" height="6" fill="${COL[i]}" stroke="var(--ink)" stroke-width=".5"/>`; }
    $("#b13ps2", el).innerHTML = s + `</svg>`;
    const top = E1 * Math.pow(0.1, n - 1), pc = 100 * Math.pow(0.1, n - 1);
    $("#b13po2", el).innerHTML = L2(`At every step about <b>10%</b> passes on and about 90% leaves as heat or stays unused. Level ${n} gets <b>${num13(top)} kJ</b>, only ${B13(String(+pc.toPrecision(2)))}% of what the producers stored.`, `প্রতি ধাপে প্রায় <b>১০%</b> পরের লেভেলে যায়, আর প্রায় ৯০% তাপ হয়ে বেরিয়ে যায় বা অব্যবহৃত থাকে। ${B13(n)} নম্বর লেভেল পায় <b>${num13(top)} kJ</b>, যা উৎপাদকের জমা করা শক্তির মাত্র ${B13(String(+pc.toPrecision(2)))}%।`) + (n >= 5 ? " " + L2("So little is left that another level could hardly live on it: this is why food chains stop at about 4 or 5 levels.", "এত সামান্য বাকি থাকে যে তা দিয়ে আরেকটি স্তরের টিকে থাকা প্রায় অসম্ভব: এ কারণেই খাদ্যশিকল ৪ বা ৫ লেভেলে থেমে যায়।") : "");
  };
  const pyr = () => {
    body.innerHTML = slider("b13pe", L2("Energy stored by the producers", "উৎপাদকের জমা করা শক্তি"), 1000, 100000, 1000, 10000, "kJ") + slider("b13pn", L2("Number of trophic levels", "ট্রফিক লেভেলের সংখ্যা"), 2, 6, 1, 4, "") + `<div class="svgwrap fit" id="b13ps2"></div><div class="w-out" id="b13po2"></div>`;
    $("#b13pe", el).addEventListener("input", drawPyr); $("#b13pn", el).addEventListener("input", drawPyr);
    drawPyr();
  };
  const drawFlow = () => {
    const en = flow !== "nut", nu = flow !== "energy", EC = en ? NRG13 : "var(--rule)", NC = nu ? "var(--c)" : "var(--rule)", HC = en ? HEAT13 : "var(--rule)";
    const both = flow === "both" ? "var(--ink)" : flow === "energy" ? NRG13 : "var(--c)";
    const bx = (x, y, w, h, t, t2) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="8" fill="var(--c-soft)" stroke="var(--c)" stroke-width="1.5"/>` + (t2 ? T13(x, y - 2, t, "middle", 13, "var(--ink)", "700") + T13(x, y + 13, t2, "middle", 12, "var(--muted)") : T13(x, y + 4.5, t, "middle", 13, "var(--ink)", "700"));
    const ar = (x1, y1, x2, y2, c, id, w = 2.4, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;
    let s = `<svg viewBox="0 0 360 262" role="img" aria-label="${L2("Energy flows one way, nutrients go round in a cycle", "শক্তি একমুখী পথে চলে, পুষ্টি উপাদান চক্রাকারে ঘোরে")}">${arrowDefs("b13fe", EC)}${arrowDefs("b13fn", NC)}${arrowDefs("b13fh", HC)}${arrowDefs("b13fb", both)}`;
    s += `<g opacity="${en ? 1 : 0.25}">${sun13(26, 30, 11)}</g>` + ar(26, 50, 26, 90, EC, "b13fe", 3) + T13(33, 76, L2("light", "আলো"), "start", 12, en ? NRG13 : "var(--rule)", "700");
    [[86, 1], [180, 0], [306, 0]].forEach(([x]) => { s += ar(x, 94, x, 62, HC, "b13fh", 2, "5 3") + T13(x, 54, L2("heat", "তাপ"), "middle", 12, en ? HEAT13 : "var(--rule)", "700"); });
    s += ar(100, 112, 131, 112, both, "b13fb", 3) + ar(226, 112, 257, 112, both, "b13fb", 3);
    s += ar(84, 130, 194, 196, both, "b13fb", 1.8) + ar(180, 130, 224, 194, both, "b13fb", 1.8) + ar(306, 130, 264, 194, both, "b13fb", 1.8);
    s += ar(180, 214, 136, 214, NC, "b13fn", 3) + T13(138, 250, L2("minerals", "খনিজ"), "middle", 12, nu ? "var(--c)" : "var(--rule)", "700");
    s += ar(34, 192, 34, 134, NC, "b13fn", 3);
    s += ar(292, 214, 320, 214, HC, "b13fh", 2, "5 3") + T13(324, 218, L2("heat", "তাপ"), "start", 12, en ? HEAT13 : "var(--rule)", "700");
    s += bx(54, 112, 92, 34, L2("Producers", "উৎপাদক")) + bx(180, 112, 92, 34, L2("Herbivores", "তৃণভোজী")) + bx(306, 112, 92, 34, L2("Carnivores", "মাংসাশী"));
    s += bx(236, 214, 112, 34, L2("Decomposers", "বিয়োজক")) + bx(70, 214, 124, 40, L2("Nutrient pool", "পুষ্টি ভান্ডার"), L2("soil, water, air", "মাটি, পানি, বায়ু"));
    s += T13(352, 250, L2("dead bodies and wastes", "মৃতদেহ ও বর্জ্য"), "end", 12, "var(--muted)");
    const o = flow === "energy" ? L2("<b>Energy flows one way.</b> It comes in as sunlight, is passed along with the food, and at every step most of it leaves as heat. Heat cannot be used again to make food, so fresh sunlight is needed all the time.", "<b>শক্তি একমুখী পথে চলে।</b> এটি আসে সূর্যালোক হিসেবে, খাদ্যের সাথে এক জীব থেকে আরেক জীবে যায়, আর প্রতি ধাপে তার বেশির ভাগ তাপ হয়ে বেরিয়ে যায়। তাপ দিয়ে আর খাদ্য তৈরি করা যায় না, তাই সারাক্ষণ নতুন সূর্যালোক দরকার।")
      : flow === "nut" ? L2("<b>Nutrients go round in a cycle.</b> Plants take minerals from the nutrient pool, animals get them with their food, and decomposers break down dead bodies and wastes and return the minerals to the pool. The same atoms are used again and again.", "<b>পুষ্টি উপাদান চক্রাকারে ঘোরে।</b> উদ্ভিদ পুষ্টি ভান্ডার থেকে খনিজ নেয়, প্রাণীরা তা পায় খাদ্যের সাথে, আর বিয়োজকেরা মৃতদেহ ও বর্জ্য ভেঙে খনিজগুলো ভান্ডারে ফিরিয়ে দেয়। একই পরমাণু বারবার ব্যবহার হয়।")
        : L2("Food carries <b>both</b> matter and energy from one organism to the next. The matter comes back through the decomposers (a cycle); the energy leaves as heat and does not come back (a one-way flow).", "খাদ্য এক জীব থেকে আরেক জীবে বস্তু ও শক্তি <b>দুটিই</b> বয়ে নেয়। বস্তু বিয়োজকের মাধ্যমে ফিরে আসে (চক্র); শক্তি তাপ হয়ে বেরিয়ে যায়, আর ফেরে না (একমুখী প্রবাহ)।");
    body.innerHTML = `<div class="chipset b13wf" role="group"><button data-f="energy" aria-pressed="${flow === "energy"}">${L2("Energy", "শক্তি")}</button><button data-f="nut" aria-pressed="${flow === "nut"}">${L2("Nutrients", "পুষ্টি উপাদান")}</button><button data-f="both" aria-pressed="${flow === "both"}">${L2("Both", "দুটিই")}</button></div><div class="svgwrap fit" style="margin-top:8px">${s}</svg></div><div class="w-out">${o}</div>`;
    chips13(body, ".b13wf", b => { flow = b.dataset.f; drawFlow(); });
  };
  chips13(el, ".b13wt", b => { tab = b.dataset.t; (tab === "web" ? drawWeb : tab === "pyr" ? pyr : drawFlow)(); });
  drawWeb();
};

/* 13.5 biodiversity: the three types + which type? */
W.b13div = (el) => {
  let tab = "types", ty = "gen";
  el.innerHTML = `<div class="chipset b13dt" role="group"><button data-t="types" aria-pressed="true">${L2("Three types", "তিন প্রকার")}</button><button data-t="sort" aria-pressed="false">${L2("Which type?", "কোন প্রকার?")}</button></div><div id="b13db" style="margin-top:10px"></div>`;
  const body = $("#b13db", el);
  const NM = { gen: L2("Genetic diversity", "বংশগতীয় বৈচিত্র্য"), sp: L2("Species diversity", "প্রজাতিগত বৈচিত্র্য"), eco: L2("Ecosystem diversity", "বাস্তুতান্ত্রিক বৈচিত্র্য") };
  const mango = (x, y, s, col, tilt) => `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})"><path d="M0 -24 C16 -26 24 -8 20 8 C16 24 2 30 -8 24 C-22 16 -22 -6 -12 -18 C-8 -22 -4 -24 0 -24 Z" fill="${col}" stroke="var(--ink)" stroke-width="${(1.2 / s).toFixed(2)}"/><path d="M0 -24 q2 -7 8 -9" fill="none" stroke="${MUD13}" stroke-width="${(2 / s).toFixed(2)}" stroke-linecap="round"/></g>`;
  const drawTypes = () => {
    let s = `<svg viewBox="0 0 360 176" role="img" aria-label="${NM[ty]}">`;
    if (ty === "gen") {
      s += T13(180, 18, L2("one species: mango (Mangifera indica)", "একটিই প্রজাতি: আম (Mangifera indica)"), "middle", 12.5, "var(--muted)");
      [[44, 1.15, "#c9c24a", -8, L2("Fazli", "ফজলি")], [130, 0.85, "#7fae4b", 6, L2("Langra", "ল্যাংড়া")], [218, 0.95, "#e8b83c", -4, L2("Himsagar", "হিমসাগর")], [312, 0.78, "#e2893a", 10, L2("Gopalbhog", "গোপালভোগ")]].forEach(m => { s += mango(m[0], 86, m[1], m[2], m[3]) + T13(m[0], 150, m[4], "middle", 13, "var(--ink)", "700"); });
      s += T13(180, 170, L2("different genes → different size, colour, taste", "ভিন্ন জিন → ভিন্ন আকার, রং, স্বাদ"), "middle", 12.5, "var(--muted)");
    } else if (ty === "sp") {
      s += T13(180, 18, L2("one place (a haor), many species", "একটিই জায়গা (হাওর), অনেক প্রজাতি"), "middle", 12.5, "var(--muted)");
      const cell = (i, pic, name) => { const x = 60 + (i % 3) * 120, y = 62 + Math.floor(i / 3) * 74; return pic(x, y) + T13(x, y + 28, name, "middle", 12.5, "var(--ink)", "700"); };
      s += cell(0, (x, y) => tree13(x, y + 14, 0.95), L2("hijal tree", "হিজল গাছ"));
      s += cell(1, (x, y) => fish13(x, y - 2, 46, "#c9a36a"), L2("rui", "রুই"));
      s += cell(2, (x, y) => heron13(x - 4, y + 16, 0.8), L2("heron", "বক"));
      s += cell(3, (x, y) => frog13(x, y + 4, 1.3), L2("frog", "ব্যাঙ"));
      s += cell(4, (x, y) => `<ellipse cx="${x}" cy="${y + 8}" rx="24" ry="7" fill="${GRN13}" stroke="var(--ink)" stroke-width=".8"/><path d="M${x - 8} ${y + 4} L${x - 14} ${y - 12} L${x - 4} ${y - 4} L${x} ${y - 16} L${x + 4} ${y - 4} L${x + 14} ${y - 12} L${x + 8} ${y + 4} Z" fill="#e58fb0" stroke="var(--ink)" stroke-width=".8" stroke-linejoin="round"/>`, L2("water lily", "শাপলা"));
      s += cell(5, (x, y) => `<path d="M${x - 20} ${y + 12} q2 -7 10 -7 h18 q6 0 8 -8 q4 -2 5 3 q0 12 -10 12 Z" fill="#c9a36a" stroke="var(--ink)" stroke-width=".9" stroke-linejoin="round"/><path d="M${x + 17} ${y - 4} l3 -9 M${x + 20} ${y - 3} l7 -6" stroke="var(--ink)" stroke-width="1.1" stroke-linecap="round"/><circle cx="${x - 4}" cy="${y - 2}" r="11" fill="${ZOO13}" stroke="var(--ink)" stroke-width=".9"/><path d="M${x - 4} ${y - 2} m0 2 a2.5 2.5 0 1 1 2.5 -2.5 a5.5 5.5 0 1 1 -5.5 -5.5" fill="none" stroke="var(--ink)" stroke-width=".9"/>`, L2("snail", "শামুক"));
    } else {
      s += T13(180, 18, L2("different places, different communities", "ভিন্ন জায়গা, ভিন্ন জীব সম্প্রদায়"), "middle", 12.5, "var(--muted)");
      const tile = (i, inner, name) => { const x = 8 + i * 88; return `<g transform="translate(${x} 30)"><rect width="80" height="96" rx="6" fill="${WAT13}" opacity=".18"/>${inner}<rect width="80" height="96" rx="6" fill="none" stroke="var(--muted)" stroke-width="1.2"/></g>` + T13(x + 40, 146, name[0], "middle", 12.5, "var(--ink)", "700") + (name[1] ? T13(x + 40, 162, name[1], "middle", 12.5, "var(--ink)", "700") : ""); };
      s += tile(0, `<path d="M0 96 V62 Q20 30 42 58 Q58 34 80 56 V90 Q80 96 74 96 Z" fill="${GRN13}"/><path d="M0 96 V76 Q26 56 48 78 Q64 66 80 76 V90 Q80 96 74 96 Z" fill="#3c7f47"/>` + tree13(22, 70, 0.5, "#2f6a3a") + tree13(60, 66, 0.5, "#2f6a3a"), L2(["Hill", "forest"], ["পাহাড়ি", "বন"]));
      s += tile(1, `<rect y="48" width="80" height="48" fill="${WAT13}" opacity=".55"/><path d="M6 62 h18 M40 72 h22 M14 84 h20 M52 56 h16" stroke="var(--sheet)" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>` + tree13(58, 52, 0.6) + `<path d="M14 50 v-12 M18 50 v-16 M22 50 v-10" stroke="${GRN13}" stroke-width="2" stroke-linecap="round"/>`, L2(["Haor", ""], ["হাওর", ""]));
      s += tile(2, `<rect y="66" width="80" height="30" fill="${WAT13}" opacity=".55"/>` + [18, 42, 64].map(x => `<path d="M${x} 66 l-7 14 M${x} 66 l7 14 M${x} 66 v14 M${x} 66 v-18" stroke="${MUD13}" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="40" r="11" fill="${GRN13}"/>`).join(""), L2(["Mangrove", "forest"], ["ম্যানগ্রোভ", "বন"]));
      s += tile(3, `<rect y="40" width="80" height="56" fill="${WAT13}" opacity=".6"/><ellipse cx="40" cy="64" rx="26" ry="9" fill="#e6d3a1" stroke="var(--ink)" stroke-width=".6"/><path d="M40 62 q-3 -14 2 -26" stroke="${MUD13}" stroke-width="2.4" fill="none"/><path d="M42 36 q-12 -6 -18 2 M42 36 q10 -8 18 0 M42 36 q-4 -12 -14 -10 M42 36 q8 -10 16 -6" stroke="${GRN13}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M8 84 q6 -4 12 0 t12 0 M48 86 q6 -4 12 0 t12 0" stroke="var(--sheet)" stroke-width="1.3" fill="none" opacity=".8"/>`, L2(["Sea and", "coral island"], ["সাগর ও", "প্রবাল দ্বীপ"]));
    }
    const txt = ty === "gen" ? L2("<b>Genetic diversity</b>: the variety among members of the <b>same</b> species, caused by small differences in their genes. All these mangoes are one species; so are the thousands of varieties of rice grown in Bangladesh.", "<b>বংশগতীয় বৈচিত্র্য</b>: জিনের সামান্য ভিন্নতার কারণে <b>একই</b> প্রজাতির সদস্যদের মধ্যে যে বৈচিত্র্য। এই সব আমই একটি প্রজাতি; বাংলাদেশে চাষ হওয়া হাজার হাজার জাতের ধানও তা-ই।")
      : ty === "sp" ? L2("<b>Species diversity</b>: how many <b>different species</b> live in a place. A haor has trees, water plants, fish, snails, frogs and birds of many species. The more species, the more paths in the food web.", "<b>প্রজাতিগত বৈচিত্র্য</b>: একটি জায়গায় কতগুলো <b>ভিন্ন ভিন্ন প্রজাতি</b> বাস করে। হাওরে নানা প্রজাতির গাছ, জলজ উদ্ভিদ, মাছ, শামুক, ব্যাঙ ও পাখি থাকে। প্রজাতি যত বেশি, খাদ্যজালে পথ তত বেশি।")
        : L2("<b>Ecosystem diversity</b>: the variety of <b>ecosystems</b>. Each kind of place has its own physical conditions, so it builds up its own community of living things. Bangladesh is small, yet it has all of these and more.", "<b>বাস্তুতান্ত্রিক বৈচিত্র্য</b>: <b>বাস্তুতন্ত্রের</b> ভিন্নতা। প্রতিটি ধরনের জায়গার ভৌত অবস্থা আলাদা, তাই সেখানে গড়ে ওঠে নিজস্ব জীব সম্প্রদায়। বাংলাদেশ ছোট দেশ, তবু এখানে এর সব কটিই আছে, আরও আছে।");
    body.innerHTML = `<div class="chipset b13dk" role="group">${Object.keys(NM).map(k => `<button data-k="${k}" aria-pressed="${k === ty}">${NM[k]}</button>`).join("")}</div><div class="svgwrap fit" style="margin-top:8px">${s}</svg></div><div class="w-out">${txt}</div>`;
    chips13(body, ".b13dk", b => { ty = b.dataset.k; drawTypes(); });
  };
  const sort = () => sort13(body, [
    [L2("Kataribhog, Kalijira and Balam are all rice, <i>Oryza sativa</i>.", "কাটারিভোগ, কালিজিরা ও বালাম সবই ধান, <i>Oryza sativa</i>।"), "gen", L2("They are varieties of one species; the differences come from their genes.", "এরা একটি প্রজাতিরই জাত; পার্থক্য আসে জিন থেকে।")],
    [L2("More than a hundred kinds of fish live in one haor.", "একটি হাওরেই একশর বেশি রকমের মাছ বাস করে।"), "sp", L2("Many different species are living in one place.", "এক জায়গায় অনেকগুলো ভিন্ন প্রজাতি বাস করছে।")],
    [L2("Bangladesh has hill forests, sal forests, mangroves, haors and a coral island.", "বাংলাদেশে আছে পাহাড়ি বন, শালবন, ম্যানগ্রোভ বন, হাওর আর একটি প্রবাল দ্বীপ।"), "eco", L2("The places themselves are of different kinds, each with its own community.", "জায়গাগুলোই ভিন্ন ধরনের, প্রতিটির নিজস্ব জীব সম্প্রদায় আছে।")],
    [L2("Two goats of the same herd differ in their power to resist a disease.", "একই পালের দুটি ছাগলের রোগ প্রতিরোধের ক্ষমতা আলাদা।"), "gen", L2("Members of one species differ because their genes differ.", "জিন আলাদা বলে একই প্রজাতির সদস্যরা আলাদা হয়।")],
    [L2("The Sundarbans has tigers, deer, crocodiles, dolphins and hundreds of kinds of birds.", "সুন্দরবনে আছে বাঘ, হরিণ, কুমির, শুশুক আর শত শত রকমের পাখি।"), "sp", L2("This is a count of the different species of one place.", "এটি এক জায়গার ভিন্ন ভিন্ন প্রজাতির হিসাব।")],
    [L2("The plants and animals of a small pond are different from those of a river.", "ছোট একটি পুকুরের উদ্ভিদ ও প্রাণী নদীর উদ্ভিদ ও প্রাণী থেকে আলাদা।"), "eco", L2("Two different ecosystems hold two different communities.", "দুটি ভিন্ন বাস্তুতন্ত্রে দুটি ভিন্ন জীব সম্প্রদায়।")],
    [L2("No two people are exactly alike, although all humans are one species.", "সব মানুষ একই প্রজাতির হলেও কোনো দুজন মানুষ হুবহু এক নয়।"), "gen", L2("Variety inside a single species is genetic diversity.", "একটি প্রজাতির ভেতরের বৈচিত্র্যই বংশগতীয় বৈচিত্র্য।")],
    [L2("About 13 lakh species of animals have been described and named so far.", "এখন পর্যন্ত প্রায় ১৩ লক্ষ প্রাণী-প্রজাতির বর্ণনা ও নামকরণ হয়েছে।"), "sp", L2("The number of species is the usual measure of species diversity.", "প্রজাতির সংখ্যাই প্রজাতিগত বৈচিত্র্যের সাধারণ মাপ।")],
    [L2("A desert, a grassland and a sea each have a community of living things of their own.", "মরুভূমি, তৃণভূমি ও সাগর, প্রতিটিতে গড়ে ওঠে নিজস্ব জীব সম্প্রদায়।"), "eco", L2("Different ecosystems, each fitted to its own conditions.", "ভিন্ন ভিন্ন বাস্তুতন্ত্র, প্রতিটি নিজের অবস্থার সাথে খাপ খাওয়ানো।")]],
    [["gen", L2("Genetic", "বংশগতীয়")], ["sp", L2("Species", "প্রজাতিগত")], ["eco", L2("Ecosystem", "বাস্তুতান্ত্রিক")]],
    { q: L2("Which type of biodiversity does this show?", "এটি কোন প্রকারের জীববৈচিত্র্য দেখায়?"), end: L2("Ask what is varying: the <b>genes</b> inside one species, the <b>species</b> of one place, or the kind of <b>ecosystem</b> itself.", "জিজ্ঞেস করো, ভিন্নতাটা কিসের: একটি প্রজাতির ভেতরের <b>জিনের</b>, এক জায়গার <b>প্রজাতির</b>, নাকি <b>বাস্তুতন্ত্রের</b> ধরনেরই।") });
  chips13(el, ".b13dt", b => { tab = b.dataset.t; (tab === "types" ? drawTypes : sort)(); });
  drawTypes();
};

/* 13.5.2 interactions: explore the signs + sorting game */
W.b13inter = (el) => {
  /* type: [name, positive?, signs, examples [A, B, what A gets, what B gets]] */
  const TY = {
    mut: [L2("Mutualism", "মিউচুয়ালিজম"), true, ["+", "+"], [
      [L2("Bee", "মৌমাছি"), L2("Mustard flower", "সরিষা ফুল"), L2("gets nectar", "মধু পায়"), L2("is pollinated", "পরাগায়ন হয়")],
      [L2("Rhizobium", "রাইজোবিয়াম"), L2("Bean plant", "শিমগাছ"), L2("gets carbohydrate and a home in the root nodule", "শর্করা আর মূলের গুটিতে বাসা পায়"), L2("gets nitrogen fixed from the air", "বায়ু থেকে সংবন্ধিত নাইট্রোজেন পায়")],
      [L2("Alga", "শৈবাল"), L2("Fungus", "ছত্রাক"), L2("gets water and mineral salts", "পানি ও খনিজ লবণ পায়"), L2("gets carbohydrate; together they are a lichen", "শর্করা পায়; দুজনে মিলে লাইকেন")],
      [L2("Fruit bat", "বাদুড়"), L2("Fruit tree", "ফলের গাছ"), L2("gets fruit to eat", "খাওয়ার ফল পায়"), L2("gets its seeds carried far away", "বীজ দূরে ছড়িয়ে পড়ে")]]],
    com: [L2("Commensalism", "কমেনসেলিজম"), true, ["+", "0"], [
      [L2("Orchid", "অর্কিড (রাস্না)"), L2("Mango tree", "আমগাছ"), L2("gets a place in the light; it makes its own food", "আলোয় থাকার জায়গা পায়; খাদ্য নিজেই তৈরি করে"), L2("neither gains nor loses", "লাভও নেই, ক্ষতিও নেই")],
      [L2("Woody climber", "কাষ্ঠল লতা"), L2("Tall tree", "বড় গাছ"), L2("climbs up and gets more light", "বেয়ে উঠে বেশি আলো পায়"), L2("is not harmed; no food is taken from it", "কোনো ক্ষতি হয় না; তার খাদ্য নেওয়া হয় না")]]],
    exp: [L2("Exploitation", "শোষণ"), false, ["+", "−"], [
      [L2("Dodder", "স্বর্ণলতা"), L2("Host plant", "পোষক উদ্ভিদ"), L2("sucks food through its haustoria", "হস্টোরিয়া দিয়ে খাদ্য টেনে নেয়"), L2("loses its food and grows weak", "খাদ্য হারায়, দুর্বল হয়ে পড়ে")],
      [L2("Koel", "কোকিল"), L2("Crow", "কাক"), L2("gets its egg hatched and its chick fed", "ডিম ফোটানো আর ছানা পালনের কাজ করিয়ে নেয়"), L2("spends its labour on another bird's chick", "অন্যের ছানার পেছনে খাটে")]]],
    cmp: [L2("Competition", "প্রতিযোগিতা"), false, ["−", "−"], [
      [L2("Paddy", "ধান"), L2("Weeds", "আগাছা"), L2("gets less light, water and fertiliser", "আলো, পানি ও সার কম পায়"), L2("also get less; one side is finally driven out", "এরাও কম পায়; শেষে এক পক্ষ বিতাড়িত হয়")],
      [L2("Seedling", "চারাগাছ"), L2("Its neighbour", "পাশের চারা"), L2("stays thin: same species, same needs", "রোগা থাকে: একই প্রজাতি, একই চাহিদা"), L2("stays thin too", "এটিও রোগা থাকে")]]],
    ant: [L2("Antibiosis", "অ্যান্টিবায়োসিস"), false, ["0", "−"], [
      [L2("Penicillium", "পেনিসিলিয়াম"), L2("Bacteria", "ব্যাকটেরিয়া"), L2("gives out a substance; nothing changes for the fungus", "একটি পদার্থ ছাড়ে; ছত্রাকের নিজের কিছু বদলায় না"), L2("cannot grow near the fungus", "ছত্রাকের কাছে বাড়তে পারে না")]]]};
  let tab = "ex", ty = "mut", xi = 0;
  el.innerHTML = `<div class="chipset b13it" role="group"><button data-t="ex" aria-pressed="true">${L2("Explore", "দেখো")}</button><button data-t="sort" aria-pressed="false">${L2("Sort it", "সাজাও")}</button></div><div id="b13ib" style="margin-top:10px"></div>`;
  const body = $("#b13ib", el);
  const sc = g => g === "+" ? "var(--good)" : g === "−" ? "var(--bad)" : "var(--muted)";
  const drawEx = () => {
    const [nm, pos, sg, exs] = TY[ty], ex = exs[xi % exs.length], z = B13("0");
    const side = (x, name, g) => `<rect x="${x - 74}" y="46" width="148" height="50" rx="10" fill="var(--c-soft)" stroke="var(--c)" stroke-width="1.6"/>` + T13(x, 77, name, "middle", 15, "var(--ink)", "700") + `<circle cx="${x}" cy="46" r="15" fill="var(--sheet)" stroke="${sc(g)}" stroke-width="2.4"/>` + T13(x, 53, g === "0" ? z : g, "middle", 20, sc(g), "700");
    let s = `<svg viewBox="0 0 360 112" role="img" aria-label="${nm}">`;
    s += T13(180, 16, pos ? L2("positive interaction", "ধনাত্মক আন্তঃক্রিয়া") : L2("negative interaction", "ঋণাত্মক আন্তঃক্রিয়া"), "middle", 13, pos ? "var(--good)" : "var(--bad)", "700");
    s += `<path d="M168 71 H192 M172 66 l-5 5 l5 5 M188 66 l5 5 l-5 5" fill="none" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += side(92, ex[0], sg[0]) + side(268, ex[1], sg[1]);
    const lab = g => g === "+" ? L2("gains", "লাভ") : g === "−" ? L2("is harmed", "ক্ষতি") : L2("no change", "কিছু বদলায় না");
    const o = `<b>${nm} (${sg[0] === "0" ? z : sg[0]} ${sg[1] === "0" ? z : sg[1]})</b><br><span style="color:${sc(sg[0])};font-weight:700">${sg[0] === "0" ? z : sg[0]}</span> <b>${ex[0]}</b> (${lab(sg[0])}): ${ex[2]}${L2(".", "।")}<br><span style="color:${sc(sg[1])};font-weight:700">${sg[1] === "0" ? z : sg[1]}</span> <b>${ex[1]}</b> (${lab(sg[1])}): ${ex[3]}${L2(".", "।")}`;
    body.innerHTML = `<div class="chipset b13ik" role="group">${Object.keys(TY).map(k => `<button data-k="${k}" aria-pressed="${k === ty}">${TY[k][0]}</button>`).join("")}</div><div class="svgwrap fit" style="margin-top:8px">${s}</svg></div><div class="w-out">${o}</div>${exs.length > 1 ? `<div class="w-row" style="margin-top:8px"><button class="btn solid" id="b13in">${L2("Another example", "আরেকটি উদাহরণ")} ▶</button><span class="hint">${B13(xi % exs.length + 1)} / ${B13(exs.length)}</span></div>` : ""}<p class="hint" style="margin:8px 0 0">${L2("+ gains · − is harmed · 0 no change", `+ লাভ · − ক্ষতি · ${z} কিছু বদলায় না`)}</p>`;
    chips13(body, ".b13ik", b => { ty = b.dataset.k; xi = 0; drawEx(); });
    if (exs.length > 1) $("#b13in", el).addEventListener("click", () => { xi++; drawEx(); });
  };
  const sort = () => sort13(body, [
    [L2("A bee takes nectar from a litchi flower and carries its pollen to another flower.", "মৌমাছি লিচু ফুল থেকে মধু নেয় আর তার পরাগরেণু অন্য ফুলে পৌঁছে দেয়।"), "mut", L2("The bee gets food and the flower is pollinated: both gain.", "মৌমাছি খাদ্য পায়, ফুলের পরাগায়ন হয়: দুজনেরই লাভ।")],
    [L2("An orchid sits on a mango branch and makes its own food.", "একটি অর্কিড আমগাছের ডালে বসে থাকে আর নিজের খাদ্য নিজে তৈরি করে।"), "com", L2("The orchid gets a place in the light; the tree is neither helped nor harmed.", "অর্কিড আলোয় থাকার জায়গা পায়; গাছের লাভ বা ক্ষতি কিছুই হয় না।")],
    [L2("Dodder draws food from a mehedi hedge through its haustoria.", "স্বর্ণলতা হস্টোরিয়া দিয়ে মেহেদির বেড়া থেকে খাদ্য টেনে নেয়।"), "exp", L2("The dodder gains by depriving its host of food.", "স্বর্ণলতা পোষককে খাদ্য থেকে বঞ্চিত করে নিজে লাভবান হয়।")],
    [L2("Weeds and paddy plants in one field need the same light, water and fertiliser.", "একই খেতের আগাছা ও ধানগাছের একই আলো, পানি ও সার দরকার।"), "cmp", L2("Both want the same things from the same place, so each gets less.", "দুজনেই একই জায়গা থেকে একই জিনিস চায়, তাই প্রত্যেকে কম পায়।")],
    [L2("Bacteria cannot grow around a colony of <i>Penicillium</i> on a culture plate.", "কালচার প্লেটে পেনিসিলিয়ামের কলোনির চারপাশে ব্যাকটেরিয়া জন্মাতে পারে না।"), "ant", L2("A substance made by the fungus stops the growth of the bacteria.", "ছত্রাকের তৈরি একটি পদার্থ ব্যাকটেরিয়ার বৃদ্ধি থামিয়ে দেয়।")],
    [L2("<i>Rhizobium</i> in the root nodules of a pea plant fixes nitrogen and receives carbohydrate.", "মটরগাছের মূলের গুটিতে থাকা রাইজোবিয়াম নাইট্রোজেন সংবন্ধন করে আর শর্করা পায়।"), "mut", L2("The plant gets nitrogen and the bacteria get food: both gain.", "গাছ পায় নাইট্রোজেন, ব্যাকটেরিয়া পায় খাদ্য: দুজনেরই লাভ।")],
    [L2("A koel lays its egg in a crow's nest, and the crow raises the chick.", "কোকিল কাকের বাসায় ডিম পাড়ে, আর কাক সেই ছানা বড় করে।"), "exp", L2("The koel gains at the cost of the crow.", "কোকিল লাভবান হয় কাকের ক্ষতির বিনিময়ে।")],
    [L2("A woody climber climbs a tall tree to reach the light but takes no food from it.", "একটি কাষ্ঠল লতা আলো পেতে বড় গাছ বেয়ে ওঠে, তবে গাছ থেকে কোনো খাদ্য নেয় না।"), "com", L2("Only the climber gains; the tree is not harmed.", "লাভ শুধু লতাটির; গাছের কোনো ক্ষতি হয় না।")],
    [L2("An alga and a fungus live together as a lichen on a tree trunk.", "গাছের গুঁড়িতে একটি শৈবাল ও একটি ছত্রাক মিলে লাইকেন হিসেবে বাস করে।"), "mut", L2("The fungus supplies water and minerals, the alga supplies carbohydrate.", "ছত্রাক যোগায় পানি ও খনিজ, শৈবাল যোগায় শর্করা।")],
    [L2("Seedlings sown too close together in a seedbed all stay thin and weak.", "বীজতলায় খুব ঘন করে বোনা চারাগুলো সবই রোগা ও দুর্বল থাকে।"), "cmp", L2("Members of the same species compete for light, water and nutrients.", "একই প্রজাতির সদস্যরা আলো, পানি ও পুষ্টির জন্য প্রতিযোগিতা করে।")],
    [L2("A bat eats guavas and drops the seeds far from the tree.", "বাদুড় পেয়ারা খায় আর বীজগুলো গাছ থেকে দূরে গিয়ে ফেলে।"), "mut", L2("The bat gets food and the tree gets its seeds spread.", "বাদুড় খাদ্য পায়, আর গাছের বীজ ছড়িয়ে পড়ে।")]],
    Object.keys(TY).map(k => [k, TY[k][0]]),
    { q: L2("Which interaction is this?", "এটি কোন আন্তঃক্রিয়া?"), end: L2("Give each partner a sign: mutualism + +, commensalism + 0, exploitation + −, competition − −, antibiosis 0 −.", `প্রতিটি সহযোগীকে চিহ্ন দাও: মিউচুয়ালিজম + +, কমেনসেলিজম + ${B13("0")}, শোষণ + −, প্রতিযোগিতা − −, অ্যান্টিবায়োসিস ${B13("0")} −।`) });
  chips13(el, ".b13it", b => { tab = b.dataset.t; (tab === "ex" ? drawEx : sort)(); });
  drawEx();
};

/* 13.6 greenhouse effect at three levels of greenhouse gas + which pollution? */
W.b13green = (el) => {
  let tab = "gh", lv = "nat";
  el.innerHTML = `<div class="chipset b13gt" role="group"><button data-t="gh" aria-pressed="true">${L2("Greenhouse", "গ্রিনহাউস")}</button><button data-t="sort" aria-pressed="false">${L2("Which pollution?", "কোন দূষণ?")}</button></div><div id="b13gb" style="margin-top:10px"></div>`;
  const body = $("#b13gb", el);
  const LV = {
    none: [L2("No greenhouse gases", "গ্রিনহাউস গ্যাস নেই"), 0, 4, -18, L2("about −18 °C", "প্রায় −১৮ °C"), L2("With no greenhouse gases, almost all the heat given out by the ground would escape straight to space. The average temperature of the Earth would be about <b>−18 °C</b>: a frozen planet.", "গ্রিনহাউস গ্যাস একেবারে না থাকলে ভূপৃষ্ঠের ছাড়া তাপের প্রায় সবটাই সোজা মহাশূন্যে চলে যেত। পৃথিবীর গড় তাপমাত্রা হতো প্রায় <b>−১৮ °C</b>: বরফে জমা এক গ্রহ।")],
    nat: [L2("Natural amount", "প্রাকৃতিক পরিমাণ"), 9, 2, 15, L2("about 15 °C", "প্রায় ১৫ °C"), L2("The natural amount of carbon dioxide, methane, nitrous oxide and water vapour holds back part of the heat. The average temperature stays near <b>15 °C</b>, which suits living things. This natural greenhouse effect is good for us.", "প্রাকৃতিক পরিমাণের কার্বন ডাই-অক্সাইড, মিথেন, নাইট্রাস অক্সাইড ও জলীয় বাষ্প তাপের একটি অংশ আটকে রাখে। গড় তাপমাত্রা থাকে <b>১৫ °C</b>-এর কাছাকাছি, যা জীবের জন্য উপযোগী। এই প্রাকৃতিক গ্রিনহাউস ইফেক্ট আমাদের জন্য ভালো।")],
    high: [L2("Too much", "অতিরিক্ত"), 22, 1, 19, L2("above 15 °C and rising", "১৫ °C-এর বেশি, বাড়ছে"), L2("Burning coal, oil and gas and cutting forests add extra greenhouse gases. More heat is held back and the Earth warms up: ice melts, the sea rises, coasts are flooded, and storms grow stronger. This is the danger your book warns about.", "কয়লা, তেল ও গ্যাস পোড়ালে আর বন কাটলে বাড়তি গ্রিনহাউস গ্যাস জমে। বেশি তাপ আটকে পড়ে, পৃথিবী গরম হতে থাকে: বরফ গলে, সমুদ্র উঁচু হয়, উপকূল তলিয়ে যায়, ঝড় তীব্র হয়। তোমার বইয়ে এই বিপদের কথাই বলা হয়েছে।")]};
  const drawGh = () => {
    const [, dots, esc, temp, tl, txt] = LV[lv];
    let s = `<svg viewBox="0 0 360 232" role="img" aria-label="${L2("The greenhouse effect", "গ্রিনহাউস ইফেক্ট")}">${arrowDefs("b13gs", SUN13)}${arrowDefs("b13gh", HEAT13)}`;
    s += `<rect x="0" y="0" width="290" height="232" fill="${WAT13}" opacity=".12"/><rect x="0" y="62" width="290" height="46" fill="var(--muted)" opacity="${dots ? (dots > 12 ? 0.28 : 0.14) : 0}"/>`;
    for (let i = 0; i < dots; i++) s += `<circle cx="${(18 + (i * 67) % 262).toFixed(0)}" cy="${(84 + (i * 29) % 20).toFixed(0)}" r="3.2" fill="var(--muted)"/>`;
    s += `<path d="M0 196 Q70 186 150 194 Q230 202 290 192 V232 H0 Z" fill="${GRN13}" opacity=".8"/>` + tree13(232, 196, 0.6, "#2f6a3a") + tree13(256, 198, 0.5, "#2f6a3a");
    s += sun13(28, 36, 11) + `<line x1="42" y1="48" x2="86" y2="180" stroke="${SUN13}" stroke-width="3.4" marker-end="url(#b13gs)"/>`;
    [134, 168, 202, 236].forEach((x, i) => {
      if (i < esc) s += `<path d="M${x} 186 q8 -22 0 -44 q-8 -22 0 -44 q8 -22 0 -44 q-6 -18 0 -32" fill="none" stroke="${HEAT13}" stroke-width="2.4" marker-end="url(#b13gh)"/>`;
      else s += `<path d="M${x} 186 q8 -20 0 -40 q-8 -20 0 -40 q8 -14 14 0 q4 22 0 40 q-4 18 2 34" fill="none" stroke="${HEAT13}" stroke-width="2.4" marker-end="url(#b13gh)"/>`;
    });
    s += T13(150, 222, L2("heat given out by the ground", "ভূপৃষ্ঠের ছাড়া তাপ"), "middle", 12, "var(--sheet)", "700");
    s += T13(8, 14, L2("space", "মহাশূন্য"), "start", 12, "var(--muted)") + (dots ? T13(8, 78, L2("greenhouse gases", "গ্রিনহাউস গ্যাস"), "start", 12, "var(--ink)", "", true) : "") + T13(72, 136, L2("sunlight", "সূর্যালোক"), "start", 12, "var(--ink)", "700", true);
    /* thermometer: -30 °C at y = 190, +30 °C at y = 40 */
    const ty = t => 190 - (t + 30) * 2.5;
    s += `<rect x="316" y="34" width="14" height="166" rx="7" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><circle cx="323" cy="206" r="13" fill="${HEAT13}" stroke="var(--ink)" stroke-width="1.4"/><rect x="319" y="${ty(temp).toFixed(0)}" width="8" height="${(200 - ty(temp)).toFixed(0)}" fill="${HEAT13}"/>`;
    [[-18, "−18"], [0, "0"], [15, "15"]].forEach(([t, l]) => { s += `<line x1="308" y1="${ty(t)}" x2="316" y2="${ty(t)}" stroke="var(--ink)" stroke-width="1.2"/>` + T13(305, ty(t) + 4, B13(l), "end", 12, "var(--ink)"); });
    s += T13(323, 24, "°C", "middle", 12, "var(--ink)", "700") + (lv === "high" ? `<path d="M340 ${ty(temp) + 14} v-22 m-5 6 l5 -7 l5 7" fill="none" stroke="${HEAT13}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` : "");
    body.innerHTML = `<div class="chipset b13gl" role="group">${Object.keys(LV).map(k => `<button data-l="${k}" aria-pressed="${k === lv}">${LV[k][0]}</button>`).join("")}</div><div class="svgwrap fit" style="margin-top:8px">${s}</svg></div><div class="w-out"><b>${L2("Average temperature:", "গড় তাপমাত্রা:")} ${tl}${L2(".", "।")}</b> ${txt}</div><p class="hint" style="margin:8px 0 0">${L2("A simple picture, not to scale: each red arrow stands for a share of the heat.", "এটি একটি সরল ছবি, মাপমতো নয়: প্রতিটি লাল তীর তাপের একটি ভাগ বোঝায়।")}</p>`;
    chips13(body, ".b13gl", b => { lv = b.dataset.l; drawGh(); });
  };
  const sort = () => sort13(body, [
    [L2("Black smoke from the chimney of a brick kiln", "ইটভাটার চিমনির কালো ধোঁয়া"), "air", L2("Smoke and dust mix with the air we breathe.", "ধোঁয়া ও ধুলা মিশে যায় আমাদের শ্বাসের বাতাসে।")],
    [L2("Coloured waste water of a dyeing factory let into a river", "ডাইং কারখানার রঙিন বর্জ্য পানি নদীতে ফেলা"), "water", L2("The chemicals poison the water and kill fish and other aquatic life.", "রাসায়নিক পদার্থ পানিকে বিষাক্ত করে, মাছ ও অন্যান্য জলজ জীব মারা যায়।")],
    [L2("Polythene bags buried in farmland", "ফসলি জমিতে পুঁতে ফেলা পলিথিনের ব্যাগ"), "soil", L2("Polythene does not rot; it lies in the soil for years and blocks water and roots.", "পলিথিন পচে না; বছরের পর বছর মাটিতে থেকে পানি ও শিকড়ের পথ আটকায়।")],
    [L2("Hydraulic horns of buses and trucks", "বাস-ট্রাকের হাইড্রোলিক হর্ন"), "sound", L2("Very loud noise harms hearing and health.", "খুব জোরালো শব্দ শ্রবণশক্তি ও স্বাস্থ্যের ক্ষতি করে।")],
    [L2("Exhaust smoke from old, badly kept vehicles", "পুরোনো, অযত্নে রাখা গাড়ির ধোঁয়া"), "air", L2("The exhaust adds harmful gases and soot to the air.", "গাড়ির ধোঁয়া বাতাসে ক্ষতিকর গ্যাস ও কালি মেশায়।")],
    [L2("Household rubbish and sewage dumped into a pond", "পুকুরে ফেলা বাড়ির আবর্জনা ও পয়োবর্জ্য"), "water", L2("The water turns foul, its oxygen falls and disease germs spread.", "পানি নষ্ট হয়, অক্সিজেন কমে যায়, রোগজীবাণু ছড়ায়।")],
    [L2("Far too much chemical fertiliser put on the same field year after year", "একই জমিতে বছরের পর বছর মাত্রাতিরিক্ত রাসায়নিক সার দেওয়া"), "soil", L2("It spoils the quality of the soil and kills useful soil organisms.", "এতে মাটির গুণাগুণ নষ্ট হয়, মাটির উপকারী জীব মারা যায়।")],
    [L2("Loudspeakers played at full volume late at night", "গভীর রাতে পুরো আওয়াজে মাইক বাজানো"), "sound", L2("Unwanted loud sound is sound pollution.", "অবাঞ্ছিত জোরালো শব্দই শব্দদূষণ।")]],
    [["air", L2("Air", "বায়ুদূষণ")], ["water", L2("Water", "পানিদূষণ")], ["soil", L2("Soil", "মাটিদূষণ")], ["sound", L2("Sound", "শব্দদূষণ")]],
    { q: L2("Which kind of pollution does this mainly cause?", "এটি প্রধানত কোন ধরনের দূষণ ঘটায়?"), end: L2("Now look around your own area: which of these causes can you find, and which could be reduced?", "এবার নিজের এলাকায় তাকাও: এর কোন কোন কারণ সেখানে আছে, আর কোনগুলো কমানো সম্ভব?") });
  chips13(el, ".b13gt", b => { tab = b.dataset.t; (tab === "gh" ? drawGh : sort)(); });
  drawGh();
};
