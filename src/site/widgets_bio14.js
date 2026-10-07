/* ---- biology chapter 14 widgets: biotechnology ---- */
const B14 = x => bnNum(x, LANG);
const DOT14 = () => L2(".", "।");
const chips14 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
/* text: sizes below 13.5 are raised to 13.5, so that it stays 12 px or more when the 360-wide drawing is shown about 320 px wide */
const T14 = (x, y, s, a = "middle", sz = 13.5, c = "var(--ink)", w = "", extra = "") => `<text x="${x}" y="${y}" font-size="${(Math.max(sz, 13.5) * (LANG === "bn" ? 1.1 : 1)).toFixed(1)}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${extra}>${s}</text>`;
const tabs14 = (cls, items, cur) => `<div class="chipset ${cls}" role="group">${items.map(([k, l]) => `<button data-v="${k}" aria-pressed="${k === cur}">${l}</button>`).join("")}</div>`;
const ok14 = (good, html) => `<span style="color:var(--${good ? "good" : "bad"});font-weight:700">${good ? "✓" : "✗"}</span> ${html}`;
const shuf14 = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* whole numbers with a thin gap: 59 049 in English, 9 76 562 (lakh grouping) in Bangla */
const num14 = v => { let s = String(Math.round(v)); if (s.length > 4) s = LANG === "bn" ? s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, " ") + " " + s.slice(-3) : s.replace(/\B(?=(\d{3})+(?!\d))/g, " "); return B14(s); };
const GRN14 = "#4f9d58", AGAR14 = "#e3c35a", ROOTM14 = "#e0a878", SOIL14 = "#8a6a45", GENE14 = "#e07b1f", PLAS14 = "#3b76b8", DON14 = "#8e6bbf", WAT14 = "#4a90c8", SUN14 = "#f2b632", BRINJ14 = "#7d4a9e";
const BASE14 = { A: "#3f9d5a", T: "#d8a520", G: "#c8473d", C: "#3b76b8" };
const ar14 = (x1, y1, x2, y2, id, c = "var(--muted)", w = 2.2, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;
/* step-through frame: Back / Next buttons, step counter, drawing and text */
const stepper14 = (body, id, n, draw) => {
  let k = 0;
  body.innerHTML = `<div class="svgwrap fit" id="${id}s"></div><div class="w-row" style="margin:6px 0"><button class="btn" id="${id}p" aria-label="${L2("Previous step", "আগের ধাপ")}">◀</button><button class="btn solid" id="${id}n">${L2("Next", "পরের ধাপ")} ▶</button><span class="hint" id="${id}c"></span></div><div class="w-out" id="${id}o"></div>`;
  const q = s => body.querySelector("#" + id + s);
  const show = () => { const [svg, txt] = draw(k); q("s").innerHTML = svg; q("o").innerHTML = txt; q("c").textContent = L2(`Step ${k + 1} of ${n}`, `ধাপ ${B14(k + 1)} / ${B14(n)}`); q("p").disabled = k === 0; q("p").style.opacity = k === 0 ? .45 : 1; };
  q("n").addEventListener("click", () => { k = (k + 1) % n; show(); });
  q("p").addEventListener("click", () => { if (k > 0) { k--; show(); } });
  show();
};
/* sorting game: items = [text, category key, reason]; cats = [key, label] */
const sort14 = (body, items, cats, o) => {
  let order = [], k = 0, right = 0, answered = false;
  const name = key => cats.find(c => c[0] === key)[1];
  const show = () => {
    if (k >= order.length) {
      body.innerHTML = `<div class="w-out"><b>${L2("Finished!", "শেষ!")}</b> ${L2(`You got ${right} out of ${order.length} right.`, `${B14(order.length)}টির মধ্যে ${B14(right)}টি ঠিক হয়েছে।`)}${o.end ? "<br>" + o.end : ""}</div><div class="w-row" style="margin-top:10px"><button class="btn solid" data-re="1">${L2("Play again", "আবার খেলো")}</button></div>`;
      body.querySelector("[data-re]").addEventListener("click", start); return;
    }
    const t = order[k]; answered = false;
    body.innerHTML = `<p class="hint" style="margin:0 0 6px">${B14(k + 1)} / ${B14(order.length)} · ${L2(`${right} right so far`, `এ পর্যন্ত ${B14(right)}টি ঠিক`)}</p>
      <div class="w-out" style="font-size:17px">${t[0]}</div>
      <div class="w-row" style="margin:10px 0">${cats.map(c => `<button class="btn" data-a="${c[0]}">${c[1]}</button>`).join("")}</div>
      <div data-f="1" class="hint">${o.q}</div>`;
    body.querySelectorAll("button[data-a]").forEach(b => b.addEventListener("click", () => {
      if (answered) return; answered = true;
      const good = b.dataset.a === t[1]; if (good) right++;
      body.querySelectorAll("button[data-a]").forEach(x => { x.disabled = true; if (x.dataset.a === t[1]) x.classList.add("solid"); });
      body.querySelector("[data-f]").innerHTML = `<div class="w-out">${ok14(good, `<b>${name(t[1])}${DOT14()}</b> ${t[2]}`)}</div><div class="w-row" style="margin-top:10px"><button class="btn solid" data-nx="1">${k + 1 < order.length ? L2("Next", "পরেরটি") : L2("See result", "ফলাফল দেখো")} →</button></div>`;
      body.querySelector("[data-nx]").addEventListener("click", () => { k++; show(); });
    }));
  };
  const start = () => { order = shuf14(items); k = 0; right = 0; show(); };
  start();
};
/* ---- small drawings ---- */
const sprout14 = (x, y, h, col = GRN14, w = 2.4, f = 1) => { let g = `<path d="M${x} ${y} V${y - h}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`; for (let k = 7 * f; k <= h; k += 9 * f) g += `<path d="M${x} ${y - k} q${-7 * f} ${-6 * f} ${-11 * f} ${-f} q${5 * f} ${5 * f} ${11 * f} ${f} M${x} ${y - k - 3 * f} q${7 * f} ${-6 * f} ${11 * f} ${-f} q${-5 * f} ${5 * f} ${-11 * f} ${f}" fill="${col}"/>`; return g; };
const roots14 = (x, y, n = 3, len = 12) => { let g = ""; for (let i = 0; i < n; i++) { const d = (i - (n - 1) / 2) * 5; g += `<path d="M${x + d * .4} ${y} q${d * .9} ${len * .5} ${d * 1.5} ${len}" stroke="${SOIL14}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`; } return g; };
/* conical flask: x = centre, y = base; half-width w, height h, medium depth m */
const flask14 = (x, y, w = 30, h = 70, m = 14, plug = true, med = AGAR14) => {
  const nk = Math.max(7, w * .26), sh = h - h * .3, hw = t => w - (w - nk) * t / sh;
  let g = m ? `<path d="M${x - hw(m)} ${y - m} L${x - w} ${y} H${x + w} L${x + hw(m)} ${y - m} z" fill="${med}" opacity=".9"/>` : "";
  g += `<path d="M${x - nk} ${y - h} V${y - sh} L${x - w} ${y} H${x + w} L${x + nk} ${y - sh} V${y - h}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linejoin="round"/>`;
  if (plug) g += `<rect x="${x - nk - 2}" y="${y - h - 6}" width="${2 * nk + 4}" height="11" rx="5" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.5"/>`;
  return g;
};
const callus14 = (x, y, s = 1) => [[-7, 0, 7], [5, -1, 8], [-1, -7, 7], [9, -7, 5], [-9, -6, 5]].map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}" fill="#dcdc8c" stroke="#99994a" stroke-width="1"/>`).join("");
const explant14 = (x, y, s = 1) => `<path d="M${x - 7 * s} ${y} h${14 * s} v${-4 * s} q${-2 * s} ${-9 * s} ${-7 * s} ${-12 * s} q${-5 * s} ${3 * s} ${-7 * s} ${12 * s} z" fill="${GRN14}" stroke="#2f6e38" stroke-width="1"/>`;
const pot14 = (x, y) => `<path d="M${x - 13} ${y - 17} H${x + 13} L${x + 9} ${y} H${x - 9} z" fill="${SOIL14}" stroke="var(--ink)" stroke-width="1"/>`;
const sun14 = (x, y, r) => { let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${SUN14}"/>`; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += `<line x1="${(x + Math.cos(a) * (r + 3)).toFixed(1)}" y1="${(y + Math.sin(a) * (r + 3)).toFixed(1)}" x2="${(x + Math.cos(a) * (r + 9)).toFixed(1)}" y2="${(y + Math.sin(a) * (r + 9)).toFixed(1)}" stroke="${SUN14}" stroke-width="2.2" stroke-linecap="round"/>`; } return s; };
/* double-stranded DNA drawn as two rails with rungs; stagL / stagR shift the ends of the lower rail to show sticky ends */
const dna14 = (x1, x2, y, col, stagL = 0, stagR = 0, sw = 3, hh = 5) => { let g = `<path d="M${x1} ${y - hh} H${x2} M${x1 + stagL} ${y + hh} H${x2 + stagR}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`; for (let x = x1 + Math.max(stagL, 0) + 4; x < x2 + Math.min(stagR, 0) - 2; x += 8) g += `<line x1="${x}" y1="${y - hh + 1}" x2="${x}" y2="${y + hh - 1}" stroke="${col}" stroke-width="1.3" opacity=".75"/>`; return g; };
/* arc of a ring from angle a1 to a2 (degrees, clockwise from the top) */
const arc14 = (cx, cy, r, a1, a2, col, sw = 6) => { const p = a => [(cx + r * Math.sin(a * Math.PI / 180)).toFixed(1), (cy - r * Math.cos(a * Math.PI / 180)).toFixed(1)]; const [x1, y1] = p(a1), [x2, y2] = p(a2); return `<path d="M${x1} ${y1} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${sw}"/>`; };
/* plasmid: kind 0 = whole ring, 1 = opened at the top, 2 = recombinant (gene in the gap) */
const plasmid14 = (cx, cy, r, kind = 0, sw = 6, g = 26) => kind === 0 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PLAS14}" stroke-width="${sw}"/>` : arc14(cx, cy, r, g, 360 - g, PLAS14, sw) + (kind === 2 ? arc14(cx, cy, r, -g, g, GENE14, sw) : "");
const scis14 = (x, y) => `<g stroke="var(--bad)" stroke-width="2" fill="none" stroke-linecap="round"><circle cx="${x - 5}" cy="${y - 9}" r="3.6"/><circle cx="${x + 5}" cy="${y - 9}" r="3.6"/><path d="M${x - 3} ${y - 6} L${x + 5} ${y + 8} M${x + 3} ${y - 6} L${x - 5} ${y + 8}"/></g>`;
/* bacterium: capsule with a squiggly chromosome and (optionally) a small plasmid; rec = plasmid carries the gene */
const bact14 = (x, y, w, h, pl = 1, rec = false) => {
  let g = `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
  const cx = x - w * .14, a = h * .2;
  g += `<path d="M${cx - w * .2} ${y} q${w * .05} ${-a} ${w * .1} 0 t${w * .1} 0 t${w * .1} 0 t${w * .1} 0" fill="none" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round"/>`;
  if (pl) g += plasmid14(x + w * .3, y, h * .22, rec ? 2 : 0, Math.max(2.4, h * .09), 40);
  return g;
};

