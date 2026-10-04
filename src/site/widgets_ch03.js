/* ---- chapter 3 widgets ---- */
const arrowDefs = (id,col) => `<defs><marker id="${id}" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto"><path d="M0,1 L13,7 L0,13 z" fill="${col}"/></marker></defs>`;

/* 3.1 inertia: coin on card over a glass */
W.inertia = (el) => {
  el.innerHTML = `<div class="svgwrap fit" id="insvg"></div><div class="w-row"><button class="btn solid" id="infast">${L2("Flick the card fast","কার্ডটি জোরে টোকা দাও")}</button><button class="btn" id="inslow">${L2("Pull the card slowly","কার্ডটি আস্তে টানো")}</button></div><div class="w-out" id="inout"></div>`;
  let cardX=0, coinX=0, coinY=0, mode=null, t=0;
  const draw=()=>{
    let s=`<svg viewBox="0 0 600 220" role="img" aria-label="coin and card">`;
    s+=`<path d="M250 110 L270 210 L330 210 L350 110" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
    s+=`<rect x="${230+cardX}" y="100" width="140" height="8" fill="var(--note)"/>`;
    s+=`<rect x="${285+coinX}" y="${88+coinY}" width="30" height="12" rx="6" fill="var(--muted)" stroke="var(--ink)"/></svg>`;
    $("#insvg",el).innerHTML=s;
  };
  const reset=()=>{cardX=0;coinX=0;coinY=0;t=0;};
  $("#infast",el).addEventListener("click",()=>{reset();mode="fast";$("#inout",el).innerHTML=L2("The card shoots away, but the coin tends to stay at rest (inertia of rest). With nothing under it, gravity pulls it straight into the glass.","কার্ড ছিটকে যায়, কিন্তু কয়েনটি স্থির থাকতে চায় (স্থিতি জড়তা)। নিচে কিছু না থাকায় অভিকর্ষ একে সোজা গ্লাসে ফেলে দেয়।");});
  $("#inslow",el).addEventListener("click",()=>{reset();mode="slow";$("#inout",el).innerHTML=L2("Pulled slowly, friction between the card and the coin has time to drag the coin along with the card.","আস্তে টানলে কার্ড আর কয়েনের মধ্যকার ঘর্ষণ কয়েনটিকে কার্ডের সাথে টেনে নেওয়ার সময় পায়।");});
  animate(el, dt=>{ if(mode==="fast"){ t+=dt; cardX=Math.min(400,cardX+1600*dt); if(cardX>80) coinY=Math.min(100, coinY + 500*dt*(t)); }
    if(mode==="slow"){ cardX=Math.min(260,cardX+80*dt); coinX=cardX; if(cardX>=260) mode=null; } draw(); });
  draw();
};

/* 3.2 four fundamental forces */
W.forces4 = (el) => {
  const F=[[L2("Strong nuclear","সবল নিউক্লীয়"),100,"10⁻¹⁵ m",L2("Holds protons and neutrons together in the nucleus","নিউক্লিয়াসে প্রোটন ও নিউট্রনকে ধরে রাখে")],
    [L2("Electromagnetic","তড়িৎচৌম্বক"),1,L2("any distance","যেকোনো দূরত্ব"),L2("Comb attracting paper, magnets, chemical bonds, friction, the push of a table","চিরুনি কাগজ টানা, চুম্বক, রাসায়নিক বন্ধন, ঘর্ষণ, টেবিলের ঠেলা")],
    [L2("Weak nuclear","দুর্বল নিউক্লীয়"),0.000001,"10⁻¹⁸ m",L2("Beta (β) emission from radioactive nuclei","তেজস্ক্রিয় নিউক্লিয়াস থেকে বিটা (β) নিঃসরণ")],
    [L2("Gravitational","মহাকর্ষ"),1e-36,L2("any distance","যেকোনো দূরত্ব"),L2("Weight, the Moon's orbit, the Earth round the Sun","ওজন, চাঁদের কক্ষপথ, সূর্যের চারপাশে পৃথিবী")]];
  el.innerHTML = `<div style="display:grid;gap:8px">${F.map(([n,st,r,ex],i)=>{ const w = 8 + (Math.log10(st)+36)/38*92; return `<div style="border:1px solid var(--rule);border-radius:10px;padding:8px 12px;background:var(--paper)"><div class="w-row" style="justify-content:space-between"><b>${n}</b><span class="hint">${L2("range","পাল্লা")}: ${r}</span></div><div class="bar" style="margin:6px 0"><i style="width:${w}%"></i></div><div class="hint">${ex}</div></div>`;}).join("")}</div>
  <p class="hint">${L2("Bar length shows relative strength on a logarithmic scale: gravity is about 10³⁶ times weaker than the electromagnetic force; the strong force is about 100 times stronger than it.","দণ্ডের দৈর্ঘ্য লগারিদমিক স্কেলে আপেক্ষিক শক্তি দেখায়: মহাকর্ষ তড়িৎচৌম্বক বলের চেয়ে প্রায় ১০³⁶ গুণ দুর্বল; সবল বল এর চেয়ে প্রায় ১০০ গুণ শক্তিশালী।")}</p>`;
};

/* 3.3 balanced/unbalanced: tug of war */
W.tug = (el) => {
  el.innerHTML = slider("tgL",L2("Team A pulls left","দল A বাঁয়ে টানছে"),0,300,10,150,"N")+slider("tgR",L2("Team B pulls right","দল B ডানে টানছে"),0,300,10,150,"N")+`<div class="svgwrap fit" id="tgsvg"></div><div class="w-out" id="tgo"></div>`;
  let x=0,v=0;
  const man=(cx,dir)=>`<g transform="translate(${cx},0) scale(${dir},1)"><circle cx="0" cy="62" r="9" fill="var(--ink)"/><line x1="0" y1="71" x2="6" y2="98" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line x1="6" y1="98" x2="-4" y2="124" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line x1="6" y1="98" x2="16" y2="124" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line x1="2" y1="80" x2="18" y2="88" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/></g>`;
  const draw=()=>{ const L=sv(el,"tgL","N"), R=sv(el,"tgR","N"), net=R-L;
    const cx=180+x;
    let s=`<svg viewBox="0 0 360 190" role="img" aria-label="tug of war">${arrowDefs("tga","var(--bad)")}${arrowDefs("tgb","var(--c)")}<rect x="0" y="124" width="360" height="6" fill="var(--muted)" opacity=".4"/>`;
    s+=`<line x1="${cx-150}" y1="88" x2="${cx+150}" y2="88" stroke="var(--note)" stroke-width="4"/><rect x="${cx-3}" y="78" width="6" height="20" fill="var(--bad)"/><line x1="180" y1="132" x2="180" y2="146" stroke="var(--muted)" stroke-width="2"/><text x="180" y="160" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("centre line","মাঝের দাগ")}</text>`;
    s+=man(cx-120,-1)+man(cx-150,-1)+man(cx+120,1)+man(cx+150,1);
    s+=`<text x="${cx-135}" y="44" font-size="15" text-anchor="middle" font-weight="700" fill="var(--c)">A</text><text x="${cx+135}" y="44" font-size="15" text-anchor="middle" font-weight="700" fill="var(--c)">B</text>`;
    if(L) s+=`<line x1="${cx-20}" y1="30" x2="${cx-22-L*0.3}" y2="30" stroke="var(--c)" stroke-width="4" marker-end="url(#tgb)"/><text x="${cx-24-L*0.15}" y="16" font-size="14" text-anchor="middle" fill="var(--c)">${bnNum(L,LANG)} N</text>`;
    if(R) s+=`<line x1="${cx+20}" y1="30" x2="${cx+22+R*0.3}" y2="30" stroke="var(--c)" stroke-width="4" marker-end="url(#tgb)"/><text x="${cx+24+R*0.15}" y="16" font-size="14" text-anchor="middle" fill="var(--c)">${bnNum(R,LANG)} N</text>`;
    if(net) s+=`<line x1="${cx}" y1="176" x2="${cx+net*0.5}" y2="176" stroke="var(--bad)" stroke-width="5" marker-end="url(#tga)"/><text x="${cx+net*0.25}" y="170" font-size="13" text-anchor="middle" font-weight="700" fill="var(--bad)">${L2("resultant","লব্ধি")} ${bnNum(Math.abs(net),LANG)} N</text>`;
    s+=`</svg>`; $("#tgsvg",el).innerHTML=s;
    $("#tgo",el).innerHTML = net===0 ? L2(`${L} N left, ${R} N right: resultant = ${R} − ${L} = <b>0</b>. The forces are <b>balanced</b>: the rope does not start moving (if it was still, it stays still).`,`বাঁয়ে ${bnNum(L,"bn")} N, ডানে ${bnNum(R,"bn")} N: লব্ধি = ${bnNum(R,"bn")} − ${bnNum(L,"bn")} = <b>০</b>। বলগুলো <b>সাম্য</b>: দড়ি নড়তে শুরু করে না (স্থির থাকলে স্থিরই থাকে)।`) : L2(`Resultant = ${Math.max(R,L)} − ${Math.min(R,L)} = <b>${Math.abs(net)} N to the ${net>0?"right":"left"}</b>. The forces are <b>unbalanced</b>, so the rope accelerates towards team ${net>0?"B":"A"}.`,`লব্ধি = ${bnNum(Math.max(R,L),"bn")} − ${bnNum(Math.min(R,L),"bn")} = <b>${bnNum(Math.abs(net),"bn")} N ${net>0?"ডানে":"বাঁয়ে"}</b>। বলগুলো <b>অসাম্য</b>, তাই দড়িটি দল ${net>0?"B":"A"}-এর দিকে ত্বরিত হয়।`);
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>{x=0;v=0;draw();}));
  if(REDUCED) draw(); else animate(el, dt=>{ const net=(+$("#tgR",el).value)-(+$("#tgL",el).value); if(net===0){ v=0; } else { v+=net*0.4*dt; x+=v*dt; if(Math.abs(x)>60){ x=0; v=0; } } draw(); });
  draw();
};

/* 3.4 momentum comparer */
W.momentum = (el) => {
  el.innerHTML = `<div class="w-row"><label for="mv">${L2("Speed of both","দুটোর বেগ")}</label><input class="w-range" style="width:200px" type="range" id="mv" min="1" max="30" value="15"><span id="mvv" class="muted"></span></div><div id="mb" style="display:grid;gap:8px"></div><p class="hint">${L2("Same velocity, very different momentum: the truck's is 200 times larger because its mass is 200 times larger.","একই বেগ, কিন্তু ভরবেগে বিশাল পার্থক্য: ট্রাকের ভর ২০০ গুণ বেশি বলে ভরবেগও ২০০ গুণ বেশি।")}</p>`;
  const go=()=>{ const v=+$("#mv",el).value; $("#mvv",el).textContent=bnNum(v,LANG)+" m/s";
    const items=[[L2("Bicycle + rider","সাইকেল + আরোহী"),80],[L2("Loaded truck","মালবোঝাই ট্রাক"),16000]];
    const max=16000*30;
    $("#mb",el).innerHTML=items.map(([n,m])=>{const p=m*v; return `<div><div class="w-row" style="justify-content:space-between"><b>${n}</b><span class="muted">m = ${bnNum(m,LANG)} kg → p = ${bnNum(p.toLocaleString("en"),LANG)} kg m/s</span></div><div class="bar"><i style="width:${Math.max(0.6,100*p/max)}%"></i></div></div>`;}).join("");
  };
  $("#mv",el).addEventListener("input",go); go();
};

/* 3.5 elastic collision simulator */
W.collision = (el) => {
  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">
  ${[["m1",L2("mass m₁ (kg)","ভর m₁ (kg)"),2],["u1",L2("velocity u₁ (m/s)","বেগ u₁ (m/s)"),3],["m2",L2("mass m₂ (kg)","ভর m₂ (kg)"),2],["u2",L2("velocity u₂ (m/s)","বেগ u₂ (m/s)"),0]].map(([k,l,v])=>`<label style="display:grid;font-size:14px;color:var(--muted);min-width:0">${l}<input class="w-in" style="width:100%" type="number" step="any" id="co-${k}" value="${v}"></label>`).join("")}</div>
  <div class="svgwrap fit" id="cosvg"></div><div class="w-row"><button class="btn solid" id="cogo">${L2("Collide","সংঘর্ষ ঘটাও")}</button><button class="btn" id="coeq">${L2("Equal masses","সমান ভর")}</button><button class="btn" id="cotr">${L2("Truck vs car","ট্রাক বনাম গাড়ি")}</button></div><div class="w-out" id="coo"></div>`;
  let x1=90,x2=230,v1=0,v2=0,run=false,hit=false;
  const val=k=>+$("#co-"+k,el).value;
  const res=()=>{ const m1=val("m1"),m2=val("m2"),u1=val("u1"),u2=val("u2"); const a=((m1-m2)*u1+2*m2*u2)/(m1+m2), b=((m2-m1)*u2+2*m1*u1)/(m1+m2); return {m1,m2,u1,u2,a,b}; };
  const f=x=>bnNum((+x).toFixed(2),LANG).replace("-","−");
  const draw=()=>{ const r=res(); const w1=26+Math.min(40,Math.sqrt(Math.abs(r.m1))*9), w2=26+Math.min(40,Math.sqrt(Math.abs(r.m2))*9);
    const c1=hit?v1:(run?v1:r.u1), c2=hit?v2:(run?v2:r.u2);
    let s=`<svg viewBox="0 0 360 150" role="img" aria-label="collision">${arrowDefs("cva","var(--bad)")}<rect x="0" y="120" width="360" height="5" fill="var(--muted)" opacity=".4"/>`;
    s+=`<rect x="${x1-w1}" y="${120-w1}" width="${w1}" height="${w1}" rx="4" fill="var(--c)"/><text x="${x1-w1/2}" y="${120-w1/2+5}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--sheet)">m₁</text>`;
    s+=`<rect x="${x2}" y="${120-w2}" width="${w2}" height="${w2}" rx="4" fill="var(--note)"/><text x="${x2+w2/2}" y="${120-w2/2+5}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">m₂</text>`;
    const arr=(x,y,v)=> Math.abs(v)<0.01? `<text x="${x}" y="${y}" font-size="12" text-anchor="middle" fill="var(--muted)">${L2("at rest","স্থির")}</text>` : `<line x1="${x}" y1="${y}" x2="${x+Math.max(-50,Math.min(50,v*12))}" y2="${y}" stroke="var(--bad)" stroke-width="3" marker-end="url(#cva)"/><text x="${x}" y="${y-8}" font-size="12" text-anchor="middle" fill="var(--bad)">${f(v)} m/s</text>`;
    s+=arr(x1-w1/2,120-w1-14,c1)+arr(x2+w2/2,120-w2-14,c2);
    s+=`<text x="10" y="144" font-size="12" fill="var(--muted)">${hit?L2("after the collision","সংঘর্ষের পর"):L2("before the collision","সংঘর্ষের আগে")}</text></svg>`;
    $("#cosvg",el).innerHTML=s;
    const pb=r.m1*r.u1+r.m2*r.u2, pa=r.m1*r.a+r.m2*r.b;
    $("#coo",el).innerHTML=L2(`After collision: v₁ = <b>${f(r.a)} m/s</b>, v₂ = <b>${f(r.b)} m/s</b><br>Total momentum before = ${f(r.m1)}×${f(r.u1)} + ${f(r.m2)}×${f(r.u2)} = <b>${f(pb)}</b> kg m/s<br>Total momentum after = <b>${f(pa)}</b> kg m/s → the same (conserved)`,
      `সংঘর্ষের পর: v₁ = <b>${f(r.a)} m/s</b>, v₂ = <b>${f(r.b)} m/s</b><br>আগের মোট ভরবেগ = ${f(r.m1)}×${f(r.u1)} + ${f(r.m2)}×${f(r.u2)} = <b>${f(pb)}</b> kg m/s<br>পরের মোট ভরবেগ = <b>${f(pa)}</b> kg m/s → একই (সংরক্ষিত)`);
  };
  const reset=()=>{ x1=110; x2=220; hit=false; };
  const start=()=>{ const r=res(); reset(); v1=r.u1; v2=r.u2; run=true; if(REDUCED){ v1=r.a; v2=r.b; hit=true; run=false; draw(); } };
  $("#cogo",el).addEventListener("click",start);
  $("#coeq",el).addEventListener("click",()=>{ [["m1",2],["u1",3],["m2",2],["u2",0]].forEach(([k,v])=>$("#co-"+k,el).value=v); start(); });
  $("#cotr",el).addEventListener("click",()=>{ [["m1",20],["u1",2],["m2",1],["u2",-2]].forEach(([k,v])=>$("#co-"+k,el).value=v); start(); });
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>{run=false;reset();draw();}));
  if(!REDUCED) animate(el, dt=>{ if(run){ x1+=v1*25*dt; x2+=v2*25*dt; const r=res(); if(!hit && x1>=x2){ v1=r.a; v2=r.b; hit=true; } if(x1<-60||x2>420||x1>420||x2<-60) run=false; } draw(); });
  reset(); draw();
};

