/* ---- biology chapter 6 widgets: transport in organisms ---- */
const B6 = x => bnNum(x, LANG);
const chips6 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T6 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "", extra = "") => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${extra}>${s}</text>`;
const AR6 = (x1, y1, x2, y2, id, c, w = 2.5, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;
const rng6 = seed => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const WATER6 = "#3b82c4", SUGAR6 = "#e08a1e", OXY6 = "#cf4a3f", DEO6 = "#3b74c4", LEAF6 = "#4a9d5b", SOIL6 = "#a9834f", PLASMA6 = "#ecd27a", RH6 = "#7a4fb0";

/* 6.1 osmosis: a raisin cell in solutions of different strength */
W.b6osmosis = (el) => {
  const IN = 20, CX = 180, CY = 134;
  const R = rng6(11);
  const POOL = Array.from({ length: 520 }, () => [30 + R() * 300, 60 + R() * 150]);
  const INS = []; while (INS.length < 14) { const a = R() * 2 - 1, b = R() * 2 - 1; if (a * a + b * b < 0.72) INS.push([a, b]); }
  el.innerHTML = `<div class="chipset b6oc" role="group">
      <button data-c="0" aria-pressed="true">${L2("Plain water", "সাধারণ পানি")}</button>
      <button data-c="20" aria-pressed="false">${L2("Same strength", "সমান ঘনত্ব")}</button>
      <button data-c="40" aria-pressed="false">${L2("Thick syrup", "ঘন সিরা")}</button></div>
    <div class="svgwrap fit" id="b6os" style="margin-top:8px"></div>
    ${slider("b6ox", L2("Sugar in the water outside", "বাইরের পানিতে চিনি"), 0, 40, 5, 0, "%")}
    <div class="w-out" id="b6oo"></div>`;
  const draw = () => {
    const c = sv(el, "b6ox", "%", 0), d = IN - c;
    const rx = 60 + d * 1.1, ry = 44 + d * 0.8;
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("A raisin cell in a sugar solution", "চিনির দ্রবণে একটি কিশমিশ-কোষ")}">${arrowDefs("b6oa", WATER6)}`;
    s += T6(20, 16, L2(`Outside the cell: ${c}% sugar`, `কোষের বাইরে: ${B6(c)}% চিনি`), "start", 14, "var(--ink)", "700") + T6(20, 35, L2(`Inside the cell: ${IN}% sugar`, `কোষের ভেতরে: ${B6(IN)}% চিনি`), "start", 14, "var(--muted)", "700");
    s += `<path d="M20 46 V208 Q20 222 34 222 H326 Q340 222 340 208 V46" fill="${WATER6}" fill-opacity=".12" stroke="var(--ink)" stroke-width="2"/>`;
    const n = Math.round(c * 3.4);
    let k = 0;
    for (const [x, y] of POOL) { if (k >= n) break; const u = (x - CX) / (rx + 9), v = (y - CY) / (ry + 9); if (u * u + v * v < 1) continue; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${SUGAR6}"/>`; k++; }
    let outline;
    if (d < 0) { const amp = 0.09 * (-d / 20); const pts = []; for (let i = 0; i <= 72; i++) { const a = i / 72 * 2 * Math.PI, m = 1 + amp * Math.sin(9 * a); pts.push(`${(CX + rx * m * Math.cos(a)).toFixed(1)},${(CY + ry * m * Math.sin(a)).toFixed(1)}`); } outline = `<polygon points="${pts.join(" ")}" fill="#c98a3a" fill-opacity=".3" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>`; }
    else outline = `<ellipse cx="${CX}" cy="${CY}" rx="${rx}" ry="${ry}" fill="#c98a3a" fill-opacity=".3" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>`;
    s += outline + INS.map(([a, b]) => `<circle cx="${(CX + a * rx).toFixed(1)}" cy="${(CY + b * ry).toFixed(1)}" r="3" fill="${SUGAR6}"/>`).join("");
    [-150, -90, -30, 30, 90, 150].forEach(deg => {
      const a = deg * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
      const o = [CX + (rx + 26) * co, CY + (ry + 22) * si], i2 = [CX + (rx - 16) * co, CY + (ry - 14) * si];
      const w = 2 + Math.abs(d) / 9;
      if (d > 0) s += AR6(o[0].toFixed(1), o[1].toFixed(1), i2[0].toFixed(1), i2[1].toFixed(1), "b6oa", WATER6, w);
      else if (d < 0) s += AR6(i2[0].toFixed(1), i2[1].toFixed(1), o[0].toFixed(1), o[1].toFixed(1), "b6oa", WATER6, w);
      else { const px = -si * 5, py = co * 5; s += AR6((o[0] + px).toFixed(1), (o[1] + py).toFixed(1), (i2[0] + px).toFixed(1), (i2[1] + py).toFixed(1), "b6oa", WATER6, 1.6) + AR6((i2[0] - px).toFixed(1), (i2[1] - py).toFixed(1), (o[0] - px).toFixed(1), (o[1] - py).toFixed(1), "b6oa", WATER6, 1.6); }
    });
    s += `<circle cx="26" cy="238" r="4" fill="${SUGAR6}"/>` + T6(35, 243, L2("sugar", "চিনি"), "start", 13) + AR6(96, 238, 120, 238, "b6oa", WATER6, 2.5) + T6(126, 243, L2("water", "পানি"), "start", 13);
    s += `<line x1="186" y1="238" x2="212" y2="238" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>` + T6(218, 243, L2("membrane", "বৈষম্যভেদ্য পর্দা"), "start", 13) + `</svg>`;
    $("#b6os", el).innerHTML = s;
    let o;
    if (d > 0) o = `<b style="color:${WATER6}">${L2("Water moves INTO the cell.", "পানি কোষের ভেতরে ঢুকছে।")}</b> ${L2(`Outside (${c}%) is the dilute side, inside (${IN}%) is the concentrated side. Water crosses the membrane from dilute to concentrated, and the cell swells.`, `বাইরের দিক (${B6(c)}%) পাতলা, ভেতরের দিক (${B6(IN)}%) ঘন। পানি পর্দা ভেদ করে পাতলা থেকে ঘন দ্রবণে যায়, আর কোষ ফুলে ওঠে।`)}`;
    else if (d < 0) o = `<b style="color:var(--bad)">${L2("Water moves OUT of the cell.", "পানি কোষ থেকে বেরিয়ে যাচ্ছে।")}</b> ${L2(`Now the outside (${c}%) is more concentrated than the inside (${IN}%). Water leaves the cell and it shrinks.`, `এবার বাইরের দিক (${B6(c)}%) ভেতরের (${B6(IN)}%) চেয়ে বেশি ঘন। পানি কোষ ছেড়ে বেরিয়ে যায়, কোষ চুপসে যায়।`)}`;
    else o = `<b>${L2("No net movement.", "মোট কোনো প্রবাহ নেই।")}</b> ${L2("Both sides have the same concentration. Water molecules still cross, but equally in both directions, so the cell keeps its size.", "দুই দিকের ঘনত্ব সমান। পানির অণু তবু পর্দা পার হয়, কিন্তু দুই দিকে সমান হারে, তাই কোষের আকার বদলায় না।")}`;
    o += `<br><span class="muted">${L2("The sugar stays where it is: it cannot pass through the membrane.", "চিনি নিজের জায়গাতেই থাকে: এটি পর্দা পার হতে পারে না।")}</span>`;
    $("#b6oo", el).innerHTML = o;
    el.querySelectorAll(".b6oc button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.c === c));
  };
  chips6(el, ".b6oc", b => { $("#b6ox", el).value = b.dataset.c; draw(); });
  $("#b6ox", el).addEventListener("input", draw);
  draw();
};

