/* ---- biology chapter 4 widgets: bioenergetics ---- */
const B4 = x => bnNum(x, LANG);
const chipsB4 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T4 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "") => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}>${s}</text>`;
const AR4 = (x1, y1, x2, y2, id, c, w = 2.5, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;
const SUN4 = (x, y, r) => `<g>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<line x1="${x + c * (r + 3)}" y1="${y + s * (r + 3)}" x2="${x + c * (r + 9)}" y2="${y + s * (r + 9)}" stroke="#e0a021" stroke-width="2.5" stroke-linecap="round"/>`; }).join("")}<circle cx="${x}" cy="${y}" r="${r}" fill="#f2b233"/></g>`;
const WATER4 = "#3b82c4", LEAF4 = "#4a9d5b";

/* 4.1 ATP <-> ADP + Pi: the rechargeable energy coin */
W.b4atp = (el) => {
  const N = 6;
  const JOBS = [
    [L2("Muscle contraction", "পেশির সংকোচন"), L2("Muscle fibres slide past each other and shorten.", "পেশিতন্তু একে অপরের ওপর দিয়ে সরে খাটো হয়।")],
    [L2("Nerve signal", "স্নায়ুসংকেত"), L2("Nerve cells pump ions to stay ready for the next signal.", "স্নায়ুকোষ আয়ন পাম্প করে পরের সংকেতের জন্য তৈরি থাকে।")],
    [L2("Making protein", "প্রোটিন তৈরি"), L2("Amino acids are joined into new protein, so the body grows and repairs itself.", "অ্যামিনো এসিড জুড়ে নতুন প্রোটিন হয়, তাই দেহ বাড়ে ও ক্ষয়পূরণ করে।")],
    [L2("Cell division", "কোষ বিভাজন"), L2("Copying DNA and pulling the chromosomes apart both need energy.", "DNA-র অনুলিপি তৈরি আর ক্রোমোজোম আলাদা করা, দুটোতেই শক্তি লাগে।")],
    [L2("Absorbing minerals", "খনিজ শোষণ"), L2("A root cell pulls mineral ions in from the soil water.", "মূলের কোষ মাটির পানি থেকে খনিজ আয়ন ভেতরে টেনে নেয়।")],
    [L2("A firefly's light", "জোনাকির আলো"), L2("Chemical energy of ATP is changed into light.", "ATP-এর রাসায়নিক শক্তি আলোতে বদলে যায়।")]];
  let atp = N, used = 0, last = null;
  el.innerHTML = `<div class="svgwrap fit" id="b4as"></div>
    <p class="hint" style="margin:8px 0 4px">${L2("Spend one ATP on a job:", "একটি ATP খরচ করো কোনো কাজে:")}</p>
    <div class="chipset b4aj" role="group">${JOBS.map((j, i) => `<button data-i="${i}" aria-pressed="false">${j[0]}</button>`).join("")}</div>
    <div class="w-row" style="margin:10px 0"><button class="btn solid" data-c="food">${L2("Recharge from food", "খাদ্য থেকে রিচার্জ")}</button><button class="btn" data-c="light">${L2("Recharge from light", "আলো থেকে রিচার্জ")}</button></div>
    <div class="w-out" id="b4ao"></div>`;
  const draw = () => {
    const split = last && last.t === "spend";
    const pent = [0, 1, 2, 3, 4].map(i => { const a = (-90 + i * 72) * Math.PI / 180; return `${(138 + 27 * Math.cos(a)).toFixed(1)},${(64 + 27 * Math.sin(a)).toFixed(1)}`; }).join(" ");
    const P = (x, y, t, c) => `<circle cx="${x}" cy="${y}" r="17" fill="${c}" stroke="var(--ink)" stroke-width="1.5"/>${T4(x, y + 5, t, "middle", 14, "var(--sheet)", "700")}`;
    let s = `<svg viewBox="0 0 360 212" role="img" aria-label="${L2("ATP molecule and the cell's ATP pool", "ATP অণু ও কোষের ATP ভান্ডার")}">`;
    s += T4(180, 20, split ? L2("ADP + Pi + energy", "ADP + Pi + শক্তি") : "ATP", "middle", 16, "var(--c)", "700");
    s += `<rect x="12" y="42" width="80" height="44" rx="9" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>${T4(52, 69, L2("Adenine", "অ্যাডেনিন"), "middle", 13)}`;
    s += `<line x1="92" y1="64" x2="113" y2="64" stroke="var(--ink)" stroke-width="2"/><polygon points="${pent}" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>${T4(138, 69, L2("Ribose", "রাইবোজ"), "middle", 12)}`;
    s += `<line x1="164" y1="64" x2="183" y2="64" stroke="var(--ink)" stroke-width="2"/>${P(200, 64, "P", "var(--c)")}<line x1="217" y1="64" x2="227" y2="64" stroke="var(--ink)" stroke-width="2"/>${P(244, 64, "P", "var(--c)")}`;
    if (split) {
      s += `<polygon points="286,40 291,56 307,52 297,65 309,77 292,76 288,92 280,77 264,82 273,67 263,54 279,56" fill="#f2b233" stroke="#e0a021" stroke-width="1.5"/>`;
      s += P(332, 36, "Pi", "var(--bad)") + T4(306, 108, L2("energy", "শক্তি"), "middle", 13, "var(--note)", "700");
    } else {
      s += `<path d="M261 64 q3 -7 6 0 t6 0" fill="none" stroke="var(--bad)" stroke-width="2.5"/>${P(290, 64, "P", "var(--bad)")}`;
    }
    s += `<path d="M12 96 v6 h152 v-6" fill="none" stroke="var(--muted)" stroke-width="1.5"/>${T4(88, 119, L2("Adenosine", "অ্যাডিনোসিন"), "middle", 12, "var(--muted)")}`;
    s += `<path d="M183 96 v6 h${split ? 78 : 124} v-6" fill="none" stroke="var(--muted)" stroke-width="1.5"/>${T4(split ? 222 : 245, 119, split ? L2("2 phosphates", "২টি ফসফেট") : L2("3 phosphates", "৩টি ফসফেট"), "middle", 12, "var(--muted)")}`;
    s += T4(12, 150, L2("ATP in the cell:", "কোষে ATP:"), "start", 13, "var(--ink)", "700");
    for (let i = 0; i < N; i++) {
      const x = 12 + i * 57, on = i < atp;
      s += `<rect x="${x}" y="160" width="46" height="30" rx="6" fill="${on ? "var(--c)" : "none"}" stroke="${on ? "var(--c)" : "var(--muted)"}" stroke-width="2"${on ? "" : ` stroke-dasharray="4 3"`}/><rect x="${x + 46}" y="169" width="4" height="12" rx="1.5" fill="${on ? "var(--c)" : "var(--muted)"}"/>${T4(x + 23, 180, on ? "ATP" : "ADP", "middle", 13, on ? "var(--sheet)" : "var(--muted)", "700")}`;
    }
    s += T4(180, 207, L2(`charged: ${atp} of ${N}`, `চার্জ আছে: ${B4(N)}টির মধ্যে ${B4(atp)}টি`), "middle", 12, "var(--muted)") + `</svg>`;
    $("#b4as", el).innerHTML = s;
    let o;
    if (!last) o = L2("The cell has 6 charged ATP. Tap a job to spend one, and watch the last phosphate group.", "কোষে ৬টি চার্জ দেওয়া ATP আছে। কোনো কাজে চাপ দিয়ে একটি খরচ করো, আর শেষের ফসফেট গ্রুপটি লক্ষ করো।");
    else if (last.t === "empty") o = `<b style="color:var(--bad)">${L2("No ATP left!", "ATP শেষ!")}</b> ${L2("Only ADP and Pi remain, so the job cannot be done. Recharge first.", "শুধু ADP আর Pi পড়ে আছে, তাই কাজটি হবে না। আগে রিচার্জ করো।")}`;
    else if (last.t === "spend") o = `<b>ATP → ADP + Pi + ${L2("energy", "শক্তি")}</b> <span class="muted">(${L2("dephosphorylation", "ডিফসফোরাইলেশন")})</span><br>${L2("Used for", "খরচ হলো")}: <b>${JOBS[last.i][0]}</b>. ${JOBS[last.i][1]}<br><span class="muted">${L2(`ATP spent so far: ${used}. Each mole of ATP gives about 7.3 kcal.`, `এ পর্যন্ত খরচ: ${B4(used)}টি ATP। প্রতি মোল ATP থেকে পাওয়া যায় প্রায় ৭.৩ kcal।`)}</span>`;
    else o = `<b>ADP + Pi + ${L2("energy", "শক্তি")} → ATP</b> <span class="muted">(${last.src === "food" ? L2("phosphorylation", "ফসফোরাইলেশন") : L2("photophosphorylation", "ফটোফসফোরাইলেশন")})</span><br>${last.n === 0 ? L2("All the ATP is already charged.", "সব ATP আগে থেকেই চার্জ দেওয়া।") : last.src === "food" ? L2(`Food was oxidised in the mitochondria (respiration); its energy joined a phosphate to ${last.n} ADP. The same molecules are used again.`, `মাইটোকন্ড্রিয়ায় খাদ্য জারিত হলো (শ্বসন); সেই শক্তিতে ${B4(last.n)}টি ADP-তে ফসফেট যুক্ত হলো। একই অণু আবার ব্যবহার হবে।`) : L2(`Chlorophyll in a chloroplast caught light; its energy joined a phosphate to ${last.n} ADP. This happens only in green cells.`, `ক্লোরোপ্লাস্টের ক্লোরোফিল আলো ধরল; সেই শক্তিতে ${B4(last.n)}টি ADP-তে ফসফেট যুক্ত হলো। এটা ঘটে শুধু সবুজ কোষে।`)}`;
    $("#b4ao", el).innerHTML = o;
  };
  chipsB4(el, ".b4aj", b => { if (atp > 0) { atp--; used++; last = { t: "spend", i: +b.dataset.i }; } else last = { t: "empty" }; draw(); });
  el.querySelectorAll("button[data-c]").forEach(b => b.addEventListener("click", () => { last = { t: "charge", src: b.dataset.c, n: N - atp }; atp = N; el.querySelectorAll(".b4aj button").forEach(q => q.setAttribute("aria-pressed", "false")); draw(); }));
  draw();
};

