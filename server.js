// موكا للخدمات التموينية — السيرفر
const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const store = require('./src/store');
const auth = require('./src/auth');
const views = require('./src/views');
const { router: api, UPLOAD_DIR } = require('./src/api');

store.load();
auth.init();

// رقم نسخة للملفات الثابتة حتى يتحدّث الكاش بعد أي تعديل
const PUB = path.join(__dirname, 'public');
const hash = crypto.createHash('md5');
for (const f of ['css/site.css', 'js/site.js', 'admin/admin.css', 'admin/admin.js']) {
  const p = path.join(PUB, f);
  if (fs.existsSync(p)) hash.update(fs.readFileSync(p));
}
views.setAssetVersion(hash.digest('hex').slice(0, 8));

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.use(compression());
app.use('/api', api);

const long = { maxAge: '30d' };
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '365d', immutable: true }));
app.use('/fonts', express.static(path.join(PUB, 'fonts'), { maxAge: '365d', immutable: true }));
app.use('/admin', express.static(path.join(PUB, 'admin'), { index: 'index.html', maxAge: 0 }));
app.use(express.static(PUB, { ...long, redirect: false }));

const page = (fn) => (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.type('html').send(fn(store.get()));
};
app.get('/', page(views.home));
app.get('/menu', page(views.menu));
// روابط قديمة → أقسام الصفحة الرئيسية
for (const [from, to] of [['/packages', '/#packages'], ['/tastings', '/#tasting'], ['/gallery', '/#gallery'], ['/contact', '/#contact'], ['/brand', '/']]) app.get(from, (req, res) => res.redirect(301, to));

app.get('/manifest.webmanifest', (req, res) => {
  const s = store.get().settings;
  res.type('application/manifest+json').send(JSON.stringify({
    name: s.nameAr, short_name: s.shortName, lang: 'ar', dir: 'rtl', start_url: '/', display: 'standalone',
    background_color: '#FBF8F2', theme_color: '#FBF8F2',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }));
});

const SITE = String(process.env.SITE_URL || '').replace(/\/$/, '');
app.get('/robots.txt', (req, res) => res.type('text').send(`User-agent: *\nDisallow: /admin\nDisallow: /api\n${SITE ? `Sitemap: ${SITE}/sitemap.xml\n` : ''}`));
app.get('/sitemap.xml', (req, res) => {
  const base = SITE || `${req.protocol}://${req.get('host')}`;
  const urls = ['/', '/menu'];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${base}${u}</loc></url>`).join('')}</urlset>`);
});

app.use((req, res) => res.status(404).type('html').send(views.notFound(store.get())));

app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api')) return res.status(err.status || 500).json({ error: err.status === 413 ? 'الملف كبير بزاف' : 'صار خطأ في السيرفر' });
  res.status(500).send('خطأ في السيرفر');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Moka running on http://localhost:${PORT}`);
  if (!auth.isConfigured()) console.log('⚠ لوحة الإدارة غير مهيأة: افتح /admin لتعيين كلمة السر، أو شغّل مع ADMIN_PASSWORD');
});
