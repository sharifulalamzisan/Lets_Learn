/* ---- chapter 13 widgets: radioactivity and electronics ---- */
const B13 = x => bnNum(x, LANG);
const grp13 = x => { const s = String(Math.round(x)); return s.replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
const chips13 = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b); }));

/* 13.1 nucleus builder: notation, isotopes, α/β/γ transformations */
W.c13nuc = (el) => {
  const SYM = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu".split(" ");
  const NAME = {1:["hydrogen","হাইড্রোজেন"],2:["helium","হিলিয়াম"],3:["lithium","লিথিয়াম"],4:["beryllium","বেরিলিয়াম"],5:["boron","বোরন"],6:["carbon","কার্বন"],7:["nitrogen","নাইট্রোজেন"],8:["oxygen","অক্সিজেন"],26:["iron","লোহা"],27:["cobalt","কোবাল্ট"],28:["nickel","নিকেল"],29:["copper","তামা"],80:["mercury","পারদ"],81:["thallium","থ্যালিয়াম"],82:["lead","সিসা"],83:["bismuth","বিসমাথ"],84:["polonium","পোলোনিয়াম"],85:["astatine","অ্যাস্টাটিন"],86:["radon","রেডন"],87:["francium","ফ্রান্সিয়াম"],88:["radium","রেডিয়াম"],89:["actinium","অ্যাক্টিনিয়াম"],90:["thorium","থোরিয়াম"],91:["protactinium","প্রোট্যাক্টিনিয়াম"],92:["uranium","ইউরেনিয়াম"]};
  const MODE = {"1-1":"s","1-2":"s","1-3":"b","2-3":"s","2-4":"s","6-12":"s","6-13":"s","6-14":"b","7-14":"s","27-60":"b","28-60":"s","92-238":"a","90-234":"b","91-234":"b","92-234":"a","90-230":"a","88-226":"a","86-222":"a","84-218":"a","82-214":"b","83-214":"b","84-214":"a","82-210":"b","83-210":"b","84-210":"a","82-206":"s"};
  const START = [[6,14],[6,12],[1,3],[27,60],[92,238]];
  let Z=6, A=14, na=0, nb=0, eq="", start=[6,14];
  el.innerHTML = `<div class="chipset c13s" role="group">${START.map(([z,a],i)=>`<button data-i="${i}" aria-pressed="${i===0}">${L2(NAME[z][0],NAME[z][1])}-${B13(a)}</button>`).join("")}</div>
  <div class="svgwrap fit" id="c13nsv"></div>
  <div class="w-row" style="flex-wrap:wrap;gap:6px"><button class="btn solid" data-e="a">${L2("Emit α","α নির্গত করো")}</button><button class="btn solid" data-e="b">${L2("Emit β⁻","β⁻ নির্গত করো")}</button><button class="btn" data-e="g">${L2("Emit γ","γ নির্গত করো")}</button><button class="btn" data-e="r">${L2("Reset","আবার শুরু")}</button></div>
  <div class="w-out" id="c13no"></div>`;
  const nm = z => NAME[z] ? L2(NAME[z][0], NAME[z][1]) : L2("element "+z, "মৌল "+bnNum(z,"bn"));
  const sy = z => SYM[z-1] || "?";
  const nuc = (a,z,s) => `<span style="display:inline-flex;flex-direction:column;font-size:.72em;line-height:1.05;vertical-align:middle;text-align:right;margin-right:1px"><span>${B13(a)}</span><span>${B13(z)}</span></span>${s}`;
  const draw = () => {
    const N = A - Z, k = Math.min(12, 66/Math.sqrt(A)), d = k*0.5;
    let g = `<svg viewBox="0 0 360 200" role="img" aria-label="${L2("nucleus","নিউক্লিয়াস")}"><circle cx="95" cy="95" r="${k*Math.sqrt(A)+d+4}" fill="var(--c-soft)" opacity=".5"/>`;
    for (let i=0;i<A;i++){ const r = k*Math.sqrt(i+0.5), th = i*2.39996; const isP = Math.floor((i+1)*Z/A) > Math.floor(i*Z/A);
      g += `<circle cx="${(95+r*Math.cos(th)).toFixed(1)}" cy="${(95+r*Math.sin(th)).toFixed(1)}" r="${d.toFixed(1)}" fill="${isP?"var(--bad)":"var(--muted)"}"/>`; }
    const m = MODE[Z+"-"+A];
    const tag = m==="s" ? [L2("stable","স্থিতিশীল"),"var(--good)"] : m ? [L2("radioactive","তেজস্ক্রিয়"),"var(--bad)"] : [L2("not in our list","আমাদের তালিকায় নেই"),"var(--muted)"];
    g += `<text x="236" y="74" font-size="20" text-anchor="end" fill="var(--ink)">${B13(A)}</text><text x="236" y="120" font-size="20" text-anchor="end" fill="var(--ink)">${B13(Z)}</text><text x="242" y="114" font-size="54" font-weight="700" fill="var(--c)">${sy(Z)}</text>`;
    g += `<text x="200" y="148" font-size="16" fill="var(--ink)">${nm(Z)}-${B13(A)}</text><text x="200" y="170" font-size="15" fill="var(--bad)">● ${L2("protons","প্রোটন")} ${B13(Z)}</text><text x="200" y="192" font-size="15" fill="var(--muted)">● ${L2("neutrons","নিউট্রন")} ${B13(N)}</text>`;
    g += `<rect x="196" y="8" width="${Math.min(160,tag[0].length*8.5+18)}" height="26" rx="13" fill="none" stroke="${tag[1]}"/><text x="205" y="26" font-size="15" fill="${tag[1]}">${tag[0]}</text></svg>`;
    $("#c13nsv",el).innerHTML = g;
    let hint = m==="s" ? L2("This nucleus is stable: it does not decay.","এই নিউক্লিয়াস স্থিতিশীল: এটি ক্ষয় হয় না।") : m==="a" ? L2("In nature this nucleus decays by <b>α</b> emission.","প্রকৃতিতে এই নিউক্লিয়াস <b>α</b> নির্গত করে ক্ষয় হয়।") : m==="b" ? L2("In nature this nucleus decays by <b>β⁻</b> emission.","প্রকৃতিতে এই নিউক্লিয়াস <b>β⁻</b> নির্গত করে ক্ষয় হয়।") : L2("This combination is not in our list (it may not exist in nature, or decays differently). Press Reset to try again.","এই সমন্বয় আমাদের তালিকায় নেই (প্রকৃতিতে না-ও থাকতে পারে, বা অন্যভাবে ক্ষয় হয়)। আবার চেষ্টা করতে 'আবার শুরু' চাপো।");
    if (start[1]===238 && Z===82 && A===206) hint = L2(`You reached stable lead-206 after <b>${na} α</b> and <b>${nb} β⁻</b> decays. This is the natural uranium-238 decay chain.`,`<b>${bnNum(na,"bn")}টি α</b> আর <b>${bnNum(nb,"bn")}টি β⁻</b> ক্ষয়ের পর তুমি স্থিতিশীল সিসা-২০৬-এ পৌঁছেছ। এটাই ইউরেনিয়াম-২৩৮-এর প্রাকৃতিক ক্ষয় শৃঙ্খল।`);
    $("#c13no",el).innerHTML = (eq?eq+"<br>":"") + `A = Z + N: ${B13(A)} = ${B13(Z)} + ${B13(N)}<br>` + hint;
  };
  const reset = () => { [Z,A]=start; na=nb=0; eq=""; draw(); };
  chips13(el, ".c13s", b => { start = START[+b.dataset.i]; reset(); });
  el.querySelectorAll("[data-e]").forEach(b => b.addEventListener("click", () => {
    const e = b.dataset.e;
    if (e==="r") return reset();
    const old = nuc(A,Z,sy(Z));
    if (e==="a") { if (Z<=2 || A-4<Z-2 || A<5) return; Z-=2; A-=4; na++; eq = `${old} → ${nuc(A,Z,sy(Z))} + ${nuc(4,2,"He")} ` + L2("(Z − 2, A − 4)","(Z − ২, A − ৪)"); }
    if (e==="b") { if (A-Z<1) return; Z+=1; nb++; eq = `${old} → ${nuc(A,Z,sy(Z))} + e⁻ + ν̄ ` + L2("(a neutron became a proton: Z + 1, A same)","(একটি নিউট্রন প্রোটন হলো: Z + ১, A একই)"); }
    if (e==="g") { eq = `${old}* → ${old} + γ ` + L2("(only extra energy leaves: Z and A unchanged)","(শুধু বাড়তি শক্তি বের হয়: Z ও A অপরিবর্তিত)"); }
    draw();
  }));
  draw();
};

