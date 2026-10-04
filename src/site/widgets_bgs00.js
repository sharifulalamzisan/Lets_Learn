/* ---- Bangladesh and Global Studies: shared map + diagram toolkit (window.G), used by widgets_bgs03/04/05.js ----
   Map data is loaded on demand from data/geo-*.json (built by geo/build_geo.py; sources and licences are listed there). */
const B = x => bnNum(x, LANG);
const GEO = {};
const loadGeo = n => GEO[n] || (GEO[n] = fetch("data/geo-" + n + ".json").then(r => { if (!r.ok) throw new Error("geo " + n); return r.json(); }).catch(e => { delete GEO[n]; throw e; }));  // a failed load is retried next time
const SRC = {
  bd: () => L2("Map data: district boundaries from geoBoundaries (BBS / OCHA), CC BY 4.0; rivers, neighbours and cities from Natural Earth.", "মানচিত্রের তথ্য: জেলার সীমানা geoBoundaries (বিবিএস / OCHA), CC BY 4.0; নদী, প্রতিবেশী দেশ ও শহর Natural Earth থেকে।"),
  world: () => L2("Map data: Natural Earth (public domain).", "মানচিত্রের তথ্য: Natural Earth (উন্মুক্ত)।"),
  plates: () => L2("Land: Natural Earth. Plate boundaries: Bird (2003), PB2002. Grouping the boundaries into the textbook's three belts is our own, approximate grouping.", "স্থলভাগ: Natural Earth। প্লেটের সীমানা: Bird (২০০৩), PB2002। সীমানাগুলোকে বইয়ের তিনটি বলয়ে ভাগ করা আমাদের নিজস্ব, আনুমানিক বিন্যাস।"),
  sasia: () => L2("Map data: Natural Earth (public domain). Boundaries are that dataset's de facto lines; some are disputed.", "মানচিত্রের তথ্য: Natural Earth (উন্মুক্ত)। সীমানাগুলো ওই উপাত্তের কার্যত রেখা; কিছু সীমানা নিয়ে বিরোধ আছে।")
};
const CAT = ["#c2603a", "#c79a2b", "#4f9a63", "#3f84c4", "#8a62b8", "#c2557f", "#3d9d9b", "#7d8a3a"]; // category colours (used with opacity on both themes)

