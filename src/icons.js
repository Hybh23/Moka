// أيقونات خطية بسيطة (stroke) — currentColor
const P = {
  whatsapp: '<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" /><path d="M9 8.6c.2-.5.5-.6.8-.6h.6c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .5.6 1 1.5 1.9 2.6 2.5.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5v.5c0 .4-.2.7-.6.9-.6.3-1.4.4-2.3.1-2.4-.8-4.4-2.8-5.3-5.2-.3-.9-.3-1.7.1-2.3z" fill="currentColor" stroke="none"/>',
  phone: '<path d="M5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5a2 2 0 0 1 2-2z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.8c1.8.6 3 2.2 3.4 4.7"/>',
  bag: '<path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  arrow: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  star: '<path d="M12 3.8l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z" fill="currentColor"/>',
  leaf: '<path d="M5 19c0-8 5.5-13.5 15-14-0.5 9.5-6 15-14 15"/><path d="M5 19c3-4 6-6.5 10-8.5"/>',
  wheat: '<path d="M12 21V9"/><path d="M12 9c-2.2-.3-3.6-1.8-3.8-4.2C10.4 5 11.8 6.6 12 9zm0 0c2.2-.3 3.6-1.8 3.8-4.2C13.6 5 12.2 6.6 12 9z"/><path d="M12 14c-2.2-.3-3.6-1.8-3.8-4.2 2.2.2 3.6 1.8 3.8 4.2zm0 0c2.2-.3 3.6-1.8 3.8-4.2-2.2.2-3.6 1.8-3.8 4.2z"/><path d="M12 19c-2.2-.3-3.6-1.8-3.8-4.2 2.2.2 3.6 1.8 3.8 4.2zm0 0c2.2-.3 3.6-1.8 3.8-4.2-2.2.2-3.6 1.8-3.8 4.2z"/>',
  pot: '<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2.5 10h19M9 6.5c0-1.5 1-1.5 1-3M13 6.5c0-1.5 1-1.5 1-3"/>',
  cake: '<path d="M4 20.5h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 15.5c2 1.3 4 1.3 5.3 0 1.4 1.3 4 1.3 5.4 0 1.3 1.3 3.3 1.3 5.3 0M12 11.5V8"/><path d="M12 8c-1 0-1.6-.8-1.2-1.8L12 3.5l1.2 2.7c.4 1-.2 1.8-1.2 1.8z"/>',
  sparkle: '<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  facebook: '<path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5v2H8V14h2.5v7H14v-7h2.5l.5-3.5h-3v-1.5c0-.3.2-.5.5-.5z"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>',
  tiktok: '<path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3"/><path d="M14 3.5c.4 2.7 2.2 4.4 5 4.6"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-4.5-4.5-8 8"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
};

const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

module.exports = { icon, ICONS: Object.keys(P) };
