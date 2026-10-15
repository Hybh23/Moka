/* لوحة إدارة موكا — تطبيق صفحة واحدة بدون مكتبات */
(() => {
  const app = document.getElementById('app');
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => n == null ? '—' : Number(n).toLocaleString('en-US');
  const ic = (p) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const I = {
    home: ic('<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>'),
    gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    folder: ic('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    dish: ic('<path d="M3 15h18M5 15a7 7 0 0 1 14 0M12 6v2M2 19h20"/>'),
    gift: ic('<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v7h14v-7M12 8v12M12 8c-2-3-6-3-6 0h6c0-3 4-3 6 0z"/>'),
    cal: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
    img: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M21 16l-5-5-9 9"/>'),
    star: ic('<path d="M12 3.8l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z"/>'),
    help: ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>'),
    inbox: ic('<path d="M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1 3h6l1-3h5"/>'),
    save: ic('<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8V3M7 21v-7h10v7"/>'),
    lock: ic('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    edit: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>'),
    trash: ic('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    up: ic('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    down: ic('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    eye: ic('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeoff: ic('<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.8M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
    x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    out: ic('<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>'),
    ext: ic('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    wa: ic('<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/>'),
    upload: ic('<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>'),
    menu: ic('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
  };

  // ——— الاتصال بالسيرفر ———
  async function api(path, opts = {}) {
    const isForm = opts.body instanceof FormData;
    const res = await fetch('/api' + path, {
      method: opts.method || 'GET',
      headers: { 'x-moka-admin': '1', ...(opts.body && !isForm ? { 'Content-Type': 'application/json' } : {}) },
      body: opts.body ? (isForm ? opts.body : JSON.stringify(opts.body)) : undefined,
      credentials: 'same-origin',
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && !path.startsWith('/admin/login')) { state.authed = false; render(); }
    if (!res.ok) throw new Error(data.error || 'صار خطأ');
    return data;
  }

  let tt;
  function toast(msg, bad = false) {
    const t = $('#toast');
    t.textContent = msg; t.className = 'toast show' + (bad ? ' bad' : '');
    clearTimeout(tt); tt = setTimeout(() => t.className = 'toast', 2600);
  }
  const guard = (fn) => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };

  // ——— تعريف الأقسام ———
  const TAG_PRESETS = ['الأكثر طلبًا', 'جديد', 'حار', 'نباتي', 'عرض خاص', 'موسمي'];
  const ICONS = [['leaf', 'ورقة'], ['wheat', 'قمح / معجنات'], ['pot', 'قِدر / رئيسي'], ['cake', 'كيك / حلو'], ['sparkle', 'لمعة'], ['star', 'نجمة']];
  const COLS = {
    categories: {
      title: 'أقسام المنيو', icon: I.folder, single: 'قسم', hint: 'الأقسام اللي تتقسم عليها الأصناف في المنيو. رتّبها بالأسهم.',
      fields: [
        { k: 'name', l: 'اسم القسم', t: 'text', req: true },
        { k: 'description', l: 'وصف قصير', t: 'textarea', rows: 2 },
        { k: 'icon', l: 'الأيقونة', t: 'select', opts: ICONS },
        { k: 'visible', l: 'ظاهر في الموقع', t: 'bool', def: true },
      ],
      row: (x) => ({ title: x.name, sub: `${state.db.items.filter(i => i.categoryId === x.id).length} صنف · ${x.description || ''}` }),
    },
    items: {
      title: 'الأصناف', icon: I.dish, single: 'صنف', hint: 'اضغط على أي صنف لتعديله. أول 3 أصناف مفعّل عليها "يظهر في الصفحة الرئيسية" تبان في الرئيسية.', filterBy: 'categoryId', searchable: true,
      fields: [
        { k: 'image', l: 'صورة الصنف', t: 'image' },
        { k: 'name', l: 'اسم الصنف', t: 'text', req: true },
        { k: 'categoryId', l: 'القسم', t: 'select', opts: () => state.db.categories.map(c => [c.id, c.name]) },
        { k: 'description', l: 'الوصف', t: 'textarea', rows: 3, ph: 'جملة أو جملتين تشهّي' },
        { k: 'ingredients', l: 'المكونات', t: 'list', ph: 'كل مكوّن في سطر' },
        { k: 'price', l: 'السعر (اتركه فاضي = "السعر عند الطلب")', t: 'number', half: true },
        { k: 'unit', l: 'الوحدة / الكمية', t: 'text', ph: 'صينية · 20 قطعة', half: true },
        { k: 'tags', l: 'الوسوم', t: 'tags', presets: TAG_PRESETS },
        { k: 'featured', l: 'يظهر في الصفحة الرئيسية', t: 'bool', half: true },
        { k: 'available', l: 'متوفر للطلب', t: 'bool', def: true, half: true },
        { k: 'visible', l: 'ظاهر في الموقع', t: 'bool', def: true },
      ],
      row: (x) => ({ img: x.image, title: x.name, sub: `${catName(x.categoryId)} · ${x.price != null ? fmt(x.price) + ' ' + state.db.settings.currency : 'عند الطلب'}${x.unit ? ' · ' + x.unit : ''}`, badges: [x.featured && 'في الرئيسية', x.available === false && 'غير متوفر', ...(x.tags || [])].filter(Boolean) }),
    },
    packages: {
      title: 'الباقات', icon: I.gift, single: 'باقة', hint: 'باقات المناسبات. فعّل "مميّزة" لباقة وحدة تبان بلون داكن ذهبي.',
      fields: [
        { k: 'image', l: 'صورة (اختياري)', t: 'image' },
        { k: 'name', l: 'اسم الباقة', t: 'text', req: true },
        { k: 'subtitle', l: 'تناسب', t: 'text', ph: 'خطوبة، ملكة، عقيقة' },
        { k: 'guests', l: 'عدد الضيوف', t: 'text', ph: '50 – 80 ضيف', half: true },
        { k: 'badge', l: 'شارة', t: 'text', ph: 'الأكثر طلبًا', half: true },
        { k: 'price', l: 'السعر (فاضي = حسب الطلب)', t: 'number', half: true },
        { k: 'priceNote', l: 'ملاحظة السعر', t: 'text', ph: 'للباقة / للشخص', half: true },
        { k: 'includes', l: 'تشمل', t: 'list', ph: 'كل بند في سطر' },
        { k: 'highlight', l: 'باقة مميّزة', t: 'bool', half: true },
        { k: 'visible', l: 'ظاهرة في الموقع', t: 'bool', def: true, half: true },
      ],
      row: (x) => ({ img: x.image, title: x.name, sub: `${x.guests || ''} · ${x.price != null ? fmt(x.price) + ' ' + state.db.settings.currency : 'حسب الطلب'}`, badges: [x.highlight && 'مميّزة', x.badge].filter(Boolean) }),
    },
    tastings: {
      title: 'مواعيد التذوّق', icon: I.cal, single: 'موعد', hint: 'المواعيد اللي فاتت تختفي من الموقع تلقائيًا.',
      fields: [
        { k: 'title', l: 'عنوان الجلسة', t: 'text', req: true },
        { k: 'date', l: 'التاريخ', t: 'date', req: true, half: true },
        { k: 'seats', l: 'عدد المقاعد', t: 'number', half: true },
        { k: 'timeFrom', l: 'من الساعة', t: 'time', half: true },
        { k: 'timeTo', l: 'إلى الساعة', t: 'time', half: true },
        { k: 'location', l: 'المكان', t: 'text', def: () => state.db.settings.address },
        { k: 'mapUrl', l: 'رابط الخريطة', t: 'url', def: () => state.db.settings.mapUrl },
        { k: 'note', l: 'ملاحظة', t: 'textarea', rows: 2 },
        { k: 'status', l: 'حالة الحجز', t: 'select', opts: [['open', 'مفتوح'], ['full', 'المقاعد كاملة'], ['closed', 'مقفول']], half: true },
        { k: 'visible', l: 'ظاهر في الموقع', t: 'bool', def: true, half: true },
      ],
      row: (x) => ({ title: x.title, sub: `${x.date} · ${x.timeFrom || ''}${x.timeTo ? '–' + x.timeTo : ''}`, badges: [{ open: 'مفتوح', full: 'كامل', closed: 'مقفول' }[x.status], x.date && x.date < todayISO() && 'فات'].filter(Boolean) }),
      sort: (a, b) => String(b.date).localeCompare(String(a.date)),
    },
    gallery: {
      title: 'معرض الأعمال', icon: I.img, single: 'صورة', hint: 'تقدر ترفع أكثر من صورة مرة وحدة.', multiUpload: true,
      fields: [
        { k: 'image', l: 'الصورة', t: 'image', req: true },
        { k: 'caption', l: 'تعليق', t: 'text' },
        { k: 'visible', l: 'ظاهرة في الموقع', t: 'bool', def: true },
      ],
      row: (x) => ({ img: x.image, title: x.caption || 'بدون تعليق', sub: '' }),
    },
  };

  const NAV = [
    ['', [['dashboard', 'الرئيسية', I.home], ['leads', 'الطلبات', I.inbox]]],
    ['محتوى الموقع', [['items', 'الأصناف', I.dish], ['categories', 'أقسام المنيو', I.folder], ['packages', 'الباقات', I.gift], ['tastings', 'مواعيد التذوّق', I.cal], ['gallery', 'صور الأعمال', I.img]]],
    ['الإعدادات', [['settings', 'معلومات الشركة', I.gear], ['backups', 'النسخ الاحتياطي', I.save], ['password', 'كلمة السر', I.lock]]],
  ];
  const NAV_FLAT = NAV.flatMap(g => g[1]);

  const state = { authed: false, configured: true, db: null, view: 'dashboard', filter: '', q: '', leadFilter: 'all' };
  const catName = (id) => state.db.categories.find(c => c.id === id)?.name || 'بدون قسم';
  const todayISO = () => new Date().toISOString().slice(0, 10);

  // ——— الدخول ———
  function renderLogin() {
    const setup = !state.configured;
    app.className = 'login';
    app.innerHTML = `
      <form class="login-card" id="loginForm">
        <img src="/brand/moka-mark-gold.svg" alt="" class="login-mark">
        <h1>${setup ? 'إعداد لوحة الإدارة' : 'لوحة إدارة موكا'}</h1>
        <p>${setup ? 'اختار كلمة سر قوية (8 حروف على الأقل). احفظها كويس.' : 'ادخل كلمة السر باش تكمّل.'}</p>
        <label>كلمة السر<input type="password" name="password" required minlength="${setup ? 8 : 1}" autocomplete="${setup ? 'new-password' : 'current-password'}" autofocus></label>
        ${setup ? '<label>أعد كتابتها<input type="password" name="confirm" required minlength="8" autocomplete="new-password"></label>' : ''}
        <button class="btn btn-gold btn-block">${setup ? 'احفظ وادخل' : 'دخول'}</button>
        <p class="err" id="loginErr"></p>
        <a href="/" class="back">← رجوع للموقع</a>
      </form>`;
    $('#loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const err = $('#loginErr');
      if (setup && f.password !== f.confirm) { err.textContent = 'كلمتين السر مش متطابقات'; return; }
      try {
        await api(setup ? '/admin/setup' : '/admin/login', { method: 'POST', body: { password: f.password } });
        state.authed = true; state.configured = true;
        await loadData(); render();
      } catch (ex) { err.textContent = ex.message; }
    });
  }

  async function loadData() { state.db = await api('/admin/data'); }

  // ——— الهيكل ———
  function shell(content) {
    const newLeads = state.db.leads.filter(l => l.status === 'new').length;
    app.className = 'shell';
    app.innerHTML = `
      <aside class="side" id="side">
        <a class="side-brand" href="#dashboard"><img src="/brand/moka-mark-gold.svg" alt=""><span><b>موكا</b><i>لوحة الإدارة</i></span></a>
        <nav>${NAV.map(([g, list]) => `${g ? `<p class="nav-group">${g}</p>` : ''}${list.map(([k, l, icn]) => `<a href="#${k}" class="${state.view === k ? 'on' : ''}">${icn}<span>${l}</span>${k === 'leads' && newLeads ? `<em>${newLeads}</em>` : ''}</a>`).join('')}`).join('')}</nav>
        <div class="side-foot">
          <a href="/" target="_blank" rel="noopener">${I.ext}<span>عرض الموقع</span></a>
          <button id="logout">${I.out}<span>خروج</span></button>
        </div>
      </aside>
      <div class="scrim" id="scrim"></div>
      <main class="main">
        <header class="topbar"><button class="burger" id="burger" aria-label="القائمة">${I.menu}</button><h1>${esc(NAV_FLAT.find(n => n[0] === state.view)?.[1] || '')}</h1></header>
        <div class="content">${content}</div>
      </main>
      <div class="drawer" id="drawer" hidden></div>`;
    $('#logout').onclick = guard(async () => { await api('/admin/logout', { method: 'POST' }); state.authed = false; render(); });
    $('#burger').onclick = () => document.body.classList.toggle('nav-open');
    $('#scrim').onclick = () => document.body.classList.remove('nav-open');
  }

  function render() {
    document.body.classList.remove('nav-open');
    if (!state.authed) return renderLogin();
    const v = state.view;
    if (v === 'dashboard') return viewDashboard();
    if (v === 'settings') return viewSettings();
    if (v === 'leads') return viewLeads();
    if (v === 'backups') return viewBackups();
    if (v === 'password') return viewPassword();
    if (COLS[v]) return viewCollection(v);
    state.view = 'dashboard'; viewDashboard();
  }

  window.addEventListener('hashchange', () => {
    const v = location.hash.slice(1) || 'dashboard';
    if (v !== state.view) { state.view = v; state.filter = ''; state.q = ''; render(); window.scrollTo(0, 0); }
  });

  // ——— الرئيسية ———
  const demoCount = () => ['categories', 'items', 'packages', 'tastings', 'gallery'].reduce((n, c) => n + state.db[c].filter(x => x.demo).length, 0);

  function viewDashboard() {
    const d = state.db;
    const demos = demoCount();
    const up = d.tastings.filter(t => !t.demo && t.date >= todayISO() && t.visible !== false);
    const newLeads = d.leads.filter(l => l.status === 'new');
    const cards = [
      ['leads', 'طلب جديد', newLeads.length, I.inbox], ['items', 'صنف', d.items.filter(x => !x.demo).length, I.dish],
      ['packages', 'باقة', d.packages.filter(x => !x.demo).length, I.gift], ['tastings', 'موعد تذوّق قادم', up.length, I.cal],
    ];
    shell(`
      ${demos ? `<section class="notice">
        <div><b>الموقع فيه ${demos} مكان فاضي للعرض</b><p>هذي أماكن تبين شكل الموقع (اسم الصنف، السعر، صورة...). عدّل أي واحد وحط فيه المعلومة الحقيقية، أو احذفهم كلهم مرة وحدة.</p></div>
        <button class="btn btn-line" id="clearDemo">${I.trash} احذف الأماكن الفاضية</button>
      </section>` : ''}
      <div class="stat-grid">${cards.map(([k, l, n, icn]) => `<a class="stat" href="#${k}">${icn}<b>${n}</b><span>${l}</span></a>`).join('')}</div>
      <div class="two">
        <section class="panel"><header><h3>آخر الطلبات</h3><a href="#leads">عرض الكل</a></header>
          ${d.leads.length ? `<ul class="mini">${d.leads.slice(0, 6).map(l => `<li><span class="dot ${l.status}"></span><b>${esc(l.name || 'بدون اسم')}</b><span>${leadType(l.type)}${l.eventDate ? ' · ' + esc(l.eventDate) : ''}</span><time>${timeAgo(l.createdAt)}</time></li>`).join('')}</ul>` : '<p class="muted">لا يوجد طلبات. أي طلب يبعثه زبون من الموقع يظهر هني.</p>'}
        </section>
        <section class="panel"><header><h3>إضافة سريعة</h3></header>
          <div class="quick-list">
            <a href="#items" data-new="items">${I.plus}<span>صنف جديد</span></a>
            <a href="#packages" data-new="packages">${I.plus}<span>باقة جديدة</span></a>
            <a href="#tastings" data-new="tastings">${I.plus}<span>موعد تذوّق</span></a>
            <a href="#gallery">${I.upload}<span>رفع صور أعمال</span></a>
          </div>
        </section>
      </div>`);
    $$('[data-new]').forEach(a => a.addEventListener('click', () => setTimeout(() => openEditor(a.dataset.new), 30)));
    $('#clearDemo')?.addEventListener('click', () => confirmBox('تحذف كل الأماكن الفاضية؟ العناصر الحقيقية ما تتأثرش.', guard(async () => {
      await api('/admin/demo', { method: 'DELETE' }); await loadData(); toast('تم الحذف'); render();
    })));
  }

  // نافذة تأكيد داخل الصفحة
  function confirmBox(msg, onYes, yesLabel = 'نعم، احذف') {
    const box = document.createElement('div');
    box.className = 'confirm';
    box.innerHTML = `<div class="confirm-card" role="alertdialog" aria-modal="true"><p>${esc(msg)}</p><div><button class="btn btn-danger" data-y>${esc(yesLabel)}</button><button class="btn btn-ghost" data-n>إلغاء</button></div></div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    box.querySelector('[data-y]').onclick = () => { close(); onYes(); };
    box.querySelector('[data-n]').onclick = close;
    box.onclick = (e) => { if (e.target === box) close(); };
    box.querySelector('[data-n]').focus();
  }

  const leadType = (t) => ({ order: 'طلبية', package: 'باقة', tasting: 'حجز تذوّق', inquiry: 'استفسار' }[t] || t);
  function timeAgo(iso) {
    const s = (Date.now() - new Date(iso)) / 1000;
    if (s < 60) return 'توا';
    if (s < 3600) return `قبل ${Math.floor(s / 60)} د`;
    if (s < 86400) return `قبل ${Math.floor(s / 3600)} س`;
    return new Date(iso).toLocaleDateString('ar-LY', { day: 'numeric', month: 'short' });
  }

  // ——— الأقسام العامة (CRUD) ———
  function viewCollection(col) {
    const C = COLS[col];
    let list = [...state.db[col]];
    if (C.sort) list.sort(C.sort);
    if (C.filterBy && state.filter) list = list.filter(x => x[C.filterBy] === state.filter);
    if (state.q) list = list.filter(x => JSON.stringify(x).includes(state.q));
    const canReorder = !C.sort && !state.filter && !state.q;
    shell(`
      <div class="toolbar">
        ${C.hint ? `<p class="hint">${esc(C.hint)}</p>` : '<span></span>'}
        <div class="tb-actions">
          ${C.multiUpload ? `<label class="btn btn-line">${I.upload} رفع صور<input type="file" accept="image/*" multiple hidden id="multiUp"></label>` : ''}
          <button class="btn btn-gold" id="addNew">${I.plus} ${C.single} جديد</button>
        </div>
      </div>
      ${C.filterBy || C.searchable ? `<div class="filters">
        ${C.filterBy ? `<select id="fCat"><option value="">كل الأقسام</option>${state.db.categories.map(c => `<option value="${esc(c.id)}" ${state.filter === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>` : ''}
        ${C.searchable ? `<label class="sbox">${I.search}<input id="fQ" placeholder="بحث…" value="${esc(state.q)}"></label>` : ''}
      </div>` : ''}
      ${list.length ? `<ul class="rows ${col === 'gallery' ? 'rows-grid' : ''}">${list.map((x, i) => {
        const r = C.row(x);
        return `<li class="row ${x.visible === false ? 'is-hidden' : ''}" data-id="${esc(x.id)}">
          ${'img' in r ? `<div class="thumb">${r.img ? `<img src="${esc(r.img)}" alt="" loading="lazy">` : I.img}</div>` : ''}
          <div class="row-main"><b>${esc(r.title)}${x.demo ? ' <em class="demo-tag">مكان فاضي</em>' : ''}</b>${r.sub ? `<span>${esc(r.sub)}</span>` : ''}${(r.badges || []).length ? `<div class="badges">${r.badges.map(b => `<em>${esc(b)}</em>`).join('')}</div>` : ''}</div>
          <div class="row-act">
            ${canReorder ? `<button data-a="up" title="لفوق" ${i === 0 ? 'disabled' : ''}>${I.up}</button><button data-a="down" title="لتحت" ${i === list.length - 1 ? 'disabled' : ''}>${I.down}</button>` : ''}
            <button data-a="vis" title="${x.visible === false ? 'إظهار' : 'إخفاء'}">${x.visible === false ? I.eyeoff : I.eye}</button>
            <button data-a="edit" title="تعديل" class="edit-btn">${I.edit}<span>تعديل</span></button>
            <button data-a="del" title="حذف" class="danger">${I.trash}</button>
          </div>
        </li>`;
      }).join('')}</ul>` : `<div class="empty">${C.icon}<p>${state.q || state.filter ? 'ما فيش نتائج.' : `ما فيش ${C.single} لتوّا.`}</p></div>`}`);

    $('#addNew').onclick = () => openEditor(col);
    $('#fCat')?.addEventListener('change', (e) => { state.filter = e.target.value; render(); });
    const fq = $('#fQ');
    if (fq) { fq.addEventListener('input', debounce((e) => { state.q = e.target.value.trim(); render(); const n = $('#fQ'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250)); }
    $('#multiUp')?.addEventListener('change', guard(async (e) => {
      const files = [...e.target.files]; if (!files.length) return;
      toast('جاري رفع الصور…');
      const urls = await upload(files);
      for (const u of urls) state.db.gallery.push(await api('/admin/gallery', { method: 'POST', body: { image: u, caption: '', visible: true } }));
      toast(`تم رفع ${urls.length} صورة`); render();
    }));

    $$('.row').forEach(li => li.addEventListener('click', guard(async (ev) => {
      const b = ev.target.closest('button[data-a]');
      const id = li.dataset.id;
      const arr = state.db[col];
      const item = arr.find(x => x.id === id);
      if (!b) { if (!ev.target.closest('a')) openEditor(col, item); return; }
      const a = b.dataset.a;
      if (a === 'edit') openEditor(col, item);
      if (a === 'vis') {
        const upd = await api(`/admin/${col}/${id}`, { method: 'PUT', body: { visible: item.visible === false } });
        Object.assign(item, upd); toast(upd.visible ? 'صار ظاهر' : 'صار مخفي'); render();
      }
      if (a === 'del') {
        confirmBox(`تحذف "${C.row(item).title}"؟`, guard(async () => {
          await api(`/admin/${col}/${id}`, { method: 'DELETE' });
          state.db[col] = state.db[col].filter(x => x.id !== id);
          if (col === 'categories') state.db.items.forEach(it => { if (it.categoryId === id) it.categoryId = ''; });
          toast('تم الحذف'); render();
        }));
      }
      if (a === 'up' || a === 'down') {
        const i = arr.indexOf(item), j = a === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        render();
        await api(`/admin/${col}/order`, { method: 'PUT', body: { ids: arr.map(x => x.id) } });
      }
    })));
  }

  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  async function upload(files) {
    const fd = new FormData();
    for (const f of files) fd.append('files', f);
    const r = await api('/admin/upload', { method: 'POST', body: fd });
    return r.files;
  }

  // ——— محرر العناصر ———
  function fieldHtml(f, val) {
    const id = 'f_' + f.k;
    const req = f.req ? 'required' : '';
    const ph = f.ph ? `placeholder="${esc(f.ph)}"` : '';
    const wrap = (inner, cls = '') => `<div class="field ${f.half ? 'half' : ''} ${cls}" data-k="${f.k}"><label for="${id}">${esc(f.l)}${f.req ? ' <i>*</i>' : ''}</label>${inner}</div>`;
    switch (f.t) {
      case 'textarea': return wrap(`<textarea id="${id}" rows="${f.rows || 3}" ${req} ${ph}>${esc(val)}</textarea>`);
      case 'list': return wrap(`<textarea id="${id}" rows="${Math.max(3, (val || []).length + 1)}" ${ph}>${esc((val || []).join('\n'))}</textarea>`);
      case 'number': return wrap(`<input id="${id}" type="number" min="0" step="any" inputmode="decimal" value="${val ?? ''}" ${req} ${ph}>`);
      case 'date': case 'time': case 'url': return wrap(`<input id="${id}" type="${f.t}" value="${esc(val)}" ${req} ${f.t === 'url' ? 'dir="ltr"' : ''}>`);
      case 'select': {
        const opts = typeof f.opts === 'function' ? f.opts() : f.opts;
        return wrap(`<select id="${id}">${f.k === 'categoryId' ? '<option value="">— بدون قسم —</option>' : ''}${opts.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`);
      }
      case 'bool': return `<div class="field ${f.half ? 'half' : ''}" data-k="${f.k}"><label class="switch"><input type="checkbox" id="${id}" ${val ? 'checked' : ''}><span></span>${esc(f.l)}</label></div>`;
      case 'tags': {
        const cur = new Set(val || []);
        const all = [...new Set([...f.presets, ...cur])];
        return wrap(`<div class="tagpick" id="${id}">${all.map(t => `<label><input type="checkbox" value="${esc(t)}" ${cur.has(t) ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('')}<input class="tag-new" placeholder="+ وسم جديد"></div>`);
      }
      case 'image': return wrap(`<div class="imgpick" id="${id}" data-val="${esc(val)}">
          <div class="imgprev">${val ? `<img src="${esc(val)}" alt="">` : `${I.img}<span>ما فيش صورة</span>`}</div>
          <div class="imgbtns"><label class="btn btn-line btn-sm">${I.upload} ${val ? 'تغيير' : 'رفع صورة'}<input type="file" accept="image/*" hidden></label>${val ? `<button type="button" class="btn btn-sm btn-ghost" data-clear>${I.x} إزالة</button>` : ''}</div>
          <small>تتصغّر وتتحسّن تلقائيًا. الأفضل صورة عرضية واضحة.</small>
        </div>`, 'f-img');
      default: return wrap(`<input id="${id}" type="text" value="${esc(val)}" ${req} ${ph}>`);
    }
  }

  function readField(f, root) {
    const el = $('#f_' + f.k, root);
    switch (f.t) {
      case 'bool': return el.checked;
      case 'number': return el.value === '' ? null : +el.value;
      case 'list': return el.value.split('\n').map(s => s.trim()).filter(Boolean);
      case 'tags': return $$('input[type=checkbox]:checked', el).map(c => c.value);
      case 'image': return el.dataset.val || '';
      default: return el.value.trim();
    }
  }

  function bindImagePick(root) {
    $$('.imgpick', root).forEach(box => {
      const setVal = (v) => {
        box.dataset.val = v;
        $('.imgprev', box).innerHTML = v ? `<img src="${esc(v)}" alt="">` : `${I.img}<span>ما فيش صورة</span>`;
      };
      $('input[type=file]', box).addEventListener('change', guard(async (e) => {
        const f = e.target.files[0]; if (!f) return;
        $('.imgprev', box).classList.add('loading');
        try { const [u] = await upload([f]); setVal(u); toast('تم رفع الصورة'); }
        finally { $('.imgprev', box).classList.remove('loading'); e.target.value = ''; }
      }));
      $('[data-clear]', box)?.addEventListener('click', () => setVal(''));
    });
    $$('.tagpick .tag-new', root).forEach(inp => inp.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const v = inp.value.trim(); if (!v) return;
      inp.insertAdjacentHTML('beforebegin', `<label><input type="checkbox" value="${esc(v)}" checked><span>${esc(v)}</span></label>`);
      inp.value = '';
    }));
  }

  function openEditor(col, item) {
    const C = COLS[col];
    const dr = $('#drawer');
    const isNew = !item;
    const vals = {};
    for (const f of C.fields) vals[f.k] = isNew ? (typeof f.def === 'function' ? f.def() : f.def ?? (f.t === 'select' ? '' : '')) : item[f.k];
    if (isNew && col === 'items' && state.filter) vals.categoryId = state.filter;
    if (isNew && col === 'tastings') vals.status = 'open';
    dr.hidden = false;
    dr.innerHTML = `
      <div class="dr-panel">
        <header><h3>${isNew ? `${C.single} جديد` : `تعديل: ${esc(C.row(item).title)}`}</h3><button class="icon-btn" data-close>${I.x}</button></header>
        <form id="edForm" class="dr-body">${C.fields.map(f => fieldHtml(f, vals[f.k])).join('')}</form>
        <footer><button class="btn btn-gold" form="edForm">${I.save} حفظ</button><button class="btn btn-ghost" data-close>إلغاء</button></footer>
      </div>`;
    document.body.style.overflow = 'hidden';
    const close = () => { dr.hidden = true; dr.innerHTML = ''; document.body.style.overflow = ''; };
    $$('[data-close]', dr).forEach(b => b.onclick = close);
    dr.onclick = (e) => { if (e.target === dr) close(); };
    bindImagePick(dr);
    setTimeout(() => $('input:not([type=checkbox]):not([type=file]),textarea', dr)?.focus(), 50);
    $('#edForm').addEventListener('submit', guard(async (e) => {
      e.preventDefault();
      const body = {};
      for (const f of C.fields) body[f.k] = readField(f, dr);
      const miss = C.fields.find(f => f.req && (body[f.k] === '' || body[f.k] == null));
      if (miss) throw new Error(`"${miss.l}" مطلوب`);
      if (isNew) state.db[col].push(await api(`/admin/${col}`, { method: 'POST', body }));
      else Object.assign(item, await api(`/admin/${col}/${item.id}`, { method: 'PUT', body }));
      close(); toast('تم الحفظ'); render();
    }));
  }

  // ——— الإعدادات العامة ———
  const SETTINGS = [
    { title: 'الشركة', fields: [
      { k: 'nameAr', l: 'اسم الشركة', t: 'text' }, { k: 'shortName', l: 'الاسم المختصر', t: 'text', half: true }, { k: 'nameEn', l: 'الاسم بالإنجليزي', t: 'text', half: true },
      { k: 'tagline', l: 'الجملة اللي تحت الاسم', t: 'text' },
      { k: 'intro', l: 'نبذة قصيرة (اختياري)', t: 'textarea', rows: 3 },
      { k: 'heroImage', l: 'الصورة الرئيسية', t: 'image' }] },
    { title: 'التواصل', fields: [
      { k: 'whatsapp', l: 'رقم واتساب اللي توصله الطلبات', t: 'text', ph: '0945313001', half: true }, { k: 'phones', l: 'أرقام الهاتف (كل رقم في سطر)', t: 'list', half: true },
      { k: 'address', l: 'العنوان', t: 'text' }, { k: 'mapUrl', l: 'رابط خرائط جوجل', t: 'url' },
      { k: 'facebook', l: 'فيسبوك', t: 'url', half: true }, { k: 'instagram', l: 'إنستغرام', t: 'url', half: true },
      { k: 'tiktok', l: 'تيك توك', t: 'url', half: true }, { k: 'email', l: 'الإيميل', t: 'text', half: true }] },
    { title: 'مواعيد العمل', pairs: { k: 'hours', a: ['label', 'العنوان', 'مواعيد العمل'], b: ['value', 'الوقت', 'مفتوح دائمًا'] } },
    { title: 'الطلبات', fields: [
      { k: 'currency', l: 'العملة', t: 'text', half: true },
      { k: 'orderNotes', l: 'ملاحظة تظهر في صفحة الطلب (اختياري)', t: 'textarea', rows: 2 }] },
    { title: 'الظهور في جوجل', fields: [
      { k: 'seoTitle', l: 'العنوان', t: 'text' }, { k: 'seoDescription', l: 'الوصف', t: 'textarea', rows: 2 }] },
  ];
  const getPath = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);

  function viewSettings() {
    const s = state.db.settings;
    shell(`
      <form id="setForm" class="settings">
        ${SETTINGS.map((g, gi) => `<section class="panel"><header><h3>${esc(g.title)}</h3></header>
          ${g.fields ? `<div class="fgrid">${g.fields.map(f => fieldHtml({ ...f, k: f.k.replace('.', '__') }, getPath(s, f.k))).join('')}</div>` : ''}
          ${g.pairs ? `<div class="pairs" data-pairs="${g.pairs.k}">${(s[g.pairs.k] || []).map(x => pairRow(g.pairs, x)).join('')}</div><button type="button" class="btn btn-sm btn-line" data-addpair="${gi}">${I.plus} زيد سطر</button>` : ''}
        </section>`).join('')}
        <div class="savebar"><button class="btn btn-gold btn-lg">${I.save} حفظ الإعدادات</button></div>
      </form>`);
    const form = $('#setForm');
    bindImagePick(form);
    $$('[data-addpair]').forEach(b => b.onclick = () => {
      const g = SETTINGS[+b.dataset.addpair].pairs;
      $(`[data-pairs="${g.k}"]`).insertAdjacentHTML('beforeend', pairRow(g, {}));
    });
    form.addEventListener('click', (e) => { const b = e.target.closest('[data-delpair]'); if (b) b.closest('.pair').remove(); });
    form.addEventListener('submit', guard(async (e) => {
      e.preventDefault();
      const body = {};
      for (const g of SETTINGS) {
        for (const f of g.fields || []) {
          const v = readField({ ...f, k: f.k.replace('.', '__') }, form);
          body[f.k] = v;
        }
        if (g.pairs) body[g.pairs.k] = $$(`[data-pairs="${g.pairs.k}"] .pair`).map(r => ({ [g.pairs.a[0]]: $('[data-a]', r).value.trim(), [g.pairs.b[0]]: $('[data-b]', r).value.trim() }));
      }
      state.db.settings = await api('/admin/settings', { method: 'PUT', body });
      toast('تم حفظ الإعدادات'); render();
    }));
  }
  const pairRow = (g, x) => `<div class="pair"><input data-a placeholder="${esc(g.a[2])}" value="${esc(x[g.a[0]] || '')}" aria-label="${esc(g.a[1])}"><input data-b placeholder="${esc(g.b[2])}" value="${esc(x[g.b[0]] || '')}" aria-label="${esc(g.b[1])}"><button type="button" class="icon-btn danger" data-delpair aria-label="حذف">${I.trash}</button></div>`;

  // ——— سجل الطلبات ———
  const STATUS = { new: 'جديد', contacted: 'تم التواصل', done: 'تم التنفيذ', cancelled: 'ملغي' };
  function viewLeads() {
    const all = state.db.leads;
    const list = state.leadFilter === 'all' ? all : all.filter(l => l.status === state.leadFilter);
    const cur = state.db.settings.currency;
    shell(`
      <p class="hint">كل طلب أو حجز يبعثه زبون من الموقع على واتساب يتسجّل هني تلقائيًا، باش ما يضيعش ولا طلب. (الرسالة نفسها توصلكم على واتساب.)</p>
      <div class="seg">${[['all', 'الكل'], ...Object.entries(STATUS)].map(([k, l]) => `<button data-lf="${k}" class="${state.leadFilter === k ? 'on' : ''}">${l} <i>${k === 'all' ? all.length : all.filter(x => x.status === k).length}</i></button>`).join('')}</div>
      ${list.length ? `<ul class="leads">${list.map(l => `
        <li class="lead st-${l.status}" data-id="${esc(l.id)}">
          <header>
            <span class="ltype">${leadType(l.type)}</span>
            <b>${esc(l.name || 'بدون اسم')}</b>
            <time title="${esc(l.createdAt)}">${timeAgo(l.createdAt)}</time>
          </header>
          <dl>
            ${l.phone ? `<div><dt>الهاتف</dt><dd dir="ltr">${esc(l.phone)}</dd></div>` : ''}
            ${l.eventDate ? `<div><dt>تاريخ المناسبة</dt><dd>${esc(l.eventDate)}</dd></div>` : ''}
            ${l.guests ? `<div><dt>الضيوف</dt><dd>${esc(l.guests)}</dd></div>` : ''}
            ${l.eventType ? `<div><dt>المناسبة</dt><dd>${esc(l.eventType)}</dd></div>` : ''}
            ${l.delivery ? `<div><dt>الاستلام</dt><dd>${esc(l.delivery)}</dd></div>` : ''}
            ${l.ref ? `<div><dt>بخصوص</dt><dd>${esc(l.ref)}</dd></div>` : ''}
          </dl>
          ${(l.lines || []).length ? `<ul class="llines">${l.lines.map(x => `<li><span>${esc(x.name)} × ${x.qty}</span><span>${x.price != null ? fmt(x.price * x.qty) + ' ' + esc(cur) : 'عند الطلب'}</span></li>`).join('')}<li class="tot"><span>المجموع</span><span>${fmt(l.total)} ${esc(cur)}</span></li></ul>` : ''}
          ${l.notes ? `<p class="lnote">${esc(l.notes)}</p>` : ''}
          <footer>
            <select data-st>${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${l.status === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
            <input data-note placeholder="ملاحظة داخلية…" value="${esc(l.adminNote || '')}">
            ${l.phone ? `<a class="btn btn-sm btn-wa" target="_blank" rel="noopener" href="https://wa.me/${waNum(l.phone)}">${I.wa} راسله</a>` : ''}
            <button class="icon-btn danger" data-del title="حذف">${I.trash}</button>
          </footer>
        </li>`).join('')}</ul>` : `<div class="empty">${I.inbox}<p>ما فيش طلبات هني.</p></div>`}`);
    $$('[data-lf]').forEach(b => b.onclick = () => { state.leadFilter = b.dataset.lf; render(); });
    $$('.lead').forEach(li => {
      const id = li.dataset.id;
      const l = state.db.leads.find(x => x.id === id);
      const save = guard(async (patch) => { Object.assign(l, await api(`/admin/leads/${id}`, { method: 'PUT', body: patch })); toast('تم الحفظ'); });
      $('[data-st]', li).onchange = async (e) => { await save({ status: e.target.value }); render(); };
      $('[data-note]', li).onchange = (e) => save({ adminNote: e.target.value });
      $('[data-del]', li).onclick = () => confirmBox('تحذف هذا الطلب من السجل؟', guard(async () => {
        await api(`/admin/leads/${id}`, { method: 'DELETE' });
        state.db.leads = state.db.leads.filter(x => x.id !== id); render();
      }));
    });
  }
  const waNum = (p) => { let d = String(p).replace(/\D/g, ''); if (d.startsWith('00')) d = d.slice(2); if (d.startsWith('0')) d = '218' + d.slice(1); return d; };

  // ——— النسخ الاحتياطي ———
  async function viewBackups() {
    shell('<div class="spinner"></div>');
    const list = await api('/admin/backups').catch(() => []);
    shell(`
      <section class="panel"><header><h3>نسخة من كل البيانات</h3></header>
        <p class="muted">النظام ياخذ نسخة تلقائية قبل التعديلات (يحتفظ بآخر 40 نسخة). تقدر تاخذ نسخة يدويًا أو تنزّلها على جهازك.</p>
        <div class="quick"><button class="btn btn-gold" id="mkBk">${I.save} خذ نسخة الآن</button><button class="btn btn-line" id="dlNow">${I.down} نزّل البيانات الحالية</button><label class="btn btn-line">${I.upload} استرجاع من ملف<input type="file" accept="application/json,.json" hidden id="upBk"></label></div>
      </section>
      <section class="panel"><header><h3>النسخ المحفوظة</h3></header>
        ${list.length ? `<ul class="bk">${list.map(b => `<li><span dir="ltr">${esc(b.name.replace(/^db-|\.json$/g, ''))}</span><small>${(b.size / 1024).toFixed(1)} KB</small><a class="btn btn-sm btn-ghost" href="/api/admin/backups/${encodeURIComponent(b.name)}" download>${I.down}</a><button class="btn btn-sm btn-line" data-restore="${esc(b.name)}">استرجاع</button></li>`).join('')}</ul>` : '<p class="muted">ما فيش نسخ لتوّا.</p>'}
      </section>`);
    $('#mkBk').onclick = guard(async () => { await api('/admin/backups', { method: 'POST' }); toast('تم أخذ نسخة'); viewBackups(); });
    $('#dlNow').onclick = () => {
      const blob = new Blob([JSON.stringify(state.db, null, 2)], { type: 'application/json' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `moka-${todayISO()}.json` });
      a.click(); URL.revokeObjectURL(a.href);
    };
    $('#upBk').onchange = guard(async (e) => {
      const f = e.target.files[0]; if (!f) return;
      const data = JSON.parse(await f.text());
      confirmBox('هذا يستبدل كل البيانات الحالية بمحتوى الملف (وناخذوا نسخة من الحالي قبلها).', guard(async () => {
        await api('/admin/restore', { method: 'POST', body: { data } });
        await loadData(); toast('تم الاسترجاع'); viewBackups();
      }), 'استرجاع');
    });
    $$('[data-restore]').forEach(b => b.onclick = () => confirmBox('ترجّع البيانات لهذي النسخة؟ (ناخذوا نسخة من الحالي قبلها)', guard(async () => {
      await api('/admin/restore', { method: 'POST', body: { name: b.dataset.restore } });
      await loadData(); toast('تم الاسترجاع'); viewBackups();
    }), 'استرجاع'));
  }

  // ——— كلمة السر ———
  function viewPassword() {
    shell(`
      <form class="panel narrow" id="pwForm"><header><h3>تغيير كلمة السر</h3></header>
        <div class="field"><label>كلمة السر الحالية</label><input type="password" name="current" required autocomplete="current-password"></div>
        <div class="field"><label>كلمة السر الجديدة (8 حروف على الأقل)</label><input type="password" name="next" required minlength="8" autocomplete="new-password"></div>
        <div class="field"><label>أعد الجديدة</label><input type="password" name="confirm" required minlength="8" autocomplete="new-password"></div>
        <p class="muted">بعد التغيير، كل الأجهزة الثانية تطلع من اللوحة تلقائيًا.</p>
        <button class="btn btn-gold">${I.lock} غيّر كلمة السر</button>
      </form>`);
    $('#pwForm').addEventListener('submit', guard(async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      if (f.next !== f.confirm) throw new Error('كلمتين السر الجديدة مش متطابقات');
      await api('/admin/password', { method: 'POST', body: { current: f.current, next: f.next } });
      e.target.reset(); toast('تم تغيير كلمة السر');
    }));
  }

  // ——— التشغيل ———
  (async () => {
    try {
      const st = await api('/admin/status');
      state.configured = st.configured; state.authed = st.authed;
      if (state.authed) await loadData();
    } catch (e) { app.innerHTML = `<p class="err">تعذّر الاتصال بالسيرفر</p>`; return; }
    state.view = location.hash.slice(1) || 'dashboard';
    render();
  })();
})();