/* buttons + drag + pinch on an svg viewBox */
function panZoom(wrap, svg, W, H, x0 = 0, y0 = 0) {
  let z = 1, cx = x0 + W / 2, cy = y0 + H / 2, moved = false;
  const apply = () => {
    const w = W / z, h = H / z;
    cx = Math.min(x0 + W - w / 2, Math.max(x0 + w / 2, cx)); cy = Math.min(y0 + H - h / 2, Math.max(y0 + h / 2, cy));
    svg.setAttribute("viewBox", `${(cx - w / 2).toFixed(2)} ${(cy - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
    wrap.classList.toggle("zoomed", z > 1.01); wrap.classList.toggle("z2", z >= 1.9);
  };
  const toView = (e) => { const r = svg.getBoundingClientRect(), w = W / z, h = H / z; return [cx - w / 2 + (e.clientX - r.left) / r.width * w, cy - h / 2 + (e.clientY - r.top) / r.height * h]; };
  const zoomAt = (f, px, py) => { const nz = Math.min(8, Math.max(1, z * f)); if (px !== undefined) { cx = px + (cx - px) * z / nz; cy = py + (cy - py) * z / nz; } z = nz; apply(); };
  const ctl = document.createElement("div"); ctl.className = "g-ctl";
  ctl.innerHTML = `<button type="button" data-z="in" aria-label="${L2("Zoom in", "বড় করো")}">+</button><button type="button" data-z="out" aria-label="${L2("Zoom out", "ছোট করো")}">−</button><button type="button" data-z="reset" aria-label="${L2("Reset the map", "আগের অবস্থায় ফেরাও")}">⟲</button>`;
  wrap.appendChild(ctl);
  ctl.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.z === "in") zoomAt(1.6); else if (b.dataset.z === "out") zoomAt(1 / 1.6); else { z = 1; cx = x0 + W / 2; cy = y0 + H / 2; apply(); } });
  const pts = new Map(); let pinch = 0;
  svg.addEventListener("pointerdown", e => { pts.set(e.pointerId, [e.clientX, e.clientY]); moved = false; });
  svg.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId)) return; const p = pts.get(e.pointerId), r = svg.getBoundingClientRect();
    if (pts.size === 1 && z > 1.01) {
      const dx = e.clientX - p[0], dy = e.clientY - p[1]; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      cx -= dx / r.width * (W / z); cy -= dy / r.height * (H / z); apply();
    } else if (pts.size === 2) {
      pts.set(e.pointerId, [e.clientX, e.clientY]); const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (pinch) { const m = toView({ clientX: (a[0] + b[0]) / 2, clientY: (a[1] + b[1]) / 2 }); zoomAt(d / pinch, m[0], m[1]); } pinch = d; moved = true; return;
    }
    pts.set(e.pointerId, [e.clientX, e.clientY]);
  });
  const up = e => { pts.delete(e.pointerId); pinch = 0; };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up); svg.addEventListener("pointerleave", up);
  svg.addEventListener("click", e => { if (moved) { e.stopPropagation(); moved = false; } }, true);
  apply();
  return { zoomTo(x, y, nz) { z = nz; cx = x; cy = y; apply(); }, reset() { z = 1; cx = x0 + W / 2; cy = y0 + H / 2; apply(); } };
}
const halo = `paint-order="stroke" stroke="var(--g-bd)" stroke-width="2.4" stroke-linejoin="round"`;
const mapFail = (box) => { box.innerHTML = `<p class="hint">${L2("The map could not be loaded. Check your connection and reload the page.", "মানচিত্রটি আনা যায়নি। ইন্টারনেট সংযোগ দেখে পাতাটি আবার খোলো।")}</p>`; };
const mapWait = (box) => { box.innerHTML = `<p class="hint">${L2("Loading the map…", "মানচিত্র আসছে…")}</p>`; };

/* Bangladesh district map. opts: {neighbours, nbLabels, rivers:[keys]|true, lines, divLabels, zoom, fill(d), tap(d, api)} */
function bdMap(box, opts = {}) {
  mapWait(box);
  return loadGeo("bd").then(d => {
    const o = Object.assign({ neighbours: true, nbLabels: true, rivers: false, lines: false, divLabels: false, zoom: true }, opts);
    const X = lon => (lon - d.proj.lon0) * d.proj.kx, Y = lat => (d.proj.lat1 - lat) * d.proj.ky;
    const NBL = { "West Bengal": [88.02, 23.2], "Assam": [91.0, 26.42], "Meghalaya": [91.2, 25.55], "Tripura": [91.75, 23.75], "Mizoram": [92.72, 23.3], "Myanmar": [92.72, 21.05] };
    const rv = o.rivers === true ? d.rivers.map(r => r.k) : (o.rivers || []);
    const RW = { padma: 20, jamuna: 20, meghna: 18, tista: 12, karnaphuli: 13, dhaleshwari: 9, gorai: 9, arialkhan: 9, other: 6 };
    let s = `<svg viewBox="0 0 ${d.w} ${d.h}" role="img" aria-label="${L2("Map of Bangladesh", "বাংলাদেশের মানচিত্র")}"><g transform="scale(.1)">`;
    if (o.neighbours) s += `<g class="nb">${d.nb.map(n => `<path d="${n.d}" fill="var(--g-land)" stroke="var(--g-line)" stroke-width="4" stroke-opacity=".6"/>`).join("")}</g>`;
    s += `<g class="ds">${d.districts.map(x => `<path data-k="${esc(x.k)}" d="${x.d}" fill="var(--g-bd)" stroke="var(--g-line)" stroke-width="3.5" stroke-linejoin="round"/>`).join("")}</g>`;
    s += `<g class="rv" fill="none" stroke="var(--g-river)" stroke-linecap="round" stroke-linejoin="round">${d.rivers.filter(r => rv.includes(r.k)).map(r => `<path data-r="${r.k}" d="${r.d}" stroke-width="${RW[r.k]}"/>`).join("")}</g></g>`;
    if (o.lines) s += `<g font-size="11.5" fill="var(--muted)"><line x1="0" x2="${d.w}" y1="${Y(23.5)}" y2="${Y(23.5)}" stroke="var(--bad)" stroke-width="1" stroke-dasharray="5 4"/><text x="4" y="${Y(23.5) - 4}" fill="var(--bad)" ${halo}>${L2("Tropic of Cancer 23.5° N", "কর্কটক্রান্তি ২৩.৫° উ")}</text>
      <line y1="0" y2="${d.h}" x1="${X(90)}" x2="${X(90)}" stroke="var(--c)" stroke-width="1" stroke-dasharray="5 4"/><text x="${X(90) + 4}" y="${d.h - 8}" fill="var(--c)" ${halo}>${L2("90° E", "৯০° পূ")}</text></g>`;
    if (o.neighbours && o.nbLabels) s += `<g font-size="12" fill="var(--muted)" text-anchor="middle" font-style="italic">${d.nb.filter(n => NBL[n.k]).map(n => `<text x="${X(NBL[n.k][0])}" y="${Y(NBL[n.k][1])}"${n.k === "Mizoram" || n.k === "Myanmar" || n.k === "West Bengal" ? ` transform="rotate(-90 ${X(NBL[n.k][0])} ${Y(NBL[n.k][1])})"` : ""}>${L2(n.k, n.bn)}</text>`).join("")}<text x="${X(90.6)}" y="${Y(20.95)}" font-size="13">${L2("Bay of Bengal", "বঙ্গোপসাগর")}</text></g>`;
    s += `<g class="dl" font-size="5.6" fill="var(--ink)" text-anchor="middle">${d.districts.map(x => `<text x="${x.c[0]}" y="${x.c[1] + 2}">${L2(x.k, x.bn)}</text>`).join("")}</g>`;
    if (o.divLabels) s += `<g class="vl" font-size="12" font-weight="700" fill="var(--ink)" text-anchor="middle">${d.divisions.map(x => `<text x="${x.c[0]}" y="${x.c[1]}" ${halo}>${L2(x.k, x.bn)}</text>`).join("")}</g>`;
    s += `<g class="ov"></g></svg>`;
    box.classList.add("g-map"); box.innerHTML = s;
    const svg = $("svg", box), ov = $(".ov", svg), byK = {}; d.districts.forEach(x => byK[x.k] = x);
    const api = {
      d, svg, X, Y, P: (lon, lat) => [X(lon), Y(lat)], byK,
      paint(fn) { svg.querySelectorAll(".ds path").forEach(p => { const c = fn(byK[p.dataset.k]); p.setAttribute("fill", c && c.fill || "var(--g-bd)"); p.setAttribute("fill-opacity", c && c.op !== undefined ? c.op : 1); }); },
      outline(k) { svg.querySelectorAll(".ds path").forEach(p => { const on = p.dataset.k === k; p.setAttribute("stroke", on ? "var(--ink)" : "var(--g-line)"); p.setAttribute("stroke-width", on ? 9 : 3.5); if (on) p.parentNode.appendChild(p); }); },
      river(k) { svg.querySelectorAll(".rv path").forEach(p => { const on = !k || p.dataset.r === k; p.setAttribute("stroke-opacity", on ? 1 : .4); p.setAttribute("stroke-width", RW[p.dataset.r] * (k && on ? 2 : 1)); }); },
      /* markers: [{p:[x,y] | place:key | ll:[lon,lat], label, col, r, k, dx, dy, anchor}] */
      marks(list, cls = "mk") {
        let g = $("." + cls, ov); if (!g) { g = document.createElementNS(svgNS, "g"); g.setAttribute("class", cls); ov.appendChild(g); }
        g.innerHTML = list.map(m => {
          const p = m.p || (m.place ? d.places[m.place].p : api.P(m.ll[0], m.ll[1])); const lab = m.label !== undefined ? m.label : (m.place ? L2(d.places[m.place].en, d.places[m.place].bn) : "");
          return `<g ${m.k ? `data-k="${esc(m.k)}"` : ""}><circle cx="${p[0]}" cy="${p[1]}" r="${m.r || 3.6}" fill="${m.col || "var(--c)"}" stroke="var(--sheet)" stroke-width="1.2"/>${m.k ? `<circle cx="${p[0]}" cy="${p[1]}" r="13" fill="transparent"/>` : ""}${lab ? `<text x="${p[0] + (m.dx !== undefined ? m.dx : 6)}" y="${p[1] + (m.dy !== undefined ? m.dy : 4)}" font-size="${m.fs || 12}" font-weight="600" fill="var(--ink)" text-anchor="${m.anchor || "start"}" ${halo}>${lab}</text>` : ""}</g>`;
        }).join("");
        return g;
      },
      clear(cls = "mk") { const g = $("." + cls, ov); if (g) g.innerHTML = ""; },
      draw(html, cls = "dr") { let g = $("." + cls, ov); if (!g) { g = document.createElementNS(svgNS, "g"); g.setAttribute("class", cls); ov.appendChild(g); } g.innerHTML = html; return g; }
    };
    if (o.fill) api.paint(o.fill);
    if (o.tap) svg.addEventListener("click", e => { const m = e.target.closest(".ov [data-k]"); const p = e.target.closest(".ds path"); if (m) o.tap({ mark: m.dataset.k }, api); else if (p) o.tap(byK[p.dataset.k], api); });
    if (o.zoom) api.pz = panZoom(box, svg, d.w, d.h);
    return api;
  }).catch(e => { console.error(e); mapFail(box); throw e; });
}

/* World map, equirectangular. opts: {view:[lon0,lon1,lat0,lat1] (lon may run past 180 for a Pacific-centred view), countries:[A3], grid:deg, zoom} */
function worldMap(box, opts = {}) {
  mapWait(box);
  return loadGeo("world").then(d => {
    const o = Object.assign({ view: [-180, 180, -60, 84], grid: 30, zoom: true, countries: [], sx: 1 }, opts);
    const sx = o.sx;   // sx < 1 narrows the map east-west (an equirectangular map with a standard parallel away from the equator), which gives it more height on a phone
    const X = lon => (lon + 180) * 2 * sx, Y = lat => (90 - lat) * 2;
    const [a0, a1, b0, b1] = o.view; const vx = X(a0), vy = Y(b1), vw = (a1 - a0) * 2 * sx, vh = (b1 - b0) * 2, wrapPac = a1 > 180;
    const fs = vw / 25;  // font size that stays readable on a phone: about 13 px when the map is 330 px wide
    const rep = h => wrapPac ? h + `<g transform="translate(${720 * sx} 0)">${h}</g>` : h;
    const G0 = `<g transform="scale(${.1 * sx} .1)">`, NS = `vector-effect="non-scaling-stroke"`;
    let s = `<svg viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${L2("World map", "বিশ্ব মানচিত্র")}">`;
    s += rep(`${G0}<path d="${d.land}" fill="var(--g-land)" stroke="var(--g-line)" stroke-width=".6" stroke-opacity=".7" ${NS}/><g class="cs">${o.countries.map(k => `<path data-k="${k}" d="${d.countries[k].d}" fill="var(--c)" fill-opacity=".55" stroke="var(--c)" stroke-width=".8" ${NS}/>`).join("")}</g></g>`);
    if (o.grid) { let g = ""; for (let lon = Math.ceil(a0 / o.grid) * o.grid; lon <= a1; lon += o.grid) g += `<line x1="${X(lon)}" x2="${X(lon)}" y1="${vy}" y2="${vy + vh}"/>`; for (let lat = Math.ceil(b0 / o.grid) * o.grid; lat <= b1; lat += o.grid) g += `<line x1="${vx}" x2="${vx + vw}" y1="${Y(lat)}" y2="${Y(lat)}"/>`; s += `<g stroke="var(--g-line)" stroke-width="${vw / 900}" stroke-opacity=".45">${g}</g>`; }
    s += `<g class="ov"></g></svg>`;
    box.classList.add("g-map"); box.innerHTML = s;
    const svg = $("svg", box), ov = $(".ov", svg);
    const api = {
      d, svg, X, Y, fs, vx, vy, vw, vh, sx, G0, P: (lon, lat) => [X(lon), Y(lat)],
      cpt: k => [d.countries[k].c[0] * sx, d.countries[k].c[1]],
      draw(html, cls = "dr") { let g = $("." + cls, ov); if (!g) { g = document.createElementNS(svgNS, "g"); g.setAttribute("class", cls); ov.appendChild(g); } g.innerHTML = html; return g; },
      label(lon, lat, txt, o2 = {}) { return `<text x="${X(lon) + (o2.dx || 0)}" y="${Y(lat) + (o2.dy || 0)}" font-size="${fs * (o2.k || 1)}" text-anchor="${o2.anchor || "middle"}" fill="${o2.col || "var(--ink)"}" font-weight="${o2.w || 600}" paint-order="stroke" stroke="var(--g-land)" stroke-width="${fs / 4}" stroke-linejoin="round">${txt}</text>`; },
      dot(lon, lat, col = "var(--c)", k = 1) { return `<circle cx="${X(lon)}" cy="${Y(lat)}" r="${fs * .32 * k}" fill="${col}" stroke="var(--sheet)" stroke-width="${fs / 10}"/>`; },
      belt(k, col, wd = 1) { return rep(`${G0}<path d="${d.belts[k]}" fill="none" stroke="${col}" stroke-width="${2.4 * wd}" stroke-linecap="round" stroke-linejoin="round" ${NS}/></g>`); }
    };
    if (o.zoom) api.pz = panZoom(box, svg, vw, vh, vx, vy);
    return api;
  }).catch(e => { console.error(e); mapFail(box); throw e; });
}