/* 4.2 where photosynthesis happens: leaf -> leaf section -> chloroplast */
W.b4leaf = (el) => {
  const V = {
    leaf: { name: L2("Whole leaf", "পুরো পাতা"), parts: [
      ["light", L2("Sunlight", "সূর্যালোক"), L2("The source of energy. Chlorophyll catches it and it ends up as chemical energy in glucose.", "শক্তির উৎস। ক্লোরোফিল একে ধরে, আর শেষে তা গ্লুকোজে রাসায়নিক শক্তি হিসেবে জমা হয়।")],
      ["chl", L2("Chlorophyll", "ক্লোরোফিল"), L2("The green pigment of the leaf. Without it light cannot be captured, so no food is made.", "পাতার সবুজ রঞ্জক। এটি না থাকলে আলো ধরা যায় না, খাদ্যও তৈরি হয় না।")],
      ["water", L2("Water", "পানি"), L2("Absorbed from the soil by the roots and carried up to the leaf. Its hydrogen is used to reduce CO₂; its oxygen is set free.", "মূল মাটি থেকে শোষণ করে পাতায় পাঠায়। এর হাইড্রোজেন CO₂ বিজারণে লাগে; অক্সিজেন মুক্ত হয়ে যায়।")],
      ["co2", "CO₂", L2("Enters from the air through the stomata, mostly on the underside of the leaf. It is reduced to carbohydrate.", "বাতাস থেকে পত্ররন্ধ্র দিয়ে ঢোকে, বেশির ভাগ পাতার নিচের পিঠ দিয়ে। বিজারিত হয়ে শর্করা হয়।")],
      ["o2", "O₂", L2("A by-product. It comes from the splitting of water and leaves through the stomata.", "উপজাত দ্রব্য। পানি ভাঙার ফলে তৈরি হয়, পত্ররন্ধ্র দিয়ে বেরিয়ে যায়।")],
      ["food", L2("Glucose (food)", "গ্লুকোজ (খাদ্য)"), L2("The main product. Part is used by the plant at once; the rest is carried away and stored in fruits, roots, stems or leaves.", "প্রধান উৎপাদ। একাংশ উদ্ভিদ সাথে সাথে ব্যবহার করে; বাকিটা অন্যত্র গিয়ে ফল, মূল, কাণ্ড বা পাতায় জমা হয়।")]] },
    sec: { name: L2("Slice through the leaf", "পাতার প্রস্থচ্ছেদ"), parts: [
      ["epi", L2("Upper epidermis", "ঊর্ধ্বত্বক"), L2("A clear protective skin. Light passes straight through it to the cells below.", "স্বচ্ছ রক্ষাকারী ত্বক। আলো এর ভেতর দিয়ে সোজা নিচের কোষে পৌঁছায়।")],
      ["pal", L2("Mesophyll: upper layer", "মেসোফিল: ওপরের স্তর"), L2("Tall cells packed with chloroplasts, right under the light. Most photosynthesis happens here.", "ক্লোরোপ্লাস্টে ঠাসা লম্বা কোষ, ঠিক আলোর নিচে। সালোকসংশ্লেষণের বেশির ভাগ ঘটে এখানে।")],
      ["spo", L2("Mesophyll: lower layer", "মেসোফিল: নিচের স্তর"), L2("Loosely arranged cells with air spaces between them, so CO₂ can spread to every cell.", "ঢিলেঢালাভাবে সাজানো কোষ, মাঝে বায়ুকুঠুরি, তাই CO₂ সব কোষে ছড়িয়ে পড়তে পারে।")],
      ["vein", L2("Vein", "শিরা"), L2("Brings water up from the roots and carries the food made in the leaf to the rest of the plant.", "মূল থেকে পানি নিয়ে আসে আর পাতায় তৈরি খাদ্য উদ্ভিদের অন্য অংশে নিয়ে যায়।")],
      ["stoma", L2("Stoma", "পত্ররন্ধ্র"), L2("A tiny pore between two guard cells. CO₂ comes in and O₂ goes out through it. It closes when water is short.", "দুটি রক্ষীকোষের মাঝের ক্ষুদ্র ছিদ্র। এ পথে CO₂ ঢোকে আর O₂ বের হয়। পানির অভাবে এটি বন্ধ হয়ে যায়।")]] },
    chl: { name: L2("One chloroplast", "একটি ক্লোরোপ্লাস্ট"), parts: [
      ["gran", L2("Granum", "গ্রানাম"), L2("A stack of thylakoid discs. The light-dependent phase happens in the grana: light is caught, water is split, ATP and NADPH are made.", "থাইলাকয়েড চাকতির থাক। আলোকনির্ভর পর্যায় ঘটে গ্রানায়: আলো ধরা পড়ে, পানি ভাঙে, ATP ও NADPH তৈরি হয়।")],
      ["thy", L2("Thylakoid", "থাইলাকয়েড"), L2("One flat disc. Chlorophyll sits in its membrane.", "একটি চ্যাপ্টা চাকতি। এর ঝিল্লিতে ক্লোরোফিল থাকে।")],
      ["str", L2("Stroma", "স্ট্রোমা"), L2("The watery matrix around the grana. The light-independent (dark) phase happens here: CO₂ is reduced to carbohydrate.", "গ্রানার চারপাশের জলীয় ধাত্র। আলোক নিরপেক্ষ (অন্ধকার) পর্যায় ঘটে এখানে: CO₂ বিজারিত হয়ে শর্করা হয়।")],
      ["env", L2("Double membrane", "দ্বিস্তর ঝিল্লি"), L2("The covering of the chloroplast. Water and CO₂ pass in; O₂ and sugar pass out.", "ক্লোরোপ্লাস্টের আবরণ। পানি ও CO₂ ভেতরে ঢোকে; O₂ ও শর্করা বাইরে যায়।")]] } };
  let view = "leaf", sel = "light";
  el.innerHTML = `<div class="chipset b4lv" role="group">${Object.keys(V).map((k, i) => `<button data-v="${k}" aria-pressed="${i === 0}">${B4(i + 1)}. ${V[k].name}</button>`).join("")}</div>
    <div class="svgwrap fit" id="b4ls" style="margin-top:8px"></div><div class="chipset b4lp" role="group" style="margin-top:6px"></div><div class="w-out" id="b4lo" style="margin-top:8px"></div>`;
  const hl = k => k === sel ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.5"`;
  const lab = (k, x, y, s, a = "middle", c0 = "var(--ink)") => `<text data-k="${k}" x="${x}" y="${y}" font-size="13" text-anchor="${a}" fill="${k === sel && c0 === "var(--ink)" ? "var(--bad)" : c0}" font-weight="${k === sel ? 700 : 400}" style="cursor:pointer">${s}</text>`;
  const D = {
    leaf: () => {
      let s = `<svg viewBox="0 0 360 226" role="img" aria-label="${V.leaf.name}">${arrowDefs("b4la", "#e0a021")}${arrowDefs("b4lb", WATER4)}${arrowDefs("b4lc", "var(--muted)")}${arrowDefs("b4ld", "var(--bad)")}${arrowDefs("b4le", "var(--note)")}`;
      s += `<g data-k="light" style="cursor:pointer">${SUN4(34, 34, 15)}${[[58, 46, 118, 82], [62, 34, 168, 62], [50, 58, 96, 110]].map(([a, b, c, d]) => AR4(a, b, c, d, "b4la", "#e0a021", sel === "light" ? 3.5 : 2, "6 4")).join("")}</g>` + lab("light", 34, 76, L2("light", "আলো"));
      s += `<line x1="92" y1="158" x2="52" y2="198" stroke="#6f8f4e" stroke-width="6" stroke-linecap="round"/>`;
      s += `<g data-k="chl" style="cursor:pointer"><path d="M90 160 C 112 70 232 48 322 80 C 306 166 196 204 90 160 Z" fill="${LEAF4}" ${hl("chl")}/><path d="M90 160 Q 205 132 322 80 M150 144 q10 -32 30 -54 M205 124 q8 -26 30 -44 M258 104 q8 -14 24 -24 M160 142 q30 16 50 34 M214 122 q28 14 46 26 M266 100 q18 10 28 18" fill="none" stroke="var(--sheet)" stroke-width="1.5" opacity=".7"/></g>`;
      s += lab("chl", 304, 101, L2("chlorophyll", "ক্লোরোফিল"), "end", "var(--sheet)");
      s += `<g data-k="water" style="cursor:pointer">${AR4(26, 222, 62, 186, "b4lb", WATER4, sel === "water" ? 4 : 2.5)}</g>` + lab("water", 72, 216, "H₂O", "start");
      s += `<g data-k="co2" style="cursor:pointer">${AR4(214, 222, 214, 190, "b4lc", "var(--muted)", sel === "co2" ? 4 : 2.5)}</g>` + lab("co2", 222, 218, "CO₂", "start");
      s += `<g data-k="o2" style="cursor:pointer">${AR4(262, 64, 286, 26, "b4ld", "var(--bad)", sel === "o2" ? 4 : 2.5)}</g>` + lab("o2", 296, 30, "O₂", "start");
      s += `<g data-k="food" style="cursor:pointer"><polygon points="178,136 192,128 206,136 206,152 192,160 178,152" fill="var(--note-soft)" ${hl("food")}/>${AR4(172, 150, 114, 164, "b4le", "var(--note)", sel === "food" ? 4 : 2.5)}</g>`;
      s += lab("food", 212, 157, L2("glucose", "গ্লুকোজ"), "start", "var(--sheet)");
      return s + `</svg>`;
    },
    sec: () => {
      const dots = (x, y, w, h, n) => Array.from({ length: n }, (_, i) => `<ellipse cx="${x + w / 2 + ((i % 2) ? 1 : -1) * w * 0.2}" cy="${y + (h * (i + 0.7)) / (n + 0.4)}" rx="4" ry="2.6" fill="var(--c)"/>`).join("");
      let s = `<svg viewBox="0 0 360 232" role="img" aria-label="${V.sec.name}">${arrowDefs("b4sa", "#e0a021")}${arrowDefs("b4sc", "var(--muted)")}${arrowDefs("b4sd", "var(--bad)")}`;
      s += [40, 110, 180].map(x => AR4(x, 2, x, 16, "b4sa", "#e0a021", 2, "5 3")).join("") + T4(200, 14, L2("light", "আলো"), "start", 12, "var(--muted)");
      s += `<g data-k="epi" style="cursor:pointer">${Array.from({ length: 6 }, (_, i) => `<rect x="${4 + i * 42}" y="20" width="42" height="20" rx="4" fill="var(--paper)" ${hl("epi")}/>`).join("")}</g>`;
      s += `<g data-k="pal" style="cursor:pointer">${Array.from({ length: 9 }, (_, i) => `<rect x="${5 + i * 28}" y="42" width="26" height="62" rx="10" fill="var(--c-soft)" ${hl("pal")}/>${dots(5 + i * 28, 44, 26, 58, 5)}`).join("")}</g>`;
      const SP = [[92, 128, 20, 14], [138, 134, 20, 14], [104, 166, 22, 14], [184, 126, 20, 14], [230, 136, 20, 14], [198, 166, 22, 14], [242, 172, 13, 11]];
      s += `<g data-k="spo" style="cursor:pointer">${SP.map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="var(--c-soft)" ${hl("spo")}/><ellipse cx="${x - 6}" cy="${y - 3}" rx="4" ry="2.6" fill="var(--c)"/><ellipse cx="${x + 6}" cy="${y + 4}" rx="4" ry="2.6" fill="var(--c)"/>`).join("")}</g>`;
      s += `<g data-k="vein" style="cursor:pointer"><circle cx="38" cy="154" r="25" fill="var(--paper)" ${hl("vein")}/><ellipse cx="38" cy="144" rx="13" ry="7" fill="${WATER4}" opacity=".8"/><ellipse cx="38" cy="165" rx="13" ry="7" fill="var(--note)" opacity=".8"/></g>` + lab("vein", 38, 122, L2("vein", "শিরা"));
      s += [[4, 60], [64, 60], [176, 38], [214, 42]].map(([x, w]) => `<rect x="${x}" y="190" width="${w}" height="18" rx="4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>`).join("");
      s += `<g data-k="stoma" style="cursor:pointer"><path d="M130 189 q-12 10 0 20 q10 -10 0 -20 z M170 189 q12 10 0 20 q-10 -10 0 -20 z" fill="${LEAF4}" ${hl("stoma")}/></g>`;
      s += AR4(144, 230, 144, 180, "b4sc", "var(--muted)", 2.5) + AR4(157, 178, 157, 226, "b4sd", "var(--bad)", 2.5) + T4(138, 228, "CO₂", "end", 12, "var(--muted)", "700") + T4(164, 228, "O₂", "start", 12, "var(--bad)", "700");
      s += lab("epi", 262, 35, "← " + L2("epidermis", "ঊর্ধ্বত্বক"), "start") + lab("pal", 262, 68, "← " + L2("mesophyll", "মেসোফিল"), "start") + lab("pal", 276, 84, L2("(upper)", "(ওপরের)"), "start");
      s += lab("spo", 262, 142, "← " + L2("mesophyll", "মেসোফিল"), "start") + lab("spo", 276, 158, L2("(lower)", "(নিচের)"), "start") + lab("stoma", 4, 226, L2("stoma", "পত্ররন্ধ্র") + " →", "start");
      return s + `</svg>`;
    },
    chl: () => {
      const stack = (x, y, n, k2) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * 11}" width="46" height="9" rx="4.5" fill="var(--c)" ${(sel === "gran") || (sel === "thy" && k2 && i === 0) ? `stroke="var(--bad)" stroke-width="3"` : `stroke="var(--ink)" stroke-width="1"`}/>`).join("");
      let s = `<svg viewBox="0 0 360 214" role="img" aria-label="${V.chl.name}">`;
      s += `<g data-k="env" style="cursor:pointer"><ellipse cx="180" cy="100" rx="174" ry="92" fill="var(--paper)" ${hl("env")}/></g><g data-k="str" style="cursor:pointer"><ellipse cx="180" cy="100" rx="164" ry="82" fill="var(--c-soft)" ${hl("str")}/></g>`;
      s += `<path d="M96 78 H138 M184 66 H222 M184 110 H222 M268 92 H284 M96 111 H138" stroke="var(--c)" stroke-width="3" fill="none"/>`;
      s += `<g data-k="gran" style="cursor:pointer">${stack(50, 62, 6)}${stack(138, 50, 7)}${stack(222, 60, 6)}</g><g data-k="thy" style="cursor:pointer">${stack(284, 88, 1, true)}</g>`;
      s += lab("gran", 161, 142, L2("granum", "গ্রানাম")) + lab("thy", 307, 116, L2("thylakoid", "থাইলাকয়েড")) + lab("str", 180, 166, L2("stroma", "স্ট্রোমা")) + lab("env", 180, 209, "↑ " + L2("double membrane", "দ্বিস্তর ঝিল্লি"));
      return s + `</svg>`;
    } };
  const put = () => {
    const P = V[view].parts, p = P.find(q => q[0] === sel) || P[0];
    $("#b4ls", el).innerHTML = D[view]();
    $("#b4lo", el).innerHTML = `<b>${p[1]}</b><br>${p[2]}`;
    el.querySelectorAll(".b4lp button").forEach(b => b.setAttribute("aria-pressed", b.dataset.k === sel));
    el.querySelectorAll("#b4ls [data-k]").forEach(g => g.addEventListener("click", () => { if (P.some(q => q[0] === g.dataset.k)) { sel = g.dataset.k; put(); } }));
  };
  const setView = () => {
    $(".b4lp", el).innerHTML = V[view].parts.map(p => `<button data-k="${p[0]}" aria-pressed="false">${p[1]}</button>`).join("");
    el.querySelectorAll(".b4lp button").forEach(b => b.addEventListener("click", () => { sel = b.dataset.k; put(); }));
    sel = V[view].parts[0][0]; put();
  };
  chipsB4(el, ".b4lv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 4.2.1 light-dependent and light-independent phases, step by step */
W.b4stages = (el) => {
  const ST = [
    [L2("Light is caught", "আলো ধরা পড়ে"), L2("Photons of sunlight strike the grana. Chlorophyll in the thylakoids absorbs their energy.", "সূর্যালোকের ফোটন গ্রানায় পড়ে। থাইলাকয়েডের ক্লোরোফিল তার শক্তি শোষণ করে।")],
    [L2("Water is split (photolysis)", "পানি ভাঙে (ফটোলাইসিস)"), L2("With light and chlorophyll, water breaks into oxygen, protons (H⁺) and electrons. The oxygen leaves the leaf.", "আলো ও ক্লোরোফিলের সাহায্যে পানি ভেঙে অক্সিজেন, প্রোটন (H⁺) ও ইলেকট্রন হয়। অক্সিজেন পাতা থেকে বেরিয়ে যায়।")],
    [L2("ATP and NADPH are made", "ATP ও NADPH তৈরি হয়"), L2("Light energy joins ADP and Pi into ATP (photophosphorylation). Electrons and H⁺ reduce NADP to NADPH + H⁺. Together they are the assimilatory power.", "আলোর শক্তিতে ADP ও Pi জুড়ে ATP হয় (ফটোফসফোরাইলেশন)। ইলেকট্রন ও H⁺ দিয়ে NADP বিজারিত হয়ে NADPH + H⁺ হয়। এ দুটি মিলে আত্তীকরণ শক্তি।")],
    [L2("They move to the stroma; CO₂ arrives", "এরা স্ট্রোমায় যায়; CO₂ আসে"), L2("ATP and NADPH + H⁺ pass into the stroma. CO₂ from the air enters through the stomata and reaches the stroma too.", "ATP ও NADPH + H⁺ স্ট্রোমায় যায়। বাতাসের CO₂ পত্ররন্ধ্র দিয়ে ঢুকে স্ট্রোমায় পৌঁছায়।")],
    [L2("CO₂ is reduced (Calvin cycle)", "CO₂ বিজারিত হয় (ক্যালভিন চক্র)"), L2("Using ATP and NADPH + H⁺, CO₂ is reduced. The first stable compound is 3-carbon phosphoglyceric acid, and from it carbohydrate is built. No light is needed directly.", "ATP ও NADPH + H⁺ ব্যবহার করে CO₂ বিজারিত হয়। প্রথম স্থায়ী পদার্থ ৩-কার্বন ফসফোগ্লিসারিক এসিড, তা থেকে শর্করা গড়ে ওঠে। সরাসরি আলো লাগে না।")],
    [L2("The carriers go back to be recharged", "বাহকেরা রিচার্জ হতে ফিরে যায়"), L2("The used ADP, Pi and NADP return to the grana. As long as there is light they are charged again, so the two phases keep each other running.", "ব্যবহৃত ADP, Pi ও NADP গ্রানায় ফিরে যায়। আলো থাকলে আবার চার্জ হয়, তাই দুই পর্যায় একে অপরকে চালু রাখে।")]];
  let cur = 0;
  el.innerHTML = `<div class="svgwrap fit" id="b4ss"></div>
    <div class="w-row" style="margin:8px 0"><button class="btn" id="b4sp">${L2("‹ Back", "‹ আগের")}</button><button class="btn solid" id="b4sn">${L2("Next ›", "পরের ›")}</button><span class="muted" id="b4si"></span></div>
    <div class="w-out" id="b4so"></div>`;
  const draw = () => {
    const op = n => n > cur ? 0.16 : n === cur ? 1 : 0.78;
    const g = (n, inner) => `<g opacity="${op(n)}">${inner}</g>`;
    const tw = n => n === cur ? "700" : "";
    let s = `<svg viewBox="0 0 360 262" role="img" aria-label="${L2("Two phases of photosynthesis in a chloroplast", "ক্লোরোপ্লাস্টে সালোকসংশ্লেষণের দুই পর্যায়")}">${arrowDefs("b4ta", "#e0a021")}${arrowDefs("b4tb", WATER4)}${arrowDefs("b4tc", "var(--bad)")}${arrowDefs("b4td", "var(--c)")}${arrowDefs("b4te", "var(--muted)")}${arrowDefs("b4tf", "var(--note)")}`;
    s += `<rect x="6" y="38" width="348" height="182" rx="70" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
    s += Array.from({ length: 6 }, (_, i) => `<rect x="42" y="${92 + i * 11}" width="70" height="9" rx="4.5" fill="var(--c)" stroke="var(--ink)" stroke-width="1"/>`).join("");
    s += T4(77, 176, L2("grana", "গ্রানা"), "middle", 13, "var(--ink)", "700") + T4(77, 192, L2("light phase", "আলোক পর্যায়"), "middle", 12, "var(--muted)");
    s += `<circle cx="270" cy="124" r="36" fill="var(--paper)" stroke="var(--c)" stroke-width="2.5"/><path d="M296 99 l7 -1 l-2 8" fill="none" stroke="var(--c)" stroke-width="2.5"/>` + T4(270, 121, L2("Calvin", "ক্যালভিন"), "middle", 13, "var(--ink)", "700") + T4(270, 137, L2("cycle", "চক্র"), "middle", 13, "var(--ink)", "700");
    s += T4(246, 182, L2("stroma", "স্ট্রোমা"), "middle", 13, "var(--ink)", "700") + T4(246, 198, L2("dark phase", "অন্ধকার পর্যায়"), "middle", 12, "var(--muted)");
    s += g(0, SUN4(26, 24, 11) + AR4(42, 38, 62, 84, "b4ta", "#e0a021", 2.5, "6 4") + AR4(54, 30, 84, 84, "b4ta", "#e0a021", 2.5, "6 4") + T4(50, 18, L2("light", "আলো"), "start", 13, "var(--ink)", tw(0)));
    s += g(1, AR4(16, 246, 38, 152, "b4tb", WATER4, 2.5) + T4(26, 256, "H₂O", "start", 13, WATER4, "700") + AR4(100, 88, 128, 30, "b4tc", "var(--bad)", 2.5) + T4(136, 26, "O₂", "start", 13, "var(--bad)", "700"));
    s += g(2, T4(172, 96, "ATP", "middle", 13, "var(--c)", "700") + T4(172, 80, "NADPH + H⁺", "middle", 12, "var(--c)", "700"));
    s += g(3, AR4(118, 104, 228, 104, "b4td", "var(--c)", 3) + AR4(322, 22, 292, 86, "b4te", "var(--muted)", 2.5) + T4(316, 16, "CO₂", "end", 13, "var(--ink)", "700"));
    s += g(4, AR4(298, 152, 326, 238, "b4tf", "var(--note)", 3) + T4(306, 257, L2("carbohydrate", "শর্করা"), "middle", 13, "var(--note)", "700"));
    s += g(5, AR4(232, 146, 120, 146, "b4te", "var(--muted)", 2.5, "5 4") + T4(176, 164, "ADP + Pi, NADP", "middle", 12, "var(--muted)", "700"));
    $("#b4ss", el).innerHTML = s + `</svg>`;
    $("#b4si", el).textContent = L2(`Step ${cur + 1} of ${ST.length}`, `ধাপ ${B4(cur + 1)} / ${B4(ST.length)}`);
    $("#b4so", el).innerHTML = `<b>${B4(cur + 1)}. ${ST[cur][0]}</b> <span class="muted">(${cur < 3 ? L2("light-dependent phase, in the grana", "আলোকনির্ভর পর্যায়, গ্রানায়") : cur < 5 ? L2("light-independent phase, in the stroma", "আলোক নিরপেক্ষ পর্যায়, স্ট্রোমায়") : L2("link between the phases", "দুই পর্যায়ের যোগসূত্র")})</span><br>${ST[cur][1]}`;
    $("#b4sp", el).disabled = cur === 0;
    $("#b4sn", el).textContent = cur === ST.length - 1 ? L2("Start again", "আবার শুরু") : L2("Next ›", "পরের ›");
  };
  $("#b4sp", el).addEventListener("click", () => { if (cur > 0) cur--; draw(); });
  $("#b4sn", el).addEventListener("click", () => { cur = cur === ST.length - 1 ? 0 : cur + 1; draw(); });
  draw();
};

/* 4.2.2 factors: rate curves + the starch test */
W.b4factors = (el) => {
  const sm = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const F = {
    light: { name: L2("Light", "আলো"), min: 0, max: 100, step: 1, val: 20, xl: L2("light intensity →", "আলোর তীব্রতা →"),
      f: x => x <= 75 ? 100 * (1 - Math.exp(-x / 28)) / (1 - Math.exp(-75 / 28)) : 100 - 30 * ((x - 75) / 25) ** 2,
      show: x => x === 0 ? L2("dark", "অন্ধকার") : x < 25 ? L2("dim", "মৃদু") : x < 45 ? L2("moderate", "মাঝারি") : x <= 75 ? L2("bright", "উজ্জ্বল") : L2("extremely strong", "অত্যধিক তীব্র"),
      ticks: [[0, L2("dark", "অন্ধকার")], [75, L2("bright", "উজ্জ্বল")]], marks: [],
      say: x => x === 0 ? L2("No light, no energy: photosynthesis stops.", "আলো নেই, শক্তিও নেই: সালোকসংশ্লেষণ বন্ধ।") : x < 45 ? L2("Light is in short supply, so every bit of extra light speeds up photosynthesis.", "আলোর জোগান কম, তাই আলো একটু বাড়লেই সালোকসংশ্লেষণ দ্রুত হয়।") : x <= 75 ? L2("The curve is levelling off. There is enough light now; something else (CO₂ or temperature) is holding the rate back.", "রেখাটি সমান হয়ে আসছে। আলো এখন যথেষ্ট; অন্য কিছু (CO₂ বা তাপমাত্রা) হারকে আটকে রাখছে।") : L2("Extremely strong light damages enzymes and less chlorophyll is made, so the rate falls.", "অত্যধিক তীব্র আলোয় এনজাইম নষ্ট হয়, ক্লোরোফিলও কম তৈরি হয়, তাই হার কমে যায়।") },
    co2: { name: "CO₂", min: 0, max: 2, step: 0.01, val: 0.03, xl: L2("CO₂ in the air (%) →", "বাতাসে CO₂ (%) →"),
      f: x => x <= 1 ? 115 * x / (x + 0.15) : 100 - 60 * (x - 1) ** 2,
      show: x => B4(x.toFixed(2)) + "%", ticks: [[0, "0"], [1, "1"], [2, "2"]], marks: [[0.03, L2("air", "বাতাস")]],
      say: x => x === 0 ? L2("No CO₂, no photosynthesis: there is nothing to reduce into carbohydrate.", "CO₂ নেই, সালোকসংশ্লেষণও নেই: শর্করায় বিজারিত করার মতো কিছুই নেই।") : x <= 0.05 ? L2("About the level in ordinary air (0.03%). CO₂ is scarce, so the rate is far below what the plant could do.", "সাধারণ বাতাসের মাত্রার কাছাকাছি (০.০৩%)। CO₂ কম, তাই উদ্ভিদ যা পারত, হার তার অনেক নিচে।") : x <= 1 ? L2("More CO₂, faster photosynthesis. Plants can use CO₂ up to about 1%.", "CO₂ বেশি, সালোকসংশ্লেষণও দ্রুত। উদ্ভিদ প্রায় ১% পর্যন্ত CO₂ ব্যবহার করতে পারে।") : L2("Too much CO₂: the mesophyll cells become more acidic, the stomata close and the rate falls.", "CO₂ অতিরিক্ত: মেসোফিল কোষের অম্লত্ব বাড়ে, পত্ররন্ধ্র বন্ধ হয়, হার কমে যায়।") },
    temp: { name: L2("Temperature", "তাপমাত্রা"), min: 0, max: 50, step: 1, val: 28, xl: L2("temperature (°C) →", "তাপমাত্রা (°C) →"),
      f: x => x < 22 ? 100 * sm(x / 22) : x <= 35 ? 100 : 100 * (1 - sm((x - 35) / 10)),
      show: x => B4(x) + "°C", ticks: [[0, "0"], [22, "22"], [35, "35"], [45, "45"]], marks: [], band: [22, 35],
      say: x => x <= 1 ? L2("Near 0°C the process cannot run.", "০°C-এর কাছাকাছি প্রক্রিয়াটি চলতে পারে না।") : x < 22 ? L2("Too cool: enzymes work slowly, so the rate is below its best.", "বেশ ঠান্ডা: এনজাইম ধীরে কাজ করে, তাই হার সেরা মানের নিচে।") : x <= 35 ? L2("Inside the optimum range (22–35°C): the enzymes work at their best.", "পরিমিত সীমার ভেতরে (২২–৩৫°C): এনজাইম সবচেয়ে ভালো কাজ করে।") : x < 45 ? L2("Too hot: enzymes are being harmed and the rate drops quickly.", "বেশি গরম: এনজাইমের ক্ষতি হচ্ছে, হার দ্রুত কমছে।") : L2("Above about 45°C photosynthesis cannot run.", "প্রায় ৪৫°C-এর ওপরে সালোকসংশ্লেষণ চলতে পারে না।") } };
  const EXP = {
    l: [
      [L2("Keep the plant in the dark for 48 hours", "গাছটিকে ৪৮ ঘণ্টা অন্ধকারে রাখো"), L2("The leaf uses up or sends away its old starch, so it becomes starch-free.", "পাতা তার পুরোনো শ্বেতসার খরচ করে ফেলে বা সরিয়ে দেয়, ফলে শ্বেতসারবিহীন হয়।")],
      [L2("Cover part of a leaf with black paper", "পাতার একাংশ কালো কাগজে ঢাকো"), L2("Cover both sides and clip it, so that no light reaches that strip.", "উভয় দিক ঢেকে ক্লিপ দাও, যেন ওই অংশে আলো না পৌঁছায়।")],
      [L2("Leave it in sunlight for 6–7 hours", "৬–৭ ঘণ্টা সূর্যালোকে রাখো"), L2("Only the uncovered parts can photosynthesise now.", "এখন শুধু খোলা অংশই সালোকসংশ্লেষণ করতে পারে।")],
      [L2("Boil the leaf in water", "পাতাটি পানিতে সিদ্ধ করো"), L2("Remove the paper first. A few minutes of boiling kills the cells and softens the leaf.", "আগে কাগজ খুলে নাও। কয়েক মিনিট সিদ্ধ করলে কোষ মরে যায়, পাতা নরম হয়।")],
      [L2("Boil it in alcohol, in a water bath", "অ্যালকোহলে সিদ্ধ করো, গরম পানির পাত্রে বসিয়ে"), L2("Alcohol dissolves the chlorophyll and the leaf turns pale. Safety: alcohol catches fire easily, so never heat it directly on a flame.", "অ্যালকোহল ক্লোরোফিল দ্রবীভূত করে, পাতা বিবর্ণ হয়। সতর্কতা: অ্যালকোহলে সহজে আগুন ধরে, তাই কখনো সরাসরি আগুনে তাপ দেবে না।")],
      [L2("Wash, then dip in iodine solution", "ধুয়ে আয়োডিন দ্রবণে ডোবাও"), L2("Result: the parts that had light turn blue-black (starch is present). The covered strip does not. Light is essential for photosynthesis.", "ফলাফল: যে অংশ আলো পেয়েছিল তা নীল-কালো হয় (শ্বেতসার আছে)। ঢাকা অংশ হয় না। সালোকসংশ্লেষণের জন্য আলো অপরিহার্য।")]],
    c: [
      [L2("Pick a variegated leaf at about noon", "দুপুরের দিকে একটি বাহারি পাতা নাও"), L2("Mark or sketch which parts are green. Only those parts contain chlorophyll.", "কোন অংশ সবুজ তা চিহ্নিত করো বা এঁকে রাখো। শুধু ওই অংশে ক্লোরোফিল আছে।")],
      [L2("Boil the leaf in water", "পাতাটি পানিতে সিদ্ধ করো"), L2("A few minutes of boiling kills the cells and softens the leaf.", "কয়েক মিনিট সিদ্ধ করলে কোষ মরে যায়, পাতা নরম হয়।")],
      [L2("Boil it in alcohol, in a water bath", "অ্যালকোহলে সিদ্ধ করো, গরম পানির পাত্রে বসিয়ে"), L2("The chlorophyll dissolves out and the whole leaf turns pale. Safety: never heat alcohol directly on a flame.", "ক্লোরোফিল বেরিয়ে যায়, পুরো পাতা বিবর্ণ হয়। সতর্কতা: অ্যালকোহলে কখনো সরাসরি আগুনের তাপ দেবে না।")],
      [L2("Wash, then dip in iodine solution", "ধুয়ে আয়োডিন দ্রবণে ডোবাও"), L2("Result: only the part that was green turns blue-black. The non-green part made no starch. Chlorophyll is essential for photosynthesis.", "ফলাফল: শুধু যে অংশ সবুজ ছিল তা নীল-কালো হয়। অসবুজ অংশে শ্বেতসার তৈরি হয়নি। সালোকসংশ্লেষণের জন্য ক্লোরোফিল অপরিহার্য।")]] };
  let mode = "light", ex = "l", stp = 0;
  el.innerHTML = `<div class="chipset b4fm" role="group">${Object.keys(F).map((k, i) => `<button data-m="${k}" aria-pressed="${i === 0}">${F[k].name}</button>`).join("")}<button data-m="test" aria-pressed="false">${L2("Starch test", "শ্বেতসার পরীক্ষা")}</button></div>
    <div id="b4fb" style="margin-top:8px"></div><div class="w-out" id="b4fo" style="margin-top:8px"></div>`;
  const X0 = 46, X1 = 344, Y0 = 176, Y1 = 22;
  const graph = () => {
    const f = F[mode], x = +$("#b4fx", el).value, r = Math.max(0, Math.min(100, f.f(x)));
    const px = v => X0 + (v - f.min) / (f.max - f.min) * (X1 - X0), py = v => Y0 - Math.max(0, Math.min(100, v)) / 100 * (Y0 - Y1);
    let d = ""; for (let i = 0; i <= 120; i++) { const v = f.min + (f.max - f.min) * i / 120; d += (i ? "L" : "M") + px(v).toFixed(1) + " " + py(f.f(v)).toFixed(1); }
    let s = `<svg viewBox="0 0 360 214" role="img" aria-label="${L2("Rate of photosynthesis graph", "সালোকসংশ্লেষণের হারের লেখচিত্র")}">`;
    if (f.band) s += `<rect x="${px(f.band[0])}" y="${Y1}" width="${px(f.band[1]) - px(f.band[0])}" height="${Y0 - Y1}" fill="var(--good)" opacity=".14"/>` + T4((px(f.band[0]) + px(f.band[1])) / 2, Y1 + 34, L2("best", "সেরা"), "middle", 12, "var(--good)", "700");
    s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="var(--ink)" stroke-width="1.5"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 6}" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += [0, 50, 100].map(v => `<line x1="${X0 - 4}" y1="${py(v)}" x2="${X1}" y2="${py(v)}" stroke="var(--rule)" stroke-width="1"/>${T4(X0 - 7, py(v) + 4, B4(v), "end", 12, "var(--muted)")}`).join("");
    s += f.ticks.map(([v, t]) => `<line x1="${px(v)}" y1="${Y0}" x2="${px(v)}" y2="${Y0 + 5}" stroke="var(--ink)" stroke-width="1.5"/>${T4(Math.max(X0 + 2, Math.min(X1 - 18, px(v))), Y0 + 18, B4(t), v === f.min ? "start" : "middle", 12, "var(--muted)")}`).join("");
    s += f.marks.map(([v, t]) => `<line x1="${px(v)}" y1="${Y0}" x2="${px(v)}" y2="${Y1}" stroke="var(--note)" stroke-width="1.5" stroke-dasharray="4 3"/>${T4(px(v) + 5, Y1 + 10, t, "start", 12, "var(--note)", "700")}`).join("");
    s += `<path d="${d}" fill="none" stroke="var(--c)" stroke-width="3"/><line x1="${px(x)}" y1="${Y0}" x2="${px(x)}" y2="${py(r)}" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="${px(x)}" cy="${py(r)}" r="7" fill="var(--bad)" stroke="var(--sheet)" stroke-width="2"/>`;
    s += T4(X1, Y0 + 34, f.xl, "end", 12, "var(--ink)") + `<text x="14" y="${(Y0 + Y1) / 2}" font-size="12" text-anchor="middle" fill="var(--ink)" transform="rotate(-90 14 ${(Y0 + Y1) / 2})">${L2("rate (% of maximum)", "হার (সর্বোচ্চের %)")}</text>`;
    $("#b4fg", el).innerHTML = s + `</svg>`;
    $("#b4fv", el).textContent = f.show(x);
    $("#b4fo", el).innerHTML = `${L2("Rate of photosynthesis", "সালোকসংশ্লেষণের হার")}: <b>${L2("about ", "প্রায় ")}${B4(Math.round(r))}%</b> ${L2("of the maximum", "(সর্বোচ্চ মানের তুলনায়)")}<br>${f.say(x)}<br><span class="muted" style="font-size:13px">${L2("The curve shows the trend described in your book, not exact measurements.", "রেখাটি বইয়ে বর্ণিত প্রবণতা দেখায়, নিখুঁত পরিমাপ নয়।")}</span>`;
  };
  const leaf = () => {
    const S = EXP[ex], last = stp === S.length - 1, vari = ex === "c";
    const iBoil = vari ? 1 : 3, iAlc = vari ? 2 : 4;
    const GREEN = LEAF4, PALE = "#eadfb4", DARK = "#2b2a4c", BROWN = "#c9a45c", CREAM = "#f0e2a2";
    const outer = vari ? (stp < iAlc ? CREAM : last ? BROWN : PALE) : (stp < iAlc ? GREEN : last ? DARK : PALE);
    const inner = stp < iAlc ? GREEN : last ? DARK : PALE;
    const LP = "M92 104 C 126 34 246 34 296 104 C 246 174 126 174 92 104 Z";
    let s = `<svg viewBox="0 0 360 208" role="img" aria-label="${L2("Starch test on a leaf", "পাতায় শ্বেতসার পরীক্ষা")}"><defs><clipPath id="b4cl"><path d="${LP}"/></clipPath></defs>`;
    if (!vari && stp === 0) s += `<rect x="30" y="10" width="300" height="188" rx="14" fill="var(--ink)" opacity=".16"/>` + T4(180, 192, L2("dark cupboard, 48 h", "অন্ধকার জায়গা, ৪৮ ঘণ্টা"), "middle", 12, "var(--ink)");
    if ((!vari && stp === 2) || (vari && stp === 0)) s += SUN4(40, 34, 14);
    if (stp === iBoil || stp === iAlc) {
      s += `<path d="M40 14 V178 q0 10 10 10 H310 q10 0 10 -10 V14" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="42" y="${stp === iAlc ? 70 : 40}" width="276" height="${stp === iAlc ? 116 : 146}" fill="${WATER4}" opacity=".16"/>`;
      if (stp === iAlc) s += `<path d="M70 4 V152 q0 22 22 22 H282 q22 0 22 -22 V4" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/><path d="M72 40 V152 q0 20 20 20 H282 q20 0 20 -20 V40 Z" fill="${GREEN}" opacity=".28"/>` + T4(187, 22, L2("alcohol (turns green)", "অ্যালকোহল (সবুজ হয়)"), "middle", 12, "var(--ink)") + T4(180, 204, L2("hot water around the tube, no direct flame", "টিউবের চারপাশে গরম পানি, সরাসরি আগুন নয়"), "middle", 12, WATER4, "700");
      else s += T4(180, 30, L2("boiling water", "ফুটন্ত পানি"), "middle", 12, WATER4, "700");
    }
    if (last) s += `<ellipse cx="190" cy="108" rx="150" ry="78" fill="${BROWN}" opacity=".18" stroke="var(--ink)" stroke-width="1.5"/>` + T4(190, 22, L2("iodine solution", "আয়োডিন দ্রবণ"), "middle", 12, "var(--ink)");
    s += `<line x1="92" y1="104" x2="62" y2="104" stroke="#6f8f4e" stroke-width="5" stroke-linecap="round"/><path d="${LP}" fill="${outer}" stroke="var(--ink)" stroke-width="1.5"/>`;
    if (vari) s += `<path d="${LP}" fill="${inner}" transform="translate(194 104) scale(.62) translate(-194 -104)"/>`;
    if (!vari && last) s += `<rect x="170" y="30" width="48" height="150" fill="${BROWN}" clip-path="url(#b4cl)"/>`;
    if (!vari && (stp === 1 || stp === 2)) s += `<rect x="170" y="42" width="48" height="124" fill="#1d1d1d" stroke="var(--muted)" stroke-width="1.5"/><rect x="187" y="36" width="14" height="16" rx="3" fill="var(--muted)" stroke="var(--ink)" stroke-width="1"/>`;
    s += `<path d="M92 104 H296" stroke="var(--ink)" stroke-width="1" opacity=".45" fill="none"/>`;
    if (last && !vari) s += T4(194, 203, "↑ " + L2("was covered: no starch", "ঢাকা ছিল: শ্বেতসার নেই"), "middle", 12, "var(--ink)", "700");
    if (last && vari) s += T4(194, 203, L2("green part: starch; edge: none", "সবুজ অংশে শ্বেতসার; কিনারায় নেই"), "middle", 12, "var(--ink)", "700");
    $("#b4fg", el).innerHTML = s + `</svg>`;
    $("#b4fi", el).textContent = L2(`Step ${stp + 1} of ${S.length}`, `ধাপ ${B4(stp + 1)} / ${B4(S.length)}`);
    $("#b4fo", el).innerHTML = `<b>${B4(stp + 1)}. ${S[stp][0]}</b><br>${S[stp][1]}`;
    $("#b4f1", el).disabled = stp === 0;
    $("#b4f2", el).textContent = last ? L2("Start again", "আবার শুরু") : L2("Next ›", "পরের ›");
  };
  const build = () => {
    if (mode === "test") {
      $("#b4fb", el).innerHTML = `<div class="chipset b4fe" role="group"><button data-e="l" aria-pressed="${ex === "l"}">${L2("Is light needed?", "আলো কি লাগে?")}</button><button data-e="c" aria-pressed="${ex === "c"}">${L2("Is chlorophyll needed?", "ক্লোরোফিল কি লাগে?")}</button></div>
        <div class="svgwrap fit" id="b4fg" style="margin-top:6px"></div><div class="w-row" style="margin-top:6px"><button class="btn" id="b4f1">${L2("‹ Back", "‹ আগের")}</button><button class="btn solid" id="b4f2"></button><span class="muted" id="b4fi"></span></div>`;
      chipsB4(el, ".b4fe", b => { ex = b.dataset.e; stp = 0; leaf(); });
      $("#b4f1", el).addEventListener("click", () => { if (stp > 0) stp--; leaf(); });
      $("#b4f2", el).addEventListener("click", () => { stp = stp === EXP[ex].length - 1 ? 0 : stp + 1; leaf(); });
      leaf();
    } else {
      const f = F[mode];
      $("#b4fb", el).innerHTML = `<div class="svgwrap fit" id="b4fg"></div><div class="w-sl"><label for="b4fx">${f.name}</label><b id="b4fv"></b><input class="w-range" type="range" id="b4fx" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.val}"></div>`;
      $("#b4fx", el).addEventListener("input", graph);
      graph();
    }
  };
  chipsB4(el, ".b4fm", b => { mode = b.dataset.m; build(); });
  build();
};

