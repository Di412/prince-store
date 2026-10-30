/* dashboard-recap.js */
(function () {
  'use strict';

  var DONE = ['Selesai', 'Sukses'];
  var rcProducts = [];      
  var productsFetched = false;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var rp = function (n) { return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID'); };
  var status = function (o) { return String(o.status || '').trim(); };
  var isDone = function (o) { return DONE.indexOf(status(o)) !== -1; };
  var price = function (o) { return Number(o.harga_produk) || 0; };
  var modal = function (o) { return Number(o.modal_produk) || 0; };
  
  var sum = function (arr) { return arr.reduce(function (t, o) { return t + price(o); }, 0); };
  var sumModal = function (arr) { return arr.reduce(function (t, o) { return t + modal(o); }, 0); };
  
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var key = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var dmy = function (k) { var p = k.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; };

  function gameLabel(g) {
    var k = String(g || 'lainnya').toLowerCase();
    var map = (typeof GAME_LABEL !== 'undefined') ? GAME_LABEL : {};
    return map[k] || k.toUpperCase();
  }
  function orders() {
    return (typeof globalOrdersData !== 'undefined' && Array.isArray(globalOrdersData)) ? globalOrdersData : [];
  }
  function validProduct(p) { return String(p.nama || '').trim() !== '' && Number(p.harga) > 0; }

  function range() {
    var f = $('from'), t = $('to');
    return { from: f ? f.value : '', to: t ? t.value : '' };
  }
  function inRange(o, r) {
    if (!r.from && !r.to) return true;
    var d = new Date(o.created_at);
    if (isNaN(d.getTime())) return false;
    var k = key(d);
    return (!r.from || k >= r.from) && (!r.to || k <= r.to);
  }
  function filtered() { var r = range(); return orders().filter(function (o) { return inRange(o, r); }); }
  function periodText() {
    var r = range();
    if (!r.from && !r.to) return 'Periode: semua tanggal';
    if (r.from && r.to) return 'Periode: ' + dmy(r.from) + ' – ' + dmy(r.to);
    return r.from ? 'Periode: mulai ' + dmy(r.from) : 'Periode: sampai ' + dmy(r.to);
  }

  var H2 = '<h2 style="font-size:.95rem;margin:16px 0 8px">';
  function table(head, rows, empty) {
    if (!rows.length) return '<p class="note">' + empty + '</p>';
    var th = head.map(function (h, i) {
      return '<th style="padding:10px 12px;color:var(--muted);text-align:' + (i ? 'right' : 'left') + ';">' + esc(h) + '</th>';
    }).join('');
    var tr = rows.map(function (r) {
      return '<tr style="border-bottom:1px solid var(--line-soft);">' + r.map(function (c, i) {
        return '<td style="padding:10px 12px;text-align:' + (i ? 'right' : 'left') + ';">' + c + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:14px;">' +
      '<thead><tr style="border-bottom:2px solid var(--line);">' + th + '</tr></thead><tbody>' + tr + '</tbody></table></div>';
  }
  function stat(label, value, sub) {
    return '<div class="card"><div class="l">' + esc(label) + '</div>' +
      '<div class="v" style="font-size:1.25rem;">' + value + '</div>' +
      (sub ? '<div class="note" style="margin:4px 0 0">' + sub + '</div>' : '') + '</div>';
  }
  var bold = function (s) { return '<b>' + s + '</b>'; };

  function inject(id, anchorSel, pos) {
    if ($(id)) return;
    var a = document.querySelector(anchorSel);
    if (!a) return;
    var d = document.createElement('div');
    d.id = id; d.className = 'panel'; d.style.marginBottom = '16px';
    a.insertAdjacentElement(pos, d);
  }

  function renderHome() {
    var all = orders();
    var set = function (id, v) { var el = $(id); if (el) el.textContent = v; };
    set('home-done', all.filter(isDone).length);
    var prods = (typeof catalogData !== 'undefined' && catalogData.length) ? catalogData : rcProducts;
    set('home-products', prods.filter(validProduct).length);

    var box = $('rc-home'); if (!box) return;

    var now = new Date(), todayK = key(now);
    var k7 = key(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
    var monthK = todayK.slice(0, 7);
    function win(pred) {
      var m = all.filter(function (o) {
        if (!isDone(o)) return false;
        var d = new Date(o.created_at);
        return !isNaN(d.getTime()) && pred(key(d));
      });
      return { n: m.length, rev: sum(m), profit: sum(m) - sumModal(m) };
    }
    var w1 = win(function (k) { return k === todayK; });
    var w7 = win(function (k) { return k >= k7 && k <= todayK; });
    var wm = win(function (k) { return k.slice(0, 7) === monthK; });
    var sub = function (w) { return w.n + ' pesanan (Laba: ' + rp(w.profit) + ')'; };

    var data = filtered(), g = {};
    data.forEach(function (o) {
      var k = String(o.game || 'lainnya').toLowerCase();
      var x = g[k] = g[k] || { n: 0, done: 0, rev: 0, profit: 0 };
      x.n++;
      if (isDone(o)) { 
          x.done++; 
          x.rev += price(o); 
          x.profit += price(o) - modal(o);
      }
    });
    var keys = Object.keys(g).sort(function (a, b) { return g[b].rev - g[a].rev; });
    var rows = keys.map(function (k) {
      return [esc(gameLabel(k)), g[k].n, g[k].done, rp(g[k].rev), rp(g[k].profit)];
    });
    if (rows.length) {
      var tn = 0, td = 0, tr = 0, tp = 0;
      keys.forEach(function (k) { tn += g[k].n; td += g[k].done; tr += g[k].rev; tp += g[k].profit; });
      rows.push([bold('Total'), bold(tn), bold(td), bold(rp(tr)), bold(rp(tp))]);
    }

    box.innerHTML =
      '<h2>Recap pendapatan</h2>' +
      '<p class="note">Pendapatan dihitung dari pesanan berstatus Selesai/Sukses.</p>' +
      '<div class="cards">' +
        stat('Hari ini', rp(w1.rev), sub(w1)) +
        stat('7 hari terakhir', rp(w7.rev), sub(w7)) +
        stat('Bulan ini', rp(wm.rev), sub(wm)) +
      '</div>' +
      H2 + 'Per game <span class="note" style="font-weight:400">(' + esc(periodText()) + ')</span></h2>' +
      table(['Game', 'Pesanan', 'Selesai', 'Pendapatan', 'Laba Kotor'], rows, 'Belum ada pesanan pada periode ini.');
  }

  function renderOrd() {
    var box = $('rc-ord'); if (!box) return;
    var data = filtered();
    var defs = [
      ['Perlu diproses', function (o) { return status(o) === 'Diproses'; }],
      ['Menunggu pembayaran', function (o) { return status(o) === 'Menunggu Pembayaran'; }],
      ['Selesai', isDone]
    ];
    var rows = defs.map(function (d) {
      var m = data.filter(d[1]);
      return [d[0], m.length, rp(sum(m))];
    });
    var other = data.filter(function (o) { return !defs.some(function (d) { return d[1](o); }); });
    if (other.length) rows.push(['Lainnya', other.length, rp(sum(other))]);
    rows.push([bold('Total'), bold(data.length), bold(rp(sum(data)))]);

    var g = {};
    data.forEach(function (o) {
      var s = status(o);
      if (s !== 'Diproses' && s !== 'Menunggu Pembayaran') return;
      var k = String(o.game || 'lainnya').toLowerCase();
      var x = g[k] = g[k] || { proses: 0, bayar: 0 };
      if (s === 'Diproses') x.proses++; else x.bayar++;
    });
    var grows = Object.keys(g).map(function (k) { return [esc(gameLabel(k)), g[k].proses, g[k].bayar]; });

    box.innerHTML =
      '<h2>Recap pesanan</h2>' +
      '<p class="note">' + esc(periodText()) + '</p>' +
      table(['Status', 'Jumlah', 'Nominal'], rows, 'Belum ada pesanan.') +
      H2 + 'Pesanan yang masih berjalan, per game</h2>' +
      table(['Game', 'Perlu diproses', 'Menunggu bayar'], grows, 'Tidak ada pesanan yang sedang berjalan.');
  }

  function renderPay() {
    var box = $('rc-pay'); if (!box) return;
    var pd = (typeof payData !== 'undefined' && Array.isArray(payData)) ? payData : [];
    var map = {}, order = [];
    pd.forEach(function (m) {
      var id = String(m.id != null ? m.id : m.nama).toLowerCase();
      map[id] = { nama: m.nama, aktif: !!m.aktif, n: 0, wait: 0, done: 0, rev: 0 };
      order.push(id);
    });
    filtered().forEach(function (o) {
      var id = String(o.method || 'unknown').toLowerCase();
      if (!map[id]) { map[id] = { nama: id.toUpperCase(), aktif: null, n: 0, wait: 0, done: 0, rev: 0 }; order.push(id); }
      var x = map[id], s = status(o);
      x.n++;
      if (s === 'Menunggu Pembayaran') x.wait++;
      if (isDone(o)) { x.done++; x.rev += price(o); }
    });
    var rows = order.map(function (id) {
      var x = map[id];
      var st = x.aktif === null ? '-' : (x.aktif ? 'Tampil' : 'Disembunyikan');
      return [esc(x.nama), st, x.n, x.wait, x.done, rp(x.rev)];
    });
    var aktif = pd.filter(function (m) { return m.aktif; }).length;
    var info = pd.length
      ? aktif + ' dari ' + pd.length + ' metode tampil di website. '
      : 'Daftar metode belum dimuat. ';
    box.innerHTML =
      '<h2>Recap pembayaran</h2>' +
      '<p class="note">' + esc(info + periodText()) + '</p>' +
      table(['Metode', 'Di website', 'Pesanan', 'Menunggu bayar', 'Selesai', 'Pendapatan'], rows, 'Belum ada data pembayaran.');
  }

  function renderKat() {
    var box = $('rc-kat'); if (!box) return;
    var list = (typeof catalogData !== 'undefined' && Array.isArray(catalogData)) ? catalogData : [];
    if (!list.length) {
      box.innerHTML = '<h2>Recap katalog</h2><p class="note">Katalog belum dimuat atau masih kosong.</p>';
      return;
    }
    var g = {};
    list.forEach(function (p) {
      var k = String(p.game || 'lainnya').toLowerCase();
      var x = g[k] = g[k] || { n: 0, prices: [], bad: 0 };
      x.n++;
      if (validProduct(p)) x.prices.push(Number(p.harga)); else x.bad++;
    });
    var tn = 0, tb = 0;
    var rows = Object.keys(g).map(function (k) {
      var x = g[k], pr = x.prices;
      tn += x.n; tb += x.bad;
      var min = pr.length ? Math.min.apply(null, pr) : null;
      var max = pr.length ? Math.max.apply(null, pr) : null;
      var avg = pr.length ? Math.round(pr.reduce(function (a, b) { return a + b; }, 0) / pr.length) : null;
      return [esc(gameLabel(k)), x.n, min == null ? '-' : rp(min), max == null ? '-' : rp(max),
        avg == null ? '-' : rp(avg), x.bad ? '<b style="color:var(--accent)">' + x.bad + '</b>' : '0'];
    });
    rows.push([bold('Total'), bold(tn), '', '', '', bold(tb)]);
    box.innerHTML =
      '<h2>Recap katalog</h2>' +
      '<p class="note">"Belum lengkap" = produk tanpa nama atau harga 0. Perbaiki dulu sebelum menekan Simpan.</p>' +
      table(['Game', 'Produk', 'Termurah', 'Termahal', 'Rata-rata', 'Belum lengkap'], rows, '');
  }

  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn('recap:', e); } }
  function renderAll() { safe(renderHome); safe(renderOrd); safe(renderPay); safe(renderKat); }

  function markUpdated() {
    var u = $('updated');
    if (u) u.textContent = 'Diperbarui ' + formatJamWITA(new Date());
  }
  function loadHomeProducts() {
    if (productsFetched || typeof apiFetch !== 'function') return;
    productsFetched = true;
    apiFetch('/api/admin/products').then(function (p) {
      rcProducts = Array.isArray(p) ? p : [];
      safe(renderHome);
    }).catch(function () { productsFetched = false; });
  }

  function wrap(name, after) {
    var orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function () {
      var r = orig.apply(this, arguments);
      if (r && typeof r.then === 'function') r.then(after, function () {});
      else after();
      return r;
    };
  }

  inject('rc-home', '#sec-home > .panel', 'beforebegin');
  inject('rc-ord', '#sec-ord > h2', 'beforebegin');
  inject('rc-pay', '#sec-pay', 'afterbegin');
  inject('rc-kat', '#kat-sum', 'afterend');

  wrap('loadOrders', function () { markUpdated(); renderAll(); loadHomeProducts(); });
  wrap('loadPayments', function () { safe(renderPay); });
  wrap('renderPayments', function () { safe(renderPay); });
  wrap('payEdit', function () { safe(renderPay); });
  wrap('renderCatalog', function () { safe(renderKat); safe(renderHome); });
  wrap('catalogEdit', function () { safe(renderKat); });

  ['from', 'to'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('change', renderAll);
  });
  var rs = $('reset');
  if (rs) rs.addEventListener('click', function () {
    if ($('from')) $('from').value = '';
    if ($('to')) $('to').value = '';
    renderAll();
  });

  renderAll();
})();