# Notes for Claude

This repo is the user's Class 9–10 study website (Bangla + English): Physics, Chemistry, Biology and Bangladesh and Global Studies (BGS). Vercel deploys `public/` on every push to `main`.

- Edit sources only: `src/site/content/**`, `src/site/widgets_*.js`, `src/site/app.html`, `src/map/*.txt`.
- After a map edit: `cd src && python3 build_map.py` (regenerates `src/map/content-map.json`).
- Rebuild the site: `cd src/site && python3 build_site.py` — it validates every chapter and writes `public/`.
- Test before pushing: serve `public/` (`cd public && python3 -m http.server 8766`) and run
  `NODE_PATH=$(npm root -g) node src/site/check.js <lang>.<subject>.<lessonId> ...` (edit the port in check.js to 8766 if needed);
  every page must report `"w":400` and no errors.
- Writing new chapters: follow `src/site/AGENT_BRIEF*.md` (book OCR is not in the repo; ask the user for the PDFs if needed).
- Commit with a clear message and push to `main`.

## Accounts (api/)
- `api/*.js` are Vercel serverless functions (CommonJS, no npm deps). Storage is Upstash Redis via its REST API
  (env `KV_REST_API_URL`/`KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL`/`_TOKEN`); optional `AUTH_SECRET` signs session cookies.
- Passwords: scrypt with per-user salt. Sessions: HMAC-signed HttpOnly cookie `ll_session` (30 days).
- Keys: `user:<LL-ID>`, `contact:<email|+880phone>` → LL-ID, `llid:<LL-ID>`, `progress:<LL-ID>`, `rl:<contact>`.
- If the API/DB is missing, the front end hides login and the site works as before.
- Local test: `LL_LOCAL=1 node src/devserver.js 8767` (in-memory store) then open http://localhost:8767/.

## Project status and handoff (updated 2026-10-05)
- Owner: Shariful Alam (MIST, EEE). Site name "Let's Learn". Live: https://letslearn-eight.vercel.app
  (GitHub `sharifulalamzisan/Lets_Learn`, Vercel auto-deploys `main`). Vercel is not reachable from the shell;
  verify a deploy with `curl https://api.github.com/repos/sharifulalamzisan/Lets_Learn/deployments?per_page=1` or WebFetch.
- Preview artifact (optional, keep in sync when asked): https://claude.ai/artifact/NgQfasaTSggcAG64muPzKo
  (publish `src/site/index.html` plus the changed `data/*.json` from `src/site/out/data/`).
- Goal: public, mobile-first, bilingual (English + Bangla equally) site for NCTB Class 9–10 Physics, Chemistry, Biology
  and Bangladesh and Global Studies (subject key `bgs`, added 2026-10).
  Every topic explained like a good teacher sitting beside the student, in the fixed lesson structure
  (what / simple / analogy / definition / why / terms / formula / visual / real / example / mistakes / remember / think / quiz).
  Accuracy first, never copy the book verbatim, correct book errors gently, student-friendly Bangla titles.
- Done: Physics ch1–13, Chemistry ch1–12, Biology ch1–14 (87 lessons, 84 widgets; finished 2026-10-07), BGS ch3–5 (39 lessons, 35 map/diagram widgets),
  landing page + logo, accounts code (login stays hidden until the
  owner connects Upstash Redis in Vercel Storage and redeploys).
- Pending: owner's list of observations/fixes for Physics and Chemistry (he sends them one by one);
  BGS ch1–2 and ch6–15 (shown as "coming soon"; plan in
  `src/site/BGS_PLAN.md`; needs both BGS PDFs again, they have no text layer so OCR them, Bangla with tesseract `ben`);
  optional email verification, password reset, Privacy/Terms pages.

## Conventions worth knowing
- Lesson ids follow the NCTB book's section numbers. A lesson the owner asks to add inside a section gets a sub-id
  so the other numbers still match the book (example: pulleys = `3.7.1`, added after 3.7). Tell the owner when you do this.
- Adding a lesson: add a `T <id>|English title|Bangla title|flags` line in `src/map/<subject>.txt`, a friendly Bangla
  title in `src/map/friendly_bn.py`, run `build_map.py`, then write the lesson in `content/<subject>/chNN.txt`
  (EN and BN must have the same number of examples and quiz questions, same correct-answer positions).
- Widgets: `W.<name> = (el) => {...}` in `src/site/widgets_*.js`; SVG viewBox about 360 wide, font 12–13+, colours via
  CSS variables, bilingual with `L2(en,bn)` and `bnNum`, respect `REDUCED` motion. Screenshot the widget before pushing
  (`src/site/shot2.js`). Check every worked number by calculation.
- The `AGENT_BRIEF*.md` files still mention old paths: `/home/claude/site10/` = `src/site/`, `/home/claude/map/` = `src/map/`,
  `/home/claude/ocr/` = book OCR that is not in the repo.
- Several chats and bots push to this repo. Before committing: `git fetch origin main`; if the remote is ahead, move onto it
  first, then rebuild (`public/` is generated, never merge it by hand). After any automated commit (for example a Vercel
  integration PR) check `src/site/app.html` for broken Bangla letters: `grep -c $'\xef\xbf\xbd' src/site/app.html` must be 0.
- Shell gotchas: start local servers with `setsid nohup ... &`; do not use `pkill -f`; run at most 2–3 subagents at once.

## Bangladesh and Global Studies (BGS)
- Read `src/site/BGS_PLAN.md` first: lesson template, map sources and licences, per-chapter visual plan, and the
  provisional plan for the chapters not built yet.
- BGS lesson ids are the book section plus a sub-id (`3.1.1`, `4.2.10`); chapters with no `T` lines in `src/map/bgs.txt`
  show a "coming soon" note automatically. `C` lines take two page ranges: `pagesEN|pagesBN`.
- Extra sections (all subjects may use them): `## points` (numbered main points), `## matters` (why it is important),
  `## facts` (`label | value`). In prose sections a block of lines starting with `|` becomes a table (first line = header)
  and `> ` starts an aside. For BGS the visual is shown right after "what" (`SECT_ORDER_BY` in `app.html`).
- BGS widgets: `widgets_bgs00.js` is the toolkit (`window.G`: `bdMap`, `worldMap`, `sasiaMap`, `flow`, `stepper`, `chips`,
  `tiles`, `bars`, `legend`); `widgets_bgsNN.js` holds chapter NN. One widget may serve several lessons and switch on `L.id`.
- Map data: `src/site/geo/geo-*.json`, generated by `python3 src/site/geo/build_geo.py <folder with the source files>`
  (needs `pip install shapely topojson`; sources and licences are listed at the top of that script). `build_site.py`
  copies them to `public/data/`. Never hand-edit coordinates; keep the attribution line under every map; maps that colour
  whole districts from a textbook list must keep their "Schematic" note; do not draw a river that is not in the data.
- Book facts stay as printed; where the book is wrong or the two editions differ, say so in a short `> ` aside.
