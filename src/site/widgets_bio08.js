/* ---- biology chapter 8 widgets: excretory system ---- */
const B8 = x => bnNum(x, LANG);
const chipsB8 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T8 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "", halo = false) => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${halo ? ` paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"` : ""}>${s}</text>`;
const LD8 = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--sheet)" stroke-width="3.5"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ink)" stroke-width="1" opacity=".7"/><circle cx="${x2}" cy="${y2}" r="2.2" fill="var(--ink)"/>`;
const AR8 = (x1, y1, x2, y2, id, c, w = 2.5, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;
/* tappable label; t may be an array of lines */
const LB8 = (k, on, x, y, t, a = "start", sz = 13) => { const ls = Array.isArray(t) ? t : [t]; return `<text data-k="${k}" x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${on ? "var(--bad)" : "var(--ink)"}" font-weight="${on ? 700 : 400}" paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" style="cursor:pointer">${ls.map((s, i) => `<tspan x="${x}" dy="${i ? sz + 2 : 0}">${s}</tspan>`).join("")}</text>`; };
const ART8 = "#c8473d", VEIN8 = "#3b76b8", URI8 = "#d8a520", KID8 = "#b5694f", PEL8 = "#f0d98c", WAT8 = "#4a90c8", GLU8 = "#3f9d5a", SALT8 = "#8a6fb5", UREA8 = "#c9781f";
const UL8 = a => `<ul style="margin:4px 0 0;padding-left:20px">${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
/* small bean-shaped kidney; d = +1 hilum faces right, -1 faces left */
const bean8 = (cx, cy, s, d) => { const X = v => (cx + d * v * s).toFixed(1), Y = v => (cy + v * s).toFixed(1); return `M${X(-2)} ${Y(-48)} C${X(-40)} ${Y(-52)} ${X(-44)} ${Y(40)} ${X(-2)} ${Y(48)} C${X(26)} ${Y(52)} ${X(30)} ${Y(24)} ${X(16)} ${Y(10)} C${X(8)} ${Y(2)} ${X(8)} ${Y(-4)} ${X(16)} ${Y(-12)} C${X(30)} ${Y(-26)} ${X(24)} ${Y(-46)} ${X(-2)} ${Y(-48)} Z`; };
const tap8 = (root, cb) => root.querySelectorAll("[data-k]").forEach(g => g.addEventListener("click", () => cb(g.dataset.k)));

/* 8.1 the excretory system, which organ removes which waste, and what urine is made of */
W.b8waste = (el) => {
  const PARTS = [
    ["aorta", L2("Dorsal aorta", "পৃষ্ঠীয় মহাধমনি"), L2("The main artery of the body. It carries blood from the heart; this blood has the urea and other wastes collected from all the cells.", "দেহের প্রধান ধমনি। হৃৎপিণ্ড থেকে রক্ত বয়ে আনে; এই রক্তে থাকে সব কোষ থেকে জমা হওয়া ইউরিয়া ও অন্যান্য বর্জ্য।")],
    ["artery", L2("Renal artery", "রেনাল ধমনি"), L2("A branch of the aorta that enters each kidney. It brings the blood that has to be cleaned.", "মহাধমনির শাখা, প্রতিটি বৃক্কে একটি করে ঢোকে। যে রক্ত পরিষ্কার করতে হবে, তা নিয়ে আসে।")],
    ["kidney", L2("Kidney", "বৃক্ক (কিডনি)"), L2("The excretory organ. Its nephrons filter the blood, take back what the body needs, and make urine from the rest.", "রেচন অঙ্গ। এর নেফ্রনগুলো রক্ত ছাঁকে, দেহের দরকারি জিনিস ফিরিয়ে নেয়, আর বাকিটুকু দিয়ে মূত্র তৈরি করে।")],
    ["vein", L2("Renal vein", "রেনাল শিরা"), L2("Carries the cleaned blood out of the kidney. This blood has much less urea than the blood that came in.", "পরিষ্কার হওয়া রক্ত বৃক্ক থেকে বের করে নিয়ে যায়। ঢোকার সময়ের চেয়ে এই রক্তে ইউরিয়া অনেক কম।")],
    ["cava", L2("Inferior vena cava", "নিম্ন মহাশিরা"), L2("The large vein that receives blood from the renal veins and returns it to the heart.", "বড় শিরা; রেনাল শিরার রক্ত গ্রহণ করে হৃৎপিণ্ডে ফিরিয়ে নেয়।")],
    ["ureter", L2("Ureter", "ইউরেটার"), L2("A thin tube from each kidney. It carries the urine down to the urinary bladder.", "প্রতিটি বৃক্ক থেকে বের হওয়া সরু নল। মূত্র নিচে মূত্রথলিতে নিয়ে যায়।")],
    ["bladder", L2("Urinary bladder", "মূত্রথলি (মূত্রাশয়)"), L2("A stretchy, muscular bag. Urine is stored here for a while; when it has filled to a certain level we feel the urge to pass urine.", "প্রসারণশীল, পেশিবহুল থলি। মূত্র এখানে সাময়িকভাবে জমা থাকে; একটি নির্দিষ্ট পর্যায় পর্যন্ত ভরলে মূত্র ত্যাগের ইচ্ছা জাগে।")],
    ["urethra", L2("Urethra", "মূত্রনালি (ইউরেথ্রা)"), L2("The short tube from the bottom of the bladder. Through it the urine leaves the body.", "মূত্রথলির নিচ থেকে বের হওয়া ছোট নল। এর ভেতর দিয়ে মূত্র দেহের বাইরে যায়।")]];
  const WASTES = {
    co2: [L2("Carbon dioxide", "কার্বন ডাই-অক্সাইড"), ["cells"], ["lungs"], L2("<b>Made</b> in every living cell during respiration. The blood carries it to the <b>lungs</b>, and it leaves in the air you breathe out.", "<b>তৈরি হয়</b> প্রতিটি সজীব কোষে, শ্বসনের সময়। রক্ত একে <b>ফুসফুসে</b> নিয়ে যায়, আর নিঃশ্বাসের বাতাসের সাথে তা বেরিয়ে যায়।")],
    urea: [L2("Urea", "ইউরিয়া"), ["liver"], ["kidney", "skin"], L2("<b>Made</b> in the liver from the nitrogen of extra amino acids. The blood carries it to the <b>kidneys</b>, which remove it in urine. A trace also leaves in sweat.", "<b>তৈরি হয়</b> যকৃতে, বাড়তি অ্যামাইনো এসিডের নাইট্রোজেন থেকে। রক্ত একে <b>বৃক্কে</b> নিয়ে যায়, বৃক্ক মূত্রের সাথে বের করে দেয়। ঘামের সাথেও সামান্য বের হয়।")],
    uric: [L2("Uric acid", "ইউরিক এসিড"), ["liver", "cells"], ["kidney"], L2("<b>Made</b> when the nucleic acids of worn-out cells and of food are broken down, mainly in the liver. The <b>kidneys</b> remove it in urine.", "<b>তৈরি হয়</b> পুরোনো কোষ ও খাদ্যের নিউক্লিক এসিড ভাঙলে, প্রধানত যকৃতে। <b>বৃক্ক</b> মূত্রের সাথে একে বের করে দেয়।")],
    water: [L2("Excess water", "অতিরিক্ত পানি"), [], ["kidney", "skin", "lungs"], L2("Water comes from drink and food, and a little is made in respiration. The <b>kidneys</b> remove most of the excess as urine. Some leaves from the <b>skin</b> as sweat and from the <b>lungs</b> as water vapour.", "পানি আসে পানীয় ও খাদ্য থেকে, সামান্য তৈরি হয় শ্বসনে। বাড়তি পানির বেশির ভাগ <b>বৃক্ক</b> মূত্র হিসেবে বের করে। কিছুটা বের হয় <b>ত্বক</b> দিয়ে ঘাম হিসেবে আর <b>ফুসফুস</b> দিয়ে জলীয় বাষ্প হিসেবে।")],
    salt: [L2("Excess salts", "অতিরিক্ত লবণ"), [], ["kidney", "skin"], L2("Salts come from food. The <b>kidneys</b> keep back what the body needs and send out the excess in urine. Some salt is also lost from the <b>skin</b> in sweat.", "লবণ আসে খাদ্য থেকে। <b>বৃক্ক</b> দেহের দরকারি অংশ রেখে বাড়তিটুকু মূত্রের সাথে বের করে দেয়। ঘামের সাথে <b>ত্বক</b> দিয়েও কিছু লবণ বেরিয়ে যায়।")]};
  let view = "sys", sel = 2, waste = "urea", food = "mix", wat = "ok";
  el.innerHTML = `<div class="chipset b8wv" role="group"><button data-v="sys" aria-pressed="true">${B8(1)}. ${L2("The system", "রেচনতন্ত্র")}</button><button data-v="waste" aria-pressed="false">${B8(2)}. ${L2("Which waste?", "কোন বর্জ্য?")}</button><button data-v="urine" aria-pressed="false">${B8(3)}. ${L2("Urine", "মূত্র")}</button></div><div id="b8wb" style="margin-top:8px"></div>`;
  const drawSys = () => {
    const k = PARTS[sel][0], on = q => q === k, hc = (q, c) => on(q) ? "var(--bad)" : c;
    let s = `<svg viewBox="0 0 360 396" role="img" aria-label="${L2("Human excretory system", "মানব রেচনতন্ত্র")}">`;
    s += `<path d="M38 6 Q20 110 42 200 Q24 300 58 392 M322 6 Q340 110 318 200 Q336 300 302 392" fill="none" stroke="var(--rule)" stroke-width="2"/>`;
    s += `<g data-k="artery" style="cursor:pointer"><path d="M188 108 L278 112 M188 120 L82 124" fill="none" stroke="${hc("artery", ART8)}" stroke-width="${on("artery") ? 8 : 6}" stroke-linecap="round"/></g>`;
    s += `<g data-k="cava" style="cursor:pointer"><path d="M172 34 V244" fill="none" stroke="${hc("cava", VEIN8)}" stroke-width="${on("cava") ? 12 : 10}" stroke-linecap="round"/></g>`;
    s += `<g data-k="aorta" style="cursor:pointer"><path d="M188 34 V244" fill="none" stroke="${hc("aorta", ART8)}" stroke-width="${on("aorta") ? 11 : 9}" stroke-linecap="round"/></g>`;
    s += `<g data-k="vein" style="cursor:pointer"><path d="M172 128 L278 126 M172 140 L82 140" fill="none" stroke="${hc("vein", VEIN8)}" stroke-width="${on("vein") ? 8 : 6}" stroke-linecap="round"/></g>`;
    const UR = "M86 150 C96 196 140 236 166 300 M274 142 C264 190 220 232 194 300";
    s += `<g data-k="ureter" style="cursor:pointer"><path d="${UR}" fill="none" stroke="${hc("ureter", "var(--ink)")}" stroke-width="${on("ureter") ? 9 : 7}" stroke-linecap="round"/><path d="${UR}" fill="none" stroke="${URI8}" stroke-width="4" stroke-linecap="round"/></g>`;
    s += `<g data-k="urethra" style="cursor:pointer"><path d="M180 348 V386" fill="none" stroke="${hc("urethra", "var(--ink)")}" stroke-width="${on("urethra") ? 10 : 8}" stroke-linecap="round"/><path d="M180 348 V386" fill="none" stroke="${URI8}" stroke-width="5" stroke-linecap="round"/></g>`;
    s += `<g data-k="bladder" style="cursor:pointer"><path d="M180 292 C214 292 222 320 208 340 C198 354 162 354 152 340 C138 320 146 292 180 292 Z" fill="var(--paper)" stroke="${hc("bladder", "var(--ink)")}" stroke-width="${on("bladder") ? 3.5 : 1.8}"/><path d="M151 322 Q180 314 209 322 Q212 332 208 340 C198 354 162 354 152 340 Q148 332 151 322 Z" fill="${URI8}" opacity=".6"/></g>`;
    s += `<g data-k="kidney" style="cursor:pointer"><path d="${bean8(72, 128, 1, 1)}" fill="${KID8}" stroke="${hc("kidney", "var(--ink)")}" stroke-width="${on("kidney") ? 3.5 : 1.8}"/><path d="${bean8(288, 118, 1, -1)}" fill="${KID8}" stroke="${hc("kidney", "var(--ink)")}" stroke-width="${on("kidney") ? 3.5 : 1.8}"/></g>`;
    s += LB8("cava", on("cava"), 164, 22, PARTS[4][1], "end") + LB8("aorta", on("aorta"), 196, 22, PARTS[0][1], "start");
    s += LB8("kidney", on("kidney"), 290, 60, L2("Kidney", "বৃক্ক"), "middle") + LB8("artery", on("artery"), 234, 100, PARTS[1][1], "middle", 12) + LB8("vein", on("vein"), 130, 158, PARTS[3][1], "middle", 12);
    s += LD8(250, 240, 233, 230) + LB8("ureter", on("ureter"), 254, 246, PARTS[5][1], "start");
    s += LD8(226, 324, 212, 322) + LB8("bladder", on("bladder"), 230, 329, L2("Urinary bladder", "মূত্রথলি"), "start");
    s += LB8("urethra", on("urethra"), 194, 382, L2("Urethra", "মূত্রনালি"), "start");
    s += T8(60, 196, L2("right side", "ডান পাশ"), "middle", 12, "var(--muted)") + T8(300, 196, L2("left side", "বাম পাশ"), "middle", 12, "var(--muted)");
    $("#b8ws", el).innerHTML = s + `</svg>`;
    tap8($("#b8ws", el), q => { sel = PARTS.findIndex(p => p[0] === q); drawSys(); });
    $("#b8wo", el).innerHTML = `<b>${PARTS[sel][1]}.</b> ${PARTS[sel][2]}`;
    $("#b8wn", el).textContent = B8(sel + 1) + " / " + B8(PARTS.length);
  };
  const drawWaste = () => {
    const [, made, out, txt] = WASTES[waste];
    const st = q => out.includes(q) ? ["var(--c)", "var(--c-soft)", 3.5] : made.includes(q) ? ["var(--note)", "var(--note-soft)", 3.5] : ["var(--muted)", "var(--paper)", 1.5];
    const shp = (q, tag) => { const [c, f, w] = st(q); return tag.replace("%S", `fill="${f}" stroke="${c}" stroke-width="${w}"`); };
    let s = `<svg viewBox="0 0 360 304" role="img" aria-label="${L2("Where a waste is made and which organ removes it", "কোন বর্জ্য কোথায় তৈরি হয় আর কোন অঙ্গ তা বের করে")}">${arrowDefs("b8wa", "var(--c)")}`;
    const [sc, , sw] = st("skin");
    s += `<circle cx="180" cy="30" r="19" fill="var(--paper)" stroke="${sc}" stroke-width="${sw}"/><path d="M124 60 Q180 48 236 60 Q250 64 252 90 L246 284 L114 284 L108 90 Q110 64 124 60 Z" fill="var(--paper)" stroke="${sc}" stroke-width="${sw}"/>`;
    if (made.includes("cells")) { let d = ""; for (let r = 0; r < 9; r++) for (let c = 0; c < 6; c++) d += `<circle cx="${128 + c * 21 + (r % 2 ? 10 : 0)}" cy="${78 + r * 24}" r="3" fill="var(--note)" opacity=".75"/>`; s += d; }
    s += `<path d="M180 48 V84 M180 84 L160 96 M180 84 L200 96" fill="none" stroke="${st("lungs")[0]}" stroke-width="4" stroke-linecap="round"/>`;
    s += shp("lungs", `<ellipse cx="152" cy="116" rx="22" ry="34" %S/>`) + shp("lungs", `<ellipse cx="208" cy="116" rx="22" ry="34" %S/>`);
    s += shp("liver", `<path d="M126 166 Q160 154 204 164 Q208 182 178 192 Q146 200 126 190 Z" %S/>`);
    s += shp("kidney", `<path d="${bean8(152, 230, 0.4, 1)}" %S/>`) + shp("kidney", `<path d="${bean8(208, 230, 0.4, -1)}" %S/>`);
    s += `<path d="M158 236 Q166 256 176 262 M202 236 Q194 256 184 262" fill="none" stroke="${st("kidney")[0]}" stroke-width="2"/>` + shp("kidney", `<ellipse cx="180" cy="268" rx="11" ry="9" %S/>`);
    const lab = (q, x, y, t, a) => T8(x, y, t, a, 13, out.includes(q) ? "var(--c)" : made.includes(q) ? "var(--note)" : "var(--muted)", out.includes(q) || made.includes(q) ? "700" : "");
    s += lab("lungs", 262, 112, L2("Lungs", "ফুসফুস"), "start") + lab("liver", 100, 180, L2("Liver", "যকৃৎ"), "end") + lab("kidney", 262, 234, L2("Kidneys", "বৃক্ক"), "start") + lab("skin", 100, 100, L2("Skin", "ত্বক"), "end");
    if (made.includes("cells")) s += T8(100, 250, L2("all cells", "সব কোষ"), "end", 13, "var(--note)", "700");
    if (out.includes("lungs")) s += AR8(196, 36, 236, 18, "b8wa", "var(--c)", 3) + T8(244, 22, waste === "water" ? L2("water vapour", "জলীয় বাষ্প") : L2("breathed out", "নিঃশ্বাসে"), "start", 13, "var(--c)", "700");
    if (out.includes("kidney")) s += AR8(180, 277, 180, 298, "b8wa", "var(--c)", 3) + T8(190, 298, L2("in urine", "মূত্রে"), "start", 13, "var(--c)", "700");
    if (out.includes("skin")) s += AR8(250, 150, 282, 150, "b8wa", "var(--c)", 2.5) + AR8(110, 140, 78, 140, "b8wa", "var(--c)", 2.5) + T8(288, 154, waste === "urea" ? L2("trace", "সামান্য") : L2("sweat", "ঘাম"), "start", 13, "var(--c)", "700") + (waste === "urea" ? T8(288, 170, L2("in sweat", "ঘামে"), "start", 13, "var(--c)", "700") : "");
    $("#b8ws", el).innerHTML = s + `</svg>`;
    $("#b8wo", el).innerHTML = `<b>${WASTES[waste][0]}.</b> ${txt}<br><span style="font-size:14px"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--note);vertical-align:-1px"></span> ${L2("made here", "এখানে তৈরি হয়")} &nbsp; <span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--c);vertical-align:-1px"></span> ${L2("removes it", "এ অঙ্গ বের করে")}</span>`;
  };
  const drawUrine = () => {
    const pale = wat === "ok", col = pale ? "#f2e08a" : "#d39a1c";
    const px = food === "meat" ? 196 : food === "veg" ? 312 : 236;
    let s = `<svg viewBox="0 0 360 236" role="img" aria-label="${L2("What urine is made of", "মূত্রে কী কী থাকে")}">`;
    s += `<rect x="12" y="26" width="319" height="30" fill="${WAT8}" opacity=".8"/><rect x="331" y="26" width="17" height="30" fill="${UREA8}"/><rect x="12" y="26" width="336" height="30" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += T8(12, 18, L2("100 g of normal urine", "১০০ g স্বাভাবিক মূত্র"), "start", 13, "var(--ink)", "700") + T8(170, 46, L2("water: about 95 g", "পানি: প্রায় ৯৫ g"), "middle", 14, "var(--sheet)", "700");
    s += `<path d="M339 58 V70 H300" fill="none" stroke="var(--muted)" stroke-width="1.2"/>` + T8(296, 74, L2("about 5 g: urea, uric acid,", "প্রায় ৫ g: ইউরিয়া, ইউরিক এসিড,"), "end", 12.5, "var(--ink)") + T8(296, 90, L2("creatinine, salts", "ক্রিয়েটিনিন, লবণ"), "end", 12.5, "var(--ink)");
    s += `<path d="M30 112 L38 214 Q39 222 48 222 L92 222 Q101 222 102 214 L110 112" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M${pale ? "32.5 144 L107.5 144" : "35.7 184 L104.3 184"} L102 214 Q101 221 92 221 L48 221 Q39 221 38 214 Z" fill="${col}"/>`;
    s += T8(70, 106, L2("sample", "নমুনা"), "middle", 12, "var(--muted)");
    s += `<defs><linearGradient id="b8ug" x1="0" x2="1"><stop offset="0" stop-color="${ART8}"/><stop offset=".5" stop-color="var(--paper)"/><stop offset="1" stop-color="${VEIN8}"/></linearGradient></defs><rect x="150" y="150" width="196" height="12" rx="6" fill="url(#b8ug)" stroke="var(--muted)" stroke-width="1"/>`;
    s += `<path d="M${px} 148 l-8 -14 h16 z" fill="var(--ink)"/>` + T8(150, 182, L2("more acidic", "বেশি অম্লীয়"), "start", 12.5, ART8, "700") + T8(346, 182, L2("alkaline", "ক্ষারীয়"), "end", 12.5, VEIN8, "700");
    s += T8(248, 122, L2("acid or alkali?", "অম্লীয় না ক্ষারীয়?"), "middle", 13, "var(--ink)", "700") + T8(248, 214, pale ? L2("colour: light yellow", "রং: হালকা হলুদ") : L2("colour: dark yellow", "রং: গাঢ় হলুদ"), "middle", 13, "var(--ink)");
    $("#b8ws", el).innerHTML = s + `</svg>`;
    const f = food === "meat" ? L2("A lot of protein-rich food (meat, fish, eggs, pulses) makes the urine <b>more acidic</b>, and the liver makes more urea.", "বেশি আমিষজাতীয় খাদ্য (মাংস, মাছ, ডিম, ডাল) খেলে মূত্রের <b>অম্লতা বাড়ে</b>, যকৃতে ইউরিয়াও বেশি তৈরি হয়।") : food === "veg" ? L2("Fruits and vegetables usually make the urine <b>alkaline</b>.", "ফলমূল ও তরিতরকারি খেলে সাধারণত <b>ক্ষারীয়</b> মূত্র তৈরি হয়।") : L2("With an ordinary mixed diet, urine is usually slightly acidic.", "সাধারণ মিশ্র খাবারে মূত্র সাধারণত সামান্য অম্লীয় থাকে।");
    const w = pale ? L2("With enough water the pigment <b>urochrome</b> is spread through plenty of water, so the urine is light yellow.", "পর্যাপ্ত পানি থাকলে <b>ইউরোক্রোম</b> রঞ্জক অনেক পানিতে ছড়িয়ে থাকে, তাই মূত্র হালকা হলুদ।") : L2("With little water (or a lot of sweating) the kidneys save water. The same urochrome is in less water, so the urine is less in amount and darker.", "পানি কম খেলে (বা খুব ঘামলে) বৃক্ক পানি বাঁচায়। একই ইউরোক্রোম কম পানিতে থাকে, তাই মূত্র পরিমাণে কম ও গাঢ় রঙের হয়।");
    $("#b8wo", el).innerHTML = f + " " + w;
  };
  const setView = () => {
    const b = $("#b8wb", el);
    if (view === "sys") {
      b.innerHTML = `<div class="svgwrap fit" id="b8ws"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b8wx">${L2("Next part", "পরের ধাপ")} ▶</button><span class="hint" id="b8wn"></span></div><div class="w-out" id="b8wo"></div>`;
      $("#b8wx", el).addEventListener("click", () => { sel = (sel + 1) % PARTS.length; drawSys(); });
      drawSys();
    } else if (view === "waste") {
      b.innerHTML = `<div class="chipset b8ww" role="group">${Object.keys(WASTES).map(q => `<button data-w="${q}" aria-pressed="${q === waste}">${WASTES[q][0]}</button>`).join("")}</div><div class="svgwrap fit" id="b8ws" style="margin-top:8px"></div><div class="w-out" id="b8wo"></div>`;
      chipsB8(el, ".b8ww", q => { waste = q.dataset.w; drawWaste(); });
      drawWaste();
    } else {
      b.innerHTML = `<div class="svgwrap fit" id="b8ws"></div><div class="w-row" style="margin-top:6px"><span class="hint">${L2("Food:", "খাবার:")}</span><div class="chipset b8wf" role="group"><button data-f="mix" aria-pressed="${food === "mix"}">${L2("Mixed", "মিশ্র")}</button><button data-f="meat" aria-pressed="${food === "meat"}">${L2("Lots of protein", "বেশি আমিষ")}</button><button data-f="veg" aria-pressed="${food === "veg"}">${L2("Fruit and vegetables", "ফল ও সবজি")}</button></div></div>
        <div class="w-row" style="margin:6px 0"><span class="hint">${L2("Water:", "পানি:")}</span><div class="chipset b8wd" role="group"><button data-d="ok" aria-pressed="${wat === "ok"}">${L2("Enough", "পর্যাপ্ত")}</button><button data-d="low" aria-pressed="${wat === "low"}">${L2("Too little", "খুব কম")}</button></div></div><div class="w-out" id="b8wo"></div>`;
      chipsB8(el, ".b8wf", q => { food = q.dataset.f; drawUrine(); });
      chipsB8(el, ".b8wd", q => { wat = q.dataset.d; drawUrine(); });
      drawUrine();
    }
  };
  chipsB8(el, ".b8wv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* shared nephron drawing (8.2 and 8.2.1). on(k) tells whether part k is highlighted. */
const NEPH8 = {
  pct: "M118 130 C128 92 146 92 150 122 C154 152 172 152 176 122 C179 98 196 100 196 128 C196 150 192 160 192 178",
  loop: "M192 178 L192 344 C192 380 226 380 226 344 L226 206",
  dct: "M226 206 C226 172 246 168 250 190 C254 214 274 214 278 190 C281 170 298 168 306 182 L316 190",
  cd: "M322 60 L322 410",
  glom: "M60 120 C76 104 100 106 104 122 C108 138 92 146 86 134 C80 122 98 116 98 128 C98 142 78 150 74 138 C70 128 84 124 82 132 C80 142 68 142 60 140",
  aff: "M10 62 L60 120", eff: "M60 140 L42 166",
  cap1: "M42 166 C36 190 90 214 130 222 C166 230 186 246 178 282", cap2: "M178 282 L240 294 L178 306 L240 318 L178 330 L240 342 L178 354", ven: "M178 354 C140 362 70 352 8 356",
  col: { pct: "#e6b85c", loop: "#d99a4e", dct: "#e6cf7a", cd: URI8 }
};
const neph8 = (on, bands = true, soft = false) => {
  const N = NEPH8, tube = (k, w = 8) => `<g data-k="${k}" style="cursor:pointer"><path d="${N[k]}" fill="none" stroke="${soft && on(k) ? "var(--bad)" : "var(--ink)"}" stroke-width="${w + (soft && on(k) ? 8 : 4)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${N[k]}" fill="none" stroke="${on(k) && !soft ? "var(--bad)" : N.col[k]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const cc = (k, c) => on(k) && !soft ? "var(--bad)" : c;
  let s = "";
  if (bands) s += `<rect x="0" y="0" width="360" height="270" fill="var(--c-soft)" opacity=".45"/><rect x="0" y="270" width="360" height="140" fill="var(--note-soft)" opacity=".7"/><line x1="0" y1="270" x2="360" y2="270" stroke="var(--muted)" stroke-width="1" stroke-dasharray="5 4"/>`;
  s += `<defs><linearGradient id="b8cg" gradientUnits="userSpaceOnUse" x1="0" y1="282" x2="0" y2="354"><stop offset="0" stop-color="${ART8}"/><stop offset="1" stop-color="${VEIN8}"/></linearGradient></defs>`;
  s += `<g data-k="cap" style="cursor:pointer"><path d="${N.cap1}" fill="none" stroke="${cc("cap", ART8)}" stroke-width="${on("cap") ? 4.5 : 3}" stroke-linecap="round"/><path d="${N.cap2}" fill="none" stroke="${cc("cap", "url(#b8cg)")}" stroke-width="${on("cap") ? 4.5 : 3}" stroke-linejoin="round" stroke-linecap="round"/><path d="${N.ven}" fill="none" stroke="${cc("cap", VEIN8)}" stroke-width="${on("cap") ? 5.5 : 4}" stroke-linecap="round"/></g>`;
  s += `<path d="M356 110 C344 112 334 120 328 132" fill="none" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"/><path d="M356 110 C344 112 334 120 328 132" fill="none" stroke="${N.col.dct}" stroke-width="6" stroke-linecap="round"/>`;
  s += tube("cd", 12);
  s += `<g data-k="bowman" style="cursor:pointer"><path d="M56.6 113 A34 34 0 1 1 56.6 147 L63.95 143.8 A26 26 0 1 0 63.95 116.2 Z" fill="${cc("bowman", "#f6e7b4")}" stroke="${soft && on("bowman") ? "var(--bad)" : "var(--ink)"}" stroke-width="${soft && on("bowman") ? 3.5 : 1.6}" stroke-linejoin="round"/></g>`;
  s += tube("pct") + tube("loop") + tube("dct");
  s += `<g data-k="aff" style="cursor:pointer"><path d="${N.aff}" fill="none" stroke="${cc("aff", ART8)}" stroke-width="${on("aff") ? 10 : 8}" stroke-linecap="round"/></g>`;
  s += `<g data-k="eff" style="cursor:pointer"><path d="${N.eff}" fill="none" stroke="${cc("eff", ART8)}" stroke-width="${on("eff") ? 7 : 5}" stroke-linecap="round"/></g>`;
  s += `<g data-k="glom" style="cursor:pointer"><circle cx="86" cy="130" r="24" fill="var(--sheet)" opacity=".01"/><path d="${N.glom}" fill="none" stroke="${cc("glom", ART8)}" stroke-width="${on("glom") ? 6 : 4.5}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  return s;
};

/* 8.2 kidney (longitudinal section) and nephron: tap the labels; follow the two roads */
W.b8kidney = (el) => {
  const KP = [
    ["capsule", L2("Renal capsule", "রেনাল ক্যাপসুল"), L2("The tough, fibrous covering that wraps the whole kidney.", "পুরো বৃক্ককে ঘিরে থাকা শক্ত, তন্তুময় আবরণ।")],
    ["cortex", L2("Cortex", "কর্টেক্স"), L2("The outer region, just under the capsule. The renal corpuscles and the coiled tubules of the nephrons lie here.", "ক্যাপসুলের ঠিক নিচের বাইরের অঞ্চল। নেফ্রনের রেনাল করপাসল আর প্যাঁচানো নালিকাগুলো এখানে থাকে।")],
    ["medulla", L2("Medulla", "মেডুলা"), L2("The inner region. It is made of 8 to 12 renal pyramids. The loops of Henle and the collecting tubules run through it.", "ভেতরের অঞ্চল। এটি ৮ থেকে ১২টি রেনাল পিরামিড দিয়ে গঠিত। হেনলি-র লুপ আর সংগ্রাহী নালিকা এর ভেতর দিয়ে যায়।")],
    ["pyramid", L2("Renal pyramid", "রেনাল পিরামিড"), L2("A cone-shaped mass of the medulla, with its broad base towards the cortex and its tip towards the pelvis. The stripes are thousands of straight tubules lying side by side.", "মেডুলার শঙ্কু আকৃতির অংশ; চওড়া ভূমি কর্টেক্সের দিকে, অগ্রভাগ পেলভিসের দিকে। ডোরাগুলো আসলে পাশাপাশি থাকা হাজার হাজার সোজা নালিকা।")],
    ["papilla", L2("Renal papilla", "রেনাল প্যাপিলা"), L2("The tip of each pyramid. Urine from the collecting tubules drips out here into the pelvis.", "প্রতিটি পিরামিডের অগ্রভাগ। সংগ্রাহী নালিকার মূত্র এখান দিয়ে পেলভিসে পড়ে।")],
    ["pelvis", L2("Renal pelvis", "রেনাল পেলভিস"), L2("The funnel-shaped wide beginning of the ureter inside the kidney. It collects the urine from all the papillae.", "বৃক্কের ভেতরে ইউরেটারের ফানেল আকৃতির প্রশস্ত অংশ। সব প্যাপিলা থেকে আসা মূত্র এখানে জমা হয়।")],
    ["hilum", L2("Hilum", "হাইলাম"), L2("The notch on the concave side: the gate of the kidney. The renal artery goes in here; the renal vein and the ureter come out.", "অবতল পাশের ভাঁজ: বৃক্কের ফটক। রেনাল ধমনি এখান দিয়ে ঢোকে; রেনাল শিরা ও ইউরেটার বের হয়।")],
    ["artery", L2("Renal artery", "রেনাল ধমনি"), L2("Brings blood into the kidney to be cleaned. Inside, it branches again and again until it reaches every nephron as an afferent arteriole.", "পরিষ্কার করার জন্য রক্ত বৃক্কে নিয়ে আসে। ভেতরে বারবার ভাগ হয়ে অ্যাফারেন্ট আর্টারিওল হিসেবে প্রতিটি নেফ্রনে পৌঁছায়।")],
    ["vein", L2("Renal vein", "রেনাল শিরা"), L2("Carries the cleaned blood out of the kidney, back towards the heart.", "পরিষ্কার হওয়া রক্ত বৃক্ক থেকে বের করে হৃৎপিণ্ডের দিকে ফিরিয়ে নেয়।")],
    ["ureter", L2("Ureter", "ইউরেটার"), L2("The tube that carries the urine from the pelvis down to the urinary bladder.", "যে নল পেলভিস থেকে মূত্র নিচে মূত্রথলিতে নিয়ে যায়।")]];
  const NP = {
    aff: [L2("Afferent arteriole", "অ্যাফারেন্ট আর্টারিওল"), L2("A branch of the renal artery. It <b>brings</b> blood into Bowman's capsule and there divides into about 50 capillaries. It is a little wider than the efferent arteriole.", "রেনাল ধমনির শাখা। বোম্যান্স ক্যাপসুলের ভেতরে রক্ত <b>নিয়ে আসে</b> এবং সেখানে প্রায় ৫০টি কৈশিকনালিকায় ভাগ হয়। এটি ইফারেন্ট আর্টারিওলের চেয়ে একটু মোটা।")],
    glom: [L2("Glomerulus", "গ্লোমেরুলাস"), L2("A knot of fine blood capillaries inside the capsule. It works like a strainer: part of the liquid of the blood is pressed out here. That liquid is the ultrafiltrate.", "ক্যাপসুলের ভেতরে থাকা সূক্ষ্ম কৈশিক জালিকার গুচ্ছ। এটি ছাঁকনির মতো কাজ করে: রক্তের তরল অংশের খানিকটা চাপে এখানে ছেঁকে বেরিয়ে আসে। এই তরলই আল্ট্রাফিলট্রেট।")],
    bowman: [L2("Bowman's capsule", "বোম্যান্স ক্যাপসুল"), L2("A double-walled cup round the glomerulus. The space between its two walls catches the ultrafiltrate and leads it into the tubule. Glomerulus + capsule = renal corpuscle (Malpighian body).", "গ্লোমেরুলাসকে ঘিরে থাকা দুই স্তরের পেয়ালা। দুই স্তরের মাঝের ফাঁকে আল্ট্রাফিলট্রেট জমা হয়ে টিউব্যুলে চলে যায়। গ্লোমেরুলাস + ক্যাপসুল = রেনাল করপাসল (মালপিজিয়ান অঙ্গ)।")],
    eff: [L2("Efferent arteriole", "ইফারেন্ট আর্টারিওল"), L2("Formed when the capillaries of the glomerulus join again. It <b>takes</b> the blood out of the capsule, and then breaks up into capillaries round the tubule.", "গ্লোমেরুলাসের কৈশিকনালিকাগুলো আবার মিলিত হয়ে এটি তৈরি করে। ক্যাপসুল থেকে রক্ত <b>বের করে নিয়ে যায়</b>, এরপর টিউব্যুলের চারপাশে কৈশিক জালিকায় ভাগ হয়।")],
    cap: [L2("Capillaries round the tubule", "টিউব্যুলের চারপাশের কৈশিক জালিকা"), L2("A net of capillaries wrapped round the renal tubule. The useful substances taken back from the tubule enter the blood here. The blood then flows on towards the renal vein.", "রেনাল টিউব্যুলকে জড়িয়ে থাকা কৈশিক জালিকা। টিউব্যুল থেকে ফিরিয়ে নেওয়া দরকারি পদার্থ এখানে রক্তে ঢোকে। এরপর রক্ত রেনাল শিরার দিকে চলে যায়।")],
    pct: [L2("Proximal convoluted tubule", "নিকটবর্তী (গোড়াদেশীয়) প্যাঁচানো নালিকা"), L2("The first, coiled part of the renal tubule, nearest to the capsule. It lies in the cortex.", "রেনাল টিউব্যুলের প্রথম, প্যাঁচানো অংশ; ক্যাপসুলের সবচেয়ে কাছে। এটি কর্টেক্সে থাকে।")],
    loop: [L2("Loop of Henle", "হেনলি-র লুপ"), L2("The long U-shaped middle part of the renal tubule. It dips down into the medulla and comes back up.", "রেনাল টিউব্যুলের মাঝের U আকৃতির লম্বা অংশ। এটি মেডুলায় নেমে গিয়ে আবার ওপরে উঠে আসে।")],
    dct: [L2("Distal convoluted tubule", "প্রান্তীয় প্যাঁচানো নালিকা"), L2("The last, coiled part of the renal tubule, far from the capsule. It lies in the cortex and opens into a collecting tubule.", "রেনাল টিউব্যুলের শেষ, প্যাঁচানো অংশ; ক্যাপসুল থেকে দূরে। এটি কর্টেক্সে থাকে এবং সংগ্রাহী নালিকায় খোলে।")],
    cd: [L2("Collecting tubule", "সংগ্রাহী নালিকা"), L2("Not a part of the nephron. It receives urine from several nephrons and carries it down through the medulla to the renal pelvis.", "এটি নেফ্রনের অংশ নয়। কয়েকটি নেফ্রনের মূত্র গ্রহণ করে মেডুলার ভেতর দিয়ে রেনাল পেলভিসে বয়ে নেয়।")]};
  let view = "kid", ks = 1, ns = "glom", timer = 0;
  el.innerHTML = `<div class="chipset b8kv" role="group"><button data-v="kid" aria-pressed="true">${B8(1)}. ${L2("Kidney", "বৃক্ক")}</button><button data-v="neph" aria-pressed="false">${B8(2)}. ${L2("Nephron", "নেফ্রন")}</button></div><div id="b8kb" style="margin-top:8px"></div>`;
  const P = [228, 170], CORT = "#dba488", PYR = "#a8503c";
  const PY = [78, 112, 146, 180, 214, 248, 282].map(a => { const r = a * Math.PI / 180, c = Math.cos(r), n = Math.sin(r), bx = P[0] + c * 98, by = P[1] + n * 126; return { a: [P[0] + c * 40, P[1] + n * 50], b1: [bx - n * 24, by + c * 24], b2: [bx + n * 24, by - c * 24], q: [bx + c * 14, by + n * 14] }; });
  const f1 = v => v.toFixed(1);
  const drawKid = () => {
    const k = KP[ks][0], on = q => q === k;
    let s = `<svg viewBox="0 0 360 362" role="img" aria-label="${L2("Longitudinal section of a kidney", "বৃক্কের লম্বচ্ছেদ")}">`;
    const BEAN = "M218 22 C142 10 100 90 100 170 C100 250 142 328 218 318 C284 310 304 262 284 226 C272 204 258 198 258 170 C258 142 272 136 284 114 C304 78 284 30 218 22 Z";
    s += `<g data-k="cortex" style="cursor:pointer"><path d="${BEAN}" fill="${on("cortex") ? "var(--bad)" : CORT}" ${on("cortex") ? `opacity=".75"` : ""}/></g>`;
    s += `<g data-k="capsule" style="cursor:pointer"><path d="${BEAN}" fill="none" stroke="${on("capsule") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("capsule") ? 6 : 3}"/></g>`;
    s += `<g data-k="medulla" style="cursor:pointer">` + PY.map((p, i) => { const sel = on("medulla") || (on("pyramid") && i === 2); let g = `<path d="M${f1(p.a[0])} ${f1(p.a[1])} L${f1(p.b1[0])} ${f1(p.b1[1])} Q${f1(p.q[0])} ${f1(p.q[1])} ${f1(p.b2[0])} ${f1(p.b2[1])} Z" fill="${PYR}" stroke="${sel ? "var(--bad)" : "var(--ink)"}" stroke-width="${sel ? 4 : 1.2}" stroke-linejoin="round"/>`; [0.25, 0.5, 0.75].forEach(u => { g += `<line x1="${f1(p.a[0])}" y1="${f1(p.a[1])}" x2="${f1(p.b1[0] + (p.b2[0] - p.b1[0]) * u)}" y2="${f1(p.b1[1] + (p.b2[1] - p.b1[1]) * u)}" stroke="${CORT}" stroke-width="1.2" opacity=".7"/>`; }); return g; }).join("") + `</g>`;
    const PELD = PY.map(p => `M${f1(p.a[0])} ${f1(p.a[1])} L238 172`).join(" ") + " M238 172 L246 176";
    s += `<g data-k="pelvis" style="cursor:pointer"><path d="${PELD}" fill="none" stroke="${on("pelvis") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("pelvis") ? 15 : 12}" stroke-linecap="round"/><ellipse cx="240" cy="172" rx="15" ry="24" fill="${PEL8}" stroke="${on("pelvis") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("pelvis") ? 3.5 : 1.5}"/><path d="${PELD}" fill="none" stroke="${PEL8}" stroke-width="9" stroke-linecap="round"/></g>`;
    const URD = "M244 182 C266 186 300 198 304 240 L304 340";
    s += `<g data-k="ureter" style="cursor:pointer"><path d="${URD}" fill="none" stroke="${on("ureter") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("ureter") ? 14 : 11}" stroke-linecap="round"/><path d="${URD}" fill="none" stroke="${PEL8}" stroke-width="8" stroke-linecap="round"/></g>`;
    s += `<g data-k="papilla" style="cursor:pointer">${PY.map(p => `<circle cx="${f1(p.a[0])}" cy="${f1(p.a[1])}" r="${on("papilla") ? 6 : 3.5}" fill="${on("papilla") ? "var(--bad)" : PYR}" stroke="var(--ink)" stroke-width="1"/>`).join("")}</g>`;
    s += `<g data-k="vein" style="cursor:pointer"><path d="M356 162 C330 162 296 164 254 168" fill="none" stroke="${on("vein") ? "var(--bad)" : VEIN8}" stroke-width="${on("vein") ? 9 : 7}" stroke-linecap="round"/></g>`;
    s += `<g data-k="artery" style="cursor:pointer"><path d="M356 142 C330 142 296 146 254 154" fill="none" stroke="${on("artery") ? "var(--bad)" : ART8}" stroke-width="${on("artery") ? 8 : 6}" stroke-linecap="round"/></g>`;
    if (on("hilum")) s += `<path d="M284 114 C272 136 258 142 258 170 C258 198 272 204 284 226" fill="none" stroke="var(--bad)" stroke-width="6" stroke-linecap="round"/>`;
    s += LD8(96, 34, 143, 46) + LB8("capsule", on("capsule"), 2, 38, L2(["Renal", "capsule"], ["রেনাল", "ক্যাপসুল"]));
    s += LD8(50, 100, 118, 112) + LB8("cortex", on("cortex"), 2, 104, KP[1][1]);
    s += LD8(60, 166, 146, 170) + LB8("medulla", on("medulla"), 2, 170, KP[2][1]);
    s += LD8(60, 232, 152, 236) + LB8("pyramid", on("pyramid"), 2, 226, L2(["Renal", "pyramid"], ["রেনাল", "পিরামিড"]));
    s += LD8(64, 316, 212, 217) + LB8("papilla", on("papilla"), 2, 320, L2(["Renal", "papilla"], ["রেনাল", "প্যাপিলা"]));
    s += LD8(318, 82, 271, 133) + LB8("hilum", on("hilum"), 356, 78, KP[6][1], "end");
    s += LB8("artery", on("artery"), 356, 132, KP[7][1], "end", 12.5) + LB8("vein", on("vein"), 356, 182, KP[8][1], "end", 12.5);
    s += LD8(222, 340, 236, 190) + LB8("pelvis", on("pelvis"), 200, 356, KP[5][1], "middle") + LB8("ureter", on("ureter"), 356, 356, KP[9][1], "end");
    $("#b8ks", el).innerHTML = s + `</svg>`;
    tap8($("#b8ks", el), q => { ks = KP.findIndex(p => p[0] === q); drawKid(); });
    $("#b8ko", el).innerHTML = `<b>${KP[ks][1]}.</b> ${KP[ks][2]}`;
  };
  const drawNeph = () => {
    const on = q => q === ns;
    let s = `<svg viewBox="0 0 360 410" role="img" aria-label="${L2("A nephron", "একটি নেফ্রন")}">` + neph8(on);
    s += T8(4, 264, L2("CORTEX", "কর্টেক্স"), "start", 12, "var(--muted)", "700") + T8(4, 286, L2("MEDULLA", "মেডুলা"), "start", 12, "var(--muted)", "700");
    s += LB8("aff", on("aff"), 4, 46, NP.aff[0]) + LD8(104, 84, 100, 98) + LB8("bowman", on("bowman"), 104, 80, NP.bowman[0], "middle");
    s += LD8(88, 172, 88, 150) + LB8("glom", on("glom"), 88, 186, NP.glom[0], "middle");
    s += LD8(26, 201, 43, 165) + LB8("eff", on("eff"), 4, 216, L2(["Efferent", "arteriole"], ["ইফারেন্ট", "আর্টারিওল"]));
    s += LD8(176, 42, 163, 100) + LB8("pct", on("pct"), 196, 20, L2(["Proximal convoluted", "tubule"], ["নিকটবর্তী প্যাঁচানো", "নালিকা"]), "middle");
    s += LD8(268, 142, 262, 176) + LB8("dct", on("dct"), 268, 106, L2(["Distal", "convoluted", "tubule"], ["প্রান্তীয়", "প্যাঁচানো", "নালিকা"]), "middle", 12.5);
    s += LB8("cd", on("cd"), 356, 24, L2(["Collecting", "tubule"], ["সংগ্রাহী", "নালিকা"]), "end");
    s += LB8("loop", on("loop"), 209, 402, NP.loop[0], "middle");
    s += LD8(160, 318, 182, 312) + LB8("cap", on("cap"), 158, 322, L2("Capillaries", "কৈশিক জালিকা"), "end");
    s += T8(8, 374, L2("to the renal vein", "রেনাল শিরার দিকে"), "start", 12, VEIN8, "700") + `<text transform="rotate(90 340 290)" x="340" y="290" font-size="12" fill="var(--muted)">${L2("to the renal pelvis →", "রেনাল পেলভিসের দিকে →")}</text>`;
    $("#b8ks", el).innerHTML = s + `</svg>`;
    tap8($("#b8ks", el), q => { clearTimeout(timer); ns = q; drawNeph(); });
    $("#b8ko", el).innerHTML = `<b>${NP[ns][0]}.</b> ${NP[ns][1]}`;
  };
  const follow = seq => { clearTimeout(timer); let i = 0; const step = () => { if (!el.isConnected || view !== "neph") return; ns = seq[i]; drawNeph(); i++; if (i < seq.length) timer = setTimeout(step, REDUCED ? 1800 : 1300); }; step(); };
  const setView = () => {
    clearTimeout(timer);
    const b = $("#b8kb", el);
    if (view === "kid") { b.innerHTML = `<div class="svgwrap fit" id="b8ks"></div><div class="w-out" id="b8ko"></div>`; drawKid(); }
    else {
      b.innerHTML = `<div class="svgwrap fit" id="b8ks"></div><div class="w-row" style="margin:6px 0"><button class="btn" id="b8kf1">▶ ${L2("Follow the blood", "রক্তের পথ")}</button><button class="btn" id="b8kf2">▶ ${L2("Follow the filtrate", "পরিস্রুত তরলের পথ")}</button></div><div class="w-out" id="b8ko"></div>`;
      $("#b8kf1", el).addEventListener("click", () => follow(["aff", "glom", "eff", "cap"]));
      $("#b8kf2", el).addEventListener("click", () => follow(["bowman", "pct", "loop", "dct", "cd"]));
      drawNeph();
    }
  };
  chipsB8(el, ".b8kv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 8.2.1 urine formation in three steps (moving particles) and the water balance */
W.b8urine = (el) => {
  const N = NEPH8, strip = d => d.replace(/^M\S+ \S+ /, "");
  const TP1 = N.pct, TP2 = TP1 + " " + strip(N.loop), TP3 = TP2 + " " + strip(N.dct), TP = TP3 + " L322 196 L322 404";
  const BP = N.aff + " " + strip(N.glom) + " " + strip(N.eff) + " " + strip(N.cap1);
  const KIND = { w: [WAT8, 3.2], g: [GLU8, 3.8], s: [SALT8, 3.2], u: [UREA8, 3.6], x: ["#b0408f", 3.2], r: [ART8, 4.6], p: ["#5b6b7a", 3.8] };
  const STEPS = [
    [L2("Filtration", "ছাঁকন"), ["glom", "bowman"], L2("<b>Step 1: Ultrafiltration</b> (renal corpuscle). The blood is under pressure in the glomerulus, so the small molecules are pushed out into Bowman's capsule.", "<b>ধাপ ১: আল্ট্রাফিলট্রেশন</b> (রেনাল করপাসল)। গ্লোমেরুলাসে রক্ত চাপের মধ্যে থাকে, তাই ছোট অণুগুলো চাপে বোম্যান্স ক্যাপসুলে বেরিয়ে আসে।"), [L2("<b>Pass through:</b> water, glucose, amino acids, salts, urea", "<b>পার হয়:</b> পানি, গ্লুকোজ, অ্যামাইনো এসিড, লবণ, ইউরিয়া"), L2("<b>Stay in the blood:</b> blood cells and plasma proteins (too big)", "<b>রক্তেই থাকে:</b> রক্তকণিকা ও রক্তরসের প্রোটিন (বেশি বড়)")]],
    [L2("Reabsorption", "পুনঃশোষণ"), ["pct", "loop", "cap"], L2("<b>Step 2: Selective reabsorption</b> (renal tubule). The cells of the tubule take the useful things back and pass them to the capillaries.", "<b>ধাপ ২: বাছাই করা পুনঃশোষণ</b> (রেনাল টিউব্যুল)। টিউব্যুলের কোষগুলো দরকারি জিনিস ফিরিয়ে নিয়ে কৈশিক জালিকার রক্তে তুলে দেয়।"), [L2("<b>Back to the blood:</b> all the glucose and amino acids, most of the water, the salts the body needs", "<b>রক্তে ফিরে যায়:</b> সব গ্লুকোজ ও অ্যামাইনো এসিড, বেশির ভাগ পানি, দেহের দরকারি লবণ"), L2("<b>Left in the tubule:</b> urea, uric acid, creatinine", "<b>টিউব্যুলে থেকে যায়:</b> ইউরিয়া, ইউরিক এসিড, ক্রিয়েটিনিন")]],
    [L2("Secretion", "নিঃসরণ"), ["dct"], L2("<b>Step 3: Secretion</b> (mainly the distal part). A few unwanted substances are moved from the blood into the tubule.", "<b>ধাপ ৩: নিঃসরণ</b> (মূলত প্রান্তীয় অংশে)। কিছু অবাঞ্ছিত পদার্থ রক্ত থেকে টিউব্যুলে চলে আসে।"), [L2("<b>Added to the tubule:</b> extra hydrogen ions (acid), extra potassium ions, a little ammonia, remains of some medicines", "<b>টিউব্যুলে যোগ হয়:</b> বাড়তি হাইড্রোজেন আয়ন (অম্ল), বাড়তি পটাশিয়াম আয়ন, সামান্য অ্যামোনিয়া, কিছু ওষুধের অবশিষ্টাংশ")]],
    [L2("Urine", "মূত্র"), ["cd"], L2("<b>Result: urine.</b> What is left flows down the collecting tubule to the renal pelvis.", "<b>ফল: মূত্র।</b> যা থেকে যায় তা সংগ্রাহী নালিকা বেয়ে রেনাল পেলভিসে চলে যায়।"), [L2("<b>In urine:</b> water (about 1% of what was filtered), urea, uric acid, creatinine, excess salts", "<b>মূত্রে থাকে:</b> পানি (যা ছাঁকা হয়েছিল তার প্রায় ১%), ইউরিয়া, ইউরিক এসিড, ক্রিয়েটিনিন, বাড়তি লবণ"), L2("<b>Not in healthy urine:</b> glucose, protein, blood cells", "<b>সুস্থ মানুষের মূত্রে থাকে না:</b> গ্লুকোজ, প্রোটিন, রক্তকণিকা")]]];
  const LVL = [
    [L2("very little", "খুব কম"), 0.5, "#b9770e", L2("<b>Very little water in the body</b> (a hot day, heavy sweating, almost nothing to drink). The blood is too concentrated. The tubules take back as much water as they can. Urine: very little, dark and concentrated. You feel very thirsty.", "<b>দেহে পানি খুব কম</b> (গরমের দিন, প্রচুর ঘাম, পানি প্রায় খাওয়াই হয়নি)। রক্ত বেশি ঘন হয়ে গেছে। টিউব্যুল যতটা পারে পানি ফিরিয়ে নেয়। মূত্র: খুব অল্প, গাঢ় রঙের ও ঘন। খুব পিপাসা পায়।")],
    [L2("a little low", "একটু কম"), 1, "#d39a1c", L2("<b>A little short of water.</b> The blood is slightly concentrated, so more water than usual is taken back. Urine: less than usual and deeper yellow.", "<b>পানি একটু কম।</b> রক্ত সামান্য ঘন, তাই স্বাভাবিকের চেয়ে বেশি পানি ফিরিয়ে নেওয়া হয়। মূত্র: স্বাভাবিকের চেয়ে কম, রং একটু গাঢ় হলুদ।")],
    [L2("just right", "ঠিকঠাক"), 1.5, "#e6c14a", L2("<b>Water in balance.</b> The nephrons take back about 99% of the filtered water. Urine: about 1.5 litres a day, light yellow.", "<b>পানির ভারসাম্য ঠিক আছে।</b> নেফ্রন ছেঁকে আসা পানির প্রায় ৯৯% ফিরিয়ে নেয়। মূত্র: দিনে প্রায় ১.৫ লিটার, হালকা হলুদ।")],
    [L2("a little high", "একটু বেশি"), 2.2, "#f0dc86", L2("<b>A little more water than needed.</b> The blood is slightly dilute, so less water is taken back. Urine: more than usual and paler.", "<b>প্রয়োজনের চেয়ে পানি একটু বেশি।</b> রক্ত সামান্য পাতলা, তাই পানি কম ফিরিয়ে নেওয়া হয়। মূত্র: স্বাভাবিকের চেয়ে বেশি, রং আরও হালকা।")],
    [L2("a lot", "অনেক বেশি"), 3, "#f7edbd", L2("<b>A lot of extra water</b> (several glasses drunk one after another). The blood is too dilute. The tubules take back much less water. Urine: a lot, almost colourless and very dilute.", "<b>অনেক বাড়তি পানি</b> (পরপর কয়েক গ্লাস পানি খাওয়া হয়েছে)। রক্ত বেশি পাতলা হয়ে গেছে। টিউব্যুল অনেক কম পানি ফিরিয়ে নেয়। মূত্র: প্রচুর, প্রায় বর্ণহীন ও খুব পাতলা।")]];
  let view = "steps", step = 0, tt = 4.2, parts = [], tp = null, bp = null, LT = 0, LB = 0, f1 = 0, f2 = 0, f3 = 0;
  el.innerHTML = `<div class="chipset b8uv" role="group"><button data-v="steps" aria-pressed="true">${B8(1)}. ${L2("Three steps", "তিন ধাপ")}</button><button data-v="bal" aria-pressed="false">${B8(2)}. ${L2("Water balance", "পানিসাম্য")}</button></div><div id="b8ub" style="margin-top:8px"></div>`;
  const mk = () => {
    const a = []; let i = 0; const add = (t, e) => a.push({ t, e, ph: 0, j: ((i++ * 37) % 7) - 3 });
    [0.12, 0.22, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92].forEach(x => add("w", x * f1));
    [0.2, 0.45, 0.85].forEach(x => add("w", f1 + x * (f2 - f1)));
    add("w", f2 + 0.6 * (f3 - f2)); add("w", f3 + 0.35 * (1 - f3)); add("w", null);
    [0.18, 0.36, 0.54, 0.72].forEach(x => add("g", x * f1));
    [0.26, 0.5, 0.74, 0.96].forEach(x => add("s", x * f1)); add("s", f1 + 0.7 * (f2 - f1)); add("s", null);
    for (let q = 0; q < 5; q++) add("u", null);
    a.push({ t: "x", sec: 1, ph: 0.2 }, { t: "x", sec: 1, ph: 0.7 });
    const tub = a.filter(p => !p.sec), order = [0, 14, 22, 5, 18, 9, 23, 1, 15, 19, 12, 24, 6, 2, 16, 20, 10, 25, 7, 3, 17, 21, 13, 26, 8, 4, 11];
    order.forEach((ix, n) => { if (tub[ix]) tub[ix].ph = n / order.length; });
    for (let q = 0; q < 6; q++) a.push({ t: q % 3 === 2 ? "p" : "r", blood: 1, ph: q / 6 });
    return a;
  };
  const place = () => {
    if (!tp) return;
    const us = f2 + 0.5 * (f3 - f2);
    parts.forEach((p, i) => {
      const c = $("#b8ud" + i, el); if (!c) return;
      let x, y, o = 1;
      if (p.blood) { const u = (tt / 9 + p.ph) % 1, pt = bp.getPointAtLength(u * LB); x = pt.x; y = pt.y; o = u > 0.9 ? (1 - u) * 10 : u < 0.04 ? u * 25 : 1; }
      else {
        const cyc = (tt / 18 + p.ph) % 1;
        if (p.sec) {
          const cs = 0.06 + 0.94 * us, pin = tp.getPointAtLength(us * LT);
          if (cyc < cs - 0.07) o = 0, x = 264, y = 240;
          else if (cyc < cs) { const k = (cyc - (cs - 0.07)) / 0.07; x = 264 + (pin.x - 264) * k; y = 240 + (pin.y - 240) * k; o = Math.min(1, k * 4); }
          else { const u = (cyc - 0.06) / 0.94, pt = tp.getPointAtLength(u * LT); x = pt.x; y = pt.y; o = u > 0.97 ? (1 - u) * 33 : 1; }
        } else if (cyc < 0.06) { const k = cyc / 0.06; x = 86 + p.j * 3 + (118 - 86 - p.j * 3) * k; y = 130 + p.j * 2 * (1 - k); o = Math.min(1, k * 5); }
        else {
          const u = (cyc - 0.06) / 0.94;
          if (p.e != null && u >= p.e) {
            const k = (u - p.e) / 0.05, pt = tp.getPointAtLength(p.e * LT); let dx = 0, dy = 1;
            if (p.e > f1 && p.e < f2) { dx = pt.x < 209 ? -1 : 1; dy = 0; } else if (p.e > f3) { dx = -1; dy = 0; }
            x = pt.x + dx * 20 * Math.min(1, k); y = pt.y + dy * 20 * Math.min(1, k); o = Math.max(0, 1 - k);
          } else { const pt = tp.getPointAtLength(u * LT); x = pt.x + (u > f3 ? p.j * 0.8 : 0); y = pt.y; o = u > 0.97 ? (1 - u) * 33 : 1; }
        }
      }
      c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("opacity", Math.max(0, Math.min(1, o)).toFixed(2));
    });
  };
  const drawSteps = () => {
    const hl = STEPS[step][1], on = q => hl.includes(q);
    let s = `<svg viewBox="0 0 360 410" role="img" aria-label="${L2("How a nephron makes urine", "নেফ্রন কীভাবে মূত্র তৈরি করে")}">` + neph8(on, true, true);
    s += `<path id="b8tp" d="${TP}" fill="none" stroke="none"/><path id="b8t1" d="${TP1}" fill="none" stroke="none"/><path id="b8t2" d="${TP2}" fill="none" stroke="none"/><path id="b8t3" d="${TP3}" fill="none" stroke="none"/><path id="b8bp" d="${BP}" fill="none" stroke="none"/>`;
    const tag = (i, x, y, a = "middle") => T8(x, y, B8(i + 1) + " " + STEPS[i][0], a, 13, step === i ? "var(--bad)" : "var(--muted)", step === i ? "700" : "", true);
    s += tag(0, 100, 84) + tag(1, 110, 258) + tag(2, 268, 150) + tag(3, 308, 306, "end");
    s += T8(4, 48, L2("blood in", "রক্ত ঢোকে"), "start", 12.5, ART8, "700", true) + T8(8, 376, L2("blood out, cleaned", "পরিষ্কার রক্ত বের হয়"), "start", 12.5, VEIN8, "700", true) + T8(312, 402, L2("urine", "মূত্র"), "end", 12.5, "var(--ink)", "700", true);
    s += `<g id="b8ug"></g></svg>`;
    $("#b8us", el).innerHTML = s;
    tp = $("#b8tp", el); bp = $("#b8bp", el); LT = tp.getTotalLength(); LB = bp.getTotalLength();
    f1 = $("#b8t1", el).getTotalLength() / LT; f2 = $("#b8t2", el).getTotalLength() / LT; f3 = $("#b8t3", el).getTotalLength() / LT;
    if (!parts.length) parts = mk();
    $("#b8ug", el).innerHTML = parts.map((p, i) => `<circle id="b8ud${i}" r="${KIND[p.t][1]}" fill="${KIND[p.t][0]}" stroke="var(--sheet)" stroke-width="1"/>`).join("");
    place();
    $("#b8uo", el).innerHTML = STEPS[step][2] + UL8(STEPS[step][3]);
  };
  const drawBal = () => {
    const lv = +$("#b8ul", el).value, L = LVL[lv - 1], na = 6 - lv;
    $("#b8ul-v", el).textContent = L[0];
    const wh = 50 + lv * 22, top = 204 - wh;
    let s = `<svg viewBox="0 0 360 244" role="img" aria-label="${L2("Water balance by the kidney", "বৃক্কের মাধ্যমে পানিসাম্য")}">${arrowDefs("b8ba", WAT8)}`;
    s += `<rect x="14" y="${top}" width="92" height="${wh}" fill="${WAT8}" opacity=".3"/>`;
    for (let i = 0; i < 14; i++) { const cx = 24 + (i % 5) * 18 + (Math.floor(i / 5) % 2 ? 8 : 0), cy = top + 14 + (Math.floor(i / 5) + 0.3 * (i % 2)) * ((wh - 26) / 2.6); s += `<circle cx="${cx}" cy="${cy.toFixed(1)}" r="3.4" fill="${SALT8}"/>`; }
    s += `<path d="M14 36 V204 H106 V36" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="8" y1="88" x2="112" y2="88" stroke="var(--good)" stroke-width="1.5" stroke-dasharray="5 3"/>` + T8(60, 24, L2("Blood", "রক্ত"), "middle", 13, "var(--ink)", "700") + T8(18, 82, L2("normal", "স্বাভাবিক"), "start", 12, "var(--good)", "700", true);
    s += T8(60, 222, lv < 3 ? L2("too concentrated", "বেশি ঘন") : lv > 3 ? L2("too dilute", "বেশি পাতলা") : L2("just right", "ঠিকঠাক"), "middle", 13, lv === 3 ? "var(--good)" : "var(--bad)", "700");
    s += `<rect x="196" y="36" width="24" height="176" fill="${L[2]}" stroke="var(--ink)" stroke-width="2"/>` + T8(208, 24, L2("Tubule", "টিউব্যুল"), "middle", 13, "var(--ink)", "700");
    for (let i = 0; i < na; i++) { const y = 124 + (i - (na - 1) / 2) * 26; s += AR8(192, y, 124, y, "b8ba", WAT8, 4); }
    s += T8(158, 232, L2("water taken back", "পানি ফিরে যায়"), "middle", 12.5, WAT8, "700");
    const uh = 14 + lv * 18;
    s += `<path d="M262 96 L270 204 Q271 212 280 212 L322 212 Q331 212 332 204 L340 96" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M${(270.5 - (uh - 8) * 0.074).toFixed(1)} ${212 - uh} L${(331.5 + (uh - 8) * 0.074).toFixed(1)} ${212 - uh} L331 204 Q330 211 322 211 L280 211 Q272 211 271 204 Z" fill="${L[2]}"/>`;
    s += T8(301, 24, L2("Urine", "মূত্র"), "middle", 13, "var(--ink)", "700") + T8(301, 44, L2(`about ${L[1]} L a day`, `দিনে প্রায় ${B8(L[1])} L`), "middle", 12.5, "var(--ink)") + `<path d="M222 190 Q250 190 258 150 Q262 120 282 112" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    $("#b8us", el).innerHTML = s + `</svg>`;
    $("#b8uo", el).innerHTML = L[3] + `<br><span class="muted" style="font-size:13px">${L2("The litres are rough figures to show the pattern.", "লিটারের সংখ্যাগুলো ধরনটা বোঝানোর জন্য মোটামুটি হিসাব।")}</span>`;
  };
  const setView = () => {
    const b = $("#b8ub", el); tp = null;
    if (view === "steps") {
      const dot = (k, t) => `<span style="white-space:nowrap"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${KIND[k][0]}"></span> ${t}</span>`;
      b.innerHTML = `<div class="chipset b8us" role="group">${STEPS.map((q, i) => `<button data-s="${i}" aria-pressed="${i === step}">${B8(i + 1)}. ${q[0]}</button>`).join("")}</div><div class="svgwrap fit" id="b8us" style="margin-top:8px"></div>
        <div class="hint" style="display:flex;flex-wrap:wrap;gap:4px 12px;margin:6px 0">${dot("w", L2("water", "পানি"))}${dot("g", L2("glucose", "গ্লুকোজ"))}${dot("s", L2("salts", "লবণ"))}${dot("u", L2("urea", "ইউরিয়া"))}${dot("x", L2("added wastes", "যোগ হওয়া বর্জ্য"))}${dot("r", L2("blood cell", "রক্তকণিকা"))}${dot("p", L2("protein", "প্রোটিন"))}</div><div class="w-out" id="b8uo"></div>`;
      chipsB8(el, ".b8us", q => { step = +q.dataset.s; drawSteps(); });
      drawSteps();
    } else {
      b.innerHTML = `<div class="svgwrap fit" id="b8us"></div>${slider("b8ul", L2("Water in the body", "দেহে পানির পরিমাণ"), 1, 5, 1, 3, "")}<div class="w-out" id="b8uo"></div>`;
      $("#b8ul", el).addEventListener("input", drawBal); drawBal();
    }
  };
  chipsB8(el, ".b8uv", b => { view = b.dataset.v; setView(); });
  setView();
  if (!REDUCED) animate(el, dt => { if (view !== "steps" || !tp || !tp.isConnected) return; tt += dt; place(); });
};

