/* ---- chapter 1 extra widgets (upgrades + new) ---- */
(()=>{
const pressAll = (el, sel, b) => el.querySelectorAll(sel).forEach(q=>q.setAttribute("aria-pressed", q===b));

/* 1.4 objectives of physics: mystery → law → technology */
W.objectives = (el) => {
  const EX = [
    { k:L2("Lightning","বজ্রপাত"), m:L2("Why does a flash of lightning appear in a storm cloud?","ঝড়ের মেঘে বিদ্যুৎ চমকায় কেন?"),
      l:L2("Charges collect in clouds; a huge discharge jumps through the air (electrostatics).","মেঘে আধান জমে; বাতাসের মধ্য দিয়ে বিশাল তড়িৎ ক্ষরণ ঘটে (স্থির তড়িৎ)।"),
      t:L2("Lightning conductors on tall buildings protect people and property.","উঁচু ভবনের বজ্রনিরোধক মানুষ ও সম্পদ রক্ষা করে।") },
    { k:L2("Falling apple","আপেল পড়া"), m:L2("Why does an apple fall down, but the Moon doesn't fall on us?","আপেল নিচে পড়ে, কিন্তু চাঁদ আমাদের ওপর পড়ে না কেন?"),
      l:L2("Newton's law of gravitation: every mass attracts every other mass.","নিউটনের মহাকর্ষ সূত্র: প্রতিটি ভর অন্য প্রতিটি ভরকে আকর্ষণ করে।"),
      t:L2("Satellites like Bangabandhu Satellite-1 are placed in orbit using this law.","এই সূত্র কাজে লাগিয়েই বঙ্গবন্ধু স্যাটেলাইট-১-এর মতো উপগ্রহ কক্ষপথে বসানো হয়।") },
    { k:L2("Magnet and coil","চুম্বক ও কুণ্ডলী"), m:L2("Can a moving magnet make electricity?","চলন্ত চুম্বক কি বিদ্যুৎ তৈরি করতে পারে?"),
      l:L2("Faraday's law of electromagnetic induction.","ফ্যারাডের তড়িৎচৌম্বক আবেশ সূত্র।"),
      t:L2("Generators in every power plant, from Kaptai to Rooppur, light our homes.","কাপ্তাই থেকে রূপপুর, প্রতিটি বিদ্যুৎকেন্দ্রের জেনারেটর আমাদের ঘর আলোকিত করে।") },
    { k:L2("Rainbow","রংধনু"), m:L2("Why do we see seven colours after rain?","বৃষ্টির পর সাত রং দেখি কেন?"),
      l:L2("White light splits into colours when it refracts (dispersion).","প্রতিসরণের সময় সাদা আলো রঙে ভাগ হয় (বিচ্ছুরণ)।"),
      t:L2("Optical fibres and prisms in the internet cables and cameras we use.","ইন্টারনেট কেবল ও ক্যামেরায় অপটিক্যাল ফাইবার ও প্রিজম।") } ];
  let i = 0;
  el.innerHTML = `<div class="chipset" role="group">${EX.map((e,j)=>`<button data-i="${j}" aria-pressed="${j===0}">${e.k}</button>`).join("")}</div><div id="obflow" style="display:grid;gap:6px;margin-top:10px"></div>`;
  const card = (n, head, body, col) => `<div style="border:1px solid var(--rule);border-left:5px solid ${col};border-radius:10px;padding:8px 12px;background:var(--paper)"><div class="hint" style="font-weight:700;color:${col}">${bnNum(n,LANG)}. ${head}</div><div>${body}</div></div>`;
  const arrow = `<div aria-hidden="true" style="text-align:center;color:var(--muted);font-size:20px;line-height:1">↓</div>`;
  const go = () => { const e = EX[i]; $("#obflow",el).innerHTML =
    card(1, L2("Unfold a mystery of nature","প্রকৃতির রহস্য উন্মোচন"), e.m, "var(--note)") + arrow +
    card(2, L2("Find the law behind it","এর পেছনের সূত্র খুঁজে বের করা"), e.l, "var(--c)") + arrow +
    card(3, L2("Use the law to build technology","সূত্র কাজে লাগিয়ে প্রযুক্তি তৈরি"), e.t, "var(--good)"); };
  el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ i=+b.dataset.i; pressAll(el,"button",b); go(); }));
  go();
};

