/* ---- chapter 4 widgets ---- */
const slider = (id,label,min,max,step,val,unit) => `<div class="w-sl"><label for="${id}">${label}</label><b id="${id}-v"></b><input class="w-range" type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
const sv = (el,id,unit,d=0) => { const v=+$("#"+id,el).value; $("#"+id+"-v",el).textContent = bnNum(v.toFixed(d),LANG).replace("-","−")+" "+unit; return v; };

/* 4.1 work: force and displacement, same or opposite direction */
W.work = (el) => {
  el.innerHTML = slider("wF",L2("Force F","বল F"),0,200,5,100,"N")+slider("ws",L2("Displacement s","সরণ s"),0,10,0.5,5,"m")+
  `<div class="chipset" role="group"><button data-d="1" aria-pressed="true">${L2("Force along the motion","গতির দিকে বল")}</button><button data-d="-1" aria-pressed="false">${L2("Force against the motion (friction)","গতির বিপরীতে বল (ঘর্ষণ)")}</button><button data-d="0" aria-pressed="false">${L2("Push a wall (no motion)","দেয়াল ঠেলা (সরণ নেই)")}</button></div><div class="svgwrap fit" id="wsvg"></div><div class="w-out" id="wo"></div>`;
  let d=1;
  const go=()=>{ const F=sv(el,"wF","N"), s0=sv(el,"ws","m",1); const s = d===0?0:s0; const W0 = d===-1 ? -F*s : F*s;
    const px=m=>30+m*26; // 10 m -> 260 px
    let g=`<svg viewBox="0 0 360 230" role="img" aria-label="work">${arrowDefs("wa","var(--bad)")}${arrowDefs("wb","var(--c)")}<rect x="0" y="120" width="360" height="5" fill="var(--muted)" opacity=".4"/>`;
    for(let m=0;m<=10;m+=2) g+=`<line x1="${px(m)}" y1="125" x2="${px(m)}" y2="132" stroke="var(--muted)"/><text x="${px(m)}" y="146" font-size="12" text-anchor="middle" fill="var(--muted)">${bnNum(m,LANG)} m</text>`;
    if(d===0){ g+=`<rect x="250" y="20" width="24" height="100" fill="var(--muted)"/><rect x="190" y="70" width="60" height="50" rx="4" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><line x1="${186-F*0.4}" y1="95" x2="188" y2="95" stroke="var(--bad)" stroke-width="4" marker-end="url(#wa)"/><text x="${186-F*0.2}" y="86" font-size="13" text-anchor="middle" fill="var(--bad)">${bnNum(F,LANG)} N</text><text x="180" y="176" font-size="14" text-anchor="middle" fill="var(--ink)">s = 0 → W = 0</text>`; }
    else { const x0=px(0), x1=px(s); g+=`<rect x="${x0}" y="80" width="46" height="40" rx="4" fill="none" stroke="var(--rule)" stroke-dasharray="4 3"/><rect x="${x1}" y="80" width="46" height="40" rx="4" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
      if(s>0) g+=`<line x1="${x0+23}" y1="166" x2="${x1+23}" y2="166" stroke="var(--c)" stroke-width="3" marker-end="url(#wb)"/><text x="${(x0+x1)/2+23}" y="186" font-size="14" text-anchor="middle" fill="var(--c)">s = ${bnNum(s,LANG)} m</text>`;
      if(F>0) g+= d===1 ? `<line x1="${x1-6-F*0.35}" y1="100" x2="${x1-2}" y2="100" stroke="var(--bad)" stroke-width="4" marker-end="url(#wa)"/><text x="${x1-6-F*0.17}" y="72" font-size="13" text-anchor="middle" fill="var(--bad)">F = ${bnNum(F,LANG)} N</text>` : `<line x1="${x1+50}" y1="100" x2="${x1+52+F*0.35}" y2="100" stroke="var(--bad)" stroke-width="4" marker-end="url(#wa)"/><text x="${Math.min(330,x1+52+F*0.17)}" y="72" font-size="13" text-anchor="middle" fill="var(--bad)">${L2("friction","ঘর্ষণ")} ${bnNum(F,LANG)} N</text>`;
      // work as area bar
      const wb=Math.min(1,Math.abs(W0)/2000); g+=`<text x="10" y="214" font-size="13" fill="var(--ink)">W</text><rect x="30" y="202" width="${wb*300}" height="14" rx="3" fill="${W0<0?"var(--bad)":"var(--good)"}" opacity=".8"/><text x="${36+wb*300}" y="214" font-size="13" fill="var(--ink)">${bnNum(W0,LANG).replace("-","−")} J</text>`; }
    g+=`</svg>`; $("#wsvg",el).innerHTML=g;
    $("#wo",el).innerHTML = d===0 ? L2(`The wall does not move, so s = 0 and <b>W = 0 J</b>, however tired you feel.`,`দেয়াল নড়ে না, তাই s = ০ এবং <b>W = ০ J</b>, যত ক্লান্তই লাগুক।`) : L2(`W = ${d===-1?"−":""}F × s = ${d===-1?"−":""}${F} × ${s} = <b>${W0} J</b>${d===-1?" (negative work: the force opposes the motion and takes energy away)":" (positive work: energy is given to the box)"}`,`W = ${d===-1?"−":""}F × s = ${d===-1?"−":""}${bnNum(F,"bn")} × ${bnNum(s,"bn")} = <b>${bnNum(W0,"bn").replace("-","−")} J</b>${d===-1?" (ঋণাত্মক কাজ: বল গতির বিপরীতে, শক্তি কেড়ে নেয়)":" (ধনাত্মক কাজ: বাক্সে শক্তি যায়)"}`);
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",go));
  el.querySelectorAll(".chipset button").forEach(b=>b.addEventListener("click",()=>{d=+b.dataset.d;el.querySelectorAll(".chipset button").forEach(q=>q.setAttribute("aria-pressed",q===b));go();}));
  go();
};

