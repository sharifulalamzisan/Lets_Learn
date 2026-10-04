import json, re
subjects = []
for key in ["physics", "chemistry", "biology", "bgs"]:
    subj = None; ch = None; tp = None
    for raw in open(f"map/{key}.txt", encoding="utf-8"):
        line = raw.rstrip("\n")
        if not line.strip():
            continue
        tag, rest = line[:1], line[2:]
        if tag == "S":
            k, en, bn = rest.split("|")
            subj = {"key": k, "en": en, "bn": bn, "chapters": []}
            subjects.append(subj)
        elif tag == "C":
            parts = rest.split("|")   # n|English|Bangla|pages[|pages in the Bangla edition]
            n, en, bn, pages = parts[:4]
            ch = {"n": int(n), "en": en, "bn": bn, "pages": pages, "topics": [], "notes": []}
            if len(parts) > 4: ch["pagesBn"] = parts[4]
            subj["chapters"].append(ch); tp = None
        elif tag == "T":
            parts = rest.split("|")
            id_, en, bn = parts[0], parts[1], parts[2]
            tags = [t for t in (parts[3] if len(parts) > 3 else "").split(",") if t]
            tp = {"id": id_, "en": en, "bn": bn, "tags": tags, "subs": [], "key": [], "notes": []}
            ch["topics"].append(tp)
        elif tag == "-":
            # split "- a  - b" into separate subs
            for piece in re.split(r"\s{2,}-\s", rest):
                tp["subs"].append(piece.strip())
        elif tag == "K":
            tp["key"].append(rest.strip())
        elif tag == "N":
            (tp or ch)["notes"].append(rest.strip())
json.dump(subjects, open("map/content-map.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
tot = 0
for s in subjects:
    nt = sum(len(c["topics"]) for c in s["chapters"])
    ns = sum(len(t["subs"]) for c in s["chapters"] for t in c["topics"])
    tot += nt
    print(s["key"], len(s["chapters"]), "chapters", nt, "lessons", ns, "subtopics")
print("total lessons", tot)

# apply student-friendly Bangla titles; keep the textbook wording as bnBook
exec(open("map/friendly_bn.py", encoding="utf-8").read())
missing = []
for s in subjects:
    fm = F[s["key"]]
    for c in s["chapters"]:
        c["bnBook"] = c["bn"]; c["bn"] = fm.get(f"C{c['n']}", c["bn"])
        if f"C{c['n']}" not in fm: missing.append((s["key"], "C%d" % c["n"]))
        for t in s and c["topics"]:
            t["bnBook"] = t["bn"]
            if t["id"] in fm: t["bn"] = fm[t["id"]]
            else: missing.append((s["key"], t["id"]))
print("missing friendly titles:", missing)
json.dump(subjects, open("map/content-map.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
