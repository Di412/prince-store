// ============================================================
// js/api.js — Client API untuk website toko (index.html)
// ============================================================
(function () {
  'use strict';

  const API_BASE = 'https://prince-store.prince-store31.workers.dev/';
  const CACHE_KEY = 'prince_public_data_v1';
  const CACHE_TTL = 5 * 60 * 1000;

  async function fetchPublicData(force) {
    if (!force) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const { data, ts } = JSON.parse(raw);
          if (Date.now() - ts < CACHE_TTL) return data;
        }
      } catch {}
    }
    const res = await fetch(API_BASE + '/api/public-data', { cache: 'no-cache' });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
    return data;
  }

  function groupBy(arr, key) {
    const m = {};
    (arr || []).forEach(x => {
      const k = x[key] || 'lainnya';
      (m[k] = m[k] || []).push(x);
    });
    return m;
  }

  // Bootstrap — dipanggil sekali saat halaman load
  async function bootstrap() {
    try {
      const data = await fetchPublicData();
      window.API_DATA = {
        catalog: data.catalog || [],
        byGame: groupBy(data.catalog, 'game'),
        payments: data.payment_methods || [],
        paymentsByGroup: groupBy(data.payment_methods, 'group'),
        banners: data.banners || []
      };
      // Kompatibilitas dengan js/ui.js / js/data.js lama:
      // Timpa global produk/payments dengan data API.
      try { if (typeof window.PRODUK !== 'undefined') window.PRODUK = window.API_DATA.byGame; } catch {}
      try { if (typeof window.PAYMENT_METHODS !== 'undefined') window.PAYMENT_METHODS = window.API_DATA.payments; } catch {}

      // Re-render jika ui.js menyediakan fungsi render
      ['renderGameGrid', 'renderNominalGrid', 'renderPaymentMethods', 'renderBanners', 'renderFavorites']
        .forEach(fn => { try { typeof window[fn] === 'function' && window[fn](); } catch (e) { console.warn(fn, e); } });

      window.dispatchEvent(new CustomEvent('prince:data-ready', { detail: window.API_DATA }));
    } catch (e) {
      console.warn('[api.js] gagal fetch API, pakai data statis:', e);
    }
  }

  async function verifyAccount(game, input) {
    const res = await fetch(API_BASE + '/api/verify-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game, input })
    });
    const data = await res.json().catch(() => ({}));
    if (!data.ok) throw new Error(data.error || 'Verifikasi gagal');
    return data;
  }

  async function createOrder(order, verificationToken) {
    const res = await fetch(API_BASE + '/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, order, { verification_token: verificationToken }))
    });
    const data = await res.json().catch(() => ({}));
    if (!data.ok) throw new Error(data.error || 'Gagal membuat order');
    return data;
  }

  async function uploadPaymentProof(trxId, file) {
    const fd = new FormData();
    fd.append('order_id', trxId);
    fd.append('file', file);
    const res = await fetch(API_BASE + '/api/upload-proof', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!data.ok) throw new Error(data.error || 'Upload bukti gagal');
    return data;
  }

  async function trackOrder(trxId) {
    const res = await fetch(API_BASE + '/api/track/' + encodeURIComponent(trxId));
    const data = await res.json().catch(() => ({}));
    if (!data.ok) throw new Error(data.error || 'Order tidak ditemukan');
    return data;
  }

  window.API = { fetchPublicData, bootstrap, verifyAccount, createOrder, uploadPaymentProof, trackOrder };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();