/* 4.3.1 kinetic energy grows as v² */
W.ke = (el) => {
  el.innerHTML = slider("kem",L2("Mass m","ভর m"),1,100,1,10,"kg")+slider("kev",L2("Velocity v","বেগ v"),0,30,1,10,"m/s")+`<div class="w-row"><button class="btn" id="kedbl">${L2("Double the speed","বেগ দ্বিগুণ করো")}</button><button class="btn" id="kedm">${L2("Double the mass","ভর দ্বিগুণ করো")}</button></div><div class="svgwrap fit" id="kesvg"></div><div class="w-out" id="keo"></div>`;
  let prev=null;
  const go=()=>{ const m=sv(el,"kem","kg"), v=sv(el,"kev","m/s"); const E=0.5*m*v*v; const Emax=0.5*100*900;
    let g=`<svg viewBox="0 0 360 250" role="img" aria-label="KE vs v">`;
    // energy blocks: each block = 1000 J
    g+=`<text x="10" y="18" font-size="13" fill="var(--ink)">${L2("each square = 100 J","প্রতি বর্গ = ১০০ J")}</text>`;
    const nb=Math.min(120,Math.round(E/100)); for(let i=0;i<nb;i++){ const cx=10+(i%24)*14, cy=28+Math.floor(i/24)*14; g+=`<rect x="${cx}" y="${cy}" width="11" height="11" rx="2" fill="var(--c)"/>`; }
    if(E/100>120) g+=`<text x="10" y="112" font-size="12" fill="var(--bad)">+ ${bnNum(Math.round(E/100-120),LANG)} ${L2("more squares","টি আরও বর্গ")}</text>`;
    // graph
    const X=x=>50+x/30*290, Y=e=>235-e/(0.5*m*900)*105;
    g+=`<line x1="50" y1="235" x2="345" y2="235" stroke="var(--muted)"/><line x1="50" y1="125" x2="50" y2="235" stroke="var(--muted)"/>`;
    let p=""; for(let x=0;x<=30;x+=0.5) p+=`${X(x)},${Y(0.5*m*x*x)} `; g+=`<polyline points="${p}" fill="none" stroke="var(--c)" stroke-width="3"/>`;
    g+=`<line x1="${X(v)}" y1="235" x2="${X(v)}" y2="${Y(E)}" stroke="var(--bad)" stroke-dasharray="3 3"/><circle cx="${X(v)}" cy="${Y(E)}" r="6" fill="var(--bad)"/><text x="56" y="136" font-size="12" fill="var(--muted)">Eₖ (J)</text><text x="345" y="228" font-size="12" text-anchor="end" fill="var(--muted)">v (m/s)</text>`;
    g+=`</svg>`; $("#kesvg",el).innerHTML=g;
    let cmp=""; if(prev && prev.E>0 && (prev.m!==m || prev.v!==v)) cmp = L2(` Compared with before (${prev.E.toFixed(0)} J): <b>× ${(E/prev.E).toFixed(1)}</b>.`,` আগের (${bnNum(prev.E.toFixed(0),"bn")} J) তুলনায়: <b>× ${bnNum((E/prev.E).toFixed(1),"bn")}</b>।`);
    $("#keo",el).innerHTML=L2(`Eₖ = ½mv² = ½ × ${m} × ${v}² = <b>${E.toFixed(0)} J</b>.${cmp} Doubling the mass doubles the energy; doubling the speed makes it <b>four</b> times.`,`Eₖ = ½mv² = ½ × ${bnNum(m,"bn")} × ${bnNum(v,"bn")}² = <b>${bnNum(E.toFixed(0),"bn")} J</b>।${cmp} ভর দ্বিগুণ করলে শক্তি দ্বিগুণ; বেগ দ্বিগুণ করলে শক্তি <b>চার</b> গুণ।`);
  };
  const snap=()=>{ const m=+$("#kem",el).value, v=+$("#kev",el).value; prev={m,v,E:0.5*m*v*v}; };
  el.querySelectorAll("input").forEach(i=>{ i.addEventListener("pointerdown",snap); i.addEventListener("keydown",snap); i.addEventListener("input",go); });
  $("#kedbl",el).addEventListener("click",()=>{ snap(); const i=$("#kev",el); i.value=Math.min(30,+i.value*2); go(); });
  $("#kedm",el).addEventListener("click",()=>{ snap(); const i=$("#kem",el); i.value=Math.min(100,+i.value*2); go(); });
  go();
};

