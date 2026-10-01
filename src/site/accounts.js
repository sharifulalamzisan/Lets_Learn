/* ===== Let's Learn — accounts (front end) =====
   Talks to /api/* on Vercel. Passwords never touch the browser's storage; the session is an HttpOnly cookie.
   If the API isn't reachable (e.g. the preview inside Claude), the site still works without an account. */
const AUTH = { user: null, ready: false, available: true };
const CREDIT = {
  en: "Created by Shariful Alam, EEE, Military Institute of Science and Technology (MIST)",
  bn: "তৈরি করেছেন শরিফুল আলম, ইইই, মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি (এমআইএসটি)"
};
const AU = {
  en: { login: "Log in", signup: "Sign up", logout: "Log out", account: "My account",
    welcome: "Welcome to Let's Learn", welcomeSub: "Log in or create a free account to keep your progress on every device.",
    contact: "Email or phone number", contactHint: "For example name@gmail.com or 01712345678", name: "Your name", password: "Password",
    passHint: "At least 8 characters", show: "Show", hide: "Hide",
    doLogin: "Log in", doSignup: "Create account", busy: "Please wait…",
    noAcc: "New here?", haveAcc: "Already have an account?", guest: "Continue without an account",
    guestNote: "Without an account your progress is saved only on this device.",
    idTitle: "Your Let's Learn ID", idNote: "Keep this ID. It is your identity on Let's Learn; you log in with your email or phone and password.",
    copy: "Copy ID", copied: "✓ ID copied", go: "Go to Let's Learn",
    err: { INVALID_CONTACT: "Enter a valid email address or mobile number.", WEAK_PASSWORD: "Use at least 8 characters for your password.", NAME_REQUIRED: "Enter your name.",
      EXISTS: "An account with this email or phone already exists. Try logging in.", BAD_LOGIN: "That email/phone and password don't match.",
      RATE: "Too many attempts. Wait 15 minutes and try again.", NO_DB: "Accounts are being set up. Please try again later, or continue without an account.",
      NET: "Couldn't reach the server. Check your internet connection and try again.", SERVER: "Something went wrong on our side. Please try again." },
    unavailable: "Accounts are not available in this preview. You can still use every lesson.",
    profile: "Profile", joined: "Joined", yourId: "Let's Learn ID", progress: "Your progress", synced: "Saved to your account, so it follows you to any device.",
    hello: (n) => `Welcome back, ${n}` },
  bn: { login: "লগ ইন", signup: "সাইন আপ", logout: "লগ আউট", account: "আমার অ্যাকাউন্ট",
    welcome: "Let's Learn-এ স্বাগতম", welcomeSub: "লগ ইন করো বা বিনামূল্যে অ্যাকাউন্ট খোলো, যাতে যেকোনো ডিভাইসে তোমার অগ্রগতি থাকে।",
    contact: "ইমেইল বা মোবাইল নম্বর", contactHint: "যেমন name@gmail.com বা 01712345678", name: "তোমার নাম", password: "পাসওয়ার্ড",
    passHint: "কমপক্ষে ৮ অক্ষর", show: "দেখাও", hide: "লুকাও",
    doLogin: "লগ ইন", doSignup: "অ্যাকাউন্ট খোলো", busy: "একটু অপেক্ষা করো…",
    noAcc: "নতুন?", haveAcc: "আগে থেকেই অ্যাকাউন্ট আছে?", guest: "অ্যাকাউন্ট ছাড়াই চালিয়ে যাও",
    guestNote: "অ্যাকাউন্ট ছাড়া তোমার অগ্রগতি শুধু এই ডিভাইসে জমা থাকবে।",
    idTitle: "তোমার Let's Learn আইডি", idNote: "আইডিটি রেখে দাও। এটা Let's Learn-এ তোমার পরিচয়; লগ ইন করবে ইমেইল বা ফোন আর পাসওয়ার্ড দিয়ে।",
    copy: "আইডি কপি করো", copied: "✓ আইডি কপি হয়েছে", go: "Let's Learn-এ যাও",
    err: { INVALID_CONTACT: "সঠিক ইমেইল বা মোবাইল নম্বর লেখো।", WEAK_PASSWORD: "পাসওয়ার্ডে কমপক্ষে ৮ অক্ষর দাও।", NAME_REQUIRED: "তোমার নাম লেখো।",
      EXISTS: "এই ইমেইল বা ফোনে আগেই অ্যাকাউন্ট আছে। লগ ইন করে দেখো।", BAD_LOGIN: "ইমেইল/ফোন আর পাসওয়ার্ড মিলছে না।",
      RATE: "অনেকবার চেষ্টা হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করো।", NO_DB: "অ্যাকাউন্ট ব্যবস্থা চালু হচ্ছে। পরে আবার চেষ্টা করো, বা অ্যাকাউন্ট ছাড়াই চালিয়ে যাও।",
      NET: "সার্ভারে পৌঁছানো যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করো।", SERVER: "আমাদের দিকে কিছু সমস্যা হয়েছে। আবার চেষ্টা করো।" },
    unavailable: "এই প্রিভিউতে অ্যাকাউন্ট চালু নেই। সব পাঠ তবুও পড়তে পারবে।",
    profile: "প্রোফাইল", joined: "যোগ দিয়েছ", yourId: "Let's Learn আইডি", progress: "তোমার অগ্রগতি", synced: "তোমার অ্যাকাউন্টে জমা থাকে, তাই যেকোনো ডিভাইসে পাবে।",
    hello: (n) => `আবার স্বাগতম, ${n}` }
};

