/* ---- biology chapter 9 widgets: firmness and locomotion ---- */
const B9 = x => bnNum(x, LANG);
const chips9 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const T9 = (x, y, s, a = "middle", sz = 13, c = "var(--ink)", w = "", halo = false) => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${a}" fill="${c}"${w ? ` font-weight="${w}"` : ""}${halo ? ` paint-order="stroke" stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round"` : ""}>${s}</text>`;
const LD9 = (x1, y1, x2, y2, c = "var(--muted)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1"/>`;
const UL9 = a => `<ul style="margin:4px 0 0;padding-left:20px">${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
const BONE9 = "#eee3c8", CART9 = "#8fc4dc", MUS9 = "#c9584c", TEN9 = "#f4efdd", LIG9 = "#d9a437", FLU9 = "#f0cf5e", MAR9 = "#c96a5e";
const F9 = n => (+n).toFixed(1);
/* a long bone: ink outline under a coloured core, with knobby ends */
const bone9 = (x1, y1, x2, y2, w, c, k = 0.85) => `<line x1="${F9(x1)}" y1="${F9(y1)}" x2="${F9(x2)}" y2="${F9(y2)}" stroke="var(--ink)" stroke-width="${F9(w + 2.6)}" stroke-linecap="round"/><circle cx="${F9(x1)}" cy="${F9(y1)}" r="${F9(w * k + 1.3)}" fill="var(--ink)"/><circle cx="${F9(x2)}" cy="${F9(y2)}" r="${F9(w * k + 1.3)}" fill="var(--ink)"/><line x1="${F9(x1)}" y1="${F9(y1)}" x2="${F9(x2)}" y2="${F9(y2)}" stroke="${c}" stroke-width="${F9(w)}" stroke-linecap="round"/><circle cx="${F9(x1)}" cy="${F9(y1)}" r="${F9(w * k)}" fill="${c}"/><circle cx="${F9(x2)}" cy="${F9(y2)}" r="${F9(w * k)}" fill="${c}"/>`;
const thin9 = (d, w, c) => `<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="${w + 2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const hit9 = (x1, y1, x2, y2, w = 10) => `<line x1="${F9(x1)}" y1="${F9(y1)}" x2="${F9(x2)}" y2="${F9(y2)}" stroke="transparent" stroke-width="${w}" stroke-linecap="round"/>`;

/* 9.1 the human skeleton: tap the bones, two divisions, five jobs, find-the-bone game */
W.b9skeleton = (el) => {
  const P = {
    cranium: [L2("Cranium", "করোটিকা"), L2("8 bones", "৮টি অস্থি"), "ax", L2("The rounded box of flat bones that encloses the brain. Its bones are locked together by fixed joints.", "চ্যাপ্টা অস্থির গোল বাক্স, যা মস্তিষ্ককে ঘিরে রাখে। এর অস্থিগুলো নিশ্চল সন্ধি দিয়ে একসাথে আটকানো।")],
    maxilla: [L2("Maxilla", "ম্যাক্সিলা"), L2("2, joined in the middle (the face has 14 bones in all)", "২টি, মাঝখানে জোড়া (মুখমণ্ডলে মোট ১৪টি অস্থি)"), "ax", L2("The upper jaw. It holds the upper teeth and forms part of the face.", "ওপরের চোয়াল। এতে ওপরের পাটির দাঁত বসানো থাকে, আর এটি মুখমণ্ডলের অংশ।")],
    mandible: [L2("Mandible", "ম্যান্ডিবল"), L2("1 bone", "১টি অস্থি"), "ax", L2("The lower jaw, the only bone of the skull that moves. It lets you chew and speak.", "নিচের চোয়াল; করোটির একমাত্র সচল অস্থি। এর সাহায্যে তুমি চিবোও ও কথা বলো।")],
    vertebral: [L2("Vertebral column", "মেরুদণ্ড"), L2("26 bones in an adult (33 vertebrae in a child)", "পূর্ণবয়স্কের ২৬টি অস্থি (শিশুর ৩৩টি কশেরুকা)"), "ax", L2("A chain of vertebrae. It holds the body upright, carries the head and encloses the spinal cord. Its joints are slightly movable.", "কশেরুকার শিকল। দেহকে খাড়া রাখে, মাথার ভার বয় এবং মেরুরজ্জুকে ঘিরে রাখে। এর সন্ধিগুলো ঈষৎ সচল।")],
    sacrum: [L2("Sacrum", "স্যাক্রাম"), L2("1 bone, formed from 5 vertebrae (counted in the 26)", "১টি অস্থি, ৫টি কশেরুকা জুড়ে তৈরি (২৬টির মধ্যে ধরা)"), "ax", L2("The broad lower part of the vertebral column. The two hip bones are fixed to it, so it passes the weight of the upper body to the pelvic girdle.", "মেরুদণ্ডের নিচের চওড়া অংশ। দুই নিতম্বাস্থি এর সাথে আটকানো, তাই এটি ওপরের দেহের ভার শ্রোণিচক্রে পৌঁছে দেয়।")],
    ribs: [L2("Ribs", "পর্শুকা"), L2("24 bones (12 pairs)", "২৪টি অস্থি (১২ জোড়া)"), "ax", L2("Curved bones that form a cage round the heart and lungs. They move up and down when you breathe.", "বাঁকা অস্থি, যা হৃৎপিণ্ড ও ফুসফুসের চারপাশে খাঁচা তৈরি করে। শ্বাস নেওয়ার সময় এরা ওঠানামা করে।")],
    sternum: [L2("Sternum", "স্টার্নাম"), L2("1 bone", "১টি অস্থি"), "ax", L2("The flat breastbone in the middle of the chest. Most ribs are joined to it in front by cartilage.", "বুকের মাঝখানের চ্যাপ্টা অস্থি। বেশির ভাগ পর্শুকা সামনে তরুণাস্থি দিয়ে এর সাথে যুক্ত।")],
    clavicle: [L2("Clavicle", "ক্ল্যাভিকল"), L2("2 bones", "২টি অস্থি"), "ap", L2("The collar bone. With the scapula it forms the pectoral girdle, which hangs the arm on the trunk.", "কণ্ঠাস্থি। স্ক্যাপুলার সাথে মিলে স্কন্ধচক্র গঠন করে, যা হাতকে ধড়ের সাথে ঝুলিয়ে রাখে।")],
    scapula: [L2("Scapula", "স্ক্যাপুলা"), L2("2 bones", "২টি অস্থি"), "ap", L2("The flat, triangular shoulder blade at the back. The round head of the humerus fits into its socket to make the shoulder joint.", "পিঠের দিকের চ্যাপ্টা, তিনকোনা কাঁধের হাড়। হিউমেরাসের গোল মাথা এর কোটরে বসে কাঁধের সন্ধি তৈরি করে।")],
    humerus: [L2("Humerus", "হিউমেরাস"), L2("2 bones", "২টি অস্থি"), "ap", L2("The single bone of the upper arm, from the shoulder to the elbow. The biceps and triceps lie along it.", "ওপরের বাহুর একমাত্র অস্থি, কাঁধ থেকে কনুই পর্যন্ত। বাইসেপস ও ট্রাইসেপস পেশি এর গা বরাবর থাকে।")],
    radius: [L2("Radius", "রেডিয়াস"), L2("2 bones", "২টি অস্থি"), "ap", L2("The forearm bone on the thumb side. The lower end of the biceps is fixed to it.", "নিচের বাহুর বুড়ো আঙুলের দিকের অস্থি। বাইসেপস পেশির নিচের প্রান্ত এর সাথে লাগানো।")],
    ulna: [L2("Ulna", "আলনা"), L2("2 bones", "২টি অস্থি"), "ap", L2("The forearm bone on the little-finger side. Its upper end is the point of the elbow.", "নিচের বাহুর কনিষ্ঠ আঙুলের দিকের অস্থি। এর ওপরের প্রান্তই কনুইয়ের ডগা।")],
    carpals: [L2("Carpals", "কার্পাল"), L2("16 bones (8 in each wrist)", "১৬টি অস্থি (প্রতি কবজিতে ৮টি)"), "ap", L2("Small bones of the wrist, arranged in two rows. They let the wrist bend and turn.", "কবজির ছোট ছোট অস্থি, দুই সারিতে সাজানো। এদের কারণে কবজি বাঁকে ও ঘোরে।")],
    metacarpals: [L2("Metacarpals", "মেটাকার্পাল"), L2("10 bones (5 in each palm)", "১০টি অস্থি (প্রতি তালুতে ৫টি)"), "ap", L2("The bones of the palm, one leading to each finger.", "হাতের তালুর অস্থি, প্রতিটি একটি করে আঙুলের দিকে গেছে।")],
    phalH: [L2("Phalanges (fingers)", "ফ্যালাঞ্জেস (হাতের আঙুল)"), L2("28 bones (14 in each hand)", "২৮টি অস্থি (প্রতি হাতে ১৪টি)"), "ap", L2("The bones of the fingers: 2 in the thumb and 3 in each of the other fingers. Their joints are hinge joints.", "হাতের আঙুলের অস্থি: বুড়ো আঙুলে ২টি, বাকি প্রতিটি আঙুলে ৩টি। এদের সন্ধি কবজা সন্ধি।")],
    hip: [L2("Hip bone", "নিতম্বাস্থি"), L2("2 bones (each = ilium + ischium + pubis)", "২টি অস্থি (প্রতিটি = ইলিয়াম + ইশ্চিয়াম + পিউবিস)"), "ap", L2("The two hip bones form the pelvic girdle. Each has a deep socket for the head of the femur and passes the weight of the body to the legs.", "দুই নিতম্বাস্থি মিলে শ্রোণিচক্র। প্রতিটিতে ফিমারের মাথার জন্য গভীর কোটর আছে; এরা দেহের ভার পায়ে পৌঁছে দেয়।")],
    femur: [L2("Femur", "ফিমার"), L2("2 bones", "২টি অস্থি"), "ap", L2("The thigh bone, the longest and strongest bone of the body. Its round head makes a ball-and-socket joint with the hip bone.", "ঊরুর হাড়; দেহের সবচেয়ে লম্বা ও মজবুত অস্থি। এর গোল মাথা নিতম্বাস্থির সাথে বল ও কোটরসন্ধি তৈরি করে।")],
    patella: [L2("Patella", "প্যাটেলা"), L2("2 bones", "২টি অস্থি"), "ap", L2("The knee-cap, a small bone in front of the knee joint that protects it.", "হাঁটুর চাকতি; হাঁটুর সন্ধির সামনের ছোট অস্থি, যা সন্ধিকে রক্ষা করে।")],
    tibia: [L2("Tibia", "টিবিয়া"), L2("2 bones", "২টি অস্থি"), "ap", L2("The shin bone, the thicker bone of the lower leg. It carries the weight from the knee to the foot.", "হাঁটুর নিচের মোটা অস্থি। হাঁটু থেকে পায়ের পাতা পর্যন্ত দেহের ভার বয়।")],
    fibula: [L2("Fibula", "ফিবুলা"), L2("2 bones", "২টি অস্থি"), "ap", L2("The thin bone on the outer side of the lower leg, beside the tibia. Muscles are fixed to it.", "হাঁটুর নিচে বাইরের দিকের সরু অস্থি, টিবিয়ার পাশে থাকে। এর গায়ে পেশি লাগানো থাকে।")],
    tarsals: [L2("Tarsals", "টার্সাল"), L2("14 bones (7 in each foot)", "১৪টি অস্থি (প্রতি পায়ে ৭টি)"), "ap", L2("The bones of the ankle and heel. The largest one is the heel bone.", "গোড়ালি ও পায়ের পেছনের অংশের অস্থি। এদের মধ্যে সবচেয়ে বড়টি গোড়ালির হাড়।")],
    metatarsals: [L2("Metatarsals", "মেটাটার্সাল"), L2("10 bones (5 in each foot)", "১০টি অস্থি (প্রতি পায়ে ৫টি)"), "ap", L2("The bones of the sole of the foot, between the ankle and the toes.", "পায়ের পাতার অস্থি, গোড়ালি ও আঙুলের মাঝে থাকে।")],
    phalF: [L2("Phalanges (toes)", "ফ্যালাঞ্জেস (পায়ের আঙুল)"), L2("28 bones (14 in each foot)", "২৮টি অস্থি (প্রতি পায়ে ১৪টি)"), "ap", L2("The bones of the toes: 2 in the big toe and 3 in each of the other toes.", "পায়ের আঙুলের অস্থি: বুড়ো আঙুলে ২টি, বাকি প্রতিটি আঙুলে ৩টি।")]
  };
  const SHORT = { vertebral: L2("Backbone", "মেরুদণ্ড"), phalH: L2("Phalanges", "ফ্যালাঞ্জেস"), phalF: L2("Phalanges", "ফ্যালাঞ্জেস") };
  const LAB = [["cranium", 0, 26, 157, 30], ["mandible", 0, 84, 165, 82], ["clavicle", 0, 102, 143, 99], ["scapula", 0, 128, 141, 127], ["humerus", 0, 158, 118, 156], ["radius", 0, 238, 104, 236],
    ["carpals", 0, 281, 95, 285], ["phalH", 0, 342, 94, 327], ["femur", 0, 364, 155, 358], ["patella", 0, 390, 158, 388], ["fibula", 0, 428, 157, 426], ["tarsals", 0, 474, 156, 474],
    ["maxilla", 1, 62, 198, 60], ["vertebral", 1, 92, 187, 95], ["sternum", 1, 122, 186, 124], ["ribs", 1, 152, 228, 154], ["ulna", 1, 232, 248, 232], ["sacrum", 1, 258, 186, 264], ["hip", 1, 280, 216, 274], ["metacarpals", 1, 348, 268, 301],
    ["tibia", 1, 428, 196, 426], ["metatarsals", 1, 476, 207, 486], ["phalF", 1, 497, 211, 497]];
  const ALL = Object.keys(P);
  const skel = (col) => {
    const both = f => f(x => x) + f(x => 360 - x);
    const g = (k, inner) => `<g data-k="${k}" style="cursor:pointer">${inner}</g>`;
    let s = "";
    s += g("scapula", both(m => `<path d="M${m(132)} 100 L${m(153)} 106 L${m(141)} 152 Z" fill="${col("scapula")}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`));
    let v = ""; for (let i = 0; i < 17; i++) v += `<rect x="173" y="${F9(88 + i * 9.6)}" width="14" height="7.6" rx="2.5" fill="${col("vertebral")}" stroke="var(--ink)" stroke-width="1.1"/>`;
    s += g("vertebral", v + `<rect x="170" y="86" width="20" height="165" fill="transparent"/>`);
    const RW = [27, 35, 41, 45, 48, 50, 50, 48, 45, 41];
    let r = "", cart = "";
    RW.forEach((w, i) => {
      const y = 107 + i * 9.4, fx = i < 7 ? 175 : 175 - (i - 6) * 7, fy = i < 7 ? y + 1 : 172 + (i - 6) * 6;
      r += both(m => thin9(`M${m(fx)} ${F9(fy)} C${m(F9(fx - (w - (175 - fx)) * 0.55))} ${F9(y - 6)} ${m(175 - w)} ${F9(y - 3)} ${m(175 - w)} ${F9(y + 5)} C${m(175 - w)} ${F9(y + 12)} ${m(F9(175 - w * 0.5))} ${F9(y + 11)} ${m(174)} ${F9(y + 8)}`, 2.6, col("ribs")));
      if (i >= 7) cart += both(m => `<line x1="${m(fx)}" y1="${F9(fy)}" x2="${m(i === 7 ? 176 : fx + 7)}" y2="${F9(i === 7 ? 172 : fy - 6)}" stroke="${CART9}" stroke-width="2.4" stroke-linecap="round"/>`);
    });
    [201, 210].forEach((y, i) => { r += both(m => thin9(`M${m(174)} ${y} Q${m(152 + i * 6)} ${y - 2} ${m(144 + i * 8)} ${y + 8}`, 2.6, col("ribs"))); });
    s += g("ribs", cart + r);
    s += g("sternum", `<path d="M171 103 h18 l-3.5 13 v52 q-5.5 8 -11 0 v-52 z" fill="${col("sternum")}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`);
    s += g("clavicle", both(m => thin9(`M${m(171)} 105 Q${m(152)} 95 ${m(129)} 100`, 3.6, col("clavicle"))));
    s += g("mandible", `<path d="M157 60 L161 82 Q180 93 199 82 L203 60 L197 63 L194 77 Q180 84 166 77 L163 63 Z" fill="${col("mandible")}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`);
    s += g("cranium", `<path d="M153 46 C150 6 210 6 207 46 L205 53 L155 53 Z" fill="${col("cranium")}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`);
    s += g("maxilla", `<path d="M155 53 L205 53 L199 68 Q180 75 161 68 Z" fill="${col("maxilla")}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/><path d="M166 67 Q180 72 194 67" fill="none" stroke="var(--ink)" stroke-width="1"/>`);
    s += `<g pointer-events="none"><ellipse cx="169" cy="50" rx="6.2" ry="6.5" fill="var(--ink)" opacity=".8"/><ellipse cx="191" cy="50" rx="6.2" ry="6.5" fill="var(--ink)" opacity=".8"/><path d="M180 56 l-3.6 8 h7.2 z" fill="var(--ink)" opacity=".8"/></g>`;
    s += g("hip", both(m => `<path d="M${m(174)} 256 C${m(160)} 238 ${m(140)} 240 ${m(135)} 253 C${m(132)} 267 ${m(140)} 281 ${m(151)} 288 C${m(149)} 299 ${m(158)} 309 ${m(170)} 307 L${m(179)} 299 L${m(176)} 290 C${m(170)} 282 ${m(169)} 270 ${m(174)} 256 Z" fill="${col("hip")}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/><ellipse cx="${m(165)}" cy="297" rx="5" ry="4.2" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/>`));
    s += g("sacrum", `<path d="M169 251 L191 251 L186 278 L180 287 L174 278 Z" fill="${col("sacrum")}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`);
    s += g("femur", both(m => `<circle cx="${m(154)}" cy="288" r="7.6" fill="var(--ink)"/><circle cx="${m(154)}" cy="288" r="6.3" fill="${col("femur")}"/>` + bone9(m(150), 294, m(163), 380, 6.5, col("femur"))));
    s += g("tibia", both(m => bone9(m(166), 397, m(167), 462, 5.4, col("tibia"))));
    s += g("fibula", both(m => bone9(m(156.5), 399, m(158.5), 463, 2.2, col("fibula")) + hit9(m(155), 399, m(157), 463, 7)));
    s += g("patella", both(m => `<circle cx="${m(163)}" cy="388" r="5.4" fill="${col("patella")}" stroke="var(--ink)" stroke-width="1.3"/>`));
    s += g("tarsals", both(m => [[165, 470], [160, 472], [169.5, 474], [164, 476.5], [158, 477.5], [154, 475], [168, 479.5]].map(([x, y]) => `<circle cx="${m(x)}" cy="${y}" r="3.1" fill="${col("tarsals")}" stroke="var(--ink)" stroke-width="1"/>`).join("")));
    s += g("metatarsals", both(m => [0, 1, 2, 3, 4].map(i => thin9(`M${m(F9(153 + i * 3.6))} 483 L${m(F9(148 + i * 4.8))} 491`, 2.3, col("metatarsals"))).join("")));
    s += g("phalF", both(m => [0, 1, 2, 3, 4].map(i => thin9(`M${m(F9(147.2 + i * 4.9))} 494.5 L${m(F9(146 + i * 5.1))} 500`, 2.3, col("phalF"))).join("")));
    s += g("humerus", both(m => bone9(m(125), 104, m(113), 194, 5.4, col("humerus"))));
    s += g("radius", both(m => bone9(m(108.5), 203, m(98.5), 275, 2.5, col("radius")) + hit9(m(107), 203, m(97), 275, 7)));
    s += g("ulna", both(m => bone9(m(116.5), 203, m(107.5), 275, 2.5, col("ulna")) + hit9(m(118), 203, m(109), 275, 7)));
    s += g("carpals", both(m => [[97, 282.5], [101.3, 282.5], [105.6, 282.5], [109.8, 283], [96, 287.6], [100.3, 287.8], [104.6, 287.8], [108.8, 288.2]].map(([x, y]) => `<circle cx="${m(x)}" cy="${y}" r="2.5" fill="${col("carpals")}" stroke="var(--ink)" stroke-width="1"/>`).join("")));
    s += g("metacarpals", both(m => thin9(`M${m(94.5)} 292 L${m(88)} 300`, 2.3, col("metacarpals")) + [1, 2, 3, 4].map(i => thin9(`M${m(F9(94.5 + i * 3.8))} 293.5 L${m(F9(90.5 + i * 4.7))} 306`, 2.3, col("metacarpals"))).join("")));
    s += g("phalH", both(m => thin9(`M${m(86.5)} 303 L${m(82.5)} 312`, 2.3, col("phalH")) + [1, 2, 3, 4].map(i => thin9(`M${m(F9(89.8 + i * 4.8))} 309.5 L${m(F9(88 + i * 5.1))} ${i === 2 ? 329 : i === 4 ? 322 : 326}`, 2.3, col("phalH"))).join("")));
    return s;
  };
  const info = k => `<b>${P[k][0]}</b> · ${B9(P[k][1])}<br><span class="muted" style="font-size:14px">${P[k][2] === "ax" ? L2("Axial skeleton", "অক্ষীয় কঙ্কাল") : L2("Appendicular skeleton", "উপাঙ্গীয় কঙ্কাল")}</span><br>${P[k][3]}`;
  const JOBS = [
    [L2("Shape and firmness", "কাঠামো ও দৃঢ়তা"), ALL, L2("Every bone takes part. Together they form the hard frame that gives the body its definite shape, keeps it firm and links the lower parts with the upper parts.", "প্রতিটি অস্থিই এ কাজে অংশ নেয়। সব মিলে শক্ত কাঠামো তৈরি করে, যা দেহকে নির্দিষ্ট আকার দেয়, দৃঢ় রাখে এবং নিচের অঙ্গগুলোকে ওপরের অঙ্গের সাথে যুক্ত করে।")],
    [L2("Protection", "রক্ষণাবেক্ষণ"), ["cranium", "vertebral", "sacrum", "ribs", "sternum"], L2("The cranium guards the brain, the vertebral column guards the spinal cord, and the ribs with the sternum guard the heart and lungs. The skeleton, with the muscles fixed to it, also carries the weight of the body.", "করোটিকা মস্তিষ্ককে, মেরুদণ্ড মেরুরজ্জুকে, আর পর্শুকা ও স্টার্নাম হৃৎপিণ্ড ও ফুসফুসকে পাহারা দেয়। কঙ্কাল, এর গায়ে লাগানো পেশির সাথে মিলে, দেহের ভারও বহন করে।")],
    [L2("Movement", "নড়াচড়া ও চলাচল"), ["clavicle", "scapula", "humerus", "radius", "ulna", "carpals", "metacarpals", "phalH", "hip", "femur", "patella", "tibia", "fibula", "tarsals", "metatarsals", "phalF"], L2("The arms, the legs, the pectoral girdle and the pelvic girdle help in movement. Muscles fixed to these bones pull them, and so we move about.", "হাত, পা, স্কন্ধচক্র ও শ্রোণিচক্র নড়াচড়ায় সাহায্য করে। এসব অস্থিতে লাগানো পেশি এদের টানে, আর আমরা চলাচল করি।")],
    [L2("Blood cells", "রক্তকণিকা তৈরি"), ["cranium", "vertebral", "sacrum", "ribs", "sternum", "hip"], L2("Red blood cells are made in the bone marrow. In an adult most of the blood-making marrow is in the flat bones (sternum, ribs, hip bones, skull), the vertebrae and the upper ends of the humerus and femur.", "অস্থিমজ্জা থেকে লোহিত রক্তকণিকা তৈরি হয়। পূর্ণবয়স্ক মানুষের রক্ত তৈরির মজ্জার বেশির ভাগ থাকে চ্যাপ্টা অস্থিতে (স্টার্নাম, পর্শুকা, নিতম্বাস্থি, করোটি), কশেরুকায় এবং হিউমেরাস ও ফিমারের ওপরের প্রান্তে।")],
    [L2("Mineral store", "খনিজ লবণ সঞ্চয়"), ALL, L2("All bones store mineral salts such as calcium, potassium and phosphorus. These salts are what make the bones hard and strong.", "সব অস্থিই ক্যালসিয়াম, পটাশিয়াম, ফসফরাস ইত্যাদি খনিজ লবণ জমা রাখে। এই লবণের কারণেই অস্থি শক্ত ও মজবুত।")]];
  const POOL = ["cranium", "mandible", "vertebral", "ribs", "sternum", "clavicle", "scapula", "humerus", "radius", "ulna", "carpals", "hip", "femur", "patella", "tibia", "fibula", "tarsals", "phalH"];
  let view = "bones", sel = "femur", job = 1, target = "femur", state = "", wrongK = "", score = 0, asked = 0, last = "", tried = false;
  el.innerHTML = `<div class="chipset b9kv" role="group"><button data-v="bones" aria-pressed="true">${B9(1)}. ${L2("Bones", "অস্থি")}</button><button data-v="div" aria-pressed="false">${B9(2)}. ${L2("Two divisions", "দুটি বিভাগ")}</button><button data-v="jobs" aria-pressed="false">${B9(3)}. ${L2("Five jobs", "পাঁচটি কাজ")}</button><button data-v="find" aria-pressed="false">${B9(4)}. ${L2("Find the bone", "হাড় খুঁজে বের করো")}</button></div><div id="b9kx" style="margin-top:8px"></div><div class="svgwrap fit" id="b9ks" style="margin-top:6px"></div><div class="w-out" id="b9ko" style="margin-top:8px"></div>`;
  const labels = () => LAB.map(([k, side, y, tx, ty]) => {
    const on = k === sel, c = on ? "var(--bad)" : "var(--ink)", x = side ? 278 : 78;
    return LD9(side ? 275 : 81, y - 4, tx, ty, on ? "var(--bad)" : "var(--muted)") + `<circle cx="${tx}" cy="${ty}" r="1.8" fill="${on ? "var(--bad)" : "var(--muted)"}"/><text data-k="${k}" x="${x}" y="${y}" font-size="13" text-anchor="${side ? "start" : "end"}" fill="${c}" style="cursor:pointer"${on ? ` text-decoration="underline"` : ""}>${SHORT[k] || P[k][0]}</text>`;
  }).join("");
  const newTarget = () => { let k; do { k = POOL[Math.floor(Math.random() * POOL.length)]; } while (k === last); last = k; target = k; state = ""; wrongK = ""; tried = false; };
  const draw = () => {
    const x = $("#b9kx", el), o = $("#b9ko", el);
    let s = `<svg viewBox="0 0 368 506" role="img" aria-label="${L2("Human skeleton, front view", "মানবকঙ্কাল, সামনে থেকে দেখা")}">`;
    if (view === "bones") {
      x.innerHTML = `<span class="hint">${L2("Tap a bone or a name.", "কোনো হাড়ে বা নামে টোকা দাও।")}</span>`;
      s += skel(k => k === sel ? "var(--bad)" : BONE9) + labels();
      o.innerHTML = info(sel);
    } else if (view === "div") {
      x.innerHTML = `<span class="hint">${L2("Tap a bone to see which division it belongs to.", "কোনো হাড়ে টোকা দিয়ে দেখো সেটি কোন বিভাগের।")}</span>`;
      s += skel(k => P[k][2] === "ax" ? "var(--c)" : LIG9);
      s += `<rect x="6" y="14" width="14" height="14" rx="3" fill="var(--c)" stroke="var(--ink)" stroke-width="1"/>` + T9(26, 26, L2("Axial", "অক্ষীয়"), "start", 13, "var(--ink)", "700") + T9(26, 43, L2("80 bones", "৮০টি অস্থি"), "start", 12.5, "var(--muted)");
      s += `<rect x="348" y="14" width="14" height="14" rx="3" fill="${LIG9}" stroke="var(--ink)" stroke-width="1"/>` + T9(342, 26, L2("Appendicular", "উপাঙ্গীয়"), "end", 13, "var(--ink)", "700") + T9(342, 43, L2("126 bones", "১২৬টি অস্থি"), "end", 12.5, "var(--muted)");
      s += T9(64, 200, L2("skull, backbone,", "করোটি, মেরুদণ্ড,"), "middle", 12, "var(--muted)") + T9(64, 215, L2("ribs, sternum", "পর্শুকা, স্টার্নাম"), "middle", 12, "var(--muted)");
      s += T9(300, 340, L2("girdles,", "দুই চক্র,"), "middle", 12, "var(--muted)") + T9(300, 355, L2("arms and legs", "হাত ও পা"), "middle", 12, "var(--muted)");
      o.innerHTML = `<b>${L2("Axial skeleton: 80", "অক্ষীয় কঙ্কাল: ৮০")}</b> = ${L2("skull 22 + ear bones 6 + throat bone 1 + vertebral column 26 + ribs 24 + sternum 1", "করোটি ২২ + কানের অস্থি ৬ + গলার অস্থি ১ + মেরুদণ্ড ২৬ + পর্শুকা ২৪ + স্টার্নাম ১")}<br><b>${L2("Appendicular skeleton: 126", "উপাঙ্গীয় কঙ্কাল: ১২৬")}</b> = ${L2("pectoral girdle 4 + arms 60 + pelvic girdle 2 + legs 60", "স্কন্ধচক্র ৪ + দুই হাত ৬০ + শ্রোণিচক্র ২ + দুই পা ৬০")}<br><b>${L2("Total: 80 + 126 = 206", "মোট: ৮০ + ১২৬ = ২০৬")}</b>${sel && state === "div" ? `<br><span class="muted" style="font-size:14px">${P[sel][0]}: ${P[sel][2] === "ax" ? L2("axial skeleton", "অক্ষীয় কঙ্কাল") : L2("appendicular skeleton", "উপাঙ্গীয় কঙ্কাল")}</span>` : ""}`;
    } else if (view === "jobs") {
      x.innerHTML = `<div class="chipset b9kj" role="group">${JOBS.map((j, i) => `<button data-j="${i}" aria-pressed="${i === job}">${B9(i + 1)}. ${j[0]}</button>`).join("")}</div>`;
      const set = JOBS[job][1], hc = job === 3 ? MAR9 : job === 4 ? LIG9 : "var(--c)";
      s += skel(k => set.includes(k) ? hc : BONE9);
      if (job === 1) {
        s += `<g pointer-events="none"><ellipse cx="180" cy="30" rx="20" ry="15" fill="#e58f9c" stroke="var(--ink)" stroke-width="1"/><path d="M166 28 q7 -8 14 0 q7 -8 14 0 M168 36 q6 -5 12 0 q6 -5 12 0" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".6"/>`;
        s += `<ellipse cx="160" cy="142" rx="13" ry="27" fill="#e58f9c" opacity=".8"/><ellipse cx="202" cy="140" rx="12" ry="25" fill="#e58f9c" opacity=".8"/><path d="M186 132 q8 -8 12 2 q2 10 -12 20 q-12 -10 -10 -20 q4 -10 10 -2 z" fill="var(--bad)" stroke="var(--ink)" stroke-width="1"/>`;
        s += `<line x1="180" y1="90" x2="180" y2="250" stroke="${FLU9}" stroke-width="3" stroke-dasharray="6 3.6"/></g>`;
        s += LD9(76, 26, 161, 30) + T9(72, 30, L2("brain", "মস্তিষ্ক"), "end", 13, "var(--ink)", "700") + LD9(76, 132, 150, 140) + T9(72, 136, L2("lung", "ফুসফুস"), "end", 13, "var(--ink)", "700") + LD9(284, 144, 196, 144) + T9(288, 148, L2("heart", "হৃৎপিণ্ড"), "start", 13, "var(--ink)", "700") + LD9(266, 222, 182, 226) + T9(270, 226, L2("spinal cord", "মেরুরজ্জু"), "start", 13, "var(--ink)", "700");
      }
      if (job === 3) s += `<g pointer-events="none">${[[154, 288, 6.3], [206, 288, 6.3], [125, 104, 4.6], [235, 104, 4.6]].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="${c}" fill="${MAR9}"/>`).join("")}</g>` + T9(64, 150, L2("blood-making", "রক্ত তৈরির"), "middle", 12.5, "var(--ink)", "700") + T9(64, 166, L2("marrow", "মজ্জা"), "middle", 12.5, "var(--ink)", "700") + `<rect x="34" y="176" width="60" height="10" rx="5" fill="${MAR9}" stroke="var(--ink)" stroke-width="1"/>`;
      if (job === 4) s += [[64, 120, "Ca"], [300, 160, "P"], [58, 230, "K"], [304, 300, "Ca"], [66, 400, "P"], [296, 420, "Ca"]].map(([a, b, t]) => `<circle cx="${a}" cy="${b - 5}" r="15" fill="var(--note-soft)" stroke="var(--note)" stroke-width="1.5"/>` + T9(a, b, t, "middle", 14, "var(--ink)", "700")).join("");
      o.innerHTML = `<b>${B9(job + 1)}. ${JOBS[job][0]}.</b> ${JOBS[job][2]}`;
    } else {
      x.innerHTML = `<div class="w-row"><span style="font-size:17px"><b>${L2("Find:", "খুঁজে বের করো:")}</b> ${P[target][0]}</span><span class="muted" style="margin-left:auto;font-size:14px">${L2("Score", "স্কোর")}: ${B9(score)}/${B9(asked)}</span></div>`;
      s += skel(k => state === "ok" && k === target ? "var(--good)" : k === wrongK ? "var(--bad)" : BONE9);
      o.innerHTML = state === "ok" ? `<b style="color:var(--good)">${L2("Correct!", "ঠিক হয়েছে!")}</b> ${P[target][3]}<div style="margin-top:8px"><button class="btn solid" id="b9kn">${L2("Next bone", "পরের হাড়")}</button></div>`
        : wrongK ? `<b style="color:var(--bad)">${L2("Not this one.", "এটা নয়।")}</b> ${L2(`You tapped the ${P[wrongK][0].toLowerCase()}. Try again.`, `তুমি টোকা দিয়েছ ${P[wrongK][0]}-এ। আবার চেষ্টা করো।`)}`
          : L2("Tap the bone on the skeleton. There are no labels now.", "কঙ্কালের গায়ে হাড়টিতে টোকা দাও। এখন কোনো নাম লেখা নেই।");
    }
    $("#b9ks", el).innerHTML = s + `</svg>`;
    $("#b9ks", el).querySelectorAll("[data-k]").forEach(q => q.addEventListener("click", () => {
      const k = q.dataset.k;
      if (view === "find") { if (state === "ok") return; if (!tried) { tried = true; asked++; if (k === target) score++; } if (k === target) { state = "ok"; wrongK = ""; } else { wrongK = k; state = "miss"; } }
      else { sel = k; if (view === "div") state = "div"; }
      draw();
    }));
    if (view === "jobs") chips9(el, ".b9kj", q => { job = +q.dataset.j; draw(); });
    const n = $("#b9kn", el); if (n) n.addEventListener("click", () => { newTarget(); draw(); });
  };
  chips9(el, ".b9kv", b => { view = b.dataset.v; state = ""; wrongK = ""; if (view === "find") { score = 0; asked = 0; newTarget(); } draw(); });
  draw();
};

/* 9.1.2 bone, cartilage and joints: tissue views with a bending test, kinds of joint, inside a synovial joint */
W.b9joint = (el) => {
  const PAT = `<defs><pattern id="b9sp" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#f6edd8"/><circle cx="4.5" cy="4.5" r="2.4" fill="${MAR9}" opacity=".75"/></pattern></defs>`;
  const lab = (x, y, tx, ty, t) => (tx == null ? "" : LD9(x, ty < y ? y - 13 : y + 5, tx, ty, "var(--bad)") + `<circle cx="${tx}" cy="${ty}" r="2.6" fill="var(--bad)"/>`) + T9(x, y, t, "middle", 13.5, "var(--bad)", "700", true);
  const gk = (k, inner) => `<g data-k="${k}" style="cursor:pointer">${inner}</g>`;
  const partChips = (cls, list, sel) => `<div class="chipset ${cls}" role="group" style="margin-top:6px">${list.map(q => `<button data-k="${q[0]}" aria-pressed="${q[0] === sel}">${q[1]}</button>`).join("")}</div>`;
  const BP = [
    ["compact", L2("Compact bone", "নিরেট অস্থি"), L2("The hard, dense outer layer (your book's figure calls it \"strong bone\"). The mineral salts packed into it give the bone its strength.", "বাইরের শক্ত, ঘন স্তর (বইয়ের চিত্রে \"দৃঢ় অস্থি\")। এতে ঠাসা খনিজ লবণই অস্থিকে শক্তি দেয়।"), 180, 54, 180, 85],
    ["spongy", L2("Spongy bone", "স্পঞ্জি অস্থি"), L2("A light network of thin bars of bone, mostly in the ends. It makes the bone lighter without making it weak. Marrow fills its spaces.", "সরু সরু হাড়ের পাতের হালকা জাল, বেশির ভাগ থাকে প্রান্তের দিকে। এতে অস্থি হালকা হয়, অথচ দুর্বল হয় না। এর ফাঁকে মজ্জা থাকে।"), 100, 40, 50, 96],
    ["marrow", L2("Bone marrow", "অস্থিমজ্জা"), L2("Soft tissue in the hollow of the shaft and in the spaces of the spongy bone. Blood cells are made in bone marrow.", "অস্থির ফাঁপা অংশে ও স্পঞ্জি অস্থির ফাঁকে থাকা নরম টিস্যু। অস্থিমজ্জায় রক্তকণিকা তৈরি হয়।"), 180, 54, 180, 103],
    ["periosteum", L2("Periosteum", "পেরিঅস্টিয়াম"), L2("A thin but tough covering over the outside of the bone.", "অস্থির বাইরের পাতলা অথচ মজবুত আবরণ।"), 180, 54, 180, 75],
    ["cartilage", L2("Cartilage cap", "তরুণাস্থির আবরণ"), L2("A smooth cap of cartilage covers each end, where this bone meets another bone in a joint.", "অস্থির দুই প্রান্তে তরুণাস্থির মসৃণ আবরণ থাকে; সেখানেই এ অস্থি অন্য অস্থির সাথে সন্ধি তৈরি করে।"), 84, 34, 19, 86]];
  const CP = [
    ["matrix", L2("Matrix (chondrin)", "মাতৃকা (কন্ড্রিন)"), L2("The firm, half-transparent, light blue substance given out by the cartilage cells. It makes cartilage elastic.", "তরুণাস্থির কোষ থেকে বের হওয়া শক্ত, ঈষদচ্ছ, হালকা নীল পদার্থ। এর কারণেই তরুণাস্থি স্থিতিস্থাপক।"), 180, 128, null, null],
    ["lacuna", L2("Lacuna", "ল্যাকিউনা"), L2("A small cavity (capsule) in the chondrin. The cells sit inside the lacunae, singly or in pairs.", "কন্ড্রিনের মাঝের ছোট গহ্বর (ক্যাপসুল)। কোষগুলো ল্যাকিউনির ভেতরে একক বা জোড়ায় জোড়ায় থাকে।"), 212, 74, 157, 82],
    ["cyte", L2("Chondrocyte", "কন্ড্রোসাইট"), L2("A mature cartilage cell lying in a lacuna. Its protoplasm is clear and its nucleus is round.", "ল্যাকিউনার ভেতরে থাকা পরিণত তরুণাস্থি কোষ। এর প্রোটোপ্লাজম স্বচ্ছ, নিউক্লিয়াস গোলাকার।"), 226, 134, 226, 106],
    ["blast", L2("Chondroblast", "কন্ড্রোব্লাস্ট"), L2("A young cartilage cell, found mostly near the perichondrium. It makes new matrix and later becomes a chondrocyte.", "অপরিণত তরুণাস্থি কোষ, বেশির ভাগ থাকে পেরিকন্ড্রিয়ামের কাছে। এটি নতুন মাতৃকা তৈরি করে, পরে কন্ড্রোসাইটে পরিণত হয়।"), 112, 82, 112, 62],
    ["peri", L2("Perichondrium", "পেরিকন্ড্রিয়াম"), L2("The shiny white covering of fibrous connective tissue that wraps the cartilage.", "তন্তুময় যোজক টিস্যুর তৈরি চকচকে সাদা আবরণ, যা তরুণাস্থিকে ঘিরে রাখে।"), 180, 30, null, null]];
  const JP = [
    ["cart", L2("Cartilage", "তরুণাস্থি"), L2("A smooth, glassy cap on each bone end. The two caps slide over each other, so bone never rubs on bone.", "প্রতিটি অস্থির প্রান্তে কাচের মতো মসৃণ আবরণ। দুই আবরণ একটি আরেকটির ওপর পিছলে যায়, তাই অস্থির সাথে অস্থির ঘষা লাগে না।"), 180, 240, 180, 157],
    ["fluid", L2("Synovial fluid", "সাইনোভিয়াল রস"), L2("A slippery fluid that fills the synovial cavity. It works like oil in a machine: less friction, less wear and less energy spent.", "সাইনোভিয়াল গহ্বর ভরে রাখা পিচ্ছিল রস। যন্ত্রের তেলের মতো কাজ করে: ঘর্ষণ কম, ক্ষয় কম, শক্তি খরচও কম।"), 180, 240, 180, 147],
    ["memb", L2("Synovial membrane", "সাইনোভিয়াল পর্দা"), L2("A thin lining on the inside of the capsule. It surrounds the synovial cavity.", "ক্যাপসুলের ভেতরের গায়ের পাতলা আবরণ। এটি সাইনোভিয়াল গহ্বরকে ঘিরে রাখে।"), 88, 28, 98, 85],
    ["caps", L2("Capsule", "ক্যাপসুল"), L2("A strong fibrous covering that wraps the whole joint and holds it firmly together.", "মজবুত তন্তুময় আবরণী, যা পুরো সন্ধিকে ঘিরে দৃঢ়ভাবে আটকে রাখে।"), 72, 28, 92, 82],
    ["lig", L2("Ligament", "লিগামেন্ট"), L2("An elastic band that ties bone to bone and strengthens the capsule, so the bones do not slip out of place. (Drawn on one side only.)", "স্থিতিস্থাপক বন্ধনী, যা অস্থিকে অস্থির সাথে বাঁধে ও ক্যাপসুলকে মজবুত করে; ফলে অস্থি স্থানচ্যুত হয় না। (ছবিতে শুধু এক পাশে আঁকা।)"), 296, 28, 280, 81],
    ["bone", L2("Bone ends", "অস্থির প্রান্ত"), L2("Two bones meet here. Outside is hard compact bone covered by periosteum; inside is light spongy bone.", "এখানে দুটি অস্থি মিলেছে। বাইরে পেরিঅস্টিয়ামে ঢাকা শক্ত নিরেট অস্থি, ভেতরে হালকা স্পঞ্জি অস্থি।"), 296, 250, 206, 262]];
  const KN = [
    ["fixed", L2("Fixed", "নিশ্চল"), L2("<b>Fixed joint.</b> The zigzag edges of the bones are locked into each other. However hard you push, nothing moves. Example: the joints between the bones of the cranium.", "<b>নিশ্চল অস্থিসন্ধি।</b> অস্থির আঁকাবাঁকা কিনারাগুলো একটি আরেকটির মধ্যে আটকে আছে। যত জোরেই ঠেলো, কিছুই নড়ে না। উদাহরণ: করোটিকার অস্থিগুলোর সন্ধি।")],
    ["slight", L2("Slightly movable", "ঈষৎ সচল"), L2("<b>Slightly movable joint.</b> Each joint tilts only a little, but many joints together bend the whole column. Example: the joints of the backbone.", "<b>ঈষৎ সচল অস্থিসন্ধি।</b> প্রতিটি সন্ধি সামান্য হেলে, কিন্তু অনেকগুলো মিলে পুরো মেরুদণ্ডকে বাঁকায়। উদাহরণ: মেরুদণ্ডের অস্থিসন্ধি।")],
    ["hinge", L2("Hinge", "কবজা"), L2("<b>Hinge joint</b> (freely movable, synovial). Like a door on its hinge, the bone swings in one direction only. Examples: elbow, knee, fingers.", "<b>কবজা সন্ধি</b> (পূর্ণ সচল, সাইনোভিয়াল)। কবজায় লাগানো দরজার মতো অস্থিটি কেবল এক দিকে দোলে। উদাহরণ: কনুই, হাঁটু, আঙুল।")],
    ["ball", L2("Ball and socket", "বল ও কোটর"), L2("<b>Ball-and-socket joint</b> (freely movable, synovial). The round head turns inside a cup, so the bone can point in every direction and even swing round in a circle. Examples: shoulder, hip.", "<b>বল ও কোটরসন্ধি</b> (পূর্ণ সচল, সাইনোভিয়াল)। গোল মাথাটি বাটির মতো কোটরে ঘোরে, তাই অস্থিটি সব দিকে যেতে পারে, গোল করে ঘুরতেও পারে। উদাহরণ: কাঁধ, ঊরুসন্ধি।")]];
  let tab = "tis", tis = "bone", bsel = "compact", csel = "matrix", kind = "hinge", jsel = "cart", worn = false, auto = false, ph = 0;
  el.innerHTML = `<div class="chipset b9jt" role="group"><button data-v="tis" aria-pressed="true">${B9(1)}. ${L2("Bone and cartilage", "অস্থি ও তরুণাস্থি")}</button><button data-v="kinds" aria-pressed="false">${B9(2)}. ${L2("Kinds of joint", "সন্ধির ধরন")}</button><button data-v="in" aria-pressed="false">${B9(3)}. ${L2("Inside a joint", "সন্ধির ভেতরে")}</button></div><div id="b9jb" style="margin-top:8px"></div>`;
  const bindParts = (holder, cls, set) => { holder.querySelectorAll("[data-k]").forEach(q => q.addEventListener("click", () => set(q.dataset.k))); };
  const drawBone = () => {
    const on = k => k === bsel, p = BP.find(q => q[0] === bsel);
    const O = "M70 78 C40 50 10 70 14 105 C10 140 40 160 70 132 L290 132 C320 160 350 140 346 105 C350 70 320 50 290 78 Z";
    let s = `<svg viewBox="0 20 360 178" role="img" aria-label="${L2("A long bone cut open lengthwise", "লম্বালম্বি কাটা একটি লম্বা অস্থি")}">${PAT}<defs><clipPath id="b9c1"><rect x="0" y="0" width="36" height="198"/><rect x="324" y="0" width="36" height="198"/></clipPath><clipPath id="b9c2"><rect x="50" y="0" width="260" height="198"/></clipPath></defs>`;
    s += gk("periosteum", `<path d="${O}" fill="none" stroke="${on("periosteum") ? "var(--bad)" : "#8c6a3f"}" stroke-width="${on("periosteum") ? 12 : 9}" clip-path="url(#b9c2)"/>`);
    s += gk("cartilage", `<path d="${O}" fill="none" stroke="${on("cartilage") ? "var(--bad)" : CART9}" stroke-width="15" clip-path="url(#b9c1)"/>`);
    s += gk("compact", `<path d="${O}" fill="${on("compact") ? "var(--bad)" : BONE9}" stroke="var(--ink)" stroke-width="1.2"/>`);
    s += gk("spongy", ["M72 90 C50 64 24 80 26 105 C24 130 50 146 72 120 Z", "M288 90 C310 64 336 80 334 105 C336 130 310 146 288 120 Z"].map(d => `<path d="${d}" fill="url(#b9sp)" stroke="${on("spongy") ? "var(--bad)" : "#a8946c"}" stroke-width="${on("spongy") ? 3.5 : 1}"/>`).join(""));
    s += gk("marrow", `<rect x="80" y="91" width="200" height="28" rx="13" fill="#e2a070" stroke="${on("marrow") ? "var(--bad)" : "#a8946c"}" stroke-width="${on("marrow") ? 3.5 : 1}"/>`);
    s += lab(p[3], p[4], p[5], p[6], p[1]);
    s += T9(30, 164, L2("Living bone, by your book:", "বই অনুযায়ী জীবিত অস্থি:"), "start", 12.5, "var(--muted)");
    s += `<rect x="30" y="171" width="180" height="22" fill="#a9b8c6" stroke="var(--ink)" stroke-width="1"/><rect x="210" y="171" width="120" height="22" fill="#dcae74" stroke="var(--ink)" stroke-width="1"/>` + T9(120, 187, L2("inorganic 60%", "অজৈব ৬০%"), "middle", 13, "#1c2330", "700") + T9(270, 187, L2("organic 40%", "জৈব ৪০%"), "middle", 13, "#1c2330", "700");
    $("#b9js", el).innerHTML = s + `</svg>`;
    $("#b9jx", el).innerHTML = partChips("b9jp", BP, bsel);
    $("#b9jo", el).innerHTML = `<b>${p[1]}.</b> ${p[2]}`;
    bindParts($("#b9js", el), "", k => { bsel = k; drawBone(); }); chips9(el, ".b9jp", q => { bsel = q.dataset.k; drawBone(); });
  };
  const drawCart = () => {
    const on = k => k === csel, p = CP.find(q => q[0] === csel);
    let s = `<svg viewBox="0 0 360 206" role="img" aria-label="${L2("Cartilage seen under a microscope", "অণুবীক্ষণযন্ত্রে দেখা তরুণাস্থি")}">`;
    s += gk("matrix", `<rect x="8" y="40" width="344" height="158" fill="#cfe4f0" stroke="${on("matrix") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("matrix") ? 3.5 : 1.2}"/>`);
    s += gk("peri", `<rect x="8" y="8" width="344" height="34" rx="6" fill="#f3ecd9" stroke="${on("peri") ? "var(--bad)" : "var(--ink)"}" stroke-width="${on("peri") ? 3.5 : 1.2}"/>` + [16, 25, 34].map(y => `<path d="M10 ${y} q21.2 -5 42.5 0 t42.5 0 t42.5 0 t42.5 0 t42.5 0 t42.5 0 t42.5 0 t42.5 0" fill="none" stroke="#b8a77c" stroke-width="1.2"/>`).join("") + [[50, 21], [130, 30], [230, 20], [310, 30]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="2.3" fill="#a08a55"/>`).join(""));
    s += gk("blast", [40, 112, 186, 258, 324].map(x => `<ellipse cx="${x}" cy="56" rx="9.5" ry="5" fill="${on("blast") ? "var(--bad)" : "#8db4d6"}" stroke="#35506e" stroke-width="1"/><circle cx="${x}" cy="56" r="2" fill="#35506e"/>`).join(""));
    const LC = [[60, 100, 1], [140, 92, 2], [226, 102, 1], [304, 94, 2], [96, 154, 2], [180, 168, 1], [264, 158, 2], [330, 150, 1], [30, 160, 1]];
    s += gk("lacuna", LC.map(([x, y, n]) => `<ellipse cx="${x}" cy="${y}" rx="${n === 2 ? 20 : 13}" ry="12.5" fill="#f4fafd" stroke="${on("lacuna") ? "var(--bad)" : "#6f9fbf"}" stroke-width="${on("lacuna") ? 3 : 1.3}"/>`).join(""));
    s += gk("cyte", LC.map(([x, y, n]) => (n === 2 ? [x - 8.6, x + 8.6] : [x]).map(c => `<ellipse cx="${c}" cy="${y}" rx="${n === 2 ? 7.4 : 8.6}" ry="8.6" fill="${on("cyte") ? "var(--bad)" : "#a7c9e6"}" stroke="#35506e" stroke-width="1"/><circle cx="${c}" cy="${y}" r="2.8" fill="#35506e"/>`).join("")).join(""));
    s += lab(p[3], p[4], p[5], p[6], p[1]);
    $("#b9js", el).innerHTML = s + `</svg>`;
    $("#b9jx", el).innerHTML = partChips("b9jp", CP, csel);
    $("#b9jo", el).innerHTML = `<b>${p[1]}.</b> ${p[2]}`;
    bindParts($("#b9js", el), "", k => { csel = k; drawCart(); }); chips9(el, ".b9jp", q => { csel = q.dataset.k; drawCart(); });
  };
  const drawBend = () => {
    const v = +$("#b9jf", el).value, d = v * 0.42, len = 8 + v * 0.26;
    $("#b9jf-v", el).textContent = v === 0 ? L2("no push", "চাপ নেই") : v < 50 ? L2("gentle push", "হালকা চাপ") : L2("hard push", "জোরে চাপ");
    let s = `<svg viewBox="0 0 360 196" role="img" aria-label="${L2("Bending test for bone and cartilage", "অস্থি ও তরুণাস্থি বাঁকানোর পরীক্ষা")}">${arrowDefs("b9ar", "var(--bad)")}`;
    s += `<rect x="8" y="14" width="24" height="170" fill="var(--rule)" stroke="var(--muted)" stroke-width="1.2"/>` + [30, 60, 90, 120, 150, 180].map(y => `<line x1="8" y1="${y}" x2="32" y2="${y - 16}" stroke="var(--muted)" stroke-width="1"/>`).join("");
    s += `<rect x="32" y="48" width="270" height="16" rx="3" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3"/>` + T9(40, 40, L2("Bone", "অস্থি"), "start", 13.5, "var(--ink)", "700") + T9(350, 86, v ? L2("stays straight", "সোজাই থাকে") : "", "end", 13, "var(--muted)");
    const dp = `M32 128 Q168 128 300 ${F9(128 + d)}`;
    s += `<path d="${dp}" fill="none" stroke="var(--ink)" stroke-width="18.6"/><path d="${dp}" fill="none" stroke="${CART9}" stroke-width="16"/>` + T9(40, 112, L2("Cartilage", "তরুণাস্থি"), "start", 13.5, "var(--ink)", "700") + T9(240, 128 + d + 30 > 190 ? 190 : F9(128 + d + 30), v ? L2("bends", "বেঁকে যায়") : "", "end", 13, "var(--muted)");
    if (v) s += `<line x1="292" y1="${F9(38 - len)}" x2="292" y2="44" stroke="var(--bad)" stroke-width="3" marker-end="url(#b9ar)"/><line x1="292" y1="${F9(128 + d - 14 - len)}" x2="292" y2="${F9(128 + d - 13)}" stroke="var(--bad)" stroke-width="3" marker-end="url(#b9ar)"/>`;
    $("#b9js", el).innerHTML = s + `</svg>`;
    $("#b9jo", el).innerHTML = v === 0 ? L2("Both strips are fixed in a wall at the left. Drag the slider to push down on the free ends with the same force.", "দুটি দণ্ডই বাঁ দিকে দেয়ালে আটকানো। স্লাইডার টেনে দুটির খোলা প্রান্তে সমান জোরে নিচের দিকে চাপ দাও।")
      : L2("<b>Same push, different result.</b> The bone stays straight: mineral salts make it hard, and a force that is too great breaks it instead of bending it. The cartilage bends, and when you take the push away it springs back: it is elastic.", "<b>একই চাপ, ভিন্ন ফল।</b> অস্থি সোজাই থাকে: খনিজ লবণ একে শক্ত করেছে, আর চাপ খুব বেশি হলে এটি বাঁকে না, ভেঙে যায়। তরুণাস্থি বেঁকে যায়, আর চাপ সরিয়ে নিলে আবার আগের অবস্থায় ফেরে: এটি স্থিতিস্থাপক।");
  };
  const drawKind = () => {
    const v = +$("#b9jv", el).value, lbl = $("#b9jv-v", el);
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("How far each kind of joint can move", "কোন ধরনের সন্ধি কতটা নড়তে পারে")}">${arrowDefs("b9ar", "var(--bad)")}`;
    if (kind === "fixed") {
      lbl.textContent = v ? L2("no movement", "নড়ে না") : "";
      let zl = "", zr = "";
      for (let i = 0; i <= 14; i++) { const y = 50 + i * 10, x = i % 2 ? 190 : 171; zl += ` L${x} ${y}`; zr = ` L${x + 3.5} ${y}` + zr; }
      s += `<path d="M30 50${zl} L30 190 Z" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/><path d="M330 190${zr} L330 50 Z" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`;
      s += T9(96, 124, L2("bone", "অস্থি"), "middle", 13, "#1c2330") + T9(264, 124, L2("bone", "অস্থি"), "middle", 13, "#1c2330") + LD9(182, 44, 182, 28) + T9(182, 22, L2("joint (locked edges)", "সন্ধি (আটকানো কিনারা)"), "middle", 13, "var(--ink)", "700");
      if (v) s += `<line x1="96" y1="${F9(180)}" x2="96" y2="${F9(176 - v * 0.34)}" stroke="var(--bad)" stroke-width="3" marker-end="url(#b9ar)" transform="translate(0 0)"/><line x1="264" y1="60" x2="264" y2="${F9(64 + v * 0.34)}" stroke="var(--bad)" stroke-width="3" marker-end="url(#b9ar)"/>` + T9(180, 226, L2("pushed, but nothing moves", "ঠেলা হচ্ছে, তবু কিছুই নড়ছে না"), "middle", 13, "var(--bad)", "700");
      else s += T9(180, 226, L2("two bones of the cranium", "করোটিকার দুটি অস্থি"), "middle", 13, "var(--muted)");
    } else if (kind === "slight") {
      const dl = (v - 50) / 50 * 6;
      lbl.textContent = Math.abs(dl) < 0.3 ? L2("upright", "সোজা") : L2("a little", "সামান্য");
      const vert = `<rect x="-42" y="-13" width="84" height="26" rx="8" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3"/>`;
      let inner = "";
      for (let i = 0; i < 4; i++) inner = `<rect x="-35" y="-26" width="70" height="14" rx="6" fill="${CART9}" stroke="var(--ink)" stroke-width="1" transform="rotate(${F9(dl / 2)} 0 -19)"/><g transform="translate(0 -19) rotate(${F9(dl)}) translate(0 -19)">${vert}${inner}</g>`;
      s += `<g transform="translate(180 216)">${vert}${inner}</g>`;
      s += LD9(296, 150, 220, 178) + T9(354, 140, L2("pad of", "তরুণাস্থির"), "end", 12.5, "var(--ink)") + T9(354, 155, L2("cartilage", "চাকতি"), "end", 12.5, "var(--ink)") + T9(6, 232, L2("vertebra", "কশেরুকা"), "start", 12.5, "var(--ink)") + LD9(60, 228, 138, 218);
    } else if (kind === "hinge") {
      const a = v / 100 * 140, r = a * Math.PI / 180, px = 150, py = 122, sx = Math.sin(r), cx = Math.cos(r);
      lbl.textContent = B9(Math.round(a)) + "°";
      s += `<path d="M150 236 A114 114 0 0 0 ${F9(150 + 114 * Math.sin(140 * Math.PI / 180))} ${F9(122 + 114 * Math.cos(140 * Math.PI / 180))}" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/>`;
      s += bone9(px + sx * 16, py + cx * 16, px + sx * 106, py + cx * 106, 11, BONE9);
      s += bone9(150, 16, 150, 112, 13, BONE9) + `<circle cx="${px}" cy="${py}" r="8" fill="${CART9}" stroke="var(--ink)" stroke-width="1.3"/><circle cx="${px}" cy="${py}" r="2.6" fill="var(--ink)"/>`;
      s += T9(128, 126, L2("hinge", "কবজা"), "end", 13, "var(--ink)", "700") + T9(130, 66, L2("fixed bone", "স্থির অস্থি"), "end", 12.5, "var(--muted)") + T9(352, 206, L2("moves only", "কেবল এই পথ"), "end", 12.5, "var(--muted)") + T9(352, 221, L2("along this arc", "বরাবর নড়ে"), "end", 12.5, "var(--muted)");
    } else {
      const t = v / 100 * 2 * Math.PI, tx = 180 + 100 * Math.cos(t), ty = 196 + 26 * Math.sin(t), dx = tx - 180, dy = ty - 72, L = Math.hypot(dx, dy);
      lbl.textContent = B9(Math.round(v / 100 * 360)) + "°";
      s += `<ellipse cx="180" cy="196" rx="100" ry="26" fill="var(--c-soft)" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="180" y1="72" x2="80" y2="196" stroke="var(--rule)" stroke-width="1.2"/><line x1="180" y1="72" x2="280" y2="196" stroke="var(--rule)" stroke-width="1.2"/>`;
      s += `<rect x="112" y="8" width="136" height="26" rx="9" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3"/><path d="M139 72 A41 41 0 0 1 221 72 L209 72 A29 29 0 0 0 151 72 Z" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`;
      s += bone9(180 + dx / L * 18, 72 + dy / L * 18, tx, ty, 11, BONE9) + `<circle cx="180" cy="72" r="25" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3"/>`;
      s += T9(254, 60, L2("socket", "কোটর"), "start", 13, "var(--ink)", "700") + LD9(250, 56, 216, 56) + T9(106, 80, L2("ball", "বল"), "end", 13, "var(--ink)", "700") + LD9(110, 76, 158, 74) + T9(180, 246, L2("the bone can point anywhere round this circle", "অস্থিটি এই বৃত্তের যেকোনো দিকে যেতে পারে"), "middle", 12.5, "var(--muted)");
    }
    $("#b9js", el).innerHTML = s + `</svg>`;
  };
  const drawIn = () => {
    const on = k => !worn && k === jsel, p = JP.find(q => q[0] === jsel), C = [180, 60];
    const pt = (R, a) => [C[0] + R * Math.cos(a * Math.PI / 180), C[1] + R * Math.sin(a * Math.PI / 180)].map(F9);
    const seg = (R1, R2, a1, a2) => { const A = pt(R1, a1), B = pt(R1, a2), D = pt(R2, a2), E = pt(R2, a1); return `M${A[0]} ${A[1]} A${R1} ${R1} 0 0 0 ${B[0]} ${B[1]} L${D[0]} ${D[1]} A${R2} ${R2} 0 0 1 ${E[0]} ${E[1]} Z`; };
    const bs = on("bone") ? `stroke="var(--bad)" stroke-width="3.5"` : `stroke="var(--ink)" stroke-width="1.3"`;
    let s = `<svg viewBox="0 0 360 290" role="img" aria-label="${L2("A synovial joint cut open", "কাটা অবস্থায় একটি সাইনোভিয়াল অস্থিসন্ধি")}">${PAT}`;
    s += gk("fluid", `<path d="M152 46 C100 54 60 100 108 156 L252 156 C300 100 260 54 208 46 Z" fill="${worn ? "var(--paper)" : on("fluid") ? "var(--bad)" : FLU9}"/>`);
    s += gk("lig", thin9("M210 30 C276 44 316 104 256 172", on("lig") ? 8 : 6, on("lig") ? "var(--bad)" : LIG9));
    s += gk("caps", thin9("M152 46 C100 54 60 100 108 156", on("caps") ? 7 : 5, on("caps") ? "var(--bad)" : "#b98b4f") + thin9("M208 46 C260 54 300 100 252 156", on("caps") ? 7 : 5, on("caps") ? "var(--bad)" : "#b98b4f"));
    s += gk("memb", ["M155 52 C107 60 69 100 111 150", "M205 52 C253 60 291 100 249 150"].map(d => `<path d="${d}" fill="none" stroke="${on("memb") ? "var(--bad)" : "#e07a8a"}" stroke-width="${on("memb") ? 4.5 : 2.8}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="transparent" stroke-width="10"/>`).join(""));
    if (!worn) s += gk("cart", `<path d="${seg(92, 100, 150, 30)}" fill="${on("cart") ? "var(--bad)" : CART9}" stroke="var(--ink)" stroke-width="1"/><path d="${seg(74, 82, 140, 40)}" fill="${on("cart") ? "var(--bad)" : CART9}" stroke="var(--ink)" stroke-width="1"/>`);
    const A = pt(74, 140), B = pt(74, 40), A2 = pt(65, 138), B2 = pt(65, 42), S1 = pt(100, 152), S2 = pt(100, 28), I1 = pt(109, 128), I2 = pt(109, 52);
    s += gk("bone", `<g${worn ? ` transform="translate(0 26)"` : ""}><path d="M152 -30 L152 60 C152 84 126 88 ${A[0]} ${A[1]} A74 74 0 0 0 ${B[0]} ${B[1]} C234 88 208 84 208 60 L208 -30 Z" fill="${BONE9}" ${bs}/><path d="M162 -30 L162 62 C162 88 134 90 ${A2[0]} ${A2[1]} A65 65 0 0 0 ${B2[0]} ${B2[1]} C226 90 198 88 198 62 L198 -30 Z" fill="url(#b9sp)" stroke="#a8946c" stroke-width="1"/></g>`
      + `<path d="M${S1[0]} ${S1[1]} A100 100 0 0 0 ${S2[0]} ${S2[1]} C270 150 212 176 212 222 L212 292 L148 292 L148 222 C148 176 90 150 ${S1[0]} ${S1[1]} Z" fill="${BONE9}" ${bs}/><path d="M${I1[0]} ${I1[1]} A109 109 0 0 0 ${I2[0]} ${I2[1]} C244 166 203 182 203 224 L203 292 L157 292 L157 224 C157 182 116 166 ${I1[0]} ${I1[1]} Z" fill="url(#b9sp)" stroke="#a8946c" stroke-width="1"/>`
      + `<path d="M149.6 0 V34 M210.4 0 V20 M145.6 236 V290 M214.4 236 V290" fill="none" stroke="#8c6a3f" stroke-width="3.4"/>`);
    if (worn) s += [[180, 161], [146, 153], [214, 153]].map(([x, y]) => `<path d="M${x - 11} ${y + 3} l5 -7 l4 8 l4 -9 l4 8 l5 -6" fill="none" stroke="var(--bad)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`).join("") + T9(180, 246, L2("bone rubs on bone", "অস্থির সাথে অস্থির ঘষা"), "middle", 13.5, "var(--bad)", "700", true);
    else s += lab(p[3], p[4], p[5], p[6], p[1]);
    $("#b9js", el).innerHTML = s + `</svg>`;
    $("#b9jx", el).innerHTML = worn ? "" : partChips("b9jp", JP, jsel);
    $("#b9jo", el).innerHTML = worn ? L2("<b>Cartilage and fluid taken away.</b> Now the bare bone ends touch. Every movement grinds bone against bone: friction is high, the ends wear away, moving takes more energy and it hurts. This is why a healthy joint needs both its cartilage and its synovial fluid.", "<b>তরুণাস্থি ও রস সরিয়ে নেওয়া হয়েছে।</b> এখন অস্থির খালি প্রান্ত দুটো একটি আরেকটিকে ছুঁয়ে আছে। প্রতিবার নড়াচড়ায় অস্থির সাথে অস্থির ঘষা লাগে: ঘর্ষণ বেশি, প্রান্ত ক্ষয়ে যায়, নাড়াতে বেশি শক্তি লাগে, ব্যথাও হয়। এ কারণেই সুস্থ সন্ধিতে তরুণাস্থি ও সাইনোভিয়াল রস দুটোই দরকার।") : `<b>${p[1]}.</b> ${p[2]}`;
    if (!worn) { bindParts($("#b9js", el), "", k => { jsel = k; drawIn(); }); chips9(el, ".b9jp", q => { jsel = q.dataset.k; drawIn(); }); }
  };
  const drawTis = () => {
    $("#b9jx", el).innerHTML = "";
    if (tis === "bend") { $("#b9jx", el).innerHTML = slider("b9jf", L2("Push on the free ends", "খোলা প্রান্তে চাপ"), 0, 100, 1, 0, ""); $("#b9jf", el).addEventListener("input", drawBend); drawBend(); }
    else if (tis === "bone") drawBone(); else drawCart();
  };
  const setTab = () => {
    const b = $("#b9jb", el); auto = false;
    if (tab === "tis") {
      b.innerHTML = `<div class="chipset b9jm" role="group"><button data-m="bone" aria-pressed="${tis === "bone"}">${L2("Bone", "অস্থি")}</button><button data-m="cart" aria-pressed="${tis === "cart"}">${L2("Cartilage", "তরুণাস্থি")}</button><button data-m="bend" aria-pressed="${tis === "bend"}">${L2("Bending test", "বাঁকানোর পরীক্ষা")}</button></div><div class="svgwrap fit" id="b9js" style="margin-top:8px"></div><div id="b9jx"></div><div class="w-out" id="b9jo" style="margin-top:8px"></div>`;
      chips9(el, ".b9jm", q => { tis = q.dataset.m; drawTis(); }); drawTis();
    } else if (tab === "kinds") {
      b.innerHTML = `<div class="chipset b9jk" role="group">${KN.map(q => `<button data-k="${q[0]}" aria-pressed="${q[0] === kind}">${q[1]}</button>`).join("")}</div><div class="svgwrap fit" id="b9js" style="margin-top:8px"></div>${slider("b9jv", L2("Try to move it", "নাড়ানোর চেষ্টা করো"), 0, 100, 1, kind === "slight" ? 50 : 30, "")}${REDUCED ? "" : `<div class="w-row"><button class="btn" id="b9ja">${L2("Move it for me", "নিজে নিজে নড়ুক")}</button></div>`}<div class="w-out" id="b9jo" style="margin-top:8px"></div>`;
      const out = () => { $("#b9jo", el).innerHTML = KN.find(q => q[0] === kind)[2]; };
      chips9(el, ".b9jk", q => { kind = q.dataset.k; $("#b9jv", el).value = kind === "slight" ? 50 : 30; ph = 0; out(); drawKind(); });
      $("#b9jv", el).addEventListener("input", () => { auto = false; const a = $("#b9ja", el); if (a) a.classList.remove("solid"); drawKind(); });
      const a = $("#b9ja", el); if (a) a.addEventListener("click", () => { auto = !auto; a.classList.toggle("solid", auto); ph = 0; });
      out(); drawKind();
    } else {
      b.innerHTML = `<div class="chipset b9jw" role="group"><button data-w="0" aria-pressed="${!worn}">${L2("Healthy joint", "সুস্থ সন্ধি")}</button><button data-w="1" aria-pressed="${worn}">${L2("Without cartilage and fluid", "তরুণাস্থি ও রস ছাড়া")}</button></div><div class="svgwrap fit" id="b9js" style="margin-top:8px"></div><div id="b9jx"></div><div class="w-out" id="b9jo" style="margin-top:8px"></div>`;
      chips9(el, ".b9jw", q => { worn = q.dataset.w === "1"; drawIn(); }); drawIn();
    }
  };
  chips9(el, ".b9jt", b => { tab = b.dataset.v; setTab(); });
  setTab();
  if (!REDUCED) animate(el, dt => {
    if (!auto || tab !== "kinds") return;
    const sl = $("#b9jv", el); if (!sl) return;
    ph += dt;
    sl.value = kind === "ball" ? (ph * 22) % 100 : 50 - 50 * Math.cos(ph * 1.6);
    drawKind();
  });
};

/* 9.2 muscles: biceps-triceps arm, tendon v ligament stretch test, which-muscle quiz */
W.b9arm = (el) => {
  const E = [120, 165], B0 = [134, 58], T0 = [107, 56], V = [105, 146], ACT = "#b83a30", REL = "#eaa79d";
  const QZ = [
    [L2("Lifting a school bag", "স্কুলব্যাগ তোলা"), 0, 0], [L2("The heart beating", "হৃৎপিণ্ডের স্পন্দন"), 0, 2], [L2("Food being pushed along the intestine", "অন্ত্রের ভেতর দিয়ে খাদ্য এগিয়ে যাওয়া"), 0, 1],
    [L2("Kicking a football", "ফুটবলে লাথি মারা"), 0, 0], [L2("The wall of a blood vessel tightening", "রক্তনালির প্রাচীর সংকুচিত হওয়া"), 0, 1], [L2("Writing with a pen", "কলম দিয়ে লেখা"), 0, 0],
    [L2("You bend your elbow to lift a cup. Which muscle contracts?", "কাপ তুলতে তুমি কনুই ভাঁজ করলে। কোন পেশি সংকুচিত হয়?"), 1, 0], [L2("You push a door open, straightening your elbow. Which muscle contracts?", "কনুই সোজা করে দরজা ঠেলে খুললে। কোন পেশি সংকুচিত হয়?"), 1, 1],
    [L2("It joins the calf muscle to the heel bone.", "এটি পায়ের ডিমের পেশিকে গোড়ালির হাড়ের সাথে যুক্ত করে।"), 2, 0], [L2("It joins the femur to the tibia at the knee.", "এটি হাঁটুতে ফিমারকে টিবিয়ার সাথে যুক্ত করে।"), 2, 1],
    [L2("Its fibres lie in parallel bundles and it hardly stretches.", "এর তন্তু সমান্তরাল আঁটিতে সাজানো, আর এটি প্রায় লম্বা হয়ই না।"), 2, 0], [L2("It has many yellow elastic fibres spread like a net.", "এতে জালের মতো ছড়ানো অনেক পীত স্থিতিস্থাপক তন্তু থাকে।"), 2, 1]];
  const OPT = [[L2("Voluntary muscle", "ঐচ্ছিক পেশি"), L2("Involuntary muscle", "অনৈচ্ছিক পেশি"), L2("Cardiac muscle", "হৃৎপেশি")], [L2("Biceps", "বাইসেপস"), L2("Triceps", "ট্রাইসেপস")], [L2("Tendon", "টেন্ডন"), L2("Ligament", "লিগামেন্ট")]];
  const WHY = [[L2("Muscles fixed to the bones work at our will: these are voluntary (skeletal) muscles.", "অস্থিতে লাগানো পেশি আমাদের ইচ্ছায় কাজ করে: এগুলো ঐচ্ছিক (কঙ্কাল) পেশি।"), L2("The muscles of the inner organs and blood vessels work by themselves: these are involuntary muscles.", "অভ্যন্তরীণ অঙ্গ ও রক্তনালির পেশি নিজে নিজে কাজ করে: এগুলো অনৈচ্ছিক পেশি।"), L2("The heart is made of cardiac muscle, which works without rest and not at our will.", "হৃৎপিণ্ড হৃৎপেশি দিয়ে তৈরি; এটি বিশ্রাম ছাড়া কাজ করে, আমাদের ইচ্ছার অধীন নয়।")],
    [L2("To bend the elbow the biceps contracts and the triceps relaxes.", "কনুই ভাঁজ করতে বাইসেপস সংকুচিত হয়, ট্রাইসেপস শিথিল হয়।"), L2("To straighten the elbow the triceps contracts and the biceps relaxes.", "কনুই সোজা করতে ট্রাইসেপস সংকুচিত হয়, বাইসেপস শিথিল হয়।")],
    [L2("A tendon joins muscle to bone; its white fibres lie in parallel bundles and its elasticity is low.", "টেন্ডন পেশিকে অস্থির সাথে যুক্ত করে; এর শ্বেততন্তু সমান্তরাল আঁটিতে থাকে, স্থিতিস্থাপকতা কম।"), L2("A ligament joins bone to bone; it has white and yellow fibres spread like a net and is more elastic.", "লিগামেন্ট অস্থিকে অস্থির সাথে যুক্ত করে; এতে শ্বেত ও পীত তন্তু জালের মতো ছড়ানো, স্থিতিস্থাপকতা বেশি।")]];
  let tab = "arm", th = 60, dir = 1, goal = null, qi = 0, order = [], score = 0, picked = -1;
  el.innerHTML = `<div class="chipset b9at" role="group"><button data-v="arm" aria-pressed="true">${B9(1)}. ${L2("Bend and straighten", "ভাঁজ ও সোজা")}</button><button data-v="tl" aria-pressed="false">${B9(2)}. ${L2("Tendon or ligament?", "টেন্ডন না লিগামেন্ট?")}</button><button data-v="quiz" aria-pressed="false">${B9(3)}. ${L2("Which muscle?", "কোন পেশি?")}</button></div><div id="b9ab" style="margin-top:8px"></div>`;
  const belly = (p, q, w, side, col) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), nx = -dy / L * side, ny = dx / L * side; return `<path d="M${F9(p[0])} ${F9(p[1])} Q${F9(mx + nx * w)} ${F9(my + ny * w)} ${F9(q[0])} ${F9(q[1])} Q${F9(mx - nx * w * 0.25)} ${F9(my - ny * w * 0.25)} ${F9(p[0])} ${F9(p[1])} Z" fill="${col}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>`; };
  const drawArm = () => {
    const r = th * Math.PI / 180, u = [Math.sin(r), Math.cos(r)], a = [Math.cos(r), -Math.sin(r)], c = (th - 10) / 120;
    const P = (lu, la) => [E[0] + u[0] * lu + a[0] * la, E[1] + u[1] * lu + a[1] * la];
    const Ib = P(24, 7), O = P(-12, -8), Be = [B0[0] + (Ib[0] - B0[0]) * 0.86, B0[1] + (Ib[1] - B0[1]) * 0.86], f = 0.74 + 0.22 * c, Te = [T0[0] + (V[0] - T0[0]) * f, T0[1] + (V[1] - T0[1]) * f];
    const bic = dir > 0, Lb = Math.hypot(Be[0] - B0[0], Be[1] - B0[1]), Lt = Math.hypot(Te[0] - T0[0], Te[1] - T0[1]);
    $("#b9ah-v", el).textContent = B9(Math.round(th)) + "°";
    let s = `<svg viewBox="0 0 360 296" role="img" aria-label="${L2("Biceps and triceps moving the forearm", "বাইসেপস ও ট্রাইসেপস নিচের বাহু নাড়াচ্ছে")}">`;
    s += `<path d="M84 12 L152 20 L158 42 L128 52 L102 46 Z" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"/>` + bone9(120, 46, 120, 158, 11, BONE9);
    const u1 = P(100, -5), r0 = P(13, 6), r1 = P(100, 6), h0 = P(106, 0), h1 = P(122, 0);
    s += bone9(O[0], O[1], u1[0], u1[1], 6, BONE9) + bone9(r0[0], r0[1], r1[0], r1[1], 5, BONE9);
    s += `<line x1="${F9(h0[0])}" y1="${F9(h0[1])}" x2="${F9(h1[0])}" y2="${F9(h1[1])}" stroke="var(--ink)" stroke-width="18.6" stroke-linecap="round"/><line x1="${F9(h0[0])}" y1="${F9(h0[1])}" x2="${F9(h1[0])}" y2="${F9(h1[1])}" stroke="${BONE9}" stroke-width="16" stroke-linecap="round"/>`;
    s += `<circle cx="${E[0]}" cy="${E[1]}" r="7" fill="${CART9}" stroke="var(--ink)" stroke-width="1.3"/><circle cx="${E[0]}" cy="${E[1]}" r="2.2" fill="var(--ink)"/>`;
    s += thin9(`M112 36 L${T0[0]} ${T0[1]}`, 2.4, TEN9) + thin9(`M${F9(Te[0])} ${F9(Te[1])} L${V[0]} ${V[1]} L${F9(O[0])} ${F9(O[1])}`, 2.4, TEN9) + belly(T0, Te, 34 - 22 * c, 1, bic ? REL : ACT);
    s += thin9(`M130 38 L${B0[0]} ${B0[1]}`, 2.4, TEN9) + thin9(`M${F9(Be[0])} ${F9(Be[1])} L${F9(Ib[0])} ${F9(Ib[1])}`, 2.4, TEN9) + belly(B0, Be, 14 + 30 * c, -1, bic ? ACT : REL);
    const rm = P(62, 20), um = P(58, -19);
    s += T9(F9(rm[0]), F9(rm[1] + 4), L2("radius", "রেডিয়াস"), "middle", 12.5, "var(--ink)", "", true) + T9(F9(um[0]), F9(um[1] + 4), L2("ulna", "আলনা"), "middle", 12.5, "var(--ink)", "", true);
    s += LD9(246, 34, 146, 76) + T9(250, 30, L2("Biceps", "বাইসেপস"), "start", 14, "var(--ink)", "700") + T9(250, 47, bic ? L2("contracts", "সংকুচিত") : L2("relaxes", "শিথিল"), "start", 13, bic ? ACT : "var(--muted)", bic ? "700" : "");
    s += LD9(72, 92, 98, 96) + T9(68, 90, L2("Triceps", "ট্রাইসেপস"), "end", 14, "var(--ink)", "700") + T9(68, 107, bic ? L2("relaxes", "শিথিল") : L2("contracts", "সংকুচিত"), "end", 13, bic ? "var(--muted)" : ACT, bic ? "" : "700");
    s += T9(170, 16, L2("scapula", "স্ক্যাপুলা"), "start", 12.5, "var(--muted)") + LD9(166, 14, 150, 24) + T9(70, 44, L2("humerus", "হিউমেরাস"), "end", 12.5, "var(--muted)") + LD9(74, 41, 119, 49) + T9(56, 186, L2("tendon", "টেন্ডন"), "end", 12.5, "var(--muted)") + LD9(60, 182, 103, 152);
    $("#b9as", el).innerHTML = s + `</svg>`;
    const bar = (name, L, mx, on) => `<span>${name}</span><div style="height:12px;border-radius:6px;width:${Math.round(L / mx * 100)}%;background:${on ? ACT : REL};border:1px solid var(--ink)"></div>`;
    $("#b9ao", el).innerHTML = (bic ? L2("<b>Bending.</b> The biceps contracts: it becomes shorter and thicker and pulls the radius and ulna towards the humerus. The triceps relaxes and is stretched.", "<b>ভাঁজ হচ্ছে।</b> বাইসেপস সংকুচিত হয়: খাটো ও মোটা হয়ে রেডিয়াস ও আলনাকে হিউমেরাসের দিকে টানে। ট্রাইসেপস শিথিল হয়ে প্রসারিত হয়।")
      : L2("<b>Straightening.</b> The triceps contracts: it becomes shorter and thicker and pulls on the ulna, so the forearm swings back until it is almost in line with the humerus. The biceps relaxes and is stretched.", "<b>সোজা হচ্ছে।</b> ট্রাইসেপস সংকুচিত হয়: খাটো ও মোটা হয়ে আলনাকে টানে, ফলে নিচের বাহু ফিরে গিয়ে হিউমেরাসের সাথে প্রায় এক সরলরেখায় আসে। বাইসেপস শিথিল হয়ে প্রসারিত হয়।"))
      + `<div style="display:grid;grid-template-columns:auto 1fr;gap:5px 10px;align-items:center;font-size:14px;margin-top:8px"><span class="muted" style="grid-column:1/-1">${L2("Length of each muscle now:", "এখন প্রতিটি পেশির দৈর্ঘ্য:")}</span>${bar(L2("Biceps", "বাইসেপস"), Lb, 130, bic)}${bar(L2("Triceps", "ট্রাইসেপস"), Lt, 88, !bic)}</div>`;
  };
  const drawTL = () => {
    const v = +$("#b9ap", el).value, lt = 100 + v * 0.03, ll = 100 + v * 0.3, al = 6 + v * 0.22;
    $("#b9ap-v", el).textContent = v === 0 ? L2("no pull", "টান নেই") : v < 50 ? L2("gentle pull", "হালকা টান") : L2("hard pull", "জোরে টান");
    let s = `<svg viewBox="0 0 360 262" role="img" aria-label="${L2("Stretching a tendon and a ligament with the same pull", "একই টানে টেন্ডন ও লিগামেন্ট টানা")}">${arrowDefs("b9ar", "var(--bad)")}`;
    const blk = (x, y, col, t) => `<rect x="${x - 40}" y="${F9(y)}" width="80" height="30" rx="8" fill="${col}" stroke="var(--ink)" stroke-width="1.3"/>` + T9(x, F9(y + 20), t, "middle", 13, col === BONE9 ? "#1c2330" : "#ffffff", "700");
    s += T9(95, 16, L2("Tendon", "টেন্ডন"), "middle", 14.5, "var(--ink)", "700") + T9(265, 16, L2("Ligament", "লিগামেন্ট"), "middle", 14.5, "var(--ink)", "700");
    s += `<line x1="20" y1="162" x2="340" y2="162" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>`;
    s += `<rect x="80" y="60" width="30" height="${F9(lt + 2)}" fill="${TEN9}" stroke="var(--ink)" stroke-width="1.3"/>` + [85, 90, 95, 100, 105].map(x => `<line x1="${x}" y1="62" x2="${x}" y2="${F9(60 + lt)}" stroke="#a79f86" stroke-width="1.4"/>`).join("");
    let net = ""; const n = 7, h = ll / n;
    for (let i = 0; i < n; i++) { const y0 = 61 + i * h, y1 = 61 + (i + 1) * h; net += `<path d="M252 ${F9(y0)} L278 ${F9(y1)} M278 ${F9(y0)} L252 ${F9(y1)} M265 ${F9(y0)} L${i % 2 ? 252 : 278} ${F9((y0 + y1) / 2)}" fill="none" stroke="#a8791c" stroke-width="1.4"/>`; }
    s += `<rect x="250" y="60" width="30" height="${F9(ll + 2)}" fill="#f3dd9c" stroke="var(--ink)" stroke-width="1.3"/>` + net;
    s += blk(95, 30, MUS9, L2("muscle", "পেশি")) + blk(265, 30, BONE9, L2("bone", "অস্থি")) + blk(95, 60 + lt, BONE9, L2("bone", "অস্থি")) + blk(265, 60 + ll, BONE9, L2("bone", "অস্থি"));
    if (v) s += `<line x1="95" y1="${F9(94 + lt)}" x2="95" y2="${F9(94 + lt + al)}" stroke="var(--bad)" stroke-width="3" marker-end="url(#b9ar)"/><line x1="265" y1="${F9(94 + ll)}" x2="265" y2="${F9(94 + ll + al)}" stroke="var(--bad)" stroke-width="3" marker-end="url(#b9ar)"/>`;
    s += T9(180, 120, L2("same", "একই"), "middle", 12.5, "var(--muted)") + T9(180, 135, L2("pull", "টান"), "middle", 12.5, "var(--muted)");
    s += T9(8, 254, v ? L2("hardly stretches", "প্রায় লম্বা হয় না") : "", "start", 13, "var(--ink)", "700") + T9(352, 254, v ? L2("stretches, springs back", "লম্বা হয়, আবার ফেরে") : "", "end", 13, "var(--ink)", "700");
    $("#b9as", el).innerHTML = s + `</svg>`;
    $("#b9ao", el).innerHTML = `<div class="tablewrap"><table class="cmp"><thead><tr><th></th><th>${L2("Tendon", "টেন্ডন")}</th><th>${L2("Ligament", "লিগামেন্ট")}</th></tr></thead><tbody><tr><td><b>${L2("Joins", "যুক্ত করে")}</b></td><td>${L2("muscle to bone", "পেশিকে অস্থির সাথে")}</td><td>${L2("bone to bone", "অস্থিকে অস্থির সাথে")}</td></tr><tr><td><b>${L2("Fibres", "তন্তু")}</b></td><td>${L2("white fibres in parallel bundles", "শ্বেততন্তু, সমান্তরাল আঁটিতে")}</td><td>${L2("white and yellow fibres, like a net", "শ্বেত ও পীত তন্তু, জালের মতো")}</td></tr><tr><td><b>${L2("Elasticity", "স্থিতিস্থাপকতা")}</b></td><td>${L2("low", "কম")}</td><td>${L2("comparatively high", "তুলনামূলক বেশি")}</td></tr><tr><td><b>${L2("Work", "কাজ")}</b></td><td>${L2("passes the muscle's pull to the bone", "পেশির টান অস্থিতে পৌঁছে দেয়")}</td><td>${L2("holds the bones in place at a joint", "সন্ধিতে অস্থিকে জায়গামতো ধরে রাখে")}</td></tr></tbody></table></div><span class="muted" style="font-size:13px">${L2("The amount of stretch is exaggerated so that you can see it.", "বোঝার সুবিধার জন্য লম্বা হওয়াটা বাড়িয়ে দেখানো হয়েছে।")}</span>`;
  };
  const drawQuiz = () => {
    const b = $("#b9ab", el);
    if (qi >= order.length) { b.innerHTML = `<div class="w-out"><b>${L2("Finished!", "শেষ!")}</b> ${L2("Your score", "তোমার স্কোর")}: ${B9(score)}/${B9(order.length)}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b9ar2">${L2("Play again", "আবার খেলো")}</button></div>`; $("#b9ar2", el).addEventListener("click", startQuiz); return; }
    const q = QZ[order[qi]], ops = OPT[q[1]];
    b.innerHTML = `<div class="w-row"><span class="muted" style="font-size:14px">${B9(qi + 1)}/${B9(order.length)}</span><span class="muted" style="margin-left:auto;font-size:14px">${L2("Score", "স্কোর")}: ${B9(score)}</span></div><div class="w-out" style="margin-top:6px;font-size:18px">${q[0]}</div><div class="w-row" style="margin-top:8px">${ops.map((o, i) => `<button class="btn${picked >= 0 && i === q[2] ? " done" : ""}" data-o="${i}"${picked >= 0 ? " disabled" : ""}${picked === i && i !== q[2] ? ` style="border-color:var(--bad);color:var(--bad)"` : ""}>${o}</button>`).join("")}</div>${picked >= 0 ? `<div class="w-out" style="margin-top:8px"><b style="color:${picked === q[2] ? "var(--good)" : "var(--bad)"}">${picked === q[2] ? L2("Correct.", "ঠিক।") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${WHY[q[1]][q[2]]}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b9an">${L2("Next", "পরেরটি")}</button></div>` : ""}`;
    b.querySelectorAll("button[data-o]").forEach(x => x.addEventListener("click", () => { if (picked >= 0) return; picked = +x.dataset.o; if (picked === q[2]) score++; drawQuiz(); }));
    const n = $("#b9an", el); if (n) n.addEventListener("click", () => { qi++; picked = -1; drawQuiz(); });
  };
  const startQuiz = () => { order = QZ.map((_, i) => i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } order = order.slice(0, 8); qi = 0; score = 0; picked = -1; drawQuiz(); };
  const setTab = () => {
    const b = $("#b9ab", el); goal = null;
    if (tab === "arm") {
      b.innerHTML = `<div class="svgwrap fit" id="b9as"></div>${slider("b9ah", L2("How far the elbow is bent", "কনুই কতটা ভাঁজ"), 10, 130, 1, th, "")}<div class="w-row"><button class="btn" id="b9a1">${L2("Bend", "ভাঁজ করো")}</button><button class="btn" id="b9a2">${L2("Straighten", "সোজা করো")}</button></div><div class="w-out" id="b9ao" style="margin-top:8px"></div>`;
      $("#b9ah", el).addEventListener("input", () => { const v = +$("#b9ah", el).value; if (v !== th) dir = v > th ? 1 : -1; th = v; goal = null; drawArm(); });
      const go = (g, d) => { dir = d; if (REDUCED) { th = g; $("#b9ah", el).value = th; goal = null; } else goal = g; drawArm(); };
      $("#b9a1", el).addEventListener("click", () => go(130, 1)); $("#b9a2", el).addEventListener("click", () => go(10, -1));
      drawArm();
    } else if (tab === "tl") {
      b.innerHTML = `<div class="svgwrap fit" id="b9as"></div>${slider("b9ap", L2("Pull on both", "দুটোকেই টানো"), 0, 100, 1, 0, "")}<div id="b9ao" style="margin-top:8px"></div>`;
      $("#b9ap", el).addEventListener("input", drawTL); drawTL();
    } else startQuiz();
  };
  chips9(el, ".b9at", b => { tab = b.dataset.v; setTab(); });
  setTab();
  if (!REDUCED) animate(el, dt => {
    if (goal == null || tab !== "arm") return;
    const sl = $("#b9ah", el); if (!sl) return;
    const d = goal - th, st = 80 * dt;
    if (Math.abs(d) <= st) { th = goal; goal = null; } else th += Math.sign(d) * st;
    sl.value = th; drawArm();
  });
};