/* 3.6 F = ma: cart + live velocity–time graph */
W.fma = (el) => {
  el.innerHTML = slider("fF",L2("Force F","বল F"),0,100,5,40,"N")+slider("fm",L2("Mass m","ভর m"),1,50,1,10,"kg")+
  `<div class="svgwrap fit" id="fsvg"></div><div class="w-row"><button class="btn solid" id="fgo">${L2("Push for 3 s","৩ সেকেন্ড ঠেলো")}</button><button class="btn" id="fkeep">${L2("Keep this line for comparing","তুলনার জন্য রেখা রেখে দাও")}</button></div><div class="w-out" id="fo"></div>`;
  let x=0,v=0,t=0,run=false,kept=null;
  const VMAX=30;
  const draw=()=>{ const F=sv(el,"fF","N"), m=sv(el,"fm","kg"), a=F/m;
    const size=26+m*0.8; const bx=70+(x%200);
    let s=`<svg viewBox="0 0 360 300" role="img" aria-label="cart and graph">${arrowDefs("fa","var(--bad)")}`;
    s+=`<rect x="0" y="96" width="360" height="5" fill="var(--muted)" opacity=".4"/><rect x="${bx}" y="${88-size}" width="${size+20}" height="${size}" rx="5" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><circle cx="${bx+8}" cy="91" r="6" fill="var(--ink)"/><circle cx="${bx+size+12}" cy="91" r="6" fill="var(--ink)"/><text x="${bx+size/2+10}" y="${88-size/2+5}" font-size="13" text-anchor="middle" fill="var(--c)" font-weight="700">${bnNum(m,LANG)} kg</text>`;
    if(run && F>0) s+=`<line x1="${bx-4-F*0.5}" y1="${88-size/2}" x2="${bx-3}" y2="${88-size/2}" stroke="var(--bad)" stroke-width="4" marker-end="url(#fa)"/><text x="${bx-6-F*0.25}" y="${80-size/2}" font-size="12" text-anchor="middle" fill="var(--bad)">${bnNum(F,LANG)} N</text>`;
    // graph
    const gx=tt=>50+tt*95, gy=vv=>280-vv/VMAX*150;
    s+=`<line x1="50" y1="280" x2="345" y2="280" stroke="var(--muted)"/><line x1="50" y1="125" x2="50" y2="280" stroke="var(--muted)"/>`;
    for(let k=0;k<=3;k++) s+=`<text x="${gx(k)}" y="296" font-size="12" text-anchor="middle" fill="var(--muted)">${bnNum(k,LANG)}</text>`;
    for(let k=0;k<=30;k+=10) s+=`<text x="44" y="${gy(k)+4}" font-size="12" text-anchor="end" fill="var(--muted)">${bnNum(k,LANG)}</text>`;
    s+=`<text x="345" y="272" font-size="12" text-anchor="end" fill="var(--muted)">t (s)</text><text x="56" y="136" font-size="12" fill="var(--muted)">v (m/s)</text>`;
    if(kept) s+=`<line x1="${gx(0)}" y1="${gy(0)}" x2="${gx(3)}" y2="${gy(Math.min(VMAX,kept.a*3))}" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="6 4"/><text x="${gx(3)-2}" y="${gy(Math.min(VMAX,kept.a*3))-6}" font-size="12" text-anchor="end" fill="var(--muted)">a = ${bnNum(kept.a.toFixed(1),LANG)}</text>`;
    const vv=Math.min(VMAX,v); s+=`<line x1="${gx(0)}" y1="${gy(0)}" x2="${gx(t)}" y2="${gy(vv)}" stroke="var(--c)" stroke-width="3.5"/><circle cx="${gx(t)}" cy="${gy(vv)}" r="5" fill="var(--c)"/>`;
    s+=`</svg>`; $("#fsvg",el).innerHTML=s;
    $("#fo",el).innerHTML=L2(`a = F ÷ m = ${F} ÷ ${m} = <b>${a.toFixed(2)} m/s²</b>. After ${t.toFixed(1)} s: v = a × t = ${v.toFixed(2)} m/s. A steeper line on the graph = a bigger acceleration.`,`a = F ÷ m = ${bnNum(F,"bn")} ÷ ${bnNum(m,"bn")} = <b>${bnNum(a.toFixed(2),"bn")} m/s²</b>। ${bnNum(t.toFixed(1),"bn")} s পর: v = a × t = ${bnNum(v.toFixed(2),"bn")} m/s। লেখচিত্রে রেখা যত খাড়া, ত্বরণ তত বেশি।`);
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>{x=0;v=0;t=0;run=false;draw();}));
  $("#fgo",el).addEventListener("click",()=>{x=0;v=0;t=0;run=true; if(REDUCED){ const a=(+$("#fF",el).value)/(+$("#fm",el).value); t=3; v=a*3; run=false; draw(); }});
  $("#fkeep",el).addEventListener("click",()=>{ kept={a:(+$("#fF",el).value)/(+$("#fm",el).value)}; draw(); });
  if(!REDUCED) animate(el, dt=>{ if(run){ const a=(+$("#fF",el).value)/(+$("#fm",el).value); t=Math.min(3,t+dt); v=a*t; x+=v*dt*8; if(t>=3) run=false; } draw(); });
  draw();
};

