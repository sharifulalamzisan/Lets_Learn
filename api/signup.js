const L = require("./_lib");
module.exports = L.wrap(async (req, res) => {
  if (req.method !== "POST") return L.fail(res, 405, "METHOD");
  const b = L.body(req);
  const name = L.cleanName(b.name);
  const c = L.normContact(b.contact);
  if (!name) return L.fail(res, 400, "NAME_REQUIRED");
  if (!c) return L.fail(res, 400, "INVALID_CONTACT");
  if (!L.validPassword(b.password)) return L.fail(res, 400, "WEAK_PASSWORD");
  // reserve a unique Let's Learn ID
  let llId = null;
  for (let i = 0; i < 6 && !llId; i++) { const id = L.newId(); if (await L.redis(["SET", "llid:" + id, "1", "NX"])) llId = id; }
  if (!llId) return L.fail(res, 500, "SERVER");
  // claim the email/phone atomically (NX) so two accounts can never share it
  const claimed = await L.redis(["SET", "contact:" + c.value, llId, "NX"]);
  if (!claimed) { await L.redis(["DEL", "llid:" + llId]); return L.fail(res, 409, "EXISTS"); }
  const now = new Date().toISOString();
  const user = { llId, name, contact: c.value, contactType: c.type, pass: L.hashPassword(b.password), createdAt: now, updatedAt: now };
  await L.setJSON("user:" + llId, user);
  L.setSession(res, llId);
  L.send(res, 201, { ok: true, user: L.publicUser(user) });
});
