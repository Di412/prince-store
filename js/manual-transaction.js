/* ==========================================================
   TAMBAH TRANSAKSI MANUAL — Dashboard Keuangan (Prince Store)
   Pasang SETELAH dashboard-ui.js dan order-detail-popup.js
   ========================================================== */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var rp = function (n) { return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID'); };
  var GAME_ORDER = ['mlbb', 'ff', 'roblox'];
  var GAME_NAME = { mlbb: 'Mobile Legends', ff: 'Free Fire', roblox: 'Roblox' };

  var products = [], payments = [];

  /* ---------- CSS ---------- */
  var style = document.createElement('style');
  style.textContent = '\
  #mtxOverlay{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.65);backdrop-filter:blur(3px)}\
  #mtxOverlay.open{display:flex}\
  .mtx-modal{background:var(--card,#fff);color:var(--text,#111);border:1px solid var(--line,#e5e7eb);border-radius:18px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 25px 60px rgba(0,0,0,.4)}\
  .mtx-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}\
  .mtx-head h2{margin:0;font-size:1.1rem}\
  .mtx-x{border:1px solid var(--line,#e5e7eb);background:transparent;color:inherit;width:34px;height:34px;border-radius:50%;font-size:18px;cursor:pointer}\
  .mtx-f{margin-bottom:12px}\
  .mtx-f label{display:block;font-size:12px;font-weight:700;color:var(--muted,#6b7280);margin-bottom:4px}\
  .mtx-f input,.mtx-f select{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1px solid var(--line,#d1d5db);background:var(--bg,transparent);color:var(--text,#111);font-size:14px}\
  .mtx-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}\
  .mtx-sum{border:1px dashed var(--line,#d1d5db);border-radius:10px;padding:10px 12px;margin:4px 0 12px;font-size:.88rem}\
  .mtx-sum div{display:flex;justify-content:space-between;padding:2px 0}\
  .mtx-sum .t{font-weight:800;font-size:1rem}\
  .mtx-save{width:100%;padding:12px;border:0;border-radius:10px;background:#10b981;color:#fff;font-weight:700;cursor:pointer}\
  .mtx-save[disabled]{opacity:.6;cursor:wait}\
  .mtx-msg{font-size:.82rem;margin-top:10px;min-height:1.1em;color:var(--muted,#6b7280)}\
  .mtx-msg.err{color:#ef4444}\
  .mtx-x:focus-visible,.mtx-save:focus-visible,.mtx-f input:focus-visible,.mtx-f select:focus-visible{outline:3px solid #2563eb;outline-offset:2px}\
  @media (max-width:420px){.mtx-2{grid-template-columns:1fr}}';
  document.head.appendChild(style);

  /* ---------- HTML ---------- */
  var ov = document.createElement('div');
  ov.id = 'mtxOverlay';
  ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML =
    '<div class="mtx-modal" role="dialog" aria-modal="true" aria-labelledby="mtxTitle">' +
      '<div class="mtx-head"><h2 id="mtxTitle">Tambah transaksi manual</h2>' +
        '<button type="button" class="mtx-x" id="mtxClose" aria-label="Tutup">&times;</button></div>' +
      '<div class="mtx-2">' +
        '<div class="mtx-f"><label for="mtxGame">Game</label><select id="mtxGame"></select></div>' +
        '<div class="mtx-f"><label for="mtxProd">Produk</label><select id="mtxProd"></select></div>' +
      '</div>' +
      '<div class="mtx-f"><label for="mtxPay">Metode pembayaran</label><select id="mtxPay"></select></div>' +
      '<div class="mtx-f"><label for="mtxName">Nama pembeli (opsional)</label><input id="mtxName" maxlength="50" placeholder="mis. Budi Santoso"></div>' +
      '<div class="mtx-2">' +
        '<div class="mtx-f"><label for="mtxTarget">ID game / target (opsional)</label><input id="mtxTarget" maxlength="60" placeholder="mis. 12345678 (1234)"></div>' +
        '<div class="mtx-f"><label for="mtxWa">No. WhatsApp (opsional)</label><input id="mtxWa" maxlength="20" inputmode="tel" placeholder="08xxxxxxxxxx"></div>' +
      '</div>' +
      '<div class="mtx-f"><label for="mtxDate">Tanggal &amp; jam transaksi</label><input type="datetime-local" id="mtxDate"></div>' +
      '<div class="mtx-sum" id="mtxSum"></div>' +
      '<button type="button" class="mtx-save" id="mtxSave">Simpan transaksi</button>' +
      '<div class="mtx-msg" id="mtxMsg" role="status"></div>' +
    '</div>';
  document.body.appendChild(ov);

  /* ---------- Tombol di Riwayat Transaksi ---------- */
  function addButton() {
    var panel = $('dbpanel');
    if (!panel || $('mtx-open')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'mtx-open';
    b.className = 'pri';
    b.textContent = '+ Tambah Transaksi';
    b.style.marginBottom = '12px';
    b.addEventListener('click', openModal);
    panel.insertBefore(b, panel.firstChild);
  }

  /* ---------- Isi form ---------- */
  function nowLocal() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  function fillGames() {
    var present = GAME_ORDER.filter(function (g) {
      return products.some(function (p) { return String(p.game).toLowerCase() === g; });
    });
    $('mtxGame').innerHTML = present.map(function (g) {
      return '<option value="' + g + '">' + esc(GAME_NAME[g]) + '</option>';
    }).join('');
  }

  function fillProducts() {
    var g = $('mtxGame').value;
    var list = products.filter(function (p) { return String(p.game).toLowerCase() === g; });
    $('mtxProd').innerHTML = list.map(function (p) {
      return '<option value="' + esc(p.id) + '">' + esc(p.nama) + ' — ' + esc(rp(p.harga)) + '</option>';
    }).join('');
  }

  function fillPayments() {
    $('mtxPay').innerHTML = payments.map(function (m) {
      return '<option value="' + esc(m.id) + '">' + esc(m.nama) + '</option>';
    }).join('');
  }

  function selected() {
    var prod = products.filter(function (p) { return String(p.id) === $('mtxProd').value; })[0];
    var pay = payments.filter(function (m) { return m.id === $('mtxPay').value; })[0];
    return { prod: prod, pay: pay };
  }

  function updateSummary() {
    var s = selected();
    if (!s.prod || !s.pay) { $('mtxSum').innerHTML = '<div>Pilih produk dan metode pembayaran.</div>'; return; }
    var harga = Number(s.prod.harga) || 0, fee = Number(s.pay.biaya) || 0, modal = Number(s.prod.harga_modal) || 0;
    $('mtxSum').innerHTML =
      '<div><span>Harga item</span><span>' + esc(rp(harga)) + '</span></div>' +
      '<div><span>Biaya admin</span><span>' + esc(rp(fee)) + '</span></div>' +
      '<div class="t"><span>Total dibayar</span><span>' + esc(rp(harga + fee)) + '</span></div>' +
      '<div><span>Modal</span><span>' + esc(rp(modal)) + '</span></div>' +
      '<div><span>Laba kotor</span><span>' + esc(rp(harga - modal)) + '</span></div>';
  }

  function setMsg(text, isErr) {
    var m = $('mtxMsg');
    m.textContent = text || '';
    m.classList.toggle('err', !!isErr);
  }

  async function openModal() {
    setMsg('Memuat data produk…');
    $('mtxSave').disabled = true;
    ov.classList.add('open');
    ov.setAttribute('aria-hidden', 'false');
    $('mtxClose').focus();
    try {
      var res = await Promise.all([apiFetch('/api/admin/products'), apiFetch('/api/admin/payments')]);
      products = Array.isArray(res[0]) ? res[0] : [];
      payments = Array.isArray(res[1]) ? res[1] : [];
      if (!products.length || !payments.length) { setMsg('Produk atau metode pembayaran belum tersedia.', true); return; }
      fillGames(); fillProducts(); fillPayments();
      $('mtxName').value = ''; $('mtxTarget').value = ''; $('mtxWa').value = '';
      $('mtxDate').value = nowLocal();
      updateSummary();
      setMsg('');
      $('mtxSave').disabled = false;
    } catch (err) {
      setMsg('Gagal memuat data: ' + err.message, true);
    }
  }

  function closeModal() {
    ov.classList.remove('open');
    ov.setAttribute('aria-hidden', 'true');
  }

  /* ---------- Simpan ---------- */
  async function save() {
    var s = selected();
    if (!s.prod) { setMsg('Pilih produk terlebih dahulu.', true); return; }
    if (!s.pay) { setMsg('Pilih metode pembayaran.', true); return; }

    var createdAt = '';
    if ($('mtxDate').value) {
      var d = new Date($('mtxDate').value);
      if (!isNaN(d.getTime())) createdAt = d.toISOString().slice(0, 19).replace('T', ' '); // UTC, sama seperti database
    }

    $('mtxSave').disabled = true;
    setMsg('Menyimpan…');
    try {
      var r = await apiFetch('/api/admin/add-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: $('mtxGame').value,
          produk_id: s.prod.id,
          metode_id: s.pay.id,
          nama: $('mtxName').value.trim(),
          target: $('mtxTarget').value.trim(),
          wa: $('mtxWa').value.trim(),
          created_at: createdAt
        })
      });
      setMsg('Tersimpan ✔ ' + ((r && r.orderId) || ''));
      if (typeof loadOrders === 'function') {
        loadOrders().then(function () {
          if (typeof renderTransactionTable === 'function') renderTransactionTable(globalOrdersData);
        }).catch(function () {});
      }
      setTimeout(closeModal, 900);
    } catch (err) {
      setMsg('Gagal menyimpan: ' + err.message, true);
      $('mtxSave').disabled = false;
    }
  }

  /* ---------- Event ---------- */
  $('mtxGame').addEventListener('change', function () { fillProducts(); updateSummary(); });
  $('mtxProd').addEventListener('change', updateSummary);
  $('mtxPay').addEventListener('change', updateSummary);
  $('mtxSave').addEventListener('click', save);
  $('mtxClose').addEventListener('click', closeModal);
  ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ov.classList.contains('open')) closeModal();
  });

  addButton();
})();