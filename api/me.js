const L = require("./_lib");
module.exports = L.wrap(async (req, res) => {
  const u = await L.currentUser(req);
  if (!u) return L.fail(res, 401, "NO_SESSION");
  L.send(res, 200, { ok: true, user: L.publicUser(u) });
});