/* 3.7 g at a height: Earth picture + graph */
W.gravity = (el) => {
  el.innerHTML = slider("gh",L2("Height above the surface","পৃষ্ঠ থেকে উচ্চতা"),0,20000,50,400,"km")+`<div class="chipset" role="group" id="ghp"><button data-h="0">${L2("Ground","ভূপৃষ্ঠ")}</button><button data-h="8.8">${L2("Everest","এভারেস্ট")}</button><button data-h="400">${L2("Space station","মহাকাশ স্টেশন")}</button><button data-h="6370">${L2("h = R","h = R")}</button><button data-h="20000">20 000 km</button></div><div class="svgwrap fit" id="gsv"></div><div class="w-out" id="gho"></div>`;
  const R=6370, g0=9.8;
  const go=()=>{ const h=sv(el,"gh","km"); const g=g0/Math.pow(1+h/R,2);
    // picture: Earth radius 60px on left, object at distance proportional
    const ER=48, cx=70, cy=110, sc=ER/R; const d=Math.min(ER+ h*sc, 250);
    let s=`<svg viewBox="0 0 360 330" role="img" aria-label="g versus height">${arrowDefs("gga","var(--bad)")}`;
    s+=`<circle cx="${cx}" cy="${cy}" r="${ER}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/><text x="${cx}" y="${cy+5}" font-size="13" text-anchor="middle" fill="var(--c)">${L2("Earth","পৃথিবী")}</text>`;
    s+=`<circle cx="${cx}" cy="${cy}" r="${d}" fill="none" stroke="var(--rule)" stroke-dasharray="4 4"/>`;
    const ox=cx+d, oy=cy; s+=`<circle cx="${ox}" cy="${oy}" r="7" fill="var(--ink)"/>`;
    const al=10+g/g0*50; s+=`<line x1="${ox}" y1="${oy-14}" x2="${ox-al}" y2="${oy-14}" stroke="var(--bad)" stroke-width="4" marker-end="url(#gga)"/><text x="${Math.max(ox,150)}" y="${oy-26}" font-size="14" text-anchor="middle" fill="var(--bad)" font-weight="700">g = ${bnNum(g.toFixed(2),LANG)}</text>`;
    s+=`<text x="${cx}" y="22" font-size="12" fill="var(--muted)">${L2("arrow length = strength of g","তীরের দৈর্ঘ্য = g-এর মান")}</text>`;
    // graph
    const X=x=>50+x/20000*290, Y=y=>310-y/g0*110;
    s+=`<line x1="50" y1="310" x2="345" y2="310" stroke="var(--muted)"/><line x1="50" y1="195" x2="50" y2="310" stroke="var(--muted)"/>`;
    let p=""; for(let k=0;k<=20000;k+=200){ p+=`${X(k)},${Y(g0/Math.pow(1+k/R,2))} `; } s+=`<polyline points="${p}" fill="none" stroke="var(--c)" stroke-width="3"/>`;
    [0,4.9,9.8].forEach(k=>{ s+=`<text x="45" y="${Y(k)+4}" font-size="12" text-anchor="end" fill="var(--muted)">${bnNum(k,LANG)}</text>`; });
    s+=`<line x1="${X(6370)}" y1="305" x2="${X(6370)}" y2="315" stroke="var(--muted)"/><text x="${X(6370)}" y="327" font-size="12" text-anchor="middle" fill="var(--muted)">R</text>`;
    s+=`<circle cx="${X(h)}" cy="${Y(g)}" r="6" fill="var(--bad)"/><text x="56" y="205" font-size="12" fill="var(--muted)">g (m/s²)</text><text x="345" y="302" font-size="12" text-anchor="end" fill="var(--muted)">h (km)</text></svg>`;
    $("#gsv",el).innerHTML=s;
    const extra = Math.abs(h-6370)<60 ? L2(" At h = R you are twice as far from the centre, so g is ¼ of 9.8.", " h = R হলে কেন্দ্র থেকে দূরত্ব দ্বিগুণ, তাই g হয় ৯.৮-এর ¼।") : (h>=380&&h<=420 ? L2(" Astronauts float not because g is zero (it is still about 8.7 m/s²) but because they are falling around the Earth with the station."," নভোচারীরা ভাসেন g শূন্য বলে নয় (এখনো প্রায় ৮.৭ m/s²), বরং স্টেশনসহ তাঁরা পৃথিবীর চারদিকে পড়তে থাকেন বলে।") : "");
    $("#gho",el).innerHTML=L2(`g' = g ÷ (1 + h/R)² = 9.8 ÷ (1 + ${h}/6370)² = <b>${g.toFixed(2)} m/s²</b>.${extra}`,`g' = g ÷ (১ + h/R)² = ৯.৮ ÷ (১ + ${bnNum(h,"bn")}/৬৩৭০)² = <b>${bnNum(g.toFixed(2),"bn")} m/s²</b>।${extra}`);
  };
  $("#gh",el).addEventListener("input",go);
  $("#ghp",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ $("#gh",el).value=b.dataset.h; go(); }));
  go();
};