/* 14.1 timeline, old or modern, who does the work */
W.b14bio = (el) => {
  let view = "time", cur = 0;
  el.innerHTML = tabs14("b14bv", [["time", L2("Timeline", "সময়রেখা")], ["old", L2("Old or modern?", "প্রাচীন না আধুনিক?")], ["who", L2("Who does the work?", "কাজটা কে করে?")]], view) + `<div id="b14bb" style="margin-top:8px"></div>`;
  const body = $("#b14bb", el);
  const TL = [
    [L2("about 8000 years ago", "প্রায় ৮০০০ বছর আগে"), L2("Fermentation and brewing", "গাঁজন ও চোলাই"), L2("People learn to make bread, curd, cheese, vinegar and alcoholic drinks. Microbes do the work, though nobody knows they exist. This is traditional biotechnology.", "মানুষ রুটি, দই, পনির, ভিনেগার ও অ্যালকোহলজাতীয় পানীয় বানাতে শেখে। কাজটা করে অণুজীব, যদিও তাদের অস্তিত্বের কথা তখন কেউ জানে না। এটাই প্রাচীন জীবপ্রযুক্তি।")],
    ["1866", L2("Mendel's laws of heredity", "মেন্ডেলের বংশগতির সূত্র"), L2("Gregor Mendel publishes the results of his pea experiments, and genetics begins. (Your book prints 1863, the year he finished the experiments.)", "গ্রেগর মেন্ডেল মটরশুঁটির পরীক্ষার ফল প্রকাশ করেন, শুরু হয় জেনেটিক্স। (তোমার বইয়ে ১৮৬৩ ছাপা আছে; ওই বছর তিনি পরীক্ষা শেষ করেন।)")],
    ["1919", L2("The word is born", "শব্দটির জন্ম"), L2("The Hungarian engineer Karl Ereky uses the word \"biotechnology\" for the first time.", "হাঙ্গেরীয় প্রকৌশলী কার্ল এরেকি প্রথম \"বায়োটেকনোলজি\" শব্দটি ব্যবহার করেন।")],
    ["1953", L2("The DNA double helix", "DNA ডাবল হেলিক্স"), L2("Watson and Crick describe the structure of DNA. Now a gene can be understood as a stretch of DNA. Modern biotechnology grows from here.", "ওয়াটসন ও ক্রিক DNA-এর গঠন বর্ণনা করেন। এখন জিনকে DNA-এর একটি অংশ হিসেবে বোঝা গেল। আধুনিক জীবপ্রযুক্তির যাত্রা এখান থেকেই।")],
    ["1973", L2("First recombinant DNA", "প্রথম রিকম্বিনেন্ট DNA"), L2("Scientists cut DNA from two sources, join the pieces in a plasmid and put it into a bacterium, which then copies it. Genetic engineering has begun.", "বিজ্ঞানীরা দুটি উৎসের DNA কেটে প্লাজমিডে জুড়ে দেন এবং তা ব্যাকটেরিয়ার ভেতরে ঢোকান; ব্যাকটেরিয়া তার নকল তৈরি করে। শুরু হলো জেনেটিক ইঞ্জিনিয়ারিং।")],
    ["1982", L2("Insulin from bacteria", "ব্যাকটেরিয়া থেকে ইনসুলিন"), L2("Human insulin made by genetically modified bacteria is approved as a medicine for diabetic patients, the first medicine made by genetic engineering.", "জেনেটিকভাবে পরিবর্তিত ব্যাকটেরিয়ার তৈরি মানুষের ইনসুলিন ডায়াবেটিস রোগীর ওষুধ হিসেবে অনুমোদন পায়; জেনেটিক ইঞ্জিনিয়ারিংয়ে তৈরি প্রথম ওষুধ এটিই।")],
    ["2010", L2("The jute genome is read", "পাটের জিনোম উন্মোচন"), L2("A team of Bangladeshi scientists led by Dr Maqsudul Alam reads the complete genome of tossa jute.", "ড. মাকসুদুল আলমের নেতৃত্বে বাংলাদেশি বিজ্ঞানীদের একটি দল তোষা পাটের সম্পূর্ণ জিনোমের তথ্য উন্মোচন করেন।")],
    ["2013", L2("Bt brinjal in Bangladesh", "বাংলাদেশে বিটি বেগুন"), L2("Bangladesh approves Bt brinjal, which carries a gene from the bacterium <i>Bacillus thuringiensis</i> and resists the shoot and fruit borer.", "বাংলাদেশ বিটি বেগুনের অনুমোদন দেয়; এতে <i>Bacillus thuringiensis</i> ব্যাকটেরিয়ার একটি জিন আছে, তাই এটি ডগা ও ফল ছিদ্রকারী পোকা প্রতিরোধ করে।")]];
  const icon = i => {
    const x = 180, y = 136;
    if (i === 0) return `<path d="M${x - 32} ${y - 26} q-16 34 8 56 h48 q24 -22 8 -56 z" fill="#c98b5a" stroke="var(--ink)" stroke-width="1.5"/><ellipse cx="${x}" cy="${y - 26}" rx="34" ry="7" fill="#f3ead8" stroke="var(--ink)" stroke-width="1.5"/>` + [[-14, -42, 4], [2, -50, 5], [15, -41, 3.5]].map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`).join("") + `<ellipse cx="${x + 78}" cy="${y + 14}" rx="30" ry="15" fill="#e0b070" stroke="var(--ink)" stroke-width="1.5"/><path d="M${x + 60} ${y + 8} l6 8 M${x + 74} ${y + 5} l6 9 M${x + 88} ${y + 7} l6 8" stroke="#9c6c30" stroke-width="2" stroke-linecap="round"/>`;
    if (i === 1) return `<path d="M${x - 60} ${y + 30} H${x + 60}" stroke="${SOIL14}" stroke-width="3" stroke-linecap="round"/>` + sprout14(x - 30, y + 30, 62, GRN14, 3) + sprout14(x + 32, y + 30, 26, GRN14, 3) + `<path d="M${x - 30} ${y - 8} q14 4 18 18 q-12 -2 -18 -18" fill="#8fc46a" stroke="#2f6e38" stroke-width="1"/><path d="M${x + 32} ${y + 12} q12 3 15 14 q-10 -1 -15 -14" fill="#8fc46a" stroke="#2f6e38" stroke-width="1"/>` + T14(x - 30, y - 42, "TT", "middle", 14, "var(--muted)", "700") + T14(x + 32, y - 6, "tt", "middle", 14, "var(--muted)", "700");
    if (i === 2) return `<rect x="${x - 92}" y="${y - 30}" width="184" height="52" rx="12" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><path d="M${x - 20} ${y + 22} l-10 16 l26 -16 z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><path d="M${x - 19} ${y + 21} h14" stroke="var(--c-soft)" stroke-width="3"/>` + T14(x, y + 4, "Biotechnology", "middle", 21, "var(--ink)", "700", ` font-style="italic"`);
    if (i === 3) { let g = ""; const X = t => x - 84 + t * 168, Y = (t, s) => y + s * 22 * Math.sin(t * Math.PI * 3); let p1 = "", p2 = ""; for (let k = 0; k <= 48; k++) { const t = k / 48; p1 += (k ? "L" : "M") + X(t).toFixed(1) + " " + Y(t, 1).toFixed(1); p2 += (k ? "L" : "M") + X(t).toFixed(1) + " " + Y(t, -1).toFixed(1); } for (let k = 1; k < 24; k++) { const t = k / 24; if (Math.abs(Math.sin(t * Math.PI * 3)) > .25) g += `<line x1="${X(t).toFixed(1)}" y1="${Y(t, 1).toFixed(1)}" x2="${X(t).toFixed(1)}" y2="${Y(t, -1).toFixed(1)}" stroke="${Object.values(BASE14)[k % 4]}" stroke-width="2.6"/>`; } return g + `<path d="${p1}" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><path d="${p2}" fill="none" stroke="var(--c)" stroke-width="3" stroke-linecap="round"/>`; }
    if (i === 4) return plasmid14(x, y, 34, 2, 8, 30) + scis14(x - 70, y - 4) + T14(x, y + 5, L2("gene", "জিন"), "middle", 14, GENE14, "700") + bact14(x + 92, y, 62, 30, 1, true);
    if (i === 5) return `<rect x="${x - 22}" y="${y - 22}" width="44" height="58" rx="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/><rect x="${x - 22}" y="${y + 6}" width="44" height="30" rx="6" fill="${WAT14}" opacity=".35"/><rect x="${x - 13}" y="${y - 36}" width="26" height="14" rx="3" fill="var(--muted)"/><rect x="${x - 22}" y="${y - 10}" width="44" height="16" fill="var(--c-soft)" stroke="var(--c)" stroke-width="1"/>` + T14(x + 34, y + 2, L2("insulin", "ইনসুলিন"), "start", 15, "var(--ink)", "700") + bact14(x - 84, y + 6, 70, 32, 1, true);
    if (i === 6) { let g = `<path d="M${x - 80} ${y + 36} H${x + 10}" stroke="${SOIL14}" stroke-width="3" stroke-linecap="round"/>`; [-62, -36, -10].forEach((d, n) => { const h = 82 - n * 6; g += `<path d="M${x + d} ${y + 36} V${y + 36 - h}" stroke="${GRN14}" stroke-width="3.4" stroke-linecap="round"/>`; for (let k = 34; k <= h; k += 12) g += `<path d="M${x + d} ${y + 36 - k} q-12 -10 -17 -2 q8 6 17 2 M${x + d} ${y + 30 - k} q12 -10 17 -2 q-8 6 -17 2" fill="${GRN14}"/>`; }); "ATGCCGTA".split("").forEach((b, k) => { g += `<rect x="${x + 22 + (k % 4) * 21}" y="${y - 22 + Math.floor(k / 4) * 24}" width="18" height="20" rx="4" fill="${BASE14[b]}" fill-opacity=".3" stroke="${BASE14[b]}" stroke-width="1.6"/>` + T14(x + 31 + (k % 4) * 21, y - 7 + Math.floor(k / 4) * 24, b, "middle", 14, "var(--ink)", "700"); }); return g; }
    return `<path d="M${x - 18} ${y - 26} q-34 22 -22 52 q12 22 36 12 q26 -12 24 -46 q-2 -18 -18 -24 z" fill="${BRINJ14}" stroke="var(--ink)" stroke-width="1.5"/><path d="M${x - 22} ${y - 22} q10 -12 26 -6 q6 8 -2 14 q-8 -8 -14 -2 q-8 -2 -10 -6 z M${x + 2} ${y - 30} q4 -10 12 -14" fill="${GRN14}" stroke="#2f6e38" stroke-width="1.5" stroke-linecap="round"/><path d="M${x - 26} ${y + 4} q-4 16 8 26" fill="none" stroke="var(--paper)" stroke-width="3" stroke-linecap="round" opacity=".5"/>` + T14(x + 46, y + 8, "Bt", "start", 22, "var(--c)", "700");
  };
  const drawTime = () => {
    const X = i => 30 + i * 43;
    let s = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("Timeline of biotechnology", "জীবপ্রযুক্তির সময়রেখা")}"><line x1="14" y1="34" x2="346" y2="34" stroke="var(--rule)" stroke-width="4" stroke-linecap="round"/><line x1="14" y1="34" x2="${X(cur)}" y2="34" stroke="var(--c)" stroke-width="4" stroke-linecap="round"/>`;
    TL.forEach((t, i) => {
      s += `<g data-i="${i}" style="cursor:pointer"><circle cx="${X(i)}" cy="34" r="19" fill="transparent"/><circle cx="${X(i)}" cy="34" r="${i === cur ? 10 : 7}" fill="${i <= cur ? "var(--c)" : "var(--paper)"}" stroke="var(--c)" stroke-width="2.5"/>` + (i ? T14(X(i), 62, B14(t[0]), "middle", 13.5, i === cur ? "var(--ink)" : "var(--muted)", i === cur ? "700" : "") : T14(10, 16, t[0], "start", 13.5, i === cur ? "var(--ink)" : "var(--muted)", i === cur ? "700" : "")) + `</g>`;
    });
    $("#b14bs", el).innerHTML = s + icon(cur) + `</svg>`;
    el.querySelectorAll("#b14bs g[data-i]").forEach(g => g.addEventListener("click", () => { cur = +g.dataset.i; drawTime(); }));
    const t = TL[cur];
    $("#b14bo", el).innerHTML = `<b>${cur ? B14(t[0]) : t[0]}: ${t[1]}${DOT14()}</b> ${t[2]}`;
    $("#b14bc", el).textContent = `${B14(cur + 1)} / ${B14(TL.length)}`;
  };
  const OLD = [
    [L2("Setting doi by stirring a spoonful of old doi into warm milk", "কুসুম গরম দুধে এক চামচ পুরোনো দই মিশিয়ে দই পাতা"), "old", L2("Bacteria are used just as they are. People have done this for thousands of years.", "ব্যাকটেরিয়াকে যেমন আছে তেমনই ব্যবহার করা হয়। মানুষ হাজার বছর ধরে এটি করছে।")],
    [L2("Raising bread dough with yeast", "ইস্ট দিয়ে পাউরুটির তাল ফোলানো"), "old", L2("Fermentation by yeast is one of the oldest uses of a microbe.", "ইস্টের গাঁজন অণুজীব ব্যবহারের সবচেয়ে পুরোনো উদাহরণগুলোর একটি।")],
    [L2("Making vinegar from a sweet juice", "মিষ্টি রস থেকে ভিনেগার তৈরি"), "old", L2("Yeast and then <i>Acetobacter</i> bacteria do the work, in their natural form.", "প্রথমে ইস্ট ও পরে <i>Acetobacter</i> ব্যাকটেরিয়া তাদের স্বাভাবিক অবস্থায় কাজটি করে।")],
    [L2("Keeping the seeds of the best plants for next year's crop", "পরের বছরের জন্য সবচেয়ে ভালো গাছের বীজ রেখে দেওয়া"), "old", L2("This is selective breeding. No cell or DNA is handled.", "এটি বাছাই করে প্রজনন। এখানে কোষ বা DNA নিয়ে কোনো কাজ হয় না।")],
    [L2("Raising thousands of banana plantlets in flasks from one shoot tip", "একটি শীর্ষমুকুল থেকে ফ্লাস্কে হাজার হাজার কলার চারা তৈরি"), "new", L2("This is tissue culture: separated tissue is grown in a sterile medium.", "এটি টিস্যু কালচার: আলাদা করা টিস্যুকে জীবাণুমুক্ত মাধ্যমে বাড়ানো হয়।")],
    [L2("Getting human insulin from bacteria", "ব্যাকটেরিয়া থেকে মানুষের ইনসুলিন পাওয়া"), "new", L2("A human gene has been put into the bacteria: genetic engineering.", "ব্যাকটেরিয়ার মধ্যে মানুষের জিন ঢোকানো হয়েছে: জেনেটিক ইঞ্জিনিয়ারিং।")],
    [L2("Developing Bt brinjal that resists the fruit borer", "ফল ছিদ্রকারী পোকা প্রতিরোধী বিটি বেগুন উদ্ভাবন"), "new", L2("A gene of a bacterium has been transferred to the plant: genetic engineering.", "একটি ব্যাকটেরিয়ার জিন গাছে স্থানান্তর করা হয়েছে: জেনেটিক ইঞ্জিনিয়ারিং।")],
    [L2("Making the hepatitis B vaccine in modified yeast", "পরিবর্তিত ইস্ট থেকে হেপাটাইটিস বি-এর টিকা তৈরি"), "new", L2("The yeast carries a gene it never had before. That is work at the level of DNA.", "ইস্টটি এমন একটি জিন বহন করে যা তার আগে ছিল না। এটি DNA-এর স্তরের কাজ।")],
    [L2("Identifying a person by a DNA test", "DNA টেস্ট করে কোনো ব্যক্তিকে শনাক্ত করা"), "new", L2("DNA itself is taken out of cells and compared.", "কোষ থেকে DNA বের করে তা মিলিয়ে দেখা হয়।")],
    [L2("Making cheese from milk", "দুধ থেকে পনির তৈরি"), "old", L2("Microbes and enzymes have been used for cheese since ancient times.", "পনির তৈরিতে প্রাচীনকাল থেকেই অণুজীব ও এনজাইম ব্যবহৃত হচ্ছে।")]];
  const WHO = [
    [L2("Bread dough swells up", "পাউরুটির তাল ফুলে ওঠে"), "y", L2("Yeast ferments sugar and gives off carbon dioxide.", "ইস্ট গাঁজন প্রক্রিয়ায় চিনি ভেঙে কার্বন ডাইঅক্সাইড ছাড়ে।")],
    [L2("Milk sets into doi", "দুধ জমে দই হয়"), "b", L2("Lactic acid bacteria turn milk sugar into lactic acid.", "ল্যাকটিক অ্যাসিড ব্যাকটেরিয়া দুধের চিনিকে ল্যাকটিক অ্যাসিডে বদলায়।")],
    [L2("Alcohol turns into vinegar", "অ্যালকোহল ভিনেগারে পরিণত হয়"), "b", L2("<i>Acetobacter</i> bacteria turn alcohol into acetic acid.", "<i>Acetobacter</i> ব্যাকটেরিয়া অ্যালকোহলকে অ্যাসিটিক অ্যাসিডে বদলায়।")],
    [L2("The antibiotic penicillin", "অ্যান্টিবায়োটিক পেনিসিলিন"), "m", L2("Penicillin comes from the mould <i>Penicillium</i>.", "পেনিসিলিন আসে <i>Penicillium</i> নামের ছত্রাক (মোল্ড) থেকে।")],
    [L2("Sugary juice turns into alcohol", "চিনিযুক্ত রস অ্যালকোহলে পরিণত হয়"), "y", L2("Yeast ferments the sugar into alcohol and carbon dioxide.", "ইস্ট গাঁজন প্রক্রিয়ায় চিনিকে অ্যালকোহল ও কার্বন ডাইঅক্সাইডে পরিণত করে।")],
    [L2("Nitrogen is fixed in the root nodules of lentil", "মসুরের মূলের গুটিতে নাইট্রোজেন সংবন্ধন"), "b", L2("<i>Rhizobium</i> bacteria; they are also used as a biofertiliser.", "<i>Rhizobium</i> ব্যাকটেরিয়া; এদের জীবাণু সার হিসেবেও ব্যবহার করা হয়।")],
    [L2("The modern hepatitis B vaccine", "হেপাটাইটিস বি-এর আধুনিক টিকা"), "y", L2("It is produced in genetically modified yeast.", "এটি তৈরি হয় জেনেটিকভাবে পরিবর্তিত ইস্ট থেকে।")],
    [L2("Spilled oil is broken down", "ছড়িয়ে পড়া তেল ভেঙে ফেলা"), "b", L2("Specially developed <i>Pseudomonas</i> bacteria break down oil and hydrocarbons.", "বিশেষভাবে তৈরি <i>Pseudomonas</i> ব্যাকটেরিয়া তেল ও হাইড্রোকার্বন ভাঙে।")]];
  const setView = () => {
    if (view === "time") {
      body.innerHTML = `<div class="svgwrap fit" id="b14bs"></div><div class="w-row" style="margin:6px 0"><button class="btn" id="b14bp" aria-label="${L2("Previous", "আগেরটি")}">◀</button><button class="btn solid" id="b14bn">${L2("Next", "পরেরটি")} ▶</button><span class="hint" id="b14bc"></span><span class="hint">${L2("The line is not drawn to scale.", "রেখাটি স্কেল অনুযায়ী আঁকা নয়।")}</span></div><div class="w-out" id="b14bo"></div>`;
      $("#b14bn", el).addEventListener("click", () => { cur = (cur + 1) % TL.length; drawTime(); });
      $("#b14bp", el).addEventListener("click", () => { cur = (cur + TL.length - 1) % TL.length; drawTime(); });
      drawTime();
    } else if (view === "old") sort14(body, OLD, [["old", L2("Traditional", "প্রাচীন")], ["new", L2("Modern", "আধুনিক")]], { q: L2("Does it use whole organisms as they are (traditional), or does it work with separated cells or DNA (modern)?", "এতে কি পুরো জীবকে যেমন আছে তেমন ব্যবহার করা হয় (প্রাচীন), নাকি আলাদা কোষ বা DNA নিয়ে কাজ হয় (আধুনিক)?"), end: L2("Traditional biotechnology uses whole organisms. Modern biotechnology works with cells and DNA.", "প্রাচীন জীবপ্রযুক্তি পুরো জীবকে ব্যবহার করে। আধুনিক জীবপ্রযুক্তি কাজ করে কোষ ও DNA নিয়ে।") });
    else sort14(body, WHO, [["y", L2("Yeast", "ইস্ট")], ["b", L2("Bacteria", "ব্যাকটেরিয়া")], ["m", L2("Mould", "মোল্ড (ছত্রাক)")]], { q: L2("Which living worker is behind it? (Yeast is a one-celled fungus; a mould is a thread-like fungus.)", "এর পেছনের জীবন্ত কর্মী কে? (ইস্ট এককোষী ছত্রাক; মোল্ড সুতার মতো ছত্রাক।)"), end: L2("Every product of biotechnology has a living worker behind it.", "জীবপ্রযুক্তির প্রতিটি দ্রব্যের পেছনে একজন জীবন্ত কর্মী থাকে।") });
  };
  chips14(el, ".b14bv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 14.2 tissue culture: step-through, ordering game, hormone balance, multiplication */
W.b14culture = (el) => {
  let view = "steps";
  el.innerHTML = tabs14("b14cv", [["steps", L2("Step by step", "ধাপে ধাপে")], ["order", L2("Put in order", "ক্রমে সাজাও")], ["horm", L2("Shoot or root?", "বিটপ না মূল?")], ["count", L2("How many?", "কতগুলো?")]], view) + `<div id="b14cb" style="margin-top:8px"></div>`;
  const body = $("#b14cb", el);
  const A = arrowDefs("b14ca", "var(--muted)");
  const STEP = [
    [L2("(a) Choosing the mother plant", "(a) মাতৃ উদ্ভিদ নির্বাচন"), L2("A healthy, disease-free plant of good quality is chosen. A small part of it, here a side bud, is cut off. This piece is the <b>explant</b>.", "উন্নত গুণের, স্বাস্থ্যবান ও রোগমুক্ত একটি উদ্ভিদ বেছে নেওয়া হয়। এর ছোট একটি অংশ, এখানে একটি পার্শ্বমুকুল, কেটে নেওয়া হয়। এই অংশটিই <b>এক্সপ্ল্যান্ট</b>।")],
    [L2("(b) Preparing the culture medium", "(b) কালচার মাধ্যম তৈরি"), L2("Mineral nutrients, vitamins, phytohormones and sucrose are mixed in the right amounts. Agar is added so that the medium sets like jelly (semi-solid).", "খনিজ পুষ্টি, ভিটামিন, ফাইটোহরমোন ও সুক্রোজ সঠিক মাত্রায় মেশানো হয়। মাধ্যমকে জেলির মতো জমাতে (প্রায় কঠিন করতে) অ্যাগার দেওয়া হয়।")],
    [L2("(c) Setting up a germ-free culture", "(c) জীবাণুমুক্ত কালচার প্রতিষ্ঠা"), L2("The medium, in glass vessels closed with cotton wool, is sterilised in an <b>autoclave</b>: 121 °C, 15 lb/sq. inch, 20 minutes. When it has cooled and set, the explant is placed on it and the vessel is kept at 25 ± 2 °C in controlled light.", "তুলা দিয়ে মুখ বন্ধ করা কাচের পাত্রে রাখা মাধ্যমকে <b>অটোক্লেভে</b> জীবাণুমুক্ত করা হয়: ১২১ °C, 15 lb/sq. inch চাপ, ২০ মিনিট। ঠান্ডা হয়ে জমে গেলে তার ওপর এক্সপ্ল্যান্ট স্থাপন করা হয়, আর পাত্রটি ২৫ ± ২ °C তাপমাত্রায় নিয়ন্ত্রিত আলোতে রাখা হয়।")],
    [L2("(c, continued) Callus and plantlets", "(c-এর পরের অংশ) ক্যালাস ও অণুচারা"), L2("The cells of the explant divide again and again. They give plantlets directly, or first a <b>callus</b> (a shapeless mass of cells), from which many <b>plantlets</b> arise later.", "এক্সপ্ল্যান্টের কোষ বারবার বিভাজিত হয়। তা থেকে সরাসরি অণুচারা হয়, অথবা আগে <b>ক্যালাস</b> (অবয়বহীন টিস্যুমণ্ড) তৈরি হয়, যা থেকে পরে অনেক <b>অণুচারা</b> উৎপন্ন হয়।")],
    [L2("(d) Moving to a root-forming medium", "(d) মূল উৎপাদক মাধ্যমে স্থানান্তর"), L2("If the plantlets have no roots, the shoots are cut off when they reach a certain height and placed in a root-inducing medium.", "চারায় মূল না থাকলে বিটপগুলো নির্দিষ্ট উচ্চতায় পৌঁছানোর পর কেটে নিয়ে মূল উৎপাদনকারী মাধ্যমে স্থাপন করা হয়।")],
    [L2("(e) Moving to the natural environment", "(e) প্রাকৃতিক পরিবেশে স্থানান্তর"), L2("The rooted plantlets are washed free of agar and planted in small pots of soil. They are kept outside from time to time to get used to the open air, and at last they are planted in the field.", "মূলযুক্ত চারাগুলো পানিতে ধুয়ে অ্যাগারমুক্ত করে মাটিভরা ছোট পাত্রে লাগানো হয়। মাঝে মাঝে বাইরে রেখে খোলা পরিবেশের সাথে খাপ খাওয়ানো হয়, আর শেষে মাঠে লাগানো হয়।")]];
  const drawStep = k => {
    let s = `<svg viewBox="0 0 360 206" role="img" aria-label="${STEP[k][0]}">${A}`;
    if (k === 0) {
      s += `<path d="M20 172 H190" stroke="${SOIL14}" stroke-width="4" stroke-linecap="round"/><path d="M96 172 V48" stroke="${GRN14}" stroke-width="5" stroke-linecap="round"/>`;
      [146, 112, 78].forEach((y, i) => { const d = i % 2 ? 1 : -1; s += `<path d="M96 ${y} q${-30 * d} -22 ${-52 * d} -6 q${24 * d} 20 ${52 * d} 6" fill="${GRN14}" stroke="#2f6e38" stroke-width="1"/><path d="M96 ${y - 16} q${30 * d} -22 ${52 * d} -6 q${-24 * d} 20 ${-52 * d} 6" fill="#6bb36f" stroke="#2f6e38" stroke-width="1"/>`; });
      s += `<circle cx="96" cy="44" r="6" fill="#8fc46a" stroke="#2f6e38" stroke-width="1"/><circle cx="103" cy="104" r="5" fill="#8fc46a" stroke="#2f6e38" stroke-width="1"/><circle cx="103" cy="104" r="11" fill="none" stroke="var(--c)" stroke-width="2" stroke-dasharray="4 3"/>`;
      s += ar14(116, 102, 226, 96, "b14ca") + `<circle cx="274" cy="96" r="40" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2" stroke-dasharray="5 4"/>` + explant14(274, 112, 2.2);
      s += T14(96, 194, L2("mother plant", "মাতৃ উদ্ভিদ"), "middle", 14, "var(--ink)", "700") + T14(274, 40, L2("explant", "এক্সপ্ল্যান্ট"), "middle", 14, "var(--c)", "700") + T14(274, 160, L2("(a side bud)", "(পার্শ্বমুকুল)"), "middle", 13.5, "var(--muted)") + T14(274, 186, L2("healthy, disease-free", "স্বাস্থ্যবান, রোগমুক্ত"), "middle", 13.5, "var(--muted)");
    } else if (k === 1) {
      [L2("mineral nutrients", "খনিজ পুষ্টি"), L2("vitamins", "ভিটামিন"), L2("phytohormones", "ফাইটোহরমোন"), L2("sucrose (sugar)", "সুক্রোজ (চিনি)"), L2("agar", "অ্যাগার")].forEach((t, i) => { s += `<rect x="12" y="${12 + i * 36}" width="150" height="28" rx="14" fill="${i === 4 ? AGAR14 : "var(--c-soft)"}" fill-opacity="${i === 4 ? .45 : 1}" stroke="${i === 4 ? "#a88a1a" : "var(--c)"}" stroke-width="1.5"/>` + T14(87, 31 + i * 36, t, "middle", 14) + `<path d="M162 ${26 + i * 36} Q196 ${26 + i * 36} 214 96" fill="none" stroke="var(--rule)" stroke-width="1.6"/>`; });
      s += ar14(210, 96, 232, 96, "b14ca") + `<rect x="243" y="100" width="84" height="68" fill="${AGAR14}" opacity=".85"/><path d="M240 54 h6 V168 H324 V54 h6" fill="none" stroke="var(--muted)" stroke-width="2.4" stroke-linejoin="round"/><line x1="300" y1="40" x2="268" y2="160" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/>`;
      s += T14(285, 190, L2("culture medium", "কালচার মাধ্যম"), "middle", 14, "var(--ink)", "700");
    } else if (k === 2) {
      s += T14(82, 16, L2("autoclave", "অটোক্লেভ"), "middle", 14, "var(--ink)", "700") + `<circle cx="82" cy="36" r="11" fill="var(--paper)" stroke="var(--muted)" stroke-width="2"/><line x1="82" y1="36" x2="89" y2="30" stroke="var(--bad)" stroke-width="2" stroke-linecap="round"/><rect x="20" y="50" width="124" height="106" rx="12" fill="var(--c-soft)" stroke="var(--muted)" stroke-width="2.4"/><path d="M20 66 H144" stroke="var(--muted)" stroke-width="2"/>` + flask14(56, 148, 20, 56, 9) + flask14(108, 148, 20, 56, 9);
      s += `<path d="M50 78 q-5 -6 0 -12 M82 80 q-5 -6 0 -12 M114 78 q-5 -6 0 -12" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linecap="round"/>`;
      s += T14(82, 176, L2("121 °C · 20 min", "১২১ °C · ২০ মিনিট"), "middle", 14) + T14(82, 196, "15 lb/sq. inch", "middle", 14);
      s += ar14(152, 104, 196, 104, "b14ca") + flask14(268, 160, 50, 104, 20) + explant14(268, 139, 1.3) + sun14(334, 92, 8);
      s += T14(262, 38, L2("explant on the medium", "মাধ্যমে এক্সপ্ল্যান্ট"), "middle", 13.5, "var(--c)", "700") + T14(268, 184, L2("25 ± 2 °C, light", "২৫ ± ২ °C, আলো"), "middle", 14);
    } else if (k === 3) {
      s += flask14(62, 152, 42, 92, 17) + explant14(62, 134, 1.2) + flask14(180, 152, 42, 92, 17) + callus14(180, 132, 1.25) + flask14(298, 152, 42, 92, 17) + callus14(298, 134, .8);
      [[-17, 14], [-6, 24], [5, 28], [16, 16]].forEach(([d, h]) => s += sprout14(298 + d, 130, h, GRN14, 2, .55));
      s += ar14(108, 112, 132, 112, "b14ca") + ar14(226, 112, 250, 112, "b14ca") + `<path d="M76 44 Q180 2 284 42" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#b14ca)"/>`;
      s += T14(180, 15, L2("or directly", "অথবা সরাসরি"), "middle", 13.5, "var(--muted)") + T14(62, 176, L2("explant", "এক্সপ্ল্যান্ট"), "middle", 14) + T14(180, 176, L2("callus", "ক্যালাস"), "middle", 14, "var(--ink)", "700") + T14(298, 176, L2("plantlets", "অণুচারা"), "middle", 14, "var(--ink)", "700") + T14(180, 197, L2("cells divide again and again", "কোষ বারবার বিভাজিত হয়"), "middle", 13.5, "var(--muted)");
    } else if (k === 4) {
      s += flask14(76, 152, 48, 100, 18);
      [[-17, 22], [0, 38], [17, 24]].forEach(([d, h]) => s += sprout14(76 + d, 136, h, GRN14, 2.2, .65));
      s += scis14(124, 92) + ar14(140, 104, 196, 104, "b14ca");
      s += `<path d="M231 118 V150 a21 13 0 0 0 42 0 V118 z" fill="${ROOTM14}" opacity=".9"/><path d="M230 34 V150 a22 14 0 0 0 44 0 V34" fill="none" stroke="var(--muted)" stroke-width="2.2"/><rect x="227" y="26" width="50" height="11" rx="5" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.5"/>` + sprout14(252, 120, 58, GRN14, 3) + roots14(252, 120, 5, 26);
      s += T14(76, 176, L2("shoots, no roots", "বিটপ আছে, মূল নেই"), "middle", 14) + T14(252, 186, L2("root-inducing medium", "মূল উৎপাদক মাধ্যম"), "middle", 14, "var(--ink)", "700") + `<line x1="266" y1="138" x2="290" y2="128" stroke="var(--muted)" stroke-width="1.4"/>` + T14(293, 127, L2("roots", "মূল"), "start", 14, SOIL14, "700");
    } else {
      s += `<path d="M30 30 h26 v14" fill="none" stroke="var(--muted)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + [[56, 58], [50, 74], [61, 88]].map(([x, y]) => `<path d="M${x} ${y} q-5 8 0 11 q5 -3 0 -11" fill="${WAT14}"/>`).join("") + sprout14(56, 136, 34, GRN14, 3) + roots14(56, 136, 5, 22);
      s += ar14(86, 122, 112, 122, "b14ca") + pot14(146, 160) + sprout14(146, 143, 36, GRN14, 3) + pot14(188, 160) + sprout14(188, 143, 42, GRN14, 3) + ar14(214, 122, 240, 122, "b14ca");
      s += `<path d="M246 160 H352" stroke="${SOIL14}" stroke-width="5" stroke-linecap="round"/>` + [262, 290, 318, 344].map((x, i) => sprout14(x, 157, 50 + (i % 2) * 8, GRN14, 3.2)).join("") + sun14(322, 30, 11);
      s += T14(56, 184, L2("wash off agar", "অ্যাগার ধোয়া"), "middle", 14) + T14(167, 184, L2("pots: harden", "টবে খাপ খাওয়ানো"), "middle", 14) + T14(298, 184, L2("field", "মাঠ"), "middle", 14, "var(--ink)", "700");
    }
    return [s + `</svg>`, `<b>${STEP[k][0]}${DOT14()}</b> ${STEP[k][1]}`];
  };
  /* --- put in order --- */
  const ORD = [
    [L2("Choose a healthy, disease-free mother plant", "স্বাস্থ্যবান, রোগমুক্ত মাতৃ উদ্ভিদ নির্বাচন"), L2("Start with the plant that every plantlet will copy.", "শুরু করো সেই গাছ দিয়ে, প্রতিটি চারা যার নকল হবে।")],
    [L2("Prepare the culture medium", "কালচার মাধ্যম তৈরি"), L2("The explant will need food. What must be made ready for it?", "এক্সপ্ল্যান্টের খাবার লাগবে। তার জন্য কী তৈরি রাখতে হবে?")],
    [L2("Sterilise the medium in an autoclave", "অটোক্লেভে মাধ্যম জীবাণুমুক্ত করা"), L2("The medium is ready, but it is full of germs.", "মাধ্যম তৈরি, কিন্তু তাতে জীবাণু আছে।")],
    [L2("Place the explant on the medium", "মাধ্যমে এক্সপ্ল্যান্ট স্থাপন"), L2("The medium is germ-free, cool and set. What goes on it now?", "মাধ্যম জীবাণুমুক্ত, ঠান্ডা ও জমাট। এখন তার ওপর কী বসবে?")],
    [L2("Callus or plantlets form", "ক্যালাস বা অণুচারা তৈরি"), L2("The cells of the explant are dividing. What do they form?", "এক্সপ্ল্যান্টের কোষ বিভাজিত হচ্ছে। তারা কী তৈরি করে?")],
    [L2("Move the shoots to a root-inducing medium", "বিটপকে মূল উৎপাদক মাধ্যমে স্থানান্তর"), L2("There are shoots but no roots. Where should they go?", "বিটপ আছে, মূল নেই। এদের কোথায় নিতে হবে?")],
    [L2("Harden the plantlets and plant them in the field", "চারাকে খাপ খাইয়ে মাঠে লাগানো"), L2("Rooted plantlets are ready for the last stage.", "মূলযুক্ত চারা শেষ ধাপের জন্য তৈরি।")]];
  let done = 0, pool = [], msg = "", miss = 0;
  const drawOrder = () => {
    const fin = done === ORD.length;
    let s = `<ol style="margin:0 0 8px;padding-left:26px">${ORD.slice(0, done).map(o => `<li style="margin:3px 0"><span style="color:var(--good);font-weight:700">✓</span> ${o[0]}</li>`).join("")}</ol>`;
    if (!fin) s += `<p class="hint" style="margin:4px 0 6px">${L2(`Tap step ${done + 1}:`, `${B14(done + 1)} নম্বর ধাপটিতে চাপ দাও:`)}</p><div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">${pool.map(i => `<button class="btn" data-o="${i}" style="justify-content:flex-start;text-align:left;border-radius:12px">${ORD[i][0]}</button>`).join("")}</div>`;
    s += `<div class="w-out">${fin ? `<b>${L2("Correct order!", "ক্রম ঠিক হয়েছে!")}</b> ${miss ? L2(`You needed ${miss} extra ${miss === 1 ? "try" : "tries"}.`, `বাড়তি চেষ্টা লেগেছে ${B14(miss)} বার।`) : L2("No mistakes at all.", "একটিও ভুল হয়নি।")} ${L2("Mother plant → medium → sterilise → explant → callus or plantlets → roots → field.", "মাতৃ উদ্ভিদ → মাধ্যম → জীবাণুমুক্তকরণ → এক্সপ্ল্যান্ট → ক্যালাস বা অণুচারা → মূল → মাঠ।")}` : msg || L2("Seven steps are mixed up. Which one comes first?", "সাতটি ধাপ এলোমেলো হয়ে আছে। কোনটি সবার আগে?")}</div>`;
    if (fin) s += `<div class="w-row" style="margin-top:10px"><button class="btn solid" id="b14cr">${L2("Mix again", "আবার এলোমেলো করো")}</button></div>`;
    body.innerHTML = s;
    body.querySelectorAll("button[data-o]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.o;
      if (i === done) { done++; pool = pool.filter(q => q !== i); msg = ok14(true, L2("Right.", "ঠিক।") + (done < ORD.length ? " " + L2("What comes next?", "এরপর কোনটি?") : "")); }
      else { miss++; msg = ok14(false, L2("Not yet. ", "এখনই নয়। ") + ORD[done][1]); }
      drawOrder();
    }));
    if (fin) $("#b14cr", el).addEventListener("click", resetOrder);
  };
  const resetOrder = () => { done = 0; miss = 0; msg = ""; pool = shuf14(ORD.map((_, i) => i)); drawOrder(); };
  /* --- hormone balance --- */
  const drawHorm = () => {
    const v = +$("#b14ch", el).value, au = 100 - v, cy = v;
    const nR = v < 40 ? 2 + Math.floor((40 - v) / 10) : 0, nS = v > 60 ? 2 + Math.floor((v - 60) / 10) : 0;
    $("#b14ch-v", el).textContent = v < 40 ? L2("more auxin", "অক্সিন বেশি") : v > 60 ? L2("more cytokinin", "সাইটোকাইনিন বেশি") : L2("balanced", "ভারসাম্য");
    let s = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("Hormone balance and what the tissue forms", "হরমোনের ভারসাম্য এবং টিস্যু যা তৈরি করে")}">`;
    s += `<line x1="14" y1="160" x2="170" y2="160" stroke="var(--muted)" stroke-width="2"/><rect x="26" y="${160 - au * 1.15}" width="44" height="${au * 1.15}" fill="${SOIL14}" opacity=".85"/><rect x="108" y="${160 - cy * 1.15}" width="44" height="${cy * 1.15}" fill="${GRN14}" opacity=".85"/>`;
    s += T14(48, 180, L2("auxin", "অক্সিন"), "middle", 14, "var(--ink)", "700") + T14(130, 180, L2("cytokinin", "সাইটোকাইনিন"), "middle", 14, "var(--ink)", "700") + T14(92, 18, L2("relative amount", "তুলনামূলক পরিমাণ"), "middle", 13.5, "var(--muted)");
    s += flask14(270, 172, 66, 140, 34);
    for (let i = 0; i < nR; i++) { const d = (i - (nR - 1) / 2) * 11; s += `<path d="M${270 + d * .5} 140 q${d * .3} 12 ${d} ${16 + (i % 2) * 8}" fill="none" stroke="${SOIL14}" stroke-width="2.2" stroke-linecap="round"/>`; }
    for (let i = 0; i < nS; i++) { const d = (i - (nS - 1) / 2) * 8.5; s += sprout14(270 + d, 131, 40 - Math.abs(d) * .9 - (i % 2) * 5, GRN14, 2.2, .62); }
    s += callus14(270, 137, nR || nS ? 1 : 1.6);
    s += T14(270, 194, nR ? L2("roots form", "মূল তৈরি হয়") : nS ? L2("shoots form", "বিটপ তৈরি হয়") : L2("callus grows", "ক্যালাস বাড়ে"), "middle", 14, "var(--c)", "700");
    $("#b14cs", el).innerHTML = s + `</svg>`;
    $("#b14co", el).innerHTML = (nR ? L2("<b>Relatively more auxin:</b> the dividing cells form roots. A root-inducing medium (step d) uses this.", "<b>তুলনামূলকভাবে অক্সিন বেশি:</b> বিভাজনরত কোষ মূল তৈরি করে। মূল উৎপাদক মাধ্যমে ((d) ধাপ) এটিই কাজে লাগানো হয়।") : nS ? L2("<b>Relatively more cytokinin:</b> the dividing cells form shoots. This is how many shoots are raised from one culture.", "<b>তুলনামূলকভাবে সাইটোকাইনিন বেশি:</b> বিভাজনরত কোষ বিটপ তৈরি করে। এভাবেই একটি কালচার থেকে অনেক বিটপ পাওয়া যায়।") : L2("<b>The two are balanced:</b> the cells go on dividing as a shapeless callus.", "<b>দুটির ভারসাম্য:</b> কোষগুলো অবয়বহীন ক্যালাস হিসেবে বিভাজিত হতে থাকে।")) + ` <span class="hint">${L2("This is the general rule; the exact amounts differ from plant to plant.", "এটি সাধারণ নিয়ম; সঠিক মাত্রা উদ্ভিদভেদে আলাদা।")}</span>`;
  };
  /* --- how many --- */
  const drawCount = () => {
    const m = sv(el, "b14cm", "", 0), n = sv(el, "b14cn", "", 0), N = Math.pow(m, n);
    const sp = Math.min(30, 296 / (n + 1)), bw = sp * .68, x0 = 40 + (296 - sp * (n + 1)) / 2;
    let s = `<svg viewBox="0 0 360 206" role="img" aria-label="${L2("Number of shoots after each round", "প্রতি দফার পর বিটপের সংখ্যা")}"><line x1="34" y1="160" x2="346" y2="160" stroke="var(--muted)" stroke-width="2"/>`;
    for (let i = 0; i <= n; i++) { const h = Math.max(2, 122 * Math.pow(m, i) / N), x = x0 + i * sp; s += `<rect x="${x.toFixed(1)}" y="${(160 - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="var(--c)" opacity="${i === n ? 1 : .6}"/>` + T14((x + bw / 2).toFixed(1), 177, B14(i), "middle", 13.5, "var(--muted)"); }
    s += T14(Math.min(346, x0 + n * sp + bw).toFixed(1), 28, num14(N), "end", 16, "var(--ink)", "700") + T14(190, 198, L2("round (0 = the first shoot)", "দফা (০ = প্রথম বিটপ)"), "middle", 13.5, "var(--muted)");
    $("#b14cs", el).innerHTML = s + `</svg>`;
    const wk = n * 4, seq = []; for (let i = 0; i <= Math.min(n, 4); i++) seq.push(num14(Math.pow(m, i)));
    const big = N >= 1e7 ? L2(` (about ${B14((N / 1e7).toFixed(1))} crore)`, ` (প্রায় ${B14((N / 1e7).toFixed(1))} কোটি)`) : N >= 1e5 ? L2(` (about ${B14((N / 1e5).toFixed(1))} lakh)`, ` (প্রায় ${B14((N / 1e5).toFixed(1))} লাখ)`) : "";
    $("#b14co", el).innerHTML = `${seq.join(" → ")}${n > 4 ? " → …" : ""}<br>` + L2(`${m}<sup>${n}</sup> = <b>${num14(N)}</b> shoots${big} after ${n} ${n === 1 ? "round" : "rounds"}, that is ${wk} weeks if one round takes 4 weeks.`, `${B14(m)}<sup>${B14(n)}</sup> = <b>${num14(N)}</b>টি বিটপ${big}, ${B14(n)} দফা পরে; এক দফায় ৪ সপ্তাহ লাগলে মোট ${B14(wk)} সপ্তাহ।`) + ` <span class="hint">${L2("A simple model: it assumes every shoot survives. Each bar is drawn to the same scale, so the early bars are almost too small to see.", "সরল হিসাব: ধরে নেওয়া হয়েছে সব বিটপ বেঁচে থাকে। সব স্তম্ভ একই স্কেলে আঁকা, তাই শুরুর স্তম্ভগুলো প্রায় দেখাই যায় না।")}</span>`;
  };
  const setView = () => {
    if (view === "steps") stepper14(body, "b14cq", STEP.length, drawStep);
    else if (view === "order") resetOrder();
    else if (view === "horm") {
      body.innerHTML = slider("b14ch", L2("← auxin · cytokinin →", "← অক্সিন · সাইটোকাইনিন →"), 0, 100, 5, 50, "") + `<div class="svgwrap fit" id="b14cs"></div><div class="w-out" id="b14co"></div>`;
      $("#b14ch", el).addEventListener("input", drawHorm); drawHorm();
    } else {
      body.innerHTML = slider("b14cm", L2("Shoots from each shoot in one round (m)", "এক দফায় প্রতিটি বিটপ থেকে বিটপ (m)"), 2, 5, 1, 3, "") + slider("b14cn", L2("Number of rounds (n)", "দফার সংখ্যা (n)"), 1, 10, 1, 8, "") + `<div class="svgwrap fit" id="b14cs"></div><div class="w-out" id="b14co"></div>`;
      $("#b14cm", el).addEventListener("input", drawCount); $("#b14cn", el).addEventListener("input", drawCount); drawCount();
    }
  };
  chips14(el, ".b14cv", b => { view = b.dataset.v; setView(); });
  setView();
};

