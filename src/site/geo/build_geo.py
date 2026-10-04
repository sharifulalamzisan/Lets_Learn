"""Build the compact map data used by the BGS (Bangladesh and Global Studies) widgets.

Run:  python3 build_geo.py <dir with the source files>      (writes geo-*.json next to this script)

Sources (not kept in the repo; download them into one folder first):
  bangladesh.geojson                      upazila polygons from github.com/ifahimreza/bangladesh-geojson (src/data),
                                          which is geoBoundaries gbOpen BGD ADM3 (BBS / OCHA ROAP, 2020), CC BY 4.0
  ne_10m_admin_0_countries.geojson        Natural Earth (public domain), github.com/nvkelso/natural-earth-vector/geojson
  ne_10m_admin_1_states_provinces.geojson
  ne_10m_rivers_lake_centerlines.geojson
  ne_10m_populated_places_simple.geojson
  ne_10m_geographic_lines.geojson
  ne_50m_admin_0_countries.geojson, ne_50m_land.geojson, ne_110m_land.geojson
  PB2002_boundaries.json                  plate boundaries, Bird (2003), github.com/fraxen/tectonicplates (ODC-By / PDDL)

The upazila -> district labels in the source file are wrong for several same-named upazilas, so every polygon
is re-assigned here (FIX below) and each district is checked to be one connected piece (islands aside).
"""
import json, sys, os, math, collections
from shapely.geometry import shape, box, mapping, Point, LineString, MultiLineString, Polygon, MultiPolygon
from shapely.ops import unary_union, linemerge
import topojson as tp

TOL = 0.012
SRC = sys.argv[1] if len(sys.argv) > 1 else "."
OUT = os.path.dirname(os.path.abspath(__file__))
J = lambda n: json.load(open(os.path.join(SRC, n), encoding="utf-8"))

# ---------------------------------------------------------------- Bangladesh map projection
LON0, LON1, LAT0, LAT1 = 87.5, 93.0, 20.5, 26.75
W = 360.0
CL = math.cos(math.radians(23.6))
K = W / ((LON1 - LON0) * CL)
H = round((LAT1 - LAT0) * K, 1)
def P(lon, lat): return ((lon - LON0) * CL * K, (LAT1 - lat) * K)

def path(geom, proj, dec=1, close=True):
    """SVG path with relative integer steps (units of 10^-dec px)."""
    f = 10 ** dec
    out = []
    def ring(coords, closed):
        pts = []
        for c in coords:
            x, y = proj(c[0], c[1]); q = (round(x * f), round(y * f))
            if not pts or q != pts[-1]: pts.append(q)
        if closed and len(pts) > 1 and pts[0] == pts[-1]: pts.pop()
        if len(pts) < (3 if closed else 2): return
        s = "M%d %d" % pts[0]; px, py = pts[0]; seg = []
        for x, y in pts[1:]:
            seg.append("%d %d" % (x - px, y - py)); px, py = x, y
        s += "l" + " ".join(seg) + ("z" if closed else "")
        out.append(s.replace(" -", "-"))
    def walk(g):
        t = g.geom_type
        if t == "Polygon":
            ring(g.exterior.coords, True)
            for i in g.interiors: ring(i.coords, True)
        elif t in ("MultiPolygon", "GeometryCollection", "MultiLineString"):
            for x in g.geoms: walk(x)
        elif t == "LineString": ring(g.coords, False)
    walk(geom)
    return "".join(out)

def pt(lon, lat, proj=P): x, y = proj(lon, lat); return [round(x, 1), round(y, 1)]

