/* ---- chemistry chapter 10 widgets: mineral resources, metals and non-metals ---- */
const B10 = x => bnNum(x, LANG);
const f10 = (x, d = 0) => { if (!isFinite(x)) return "—"; const s = (+(+x).toFixed(d)).toString(); return B10(s).replace("-", "−"); };
const chips10 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const CC10 = { rust: "#b5541c", sulfur: "#e3b505", copper: "#c8743a", zinc: "#a7b4bd", steel: "#7d8a94", gold: "#d4a017", water: "#4a90d9", melt: "#e8893a", air: "#6aa6e8", slag: "#9c7a4a", sand: "#d9b77e", ore: "#8e3b2c", carbon: "#3b3b3b", tin: "#c9ced3", paint: "#2e8b57" };
/* small tab helper: renders one of several sub-views into a box */
const tabs10 = (el, id, names, fns) => {
  el.innerHTML = `<div class="chipset ${id}t" role="group">${names.map((n, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${n}</button>`).join("")}</div><div id="${id}box" style="display:grid;gap:10px;min-width:0"></div>`;
  const show = i => { const old = $("#" + id + "box", el), box = old.cloneNode(false); old.replaceWith(box); fns[i](box); };
  chips10(el, "." + id + "t", b => show(+b.dataset.i));
  show(0);
};

/* ================= 10.1 earth's crust + ore or mineral sorter ================= */
W.k10ore = (el) => {
  const crust = [["O", L2("Oxygen", "অক্সিজেন"), 46, 0], ["Si", L2("Silicon", "সিলিকন"), 27, 0], ["Al", L2("Aluminium", "অ্যালুমিনিয়াম"), 8, 1], ["Fe", L2("Iron", "লোহা"), 5, 1], ["Ca", L2("Calcium", "ক্যালসিয়াম"), 4, 1], ["Na", L2("Sodium", "সোডিয়াম"), 3, 1], ["K", L2("Potassium", "পটাশিয়াম"), 3, 1], ["Mg", L2("Magnesium", "ম্যাগনেসিয়াম"), 2, 1], ["…", L2("Others", "অন্যান্য"), 2, 0]];
  /* [name, formula, place, is ore?, reason] */
  const S = [
    [L2("Galena", "গ্যালেনা"), "PbS", "", 1, L2("Rich in lead, and lead is extracted from it cheaply: the chief ore of lead.", "লেডে সমৃদ্ধ, আর কম খরচে এ থেকে লেড নিষ্কাশন করা যায়: লেডের প্রধান আকরিক।")],
    [L2("Clay (kaolin, white clay)", "কাদামাটি (কেউলিন, সাদা মাটি)"), L2("aluminium silicate", "অ্যালুমিনিয়াম সিলিকেট"), L2("Bijoypur, Netrokona", "বিজয়পুর, নেত্রকোনা"), 0, L2("It contains aluminium, but getting Al out of the silicate costs more than the metal is worth. A mineral of aluminium, not an ore (it is used for porcelain instead).", "এতে অ্যালুমিনিয়াম আছে, কিন্তু সিলিকেট থেকে Al বের করার খরচ ধাতুর দামের চেয়ে বেশি। অ্যালুমিনিয়ামের খনিজ, আকরিক নয় (বরং চীনামাটির জিনিস তৈরিতে ব্যবহৃত হয়)।")],
    [L2("Bauxite", "বক্সাইট"), "Al₂O₃·2H₂O", "", 1, L2("Aluminium is extracted from it profitably (purified with NaOH, then electrolysed): the ore of aluminium.", "এ থেকে লাভজনকভাবে অ্যালুমিনিয়াম নিষ্কাশন করা যায় (NaOH দিয়ে বিশুদ্ধ করে তড়িৎ বিশ্লেষণ): অ্যালুমিনিয়ামের আকরিক।")],
    [L2("Hematite", "হেমাটাইট"), "Fe₂O₃", "", 1, L2("70% iron, easily reduced by carbon monoxide in a blast furnace: the main ore of iron.", "৭০% লোহা, বাত্যাচুল্লিতে কার্বন মনোক্সাইড দিয়ে সহজে বিজারিত হয়: লোহার প্রধান আকরিক।")],
    [L2("Feldspar", "ফেলস্পার"), "KAlSi₃O₈", "", 0, L2("Contains aluminium and potassium locked tightly in a silicate. Neither metal can be extracted from it profitably, so it is a mineral but not an ore.", "অ্যালুমিনিয়াম ও পটাশিয়াম সিলিকেটে শক্তভাবে আটকে আছে। কোনোটিই লাভজনকভাবে নিষ্কাশন করা যায় না, তাই এটি খনিজ, আকরিক নয়।")],
    [L2("Cinnabar", "সিনাবার"), "HgS", "", 1, L2("Simply heating it in air gives mercury (self-reduction): the ore of mercury.", "শুধু বাতাসে উত্তপ্ত করলেই পারদ পাওয়া যায় (স্ববিজারণ): পারদের আকরিক।")],
    [L2("Zinc blende", "জিংক ব্লেন্ড"), "ZnS", "", 1, L2("Roasted to ZnO, then reduced by carbon: an ore of zinc.", "তাপজারণে ZnO, তারপর কার্বন দিয়ে বিজারণ: জিংকের আকরিক।")],
    [L2("Mica", "অভ্র (মাইকা)"), L2("aluminium silicate", "অ্যালুমিনিয়াম সিলিকেট"), "", 0, L2("Another aluminium silicate. Useful as an electrical insulator, but not a profitable source of aluminium: a mineral, not an ore.", "আরেকটি অ্যালুমিনিয়াম সিলিকেট। বিদ্যুৎ অন্তরক হিসেবে কাজের, কিন্তু অ্যালুমিনিয়ামের লাভজনক উৎস নয়: খনিজ, আকরিক নয়।")],
    [L2("Chalcopyrite (copper pyrites)", "চালকোপাইরাইট (কপার পাইরাইটস)"), "CuFeS₂", "", 1, L2("The most important source of copper, concentrated by froth flotation: an ore of copper.", "কপারের সবচেয়ে গুরুত্বপূর্ণ উৎস, ফেনা ভাসমান পদ্ধতিতে ঘনীকরণ করা হয়: কপারের আকরিক।")],
    [L2("Magnetite", "ম্যাগনেটাইট"), "Fe₃O₄", L2("also in Cox's Bazar beach sand", "কক্সবাজারের সৈকতের বালিতেও"), 1, L2("About 72% iron and magnetic, so it is easily concentrated: an ore of iron.", "প্রায় ৭২% লোহা আর চৌম্বক, তাই সহজে ঘনীকরণ করা যায়: লোহার আকরিক।")],
    [L2("Calamine", "ক্যালামাইন"), "ZnCO₃", "", 1, L2("Calcined to ZnO, then reduced by carbon: an ore of zinc.", "ভস্মীকরণে ZnO, তারপর কার্বন দিয়ে বিজারণ: জিংকের আকরিক।")]
  ];
  let i = 0, score = 0, done = 0, answered = false;
  el.innerHTML = `<div class="svgwrap fit" id="k10osv"></div>
    <div class="w-out" id="k10oq"></div>
    <div class="w-row"><button class="btn" data-a="1">${L2("Ore (worth mining)", "আকরিক (তোলার মতো)")}</button><button class="btn" data-a="0">${L2("Mineral only", "শুধু খনিজ")}</button></div>
    <div class="w-out" id="k10of" aria-live="polite"></div>
    <div class="w-row"><button class="btn solid" id="k10on">${L2("Next sample", "পরের নমুনা")}</button><span class="muted" id="k10os"></span></div>`;
  const mx = 46, W0 = 190;
  let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("composition of the earth's crust", "ভূত্বকের উপাদান")}">
    <text x="4" y="16" font-size="14" font-weight="700" fill="var(--ink)">${L2("Earth's crust, % by mass", "ভূত্বক, ভর অনুযায়ী %")}</text>`;
  crust.forEach((c, k) => {
    const y = 28 + k * 23, w = c[2] / mx * W0;
    g += `<text x="120" y="${y + 14}" font-size="14" text-anchor="end" fill="var(--ink)">${c[1]}</text>
      <rect x="126" y="${y + 1}" width="${w}" height="17" rx="3" fill="${c[3] ? "var(--c)" : "var(--muted)"}" opacity="${c[3] ? .85 : .45}"/>
      <text x="${132 + w}" y="${y + 14}" font-size="14" fill="var(--ink)">${f10(c[2])}%</text>`;
  });
  g += `<rect x="126" y="239" width="12" height="10" fill="var(--c)" opacity=".85"/><text x="142" y="248" font-size="13" fill="var(--muted)">${L2("metal", "ধাতু")}</text>
    <rect x="200" y="239" width="12" height="10" fill="var(--muted)" opacity=".45"/><text x="216" y="248" font-size="13" fill="var(--muted)">${L2("non-metal / others", "অধাতু / অন্যান্য")}</text></svg>`;
  $("#k10osv", el).innerHTML = g;
  const show = () => {
    const s = S[i]; answered = false;
    $("#k10oq", el).innerHTML = `<b>${L2("Sample", "নমুনা")} ${B10(i + 1)}/${B10(S.length)}: ${s[0]}</b> — ${s[1]}${s[2] ? ` <span class="muted">(${s[2]})</span>` : ""}<br>${L2("Is it an ore, or only a mineral?", "এটি কি আকরিক, নাকি শুধুই খনিজ?")}`;
    $("#k10of", el).innerHTML = `<span class="muted">${L2("Choose an answer.", "একটি উত্তর বেছে নাও।")}</span>`;
    el.querySelectorAll("[data-a]").forEach(b => b.setAttribute("aria-pressed", "false"));
    $("#k10os", el).textContent = L2(`Score: ${score}/${done}`, `স্কোর: ${B10(score)}/${B10(done)}`);
  };
  el.querySelectorAll("[data-a]").forEach(b => b.addEventListener("click", () => {
    const s = S[i], ok = +b.dataset.a === s[3];
    if (!answered) { done++; if (ok) score++; answered = true; }
    el.querySelectorAll("[data-a]").forEach(q => q.setAttribute("aria-pressed", q === b));
    $("#k10of", el).innerHTML = `<b style="color:${ok ? "var(--good)" : "var(--bad)"}">${ok ? L2("Right!", "ঠিক!") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${s[3] ? L2("Ore.", "আকরিক।") : L2("Mineral, not an ore.", "খনিজ, আকরিক নয়।")} ${s[4]}`;
    $("#k10os", el).textContent = L2(`Score: ${score}/${done}`, `স্কোর: ${B10(score)}/${B10(done)}`);
  }));
  $("#k10on", el).addEventListener("click", () => { i = (i + 1) % S.length; if (i === 0) { score = 0; done = 0; } show(); });
  show();
};

