"""Build lesson JSON from the authoring text files.

Authoring format (content/<subject>/chNN.txt):
  @@chapter            chapter intro block
  @@ <lesson id>       start a lesson
  @visual <widget>     interactive/visual widget name (optional)
  @related <ids...>
  @media <url> | <en title> | <bn title> | <source>
  == en / == bn        language block
  ## <section>         what simple definition why terms formula visual real example mistakes remember think quiz timeline intro objectives
"""
import json, re, os, glob, html

SECTIONS = {"what","simple","definition","why","terms","formula","visual","real","example","mistakes","remember","think","quiz","timeline","intro","objectives","analogy"}

def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", s)
    s = re.sub(r"\^\{(.+?)\}", r"<sup>\1</sup>", s)
    s = re.sub(r"_\{(.+?)\}", r"<sub>\1</sub>", s)
    s = re.sub(r"`(.+?)`", r'<span class="m">\1</span>', s)
    s = re.sub(r"\[\[([\w.]+)\|(.+?)\]\]", r'<a class="xref" data-id="\1">\2</a>', s)
    return s

def md(text):
    out, para, lst, ltype = [], [], [], None
    def flush():
        nonlocal para, lst, ltype
        if para: out.append("<p>" + " ".join(inline(x) for x in para) + "</p>"); para = []
        if lst: out.append(f"<{ltype}>" + "".join(f"<li>{inline(x)}</li>" for x in lst) + f"</{ltype}>"); lst = []; ltype = None
    for line in text.strip().split("\n"):
        l = line.rstrip()
        if not l.strip(): flush(); continue
        m = re.match(r"^\s*-\s+(.*)", l); n = re.match(r"^\s*[0-9০-৯]+[.)]\s+(.*)", l)
        if m or n:
            t = "ul" if m else "ol"
            if para: flush()
            if ltype and ltype != t: flush()
            ltype = t; lst.append((m or n).group(1)); continue
        if l.startswith("> "):
            flush(); out.append('<p class="aside">' + inline(l[2:]) + "</p>"); continue
        if lst: flush()
        para.append(l.strip())
    flush()
    return "".join(out)

def parse_section(name, body):
    lines = [l for l in body.strip().split("\n")]
    if name in ("what","simple","definition","why","visual","real","think","intro","analogy"):
        return md(body)
    if name == "terms":
        return [[inline(c.strip()) for c in l.split("|", 1)] for l in lines if "|" in l]
    if name in ("remember","objectives"):
        return [inline(re.sub(r"^\s*-\s*", "", l)) for l in lines if l.strip()]
    if name == "timeline":
        return [[inline(c.strip()) for c in l.split("|", 2)] for l in lines if "|" in l]
    if name == "formula":
        f = {"lines": [], "symbols": [], "notes": []}
        for l in lines:
            if l.startswith("$$"): f["lines"].append(inline(l[2:].strip()))
            elif l.startswith("tri "): f.setdefault("tri", []).append([inline(c.strip()) for c in l[4:].split("|")])
            elif l.startswith("!"): f["notes"].append(inline(l[1:].strip()))
            elif "|" in l: f["symbols"].append([inline(c.strip()) for c in l.split("|")])
            elif l.strip(): f["notes"].append(inline(l.strip()))
        return f
    if name == "mistakes":
        out, cur = [], None
        for l in lines:
            if l.startswith("x "): cur = [inline(l[2:]), ""]; out.append(cur)
            elif l.startswith("v ") and cur is not None: cur[1] = inline(l[2:])
        return out
    if name == "quiz":
        qs, cur = [], None
        for l in lines:
            if l.startswith("? "): cur = {"q": inline(l[2:]), "options": [], "answer": -1, "explain": ""}; qs.append(cur)
            elif l.startswith("- "): cur["options"].append(inline(l[2:]))
            elif l.startswith("* "): cur["answer"] = len(cur["options"]); cur["options"].append(inline(l[2:]))
            elif l.startswith("= "): cur["explain"] = inline(l[2:])
        for q in qs: assert q["answer"] >= 0, q
        return qs
    if name == "example":
        ex = {"q": "", "steps": []}
        labels = ("Given", "Formula", "Substitution", "Calculation", "Answer", "Unit",
                  "দেওয়া আছে", "সূত্র", "মান বসাই", "হিসাব", "উত্তর", "একক", "Solution", "সমাধান", "Step", "ধাপ")
        for l in lines:
            if not l.strip(): continue
            if l.startswith("Q:") or l.startswith("প্রশ্ন:"):
                ex["q"] = inline(l.split(":", 1)[1].strip()); continue
            m = re.match(r"^([^:>]{1,20}):\s*(.*)$", l)
            if m and m.group(1).strip() in labels:
                ex["steps"].append({"label": m.group(1).strip(), "html": inline(m.group(2)), "why": ""}); continue
            if l.startswith("> ") and ex["steps"]:
                ex["steps"][-1]["why"] += (" " if ex["steps"][-1]["why"] else "") + inline(l[2:]); continue
            if ex["steps"]:
                ex["steps"][-1]["html"] += "<br>" + inline(l.strip())
            else:
                ex["q"] += (" " if ex["q"] else "") + inline(l.strip())
        return ex
    raise ValueError(name)