/* 4.3.2 potential energy: raised mass and compressed spring */
W.pe = (el) => {
  el.innerHTML = `<div class="chipset" role="group"><button data-k="g" aria-pressed="true">${L2("Raised object (mgh)","উঁচুতে তোলা বস্তু (mgh)")}</button><button data-k="s" aria-pressed="false">${L2("Compressed spring (½kx²)","সংকুচিত স্প্রিং (½kx²)")}</button></div><div id="pein"></div><div class="svgwrap fit" id="pesvg"></div><div class="w-out" id="peo"></div>`;
  let k="g";
  const build=()=>{ $("#pein",el).innerHTML = k==="g" ? slider("pem",L2("Mass m","ভর m"),1,50,1,10,"kg")+slider("peh",L2("Height h","উচ্চতা h"),0,20,0.5,5,"m") : slider("pek",L2("Spring constant k","স্প্রিং ধ্রুবক k"),100,2000,50,1000,"N/m")+slider("pex",L2("Compression x","সংকোচন x"),0,0.3,0.01,0.1,"m"); el.querySelectorAll("#pein input").forEach(i=>i.addEventListener("input",go)); go(); };
  const go=()=>{ let g=`<svg viewBox="0 0 360 230" role="img" aria-label="potential energy">${arrowDefs("pea","var(--c)")}`, txt;
    if(k==="g"){ const m=sv(el,"pem","kg"), h=sv(el,"peh","m",1); const E=m*9.8*h; const y=200-h*9; const sz=18+m*0.6;
      g+=`<rect x="0" y="200" width="360" height="6" fill="var(--muted)" opacity=".5"/>`;
      // building floors
      for(let f=0;f<=20;f+=3) g+=`<line x1="40" y1="${200-f*9}" x2="80" y2="${200-f*9}" stroke="var(--rule)"/><text x="36" y="${204-f*9}" font-size="11" text-anchor="end" fill="var(--muted)">${bnNum(f,LANG)}</text>`;
      g+=`<line x1="60" y1="200" x2="60" y2="20" stroke="var(--rule)" stroke-width="2"/><text x="10" y="14" font-size="12" fill="var(--muted)">h (m)</text>`;
      g+=`<line x1="110" y1="198" x2="110" y2="${y+2}" stroke="var(--c)" stroke-width="2" marker-end="url(#pea)"/><text x="116" y="${(200+y)/2}" font-size="14" fill="var(--c)">h = ${bnNum(h,LANG)} m</text><rect x="${150}" y="${y-sz}" width="${sz}" height="${sz}" rx="3" fill="var(--c)"/><text x="${150+sz+6}" y="${y-sz/2+5}" font-size="13" fill="var(--ink)">${bnNum(m,LANG)} kg</text>`;
      const bar=Math.min(1,E/9800); g+=`<rect x="300" y="${200-bar*170}" width="36" height="${bar*170}" rx="3" fill="var(--note)"/><rect x="300" y="30" width="36" height="170" fill="none" stroke="var(--rule)"/><text x="318" y="222" font-size="12" text-anchor="middle" fill="var(--ink)">Eₚ</text>`;
      txt=L2(`Eₚ = mgh = ${m} × 9.8 × ${h} = <b>${E.toFixed(1)} J</b>. This is exactly the work you did lifting it, stored ready to be used when it falls.`,`Eₚ = mgh = ${bnNum(m,"bn")} × ৯.৮ × ${bnNum(h,"bn")} = <b>${bnNum(E.toFixed(1),"bn")} J</b>। এটা ঠিক ততটুকু, যতটুকু কাজ তুমি তুলতে করেছ; পড়ার সময় কাজে লাগার জন্য জমা আছে।`); }
    else { const kk=sv(el,"pek","N/m"), x=sv(el,"pex","m",2); const E=0.5*kk*x*x; const L=220-x*500; let p="M40 110"; const n=16; for(let i=1;i<=n;i++){ p+=` L${40+L*i/n} ${i%2?80:140}`; }
      g+=`<rect x="20" y="60" width="20" height="100" fill="var(--muted)"/><path d="${p}" fill="none" stroke="var(--c)" stroke-width="3"/><rect x="${40+L}" y="80" width="60" height="60" rx="4" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><line x1="${40+220}" y1="150" x2="${40+220}" y2="175" stroke="var(--bad)"/><line x1="${40+L}" y1="162" x2="${40+220}" y2="162" stroke="var(--bad)" stroke-width="2"/><text x="${40+(L+220)/2}" y="192" font-size="14" text-anchor="middle" fill="var(--bad)">x = ${bnNum(x,LANG)} m</text>`;
      txt=L2(`Eₚ = ½kx² = ½ × ${kk} × ${x}² = <b>${E.toFixed(2)} J</b>. Squeeze it twice as far and it stores four times the energy.`,`Eₚ = ½kx² = ½ × ${bnNum(kk,"bn")} × ${bnNum(x,"bn")}² = <b>${bnNum(E.toFixed(2),"bn")} J</b>। দ্বিগুণ চাপলে চার গুণ শক্তি জমা হয়।`); }
    g+=`</svg>`; $("#pesvg",el).innerHTML=g; $("#peo",el).innerHTML=txt; };
  el.querySelectorAll(".chipset button").forEach(b=>b.addEventListener("click",()=>{k=b.dataset.k;el.querySelectorAll(".chipset button").forEach(q=>q.setAttribute("aria-pressed",q===b));build();}));
  build();
};