/* 4.2.5 trace anything on your plate back to the sun */
W.b4plate = (el) => {
  const FROM = L2("comes from", "আসে এখান থেকে"), EATS = L2("which eats", "এটি খায়");
  const IT = [
    [L2("Rice", "ভাত"), [[L2("Paddy plant: stored starch in its grains", "ধানগাছ: দানায় শ্বেতসার জমিয়েছে"), FROM]], true],
    [L2("Egg", "ডিম"), [[L2("Hen", "মুরগি"), FROM], [L2("Paddy, maize and other grain crops", "ধান, ভুট্টা ও অন্য শস্য"), EATS]], false],
    [L2("Milk", "দুধ"), [[L2("Cow", "গরু"), FROM], [L2("Grass and straw", "ঘাস ও খড়"), EATS]], false],
    [L2("Hilsa fish", "ইলিশ মাছ"), [[L2("Tiny animal plankton", "অতি ক্ষুদ্র প্রাণী প্ল্যাঙ্কটন"), EATS], [L2("Plant plankton (microscopic algae)", "উদ্ভিদ প্ল্যাঙ্কটন (আণুবীক্ষণিক শৈবাল)"), EATS]], false],
    [L2("Honey", "মধু"), [[L2("Honey bees", "মৌমাছি"), L2("made by", "এটি বানায়")], [L2("Mustard and litchi flowers (nectar)", "সরিষা ও লিচু ফুল (মধুরস)"), L2("which collect nectar from", "এরা মধুরস আনে এখান থেকে")]], false],
    [L2("Cotton shirt", "সুতির জামা"), [[L2("Cotton plant: its fibre is cellulose made from glucose", "তুলাগাছ: এর আঁশ গ্লুকোজ থেকে তৈরি সেলুলোজ"), L2("made from", "তৈরি হয় এ থেকে")]], true],
    [L2("Cooking gas", "চুলার গ্যাস"), [[L2("Remains of organisms buried for millions of years", "লক্ষ লক্ষ বছর মাটিচাপা পড়ে থাকা জীবের দেহাবশেষ"), L2("formed from", "তৈরি হয়েছে এ থেকে")], [L2("Ancient plants and plankton", "প্রাচীন উদ্ভিদ ও প্ল্যাঙ্কটন"), L2("which were once", "যা একসময় ছিল")]], false]];
  let cur = 0, shown = 0;
  el.innerHTML = `<div class="chipset b4pk" role="group">${IT.map((t, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${t[0]}</button>`).join("")}</div>
    <div id="b4pc" style="margin:10px 0;display:flex;flex-direction:column;align-items:stretch;gap:0"></div>
    <div class="w-row"><button class="btn solid" id="b4pn"></button></div><div class="w-out" id="b4po" style="margin-top:10px"></div>`;
  const box = (t, kind) => `<div style="border:1.5px solid ${kind === "sun" ? "#e0a021" : kind === "plant" ? "var(--c)" : "var(--rule)"};border-left-width:6px;border-radius:10px;padding:8px 12px;background:${kind === "plant" ? "var(--c-soft)" : kind === "sun" ? "var(--note-soft)" : "var(--paper)"};font-size:15px">${t}</div>`;
  const arrow = t => `<div class="muted" style="text-align:center;font-size:13px;line-height:1.9">↑ ${t}</div>`;
  const draw = () => {
    const t = IT[cur], ch = t[1], total = ch.length + 1;
    let h = box(`<b>${t[0]}</b>`, "item");
    for (let i = 0; i < Math.min(shown, ch.length); i++) h = box(ch[i][0] + (i === ch.length - 1 ? ` <span class="muted">(${L2("green plant: photosynthesis", "সবুজ উদ্ভিদ: সালোকসংশ্লেষণ")})</span>` : ""), i === ch.length - 1 ? "plant" : "item") + arrow(ch[i][1]) + h;
    if (shown >= total) h = box(`<b>${L2("The Sun", "সূর্য")}</b>: ${L2("light energy", "আলোকশক্তি")}`, "sun") + arrow(L2("got its energy from", "শক্তি পেয়েছে এখান থেকে")) + h;
    $("#b4pc", el).innerHTML = h;
    const done = shown >= total;
    $("#b4pn", el).textContent = done ? L2("Try another one", "আরেকটি দেখো") : L2("Where did that come from?", "এটা এল কোথা থেকে?");
    $("#b4po", el).innerHTML = done ? `<b>${t[2] ? L2("Direct dependence.", "প্রত্যক্ষ নির্ভরতা।") : L2("Indirect dependence.", "পরোক্ষ নির্ভরতা।")}</b> ${L2(`It took ${total} step${total > 1 ? "s" : ""} back to reach the Sun, and the chain passed through a green plant doing photosynthesis. Every chain ends the same way.`, `${B4(total)} ধাপ পেছনে গিয়ে সূর্যে পৌঁছানো গেল, আর শিকলটি গেল সালোকসংশ্লেষণকারী সবুজ উদ্ভিদের মধ্য দিয়ে। প্রতিটি শিকলই একইভাবে শেষ হয়।`)}` : shown === 0 ? L2("Start from the item and trace its energy backwards, one link at a time.", "জিনিসটি থেকে শুরু করে এর শক্তির উৎস এক ধাপ এক ধাপ করে পেছনে খোঁজো।") : L2("Keep going: where did that get its energy?", "চালিয়ে যাও: এটি শক্তি পেল কোথা থেকে?");
  };
  chipsB4(el, ".b4pk", b => { cur = +b.dataset.i; shown = 0; draw(); });
  $("#b4pn", el).addEventListener("click", () => {
    if (shown >= IT[cur][1].length + 1) { cur = (cur + 1) % IT.length; shown = 0; el.querySelectorAll(".b4pk button").forEach((q, i) => q.setAttribute("aria-pressed", i === cur)); } else shown++;
    draw();
  });
  draw();
};