/* 9.3 diseases of bones and joints: bone bank over a lifetime, healthy v diseased, which-disease clues */
W.b9bonecare = (el) => {
  const HAB = [["food", L2("Calcium and vitamin D food", "ক্যালসিয়াম ও ভিটামিন ডি-যুক্ত খাবার")], ["sun", L2("Sunlight", "সূর্যের আলো")], ["ex", L2("Regular exercise", "নিয়মিত ব্যায়াম")]];
  const DIS = {
    op: [L2("Osteoporosis", "অস্টিওপোরোসিস"), [
      UL9([L2("Caused by a shortage of mineral salts, especially calcium.", "খনিজ লবণ, বিশেষ করে ক্যালসিয়ামের ঘাটতিতে হয়।"), L2("Usually seen in elderly men and women.", "সাধারণত বয়স্ক পুরুষ ও নারীদের হয়।"), L2("Higher risk: women after menopause; elderly men who have taken steroid medicines for a long time; an idle life; long-standing arthritis.", "ঝুঁকি বেশি: মেনোপজের পর নারী; বহুদিন স্টেরয়েডযুক্ত ঔষধ সেবনকারী বয়স্ক পুরুষ; অলস জীবন; দীর্ঘদিনের আর্থ্রাইটিস।")]),
      UL9([L2("Bones become brittle and their density falls.", "অস্থি ভঙ্গুর হয়, ঘনত্ব কমে।"), L2("Muscles become weaker.", "পেশির শক্তি কমে।"), L2("Pain in the back and in the bones.", "পিঠে ও অস্থিতে ব্যথা।"), L2("Early stage: hardly any sign; a bone may break suddenly after a slight knock.", "প্রাথমিক অবস্থায় তেমন উপসর্গ থাকে না; সামান্য আঘাতে হঠাৎ হাড় ভাঙতে পারে।"), L2("Found by measuring bone density.", "অস্থির ঘনত্ব মেপে রোগ ধরা হয়।")]),
      UL9([L2("After fifty: 1200 mg of calcium a day, or the amount the doctor advises.", "পঞ্চাশের পর: দৈনিক ১২০০ mg ক্যালসিয়াম, অথবা চিকিৎসক যা বলেন।"), L2("Skimmed milk and milk products.", "ননিতোলা দুধ ও দুগ্ধজাত খাবার।"), L2("Orange juice, green leafy vegetables, soya products and other calcium-rich food.", "কমলার রস, সবুজ শাকসবজি, সয়াজাত খাবার ও অন্যান্য ক্যালসিয়াম-সমৃদ্ধ খাবার।")]),
      UL9([L2("Get enough sunlight.", "যথেষ্ট সূর্যালোক গায়ে লাগানো।"), L2("Eat food rich in calcium and vitamin D.", "ক্যালসিয়াম ও ভিটামিন ডি-সমৃদ্ধ খাবার খাওয়া।"), L2("Exercise regularly (with osteoporosis, ask a doctor first).", "নিয়মিত ব্যায়াম করা (রোগ থাকলে আগে চিকিৎসকের পরামর্শ)।"), L2("Eat balanced, fibre-rich food.", "সুষম ও আঁশযুক্ত খাবার খাওয়া।")])]],
    ra: [L2("Rheumatoid arthritis", "রিউমাটয়েড আর্থ্রাইটিস"), [
      UL9([L2("One of more than a hundred kinds of arthritis (joint inflammation).", "শতাধিক রকম আর্থ্রাইটিসের (সন্ধির প্রদাহ) একটি।"), L2("Your book: usually attacks older people.", "বই অনুযায়ী: সাধারণত বয়স্করা আক্রান্ত হন।"), L2("Joint pain in children may instead be a sign of rheumatic fever.", "শিশুদের গিঁটে ব্যথা বাতজ্বরের লক্ষণ হতে পারে।"), L2("Different joint diseases need different treatment, so a doctor must decide.", "ভিন্ন ভিন্ন সন্ধির রোগে চিকিৎসা ভিন্ন, তাই সিদ্ধান্ত নেবেন চিকিৎসক।")]),
      UL9([L2("Inflammation and pain in the joints.", "অস্থিসন্ধিতে প্রদাহ ও ব্যথা।"), L2("The joints become stiff.", "অস্থিসন্ধি শক্ত হয়ে যায়।"), L2("It hurts to move them.", "নাড়াতে গেলে ব্যথা লাগে।"), L2("The joints swell.", "গিঁট ফুলে যায়।")]),
      UL9([L2("Not fully curable in the elderly, but relief is possible.", "বয়স্কদের পুরোপুরি সারে না, তবে উপশম হয়।"), L2("Avoid too much hard work and heavy lifting.", "অত্যধিক পরিশ্রম ও ভারী কাজ থেকে বিরত থাকা।"), L2("Lukewarm warmth on the painful joint.", "ব্যথার গিঁটে কুসুম গরম সেঁক।"), L2("Light exercise to keep the joint moving.", "সন্ধি সচল রাখতে হালকা ব্যায়াম।"), L2("Pain-relieving medicine and treatment only as the doctor advises.", "চিকিৎসকের পরামর্শমতো বেদনানাশক ঔষধ ও চিকিৎসা।")]),
      UL9([L2("Regular exercise in the way the doctor advises.", "চিকিৎসকের নির্দেশিত পদ্ধতিতে নিয়মিত ব্যায়াম।"), L2("Balanced, fibre-rich food.", "সুষম ও আঁশযুক্ত খাদ্য।")])]]
  };
  const INF = [L2("Who and why", "কাদের, কেন"), L2("Symptoms", "লক্ষণ"), L2("Remedy", "প্রতিকার"), L2("Prevention", "প্রতিরোধ")];
  const QZ = [
    [L2("The density of the bones falls and they become brittle.", "অস্থির ঘনত্ব কমে যায়, অস্থি ভঙ্গুর হয়ে পড়ে।"), 0], [L2("The joints are swollen, painful and stiff.", "গিঁট ফুলে যায়, ব্যথা করে, শক্ত হয়ে যায়।"), 1],
    [L2("Often there is no sign until a bone breaks after a slight fall.", "অনেক সময় সামান্য পড়ে গিয়ে হাড় ভাঙার আগে কোনো লক্ষণই থাকে না।"), 0], [L2("Lukewarm warmth on the painful joint gives some relief.", "ব্যথার গিঁটে কুসুম গরম সেঁক দিলে কিছুটা আরাম হয়।"), 1],
    [L2("It is found by measuring the density of the bone.", "অস্থির ঘনত্ব মেপে রোগটি ধরা হয়।"), 0], [L2("After fifty, 1200 mg of calcium a day (or as the doctor advises) is recommended.", "পঞ্চাশের পর দৈনিক ১২০০ mg ক্যালসিয়াম (বা চিকিৎসকের পরামর্শমতো) নিতে বলা হয়।"), 0],
    [L2("Regular exercise and balanced, fibre-rich food help to prevent it.", "নিয়মিত ব্যায়াম আর সুষম, আঁশযুক্ত খাবার এটি প্রতিরোধে সাহায্য করে।"), 2], [L2("Women after menopause are at higher risk.", "মেনোপজের পর নারীদের ঝুঁকি বেশি।"), 0],
    [L2("It is one of more than a hundred kinds of joint disease.", "এটি শতাধিক রকম সন্ধির রোগের একটি।"), 1], [L2("Enough sunlight helps to prevent it.", "যথেষ্ট সূর্যালোক এটি প্রতিরোধে সাহায্য করে।"), 0],
    [L2("Heavy work should be avoided, but light exercise keeps the joint moving.", "ভারী কাজ বাদ দিতে হয়, তবে হালকা ব্যায়াম সন্ধিকে সচল রাখে।"), 1], [L2("It is seen mostly in older people.", "এটি বেশির ভাগ বয়স্ক মানুষের হয়।"), 2]];
  const QO = [L2("Osteoporosis", "অস্টিওপোরোসিস"), L2("Rheumatoid arthritis", "রিউমাটয়েড আর্থ্রাইটিস"), L2("Both", "দুটোই")];
  const QW = [L2("This is about the bones: osteoporosis.", "এটি অস্থির ব্যাপার: অস্টিওপোরোসিস।"), L2("This is about the joints: rheumatoid arthritis.", "এটি অস্থিসন্ধির ব্যাপার: রিউমাটয়েড আর্থ্রাইটিস।"), L2("Your book says this for both diseases.", "বইয়ে দুটো রোগের জন্যই এ কথা বলা আছে।")];
  let tab = "bank", hab = { food: true, sun: true, ex: true }, sex = "f", dz = "op", inf = 0, qi = 0, order = [], score = 0, picked = -1;
  const dens = (age, h, sx) => { const P = 60 + h * 40 / 3, r = 0.35 + 0.15 * (3 - h); let d = age <= 28 ? P * (0.22 + 0.78 * Math.sin(Math.PI / 2 * age / 28)) : P; if (age > 40) d -= (age - 40) * r; if (sx === "f" && age > 50) d -= Math.min(age - 50, 10) * 0.9; return Math.max(d, 5); };
  el.innerHTML = `<div class="chipset b9ct" role="group"><button data-v="bank" aria-pressed="true">${B9(1)}. ${L2("Bone bank", "হাড়ের ব্যাংক")}</button><button data-v="cmp" aria-pressed="false">${B9(2)}. ${L2("Healthy or diseased?", "সুস্থ না রোগাক্রান্ত?")}</button><button data-v="quiz" aria-pressed="false">${B9(3)}. ${L2("Which disease?", "কোন রোগ?")}</button></div><div id="b9cb" style="margin-top:8px"></div>`;
  const drawBank = () => {
    const age = +$("#b9cg", el).value, h = HAB.filter(q => hab[q[0]]).length, d = dens(age, h, sex);
    $("#b9cg-v", el).textContent = B9(age) + " " + L2("years", "বছর");
    const X = a => 40 + a * 2.775, Y = v => 206 - v * 1.655;
    const curve = (hh) => { let p = ""; for (let a = 0; a <= 80; a += 2) p += (a ? " L" : "M") + F9(X(a)) + " " + F9(Y(dens(a, hh, sex))); return p; };
    let s = `<svg viewBox="0 0 360 250" role="img" aria-label="${L2("Bone strength over a lifetime", "সারা জীবনে হাড়ের শক্তি")}">`;
    s += `<rect x="40" y="${F9(Y(45))}" width="222" height="${F9(206 - Y(45))}" fill="var(--bad)" opacity=".13"/>` + T9(46, 200, L2("bones break easily", "হাড় সহজে ভাঙে"), "start", 12.5, "var(--bad)", "700");
    s += `<path d="M40 24 V206 H262" fill="none" stroke="var(--ink)" stroke-width="1.5"/>` + [0, 20, 40, 60, 80].map(a => `<line x1="${F9(X(a))}" y1="206" x2="${F9(X(a))}" y2="211" stroke="var(--ink)" stroke-width="1.2"/>` + T9(F9(X(a)), 225, B9(a), "middle", 12.5, "var(--ink)")).join("") + T9(151, 244, L2("age (years)", "বয়স (বছর)"), "middle", 12.5, "var(--muted)");
    s += `<text x="16" y="115" font-size="12.5" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 16 115)">${L2("bone strength", "হাড়ের শক্তি")}</text>`;
    if (sex === "f") s += `<line x1="${F9(X(50))}" y1="34" x2="${F9(X(50))}" y2="206" stroke="var(--note)" stroke-width="1.3" stroke-dasharray="4 4"/>` + T9(F9(X(50)), 28, L2("menopause", "মেনোপজ"), "middle", 12.5, "var(--note)", "700");
    if (h < 3) s += `<path d="${curve(3)}" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    s += `<path d="${curve(h)}" fill="none" stroke="var(--c)" stroke-width="3.2" stroke-linejoin="round"/>`;
    s += `<line x1="${F9(X(age))}" y1="${F9(Y(d))}" x2="${F9(X(age))}" y2="206" stroke="var(--c)" stroke-width="1.3"/><circle cx="${F9(X(age))}" cy="${F9(Y(d))}" r="5.5" fill="${d < 45 ? "var(--bad)" : "var(--c)"}" stroke="var(--sheet)" stroke-width="2"/>`;
    const rh = 2.4 + (100 - d) * 0.08;
    s += `<circle cx="304" cy="96" r="35" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.4"/>` + [[0, 0], [18, 0], [-18, 0], [9, 15.6], [-9, 15.6], [9, -15.6], [-9, -15.6]].map(([a, b]) => `<circle cx="${F9(304 + a)}" cy="${F9(96 + b)}" r="${F9(rh)}" fill="${MAR9}" stroke="var(--ink)" stroke-width=".8"/>`).join("");
    s += T9(304, 30, L2("inside the", "এ বয়সে হাড়ের"), "middle", 12.5, "var(--ink)") + T9(304, 45, L2("bone now", "ভেতরটা"), "middle", 12.5, "var(--ink)") + T9(304, 152, d < 45 ? L2("thin, porous", "পাতলা, ঝাঁঝরা") : d < 70 ? L2("thinning", "পাতলা হচ্ছে") : L2("dense, strong", "ঘন, মজবুত"), "middle", 12.5, d < 45 ? "var(--bad)" : "var(--muted)", "700");
    $("#b9cs", el).innerHTML = s + `</svg>`;
    const miss = HAB.filter(q => !hab[q[0]]).map(q => q[1]);
    let o = `<b>${L2(`Age ${age}.`, `বয়স ${B9(age)}।`)}</b> ` + (d < 45 ? L2("The account is nearly empty. The bones are thin and brittle and can break after a slight fall: this is osteoporosis.", "হিসাব প্রায় ফাঁকা। হাড় পাতলা ও ভঙ্গুর, সামান্য পড়ে গেলেই ভাঙতে পারে: এটাই অস্টিওপোরোসিস।")
      : age < 28 ? L2("The bone account is still being filled. More bone is built than is worn away.", "হাড়ের হিসাবে এখনো জমা চলছে। যতটা ক্ষয় হচ্ছে, তার চেয়ে বেশি অস্থি তৈরি হচ্ছে।")
        : age <= 40 ? L2("The bones are at their strongest. Building and wearing away are balanced.", "হাড় এখন সবচেয়ে মজবুত। তৈরি আর ক্ষয় সমান সমান।")
          : L2("The account is slowly being spent. More bone is worn away than is built.", "হিসাব থেকে ধীরে ধীরে খরচ হচ্ছে। যতটা তৈরি হচ্ছে, তার চেয়ে বেশি অস্থি ক্ষয় হচ্ছে।"));
    o += " " + (miss.length ? L2(`Switched off: ${miss.join(", ")}. The peak is lower and the loss is faster than it could be (compare with the dashed line).`, `বন্ধ আছে: ${miss.join(", ")}। তাই চূড়া নিচু, ক্ষয়ও দ্রুত (ড্যাশ দেওয়া রেখার সাথে তুলনা করো)।`) : L2("With all three good habits the bones reach their full strength and lose it only slowly.", "তিনটি ভালো অভ্যাসই থাকলে হাড় পুরো শক্তিতে পৌঁছায়, আর ক্ষয়ও হয় ধীরে।"));
    if (sex === "f" && age >= 50) o += " " + L2("After menopause the loss is faster for some years.", "মেনোপজের পর কয়েক বছর ক্ষয় দ্রুত হয়।");
    $("#b9co", el).innerHTML = o + `<br><span class="muted" style="font-size:13px">${L2("The curve only illustrates the pattern; these are not measurements.", "রেখাটি শুধু ধরনটা বোঝানোর জন্য; এগুলো মাপা মান নয়।")}</span>`;
  };
  const drawCmp = () => {
    let s = `<svg viewBox="0 0 360 196" role="img" aria-label="${L2("Healthy and diseased compared", "সুস্থ ও রোগাক্রান্ত অবস্থার তুলনা")}">`;
    if (dz === "op") {
      s += `<defs><clipPath id="b9k1"><circle cx="95" cy="96" r="48"/></clipPath><clipPath id="b9k2"><circle cx="265" cy="96" r="56"/></clipPath></defs>`;
      const lat = (cx, w, dash) => { let p = ""; for (let i = -6; i <= 6; i++) p += `M${cx + i * 19 - 70} 26 L${cx + i * 19 + 70} 166 M${cx + i * 19 + 70} 26 L${cx + i * 19 - 70} 166 `; return `<path d="${p}" fill="none" stroke="${BONE9}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`; };
      s += `<circle cx="95" cy="96" r="62" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.4"/><circle cx="95" cy="96" r="48" fill="${MAR9}"/><g clip-path="url(#b9k1)">${lat(95, 9, "")}</g><circle cx="95" cy="96" r="48" fill="none" stroke="var(--ink)" stroke-width="1"/>`;
      s += `<circle cx="265" cy="96" r="62" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.4"/><circle cx="265" cy="96" r="56" fill="${MAR9}"/><g clip-path="url(#b9k2)">${lat(265, 2.6, "17 12")}</g><circle cx="265" cy="96" r="56" fill="none" stroke="var(--ink)" stroke-width="1"/>`;
      s += T9(95, 20, L2("Healthy bone", "সুস্থ অস্থি"), "middle", 14, "var(--ink)", "700") + T9(265, 20, L2("Osteoporosis", "অস্টিওপোরোসিস"), "middle", 14, "var(--bad)", "700") + T9(95, 182, L2("dense, thick walls", "ঘন, পুরু দেয়াল"), "middle", 12.5, "var(--muted)") + T9(265, 182, L2("thin, full of holes", "পাতলা, ঝাঁঝরা"), "middle", 12.5, "var(--muted)");
    } else {
      const jt = (x, ill) => {
        const bw = ill ? 46 : 36, mem = ill ? "#d2463c" : "#e07a8a";
        let j = ill ? `<ellipse cx="${x}" cy="97" rx="66" ry="56" fill="var(--bad)" opacity=".13"/>` : "";
        j += `<path d="M${x - 23} 58 C${x - bw - 14} 70 ${x - bw - 14} 124 ${x - 23} 136 L${x + 23} 136 C${x + bw + 14} 124 ${x + bw + 14} 70 ${x + 23} 58 Z" fill="${FLU9}" stroke="#b98b4f" stroke-width="5" stroke-linejoin="round"/>`;
        j += `<path d="M${x - 22} 63 C${x - bw - 7} 74 ${x - bw - 7} 120 ${x - 22} 131 M${x + 22} 63 C${x + bw + 7} 74 ${x + bw + 7} 120 ${x + 22} 131" fill="none" stroke="${mem}" stroke-width="${ill ? 8 : 2.6}" stroke-linecap="round"/>`;
        j += `<path d="M${x - 23} 26 V74 Q${x} 92 ${x + 23} 74 V26 Z" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3"/><path d="M${x - 23} 170 V120 Q${x} 102 ${x + 23} 120 V170 Z" fill="${BONE9}" stroke="var(--ink)" stroke-width="1.3"/>`;
        j += `<path d="M${x - 23} 74 Q${x} 92 ${x + 23} 74" fill="none" stroke="${CART9}" stroke-width="${ill ? 3 : 7}"${ill ? ` stroke-dasharray="7 5"` : ""}/><path d="M${x - 23} 120 Q${x} 102 ${x + 23} 120" fill="none" stroke="${CART9}" stroke-width="${ill ? 3 : 7}"${ill ? ` stroke-dasharray="6 6"` : ""}/>`;
        return j;
      };
      s += jt(95, false) + jt(265, true);
      s += T9(95, 16, L2("Healthy joint", "সুস্থ সন্ধি"), "middle", 14, "var(--ink)", "700") + T9(265, 16, L2("Rheumatoid arthritis", "রিউমাটয়েড আর্থ্রাইটিস"), "middle", 14, "var(--bad)", "700") + T9(95, 190, L2("smooth cartilage, thin lining", "মসৃণ তরুণাস্থি, পাতলা আবরণ"), "middle", 12.5, "var(--muted)") + T9(265, 190, L2("swollen, inflamed lining", "ফোলা, প্রদাহযুক্ত আবরণ"), "middle", 12.5, "var(--muted)");
    }
    $("#b9cs", el).innerHTML = s + `</svg>`;
    $("#b9co", el).innerHTML = `<b>${DIS[dz][0]}: ${INF[inf]}</b>${DIS[dz][1][inf]}`;
  };
  const drawQuiz = () => {
    const b = $("#b9cb", el);
    if (qi >= order.length) { b.innerHTML = `<div class="w-out"><b>${L2("Finished!", "শেষ!")}</b> ${L2("Your score", "তোমার স্কোর")}: ${B9(score)}/${B9(order.length)}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b9cr">${L2("Play again", "আবার খেলো")}</button></div>`; $("#b9cr", el).addEventListener("click", startQuiz); return; }
    const q = QZ[order[qi]];
    b.innerHTML = `<div class="w-row"><span class="muted" style="font-size:14px">${L2("Clue", "সূত্র")} ${B9(qi + 1)}/${B9(order.length)}</span><span class="muted" style="margin-left:auto;font-size:14px">${L2("Score", "স্কোর")}: ${B9(score)}</span></div><div class="w-out" style="margin-top:6px;font-size:18px">${q[0]}</div><div class="w-row" style="margin-top:8px">${QO.map((o, i) => `<button class="btn${picked >= 0 && i === q[1] ? " done" : ""}" data-o="${i}"${picked >= 0 ? " disabled" : ""}${picked === i && i !== q[1] ? ` style="border-color:var(--bad);color:var(--bad)"` : ""}>${o}</button>`).join("")}</div>${picked >= 0 ? `<div class="w-out" style="margin-top:8px"><b style="color:${picked === q[1] ? "var(--good)" : "var(--bad)"}">${picked === q[1] ? L2("Correct.", "ঠিক।") : L2("Not quite.", "ঠিক হয়নি।")}</b> ${QW[q[1]]}</div><div class="w-row" style="margin-top:8px"><button class="btn solid" id="b9cn">${L2("Next clue", "পরের সূত্র")}</button></div>` : ""}`;
    b.querySelectorAll("button[data-o]").forEach(x => x.addEventListener("click", () => { if (picked >= 0) return; picked = +x.dataset.o; if (picked === q[1]) score++; drawQuiz(); }));
    const n = $("#b9cn", el); if (n) n.addEventListener("click", () => { qi++; picked = -1; drawQuiz(); });
  };
  const startQuiz = () => { order = QZ.map((_, i) => i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } order = order.slice(0, 8); qi = 0; score = 0; picked = -1; drawQuiz(); };
  const setTab = () => {
    const b = $("#b9cb", el);
    if (tab === "bank") {
      b.innerHTML = `<div class="svgwrap fit" id="b9cs"></div>${slider("b9cg", L2("Age", "বয়স"), 5, 80, 1, 15, "")}<div class="hint">${L2("Habits kept up through life (tap to switch on or off):", "সারা জীবনের অভ্যাস (টোকা দিয়ে চালু বা বন্ধ করো):")}</div><div class="chipset b9ch" role="group" style="margin-top:4px">${HAB.map(q => `<button data-h="${q[0]}" aria-pressed="${hab[q[0]]}">${q[1]}</button>`).join("")}</div><div class="chipset b9cx" role="group" style="margin-top:8px"><button data-s="f" aria-pressed="${sex === "f"}">${L2("Woman", "নারী")}</button><button data-s="m" aria-pressed="${sex === "m"}">${L2("Man", "পুরুষ")}</button></div><div class="w-out" id="b9co" style="margin-top:8px"></div>`;
      $("#b9cg", el).addEventListener("input", drawBank);
      el.querySelectorAll(".b9ch button").forEach(q => q.addEventListener("click", () => { hab[q.dataset.h] = !hab[q.dataset.h]; q.setAttribute("aria-pressed", hab[q.dataset.h]); drawBank(); }));
      chips9(el, ".b9cx", q => { sex = q.dataset.s; drawBank(); });
      drawBank();
    } else if (tab === "cmp") {
      b.innerHTML = `<div class="chipset b9cd" role="group"><button data-d="op" aria-pressed="${dz === "op"}">${DIS.op[0]}</button><button data-d="ra" aria-pressed="${dz === "ra"}">${DIS.ra[0]}</button></div><div class="svgwrap fit" id="b9cs" style="margin-top:8px"></div><div class="chipset b9ci" role="group" style="margin-top:6px">${INF.map((t, i) => `<button data-i="${i}" aria-pressed="${i === inf}">${t}</button>`).join("")}</div><div class="w-out" id="b9co" style="margin-top:8px"></div>`;
      chips9(el, ".b9cd", q => { dz = q.dataset.d; drawCmp(); }); chips9(el, ".b9ci", q => { inf = +q.dataset.i; drawCmp(); });
      drawCmp();
    } else startQuiz();
  };
  chips9(el, ".b9ct", b => { tab = b.dataset.v; setTab(); });
  setTab();
};
