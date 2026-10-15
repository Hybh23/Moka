// بيانات البداية
// المعلومات الحقيقية مأخوذة من صفحة الشركة على فيسبوك فقط.
// أي عنصر عليه demo: true هو مكان فاضي للعرض، يتعدّل أو يتحذف من لوحة الإدارة.
module.exports = function seed() {
  let n = 0;
  const id = (p) => `${p}${(++n).toString(36).padStart(3, '0')}`;

  const cats = [
    { id: id('c'), name: 'اسم القسم الأول', description: '', visible: true, demo: true },
    { id: id('c'), name: 'اسم القسم الثاني', description: '', visible: true, demo: true },
  ];
  const item = (c) => ({
    id: id('i'), categoryId: c.id, name: 'اسم الصنف', description: 'وصف الصنف',
    ingredients: ['مكوّن', 'مكوّن', 'مكوّن'], price: null, unit: 'الكمية',
    image: '', tags: [], featured: true, available: true, visible: true, demo: true,
  });

  return {
    settings: {
      nameAr: 'شركة موكا للخدمات التموينية',
      shortName: 'موكا',
      nameEn: 'Moka Kitchen',
      tagline: 'نقوم بتلبية جميع الطلبيات',
      intro: '',
      heroImage: '/img/seed/platter-1.webp',
      currency: 'د.ل',
      whatsapp: '218945313001',
      phones: ['094-5313001', '091-3221722'],
      email: '',
      address: 'طرابلس – طريق الشوك، شارع الصالات (بعد صالة قلوريا على اليمين)',
      mapUrl: 'https://maps.app.goo.gl/eGvrheJK9ticcPZf8',
      facebook: 'https://www.facebook.com/share/1Dg8R1XtEy/',
      instagram: '',
      tiktok: '',
      hours: [{ label: 'مواعيد العمل', value: 'مفتوح دائمًا' }],
      orderNotes: '',
      seoTitle: 'شركة موكا للخدمات التموينية | طرابلس',
      seoDescription: 'شركة موكا للخدمات التموينية في طرابلس، طريق الشوك. نقوم بتلبية جميع الطلبيات.',
    },

    categories: cats,
    items: [item(cats[0]), item(cats[0]), item(cats[0]), item(cats[1]), item(cats[1]), item(cats[1])],

    packages: [1, 2, 3].map(() => ({
      id: id('p'), name: 'اسم الباقة', subtitle: '', guests: 'عدد الضيوف', price: null, priceNote: '',
      includes: ['بند', 'بند', 'بند'], image: '', badge: '', highlight: false, visible: true, demo: true,
    })),

    tastings: [{
      id: id('t'), title: 'موعد التذوّق', date: '', timeFrom: '', timeTo: '',
      location: 'طرابلس – طريق الشوك، شارع الصالات (بعد صالة قلوريا على اليمين)',
      mapUrl: 'https://maps.app.goo.gl/eGvrheJK9ticcPZf8', seats: null, note: '', status: 'open', visible: true, demo: true,
    }],

    gallery: [
      { id: id('g'), image: '/img/seed/platter-1.webp', caption: '', visible: true },
      { id: id('g'), image: '/img/seed/platter-2.webp', caption: '', visible: true },
      ...[1, 2, 3, 4].map(() => ({ id: id('g'), image: '', caption: '', visible: true, demo: true })),
    ],

    leads: [],
  };
};
