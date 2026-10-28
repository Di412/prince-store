// URL Cloudflare Worker Anda
const API_BASE = "https://prince-store.prince-store31.workers.dev";
const ADMIN_TOKEN_KEY = "ps_admin_token";

function getAdminToken() {
    try {
        return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem('admin_token') || "";
    } catch (e) { return ""; }
}

// 1. Fungsi khusus untuk memanggil API (otomatis membawa token admin)
async function apiFetch(path, options = {}) {
    const opts = { ...options, headers: { ...(options.headers || {}) } };
    const token = getAdminToken();
    if (token && path.startsWith('/api/admin/')) opts.headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(API_BASE + path, opts);
    let data = {};
    try { data = await res.json(); } catch (e) { /* balasan bukan JSON */ }
    if (!res.ok) throw new Error(data.error || `Permintaan gagal (${res.status})`);
    return data;
}

// 2. Mencegat semua fetch('/api/...') agar otomatis ke Cloudflare,
//    dan menyimpan token admin saat login berhasil.
const originalFetch = window.fetch.bind(window);
window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
        url = API_BASE + url;
    }
    const p = originalFetch(url, options);
    if (typeof url === 'string' && url.includes('/api/admin/login')) {
        p.then(r => r.clone().json())
         .then(d => { if (d && d.token) { try { sessionStorage.setItem(ADMIN_TOKEN_KEY, d.token); } catch (e) {} } })
         .catch(() => {});
    }
    return p;
};