/* South Asia map. opts: {countries:{A3:colour}, labels:[A3], cities:[keys], tap(k)} */
function sasiaMap(box, opts = {}) {
  mapWait(box);
  return loadGeo("sasia").then(d => {
    const o = Object.assign({ countries: {}, labels: [], cities: [], zoom: true }, opts);
    const X = lon => (lon - d.proj.lon0) * d.proj.kx, Y = lat => (d.proj.lat1 - lat) * d.proj.ky;
    let s = `<svg viewBox="0 0 ${d.w} ${d.h}" role="img" aria-label="${L2("Map of South Asia", "দক্ষিণ এশিয়ার মানচিত্র")}"><g transform="scale(.1)"><path d="${d.land}" fill="var(--g-land)"/>`;
    s += `<g class="cs">${Object.keys(d.countries).map(k => `<path data-k="${k}" d="${d.countries[k].d}" fill="${o.countries[k] || "var(--g-land)"}" fill-opacity="${o.countries[k] ? .6 : 1}" stroke="var(--g-line)" stroke-width="5"/>`).join("")}</g></g>`;
    s += `<g font-size="11.5" fill="var(--muted)" font-style="italic" text-anchor="middle"><text x="${X(89)}" y="${Y(14.5)}">${L2("Bay of Bengal", "বঙ্গোপসাগর")}</text><text x="${X(66)}" y="${Y(16)}">${L2("Arabian Sea", "আরব সাগর")}</text><text x="${X(78)}" y="${Y(5)}">${L2("Indian Ocean", "ভারত মহাসাগর")}</text></g>`;
    s += `<g font-size="12" font-weight="700" fill="var(--ink)" text-anchor="middle">${o.labels.map(k => `<text x="${d.countries[k].c[0]}" y="${d.countries[k].c[1] + 4}" paint-order="stroke" stroke="var(--g-land)" stroke-width="2.4" stroke-linejoin="round">${L2(d.countries[k].en, d.countries[k].bn)}</text>`).join("")}</g>`;
    s += `<g class="ct">${o.cities.map(k => { const c = d.cities[k]; return `<circle cx="${c.p[0]}" cy="${c.p[1]}" r="3" fill="var(--ink)"/><text x="${c.p[0] + 5}" y="${c.p[1] + 4}" font-size="10.5" fill="var(--ink)" paint-order="stroke" stroke="var(--g-land)" stroke-width="2.2">${L2(c.en, c.bn)}</text>`; }).join("")}</g><g class="ov"></g></svg>`;
    box.classList.add("g-map"); box.innerHTML = s;
    const svg = $("svg", box), ov = $(".ov", svg);
    const api = { d, svg, X, Y, P: (lon, lat) => [X(lon), Y(lat)],
      paint(cols) { svg.querySelectorAll(".cs path").forEach(p => { const c = cols[p.dataset.k]; p.setAttribute("fill", c || "var(--g-land)"); p.setAttribute("fill-opacity", c ? .6 : 1); }); },
      draw(html, cls = "dr") { let g = $("." + cls, ov); if (!g) { g = document.createElementNS(svgNS, "g"); g.setAttribute("class", cls); ov.appendChild(g); } g.innerHTML = html; return g; } };
    if (o.tap) svg.addEventListener("click", e => { const p = e.target.closest(".cs path"); if (p) o.tap(p.dataset.k, api); });
    if (o.zoom) api.pz = panZoom(box, svg, d.w, d.h);
    return api;
  }).catch(e => { console.error(e); mapFail(box); throw e; });
}