/* 3.7.1 pulleys and strings: one hanging weight (Fig 3.09) or two weights on two sides (Fig 3.10) */
W.pulley = (el) => {
  const g=9.8, n=x=>bnNum(String(+(+x).toFixed(2)),LANG).replace("-","−"), nb=x=>bnNum(String(+(+x).toFixed(2)),"bn").replace("-","−");
  let mode="one", t=0, d=0, run=false;
  el.innerHTML = `<div class="chipset" role="group" id="plm"><button data-k="one" aria-pressed="true">${L2("One hanging weight","একটি ঝোলানো ওজন")}</button><button data-k="two" aria-pressed="false">${L2("Two weights, two sides","দুই পাশে দুটি ওজন")}</button></div><div id="plc" style="margin-top:10px"></div><div class="svgwrap fit" id="plsvg"></div><div class="w-row"><button class="btn solid" id="plgo">${L2("Release","ছেড়ে দাও")}</button><button class="btn" id="plre">${L2("Reset","আবার")}</button></div><p class="hint" style="margin:10px 0 4px">${L2("Try these:","এগুলো চেষ্টা করো:")}</p><div class="chipset" id="plp" style="margin-bottom:10px"></div><div class="w-out" id="plo"></div>`;
  const val=id=>+$("#"+id,el).value;
  const calc=()=>{ if(mode==="one"){ const M=val("plM"), m=val("plb"), a=M*g/(M+m); return {M,m,a,T:m*a}; }
    const m2=val("pl2"), m1=val("pl1"), m=val("plb"), a=(m2-m1)*g/(m1+m2+m); return {m1,m2,m,a,T1:m1*(g+a),T2:m2*(g-a)}; };
  const MAX=()=>mode==="one"?74:34, K=()=>mode==="one"?16:9;
  const reset=()=>{ t=0; d=0; run=false; };
  const controls=()=>{
    $("#plc",el).innerHTML = mode==="one"
      ? slider("plM",L2("Hanging mass M","ঝোলানো ভর M"),0.5,10,0.5,2,"kg")+slider("plb",L2("Block on the table m","টেবিলের ব্লক m"),0.5,10,0.5,3,"kg")
      : slider("pl2",L2("Left weight m₂","বাঁ পাশের ওজন m₂"),1,15,1,10,"kg")+slider("pl1",L2("Right weight m₁","ডান পাশের ওজন m₁"),1,15,1,5,"kg")+slider("plb",L2("Block on the table m","টেবিলের ব্লক m"),1,20,1,5,"kg");
    const P = mode==="one"
      ? [[L2("Heavy block","ভারী ব্লক"),{plM:1,plb:10}],[L2("Very light block","খুব হালকা ব্লক"),{plM:5,plb:0.5}],[L2("Equal masses","সমান ভর"),{plM:3,plb:3}]]
      : [[L2("Book: 10 kg and 5 kg","বই: ১০ kg ও ৫ kg"),{pl2:10,pl1:5,plb:5}],[L2("Equal weights","সমান ওজন"),{pl2:8,pl1:8,plb:5}],[L2("Right side heavier","ডান পাশ ভারী"),{pl2:4,pl1:12,plb:4}]];
    $("#plp",el).innerHTML = P.map(([l],i)=>`<button data-i="${i}">${l}</button>`).join("");
    $("#plc",el).querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>{ reset(); draw(); }));
    $("#plp",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ const v=P[+b.dataset.i][1]; Object.keys(v).forEach(k=>{ $("#"+k,el).value=v[k]; }); reset(); draw(); }));
  };
  const arr=(x1,y1,x2,y2,id,col,w=3.5)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" marker-end="url(#${id})"/>`;
  const txt=(x,y,s,col,anc="start",fs=13,b=false)=>`<text x="${x}" y="${y}" font-size="${fs}" text-anchor="${anc}" fill="${col}"${b?' font-weight="700"':""}>${s}</text>`;
  const pul=(cx,ang)=>`<circle cx="${cx}" cy="74" r="10" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/><line x1="${cx-8*Math.cos(ang)}" y1="${74-8*Math.sin(ang)}" x2="${cx+8*Math.cos(ang)}" y2="${74+8*Math.sin(ang)}" stroke="var(--muted)" stroke-width="2"/><circle cx="${cx}" cy="74" r="2.5" fill="var(--ink)"/>`;
  const block=(bx,m)=>`<rect x="${bx}" y="44" width="54" height="40" rx="4" fill="var(--note-soft)" stroke="var(--note)" stroke-width="2"/>${txt(bx+27,61,"m","var(--ink)","middle",13,true)}${txt(bx+27,77,n(m)+" kg","var(--ink)","middle",12)}`
    + arr(bx+27,42,bx+27,20,"pln","var(--muted)",2.5)+txt(bx+34,30,"N","var(--muted)")
    + arr(bx+27,86,bx+27,112,"pln","var(--muted)",2.5)+txt(bx+34,110,"mg","var(--muted)");
  const weight=(x,top,sym,m)=>`<rect x="${x-22}" y="${top}" width="44" height="38" rx="4" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>${txt(x,top+16,sym,"var(--c)","middle",13,true)}${txt(x,top+31,n(m)+" kg","var(--c)","middle",12)}`;
  const draw=()=>{ const c=calc(), A=Math.abs(c.a), v=A*t;
    const FM=mode==="one"?98:147, al=F=>10+Math.min(1,F/FM)*36, TC="var(--c)", WC="var(--bad)", AC="var(--good)";
    let s=`<svg viewBox="0 0 360 312" role="img" aria-label="${L2("masses joined by a string over a pulley","কপিকলের ওপর দিয়ে সুতায় বাঁধা ভর")}">${arrowDefs("plt",TC)}${arrowDefs("plw",WC)}${arrowDefs("pla",AC)}${arrowDefs("pln","var(--muted)")}<rect x="0" y="284" width="360" height="5" fill="var(--muted)" opacity=".4"/>`;
    if(mode==="one"){
      sv(el,"plM","kg",1); sv(el,"plb","kg",1);
      const bx=20+d, top=120+d, cy=top+19, lT=al(c.T), lW=al(c.M*g);
      s+=`<rect x="18" y="92" width="8" height="192" fill="var(--muted)" opacity=".55"/><rect x="176" y="92" width="8" height="192" fill="var(--muted)" opacity=".55"/><rect x="8" y="84" width="206" height="8" rx="2" fill="var(--c-soft)" stroke="var(--c)"/><line x1="212" y1="88" x2="224" y2="74" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>`;
      s+=`<path d="M${bx+54} 64 L224 64 A10 10 0 0 1 234 74 L234 ${top}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>`+pul(224,d/10);
      s+=block(bx,c.m)+weight(234,top,"M",c.M);
      s+=arr(bx+55,64,bx+55+lT,64,"plt",TC)+txt(bx+58,56,"T = "+n(c.T)+" N",TC,"start",13,true);
      s+=arr(234,top-1,234,top-1-lT,"plt",TC)+txt(242,top-10,"T = "+n(c.T)+" N",TC,"start",13,true);
      s+=arr(234,top+39,234,top+39+lW,"plw",WC)+txt(243,top+39+lW/2+7,"Mg = "+n(c.M*g)+" N",WC,"start",13,true);
      s+=arr(bx+66,30,bx+92,30,"pla",AC,2.5)+txt(bx+98,34,"a",AC,"start",13,true);
      s+=arr(200,cy-14,200,cy+12,"pla",AC,2.5)+txt(192,cy+4,"a",AC,"end",13,true);
    } else {
      sv(el,"pl2","kg"); sv(el,"pl1","kg"); sv(el,"plb","kg");
      const sg=Math.sign(c.a), bx=153-sg*d, tL=150+sg*d, tR=150-sg*d, l1=al(c.T1), l2=al(c.T2), w1=al(c.m1*g), w2=al(c.m2*g);
      s+=`<rect x="176" y="92" width="8" height="186" fill="var(--muted)" opacity=".55"/><rect x="140" y="278" width="80" height="6" fill="var(--muted)" opacity=".55"/><rect x="84" y="84" width="192" height="8" rx="2" fill="var(--c-soft)" stroke="var(--c)"/><line x1="86" y1="88" x2="72" y2="74" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/><line x1="274" y1="88" x2="288" y2="74" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>`;
      s+=`<path d="M${bx} 64 L72 64 A10 10 0 0 0 62 74 L62 ${tL}" fill="none" stroke="var(--ink)" stroke-width="1.6"/><path d="M${bx+54} 64 L288 64 A10 10 0 0 1 298 74 L298 ${tR}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>`+pul(72,-sg*d/10)+pul(288,-sg*d/10);
      s+=block(bx,c.m)+weight(62,tL,"m₂",c.m2)+weight(298,tR,"m₁",c.m1);
      s+=arr(bx-1,64,bx-1-l2,64,"plt",TC)+txt(bx-4,56,"T₂",TC,"end",13,true)+arr(bx+55,64,bx+55+l1,64,"plt",TC)+txt(bx+58,56,"T₁",TC,"start",13,true);
      s+=arr(62,tL-1,62,tL-1-l2,"plt",TC)+txt(70,tL-8,"T₂ = "+n(c.T2)+" N",TC,"start",12,true);
      s+=arr(298,tR-1,298,tR-1-l1,"plt",TC)+txt(290,tR-8,"T₁ = "+n(c.T1)+" N",TC,"end",12,true);
      s+=arr(62,tL+39,62,tL+39+w2,"plw",WC)+txt(71,tL+39+w2/2+7,"m₂g = "+n(c.m2*g)+" N",WC,"start",12,true);
      s+=arr(298,tR+39,298,tR+39+w1,"plw",WC)+txt(289,tR+39+w1/2+7,"m₁g = "+n(c.m1*g)+" N",WC,"end",12,true);
      if(sg){ s+= sg>0 ? arr(bx+12,30,bx-14,30,"pla",AC,2.5)+txt(bx-20,34,"a",AC,"end",13,true) : arr(bx+48,30,bx+74,30,"pla",AC,2.5)+txt(bx+80,34,"a",AC,"start",13,true);
        s+=arr(28,tL+19-sg*13,28,tL+19+sg*13,"pla",AC,2.5)+txt(18,tL+23,"a",AC,"end",13,true)+arr(332,tR+19+sg*13,332,tR+19-sg*13,"pla",AC,2.5)+txt(342,tR+23,"a",AC,"start",13,true); }
    }
    s+= A<1e-9 ? txt(180,306,L2("a = 0: the two weights balance, nothing moves","a = ০: দুই ওজন সমান, কিছুই নড়ে না"),AC,"middle",13,true)
      : `<text x="180" y="306" font-size="13" text-anchor="middle" fill="var(--muted)"><tspan fill="var(--good)" font-weight="700">a = ${n(c.a<0?-c.a:c.a)} m/s²</tspan>  ·  t = ${bnNum(t.toFixed(1),LANG)} s  ·  v = a·t = ${bnNum(v.toFixed(1),LANG)} m/s</text>`;
    s+=`</svg>`; $("#plsvg",el).innerHTML=s;
    let o;
    if(mode==="one"){ const Wt=c.M*g;
      o=L2(`Block: <b>T = ma</b>. Hanging mass: <b>Mg − T = Ma</b>.<br>a = Mg ÷ (M + m) = ${n(c.M)} × 9.8 ÷ (${n(c.M)} + ${n(c.m)}) = <b>${n(c.a)} m/s²</b><br>T = ma = ${n(c.m)} × ${n(c.a)} = <b>${n(c.T)} N</b><br>The weight Mg = ${n(Wt)} N pulls down, but the string pulls up with only ${n(c.T)} N. The ${n(Wt-c.T)} N left over is what speeds M up. That is why <b>T is always less than Mg</b> here, and a is less than g.`,
        `ব্লক: <b>T = ma</b>। ঝোলানো ভর: <b>Mg − T = Ma</b>।<br>a = Mg ÷ (M + m) = ${nb(c.M)} × ৯.৮ ÷ (${nb(c.M)} + ${nb(c.m)}) = <b>${nb(c.a)} m/s²</b><br>T = ma = ${nb(c.m)} × ${nb(c.a)} = <b>${nb(c.T)} N</b><br>ওজন Mg = ${nb(Wt)} N নিচে টানে, কিন্তু সুতা ওপরে টানে মাত্র ${nb(c.T)} N বলে। বাকি ${nb(Wt-c.T)} N-ই M-এর গতি বাড়ায়। তাই এখানে <b>T সবসময় Mg-এর চেয়ে কম</b>, আর a সবসময় g-এর চেয়ে কম।`);
    } else if(A<1e-9){
      o=L2(`m₂ = m₁, so the two weights pull equally: a = (m₂ − m₁)g ÷ (m₁ + m₂ + m) = <b>0</b>. Nothing moves, and both tensions equal the hanging weight: T₁ = T₂ = ${n(c.T1)} N. The forces are balanced.`,
        `m₂ = m₁, তাই দুই ওজন সমান জোরে টানে: a = (m₂ − m₁)g ÷ (m₁ + m₂ + m) = <b>০</b>। কিছুই নড়ে না, আর দুটি টান বলই ঝোলানো ওজনের সমান: T₁ = T₂ = ${nb(c.T1)} N। বলগুলো সাম্যে আছে।`);
    } else { const L=c.a>0, h=L?"m₂":"m₁", lo=L?"m₁":"m₂", mh=L?c.m2:c.m1, ml=L?c.m1:c.m2, Th=L?c.T2:c.T1, Tl=L?c.T1:c.T2, th=L?"T₂":"T₁", tl=L?"T₁":"T₂";
      o=L2(`${h} is heavier, so it goes <b>down</b>, the block moves <b>${L?"left":"right"}</b> and ${lo} goes up.<br>a = (${h} − ${lo})g ÷ (m₁ + m₂ + m) = (${n(mh)} − ${n(ml)}) × 9.8 ÷ (${n(c.m1)} + ${n(c.m2)} + ${n(c.m)}) = <b>${n(A)} m/s²</b><br>${th} = ${h}(g − a) = <b>${n(Th)} N</b><br>${tl} = ${lo}(g + a) = <b>${n(Tl)} N</b><br>Net force on the block = ${th} − ${tl} = ${n(Th-Tl)} N = m × a = ${n(c.m)} × ${n(A)} ✓<br>Two strings, so <b>two different tensions</b>.`,
        `${h} ভারী, তাই এটি <b>নিচে</b> নামে, ব্লক <b>${L?"বাঁ":"ডান"} দিকে</b> যায় আর ${lo} ওপরে ওঠে।<br>a = (${h} − ${lo})g ÷ (m₁ + m₂ + m) = (${nb(mh)} − ${nb(ml)}) × ৯.৮ ÷ (${nb(c.m1)} + ${nb(c.m2)} + ${nb(c.m)}) = <b>${nb(A)} m/s²</b><br>${th} = ${h}(g − a) = <b>${nb(Th)} N</b><br>${tl} = ${lo}(g + a) = <b>${nb(Tl)} N</b><br>ব্লকের ওপর লব্ধি বল = ${th} − ${tl} = ${nb(Th-Tl)} N = m × a = ${nb(c.m)} × ${nb(A)} ✓<br>দুটি সুতা, তাই <b>দুটি আলাদা টান বল</b>।`);
    }
    $("#plo",el).innerHTML=o;
  };
  $("#plm",el).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ mode=b.dataset.k; $("#plm",el).querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b)); reset(); controls(); draw(); }));
  const end=()=>{ const A=Math.abs(calc().a); d=MAX(); t=Math.sqrt(2*MAX()/(A*K())); run=false; };
  $("#plgo",el).addEventListener("click",()=>{ reset(); if(Math.abs(calc().a)<1e-9){ draw(); return; } if(REDUCED){ end(); draw(); } else run=true; });
  $("#plre",el).addEventListener("click",()=>{ reset(); draw(); });
  controls();
  if(!REDUCED) animate(el, dt=>{ if(run){ const A=Math.abs(calc().a); t+=dt; d=0.5*A*t*t*K(); if(d>=MAX()) end(); draw(); } });
  draw();
};