/* generic sorting game (renewable / non-renewable etc.) */
W.sources = (el) => {
  const items=[[L2("Solar","সৌরশক্তি"),1],[L2("Coal","কয়লা"),0],[L2("Wind","বায়ুশক্তি"),1],[L2("Natural gas","প্রাকৃতিক গ্যাস"),0],[L2("Hydroelectricity","জলবিদ্যুৎ"),1],[L2("Petroleum (oil)","পেট্রোলিয়াম (তেল)"),0],[L2("Biomass (cow dung, wood)","জৈববস্তু (গোবর, কাঠ)"),1],[L2("Nuclear (uranium)","নিউক্লীয় (ইউরেনিয়াম)"),0],[L2("Geothermal","ভূ-তাপীয়"),1],[L2("Biofuel","জৈব জ্বালানি"),1]];
  el.innerHTML = `<p class="hint">${L2("Is each source renewable or non-renewable?","প্রতিটি উৎস নবায়নযোগ্য না অনবায়নযোগ্য?")}</p><div id="srl" style="display:grid;gap:6px"></div><div class="w-out" id="srs"></div>`;
  let score=0,done=0;
  $("#srl",el).innerHTML=items.map(([n],i)=>`<div class="w-row" data-i="${i}" style="justify-content:space-between;border:1px solid var(--rule);border-radius:10px;padding:6px 10px;background:var(--paper)"><b>${n}</b><span class="w-row"><button class="btn" data-a="1">${L2("Renewable","নবায়নযোগ্য")}</button><button class="btn" data-a="0">${L2("Non-renewable","অনবায়নযোগ্য")}</button></span></div>`).join("");
  const upd=()=>{$("#srs",el).innerHTML=L2(`Score: <b>${score} / ${done}</b>`,`স্কোর: <b>${bnNum(score,"bn")} / ${bnNum(done,"bn")}</b>`);};
  el.querySelectorAll("[data-i]").forEach(row=>row.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ if(row.dataset.done) return; row.dataset.done=1; done++; const ans=items[+row.dataset.i][1]; const ok=+b.dataset.a===ans; if(ok) score++; row.style.background=ok?"var(--good-soft)":"var(--bad-soft)"; row.querySelector("span").innerHTML=`<b style="color:${ok?"var(--good)":"var(--bad)"}">${ok?"✓":"✗"} ${ans?L2("Renewable: nature refills it","নবায়নযোগ্য: প্রকৃতি আবার পূরণ করে"):L2("Non-renewable: limited stock","অনবায়নযোগ্য: মজুদ সীমিত")}</b>`; upd(); })));
  upd();
};

