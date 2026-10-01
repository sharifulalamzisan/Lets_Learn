# Notes for Claude

This repo is the user's Class 10 science website (Bangla + English). Vercel deploys `public/` on every push to `main`.

- Edit sources only: `src/site/content/**`, `src/site/widgets_*.js`, `src/site/app.html`, `src/map/*.txt`.
- After a map edit: `cd src && python3 build_map.py` (regenerates `src/map/content-map.json`).
- Rebuild the site: `cd src/site && python3 build_site.py` — it validates every chapter and writes `public/`.
- Test before pushing: serve `public/` (`cd public && python3 -m http.server 8766`) and run
  `NODE_PATH=$(npm root -g) node src/site/check.js <lang>.<subject>.<lessonId> ...` (edit the port in check.js to 8766 if needed);
  every page must report `"w":400` and no errors.
- Writing new chapters: follow `src/site/AGENT_BRIEF*.md` (book OCR is not in the repo; ask the user for the PDFs if needed).
- Commit with a clear message and push to `main`.
