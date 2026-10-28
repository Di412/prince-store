/* Penghubung website ke server Cloudflare */

// 1. TAMBAHKAN URL CLOUDFLARE WORKER ANDA DI SINI
const API_BASE_URL = "https://prince-store.prince-store31.workers.dev";

async function apiRequest(path, options) {
  let res;
  try {
    res = await fetch(API_BASE_URL + path, options);
  } catch (e) {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* respons bukan JSON */ }
  if (!res.ok) throw new Error((data && data.error) || `Permintaan gagal (${res.status}).`);
  return data;
}

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

window.lookupCustomerOrder = (orderId, wa) =>
  apiRequest(`/api/orders/${encodeURIComponent(orderId)}?wa=${encodeURIComponent(wa || '')}`);

window.uploadCustomerPaymentProof = async (orderId, wa, file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.type) || file.size > 4 * 1024 * 1024) {
    throw new Error('Pilih bukti JPG, PNG, WEBP, atau PDF dengan ukuran maksimal 4 MB.');
  }

  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("wa", wa);
  formData.append("file", file);

  try {
    const res = await fetch(API_BASE_URL + '/api/upload-proof', {
      method: 'POST',
      body: formData
    });

    let data = null;
    try { data = await res.json(); } catch (e) { /* abaikan */ }

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
    let promoItem = null;
    let promoGame = 'mlbb';

    Object.entries(catalog.products || {}).forEach(([gameKey, items]) => {
      if (!gameData[gameKey]) return;
      gameData[gameKey].items = items;
      
      // Cari produk yang dicentang promo
      items.forEach(item => {
        if (item.is_promo === 1 && !promoItem && item.stok !== 0) {
          promoItem = item;
          promoGame = gameKey;
        }
      });

      if (selectedGameKey === gameKey) {
        renderNominalItems(gameKey);
        updateSummary();
      }
    });

    // Tampilkan Banner Promo Dinamis
    if (promoItem) {
        const titleEl = document.getElementById('promoTitle');
        const priceEl = document.getElementById('promoNewPrice');
        const oldPriceEl = document.getElementById('promoOldPrice');
        const badgeEl = document.getElementById('promoBadge');
        const btnEl = document.getElementById('promoBtn');

        if (titleEl) {
            titleEl.innerText = promoItem.name;
            priceEl.innerText = `Rp ${Number(promoItem.price).toLocaleString('id-ID')}`;
            
            // Jika ada harga coret (diskon)
            if (Number(promoItem.harga_asli) > Number(promoItem.price)) {
                oldPriceEl.innerText = `Rp ${Number(promoItem.harga_asli).toLocaleString('id-ID')}`;
                oldPriceEl.classList.remove('hidden');
                
                const diskon = Math.round(((promoItem.harga_asli - promoItem.price) / promoItem.harga_asli) * 100);
                badgeEl.innerText = `HEMAT ${diskon}%`;
                badgeEl.classList.remove('hidden');
            } else {
                oldPriceEl.classList.add('hidden');
                badgeEl.classList.add('hidden');
            }
            
            // Tombol langsung menuju ke produk promo
            btnEl.onclick = () => {
                resetView(); 
                selectGame(promoGame);
                setTimeout(() => {
                    const itemCard = document.querySelector(`.item-card[data-item-id="${promoItem.id}"]`);
                    if (itemCard) selectNominal(promoItem, itemCard);
                }, 100);
            };
        }
    }

    if (Array.isArray(catalog.paymentMethods) && catalog.paymentMethods.length) {
      window.paymentConfiguration = catalog.paymentMethods;
      if (typeof renderPayments === 'function') renderPayments();
    }
  } catch (e) {
    console.error('Gagal mengambil katalog:', e);
  }
})();