def parse_file(path):
    txt = open(path, encoding="utf-8").read()
    blocks = re.split(r"^@@\s*", txt, flags=re.M)[1:]
    chapter, lessons = None, {}
    for b in blocks:
        head, _, rest = b.partition("\n")
        key = head.strip()
        obj = {"visual": None, "related": [], "media": [], "en": {}, "bn": {}}
        lang = None; sec = None; buf = []
        def close():
            if lang and sec:
                val = parse_section(sec, "\n".join(buf))
                if sec == "example": obj[lang].setdefault("examples", []).append(val)
                else: obj[lang][sec] = val
        for line in rest.split("\n"):
            if line.startswith("@visual"): obj["visual"] = line.split(None, 1)[1].strip(); continue
            if line.startswith("@related"): obj["related"] = line.split()[1:]; continue
            if line.startswith("@media"):
                p = [x.strip() for x in line[6:].split("|")]
                obj["media"].append({"url": p[0], "title": {"en": p[1], "bn": p[2]}, "source": p[3] if len(p) > 3 else ""}); continue
            m = re.match(r"^==\s*(en|bn)\s*$", line)
            if m: close(); lang = m.group(1); sec = None; buf = []; continue
            m = re.match(r"^##\s*(\w+)\s*$", line)
            if m:
                close(); sec = m.group(1); buf = []
                assert sec in SECTIONS, (path, key, sec); continue
            buf.append(line)
        close()
        if key == "chapter":
            chapter = {"en": obj["en"], "bn": obj["bn"]}
        else:
            obj["id"] = key
            lessons[key] = obj
    return chapter, lessons

REQUIRED = ["what", "simple", "definition", "remember", "quiz"]

def validate(cmap, subj, n, lessons):
    ch = next(c for s in cmap if s["key"] == subj for c in s["chapters"] if c["n"] == n)
    ids = [t["id"] for t in ch["topics"]]
    for lid, L in lessons.items():
        assert lid in ids, (subj, n, lid, "not in map")
        for lang in ("en", "bn"):
            for r in REQUIRED: assert r in L[lang], (subj, lid, lang, r)
        assert len(L["en"]["quiz"]) == len(L["bn"]["quiz"]), (lid, "quiz count differs")
        assert [q["answer"] for q in L["en"]["quiz"]] == [q["answer"] for q in L["bn"]["quiz"]], (lid, "quiz answers differ")
        assert len(L["en"].get("examples", [])) == len(L["bn"].get("examples", [])), (lid, "example count differs")
        for lang in ("en", "bn"):
            for q in L[lang]["quiz"]: assert q.get("answer") is not None, (lid, lang, "quiz without * answer")

