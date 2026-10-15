// شعار موكا — إعادة رسم متجهية للشعار الأصلي (الخط الهندسي الذهبي)
// منطقة الرسم: viewBox="70 66 984 970"
const PATHS = [
  'M120 205L205 118Q222 98 240 78Q232 98 212 124L212 655L100 778Q88 790 82 780L120 735Z',
  'M212 405L322 600L322 745L282 790L212 655Z',
  'M322 335L525 125Q535 115 552 115L985 115Q1012 105 1040 82Q1030 102 960 172Q925 210 890 210L455 210Q412 210 412 255L412 640L282 790L322 745Z',
  'M478 610L572 512L572 755L470 872Q456 886 458 868L478 845Z',
  'M572 512L596 488L596 740L572 765Z',
  'M686 396L700 384Q710 372 716 356Q698 380 692 405Q696 470 740 560L740 790L722 790L686 690Z',
  'M596 488L686 396L686 850L520 1022Q506 1034 510 1016L596 935Z',
  'M740 500L940 300Q950 292 960 282Q944 300 942 322L942 560L722 790L740 765Z',
];
const LINES = ['M838 402L838 667'];
const VIEWBOX = '70 66 984 970';

let uid = 0;
/**
 * variant: 'gold' (ذهبي بحدود بنية) | 'mono' (لون واحد مع فواصل بلون الخلفية)
 */
function markSvg({ variant = 'gold', color = '#1B130D', gap = '#FBF0D6', cls = '', title = 'موكا', standalone = false } = {}) {
  const id = 'mg' + (++uid);
  const ns = standalone ? ' xmlns="http://www.w3.org/2000/svg"' : '';
  let defs = '', fill, stroke, sw;
  if (variant === 'gold') {
    defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#F1D27E"/><stop offset=".45" stop-color="#D4A145"/>` +
      `<stop offset=".7" stop-color="#E7C068"/><stop offset="1" stop-color="#A9772A"/></linearGradient></defs>`;
    fill = `url(#${id})`; stroke = '#6E4A12'; sw = 9;
  } else {
    fill = color; stroke = gap; sw = 4;
  }
  const body = PATHS.map(d => `<path d="${d}"/>`).join('') + LINES.map(d => `<path d="${d}" fill="none"/>`).join('');
  return `<svg${ns} viewBox="${VIEWBOX}" class="${cls}" role="img" aria-label="${title}"><title>${title}</title>${defs}` +
    `<g fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round">${body}</g></svg>`;
}

module.exports = { markSvg, PATHS, LINES, VIEWBOX };
