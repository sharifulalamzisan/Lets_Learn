/* ---- chapter 11 widgets: current electricity ---- */
const B11 = x => bnNum(x, LANG);
const F11 = (x, d = 2) => B11(String(+(+x).toFixed(d)).replace("-", "−"));
const chips11 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));
const sci11 = (x, d = 2) => { if (x === 0) return B11("0"); const a = Math.abs(x); if (a >= 1e5 || a < 1e-2) { const e = Math.floor(Math.log10(a)); let m = +(x / Math.pow(10, e)).toFixed(d); return B11(String(m).replace("-", "−")) + " × " + B11("10") + "<sup>" + B11(String(e).replace("-", "−")) + "</sup>"; } return B11(String(+x.toPrecision(3)).replace("-", "−")); };
/* circuit drawing helpers */
const zigH11 = (x1, x2, y, col = "var(--ink)") => { const n = 6, w = (x2 - x1 - 12) / n; let d = `M${x1} ${y}h6`; for (let i = 0; i < n; i++) d += `l${w / 2} ${i % 2 ? 7 : -7}l${w / 2} ${i % 2 ? -7 : 7}`; d += "h6"; return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`; };
const zigV11 = (x, y1, y2, col = "var(--ink)") => { const n = 6, h = (y2 - y1 - 12) / n; let d = `M${x} ${y1}v6`; for (let i = 0; i < n; i++) d += `l${i % 2 ? 7 : -7} ${h / 2}l${i % 2 ? -7 : 7} ${h / 2}`; d += "v6"; return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`; };
/* a cell drawn vertically at x, centred at y, + on top */
const cellV11 = (x, y) => `<rect x="${x-16}" y="${y-8}" width="32" height="16" fill="var(--sheet)"/><line x1="${x-14}" y1="${y-5}" x2="${x+14}" y2="${y-5}" stroke="var(--ink)" stroke-width="2"/><line x1="${x-7}" y1="${y+5}" x2="${x+7}" y2="${y+5}" stroke="var(--ink)" stroke-width="4"/>`;
const meter11 = (x, y, t) => `<circle cx="${x}" cy="${y}" r="12" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.8"/><text x="${x}" y="${y+5}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${t}</text>`;
const earth11 = (x, y) => `<path d="M${x} ${y}v8M${x-10} ${y+8}h20M${x-6} ${y+12}h12M${x-2} ${y+16}h4" stroke="var(--good)" stroke-width="2" fill="none"/>`;

/* 11.1 / 11.1.3 moving charges in a simple circuit */
W.c11flow = (el) => {
  let mode = "c", phase = 0;
  el.innerHTML = `<div class="chipset c11fm" role="group"><button data-m="c" aria-pressed="true">${L2("Conventional current (+)","প্রচলিত প্রবাহ (+)")}</button><button data-m="e" aria-pressed="false">${L2("Electrons (−)","ইলেকট্রন (−)")}</button></div>
  <div class="svgwrap fit" id="c11fsv"></div>${slider("c11fi", L2("Current I","প্রবাহ I"), 0.5, 5, 0.5, 2, "A")}${slider("c11ft", L2("Time t","সময় t"), 1, 60, 1, 10, "s")}
  ${REDUCED ? `<button class="btn" id="c11fst">${L2("Step ▶","এক ধাপ ▶")}</button>` : ""}<div class="w-out" id="c11fo"></div>`;
  /* loop path in the conventional direction: from + (top of cell) round to − (bottom) */
  const P = [[40, 58], [40, 30], [320, 30], [320, 150], [40, 150], [40, 122]];
  const segs = []; let Ltot = 0; for (let i = 0; i < P.length - 1; i++) { const l = Math.hypot(P[i+1][0]-P[i][0], P[i+1][1]-P[i][1]); segs.push([P[i], P[i+1], l]); Ltot += l; }
  const at = s => { s = ((s % Ltot) + Ltot) % Ltot; for (const [a, b, l] of segs) { if (s <= l) return [a[0] + (b[0]-a[0]) * s / l, a[1] + (b[1]-a[1]) * s / l]; s -= l; } return P[P.length-1]; };
  const draw = () => {
    const I = +$("#c11fi", el).value;
    let g = `<svg viewBox="0 0 360 180" role="img" aria-label="${L2("charges moving in a circuit","বর্তনীতে চলমান চার্জ")}">${arrowDefs("c11fa", mode==="c"?"var(--bad)":"var(--c)")}`;
    g += `<path d="M40 58V30H320V150H40V122" fill="none" stroke="var(--muted)" stroke-width="6" stroke-linejoin="round" opacity=".45"/>`;
    g += cellV11(40, 90).replace(/y-5/g,"") ;
    g += `<line x1="26" y1="85" x2="54" y2="85" stroke="var(--ink)" stroke-width="2"/><line x1="33" y1="95" x2="47" y2="95" stroke="var(--ink)" stroke-width="4"/><line x1="40" y1="58" x2="40" y2="85" stroke="var(--muted)" stroke-width="2"/><line x1="40" y1="95" x2="40" y2="122" stroke="var(--muted)" stroke-width="2"/>`;
    g += `<text x="60" y="84" font-size="15" font-weight="700" fill="var(--bad)">+</text><text x="60" y="108" font-size="15" font-weight="700" fill="var(--c)">−</text>`;
    /* bulb on right side */
    g += `<circle cx="320" cy="90" r="16" fill="var(--note-soft)" stroke="var(--ink)" stroke-width="1.8"/><path d="M309 79l22 22M331 79l-22 22" stroke="var(--note)" stroke-width="2"/>`;
    /* counting point */
    g += `<line x1="180" y1="16" x2="180" y2="44" stroke="var(--note)" stroke-width="2" stroke-dasharray="3 3"/><text x="186" y="14" font-size="13" fill="var(--note)">${L2("counting point","গণনার বিন্দু")}</text>`;
    const n = 16, sp = Ltot / n;
    for (let k = 0; k < n; k++) { const s = k * sp + (mode === "c" ? phase : -phase); const [x, y] = at(s);
      if (Math.abs(x - 320) < 20 && Math.abs(y - 90) < 20) continue;
      g += mode === "c" ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="var(--bad)"/><path d="M${(x-3).toFixed(1)} ${y.toFixed(1)}h6M${x.toFixed(1)} ${(y-3).toFixed(1)}v6" stroke="var(--sheet)" stroke-width="1.6"/>`
        : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="var(--c)"/><path d="M${(x-2.5).toFixed(1)} ${y.toFixed(1)}h5" stroke="var(--sheet)" stroke-width="1.6"/>`; }
    /* direction arrows */
    g += mode === "c" ? `<line x1="110" y1="52" x2="160" y2="52" stroke="var(--bad)" stroke-width="2.5" marker-end="url(#c11fa)"/><text x="100" y="56" font-size="14" text-anchor="end" fill="var(--bad)">I</text><line x1="250" y1="128" x2="200" y2="128" stroke="var(--bad)" stroke-width="2.5" marker-end="url(#c11fa)"/>`
      : `<line x1="160" y1="52" x2="110" y2="52" stroke="var(--c)" stroke-width="2.5" marker-end="url(#c11fa)"/><text x="166" y="56" font-size="14" fill="var(--c)">e⁻</text><line x1="200" y1="128" x2="250" y2="128" stroke="var(--c)" stroke-width="2.5" marker-end="url(#c11fa)"/>`;
    g += `<text x="180" y="174" font-size="13.5" text-anchor="middle" fill="var(--muted)">${mode==="c"?L2("+ → round the circuit → −","+ → বর্তনী ঘুরে → −"):L2("− → round the circuit → +","− → বর্তনী ঘুরে → +")}</text></svg>`;
    $("#c11fsv", el).innerHTML = g;
  };
  const out = () => {
    const I = sv(el, "c11fi", "A", 1), t = sv(el, "c11ft", "s"); const Q = I * t, N = Q / 1.6e-19;
    $("#c11fo", el).innerHTML = L2(`Q = It = ${F11(I,1)} × ${t} = <b>${F11(Q,1)} C</b> passes the counting point<br>= about <b>${sci11(N)}</b> electrons (each carries 1.6 × 10⁻¹⁹ C)<br><span class="muted">${mode==="c"?"Conventional current flows from + to − in the outer circuit.":"The electrons really move the opposite way: from − to +."}</span>`,
      `Q = It = ${F11(I,1)} × ${B11(t)} = <b>${F11(Q,1)} C</b> চার্জ গণনার বিন্দু পার হয়<br>= প্রায় <b>${sci11(N)}</b>টি ইলেকট্রন (প্রতিটি বহন করে ১.৬ × ১০⁻¹⁹ C)<br><span class="muted">${mode==="c"?"বাইরের বর্তনীতে প্রচলিত প্রবাহ + থেকে − এর দিকে চলে।":"ইলেকট্রন আসলে উল্টো দিকে চলে: − থেকে +।"}</span>`);
  };
  chips11(el, ".c11fm", b => { mode = b.dataset.m; draw(); out(); });
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", () => { out(); if (REDUCED) draw(); }));
  if (REDUCED) $("#c11fst", el).addEventListener("click", () => { phase += 8; draw(); });
  else animate(el, dt => { phase += dt * 14 * +$("#c11fi", el).value; draw(); });
  draw(); out();
};