async function api(path, method = "GET", data) {
  const r = await fetch("/api/" + path, { method, headers: data ? { "Content-Type": "application/json" } : {}, body: data ? JSON.stringify(data) : undefined, credentials: "same-origin" });
  let j = null; try { j = await r.json(); } catch (e) { }
  return { status: r.status, ok: r.ok, data: j };
}
async function authInit() {
  try {
    const r = await api("me");
    if (r.ok && r.data && r.data.user) { AUTH.user = r.data.user; await syncProgress(); }
    else if (!(r.data && r.data.error)) AUTH.available = false;   // no API here (static preview)
    else if (r.data.error === "NO_DB") AUTH.available = false;
  } catch (e) { AUTH.available = false; }
  AUTH.ready = true;
}
// merge this device's progress with the account's, then save the union
async function syncProgress() {
  try {
    const r = await api("progress"); if (!r.ok) return;
    const p = r.data.progress || { done: [], last: null };
    const before = DONE.size; p.done.forEach((k) => DONE.add(k));
    const localLast = store.get("c10-last", null);
    const last = (!localLast || (p.last && p.last.ts > localLast.ts)) ? p.last : localLast;
    store.set("c10-done", [...DONE]); if (last) store.set("c10-last", last);
    if (DONE.size !== p.done.length || (last && (!p.last || last.ts !== p.last.ts)) || before !== DONE.size) pushProgressNow();
  } catch (e) { }
}
let pushTm = null;
function pushProgress() { if (!AUTH.user) return; clearTimeout(pushTm); pushTm = setTimeout(pushProgressNow, 800); }
function pushProgressNow() { if (!AUTH.user) return; api("progress", "PUT", { done: [...DONE], last: store.get("c10-last", null) }).catch(() => { }); }

function goHome(){ if(location.hash===href()) route(); else location.hash = href(); }
function needsLogin(r) { return AUTH.available && !AUTH.user && !store.get("c10-guest", false) && r.view === "home"; }

function acctChrome() {
  const a = AU[LANG]; const box = $("#acct"); if (!box) return;
  if (AUTH.user) { const ini = (AUTH.user.name || "?").trim().charAt(0).toUpperCase();
    box.innerHTML = `<a class="acctbtn" href="${href("account")}" aria-label="${a.account}"><span class="ava">${esc(ini)}</span><span class="nm">${esc(AUTH.user.name.split(" ")[0])}</span></a>`; }
  else if (AUTH.available) box.innerHTML = `<a class="acctbtn" href="${href("login")}">${a.login}</a>`;
  else box.innerHTML = "";
}

