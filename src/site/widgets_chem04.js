/* ---- chemistry chapter 4 widgets: periodic table ---- */
const B4 = x => bnNum(x, LANG);
const f4 = (x, d = 0) => B4((+x).toFixed(d));
const mix4 = (c, p) => `color-mix(in srgb, ${c} ${p}%, var(--sheet))`;
const chips4 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const SUP4 = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const usup4 = s => String(s).replace(/\d/g, d => SUP4[d]);

/* ---------- element data 1..118: symbol, English, Bangla ---------- */
const ELS4 = ("H,Hydrogen,হাইড্রোজেন|He,Helium,হিলিয়াম|Li,Lithium,লিথিয়াম|Be,Beryllium,বেরিলিয়াম|B,Boron,বোরন|C,Carbon,কার্বন|N,Nitrogen,নাইট্রোজেন|O,Oxygen,অক্সিজেন|F,Fluorine,ফ্লোরিন|Ne,Neon,নিয়ন|" +
  "Na,Sodium,সোডিয়াম|Mg,Magnesium,ম্যাগনেসিয়াম|Al,Aluminium,অ্যালুমিনিয়াম|Si,Silicon,সিলিকন|P,Phosphorus,ফসফরাস|S,Sulfur,সালফার|Cl,Chlorine,ক্লোরিন|Ar,Argon,আর্গন|" +
  "K,Potassium,পটাশিয়াম|Ca,Calcium,ক্যালসিয়াম|Sc,Scandium,স্ক্যান্ডিয়াম|Ti,Titanium,টাইটেনিয়াম|V,Vanadium,ভ্যানাডিয়াম|Cr,Chromium,ক্রোমিয়াম|Mn,Manganese,ম্যাঙ্গানিজ|Fe,Iron,আয়রন|Co,Cobalt,কোবাল্ট|Ni,Nickel,নিকেল|Cu,Copper,কপার|Zn,Zinc,জিংক|Ga,Gallium,গ্যালিয়াম|Ge,Germanium,জার্মেনিয়াম|As,Arsenic,আর্সেনিক|Se,Selenium,সেলেনিয়াম|Br,Bromine,ব্রোমিন|Kr,Krypton,ক্রিপ্টন|" +
  "Rb,Rubidium,রুবিডিয়াম|Sr,Strontium,স্ট্রনসিয়াম|Y,Yttrium,ইট্রিয়াম|Zr,Zirconium,জিরকোনিয়াম|Nb,Niobium,নাইওবিয়াম|Mo,Molybdenum,মলিবডেনাম|Tc,Technetium,টেকনেশিয়াম|Ru,Ruthenium,রুথেনিয়াম|Rh,Rhodium,রোডিয়াম|Pd,Palladium,প্যালাডিয়াম|Ag,Silver,সিলভার|Cd,Cadmium,ক্যাডমিয়াম|In,Indium,ইন্ডিয়াম|Sn,Tin,টিন|Sb,Antimony,অ্যান্টিমনি|Te,Tellurium,টেলুরিয়াম|I,Iodine,আয়োডিন|Xe,Xenon,জেনন|" +
  "Cs,Caesium,সিজিয়াম|Ba,Barium,বেরিয়াম|La,Lanthanum,ল্যান্থানাম|Ce,Cerium,সিরিয়াম|Pr,Praseodymium,প্রাসিওডিমিয়াম|Nd,Neodymium,নিওডিমিয়াম|Pm,Promethium,প্রমিথিয়াম|Sm,Samarium,সামারিয়াম|Eu,Europium,ইউরোপিয়াম|Gd,Gadolinium,গ্যাডোলিনিয়াম|Tb,Terbium,টারবিয়াম|Dy,Dysprosium,ডিসপ্রোসিয়াম|Ho,Holmium,হলমিয়াম|Er,Erbium,আরবিয়াম|Tm,Thulium,থুলিয়াম|Yb,Ytterbium,ইটারবিয়াম|Lu,Lutetium,লুটেসিয়াম|" +
  "Hf,Hafnium,হ্যাফনিয়াম|Ta,Tantalum,ট্যান্টালাম|W,Tungsten,টাংস্টেন|Re,Rhenium,রেনিয়াম|Os,Osmium,অসমিয়াম|Ir,Iridium,ইরিডিয়াম|Pt,Platinum,প্লাটিনাম|Au,Gold,গোল্ড|Hg,Mercury,মার্কারি|Tl,Thallium,থ্যালিয়াম|Pb,Lead,লেড|Bi,Bismuth,বিসমাথ|Po,Polonium,পোলোনিয়াম|At,Astatine,অ্যাস্টাটিন|Rn,Radon,রেডন|" +
  "Fr,Francium,ফ্রানসিয়াম|Ra,Radium,রেডিয়াম|Ac,Actinium,অ্যাকটিনিয়াম|Th,Thorium,থোরিয়াম|Pa,Protactinium,প্রোট্যাকটিনিয়াম|U,Uranium,ইউরেনিয়াম|Np,Neptunium,নেপচুনিয়াম|Pu,Plutonium,প্লুটোনিয়াম|Am,Americium,অ্যামেরিসিয়াম|Cm,Curium,কুরিয়াম|Bk,Berkelium,বার্কেলিয়াম|Cf,Californium,ক্যালিফোর্নিয়াম|Es,Einsteinium,আইনস্টাইনিয়াম|Fm,Fermium,ফার্মিয়াম|Md,Mendelevium,মেন্ডেলেভিয়াম|No,Nobelium,নোবেলিয়াম|Lr,Lawrencium,লরেনসিয়াম|" +
  "Rf,Rutherfordium,রাদারফোর্ডিয়াম|Db,Dubnium,ডুবনিয়াম|Sg,Seaborgium,সিবোর্গিয়াম|Bh,Bohrium,বোরিয়াম|Hs,Hassium,হ্যাসিয়াম|Mt,Meitnerium,মাইটনেরিয়াম|Ds,Darmstadtium,ডার্মস্টাডটিয়াম|Rg,Roentgenium,রন্টজেনিয়াম|Cn,Copernicium,কোপার্নিসিয়াম|Nh,Nihonium,নিহোনিয়াম|Fl,Flerovium,ফ্লেরোভিয়াম|Mc,Moscovium,মস্কোভিয়াম|Lv,Livermorium,লিভারমোরিয়াম|Ts,Tennessine,টেনেসিন|Og,Oganesson,ওগানেসন").split("|").map(s => s.split(","));
const sym4 = z => ELS4[z - 1][0];
const nm4 = z => L2(ELS4[z - 1][1], ELS4[z - 1][2]);
/* rounded relative atomic masses for Z = 1..36 */
const MASS4 = [1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35.5, 40, 39, 40, 45, 48, 51, 52, 55, 56, 58.9, 58.7, 63.5, 65, 70, 73, 75, 79, 80, 84];

/* position in the table */
const pos4 = z => {
  const st = [1, 3, 11, 19, 37, 55, 87], en = [2, 10, 18, 36, 54, 86, 118];
  let i = 0; while (z > en[i]) i++;
  const o = z - st[i] + 1, p = i + 1; let g, f = false, fi = -1;
  if (p === 1) g = z === 1 ? 1 : 18;
  else if (p <= 3) g = o <= 2 ? o : o + 10;
  else if (p <= 5) g = o;
  else if (o <= 2) g = o;
  else if (o <= 17) { g = 3; f = true; fi = o - 3; }
  else g = o - 14;
  return { p, g, f, fi };
};
const block4 = z => { const q = pos4(z); return q.f ? "f" : (q.g <= 2 || z === 2) ? "s" : q.g >= 13 ? "p" : "d"; };
const NONM4 = [1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36, 53, 54, 86], MLD4 = [5, 14, 32, 33, 51, 52];
const type4 = z => (z >= 104 || z === 85) ? "unk" : NONM4.includes(z) ? "non" : MLD4.includes(z) ? "mld" : "met";
const fam4 = z => { const q = pos4(z); if (z === 1) return "h"; if (q.f) return q.p === 6 ? "lan" : "act";
  if (q.g === 1) return "alk"; if (q.g === 2) return "ae"; if (q.g === 17) return "hal"; if (q.g === 18) return "nob";
  if (q.g >= 3 && q.g <= 12) return [30, 48, 80, 112].includes(z) ? "d" : "tr"; return "oth"; };

