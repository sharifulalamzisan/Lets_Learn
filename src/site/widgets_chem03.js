/* ---- chemistry chapter 3 widgets: structure of matter ---- */
const B3 = x => bnNum(x, LANG);
const f3 = (x, d = 0) => {
  if (!isFinite(x)) return "—";
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e7 || a < 1e-3)) { const e = Math.floor(Math.log10(a)); let m = x / Math.pow(10, e); m = +m.toFixed(2); return B3(m + " × 10<sup>" + e + "</sup>").replace("-", "−"); }
  let s = (+x.toFixed(d)).toFixed(d);
  if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
  return B3(s).replace("-", "−");
};
const chips3 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const onIn3 = (el, fn) => el.querySelectorAll("input").forEach(i => i.addEventListener("input", fn));
/* chemical formula: "H2SO4" → H<sub>2</sub>SO<sub>4</sub> (digits stay Latin) */
const fx3 = s => s.replace(/(\d+)/g, "<sub>$1</sub>");
const SUBD = "₀₁₂₃₄₅₆₇₈₉", SUPD = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const usub3 = s => String(s).replace(/\d/g, d => SUBD[d]);
const usup3 = s => String(s).replace(/\d/g, d => SUPD[d]);
/* atom colours (theme variables only) */
const AC3 = { H: ["var(--sheet)", 0.62], O: ["var(--bad)", 1], C: ["var(--ink)", 1], N: ["var(--c)", 1], Cl: ["var(--good)", 1.05], S: ["var(--note)", 1.1], He: ["var(--muted)", 0.85], Ne: ["var(--muted)", 0.9], Ar: ["var(--muted)", 1] };
/* molecule shapes: [symbol, x, y] in units of the atom radius */
const MOL3 = {
  He: [["He", 0, 0]], Ne: [["Ne", 0, 0]], Ar: [["Ar", 0, 0]],
  H2: [["H", -0.55, 0], ["H", 0.55, 0]], O2: [["O", -0.8, 0], ["O", 0.8, 0]], N2: [["N", -0.8, 0], ["N", 0.8, 0]], Cl2: [["Cl", -0.85, 0], ["Cl", 0.85, 0]],
  H2O: [["H", -0.95, 0.72], ["H", 0.95, 0.72], ["O", 0, 0]], CO2: [["O", -1.65, 0], ["O", 1.65, 0], ["C", 0, 0]],
  NH3: [["H", -1, 0.62], ["H", 1, 0.62], ["H", 0, -1.1], ["N", 0, 0]], CH4: [["H", -0.95, -0.95], ["H", 0.95, -0.95], ["H", -0.95, 0.95], ["H", 0.95, 0.95], ["C", 0, 0]],
  HCl: [["H", -0.95, 0], ["Cl", 0.4, 0]],
  H2SO4: [["H", -2.75, -0.75], ["H", 2.75, 0.75], ["O", -1.75, 0], ["O", 1.75, 0], ["O", 0, -1.75], ["O", 0, 1.75], ["S", 0, 0]]
};
const drawMol3 = (key, cx, cy, r, ang = 0) => {
  const c = Math.cos(ang), s = Math.sin(ang);
  return MOL3[key].map(([el, x, y]) => { const [col, k] = AC3[el]; const X = cx + r * (x * c - y * s), Y = cy + r * (x * s + y * c);
    return `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="${(r * k).toFixed(1)}" fill="${col}" stroke="var(--ink)" stroke-width="1"/>`; }).join("");
};
const legend3 = els => `<div class="w-row" style="flex-wrap:wrap;gap:10px;font-size:14px">${els.map(e => `<span style="display:inline-flex;align-items:center;gap:5px"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="${AC3[e][0]}" stroke="var(--ink)"/></svg>${e}</span>`).join("")}</div>`;

/* element data Z = 1..30: symbol, English, Bangla, common mass number */
const EL3 = [null, ["H", "Hydrogen", "হাইড্রোজেন", 1], ["He", "Helium", "হিলিয়াম", 4], ["Li", "Lithium", "লিথিয়াম", 7], ["Be", "Beryllium", "বেরিলিয়াম", 9], ["B", "Boron", "বোরন", 11],
  ["C", "Carbon", "কার্বন", 12], ["N", "Nitrogen", "নাইট্রোজেন", 14], ["O", "Oxygen", "অক্সিজেন", 16], ["F", "Fluorine", "ফ্লোরিন", 19], ["Ne", "Neon", "নিয়ন", 20],
  ["Na", "Sodium", "সোডিয়াম", 23], ["Mg", "Magnesium", "ম্যাগনেসিয়াম", 24], ["Al", "Aluminium", "অ্যালুমিনিয়াম", 27], ["Si", "Silicon", "সিলিকন", 28], ["P", "Phosphorus", "ফসফরাস", 31],
  ["S", "Sulfur", "সালফার", 32], ["Cl", "Chlorine", "ক্লোরিন", 35], ["Ar", "Argon", "আর্গন", 40], ["K", "Potassium", "পটাশিয়াম", 39], ["Ca", "Calcium", "ক্যালসিয়াম", 40],
  ["Sc", "Scandium", "স্ক্যান্ডিয়াম", 45], ["Ti", "Titanium", "টাইটেনিয়াম", 48], ["V", "Vanadium", "ভ্যানাডিয়াম", 51], ["Cr", "Chromium", "ক্রোমিয়াম", 52], ["Mn", "Manganese", "ম্যাঙ্গানিজ", 55],
  ["Fe", "Iron", "আয়রন", 56], ["Co", "Cobalt", "কোবাল্ট", 59], ["Ni", "Nickel", "নিকেল", 58], ["Cu", "Copper", "কপার", 63], ["Zn", "Zinc", "জিংক", 64]];
const elName3 = z => EL3[z] ? L2(EL3[z][1], EL3[z][2]) : "?";

/* ground-state configuration (Aufbau with the Cr and Cu exceptions), Z ≤ 36 */
const ORDER3 = [["1s", 1, 0], ["2s", 2, 0], ["2p", 2, 1], ["3s", 3, 0], ["3p", 3, 1], ["4s", 4, 0], ["3d", 3, 2], ["4p", 4, 1]];
const cfg3 = z => {
  let left = z; const out = ORDER3.map(([name, n, l]) => { const cap = 2 * (2 * l + 1), k = Math.min(cap, left); left -= k; return { name, n, l, cap, e: k }; });
  const g = nm => out.find(o => o.name === nm);
  if (z === 24 || z === 29) { g("4s").e = 1; g("3d").e = z === 24 ? 5 : 10; }
  return out;
};
const shells3 = z => { const s = [0, 0, 0, 0]; cfg3(z).forEach(o => s[o.n - 1] += o.e); while (s.length && !s[s.length - 1]) s.pop(); return s; };
/* written configuration, grouped by shell (3d before 4s) */
const cfgStr3 = z => cfg3(z).filter(o => o.e).sort((a, b) => a.n - b.n || a.l - b.l).map(o => o.name + usup3(o.e)).join(" ");

/* deterministic pseudo-random */
const rng3 = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
/* nucleus: p protons + n neutrons packed in a sunflower pattern */
const nucleus3 = (cx, cy, p, n, rr = 5) => {
  const N = p + n, R = rng3(p * 131 + n * 7 + 3), kinds = [];
  for (let i = 0; i < N; i++) kinds.push(i < p ? 1 : 0);
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
  let g = "";
  for (let i = N - 1; i >= 0; i--) { const rad = rr * 1.05 * Math.sqrt(i + 0.5), th = i * 2.39996;
    g += `<circle cx="${(cx + rad * Math.cos(th)).toFixed(1)}" cy="${(cy + rad * Math.sin(th)).toFixed(1)}" r="${rr}" fill="${kinds[i] ? "var(--bad)" : "var(--muted)"}" stroke="var(--ink)" stroke-width=".7"/>`; }
  return g;
};