/* 4.3 aerobic vs anaerobic respiration: follow one glucose, count the ATP */
W.b4resp = (el) => {
  const AER = [
    [L2("One glucose molecule enters", "এক অণু গ্লুকোজ ঢুকল"), L2("A 6-carbon glucose is in the cytoplasm, waiting to be oxidised.", "৬-কার্বনের একটি গ্লুকোজ সাইটোপ্লাজমে আছে, জারিত হওয়ার অপেক্ষায়।"), [0, 0, 0, 0]],
    [L2("Stage 1: Glycolysis (cytoplasm)", "ধাপ ১: গ্লাইকোলাইসিস (সাইটোপ্লাজম)"), L2("Glucose → 2 pyruvic acid. 4 ATP made, 2 used: net 2 ATP. 2 NADH + H⁺ formed. No oxygen needed.", "গ্লুকোজ → ২ পাইরুভিক এসিড। ৪ ATP তৈরি, ২টি খরচ: নিট ২ ATP। ২ NADH + H⁺ তৈরি। অক্সিজেন লাগে না।"), [2, 2, 0, 0]],
    [L2("Stage 2: Acetyl Co-A formation", "ধাপ ২: অ্যাসিটাইল কো-এ সৃষ্টি"), L2("Each pyruvic acid → acetyl Co-A (2C) + CO₂ + NADH. From two: 2 CO₂ and 2 NADH.", "প্রতি পাইরুভিক এসিড → অ্যাসিটাইল কো-এ (২C) + CO₂ + NADH। দুটি থেকে: ২ CO₂ ও ২ NADH।"), [2, 4, 0, 2]],
    [L2("Stage 3: Krebs cycle", "ধাপ ৩: ক্রেবস চক্র"), L2("Two acetyl Co-A give 4 CO₂, 6 NADH, 2 FADH₂ and 2 GTP (= 2 ATP).", "দুই অ্যাসিটাইল কো-এ থেকে ৪ CO₂, ৬ NADH, ২ FADH₂ ও ২ GTP (= ২ ATP)।"), [4, 10, 2, 6]],
    [L2("Stage 4: Electron transport system", "ধাপ ৪: ইলেকট্রন প্রবাহতন্ত্র"), L2("10 NADH × 3 = 30 ATP and 2 FADH₂ × 2 = 4 ATP. The electrons finally join O₂ and form water. Total: 2 + 2 + 30 + 4 = 38 ATP. (By stage, as in your book: 8 + 6 + 24 = 38.)", "১০ NADH × ৩ = ৩০ ATP আর ২ FADH₂ × ২ = ৪ ATP। ইলেকট্রন শেষে O₂-এর সাথে যুক্ত হয়ে পানি তৈরি করে। মোট: ২ + ২ + ৩০ + ৪ = ৩৮ ATP। (ধাপ ধরে, বইয়ের মতো: ৮ + ৬ + ২৪ = ৩৮।)"), [38, 0, 0, 6]]];
  const ANA = [
    AER[0],
    [L2("Stage 1: Incomplete oxidation of glucose", "ধাপ ১: গ্লুকোজের অসম্পূর্ণ জারণ"), L2("Just like glycolysis: glucose → 2 pyruvic acid, net 2 ATP, 2 NADH + H⁺.", "গ্লাইকোলাইসিসের মতোই: গ্লুকোজ → ২ পাইরুভিক এসিড, নিট ২ ATP, ২ NADH + H⁺।"), [2, 2, 0, 0]],
    [L2("Stage 2: Pyruvic acid is reduced", "ধাপ ২: পাইরুভিক এসিডের বিজারণ"), L2("No oxygen, so the mitochondrial stages cannot run. In the cytoplasm the NADH gives its hydrogen to pyruvic acid: yeast makes ethyl alcohol + CO₂, curd bacteria make lactic acid. Total: only 2 ATP. Most of the energy stays in the product.", "অক্সিজেন নেই, তাই মাইটোকন্ড্রিয়ার ধাপগুলো চলতে পারে না। সাইটোপ্লাজমে NADH তার হাইড্রোজেন পাইরুভিক এসিডকে দেয়: ইস্ট বানায় ইথাইল অ্যালকোহল + CO₂, দইয়ের ব্যাকটেরিয়া বানায় ল্যাকটিক এসিড। মোট: মাত্র ২ ATP। বেশির ভাগ শক্তি উৎপন্ন পদার্থেই থেকে যায়।"), [2, 0, 0, 2]]];
  let aer = true, cur = 0;
  el.innerHTML = `<div class="chipset b4rm" role="group"><button data-a="1" aria-pressed="true">${L2("With oxygen (aerobic)", "অক্সিজেনসহ (সবাত)")}</button><button data-a="0" aria-pressed="false">${L2("Without oxygen (anaerobic)", "অক্সিজেন ছাড়া (অবাত)")}</button></div>
    <div class="svgwrap fit" id="b4rs" style="margin-top:8px"></div>
    <div class="w-row" style="margin:8px 0"><button class="btn" id="b4rp">${L2("‹ Back", "‹ আগের")}</button><button class="btn solid" id="b4rn"></button></div>
    <div class="w-out" id="b4ro"></div>`;
  const draw = () => {
    const S = aer ? AER : ANA, last = cur === S.length - 1, c = S[cur][2];
    const op = n => n > cur ? 0.16 : 1, hot = n => n === cur;
    const node = (n, x, y, w, h, t, sub) => `<g opacity="${op(n)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(--paper)" stroke="${hot(n) ? "var(--bad)" : "var(--ink)"}" stroke-width="${hot(n) ? 3 : 1.5}"/>${T4(x + w / 2, y + (sub ? h / 2 - 2 : h / 2 + 4), t, "middle", 12, "var(--ink)", "700")}${sub ? T4(x + w / 2, y + h / 2 + 13, sub, "middle", 12, "var(--ink)") : ""}</g>`;
    let s = `<svg viewBox="0 0 360 326" role="img" aria-label="${L2("Stages of respiration in a cell", "কোষে শ্বসনের ধাপ")}">${arrowDefs("b4ra", "var(--ink)")}${arrowDefs("b4rb", "var(--muted)")}${arrowDefs("b4rc", "var(--bad)")}${arrowDefs("b4rd", WATER4)}`;
    s += `<rect x="3" y="3" width="354" height="320" rx="24" fill="var(--sheet)" stroke="var(--muted)" stroke-width="2" stroke-dasharray="7 4"/>` + T4(18, 24, L2("cytoplasm", "সাইটোপ্লাজম"), "start", 12, "var(--muted)", "700");
    s += `<polygon points="38,62 50,41 74,41 86,62 74,83 50,83" fill="var(--c-soft)" stroke="${cur === 0 ? "var(--bad)" : "var(--c)"}" stroke-width="${cur === 0 ? 3 : 2}"/>` + T4(62, 67, "6C", "middle", 14, "var(--ink)", "700") + T4(62, 100, L2("glucose", "গ্লুকোজ"), "middle", 12);
    s += `<g opacity="${op(1)}">${AR4(92, 62, 196, 62, "b4ra", "var(--ink)", hot(1) ? 3.5 : 2)}${T4(144, 52, L2("glycolysis", "গ্লাইকোলাইসিস"), "middle", 12, "var(--ink)", "700")}${T4(144, 80, "+2 ATP, 2 NADH", "middle", 12, "var(--good)", "700")}</g>`;
    s += node(1, 202, 44, 60, 36, "3C") + node(1, 268, 44, 60, 36, "3C") + `<g opacity="${op(1)}">${T4(265, 96, L2("2 pyruvic acid", "২ পাইরুভিক এসিড"), "middle", 12)}</g>`;
    const mo = aer ? 1 : 0.3;
    s += `<g opacity="${mo}"><rect x="18" y="${aer ? 148 : 176}" width="324" height="${aer ? 166 : 138}" rx="62" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2.5"/>${T4(100, aer ? 168 : 196, L2("mitochondrion", "মাইটোকন্ড্রিয়া"), "middle", 12, "var(--c)", "700")}</g>`;
    if (aer) {
      s += `<g opacity="${op(2)}">${AR4(262, 102, 240, 158, "b4ra", "var(--ink)", hot(2) ? 3.5 : 2)}</g>` + node(2, 172, 162, 110, 26, L2("2 acetyl Co-A", "২ অ্যাসিটাইল কো-এ")) + `<g opacity="${op(2)}">${AR4(284, 175, 306, 175, "b4rb", "var(--muted)", 2)}${T4(336, 196, "2 CO₂", "end", 12, "var(--muted)", "700")}</g>`;
      s += `<g opacity="${op(3)}">${AR4(230, 190, 230, 208, "b4ra", "var(--ink)", hot(3) ? 3.5 : 2)}<circle cx="230" cy="244" r="32" fill="var(--paper)" stroke="${hot(3) ? "var(--bad)" : "var(--ink)"}" stroke-width="${hot(3) ? 3 : 1.5}"/><path d="M252 221 l7 -1 l-2 8" fill="none" stroke="var(--ink)" stroke-width="2"/>${T4(230, 241, L2("Krebs", "ক্রেবস"), "middle", 12, "var(--ink)", "700")}${T4(230, 256, L2("cycle", "চক্র"), "middle", 12, "var(--ink)", "700")}${AR4(264, 248, 284, 252, "b4rb", "var(--muted)", 2)}${T4(290, 258, "4 CO₂", "start", 12, "var(--muted)", "700")}${T4(230, 296, "+2 GTP", "middle", 12, "var(--good)", "700")}</g>`;
      s += `<g opacity="${op(4)}">${AR4(196, 240, 168, 234, "b4rc", "var(--bad)", hot(4) ? 3.5 : 2)}${T4(100, 196, "NADH, FADH₂", "middle", 12, "var(--bad)", "700")}<rect x="38" y="204" width="126" height="46" rx="8" fill="var(--paper)" stroke="${hot(4) ? "var(--bad)" : "var(--ink)"}" stroke-width="${hot(4) ? 3 : 1.5}"/>${T4(101, 224, L2("electron", "ইলেকট্রন"), "middle", 12, "var(--ink)", "700")}${T4(101, 240, L2("transport system", "প্রবাহতন্ত্র"), "middle", 12, "var(--ink)", "700")}${AR4(62, 292, 62, 256, "b4rd", WATER4, 2)}${T4(56, 290, "O₂", "end", 12, WATER4, "700")}${AR4(146, 254, 146, 286, "b4rd", WATER4, 2)}${T4(152, 282, "H₂O", "start", 12, WATER4, "700")}${T4(104, 274, "+34 ATP", "middle", 13, "var(--good)", "700")}</g>`;
    } else {
      s += `<line x1="70" y1="204" x2="290" y2="296" stroke="var(--bad)" stroke-width="4" opacity=".7"/><line x1="290" y1="204" x2="70" y2="296" stroke="var(--bad)" stroke-width="4" opacity=".7"/>` + T4(180, 255, L2("no O₂: cannot run", "O₂ নেই: চলে না"), "middle", 14, "var(--bad)", "700").replace("<text", `<text paint-order="stroke" stroke="var(--sheet)" stroke-width="5"`);
      s += `<g opacity="${op(2)}">${AR4(236, 102, 150, 126, "b4ra", "var(--ink)", hot(2) ? 3.5 : 2)}${AR4(288, 102, 288, 126, "b4ra", "var(--ink)", hot(2) ? 3.5 : 2)}</g>` + node(2, 14, 130, 190, 32, L2("ethyl alcohol + CO₂", "ইথাইল অ্যালকোহল + CO₂")) + `<g opacity="${op(2)}">${T4(215, 151, L2("or", "বা"), "middle", 12, "var(--muted)")}</g>` + node(2, 226, 130, 124, 32, L2("lactic acid", "ল্যাকটিক এসিড"));
    }
    $("#b4rs", el).innerHTML = s + `</svg>`;
    const cell = (l, v, col) => `<span style="display:inline-block;margin-right:12px;white-space:nowrap">${l}: <b style="color:${col}">${B4(v)}</b></span>`;
    let bar = "";
    if (last) { const n = aer ? 38 : 2; bar = `<div style="margin-top:8px;font-size:14px">${[[L2("Aerobic", "সবাত"), 38], [L2("Anaerobic", "অবাত"), 2]].map(([l, v]) => `<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><span style="width:5.5em">${l}</span><span style="height:14px;border-radius:4px;background:${v === n ? "var(--c)" : "var(--muted)"};width:${v / 38 * 45}%;min-width:6px"></span><b style="white-space:nowrap">${B4(v)} ATP</b></div>`).join("")}</div>`; }
    $("#b4ro", el).innerHTML = `<b>${S[cur][0]}</b><br>${S[cur][1]}<div style="margin-top:8px;font-size:15px">${cell("ATP", c[0], "var(--good)")}${cell("NADH", c[1], "var(--bad)")}${cell("FADH₂", c[2], "var(--bad)")}${cell("CO₂", c[3], "var(--muted)")}</div>${bar}`;
    $("#b4rp", el).disabled = cur === 0;
    $("#b4rn", el).textContent = last ? L2("Start again", "আবার শুরু") : cur === 0 ? L2("Start ›", "শুরু ›") : L2("Next stage ›", "পরের ধাপ ›");
  };
  chipsB4(el, ".b4rm", b => { aer = b.dataset.a === "1"; cur = 0; draw(); });
  $("#b4rp", el).addEventListener("click", () => { if (cur > 0) cur--; draw(); });
  $("#b4rn", el).addEventListener("click", () => { const n = (aer ? AER : ANA).length; cur = cur === n - 1 ? 0 : cur + 1; draw(); });
  draw();
};

