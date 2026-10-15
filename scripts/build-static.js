// نسخة ثابتة من الموقع للعرض (GitHub Pages أو أي استضافة ملفات) — node scripts/build-static.js
// الطلب على واتساب يخدم عادي، لكن لوحة الإدارة وسجل الطلبات يحتاجوا السيرفر.
const fs = require('fs');
const path = require('path');
const store = require('../src/store');
const views = require('../src/views');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const db = store.load();

function rel(html) {
  return html
    .replace(/href="\/menu"/g, 'href="menu.html"')
    .replace(/href="\/#/g, 'href="index.html#')
    .replace(/href="\/"/g, 'href="index.html"')
    .replace(/(src|href)="\/(css|js|img|brand|fonts|uploads|favicon\.svg|manifest\.webmanifest)/g, '$1="$2')
    .replace(/url\(\/fonts\//g, 'url(../fonts/');
}

fs.writeFileSync(path.join(OUT, 'index.html'), rel(views.home(db)));
fs.writeFileSync(path.join(OUT, 'menu.html'), rel(views.menu(db)));
fs.writeFileSync(path.join(OUT, '404.html'), rel(views.notFound(db)));

const copy = (from, to) => fs.cpSync(path.join(ROOT, from), path.join(OUT, to), { recursive: true });
for (const d of ['css', 'js', 'img', 'fonts', 'brand']) copy(`public/${d}`, d);
copy('public/favicon.svg', 'favicon.svg');
const up = path.join(ROOT, 'uploads');
if (fs.existsSync(up)) copy('uploads', 'uploads');

const css = path.join(OUT, 'css/site.css');
fs.writeFileSync(css, fs.readFileSync(css, 'utf8').replace(/url\(\/fonts\//g, 'url(../fonts/'));
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
  name: db.settings.nameAr, short_name: db.settings.shortName, lang: 'ar', dir: 'rtl', start_url: './', display: 'standalone',
  background_color: '#15100B', theme_color: '#15100B',
  icons: [{ src: 'brand/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'brand/icon-512.png', sizes: '512x512', type: 'image/png' }],
}));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('dist/ ready');
