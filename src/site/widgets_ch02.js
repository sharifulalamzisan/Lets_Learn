/* ---- chapter 2 widgets ---- */
const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function animate(el, step){ let last=performance.now(); const f=(now)=>{ if(!el.isConnected) return; if(document.hidden || now-last<30){ requestAnimationFrame(f); return; } const dt=Math.min(0.05,(now-last)/1000); last=now; step(dt); requestAnimationFrame(f); }; requestAnimationFrame(f); }
const nf = (x,d=2) => bnNum((+x).toFixed(d),LANG);

/* 2.1 relative motion: platform vs train view */
W.relative = (el) => {
  el.innerHTML = `<div class="chipset" role="group"><button data-v="ground" aria-pressed="true">${L2("Watch from the platform","প্ল্যাটফর্ম থেকে দেখি")}</button><button data-v="train" aria-pressed="false">${L2("Watch from inside the train","ট্রেনের ভেতর থেকে দেখি")}</button></div>
  <div class="svgwrap fit" id="rsvg"></div><div class="w-out" id="rout"></div>`;
  let view="ground", x=0; const V=40; // px per second
  const draw = () => {
    const W0=600,H=170; const trainX = view==="ground" ? (x%760)-160 : 220; const off = view==="ground"?0:-(x%120);
    let s=`<svg viewBox="0 0 ${W0} ${H}" role="img" aria-label="train">`;
    s+=`<rect x="0" y="130" width="${W0}" height="6" fill="var(--muted)" opacity=".5"/>`;
    for(let i=-1;i<7;i++){ const px=i*120+ (view==="ground"?0:off+120); s+=`<rect x="${px}" y="70" width="10" height="60" fill="var(--bio)" opacity=".7"/><circle cx="${px+5}" cy="62" r="16" fill="var(--bio)" opacity=".45"/>`; }
    s+=`<g transform="translate(${trainX},0)"><rect x="0" y="80" width="180" height="46" rx="8" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
    for(let i=0;i<4;i++) s+=`<rect x="${14+i*42}" y="88" width="30" height="18" rx="3" fill="var(--sheet)" stroke="var(--c)"/>`;
    s+=`<circle cx="40" cy="128" r="8" fill="var(--ink)"/><circle cx="140" cy="128" r="8" fill="var(--ink)"/><circle cx="71" cy="97" r="6" fill="var(--bad)"/><text x="71" y="72" font-size="22" font-weight="700" text-anchor="middle" fill="var(--bad)">${L2("you","তুমি")}</text></g></svg>`;
    $("#rsvg",el).innerHTML=s;
    $("#rout",el).innerHTML = view==="ground" ? L2("From the platform: <b>you and the train are moving</b>; the trees are at rest.","প্ল্যাটফর্ম থেকে: <b>তুমি আর ট্রেন চলছ</b>; গাছগুলো স্থির।") : L2("From your seat: <b>you are at rest</b>; the trees seem to move backwards. Both descriptions are correct: motion is relative.","তোমার সিট থেকে: <b>তুমি স্থির</b>; গাছগুলো পেছনে সরছে মনে হয়। দুটো বর্ণনাই সঠিক: গতি আপেক্ষিক।");
  };
  el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{view=b.dataset.v;el.querySelectorAll("button").forEach(q=>q.setAttribute("aria-pressed",q===b));draw();}));
  if(REDUCED){ x=200; draw(); } else animate(el, dt=>{ x+=V*dt*2; draw(); });
};

/* 2.2 types of motion */
W.motiontypes = (el) => {
  const T = [["linear",L2("Linear","রৈখিক")],["circular",L2("Circular","বৃত্তাকার")],["translational",L2("Translational","চলন")],["rotational",L2("Rotational","ঘূর্ণন")],["periodic",L2("Periodic","পর্যায়বৃত্ত")],["shm",L2("Simple harmonic","সরল ছন্দিত স্পন্দন")]];
  const txt = {
    linear:L2("A car on a straight road: every position lies on one straight line. The dots show where it was each second.","সোজা রাস্তায় গাড়ি: প্রতিটি অবস্থান একই সরলরেখায়। বিন্দুগুলো দেখায় প্রতি সেকেন্ডে গাড়িটি কোথায় ছিল।"),
    circular:L2("The Moon goes round the Earth, staying the same distance from it.","চাঁদ পৃথিবী থেকে একই দূরত্বে থেকে তার চারপাশে ঘোরে।"),
    translational:L2("Every point of the box (both red dots) moves the same distance in the same direction at the same time. The box never turns.","বাক্সের প্রতিটি বিন্দু (দুটি লাল বিন্দুই) একই সময়ে একই দিকে একই দূরত্ব যায়। বাক্সটি কখনো ঘোরে না।"),
    rotational:L2("A fan blade spins about a fixed axis: the red dot near the tip moves in a bigger circle than the yellow dot near the centre.","ফ্যানের পাখা স্থির অক্ষের চারদিকে ঘোরে: প্রান্তের কাছের লাল বিন্দু কেন্দ্রের কাছের হলুদ বিন্দুর চেয়ে বড় বৃত্তে চলে।"),
    periodic:L2("The fan tip passes the same point again and again after the same time interval (the period). The counter shows each repeat.","ফ্যানের প্রান্ত একই সময় পরপর (পর্যায়কাল) বারবার একই বিন্দু দিয়ে যায়। গণক প্রতিবারের পুনরাবৃত্তি দেখায়।"),
    shm:L2("A mass on a spring moves to and fro about its equilibrium point. It is fastest in the middle and stops for an instant at each end.","স্প্রিংয়ে ঝোলানো ভর সাম্যাবস্থার দুই পাশে আসা-যাওয়া করে। মাঝখানে সবচেয়ে দ্রুত, দুই প্রান্তে এক মুহূর্ত থামে।")};
  let k="linear", t=0;
  el.innerHTML = `<div class="chipset" role="group">${T.map(([a,b])=>`<button data-k="${a}" aria-pressed="${a===k}">${b}</button>`).join("")}</div><div class="svgwrap fit" id="msvg"></div><p class="hint" id="mtxt"></p>`;
  const draw = () => {
    let s=`<svg viewBox="0 0 360 200" role="img" aria-label="motion">`;
    if(k==="linear"){ const x = 20 + ((t*50)%300); s+=`<rect x="0" y="130" width="360" height="30" fill="var(--rule)" opacity=".6"/><line x1="0" y1="145" x2="360" y2="145" stroke="var(--sheet)" stroke-width="3" stroke-dasharray="14 10"/>`;
      for(let q=0;q<=Math.floor(t*50%300/50);q++) s+=`<circle cx="${40+q*50}" cy="112" r="4" fill="var(--bad)"/>`;
      s+=`<g transform="translate(${x},0)"><rect x="0" y="100" width="56" height="22" rx="6" fill="var(--c)"/><rect x="10" y="88" width="32" height="16" rx="5" fill="var(--c)"/><circle cx="12" cy="124" r="7" fill="var(--ink)"/><circle cx="44" cy="124" r="7" fill="var(--ink)"/></g>`; }
    if(k==="circular"||k==="periodic"){ const a=t*1.2; s+=`<circle cx="180" cy="100" r="75" fill="none" stroke="var(--rule)" stroke-dasharray="4 4" stroke-width="2"/><circle cx="180" cy="100" r="24" fill="var(--c)" opacity=".8"/><circle cx="${180+75*Math.cos(a)}" cy="${100+75*Math.sin(a)}" r="11" fill="var(--muted)"/>`;
      if(k==="periodic"){ const n=Math.floor(a/(2*Math.PI)); s+=`<line x1="255" y1="100" x2="275" y2="100" stroke="var(--bad)" stroke-width="4"/><text x="280" y="96" font-size="13" fill="var(--bad)">${L2("same point","একই বিন্দু")}</text><text x="280" y="114" font-size="13" fill="var(--bad)">${L2("repeats","পুনরাবৃত্তি")}: ${bnNum(n,LANG)}</text>`; } }
    if(k==="translational"){ const x = 20 + ((t*50)%240); s+=`<g transform="translate(${x},60)"><rect width="90" height="70" rx="4" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><circle cx="14" cy="14" r="6" fill="var(--bad)"/><circle cx="76" cy="56" r="6" fill="var(--bad)"/></g><line x1="10" y1="132" x2="350" y2="132" stroke="var(--rule)" stroke-width="2"/>`; }
    if(k==="rotational"){ const a=t*2; s+=`<g transform="translate(180,100) rotate(${a*57.3})">${[0,120,240].map(d=>`<rect x="-7" y="-85" width="14" height="78" rx="7" fill="var(--c)" transform="rotate(${d})"/>`).join("")}<circle r="11" fill="var(--ink)"/><circle cx="0" cy="-74" r="6" fill="var(--bad)"/><circle cx="0" cy="-30" r="6" fill="var(--note)"/></g><circle cx="180" cy="100" r="74" fill="none" stroke="var(--bad)" stroke-dasharray="3 5"/><circle cx="180" cy="100" r="30" fill="none" stroke="var(--note)" stroke-dasharray="3 5"/>`; }
    if(k==="shm"){ const y = 105 + 50*Math.sin(t*2.2); const coils=12; let p=`M180 12`; for(let i=1;i<=coils;i++){ const yy=12+(y-32)*i/coils; p+=` L${i%2?166:194} ${yy}`; } s+=`<rect x="130" y="4" width="100" height="8" fill="var(--muted)"/><path d="${p} L180 ${y-22}" fill="none" stroke="var(--muted)" stroke-width="2.5"/><rect x="158" y="${y-22}" width="44" height="44" rx="4" fill="var(--c)"/><line x1="100" y1="105" x2="260" y2="105" stroke="var(--bad)" stroke-dasharray="4 4"/><text x="264" y="109" font-size="13" fill="var(--bad)">${L2("equilibrium","সাম্যাবস্থা")}</text>`; }
    s+=`</svg>`; $("#msvg",el).innerHTML=s; $("#mtxt",el).textContent=txt[k];
  };
  el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{k=b.dataset.k;t=0;el.querySelectorAll("button").forEach(q=>q.setAttribute("aria-pressed",q===b));draw();}));
  if(REDUCED){ t=2.5; draw(); } else animate(el, dt=>{ t+=dt; draw(); });
};

/* 2.3 scalar or vector sorter */
W.sortsv = (el) => {
  const items = [[L2("Mass","ভর"),0],[L2("Velocity","বেগ"),1],[L2("Time","সময়"),0],[L2("Displacement","সরণ"),1],[L2("Temperature","তাপমাত্রা"),0],[L2("Force","বল"),1],[L2("Distance","দূরত্ব"),0],[L2("Speed","দ্রুতি"),0],[L2("Acceleration","ত্বরণ"),1],[L2("Length","দৈর্ঘ্য"),0]];
  el.innerHTML = `<p class="hint">${L2("Tap a quantity, then choose Scalar or Vector.","একটি রাশিতে চাপ দাও, তারপর স্কেলার বা ভেক্টর বেছে নাও।")}</p><div id="svl" style="display:grid;gap:6px"></div><div class="w-out" id="svs"></div>`;
  let score=0, done=0;
  $("#svl",el).innerHTML = items.map(([n,v],i)=>`<div class="w-row" data-i="${i}" style="justify-content:space-between;border:1px solid var(--rule);border-radius:10px;padding:6px 10px;background:var(--paper)"><b>${n}</b><span class="w-row"><button class="btn" data-a="0">${L2("Scalar","স্কেলার")}</button><button class="btn" data-a="1">${L2("Vector","ভেক্টর")}</button></span></div>`).join("");
  const upd=()=>{$("#svs",el).innerHTML = L2(`Score: <b>${score} / ${done}</b> (of ${items.length})`,`স্কোর: <b>${bnNum(score,"bn")} / ${bnNum(done,"bn")}</b> (মোট ${bnNum(items.length,"bn")})`);};
  el.querySelectorAll("[data-i]").forEach(row=>row.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    if(row.dataset.done) return; row.dataset.done=1; done++; const ok = +b.dataset.a===items[+row.dataset.i][1]; if(ok) score++;
    row.style.background = ok?"var(--good-soft)":"var(--bad-soft)";
    row.querySelector("span").innerHTML = `<b style="color:${ok?"var(--good)":"var(--bad)"}">${ok?"✓":"✗"} ${items[+row.dataset.i][1]?L2("Vector: needs a direction","ভেক্টর: দিক লাগে"):L2("Scalar: a number is enough","স্কেলার: একটি সংখ্যাই যথেষ্ট")}</b>`; upd();
  })));
  upd();
};

/* 2.4 distance vs displacement on a curved path */
W.pathdisp = (el) => {
  el.innerHTML = `<div class="svgwrap fit" id="pdsvg"></div><input class="w-range" type="range" id="pdr" min="0" max="1" step="0.002" value="0.55" aria-label="${L2("Position along the path","পথ বরাবর অবস্থান")}"><div class="w-out" id="pdo"></div>`;
  // path as polyline of points (km coordinates)
  const P=[]; for(let i=0;i<=200;i++){ const u=i/200; P.push([0.2+5.2*u, 1.6+1.4*Math.sin(u*Math.PI*1.6)]); }
  const L=[0]; for(let i=1;i<P.length;i++) L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const total=L[L.length-1];
  const draw=()=>{
    const f=+$("#pdr",el).value; const target=f*total; let i=L.findIndex(x=>x>=target); if(i<0) i=P.length-1;
    const sx=x=>20+x*100, sy=y=>190-y*50;
    let s=`<svg viewBox="0 0 600 200" role="img" aria-label="path">`;
    s+=`<polyline points="${P.map(p=>sx(p[0])+","+sy(p[1])).join(" ")}" fill="none" stroke="var(--rule)" stroke-width="6" stroke-linecap="round"/>`;
    s+=`<polyline points="${P.slice(0,i+1).map(p=>sx(p[0])+","+sy(p[1])).join(" ")}" fill="none" stroke="var(--c)" stroke-width="6" stroke-linecap="round"/>`;
    const A=P[0], B=P[i]; s+=`<defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--bad)"/></marker></defs>`;
    if(i>2) s+=`<line x1="${sx(A[0])}" y1="${sy(A[1])}" x2="${sx(B[0])}" y2="${sy(B[1])}" stroke="var(--bad)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ah)"/>`;
    s+=`<circle cx="${sx(A[0])}" cy="${sy(A[1])}" r="7" fill="var(--ink)"/><text x="${sx(A[0])-6}" y="${sy(A[1])+30}" font-size="24" font-weight="700" fill="var(--ink)">A</text><circle cx="${sx(B[0])}" cy="${sy(B[1])}" r="9" fill="var(--c)" stroke="var(--sheet)" stroke-width="2"/></svg>`;
    $("#pdsvg",el).innerHTML=s;
    const d=L[i], disp=Math.hypot(B[0]-A[0],B[1]-A[1]);
    $("#pdo",el).innerHTML=L2(`Distance travelled (blue path) = <b>${d.toFixed(2)} km</b><br>Displacement (red arrow, straight from A) = <b>${disp.toFixed(2)} km</b>`,`অতিক্রান্ত দূরত্ব (নীল পথ) = <b>${nf(d)} km</b><br>সরণ (লাল তীর, A থেকে সোজা) = <b>${nf(disp)} km</b>`);
  };
  $("#pdr",el).addEventListener("input",draw); draw();
};