function viewLogin(mode) {
  const a = AU[LANG]; const signup = mode === "signup";
  return `<section class="au-wrap"><div class="au-panel">
      <div class="au-brand">${logoMark()}<span>Let's Learn</span></div>
      <h1>${a.welcome}</h1><p>${a.welcomeSub}</p>
      <ul class="au-points"><li>${LANG === "bn" ? "পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান" : "Physics, Chemistry and Biology"}</li><li>${LANG === "bn" ? "বাংলা ও ইংরেজিতে, ছবিসহ" : "In Bangla and English, with visuals"}</li><li>${LANG === "bn" ? "যেখানে থেমেছিলে সেখান থেকে শুরু" : "Pick up where you left off"}</li></ul>
      <p class="au-credit">${CREDIT[LANG]}</p></div>
    <div class="au-card" id="au-card">
      ${AUTH.available ? `<div class="au-tabs" role="tablist"><a role="tab" aria-selected="${!signup}" href="${href("login")}">${a.login}</a><a role="tab" aria-selected="${signup}" href="${href("login", "signup")}">${a.signup}</a></div>
      <form id="au-form" novalidate data-mode="${signup ? "signup" : "login"}">
        ${signup ? `<label class="au-f"><span>${a.name}</span><input name="name" autocomplete="name" required maxlength="60"></label>` : ""}
        <label class="au-f"><span>${a.contact}</span><input name="contact" autocomplete="username" inputmode="email" required placeholder="${a.contactHint}"></label>
        <label class="au-f"><span>${a.password}</span><span class="au-pw"><input name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" required minlength="${signup ? 8 : 1}"><button type="button" class="au-eye" aria-pressed="false">${a.show}</button></span>${signup ? `<small>${a.passHint}</small>` : ""}</label>
        <p class="au-err" id="au-err" role="alert" hidden></p>
        <button class="ll-btn ink au-submit" type="submit">${signup ? a.doSignup : a.doLogin}</button>
      </form>
      <p class="au-switch">${signup ? a.haveAcc : a.noAcc} <a href="${href("login", signup ? "" : "signup")}">${signup ? a.login : a.signup}</a></p>` : `<p class="au-note">${a.unavailable}</p>`}
      <div class="au-guest"><button class="ll-btn line" id="au-guest" type="button">${a.guest}</button><small>${a.guestNote}</small></div>
    </div></section>`;
}
function showNewId(user) {
  const a = AU[LANG];
  $("#au-card").innerHTML = `<div class="au-done"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="var(--good-soft)"/><path d="M15 27 l7 7 l15 -16" fill="none" stroke="var(--good)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <h2>${AU[LANG].hello(esc(user.name.split(" ")[0])).replace(LANG === "bn" ? "আবার স্বাগতম" : "Welcome back", LANG === "bn" ? "স্বাগতম" : "Welcome")}</h2>
    <p class="muted">${a.idTitle}</p><div class="au-id" id="au-id">${user.llId}</div>
    <button class="ll-btn line" id="au-copy" type="button">${a.copy}</button><p class="au-toast" id="au-toast" aria-live="polite"></p>
    <p class="muted" style="font-size:14px">${a.idNote}</p><button class="ll-btn ink" id="au-go" type="button">${a.go}</button></div>`;
  $("#au-go").addEventListener("click", goHome);
  $("#au-copy").addEventListener("click", async () => { try { await navigator.clipboard.writeText(user.llId); } catch (e) { const r = document.createRange(); r.selectNode($("#au-id")); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand("copy"); } $("#au-toast").textContent = a.copied; });
}
function wireLogin(root) {
  const a = AU[LANG];
  const g = $("#au-guest", root); if (g) g.addEventListener("click", () => { store.set("c10-guest", true); goHome(); });
  const f = $("#au-form", root); if (!f) return;
  const eye = $(".au-eye", f); eye.addEventListener("click", () => { const i = f.password; const show = i.type === "password"; i.type = show ? "text" : "password"; eye.textContent = show ? a.hide : a.show; eye.setAttribute("aria-pressed", show); });
  f.addEventListener("submit", async (e) => {
    e.preventDefault(); const err = $("#au-err", f); const btn = $(".au-submit", f); const mode = f.dataset.mode;
    const data = { contact: f.contact.value, password: f.password.value }; if (mode === "signup") data.name = f.name.value;
    // quick checks before asking the server
    const bad = mode === "signup" && !data.name.trim() ? "NAME_REQUIRED" : !/@/.test(data.contact) && !/^[+\d][\d\s\-()]{7,}$/.test(data.contact.trim()) ? "INVALID_CONTACT" : mode === "signup" && data.password.length < 8 ? "WEAK_PASSWORD" : !data.password ? "BAD_LOGIN" : null;
    if (bad) { err.textContent = a.err[bad]; err.hidden = false; return; }
    err.hidden = true; btn.disabled = true; const label = btn.textContent; btn.textContent = a.busy;
    try {
      const r = await api(mode, "POST", data);
      if (r.ok && r.data && r.data.user) { AUTH.user = r.data.user; store.set("c10-guest", false); await syncProgress(); acctChrome();
        if (mode === "signup") showNewId(r.data.user); else goHome(); return; }
      const code = (r.data && r.data.error) || "SERVER"; err.textContent = a.err[code] || a.err.SERVER; err.hidden = false;
    } catch (ex) { err.textContent = a.err.NET; err.hidden = false; }
    btn.disabled = false; btn.textContent = label;
  });
}
function viewAccount() {
  const a = AU[LANG]; const u = AUTH.user;
  if (!u) return viewLogin("login");
  const joined = new Date(u.createdAt).toLocaleDateString(LANG === "bn" ? "bn-BD" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
  const rows = MAP.map((s) => { const [d, n] = progressOf(s); return `<div class="au-prow s-${s.key}"><span>${title(s)}</span><span class="bar"><i style="width:${n ? 100 * d / n : 0}%"></i></span><span>${bnNum(d, LANG)}/${bnNum(n, LANG)}</span></div>`; }).join("");
  return `<section class="au-acc"><nav class="crumbs"><a href="${href()}">${UI[LANG].home}</a><span>›</span><span>${a.account}</span></nav>
    <div class="au-head"><span class="ava big">${esc(u.name.charAt(0).toUpperCase())}</span><div><h1>${esc(u.name)}</h1><p class="muted">${esc(u.contact)}</p></div></div>
    <dl class="au-dl"><div><dt>${a.yourId}</dt><dd class="au-id sm">${u.llId}</dd></div><div><dt>${a.joined}</dt><dd>${joined}</dd></div></dl>
    <h2>${a.progress}</h2>${rows}<p class="muted" style="font-size:14px">${a.synced}</p>
    <button class="ll-btn line" id="au-logout" type="button">${a.logout}</button></section>`;
}
function wireAccount(root) {
  const b = $("#au-logout", root); if (!b) return;
  b.addEventListener("click", async () => { try { await api("logout", "POST"); } catch (e) { } AUTH.user = null; store.set("c10-guest", false); acctChrome(); location.hash = href("login"); });
}