/* ground-state configuration up to Z = 36 (Cr, Cu exceptions), consistent with chapter 3 */
const ORD4 = [["1s", 1, 0], ["2s", 2, 0], ["2p", 2, 1], ["3s", 3, 0], ["3p", 3, 1], ["4s", 4, 0], ["3d", 3, 2], ["4p", 4, 1]];
const cfg4 = z => {
  let left = z; const out = ORD4.map(([name, n, l]) => { const cap = 2 * (2 * l + 1), k = Math.min(cap, left); left -= k; return { name, n, l, e: k }; });
  const g = nm => out.find(o => o.name === nm);
  if (z === 24 || z === 29) { g("4s").e = 1; g("3d").e = z === 24 ? 5 : 10; }
  return out.filter(o => o.e).sort((a, b) => a.n - b.n || a.l - b.l);
};
const cfgTxt4 = z => cfg4(z).map(o => o.name + usup4(o.e)).join(" ");
const shells4 = z => { const s = [0, 0, 0, 0]; cfg4(z).forEach(o => s[o.n - 1] += o.e); while (!s[s.length - 1]) s.pop(); return s; };

/* ============ 4.1 history timeline ============ */
W.k4hist = (el) => {
  const EV = [["1789", L2("Lavoisier", "ল্যাভয়সিয়ে")], ["1829", L2("Döbereiner", "ডোবেরাইনার")], ["1864–65", L2("Newlands", "নিউল্যান্ডস")], ["1869", L2("Mendeleev", "মেন্ডেলিফ")], ["1913", L2("Moseley", "মোসলে")], ["2016", "IUPAC"]];
  let k = 0, tri = 0, nstart = 1, sortBy = "mass";
  el.innerHTML = `<div class="svgwrap fit" id="k4hl"></div><div id="k4hp"></div>`;
  const line = () => {
    let g = `<svg viewBox="0 0 360 74" role="img" aria-label="${L2("timeline", "সময়রেখা")}"><line x1="22" y1="30" x2="338" y2="30" stroke="var(--rule)" stroke-width="4" stroke-linecap="round"/>`;
    EV.forEach((e, i) => { const x = 34 + i * 58.4, on = i === k;
      g += `<g data-i="${i}" style="cursor:pointer" role="button" tabindex="0" aria-label="${e[1]}"><rect x="${x - 30}" y="4" width="60" height="68" fill="transparent"/><circle cx="${x}" cy="30" r="${on ? 11 : 8}" fill="${on ? "var(--c)" : "var(--sheet)"}" stroke="var(--c)" stroke-width="3"/>
        <text x="${x}" y="17" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="${on ? 700 : 400}">${B4(e[0].replace("–65", ""))}</text>
        <text x="${x}" y="60" text-anchor="middle" font-size="11" fill="${on ? "var(--c)" : "var(--muted)"}" font-weight="${on ? 700 : 400}">${e[1]}</text></g>`; });
    $("#k4hl", el).innerHTML = g + "</svg>";
    el.querySelectorAll("#k4hl g[data-i]").forEach(n => { const go = () => { k = +n.dataset.i; line(); panel(); }; n.addEventListener("click", go); n.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } }); });
  };
  const TRI = [["Cl", 35.5, "Br", 80, "I", 127], ["Li", 7, "Na", 23, "K", 39], ["Ca", 40, "Sr", 88, "Ba", 137], ["S", 32, "Se", 79, "Te", 128]];
  const NEW = [["Li", 7], ["Be", 9], ["B", 11], ["C", 12], ["N", 14], ["O", 16], ["F", 19], ["Na", 23], ["Mg", 24], ["Al", 27], ["Si", 28], ["P", 31], ["S", 32], ["Cl", 35.5], ["K", 39], ["Ca", 40]];
  const panel = () => {
    const P = $("#k4hp", el); let h = `<div class="w-out"><b>${B4(EV[k][0])}: ${EV[k][1]}</b><br>`;
    if (k === 0) {
      h += L2("Lavoisier sorted the 33 substances he believed were elements into just two boxes.", "ল্যাভয়সিয়ে যে ৩৩টি পদার্থকে মৌল মনে করতেন, সেগুলোকে মাত্র দুটি ভাগে সাজান।") + `</div>
      <div class="w-row" style="gap:10px;flex-wrap:wrap;margin-top:8px">
        <div style="flex:1;min-width:140px;border:2px solid var(--c);border-radius:12px;padding:8px"><b>${L2("Metals", "ধাতু")}</b><br>Hg, Zn, Fe, Cu, Ag, Au, Sn, Pb …</div>
        <div style="flex:1;min-width:140px;border:2px solid var(--note);border-radius:12px;padding:8px"><b>${L2("Non-metals", "অধাতু")}</b><br>O, N, H, P, S, C …</div></div>
      <p class="hint">${L2("Problem: sodium and gold land in the same box, yet they behave completely differently.", "সমস্যা: সোডিয়াম আর সোনা একই ভাগে পড়ে, অথচ আচরণে একেবারে আলাদা।")}</p>`;
    } else if (k === 1) {
      const t = TRI[tri], avg = (t[1] + t[5]) / 2, mx = 140;
      const bar = (x, v, lab, hi) => `<rect x="${x}" y="${150 - v / mx * 120}" width="54" height="${v / mx * 120}" rx="4" fill="${hi ? "var(--c)" : mix4("var(--c)", 35)}"/><text x="${x + 27}" y="${144 - v / mx * 120}" text-anchor="middle" font-size="13" fill="var(--ink)">${f4(v, v % 1 ? 2 : 0)}</text><text x="${x + 27}" y="168" text-anchor="middle" font-size="14" fill="var(--ink)" font-weight="700">${lab}</text>`;
      h += L2("Pick a triad. Is the middle mass close to the average of the outer two?", "একটি ত্রয়ী বেছে নাও। মাঝেরটির ভর কি বাকি দুটির গড়ের কাছাকাছি?") + `</div>
      <div class="chipset" id="k4tri" role="group">${TRI.map((t, i) => `<button aria-pressed="${i === tri}" data-i="${i}">${t[0]}, ${t[2]}, ${t[4]}</button>`).join("")}</div>
      <div class="svgwrap fit"><svg viewBox="0 0 360 176" role="img" aria-label="${L2("triad bar chart", "ত্রয়ী দণ্ডচিত্র")}">
        ${bar(20, t[1], t[0])}${bar(96, t[3], t[2], 1)}${bar(172, t[5], t[4])}
        <line x1="90" x2="160" y1="${150 - avg / mx * 120}" y2="${150 - avg / mx * 120}" stroke="var(--bad)" stroke-width="2.5" stroke-dasharray="6 4"/>
        <text x="240" y="60" font-size="13" fill="var(--bad)">${L2("average", "গড়")} = ${f4(avg, avg % 1 ? 2 : 0)}</text>
        <text x="240" y="80" font-size="13" fill="var(--ink)">${L2("middle", "মাঝের")} = ${f4(t[3], 0)}</text>
        <text x="240" y="100" font-size="13" fill="var(--muted)">${L2("difference", "পার্থক্য")} ${f4(Math.abs(avg - t[3]), 2)}</text></svg></div>`;
    } else if (k === 2) {
      h += L2("Tap a starting element. Count 8 along the row (the start is 1): the 8th element resembles it.", "একটি শুরুর মৌলে চাপ দাও। সারি বরাবর ৮ গোনো (শুরুরটি ১): ৮ম মৌলটি এর মতো।") + `</div>
      <div id="k4nw" style="display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin:8px 0">${NEW.map((e, i) => { const on = i === nstart || i === nstart + 7; const mid = i > nstart && i < nstart + 7;
        return `<button data-i="${i}" style="min-height:48px;border-radius:8px;border:2px solid ${on ? "var(--c)" : "var(--rule)"};background:${on ? "var(--c-soft)" : mid ? mix4("var(--note)", 18) : "var(--sheet)"};color:var(--ink);font:inherit;padding:2px"><b>${e[0]}</b><br><small>${f4(e[1], e[1] % 1 ? 1 : 0)}</small></button>`; }).join("")}</div>
      <p class="hint">${nstart + 7 < NEW.length ? `${NEW[nstart][0]} → ${NEW[nstart + 7][0]}: ${L2("8th element, similar properties.", "৮ম মৌল, ধর্ম একই রকম।")}` : L2("Pick an element in the first row.", "প্রথম সারির একটি মৌল বেছে নাও।")} ${L2("The pattern worked only up to calcium; noble gases were not yet known.", "নকশাটি শুধু ক্যালসিয়াম পর্যন্ত খাটত; তখনো নিষ্ক্রিয় গ্যাস অজানা।")}</p>`;
    } else if (k === 3 || k === 4) {
      const L = [["Cl", 35.5, 17, "hal"], ["Ar", 40, 18, "nob"], ["K", 39, 19, "alk"], ["Ca", 40.1, 20, "ae"]];
      const arr = L.slice().sort((a, b) => sortBy === "mass" ? a[1] - b[1] : a[2] - b[2]);
      const FAM = { hal: L2("halogen", "হ্যালোজেন"), nob: L2("noble gas", "নিষ্ক্রিয় গ্যাস"), alk: L2("alkali metal", "ক্ষার ধাতু"), ae: L2("alkaline-earth", "মৃৎক্ষার") };
      const COL = { hal: "var(--good)", nob: "var(--muted)", alk: "var(--bad)", ae: "var(--note)" };
      const ok = sortBy === "number";
      h += (k === 3 ? L2("Mendeleev (63 elements) left gaps and predicted new elements. For eka-silicon he predicted mass ≈ 72, density ≈ 5.5 g/cm³; germanium (1886) has 72.6 and 5.3 g/cm³. But look at argon and potassium:", "মেন্ডেলিফ (৬৩টি মৌল) ঘর ফাঁকা রেখে নতুন মৌলের ভবিষ্যদ্বাণী করেন। একা-সিলিকনের জন্য বলেছিলেন ভর ≈ ৭২, ঘনত্ব ≈ ৫.৫ g/cm³; জার্মেনিয়ামের (১৮৮৬) ৭২.৬ ও ৫.৩ g/cm³। কিন্তু আর্গন আর পটাশিয়াম দেখো:")
        : L2("Moseley showed that each element has an atomic number (protons). Sort by it and the puzzle disappears. Modern periodic law: properties are periodic functions of atomic number.", "মোসলে দেখান প্রতিটি মৌলের একটি পারমাণবিক সংখ্যা (প্রোটন সংখ্যা) আছে। এ অনুযায়ী সাজালেই ধাঁধা উধাও। আধুনিক পর্যায় সূত্র: ধর্ম পারমাণবিক সংখ্যার পর্যায়বৃত্ত ফাংশন।")) + `</div>
      <div class="chipset" id="k4srt" role="group"><button data-s="mass" aria-pressed="${sortBy === "mass"}">${L2("Sort by atomic mass", "পারমাণবিক ভর অনুযায়ী")}</button><button data-s="number" aria-pressed="${sortBy === "number"}">${L2("Sort by atomic number", "পারমাণবিক সংখ্যা অনুযায়ী")}</button></div>
      <div class="svgwrap fit"><svg viewBox="0 0 360 104" role="img" aria-label="${L2("ordering puzzle", "ক্রম ধাঁধা")}">
      ${[L2("group 17", "গ্রুপ ১৭"), L2("group 18", "গ্রুপ ১৮"), L2("group 1", "গ্রুপ ১"), L2("group 2", "গ্রুপ ২")].map((s, i) => `<text x="${50 + i * 87}" y="16" text-anchor="middle" font-size="12" fill="var(--muted)">${s}</text>`).join("")}
      ${arr.map((e, i) => { const x = 12 + i * 87, right = ["hal", "nob", "alk", "ae"][i] === e[3];
        return `<rect x="${x}" y="24" width="76" height="72" rx="10" fill="${mix4(COL[e[3]], 30)}" stroke="${right ? COL[e[3]] : "var(--bad)"}" stroke-width="${right ? 2 : 3}" ${right ? "" : 'stroke-dasharray="5 3"'}/>
        <text x="${x + 38}" y="54" text-anchor="middle" font-size="20" font-weight="700" fill="var(--ink)">${e[0]}</text>
        <text x="${x + 38}" y="72" text-anchor="middle" font-size="12" fill="var(--ink)">${sortBy === "mass" ? L2("mass ", "ভর ") + f4(e[1], e[1] % 1 ? 1 : 0) : "Z = " + B4(e[2])}</text>
        <text x="${x + 38}" y="88" text-anchor="middle" font-size="11" fill="var(--ink)">${FAM[e[3]]}</text>`; }).join("")}
</svg></div><p style="font-weight:700;color:${ok ? "var(--good)" : "var(--bad)"}">${ok ? L2("Every element falls into its own family.", "প্রতিটি মৌল নিজের পরিবারে পড়ে।") : L2("By mass, K lands under the noble gases and Ar under the alkali metals!", "ভর অনুযায়ী K নিষ্ক্রিয় গ্যাসের নিচে আর Ar ক্ষার ধাতুর নিচে!")}</p>`;
    } else {
      h += L2("IUPAC confirmed the names of elements 113 (nihonium, Nh), 115 (moscovium, Mc), 117 (tennessine, Ts) and 118 (oganesson, Og), completing period 7: 118 elements in 7 periods and 18 groups.", "IUPAC ১১৩ (নিহোনিয়াম, Nh), ১১৫ (মস্কোভিয়াম, Mc), ১১৭ (টেনেসিন, Ts) ও ১১৮ (ওগানেসন, Og) নম্বর মৌলের নাম অনুমোদন করে, পর্যায় ৭ পূর্ণ হয়: ৭টি পর্যায় ও ১৮টি গ্রুপে ১১৮টি মৌল।") + `</div>
      <div class="w-row" style="gap:8px;flex-wrap:wrap;margin-top:8px">${[33, 63, 118].map((n, i) => `<div style="flex:1;min-width:90px;text-align:center;border:1.5px solid var(--rule);border-radius:12px;padding:8px"><b style="font-size:22px;color:var(--c)">${B4(n)}</b><br><small>${[L2("Lavoisier's list", "ল্যাভয়সিয়ের তালিকা"), L2("Mendeleev's table", "মেন্ডেলিফের সারণি"), L2("today", "আজ")][i]}</small></div>`).join("")}</div>`;
    }
    P.innerHTML = h;
    if (k === 1) chips4(P, "#k4tri", b => { tri = +b.dataset.i; panel(); });
    if (k === 2) P.querySelectorAll("#k4nw button").forEach(b => b.addEventListener("click", () => { nstart = Math.min(+b.dataset.i, NEW.length - 8); panel(); }));
    if (k === 3 || k === 4) chips4(P, "#k4srt", b => { sortBy = b.dataset.s; panel(); });
  };
  line(); panel();
};