/* 4.5 pendulum: KE ↔ PE */
W.pendulum = (el) => {
  el.innerHTML = `<div class="chipset" role="group"><button data-f="0" aria-pressed="true">${L2("No friction","ঘর্ষণ নেই")}</button><button data-f="1" aria-pressed="false">${L2("With air friction","বাতাসের ঘর্ষণসহ")}</button></div><div class="svgwrap fit" id="pdsv"></div><div class="w-out" id="pdo"></div>`;
  let t=0, fr=false, A0=0.7, heat=0; const L=150, w=Math.sqrt(9.8/1.5);
  const draw=()=>{ const A=fr? A0*Math.exp(-0.08*t) : A0; const th=A*Math.cos(w*t); const cx=130, x=cx+L*Math.sin(th), y=20+L*Math.cos(th); const hmax=1-Math.cos(A0); const pe=(1-Math.cos(th))/hmax, tot=(1-Math.cos(A))/hmax, ke=tot-pe, ht=1-tot;
    let g=`<svg viewBox="0 0 360 230" role="img" aria-label="pendulum"><line x1="${cx-60}" y1="20" x2="${cx+60}" y2="20" stroke="var(--muted)" stroke-width="4"/><path d="M${cx-L*Math.sin(A0)} ${20+L*Math.cos(A0)} Q ${cx} ${20+L*1.12} ${cx+L*Math.sin(A0)} ${20+L*Math.cos(A0)}" fill="none" stroke="var(--rule)" stroke-dasharray="4 4"/><line x1="${cx}" y1="20" x2="${x}" y2="${y}" stroke="var(--ink)" stroke-width="2"/><circle cx="${x}" cy="${y}" r="15" fill="var(--c)"/><line x1="10" y1="${20+L}" x2="250" y2="${20+L}" stroke="var(--rule)" stroke-dasharray="4 4"/><text x="10" y="${16+L}" font-size="11" fill="var(--muted)">${L2("lowest point","সর্বনিম্ন বিন্দু")}</text>`;
    const bar=(x0,f,col,lab)=>`<rect x="${x0}" y="${200-Math.max(0,f)*160}" width="26" height="${Math.max(0,f)*160}" rx="3" fill="${col}"/><text x="${x0+13}" y="216" font-size="12" text-anchor="middle" fill="var(--ink)">${lab}</text>`;
    g+=`<rect x="262" y="40" width="94" height="160" fill="none" stroke="var(--rule)"/>`+bar(266,pe,"var(--c)",L2("PE","বিভব"))+bar(296,ke,"var(--bad)",L2("KE","গতি"))+bar(326,ht,"var(--note)",L2("heat","তাপ"))+`<text x="309" y="34" font-size="11" text-anchor="middle" fill="var(--muted)">${L2("total = 100%","মোট = ১০০%")}</text></svg>`;
    $("#pdsv",el).innerHTML=g;
    $("#pdo",el).innerHTML= fr ? L2(`Potential ${Math.round(pe*100)}% + kinetic ${Math.round(ke*100)}% + heat ${Math.round(ht*100)}% = 100%. The swing gets smaller because some energy turns into heat, but no energy is destroyed.`,`বিভব ${bnNum(Math.round(pe*100),"bn")}% + গতি ${bnNum(Math.round(ke*100),"bn")}% + তাপ ${bnNum(Math.round(ht*100),"bn")}% = ১০০%। দোলন ছোট হয়, কারণ কিছু শক্তি তাপে পরিণত হয়, কিন্তু কোনো শক্তি ধ্বংস হয় না।`) : L2(`Potential ${Math.round(pe*100)}% + kinetic ${Math.round(ke*100)}% = 100% of the total energy at every moment. Highest point: all PE. Lowest point: all KE.`,`প্রতি মুহূর্তে বিভব ${bnNum(Math.round(pe*100),"bn")}% + গতি ${bnNum(Math.round(ke*100),"bn")}% = মোট শক্তির ১০০%। সর্বোচ্চ বিন্দুতে সব বিভব, সর্বনিম্ন বিন্দুতে সব গতি।`);
  };
  el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ fr=b.dataset.f==="1"; t=0; el.querySelectorAll("button").forEach(q=>q.setAttribute("aria-pressed",q===b)); draw(); }));
  if(REDUCED){ t=0.9; draw(); } else animate(el, dt=>{ t+=dt; if(fr&&t>40) t=0; draw(); });
};

