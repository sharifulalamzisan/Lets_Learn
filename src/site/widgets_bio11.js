/* ---- biology chapter 11 widgets: reproduction in organisms ---- */
const B11 = x => bnNum(x, LANG);
const chips11 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T11 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "", halo = false) => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${halo ? ` paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"` : ""}>${s}</text>`;
const LD11 = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--sheet)" stroke-width="3.5"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ink)" stroke-width="1" opacity=".7"/><circle cx="${x2}" cy="${y2}" r="2.2" fill="var(--ink)"/>`;
const AR11 = (x1, y1, x2, y2, id, c, w = 2.5, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;
/* tappable label; t may be an array of lines */
const LB11 = (k, on, x, y, t, a = "start", sz = 13) => { const ls = Array.isArray(t) ? t : [t]; return `<text data-k="${k}" x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${on ? "var(--bad)" : "var(--ink)"}" font-weight="${on ? 700 : 400}" paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" style="cursor:pointer">${ls.map((s, i) => `<tspan x="${x}" dy="${i ? sz + 2 : 0}">${s}</tspan>`).join("")}</text>`; };
const tap11 = (root, cb) => root.querySelectorAll("[data-k]").forEach(g => g.addEventListener("click", () => cb(g.dataset.k)));
const UL11 = a => `<ul style="margin:4px 0 0;padding-left:20px">${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
const tabs11 = (cls, items, cur) => `<div class="chipset ${cls}" role="group">${items.map(([k, t], i) => `<button data-v="${k}" aria-pressed="${k === cur}">${B11(i + 1)}. ${t}</button>`).join("")}</div>`;
const DK11 = "#1f2933", MALE11 = "#3b76b8", FEM11 = "#c8577a", PET11 = "#e0607e", SEP11 = "#5a9e4b", STA11 = "#e0a82e", CAR11 = "#9cc77a", OVU11 = "#f4e3a6", POL11 = "#d99a1c", ENDO11 = "#e9c85a", EMB11 = "#3f9d5a", WALL11 = "#e2a39a", BLOOD11 = "#c8473d", VEIN11 = "#3b76b8";
/* a cell with two colours (half from each parent) */
const duo11 = (x, y, r, sw = 1.6) => `<path d="M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} Z" fill="${MALE11}" opacity=".3"/><path d="M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z" fill="${FEM11}" opacity=".3"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="var(--ink)" stroke-width="${sw}"/>`;
/* a tiny sperm: head at (x,y), tail pointing along angle a (degrees) */
const sperm11 = (x, y, a = 180, s = 1, c = MALE11) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M5 0 q5 -5 10 0 t10 0" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="5.5" ry="4" fill="${c}"/></g>`;

/* 11.1 asexual (one cell doubling) and sexual (meiosis, fertilisation, mitosis) reproduction */
W.b11repro = (el) => {
  const ORG = [[L2("Human", "মানুষ"), 46], [L2("Rice", "ধান"), 24], [L2("Maize", "ভুট্টা"), 20], [L2("Pea", "মটর"), 14]];
  let mode = "asex", gen = 0, org = 0, step = 0;
  el.innerHTML = `<div class="chipset b11rm" role="group"><button data-m="asex" aria-pressed="true">${L2("Asexual", "অযৌন")}</button><button data-m="sex" aria-pressed="false">${L2("Sexual", "যৌন")}</button></div><div id="b11rb" style="margin-top:8px"></div>`;
  const drawA = () => {
    const n = 2 ** gen, cols = n <= 8 ? n : n <= 32 ? 8 : 16, rows = n / cols, dx = Math.min(64, 340 / cols), dy = Math.min(60, 150 / rows), r = Math.min(26, dx * 0.42, dy * 0.42);
    let s = `<svg viewBox="0 0 360 170" role="img" aria-label="${L2("One cell dividing again and again", "একটি কোষ বারবার ভাগ হচ্ছে")}">`;
    for (let i = 0; i < n; i++) { const cx = 180 + (i % cols - (cols - 1) / 2) * dx, cy = 85 + (Math.floor(i / cols) - (rows - 1) / 2) * dy; s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="1.6"/><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r * 0.32).toFixed(1)}" fill="var(--c)"/>`; }
    $("#b11rs", el).innerHTML = s + `</svg>`;
    $("#b11ro", el).innerHTML = (gen === 0 ? L2("<b>1 parent cell.</b> No gametes are needed. Press the button.", "<b>১টি মাতৃকোষ।</b> কোনো জননকোষ লাগে না। বোতামটি চাপো।") : L2(`<b>${gen} division${gen > 1 ? "s" : ""} → ${n} cells.</b> All are copies of the first cell, with the same genes. At 20 minutes for each division this takes only ${gen * 20} minutes.`, `<b>${B11(gen)} বার বিভাজন → ${B11(n)}টি কোষ।</b> সবগুলো প্রথম কোষটির হুবহু কপি, জিনও একই। প্রতি বিভাজনে ২০ মিনিট লাগলে সময় লাগে মাত্র ${B11(gen * 20)} মিনিট।`)) + (gen === 6 ? " " + L2("Fast and cheap, but there is no variation.", "দ্রুত ও কম খরচের, কিন্তু কোনো বৈচিত্র্য নেই।") : "");
    $("#b11rx", el).disabled = gen >= 6; $("#b11rx", el).style.opacity = gen >= 6 ? .45 : 1;
  };
  const drawS = () => {
    const [, N] = ORG[org], h = N / 2, num = v => B11(v);
    const cell = (x, y, r, c, t) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2"/>` + T11(x, y + 4, t, "middle", 12, "var(--ink)", "700");
    let s = `<svg viewBox="0 0 360 326" role="img" aria-label="${L2("Chromosome number in sexual reproduction", "যৌন প্রজননে ক্রোমোজোম সংখ্যা")}">${arrowDefs("b11ra", "var(--muted)")}`;
    s += T11(100, 13, L2("Male mother cell", "পুং জনন মাতৃকোষ"), "middle", 12.5, MALE11, "700") + T11(260, 13, L2("Female mother cell", "স্ত্রী জনন মাতৃকোষ"), "middle", 12.5, FEM11, "700");
    s += cell(100, 46, 27, MALE11, `2n = ${num(N)}`) + cell(260, 46, 27, FEM11, `2n = ${num(N)}`);
    if (step >= 1) {
      s += AR11(100, 76, 100, 104, "b11ra", "var(--muted)") + AR11(260, 76, 260, 104, "b11ra", "var(--muted)") + T11(180, 95, L2("meiosis", "মিয়োসিস"), "middle", 13, "var(--c)", "700");
      s += cell(100, 130, 22, MALE11, `n = ${num(h)}`) + cell(260, 130, 23, FEM11, `n = ${num(h)}`);
      s += T11(72, 134, L2("sperm", "শুক্রাণু"), "end", 12.5, "var(--muted)") + T11(290, 134, L2("ovum", "ডিম্বাণু"), "start", 12.5, "var(--muted)");
    }
    if (step >= 2) {
      s += AR11(116, 148, 160, 192, "b11ra", "var(--muted)") + AR11(244, 148, 200, 192, "b11ra", "var(--muted)") + T11(180, 166, L2("fertilisation", "নিষেক"), "middle", 13, "var(--c)", "700");
      s += duo11(180, 216, 27, 2) + T11(180, 220, `2n = ${num(N)}`, "middle", 12, "var(--ink)", "700") + T11(214, 220, L2("zygote", "জাইগোট"), "start", 12.5, "var(--muted)");
    }
    if (step >= 3) {
      s += AR11(180, 246, 180, 268, "b11ra", "var(--muted)") + T11(190, 262, L2("mitosis", "মাইটোসিস"), "start", 13, "var(--c)", "700");
      for (let i = 0; i < 6; i++) s += duo11(80 + i * 40, 288, 13, 1.3);
      s += T11(180, 320, L2(`every body cell: 2n = ${N}`, `প্রতিটি দেহকোষ: 2n = ${num(N)}`), "middle", 12.5, "var(--ink)");
    }
    $("#b11rs", el).innerHTML = s + `</svg>`;
    $("#b11ro", el).innerHTML = [
      L2(`Each parent has mother cells with <b>two sets</b> of chromosomes: 2n = ${N}.`, `প্রতিটি জনকের জনন মাতৃকোষে থাকে <b>দুই প্রস্থ</b> ক্রোমোজোম: 2n = ${num(N)}।`),
      L2(`<b>Meiosis</b> halves the number. Each gamete gets one set: n = ${N} ÷ 2 = ${h}.`, `<b>মিয়োসিস</b> সংখ্যাটা অর্ধেক করে। প্রতিটি জননকোষ পায় এক প্রস্থ: n = ${num(N)} ÷ ২ = ${num(h)}।`),
      L2(`<b>Fertilisation:</b> n + n = 2n, that is ${h} + ${h} = ${N}. The zygote has the full number again, half from each parent.`, `<b>নিষেক:</b> n + n = 2n, অর্থাৎ ${num(h)} + ${num(h)} = ${num(N)}। জাইগোটে আবার পুরো সংখ্যা ফিরে এল; অর্ধেক এক জনকের, অর্ধেক অন্য জনকের।`),
      L2(`The zygote divides by <b>mitosis</b>, which keeps the number unchanged. Every body cell of the new organism has 2n = ${N}, a new mixture of both parents.`, `জাইগোট <b>মাইটোসিসে</b> ভাগ হয়, তাতে সংখ্যা বদলায় না। নতুন জীবের প্রতিটি দেহকোষে 2n = ${num(N)}, দুই জনকের বৈশিষ্ট্যের নতুন মিশ্রণ।`)][step];
    $("#b11rn", el).textContent = B11(step + 1) + " / " + B11(4);
  };
  const setMode = () => {
    const b = $("#b11rb", el);
    if (mode === "asex") {
      b.innerHTML = `<div class="svgwrap fit" id="b11rs"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b11rx">${L2("Divide", "ভাগ হও")} ▶</button><button class="btn" id="b11rz">${L2("Start again", "আবার শুরু")}</button></div><div class="w-out" id="b11ro"></div>`;
      $("#b11rx", el).addEventListener("click", () => { if (gen < 6) gen++; drawA(); });
      $("#b11rz", el).addEventListener("click", () => { gen = 0; drawA(); });
      drawA();
    } else {
      b.innerHTML = `<div class="chipset b11rg" role="group">${ORG.map((o, i) => `<button data-o="${i}" aria-pressed="${i === org}">${o[0]}</button>`).join("")}</div><div class="svgwrap fit" id="b11rs" style="margin-top:8px"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b11rx">${L2("Next step", "পরের ধাপ")} ▶</button><span class="hint" id="b11rn"></span></div><div class="w-out" id="b11ro"></div>`;
      chips11(el, ".b11rg", q => { org = +q.dataset.o; drawS(); });
      $("#b11rx", el).addEventListener("click", () => { step = (step + 1) % 4; drawS(); });
      drawS();
    }
  };
  chips11(el, ".b11rm", b => { mode = b.dataset.m; setMode(); });
  setMode();
};