/* ============ 3.2 particle sorter ============ */
W.k3sort = (el) => {
  const CAT = [L2("Atoms of an element", "মৌলের পরমাণু"), L2("Molecules of an element", "মৌলের অণু"), L2("Molecules of a compound", "যৌগের অণু"), L2("Mixture", "মিশ্রণ")];
  const IT = [
    [["O2", 6]], 1, L2("oxygen gas, O₂", "অক্সিজেন গ্যাস, O₂"),
    [["H2O", 6]], 2, L2("water, H₂O", "পানি, H₂O"),
    [["He", 7]], 0, L2("helium gas: single He atoms", "হিলিয়াম গ্যাস: একক He পরমাণু"),
    [["N2", 4], ["O2", 2]], 3, L2("air: N₂ and O₂ molecules mixed, not bonded to each other", "বাতাস: N₂ ও O₂ অণু মিশে আছে, একে অপরের সাথে বন্ধনে নয়"),
    [["CO2", 5]], 2, L2("carbon dioxide, CO₂", "কার্বন ডাই-অক্সাইড, CO₂"),
    [["Cl2", 6]], 1, L2("chlorine gas, Cl₂", "ক্লোরিন গ্যাস, Cl₂"),
    [["NH3", 5]], 2, L2("ammonia, NH₃", "অ্যামোনিয়া, NH₃"),
    [["Ar", 4], ["H2", 3]], 3, L2("argon atoms mixed with hydrogen molecules", "আর্গন পরমাণু আর হাইড্রোজেন অণুর মিশ্রণ"),
    [["N2", 6]], 1, L2("nitrogen gas, N₂", "নাইট্রোজেন গ্যাস, N₂"),
    [["Ne", 6]], 0, L2("neon gas: single Ne atoms", "নিয়ন গ্যাস: একক Ne পরমাণু"),
    [["H2O", 3], ["CO2", 3]], 3, L2("soda water: H₂O and CO₂ molecules mixed", "সোডা পানি: H₂O ও CO₂ অণু মিশে আছে"),
    [["CH4", 5]], 2, L2("methane (natural gas), CH₄", "মিথেন (প্রাকৃতিক গ্যাস), CH₄")];
  const items = []; for (let i = 0; i < IT.length; i += 3) items.push({ parts: IT[i], ans: IT[i + 1], name: IT[i + 2] });
  let k = 0, score = 0, done = 0, answered = false;
  el.innerHTML = `<div class="w-row" style="justify-content:space-between"><b id="k3sn"></b><span class="muted" id="k3ss"></span></div>
    <div class="svgwrap fit" id="k3ssv"></div>${legend3(["H", "C", "N", "O", "Cl", "He", "Ne", "Ar"])}
    <div class="chipset" id="k3sc" role="group">${CAT.map((c, i) => `<button data-i="${i}" aria-pressed="false">${c}</button>`).join("")}</div>
    <div class="w-out" id="k3so"></div><div class="w-row"><button class="btn solid" id="k3snx">${L2("Next picture", "পরের ছবি")}</button></div>`;
  const draw = () => {
    const it = items[k], R = rng3(k * 97 + 11); const list = [];
    it.parts.forEach(([m, c]) => { for (let i = 0; i < c; i++) list.push(m); });
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    let g = `<svg viewBox="0 0 360 190" role="img" aria-label="${L2("particle picture", "কণার ছবি")}"><rect x="20" y="8" width="320" height="174" rx="12" fill="var(--c-soft)" stroke="var(--rule)" stroke-width="2"/>`;
    const cols = 4, rows = Math.ceil(list.length / cols);
    list.forEach((m, i) => { const cx = 62 + (i % cols) * 78 + (R() - 0.5) * 16, cy = 95 + (Math.floor(i / cols) - (rows - 1) / 2) * 62 + (R() - 0.5) * 12;
      g += drawMol3(m, cx, cy, m === "CO2" ? 11 : 14, R() * 6.28); });
    $("#k3ssv", el).innerHTML = g + "</svg>";
    $("#k3sn", el).textContent = L2("Picture ", "ছবি ") + B3(k + 1) + " / " + B3(items.length);
    $("#k3ss", el).textContent = L2("Score: ", "স্কোর: ") + B3(score) + " / " + B3(done);
    el.querySelectorAll("#k3sc button").forEach(b => { b.setAttribute("aria-pressed", "false"); b.disabled = false; });
    $("#k3so", el).innerHTML = L2("What does this box contain? Tap an answer.", "এই বাক্সে কী আছে? একটি উত্তরে চাপ দাও।");
    answered = false;
  };
  el.querySelectorAll("#k3sc button").forEach(b => b.addEventListener("click", () => {
    if (answered) return; answered = true; const i = +b.dataset.i, it = items[k], ok = i === it.ans; done++; if (ok) score++;
    el.querySelectorAll("#k3sc button").forEach(q => q.setAttribute("aria-pressed", +q.dataset.i === it.ans));
    const why = [L2("every particle is one single atom of the same element", "প্রতিটি কণা একই মৌলের একটি একক পরমাণু"), L2("every particle has two or more atoms, all of the same kind", "প্রতিটি কণায় দুই বা ততোধিক পরমাণু, সবগুলো একই ধরনের"),
      L2("every particle is the same, and each contains atoms of different elements", "সব কণা একই রকম, আর প্রতিটিতে ভিন্ন ভিন্ন মৌলের পরমাণু"), L2("there are two different kinds of particle, not bonded to each other", "দুই ধরনের আলাদা কণা আছে, যারা একে অপরের সাথে বন্ধনে যুক্ত নয়")][it.ans];
    $("#k3so", el).innerHTML = (ok ? `<b style="color:var(--good)">${L2("Correct!", "ঠিক!")}</b> ` : `<b style="color:var(--bad)">${L2("Not quite.", "হয়নি।")}</b> ${L2("It is", "এটি")} <b>${LANG === "en" ? CAT[it.ans].toLowerCase() : CAT[it.ans]}</b>: `) + why + L2(". ", "। ") + it.name + L2(".", "।");
    $("#k3ss", el).textContent = L2("Score: ", "স্কোর: ") + B3(score) + " / " + B3(done);
  }));
  $("#k3snx", el).addEventListener("click", () => { k = (k + 1) % items.length; if (k === 0) { score = 0; done = 0; } draw(); });
  draw();
};

