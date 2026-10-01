// Local test server: serves public/ and runs api/*.js like Vercel does.  Usage: LL_LOCAL=1 node src/devserver.js 8767
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), pub = path.join(root, "public"), port = +process.argv[2] || 8767;
const types = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".js": "text/javascript" };
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname.startsWith("/api/")) {
    const name = u.pathname.slice(5).replace(/[^a-z]/g, "");
    const file = path.join(root, "api", name + ".js");
    if (!fs.existsSync(file)) { res.statusCode = 404; return res.end("{}"); }
    let raw = ""; req.on("data", (c) => raw += c); req.on("end", () => { try { req.body = raw ? JSON.parse(raw) : {}; } catch (e) { req.body = {}; } require(file)(req, res); });
    return;
  }
  let f = path.join(pub, decodeURIComponent(u.pathname)); if (u.pathname === "/") f = path.join(pub, "index.html");
  if (!f.startsWith(pub) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end("not found"); }
  res.setHeader("Content-Type", types[path.extname(f)] || "application/octet-stream"); fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log("dev server on " + port));