/* ============ 4.2 interactive periodic table ============ */
W.k4table = (el) => {
  const MODES = [["block", L2("Blocks", "ব্লক")], ["type", L2("Metal / non-metal", "ধাতু / অধাতু")], ["fam", L2("Families", "পরিবার")]];
  const COL = {
    block: { s: ["var(--bad)", L2("s-block", "s-ব্লক")], p: ["var(--good)", L2("p-block", "p-ব্লক")], d: ["var(--c)", L2("d-block", "d-ব্লক")], f: ["var(--note)", L2("f-block", "f-ব্লক")] },
    type: { met: ["var(--c)", L2("metal", "ধাতু")], non: ["var(--good)", L2("non-metal", "অধাতু")], mld: ["var(--note)", L2("metalloid", "অপধাতু")], unk: ["var(--muted)", L2("properties little known", "ধর্ম প্রায় অজানা")] },
    fam: { h: ["var(--muted)", L2("hydrogen", "হাইড্রোজেন")], alk: ["var(--bad)", L2("alkali metals", "ক্ষার ধাতু")], ae: ["var(--note)", L2("alkaline-earth metals", "মৃৎক্ষার ধাতু")], tr: ["var(--c)", L2("transition metals", "অবস্থান্তর ধাতু")],
      d: [mix4("var(--c)", 50), L2("d-block, not transition", "d-ব্লক, অবস্থান্তর নয়")], lan: ["var(--note)", L2("lanthanides", "ল্যান্থানাইড")], act: ["var(--bad)", L2("actinides", "অ্যাকটিনাইড")], hal: ["var(--good)", L2("halogens", "হ্যালোজেন")], nob: ["var(--ink)", L2("noble gases", "নিষ্ক্রিয় গ্যাস")], oth: ["var(--rule)", L2("other", "অন্যান্য")] }
  };
  let mode = "block", sel = 26;
  el.innerHTML = `<div class="chipset" id="k4tm" role="group">${MODES.map((m, i) => `<button data-m="${m[0]}" aria-pressed="${i === 0}">${m[1]}</button>`).join("")}</div>
    <div class="w-out" id="k4ti" aria-live="polite"></div>
    <div style="overflow-x:auto;max-width:100%;-webkit-overflow-scrolling:touch;padding-bottom:4px" id="k4tsc"><div id="k4tg" style="display:grid;grid-template-columns:18px repeat(18,34px);grid-template-rows:18px repeat(7,40px) 10px 40px 40px;gap:2px;width:max-content;font-size:13px"></div></div>
    <p class="hint">${L2("Swipe sideways to see the whole table.", "পুরো সারণি দেখতে পাশে টানো।")}</p><div class="w-row" id="k4tl" style="flex-wrap:wrap;gap:6px 12px;font-size:13px"></div>`;
  const cell = (z) => {
    const q = pos4(z), key = mode === "block" ? block4(z) : mode === "type" ? type4(z) : fam4(z), c = COL[mode][key][0], on = z === sel;
    const col = q.f ? q.fi + 4 : q.g + 1, row = q.f ? (q.p === 6 ? 10 : 11) : q.p + 1;
    return `<button data-z="${z}" aria-label="${nm4(z)}" aria-pressed="${on}" style="grid-column:${col};grid-row:${row};padding:0;border-radius:6px;border:${on ? "3px solid var(--ink)" : "1px solid var(--rule)"};background:${mix4(c, 38)};color:var(--ink);font:inherit;line-height:1.05;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center"><span style="font-size:10px">${B4(z)}</span><b style="font-size:14px">${sym4(z)}</b></button>`;
  };
  const draw = () => {
    let h = "";
    for (let g = 1; g <= 18; g++) h += `<div style="grid-column:${g + 1};grid-row:1;font-size:11px;text-align:center;color:var(--muted);align-self:end">${B4(g)}</div>`;
    for (let p = 1; p <= 7; p++) h += `<div style="grid-column:1;grid-row:${p + 1};font-size:11px;color:var(--muted);align-self:center">${B4(p)}</div>`;
    h += `<div style="grid-column:4;grid-row:7;font-size:10px;display:flex;align-items:center;justify-content:center;border:1px dashed var(--rule);border-radius:6px;color:var(--muted)">${B4("57–71")}</div>
      <div style="grid-column:4;grid-row:8;font-size:10px;display:flex;align-items:center;justify-content:center;border:1px dashed var(--rule);border-radius:6px;color:var(--muted)">${B4("89–103")}</div>
      `;
    for (let z = 1; z <= 118; z++) h += cell(z);
    $("#k4tg", el).innerHTML = h;
    el.querySelectorAll("#k4tg button").forEach(b => b.addEventListener("click", () => { sel = +b.dataset.z; draw(); info(); }));
    $("#k4tl", el).innerHTML = Object.values(COL[mode]).map(([c, t]) => `<span style="display:inline-flex;align-items:center;gap:5px"><i style="width:14px;height:14px;border-radius:4px;background:${mix4(c, 38)};border:1px solid var(--rule);display:inline-block"></i>${t}</span>`).join("");
  };
  const info = () => {
    const z = sel, q = pos4(z), b = block4(z);
    const tt = { met: L2("metal", "ধাতু"), non: L2("non-metal", "অধাতু"), mld: L2("metalloid", "অপধাতু"), unk: L2("synthetic / radioactive; properties little known", "কৃত্রিম / তেজস্ক্রিয়; ধর্ম প্রায় অজানা") }[type4(z)];
    let s = `<b style="font-size:18px">${sym4(z)}</b> · <b>${nm4(z)}</b> · Z = ${B4(z)}${z <= 36 ? ` · ${L2("atomic mass", "পারমাণবিক ভর")} ≈ ${f4(MASS4[z - 1], MASS4[z - 1] % 1 ? 1 : 0)}` : ""}<br>
      ${L2("Period", "পর্যায়")} ${B4(q.p)} · ${L2("Group", "গ্রুপ")} ${B4(q.g)}${q.f ? (q.p === 6 ? L2(" (lanthanide)", " (ল্যান্থানাইড)") : L2(" (actinide)", " (অ্যাকটিনাইড)")) : ""} · ${b}-${L2("block", "ব্লক")} · ${tt}<br>
      ${L2("Family", "পরিবার")}: ${COL.fam[fam4(z)][1]}`;
    if (z <= 36) s += `<br>${L2("Configuration", "ইলেকট্রন বিন্যাস")}: <span style="white-space:nowrap">${cfgTxt4(z)}</span> (${shells4(z).map(B4).join(", ")})`;
    else s += `<br><span class="muted">${L2("Configurations beyond Z = 36 are not needed at this level.", "Z = ৩৬-এর পরের বিন্যাস এই শ্রেণিতে দরকার নেই।")}</span>`;
    if (z === 1) s += `<br><span class="muted">${L2("Hydrogen is a non-metal placed in group 1 (see lesson 4.5).", "হাইড্রোজেন অধাতু, তবু গ্রুপ ১-এ রাখা (পাঠ ৪.৫ দেখো)।")}</span>`;
    if (z === 2) s += `<br><span class="muted">${L2("1s² is a full shell, so helium sits in group 18, not 2.", "1s² পূর্ণ শেল, তাই হিলিয়াম গ্রুপ ২-এ নয়, ১৮-এ।")}</span>`;
    $("#k4ti", el).innerHTML = s;
  };
  chips4(el, "#k4tm", b => { mode = b.dataset.m; draw(); info(); });
  draw(); info();
};