/* ============ 3.3 symbol flip cards ============ */
W.k3sym = (el) => {
  const C = [
    ["first", "Hydrogen", "হাইড্রোজেন", "H", "first letter", "প্রথম অক্ষর"], ["first", "Carbon", "কার্বন", "C", "first letter", "প্রথম অক্ষর"], ["first", "Oxygen", "অক্সিজেন", "O", "first letter", "প্রথম অক্ষর"],
    ["first", "Nitrogen", "নাইট্রোজেন", "N", "first letter", "প্রথম অক্ষর"], ["first", "Sulfur", "সালফার", "S", "first letter", "প্রথম অক্ষর"], ["first", "Phosphorus", "ফসফরাস", "P", "first letter", "প্রথম অক্ষর"],
    ["first", "Fluorine", "ফ্লোরিন", "F", "first letter", "প্রথম অক্ষর"], ["first", "Iodine", "আয়োডিন", "I", "first letter", "প্রথম অক্ষর"],
    ["two", "Chlorine", "ক্লোরিন", "Cl", "C is taken by carbon: C + l", "C কার্বনের দখলে: C + l"], ["two", "Calcium", "ক্যালসিয়াম", "Ca", "C is taken: C + a", "C দখলে: C + a"],
    ["two", "Cobalt", "কোবাল্ট", "Co", "C + o (not CO!)", "C + o (CO নয়!)"], ["two", "Cadmium", "ক্যাডমিয়াম", "Cd", "C + d", "C + d"], ["two", "Chromium", "ক্রোমিয়াম", "Cr", "C + r", "C + r"],
    ["two", "Helium", "হিলিয়াম", "He", "H is taken by hydrogen: H + e", "H হাইড্রোজেনের দখলে: H + e"], ["two", "Magnesium", "ম্যাগনেসিয়াম", "Mg", "M + g", "M + g"], ["two", "Aluminium", "অ্যালুমিনিয়াম", "Al", "A + l", "A + l"],
    ["latin", "Sodium", "সোডিয়াম", "Na", "Latin: Natrium", "ল্যাটিন: Natrium"], ["latin", "Potassium", "পটাশিয়াম", "K", "Latin: Kalium", "ল্যাটিন: Kalium"], ["latin", "Copper", "কপার (তামা)", "Cu", "Latin: Cuprum", "ল্যাটিন: Cuprum"],
    ["latin", "Silver", "সিলভার (রুপা)", "Ag", "Latin: Argentum", "ল্যাটিন: Argentum"], ["latin", "Gold", "গোল্ড (সোনা)", "Au", "Latin: Aurum", "ল্যাটিন: Aurum"], ["latin", "Iron", "আয়রন (লোহা)", "Fe", "Latin: Ferrum", "ল্যাটিন: Ferrum"],
    ["latin", "Lead", "লেড (সিসা)", "Pb", "Latin: Plumbum", "ল্যাটিন: Plumbum"], ["latin", "Tin", "টিন", "Sn", "Latin: Stannum", "ল্যাটিন: Stannum"], ["latin", "Mercury", "মারকারি (পারদ)", "Hg", "Latin: Hydrargyrum", "ল্যাটিন: Hydrargyrum"],
    ["latin", "Antimony", "এন্টিমনি", "Sb", "Latin: Stibium", "ল্যাটিন: Stibium"], ["latin", "Tungsten", "টাংস্টেন", "W", "German: Wolfram", "জার্মান: Wolfram"]];
  const G = [["latin", L2("Latin names", "ল্যাটিন নাম")], ["first", L2("First letter", "প্রথম অক্ষর")], ["two", L2("Two letters", "দুই অক্ষর")], ["all", L2("All", "সব")]];
  let grp = "latin"; const flipped = new Set();
  el.innerHTML = `<div class="chipset k3sg" role="group">${G.map((g, i) => `<button data-g="${g[0]}" aria-pressed="${i === 0}">${g[1]}</button>`).join("")}</div>
    <div id="k3sgrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;margin:10px 0"></div>
    <div class="w-row"><button class="btn" id="k3sall">${L2("Flip all", "সব উল্টাও")}</button><button class="btn" id="k3snone">${L2("Hide all", "সব লুকাও")}</button></div><div class="w-out" id="k3syo"></div>`;
  const draw = () => {
    const list = C.map((c, i) => [c, i]).filter(([c]) => grp === "all" || c[0] === grp);
    $("#k3sgrid", el).innerHTML = list.map(([c, i]) => { const f = flipped.has(i);
      return `<button data-i="${i}" aria-pressed="${f}" aria-label="${c[1]}" style="min-height:86px;border:1.5px solid ${f ? "var(--c)" : "var(--rule)"};border-radius:12px;background:${f ? "var(--c-soft)" : "var(--sheet)"};color:var(--ink);padding:6px;cursor:pointer;font:inherit">
        ${f ? `<div style="font-size:28px;font-weight:700;color:var(--c)">${c[3]}</div><div style="font-size:13px">${L2(c[4], c[5])}</div>` : `<div style="font-size:15px;font-weight:600">${L2(c[1], c[2])}</div>${LANG === "bn" ? `<div class="muted" style="font-size:13px">${c[1]}</div>` : ""}<div class="muted" style="font-size:12px">${L2("tap to flip", "উল্টাতে চাপ দাও")}</div>`}</button>`; }).join("");
    $("#k3sgrid", el).querySelectorAll("button").forEach(b => b.addEventListener("click", () => { const i = +b.dataset.i; flipped.has(i) ? flipped.delete(i) : flipped.add(i); draw(); }));
    const shown = list.filter(([, i]) => flipped.has(i)).length;
    $("#k3syo", el).innerHTML = L2(`Flipped ${B3(shown)} of ${B3(list.length)}. `, `${B3(list.length)}টির মধ্যে ${B3(shown)}টি উল্টানো হয়েছে। `) +
      ({ latin: L2("These symbols come from old Latin names, so they don't match the English names.", "এই প্রতীকগুলো পুরোনো ল্যাটিন নাম থেকে এসেছে, তাই ইংরেজি নামের সাথে মেলে না।"),
        first: L2("Rule (a): the first letter of the English name, written as a capital.", "নিয়ম (ক): ইংরেজি নামের প্রথম অক্ষর, বড় হাতের।"),
        two: L2("Rule (b): the first letter is already used, so a small second letter is added.", "নিয়ম (খ): প্রথম অক্ষর আগেই ব্যবহৃত, তাই ছোট হাতের একটি দ্বিতীয় অক্ষর যোগ হয়।"),
        all: L2("Remember: first letter capital, second letter small.", "মনে রাখো: প্রথম অক্ষর বড় হাতের, দ্বিতীয়টি ছোট হাতের।") })[grp];
  };
  chips3(el, ".k3sg", b => { grp = b.dataset.g; draw(); });
  $("#k3sall", el).addEventListener("click", () => { C.forEach((c, i) => { if (grp === "all" || c[0] === grp) flipped.add(i); }); draw(); });
  $("#k3snone", el).addEventListener("click", () => { flipped.clear(); draw(); });
  draw();
};

/* ============ 3.4 formula: subscripts and coefficient ============ */
W.k3formula = (el) => {
  const F = [["H2", L2("hydrogen", "হাইড্রোজেন")], ["O2", L2("oxygen", "অক্সিজেন")], ["H2O", L2("water", "পানি")], ["CO2", L2("carbon dioxide", "কার্বন ডাই-অক্সাইড")],
    ["NH3", L2("ammonia", "অ্যামোনিয়া")], ["CH4", L2("methane", "মিথেন")], ["HCl", L2("hydrogen chloride", "হাইড্রোজেন ক্লোরাইড")], ["H2SO4", L2("sulfuric acid", "সালফিউরিক এসিড")]];
  let fi = 2;
  el.innerHTML = `<div class="chipset k3fc" role="group">${F.map((f, i) => `<button data-i="${i}" aria-pressed="${i === fi}">${fx3(f[0])}</button>`).join("")}</div>
    ${slider("k3fn", L2("Number of molecules (coefficient)", "অণুর সংখ্যা (সহগ)"), 1, 4, 1, 2, "")}
    <div class="svgwrap fit" id="k3fsv"></div><div id="k3flg"></div><div class="w-out" id="k3fo"></div>`;
  const draw = () => {
    const n = sv(el, "k3fn", ""), key = F[fi][0], atoms = MOL3[key];
    const cnt = {}; atoms.forEach(([e]) => cnt[e] = (cnt[e] || 0) + 1);
    const order = []; key.replace(/([A-Z][a-z]?)/g, m => { if (!order.includes(m)) order.push(m); return m; });
    const r = key === "H2SO4" ? 9 : key === "CO2" ? 13 : 15, cw = 86;
    let g = `<svg viewBox="0 0 360 150" role="img" aria-label="${L2("molecules", "অণু")}"><text x="180" y="24" font-size="22" text-anchor="middle" fill="var(--ink)" font-weight="700">${n > 1 ? n : ""}${key.replace(/(\d+)/g, m => usub3(m))}</text>`;
    const x0 = 180 - (n - 1) * cw / 2;
    for (let i = 0; i < n; i++) { const cx = x0 + i * cw; g += `<rect x="${cx - 40}" y="42" width="80" height="92" rx="10" fill="var(--c-soft)" stroke="var(--rule)"/>` + drawMol3(key, cx, 88, r, 0); }
    $("#k3fsv", el).innerHTML = g + "</svg>";
    $("#k3flg", el).innerHTML = legend3(order);
    const rows = order.map(e => `<tr><td style="padding:2px 8px"><b>${e}</b></td><td style="padding:2px 8px">${B3(n)} × ${B3(cnt[e])} = <b>${B3(n * cnt[e])}</b></td></tr>`).join("");
    const tot = atoms.length * n;
    $("#k3fo", el).innerHTML = `${L2("One molecule of", "")} <b>${fx3(key)}</b> ${L2(`(${F[fi][1]}) has`, `(${F[fi][1]}) এর একটি অণুতে আছে`)} ${order.map(e => `${B3(cnt[e])} ${e}`).join(" + ")} = ${B3(atoms.length)} ${L2("atoms", "টি পরমাণু")}.
      <table style="margin:6px 0;border-collapse:collapse"><tr class="muted"><td style="padding:2px 8px">${L2("atom", "পরমাণু")}</td><td style="padding:2px 8px">${L2("coefficient × subscript", "সহগ × পাদাঙ্ক")}</td></tr>${rows}</table>
      <b>${n > 1 ? n : ""}${fx3(key)}</b>: ${B3(n)} ${L2(n > 1 ? "molecules" : "molecule", "টি অণু")}, ${B3(tot)} ${L2("atoms in total", "টি পরমাণু মোট")}${L2(".", "।")}`;
  };
  chips3(el, ".k3fc", b => { fi = +b.dataset.i; draw(); });
  onIn3(el, draw); draw();
};

