/* موكا — الطلبية، واتساب، المنيو، الحجز */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DATA = JSON.parse($('#moka-data').textContent);
  const ITEMS = new Map(DATA.items.map(i => [i.id, i]));
  const KEY = 'moka-cart';
  const FORM_KEY = 'moka-form';
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const svg = (p) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    plus: svg('<path d="M12 5v14M5 12h14"/>'), minus: svg('<path d="M5 12h14"/>'),
    img: svg('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-4.5-4.5-8 8"/>'),
    wa: svg('<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/>'),
  };

  const ls = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  // ——— الطلبية ———
  let cart = ls.get(KEY, {});
  for (const id of Object.keys(cart)) if (!ITEMS.get(id)?.available) delete cart[id];
  const qty = (id) => cart[id] || 0;
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const total = () => Object.entries(cart).reduce((s, [id, q]) => s + (ITEMS.get(id)?.price || 0) * q, 0);
  const unpriced = () => Object.keys(cart).some(id => ITEMS.get(id)?.price == null);
  const priceText = (it) => it.price != null ? `${fmt(it.price)} ${DATA.currency}` : (it.demo ? 'السعر' : 'السعر عند الطلب');

  function setQty(id, q) {
    q = Math.max(0, Math.min(999, q | 0));
    if (q) cart[id] = q; else delete cart[id];
    ls.set(KEY, cart);
    render();
  }

  function render() {
    const n = count();
    $$('[data-cart-count]').forEach(el => { el.textContent = n; el.hidden = !n; });
    $$('[data-add]').forEach(box => {
      const q = qty(box.dataset.add);
      $('[data-act=add]', box).hidden = !!q;
      $('.stepper', box).hidden = !q;
      $('output', box).textContent = q;
    });
    const ids = Object.keys(cart);
    $('[data-cart-empty]').hidden = !!ids.length;
    $('[data-cart-form]').hidden = !ids.length;
    $('[data-cart-foot]').hidden = !ids.length;
    $('[data-cart-lines]').innerHTML = ids.map(id => {
      const it = ITEMS.get(id);
      return `<li class="cart-line">
        <span class="thumb">${it.image ? `<img src="${esc(it.image)}" alt="">` : ''}</span>
        <div><b>${esc(it.name)}</b><small>${it.unit ? esc(it.unit) + ' · ' : ''}${esc(priceText(it))}</small></div>
        <div class="stepper" data-line="${esc(id)}"><button type="button" data-act="inc" aria-label="زيادة">${I.plus}</button><output>${cart[id]}</output><button type="button" data-act="dec" aria-label="نقص">${I.minus}</button></div>
      </li>`;
    }).join('');
    $('[data-cart-total]').textContent = unpriced() && !total() ? 'يتحدد عند التأكيد' : `${fmt(total())} ${DATA.currency}${unpriced() ? ' +' : ''}`;
  }

  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-act]');
    const box = b?.closest('[data-add],[data-line]');
    if (!box) return;
    const id = box.dataset.add || box.dataset.line;
    if (b.dataset.act === 'add') { setQty(id, 1); toast('تمت الإضافة للطلبية'); }
    if (b.dataset.act === 'inc') setQty(id, qty(id) + 1);
    if (b.dataset.act === 'dec') setQty(id, qty(id) - 1);
  });

  // ——— فتح وغلق ———
  let lastFocus;
  const lock = (on) => { document.body.style.overflow = on ? 'hidden' : ''; };
  const sheet = $('[data-cart]');
  function openCart() { lastFocus = document.activeElement; $('[data-toast]').classList.remove('show'); sheet.hidden = false; lock(true); restoreForm(); $('[data-cart-close]').focus(); }
  function closeCart() { sheet.hidden = true; lock(false); lastFocus?.focus?.(); }
  $$('[data-cart-open]').forEach(b => b.addEventListener('click', openCart));
  $('[data-cart-close]').addEventListener('click', closeCart);
  sheet.addEventListener('click', (e) => { if (e.target === sheet) closeCart(); });

  const modal = $('[data-modal]');
  const mBody = $('[data-modal-body]');
  function openModal(html, cls = '') {
    lastFocus = document.activeElement;
    mBody.innerHTML = html; modal.className = 'modal ' + cls; modal.hidden = false; lock(true);
    $('[data-modal-close]').focus();
  }
  function closeModal() { modal.hidden = true; mBody.innerHTML = ''; if (sheet.hidden) lock(false); lastFocus?.focus?.(); }
  $('[data-modal-close]').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal(); else if (!sheet.hidden) closeCart();
  });

  // ——— النموذج ———
  const form = $('[data-cart-form]');
  function restoreForm() {
    const v = ls.get(FORM_KEY, {});
    for (const k of ['name', 'phone', 'delivery']) if (v[k] && form.elements[k]) form.elements[k].value = v[k];
    form.elements.eventDate.min = new Date().toISOString().slice(0, 10);
  }
  const remember = (f) => ls.set(FORM_KEY, { ...ls.get(FORM_KEY, {}), name: f.name, phone: f.phone, delivery: f.delivery });
  function validate(f) {
    let ok = true;
    $$('[required]', f).forEach(inp => {
      const bad = !inp.value.trim();
      inp.closest('.f').classList.toggle('bad', bad);
      if (bad && ok) { inp.focus(); ok = false; }
    });
    return ok;
  }
  form.addEventListener('input', (e) => e.target.closest('.f')?.classList.remove('bad'));

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso + 'T12:00:00').toLocaleDateString('ar-LY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function lead(payload) {
    fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  }
  function openWa(text) {
    const url = `https://wa.me/${DATA.wa}?text=${encodeURIComponent(text)}`;
    const w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch {} } else location.href = url;
  }

  $('[data-cart-send]').addEventListener('click', () => {
    if (!validate(form)) { toast('كمّل البيانات المطلوبة'); return; }
    const f = Object.fromEntries(new FormData(form));
    remember(f);
    const lines = Object.entries(cart).map(([id, q]) => ({ ...ITEMS.get(id), qty: q }));
    const t = total();
    const msg = [
      `طلب جديد — ${DATA.name}`,
      '',
      `الاسم: ${f.name}`,
      f.phone && `الهاتف: ${f.phone}`,
      `تاريخ المناسبة: ${fmtDate(f.eventDate)}`,
      f.guests && `عدد الضيوف: ${f.guests}`,
      `الاستلام: ${f.delivery}`,
      '',
      'الأصناف:',
      ...lines.map(l => `- ${l.name} × ${l.qty}${l.unit ? ` (${l.unit})` : ''}${l.price != null ? ` = ${fmt(l.price * l.qty)} ${DATA.currency}` : ''}`),
      t ? `\nالمجموع: ${fmt(t)} ${DATA.currency}${unpriced() ? ' + أصناف بدون سعر' : ''}` : '',
      f.notes && `\nملاحظات: ${f.notes}`,
    ].filter(Boolean).join('\n');
    lead({ type: 'order', ...f, lines: lines.map(l => ({ name: l.name, qty: l.qty, price: l.price, unit: l.unit })), total: t });
    openWa(msg);
  });

  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[data-lead]');
    if (a) { try { lead(JSON.parse(a.dataset.lead)); } catch {} }
  });

  // ——— تفاصيل الصنف ———
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-open-item]');
    const it = b && ITEMS.get(b.dataset.openItem);
    if (!it) return;
    openModal(`
      <div class="m-img">${it.image ? `<img src="${esc(it.image)}" alt="${esc(it.name)}">` : `<span class="ph-img">${I.img}<small>صورة الصنف</small></span>`}</div>
      <div class="m-body${it.demo ? ' is-demo' : ''}">
        <h3>${esc(it.name)}</h3>
        ${it.description ? `<p class="muted">${esc(it.description)}</p>` : ''}
        ${(it.ingredients || []).length ? `<h4>المكونات</h4><p>${it.ingredients.map(esc).join('، ')}</p>` : ''}
        <div class="dish-foot">
          <div class="dish-price"><span class="price">${esc(priceText(it))}</span>${it.unit ? `<small>${esc(it.unit)}</small>` : ''}</div>
          ${it.available ? `<div class="add" data-add="${esc(it.id)}"><button type="button" class="btn btn-outline btn-sm" data-act="add">${I.plus} إضافة</button><div class="stepper" hidden><button type="button" data-act="inc" aria-label="زيادة">${I.plus}</button><output>1</output><button type="button" data-act="dec" aria-label="نقص">${I.minus}</button></div></div>` : '<span class="badge">غير متوفر</span>'}
        </div>
      </div>`);
    render();
  });

  // ——— تكبير الصور ———
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-lightbox]');
    if (b) openModal(`<img src="${esc(b.dataset.lightbox)}" alt="${esc(b.dataset.caption)}">`, 'modal-lightbox');
  });

  // ——— حجز التذوّق ———
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-book]');
    if (!b) return;
    const t = JSON.parse(b.dataset.book);
    const v = ls.get(FORM_KEY, {});
    openModal(`
      <form class="bk" data-book-form novalidate>
        <h3>حجز مقعد</h3>
        <p class="muted">${esc(t.title)}${t.when ? ' · ' + esc(t.when) : ''}</p>
        <div class="fields">
          <label class="f f-full"><span>الاسم</span><input id="b-name" name="name" required autocomplete="name" value="${esc(v.name || '')}"></label>
          <label class="f"><span>رقم الهاتف</span><input id="b-phone" name="phone" inputmode="tel" dir="ltr" autocomplete="tel" value="${esc(v.phone || '')}"></label>
          <label class="f"><span>عدد الأشخاص</span><select id="b-guests" name="guests">${[1, 2, 3, 4, 5].map(n => `<option>${n}</option>`).join('')}</select></label>
        </div>
        <button class="btn btn-wa btn-block btn-lg" type="submit">${I.wa} تأكيد الحجز على واتساب</button>
      </form>`);
    const f = $('[data-book-form]');
    f.addEventListener('input', (e) => e.target.closest('.f')?.classList.remove('bad'));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(f)) return;
      const d = Object.fromEntries(new FormData(f));
      remember(d);
      const msg = [`حجز تذوّق — ${DATA.name}`, '', `الموعد: ${t.title}${t.when ? ' · ' + t.when : ''}`, `الاسم: ${d.name}`, d.phone && `الهاتف: ${d.phone}`, `عدد الأشخاص: ${d.guests}`].filter(Boolean).join('\n');
      lead({ type: 'tasting', ref: `${t.title} ${t.when}`.trim(), ...d });
      openWa(msg);
      closeModal();
    });
  });

  // ——— فلترة المنيو ———
  const tabs = $$('[data-filter]');
  const search = $('[data-search-input]');
  let filter = 'all';
  function applyFilter() {
    const q = (search?.value || '').trim();
    let shown = 0;
    $$('[data-group]').forEach(g => {
      let n = 0;
      $$('.dish', g).forEach(d => {
        const ok = (filter === 'all' || g.dataset.group === filter) && (!q || d.dataset.search.includes(q));
        d.hidden = !ok; if (ok) n++;
      });
      g.hidden = !n; shown += n;
    });
    const nr = $('[data-no-results]'); if (nr) nr.hidden = !!shown;
  }
  tabs.forEach(t => t.addEventListener('click', () => {
    filter = t.dataset.filter;
    tabs.forEach(x => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-selected', String(x === t)); });
    applyFilter();
  }));
  search?.addEventListener('input', applyFilter);

  // ——— قائمة الموبايل ———
  const mb = $('[data-menu]'), mn = $('[data-mnav]');
  mb?.addEventListener('click', () => { mn.hidden = !mn.hidden; mb.setAttribute('aria-expanded', String(!mn.hidden)); });
  mn?.addEventListener('click', (e) => { if (e.target.closest('a')) { mn.hidden = true; mb.setAttribute('aria-expanded', 'false'); } });

  let tt;
  function toast(msg) {
    const t = $('[data-toast]');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1800);
  }

  render();
})();