/* 2.5 stone on a string: uniform speed, changing velocity */
W.circvel = (el) => {
  el.innerHTML = `<div class="svgwrap fit" id="cvsvg"></div><div class="w-row"><button class="btn" id="cvrel">${L2("Release the stone","পাথরটি ছেড়ে দাও")}</button><button class="btn" id="cvre">${L2("Start again","আবার শুরু")}</button></div><div class="w-out" id="cvo"></div>`;
  let a=0, free=null, trail=[];
  const cx=180,cy=120,R=80;
  const draw=()=>{
    let x,y,vx,vy;
    if(!free){ x=cx+R*Math.cos(a); y=cy+R*Math.sin(a); vx=-Math.sin(a); vy=Math.cos(a); }
    else { x=free.x; y=free.y; vx=free.vx; vy=free.vy; }
    let s=`<svg viewBox="0 0 360 240" role="img" aria-label="stone">${arrowDefs("va","var(--bad)")}`;
    s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--rule)" stroke-width="2" stroke-dasharray="5 5"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--ink)"/>`;
    trail.forEach(p=>{ s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${p[0]+p[2]*34}" y2="${p[1]+p[3]*34}" stroke="var(--bad)" stroke-opacity=".3" stroke-width="2.5" marker-end="url(#va)"/>`; });
    if(!free) s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--muted)" stroke-width="2"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="12" fill="var(--c)"/><line x1="${x}" y1="${y}" x2="${x+vx*55}" y2="${y+vy*55}" stroke="var(--bad)" stroke-width="4" marker-end="url(#va)"/>`;
    s+=`<text x="10" y="20" font-size="13" fill="var(--muted)">${L2("speed","দ্রুতি")} = 5 m/s (${L2("constant","ধ্রুব")})</text><text x="10" y="38" font-size="13" fill="var(--bad)">${L2("velocity arrow","বেগ-তীর")} →</text></svg>`;
    $("#cvsvg",el).innerHTML=s;
    $("#cvo",el).innerHTML = !free ? L2("The arrow keeps the <b>same length</b> (same speed) but points in a <b>new direction</b> every moment (faded arrows show earlier ones). Velocity = speed + direction, so the velocity is changing.","তীরের <b>দৈর্ঘ্য একই</b> (দ্রুতি একই), কিন্তু প্রতি মুহূর্তে <b>নতুন দিকে</b> তাক করে (হালকা তীরগুলো আগের দিক)। বেগ = দ্রুতি + দিক, তাই বেগ বদলাচ্ছে।") : L2("Released: the stone flies off along the last arrow, in a straight line. Now both speed and direction stay the same (ignoring air and gravity).","ছেড়ে দেওয়ার পর পাথর শেষ তীরের দিক বরাবর সরলরেখায় ছুটে যায়। এখন দ্রুতি ও দিক দুটোই একই থাকে (বাতাস ও অভিকর্ষ বাদ দিলে)।");
  };
  let acc=0;
  $("#cvrel",el).addEventListener("click",()=>{ if(!free){ free={x:cx+R*Math.cos(a), y:cy+R*Math.sin(a), vx:-Math.sin(a), vy:Math.cos(a)}; draw(); }});
  $("#cvre",el).addEventListener("click",()=>{ free=null; trail=[]; draw(); });
  if(REDUCED){ for(let q=0;q<6;q++){ const b=q*0.9; trail.push([cx+R*Math.cos(b),cy+R*Math.sin(b),-Math.sin(b),Math.cos(b)]); } a=5.6; draw(); }
  else animate(el, dt=>{ if(!free){ a+=dt*1.3; acc+=dt; if(acc>0.6){ acc=0; trail.push([cx+R*Math.cos(a),cy+R*Math.sin(a),-Math.sin(a),Math.cos(a)]); if(trail.length>7) trail.shift(); } } else { free.x+=free.vx*110*dt; free.y+=free.vy*110*dt; if(free.x<-40||free.x>400||free.y<-40||free.y>280){ free=null; trail=[]; } } draw(); });
};

