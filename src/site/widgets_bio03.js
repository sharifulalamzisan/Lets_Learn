/* ---- biology chapter 3 widgets: cell division ---- */
const B3 = x => bnNum(x, LANG);
/* chromosomes that came from the father / the mother: a blue–orange pair reads clearly in light and dark mode */
const CP3 = "#3d82d8", CM3 = "#e2762b";
const chips3 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const grp3 = n => B3(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "));
const ok3 = (good, txt) => `<b style="color:${good ? "var(--good)" : "var(--bad)"}">${good ? L2("Correct! ", "ঠিক! ") : L2("Not quite. ", "হয়নি। ")}</b>${txt}`;
const f3 = x => (+x).toFixed(1);
const legend3 = () => `<div class="hint" style="display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center"><span><i style="display:inline-block;width:18px;height:6px;border-radius:3px;background:${CP3};vertical-align:middle"></i> ${L2("came from the father", "বাবার কাছ থেকে পাওয়া")}</span><span><i style="display:inline-block;width:18px;height:6px;border-radius:3px;background:${CM3};vertical-align:middle"></i> ${L2("came from the mother", "মায়ের কাছ থেকে পাওয়া")}</span></div>`;

/* 3.1 doubling power of division + "which division is needed?" */
W.b3divide = (el) => {
  el.innerHTML = `<div class="chipset b3dt" role="group"><button data-t="d" aria-pressed="true">${L2("1 → 2 → 4 → …", "১ → ২ → ৪ → …")}</button><button data-t="q" aria-pressed="false">${L2("Which division?", "কোন বিভাজন?")}</button></div><div id="b3dbody" style="margin-top:10px"></div>`;
  const body = $("#b3dbody", el);
  /* ---------- tab 1: doubling ---------- */
  const doubling = () => {
    body.innerHTML = `<div class="w-row" style="margin-bottom:6px"><button class="btn solid" id="b3dgo">${L2("Divide", "বিভাজন")} ×${B3(2)}</button><button class="btn" id="b3drs">${L2("Start again", "আবার শুরু")}</button></div>
      ${slider("b3dn", L2("Number of divisions, n", "বিভাজনের সংখ্যা, n"), 0, 46, 1, 0, "")}
      <div class="svgwrap fit" id="b3dsv"></div><div class="w-out" id="b3do"></div>
      <p class="hint" style="margin-top:6px">${L2("This is the simplest picture: every cell divides every time. In a real body many cells stop dividing, so growth takes far longer.", "এটি সবচেয়ে সরল ছবি: প্রতিবার প্রতিটি কোষই ভাগ হচ্ছে। বাস্তবে দেহের অনেক কোষ বিভাজন থামিয়ে দেয়, তাই বেড়ে উঠতে অনেক বেশি সময় লাগে।")}</p>`;
    const draw = () => {
      const n = sv(el, "b3dn", "", 0), N = Math.pow(2, n);
      let g = `<svg viewBox="0 0 360 184" role="img" aria-label="${L2("cells doubling", "কোষের সংখ্যা দ্বিগুণ হচ্ছে")}">`;
      if (n <= 6) {
        const cols = [1, 2, 2, 4, 4, 8, 8][n], rows = N / cols, s = Math.min(340 / cols, 168 / rows), r = Math.min(s * 0.43, 36);
        const x0 = 180 - (cols - 1) * s / 2, y0 = 92 - (rows - 1) * s / 2;
        for (let i = 0; i < N; i++) { const x = x0 + (i % cols) * s, y = y0 + Math.floor(i / cols) * s; g += `<circle cx="${f3(x)}" cy="${f3(y)}" r="${f3(r)}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="${r > 12 ? 2 : 1.4}"/><circle cx="${f3(x)}" cy="${f3(y)}" r="${f3(r * 0.32)}" fill="var(--c)"/>`; }
      } else {
        const k = (n - 6) / 40, w = 96 + k * 244, h = 60 + k * 78;
        g += `<defs><pattern id="b3dpat" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="3.2" fill="var(--c-soft)" stroke="var(--c)" stroke-width="1"/><circle cx="4.5" cy="4.5" r="1" fill="var(--c)"/></pattern></defs>
          <rect x="${f3(180 - w / 2)}" y="${f3(78 - h / 2)}" width="${f3(w)}" height="${f3(h)}" rx="${f3(h * 0.42)}" fill="url(#b3dpat)" stroke="var(--c)" stroke-width="2"/>
          <text x="180" y="172" text-anchor="middle" font-size="14" fill="var(--muted)">${L2("far too many cells to draw one by one", "এত কোষ আর একটি একটি করে আঁকা যায় না")}</text>`;
      }
      $("#b3dsv", el).innerHTML = g + `</svg>`;
      const note = n === 0 ? L2("One cell: for you, this was the zygote (fertilised egg).", "একটি কোষ: তোমার বেলায় এটি ছিল জাইগোট (নিষিক্ত ডিম্বাণু)।")
        : n <= 6 ? L2("Every cell divided once more, so the number doubled.", "প্রতিটি কোষ আরও একবার ভাগ হলো, তাই সংখ্যা দ্বিগুণ হলো।")
        : n < 10 ? L2("Hundreds of cells already.", "এর মধ্যেই শত শত কোষ।")
        : n < 20 ? L2("More than a thousand cells.", "হাজারের বেশি কোষ।")
        : n < 30 ? L2("More than a million (10 lakh) cells.", "১০ লক্ষের (এক মিলিয়নের) বেশি কোষ।")
        : n < 40 ? L2("More than a billion (100 crore) cells.", "১০০ কোটির (এক বিলিয়নের) বেশি কোষ।")
        : n < 45 ? L2("More than a trillion (1 lakh crore) cells, but still fewer than a human body has.", "১ লক্ষ কোটির (এক ট্রিলিয়নের) বেশি কোষ, তবে এখনো মানবদেহের কোষসংখ্যার চেয়ে কম।")
        : L2("More than 30 trillion: about as many cells as a whole human body, after only 45 doublings!", "৩০ ট্রিলিয়নের (৩০ লক্ষ কোটির) বেশি: মাত্র ৪৫ বার দ্বিগুণ হয়েই গোটা মানবদেহের সমান কোষ!");
      $("#b3do", el).innerHTML = `<b>${L2(`After ${n} ${n === 1 ? "division" : "divisions"}`, `${B3(n)} বার বিভাজনের পর`)}:</b> ${B3(2)}<sup>${B3(n)}</sup> = <b>${grp3(N)}</b>${L2(N === 1 ? " cell" : " cells", "টি কোষ")}<br><span class="muted">${note}</span>`;
      $("#b3dgo", el).disabled = n >= 46;
    };
    $("#b3dn", el).addEventListener("input", draw);
    $("#b3dgo", el).addEventListener("click", () => { const s = $("#b3dn", el); s.value = Math.min(46, +s.value + 1); draw(); });
    $("#b3drs", el).addEventListener("click", () => { $("#b3dn", el).value = 0; draw(); });
    draw();
  };
  /* ---------- tab 2: mitosis or meiosis? ---------- */
  const IT = [
    [L2("A cut on your finger heals with new skin.", "তোমার আঙুলের কাটা জায়গা নতুন চামড়ায় ভরে গেল।"), "mi", L2("New body cells exactly like the old ones are needed.", "আগের মতোই হুবহু নতুন দেহকোষ দরকার।")],
    [L2("Pollen grains are being made in the anther of a pumpkin flower.", "মিষ্টিকুমড়া ফুলের পরাগধানীতে পরাগরেণু তৈরি হচ্ছে।"), "me", L2("Pollen mother cells (2n) divide by meiosis to give haploid (n) cells.", "পরাগ মাতৃকোষ (2n) মিয়োসিসে ভাগ হয়ে হ্যাপ্লয়েড (n) কোষ তৈরি করে।")],
    [L2("The root tip of a paddy seedling grows longer.", "ধানের চারার মূলের আগা লম্বা হচ্ছে।"), "mi", L2("Meristem cells at the root tip keep dividing by mitosis.", "মূলের আগার ভাজক টিস্যুর কোষ মাইটোসিসে ভাগ হতে থাকে।")],
    [L2("Sperm are being formed in the testis of a bull.", "ষাঁড়ের শুক্রাশয়ে শুক্রাণু তৈরি হচ্ছে।"), "me", L2("Gametes must carry half the chromosome number.", "জননকোষে ক্রোমোজোম সংখ্যা অর্ধেক হওয়া চাই।")],
    [L2("An <i>Amoeba</i> splits into two <i>Amoeba</i>.", "একটি অ্যামিবা ভাগ হয়ে দুটি অ্যামিবা হলো।"), "mi", L2("A unicellular eukaryote reproduces asexually; its nucleus divides by mitosis, so both are identical.", "এককোষী প্রকৃতকোষী জীবের অযৌন জনন; এর নিউক্লিয়াস মাইটোসিসে ভাগ হয়, তাই দুটিই হুবহু এক।")],
    [L2("A zygote becomes an embryo of many cells.", "একটি জাইগোট থেকে বহু কোষের ভ্রূণ তৈরি হচ্ছে।"), "mi", L2("The zygote divides again and again by mitosis; every cell keeps the full 2n set.", "জাইগোট বারবার মাইটোসিসে ভাগ হয়; প্রতিটি কোষে পুরো 2n সেট থাকে।")],
    [L2("An egg cell (ovum) forms in the ovary of a hen.", "মুরগির ডিম্বাশয়ে ডিম্বাণু তৈরি হচ্ছে।"), "me", L2("An ovum is a gamete, so it is made by meiosis and is haploid.", "ডিম্বাণু একটি জননকোষ, তাই মিয়োসিসে তৈরি হয় এবং হ্যাপ্লয়েড।")],
    [L2("A tiktiki (house lizard) regrows its lost tail.", "টিকটিকির খসে পড়া লেজ আবার গজাচ্ছে।"), "mi", L2("Regrowing a body part needs many new body cells.", "দেহের অংশ আবার গজাতে অনেক নতুন দেহকোষ লাগে।")],
    [L2("Spores form inside the capsule of a moss plant.", "মস উদ্ভিদের ক্যাপসুলের ভেতরে রেণু তৈরি হচ্ছে।"), "me", L2("Diploid spore mother cells divide by meiosis to give haploid spores.", "ডিপ্লয়েড রেণু মাতৃকোষ মিয়োসিসে ভাগ হয়ে হ্যাপ্লয়েড রেণু তৈরি করে।")],
    [L2("Worn-out red blood cells are replaced by new ones made in the bone marrow.", "ক্ষয়ে যাওয়া লোহিত রক্তকণিকার জায়গায় অস্থিমজ্জায় নতুন কণিকা তৈরি হচ্ছে।"), "mi", L2("Cells with a fixed lifespan are replaced through mitosis.", "নির্দিষ্ট আয়ুর কোষগুলোর জায়গা পূরণ হয় মাইটোসিসের মাধ্যমে।")],
    [L2("A new plant sprouts from the 'eye' of a potato.", "আলুর 'চোখ' থেকে নতুন গাছ গজাচ্ছে।"), "mi", L2("Vegetative reproduction: no gametes, only mitosis, so the new plant is a copy of the parent.", "অঙ্গজ জনন: জননকোষ লাগে না, শুধু মাইটোসিস; তাই নতুন গাছ মাতৃগাছের হুবহু প্রতিরূপ।")]];
  const quiz = () => {
    let k = 0, right = 0, answered = false;
    const show = () => {
      if (k >= IT.length) {
        body.innerHTML = `<div class="w-out"><b>${L2("Finished!", "শেষ!")}</b> ${L2(`You got ${right} out of ${IT.length} right.`, `${B3(IT.length)}টির মধ্যে ${B3(right)}টি ঠিক হয়েছে।`)}<br>${L2("Rule of thumb: <b>growth, repair, asexual reproduction → mitosis</b>; <b>making gametes or spores → meiosis</b>.", "সহজ নিয়ম: <b>বৃদ্ধি, ক্ষত পূরণ, অযৌন জনন → মাইটোসিস</b>; <b>জননকোষ বা রেণু তৈরি → মিয়োসিস</b>।")}</div><div class="w-row" style="margin-top:10px"><button class="btn solid" id="b3qre">${L2("Play again", "আবার খেলো")}</button></div>`;
        $("#b3qre", el).addEventListener("click", quiz); return;
      }
      const t = IT[k]; answered = false;
      body.innerHTML = `<p class="hint" style="margin:0 0 6px">${L2(`Situation ${k + 1} of ${IT.length}`, `ঘটনা ${B3(k + 1)} / ${B3(IT.length)}`)} · ${L2(`${right} right so far`, `এ পর্যন্ত ${B3(right)}টি ঠিক`)}</p>
        <div class="w-out" style="font-size:17px">${t[0]}</div>
        <div class="w-row" style="margin:10px 0"><button class="btn" data-a="mi">${L2("Mitosis", "মাইটোসিস")}</button><button class="btn" data-a="me">${L2("Meiosis", "মিয়োসিস")}</button></div>
        <div id="b3qf" class="hint">${L2("Which kind of cell division is at work here?", "এখানে কোন ধরনের কোষ বিভাজন কাজ করছে?")}</div>`;
      body.querySelectorAll("button[data-a]").forEach(b => b.addEventListener("click", () => {
        if (answered) return; answered = true;
        const good = b.dataset.a === t[1]; if (good) right++;
        body.querySelectorAll("button[data-a]").forEach(x => { x.disabled = true; if (x.dataset.a === t[1]) x.classList.add("solid"); });
        $("#b3qf", el).innerHTML = `<div class="w-out">${ok3(good, `<b>${t[1] === "mi" ? L2("Mitosis.", "মাইটোসিস।") : L2("Meiosis.", "মিয়োসিস।")}</b> ${t[2]}`)}</div><div class="w-row" style="margin-top:10px"><button class="btn solid" id="b3qn">${k + 1 < IT.length ? L2("Next", "পরেরটি") : L2("See result", "ফলাফল দেখো")} →</button></div>`;
        $("#b3qn", el).addEventListener("click", () => { k++; show(); });
      }));
    };
    show();
  };
  chips3(el, ".b3dt", b => (b.dataset.t === "d" ? doubling : quiz)());
  doubling();
};

/* 3.2 mitosis: animated step-through (plant / animal cell) + chromosome shapes by centromere position */
W.b3mitosis = (el) => {
  const ST = [
    [L2("Interphase", "ইন্টারফেজ"), L2("Interphase: getting ready", "ইন্টারফেজ: প্রস্তুতি")],
    [L2("Prophase", "প্রোফেজ"), L2("(a) Prophase", "(ক) প্রোফেজ")],
    [L2("Prometaphase", "প্রো-মেটাফেজ"), L2("(b) Prometaphase", "(খ) প্রো-মেটাফেজ")],
    [L2("Metaphase", "মেটাফেজ"), L2("(c) Metaphase", "(গ) মেটাফেজ")],
    [L2("Anaphase", "অ্যানাফেজ"), L2("(d) Anaphase", "(ঘ) অ্যানাফেজ")],
    [L2("Telophase", "টেলোফেজ"), L2("(e) Telophase + cytokinesis", "(ঙ) টেলোফেজ + সাইটোকাইনেসিস")],
    [L2("2 cells", "২টি কোষ"), L2("Two daughter cells", "দুটি অপত্য কোষ")]];
  /* what happens in each stage: [common points], plant extra, animal extra, chromosome count line */
  const TXT = [
    [[L2("Not a stage of mitosis itself: the cell is preparing.", "এটি মাইটোসিসের নিজের কোনো পর্যায় নয়: কোষ প্রস্তুতি নিচ্ছে।"), L2("The cell grows and copies its DNA, so every chromosome now has two identical halves.", "কোষ বড় হয় এবং DNA-র অনুলিপি তৈরি করে, তাই প্রতিটি ক্রোমোজোমে এখন দুটি হুবহু একই অংশ।"), L2("Chromosomes are long, thin threads (chromatin); they cannot be seen one by one.", "ক্রোমোজোমগুলো লম্বা, সরু সুতার মতো (ক্রোমাটিন); আলাদা করে দেখা যায় না।")],
      "", L2("Animal cell: a pair of centrioles lies near the nucleus.", "প্রাণিকোষ: নিউক্লিয়াসের কাছে এক জোড়া সেন্ট্রিওল থাকে।"), L2("4 chromosomes, hidden as thin threads", "৪টি ক্রোমোজোম, সরু সুতার মতো ছড়িয়ে আছে")],
    [[L2("The nucleus becomes a little larger.", "নিউক্লিয়াস আকারে একটু বড় হয়।"), L2("Chromosomes coil up: shorter, thicker and now visible under a compound microscope.", "ক্রোমোজোম কুণ্ডলী পাকিয়ে খাটো ও মোটা হয়; এখন যৌগিক অণুবীক্ষণযন্ত্রে দেখা যায়।"), L2("Each chromosome shows two chromatids joined at the centromere.", "প্রতিটি ক্রোমোজোমে দেখা যায় দুটি ক্রোমাটিড, সেন্ট্রোমিয়ারে যুক্ত।"), L2("They are still tangled, so they are hard to count.", "এরা তখনো জড়াজড়ি করে থাকে, তাই গোনা কঠিন।")],
      "", L2("Animal cell: the two centrioles move apart, with aster rays around them.", "প্রাণিকোষ: সেন্ট্রিওল দুটি দূরে সরতে থাকে, চারপাশে অ্যাস্টার-রে।"), L2("4 chromosomes = 8 chromatids", "৪টি ক্রোমোজোম = ৮টি ক্রোমাটিড")],
    [[L2("A spindle apparatus with two poles is built from protein fibres.", "তন্তুময় প্রোটিন দিয়ে দুই মেরুবিশিষ্ট স্পিন্ডল যন্ত্র তৈরি হয়।"), L2("Centromeres attach to traction (chromosomal) fibres.", "সেন্ট্রোমিয়ার আকর্ষণ তন্তুর (ক্রোমোজোমাল তন্তু) সাথে যুক্ত হয়।"), L2("Chromosomes start moving towards the equator.", "ক্রোমোজোমগুলো বিষুবীয় অঞ্চলের দিকে যেতে থাকে।"), L2("Nuclear membrane and nucleolus start to disappear.", "নিউক্লিয়ার মেমব্রেন ও নিউক্লিওলাস বিলুপ্ত হতে থাকে।")],
      L2("Plant cell: no centrioles and no aster rays.", "উদ্ভিদকোষ: সেন্ট্রিওল বা অ্যাস্টার-রে নেই।"), L2("Animal cell: the centrioles sit at the two poles, with aster rays.", "প্রাণিকোষ: সেন্ট্রিওল দুটি দুই মেরুতে, চারদিকে অ্যাস্টার-রে।"), L2("4 chromosomes = 8 chromatids", "৪টি ক্রোমোজোম = ৮টি ক্রোমাটিড")],
    [[L2("All chromosomes line up at the equator: centromeres on the equator, arms towards the poles.", "সব ক্রোমোজোম বিষুবীয় অঞ্চলে সারি বাঁধে: সেন্ট্রোমিয়ার বিষুবীয় অঞ্চলে, বাহু মেরুর দিকে।"), L2("Chromosomes are shortest and thickest: the best stage to count them.", "ক্রোমোজোম সবচেয়ে খাটো ও মোটা: গোনার সেরা সময়।"), L2("Nuclear membrane and nucleolus are completely gone.", "নিউক্লিয়ার মেমব্রেন ও নিউক্লিওলাস পুরোপুরি বিলুপ্ত।"), L2("At the end, the centromeres begin to divide.", "শেষ দিকে সেন্ট্রোমিয়ারের বিভাজন শুরু হয়।")],
      "", "", L2("4 chromosomes = 8 chromatids (easy to count now)", "৪টি ক্রোমোজোম = ৮টি ক্রোমাটিড (এখন সহজে গোনা যায়)")],
    [[L2("Each centromere has divided, so the two chromatids separate. Each is now a daughter chromosome.", "প্রতিটি সেন্ট্রোমিয়ার দুই ভাগ হয়েছে, তাই ক্রোমাটিড দুটি আলাদা। প্রতিটি এখন একটি অপত্য ক্রোমোজোম।"), L2("Half of them move to one pole and half to the other.", "অর্ধেক যায় এক মেরুতে, বাকি অর্ধেক অন্য মেরুতে।"), L2("The centromere leads and the arms trail behind, giving V, L, J or I shapes.", "সেন্ট্রোমিয়ার আগে চলে, বাহু পেছনে; তাই V, L, J বা I আকৃতি দেখা যায়।")],
      "", "", L2("4 daughter chromosomes travel to each pole", "প্রতিটি মেরুর দিকে যাচ্ছে ৪টি অপত্য ক্রোমোজোম")],
    [[L2("The reverse of prophase: chromosomes become thin and long again.", "প্রোফেজের উল্টো: ক্রোমোজোম আবার সরু ও লম্বা হয়।"), L2("Nucleolus and nuclear membrane reappear: two daughter nuclei.", "নিউক্লিওলাস ও নিউক্লিয়ার মেমব্রেন ফিরে আসে: দুটি অপত্য নিউক্লিয়াস।"), L2("Spindle fibres disappear.", "স্পিন্ডল তন্তু অদৃশ্য হয়ে যায়।")],
      L2("Cytokinesis in a plant cell: a cell plate forms at the equator and grows outwards into a new wall.", "উদ্ভিদকোষে সাইটোকাইনেসিস: বিষুবীয় তলে কোষপ্লেট তৈরি হয়ে বাইরের দিকে বেড়ে নতুন প্রাচীর হয়।"), L2("Cytokinesis in an animal cell: the cell membrane folds inwards at the equator and pinches the cell in two.", "প্রাণিকোষে সাইটোকাইনেসিস: বিষুবীয় অঞ্চলে কোষঝিল্লি ভেতরের দিকে খাঁজ তৈরি করে কোষকে দুই ভাগ করে।"), L2("4 chromosomes in each new nucleus", "প্রতিটি নতুন নিউক্লিয়াসে ৪টি ক্রোমোজোম")],
    [[L2("Two daughter cells, each with the same number and kind of chromosomes as the mother cell.", "দুটি অপত্য কোষ; প্রতিটিতে মাতৃকোষের সমান সংখ্যক ও একই রকম ক্রোমোজোম।"), L2("They enter interphase, grow, and can divide again.", "এরা ইন্টারফেজে ঢোকে, বড় হয় এবং আবার ভাগ হতে পারে।")],
      "", "", L2("mother cell 4 → each daughter cell 4", "মাতৃকোষে ৪ → প্রতিটি অপত্য কোষে ৪")]];
  /* keyframes: env nuclear membrane, nuc nucleolus, chr chromatin, sp spindle, as aster rays, co chromosomes, w width, L length,
     dn daughter membranes, dch daughter chromatin, dnu daughter nucleoli, fur furrow / cell plate, px,py pole (centriole) offset */
  const G = [
    { env: 1, nuc: 1, chr: 1, sp: 0, as: 0, co: 0, w: 2.4, L: 1.2, dn: 0, dch: 0, dnu: 0, fur: 0, px: 5, py: 56 },
    { env: 1, nuc: .8, chr: 0, sp: 0, as: 1, co: 1, w: 3.2, L: 1.15, dn: 0, dch: 0, dnu: 0, fur: 0, px: 44, py: 60 },
    { env: .55, nuc: .35, chr: 0, sp: .6, as: 1, co: 1, w: 4, L: 1.06, dn: 0, dch: 0, dnu: 0, fur: 0, px: 128, py: 122 },
    { env: 0, nuc: 0, chr: 0, sp: 1, as: 1, co: 1, w: 4.8, L: 1, dn: 0, dch: 0, dnu: 0, fur: 0, px: 128, py: 122 },
    { env: 0, nuc: 0, chr: 0, sp: 1, as: 1, co: 1, w: 4.4, L: 1, dn: 0, dch: 0, dnu: 0, fur: .3, px: 128, py: 122 },
    { env: 0, nuc: 0, chr: 0, sp: .3, as: .6, co: .6, w: 2.8, L: 1.12, dn: .9, dch: .4, dnu: .7, fur: .9, px: 128, py: 122 },
    { env: 0, nuc: 0, chr: 0, sp: 0, as: .5, co: 0, w: 2, L: 1.15, dn: 1, dch: 1, dnu: 1, fur: 1, px: 128, py: 122 }];
  /* chromosomes: colour, length, centromere position (fraction from one end) */
  const CH = [[CP3, 40, .5], [CM3, 40, .5], [CP3, 26, .22], [CM3, 26, .22]];
  /* per stage, per chromosome: x, y, rotation°, half-gap between the sister centromeres, arm tilt° (+ = X look, − = arms trail) */
  const K1 = [[158, 112, 20, 2.6, 10], [204, 128, -25, 2.6, 10], [176, 150, -100, 2.4, 8], [184, 92, -80, 2.4, 8]];
  const K = [K1, K1,
    [[168, 104, 10, 2.8, 12], [193, 138, -10, 2.8, 12], [178, 166, -45, 2.6, 10], [183, 70, -35, 2.6, 10]],
    [[180, 100, 0, 3.2, 14], [180, 146, 0, 3.2, 14], [180, 178, 0, 3, 12], [180, 52, 0, 3, 12]],
    [[180, 104.4, 0, 78, -55], [180, 141.2, 0, 78, -55], [180, 166.8, 0, 78, -55], [180, 66, 0, 78, -55]],
    [[180, 112, 0, 78, -40], [180, 133, 0, 78, -40], [180, 147, 0, 78, -40], [180, 90.5, 0, 78, -40]],
    [[180, 112, 0, 78, -40], [180, 133, 0, 78, -40], [180, 147, 0, 78, -40], [180, 90.5, 0, 78, -40]]];
  const scrib = (cx, cy, R, seed) => {
    let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280; const P = [];
    for (let i = 0; i < 26; i++) { const a = rnd() * 6.283, r = R * Math.sqrt(rnd()); P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    let d = `M${f3(P[0][0])},${f3(P[0][1])}`;
    for (let i = 1; i < P.length - 1; i++) d += ` Q${f3(P[i][0])},${f3(P[i][1])} ${f3((P[i][0] + P[i + 1][0]) / 2)},${f3((P[i][1] + P[i + 1][1]) / 2)}`;
    return d;
  };
  const SC0 = scrib(180, 122, 50, 7), SCL = scrib(102, 122, 32, 11), SCR = scrib(258, 122, 32, 23);
  let tab = "s", plant = true, pos = 0, tgt = 0, spd = 1, playing = false, hold = 0;
  el.innerHTML = `<div class="chipset b3mt" role="group"><button data-t="s" aria-pressed="true">${L2("Stages of mitosis", "মাইটোসিসের পর্যায়")}</button><button data-t="c" aria-pressed="false">${L2("Chromosome shapes", "ক্রোমোজোমের আকৃতি")}</button></div><div id="b3mbody" style="margin-top:10px"></div>`;
  const body = $("#b3mbody", el);
  const lerp = (a, b, f) => a + (b - a) * f;
  /* labels shown when the picture is at rest: [text, anchor, tx, row(0 top / 1 bottom), px, py] */
  const labels = (s) => {
    const T = 0, Bm = 1;
    switch (s) {
      case 0: return [[L2("Nuclear membrane", "নিউক্লিয়ার মেমব্রেন"), "start", 4, T, 143, 86], plant ? [L2("Cell wall", "কোষপ্রাচীর"), "end", 356, T, 329, 50] : [L2("Centrioles", "সেন্ট্রিওল"), "end", 356, T, 187, 55],
        [L2("Chromatin threads", "ক্রোমাটিন তন্তু"), "start", 4, Bm, 166, 146], [L2("Nucleolus", "নিউক্লিওলাস"), "end", 356, Bm, 188, 126]];
      case 1: return [[L2("Chromosome", "ক্রোমোজোম"), "start", 4, T, 163, 96], plant ? [L2("Nuclear membrane", "নিউক্লিয়ার মেমব্রেন"), "end", 356, T, 218, 86] : [L2("Aster rays", "অ্যাস্টার-রে"), "end", 356, T, 229, 58],
        [L2("2 chromatids", "২টি ক্রোমাটিড"), "start", 4, Bm, 150, 136], [L2("Centromere", "সেন্ট্রোমিয়ার"), "end", 356, Bm, 206, 130]];
      case 2: return [[L2("Spindle fibres", "স্পিন্ডল তন্তু"), "start", 4, T, 129, 97], [L2("Pole", "মেরু"), "end", 356, T, 306, 117],
        [L2("Membrane disappearing", "মেমব্রেন বিলুপ্ত হচ্ছে"), "start", 4, Bm, 143, 160], [L2("Equator", "বিষুবীয় অঞ্চল"), "end", 356, Bm, 182, 206]];
      case 3: return [[L2("Chromosomes on the equator", "বিষুবীয় অঞ্চলে ক্রোমোজোম"), "start", 4, T, 176, 46], [L2("Pole", "মেরু"), "end", 356, T, 306, 117],
        [L2("Traction fibre", "আকর্ষণ তন্তু"), "start", 4, Bm, 112, 151], [L2("Centromere", "সেন্ট্রোমিয়ার"), "end", 356, Bm, 184, 180]];
      case 4: return [[L2("Daughter chromosomes", "অপত্য ক্রোমোজোম"), "start", 4, T, 103, 100], [L2("Centromere leads", "সেন্ট্রোমিয়ার আগে চলে"), "end", 356, T, 259, 63],
        [L2("V shape", "V আকৃতি"), "start", 4, Bm, 110, 147], [L2("J shape", "J আকৃতি"), "end", 356, Bm, 252, 171]];
      case 5: return [[L2("New nuclear membrane", "নতুন নিউক্লিয়ার মেমব্রেন"), "start", 4, T, 86, 92], [L2("Spindle fading", "স্পিন্ডল মিলিয়ে যাচ্ছে"), "end", 356, T, 196, 94],
        plant ? [L2("Cell plate", "কোষপ্লেট"), "start", 4, Bm, 178, 168] : [L2("Furrow", "খাঁজ"), "start", 4, Bm, 177, 166], [L2("Nucleolus is back", "নিউক্লিওলাস ফিরেছে"), "end", 356, Bm, 264, 128]];
      default: return [[L2("Daughter cell", "অপত্য কোষ"), "start", 4, T, 66, 66], [L2("Daughter cell", "অপত্য কোষ"), "end", 356, T, 294, 66]];
    }
  };
  const drawCell = () => {
    const holder = $("#b3msv", el); if (!holder) return;
    let i = Math.floor(pos), f = pos - i; if (i >= 6) { i = 5; f = 1; }
    f = f * f * (3 - 2 * f);
    const A = G[i], Bq = G[i + 1], g = {}; for (const k in A) g[k] = lerp(A[k], Bq[k], f);
    const cx = 180, cy = 122, PL = [cx - g.px, g.py], PR = [cx + g.px, g.py];
    let s = `<svg viewBox="0 0 360 252" role="img" aria-label="${L2("a cell dividing by mitosis", "মাইটোসিসে বিভাজনরত একটি কোষ")}">`;
    /* cell outline */
    if (plant) {
      s += `<rect x="30" y="30" width="300" height="184" rx="9" fill="var(--c-soft)" stroke="var(--c)" stroke-width="5"/><rect x="35.5" y="35.5" width="289" height="173" rx="6" fill="none" stroke="var(--c)" stroke-width="1" opacity=".6"/>`;
      if (g.fur > 0.34) { const h = Math.min(1, (g.fur - 0.34) / 0.66) * 92, full = g.fur > 0.97; s += `<line x1="180" y1="${f3(cy - h)}" x2="180" y2="${f3(cy + h)}" stroke="var(--c)" stroke-width="${full ? 5 : 3.4}" ${full ? "" : 'stroke-dasharray="5 4" stroke-linecap="round"'}/>`; }
    } else {
      const off = 78 * g.fur, rx = 150 - off, ry = 92 - 6 * g.fur;
      s += `<ellipse cx="${f3(cx - off)}" cy="${cy}" rx="${f3(rx)}" ry="${f3(ry)}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2.4"/><ellipse cx="${f3(cx + off)}" cy="${cy}" rx="${f3(rx)}" ry="${f3(ry)}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2.4"/>`;
      if (g.fur < 0.985) s += `<ellipse cx="${f3(cx - off)}" cy="${cy}" rx="${f3(rx - 1.3)}" ry="${f3(ry - 1.3)}" fill="var(--c-soft)"/><ellipse cx="${f3(cx + off)}" cy="${cy}" rx="${f3(rx - 1.3)}" ry="${f3(ry - 1.3)}" fill="var(--c-soft)"/>`;
    }
    /* equator guide */
    if (g.sp > 0.5 && g.fur < 0.5) s += `<line x1="180" y1="36" x2="180" y2="208" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 5" opacity="${f3(Math.min(1, g.sp) * 0.7)}"/>`;
    /* mother nucleus */
    if (g.env > 0.02) s += `<circle cx="${cx}" cy="${cy}" r="${f3(52 + 3 * Math.max(0, 1 - Math.abs(pos - 1)))}" fill="var(--sheet)" fill-opacity="${f3(g.env * 0.75)}" stroke="var(--ink)" stroke-width="1.8" opacity="${f3(g.env)}" ${g.env < 0.95 ? 'stroke-dasharray="7 6"' : ""}/>`;
    if (g.chr > 0.02) s += `<path d="${SC0}" fill="none" stroke="var(--muted)" stroke-width="1.6" opacity="${f3(g.chr)}"/>`;
    if (g.nuc > 0.02) s += `<circle cx="181" cy="120" r="8" fill="var(--muted)" opacity="${f3(g.nuc)}"/>`;
    /* daughter nuclei */
    if (g.dn > 0.02) [102, 258].forEach((x, q) => {
      s += `<circle cx="${x}" cy="${cy}" r="34" fill="var(--sheet)" fill-opacity="${f3(g.dn * 0.75)}" stroke="var(--ink)" stroke-width="1.8" opacity="${f3(g.dn)}" ${g.dn < 0.95 ? 'stroke-dasharray="7 6"' : ""}/>`;
      if (g.dch > 0.02) s += `<path d="${q ? SCR : SCL}" fill="none" stroke="var(--muted)" stroke-width="1.5" opacity="${f3(g.dch)}"/>`;
      if (g.dnu > 0.02) s += `<circle cx="${x + 5}" cy="${cy + 4}" r="6" fill="var(--muted)" opacity="${f3(g.dnu)}"/>`;
    });
    /* chromatid geometry */
    const CT = [];
    CH.forEach((c, n) => {
      const a = K[i][n], b = K[i + 1][n], x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f), th = lerp(a[2], b[2], f) * Math.PI / 180, d = lerp(a[3], b[3], f), al = lerp(a[4], b[4], f) * Math.PI / 180;
      const rot = (px, py) => [px * Math.cos(th) - py * Math.sin(th), px * Math.sin(th) + py * Math.cos(th)];
      [-1, 1].forEach(side => {
        const o = rot(side * d, 0), C = [x + o[0], y + o[1]], u = rot(side * Math.sin(al), -Math.cos(al)), v = rot(side * Math.sin(al), Math.cos(al)), l1 = c[1] * g.L * c[2], l2 = c[1] * g.L * (1 - c[2]);
        CT.push({ col: c[0], C, U: [C[0] + u[0] * l1, C[1] + u[1] * l1], D: [C[0] + v[0] * l2, C[1] + v[1] * l2], side });
      });
    });
    /* spindle */
    if (g.sp > 0.02) {
      s += `<g fill="none" stroke="var(--muted)" stroke-width="1" opacity="${f3(g.sp * 0.85)}">`;
      [-84, -58, -30, 0, 30, 58, 84].forEach(k => { s += `<path d="M${f3(PL[0])},${f3(PL[1])} Q180,${f3(cy + k * 2 * (plant ? 1 : 1 - 0.7 * g.fur))} ${f3(PR[0])},${f3(PR[1])}" stroke-opacity=".75"/>`; });
      CT.forEach(t => { const P = t.side < 0 ? PL : PR; s += `<line x1="${f3(P[0])}" y1="${f3(P[1])}" x2="${f3(t.C[0])}" y2="${f3(t.C[1])}" stroke="var(--ink)" stroke-opacity=".7"/>`; });
      s += `</g>`;
    }
    /* centrioles + aster rays (animal cells only) */
    if (!plant) [PL, PR].forEach(P => {
      if (g.as > 0.02) { s += `<g stroke="var(--muted)" stroke-width="1" opacity="${f3(g.as)}">`; for (let q = 0; q < 10; q++) { const a = q * Math.PI / 5 + 0.3; s += `<line x1="${f3(P[0] + 4 * Math.cos(a))}" y1="${f3(P[1] + 4 * Math.sin(a))}" x2="${f3(P[0] + 13 * Math.cos(a))}" y2="${f3(P[1] + 13 * Math.sin(a))}"/>`; } s += `</g>`; }
      s += `<circle cx="${f3(P[0])}" cy="${f3(P[1])}" r="3.2" fill="var(--ink)"/>`;
    });
    /* chromosomes */
    if (g.co > 0.02) {
      s += `<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${f3(g.w)}" opacity="${f3(g.co)}">`;
      CT.forEach(t => { s += `<path d="M${f3(t.U[0])},${f3(t.U[1])} L${f3(t.C[0])},${f3(t.C[1])} L${f3(t.D[0])},${f3(t.D[1])}" stroke="${t.col}"/>`; });
      s += `</g><g opacity="${f3(g.co)}">`;
      CT.forEach(t => { s += `<circle cx="${f3(t.C[0])}" cy="${f3(t.C[1])}" r="${f3(Math.max(1.6, g.w * 0.42))}" fill="var(--ink)"/>`; });
      s += `</g>`;
    }
    /* labels at rest */
    if (pos === tgt) {
      labels(tgt).forEach(l => {
        const ty = l[3] ? 246 : 14, sx = l[1] === "start" ? l[2] + 14 : l[2] - 14, sy = l[3] ? 233 : 19;
        s += `<line x1="${sx}" y1="${sy}" x2="${l[4]}" y2="${l[5]}" stroke="var(--ink)" stroke-width="1" opacity=".75"/><circle cx="${l[4]}" cy="${l[5]}" r="2" fill="var(--ink)"/><text x="${l[2]}" y="${ty}" text-anchor="${l[1]}" font-size="14" fill="var(--ink)">${l[0]}</text>`;
      });
      if (tgt === 6) s += `<text x="180" y="246" text-anchor="middle" font-size="14" fill="var(--ink)">${L2("same chromosomes as the mother cell", "মাতৃকোষের মতো একই ক্রোমোজোম")}</text>`;
    }
    holder.innerHTML = s + `</svg>`;
  };
  const info = () => {
    const o = $("#b3mo", el); if (!o) return;
    const t = TXT[tgt], extra = plant ? t[1] : t[2];
    o.innerHTML = `<b>${ST[tgt][1]}</b><ul style="margin:4px 0 6px;padding-left:1.2em">${t[0].map(x => `<li>${x}</li>`).join("")}${extra ? `<li><i>${extra}</i></li>` : ""}</ul><span class="muted">${L2("In this cell", "এই কোষে")} (2n = ${B3(4)}): ${t[3]}</span>`;
    el.querySelectorAll(".b3ms button").forEach((b, n) => b.setAttribute("aria-pressed", n === tgt));
    $("#b3mprev", el).disabled = tgt === 0; $("#b3mnext", el).disabled = tgt === 6;
    const pb = $("#b3mplay", el); if (pb) pb.textContent = playing ? L2("❚❚ Pause", "❚❚ থামাও") : L2("▶ Play all", "▶ পুরোটা চালাও");
  };
  const go = (n) => { tgt = Math.max(0, Math.min(6, n)); hold = 0; if (REDUCED) { pos = tgt; } else spd = Math.max(1, Math.abs(tgt - pos)); info(); drawCell(); };
  const stages = () => {
    body.innerHTML = `<div class="chipset b3mk" role="group"><button data-p="1" aria-pressed="${plant}">${L2("Plant cell", "উদ্ভিদকোষ")}</button><button data-p="0" aria-pressed="${!plant}">${L2("Animal cell", "প্রাণিকোষ")}</button></div>
      <div class="chipset b3ms" role="group" style="margin-top:8px">${ST.map((x, n) => `<button data-n="${n}" aria-pressed="${n === tgt}">${x[0]}</button>`).join("")}</div>
      <div class="svgwrap fit" id="b3msv" style="margin-top:6px"></div>
      <div class="w-row" style="margin:6px 0 10px"><button class="btn" id="b3mprev">← ${L2("Back", "আগের")}</button><button class="btn solid" id="b3mnext">${L2("Next", "পরের")} →</button>${REDUCED ? "" : `<button class="btn" id="b3mplay"></button>`}</div>
      <div class="w-out" id="b3mo"></div>${legend3()}`;
    chips3(el, ".b3mk", b => { plant = b.dataset.p === "1"; info(); drawCell(); });
    el.querySelectorAll(".b3ms button").forEach(b => b.addEventListener("click", () => { playing = false; go(+b.dataset.n); }));
    $("#b3mprev", el).addEventListener("click", () => { playing = false; go(tgt - 1); });
    $("#b3mnext", el).addEventListener("click", () => { playing = false; go(tgt + 1); });
    const pb = $("#b3mplay", el);
    if (pb) pb.addEventListener("click", () => { if (playing) { playing = false; info(); return; } playing = true; hold = 0; if (tgt >= 6) { pos = 0; go(0); } else info(); });
    info(); drawCell();
  };
  /* ---------- tab 2: centromere position → shape ---------- */
  const shapes = () => {
    const PRE = [["V", 50], ["L", 36], ["J", 14], ["I", 0]];
    body.innerHTML = `<div class="chipset b3mc" role="group">${PRE.map(p => `<button data-v="${p[1]}" aria-pressed="${p[1] === 50}">${p[0]}</button>`).join("")}</div>
      ${slider("b3mp", L2("Centromere position (distance from the nearer end, % of length)", "সেন্ট্রোমিয়ারের অবস্থান (কাছের প্রান্ত থেকে দূরত্ব, দৈর্ঘ্যের %)"), 0, 50, 1, 50, "%")}
      <div class="svgwrap fit" id="b3mcs"></div><div class="w-out" id="b3mco"></div>
      <p class="hint" style="margin-top:6px">${L2("Class activity: tie two equal pieces of rope together with a knot (the centromere). Move the knot to make the four models, then cut through the knot to see the anaphase shapes.", "শ্রেণির কাজ: সমান দুই টুকরো দড়ি একটি গিঁট (সেন্ট্রোমিয়ার) দিয়ে বাঁধো। গিঁট সরিয়ে চার রকম মডেল বানাও, তারপর গিঁট বরাবর কেটে অ্যানাফেজের আকৃতি দেখো।")}</p>`;
    const draw = () => {
      const pc = sv(el, "b3mp", "%", 0), p = pc / 100;
      const ty = pc >= 46 ? 0 : pc >= 30 ? 1 : pc >= 4 ? 2 : 3;
      const NM = [L2("Metacentric", "মেটাসেন্ট্রিক"), L2("Submetacentric", "সাবমেটাসেন্ট্রিক"), L2("Acrocentric", "অ্যাক্রোসেন্ট্রিক"), L2("Telocentric", "টেলোসেন্ট্রিক")][ty];
      const WH = [L2("centromere in the middle: two equal arms", "সেন্ট্রোমিয়ার ঠিক মাঝখানে: দুই বাহু সমান"), L2("centromere a little away from the middle: arms unequal", "সেন্ট্রোমিয়ার মাঝখান থেকে একটু সরে: বাহু অসমান"), L2("centromere very near one end: one very short arm", "সেন্ট্রোমিয়ার এক প্রান্তের খুব কাছে: একটি বাহু খুব ছোট"), L2("centromere right at the end: only one arm", "সেন্ট্রোমিয়ার একদম প্রান্তে: একটিই বাহু")][ty];
      const LT = "VLJI"[ty], Lc = 124, top = 44, yc = top + (1 - p) * Lc;     /* nearer end drawn at the bottom */
      let s = `<svg viewBox="0 0 360 214" role="img" aria-label="${L2("chromosome shape and centromere position", "ক্রোমোজোমের আকৃতি ও সেন্ট্রোমিয়ারের অবস্থান")}">
        <text x="88" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">${L2("Metaphase", "মেটাফেজ")}</text><text x="88" y="34" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("2 chromatids", "২টি ক্রোমাটিড")}</text>
        <text x="272" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">${L2("Anaphase", "অ্যানাফেজ")}</text><text x="272" y="34" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("1 daughter chromosome", "১টি অপত্য ক্রোমোজোম")}</text>
        <line x1="180" y1="8" x2="180" y2="206" stroke="var(--rule)" stroke-width="1.5"/>`;
      /* metaphase: two chromatids held at the centromere */
      const up = (1 - p) * Lc, dn = p * Lc, sp1 = 3 + up * 0.11, sp2 = 3 + dn * 0.11;
      [-1, 1].forEach(sd => { s += `<path d="M${f3(64 + sd * (3 + sp1))},${top} L${64 + sd * 3},${f3(yc)} L${f3(64 + sd * (3 + sp2))},${top + Lc}" fill="none" stroke="${CP3}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`; });
      s += `<circle cx="64" cy="${f3(yc)}" r="5" fill="var(--ink)"/><line x1="72" y1="${f3(yc)}" x2="86" y2="${f3(yc)}" stroke="var(--ink)" stroke-width="1"/><text x="89" y="${f3(yc + 4.5)}" font-size="13.5" fill="var(--ink)">${L2("centromere", "সেন্ট্রোমিয়ার")}</text>`;
      /* anaphase: centromere pulled towards the pole (downwards), arms trail behind */
      const cxA = 262, cyA = 166, k = 0.82, a1 = dn * k, a2 = up * k, t1 = 26 * Math.PI / 180, t2 = 26 * Math.min(1, p / 0.3) * Math.PI / 180;
      s += `<path d="${a1 > 0.5 ? `M${f3(cxA - Math.sin(t1) * a1)},${f3(cyA - Math.cos(t1) * a1)} L` : "M"}${cxA},${cyA} L${f3(cxA + Math.sin(t2) * a2)},${f3(cyA - Math.cos(t2) * a2)}" fill="none" stroke="${CP3}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${cxA}" cy="${cyA}" r="5" fill="var(--ink)"/>
        <line x1="${cxA}" y1="${cyA + 8}" x2="${cxA}" y2="${cyA + 30}" stroke="var(--ink)" stroke-width="1.6"/><path d="M${cxA},${cyA + 38} l-6,-10 h12 z" fill="var(--ink)"/>
        <text x="${cxA + 12}" y="${cyA + 32}" font-size="13.5" fill="var(--muted)">${L2("to the pole", "মেরুর দিকে")}</text>
        <text x="338" y="76" text-anchor="middle" font-size="34" font-weight="700" fill="var(--c)">${LT}</text>`;
      $("#b3mcs", el).innerHTML = s + `</svg>`;
      $("#b3mco", el).innerHTML = `<b>${NM}</b>: ${WH}. ${L2(`In anaphase it looks like the letter <b>${LT}</b>.`, `অ্যানাফেজে এটি দেখতে ইংরেজি <b>${LT}</b> বর্ণের মতো।`)}`;
      el.querySelectorAll(".b3mc button").forEach((b, n) => b.setAttribute("aria-pressed", n === ty));
    };
    $("#b3mp", el).addEventListener("input", draw);
    el.querySelectorAll(".b3mc button").forEach(b => b.addEventListener("click", () => { $("#b3mp", el).value = b.dataset.v; draw(); }));
    draw();
  };
  chips3(el, ".b3mt", b => { tab = b.dataset.t; playing = false; (tab === "s" ? stages : shapes)(); });
  stages();
  if (!REDUCED) animate(el, dt => {
    if (tab !== "s") return;
    if (pos !== tgt) {
      const dir = Math.sign(tgt - pos); pos += dir * spd * dt / 0.95;
      if ((dir > 0 && pos > tgt) || (dir < 0 && pos < tgt)) pos = tgt;
      drawCell();
    } else if (playing) {
      hold += dt;
      if (hold > 2.6) { if (tgt < 6) go(tgt + 1); else { playing = false; info(); } }
    }
  });
};

/* 3.3 mitosis vs meiosis step by step + why the chromosome number must be halved */
W.b3meiosis = (el) => {
  el.innerHTML = `<div class="chipset b3et" role="group"><button data-t="c" aria-pressed="true">${L2("Meiosis step by step", "ধাপে ধাপে মিয়োসিস")}</button><button data-t="w" aria-pressed="false">${L2("Why halve the number?", "সংখ্যা অর্ধেক কেন?")}</button></div><div id="b3ebody" style="margin-top:10px"></div>`;
  const body = $("#b3ebody", el);
  /* one chromatid as a rod; tip = colour of the top third (after exchange of pieces) */
  const rod = (x, yt, len, main, tip, w) => `<line x1="${f3(x)}" y1="${f3(yt)}" x2="${f3(x)}" y2="${f3(yt + len)}" stroke="${main}" stroke-width="${w}" stroke-linecap="round"/>` + (tip && tip !== main ? `<line x1="${f3(x)}" y1="${f3(yt)}" x2="${f3(x)}" y2="${f3(yt + len * 0.34)}" stroke="${tip}" stroke-width="${w}" stroke-linecap="round"/>` : "");
  /* chromosome: kind L/S, tids = [[main, tip], …] (1 or 2 chromatids) */
  const chromo = (x, cy, kind, tids, sc) => {
    const len = (kind === "L" ? 34 : 20) * sc, cf = kind === "L" ? 0.5 : 0.26, yt = cy - len / 2, w = 4.2 * sc;
    if (tids.length === 1) return rod(x, yt, len, tids[0][0], tids[0][1], w) + `<circle cx="${f3(x)}" cy="${f3(yt + len * cf)}" r="${f3(1.5 * sc)}" fill="var(--ink)"/>`;
    return rod(x - 2.7 * sc, yt, len, tids[0][0], tids[0][1], w) + rod(x + 2.7 * sc, yt, len, tids[1][0], tids[1][1], w) + `<circle cx="${f3(x)}" cy="${f3(yt + len * cf)}" r="${f3(2.6 * sc)}" fill="var(--ink)"/>`;
  };
  const cell = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
  const arrow = (x1, y1, x2, y2) => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - ux * 8, by = y2 - uy * 8; return `<line x1="${x1}" y1="${y1}" x2="${f3(bx)}" y2="${f3(by)}" stroke="var(--muted)" stroke-width="1.8"/><path d="M${x2},${y2} L${f3(bx - uy * 4.5)},${f3(by + ux * 4.5)} L${f3(bx + uy * 4.5)},${f3(by - ux * 4.5)} Z" fill="var(--muted)"/>`; };
  const pure = c => [c, c];
  /* ---------- tab 1 ---------- */
  const compare = () => {
    let mode = "me", step = 0, o1 = 0, o2 = 0;
    body.innerHTML = `<div class="chipset b3em" role="group"><button data-m="me" aria-pressed="true">${L2("Meiosis", "মিয়োসিস")}</button><button data-m="mi" aria-pressed="false">${L2("Mitosis (to compare)", "মাইটোসিস (তুলনার জন্য)")}</button></div>
      <div class="svgwrap fit" id="b3esv" style="margin-top:6px"></div>
      <div class="w-row" style="margin:6px 0 10px"><button class="btn" id="b3eb">← ${L2("Back", "আগের")}</button><button class="btn solid" id="b3en">${L2("Next step", "পরের ধাপ")} →</button><button class="btn" id="b3es">⟳ ${L2("Shuffle", "অন্যভাবে সাজাও")}</button></div>
      <div class="w-out" id="b3eo"></div>${legend3()}`;
    const TM = [
      L2("<b>Germ mother cell, diploid: 2n = 4.</b> Two long and two short chromosomes. In each pair, one came from the father and one from the mother.", "<b>জনন মাতৃকোষ, ডিপ্লয়েড: 2n = ৪।</b> দুটি লম্বা ও দুটি খাটো ক্রোমোজোম। প্রতি জোড়ার একটি বাবার, অন্যটি মায়ের কাছ থেকে পাওয়া।"),
      L2("<b>Getting ready.</b> The DNA is copied, so every chromosome has two chromatids. The two partners of each pair come together and <b>exchange small pieces</b> (see the mixed colours). Chromosomes are copied only this once.", "<b>প্রস্তুতি।</b> DNA-র অনুলিপি হয়, তাই প্রতিটি ক্রোমোজোমে দুটি ক্রোমাটিড। প্রতি জোড়ার দুই সঙ্গী কাছে এসে <b>ছোট ছোট অংশ বিনিময় করে</b> (মিশ্র রং লক্ষ করো)। ক্রোমোজোমের অনুলিপি হয় শুধু এই একবারই।"),
      L2("<b>Meiosis-I (reduction division).</b> The two partners of each pair go to different cells. Each cell now has only 2 chromosomes: <b>n = 2</b>. This is where the number is halved.", "<b>মিয়োসিস-১ (হ্রাসমূলক বিভাজন)।</b> প্রতি জোড়ার দুই সঙ্গী দুই আলাদা কোষে চলে যায়। প্রতিটি কোষে এখন মাত্র ২টি ক্রোমোজোম: <b>n = ২</b>। সংখ্যা অর্ধেক হয় এখানেই।"),
      L2("<b>Meiosis-II (like mitosis).</b> The two chromatids of each chromosome separate. Result: <b>4 haploid cells (n = 2)</b>, and no two are alike. Tap Shuffle for another possible result.", "<b>মিয়োসিস-২ (মাইটোসিসের মতো)।</b> প্রতিটি ক্রোমোজোমের দুটি ক্রোমাটিড আলাদা হয়। ফল: <b>৪টি হ্যাপ্লয়েড কোষ (n = ২)</b>, আর কোনো দুটি হুবহু এক নয়। অন্য সম্ভাব্য ফল দেখতে 'অন্যভাবে সাজাও' চাপো।")];
    const TI = [
      L2("<b>Body cell, diploid: 2n = 4.</b> The same four chromosomes as in the other picture.", "<b>দেহকোষ, ডিপ্লয়েড: 2n = ৪।</b> অন্য ছবির মতোই চারটি ক্রোমোজোম।"),
      L2("<b>Getting ready (interphase).</b> The DNA is copied, so every chromosome has two chromatids. The pairs do <b>not</b> come together and nothing is exchanged.", "<b>প্রস্তুতি (ইন্টারফেজ)।</b> DNA-র অনুলিপি হয়, তাই প্রতিটি ক্রোমোজোমে দুটি ক্রোমাটিড। জোড়াগুলো কাছে আসে <b>না</b>, কিছু বিনিময়ও হয় না।"),
      L2("<b>One division only.</b> The chromatids separate. Result: <b>2 daughter cells, each 2n = 4</b>, exact copies of the mother cell. Compare with meiosis: 4 cells, each n = 2, all different.", "<b>একটিই বিভাজন।</b> ক্রোমাটিডগুলো আলাদা হয়। ফল: <b>২টি অপত্য কোষ, প্রতিটিতে 2n = ৪</b>, মাতৃকোষের হুবহু প্রতিরূপ। মিয়োসিসের সাথে মেলাও: ৪টি কোষ, প্রতিটিতে n = ২, সবাই আলাদা।")];
    const draw = () => {
      const me = mode === "me", max = me ? 3 : 2, H = me ? 310 : 214;
      /* the two copied long chromosomes after exchange (meiosis only) */
      const LP = me ? [pure(CP3), [CP3, CM3]] : [pure(CP3), pure(CP3)], LM = me ? [[CM3, CP3], pure(CM3)] : [pure(CM3), pure(CM3)];
      const SP = [pure(CP3), pure(CP3)], SM = [pure(CM3), pure(CM3)];
      let s = `<svg viewBox="0 0 360 ${H}" role="img" aria-label="${me ? L2("meiosis step by step", "ধাপে ধাপে মিয়োসিস") : L2("mitosis step by step", "ধাপে ধাপে মাইটোসিস")}">`;
      s += cell(180, 48, 42);
      if (step === 0) s += chromo(159, 48, "L", [pure(CP3)], 1) + chromo(172, 48, "L", [pure(CM3)], 1) + chromo(188, 48, "S", [pure(CP3)], 1) + chromo(201, 48, "S", [pure(CM3)], 1);
      else if (me) s += chromo(160, 48, "L", LP, 1) + chromo(171.5, 48, "L", LM, 1) + chromo(189, 48, "S", SP, 1) + chromo(200.5, 48, "S", SM, 1);
      else s += chromo(156, 48, "L", LP, 1) + chromo(172, 48, "L", LM, 1) + chromo(188, 48, "S", SP, 1) + chromo(204, 48, "S", SM, 1);
      s += `<text x="130" y="${step ? 38 : 52}" text-anchor="end" font-size="14" fill="var(--ink)">${me ? L2("Germ mother cell", "জনন মাতৃকোষ") : L2("Body cell", "দেহকোষ")}</text>${step ? `<text x="130" y="56" text-anchor="end" font-size="13.5" fill="var(--muted)">${L2("DNA copied", "DNA-র অনুলিপি হয়েছে")}</text>` : ""}
        <text x="230" y="52" font-size="15" font-weight="700" fill="var(--ink)">2n = ${B3(4)}</text>`;
      if (step >= 2) {
        s += arrow(160, 88, 122, 118) + arrow(200, 88, 238, 118) + `<text x="180" y="112" text-anchor="middle" font-size="14" font-weight="700" fill="var(--c)">${me ? L2("Meiosis-I", "মিয়োসিস-১") : L2("Mitosis", "মাইটোসিস")}</text>`;
        s += cell(100, 152, 36) + cell(260, 152, 36);
        if (me) {
          const A = [o1 ? LM : LP, o2 ? SM : SP], Bc = [o1 ? LP : LM, o2 ? SP : SM];
          s += chromo(91, 152, "L", A[0], 1) + chromo(109, 152, "S", A[1], 1) + chromo(251, 152, "L", Bc[0], 1) + chromo(269, 152, "S", Bc[1], 1);
          s += `<text x="180" y="150" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">n = ${B3(2)}</text><text x="180" y="167" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("in each", "প্রতিটিতে")}</text>`;
          if (step >= 3) {
            s += arrow(86, 187, 60, 219) + arrow(114, 187, 128, 219) + arrow(246, 187, 232, 219) + arrow(274, 187, 300, 219) + `<text x="180" y="208" text-anchor="middle" font-size="14" font-weight="700" fill="var(--c)">${L2("Meiosis-II", "মিয়োসিস-২")}</text>`;
            [[50, A, 0], [136, A, 1], [224, Bc, 0], [310, Bc, 1]].forEach(q => { s += cell(q[0], 252, 31) + chromo(q[0] - 7, 252, "L", [q[1][0][q[2]]], 0.92) + chromo(q[0] + 7, 252, "S", [q[1][1][q[2]]], 0.92); });
            s += `<text x="180" y="302" text-anchor="middle" font-size="14" fill="var(--ink)">${L2("4 cells · each n = 2 · all different", "৪টি কোষ · প্রতিটিতে n = ২ · সবাই আলাদা")}</text>`;
          }
        } else {
          [100, 260].forEach(x => { s += chromo(x - 19, 152, "L", [pure(CP3)], 0.95) + chromo(x - 6.5, 152, "L", [pure(CM3)], 0.95) + chromo(x + 6.5, 152, "S", [pure(CP3)], 0.95) + chromo(x + 19, 152, "S", [pure(CM3)], 0.95); });
          s += `<text x="180" y="150" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">2n = ${B3(4)}</text><text x="180" y="167" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("in each", "প্রতিটিতে")}</text>
            <text x="180" y="208" text-anchor="middle" font-size="14" fill="var(--ink)">${L2("2 cells · each 2n = 4 · identical", "২টি কোষ · প্রতিটিতে 2n = ৪ · হুবহু এক")}</text>`;
        }
      }
      $("#b3esv", el).innerHTML = s + `</svg>`;
      $("#b3eo", el).innerHTML = `<span class="muted">${L2(`Step ${step + 1} of ${max + 1}`, `ধাপ ${B3(step + 1)} / ${B3(max + 1)}`)}</span><br>${(me ? TM : TI)[step]}`;
      $("#b3eb", el).disabled = step === 0; $("#b3en", el).disabled = step === max;
      $("#b3es", el).style.display = me ? "" : "none"; $("#b3es", el).disabled = step < 2;
    };
    chips3(el, ".b3em", b => { mode = b.dataset.m; step = 0; draw(); });
    $("#b3eb", el).addEventListener("click", () => { if (step > 0) { step--; draw(); } });
    $("#b3en", el).addEventListener("click", () => { if (step < (mode === "me" ? 3 : 2)) { step++; draw(); } });
    $("#b3es", el).addEventListener("click", () => { const cur = o1 * 2 + o2; let nx = cur; while (nx === cur) nx = Math.floor(Math.random() * 4); o1 = nx >> 1; o2 = nx & 1; draw(); });
    draw();
  };
  /* ---------- tab 2 ---------- */
  const why = () => {
    const ORG = [[L2("Book's example", "বইয়ের উদাহরণ"), 4], [L2("Onion", "পেঁয়াজ"), 16], [L2("Rice", "ধান"), 24], [L2("Human", "মানুষ"), 46]];
    let o = 0, me = true;
    body.innerHTML = `<div class="chipset b3wo" role="group">${ORG.map((x, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${x[0]} (2n = ${B3(x[1])})</button>`).join("")}</div>
      <div class="chipset b3wm" role="group" style="margin-top:8px"><button data-m="1" aria-pressed="true">${L2("With meiosis", "মিয়োসিস হলে")}</button><button data-m="0" aria-pressed="false">${L2("If there were no meiosis", "মিয়োসিস না থাকলে")}</button></div>
      <div class="svgwrap fit" id="b3wsv" style="margin-top:6px"></div><div class="w-out" id="b3wo"></div>
      <div class="hint" style="margin-top:6px">${L2("The numbers are chromosomes per cell. Blue ring: sperm (from the father). Orange ring: egg (from the mother).", "সংখ্যাগুলো প্রতি কোষের ক্রোমোজোম সংখ্যা। নীল বৃত্ত: শুক্রাণু (বাবার)। কমলা বৃত্ত: ডিম্বাণু (মায়ের)।")}</div>`;
    const draw = () => {
      const n0 = ORG[o][1];
      let N = n0, s = `<svg viewBox="0 0 360 246" role="img" aria-label="${L2("chromosome number over generations", "প্রজন্ম থেকে প্রজন্মে ক্রোমোজোম সংখ্যা")}">
        <text x="86" y="14" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("Body cell", "দেহকোষ")}</text><text x="204" y="14" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("Sperm + egg", "শুক্রাণু + ডিম্বাণু")}</text><text x="322" y="14" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("Zygote", "জাইগোট")}</text>`;
      for (let r = 0; r < 3; r++) {
        const y = 52 + r * 82, g = me ? N / 2 : N, Z = g * 2, bad = !me, zc = bad ? "var(--bad)" : "var(--c)";
        s += `<text x="4" y="${y + 5}" font-size="13.5" fill="var(--muted)">${L2("Gen", "প্রজন্ম")} ${B3(r + 1)}</text>`;
        s += `<circle cx="86" cy="${y}" r="22" fill="var(--c-soft)" stroke="${r && bad ? "var(--bad)" : "var(--c)"}" stroke-width="2"/><text x="86" y="${y + 5.5}" text-anchor="middle" font-size="15.5" font-weight="700" fill="var(--ink)">${B3(N)}</text>`;
        s += arrow(111, y, 154, y) + `<text x="131" y="${y - 8}" text-anchor="middle" font-size="13.5" fill="${bad ? "var(--bad)" : "var(--c)"}">${me ? "÷ " + B3(2) : L2("same", "একই")}</text>`;
        s += `<circle cx="176" cy="${y}" r="18" fill="var(--sheet)" stroke="${CP3}" stroke-width="2.4"/><text x="176" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">${B3(g)}</text>
          <text x="204" y="${y + 5}" text-anchor="middle" font-size="15" fill="var(--ink)">+</text>
          <circle cx="232" cy="${y}" r="18" fill="var(--sheet)" stroke="${CM3}" stroke-width="2.4"/><text x="232" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">${B3(g)}</text>`;
        s += arrow(253, y, 297, y) + `<circle cx="322" cy="${y}" r="22" fill="var(--c-soft)" stroke="${zc}" stroke-width="${bad ? 3 : 2}"/><text x="322" y="${y + 5.5}" text-anchor="middle" font-size="15.5" font-weight="700" fill="${bad ? "var(--bad)" : "var(--ink)"}">${B3(Z)}</text>`;
        if (r < 2) s += `<path d="M322,${y + 25} V${y + 42} H86 V${y + 51}" fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="4 4"/><path d="M86,${y + 58} l-4.5,-8 h9 z" fill="var(--muted)"/><text x="204" y="${y + 37}" text-anchor="middle" font-size="13.5" fill="var(--muted)">${L2("child grows by mitosis", "সন্তান মাইটোসিসে বেড়ে ওঠে")}</text>`;
        N = Z;
      }
      $("#b3wsv", el).innerHTML = s + `</svg>`;
      $("#b3wo", el).innerHTML = me
        ? L2(`<b>Meiosis halves, fertilisation doubles.</b> Gametes carry n = ${n0 / 2}; two of them join to give 2n = ${n0} again. The number stays <b>${n0}</b> in every generation.`, `<b>মিয়োসিস অর্ধেক করে, নিষেক দ্বিগুণ করে।</b> জননকোষে থাকে n = ${B3(n0 / 2)}; দুটি মিলে আবার 2n = ${B3(n0)}। প্রতি প্রজন্মে সংখ্যা <b>${B3(n0)}</b>-ই থাকে।`)
        : L2(`<b>The number would double every generation:</b> ${n0} → ${n0 * 2} → ${n0 * 4} → ${n0 * 8}. With so many extra chromosomes (and genes), the offspring would be completely different from the parents. That is why gametes must be made by meiosis.`, `<b>প্রতি প্রজন্মে সংখ্যা দ্বিগুণ হতে থাকত:</b> ${B3(n0)} → ${B3(n0 * 2)} → ${B3(n0 * 4)} → ${B3(n0 * 8)}। এত বাড়তি ক্রোমোজোম (ও জিন) নিয়ে সন্তান বাবা-মায়ের থেকে আমূল আলাদা হয়ে যেত। তাই জননকোষ তৈরি হয় মিয়োসিসে।`);
    };
    chips3(el, ".b3wo", b => { o = +b.dataset.i; draw(); });
    chips3(el, ".b3wm", b => { me = b.dataset.m === "1"; draw(); });
    draw();
  };
  chips3(el, ".b3et", b => (b.dataset.t === "c" ? compare : why)());
  compare();
};