/* ============ 3.5 atom builder ============ */
W.k3atom = (el) => {
  const st = { p: 6, n: 6, e: 6 };
  const lim = { p: [1, 20], n: [0, 24], e: [0, 22] };
  const lab = { p: L2("Protons", "প্রোটন"), n: L2("Neutrons", "নিউট্রন"), e: L2("Electrons", "ইলেকট্রন") };
  const col = { p: "var(--bad)", n: "var(--muted)", e: "var(--c)" };
  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">${["p", "n", "e"].map(k => `<div style="text-align:center;border:1px solid var(--rule);border-radius:10px;padding:6px 2px">
      <div style="font-size:14px;color:${col[k]};font-weight:600">${lab[k]}</div>
      <div style="display:flex;flex-wrap:nowrap;align-items:center;justify-content:center;gap:4px;margin-top:4px"><button class="btn" style="padding:4px 0;min-width:34px;margin:0" data-k="${k}" data-d="-1" aria-label="${lab[k]} −">−</button><b id="k3a${k}" style="min-width:24px;font-size:18px"></b><button class="btn" style="padding:4px 0;min-width:34px;margin:0" data-k="${k}" data-d="1" aria-label="${lab[k]} +">+</button></div></div>`).join("")}</div>
    <div class="chipset k3ap" role="group" style="margin-top:8px">${[["H", 1, 0, 1], ["He", 2, 2, 2], ["C", 6, 6, 6], ["O", 8, 8, 8], ["Na", 11, 12, 11], ["Na⁺", 11, 12, 10], ["Cl⁻", 17, 18, 18], ["K", 19, 20, 19]].map(q => `<button data-q="${q.slice(1).join(",")}" aria-pressed="false">${q[0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k3asv"></div><div class="w-out" id="k3ao"></div>`;
  const draw = () => {
    ["p", "n", "e"].forEach(k => $("#k3a" + k, el).textContent = B3(st[k]));
    const { p, n, e } = st, A = p + n, q = p - e, sh = e ? shells3(e) : [];
    let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("atom", "পরমাণু")}">`;
    const cx = 128, cy = 125, rad = [46, 68, 90, 112];
    sh.forEach((c, i) => { g += `<circle cx="${cx}" cy="${cy}" r="${rad[i]}" fill="none" stroke="var(--rule)" stroke-width="1.5"/>`;
      for (let j = 0; j < c; j++) { const th = -Math.PI / 2 + j * 2 * Math.PI / c + i * 0.3; g += `<circle cx="${(cx + rad[i] * Math.cos(th)).toFixed(1)}" cy="${(cy + rad[i] * Math.sin(th)).toFixed(1)}" r="5" fill="var(--c)" stroke="var(--ink)" stroke-width=".7"/>`; } });
    g += nucleus3(cx, cy, p, n, Math.min(7, 26 / Math.sqrt(p + n)));
    const nm = EL3[p], sym = nm[0], qs = q === 0 ? "" : (Math.abs(q) > 1 ? Math.abs(q) : "") + (q > 0 ? "+" : "−");
    g += `<text x="300" y="118" font-size="46" text-anchor="middle" fill="var(--ink)" font-weight="700">${sym}</text>
      <text x="${300 - 14 - sym.length * 13}" y="86" font-size="17" text-anchor="end" fill="var(--ink)">${A}</text>
      <text x="${300 - 14 - sym.length * 13}" y="130" font-size="17" text-anchor="end" fill="var(--bad)">${p}</text>
      ${qs ? `<text x="${300 + 6 + sym.length * 13}" y="86" font-size="17" fill="var(--c)">${qs}</text>` : ""}
      <text x="300" y="156" font-size="15" text-anchor="middle" fill="var(--muted)">${elName3(p)}</text>
      <text x="300" y="200" font-size="14" text-anchor="middle" fill="var(--muted)">A = ${B3(A)}</text><text x="300" y="220" font-size="14" text-anchor="middle" fill="var(--muted)">Z = ${B3(p)}</text></svg>`;
    $("#k3asv", el).innerHTML = g;
    const kind = q === 0 ? L2("a <b>neutral atom</b> (electrons = protons)", "একটি <b>নিরপেক্ষ পরমাণু</b> (ইলেকট্রন = প্রোটন)")
      : q > 0 ? L2(`a <b>positive ion</b> (it has lost ${B3(q)} electron${q > 1 ? "s" : ""})`, `একটি <b>ধনাত্মক আয়ন</b> (${B3(q)}টি ইলেকট্রন হারিয়েছে)`)
        : L2(`a <b>negative ion</b> (it has gained ${B3(-q)} electron${q < -1 ? "s" : ""})`, `একটি <b>ঋণাত্মক আয়ন</b> (${B3(-q)}টি ইলেকট্রন গ্রহণ করেছে)`);
    const iso = A === nm[3] ? L2(`This is the most common isotope of ${nm[1].toLowerCase()}.`, `এটি ${nm[2]}-এর সবচেয়ে প্রচলিত আইসোটোপ।`)
      : L2(`The most common isotope of ${nm[1].toLowerCase()} has A = ${nm[3]}; this one is a different isotope (it may be rare or unstable).`, `${nm[2]}-এর সবচেয়ে প্রচলিত আইসোটোপের A = ${B3(nm[3])}; এটি ভিন্ন একটি আইসোটোপ (বিরল বা অস্থিতিশীল হতে পারে)।`);
    $("#k3ao", el).innerHTML = L2(`${B3(p)} protons → Z = ${B3(p)} → it is <b>${nm[1]} (${sym})</b>. Mass number A = Z + N = ${B3(p)} + ${B3(n)} = <b>${B3(A)}</b>. Charge = ${B3(p)} − ${B3(e)} = <b>${q > 0 ? "+" : ""}${f3(q)}</b>, so it is `, `${B3(p)}টি প্রোটন → Z = ${B3(p)} → এটি <b>${nm[2]} (${sym})</b>। ভরসংখ্যা A = Z + N = ${B3(p)} + ${B3(n)} = <b>${B3(A)}</b>। আধান = ${B3(p)} − ${B3(e)} = <b>${q > 0 ? "+" : ""}${f3(q)}</b>, তাই এটি `)
      + kind + L2(". ", "। ") + (e ? L2("Shells: ", "শেল: ") + sh.map((c, i) => "KLMN"[i] + " " + B3(c)).join(", ") + L2(". ", "। ") : "") + iso;
  };
  el.querySelectorAll("button[data-k]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.k; st[k] = Math.max(lim[k][0], Math.min(lim[k][1], st[k] + +b.dataset.d));
    el.querySelectorAll(".k3ap button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); }));
  chips3(el, ".k3ap", b => { const [p, n, e] = b.dataset.q.split(",").map(Number); Object.assign(st, { p, n, e }); draw(); });
  draw();
};

/* ============ 3.6 Rutherford gold foil + Bohr jumps ============ */
W.k3model = (el) => {
  el.innerHTML = `<div class="chipset k3mt" role="group"><button data-t="0" aria-pressed="true">${L2("Gold foil", "সোনার পাত")}</button><button data-t="1" aria-pressed="false">${L2("Bohr jumps", "বোরের লাফ")}</button></div><div id="k3mb"></div>`;
  let tab = 0, token = 0;
  /* ---- gold foil ---- */
  const gold = () => {
    const my = ++token, box = $("#k3mb", el);
    box.innerHTML = `<div class="w-row"><button class="btn solid" id="k3g1">${L2("Fire 1", "১টি ছোড়ো")}</button><button class="btn" id="k3g20">${L2("Fire 50", "৫০টি ছোড়ো")}</button><button class="btn" id="k3g0">${L2("Clear", "মুছে ফেলো")}</button></div>
      <div class="svgwrap fit" id="k3gsv"></div><div class="w-out" id="k3go"></div>`;
    const XF = 200, D = 44, K = 0.35, NY = [34, 78, 122, 166, 210];
    const traces = [], flying = []; let cnt = [0, 0, 0];
    const path = y0 => { let best = NY[0]; NY.forEach(y => { if (Math.abs(y - y0) < Math.abs(best - y0)) best = y; });
      const b = Math.max(0.01, Math.abs(y0 - best)), th = 2 * Math.atan(K / b), s = y0 < best ? -1 : 1; // deflect away from the nucleus
      const L = 190, ex = XF + L * Math.cos(th), ey = y0 + s * L * Math.sin(th);
      return { y0, th, pts: [[0, y0], [XF, y0], [ex, ey]] }; };
    const classify = th => th < 10 * Math.PI / 180 ? 0 : th < Math.PI / 2 ? 1 : 2;
    const stat = () => { const t = cnt[0] + cnt[1] + cnt[2];
      $("#k3go", el).innerHTML = L2(`Fired: <b>${B3(t)}</b>. Straight through: <b>${B3(cnt[0])}</b> · deflected: <b>${B3(cnt[1])}</b> · bounced back: <b>${B3(cnt[2])}</b>. `, `ছোড়া হয়েছে: <b>${B3(t)}</b>। সোজা পার: <b>${B3(cnt[0])}</b> · বেঁকে গেছে: <b>${B3(cnt[1])}</b> · ফিরে এসেছে: <b>${B3(cnt[2])}</b>। `)
        + L2("Most pass straight through the empty space; only those that come very close to a tiny nucleus are turned sharply. (Atoms are drawn much larger than the nucleus would really allow; in the real experiment only about 1 in several thousand bounced back.)",
          "বেশিরভাগ কণা ফাঁকা জায়গা দিয়ে সোজা চলে যায়; শুধু যেগুলো ক্ষুদ্র নিউক্লিয়াসের খুব কাছে যায়, সেগুলো তীব্রভাবে বেঁকে যায়। (ছবিতে নিউক্লিয়াসকে বাস্তবের চেয়ে অনেক বড় দেখানো হয়েছে; আসল পরীক্ষায় মোটামুটি কয়েক হাজারে মাত্র একটি ফিরে এসেছিল।)"); };
    const draw = () => {
      let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("gold foil experiment", "সোনার পাত পরীক্ষা")}">
        <rect x="0" y="8" width="12" height="228" rx="3" fill="var(--note)" opacity=".55"/><text x="18" y="246" font-size="13" fill="var(--muted)">α →</text>
        <rect x="${XF - 22}" y="10" width="44" height="222" fill="var(--note)" opacity=".13"/>`;
      NY.forEach(y => g += `<circle cx="${XF}" cy="${y}" r="21" fill="none" stroke="var(--rule)" stroke-dasharray="3 3"/><circle cx="${XF}" cy="${y}" r="2.6" fill="var(--bad)"/>`);
      traces.forEach(t => { const [a, b, c] = t.pts; g += `<polyline points="${a} ${b} ${c}" fill="none" stroke="${t.th > Math.PI / 2 ? "var(--bad)" : t.th > 0.17 ? "var(--c)" : "var(--muted)"}" stroke-width="${t.th > 0.17 ? 1.6 : 1}" opacity="${t.th > 0.17 ? 0.95 : 0.4}"/>`; });
      flying.forEach(f => { if (f.delay <= 0) g += `<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="3.5" fill="var(--note)" stroke="var(--ink)" stroke-width=".7"/>`; });
      g += `<text x="${XF}" y="246" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("gold foil (atoms enlarged)", "সোনার পাত (পরমাণু বড় করে দেখানো)")}</text></svg>`;
      $("#k3gsv", el).innerHTML = g;
    };
    const finish = t => { traces.push({ th: t.th, pts: t.pts.map(p => p.map(v => v.toFixed(1)).join(" ")) }); if (traces.length > 160) traces.shift(); cnt[classify(t.th)]++; };
    const fire = m => { for (let i = 0; i < m; i++) { const t = path(12 + Math.random() * 220);
      if (REDUCED) finish(t); else flying.push({ t, x: 0, y: t.y0, s: 0, delay: i * 0.06 }); } draw(); stat(); };
    $("#k3g1", el).addEventListener("click", () => fire(1));
    $("#k3g20", el).addEventListener("click", () => fire(50));
    $("#k3g0", el).addEventListener("click", () => { traces.length = 0; flying.length = 0; cnt = [0, 0, 0]; draw(); stat(); });
    if (!REDUCED) animate(box, dt => { if (my !== token || !flying.length) return;
      for (let i = flying.length - 1; i >= 0; i--) { const f = flying[i]; if (f.delay > 0) { f.delay -= dt; continue; } f.s += 420 * dt; const [p0, p1, p2] = f.t.pts;
        if (f.s < XF) { f.x = f.s; f.y = p0[1]; } else { const L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), u = (f.s - XF) / L; if (u >= 1) { finish(f.t); flying.splice(i, 1); stat(); continue; } f.x = p1[0] + (p2[0] - p1[0]) * u; f.y = p1[1] + (p2[1] - p1[1]) * u; } }
      draw(); });
    fire(REDUCED ? 30 : 12);
  };
  /* ---- Bohr ---- */
  const bohr = () => {
    const my = ++token, box = $("#k3mb", el); let cur = 1; const lines = []; let ph = null;
    box.innerHTML = `<div class="hint">${L2("Hydrogen atom. Tap a level to move the electron there:", "হাইড্রোজেন পরমাণু। ইলেকট্রনকে যে স্তরে নিতে চাও তাতে চাপ দাও:")}</div>
      <div class="chipset k3bl" role="group">${[1, 2, 3, 4, 5].map(n => `<button data-n="${n}" aria-pressed="${n === 1}">n = ${B3(n)} (${"KLMNO"[n - 1]})</button>`).join("")}</div>
      <div class="svgwrap fit" id="k3bsv"></div><div class="w-out" id="k3bo"></div>`;
    const E = n => -13.6 / (n * n);
    const colour = lam => { if (lam < 380) return "var(--muted)"; if (lam > 750) return "var(--muted)";
      const h = lam < 440 ? 270 : lam < 490 ? 270 - (lam - 440) / 50 * 70 : lam < 510 ? 200 - (lam - 490) / 20 * 60 : lam < 580 ? 140 - (lam - 510) / 70 * 80 : lam < 645 ? 60 - (lam - 580) / 65 * 55 : 0; return `hsl(${h.toFixed(0)},85%,50%)`; };
    const band = lam => lam < 380 ? L2("ultraviolet (invisible)", "অতিবেগুনি (অদৃশ্য)") : lam > 750 ? L2("infrared (invisible)", "অবলোহিত (অদৃশ্য)") : lam > 620 ? L2("red", "লাল") : lam > 495 ? L2("green", "সবুজ") : lam > 450 ? L2("blue-green", "নীলাভ") : L2("violet", "বেগুনি");
    const draw = () => {
      const cx = 92, cy = 112, R = n => 14 + n * 17;
      let g = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("Bohr model", "বোর মডেল")}">`;
      for (let n = 1; n <= 5; n++) g += `<circle cx="${cx}" cy="${cy}" r="${R(n)}" fill="none" stroke="${n === cur ? "var(--c)" : "var(--rule)"}" stroke-width="${n === cur ? 2 : 1.2}"/>`;
      g += `<circle cx="${cx}" cy="${cy}" r="7" fill="var(--bad)" stroke="var(--ink)"/><circle cx="${cx + R(cur) * 0.707}" cy="${cy - R(cur) * 0.707}" r="6" fill="var(--c)" stroke="var(--ink)"/>`;
      if (ph) { const t = ph.u, col = ph.col; if (ph.emit) { const x = cx + 30 + t * 120, y = cy - 30 - t * 60; g += `<path d="M${x - 20} ${y + 10} q5 -10 10 0 t10 0" fill="none" stroke="${col}" stroke-width="2.5"/>`; }
        else { const x = cx + 150 - t * 120, y = cy - 90 + t * 60; g += `<path d="M${x - 20} ${y + 10} q5 -10 10 0 t10 0" fill="none" stroke="${col}" stroke-width="2.5"/>`; } }
      // energy level diagram
      const x0 = 210, x1 = 350;
      for (let n = 1; n <= 5; n++) { const y = 200 - (1 - (-E(n)) / 13.6) * 170; g += `<line x1="${x0}" y1="${y.toFixed(1)}" x2="${x1}" y2="${y.toFixed(1)}" stroke="${n === cur ? "var(--c)" : "var(--muted)"}" stroke-width="${n === cur ? 3 : 1.5}"/>`;
        if (n <= 3) g += `<text x="${x1}" y="${(n === 1 ? y - 5 : y + 14).toFixed(1)}" font-size="13" text-anchor="end" fill="var(--muted)">n=${B3(n)}  ${f3(E(n), 2)} eV</text>`; }
      g += `<text x="${x0}" y="16" font-size="13" fill="var(--muted)">${L2("energy", "শক্তি")} ↑  n = ${B3(4)}, ${B3(5)} …</text>`;
      // spectrum strip of emitted visible lines
      g += `<rect x="10" y="222" width="340" height="20" rx="4" fill="var(--paper)" stroke="var(--rule)"/>`;
      lines.forEach(l => { if (l >= 380 && l <= 750) { const x = 10 + (l - 380) / 370 * 340; g += `<rect x="${x - 1.5}" y="222" width="3" height="20" fill="${colour(l)}"/>`; } });
      g += `<text x="12" y="218" font-size="12" fill="var(--muted)">${L2("visible lines emitted so far", "এ পর্যন্ত বিকিরিত দৃশ্যমান রেখা")}</text></svg>`;
      $("#k3bsv", el).innerHTML = g;
    };
    const go = n => {
      if (n === cur) return; const dE = E(n) - E(cur), lam = 1240 / Math.abs(dE), emit = dE < 0, from = cur; cur = n;
      if (emit) lines.push(lam);
      ph = { u: 0, emit, col: colour(lam) }; if (REDUCED) ph.u = 0.5;
      $("#k3bo", el).innerHTML = L2(`n = ${B3(from)} → n = ${B3(n)}: the electron ${emit ? "falls and <b>emits</b>" : "rises and <b>absorbs</b>"} ΔE = ${f3(Math.abs(dE), 2)} eV = ${f3(Math.abs(dE) * 1.602e-19)} J. Wavelength λ = hc/ΔE ≈ <b>${f3(lam)} nm</b> (${band(lam)}).`,
        `n = ${B3(from)} → n = ${B3(n)}: ইলেকট্রন ${emit ? "নিচে নেমে <b>বিকিরণ</b> করে" : "ওপরে উঠে <b>শোষণ</b> করে"} ΔE = ${f3(Math.abs(dE), 2)} eV = ${f3(Math.abs(dE) * 1.602e-19)} J। তরঙ্গদৈর্ঘ্য λ = hc/ΔE ≈ <b>${f3(lam)} nm</b> (${band(lam)})।`);
      draw();
    };
    chips3(el, ".k3bl", b => go(+b.dataset.n));
    $("#k3bo", el).innerHTML = L2("The electron is in the lowest level, K (n = 1). Lift it up (absorb), then let it fall (emit). Falls ending on n = 2 give visible light, like the red 656 nm line from 3 → 2.", "ইলেকট্রন সর্বনিম্ন স্তর K (n = ১)-এ আছে। একে ওপরে তোলো (শোষণ), তারপর নিচে নামাও (বিকিরণ)। n = ২-এ এসে থামা পতনগুলো দৃশ্যমান আলো দেয়, যেমন ৩ → ২ থেকে ৬৫৬ nm-এর লাল রেখা।");
    draw();
    if (!REDUCED) animate(box, dt => { if (my !== token || !ph || ph.u >= 1) return; ph.u = Math.min(1, ph.u + dt * 1.4); if (ph.u >= 1) ph = null; draw(); });
  };
  chips3(el, ".k3mt", b => { tab = +b.dataset.t; tab ? bohr() : gold(); });
  gold();
};

/* ============ 3.7 electron configuration Z = 1..30 ============ */
W.k3config = (el) => {
  el.innerHTML = `${slider("k3cz", L2("Atomic number Z", "পারমাণবিক সংখ্যা Z"), 1, 30, 1, 11, "")}
    <div class="w-row"><button class="btn" id="k3cm" aria-label="Z − 1">◀ Z − ${B3(1)}</button><button class="btn" id="k3cp" aria-label="Z + 1">Z + ${B3(1)} ▶</button>
    <span class="chipset k3cq" role="group">${[19, 20, 21, 24, 29].map(z => `<button data-z="${z}" aria-pressed="false">${EL3[z][0]}</button>`).join("")}</span></div>
    <div class="svgwrap fit" id="k3csv"></div><div class="w-out" id="k3co"></div>`;
  const draw = () => {
    const z = sv(el, "k3cz", ""), sh = shells3(z), cf = cfg3(z), nm = EL3[z];
    let g = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("electron shells", "ইলেকট্রন শেল")}">`;
    const cx = 92, cy = 100, rad = [26, 44, 64, 86];
    sh.forEach((c, i) => { g += `<circle cx="${cx}" cy="${cy}" r="${rad[i]}" fill="none" stroke="var(--rule)" stroke-width="1.5"/>`;
      for (let j = 0; j < c; j++) { const th = -Math.PI / 2 + j * 2 * Math.PI / c; g += `<circle cx="${(cx + rad[i] * Math.cos(th)).toFixed(1)}" cy="${(cy + rad[i] * Math.sin(th)).toFixed(1)}" r="${c > 12 ? 3.4 : 4.2}" fill="var(--c)"/>`; } });
    g += `<circle cx="${cx}" cy="${cy}" r="15" fill="var(--bad)" opacity=".85"/><text x="${cx}" y="${cy + 5}" font-size="14" text-anchor="middle" fill="var(--paper)" font-weight="700">${nm[0]}</text>`;
    // shell table
    ["K", "L", "M", "N"].forEach((s, i) => { const y = 32 + i * 30, c = sh[i] || 0, cap = 2 * (i + 1) * (i + 1);
      g += `<text x="196" y="${y}" font-size="15" fill="var(--ink)" font-weight="600">${s}</text><rect x="212" y="${y - 13}" width="96" height="16" rx="8" fill="var(--c-soft)"/>
        <rect x="212" y="${y - 13}" width="${(96 * c / cap).toFixed(1)}" height="16" rx="8" fill="var(--c)"/><text x="313" y="${y}" font-size="14" fill="var(--ink)">${B3(c)}/${B3(cap)}</text>`; });
    // sublevel boxes in filling order
    g += `<text x="10" y="218" font-size="13" fill="var(--muted)">${L2("filling order →", "ভরাটের ক্রম →")}</text>`;
    let x = 10; const cw = 8.2;
    cf.slice(0, 7).forEach((o, k) => { const w = o.cap * cw; g += `<text x="${x + w / 2}" y="238" font-size="13" text-anchor="middle" fill="var(--ink)">${o.name}</text>`;
      for (let i = 0; i < o.cap; i++) g += `<rect x="${(x + i * cw).toFixed(1)}" y="246" width="${cw - 1.4}" height="18" rx="2" fill="${i < o.e ? "var(--c)" : "var(--c-soft)"}" stroke="var(--rule)" stroke-width=".6"/>`;
      g += `<text x="${x + w / 2}" y="282" font-size="13" text-anchor="middle" fill="var(--muted)">${B3(o.e)}</text>`; x += w + 4; });
    $("#k3csv", el).innerHTML = g + "</svg>";
    const note = { 19: L2("4s (n + l = 4) is lower in energy than 3d (n + l = 5), so the 19th electron goes into the N shell before M is full.", "4s (n + l = ৪) এর শক্তি 3d (n + l = ৫) এর চেয়ে কম, তাই M পূর্ণ হওয়ার আগেই ১৯তম ইলেকট্রন N শেলে যায়।"),
      20: L2("4s is now full (2, 8, 8, 2).", "4s এখন পূর্ণ (২, ৮, ৮, ২)।"), 21: L2("4s is full, so the 21st electron goes back to 3d, in the M shell: 2, 8, 9, 2.", "4s পূর্ণ, তাই ২১তম ইলেকট্রন ফিরে যায় M শেলের 3d তে: ২, ৮, ৯, ২।"),
      24: L2("Exception! Expected 3d⁴ 4s², but a half-full 3d⁵ is more stable, so one 4s electron moves to 3d.", "ব্যতিক্রম! হওয়ার কথা 3d⁴ 4s², কিন্তু অর্ধপূর্ণ 3d⁵ বেশি সুস্থিত, তাই 4s এর একটি ইলেকট্রন 3d তে যায়।"),
      29: L2("Exception! Expected 3d⁹ 4s², but a full 3d¹⁰ is more stable, so one 4s electron moves to 3d.", "ব্যতিক্রম! হওয়ার কথা 3d⁹ 4s², কিন্তু পূর্ণ 3d¹⁰ বেশি সুস্থিত, তাই 4s এর একটি ইলেকট্রন 3d তে যায়।") }[z] || "";
    $("#k3co", el).innerHTML = `<b>${elName3(z)} (${nm[0]}), Z = ${B3(z)}</b><br>${L2("Shells", "শেল")} K, L, M, N: <b>${sh.map(B3).join(", ")}</b><br>${L2("Subshells", "উপশক্তিস্তর")}: <b>${cfgStr3(z)}</b>` + (note ? `<br>${note}` : "");
    el.querySelectorAll(".k3cq button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.z === z));
  };
  const setZ = z => { $("#k3cz", el).value = Math.max(1, Math.min(30, z)); draw(); };
  $("#k3cm", el).addEventListener("click", () => setZ(+$("#k3cz", el).value - 1));
  $("#k3cp", el).addEventListener("click", () => setZ(+$("#k3cz", el).value + 1));
  el.querySelectorAll(".k3cq button").forEach(b => b.addEventListener("click", () => setZ(+b.dataset.z)));
  onIn3(el, draw); draw();
};

/* ============ 3.8 isotope explorer ============ */
W.k3iso = (el) => {
  const S = [["H", 1, [[1, L2("protium", "প্রোটিয়াম"), "99.98%", 0], [2, L2("deuterium", "ডিউটেরিয়াম"), "0.02%", 0], [3, L2("tritium", "ট্রিটিয়াম"), L2("trace", "অতি সামান্য"), 1]]],
    ["C", 6, [[12, "C-12", "98.9%", 0], [13, "C-13", "1.1%", 0], [14, "C-14", L2("trace", "অতি সামান্য"), 1]]],
    ["O", 8, [[16, "O-16", "99.76%", 0], [17, "O-17", "0.04%", 0], [18, "O-18", "0.20%", 0]]],
    ["Cl", 17, [[35, "Cl-35", "≈ 75%", 0], [37, "Cl-37", "≈ 25%", 0]]]];
  let si = 0, ii = 0;
  el.innerHTML = `<div class="chipset k3ie" role="group">${S.map((s, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${elName3(s[1])}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k3isv"></div><div class="chipset k3ii" role="group" id="k3iib"></div><div class="w-out" id="k3io"></div>`;
  const draw = () => {
    const [sym, Z, iso] = S[si], k = iso.length, w = 360 / k;
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("isotopes", "আইসোটোপ")}">`;
    iso.forEach(([A, nm, ab, rad], i) => { const cx = w * i + w / 2, N = A - Z, rr = A > 20 ? 3.8 : A > 10 ? 5.2 : 9, sel = i === ii;
      g += `<rect x="${cx - w / 2 + 4}" y="4" width="${w - 8}" height="192" rx="12" fill="${sel ? "var(--c-soft)" : "none"}" stroke="${sel ? "var(--c)" : "var(--rule)"}"/>`;
      g += nucleus3(cx, 64, Z, N, rr);
      g += `<text x="${cx}" y="134" font-size="16" text-anchor="middle" fill="var(--ink)" font-weight="700">${usup3(A)}${sym}</text>
        <text x="${cx}" y="153" font-size="13" text-anchor="middle" fill="var(--bad)">p ${B3(Z)}</text><text x="${cx}" y="170" font-size="13" text-anchor="middle" fill="var(--muted)">n ${B3(N)}</text>
        <text x="${cx}" y="188" font-size="13" text-anchor="middle" fill="${rad ? "var(--bad)" : "var(--muted)"}">${rad ? L2("radioactive", "তেজস্ক্রিয়") : B3(ab)}</text>`; });
    $("#k3isv", el).innerHTML = g + "</svg>";
    $("#k3iib", el).innerHTML = iso.map(([A, nm], i) => `<button data-i="${i}" aria-pressed="${i === ii}">${nm}</button>`).join("");
    chips3(el, ".k3ii", b => { ii = +b.dataset.i; draw(); });
    const [A, nm, ab, rad] = iso[ii];
    $("#k3io", el).innerHTML = L2(`<b>${nm}</b> (${usup3(A)}${sym}): ${Z} proton${Z > 1 ? "s" : ""} + ${A - Z} neutron${A - Z !== 1 ? "s" : ""} → A = ${A}; ${Z} electron${Z > 1 ? "s" : ""}. Natural abundance: ${ab}${rad ? "; its nucleus is unstable, so it is radioactive" : ""}. `,
      `<b>${nm}</b> (${usup3(A)}${sym}): ${B3(Z)}টি প্রোটন + ${B3(A - Z)}টি নিউট্রন → A = ${B3(A)}; ইলেকট্রন ${B3(Z)}টি। প্রকৃতিতে পরিমাণ: ${B3(ab)}${rad ? "; এর নিউক্লিয়াস অস্থিতিশীল, তাই এটি তেজস্ক্রিয়" : ""}। `)
      + L2(`All isotopes of ${EL3[Z][1].toLowerCase()} have <b>${Z} proton${Z > 1 ? "s" : ""}</b> (red) and the same electrons, so they behave alike chemically; only the neutrons (grey) and the mass differ.`,
        `${EL3[Z][2]}-এর সব আইসোটোপে <b>${B3(Z)}টি প্রোটন</b> (লাল) আর একই ইলেকট্রন, তাই রাসায়নিক আচরণ একই; শুধু নিউট্রন (ধূসর) আর ভর আলাদা।`);
  };
  chips3(el, ".k3ie", b => { si = +b.dataset.i; ii = 0; draw(); });
  draw();
};

