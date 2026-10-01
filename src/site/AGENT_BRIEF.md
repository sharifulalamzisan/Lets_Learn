# Brief: write one Physics chapter for the Class 10 bilingual science site

You are writing ONE chapter of a bilingual (English + Bangla, equal quality) learning site for Bangladesh
Class 9–10 students (NCTB Physics book, 2026 edition). Chapters 1–4 are done and are your quality model.
Other agents are writing other chapters at the same time — touch ONLY your own two files.

## Your deliverables
1. `/home/claude/site10/content/physics/chNN.txt` (NN = two-digit chapter, e.g. ch07.txt) — chapter intro,
   objectives and EVERY lesson id listed for your chapter in `/home/claude/map/physics.txt`
   (lines `T <id>|<English title>|<Bangla title>|<flags>` under `C <n>|...`; the `-` bullets under each T
   say what the lesson must cover, `K` lines are key formulas). Lesson ids must match exactly.
2. `/home/claude/site10/widgets_chNN.js` — interactive/visual widgets for the lessons where a visual
   genuinely helps understanding (most lessons with a V flag, formula lessons where a slider shows the
   relationship, ray diagrams, circuits, graphs…). Aim for roughly 4–8 widgets per chapter. Quality > count.

## Read these first (mandatory)
- `/home/claude/site10/content/physics/ch04.txt` — read ALL of it. It is the exact format and the tone/depth to match.
- `/home/claude/site10/widgets_ch04.js` and skim `widgets_ch02.js`, `widgets_ch03.js` — widget style.
- Your chapter section of `/home/claude/map/physics.txt`.
- The book OCR (English): `/home/claude/ocr/ph/NNNN.txt` (4-digit PDF page index). PDF page ≈ printed
  page + 5; the `C` line in the map gives printed pages. Find the exact start with
  `grep -l "Chapter Seven" /home/claude/ocr/ph/*.txt` etc. Read the whole chapter's OCR: use the book's
  worked examples (numbers) as the lesson examples where they fit, and follow the book's definitions,
  laws, sign conventions and notation — but NEVER copy sentences verbatim; explain in your own words.
- Bangla OCR: `/home/claude/ocr/phbn/NNNN.txt` — use it to get the book's Bangla technical terms
  (grep for terms). Use the book's terms (e.g. আয়না, অনুপ্রস্থ/অনুদৈর্ঘ্য তরঙ্গ, ক্রান্তি কোণ, অপরিবাহী,
  তাড়িতচুম্বক, ওহমের সূত্র, সলিনয়েড, ট্রান্সফরমার, অর্ধায়ু …), and give the English term in
  brackets the first time where helpful.

## Lesson structure (per lesson, both `== en` and `== bn`)
`## what` (1–2 sentences) · `## simple` (the heart: explain like a good teacher sitting beside the student,
everyday Bangladeshi examples, build intuition step by step, several short paragraphs) · `## definition`
(precise, textbook-accurate) · `## why` (the reason/mechanism) · `## terms` (Term | Meaning lines) ·
`## formula` (`$$` equation lines; `sym | meaning | unit` lines; `!` note lines) — only if the lesson has
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
- Check every number you compute (run python if needed). Use g = 9.8 m/s² unless the book says otherwise.
- If the book has an error or ambiguity (OCR garble aside), do NOT repeat the error: use the correct
  physics, and if it matters mention gently in the lesson that textbooks sometimes state it differently.
  Record each such case in your final report.
- Don't invent history dates/names you aren't sure of.

## Widgets (widgets_chNN.js)
- The build wraps your file in `(()=>{ ... })();` automatically, so top-level const/let are private.
- Register widgets as `W.<name> = (el) => { ... }` with names prefixed by your chapter, e.g.
  `W.c7wave`, `W.c7echo` (must not clash with other chapters). Reference them with `@visual c7wave`.
- Available globals: `W`, `LANG` ("en"|"bn"), `L2(en,bn)` returns the string for the current language,
  `$(sel, el)` querySelector, `bnNum(x, LANG)` converts digits to Bangla when LANG is bn (use for every
  number shown), `nf(x,d)`, `animate(el, stepFn)` (throttled loop, stops when el leaves DOM, returns
  nothing; stepFn(t) gets time in seconds), `REDUCED` (prefers-reduced-motion: don't auto-animate if true;
  show a static frame / step button), `arrowDefs(id,colour)` returns SVG <defs> with an arrow marker
  `url(#id)`, `slider(id,label,min,max,step,val,unit)` returns HTML for a labelled range input with a value
  display, `sv(el,id,unit,decimals)` reads that slider, updates its display and returns the number.
- CSS classes: `.svgwrap.fit` (wrap an <svg viewBox=...> so it scales to width), `.w-out` (result box),
  `.w-row` (flex row), `.chipset` with `<button aria-pressed>` (toggle chips), `.btn` / `.btn.solid`,
  `.w-in` (inputs), `.hint`, `.muted`. Colours via CSS vars: `var(--c)` (subject colour), `var(--c-soft)`,
  `var(--ink)`, `var(--muted)`, `var(--rule)`, `var(--paper)`, `var(--sheet)`, `var(--bad)`, `var(--good)`,
  `var(--note)`. Never hard-code white/black (dark mode exists).
- Mobile-first: must work at 360–400 px width with no horizontal page overflow; SVG text ≥ 12px after
  scaling (so use viewBox widths around 360–600 and font-size 13–16). Touch-friendly controls.
- All labels bilingual via L2. No external libraries, no network, no localStorage.

## Build & test (you must do this before finishing)
```
cd /home/claude/site10 && python3 build_site.py      # prints "physics chN: x/y lessons" or ERROR / SKIPPED lines for your files
# local server is at http://localhost:8765/index.html (serves /home/claude/site10/out). If not up:
#   cd /home/claude/site10/out && setsid python3 -m http.server 8765 >/dev/null 2>&1 &
NODE_PATH=$(npm root -g) node check.js bn.physics.7.1 en.physics.7.1 ...   # every lesson id, both langs
#   output per page: {"w":400 means no overflow (must be 400), "widgets":[innerHTML lengths], ...} then page errors
NODE_PATH=$(npm root -g) node shot2.js "http://localhost:8765/index.html#bn.physics.7.1" /tmp/claude-0/c7-71.png 420 "#s-visual"
#   then Read the PNG to look at each widget (both languages at least once) and fix what looks wrong.
```
Fix all errors, overflow and visual problems. Your chapter must end with "N/N lessons" and no ERROR/SKIPPED.
Do NOT publish anything and do NOT edit app.html, build_site.py, other chapters' files or the map.

## Final report (your last message, short)
Lessons written (count), widgets (names → lesson), any book errors/ambiguities and how you handled them,
anything left unresolved.