/* 1.5 orders of magnitude: readable ladder + compare two things */
W.magnitudes = (el) => {
  const items = {
    m:[[-15,1,L2("Radius of a proton","প্রোটনের ব্যাসার্ধ"),"⚛"],[-11,5,L2("Radius of a hydrogen atom","হাইড্রোজেন পরমাণুর ব্যাসার্ধ"),"•"],[-8,1,L2("Length of a virus","ভাইরাসের দৈর্ঘ্য"),"🦠"],[0,1,L2("Height of a small child","ছোট শিশুর উচ্চতা"),"🧒"],[3,9,L2("Height of Everest","এভারেস্টের উচ্চতা"),"🏔"],[6,6,L2("Radius of the Earth","পৃথিবীর ব্যাসার্ধ"),"🌍"],[12,6,L2("Radius of the solar system","সৌরজগতের ব্যাসার্ধ"),"☀"],[16,4,L2("Distance to the nearest star","নিকটতম নক্ষত্রের দূরত্ব"),"✦"],[22,2,L2("Distance to the nearest galaxy","নিকটতম গ্যালাক্সির দূরত্ব"),"🌌"]],
    kg:[[-31,9,L2("An electron","একটি ইলেকট্রন"),"e⁻"],[-7,7,L2("A speck of dust","এক কণা ধুলা"),"·"],[1,6,L2("A person","একজন মানুষ"),"🧍"],[3,5,L2("An elephant","একটি হাতি"),"🐘"],[7,7,L2("A ship","একটি জাহাজ"),"🚢"],[24,6,L2("The Earth","পৃথিবী"),"🌍"],[30,2,L2("The Sun","সূর্য"),"☀"],[41,2,L2("Our galaxy","আমাদের গ্যালাক্সি"),"🌌"]],
    s:[[-21,4,L2("One vibration of a gamma ray","গামা রশ্মির একটি কম্পন"),"γ"],[-15,2,L2("One vibration of green light","সবুজ আলোর একটি কম্পন"),"💡"],[-6,2,L2("Lifetime of a muon","মিউয়নের আয়ু"),"μ"],[0,1,L2("One heartbeat","একটি হৃৎস্পন্দন"),"❤"],[4,9,L2("One day","একদিন"),"📅"],[12,8,L2("Time since the first humans","মানুষের আবির্ভাব থেকে"),"🧍"],[14,2,L2("Time since dinosaurs died out","ডাইনোসর বিলুপ্তির পর থেকে"),"🦕"],[17,4,L2("Time since the Big Bang","বিগ ব্যাং থেকে এ পর্যন্ত"),"✨"]] };
  const kinds = [["m",L2("Length","দৈর্ঘ্য")],["kg",L2("Mass","ভর")],["s",L2("Time","সময়")]];
  let kind="m", pick=[];
  el.innerHTML = `<div class="chipset" role="group" id="mgk">${kinds.map(([k,l])=>`<button data-k="${k}" aria-pressed="${k===kind}">${l}</button>`).join("")}</div>
    <p class="hint" style="margin:8px 0 4px">${L2("Tap any two rows to compare them.","তুলনা করতে যেকোনো দুটি সারিতে চাপ দাও।")}</p>
    <div id="mgl" style="display:grid;gap:4px"></div><div class="w-out" id="mgo" style="margin-top:8px"></div>`;
  const sup = n => bnNum(n,LANG).replace("-","−");
  const val = it => `${bnNum(it[1],LANG)} × ${bnNum(10,LANG)}<sup>${sup(it[0])}</sup> ${kind}`;
  const go = () => {
    const list = items[kind]; const lo = list[0][0]-2, hi = list[list.length-1][0]+2;
    $("#mgl",el).innerHTML = list.slice().reverse().map((it)=>{ const idx=list.indexOf(it); const on = pick.includes(idx); const pos = (it[0]+Math.log10(it[1])-lo)/(hi-lo)*100;
      return `<button data-i="${idx}" style="all:unset;cursor:pointer;display:grid;grid-template-columns:2em 1fr;gap:8px;align-items:center;padding:6px 8px;border-radius:10px;border:1px solid ${on?"var(--c)":"var(--rule)"};background:${on?"var(--c-soft)":"var(--paper)"}">
        <span style="font-size:20px;text-align:center" aria-hidden="true">${it[3]}</span>
        <span style="min-width:0"><span style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><span>${it[2]}</span><b style="font-variant-numeric:tabular-nums">${val(it)}</b></span>
        <span style="display:block;position:relative;height:6px;border-radius:3px;background:var(--rule);margin-top:5px"><span style="position:absolute;left:calc(${pos}% - 6px);top:-3px;width:12px;height:12px;border-radius:50%;background:var(--c)"></span></span></span></button>`; }).join("");
    $("#mgl",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ const i=+b.dataset.i; pick = pick.includes(i) ? pick.filter(x=>x!==i) : [...pick.slice(-1), i]; go(); }));
    if(pick.length===2){ const [a,b] = pick.map(i=>list[i]).sort((x,y)=>(x[0]+Math.log10(x[1]))-(y[0]+Math.log10(y[1]))); const steps = Math.round(b[0]+Math.log10(b[1])-(a[0]+Math.log10(a[1])));
      $("#mgo",el).innerHTML = L2(`<b>${b[2]}</b> is about 10<sup>${steps}</sup> times <b>${a[2]}</b>. That is ${steps} steps of "×10" on the ladder: a 1 followed by ${steps} zeros!`,
        `<b>${b[2]}</b> হলো <b>${a[2]}</b>-এর প্রায় ১০<sup>${sup(steps)}</sup> গুণ। অর্থাৎ মইয়ের "×১০"-এর ${sup(steps)}টি ধাপ: ১-এর পরে ${sup(steps)}টি শূন্য!`);
    } else $("#mgo",el).innerHTML = L2("Each row is on a ×10 ladder: the dot moves one notch every time the value becomes 10 times bigger.","প্রতিটি সারি ×১০ মইয়ের ওপর: মান ১০ গুণ বড় হলে বিন্দুটি এক ঘর সরে।");
  };
  $("#mgk",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ kind=b.dataset.k; pick=[]; pressAll($("#mgk",el),"button",b); go(); }));
  go();
};

