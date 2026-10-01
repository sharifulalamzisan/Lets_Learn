const L = require("./_lib");
module.exports = L.wrap(async (req, res) => {
  if (!L.dbReady()) return L.fail(res, 503, "NO_DB"); // accounts not set up yet: the site hides login
  const u = await L.currentUser(req);
  if (!u) return L.fail(res, 401, "NO_SESSION");
  L.send(res, 200, { ok: true, user: L.publicUser(u) });
});