# ---------------------------------------------------------------- districts from upazilas
FIX_NAME = {  # polygons with no district in the source: upazila/thana name -> district
 **{n: "Chattogram" for n in "Bakalia|Chittagong Port|Double Mooring|Halishahar|Panchlaish|Patenga|Bayejid Bostami|Chandgaon|Khulshi|Pahartali|Anowara".split("|")},
 **{n: "Dhaka" for n in "Biman Bandar|Cantonment|Dakshinkhan|Gulshan|Jatrabari|Motijheel|New Market|Paltan|Ramna|Rampura|Sabujbagh|Shahbagh|Tejgaon|Tejgaon Ind. Area|Uttara|Bangshal|Chak Bazar|Darus Salam|Gendaria|Kadamtali|Kamrangir Char|Lalbagh|Shah Ali|Shyampur|Sutrapur|Turag|Uttar Khan|Kafrul|Pallabi|Adabor|Dhanmondi|Hazaribagh|Kalabagan|Sher-e-bangla Nagar|Badda|Demra|Khilgaon|Khilkhet".split("|")},
 "Kawkhali (Betbunia)": "Rangamati", "Baghai Chhari": "Rangamati", "Naniarchar": "Rangamati", "Khagrachhari Sadar": "Khagrachari",
 "Hatiya": "Noakhali", "Subarnachar": "Noakhali", "Kabirhat": "Noakhali", "Senbagh": "Noakhali",
 "Shajahanpur": "Bogura", "Sonatola": "Bogura", "Singra": "Natore", "Gurudaspur": "Natore",
 "Hajiganj": "Chandpur", "Matlab Dakshin": "Chandpur", "Chuadanga Sadar": "Chuadanga", "Gangni": "Meherpur", "Meherpur Sadar": "Meherpur",
 "Cox's Bazar Sadar": "Cox's Bazar", "Comilla Adarsha Sadar": "Cumilla", "Comilla Sadar Dakshin": "Cumilla", "Manoharganj": "Cumilla",
 "Fulbari": "Dinajpur", "Saltha": "Faridpur", "Chhagalnaiya": "Feni", "Fulgazi": "Feni", "Saghatta": "Gaibandha", "Bakshiganj": "Jamalpur",
 "Joypurhat Sadar": "Joypurhat", "Khalishpur": "Khulna", "Khan Jahan Ali": "Khulna", "Khulna Sadar": "Khulna", "Sonadanga": "Khulna",
 "Austagram": "Kishoreganj", "Lalmonirhat Sadar": "Lalmonirhat", "Raumari": "Kurigram", "Kamalnagar": "Lakshmipur", "Roypur": "Lakshmipur",
 "Zanjira": "Shariatpur", "Shariatpur Sadar": "Shariatpur", "Gazipur Sadar": "Gazipur", "Kaliakair": "Gazipur",
 "Maulvi Bazar Sadar": "Maulvibazar", "Serajdikhan": "Munshiganj", "Baghmara": "Rajshahi", "Mahadebpur": "Naogaon", "Narail Sadar": "Narail",
 "Narayanganj Sadar": "Narayanganj", "Manohardi": "Narsingdi", "Roypura": "Narsingdi", "Netrokona Sadar": "Netrokona", "Tentulia": "Panchagarh",
 "Kanthalia": "Jhalokati", "Boalia": "Rajshahi", "Matihar": "Rajshahi", "Rajpara": "Rajshahi", "Shah Makhdum": "Rajshahi",
 "Royganj": "Sirajgonj", "Dakshin Sunamganj": "Sunamganj", "Golabganj": "Sylhet", "Jaintiapur": "Sylhet",
}
FIX_AT = [  # same-named upazilas: (name, lon, lat, district); the nearest entry wins
 ("Daulatpur", 89.51, 22.88, "Khulna"), ("Daulatpur", 88.83, 24.03, "Kushtia"), ("Daulatpur", 89.85, 23.95, "Manikganj"),
 ("Mirpur", 90.36, 23.79, "Dhaka"), ("Mirpur", 88.99, 23.90, "Kushtia"),
 ("Mohammadpur", 90.35, 23.76, "Dhaka"), ("Mohammadpur", 89.56, 23.40, "Magura"),
 ("Sreepur", 90.49, 24.18, "Gazipur"), ("Sreepur", 89.41, 23.60, "Magura"),
 ("Pirganj", 88.32, 25.82, "Thakurgaon"), ("Pirganj", 89.26, 25.41, "Rangpur"),
 ("Companiganj", 91.30, 22.78, "Noakhali"), ("Companiganj", 91.79, 25.07, "Sylhet"),
 ("Kachua", 90.90, 23.35, "Chandpur"), ("Kachua", 89.90, 22.65, "Bagerhat"),
 ("Kaliganj", 90.57, 23.92, "Gazipur"), ("Kaliganj", 89.13, 23.41, "Jhenaidah"), ("Kaliganj", 89.20, 26.00, "Lalmonirhat"), ("Kaliganj", 89.04, 22.45, "Satkhira"),
 ("Kotwali", 91.83, 22.34, "Chattogram"), ("Kotwali", 90.41, 23.71, "Dhaka"), ("Kotwali", 89.20, 23.20, "Jashore"),
 ("Nawabganj", 90.16, 23.67, "Dhaka"), ("Nawabganj", 89.07, 25.42, "Dinajpur"),
 ("Shibganj", 89.32, 25.00, "Bogura"), ("Shibganj", 88.15, 24.68, "Nawabganj"),
 ("Kawkhali", 90.08, 22.59, "Pirojpur"),
]
DIST = {  # source district key -> (English, Bangla, division English, division Bangla)
}
STD = {"Nawabganj": ("Chapainawabganj", "চাঁপাইনবাবগঞ্জ"), "Sirajgonj": ("Sirajganj", "সিরাজগঞ্জ"), "Khagrachari": ("Khagrachhari", "খাগড়াছড়ি"),
       "Maulvibazar": ("Moulvibazar", "মৌলভীবাজার"), "Cox's Bazar": ("Cox's Bazar", "কক্সবাজার"), "Narayanganj": ("Narayanganj", "নারায়ণগঞ্জ"),
       "Rajbari": ("Rajbari", "রাজবাড়ী"), "Netrokona": ("Netrokona", "নেত্রকোনা")}

