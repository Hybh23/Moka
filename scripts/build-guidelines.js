// يولّد ملف دليل الهوية brand/guidelines.html (يتحوّل لـ PDF بالطباعة من المتصفح، مقاس A4 أفقي)
const fs = require('fs');
const path = require('path');
const { markSvg } = require('../src/mark');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'brand');
fs.mkdirSync(OUT, { recursive: true });
const font = (f) => `url(data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64')}) format('woff2')`;
const img = (f) => `data:image/webp;base64,${fs.readFileSync(path.join(ROOT, 'public/img/seed', f)).toString('base64')}`;

const gold = (cls = '') => markSvg({ cls });
const mono = (c, g, cls = '') => markSvg({ variant: 'mono', color: c, gap: g, cls });

const C = {
  esp: '#1B130D', roast: '#2E2118', gold: '#C9973A', goldL: '#E9C46F', goldD: '#8C6420',
  cream: '#FBF0D6', paper: '#FBF8F2', paprika: '#C4532A', pistachio: '#8C9A3E',
};
function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function cmyk(hex) {
  const [r, g, b] = rgb(hex).map(v => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map(v => Math.round(v * 100));
}

const S = { name: 'شركة موكا للخدمات التموينية', phones: ['094-5313001', '091-3221722'], address: 'طرابلس – طريق الشوك، شارع الصالات (بعد صالة قلوريا على اليمين)' };

const page = (n, title, inner, cls = '') => `
<section class="page ${cls}">
  ${title ? `<header class="ph"><span class="pn">${String(n).padStart(2, '0')}</span><h2>${title}</h2></header>` : ''}
  ${inner}
  <footer class="pf"><span>دليل الهوية البصرية · موكا</span><span dir="ltr">MOKA KITCHEN</span></footer>
</section>`;

const swatch = (name, en, hex, use, dark) => {
  const [r, g, b] = rgb(hex), [c, m, y, k] = cmyk(hex);
  return `<div class="sw"><div class="sw-c" style="background:${hex};color:${dark ? '#fff' : C.esp}"><b>${name}</b><span dir="ltr">${en}</span></div>
    <dl dir="ltr"><div><dt>HEX</dt><dd>${hex}</dd></div><div><dt>RGB</dt><dd>${r} ${g} ${b}</dd></div><div><dt>CMYK</dt><dd>${c} ${m} ${y} ${k}</dd></div></dl>
    <p>${use}</p></div>`;
};

const html = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>دليل هوية موكا</title>
<style>
@font-face{font-family:Readex;src:${font('readex-pro-arabic-300-normal.woff2')};font-weight:300}
@font-face{font-family:Readex;src:${font('readex-pro-arabic-400-normal.woff2')};font-weight:400}
@font-face{font-family:Readex;src:${font('readex-pro-arabic-500-normal.woff2')};font-weight:500}
@font-face{font-family:Readex;src:${font('readex-pro-arabic-600-normal.woff2')};font-weight:600}
@font-face{font-family:Readex;src:${font('readex-pro-latin-400-normal.woff2')};font-weight:400;unicode-range:U+0000-00FF}
@font-face{font-family:Readex;src:${font('readex-pro-latin-500-normal.woff2')};font-weight:500;unicode-range:U+0000-00FF}
@font-face{font-family:Jost;src:${font('jost-latin-300-normal.woff2')};font-weight:300}
@font-face{font-family:Jost;src:${font('jost-latin-500-normal.woff2')};font-weight:500}
@page{size:297mm 210mm;margin:0}
:root{--esp:${C.esp};--roast:${C.roast};--gold:${C.gold};--goldL:${C.goldL};--goldD:${C.goldD};--cream:${C.cream};--paper:${C.paper};--ink2:#6A5D51;--line:#E6DCCB}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#888}
body{font-family:Readex,sans-serif;color:var(--esp);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:297mm;height:210mm;overflow:hidden;background:var(--paper);padding:18mm 20mm 16mm;page-break-after:always;break-after:page;display:flex;flex-direction:column}
@media screen{.page{margin:10mm auto;box-shadow:0 4px 30px rgba(0,0,0,.25)}}
.ph{display:flex;align-items:baseline;gap:6mm;margin-bottom:9mm}
.pn{font-family:Jost;font-weight:300;font-size:11pt;color:var(--gold);letter-spacing:.1em}
.ph h2{font-weight:500;font-size:22pt}
.pf{position:absolute;inset:auto 20mm 9mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#9A8C7E}
.pf span[dir=ltr]{font-family:Jost;letter-spacing:.3em}
.lead{font-size:11pt;line-height:1.9;color:var(--ink2);max-width:150mm}
.en{font-family:Jost;font-weight:300;letter-spacing:.32em;direction:ltr}
.grow{flex:1;min-height:0}

/* الغلاف */
.cover{background:var(--esp);color:var(--cream);justify-content:center;align-items:center;text-align:center}
.cover svg{width:62mm;height:62mm;margin-bottom:10mm}
.cover h1{font-weight:600;font-size:30pt;margin-bottom:2mm}
.cover .en{font-size:11pt;color:var(--goldL)}
.cover .sub{margin-top:16mm;font-size:12pt;color:rgba(251,240,214,.7)}
.cover .pf{color:rgba(251,240,214,.35)}
.cover::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(135deg,transparent 0 14mm,rgba(201,151,58,.05) 14mm 14.4mm)}

/* الشعار */
.logo-main{display:grid;grid-template-columns:1.1fr 1fr;gap:14mm;align-items:center}
.logo-tile{aspect-ratio:1.25;background:var(--cream);border-radius:3mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7mm}
.logo-tile svg{width:44%}
.logo-tile .en{font-size:13pt;color:#6B5A45}
.facts{display:grid;gap:5mm;margin-top:8mm}
.facts div{display:grid;grid-template-columns:32mm 1fr;gap:4mm;padding-bottom:5mm;border-bottom:.3mm solid var(--line);font-size:10pt;line-height:1.8}
.facts dt{color:var(--gold);font-weight:500}
.facts dd{color:var(--ink2)}

.variants{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.var{display:flex;flex-direction:column;gap:3mm}
.var .box{aspect-ratio:1;border-radius:2.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4mm;border:.3mm solid transparent}
.var .box svg{width:50%}
.var .box .en{font-size:7.5pt}
.var b{font-size:9.5pt;font-weight:500}
.var span{font-size:8pt;color:var(--ink2);line-height:1.6}
.row2{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm;margin-top:7mm}
.avatar{aspect-ratio:1;border-radius:50%;background:var(--cream);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.5mm;border:.3mm solid #E2C98F}
.avatar svg{width:42%}
.avatar .en{font-size:6pt;color:#6B5A45}
.appicon{aspect-ratio:1;border-radius:22%;background:var(--esp);display:grid;place-items:center}
.appicon svg{width:62%}

/* المساحة */
.space{display:grid;grid-template-columns:1fr 1fr;gap:14mm;align-items:start}
.cs{position:relative;aspect-ratio:1.2;background:var(--cream);border-radius:3mm;display:grid;place-items:center}
.cs .area{position:relative;width:52%;aspect-ratio:1;outline:.4mm dashed var(--gold);outline-offset:9mm;display:grid;place-items:center}
.cs .area svg{width:100%}
.cs .x{position:absolute;font-family:Jost;font-weight:500;font-size:10pt;color:var(--goldD)}
.minsz{display:flex;align-items:flex-end;gap:10mm;margin-top:6mm}
.minsz div{display:flex;flex-direction:column;align-items:center;gap:2mm;font-size:8.5pt;color:var(--ink2)}
.minsz svg{display:block}

/* ممنوع */
.donts{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}
.dn{display:flex;flex-direction:column;gap:2.5mm}
.dn .box{position:relative;aspect-ratio:1.6;border-radius:2.5mm;background:var(--cream);display:grid;place-items:center;overflow:hidden}
.dn .box svg{width:32%}
.dn .box::after{content:"";position:absolute;top:3mm;left:3mm;width:6mm;height:6mm;border-radius:50%;background:#C0392B url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M7 7l10 10M17 7L7 17'/%3E%3C/svg%3E") center/60% no-repeat}
.dn b{font-size:9.5pt;font-weight:500}

/* الألوان */
.colors{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.sw{display:flex;flex-direction:column;gap:2.5mm}
.sw-c{height:34mm;border-radius:2.5mm;padding:4mm;display:flex;flex-direction:column;justify-content:flex-end;border:.3mm solid rgba(0,0,0,.06)}
.sw-c b{font-weight:500;font-size:11pt}
.sw-c span{font-family:Jost;font-size:8pt;opacity:.75;text-align:right}
.sw dl{display:grid;gap:.6mm;font-family:Jost;font-weight:500;font-size:7.5pt}
.sw dl div{display:flex;justify-content:space-between;border-bottom:.2mm solid var(--line);padding-bottom:.6mm}
.sw dt{color:#9A8C7E}
.sw p{font-size:8pt;color:var(--ink2);line-height:1.6}
.accents{display:grid;grid-template-columns:1fr 1fr 2fr;gap:5mm;margin-top:7mm;align-items:start}
.ratio-wrap b{display:block;font-size:9.5pt;font-weight:500;margin-bottom:3mm}
.ratio{display:flex;height:12mm;border-radius:2mm;overflow:hidden;border:.3mm solid var(--line)}
.ratio i{display:flex;align-items:center;justify-content:center;font-style:normal;font-family:Jost;font-size:7.5pt}
.ratio-wrap p{font-size:8pt;color:var(--ink2);margin-top:2.5mm;line-height:1.6}

/* الخطوط */
.type{display:grid;grid-template-columns:1.5fr 1fr;gap:12mm}
.tcard{border-top:.4mm solid var(--esp);padding-top:5mm}
.tcard .lbl{display:flex;justify-content:space-between;font-size:9pt;color:var(--ink2);margin-bottom:5mm}
.big{font-size:44pt;font-weight:600;line-height:1.3}
.weights{display:grid;gap:2mm;margin-top:6mm}
.weights p{font-size:15pt}
.weights small{font-size:8pt;color:#9A8C7E;margin-inline-start:3mm;font-family:Jost}
.abc{margin-top:6mm;font-size:12pt;line-height:2;color:var(--ink2);letter-spacing:.06em}
.latin-big{white-space:nowrap;font-family:Jost;font-weight:300;font-size:19pt;letter-spacing:.32em;direction:ltr;text-align:right;margin-top:2mm}
.scale{display:grid;gap:3.5mm;margin-top:8mm}
.scale div{display:flex;align-items:baseline;justify-content:space-between;gap:4mm;border-bottom:.2mm solid var(--line);padding-bottom:2mm}
.scale small{font-family:Jost;font-size:7.5pt;color:#9A8C7E;white-space:nowrap}

/* العناصر */
.elements{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}
.el{display:flex;flex-direction:column;gap:3mm}
.el .box{aspect-ratio:1.3;border-radius:2.5mm;overflow:hidden;position:relative}
.el b{font-size:9.5pt;font-weight:500}
.el span{font-size:8pt;color:var(--ink2);line-height:1.6}
.pat1{background:var(--esp) repeating-linear-gradient(135deg,transparent 0 6mm,rgba(201,151,58,.35) 6mm 6.4mm)}
.pat2{background:linear-gradient(135deg,var(--cream) 55%,var(--gold) 55% 57%,var(--esp) 57%)}
.photo img{width:100%;height:100%;object-fit:cover}

/* التطبيقات */
.apps{display:grid;grid-template-columns:1.25fr 1fr .7fr;gap:7mm;align-items:start}
.cards{display:grid;gap:5mm}
.bc{width:85mm;height:55mm;border-radius:2mm;box-shadow:0 1mm 4mm rgba(0,0,0,.12);position:relative;overflow:hidden}
.bc-front{background:var(--esp);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3mm}
.bc-front svg{width:20mm}
.bc-front .en{font-size:6.5pt;color:var(--goldL)}
.bc-back{background:var(--cream);padding:6mm 7mm;display:flex;flex-direction:column;justify-content:space-between}
.bc-back b{font-size:10pt;font-weight:600}
.bc-back .t{font-size:7pt;color:var(--ink2);line-height:1.8}
.bc-back .ph2{font-family:Jost;font-weight:500;font-size:8pt;direction:ltr;text-align:right;line-height:1.7}
.bc-back svg{position:absolute;left:6mm;bottom:6mm;width:11mm}
.post{position:relative;aspect-ratio:1;border-radius:2mm;overflow:hidden;box-shadow:0 1mm 4mm rgba(0,0,0,.12)}
.post img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.post .ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(27,19,13,.92),transparent 55%)}
.post .mk{position:absolute;top:4mm;right:4mm;width:11mm}
.post .tx{position:absolute;inset:auto 5mm 5mm;color:var(--cream)}
.post .tx b{display:block;font-size:13pt;font-weight:500;line-height:1.4}
.post .tx span{font-size:7.5pt;color:var(--goldL)}
.story{position:relative;aspect-ratio:9/16;border-radius:2mm;overflow:hidden;background:var(--esp);box-shadow:0 1mm 4mm rgba(0,0,0,.12)}
.story img{position:absolute;inset:0;width:100%;height:62%;object-fit:cover}
.story .bot{position:absolute;inset:auto 0 0;height:42%;background:var(--esp);padding:5mm 4mm;color:var(--cream);clip-path:polygon(0 12%,100% 0,100% 100%,0 100%);display:flex;flex-direction:column;justify-content:flex-end;gap:1.5mm}
.story .bot svg{width:9mm}
.story .bot b{font-size:10pt;font-weight:500}
.story .bot span{font-size:6.5pt;color:var(--goldL)}
.cap{font-size:8pt;color:var(--ink2);margin-top:2.5mm}
.sticker{display:flex;gap:6mm;margin-top:6mm}
.stk{width:30mm;height:30mm;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5mm;box-shadow:0 1mm 3mm rgba(0,0,0,.12)}
.stk svg{width:46%}
.stk .en{font-size:4.5pt}

.back{background:var(--esp);color:var(--cream);align-items:center;justify-content:center;text-align:center;gap:6mm}
.back svg{width:30mm}
.back p{font-size:10pt;color:rgba(251,240,214,.7);line-height:2}
.back .pf{color:rgba(251,240,214,.35)}
</style></head><body>

<section class="page cover">
  ${gold()}
  <h1>موكا</h1>
  <p class="en">MOKA KITCHEN</p>
  <p class="sub">دليل الهوية البصرية</p>
  <footer class="pf"><span>${S.name}</span><span dir="ltr">BRAND GUIDELINES · 2026</span></footer>
</section>

${page(1, 'الشعار', `
<div class="logo-main grow">
  <div class="logo-tile">${gold()}<span class="en">MOKA KITCHEN</span></div>
  <div>
    <p class="lead">الشعار هو كلمة «موكا» مكتوبة بخط هندسي مائل: ضربات ذهبية متوازية بزاوية 45 درجة، بحدود بنية رفيعة. وتحته الاسم اللاتيني <span dir="ltr">MOKA KITCHEN</span> بحروف رفيعة متباعدة.</p>
    <dl class="facts">
      <div><dt>المصدر</dt><dd>الشعار الحالي للشركة، أُعيد رسمه كملف متجه (SVG) بدون أي تغيير في شكله، باش يطلع حاد في كل المقاسات من أيقونة صغيرة للافتة المحل.</dd></div>
      <div><dt>العلامة</dt><dd>الضربات الذهبية وحدها، تُستخدم في الأماكن الصغيرة: الأيقونات، صورة البروفايل، الملصقات.</dd></div>
      <div><dt>الشعار الكامل</dt><dd>العلامة مع <span dir="ltr">MOKA KITCHEN</span>، يُستخدم في الواجهات والمطبوعات والغلاف.</dd></div>
    </dl>
  </div>
</div>`)}

${page(2, 'نسخ الشعار', `
<div class="variants">
  <div class="var"><div class="box" style="background:${C.cream}">${gold()}<span class="en" style="color:#6B5A45">MOKA KITCHEN</span></div><b>الأساسي</b><span>ذهبي على كريمي. النسخة الأولى في كل استخدام.</span></div>
  <div class="var"><div class="box" style="background:${C.esp}">${gold()}<span class="en" style="color:#E9D9B5">MOKA KITCHEN</span></div><b>على الداكن</b><span>ذهبي على إسبريسو. للخلفيات الداكنة والصور.</span></div>
  <div class="var"><div class="box" style="background:#fff;border-color:${'#E6DCCB'}">${mono(C.esp, '#fff')}<span class="en" style="color:${C.esp}">MOKA KITCHEN</span></div><b>لون واحد داكن</b><span>للطباعة بلون واحد، الختم، الفاكس، الحفر.</span></div>
  <div class="var"><div class="box" style="background:${C.gold}">${mono(C.cream, C.gold)}<span class="en" style="color:${C.cream}">MOKA KITCHEN</span></div><b>لون واحد فاتح</b><span>على الذهبي أو أي خلفية ملوّنة من الدليل.</span></div>
</div>
<div class="row2">
  <div class="var"><div class="avatar">${gold()}<span class="en">MOKA KITCHEN</span></div><b>صورة البروفايل</b><span>فيسبوك، إنستغرام، واتساب.</span></div>
  <div class="var"><div class="appicon">${gold()}</div><b>أيقونة</b><span>أيقونة الموقع والتطبيقات.</span></div>
  <div class="var" style="grid-column:span 2;justify-content:center"><p class="lead" style="font-size:9.5pt">كل النسخ مرفقة كملفات جاهزة: ملفات متجهة للتصميم والطباعة، وصور للاستخدام السريع على السوشيال والموقع.</p></div>
</div>`)}

${page(3, 'المساحة الآمنة والحجم الأدنى', `
<div class="space grow">
  <div class="cs"><div class="area">${gold()}</div></div>
  <div>
    <p class="lead">اترك حول الشعار فراغ يساوي على الأقل عرض الضربة الطويلة في العلامة (x). ما يدخلش في المساحة هذي نص ولا صورة ولا حافة الورقة.</p>
    <dl class="facts">
      <div><dt>المساحة الآمنة</dt><dd>x من كل الجهات، حيث x = عرض الضربة العمودية الأولى.</dd></div>
      <div><dt>أصغر مقاس</dt><dd>العلامة: 24 بكسل على الشاشة، 10 ملم في الطباعة. الشعار الكامل: 80 بكسل، 25 ملم.</dd></div>
    </dl>
    <div class="minsz">
      <div>${gold('').replace('<svg', '<svg style="width:10mm;height:10mm"')}<span>10 ملم</span></div>
      <div>${gold('').replace('<svg', '<svg style="width:18mm;height:18mm"')}<span>18 ملم</span></div>
      <div>${gold('').replace('<svg', '<svg style="width:28mm;height:28mm"')}<span>28 ملم</span></div>
    </div>
  </div>
</div>`)}

${page(4, 'استخدامات ممنوعة', `
<div class="donts">
  <div class="dn"><div class="box">${gold().replace('<svg', '<svg style="transform:scaleX(1.6)"')}</div><b>لا تمطّ الشعار ولا تضغطه</b></div>
  <div class="dn"><div class="box">${gold().replace('<svg', '<svg style="transform:rotate(-18deg)"')}</div><b>لا تديره</b></div>
  <div class="dn"><div class="box">${mono('#2F6FD6', C.cream)}</div><b>لا تغيّر ألوانه لألوان خارج الدليل</b></div>
  <div class="dn"><div class="box">${gold().replace('<svg', '<svg style="filter:drop-shadow(2mm 2mm 1.5mm rgba(0,0,0,.6))"')}</div><b>لا تضيف ظلال أو تأثيرات</b></div>
  <div class="dn"><div class="box" style="background:url(${img('platter-2.webp')}) center/cover">${gold()}</div><b>لا تحطه على صورة مزحومة بدون خلفية</b></div>
  <div class="dn"><div class="box" style="background:${C.goldL}">${gold()}</div><b>لا تحط الذهبي على خلفية قريبة منه</b></div>
</div>`)}

${page(5, 'الألوان', `
<div class="colors">
  ${swatch('إسبريسو', 'Espresso', C.esp, 'اللون الأساسي الداكن: النصوص، الخلفيات الداكنة، الأزرار.', true)}
  ${swatch('ذهب موكا', 'Moka Gold', C.gold, 'لون الشعار. للتفاصيل والعناوين الصغيرة والإطارات، بكميات قليلة.', true)}
  ${swatch('كريمي', 'Cream', C.cream, 'خلفية الشعار. للأقسام الدافئة والمطبوعات.')}
  ${swatch('ورقي', 'Paper', C.paper, 'خلفية الصفحات والموقع.')}
</div>
<div class="accents">
  ${swatch('فلفل أحمر', 'Paprika', C.paprika, 'لمسة تفتح الشهية: وسوم "حار"، العروض. بكميات قليلة جدًا.', true)}
  ${swatch('فستق', 'Pistachio', C.pistachio, 'لمسة طبيعية: "نباتي"، الطازج.', true)}
  <div class="ratio-wrap">
    <b>نسب الاستخدام</b>
    <div class="ratio"><i style="flex:40;background:${C.paper}">40%</i><i style="flex:30;background:${C.esp};color:#fff">30%</i><i style="flex:18;background:${C.cream}">18%</i><i style="flex:8;background:${C.gold};color:#fff">8%</i><i style="flex:4;background:${C.paprika}"></i></div>
    <p>الخلفيات فاتحة وهادية، الإسبريسو للنص والهيبة، الذهبي لمسة مش أساس. الفلفل والفستق مأخوذين من ألوان الأكل نفسه، وما يُستخدموش كخلفيات كبيرة.</p>
    <p style="margin-top:2mm;font-size:7pt">قيم CMYK تقريبية. للطباعة يُفضّل مطابقتها مع المطبعة على عيّنة.</p>
  </div>
</div>`)}

${page(6, 'الخطوط', `
<div class="type grow">
  <div class="tcard">
    <div class="lbl"><span>الخط العربي</span><span dir="ltr" style="font-family:Jost">Readex Pro</span></div>
    <p class="big">شركة موكا للخدمات التموينية</p>
    <div class="weights">
      <p style="font-weight:300">نقوم بتلبية جميع الطلبيات<small>Light 300</small></p>
      <p style="font-weight:400">نقوم بتلبية جميع الطلبيات<small>Regular 400</small></p>
      <p style="font-weight:500">نقوم بتلبية جميع الطلبيات<small>Medium 500</small></p>
      <p style="font-weight:600">نقوم بتلبية جميع الطلبيات<small>SemiBold 600</small></p>
    </div>
    <p class="abc">أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي — 0123456789</p>
  </div>
  <div>
    <div class="tcard">
      <div class="lbl"><span>الخط اللاتيني</span><span dir="ltr" style="font-family:Jost">Jost Light</span></div>
      <p class="latin-big">MOKA KITCHEN</p>
      <p class="lead" style="font-size:9pt;margin-top:4mm">للاسم اللاتيني فقط، بحروف كبيرة ومسافات واسعة بين الحروف، زي ما هو في الشعار.</p>
    </div>
    <div class="tcard" style="margin-top:8mm">
      <div class="lbl"><span>تدرّج الأحجام</span><span></span></div>
      <div class="scale">
        <div><span style="font-size:20pt;font-weight:600">عنوان رئيسي</span><small>SemiBold · 40–52px</small></div>
        <div><span style="font-size:14pt;font-weight:500">عنوان قسم</span><small>Medium · 24–30px</small></div>
        <div><span style="font-size:10.5pt;font-weight:400">نص عادي للقراءة</span><small>Regular · 16px</small></div>
        <div><span style="font-size:8.5pt;font-weight:400;color:#6A5D51">نص مساعد</span><small>Regular · 13–14px</small></div>
      </div>
    </div>
  </div>
</div>
<p class="lead" style="font-size:8.5pt">الخطين مجانيين للاستخدام التجاري (رخصة SIL Open Font License).</p>`)}

${page(7, 'العناصر المساعدة', `
<div class="elements">
  <div class="el"><div class="box pat1"></div><b>الخطوط المائلة</b><span>مأخوذة من زاوية 45° في ضربات الشعار. تُستخدم كخلفية خفيفة على الداكن.</span></div>
  <div class="el"><div class="box pat2"></div><b>القَطع المائل</b><span>نفس الزاوية لتقسيم المساحات في المنشورات والمطبوعات.</span></div>
  <div class="el"><div class="box photo"><img src="${img('platter-1.webp')}" alt=""></div><b>التصوير</b><span>الأكل هو البطل: لقطة قريبة، إضاءة طبيعية، خلفية هادية، بدون فلاتر قوية.</span></div>
</div>`)}

${page(8, 'التطبيقات', `
<div class="apps">
  <div class="cards">
    <div class="bc bc-front">${gold()}<span class="en">MOKA KITCHEN</span></div>
    <div class="bc bc-back">
      <div><b>${S.name}</b><p class="t">${S.address}</p></div>
      <div class="ph2">${S.phones.join('<br>')}</div>
      ${gold()}
    </div>
    <p class="cap">بطاقة العمل · 85 × 55 ملم</p>
  </div>
  <div>
    <div class="post"><img src="${img('platter-2.webp')}" alt=""><div class="ov"></div><div class="mk">${gold()}</div><div class="tx"><span>من مطبخ موكا</span><b>اسم الصنف</b></div></div>
    <p class="cap">منشور مربّع · 1080 × 1080</p>
    <div class="sticker">
      <div class="stk" style="background:${C.cream}">${gold()}<span class="en" style="color:#6B5A45">MOKA KITCHEN</span></div>
      <div class="stk" style="background:${C.esp}">${gold()}<span class="en" style="color:#E9D9B5">MOKA KITCHEN</span></div>
    </div>
    <p class="cap">ملصق علب الطلبيات · قطر 50 ملم</p>
  </div>
  <div>
    <div class="story"><img src="${img('platter-1.webp')}" alt=""><div class="bot">${gold()}<b>موعد التذوّق</b><span>طرابلس · طريق الشوك</span></div></div>
    <p class="cap">ستوري · 1080 × 1920</p>
  </div>
</div>`)}

<section class="page back">
  ${gold()}
  <p>${S.name}<br>${S.address}<br><span dir="ltr">${S.phones.join(' · ')}</span></p>
  <footer class="pf"><span>دليل الهوية البصرية · موكا</span><span dir="ltr">MOKA KITCHEN</span></footer>
</section>

</body></html>`;

fs.writeFileSync(path.join(OUT, 'guidelines.html'), html);
console.log('brand/guidelines.html');