/* ============ 4.3 position from configuration ============ */
W.k4pos = (el) => {
  let quiz = null;
  el.innerHTML = `${slider("k4pz", L2("Atomic number Z", "পারমাণবিক সংখ্যা Z"), 1, 36, 1, 26, "")}
    <div class="w-row"><button class="btn" id="k4pm">−</button><button class="btn" id="k4pp">+</button><button class="btn solid" id="k4pq">${L2("Quiz me", "আমাকে প্রশ্ন করো")}</button></div>
    <div class="w-out" id="k4po" aria-live="polite"></div><div class="svgwrap fit" id="k4pg"></div><div id="k4pqz"></div>`;
  const analyse = z => {
    const c = cfg4(z), n = Math.max(...c.map(o => o.n)), s = (c.find(o => o.n === n && o.l === 0) || { e: 0 }).e,
      p = (c.find(o => o.n === n && o.l === 1) || { e: 0 }).e, d = (c.find(o => o.n === n - 1 && o.l === 2) || { e: 0 }).e;
    let rule, g, calc;
    if (z === 2) { rule = 0; g = 18; calc = L2("exception: full 1s² shell → group 18", "ব্যতিক্রম: পূর্ণ 1s² শেল → গ্রুপ ১৮"); }
    else if (p) { rule = 2; g = s + p + 10; calc = `${B4(s)} + ${B4(p)} + ${B4(10)} = ${B4(g)}`; }
    else if (d) { rule = 3; g = s + d; calc = `${B4(d)} + ${B4(s)} = ${B4(g)}`; }
    else { rule = 1; g = s; calc = `${B4(s)}`; }
    return { c, n, s, p, d, rule, g, calc };
  };
  const grid = (z, show) => {
    const q = pos4(z); let g = `<svg viewBox="0 0 360 104" role="img" aria-label="${L2("first four periods", "প্রথম চারটি পর্যায়")}">`;
    for (let zz = 1; zz <= 36; zz++) { const r = pos4(zz), x = 18 + (r.g - 1) * 18.8, y = 6 + (r.p - 1) * 24, on = zz === z && show, line = show && (r.p === q.p || r.g === q.g);
      g += `<rect x="${x}" y="${y}" width="17" height="22" rx="3" fill="${on ? "var(--c)" : line ? "var(--c-soft)" : "var(--sheet)"}" stroke="var(--rule)"/>`;
      if (on) g += `<text x="${x + 8.5}" y="${y + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--sheet)">${sym4(zz)}</text>`; }
    for (let p = 1; p <= 4; p++) g += `<text x="8" y="${22 + (p - 1) * 24}" text-anchor="middle" font-size="12" fill="var(--muted)">${B4(p)}</text>`;
    return g + "</svg>";
  };
  const draw = () => {
    const z = sv(el, "k4pz", ""), a = analyse(z);
    const cf = a.c.map(o => { const outer = o.n === a.n || (a.rule === 3 && o.n === a.n - 1 && o.l === 2);
      return `<span style="padding:1px 3px;border-radius:5px;${outer ? `background:var(--c-soft);color:var(--c);font-weight:700;border:1.5px solid var(--c)` : ""}">${o.name}${usup4(o.e)}</span>`; }).join(" ");
    const ruleTxt = [L2("Exception", "ব্যতিক্রম"), L2("Rule 1: outer shell has only s → group = s electrons", "নিয়ম ১: বাইরের শেলে শুধু s → গ্রুপ = s ইলেকট্রন"), L2("Rule 2: outer shell has s and p → group = s + p + 10", "নিয়ম ২: বাইরের শেলে s ও p → গ্রুপ = s + p + ১০"), L2("Rule 3: outer s with inner d → group = d + s", "নিয়ম ৩: বাইরে s, ভেতরে d → গ্রুপ = d + s")][a.rule];
    const cavea = z >= 31 ? `<br><span class="muted">${L2("The full 3d¹⁰ is an inner subshell (shell 3), so it is not counted.", "পূর্ণ 3d¹⁰ ভেতরের উপশক্তিস্তর (শেল ৩), তাই গোনা হয় না।")}</span>` : (z === 24 || z === 29) ? `<br><span class="muted">${L2("Remember the exception: one 4s electron moves into 3d.", "ব্যতিক্রম মনে রাখো: 4s-এর একটি ইলেকট্রন 3d-তে যায়।")}</span>` : "";
    $("#k4po", el).innerHTML = `<b>${sym4(z)}</b> (${nm4(z)}), Z = ${B4(z)}<br><span style="line-height:2">${cf}</span><br>
      ${L2("Outermost shell", "সবচেয়ে বাইরের শেল")} n = ${B4(a.n)} → <b>${L2("period", "পর্যায়")} ${B4(a.n)}</b><br>${ruleTxt}: ${a.calc} → <b>${L2("group", "গ্রুপ")} ${B4(a.g)}</b>${cavea}`;
    $("#k4pg", el).innerHTML = grid(z, true);
  };
  const ask = () => {
    const z = 1 + Math.floor(Math.random() * 36), a = analyse(z); quiz = { z, a, p: 0, g: 0 };
    $("#k4pqz", el).innerHTML = `<div class="w-out"><b>${L2("Quiz", "কুইজ")}:</b> ${L2("an element has the configuration", "একটি মৌলের বিন্যাস")} <b>${cfgTxt4(z)}</b>. ${L2("Find its period and group.", "এর পর্যায় ও গ্রুপ নির্ণয় করো।")}</div>
      <div class="w-row" style="flex-wrap:wrap;gap:8px">${L2("Period", "পর্যায়")}: <span class="chipset" id="k4qp" role="group">${[1, 2, 3, 4].map(p => `<button data-v="${p}" aria-pressed="false">${B4(p)}</button>`).join("")}</span></div>
      <div class="w-row" style="gap:8px"><label for="k4qg">${L2("Group", "গ্রুপ")}:</label><select class="w-in" id="k4qg"><option value="0">—</option>${Array.from({ length: 18 }, (_, i) => `<option value="${i + 1}">${B4(i + 1)}</option>`).join("")}</select>
      <button class="btn solid" id="k4qc">${L2("Check", "মিলিয়ে দেখো")}</button><button class="btn" id="k4qn">${L2("Another", "আরেকটি")}</button></div><div class="w-out" id="k4qo"></div>`;
    chips4(el, "#k4qp", b => { quiz.p = +b.dataset.v; });
    $("#k4qc", el).addEventListener("click", () => { quiz.g = +$("#k4qg", el).value; const okP = quiz.p === a.n, okG = quiz.g === a.g;
      $("#k4qo", el).innerHTML = (okP && okG ? `<b style="color:var(--good)">${L2("Correct!", "ঠিক!")}</b> ` : `<b style="color:var(--bad)">${L2("Not quite.", "হয়নি।")}</b> `) +
        `${sym4(z)} (Z = ${B4(z)}): ${L2("period", "পর্যায়")} ${B4(a.n)}, ${L2("group", "গ্রুপ")} ${B4(a.g)} (${a.calc}).`; });
    $("#k4qn", el).addEventListener("click", ask);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", draw));
  const step = d => { const inp = el.querySelector('input[type="range"]'); inp.value = Math.max(1, Math.min(36, +inp.value + d)); draw(); };
  $("#k4pm", el).addEventListener("click", () => step(-1)); $("#k4pp", el).addEventListener("click", () => step(1));
  $("#k4pq", el).addEventListener("click", ask);
  draw();
};

/* ============ 4.4 same group, same outer electrons ============ */
W.k4same = (el) => {
  const G = {
    1: [["Li", 3, [2, 1], "1s² <b>2s¹</b>"], ["Na", 11, [2, 8, 1], "1s² 2s² 2p⁶ <b>3s¹</b>"], ["K", 19, [2, 8, 8, 1], "… 3s² 3p⁶ <b>4s¹</b>"]],
    2: [["Be", 4, [2, 2], "1s² <b>2s²</b>"], ["Mg", 12, [2, 8, 2], "1s² 2s² 2p⁶ <b>3s²</b>"], ["Ca", 20, [2, 8, 8, 2], "… 3s² 3p⁶ <b>4s²</b>"]],
    17: [["F", 9, [2, 7], "1s² <b>2s² 2p⁵</b>"], ["Cl", 17, [2, 8, 7], "… <b>3s² 3p⁵</b>"], ["Br", 35, [2, 8, 18, 7], "… 3d¹⁰ <b>4s² 4p⁵</b>"]],
    18: [["He", 2, [2], "<b>1s²</b>"], ["Ne", 10, [2, 8], "1s² <b>2s² 2p⁶</b>"], ["Ar", 18, [2, 8, 8], "… <b>3s² 3p⁶</b>"]]
  };
  const NOTE = { 1: L2("All end in ns¹: each loses 1 electron → M⁺ (noble-gas arrangement).", "সবগুলোর শেষে ns¹: প্রত্যেকে ১টি ইলেকট্রন ত্যাগ করে → M⁺ (নিষ্ক্রিয় গ্যাসের মতো বিন্যাস)।"),
    2: L2("All end in ns²: each loses 2 electrons → M²⁺.", "সবগুলোর শেষে ns²: প্রত্যেকে ২টি ইলেকট্রন ত্যাগ করে → M²⁺।"),
    17: L2("All end in ns² np⁵ (7 outer electrons): each gains 1 electron → X⁻.", "সবগুলোর শেষে ns² np⁵ (বাইরে ৭টি): প্রত্যেকে ১টি ইলেকট্রন গ্রহণ করে → X⁻।"),
    18: L2("Full outer shells (He 1s², others ns² np⁶): no electrons lost or gained.", "বাইরের শেল পূর্ণ (He 1s², বাকিরা ns² np⁶): কোনো ইলেকট্রন ত্যাগ বা গ্রহণ নেই।") };
  let grp = 1, ion = false, u = 1;
  el.innerHTML = `<div class="chipset" id="k4sg" role="group">${[1, 2, 17, 18].map((g, i) => `<button data-g="${g}" aria-pressed="${i === 0}">${L2("Group ", "গ্রুপ ")}${B4(g)}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k4ss"></div><div class="w-row"><button class="btn solid" id="k4si">${L2("Form ions", "আয়ন তৈরি করো")}</button></div><div class="w-out" id="k4so"></div>`;
  const atom = (cx, cy, sh, g, t) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="9" fill="var(--bad)"/>`, last = sh.length - 1;
    sh.forEach((n, i) => { const r = 20 + i * 10.5; s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--rule)" stroke-width="1.3"/>`;
      const outer = i === last && g !== 18;
      for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + 2 * Math.PI * k / n; let rr = r;
        let op = 1; if (outer && ion && (g === 1 || g === 2)) { rr = r + 34 * t; op = 1 - t; }
        s += `<circle cx="${(cx + rr * Math.cos(a)).toFixed(1)}" cy="${(cy + rr * Math.sin(a)).toFixed(1)}" r="${outer ? 3.6 : 2.6}" fill="${outer ? "var(--c)" : "var(--ink)"}" opacity="${op.toFixed(2)}"/>`; }
      if (outer && ion && g === 17) { const a = -Math.PI / 2 + 2 * Math.PI * (n - 0.5) / n, rr = r + 34 * (1 - t);
        s += `<circle cx="${(cx + rr * Math.cos(a)).toFixed(1)}" cy="${(cy + rr * Math.sin(a)).toFixed(1)}" r="3.8" fill="var(--good)" stroke="var(--ink)" stroke-width=".8"/>`; } });
    return s;
  };
  const draw = () => {
    const M = G[grp]; let s = `<svg viewBox="0 0 360 196" role="img" aria-label="${L2("shell diagrams", "শেল-চিত্র")}">`;
    const chg = { 1: "⁺", 2: "²⁺", 17: "⁻", 18: "" }[grp];
    M.forEach((m, i) => { const cx = 60 + i * 120; s += atom(cx, 78, m[2], grp, u);
      s += `<text x="${cx}" y="160" text-anchor="middle" font-size="16" font-weight="700" fill="var(--ink)">${m[0]}${ion && u > 0.5 ? chg : ""} <tspan font-size="12" font-weight="400" fill="var(--muted)">(${B4(m[1])})</tspan></text>
        <text x="${cx}" y="180" text-anchor="middle" font-size="12" fill="var(--muted)">${(ion && u > 0.5 ? (grp === 17 ? m[2].map((v, j) => j === m[2].length - 1 ? v + 1 : v) : m[2].slice(0, -1)) : m[2]).map(B4).join(", ")}</text>`; });
    $("#k4ss", el).innerHTML = s + "</svg>";
    $("#k4so", el).innerHTML = M.map(m => `${m[0]}: ${m[3]}`).join("<br>") + `<br><span style="color:var(--c)">${NOTE[grp]}</span>`;
    $("#k4si", el).textContent = ion ? L2("Show neutral atoms", "নিরপেক্ষ পরমাণু দেখাও") : L2("Form ions", "আয়ন তৈরি করো");
    $("#k4si", el).disabled = grp === 18;
  };
  chips4(el, "#k4sg", b => { grp = +b.dataset.g; ion = false; u = 1; draw(); });
  $("#k4si", el).addEventListener("click", () => { ion = !ion; u = ion && !REDUCED ? 0 : 1; draw(); });
  if (!REDUCED) animate(el, dt => { if (u < 1) { u = Math.min(1, u + dt * 1.2); draw(); } });
  draw();
};