/* 2.6 acceleration: car on a road + speedometer + live v–t graph */
W.accel = (el) => {
  el.innerHTML = slider("acu",L2("Initial velocity u","আদিবেগ u"),0,20,1,0,"m/s")+slider("aca",L2("Acceleration a","ত্বরণ a"),-3,3,0.5,2,"m/s²")+
  `<div class="svgwrap fit" id="acsvg"></div><div class="w-row"><button class="btn solid" id="acgo">${L2("Run for 10 s","১০ সেকেন্ড চালাও")}</button></div><div class="w-out" id="aco"></div>`;
  let t=0, run=false;
  const draw=()=>{
    const u=sv(el,"acu","m/s"), a=sv(el,"aca","m/s²",1); let v=u+a*t; let stopT = a<0 ? -u/a : Infinity; let tt=Math.min(t,stopT); v=u+a*tt; const s=u*tt+0.5*a*tt*tt;
    const VM=Math.max(10,u+Math.max(0,a)*10);
    const gx=q=>50+q*29, gy=q=>290-q/VM*140;
    let g=`<svg viewBox="0 0 360 310" role="img" aria-label="car and v-t graph">`;
    // road + car
    const carX = 10 + (s*3)%300; g+=`<rect x="0" y="70" width="360" height="26" fill="var(--rule)" opacity=".6"/><line x1="0" y1="83" x2="360" y2="83" stroke="var(--sheet)" stroke-width="3" stroke-dasharray="14 10"/>`;
    g+=`<g transform="translate(${carX},0)"><rect x="0" y="48" width="50" height="20" rx="6" fill="var(--c)"/><rect x="9" y="37" width="28" height="15" rx="5" fill="var(--c)"/><circle cx="11" cy="70" r="6" fill="var(--ink)"/><circle cx="39" cy="70" r="6" fill="var(--ink)"/></g>`;
    g+=`<text x="10" y="22" font-size="14" fill="var(--ink)">${L2("speedometer","স্পিডোমিটার")}: <tspan font-weight="700" fill="var(--c)">${bnNum(v.toFixed(1),LANG)} m/s</tspan></text><text x="350" y="22" font-size="14" text-anchor="end" fill="var(--muted)">t = ${bnNum(t.toFixed(1),LANG)} s</text>`;
    // graph
    g+=`<line x1="50" y1="290" x2="345" y2="290" stroke="var(--muted)"/><line x1="50" y1="140" x2="50" y2="290" stroke="var(--muted)"/>`;
    for(let k=0;k<=10;k+=2) g+=`<text x="${gx(k)}" y="305" font-size="12" text-anchor="middle" fill="var(--muted)">${bnNum(k,LANG)}</text>`;
    [0,Math.round(VM/2),Math.round(VM)].forEach(k=>{ g+=`<text x="44" y="${gy(k)+4}" font-size="12" text-anchor="end" fill="var(--muted)">${bnNum(k,LANG)}</text>`; });
    g+=`<text x="345" y="282" font-size="12" text-anchor="end" fill="var(--muted)">t (s)</text><text x="56" y="150" font-size="12" fill="var(--muted)">v (m/s)</text>`;
    let pts=`${gx(0)},${gy(u)}`; if(t>stopT) pts+=` ${gx(stopT)},${gy(0)} ${gx(t)},${gy(0)}`; else pts+=` ${gx(t)},${gy(v)}`;
    g+=`<polyline points="${pts}" fill="none" stroke="var(--c)" stroke-width="3.5"/><circle cx="${gx(t)}" cy="${gy(v)}" r="5" fill="var(--c)"/>`;
    if(t>=1 && Math.abs(a)>0 && t<=stopT){ // show 1-second step triangle
      const t0=Math.max(0,t-1); g+=`<line x1="${gx(t0)}" y1="${gy(u+a*t0)}" x2="${gx(t)}" y2="${gy(u+a*t0)}" stroke="var(--bad)" stroke-dasharray="4 3"/><line x1="${gx(t)}" y1="${gy(u+a*t0)}" x2="${gx(t)}" y2="${gy(v)}" stroke="var(--bad)" stroke-width="2"/><text x="${gx(t)+6}" y="${(gy(u+a*t0)+gy(v))/2+4}" font-size="12" fill="var(--bad)">${a>0?"+":"−"}${bnNum(Math.abs(a),LANG)} ${L2("each second","প্রতি সেকেন্ডে")}</text>`; }
    g+=`</svg>`;
    $("#acsvg",el).innerHTML=g;
    $("#aco",el).innerHTML=L2(`v = u + at = ${u} + (${a})×${tt.toFixed(1)} = <b>${v.toFixed(1)} m/s</b>; distance s = ${s.toFixed(1)} m. ${a>0?"The speedometer goes up by "+a+" m/s every second: that is the acceleration.":a<0?(t>stopT?"The car has stopped: deceleration brought it to rest.":"The speedometer goes down by "+(-a)+" m/s every second: deceleration (negative acceleration)."):"The speedometer does not change: no acceleration."}`,
      `v = u + at = ${bnNum(u,"bn")} + (${bnNum(a,"bn")})×${nf(tt,1)} = <b>${nf(v,1)} m/s</b>; দূরত্ব s = ${nf(s,1)} m। ${a>0?"স্পিডোমিটার প্রতি সেকেন্ডে "+bnNum(a,"bn")+" m/s করে বাড়ছে: এটাই ত্বরণ।":a<0?(t>stopT?"গাড়ি থেমে গেছে: মন্দন একে স্থির করেছে।":"স্পিডোমিটার প্রতি সেকেন্ডে "+bnNum(-a,"bn")+" m/s করে কমছে: মন্দন (ঋণাত্মক ত্বরণ)।"):"স্পিডোমিটার বদলাচ্ছে না: ত্বরণ নেই।"}`);
  };
  $("#acgo",el).addEventListener("click",()=>{t=0;run=true; if(REDUCED){ t=10; run=false; draw(); }});
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>{t=0;run=false;draw();}));
  if(!REDUCED) animate(el, dt=>{ if(run){ t=Math.min(10,t+dt*1.5); if(t>=10) run=false; } draw(); }); else draw();
  draw();
};

