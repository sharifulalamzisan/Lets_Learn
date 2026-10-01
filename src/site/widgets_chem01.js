/* ---- chemistry chapter 1 widgets: concepts of chemistry ---- */
const B1 = x => bnNum(x, LANG);
const chips1 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
/* atom colours; text colour chosen so the letter stays readable */
const ATOM1 = { C: ["var(--ink)", "var(--sheet)"], H: ["var(--sheet)", "var(--ink)"], O: ["var(--bad)", "var(--sheet)"], Cl: ["var(--good)", "var(--sheet)"], Mg: ["var(--c)", "var(--sheet)"], Fe: ["var(--note)", "var(--ink)"] };
const atom1 = (el, x, y, r) => { const [f, t] = ATOM1[el]; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${f}" stroke="var(--ink)" stroke-width="1"/><text x="${x.toFixed(1)}" y="${(y + 4.5).toFixed(1)}" font-size="${el.length > 1 ? 11 : 13}" text-anchor="middle" fill="${t}" font-weight="700">${el}</text>`; };
const ease1 = p => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

/* 1.1 everyday events explained by chemistry: atoms rearranging, plus a mango ripening and a history timeline */
W.k1events = (el) => {
  /* each reaction: atoms [element, startX, startY, endX, endY]; equation text; explanation */
  const RX = {
    gas: {
      atoms: [["C", 60, 100, 262, 100], ["H", 38, 100, 226, 56], ["H", 82, 100, 262, 56], ["H", 60, 78, 226, 144], ["H", 60, 122, 262, 144],
        ["O", 130, 72, 238, 100], ["O", 154, 72, 286, 100], ["O", 130, 128, 244, 44], ["O", 154, 128, 244, 156]],
      eq: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      en: "Natural gas (methane) burns: the C–H and O=O bonds break, and the same atoms join up again as carbon dioxide and water. Energy is released as heat and light. Count the atoms: nothing is lost or gained.",
      bn: "প্রাকৃতিক গ্যাস (মিথেন) জ্বলছে: C–H আর O=O বন্ধন ভেঙে একই পরমাণুগুলো নতুন করে যুক্ত হয়ে কার্বন ডাইঅক্সাইড আর পানি তৈরি করে। শক্তি বের হয় তাপ ও আলো হিসেবে। পরমাণু গুনে দেখো: কিছুই হারায়নি, বাড়েওনি।" },
    ant: {
      atoms: [["Mg", 60, 100, 262, 100], ["O", 60, 70, 236, 50], ["H", 60, 46, 216, 38], ["O", 60, 130, 236, 150], ["H", 60, 154, 216, 162],
        ["H", 128, 68, 256, 38], ["Cl", 152, 68, 234, 100], ["H", 128, 132, 256, 162], ["Cl", 152, 132, 290, 100]],
      eq: "Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O",
      en: "Antacid meets stomach acid: magnesium hydroxide neutralises hydrochloric acid, making magnesium chloride (a salt) and water. The extra acid is used up, so the burning feeling stops.",
      bn: "এন্টাসিড আর পাকস্থলীর এসিড: ম্যাগনেসিয়াম হাইড্রোক্সাইড হাইড্রোক্লোরিক এসিডকে প্রশমিত করে ম্যাগনেসিয়াম ক্লোরাইড (লবণ) আর পানি তৈরি করে। বাড়তি এসিড খরচ হয়ে যায়, তাই জ্বালাপোড়া থামে।" },
    rust: {
      atoms: [["Fe", 40, 70, 222, 56], ["Fe", 68, 70, 270, 56], ["Fe", 40, 130, 222, 144], ["Fe", 68, 130, 270, 144],
        ["O", 124, 50, 246, 36], ["O", 148, 50, 246, 76], ["O", 124, 100, 294, 56], ["O", 148, 100, 246, 124], ["O", 124, 150, 246, 164], ["O", 148, 150, 294, 144]],
      eq: "4Fe + 3O₂ → 2Fe₂O₃",
      en: "Iron rusts: in damp air, iron atoms combine with oxygen to form iron oxide, the brown rust. (Water must be present; real rust also contains water: Fe₂O₃·xH₂O.) Painting iron keeps air and water away.",
      bn: "লোহায় মরিচা: স্যাঁতসেঁতে বাতাসে লোহার পরমাণু অক্সিজেনের সাথে যুক্ত হয়ে আয়রন অক্সাইড, অর্থাৎ বাদামি মরিচা তৈরি করে। (পানি থাকতেই হয়; আসল মরিচায় পানিও থাকে: Fe₂O₃·xH₂O।) রং করলে লোহা বাতাস ও পানি থেকে আড়াল হয়।" }
  };
  const HIS = [
    ["c. 3500 BC", "খ্রিষ্টপূর্ব আনু. ৩৫০০", L2("Bronze", "ব্রোঞ্জ"), L2("Copper and tin melted together make bronze, a harder alloy for tools and weapons.", "কপার আর টিন একসাথে গলিয়ে তৈরি হলো ব্রোঞ্জ, হাতিয়ার ও অস্ত্রের জন্য আরও শক্ত সংকর ধাতু।")],
    ["c. 400 BC", "খ্রিষ্টপূর্ব আনু. ৪০০", L2("Democritus, Kanada", "ডেমোক্রিটাস, কণাদ"), L2("Matter is made of tiny indivisible particles: atomos. An idea only, with no experiments.", "পদার্থ অবিভাজ্য ক্ষুদ্র কণা দিয়ে তৈরি: অ্যাটমোস। শুধুই ধারণা, কোনো পরীক্ষা ছিল না।")],
    ["c. 350 BC", "খ্রিষ্টপূর্ব আনু. ৩৫০", L2("Aristotle", "অ্যারিস্টটল"), L2("Rejects atoms: everything is earth, fire, water and air. His view rules for about 2000 years.", "পরমাণু মানলেন না: সবকিছু মাটি, আগুন, পানি ও বাতাস। প্রায় ২০০০ বছর এই মতই চলল।")],
    ["8th century", "অষ্টম শতাব্দী", L2("Jabir ibn Hayyan", "জাবির ইবনে হাইয়ান"), L2("Alchemy: experiments in a laboratory. Often called the father of chemistry.", "আলকেমি: গবেষণাগারে পরীক্ষা-নিরীক্ষা। প্রায়ই রসায়নের জনক বলা হয়।")],
    ["1620", "১৬২০", L2("Francis Bacon", "ফ্রান্সিস বেকন"), L2("Argues that knowledge must be built on experiments and observation.", "বললেন, জ্ঞান গড়তে হবে পরীক্ষা ও পর্যবেক্ষণের ওপর।")],
    ["1661", "১৬৬১", L2("Robert Boyle", "রবার্ট বয়েল"), L2("The Sceptical Chymist: chemistry should rest on experiments, not on the four elements.", "দ্য স্কেপটিক্যাল কাইমিস্ট: রসায়ন দাঁড়াবে পরীক্ষার ওপর, চার উপাদানের ওপর নয়।")],
    ["1789", "১৭৮৯", L2("Antoine Lavoisier", "অ্যান্টনি ল্যাভয়সিয়ে"), L2("Careful weighing: mass is conserved in reactions; burning is combining with oxygen. Father of modern chemistry.", "নিখুঁত ওজন: বিক্রিয়ায় ভর সংরক্ষিত থাকে; দহন মানে অক্সিজেনের সাথে যুক্ত হওয়া। আধুনিক রসায়নের জনক।")],
    ["1808", "১৮০৮", L2("John Dalton", "জন ডাল্টন"), L2("Atomic theory: elements are made of atoms, which rearrange in reactions. Atoms return, now with evidence.", "পরমাণুবাদ: মৌল পরমাণু দিয়ে তৈরি, বিক্রিয়ায় পরমাণুগুলো নতুন করে সাজে। পরমাণুর ধারণা ফিরল, এবার প্রমাণসহ।")]];
  const K = [["mango", L2("Mango ripens", "আম পাকে")], ["gas", L2("Gas burns", "গ্যাস জ্বলে")], ["ant", L2("Antacid", "এন্টাসিড")], ["rust", L2("Iron rusts", "মরিচা")], ["his", L2("History", "ইতিহাস")]];
  let k = "mango", run = false;
  el.innerHTML = `<div class="chipset k1ek" role="group">${K.map(([a, b]) => `<button data-k="${a}" aria-pressed="${a === k}">${b}</button>`).join("")}</div>
    <div id="k1esl"></div><div class="w-row" id="k1ebt"></div><div class="svgwrap fit" id="k1esv"></div><div class="w-out" id="k1eo"></div>`;
  const setup = () => {
    run = false;
    if (k === "his") $("#k1esl", el).innerHTML = slider("k1ep", L2("Move through time", "সময়ের পথে চলো"), 0, HIS.length - 1, 1, 0, "");
    else if (k === "mango") $("#k1esl", el).innerHTML = slider("k1ep", L2("Days of ripening", "পাকার দিন"), 0, 10, 0.1, 0, "");
    else $("#k1esl", el).innerHTML = slider("k1ep", L2("Progress of the reaction", "বিক্রিয়ার অগ্রগতি"), 0, 1, 0.01, 0, "");
    $("#k1ebt", el).innerHTML = k === "his" ? "" : `<button class="btn solid" id="k1ego">${L2("Play", "চালাও")}</button>`;
    $("#k1ep", el).addEventListener("input", () => { run = false; draw(); });
    if (k !== "his") $("#k1ego", el).addEventListener("click", () => { const s = $("#k1ep", el); if (REDUCED) { s.value = s.max; draw(); } else { if (+s.value >= +s.max) s.value = 0; run = true; } });
    draw();
  };
  const draw = () => {
    const s = $("#k1ep", el), p = +s.value, max = +s.max; let g = "", out = "";
    if (k === "his") {
      $("#k1ep-v", el).textContent = L2(HIS[p][0], HIS[p][1]);
      const X = i => 24 + i * (312 / (HIS.length - 1));
      g = `<svg viewBox="0 0 360 190" role="img" aria-label="${L2("history of chemistry", "রসায়নের ইতিহাস")}"><line x1="24" y1="60" x2="336" y2="60" stroke="var(--rule)" stroke-width="4" stroke-linecap="round"/>
        <line x1="24" y1="60" x2="${X(p)}" y2="60" stroke="var(--c)" stroke-width="4" stroke-linecap="round"/>`;
      HIS.forEach((h, i) => g += `<circle cx="${X(i)}" cy="60" r="${i === p ? 10 : 6}" fill="${i <= p ? "var(--c)" : "var(--sheet)"}" stroke="var(--c)" stroke-width="2"/>`);
      g += `<text x="${Math.min(300, Math.max(60, X(p)))}" y="36" font-size="14" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2(HIS[p][0], HIS[p][1])}</text>`;
      /* little picture for the era */
      const ic = [
        `<path d="M150 150 l20 -50 l20 50 z" fill="var(--note)" stroke="var(--ink)"/><rect x="165" y="150" width="10" height="26" fill="var(--muted)"/>`,
        `<circle cx="160" cy="130" r="9" fill="var(--c)"/><circle cx="182" cy="122" r="7" fill="var(--c)" opacity=".7"/><circle cx="175" cy="146" r="11" fill="var(--c)" opacity=".5"/><circle cx="198" cy="140" r="6" fill="var(--c)" opacity=".8"/>`,
        `<g font-size="13" text-anchor="middle" fill="var(--ink)"><rect x="112" y="118" width="54" height="22" rx="4" fill="var(--note)" opacity=".5"/><text x="139" y="134">${L2("earth", "মাটি")}</text><rect x="172" y="118" width="54" height="22" rx="4" fill="var(--bad)" opacity=".4"/><text x="199" y="134">${L2("fire", "আগুন")}</text><rect x="112" y="146" width="54" height="22" rx="4" fill="var(--c)" opacity=".35"/><text x="139" y="162">${L2("water", "পানি")}</text><rect x="172" y="146" width="54" height="22" rx="4" fill="var(--rule)"/><text x="199" y="162">${L2("air", "বাতাস")}</text></g>`,
        `<path d="M165 112 h12 v16 l14 26 a6 6 0 0 1 -5 9 h-30 a6 6 0 0 1 -5 -9 l14 -26 z" fill="var(--c-soft)" stroke="var(--ink)"/><path d="M158 150 h36" stroke="var(--c)" stroke-width="6"/>`,
        `<rect x="150" y="112" width="40" height="52" rx="3" fill="var(--sheet)" stroke="var(--ink)"/><path d="M158 126 h24 M158 136 h24 M158 146 h16" stroke="var(--muted)" stroke-width="2"/>`,
        `<path d="M170 110 v20 l-18 30 h36 l-18 -30" fill="var(--c-soft)" stroke="var(--ink)"/><circle cx="170" cy="150" r="4" fill="var(--c)"/>`,
        `<path d="M140 150 h60 M170 150 v-30 M150 120 h40" stroke="var(--ink)" stroke-width="2"/><path d="M144 120 l6 16 h-12 z M190 120 l6 16 h-12 z" fill="var(--note)" stroke="var(--ink)"/>`,
        `${atom1("O", 150, 140, 11)}${atom1("H", 176, 128, 9)}${atom1("C", 200, 142, 11)}`][p];
      g += `<text x="180" y="96" font-size="15" text-anchor="middle" fill="var(--c)" font-weight="700">${HIS[p][2]}</text>` + ic + `</svg>`;
      out = `<b>${HIS[p][2]}</b>: ${HIS[p][3]}`;
    } else if (k === "mango") {
      $("#k1ep-v", el).textContent = B1(p.toFixed(0)) + " " + L2("days", "দিন");
      const f = p / 10, acid = 100 - 75 * f, sugar = 15 + 80 * f, starch = 80 - 70 * f;
      /* colour green -> yellow via opacity of two fills */
      g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("mango ripening", "আম পাকা")}">
        <path d="M60 40 C20 60 20 150 80 170 C140 185 150 110 120 70 C105 48 85 36 60 40 Z" fill="var(--good)" stroke="var(--ink)" stroke-width="1.5"/>
        <path d="M60 40 C20 60 20 150 80 170 C140 185 150 110 120 70 C105 48 85 36 60 40 Z" fill="var(--note)" opacity="${f.toFixed(2)}"/>
        <path d="M62 40 q6 -18 20 -24" stroke="var(--ink)" stroke-width="3" fill="none"/><path d="M78 20 q22 -14 40 4 q-22 8 -40 -4z" fill="var(--good)" stroke="var(--ink)"/>`;
      const bar = (y, lab, v, col) => `<text x="170" y="${y - 6}" font-size="13" fill="var(--ink)">${lab}</text><rect x="170" y="${y}" width="170" height="14" rx="7" fill="none" stroke="var(--rule)"/><rect x="170" y="${y}" width="${1.7 * v}" height="14" rx="7" fill="${col}"/>`;
      g += bar(50, L2("Acids (sour)", "এসিড (টক)"), acid, "var(--bad)") + bar(100, L2("Sugars (sweet)", "শর্করা (মিষ্টি)"), sugar, "var(--c)") + bar(150, L2("Starch", "স্টার্চ"), starch, "var(--muted)") + `</svg>`;
      out = L2(`${p < 3 ? "Green mango: lots of organic acids (malic, citric, succinic) and starch, so it tastes sour." : p < 7 ? "Ripening: enzymes break starch into sugars, and the acids are used up." : "Ripe mango: sugars (sucrose, glucose, fructose) are high and acids are low, so it tastes sweet."} These are chemical changes: new substances form.`,
        `${p < 3 ? "কাঁচা আম: প্রচুর জৈব এসিড (ম্যালিক, সাইট্রিক, সাক্সিনিক) আর স্টার্চ, তাই টক।" : p < 7 ? "পাকছে: এনজাইম স্টার্চ ভেঙে শর্করা বানায়, আর এসিড খরচ হয়ে যায়।" : "পাকা আম: শর্করা (সুক্রোজ, গ্লুকোজ, ফ্রুক্টোজ) বেশি আর এসিড কম, তাই মিষ্টি।"} এগুলো রাসায়নিক পরিবর্তন: নতুন পদার্থ তৈরি হয়।`) +
        `<br><span class="muted">${L2("Bars show the trend only, not measured amounts.", "বারগুলো শুধু প্রবণতা দেখায়, মাপা পরিমাণ নয়।")}</span>`;
    } else {
      $("#k1ep-v", el).textContent = B1(Math.round(p * 100)) + "%";
      const R = RX[k], e = ease1(p), spread = Math.sin(Math.PI * p) * 18;
      const cx0 = 100, cy0 = 100;
      g = `<svg viewBox="0 0 360 215" role="img" aria-label="${L2("atoms rearranging", "পরমাণুর পুনর্বিন্যাস")}">${arrowDefs("k1ea", "var(--muted)")}
        <line x1="176" y1="100" x2="196" y2="100" stroke="var(--muted)" stroke-width="2" marker-end="url(#k1ea)" opacity="${(1 - Math.sin(Math.PI * p)).toFixed(2)}"/>
        <text x="90" y="200" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("reactants", "বিক্রিয়ক")}</text><text x="262" y="200" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("products", "উৎপাদ")}</text>`;
      if (k === "gas" && p > 0.15 && p < 0.95) g += `<path d="M180 150 q-16 24 0 42 q16 -18 0 -42z" fill="var(--note)" opacity="${Math.sin(Math.PI * p).toFixed(2)}"/><path d="M180 166 q-7 12 0 22 q7 -9 0 -22z" fill="var(--bad)" opacity="${Math.sin(Math.PI * p).toFixed(2)}"/>`;
      R.atoms.forEach(([a, x0, y0, x1, y1]) => {
        let x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e; const dx = x - 180, dy = y - cy0, d = Math.hypot(dx, dy) || 1;
        x += dx / d * spread; y += dy / d * spread;
        g += atom1(a, x, y, a.length > 1 ? 13 : a === "H" ? 9 : 12);
      });
      /* atom tally */
      const cnt = {}; R.atoms.forEach(([a]) => cnt[a] = (cnt[a] || 0) + 1);
      g += `<text x="180" y="18" font-size="13" text-anchor="middle" fill="var(--muted)">${Object.entries(cnt).map(([a, n]) => `${a}: ${B1(n)}`).join("   ")}</text></svg>`;
      if (p > 0.2 && p < 0.8) g = g.replace("</svg>", `<text x="180" y="36" font-size="12" text-anchor="middle" fill="var(--ink)">${L2("bonds break, atoms regroup", "বন্ধন ভাঙে, পরমাণু নতুন করে জোড়া লাগে")}</text></svg>`);
      out = `<b>${R.eq}</b><br>` + L2(R.en, R.bn);
    }
    $("#k1esv", el).innerHTML = g; $("#k1eo", el).innerHTML = out;
  };
  chips1(el, ".k1ek", b => { k = b.dataset.k; setup(); });
  setup();
  if (!REDUCED) animate(el, dt => { if (!run) return; const s = $("#k1ep", el); if (!s) return; const v = Math.min(+s.max, +s.value + dt * (+s.max) * 0.3); s.value = v; if (v >= +s.max) run = false; draw(); });
};

/* 1.2 scope of chemistry: tap a place in the scene */
W.k1scope = (el) => {
  const F = [
    ["air", L2("Air", "বায়ু"), "N₂ (78%), O₂ (21%), Ar, CO₂",
      L2("We breathe in oxygen; in our cells it reacts with glucose to release energy (respiration). Nitrogen does not react; it dilutes the oxygen.", "শ্বাসে অক্সিজেন নিই; কোষে তা গ্লুকোজের সাথে বিক্রিয়া করে শক্তি দেয় (শ্বসন)। নাইট্রোজেন বিক্রিয়া করে না; অক্সিজেনকে লঘু করে।"), "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O"],
    ["water", L2("Water", "পানি"), L2("H₂O + mineral salts (Ca, Mg…)", "H₂O + খনিজ লবণ (Ca, Mg…)"),
      L2("The body's reactions happen in water; wastes leave dissolved in urine and sweat. Losing too much water (dehydration) kills in cholera; ORS replaces water, salt and glucose.", "দেহের বিক্রিয়াগুলো পানিতেই ঘটে; বর্জ্য প্রস্রাব ও ঘামে দ্রবীভূত হয়ে বের হয়। কলেরায় মৃত্যুর কারণ পানিস্বল্পতা; খাবার স্যালাইন পানি, লবণ আর গ্লুকোজ ফিরিয়ে দেয়।"), ""],
    ["fert", L2("Fertiliser", "সার"), L2("urea CO(NH₂)₂ · TSP · MoP (KCl)", "ইউরিয়া CO(NH₂)₂ · টিএসপি · এমওপি (KCl)"),
      L2("Plants need nitrogen, phosphorus and potassium from the soil. Urea supplies N, TSP supplies P and MoP supplies K, so the paddy grows well.", "উদ্ভিদের মাটি থেকে নাইট্রোজেন, ফসফরাস, পটাশিয়াম লাগে। ইউরিয়া দেয় N, টিএসপি দেয় P, এমওপি দেয় K, তাই ধান ভালো হয়।"), ""],
    ["paper", L2("Paper", "কাগজ"), L2("cellulose (C₆H₁₀O₅)ₙ", "সেলুলোজ (C₆H₁₀O₅)ₙ"),
      L2("Bamboo and sugarcane bagasse are rich in cellulose. Paper mills separate the fibres chemically and press them into sheets.", "বাঁশ আর আখের ছোবড়ায় প্রচুর সেলুলোজ। কাগজকলে রাসায়নিকভাবে আঁশ আলাদা করে চেপে কাগজ বানানো হয়।"), ""],
    ["food", L2("Food & medicine", "খাদ্য ও ওষুধ"), L2("ORS, antacid Mg(OH)₂, antibiotics", "খাবার স্যালাইন, এন্টাসিড Mg(OH)₂, অ্যান্টিবায়োটিক"),
      L2("Cooking changes food chemically; preservatives slow spoiling; medicines are chemicals designed to act on the body.", "রান্নায় খাবারের রাসায়নিক পরিবর্তন হয়; সংরক্ষক পচন ধীর করে; ওষুধ হলো দেহে কাজ করার জন্য তৈরি রাসায়নিক।"), ""],
    ["cloth", L2("Clothing", "পোশাক"), L2("cotton (cellulose), polyester, nylon, dyes", "সুতি (সেলুলোজ), পলিয়েস্টার, নাইলন, রং"),
      L2("Cotton is bleached and dyed with chemicals; polyester and nylon are made from small molecules joined into long chains (polymers).", "সুতি কাপড় রাসায়নিক দিয়ে সাদা ও রং করা হয়; পলিয়েস্টার আর নাইলন তৈরি ছোট অণু জুড়ে লম্বা শিকল (পলিমার) বানিয়ে।"), ""],
    ["fuel", L2("Fuel", "জ্বালানি"), L2("natural gas CH₄, petrol, diesel, coal", "প্রাকৃতিক গ্যাস CH₄, পেট্রোল, ডিজেল, কয়লা"),
      L2("Burning fuel is a chemical reaction that releases the energy stored in bonds. Batteries turn chemical energy into electricity.", "জ্বালানি পোড়ানো একটি রাসায়নিক বিক্রিয়া, যা বন্ধনে জমা শক্তি বের করে। ব্যাটারি রাসায়নিক শক্তিকে বিদ্যুতে বদলায়।"), "CH₄ + 2O₂ → CO₂ + 2H₂O"],
    ["build", L2("Construction", "নির্মাণ"), L2("cement, bricks, steel (Fe + C)", "সিমেন্ট, ইট, ইস্পাত (Fe + C)"),
      L2("Cement is made by strongly heating limestone with clay; bricks are baked clay; steel rods are iron with a little carbon.", "চুনাপাথর আর কাদামাটি প্রচণ্ড তাপে পুড়িয়ে সিমেন্ট; ইট হলো পোড়া কাদামাটি; রডের ইস্পাত লোহা ও সামান্য কার্বন।"), "CaCO₃ → CaO + CO₂"]];
  let k = "air";
  el.innerHTML = `<div class="svgwrap fit" id="k1ssv"></div><div class="chipset k1sk" role="group">${F.map(f => `<button data-k="${f[0]}" aria-pressed="${f[0] === k}">${f[1]}</button>`).join("")}</div><div class="w-out" id="k1so"></div>`;
  const spot = (key, x, y, inner) => `<g data-k="${key}" class="k1spot" role="button" tabindex="0" aria-label="${F.find(f => f[0] === key)[1]}" style="cursor:pointer">${inner}<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${key === k ? "var(--c)" : "transparent"}" stroke-width="3"/></g>`;
  const draw = () => {
    let g = `<svg viewBox="0 0 360 210" role="img" aria-label="${L2("chemistry around us", "আমাদের চারপাশে রসায়ন")}">
      <rect x="0" y="0" width="360" height="130" fill="var(--c-soft)" opacity=".5"/><rect x="0" y="130" width="360" height="80" fill="var(--good)" opacity=".18"/>`;
    const hl = key => key === k ? "var(--c)" : "var(--ink)";
    g += spot("air", 40, 30, `<path d="M18 30 q10 -12 22 -4 q10 -10 22 2 q10 0 8 10 h-50 q-8 -4 -2 -8z" fill="var(--sheet)" stroke="${hl("air")}"/><text x="40" y="60" font-size="12" text-anchor="middle" fill="${hl("air")}">O₂ N₂</text>`);
    g += spot("build", 118, 90, `<rect x="96" y="60" width="44" height="70" fill="var(--note)" opacity=".7" stroke="${hl("build")}"/>${[0, 1, 2].map(i => `<rect x="${102 + (i % 2) * 18}" y="${68 + i * 18}" width="12" height="10" fill="var(--sheet)"/>`).join("")}`);
    g += spot("fuel", 180, 100, `<rect x="160" y="108" width="40" height="10" rx="2" fill="var(--muted)"/><path d="M180 104 q-10 -10 0 -24 q2 10 8 12 q4 8 -8 12z" fill="var(--bad)" stroke="${hl("fuel")}"/>`);
    g += spot("food", 240, 104, `<ellipse cx="240" cy="112" rx="22" ry="6" fill="var(--sheet)" stroke="${hl("food")}"/><path d="M226 110 q14 -16 28 0z" fill="var(--sheet)" stroke="${hl("food")}"/><rect x="252" y="84" width="10" height="18" rx="3" fill="var(--c)"/>`);
    g += spot("cloth", 310, 88, `<path d="M296 72 l8 -6 h12 l8 6 l-6 8 l-4 -3 v24 h-20 v-24 l-4 3z" fill="var(--c)" opacity=".8" stroke="${hl("cloth")}"/>`);
    g += spot("water", 60, 170, `<ellipse cx="60" cy="172" rx="44" ry="16" fill="var(--c)" opacity=".45" stroke="${hl("water")}"/><path d="M36 170 q6 -4 12 0 q6 4 12 0" stroke="var(--sheet)" fill="none"/>`);
    g += spot("fert", 180, 170, `${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${140 + i * 16} 188 v-20 M${140 + i * 16} 176 l-6 -8 M${140 + i * 16} 172 l6 -9" stroke="var(--good)" stroke-width="2"/>`).join("")}<rect x="206" y="150" width="18" height="24" rx="3" fill="var(--sheet)" stroke="${hl("fert")}"/><text x="215" y="166" font-size="11" text-anchor="middle" fill="var(--ink)">N</text>`);
    g += spot("paper", 300, 170, `<rect x="284" y="154" width="30" height="36" fill="var(--sheet)" stroke="${hl("paper")}"/><path d="M290 164 h18 M290 172 h18 M290 180 h12" stroke="var(--muted)"/><path d="M326 190 v-40 M322 170 h8" stroke="var(--good)" stroke-width="3"/>`);
    g += `</svg>`;
    $("#k1ssv", el).innerHTML = g;
    el.querySelectorAll(".k1spot").forEach(s => { const go = () => pick(s.dataset.k); s.addEventListener("click", go); s.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }); });
    const f = F.find(x => x[0] === k);
    $("#k1so", el).innerHTML = `<b>${f[1]}</b> · ${B1(f[2])}<br>${f[3]}${f[4] ? `<br><b>${f[4]}</b>` : ""}`;
  };
  const pick = key => { k = key; el.querySelectorAll(".k1sk button").forEach(q => q.setAttribute("aria-pressed", q.dataset.k === k)); draw(); };
  chips1(el, ".k1sk", b => pick(b.dataset.k));
  draw();
};

/* 1.3 chemistry as a hub linked to other sciences */
W.k1links = (el) => {
  const N = [
    ["bio", L2("Biology", "জীববিজ্ঞান"), L2("Photosynthesis, digestion and respiration are chemical reactions inside living things.", "সালোকসংশ্লেষণ, হজম, শ্বসন জীবদেহের ভেতরের রাসায়নিক বিক্রিয়া।"), L2("Biology shows chemists which reactions matter for life (biochemistry).", "জীববিজ্ঞান দেখায় জীবনের জন্য কোন বিক্রিয়াগুলো জরুরি (প্রাণরসায়ন)।"), "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"],
    ["phy", L2("Physics", "পদার্থবিজ্ঞান"), L2("Batteries, fuels and new materials come from chemistry.", "ব্যাটারি, জ্বালানি আর নতুন উপাদান আসে রসায়ন থেকে।"), L2("Physical chemistry and nuclear chemistry are built on the laws of physics.", "ভৌত রসায়ন ও নিউক্লীয় রসায়ন দাঁড়িয়ে আছে পদার্থবিজ্ঞানের সূত্রের ওপর।"), ""],
    ["math", L2("Mathematics", "গণিত"), L2("Chemistry gives maths real problems to solve.", "রসায়ন গণিতকে সমাধানের বাস্তব সমস্যা দেয়।"), L2("Concentration, percentage composition, reaction rate: all calculated with formulas.", "ঘনমাত্রা, শতকরা সংযুতি, বিক্রিয়ার হার: সবই সূত্র দিয়ে হিসাব।"), L2("10 g salt in 0.25 L water → 10 ÷ 0.25 = 40 g/L", "০.২৫ L পানিতে ১০ g লবণ → ১০ ÷ ০.২৫ = ৪০ g/L")],
    ["geo", L2("Geology", "ভূতত্ত্ব"), L2("Chemical tests identify minerals, rocks and ores.", "রাসায়নিক পরীক্ষায় খনিজ, শিলা ও আকরিক শনাক্ত হয়।"), L2("Geology tells chemists where to find ores, gas and limestone.", "ভূতত্ত্ব বলে আকরিক, গ্যাস ও চুনাপাথর কোথায় পাওয়া যাবে।"), "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂"],
    ["agri", L2("Agriculture", "কৃষি"), L2("Fertilisers, insecticides and soil tests come from chemistry.", "সার, কীটনাশক আর মাটি পরীক্ষা আসে রসায়ন থেকে।"), L2("Farming shows which nutrients crops need and how much.", "চাষাবাদ দেখায় ফসলের কোন পুষ্টি কতটা লাগে।"), ""],
    ["med", L2("Medicine", "চিকিৎসা"), L2("Drugs, vaccines, saline and blood tests are chemistry.", "ওষুধ, টিকা, স্যালাইন, রক্ত পরীক্ষা, সবই রসায়ন।"), L2("Doctors show chemists which diseases need new medicines.", "ডাক্তাররা দেখান কোন রোগের জন্য নতুন ওষুধ দরকার।"), "Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O"],
    ["env", L2("Environment", "পরিবেশ"), L2("Chemistry measures and removes pollutants (arsenic, lead, CO).", "রসায়ন দূষক (আর্সেনিক, লেড, CO) মাপে ও দূর করে।"), L2("Environmental science shows the harm chemicals do in nature.", "পরিবেশবিজ্ঞান দেখায় প্রকৃতিতে রাসায়নিকের ক্ষতি।"), ""]];
  let k = "bio";
  el.innerHTML = `<div class="svgwrap fit" id="k1lsv"></div><div class="w-out" id="k1lo"></div>`;
  const cx = 180, cy = 118, R = 88;
  const draw = () => {
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("chemistry and other sciences", "রসায়ন ও অন্যান্য বিজ্ঞান")}">`;
    N.forEach((n, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N.length, x = cx + R * Math.cos(a) * 1.38, y = cy + R * Math.sin(a) * 1.15, on = n[0] === k;
      g += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${on ? "var(--c)" : "var(--rule)"}" stroke-width="${on ? 4 : 2}"/>`; });
    g += `<circle cx="${cx}" cy="${cy}" r="42" fill="var(--c)"/><text x="${cx}" y="${cy + 5}" font-size="13" text-anchor="middle" fill="var(--sheet)" font-weight="700">${L2("Chemistry", "রসায়ন")}</text>`;
    N.forEach((n, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N.length, x = cx + R * Math.cos(a) * 1.38, y = cy + R * Math.sin(a) * 1.15, on = n[0] === k, w = 100;
      g += `<g data-k="${n[0]}" class="k1node" role="button" tabindex="0" aria-pressed="${on}" style="cursor:pointer"><rect x="${(x - w / 2).toFixed(1)}" y="${(y - 15).toFixed(1)}" width="${w}" height="30" rx="15" fill="${on ? "var(--c-soft)" : "var(--sheet)"}" stroke="${on ? "var(--c)" : "var(--rule)"}" stroke-width="2"/>
        <text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" font-size="13" text-anchor="middle" fill="var(--ink)" ${on ? 'font-weight="700"' : ""}>${n[1]}</text></g>`; });
    g += `</svg>`;
    $("#k1lsv", el).innerHTML = g;
    el.querySelectorAll(".k1node").forEach(s => { const go = () => { k = s.dataset.k; draw(); }; s.addEventListener("click", go); s.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }); });
    const n = N.find(x => x[0] === k);
    $("#k1lo", el).innerHTML = `<b>${L2("Chemistry", "রসায়ন")} → ${n[1]}:</b> ${n[2]}<br><b>${n[1]} → ${L2("Chemistry", "রসায়ন")}:</b> ${n[3]}${n[4] ? `<br><span class="muted">${L2("Example", "উদাহরণ")}:</span> <b>${n[4]}</b>` : ""}`;
  };
  draw();
};

