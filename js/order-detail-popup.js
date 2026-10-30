/* ==========================================================
   POPUP RINCIAN PESANAN + STRUK — Dashboard Keuangan (Prince Store)
   Ganti isi js/order-detail-popup.js dengan file ini
   (atau simpan sebagai file baru dan ganti tag <script>-nya).
   Pasang SETELAH dashboard-ui.js.

   Fitur:
   - Klik kartu pesanan -> popup rincian + tombol status
   - Klik "Selesai" (di popup ATAU tombol "Tandai Selesai" di kartu)
     -> muncul struk -> pilih "Kirim ke WA pelanggan" atau "Tidak kirim"
   ========================================================== */
(function () {
  'use strict';

  var STORE_NAME    = 'Prince Store';
  var STORE_TAGLINE = 'Top Up Game Termurah & Tercepat';
  var STORE_WA      = '0821-1328-9026';
  var STORE_SITE    = 'di412.github.io/prince-store';
  var STORE_COMPANY = 'OFFICIAL OF DLANZ COMPANY';
  var LOGO_SRC      = 'logo-profil.png';   // ganti jika logo struk website memakai file lain

  var STATUS = [
    { key: 'Diproses',            label: 'Proses',                     cls: 'odp-proses'  },
    { key: 'Selesai',             label: 'Selesai',                    cls: 'odp-selesai' },
    { key: 'Menunggu Pembayaran', label: 'Menunggu Pembayaran',        cls: 'odp-pending' },
    { key: 'Masalah Transaksi',   label: 'Masalah Transaksi / Server', cls: 'odp-masalah' }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null || s === '' ? '-' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var norm = function (s) { s = String(s || '').trim(); return s === 'Sukses' ? 'Selesai' : s; };
  var rp = function (n) { return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID'); };

  /* ---------- CSS ---------- */
  var style = document.createElement('style');
  style.textContent = '\
  #sec-ord .order-card{cursor:pointer}\
  #odpOverlay,#rcpOverlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.65);backdrop-filter:blur(3px)}\
  #odpOverlay{z-index:9000}\
  #rcpOverlay{z-index:9500}\
  #odpOverlay.open,#rcpOverlay.open{display:flex}\
  .odp-modal{background:var(--card,#fff);color:var(--text,#111);border:1px solid var(--line,#e5e7eb);border-radius:18px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 25px 60px rgba(0,0,0,.4)}\
  .odp-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}\
  .odp-head h2{margin:0;font-size:1.1rem}\
  .odp-x{border:1px solid var(--line,#e5e7eb);background:transparent;color:inherit;width:34px;height:34px;border-radius:50%;font-size:18px;cursor:pointer}\
  .odp-dl{display:grid;grid-template-columns:120px 1fr;gap:9px 12px;margin:0 0 16px;font-size:.92rem}\
  .odp-dl dt{color:var(--muted,#6b7280)}\
  .odp-dl dd{margin:0;font-weight:700;word-break:break-word}\
  .odp-proof{width:100%;padding:12px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-weight:700;cursor:pointer}\
  .odp-title{font-size:.8rem;color:var(--muted,#6b7280);margin:18px 0 8px}\
  .odp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}\
  .odp-st{padding:11px 8px;border-radius:10px;border:2px solid var(--line,#e5e7eb);background:transparent;color:inherit;font-weight:700;font-size:.82rem;cursor:pointer}\
  .odp-st:hover{border-color:#94a3b8}\
  .odp-st.on.odp-proses{border-color:#3b82f6;background:rgba(59,130,246,.2)}\
  .odp-st.on.odp-masalah{border-color:#ef4444;background:rgba(239,68,68,.2)}\
  .odp-st.on.odp-pending{border-color:#f59e0b;background:rgba(245,158,11,.22)}\
  .odp-st.on.odp-selesai{border-color:#10b981;background:rgba(16,185,129,.22)}\
  .odp-st[disabled]{opacity:.6;cursor:wait}\
  .odp-msg{font-size:.8rem;margin-top:10px;min-height:1.1em;color:var(--muted,#6b7280)}\
  .odp-x:focus-visible,.odp-proof:focus-visible,.odp-st:focus-visible,.rcp-btn:focus-visible{outline:3px solid #2563eb;outline-offset:2px}\
  /* struk */\
  .rcp-wrap{width:100%;max-width:340px;max-height:94vh;overflow-y:auto}\
  .rcp-paper{background:#fff;color:#000;border-radius:6px 6px 0 0;padding:22px 16px 16px;font-family:"Courier New",Courier,monospace;font-size:12px;line-height:1.4}\
  .rcp-logo{display:block;margin:0 auto 6px;height:54px;width:auto;max-width:120px;object-fit:contain;filter:brightness(0)}\
  .rcp-store{text-align:center;font-weight:700;font-size:18px;letter-spacing:2px}\
  .rcp-tag{text-align:center;font-size:11px}\
  .rcp-sep{border:0;border-top:1px dashed #000;margin:10px 0}\
  .rcp-h{font-weight:700;font-size:12px;margin:12px 0 4px;letter-spacing:.5px}\
  .rcp-row{display:flex;justify-content:space-between;gap:10px;padding:3px 0}\
  .rcp-row span:first-child{flex-shrink:0}\
  .rcp-row span:last-child{text-align:right;word-break:break-word}\
  .rcp-total{font-weight:700;font-size:14px}\
  .rcp-lunas{text-align:center;font-weight:700;font-size:16px;letter-spacing:2px;margin:6px 0}\
  .rcp-foot{text-align:center;font-size:11px;line-height:1.6}\
  .rcp-off{text-align:center;font-size:10px;letter-spacing:1px;margin-top:10px}\
  .rcp-actions{background:var(--card,#fff);color:var(--text,#111);border-radius:0 0 14px 14px;padding:14px 16px 16px;display:grid;gap:8px}\
  .rcp-actions p{margin:0 0 2px;font-size:.85rem;text-align:center;font-weight:700}\
  .rcp-btn{border:0;border-radius:10px;padding:12px;font-weight:700;font-size:.92rem;cursor:pointer}\
  .rcp-wa{background:#16a34a;color:#fff}\
  .rcp-no{background:transparent;color:inherit;border:2px solid var(--line,#d1d5db)}\
  .rcp-note{font-size:.75rem;color:var(--muted,#6b7280);text-align:center;margin:0}\
  @media (max-width:420px){.odp-dl{grid-template-columns:1fr}.odp-dl dt{margin-top:6px}}';
  document.head.appendChild(style);

  /* ---------- HTML: popup rincian ---------- */
  var wrap = document.createElement('div');
  wrap.id = 'odpOverlay';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="odp-modal" role="dialog" aria-modal="true" aria-labelledby="odpTitle">' +
      '<div class="odp-head"><h2 id="odpTitle">Rincian pesanan</h2>' +
        '<button type="button" class="odp-x" id="odpClose" aria-label="Tutup">&times;</button></div>' +
      '<dl class="odp-dl">' +
        '<dt>ID Pesanan</dt><dd id="odpId"></dd>' +
        '<dt>Game</dt><dd id="odpGame"></dd>' +
        '<dt>Nama Pemesan</dt><dd id="odpName"></dd>' +
        '<dt>Target / ID Server</dt><dd id="odpTarget"></dd>' +
        '<dt>Jumlah Item</dt><dd id="odpItem"></dd>' +
        '<dt>WA Pemesan</dt><dd id="odpWa"></dd>' +
      '</dl>' +
      '<button type="button" class="odp-proof" id="odpProof">🖼 Lihat bukti pembayaran</button>' +
      '<div class="odp-title">Ubah status pesanan</div>' +
      '<div class="odp-grid">' +
        STATUS.map(function (s) {
          return '<button type="button" class="odp-st ' + s.cls + '" data-s="' + s.key + '">' + s.label + '</button>';
        }).join('') +
      '</div>' +
      '<div class="odp-msg" id="odpMsg" role="status"></div>' +
    '</div>';
  document.body.appendChild(wrap);

  /* ---------- HTML: struk ---------- */
  var rcp = document.createElement('div');
  rcp.id = 'rcpOverlay';
  rcp.setAttribute('aria-hidden', 'true');
  rcp.innerHTML =
    '<div class="rcp-wrap" role="dialog" aria-modal="true" aria-label="Struk transaksi">' +
      '<div class="rcp-paper" id="rcpPaper"></div>' +
      '<div class="rcp-actions">' +
        '<p>Kirim struk ke pelanggan?</p>' +
        '<button type="button" class="rcp-btn rcp-wa" id="rcpSend">Kirim ke WA pelanggan</button>' +
        '<button type="button" class="rcp-btn rcp-no" id="rcpSkip">Tidak kirim</button>' +
        '<p class="rcp-note" id="rcpNote"></p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(rcp);

  var current = null;      // pesanan di popup rincian
  var rcpOrder = null;     // data yang sedang ditampilkan di struk
  var rcpData = null;

  function orders() {
    return (typeof globalOrdersData !== 'undefined' && Array.isArray(globalOrdersData)) ? globalOrdersData : [];
  }
  function findOrder(id) {
    return orders().filter(function (o) { return String(o.id_transaksi) === String(id); })[0];
  }
  function customerName(o) { return o.nama_pemesan || o.nama || o.name || o.customer_name || o.username || '-'; }

  /* ---------- Popup rincian ---------- */
  function markActive() {
    var cur = norm(current && current.status);
    Array.prototype.forEach.call(wrap.querySelectorAll('.odp-st'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-s') === cur);
    });
  }

  function open(order) {
    current = order;
    $('odpId').textContent = order.id_transaksi || '-';
    $('odpGame').textContent = order.game ? String(order.game).toUpperCase() : '-';
    $('odpName').textContent = customerName(order);
    $('odpTarget').textContent = order.target || '-';
    $('odpItem').textContent = order.nama_produk
      ? order.nama_produk + (order.item ? ' (Item ID: ' + order.item + ')' : '')
      : (order.item || '-');
    $('odpWa').textContent = order.wa || '-';
    $('odpMsg').textContent = '';
    markActive();
    wrap.classList.add('open');
    wrap.setAttribute('aria-hidden', 'false');
    $('odpClose').focus();
  }

  function close() {
    wrap.classList.remove('open');
    wrap.setAttribute('aria-hidden', 'true');
    current = null;
  }

  var sec = $('sec-ord');
  if (sec) {
    sec.addEventListener('click', function (e) {
      if (e.target.closest('button, a, input, select, textarea')) return;
      var card = e.target.closest('.order-card');
      if (!card) return;
      var order = findOrder(card.getAttribute('data-order-id'));
      if (order) open(order);
    });
  }

  /* Dipanggil dari Beranda (dashboard-ui.js): buka popup rincian untuk satu pesanan */
  window.openOrderDetail = function (id) {
    var order = findOrder(id);
    if (order) open(order);
  };

  $('odpProof').addEventListener('click', function () {
    if (!current) return;
    if (typeof openPaymentProof === 'function') {
      openPaymentProof(String(current.id_transaksi || ''), String(current.wa || ''), getProofUrl(current));
    }
  });

  /* ---------- Biaya admin dari metode pembayaran ---------- */
  var payCache = null;
  async function getPayments() {
    if (payCache) return payCache;
    try {
      var list = await apiFetch('/api/admin/payments');
      var map = {};
      (Array.isArray(list) ? list : []).forEach(function (p) { map[p.id] = { nama: p.nama, biaya: Number(p.biaya) || 0 }; });
      payCache = map;
      return map;
    } catch (e) { return {}; }
  }

  /* ---------- Struk ---------- */
  function waNumber(raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.indexOf('62') === 0) return d;
    if (d.charAt(0) === '0') return '62' + d.slice(1);
    return '62' + d;
  }

  // created_at dari database bertipe UTC ("2026-10-30 10:44:32"); tampilkan dalam WITA.
  // Memakai formatTanggalJamWITA dari dashboard-app.js bila ada, jika tidak memakai cadangan di bawah.
  function fmtDate(v) {
    if (typeof formatTanggalJamWITA === 'function') return formatTanggalJamWITA(v);
    var t = String(v || '').trim();
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(t)) t = t.replace(' ', 'T') + 'Z';
    var d = new Date(t);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
  }

  function buildReceipt(o, pays) {
    var pay = pays[o.method] || { nama: '', biaya: 0 };
    var harga = Number(o.harga_produk) || 0;
    return {
      id: o.id_transaksi || '-',
      tgl: fmtDate(o.created_at),
      nama: customerName(o),
      game: o.game ? String(o.game).toUpperCase() : '-',
      target: o.target || '-',
      produk: o.nama_produk || ('Item ' + (o.item || '-')),
      metode: pay.nama || (o.method ? String(o.method).toUpperCase() : '-'),
      harga: harga,
      fee: pay.biaya,
      total: harga + pay.biaya,
      wa: o.wa || ''
    };
  }

  function receiptText(r) {
    return [
      '*' + STORE_NAME.toUpperCase() + '*',
      STORE_TAGLINE,
      'WA: ' + STORE_WA,
      '------------------------------',
      'Tanggal    : ' + r.tgl,
      'ID Trx     : ' + r.id,
      'Nama       : ' + r.nama,
      'Pelanggan  : ' + r.wa,
      '',
      '*DETAIL PESANAN*',
      'Game       : ' + r.game,
      'Target Akun: ' + r.target,
      'Item       : ' + r.produk,
      'Metode     : ' + r.metode,
      '',
      '*RINCIAN BIAYA*',
      'Harga Item : ' + rp(r.harga),
      'Biaya Admin: ' + rp(r.fee),
      '------------------------------',
      '*TOTAL      : ' + rp(r.total) + '*',
      '------------------------------',
      '*** LUNAS ***',
      '',
      'Terima kasih telah bertransaksi di ' + STORE_NAME.toUpperCase() + ' 🙏',
      'Simpan struk ini untuk menjadi bukti.',
      'Website: ' + STORE_SITE
    ].join('\n');
  }

  async function showReceipt(order) {
    rcpOrder = order;
    var pays = await getPayments();
    rcpData = buildReceipt(order, pays);
    var r = rcpData;
    var row = function (k, v, cls) {
      return '<div class="rcp-row' + (cls ? ' ' + cls : '') + '"><span>' + k + '</span><span>' + esc(v) + '</span></div>';
    };
    $('rcpPaper').innerHTML =
      '<img class="rcp-logo" src="' + esc(LOGO_SRC) + '" alt="" onerror="this.remove()">' +
      '<div class="rcp-store">' + esc(STORE_NAME.toUpperCase()) + '</div>' +
      '<div class="rcp-tag">' + esc(STORE_TAGLINE) + '</div>' +
      '<div class="rcp-tag">WA: ' + esc(STORE_WA) + '</div>' +
      '<hr class="rcp-sep">' +
      row('Tanggal', r.tgl) + row('ID Trx', r.id) + row('Nama', r.nama) + row('Pelanggan', r.wa) +
      '<div class="rcp-h">DETAIL PESANAN</div><hr class="rcp-sep" style="margin-top:0">' +
      row('Game', r.game) + row('Target Akun', r.target) + row('Item', r.produk) + row('Metode', r.metode) +
      '<div class="rcp-h">RINCIAN BIAYA</div><hr class="rcp-sep" style="margin-top:0">' +
      row('Harga Item', rp(r.harga)) + row('Biaya Admin', rp(r.fee)) +
      '<hr class="rcp-sep">' +
      row('TOTAL', rp(r.total), 'rcp-total') +
      '<hr class="rcp-sep">' +
      '<div class="rcp-lunas">*** LUNAS ***</div>' +
      '<hr class="rcp-sep">' +
      '<div class="rcp-foot"><b>Terima kasih telah bertransaksi di<br>' + esc(STORE_NAME.toUpperCase()) + '</b><br>' +
        'Simpan struk ini untuk menjadi bukti<br>Website: <b>' + esc(STORE_SITE) + '</b></div>' +
      '<div class="rcp-off">' + esc(STORE_COMPANY) + '</div>';

    var hasWa = !!waNumber(r.wa);
    $('rcpSend').disabled = !hasWa;
    $('rcpNote').textContent = hasWa
      ? 'WhatsApp akan terbuka dengan pesan siap kirim ke ' + r.wa + '. Tekan Kirim di WhatsApp.'
      : 'Nomor WA pelanggan tidak tersedia.';
    rcp.classList.add('open');
    rcp.setAttribute('aria-hidden', 'false');
    $('rcpSkip').focus();
  }

  function closeReceipt() {
    rcp.classList.remove('open');
    rcp.setAttribute('aria-hidden', 'true');
    rcpOrder = null; rcpData = null;
  }

  $('rcpSend').addEventListener('click', function () {
    if (!rcpData) return;
    var num = waNumber(rcpData.wa);
    if (!num) return;
    window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(receiptText(rcpData)), '_blank', 'noopener');
    closeReceipt();
  });
  $('rcpSkip').addEventListener('click', closeReceipt);
  rcp.addEventListener('click', function (e) { if (e.target === rcp) closeReceipt(); });

  /* ---------- Ubah status dari popup ---------- */
  Array.prototype.forEach.call(wrap.querySelectorAll('.odp-st'), function (btn) {
    btn.addEventListener('click', async function () {
      if (!current) return;
      var s = btn.getAttribute('data-s');

      // Sudah Selesai lalu klik Selesai lagi: tampilkan struk saja (untuk kirim ulang)
      if (s === 'Selesai' && norm(current.status) === 'Selesai') { showReceipt(current); return; }

      var all = wrap.querySelectorAll('.odp-st');
      Array.prototype.forEach.call(all, function (b) { b.disabled = true; });
      $('odpMsg').textContent = 'Menyimpan…';
      try {
        await apiFetch('/api/admin/update-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: current.id_transaksi, status: s })
        });
        current.status = s;
        markActive();
        $('odpMsg').textContent = 'Status diubah menjadi "' + s + '".';
        var done = current;
        if (typeof loadOrders === 'function') loadOrders();
        if (s === 'Selesai') showReceipt(done);
      } catch (err) {
        $('odpMsg').textContent = 'Gagal mengubah status: ' + err.message;
      } finally {
        Array.prototype.forEach.call(all, function (b) { b.disabled = false; });
      }
    });
  });

  /* ---------- Tombol "Tandai Selesai" di kartu: ikut memunculkan struk ---------- */
  var origUbah = window.ubahStatus;
  window.ubahStatus = async function (orderId, statusBaru) {
    if (statusBaru !== 'Selesai') {
      return typeof origUbah === 'function' ? origUbah.apply(this, arguments) : undefined;
    }
    if (!confirm('Ubah status pesanan ' + orderId + ' menjadi Selesai?')) return;
    var order = findOrder(orderId);
    try {
      await apiFetch('/api/admin/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId, status: 'Selesai' })
      });
    } catch (err) { alert('Gagal: ' + err.message); return; }
    if (order) order.status = 'Selesai';
    if (typeof loadOrders === 'function') loadOrders();
    if (order) showReceipt(order);
  };

  /* ---------- Tutup ---------- */
  $('odpClose').addEventListener('click', close);
  wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (rcp.classList.contains('open')) { closeReceipt(); return; }
    var pm = $('proofModal');
    if (wrap.classList.contains('open') && (!pm || pm.hidden)) close();
  });
})();