/* 4.3.2 heat from respiration: two thermoflasks */
W.b4flask = (el) => {
  let dry = false;
  const A = L2("A", "ক"), Bn = L2("B", "খ");
  el.innerHTML = `<p style="margin:0 0 6px"><b>${L2("Predict first:", "আগে অনুমান করো:")}</b> ${L2("after a few hours, which flask will be warmer?", "কয়েক ঘণ্টা পর কোন ফ্লাস্ক বেশি গরম হবে?")}</p>
    <div class="chipset b4kg" role="group"><button data-g="a" aria-pressed="false">${L2("Flask A", "ক ফ্লাস্ক")}</button><button data-g="b" aria-pressed="false">${L2("Flask B", "খ ফ্লাস্ক")}</button><button data-g="s" aria-pressed="false">${L2("Both the same", "দুটোই সমান")}</button></div>
    <p class="hint" id="b4kh" style="margin:6px 0">${L2("Choose, then move the time slider.", "বেছে নাও, তারপর সময়ের স্লাইডার সরাও।")}</p>
    <div class="svgwrap fit" id="b4ks"></div>
    ${slider("b4kt", L2("Time passed", "অতিক্রান্ত সময়"), 0, 6, 0.5, 0, "h")}
    <div class="chipset b4kd" role="group" style="margin-bottom:8px"><button data-d="0" aria-pressed="true">${L2("A: germinating seeds", "ক: অঙ্কুরিত ছোলা")}</button><button data-d="1" aria-pressed="false">${L2("A: dry seeds", "ক: শুকনো ছোলা")}</button></div>
    <div class="w-out" id="b4ko"></div>`;
  const SD = [[-30, 0], [-12, 2], [6, 0], [24, 2], [-21, -15], [-3, -13], [15, -15], [32, -12], [-28, -29], [-10, -28], [8, -29], [26, -27], [-16, -42], [14, -42]];
  const draw = () => {
    const t = sv(el, "b4kt", L2("h", "ঘণ্টা"), 1);
    const TA = 28 + (dry ? 0.3 : 5.3) * (1 - Math.exp(-t / 2)), TB = 28;
    const flask = (x, T, kind, name) => {
      const h = (T - 24) * 11;
      let s = `<rect x="${x - 54}" y="82" width="108" height="142" rx="26" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><rect x="${x - 46}" y="90" width="92" height="126" rx="20" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.5"/><rect x="${x - 22}" y="60" width="44" height="26" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><rect x="${x - 21}" y="50" width="42" height="18" rx="3" fill="#b98a5a" stroke="var(--ink)" stroke-width="1.5"/>`;
      if (kind === "live") s += `<rect x="${x - 45}" y="196" width="90" height="19" rx="6" fill="${WATER4}" opacity=".22"/>`;
      s += SD.map(([dx, dy], i) => `<circle cx="${x + dx}" cy="${206 + dy}" r="8" fill="${kind === "live" ? "#d2a85e" : kind === "dry" ? "#b58d4c" : "#8f8a80"}" stroke="var(--ink)" stroke-width="1"/>${kind === "live" ? `<path d="M${x + dx + 5} ${200 + dy} q7 -3 6 -10" fill="none" stroke="var(--good)" stroke-width="2" stroke-linecap="round"/>` : ""}`).join("");
      s += `<rect x="${x - 5}" y="8" width="10" height="176" rx="5" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.5"/><rect x="${x - 2}" y="${180 - h}" width="4" height="${h}" fill="var(--bad)"/><circle cx="${x}" cy="184" r="7" fill="var(--bad)" stroke="var(--ink)" stroke-width="1.5"/>`;
      s += [26, 28, 30, 32, 34].map(v => `<line x1="${x + 5}" y1="${180 - (v - 24) * 11}" x2="${x + 10}" y2="${180 - (v - 24) * 11}" stroke="var(--muted)" stroke-width="1"/>`).join("");
      s += T4(x + 16, 30, B4(T.toFixed(1)) + "°C", "start", 15, T > 28.05 ? "var(--bad)" : "var(--ink)", "700") + T4(x - 16, 30, name, "end", 16, "var(--ink)", "700");
      return s;
    };
    let s = `<svg viewBox="0 0 360 252" role="img" aria-label="${L2("Two thermoflasks with seeds and thermometers", "বীজ ও থার্মোমিটারসহ দুটি থার্মোফ্লাস্ক")}">` + flask(92, TA, dry ? "dry" : "live", A) + flask(268, TB, "dead", Bn);
    s += T4(92, 244, dry ? L2("dry, not germinated", "শুকনো, অঙ্কুরিত নয়") : L2("living, germinating", "সজীব, অঙ্কুরিত"), "middle", 12, "var(--ink)") + T4(268, 244, L2("killed seeds", "মৃত বীজ"), "middle", 12, "var(--ink)");
    $("#b4ks", el).innerHTML = s + `</svg>`;
    const rise = TA - 28;
    $("#b4ko", el).innerHTML = `${L2("After", "")} ${B4(t.toFixed(1))} ${L2("h", "ঘণ্টা পর")}: ${A} = <b>${B4(TA.toFixed(1))}°C</b> (${L2("rise", "বৃদ্ধি")} ${B4(rise.toFixed(1))}°C), ${Bn} = <b>${B4(TB.toFixed(1))}°C</b> (${L2("no change", "অপরিবর্তিত")})<br>` +
      (t === 0 ? L2("Both flasks start at the same temperature. Flask B is the control.", "দুই ফ্লাস্কই একই তাপমাত্রা থেকে শুরু। খ ফ্লাস্ক হলো নিয়ন্ত্রিত নমুনা।") : dry ? L2("Dry seeds have very little water, so their enzymes barely work and respiration is extremely slow: hardly any heat.", "শুকনো বীজে পানি খুব কম, তাই এনজাইম প্রায় কাজ করে না, শ্বসন অতি ধীর: তাপ প্রায় বের হয় না।") : L2("The living seeds in A respire and give out heat; the insulated flask keeps it in, so the temperature rises. The killed seeds in B do not respire.", "ক-এর সজীব বীজ শ্বসন করে তাপ ছাড়ে; তাপ-অন্তরক ফ্লাস্ক তা ধরে রাখে, তাই তাপমাত্রা বাড়ে। খ-এর মৃত বীজ শ্বসন করে না।"));
  };
  chipsB4(el, ".b4kg", b => { $("#b4kh", el).innerHTML = b.dataset.g === "a" ? `<b style="color:var(--good)">${L2("Good thinking.", "ভালো ভেবেছ।")}</b> ${L2("Now move the slider and check.", "এবার স্লাইডার সরিয়ে মিলিয়ে দেখো।")}` : L2("Let's test it: move the slider and watch both thermometers.", "পরীক্ষা করেই দেখি: স্লাইডার সরাও আর দুটি থার্মোমিটার লক্ষ করো।"); });
  chipsB4(el, ".b4kd", b => { dry = b.dataset.d === "1"; draw(); });
  $("#b4kt", el).addEventListener("input", draw);
  draw();
};