/* 1.4 a day with chemistry: benefits and hidden costs */
W.k1day = (el) => {
  const E = [
    [6.5, "🪥", L2("Toothpaste", "টুথপেস্ট"), L2("Fluoride strengthens tooth enamel; a mild abrasive such as calcium carbonate scrubs.", "ফ্লোরাইড দাঁতের এনামেল শক্ত করে; ক্যালসিয়াম কার্বনেটের মতো হালকা ঘষক পরিষ্কার করে।"), L2("Swallowing a lot of fluoride paste is harmful for small children: use a pea-sized amount.", "বেশি ফ্লোরাইড পেস্ট গিলে ফেলা ছোট শিশুদের জন্য ক্ষতিকর: মটরদানা পরিমাণ নাও।")],
    [7, "🍪", L2("Tea and biscuits", "চা-বিস্কুট"), L2("Baking soda (NaHCO₃) gives off CO₂ when heated, making biscuits light and crisp.", "বেকিং সোডা (NaHCO₃) তাপে CO₂ ছাড়ে, তাই বিস্কুট হালকা ও মুচমুচে হয়।"), L2("Artificial colours beyond the permitted limit in cheap snacks can harm health.", "সস্তা খাবারে অনুমোদিত মাত্রার বেশি কৃত্রিম রং স্বাস্থ্যের ক্ষতি করে।")],
    [7.5, "🚽", L2("Toilet cleaner", "টয়লেট ক্লিনার"), L2("Its acid dissolves hard-water scale and stains.", "এর এসিড খরতার দাগ ও ময়লা গলিয়ে দেয়।"), L2("Corrosive: wear gloves, and never mix it with bleach, which releases poisonous chlorine gas.", "ক্ষয়কারী: গ্লাভস পরো, আর কখনো ব্লিচের সাথে মেশাবে না; তাতে বিষাক্ত ক্লোরিন গ্যাস বের হয়।")],
    [8, "🧼", L2("Soap and shampoo", "সাবান ও শ্যাম্পু"), L2("Soap is made from fat or oil and an alkali (NaOH); its molecules grab grease and let water wash it away.", "সাবান তৈরি হয় চর্বি বা তেল আর ক্ষার (NaOH) থেকে; এর অণু তেল-ময়লা ধরে পানিতে ধুয়ে নেয়।"), L2("Detergent waste with phosphates feeds algae in ponds, using up the oxygen fish need.", "ফসফেটযুক্ত ডিটারজেন্টের বর্জ্য পুকুরে শৈবাল বাড়ায়, যা মাছের প্রয়োজনীয় অক্সিজেন খরচ করে ফেলে।")],
    [10, "🧑‍🏫", L2("Chalk at school", "স্কুলের চক"), L2("Chalk is calcium carbonate or calcium sulfate (gypsum) pressed into sticks.", "চক হলো ক্যালসিয়াম কার্বনেট বা ক্যালসিয়াম সালফেট (জিপসাম) চেপে বানানো কাঠি।"), L2("Chalk dust irritates the eyes and nose; wipe boards with a damp cloth.", "চকের গুঁড়া চোখ-নাকে জ্বালা করে; ভেজা কাপড়ে বোর্ড মোছো।")],
    [13, "🍚", L2("Rice for lunch", "দুপুরের ভাত"), L2("The paddy grew with urea, TSP and MoP fertilisers and was protected by insecticide.", "ধান বেড়েছে ইউরিয়া, টিএসপি, এমওপি সারে, আর কীটনাশকে পোকা থেকে রক্ষা পেয়েছে।"), L2("Excess fertiliser and insecticide wash into ponds and rivers, killing fish.", "বাড়তি সার আর কীটনাশক ধুয়ে পুকুর-নদীতে গিয়ে মাছ মারে।")],
    [16, "💊", L2("Medicine", "ওষুধ"), L2("A tablet or ORS is a measured mixture of chemicals that acts on the body.", "ট্যাবলেট বা খাবার স্যালাইন হলো মাপা রাসায়নিক মিশ্রণ, যা দেহে কাজ করে।"), L2("Overdose or antibiotics taken without a prescription are dangerous.", "মাত্রাতিরিক্ত ওষুধ বা ব্যবস্থাপত্র ছাড়া অ্যান্টিবায়োটিক বিপজ্জনক।")],
    [18, "🚌", L2("Bus ride home", "বাসে বাড়ি ফেরা"), L2("Diesel burns in the engine, turning chemical energy into motion.", "ইঞ্জিনে ডিজেল পুড়ে রাসায়নিক শক্তি গতিশক্তিতে বদলায়।"), L2("Exhaust contains carbon monoxide, nitrogen oxides and soot that pollute Dhaka's air.", "ধোঁয়ায় থাকে কার্বন মনোক্সাইড, নাইট্রোজেনের অক্সাইড আর কালি, যা ঢাকার বাতাস দূষিত করে।")],
    [20, "🔥", L2("Cooking dinner", "রাতের রান্না"), L2("Methane burns: CH₄ + 2O₂ → CO₂ + 2H₂O, giving heat.", "মিথেন জ্বলে: CH₄ + 2O₂ → CO₂ + 2H₂O, তাপ দেয়।"), L2("In a closed kitchen, poor burning makes carbon monoxide; keep a window open and check for gas leaks.", "বদ্ধ রান্নাঘরে অসম্পূর্ণ দহনে কার্বন মনোক্সাইড তৈরি হয়; জানালা খোলা রাখো, গ্যাস লিক আছে কি না দেখো।")],
    [22, "🦟", L2("Mosquito coil", "মশার কয়েল"), L2("It slowly releases an insecticide that keeps mosquitoes away.", "এটি ধীরে ধীরে কীটনাশক ছড়িয়ে মশা দূরে রাখে।"), L2("Its smoke is harmful in a closed room; a mosquito net is safer.", "বদ্ধ ঘরে এর ধোঁয়া ক্ষতিকর; মশারি বেশি নিরাপদ।")]];
  let cost = false;
  el.innerHTML = slider("k1dt", L2("Time of day", "দিনের সময়"), 6, 22, 0.25, 6.5, "") +
    `<div class="chipset k1dc" role="group"><button data-c="0" aria-pressed="true">${L2("Benefit", "উপকার")}</button><button data-c="1" aria-pressed="false">${L2("Hidden cost", "লুকানো ক্ষতি")}</button></div>
    <div class="svgwrap fit" id="k1dsv"></div><div class="w-out" id="k1do"></div>`;
  const tstr = t => { const h = Math.floor(t), m = Math.round((t - h) * 60), h12 = ((h + 11) % 12) + 1; return B1(`${h12}:${String(m).padStart(2, "0")}`) + " " + (h < 12 ? L2("am", "পূর্বাহ্ণ") : L2("pm", "অপরাহ্ণ")); };
  const draw = () => {
    const t = +$("#k1dt", el).value; $("#k1dt-v", el).textContent = tstr(t);
    let cur = 0; E.forEach((e, i) => { if (t >= e[0] - 0.01) cur = i; });
    const X = h => 20 + (h - 6) / 16 * 320;
    const sky = t < 17 ? "var(--c-soft)" : t < 19.5 ? "var(--note)" : "var(--muted)", op = t < 17 ? 0.5 : 0.25;
    let g = `<svg viewBox="0 0 360 160" role="img" aria-label="${L2("a day with chemistry", "রসায়নের সাথে একটি দিন")}">
      <rect x="0" y="0" width="360" height="130" fill="${sky}" opacity="${op}"/>
      <line x1="20" y1="130" x2="340" y2="130" stroke="var(--muted)" stroke-width="2"/>`;
    [6, 9, 12, 15, 18, 21].forEach(h => g += `<line x1="${X(h)}" y1="126" x2="${X(h)}" y2="134" stroke="var(--muted)"/><text x="${X(h)}" y="152" font-size="12" text-anchor="middle" fill="var(--muted)">${B1(((h + 11) % 12) + 1)}${h < 12 ? L2("am", "") : L2("pm", "")}</text>`);
    E.forEach((e, i) => { const x = X(e[0]), on = i === cur, used = e[0] <= t + 0.01;
      g += `<circle cx="${x}" cy="130" r="${on ? 7 : 4}" fill="${on ? (cost ? "var(--bad)" : "var(--c)") : used ? "var(--c)" : "var(--sheet)"}" stroke="var(--c)" stroke-width="1.5"/>`;
      if (on) { const lx = Math.min(300, Math.max(60, x)); g += `<text x="${lx}" y="78" font-size="34" text-anchor="middle">${e[1]}</text><text x="${lx}" y="112" font-size="14" text-anchor="middle" fill="var(--ink)" font-weight="700">${e[2]}</text><line x1="${x}" y1="118" x2="${x}" y2="124" stroke="var(--c)"/>`; } });
    const n = E.filter(e => e[0] <= t + 0.01).length;
    g += `<text x="20" y="22" font-size="13" fill="var(--ink)">${L2("Chemical products used so far:", "এখন পর্যন্ত ব্যবহৃত রাসায়নিক পণ্য:")} <tspan font-weight="700">${B1(n)}</tspan></text></svg>`;
    $("#k1dsv", el).innerHTML = g;
    const e = E[cur];
    $("#k1do", el).innerHTML = `<b>${e[1]} ${e[2]}</b><br>` + (cost ? `<span style="color:var(--bad)">${L2("Hidden cost", "লুকানো ক্ষতি")}:</span> ${e[4]}` : e[3]);
  };
  chips1(el, ".k1dc", b => { cost = b.dataset.c === "1"; draw(); });
  $("#k1dt", el).addEventListener("input", draw); draw();
};