/* shared flower in longitudinal section. show = which parts are drawn, on(k) = highlighted */
const flower11 = (show, on) => {
  const sw = k => on(k) ? 3.2 : 1.4, sc = k => on(k) ? "var(--bad)" : "var(--ink)";
  const g = (k, inner) => `<g data-k="${k}" style="cursor:pointer">${inner}</g>`;
  let s = "";
  if (show.pet) s += g("petal", `<path d="M180 248 C156 196 156 108 180 56 C204 108 204 196 180 248 Z" fill="${PET11}" opacity=".5" stroke="${sc("petal")}" stroke-width="${sw("petal")}"/><path d="M164 256 C128 236 96 176 104 92 C140 116 162 190 172 250 Z" fill="${PET11}" stroke="${sc("petal")}" stroke-width="${sw("petal")}"/><path d="M196 256 C232 236 264 176 256 92 C220 116 198 190 188 250 Z" fill="${PET11}" stroke="${sc("petal")}" stroke-width="${sw("petal")}"/>`);
  if (show.sep) s += g("sepal", `<path d="M156 262 C132 262 112 246 104 222 C128 226 148 240 162 256 Z" fill="${SEP11}" stroke="${sc("sepal")}" stroke-width="${sw("sepal")}"/><path d="M204 262 C228 262 248 246 256 222 C232 226 212 240 198 256 Z" fill="${SEP11}" stroke="${sc("sepal")}" stroke-width="${sw("sepal")}"/>`);
  if (show.sta) {
    const F = ["M170 254 C150 220 136 180 132 140", "M175 252 C164 220 156 190 154 160", "M190 254 C210 220 224 180 228 140", "M185 252 C196 220 204 190 206 160"], A = [[131, 128, 8, 13], [153, 148, 7, 12], [229, 128, 8, 13], [207, 148, 7, 12]];
    s += g("filament", F.map(d => `<path d="${d}" fill="none" stroke="${on("filament") ? "var(--bad)" : "#8a7a3a"}" stroke-width="${on("filament") ? 4.5 : 3}" stroke-linecap="round"/>`).join(""));
    s += g("anther", A.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${STA11}" stroke="${sc("anther")}" stroke-width="${sw("anther")}"/><line x1="${x}" y1="${y - ry + 3}" x2="${x}" y2="${y + ry - 3}" stroke="var(--ink)" stroke-width=".8" opacity=".6"/>`).join(""));
  }
  if (show.car) {
    s += g("style", `<path d="M180 210 L180 112" fill="none" stroke="${sc("style")}" stroke-width="${on("style") ? 11 : 8.5}" stroke-linecap="round"/><path d="M180 210 L180 112" fill="none" stroke="${CAR11}" stroke-width="5.5" stroke-linecap="round"/>`);
    s += g("ovary", `<ellipse cx="180" cy="232" rx="18" ry="24" fill="${CAR11}" stroke="${sc("ovary")}" stroke-width="${sw("ovary")}"/>`);
    s += g("ovule", [[180, 220], [174, 234], [186, 240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${OVU11}" stroke="${sc("ovule")}" stroke-width="${on("ovule") ? 2.6 : 1.1}"/>`).join(""));
    s += g("stigma", `<ellipse cx="180" cy="106" rx="11" ry="6.5" fill="#c9b458" stroke="${sc("stigma")}" stroke-width="${sw("stigma")}"/>`);
  }
  s += g("thalamus", `<path d="M150 262 Q180 252 210 262 Q206 280 188 284 L172 284 Q154 280 150 262 Z" fill="#3f7d3a" stroke="${sc("thalamus")}" stroke-width="${sw("thalamus")}"/>`);
  if (show.ped) s += g("pedicel", `<rect x="174" y="283" width="12" height="44" fill="#6aa856" stroke="${sc("pedicel")}" stroke-width="${sw("pedicel")}"/>`);
  else s += `<path d="M60 292 H300" stroke="#8a6a3a" stroke-width="12" stroke-linecap="round"/>` + T11(300, 318, L2("stem (no flower stalk)", "কাণ্ড (ফুলের বোঁটা নেই)"), "end", 12.5, "var(--muted)");
  return s;
};

/* 11.2.1 the flower: tap the parts; switch whorls on and off to name the kind of flower */
W.b11flower = (el) => {
  const ess = L2(" It belongs to an <b>essential whorl</b>.", " এটি একটি <b>অত্যাবশ্যকীয় স্তবকের</b> অংশ।"), hel = L2(" It belongs to a <b>helping whorl</b>.", " এটি একটি <b>সাহায্যকারী স্তবকের</b> অংশ।");
  const PARTS = [
    ["pedicel", L2("Pedicel", "বৃন্ত"), L2("The stalk of the flower. It holds the flower out where pollinators can reach it. A flower without it is sessile.", "ফুলের বোঁটা। এটি ফুলকে এমনভাবে ধরে রাখে, যাতে পরাগবাহক সহজে পৌঁছাতে পারে। বৃন্ত না থাকলে ফুলটি অবৃন্তক।")],
    ["thalamus", L2("Thalamus", "পুষ্পাক্ষ"), L2("The swollen tip of the stalk. The four whorls are arranged on it, one after another.", "বৃন্তের শীর্ষের স্ফীত অংশ। এর ওপর চারটি স্তবক পরপর সাজানো থাকে।")],
    ["sepal", L2("Sepal (calyx)", "বৃত্যাংশ (বৃতি)"), L2("The outermost whorl, usually green. It protects the inner parts, especially in the bud, from sun, rain and insects.", "সবচেয়ে বাইরের স্তবক, সাধারণত সবুজ। ভেতরের অংশগুলোকে, বিশেষ করে কুঁড়ি অবস্থায়, রোদ, বৃষ্টি ও পোকা থেকে রক্ষা করে।") + hel],
    ["petal", L2("Petal (corolla)", "পাপড়ি (দলমণ্ডল)"), L2("The second whorl, usually colourful. Its colour, scent and nectar attract insects and birds, and it shelters the parts inside.", "দ্বিতীয় স্তবক, সাধারণত রঙিন। রং, গন্ধ ও মধু দিয়ে পোকামাকড় ও পাখিকে আকর্ষণ করে, আর ভেতরের অংশগুলোকে আগলে রাখে।") + hel],
    ["filament", L2("Filament", "পুংদণ্ড"), L2("The stalk of a stamen. It holds the anther up. Filament + anther = stamen; all the stamens together are the androecium, the male whorl.", "পুংকেশরের দণ্ড। পরাগধানীকে উঁচু করে ধরে রাখে। পুংদণ্ড + পরাগধানী = পুংকেশর; সব পুংকেশর মিলে পুংস্তবক, অর্থাৎ পুরুষ স্তবক।") + ess],
    ["anther", L2("Anther", "পরাগধানী"), L2("The pollen sac at the top of a stamen. Pollen grains are made inside it; later the male gametes come from them.", "পুংকেশরের শীর্ষের থলি। এর ভেতরে পরাগরেণু তৈরি হয়; পরে তা থেকেই পুংজননকোষ আসে।") + ess],
    ["stigma", L2("Stigma", "গর্ভমুণ্ড"), L2("The tip of the carpel. It is often sticky and receives the pollen grains.", "গর্ভপত্রের শীর্ষ। এটি প্রায়ই আঠালো হয় এবং পরাগরেণু গ্রহণ করে।") + ess],
    ["style", L2("Style", "গর্ভদণ্ড"), L2("The stalk between the stigma and the ovary. The pollen tube grows down through it.", "গর্ভমুণ্ড ও গর্ভাশয়ের মাঝের দণ্ড। এর ভেতর দিয়েই পরাগনালি নিচে নামে।") + ess],
    ["ovary", L2("Ovary", "গর্ভাশয়"), L2("The swollen base of the carpel. It holds the ovules. After fertilisation it becomes the fruit. Ovary + style + stigma = carpel; the carpels form the gynoecium, the female whorl.", "গর্ভপত্রের গোড়ার স্ফীত অংশ। এর ভেতরে ডিম্বক থাকে। নিষেকের পর এটি ফলে পরিণত হয়। গর্ভাশয় + গর্ভদণ্ড + গর্ভমুণ্ড = গর্ভপত্র; গর্ভপত্র নিয়ে স্ত্রীস্তবক, অর্থাৎ স্ত্রী স্তবক।") + ess],
    ["ovule", L2("Ovule", "ডিম্বক"), L2("A small body inside the ovary. The female gamete, the ovum (egg), forms inside it. After fertilisation the ovule becomes the seed.", "গর্ভাশয়ের ভেতরের ক্ষুদ্র অঙ্গ। এর ভেতরে স্ত্রীজননকোষ বা ডিম্বাণু তৈরি হয়। নিষেকের পর ডিম্বক বীজে পরিণত হয়।") + ess]];
  const ALL = { sep: 1, pet: 1, sta: 1, car: 1, ped: 1 };
  let view = "parts", sel = 3, show = { ...ALL };
  el.innerHTML = tabs11("b11fv", [["parts", L2("Parts", "অংশ")], ["kind", L2("What kind of flower?", "কোন ধরনের ফুল?")]], view) + `<div id="b11fb" style="margin-top:8px"></div>`;
  const drawParts = () => {
    const k = PARTS[sel][0], on = q => q === k, P = i => PARTS[i][1];
    let s = `<svg viewBox="0 0 360 332" role="img" aria-label="${L2("A flower cut lengthwise", "লম্বালম্বি কাটা একটি ফুল")}">` + flower11(ALL, on);
    s += LD11(94, 72, 116, 120) + LB11("petal", on("petal"), 92, 70, L2("Petal", "পাপড়ি"), "end");
    s += LD11(94, 128, 123, 128) + LB11("anther", on("anther"), 92, 132, P(5), "end");
    s += LD11(94, 190, 141, 190) + LB11("filament", on("filament"), 92, 194, P(4), "end");
    s += LD11(94, 246, 122, 242) + LB11("sepal", on("sepal"), 92, 250, L2("Sepal", "বৃত্যাংশ"), "end");
    s += LD11(266, 66, 190, 104) + LB11("stigma", on("stigma"), 268, 68, P(6));
    s += LD11(266, 146, 184, 160) + LB11("style", on("style"), 268, 150, P(7));
    s += LD11(266, 200, 196, 224) + LB11("ovary", on("ovary"), 268, 204, P(8));
    s += LD11(266, 228, 190, 240) + LB11("ovule", on("ovule"), 268, 232, P(9));
    s += LD11(266, 270, 208, 270) + LB11("thalamus", on("thalamus"), 268, 274, P(1));
    s += LD11(266, 306, 188, 306) + LB11("pedicel", on("pedicel"), 268, 310, P(0));
    $("#b11fs", el).innerHTML = s + `</svg>`;
    tap11($("#b11fs", el), q => { sel = PARTS.findIndex(p => p[0] === q); drawParts(); });
    $("#b11fo", el).innerHTML = `<b>${PARTS[sel][1]}.</b> ${PARTS[sel][2]}`;
    $("#b11fn", el).textContent = B11(sel + 1) + " / " + B11(PARTS.length);
  };
  const drawKind = () => {
    $("#b11fs", el).innerHTML = `<svg viewBox="0 0 360 332" role="img" aria-label="${L2("A flower with the chosen whorls", "বাছাই করা স্তবকসহ একটি ফুল")}">` + flower11(show, () => false) + `</svg>`;
    const four = show.sep && show.pet && show.sta && show.car, miss = [];
    if (!show.sep) miss.push(L2("calyx", "বৃতি")); if (!show.pet) miss.push(L2("corolla", "দলমণ্ডল")); if (!show.sta) miss.push(L2("androecium", "পুংস্তবক")); if (!show.car) miss.push(L2("gynoecium", "স্ত্রীস্তবক"));
    const a = four ? L2("<b>Complete flower</b>: all four whorls are present.", "<b>সম্পূর্ণ ফুল</b>: চারটি স্তবকই আছে।") : L2(`<b>Incomplete flower</b>: missing ${miss.join(", ")}.`, `<b>অসম্পূর্ণ ফুল</b>: ${miss.join(", ")} নেই।`);
    const b = show.sta && show.car ? L2("<b>Bisexual</b>: both androecium and gynoecium are present.", "<b>উভলিঙ্গ</b>: পুংস্তবক ও স্ত্রীস্তবক দুটোই আছে।") : show.sta ? L2("<b>Unisexual (male flower)</b>: only the androecium is present. It can give pollen but cannot form a fruit.", "<b>একলিঙ্গ (পুরুষ ফুল)</b>: শুধু পুংস্তবক আছে। এটি পরাগরেণু দিতে পারে, কিন্তু ফল হতে পারে না।") : show.car ? L2("<b>Unisexual (female flower)</b>: only the gynoecium is present. It needs pollen from another flower.", "<b>একলিঙ্গ (স্ত্রী ফুল)</b>: শুধু স্ত্রীস্তবক আছে। এর জন্য অন্য ফুল থেকে পরাগরেণু আসতে হবে।") : L2("<b>Neuter</b>: neither androecium nor gynoecium. It cannot make seeds.", "<b>ক্লীব</b>: পুংস্তবক বা স্ত্রীস্তবক কোনোটিই নেই। এতে বীজ হতে পারে না।");
    const c = show.ped ? L2("<b>Pedicellate</b>: it has a stalk.", "<b>সবৃন্তক</b>: বৃন্ত আছে।") : L2("<b>Sessile</b>: it has no stalk.", "<b>অবৃন্তক</b>: বৃন্ত নেই।");
    const eg = four && show.ped ? L2("Example: jaba, datura.", "উদাহরণ: জবা, ধুতুরা।") : show.sep && show.pet && show.sta && !show.car && show.ped ? L2("Example: a male flower of bottle gourd or pumpkin.", "উদাহরণ: লাউ বা কুমড়ার পুরুষ ফুল।") : show.sep && show.pet && !show.sta && show.car && show.ped ? L2("Example: a female flower of bottle gourd or pumpkin.", "উদাহরণ: লাউ বা কুমড়ার স্ত্রী ফুল।") : "";
    $("#b11fo", el).innerHTML = UL11([a, b, c]) + (eg ? `<div style="margin-top:4px">${eg}</div>` : "");
  };
  const setView = () => {
    const b = $("#b11fb", el);
    if (view === "parts") {
      b.innerHTML = `<div class="svgwrap fit" id="b11fs"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b11fx">${L2("Next part", "পরের অংশ")} ▶</button><span class="hint" id="b11fn"></span></div><div class="w-out" id="b11fo"></div>`;
      $("#b11fx", el).addEventListener("click", () => { sel = (sel + 1) % PARTS.length; drawParts(); });
      drawParts();
    } else {
      const W5 = [["sep", L2("Calyx", "বৃতি")], ["pet", L2("Corolla", "দলমণ্ডল")], ["sta", L2("Androecium", "পুংস্তবক")], ["car", L2("Gynoecium", "স্ত্রীস্তবক")], ["ped", L2("Stalk", "বৃন্ত")]];
      b.innerHTML = `<div class="hint" style="margin-bottom:4px">${L2("Tap to switch a part on or off:", "চাপ দিয়ে কোনো অংশ চালু বা বন্ধ করো:")}</div><div class="chipset b11fw" role="group">${W5.map(([k, t]) => `<button data-w="${k}" aria-pressed="${!!show[k]}">${t}</button>`).join("")}</div><div class="svgwrap fit" id="b11fs" style="margin-top:6px"></div><div class="w-out" id="b11fo"></div>`;
      el.querySelectorAll(".b11fw button").forEach(q => q.addEventListener("click", () => { const k = q.dataset.w; show[k] = show[k] ? 0 : 1; q.setAttribute("aria-pressed", !!show[k]); drawKind(); }));
      drawKind();
    }
  };
  chips11(el, ".b11fv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* a simple five-petalled flower seen from the front */
const flw11 = (cx, cy, r, col = PET11) => { let s = ""; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; s += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="${(r * 0.66).toFixed(1)}" fill="${col}" stroke="var(--ink)" stroke-width=".8"/>`; } return s + `<circle cx="${cx}" cy="${cy}" r="${(r * 0.52).toFixed(1)}" fill="${STA11}" stroke="var(--ink)" stroke-width=".8"/>`; };

/* 11.2.2 pollination: self or cross, the carriers, and how the gametes are made */
W.b11pollin = (el) => {
  let view = "which", way = "same", agent = "insect", organ = "anther", st = 0;
  el.innerHTML = tabs11("b11pv", [["which", L2("Self or cross?", "স্ব না পর?")], ["agent", L2("Carriers", "বাহক")], ["gam", L2("Making gametes", "জননকোষ সৃষ্টি")]], view) + `<div id="b11pb" style="margin-top:8px"></div>`;
  const drawWhich = () => {
    const self = way !== "cross", G = "#4f9a48";
    let s = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("Where the pollen goes", "পরাগরেণু কোথায় যায়")}">${arrowDefs("b11pa", POL11)}`;
    s += `<line x1="10" y1="214" x2="350" y2="214" stroke="#8a6a3a" stroke-width="3"/>`;
    s += `<path d="M112 214 L112 96 M112 168 Q88 156 74 130" fill="none" stroke="${G}" stroke-width="4" stroke-linecap="round"/><ellipse cx="136" cy="150" rx="18" ry="8" fill="${G}" transform="rotate(-25 136 150)"/><ellipse cx="92" cy="190" rx="16" ry="7" fill="${G}" transform="rotate(20 92 190)"/>`;
    s += `<path d="M278 214 L278 96" fill="none" stroke="${G}" stroke-width="4" stroke-linecap="round"/><ellipse cx="254" cy="156" rx="18" ry="8" fill="${G}" transform="rotate(25 254 156)"/><ellipse cx="300" cy="184" rx="16" ry="7" fill="${G}" transform="rotate(-20 300 184)"/>`;
    s += flw11(70, 114, 14) + flw11(112, 80, 16) + flw11(278, 80, 16);
    const d = way === "same" ? "M122 58 C146 22 80 22 102 56" : way === "plant" ? "M62 94 C56 52 86 40 102 58" : "M124 60 C170 14 226 14 266 58";
    s += `<path d="${d}" fill="none" stroke="${POL11}" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round" marker-end="url(#b11pa)"/>`;
    s += T11(350, 16, self ? L2("Self-pollination", "স্ব-পরাগায়ন") : L2("Cross-pollination", "পর-পরাগায়ন"), "end", 14, "var(--c)", "700");
    s += T11(112, 233, L2("Plant 1", "গাছ ১"), "middle", 12.5, "var(--muted)") + T11(278, 233, L2("Plant 2 (same species)", "গাছ ২ (একই প্রজাতি)"), "middle", 12.5, "var(--muted)");
    $("#b11ps", el).innerHTML = s + `</svg>`;
    const head = way === "same" ? L2("Pollen falls on the stigma of the <b>same flower</b>: self-pollination.", "পরাগরেণু পড়ে <b>একই ফুলের</b> গর্ভমুণ্ডে: স্ব-পরাগায়ন।") : way === "plant" ? L2("Pollen goes to <b>another flower of the same plant</b>. The plant is the same, so this is still self-pollination.", "পরাগরেণু যায় <b>একই গাছের অন্য ফুলে</b>। গাছ একই, তাই এটিও স্ব-পরাগায়ন।") : L2("Pollen goes to a flower on <b>another plant of the same species</b>: cross-pollination.", "পরাগরেণু যায় <b>একই প্রজাতির অন্য গাছের</b> ফুলে: পর-পরাগায়ন।");
    const good = self ? L2("<b>Gains:</b> little pollen is wasted; no carrier is needed; pollination is almost certain; the purity of the variety is kept.", "<b>লাভ:</b> পরাগরেণুর অপচয় কম; বাহক লাগে না; পরাগায়ন প্রায় নিশ্চিত; জাতের বিশুদ্ধতা বজায় থাকে।") : L2("<b>Gains:</b> seeds with new characters; more seeds germinate; the seeds are more vigorous; new varieties arise.", "<b>লাভ:</b> নতুন গুণসম্পন্ন বীজ; অঙ্কুরোদগমের হার বাড়ে; বীজ বেশি জীবনীশক্তিসম্পন্ন হয়; নতুন জাতের সৃষ্টি হয়।");
    const bad = self ? L2("<b>Losses:</b> no new characters; less vigorous seeds; the new plants adapt less well. Examples: mustard, datura.", "<b>ক্ষতি:</b> নতুন বৈশিষ্ট্য আসে না; বীজের জীবনীশক্তি কম; নতুন গাছের অভিযোজন ক্ষমতা কমে। উদাহরণ: সরিষা, ধুতুরা।") : L2("<b>Losses:</b> depends on a carrier, so it is not certain; much pollen is wasted; purity may be lost. Examples: shimul, papaya.", "<b>ক্ষতি:</b> বাহকনির্ভর, তাই নিশ্চয়তা নেই; প্রচুর পরাগরেণুর অপচয়; জাতের বিশুদ্ধতা নষ্ট হতে পারে। উদাহরণ: শিমুল, পেঁপে।");
    $("#b11po", el).innerHTML = head + UL11([good, bad]);
  };
  const AG = {
    insect: [L2("Insects", "পতঙ্গ"), L2("Insect-pollinated flower", "পতঙ্গপরাগী ফুল"), [L2("large and colourful, with nectar glands", "বড়, রঙিন ও মধুগ্রন্থিযুক্ত"), L2("scented", "সুগন্ধযুক্ত"), L2("pollen and stigma are sticky", "পরাগরেণু ও গর্ভমুণ্ড আঠালো")], L2("Examples: jaba, pumpkin, mustard.", "উদাহরণ: জবা, কুমড়া, সরিষা।")],
    wind: [L2("Wind", "বায়ু"), L2("Wind-pollinated flower", "বায়ুপরাগী ফুল"), [L2("small and light, no nectar glands, no scent", "ছোট ও হালকা, মধুগ্রন্থি নেই, সুগন্ধ নেই"), L2("pollen is light and floats easily, and there is a great deal of it", "পরাগরেণু হালকা, সহজে বাতাসে ভাসে, আর পরিমাণে প্রচুর"), L2("stigma is sticky and branched, sometimes feathery", "গর্ভমুণ্ড আঠালো ও শাখান্বিত, কখনো পালকের মতো")], L2("Example: rice.", "উদাহরণ: ধান।")],
    water: [L2("Water", "পানি"), L2("Water-pollinated flower", "পানিপরাগী ফুল"), [L2("small and light, floats on water, no scent", "ক্ষুদ্র ও হালকা, পানিতে ভাসে, সুগন্ধ নেই"), L2("the female flower has a long stalk, the male flower a short one", "স্ত্রী ফুলের বৃন্ত লম্বা, পুরুষ ফুলের বৃন্ত ছোট"), L2("ripe male flowers break off and float to the female flowers", "পরিণত পুরুষ ফুল বৃন্ত থেকে খুলে ভেসে স্ত্রী ফুলের কাছে যায়")], L2("Example: <i>Vallisneria</i> (patasheola).", "উদাহরণ: পাতাশেওলা (<i>Vallisneria</i>)।")],
    animal: [L2("Animals", "প্রাণী"), L2("Animal-pollinated flower", "প্রাণীপরাগী ফুল"), [L2("fairly large; small ones are crowded in an inflorescence", "মোটামুটি বড়; ছোট হলে পুষ্পমঞ্জরিতে সাজানো"), L2("attractive colour", "রং আকর্ষণীয়"), L2("scent may or may not be present", "গন্ধ থাকতেও পারে, না-ও থাকতে পারে")], L2("Examples: kadam, shimul, kochu. Carriers: birds, bats, snails and others.", "উদাহরণ: কদম, শিমুল, কচু। বাহক: পাখি, বাদুড়, শামুক ইত্যাদি।")]};
  const drawAgent = () => {
    const G = "#4f9a48";
    let s = `<svg viewBox="0 0 360 190" role="img" aria-label="${AG[agent][1]}">${arrowDefs("b11pc", "var(--muted)")}`;
    if (agent === "insect") {
      s += `<path d="M120 186 L120 112" stroke="${G}" stroke-width="4"/><ellipse cx="144" cy="160" rx="20" ry="8" fill="${G}" transform="rotate(-25 144 160)"/>` + flw11(120, 88, 30);
      s += `<path d="M330 30 C290 20 262 40 236 60" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 5"/>`;
      s += `<g transform="translate(206 74) rotate(20)"><ellipse cx="6" cy="-13" rx="13" ry="7" fill="#9cc8e8" opacity=".75" stroke="var(--ink)" stroke-width=".7" transform="rotate(-25 6 -13)"/><ellipse cx="-6" cy="-13" rx="12" ry="6" fill="#9cc8e8" opacity=".75" stroke="var(--ink)" stroke-width=".7" transform="rotate(15 -6 -13)"/><ellipse cx="0" cy="0" rx="17" ry="10" fill="#e8b22a" stroke="var(--ink)" stroke-width="1.2"/><path d="M-4 -9.5 V9.5 M4 -9.5 V9.5" stroke="var(--ink)" stroke-width="3.2"/><circle cx="-20" cy="1" r="7" fill="#4a3a1a"/><circle cx="-12" cy="8" r="2" fill="${POL11}"/><circle cx="2" cy="10" r="2" fill="${POL11}"/><circle cx="10" cy="7" r="2" fill="${POL11}"/></g>`;
      s += T11(250, 122, L2("comes for nectar,", "মধুর জন্য আসে,"), "middle", 13, "var(--ink)") + T11(250, 140, L2("leaves with pollen", "পরাগরেণু নিয়ে যায়"), "middle", 13, "var(--ink)");
    } else if (agent === "wind") {
      const spike = (x) => { let q = `<path d="M${x} 186 Q${x - 4} 120 ${x + 8} 44" fill="none" stroke="${G}" stroke-width="3"/>`; for (let i = 0; i < 6; i++) { const y = 60 + i * 15, xx = x + 6 - i * 1.6, sd = i % 2 ? 1 : -1; q += `<ellipse cx="${xx + sd * 9}" cy="${y}" rx="8" ry="4.5" fill="#9cc77a" stroke="var(--ink)" stroke-width=".7" transform="rotate(${sd * -35} ${xx + sd * 9} ${y})"/>`; } return q; };
      s += spike(70) + spike(290);
      for (let i = 0; i < 3; i++) s += `<line x1="${62 - i * 8}" y1="${78 + i * 30}" x2="${56 - i * 8}" y2="${98 + i * 30}" stroke="#8a7a3a" stroke-width="1"/><ellipse cx="${55 - i * 8}" cy="${103 + i * 30}" rx="3" ry="6" fill="${STA11}" stroke="var(--ink)" stroke-width=".6"/>`;
      for (let i = 0; i < 2; i++) { const bx = 300, by = 70 + i * 32; for (let j = -3; j <= 3; j++) s += `<line x1="${bx}" y1="${by}" x2="${bx + 20}" y2="${by + j * 4 - 8}" stroke="var(--ink)" stroke-width=".9"/>`; }
      let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < 30; i++) s += `<circle cx="${(96 + rnd() * 176).toFixed(0)}" cy="${(44 + rnd() * 96).toFixed(0)}" r="2.2" fill="${POL11}"/>`;
      s += `<path d="M110 150 q30 -12 60 0 t60 0" fill="none" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#b11pc)"/><path d="M120 28 q30 -12 60 0 t60 0" fill="none" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#b11pc)"/>`;
      s += T11(60, 20, L2("anthers", "পরাগধানী"), "middle", 12.5, "var(--muted)") + T11(304, 20, L2("feathery stigma", "পালকের মতো গর্ভমুণ্ড"), "end", 12.5, "var(--muted)") + T11(180, 176, L2("clouds of light pollen", "রাশি রাশি হালকা পরাগরেণু"), "middle", 13, "var(--ink)");
    } else if (agent === "water") {
      s += `<rect x="0" y="60" width="360" height="130" fill="#9cc8e8" opacity=".35"/><path d="M0 60 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="${VEIN11}" stroke-width="2"/><line x1="0" y1="186" x2="360" y2="186" stroke="#8a6a3a" stroke-width="4"/>`;
      s += `<path d="M270 186 C250 150 296 120 270 62" fill="none" stroke="${G}" stroke-width="3"/>` + flw11(270, 54, 9, "#f4f1e6");
      s += `<path d="M80 186 L80 150" stroke="${G}" stroke-width="3"/><ellipse cx="80" cy="140" rx="12" ry="14" fill="#cfe3c2" stroke="var(--ink)" stroke-width="1"/>` + [[76, 134], [84, 140], [78, 146]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${STA11}" stroke="var(--ink)" stroke-width=".5"/>`).join("");
      s += `<path d="M92 128 C110 100 120 80 136 62" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 5" marker-end="url(#b11pc)"/>`;
      [[150, 56], [184, 57], [216, 55]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="5" fill="${STA11}" stroke="var(--ink)" stroke-width=".8"/>`; });
      s += AR11(226, 40, 252, 40, "b11pc", "var(--muted)", 1.5);
      s += T11(184, 30, L2("male flowers float", "পুরুষ ফুল ভেসে যায়"), "middle", 12.5, "var(--ink)") + T11(100, 156, L2("male flowers,", "পুরুষ ফুল,"), "start", 12.5, "var(--ink)", "", true) + T11(100, 172, L2("short stalk", "ছোট বৃন্ত"), "start", 12.5, "var(--ink)", "", true) + T11(256, 118, L2("female flower,", "স্ত্রী ফুল,"), "end", 12.5, "var(--ink)", "", true) + T11(256, 134, L2("long stalk", "লম্বা বৃন্ত"), "end", 12.5, "var(--ink)", "", true);
    } else {
      s += `<path d="M10 150 C80 140 120 132 170 120" fill="none" stroke="#8a6a3a" stroke-width="7" stroke-linecap="round"/>` + flw11(150, 96, 28, "#d8443a");
      s += `<g><ellipse cx="258" cy="76" rx="34" ry="17" fill="#6f8fb0" stroke="var(--ink)" stroke-width="1.2" transform="rotate(-18 258 76)"/><ellipse cx="264" cy="72" rx="20" ry="9" fill="#4f6f90" transform="rotate(-10 264 72)"/><path d="M288 62 L326 44 L322 66 Z" fill="#4f6f90" stroke="var(--ink)" stroke-width="1"/><circle cx="222" cy="78" r="12" fill="#6f8fb0" stroke="var(--ink)" stroke-width="1.2"/><circle cx="218" cy="75" r="2" fill="var(--ink)"/><path d="M211 80 L184 92 L212 86 Z" fill="#e0a82e" stroke="var(--ink)" stroke-width=".8"/><path d="M254 92 L250 110 M266 90 L264 108" stroke="var(--ink)" stroke-width="1.5"/></g>`;
      s += `<circle cx="214" cy="68" r="2" fill="${POL11}"/><circle cx="220" cy="66" r="2" fill="${POL11}"/><circle cx="226" cy="68" r="2" fill="${POL11}"/>`;
      s += T11(250, 142, L2("pollen sticks to the", "পরাগরেণু লেগে যায়"), "middle", 13, "var(--ink)") + T11(250, 160, L2("head and beak", "মাথায় ও ঠোঁটে"), "middle", 13, "var(--ink)");
    }
    $("#b11ps", el).innerHTML = s + `</svg>`;
    $("#b11po", el).innerHTML = `<b>${AG[agent][1]}</b>` + UL11(AG[agent][2]) + `<div style="margin-top:4px">${AG[agent][3]}</div>`;
  };
  const AN = [
    L2("In the pollen sac of the anther there are <b>pollen mother cells</b>. Each has two sets of chromosomes (2n).", "পরাগধানীর পরাগথলিতে থাকে <b>পরাগ মাতৃকোষ</b>। প্রতিটিতে দুই প্রস্থ ক্রোমোজোম (2n)।"),
    L2("The mother cell divides by <b>meiosis</b> and gives <b>four pollen grains</b>, each haploid (n).", "মাতৃকোষটি <b>মিয়োসিসে</b> বিভাজিত হয়ে <b>চারটি পরাগরেণু</b> দেয়; প্রতিটি হ্যাপ্লয়েড (n)।"),
    L2("One pollen grain, enlarged. It has a tough outer wall (exine) and a thin inner wall (intine). Its nucleus divides by <b>mitosis</b>: a large <b>tube cell</b> and a small <b>generative cell</b> are formed.", "একটি পরাগরেণু, বড় করে দেখানো। বাইরে শক্ত আবরণ (এক্সাইন), ভেতরে পাতলা আবরণ (ইনটাইন)। এর নিউক্লিয়াস <b>মাইটোসিসে</b> ভাগ হয়: একটি বড় <b>নালিকোষ</b> ও একটি ছোট <b>জেনারেটিভ কোষ</b> তৈরি হয়।"),
    L2("The tube cell grows out as the <b>pollen tube</b>. The generative cell divides once more into <b>two male gametes</b> (n). So 1 mother cell → 4 pollen grains → 8 male gametes.", "নালিকোষ বেড়ে <b>পরাগনালি</b> তৈরি করে। জেনারেটিভ কোষ আরও একবার ভাগ হয়ে <b>দুটি পুংজননকোষ</b> (n) দেয়। অর্থাৎ ১টি মাতৃকোষ → ৪টি পরাগরেণু → ৮টি পুংজননকোষ।")];
  const OV = [
    L2("In the nucellus, near the micropyle, one cell grows larger than the rest: the <b>megaspore mother cell</b> (2n).", "ভ্রূণপোষক কলায় ডিম্বকরন্ধ্রের কাছাকাছি একটি কোষ অন্যদের চেয়ে বড় হয়: <b>মেগাস্পোর মাতৃকোষ</b> (2n)।"),
    L2("It divides by <b>meiosis</b> into <b>four haploid cells</b> (megaspores) lying in a row.", "এটি <b>মিয়োসিসে</b> বিভাজিত হয়ে এক সারিতে থাকা <b>চারটি হ্যাপ্লয়েড কোষ</b> (মেগাস্পোর) তৈরি করে।"),
    L2("Three break down. Only the <b>lowest one</b>, farthest from the micropyle, survives.", "তিনটি নষ্ট হয়ে যায়। টিকে থাকে শুধু <b>সর্বনিম্ন কোষটি</b>, যেটি ডিম্বকরন্ধ্র থেকে সবচেয়ে দূরে।"),
    L2("The surviving cell grows into the <b>embryo sac</b>. Its nucleus (n) divides into two, and the two nuclei move to the two poles.", "টিকে থাকা কোষটি বেড়ে <b>ভ্রূণথলিতে</b> পরিণত হয়। এর নিউক্লিয়াস (n) ভাগ হয়ে দুটি হয়, আর নিউক্লিয়াস দুটি দুই মেরুতে চলে যায়।"),
    L2("Each of the two divides twice more: <b>four nuclei at each pole</b>, eight in all.", "দুটির প্রতিটি পরপর আরও দুবার ভাগ হয়: <b>প্রতি মেরুতে চারটি</b>, মোট আটটি নিউক্লিয়াস।"),
    L2("One nucleus from each pole comes to the centre; they fuse into the <b>secondary nucleus (2n)</b>. The other three at each pole become cells: the <b>egg</b> and two <b>synergids</b> (the egg apparatus) at the micropyle end, three <b>antipodal cells</b> at the other end.", "প্রতি মেরু থেকে একটি করে নিউক্লিয়াস কেন্দ্রে এসে মিলিত হয়ে <b>গৌণ নিউক্লিয়াস (2n)</b> তৈরি করে। প্রতি মেরুর বাকি তিনটি কোষে পরিণত হয়: ডিম্বকরন্ধ্রের দিকে <b>ডিম্বাণু</b> ও দুটি <b>সহকারী কোষ</b> (গর্ভযন্ত্র), বিপরীত দিকে তিনটি <b>প্রতিপাদ কোষ</b>।")];
  const drawGam = () => {
    let s;
    if (organ === "anther") {
      const WALL = "#8a6a1c", FILL = "#f6e6b0", cl = (x, y, r, t) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${FILL}" stroke="${WALL}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="${(r * 0.42).toFixed(1)}" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/>` + T11(x, y + 4, t, "middle", 12, "var(--ink)", "700");
      s = `<svg viewBox="0 0 360 212" role="img" aria-label="${L2("How pollen grains and male gametes are made", "পরাগরেণু ও পুংজননকোষ কীভাবে তৈরি হয়")}">`;
      if (st === 0) s += cl(180, 108, 40, "2n") + T11(180, 34, L2("Pollen mother cell (2n)", "পরাগ মাতৃকোষ (2n)"), "middle", 14, "var(--ink)", "700");
      else if (st === 1) s += cl(146, 82, 28, "n") + cl(214, 82, 28, "n") + cl(146, 148, 28, "n") + cl(214, 148, 28, "n") + T11(180, 28, L2("4 pollen grains (n)", "৪টি পরাগরেণু (n)"), "middle", 14, "var(--ink)", "700");
      else if (st === 2) {
        s += `<circle cx="180" cy="108" r="62" fill="${FILL}" stroke="${WALL}" stroke-width="7"/><circle cx="180" cy="108" r="54" fill="none" stroke="${WALL}" stroke-width="1.2"/>`;
        s += `<circle cx="162" cy="98" r="17" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.2"/>` + T11(162, 102, "n", "middle", 12, "var(--ink)", "700") + `<ellipse cx="206" cy="132" rx="17" ry="11" fill="${MALE11}" fill-opacity=".3" stroke="${MALE11}" stroke-width="1.6"/>` + T11(206, 136, "n", "middle", 12, DK11, "700");
        s += LD11(98, 54, 132, 66) + T11(96, 52, L2("Exine", "এক্সাইন"), "end") + LD11(98, 160, 139, 143) + T11(96, 168, L2("Intine", "ইনটাইন"), "end");
        s += LD11(266, 74, 176, 92) + T11(268, 78, L2("Tube cell", "নালিকোষ"), "start") + LD11(266, 150, 221, 134) + LB11("x", false, 268, 152, L2(["Generative", "cell"], ["জেনারেটিভ", "কোষ"]));
      } else {
        s += `<circle cx="70" cy="104" r="42" fill="${FILL}" stroke="${WALL}" stroke-width="6"/><path d="M104 90 C160 84 240 92 322 96 A10 10 0 0 1 322 116 C240 112 160 122 104 118" fill="${FILL}" stroke="${WALL}" stroke-width="2"/><ellipse cx="106" cy="104" rx="7" ry="12.5" fill="${FILL}"/>`;
        s += `<circle cx="302" cy="106" r="7.5" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="216" cy="104" rx="10" ry="6.5" fill="${MALE11}"/><ellipse cx="248" cy="105" rx="10" ry="6.5" fill="${MALE11}"/>`;
        s += T11(70, 108, L2("pollen", "পরাগ"), "middle", 12, DK11) + T11(70, 123, L2("grain", "রেণু"), "middle", 12, DK11);
        s += LD11(160, 62, 160, 88) + T11(160, 56, L2("Pollen tube", "পরাগনালি"), "middle") + LD11(232, 144, 232, 114) + T11(232, 160, L2("2 male gametes (n)", "২টি পুংজননকোষ (n)"), "middle", 13, MALE11, "700") + LD11(302, 62, 302, 96) + T11(302, 56, L2("Tube nucleus", "নালি নিউক্লিয়াস"), "middle");
      }
    } else {
      const sp = (y, t, o = 1, hi = false) => `<circle cx="180" cy="${y}" r="15" fill="#f4d6a0" stroke="${hi ? "var(--bad)" : "var(--ink)"}" stroke-width="${hi ? 3 : 1.4}" opacity="${o}"${o < 1 ? ` stroke-dasharray="3 3"` : ""}/>` + (o < 1 ? "" : T11(180, y + 4, t, "middle", 12, DK11, "700"));
      const nu = (x, y) => `<circle cx="${x}" cy="${y}" r="6.5" fill="var(--c)"/>`;
      s = `<svg viewBox="0 0 360 270" role="img" aria-label="${L2("How the embryo sac is made inside the ovule", "ডিম্বকের ভেতরে ভ্রূণথলি কীভাবে তৈরি হয়")}">`;
      s += `<path d="M168 24 C84 34 92 252 180 252 C268 252 276 34 192 24" fill="var(--c-soft)" stroke="#6aa856" stroke-width="7" stroke-linecap="round"/>`;
      s += LD11(246, 18, 187, 26) + T11(248, 22, L2("Micropyle", "ডিম্বকরন্ধ্র"), "start") + LD11(102, 216, 136, 204) + LB11("x", false, 100, 222, L2("Nucellus", ["ভ্রূণপোষক", "কলা"]), "end");
      if (st >= 3) s += `<ellipse cx="180" cy="140" rx="36" ry="76" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.6"/>`;
      if (st === 0) s += `<circle cx="180" cy="84" r="21" fill="#f4d6a0" stroke="var(--ink)" stroke-width="1.6"/>` + T11(180, 88, "2n", "middle", 12, DK11, "700") + LD11(260, 84, 203, 84) + LB11("x", false, 262, 82, L2(["Megaspore", "mother cell"], ["মেগাস্পোর", "মাতৃকোষ"]));
      else if (st === 1) s += sp(62, "n") + sp(96, "n") + sp(130, "n") + sp(164, "n") + LD11(260, 112, 197, 112) + LB11("x", false, 262, 110, L2(["4 megaspores", "(n)"], ["৪টি মেগাস্পোর", "(n)"]));
      else if (st === 2) s += sp(62, "", .4) + sp(96, "", .4) + sp(130, "", .4) + sp(164, "n", 1, true) + LD11(260, 92, 198, 96) + LB11("x", false, 262, 90, L2(["3 break", "down"], ["৩টি নষ্ট", "হয়ে যায়"])) + LD11(260, 166, 198, 164) + T11(262, 170, L2("1 survives", "১টি টিকে থাকে"), "start", 13, "var(--bad)", "700");
      else if (st === 3) s += nu(180, 88) + nu(180, 192) + LD11(260, 140, 217, 140) + T11(262, 144, L2("Embryo sac", "ভ্রূণথলি"), "start");
      else if (st === 4) s += [[168, 82], [192, 82], [168, 102], [192, 102], [168, 180], [192, 180], [168, 200], [192, 200]].map(([x, y]) => nu(x, y)).join("") + LD11(260, 140, 217, 140) + T11(262, 144, L2("Embryo sac", "ভ্রূণথলি"), "start") + T11(180, 146, L2("4 + 4", "৪ + ৪"), "middle", 13, "var(--muted)");
      else {
        s += [[165, 84], [195, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#cfe3f2" stroke="var(--ink)" stroke-width="1.1"/>`).join("") + `<ellipse cx="180" cy="102" rx="11.5" ry="14.5" fill="#f2b8c6" stroke="${FEM11}" stroke-width="2"/>` + T11(180, 106, "n", "middle", 12, DK11, "700");
        s += `<circle cx="180" cy="146" r="13" fill="#ddd0f0" stroke="#7b5ab5" stroke-width="2"/>` + T11(180, 150, "2n", "middle", 12, DK11, "700") + [[164, 192], [180, 201], [196, 192]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8.5" fill="#e4e2cc" stroke="var(--ink)" stroke-width="1.1"/>`).join("");
        s += LD11(260, 64, 201, 80) + T11(262, 68, L2("Synergids", "সহকারী কোষ"), "start") + LD11(260, 102, 192, 104) + T11(262, 106, L2("Egg (n)", "ডিম্বাণু (n)"), "start", 13, FEM11, "700") + LD11(260, 144, 194, 146) + LB11("x", false, 262, 142, L2(["Secondary", "nucleus (2n)"], ["গৌণ নিউক্লিয়াস", "(2n)"])) + LD11(260, 196, 205, 194) + T11(262, 200, L2("Antipodal cells", "প্রতিপাদ কোষ"), "start");
      }
    }
    $("#b11ps", el).innerHTML = s + `</svg>`;
    const A = organ === "anther" ? AN : OV;
    $("#b11po", el).innerHTML = A[st];
    $("#b11pn", el).textContent = B11(st + 1) + " / " + B11(A.length);
  };
  const setView = () => {
    const b = $("#b11pb", el);
    if (view === "which") {
      b.innerHTML = `<div class="chipset b11pw" role="group"><button data-w="same" aria-pressed="${way === "same"}">${L2("Same flower", "একই ফুল")}</button><button data-w="plant" aria-pressed="${way === "plant"}">${L2("Another flower, same plant", "একই গাছের অন্য ফুল")}</button><button data-w="cross" aria-pressed="${way === "cross"}">${L2("Another plant", "অন্য গাছ")}</button></div><div class="svgwrap fit" id="b11ps" style="margin-top:6px"></div><div class="w-out" id="b11po"></div>`;
      chips11(el, ".b11pw", q => { way = q.dataset.w; drawWhich(); });
      drawWhich();
    } else if (view === "agent") {
      b.innerHTML = `<div class="chipset b11pg" role="group">${Object.keys(AG).map(k => `<button data-a="${k}" aria-pressed="${k === agent}">${AG[k][0]}</button>`).join("")}</div><div class="svgwrap fit" id="b11ps" style="margin-top:6px"></div><div class="w-out" id="b11po"></div>`;
      chips11(el, ".b11pg", q => { agent = q.dataset.a; drawAgent(); });
      drawAgent();
    } else {
      b.innerHTML = `<div class="chipset b11pr" role="group"><button data-r="anther" aria-pressed="${organ === "anther"}">${L2("In the anther", "পরাগধানীতে")}</button><button data-r="ovule" aria-pressed="${organ === "ovule"}">${L2("In the ovule", "ডিম্বকে")}</button></div><div class="svgwrap fit" id="b11ps" style="margin-top:6px"></div><div class="w-row" style="margin:6px 0"><button class="btn" id="b11pk">◀ ${L2("Back", "আগের ধাপ")}</button><button class="btn solid" id="b11px">${L2("Next", "পরের ধাপ")} ▶</button><span class="hint" id="b11pn"></span></div><div class="w-out" id="b11po"></div>`;
      chips11(el, ".b11pr", q => { organ = q.dataset.r; st = 0; drawGam(); });
      const len = () => (organ === "anther" ? AN : OV).length;
      $("#b11px", el).addEventListener("click", () => { st = (st + 1) % len(); drawGam(); });
      $("#b11pk", el).addEventListener("click", () => { st = (st + len() - 1) % len(); drawGam(); });
      drawGam();
    }
  };
  chips11(el, ".b11pv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 11.2.3 double fertilisation step by step, and what each part of the flower becomes */
W.b11fert = (el) => {
  const STEPS = [
    L2("<b>Pollination is over.</b> A pollen grain sits on the stigma. Deep inside the ovary the embryo sac is waiting, with its egg (n) and its secondary nucleus (2n).", "<b>পরাগায়ন শেষ।</b> একটি পরাগরেণু গর্ভমুণ্ডে বসে আছে। গর্ভাশয়ের গভীরে ভ্রূণথলি তার ডিম্বাণু (n) ও গৌণ নিউক্লিয়াস (2n) নিয়ে অপেক্ষা করছে।"),
    L2("The pollen grain takes in liquid and swells. Its <b>pollen tube</b> grows down through the style, carrying <b>two male gametes</b> (n).", "পরাগরেণু তরল শোষণ করে ফুলে ওঠে। এর <b>পরাগনালি</b> গর্ভদণ্ড ভেদ করে নিচে নামে, সঙ্গে থাকে <b>দুটি পুংজননকোষ</b> (n)।"),
    L2("The tube enters the ovary, passes round the ovule and goes in through the <b>micropyle</b>.", "নালিটি গর্ভাশয়ে ঢোকে, ডিম্বকের পাশ দিয়ে ঘুরে <b>ডিম্বকরন্ধ্র</b> দিয়ে ভেতরে প্রবেশ করে।"),
    L2("The swollen tip of the tube bursts. The two male gametes are set free <b>inside the embryo sac</b>.", "নালির স্ফীত অগ্রভাগ ফেটে যায়। পুংজননকোষ দুটি <b>ভ্রূণথলির ভেতরে</b> মুক্ত হয়।"),
    L2("<b>Double fertilisation.</b> One male gamete + egg → <b>zygote</b> (n + n = 2n). The other male gamete + secondary nucleus → <b>endosperm</b> cell (n + 2n = 3n).", "<b>দ্বিনিষেক।</b> একটি পুংজননকোষ + ডিম্বাণু → <b>জাইগোট</b> (n + n = 2n)। অন্য পুংজননকোষ + গৌণ নিউক্লিয়াস → <b>সস্য</b> কোষ (n + 2n = 3n)।"),
    L2("The zygote grows into the <b>embryo</b>; the 3n cell forms the <b>endosperm</b>, its food. The ovule becomes the <b>seed</b> and the ovary becomes the <b>fruit</b>. The style and stigma dry up.", "জাইগোট থেকে <b>ভ্রূণ</b> হয়; 3n কোষটি তৈরি করে ভ্রূণের খাদ্য, <b>সস্য</b>। ডিম্বক পরিণত হয় <b>বীজে</b>, গর্ভাশয় <b>ফলে</b>। গর্ভদণ্ড ও গর্ভমুণ্ড শুকিয়ে যায়।")];
  const MAP = [
    ["egg", L2("Egg", "ডিম্বাণু"), L2("Embryo", "ভ্রূণ"), L2("The <b>egg (n)</b> is fertilised by one male gamete and becomes the <b>zygote (2n)</b>. The zygote divides and builds the <b>embryo</b>: the baby plant with its cotyledons, radicle and plumule.", "<b>ডিম্বাণু (n)</b> একটি পুংজননকোষ দিয়ে নিষিক্ত হয়ে <b>জাইগোট (2n)</b> হয়। জাইগোট ভাগ হয়ে <b>ভ্রূণ</b> গড়ে তোলে: বীজপত্র, ভ্রূণমূল ও ভ্রূণকাণ্ডসহ শিশু উদ্ভিদ।")],
    ["sec", L2("Secondary nucleus", "গৌণ নিউক্লিয়াস"), L2("Endosperm", "সস্য"), L2("The <b>secondary nucleus (2n)</b> fuses with the other male gamete and forms the <b>endosperm (3n)</b>, the food store of the seed.", "<b>গৌণ নিউক্লিয়াস (2n)</b> অন্য পুংজননকোষের সাথে মিলিত হয়ে <b>সস্য (3n)</b> তৈরি করে; এটি বীজের খাদ্যভান্ডার।")],
    ["ovule", L2("Ovule", "ডিম্বক"), L2("Seed", "বীজ"), L2("The whole <b>ovule</b>, with the embryo and endosperm inside it, ripens into the <b>seed</b>.", "পুরো <b>ডিম্বকটি</b> তার ভেতরের ভ্রূণ ও সস্যসহ পরিণত হয়ে <b>বীজ</b> হয়।")],
    ["coat", L2("Coats of the ovule", "ডিম্বকের ত্বক"), L2("Seed coat", "বীজত্বক"), L2("The <b>coats of the ovule</b> harden into the <b>seed coat</b>, which protects the embryo.", "<b>ডিম্বকের ত্বক</b> শক্ত হয়ে <b>বীজত্বকে</b> পরিণত হয়, যা ভ্রূণকে রক্ষা করে।")],
    ["ovary", L2("Ovary", "গর্ভাশয়"), L2("Fruit", "ফল"), L2("Fertilisation stimulates the <b>ovary</b>, and it grows into the <b>fruit</b>. If only the ovary forms the fruit it is a true fruit (mango, jam).", "নিষেকের উদ্দীপনায় <b>গর্ভাশয়</b> বেড়ে <b>ফলে</b> পরিণত হয়। শুধু গর্ভাশয় থেকে ফল হলে তা প্রকৃত ফল (আম, জাম)।")],
    ["rest", L2("Petals, stamens, style", "পাপড়ি, পুংকেশর, গর্ভদণ্ড"), L2("fall off", "ঝরে যায়"), L2("Their work is done. The <b>petals, stamens, style and stigma</b> usually dry up and fall off. (In a false fruit such as apple or chalta, some other part of the flower grows along with the ovary.)", "এদের কাজ শেষ। <b>পাপড়ি, পুংকেশর, গর্ভদণ্ড ও গর্ভমুণ্ড</b> সাধারণত শুকিয়ে ঝরে যায়। (আপেল বা চালতার মতো অপ্রকৃত ফলে গর্ভাশয়ের সাথে ফুলের অন্য কোনো অংশও বেড়ে ওঠে।)")]];
  let view = "step", st = 0, sel = 0;
  el.innerHTML = tabs11("b11tv", [["step", L2("Double fertilisation", "দ্বিনিষেক")], ["map", L2("Flower to fruit", "ফুল থেকে ফল")]], view) + `<div id="b11tb" style="margin-top:8px"></div>`;
  const drawStep = () => {
    const fruit = st === 5, TUBE = "#b8862a", dry = "#a08a66";
    const tube = st === 1 ? "M180 34 L180 150" : st === 2 ? "M180 34 L180 176 C176 196 106 200 102 268 C100 330 140 362 172 362 C180 362 180 356 180 351" : st >= 3 && st < 5 ? "M180 34 L180 176 C176 196 106 200 102 268 C100 330 140 362 172 362 C180 362 180 356 180 344 L180 330" : "";
    let s = `<svg viewBox="0 0 360 404" role="img" aria-label="${L2("A carpel cut lengthwise, showing fertilisation", "লম্বালম্বি কাটা গর্ভপত্রে নিষেক")}">`;
    /* style and stigma */
    s += `<path d="M180 40 L180 172" stroke="${fruit ? dry : "var(--ink)"}" stroke-width="19" stroke-linecap="butt"${fruit ? ` stroke-dasharray="5 4"` : ""}/><path d="M180 40 L180 172" stroke="${fruit ? "var(--paper)" : CAR11}" stroke-width="16"/><ellipse cx="180" cy="32" rx="17" ry="8.5" fill="${fruit ? "var(--paper)" : "#c9b458"}" stroke="${fruit ? dry : "var(--ink)"}" stroke-width="1.4"${fruit ? ` stroke-dasharray="5 4"` : ""}/>`;
    /* ovary wall and cavity */
    s += `<ellipse cx="180" cy="272" rx="100" ry="106" fill="${fruit ? "#f0a94a" : CAR11}" stroke="var(--ink)" stroke-width="1.6"/><ellipse cx="180" cy="272" rx="${fruit ? 76 : 86}" ry="${fruit ? 88 : 93}" fill="var(--paper)" stroke="var(--ink)" stroke-width="1"/>`;
    /* funicle, ovule with its coats, nucellus, embryo sac */
    s += `<path d="M212 338 L232 356" stroke="${fruit ? "#8a5a2a" : "#6aa856"}" stroke-width="9" stroke-linecap="round"/>`;
    s += `<path d="M170 348 C104 344 104 196 180 196 C256 196 256 344 190 348" fill="${fruit ? "#f6ecd0" : "var(--c-soft)"}" stroke="${fruit ? "#8a5a2a" : "#6aa856"}" stroke-width="${fruit ? 8 : 6}" stroke-linecap="round"/>`;
    s += `<ellipse cx="180" cy="272" rx="28" ry="54" fill="${fruit ? ENDO11 : "var(--sheet)"}" stroke="var(--ink)" stroke-width="1.4"/>`;
    if (tube) s += `<path d="${tube}" fill="none" stroke="${TUBE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="${tube}" fill="none" stroke="#f6e6b0" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (!fruit) {
      s += [[168, 234], [180, 227], [192, 234]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#e4e2cc" stroke="var(--ink)" stroke-width="1"/>`).join("");
      s += [[167, 313], [193, 313]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#cfe3f2" stroke="var(--ink)" stroke-width="1"/>`).join("");
      if (st < 4) s += `<circle cx="180" cy="266" r="10" fill="#ddd0f0" stroke="#7b5ab5" stroke-width="1.8"/>` + T11(180, 270, "2n", "middle", 12, DK11, "700") + `<ellipse cx="180" cy="303" rx="9" ry="11.5" fill="#f2b8c6" stroke="${FEM11}" stroke-width="1.8"/>` + T11(180, 307, "n", "middle", 12, DK11, "700");
      else s += `<circle cx="180" cy="266" r="12" fill="${ENDO11}" stroke="var(--bad)" stroke-width="2.6"/>` + T11(180, 270, "3n", "middle", 12, DK11, "700") + `<ellipse cx="180" cy="303" rx="10.5" ry="12.5" fill="#d9c6e6" stroke="var(--bad)" stroke-width="2.6"/>` + T11(180, 307, "2n", "middle", 12, DK11, "700");
      s += `<circle cx="180" cy="26" r="7" fill="${POL11}" stroke="var(--ink)" stroke-width="1"/>`;
      const mg = st === 1 ? [[180, 118], [180, 136]] : st === 2 ? [[122, 344], [146, 358]] : st === 3 ? [[173, 322], [187, 286]] : [];
      s += mg.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${MALE11}" stroke="var(--sheet)" stroke-width="1.2"/>`).join("");
    } else {
      s += `<path d="M180 326 L180 300" stroke="${EMB11}" stroke-width="4" stroke-dasharray="4 3"/><path d="M180 304 C166 304 160 290 168 280 C172 275 178 278 180 284 C182 278 188 275 192 280 C200 290 194 304 180 304 Z" fill="${EMB11}" stroke="var(--ink)" stroke-width="1"/>` + T11(174, 252, "3n", "middle", 12, DK11, "700");
    }
    /* labels */
    if (!fruit) {
      s += LD11(152, 20, 174, 25) + T11(150, 24, L2("Pollen grain", "পরাগরেণু"), "end") + LD11(208, 26, 197, 30) + T11(210, 30, L2("Stigma", "গর্ভমুণ্ড"), "start") + LD11(208, 96, 190, 96) + T11(210, 100, L2("Style", "গর্ভদণ্ড"), "start");
      if (st >= 1) s += LD11(152, 76, 177, 84) + T11(150, 80, L2("Pollen tube", "পরাগনালি"), "end", 13, TUBE, "700");
      s += LD11(232, 150, 193, 230) + T11(234, 148, L2("Antipodal cells", "প্রতিপাদ কোষ"), "start", 12.5);
      s += LD11(256, 172, 190, 262) + T11(258, 172, st >= 4 ? L2("Endosperm", "সস্য (3n)") : L2("Secondary", "গৌণ নিউক্লিয়াস"), "start", 12.5, st >= 4 ? "var(--bad)" : "var(--ink)", st >= 4 ? "700" : "") + (st >= 4 ? T11(258, 187, L2("(3n)", ""), "start", 12.5, "var(--bad)", "700") : T11(258, 187, L2("nucleus (2n)", "(2n)"), "start", 12.5));
      s += LD11(96, 190, 132, 232) + T11(98, 186, L2("Ovule", "ডিম্বক"), "end") + LD11(290, 222, 268, 232) + T11(292, 220, L2("Ovary", "গর্ভাশয়"), "start");
      s += LD11(292, 318, 189, 305) + T11(294, 322, st >= 4 ? L2("Zygote", "জাইগোট") : L2("Egg (n)", "ডিম্বাণু (n)"), "start", 12.5, st >= 4 ? "var(--bad)" : FEM11, "700") + (st >= 4 ? T11(294, 337, "(2n)", "start", 12.5, "var(--bad)", "700") : "");
      s += LD11(292, 356, 199, 316) + T11(294, 362, L2("Synergid", "সহকারী কোষ"), "start", 12.5);
      s += LD11(180, 386, 180, 351) + T11(180, 400, L2("Micropyle", "ডিম্বকরন্ধ্র"), "middle");
      s += `<circle cx="14" cy="372" r="5" fill="${MALE11}"/>` + T11(24, 376, L2("male", "পুং"), "start", 12.5, MALE11, "700") + T11(24, 391, L2("gamete (n)", "জননকোষ (n)"), "start", 12.5, MALE11, "700");
    } else {
      s += LD11(230, 96, 190, 96) + T11(232, 100, L2("dried style", "শুকনো গর্ভদণ্ড"), "start", 12.5, "var(--muted)");
      s += LD11(256, 172, 194, 236) + T11(258, 172, L2("Endosperm", "সস্য (3n)"), "start", 12.5, "var(--ink)", "700") + T11(258, 187, L2("(3n)", ""), "start", 12.5, "var(--ink)", "700");
      s += LD11(96, 190, 128, 226) + T11(98, 186, L2("Seed", "বীজ"), "end", 14, "var(--bad)", "700") + LD11(292, 222, 272, 232) + T11(294, 220, L2("Fruit", "ফল"), "start", 14, "var(--bad)", "700");
      s += LD11(292, 318, 194, 294) + T11(294, 322, L2("Embryo", "ভ্রূণ"), "start", 13, EMB11, "700") + LD11(70, 356, 120, 316) + T11(68, 366, L2("Seed coat", "বীজত্বক"), "end", 12.5);
    }
    $("#b11ts", el).innerHTML = s + `</svg>`;
    $("#b11to", el).innerHTML = STEPS[st];
    $("#b11tn", el).textContent = B11(st + 1) + " / " + B11(STEPS.length);
  };
  const drawMap = () => {
    const k = MAP[sel][0], on = q => q === k, hc = (q, c) => on(q) ? "var(--bad)" : c, hw = (q, w) => on(q) ? w + 2.2 : w;
    let s = `<svg viewBox="0 0 360 246" role="img" aria-label="${L2("What each part of the flower becomes after fertilisation", "নিষেকের পর ফুলের কোন অংশ কী হয়")}">${arrowDefs("b11tm", "var(--muted)")}`;
    /* before: carpel with petals and stamens */
    s += `<g data-k="rest" style="cursor:pointer"><path d="M58 196 C14 170 6 110 22 64 C44 96 60 150 66 190 Z" fill="${PET11}" stroke="${hc("rest", "var(--ink)")}" stroke-width="${hw("rest", 1)}"/><path d="M122 196 C166 170 174 110 158 64 C136 96 120 150 114 190 Z" fill="${PET11}" stroke="${hc("rest", "var(--ink)")}" stroke-width="${hw("rest", 1)}"/><path d="M62 186 L48 96 M118 186 L132 96" stroke="${on("rest") ? "var(--bad)" : "#8a7a3a"}" stroke-width="2.5"/><ellipse cx="47" cy="88" rx="6" ry="10" fill="${STA11}" stroke="var(--ink)" stroke-width=".8"/><ellipse cx="133" cy="88" rx="6" ry="10" fill="${STA11}" stroke="var(--ink)" stroke-width=".8"/><path d="M90 96 L90 34" stroke="${hc("rest", "var(--ink)")}" stroke-width="${on("rest") ? 9.5 : 7.5}"/><path d="M90 96 L90 34" stroke="${CAR11}" stroke-width="5"/><ellipse cx="90" cy="30" rx="10" ry="5.5" fill="#c9b458" stroke="${hc("rest", "var(--ink)")}" stroke-width="${hw("rest", 1)}"/></g>`;
    s += `<g data-k="ovary" style="cursor:pointer"><ellipse cx="90" cy="150" rx="44" ry="56" fill="${CAR11}" stroke="${hc("ovary", "var(--ink)")}" stroke-width="${hw("ovary", 1.4)}"/></g>`;
    s += `<g data-k="coat" style="cursor:pointer"><ellipse cx="90" cy="152" rx="27" ry="38" fill="none" stroke="${hc("coat", "#6aa856")}" stroke-width="${on("coat") ? 7 : 5}"/></g>`;
    s += `<g data-k="ovule" style="cursor:pointer"><ellipse cx="90" cy="152" rx="24.5" ry="35.5" fill="var(--c-soft)" stroke="${hc("ovule", "var(--ink)")}" stroke-width="${hw("ovule", .8)}"/><ellipse cx="90" cy="152" rx="13" ry="26" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/></g>`;
    s += `<g data-k="sec" style="cursor:pointer"><circle cx="90" cy="146" r="6.5" fill="#ddd0f0" stroke="${hc("sec", "#7b5ab5")}" stroke-width="${hw("sec", 1.5)}"/></g><g data-k="egg" style="cursor:pointer"><ellipse cx="90" cy="167" rx="5.5" ry="7" fill="#f2b8c6" stroke="${hc("egg", FEM11)}" stroke-width="${hw("egg", 1.5)}"/></g>`;
    /* after: fruit with one seed */
    s += `<path d="M270 62 L270 44" stroke="#a08a66" stroke-width="4" stroke-linecap="round"/>`;
    s += `<g data-k="ovary" style="cursor:pointer"><ellipse cx="270" cy="140" rx="70" ry="80" fill="#f0a94a" stroke="${hc("ovary", "var(--ink)")}" stroke-width="${hw("ovary", 1.4)}"/></g>`;
    s += `<g data-k="coat" style="cursor:pointer"><ellipse cx="270" cy="144" rx="34" ry="46" fill="none" stroke="${hc("coat", "#8a5a2a")}" stroke-width="${on("coat") ? 9 : 7}"/></g>`;
    s += `<g data-k="ovule" style="cursor:pointer"><ellipse cx="270" cy="144" rx="31" ry="43" fill="#f6ecd0" stroke="${hc("ovule", "var(--ink)")}" stroke-width="${hw("ovule", .8)}"/></g>`;
    s += `<g data-k="sec" style="cursor:pointer"><ellipse cx="270" cy="140" rx="20" ry="32" fill="${ENDO11}" stroke="${hc("sec", "var(--ink)")}" stroke-width="${hw("sec", 1)}"/></g>`;
    s += `<g data-k="egg" style="cursor:pointer"><path d="M270 172 C258 172 254 160 260 152 C264 147 268 150 270 155 C272 150 276 147 280 152 C286 160 282 172 270 172 Z" fill="${EMB11}" stroke="${hc("egg", "var(--ink)")}" stroke-width="${hw("egg", 1)}"/></g>`;
    if (on("rest")) s += `<path d="M330 226 q10 -8 20 0 M196 228 q10 -8 20 0" fill="none" stroke="${PET11}" stroke-width="5" stroke-linecap="round"/>`;
    s += AR11(156, 130, 190, 130, "b11tm", "var(--muted)", 2.5);
    s += T11(90, 240, L2("In the flower", "ফুলে"), "middle", 13, "var(--muted)") + T11(270, 240, L2("After fertilisation", "নিষেকের পর"), "middle", 13, "var(--muted)");
    s += T11(90, 16, MAP[sel][1], "middle", 13, "var(--bad)", "700") + T11(270, 30, MAP[sel][2], "middle", 13, "var(--bad)", "700");
    $("#b11ts", el).innerHTML = s + `</svg>`;
    tap11($("#b11ts", el), q => { sel = MAP.findIndex(m => m[0] === q); syncChips(); drawMap(); });
    $("#b11to", el).innerHTML = MAP[sel][3];
  };
  const syncChips = () => el.querySelectorAll(".b11tc button").forEach(q => q.setAttribute("aria-pressed", +q.dataset.i === sel));
  const setView = () => {
    const b = $("#b11tb", el);
    if (view === "step") {
      b.innerHTML = `<div class="svgwrap fit" id="b11ts"></div><div class="w-row" style="margin:6px 0"><button class="btn" id="b11tk">◀ ${L2("Back", "আগের ধাপ")}</button><button class="btn solid" id="b11tx">${L2("Next", "পরের ধাপ")} ▶</button><span class="hint" id="b11tn"></span></div><div class="w-out" id="b11to"></div>`;
      $("#b11tx", el).addEventListener("click", () => { st = (st + 1) % STEPS.length; drawStep(); });
      $("#b11tk", el).addEventListener("click", () => { st = (st + STEPS.length - 1) % STEPS.length; drawStep(); });
      drawStep();
    } else {
      b.innerHTML = `<div class="chipset b11tc" role="group">${MAP.map((m, i) => `<button data-i="${i}" aria-pressed="${i === sel}">${m[1]}</button>`).join("")}</div><div class="svgwrap fit" id="b11ts" style="margin-top:6px"></div><div class="w-out" id="b11to"></div>`;
      chips11(el, ".b11tc", q => { sel = +q.dataset.i; drawMap(); });
      drawMap();
    }
  };
  chips11(el, ".b11tv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 11.3 animal reproduction: external or internal fertilisation, block diagram, hormones */
W.b11animal = (el) => {
  const ORG = [[L2("Human", "মানুষ"), 46], [L2("Frog", "ব্যাঙ"), 26], [L2("Cow", "গরু"), 60], [L2("Hen", "মুরগি"), 78]];
  const GL = [
    ["pit", L2("Pituitary gland", "পিটুইটারি গ্রন্থি"), L2("several stimulating hormones", "কয়েকটি উদ্দীপক হরমোন"), L2("They control the growth, secretion and work of the testes and ovaries. They also control the growth of the mammary glands, the secretion of milk and the contraction of the uterus.", "এরা শুক্রাশয় ও ডিম্বাশয়ের বৃদ্ধি, ক্ষরণ ও কাজ নিয়ন্ত্রণ করে। স্তনগ্রন্থির বৃদ্ধি, দুগ্ধ ক্ষরণ ও জরায়ুর সংকোচনও নিয়ন্ত্রণ করে।")],
    ["thy", L2("Thyroid gland", "থাইরয়েড গ্রন্থি"), L2("thyroxine", "থাইরক্সিন"), L2("Helps physical and mental growth, the appearance of sexual characters, and metabolism.", "দৈহিক ও মানসিক বৃদ্ধি, যৌন লক্ষণ প্রকাশ এবং বিপাকে সহায়তা করে।")],
    ["adr", L2("Adrenal gland", "অ্যাড্রেনাল গ্রন্থি"), L2("some adrenal hormones", "অ্যাড্রেনালের কিছু হরমোন"), L2("Help the growth of the reproductive organs and the appearance of sexual characters.", "প্রজনন অঙ্গের বৃদ্ধি ও যৌন লক্ষণ প্রকাশে সহায়তা করে।")],
    ["ova", L2("Ovary (in females)", "ডিম্বাশয় (মেয়েদের)"), L2("oestrogen and progesterone", "ইস্ট্রোজেন ও প্রোজেস্টেরন"), L2("Bring the feminine characters, control the menstrual cycle and have a part in producing ova. In pregnancy they control the growth of the uterus, embryo and placenta.", "নারীসুলভ লক্ষণ সৃষ্টি করে, ঋতুচক্র নিয়ন্ত্রণ করে, ডিম্বাণু উৎপাদনে ভূমিকা রাখে। গর্ভাবস্থায় জরায়ু, ভ্রূণ ও অমরার বৃদ্ধি নিয়ন্ত্রণ করে।")],
    ["pla", L2("Placenta (only in pregnancy)", "অমরা (শুধু গর্ভাবস্থায়)"), L2("gonadotropin and progesterone", "গোনাডোট্রপিন ও প্রোজেস্টেরন"), L2("Stimulate the hormone-making tissue of the ovary and control the growth of the mammary glands. The placenta forms in the uterus and is lost at birth.", "ডিম্বাশয়ের হরমোন তৈরির টিস্যুকে উদ্দীপিত করে এবং স্তনগ্রন্থির বৃদ্ধি নিয়ন্ত্রণ করে। অমরা জরায়ুতে তৈরি হয় এবং প্রসবের সময় বেরিয়ে যায়।")],
    ["tes", L2("Testis (in males)", "শুক্রাশয় (ছেলেদের)"), L2("testosterone (an androgen)", "টেস্টোস্টেরন (একটি অ্যান্ড্রোজেন)"), L2("Helps sperm production and brings the male characters: beard and moustache, change of voice.", "শুক্রাণু উৎপাদনে সাহায্য করে এবং পুরুষসুলভ লক্ষণ আনে: দাড়ি-গোঁফ গজানো, গলার স্বর পরিবর্তন।")]];
  let view = "where", kind = "ext", org = 0, st = 0, gl = 0;
  el.innerHTML = tabs11("b11av", [["where", L2("Outside or inside?", "বাইরে, না ভেতরে?")], ["block", L2("Block diagram", "ব্লকচিত্র")], ["horm", L2("Hormones", "হরমোন")]], view) + `<div id="b11ab" style="margin-top:8px"></div>`;
  const fish = (x, y, d, c) => `<g transform="translate(${x} ${y}) scale(${d} 1)"><path d="M-30 0 L-52 -14 L-48 0 L-52 14 Z" fill="#aab8c2" stroke="${c}" stroke-width="1.6"/><ellipse cx="0" cy="0" rx="34" ry="15" fill="#c6d2da" stroke="${c}" stroke-width="2"/><path d="M-4 -14 L6 -24 L14 -13" fill="#aab8c2" stroke="${c}" stroke-width="1.4"/><circle cx="22" cy="-4" r="2.6" fill="var(--ink)"/><path d="M12 -8 Q8 0 12 8" fill="none" stroke="${c}" stroke-width="1.2"/></g>`;
  const drawWhere = () => {
    let s = `<svg viewBox="0 0 360 204" role="img" aria-label="${kind === "ext" ? L2("External fertilisation in water", "পানিতে বহিঃনিষেক") : L2("Internal fertilisation", "অন্তঃনিষেক")}">`;
    if (kind === "ext") {
      let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      s += `<rect x="0" y="34" width="360" height="170" fill="#9cc8e8" opacity=".35"/><path d="M0 34 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="${VEIN11}" stroke-width="2"/>`;
      s += fish(62, 96, 1, FEM11) + fish(298, 96, -1, MALE11);
      for (let i = 0; i < 44; i++) { const x = 104 + rnd() * 112, y = 66 + rnd() * 110, f = i % 5 === 0; s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3.6" fill="#f6e3a0" stroke="${f ? "var(--good)" : "#a8873a"}" stroke-width="${f ? 2.2 : .9}"/>`; }
      for (let i = 0; i < 16; i++) s += sperm11((176 + rnd() * 80).toFixed(0), (62 + rnd() * 116).toFixed(0), -10 + rnd() * 20, .55);
      s += T11(62, 136, L2("female", "স্ত্রী মাছ"), "middle", 13, FEM11, "700") + T11(298, 136, L2("male", "পুরুষ মাছ"), "middle", 13, MALE11, "700") + T11(180, 22, L2("eggs and sperm are shed into the water", "ডিম্বাণু ও শুক্রাণু পানিতে ছাড়া হয়"), "middle", 13, "var(--ink)", "700");
      s += `<circle cx="20" cy="190" r="3.6" fill="#f6e3a0" stroke="var(--good)" stroke-width="2.2"/>` + T11(30, 194, L2("fertilised egg", "নিষিক্ত ডিম"), "start", 12.5, "var(--ink)", "", true);
    } else {
      const d = "M24 150 C100 60 260 60 336 150";
      s += `<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="60" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${WALL11}" stroke-width="57" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--paper)" stroke-width="34" stroke-linecap="round"/>`;
      s += `<circle cx="238" cy="92" r="13" fill="#f2b8c6" stroke="${FEM11}" stroke-width="2"/><circle cx="238" cy="92" r="4.5" fill="${FEM11}"/>`;
      s += sperm11(214, 86, 195, .8) + sperm11(178, 82, 185, .8) + sperm11(148, 90, 170, .8) + sperm11(120, 100, 160, .8) + sperm11(96, 116, 150, .8) + sperm11(160, 96, 175, .8);
      s += T11(180, 22, L2("inside the body of the female", "স্ত্রীদেহের ভেতরে"), "middle", 13, "var(--ink)", "700") + LD11(258, 44, 242, 80) + T11(262, 42, L2("ovum", "ডিম্বাণু"), "start", 13, FEM11, "700") + LD11(150, 140, 126, 106) + T11(180, 154, L2("sperm swim to the ovum", "শুক্রাণু সাঁতরে ডিম্বাণুর কাছে যায়"), "middle", 13, MALE11, "700");
      s += T11(180, 180, L2("gametes stay moist and protected", "জননকোষ ভেজা ও সুরক্ষিত থাকে"), "middle", 12.5, "var(--muted)");
    }
    $("#b11as", el).innerHTML = s + `</svg>`;
    $("#b11ao", el).innerHTML = kind === "ext" ? `<b>${L2("External fertilisation", "বহিঃনিষেক")}</b>` + UL11([L2("happens outside the body, in water", "প্রাণিদেহের বাইরে, পানিতে ঘটে"), L2("very many eggs; many are never fertilised or are eaten", "ডিমের সংখ্যা অনেক; অনেকগুলো নিষিক্তই হয় না বা অন্যের খাদ্য হয়"), L2("most fishes, frogs (but not the shark)", "অধিকাংশ মাছ, ব্যাঙ (তবে হাঙর নয়)")]) : `<b>${L2("Internal fertilisation", "অন্তঃনিষেক")}</b>` + UL11([L2("happens inside the reproductive organ of the female", "স্ত্রীদেহের জননাঙ্গের ভেতরে ঘটে"), L2("few eggs; each has a good chance", "ডিম অল্প; প্রতিটির সম্ভাবনা বেশি"), L2("most land animals: insects, reptiles, birds, mammals, humans; also the shark", "ডাঙার অধিকাংশ প্রাণী: পতঙ্গ, সরীসৃপ, পাখি, স্তন্যপায়ী, মানুষ; হাঙরও")]);
  };
  const drawBlock = () => {
    const [, N] = ORG[org], h = N / 2, n = v => B11(v);
    const box = (x, y, w, hh, c, l1, l2) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="9" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-width="2"/>` + T11(x + w / 2, y + 19, l1, "middle", 12.5, "var(--ink)", "700") + T11(x + w / 2, y + 36, l2, "middle", 12.5, "var(--ink)");
    let s = `<svg viewBox="0 0 360 336" role="img" aria-label="${L2("Block diagram of the steps of reproduction", "প্রজননের ধাপগুলোর ব্লকচিত্র")}">${arrowDefs("b11ad", "var(--muted)")}`;
    s += box(14, 8, 158, 46, MALE11, L2("Male mother cell", "পুং জনন মাতৃকোষ"), `2n = ${n(N)}`) + box(188, 8, 158, 46, FEM11, L2("Female mother cell", "স্ত্রী জনন মাতৃকোষ"), `2n = ${n(N)}`);
    if (st >= 1) {
      s += AR11(93, 56, 93, 86, "b11ad", "var(--muted)") + AR11(267, 56, 267, 86, "b11ad", "var(--muted)") + T11(180, 76, L2("meiosis", "মিয়োসিস"), "middle", 13, "var(--c)", "700");
      s += box(14, 90, 158, 62, MALE11, L2("4 sperm", "৪টি শুক্রাণু"), `n = ${n(h)}`) + box(188, 90, 158, 62, FEM11, L2("1 ovum", "১টি ডিম্বাণু"), `n = ${n(h)}`);
      s += [46, 76, 110, 140].map(x => sperm11(x, 140, 180, .6)).join("") + `<circle cx="267" cy="140" r="7" fill="#f2b8c6" stroke="${FEM11}" stroke-width="1.6"/>`;
    }
    if (st >= 2) {
      s += AR11(110, 154, 152, 190, "b11ad", "var(--muted)") + AR11(250, 154, 208, 190, "b11ad", "var(--muted)") + T11(180, 172, L2("fertilisation", "নিষেক"), "middle", 13, "var(--c)", "700");
      s += box(100, 194, 160, 46, "#7b5ab5", L2("Zygote", "জাইগোট"), `2n = ${n(h)} + ${n(h)} = ${n(N)}`);
    }
    if (st >= 3) {
      s += AR11(180, 242, 180, 272, "b11ad", "var(--muted)") + T11(190, 262, L2("repeated mitosis", "বারবার মাইটোসিস"), "start", 13, "var(--c)", "700");
      s += box(60, 276, 240, 46, EMB11, L2("Embryo → young one", "ভ্রূণ → নতুন প্রাণী"), L2(`every body cell 2n = ${N}`, `প্রতিটি দেহকোষে 2n = ${n(N)}`));
    }
    $("#b11as", el).innerHTML = s + `</svg>`;
    $("#b11ao", el).innerHTML = [
      L2(`In the reproductive organs of each parent there are <b>mother cells</b> with two sets of chromosomes (2n = ${N}).`, `প্রতিটি জনকের প্রজনন অঙ্গে থাকে দুই প্রস্থ ক্রোমোজোমবিশিষ্ট <b>জনন মাতৃকোষ</b> (2n = ${n(N)})।`),
      L2(`<b>Meiosis</b> halves the number: n = ${h}. One male mother cell gives 4 sperm; one female mother cell gives 1 large ovum (the other three small cells break down).`, `<b>মিয়োসিসে</b> সংখ্যা অর্ধেক হয়: n = ${n(h)}। একটি পুং মাতৃকোষ থেকে ৪টি শুক্রাণু হয়; একটি স্ত্রী মাতৃকোষ থেকে ১টি বড় ডিম্বাণু হয় (বাকি তিনটি ছোট কোষ নষ্ট হয়ে যায়)।`),
      L2(`<b>Fertilisation:</b> one sperm fuses with the ovum. ${h} + ${h} = ${N}: the diploid number is restored in the zygote.`, `<b>নিষেক:</b> একটি শুক্রাণু ডিম্বাণুর সাথে মিলিত হয়। ${n(h)} + ${n(h)} = ${n(N)}: জাইগোটে ডিপ্লয়েড সংখ্যা পুনঃস্থাপিত হয়।`),
      L2("The zygote divides by <b>mitosis</b> again and again and becomes the embryo, and the embryo grows into the young animal. Every body cell keeps 2n.", "জাইগোট বারবার <b>মাইটোসিসে</b> ভাগ হয়ে ভ্রূণ হয়, আর ভ্রূণ বেড়ে নতুন প্রাণী হয়। প্রতিটি দেহকোষে 2n-ই থাকে।")][st];
    $("#b11an", el).textContent = B11(st + 1) + " / " + B11(4);
  };
  const drawHorm = () => {
    const k = GL[gl][0], on = q => q === k, c = q => on(q) ? "var(--bad)" : "var(--c)", g = (q, inner) => `<g data-k="${q}" style="cursor:pointer">${inner}</g>`;
    let s = `<svg viewBox="0 0 360 316" role="img" aria-label="${L2("Glands that make the hormones of reproduction", "প্রজনন-সংক্রান্ত হরমোন তৈরি করে যে গ্রন্থিগুলো")}">`;
    s += `<circle cx="180" cy="40" r="27" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.6"/><rect x="169" y="64" width="22" height="20" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.6"/><path d="M124 88 Q180 74 236 88 L226 190 Q230 240 234 278 L126 278 Q130 240 134 190 Z" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.6"/>`;
    s += `<ellipse cx="158" cy="176" rx="9" ry="14" fill="none" stroke="var(--rule)" stroke-width="1.5"/><ellipse cx="202" cy="176" rx="9" ry="14" fill="none" stroke="var(--rule)" stroke-width="1.5"/>`;
    s += g("pit", `<circle cx="180" cy="42" r="${on("pit") ? 7 : 5.5}" fill="${c("pit")}"/>`);
    s += g("thy", `<ellipse cx="174" cy="75" rx="${on("thy") ? 6.5 : 5.5}" ry="4.5" fill="${c("thy")}"/><ellipse cx="186" cy="75" rx="${on("thy") ? 6.5 : 5.5}" ry="4.5" fill="${c("thy")}"/>`);
    s += g("adr", `<path d="M149 164 L158 ${on("adr") ? 150 : 153} L167 164 Z" fill="${c("adr")}"/><path d="M193 164 L202 ${on("adr") ? 150 : 153} L211 164 Z" fill="${c("adr")}"/>`);
    s += g("pla", `<circle cx="180" cy="238" r="13" fill="${on("pla") ? "var(--bad)" : "none"}" fill-opacity=".3" stroke="${c("pla")}" stroke-width="${on("pla") ? 2.6 : 1.6}" stroke-dasharray="4 3"/>`);
    s += g("ova", `<ellipse cx="154" cy="236" rx="${on("ova") ? 9 : 7.5}" ry="5.5" fill="${c("ova")}"/><ellipse cx="206" cy="236" rx="${on("ova") ? 9 : 7.5}" ry="5.5" fill="${c("ova")}"/>`);
    s += g("tes", `<ellipse cx="172" cy="292" rx="${on("tes") ? 7 : 6}" ry="7.5" fill="${c("tes")}"/><ellipse cx="188" cy="292" rx="${on("tes") ? 7 : 6}" ry="7.5" fill="${c("tes")}"/>`);
    s += LD11(248, 34, 187, 41) + LB11("pit", on("pit"), 250, 38, L2("Pituitary", "পিটুইটারি"));
    s += LD11(112, 75, 167, 75) + LB11("thy", on("thy"), 110, 79, L2("Thyroid", "থাইরয়েড"), "end");
    s += LD11(248, 150, 208, 158) + LB11("adr", on("adr"), 250, 154, L2("Adrenal", "অ্যাড্রেনাল"));
    s += LD11(112, 232, 146, 236) + LB11("ova", on("ova"), 110, 230, L2(["Ovary", "(female)"], ["ডিম্বাশয়", "(মেয়েদের)"]), "end");
    s += LD11(248, 216, 190, 230) + LB11("pla", on("pla"), 250, 214, L2(["Placenta", "(in pregnancy)"], ["অমরা", "(গর্ভাবস্থায়)"]));
    s += LD11(248, 292, 196, 292) + LB11("tes", on("tes"), 250, 290, L2(["Testis", "(male)"], ["শুক্রাশয়", "(ছেলেদের)"]));
    $("#b11as", el).innerHTML = s + `</svg>`;
    tap11($("#b11as", el), q => { gl = GL.findIndex(x => x[0] === q); el.querySelectorAll(".b11ah button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.i === gl)); drawHorm(); });
    $("#b11ao", el).innerHTML = `<b>${GL[gl][1]}</b> → ${GL[gl][2]}.<br>${GL[gl][3]}`;
  };
  const setView = () => {
    const b = $("#b11ab", el);
    if (view === "where") {
      b.innerHTML = `<div class="chipset b11aw" role="group"><button data-k="ext" aria-pressed="${kind === "ext"}">${L2("External", "বহিঃনিষেক")}</button><button data-k="int" aria-pressed="${kind === "int"}">${L2("Internal", "অন্তঃনিষেক")}</button></div><div class="svgwrap fit" id="b11as" style="margin-top:6px"></div><div class="w-out" id="b11ao"></div>`;
      chips11(el, ".b11aw", q => { kind = q.dataset.k; drawWhere(); });
      drawWhere();
    } else if (view === "block") {
      b.innerHTML = `<div class="chipset b11ag" role="group">${ORG.map((o, i) => `<button data-o="${i}" aria-pressed="${i === org}">${o[0]}</button>`).join("")}</div><div class="svgwrap fit" id="b11as" style="margin-top:6px"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b11ax">${L2("Next step", "পরের ধাপ")} ▶</button><span class="hint" id="b11an"></span></div><div class="w-out" id="b11ao"></div>`;
      chips11(el, ".b11ag", q => { org = +q.dataset.o; drawBlock(); });
      $("#b11ax", el).addEventListener("click", () => { st = (st + 1) % 4; drawBlock(); });
      drawBlock();
    } else {
      b.innerHTML = `<div class="chipset b11ah" role="group">${GL.map((x, i) => `<button data-i="${i}" aria-pressed="${i === gl}">${x[1].replace(/ \(.*\)/, "").replace(L2(" gland", " গ্রন্থি"), "")}</button>`).join("")}</div><div class="svgwrap fit" id="b11as" style="margin-top:6px"></div><div class="w-out" id="b11ao"></div><div class="hint" style="margin-top:4px">${L2("One outline is used for everyone: ovaries are found in females, testes in males.", "সবার জন্য একটিই রেখাচিত্র ব্যবহার করা হয়েছে: ডিম্বাশয় থাকে মেয়েদের দেহে, শুক্রাশয় ছেলেদের দেহে।")}</div>`;
      chips11(el, ".b11ah", q => { gl = +q.dataset.i; drawHorm(); });
      drawHorm();
    }
  };
  chips11(el, ".b11av", b => { view = b.dataset.v; setView(); });
  setView();
};

/* a simple curled foetus: head up when rot = 0 */
const fetus11 = (cx, cy, sc, rot) => { const SK = "#e9b89c", SD = "#c98f73"; return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${sc})"><path d="M2 38 Q-28 30 -30 48 Q-30 62 -12 60" fill="none" stroke="${SD}" stroke-width="13" stroke-linecap="round"/><ellipse cx="6" cy="12" rx="23" ry="33" fill="${SK}" stroke="${SD}" stroke-width="1.5"/><path d="M-2 -8 Q-22 0 -24 14" fill="none" stroke="${SD}" stroke-width="10" stroke-linecap="round"/><circle cx="-2" cy="-40" r="25" fill="${SK}" stroke="${SD}" stroke-width="1.5"/><path d="M-18 -38 q4 3 8 0" fill="none" stroke="${SD}" stroke-width="1.6" stroke-linecap="round"/></g>`; };

/* 11.3.3 the journey to the uterus, week-by-week development, and exchange across the placenta */
W.b11embryo = (el) => {
  const J = [
    [301, 52, L2("<b>Fertilisation.</b> In the oviduct one sperm enters the ovum and the two nuclei fuse. The cell formed is the <b>zygote</b> (2n).", "<b>নিষেক।</b> ডিম্বনালিতে একটি শুক্রাণু ডিম্বাণুতে ঢোকে, আর দুটি নিউক্লিয়াস একীভূত হয়। তৈরি হয় <b>জাইগোট</b> (2n)।")],
    [260, 37, L2("<b>About 36 hours.</b> Cleavage has begun: the zygote has divided into <b>2 cells</b>. It is moving slowly towards the uterus.", "<b>প্রায় ৩৬ ঘণ্টা।</b> ক্লিভেজ শুরু হয়েছে: জাইগোট ভাগ হয়ে <b>২টি কোষ</b> হয়েছে। এটি ধীরে ধীরে জরায়ুর দিকে এগোচ্ছে।")],
    [212, 40, L2("<b>About 72 hours.</b> A little ball of <b>16 cells</b>. The cells get smaller at each division; the ball itself is hardly bigger than the zygote.", "<b>প্রায় ৭২ ঘণ্টা।</b> <b>১৬ কোষের</b> ছোট্ট একটি বল। প্রতি বিভাজনে কোষগুলো ছোট হয়; বলটি নিজে জাইগোটের চেয়ে তেমন বড় নয়।")],
    [118, 112, L2("<b>Blastocyst.</b> At the end of cleavage the embryo reaches the uterus as a hollow ball of cells.", "<b>ব্লাস্টোসিস্ট।</b> ক্লিভেজের শেষ পর্যায়ে ভ্রূণ কোষের একটি ফাঁপা বল হিসেবে জরায়ুতে পৌঁছায়।")],
    [77, 142, L2("<b>Implantation.</b> The blastocyst fixes itself in the inner wall of the uterus. This is complete within 4 to 5 days after it reaches the uterus. Pregnancy has begun.", "<b>ভ্রূণ সংস্থাপন।</b> ব্লাস্টোসিস্ট জরায়ুর ভেতরের প্রাচীরে সংলগ্ন হয়। জরায়ুতে পৌঁছানোর ৪ থেকে ৫ দিনের মধ্যে এটি সম্পন্ন হয়। গর্ভাবস্থা শুরু হলো।")]];
  const WK = [
    [L2("about 36 hours", "প্রায় ৩৬ ঘণ্টা"), L2("The fertilised ovum has divided into <b>2 cells</b>.", "নিষিক্ত ডিম্বাণু ভাগ হয়ে <b>২টি কোষ</b> হয়েছে।")],
    [L2("about 72 hours", "প্রায় ৭২ ঘণ্টা"), L2("A ball of <b>16 cells</b>. In a few days it will settle in the uterus.", "<b>১৬ কোষের</b> একটি বল। কয়েক দিনের মধ্যে এটি জরায়ুতে স্থান নেবে।")],
    [L2("4 weeks", "৪ সপ্তাহ"), L2("The embryo floats in a fluid-filled sac. The <b>heart has begun to beat</b> and the <b>brain</b> has begun to form.", "ভ্রূণ তরলে ভরা থলিতে ভাসছে। <b>হৃৎপিণ্ড স্পন্দিত হতে শুরু করেছে</b>, <b>মস্তিষ্কের</b> গঠন শুরু হয়েছে।")],
    [L2("5 weeks", "৫ সপ্তাহ"), L2("Growth goes on. Small <b>buds</b> have appeared; they will become the arms and legs.", "বৃদ্ধি চলছে। ছোট ছোট <b>মুকুল</b> দেখা দিয়েছে; এগুলো থেকে হাত ও পা হবে।")],
    [L2("8 weeks", "৮ সপ্তাহ"), L2("All the organs are present, though very small. From now on the embryo is called a <b>foetus</b>.", "সব অঙ্গ তৈরি হয়েছে, তবে খুব ছোট। এখন থেকে ভ্রূণকে বলা হয় <b>ফিটাস</b>।")],
    [L2("28 weeks", "২৮ সপ্তাহ"), L2("The body of the foetus is <b>fully formed</b>. It goes on growing in the stretched uterus.", "ফিটাসের দেহ <b>পূর্ণাঙ্গতা</b> পেয়েছে। প্রসারিত জরায়ুতে তার দৈহিক বৃদ্ধি চলতে থাকে।")],
    [L2("38 weeks", "৩৮ সপ্তাহ"), L2("The foetus has turned <b>head downwards</b>. It is ready to be born.", "ফিটাসের <b>মাথা নিচের দিকে</b> ঘুরে গেছে। সে জন্মের জন্য প্রস্তুত।")]];
  const SUB = {
    o2: [L2("Oxygen", "অক্সিজেন"), 1, BLOOD11, L2("<b>Oxygen</b> diffuses from the mother's blood into the baby's blood. Here the placenta works like a <b>lung</b>.", "<b>অক্সিজেন</b> ব্যাপন প্রক্রিয়ায় মায়ের রক্ত থেকে শিশুর রক্তে যায়। এখানে অমরা <b>ফুসফুসের</b> মতো কাজ করে।")],
    food: [L2("Food", "খাদ্য"), 1, "#3f9d5a", L2("<b>Glucose, amino acids, fats, water and mineral salts</b> pass from the mother's blood to the baby's blood. The baby does not eat; this is its only food supply.", "<b>গ্লুকোজ, অ্যামাইনো এসিড, স্নেহ, পানি ও খনিজ লবণ</b> মায়ের রক্ত থেকে শিশুর রক্তে যায়। শিশু নিজে খায় না; এটিই তার খাদ্যের একমাত্র উৎস।")],
    co2: [L2("Carbon dioxide", "কার্বন ডাই-অক্সাইড"), -1, "#6b7280", L2("<b>Carbon dioxide</b> made in the baby's cells passes into the mother's blood, and her lungs breathe it out.", "শিশুর কোষে তৈরি <b>কার্বন ডাই-অক্সাইড</b> মায়ের রক্তে চলে যায়, আর মায়ের ফুসফুস নিঃশ্বাসের সাথে তা বের করে দেয়।")],
    urea: [L2("Wastes (urea)", "বর্জ্য (ইউরিয়া)"), -1, "#c9781f", L2("<b>Urea</b> and other wastes of metabolism pass from the baby's blood to the mother's blood; her kidneys remove them. Here the placenta works like a <b>kidney</b>.", "<b>ইউরিয়া</b> ও বিপাকের অন্যান্য বর্জ্য শিশুর রক্ত থেকে মায়ের রক্তে যায়; মায়ের বৃক্ক তা বের করে দেয়। এখানে অমরা <b>বৃক্কের</b> মতো কাজ করে।")]};
  let view = "trip", js = 0, sub = "o2";
  el.innerHTML = tabs11("b11ev", [["trip", L2("The journey", "যাত্রা")], ["week", L2("Week by week", "সপ্তাহে সপ্তাহে")], ["plac", L2("Placenta", "অমরা")]], view) + `<div id="b11eb" style="margin-top:8px"></div>`;
  const cellc = (x, y, r, f = "#f6d9b8") => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${f}" stroke="var(--ink)" stroke-width="1"/>`;
  const ball16 = (cx, cy, r) => { let q = ""; [[0, 0], [1, 0], [-1, 0], [.5, .87], [-.5, .87], [.5, -.87], [-.5, -.87], [1.5, .87], [-1.5, .87], [1.5, -.87], [-1.5, -.87], [0, 1.74], [0, -1.74], [2, 0], [-2, 0], [1, 1.74]].forEach(([a, b]) => { q += cellc(cx + a * r * 1.9, cy + b * r * 1.9, r); }); return q; };
  const blast = (cx, cy, R, r) => { let q = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--sheet)"/>`; for (let i = 0; i < 14; i++) { const a = i * 2 * Math.PI / 14; q += cellc(cx + R * Math.cos(a), cy + R * Math.sin(a), r); } return q + cellc(cx - R * .5, cy - R * .2, r, "#e9a98a") + cellc(cx - R * .45, cy + R * .3, r, "#e9a98a") + cellc(cx - R * .1, cy + R * .05, r, "#e9a98a"); };
  const drawTrip = () => {
    const OD = "M146 80 L168 60 C210 28 280 26 312 62 C326 80 322 104 306 116";
    let s = `<svg viewBox="0 0 360 258" role="img" aria-label="${L2("The path of the embryo from the oviduct to the uterus", "ডিম্বনালি থেকে জরায়ু পর্যন্ত ভ্রূণের পথ")}">`;
    s += `<path d="${OD}" fill="none" stroke="var(--ink)" stroke-width="23" stroke-linecap="round"/><path d="M40 52 Q110 30 180 52 Q186 130 136 232 L84 232 Q34 130 40 52 Z" fill="${WALL11}" stroke="var(--ink)" stroke-width="1.5"/><path d="${OD}" fill="none" stroke="${WALL11}" stroke-width="20" stroke-linecap="round"/>`;
    s += `<path d="M72 80 Q110 68 148 80 Q150 130 122 206 L98 206 Q70 130 72 80 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width=".8"/><path d="${OD}" fill="none" stroke="var(--paper)" stroke-width="9" stroke-linecap="round"/>`;
    s += `<ellipse cx="298" cy="146" rx="25" ry="17" fill="#f3dfb0" stroke="var(--ink)" stroke-width="1.4"/><circle cx="290" cy="144" r="5" fill="var(--sheet)" stroke="var(--ink)" stroke-width=".8"/><circle cx="305" cy="150" r="3.5" fill="var(--sheet)" stroke="var(--ink)" stroke-width=".8"/><circle cx="306" cy="139" r="2.5" fill="var(--sheet)" stroke="var(--ink)" stroke-width=".8"/>`;
    s += `<polyline points="${J.slice(0, js + 1).map(p => p[0] + "," + p[1]).join(" ")}" fill="none" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="3 4"/>`;
    J.forEach((p, i) => { if (i < js) s += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--bad)" opacity=".5"/>`; });
    s += `<circle cx="${J[js][0]}" cy="${J[js][1]}" r="6.5" fill="var(--bad)" stroke="var(--sheet)" stroke-width="1.6"/>`;
    if (js === 0) s += sperm11(286, 44, 200, .5) + sperm11(274, 36, 190, .5) + sperm11(262, 40, 175, .5);
    s += T11(240, 14, L2("Oviduct", "ডিম্বনালি"), "middle", 13) + T11(300, 180, L2("Ovary", "ডিম্বাশয়"), "middle", 13) + T11(110, 250, L2("Uterus", "জরায়ু"), "middle", 13) + LD11(28, 196, 60, 180) + T11(8, 212, L2("wall", "প্রাচীর"), "start", 12.5);
    /* enlarged view */
    const ix = 226, iy = 190;
    s += `<circle cx="${ix}" cy="${iy}" r="40" fill="var(--sheet)" stroke="var(--muted)" stroke-width="1.4"/>`;
    if (js === 0) s += `<circle cx="${ix}" cy="${iy}" r="23" fill="#f2b8c6" stroke="${FEM11}" stroke-width="2"/><circle cx="${ix + 3}" cy="${iy}" r="7" fill="${FEM11}" opacity=".6"/>` + sperm11(ix - 18, iy - 4, 190, .8) + sperm11(ix - 30, iy + 22, 150, .55) + sperm11(ix + 6, iy - 33, 250, .55);
    else if (js === 1) s += `<circle cx="${ix}" cy="${iy}" r="28" fill="none" stroke="var(--muted)" stroke-width="1"/>` + cellc(ix - 13, iy, 13) + cellc(ix + 13, iy, 13);
    else if (js === 2) s += ball16(ix, iy, 6.6);
    else if (js === 3) s += blast(ix, iy, 24, 5.4);
    else s += `<path d="M${ix - 40} ${iy - 6} A40 40 0 0 0 ${ix + 40} ${iy - 6} L${ix - 40} ${iy - 6} Z" fill="${WALL11}"/>` + blast(ix, iy - 2, 20, 4.6) + `<circle cx="${ix}" cy="${iy}" r="40" fill="none" stroke="var(--muted)" stroke-width="1.4"/>`;
    s += T11(ix, iy + 56, L2("enlarged", "বড় করে দেখানো"), "middle", 12.5, "var(--muted)");
    $("#b11es", el).innerHTML = s + `</svg>`;
    $("#b11eo", el).innerHTML = J[js][2];
    $("#b11en", el).textContent = B11(js + 1) + " / " + B11(J.length);
  };
  const drawWeek = () => {
    const i = sv(el, "b11ew", "", 0); $("#b11ew-v", el).textContent = WK[i][0];
    const SK = "#e9b89c", SD = "#c98f73", FLUID = "#dcebf7";
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("The embryo at this age", "এই বয়সে ভ্রূণ")}">`;
    if (i === 0) s += `<ellipse cx="180" cy="125" rx="84" ry="50" fill="none" stroke="var(--muted)" stroke-width="1.4"/>` + cellc(144, 125, 36) + cellc(216, 125, 36) + `<circle cx="144" cy="125" r="10" fill="${SD}" opacity=".6"/><circle cx="216" cy="125" r="10" fill="${SD}" opacity=".6"/>`;
    else if (i === 1) s += ball16(180, 125, 15);
    else if (i === 2 || i === 3) {
      const k = i === 2 ? 1 : 1.18;
      s += `<ellipse cx="180" cy="125" rx="104" ry="92" fill="${FLUID}" stroke="var(--ink)" stroke-width="1.4"/><g transform="translate(180 125) scale(${k}) translate(-180 -125)"><path d="M204 92 C150 74 136 164 190 166" fill="none" stroke="${SD}" stroke-width="29" stroke-linecap="round"/><path d="M204 92 C150 74 136 164 190 166" fill="none" stroke="${SK}" stroke-width="26" stroke-linecap="round"/><circle cx="206" cy="94" r="19" fill="${SK}" stroke="${SD}" stroke-width="1.5"/><circle cx="184" cy="118" r="6" fill="${BLOOD11}"/>${i === 3 ? `<ellipse cx="156" cy="110" rx="8" ry="5.5" fill="${SD}" transform="rotate(-30 156 110)"/><ellipse cx="160" cy="150" rx="8" ry="5.5" fill="${SD}" transform="rotate(30 160 150)"/>` : ""}</g>`;
      s += LD11(286, 60, i === 2 ? 216 : 222, i === 2 ? 88 : 82) + T11(288, 58, L2("brain", "মস্তিষ্ক"), "start", 13, "var(--ink)", "", true) + LD11(286, 132, i === 2 ? 190 : 191, i === 2 ? 118 : 117) + T11(288, 136, L2("heart", "হৃৎপিণ্ড"), "start", 13, BLOOD11, "700", true);
      if (i === 3) s += LD11(70, 76, 146, 106) + T11(68, 72, L2("arm bud", "হাতের মুকুল"), "end", 13, "var(--ink)", "", true) + LD11(70, 186, 152, 156) + T11(68, 196, L2("leg bud", "পায়ের মুকুল"), "end", 13, "var(--ink)", "", true);
      s += T11(180, 240, L2("fluid-filled sac", "তরলে ভরা থলি"), "middle", 12.5, "var(--muted)");
    } else {
      const big = i >= 5, R = big ? [112, 118] : [104, 104], A = big ? [98, 104] : [90, 90];
      s += `<ellipse cx="180" cy="125" rx="${R[0]}" ry="${R[1]}" fill="${WALL11}" stroke="var(--ink)" stroke-width="1.5"/><ellipse cx="180" cy="125" rx="${A[0]}" ry="${A[1]}" fill="${FLUID}" stroke="var(--ink)" stroke-width="1"/>`;
      s += `<path d="M${180 + A[0] - 8} 76 Q${180 + A[0] + 6} 118 ${180 + A[0] - 8} 160" fill="none" stroke="#a8433c" stroke-width="15" stroke-linecap="round"/>`;
      const fx = i === 4 ? 166 : 172, fy = i === 4 ? 128 : 126, fs = i === 4 ? .62 : i === 5 ? 1.28 : 1.42, rot = i === 6 ? 180 : 0;
      s += `<path d="M${(fx + (rot ? -8 : 12) * fs).toFixed(0)} ${(fy + (rot ? -20 : 24) * fs).toFixed(0)} C${fx + 60} ${fy + (rot ? -70 : 70)} ${180 + A[0] - 40} ${rot ? 190 : 60} ${180 + A[0] - 8} 118" fill="none" stroke="#b8736a" stroke-width="5" stroke-linecap="round"/>`;
      s += fetus11(fx, fy, fs, rot);
      s += LD11(332, 28, 180 + A[0] - 3, 92) + T11(354, 20, L2("placenta", "অমরা"), "end", 13, "var(--ink)", "", true);
      s += LD11(324, 234, i === 4 ? 212 : i === 5 ? 219 : 254, i === 4 ? 148 : i === 5 ? 153 : 142) + T11(354, 246, L2("cord", "নাড়ি"), "end", 13, "var(--ink)", "", true);
    }
    $("#b11es", el).innerHTML = s + `</svg>`;
    $("#b11eo", el).innerHTML = `<b>${WK[i][0]}:</b> ${WK[i][1]}`;
  };
  const drawPlac = () => {
    const [, dir, col, txt] = SUB[sub];
    let sd = 5; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    let s = `<svg viewBox="0 0 360 236" role="img" aria-label="${L2("Exchange between the mother's blood and the baby's blood in the placenta", "অমরায় মায়ের রক্ত ও শিশুর রক্তের মধ্যে বিনিময়")}">${arrowDefs("b11ep", col)}${arrowDefs("b11er", BLOOD11)}${arrowDefs("b11eu", VEIN11)}`;
    s += `<rect x="12" y="32" width="118" height="150" rx="14" fill="#f3c1ba" stroke="${BLOOD11}" stroke-width="2"/><rect x="150" y="42" width="92" height="130" rx="14" fill="#e6d3ee" stroke="#7b5ab5" stroke-width="2"/>`;
    s += T11(71, 22, L2("Mother's blood", "মায়ের রক্ত"), "middle", 13, BLOOD11, "700") + T11(196, 22, L2("Baby's blood", "শিশুর রক্ত"), "middle", 13, "#7b5ab5", "700") + T11(302, 22, L2("Cord", "নাড়ি"), "middle", 13, "var(--ink)", "700");
    const many = dir > 0 ? [18, 106, 46, 126] : [156, 80, 52, 110], few = dir > 0 ? [156, 80, 52, 110] : [18, 106, 46, 126];
    for (let i = 0; i < 16; i++) s += `<circle cx="${(many[0] + rnd() * many[1]).toFixed(0)}" cy="${(many[2] + rnd() * many[3]).toFixed(0)}" r="3.4" fill="${col}"/>`;
    for (let i = 0; i < 4; i++) s += `<circle cx="${(few[0] + rnd() * few[1]).toFixed(0)}" cy="${(few[2] + rnd() * few[3]).toFixed(0)}" r="3.4" fill="${col}"/>`;
    s += `<rect x="${dir > 0 ? 96 : 100}" y="94" width="92" height="26" rx="13" fill="var(--sheet)" opacity=".85"/>` + (dir > 0 ? AR11(104, 107, 180, 107, "b11ep", col, 4) : AR11(184, 107, 108, 107, "b11ep", col, 4));
    s += AR11(242, 74, 348, 74, "b11er", BLOOD11, 6) + AR11(350, 140, 246, 140, "b11eu", VEIN11, 6);
    s += T11(300, 62, L2("vein → baby", "শিরা → শিশু"), "middle", 12.5, BLOOD11, "700") + T11(300, 162, L2("arteries ← baby", "ধমনি ← শিশু"), "middle", 12.5, VEIN11, "700");
    s += LD11(140, 196, 140, 176) + T11(140, 210, L2("thin wall of the placenta", "অমরার পাতলা প্রাচীর"), "middle", 12.5) + T11(180, 230, L2("The two bloods do not mix.", "দুই রক্ত মেশে না।"), "middle", 13, "var(--ink)", "700");
    $("#b11es", el).innerHTML = s + `</svg>`;
    $("#b11eo", el).innerHTML = txt + " " + (dir > 0 ? L2("Direction: <b>mother → baby</b>.", "দিক: <b>মা → শিশু</b>।") : L2("Direction: <b>baby → mother</b>.", "দিক: <b>শিশু → মা</b>।"));
  };
  const setView = () => {
    const b = $("#b11eb", el);
    if (view === "trip") {
      b.innerHTML = `<div class="svgwrap fit" id="b11es"></div><div class="w-row" style="margin:6px 0"><button class="btn" id="b11ek">◀ ${L2("Back", "আগের ধাপ")}</button><button class="btn solid" id="b11ex">${L2("Next", "পরের ধাপ")} ▶</button><span class="hint" id="b11en"></span></div><div class="w-out" id="b11eo"></div>`;
      $("#b11ex", el).addEventListener("click", () => { js = (js + 1) % J.length; drawTrip(); });
      $("#b11ek", el).addEventListener("click", () => { js = (js + J.length - 1) % J.length; drawTrip(); });
      drawTrip();
    } else if (view === "week") {
      b.innerHTML = `${slider("b11ew", L2("Time after fertilisation", "নিষেকের পর সময়"), 0, 6, 1, 0, "")}<div class="svgwrap fit" id="b11es" style="margin-top:6px"></div><div class="w-out" id="b11eo"></div><div class="hint" style="margin-top:4px">${L2("The pictures are simple sketches and are not drawn to scale.", "ছবিগুলো সরল রেখাচিত্র; আকার মাপ অনুযায়ী নয়।")}</div>`;
      $("#b11ew", el).addEventListener("input", drawWeek);
      drawWeek();
    } else {
      b.innerHTML = `<div class="chipset b11ec" role="group">${Object.keys(SUB).map(k => `<button data-s="${k}" aria-pressed="${k === sub}">${SUB[k][0]}</button>`).join("")}</div><div class="svgwrap fit" id="b11es" style="margin-top:6px"></div><div class="w-out" id="b11eo"></div>`;
      chips11(el, ".b11ec", q => { sub = q.dataset.s; drawPlac(); });
      drawPlac();
    }
  };
  chips11(el, ".b11ev", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 11.4 HIV: structure of the virus, how it does and does not spread, and what it does to the defence */
W.b11hiv = (el) => {
  const PARTS = [
    ["gp120", "GP 120", L2("A glycoprotein knob on the outside. It is the <b>key</b> of the virus: it fits on to a CD4 white blood cell and lets the virus attach.", "বাইরের দিকের গ্লাইকোপ্রোটিনের গুটি। এটিই ভাইরাসের <b>চাবি</b>: CD4 শ্বেত রক্তকোষের গায়ে লেগে গিয়ে ভাইরাসকে আটকে দেয়।")],
    ["gp41", "GP 41", L2("The glycoprotein stalk that holds GP 120 on the envelope. It helps the virus to join with the cell and get in.", "যে গ্লাইকোপ্রোটিনের বোঁটা GP 120-কে আবরণের সাথে ধরে রাখে। ভাইরাসকে কোষের সাথে মিশে ভেতরে ঢুকতে সাহায্য করে।")],
    ["env", L2("Envelope", "আবরণ"), L2("The outer coat, a <b>phospholipid layer</b>. The virus takes it from the membrane of the cell in which it was made. Soap and drying damage it easily, which is one reason why HIV does not last outside the body.", "বাইরের আবরণ, একটি <b>ফসফোলিপিড স্তর</b>। যে কোষে ভাইরাসটি তৈরি হয়েছে, তার ঝিল্লি থেকেই এটি নেওয়া। সাবান বা শুকিয়ে যাওয়ায় এটি সহজে নষ্ট হয়; দেহের বাইরে HIV না টেকার এটি একটি কারণ।")],
    ["cap", L2("Capsid", "ক্যাপসিড"), L2("The protein shell inside the envelope. It guards the genetic material and the enzyme.", "আবরণের ভেতরের প্রোটিনের খোলস। বংশগতি বস্তু ও এনজাইমকে রক্ষা করে।")],
    ["rna", "RNA", L2("The genetic material of HIV: two strands of RNA. It carries the instructions for making new viruses.", "HIV-এর বংশগতি বস্তু: দুটি RNA সূত্র। নতুন ভাইরাস তৈরির নির্দেশ এতেই থাকে।")],
    ["rt", L2("Reverse transcriptase", "রিভার্স ট্রান্সক্রিপটেজ"), L2("An enzyme the virus carries with it. Inside the cell it copies the viral RNA into DNA, and that DNA is joined to the cell's own DNA. Many HIV medicines work by blocking this enzyme.", "ভাইরাসের সঙ্গে থাকা একটি এনজাইম। কোষের ভেতরে এটি ভাইরাসের RNA থেকে DNA তৈরি করে, আর সেই DNA কোষের নিজের DNA-এর সাথে জুড়ে যায়। HIV-এর অনেক ওষুধ এই এনজাইমকে আটকে দিয়েই কাজ করে।")]];
  const SIT = [
    [L2("Two people use the same syringe.", "দুজন একই সিরিঞ্জ ব্যবহার করল।"), 1, L2("Blood left in the needle goes straight into the next person.", "সুচে লেগে থাকা রক্ত সরাসরি পরের জনের দেহে ঢোকে।")],
    [L2("Shaking hands or hugging.", "হাত মেলানো বা কোলাকুলি করা।"), 0, L2("HIV does not pass through healthy skin. Touch is safe.", "অক্ষত ত্বক ভেদ করে HIV ঢুকতে পারে না। স্পর্শ নিরাপদ।")],
    [L2("A mosquito bites a person with HIV and then bites you.", "একটি মশা HIV আক্রান্ত একজনকে কামড়ে পরে তোমাকে কামড়াল।"), 0, L2("HIV cannot live or multiply in a mosquito, and the mosquito does not inject the first person's blood.", "HIV মশার দেহে বাঁচে না, বাড়েও না; আর মশা আগের জনের রক্ত তোমার দেহে ঢুকিয়ে দেয় না।")],
    [L2("A patient is given blood that was not tested.", "একজন রোগীকে পরীক্ষা না করা রক্ত দেওয়া হলো।"), 1, L2("If the donor had HIV, the virus enters with the blood. This is why all donated blood is tested.", "দাতার HIV থাকলে রক্তের সাথে ভাইরাসও ঢুকে যায়। এ জন্যই দান করা সব রক্ত পরীক্ষা করা হয়।")],
    [L2("Eating from the same plate or drinking from the same glass.", "একই থালায় খাওয়া বা একই গ্লাসে পানি পান করা।"), 0, L2("Food, water and saliva do not spread HIV.", "খাবার, পানি বা লালার মাধ্যমে HIV ছড়ায় না।")],
    [L2("An infected mother and her baby: pregnancy, birth, breast milk.", "আক্রান্ত মা ও তাঁর শিশু: গর্ভাবস্থা, প্রসব, বুকের দুধ।"), 1, L2("The virus can pass to the baby. Treatment of the mother during pregnancy protects the baby in most cases.", "ভাইরাস শিশুর দেহে যেতে পারে। গর্ভাবস্থায় মায়ের চিকিৎসা হলে অধিকাংশ ক্ষেত্রে শিশু রক্ষা পায়।")],
    [L2("Sitting on the same bench, studying and playing together.", "একই বেঞ্চে বসা, একসাথে পড়া ও খেলা।"), 0, L2("Ordinary contact at school is completely safe.", "স্কুলের সাধারণ মেলামেশা সম্পূর্ণ নিরাপদ।")],
    [L2("A barber uses one blade on several customers.", "নাপিত একই ব্লেড কয়েকজন খদ্দেরের জন্য ব্যবহার করলেন।"), 1, L2("A small cut can leave blood on the blade. Always ask for a new blade.", "সামান্য কাটায় ব্লেডে রক্ত লেগে থাকতে পারে। সব সময় নতুন ব্লেড চেয়ে নাও।")],
    [L2("Coughing or sneezing near you.", "তোমার কাছে হাঁচি বা কাশি দেওয়া।"), 0, L2("HIV does not travel through the air.", "HIV বাতাসের মাধ্যমে ছড়ায় না।")],
    [L2("Unprotected sexual relations with an infected person.", "আক্রান্ত ব্যক্তির সাথে অনিরাপদ যৌনমিলন।"), 1, L2("This is the most common route in the world. The fluids of the reproductive organs carry the virus.", "সারা বিশ্বে এটিই সবচেয়ে সাধারণ পথ। প্রজনন অঙ্গের তরলে ভাইরাস থাকে।")],
    [L2("Using the same toilet, tubewell or pond.", "একই টয়লেট, টিউবওয়েল বা পুকুর ব্যবহার করা।"), 0, L2("The virus soon becomes inactive outside the body and does not spread through water.", "দেহের বাইরে ভাইরাসটি অল্প সময়েই নিষ্ক্রিয় হয়ে যায়; পানির মাধ্যমে ছড়ায় না।")],
    [L2("Looking after a sick person with HIV at home.", "বাড়িতে HIV আক্রান্ত অসুস্থ মানুষের সেবা করা।"), 0, L2("Caring, feeding and comforting are safe. Only contact with blood needs care (cover cuts, use gloves).", "সেবা করা, খাওয়ানো, পাশে থাকা নিরাপদ। সতর্ক থাকতে হয় শুধু রক্তের সংস্পর্শে (কাটা জায়গা ঢেকে রাখো, গ্লাভস পরো)।")]];
  const lerp = (pts, t) => { for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const a = pts[i - 1], b = pts[i]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); } return pts[pts.length - 1][1]; };
  const CD = { no: [[0, 100], [0.3, 62], [1, 78], [9, 20], [10.5, 9], [12, 4]], art: [[0, 100], [0.3, 62], [1, 78], [2, 71], [4, 90], [12, 93]] };
  const VI = { no: [[0, 0], [0.3, 92], [1, 22], [8, 40], [10, 72], [12, 96]], art: [[0, 0], [0.3, 92], [1, 22], [2, 25], [2.8, 3], [12, 3]] };
  let view = "virus", sel = 0, qi = 0, score = 0, done = 0, ans = -1, mode = "no";
  el.innerHTML = tabs11("b11hv", [["virus", L2("The virus", "ভাইরাস")], ["spread", L2("Does it spread?", "ছড়ায়, না ছড়ায় না?")], ["def", L2("The defence", "প্রতিরক্ষা")]], view) + `<div id="b11hb" style="margin-top:8px"></div>`;
  const drawVirus = () => {
    const k = PARTS[sel][0], on = q => q === k, cx = 128, cy = 150, ENV = "#d9a441", SPK = "#4f8a5a";
    const g = (q, inner) => `<g data-k="${q}" style="cursor:pointer">${inner}</g>`;
    let s = `<svg viewBox="0 0 360 300" role="img" aria-label="${L2("Structure of HIV", "HIV ভাইরাসের গঠন")}">`, st41 = "", st120 = "";
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 - Math.PI / 3, c = Math.cos(a), d = Math.sin(a); st41 += `<line x1="${(cx + 84 * c).toFixed(1)}" y1="${(cy + 84 * d).toFixed(1)}" x2="${(cx + 100 * c).toFixed(1)}" y2="${(cy + 100 * d).toFixed(1)}" stroke="${on("gp41") ? "var(--bad)" : SPK}" stroke-width="${on("gp41") ? 6 : 4.5}" stroke-linecap="round"/>`; st120 += `<circle cx="${(cx + 107 * c).toFixed(1)}" cy="${(cy + 107 * d).toFixed(1)}" r="8" fill="${on("gp120") ? "var(--bad)" : "#7fbf8a"}" stroke="var(--ink)" stroke-width="1"/>`; }
    s += g("gp41", st41) + g("gp120", st120);
    s += g("env", `<circle cx="${cx}" cy="${cy}" r="80" fill="var(--paper)" stroke="${on("env") ? "var(--bad)" : ENV}" stroke-width="${on("env") ? 12 : 10}"/><circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="var(--sheet)" stroke-width="1.6" stroke-dasharray="2 5"/>`);
    s += g("cap", `<path d="M92 112 L166 122 Q184 150 166 178 L92 188 Q74 150 92 112 Z" fill="#e4d3f0" stroke="${on("cap") ? "var(--bad)" : "#7b5ab5"}" stroke-width="${on("cap") ? 4.5 : 2.5}" stroke-linejoin="round"/>`);
    s += g("rna", `<path d="M96 140 q7 -9 14 0 t14 0 t14 0 t14 0 t14 0" fill="none" stroke="${on("rna") ? "var(--bad)" : "#c2542d"}" stroke-width="${on("rna") ? 4.5 : 3}" stroke-linecap="round"/><path d="M96 160 q7 -9 14 0 t14 0 t14 0 t14 0 t14 0" fill="none" stroke="${on("rna") ? "var(--bad)" : "#c2542d"}" stroke-width="${on("rna") ? 4.5 : 3}" stroke-linecap="round"/>`);
    s += g("rt", `<circle cx="114" cy="172" r="${on("rt") ? 7.5 : 6}" fill="${on("rt") ? "var(--bad)" : VEIN11}" stroke="var(--ink)" stroke-width="1"/><circle cx="146" cy="126" r="${on("rt") ? 7.5 : 6}" fill="${on("rt") ? "var(--bad)" : VEIN11}" stroke="var(--ink)" stroke-width="1"/>`);
    s += LD11(248, 34, 189, 60) + LB11("gp120", on("gp120"), 250, 38, "GP 120") + LD11(248, 72, 212, 100) + LB11("gp41", on("gp41"), 250, 76, "GP 41");
    s += LD11(248, 116, 207, 134) + LB11("env", on("env"), 250, 114, L2(["Envelope", "(phospholipid)"], ["আবরণ", "(ফসফোলিপিড)"]));
    s += LD11(248, 168, 175, 158) + LB11("cap", on("cap"), 250, 172, L2("Capsid", "ক্যাপসিড")) + LD11(248, 206, 160, 160) + LB11("rna", on("rna"), 250, 210, "RNA");
    s += LD11(248, 246, 119, 175) + LB11("rt", on("rt"), 250, 246, L2(["Reverse", "transcriptase"], ["রিভার্স", "ট্রান্সক্রিপটেজ"]));
    $("#b11hs", el).innerHTML = s + `</svg>`;
    tap11($("#b11hs", el), q => { sel = PARTS.findIndex(p => p[0] === q); drawVirus(); });
    $("#b11ho", el).innerHTML = `<b>${PARTS[sel][1]}.</b> ${PARTS[sel][2]}`;
    $("#b11hn", el).textContent = B11(sel + 1) + " / " + B11(PARTS.length);
  };
  const drawQuiz = () => {
    const b = $("#b11hq", el);
    if (qi >= SIT.length) {
      b.innerHTML = `<div class="w-out"><b>${L2(`You got ${score} out of ${SIT.length} right.`, `${B11(SIT.length)}টির মধ্যে ${B11(score)}টি ঠিক হয়েছে।`)}</b> ${L2("Remember the rule: HIV spreads only when blood or certain body fluids of an infected person enter another body. Ordinary daily contact is safe.", "নিয়মটি মনে রেখো: আক্রান্ত ব্যক্তির রক্ত বা দেহের নির্দিষ্ট কিছু তরল অন্যের দেহে ঢুকলে তবেই HIV ছড়ায়। রোজকার সাধারণ মেলামেশা নিরাপদ।")}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b11hr">${L2("Try again", "আবার চেষ্টা করো")}</button></div>`;
      $("#b11hr", el).addEventListener("click", () => { qi = 0; score = 0; ans = -1; drawQuiz(); });
      return;
    }
    const [q, yes, why] = SIT[qi], shown = ans >= 0, right = ans === yes;
    b.innerHTML = `<div class="hint">${B11(qi + 1)} / ${B11(SIT.length)}</div><div style="border:1px solid var(--rule);border-radius:12px;padding:14px 16px;margin:6px 0;background:var(--paper);font-size:17px;min-height:3.2em">${q}</div><div class="w-row"><button class="btn" id="b11hy"${shown ? " disabled" : ""}>${L2("Can spread", "ছড়াতে পারে")}</button><button class="btn" id="b11hz"${shown ? " disabled" : ""}>${L2("Does not spread", "ছড়ায় না")}</button></div>` + (shown ? `<div class="w-out" style="margin-top:8px;background:${right ? "var(--good-soft)" : "var(--bad-soft)"}"><b style="color:${right ? "var(--good)" : "var(--bad)"}">${right ? L2("Correct.", "ঠিক বলেছ।") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${yes ? L2("<b>It can spread this way.</b>", "<b>এভাবে ছড়াতে পারে।</b>") : L2("<b>It does not spread this way.</b>", "<b>এভাবে ছড়ায় না।</b>")} ${why}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b11hx">${qi === SIT.length - 1 ? L2("See my score", "ফল দেখো") : L2("Next", "পরেরটি")} ▶</button></div>` : "");
    if (!shown) { $("#b11hy", el).addEventListener("click", () => { ans = 1; if (yes === 1) score++; drawQuiz(); }); $("#b11hz", el).addEventListener("click", () => { ans = 0; if (yes === 0) score++; drawQuiz(); }); }
    else { [$("#b11hy", el), $("#b11hz", el)].forEach(x => { x.style.opacity = .5; }); $("#b11hx", el).addEventListener("click", () => { qi++; ans = -1; drawQuiz(); }); }
  };
  const drawDef = () => {
    const t = sv(el, "b11ht", L2("years", "বছর"), 1), X = v => 44 + v / 12 * 302, Y = v => 204 - v / 100 * 150, cd = lerp(CD[mode], t), vi = lerp(VI[mode], t);
    const line = pts => { let d = ""; for (let v = 0; v <= 12.001; v += 0.1) d += (d ? " L" : "M") + X(v).toFixed(1) + " " + Y(lerp(pts, v)).toFixed(1); return d; };
    let s = `<svg viewBox="0 0 360 244" role="img" aria-label="${L2("Helper cells and virus over the years (schematic)", "বছরের সাথে সহায়ক কোষ ও ভাইরাস (ধারণাচিত্র)")}">`;
    s += `<line x1="52" y1="13" x2="74" y2="13" stroke="var(--c)" stroke-width="4"/>` + T11(78, 17, L2("helper (CD4) cells", "সহায়ক (CD4) কোষ"), "start", 12.5, "var(--c)", "700") + `<line x1="232" y1="13" x2="254" y2="13" stroke="var(--bad)" stroke-width="4"/>` + T11(258, 17, L2("virus", "ভাইরাস"), "start", 12.5, "var(--bad)", "700");
    s += `<rect x="52" y="25" width="22" height="11" fill="var(--bad-soft)" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 2"/>` + T11(78, 35, L2("too few helper cells: AIDS", "সহায়ক কোষ খুব কম: এইডস"), "start", 12.5, "var(--ink)");
    s += `<rect x="44" y="${Y(20)}" width="302" height="${204 - Y(20)}" fill="var(--bad-soft)" opacity=".8"/><line x1="44" y1="${Y(20)}" x2="346" y2="${Y(20)}" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="5 4"/>`;
    s += `<line x1="44" y1="48" x2="44" y2="204" stroke="var(--ink)" stroke-width="1.4"/><line x1="44" y1="204" x2="346" y2="204" stroke="var(--ink)" stroke-width="1.4"/>`;
    for (let v = 0; v <= 12; v += 2) s += `<line x1="${X(v)}" y1="204" x2="${X(v)}" y2="208" stroke="var(--ink)" stroke-width="1"/>` + T11(X(v), 221, B11(v), "middle", 12, "var(--muted)");
    s += T11(195, 238, L2("years after the virus enters", "ভাইরাস ঢোকার পর বছর"), "middle", 12.5, "var(--muted)") + T11(38, 60, L2("high", "বেশি"), "end", 12, "var(--muted)") + T11(38, 204, L2("low", "কম"), "end", 12, "var(--muted)");
    if (mode === "art") s += `<line x1="${X(2)}" y1="50" x2="${X(2)}" y2="204" stroke="var(--good)" stroke-width="1.6" stroke-dasharray="3 3"/>` + T11(X(2) + 5, 62, L2("medicine starts", "ওষুধ শুরু"), "start", 12.5, "var(--good)", "700", true);
    s += `<path d="${line(CD[mode])}" fill="none" stroke="var(--c)" stroke-width="3.2" stroke-linejoin="round"/><path d="${line(VI[mode])}" fill="none" stroke="var(--bad)" stroke-width="3.2" stroke-linejoin="round"/>`;
    s += `<line x1="${X(t)}" y1="48" x2="${X(t)}" y2="204" stroke="var(--ink)" stroke-width="1.2"/><circle cx="${X(t)}" cy="${Y(cd)}" r="5.5" fill="var(--c)" stroke="var(--sheet)" stroke-width="1.5"/><circle cx="${X(t)}" cy="${Y(vi)}" r="5.5" fill="var(--bad)" stroke="var(--sheet)" stroke-width="1.5"/>`;
    $("#b11hs", el).innerHTML = s + `</svg>`;
    $("#b11ho", el).innerHTML = t === 0 ? L2("The virus has just entered the body. The helper cells are at their normal number.", "ভাইরাস সবে দেহে ঢুকেছে। সহায়ক কোষের সংখ্যা স্বাভাবিক।")
      : t <= 1 ? L2("<b>The first weeks.</b> The virus multiplies very fast and many helper cells are lost. Some people get a mild fever like flu, which passes. Then the defence pushes the virus down for a time.", "<b>প্রথম কয়েক সপ্তাহ।</b> ভাইরাস খুব দ্রুত সংখ্যায় বাড়ে, অনেক সহায়ক কোষ নষ্ট হয়। কারও কারও ফ্লুর মতো মৃদু জ্বর হয়, যা সেরে যায়। এরপর প্রতিরোধ ব্যবস্থা কিছু সময়ের জন্য ভাইরাসকে দমিয়ে রাখে।")
      : mode === "art" && t >= 2 ? L2("<b>With daily medicine (ART).</b> The virus cannot multiply and falls very low. The helper cells recover, and the person can stay well for many years. The medicine must be taken every day; if it is stopped, the virus rises again.", "<b>প্রতিদিনের ওষুধে (ART)।</b> ভাইরাস সংখ্যায় বাড়তে পারে না, খুব কমে যায়। সহায়ক কোষ আবার বাড়ে, আর মানুষটি বহু বছর সুস্থ থাকতে পারেন। ওষুধ প্রতিদিন খেতে হয়; বন্ধ করলে ভাইরাস আবার বেড়ে যায়।")
      : cd > 20 ? L2("<b>The quiet years.</b> The person looks and feels well, but each year there are fewer helper cells. Only a blood test shows the infection, and the virus can be passed on.", "<b>সুপ্ত বছরগুলো।</b> মানুষটি দেখতে ও অনুভবে সুস্থ, কিন্তু প্রতিবছর সহায়ক কোষ কমছে। সংক্রমণ ধরা পড়ে শুধু রক্ত পরীক্ষায়, আর ভাইরাস অন্যের দেহে ছড়াতে পারে।")
      : L2("<b>AIDS.</b> Too few helper cells are left to direct the defence. Germs that a healthy body defeats easily now cause serious illness, while the virus rises steeply.", "<b>এইডস।</b> প্রতিরক্ষা পরিচালনার মতো সহায়ক কোষ আর নেই। যে জীবাণুকে সুস্থ দেহ সহজেই হারায়, তা-ই এখন গুরুতর অসুখ ঘটায়; ভাইরাসও দ্রুত বাড়ে।");
  };
  const setView = () => {
    const b = $("#b11hb", el);
    if (view === "virus") {
      b.innerHTML = `<div class="svgwrap fit" id="b11hs"></div><div class="w-row" style="margin:6px 0"><button class="btn solid" id="b11hx1">${L2("Next part", "পরের অংশ")} ▶</button><span class="hint" id="b11hn"></span></div><div class="w-out" id="b11ho"></div>`;
      $("#b11hx1", el).addEventListener("click", () => { sel = (sel + 1) % PARTS.length; drawVirus(); });
      drawVirus();
    } else if (view === "spread") {
      b.innerHTML = `<div id="b11hq"></div>`;
      drawQuiz();
    } else {
      b.innerHTML = `<div class="chipset b11hm" role="group"><button data-m="no" aria-pressed="${mode === "no"}">${L2("No treatment", "চিকিৎসা ছাড়া")}</button><button data-m="art" aria-pressed="${mode === "art"}">${L2("With treatment (ART)", "চিকিৎসাসহ (ART)")}</button></div>${slider("b11ht", L2("Time", "সময়"), 0, 12, 0.5, 5, "")}<div class="svgwrap fit" id="b11hs" style="margin-top:6px"></div><div class="w-out" id="b11ho"></div><div class="hint" style="margin-top:4px">${L2("A schematic picture of the general pattern, not the record of a real person. The timing differs from person to person.", "এটি সাধারণ ধারাটির ধারণাচিত্র, কোনো বাস্তব মানুষের তথ্য নয়। সময়কাল ব্যক্তিভেদে আলাদা হয়।")}</div>`;
      chips11(el, ".b11hm", q => { mode = q.dataset.m; drawDef(); });
      $("#b11ht", el).addEventListener("input", drawDef);
      drawDef();
    }
  };
  chips11(el, ".b11hv", b => { view = b.dataset.v; setView(); });
  setView();
};