/* 11.1.1 two 1.5 V cells: choose the earthed point */
W.c11cells = (el) => {
  let ep = 0; /* 0 = bottom N, 1 = middle M, 2 = top P */
  el.innerHTML = `<p class="hint">${L2("Two 1.5 V cells joined + to −. Which point is connected to earth (0 V)?","দুটি ১.৫ V কোষ + থেকে − করে যুক্ত। কোন বিন্দু ভূমিসংলগ্ন (০ V)?")}</p><div class="chipset c11ce" role="group"><button data-p="2" aria-pressed="false">${L2("Top P","ওপরের P")}</button><button data-p="1" aria-pressed="false">${L2("Middle M","মাঝের M")}</button><button data-p="0" aria-pressed="true">${L2("Bottom N","নিচের N")}</button></div><div class="svgwrap fit" id="c11csv"></div><div class="w-out" id="c11co"></div>`;
  const draw = () => {
    const base = [0, 1.5, 3]; const V = base.map(v => v - base[ep]); /* N, M, P */
    const ys = [196, 118, 40];
    let g = `<svg viewBox="0 0 360 240" role="img" aria-label="${L2("two cells and their potentials","দুটি কোষ ও তাদের বিভব")}">`;
    g += `<line x1="90" y1="40" x2="90" y2="196" stroke="var(--muted)" stroke-width="2"/>` + cellV11(90, 79) + cellV11(90, 157);
    g += `<text x="112" y="74" font-size="13" fill="var(--muted)">${B11("1.5")} V</text><text x="112" y="152" font-size="13" fill="var(--muted)">${B11("1.5")} V</text>`;
    ["N", "M", "P"].forEach((nm, i) => { g += `<circle cx="90" cy="${ys[i]}" r="5" fill="var(--ink)"/><text x="68" y="${ys[i]+5}" font-size="16" font-weight="700" text-anchor="end" fill="var(--ink)">${nm}</text>`; });
    g += earth11(90, ys[ep]).replace(`M90 ${ys[ep]}v8`, `M90 ${ys[ep]}h-40v8`).replace(/M80 /, "M40 ").replace(/M84 /, "M44 ").replace(/M88 /, "M48 ");
    /* potential ladder */
    const Y = v => 118 - v * 26; g += `<line x1="230" y1="${Y(3)-8}" x2="230" y2="${Y(-3)+8}" stroke="var(--muted)"/>`;
    [-3, -1.5, 0, 1.5, 3].forEach(v => g += `<line x1="224" y1="${Y(v)}" x2="236" y2="${Y(v)}" stroke="var(--muted)"/><text x="218" y="${Y(v)+5}" font-size="13" text-anchor="end" fill="var(--muted)">${F11(v,1)}</text>`);
    g += `<text x="230" y="12" font-size="13" text-anchor="middle" fill="var(--muted)">${L2("potential (V)","বিভব (V)")}</text>`;
    ["N", "M", "P"].forEach((nm, i) => { const c = V[i] > 0 ? "var(--bad)" : V[i] < 0 ? "var(--c)" : "var(--good)"; g += `<circle cx="230" cy="${Y(V[i])}" r="7" fill="${c}"/><text x="246" y="${Y(V[i])+5}" font-size="15" font-weight="700" fill="${c}">${nm} = ${F11(V[i],1)} V</text>`; });
    g += `</svg>`; $("#c11csv", el).innerHTML = g;
    $("#c11co", el).innerHTML = L2(`V<sub>P</sub> = ${F11(V[2],1)} V, V<sub>M</sub> = ${F11(V[1],1)} V, V<sub>N</sub> = ${F11(V[0],1)} V<br>Differences never change: P − M = 1.5 V, M − N = 1.5 V, P − N = <b>3 V</b>.`,
      `V<sub>P</sub> = ${F11(V[2],1)} V, V<sub>M</sub> = ${F11(V[1],1)} V, V<sub>N</sub> = ${F11(V[0],1)} V<br>পার্থক্য কখনো বদলায় না: P − M = ১.৫ V, M − N = ১.৫ V, P − N = <b>৩ V</b>।`);
  };
  chips11(el, ".c11ce", b => { ep = +b.dataset.p; draw(); });
  draw();
};