/* 6.2 path of water (xylem) and of food (phloem) */
W.b6path = (el) => {
  const NAME = {
    hair: L2("Root hair", "মূলরোম"), cortex: L2("Cortex", "কর্টেক্স"), endo: L2("Endodermis", "অন্তঃত্বক"), peri: L2("Pericycle", "পরিচক্র"),
    xyl: L2("Xylem vessel", "জাইলেম ভেসেল"), leaf: L2("Leaf", "পাতা"), phl: L2("Sieve tube of the phloem", "ফ্লোয়েমের সিভনল"), store: L2("Where the food goes", "খাদ্য কোথায় যায়") };
  const J = {
    water: { name: L2("Water and minerals", "পানি ও খনিজ লবণ"), steps: [
      ["hair", L2("The capillary water of the soil enters the root hair by osmosis and diffusion. It is drawn in by a suction force that begins with transpiration in the leaves.", "মাটির কৈশিক পানি অভিস্রবণ ও ব্যাপন প্রক্রিয়ায় মূলরোমে ঢোকে। একে টেনে আনে চোষক শক্তি, যার শুরু পাতার প্রস্বেদন থেকে।")],
      ["cortex", L2("Water passes from one cortex cell to the next. This is cell-to-cell osmosis.", "পানি কর্টেক্সের এক কোষ থেকে পাশের কোষে যায়। এটাই কোষ থেকে কোষান্তরে অভিস্রবণ।")],
      ["endo", L2("The endodermis is the innermost ring of the cortex. Water crosses it on its way to the centre of the root.", "অন্তঃত্বক কর্টেক্সের সবচেয়ে ভেতরের স্তর। মূলের কেন্দ্রের দিকে যেতে পানি এটি পার হয়।")],
      ["peri", L2("The pericycle is the last layer before the vascular bundle.", "পরিচক্র হলো পরিবহণ কলাগুচ্ছের আগের শেষ স্তর।")],
      ["xyl", L2("In the xylem the water and minerals (the cell sap) rise through root, stem and branches. Transpiration pull, capillary force and root pressure lift them. This is the ascent of sap.", "জাইলেমে পানি ও খনিজ লবণ (কোষরস) মূল, কাণ্ড ও শাখা বেয়ে ওপরে ওঠে। প্রস্বেদন টান, কৈশিক শক্তি ও মূলজ চাপ একে তোলে। এটাই কোষরসের আরোহণ।")],
      ["leaf", L2("The sap reaches the mesophyll cells of the leaf. A little water is used in photosynthesis; most of it leaves as vapour (transpiration), which keeps the pull going.", "কোষরস পাতার মেসোফিল কোষে পৌঁছায়। সামান্য পানি সালোকসংশ্লেষণে লাগে; বেশির ভাগই বাষ্প হয়ে বেরিয়ে যায় (প্রস্বেদন), আর তাতেই টান চালু থাকে।")]] },
    food: { name: L2("Food", "খাদ্য"), steps: [
      ["leaf", L2("In light, the leaf makes carbohydrate from water and CO₂. This is the food that the whole plant lives on.", "আলোতে পাতা পানি ও CO₂ থেকে শর্করা তৈরি করে। এই খাদ্যেই পুরো উদ্ভিদ বাঁচে।")],
      ["phl", L2("Food travels in the sieve tubes: living cells without a nucleus, joined end to end. Their end walls have pores like a sieve. The companion cell beside each one keeps it working. Food can move up and down at the same time.", "খাদ্য চলে সিভনল দিয়ে: এরা নিউক্লিয়াসবিহীন সজীব কোষ, একটির মাথায় আরেকটি জোড়া। প্রান্তপ্রাচীরে চালুনির মতো ছিদ্র থাকে। পাশের সঙ্গীকোষ একে সচল রাখে। খাদ্য একই সাথে ওপরে ও নিচে যেতে পারে।")],
      ["store", L2("Every living cell uses food in respiration. What is left is stored: in a stem (potato), a root (sweet potato), a leaf (aloe vera), fruits and seeds.", "প্রতিটি জীবন্ত কোষ শ্বসনে খাদ্য ব্যবহার করে। যা বাকি থাকে তা জমা হয়: কাণ্ডে (গোল আলু), মূলে (মিষ্টি আলু), পাতায় (ঘৃতকুমারী), ফলে ও বীজে।")]] } };
  let j = "water", i = 0;
  el.innerHTML = `<div class="chipset b6pj" role="group">${Object.keys(J).map((k, n) => `<button data-j="${k}" aria-pressed="${n === 0}">${J[k].name}</button>`).join("")}</div>
    <div class="svgwrap fit" id="b6ps" style="margin-top:8px"></div>
    <div class="w-row" style="margin:8px 0"><button class="btn" data-d="-1">← ${L2("Back", "আগের ধাপ")}</button><span class="hint" id="b6pn"></span><button class="btn solid" data-d="1">${L2("Next", "পরের ধাপ")} →</button></div>
    <div class="w-out" id="b6po"></div>`;
  const draw = () => {
    const st = J[j].steps, sel = st[i][0], wat = j === "water";
    const hl = k => k === sel ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.5"`;
    const lab = (k, x, y, t) => `<text data-k="${k}" x="${x}" y="${y}" font-size="13" text-anchor="middle" fill="${k === sel ? "var(--bad)" : "var(--ink)"}" font-weight="${k === sel ? 700 : 400}" style="cursor:pointer">${t}</text>`;
    let s = `<svg viewBox="0 0 360 292" role="img" aria-label="${L2("A plant with its root and stem magnified", "একটি উদ্ভিদ, সাথে মূল ও কাণ্ডের বিবর্ধিত চিত্র")}">${arrowDefs("b6pw", WATER6)}${arrowDefs("b6pf", SUGAR6)}`;
    s += `<rect x="0" y="172" width="360" height="120" fill="${SOIL6}" fill-opacity=".2"/><line x1="0" y1="172" x2="360" y2="172" stroke="${SOIL6}" stroke-width="2"/>`;
    /* plant */
    s += `<path d="M66 172 V260 M66 196 L100 224 M66 216 L34 246 M100 224 l10 2 M92 218 l8 -4 M82 210 l2 -9 M34 246 l-10 0 M44 237 l-9 -5 M52 229 l-10 -2 M66 244 l9 5 M66 252 l-8 6" fill="none" stroke="#8a6a3c" stroke-width="3.5" stroke-linecap="round"/>`;
    s += `<line x1="66" y1="182" x2="46" y2="198" stroke="#8a6a3c" stroke-width="3"/><g data-k="store" style="cursor:pointer"><ellipse cx="32" cy="204" rx="16" ry="11" fill="#d9b77a" ${hl("store")}/><circle cx="26" cy="201" r="1.5" fill="var(--ink)"/><circle cx="36" cy="207" r="1.5" fill="var(--ink)"/></g>`;
    s += `<line x1="66" y1="172" x2="66" y2="46" stroke="${LEAF6}" stroke-width="10" stroke-linecap="round"/>`;
    s += `<g data-k="leaf" style="cursor:pointer"><path d="M66 92 C 84 66 114 66 122 82 C 108 104 84 104 66 92 Z M66 120 C 46 96 16 98 10 114 C 24 132 48 132 66 120 Z M66 50 C 54 36 60 20 66 12 C 73 22 78 38 66 50 Z" fill="${LEAF6}" ${hl("leaf")}/></g>`;
    s += `<line x1="96" y1="96" x2="102" y2="122" stroke="${LEAF6}" stroke-width="2"/><g data-k="store" style="cursor:pointer"><circle cx="103" cy="131" r="10" fill="#e2664a" ${hl("store")}/></g>`;
    if (wat) s += AR6(56, 252, 56, 62, "b6pw", WATER6, 3, "7 4");
    else s += AR6(77, 104, 77, 166, "b6pf", SUGAR6, 3, "7 4") + AR6(77, 84, 77, 46, "b6pf", SUGAR6, 3, "7 4");
    /* stem panel */
    s += `<rect x="134" y="6" width="220" height="132" rx="10" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>` + T6(244, 22, L2("Inside the stem", "কাণ্ডের ভেতরে"), "middle", 13, "var(--muted)");
    s += `<g data-k="xyl" style="cursor:pointer"><rect x="160" y="30" width="30" height="88" fill="${WATER6}" fill-opacity=".2" ${sel === "xyl" ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="${WATER6}" stroke-width="2"`}/>${[46, 62, 78, 94, 108].map(y => `<path d="M160 ${y} q15 6 30 0" fill="none" stroke="${WATER6}" stroke-width="1.5"/>`).join("")}${AR6(175, 112, 175, 40, "b6pw", WATER6, 3)}</g>`;
    s += T6(196, 70, L2("water", "পানি"), "start", 13, WATER6, "700") + T6(240, 92, L2("food", "খাদ্য"), "end", 13, SUGAR6, "700");
    s += `<g data-k="phl" style="cursor:pointer">${[30, 60, 90].map(y => `<rect x="246" y="${y}" width="30" height="${y === 90 ? 28 : 30}" fill="${SUGAR6}" fill-opacity=".2" ${sel === "phl" ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="${SUGAR6}" stroke-width="2"`}/>`).join("")}<path d="M247 60 H275 M247 90 H275" stroke="var(--ink)" stroke-width="3.5" stroke-dasharray="3 3"/><rect x="279" y="38" width="13" height="72" rx="6" fill="${SUGAR6}" fill-opacity=".45" stroke="var(--ink)" stroke-width="1.2"/><circle cx="285.5" cy="74" r="3.5" fill="var(--ink)"/>${AR6(255, 112, 255, 40, "b6pf", SUGAR6, 2.5)}${AR6(267, 36, 267, 108, "b6pf", SUGAR6, 2.5)}</g>`;
    s += lab("xyl", 175, 132, L2("xylem", "জাইলেম")) + lab("phl", 268, 132, L2("phloem (sieve tube)", "ফ্লোয়েম (সিভনল)"));
    /* root panel */
    s += `<rect x="134" y="146" width="220" height="138" rx="10" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>` + T6(244, 162, L2("Inside the root", "মূলের ভেতরে"), "middle", 13, "var(--muted)");
    s += [[146, 180], [158, 192], [144, 216], [160, 222], [150, 232]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${SOIL6}"/><path d="M${x - 7} ${y + 5} q7 5 14 0" fill="none" stroke="${WATER6}" stroke-width="2"/>`).join("");
    s += `<g data-k="hair" style="cursor:pointer"><path d="M172 172 H200 V228 H172 V208 Q150 212 143 203 Q150 193 172 196 Z" fill="var(--c-soft)" ${hl("hair")}/></g>`;
    s += `<g data-k="cortex" style="cursor:pointer"><rect x="202" y="172" width="28" height="56" rx="9" fill="var(--c-soft)" ${hl("cortex")}/><rect x="232" y="172" width="28" height="56" rx="9" fill="var(--c-soft)" ${hl("cortex")}/></g>`;
    s += `<g data-k="endo" style="cursor:pointer"><rect x="262" y="172" width="22" height="56" rx="3" fill="var(--note-soft)" ${hl("endo")}/></g><g data-k="peri" style="cursor:pointer"><rect x="286" y="172" width="22" height="56" rx="3" fill="var(--c-soft)" ${hl("peri")}/></g>`;
    s += `<g data-k="xyl" style="cursor:pointer"><rect x="310" y="168" width="32" height="62" fill="${WATER6}" fill-opacity=".2" ${sel === "xyl" ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="${WATER6}" stroke-width="2"`}/></g>`;
    const reach = { hair: 196, cortex: 258, endo: 282, peri: 306, xyl: 326, leaf: 326 }[sel];
    s += `<path d="M148 203 H326" fill="none" stroke="${WATER6}" stroke-width="2" stroke-dasharray="5 4" opacity=".45"/>`;
    if (wat) { s += `<path d="M148 203 H${reach}" fill="none" stroke="${WATER6}" stroke-width="3.5"/>`; if (reach >= 326) s += AR6(326, 203, 326, 176, "b6pw", WATER6, 3.5); else s += AR6(reach - 2, 203, reach + 2, 203, "b6pw", WATER6, 3.5); }
    s += lab("hair", 178, 245, NAME.hair) + lab("endo", 272, 245, NAME.endo) + lab("cortex", 231, 260, NAME.cortex) + lab("xyl", 327, 260, L2("xylem", "জাইলেম")) + lab("peri", 296, 275, NAME.peri);
    $("#b6ps", el).innerHTML = s + `</svg>`;
    $("#b6pn", el).textContent = L2(`Step ${i + 1} of ${st.length}`, `ধাপ ${B6(i + 1)} / ${B6(st.length)}`);
    $("#b6po", el).innerHTML = `<b>${B6(i + 1)}. ${NAME[sel]}</b><br>${st[i][1]}`;
    el.querySelectorAll("#b6ps [data-k]").forEach(g => g.addEventListener("click", () => { const n = st.findIndex(q => q[0] === g.dataset.k); if (n >= 0) { i = n; draw(); } else { const o = j === "water" ? "food" : "water", m = J[o].steps.findIndex(q => q[0] === g.dataset.k); if (m >= 0) { j = o; i = m; el.querySelectorAll(".b6pj button").forEach(q => q.setAttribute("aria-pressed", q.dataset.j === j)); draw(); } } }));
  };
  chips6(el, ".b6pj", b => { j = b.dataset.j; i = 0; draw(); });
  el.querySelectorAll("button[data-d]").forEach(b => b.addEventListener("click", () => { const n = J[j].steps.length; i = (i + +b.dataset.d + n) % n; draw(); }));
  draw();
};

/* 6.2.3 transpiration: a stoma and the factors that change the rate */
W.b6transp = (el) => {
  let light = 1, wind = 0;
  el.innerHTML = `<div class="w-row"><span class="hint">${L2("Light", "আলো")}:</span><div class="chipset b6tl" role="group"><button data-v="1" aria-pressed="true">${L2("Day", "দিন")}</button><button data-v="0" aria-pressed="false">${L2("Night", "রাত")}</button></div>
      <span class="hint">${L2("Wind", "বাতাস")}:</span><div class="chipset b6tw" role="group"><button data-v="0" aria-pressed="true">${L2("Still", "স্থির")}</button><button data-v="1" aria-pressed="false">${L2("Breeze", "মৃদু")}</button><button data-v="2" aria-pressed="false">${L2("Windy", "জোরালো")}</button></div></div>
    <div class="svgwrap fit" id="b6ts" style="margin-top:8px"></div>
    ${slider("b6tt", L2("Temperature", "তাপমাত্রা"), 10, 40, 1, 28, "°C")}
    ${slider("b6th", L2("Relative humidity", "আপেক্ষিক আর্দ্রতা"), 20, 100, 5, 60, "%")}
    <div class="w-out" id="b6to"></div>`;
  const draw = () => {
    const T = sv(el, "b6tt", "°C", 0), H = sv(el, "b6th", "%", 0);
    const open = light ? 1 : 0.06;
    const rate = (0.05 + open) * (0.4 + (T - 10) / 30 * 1.2) * (1 - H / 100) * (1 + 0.3 * wind);
    const rel = Math.min(1, rate / 1.6);
    const w = light ? 10 : 1.5, cx = 140, top = 78, bot = 178, mid = 128;
    let s = `<svg viewBox="0 0 360 214" role="img" aria-label="${L2("A stoma seen from above, with water vapour leaving", "ওপর থেকে দেখা একটি পত্ররন্ধ্র, জলীয় বাষ্প বেরিয়ে যাচ্ছে")}">${arrowDefs("b6ta", WATER6)}${arrowDefs("b6tb", "var(--muted)")}`;
    s += `<rect x="0" y="0" width="264" height="214" rx="10" fill="${light ? "#f7e9a8" : "#2b3554"}" fill-opacity="${light ? ".35" : ".55"}"/>`;
    s += `<rect x="44" y="60" width="192" height="136" rx="16" fill="${LEAF6}" fill-opacity=".35" stroke="${LEAF6}" stroke-width="2"/><path d="M44 106 H96 M184 150 H236 M44 160 H92 M186 96 H236 M92 60 V106 M190 150 V196 M100 160 V196 M180 60 V96" stroke="${LEAF6}" stroke-width="1.5" fill="none"/>`;
    if (light) s += `<circle cx="34" cy="30" r="14" fill="#f2b233"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => { const c = Math.cos(a * Math.PI / 180), q = Math.sin(a * Math.PI / 180); return `<line x1="${34 + c * 18}" y1="${30 + q * 18}" x2="${34 + c * 24}" y2="${30 + q * 24}" stroke="#f2b233" stroke-width="2.5" stroke-linecap="round"/>`; }).join("")}`;
    else s += `<path d="M42 16 a16 16 0 1 0 6 26 a13 13 0 0 1 -6 -26 z" fill="#e8e3c4"/>`;
    for (let n = 0; n < wind; n++) s += AR6(170, 22 + n * 14, 250, 22 + n * 14, "b6tb", "var(--muted)", 2.5, "10 5");
    /* guard cells */
    const gc = (sg) => `<path d="M${cx} ${top - 6} Q${cx + sg * (60 + (light ? 8 : 0))} ${mid} ${cx} ${bot + 6} Q${cx + sg * 2 * w} ${mid} ${cx} ${top - 6} Z" fill="${LEAF6}" stroke="var(--ink)" stroke-width="2"/>` + [-30, -10, 12, 32].map(dy => `<ellipse cx="${cx + sg * (w + 9 + (light ? 2 : 0))}" cy="${mid + dy}" rx="3" ry="4.5" fill="#2f7a40"/>`).join("");
    s += gc(-1) + gc(1);
    s += `<path d="M${cx} ${top} Q${cx + 2 * w} ${mid} ${cx} ${bot} Q${cx - 2 * w} ${mid} ${cx} ${top} Z" fill="${light ? "var(--ink)" : "var(--muted)"}" fill-opacity="${light ? ".85" : ".5"}"/>`;
    const nv = Math.round(rel * 6);
    for (let n = 0; n < nv; n++) { const f = n - (nv - 1) / 2, x0 = cx + f * 4, x1 = cx + f * 22; s += `<path d="M${x0} ${mid - 6} Q${x0 - 10} ${mid - 40} ${((x0 + x1) / 2).toFixed(1)} ${mid - 58} T${x1} ${mid - 100}" fill="none" stroke="${WATER6}" stroke-width="3" marker-end="url(#b6ta)"/>`; }
    s += T6(140, 208, light ? L2("stoma open", "পত্ররন্ধ্র খোলা") : L2("stoma closed", "পত্ররন্ধ্র বন্ধ"), "middle", 13, "var(--ink)", "700") + T6(50, 130, L2("guard", "রক্ষী-"), "start", 13) + T6(50, 145, L2("cell", "কোষ"), "start", 13) + `<line x1="86" y1="136" x2="${cx - w - 16}" y2="${mid + 4}" stroke="var(--ink)" stroke-width="1"/>`;
    /* gauge */
    s += T6(312, 16, L2("Rate", "হার"), "middle", 13, "var(--ink)", "700") + `<rect x="298" y="34" width="28" height="150" rx="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/><rect x="301" y="${(181 - 144 * rel).toFixed(1)}" width="22" height="${(144 * rel).toFixed(1)}" rx="4" fill="${WATER6}"/>`;
    s += T6(312, 30, L2("fast", "দ্রুত"), "middle", 13, "var(--muted)") + T6(312, 200, L2("slow", "ধীর"), "middle", 13, "var(--muted)") + `</svg>`;
    $("#b6ts", el).innerHTML = s;
    const word = rel < 0.06 ? L2("almost none", "প্রায় নেই") : rel < 0.25 ? L2("slow", "ধীর") : rel < 0.6 ? L2("moderate", "মাঝারি") : L2("fast", "দ্রুত");
    const up = "↑", dn = "↓";
    let o = `<b>${L2("Rate of transpiration", "প্রস্বেদনের হার")}: ${word}</b><br>`;
    o += `${light ? up : dn} ${light ? L2("Light: the stomata are open.", "আলো: পত্ররন্ধ্র খোলা।") : L2("Dark: the stomata are closed; only a little vapour escapes through the cuticle.", "অন্ধকার: পত্ররন্ধ্র বন্ধ; শুধু কিউটিকল দিয়ে সামান্য বাষ্প বের হয়।")}<br>`;
    o += `${T >= 25 ? up : dn} ${L2(`${T}°C: `, `${B6(T)}°C: `)}${T >= 25 ? L2("warm air, so water evaporates easily.", "গরম বাতাস, তাই পানি সহজে বাষ্প হয়।") : L2("cool air, so evaporation is slow.", "ঠান্ডা বাতাস, তাই বাষ্পীভবন ধীর।")}<br>`;
    o += `${H <= 50 ? up : dn} ${L2(`Humidity ${H}%: `, `আর্দ্রতা ${B6(H)}%: `)}${H >= 100 ? L2("the air is saturated and can take no more vapour.", "বাতাস সম্পৃক্ত, আর বাষ্প নিতে পারে না।") : H <= 50 ? L2("dry air takes up vapour readily.", "শুকনো বাতাস সহজে বাষ্প নেয়।") : L2("moist air takes up vapour slowly.", "ভেজা বাতাস ধীরে বাষ্প নেয়।")}<br>`;
    o += `${wind ? up : "•"} ${wind ? L2("Wind carries the moist air away from the leaf.", "বাতাস পাতার কাছের ভেজা বাতাস সরিয়ে নেয়।") : L2("Still air: moist air stays around the leaf.", "বাতাস স্থির: ভেজা বাতাস পাতার চারপাশেই থাকে।")}`;
    o += `<br><span class="muted">${L2("The bar shows a relative rate from a simple model, not a measurement.", "দণ্ডটি সরল একটি মডেল থেকে পাওয়া আপেক্ষিক হার দেখায়, মাপা মান নয়।")}</span>`;
    $("#b6to", el).innerHTML = o;
  };
  chips6(el, ".b6tl", b => { light = +b.dataset.v; draw(); });
  chips6(el, ".b6tw", b => { wind = +b.dataset.v; draw(); });
  $("#b6tt", el).addEventListener("input", draw); $("#b6th", el).addEventListener("input", draw);
  draw();
};