/* ============ 4.6 periodic trends ============ */
W.k4trend = (el) => {
  const SETS = {
    p2: [L2("Period 2", "পর্যায় ২"), ["Li", "Be", "B", "C", "N", "O", "F", "Ne"]], p3: [L2("Period 3", "পর্যায় ৩"), ["Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"]],
    g1: [L2("Group 1", "গ্রুপ ১"), ["Li", "Na", "K", "Rb", "Cs"]], g2: [L2("Group 2", "গ্রুপ ২"), ["Be", "Mg", "Ca", "Sr", "Ba"]], g17: [L2("Group 17", "গ্রুপ ১৭"), ["F", "Cl", "Br", "I"]]
  };
  /* covalent radius (pm), 1st ionisation energy (kJ/mol), Pauling electronegativity, electron affinity (kJ/mol released; ≈0 → 0) */
  const D = {
    Li: [128, 520, 0.98, 60], Be: [96, 899, 1.57, 0], B: [84, 801, 2.04, 27], C: [76, 1086, 2.55, 122], N: [71, 1402, 3.04, 0], O: [66, 1314, 3.44, 141], F: [57, 1681, 3.98, 328], Ne: [null, 2081, null, 0],
    Na: [166, 496, 0.93, 53], Mg: [141, 738, 1.31, 0], Al: [121, 578, 1.61, 42], Si: [111, 787, 1.90, 134], P: [107, 1012, 2.19, 72], S: [105, 1000, 2.58, 200], Cl: [102, 1251, 3.16, 349], Ar: [null, 1521, null, 0],
    K: [203, 419, 0.82, 48], Rb: [220, 403, 0.82, 47], Cs: [244, 376, 0.79, 46], Ca: [176, 590, 1.00, 2], Sr: [195, 549, 0.95, 5], Ba: [215, 503, 0.89, 14], Br: [120, 1140, 2.96, 325], I: [139, 1008, 2.66, 295]
  };
  const PROP = [[L2("Atomic radius", "পারমাণবিক ব্যাসার্ধ"), "pm", 0], [L2("Ionisation energy", "আয়নিকরণ শক্তি"), "kJ/mol", 0], [L2("Electronegativity", "তড়িৎ ঋণাত্মকতা"), "", 2], [L2("Electron affinity", "ইলেকট্রন আসক্তি"), "kJ/mol", 0]];
  const NOTES = {
    0: { p: L2("Across a period the radius decreases: more protons pull the same shell closer. (Noble gases are left out: their radius is measured differently.)", "পর্যায় বরাবর ব্যাসার্ধ কমে: বেশি প্রোটন একই শেলকে কাছে টানে। (নিষ্ক্রিয় গ্যাস বাদ: এদের ব্যাসার্ধ ভিন্নভাবে মাপা হয়।)"), g: L2("Down a group the radius increases: a new shell is added each time.", "গ্রুপে নিচের দিকে ব্যাসার্ধ বাড়ে: প্রতিবার একটি নতুন শেল যোগ হয়।") },
    1: { p: L2("Generally increases across a period. Small dips: B < Be and Al < Mg (lone p electron is easier to remove); O < N and S < P (paired p electrons repel).", "পর্যায় বরাবর সাধারণত বাড়ে। ছোট খাঁজ: B < Be ও Al < Mg (একা p ইলেকট্রন সরানো সহজ); O < N ও S < P (জোড় p ইলেকট্রনের বিকর্ষণ)।"), g: L2("Decreases down a group: the outer electron is farther away and better shielded.", "গ্রুপে নিচের দিকে কমে: বাইরের ইলেকট্রন দূরে ও বেশি আবৃত।") },
    2: { p: L2("Increases across a period; noble gases have no value on this scale. F (3.98) is the highest of all.", "পর্যায় বরাবর বাড়ে; এই স্কেলে নিষ্ক্রিয় গ্যাসের মান নেই। F (৩.৯৮) সবার চেয়ে বেশি।"), g: L2("Decreases down a group.", "গ্রুপে নিচের দিকে কমে।") },
    3: { p: L2("Generally increases towards the halogens. Be, Mg, N and the noble gases hardly accept an extra electron (shown as ≈0): full or half-full subshells.", "হ্যালোজেনের দিকে সাধারণত বাড়ে। Be, Mg, N ও নিষ্ক্রিয় গ্যাস বাড়তি ইলেকট্রন প্রায় নেয় না (≈০ দেখানো): পূর্ণ বা অর্ধপূর্ণ উপশক্তিস্তর।"), g: L2("Generally decreases down a group, but note Cl > F: the tiny F atom is crowded with electrons.", "গ্রুপে নিচের দিকে সাধারণত কমে, তবে Cl > F: ক্ষুদ্র F পরমাণুতে ইলেকট্রনের ভিড়।"),
      g2: L2("Group 2 values are all tiny (≈0 to 14 kJ/mol) because ns² is a full subshell; the size rule does not apply here.", "গ্রুপ ২-এর মানগুলো সবই খুব ছোট (≈০ থেকে ১৪ kJ/mol), কারণ ns² পূর্ণ উপশক্তিস্তর; এখানে আকারের নিয়ম খাটে না।") }
  };
  let pi = 0, set = "p3";
  el.innerHTML = `<div class="chipset" id="k4tp" role="group">${PROP.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${p[0]}</button>`).join("")}</div>
    <div class="chipset" id="k4ts" role="group">${Object.entries(SETS).map(([k, v]) => `<button data-s="${k}" aria-pressed="${k === set}">${v[1] ? v[0] : ""}</button>`).join("")}</div>
    <div class="svgwrap fit" id="k4tc"></div><div class="w-out" id="k4tn"></div>`;
  const draw = () => {
    const els = SETS[set][1], vals = els.map(e => D[e][pi]), mx = Math.max(...vals.filter(v => v != null)) * 1.12 || 1, n = els.length;
    const W0 = 36, W1 = 350, bw = (W1 - W0) / n, isP = set[0] === "p";
    let s = `<svg viewBox="0 0 360 236" role="img" aria-label="${PROP[pi][0]}"><line x1="${W0}" y1="190" x2="${W1}" y2="190" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<text x="12" y="104" font-size="12" fill="var(--muted)" transform="rotate(-90 12 104)" text-anchor="middle">${PROP[pi][0]}${PROP[pi][1] ? " (" + PROP[pi][1] + ")" : ""}</text>`;
    vals.forEach((v, i) => { const x = W0 + i * bw + bw * 0.15, w = bw * 0.7;
      if (v == null) s += `<text x="${x + w / 2}" y="184" text-anchor="middle" font-size="13" fill="var(--muted)">—</text>`;
      else { const h = Math.max(v / mx * 165, v === 0 ? 0 : 2); s += `<rect x="${x.toFixed(1)}" y="${(190 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="var(--c)" opacity="${(0.45 + 0.55 * v / mx).toFixed(2)}"/>
        <text x="${x + w / 2}" y="${(184 - h).toFixed(1)}" text-anchor="middle" font-size="12" fill="var(--ink)">${v === 0 ? "≈" + B4(0) : f4(v, PROP[pi][2])}</text>`; }
      s += `<text x="${x + w / 2}" y="208" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">${els[i]}</text>`; });
    s += `<text x="${(W0 + W1) / 2}" y="228" text-anchor="middle" font-size="12" fill="var(--muted)">${isP ? L2("left → right across the period", "পর্যায় বরাবর বাম → ডান") : L2("top → bottom down the group", "গ্রুপ বরাবর ওপর → নিচ")}</text></svg>`;
    $("#k4tc", el).innerHTML = s;
    const nt = NOTES[pi]; $("#k4tn", el).innerHTML = (pi === 3 && set === "g2") ? nt.g2 : isP ? nt.p : nt.g;
  };
  chips4(el, "#k4tp", b => { pi = +b.dataset.i; draw(); });
  chips4(el, "#k4ts", b => { set = b.dataset.s; draw(); });
  draw();
};