/* 1.5 the research process: NH4Cl dissolving (book data) and solubility vs temperature */
W.k1research = (el) => {
  const STEPS = [L2("Topic|selection", "বিষয়|নির্বাচন"), L2("Information|& hypothesis", "তথ্য সংগ্রহ|ও অনুমান"), L2("Plan", "পরিকল্পনা"), L2("Experiment", "পরীক্ষণ"), L2("Data collection|& analysis", "উপাত্ত সংগ্রহ|ও বিশ্লেষণ"), L2("Result &|conclusion", "ফলাফল ও|সিদ্ধান্ত")];
  const TB = [25, 20, 15, 10]; /* book's "suppose" temperatures after 0, 5, 10, 15 g */
  const SOL = [[0, 29.4], [20, 37.2], [40, 45.8], [60, 55.3], [80, 65.6], [100, 77.3]]; /* g NH4Cl per 100 g water (approx.) */
  const sol = T => { for (let i = 1; i < SOL.length; i++) if (T <= SOL[i][0]) return SOL[i - 1][1] + (SOL[i][1] - SOL[i - 1][1]) * (T - SOL[i - 1][0]) / 20; return SOL[5][1]; };
  let mode = 1, hyp = null, added = 0, shown = 0;
  el.innerHTML = `<div class="chipset k1rm" role="group"><button data-m="1" aria-pressed="true">${L2("1: Heat on dissolving", "১: দ্রবীভবনে তাপ")}</button><button data-m="2" aria-pressed="false">${L2("2: Temperature & solubility", "২: তাপমাত্রা ও দ্রাব্যতা")}</button></div>
    <div class="svgwrap fit" id="k1rflow"></div><div id="k1rctl"></div><div class="svgwrap fit" id="k1rsv"></div><div class="w-out" id="k1ro"></div>`;
  const stepNow = () => mode === 2 ? 4 : hyp === null ? 1 : added === 0 ? 2 : added < 15 ? 3 + (added >= 10 ? 1 : 0) : 5;
  const flow = (cur) => {
    /* two rows of three boxes so labels stay readable on phones */
    let g = `<svg viewBox="0 0 360 118" role="img" aria-label="${L2("steps of research", "গবেষণার ধাপ")}">${arrowDefs("k1rar", "var(--muted)")}`;
    const BH = 44;
    STEPS.forEach((s, i) => { const r = Math.floor(i / 3), c = r === 0 ? i % 3 : 2 - (i % 3), x = 8 + c * 120, y = 10 + r * 60, on = i === cur, done = i < cur, ln = s.split("|");
      g += `<rect x="${x}" y="${y}" width="104" height="${BH}" rx="8" fill="${on ? "var(--c)" : done ? "var(--c-soft)" : "var(--sheet)"}" stroke="var(--c)" stroke-width="1.5"/>
        <circle cx="${x + 12}" cy="${y}" r="8" fill="${on ? "var(--sheet)" : "var(--c)"}" stroke="var(--c)"/><text x="${x + 12}" y="${y + 4}" font-size="11" text-anchor="middle" fill="${on ? "var(--c)" : "var(--sheet)"}" font-weight="700">${B1(i + 1)}</text>`;
      ln.forEach((t, j) => g += `<text x="${x + 52}" y="${y + (ln.length === 1 ? 27 : 20 + j * 15)}" font-size="12" text-anchor="middle" fill="${on ? "var(--sheet)" : "var(--ink)"}">${t}</text>`);
      if (i < 5) { if (i === 2) g += `<line x1="${x + 52}" y1="${y + BH + 1}" x2="${x + 52}" y2="${y + 58}" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#k1rar)"/>`;
        else if (r === 0) g += `<line x1="${x + 105}" y1="${y + 22}" x2="${x + 118}" y2="${y + 22}" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#k1rar)"/>`;
        else g += `<line x1="${x - 1}" y1="${y + 22}" x2="${x - 14}" y2="${y + 22}" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#k1rar)"/>`; } });
    return g + `</svg>`;
  };
  const setup = () => {
    if (mode === 1) {
      $("#k1rctl", el).innerHTML = `<p class="hint" id="k1rq"></p><div class="chipset k1rh" role="group"><button data-h="out" aria-pressed="${hyp === "out"}">${L2("Hypothesis: heat is given out", "অনুমান: তাপ উৎপন্ন হবে")}</button><button data-h="in" aria-pressed="${hyp === "in"}">${L2("Hypothesis: heat is taken in", "অনুমান: তাপ শোষিত হবে")}</button></div>
        <div class="w-row"><button class="btn solid" id="k1radd">${L2("Add 5 g NH₄Cl and stir", "৫ g NH₄Cl দাও ও নাড়ো")}</button><button class="btn" id="k1rrs">${L2("Start again", "আবার শুরু")}</button></div>`;
      chips1(el, ".k1rh", b => { hyp = b.dataset.h; draw(); });
      $("#k1radd", el).addEventListener("click", () => { if (hyp === null || added >= 15) return; added += 5; if (REDUCED) shown = added; draw(); });
      $("#k1rrs", el).addEventListener("click", () => { hyp = null; added = 0; shown = 0; el.querySelectorAll(".k1rh button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); });
    } else {
      $("#k1rctl", el).innerHTML = slider("k1rT", L2("Temperature of the water", "পানির তাপমাত্রা"), 0, 100, 1, 20, "°C") + `<p class="hint">${L2("50 g of NH₄Cl is stirred into 100 g of water.", "১০০ g পানিতে ৫০ g NH₄Cl নেড়ে দেওয়া হয়েছে।")}</p>`;
      $("#k1rT", el).addEventListener("input", draw);
    }
    draw();
  };
  const beaker = (x, y, w, h, liq, extra) => `<path d="M${x} ${y} v${h} q0 8 8 8 h${w - 16} q8 0 8 -8 v-${h}" fill="none" stroke="var(--ink)" stroke-width="2"/>
    <rect x="${x + 2}" y="${y + h * 0.3}" width="${w - 4}" height="${h * 0.7 + 6}" fill="${liq}" opacity=".35"/>${extra || ""}`;
  const draw = () => {
    $("#k1rflow", el).innerHTML = flow(stepNow());
    let g = "", out = "";
    if (mode === 1) {
      const Tshow = TB[0] - shown; /* 1 °C per g in the book's data */
      g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("ammonium chloride experiment", "অ্যামোনিয়াম ক্লোরাইডের পরীক্ষা")}">`;
      /* beaker + thermometer */
      const crystals = added - shown > 0.01 ? `<g fill="var(--sheet)" stroke="var(--ink)">${[0, 1, 2, 3, 4].map(i => `<rect x="${34 + i * 12}" y="${150 - (i % 2) * 4}" width="7" height="7" transform="rotate(20 ${37 + i * 12} ${153})"/>`).join("")}</g>` : "";
      g += beaker(20, 60, 90, 100, "var(--c)", crystals);
      const tf = (Tshow - 0) / 30; const ty0 = 30, ty1 = 150;
      g += `<rect x="88" y="${ty0}" width="10" height="${ty1 - ty0}" rx="5" fill="var(--sheet)" stroke="var(--ink)"/><circle cx="93" cy="${ty1 + 6}" r="8" fill="var(--bad)" stroke="var(--ink)"/>
        <rect x="90.5" y="${ty1 - tf * (ty1 - ty0)}" width="5" height="${tf * (ty1 - ty0) + 4}" fill="var(--bad)"/>
        <text x="104" y="${ty1 - tf * (ty1 - ty0) + 5}" font-size="13" fill="var(--bad)" font-weight="700">${B1(Tshow.toFixed(0))} °C</text>
        <text x="65" y="190" font-size="12" text-anchor="middle" fill="var(--muted)">250 mL · ${B1(added)} g NH₄Cl</text>`.replace("250 mL", B1(250) + " mL");
      /* graph T vs mass */
      const gx = 180, gy = 160, gw = 160, gh = 120, X = m => gx + m / 20 * gw, Y = T => gy - T / 30 * gh;
      g += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
        <text x="${gx + gw}" y="${gy + 30}" font-size="12" text-anchor="end" fill="var(--muted)">${L2("mass dissolved (g)", "দ্রবীভূত ভর (g)")}</text><text x="${gx + 4}" y="${gy - gh - 6}" font-size="12" fill="var(--muted)">T (°C)</text>`;
      [0, 5, 10, 15, 20].forEach(m => g += `<text x="${X(m)}" y="${gy + 15}" font-size="12" text-anchor="middle" fill="var(--muted)">${B1(m)}</text>`);
      [0, 10, 20, 30].forEach(T => g += `<text x="${gx - 5}" y="${Y(T) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B1(T)}</text><line x1="${gx}" y1="${Y(T)}" x2="${gx + gw}" y2="${Y(T)}" stroke="var(--rule)" stroke-dasharray="2 4"/>`);
      const pts = []; for (let m = 0; m <= shown + 0.001; m += 5) pts.push([m, TB[m / 5]]);
      if (pts.length > 1) g += `<polyline points="${pts.map(([m, T]) => X(m) + "," + Y(T)).join(" ")}" fill="none" stroke="var(--c)" stroke-width="2"/>`;
      pts.forEach(([m, T]) => g += `<circle cx="${X(m)}" cy="${Y(T)}" r="5" fill="var(--c)"/>`);
      g += `</svg>`;
      const table = `<br>${[0, 5, 10, 15].filter(m => m <= shown + 0.001).map(m => `${B1(m)} g → ${B1(TB[m / 5])} °C`).join(" · ")}`;
      $("#k1rq", el).innerHTML = L2("Question: is heat given out or taken in when ammonium chloride dissolves in water? Reading tells you quicklime (CaO) makes water hot. Choose your hypothesis:", "প্রশ্ন: অ্যামোনিয়াম ক্লোরাইড পানিতে দ্রবীভূত হলে তাপ উৎপন্ন হয়, না শোষিত হয়? বই পড়ে জেনেছ, চুন (CaO) পানি গরম করে। তোমার অনুমান বেছে নাও:");
      if (hyp === null) out = L2("Step 2: make a prediction before you experiment.", "ধাপ ২: পরীক্ষার আগে একটি অনুমান করো।");
      else if (added === 0) out = L2("Step 3, plan: beaker, 250 mL water, thermometer, glass rod, balance, NH₄Cl. Record the starting temperature (25 °C), then add 5 g at a time.", "ধাপ ৩, পরিকল্পনা: বিকার, ২৫০ mL পানি, থার্মোমিটার, কাচদণ্ড, ব্যালান্স, NH₄Cl। শুরুর তাপমাত্রা (২৫ °C) লিখে রাখো, তারপর একবারে ৫ g করে দাও।");
      else if (added < 15) out = L2("Keep adding and recording. Watch the thermometer.", "যোগ করতে থাকো আর লিখে রাখো। থার্মোমিটার দেখো।") + table;
      else out = L2(`<b>Conclusion:</b> the temperature fell by 5 °C for every 5 g, so dissolving NH₄Cl <b>absorbs heat</b> from the water (endothermic). ${hyp === "in" ? "Your hypothesis was supported by the data." : "Your hypothesis was wrong, and that's fine: the data decide. Now you know more than before."}`,
        `<b>সিদ্ধান্ত:</b> প্রতি ৫ g-এ তাপমাত্রা ৫ °C কমেছে, তাই NH₄Cl দ্রবীভূত হওয়ার সময় পানি থেকে <b>তাপ শোষণ করে</b> (তাপহারী)। ${hyp === "in" ? "উপাত্ত তোমার অনুমান সমর্থন করেছে।" : "তোমার অনুমান ভুল ছিল, তাতে সমস্যা নেই: শেষ কথা বলে উপাত্ত। এখন তুমি আগের চেয়ে বেশি জানো।"}`) + table +
        `<br><span class="muted">${L2("These are the book's \"suppose\" values; a real 5 g addition cools 250 mL of water by only about 1–2 °C.", "এগুলো বইয়ের \"ধরো\" মান; বাস্তবে ৫ g যোগ করলে ২৫০ mL পানি মাত্র ১–২ °C-এর মতো ঠান্ডা হয়।")}</span>`;
      $("#k1radd", el).disabled = hyp === null || added >= 15;
    } else {
      const T = sv(el, "k1rT", "°C"), S = sol(T), left = Math.max(0, 50 - S);
      g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("solubility and temperature", "দ্রাব্যতা ও তাপমাত্রা")}">`;
      const nC = Math.round(left / 2);
      let cr = `<g fill="var(--sheet)" stroke="var(--ink)">`; for (let i = 0; i < nC; i++) cr += `<rect x="${28 + (i % 9) * 8}" y="${158 - Math.floor(i / 9) * 7}" width="6" height="6"/>`; cr += `</g>`;
      g += beaker(20, 60, 90, 100, T > 50 ? "var(--bad)" : "var(--c)", cr) + `<text x="65" y="190" font-size="12" text-anchor="middle" fill="var(--muted)">${B1(T)} °C</text>`;
      const gx = 175, gy = 160, gw = 165, gh = 130, X = t => gx + t / 100 * gw, Y = s => gy - s / 80 * gh;
      g += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="var(--muted)"/>
        <text x="${gx + gw}" y="${gy + 30}" font-size="12" text-anchor="end" fill="var(--muted)">T (°C)</text><text x="${gx + 4}" y="${gy - gh - 6}" font-size="12" fill="var(--muted)">${L2("g per 100 g water", "g প্রতি ১০০ g পানি")}</text>`;
      [0, 50, 100].forEach(t => g += `<text x="${X(t)}" y="${gy + 15}" font-size="12" text-anchor="middle" fill="var(--muted)">${B1(t)}</text>`);
      [0, 20, 40, 60, 80].forEach(s => g += `<text x="${gx - 5}" y="${Y(s) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B1(s)}</text>`);
      g += `<line x1="${gx}" y1="${Y(50)}" x2="${gx + gw}" y2="${Y(50)}" stroke="var(--note)" stroke-dasharray="5 4" stroke-width="1.5"/><text x="${gx + 4}" y="${Y(50) - 5}" font-size="12" fill="var(--ink)">${L2("50 g added", "৫০ g দেওয়া")}</text>`;
      g += `<polyline points="${SOL.map(([t, s]) => X(t) + "," + Y(s)).join(" ")}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
      SOL.forEach(([t, s]) => g += `<circle cx="${X(t)}" cy="${Y(s)}" r="3.5" fill="var(--c)"/>`);
      g += `<circle cx="${X(T)}" cy="${Y(S)}" r="6" fill="var(--bad)"/></svg>`;
      out = L2(`At ${B1(T)} °C about <b>${B1(S.toFixed(0))} g</b> of NH₄Cl can dissolve in 100 g of water. ${left > 0 ? `So about <b>${B1(left.toFixed(0))} g</b> stays undissolved at the bottom.` : "All 50 g dissolves."} Conclusion: solubility <b>rises</b> with temperature. Cool a hot solution and crystals come out.`,
        `${B1(T)} °C-এ ১০০ g পানিতে প্রায় <b>${B1(S.toFixed(0))} g</b> NH₄Cl দ্রবীভূত হতে পারে। ${left > 0 ? `তাই প্রায় <b>${B1(left.toFixed(0))} g</b> তলায় অদ্রবীভূত থাকে।` : "পুরো ৫০ g দ্রবীভূত হয়।"} সিদ্ধান্ত: তাপমাত্রা বাড়লে দ্রাব্যতা <b>বাড়ে</b>। গরম দ্রবণ ঠান্ডা করলে কেলাস বেরিয়ে আসে।`) +
        `<br><span class="muted">${L2("Data: approximate handbook values.", "উপাত্ত: হ্যান্ডবুকের আনুমানিক মান।")}</span>`;
    }
    $("#k1rsv", el).innerHTML = g; $("#k1ro", el).innerHTML = out;
  };
  chips1(el, ".k1rm", b => { mode = +b.dataset.m; setup(); });
  setup();
  if (!REDUCED) animate(el, dt => { if (mode !== 1 || shown >= added) return; shown = Math.min(added, shown + dt * 4); draw(); });
};

/* 1.6 hazard pictograms: learn, then match substances to symbols */
const PIC1 = {
  ex: `<circle cx="44" cy="60" r="11" fill="var(--ink)"/><path d="M44 49 l4 -6" stroke="var(--ink)" stroke-width="3"/>${[[62, 34], [70, 50], [66, 66], [30, 34], [24, 50]].map(([x, y]) => `<path d="M${44 + (x - 44) * 0.55} ${60 + (y - 60) * 0.55} L${x} ${y}" stroke="var(--ink)" stroke-width="3"/>`).join("")}<rect x="62" y="68" width="7" height="5" fill="var(--ink)" transform="rotate(30 65 70)"/><rect x="24" y="66" width="6" height="6" fill="var(--ink)"/>`,
  fl: `<path d="M50 24 C62 40 70 50 62 66 C70 58 70 50 68 46 C78 60 72 76 50 76 C30 76 26 60 34 48 C34 56 38 60 42 62 C36 48 44 36 50 24 Z" fill="var(--ink)"/><rect x="30" y="78" width="40" height="5" fill="var(--ink)"/>`,
  tx: `<path d="M28 72 L72 84 M72 72 L28 84" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="46" r="18" fill="var(--ink)"/><rect x="41" y="58" width="18" height="12" rx="2" fill="var(--ink)"/><circle cx="43" cy="45" r="5" fill="var(--sheet)"/><circle cx="57" cy="45" r="5" fill="var(--sheet)"/><path d="M50 51 l-3 5 h6z" fill="var(--sheet)"/>`,
  ir: `<path d="M44 26 h12 l-2 36 h-8 z" fill="var(--ink)"/><circle cx="50" cy="72" r="6" fill="var(--ink)"/>`,
  hh: `<circle cx="50" cy="32" r="10" fill="var(--ink)"/><path d="M28 80 C28 56 36 46 50 46 C64 46 72 56 72 80 Z" fill="var(--ink)"/><path d="M50 54 l3 7 7 0 -5.5 4.5 2 7 -6.5 -4 -6.5 4 2 -7 -5.5 -4.5 7 0z" fill="var(--sheet)"/>`,
  ra: (() => { const bl = a => { const r1 = 8, r2 = 24, a1 = (a - 30) * Math.PI / 180, a2 = (a + 30) * Math.PI / 180, c = [50, 58];
      const p = (r, t) => (c[0] + r * Math.cos(t)).toFixed(1) + " " + (c[1] + r * Math.sin(t)).toFixed(1);
      return `<path d="M${p(r1, a1)} L${p(r2, a1)} A${r2} ${r2} 0 0 1 ${p(r2, a2)} L${p(r1, a2)} A${r1} ${r1} 0 0 0 ${p(r1, a1)}Z" fill="var(--ink)"/>`; };
    return bl(90) + bl(210) + bl(330) + `<circle cx="50" cy="58" r="5" fill="var(--ink)"/>`; })(),
  en: `<path d="M22 76 h56" stroke="var(--ink)" stroke-width="3"/><path d="M34 76 v-34 M34 50 l-10 -10 M34 56 l10 -12 M34 44 l6 -10" stroke="var(--ink)" stroke-width="3" fill="none"/><ellipse cx="60" cy="66" rx="11" ry="6" fill="var(--ink)"/><path d="M70 66 l8 -6 v12z" fill="var(--ink)"/><circle cx="54" cy="65" r="1.8" fill="var(--sheet)"/>`,
  co: `<path d="M26 30 l14 8 -6 10 -14 -8z M58 26 l14 8 -6 10 -14 -8z" fill="var(--ink)"/><path d="M34 50 v4 M34 58 v4 M64 46 v4 M64 54 v4" stroke="var(--ink)" stroke-width="2.5"/><path d="M22 70 h26 v10 h-26 z" fill="var(--ink)"/><path d="M34 70 q3 4 6 0" fill="var(--sheet)"/><path d="M54 80 v-10 h6 v-4 h6 v4 h10 v10 z" fill="var(--ink)"/><path d="M62 70 q3 4 6 0" fill="var(--sheet)"/>`
};
const pictogram1 = (key, size = 90) => key === "ra"
  ? `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><path d="M50 8 L94 88 H6 Z" fill="var(--note)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/><g transform="translate(0 4)">${PIC1.ra}</g></svg>`
  : `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><path d="M50 5 L95 50 L50 95 L5 50 Z" fill="var(--sheet)" stroke="var(--bad)" stroke-width="6" stroke-linejoin="round"/>${PIC1[key]}</svg>`;
W.k1hazard = (el) => {
  const H = {
    ex: [L2("Explosive", "বিস্ফোরক"), L2("May explode with shock, friction or fire.", "আঘাত, ঘর্ষণ বা আগুনে বিস্ফোরিত হতে পারে।"), L2("TNT, nitroglycerine, organic peroxides", "টিএনটি, নাইট্রোগ্লিসারিন, জৈব পারঅক্সাইড")],
    fl: [L2("Flammable", "দাহ্য"), L2("Catches fire easily: keep away from flames and heat.", "সহজে আগুন ধরে: আগুন ও তাপ থেকে দূরে রাখো।"), L2("alcohol, ether, petrol", "অ্যালকোহল, ইথার, পেট্রোল")],
    tx: [L2("Toxic", "বিষাক্ত"), L2("Poisonous if swallowed, breathed in or absorbed through skin.", "গিললে, শ্বাসে নিলে বা ত্বক দিয়ে ঢুকলে বিষক্রিয়া।"), L2("methanol", "মিথানল")],
    ir: [L2("Irritant", "উত্তেজক"), L2("Irritates skin, eyes and breathing.", "ত্বক, চোখ ও শ্বাসতন্ত্রে জ্বালা করে।"), L2("cement dust, dilute acids and alkalis", "সিমেন্টের ধুলা, লঘু এসিড ও ক্ষার")],
    hh: [L2("Health hazard", "স্বাস্থ্য ঝুঁকিপূর্ণ"), L2("Long-term harm: lung damage, cancer.", "দীর্ঘমেয়াদি ক্ষতি: ফুসফুসের ক্ষতি, ক্যানসার।"), L2("benzene, toluene, xylene", "বেনজিন, টলুইন, জাইলিন")],
    ra: [L2("Radioactive", "তেজস্ক্রিয়"), L2("Emits harmful radiation. (A separate international sign, not a GHS diamond.)", "ক্ষতিকর রশ্মি বিকিরণ করে। (আলাদা আন্তর্জাতিক চিহ্ন, GHS-এর হীরা নয়।)"), L2("uranium, radium", "ইউরেনিয়াম, রেডিয়াম")],
    en: [L2("Dangerous for the environment", "পরিবেশের জন্য ক্ষতিকর"), L2("Harms fish, plants and water life: collect after use, recycle.", "মাছ, উদ্ভিদ ও জলজ প্রাণীর ক্ষতি করে: ব্যবহারের পর জমা রাখো, পুনর্ব্যবহার করো।"), L2("lead and mercury compounds", "লেড ও মার্কারির যৌগ")],
    co: [L2("Corrosive", "ক্ষত সৃষ্টিকারী"), L2("Destroys skin and materials on contact.", "সংস্পর্শে ত্বক ও বস্তু নষ্ট করে।"), L2("conc. HCl, H₂SO₄, conc. NaOH", "গাঢ় HCl, H₂SO₄, গাঢ় NaOH")]};
  const KEYS = ["ex", "fl", "tx", "ir", "hh", "ra", "en", "co"];
  const Q = [
    [L2("TNT", "টিএনটি"), ["ex"]], [L2("Nitroglycerine", "নাইট্রোগ্লিসারিন"), ["ex"]], [L2("Ethanol (alcohol)", "ইথানল (অ্যালকোহল)"), ["fl"]], [L2("Ether", "ইথার"), ["fl"]], [L2("Petrol", "পেট্রোল"), ["fl"]],
    [L2("Methanol", "মিথানল"), ["tx", "fl"]], [L2("Benzene", "বেনজিন"), ["hh", "fl"]], [L2("Xylene", "জাইলিন"), ["hh", "fl"]], [L2("Cement dust", "সিমেন্টের ধুলা"), ["ir"]], [L2("Dilute acid", "লঘু এসিড"), ["ir"]],
    [L2("Uranium", "ইউরেনিয়াম"), ["ra"]], [L2("Radium", "রেডিয়াম"), ["ra"]], [L2("Mercury compounds", "মার্কারির যৌগ"), ["en", "tx"]], [L2("Lead compounds", "লেডের যৌগ"), ["en", "tx", "hh"]],
    [L2("Concentrated sulfuric acid", "গাঢ় সালফিউরিক এসিড"), ["co"]], [L2("Concentrated sodium hydroxide", "গাঢ় সোডিয়াম হাইড্রোক্সাইড"), ["co"]], [L2("Concentrated hydrochloric acid", "গাঢ় হাইড্রোক্লোরিক এসিড"), ["co"]]];
  let mode = "learn", sel = "ex", qi = 0, score = 0, tries = 0, answered = false, last = -1;
  el.innerHTML = `<div class="chipset k1hm" role="group"><button data-m="learn" aria-pressed="true">${L2("Learn the symbols", "চিহ্ন শেখো")}</button><button data-m="game" aria-pressed="false">${L2("Matching game", "মিলানোর খেলা")}</button></div>
    <div id="k1hq"></div><div id="k1hg" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:420px"></div><div class="w-out" id="k1ho"></div>`;
  const next = () => { let i; do { i = Math.floor(Math.random() * Q.length); } while (i === last); last = qi = i; answered = false; draw(); };
  const draw = () => {
    const grid = $("#k1hg", el);
    grid.innerHTML = KEYS.map(k => `<button class="btn k1hb" data-k="${k}" aria-label="${H[k][0]}" aria-pressed="${mode === "learn" && k === sel}" style="padding:4px;display:flex;flex-direction:column;align-items:center;min-height:0;${mode === "learn" && k === sel ? "outline:3px solid var(--c);" : ""}">${pictogram1(k, 64)}${mode === "learn" ? `<span style="font-size:12px;line-height:1.2;text-align:center">${H[k][0]}</span>` : ""}</button>`).join("");
    grid.querySelectorAll(".k1hb").forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.k;
      if (mode === "learn") { sel = k; draw(); return; }
      if (answered) return;
      const ok = Q[qi][1].includes(k); tries++; if (ok) score++; answered = true;
      b.style.outline = `3px solid ${ok ? "var(--good)" : "var(--bad)"}`;
      if (!ok) grid.querySelectorAll(".k1hb").forEach(q => { if (Q[qi][1].includes(q.dataset.k)) q.style.outline = "3px dashed var(--good)"; });
      const right = Q[qi][1].map(x => H[x][0]).join(L2(" or ", " অথবা "));
      $("#k1ho", el).innerHTML = (ok ? `<b style="color:var(--good)">${L2("Correct!", "ঠিক!")}</b> ` : `<b style="color:var(--bad)">${L2("Not quite.", "হয়নি।")}</b> `) +
        L2(`${Q[qi][0]} → ${right}.`, `${Q[qi][0]} → ${right}।`) + (Q[qi][1].length > 1 ? " " + L2("A substance can carry more than one symbol.", "একটি পদার্থে একাধিক চিহ্ন থাকতে পারে।") : "") +
        `<br>${L2("Score", "স্কোর")}: <b>${B1(score)} / ${B1(tries)}</b> <button class="btn solid" id="k1hn" style="margin-left:8px">${L2("Next", "পরেরটি")}</button>`;
      $("#k1hn", el).addEventListener("click", next);
    }));
    if (mode === "learn") {
      $("#k1hq", el).innerHTML = "";
      $("#k1ho", el).innerHTML = `<div class="w-row" style="gap:12px;align-items:center">${pictogram1(sel, 84)}<div><b>${H[sel][0]}</b><br>${H[sel][1]}<br><span class="muted">${L2("Examples", "উদাহরণ")}:</span> ${H[sel][2]}</div></div>`;
    } else {
      $("#k1hq", el).innerHTML = `<p class="hint">${L2("Which symbol belongs on this bottle?", "এই বোতলে কোন চিহ্ন থাকবে?")}</p><div class="w-row" style="align-items:center;gap:10px"><svg viewBox="0 0 40 60" width="34" height="52" aria-hidden="true"><rect x="13" y="2" width="14" height="10" fill="var(--muted)"/><path d="M10 12 h20 v6 q8 4 8 14 v24 h-36 v-24 q0 -10 8 -14z" fill="var(--c-soft)" stroke="var(--ink)"/></svg><b style="font-size:1.15em">${Q[qi][0]}</b></div>`;
      if (!answered) $("#k1ho", el).innerHTML = `${L2("Score", "স্কোর")}: <b>${B1(score)} / ${B1(tries)}</b>`;
    }
  };
  chips1(el, ".k1hm", b => { mode = b.dataset.m; if (mode === "game") { score = 0; tries = 0; next(); } else draw(); });
  draw();
};
