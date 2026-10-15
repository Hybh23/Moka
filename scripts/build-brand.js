// يولّد ملفات الهوية في public/brand  —  node scripts/build-brand.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { markSvg, PATHS, LINES } = require('../src/mark');

const OUT = path.join(__dirname, '..', 'public', 'brand');
fs.mkdirSync(OUT, { recursive: true });
const C = { espresso: '#1B130D', cream: '#FBF0D6', gold: '#C9973A' };
const jost = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'jost-latin-300-normal.woff2')).toString('base64');
const fontCss = `<style>@font-face{font-family:MokaJost;src:url(data:font/woff2;base64,${jost}) format('woff2');font-weight:300}</style>`;

const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const write = (name, svg) => fs.writeFileSync(path.join(OUT, name), svg);

// 1) العلامة وحدها
write('moka-mark-gold.svg', markSvg({ standalone: true }));
write('moka-mark-espresso.svg', markSvg({ standalone: true, variant: 'mono', color: C.espresso, gap: C.cream }));
write('moka-mark-cream.svg', markSvg({ standalone: true, variant: 'mono', color: C.cream, gap: C.espresso }));

// 2) الشعار المركّب (علامة + MOKA KITCHEN) — مثل شعار الفيسبوك
function stacked({ bg, text, gold = true, mono, gap }) {
  const m = gold ? markSvg({}) : markSvg({ variant: 'mono', color: mono, gap });
  const bgRect = bg ? `<rect width="1200" height="1200" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">${fontCss}${bgRect}` +
    `<svg x="300" y="170" width="600" height="600" viewBox="70 66 984 970">${inner(m)}</svg>` +
    `<text x="600" y="930" text-anchor="middle" font-family="MokaJost,Jost,Montserrat,sans-serif" font-weight="300" font-size="92" letter-spacing="22" fill="${text}">MOKA KITCHEN</text></svg>`;
}
write('moka-logo-stacked-cream.svg', stacked({ bg: C.cream, text: '#6B5A45' }));
write('moka-logo-stacked-dark.svg', stacked({ bg: C.espresso, text: '#E9D9B5' }));
write('moka-logo-stacked-transparent.svg', stacked({ text: '#6B5A45' }));

// 3) الشعار الدائري (صورة البروفايل)
const avatar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">${fontCss}` +
  `<circle cx="600" cy="600" r="600" fill="${C.cream}"/><circle cx="600" cy="600" r="560" fill="none" stroke="#E2C98F" stroke-width="4"/>` +
  `<svg x="330" y="180" width="540" height="540" viewBox="70 66 984 970">${inner(markSvg({}))}</svg>` +
  `<text x="600" y="890" text-anchor="middle" font-family="MokaJost,Jost,sans-serif" font-weight="300" font-size="78" letter-spacing="18" fill="#6B5A45">MOKA KITCHEN</text></svg>`;
write('moka-avatar.svg', avatar);

// 4) أيقونة الموقع
const icon = (bg, r) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${r}" fill="${bg}"/>` +
  `<svg x="76" y="76" width="360" height="360" viewBox="70 66 984 970">${inner(markSvg({}))}</svg></svg>`;
write('favicon.svg', icon(C.espresso, 112));
fs.copyFileSync(path.join(OUT, 'favicon.svg'), path.join(__dirname, '..', 'public', 'favicon.svg'));

(async () => {
  const png = (svg, size, file) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(path.join(OUT, file));
  await png(icon(C.espresso, 112), 512, 'icon-512.png');
  await png(icon(C.espresso, 112), 192, 'icon-192.png');
  await png(icon(C.espresso, 0), 180, 'apple-touch-icon.png');
  await png(icon(C.espresso, 0), 512, 'icon-maskable-512.png');
  await png(markSvg({ standalone: true }), 1024, 'moka-mark-gold.png');
  console.log('brand assets ->', OUT);
})();
