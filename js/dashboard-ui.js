/* dashboard-ui.js
   Pelengkap tampilan baru (dipakai bersama css/dashboard-ui.css):
   - grafik pendapatan + pilihan periode di kotak Laba Bersih
   - tombol aksi cepat dan daftar "Pesanan terbaru" di Beranda
   - tab menu bawah di HP, dan foto profil di header
*/
(function () {
  'use strict';

  var DONE = ['Selesai', 'Sukses'];
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var rp = function (n) { return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID'); };
  var status = function (o) { return String(o.status || '').trim(); };
  var isDone = function (o) { return DONE.indexOf(status(o)) !== -1; };
  var price = function (o) { return Number(o.harga_produk) || 0; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var key = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var safe = function (fn) { try { fn(); } catch (e) { if (window.console) console.warn('ui:', e); } };

  function orders() {
    return (typeof globalOrdersData !== 'undefined' && Array.isArray(globalOrdersData)) ? globalOrdersData : [];
  }
  function gameLabel(g) {
    var k = String(g || 'lainnya').toLowerCase();
    var map = (typeof GAME_LABEL !== 'undefined') ? GAME_LABEL : {};
    return map[k] || k.toUpperCase();
  }
  function go(view) {
    var b = document.querySelector('.nav[data-v="' + view + '"]');
    if (b) b.click();
  }

  // ---------- ikon sederhana ----------
  function icon(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  var IC = {
    home: icon('<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>'),
    inbox: icon('<path d="M4 13l2-8h12l2 8v6H4z"/><path d="M4 13h5l1 2h4l1-2h5"/>'),
    card: icon('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/>'),
    chart: icon('<path d="M5 20V10M12 20V4M19 20v-7"/>'),
    box: icon('<path d="M12 3l8 4v10l-8 4-8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/>'),
    menu: icon('<path d="M4 7h16M4 12h16M4 17h10"/>')
  };

  // ---------- 1. foto profil di header & logo sidebar ----------
  function buildAvatar() {
    var t = $('theme-toggle');
    if (!t || document.querySelector('.hdr-right')) return;
    
    // Tambahkan CSS untuk menyesuaikan logo di Header & Sidebar
    if (!document.getElementById('avatar-styles')) {
      var style = document.createElement('style');
      style.id = 'avatar-styles';
      style.innerHTML = `
        .avatar, .brand img { transition: all 0.3s ease; }
        
        /* --- MODE GELAP (DEFAULT) --- */
        .brand span {
          color: #000000 !important; /* Tulisan Official Finance menjadi Hitam */
        }

        /* --- MODE TERANG (LIGHT MODE) --- */
        /* Saat mode terang, beri background gelap dan border pada logo Header */
        body.light-mode .avatar {
          background-color: #0f172a !important;
          border: 2px solid #334155 !important;
          padding: 2px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        /* Saat mode terang, beri background gelap dan border pada logo Sidebar */
        body.light-mode .brand img {
          background-color: #0f172a !important;
          border: 2px solid #334155 !important;
          padding: 2px;
          border-radius: 8px;
        }
        
        /* Tulisan Official Finance di mode terang menjadi Kuning Gelap */
        body.light-mode .brand span {
          color: #ca8a04 !important; 
        }
      `;
      document.head.appendChild(style);
    }

    var right = document.createElement('div');
    right.className = 'hdr-right';
    t.parentNode.insertBefore(right, t);
    right.appendChild(t);
    var img = document.createElement('img');
    img.className = 'avatar';
    img.alt = 'Prince Store';
    img.src = 'logo-profil.png';
    img.onerror = function () { img.style.display = 'none'; };
    right.appendChild(img);
  }

  // ---------- 1b. sapaan "Welcome, Bos Prince" ----------
  function buildGreeting() {
    var t = $('ptitle');
    if (!t || document.querySelector('.greet')) return;
    var g = document.createElement('div');
    g.className = 'greet';
    
    g.innerHTML = '<small class="txt-welcome">Welcome,</small><b class="txt-name">Bos Prince</b>';
    
    if (!document.getElementById('greet-styles')) {
      var style = document.createElement('style');
      style.id = 'greet-styles';
      style.innerHTML = `
        /* --- MODE GELAP (DEFAULT) --- */
        .txt-welcome { color: #facc15 !important; } /* Kuning Terang */
        .txt-name { color: #ffffff !important; }    /* Putih */

        /* --- MODE TERANG (LIGHT MODE) --- */
        body.light-mode .txt-welcome { color: #000000 !important; } /* Hitam */
        body.light-mode .txt-name { 
          color: #facc15 !important; /* Kuning Terang */
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; 
        }
      `;
      document.head.appendChild(style);
    }

    t.parentNode.insertBefore(g, t);
    var sync = function () { document.body.classList.toggle('is-home', t.textContent.trim() === 'Beranda'); };
    sync();
    new MutationObserver(sync).observe(t, { childList: true, characterData: true, subtree: true });
  }

  // ---------- 1c. angka Laba Bersih: hijau + panah naik ----------
  function buildProfitTone() {
    var el = $('h-bersih');
    if (!el) return;
    var tone = function () {
      var txt = el.textContent || '';
      var val = parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;
      var neg = /-|−/.test(txt);
      el.classList.toggle('up', val > 0 && !neg);
      el.classList.toggle('down', val > 0 && neg);
    };
    tone();
    new MutationObserver(tone).observe(el, { childList: true, characterData: true, subtree: true });
  }

  // ---------- 2. grafik pendapatan di kotak Laba Bersih ----------
  var range = '7';
  var RANGES = [['7', '7 hari'], ['30', '30 hari'], ['90', '90 hari'], ['all', 'Semua']];

  function buildSpark() {
    var hero = document.querySelector('.hero');
    var anchor = $('h-bersih');
    if (!hero || !anchor || $('ui-spark')) return;
    var box = document.createElement('div');
    box.id = 'ui-spark';
    box.className = 'spark';
    box.innerHTML =
      '<div class="spark-cap">Pendapatan harian</div>' +
      '<div class="spark-delta" id="ui-delta"></div>' +
      '<div class="spark-box" id="ui-sparkbox">' +
        '<svg viewBox="0 0 300 84" preserveAspectRatio="none" aria-hidden="true">' +
          '<defs><linearGradient id="ui-grad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop class="sg0" offset="0"/><stop class="sg1" offset="1"/></linearGradient></defs>' +
          '<path class="spark-area" id="ui-area" d=""/>' +
          '<path class="spark-line" id="ui-line" d=""/>' +
        '</svg>' +
        '<span class="spark-dot" id="ui-dot"></span>' +
      '</div>' +
      '<div class="rng" id="ui-rng">' +
        RANGES.map(function (r) {
          return '<button type="button" data-r="' + r[0] + '" class="' + (r[0] === range ? 'on' : '') + '">' + r[1] + '</button>';
        }).join('') +
      '</div>';
    anchor.insertAdjacentElement('afterend', box);
    $('ui-rng').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-r]');
      if (!b) return;
      range = b.getAttribute('data-r');
      Array.prototype.forEach.call($('ui-rng').children, function (x) { x.classList.toggle('on', x === b); });
      safe(drawSpark);
    });
  }

  function daysAgo(today, k) { return new Date(today.getFullYear(), today.getMonth(), today.getDate() - k); }
  function parseKey(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function dailyRevenue() {
    var m = {};
    orders().forEach(function (o) {
      if (!isDone(o)) return;
      var d = new Date(o.created_at);
      if (isNaN(d.getTime())) return;
      var k = key(d);
      m[k] = (m[k] || 0) + price(o);
    });
    return m;
  }

  function smooth(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      var lo = Math.min(p1[1], p2[1]), hi = Math.max(p1[1], p2[1]);
      c1y = Math.max(lo, Math.min(hi, c1y));
      c2y = Math.max(lo, Math.min(hi, c2y));
      d += ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) +
        ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }

  function drawSpark() {
    if (!$('ui-spark')) return;
    var m = dailyRevenue();
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var n;
    if (range === 'all') {
      var ks = Object.keys(m).sort();
      n = ks.length ? Math.max(7, Math.round((today - parseKey(ks[0])) / 864e5) + 1) : 7;
    } else { n = parseInt(range, 10); }
    var step = n > 120 ? 7 : 1;

    var vals = [], total = 0, i, j;
    for (i = n - 1; i >= 0; i -= step) {
      var s = 0;
      for (j = 0; j < step && i - j >= 0; j++) s += m[key(daysAgo(today, i - j))] || 0;
      vals.push(s);
      total += s;
    }
    var prev = 0;
    if (range !== 'all') {
      for (i = n; i < 2 * n; i++) prev += m[key(daysAgo(today, i))] || 0;
    }

    var W = 300, H = 84, top = 8, bot = 6;
    var max = Math.max.apply(null, vals.concat([1]));
    var pts = vals.map(function (v, idx) {
      var x = vals.length > 1 ? idx / (vals.length - 1) * W : W / 2;
      return [x, H - bot - (v / max) * (H - top - bot)];
    });
    var line = smooth(pts);
    var last = pts[pts.length - 1];
    $('ui-line').setAttribute('d', line);
    $('ui-area').setAttribute('d', line + ' L' + W + ',' + H + ' L0,' + H + ' Z');
    var dot = $('ui-dot');
    dot.style.left = (last[0] / W * 100) + '%';
    dot.style.top = (last[1] / H * 100) + '%';

    var el = $('ui-delta'), label = range === 'all' ? 'semua waktu' : n + ' hari';
    var cls = 'spark-delta', html;
    if (total === 0 && prev === 0) {
      cls += ' flat'; html = 'Belum ada pendapatan';
    } else if (range === 'all' || prev === 0) {
      if (total <= 0) cls += ' flat';
      html = esc(rp(total)) + ' <span class="spark-vs">' + esc(label) + '</span>';
    } else {
      var up = total >= prev;
      var pctNum = Math.abs((total - prev) / prev * 100);
      var pct = pctNum > 999 ? '999+' : pctNum.toFixed(1).replace('.', ',');
      if (!up) cls += ' down';
      html = (up ? '↑ ' : '↓ ') + pct + '% (' + (up ? '+' : '−') + esc(rp(Math.abs(total - prev))) + ')' +
        ' <span class="spark-vs">vs ' + n + ' hari sebelumnya</span>';
    }
    el.className = cls;
    el.innerHTML = html;
  }

  // ---------- 3. aksi cepat + pesanan terbaru di Beranda ----------
  function buildHome() {
    var sec = $('sec-home');
    if (!sec) return;
    if (!$('ui-qa')) {
      var qa = document.createElement('div');
      qa.id = 'ui-qa';
      qa.className = 'qa';
      qa.innerHTML = [
        ['pesanan', IC.inbox, 'Pesanan'],
        ['pembayaran', IC.card, 'Pembayaran'],
        ['laporan', IC.chart, 'Laporan'],
        ['katalog', IC.box, 'Katalog']
      ].map(function (a) {
        return '<button type="button" class="qa-i" data-go="' + a[0] + '">' + a[1] + '<span>' + a[2] + '</span></button>';
      }).join('');
      
      var heroBox = sec.querySelector('.hero');
      if (heroBox) {
        heroBox.insertAdjacentElement('afterend', qa);
      } else {
        sec.insertBefore(qa, sec.firstChild);
      }

      qa.addEventListener('click', function (e) {
        var b = e.target.closest('[data-go]');
        if (b) go(b.getAttribute('data-go'));
      });
    }
    if (!$('ui-recent')) {
      var box = document.createElement('div');
      box.id = 'ui-recent';
      box.className = 'panel';
      var last = sec.querySelector(':scope > .panel:not([id])');
      if (last) sec.insertBefore(box, last); else sec.appendChild(box);
      box.addEventListener('click', function (e) {
        if (e.target.closest('[data-go]')) go('pesanan');
      });
      box.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.closest('[data-go]')) go('pesanan');
    });
    }
  }

  var GAME_TINT = {
    ff: ['#f97316', 'FF'], mlbb: ['#3b82f6', 'ML'], roblox: ['#ef4444', 'RB']
  };

  function renderRecent() {
    var box = $('ui-recent');
    if (!box) return;
    var list = orders().slice().sort(function (a, b) {
      var ta = new Date(a.created_at).getTime(), tb = new Date(b.created_at).getTime();
      return (isNaN(tb) ? -1 : tb) - (isNaN(ta) ? -1 : ta);
    }).slice(0, 5);

    var head = '<div class="rc-head"><h2>Pesanan terbaru</h2>' +
      '<button type="button" class="link" data-go="pesanan">Lihat semua</button></div>';
    if (!list.length) {
      box.innerHTML = head + '<p class="note">Belum ada pesanan.</p>';
      return;
    }
    box.innerHTML = head + '<div class="tx-list">' + list.map(function (o) {
      var g = String(o.game || '').toLowerCase();
      var t = GAME_TINT[g] || ['#8b5cf6', (g || '?').slice(0, 2).toUpperCase()];
      var when = formatTanggalPendekWITA(o.created_at);
      var done = isDone(o), st = status(o);
      return '<div class="tx" data-go="pesanan" role="link" tabindex="0" style="cursor:pointer">' +
        '<div class="tx-ic" style="background:' + t[0] + '26;color:' + t[0] + '">' + esc(t[1]) + '</div>' +
        '<div class="tx-m"><div class="tx-t">' + esc(o.nama_produk || ('Item ' + (o.item || '-'))) + '</div>' +
          '<div class="tx-s">' + esc(gameLabel(g)) + ' · ' + esc(when) + '</div></div>' +
        '<div class="tx-a ' + (done ? 'in' : 'wait') + '">' + (done ? '+ ' : '') + esc(rp(price(o))) +
          '<small>' + esc(st || '-') + '</small></div>' +
        '</div>';
    }).join('') + '</div>';
  }

  // ---------- 4. tab menu bawah (HP) ----------
  var TABS = [['beranda', IC.home, 'Beranda'], ['pesanan', IC.inbox, 'Pesanan'],
    ['laporan', IC.chart, 'Laporan'], ['katalog', IC.box, 'Katalog']];

  function buildTabbar() {
    if ($('ui-tabbar')) return;
    var nav = document.createElement('nav');
    nav.id = 'ui-tabbar';
    nav.className = 'tabbar';
    nav.setAttribute('aria-label', 'Navigasi cepat');
    nav.innerHTML = TABS.map(function (t) {
      return '<button type="button" data-go="' + t[0] + '">' + t[1] + '<span>' + t[2] + '</span>' +
        (t[0] === 'pesanan' ? '<i class="tb-badge hide" id="ui-tb-badge">0</i>' : '') + '</button>';
    }).join('') + '<button type="button" data-menu="1">' + IC.menu + '<span>Menu</span></button>';
    document.body.appendChild(nav);
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-menu')) { var m = $('menu'); if (m) m.click(); return; }
      go(b.getAttribute('data-go'));
    });
    syncTabs();
    Array.prototype.forEach.call(document.querySelectorAll('.nav'), function (n) {
      new MutationObserver(syncTabs).observe(n, { attributes: true, attributeFilter: ['class'] });
    });
    var ob = $('ord-badge');
    if (ob) {
      var sync = function () {
        var tb = $('ui-tb-badge');
        if (!tb) return;
        tb.textContent = ob.textContent;
        tb.classList.toggle('hide', ob.classList.contains('hide'));
      };
      sync();
      new MutationObserver(sync).observe(ob, { attributes: true, childList: true, characterData: true, subtree: true });
    }
  }

  function syncTabs() {
    var tb = $('ui-tabbar');
    if (!tb) return;
    var on = document.querySelector('.nav.on');
    var v = on ? on.getAttribute('data-v') : 'beranda';
    var inTabs = TABS.some(function (t) { return t[0] === v; });
    Array.prototype.forEach.call(tb.querySelectorAll('button'), function (b) {
      var active = b.hasAttribute('data-menu') ? !inTabs : b.getAttribute('data-go') === v;
      b.classList.toggle('on', active);
    });
  }

  // ---------- jalankan ----------
  function refresh() { safe(drawSpark); safe(renderRecent); }

  var orig = window.loadOrders;
  if (typeof orig === 'function') {
    window.loadOrders = function () {
      var r = orig.apply(this, arguments);
      if (r && typeof r.then === 'function') r.then(refresh, function () {});
      else refresh();
      return r;
    };
  }

  safe(buildAvatar);
  safe(buildGreeting);
  safe(buildProfitTone);
  safe(buildSpark);
  safe(buildHome);
  safe(buildTabbar);
  refresh();
})();