/* 1.5.1 SI units: why a standard unit + the seven base units */
W.siunits = (el) => {
  const BASE = [[L2("Length","দৈর্ঘ্য"),L2("metre","মিটার"),"m",L2("the distance light travels in 1/299 792 458 s","আলো ১/২৯৯ ৭৯২ ৪৫৮ সেকেন্ডে যে দূরত্ব যায়")],
    [L2("Mass","ভর"),L2("kilogram","কিলোগ্রাম"),"kg",L2("fixed from Planck's constant","প্ল্যাঙ্কের ধ্রুবক থেকে নির্ধারিত")],
    [L2("Time","সময়"),L2("second","সেকেন্ড"),"s",L2("9 192 631 770 vibrations of a caesium-133 atom","সিজিয়াম-১৩৩ পরমাণুর ৯ ১৯২ ৬৩১ ৭৭০টি কম্পন")],
    [L2("Temperature","তাপমাত্রা"),L2("kelvin","কেলভিন"),"K",L2("fixed from Boltzmann's constant","বোল্টজম্যান ধ্রুবক থেকে নির্ধারিত")],
    [L2("Electric current","তড়িৎ প্রবাহ"),L2("ampere","অ্যাম্পিয়ার"),"A",L2("fixed from the charge of an electron","ইলেকট্রনের আধান থেকে নির্ধারিত")],
    [L2("Luminous intensity","দীপন তীব্রতা"),L2("candela","ক্যান্ডেলা"),"cd",L2("brightness of light in a given direction","নির্দিষ্ট দিকে আলোর উজ্জ্বলতা")],
    [L2("Amount of substance","পদার্থের পরিমাণ"),L2("mole","মোল"),"mol",L2("6.022 × 10²³ particles (Avogadro's number)","৬.০২২ × ১০²³টি কণা (অ্যাভোগাড্রো সংখ্যা)")]];
  el.innerHTML = `<div class="chipset" role="group" id="sit"><button data-t="why" aria-pressed="true">${L2("Why one standard unit?","একটি মানক একক কেন?")}</button><button data-t="base" aria-pressed="false">${L2("The 7 base units","৭টি মৌলিক একক")}</button></div><div id="sib" style="margin-top:10px"></div>`;
  const TABLE = 1.2; // m
  const units = [[L2("Rahim's hand-span","রহিমের বিঘত"),0.18],[L2("Karim's hand-span","করিমের বিঘত"),0.22],[L2("A pencil","একটি পেনসিল"),0.15],[L2("Metre scale","মিটার স্কেল"),1]];
  const why = () => { let u = 0;
    $("#sib",el).innerHTML = `<p class="hint" style="margin:0 0 6px">${L2("Measure the same table with different \"units\":","একই টেবিল বিভিন্ন \"একক\" দিয়ে মাপো:")}</p><div class="chipset" id="siu">${units.map((x,j)=>`<button data-u="${j}" aria-pressed="${j===0}">${x[0]}</button>`).join("")}</div><div class="svgwrap fit" id="sisvg"></div><div class="w-out" id="sio"></div>`;
    const draw = () => { const [name, len] = units[u]; const n = TABLE/len; const px = 300/TABLE;
      let s = `<svg viewBox="0 0 360 120" role="img" aria-label="table"><rect x="30" y="30" width="300" height="16" rx="3" fill="var(--note)" opacity=".8"/><rect x="40" y="46" width="10" height="50" fill="var(--note)" opacity=".8"/><rect x="310" y="46" width="10" height="50" fill="var(--note)" opacity=".8"/>`;
      for(let k=0;k<Math.floor(n);k++) s += `<rect x="${30+k*len*px}" y="10" width="${len*px}" height="14" fill="${k%2?"var(--c-soft)":"var(--c)"}" opacity=".85"/>`;
      const rem = n-Math.floor(n); if(rem>0.01) s += `<rect x="${30+Math.floor(n)*len*px}" y="10" width="${rem*len*px}" height="14" fill="var(--bad)" opacity=".5"/>`;
      s += `<text x="180" y="116" font-size="14" text-anchor="middle" fill="var(--muted)">${L2("the same table","একই টেবিল")}</text></svg>`;
      $("#sisvg",el).innerHTML = s;
      $("#sio",el).innerHTML = L2(`Table = <b>${n.toFixed(1)} × ${name}</b>. `,`টেবিল = <b>${bnNum(n.toFixed(1),"bn")} × ${name}</b>। `) + (u<3 ? L2("Rahim gets 6.7 spans, Karim gets 5.5 spans for the same table! A hand-span is different for everyone, so the number means nothing to someone else.","একই টেবিলে রহিম পায় ৬.৭ বিঘত, করিম পায় ৫.৫ বিঘত! বিঘত একেকজনের একেক রকম, তাই অন্য কারও কাছে সংখ্যাটির কোনো মানে নেই।") : L2("With the metre, everyone in the world gets the same answer: <b>1.2 m</b>. That is why we need a standard, international unit (SI).","মিটার দিয়ে পৃথিবীর সবাই একই উত্তর পায়: <b>১.২ m</b>। তাই দরকার একটি মানক, আন্তর্জাতিক একক (SI)।"));
    };
    $("#siu",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ u=+b.dataset.u; pressAll($("#siu",el),"button",b); draw(); }));
    draw(); };
  const base = () => {
    $("#sib",el).innerHTML = `<p class="hint" style="margin:0 0 6px">${L2("Tap a card to see how the unit is defined today.","একক আজ কীভাবে সংজ্ঞায়িত, দেখতে কার্ডে চাপ দাও।")}</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:8px">${BASE.map((b,j)=>`<button data-j="${j}" style="all:unset;cursor:pointer;border:1px solid var(--rule);border-radius:12px;padding:10px;background:var(--paper);display:grid;gap:2px;min-height:92px"><span class="hint">${b[0]}</span><span style="font-family:var(--f-mono);font-size:26px;font-weight:700;color:var(--c)">${b[2]}</span><span>${b[1]}</span><span class="hint sidef" hidden>${b[3]}</span></button>`).join("")}</div>
      <div class="w-out" style="margin-top:8px">${L2("Every other unit is built from these seven: e.g. speed m s<sup>−1</sup>, force newton N = kg m s<sup>−2</sup>.","বাকি সব একক এই সাতটি দিয়ে তৈরি: যেমন বেগ m s<sup>−১</sup>, বল নিউটন N = kg m s<sup>−২</sup>।")}</div>`;
    $("#sib",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ const d=$(".sidef",b); d.hidden=!d.hidden; b.style.borderColor = d.hidden?"var(--rule)":"var(--c)"; }));
  };
  $("#sit",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ pressAll($("#sit",el),"button",b); b.dataset.t==="why"?why():base(); }));
  why();
};