/* 2.7 equations of motion solver */
W.suvat = (el) => {
  const F=[["u",L2("initial velocity","আদিবেগ"),"m/s"],["v",L2("final velocity","শেষবেগ"),"m/s"],["a",L2("acceleration","ত্বরণ"),"m/s²"],["t",L2("time","সময়"),"s"],["s",L2("distance","দূরত্ব"),"m"]];
  const init={u:0,v:"",a:2,t:5,s:""};
  el.innerHTML = `<p class="hint">${L2("Fill in any three values and leave the other two empty. The solver picks the right equation.","যেকোনো তিনটি মান লেখো, বাকি দুটি ফাঁকা রাখো। সঠিক সমীকরণটি নিজেই বেছে নেবে।")}</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px">${F.map(([k,n,u])=>`<label style="display:grid;gap:2px;font-size:14px;color:var(--muted)"><span><b style="color:var(--c)">${k}</b> · ${n} (${u})</span><input class="w-in" type="number" step="any" id="sv-${k}" value="${init[k]}"></label>`).join("")}</div>
  <div class="w-out" id="svo"></div>`;
  const go=()=>{
    const g={}; for(const [k] of F){ const x=$("#sv-"+k,el).value; if(x!=="") g[k]=+x; }
    const known=Object.keys(g); const out=$("#svo",el);
    if(known.length!==3){ out.innerHTML=L2("Enter exactly three values.","ঠিক তিনটি মান দাও।"); return; }
    let {u,v,a,t,s}=g; const has=k=>k in g; let used=[];
    try{
      if(!has("v")&&!has("s")){ v=u+a*t; s=u*t+0.5*a*t*t; used=["v = u + at","s = ut + ½at²"]; }
      else if(!has("v")&&!has("t")){ const d=u*u+2*a*s; if(d<0) throw 0; v=Math.sqrt(d); t=a?(v-u)/a:s/u; used=["v² = u² + 2as","v = u + at"]; }
      else if(!has("v")&&!has("a")){ a=2*(s-u*t)/(t*t); v=u+a*t; used=["s = ut + ½at²","v = u + at"]; }
      else if(!has("v")&&!has("u")){ u=(s-0.5*a*t*t)/t; v=u+a*t; used=["s = ut + ½at²","v = u + at"]; }
      else if(!has("s")&&!has("t")){ t=(v-u)/a; s=(v*v-u*u)/(2*a); used=["v = u + at","v² = u² + 2as"]; }
      else if(!has("s")&&!has("a")){ a=(v-u)/t; s=(u+v)/2*t; used=["v = u + at","s = ((u + v)/2)t"]; }
      else if(!has("s")&&!has("u")){ u=v-a*t; s=(u+v)/2*t; used=["v = u + at","s = ((u + v)/2)t"]; }
      else if(!has("t")&&!has("a")){ t=2*s/(u+v); a=(v-u)/t; used=["s = ((u + v)/2)t","v = u + at"]; }
      else if(!has("t")&&!has("u")){ const d=v*v-2*a*s; if(d<0) throw 0; u=Math.sqrt(d); t=(v-u)/a; used=["v² = u² + 2as","v = u + at"]; }
      else if(!has("a")&&!has("u")){ u=2*s/t-v; a=(v-u)/t; used=["s = ((u + v)/2)t","v = u + at"]; }
      const bad=[u,v,a,t,s].some(x=>!isFinite(x)) || t<0; if(bad) throw 0;
      out.innerHTML = `${L2("Equations used","ব্যবহৃত সমীকরণ")}: <b>${used.join(" , ")}</b><br>u = ${nf(u)} m/s · v = ${nf(v)} m/s · a = ${nf(a)} m/s² · t = ${nf(t)} s · s = ${nf(s)} m`;
    }catch(e){ out.innerHTML=L2("These values are not possible together (for example a negative time). Check the signs.","এই মানগুলো একসাথে সম্ভব নয় (যেমন ঋণাত্মক সময়)। চিহ্নগুলো দেখে নাও।"); }
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",go)); go();
};

/* 2.8 free fall: stone and paper with/without air, strobe positions */
W.freefall = (el) => {
  el.innerHTML = `<div class="chipset" role="group"><button data-air="1" aria-pressed="true">${L2("With air","বাতাসসহ")}</button><button data-air="0" aria-pressed="false">${L2("In a vacuum","শূন্যস্থানে")}</button></div>
  <div class="svgwrap fit" id="ffsvg"></div><div class="w-row"><button class="btn solid" id="ffgo">${L2("Drop both","দুটোই ছেড়ে দাও")}</button></div><div class="w-out" id="ffo"></div>`;
  let air=true, t=0, run=false; const H=19.6; // m, 2 s in vacuum
  const pos=(kind,tt)=>{ if(!air||kind==="stone") return Math.min(H,0.5*9.8*tt*tt); const vt=2.5, k=9.8/vt; return Math.min(H,(vt/k)*(k*tt-(1-Math.exp(-k*tt)))); };
  const draw=()=>{
    const sy=h=>30+h*13; // 19.6 m → 255 px
    let s=`<svg viewBox="0 0 360 310" role="img" aria-label="falling"><rect x="40" y="${sy(H)+10}" width="300" height="6" fill="var(--muted)" opacity=".5"/>`;
    for(let k=0;k<=4;k++){ const tt=k*0.5, h=0.5*9.8*tt*tt; s+=`<line x1="90" y1="${sy(h)}" x2="330" y2="${sy(h)}" stroke="var(--rule)" stroke-dasharray="3 5"/><text x="84" y="${sy(h)+4}" font-size="12" text-anchor="end" fill="var(--muted)">${bnNum(tt.toFixed(1),LANG)} s · ${bnNum(h.toFixed(1),LANG)} m</text>`; }
    // strobe ghosts every 0.25 s up to t
    for(let q=0.25;q<t-0.01;q+=0.25){ s+=`<circle cx="160" cy="${sy(pos("stone",q))}" r="9" fill="var(--ink)" opacity=".18"/><rect x="246" y="${sy(pos("paper",q))-3}" width="30" height="6" fill="var(--c)" opacity=".25"/>`; }
    s+=`<circle cx="160" cy="${sy(pos("stone",t))}" r="10" fill="var(--ink)"/><text x="160" y="18" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">${L2("stone","পাথর")}</text>`;
    s+=`<rect x="246" y="${sy(pos("paper",t))-3}" width="30" height="7" fill="var(--c)" transform="rotate(${air&&run?Math.sin(t*8)*20:0} 261 ${sy(pos("paper",t))})"/><text x="261" y="18" font-size="14" font-weight="700" text-anchor="middle" fill="var(--c)">${L2("paper","কাগজ")}</text></svg>`;
    $("#ffsvg",el).innerHTML=s;
    $("#ffo",el).innerHTML = (air ? L2("With air, the paper is slowed by air resistance and lands later.","বাতাসে কাগজ বায়ুর বাধায় ধীর হয়ে পরে পড়ে।") : L2("In a vacuum there is no air resistance, so the stone and the paper fall together and land at the same time (Galileo's first law).","শূন্যস্থানে বায়ুর বাধা নেই, তাই পাথর আর কাগজ একসাথে পড়ে, একই সময়ে মাটিতে পৌঁছায় (গ্যালিলিওর প্রথম সূত্র)।"))
      + " " + L2("The faint copies of the stone are its position every 0.25 s: the gaps get bigger and bigger because it keeps speeding up (h = ½gt²). In 1 s it falls 4.9 m, but in 2 s it falls 19.6 m, four times as far.","পাথরের হালকা ছবিগুলো প্রতি ০.২৫ s পরপর এর অবস্থান: ফাঁক ক্রমশ বাড়ে, কারণ এটি দ্রুত থেকে দ্রুততর হয় (h = ½gt²)। ১ s-এ পড়ে ৪.৯ m, কিন্তু ২ s-এ পড়ে ১৯.৬ m, চার গুণ।");
  };
  el.querySelectorAll(".chipset button").forEach(b=>b.addEventListener("click",()=>{air=b.dataset.air==="1";el.querySelectorAll(".chipset button").forEach(q=>q.setAttribute("aria-pressed",q===b));t=0;run=false;draw();}));
  $("#ffgo",el).addEventListener("click",()=>{t=0;run=true; if(REDUCED){ t=2.6; run=false; draw(); }});
  if(!REDUCED) animate(el, dt=>{ if(run){ t+=dt*0.6; if(pos("stone",t)>=H&&pos("paper",t)>=H) run=false; } draw(); });
  draw();
};

/* 2.9 motion graphs: s = t² data → d–t, v–t, a–t */
W.graphs = (el) => {
  el.innerHTML = `<input class="w-range" type="range" id="gr" min="0.5" max="4.5" step="0.1" value="2.5" aria-label="time"><div class="svgwrap fit" id="gsvg"></div><div class="w-out" id="go"></div>`;
  const draw=()=>{
    const t=+$("#gr",el).value; const d=t*t, v=2*t, a=2;
    const panel=(ox,title,fn,ymax,yl,mark,tan)=>{ const gx=x=>ox+20+x*32, gy=y=>150-(y/ymax)*110; let s=`<g><text x="${ox+20}" y="20" font-size="13" font-weight="600" fill="var(--ink)">${title}</text><line x1="${ox+20}" y1="150" x2="${ox+185}" y2="150" stroke="var(--muted)"/><line x1="${ox+20}" y1="30" x2="${ox+20}" y2="150" stroke="var(--muted)"/>`;
      let p=""; for(let x=0;x<=5.001;x+=0.1) p+=`${gx(x)},${gy(fn(x))} `; s+=`<polyline points="${p}" fill="none" stroke="var(--c)" stroke-width="2.5"/>`;
      if(tan){ const m=tan; const x1=Math.max(0,t-1.2), x2=Math.min(5,t+1.2); s+=`<line x1="${gx(x1)}" y1="${gy(fn(t)+m*(x1-t))}" x2="${gx(x2)}" y2="${gy(fn(t)+m*(x2-t))}" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 3"/>`; }
      s+=`<circle cx="${gx(t)}" cy="${gy(fn(t))}" r="5" fill="var(--bad)"/><text x="${ox+185}" y="166" font-size="11" text-anchor="end" fill="var(--muted)">t (s)</text><text x="${ox+24}" y="42" font-size="11" fill="var(--muted)">${yl}</text></g>`; return s; };
    const wrap = inner => `<svg viewBox="0 0 200 175" role="img" style="width:100%;height:auto">${inner}</svg>`;
    $("#gsvg",el).innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px">${
      wrap(panel(0,L2("Distance–time","দূরত্ব–সময়"),x=>x*x,25,"s (m)",true,2*t))}${
      wrap(panel(0,L2("Velocity–time","বেগ–সময়"),x=>2*x,10,"v (m/s)",true,2))}${
      wrap(panel(0,L2("Acceleration–time","ত্বরণ–সময়"),x=>2,4,"a (m/s²)",false,0))}</div>`;
    $("#go",el).innerHTML=L2(`At t = ${t.toFixed(1)} s: distance = ${d.toFixed(2)} m. The <b>slope</b> of the distance–time curve (red line) is the velocity = ${v.toFixed(1)} m/s. The slope of the velocity–time line is the acceleration = ${a} m/s², the same at every moment.`,
      `t = ${nf(t,1)} s সময়ে: দূরত্ব = ${nf(d)} m। দূরত্ব–সময় লেখের <b>ঢাল</b> (লাল রেখা) হলো বেগ = ${nf(v,1)} m/s। বেগ–সময় রেখার ঢাল হলো ত্বরণ = ${bnNum(a,"bn")} m/s², যা প্রতি মুহূর্তে একই।`);
  };
  $("#gr",el).addEventListener("input",draw); draw();
};
