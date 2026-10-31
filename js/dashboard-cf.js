// ============================================================
// js/dashboard-cf.js — Client API untuk dashboard.html
// ============================================================
(function () {
  'use strict';

  const API_BASE = 'https://prince-store.prince-store31.workers.dev/';
  const TOKEN_KEY = 'prince_admin_token';

  const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
  const setToken = t => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {} };

  async function req(path, opts) {
    opts = opts || {};
    if (!getToken()) throw new Error('Belum login');
    const res = await fetch(API_BASE + path, Object.assign({}, opts, {
      headers: Object.assign({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      }, opts.headers || {})
    }));
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
    return data;
  }

  const API = {
    setToken, getToken,
    clearToken: () => setToken(''),
    async auth(pin) {
      const res = await fetch(API_BASE + '/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      return res.json().catch(() => ({ ok: false }));
    },
    saveCatalog: items => req('/api/catalog', { method: 'PUT', body: JSON.stringify({ items }) }),
    savePayments: methods => req('/api/payment-methods', { method: 'PUT', body: JSON.stringify({ methods }) }),
    saveBanners: banners => req('/api/banners', { method: 'PUT', body: JSON.stringify({ banners }) }),
    getConfig: () => req('/api/admin-config'),
    getOrders: () => req('/api/orders'),
    updateOrder: (id, patch) => req('/api/orders/' + encodeURIComponent(id), {
      method: 'PATCH', body: JSON.stringify(patch)
    })
  };

  window.API = API;

  // ===== Paksa login overlay tampil jika belum login =====
  document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
      const ov = document.getElementById('authOverlay');
      if (ov) ov.style.display = 'flex';
    }
  });

  // ===== Override checkPin() untuk auth server =====
  const origCheckPin = window.checkPin;
  window.checkPin = async function () {
    const pinInput = document.getElementById('pinInput');
    const errEl = document.getElementById('authErr');
    const pin = (pinInput && pinInput.value || '').trim();
    if (!pin) { if (errEl) errEl.textContent = 'PIN kosong'; return; }

    if (errEl) errEl.textContent = 'Memeriksa...';
    try {
      const r = await API.auth(pin);
      if (r.ok) {
        setToken(pin);
        if (errEl) errEl.textContent = '';
        if (typeof origCheckPin === 'function') return origCheckPin();
        const ov = document.getElementById('authOverlay');
        if (ov) ov.style.display = 'none';
      } else {
        if (errEl) errEl.textContent = 'PIN salah';
      }
    } catch (e) {
      if (errEl) errEl.textContent = 'Server tidak bisa dihubungi';
    }
  };

  // ===== Override logoutAdmin untuk bersihkan token =====
  const origLogout = window.logoutAdmin;
  window.logoutAdmin = function () {
    API.clearToken();
    if (typeof origLogout === 'function') return origLogout();
    location.reload();
  };

  // ===== Hook setelah semua script dimuat =====
  window.addEventListener('load', function () {
    // 1) Bungkus saveCatalog — lokal dulu, lalu kirim ke API
    const origSaveCatalog = window.saveCatalog;
    if (typeof origSaveCatalog === 'function' && !origSaveCatalog.__hooked) {
      window.saveCatalog = async function () {
        const status = document.getElementById('kat-status');
        try {
          await origSaveCatalog.apply(this, arguments);
          if (Array.isArray(window.catalogData)) {
            await API.saveCatalog(window.catalogData);
            if (status) { status.textContent = '✓ Tersimpan & tersinkron ke website'; status.style.color = 'var(--good)'; }
          }
        } catch (e) {
          console.error('[saveCatalog]', e);
          if (status) { status.textContent = '✗ Gagal sinkron: ' + e.message; status.style.color = 'var(--bad)'; }
        }
      };
      window.saveCatalog.__hooked = true;
    }

    // 2) Hook tombol Simpan pembayaran
    const pay