// واجهة API: عامة (تسجيل الطلبات) + إدارية (تعديل كل المحتوى)
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const store = require('./store');
const auth = require('./auth');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ——— تنظيف المدخلات ———
const str = (v, max = 500) => String(v ?? '').trim().slice(0, max);
const bool = (v) => v === true || v === 'true' || v === 1 || v === '1';
const num = (v) => (v === '' || v === null || v === undefined || isNaN(+v)) ? null : Math.max(0, +v);
const list = (v, max = 40) => (Array.isArray(v) ? v : String(v ?? '').split(/\n|،|,/)).map(s => str(s, 200)).filter(Boolean).slice(0, max);
const img = (v) => { const s = str(v, 300); return /^\/(uploads|img)\/[\w\-./]+$/.test(s) && !s.includes('..') ? s : ''; };
const url = (v) => { const s = str(v, 500); return /^https?:\/\//i.test(s) ? s : ''; };
const date = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : '';
const time = (v) => /^\d{2}:\d{2}$/.test(String(v)) ? String(v) : '';

const SCHEMAS = {
  categories: (b) => ({ name: str(b.name, 80), description: str(b.description, 300), icon: str(b.icon, 20), visible: bool(b.visible) }),
  items: (b) => ({
    categoryId: str(b.categoryId, 40), name: str(b.name, 120), description: str(b.description, 600),
    ingredients: list(b.ingredients), price: num(b.price), unit: str(b.unit, 60), image: img(b.image),
    tags: list(b.tags, 6), featured: bool(b.featured), available: bool(b.available), visible: bool(b.visible),
  }),
  packages: (b) => ({
    name: str(b.name, 100), subtitle: str(b.subtitle, 150), guests: str(b.guests, 60), price: num(b.price),
    priceNote: str(b.priceNote, 40), includes: list(b.includes), image: img(b.image), badge: str(b.badge, 30),
    highlight: bool(b.highlight), visible: bool(b.visible),
  }),
  tastings: (b) => ({
    title: str(b.title, 120), date: date(b.date), timeFrom: time(b.timeFrom), timeTo: time(b.timeTo),
    location: str(b.location, 250), mapUrl: url(b.mapUrl), seats: num(b.seats), note: str(b.note, 500),
    status: ['open', 'full', 'closed'].includes(b.status) ? b.status : 'open', visible: bool(b.visible),
  }),
  gallery: (b) => ({ image: img(b.image), caption: str(b.caption, 200), visible: bool(b.visible) }),
  leads: (b) => ({ status: ['new', 'contacted', 'done', 'cancelled'].includes(b.status) ? b.status : 'new', adminNote: str(b.adminNote, 500) }),
};

function cleanSettings(b) {
  const s = {};
  const textKeys = { nameAr: 120, shortName: 40, nameEn: 80, tagline: 200, intro: 1200,
    currency: 10, email: 120, address: 300, orderNotes: 500, seoTitle: 160, seoDescription: 320 };
  for (const [k, max] of Object.entries(textKeys)) if (k in b) s[k] = str(b[k], max);
  if ('heroImage' in b) s.heroImage = img(b.heroImage);
  for (const k of ['mapUrl', 'facebook', 'instagram', 'tiktok']) if (k in b) s[k] = url(b[k]);
  if ('whatsapp' in b) s.whatsapp = normalizePhone(b.whatsapp);
  if ('phones' in b) s.phones = list(b.phones, 6);
  const pairs = (v, a, bk, max) => (Array.isArray(v) ? v : []).map(x => ({ [a]: str(x?.[a], 80), [bk]: str(x?.[bk], max) })).filter(x => x[a] || x[bk]).slice(0, 8);
  if ('hours' in b) s.hours = pairs(b.hours, 'label', 'value', 120);
  return s;
}

// 09xxxxxxxx → 2189xxxxxxxx (صيغة واتساب الدولية)
function normalizePhone(v) {
  let d = String(v ?? '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '218' + d.slice(1);
  if (/^9\d{8}$/.test(d)) d = '218' + d;
  return d.slice(0, 15);
}

const router = express.Router();
router.use(express.json({ limit: '5mb' }));

// ——— عامة ———
// تسجيل الطلب قبل فتح واتساب (يظهر في "سجل الطلبات" باللوحة)
const leadHits = new Map();
router.post('/leads', (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const hits = (leadHits.get(ip) || []).filter(t => now - t < 3600e3);
  if (hits.length >= 20) return res.status(429).json({ error: 'محاولات كثيرة' });
  leadHits.set(ip, [...hits, now]);
  const b = req.body || {};
  const lead = {
    id: store.newId(), createdAt: new Date().toISOString(), status: 'new', adminNote: '',
    type: ['order', 'package', 'tasting', 'inquiry'].includes(b.type) ? b.type : 'inquiry',
    name: str(b.name, 80), phone: str(b.phone, 30), eventDate: date(b.eventDate), guests: str(b.guests, 20),
    eventType: str(b.eventType, 60), delivery: str(b.delivery, 30), notes: str(b.notes, 600),
    ref: str(b.ref, 150),
    lines: (Array.isArray(b.lines) ? b.lines : []).slice(0, 60).map(l => ({ name: str(l?.name, 120), qty: Math.min(999, num(l?.qty) || 1), price: num(l?.price), unit: str(l?.unit, 60) })),
    total: num(b.total),
  };
  const db = store.get();
  db.leads.unshift(lead);
  db.leads = db.leads.slice(0, 2000);
  store.save();
  res.json({ ok: true, id: lead.id });
});

// ——— الدخول ———
router.get('/admin/status', (req, res) => res.json({ configured: auth.isConfigured(), authed: auth.isAuthed(req) }));

router.post('/admin/setup', (req, res) => {
  if (auth.isConfigured()) return res.status(400).json({ error: 'تم الإعداد مسبقًا' });
  const pw = String(req.body?.password || '');
  if (pw.length < 8) return res.status(400).json({ error: 'كلمة السر لازم 8 حروف على الأقل' });
  auth.setPassword(pw);
  auth.issue(res, req);
  res.json({ ok: true });
});

router.post('/admin/login', (req, res) => {
  if (auth.rateLimited(req.ip)) return res.status(429).json({ error: 'محاولات كثيرة، جرّب بعد 15 دقيقة' });
  if (!auth.checkPassword(req.body?.password)) { auth.recordFail(req.ip); return res.status(401).json({ error: 'كلمة السر غلط' }); }
  auth.issue(res, req);
  res.json({ ok: true });
});

router.post('/admin/logout', (req, res) => { auth.clear(res); res.json({ ok: true }); });

// ——— الإدارة ———
const admin = express.Router();
admin.use(auth.requireAdmin);

admin.get('/data', (req, res) => res.json(store.get()));

// حذف كل العناصر التجريبية دفعة وحدة
admin.delete('/demo', (req, res) => {
  const db = store.get();
  let removed = 0;
  for (const c of ['categories', 'items', 'packages', 'tastings', 'gallery']) {
    const before = db[c].length;
    db[c] = db[c].filter(x => !x.demo);
    removed += before - db[c].length;
  }
  db.items.forEach(it => { if (!db.categories.some(c => c.id === it.categoryId)) it.categoryId = ''; });
  store.save();
  res.json({ removed });
});

admin.put('/settings', (req, res) => {
  const db = store.get();
  db.settings = { ...db.settings, ...cleanSettings(req.body || {}) };
  store.save();
  res.json(db.settings);
});

admin.post('/password', (req, res) => {
  const { current, next } = req.body || {};
  if (!auth.checkPassword(current)) return res.status(400).json({ error: 'كلمة السر الحالية غلط' });
  if (String(next || '').length < 8) return res.status(400).json({ error: 'كلمة السر الجديدة لازم 8 حروف على الأقل' });
  auth.setPassword(String(next));
  auth.issue(res, req);
  res.json({ ok: true });
});

// لو المسار مش قسم بيانات نكمّل لباقي المسارات (upload, backups, restore)
const okCollection = (req, res, next) => SCHEMAS[req.params.col] ? next() : next('route');

admin.post('/:col', okCollection, (req, res) => {
  const { col } = req.params;
  if (col === 'leads') return res.status(400).json({ error: 'غير مسموح' });
  const doc = { id: store.newId(), ...SCHEMAS[col](req.body || {}), demo: false };
  store.get()[col].push(doc);
  store.save();
  res.json(doc);
});

// إعادة الترتيب: ترسل قائمة المعرّفات بالترتيب الجديد
admin.put('/:col/order', okCollection, (req, res) => {
  const db = store.get();
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const pos = new Map(ids.map((id, i) => [id, i]));
  db[req.params.col].sort((a, b) => (pos.get(a.id) ?? 1e9) - (pos.get(b.id) ?? 1e9));
  store.save();
  res.json({ ok: true });
});

admin.put('/:col/:id', okCollection, (req, res) => {
  const arr = store.get()[req.params.col];
  const i = arr.findIndex(x => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'غير موجود' });
  // تحديث جزئي: الحقول المرسلة فقط
  const clean = SCHEMAS[req.params.col]({ ...arr[i], ...req.body });
  // أي تعديل فعلي (غير الإظهار/الإخفاء) يحوّل العنصر التجريبي لعنصر حقيقي
  const realEdit = Object.keys(req.body || {}).some(k => k !== 'visible');
  arr[i] = { ...arr[i], ...clean, id: arr[i].id, ...(realEdit ? { demo: false } : {}) };
  store.save();
  res.json(arr[i]);
});

admin.delete('/:col/:id', okCollection, (req, res) => {
  const db = store.get();
  const { col, id } = req.params;
  const before = db[col].length;
  db[col] = db[col].filter(x => x.id !== id);
  if (db[col].length === before) return res.status(404).json({ error: 'غير موجود' });
  if (col === 'categories') db.items.forEach(it => { if (it.categoryId === id) it.categoryId = ''; });
  store.save();
  res.json({ ok: true });
});

// رفع الصور: تصغير وتحويل لـ WebP تلقائيًا (أسرع على شبكات الموبايل)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, files: 20 } });
admin.post('/upload', upload.array('files', 20), async (req, res) => {
  try {
    const out = [];
    for (const f of req.files || []) {
      if (!/^image\//.test(f.mimetype)) continue;
      const name = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}.webp`;
      await sharp(f.buffer).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 }).toFile(path.join(UPLOAD_DIR, name));
      out.push(`/uploads/${name}`);
    }
    if (!out.length) return res.status(400).json({ error: 'ما فيش صور صالحة' });
    res.json({ files: out });
  } catch (e) {
    res.status(400).json({ error: 'تعذّر معالجة الصورة' });
  }
});

admin.get('/backups', (req, res) => res.json(store.listBackups()));
admin.post('/backups', (req, res) => { store.backup('manual'); res.json(store.listBackups()); });
admin.get('/backups/:name', (req, res) => {
  const d = store.readBackup(req.params.name);
  if (!d) return res.status(404).json({ error: 'غير موجود' });
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.name}"`);
  res.json(d);
});
admin.post('/restore', (req, res) => {
  const d = req.body?.name ? store.readBackup(req.body.name) : req.body?.data;
  if (!d || typeof d !== 'object' || !d.settings) return res.status(400).json({ error: 'ملف غير صالح' });
  store.restore(d);
  res.json({ ok: true });
});

router.use('/admin', admin);

module.exports = { router, UPLOAD_DIR, normalizePhone };