/* 8.3 kidney stone, dialysis machine, transplantation, and healthy habits */
W.b8dialysis = (el) => {
  const STONE = [
    [L2("In the kidney", "বৃক্কের ভেতরে"), L2("<b>A stone has formed in the kidney.</b> When the urine has too little water for its salts, tiny crystals appear and slowly grow into a stone. At first it usually causes no trouble, and the urine flows normally.", "<b>বৃক্কে পাথর তৈরি হয়েছে।</b> মূত্রে লবণের তুলনায় পানি খুব কম হলে ক্ষুদ্র দানা তৈরি হয়, যা ধীরে ধীরে বড় হয়ে পাথর হয়। প্রথম দিকে সাধারণত তেমন সমস্যা হয় না, মূত্র স্বাভাবিকভাবেই বয়ে যায়।"), [L2("Causes: too little water, excess body weight, kidney infection", "কারণ: কম পানি পান করা, অতিরিক্ত শারীরিক ওজন, কিডনির সংক্রমণ"), L2("Men are more likely to get stones than women", "মেয়েদের চেয়ে পুরুষের পাথর হওয়ার আশঙ্কা বেশি")]],
    [L2("Stuck in the ureter", "ইউরেটারে আটকে গেছে"), L2("<b>The stone has moved into the ureter and blocks the urine.</b> Now the trouble begins.", "<b>পাথর ইউরেটারে নেমে এসে মূত্রের পথ আটকে দিয়েছে।</b> এখন সমস্যা শুরু হয়।"), [L2("Pain at the back of the waist", "কোমরের পেছনে ব্যথা"), L2("Blood may come with the urine", "প্রস্রাবের সাথে রক্ত যেতে পারে"), L2("Sometimes fever with shivering", "কখনো কাঁপুনি দিয়ে জ্বর"), L2("See a doctor without delay", "দেরি না করে ডাক্তার দেখাতে হবে")]],
    [L2("Treatment", "চিকিৎসা"), L2("<b>The treatment depends on the size and position of the stone.</b> Here it has been broken into fine pieces that pass out with the urine.", "<b>চিকিৎসা নির্ভর করে পাথরের আকার ও অবস্থানের ওপর।</b> এখানে পাথরটি গুঁড়ো করা হয়েছে, টুকরোগুলো মূত্রের সাথে বেরিয়ে যাচ্ছে।"), [L2("Small stone: plenty of water and medicines", "ছোট পাথর: বেশি পানি পান ও ওষুধ"), L2("Ureteroscopy: taken out with a fine instrument passed up the ureter", "ইউরেটারোস্কোপি: ইউরেটার দিয়ে সরু যন্ত্র ঢুকিয়ে বের করা"), L2("Ultrasonic lithotripsy: broken up with sound waves", "আল্ট্রাসনিক লিথোট্রিপসি: শব্দতরঙ্গ দিয়ে গুঁড়ো করা"), L2("Or an operation on the kidney", "অথবা বৃক্কে অস্ত্রোপচার")]]];
  const SUB = {
    urea: [L2("Urea", "ইউরিয়া"), "u", L2("<b>Urea crosses.</b> The blood has a lot of urea and the dialysis fluid has none, so urea diffuses out through the wall of the tube. The fluid carries it away, and fresh fluid keeps coming in.", "<b>ইউরিয়া পার হয়।</b> রক্তে ইউরিয়া অনেক, ডায়ালাইসিস তরলে একেবারেই নেই; তাই ইউরিয়া ব্যাপিত হয়ে টিউবের প্রাচীর ভেদ করে বেরিয়ে আসে। তরল তাকে বয়ে নিয়ে যায়, আর নতুন তরল আসতে থাকে।")],
    cell: [L2("Blood cells", "রক্তকণিকা"), "r", L2("<b>Blood cells do not cross.</b> They are far too big for the tiny pores of the tube wall, so they stay in the blood and return to the patient.", "<b>রক্তকণিকা পার হয় না।</b> টিউবের প্রাচীরের অতি সূক্ষ্ম ছিদ্রের তুলনায় এরা অনেক বড়, তাই রক্তেই থেকে যায় এবং রোগীর দেহে ফিরে যায়।")],
    prot: [L2("Proteins", "প্রোটিন"), "p", L2("<b>Proteins do not cross.</b> The large protein molecules of the plasma cannot pass through the selectively permeable wall.", "<b>প্রোটিন পার হয় না।</b> রক্তরসের বড় বড় প্রোটিন অণু বৈষম্যভেদ্য প্রাচীর ভেদ করতে পারে না।")],
    glu: [L2("Glucose", "গ্লুকোজ"), "g", L2("<b>Glucose is small enough to cross, but the blood does not lose it.</b> The fluid is made with the same glucose as healthy plasma. With equal amounts on both sides there is no overall movement.", "<b>গ্লুকোজ পার হওয়ার মতো ছোট, তবু রক্ত তা হারায় না।</b> তরলে সুস্থ রক্তরসের সমান গ্লুকোজ রাখা হয়। দুই পাশে সমান থাকায় মোটের ওপর কোনো চলাচল হয় না।")],
    salt: [L2("Extra salts", "বাড়তি লবণ"), "s", L2("<b>Only the extra crosses.</b> The fluid has the useful salts in the normal amounts. If the blood has more of a salt than that, the excess diffuses out until both sides are equal.", "<b>শুধু বাড়তিটুকু পার হয়।</b> তরলে দরকারি লবণ স্বাভাবিক পরিমাণে থাকে। রক্তে কোনো লবণ তার চেয়ে বেশি থাকলে বাড়তিটুকু ব্যাপিত হয়ে বেরিয়ে আসে, যতক্ষণ না দুই পাশ সমান হয়।")]};
  const TR = {
    neu: [L2("New kidney", "নতুন বৃক্ক"), L2("The healthy kidney from the donor is usually placed low in the abdomen. Its artery and vein are joined to the patient's blood vessels, and its ureter is joined to the urinary bladder. It then works all the time, like a normal kidney.", "দাতার সুস্থ বৃক্কটি সাধারণত তলপেটে বসানো হয়। এর ধমনি ও শিরা রোগীর রক্তনালির সাথে আর ইউরেটার মূত্রথলির সাথে জুড়ে দেওয়া হয়। এরপর এটি স্বাভাবিক বৃক্কের মতো সারাক্ষণ কাজ করে।")],
    old: [L2("Old kidneys", "পুরোনো বৃক্ক"), L2("The patient's own failed kidneys are usually left where they are. One working kidney is enough for life, so the patient needs only one new kidney.", "রোগীর নিজের বিকল বৃক্ক দুটি সাধারণত যেখানে ছিল সেখানেই রেখে দেওয়া হয়। একটি বৃক্ক কার্যক্ষম থাকলেই জীবনধারণ করা যায়, তাই রোগীর একটি নতুন বৃক্কই যথেষ্ট।")],
    don: [L2("Donor", "দাতা"), L2("The kidney comes from a <b>close relative</b> (father, mother, brother, sister, maternal uncle, aunt and so on), who can live healthily with the one kidney left, or from a <b>brain-dead</b> person whose organs are being kept alive artificially (posthumous donation).", "বৃক্ক আসে <b>নিকট আত্মীয়ের</b> (বাবা, মা, ভাইবোন, মামা, খালা প্রভৃতি) কাছ থেকে, যিনি বাকি একটি বৃক্ক নিয়েই সুস্থ থাকতে পারেন; অথবা এমন <b>ব্রেন ডেড</b> ব্যক্তির কাছ থেকে, যাঁর অঙ্গপ্রত্যঙ্গ কৃত্রিমভাবে জীবিত রাখা হয়েছে (মরণোত্তর দান)।")],
    mat: [L2("Tissue match", "টিস্যু ম্যাচ"), L2("The donor's tissue must match the patient's. If it does not, the patient's defence system treats the new kidney as foreign and attacks it. The match is most likely with parents, brothers, sisters and close relatives.", "দাতার টিস্যু রোগীর টিস্যুর সাথে ম্যাচ করতে হয়। না করলে রোগীর প্রতিরক্ষা ব্যবস্থা নতুন বৃক্কটিকে অচেনা ভেবে আক্রমণ করে। পিতামাতা, ভাইবোন ও নিকট আত্মীয়ের সাথে ম্যাচ হওয়ার সম্ভাবনা সবচেয়ে বেশি।")]};
  const HAB = [
    [L2("Drinking water whenever you feel thirsty", "পিপাসা পেলেই পানি পান করা"), 1, L2("The need for water differs from person to person and with the weather; thirst is the body's own signal.", "পানির চাহিদা ব্যক্তি ও আবহাওয়াভেদে আলাদা; পিপাসাই দেহের নিজস্ব সংকেত।")],
    [L2("Drinking oral saline every time you sweat, with no diarrhoea or vomiting", "ডায়রিয়া বা বমি ছাড়াই ঘামলেই খাবার স্যালাইন খাওয়া"), 0, L2("It loads the body with extra salt, and for elderly people it can be dangerous. Water or lemon sherbet with a pinch of salt is enough.", "এতে দেহে বাড়তি লবণ ঢোকে, বয়স্কদের জন্য বিপদও হতে পারে। পানি বা সামান্য লবণ দেওয়া লেবুর শরবতই যথেষ্ট।")],
    [L2("Keeping diabetes and high blood pressure under control", "ডায়াবেটিস ও উচ্চ রক্তচাপ নিয়ন্ত্রণে রাখা"), 1, L2("These two slowly damage the kidneys and are major causes of kidney failure.", "এ দুটি রোগ ধীরে ধীরে বৃক্কের ক্ষতি করে; বৃক্ক বিকলের বড় কারণ এগুলো।")],
    [L2("Taking pain-killing medicines often, without a doctor's advice", "ডাক্তারের পরামর্শ ছাড়া ঘন ঘন ব্যথার ওষুধ খাওয়া"), 0, L2("Painkillers should be avoided as far as possible; some medicines can harm the kidneys.", "ব্যথা নিরাময়ের ওষুধ যথাসম্ভব পরিহার করা উচিত; কিছু ওষুধ বৃক্কের ক্ষতি করতে পারে।")],
    [L2("Getting a child's tonsillitis or scabies treated quickly", "শিশুর টনসিল বা খোসপাঁচড়ার দ্রুত চিকিৎসা করানো"), 1, L2("If these infections are neglected, kidney disease can follow.", "এসব সংক্রমণ অবহেলা করলে তা থেকে কিডনির অসুখ হতে পারে।")],
    [L2("Smoking", "ধূমপান"), 0, L2("Giving up smoking is one of the ways to keep the kidneys healthy.", "বৃক্ক সুস্থ রাখার একটি উপায় হলো ধূমপান ত্যাগ করা।")],
    [L2("Drinking very little water all day", "সারা দিন খুব কম পানি পান করা"), 0, L2("Too little water is a cause of kidney stones and of urinary tract disease.", "কম পানি পান করা বৃক্কে পাথর ও মূত্রনালির রোগের একটি কারণ।")],
    [L2("Forcing down far more water than you need", "প্রয়োজনের চেয়ে অনেক বেশি পানি জোর করে খাওয়া"), 0, L2("More water than the body needs should not be drunk; drink when thirsty.", "প্রয়োজনের অতিরিক্ত পানি পান করা ঠিক নয়; পিপাসা পেলে পান করো।")],
    [L2("Getting severe diarrhoea or heavy bleeding treated at once", "মারাত্মক ডায়রিয়া বা রক্তক্ষরণের দ্রুত চিকিৎসা করানো"), 1, L2("Severe diarrhoea and heavy blood loss can make the kidneys fail suddenly.", "মারাত্মক ডায়রিয়া ও অতিরিক্ত রক্তক্ষরণে বৃক্ক হঠাৎ অকেজো হয়ে যেতে পারে।")]];
  const KIND = { u: [UREA8, 3.6], r: [ART8, 5], p: ["#5b6b7a", 4], g: [GLU8, 3.8], s: [SALT8, 3.2] };
  let view = "stone", st = 0, sub = "urea", ts = "neu", hi = 0, hans = -1, score = 0, tt = 0, pth = null, PL = 0, dots = [];
  el.innerHTML = `<div class="chipset b8dv" role="group"><button data-v="stone" aria-pressed="true">${B8(1)}. ${L2("Stone", "পাথর")}</button><button data-v="dial" aria-pressed="false">${B8(2)}. ${L2("Dialysis", "ডায়ালাইসিস")}</button><button data-v="trans" aria-pressed="false">${B8(3)}. ${L2("Transplant", "প্রতিস্থাপন")}</button><button data-v="habit" aria-pressed="false">${B8(4)}. ${L2("Habits", "অভ্যাস")}</button></div><div id="b8db" style="margin-top:8px"></div>`;
  const URP = "M118 112 C160 114 178 150 182 186 C186 224 204 248 240 258";
  const placeStone = () => {
    if (!pth) return;
    for (let i = 0; i < 6; i++) {
      const c = $("#b8sd" + i, el); if (!c) continue;
      let u = (tt / 6 + i / 6) % 1, o = 1;
      if (st === 1) { u = u * 0.42; o = 0.9; }
      const pt = pth.getPointAtLength(u * PL);
      c.setAttribute("cx", pt.x.toFixed(1)); c.setAttribute("cy", pt.y.toFixed(1)); c.setAttribute("opacity", o);
    }
  };
  const drawStone = () => {
    const blocked = st === 1;
    let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("A kidney stone", "বৃক্কের পাথর")}">`;
    s += `<path d="${URP}" fill="none" stroke="var(--ink)" stroke-width="15" stroke-linecap="round"/>`;
    if (blocked) s += `<path d="M118 112 C160 114 178 150 181.5 180" fill="none" stroke="var(--ink)" stroke-width="23" stroke-linecap="round"/><path d="M118 112 C160 114 178 150 181.5 180" fill="none" stroke="${PEL8}" stroke-width="19" stroke-linecap="round"/>`;
    s += `<path id="b8sp" d="${URP}" fill="none" stroke="${PEL8}" stroke-width="11" stroke-linecap="round"/>`;
    s += `<path d="${bean8(84, 112, 1.6, 1)}" fill="${KID8}" stroke="var(--ink)" stroke-width="2"/><ellipse cx="${blocked ? 106 : 104}" cy="112" rx="${blocked ? 22 : 16}" ry="${blocked ? 34 : 26}" fill="${PEL8}" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<path d="M300 222 C340 226 344 270 318 284 C296 296 250 292 238 270 C230 252 250 220 300 222 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><path d="M240 264 Q286 252 334 262 Q330 278 318 284 C296 296 250 292 240 264 Z" fill="${blocked ? "#d98a6a" : URI8}" opacity=".6"/>`;
    for (let i = 0; i < 6; i++) s += `<circle id="b8sd${i}" r="3" fill="${URI8}" stroke="var(--ink)" stroke-width=".8"/>`;
    const rock = (x, y, r) => `<path d="M${x - r} ${y - r * 0.2} L${x - r * 0.4} ${y - r} L${x + r * 0.6} ${y - r * 0.8} L${x + r} ${y} L${x + r * 0.5} ${y + r * 0.9} L${x - r * 0.6} ${y + r * 0.8} Z" fill="#8a8378" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round"/>`;
    if (st === 0) s += rock(104, 120, 8) + LD8(176, 74, 112, 114) + T8(180, 72, L2("stone", "পাথর"), "start", 13, "var(--ink)", "700");
    else if (st === 1) {
      s += rock(182, 188, 8.5) + LD8(232, 180, 194, 187) + T8(236, 176, L2("stone blocks", "পাথরে পথ"), "start", 13, "var(--bad)", "700") + T8(236, 192, L2("the ureter", "বন্ধ"), "start", 13, "var(--bad)", "700");
      s += `<path d="M22 212 l10 -9 l6 9 l10 -9 l6 9 l10 -9 l6 9 l10 -9" fill="none" stroke="var(--bad)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` + T8(22, 232, L2("pain at the back", "কোমরের পেছনে"), "start", 13, "var(--bad)", "700") + T8(22, 248, L2("of the waist", "ব্যথা"), "start", 13, "var(--bad)", "700");
      s += T8(184, 134, L2("urine held back", "মূত্র আটকে আছে"), "start", 12.5, "var(--ink)", "", true);
    } else s += [[190, 214, 3], [204, 238, 2.6], [226, 254, 3], [262, 270, 2.6], [288, 276, 3]].map(([x, y, r]) => rock(x, y, r)).join("") + LD8(150, 236, 198, 238) + T8(146, 240, L2("fine pieces", "ছোট টুকরো"), "end", 13, "var(--ink)", "700");
    s += T8(60, 24, L2("kidney", "বৃক্ক"), "middle", 13, "var(--ink)", "", true) + T8(198, 142, st === 1 ? "" : L2("ureter", "ইউরেটার"), "start", 13, "var(--ink)", "", true) + T8(290, 212, L2("urinary bladder", "মূত্রথলি"), "middle", 13, "var(--ink)", "", true);
    $("#b8ds", el).innerHTML = s + `</svg>`;
    pth = $("#b8sp", el); PL = pth.getTotalLength(); placeStone();
    $("#b8do", el).innerHTML = STONE[st][1] + UL8(STONE[st][2]);
  };
  const BLD = "M176 30 H300 V134 Q300 150 284 150 H106 Q88 150 88 173 Q88 196 106 196 H282 Q300 196 300 219 Q300 242 282 242 H34 V50 H70";
  const placeDial = () => {
    if (!pth) return;
    const k = SUB[sub][1];
    dots.forEach((d, i) => {
      const c = $("#b8dd" + i, el); if (!c) return;
      const u = (tt / 14 + d.ph) % 1; let pt = pth.getPointAtLength(Math.min(u, d.e != null ? d.e : 1) * PL), x = pt.x, y = pt.y, o = 1;
      if (d.e != null && u > d.e) { const q = (u - d.e) / 0.1; x = pt.x - 26 * Math.min(1, q); y = pt.y + d.dir * 14 * Math.min(1, q * 2.5) - 10 * Math.max(0, q - 0.4); o = 1 - q; }
      else if (u > 0.97) o = (1 - u) * 33; else if (u < 0.03) o = u * 33;
      c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("opacity", (Math.max(0, Math.min(1, o)) * (d.t === k ? 1 : 0.45)).toFixed(2));
      c.setAttribute("r", d.t === k ? KIND[d.t][1] + 1.2 : KIND[d.t][1]);
    });
  };
  const drawDial = () => {
    const k = SUB[sub][1];
    let s = `<svg viewBox="0 0 360 318" role="img" aria-label="${L2("A dialysis machine", "ডায়ালাইসিস মেশিন")}">${arrowDefs("b8da", "var(--ink)")}${arrowDefs("b8db2", WAT8)}`;
    s += `<path d="M6 12 H196 Q208 12 208 24 V56 Q208 68 196 68 H6" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.5"/><line x1="6" y1="30" x2="176" y2="30" stroke="${ART8}" stroke-width="6" stroke-linecap="round"/><line x1="6" y1="50" x2="70" y2="50" stroke="${VEIN8}" stroke-width="6" stroke-linecap="round"/><line x1="70" y1="50" x2="176" y2="50" stroke="${VEIN8}" stroke-width="6" stroke-linecap="round" opacity=".35"/>`;
    s += `<rect x="62" y="122" width="266" height="148" rx="12" fill="${WAT8}" opacity=".16"/><rect x="62" y="122" width="266" height="148" rx="12" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    s += `<path d="M300 112 V134 Q300 150 284 150 H106 Q88 150 88 173 Q88 196 106 196 H282 Q300 196 300 219 Q300 242 282 242 H62" fill="none" stroke="var(--ink)" stroke-width="15" stroke-linecap="butt" stroke-dasharray="3 3"/>`;
    s += `<path d="M176 30 H300 V112 M62 242 H34 V50 H70" fill="none" stroke="var(--ink)" stroke-width="13" stroke-linejoin="round"/><path id="b8dp" d="${BLD}" fill="none" stroke="#f1b8ae" stroke-width="10" stroke-linejoin="round"/>`;
    s += `<circle cx="252" cy="30" r="15" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/><path d="M246 22 L260 30 L246 38 Z" fill="var(--ink)"/>`;
    [[110, 170], [180, 224], [252, 168], [140, 258], [232, 262], [306, 172]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="${k === "g" ? 4.8 : 3.6}" fill="${GLU8}" opacity="${k === "g" ? 1 : 0.5}"/>`; });
    [[146, 172], [214, 222], [282, 262], [110, 262]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="${k === "s" ? 4.2 : 3}" fill="${SALT8}" opacity="${k === "s" ? 1 : 0.5}"/>`; });
    s += dots.map((d, i) => `<circle id="b8dd${i}" r="${KIND[d.t][1]}" fill="${KIND[d.t][0]}" stroke="var(--sheet)" stroke-width="1"/>`).join("");
    s += AR8(190, 302, 190, 274, "b8db2", WAT8, 4) + T8(200, 298, L2("fresh dialysis fluid in", "নতুন ডায়ালাইসিস তরল ঢোকে"), "start", 12.5, WAT8, "700");
    s += AR8(130, 120, 130, 90, "b8db2", UREA8, 4) + T8(140, 100, L2("used fluid out,", "ব্যবহৃত তরল বের হয়,"), "start", 12.5, UREA8, "700") + T8(140, 115, L2("with the urea", "ইউরিয়াসহ"), "start", 12.5, UREA8, "700");
    s += T8(12, 24, L2("artery", "ধমনি"), "start", 12, ART8, "700", true) + T8(12, 64, L2("vein", "শিরা"), "start", 12, VEIN8, "700", true) + T8(110, 44, L2("patient's arm", "রোগীর হাত"), "middle", 12, "var(--muted)");
    s += T8(252, 62, L2("pump", "পাম্প"), "middle", 12.5, "var(--ink)", "", true) + T8(194, 137, L2("dialysis tube", "ডায়ালাইসিস টিউব"), "middle", 12.5, "var(--ink)", "700", true) + T8(194, 216, L2("dialysis fluid", "ডায়ালাইসিস তরল"), "middle", 12.5, WAT8, "700", true);
    s += T8(4, 268, L2("cleaned blood", "পরিষ্কার রক্ত"), "start", 12.5, "var(--ink)", "700", true) + T8(4, 284, L2("↑ back to the vein", "↑ শিরায় ফেরে"), "start", 12.5, "var(--ink)", "", true);
    $("#b8ds", el).innerHTML = s + `</svg>`;
    pth = $("#b8dp", el); PL = pth.getTotalLength(); placeDial();
    $("#b8do", el).innerHTML = SUB[sub][2];
  };
  const drawTrans = () => {
    const on = q => q === ts, gray = "#a9a39a";
    let s = `<svg viewBox="0 0 360 318" role="img" aria-label="${L2("Where a transplanted kidney is placed", "প্রতিস্থাপিত বৃক্ক কোথায় বসানো হয়")}">`;
    s += `<path d="M58 6 Q40 100 62 180 Q46 250 70 314 M302 6 Q320 100 298 180 Q314 250 290 314" fill="none" stroke="var(--rule)" stroke-width="2"/>`;
    s += `<path d="M172 16 V190 L128 300" fill="none" stroke="${VEIN8}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M172 190 L212 300" fill="none" stroke="${VEIN8}" stroke-width="8" stroke-linecap="round"/><path d="M188 16 V190 L148 300" fill="none" stroke="${ART8}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M188 190 L232 300" fill="none" stroke="${ART8}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M112 92 L172 96 M112 84 L188 88 M248 80 L188 84 M248 90 L172 94" fill="none" stroke="${gray}" stroke-width="4" stroke-linecap="round"/><path d="M116 108 C130 170 160 230 174 262 M244 104 C232 170 204 230 190 262" fill="none" stroke="${gray}" stroke-width="3.5" stroke-linecap="round"/>`;
    s += `<g data-k="old" style="cursor:pointer"><path d="${bean8(100, 92, 0.8, 1)}" fill="${gray}" stroke="${on("old") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("old") ? 3.5 : 1.5}"/><path d="${bean8(260, 86, 0.8, -1)}" fill="${gray}" stroke="${on("old") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("old") ? 3.5 : 1.5}"/></g>`;
    s += `<path d="M180 258 C206 258 212 280 202 294 C194 304 166 304 158 294 C148 280 154 258 180 258 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.8"/><path d="M157 284 Q180 278 203 284 Q204 290 202 294 C194 304 166 304 158 294 Z" fill="${URI8}" opacity=".6"/>`;
    s += `<path d="M116 234 L148 250" fill="none" stroke-linecap="round" stroke-width="5" stroke="${VEIN8}"/><path d="M116 222 L171 236" fill="none" stroke-linecap="round" stroke-width="5" stroke="${ART8}"/><path d="M114 242 C130 262 148 270 160 274" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><path d="M114 242 C130 262 148 270 160 274" fill="none" stroke="${URI8}" stroke-width="3" stroke-linecap="round"/>`;
    s += `<g data-k="neu" style="cursor:pointer"><path d="${bean8(100, 226, 0.75, 1)}" fill="${KID8}" stroke="${on("neu") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("neu") ? 3.5 : 1.8}"/></g>`;
    s += LB8("old", on("old"), 260, 144, L2(["old kidneys", "(left in place)"], ["পুরোনো বৃক্ক", "(রেখে দেওয়া হয়)"]), "middle") + LB8("neu", on("neu"), 6, 196, L2("new kidney", "নতুন বৃক্ক"), "start");
    s += LD8(240, 226, 158, 240) + T8(244, 222, L2("joined to the", "রোগীর রক্তনালির"), "start", 12.5, "var(--ink)", "", true) + T8(244, 237, L2("blood vessels", "সাথে যুক্ত"), "start", 12.5, "var(--ink)", "", true);
    s += LD8(240, 276, 206, 282) + T8(244, 280, L2("urinary bladder", "মূত্রথলি"), "start", 12.5, "var(--ink)", "", true) + T8(196, 12, L2("aorta", "মহাধমনি"), "start", 12, ART8, "700") + T8(164, 12, L2("vena cava", "মহাশিরা"), "end", 12, VEIN8, "700");
    $("#b8ds", el).innerHTML = s + `</svg>`;
    tap8($("#b8ds", el), q => { ts = q; el.querySelectorAll(".b8dt button").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === ts)); drawTrans(); });
    $("#b8do", el).innerHTML = `<b>${TR[ts][0]}.</b> ${TR[ts][1]}`;
  };
  const drawHabit = () => {
    const done = hi >= HAB.length, b = $("#b8db", el);
    if (done) { b.innerHTML = `<div class="w-out"><b>${L2(`You got ${score} out of ${HAB.length}.`, `${B8(HAB.length)}টির মধ্যে ${B8(score)}টি ঠিক হয়েছে।`)}</b> ${L2("Protecting the kidneys is far easier than replacing them.", "বৃক্ক বদলানোর চেয়ে বৃক্ক রক্ষা করা অনেক সহজ।")}</div><div class="w-row" style="margin-top:8px"><button class="btn" id="b8hr">${L2("Try again", "আবার চেষ্টা করো")}</button></div>`; $("#b8hr", el).addEventListener("click", () => { hi = 0; score = 0; hans = -1; drawHabit(); }); return; }
    const H = HAB[hi];
    b.innerHTML = `<div class="hint">${B8(hi + 1)} / ${B8(HAB.length)}</div><div style="border:1px solid var(--rule);border-radius:12px;padding:14px;background:var(--paper);font-size:18px;margin:6px 0">${H[0]}</div>
      <div class="w-row"><button class="btn" data-a="1">👍 ${L2("Good for the kidneys", "বৃক্কের জন্য ভালো")}</button><button class="btn" data-a="0">👎 ${L2("Not good", "ভালো নয়")}</button></div><div id="b8ho" style="margin-top:8px"></div>`;
    b.querySelectorAll("button[data-a]").forEach(q => q.addEventListener("click", () => {
      if (hans >= 0) return; hans = +q.dataset.a; const ok = hans === H[1]; if (ok) score++;
      b.querySelectorAll("button[data-a]").forEach(z => { z.disabled = true; if (+z.dataset.a === H[1]) z.classList.add("solid"); });
      $("#b8ho", el).innerHTML = `<div class="w-out" style="border-left:5px solid var(--${ok ? "good" : "bad"})"><b style="color:var(--${ok ? "good" : "bad"})">${ok ? L2("Correct.", "ঠিক বলেছ।") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${H[1] ? L2("This is a good habit.", "এটি ভালো অভ্যাস।") : L2("This is not good for the kidneys.", "এটি বৃক্কের জন্য ভালো নয়।")} ${H[2]}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b8hn">${hi + 1 < HAB.length ? L2("Next", "পরেরটি") : L2("See the score", "ফল দেখো")} ▶</button></div>`;
      $("#b8hn", el).addEventListener("click", () => { hi++; hans = -1; drawHabit(); });
    }));
  };
  const mkDots = () => {
    const a = [];
    [0.24, 0.295, 0.35, 0.405, 0.46, 0.515, 0.57, 0.625, 0.68, 0.735].forEach((e, i) => a.push({ t: "u", e, dir: i % 2 ? 1 : -1, ph: (i * 0.37) % 1 }));
    for (let i = 0; i < 7; i++) a.push({ t: "r", ph: i / 7 + 0.03 });
    for (let i = 0; i < 3; i++) a.push({ t: "p", ph: i / 3 + 0.09 });
    for (let i = 0; i < 3; i++) a.push({ t: "g", ph: i / 3 + 0.2 });
    for (let i = 0; i < 2; i++) a.push({ t: "s", e: 0.4 + i * 0.25, dir: i ? 1 : -1, ph: i / 2 + 0.31 }, { t: "s", ph: i / 2 + 0.05 });
    return a;
  };
  const setView = () => {
    const b = $("#b8db", el); pth = null;
    if (view === "stone") {
      b.innerHTML = `<div class="chipset b8ds2" role="group">${STONE.map((q, i) => `<button data-s="${i}" aria-pressed="${i === st}">${B8(i + 1)}. ${q[0]}</button>`).join("")}</div><div class="svgwrap fit" id="b8ds" style="margin-top:8px"></div><div class="w-out" id="b8do"></div>`;
      chipsB8(el, ".b8ds2", q => { st = +q.dataset.s; drawStone(); });
      drawStone();
    } else if (view === "dial") {
      if (!dots.length) dots = mkDots();
      b.innerHTML = `<div class="svgwrap fit" id="b8ds"></div><div class="hint" style="margin:6px 0 4px">${L2("Can it cross the wall of the tube?", "টিউবের প্রাচীর পার হতে পারে কি?")}</div><div class="chipset b8dc" role="group">${Object.keys(SUB).map(q => `<button data-c="${q}" aria-pressed="${q === sub}"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${KIND[SUB[q][1]][0]};margin-right:5px"></span>${SUB[q][0]}</button>`).join("")}</div><div class="w-out" id="b8do" style="margin-top:8px"></div>`;
      chipsB8(el, ".b8dc", q => { sub = q.dataset.c; drawDial(); });
      drawDial();
    } else if (view === "trans") {
      b.innerHTML = `<div class="svgwrap fit" id="b8ds"></div><div class="chipset b8dt" role="group" style="margin:6px 0">${Object.keys(TR).map(q => `<button data-t="${q}" aria-pressed="${q === ts}">${TR[q][0]}</button>`).join("")}</div><div class="w-out" id="b8do"></div>`;
      chipsB8(el, ".b8dt", q => { ts = q.dataset.t; drawTrans(); });
      drawTrans();
    } else drawHabit();
  };
  chipsB8(el, ".b8dv", b => { view = b.dataset.v; setView(); });
  setView();
  if (!REDUCED) animate(el, dt => { if (!pth || !pth.isConnected) return; tt += dt; if (view === "stone") placeStone(); else if (view === "dial") placeDial(); });
  else tt = 5;
};