/* ================= 10.2 metal extraction explorer (4 tabs) ================= */
W.k10extract = (el) => {
  /* ---- tab 1: reactivity series → method ---- */
  const route = (box) => {
    const G = [
      [0, L2("Electrolysis", "তড়িৎ বিশ্লেষণ"), "var(--bad)"],
      [1, L2("Carbon reduction", "কার্বন বিজারণ"), "var(--note)"],
      [2, L2("Self-reduction", "স্ববিজারণ"), "var(--c)"],
      [3, L2("Found free", "মুক্ত অবস্থায়"), "var(--good)"]];
    const M = [
      ["K", L2("Potassium", "পটাশিয়াম"), 0, L2("sylvite (KCl)", "সিলভাইট (KCl)"), "2KCl(l) → 2K + Cl₂"],
      ["Na", L2("Sodium", "সোডিয়াম"), 0, L2("rock salt / brine (NaCl)", "খনিজ লবণ / ব্রাইন (NaCl)"), L2("2NaCl(l) → 2Na + Cl₂ (CaCl₂ added to melt at ≈ 600 °C)", "2NaCl(l) → 2Na + Cl₂ (≈ ৬০০ °C-এ গলাতে CaCl₂ যোগ করা হয়)")],
      ["Ca", L2("Calcium", "ক্যালসিয়াম"), 0, L2("limestone (CaCO₃) → CaCl₂", "চুনাপাথর (CaCO₃) → CaCl₂"), "CaCl₂(l) → Ca + Cl₂"],
      ["Mg", L2("Magnesium", "ম্যাগনেসিয়াম"), 0, L2("sea water, carnallite → MgCl₂", "সমুদ্রের পানি, কার্নালাইট → MgCl₂"), "MgCl₂(l) → Mg + Cl₂"],
      ["Al", L2("Aluminium", "অ্যালুমিনিয়াম"), 0, L2("bauxite (Al₂O₃·2H₂O)", "বক্সাইট (Al₂O₃·2H₂O)"), L2("2Al₂O₃ → 4Al + 3O₂ (in molten cryolite)", "2Al₂O₃ → 4Al + 3O₂ (গলিত ক্রায়োলাইটে)")],
      ["Zn", L2("Zinc", "জিংক"), 1, L2("zinc blende (ZnS), calamine (ZnCO₃)", "জিংক ব্লেন্ড (ZnS), ক্যালামাইন (ZnCO₃)"), "2ZnS + 3O₂ → 2ZnO + 2SO₂;  ZnO + C → Zn + CO"],
      ["Fe", L2("Iron", "লোহা"), 1, L2("hematite (Fe₂O₃), magnetite (Fe₃O₄)", "হেমাটাইট (Fe₂O₃), ম্যাগনেটাইট (Fe₃O₄)"), "Fe₂O₃ + 3CO → 2Fe + 3CO₂"],
      ["Pb", L2("Lead", "লেড"), 1, L2("galena (PbS)", "গ্যালেনা (PbS)"), "2PbS + 3O₂ → 2PbO + 2SO₂;  PbO + C → Pb + CO"],
      ["Cu", L2("Copper", "কপার"), 2, L2("copper pyrites (CuFeS₂), chalcocite (Cu₂S)", "কপার পাইরাইটস (CuFeS₂), চালকোসাইট (Cu₂S)"), "2Cu₂S + 3O₂ → 2Cu₂O + 2SO₂;  2Cu₂O + Cu₂S → 6Cu + SO₂"],
      ["Hg", L2("Mercury", "পারদ"), 2, L2("cinnabar (HgS)", "সিনাবার (HgS)"), "HgS + O₂ → Hg + SO₂"],
      ["Ag", L2("Silver", "সিলভার"), 2, L2("argentite (Ag₂S); also found free", "আর্জেন্টাইট (Ag₂S); মুক্ত অবস্থায়ও পাওয়া যায়"), "Ag₂S + O₂ → 2Ag + SO₂"],
      ["Pt", L2("Platinum", "প্লাটিনাম"), 3, L2("native grains in rocks", "শিলায় মুক্ত দানা"), L2("no reduction needed; separated physically", "বিজারণ লাগে না; ভৌতভাবে আলাদা করা হয়")],
      ["Au", L2("Gold", "সোনা"), 3, L2("native gold in rock and river sand", "শিলা ও নদীর বালিতে মুক্ত সোনা"), L2("no reduction needed; separated physically", "বিজারণ লাগে না; ভৌতভাবে আলাদা করা হয়")]];
    const WHY = [
      L2("It holds oxygen (or chlorine) more strongly than carbon does, so carbon cannot reduce it. Electrons are pushed onto the ions at the cathode instead.", "এটি কার্বনের চেয়ে বেশি শক্ত করে অক্সিজেন (বা ক্লোরিন) ধরে রাখে, তাই কার্বন একে বিজারিত করতে পারে না। বরং ক্যাথোডে আয়নের ওপর ইলেকট্রন ঠেলে দেওয়া হয়।"),
      L2("Carbon holds oxygen more strongly than this metal, so hot coke (or CO) pulls the oxygen away. Cheaper than electrolysis.", "এই ধাতুর চেয়ে কার্বন বেশি শক্ত করে অক্সিজেন ধরে, তাই গরম কোক (বা CO) অক্সিজেন ছিনিয়ে নেয়। তড়িৎ বিশ্লেষণের চেয়ে সস্তা।"),
      L2("It holds on to sulfur and oxygen so weakly that heating the sulfide ore in air is enough; no reducing agent is added.", "এটি সালফার ও অক্সিজেনকে এত দুর্বলভাবে ধরে যে সালফাইড আকরিক শুধু বাতাসে উত্তপ্ত করলেই হয়; আলাদা বিজারক লাগে না।"),
      L2("It hardly reacts at all, so it survives in nature as the free metal.", "এটি প্রায় বিক্রিয়াই করে না, তাই প্রকৃতিতে মুক্ত ধাতু হিসেবে টিকে থাকে।")];
    let sel = 6;
    box.innerHTML = `<div class="svgwrap fit" id="k10rsv"></div><div class="w-out" id="k10ro"></div>`;
    const draw = () => {
      const top = 26, h = 24;
      let s = `<svg viewBox="0 0 360 ${top + M.length * h + 14}" role="img" aria-label="${L2("reactivity series and extraction method", "সক্রিয়তা সিরিজ ও নিষ্কাশন পদ্ধতি")}">${arrowDefs("k10ra", "var(--muted)")}
        <text x="6" y="16" font-size="13" fill="var(--muted)">${L2("more reactive", "বেশি সক্রিয়")}</text>
        <line x1="14" y1="30" x2="14" y2="${top + M.length * h - 4}" stroke="var(--muted)" stroke-width="2" marker-end="url(#k10ra)"/>
        <text x="6" y="${top + M.length * h + 12}" font-size="13" fill="var(--muted)">${L2("less reactive", "কম সক্রিয়")}</text>`;
      G.forEach(gr => {
        const rows = M.map((m, k) => [m, k]).filter(([m]) => m[2] === gr[0]), y0 = top + rows[0][1] * h, y1 = top + (rows[rows.length - 1][1] + 1) * h;
        s += `<rect x="30" y="${y0 + 1}" width="326" height="${y1 - y0 - 2}" rx="8" fill="${gr[2]}" opacity=".13"/>
          <text x="346" y="${(y0 + y1) / 2 + 5}" font-size="14" font-weight="700" text-anchor="end" fill="${gr[2]}">${gr[1]}</text>`;
      });
      M.forEach((m, k) => {
        const y = top + k * h, on = k === sel;
        s += `<g data-k="${k}" style="cursor:pointer"><rect x="36" y="${y + 3}" width="150" height="${h - 6}" rx="6" fill="${on ? "var(--c)" : "var(--paper)"}" stroke="var(--rule)"/>
          <text x="46" y="${y + 17}" font-size="14" font-weight="700" fill="${on ? "var(--paper)" : "var(--ink)"}">${m[0]}</text>
          <text x="76" y="${y + 17}" font-size="13.5" fill="${on ? "var(--paper)" : "var(--ink)"}">${m[1]}</text></g>`;
      });
      $("#k10rsv", box).innerHTML = s + `</svg>`;
      box.querySelectorAll("[data-k]").forEach(g => g.addEventListener("click", () => { sel = +g.dataset.k; draw(); }));
      const m = M[sel];
      $("#k10ro", box).innerHTML = `<b>${m[1]} (${m[0]})</b>: <b style="color:${G[m[2]][2]}">${G[m[2]][1]}</b><br>${L2("Ore", "আকরিক")}: ${m[3]}<br><code>${m[4]}</code><br>${WHY[m[2]]}`;
    };
    draw();
  };

  /* ---- tab 2: concentration method chooser ---- */
  const conc = (box) => {
    const O = [
      [L2("Hematite Fe₂O₃", "হেমাটাইট Fe₂O₃"), 0, L2("heavy oxide ore; gangue is light sand and clay", "ভারী অক্সাইড আকরিক; খনিজমল হালকা বালি ও কাদা")],
      [L2("Galena PbS", "গ্যালেনা PbS"), 1, L2("sulfide ore: wetted by oil, not by water", "সালফাইড আকরিক: তেলে ভেজে, পানিতে নয়")],
      [L2("Zinc blende ZnS", "জিংক ব্লেন্ড ZnS"), 1, L2("sulfide ore: wetted by oil, not by water", "সালফাইড আকরিক: তেলে ভেজে, পানিতে নয়")],
      [L2("Magnetite Fe₃O₄", "ম্যাগনেটাইট Fe₃O₄"), 2, L2("attracted by a magnet; sand is not", "চুম্বকে আকৃষ্ট হয়; বালি হয় না")],
      [L2("Chromite FeO·Cr₂O₃", "ক্রোমাইট FeO·Cr₂O₃"), 2, L2("magnetic ore", "চৌম্বক আকরিক")],
      [L2("Bauxite Al₂O₃·2H₂O", "বক্সাইট Al₂O₃·2H₂O"), 3, L2("Al₂O₃ dissolves in hot NaOH; iron oxide and sand do not", "Al₂O₃ গরম NaOH-এ দ্রবীভূত হয়; আয়রন অক্সাইড ও বালি হয় না")]];
    const MET = [L2("Gravity (hydraulic) washing", "পানির স্রোতে ধৌতকরণ"), L2("Froth flotation", "ফেনা ভাসমান পদ্ধতি"), L2("Magnetic separation", "চৌম্বকীয় পৃথকীকরণ"), L2("Chemical method", "রাসায়নিক পদ্ধতি")];
    let sel = 0, t = 0;
    box.innerHTML = `<div class="chipset k10cc" role="group">${O.map((o, k) => `<button data-i="${k}" aria-pressed="${k === 0}">${o[0]}</button>`).join("")}</div>
      <div class="svgwrap fit" id="k10csv"></div><div class="w-out" id="k10co"></div>`;
    const rnd = k => { const x = Math.sin(k * 12.9898) * 43758.5453; return x - Math.floor(x); };
    const draw = () => {
      const m = O[sel][1];
      let s = `<svg viewBox="0 0 360 230" role="img" aria-label="${MET[m]}">${arrowDefs("k10ca", "var(--ink)")}${arrowDefs("k10cw", CC10.water)}`;
      if (m === 0) { /* sloping grooved table */
        s += `<path d="M30 70 L320 170" stroke="var(--ink)" stroke-width="4"/>`;
        for (let k = 0; k < 6; k++) { const x = 70 + k * 42, y = 70 + (x - 30) * 100 / 290; s += `<path d="M${x - 8} ${y - 3} q8 12 16 5" fill="none" stroke="var(--ink)" stroke-width="2"/>`; for (let j = 0; j < 3; j++) s += `<circle cx="${x - 3 + j * 4}" cy="${y + 4}" r="3.2" fill="${CC10.ore}"/>`; }
        s += `<path d="M24 40 q30 0 40 22" fill="none" stroke="${CC10.water}" stroke-width="3" marker-end="url(#k10cw)"/><text x="10" y="30" font-size="14" fill="${CC10.water}">${L2("water", "পানি")}</text>`;
        for (let k = 0; k < 10; k++) { const p = (rnd(k) + t * 0.25) % 1, x = 40 + p * 300, y = 60 + (x - 30) * 100 / 290 - 6 - rnd(k + 3) * 6; s += `<circle cx="${x}" cy="${y}" r="2.6" fill="${CC10.sand}"/>`; }
        s += `<path d="M300 180 q30 10 50 30" fill="none" stroke="${CC10.water}" stroke-width="3" marker-end="url(#k10cw)"/>
          <text x="120" y="222" font-size="13.5" fill="var(--ink)">${L2("light sand washed away →", "হালকা বালি ধুয়ে যায় →")}</text>
          <text x="40" y="150" font-size="13.5" fill="var(--ink)">${L2("heavy ore stays in grooves", "ভারী আকরিক খাঁজে থাকে")}</text>`;
      } else if (m === 1) { /* flotation tank */
        s += `<rect x="70" y="40" width="220" height="160" fill="${CC10.water}" opacity=".15"/><path d="M70 30 V200 H290 V30" fill="none" stroke="var(--ink)" stroke-width="3"/>
          <rect x="70" y="40" width="220" height="22" fill="var(--paper)" opacity=".9"/><text x="296" y="56" font-size="13.5" fill="var(--ink)">${L2("froth", "ফেনা")}</text>`;
        for (let k = 0; k < 16; k++) s += `<circle cx="${80 + k * 13.5}" cy="${50 + rnd(k) * 8}" r="6" fill="none" stroke="var(--muted)"/><circle cx="${80 + k * 13.5}" cy="${50 + rnd(k) * 8}" r="2.6" fill="${CC10.ore}"/>`;
        for (let k = 0; k < 9; k++) { const p = (rnd(k + 20) + t * 0.35) % 1, y = 190 - p * 125, x = 95 + k * 22 + Math.sin(p * 9 + k) * 3; s += `<circle cx="${x}" cy="${y}" r="5.5" fill="none" stroke="var(--muted)"/><circle cx="${x + 3}" cy="${y - 3}" r="2.6" fill="${CC10.ore}"/>`; }
        for (let k = 0; k < 18; k++) s += `<circle cx="${80 + rnd(k + 40) * 200}" cy="${192 - rnd(k + 60) * 7}" r="2.6" fill="${CC10.sand}"/>`;
        s += `<path d="M30 210 H180 V196" fill="none" stroke="${CC10.air}" stroke-width="3" marker-end="url(#k10ca)"/><text x="6" y="226" font-size="13.5" fill="var(--ink)">${L2("air blown in", "বাতাস চালনা")}</text>
          <text x="296" y="196" font-size="13.5" fill="var(--ink)">${L2("sand", "বালি")}</text><text x="6" y="110" font-size="13.5" fill="var(--ink)">${L2("water", "পানি")}</text><text x="6" y="128" font-size="13.5" fill="var(--ink)">+ ${L2("oil", "তেল")}</text>`;
      } else if (m === 2) { /* magnetic roller */
        s += `<circle cx="70" cy="70" r="18" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><circle cx="250" cy="70" r="22" fill="var(--c)" opacity=".35" stroke="var(--ink)" stroke-width="2"/>
          <text x="250" y="75" font-size="13" text-anchor="middle" fill="var(--ink)">N S</text>
          <path d="M70 52 H250 M70 88 H250" stroke="var(--ink)" stroke-width="2"/><text x="250" y="30" font-size="13.5" text-anchor="middle" fill="var(--ink)">${L2("magnetic roller", "চৌম্বক চাকা")}</text>
          <path d="M40 20 L80 46" stroke="var(--ink)" stroke-width="2" marker-end="url(#k10ca)"/><text x="6" y="16" font-size="13.5" fill="var(--ink)">${L2("crushed ore", "চূর্ণ আকরিক")}</text>`;
        for (let k = 0; k < 8; k++) { const x = 90 + ((rnd(k) * 150 + t * 50) % 150); s += `<circle cx="${x}" cy="48" r="3" fill="${k % 2 ? CC10.ore : CC10.sand}"/>`; }
        s += `<path d="M262 88 Q270 130 258 172" fill="none" stroke="${CC10.ore}" stroke-dasharray="4 4" stroke-width="2"/><path d="M270 60 Q330 90 330 172" fill="none" stroke="${CC10.sand}" stroke-dasharray="4 4" stroke-width="2"/>
          <path d="M228 200 Q258 150 288 200 Z" fill="${CC10.ore}" opacity=".8"/><path d="M300 200 Q330 158 356 200 Z" fill="${CC10.sand}"/>
          <text x="60" y="190" font-size="13.5" fill="var(--ink)">${L2("magnetic ore drops close", "চৌম্বক আকরিক কাছে পড়ে")}</text><text x="60" y="210" font-size="13.5" fill="var(--ink)">${L2("non-magnetic sand flies farther", "অচৌম্বক বালি দূরে পড়ে")}</text>`;
      } else { /* chemical method flow */
        const st = [L2("Bauxite + NaOH(aq), heat", "বক্সাইট + NaOH(aq), তাপ"), L2("NaAlO₂ solution; filter off Fe₂O₃, TiO₂, sand", "NaAlO₂ দ্রবণ; Fe₂O₃, TiO₂, বালি ছেঁকে ফেলা"), L2("+ water → Al(OH)₃ precipitates", "+ পানি → Al(OH)₃ অধঃক্ষিপ্ত হয়"), L2("heat ≈ 1100 °C → pure Al₂O₃", "≈ ১১০০ °C তাপ → বিশুদ্ধ Al₂O₃")];
        st.forEach((x, k) => { const y = 8 + k * 56; s += `<rect x="20" y="${y}" width="320" height="40" rx="8" fill="var(--c-soft)" stroke="var(--c)"/><text x="180" y="${y + 25}" font-size="14" text-anchor="middle" fill="var(--ink)">${x}</text>`; if (k < 3) s += `<line x1="180" y1="${y + 40}" x2="180" y2="${y + 54}" stroke="var(--ink)" stroke-width="2" marker-end="url(#k10ca)"/>`; });
      }
      $("#k10csv", box).innerHTML = s + `</svg>`;
      $("#k10co", box).innerHTML = `<b>${O[sel][0]}</b>: ${O[sel][2]}.<br>${L2("Method", "পদ্ধতি")}: <b>${MET[m]}</b>${m === 3 ? "<br><code>Al₂O₃·2H₂O + 2NaOH → 2NaAlO₂ + 3H₂O</code>" : ""}`;
    };
    chips10(box, ".k10cc", b => { sel = +b.dataset.i; draw(); });
    draw();
    if (!REDUCED) animate(box, dt => { t += dt; if (O[sel][1] < 3) draw(); });
  };

  /* ---- tab 3: aluminium electrolytic cell ---- */
  const alcell = (box) => {
    let cry = true, t = 0;
    box.innerHTML = `<div class="chipset k10ac" role="group"><button data-c="1" aria-pressed="true">${L2("Alumina in cryolite", "ক্রায়োলাইটে অ্যালুমিনা")}</button><button data-c="0" aria-pressed="false">${L2("Alumina alone", "শুধু অ্যালুমিনা")}</button></div>
      ${slider("k10an", L2("Electrons passed", "প্রবাহিত ইলেকট্রন"), 0, 24, 1, 12, "mol")}
      <div class="svgwrap fit" id="k10asv"></div><div class="w-out" id="k10ao"></div>`;
    const rnd = k => { const x = Math.sin(k * 78.233) * 43758.5453; return x - Math.floor(x); };
    const draw = () => {
      const n = sv(box, "k10an", "mol"), al = n / 3 * 27, o2 = n / 4 * 32, cb = n / 4 * 12, pool = 6 + n * 1.1, an = 70 - n * 0.9;
      let s = `<svg viewBox="0 0 360 264" role="img" aria-label="${L2("aluminium extraction cell", "অ্যালুমিনিয়াম নিষ্কাশন কোষ")}">
        <rect x="30" y="70" width="300" height="160" rx="6" fill="${CC10.steel}" opacity=".35" stroke="var(--ink)" stroke-width="2"/>
        <rect x="40" y="80" width="280" height="140" fill="${CC10.carbon}" opacity=".85"/>
        <rect x="48" y="88" width="264" height="124" fill="${CC10.melt}" opacity=".55"/>
        <rect x="48" y="${212 - pool}" width="264" height="${pool}" fill="${CC10.tin}"/>
        <text x="180" y="${209 - pool / 2 + 4}" font-size="13" text-anchor="middle" fill="var(--ink)">${n > 3 ? L2("molten Al", "গলিত Al") : ""}</text>`;
      [90, 165, 240].forEach(x => { s += `<rect x="${x}" y="${88 - 60}" width="30" height="${60 + an}" fill="${CC10.carbon}" stroke="var(--ink)"/>`; });
      s += `<path d="M105 28 V14 H255 V28 M180 14 V6" fill="none" stroke="var(--bad)" stroke-width="2.5"/><text x="188" y="12" font-size="14" font-weight="700" fill="var(--bad)">+ ${L2("anodes (carbon)", "অ্যানোড (কার্বন)")}</text>
        <path d="M30 150 H12 V244 H180 V230" fill="none" stroke="var(--c)" stroke-width="2.5"/><text x="20" y="258" font-size="14" font-weight="700" fill="var(--c)">− ${L2("cathode: graphite lining", "ক্যাথোড: গ্রাফাইট আস্তরণ")}</text>`;
      for (let k = 0; k < 7; k++) { const p = (rnd(k) + (n > 0 ? t * 0.3 : 0)) % 1, x = 66 + k * 38, y = 100 + p * (100 - pool); s += `<circle cx="${x}" cy="${y}" r="10" fill="var(--c)" opacity=".9"/><text x="${x}" y="${y + 4}" font-size="10.5" text-anchor="middle" fill="var(--paper)">Al³⁺</text>`; }
      for (let k = 0; k < 6; k++) { const p = (rnd(k + 30) + (n > 0 ? t * 0.3 : 0)) % 1, x = 100 + (k % 3) * 75 + rnd(k) * 10, y = 200 - pool - p * (100 - pool) ; s += `<circle cx="${x}" cy="${y}" r="10" fill="var(--bad)" opacity=".85"/><text x="${x}" y="${y + 4}" font-size="10.5" text-anchor="middle" fill="var(--paper)">O²⁻</text>`; }
      if (n > 0) for (let k = 0; k < 6; k++) { const p = (rnd(k + 50) + t * 0.6) % 1; s += `<circle cx="${95 + (k % 3) * 75 + rnd(k + 2) * 20}" cy="${88 + an - 4 - p * 40}" r="3" fill="none" stroke="var(--ink)"/>`; }
      s += `<text x="34" y="62" font-size="13.5" font-weight="700" fill="var(--ink)">${cry ? L2("≈ 800–1000 °C", "≈ ৮০০–১০০০ °C") : L2("≈ 2050 °C!", "≈ ২০৫০ °C!")}</text></svg>`;
      $("#k10asv", box).innerHTML = s;
      $("#k10ao", box).innerHTML = L2(`Cathode: 4Al³⁺ + 12e⁻ → 4Al. Anode: 6O²⁻ → 3O₂ + 12e⁻. With <b>${f10(n)} mol</b> of electrons: Al = ${f10(n)} ÷ 3 = ${f10(n / 3, 2)} mol = <b>${f10(al, 1)} g</b>; O₂ = ${f10(n)} ÷ 4 = ${f10(n / 4, 2)} mol = <b>${f10(o2, 1)} g</b>, which burns about <b>${f10(cb, 1)} g</b> of the carbon anodes to CO₂. `, `ক্যাথোড: 4Al³⁺ + 12e⁻ → 4Al। অ্যানোড: 6O²⁻ → 3O₂ + 12e⁻। <b>${f10(n)} mol</b> ইলেকট্রনে: Al = ${f10(n)} ÷ ৩ = ${f10(n / 3, 2)} mol = <b>${f10(al, 1)} g</b>; O₂ = ${f10(n)} ÷ ৪ = ${f10(n / 4, 2)} mol = <b>${f10(o2, 1)} g</b>, যা কার্বন অ্যানোডের প্রায় <b>${f10(cb, 1)} g</b> পুড়িয়ে CO₂ বানায়। `)
        + (cry ? L2("Cryolite lets the cell run more than 1000 °C cooler: a huge fuel saving.", "ক্রায়োলাইটের কারণে কোষটি ১০০০ °C-এরও বেশি কম তাপমাত্রায় চলে: বিপুল জ্বালানি সাশ্রয়।") : L2("Without cryolite the alumina must be kept above about 2050 °C, which is extremely costly and hard to contain.", "ক্রায়োলাইট ছাড়া অ্যালুমিনাকে প্রায় ২০৫০ °C-এর ওপরে রাখতে হয়, যা খুব ব্যয়বহুল ও সামলানো কঠিন।"));
    };
    chips10(box, ".k10ac", b => { cry = b.dataset.c === "1"; draw(); });
    $("#k10an", box).addEventListener("input", draw);
    draw();
    if (!REDUCED) animate(box, dt => { t += dt; draw(); });
  };

  /* ---- tab 4: blast furnace ---- */
  const furnace = (box) => {
    const Z = [
      [52, 110, L2("Top: ≈ 400–700 °C", "ওপরের অংশ: ≈ ৪০০–৭০০ °C"), ["3Fe₂O₃ + CO → 2Fe₃O₄ + CO₂", "Fe₃O₄ + CO → 3FeO + CO₂"], L2("The charge dries and rising CO starts reducing the ore step by step.", "মিশ্রণ শুকায় আর ওপরে ওঠা CO ধাপে ধাপে আকরিক বিজারণ শুরু করে।")],
      [110, 165, L2("Middle: ≈ 700–900 °C", "মাঝের অংশ: ≈ ৭০০–৯০০ °C"), ["FeO + CO → Fe + CO₂", "CaCO₃ → CaO + CO₂"], L2("Iron oxide is reduced to spongy iron; limestone decomposes into quicklime.", "আয়রন অক্সাইড বিজারিত হয়ে ঝাঁঝরা লোহা হয়; চুনাপাথর বিয়োজিত হয়ে চুন হয়।")],
      [165, 222, L2("Lower: ≈ 900–1500 °C", "নিচের অংশ: ≈ ৯০০–১৫০০ °C"), ["CO₂ + C → 2CO", L2("CaO + SiO₂ → CaSiO₃ (slag)", "CaO + SiO₂ → CaSiO₃ (ধাতুমল)"), "Fe₂O₃ + 3C → 2Fe + 3CO"], L2("CO₂ meets hot coke and becomes CO, the main reducing agent. Quicklime removes sand as slag. The iron melts.", "CO₂ গরম কোকের সংস্পর্শে CO হয়, যা প্রধান বিজারক। চুন বালিকে ধাতুমল হিসেবে সরায়। লোহা গলে যায়।")],
      [222, 256, L2("Air inlets: ≈ 1500–1900 °C", "বাতাস প্রবেশপথ: ≈ ১৫০০–১৯০০ °C"), ["C + O₂ → CO₂"], L2("Hot air burns the coke. This is the hottest zone and the heat source for the whole furnace.", "গরম বাতাসে কোক পোড়ে। এটাই সবচেয়ে গরম অঞ্চল আর পুরো চুল্লির তাপের উৎস।")],
      [256, 300, L2("Hearth", "তলদেশ"), [L2("molten slag floats on molten iron", "গলিত লোহার ওপর গলিত ধাতুমল ভাসে")], L2("Iron (with about 4% carbon) and slag are tapped off through separate holes.", "লোহা (প্রায় ৪% কার্বনসহ) আর ধাতুমল আলাদা ছিদ্র দিয়ে বের করা হয়।")]];
    let sel = 2, t = 0;
    box.innerHTML = `<div class="svgwrap fit" id="k10fsv"></div><div class="w-out" id="k10fo"></div>`;
    /* furnace half-width at height y */
    const hw = y => y < 52 ? 34 : y < 200 ? 34 + (y - 52) * 36 / 148 : y < 240 ? 70 - (y - 200) * 16 / 40 : 54;
    const cx = 150;
    const draw = () => {
      let s = `<svg viewBox="0 0 360 330" role="img" aria-label="${L2("blast furnace", "বাত্যাচুল্লি")}">${arrowDefs("k10fa", "var(--ink)")}${arrowDefs("k10fh", "var(--bad)")}`;
      Z.forEach((z, k) => {
        const [a, b] = z, col = ["var(--note)", "var(--note)", CC10.melt, "var(--bad)", "var(--bad)"][k];
        s += `<path data-z="${k}" style="cursor:pointer" d="M${cx - hw(a)} ${a} L${cx + hw(a)} ${a} L${cx + hw((a + b) / 2)} ${(a + b) / 2} L${cx + hw(b)} ${b} L${cx - hw(b)} ${b} L${cx - hw((a + b) / 2)} ${(a + b) / 2} Z" fill="${col}" opacity="${k === sel ? .55 : .12 + k * .06}" stroke="${k === sel ? "var(--ink)" : "none"}" stroke-width="2"/>`;
      });
      s += `<path d="M${cx - 34} 52 L${cx - 70} 200 L${cx - 54} 240 V300 H${cx + 54} V240 L${cx + 70} 200 L${cx + 34} 52" fill="none" stroke="var(--ink)" stroke-width="3" pointer-events="none"/>
        <rect x="${cx - 54}" y="270" width="108" height="14" fill="${CC10.slag}" opacity=".9" pointer-events="none"/><rect x="${cx - 54}" y="284" width="108" height="16" fill="${CC10.melt}" pointer-events="none"/>
        <path d="M${cx - 20} 8 L${cx - 30} 44 H${cx + 30} L${cx + 20} 8 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>
        <text x="${cx + 36}" y="20" font-size="13" fill="var(--ink)">${L2("ore + coke + limestone", "আকরিক + কোক + চুনাপাথর")}</text>
        <path d="M${cx + 34} 58 H${cx + 70} V36" fill="none" stroke="var(--muted)" stroke-width="2" marker-end="url(#k10fa)"/><text x="${cx + 76}" y="44" font-size="13" fill="var(--muted)">${L2("waste gases", "বর্জ্য গ্যাস")}</text>
        <path d="M6 236 H${cx - 60}" stroke="var(--bad)" stroke-width="3" marker-end="url(#k10fh)"/><path d="M${cx + 100} 236 H${cx + 62}" stroke="var(--bad)" stroke-width="3" marker-end="url(#k10fh)"/>
        <text x="4" y="228" font-size="13" fill="var(--bad)">${L2("hot air", "গরম বাতাস")}</text>
        <path d="M${cx + 54} 277 H${cx + 96}" stroke="${CC10.slag}" stroke-width="4" marker-end="url(#k10fa)"/><text x="${cx + 100}" y="282" font-size="13" fill="var(--ink)">${L2("slag", "ধাতুমল")}</text>
        <path d="M${cx - 54} 292 H${cx - 96}" stroke="${CC10.melt}" stroke-width="4" marker-end="url(#k10fa)"/><text x="${cx - 100}" y="312" font-size="13" text-anchor="middle" fill="var(--ink)">${L2("molten iron", "গলিত লোহা")}</text>`;
      for (let k = 0; k < 7; k++) { const p = ((k / 7) + t * 0.05) % 1, y = 56 + p * 150, x = cx - hw(y) * 0.7 + ((k * 37) % 10) / 10 * hw(y) * 1.4; s += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" rx="2" fill="${k % 3 === 0 ? CC10.carbon : k % 3 === 1 ? CC10.ore : "var(--muted)"}" pointer-events="none"/>`; }
      /* zone labels on the right */
      Z.forEach((z, k) => { const y = (z[0] + z[1]) / 2; if (k < 4) s += `<line x1="${cx + hw(y) + 2}" y1="${y}" x2="258" y2="${y}" stroke="var(--rule)" pointer-events="none"/><text x="262" y="${y + 5}" font-size="13" fill="${k === sel ? "var(--ink)" : "var(--muted)"}" font-weight="${k === sel ? 700 : 400}" pointer-events="none">${z[2].split(":")[0]}</text>`; });
      $("#k10fsv", box).innerHTML = s + `</svg>`;
      box.querySelectorAll("[data-z]").forEach(p => p.addEventListener("click", () => { sel = +p.dataset.z; draw(); }));
      const z = Z[sel];
      $("#k10fo", box).innerHTML = `<b>${z[2]}</b><br>${z[3].map(e => `<code>${e}</code>`).join("<br>")}<br>${z[4]}<br><span class="muted">${L2("Tap a zone of the furnace. Overall: Fe₂O₃ + 3CO → 2Fe + 3CO₂.", "চুল্লির কোনো অঞ্চলে চাপ দাও। সামগ্রিক: Fe₂O₃ + 3CO → 2Fe + 3CO₂।")}</span>`;
    };
    draw();
    if (!REDUCED) animate(box, dt => { t += dt; draw(); });
  };

  tabs10(el, "k10x", [L2("Reactivity → method", "সক্রিয়তা → পদ্ধতি"), L2("Concentration", "ঘনীকরণ"), L2("Aluminium cell", "অ্যালুমিনিয়াম কোষ"), L2("Blast furnace", "বাত্যাচুল্লি")], [route, conc, alcell, furnace]);
};

/* ================= 10.3 alloys builder + gold carat ================= */
W.k10alloy = (el) => {
  /* [name, parts [[sym, %, colour, radius factor]], uses, property] */
  const A = [
    [L2("Steel", "স্টিল"), [["Fe", 99, CC10.steel, 1], ["C", 1, CC10.carbon, 0.5]], L2("rails, wheels, ships, cranes, knives, tools", "রেললাইন, চাকা, জাহাজ, ক্রেন, ছুরি, যন্ত্রপাতি"), L2("small carbon atoms sit in the gaps and lock the iron layers: much stronger than pure iron", "ছোট কার্বন পরমাণু ফাঁকে বসে লোহার স্তর আটকে দেয়: বিশুদ্ধ লোহার চেয়ে অনেক মজবুত")],
    [L2("Stainless steel", "স্টেইনলেস স্টিল"), [["Fe", 74, CC10.steel, 1], ["Cr", 18, "#5f9ea0", 1.12], ["Ni", 8, "#8fbc8f", 0.9]], L2("spoons, sinks, surgical tools, chemical tanks", "চামচ, সিঙ্ক, অস্ত্রোপচারের যন্ত্র, রাসায়নিক ট্যাংক"), L2("chromium forms a tight oxide film: it does not rust", "ক্রোমিয়াম শক্ত অক্সাইড স্তর তৈরি করে: মরিচা পড়ে না")],
    [L2("Brass", "পিতল"), [["Cu", 65, CC10.copper, 1], ["Zn", 35, CC10.zinc, 1.15]], L2("ornaments, switches, door handles, pots", "অলংকার, সুইচ, দরজার হাতল, হাঁড়ি-পাতিল"), L2("harder than copper, golden colour, easy to shape", "কপারের চেয়ে শক্ত, সোনালি রং, সহজে আকার দেওয়া যায়")],
    [L2("Bronze (kansa)", "কাঁসা (ব্রোঞ্জ)"), [["Cu", 90, CC10.copper, 1], ["Sn", 10, CC10.tin, 1.25]], L2("plates, bowls, bells, statues, machine parts", "থালা, বাটি, ঘণ্টা, মূর্তি, যন্ত্রাংশ"), L2("much harder than copper and resists wear", "কপারের চেয়ে অনেক শক্ত, সহজে ক্ষয় হয় না")],
    [L2("Duralumin", "ডুরালমিন"), [["Al", 95, "#b0c4de", 1], ["Cu", 4, CC10.copper, 0.85], ["Mg,Mn,Fe", 1, "#9370db", 1.1]], L2("aircraft bodies, bicycle parts", "উড়োজাহাজের বডি, সাইকেলের যন্ত্রাংশ"), L2("light like aluminium but far stronger", "অ্যালুমিনিয়ামের মতো হালকা কিন্তু অনেক মজবুত")],
    [L2("22-carat gold", "২২ ক্যারেট সোনা"), [["Au", 91.67, CC10.gold, 1], ["Cu…", 8.33, CC10.copper, 0.9]], L2("ornaments", "অলংকার"), L2("hard enough to wear, still mostly gold", "পরার মতো যথেষ্ট শক্ত, তবু বেশিরভাগই সোনা")]];
  let sel = 2;
  el.innerHTML = `<div class="chipset k10lc" role="group">${A.map((a, k) => `<button data-i="${k}" aria-pressed="${k === sel}">${a[0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k10lsv"></div><div class="w-out" id="k10lo"></div>
    <p class="hint"><b>${L2("Gold ornament calculator", "সোনার গয়নার হিসাব")}</b></p>
    ${slider("k10lk", L2("Carat", "ক্যারেট"), 10, 24, 1, 22, L2("ct", "ক্যারেট"))}
    ${slider("k10lm", L2("Mass of ornament", "গয়নার ভর"), 0.25, 5, 0.25, 1, L2("bhori", "ভরি"))}
    <div class="svgwrap fit" id="k10gsv"></div><div class="w-out" id="k10go"></div>`;
  const rnd = k => { const x = Math.sin(k * 45.164) * 43758.5453; return x - Math.floor(x); };
  const lattice = (x0, parts, pure, label, ok) => {
    const r = 9, cols = 8, rows = 5; let s = "";
    const main = parts[0];
    for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
      const shift = rr < 2 ? (pure ? 9 : 3) : 0, x = x0 + 12 + c * 19 + shift, y = 90 + rr * 19;
      let col = main[2], rf = 1;
      if (!pure) { const q = rnd(rr * 10 + c + sel * 3) * 100; let acc = main[1]; for (let p = 1; p < parts.length; p++) { if (parts[p][3] < 0.6) continue; acc += parts[p][1]; if (q > main[1] && q <= acc) { col = parts[p][2]; rf = parts[p][3]; break; } } }
      s += `<circle cx="${x}" cy="${y}" r="${r * rf}" fill="${col}" stroke="var(--ink)" stroke-width=".6"/>`;
    }
    if (!pure && parts.some(p => p[3] < 0.6)) for (let k = 0; k < 6; k++) s += `<circle cx="${x0 + 21 + (k % 4) * 38 + 3}" cy="${99 + Math.floor(k / 4) * 38 + 19}" r="4" fill="${CC10.carbon}"/>`;
    s += `<text x="${x0 + 80}" y="72" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${label}</text>
      <path d="M${x0 + 20} 198 h${pure ? 110 : 40}" stroke="${ok ? "var(--good)" : "var(--bad)"}" stroke-width="3" marker-end="url(#k10lm${ok ? "g" : "b"})"/>
      <text x="${x0 + 80}" y="218" font-size="13" text-anchor="middle" fill="${ok ? "var(--good)" : "var(--bad)"}">${pure ? L2("layers slide: soft", "স্তর পিছলায়: নরম") : L2("layers jam: hard", "স্তর আটকে যায়: শক্ত")}</text>`;
    return s;
  };
  const draw = () => {
    const a = A[sel];
    let s = `<svg viewBox="0 0 360 226" role="img" aria-label="${L2("alloy composition and structure", "সংকর ধাতুর উপাদান ও গঠন")}">${arrowDefs("k10lmg", "var(--good)")}${arrowDefs("k10lmb", "var(--bad)")}`;
    let x = 10;
    a[1].forEach(p => { const w = p[1] / 100 * 340; s += `<rect x="${x}" y="6" width="${Math.max(w, 1.5)}" height="20" fill="${p[2]}" stroke="var(--paper)"/>`; x += w; });
    let lx = 10;
    a[1].forEach(p => { const t = `${p[0]} ${f10(p[1], 2)}%`; s += `<rect x="${lx}" y="32" width="10" height="10" fill="${p[2]}"/><text x="${lx + 14}" y="42" font-size="13" fill="var(--ink)">${t}</text>`; lx += 26 + t.length * 8.2; });
    s += lattice(2, a[1], true, L2("pure ", "বিশুদ্ধ ") + a[1][0][0], true) + lattice(182, a[1], false, a[0], false);
    $("#k10lsv", el).innerHTML = s + `</svg>`;
    $("#k10lo", el).innerHTML = `<b>${a[0]}</b>: ${a[1].map(p => `${p[0]} ${f10(p[1], 2)}%`).join(", ")}.<br>${L2("Why", "কেন")}: ${a[3]}.<br>${L2("Uses", "ব্যবহার")}: ${a[2]}.`;
  };
  const gold = () => {
    const c = sv(el, "k10lk", L2("ct", "ক্যারেট")), b = sv(el, "k10lm", L2("bhori", "ভরি"), 2), m = b * 11.664, fr = c / 24, au = m * fr, rest = m - au;
    let s = `<svg viewBox="0 0 360 76" role="img" aria-label="${L2("gold content", "সোনার পরিমাণ")}">
      <rect x="10" y="8" width="${340 * fr}" height="24" fill="${CC10.gold}"/><rect x="${10 + 340 * fr}" y="8" width="${340 * (1 - fr)}" height="24" fill="${CC10.copper}"/>
      <text x="16" y="25" font-size="14" font-weight="700" fill="var(--ink)">${L2("gold", "সোনা")} ${f10(fr * 100, 2)}%</text>
      <text x="10" y="54" font-size="13" fill="var(--muted)">${L2("softer", "নরম")}</text><text x="350" y="54" font-size="13" text-anchor="end" fill="var(--muted)">${L2("harder", "শক্ত")}</text>
      <rect x="60" y="45" width="240" height="8" rx="4" fill="var(--rule)"/><circle cx="${60 + 240 * (24 - c) / 14}" cy="49" r="8" fill="var(--c)"/>
      <text x="180" y="72" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("hardness (fewer carats = harder)", "কাঠিন্য (ক্যারেট কম = বেশি শক্ত)")}</text></svg>`;
    $("#k10gsv", el).innerHTML = s;
    $("#k10go", el).innerHTML = L2(`${f10(b, 2)} bhori = ${f10(b, 2)} × 11.664 = <b>${f10(m, 2)} g</b>. Gold fraction = ${f10(c)} ÷ 24 = ${f10(fr * 100, 2)}%, so pure gold = <b>${f10(au, 2)} g</b> and copper/other metals = <b>${f10(rest, 2)} g</b>.`,
      `${f10(b, 2)} ভরি = ${f10(b, 2)} × ১১.৬৬৪ = <b>${f10(m, 2)} g</b>। সোনার ভগ্নাংশ = ${f10(c)} ÷ ২৪ = ${f10(fr * 100, 2)}%, তাই বিশুদ্ধ সোনা = <b>${f10(au, 2)} g</b> আর কপার/অন্যান্য ধাতু = <b>${f10(rest, 2)} g</b>।`);
  };
  chips10(el, ".k10lc", b => { sel = +b.dataset.i; draw(); });
  ["k10lk", "k10lm"].forEach(id => $("#" + id, el).addEventListener("input", gold));
  draw(); gold();
};

/* ================= 10.4 corrosion protection with a scratch ================= */
W.k10protect = (el) => {
  /* [label, coat colour, kind] */
  const P = [
    [L2("No protection", "সুরক্ষা নেই"), null, "none"],
    [L2("Paint", "রং"), CC10.paint, "paint"],
    [L2("Oil / grease", "তেল / গ্রিজ"), "#caa24a", "oil"],
    [L2("Tin or nickel plating", "টিন বা নিকেলের প্রলেপ"), CC10.tin, "tin"],
    [L2("Galvanised (zinc)", "গ্যালভানাইজড (জিংক)"), CC10.zinc, "zinc"],
    [L2("Stainless steel", "স্টেইনলেস স্টিল"), null, "ss"]];
  let sel = 4, scr = true, salt = false;
  el.innerHTML = `<div class="chipset k10pc" role="group">${P.map((p, k) => `<button data-i="${k}" aria-pressed="${k === sel}">${p[0]}</button>`).join("")}</div>
    <div class="chipset k10pe" role="group"><button data-s="1" aria-pressed="true">${L2("Scratched", "আঁচড়সহ")}</button><button data-s="0" aria-pressed="false">${L2("Not scratched", "আঁচড় নেই")}</button></div>
    <div class="chipset k10pk" role="group"><button data-k="0" aria-pressed="true">${L2("Inland air", "ভেতরের জেলার বাতাস")}</button><button data-k="1" aria-pressed="false">${L2("Salty coastal air", "লবণাক্ত উপকূলের বাতাস")}</button></div>
    ${slider("k10pm", L2("Time", "সময়"), 0, 24, 1, 12, L2("months", "মাস"))}
    <div class="svgwrap fit" id="k10psv"></div><div class="w-out" id="k10po"></div>`;
  const rnd = k => { const x = Math.sin(k * 91.7) * 43758.5453; return x - Math.floor(x); };
  const draw = () => {
    const mo = sv(el, "k10pm", L2("months", "মাস")), k = mo * (salt ? 2.5 : 1), p = P[sel], kind = p[2], X = 180;
    let spread = 0, scratchRust = 0, zincUsed = 0, arrow = null, msg;
    if (kind === "none") { spread = Math.min(1, k / 12); }
    else if (kind === "paint") { scratchRust = scr ? Math.min(1, k / 10) : 0; }
    else if (kind === "oil") { spread = Math.max(0, Math.min(1, (k - 6) / 14)); scratchRust = scr ? Math.min(1, k / 12) : 0; }
    else if (kind === "tin") { scratchRust = scr ? Math.min(1, k / 6) : 0; if (scr) arrow = "fe"; }
    else if (kind === "zinc") { zincUsed = Math.min(1, k / (scr ? 30 : 60)); if (scr) arrow = "zn"; }
    let s = `<svg viewBox="0 0 360 220" role="img" aria-label="${L2("steel sheet with protective coating", "সুরক্ষা আবরণসহ স্টিলের পাত")}">${arrowDefs("k10pa", "var(--c)")}
      <text x="12" y="24" font-size="14" fill="var(--muted)">O₂ + H₂O${salt ? " + NaCl" : ""}</text>`;
    for (let j = 0; j < (salt ? 14 : 8); j++) s += `<circle cx="${20 + rnd(j) * 320}" cy="${40 + rnd(j + 5) * 50}" r="${2 + rnd(j + 2) * 2}" fill="${salt && j % 2 ? "var(--muted)" : CC10.water}" opacity=".5"/>`;
    const sheetY = 120, notch = scr && kind !== "none" ? `M${X - 10} ${sheetY - 10} L${X} ${sheetY + 8} L${X + 10} ${sheetY - 10}` : "";
    s += `<rect x="20" y="${sheetY}" width="320" height="50" fill="${kind === "ss" ? "#9fb0bb" : CC10.steel}"/><text x="180" y="${sheetY + 34}" font-size="14" text-anchor="middle" fill="var(--paper)">${kind === "ss" ? L2("stainless steel", "স্টেইনলেস স্টিল") : L2("steel (iron)", "স্টিল (লোহা)")}</text>`;
    if (p[1]) {
      const th = kind === "oil" ? Math.max(1, 8 * (1 - spread)) : 8;
      s += `<rect x="20" y="${sheetY - th}" width="320" height="${th}" fill="${p[1]}" opacity="${kind === "oil" ? .75 : 1}"/>`;
      if (kind === "zinc" && zincUsed > 0) { const w = zincUsed * (scr ? 140 : 320); s += scr ? `<rect x="${X - 10 - w / 2}" y="${sheetY - 11}" width="${w + 20}" height="5" fill="var(--paper)" stroke="var(--muted)" stroke-width=".6"/>` : `<rect x="20" y="${sheetY - 11}" width="320" height="${3 * zincUsed}" fill="var(--paper)" opacity=".9"/>`; }
    }
    if (kind === "ss") s += `<rect x="20" y="${sheetY - 2}" width="320" height="2" fill="#5f9ea0"/>`;
    if (notch) s += `<path d="${notch} Z" fill="var(--sheet)"/>`;
    if (kind === "ss" && scr) s += `<path d="M${X - 10} ${sheetY - 10} L${X} ${sheetY + 8} L${X + 10} ${sheetY - 10}" fill="none" stroke="#5f9ea0" stroke-width="2"/>`;
    /* rust */
    const blobs = (n, x0, x1, amt, seed) => { let g = ""; for (let j = 0; j < n; j++) { if (rnd(j + seed) > amt) continue; const x = x0 + rnd(j * 3 + seed) * (x1 - x0), rr = 3 + rnd(j + seed + 7) * 5 * (0.5 + amt); g += `<circle cx="${x}" cy="${sheetY - 2 + rnd(j + seed + 1) * 6}" r="${rr}" fill="${CC10.rust}" opacity=".9"/>`; } return g; };
    if (spread > 0) s += blobs(40, 22, 338, spread, 11);
    if (scratchRust > 0) { const w = 12 + scratchRust * (kind === "paint" ? 60 : kind === "tin" ? 70 : 20); s += blobs(24, X - w, X + w, Math.min(1, 0.4 + scratchRust), 50); if (kind === "paint" && scratchRust > 0.4) s += `<path d="M${X - w} ${sheetY - 8} q${w} -14 ${2 * w} 0" fill="none" stroke="${CC10.paint}" stroke-width="3"/>`; }
    if (arrow) {
      const zn = arrow === "zn";
      s += `<path d="M${zn ? X - 60 : X} ${zn ? sheetY - 14 : sheetY + 12} Q${zn ? X - 30 : X - 30} ${zn ? sheetY - 44 : sheetY - 40} ${zn ? X - 4 : X - 50} ${zn ? sheetY - 6 : sheetY - 14}" fill="none" stroke="var(--c)" stroke-width="2.5" marker-end="url(#k10pa)"/>
        <text x="${zn ? X - 150 : X - 146}" y="${sheetY - 46}" font-size="13" fill="var(--c)">e⁻: ${zn ? L2("Zn → iron", "Zn → লোহা") : L2("iron → Sn/Ni", "লোহা → Sn/Ni")}</text>`;
    }
    s += `<text x="180" y="${sheetY + 72}" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("rust", "মরিচা")}: <tspan fill="${CC10.rust}" font-weight="700">${f10(Math.round(Math.max(spread, scratchRust * (kind === "none" ? 1 : 0.35)) * 100))}%</tspan> ${L2("of surface", "পৃষ্ঠের")}</text></svg>`;
    $("#k10psv", el).innerHTML = s;
    const none = mo === 0 ? L2("Nothing has happened yet.", "এখনো কিছু ঘটেনি।") : "";
    if (kind === "none") msg = L2("Bare iron meets oxygen and water everywhere, so rust spreads over the whole surface and flakes off, exposing fresh iron.", "খালি লোহা সব জায়গায় অক্সিজেন ও পানির সংস্পর্শে আসে, তাই পুরো পৃষ্ঠে মরিচা ছড়ায় আর খসে পড়ে নতুন লোহা বের করে দেয়।");
    else if (kind === "paint") msg = scr ? L2("Paint protects only where it is unbroken. At the scratch iron rusts, and the rust creeps under the paint and lifts it.", "রং শুধু অক্ষত জায়গাতেই রক্ষা করে। আঁচড়ের জায়গায় লোহায় মরিচা পড়ে, আর মরিচা রঙের নিচে ঢুকে রং উঠিয়ে দেয়।") : L2("Unbroken paint keeps air and water away, so no rust forms. Repaint every few years.", "অক্ষত রং বাতাস ও পানি দূরে রাখে, তাই মরিচা পড়ে না। কয়েক বছর পরপর আবার রং করতে হয়।");
    else if (kind === "oil") msg = L2("An oil film works only while it lasts. It thins and wears off, so it must be applied again and again (good for tools and moving parts).", "তেলের স্তর যতক্ষণ থাকে ততক্ষণই কাজ করে। এটা পাতলা হয়ে উঠে যায়, তাই বারবার দিতে হয় (যন্ত্রপাতি ও চলমান অংশের জন্য ভালো)।");
    else if (kind === "tin") msg = scr ? L2("Tin and nickel are less reactive than iron. At a scratch the iron gives up electrons to them, so the exposed iron rusts even faster than bare iron.", "টিন ও নিকেল লোহার চেয়ে কম সক্রিয়। আঁচড়ের জায়গায় লোহা এদেরকে ইলেকট্রন দিয়ে দেয়, তাই খোলা লোহায় খালি লোহার চেয়েও দ্রুত মরিচা পড়ে।") : L2("While the plating is unbroken it shields the iron completely.", "প্রলেপ অক্ষত থাকলে লোহাকে পুরোপুরি আড়াল করে রাখে।");
    else if (kind === "zinc") msg = scr ? L2("Zinc is more reactive than iron. At the scratch zinc gives up its electrons and slowly corrodes (white layer) instead of the iron: sacrificial protection. No rust!", "জিংক লোহার চেয়ে বেশি সক্রিয়। আঁচড়ের জায়গায় লোহার বদলে জিংক ইলেকট্রন ছেড়ে ধীরে ধীরে ক্ষয় হয় (সাদা স্তর): আত্মত্যাগী সুরক্ষা। মরিচা নেই!") : L2("The zinc layer slowly forms a dull white coat while the iron underneath stays safe.", "জিংকের স্তর ধীরে ধীরে নিষ্প্রভ সাদা আবরণ তৈরি করে, আর নিচের লোহা নিরাপদ থাকে।");
    else msg = L2("Chromium in the alloy forms a thin, tight oxide film. Even at a scratch the film re-forms at once, so stainless steel does not rust.", "সংকর ধাতুর ক্রোমিয়াম পাতলা, শক্ত অক্সাইড স্তর তৈরি করে। আঁচড় লাগলেও স্তরটি সাথে সাথে আবার তৈরি হয়, তাই স্টেইনলেস স্টিলে মরিচা পড়ে না।");
    $("#k10po", el).innerHTML = `<b>${p[0]}</b>, ${L2(`${mo} months`, `${B10(mo)} মাস`)}${salt ? L2(", salty air (about 2.5× faster)", ", লবণাক্ত বাতাস (প্রায় ২.৫ গুণ দ্রুত)") : ""}: ${none} ${msg}`;
  };
  chips10(el, ".k10pc", b => { sel = +b.dataset.i; draw(); });
  chips10(el, ".k10pe", b => { scr = b.dataset.s === "1"; draw(); });
  chips10(el, ".k10pk", b => { salt = b.dataset.k === "1"; draw(); });
  $("#k10pm", el).addEventListener("input", draw);
  draw();
};

/* ================= 10.5 sulfur: Frasch pipe, contact process, properties ================= */
W.k10sulfur = (el) => {
  const frasch = (box) => {
    let t = 0;
    box.innerHTML = `${slider("k10sw", L2("Temperature of the water sent down", "পাঠানো পানির তাপমাত্রা"), 90, 180, 5, 165, "°C")}
      <div class="svgwrap fit" id="k10ssv"></div><div class="w-out" id="k10so"></div>`;
    const draw = () => {
      const T = sv(box, "k10sw", "°C"), melt = T > 115, cx = 150, off = -t * 30;
      let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("Frasch method", "ফ্রাশ পদ্ধতি")}">
        <rect x="0" y="50" width="360" height="250" fill="${CC10.sand}" opacity=".35"/><rect x="0" y="200" width="360" height="60" fill="${CC10.sulfur}" opacity=".55"/>
        <line x1="0" y1="50" x2="360" y2="50" stroke="var(--ink)" stroke-width="2"/><text x="354" y="68" font-size="13" text-anchor="end" fill="var(--muted)">${L2("rock and soil", "শিলা ও মাটি")}</text>
        <text x="354" y="236" font-size="14" text-anchor="end" font-weight="700" fill="var(--ink)">${L2("sulfur layer", "সালফার স্তর")}</text>`;
      if (melt) s += `<ellipse cx="${cx}" cy="238" rx="70" ry="18" fill="${CC10.sulfur}"/>`;
      s += `<rect x="${cx - 30}" y="20" width="60" height="222" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><rect x="${cx - 19}" y="10" width="38" height="226" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><rect x="${cx - 7}" y="4" width="14" height="228" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>
        <line x1="${cx - 25}" y1="22" x2="${cx - 25}" y2="236" stroke="var(--bad)" stroke-width="5" stroke-dasharray="8 8" stroke-dashoffset="${off}"/>
        <line x1="${cx + 25}" y1="22" x2="${cx + 25}" y2="236" stroke="var(--bad)" stroke-width="5" stroke-dasharray="8 8" stroke-dashoffset="${off}"/>
        <line x1="${cx}" y1="6" x2="${cx}" y2="230" stroke="${CC10.air}" stroke-width="5" stroke-dasharray="8 8" stroke-dashoffset="${off}"/>`;
      if (melt) s += `<line x1="${cx - 13}" y1="232" x2="${cx - 13}" y2="12" stroke="${CC10.sulfur}" stroke-width="5" stroke-dasharray="8 8" stroke-dashoffset="${off}"/><line x1="${cx + 13}" y1="232" x2="${cx + 13}" y2="12" stroke="${CC10.sulfur}" stroke-width="5" stroke-dasharray="8 8" stroke-dashoffset="${off}"/>
        <path d="M${cx + 19} 14 H270 V30" fill="none" stroke="${CC10.sulfur}" stroke-width="6"/><rect x="250" y="30" width="44" height="18" fill="${CC10.sulfur}" stroke="var(--ink)"/>`;
      s += `<text x="6" y="100" font-size="13" fill="var(--bad)">↓ ${L2("hot water", "গরম পানি")}</text><text x="6" y="118" font-size="13" fill="var(--bad)">(${L2("outer pipe", "বাইরের পাইপ")})</text>
        <text x="6" y="150" font-size="13" fill="${CC10.air}">↓ ${L2("hot air", "গরম বাতাস")}</text><text x="6" y="168" font-size="13" fill="${CC10.air}">${L2("20–22 atm", "২০–২২ atm")}</text><text x="6" y="186" font-size="13" fill="${CC10.air}">(${L2("inner pipe", "ভেতরের পাইপ")})</text>
        <text x="200" y="110" font-size="13" fill="var(--ink)">↑ ${L2("molten sulfur", "গলিত সালফার")}</text><text x="200" y="128" font-size="13" fill="var(--ink)">(${L2("middle pipe", "মাঝের পাইপ")})</text></svg>`;
      $("#k10ssv", box).innerHTML = s;
      $("#k10so", box).innerHTML = (T > 100 ? L2(`Water at ${T} °C can stay liquid only under extra pressure: <b>superheated water</b>. `, `${B10(T)} °C-এর পানি শুধু বাড়তি চাপেই তরল থাকতে পারে: <b>সুপারহিটেড পানি</b>। `) : "")
        + (melt ? L2(`It is hotter than sulfur's melting point (about 115 °C), so the sulfur melts and the compressed air froths it up the middle pipe.`, `এটি সালফারের গলনাঙ্কের (প্রায় ১১৫ °C) চেয়ে গরম, তাই সালফার গলে যায় আর সংকুচিত বাতাস একে ফেনিয়ে মাঝের পাইপ দিয়ে ওপরে তোলে।`)
          : L2(`That is below sulfur's melting point (about 115 °C): the sulfur stays solid and nothing comes up.`, `এটি সালফারের গলনাঙ্কের (প্রায় ১১৫ °C) চেয়ে কম: সালফার কঠিনই থাকে, কিছুই ওপরে আসে না।`));
    };
    $("#k10sw", box).addEventListener("input", draw);
    draw();
    if (!REDUCED) animate(box, dt => { t += dt; draw(); });
  };
  const contact = (box) => {
    const S = [
      [L2("1. Furnace", "১. চুল্লি"), "S + O₂ → SO₂", L2("sulfur burnt in dry air; dust removed", "শুষ্ক বায়ুতে সালফার পোড়ানো; ধুলা সরানো")],
      [L2("2. Converter", "২. রূপান্তর চুল্লি"), "2SO₂ + O₂ ⇌ 2SO₃", L2("V₂O₅ catalyst, ≈ 450 °C, ≈ 1–2 atm, extra air", "V₂O₅ প্রভাবক, ≈ ৪৫০ °C, ≈ ১–২ atm, বাড়তি বাতাস")],
      [L2("3. Absorber", "৩. শোষক"), "H₂SO₄ + SO₃ → H₂S₂O₇", L2("SO₃ absorbed in 98% H₂SO₄ → oleum (avoids acid mist)", "৯৮% H₂SO₄-এ SO₃ শোষণ → অলিয়াম (এসিডের কুয়াশা এড়ায়)")],
      [L2("4. Dilution", "৪. লঘুকরণ"), "H₂S₂O₇ + H₂O → 2H₂SO₄", L2("oleum mixed with the right amount of water", "অলিয়ামে পরিমাণমতো পানি মেশানো")]];
    let sel = 1;
    /* approximate equilibrium conversion of SO2 (typical gas, ~1 atm) */
    const YT = [[350, 99.5], [400, 99], [450, 97], [500, 93], [550, 86], [600, 76], [650, 64]];
    const yld = T => { for (let k = 1; k < YT.length; k++) if (T <= YT[k][0]) { const [a, ya] = YT[k - 1], [b, yb] = YT[k]; return ya + (yb - ya) * (T - a) / (b - a); } return 64; };
    const rate = T => Math.exp(-100000 / 8.314 * (1 / (T + 273) - 1 / 723));
    box.innerHTML = `<div class="svgwrap fit" id="k10csv2"></div><div class="w-out" id="k10co2"></div>
      ${slider("k10ct", L2("Converter temperature", "রূপান্তর চুল্লির তাপমাত্রা"), 350, 650, 10, 450, "°C")}
      <div class="svgwrap fit" id="k10ctv"></div><div class="w-out" id="k10cto"></div>`;
    const draw = () => {
      let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("contact process steps", "স্পর্শ পদ্ধতির ধাপ")}">${arrowDefs("k10ka", "var(--ink)")}`;
      S.forEach((st, k) => {
        const y = 4 + k * 62, on = k === sel;
        s += `<g data-k="${k}" style="cursor:pointer"><rect x="10" y="${y}" width="340" height="46" rx="9" fill="${on ? "var(--c)" : "var(--c-soft)"}" stroke="var(--c)"/>
          <text x="22" y="${y + 20}" font-size="14" font-weight="700" fill="${on ? "var(--paper)" : "var(--ink)"}">${st[0]}</text>
          <text x="22" y="${y + 38}" font-size="14" fill="${on ? "var(--paper)" : "var(--ink)"}">${st[1]}</text></g>`;
        if (k < 3) s += `<line x1="180" y1="${y + 46}" x2="180" y2="${y + 60}" stroke="var(--ink)" stroke-width="2" marker-end="url(#k10ka)"/>`;
      });
      $("#k10csv2", box).innerHTML = s + `</svg>`;
      box.querySelectorAll("#k10csv2 [data-k]").forEach(g => g.addEventListener("click", () => { sel = +g.dataset.k; draw(); }));
      $("#k10co2", box).innerHTML = `<b>${S[sel][0]}</b>: <code>${S[sel][1]}</code><br>${S[sel][2]}.`;
    };
    const temp = () => {
      const T = sv(box, "k10ct", "°C"), y = yld(T), r = Math.min(rate(T), 20);
      const rw = Math.min(1, Math.log10(1 + r * 9) / Math.log10(1 + 20 * 9));
      let s = `<svg viewBox="0 0 360 90" role="img" aria-label="${L2("yield and rate", "উৎপাদ ও গতি")}">
        <text x="4" y="22" font-size="13.5" fill="var(--ink)">${L2("SO₃ yield", "SO₃ উৎপাদ")}</text><rect x="110" y="8" width="200" height="18" rx="4" fill="var(--rule)"/><rect x="110" y="8" width="${2 * y}" height="18" rx="4" fill="var(--good)"/><text x="316" y="22" font-size="13.5" fill="var(--ink)">${f10(y, 0)}%</text>
        <text x="4" y="54" font-size="13.5" fill="var(--ink)">${L2("rate", "গতি")}</text><rect x="110" y="40" width="200" height="18" rx="4" fill="var(--rule)"/><rect x="110" y="40" width="${200 * rw}" height="18" rx="4" fill="var(--note)"/><text x="316" y="54" font-size="13.5" fill="var(--ink)">×${f10(rate(T), rate(T) < 1 ? 2 : 1)}</text>
        <text x="180" y="82" font-size="12.5" text-anchor="middle" fill="var(--muted)">${L2("rate compared with 450 °C; yield values approximate", "গতি ৪৫০ °C-এর তুলনায়; উৎপাদের মান আনুমানিক")}</text></svg>`;
      $("#k10ctv", box).innerHTML = s;
      $("#k10cto", box).innerHTML = T < 420 ? L2("Low temperature: the exothermic forward reaction is favoured and the yield is high, but the reaction is too slow even with the catalyst.", "কম তাপমাত্রা: তাপোৎপাদী সম্মুখ বিক্রিয়া অনুকূল, উৎপাদ বেশি, কিন্তু প্রভাবকসহও বিক্রিয়া খুব ধীর।")
        : T <= 490 ? L2("The compromise: a good yield at a useful speed, helped by the V₂O₅ catalyst. This is roughly what factories use.", "আপস: V₂O₅ প্রভাবকের সাহায্যে কাজের মতো গতিতে ভালো উৎপাদ। কারখানায় মোটামুটি এটাই ব্যবহার হয়।")
          : L2("High temperature: fast, but Le Chatelier's principle says the equilibrium shifts back towards SO₂ + O₂, so the yield falls.", "উচ্চ তাপমাত্রা: দ্রুত, কিন্তু লা-শাতেলিয়ার নীতি অনুসারে সাম্যাবস্থা SO₂ + O₂-এর দিকে সরে যায়, তাই উৎপাদ কমে।");
    };
    $("#k10ct", box).addEventListener("input", temp);
    draw(); temp();
  };
  const props = (box) => {
    const P = [
      [L2("Acid", "এসিড ধর্ম"), L2("dilute H₂SO₄ + lime water", "লঘু H₂SO₄ + চুনের পানি"), "H₂SO₄ + Ca(OH)₂ → CaSO₄ + 2H₂O", L2("the clear lime water turns milky: white CaSO₄ forms (neutralisation)", "স্বচ্ছ চুনের পানি ঘোলা হয়: সাদা CaSO₄ তৈরি হয় (প্রশমন)")],
      [L2("Oxidising", "জারণ ধর্ম"), L2("conc. H₂SO₄ + potassium iodide", "গাঢ় H₂SO₄ + পটাশিয়াম আয়োডাইড"), "2KI + 2H₂SO₄ → K₂SO₄ + I₂ + SO₂ + 2H₂O", L2("the white solid turns brown as iodine is set free; hot conc. acid also oxidises copper: Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O", "সাদা কঠিন পদার্থ বাদামি হয়, কারণ আয়োডিন মুক্ত হয়; গরম গাঢ় এসিড কপারকেও জারিত করে: Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O")],
      [L2("Dehydrating", "নিরুদন ধর্ম"), L2("conc. H₂SO₄ + sugar (teacher demo)", "গাঢ় H₂SO₄ + চিনি (শিক্ষকের প্রদর্শন)"), "C₁₂H₂₂O₁₁ + H₂SO₄ → 12C + H₂SO₄·11H₂O", L2("white sugar turns into a hot, black, spongy column of carbon that rises out of the tube", "সাদা চিনি গরম, কালো, স্পঞ্জের মতো কার্বনের স্তম্ভে পরিণত হয়ে টিউব থেকে ফুলে ওঠে")]];
    let sel = 0;
    box.innerHTML = `<div class="chipset k10qc" role="group">${P.map((p, k) => `<button data-i="${k}" aria-pressed="${k === 0}">${p[0]}</button>`).join("")}</div>
      <div class="svgwrap fit" id="k10qsv"></div><div class="w-out" id="k10qo"></div>`;
    const tube = (x, fill, top, extra, label) => `<path d="M${x - 22} 30 V160 a22 22 0 0 0 44 0 V30" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <path d="M${x - 20} ${top} V160 a20 20 0 0 0 40 0 V${top} Z" fill="${fill}"/>${extra}<text x="${x}" y="206" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${label}</text>`;
    const draw = () => {
      const p = P[sel];
      let s = `<svg viewBox="0 0 360 215" role="img" aria-label="${p[1]}">${arrowDefs("k10qa", "var(--ink)")}`;
      if (sel === 0) s += tube(90, CC10.water + "33", 90, "", L2("before", "আগে")) + tube(270, "var(--paper)", 90, `<path d="M248 90 V160 a20 20 0 0 0 40 0 V90 Z" fill="var(--muted)" opacity=".35"/>`, L2("after", "পরে"));
      else if (sel === 1) s += tube(90, "var(--paper)", 140, `<path d="M70 140 V160 a20 20 0 0 0 40 0 V140 Z" fill="var(--muted)" opacity=".25"/>`, "KI") + tube(270, "#8b4513", 140, "", L2("brown I₂", "বাদামি I₂"));
      else s += tube(90, "var(--paper)", 120, `<path d="M70 120 V160 a20 20 0 0 0 40 0 V120 Z" fill="var(--muted)" opacity=".2"/>`, L2("sugar", "চিনি")) + tube(270, CC10.carbon, 50, `<path d="M250 50 q-6 -30 20 -36 q24 4 20 36 Z" fill="${CC10.carbon}"/>`, L2("carbon", "কার্বন"));
      s += `<line x1="130" y1="100" x2="226" y2="100" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#k10qa)"/><text x="178" y="90" font-size="13.5" text-anchor="middle" fill="var(--ink)">+ H₂SO₄</text></svg>`;
      $("#k10qsv", box).innerHTML = s;
      $("#k10qo", box).innerHTML = `<b>${p[0]}</b>: ${p[1]}<br><code>${p[2]}</code><br>${L2("Observation", "পর্যবেক্ষণ")}: ${p[3]}.`;
    };
    chips10(box, ".k10qc", b => { sel = +b.dataset.i; draw(); });
    draw();
  };
  tabs10(el, "k10s", [L2("Frasch pipe", "ফ্রাশ পাইপ"), L2("Contact process", "স্পর্শ পদ্ধতি"), L2("Properties of H₂SO₄", "H₂SO₄-এর ধর্ম")], [frasch, contact, props]);
};
