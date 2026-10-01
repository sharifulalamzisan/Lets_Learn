/* ---- biology chapter 1 widgets: lessons on life ---- */
const B1b = x => bnNum(x, LANG);
const chipsB1 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const shufB1 = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const okB1 = (good, txt) => `<b style="color:${good ? "var(--good)" : "var(--bad)"}">${good ? L2("Correct! ", "ঠিক! ") : L2("Not quite. ", "হয়নি। ")}</b>${txt}`;

/* 1.1 living or non-living? judge by the whole set of features */
W.b1alive = (el) => {
  const FEAT = [L2("Made of cells", "কোষে গঠিত"), L2("Nutrition", "পুষ্টি"), L2("Respiration", "শ্বসন"), L2("Growth from inside", "ভেতর থেকে বৃদ্ধি"),
    L2("Reproduction", "প্রজনন"), L2("Response to stimuli", "উদ্দীপনায় সাড়া"), L2("Excretion", "রেচন"), L2("Movement", "চলন")];
  /* marks: y = yes, n = no, p = only looks similar / partly. ans: L living, N non-living, B borderline */
  const IT = [
    ["tree", L2("Mango tree", "আমগাছ"), "L", "yyyyyyyy", L2("Made of cells; makes food by photosynthesis, respires, grows, flowers and fruits, bends towards light and moves its leaves. Plants don't walk, but they are fully alive.", "কোষে গঠিত; সালোকসংশ্লেষণে খাদ্য তৈরি করে, শ্বসন করে, বাড়ে, ফুল-ফল দেয়, আলোর দিকে বাঁকে, পাতা নাড়ায়। উদ্ভিদ হাঁটে না, কিন্তু পুরোপুরি জীবিত।")],
    ["cow", L2("Cow", "গরু"), "L", "yyyyyyyy", L2("Shows every feature of life.", "জীবনের সব বৈশিষ্ট্যই আছে।")],
    ["stone", L2("Stone", "পাথর"), "N", "nnnnnnnn", L2("Shows none of the features of life.", "জীবনের কোনো বৈশিষ্ট্যই নেই।")],
    ["car", L2("Running car", "চলন্ত গাড়ি"), "N", "nppnnnpp", L2("It 'takes fuel', burns it for energy, gives out exhaust and moves. But it is not made of cells, cannot grow or reproduce, and moves only when driven. Look-alike features are not enough.", "এটি 'জ্বালানি খায়', তা পুড়িয়ে শক্তি পায়, ধোঁয়া ছাড়ে, চলে। কিন্তু কোষে গঠিত নয়, বাড়ে না, বংশবৃদ্ধি করে না, আর চালালে তবেই চলে। দেখতে মিল থাকলেই হয় না।")],
    ["salt", L2("Growing salt crystal", "বড় হতে থাকা লবণের কেলাস"), "N", "nnnpnnnn", L2("It gets bigger only by layers sticking on from outside. That is not true growth, and it has no other feature of life.", "শুধু বাইরে থেকে স্তর জমে বড় হয়। এটা প্রকৃত বৃদ্ধি নয়, আর জীবনের অন্য কোনো বৈশিষ্ট্যও নেই।")],
    ["seed", L2("Dry gram seed", "শুকনো ছোলার বীজ"), "L", "yyypppnn", L2("A dormant living embryo inside respires very slowly. Give it water and it germinates and grows.", "ভেতরের সুপ্ত জীবিত ভ্রূণ খুব ধীরে শ্বসন করে। পানি পেলে অঙ্কুরিত হয়ে বাড়ে।")],
    ["bact", L2("Bacterium", "ব্যাকটেরিয়া"), "L", "yyyyyyyy", L2("Just one cell, but it feeds, respires, grows, divides into two and responds. Tiny but alive.", "মাত্র একটি কোষ, কিন্তু খাদ্য গ্রহণ করে, শ্বসন করে, বাড়ে, দুই ভাগ হয়ে বংশবৃদ্ধি করে, সাড়া দেয়। ক্ষুদ্র, কিন্তু জীবিত।")],
    ["mush", L2("Mushroom", "মাশরুম"), "L", "yyyyyyyn", L2("A fungus: made of cells, absorbs food, respires, grows and makes spores. It cannot move, which shows movement is not essential.", "একটি ছত্রাক: কোষে গঠিত, খাদ্য শোষণ করে, শ্বসন করে, বাড়ে, স্পোর তৈরি করে। নড়তে পারে না; বোঝা যায় চলন অপরিহার্য নয়।")],
    ["fire", L2("Fire", "আগুন"), "N", "npppnnpp", L2("It 'eats' fuel, uses oxygen, grows, spreads and gives out smoke. But it has no cells and no life processes inside; these are only look-alikes.", "এটি জ্বালানি 'খায়', অক্সিজেন নেয়, বাড়ে, ছড়ায়, ধোঁয়া ছাড়ে। কিন্তু কোষ নেই, ভেতরে কোনো জীবনপ্রক্রিয়াও নেই; এগুলো শুধু দেখতে একই রকম।")],
    ["virus", L2("Virus", "ভাইরাস"), "B", "nnnnpnnn", L2("On the border! Outside a cell it is a lifeless particle; inside a living host cell it multiplies. It is not made of cells.", "সীমানায়! কোষের বাইরে এটি প্রাণহীন কণা; জীবিত পোষক কোষের ভেতরে সংখ্যায় বাড়ে। এটি কোষে গঠিত নয়।")],
    ["cloud", L2("Cloud", "মেঘ"), "N", "nnnpnnnp", L2("It moves and gets bigger, but only because of wind and water vapour condensing. Non-living.", "চলে আর বড় হয়, কিন্তু বাতাস আর জলীয় বাষ্প জমার কারণে। জড়।")],
    ["robot", L2("Robot", "রোবট"), "N", "npnnnpnp", L2("It moves, charges its battery and reacts to sensors, but it is not made of cells, cannot grow or make new robots by itself.", "চলে, ব্যাটারি চার্জ নেয়, সেন্সরে সাড়া দেয়; কিন্তু কোষে গঠিত নয়, বাড়ে না, নিজে নতুন রোবট বানাতে পারে না।")],
    ["lajja", L2("Lajjaboti plant", "লজ্জাবতী গাছ"), "L", "yyyyyyyy", L2("Its leaves fold when touched: a clear response to a stimulus. It shows all features of life.", "ছুঁলে পাতা গুটিয়ে যায়: উদ্দীপনায় সাড়ার স্পষ্ট উদাহরণ। জীবনের সব বৈশিষ্ট্য আছে।")],
    ["bench", L2("Wooden bench", "কাঠের বেঞ্চ"), "N", "pnnnnnnn", L2("Wood was once part of a living tree and still shows dead cell walls, but the bench carries out no life processes. Non-living now.", "কাঠ একসময় জীবিত গাছের অংশ ছিল, এখনো মৃত কোষপ্রাচীর দেখা যায়; কিন্তু বেঞ্চে কোনো জীবনপ্রক্রিয়া নেই। এখন জড়।")]];
  const done = {};
  let cur = null;
  el.innerHTML = `<div class="chipset b1ak" role="group">${IT.map(t => `<button data-k="${t[0]}" aria-pressed="false">${t[1]}</button>`).join("")}</div>
    <div class="w-row" style="margin:10px 0"><span class="hint" id="b1aq">${L2("Tap a card above.", "ওপরের কোনো কার্ডে চাপ দাও।")}</span></div>
    <div class="w-row"><button class="btn" data-a="L" disabled>${L2("Living", "জীব")}</button><button class="btn" data-a="N" disabled>${L2("Non-living", "জড়")}</button><span class="muted" id="b1asc"></span></div>
    <div class="w-out" id="b1ao" style="margin-top:10px">${L2("Decide first, then the features will be revealed.", "আগে সিদ্ধান্ত নাও, তারপর বৈশিষ্ট্যগুলো দেখাবে।")}</div>`;
  const score = () => { const n = Object.keys(done).length, c = Object.values(done).filter(Boolean).length; $("#b1asc", el).textContent = n ? L2(`${c} right out of ${n}`, `${B1b(n)}টির মধ্যে ${B1b(c)}টি ঠিক`) : ""; };
  const table = t => {
    const sym = { y: ["✓", "var(--good)"], n: ["✗", "var(--bad)"], p: ["~", "var(--note)"] };
    return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:4px 12px;margin:8px 0;font-size:15px">${FEAT.map((f, i) => { const [s, c] = sym[t[3][i]]; return `<div><b style="color:${c};display:inline-block;width:1.2em">${s}</b>${f}</div>`; }).join("")}</div>
      <div class="muted" style="font-size:13px">✓ ${L2("yes", "আছে")} · ✗ ${L2("no", "নেই")} · ~ ${L2("only looks similar / partly", "শুধু দেখতে একই রকম / আংশিক")}</div>`;
  };
  const answer = a => {
    if (!cur) return;
    const t = cur, right = t[2] === "B" ? true : a === t[2];
    if (!(t[0] in done)) done[t[0]] = right;
    const verdict = t[2] === "L" ? L2("Living", "জীব") : t[2] === "N" ? L2("Non-living", "জড়") : L2("Borderline", "সীমানায়");
    $("#b1ao", el).innerHTML = (t[2] === "B" ? `<b style="color:var(--note)">${L2("Tricky one! ", "কৌশলী প্রশ্ন! ")}</b>` : okB1(right, "")) + `<b>${t[1]}: ${verdict}.</b> ${t[4]}` + table(t);
    const btn = el.querySelector(`.b1ak button[data-k="${t[0]}"]`); btn.style.borderStyle = "dashed";
    score();
  };
  chipsB1(el, ".b1ak", b => {
    cur = IT.find(t => t[0] === b.dataset.k);
    $("#b1aq", el).innerHTML = L2(`Is <b>${cur[1]}</b> living or non-living?`, `<b>${cur[1]}</b> জীব না জড়?`);
    el.querySelectorAll("button[data-a]").forEach(x => x.disabled = false);
    $("#b1ao", el).innerHTML = L2("Make your choice.", "তোমার উত্তর বেছে নাও।");
  });
  el.querySelectorAll("button[data-a]").forEach(x => x.addEventListener("click", () => answer(x.dataset.a)));
};

/* 1.2 branches of biology: explorer + "which branch?" challenge */
W.b1branch = (el) => {
  const PURE = [
    [L2("Morphology", "অঙ্গসংস্থান"), L2("Form and structure of organisms: external (outside) and internal (inside).", "জীবের আকার ও দৈহিক গঠন: বহিঃ (বাইরের) ও অন্তঃ (ভেতরের)।"), L2("Describing the shape of a jackfruit leaf and its veins.", "কাঁঠালপাতার আকার ও শিরাবিন্যাসের বর্ণনা।")],
    [L2("Taxonomy", "শ্রেণিবিন্যাসবিদ্যা"), L2("Classification of organisms and its principles.", "জীবের শ্রেণিবিন্যাস ও তার রীতিনীতি।"), L2("Placing a newly found Sundarbans frog in its genus.", "সুন্দরবনে পাওয়া নতুন ব্যাঙকে তার গণে স্থান দেওয়া।")],
    [L2("Physiology", "শারীরবিদ্যা"), L2("Life processes of organs: respiration, excretion, photosynthesis…", "অঙ্গের জীবনপ্রক্রিয়া: শ্বসন, রেচন, সালোকসংশ্লেষণ…"), L2("How a paddy leaf makes sugar in sunlight.", "রোদে ধানপাতা কীভাবে শর্করা তৈরি করে।")],
    [L2("Histology", "হিস্টোলজি (টিস্যুবিদ্যা)"), L2("Microscopic structure, arrangement and function of tissues.", "টিস্যুর আণুবীক্ষণিক গঠন, বিন্যাস ও কাজ।"), L2("Looking at a thin slice of muscle under a microscope.", "অণুবীক্ষণযন্ত্রে পেশির পাতলা টুকরো দেখা।")],
    [L2("Embryology", "ভ্রূণবিদ্যা"), L2("Origin of gametes, formation and development of the embryo from the zygote.", "জননকোষের উৎপত্তি, জাইগোট থেকে ভ্রূণের সৃষ্টি ও বিকাশ।"), L2("How a chick develops inside a hen's egg.", "মুরগির ডিমের ভেতরে ছানা কীভাবে তৈরি হয়।")],
    [L2("Cytology", "কোষবিদ্যা"), L2("Structure, function and division of cells.", "কোষের গঠন, কাজ ও বিভাজন।"), L2("Watching onion root-tip cells divide.", "পেঁয়াজের মূলের আগার কোষ বিভাজন দেখা।")],
    [L2("Genetics", "বংশগতিবিদ্যা"), L2("Genes and heredity: how traits pass from parents to offspring.", "জিন ও বংশগতি: বাবা-মা থেকে সন্তানে বৈশিষ্ট্য কীভাবে যায়।"), L2("Why a child has her father's curly hair.", "কেন মেয়েটির চুল বাবার মতো কোঁকড়া।")],
    [L2("Evolution", "বিবর্তনবিদ্যা"), L2("How life developed and organisms changed over many generations.", "প্রাণের বিকাশ এবং বহু প্রজন্মে জীবের ক্রমপরিবর্তন।"), L2("How whales evolved from land-living ancestors.", "স্থলচর পূর্বপুরুষ থেকে তিমির বিবর্তন।")],
    [L2("Ecology", "বাস্তুবিদ্যা"), L2("Relationship between organisms and their environment.", "পরিবেশের সাথে জীবের আন্তঃসম্পর্ক।"), L2("How fish, plants and birds of a haor depend on one another.", "হাওরের মাছ, উদ্ভিদ আর পাখি কীভাবে একে অপরের ওপর নির্ভরশীল।")],
    [L2("Endocrinology", "এন্ডোক্রাইনোলজি"), L2("Endocrine glands and the hormones they secrete.", "অন্তঃক্ষরা গ্রন্থি ও এদের নিঃসৃত হরমোন।"), L2("How insulin controls blood sugar.", "ইনসুলিন কীভাবে রক্তের শর্করা নিয়ন্ত্রণ করে।")],
    [L2("Biogeography", "জীবভূগোল"), L2("Geographical distribution of organisms.", "পৃথিবীর বিভিন্ন অঞ্চলে জীবের বিস্তৃতি।"), L2("Why Royal Bengal tigers live in the Sundarbans but not in Europe.", "রয়েল বেঙ্গল টাইগার কেন সুন্দরবনে আছে, ইউরোপে নেই।")]];
  const APP = [
    [L2("Fisheries", "মৎস্যবিজ্ঞান"), L2("Fish, fish production, management and conservation of fish resources.", "মাছ, মাছ উৎপাদন, মৎস্যসম্পদ ব্যবস্থাপনা ও সংরক্ষণ।"), L2("Banning hilsa catch during the breeding season.", "প্রজনন মৌসুমে ইলিশ ধরা নিষিদ্ধ করা।")],
    [L2("Biostatistics", "জীবপরিসংখ্যানবিদ্যা"), L2("Statistics applied to living things.", "জীব-সংক্রান্ত পরিসংখ্যান।"), L2("Counting tigers in camera-trap surveys.", "ক্যামেরা ফাঁদ জরিপে বাঘ গণনা।")],
    [L2("Parasitology", "পরজীবীবিদ্যা"), L2("Parasites, their life and the diseases they cause.", "পরজীবী, এদের জীবনপ্রণালি ও সৃষ্ট রোগ।"), L2("Studying roundworms in children's intestines.", "শিশুদের অন্ত্রের কৃমি নিয়ে গবেষণা।")],
    [L2("Palaeontology", "জীবাশ্মবিজ্ঞান"), L2("Fossils and prehistoric life.", "জীবাশ্ম ও প্রাগৈতিহাসিক জীব।"), L2("Dating a fossil tree trunk.", "জীবাশ্ম গাছের কাণ্ডের বয়স নির্ণয়।")],
    [L2("Entomology", "কীটতত্ত্ব"), L2("Insects: their life, benefits, harm and control.", "কীটপতঙ্গের জীবন, উপকারিতা, অপকারিতা ও দমন।"), L2("Controlling Aedes mosquitoes or rice stem borers.", "এডিস মশা বা ধানের মাজরা পোকা দমন।")],
    [L2("Microbiology", "অণুজীববিজ্ঞান"), L2("Viruses, bacteria, microscopic fungi and other microbes.", "ভাইরাস, ব্যাকটেরিয়া, আণুবীক্ষণিক ছত্রাক ও অন্যান্য অণুজীব।"), L2("Testing pond water for cholera bacteria.", "পুকুরের পানিতে কলেরার জীবাণু পরীক্ষা।")],
    [L2("Agriculture", "কৃষিবিজ্ঞান"), L2("Science of farming: crops, soil, livestock.", "কৃষিবিষয়ক বিজ্ঞান: ফসল, মাটি, গবাদিপশু।"), L2("Finding the best sowing time for Boro rice.", "বোরো ধান বোনার সেরা সময় নির্ণয়।")],
    [L2("Medical science", "চিকিৎসাবিজ্ঞান"), L2("Human body, diseases and treatment.", "মানবদেহ, রোগ ও চিকিৎসা।"), L2("Treating a dengue patient in hospital.", "হাসপাতালে ডেঙ্গু রোগীর চিকিৎসা।")],
    [L2("Genetic engineering", "জিনপ্রযুক্তি"), L2("Gene technology and its uses.", "জিনপ্রযুক্তি ও এর ব্যবহার।"), L2("Bt brinjal that resists fruit-boring insects.", "ফল ছিদ্রকারী পোকা প্রতিরোধী বিটি বেগুন।")],
    [L2("Biochemistry", "প্রাণরসায়ন"), L2("Chemical processes in organisms and related diseases.", "জীবের প্রাণরাসায়নিক কার্যপ্রণালি ও রোগ।"), L2("Measuring blood sugar and cholesterol.", "রক্তের শর্করা ও কোলেস্টেরল পরিমাপ।")],
    [L2("Environmental science", "পরিবেশবিজ্ঞান"), L2("The environment and its protection.", "পরিবেশ ও তার সুরক্ষা।"), L2("Measuring air pollution in Dhaka.", "ঢাকার বায়ুদূষণ পরিমাপ।")],
    [L2("Marine biology", "সামুদ্রিক জীববিজ্ঞান"), L2("Living things of the sea.", "সামুদ্রিক জীব।"), L2("Studying corals at Saint Martin's Island.", "সেন্ট মার্টিন দ্বীপের প্রবাল নিয়ে গবেষণা।")],
    [L2("Forestry", "বনবিজ্ঞান"), L2("Forests, managing and conserving forest resources.", "বন, বনসম্পদ ব্যবস্থাপনা ও সংরক্ষণ।"), L2("Planting mangroves on new chars.", "নতুন চরে ম্যানগ্রোভ বনায়ন।")],
    [L2("Biotechnology", "জীবপ্রযুক্তি"), L2("Using organisms and their parts for human welfare.", "মানুষের কল্যাণে জীব ব্যবহারের প্রযুক্তি।"), L2("Tissue culture of banana plantlets; making vaccines.", "টিস্যু কালচারে কলার চারা; টিকা তৈরি।")],
    [L2("Pharmacy", "ফার্মেসি"), L2("Technology and industry of medicines.", "ওষুধশিল্প ও প্রযুক্তি।"), L2("Making tablets and syrups in a medicine factory.", "ওষুধ কারখানায় ট্যাবলেট ও সিরাপ তৈরি।")],
    [L2("Wildlife", "বন্যপ্রাণিবিদ্যা"), L2("Wild animals and their conservation.", "বন্যপ্রাণী ও এদের সংরক্ষণ।"), L2("Protecting elephants' routes in Chattogram hills.", "চট্টগ্রামের পাহাড়ে হাতির চলার পথ রক্ষা।")],
    [L2("Bioinformatics", "বায়োইনফরমেটিকস"), L2("Computer-based analysis of biological data.", "কম্পিউটারনির্ভর জৈবিক তথ্য বিশ্লেষণ।"), L2("Reading the jute genome on a computer.", "কম্পিউটারে পাটের জিনোম বিশ্লেষণ।")]];
  const Q = [
    [L2("A scientist finds out why the leaves of lajjaboti fold when touched.", "একজন বিজ্ঞানী বের করছেন লজ্জাবতীর পাতা ছুঁলে কেন গুটিয়ে যায়।"), 0, 2, [["p", 2], ["p", 0], ["a", 6], ["p", 4]]],
    [L2("Experts decide when to ban catching hilsa so that they can breed.", "ইলিশ যাতে ডিম পাড়তে পারে, সেজন্য কখন ধরা নিষিদ্ধ হবে তা ঠিক করছেন বিশেষজ্ঞরা।"), 1, 0, [["a", 0], ["p", 8], ["a", 12], ["p", 1]]],
    [L2("Researchers study how insulin from the pancreas controls blood sugar.", "অগ্ন্যাশয়ের ইনসুলিন কীভাবে রক্তের শর্করা নিয়ন্ত্রণ করে, তা নিয়ে গবেষণা।"), 0, 9, [["p", 9], ["p", 5], ["a", 2], ["a", 7]]],
    [L2("A team develops rice that resists insects by inserting a new gene.", "নতুন জিন ঢুকিয়ে পোকা প্রতিরোধী ধান তৈরি করছে একটি দল।"), 1, 8, [["a", 8], ["p", 6], ["a", 3], ["p", 7]]],
    [L2("A student counts the different birds in a beel and how they depend on its fish and plants.", "একজন শিক্ষার্থী বিলের নানা পাখি গুনছে আর দেখছে তারা বিলের মাছ ও উদ্ভিদের ওপর কীভাবে নির্ভরশীল।"), 0, 8, [["p", 8], ["p", 10], ["a", 10], ["p", 0]]],
    [L2("A scientist studies the bones of an extinct animal found in rock.", "পাথরে পাওয়া বিলুপ্ত প্রাণীর হাড় নিয়ে গবেষণা করছেন একজন বিজ্ঞানী।"), 1, 3, [["a", 3], ["p", 7], ["p", 3], ["a", 15]]],
    [L2("A doctor checks a stool sample for hookworm eggs.", "একজন চিকিৎসক মলের নমুনায় বক্রকৃমির ডিম খুঁজছেন।"), 1, 2, [["a", 2], ["a", 4], ["p", 3], ["a", 5]]],
    [L2("A biologist looks at how chromosomes separate when a cell divides.", "কোষ বিভাজনের সময় ক্রোমোজোম কীভাবে আলাদা হয়, তা দেখছেন একজন জীববিজ্ঞানী।"), 0, 5, [["p", 5], ["p", 3], ["p", 4], ["a", 9]]]];
  let mode = "p", qi = 0, qs = 0, qn = 0, order = shufB1(Q.map((_, i) => i)), answered = false;
  el.innerHTML = `<div class="chipset b1bm" role="group"><button data-m="p" aria-pressed="true">${L2("Pure (physical)", "ভৌত (মৌলিক)")}</button><button data-m="a" aria-pressed="false">${L2("Applied", "ফলিত")}</button><button data-m="q" aria-pressed="false">${L2("Which branch?", "কোন শাখা?")}</button></div>
    <div id="b1bb" style="margin-top:10px"></div><div class="w-out" id="b1bo" style="margin-top:10px"></div>`;
  const nm = (t, i) => (t === "p" ? PURE : APP)[i][0];
  const show = () => {
    if (mode === "q") return quiz();
    const L = mode === "p" ? PURE : APP;
    $("#b1bb", el).innerHTML = `<p class="hint" style="margin:0 0 6px">${mode === "p" ? L2("Theory first: understanding how life works.", "আগে তত্ত্ব: জীবন কীভাবে চলে তা বোঝা।") : L2("Use first: applying biology for people's needs.", "আগে প্রয়োগ: মানুষের প্রয়োজনে জীববিজ্ঞান কাজে লাগানো।")}</p>
      <div class="chipset b1bl" role="group">${L.map((b, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${b[0]}</button>`).join("")}</div>`;
    const put = i => $("#b1bo", el).innerHTML = `<b>${L[i][0]}</b> <span class="muted">(${mode === "p" ? L2("pure", "ভৌত") : L2("applied", "ফলিত")})</span><br>${L[i][1]}<br><span class="muted">${L2("Example: ", "উদাহরণ: ")}</span>${L[i][2]}`;
    chipsB1(el, ".b1bl", b => put(+b.dataset.i)); put(0);
  };
  const quiz = () => {
    const q = Q[order[qi % Q.length]]; answered = false;
    const opts = shufB1(q[3]);
    $("#b1bb", el).innerHTML = `<p style="margin:0 0 8px"><b>${L2("Scenario", "ঘটনা")} ${B1b(qi % Q.length + 1)}/${B1b(Q.length)}:</b> ${q[0]}</p>
      <div class="w-row">${opts.map(o => `<button class="btn" data-t="${o[0]}" data-i="${o[1]}">${nm(o[0], o[1])}</button>`).join("")}</div>`;
    $("#b1bo", el).innerHTML = qn ? L2(`Score: ${qs} / ${qn}`, `স্কোর: ${B1b(qs)} / ${B1b(qn)}`) : L2("Pick the branch that best fits.", "সবচেয়ে মানানসই শাখাটি বেছে নাও।");
    el.querySelectorAll("#b1bb button[data-t]").forEach(b => b.addEventListener("click", () => {
      if (answered) return; answered = true;
      const right = b.dataset.t === (q[1] ? "a" : "p") && +b.dataset.i === q[2];
      qn++; if (right) qs++;
      el.querySelectorAll("#b1bb button[data-t]").forEach(x => { const r = x.dataset.t === (q[1] ? "a" : "p") && +x.dataset.i === q[2]; if (r) x.classList.add("done"); else if (x === b) x.style.borderColor = "var(--bad)"; });
      const L = q[1] ? APP : PURE;
      $("#b1bo", el).innerHTML = okB1(right, `<b>${L[q[2]][0]}</b> (${q[1] ? L2("applied", "ফলিত") : L2("pure", "ভৌত")}): ${L[q[2]][1]}`) +
        `<br><span class="muted">${L2(`Score: ${qs} / ${qn}`, `স্কোর: ${B1b(qs)} / ${B1b(qn)}`)}</span><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b1bn">${L2("Next", "পরেরটি")}</button></div>`;
      $("#b1bn", el).addEventListener("click", () => { qi++; quiz(); });
    }));
  };
  chipsB1(el, ".b1bm", b => { mode = b.dataset.m; show(); });
  show();
};

/* 1.3 five kingdoms: explorer with drawings + sorting game */
W.b1kingdom = (el) => {
  const T = (x, y, s, a = "start", sz = 13, c = "var(--ink)") => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}">${s}</text>`;
  const TL = (x, y, s0) => { if (s0.length <= 17) return T(x, y, s0); const sp = [...s0.matchAll(/ /g)].map(m => m.index); if (!sp.length) return T(x, y, s0); const c = sp.reduce((a, b) => Math.abs(b - s0.length / 2) < Math.abs(a - s0.length / 2) ? b : a); return `<text x="${x}" y="${y}" font-size="13" fill="var(--ink)">${s0.slice(0, c)}<tspan x="${x}" dy="15">${s0.slice(c + 1)}</tspan></text>`; };
  const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1"/>`;
  const DRAW = {
    mon: () => `<g transform="translate(20,40)"><rect x="0" y="20" width="150" height="66" rx="33" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="3"/>
      <rect x="6" y="26" width="138" height="54" rx="27" fill="none" stroke="var(--c)" stroke-width="1.5"/>
      <path d="M40 52 q10 -18 22 0 t22 0 t22 0 q-6 14 -20 6 t-24 4 t-22 -10" fill="none" stroke="var(--bad)" stroke-width="2.5"/>
      ${[[24, 40], [30, 66], [118, 38], [126, 64], [100, 70], [52, 72], [80, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="var(--ink)"/>`).join("")}
      <path d="M150 53 q14 -12 26 0 t26 0 t20 -4" fill="none" stroke="var(--ink)" stroke-width="2"/></g>
      ${ln(98, 92, 230, 30)}${TL(232, 34, L2("DNA: no nuclear membrane", "DNA: নিউক্লিয়ার পর্দা নেই"))}
      ${ln(50, 106, 230, 62)}${TL(232, 66, L2("ribosomes", "রাইবোজোম"))}
      ${ln(26, 74, 230, 94)}${TL(232, 98, L2("cell wall", "কোষপ্রাচীর"))}
      ${ln(210, 92, 232, 126)}${TL(232, 130, L2("flagellum", "ফ্ল্যাজেলাম"))}
      ${T(20, 170, L2("A rod-shaped bacterium (one cell)", "দণ্ডাকার ব্যাকটেরিয়া (একটি কোষ)"), "start", 13, "var(--muted)")}`,
    pro: () => `<path d="M40 90 C30 60 60 40 80 52 C90 30 120 28 128 50 C150 40 175 60 160 82 C185 96 168 128 140 120 C130 145 95 142 88 124 C60 135 30 120 40 90 Z" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="100" cy="88" r="16" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/><circle cx="100" cy="88" r="5" fill="var(--c)"/>
      <circle cx="66" cy="100" r="8" fill="none" stroke="var(--note)" stroke-width="2"/><circle cx="66" cy="100" r="3" fill="var(--note)"/>
      <circle cx="138" cy="74" r="6" fill="none" stroke="var(--c)" stroke-width="1.5"/>
      ${ln(116, 88, 230, 40)}${TL(232, 44, L2("nucleus with membrane", "পর্দাঘেরা নিউক্লিয়াস"))}
      ${ln(74, 100, 230, 74)}${TL(232, 78, L2("food vacuole", "খাদ্যগহ্বর"))}
      ${ln(170, 106, 230, 108)}${TL(232, 112, L2("pseudopodium", "ক্ষণপদ"))}
      ${T(20, 170, L2("Amoeba: one eukaryotic cell, no embryo", "অ্যামিবা: একটি প্রকৃত কোষ, ভ্রূণ হয় না"), "start", 13, "var(--muted)")}`,
    fun: () => `<path d="M20 132 q30 -6 60 4 t60 -2 t60 4" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3"/>
      <path d="M40 76 Q100 10 160 76 Z" fill="var(--note)" stroke="var(--ink)" stroke-width="2"/>
      ${[52, 64, 76, 88, 100, 112, 124, 136, 148].map(x => `<line x1="${x}" y1="76" x2="${100 + (x - 100) * 0.6}" y2="84" stroke="var(--ink)" stroke-width="1"/>`).join("")}
      <path d="M40 76 h120" stroke="var(--ink)" stroke-width="2"/><rect x="92" y="84" width="16" height="50" rx="4" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>
      <path d="M88 98 h24" stroke="var(--ink)" stroke-width="2"/>
      <path d="M96 134 q-20 10 -40 24 M100 134 q0 14 -4 28 M104 134 q22 8 46 20 M100 136 q-36 4 -66 0 M102 136 q30 6 60 2" fill="none" stroke="var(--muted)" stroke-width="1.3"/>
      ${ln(140, 50, 230, 36)}${T(232, 40, L2("cap", "টুপি (ক্যাপ)"))}
      ${ln(124, 82, 230, 66)}${TL(232, 70, L2("gills: make spores", "গিল: স্পোর তৈরি হয়"))}
      ${ln(108, 112, 230, 98)}${TL(232, 102, L2("stalk", "বৃন্ত"))}
      ${ln(150, 152, 230, 134)}${T(232, 138, L2("mycelium (threads)", "মাইসেলিয়াম (সুতা)"))}
      ${T(20, 176, L2("Mushroom: no chlorophyll, absorbs food", "মাশরুম: ক্লোরোফিল নেই, খাদ্য শোষণ করে"), "start", 13, "var(--muted)")}`,
    pla: () => `<path d="M20 140 h180" stroke="var(--muted)" stroke-width="1.5"/>
      <path d="M100 140 V44" stroke="var(--good)" stroke-width="4"/>
      <path d="M100 110 C70 104 52 86 50 70 C72 74 92 90 100 110 Z" fill="var(--good)" stroke="var(--ink)" stroke-width="1.2"/>
      <path d="M100 90 C130 84 148 66 150 50 C128 54 108 70 100 90 Z" fill="var(--good)" stroke="var(--ink)" stroke-width="1.2"/>
      <path d="M100 70 C82 64 74 52 74 40 C88 44 98 56 100 70 Z" fill="var(--good)" stroke="var(--ink)" stroke-width="1.2"/>
      ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${100 + 8 * Math.cos(a * Math.PI / 180)}" cy="${36 + 8 * Math.sin(a * Math.PI / 180)}" rx="6" ry="6" fill="var(--bad)" opacity=".75"/>`).join("")}<circle cx="100" cy="36" r="4" fill="var(--note)"/>
      <path d="M100 140 q-14 12 -30 18 M100 140 q2 14 -2 26 M100 140 q14 10 32 14 M86 150 q-8 2 -14 8" fill="none" stroke="var(--note)" stroke-width="2"/>
      ${ln(146, 56, 230, 62)}${TL(232, 66, L2("leaf: chlorophyll", "পাতা: ক্লোরোফিল"))}
      ${ln(108, 36, 230, 18)}${TL(232, 22, L2("flower → seed, embryo", "ফুল → বীজ, ভ্রূণ"))}
      ${ln(102, 120, 230, 100)}${TL(232, 104, L2("stem: tissue systems", "কাণ্ড: টিস্যুতন্ত্র"))}
      ${ln(130, 154, 230, 136)}${TL(232, 140, L2("root", "মূল"))}
      ${T(20, 182, L2("Green plant: makes its own food", "সবুজ উদ্ভিদ: নিজের খাদ্য নিজে তৈরি করে"), "start", 13, "var(--muted)")}`,
    ani: () => `<path d="M30 90 C60 50 130 50 160 90 C130 130 60 130 30 90 Z" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2"/>
      <path d="M160 90 L196 62 L188 90 L196 118 Z" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="2"/>
      <path d="M86 60 q14 -18 30 -4 M86 120 q14 16 28 4" fill="var(--c-soft)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="54" cy="84" r="5" fill="var(--ink)"/><path d="M32 94 q6 3 12 0" stroke="var(--ink)" stroke-width="2" fill="none"/>
      <path d="M70 70 q4 20 0 40" stroke="var(--muted)" fill="none"/>
      ${[[100, 82], [120, 92], [110, 104], [130, 78], [90, 98]].map(([x, y]) => `<path d="M${x} ${y} a6 6 0 0 1 10 0" fill="none" stroke="var(--muted)"/>`).join("")}
      ${ln(36, 96, 230, 40)}${TL(232, 44, L2("mouth: ingests food", "মুখ: খাদ্য গলাধঃকরণ"))}
      ${ln(118, 98, 230, 76)}${TL(232, 80, L2("many cells, no cell wall", "বহুকোষী, কোষপ্রাচীর নেই"))}
      ${ln(186, 108, 230, 112)}${TL(232, 116, L2("moves actively", "সক্রিয়ভাবে চলে"))}
      ${T(20, 170, L2("Fish: a multicellular heterotroph", "মাছ: বহুকোষী পরভোজী প্রাণী"), "start", 13, "var(--muted)")}`
  };
  const K = {
    mon: { n: L2("Monera", "মনেরা"), sup: L2("Prokaryotae", "প্রোক্যারিওটা"), rows: [
      L2("Prokaryotic: chromatin present but no nuclear membrane or nucleolus", "আদিকোষী: ক্রোমাটিন আছে, কিন্তু নিউক্লিয়ার পর্দা ও নিউক্লিওলাস নেই"),
      L2("Unicellular, filamentous or colonial", "এককোষী, ফিলামেন্টাস বা কলোনিয়াল"),
      L2("No plastids, mitochondria or ER; ribosomes present", "প্লাস্টিড, মাইটোকন্ড্রিয়া, এন্ডোপ্লাজমিক জালিকা নেই; রাইবোজোম আছে"),
      L2("Nutrition: mostly absorption; some photosynthesis", "পুষ্টি: প্রধানত শোষণ; কেউ কেউ সালোকসংশ্লেষণ"),
      L2("Divides by binary fission", "দ্বিবিভাজনে বিভাজিত হয়")], ex: L2("bacteria, blue-green algae (<i>Nostoc</i>)", "ব্যাকটেরিয়া, নীলাভ সবুজ শৈবাল (<i>Nostoc</i>)") },
    pro: { n: L2("Protista", "প্রোটিস্টা"), sup: L2("Eukaryota", "ইউক্যারিওটা"), rows: [
      L2("Eukaryotic: nucleus with a nuclear membrane; all organelles", "প্রকৃতকোষী: পর্দাঘেরা নিউক্লিয়াস; সব অঙ্গাণু আছে"),
      L2("Unicellular or simple multicellular; single, colonial or filamentous", "এককোষী বা সরল বহুকোষী; একক, কলোনিয়াল বা ফিলামেন্টাস"),
      L2("Nutrition: absorption, ingestion or photosynthesis", "পুষ্টি: শোষণ, গলাধঃকরণ বা সালোকসংশ্লেষণ"),
      L2("Asexual by mitosis; sexual by conjugation", "মাইটোসিসে অযৌন; কনজুগেশনে যৌন জনন"),
      L2("No embryo is formed", "কোনো ভ্রূণ গঠিত হয় না")], ex: L2("Amoeba, Paramecium, diatoms, Spirogyra", "অ্যামিবা, প্যারামেসিয়াম, ডায়াটম, স্পাইরোগাইরা") },
    fun: { n: L2("Fungi", "ফানজাই"), sup: L2("Eukaryota", "ইউক্যারিওটা"), rows: [
      L2("Eukaryotic; body is one cell or a thread-like mycelium", "প্রকৃতকোষী; দেহ এককোষী বা সুতার মতো মাইসেলিয়াম"),
      L2("Cell wall made of chitin", "কোষপ্রাচীর কাইটিন দিয়ে তৈরি"),
      L2("No chloroplast: cannot photosynthesise", "ক্লোরোপ্লাস্ট নেই: সালোকসংশ্লেষণ করে না"),
      L2("Nutrition: absorption (saprophytic or parasitic)", "পুষ্টি: শোষণ (মৃতজীবী বা পরজীবী)"),
      L2("Reproduce by haploid spores", "হ্যাপ্লয়েড স্পোরের মাধ্যমে বংশবৃদ্ধি")], ex: L2("yeast, Penicillium, mushroom", "ইস্ট, পেনিসিলিয়াম, মাশরুম") },
    pla: { n: L2("Plantae", "প্লানটি"), sup: L2("Eukaryota", "ইউক্যারিওটা"), rows: [
      L2("Eukaryotic and multicellular, with advanced tissue systems", "প্রকৃতকোষী ও বহুকোষী, উন্নত টিস্যুতন্ত্র"),
      L2("Cell wall of cellulose; plastids (chloroplasts) present", "সেলুলোজের কোষপ্রাচীর; প্লাস্টিড (ক্লোরোপ্লাস্ট) আছে"),
      L2("Nutrition: photosynthesis (autotrophic)", "পুষ্টি: সালোকসংশ্লেষণ (স্বভোজী)"),
      L2("Embryo forms; the diploid stage starts from it", "ভ্রূণ সৃষ্টি হয়; তা থেকে ডিপ্লয়েড পর্যায় শুরু"),
      L2("Mostly terrestrial, many aquatic", "প্রধানত স্থলজ, অনেক জলজ")], ex: L2("green plants: jackfruit, paddy, fern", "সবুজ উদ্ভিদ: কাঁঠাল, ধান, ফার্ন") },
    ani: { n: L2("Animalia", "অ্যানিমেলিয়া"), sup: L2("Eukaryota", "ইউক্যারিওটা"), rows: [
      L2("Eukaryotic and multicellular, complex tissue systems", "প্রকৃতকোষী ও বহুকোষী, জটিল টিস্যুতন্ত্র"),
      L2("No cell wall, no plastids", "কোষপ্রাচীর নেই, প্লাস্টিড নেই"),
      L2("Nutrition: heterotrophic; ingest and digest food", "পুষ্টি: পরভোজী; খাদ্য গলাধঃকরণ ও পরিপাক করে"),
      L2("Mainly sexual reproduction; haploid gametes", "প্রধানত যৌন জনন; হ্যাপ্লয়েড গ্যামেট"),
      L2("Embryonic layers form during development", "ভ্রূণ বিকাশে ভ্রূণীয় স্তর সৃষ্টি হয়")], ex: L2("all invertebrates and vertebrates except protozoa", "প্রোটোজোয়া ছাড়া সব অমেরুদণ্ডী ও মেরুদণ্ডী প্রাণী") }
  };
  const KEYS = ["mon", "pro", "fun", "pla", "ani"];
  const ORG = [
    ["mon", L2("Cholera bacterium (<i>Vibrio cholerae</i>)", "কলেরা জীবাণু (<i>Vibrio cholerae</i>)"), L2("A bacterium: one cell with no nuclear membrane.", "একটি ব্যাকটেরিয়া: নিউক্লিয়ার পর্দাহীন একটি কোষ।")],
    ["mon", L2("<i>Nostoc</i> (blue-green alga)", "<i>Nostoc</i> (নীলাভ সবুজ শৈবাল)"), L2("Prokaryotic filaments that photosynthesise; really a cyanobacterium, not a true alga.", "সালোকসংশ্লেষণকারী আদিকোষী ফিলামেন্ট; আসলে সায়ানোব্যাকটেরিয়া, প্রকৃত শৈবাল নয়।")],
    ["mon", L2("Lactobacillus (yoghurt bacterium)", "ল্যাক্টোব্যাসিলাস (দইয়ের ব্যাকটেরিয়া)"), L2("A bacterium that turns milk into doi: prokaryotic.", "দুধকে দই বানানো ব্যাকটেরিয়া: আদিকোষী।")],
    ["pro", L2("Amoeba", "অ্যামিবা"), L2("One eukaryotic cell that ingests food with pseudopodia; no embryo.", "একটি প্রকৃত কোষ, ক্ষণপদ দিয়ে খাদ্য গলাধঃকরণ করে; ভ্রূণ হয় না।")],
    ["pro", L2("Paramecium", "প্যারামেসিয়াম"), L2("A slipper-shaped single eukaryotic cell covered with cilia.", "সিলিয়াযুক্ত চটিজুতার মতো এককোষী প্রকৃতকোষী জীব।")],
    ["pro", L2("Diatom", "ডায়াটম"), L2("A unicellular alga: eukaryotic, photosynthetic, no embryo.", "এককোষী শৈবাল: প্রকৃতকোষী, সালোকসংশ্লেষণকারী, ভ্রূণ হয় না।")],
    ["pro", L2("Malaria parasite (<i>Plasmodium</i>)", "ম্যালেরিয়া জীবাণু (<i>Plasmodium</i>)"), L2("A single-celled eukaryotic parasite (a protozoan), so a protist, not a bacterium.", "এককোষী প্রকৃতকোষী পরজীবী (প্রোটোজোয়া), তাই প্রোটিস্ট, ব্যাকটেরিয়া নয়।")],
    ["pro", L2("Spirogyra", "স্পাইরোগাইরা"), L2("A green filamentous alga of ponds; eukaryotic but forms no embryo.", "পুকুরের সবুজ সুতার মতো শৈবাল; প্রকৃতকোষী কিন্তু ভ্রূণ হয় না।")],
    ["fun", L2("Yeast", "ইস্ট"), L2("A single-celled fungus that makes bread dough rise.", "এককোষী ছত্রাক, যা পাউরুটির ময়দা ফোলায়।")],
    ["fun", L2("Mushroom", "মাশরুম"), L2("No chlorophyll, absorbs food, chitin cell walls.", "ক্লোরোফিল নেই, খাদ্য শোষণ করে, কাইটিনের কোষপ্রাচীর।")],
    ["fun", L2("Penicillium (green mould)", "পেনিসিলিয়াম (সবুজ ছত্রাক)"), L2("A mould with a mycelium; source of penicillin.", "মাইসেলিয়ামযুক্ত ছত্রাক; পেনিসিলিনের উৎস।")],
    ["pla", L2("Jackfruit tree", "কাঁঠালগাছ"), L2("Photosynthetic, multicellular, forms embryos in seeds.", "সালোকসংশ্লেষণকারী, বহুকোষী, বীজে ভ্রূণ থাকে।")],
    ["pla", L2("Paddy (rice plant)", "ধানগাছ"), L2("A green flowering plant.", "একটি সবুজ সপুষ্পক উদ্ভিদ।")],
    ["pla", L2("Fern (dheki shak)", "ঢেঁকিশাক (ফার্ন)"), L2("A green plant without flowers, but it still forms an embryo.", "ফুল নেই এমন সবুজ উদ্ভিদ, তবুও ভ্রূণ সৃষ্টি হয়।")],
    ["pla", L2("Water lily (shapla)", "শাপলা"), L2("An aquatic flowering plant: Plantae includes many water plants.", "জলজ সপুষ্পক উদ্ভিদ: প্লানটিতে অনেক জলজ উদ্ভিদ আছে।")],
    ["ani", L2("Royal Bengal tiger", "রয়েল বেঙ্গল টাইগার"), L2("Multicellular, no cell walls, ingests food.", "বহুকোষী, কোষপ্রাচীর নেই, খাদ্য গলাধঃকরণ করে।")],
    ["ani", L2("Earthworm", "কেঁচো"), L2("An invertebrate animal: still in Animalia.", "অমেরুদণ্ডী প্রাণী: তবুও অ্যানিমেলিয়ায়।")],
    ["ani", L2("Hilsa", "ইলিশ"), L2("A vertebrate fish: multicellular heterotroph.", "মেরুদণ্ডী মাছ: বহুকোষী পরভোজী।")],
    ["ani", L2("Honey bee", "মৌমাছি"), L2("An insect, an invertebrate animal.", "একটি কীট, অমেরুদণ্ডী প্রাণী।")]];
  let mode = "ex", k = "mon", deck = shufB1(ORG), di = 0, sc = 0, sn = 0, answered = false;
  el.innerHTML = `<div class="chipset b1km" role="group"><button data-m="ex" aria-pressed="true">${L2("Explore", "দেখো")}</button><button data-m="so" aria-pressed="false">${L2("Sort", "সাজাও")}</button></div>
    <div class="svgwrap fit" id="b1ktree" style="margin-top:8px"></div><div id="b1kb"></div>`;
  const tree = () => {
    const X = [36, 108, 180, 252, 324], hl = key => mode === "ex" && key === k;
    let g = `<svg viewBox="0 0 360 122" role="img" aria-label="${L2("five kingdoms", "পাঁচ রাজ্য")}">
      ${T(180, 16, L2("Living world", "জীবজগৎ"), "middle", 14, "var(--ink)")}
      <path d="M180 22 V30 M60 30 H240 M60 30 V40 M240 30 V40" stroke="var(--muted)" fill="none"/>
      <rect x="6" y="40" width="108" height="24" rx="12" fill="var(--sheet)" stroke="var(--muted)"/>${T(60, 57, L2("Prokaryotae", "প্রোক্যারিওটা"), "middle", 13, "var(--muted)")}
      <rect x="150" y="40" width="180" height="24" rx="12" fill="var(--sheet)" stroke="var(--muted)"/>${T(240, 57, L2("Eukaryota", "ইউক্যারিওটা"), "middle", 13, "var(--muted)")}
      <path d="M36 64 V84 M240 64 V74 M108 74 H324 M108 74 V84 M180 74 V84 M252 74 V84 M324 74 V84" stroke="var(--muted)" fill="none"/>`;
    KEYS.forEach((key, i) => g += `<g data-k="${key}" style="cursor:pointer" role="button" tabindex="0"><rect x="${X[i] - 34}" y="84" width="68" height="30" rx="8" fill="${hl(key) ? "var(--c)" : "var(--c-soft)"}" stroke="var(--c)" stroke-width="1.5"/>
      <text x="${X[i]}" y="104" font-size="12.5" text-anchor="middle" fill="${hl(key) ? "var(--sheet)" : "var(--ink)"}" font-weight="600">${K[key].n}</text></g>`);
    $("#b1ktree", el).innerHTML = g + `</svg>`;
    el.querySelectorAll("#b1ktree g[data-k]").forEach(n => { const go = () => { if (mode === "ex") { k = n.dataset.k; explore(); } else pick(n.dataset.k); }; n.addEventListener("click", go); n.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }); });
  };
  const explore = () => {
    tree(); const d = K[k];
    $("#b1kb", el).innerHTML = `<div class="svgwrap fit"><svg viewBox="0 0 360 190" role="img" aria-label="${d.n}">${DRAW[k]()}</svg></div>
      <div class="w-out"><b>${L2("Kingdom", "রাজ্য")}: ${d.n}</b> <span class="muted">(${L2("super kingdom", "সুপার কিংডম")} ${d.sup})</span>
      <ul style="margin:6px 0 4px;padding-left:20px">${d.rows.map(r => `<li>${r}</li>`).join("")}</ul><span class="muted">${L2("Examples: ", "উদাহরণ: ")}</span>${d.ex}</div>
      <p class="hint">${L2("Tap another kingdom in the tree above.", "ওপরের গাছে অন্য রাজ্যে চাপ দাও।")}</p>`;
  };
  const sortv = () => {
    tree();
    if (di >= deck.length) {
      $("#b1kb", el).innerHTML = `<div class="w-out">${L2(`Finished! You placed ${sc} of ${sn} correctly.`, `শেষ! ${B1b(sn)}টির মধ্যে ${B1b(sc)}টি ঠিক জায়গায় রেখেছ।`)}<div class="w-row" style="margin-top:8px"><button class="btn solid" id="b1kr">${L2("Play again", "আবার খেলো")}</button></div></div>`;
      $("#b1kr", el).addEventListener("click", () => { deck = shufB1(ORG); di = sc = sn = 0; sortv(); }); return;
    }
    answered = false; const o = deck[di];
    $("#b1kb", el).innerHTML = `<p style="margin:8px 0 4px" class="muted">${L2(`Organism ${di + 1} of ${deck.length}`, `জীব ${B1b(di + 1)}/${B1b(deck.length)}`)}</p>
      <div style="font-size:20px;font-weight:700;margin-bottom:6px">${o[1]}</div>
      <p class="hint" style="margin:0 0 6px">${L2("Which kingdom? Tap a kingdom in the tree or a button below.", "কোন রাজ্য? গাছে বা নিচের বোতামে চাপ দাও।")}</p>
      <div class="w-row">${KEYS.map(key => `<button class="btn" data-k="${key}">${K[key].n}</button>`).join("")}</div>
      <div class="w-out" id="b1ko" style="margin-top:10px">${sn ? L2(`Score: ${sc} / ${sn}`, `স্কোর: ${B1b(sc)} / ${B1b(sn)}`) : L2("Think: nucleus? cell wall? how does it feed?", "ভাবো: নিউক্লিয়াস? কোষপ্রাচীর? খাদ্য পায় কীভাবে?")}</div>`;
    el.querySelectorAll("#b1kb button[data-k]").forEach(b => b.addEventListener("click", () => pick(b.dataset.k)));
  };
  const pick = key => {
    if (mode !== "so" || answered || di >= deck.length) return;
    answered = true; const o = deck[di], right = key === o[0]; sn++; if (right) sc++;
    el.querySelectorAll("#b1kb button[data-k]").forEach(b => { if (b.dataset.k === o[0]) b.classList.add("done"); else if (b.dataset.k === key) b.style.borderColor = "var(--bad)"; });
    $("#b1ko", el).innerHTML = okB1(right, `<b>${o[1]}</b> → ${K[o[0]].n}${L2(". ", "। ")}${o[2]}`) + `<br><span class="muted">${L2(`Score: ${sc} / ${sn}`, `স্কোর: ${B1b(sc)} / ${B1b(sn)}`)}</span><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b1kn">${L2("Next", "পরেরটি")}</button></div>`;
    $("#b1kn", el).addEventListener("click", () => { di++; sortv(); });
  };
  chipsB1(el, ".b1km", b => { mode = b.dataset.m; mode === "ex" ? explore() : sortv(); });
  explore();
};