/* ============ 4.7 family cards ============ */
W.k4family = (el) => {
  const F = [
    ["alk", "var(--bad)", L2("Alkali metals", "ক্ষার ধাতু"), L2("Group 1", "গ্রুপ ১"), "Li Na K Rb Cs Fr", "ns¹",
      L2("Soft, shiny, very reactive metals; lose 1 electron → M⁺; stored under kerosene; reactivity increases down the group.", "নরম, চকচকে, অতি সক্রিয় ধাতু; ১টি ইলেকট্রন ত্যাগ করে → M⁺; কেরোসিনে রাখা হয়; নিচের দিকে সক্রিয়তা বাড়ে।"),
      "2Na + 2H₂O → 2NaOH + H₂", L2("NaCl (table salt), NaOH in soap making, K in fertilizers.", "NaCl (খাবার লবণ), সাবান তৈরিতে NaOH, সারে K।")],
    ["ae", "var(--note)", L2("Alkaline-earth metals", "মৃৎক্ষার ধাতু"), L2("Group 2", "গ্রুপ ২"), "Be Mg Ca Sr Ba Ra", "ns²",
      L2("Compounds found in the earth; oxides/hydroxides are alkaline; lose 2 electrons → M²⁺.", "যৌগ মাটিতে পাওয়া যায়; অক্সাইড/হাইড্রক্সাইড ক্ষারীয়; ২টি ইলেকট্রন ত্যাগ করে → M²⁺।"),
      "Ca + 2H₂O → Ca(OH)₂ + H₂", L2("Limestone (CaCO₃) for cement; lime for whitewashing; Mg in chlorophyll.", "সিমেন্টের জন্য চুনাপাথর (CaCO₃); চুনকাম; ক্লোরোফিলে Mg।")],
    ["coin", "var(--note)", L2("Coinage metals", "মুদ্রা ধাতু"), L2("Group 11", "গ্রুপ ১১"), "Cu Ag Au", "(n−1)d¹⁰ ns¹",
      L2("Fairly unreactive, attractive, easy to shape: used for coins since ancient times. (Rg is also in group 11 but is synthetic.)", "তুলনামূলক কম সক্রিয়, সুন্দর, সহজে আকার দেওয়া যায়: প্রাচীনকাল থেকে মুদ্রায় ব্যবহৃত। (Rg-ও গ্রুপ ১১-এ, তবে কৃত্রিম।)"),
      "2Cu + O₂ → 2CuO", L2("Copper wires, silver and gold jewellery.", "তামার তার, রুপা ও সোনার গয়না।")],
    ["tr", "var(--c)", L2("Transition metals", "অবস্থান্তর ধাতু"), L2("Groups 3–12 (d-block)", "গ্রুপ ৩–১২ (d-ব্লক)"), "Sc Ti V Cr Mn Fe Co Ni Cu …", L2("partly filled d", "আংশিক পূর্ণ d"),
      L2("Variable valency (FeCl₂, FeCl₃), coloured compounds, good catalysts. Zn, Cd, Hg (full d¹⁰) are not transition elements.", "পরিবর্তনশীল যোজনী (FeCl₂, FeCl₃), রঙিন যৌগ, ভালো প্রভাবক। Zn, Cd, Hg (পূর্ণ d¹⁰) অবস্থান্তর মৌল নয়।"),
      "N₂ + 3H₂ ⇌ 2NH₃ (Fe catalyst)", L2("Iron and steel rods, Fe catalyst for ammonia in fertilizer factories.", "লোহার রড ও ইস্পাত, সার কারখানায় অ্যামোনিয়া তৈরিতে Fe প্রভাবক।")],
    ["hal", "var(--good)", L2("Halogens", "হ্যালোজেন"), L2("Group 17", "গ্রুপ ১৭"), "F Cl Br I At Ts", "ns² np⁵",
      L2("\"Salt-formers\"; gain 1 electron → X⁻; diatomic X₂: F₂, Cl₂ gases, Br₂ liquid, I₂ solid.", "\"লবণ উৎপাদনকারী\"; ১টি ইলেকট্রন গ্রহণ করে → X⁻; দ্বিপরমাণুক X₂: F₂, Cl₂ গ্যাস, Br₂ তরল, I₂ কঠিন।"),
      "2Na + Cl₂ → 2NaCl", L2("Chlorine for water treatment, fluoride in toothpaste, iodised salt.", "পানি শোধনে ক্লোরিন, টুথপেস্টে ফ্লোরাইড, আয়োডিনযুক্ত লবণ।")],
    ["nob", "var(--muted)", L2("Noble (inert) gases", "নিষ্ক্রিয় গ্যাস"), L2("Group 18", "গ্রুপ ১৮"), "He Ne Ar Kr Xe Rn Og", "ns² np⁶ (He 1s²)",
      L2("Full outer shells; exist as single atoms; extremely unreactive (only a few Xe and Kr compounds are known).", "বাইরের শেল পূর্ণ; একক পরমাণু হিসেবে থাকে; অত্যন্ত কম সক্রিয় (জেনন ও ক্রিপ্টনের মাত্র কয়েকটি যৌগ জানা)।"),
      L2("No ordinary reaction", "সাধারণ কোনো বিক্রিয়া নেই"), L2("He in balloons, Ne in advertising signs, Ar in bulbs and welding.", "বেলুনে He, বিজ্ঞাপনের সাইনে Ne, বাল্ব ও ঝালাইয়ে Ar।")]
  ];
  let k = 0;
  el.innerHTML = `<div id="k4fg" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px"></div><div class="w-out" id="k4fo" aria-live="polite"></div>`;
  const draw = () => {
    $("#k4fg", el).innerHTML = F.map((f, i) => `<button data-i="${i}" aria-pressed="${i === k}" style="min-height:64px;border-radius:12px;border:2px solid ${i === k ? f[1] : "var(--rule)"};background:${i === k ? mix4(f[1], 30) : "var(--sheet)"};color:var(--ink);font:inherit;padding:6px;cursor:pointer"><b>${f[2]}</b><br><small class="muted">${f[3]}</small></button>`).join("");
    el.querySelectorAll("#k4fg button").forEach(b => b.addEventListener("click", () => { k = +b.dataset.i; draw(); }));
    const f = F[k];
    $("#k4fo", el).innerHTML = `<b style="color:${f[1] === "var(--muted)" ? "var(--ink)" : f[1]}">${f[2]}</b> · ${f[3]}<br>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0">${f[4].split(" ").map(s => `<span style="min-width:34px;text-align:center;padding:4px 6px;border-radius:8px;background:${mix4(f[1], 30)};font-weight:700">${s}</span>`).join("")}</div>
      ${L2("Outer electrons", "বাইরের ইলেকট্রন")}: <b>${f[5]}</b><br>${f[6]}<br>${L2("Typical reaction", "সাধারণ বিক্রিয়া")}: <b>${f[7]}</b><br>${L2("Everyday use", "দৈনন্দিন ব্যবহার")}: ${f[8]}`;
  };
  draw();
};

