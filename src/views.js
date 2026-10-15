// قوالب الموقع العام (تُولَّد على السيرفر)
const { markSvg } = require('./mark');
const { icon } = require('./icons');

const e = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = (u) => /^https?:\/\//i.test(String(u || '')) ? e(u) : '#';
const vis = (arr) => (arr || []).filter(x => x.visible !== false);
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const tel = (p) => String(p).replace(/[^\d+]/g, '');
const wa = (s, text) => `https://wa.me/${e(s.whatsapp)}?text=${encodeURIComponent(text)}`;

let ASSET_V = Date.now().toString(36);
const SITE = String(process.env.SITE_URL || '').replace(/\/$/, '');

const AR_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
function dateParts(iso) {
  if (!iso) return null;
  const [y, m, d] = String(iso).split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return { day: AR_DAYS[dt.getUTCDay()], d, month: AR_MONTHS[m - 1], y };
}
function time12(t) {
  if (!t) return '';
  let [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'مساءً' : 'صباحًا';
  h = h % 12 || 12;
  return `${h}${m ? ':' + String(m).padStart(2, '0') : ''} ${p}`;
}
const today = () => new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 10); // توقيت ليبيا
const upcoming = (db) => vis(db.tastings).filter(t => t.demo || (t.date && t.date >= today()))
  .sort((a, b) => String(a.date).localeCompare(String(b.date)));

// السعر: العنصر التجريبي يعرض "السعر" كمكان فاضي
const priceHtml = (s, x) => {
  if (x.demo && x.price == null) return '<span class="price">السعر</span>';
  if (x.price == null) return '<span class="price price-ask">السعر عند الطلب</span>';
  return `<span class="price"><b>${Number(x.price).toLocaleString('en-US')}</b> ${e(s.currency)}</span>`;
};

const phImg = (label) => `<span class="ph-img" aria-hidden="true">${markSvg({ variant: 'mono', color: 'currentColor', gap: 'transparent', cls: 'ph-mark' })}<small>${e(label)}</small></span>`;

// ——— المكوّنات ———
function brand(s) {
  return `<a href="/" class="brand" aria-label="${e(s.nameAr)}">
    ${markSvg({ cls: 'brand-mark', title: s.shortName })}
    <span class="brand-name"><b>${e(s.shortName)}</b><small>${e(s.nameEn).toUpperCase()}</small></span>
  </a>`;
}

function dishCard(s, it) {
  const data = { id: it.id };
  return `
  <article class="dish${it.demo ? ' is-demo' : ''}${it.available === false ? ' is-out' : ''}" data-cat="${e(it.categoryId)}" data-search="${e([it.name, it.description, ...(it.ingredients || [])].join(' '))}">
    <button type="button" class="dish-img" data-open-item="${e(it.id)}" aria-label="تفاصيل ${e(it.name)}">
      ${it.image ? `<img src="${e(it.image)}" alt="${e(it.name)}" loading="lazy" decoding="async">` : phImg('صورة الصنف')}
      ${it.available === false ? '<span class="flag">غير متوفر</span>' : (it.tags || [])[0] ? `<span class="flag">${e(it.tags[0])}</span>` : ''}
    </button>
    <div class="dish-body">
      <h3>${e(it.name)}</h3>
      ${it.description ? `<p class="dish-desc">${e(it.description)}</p>` : ''}
      ${(it.ingredients || []).length ? `<p class="dish-ingr"><span>المكونات:</span> ${it.ingredients.map(e).join('، ')}</p>` : ''}
      <div class="dish-foot">
        <div class="dish-price">${priceHtml(s, it)}${it.unit ? `<small>${e(it.unit)}</small>` : ''}</div>
        ${it.available === false ? '' : `<div class="add" data-add="${e(it.id)}">
          <button type="button" class="btn btn-outline btn-sm" data-act="add">${icon('plus')} إضافة</button>
          <div class="stepper" hidden><button type="button" data-act="inc" aria-label="زيادة">${icon('plus')}</button><output>1</output><button type="button" data-act="dec" aria-label="نقص">${icon('minus')}</button></div>
        </div>`}
      </div>
    </div>
  </article>`;
}