/* 6.3 what blood is made of */
W.b6blood = (el) => {
  const row = (a, b) => `<span class="muted">${a}:</span> ${b}<br>`;
  const K = {
    plasma: [L2("Plasma", "রক্তরস"), row(L2("Share of blood", "রক্তের অংশ"), L2("about 55%", "প্রায় ৫৫%")) + row(L2("What it is", "কী"), L2("pale yellow liquid, mostly water", "হালকা হলুদ তরল, বেশির ভাগই পানি")) + row(L2("Dissolved in it", "এতে দ্রবীভূত"), L2("proteins (albumin, globulin, fibrinogen), glucose, fats, salts, vitamins, hormones, antibodies, wastes", "প্রোটিন (অ্যালবুমিন, গ্লোবিউলিন, ফাইব্রিনোজেন), গ্লুকোজ, চর্বি, লবণ, ভিটামিন, হরমোন, অ্যান্টিবডি, বর্জ্য")) + row(L2("Work", "কাজ"), L2("carries food, CO₂, wastes, hormones and heat", "খাদ্য, CO₂, বর্জ্য, হরমোন ও তাপ বহন করে"))],
    rbc: [L2("Red blood cells (RBC)", "লোহিত রক্তকোষ (RBC)"), row(L2("Number", "সংখ্যা"), L2("about 5 million per mm³", "প্রতি mm³-এ প্রায় ৫০ লক্ষ")) + row(L2("Life span", "আয়ু"), L2("about 120 days", "প্রায় ১২০ দিন")) + row(L2("Nucleus", "নিউক্লিয়াস"), L2("none; biconcave disc full of haemoglobin", "নেই; হিমোগ্লোবিনে ভরা দ্বিঅবতল চাকতি")) + row(L2("Made in", "তৈরি হয়"), L2("red bone marrow", "লাল অস্থিমজ্জায়")) + row(L2("Work", "কাজ"), L2("carry oxygen as oxyhaemoglobin", "অক্সিহিমোগ্লোবিনরূপে অক্সিজেন বহন"))],
    wbc: [L2("White blood cells (WBC)", "শ্বেত রক্তকোষ (WBC)"), row(L2("Number", "সংখ্যা"), L2("4–10 thousand per mm³", "প্রতি mm³-এ ৪–১০ হাজার")) + row(L2("Life span", "আয়ু"), L2("1–15 days", "১–১৫ দিন")) + row(L2("Nucleus", "নিউক্লিয়াস"), L2("present; no haemoglobin; shape changes like Amoeba", "আছে; হিমোগ্লোবিন নেই; অ্যামিবার মতো আকার বদলায়")) + row(L2("Kinds", "প্রকার"), L2("lymphocyte, monocyte, neutrophil, eosinophil, basophil", "লিম্ফোসাইট, মনোসাইট, নিউট্রোফিল, ইওসিনোফিল, বেসোফিল")) + row(L2("Work", "কাজ"), L2("swallow germs (phagocytosis) and make antibodies", "জীবাণু গিলে ফেলা (ফ্যাগোসাইটোসিস) ও অ্যান্টিবডি তৈরি"))],
    plt: [L2("Platelets", "অণুচক্রিকা"), row(L2("Number", "সংখ্যা"), L2("about 2.5 lakh (250 000) per mm³", "প্রতি mm³-এ প্রায় আড়াই লাখ")) + row(L2("Life span", "আয়ু"), L2("5–10 days", "৫–১০ দিন")) + row(L2("Nucleus", "নিউক্লিয়াস"), L2("none; tiny pieces of large bone-marrow cells", "নেই; অস্থিমজ্জার বড় কোষের ক্ষুদ্র খণ্ড")) + row(L2("Work", "কাজ"), L2("start blood clotting: thromboplastin → thrombin → fibrin net", "রক্ত তঞ্চন শুরু করে: থ্রম্বোপ্লাস্টিন → থ্রম্বিন → ফাইব্রিনের জাল"))] };
  const RB = [[212, 84], [244, 62], [280, 58], [312, 84], [328, 118], [308, 152], [276, 172], [250, 184], [204, 146], [196, 114], [230, 102], [294, 100], [264, 130], [222, 126], [298, 128]];
  const WB = [[262, 96, 16], [234, 154, 15]];
  const PL = [[302, 176], [320, 142], [252, 152], [282, 148], [206, 100], [226, 72], [300, 68]];
  let sel = "plasma";
  el.innerHTML = `<div class="chipset b6bk" role="group">${Object.keys(K).map((k, n) => `<button data-k="${k}" aria-pressed="${n === 0}">${K[k][0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="b6bs" style="margin-top:8px"></div><div class="w-out" id="b6bo" style="margin-top:8px"></div>`;
  const draw = () => {
    const on = k => k === sel;
    const lab = (k, x, y, t) => `<text data-k="${k}" x="${x}" y="${y}" font-size="13" text-anchor="start" fill="${on(k) ? "var(--bad)" : "var(--ink)"}" font-weight="${on(k) ? 700 : 400}" style="cursor:pointer">${t}</text>`;
    let s = `<svg viewBox="0 0 360 226" role="img" aria-label="${L2("A tube of separated blood and blood cells under the microscope", "আলাদা হয়ে যাওয়া রক্তের নল ও অণুবীক্ষণে রক্তকোষ")}"><defs><clipPath id="b6bc"><path d="M18 14 V196 a18 18 0 0 0 36 0 V14 Z"/></clipPath><clipPath id="b6bm"><circle cx="262" cy="120" r="86"/></clipPath></defs>`;
    s += `<g clip-path="url(#b6bc)"><rect data-k="plasma" x="18" y="24" width="36" height="104" fill="${PLASMA6}" style="cursor:pointer"/><rect data-k="wbc" x="18" y="128" width="36" height="7" fill="#e9e6da" style="cursor:pointer"/><rect data-k="rbc" x="18" y="135" width="36" height="84" fill="#a9261f" style="cursor:pointer"/></g>`;
    s += `<path d="M18 14 V196 a18 18 0 0 0 36 0 V14" fill="none" stroke="var(--ink)" stroke-width="2"/><ellipse cx="36" cy="14" rx="20" ry="4" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    if (on("plasma")) s += `<rect x="20" y="25" width="32" height="102" fill="none" stroke="var(--bad)" stroke-width="3"/>`;
    if (on("rbc")) s += `<path d="M20 136 V196 a16 16 0 0 0 32 0 V136 Z" fill="none" stroke="var(--bad)" stroke-width="3"/>`;
    if (on("wbc") || on("plt")) s += `<rect x="20" y="127" width="32" height="9" fill="none" stroke="var(--bad)" stroke-width="3"/>`;
    s += lab("plasma", 64, 70, L2("plasma", "রক্তরস")) + lab("plasma", 64, 86, L2("≈ 55%", "≈ ৫৫%")) + `<line x1="54" y1="131" x2="62" y2="124" stroke="var(--ink)" stroke-width="1"/>` + lab("wbc", 64, 122, L2("white cells,", "শ্বেত রক্তকোষ,")) + lab("plt", 64, 137, L2("platelets", "অণুচক্রিকা")) + lab("rbc", 64, 176, L2("red cells", "লোহিত রক্তকোষ")) + lab("rbc", 64, 192, L2("≈ 45%", "≈ ৪৫%"));
    s += T6(262, 20, L2("under the microscope", "অণুবীক্ষণে"), "middle", 13, "var(--muted)");
    s += `<circle data-k="plasma" cx="262" cy="120" r="86" fill="${PLASMA6}" fill-opacity=".55" stroke="${on("plasma") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("plasma") ? 4 : 2}" style="cursor:pointer"/><g clip-path="url(#b6bm)">`;
    s += RB.map(([x, y]) => `<g data-k="rbc" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="11" fill="#cf4a3f" stroke="${on("rbc") ? "var(--bad)" : "#8e2019"}" stroke-width="${on("rbc") ? 3 : 1.2}"/><circle cx="${x}" cy="${y}" r="5" fill="#e68c84"/></g>`).join("");
    s += WB.map(([x, y, r], n) => `<g data-k="wbc" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="${r}" fill="#dcd6ef" stroke="${on("wbc") ? "var(--bad)" : "#6a5ea6"}" stroke-width="${on("wbc") ? 3.5 : 1.5}"/>${n === 0 ? `<path d="M${x - 8} ${y - 3} q4 -8 9 -2 q6 -4 7 4 q-3 8 -9 4 q-7 3 -7 -6 z" fill="#5b4a9e"/>` : `<circle cx="${x + 1}" cy="${y}" r="9" fill="#5b4a9e"/>`}</g>`).join("");
    s += PL.map(([x, y]) => `<g data-k="plt" style="cursor:pointer"><ellipse cx="${x}" cy="${y}" rx="4.5" ry="3.2" fill="#9a6fb5" stroke="${on("plt") ? "var(--bad)" : "#5b3a78"}" stroke-width="${on("plt") ? 3 : 1}"/></g>`).join("") + `</g></svg>`;
    $("#b6bs", el).innerHTML = s;
    $("#b6bo", el).innerHTML = `<b>${K[sel][0]}</b><br>${K[sel][1]}`;
    el.querySelectorAll(".b6bk button").forEach(b => b.setAttribute("aria-pressed", b.dataset.k === sel));
    el.querySelectorAll("#b6bs [data-k]").forEach(g => g.addEventListener("click", (e) => { e.stopPropagation(); sel = g.dataset.k; draw(); }));
  };
  chips6(el, ".b6bk", b => { sel = b.dataset.k; draw(); });
  draw();
};

/* 6.3.2 blood groups: donor antigens meet patient antibodies */
W.b6group = (el) => {
  const G = ["A", "B", "AB", "O"];
  let d = { g: "A", r: "+" }, p = { g: "B", r: "+" };
  const row = (cls, who, cur) => `<div class="w-row" style="margin:4px 0"><span class="hint" style="min-width:4.2em">${who}:</span><div class="chipset ${cls}" role="group">${G.map(g => `<button data-g="${g}" aria-pressed="${g === cur.g}">${g}</button>`).join("")}</div><div class="chipset ${cls}r" role="group"><button data-r="+" aria-pressed="${cur.r === "+"}">Rh+</button><button data-r="−" aria-pressed="${cur.r !== "+"}">Rh−</button></div></div>`;
  el.innerHTML = row("b6gd", L2("Donor", "দাতা"), d) + row("b6gp", L2("Patient", "রোগী"), p) + `<div class="svgwrap fit" id="b6gs" style="margin-top:6px"></div><div class="w-out" id="b6go" style="margin-top:8px"></div>`;
  const tri = (x, y, a, sz = 7) => { const c = Math.cos(a), q = Math.sin(a); return `<polygon points="${(x + c * sz * 1.6).toFixed(1)},${(y + q * sz * 1.6).toFixed(1)} ${(x - q * sz).toFixed(1)},${(y + c * sz).toFixed(1)} ${(x + q * sz).toFixed(1)},${(y - c * sz).toFixed(1)}" fill="${DEO6}" stroke="var(--ink)" stroke-width="1.2"/>`; };
  const sq = (x, y, a, sz = 6) => `<rect x="${(x - sz).toFixed(1)}" y="${(y - sz).toFixed(1)}" width="${sz * 2}" height="${sz * 2}" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${SUGAR6}" stroke="var(--ink)" stroke-width="1.2"/>`;
  const Y = (x, y, col, t) => `<path d="M${x} ${y + 12} V${y} M${x} ${y} l-8 -10 M${x} ${y} l8 -10" fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>` + (t ? T6(x + 11, y + 10, t, "start", 13, "var(--ink)", "700") : "");
  const draw = () => {
    const dA = d.g.includes("A"), dB = d.g.includes("B"), dR = d.r === "+";
    const pA = p.g.includes("A"), pB = p.g.includes("B"), pR = p.r === "+";
    const badA = dA && !pA, badB = dB && !pB, badR = dR && !pR, ok = !(badA || badB || badR);
    let s = `<svg viewBox="0 0 360 208" role="img" aria-label="${L2("Donor red cell antigens and patient plasma antibodies", "দাতার লোহিত রক্তকোষের অ্যান্টিজেন ও রোগীর রক্তরসের অ্যান্টিবডি")}">`;
    s += T6(86, 18, `${L2("Donor", "দাতা")}: ${d.g}${d.r}`, "middle", 15, "var(--ink)", "700") + T6(86, 35, L2("red blood cell", "লোহিত রক্তকোষ"), "middle", 13, "var(--muted)");
    s += T6(274, 18, `${L2("Patient", "রোগী")}: ${p.g}${p.r}`, "middle", 15, "var(--ink)", "700") + T6(274, 35, L2("plasma", "রক্তরস"), "middle", 13, "var(--muted)");
    s += `<circle cx="86" cy="104" r="40" fill="${OXY6}" stroke="#8e2019" stroke-width="2"/><circle cx="86" cy="104" r="17" fill="#e68c84"/>`;
    if (dA) s += [0, 90, 180, 270].map(a => { const r = a * Math.PI / 180; return tri(86 + 43 * Math.cos(r), 104 + 43 * Math.sin(r), r); }).join("");
    if (dB) s += [45, 135, 225, 315].map(a => { const r = a * Math.PI / 180; return sq(86 + 47 * Math.cos(r), 104 + 47 * Math.sin(r), r); }).join("");
    if (dR) s += [22, 112, 202, 292].map(a => { const r = a * Math.PI / 180; return `<circle cx="${(86 + 45 * Math.cos(r)).toFixed(1)}" cy="${(104 + 45 * Math.sin(r)).toFixed(1)}" r="5" fill="${RH6}" stroke="var(--ink)" stroke-width="1.2"/>`; }).join("");
    const ag = [dA ? "A" : "", dB ? "B" : "", dR ? "Rh" : ""].filter(Boolean).join(", ");
    s += T6(86, 174, ag ? L2(`antigens: ${ag}`, `অ্যান্টিজেন: ${ag}`) : L2("no A, B or Rh antigen", "A, B বা Rh অ্যান্টিজেন নেই"), "middle", 13);
    s += `<rect x="204" y="46" width="140" height="112" rx="12" fill="${PLASMA6}" fill-opacity=".5" stroke="var(--ink)" stroke-width="1.5"/>`;
    if (!pA) s += Y(224, 76, DEO6, "a") + Y(296, 68, DEO6, "a") + Y(262, 126, DEO6, "a");
    if (!pB) s += Y(254, 84 - (pA ? 0 : -8), SUGAR6, "b") + Y(318, 112, SUGAR6, "b") + Y(222, 128, SUGAR6, "b");
    if (pA && pB) s += T6(274, 98, L2("no antibody", "a বা b অ্যান্টিবডি"), "middle", 13) + T6(274, 114, L2("a or b", "নেই"), "middle", 13);
    s += T6(274, 174, pR ? L2("Rh+: can take Rh+ or Rh−", "Rh+: Rh+ বা Rh− নিতে পারে") : L2("Rh−: must not get Rh+", "Rh−: Rh+ রক্ত চলবে না"), "middle", 13);
    s += T6(141, 111, "→", "middle", 20, "var(--muted)") + `<circle cx="170" cy="104" r="17" fill="${ok ? "var(--good)" : "var(--bad)"}"/>` + T6(170, 112, ok ? "✓" : "✗", "middle", 22, "var(--sheet)", "700") + T6(197, 111, "→", "middle", 20, "var(--muted)");
    s += tri(22, 196, -Math.PI / 2, 5) + T6(32, 201, L2("antigen A", "A অ্যান্টিজেন"), "start", 12) + sq(124, 196, 0, 5) + T6(134, 201, L2("antigen B", "B অ্যান্টিজেন"), "start", 12) + `<circle cx="226" cy="196" r="5" fill="${RH6}" stroke="var(--ink)" stroke-width="1.2"/>` + T6(235, 201, "Rh", "start", 12) + Y(272, 194, "var(--ink)", "") + T6(285, 201, L2("antibody", "অ্যান্টিবডি"), "start", 12);
    $("#b6gs", el).innerHTML = s + `</svg>`;
    let o;
    if (ok) o = `<b style="color:var(--good)">${L2("Compatible.", "মিলেছে।")}</b> ${L2("No antigen on the donor's red cells meets an antibody that attacks it in the patient's plasma.", "দাতার লোহিত রক্তকোষের কোনো অ্যান্টিজেনই রোগীর রক্তরসে তাকে আক্রমণ করার মতো অ্যান্টিবডি পাচ্ছে না।")}`;
    else {
      o = `<b style="color:var(--bad)">${L2("Not compatible.", "মেলেনি।")}</b> `;
      const why = [];
      if (badA) why.push(L2("the donor's antigen A meets the patient's antibody a", "দাতার A অ্যান্টিজেন রোগীর a অ্যান্টিবডির সামনে পড়ে"));
      if (badB) why.push(L2("the donor's antigen B meets the patient's antibody b", "দাতার B অ্যান্টিজেন রোগীর b অ্যান্টিবডির সামনে পড়ে"));
      if (badR) why.push(L2("Rh positive blood cannot be given to an Rh negative patient", "Rh পজিটিভ রক্ত Rh নেগেটিভ রোগীকে দেওয়া যায় না"));
      const w0 = why.join("; "); o += w0.charAt(0).toUpperCase() + w0.slice(1) + L2(". The donor's red cells would clump and break down.", "। দাতার লোহিত রক্তকোষ দলা পাকিয়ে ভেঙে যাবে।");
    }
    o += `<br><span class="muted">${L2("In a hospital, cross-matching and screening are always done as well, whatever the groups.", "হাসপাতালে গ্রুপ যা-ই হোক, ক্রস ম্যাচিং ও স্ক্রিনিং সবসময়ই করা হয়।")}</span>`;
    $("#b6go", el).innerHTML = o;
  };
  const bind = (cls, obj) => { chips6(el, "." + cls, b => { obj.g = b.dataset.g; draw(); }); chips6(el, "." + cls + "r", b => { obj.r = b.dataset.r === "+" ? "+" : "−"; draw(); }); };
  bind("b6gd", d); bind("b6gp", p);
  draw();
};

/* 6.4 the heart and the double circulation (schematic) */
W.b6heart = (el) => {
  const NM = { vc: L2("Venae cavae", "মহাশিরা"), ra: L2("Right atrium", "ডান অলিন্দ"), tv: L2("Tricuspid valve", "ট্রাইকাসপিড কপাটিকা"), rv: L2("Right ventricle", "ডান নিলয়"), pa: L2("Pulmonary artery", "ফুসফুসীয় ধমনি"), lungs: L2("Lungs", "ফুসফুস"), pv: L2("Pulmonary veins", "ফুসফুসীয় শিরা"), la: L2("Left atrium", "বাম অলিন্দ"), bv: L2("Bicuspid valve", "বাইকাসপিড কপাটিকা"), lv: L2("Left ventricle", "বাম নিলয়"), ao: L2("Aorta", "মহাধমনি"), body: L2("Body", "দেহ") };
  const S = [
    [["vc", "ra"], L2("Venae cavae → right atrium", "মহাশিরা → ডান অলিন্দ"), L2("The atria relax. Blood rich in CO₂ comes back from the body through the superior and inferior venae cavae and fills the right atrium.", "অলিন্দ প্রসারিত হয়। দেহ থেকে CO₂-যুক্ত রক্ত ঊর্ধ্ব ও নিম্ন মহাশিরা দিয়ে ফিরে এসে ডান অলিন্দ ভরে।")],
    [["ra", "tv", "rv"], L2("Right atrium → right ventricle", "ডান অলিন্দ → ডান নিলয়"), L2("The atria contract. The tricuspid valve (three flaps) opens and the blood passes down into the right ventricle. Then the valve shuts, so it cannot go back.", "অলিন্দ সংকুচিত হয়। ট্রাইকাসপিড কপাটিকা (তিন পাল্লার) খুলে যায়, রক্ত নিচের ডান নিলয়ে নামে। এরপর কপাটিকা বন্ধ হয়, তাই রক্ত ফিরতে পারে না।")],
    [["rv", "pa"], L2("Right ventricle → pulmonary artery", "ডান নিলয় → ফুসফুসীয় ধমনি"), L2("The ventricles contract. The right ventricle pushes the blood past a semilunar valve into the pulmonary artery, which carries it to the lungs. This is the one artery with CO₂-rich blood.", "নিলয় সংকুচিত হয়। ডান নিলয় রক্তকে অর্ধচন্দ্রাকার কপাটিকা পেরিয়ে ফুসফুসীয় ধমনিতে ঠেলে দেয়, যা তা ফুসফুসে নেয়। এটিই একমাত্র ধমনি, যাতে CO₂-যুক্ত রক্ত থাকে।")],
    [["lungs"], L2("In the lungs", "ফুসফুসে"), L2("In the capillaries of the lungs the blood gives up CO₂ and takes in oxygen. It is now oxygen-rich.", "ফুসফুসের কৈশিক জালিকায় রক্ত CO₂ ছেড়ে অক্সিজেন নেয়। এখন এটি অক্সিজেনযুক্ত রক্ত।")],
    [["pv", "la"], L2("Pulmonary veins → left atrium", "ফুসফুসীয় শিরা → বাম অলিন্দ"), L2("The pulmonary veins bring the oxygen-rich blood back to the left atrium. These are the only veins with oxygen-rich blood. (This happens at the same time as step 1.)", "ফুসফুসীয় শিরা অক্সিজেনযুক্ত রক্ত বাম অলিন্দে ফিরিয়ে আনে। শুধু এই শিরাতেই অক্সিজেনযুক্ত রক্ত থাকে। (এটি ১ নম্বর ধাপের সাথে একই সময়ে ঘটে।)")],
    [["la", "bv", "lv"], L2("Left atrium → left ventricle", "বাম অলিন্দ → বাম নিলয়"), L2("The atria contract. The bicuspid (mitral) valve, with two flaps, opens and the blood passes into the left ventricle. Then it shuts. (Same time as step 2.)", "অলিন্দ সংকুচিত হয়। দুই পাল্লার বাইকাসপিড (মাইট্রাল) কপাটিকা খুলে যায়, রক্ত বাম নিলয়ে ঢোকে। তারপর তা বন্ধ হয়। (২ নম্বর ধাপের সাথে একই সময়ে।)")],
    [["lv", "ao"], L2("Left ventricle → aorta", "বাম নিলয় → মহাধমনি"), L2("The ventricles contract. The thick-walled left ventricle pushes the blood past a semilunar valve into the aorta, the largest artery, which sends it to the whole body. (Same time as step 3.)", "নিলয় সংকুচিত হয়। পুরু প্রাচীরের বাম নিলয় রক্তকে অর্ধচন্দ্রাকার কপাটিকা পেরিয়ে সবচেয়ে বড় ধমনি মহাধমনিতে ঠেলে দেয়, যা তা সারা দেহে পাঠায়। (৩ নম্বর ধাপের সাথে একই সময়ে।)")],
    [["body"], L2("In the body", "দেহে"), L2("In the capillaries of the organs the blood gives oxygen and food to the cells and collects CO₂ and wastes. It returns through the veins, and the round begins again.", "অঙ্গগুলোর কৈশিক জালিকায় রক্ত কোষকে অক্সিজেন ও খাদ্য দেয় আর CO₂ ও বর্জ্য সংগ্রহ করে। শিরা দিয়ে তা ফিরে আসে, আর চক্রটি আবার শুরু হয়।")]];
  let i = 0;
  el.innerHTML = `<div class="svgwrap fit" id="b6hs"></div>
    <div class="w-row" style="margin:8px 0"><button class="btn" data-d="-1">← ${L2("Back", "আগের ধাপ")}</button><span class="hint" id="b6hn"></span><button class="btn solid" data-d="1">${L2("Next", "পরের ধাপ")} →</button></div>
    <div class="w-out" id="b6ho"></div>
    <p class="hint" style="margin:6px 0 0">${L2("This is a simplified diagram, drawn as if the person is facing you: the heart's right side is on your left.", "এটি সরল করে আঁকা চিত্র, যেন মানুষটি তোমার দিকে মুখ করে আছে: হৃৎপিণ্ডের ডান পাশ তোমার বাঁ দিকে।")}</p>`;
  const draw = () => {
    const act = S[i][0], on = k => act.includes(k);
    const ves = (k, d, col) => `<path data-k="${k}" d="${d}" fill="none" stroke="${col}" stroke-width="${on(k) ? 14 : 10}" stroke-linejoin="round" stroke-linecap="butt" opacity="${on(k) ? 1 : 0.5}" style="cursor:pointer"/>`;
    const chev = (x, y, a) => `<polygon points="-4,-4.5 5,0 -4,4.5" transform="translate(${x} ${y}) rotate(${a})" fill="var(--sheet)"/>`;
    const cham = (k, d, col) => `<path data-k="${k}" d="${d}" fill="${col}" fill-opacity="${on(k) ? ".85" : ".4"}" stroke="${on(k) ? "var(--ink)" : col}" stroke-width="${on(k) ? 2.5 : 1.5}" style="cursor:pointer"/>`;
    const two = (k, x, y, a, b) => `<text data-k="${k}" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="${on(k) ? 700 : 400}" style="cursor:pointer"><tspan x="${x}" y="${y}">${a}</tspan><tspan x="${x}" y="${y + 14}">${b}</tspan></text>`;
    const rot = (k, x, y, t) => `<text data-k="${k}" x="${x}" y="${y}" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="${on(k) ? 700 : 400}" transform="rotate(-90 ${x} ${y})" style="cursor:pointer">${t}</text>`;
    let s = `<svg viewBox="0 0 360 330" role="img" aria-label="${L2("Simplified diagram of the heart, the lungs and the body with the path of blood", "হৃৎপিণ্ড, ফুসফুস ও দেহের সরল চিত্র, সাথে রক্তের পথ")}">`;
    s += `<circle cx="14" cy="16" r="6" fill="${DEO6}"/>` + T6(25, 20, L2("CO₂-rich blood", "CO₂-যুক্ত রক্ত"), "start", 13) + `<circle cx="14" cy="34" r="6" fill="${OXY6}"/>` + T6(25, 38, L2("O₂-rich blood", "O₂-যুক্ত রক্ত"), "start", 13);
    /* vessels outside the heart */
    s += ves("vc", "M120 304 H56 V128 H104", DEO6) + chev(88, 304, 180) + chev(56, 250, -90) + chev(56, 180, -90) + chev(82, 128, 0);
    s += ves("pv", "M240 28 H304 V128 H256", OXY6) + chev(272, 28, 0) + chev(304, 80, 90) + chev(280, 128, 180);
    s += ves("ao", "M228 214 L262 220 H304 V304 H240", OXY6) + chev(286, 220, 0) + chev(304, 262, 90) + chev(270, 304, 180);
    /* heart muscle */
    s += `<path d="M180 96 C 148 80 88 84 84 130 C 80 196 128 246 180 270 C 232 246 280 196 276 130 C 272 84 212 80 180 96 Z" fill="#d98f84" fill-opacity=".55" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += ves("vc", "M84 128 H104", DEO6) + ves("pv", "M276 128 H256", OXY6) + ves("ao", "M228 214 L262 220 H280", OXY6);
    s += cham("ra", "M112 108 H154 Q166 108 166 120 V150 H100 V120 Q100 108 112 108 Z", DEO6) + cham("rv", "M102 166 H166 V224 Q158 236 146 232 Q112 220 102 166 Z", DEO6);
    s += cham("la", "M206 108 H248 Q260 108 260 120 V150 H194 V120 Q194 108 206 108 Z", OXY6) + cham("lv", "M200 166 H238 V200 Q234 226 218 230 Q202 222 200 166 Z", OXY6);
    /* valves between atria and ventricles */
    s += `<g data-k="tv" style="cursor:pointer"><rect x="120" y="149" width="28" height="18" fill="${DEO6}" fill-opacity="${on("tv") ? ".85" : ".4"}"/><path d="M120 150 L131 165 M148 150 L137 165" stroke="var(--ink)" stroke-width="${on("tv") ? 3.5 : 2}" fill="none" stroke-linecap="round"/></g>`;
    s += `<g data-k="bv" style="cursor:pointer"><rect x="207" y="149" width="26" height="18" fill="${OXY6}" fill-opacity="${on("bv") ? ".85" : ".4"}"/><path d="M207 150 L217 165 M233 150 L223 165" stroke="var(--ink)" stroke-width="${on("bv") ? 3.5 : 2}" fill="none" stroke-linecap="round"/></g>`;
    /* pulmonary artery leaves the right ventricle and runs up between the atria */
    s += ves("pa", "M156 178 L180 160 V48", DEO6) + chev(180, 132, -90) + chev(180, 74, -90);
    s += `<path d="M173 156 q7 -8 14 0" stroke="var(--ink)" stroke-width="2" fill="none"/><path d="M252 211 q8 7 -1 15" stroke="var(--ink)" stroke-width="2" fill="none"/>`;
    /* lungs and body */
    s += `<g data-k="lungs" style="cursor:pointer"><rect x="120" y="8" width="120" height="40" rx="16" fill="var(--paper)" stroke="${on("lungs") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("lungs") ? 3.5 : 1.5}"/>${T6(180, 33, NM.lungs, "middle", 14, "var(--ink)", "700")}</g>`;
    s += `<g data-k="body" style="cursor:pointer"><rect x="120" y="286" width="120" height="36" rx="14" fill="var(--paper)" stroke="${on("body") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("body") ? 3.5 : 1.5}"/>${T6(180, 309, NM.body, "middle", 14, "var(--ink)", "700")}</g>`;
    /* labels */
    s += two("ra", 133, 126, L2("Right", "ডান"), L2("atrium", "অলিন্দ")) + two("la", 227, 126, L2("Left", "বাম"), L2("atrium", "অলিন্দ")) + two("rv", 130, 190, L2("Right", "ডান"), L2("ventricle", "নিলয়")) + two("lv", 219, 184, L2("Left", "বাম"), L2("ventricle", "নিলয়"));
    s += rot("vc", 38, 216, NM.vc) + rot("pv", 324, 78, NM.pv) + rot("ao", 324, 262, NM.ao);
    s += `<text data-k="pa" font-size="13" text-anchor="end" fill="var(--ink)" font-weight="${on("pa") ? 700 : 400}" style="cursor:pointer"><tspan x="168" y="66">${L2("pulmonary", "ফুসফুসীয়")}</tspan><tspan x="168" y="80">${L2("artery", "ধমনি")}</tspan></text>`;
    $("#b6hs", el).innerHTML = s + `</svg>`;
    $("#b6hn", el).textContent = L2(`Step ${i + 1} of ${S.length}`, `ধাপ ${B6(i + 1)} / ${B6(S.length)}`);
    $("#b6ho", el).innerHTML = `<b>${B6(i + 1)}. ${S[i][1]}</b><br>${S[i][2]}`;
    el.querySelectorAll("#b6hs [data-k]").forEach(g => g.addEventListener("click", () => { const n = S.findIndex(q => q[0].includes(g.dataset.k)); if (n >= 0) { i = n; draw(); } }));
  };
  el.querySelectorAll("button[data-d]").forEach(b => b.addEventListener("click", () => { i = (i + +b.dataset.d + S.length) % S.length; draw(); }));
  draw();
};

/* 6.4.3 artery, vein and capillary compared */
W.b6vessel = (el) => {
  const li = a => `<ul style="margin:4px 0 0;padding-left:20px">${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
  const V = {
    art: [L2("Artery", "ধমনি"), li([L2("Carries blood away from the heart.", "হৃৎপিণ্ড থেকে রক্ত দূরে নিয়ে যায়।"), L2("Wall: thick, elastic and muscular, in three layers (tunica externa, media, interna).", "প্রাচীর: পুরু, স্থিতিস্থাপক ও পেশিময়; তিন স্তর (টিউনিকা এক্সটার্না, মিডিয়া, ইন্টারনা)।"), L2("Lumen: narrow. Valves: none.", "নালিপথ: সরু। কপাটিকা: নেই।"), L2("Blood: usually oxygen-rich, under high pressure, moving in waves, so a pulse is felt.", "রক্ত: সাধারণত অক্সিজেনসমৃদ্ধ, বেশি চাপে ঢেউয়ের মতো চলে, তাই নাড়িস্পন্দন টের পাওয়া যায়।"), L2("Exception: the pulmonary artery carries CO₂-rich blood.", "ব্যতিক্রম: ফুসফুসীয় ধমনি CO₂-সমৃদ্ধ রক্ত বহন করে।")])],
    vein: [L2("Vein", "শিরা"), li([L2("Carries blood towards the heart.", "হৃৎপিণ্ডের দিকে রক্ত নিয়ে আসে।"), L2("Wall: thin, less elastic and less muscular, though it also has three layers.", "প্রাচীর: পাতলা, কম স্থিতিস্থাপক ও কম পেশিময়, যদিও এতেও তিনটি স্তর।"), L2("Lumen: wide. Valves: present, so blood cannot flow backwards.", "নালিপথ: চওড়া। কপাটিকা: আছে, তাই রক্ত পেছনে ফিরতে পারে না।"), L2("Blood: usually CO₂-rich, under low pressure; no pulse.", "রক্ত: সাধারণত CO₂-সমৃদ্ধ, কম চাপে চলে; নাড়িস্পন্দন নেই।"), L2("Exception: the pulmonary veins carry oxygen-rich blood.", "ব্যতিক্রম: ফুসফুসীয় শিরা অক্সিজেনসমৃদ্ধ রক্ত বহন করে।")])],
    cap: [L2("Capillary", "কৈশিক জালিকা"), li([L2("Joins the smallest artery to the smallest vein.", "সবচেয়ে ছোট ধমনিকে সবচেয়ে ছোট শিরার সাথে যুক্ত করে।"), L2("Wall: only one cell thick. No muscle, no valves.", "প্রাচীর: মাত্র এক স্তর কোষের। পেশি নেই, কপাটিকা নেই।"), L2("So narrow that red blood cells pass in single file.", "এত সরু যে লোহিত রক্তকোষ এক সারিতে একটি একটি করে যায়।"), L2("Oxygen and food diffuse out to the cells; CO₂ and wastes diffuse in. This is where the exchange happens.", "অক্সিজেন ও খাদ্য ব্যাপিত হয়ে কোষে যায়; CO₂ ও বর্জ্য রক্তে আসে। আদান-প্রদান হয় এখানেই।"), L2("In the picture it is drawn much larger than it really is.", "ছবিতে একে আসল মাপের চেয়ে অনেক বড় করে আঁকা হয়েছে।")])] };
  let sel = "art";
  el.innerHTML = `<div class="chipset b6vk" role="group">${Object.keys(V).map((k, n) => `<button data-k="${k}" aria-pressed="${n === 0}">${V[k][0]}</button>`).join("")}</div>
    <div class="svgwrap fit" id="b6vs" style="margin-top:8px"></div><div class="w-out" id="b6vo" style="margin-top:8px"></div>`;
  const draw = () => {
    const on = k => k === sel, ring = k => on(k) ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.5"`;
    let s = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("Cross-sections and side views of an artery, a vein and a capillary", "ধমনি, শিরা ও কৈশিক জালিকার প্রস্থচ্ছেদ ও পাশ থেকে দেখা চিত্র")}">${arrowDefs("b6va", "var(--ink)")}${arrowDefs("b6vb", "var(--sheet)")}`;
    s += T6(8, 14, L2("Cut across", "প্রস্থচ্ছেদ"), "start", 13, "var(--muted)") + T6(8, 164, L2("From the side", "পাশ থেকে"), "start", 13, "var(--muted)");
    /* artery */
    s += `<g data-k="art" style="cursor:pointer"><circle cx="62" cy="74" r="46" fill="#e7c9a3" ${ring("art")}/><circle cx="62" cy="74" r="40" fill="#d98f84" stroke="var(--ink)" stroke-width="1"/><circle cx="62" cy="74" r="25" fill="#f3e3c8" stroke="var(--ink)" stroke-width="1"/><circle cx="62" cy="74" r="22" fill="${OXY6}"/>`;
    s += `<rect x="14" y="172" width="96" height="40" fill="#d98f84" ${ring("art")}/><rect x="14" y="184" width="96" height="16" fill="${OXY6}"/>${AR6(28, 192, 98, 192, "b6vb", "var(--sheet)", 2.5)}</g>`;
    /* vein */
    s += `<g data-k="vein" style="cursor:pointer"><circle cx="180" cy="74" r="46" fill="#e7c9a3" ${ring("vein")}/><circle cx="180" cy="74" r="41" fill="#d98f84" stroke="var(--ink)" stroke-width="1"/><circle cx="180" cy="74" r="36" fill="#f3e3c8" stroke="var(--ink)" stroke-width="1"/><ellipse cx="180" cy="74" rx="34" ry="32" fill="${DEO6}"/>`;
    s += `<rect x="132" y="172" width="96" height="40" fill="#d98f84" ${ring("vein")}/><rect x="132" y="178" width="96" height="28" fill="${DEO6}"/><path d="M168 178 L186 190 M168 206 L186 194" stroke="var(--sheet)" stroke-width="3" stroke-linecap="round"/>${AR6(140, 192, 162, 192, "b6vb", "var(--sheet)", 2.5)}${AR6(194, 192, 220, 192, "b6vb", "var(--sheet)", 2.5)}</g>`;
    /* capillary */
    s += `<g data-k="cap" style="cursor:pointer"><circle cx="298" cy="74" r="46" fill="none" stroke="var(--rule)" stroke-width="1" stroke-dasharray="3 4"/><circle cx="298" cy="74" r="15" fill="#f3e3c8" ${ring("cap")}/><circle cx="298" cy="74" r="10" fill="${OXY6}"/>`;
    s += `<rect x="250" y="176" width="96" height="20" rx="3" fill="#f3e3c8" ${ring("cap")}/>${[262, 284, 306, 328].map(x => `<ellipse cx="${x}" cy="186" rx="7" ry="5.5" fill="${OXY6}"/>`).join("")}</g>`;
    s += AR6(272, 200, 272, 216, "b6va", "var(--ink)", 1.8) + AR6(322, 218, 322, 202, "b6va", "var(--ink)", 1.8) + T6(272, 232, "O₂", "middle", 13) + T6(322, 232, "CO₂", "middle", 13);
    s += [["art", 62], ["vein", 180], ["cap", 298]].map(([k, x]) => `<text data-k="${k}" x="${x}" y="142" font-size="15" text-anchor="middle" fill="${on(k) ? "var(--bad)" : "var(--ink)"}" font-weight="700" style="cursor:pointer">${V[k][0]}</text>`).join("");
    s += T6(62, 230, L2("thick wall, no valve", "পুরু প্রাচীর, কপাটিকা নেই"), "middle", LANG === "bn" ? 13 : 12) + T6(180, 230, L2("thin wall, valve", "পাতলা প্রাচীর, কপাটিকা"), "middle", LANG === "bn" ? 13 : 12);
    $("#b6vs", el).innerHTML = s + `</svg>`;
    $("#b6vo", el).innerHTML = `<b>${V[sel][0]}</b>${V[sel][1]}`;
    el.querySelectorAll(".b6vk button").forEach(b => b.setAttribute("aria-pressed", b.dataset.k === sel));
    el.querySelectorAll("#b6vs [data-k]").forEach(g => g.addEventListener("click", () => { sel = g.dataset.k; draw(); }));
  };
  chips6(el, ".b6vk", b => { sel = b.dataset.k; draw(); });
  draw();
};

/* 6.4.4 blood pressure: what the two numbers mean */
W.b6bp = (el) => {
  el.innerHTML = `<div class="svgwrap fit" id="b6ps2"></div>
    ${slider("b6px", L2("Systolic pressure", "সিস্টোলিক চাপ"), 90, 200, 2, 120, "mmHg")}
    ${slider("b6py", L2("Diastolic pressure", "ডায়াস্টোলিক চাপ"), 50, 120, 2, 80, "mmHg")}
    <div class="w-out" id="b6po2"></div>
    <p class="hint" style="margin:6px 0 0">${L2("For learning only. One reading can never tell whether a person has high blood pressure; that needs repeated measurements by a health worker.", "শুধু শেখার জন্য। একবারের পাঠ দেখে কারও উচ্চ রক্তচাপ আছে কি না বলা যায় না; এর জন্য স্বাস্থ্যকর্মীর বারবার মাপা দরকার।")}</p>`;
  const fix = (moved) => {
    const a = $("#b6px", el), b = $("#b6py", el);
    if (+a.value - +b.value < 20) { if (moved === "s") b.value = Math.max(50, +a.value - 20); else a.value = Math.min(200, +b.value + 20); }
    draw();
  };
  const draw = () => {
    const S = sv(el, "b6px", "mmHg", 0), D = sv(el, "b6py", "mmHg", 0);
    const X0 = 46, X1 = 322, Y = v => 172 - (v - 40) * (158 / 170);
    let s = `<svg viewBox="0 0 360 196" role="img" aria-label="${L2("Pressure in an artery rising and falling with each heartbeat", "প্রতিটি হৃৎস্পন্দনে ধমনির চাপের ওঠানামা")}">${arrowDefs("b6pa2", "var(--ink)")}`;
    s += [40, 80, 120, 160, 200].map(v => `<line x1="${X0}" y1="${Y(v)}" x2="${X1}" y2="${Y(v)}" stroke="var(--rule)" stroke-width="1"/>${T6(X0 - 6, Y(v) + 4, B6(v), "end", 13, "var(--muted)")}`).join("");
    s += `<line x1="${X0}" y1="${Y(210)}" x2="${X0}" y2="${Y(40)}" stroke="var(--ink)" stroke-width="1.5"/><line x1="${X0}" y1="${Y(40)}" x2="${X1}" y2="${Y(40)}" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += T6(X0 + 6, 13, "mmHg", "start", 13, "var(--muted)") + T6(X1, 191, L2("time →", "সময় →"), "end", 13, "var(--muted)");
    const bw = (X1 - X0) / 4; let d = `M${X0} ${Y(D).toFixed(1)}`;
    for (let n = 0; n < 4; n++) { const x = X0 + n * bw, f = q => Y(D + (S - D) * q).toFixed(1); d += ` C${(x + bw * 0.08).toFixed(1)} ${f(0)} ${(x + bw * 0.1).toFixed(1)} ${f(1)} ${(x + bw * 0.2).toFixed(1)} ${f(1)} C${(x + bw * 0.3).toFixed(1)} ${f(1)} ${(x + bw * 0.34).toFixed(1)} ${f(0.5)} ${(x + bw * 0.42).toFixed(1)} ${f(0.46)} C${(x + bw * 0.47).toFixed(1)} ${f(0.56)} ${(x + bw * 0.52).toFixed(1)} ${f(0.5)} ${(x + bw * 0.6).toFixed(1)} ${f(0.3)} C${(x + bw * 0.75).toFixed(1)} ${f(0.08)} ${(x + bw * 0.9).toFixed(1)} ${f(0)} ${(x + bw).toFixed(1)} ${f(0)}`; }
    s += `<line x1="${X0}" y1="${Y(S)}" x2="${X1 + 4}" y2="${Y(S)}" stroke="${OXY6}" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="${X0}" y1="${Y(D)}" x2="${X1 + 4}" y2="${Y(D)}" stroke="${DEO6}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    s += `<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>`;
    s += T6(X1 + 8, Y(S) + 4, B6(S), "start", 13, OXY6, "700") + T6(X1 + 8, Y(D) + 4, B6(D), "start", 13, DEO6, "700");
    const xm = X0 + bw * 1.78;
    s += AR6(xm, Y(D) - 2, xm, Y(S) + 6, "b6pa2", "var(--ink)", 1.8) + AR6(xm, Y(S) + 2, xm, Y(D) - 6, "b6pa2", "var(--ink)", 1.8);
    $("#b6ps2", el).innerHTML = s + `</svg>`;
    let cat;
    if (S > 140 || D > 90) cat = `<b style="color:var(--bad)">${L2("Above the book's limit for high blood pressure", "বইয়ের উচ্চ রক্তচাপের সীমার ওপরে")}</b> ${L2("(systolic above 140 or diastolic above 90). If it is like this every time it is measured, it is hypertension.", "(সিস্টোলিক ১৪০-এর বেশি বা ডায়াস্টোলিক ৯০-এর বেশি)। যতবার মাপা হয় ততবারই এমন হলে তা উচ্চ রক্তচাপ।")}`;
    else if (S <= 120 && D <= 80) cat = `<b style="color:var(--good)">${L2("In the ideal range", "আদর্শ সীমার মধ্যে")}</b> ${L2("(systolic not above 120 and diastolic not above 80).", "(সিস্টোলিক ১২০-এর বেশি নয় এবং ডায়াস্টোলিক ৮০-এর বেশি নয়)।")}`;
    else cat = `<b style="color:var(--note)">${L2("Above the ideal values, below the limit for high blood pressure.", "আদর্শ মানের ওপরে, তবে উচ্চ রক্তচাপের সীমার নিচে।")}</b>`;
    $("#b6po2", el).innerHTML = `<b style="font-size:20px">${B6(S)}/${B6(D)} mmHg</b><br><span style="color:${OXY6}">■</span> ${L2("Systolic (heart contracts)", "সিস্টোলিক (হৃৎপিণ্ড সংকুচিত)")}: ${B6(S)}<br><span style="color:${DEO6}">■</span> ${L2("Diastolic (ventricles relax)", "ডায়াস্টোলিক (নিলয় প্রসারিত)")}: ${B6(D)}<br>${L2("Pulse pressure", "নাড়িঘাত চাপ")} = ${B6(S)} − ${B6(D)} = <b>${B6(S - D)} mmHg</b><br>${cat}`;
  };
  $("#b6px", el).addEventListener("input", () => fix("s")); $("#b6py", el).addEventListener("input", () => fix("d"));
  draw();
};