/* ============ 4.9 halogen acids + CO2 experiment ============ */
W.k4co2 = (el) => {
  const HX = { F: [L2("hydrofluoric acid", "হাইড্রোফ্লোরিক এসিড"), "→", L2("Reacts explosively, even in the dark. (HF is far too dangerous for school labs.)", "অন্ধকারেও বিস্ফোরণসহ বিক্রিয়া করে। (HF স্কুল ল্যাবের জন্য অত্যন্ত বিপজ্জনক।)"), "CaF₂(s)"],
    Cl: [L2("hydrochloric acid", "হাইড্রোক্লোরিক এসিড"), "→", L2("Explosive in sunlight, slow in the dark.", "সূর্যালোকে বিস্ফোরণ, অন্ধকারে ধীর।"), "CaCl₂(aq)"],
    Br: [L2("hydrobromic acid", "হাইড্রোব্রোমিক এসিড"), "→", L2("Needs heating (with a catalyst).", "তাপ (ও প্রভাবক) লাগে।"), "CaBr₂(aq)"],
    I: [L2("hydroiodic acid", "হাইড্রোআয়োডিক এসিড"), "⇌", L2("Needs heating; the reaction is reversible.", "তাপ লাগে; বিক্রিয়াটি উভমুখী।"), "CaI₂(aq)"] };
  let x = "Cl", stage = 0, fill = 0, t = 0, lime = 0, splint = null, showGas = false;
  el.innerHTML = `<div class="chipset" id="k4cx" role="group">${Object.keys(HX).map(k => `<button data-x="${k}" aria-pressed="${k === x}">${k}₂</button>`).join("")}</div>
    <div class="w-out" id="k4ce"></div>
    <div class="svgwrap fit" id="k4cs"></div>
    <div class="w-row" style="flex-wrap:wrap"><button class="btn solid" id="k4ca">${L2("Add dilute HCl", "লঘু HCl যোগ করো")}</button><button class="btn" id="k4cc">${L2("Colour?", "বর্ণ?")}</button><button class="btn" id="k4cf">${L2("Burning splint", "জ্বলন্ত কাঠি")}</button><button class="btn" id="k4cl">${L2("Bubble into lime water", "চুনের পানিতে চালাও")}</button><button class="btn" id="k4cr">${L2("Reset", "আবার শুরু")}</button></div>
    <div class="w-out" id="k4co" aria-live="polite"></div>`;
  const eq = () => {
    const h = HX[x];
    $("#k4ce", el).innerHTML = `<b>1.</b> H₂(g) + ${x}₂ ${h[1]} 2H${x}(g) <span class="muted">— ${h[2]}</span><br>
      <b>2.</b> H${x}(g) + H₂O(l) → H${x}(aq), ${h[0]}<br>
      <b>3.</b> CaCO₃(s) + 2H${x}(aq) → ${h[3]} + H₂O(l) + CO₂(g)<br>
      <span class="muted">${L2("Atom check (3): Ca 1 = 1, C 1 = 1, O 3 = 1 + 2, H 2 = 2, ", "পরমাণু যাচাই (৩): Ca ১ = ১, C ১ = ১, O ৩ = ১ + ২, H ২ = ২, ")}${x} ${B4(2)} = ${B4(2)}. ${L2("Same pattern for every halogen.", "প্রতিটি হ্যালোজেনের একই ধাঁচ।")}</span>`;
  };
  const draw = () => {
    const lv = 150; let s = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("carbon dioxide preparation apparatus", "কার্বন ডাই-অক্সাইড প্রস্তুতির যন্ত্রসজ্জা")}"><defs><clipPath id="k4fl"><circle cx="90" cy="170" r="44"/></clipPath></defs>`;
    /* stand */
    s += `<rect x="14" y="226" width="130" height="8" rx="2" fill="var(--rule)"/><rect x="20" y="40" width="6" height="188" fill="var(--rule)"/><rect x="20" y="120" width="56" height="5" fill="var(--rule)"/>`;
    /* flask liquid + chips + bubbles */
    s += `<g clip-path="url(#k4fl)"><rect x="40" y="${lv}" width="100" height="80" fill="${stage ? mix4("var(--note)", 35) : mix4("var(--c)", 18)}"/>`;
    [[70, 204], [86, 208], [102, 205], [78, 196], [96, 197], [112, 202]].forEach(([a, b]) => s += `<rect x="${a - 6}" y="${b - 5}" width="12" height="10" rx="3" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/>`);
    if (stage) for (let i = 0; i < 9; i++) { const ph = (t * 0.9 + i / 9) % 1; s += `<circle cx="${66 + (i * 37) % 50}" cy="${(200 - ph * 50).toFixed(1)}" r="${2 + (i % 3)}" fill="none" stroke="var(--ink)" stroke-width="1"/>`; }
    s += `</g><circle cx="90" cy="170" r="44" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="78" y="100" width="24" height="30" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/><rect x="74" y="92" width="32" height="12" rx="3" fill="var(--muted)"/>`;
    /* thistle funnel: stem reaches under liquid */
    s += `<path d="M76 28 q8 20 8 30 v150" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M92 58 v150" fill="none" stroke="var(--ink)" stroke-width="0"/>
      <path d="M68 20 a14 12 0 0 0 28 0" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M84 58 q0 -10 8 -30" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <line x1="84" y1="58" x2="84" y2="208" stroke="var(--ink)" stroke-width="2"/><line x1="90" y1="58" x2="90" y2="208" stroke="var(--ink)" stroke-width="2"/>`;
    /* delivery tube */
    s += `<path d="M98 96 V52 H292 V214" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/><path d="M98 96 V52 H292 V214" fill="none" stroke="var(--sheet)" stroke-width="2" stroke-linejoin="round"/>`;
    /* gas jar with CO2 filling from the bottom */
    const fh = 150 * fill; s += `<rect x="252" y="${226 - fh}" width="80" height="${fh}" fill="${mix4("var(--c)", 40)}"/><path d="M250 76 V226 H334 V76" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    if (fill > 0.05 && showGas) s += `<text x="292" y="${Math.max(100, 220 - fh / 2)}" text-anchor="middle" font-size="13" fill="var(--ink)">CO₂</text>`;
    if (fill >= 1) s += `<rect x="246" y="70" width="92" height="7" rx="2" fill="var(--muted)"/>`;
    /* splint test */
    if (splint !== null) { s += `<line x1="300" y1="40" x2="290" y2="120" stroke="var(--note)" stroke-width="4"/>`;
      if (splint > 0) s += `<ellipse cx="289" cy="${124}" rx="${5 * splint}" ry="${10 * splint}" fill="var(--bad)" opacity="${splint.toFixed(2)}"/>`; }
    /* labels */
    s += `<text x="40" y="14" font-size="12" fill="var(--muted)">${L2("thistle funnel", "থিসল ফানেল")}</text><text x="150" y="44" font-size="12" fill="var(--muted)">${L2("delivery tube", "নির্গম নল")}</text>
      <text x="292" y="238" text-anchor="middle" font-size="12" fill="var(--muted)">${L2("gas jar", "গ্যাসজার")}</text><text x="90" y="238" text-anchor="middle" font-size="12" fill="var(--muted)">CaCO₃ + HCl</text></svg>`;
    /* lime-water test tube */
    if (lime) { const milky = lime === 1; let tsv = `<svg viewBox="0 0 360 120" role="img" aria-label="${L2("lime water test", "চুনের পানি পরীক্ষা")}"><path d="M150 10 V92 a20 20 0 0 0 40 0 V10" fill="none" stroke="var(--ink)" stroke-width="2"/>
        <path d="M152 44 V92 a18 18 0 0 0 36 0 V44 Z" fill="${milky ? mix4("var(--muted)", 55) : mix4("var(--c)", 12)}"/>`;
      if (milky) for (let i = 0; i < 40; i++) tsv += `<circle cx="${156 + (i * 53) % 28}" cy="${50 + (i * 29) % 58}" r="1.6" fill="var(--ink)" opacity=".45"/>`;
      tsv += `<line x1="170" y1="0" x2="170" y2="100" stroke="var(--ink)" stroke-width="3"/><text x="210" y="60" font-size="13" fill="var(--ink)">${milky ? L2("milky: CaCO₃ forms", "ঘোলা: CaCO₃ তৈরি") : L2("clear again: Ca(HCO₃)₂", "আবার স্বচ্ছ: Ca(HCO₃)₂")}</text></svg>`;
      s += tsv; }
    $("#k4cs", el).innerHTML = s;
  };
  const out = h => $("#k4co", el).innerHTML = h;
  const need = () => { if (fill < 1) { out(L2("First add acid and collect a full jar of gas.", "আগে এসিড যোগ করে গ্যাসজার পূর্ণ করো।")); return true; } return false; };
  chips4(el, "#k4cx", b => { x = b.dataset.x; eq(); });
  $("#k4ca", el).addEventListener("click", () => { if (stage) return; stage = 1; showGas = true; if (REDUCED) fill = 1;
    out(L2("Effervescence! CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. CO₂ is denser than air, so it collects at the bottom of the jar and pushes the air out. Keep the funnel end under the liquid.", "বুদবুদ! CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂। CO₂ বাতাসের চেয়ে ভারী, তাই জারের তলায় জমে বাতাসকে বের করে দেয়। ফানেলের প্রান্ত তরলে ডুবিয়ে রাখো।")); draw(); });
  $("#k4cc", el).addEventListener("click", () => { if (need()) return; out(L2("Colourless: you cannot see the gas in the jar at all.", "বর্ণহীন: জারের গ্যাসটি একেবারেই দেখা যায় না।")); });
  $("#k4cf", el).addEventListener("click", () => { if (need()) return; splint = REDUCED ? 0 : 1; if (REDUCED) draw();
    out(L2("The burning splint goes out: CO₂ neither burns nor supports burning (used in fire extinguishers).", "জ্বলন্ত কাঠি নিভে যায়: CO₂ নিজে জ্বলে না, জ্বলতেও সাহায্য করে না (অগ্নিনির্বাপকে ব্যবহৃত)।")); });
  $("#k4cl", el).addEventListener("click", () => { if (need()) return; lime = lime === 1 ? 2 : 1; draw();
    out(lime === 1 ? L2("Lime water turns milky: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O. Press again to pass more CO₂.", "চুনের পানি ঘোলা: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O। আরও CO₂ চালাতে আবার চাপো।")
      : L2("Excess CO₂: the milkiness disappears. CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂ (soluble).", "অতিরিক্ত CO₂: ঘোলাভাব দূর হয়। CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂ (দ্রবণীয়)।")); });
  $("#k4cr", el).addEventListener("click", () => { stage = 0; fill = 0; lime = 0; splint = null; showGas = false; out(L2("Press “Add dilute HCl” to start.", "শুরু করতে “লঘু HCl যোগ করো” চাপো।")); draw(); });
  if (!REDUCED) animate(el, dt => { let ch = false;
    if (stage) { t += dt; ch = true; if (fill < 1) fill = Math.min(1, fill + dt * 0.25); }
    if (splint !== null && splint > 0) { splint = Math.max(0, splint - dt * 0.8); ch = true; }
    if (ch) draw(); });
  eq(); out(L2("Press “Add dilute HCl” to start.", "শুরু করতে “লঘু HCl যোগ করো” চাপো।")); draw();
};