function packageCard(s, p) {
  const msg = `السلام عليكم، نبي نستفسر على ${p.name}`;
  return `
  <article class="pkg${p.demo ? ' is-demo' : ''}${p.highlight ? ' is-hl' : ''}">
    ${p.image ? `<div class="pkg-img"><img src="${e(p.image)}" alt="${e(p.name)}" loading="lazy"></div>` : ''}
    <div class="pkg-body">
      ${p.badge ? `<span class="badge">${e(p.badge)}</span>` : ''}
      <h3>${e(p.name)}</h3>
      ${p.subtitle ? `<p class="muted">${e(p.subtitle)}</p>` : ''}
      ${p.guests ? `<p class="pkg-meta">${icon('users')} ${e(p.guests)}</p>` : ''}
      <div class="pkg-price">${priceHtml(s, p)}${p.priceNote ? `<small>${e(p.priceNote)}</small>` : ''}</div>
      ${(p.includes || []).length ? `<ul class="checks">${p.includes.map(x => `<li>${icon('check')}<span>${e(x)}</span></li>`).join('')}</ul>` : ''}
      <a class="btn btn-outline btn-block" href="${wa(s, msg)}" data-lead='${e(json({ type: 'package', ref: p.name }))}' target="_blank" rel="noopener">${icon('whatsapp')} اطلب الباقة</a>
    </div>
  </article>`;
}

function tastingCard(s, t) {
  const dp = dateParts(t.date);
  const when = dp ? `${dp.day} ${dp.d} ${dp.month}${t.timeFrom ? ' · ' + time12(t.timeFrom) : ''}` : '';
  return `
  <article class="tasting${t.demo ? ' is-demo' : ''}">
    <div class="t-date">${dp ? `<small>${dp.day}</small><b>${dp.d}</b><small>${dp.month}</small>` : '<small>اليوم</small><b>--</b><small>الشهر</small>'}</div>
    <div class="t-body">
      <h3>${e(t.title)}</h3>
      <ul class="t-meta">
        <li>${icon('clock')}<span>${t.timeFrom ? `${time12(t.timeFrom)}${t.timeTo ? ' – ' + time12(t.timeTo) : ''}` : 'الساعة'}</span></li>
        <li>${icon('pin')}<span>${e(t.location)}</span></li>
      </ul>
      ${t.note ? `<p class="muted">${e(t.note)}</p>` : ''}
    </div>
    <div class="t-cta">
      ${t.status === 'full' ? '<span class="badge">المقاعد كاملة</span>' : t.status === 'closed' ? '<span class="badge">الحجز مقفول</span>' :
        `<button type="button" class="btn btn-dark" data-book='${e(json({ title: t.title, when }))}'>${icon('calendar')} احجز مقعد</button>`}
      ${t.mapUrl ? `<a class="link" href="${safeUrl(t.mapUrl)}" target="_blank" rel="noopener">الموقع على الخريطة</a>` : ''}
    </div>
  </article>`;
}

const galleryTile = (g) => g.image
  ? `<figure><button type="button" data-lightbox="${e(g.image)}" data-caption="${e(g.caption)}" aria-label="تكبير الصورة"><img src="${e(g.image)}" alt="${e(g.caption)}" loading="lazy"></button></figure>`
  : `<figure class="is-demo">${phImg('صورة')}</figure>`;

const head = (kicker, title, sub = '', link = '') => `<div class="sec-head"><div><span class="kicker">${e(kicker)}</span><h2>${e(title)}</h2>${sub ? `<p>${e(sub)}</p>` : ''}</div>${link}</div>`;
const nl = (v) => e(v).replace(/\n/g, '<br>');

// ——— الهيكل ———
const NAV = [['/', 'الرئيسية'], ['/menu', 'المنيو'], ['/#packages', 'الباقات'], ['/#tasting', 'التذوّق'], ['/#gallery', 'أعمالنا'], ['/#contact', 'تواصل']];