/* 13.1.1 alpha, beta, gamma: penetration and bending in an electric field */
W.c13rays = (el) => {
  const R = {a:["α","var(--bad)",120], b:["β","var(--c)",210], g:["γ","var(--note)",300]};
  let mode="pen", sel="all", t=0;
  el.innerHTML = `<div class="chipset c13m" role="group"><button data-m="pen" aria-pressed="true">${L2("Barriers","বাধা")}</button><button data-m="field" aria-pressed="false">${L2("Electric field","বৈদ্যুতিক ক্ষেত্র")}</button></div>
  <div class="chipset c13r" role="group"><button data-r="all" aria-pressed="true">${L2("All three","তিনটিই")}</button><button data-r="a" aria-pressed="false">α ${L2("alpha","আলফা")}</button><button data-r="b" aria-pressed="false">β ${L2("beta","বিটা")}</button><button data-r="g" aria-pressed="false">γ ${L2("gamma","গামা")}</button></div>
  <div class="svgwrap fit" id="c13rsv"></div><div class="w-out" id="c13ro"></div>`;
  const list = () => sel==="all" ? ["a","b","g"] : [sel];
  const yOf = (k) => sel==="all" ? {a:70,b:100,g:130}[k] : 100;
  // path for field mode: returns y at x
  const fy = (k,x) => { const s = {a:0.0008,b:-0.0025,g:0}[k]; const x0=180,x1=360; if (x<=x0) return 100; const u=Math.min(x,x1)-x0; let y=100+s*u*u/2; if (x>x1) y += s*(x1-x0)*(x-x1); return y; };
  const draw = () => {
    let g = `<svg viewBox="0 0 600 236" role="img" aria-label="${L2("radiation","বিকিরণ")}"><rect x="14" y="75" width="44" height="50" rx="6" fill="var(--c-soft)" stroke="var(--c)"/><text x="36" y="150" font-size="20" text-anchor="middle" fill="var(--muted)">${L2("source","উৎস")}</text>`;
    if (mode==="pen") {
      g += `<rect x="168" y="30" width="4" height="140" fill="var(--muted)"/><rect x="296" y="30" width="12" height="140" fill="var(--muted)" opacity=".7"/><rect x="430" y="30" width="40" height="140" fill="var(--ink)" opacity=".55"/>`;
      g += `<text x="170" y="198" font-size="21" text-anchor="middle" fill="var(--ink)">${L2("paper","কাগজ")}</text><text x="302" y="224" font-size="21" text-anchor="middle" fill="var(--ink)">${L2("aluminium","অ্যালুমিনিয়াম")}</text><text x="302" y="198" font-size="21" text-anchor="middle" fill="var(--muted)">${L2("few mm","কয়েক mm")}</text><text x="450" y="198" font-size="21" text-anchor="middle" fill="var(--muted)">${L2("few cm","কয়েক cm")}</text><text x="450" y="224" font-size="21" text-anchor="middle" fill="var(--ink)">${L2("lead","সিসা")}</text>`;
      for (const k of list()) { const [s,c,v]=R[k]; const y=yOf(k); const stop = k==="a"?168:k==="b"?296:590;
        g += `<line x1="58" y1="${y}" x2="${stop}" y2="${y}" stroke="${c}" stroke-width="2" opacity=".45"/>`;
        if (k==="g") g += `<line x1="470" y1="${y}" x2="590" y2="${y}" stroke="${c}" stroke-width="2" opacity=".2" stroke-dasharray="4 5"/>`;
        const L=stop-58; for (let j=0;j<4;j++){ const x = 58 + ((t*v + j*L/4) % L); const op = (k==="g" && x>470) ? .3 : 1; g += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${k==="a"?6:k==="b"?3.5:3}" fill="${c}" opacity="${op}"/>`; }
        g += `<text x="${k==="g"?560:stop-14}" y="${y-8}" font-size="24" font-weight="700" text-anchor="middle" fill="${c}">${s}</text>`; }
    } else {
      g += `<rect x="180" y="26" width="180" height="8" fill="var(--bad)" opacity=".8"/><rect x="180" y="166" width="180" height="8" fill="var(--c)" opacity=".8"/><text x="370" y="40" font-size="26" fill="var(--bad)">+</text><text x="370" y="180" font-size="26" fill="var(--c)">−</text><text x="590" y="226" font-size="21" text-anchor="end" fill="var(--muted)">${L2("bending exaggerated, not to scale","বাঁকানো অতিরঞ্জিত, স্কেল অনুযায়ী নয়")}</text>`;
      for (const k of list()) { const [s,c,v]=R[k]; let p=""; for (let x=58;x<=590;x+=8){ const y=fy(k,x); if (y<4) break; p+=`${x},${y.toFixed(1)} `; }
        g += `<polyline points="${p}" fill="none" stroke="${c}" stroke-width="2" opacity=".45"/>`;
        for (let j=0;j<4;j++){ const x = 58 + ((t*v + j*133) % 532); const y=fy(k,x); if (y>4) g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${k==="a"?6:k==="b"?3.5:3}" fill="${c}"/>`; }
        const xl = k==="b"?420:570; const yl = fy(k,xl); g += `<text x="${xl}" y="${(Math.max(16,yl)-8).toFixed(1)}" font-size="24" font-weight="700" text-anchor="middle" fill="${c}">${s}</text>`; }
    }
    $("#c13rsv",el).innerHTML = g + `</svg>`;
  };
  const info = () => {
    const T = {
      a: L2("<b>α</b>: helium nucleus, charge +2, mass about 4 u. Ionizes very strongly, so it is stopped by paper (a few cm of air). Bends slightly toward the negative plate.","<b>α</b>: হিলিয়াম নিউক্লিয়াস, চার্জ +২, ভর প্রায় ৪ u। তীব্রভাবে আয়নিত করে, তাই কাগজেই (বা কয়েক cm বাতাসে) থামে। ঋণাত্মক পাতের দিকে অল্প বাঁকে।"),
      b: L2("<b>β</b>: fast electron, charge −1, very light. Passes paper, stopped by a few mm of aluminium. Bends strongly toward the positive plate.","<b>β</b>: দ্রুতগতির ইলেকট্রন, চার্জ −১, খুব হালকা। কাগজ পার হয়, কয়েক mm অ্যালুমিনিয়ামে থামে। ধনাত্মক পাতের দিকে অনেক বাঁকে।"),
      g: L2("<b>γ</b>: electromagnetic wave, no charge, no mass. Several cm of lead reduce it greatly, but a small part can still get through. Not bent by the field.","<b>γ</b>: বিদ্যুৎচৌম্বকীয় তরঙ্গ, চার্জ নেই, ভর নেই। কয়েক cm সিসা একে অনেকখানি কমায়, তবু সামান্য অংশ পার হতে পারে। ক্ষেত্রে বাঁকে না।")};
    $("#c13ro",el).innerHTML = list().map(k=>T[k]).join("<br>");
  };
  chips13(el, ".c13m", b => { mode=b.dataset.m; draw(); });
  chips13(el, ".c13r", b => { sel=b.dataset.r; info(); draw(); });
  info();
  if (REDUCED) { t=1.3; draw(); } else animate(el, dt => { t+=dt; draw(); });
};

/* 13.1.4 half-life simulator */
W.c13decay = (el) => {
  const N0=400, C=40;
  el.innerHTML = slider("c13T",L2("Half-life T½","অর্ধায়ু T½"),2,10,1,4,"s") + `<div class="w-row" style="flex-wrap:wrap;gap:6px"><button class="btn solid" id="c13go">${L2("Start","শুরু")}</button><button class="btn" id="c13st">${L2("+1 half-life","+১ অর্ধায়ু")}</button><button class="btn" id="c13rs">${L2("Reset","আবার শুরু")}</button></div>
  <div class="svgwrap fit" id="c13gr"></div><div class="svgwrap fit" id="c13cv"></div><div class="w-out" id="c13do"></div>`;
  let alive, t, T, run=false, pts;
  const reset = () => { T = sv(el,"c13T","s"); alive = new Array(N0).fill(true); t=0; pts=[[0,N0]]; run=false; $("#c13go",el).textContent=L2("Start","শুরু"); draw(); };
  const count = () => alive.reduce((s,a)=>s+(a?1:0),0);
  const draw = () => {
    let g = `<svg viewBox="0 0 400 104" role="img" aria-label="${L2("nuclei","নিউক্লিয়াস")}">`;
    for (let i=0;i<N0;i++){ const x=5+(i%C)*9.75, y=6+Math.floor(i/C)*10; g += alive[i] ? `<circle cx="${x+4}" cy="${y+4}" r="3.6" fill="var(--c)"/>` : `<circle cx="${x+4}" cy="${y+4}" r="2" fill="var(--rule)"/>`; }
    $("#c13gr",el).innerHTML = g + `</svg>`;
    const X = s => 44 + s/(5*T)*330, Y = n => 168 - n/N0*150;
    let h = `<svg viewBox="0 0 400 194" role="img" aria-label="${L2("remaining nuclei against time","সময়ের সাথে অবশিষ্ট নিউক্লিয়াস")}"><line x1="44" y1="168" x2="392" y2="168" stroke="var(--muted)"/><line x1="44" y1="12" x2="44" y2="168" stroke="var(--muted)"/>`;
    for (let n=1;n<=5;n++){ const x=X(n*T); h += `<line x1="${x}" y1="18" x2="${x}" y2="168" stroke="var(--rule)" stroke-dasharray="3 4"/><text x="${x}" y="186" font-size="14" text-anchor="middle" fill="var(--muted)">${B13(n)}T½</text>`; }
    for (const n of [400,200,100,50]) h += `<text x="40" y="${Y(n)+5}" font-size="14" text-anchor="end" fill="var(--muted)">${B13(n)}</text><line x1="44" y1="${Y(n)}" x2="48" y2="${Y(n)}" stroke="var(--muted)"/>`;
    let th=""; for (let s=0;s<=5*T+1e-9;s+=T/20) th += `${X(s).toFixed(1)},${Y(N0*Math.pow(0.5,s/T)).toFixed(1)} `;
    h += `<polyline points="${th}" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="6 4"/>`;
    h += `<polyline points="${pts.map(p=>X(p[0]).toFixed(1)+","+Y(p[1]).toFixed(1)).join(" ")}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
    const n = count(); h += `<circle cx="${X(t)}" cy="${Y(n)}" r="5" fill="var(--bad)"/><text x="60" y="30" font-size="14" fill="var(--muted)">N · ${L2("remaining","অবশিষ্ট")}</text></svg>`;
    $("#c13cv",el).innerHTML = h;
    const exp = N0*Math.pow(0.5,t/T);
    $("#c13do",el).innerHTML = L2(`t = ${t.toFixed(1)} s = ${(t/T).toFixed(2)} half-lives<br>Remaining: <b>${n}</b> of ${N0} nuclei · formula N₀(½)<sup>t/T½</sup> = ${exp.toFixed(0)}<br>Each nucleus decays at random, yet the count follows the halving curve.`,
      `t = ${bnNum(t.toFixed(1),"bn")} s = ${bnNum((t/T).toFixed(2),"bn")}টি অর্ধায়ু<br>অবশিষ্ট: ${bnNum(N0,"bn")}টির মধ্যে <b>${bnNum(n,"bn")}টি</b> নিউক্লিয়াস · সূত্র N₀(½)<sup>t/T½</sup> = ${bnNum(exp.toFixed(0),"bn")}<br>প্রতিটি নিউক্লিয়াস এলোমেলোভাবে ক্ষয় হয়, তবু সংখ্যাটি অর্ধেক-হওয়ার বক্ররেখা মেনে চলে।`);
  };
  const step = (dt) => { if (t >= 5*T) { run=false; $("#c13go",el).textContent=L2("Start","শুরু"); return; } dt=Math.min(dt,5*T-t); const p = 1-Math.pow(0.5,dt/T); for (let i=0;i<N0;i++) if (alive[i] && Math.random()<p) alive[i]=false; t+=dt; pts.push([t,count()]); };
  $("#c13T",el).addEventListener("input", reset);
  $("#c13rs",el).addEventListener("click", reset);
  $("#c13st",el).addEventListener("click", () => { run=false; $("#c13go",el).textContent=L2("Start","শুরু"); const target=Math.min(5*T,(Math.floor(t/T+1e-6)+1)*T); while (t < target-1e-9) step(Math.min(T/20,target-t)); draw(); });
  $("#c13go",el).addEventListener("click", () => { if (t>=5*T) reset(); run=!run; $("#c13go",el).textContent = run?L2("Pause","থামাও"):L2("Start","শুরু"); });
  reset();
  animate(el, dt => { if (run) { step(dt); draw(); } });
};

/* 13.1.5 carbon dating calculator */
W.c13date = (el) => {
  const T=5730, AMAX=40000;
  el.innerHTML = slider("c13p",L2("Carbon-14 left (compared with a living sample)","অবশিষ্ট কার্বন-১৪ (জীবিত নমুনার তুলনায়)"),1,100,0.5,25,"%") + `<div class="svgwrap fit" id="c13dsv"></div><div class="w-out" id="c13dto"></div>`;
  const go = () => {
    const p = sv(el,"c13p","%",1); const n = Math.log2(100/p), age = n*T;
    const X = a => 50 + a/AMAX*340, Y = q => 160 - q/100*140;
    let g = `<svg viewBox="0 0 400 196" role="img" aria-label="${L2("carbon-14 decay curve","কার্বন-১৪ ক্ষয়ের লেখচিত্র")}"><line x1="50" y1="160" x2="392" y2="160" stroke="var(--muted)"/><line x1="50" y1="14" x2="50" y2="160" stroke="var(--muted)"/>`;
    for (let k=1;k*T<=AMAX;k++){ const x=X(k*T); g += `<line x1="${x}" y1="160" x2="${x}" y2="164" stroke="var(--muted)"/>`; }
    for (const a of [0,10000,20000,30000,40000]) g += `<text x="${X(a)}" y="180" font-size="14" text-anchor="middle" fill="var(--muted)">${B13(a/1000)}${L2("k","হা.")}</text>`;
    for (const q of [100,50,25]) g += `<text x="46" y="${Y(q)+5}" font-size="14" text-anchor="end" fill="var(--muted)">${B13(q)}%</text>`;
    let c=""; for (let a=0;a<=AMAX;a+=400) c += `${X(a).toFixed(1)},${Y(100*Math.pow(0.5,a/T)).toFixed(1)} `;
    g += `<polyline points="${c}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
    const ax = X(Math.min(age,AMAX));
    g += `<line x1="50" y1="${Y(p)}" x2="${ax}" y2="${Y(p)}" stroke="var(--bad)" stroke-dasharray="4 4"/><line x1="${ax}" y1="${Y(p)}" x2="${ax}" y2="160" stroke="var(--bad)" stroke-dasharray="4 4"/><circle cx="${ax}" cy="${Y(p)}" r="6" fill="var(--bad)"/><text x="392" y="30" font-size="14" text-anchor="end" fill="var(--muted)">${L2("age in years →","বয়স, বছরে →")}</text></svg>`;
    $("#c13dsv",el).innerHTML = g;
    const ag = grp13(Math.round(age/10)*10);
    $("#c13dto",el).innerHTML = L2(`Fraction left = ${p}% → number of half-lives n = log₂(100 ÷ ${p}) = <b>${n.toFixed(2)}</b><br>Age = n × 5730 years ≈ <b>${ag} years</b>`,
      `অবশিষ্ট ভগ্নাংশ = ${bnNum(p,"bn")}% → অর্ধায়ুর সংখ্যা n = log₂(১০০ ÷ ${bnNum(p,"bn")}) = <b>${bnNum(n.toFixed(2),"bn")}</b><br>বয়স = n × ৫৭৩০ বছর ≈ <b>${bnNum(ag,"bn")} বছর</b>`);
  };
  el.querySelector("input").addEventListener("input", go); go();
};

/* 13.2 development of electronics */
W.c13evo = (el) => {
  const E = [
    {k:"tube", t:L2("Vacuum tube","ভ্যাকুয়াম টিউব"), y:"1904", r:[5,5,1,5],
     d:L2("1883 Edison effect → 1904 Fleming's two-electrode diode (rectifier) → 1906 De Forest's triode (amplifier). ENIAC (1945) used 17 468 tubes and filled a room.","১৮৮৩ এডিসন ক্রিয়া → ১৯০৪ ফ্লেমিংয়ের দুই ইলেকট্রোডের ডায়োড (রেকটিফায়ার) → ১৯০৬ দ্য ফরেস্টের ট্রায়োড (অ্যামপ্লিফায়ার)। এনিয়াক (১৯৪৫) কম্পিউটারে ছিল ১৭ ৪৬৮টি টিউব, একটি ঘর ভরে যেত।")},
    {k:"tr", t:L2("Transistor","ট্রানজিস্টর"), y:"1947", r:[3,2,4,3],
     d:L2("Invented at Bell Laboratories in 1947 (Bardeen, Brattain, Shockley). Does the job of a tube but is small, light, needs little power, is reliable and cheap.","১৯৪৭ সালে বেল ল্যাবরেটরিতে আবিষ্কৃত (বারডিন, ব্রাটেইন, শকলি)। টিউবের কাজই করে, কিন্তু ছোট, হালকা, অল্প বিদ্যুৎ লাগে, নির্ভরযোগ্য ও সস্তা।")},
    {k:"ic", t:L2("Integrated circuit","সমন্বিত বর্তনী"), y:"1960s", r:[1,1,5,1],
     d:L2("Transistors, diodes, resistors and capacitors made together on one silicon chip. LSI, then VLSI: a modern phone chip holds billions of transistors.","ট্রানজিস্টর, ডায়োড, রেজিস্টর ও ক্যাপাসিটর একটি সিলিকন চিপে একসাথে তৈরি। LSI, তারপর VLSI: আধুনিক ফোনের চিপে শত শত কোটি ট্রানজিস্টর।")},
    {k:"fut", t:L2("Future","ভবিষ্যৎ"), y:"→", r:null,
     d:L2("ICs that carry information with light (optics), and programmable ICs (FPGA) whose circuit you set up for your own needs.","আলো (অপটিকস) দিয়ে তথ্য বহনকারী আইসি, আর প্রোগ্রামযোগ্য আইসি (FPGA), যার সার্কিট নিজের প্রয়োজনমতো সাজানো যায়।")}];
  const LAB = [L2("Size (per job)","আকার (প্রতি কাজে)"),L2("Power used","বিদ্যুৎ খরচ"),L2("Reliability","নির্ভরযোগ্যতা"),L2("Cost","দাম")];
  let i=0;
  el.innerHTML = `<div class="chipset c13e" role="group">${E.map((e,j)=>`<button data-i="${j}" aria-pressed="${j===0}">${e.t}</button>`).join("")}</div><div class="svgwrap fit" id="c13esv"></div><div id="c13eb" style="display:grid;gap:6px"></div><p class="hint" id="c13ed"></p>`;
  const pic = (k) => {
    let g = `<svg viewBox="30 0 340 150" role="img" aria-label="${E[i].t}">`;
    if (k==="tube") g += `<path d="M160 130 L160 60 Q160 14 200 14 Q240 14 240 60 L240 130 Z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><rect x="178" y="40" width="44" height="12" fill="var(--muted)"/><path d="M188 110 L194 80 L200 110 L206 80 L212 110" fill="none" stroke="var(--note)" stroke-width="3"/><circle cx="200" cy="95" r="22" fill="var(--note)" opacity=".18"/>${[176,192,208,224].map(x=>`<line x1="${x}" y1="130" x2="${x}" y2="146" stroke="var(--muted)" stroke-width="3"/>`).join("")}<text x="252" y="50" font-size="15" fill="var(--muted)">${L2("plate","প্লেট")}</text><text x="252" y="100" font-size="15" fill="var(--note)">${L2("hot filament","গরম ফিলামেন্ট")}</text>`;
    if (k==="tr") g += `<path d="M180 70 L180 44 Q200 30 220 44 L220 70 Z" fill="var(--ink)" opacity=".8"/>${[186,200,214].map(x=>`<line x1="${x}" y1="70" x2="${x}" y2="130" stroke="var(--muted)" stroke-width="3"/>`).join("")}<text x="232" y="60" font-size="15" fill="var(--muted)">${L2("3 legs, a few mm","৩টি পা, কয়েক mm")}</text>`;
    if (k==="ic") { g += `<rect x="150" y="45" width="100" height="60" rx="4" fill="var(--ink)" opacity=".8"/>`; for (let j=0;j<8;j++){ const x=158+j*12; g += `<rect x="${x}" y="35" width="5" height="10" fill="var(--muted)"/><rect x="${x}" y="105" width="5" height="10" fill="var(--muted)"/>`; } for (let a=0;a<6;a++) for (let b=0;b<3;b++) g += `<rect x="${166+a*12}" y="${57+b*12}" width="8" height="8" fill="var(--c)" opacity=".7"/>`; g += `<text x="200" y="138" font-size="15" text-anchor="middle" fill="var(--muted)">${L2("whole circuit on one chip","একটি চিপে পুরো সার্কিট")}</text>`; }
    if (k==="fut") { g += `<rect x="140" y="40" width="120" height="70" rx="6" fill="var(--c-soft)" stroke="var(--c)"/>`; for (let a=0;a<5;a++) for (let b=0;b<3;b++) g += `<rect x="${152+a*22}" y="${50+b*20}" width="14" height="12" fill="var(--c)" opacity="${(a+b)%2?0.35:0.8}"/>`; g += `<line x1="40" y1="75" x2="140" y2="75" stroke="var(--note)" stroke-width="4" stroke-dasharray="10 6"/><text x="40" y="66" font-size="15" fill="var(--note)">${L2("light signal","আলোর সিগন্যাল")}</text><text x="200" y="130" font-size="15" text-anchor="middle" fill="var(--muted)">FPGA</text>`; }
    return g + `<text x="36" y="26" font-size="18" font-weight="700" fill="var(--c)">${bnNum(E[i].y,LANG)}</text></svg>`;
  };
  const draw = () => { const e=E[i]; $("#c13esv",el).innerHTML = pic(e.k);
    $("#c13eb",el).innerHTML = e.r ? e.r.map((v,j)=>`<div class="w-row"><span class="muted" style="min-width:8.5em">${LAB[j]}</span><div class="bar" style="flex:1"><i style="width:${v*20}%"></i></div></div>`).join("") + `<span class="muted" style="font-size:13px">${L2("Longer bar = more (compared across the eras)","লম্বা দণ্ড = বেশি (যুগগুলোর তুলনায়)")}</span>` : "";
    $("#c13ed",el).innerHTML = e.d; };
  chips13(el, ".c13e", b => { i=+b.dataset.i; draw(); });
  draw();
};

/* 13.3 analog vs digital: sampling/quantising, and noise */
W.c13signal = (el) => {
  let mode="dig";
  const f = u => 0.5 + 0.3*Math.sin(2*Math.PI*u) + 0.15*Math.sin(4*Math.PI*u+1);   // 0..1
  el.innerHTML = `<div class="chipset c13g" role="group"><button data-m="dig" aria-pressed="true">${L2("Digitize","ডিজিটাল করো")}</button><button data-m="noise" aria-pressed="false">${L2("Noise","নয়েজ")}</button></div><div id="c13gin"></div><div class="svgwrap fit" id="c13gsv"></div><div class="w-out" id="c13go2"></div>`;
  const build = () => {
    $("#c13gin",el).innerHTML = mode==="dig" ? slider("c13n",L2("Samples","নমুনার সংখ্যা"),4,40,1,12,"")+slider("c13b",L2("Bits per sample","প্রতি নমুনায় বিট"),1,5,1,3,"") : slider("c13z",L2("Noise on the line","লাইনে নয়েজ"),0,0.7,0.05,0.25,"") + `<button class="btn" id="c13again">${L2("Send again","আবার পাঠাও")}</button>`;
    el.querySelectorAll("#c13gin input").forEach(x=>x.addEventListener("input",go));
    const ag=$("#c13again",el); if (ag) ag.addEventListener("click",go);
    go();
  };
  const go = () => {
    const X = u => 30 + u*555;
    if (mode==="dig") {
      const N = sv(el,"c13n",""), b = sv(el,"c13b",""), L = Math.pow(2,b);
      const Y = v => 190 - v*170;
      let g = `<svg viewBox="0 0 600 200" role="img" aria-label="${L2("analog and digital signal","অ্যানালগ ও ডিজিটাল সিগন্যাল")}">`;
      for (let l=0;l<L;l++){ const y=Y(l/(L-1)); g += `<line x1="30" y1="${y}" x2="585" y2="${y}" stroke="var(--rule)" stroke-width="1"/>`; }
      let a=""; for (let u=0;u<=1.0001;u+=0.005) a += `${X(u).toFixed(1)},${Y(f(u)).toFixed(1)} `;
      g += `<polyline points="${a}" fill="none" stroke="var(--muted)" stroke-width="2.5"/>`;
      let st="", codes=[], err=0;
      for (let k=0;k<N;k++){ const u0=k/N, u1=(k+1)/N; const v=f(u0); const q=Math.round(v*(L-1)); codes.push(q.toString(2).padStart(b,"0")); err += Math.abs(q/(L-1)-v);
        const y=Y(q/(L-1)); st += `${X(u0).toFixed(1)},${y.toFixed(1)} ${X(u1).toFixed(1)},${y.toFixed(1)} `; g += `<circle cx="${X(u0).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.5" fill="var(--bad)"/>`; }
      g += `<polyline points="${st}" fill="none" stroke="var(--c)" stroke-width="2.5"/></svg>`;
      $("#c13gsv",el).innerHTML = g;
      const shown = codes.slice(0,8).join(" ") + (codes.length>8?" …":"");
      $("#c13go2",el).innerHTML = L2(`Grey: analog signal · red dots: samples · blue steps: digital signal<br>${b} bits → 2<sup>${b}</sup> = <b>${L}</b> levels. First samples in binary: <span class="m">${shown}</span><br>Average error: <b>${(100*err/N).toFixed(1)}%</b>. More samples and more bits follow the analog wave more closely.`,
        `ধূসর: অ্যানালগ সিগন্যাল · লাল বিন্দু: নমুনা · নীল ধাপ: ডিজিটাল সিগন্যাল<br>${bnNum(b,"bn")} বিট → ২<sup>${bnNum(b,"bn")}</sup> = <b>${bnNum(L,"bn")}</b>টি স্তর। প্রথম নমুনাগুলো বাইনারিতে: <span class="m">${bnNum(shown,"bn")}</span><br>গড় ত্রুটি: <b>${bnNum((100*err/N).toFixed(1),"bn")}%</b>। নমুনা ও বিট বাড়ালে ডিজিটাল ধাপ অ্যানালগ তরঙ্গকে আরও কাছ থেকে অনুসরণ করে।`);
    } else {
      const z = sv(el,"c13z","",2); const bits=[1,0,1,1,0,0,1,0,1,1,1,0];
      const rnd = () => (Math.random()*2-1)*z;
      const row = (y0) => v => y0 - v*60;
      let g = `<svg viewBox="0 0 600 310" role="img" aria-label="${L2("noise on analog and digital signals","অ্যানালগ ও ডিজিটাল সিগন্যালে নয়েজ")}">`;
      const A = row(95); let a0="", a1="";
      for (let u=0;u<=1.0001;u+=0.005){ const v=f(u); a0 += `${X(u).toFixed(1)},${A(v).toFixed(1)} `; a1 += `${X(u).toFixed(1)},${A(v+rnd()*0.5).toFixed(1)} `; }
      g += `<text x="30" y="22" font-size="23" fill="var(--ink)">${L2("Analog: sent (grey), received (blue)","অ্যানালগ: প্রেরিত (ধূসর), প্রাপ্ত (নীল)")}</text><polyline points="${a0}" fill="none" stroke="var(--muted)" stroke-width="2"/><polyline points="${a1}" fill="none" stroke="var(--c)" stroke-width="1.8"/>`;
      const D = row(235); const n=bits.length; let d0="", d1="", rec=[], wrong=0;
      bits.forEach((bt,k)=>{ const u0=k/n,u1=(k+1)/n; let sum=0, m=0; for (let s=0;s<=10;s++){ const u=u0+(u1-u0)*s/10; const v=bt+rnd(); sum+=v; m++; d1 += `${X(u).toFixed(1)},${D(v).toFixed(1)} `; }
        d0 += `${X(u0).toFixed(1)},${D(bt)} ${X(u1).toFixed(1)},${D(bt)} `; const r = (sum/m)>0.5?1:0; rec.push(r); if (r!==bt) wrong++; });
      g += `<text x="30" y="160" font-size="23" fill="var(--ink)">${L2("Digital: above or below the dashed line?","ডিজিটাল: ড্যাশ রেখার ওপরে না নিচে?")}</text><line x1="30" y1="${D(0.5)}" x2="585" y2="${D(0.5)}" stroke="var(--note)" stroke-dasharray="5 4"/><polyline points="${d1}" fill="none" stroke="var(--c)" stroke-width="1.5"/><polyline points="${d0}" fill="none" stroke="var(--muted)" stroke-width="2" opacity=".7"/>`;
      bits.forEach((bt,k)=>{ const x=X((k+0.5)/n); g += `<text x="${x}" y="302" font-size="22" text-anchor="middle" fill="${rec[k]===bt?"var(--good)":"var(--bad)"}">${B13(rec[k])}</text>`; });
      $("#c13gsv",el).innerHTML = g + `</svg>`;
      $("#c13go2",el).innerHTML = wrong===0 ? L2(`All ${n} bits were read correctly, so the digital signal is rebuilt perfectly. The analog copy keeps every bit of the noise.`,`${bnNum(n,"bn")}টি বিটই সঠিকভাবে পড়া গেছে, তাই ডিজিটাল সিগন্যাল নিখুঁতভাবে আবার তৈরি হলো। অ্যানালগ কপিতে সব নয়েজই থেকে যায়।`)
        : L2(`${wrong} of ${n} bits were misread: the noise is now so large that it can flip bits. Real systems add extra check bits to catch such errors.`,`${bnNum(n,"bn")}টির মধ্যে ${bnNum(wrong,"bn")}টি বিট ভুল পড়া হয়েছে: নয়েজ এত বড় যে বিট উল্টে দিতে পারে। বাস্তব ব্যবস্থায় এমন ভুল ধরতে বাড়তি যাচাই-বিট যোগ করা হয়।`);
    }
  };
  chips13(el, ".c13g", b => { mode=b.dataset.m; build(); });
  build();
};

/* 13.4 silicon crystal: pure, n-type (P), p-type (B) */
W.c13dope = (el) => {
  let mode="cold", t=0;
  const M = [["cold",L2("Pure Si (cold)","বিশুদ্ধ Si (ঠান্ডা)")],["warm",L2("Pure Si (warm)","বিশুদ্ধ Si (গরম)")],["n",L2("n-type (add P)","n ধরন (P মেশাও)")],["p",L2("p-type (add B)","p ধরন (B মেশাও)")]];
  el.innerHTML = `<div class="chipset c13d" role="group">${M.map(([k,l])=>`<button data-m="${k}" aria-pressed="${k===mode}">${l}</button>`).join("")}</div><div class="svgwrap fit" id="c13psv"></div><div class="w-out" id="c13po"></div>`;
  const xs=[80,170,260,350,440], ys=[55,145,235];
  // bond electron positions on the middle row (for hole hopping), sorted by x
  const rowDots=[]; for (let i=-1;i<5;i++){ const xa = i<0?30:xs[i], xb = i===4?490:xs[i+1]; if (i<0||i===4){ rowDots.push(i<0?xb-28:xa+28); } else { const m=(xa+xb)/2; rowDots.push(m-8, m+8); } }
  const draw = () => {
    let g = `<svg viewBox="0 0 520 290" role="img" aria-label="${L2("silicon crystal","সিলিকন কেলাস")}"><text x="10" y="150" font-size="22" font-weight="700" fill="var(--c)">−</text><text x="498" y="150" font-size="22" font-weight="700" fill="var(--bad)">+</text>`;
    const holeK = (mode==="p"||mode==="warm") ? ((mode==="p"?5:7) - Math.floor(t/0.7)%8 + 80)%rowDots.length : -1;
    const hx = holeK>=0 ? rowDots[holeK] : -99;
    for (let j=0;j<3;j++) for (let i=0;i<5;i++){ const x=xs[i], y=ys[j];
      const right = i<4 ? xs[i+1] : 490, down = j<2 ? ys[j+1] : 285;
      g += `<line x1="${x}" y1="${y}" x2="${right}" y2="${y}" stroke="var(--rule)" stroke-width="3"/>`;
      if (i===0) g += `<line x1="30" y1="${y}" x2="${x}" y2="${y}" stroke="var(--rule)" stroke-width="3"/>`;
      g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${down}" stroke="var(--rule)" stroke-width="3"/>`;
      if (j===0) g += `<line x1="${x}" y1="5" x2="${x}" y2="${y}" stroke="var(--rule)" stroke-width="3"/>`;
      // vertical bond dots
      const my = j<2 ? (y+down)/2 : (y+285)/2; g += `<circle cx="${x-6}" cy="${my}" r="4" fill="var(--c)"/><circle cx="${x+6}" cy="${my}" r="4" fill="var(--c)"/>`;
      if (j===0) g += `<circle cx="${x-6}" cy="${(5+y)/2}" r="4" fill="var(--c)"/><circle cx="${x+6}" cy="${(5+y)/2}" r="4" fill="var(--c)"/>`;
      if (j!==1) { const pts = i===0 ? [x-28] : []; if (i<4) { const m=(x+right)/2; pts.push(m-8,m+8); } else pts.push(x+28); pts.forEach(px=>g += `<circle cx="${px}" cy="${y-6}" r="4" fill="var(--c)"/>`); }
    }
    rowDots.forEach((px,k)=>{ g += k===holeK ? `<circle cx="${px}" cy="${ys[1]-6}" r="5" fill="var(--sheet)" stroke="var(--bad)" stroke-width="2.5"/>` : `<circle cx="${px}" cy="${ys[1]-6}" r="4" fill="var(--c)"/>`; });
    for (let j=0;j<3;j++) for (let i=0;i<5;i++){ const centre = (i===2&&j===1); const lab = centre && mode==="n" ? "P⁺" : centre && mode==="p" ? "B⁻" : "Si";
      g += `<circle cx="${xs[i]}" cy="${ys[j]}" r="22" fill="${centre&&(mode==="n"||mode==="p")?"var(--note)":"var(--c-soft)"}" stroke="var(--c)" stroke-width="1.5"/><text x="${xs[i]}" y="${ys[j]+6}" font-size="17" font-weight="700" text-anchor="middle" fill="var(--ink)">${lab}</text>`; }
    if (mode==="n" || mode==="warm") { const x = 30 + ((t*55 + (mode==="n"?230:120)) % 460); const y = 100 + 6*Math.sin(t*5);
      g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="var(--bad)"/><text x="${x.toFixed(1)}" y="${(y-10).toFixed(1)}" font-size="19" text-anchor="middle" fill="var(--bad)">e⁻ →</text>`; }
    if (holeK>=0) g += `<text x="${hx}" y="${ys[1]+38}" font-size="19" text-anchor="middle" fill="var(--bad)">← ${L2("hole","হোল")}</text>`;
    $("#c13psv",el).innerHTML = g + `</svg>`;
  };
  const txt = {
    cold: L2("Every Si atom shares its 4 outer electrons with 4 neighbours (2 electrons per bond), so each feels 8. All electrons are held in bonds: almost no current flows.","প্রতিটি Si পরমাণু তার ৪টি বাইরের ইলেকট্রন ৪ প্রতিবেশীর সাথে ভাগ করে (প্রতি বন্ধনে ২টি ইলেকট্রন), তাই প্রত্যেকে ৮টি অনুভব করে। সব ইলেকট্রন বন্ধনে আটকে: প্রায় কোনো প্রবাহ নেই।"),
    warm: L2("Heat shakes one electron free: it drifts toward +, and the empty place it left (a hole) moves toward −. More heat → more free charges → lower resistance.","তাপে একটি ইলেকট্রন মুক্ত হয়: এটি + দিকে সরে, আর এর রেখে যাওয়া ফাঁকা জায়গা (হোল) − দিকে সরে। বেশি তাপ → বেশি মুক্ত চার্জ → কম রোধ।"),
    n: L2("Phosphorus has 5 outer electrons. Four form bonds; the fifth is free and drifts toward +. The phosphorus stays as a fixed positive ion, so the crystal is still neutral overall.","ফসফরাসের শেষ কক্ষপথে ৫টি ইলেকট্রন। চারটি বন্ধন গড়ে; পঞ্চমটি মুক্ত হয়ে + দিকে সরে। ফসফরাস স্থির ধনাত্মক আয়ন হয়ে থাকে, তাই কেলাস সামগ্রিকভাবে নিরপেক্ষ।"),
    p: L2("Boron has only 3 outer electrons, so one bond is missing an electron: a hole. Neighbouring electrons jump in one after another, so the hole moves toward − like a positive charge. Boron stays as a fixed negative ion.","বোরনের শেষ কক্ষপথে মাত্র ৩টি ইলেকট্রন, তাই একটি বন্ধনে একটি ইলেকট্রন কম: একটি হোল। পাশের ইলেকট্রনগুলো একটার পর একটা লাফিয়ে আসে, তাই হোলটি ধনাত্মক চার্জের মতো − দিকে সরে। বোরন স্থির ঋণাত্মক আয়ন হয়ে থাকে।")};
  const upd = () => { $("#c13po",el).innerHTML = txt[mode]; draw(); };
  chips13(el, ".c13d", b => { mode=b.dataset.m; upd(); });
  upd();
  if (REDUCED) { t=1.5; draw(); } else animate(el, dt => { t+=dt; if (mode!=="cold") draw(); });
};
