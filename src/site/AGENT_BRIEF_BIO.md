# Brief: write one Biology chapter for the Class 10 bilingual science site

You are writing ONE chapter of a bilingual (English + Bangla, equal quality) learning site for Bangladesh
Class 9–10 students (NCTB Biology book, 2026 edition). All Physics and Chemistry chapters are done and are your quality/format model.
Other agents are writing other chapters at the same time — touch ONLY your own two files.

## Your deliverables
1. `/home/claude/site10/content/biology/chNN.txt` (NN = two-digit chapter, e.g. ch07.txt) — chapter intro,
   objectives and EVERY lesson id listed for your chapter in `/home/claude/map/biology.txt`
   (lines `T <id>|<English title>|<Bangla title>|<flags>` under `C <n>|...`; the `-` bullets under each T
   say what the lesson must cover, `K` lines are key formulas). Lesson ids must match exactly.
2. `/home/claude/site10/widgets_bioNN.js` (e.g. widgets_bio07.js) — interactive/visual widgets for the lessons where a visual
   genuinely helps understanding (most lessons with a V flag, formula lessons where a slider shows the
   relationship, ray diagrams, circuits, graphs…). Aim for roughly 4–8 widgets per chapter. Quality > count.

## Read these first (mandatory)
- `/home/claude/site10/content/physics/ch05.txt` — read ALL of it. It is the exact format and the tone/depth to match (note the `## analogy` sections and the `tri` lines in formula blocks, explained below).
- `/home/claude/site10/widgets_ch05.js` and skim `widgets_ch06.js` — widget style.
- Your chapter section of `/home/claude/map/biology.txt`.
- The book OCR (English): `/home/claude/ocr/bi/NNNN.txt` (4-digit PDF page index). The `C` line in the map gives
  printed pages; the PDF offset is a few pages — find the exact start by grepping for the chapter title or first
  section heading in /home/claude/ocr/bi/*.txt. Read the whole chapter's OCR: use the book's
  worked examples (numbers) as the lesson examples where they fit, and follow the book's definitions,
  laws, sign conventions and notation — but NEVER copy sentences verbatim; explain in your own words.
- Bangla OCR: `/home/claude/ocr/bibn/NNNN.txt` — use it to get the book's Bangla technical terms
  (grep for terms). Use the book's Bangla biology terms (কোষ, টিস্যু, শ্বসন, সালোকসংশ্লেষণ, প্রজাতি, গণ, রাজ্য …, whatever the book actually uses), and give the English term in
  brackets the first time where helpful.

## Lesson structure (per lesson, both `== en` and `== bn`)
`## what` (1–2 sentences) · `## simple` · `## analogy` (optional but encouraged for tricky ideas: ONE short everyday picture, 2–4 sentences, Bangladeshi context — rendered as a "Picture it like this" card) (the heart: explain like a good teacher sitting beside the student,
everyday Bangladeshi examples, build intuition step by step, several short paragraphs) · `## definition`
(precise, textbook-accurate) · `## why` (the reason/mechanism) · `## terms` (Term | Meaning lines) ·
`## formula` (`$$` equation lines; optional `tri A | B | C` line meaning A = B × C, which renders an interactive formula triangle — use it for simple 3-quantity formulas such as `tri m | n | M` for mass = moles × molar mass; `sym | meaning | unit` lines; `!` note lines) — only if the lesson has
formulas · `## visual` (one caption line telling the student what to do with the widget) — only if the
lesson has `@visual` · `## real` (real-life example, Bangladesh context welcome) · `## example` (repeatable;
worked examples with Q:/Given:/Formula:/Substitution:/Calculation:/Answer:/Unit: lines and `> why` lines
explaining a step; Bangla labels প্রশ্ন:, দেওয়া আছে:, সূত্র:, মান বসাই:, হিসাব:, উত্তর:, একক:, সমাধান:, ধাপ:)
· `## mistakes` (`x wrong` / `v right` pairs) · `## remember` (`-` bullets) · `## think` (one thought
question) · `## quiz` (2–5 MCQs: `? question`, `- option`, `* correct option`, `= explanation`).
Required in both languages: what, simple, definition, remember, quiz. EN and BN must have the same number
of examples and quiz questions with the correct answer in the same position.
Lesson header lines: `@@ 7.2`, then `@visual <widgetName>` (optional), `@related <ids>` (2–4 related
lesson ids, may point to other chapters), optional `@media <url> | <en title> | <bn title> | <source>`
ONLY for a genuinely useful, real, stable URL you are sure exists (e.g. a PhET simulation page
https://phet.colorado.edu/en/simulations/<name>); otherwise omit.
Inline markup: `**bold**`, `*italic*`, `^{sup}`, `_{sub}`, `` `mono` ``, `[[4.3.1|text]]` cross-link.
Chapter block first: `@@chapter`, `== en`, `## intro` (2 short paragraphs), `## objectives` (- bullets), `== bn` same.

## Language
- Bangla must be natural, warm, student-friendly (তুমি), not a stiff translation. Bangla digits in Bangla
  prose, numbers and quiz text (৯.৮, ১৪ ৭০০); units and symbols stay Latin (N, m/s², J, Ω, V, A).
- English: clear, simple, Class 10 level.

## Accuracy (top priority)
- Biology specifics: use correct scientific names (italic genus + species, genus capitalised), correct structure/function, and current classification as the book presents it (note gently where modern biology differs). Health content must be accurate and age-appropriate; no medical advice beyond what a textbook gives.
- Lab work: school-level practicals with safety notes (microscope, stains, dissection only where the book has it).
- Check every number you compute (run python if needed). Use g = 9.8 m/s² unless the book says otherwise.
- If the book has an error or ambiguity (OCR garble aside), do NOT repeat the error: use the correct
  science, and if it matters mention gently in the lesson that textbooks sometimes state it differently.
  Record each such case in your final report.
- Don't invent history dates/names you aren't sure of.

## Widgets (widgets_chNN.js)
- The build wraps your file in `(()=>{ ... })();` automatically, so top-level const/let are private.
- Register widgets as `W.<name> = (el) => { ... }` with names prefixed `b` + your chapter number, e.g.
  `W.b7lungs`, `W.b7gas` (must not clash with other chapters). Reference them with `@visual b7lungs`.
- Available globals: `W`, `LANG` ("en"|"bn"), `L2(en,bn)` returns the string for the current language,
  `$(sel, el)` querySelector, `bnNum(x, LANG)` converts digits to Bangla when LANG is bn (use for every
  number shown), `nf(x,d)`, `animate(el, stepFn)` (throttled loop, stops when el leaves DOM, returns
  nothing; stepFn(t) gets time in seconds), `REDUCED` (prefers-reduced-motion: don't auto-animate if true;
  show a static frame / step button), `arrowDefs(id,colour)` returns SVG <defs> with an arrow marker
  `url(#id)`, `slider(id,label,min,max,step,val,unit)` returns HTML for a labelled range input with a value
  display, `sv(el,id,unit,decimals)` reads that slider, updates its display and returns the number.
- Biology ideas that visualise well: labelled diagrams you draw yourself in SVG (cells, organs, systems) with tap-to-highlight parts and short explanations, process step-throughs (mitosis stages, digestion path, blood circulation route, reflex arc), classification trees and sorting games, food chains/webs, Punnett squares, graphs (enzyme activity vs temperature, rate of photosynthesis vs light). Draw your own simple, clear SVG; never copy book figures.
- CSS classes: `.svgwrap.fit` (wrap an <svg viewBox=...> so it scales to width), `.w-out` (result box),
  `.w-row` (flex row), `.chipset` with `<button aria-pressed>` (toggle chips), `.btn` / `.btn.solid`,
  `.w-in` (inputs), `.hint`, `.muted`. Colours via CSS vars: `var(--c)` (subject colour — green on biology pages), `var(--c-soft)`,
  `var(--ink)`, `var(--muted)`, `var(--rule)`, `var(--paper)`, `var(--sheet)`, `var(--bad)`, `var(--good)`,
  `var(--note)`. Never hard-code white/black (dark mode exists).
- Mobile-first: must work at 360–400 px width with no horizontal page overflow; SVG text ≥ 12px after
  scaling (so use viewBox widths around 360–600 and font-size 13–16). Touch-friendly controls.
- All labels bilingual via L2. No external libraries, no network, no localStorage.

## Build & test (you must do this before finishing)
```
cd /home/claude/site10 && python3 build_site.py      # prints "biology chN: x/y lessons" or ERROR / SKIPPED lines for your files
# local server is at http://localhost:8765/index.html (serves /home/claude/site10/out). If not up:
#   cd /home/claude/site10/out && setsid python3 -m http.server 8765 >/dev/null 2>&1 &
NODE_PATH=$(npm root -g) node check.js bn.biology.7.1 en.biology.7.1 ...   # every lesson id, both langs
#   output per page: {"w":400 means no overflow (must be 400), "widgets":[innerHTML lengths], ...} then page errors
NODE_PATH=$(npm root -g) node shot2.js "http://localhost:8765/index.html#bn.biology.7.1" /tmp/claude-0/bNN/b7-71.png 420 "#s-visual"
#   then Read the PNG to look at each widget (both languages at least once) and fix what looks wrong.
```
Fix all errors, overflow and visual problems. Your chapter must end with "biology chN: N/N lessons" and no ERROR/SKIPPED.
Do NOT publish anything and do NOT edit app.html, build_site.py, other chapters' files or the map.

## Final report (your last message, short)
Lessons written (count), widgets (names → lesson), any book errors/ambiguities and how you handled them,
anything left unresolved.

## Working files
Keep any temporary files ONLY in /tmp/claude-0/bNN/ (NN = your chapter; create it). Other agents run in parallel.
Work efficiently: write the content file in a few large writes (e.g. chapter block + 2–3 lessons per write, appending).