/* 1.5.4 scientific notation: move the decimal point */
W.scinote = (el) => {
  const P = [[L2("Speed of light (m/s)","আলোর বেগ (m/s)"),"300000000"],[L2("Population of Bangladesh (approx.)","বাংলাদেশের জনসংখ্যা (প্রায়)"),"170000000"],[L2("Thickness of a paper (m)","একটি কাগজের পুরুত্ব (m)"),"0.0001"],[L2("Size of a bacterium (m)","একটি ব্যাকটেরিয়ার আকার (m)"),"0.000002"],[L2("Mass of a grain of rice (kg)","একটি চালের দানার ভর (kg)"),"0.00002"]];
  let pi = 0, shift = 0;
  el.innerHTML = `<div class="chipset" role="group" id="snp">${P.map((p,j)=>`<button data-j="${j}" aria-pressed="${j===0}">${p[0]}</button>`).join("")}</div>
    <div id="snbox" style="margin:12px 0;font-family:var(--f-mono);font-size:24px;font-weight:700;text-align:center;overflow-wrap:anywhere"></div>
    <div class="w-row" style="justify-content:center"><button class="btn" id="snl">← ${L2("point left","দশমিক বাঁয়ে")}</button><button class="btn" id="snr">${L2("point right","দশমিক ডানে")} →</button><button class="btn solid" id="sna">${L2("Show answer","উত্তর দেখাও")}</button></div>
    <div class="w-out" id="sno" style="margin-top:8px"></div>`;
  const digits = s => { const [a,b=""] = s.split("."); return {int:a, frac:b}; };
  const render = () => {
    const raw = P[pi][1]; const {int,frac} = digits(raw); const all = (int+frac).replace(/^0+/,""); const lead = int.replace(/^0+/,"").length; // digits before point in original (non-zero part)
    // original exponent of first significant digit
    const firstExp = lead>0 ? lead-1 : -(frac.search(/[1-9]/)+1);
    const sig = all.replace(/0+$/,"") || "0";
    const mantDigits = 1 + shift; // digits before point after moving
    let mant; if(mantDigits>=sig.length) mant = sig + "0".repeat(mantDigits-sig.length); else if(mantDigits<=0) mant = "0." + "0".repeat(-mantDigits) + sig; else mant = sig.slice(0,mantDigits)+"."+sig.slice(mantDigits);
    const exp = firstExp - shift;
    const ok = shift===0;
    $("#snbox",el).innerHTML = `${bnNum(raw,LANG)}<div style="font-size:20px;margin-top:6px;color:${ok?"var(--good)":"var(--c)"}">= ${bnNum(mant,LANG)} × ${bnNum(10,LANG)}<sup>${bnNum(exp,LANG).replace("-","−")}</sup></div>`;
    $("#sno",el).innerHTML = ok ? L2(`✓ Scientific notation: exactly <b>one non-zero digit</b> before the point. Moving the point ${firstExp>=0?"left":"right"} ${Math.abs(firstExp)} places gives the power ${firstExp}.`,`✓ বৈজ্ঞানিক প্রতীক: দশমিকের আগে ঠিক <b>একটি অশূন্য অঙ্ক</b>। দশমিক ${firstExp>=0?"বাঁয়ে":"ডানে"} ${bnNum(Math.abs(firstExp),"bn")} ঘর সরালে ঘাত হয় ${bnNum(firstExp,"bn").replace("-","−")}।`)
      : L2(`Every place the point moves left, the power goes up by 1; every place right, it goes down by 1. Keep moving until one non-zero digit is left before the point.`,`দশমিক এক ঘর বাঁয়ে সরালে ঘাত ১ বাড়ে; এক ঘর ডানে সরালে ১ কমে। দশমিকের আগে একটি অশূন্য অঙ্ক না থাকা পর্যন্ত সরাতে থাকো।`);
  };
  const start = () => { const {int,frac} = digits(P[pi][1]); const lead = int.replace(/^0+/,"").length; const firstExp = lead>0 ? lead-1 : -(frac.search(/[1-9]/)+1); shift = firstExp; render(); };
  // shift = firstExp means mantissa = the original number (power 0)
  $("#snl",el).addEventListener("click",()=>{ shift--; render(); });
  $("#snr",el).addEventListener("click",()=>{ shift++; render(); });
  $("#sna",el).addEventListener("click",()=>{ shift=0; render(); });
  $("#snp",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ pi=+b.dataset.j; pressAll($("#snp",el),"button",b); start(); }));
  start();
};
})();

