// Shared helpers for the Let's Learn account API (Vercel serverless functions).
// Storage: Upstash Redis over its REST API (added from Vercel → Storage). No npm packages needed.
const crypto = require("crypto");

const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const LOCAL = !!process.env.LL_LOCAL; // local testing only: in-memory store
const SECRET = process.env.AUTH_SECRET || DB_TOKEN || (LOCAL ? "local-dev-secret" : "");
const SESSION_DAYS = 30;

// ---------- database ----------
const mem = new Map(); const memExp = new Map();
function memCmd([op, key, ...a]) {
  const now = Date.now();
  if (memExp.has(key) && memExp.get(key) < now) { mem.delete(key); memExp.delete(key); }
  op = op.toUpperCase();
  if (op === "GET") return mem.has(key) ? mem.get(key) : null;
  if (op === "SET") { const nx = a.includes("NX"); if (nx && mem.has(key)) return null; mem.set(key, String(a[0])); const ex = a.indexOf("EX"); if (ex >= 0) memExp.set(key, now + 1000 * +a[ex + 1]); return "OK"; }
  if (op === "DEL") { const had = mem.delete(key); return had ? 1 : 0; }
  if (op === "INCR") { const v = (+(mem.get(key) || 0)) + 1; mem.set(key, String(v)); return v; }
  if (op === "EXPIRE") { memExp.set(key, now + 1000 * +a[0]); return 1; }
  throw new Error("unsupported " + op);
}
async function redis(cmd) {
  if (!DB_URL) { if (LOCAL) return memCmd(cmd); const e = new Error("NO_DB"); e.code = "NO_DB"; throw e; }
  const r = await fetch(DB_URL, { method: "POST", headers: { Authorization: `Bearer ${DB_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
const getJSON = async (k) => { const v = await redis(["GET", k]); return v ? JSON.parse(v) : null; };
const setJSON = (k, v) => redis(["SET", k, JSON.stringify(v)]);

// ---------- validation ----------
function normContact(raw) {
  const s = String(raw || "").trim();
  if (s.includes("@")) {
    const e = s.toLowerCase();
    if (e.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null;
    return { type: "email", value: e };
  }
  const d = s.replace(/[\s\-()]/g, "");
  const bd = d.match(/^(?:\+?880|0)?(1[3-9]\d{8})$/);      // Bangladesh mobile numbers
  if (bd) return { type: "phone", value: "+880" + bd[1] };
  if (/^\+\d{8,15}$/.test(d)) return { type: "phone", value: d }; // other countries, with +code
  return null;
}
const validPassword = (p) => typeof p === "string" && p.length >= 8 && p.length <= 128;
const cleanName = (n) => String(n || "").replace(/\s+/g, " ").trim().slice(0, 60);

// ---------- passwords (scrypt, random salt) ----------
function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const h = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("base64")}$${h.toString("base64")}`;
}
function checkPassword(pw, stored) {
  const [alg, s, h] = String(stored).split("$");
  if (alg !== "scrypt") return false;
  const want = Buffer.from(h, "base64");
  const got = crypto.scryptSync(pw, Buffer.from(s, "base64"), want.length, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(want, got);
}

// ---------- sessions (signed, HttpOnly cookie) ----------
const b64u = (b) => Buffer.from(b).toString("base64url");
function sign(data) { return crypto.createHmac("sha256", SECRET).update(data).digest("base64url"); }
function makeToken(llId) { const body = b64u(JSON.stringify({ u: llId, exp: Date.now() + SESSION_DAYS * 864e5 })); return body + "." + sign(body); }
function readToken(tok) {
  if (!tok || !SECRET) return null;
  const [body, sig] = String(tok).split(".");
  if (!body || !sig) return null;
  const good = sign(body);
  if (good.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig))) return null;
  try { const d = JSON.parse(Buffer.from(body, "base64url").toString()); return d.exp > Date.now() ? d.u : null; } catch (e) { return null; }
}
function cookies(req) { const out = {}; String(req.headers.cookie || "").split(";").forEach((c) => { const i = c.indexOf("="); if (i > 0) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim()); }); return out; }
function setSession(res, llId) {
  const secure = LOCAL ? "" : " Secure;";
  res.setHeader("Set-Cookie", `ll_session=${makeToken(llId)}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`);
}
function clearSession(res) { res.setHeader("Set-Cookie", `ll_session=; Path=/; HttpOnly;${LOCAL ? "" : " Secure;"} SameSite=Lax; Max-Age=0`); }
async function currentUser(req) { const id = readToken(cookies(req).ll_session); if (!id) return null; return getJSON("user:" + id); }

// ---------- misc ----------
function newId() { return "LL-" + crypto.randomBytes(4).toString("hex").toUpperCase(); }
const publicUser = (u) => ({ name: u.name, llId: u.llId, contact: u.contact, contactType: u.contactType, createdAt: u.createdAt });
function send(res, status, obj) { res.statusCode = status; res.setHeader("Content-Type", "application/json"); res.setHeader("Cache-Control", "no-store"); res.end(JSON.stringify(obj)); }
function fail(res, status, code) { send(res, status, { ok: false, error: code }); }
function body(req) { if (req.body && typeof req.body === "object") return req.body; try { return JSON.parse(req.body || "{}"); } catch (e) { return {}; } }
function wrap(fn) { return async (req, res) => { try { await fn(req, res); } catch (e) { if (e.code === "NO_DB" || !SECRET) return fail(res, 503, "NO_DB"); console.error(e); fail(res, 500, "SERVER"); } }; }

module.exports = { redis, getJSON, setJSON, normContact, validPassword, cleanName, hashPassword, checkPassword, setSession, clearSession, currentUser, newId, publicUser, send, fail, body, wrap };