/* 1.4 classification ladder: kingdom -> species, watch the group narrow */
W.b1ladder = (el) => {
  const RANK = [L2("Kingdom", "রাজ্য"), L2("Phylum", "পর্ব"), L2("Class", "শ্রেণি"), L2("Order", "বর্গ"), L2("Family", "গোত্র"), L2("Genus", "গণ"), L2("Species", "প্রজাতি")];
  const ORG = [
    ["human", L2("Human", "মানুষ"), ["Animalia", "Chordata", "Mammalia", "Primates", "Hominidae", "Homo", "Homo sapiens"]],
    ["tiger", L2("Tiger", "বাঘ"), ["Animalia", "Chordata", "Mammalia", "Carnivora", "Felidae", "Panthera", "Panthera tigris"]],
    ["lion", L2("Lion", "সিংহ"), ["Animalia", "Chordata", "Mammalia", "Carnivora", "Felidae", "Panthera", "Panthera leo"]],
    ["cat", L2("Cat", "বিড়াল"), ["Animalia", "Chordata", "Mammalia", "Carnivora", "Felidae", "Felis", "Felis catus"]],
    ["doyel", L2("Doyel", "দোয়েল"), ["Animalia", "Chordata", "Aves", "Passeriformes", "Muscicapidae", "Copsychus", "Copsychus saularis"]],
    ["toad", L2("Asian toad", "কুনো ব্যাঙ"), ["Animalia", "Chordata", "Amphibia", "Anura", "Bufonidae", "Duttaphrynus", "Duttaphrynus melanostictus"]],
    ["roach", L2("Cockroach", "তেলাপোকা"), ["Animalia", "Arthropoda", "Insecta", "Blattodea", "Blattidae", "Periplaneta", "Periplaneta americana"]],
    ["bee", L2("Honey bee", "মৌমাছি"), ["Animalia", "Arthropoda", "Insecta", "Hymenoptera", "Apidae", "Apis", "Apis indica"]],
    ["rice", L2("Rice", "ধান"), ["Plantae", "Magnoliophyta", "Liliopsida", "Poales", "Poaceae", "Oryza", "Oryza sativa"]],
    ["wheat", L2("Wheat", "গম"), ["Plantae", "Magnoliophyta", "Liliopsida", "Poales", "Poaceae", "Triticum", "Triticum aestivum"]],
    ["mango", L2("Mango", "আম"), ["Plantae", "Magnoliophyta", "Magnoliopsida", "Sapindales", "Anacardiaceae", "Mangifera", "Mangifera indica"]]];
  const WHY = {
    Animalia: L2("multicellular, eukaryotic, heterotrophic; no cell wall", "বহুকোষী, প্রকৃতকোষী, পরভোজী; কোষপ্রাচীর নেই"),
    Plantae: L2("photosynthetic; cellulose cell wall; forms embryos", "সালোকসংশ্লেষণকারী; সেলুলোজের কোষপ্রাচীর; ভ্রূণ সৃষ্টি হয়"),
    Chordata: L2("a notochord at some stage of life", "জীবনের কোনো এক পর্যায়ে নটোকর্ড থাকে"),
    Arthropoda: L2("jointed legs and a hard outer skeleton", "সন্ধিযুক্ত পা ও শক্ত বহিঃকঙ্কাল"),
    Magnoliophyta: L2("flowering plants; seeds enclosed in fruit", "সপুষ্পক উদ্ভিদ; বীজ ফলের ভেতরে থাকে"),
    Mammalia: L2("feed young on milk; hair on the body", "বাচ্চাকে দুধ খাওয়ায়; দেহে লোম"),
    Aves: L2("feathers, beak; lay eggs", "পালক, চঞ্চু; ডিম পাড়ে"),
    Amphibia: L2("live in water and on land; moist skin", "জলে ও স্থলে বাস; ভেজা ত্বক"),
    Insecta: L2("body in three parts; six legs", "দেহ তিন ভাগে বিভক্ত; ছয়টি পা"),
    Liliopsida: L2("monocots: one seed leaf, parallel veins", "একবীজপত্রী: একটি বীজপত্র, সমান্তরাল শিরাবিন্যাস"),
    Magnoliopsida: L2("dicots: two seed leaves, net-like veins", "দ্বিবীজপত্রী: দুটি বীজপত্র, জালিকা শিরাবিন্যাস"),
    Primates: L2("five-fingered grasping hands; vision better than smell", "আঁকড়ে ধরার উপযোগী পাঁচ আঙুলের হাত; ঘ্রাণের চেয়ে দৃষ্টি উন্নত"),
    Carnivora: L2("flesh-eaters with sharp canine teeth", "তীক্ষ্ণ শ্বদন্তযুক্ত মাংসাশী"),
    Passeriformes: L2("perching birds: three toes forward, one back", "ডালে বসার উপযোগী পা: তিন আঙুল সামনে, এক আঙুল পেছনে"),
    Anura: L2("frogs and toads; adults have no tail", "ব্যাঙ; পূর্ণবয়স্ক অবস্থায় লেজ নেই"),
    Blattodea: L2("cockroaches (and termites); flat body", "তেলাপোকা (ও উইপোকা); চ্যাপ্টা দেহ"),
    Hymenoptera: L2("two pairs of thin, membranous wings: bees, wasps, ants", "দুই জোড়া পাতলা পর্দার মতো ডানা: মৌমাছি, বোলতা, পিঁপড়া"),
    Poales: L2("grasses and their relatives", "ঘাস ও এদের আত্মীয় উদ্ভিদ"),
    Sapindales: L2("mango, litchi, lemon, neem and relatives", "আম, লিচু, লেবু, নিম ও এদের আত্মীয়"),
    Hominidae: L2("similar to chimpanzees, gorillas, orangutans", "শিম্পাঞ্জি, গরিলা, ওরাংওটাংয়ের সাথে সাদৃশ্য"),
    Felidae: L2("cat family; claws can be pulled in", "বিড়াল গোত্র; থাবার নখ গুটিয়ে রাখা যায়"),
    Muscicapidae: L2("robins and flycatchers: doyel, shama", "দোয়েল, শ্যামা ইত্যাদি পাখির গোত্র"),
    Bufonidae: L2("true toads: dry, warty skin", "কুনো ব্যাঙ গোত্র: শুষ্ক, আঁচিলযুক্ত ত্বক"),
    Blattidae: L2("large common cockroaches", "বড় আকারের সাধারণ তেলাপোকা"),
    Apidae: L2("honey bees and their relatives", "মৌমাছি ও এদের আত্মীয়"),
    Poaceae: L2("grass family: hollow jointed stems; grains", "ঘাস গোত্র: ফাঁপা, পর্বযুক্ত কাণ্ড; দানাশস্য"),
    Anacardiaceae: L2("mango family (cashew too)", "আম গোত্র (কাজুবাদামও)"),
    Homo: L2("largest brain for body size; walks upright on two legs", "দেহের অনুপাতে মস্তিষ্ক সবচেয়ে বড়; খাড়া হয়ে দুই পায়ে হাঁটে"),
    Panthera: L2("big cats that can roar", "গর্জন করতে পারে এমন বড় বিড়াল"),
    Felis: L2("small cats", "ছোট বিড়াল"),
    "Homo sapiens": L2("broad, high forehead; thinner skull; most intelligent", "চওড়া ও উঁচু কপাল; খুলি পাতলা; সবচেয়ে বুদ্ধিমান")
  };
  let o = 0, r = 0;
  el.innerHTML = `<div class="chipset b1lo" role="group">${ORG.map((x, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${x[1]}</button>`).join("")}</div>
    <div class="w-row" style="margin:10px 0"><button class="btn" id="b1lu">▲ ${L2("Up", "ওপরে")}</button><button class="btn solid" id="b1ld">${L2("Down", "নিচে")} ▼</button><span class="muted" id="b1lr"></span></div>
    <div class="svgwrap fit" id="b1lsv"></div><div class="w-out" id="b1lout"></div><div id="b1lg" style="margin-top:8px"></div>`;
  const draw = () => {
    const O = ORG[o], plant = O[2][0] === "Plantae";
    $("#b1lr", el).textContent = L2(`Step ${r + 1} of 7`, `ধাপ ${B1b(7)}টির মধ্যে ${B1b(r + 1)}`);
    let g = `<svg viewBox="0 0 360 252" role="img" aria-label="${L2("classification ladder", "শ্রেণিবিন্যাসের সিঁড়ি")}">`;
    for (let i = 0; i < 7; i++) {
      const x = 4 + i * 5, w = 352 - i * 10, y = 4 + i * 34, on = i <= r, cur = i === r;
      g += `<rect x="${x}" y="${y}" width="${w}" height="${244 - i * 34}" rx="10" fill="${cur ? "var(--c-soft)" : "none"}" stroke="${on ? "var(--c)" : "var(--muted)"}" stroke-width="${cur ? 2.5 : 1.2}" ${on ? "" : 'stroke-dasharray="4 4" opacity=".55"'}/>`;
      const lab = i === 1 && plant ? L2("Division", "বিভাগ") : RANK[i];
      const nm = O[2][i], it = i >= 5;
      g += `<text x="${x + 10}" y="${y + 21}" font-size="13.5" fill="var(--muted)" ${on ? "" : 'opacity=".7"'}>${lab}</text>`;
      g += on ? `<text x="${x + 86}" y="${y + 21}" font-size="${nm.length > 18 ? 13 : 14.5}" fill="var(--ink)" font-weight="${cur ? 700 : 500}" ${it ? 'font-style="italic"' : ""}>${nm}</text>` : `<text x="${x + 86}" y="${y + 21}" font-size="14" fill="var(--muted)" opacity=".7">?</text>`;
    }
    $("#b1lsv", el).innerHTML = g + `</svg>`;
    const nm = O[2][r], why = WHY[nm] || (r === 5 ? L2("a small group of very closely related species", "খুব ঘনিষ্ঠ আত্মীয় প্রজাতিদের ছোট একটি দল") : r === 6 ? L2("this one kind of organism; members can interbreed and have fertile offspring", "এই একটিমাত্র ধরনের জীব; সদস্যরা নিজেদের মধ্যে প্রজননে উর্বর সন্তান জন্ম দেয়") : "");
    const same = ORG.filter(x => x[2][r] === nm);
    $("#b1lout", el).innerHTML = `<b>${(r === 1 && O[2][0] === "Plantae") ? L2("Division", "বিভাগ") : RANK[r]}: <span ${r >= 5 ? 'style="font-style:italic"' : ""}>${nm}</span></b><br>${L2("Why here: ", "কেন এখানে: ")}${why}` +
      `<br><span class="muted">${L2(`Organisms in this list sharing this ${r === 1 && O[2][0] === "Plantae" ? "division" : ["kingdom", "phylum", "class", "order", "family", "genus", "species"][r]}: ${same.length} of ${ORG.length}`, `এই তালিকায় একই ধাপে আছে: ${B1b(ORG.length)}টির মধ্যে ${B1b(same.length)}টি`)}</span>`;
    $("#b1lg", el).innerHTML = `<div class="chipset">${ORG.map(x => { const inn = x[2][r] === nm; return `<span style="padding:4px 10px;border-radius:999px;font-size:14px;border:1px solid ${inn ? "var(--c)" : "var(--rule)"};background:${inn ? "var(--c-soft)" : "transparent"};color:${inn ? "var(--ink)" : "var(--muted)"};${inn ? "" : "text-decoration:line-through;opacity:.6"}">${x[1]}</span>`; }).join("")}</div>
      <p class="hint" style="margin-top:6px">${r === 0 ? L2("Kingdom: the biggest group, fewest shared features.", "রাজ্য: সবচেয়ে বড় দল, সাধারণ বৈশিষ্ট্য সবচেয়ে কম।") : r === 6 ? L2("Species: the smallest group, most shared features.", "প্রজাতি: সবচেয়ে ছোট দল, সাধারণ বৈশিষ্ট্য সবচেয়ে বেশি।") : L2("Each step down adds features, so fewer organisms stay in the group.", "প্রতিটি নিচের ধাপে বৈশিষ্ট্য যোগ হয়, তাই দলে কম জীব থাকে।")}${O[0] === "bee" && r === 6 ? " " + L2("(Many scientists now call this bee <i>Apis cerana</i>; the book uses <i>Apis indica</i>.)", "(অনেক বিজ্ঞানী এখন এই মৌমাছিকে <i>Apis cerana</i> বলেন; বইয়ে <i>Apis indica</i>।)") : ""}${O[2][0] === "Plantae" && r >= 1 && r <= 3 ? " " + L2("(Plant higher ranks are named slightly differently in different books.)", "(উদ্ভিদের ওপরের ধাপগুলোর নাম বিভিন্ন বইয়ে সামান্য ভিন্ন হতে পারে।)") : ""}</p>`;
    $("#b1lu", el).disabled = r === 0; $("#b1ld", el).disabled = r === 6;
  };
  chipsB1(el, ".b1lo", b => { o = +b.dataset.i; r = 0; draw(); });
  $("#b1lu", el).addEventListener("click", () => { if (r > 0) { r--; draw(); } });
  $("#b1ld", el).addEventListener("click", () => { if (r < 6) { r++; draw(); } });
  draw();
};

/* 1.5 binomial names: see printed vs handwritten, then spot the correct form */
W.b1name = (el) => {
  const N = [
    [L2("Rice", "ধান"), "Oryza", "sativa", "L., 1753"], [L2("Jute", "পাট"), "Corchorus", "capsularis", ""], [L2("Mango", "আম"), "Mangifera", "indica", ""],
    [L2("Jackfruit", "কাঁঠাল"), "Artocarpus", "heterophyllus", ""], [L2("Water lily", "শাপলা"), "Nymphaea", "nouchali", ""], [L2("China rose", "জবা"), "Hibiscus", "rosa-sinensis", ""],
    [L2("Potato", "গোল আলু"), "Solanum", "tuberosum", ""], [L2("Rui fish", "রুই মাছ"), "Labeo", "rohita", ""], [L2("Catla fish", "কাতলা মাছ"), "Catla", "catla", ""],
    [L2("Cholera bacterium", "কলেরা জীবাণু"), "Vibrio", "cholerae", ""], [L2("Cockroach", "তেলাপোকা"), "Periplaneta", "americana", ""], [L2("Honey bee", "মৌমাছি"), "Apis", "indica", ""],
    [L2("Hilsa", "ইলিশ"), "Tenualosa", "ilisha", ""], [L2("Doyel", "দোয়েল"), "Copsychus", "saularis", ""], [L2("Tiger", "বাঘ"), "Panthera", "tigris", ""],
    [L2("Lion", "সিংহ"), "Panthera", "leo", ""], [L2("Human", "মানুষ"), "Homo", "sapiens", "L., 1758"]];
  const HAND = `font-family:'Segoe Print','Bradley Hand','Comic Sans MS','Comic Neue',cursive;font-size:22px`;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  let mode = "see", cur = 0, rnd = null, sc = 0, sn = 0;
  el.innerHTML = `<div class="chipset b1nm" role="group"><button data-m="see" aria-pressed="true">${L2("See the name", "নাম দেখো")}</button><button data-m="spot" aria-pressed="false">${L2("Spot the correct name", "সঠিক নামটি খোঁজো")}</button></div><div id="b1nb" style="margin-top:10px"></div>`;
  const word = (w, lab, col, extra = "") => `<span style="display:inline-flex;flex-direction:column;align-items:center;margin:0 6px 4px 0"><span style="${extra}">${w}</span><span style="font-size:13px;color:${col};border-top:2px solid ${col};margin-top:4px;padding-top:2px;align-self:stretch;text-align:center">${lab}</span></span>`;
  const see = () => {
    const n = N[cur];
    $("#b1nb", el).innerHTML = `<div class="chipset b1nl" role="group">${N.map((x, i) => `<button data-i="${i}" aria-pressed="${i === cur}">${x[0]}</button>`).join("")}</div>
      <div style="margin-top:12px;padding:12px;border:1px solid var(--rule);border-radius:10px;background:var(--sheet)">
        <div class="muted" style="font-size:13px;margin-bottom:4px">${L2("Printed (in a book): italics", "ছাপায় (বইয়ে): ইটালিক")}</div>
        <div style="display:flex;flex-wrap:wrap;align-items:flex-start;font-size:24px">${word(`<i>${n[1]}</i>`, L2("genus", "গণ"), "var(--c)")}${word(`<i>${n[2]}</i>`, L2("species", "প্রজাতি"), "var(--note)")}${n[3] ? word(n[3], L2("named by Linnaeus, year", "নামদাতা লিনিয়াস, সাল"), "var(--muted)", "font-size:17px") : ""}</div>
        <div class="muted" style="font-size:13px;margin:12px 0 4px">${L2("Handwritten (in your exam script): underline each part separately", "হাতে লেখা (পরীক্ষার খাতায়): প্রতিটি পদের নিচে আলাদা দাগ")}</div>
        <div style="${HAND}"><span style="text-decoration:underline;text-underline-offset:5px">${n[1]}</span>&nbsp;&nbsp;<span style="text-decoration:underline;text-underline-offset:5px">${n[2]}</span></div>
      </div>
      <div class="w-out" style="margin-top:10px">${L2(`<b>${n[1]}</b>: genus, starts with a capital <b>${n[1][0]}</b>. <b>${n[2]}</b>: species, all small letters.`, `<b>${n[1]}</b>: গণ নাম, বড় হাতের <b>${n[1][0]}</b> দিয়ে শুরু। <b>${n[2]}</b>: প্রজাতিক নাম, পুরোটা ছোট হাতের অক্ষরে।`)}${n[1] === "Panthera" ? " " + L2("Tiger and lion share the genus <i>Panthera</i>: close relatives.", "বাঘ আর সিংহের গণ একই, <i>Panthera</i>: এরা নিকটাত্মীয়।") : ""}${n[1] === n[2][0].toUpperCase() + n[2].slice(1) ? " " + L2("Genus and species words can be the same (<i>Catla catla</i>), but the species is still in small letters.", "গণ আর প্রজাতিক শব্দ একই হতে পারে (<i>Catla catla</i>), তবুও প্রজাতিক নাম ছোট হাতের অক্ষরে।") : ""}${n[2].includes("-") ? " " + L2("<i>rosa-sinensis</i> is one species word with a hyphen.", "<i>rosa-sinensis</i> হাইফেনযুক্ত একটিই প্রজাতিক পদ।") : ""}${n[1] === "Apis" ? " " + L2("(Many scientists now treat this bee as <i>Apis cerana</i>; the book uses <i>Apis indica</i>.)", "(অনেক বিজ্ঞানী এখন এই মৌমাছিকে <i>Apis cerana</i> ধরেন; বইয়ে <i>Apis indica</i>।)") : ""}</div>`;
    chipsB1(el, ".b1nl", b => { cur = +b.dataset.i; see(); });
  };
  const newRound = () => {
    const n = N[Math.floor(Math.random() * N.length)], G = n[1], s = n[2], hand = Math.random() < 0.4;
    const U = t => `<span style="text-decoration:underline;text-underline-offset:5px">${t}</span>`;
    let opts;
    if (!hand) {
      opts = [
        { h: `<i>${G} ${s}</i>`, ok: true, why: L2("Genus capitalised, species small, genus first, in italics.", "গণ বড় হাতের অক্ষরে, প্রজাতি ছোট হাতের, গণ আগে, ইটালিকে।") },
        { h: `<i>${G} ${cap(s)}</i>`, why: L2("Capital-letter rule: the species name must be all small letters.", "বড় হাতের অক্ষরের নিয়ম: প্রজাতিক নাম পুরোটা ছোট হাতের অক্ষরে হবে।") },
        { h: `<i>${G.toLowerCase()} ${s}</i>`, why: L2("Capital-letter rule: the genus must start with a capital letter.", "বড় হাতের অক্ষরের নিয়ম: গণ নাম বড় হাতের অক্ষরে শুরু হবে।") },
        { h: `<i>${s} ${G}</i>`, why: L2("Order rule: the genus comes first, then the species.", "ক্রমের নিয়ম: আগে গণ, পরে প্রজাতি।") },
        { h: `${G} ${s}`, why: L2("Italics rule: a printed scientific name must be in italics.", "ইটালিকের নিয়ম: ছাপায় বৈজ্ঞানিক নাম ইটালিকে হবে।") },
        { h: `<i>${(G + " " + s).toUpperCase()}</i>`, why: L2("Capital-letter rule: not all capitals; only the genus's first letter.", "বড় হাতের অক্ষরের নিয়ম: সব বড় হাতের নয়; শুধু গণের প্রথম অক্ষর।") }];
    } else {
      opts = [
        { h: `<span style="${HAND}">${U(G)}&nbsp;&nbsp;${U(s)}</span>`, ok: true, why: L2("Handwritten: each part underlined separately.", "হাতে লেখা: প্রতিটি পদের নিচে আলাদা দাগ।") },
        { h: `<span style="${HAND}">${U(G + "&nbsp;&nbsp;" + s)}</span>`, why: L2("Underline rule: underline the genus and species separately, not with one line.", "নিচে দাগের নিয়ম: একটানা একটি দাগ নয়, গণ ও প্রজাতির নিচে আলাদা দাগ।") },
        { h: `<span style="${HAND}">${G}&nbsp;&nbsp;${s}</span>`, why: L2("Underline rule: a handwritten scientific name must be underlined.", "নিচে দাগের নিয়ম: হাতে লেখা বৈজ্ঞানিক নামের নিচে দাগ দিতে হবে।") },
        { h: `<span style="${HAND}">${U(G)}&nbsp;&nbsp;${U(cap(s))}</span>`, why: L2("Capital-letter rule: the species name must be all small letters.", "বড় হাতের অক্ষরের নিয়ম: প্রজাতিক নাম পুরোটা ছোট হাতের অক্ষরে হবে।") },
        { h: `<span style="${HAND}">${U(s)}&nbsp;&nbsp;${U(G)}</span>`, why: L2("Order rule: the genus comes first.", "ক্রমের নিয়ম: গণ আগে আসবে।") }];
    }
    const pickd = [opts[0], ...shufB1(opts.slice(1)).slice(0, 3)];
    rnd = { n, hand, opts: shufB1(pickd), done: false };
  };
  const spot = () => {
    if (!rnd) newRound();
    const R = rnd;
    $("#b1nb", el).innerHTML = `<p style="margin:0 0 8px">${R.hand ? L2(`You are <b>writing by hand</b> in your exam script. Which is the correct scientific name of <b>${R.n[0]}</b>?`, `তুমি পরীক্ষার খাতায় <b>হাতে লিখছ</b>। <b>${R.n[0]}</b>-এর সঠিক বৈজ্ঞানিক নাম কোনটি?`) : L2(`This name is <b>printed in a book</b>. Which is the correct scientific name of <b>${R.n[0]}</b>?`, `নামটি <b>বইয়ে ছাপা</b> হচ্ছে। <b>${R.n[0]}</b>-এর সঠিক বৈজ্ঞানিক নাম কোনটি?`)}</p>
      <div style="display:grid;gap:8px">${R.opts.map((p, i) => `<button class="btn" data-i="${i}" style="justify-content:flex-start;font-size:19px;min-height:52px;border-radius:12px;color:var(--ink)">${p.h}</button>`).join("")}</div>
      <div class="w-out" id="b1no" style="margin-top:10px">${sn ? L2(`Score: ${sc} / ${sn}`, `স্কোর: ${B1b(sc)} / ${B1b(sn)}`) : L2("Check capitals, order, italics and underlining.", "বড় হাতের অক্ষর, ক্রম, ইটালিক আর নিচের দাগ খেয়াল করো।")}</div>`;
    el.querySelectorAll("#b1nb button[data-i]").forEach(b => b.addEventListener("click", () => {
      if (R.done) return; R.done = true;
      const p = R.opts[+b.dataset.i]; sn++; if (p.ok) sc++;
      el.querySelectorAll("#b1nb button[data-i]").forEach(x => { const q = R.opts[+x.dataset.i]; if (q.ok) x.style.borderColor = "var(--good)", x.style.borderWidth = "3px"; else if (x === b) x.style.borderColor = "var(--bad)"; });
      $("#b1no", el).innerHTML = okB1(!!p.ok, p.why) + `<ul style="margin:6px 0;padding-left:20px;font-size:15px">${R.opts.filter(q => !q.ok).map(q => `<li>${q.h.replace(/font-size:22px/g, "font-size:16px")} → ${q.why}</li>`).join("")}</ul><span class="muted">${L2(`Score: ${sc} / ${sn}`, `স্কোর: ${B1b(sc)} / ${B1b(sn)}`)}</span><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b1nn">${L2("Next", "পরেরটি")}</button></div>`;
      $("#b1nn", el).addEventListener("click", () => { rnd = null; spot(); });
    }));
  };
  chipsB1(el, ".b1nm", b => { mode = b.dataset.m; mode === "see" ? see() : spot(); });
  see();
};