/* ============ 3.9 average relative atomic mass + molecular mass ============ */
W.k3ram = (el) => {
  const P = [["Cl", 35, 37, 75, 75], ["Cu", 63, 65, 75, 69], ["B", 10, 11, 20, 20], ["Br", 79, 81, 51, 51], ["Li", 6, 7, 7.5, 7.5]];
  const M = [["H2O", { H: 2, O: 1 }], ["CO2", { C: 1, O: 2 }], ["NH3", { N: 1, H: 3 }], ["H2SO4", { H: 2, S: 1, O: 4 }], ["NaCl", { Na: 1, Cl: 1 }], ["CaCO3", { Ca: 1, C: 1, O: 3 }], ["C6H12O6", { C: 6, H: 12, O: 6 }], ["CO(NH2)2", { C: 1, O: 1, N: 2, H: 4 }]];
  const AM = { H: 1, C: 12, N: 14, O: 16, Na: 23, S: 32, Cl: 35.5, Ca: 40 };
  let pi = 0, mi = 3;
  el.innerHTML = `<div class="chipset k3rp" role="group">${P.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${L2({ Cl: "Chlorine", Cu: "Copper", B: "Boron", Br: "Bromine", Li: "Lithium" }[p[0]], { Cl: "ক্লোরিন", Cu: "কপার", B: "বোরন", Br: "ব্রোমিন", Li: "লিথিয়াম" }[p[0]])}</button>`).join("")}</div>
    ${slider("k3rx", L2("Abundance of the lighter isotope", "হালকা আইসোটোপের শতকরা পরিমাণ"), 0, 100, 0.5, 75, "%")}
    <div class="svgwrap fit" id="k3rsv"></div><div class="w-out" id="k3ro"></div>
    <h4 style="margin:14px 0 6px">${L2("Relative molecular mass", "আপেক্ষিক আণবিক ভর")}</h4>
    <div class="chipset k3rm" role="group">${M.map((m, i) => `<button data-i="${i}" aria-pressed="${i === mi}">${fx3(m[0])}</button>`).join("")}</div><div class="w-out" id="k3rmo"></div>`;
  const draw = () => {
    const [sym, p, q, bookX, realX] = P[pi], x = sv(el, "k3rx", "%", 1), y = 100 - x, avg = (p * x + q * y) / 100;
    const X = v => 40 + (v - p) / (q - p) * 280;
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("average atomic mass", "গড় পারমাণবিক ভর")}">`;
    // balance beam: weights at p and q, pivot at the average
    const bx = X(avg);
    g += `<line x1="30" y1="96" x2="330" y2="96" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><path d="M${bx} 99 l-14 26 h28 z" fill="var(--c)" stroke="var(--ink)"/>`;
    const w1 = 8 + x * 0.5, w2 = 8 + y * 0.5;
    g += `<rect x="${X(p) - w1 / 2}" y="${94 - w1}" width="${w1}" height="${w1}" rx="4" fill="var(--note)" stroke="var(--ink)"/><rect x="${X(q) - w2 / 2}" y="${94 - w2}" width="${w2}" height="${w2}" rx="4" fill="var(--good)" stroke="var(--ink)"/>
      <text x="${X(p)}" y="146" font-size="15" text-anchor="middle" fill="var(--ink)">${usup3(p)}${sym}</text><text x="${X(q)}" y="146" font-size="15" text-anchor="middle" fill="var(--ink)">${usup3(q)}${sym}</text>
      <text x="${X(p)}" y="164" font-size="13" text-anchor="middle" fill="var(--muted)">${f3(x, 1)}%</text><text x="${X(q)}" y="164" font-size="13" text-anchor="middle" fill="var(--muted)">${f3(y, 1)}%</text>
      <text x="${Math.min(300, Math.max(60, bx))}" y="182" font-size="16" text-anchor="middle" fill="var(--c)" font-weight="700">${f3(avg, 2)}</text>`;
    // 100 atoms
    for (let i = 0; i < 100; i++) { const cx = 23 + (i % 50) * 6.6, cy = 202 + Math.floor(i / 50) * 10; g += `<circle cx="${cx.toFixed(1)}" cy="${cy}" r="2.8" fill="${i < Math.round(x) ? "var(--note)" : "var(--good)"}"/>`; }
    $("#k3rsv", el).innerHTML = g + `<text x="180" y="226" font-size="12" text-anchor="middle" fill="var(--muted)"></text></svg>`;
    const nat = Math.abs(x - bookX) < 0.3 ? "" : `<br><span class="muted">${L2(`Natural value used in the book: ${B3(bookX)}%.`, `বইয়ে ব্যবহৃত প্রাকৃতিক মান: ${B3(bookX)}%।`)}</span>`;
    const cu = sym === "Cu" ? `<br><span class="muted">${L2("(With exact isotope masses, the real abundance of Cu-63 is about 69%.)", "(আইসোটোপের নিখুঁত ভর ধরলে Cu-63 এর প্রকৃত পরিমাণ প্রায় ৬৯%।)")}</span>` : "";
    $("#k3ro", el).innerHTML = `${L2("Average", "গড়")} = (${B3(p)} × ${f3(x, 1)} + ${B3(q)} × ${f3(y, 1)}) ÷ ${B3(100)} = <b>${f3(avg, 2)}</b>${L2(".", "।")} ` +
      L2("The pivot sits at the balance point: the heavier side (more atoms) pulls the average towards it.", "ভারকেন্দ্রটি সাম্যবিন্দুতে বসে: যে দিকে পরমাণু বেশি, গড় সেদিকে ঝোঁকে।") + nat + cu;
  };
  const drawM = () => {
    const [f, c] = M[mi]; let tot = 0; const parts = Object.entries(c).map(([e, k]) => { tot += AM[e] * k; return `${e}: ${f3(AM[e], AM[e] % 1 ? 1 : 0)} × ${B3(k)} = ${f3(AM[e] * k, AM[e] * k % 1 ? 1 : 0)}`; });
    $("#k3rmo", el).innerHTML = `<b>${fx3(f)}</b>: ${parts.join(" ; ")}<br>${L2("Relative molecular mass", "আপেক্ষিক আণবিক ভর")} = <b>${f3(tot, tot % 1 ? 1 : 0)}</b> ${L2("(no unit)", "(একক নেই)")}`;
  };
  chips3(el, ".k3rp", b => { pi = +b.dataset.i; $("#k3rx", el).value = P[pi][3]; draw(); });
  chips3(el, ".k3rm", b => { mi = +b.dataset.i; drawM(); });
  onIn3(el, draw); draw(); drawM();
};

