/* Penghubung website ke server Cloudflare */

// 1. TAMBAHKAN URL CLOUDFLARE WORKER ANDA DI SINI
const API_BASE_URL = "https://prince-store.prince-store31.workers.dev";

async function apiRequest(path, options) {
  let res;
  try {
    // 2. KITA GABUNGKAN URL CLOUDFLARE + PATH
    res = await fetch(API_BASE_URL + path, options);
  } catch (e) {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* respons bukan JSON */ }
  if (!res.ok) throw new Error((data && data.error) || `Permintaan gagal (${res.status}).`);
  return data;
}

// Simpan pesanan baru.
window.saveOrderToFirebase = orderData =>
  apiRequest('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      game: orderData.game,
      produk_id: orderData.produk_id,
      metode_id: orderData.metode_id,
      target: orderData.target,
      wa: orderData.wa
    })
  });

// Cek status pesanan
window.lookupCustomerOrder = (orderId, wa) =>
  apiRequest(`/api/orders/${encodeURIComponent(orderId)}?wa=${encodeURIComponent(wa || '')}`);

// Kirim bukti pembayaran
// Kirim bukti pembayaran
window.uploadCustomerPaymentProof = async (orderId, wa, file) => {
  // Validasi file
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.type) || file.size > 4 * 1024 * 1024) {
    throw new Error('Pilih bukti JPG, PNG, WEBP, atau PDF dengan ukuran maksimal 4 MB.');
  }

  // Bungkus file dan data ke dalam FormData (Jangan pakai JSON)
  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("wa", wa);
  formData.append("file", file);

  try {
    // Tembak ke endpoint /api/upload-proof (Sesuai kode Worker)
    const res = await fetch(API_BASE_URL + '/api/upload-proof', {
      method: 'POST',
      body: formData
      // JANGAN tambahkan headers 'Content-Type', biarkan browser mengurusnya otomatis
    });

    let data = null;
    try { data = await res.json(); } catch (e) { /* abaikan jika bukan JSON */ }

    if (!res.ok) {
      throw new Error((data && data.error) || `Gagal upload bukti (${res.status}).`);
    }
    
    return data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw new Error(error.message || 'Tidak dapat terhubung ke server saat mengunggah bukti.');
  }
};

// Ambil produk dan metode pembayaran dari server.
(async function loadCatalog() {
  try {
    const catalog = await apiRequest('/api/catalog');
    Object.entries(catalog.products || {}).forEach(([gameKey, items]) => {
      if (!gameData[gameKey]) return;
      gameData[gameKey].items = items;
      if (selectedGameKey === gameKey) {
        renderNominalItems(gameKey);
        updateSummary();
      }
    });
    if (Array.isArray(catalog.paymentMethods) && catalog.paymentMethods.length) {
      window.paymentConfiguration = catalog.paymentMethods;
      if (typeof renderPayments === 'function') renderPayments();
    }
  } catch (e) {
    console.error('Gagal mengambil katalog:', e);
  }
})();
