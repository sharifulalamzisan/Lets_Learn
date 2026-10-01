const L = require("./_lib");
module.exports = L.wrap(async (req, res) => {
  if (req.method !== "POST") return L.fail(res, 405, "METHOD");
  const b = L.body(req);
  const c = L.normContact(b.contact);
  if (!c) return L.fail(res, 400, "INVALID_CONTACT");
  if (typeof b.password !== "string" || !b.password) return L.fail(res, 400, "BAD_LOGIN");
  // slow down guessing: at most 8 tries per account every 15 minutes
  const rl = "rl:" + c.value; const n = await L.redis(["INCR", rl]); if (n === 1) await L.redis(["EXPIRE", rl, "900"]);
  if (n > 8) return L.fail(res, 429, "RATE");
  const llId = await L.redis(["GET", "contact:" + c.value]);
  const user = llId ? await L.getJSON("user:" + llId) : null;
  if (!user || !L.checkPassword(b.password, user.pass)) return L.fail(res, 401, "BAD_LOGIN");
  await L.redis(["DEL", rl]);
  L.setSession(res, user.llId);
  L.send(res, 200, { ok: true, user: L.publicUser(user) });
});