/* ============ 3.10 half-life of radioactive isotopes ============ */
W.k3half = (el) => {
  const I = [["⁹⁹ᵐTc", 6, L2("hours", "ঘণ্টা"), L2("medical scans", "রোগ নির্ণয়ের স্ক্যান")], ["¹³¹I", 8.02, L2("days", "দিন"), L2("thyroid treatment", "থাইরয়েড চিকিৎসা")],
    ["³²P", 14.3, L2("days", "দিন"), L2("tracer in crops; blood disease", "ফসলে ট্রেসার; রক্তের রোগ")], ["⁶⁰Co", 5.27, L2("years", "বছর"), L2("cancer therapy, food irradiation", "ক্যানসার চিকিৎসা, খাদ্য বিকিরণ")],
    ["¹⁴C", 5730, L2("years", "বছর"), L2("dating old objects", "পুরোনো বস্তুর বয়স নির্ণয়")]];
  let ii = 0;
  el.innerHTML = `<div class="chipset k3hi" role="group">${I.map((s, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${s[0]}</button>`).join("")}</div>
    ${slider("k3ht", L2("Time (in half-lives)", "সময় (অর্ধায়ুর সংখ্যায়)"), 0, 6, 0.1, 1, "")}
    <div class="svgwrap fit" id="k3hsv"></div><div class="w-out" id="k3ho"></div>`;
  const R = rng3(4242), th = []; for (let i = 0; i < 100; i++) th.push(R());
  const draw = () => {
    const k = sv(el, "k3ht", "", 1), [nm, T, unit, use] = I[ii], left = Math.pow(0.5, k), t = k * T;
    let g = `<svg viewBox="0 0 360 214" role="img" aria-label="${L2("decay graph", "ক্ষয়ের লেখচিত্র")}">`;
    const gx = 44, gy = 170, gw = 160, gh = 140, px = v => gx + v / 6 * gw, py = f => gy - f * gh;
    g += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh - 6}" stroke="var(--muted)"/>`;
    let d = ""; for (let v = 0; v <= 6.001; v += 0.1) d += (v ? "L" : "M") + px(v).toFixed(1) + " " + py(Math.pow(0.5, v)).toFixed(1);
    g += `<path d="${d}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
    [1, 2, 3].forEach(v => g += `<line x1="${px(v)}" y1="${gy}" x2="${px(v)}" y2="${py(Math.pow(0.5, v))}" stroke="var(--rule)" stroke-dasharray="3 3"/>`);
    [0, 2, 4, 6].forEach(v => g += `<text x="${px(v)}" y="${gy + 16}" font-size="12" text-anchor="middle" fill="var(--muted)">${B3(v)}</text>`);
    g += `<text x="${gx - 4}" y="${py(1) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B3(100)}</text><text x="${gx + 6}" y="${py(1) - 8}" font-size="12" fill="var(--muted)">% ${L2("left", "বাকি")}</text><text x="${gx - 4}" y="${py(0.5) + 4}" font-size="12" text-anchor="end" fill="var(--muted)">${B3(50)}</text>
      <text x="${gx + gw}" y="${gy + 34}" font-size="12" text-anchor="end" fill="var(--muted)">${L2("half-lives", "অর্ধায়ু")}</text>
      <circle cx="${px(k)}" cy="${py(left)}" r="5" fill="var(--bad)"/>`;
    // 100 nuclei
    for (let i = 0; i < 100; i++) { const cx = 226 + (i % 10) * 13, cy = 36 + Math.floor(i / 10) * 13, alive = th[i] < left;
      g += `<circle cx="${cx}" cy="${cy}" r="5" fill="${alive ? "var(--bad)" : "none"}" stroke="${alive ? "var(--ink)" : "var(--rule)"}" stroke-width=".8"/>`; }
    g += `<text x="285" y="182" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("red = not yet decayed", "লাল = এখনো ক্ষয় হয়নি")}</text></svg>`;
    $("#k3hsv", el).innerHTML = g;
    $("#k3ho", el).innerHTML = L2(`<b>${nm}</b>: half-life ${f3(T, T % 1 ? 2 : 0)} ${unit} (${use}). After ${f3(t, t < 10 && t % 1 ? 1 : 0)} ${unit} (${f3(k, 1)} half-lives), <b>${f3(left * 100, left < 0.1 ? 2 : 0)}%</b> is still radioactive: (1/2)<sup>${f3(k, 1)}</sup>.`,
      `<b>${nm}</b>: অর্ধায়ু ${f3(T, T % 1 ? 2 : 0)} ${unit} (${use})। ${f3(t, t < 10 && t % 1 ? 1 : 0)} ${unit} (${f3(k, 1)}টি অর্ধায়ু) পরে <b>${f3(left * 100, left < 0.1 ? 2 : 0)}%</b> তেজস্ক্রিয় থাকে: (১/২)<sup>${f3(k, 1)}</sup>।`)
      + (ii === 0 ? L2(" After one day (4 half-lives) only about 6% is left, which is why it is safe for scans.", " এক দিন (৪টি অর্ধায়ু) পরে মাত্র প্রায় ৬% থাকে, এজন্যই স্ক্যানের জন্য এটি নিরাপদ।") : "");
  };
  chips3(el, ".k3hi", b => { ii = +b.dataset.i; draw(); });
  onIn3(el, draw); draw();
};
