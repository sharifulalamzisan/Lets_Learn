# Let's Learn — Class 9–10 Science and Bangladesh & Global Studies (Bangla + English)

Free, mobile-first study site for Bangladesh Class 9–10 students (NCTB Physics, Chemistry, Biology and Bangladesh and Global Studies books, 2026 edition). Every lesson explains the idea simply, gives the definition, worked examples, common mistakes, quizzes and interactive visuals, in both Bangla and English. Bangladesh and Global Studies lessons start from interactive maps and diagrams.

Based on the NCTB Class 9–10 textbooks; not an official NCTB publication.

## Layout
- `public/` — the website that Vercel serves (`index.html` + `data/*.json`). Generated; don't edit by hand.
- `src/site/content/<subject>/chNN.txt` — lesson text (authoring format described at the top of `build_site.py`).
- `src/site/widgets_*.js` — interactive visuals; `src/site/app.html` — the app shell.
- `src/map/` — the content map (chapter and lesson list) and `content-map.json`.
- `src/site/geo/` — compact map data for the Bangladesh and Global Studies widgets and the script that builds it; `src/site/BGS_PLAN.md` — the visualization plan for that subject.

## Build
```
cd src/site && python3 build_site.py     # rebuilds public/
```
Every push to `main` is deployed automatically by Vercel.

## Map data credits
- Bangladesh district boundaries: geoBoundaries (BBS / OCHA ROAP), CC BY 4.0.
- Countries, coastlines, rivers, cities and the International Date Line: Natural Earth (public domain).
- Tectonic plate boundaries: Bird (2003), PB2002.
