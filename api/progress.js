const L = require("./_lib");
const KEY = /^[a-z]{3,12}:[0-9][0-9.]{0,10}$/;
module.exports = L.wrap(async (req, res) => {
  const u = await L.currentUser(req);
  if (!u) return L.fail(res, 401, "NO_SESSION");
  const k = "progress:" + u.llId; // the user can only ever reach their own record
  if (req.method === "GET") return L.send(res, 200, { ok: true, progress: (await L.getJSON(k)) || { done: [], last: null } });
  if (req.method !== "PUT") return L.fail(res, 405, "METHOD");
  const b = L.body(req);
  const done = Array.isArray(b.done) ? [...new Set(b.done.filter((x) => typeof x === "string" && KEY.test(x)))].slice(0, 3000) : [];
  let last = null;
  if (b.last && typeof b.last === "object" && /^[a-z]{3,12}$/.test(b.last.s) && /^[0-9][0-9.]{0,10}$/.test(b.last.id)) last = { s: b.last.s, id: b.last.id, ts: Math.min(+b.last.ts || 0, Date.now()) };
  const p = { done, last, updatedAt: new Date().toISOString() };
  await L.setJSON(k, p);
  L.send(res, 200, { ok: true, progress: p });
});
