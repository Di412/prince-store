/* dashboard-proof.js — Viewer bukti pembayaran admin */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let currentObjectUrl = null;

  function setMeta(t) { const e = $('proofModalMeta'); if (e) e.textContent = t || ''; }

  function setLoading() {
    $('proofModalBody').innerHTML = `
      <div class="proof-loading">
        <div class="proof-spinner"></div>
        <p>Memuat bukti pembayaran…</p>
      </div>`;
  }

  function setError(msg) {
    $('proofModalBody').innerHTML = `
      <div class="proof-error">
        <div class="proof-error__icon">⚠️</div>
        <p class="proof-error__msg">${msg}</p>
        <p class="proof-error__hint">Pastikan backend mengirim <code>proof_url</code> atau endpoint <code>/api/proof</code> tersedia.</p>
      </div>`;
  }

  function resetObjectUrl() {
    if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = null; }
  }

  function renderImage(url) {
    $('proofModalBody').innerHTML =
      `<img id="proofImage" class="proof-image" src="${url}" alt="Bukti pembayaran">`;
    const img = $('proofImage');
    if (img) {
      img.addEventListener('error', () => setError('Gambar bukti tidak dapat dimuat.'));
      img.addEventListener('click', () => img.classList.toggle('zoom'));
    }
  }

  function renderPdf(url) {
    $('proofModalBody').innerHTML =
      `<iframe class="proof-pdf" src="${url}" title="Bukti PDF"></iframe>`;
  }

  async function openPaymentProof(orderId, wa, directUrl) {
    const modal = $('proofModal');
    if (!modal) {
      alert('Elemen modal (proofModal) belum ditambahkan di dashboard.html');
      return;
    }
    if (!orderId && !directUrl) { alert('ID pesanan tidak ditemukan.'); return; }

    modal.hidden = false;
    document.body.classList.add('proof-modal-open');
    setMeta(`Order: ${orderId || '-'}`);
    setLoading();
    resetObjectUrl();

    const dl = $('proofDownloadBtn');
    if (dl) dl.removeAttribute('href');

    try {
      let url = directUrl || '';
      
      // Jika URL langsung tidak ada, minta ke API
      if (!url) {
        const qs = new URLSearchParams({ orderId: orderId || '' });
        if (wa) qs.set('wa', wa);
        
        // Gunakan apiFetch jika ada (agar token admin terkirim), jika tidak pakai fetch biasa
        let resp;
        if (typeof window.apiFetch === 'function') {
            // apiFetch biasanya me-return JSON, jadi kita harus bypass jika butuh blob
            // Kita gunakan fetch biasa dengan menambahkan token admin dari localStorage (jika ada)
            const token = localStorage.getItem('admin_token') || '';
            resp = await fetch(`/api/proof?${qs.toString()}`, {
                headers: token ? { 'Authorization': 'Bearer ' + token } : {}
            });
        } else {
            resp = await fetch(`/api/proof?${qs.toString()}`);
        }

        if (!resp.ok) throw new Error(`Bukti belum tersedia (${resp.status})`);
        
        const ct = (resp.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const data = await resp.json();
          url = data.url || data.proofUrl;
        } else {
          const blob = await resp.blob();
          currentObjectUrl = URL.createObjectURL(blob);
          url = currentObjectUrl;
        }
      }
      
      if (!url) throw new Error('URL bukti tidak tersedia.');

      if (dl) {
        dl.href = url;
        dl.setAttribute('download', `bukti-${orderId || 'pembayaran'}`);
      }

      const isPdf = /\.pdf(\?|#|$)/i.test(url);
      if (isPdf) { renderPdf(url); setMeta(`Order: ${orderId} • PDF`); }
      else       { renderImage(url); setMeta(`Order: ${orderId} • Klik gambar untuk zoom`); }
    } catch (err) {
      console.error('[proof]', err);
      setError(err.message || 'Gagal memuat bukti pembayaran.');
    }
  }

  function closePaymentProof() {
    const modal = $('proofModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('proof-modal-open');
    $('proofModalBody').innerHTML = '';
    resetObjectUrl();
  }

  window.openPaymentProof = openPaymentProof;
  window.closePaymentProof = closePaymentProof;
})();