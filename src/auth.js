// مصادقة لوحة الإدارة: كلمة سر مشفّرة + كوكي موقّع (بدون قاعدة جلسات)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { DATA_DIR } = require('./store');

const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const COOKIE = 'moka_admin';
const MAX_AGE = 7 * 24 * 3600 * 1000;

let auth = null;

function persist() {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), { mode: 0o600 });
}

function init() {
  if (fs.existsSync(AUTH_FILE)) auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  else if (process.env.ADMIN_PASSWORD) {
    auth = { hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10), secret: crypto.randomBytes(32).toString('hex') };
    persist();
  }
}

const isConfigured = () => !!(auth && auth.hash);

function setPassword(pw) {
  auth = { hash: bcrypt.hashSync(pw, 10), secret: crypto.randomBytes(32).toString('hex') }; // سر جديد = تسجيل خروج كل الأجهزة
  persist();
}

const checkPassword = (pw) => isConfigured() && bcrypt.compareSync(String(pw || ''), auth.hash);

function sign(exp) {
  return crypto.createHmac('sha256', auth.secret).update(String(exp)).digest('base64url');
}

function issue(res, req) {
  const exp = Date.now() + MAX_AGE;
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.setHeader('Set-Cookie', `${COOKIE}=${exp}.${sign(exp)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE / 1000}${secure ? '; Secure' : ''}`);
}

function clear(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
}

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isAuthed(req) {
  if (!isConfigured()) return false;
  const v = parseCookies(req)[COOKIE];
  if (!v) return false;
  const [exp, sig] = v.split('.');
  if (!exp || !sig || +exp < Date.now()) return false;
  const good = sign(exp);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}

// حماية من التخمين: 8 محاولات خاطئة لكل IP في 15 دقيقة
const attempts = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const a = (attempts.get(ip) || []).filter(t => now - t < 15 * 60 * 1000);
  attempts.set(ip, a);
  return a.length >= 8;
}
const recordFail = (ip) => attempts.set(ip, [...(attempts.get(ip) || []), Date.now()]);

function requireAdmin(req, res, next) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'غير مصرح' });
  // حماية CSRF: طلبات التعديل لازم تجي من واجهة اللوحة
  if (req.method !== 'GET' && req.headers['x-moka-admin'] !== '1') return res.status(403).json({ error: 'طلب مرفوض' });
  next();
}

module.exports = { init, isConfigured, setPassword, checkPassword, issue, clear, isAuthed, requireAdmin, rateLimited, recordFail };