/* 14.3 recombinant DNA: step-through, sticky ends close-up, uses sorter */
W.b14gene = (el) => {
  let view = "steps";
  el.innerHTML = tabs14("b14gv", [["steps", L2("Step by step", "ধাপে ধাপে")], ["sticky", L2("Sticky ends", "আঠালো প্রান্ত")], ["uses", L2("Sort the uses", "ব্যবহার সাজাও")]], view) + `<div id="b14gb" style="margin-top:8px"></div>`;
  const body = $("#b14gb", el);
  const A = arrowDefs("b14ga", "var(--muted)");
  const STEP = [
    [L2("(a) Getting the two DNAs", "(a) দুটি DNA সংগ্রহ"), L2("DNA with the desired gene (here the gene for human insulin) is separated from the donor cell. A <b>plasmid</b>, a small ring of DNA outside the chromosome, is separated from the bacterium <i>E. coli</i> to be the carrier of the gene.", "দাতা কোষ থেকে কাঙ্ক্ষিত জিনসহ (এখানে মানুষের ইনসুলিনের জিন) DNA পৃথক করা হয়। জিনের বাহক হিসেবে <i>E. coli</i> ব্যাকটেরিয়া থেকে <b>প্লাজমিড</b> পৃথক করা হয়; এটি ক্রোমোজোমের বাইরের ছোট একটি গোল DNA।")],
    [L2("(b) Cutting", "(b) কাটা"), L2("The donor DNA and the plasmid are both cut with a <b>restriction enzyme</b>. One piece of the donor DNA carries the desired gene. The ring of the plasmid opens. The cut ends are sticky ends.", "দাতা DNA ও প্লাজমিড, দুটিকেই <b>রেস্ট্রিকশন এনজাইম</b> দিয়ে কাটা হয়। দাতা DNA-এর একটি খণ্ডে কাঙ্ক্ষিত জিনটি থাকে। গোল প্লাজমিডটি খুলে যায়। কাটা প্রান্তগুলো আঠালো প্রান্ত।")],
    [L2("(c) Joining", "(c) জোড়া লাগানো"), L2("The enzyme <b>ligase</b> fixes the gene piece between the two cut ends of the plasmid, like glue. The ring is closed again, and now it carries the gene: a <b>recombinant plasmid</b>.", "<b>লাইগেজ</b> এনজাইম জিনের খণ্ডটিকে প্লাজমিডের কাটা প্রান্ত দুটোর মাঝখানে আঠার মতো জুড়ে দেয়। প্লাজমিড আবার গোল হয়, আর এখন তাতে জিনটি আছে: এটি <b>রিকম্বিনেন্ট প্লাজমিড</b>।")],
    [L2("(d) Putting it into a cell", "(d) কোষে প্রবেশ করানো"), L2("The recombinant plasmid is made to enter a bacterium. This entry of DNA into a recipient cell is <b>transformation</b>. The bacterium with the new gene is a <b>transgenic</b> organism.", "রিকম্বিনেন্ট প্লাজমিডকে ব্যাকটেরিয়ার ভেতরে প্রবেশ করানো হয়। গ্রাহক কোষে DNA-এর এই প্রবেশই <b>ট্রান্সফরমেশন</b>। নতুন জিন পাওয়া ব্যাকটেরিয়াটি একটি <b>ট্রান্সজেনিক</b> জীব।")],
    [L2("(e) Selecting and multiplying", "(e) বাছাই ও বংশবৃদ্ধি"), L2("The bacteria that carry the recombinant plasmid are identified, separated and multiplied. Every new cell has the gene: this is <b>gene cloning</b>. The bacteria read the gene and make insulin, which is collected and purified.", "রিকম্বিনেন্ট প্লাজমিড ধারণ করা ব্যাকটেরিয়াগুলোকে শনাক্ত করে আলাদা করা হয় এবং তাদের বংশবৃদ্ধি ঘটানো হয়। প্রতিটি নতুন কোষে জিনটি থাকে: এটাই <b>জিন ক্লোনিং</b>। ব্যাকটেরিয়া জিনটি পড়ে ইনসুলিন তৈরি করে, যা সংগ্রহ করে বিশুদ্ধ করা হয়।")]];
  const GN = L2("insulin gene", "ইনসুলিনের জিন");
  const drawStep = k => {
    let s = `<svg viewBox="0 0 360 212" role="img" aria-label="${STEP[k][0]}">${A}`;
    if (k === 0) {
      s += `<circle cx="44" cy="56" r="27" fill="var(--paper)" stroke="var(--muted)" stroke-width="2"/><circle cx="44" cy="56" r="11" fill="${DON14}" opacity=".6"/>` + T14(44, 102, L2("human cell", "মানুষের কোষ"), "middle", 14) + ar14(78, 56, 112, 56, "b14ga");
      s += dna14(122, 346, 56, DON14) + dna14(214, 268, 56, GENE14, 0, 0, 5) + T14(241, 34, GN, "middle", 14, GENE14, "700") + T14(166, 82, L2("donor DNA", "দাতা DNA"), "middle", 13.5, "var(--muted)");
      s += bact14(62, 158, 96, 44, 1, false) + T14(62, 202, "E. coli", "middle", 14, "var(--ink)", "", ` font-style="italic"`) + ar14(116, 158, 160, 158, "b14ga") + plasmid14(208, 158, 30, 0, 7);
      s += T14(250, 154, L2("plasmid", "প্লাজমিড"), "start", 14.5, PLAS14, "700") + T14(250, 173, L2("(the carrier)", "(বাহক)"), "start", 13.5, "var(--muted)");
    } else if (k === 1) {
      s += T14(236, 14, L2("restriction enzyme", "রেস্ট্রিকশন এনজাইম"), "middle", 14, "var(--bad)", "700") + scis14(193, 34) + scis14(271, 34);
      s += T14(8, 63, L2("donor DNA", "দাতা DNA"), "start", 13.5, "var(--muted)") + dna14(98, 180, 58, DON14, 0, 16, 3.4, 8) + dna14(190, 258, 58, GENE14, 16, 16, 4.4, 8) + dna14(268, 336, 58, DON14, 16, 0, 3.4, 8);
      s += T14(232, 90, L2("gene piece with sticky ends", "আঠালো প্রান্তসহ জিনের খণ্ড"), "middle", 13.5, GENE14, "700");
      s += scis14(236, 122) + plasmid14(236, 164, 28, 1, 7, 24) + T14(8, 152, L2("both are cut with", "দুটিই কাটা হয়"), "start", 13.5, "var(--muted)") + T14(8, 170, L2("the same enzyme", "একই এনজাইম দিয়ে"), "start", 13.5, "var(--muted)") + T14(278, 168, L2("opened", "খোলা"), "start", 14, PLAS14, "700") + T14(278, 186, L2("plasmid", "প্লাজমিড"), "start", 14, PLAS14, "700");
    } else if (k === 2) {
      s += plasmid14(150, 120, 52, 2, 9, 30) + `<circle cx="124" cy="75" r="5.5" fill="var(--good)"/><circle cx="176" cy="75" r="5.5" fill="var(--good)"/><line x1="121" y1="71" x2="92" y2="50" stroke="var(--good)" stroke-width="1.6"/><line x1="179" y1="71" x2="208" y2="50" stroke="var(--good)" stroke-width="1.6"/>`;
      s += T14(150, 22, GN, "middle", 14, GENE14, "700") + `<line x1="150" y1="28" x2="150" y2="60" stroke="${GENE14}" stroke-width="1.6"/>` + T14(88, 46, L2("ligase", "লাইগেজ"), "end", 14, "var(--good)", "700") + T14(212, 46, L2("ligase", "লাইগেজ"), "start", 14, "var(--good)", "700");
      s += T14(288, 108, L2("recombinant", "রিকম্বিনেন্ট"), "middle", 15, "var(--ink)", "700") + T14(288, 128, L2("plasmid", "প্লাজমিড"), "middle", 15, "var(--ink)", "700") + T14(288, 152, L2("= recombinant DNA", "= রিকম্বিনেন্ট DNA"), "middle", 13.5, "var(--muted)") + T14(150, 202, L2("ligase joins like glue", "লাইগেজ আঠার মতো জোড়ে"), "middle", 13.5, "var(--muted)");
    } else if (k === 3) {
      s += plasmid14(38, 56, 20, 2, 6, 30) + T14(66, 38, L2("recombinant plasmid", "রিকম্বিনেন্ট প্লাজমিড"), "start", 14, "var(--ink)", "700");
      s += `<rect x="127" y="66" width="212" height="120" rx="60" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2.5"/><path d="M240 116 q8 -18 16 0 t16 0 t16 0 t16 0" fill="none" stroke="var(--muted)" stroke-width="2.6" stroke-linecap="round"/>` + T14(272, 150, L2("chromosome", "ক্রোমোজোম"), "middle", 13.5, "var(--muted)");
      s += ar14(58, 70, 150, 114, "b14ga", "var(--muted)", 2.4, "6 4") + plasmid14(182, 126, 20, 2, 6, 30) + T14(8, 188, L2("transformation", "ট্রান্সফরমেশন"), "start", 14, "var(--ink)", "700") + T14(233, 206, L2("transgenic bacterium", "ট্রান্সজেনিক ব্যাকটেরিয়া"), "middle", 14, "var(--ink)", "700");
    } else {
      const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1.6"/>`;
      s += ln(74, 76, 100, 48) + ln(74, 76, 100, 104) + ln(164, 48, 190, 22) + ln(164, 48, 190, 58) + ln(164, 104, 190, 94) + ln(164, 104, 190, 130);
      s += bact14(42, 76, 62, 26, 1, true) + bact14(132, 48, 62, 26, 1, true) + bact14(132, 104, 62, 26, 1, true) + [22, 58, 94, 130].map(y => bact14(222, y, 62, 26, 1, true)).join("");
      s += ar14(260, 76, 290, 76, "b14ga") + `<rect x="302" y="50" width="32" height="54" rx="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/><rect x="302" y="74" width="32" height="30" rx="5" fill="${WAT14}" opacity=".35"/><rect x="309" y="38" width="18" height="12" rx="3" fill="var(--muted)"/>` + T14(318, 124, L2("insulin", "ইনসুলিন"), "middle", 14, "var(--ink)", "700");
      s += T14(180, 170, L2("every cell carries the gene", "প্রতিটি কোষে জিনটি আছে"), "middle", 14) + T14(180, 192, L2("many copies of the gene = gene cloning", "জিনের অসংখ্য নকল = জিন ক্লোনিং"), "middle", 14, "var(--c)", "700");
    }
    return [s + `</svg>`, `<b>${STEP[k][0]}${DOT14()}</b> ${STEP[k][1]}`];
  };
  /* --- sticky ends close-up: cut with the enzyme, choose the piece that fits, seal with ligase --- */
  let st = 0, fb = "";
  const CW = 22, X = i => 15 + i * CW, YT = 54, YB = 96;
  const bx = (x, row, b) => `<rect x="${x + 1}" y="${row ? YB : YT}" width="20" height="24" rx="4" fill="${BASE14[b]}" fill-opacity=".3" stroke="${BASE14[b]}" stroke-width="1.8"/>` + T14(x + 11, (row ? YB : YT) + 17, b, "middle", 14, "var(--ink)", "700");
  const hb = (x, b) => (b === "A" || b === "T" ? [-4, 4] : [-6, 0, 6]).map(d => `<line x1="${x + 11 + d}" y1="80" x2="${x + 11 + d}" y2="94" stroke="var(--muted)" stroke-width="1.8" stroke-dasharray="3 2"/>`).join("");
  const rail = (row, x1, x2, col) => `<line x1="${x1}" y1="${row ? 127 : 47}" x2="${x2}" y2="${row ? 127 : 47}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
  const drawSticky = () => {
    let s = `<svg viewBox="0 0 360 168" role="img" aria-label="${L2("Close-up of the bases where the restriction enzyme cuts", "রেস্ট্রিকশন এনজাইম যেখানে কাটে সেখানকার বেসগুলোর কাছ থেকে দেখা ছবি")}">`;
    if (st === 0) {
      const x0 = 114;
      s += rail(0, 8, 352, PLAS14) + rail(1, 8, 352, PLAS14) + T14(8, 30, L2("plasmid DNA", "প্লাজমিড DNA"), "start", 14, PLAS14, "700");
      "GAATTC".split("").forEach((b, j) => s += bx(x0 + j * CW, 0, b) + hb(x0 + j * CW, b));
      "CTTAAG".split("").forEach((b, j) => s += bx(x0 + j * CW, 1, b));
      s += `<path d="M${x0 + CW} 38 V87 H${x0 + 5 * CW} V136" fill="none" stroke="var(--bad)" stroke-width="2.4" stroke-dasharray="5 4"/>` + scis14(x0 + CW, 24) + T14(180, 158, L2("the enzyme looks for G A A T T C", "এনজাইমটি খোঁজে G A A T T C ক্রম"), "middle", 13.5, "var(--muted)");
    } else {
      const ins = st >= 2;
      s += rail(0, 6, X(0) + 21 - (ins && st === 2 ? 3 : 0), PLAS14) + rail(1, 6, X(4) + 21 - (ins && st === 2 ? 3 : 0), PLAS14) + rail(0, X(10) + 1 + (ins && st === 2 ? 3 : 0), 354, PLAS14) + rail(1, X(14) + 1 + (ins && st === 2 ? 3 : 0), 354, PLAS14);
      s += bx(X(0), 0, "G") + hb(X(0), "G");
      "CTTAA".split("").forEach((b, j) => s += bx(X(j), 1, b));
      "AATTC".split("").forEach((b, j) => s += bx(X(10 + j), 0, b));
      s += bx(X(14), 1, "G") + hb(X(14), "G");
      if (!ins) s += `<rect x="${X(5) + 3}" y="${YT}" width="${5 * CW - 6}" height="66" rx="8" fill="none" stroke="var(--rule)" stroke-width="2" stroke-dasharray="6 4"/>` + T14(180, 95, "?", "middle", 26, "var(--c)", "700") + T14(X(2) + 22, 150, L2("sticky end", "আঠালো প্রান্ত"), "middle", 13.5, "var(--muted)") + T14(X(12), 34, L2("sticky end", "আঠালো প্রান্ত"), "middle", 13.5, "var(--muted)");
      else {
        s += rail(0, X(1) + 1 + (st === 2 ? 3 : 0), X(9) + 21 - (st === 2 ? 3 : 0), GENE14) + rail(1, X(5) + 1 + (st === 2 ? 3 : 0), X(13) + 21 - (st === 2 ? 3 : 0), GENE14);
        "AATTC".split("").forEach((b, j) => s += bx(X(1 + j), 0, b) + hb(X(1 + j), b));
        s += bx(X(5), 1, "G") + `<rect x="${X(6) + 1}" y="${YT}" width="${3 * CW - 2}" height="66" rx="6" fill="${GENE14}" fill-opacity=".25" stroke="${GENE14}" stroke-width="2"/>` + T14(X(7) + 11, 92, L2("gene", "জিন"), "middle", 15, "var(--ink)", "700");
        s += bx(X(9), 0, "G") + hb(X(9), "G");
        "CTTAA".split("").forEach((b, j) => s += bx(X(9 + j), 1, b) + (j ? hb(X(9 + j), b) : ""));
        [[X(1), 47], [X(10), 47], [X(5), 127], [X(14), 127]].forEach(([x, y]) => s += st === 2 ? `<circle cx="${x}" cy="${y}" r="7.5" fill="none" stroke="var(--bad)" stroke-width="2"/>` : `<circle cx="${x}" cy="${y}" r="5" fill="var(--good)"/>`);
        s += T14(180, 158, st === 2 ? L2("4 gaps are still open in the rails", "রেলিংয়ে এখনো ৪টি ফাঁক আছে") : L2("rails joined: recombinant DNA", "রেলিং জুড়ে গেছে: রিকম্বিনেন্ট DNA"), "middle", 13.5, st === 2 ? "var(--bad)" : "var(--good)", "700") + T14(8, 30, L2("plasmid", "প্লাজমিড"), "start", 13.5, PLAS14, "700") + T14(180, 30, L2("donor DNA", "দাতা DNA"), "middle", 13.5, GENE14, "700") + T14(352, 30, L2("plasmid", "প্লাজমিড"), "end", 13.5, PLAS14, "700");
      }
    }
    $("#b14gs", el).innerHTML = s + `</svg>`;
    const act = $("#b14ga2", el), out = $("#b14go", el);
    if (st === 0) { act.innerHTML = `<button class="btn solid" data-s="cut">✂ ${L2("Cut with the restriction enzyme", "রেস্ট্রিকশন এনজাইম দিয়ে কাটো")}</button>`; out.innerHTML = L2("A small part of the plasmid, seen base by base. This restriction enzyme cuts each strand between G and A. The lower strand runs the other way, so its cut is 4 bases away: the cut is a zigzag, not a straight line.", "প্লাজমিডের ছোট একটি অংশ, বেস ধরে ধরে দেখানো। এই রেস্ট্রিকশন এনজাইম প্রতিটি সূত্রকে G ও A-এর মাঝখানে কাটে। নিচের সূত্রটি উল্টো দিকে চলে, তাই তার কাটা পড়ে ৪ বেস দূরে: কাটাটা সোজা নয়, আঁকাবাঁকা।"); }
    else if (st === 1) {
      const P = [["1", "G A T C", "C T A G"], ["2", "A A T T", "T T A A"], ["3", "", ""]];
      act.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;width:100%">${P.map(p => `<button class="btn" data-p="${p[0]}" style="justify-content:flex-start;text-align:left;border-radius:12px"><span>${p[1] ? L2(`Piece ${p[0]}: free bases <b>${p[1]}</b> on its left end, <b>${p[2]}</b> on its right end`, `খণ্ড ${B14(p[0])}: বাঁ প্রান্তে খোলা বেস <b>${p[1]}</b>, ডান প্রান্তে <b>${p[2]}</b>`) : L2(`Piece ${p[0]}: flat ends, no free bases`, `খণ্ড ${B14(p[0])}: সমান প্রান্ত, কোনো খোলা বেস নেই`)}</span></button>`).join("")}</div>`;
      out.innerHTML = (fb ? fb + "<br>" : "") + L2("The plasmid is open. On its left end the bases <b>T T A A</b> are free, and on its right end <b>A A T T</b>. Three pieces of donor DNA carry the gene. Which one can pair with both ends?", "প্লাজমিড খুলে গেছে। এর বাঁ প্রান্তে <b>T T A A</b> বেসগুলো খোলা, আর ডান প্রান্তে <b>A A T T</b>। দাতা DNA-এর তিনটি খণ্ডেই জিনটি আছে। কোনটি দুই প্রান্তের সাথেই জোড় বাঁধতে পারবে?");
    } else if (st === 2) { act.innerHTML = `<button class="btn solid" data-s="seal">${L2("Seal with ligase", "লাইগেজ দিয়ে জুড়ে দাও")}</button>`; out.innerHTML = ok14(true, L2("<b>It fits.</b> A pairs with T at both ends, base for base, because the plasmid and the donor DNA were cut by the same enzyme. But the pairs are held only by weak hydrogen bonds, and the rails are still broken at the four red rings.", "<b>মিলে গেছে।</b> দুই প্রান্তেই বেসে বেসে A জোড় বেঁধেছে T-এর সাথে, কারণ প্লাজমিড ও দাতা DNA একই এনজাইমে কাটা। তবে জোড়গুলো শুধু দুর্বল হাইড্রোজেন বন্ধনে ধরা, আর লাল বৃত্তের চার জায়গায় রেলিং এখনো ভাঙা।")); }
    else { act.innerHTML = `<button class="btn" data-s="again">${L2("Start again", "আবার শুরু করো")}</button>`; out.innerHTML = L2("<b>Recombinant DNA.</b> Ligase has joined the rails with strong bonds. The gene from the donor is now part of the plasmid. Look: the sequence G A A T T C is back on both sides of the gene.", "<b>রিকম্বিনেন্ট DNA।</b> লাইগেজ শক্ত বন্ধন দিয়ে রেলিং জুড়ে দিয়েছে। দাতার জিনটি এখন প্লাজমিডের অংশ। খেয়াল করো: জিনের দুই পাশেই G A A T T C ক্রমটি আবার ফিরে এসেছে।"); }
    act.querySelectorAll("button[data-s]").forEach(b => b.addEventListener("click", () => { st = b.dataset.s === "again" ? 0 : st + 1; fb = ""; drawSticky(); }));
    act.querySelectorAll("button[data-p]").forEach(b => b.addEventListener("click", () => {
      const p = b.dataset.p;
      if (p === "2") { st = 2; fb = ""; }
      else fb = ok14(false, p === "1" ? L2("G cannot pair with T, and C cannot pair with A. Piece 1 was cut by a different restriction enzyme, so its ends do not match.", "G জোড় বাঁধতে পারে না T-এর সাথে, C-ও পারে না A-এর সাথে। খণ্ড ১ অন্য একটি রেস্ট্রিকশন এনজাইমে কাটা, তাই এর প্রান্ত মেলে না।") : L2("Flat ends have no free bases to pair with T T A A and A A T T, so piece 3 cannot hold on here.", "সমান প্রান্তে T T A A ও A A T T-এর সাথে জোড় বাঁধার মতো কোনো খোলা বেস নেই, তাই খণ্ড ৩ এখানে আটকে থাকতে পারে না।"));
      drawSticky();
    }));
  };
  const USES = [
    [L2("Bt brinjal that resists the shoot and fruit borer", "ডগা ও ফল ছিদ্রকারী পোকা প্রতিরোধী বিটি বেগুন"), "c", L2("It carries a gene of <i>Bacillus thuringiensis</i>, so less insecticide is needed.", "এতে <i>Bacillus thuringiensis</i>-এর জিন আছে, তাই কীটনাশক কম লাগে।")],
    [L2("Rice that makes beta-carotene in its grain", "যে ধানের চালে বিটা-ক্যারোটিন তৈরি হয়"), "c", L2("The body turns beta-carotene into vitamin A: better nutrition from a crop.", "দেহ বিটা-ক্যারোটিন থেকে ভিটামিন A তৈরি করে: ফসলের পুষ্টিমান উন্নয়ন।")],
    [L2("Papaya that resists ringspot virus (PRSV)", "রিং স্পট ভাইরাস (PRSV) প্রতিরোধী পেঁপে"), "c", L2("Virus-resistant crop varieties are made by transferring a viral coat protein gene.", "ভাইরাসের কোট প্রোটিনের জিন স্থানান্তর করে ভাইরাস প্রতিরোধী ফসলের জাত তৈরি হয়।")],
    [L2("Soybean that a weedkiller does not harm", "আগাছানাশকে ক্ষতি হয় না এমন সয়াবিন"), "c", L2("Herbicide-tolerant varieties carry a gene from a bacterium.", "আগাছানাশক সহিষ্ণু জাতে একটি ব্যাকটেরিয়ার জিন থাকে।")],
    [L2("Sheep given the CysE and CysM genes for more and better wool", "বেশি ও ভালো পশমের জন্য CysE ও CysM জিন পাওয়া ভেড়া"), "a", L2("Two bacterial genes were transferred to the genome of sheep.", "ব্যাকটেরিয়ার দুটি জিন ভেড়ার জিনোমে স্থানান্তর করা হয়েছে।")],
    [L2("Tilapia carrying the growth hormone gene of salmon", "স্যামনের বৃদ্ধি হরমোনের জিন বহনকারী তেলাপিয়া"), "a", L2("Your book reports that such fish grew about 60 percent bigger.", "তোমার বই জানাচ্ছে, এ ধরনের মাছ প্রায় ৬০ ভাগ বড় হয়েছে।")],
    [L2("Cattle given the Protein C gene to raise milk protein", "দুধে আমিষ বাড়াতে Protein C জিন পাওয়া গরু"), "a", L2("This work on livestock is still at the research stage.", "গবাদিপশুর এই কাজটি এখনো গবেষণা পর্যায়ে আছে।")],
    [L2("Insulin made by <i>E. coli</i> carrying the human insulin gene", "মানুষের ইনসুলিন জিন বহনকারী <i>E. coli</i>-র তৈরি ইনসুলিন"), "h", L2("It is used to treat diabetes.", "এটি ডায়াবেটিসের চিকিৎসায় ব্যবহৃত হয়।")],
    [L2("Hepatitis B vaccine made in modified yeast", "পরিবর্তিত ইস্ট থেকে তৈরি হেপাটাইটিস বি-এর টিকা"), "h", L2("A vaccine protects people from a disease.", "টিকা মানুষকে রোগ থেকে রক্ষা করে।")],
    [L2("Human growth hormone for children who do not grow normally", "স্বাভাবিকভাবে বাড়ছে না এমন শিশুর জন্য মানুষের বৃদ্ধি হরমোন"), "h", L2("It is made by modified <i>E. coli</i> and yeast and is used to treat dwarfism.", "এটি পরিবর্তিত <i>E. coli</i> ও ইস্ট থেকে তৈরি হয় এবং বামনত্বের চিকিৎসায় লাগে।")],
    [L2("<i>Pseudomonas</i> bacteria that break down spilled oil", "ছড়িয়ে পড়া তেল ভাঙতে সক্ষম <i>Pseudomonas</i> ব্যাকটেরিয়া"), "e", L2("They break down oil and hydrocarbons and free the environment of pollution.", "এরা তেল ও হাইড্রোকার্বন ভেঙে পরিবেশকে দূষণমুক্ত করে।")],
    [L2("Faster treatment of industrial waste and sewage", "শিল্পবর্জ্য ও পয়ঃবর্জ্যের দ্রুত শোধন"), "e", L2("The technology makes environmental management easier and faster.", "এই প্রযুক্তি পরিবেশ ব্যবস্থাপনাকে সহজ ও দ্রুত করে।")]];
  const setView = () => {
    if (view === "steps") stepper14(body, "b14gq", STEP.length, drawStep);
    else if (view === "sticky") { body.innerHTML = `<div class="svgwrap fit" id="b14gs"></div><div class="w-row" id="b14ga2" style="margin:6px 0"></div><div class="w-out" id="b14go"></div><p class="hint" style="margin:6px 0 0">${["A", "T", "G", "C"].map(b => `<span style="white-space:nowrap"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${BASE14[b]};vertical-align:-1px"></span> ${b}</span>`).join(" &nbsp; ")} &nbsp; ${L2("A pairs with T, G pairs with C", "A জোড় বাঁধে T-এর সাথে, G জোড় বাঁধে C-এর সাথে")}</p>`; drawSticky(); }
    else sort14(body, USES, [["c", L2("Crops", "শস্য")], ["a", L2("Animals and fish", "প্রাণী ও মাছ")], ["h", L2("Healthcare", "চিকিৎসা")], ["e", L2("Environment", "পরিবেশ")]], { q: L2("In which field is this success of genetic engineering used?", "জেনেটিক ইঞ্জিনিয়ারিংয়ের এই সাফল্যটি কোন ক্ষেত্রের?"), end: L2("Crops, animals and fish, healthcare, environment: these are the fields your book lists. Each GMO is tested under biosafety rules before use.", "শস্য, প্রাণী ও মাছ, চিকিৎসা, পরিবেশ: তোমার বইয়ে এই ক্ষেত্রগুলোর কথাই আছে। প্রতিটি জিএমও ব্যবহারের আগে জীবনিরাপত্তা নীতিমালা মেনে পরীক্ষা করা হয়।") });
  };
  chips14(el, ".b14gv", b => { view = b.dataset.v; setView(); });
  setView();
};