/* small helpers */
const chips = (el, sel, cb) => el.querySelectorAll(sel + " button").forEach(b => b.addEventListener("click", () => { el.querySelectorAll(sel + " button").forEach(q => q.setAttribute("aria-pressed", q === b)); cb(b.dataset.k, b); }));
const chipHtml = (cls, items, on) => `<div class="chipset ${cls}" role="group">${items.map(([k, t]) => `<button type="button" data-k="${k}" aria-pressed="${k === on}">${t}</button>`).join("")}</div>`;
const card = (title, body) => `<h4>${title}</h4>${body}`;
const list = (items, ord) => `<${ord ? "ol" : "ul"}>${items.map(x => `<li>${x}</li>`).join("")}</${ord ? "ol" : "ul"}>`;
const tiles = items => `<div class="g-tiles">${items.map(([b, t]) => `<div class="g-tile"><b>${b}</b>${t}</div>`).join("")}</div>`;
const bars = (rows, max, unit = "") => `<div class="g-bars">${rows.map(([lab, v, col]) => `<div class="row"><span>${lab}</span><span class="trk"><i style="width:${Math.max(2, 100 * v / max)}%${col ? ";background:" + col : ""}"></i></span><span class="val">${B(v)}${unit}</span></div>`).join("")}</div>`;
const legend = items => `<div class="g-leg">${items.map(([c, t, op]) => `<span><i style="background:${c};opacity:${op || 1}"></i>${t}</span>`).join("")}</div>`;
/* a chain of cause -> effect boxes; tap a box to read more. items: [[title, more]] */
function flow(el, items, opts = {}) {
  el.innerHTML = `<div class="g-flow">${items.map((it, i) => `${i ? `<div class="ar" aria-hidden="true">${opts.arrow || "↓"}</div>` : ""}<button type="button" data-i="${i}" aria-pressed="false"><b>${B(i + 1)}</b><span>${it[0]}</span>${it[1] ? `<span class="ex" hidden>${it[1]}</span>` : ""}</button>`).join("")}</div>`;
  el.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); const x = $(".ex", b); if (x) x.hidden = !on; }));
}
/* previous / next / play / reset over n steps; render(i) draws step i */
function stepper(el, n, render, opts = {}) {
  let i = 0, tm = null;
  el.innerHTML = `<div class="g-step"><button type="button" class="btn" data-a="prev">← ${L2("Back", "আগে")}</button><button type="button" class="btn solid" data-a="next">${L2("Next", "পরে")} →</button>${opts.play === false ? "" : `<button type="button" class="btn" data-a="play">▶ ${L2("Play", "চালাও")}</button>`}<button type="button" class="btn" data-a="reset">⟲ ${L2("Reset", "শুরু")}</button><span class="cnt"></span></div>`;
  const show = () => { $(".cnt", el).textContent = `${B(i + 1)} / ${B(n)}`; $('[data-a="prev"]', el).disabled = i === 0; $('[data-a="next"]', el).disabled = i === n - 1; render(i); };
  const stop = () => { if (tm) { clearInterval(tm); tm = null; const p = $('[data-a="play"]', el); if (p) p.innerHTML = `▶ ${L2("Play", "চালাও")}`; } };
  el.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return; const a = b.dataset.a;
    if (a === "prev") { stop(); i = Math.max(0, i - 1); show(); } else if (a === "next") { stop(); i = Math.min(n - 1, i + 1); show(); } else if (a === "reset") { stop(); i = 0; show(); }
    else if (a === "play") { if (tm) { stop(); return; } if (i === n - 1) i = -1; b.innerHTML = `❚❚ ${L2("Pause", "থামাও")}`; const tick = () => { if (!el.isConnected) { stop(); return; } i++; show(); if (i >= n - 1) stop(); }; tick(); if (i < n - 1) tm = setInterval(tick, opts.ms || 2200); else stop(); }
  });
  show();
  return { go(k) { stop(); i = k; show(); } };
}
window.G = { B, loadGeo, SRC, CAT, bdMap, worldMap, sasiaMap, panZoom, chips, chipHtml, card, list, tiles, bars, legend, flow, stepper, halo };