/* 4.7 power: climb the stairs */
W.stairs = (el) => {
  el.innerHTML = slider("stm",L2("Your mass","তোমার ভর"),20,100,1,50,"kg")+slider("sth",L2("Height climbed","ওঠা উচ্চতা"),1,30,0.5,6,"m")+slider("stt",L2("Time taken","লাগা সময়"),1,60,0.5,8,"s")+`<div class="w-row"><button class="btn solid" id="stgo">${L2("Climb!","ওঠো!")}</button></div><div class="svgwrap fit" id="stsvg"></div><div class="w-out" id="sto"></div>`;
  let prog=0, run=false;
  const draw=()=>{ const m=sv(el,"stm","kg"), h=sv(el,"sth","m",1), t=sv(el,"stt","s",1); const W0=m*9.8*h, P=W0/t;
    const N=10, sw=24, sh=14; let g=`<svg viewBox="0 0 360 210" role="img" aria-label="stairs"><path d="M20 190 ${Array.from({length:N},(_,i)=>`L${20+i*sw} ${190-i*sh} L${20+(i+1)*sw} ${190-i*sh}`).join(" ")} L${20+N*sw} 190 Z" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
    const f=prog; const px=20+f*N*sw+10, py=190-f*N*sh- 2 - (f<1? (Math.floor(f*N)*sh - f*N*sh):0);
    const yy=190-Math.floor(f*N+0.001)*sh;
    g+=`<g transform="translate(${20+f*N*sw},${yy})"><circle cx="6" cy="-38" r="6" fill="var(--ink)"/><line x1="6" y1="-32" x2="6" y2="-16" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line x1="6" y1="-16" x2="0" y2="0" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line x1="6" y1="-16" x2="12" y2="-4" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/></g>`;
    g+=`<text x="10" y="18" font-size="13" fill="var(--ink)">${L2("time","সময়")}: ${bnNum((f*t).toFixed(1),LANG)} s</text><text x="10" y="36" font-size="13" fill="var(--ink)">${L2("work done","কৃত কাজ")}: ${bnNum((f*W0).toFixed(0),LANG)} J</text>`;
    // bulbs
    const nb=Math.min(16,Math.round(P/100)); for(let i=0;i<nb;i++){ const bx=20+(i%8)*20, by=62+Math.floor(i/8)*26; g+=`<circle cx="${bx}" cy="${by}" r="8" fill="${f>=1||run?"var(--note)":"var(--rule)"}"/><rect x="${bx-4}" y="${by+7}" width="8" height="5" fill="var(--muted)"/>`; }
    g+=`<text x="200" y="18" font-size="12" fill="var(--muted)">💡 = 100 W</text></svg>`;
    $("#stsvg",el).innerHTML=g;
    $("#sto",el).innerHTML=L2(`Work = mgh = ${m} × 9.8 × ${h} = ${W0.toFixed(0)} J<br>Power = W ÷ t = ${W0.toFixed(0)} ÷ ${t} = <b>${P.toFixed(0)} W</b>: enough to light about ${(P/100).toFixed(1)} bulbs of 100 W. Run up faster (less time) and your power goes up, though the work stays the same.`,`কাজ = mgh = ${bnNum(m,"bn")} × ৯.৮ × ${bnNum(h,"bn")} = ${bnNum(W0.toFixed(0),"bn")} J<br>ক্ষমতা = W ÷ t = ${bnNum(W0.toFixed(0),"bn")} ÷ ${bnNum(t,"bn")} = <b>${bnNum(P.toFixed(0),"bn")} W</b>: প্রায় ${bnNum((P/100).toFixed(1),"bn")}টি ১০০ W বাল্ব জ্বালানোর সমান। দ্রুত উঠলে (কম সময়ে) কাজ একই থাকে, কিন্তু ক্ষমতা বাড়ে।`);
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>{prog=0;run=false;draw();}));
  $("#stgo",el).addEventListener("click",()=>{ prog=0; run=true; if(REDUCED){ prog=1; run=false; draw(); } });
  if(!REDUCED) animate(el, dt=>{ if(run){ const t=+$("#stt",el).value; prog=Math.min(1,prog+dt/Math.min(t,6)); if(prog>=1) run=false; draw(); } });
  draw();
};

/* 4.8 efficiency chain */
W.efficiency = (el) => {
  el.innerHTML = slider("efl",L2("Energy lost at each step","প্রতি ধাপে শক্তি অপচয়"),0,50,1,10,"%")+slider("efn",L2("Number of steps","ধাপের সংখ্যা"),1,6,1,4,"")+`<div id="efb" style="display:grid;gap:6px"></div><div class="w-out" id="efo"></div>`;
  const go=()=>{ const l=sv(el,"efl","%")/100, n=sv(el,"efn",""); let e=1, rows="";
    for(let i=0;i<=n;i++){ rows+=`<div class="w-row"><span class="muted" style="min-width:6em">${i===0?L2("input","ইনপুট"):L2("after step ","ধাপ ")+bnNum(i,LANG)}</span><div class="bar" style="flex:1"><i style="width:${e*100}%"></i></div><span style="min-width:4em">${bnNum((e*100).toFixed(1),LANG)}%</span></div>`; e*=(1-l); }
    e/=(1-l); $("#efb",el).innerHTML=rows;
    $("#efo",el).innerHTML=L2(`Overall efficiency = ${(1-l).toFixed(2)}^${n} = <b>${(e*100).toFixed(1)}%</b>. Every step wastes a little, and the losses multiply.`,`মোট কর্মদক্ষতা = ${bnNum((1-l).toFixed(2),"bn")}^${bnNum(n,"bn")} = <b>${bnNum((e*100).toFixed(1),"bn")}%</b>। প্রতিটি ধাপে কিছুটা নষ্ট হয়, আর অপচয় গুণিতক হারে বাড়ে।`);
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",go)); go();
};

/* 4.6 E = mc²: how much energy is locked in a small mass */
W.emc2 = (el) => {
  const opts=[[2e-5,"A grain of rice (0.02 g)","একটি চালের দানা (০.০২ g)"],[1e-3,"1 g (a raisin)","১ g (একটি কিশমিশ)"],[1,"1 kg","১ kg"]];
  el.innerHTML = `<div class="chipset" role="group">${opts.map((o,i)=>`<button data-i="${i}" aria-pressed="${i===1}">${L2(o[1],o[2])}</button>`).join("")}</div>
  <div class="w-out" id="emo" style="margin-top:10px"></div><p class="hint" id="emh"></p>`;
  const sci=(x)=>{ const e=Math.floor(Math.log10(x)); const m=x/10**e; const mm=bnNum(m.toFixed(m<10&&m%1?1:0),LANG); return e===0?mm:`${mm} × ${bnNum(10,LANG)}<sup>${bnNum(e,LANG).replace("-","−")}</sup>`; };
  const go=(i)=>{ const m=opts[i][0], E=m*9e16, kwh=E/3.6e6, months=kwh/100, years=months/12;
    const yrs = years>=1 ? L2(`about <b>${bnNum(Math.round(years).toLocaleString("en-US"),LANG)} years</b>`,`প্রায় <b>${bnNum(Math.round(years).toLocaleString("en-US"),"bn")} বছর</b>`) : "";
    $("#emo",el).innerHTML = L2(`E = mc² = ${sci(m)} kg × (3 × 10<sup>8</sup> m/s)² = <b>${sci(E)} J</b><br>= ${sci(kwh)} kWh (units of electricity)<br>Enough for a home that uses 100 units a month for ${yrs}.`,
      `E = mc² = ${sci(m)} kg × (৩ × ১০<sup>৮</sup> m/s)² = <b>${sci(E)} J</b><br>= ${sci(kwh)} kWh (বিদ্যুতের ইউনিট)<br>মাসে ১০০ ইউনিট খরচ করা একটি বাড়ি চলবে ${yrs}।`);
    $("#emh",el).innerHTML = L2("In a real nuclear reactor only about 0.1% of the fuel's mass turns into energy, and this is still millions of times more than burning the same mass of coal.","বাস্তব পারমাণবিক চুল্লিতে জ্বালানির ভরের মাত্র প্রায় ০.১% শক্তিতে রূপ নেয়, তবুও তা সমান ভরের কয়লা পোড়ানোর চেয়ে লক্ষ লক্ষ গুণ বেশি।"); };
  el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{el.querySelectorAll("button").forEach(q=>q.setAttribute("aria-pressed",q===b));go(+b.dataset.i);}));
  go(1);
};

/* 4.2 energy changes form: pick a device */
W.eforms = (el) => {
  const D=[[L2("Ceiling fan","সিলিং ফ্যান"),"⚡",L2("electrical","তড়িৎ"),[["🌀",L2("kinetic (moving air)","গতিশক্তি (চলন্ত বাতাস)"),80],["🔥",L2("heat","তাপ"),15],["🔊",L2("sound","শব্দ"),5]]],
    [L2("LED bulb","এলইডি বাল্ব"),"⚡",L2("electrical","তড়িৎ"),[["💡",L2("light","আলো"),40],["🔥",L2("heat","তাপ"),60]]],
    [L2("Solar panel","সৌর প্যানেল"),"☀",L2("light","আলো"),[["⚡",L2("electrical","তড়িৎ"),20],["🔥",L2("heat","তাপ"),80]]],
    [L2("Gas stove","গ্যাসের চুলা"),"🧪",L2("chemical (gas)","রাসায়নিক (গ্যাস)"),[["🍲",L2("heat into the pot","পাতিলে যাওয়া তাপ"),40],["🔥",L2("heat lost to the air","বাতাসে হারানো তাপ"),60]]],
    [L2("Mobile battery","মোবাইলের ব্যাটারি"),"🧪",L2("chemical","রাসায়নিক"),[["⚡",L2("electrical","তড়িৎ"),90],["🔥",L2("heat","তাপ"),10]]],
    [L2("Kaptai dam","কাপ্তাই বাঁধ"),"💧",L2("potential (water up high)","বিভব (উঁচুতে পানি)"),[["⚡",L2("electrical","তড়িৎ"),85],["🔥",L2("heat","তাপ"),15]]]];
  let i=0;
  el.innerHTML = `<div class="chipset" role="group">${D.map((d,j)=>`<button data-i="${j}" aria-pressed="${j===0}">${d[0]}</button>`).join("")}</div><div id="efw" style="margin-top:10px"></div>`;
  const go=()=>{ const d=D[i];
    $("#efw",el).innerHTML = `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1.4fr);gap:10px;align-items:center">
      <div style="border:2px solid var(--c);border-radius:12px;padding:10px;text-align:center;background:var(--c-soft)"><div style="font-size:30px">${d[1]}</div><b>${d[2]}</b><div class="hint">100%</div></div>
      <div style="font-size:26px;color:var(--muted)" aria-hidden="true">→</div>
      <div style="display:grid;gap:6px">${d[3].map(o=>`<div style="border:1px solid var(--rule);border-radius:10px;padding:6px 10px;background:var(--paper)"><div style="display:flex;justify-content:space-between;gap:6px"><span>${o[0]} ${o[1]}</span><b>≈ ${bnNum(o[2],LANG)}%</b></div><div class="bar" style="margin-top:4px"><i style="width:${o[2]}%"></i></div></div>`).join("")}</div></div>
      <p class="hint">${L2("Percentages are rough, typical values. Add up the outputs: always 100%. Energy only changes form; none is created or lost.","শতাংশগুলো আনুমানিক, সাধারণ মান। আউটপুটগুলো যোগ করো: সবসময় ১০০%। শক্তি শুধু রূপ বদলায়; কোনোটাই সৃষ্টি বা হারিয়ে যায় না।")}</p>`; };
  el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ i=+b.dataset.i; el.querySelectorAll("button").forEach(q=>q.setAttribute("aria-pressed",q===b)); go(); }));
  go();
};