/* 3.8 Newton's third law: push the stone on ice */
W.push = (el) => {
  el.innerHTML = `<div class="svgwrap fit" id="pusvg"></div><div class="w-row"><button class="btn solid" id="pugo">${L2("Push with 50 N for 2 s","২ সেকেন্ড ৫০ N বলে ঠেলো")}</button><button class="btn" id="pure">${L2("Reset","আবার")}</button></div><div class="w-out" id="puo"></div>`;
  let t=0, run=false, xs=0, xp=0;
  const draw=()=>{ let s=`<svg viewBox="0 0 360 200" role="img" aria-label="push">${arrowDefs("pa","var(--bad)")}${arrowDefs("pb","var(--c)")}<rect x="0" y="130" width="360" height="8" rx="3" fill="var(--c-soft)"/><text x="350" y="196" font-size="12" text-anchor="end" fill="var(--muted)">${L2("ice (no friction)","বরফ (ঘর্ষণ নেই)")}</text>`;
    const px=160-xp, sx=172+xs;
    s+=`<circle cx="${px}" cy="66" r="10" fill="var(--ink)"/><line x1="${px}" y1="76" x2="${px}" y2="106" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><line x1="${px}" y1="106" x2="${px-10}" y2="130" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><line x1="${px}" y1="106" x2="${px+10}" y2="130" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><line x1="${px}" y1="86" x2="${Math.min(px+16,sx)}" y2="88" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>`;
    s+=`<rect x="${sx}" y="72" width="70" height="58" rx="12" fill="var(--muted)"/><text x="${sx+35}" y="106" font-size="14" text-anchor="middle" fill="var(--sheet)" font-weight="700">100 kg</text><text x="${px}" y="156" font-size="13" text-anchor="middle" fill="var(--ink)" font-weight="700">${L2("you","তুমি")} 50 kg</text>`;
    if(run&&t<2){ s+=`<line x1="${sx+35}" y1="40" x2="${sx+95}" y2="40" stroke="var(--bad)" stroke-width="4" marker-end="url(#pa)"/><text x="${sx+70}" y="28" font-size="13" text-anchor="middle" fill="var(--bad)">${L2("on stone","পাথরে")} 50 N</text><line x1="${px}" y1="40" x2="${px-60}" y2="40" stroke="var(--c)" stroke-width="4" marker-end="url(#pb)"/><text x="${px-36}" y="28" font-size="13" text-anchor="middle" fill="var(--c)">${L2("on you","তোমাতে")} 50 N</text>`; }
    const vs=Math.min(t,2)*0.5, vp=Math.min(t,2)*1;
    if(t>0) s+=`<text x="${sx+8}" y="176" font-size="13" text-anchor="start" fill="var(--c)">${bnNum(vs.toFixed(1),LANG)} m/s →</text><text x="${px+4}" y="176" font-size="13" text-anchor="end" fill="var(--c)">← ${bnNum(vp.toFixed(1),LANG)} m/s</text>`;
    s+=`</svg>`; $("#pusvg",el).innerHTML=s;
  };
  const msg=()=>{ $("#puo",el).innerHTML=L2("Action: you push the stone with 50 N. Reaction: the stone pushes you back with 50 N, at the same moment. Stone: a = 50 ÷ 100 = 0.5 m/s² → 1 m/s after 2 s. You: a = 50 ÷ 50 = 1 m/s² → 2 m/s backwards. The forces are equal and opposite, but the lighter body gets the larger acceleration.","ক্রিয়া: তুমি পাথরকে ৫০ N বলে ঠেললে। প্রতিক্রিয়া: একই মুহূর্তে পাথরও তোমাকে ৫০ N বলে পেছনে ঠেলে। পাথর: a = ৫০ ÷ ১০০ = ০.৫ m/s² → ২ s পর ১ m/s। তুমি: a = ৫০ ÷ ৫০ = ১ m/s² → পেছনে ২ m/s। বল সমান ও বিপরীত, কিন্তু হালকা বস্তুর ত্বরণ বেশি।"); };
  $("#pugo",el).addEventListener("click",()=>{t=0;xs=0;xp=0;run=true;msg(); if(REDUCED){ t=2; xs=20; xp=40; run=false; draw(); }});
  $("#pure",el).addEventListener("click",()=>{t=0;xs=0;xp=0;run=false;draw();});
  if(!REDUCED) animate(el, dt=>{ if(run){ t+=dt; const vs=Math.min(t,2)*0.5, vp=Math.min(t,2)*1; xs+=vs*14*dt; xp+=vp*14*dt; if(xs>100||xp>120) run=false; } draw(); });
  draw();
};