def build_bd():
    g = J("bangladesh.geojson")
    feats = []
    for f in g["features"]:
        p = f["properties"]; s = shape(f["geometry"]).buffer(0); c = s.representative_point()
        feats.append({"p": p, "s": s, "c": (c.x, c.y), "name": p["name"], "d": p["district_name"]})
    for f in feats:  # collect names from the correctly labelled ones
        p = f["p"]
        if p["district_name"] and p["district_name"] not in DIST:
            en, bn = STD.get(p["district_name"], (p["district_name"], p["district_bn_name"]))
            DIST[p["district_name"]] = (en, bn, p["division_name"], p["division_bn_name"])
    for f in feats:
        cands = [a for a in FIX_AT if a[0] == f["name"]]
        if cands:
            f["d"] = min(cands, key=lambda a: (a[1] - f["c"][0]) ** 2 + (a[2] - f["c"][1]) ** 2)[3]
        elif not f["d"]:
            f["d"] = FIX_NAME[f["name"]]
    by = collections.defaultdict(list)
    for f in feats: by[f["d"]].append(f)
    assert len(by) == 64, len(by)
    # union upazilas -> districts (close hairline gaps), keep islands above ~4 km2
    dpoly = {}
    for d, fs in by.items():
        u = unary_union([f["s"] for f in fs]).buffer(0.0004).buffer(-0.0004)
        parts = list(u.geoms) if u.geom_type == "MultiPolygon" else [u]
        parts.sort(key=lambda q: -q.area)
        big = [q for q in parts if q.area > 0.02 * parts[0].area and q.area > 0.0015]
        mainland = [q for q in big if q.distance(parts[0]) < 0.02]
        far = [q for q in big if q.distance(parts[0]) >= 0.25]
        if far: print("  note: separate part of", d, [(round(q.centroid.x, 2), round(q.centroid.y, 2), round(q.area, 4)) for q in far])
        assert not [q for q in far if q.distance(parts[0]) >= 0.6], d
        keep = [Polygon(q.exterior) if q.area < 0.02 else Polygon(q.exterior, [i for i in q.interiors if Polygon(i).area > 0.002]) for q in parts if q.area > 0.0004]
        dpoly[d] = unary_union(keep)
    # shared-border simplification
    fc = {"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {"k": d}, "geometry": mapping(s)} for d, s in sorted(dpoly.items())]}
    topo = tp.Topology(fc, prequantize=False, toposimplify=TOL, simplify_algorithm="dp", prevent_oversimplify=True)
    simp = {f["properties"]["k"]: shape(f["geometry"]).buffer(0) for f in json.loads(topo.to_geojson())["features"]}
    districts = []
    for d in sorted(simp, key=lambda k: DIST[k][0]):
        en, bn, dv, dvbn = DIST[d]
        s = simp[d]; main = max(s.geoms, key=lambda q: q.area) if s.geom_type == "MultiPolygon" else s
        c = main.representative_point()
        # label point: centre of the largest inscribed-ish area (representative point of an eroded shape)
        er = main.buffer(-0.06)
        if not er.is_empty:
            er = max(er.geoms, key=lambda q: q.area) if er.geom_type == "MultiPolygon" else er
            c = er.representative_point() if er.area > 0 else c
        districts.append({"k": en, "bn": bn, "dv": dv, "d": path(s, P), "c": pt(c.x, c.y)})
    divs = collections.defaultdict(list)
    for d, s in simp.items(): divs[(DIST[d][2], DIST[d][3])].append(s)
    divisions = []
    for (dv, dvbn), ss in sorted(divs.items()):
        u = unary_union([s.buffer(0.0006) for s in ss]).buffer(-0.0006)
        main = max(u.geoms, key=lambda q: q.area) if u.geom_type == "MultiPolygon" else u
        c = main.buffer(-0.15); c = (max(c.geoms, key=lambda q: q.area) if c.geom_type == "MultiPolygon" else c).representative_point()
        divisions.append({"k": dv, "bn": dvbn, "c": pt(c.x, c.y)})
    country = unary_union([s.buffer(0.0006) for s in simp.values()]).buffer(-0.0006)
    # places: upazila points by (district, upazila)
    up = {(f["d"], f["name"]): f["c"] for f in feats}
    return districts, divisions, country, up, simp

VIEW = box(LON0 - 0.3, LAT0 - 0.3, LON1 + 0.3, LAT1 + 0.3)
def neighbours():
    a1 = J("ne_10m_admin_1_states_provinces.geojson"); a0 = J("ne_10m_admin_0_countries.geojson")
    out = []
    bn = {"West Bengal": "পশ্চিমবঙ্গ", "Assam": "আসাম", "Meghalaya": "মেঘালয়", "Tripura": "ত্রিপুরা", "Mizoram": "মিজোরাম", "Bihar": "বিহার", "Jharkhand": "ঝাড়খণ্ড",
          "Sikkim": "সিকিম", "Manipur": "মণিপুর", "Nagaland": "নাগাল্যান্ড", "Arunachal Pradesh": "অরুণাচল", "Odisha": "ওড়িশা",
          "Myanmar": "মিয়ানমার", "Nepal": "নেপাল", "Bhutan": "ভুটান", "China": "চীন"}
    for f in a1["features"]:
        p = f["properties"]
        if p.get("adm0_a3") != "IND": continue
        s = shape(f["geometry"]).buffer(0)
        if not s.intersects(VIEW): continue
        s = s.buffer(0.04).intersection(VIEW).simplify(0.008)
        if s.is_empty or s.area < 0.01: continue
        out.append({"k": p["name"], "bn": bn.get(p["name"], p["name"]), "c0": "India", "d": path(s, P)})
    for f in a0["features"]:
        p = f["properties"]
        if p.get("ADM0_A3") not in ("MMR", "NPL", "BTN", "CHN"): continue
        s = shape(f["geometry"]).buffer(0).buffer(0.04).intersection(VIEW).simplify(0.008)
        if s.is_empty: continue
        out.append({"k": p["NAME"], "bn": bn.get(p["NAME"], p["NAME"]), "c0": p["NAME"], "d": path(s, P)})
    return out

def rivers():
    r = J("ne_10m_rivers_lake_centerlines.geojson")
    feats = {}
    for f in r["features"]:
        if not f["geometry"]: continue
        g = shape(f["geometry"])
        if g.is_empty or not g.intersects(VIEW): continue
        feats.setdefault((f["properties"].get("name"), f["properties"].get("featurecla")), []).append(g)
    def parts(key):
        out = []
        for g in feats[key]: out += list(g.geoms) if g.geom_type == "MultiLineString" else [g]
        return out
    gan = parts(("Ganges", "River")); bra = parts(("Brahmaputra", "River")); bar = parts(("Balak", "River")) + parts(("Balak", "Lake Centerline"))
    un = parts((None, "River"))
    def clip(lines, tol=0.004):
        m = unary_union(lines).intersection(VIEW)
        m = linemerge(m) if m.geom_type == "MultiLineString" else m
        return m.simplify(tol)
    conf = Point(89.76, 23.85)  # Padma-Jamuna confluence end of the Ganges stem in the data
    # Jamuna/Brahmaputra main line: split where it reaches the Ganges stem
    main = bra[0]; cs = list(main.coords)
    i = min(range(len(cs)), key=lambda j: Point(cs[j][:2]).distance(conf))
    brahmaputra = LineString(cs[:i + 1]); padma_low = LineString(cs[i:])
    out = [
      {"k": "padma", "d": path(clip([gan[0], gan[4], padma_low]), P, close=False)},
      {"k": "jamuna", "d": path(clip([brahmaputra]), P, close=False)},
      {"k": "meghna", "d": path(clip(bar + [u for u in un if u.bounds[0] > 90.3 and u.bounds[2] < 91.0]), P, close=False)},
      {"k": "tista", "d": path(clip(parts(("Tista", "River"))), P, close=False)},
      {"k": "karnaphuli", "d": path(clip([u for u in un if u.bounds[0] > 91.8 and u.bounds[1] > 22.3 and u.bounds[3] < 22.6]), P, close=False)},
      {"k": "dhaleshwari", "d": path(clip([bra[1]]), P, close=False)},
      {"k": "gorai", "d": path(clip([gan[5]]), P, close=False)},
      {"k": "arialkhan", "d": path(clip([gan[6], gan[8]]), P, close=False)},
      {"k": "other", "d": path(clip([gan[1], gan[2], gan[9], gan[10], gan[12], gan[14]] + parts(("Kaladan", "River")) + parts(("Mamas", "River"))), P, close=False)},
    ]
    return out, {"conf": conf, "padma_low": padma_low, "bar": bar}

PLACES = [  # key, district (source key), upazila name in the source, English, Bangla
 ("goalanda", "Rajbari", "Goalandaghat", "Goalanda", "গোয়ালন্দ"), ("chandpur", "Chandpur", "Chandpur Sadar", "Chandpur", "চাঁদপুর"),
 ("bhairab", "Kishoreganj", "Bhairab", "Bhairab Bazar", "ভৈরব বাজার"), ("dimla", "Nilphamari", "Dimla", "Dimla", "ডিমলা"),
 ("thanchi", "Bandarban", "Thanchi", "Thanchi", "থানচি"), ("ruma", "Bandarban", "Ruma", "Ruma", "রুমা"), ("lama", "Bandarban", "Lama", "Lama", "লামা"),
 ("chakaria", "Cox's Bazar", "Chakaria", "Chakaria", "চকরিয়া"), ("teknaf", "Cox's Bazar", "Teknaf", "Teknaf", "টেকনাফ"),
 ("mongla", "Bagerhat", "Mongla", "Mongla", "মোংলা"), ("kaptai", "Rangamati", "Kaptai", "Kaptai", "কাপ্তাই"),
 ("ajmiriganj", "Habiganj", "Ajmiriganj", "Ajmiriganj", "আজমিরীগঞ্জ"), ("sreemangal", "Maulvibazar", "Sreemangal", "Sreemangal", "শ্রীমঙ্গল"),
 ("sandwip", "Chattogram", "Sandwip", "Sandwip", "সন্দ্বীপ"), ("hatiya", "Noakhali", "Hatiya", "Hatiya", "হাতিয়া"),
 ("shibganj", "Nawabganj", "Shibganj", "Shibganj (Chapainawabganj)", "শিবগঞ্জ (চাঁপাইনবাবগঞ্জ)"),
 ("kurigram", "Kurigram", "Kurigram Sadar", "Kurigram", "কুড়িগ্রাম"), ("tongi", "Gazipur", "Gazipur Sadar", "Tongi / Gazipur", "টঙ্গী / গাজীপুর"),
 ("narsingdi", "Narsingdi", "Narsingdi Sadar", "Narsingdi", "নরসিংদী"), ("lalmai", "Cumilla", "Comilla Sadar Dakshin", "Lalmai Hills", "লালমাই পাহাড়"),
 ("madhupur", "Tangail", "Madhupur", "Madhupur", "মধুপুর"), ("zakiganj", "Sylhet", "Zakiganj", "Zakiganj", "জকিগঞ্জ"),
 ("munshiganj", "Munshiganj", "Munshiganj Sadar", "Munshiganj", "মুন্সীগঞ্জ"), ("rangamati", "Rangamati", "Rangamati Sadar", "Rangamati", "রাঙ্গামাটি"),
 ("patuakhali", "Patuakhali", "Patuakhali Sadar", "Patuakhali", "পটুয়াখালী"), ("coxsbazar", "Cox's Bazar", "Cox's Bazar Sadar", "Cox's Bazar", "কক্সবাজার"),
 ("noakhali", "Noakhali", "Noakhali Sadar", "Noakhali", "নোয়াখালী"), ("bogura", "Bogura", "Bogra Sadar", "Bogura", "বগুড়া"),
 ("dinajpur", "Dinajpur", "Dinajpur Sadar", "Dinajpur", "দিনাজপুর"), ("feni", "Feni", "Feni Sadar", "Feni", "ফেনী"),
 ("bandarban", "Bandarban", "Bandarban Sadar", "Bandarban", "বান্দরবান"), ("kushtia", "Kushtia", "Kushtia Sadar", "Kushtia", "কুষ্টিয়া"),
 ("jaintiapur", "Sylhet", "Jaintiapur", "Jaintiapur", "জৈন্তাপুর"), ("khagrachhari", "Khagrachari", "Khagrachhari Sadar", "Khagrachhari", "খাগড়াছড়ি"),
 ("netrokona", "Netrokona", "Netrokona Sadar", "Netrokona", "নেত্রকোনা"), ("habiganj", "Habiganj", "Habiganj Sadar", "Habiganj", "হবিগঞ্জ"),
 ("moulvibazar", "Maulvibazar", "Maulvi Bazar Sadar", "Moulvibazar", "মৌলভীবাজার"), ("naogaon", "Naogaon", "Naogaon Sadar", "Naogaon", "নওগাঁ"),
 ("joypurhat", "Joypurhat", "Joypurhat Sadar", "Joypurhat", "জয়পুরহাট"), ("gazipur", "Gazipur", "Gazipur Sadar", "Gazipur", "গাজীপুর"),
 ("faridpur", "Faridpur", "Faridpur Sadar", "Faridpur", "ফরিদপুর"), ("sunamganj", "Sunamganj", "Sunamganj Sadar", "Sunamganj", "সুনামগঞ্জ"),
 ("satkhira", "Satkhira", "Satkhira Sadar", "Satkhira", "সাতক্ষীরা"), ("bagerhat", "Bagerhat", "Bagerhat Sadar", "Bagerhat", "বাগেরহাট"),
 ("barguna", "Barguna", "Barguna Sadar", "Barguna", "বরগুনা"), ("nilphamari", "Nilphamari", "Nilphamari Sadar", "Nilphamari", "নীলফামারী"),
 ("kishoreganj", "Kishoreganj", "Kishoreganj Sadar", "Kishoreganj", "কিশোরগঞ্জ"), ("brahmanbaria", "Brahmanbaria", "Brahmanbaria Sadar", "Brahmanbaria", "ব্রাহ্মণবাড়িয়া"),
 ("lakshmipur", "Lakshmipur", "Lakshmipur Sadar", "Lakshmipur", "লক্ষ্মীপুর"),
]
NE_CITY = {"Dhaka": ("dhaka", "Dhaka", "ঢাকা"), "Chattogram": ("chattogram", "Chattogram", "চট্টগ্রাম"), "Khulna": ("khulna", "Khulna", "খুলনা"),
           "Rajshahi": ("rajshahi", "Rajshahi", "রাজশাহী"), "Sylhet": ("sylhet", "Sylhet", "সিলেট"), "Barishal": ("barishal", "Barishal", "বরিশাল"),
           "Rangpur": ("rangpur", "Rangpur", "রংপুর"), "Mymensingh": ("mymensingh", "Mymensingh", "ময়মনসিংহ"), "Comilla": ("cumilla", "Cumilla", "কুমিল্লা"),
           "Narayanganj": ("narayanganj", "Narayanganj", "নারায়ণগঞ্জ"), "Tangail": ("tangail", "Tangail", "টাঙ্গাইল"), "Pabna": ("pabna", "Pabna", "পাবনা"),
           "Jashore": ("jashore", "Jashore", "যশোর"), "Jamalpur": ("jamalpur", "Jamalpur", "জামালপুর")}

def main_bd():
    districts, divisions, country, up, simp = build_bd()
    nb = neighbours(); rv, dbg = rivers()
    places = {}
    for key, d, u, en, bn in PLACES:
        if (d, u) not in up: print("MISSING", (d, u), sorted(n for (dd, n) in up if dd == d)); continue
        places[key] = {"en": en, "bn": bn, "p": pt(*up[(d, u)])}
    for f in J("ne_10m_populated_places_simple.geojson")["features"]:
        p = f["properties"]
        if p.get("adm0_a3") == "BGD" and p["name"] in NE_CITY:
            k, en, bn = NE_CITY[p["name"]]; places[k] = {"en": en, "bn": bn, "p": pt(p["longitude"], p["latitude"])}
    data = {"w": W, "h": H, "proj": {"lon0": LON0, "lat1": LAT1, "kx": round(CL * K, 4), "ky": round(K, 4)},
            "districts": districts, "divisions": divisions, "nb": nb, "rivers": rv, "places": places,
            "src": "Boundaries: geoBoundaries gbOpen BGD ADM3 (BBS / OCHA ROAP), CC BY 4.0. Rivers, neighbouring countries and cities: Natural Earth (public domain)."}
    s = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    open(os.path.join(OUT, "geo-bd.json"), "w", encoding="utf-8").write(s)
    print("geo-bd.json", len(s.encode()), "bytes;", len(districts), "districts", len(divisions), "divisions", len(nb), "neighbours", len(places), "places")
    return data, dbg, simp

# ---------------------------------------------------------------- world map (equirectangular, 2 px per degree)
def PW(lon, lat): return ((lon + 180) * 2, (90 - lat) * 2)
WORLD_C = {"BGD": ("Bangladesh", "বাংলাদেশ"), "IND": ("India", "ভারত"), "MMR": ("Myanmar", "মিয়ানমার"), "NPL": ("Nepal", "নেপাল"), "IDN": ("Indonesia", "ইন্দোনেশিয়া"),
           "MYS": ("Malaysia", "মালয়েশিয়া"), "LKA": ("Sri Lanka", "শ্রীলঙ্কা"), "THA": ("Thailand", "থাইল্যান্ড"), "JPN": ("Japan", "জাপান"), "PHL": ("Philippines", "ফিলিপাইন"),
           "CHL": ("Chile", "চিলি"), "IRN": ("Iran", "ইরান"), "NZL": ("New Zealand", "নিউজিল্যান্ড"), "USA": ("USA", "যুক্তরাষ্ট্র"), "CAN": ("Canada", "কানাডা"),
           "GBR": ("United Kingdom", "যুক্তরাজ্য"), "KOR": ("South Korea", "দক্ষিণ কোরিয়া"), "AUS": ("Australia", "অস্ট্রেলিয়া"), "SWE": ("Sweden", "সুইডেন"), "FRA": ("France", "ফ্রান্স"),
           "TWN": ("Taiwan", "তাইওয়ান"), "MEX": ("Mexico", "মেক্সিকো")}
B1 = "NZ\\SA NZ\\AP NZ\\ND ND/NZ CO\\NA CO\\PM CA/CO JF\\NA NA/PA NA-PA PA-NA PA-JF RI-PA NA-RI NA/RI RI-CO PA\\OK OK/PA OK/NA PS/PA PA/WL AM/PS ON/PS ON-PS PS-YA YA-ON PS/SU PS\\SU PS-SU PS-MA MA/PA PS-CL CL-NB BH/PS MS\\SU MS/SU MS-SU MS\\BH MS-BH BH/SU SU-BH PA-CL PA/SS NB/SS SB/SS SS\\WL NB\\WL CL\\WL PA-NB NB-MN MN-SB NB-SB SB-WL WL-SS PA-BR BR-NH NH-PA NH/AU NH-AU CR-NH BR-CR AU-CR BR-AU PA-NI NI-AU NI-FT FT-PA FT-AU TO/PA PA-TO TO-NI TO-AU KE-TO KE/PA KE-AU PA/AU PA-AU AU-PA AU\\PA BH/CL OK-PS AM-ON OK-AM".split()
B2 = "EU-AF EU/AF EU\\AF AS-EU AS-AT AS/AF AT-EU AT/AF AT-AR AR-EU IN-EU EU-IN BU-EU BU/IN IN-BU IN\\BU BU/AU SU-BU SU/AU EU-SU YA-SU BS-SU BS/SU SU-TI TI-AU BS-TI BS-AU BH-BS BH\\BS MS-BS MO-BH WL-MO AU-MO AU-BH WL-BH AU-WL WL-AU".split()
B3 = "NA-EU EU-NA NA-AF AF-SA NA-SA AF-AN AN-AF SO-AN SO-IN IN-SO AU-SO AU-AN AF-AR AR-AF SO-AR AR-IN IN-AR AF-SO SO-AF IN-AU".split()

def main_world():
    land = unary_union([shape(f["geometry"]).buffer(0) for f in J("ne_110m_land.geojson")["features"]]).simplify(0.12)
    cs = {}
    for f in J("ne_110m_admin_0_countries.geojson")["features"]:
        a = f["properties"]["ADM0_A3"]
        if a in WORLD_C:
            s = shape(f["geometry"]).buffer(0).simplify(0.1); c = (max(s.geoms, key=lambda q: q.area) if s.geom_type == "MultiPolygon" else s).representative_point()
            cs[a] = {"en": WORLD_C[a][0], "bn": WORLD_C[a][1], "d": path(s, PW), "c": pt(c.x, c.y, PW)}
    assert len(cs) == len(WORLD_C), set(WORLD_C) - set(cs)
    belts = {"1": [], "2": [], "3": [], "0": []}
    b1, b2, b3 = set(x.replace("\\\\", "\\") for x in B1), set(x.replace("\\\\", "\\") for x in B2), set(B3)
    for f in J("PB2002_boundaries.json")["features"]:
        n = f["properties"]["Name"]; g = shape(f["geometry"])
        if n in ("NA-EU", "EU-NA") and g.centroid.x > 60: k = "0"          # the boundary across Siberia is not the mid-Atlantic ridge
        elif n in ("EU-AF",) and g.centroid.x < -12: k = "3"                 # Azores-Gibraltar part lies in the Atlantic
        else: k = "1" if n in b1 else "2" if n in b2 else "3" if n in b3 else "0"
        belts[k].append(g)
    def lines(gs):
        out = []
        for g in gs:
            for l in (g.geoms if g.geom_type == "MultiLineString" else [g]):
                cs_ = list(l.coords); cur = [cs_[0]]
                for a, b in zip(cs_, cs_[1:]):                              # break lines that wrap round the date line
                    if abs(a[0] - b[0]) > 180: out.append(LineString(cur)) if len(cur) > 1 else None; cur = [b]
                    else: cur.append(b)
                if len(cur) > 1: out.append(LineString(cur))
        return MultiLineString(out).simplify(0.25)
    idl = [f for f in J("ne_10m_geographic_lines.geojson")["features"] if f["properties"]["name"] == "International Date Line"][0]
    il = []
    for l in shape(idl["geometry"]).geoms:                                   # express every vertex as an eastern longitude 100..260
        il.append(LineString([((x if x > 0 else x + 360), y) for x, y in l.coords]))
    idl_m = linemerge(MultiLineString(il)).simplify(0.15)
    cities = {}
    want = {"Dhaka": ("dhaka", "ঢাকা", "Bangladesh"), "Seoul": ("seoul", "সিউল", "South Korea"), "Chennai": ("chennai", "চেন্নাই", "India"), "Tokyo": ("tokyo", "টোকিও", "Japan"),
            "Canberra": ("canberra", "ক্যানবেরা", "Australia"), "New York": ("newyork", "নিউইয়র্ক", "United States of America"), "London": ("london", "লন্ডন", "United Kingdom"),
            "Stockholm": ("stockholm", "স্টকহোম", "Sweden"), "Santiago": ("santiago", "সান্তিয়াগো", "Chile"), "Mexico City": ("mexico", "মেক্সিকো সিটি", "Mexico"),
            "Kolkata": ("kolkata", "কলকাতা", "India"), "Honolulu": ("honolulu", "হনলুলু", "United States of America"), "Suva": ("suva", "সুভা (ফিজি)", "Fiji"),
            "Apia": ("apia", "আপিয়া (সামোয়া)", "Samoa"), "Wellington": ("wellington", "ওয়েলিংটন", "New Zealand"), "Anchorage": ("anchorage", "অ্যাঙ্কোরেজ", "United States of America"),
            "Jakarta": ("jakarta", "জাকার্তা", "Indonesia"), "Cairo": ("cairo", "কায়রো", "Egypt"), "Sydney": ("sydney", "সিডনি", "Australia")}
    for f in J("ne_10m_populated_places_simple.geojson")["features"]:
        p = f["properties"]
        if p["name"] in want and p["adm0name"] == want[p["name"]][2]:
            k, bn, _ = want[p["name"]]; cities[k] = {"en": p["name"], "bn": bn, "ll": [round(p["longitude"], 2), round(p["latitude"], 2)]}
    assert len(cities) == len(want), set(v[0] for v in want.values()) - set(cities)
    data = {"w": 720, "h": 360, "land": path(land, PW), "countries": cs, "belts": {k: path(lines(v), PW, close=False) for k, v in belts.items()},
            "idl": path(idl_m, lambda x, y: (x * 2 + 360, (90 - y) * 2), close=False), "cities": cities,
            "src": "Land, countries, cities and the International Date Line: Natural Earth (public domain). Plate boundaries: Bird (2003) PB2002."}
    s = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    open(os.path.join(OUT, "geo-world.json"), "w", encoding="utf-8").write(s)
    print("geo-world.json", len(s.encode()), "bytes", {k: len(v) for k, v in data["belts"].items()}, len(data["land"]))

# ---------------------------------------------------------------- South Asia map
SA = (60.0, 103.0, 3.0, 39.5); SAC = math.cos(math.radians(22)); SAK = 360.0 / ((SA[1] - SA[0]) * SAC); SAH = round((SA[3] - SA[2]) * SAK, 1)
def PS(lon, lat): return ((lon - SA[0]) * SAC * SAK, (SA[3] - lat) * SAK)
SAS_C = {"BGD": ("Bangladesh", "বাংলাদেশ"), "IND": ("India", "ভারত"), "MMR": ("Myanmar", "মিয়ানমার"), "NPL": ("Nepal", "নেপাল"), "BTN": ("Bhutan", "ভুটান"),
         "PAK": ("Pakistan", "পাকিস্তান"), "LKA": ("Sri Lanka", "শ্রীলঙ্কা"), "CHN": ("China", "চীন"), "AFG": ("Afghanistan", "আফগানিস্তান"), "THA": ("Thailand", "থাইল্যান্ড")}
def main_sasia():
    view = box(SA[0] - 1, SA[2] - 1, SA[1] + 1, SA[3] + 1)
    land = unary_union([shape(f["geometry"]).buffer(0) for f in J("ne_50m_land.geojson")["features"] if shape(f["geometry"]).intersects(view)]).intersection(view).simplify(0.06)
    cs = {}
    for f in J("ne_50m_admin_0_countries.geojson")["features"]:
        a = f["properties"]["ADM0_A3"]
        if a in SAS_C:
            s = shape(f["geometry"]).buffer(0).intersection(view).simplify(0.05)
            m = max(s.geoms, key=lambda q: q.area) if s.geom_type == "MultiPolygon" else s
            e = m.buffer(-0.8); c = ((max(e.geoms, key=lambda q: q.area) if e.geom_type == "MultiPolygon" else e) if not e.is_empty else m).representative_point()
            cs[a] = {"en": SAS_C[a][0], "bn": SAS_C[a][1], "d": path(s, PS), "c": pt(c.x, c.y, PS)}
    cities = {}
    want = {"Dhaka": ("dhaka", "ঢাকা"), "Kolkata": ("kolkata", "কলকাতা"), "Delhi": ("delhi", "দিল্লি"), "Kathmandu": ("kathmandu", "কাঠমান্ডু"), "Yangon": ("yangon", "ইয়াঙ্গুন"),
            "Mandalay": ("mandalay", "মান্দালয়"), "Chennai": ("chennai", "চেন্নাই"), "Mumbai": ("mumbai", "মুম্বাই"), "Sittwe": ("sittwe", "সিত্তে (আরাকান উপকূল)"),
            "Amritsar": ("amritsar", "অমৃতসর (পাঞ্জাব)")}
    for f in J("ne_10m_populated_places_simple.geojson")["features"]:
        p = f["properties"]
        if p["name"] in want and p["adm0name"] in ("India", "Bangladesh", "Nepal", "Myanmar"):
            k, bn = want[p["name"]]; cities[k] = {"en": p["name"], "bn": bn, "p": pt(p["longitude"], p["latitude"], PS)}
    assert len(cities) == len(want), set(v[0] for v in want.values()) - set(cities)
    data = {"w": 360, "h": SAH, "proj": {"lon0": SA[0], "lat1": SA[3], "kx": round(SAC * SAK, 4), "ky": round(SAK, 4)}, "land": path(land, PS), "countries": cs, "cities": cities,
            "src": "Natural Earth (public domain). Boundaries are the de facto lines in that dataset; some of them are disputed."}
    s = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    open(os.path.join(OUT, "geo-sasia.json"), "w", encoding="utf-8").write(s)
    print("geo-sasia.json", len(s.encode()), "bytes")

if __name__ == "__main__":
    main_bd(); main_world(); main_sasia()