function layout(db, { title, path = '/', body }) {
  const s = db.settings;
  const fullTitle = title ? `${title} | ${s.nameAr}` : s.seoTitle;
  const items = vis(db.items).map(i => ({ id: i.id, name: i.name, price: i.price, unit: i.unit, image: i.image, description: i.description, ingredients: i.ingredients, available: i.available !== false, demo: !!i.demo }));
  const ld = {
    '@context': 'https://schema.org', '@type': 'FoodEstablishment', name: s.nameAr, alternateName: s.nameEn,
    description: s.seoDescription, telephone: (s.phones || [])[0],
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: 'طرابلس', addressCountry: 'LY' },
    hasMap: s.mapUrl || undefined, sameAs: [s.facebook, s.instagram, s.tiktok].filter(Boolean),
  };
  const waHello = wa(s, 'السلام عليكم');
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(fullTitle)}</title>
<meta name="description" content="${e(s.seoDescription)}">
<meta name="theme-color" content="#FBF6EC">
${SITE ? `<link rel="canonical" href="${e(SITE + path)}"><meta property="og:url" content="${e(SITE + path)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_LY">
<meta property="og:title" content="${e(fullTitle)}">
<meta property="og:description" content="${e(s.seoDescription)}">
<meta property="og:image" content="${e(SITE)}/brand/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/fonts/readex-pro-arabic-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css?v=${ASSET_V}">
<script type="application/ld+json">${json(ld)}</script>
</head>
<body>
<a class="skip" href="#main">تخطّى للمحتوى</a>
<header class="topbar">
  <div class="wrap topbar-in">
    ${brand(s)}
    <nav class="nav" aria-label="القائمة الرئيسية">${NAV.map(([h, l]) => `<a href="${h}"${h === path ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <div class="top-actions">
      <button type="button" class="cart-btn" data-cart-open aria-label="طلبيتي">${icon('bag')}<span class="count" data-cart-count hidden>0</span></button>
      <a class="btn btn-gold btn-sm hide-sm" href="${waHello}" data-lead='{"type":"inquiry","ref":"header"}' target="_blank" rel="noopener">${icon('whatsapp')} واتساب</a>
      <button type="button" class="menu-btn" data-menu aria-label="القائمة" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
  <nav class="mnav" data-mnav hidden aria-label="القائمة">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav>
</header>

<main id="main">${body}</main>

<footer class="footer">
  <div class="wrap footer-in">
    <div class="footer-brand">${brand(s)}<p>${e(s.tagline)}</p></div>
    <ul class="footer-info">
      ${(s.phones || []).map(p => `<li><a href="tel:${tel(p)}" dir="ltr">${e(p)}</a></li>`).join('')}
      <li>${e(s.address)}</li>
    </ul>
    <div class="footer-social">
      ${s.facebook ? `<a href="${safeUrl(s.facebook)}" target="_blank" rel="noopener" aria-label="فيسبوك">${icon('facebook')}</a>` : ''}
      ${s.instagram ? `<a href="${safeUrl(s.instagram)}" target="_blank" rel="noopener" aria-label="إنستغرام">${icon('instagram')}</a>` : ''}
      ${s.tiktok ? `<a href="${safeUrl(s.tiktok)}" target="_blank" rel="noopener" aria-label="تيك توك">${icon('tiktok')}</a>` : ''}
      <a href="https://wa.me/${e(s.whatsapp)}" target="_blank" rel="noopener" aria-label="واتساب">${icon('whatsapp')}</a>
    </div>
  </div>
  <div class="wrap footer-bottom">© ${new Date().getFullYear()} ${e(s.nameAr)}</div>
</footer>

<div class="dock" data-dock>
  <button type="button" class="dock-cart" data-cart-open>${icon('bag')} طلبيتي <span class="count" data-cart-count hidden>0</span></button>
  <a class="dock-wa" href="${waHello}" data-lead='{"type":"inquiry","ref":"dock"}' target="_blank" rel="noopener">${icon('whatsapp')} واتساب</a>
</div>

<div class="sheet" data-cart hidden>
  <div class="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <header class="sheet-head"><h2 id="cart-title">طلبيتي</h2><button type="button" class="icon-btn" data-cart-close aria-label="إغلاق">${icon('x')}</button></header>
    <div class="sheet-body">
      <div class="cart-empty" data-cart-empty>
        <p>ما زدت حتى صنف.</p>
        <a href="/menu" class="btn btn-outline">افتح المنيو</a>
      </div>
      <ul class="cart-lines" data-cart-lines></ul>
      <form class="cart-form" data-cart-form hidden novalidate>
        <h3>بيانات الطلب</h3>
        <div class="fields">
          <label class="f"><span>الاسم</span><input id="c-name" name="name" required autocomplete="name"></label>
          <label class="f"><span>رقم الهاتف</span><input id="c-phone" name="phone" inputmode="tel" autocomplete="tel" dir="ltr"></label>
          <label class="f"><span>تاريخ المناسبة</span><input id="c-date" name="eventDate" type="date" required></label>
          <label class="f"><span>عدد الضيوف</span><input id="c-guests" name="guests" inputmode="numeric"></label>
          <label class="f f-full"><span>الاستلام</span><select id="c-delivery" name="delivery"><option>توصيل</option><option>استلام من المطبخ</option></select></label>
          <label class="f f-full"><span>ملاحظات</span><textarea id="c-notes" name="notes" rows="2"></textarea></label>
        </div>
      </form>
    </div>
    <footer class="sheet-foot" data-cart-foot hidden>
      <div class="cart-total"><span>المجموع</span><b data-cart-total>0</b></div>
      ${s.orderNotes ? `<p class="cart-note">${e(s.orderNotes)}</p>` : ''}
      <button type="button" class="btn btn-wa btn-block btn-lg" data-cart-send>${icon('whatsapp')} إرسال الطلب على واتساب</button>
    </footer>
  </div>
</div>

<div class="modal" data-modal hidden><div class="modal-card" role="dialog" aria-modal="true"><button type="button" class="icon-btn modal-x" data-modal-close aria-label="إغلاق">${icon('x')}</button><div data-modal-body></div></div></div>
<div class="toast" data-toast role="status" aria-live="polite"></div>

<script id="moka-data" type="application/json">${json({ wa: s.whatsapp, currency: s.currency, name: s.shortName, items })}</script>
<script src="/js/site.js?v=${ASSET_V}" defer></script>
</body>
</html>`;
}

// ——— الرئيسية ———
function home(db) {
  const s = db.settings;
  const items = vis(db.items);
  const featured = items.filter(i => i.featured);
  // العناصر الحقيقية قبل الأماكن الفاضية
  const show = [...(featured.length ? featured : items)].sort((a, b) => !!a.demo - !!b.demo).slice(0, 3);
  const pkgs = vis(db.packages);
  const tastes = upcoming(db);
  const gal = vis(db.gallery).slice(0, 6);
  const phone = (s.phones || [])[0];

  const body = `
<section class="hero">
  <div class="hero-bg">${s.heroImage ? `<img src="${e(s.heroImage)}" alt="" fetchpriority="high">` : ''}</div>
  <div class="wrap hero-in">
    <div class="hero-text">
      <p class="eyebrow"><span class="rule"></span>${e(s.heroKicker || 'مطبخ موكا · طرابلس')}</p>
      <h1>${s.heroTitle ? nl(s.heroTitle) : e(s.nameAr)}</h1>
      <p class="hero-lead">${e(s.heroSubtitle || s.tagline)}</p>
      ${s.intro ? `<p class="hero-intro">${e(s.intro)}</p>` : ''}
      <div class="actions">
        <a class="btn btn-gold btn-lg" href="${wa(s, 'السلام عليكم، نبي ندير طلبية')}" data-lead='{"type":"inquiry","ref":"hero"}' target="_blank" rel="noopener">${icon('whatsapp')} اطلب على واتساب</a>
        <a class="btn btn-ghost btn-lg" href="/menu">تصفّح المنيو ${icon('arrow')}</a>
      </div>
      ${(s.stats || []).length ? `<dl class="stats">${s.stats.map(x => `<div><dt dir="ltr">${e(x.value)}</dt><dd>${e(x.label)}</dd></div>`).join('')}</dl>` : ''}
    </div>
    ${tastes[0] ? (() => { const t = tastes[0], dp = dateParts(t.date); return `
    <a class="next${t.demo ? ' is-demo' : ''}" href="#tasting">
      <span class="next-label">${icon('sparkle')} أقرب موعد تذوّق</span>
      <span class="next-date">${dp ? `<b>${dp.d}</b> ${dp.month}` : '<b>--</b> التاريخ'}</span>
      <span class="next-day">${dp ? `${dp.day}${t.timeFrom ? ' · ' + time12(t.timeFrom) : ''}` : 'اليوم · الساعة'}</span>
      <span class="next-go">احجز مقعدك ${icon('arrow')}</span>
    </a>`; })() : ''}
  </div>
</section>


${show.length ? `<section class="sec" id="menu">
  <div class="wrap">
    ${head('الأكثر طلبًا', 'أصناف تخلّي الضيوف يسألوا: منين جبتوها؟', 'اختار وزيد للطلبية، وفي الآخر نبعثوها مع بعض على واتساب.', `<a class="link" href="/menu">المنيو كامل ${icon('arrow')}</a>`)}
    <div class="grid grid-3">${show.map(i => dishCard(s, i)).join('')}</div>
  </div>
</section>` : ''}

${pkgs.length ? `<section class="sec sec-alt" id="packages">
  <div class="wrap">
    ${head('الباقات', 'باقات جاهزة لكل حجم مناسبة', 'تقدر تعدّل على أي باقة حسب ذوقك وعدد ضيوفك.')}
    <div class="grid grid-3">${pkgs.map(p => packageCard(s, p)).join('')}</div>
  </div>
</section>` : ''}

${tastes.length ? `<section class="sec" id="tasting">
  <div class="wrap">
    ${head('مواعيد التذوّق', 'ذوق قبل ما تقرر', 'نفتحوا مطبخنا في مواعيد محددة تذوقوا فيها أصنافنا. المقاعد محدودة.')}
    <div class="stack">${tastes.slice(0, 3).map(t => tastingCard(s, t)).join('')}</div>
  </div>
</section>` : ''}

<section class="sec sec-alt steps">
  <div class="wrap">
    ${head('كيف تطلب', 'ثلاث خطوات وسفرتك جاهزة')}
    <ol class="step-grid">
      <li><span class="step-n">1</span><h3>اختار أصنافك</h3><p>تصفّح المنيو أو الباقات وزيد اللي يعجبك لطلبيتك.</p></li>
      <li><span class="step-n">2</span><h3>ابعثها على واتساب</h3><p>رسالة جاهزة فيها الأصناف والكميات وتاريخ المناسبة.</p></li>
      <li><span class="step-n">3</span><h3>نأكدوا ونجهّزوا</h3><p>نتواصلوا معاك، نأكدوا التفاصيل، ونجهّزوا في الموعد.</p></li>
    </ol>
  </div>
</section>

${gal.length ? `<section class="sec" id="gallery">
  <div class="wrap">
    ${head('من أعمالنا', 'شغل يتصوّر قبل ما يتاكل')}
    <div class="gallery">${gal.map(galleryTile).join('')}</div>
  </div>
</section>` : ''}

${band(s)}
${contactSection(s)}`;
  return layout(db, { path: '/', body });
}

function band(s) {
  return `
<section class="band">
  <div class="wrap band-in">
    <div><h2>عندك مناسبة قريبة؟</h2><p>ابعثلنا التاريخ وعدد الضيوف، ونردّوا عليك بأقرب وقت بمنيو وسعر يناسبك.</p></div>
    <a class="btn btn-gold btn-lg" href="${wa(s, 'السلام عليكم، عندي مناسبة ونبي نعرف التفاصيل')}" data-lead='{"type":"inquiry","ref":"band"}' target="_blank" rel="noopener">${icon('whatsapp')} كلّمنا على واتساب</a>
  </div>
</section>`;
}

function contactSection(s) {
  return `
<section class="sec contact" id="contact">
  <div class="wrap contact-in">
    <div>
      <h2>تواصل معنا</h2>
      <dl class="info">
        <div><dt>${icon('pin')} العنوان</dt><dd>${e(s.address)}</dd></div>
        ${(s.phones || []).length ? `<div><dt>${icon('phone')} الهاتف</dt><dd>${s.phones.map(p => `<a href="tel:${tel(p)}" dir="ltr">${e(p)}</a>`).join('<br>')}</dd></div>` : ''}
        ${(s.hours || []).map(h => `<div><dt>${icon('clock')} ${e(h.label)}</dt><dd>${e(h.value)}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="contact-actions">
      <a class="btn btn-gold btn-lg btn-block" href="https://wa.me/${e(s.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp')} راسلنا على واتساب</a>
      ${s.mapUrl ? `<a class="btn btn-outline btn-lg btn-block" href="${safeUrl(s.mapUrl)}" target="_blank" rel="noopener">${icon('pin')} افتح الموقع على الخريطة</a>` : ''}
      ${s.facebook ? `<a class="btn btn-ghost btn-block" href="${safeUrl(s.facebook)}" target="_blank" rel="noopener">${icon('facebook')} صفحتنا على فيسبوك</a>` : ''}
    </div>
  </div>
</section>`;
}

// ——— المنيو ———
function menu(db) {
  const s = db.settings;
  const cats = vis(db.categories);
  const items = vis(db.items);
  const other = items.filter(i => !cats.some(c => c.id === i.categoryId));
  const groups = [...cats.map(c => ({ c, list: items.filter(i => i.categoryId === c.id) })), ...(other.length ? [{ c: { id: 'other', name: 'أصناف أخرى' }, list: other }] : [])].filter(g => g.list.length);
  const body = `
<section class="page-head">
  <div class="wrap">
    <h1>المنيو</h1>
    <div class="menu-tools">
      ${groups.length > 1 ? `<div class="tabs" role="tablist" aria-label="الأقسام">
        <button type="button" class="tab is-on" data-filter="all">الكل</button>
        ${groups.map(g => `<button type="button" class="tab" data-filter="${e(g.c.id)}">${e(g.c.name)}</button>`).join('')}
      </div>` : ''}
      <label class="search">${icon('search')}<input id="menu-search" type="search" placeholder="بحث في المنيو" data-search-input aria-label="بحث في المنيو"></label>
    </div>
  </div>
</section>
<section class="sec sec-top">
  <div class="wrap">
    ${groups.map(g => `
    <div class="menu-group" id="${e(g.c.id)}" data-group="${e(g.c.id)}">
      <h2 class="group-title${g.c.demo ? ' is-demo-text' : ''}">${e(g.c.name)}</h2>
      ${g.c.description ? `<p class="muted group-desc">${e(g.c.description)}</p>` : ''}
      <div class="grid grid-3">${g.list.map(i => dishCard(s, i)).join('')}</div>
    </div>`).join('')}
    <p class="empty-note" data-no-results hidden>ما فيش نتائج.</p>
  </div>
</section>`;
  return layout(db, { title: 'المنيو', path: '/menu', body });
}

function notFound(db) {
  const body = `<section class="sec"><div class="wrap center-box"><h1>الصفحة مش موجودة</h1><a class="btn btn-dark" href="/">الرئيسية</a></div></section>`;
  return layout(db, { title: 'غير موجودة', path: '', body });
}

module.exports = { layout, home, menu, notFound, e, setAssetVersion: (v) => { ASSET_V = v; } };