/* 3.9 friction on an incline (matchbox on a book) */
W.friction = (el) => {
  el.innerHTML = slider("frmu",L2("Roughness: coefficient of static friction μs","অমসৃণতা: স্থিতি ঘর্ষণ গুণাঙ্ক μs"),0.1,1,0.05,0.4,"")+slider("frth",L2("Tilt of the book θ","বইয়ের হেলানো কোণ θ"),0,45,0.5,10,"°")+
  `<div class="svgwrap fit" id="frsvg"></div><div class="w-out" id="fro"></div>`;
  let slide=0;
  const draw=()=>{ const mu=sv(el,"frmu","",2), th=sv(el,"frth","°",1), r=th*Math.PI/180;
    const moving = Math.tan(r) > mu; const L=300, x0=30, y0=190; const x1=x0+L*Math.cos(r), y1=y0-L*Math.sin(r);
    const pos = moving ? Math.max(0.12, 0.62 - slide) : 0.62;
    const bx=x0+L*pos*Math.cos(r), by=y0-L*pos*Math.sin(r);
    const down=Math.sin(r), fmax=mu*Math.cos(r), fr=moving?fmax*0.8:down; const k=90; // arrow scale
    let s=`<svg viewBox="0 0 360 210" role="img" aria-label="incline">${arrowDefs("fra","var(--bad)")}${arrowDefs("frb","var(--good)")}<polygon points="${x0},${y0} ${x1},${y1} ${x1},${y0}" fill="var(--c-soft)" stroke="var(--c)" stroke-width="2"/>`;
    s+=`<path d="M${x0+50},${y0} A50,50 0 0,0 ${x0+50*Math.cos(r)},${y0-50*Math.sin(r)}" fill="none" stroke="var(--c)"/><text x="${x0+58}" y="${y0-6}" font-size="14" fill="var(--c)">θ</text>`;
    s+=`<g transform="translate(${bx},${by}) rotate(${-th})"><rect x="-24" y="-30" width="48" height="30" rx="3" fill="var(--note)" stroke="var(--ink)"/>`;
    if(down>0.005) s+=`<line x1="-26" y1="-15" x2="${-26-down*k}" y2="-15" stroke="var(--bad)" stroke-width="3.5" marker-end="url(#fra)"/>`;
    if(fr>0.005) s+=`<line x1="26" y1="-15" x2="${26+fr*k}" y2="-15" stroke="var(--good)" stroke-width="3.5" marker-end="url(#frb)"/>`;
    s+=`</g><text x="10" y="20" font-size="14" fill="var(--bad)">■ ${L2("pull down the slope","ঢাল বরাবর নিচের টান")}</text><text x="10" y="40" font-size="14" fill="var(--good)">■ ${L2("friction (up the slope)","ঘর্ষণ (ঢালের ওপরের দিকে)")}</text></svg>`;
    $("#frsvg",el).innerHTML=s;
    const crit=(Math.atan(mu)*180/Math.PI).toFixed(1);
    $("#fro",el).innerHTML=L2(`tan θ = ${Math.tan(r).toFixed(2)} ${moving?">":"≤"} μs = ${mu.toFixed(2)} → ${moving?"<b>the box slides</b>: the pull down the slope is bigger than the most friction can give.":"<b>the box stays</b>: friction grows just enough to match the pull."} It starts to slide at θ = ${crit}° (where tan θ = μs). A rougher surface (bigger μs) needs a steeper tilt.`,
      `tan θ = ${bnNum(Math.tan(r).toFixed(2),"bn")} ${moving?">":"≤"} μs = ${bnNum(mu.toFixed(2),"bn")} → ${moving?"<b>বাক্স পিছলে যায়</b>: ঢাল বরাবর টান ঘর্ষণের সর্বোচ্চ মানের চেয়ে বেশি।":"<b>বাক্স স্থির থাকে</b>: ঘর্ষণ ঠিক ততটুকু বাড়ে যতটুকু টান।"} θ = ${bnNum(crit,"bn")}° হলে (যেখানে tan θ = μs) পিছলাতে শুরু করে। তল যত অমসৃণ (μs বড়), তত বেশি হেলাতে হয়।`);
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>{slide=0;draw();}));
  if(!REDUCED) animate(el, dt=>{ const th=+$("#frth",el).value*Math.PI/180, mu=+$("#frmu",el).value; if(Math.tan(th)>mu){ slide=Math.min(0.5, slide+dt*0.25);} draw(); });
  draw();
};
