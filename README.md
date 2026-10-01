# Let's Learn — Class 9–10 Science (Bangla + English)

Free, mobile-first study site for Bangladesh Class 9–10 students (NCTB Physics, Chemistry and Biology books, 2026 edition). Every lesson explains the idea simply, gives the scientific definition, worked examples, common mistakes, quizzes and interactive visuals, in both Bangla and English.

Based on the NCTB Class 9–10 textbooks; not an official NCTB publication.

## Layout
- `public/` — the website that Vercel serves (`index.html` + `data/*.json`). Generated; don't edit by hand.
- `src/site/content/<subject>/chNN.txt` — lesson text (authoring format described at the top of `build_site.py`).
- `src/site/widgets_*.js` — interactive visuals; `src/site/app.html` — the app shell.
- `src/map/` — the content map (chapter and lesson list) and `content-map.json`.

## Build
```
cd src/site && python3 build_site.py     # rebuilds public/
```
Every push to `main` is deployed automatically by Vercel.