/* 11.2.1 Ohm's law: circuit with meters + I–V graph */
W.c11ohm = (el) => {
  el.innerHTML = slider("c11ov", L2("Potential difference V","বিভব পার্থক্য V"), -6, 6, 0.5, 3, "V") + slider("c11or", L2("Resistance R","রোধ R"), 2, 20, 1, 5, "Ω") + `<div class="svgwrap fit" id="c11osv"></div><div class="svgwrap fit" id="c11ogr"></div><div class="w-out" id="c11oo"></div>`;
  const go = () => {
    const V = sv(el, "c11ov", "V", 1), R = sv(el, "c11or", "Ω"); const I = V / R;
    let g = `<svg viewBox="0 0 360 150" role="img" aria-label="${L2("circuit with ammeter and voltmeter","অ্যামিটার ও ভোল্টমিটারসহ বর্তনী")}">${arrowDefs("c11oa","var(--bad)")}`;
    g += `<path d="M40 60V30H120M144 30H320V120H250M130 120H40V90" fill="none" stroke="var(--muted)" stroke-width="2"/>` + zigH11(130, 250, 120, "var(--ink)") + meter11(132, 30, "A");
    g += `<line x1="26" y1${V>=0?"":""}="${V>=0?70:80}" x2="54" y2="${V>=0?70:80}" stroke="var(--ink)" stroke-width="2"/><line x1="33" y1="${V>=0?80:70}" x2="47" y2="${V>=0?80:70}" stroke="var(--ink)" stroke-width="4"/><line x1="40" y1="60" x2="40" y2="${V>=0?70:70}" stroke="var(--muted)" stroke-width="2"/><line x1="40" y1="80" x2="40" y2="90" stroke="var(--muted)" stroke-width="2"/>`;
    g += `<text x="${V>=0?60:60}" y="${V>=0?72:90}" font-size="14" font-weight="700" fill="var(--bad)">+</text>`;
    /* voltmeter across the resistor */
    g += `<path d="M130 120V144H170M194 144H250V120" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3"/>` + meter11(182, 144, "V");
    g += `<text x="190" y="110" font-size="13.5" text-anchor="middle" fill="var(--ink)">R = ${B11(R)} Ω</text>`;
    g += `<rect x="150" y="4" width="120" height="20" rx="4" fill="var(--sheet)" stroke="var(--rule)"/><text x="210" y="19" font-size="14" text-anchor="middle" fill="var(--ink)">A: ${F11(I,2)} A</text>`;
    g += `<rect x="232" y="132" width="110" height="20" rx="4" fill="var(--sheet)" stroke="var(--rule)"/><text x="287" y="147" font-size="14" text-anchor="middle" fill="var(--ink)">V: ${F11(V,1)} V</text>`;
    if (Math.abs(I) > 0.001) { const dir = I > 0 ? 1 : -1; g += `<line x1="${dir>0?230:290}" y1="44" x2="${dir>0?290:230}" y2="44" stroke="var(--bad)" stroke-width="2.5" marker-end="url(#c11oa)"/><text x="260" y="62" font-size="13.5" text-anchor="middle" fill="var(--bad)">I</text>`; }
    g += `</svg>`; $("#c11osv", el).innerHTML = g;
    /* graph: V from -6..6 on x, I from -3..3 on y */
    const X = v => 180 + v * 26, Y = i => 90 - i * 26;
    let gr = `<svg viewBox="0 0 360 180" role="img" aria-label="${L2("current against potential difference","বিভব পার্থক্যের সাথে প্রবাহ")}"><line x1="20" y1="90" x2="346" y2="90" stroke="var(--muted)"/><line x1="180" y1="10" x2="180" y2="170" stroke="var(--muted)"/>`;
    gr += `<text x="346" y="84" font-size="13.5" text-anchor="end" fill="var(--muted)">V (V)</text><text x="186" y="20" font-size="13.5" fill="var(--muted)">I (A)</text>`;
    [-6, -3, 3, 6].forEach(v => gr += `<line x1="${X(v)}" y1="87" x2="${X(v)}" y2="93" stroke="var(--muted)"/><text x="${X(v)}" y="106" font-size="13" text-anchor="middle" fill="var(--muted)">${F11(v,0)}</text>`);
    [-2, 2].forEach(i => gr += `<line x1="177" y1="${Y(i)}" x2="183" y2="${Y(i)}" stroke="var(--muted)"/><text x="172" y="${Y(i)+5}" font-size="13" text-anchor="end" fill="var(--muted)">${F11(i,0)}</text>`);
    const clipI = i => Math.max(-3.2, Math.min(3.2, i));
    const vEnd = Math.min(6, 3.2 * R);
    gr += `<line x1="${X(-vEnd)}" y1="${Y(clipI(-vEnd/R))}" x2="${X(vEnd)}" y2="${Y(clipI(vEnd/R))}" stroke="var(--c)" stroke-width="3"/>`;
    if (R !== 10) gr += `<line x1="${X(-6)}" y1="${Y(-0.6)}" x2="${X(6)}" y2="${Y(0.6)}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${X(6)}" y="${Y(0.6)-6}" font-size="13" text-anchor="end" fill="var(--muted)">${B11(10)} Ω</text>`;
    gr += `<line x1="${X(V)}" y1="90" x2="${X(V)}" y2="${Y(I)}" stroke="var(--note)" stroke-dasharray="3 3"/><circle cx="${X(V)}" cy="${Y(I)}" r="6" fill="var(--note)"/></svg>`;
    $("#c11ogr", el).innerHTML = gr;
    $("#c11oo", el).innerHTML = L2(`I = V / R = ${F11(V,1)} ÷ ${R} = <b>${F11(I,2)} A</b>${V<0?" (reversed direction)":""}<br><span class="muted">Slope of the line = 1/R = ${F11(1/R,3)} A/V. Bigger R → flatter line → less current. Dashed line: 10 Ω.</span>`,
      `I = V / R = ${F11(V,1)} ÷ ${B11(R)} = <b>${F11(I,2)} A</b>${V<0?" (দিক উল্টে গেছে)":""}<br><span class="muted">রেখার ঢাল = 1/R = ${F11(1/R,3)} A/V। R বড় → রেখা চ্যাপ্টা → প্রবাহ কম। ড্যাশ রেখা: ১০ Ω।</span>`);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 11.2.2 R = ρL/A */
W.c11rho = (el) => {
  const MAT = [[L2("Silver","রুপা"), 1.59e-8, "#9aa4ad"], [L2("Copper","তামা"), 1.68e-8, "#c46a2d"], [L2("Gold","সোনা"), 2.44e-8, "#c9a227"], [L2("Tungsten","টাংস্টেন"), 5.5e-8, "#6b7280"], [L2("Nichrome","নাইক্রোম"), 1.0e-6, "#8b5e3c"]];
  let m = 1;
  el.innerHTML = `<div class="chipset c11rm" role="group">${MAT.map((a,i)=>`<button data-i="${i}" aria-pressed="${i===m}">${a[0]}</button>`).join("")}</div>` + slider("c11rl", L2("Length L","দৈর্ঘ্য L"), 0.5, 20, 0.5, 5, "m") + slider("c11rd", L2("Diameter d","ব্যাস d"), 0.1, 2, 0.05, 0.5, "mm") + `<div class="svgwrap fit" id="c11rsv"></div><div class="w-out" id="c11ro"></div>`;
  const go = () => {
    const L = sv(el, "c11rl", "m", 1), d = sv(el, "c11rd", "mm", 2); const [nm, rho, col] = MAT[m];
    const A = Math.PI * Math.pow(d * 1e-3 / 2, 2), R = rho * L / A, L1 = A / rho;
    const wl = 30 + L / 20 * 290, th = 3 + d / 2 * 26;
    let g = `<svg viewBox="0 0 360 110" role="img" aria-label="${L2("wire","তার")}"><rect x="20" y="${50-th/2}" width="${wl}" height="${th}" rx="${Math.min(th/2,6)}" fill="${col}" stroke="var(--ink)" stroke-width="1"/>`;
    g += `<line x1="20" y1="92" x2="${20+wl}" y2="92" stroke="var(--muted)"/><line x1="20" y1="86" x2="20" y2="98" stroke="var(--muted)"/><line x1="${20+wl}" y1="86" x2="${20+wl}" y2="98" stroke="var(--muted)"/><text x="${20+wl/2}" y="108" font-size="13.5" text-anchor="middle" fill="var(--muted)">L = ${F11(L,1)} m</text>`;
    g += `<text x="20" y="18" font-size="14" fill="var(--ink)">${nm}: ρ = ${sci11(rho)} Ω m</text></svg>`;
    $("#c11rsv", el).innerHTML = g;
    const Rs = R >= 100 ? B11(Math.round(R)) : R >= 1 ? F11(R, 2) : F11(R, 4);
    $("#c11ro", el).innerHTML = L2(`A = πd²/4 = ${sci11(A)} m²<br>R = ρL/A = <b>${Rs} Ω</b><br><span class="muted">At this thickness, 1 Ω needs ${L1>=1?F11(L1,2)+" m":F11(L1*100,1)+" cm"} of ${nm.toLowerCase()}. Double L → R doubles; double d → A ×4 → R ÷4.</span>`,
      `A = πd²/4 = ${sci11(A)} m²<br>R = ρL/A = <b>${Rs} Ω</b><br><span class="muted">এই পুরুত্বে ১ Ω-এর জন্য ${nm} লাগবে ${L1>=1?F11(L1,2)+" m":F11(L1*100,1)+" cm"}। L দ্বিগুণ → R দ্বিগুণ; d দ্বিগুণ → A ৪ গুণ → R ÷ ৪।</span>`);
  };
  chips11(el, ".c11rm", b => { m = +b.dataset.i; go(); });
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 11.2.3 potentials around a loop, choose the earthed point */
W.c11pot = (el) => {
  let ep = "D";
  el.innerHTML = `<div class="w-row"><span class="muted">${L2("Earthed point","ভূমিসংলগ্ন বিন্দু")}:</span><div class="chipset c11pe" role="group">${["A","B","C","D"].map(p=>`<button data-p="${p}" aria-pressed="${p===ep}">${p}</button>`).join("")}</div></div>` +
    slider("c11pv", L2("Battery V","ব্যাটারি V"), 1, 12, 1, 6, "V") + slider("c11p1", "R₁", 1, 20, 1, 5, "Ω") + slider("c11p2", "R₂", 1, 20, 1, 10, "Ω") + slider("c11p3", "R₃", 1, 20, 1, 15, "Ω") +
    `<div class="svgwrap fit" id="c11psv"></div><div class="svgwrap fit" id="c11pst"></div><div class="w-out" id="c11po"></div>`;
  const go = () => {
    const V = sv(el, "c11pv", "V"), R1 = sv(el, "c11p1", "Ω"), R2 = sv(el, "c11p2", "Ω"), R3 = sv(el, "c11p3", "Ω");
    const I = V / (R1 + R2 + R3); const rel = { A: V, B: V - I * R1, C: V - I * (R1 + R2), D: 0 }; const off = rel[ep];
    const P = {}; for (const k in rel) P[k] = rel[k] - off; P.E = P.B;
    const pos = { A: [40, 30], B: [260, 30], C: [260, 150], D: [40, 150], E: [340, 30] };
    let g = `<svg viewBox="0 0 360 180" role="img" aria-label="${L2("circuit with points A to E","A থেকে E বিন্দুসহ বর্তনী")}">`;
    g += `<path d="M40 30H110M230 30H340M260 30V60M260 120V150H200M80 150H40V96M40 84V30" fill="none" stroke="var(--muted)" stroke-width="2"/>`;
    g += zigH11(110, 230, 30) + zigV11(260, 60, 120) + zigH11(80, 200, 150);
    g += `<line x1="26" y1="84" x2="54" y2="84" stroke="var(--ink)" stroke-width="2"/><line x1="33" y1="96" x2="47" y2="96" stroke="var(--ink)" stroke-width="4"/><text x="16" y="92" font-size="13" fill="var(--muted)">${B11(V)}V</text>`;
    g += `<text x="170" y="20" font-size="13.5" text-anchor="middle" fill="var(--ink)">R₁ = ${B11(R1)} Ω</text><text x="278" y="95" font-size="13.5" fill="var(--ink)">R₂ = ${B11(R2)} Ω</text><text x="140" y="172" font-size="13.5" text-anchor="middle" fill="var(--ink)">R₃ = ${B11(R3)} Ω</text>`;
    for (const k of ["A","B","C","D","E"]) { const [x, y] = pos[k]; g += `<circle cx="${x}" cy="${y}" r="5" fill="${k===ep?"var(--good)":"var(--ink)"}"/>`;
      const lx = k === "E" ? x : k === "A" || k === "D" ? x + 10 : x - 10, ly = y < 90 ? y + 22 : y - 12, an = k === "E" ? "end" : k === "A" || k === "D" ? "start" : "end";
      g += `<text x="${lx}" y="${ly}" font-size="14" font-weight="700" text-anchor="${an}" fill="var(--c)">${k}: ${F11(P[k],2)}</text>`; }
    const [ex, ey] = pos[ep]; g += earth11(ex, ey).replace(`M${ex} ${ey}v8`, `M${ex} ${ey}v8`);
    g += `<text x="340" y="50" font-size="12.5" text-anchor="end" fill="var(--muted)">${L2("dead end","কানাগলি")}</text></svg>`;
    $("#c11psv", el).innerHTML = g;
    /* staircase */
    const lo = Math.min(...Object.values(P)), hi = Math.max(...Object.values(P)); const span = Math.max(hi - lo, 1);
    const Y = v => 130 - (v - lo) / span * 100; const xs = [60, 140, 220, 300], ks = ["A","B","C","D"];
    let s = `<svg viewBox="0 0 360 160" role="img" aria-label="${L2("potential at each point","প্রতিটি বিন্দুর বিভব")}"><text x="8" y="14" font-size="13.5" fill="var(--muted)">${L2("potential going round: A → B → C → D","ঘুরে যেতে বিভব: A → B → C → D")}</text>`;
    s += `<line x1="30" y1="${Y(0)}" x2="340" y2="${Y(0)}" stroke="var(--good)" stroke-dasharray="4 4"/><text x="344" y="${Y(0)+4}" font-size="12.5" text-anchor="end" fill="var(--good)">${B11(0)} V</text>`;
    let d = ""; ks.forEach((k, i) => { const x = xs[i], y = Y(P[k]); d += (i ? `L${x} ${y}` : `M${x} ${y}`); if (i < 3) d += `L${xs[i]+40} ${y}`; });
    s += `<path d="${d}" fill="none" stroke="var(--c)" stroke-width="3"/>`;
    ks.forEach((k, i) => { s += `<circle cx="${xs[i]}" cy="${Y(P[k])}" r="5" fill="var(--c)"/><text x="${xs[i]}" y="152" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${k}</text>`; });
    [["R₁", I * R1], ["R₂", I * R2], ["R₃", I * R3]].forEach(([n, dv], i) => s += `<text x="${xs[i]+60}" y="${(Y(P[ks[i]])+Y(P[ks[i+1]]))/2+4}" font-size="12.5" fill="var(--note)">−${F11(dv,2)}</text>`);
    s += `</svg>`; $("#c11pst", el).innerHTML = s;
    $("#c11po", el).innerHTML = L2(`I = V/(R₁ + R₂ + R₃) = ${B11(V)} ÷ ${R1+R2+R3} = <b>${F11(I,3)} A</b><br>Drops: IR₁ = ${F11(I*R1,2)} V, IR₂ = ${F11(I*R2,2)} V, IR₃ = ${F11(I*R3,2)} V (total ${B11(V)} V)<br><span class="muted">E is on a dead-end wire: no current, no drop, so V<sub>E</sub> = V<sub>B</sub>. Earthing another point shifts every potential but not the drops or I.</span>`,
      `I = V/(R₁ + R₂ + R₃) = ${B11(V)} ÷ ${B11(R1+R2+R3)} = <b>${F11(I,3)} A</b><br>বিভব পতন: IR₁ = ${F11(I*R1,2)} V, IR₂ = ${F11(I*R2,2)} V, IR₃ = ${F11(I*R3,2)} V (মোট ${B11(V)} V)<br><span class="muted">E কানাগলি তারে: প্রবাহ নেই, পতন নেই, তাই V<sub>E</sub> = V<sub>B</sub>। অন্য বিন্দু ভূমিসংলগ্ন করলে সব বিভব সরে যায়, কিন্তু পতন বা I বদলায় না।</span>`);
  };
  chips11(el, ".c11pe", b => { ep = b.dataset.p; go(); });
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 11.2.4 series vs parallel */
W.c11combo = (el) => {
  let mode = "s";
  el.innerHTML = `<div class="chipset c11cm" role="group"><button data-m="s" aria-pressed="true">${L2("Series","শ্রেণি")}</button><button data-m="p" aria-pressed="false">${L2("Parallel","সমান্তরাল")}</button></div>` +
    slider("c11cv", L2("Battery V","ব্যাটারি V"), 1, 12, 1, 6, "V") + slider("c11c1", "R₁", 1, 30, 1, 2, "Ω") + slider("c11c2", "R₂", 1, 30, 1, 3, "Ω") + slider("c11c3", "R₃", 1, 30, 1, 6, "Ω") +
    `<div class="svgwrap fit" id="c11csv2"></div><div class="w-out" id="c11co2"></div>`;
  const go = () => {
    const V = sv(el, "c11cv", "V"), R = [sv(el, "c11c1", "Ω"), sv(el, "c11c2", "Ω"), sv(el, "c11c3", "Ω")];
    const Req = mode === "s" ? R[0] + R[1] + R[2] : 1 / (1 / R[0] + 1 / R[1] + 1 / R[2]); const I = V / Req;
    const Ik = mode === "s" ? R.map(() => I) : R.map(r => V / r), Vk = mode === "s" ? R.map(r => I * r) : R.map(() => V);
    const maxI = Math.max(...Ik);
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${mode==="s"?L2("resistors in series","শ্রেণি সংযোগে রোধ"):L2("resistors in parallel","সমান্তরাল সংযোগে রোধ")}">`;
    const cell = `<line x1="26" y1="94" x2="54" y2="94" stroke="var(--ink)" stroke-width="2"/><line x1="33" y1="106" x2="47" y2="106" stroke="var(--ink)" stroke-width="4"/><text x="60" y="104" font-size="13.5" fill="var(--muted)">${B11(V)} V</text>`;
    const w = i => (1.5 + 4 * Ik[i] / maxI).toFixed(1);
    if (mode === "s") {
      g += `<path d="M40 94V30H50M130 30H140M220 30H230M310 30H330V170H40V106" fill="none" stroke="var(--muted)" stroke-width="2"/>` + cell;
      [50, 140, 230].forEach((x, i) => { g += zigH11(x, x + 80, 30, "var(--c)") + `<text x="${x+40}" y="58" font-size="13.5" text-anchor="middle" fill="var(--ink)">R${"₁₂₃"[i]} = ${B11(R[i])} Ω</text><text x="${x+40}" y="76" font-size="13" text-anchor="middle" fill="var(--note)">${F11(Vk[i],2)} V</text>`; });
      g += `<text x="185" y="160" font-size="13.5" text-anchor="middle" fill="var(--bad)">I = ${F11(I,2)} A ${L2("everywhere","সব জায়গায়")}</text>`;
    } else {
      g += `<path d="M40 94V20H300M40 106V180H300" fill="none" stroke="var(--muted)" stroke-width="2"/>` + cell;
      [120, 200, 280].forEach((x, i) => { g += `<line x1="${x}" y1="20" x2="${x}" y2="60" stroke="var(--muted)" stroke-width="2"/><line x1="${x}" y1="140" x2="${x}" y2="180" stroke="var(--muted)" stroke-width="2"/>` + zigV11(x, 60, 140, "var(--c)") + `<line x1="${x+14}" y1="70" x2="${x+14}" y2="130" stroke="var(--bad)" stroke-width="${w(i)}" opacity=".7"/><text x="${x-12}" y="96" font-size="13" text-anchor="end" fill="var(--ink)">${B11(R[i])}Ω</text><text x="${x-12}" y="114" font-size="12.5" text-anchor="end" fill="var(--bad)">${F11(Ik[i],2)}A</text>`; });
      g += `<text x="200" y="14" font-size="13" text-anchor="middle" fill="var(--note)">${L2("same V across each","প্রতিটিতে একই V")}: ${B11(V)} V</text><text x="200" y="197" font-size="13" text-anchor="middle" fill="var(--bad)">I = ${F11(I,2)} A</text>`;
    }
    g += `</svg>`; $("#c11csv2", el).innerHTML = g;
    const ReqS = F11(Req, 2);
    const rows = R.map((r, i) => `R${"₁₂₃"[i]} = ${B11(r)} Ω: I = ${F11(Ik[i],2)} A, V = ${F11(Vk[i],2)} V`).join("<br>");
    $("#c11co2", el).innerHTML = (mode === "s"
      ? L2(`R = R₁ + R₂ + R₃ = ${R.join(" + ")} = <b>${ReqS} Ω</b>`, `R = R₁ + R₂ + R₃ = ${R.map(B11).join(" + ")} = <b>${ReqS} Ω</b>`)
      : L2(`1/R = 1/${R[0]} + 1/${R[1]} + 1/${R[2]} → <b>R = ${ReqS} Ω</b> (smaller than ${Math.min(...R)} Ω)`, `1/R = ১/${B11(R[0])} + ১/${B11(R[1])} + ১/${B11(R[2])} → <b>R = ${ReqS} Ω</b> (${B11(Math.min(...R))} Ω-এর চেয়েও ছোট)`))
      + `<br>${L2("Total current","মোট প্রবাহ")} I = V/R = <b>${F11(I,2)} A</b><br><span class="muted">${rows}</span>`;
  };
  chips11(el, ".c11cm", b => { mode = b.dataset.m; go(); });
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 11.3 electricity bill calculator */
W.c11bill = (el) => {
  const AP = [[L2("LED bulb","LED বাল্ব"), 10, 5, 6], [L2("Ceiling fan","সিলিং ফ্যান"), 75, 3, 10], [L2("Fridge (compressor running)","ফ্রিজ (কম্প্রেসর চলার সময়)"), 150, 1, 10], [L2("TV","টিভি"), 80, 1, 4], [L2("Air conditioner","এসি"), 1500, 0, 6], [L2("Electric iron","ইস্ত্রি"), 1000, 1, 0.5], [L2("Rice cooker","রাইস কুকার"), 700, 1, 1], [L2("Phone charger","ফোন চার্জার"), 10, 2, 3]];
  el.innerHTML = `<div id="c11bl" style="display:grid;grid-template-columns:minmax(0,1fr) 4.2em 4.6em;gap:6px 8px;align-items:center">
    <span class="muted" style="font-size:13px">${L2("Appliance (power)","যন্ত্র (ক্ষমতা)")}</span><span class="muted" style="font-size:13px">${L2("How many","কয়টি")}</span><span class="muted" style="font-size:13px">${L2("Hours/day","ঘণ্টা/দিন")}</span>
    ${AP.map((a,i)=>`<span style="font-size:14px">${a[0]} <span class="muted">(${B11(a[1])} W)</span></span><input class="w-in" type="number" inputmode="numeric" min="0" max="20" step="1" value="${a[2]}" data-n="${i}" aria-label="${a[0]}: ${L2("how many","কয়টি")}" style="width:100%"><input class="w-in" type="number" inputmode="decimal" min="0" max="24" step="0.5" value="${a[3]}" data-h="${i}" aria-label="${a[0]}: ${L2("hours per day","প্রতিদিন ঘণ্টা")}" style="width:100%">`).join("")}</div>`
    + slider("c11bd", L2("Days","দিন"), 1, 31, 1, 30, L2("days","দিন")) + slider("c11bp", L2("Price per unit (example only)","প্রতি ইউনিটের দাম (শুধু উদাহরণ)"), 4, 15, 0.5, 8, L2("taka","টাকা"))
    + `<div class="svgwrap fit" id="c11bsv"></div><div class="w-out" id="c11bo"></div><p class="hint">${L2("Real tariffs in Bangladesh use slabs (the price rises for higher usage) plus fixed charges and VAT, and they change over time. This is only a model.","বাংলাদেশে আসল বিদ্যুৎ দর ধাপে ধাপে (বেশি ব্যবহারে দাম বাড়ে), সাথে ডিমান্ড চার্জ আর ভ্যাট যোগ হয়, আর সময়ের সাথে বদলায়। এটি শুধু একটি মডেল।")}</p>`;
  const num = (inp, max) => { let v = parseFloat(inp.value); if (!isFinite(v) || v < 0) v = 0; return Math.min(v, max); };
  const go = () => {
    const days = sv(el, "c11bd", L2("days","দিন")), price = sv(el, "c11bp", L2("taka","টাকা"), 1);
    const u = AP.map((a, i) => { const n = num($(`[data-n="${i}"]`, el), 20), h = num($(`[data-h="${i}"]`, el), 24); return a[1] * n * h * days / 1000; });
    const tot = u.reduce((s, x) => s + x, 0), mx = Math.max(...u, 0.001);
    let g = `<svg viewBox="0 0 360 ${AP.length*24+10}" role="img" aria-label="${L2("units used by each appliance","প্রতিটি যন্ত্রের ব্যবহৃত ইউনিট")}">`;
    AP.forEach((a, i) => { const y = 6 + i * 24, w = u[i] / mx * 190; g += `<text x="112" y="${y+14}" font-size="13" text-anchor="end" fill="var(--ink)">${a[0].split(" (")[0]}</text><rect x="118" y="${y+2}" width="${Math.max(w,1)}" height="16" rx="3" fill="var(--c)"/><text x="${122+Math.max(w,1)}" y="${y+15}" font-size="13" fill="var(--muted)">${F11(u[i],1)}</text>`; });
    g += `</svg>`; $("#c11bsv", el).innerHTML = g;
    $("#c11bo", el).innerHTML = L2(`Energy = Σ (W × count × hours) ÷ 1000 = <b>${F11(tot,1)} units (kWh)</b> in ${days} days<br>Bill ≈ ${F11(tot,1)} × ${F11(price,1)} = <b>${B11(Math.round(tot*price))} taka</b>`,
      `শক্তি = Σ (W × সংখ্যা × ঘণ্টা) ÷ ১০০০ = ${B11(days)} দিনে <b>${F11(tot,1)} ইউনিট (kWh)</b><br>বিল ≈ ${F11(tot,1)} × ${F11(price,1)} = <b>${B11(Math.round(tot*price))} টাকা</b>`);
  };
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 11.4 transmission loss at different voltages */
W.c11loss = (el) => {
  const VS = [0.4, 11, 33, 132, 230]; let vi = 1;
  el.innerHTML = `<div class="w-row"><span class="muted">${L2("Line voltage","লাইনের ভোল্টেজ")}:</span><div class="chipset c11lv" role="group">${VS.map((v,i)=>`<button data-i="${i}" aria-pressed="${i===vi}">${B11(v)} kV</button>`).join("")}</div></div>` +
    slider("c11lp", L2("Power sent P","পাঠানো ক্ষমতা P"), 1, 20, 1, 1, "MW") + slider("c11lr", L2("Line resistance R","লাইনের রোধ R"), 1, 20, 1, 5, "Ω") + `<div class="svgwrap fit" id="c11lsv"></div><div class="w-out" id="c11lo"></div>`;
  const go = () => {
    const P = sv(el, "c11lp", "MW") * 1e6, R = sv(el, "c11lr", "Ω"), V = VS[vi] * 1000; const I = P / V, loss = I * I * R, frac = loss / P;
    const f = Math.min(frac, 1);
    let g = `<svg viewBox="0 0 360 170" role="img" aria-label="${L2("transmission line","সঞ্চালন লাইন")}">`;
    const tower = x => `<path d="M${x} 40L${x-14} 120M${x} 40L${x+14} 120M${x-10} 60H${x+10}M${x-12} 90H${x+12}M${x-18} 50H${x+18}" stroke="var(--muted)" stroke-width="2" fill="none"/>`;
    g += `<rect x="6" y="70" width="44" height="50" fill="var(--c-soft)" stroke="var(--ink)"/><text x="28" y="135" font-size="12.5" text-anchor="middle" fill="var(--muted)">${L2("plant","কেন্দ্র")}</text>`;
    g += `<rect x="310" y="80" width="44" height="40" fill="var(--c-soft)" stroke="var(--ink)"/><text x="332" y="135" font-size="12.5" text-anchor="middle" fill="var(--muted)">${L2("town","শহর")}</text>` + tower(120) + tower(240);
    g += `<path d="M50 72 Q85 ${60+10} 120 50 Q180 ${64} 240 50 Q275 ${60+10} 310 82" fill="none" stroke="var(--bad)" stroke-width="${2+5*f}" opacity="${0.35+0.65*f}"/>`;
    g += `<path d="M50 72 Q85 70 120 50 Q180 64 240 50 Q275 70 310 82" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    for (let k = 0; k < Math.round(f * 10); k++) g += `<path d="M${80+k*22} ${34-((k%2)*6)} q4 -8 0 -14" stroke="var(--bad)" stroke-width="1.5" fill="none" opacity=".8"/>`;
    const bw = 300; g += `<rect x="30" y="150" width="${bw}" height="14" fill="var(--good-soft)" stroke="var(--rule)"/><rect x="30" y="150" width="${bw*(1-f)}" height="14" fill="var(--good)"/><rect x="${30+bw*(1-f)}" y="150" width="${bw*f}" height="14" fill="var(--bad)"/>`;
    g += `<text x="30" y="145" font-size="12.5" fill="var(--good)">${L2("delivered","পৌঁছায়")}</text><text x="330" y="145" font-size="12.5" text-anchor="end" fill="var(--bad)">${L2("lost as heat","তাপে নষ্ট")}</text></svg>`;
    $("#c11lsv", el).innerHTML = g;
    const lossS = loss >= 1e6 ? F11(loss / 1e6, 2) + " MW" : loss >= 1e3 ? F11(loss / 1e3, 2) + " kW" : F11(loss, 1) + " W";
    const pct = frac * 100;
    $("#c11lo", el).innerHTML = (frac >= 1
      ? L2(`I = P/V = ${sci11(I)} A. The I²R loss (${lossS}) would be more than all the power sent: impossible to transmit this way!`, `I = P/V = ${sci11(I)} A। I²R অপচয় (${lossS}) পাঠানো সব ক্ষমতার চেয়েও বেশি হতো: এভাবে সঞ্চালন অসম্ভব!`)
      : L2(`I = P/V = <b>${sci11(I)} A</b><br>Loss = I²R = <b>${lossS}</b> (${pct < 0.1 ? F11(pct,3) : F11(pct,1)}% of the power)`, `I = P/V = <b>${sci11(I)} A</b><br>অপচয় = I²R = <b>${lossS}</b> (ক্ষমতার ${pct < 0.1 ? F11(pct,3) : F11(pct,1)}%)`))
      + `<br><span class="muted">${L2("12 × the voltage (11 → 132 kV) → 1/12 the current → 1/144 the loss.","১২ গুণ ভোল্টেজ (১১ → ১৩২ kV) → ১/১২ প্রবাহ → ১/১৪৪ অপচয়।")}</span>`;
  };
  chips11(el, ".c11lv", b => { vi = +b.dataset.i; go(); });
  el.querySelectorAll("input").forEach(i => i.addEventListener("input", go)); go();
};

/* 11.5 safety: fault, earthing, fuse, switch position */
W.c11safe = (el) => {
  const st = { fault: "body", earth: true, fuse: true, sw: "L", on: true, wet: false };
  const tg = (k, en, bn) => `<button data-k="${k}" aria-pressed="${st[k]}">${L2(en, bn)}</button>`;
  el.innerHTML = `<div class="w-row"><span class="muted">${L2("Fault","ত্রুটি")}:</span><div class="chipset c11sf" role="group"><button data-f="none" aria-pressed="false">${L2("None","নেই")}</button><button data-f="body" aria-pressed="true">${L2("Live wire touches metal body","লাইভ তার ধাতব কাঠামো ছুঁয়েছে")}</button><button data-f="short" aria-pressed="false">${L2("Short circuit","শর্ট সার্কিট")}</button></div></div>
  <div class="chipset c11st" role="group" style="margin-top:6px">${tg("earth","Earth wire fitted","আর্থ তার লাগানো")}${tg("fuse","Fuse fitted (5 A)","ফিউজ লাগানো (৫ A)")}${tg("on","Switch ON","সুইচ চালু")}${tg("wet","Wet hands","ভেজা হাত")}</div>
  <div class="w-row" style="margin-top:6px"><span class="muted">${L2("Switch on","সুইচ কোন তারে")}:</span><div class="chipset c11ss" role="group"><button data-s="L" aria-pressed="true">${L2("live","লাইভ")}</button><button data-s="N" aria-pressed="false">${L2("neutral","নিউট্রাল")}</button></div></div>
  <div class="svgwrap fit" id="c11ssv"></div><div class="w-out" id="c11so"></div>`;
  const evalS = () => {
    const { fault, earth, fuse, sw, on, wet } = st; const Rb = wet ? 100 : 100000, Ib = 220 / Rb;
    /* returns [safe?, message, fuseBlown, bodyLive, flowToEarth, fire] */
    if (fault === "short") { if (!on && sw === "L") return [true, L2("The switch on the live wire is off, so no current flows at all. Turn it on to see the short circuit.","লাইভ তারের সুইচ বন্ধ, তাই কোনো প্রবাহই নেই। শর্ট সার্কিট দেখতে চালু করো।"), false, false, false, false];
      return fuse ? [true, L2("Short circuit: almost zero resistance, a huge current. The fuse wire melts at once and cuts off the supply. Safe.","শর্ট সার্কিট: রোধ প্রায় শূন্য, বিশাল প্রবাহ। ফিউজের তার সাথে সাথে গলে সরবরাহ বন্ধ করে দেয়। নিরাপদ।"), true, false, false, false]
        : [false, L2("Short circuit with no fuse: a huge current keeps flowing, the wires get very hot, the insulation burns: FIRE!","ফিউজ ছাড়া শর্ট সার্কিট: বিশাল প্রবাহ চলতেই থাকে, তার খুব গরম হয়, আবরণ পোড়ে: আগুন!"), false, false, false, true]; }
    if (fault === "body") {
      if (!on && sw === "L") return [true, L2("The switch is on the live wire and is off, so no high voltage reaches the appliance. Safe to touch.","সুইচ লাইভ তারে আর বন্ধ, তাই যন্ত্রে উচ্চ ভোল্টেজ পৌঁছায় না। ছোঁয়া নিরাপদ।"), false, false, false, false];
      const pre = (!on && sw === "N") ? L2("The switch is on the NEUTRAL, so even when OFF the live wire still reaches the body! ","সুইচ নিউট্রালে, তাই বন্ধ থাকলেও লাইভ তার কাঠামোয় পৌঁছে যায়! ") : "";
      if (earth && fuse) return [true, pre + L2("A large current rushes from the body through the earth wire to the ground. It blows the fuse and cuts off the supply. Touching the body is safe.","কাঠামো থেকে আর্থ তার দিয়ে বিশাল প্রবাহ মাটিতে ছুটে যায়। এতে ফিউজ গলে সরবরাহ বন্ধ হয়। কাঠামো ছোঁয়া নিরাপদ।"), true, false, true, false];
      if (earth && !fuse) return [false, pre + L2("The earth wire keeps the body near 0 V, but with no fuse the large leakage current keeps flowing and overheats the wiring: fire risk.","আর্থ তার কাঠামোকে প্রায় ০ V-এ রাখে, কিন্তু ফিউজ না থাকায় বড় ক্ষরণ প্রবাহ চলতেই থাকে আর তার অতিরিক্ত গরম হয়: আগুনের ঝুঁকি।"), false, false, true, true];
      return [false, pre + L2(`No earth wire: the metal body is at 220 V. A person touching it gets I = 220 ÷ ${Rb===100?"100":"100 000"} Ω = <b>${Ib>=1?Ib.toFixed(1)+" A":(Ib*1000).toFixed(1)+" mA"}</b> through the body. ${wet?"Far above the deadly 10 mA!":"Painful and dangerous; wet skin would make it deadly."} This is too small to blow a 5 A fuse, so the fuse does NOT protect the person.`,
        `আর্থ তার নেই: ধাতব কাঠামো ২২০ V-এ। কেউ ছুঁলে শরীরের মধ্য দিয়ে যায় I = ২২০ ÷ ${Rb===100?"১০০":"১,০০,০০০"} Ω = <b>${Ib>=1?B11(Ib.toFixed(1))+" A":B11((Ib*1000).toFixed(1))+" mA"}</b>। ${wet?"প্রাণঘাতী ১০ mA-এর বহু গুণ!":"যন্ত্রণাদায়ক ও বিপজ্জনক; ত্বক ভেজা হলে প্রাণঘাতী হতো।"} এটি ৫ A ফিউজ গলানোর জন্য খুব কম, তাই ফিউজ মানুষটিকে রক্ষা করে না।`), false, true, false, false];
    }
    if (!on) return sw === "L" ? [true, L2("No fault and the switch (on the live wire) is off: the appliance is completely dead inside. Safe.","কোনো ত্রুটি নেই আর সুইচ (লাইভ তারে) বন্ধ: যন্ত্রের ভেতরে কোথাও বিদ্যুৎ নেই। নিরাপদ।"), false, false, false, false]
      : [false, L2("The appliance is off, but the switch is on the neutral: the inside is still at 220 V. Anyone opening it to repair could get a shock.","যন্ত্র বন্ধ, কিন্তু সুইচ নিউট্রালে: ভেতরটা এখনো ২২০ V-এ। মেরামতের জন্য খুললে শক লাগতে পারে।"), false, false, false, false];
    return [true, L2("No fault: current flows live → heater → neutral. The appliance works normally and the metal body stays at 0 V.","কোনো ত্রুটি নেই: প্রবাহ লাইভ → হিটার → নিউট্রাল। যন্ত্র স্বাভাবিকভাবে চলে, ধাতব কাঠামো ০ V-এ থাকে।"), false, false, false, false];
  };
  const draw = () => {
    const [safe, msg, blown, bodyLive, toEarth, fire] = evalS(); const { fault, earth, fuse, sw, on, wet } = st;
    let g = `<svg viewBox="0 0 360 230" role="img" aria-label="${L2("appliance safety circuit","যন্ত্রের নিরাপত্তা বর্তনী")}">`;
    g += `<text x="10" y="44" font-size="14" font-weight="700" fill="var(--bad)">L</text><text x="10" y="164" font-size="14" font-weight="700" fill="var(--c)">N</text><text x="10" y="104" font-size="12.5" fill="var(--muted)">${B11(220)} V</text>`;
    /* live line with fuse and maybe switch */
    const swL = sw === "L", swOpen = !on;
    g += `<path d="M24 40H60" stroke="var(--bad)" stroke-width="2.5"/>`;
    if (fuse) g += `<rect x="60" y="33" width="36" height="14" fill="var(--sheet)" stroke="var(--ink)"/>${blown?`<path d="M62 40h12M84 40h10" stroke="var(--bad)" stroke-width="2"/><text x="78" y="28" font-size="12.5" text-anchor="middle" fill="var(--bad)">${L2("blown","গলে গেছে")}</text>`:`<path d="M62 40h32" stroke="var(--bad)" stroke-width="1.5"/>`}<text x="78" y="62" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("fuse","ফিউজ")}</text>`;
    else g += `<path d="M60 40H96" stroke="var(--bad)" stroke-width="2.5"/>`;
    const swDraw = (y, col) => `<circle cx="120" cy="${y}" r="3" fill="var(--ink)"/><circle cx="150" cy="${y}" r="3" fill="var(--ink)"/><path d="M120 ${y}L${swOpen?"146 "+(y-16):"150 "+y}" stroke="var(--ink)" stroke-width="2.5"/><text x="135" y="${y+(y<100?-18:24)}" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("switch","সুইচ")}</text><path d="M96 ${y}H120M150 ${y}H200" stroke="${col}" stroke-width="2.5"/>`;
    g += swL ? swDraw(40, "var(--bad)") : `<path d="M96 40H200" stroke="var(--bad)" stroke-width="2.5"/>`;
    g += swL ? `<path d="M24 160H200" stroke="var(--c)" stroke-width="2.5"/>` : `<path d="M24 160H96" stroke="var(--c)" stroke-width="2.5"/>` + swDraw(160, "var(--c)");
    /* appliance: metal box with heater */
    g += `<rect x="200" y="24" width="90" height="152" rx="8" fill="${bodyLive?"var(--bad-soft)":"var(--paper)"}" stroke="var(--ink)" stroke-width="3"/><text x="245" y="194" font-size="12.5" text-anchor="middle" fill="var(--muted)">${L2("metal body","ধাতব কাঠামো")}</text>`;
    g += `<path d="M200 40H230" stroke="var(--bad)" stroke-width="2"/>` + zigV11(230, 40, 160, fire ? "var(--bad)" : "var(--note)") + `<path d="M230 160H200" stroke="var(--c)" stroke-width="2"/>`;
    if (fault === "body") g += `<path d="M232 60 Q260 62 288 70" stroke="var(--bad)" stroke-width="2" fill="none" stroke-dasharray="4 3"/><text x="258" y="56" font-size="12" text-anchor="middle" fill="var(--bad)">${L2("fault","ত্রুটি")}</text>`;
    if (fault === "short") g += `<path d="M216 40V160" stroke="var(--bad)" stroke-width="3" stroke-dasharray="5 3"/><text x="212" y="104" font-size="12" text-anchor="end" fill="var(--bad)">${L2("short","শর্ট")}</text>`;
    if (fire) g += `<path d="M258 150q-10 -18 2 -32q-2 14 8 18q2 -12 10 -16q-4 16 4 30z" fill="var(--note)" stroke="var(--bad)"/>`;
    if (earth) g += `<path d="M290 170H310V200" stroke="var(--good)" stroke-width="${toEarth?4:2}" fill="none"/>` + earth11(310, 200) + `<text x="318" y="190" font-size="12" fill="var(--good)">${L2("earth","আর্থ")}</text>`;
    /* person */
    const px = 330; g += `<circle cx="${px}" cy="62" r="9" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M${px} 71V120M${px} 120L${px-10} 150M${px} 120L${px+10} 150M${px} 86L292 96" stroke="${bodyLive?"var(--bad)":"var(--ink)"}" stroke-width="2.5" fill="none"/>`;
    if (wet) g += `<path d="M${px+14} 88q4 6 0 9q-4 -3 0 -9z" fill="var(--c)"/>`;
    g += `<text x="${px}" y="40" font-size="14" font-weight="700" text-anchor="middle" fill="${safe?"var(--good)":"var(--bad)"}">${safe?L2("SAFE","নিরাপদ"):L2("DANGER","বিপদ")}</text></svg>`;
    $("#c11ssv", el).innerHTML = g; $("#c11so", el).innerHTML = msg;
  };
  chips11(el, ".c11sf", b => { st.fault = b.dataset.f; draw(); });
  chips11(el, ".c11ss", b => { st.sw = b.dataset.s; draw(); });
  el.querySelectorAll(".c11st button").forEach(b => b.addEventListener("click", () => { const k = b.dataset.k; st[k] = !st[k]; b.setAttribute("aria-pressed", st[k]); draw(); }));
  draw();
};

/* 11.6 house wiring: consumer unit with three breakers */
W.c11house = (el) => {
  const C = [
    { n: L2("Lights & fans","বাতি ও ফ্যান"), r: 5, items: [[L2("Light","বাতি"), 20], [L2("Light","বাতি"), 20], [L2("Light","বাতি"), 20], [L2("Light","বাতি"), 20], [L2("Fan","ফ্যান"), 75], [L2("Fan","ফ্যান"), 75], [L2("Fan","ফ্যান"), 75]] },
    { n: L2("Cooker","রান্নার চুলা"), r: 15, items: [[L2("Burner 1","চুলা ১"), 1500], [L2("Burner 2","চুলা ২"), 1500], [L2("Oven","ওভেন"), 1000]] },
    { n: L2("Sockets (ring)","সকেট (রিং)"), r: 30, items: [[L2("AC","এসি"), 1500], [L2("Iron","ইস্ত্রি"), 1000], [L2("Kettle","কেটলি"), 2000], [L2("Water heater","ওয়াটার হিটার"), 1500], [L2("Fridge","ফ্রিজ"), 150], [L2("TV","টিভি"), 100], [L2("Washing machine","ওয়াশিং মেশিন"), 500]] }];
  const on = C.map(c => c.items.map((_, j) => j < 2)); const trip = [false, false, false]; let main = true;
  el.innerHTML = `<div class="svgwrap fit" id="c11hsv"></div><div class="w-row"><button class="btn" id="c11hm">${L2("Main switch","মেইন সুইচ")}</button><button class="btn solid" id="c11hr">${L2("Reset tripped breakers","ট্রিপ করা ব্রেকার আবার চালু করো")}</button></div>` +
    C.map((c, i) => `<p class="hint" style="margin:10px 0 4px">${c.n} · ${B11(c.r)} A ${L2("breaker","ব্রেকার")}</p><div class="chipset" data-c="${i}" role="group">${c.items.map((it, j) => `<button data-j="${j}" aria-pressed="${on[i][j]}">${it[0]} ${B11(it[1])} W</button>`).join("")}</div>`).join("") + `<div class="w-out" id="c11ho"></div>`;
  const draw = () => {
    const I = C.map((c, i) => c.items.reduce((s, it, j) => s + (on[i][j] ? it[1] : 0), 0) / 220);
    I.forEach((x, i) => { if (x > C[i].r) trip[i] = true; });
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("house wiring","বাসার ওয়্যারিং")}">`;
    g += `<text x="8" y="22" font-size="12.5" fill="var(--muted)">${L2("supply","সরবরাহ")}</text><path d="M8 34H40M8 46H40" stroke="var(--bad)" stroke-width="2"/><path d="M8 46H40" stroke="var(--c)" stroke-width="2"/>`;
    g += `<rect x="40" y="24" width="50" height="32" rx="4" fill="var(--sheet)" stroke="var(--ink)"/><text x="65" y="45" font-size="13" text-anchor="middle" fill="var(--ink)">kWh</text><text x="65" y="72" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("meter","মিটার")}</text>`;
    g += `<path d="M90 40H112" stroke="var(--ink)" stroke-width="2"/><circle cx="114" cy="40" r="3" fill="var(--ink)"/><path d="M114 40L${main?"140 40":"136 24"}" stroke="var(--ink)" stroke-width="3"/><circle cx="140" cy="40" r="3" fill="var(--ink)"/><text x="127" y="72" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("main switch","মেইন সুইচ")}</text>`;
    g += `<rect x="150" y="8" width="202" height="184" rx="8" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/><text x="251" y="186" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("consumer unit","কনজিউমার ইউনিট")}</text>`;
    g += `<path d="M140 40H160V160" stroke="var(--bad)" stroke-width="2" fill="none"/>`;
    C.forEach((c, i) => { const y = 34 + i * 52, live = main && !trip[i], frac = Math.min(I[i] / c.r, 1.2);
      g += `<path d="M160 ${y}H172" stroke="var(--bad)" stroke-width="2"/><rect x="172" y="${y-12}" width="44" height="24" rx="4" fill="${trip[i]?"var(--bad-soft)":"var(--sheet)"}" stroke="${trip[i]?"var(--bad)":"var(--ink)"}"/><text x="194" y="${y+5}" font-size="13" text-anchor="middle" fill="var(--ink)">${B11(c.r)} A</text>`;
      g += `<rect x="224" y="${y-6}" width="120" height="12" rx="3" fill="var(--paper)" stroke="var(--rule)"/><rect x="224" y="${y-6}" width="${live?Math.min(frac,1)*120:0}" height="12" rx="3" fill="${frac>0.85?"var(--note)":"var(--good)"}"/>`;
      g += `<text x="224" y="${y+22}" font-size="12.5" fill="${trip[i]?"var(--bad)":"var(--ink)"}">${c.n}: ${trip[i]?L2("TRIPPED","ট্রিপ করেছে"):main?F11(I[i],1)+" A":L2("off","বন্ধ")}</text>`; });
    g += `</svg>`; $("#c11hsv", el).innerHTML = g;
    const tot = C.reduce((s, c, i) => s + (main && !trip[i] ? I[i] * 220 : 0), 0);
    const tr = trip.map((t, i) => t ? C[i].n : null).filter(Boolean);
    $("#c11ho", el).innerHTML = (!main ? L2("Main switch OFF: the whole house is disconnected (do this before any repair).","মেইন সুইচ বন্ধ: পুরো বাসা বিচ্ছিন্ন (যেকোনো মেরামতের আগে এটা করো)।")
      : L2(`Power in use: <b>${B11(Math.round(tot))} W</b>. In each circuit the appliances are in parallel, so their currents add: I = ΣP ÷ 220 V.`, `ব্যবহৃত ক্ষমতা: <b>${B11(Math.round(tot))} W</b>। প্রতিটি বর্তনীতে যন্ত্রগুলো সমান্তরালে, তাই প্রবাহ যোগ হয়: I = ΣP ÷ ২২০ V।`))
      + (tr.length ? `<br><b style="color:var(--bad)">${L2("Tripped","ট্রিপ করেছে")}: ${tr.join(", ")}.</b> ${L2("Switch something off, then reset.","কিছু যন্ত্র বন্ধ করে তারপর আবার চালু করো।")}` : "");
  };
  el.querySelectorAll(".chipset[data-c] button").forEach(b => b.addEventListener("click", () => { const i = +b.parentElement.dataset.c, j = +b.dataset.j; on[i][j] = !on[i][j]; b.setAttribute("aria-pressed", on[i][j]); draw(); }));
  $("#c11hm", el).addEventListener("click", () => { main = !main; draw(); });
  $("#c11hr", el).addEventListener("click", () => { C.forEach((c, i) => { const x = c.items.reduce((s, it, j) => s + (on[i][j] ? it[1] : 0), 0) / 220; if (x <= c.r) trip[i] = false; }); draw(); });
  draw();
};
