/* Service worker Prince Admin
 * - Cangkang aplikasi (HTML, CSS, JS, logo) disimpan agar aplikasi terbuka cepat dan tetap tampil saat offline.
 * - Data (API, Firebase, bukti bayar, dsb.) TIDAK pernah disimpan: selalu diambil langsung dari jaringan,
 *   jadi angka keuangan tidak akan basi.
 * Ganti nomor CACHE_VERSION setiap kali Anda mengubah file di daftar SHELL.
 */
const CACHE_VERSION = 'prince-admin-v1';

const SHELL = [
  './admin.html',
  './manifest-admin.webmanifest',
  './logo-profil.png',
  './css/dashboard-ui.css',
  './js/dashboard-pin.js',
  './js/dashboard-app.js?v=8',
  './js/dashboard-summary.js',
  './js/dashboard-cf.js',
  './js/dashboard-recap.js?v=3',
  './js/dashboard-ui.js?v=14',
  './js/order-detail-popup.js?v=6',
  './js/manual-transaction.js?v=1'
];

// Pustaka eksternal (Excel/PDF) yang aman disimpan
const CDN_HOST = 'cdnjs.cloudflare.com';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Satu per satu: kalau ada file yang belum ada, yang lain tetap tersimpan
      Promise.all(
        SHELL.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // simpan/ubah data selalu langsung ke server

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Membuka halaman: coba jaringan dulu, kalau offline pakai salinan tersimpan
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put('./admin.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./admin.html'))
    );
    return;
  }

  // Cangkang aplikasi: tampilkan salinan tersimpan, perbarui di belakang layar
  const isShell =
    (sameOrigin && SHELL.some((s) => {
      const u = new URL(s, self.location.href);
      return u.pathname === url.pathname && u.search === url.search;
    })) || url.hostname === CDN_HOST;

  if (isShell) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req)
            .then((res) => {
              if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // Selain itu (API, database, gambar bukti bayar, dll.): langsung jaringan, tanpa disimpan
});