def build():
    root = os.path.dirname(os.path.abspath(__file__))
    cmap = json.load(open(os.path.join(root, "..", "map", "content-map.json"), encoding="utf-8"))
    os.makedirs(os.path.join(root, "out", "data"), exist_ok=True)
    written = {}
    for path in sorted(glob.glob(os.path.join(root, "content", "*", "ch*.txt"))):
        subj = os.path.basename(os.path.dirname(path)); n = int(re.findall(r"\d+", os.path.basename(path))[0])
        try:
            chapter, lessons = parse_file(path)
            validate(cmap, subj, n, lessons)
        except Exception as e:
            print(f"ERROR in {subj} ch{n} (skipped):", repr(e)); continue
        ch = next(c for s in cmap if s["key"] == subj for c in s["chapters"] if c["n"] == n)
        ids = [t["id"] for t in ch["topics"]]
        if False:
            assert lid in ids, (subj, n, lid, "not in map")
            for lang in ("en", "bn"):
                for r in REQUIRED: assert r in L[lang], (subj, lid, lang, r)
            assert len(L["en"]["quiz"]) == len(L["bn"]["quiz"]), (lid, "quiz count differs")
            assert [q["answer"] for q in L["en"]["quiz"]] == [q["answer"] for q in L["bn"]["quiz"]], (lid, "quiz answers differ")
            assert len(L["en"].get("examples", [])) == len(L["bn"].get("examples", [])), (lid, "example count differs")
        json.dump({"chapter": chapter, "lessons": lessons}, open(os.path.join(root, "out", "data", f"{subj}-{n}.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        written[(subj, n)] = lessons
        missing = [i for i in ids if i not in lessons]
        print(f"{subj} ch{n}: {len(lessons)}/{len(ids)} lessons", ("missing " + " ".join(missing)) if missing else "")
    # site map: add availability + search terms
    for s in cmap:
        for c in s["chapters"]:
            c["ready"] = (s["key"], c["n"]) in written
            L = written.get((s["key"], c["n"]), {})
            for t in c["topics"]:
                t["ready"] = t["id"] in L
                if t["ready"]:
                    terms = []
                    for lang in ("en", "bn"):
                        for pair in L[t["id"]][lang].get("terms", []):
                            terms.append(re.sub("<[^>]+>", "", pair[0]))
                    t["terms"] = terms
    json.dump(cmap, open(os.path.join(root, "out", "data", "map.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

def assemble():
    root = os.path.dirname(os.path.abspath(__file__))
    app = open(os.path.join(root, "app.html"), encoding="utf-8").read()
    import subprocess, tempfile
    parts = []
    for f in sorted(glob.glob(os.path.join(root, "widgets_*.js"))):
        src = open(f, encoding="utf-8").read()
        if not re.search(r"widgets_ch0[1-4]\.js$", f):
            src = "(()=>{\n" + src + "\n})();"   # later chapters: private scope
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as t: t.write(src)
        r = subprocess.run(["node", "--check", t.name], capture_output=True, text=True); os.unlink(t.name)
        if r.returncode != 0:
            print("SKIPPED (syntax error):", os.path.basename(f), r.stderr.strip().splitlines()[-1] if r.stderr.strip() else ""); continue
        parts.append(src)
    js = "\n".join(parts)
    app = app.replace("/*__LANDINGCSS__*/", open(os.path.join(root, "landing.css"), encoding="utf-8").read())
    app = app.replace("/*__LANDINGJS__*/", open(os.path.join(root, "landing.js"), encoding="utf-8").read())
    open(os.path.join(root, "index.html"), "w", encoding="utf-8").write(app.replace("/*__WIDGETS__*/", js))
    open(os.path.join(root, "out", "index.html"), "w", encoding="utf-8").write('<meta charset="utf-8">\n' + app.replace("/*__WIDGETS__*/", js))

def deploy():
    import shutil
    root = os.path.dirname(os.path.abspath(__file__))
    d = os.path.join(root, "..", "..", "public")  # repo: site is served by Vercel from /public
    if os.path.isdir(d): shutil.rmtree(d)
    os.makedirs(os.path.join(d, "data"))
    page = open(os.path.join(root, "index.html"), encoding="utf-8").read()
    head = '<!doctype html>\n<html lang="bn">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="description" content="Class 9-10 Physics, Chemistry and Biology explained simply in Bangla and English, with interactive visuals. Based on the NCTB textbooks.">\n<meta property="og:title" content="Let\'s Learn — Learn. Understand. Explore.">\n<meta property="og:description" content="Every chapter of Class 9-10 Physics, Chemistry and Biology, explained simply in Bangla and English, with interactive visuals.">\n<meta property="og:type" content="website">\n<meta property="og:image" content="/og.png">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="theme-color" content="#0f1d2e">\n<link rel="apple-touch-icon" href="/logo-512.png">\n'
    open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(head + page)
    for f in glob.glob(os.path.join(root, "out", "data", "*.json")): shutil.copy(f, os.path.join(d, "data"))
    for f in ("og.png", "logo-512.png", "logo.svg"):
        if os.path.exists(os.path.join(root, "brand", f)): shutil.copy(os.path.join(root, "brand", f), d)
    if False: open(os.path.join(d, "vercel.json"), "w").write('{\n  "cleanUrls": true,\n  "headers": [{"source": "/data/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=300"}]}]\n}\n')

if __name__ == "__main__":
    build(); assemble(); deploy()