/* 1.6 screw gauge — practical, student-friendly version */
(()=>{
W.screw = (el) => {
  const LC = 0.01, MAXR = 7;
  const K = 18;            // px per mm in the main drawing
  const AX = 52;           // anvil face x
  const S0 = 206;          // x of the 0 mark on the sleeve
  const RY = 92;           // reference line y
  let mode = "measure", wire = 3.47, ze = 0, obs = 6.2, step = 0, ratchet = false;
  // obs = reading on the scales (thimble position). gap = obs - ze*LC = distance anvil→spindle
  const T = { // UI text
    m1:L2("1 · Measure a wire","১ · তার মাপো"), m2:L2("2 · How it works","২ · কীভাবে কাজ করে"), m3:L2("3 · Zero error","৩ · শূন্য ত্রুটি") };
  el.innerHTML = `<div class="chipset" role="group" id="sgm"><button data-m="measure" aria-pressed="true">${T.m1}</button><button data-m="learn" aria-pressed="false">${T.m2}</button><button data-m="zero" aria-pressed="false">${T.m3}</button></div>
    <p class="hint" id="sgtask" style="margin:8px 0 4px"></p>
    <div class="svgwrap fit" id="sgsvg"></div>
    <div class="w-row" style="justify-content:center;gap:6px;margin-top:4px">
      <button class="btn" id="sgo10">⟲ ${L2("Open 1 turn","এক পাক খোলো")}</button>
      <button class="btn" id="sgo1">${L2("Open 1 div","১ ঘর খোলো")}</button>
      <button class="btn" id="sgc1">${L2("Close 1 div","১ ঘর বন্ধ")}</button>
      <button class="btn solid" id="sgc10">${L2("Close","বন্ধ করো")} ⟳</button>
    </div>
    <div id="sgextra" style="margin-top:8px"></div>
    <div class="w-out" id="sgout" style="margin-top:8px"></div>`;
  const fmt = (x,d=2)=>bnNum((+x).toFixed(d),LANG).replace("-","−");
  const n = x=>bnNum(x,LANG);
  const gap = () => Math.round((obs - ze*LC)*100)/100;
  const minGap = () => (mode==="learn" ? 0 : (mode==="zero" && wire===0 ? 0 : wire));
  const parts = (r) => { const rr=Math.round(r*100)/100; let lin=Math.floor(rr+1e-9); let circ=Math.round((rr-lin)*100); if(circ===100){lin++;circ=0;} return {rr,lin,circ}; };

  const draw = () => {
    const g = gap(), {rr,lin,circ} = parts(obs);
    const tip = AX + g*K, tx = S0 + obs*K;
    const hl = (k)=> step===k;
    let s = `<svg viewBox="0 0 420 360" role="img" aria-label="screw gauge">
      <defs><linearGradient id="sgcyl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c-soft)"/><stop offset=".5" stop-color="var(--sheet)"/><stop offset="1" stop-color="var(--c-soft)"/></linearGradient>
      <linearGradient id="sgmet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--rule)"/><stop offset=".5" stop-color="var(--paper)"/><stop offset="1" stop-color="var(--rule)"/></linearGradient>
      </defs>`;
    // U-frame
    s += `<path d="M${AX-26} ${RY-26} L${AX-26} 150 Q${AX-26} 170 ${AX-6} 170 L${S0-30} 170 Q${S0-10} 170 ${S0-10} 150 L${S0-10} ${RY+20}" fill="none" stroke="var(--muted)" stroke-width="16" stroke-linejoin="round"/>`;
    s += `<text x="${S0-50}" y="166" font-size="12" text-anchor="middle" fill="var(--sheet)" font-weight="700">${L2("frame","ফ্রেম")}</text>`;
    // anvil
    s += `<rect x="${AX-26}" y="${RY-12}" width="26" height="24" fill="url(#sgmet)" stroke="var(--muted)"/>`;
    // wire (cross-section circle)
    if(mode!=="learn" && wire>0) s += `<circle cx="${AX+wire*K/2}" cy="${RY}" r="${wire*K/2}" fill="#c98a3b" stroke="var(--ink)" stroke-width="1.2"/><circle cx="${AX+wire*K/2}" cy="${RY}" r="${wire*K/2-3}" fill="none" stroke="#e8b46a" stroke-width="1"/>`;
    // spindle
    s += `<rect x="${tip}" y="${RY-9}" width="${S0-10-tip}" height="18" fill="url(#sgmet)" stroke="var(--muted)"/>`;
    // sleeve with linear scale
    s += `<rect x="${S0-12}" y="${RY-20}" width="${Math.max(0,tx-S0+12)}" height="40" fill="url(#sgmet)" stroke="var(--muted)"/>`;
    if(hl(1)) s += `<rect x="${S0-12}" y="${RY-20}" width="${Math.max(0,tx-S0+12)}" height="40" fill="var(--note)" opacity=".35"/>`;
    s += `<line x1="${S0-12}" y1="${RY}" x2="${tx}" y2="${RY}" stroke="var(--ink)" stroke-width="1.6"/>`;
    for(let m=0;m<=MAXR;m++){ const x=S0+m*K; if(x>tx+0.5) break; s+=`<line x1="${x}" y1="${RY}" x2="${x}" y2="${RY-11}" stroke="var(--ink)" stroke-width="1.4"/>`; s+=`<text x="${x}" y="${RY-13}" font-size="11" text-anchor="middle" fill="var(--ink)">${n(m)}</text>`; }
    // thimble (cylinder) with circular scale on its left edge
    s += `<rect x="${tx}" y="${RY-30}" width="54" height="60" rx="5" fill="url(#sgcyl)" stroke="var(--c)" stroke-width="2"/>`;
    for(let x=tx+18;x<tx+52;x+=5) s+=`<line x1="${x}" y1="${RY-29}" x2="${x}" y2="${RY+29}" stroke="var(--c)" stroke-opacity=".25"/>`; // knurling
    for(let j=-5;j<=5;j++){ const d=((circ - j)%100+100)%100; const y=RY + j*5.2; const big=d%5===0; const on=j===0;
      s+=`<line x1="${tx}" y1="${y}" x2="${tx+(big?10:6)}" y2="${y}" stroke="${on&&hl(2)?"var(--bad)":"var(--c)"}" stroke-width="${on&&hl(2)?2.4:1}"/>`; }
    // ratchet
    s += `<rect x="${tx+54}" y="${RY-14}" width="24" height="28" rx="4" fill="var(--c)"/>`;
    if(ratchet) s += `<text x="${Math.min(tx+66,392)}" y="${RY-40}" font-size="15" text-anchor="middle" fill="var(--bad)" font-weight="700">${L2("click!","খট!")}</text>`;
    // labels
    s += `<g font-size="13" fill="var(--muted)"><text x="${AX-13}" y="${RY-30}" text-anchor="middle">${L2("anvil","নেহাই")}</text><text x="${Math.max(tip+4,AX+20)}" y="${RY-14}">${tip<S0-70?L2("spindle","স্পিন্ডল"):""}</text>
      <text x="${S0+4}" y="${RY+36}">${L2("sleeve","হাতা")}</text><text x="${tx+27}" y="${RY+48}" text-anchor="middle" fill="var(--c)">${L2("thimble","থিম্বল")}</text><text x="${Math.min(tx+66,396)}" y="${RY-22}" text-anchor="middle">${L2("ratchet","র‍্যাচেট")}</text></g>`;
    if(mode!=="learn" && wire>0) s += `<text x="${AX+wire*K/2}" y="${RY+wire*K/2+16}" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2("wire","তার")}</text>`;
    // zoom window
    const WX=12, WY=200, WW=396, WH=150, EX=WX+250, P=58; // thimble edge at EX, 58 px per mm
    const zx = (mm)=> EX + (mm-obs)*P;
    s += `<line x1="${tx+2}" y1="${RY+22}" x2="${EX}" y2="${WY}" stroke="var(--muted)" stroke-dasharray="4 4"/><line x1="${tx-30}" y1="${RY+22}" x2="${WX+60}" y2="${WY}" stroke="var(--muted)" stroke-dasharray="4 4"/>`;
    s += `<rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="14" fill="var(--paper)" stroke="var(--muted)" stroke-width="3"/>`;
    s += `<clipPath id="sgwin"><rect x="${WX+2}" y="${WY+2}" width="${WW-4}" height="${WH-4}" rx="12"/></clipPath><g clip-path="url(#sgwin)">`;
    const ZY = WY + WH/2 + 6; // reference line in the window
    s += `<rect x="${WX}" y="${ZY-46}" width="${EX-WX}" height="92" fill="url(#sgmet)"/>`;
    if(hl(1)) s += `<rect x="${WX}" y="${ZY-46}" width="${EX-WX}" height="92" fill="var(--note)" opacity=".35"/>`;
    s += `<line x1="${WX}" y1="${ZY}" x2="${EX}" y2="${ZY}" stroke="var(--bad)" stroke-width="2.5"/>`;
    for(let m=Math.max(0,lin-4); m<=lin+1; m++){ const x=zx(m); if(x>EX+0.5||x<WX-20) continue; const cur = m===lin;
      s+=`<line x1="${x}" y1="${ZY}" x2="${x}" y2="${ZY-26}" stroke="var(--ink)" stroke-width="2.4"/><text x="${x}" y="${ZY-32}" font-size="21" text-anchor="middle" fill="${hl(1)&&cur?"var(--bad)":"var(--ink)"}" font-weight="700">${n(m)}</text>`; }
    s += `<text x="${WX+12}" y="${ZY+30}" font-size="14" fill="var(--bad)">${L2("reference line","নির্দেশক রেখা")} →</text><text x="${WX+12}" y="${ZY+52}" font-size="13" fill="var(--muted)">${L2("linear scale (mm)","রৈখিক স্কেল (mm)")}</text>`;
    if(obs<0) s += `<text x="${WX+12}" y="${ZY-20}" font-size="13" fill="var(--ink)">${L2("the 0 mark is just hidden under the thimble","০ দাগটি থিম্বলের নিচে সামান্য ঢাকা পড়েছে")}</text>`;
    s += `<rect x="${EX}" y="${WY-10}" width="${WW}" height="${WH+20}" fill="url(#sgcyl)" stroke="var(--c)" stroke-width="3"/>`;
    for(let j=-5;j<=5;j++){ const d=((circ - j)%100+100)%100; const y=ZY + j*13; const big=d%5===0; const on=j===0;
      s+=`<line x1="${EX}" y1="${y}" x2="${EX+(big?28:16)}" y2="${y}" stroke="${on&&hl(2)?"var(--bad)":"var(--c)"}" stroke-width="${on&&hl(2)?3.4:1.6}"/>`;
      if(big) s+=`<text x="${EX+34}" y="${y+7}" font-size="20" fill="${on&&hl(2)?"var(--bad)":"var(--c)"}" font-weight="700">${n(d)}</text>`; }
    if(hl(2)) s += `<text x="${EX+76}" y="${ZY+6}" font-size="15" fill="var(--bad)" font-weight="700">← ${n(circ)}</text>`;
    s += `<text x="${EX+12}" y="${WY+20}" font-size="13" fill="var(--c)">${L2("circular scale","বৃত্তাকার স্কেল")}</text>`;
    s += `</g><text x="${WX+14}" y="${WY-6}" font-size="13" fill="var(--muted)">🔍 ${L2("zoomed in on the scales","স্কেলগুলো বড় করে দেখা")}</text></svg>`;
    $("#sgsvg",el).innerHTML = s;
    explain();
  };

  const setTask = (t)=>{ $("#sgtask",el).innerHTML=t; };
  const explain = () => {
    const g=gap(), {rr,lin,circ}=parts(obs); const o=$("#sgout",el); const ex=$("#sgextra",el);
    if(mode==="learn"){
      setTask(L2("Turn the thimble with the buttons. Watch the spindle move and the scales change.","বোতাম দিয়ে থিম্বল ঘোরাও। দেখো স্পিন্ডল কীভাবে সরে আর স্কেল বদলায়।"));
      ex.innerHTML="";
      o.innerHTML = L2(`Gap between anvil and spindle = <b>${fmt(g)} mm</b><br>Linear scale: <b>${lin} mm</b> visible · circular scale on the line: <b>${circ}</b><br>One division moves the spindle <b>0.01 mm</b>; 100 divisions = one full turn = <b>1 mm</b> (the pitch).`,
        `নেহাই আর স্পিন্ডলের ফাঁক = <b>${fmt(g)} mm</b><br>রৈখিক স্কেলে দেখা যাচ্ছে: <b>${n(lin)} mm</b> · রেখায় বৃত্তাকার দাগ: <b>${n(circ)}</b><br>এক ঘর ঘোরালে স্পিন্ডল সরে <b>০.০১ mm</b>; ১০০ ঘর = এক পূর্ণ পাক = <b>১ mm</b> (পিচ)।`);
      return;
    }
    if(mode==="measure"){
      if(!ratchet){ setTask(L2("<b>Step 1:</b> Press <b>Close</b> to turn the thimble until the spindle touches the wire and the ratchet clicks.","<b>ধাপ ১:</b> <b>বন্ধ করো</b> চেপে থিম্বল ঘোরাও, যতক্ষণ না স্পিন্ডল তারকে ছোঁয় আর র‍্যাচেট খট করে ওঠে।")); ex.innerHTML=""; o.innerHTML=L2("The wire is between the anvil and the open spindle.","তারটি নেহাই আর খোলা স্পিন্ডলের মাঝে আছে।"); return; }
      setTask(L2("<b>Step 2:</b> The wire is held. Read the scales in the zoomed view, type your answer, then check — or walk through the steps.","<b>ধাপ ২:</b> তারটি আটকানো। বড় করা ছবিতে স্কেল পড়ো, উত্তর লেখো, তারপর মিলিয়ে নাও — বা ধাপে ধাপে দেখো।"));
      if(!$("#sgans",el)){ ex.innerHTML = `<div class="w-row"><label for="sgans">${L2("Your reading (mm)","তোমার পাঠ (mm)")}</label><input class="w-in" id="sgans" type="number" step="0.01" inputmode="decimal"><button class="btn" id="sgchk">${L2("Check","মিলাও")}</button></div>
        <div class="chipset" role="group" id="sgsteps" style="margin-top:8px"><button data-s="1">${L2("① Linear scale","① রৈখিক স্কেল")}</button><button data-s="2">${L2("② Circular scale","② বৃত্তাকার স্কেল")}</button><button data-s="3">${L2("③ Add them","③ যোগ করো")}</button><button data-s="4">${L2("New wire","নতুন তার")}</button></div>`;
        $("#sgchk",el).addEventListener("click",()=>{ const v=parseFloat($("#sgans",el).value); const {rr}=parts(obs); const ok=Math.abs(v-rr)<0.005;
          $("#sgout",el).innerHTML = isNaN(v)?L2("Type a number first.","আগে একটি সংখ্যা লেখো।") : ok ? L2(`✓ Correct! ${fmt(rr)} mm.`,`✓ ঠিক! ${fmt(rr)} mm।`) : L2(`Not quite. Tap ① ② ③ to see how to read it.`,`পুরোপুরি হয়নি। কীভাবে পড়তে হয় দেখতে ① ② ③ চাপো।`); });
        $("#sgsteps",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ const k=+b.dataset.s; if(k===4){ newWire(); return; } step=k; $("#sgsteps",el).querySelectorAll("button").forEach(q=>q.setAttribute("aria-pressed",q===b)); draw(); stepText(); })); }
      if(step) stepText(); else o.innerHTML = L2("Hint: the linear scale gives whole millimetres; the circular scale gives hundredths of a millimetre.","ইঙ্গিত: রৈখিক স্কেল দেয় পূর্ণ মিলিমিটার; বৃত্তাকার স্কেল দেয় মিলিমিটারের শতভাগ।");
      return;
    }
    // zero error mode
    ex.innerHTML = `<div class="w-row"><button class="btn" id="sgzp">${L2("Gauge with + zero error","+ শূন্য ত্রুটির যন্ত্র")}</button><button class="btn" id="sgzn">${L2("Gauge with − zero error","− শূন্য ত্রুটির যন্ত্র")}</button><button class="btn solid" id="sgzw">${L2("Now measure a wire","এবার তার মাপো")}</button></div>`;
    $("#sgzp",el).addEventListener("click",()=>{ ze=2+Math.floor(Math.random()*5); wire=0; obs=4; ratchet=false; draw(); });
    $("#sgzn",el).addEventListener("click",()=>{ ze=-(2+Math.floor(Math.random()*5)); wire=0; obs=4; ratchet=false; draw(); });
    $("#sgzw",el).addEventListener("click",()=>{ if(!ze) ze=3; wire=Math.round((1+Math.random()*4.5)*100)/100; obs=6.5; ratchet=false; draw(); });
    const zc = ze>=0?ze:100+ze;
    if(wire===0){
      setTask(L2("Close the jaws with <b>nothing</b> between them (press Close). A perfect gauge would show 0 on the reference line.","মাঝে <b>কিছু না রেখে</b> মুখ বন্ধ করো (বন্ধ করো চাপো)। নিখুঁত যন্ত্রে নির্দেশক রেখায় ০ দেখা যেত।"));
      o.innerHTML = !ratchet ? L2("Jaws open.","মুখ খোলা।") : (ze>0 ? L2(`The circular scale stopped at <b>${zc}</b>, past zero. <b>Positive zero error = +${ze} × 0.01 = +${fmt(ze*LC)} mm</b>: every reading will be too big by this amount.`,`বৃত্তাকার স্কেল থেমেছে <b>${n(zc)}</b>-এ, শূন্য পেরিয়ে। <b>ধনাত্মক শূন্য ত্রুটি = +${n(ze)} × ০.০১ = +${fmt(ze*LC)} mm</b>: প্রতিটি পাঠ এতটুকু বেশি আসবে।`)
        : ze<0 ? L2(`The circular scale stopped at <b>${zc}</b>, that is ${-ze} divisions <b>before</b> zero. <b>Negative zero error = −${-ze} × 0.01 = ${fmt(ze*LC)} mm</b>: every reading will be too small.`,`বৃত্তাকার স্কেল থেমেছে <b>${n(zc)}</b>-এ, অর্থাৎ শূন্যের ${n(-ze)} ঘর <b>আগে</b>। <b>ঋণাত্মক শূন্য ত্রুটি = −${n(-ze)} × ০.০১ = ${fmt(ze*LC)} mm</b>: প্রতিটি পাঠ কম আসবে।`)
        : L2("0 is on the reference line: no zero error.","নির্দেশক রেখায় ০: কোনো শূন্য ত্রুটি নেই।"));
    } else {
      setTask(L2("Close the jaws on the wire, read the scales, then correct for the zero error.","তারের ওপর মুখ বন্ধ করো, স্কেল পড়ো, তারপর শূন্য ত্রুটি সংশোধন করো।"));
      o.innerHTML = !ratchet ? L2(`Zero error of this gauge: <b>${fmt(ze*LC)} mm</b>. Press Close.`,`এই যন্ত্রের শূন্য ত্রুটি: <b>${fmt(ze*LC)} mm</b>। বন্ধ করো চাপো।`)
        : L2(`Observed reading = ${lin} mm + ${circ} × 0.01 mm = <b>${fmt(rr)} mm</b><br>Correct reading = observed − zero error = ${fmt(rr)} − (${fmt(ze*LC)}) = <b>${fmt(rr-ze*LC)} mm</b>`,`প্রাপ্ত পাঠ = ${n(lin)} mm + ${n(circ)} × ০.০১ mm = <b>${fmt(rr)} mm</b><br>সঠিক পাঠ = প্রাপ্ত পাঠ − শূন্য ত্রুটি = ${fmt(rr)} − (${fmt(ze*LC)}) = <b>${fmt(rr-ze*LC)} mm</b>`);
    }
  };
  const stepText = () => { const {rr,lin,circ}=parts(obs); const o=$("#sgout",el);
    o.innerHTML = step===1 ? L2(`① <b>Linear scale</b> (yellow): the last mm mark you can see beside the thimble is <b>${lin}</b>. So the reading is ${lin} mm and a bit more.`,`① <b>রৈখিক স্কেল</b> (হলুদ): থিম্বলের পাশে দেখা শেষ mm দাগ <b>${n(lin)}</b>। তাই পাঠ ${n(lin)} mm আর একটু বেশি।`)
      : step===2 ? L2(`② <b>Circular scale</b> (red): the thimble mark sitting on the reference line is <b>${circ}</b>. Each mark = 0.01 mm, so the extra bit = ${circ} × 0.01 = ${fmt(circ*LC)} mm.`,`② <b>বৃত্তাকার স্কেল</b> (লাল): নির্দেশক রেখার ওপর থিম্বলের দাগ <b>${n(circ)}</b>। প্রতি দাগ = ০.০১ mm, তাই বাড়তি অংশ = ${n(circ)} × ০.০১ = ${fmt(circ*LC)} mm।`)
      : L2(`③ <b>Add them:</b> ${lin} mm + ${fmt(circ*LC)} mm = <b>${fmt(rr)} mm</b> is the diameter of the wire.`,`③ <b>যোগ করো:</b> ${n(lin)} mm + ${fmt(circ*LC)} mm = <b>${fmt(rr)} mm</b>, এটাই তারের ব্যাস।`); };

  const newWire = () => { wire = Math.round((0.6 + Math.random()*5.6)*100)/100; obs = 6.8; ratchet=false; step=0; $("#sgextra",el).innerHTML=""; draw(); };
  const turn = (d) => { // d in divisions; negative = close (move spindle towards anvil)
    let target = Math.round((obs*100 + d))/100; const lo = Math.round((minGap() + ze*LC)*100)/100;
    ratchet = false;
    if(target <= lo){ target = lo; ratchet = mode!=="learn" || target===0; }
    target = Math.min(MAXR, Math.max(ze<0&&mode==="zero"? -0.1 : 0, target));
    obs = target; draw(); };
  let timer=null; const hold = (id,d)=>{ const b=$("#"+id,el);
    const go=()=>turn(d);
    b.addEventListener("click",go); };
  hold("sgo1",1); hold("sgc1",-1); hold("sgo10",100);
  $("#sgc10",el).addEventListener("click",()=>{ // close smoothly until contact
    const lo = Math.round((minGap()+ze*LC)*100)/100; const start=obs, t0=performance.now(), dur=REDUCED?0:Math.min(1200, (start-lo)*400);
    const tick=(now)=>{ const f=dur?Math.min(1,(now-t0)/dur):1; obs = Math.round((start + (lo-start)*f)*100)/100; ratchet=f>=1; draw(); if(f<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); });
  $("#sgm",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ mode=b.dataset.m; $("#sgm",el).querySelectorAll("button").forEach(q=>q.setAttribute("aria-pressed",q===b)); step=0; ratchet=false; $("#sgextra",el).innerHTML="";
    if(mode==="measure"){ ze=0; newWire(); return; } if(mode==="learn"){ ze=0; obs=2.35; } if(mode==="zero"){ ze=3; wire=0; obs=4; } draw(); }));
  newWire();
};
})();
