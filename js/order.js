/* Proses pesanan: validasi, konfirmasi detail, kirim bukti, notifikasi */
// PROSES PEMESANAN & VALIDASI
function processOrder() {
    if (!selectedGameKey) {
        alert('Silakan pilih game terlebih dahulu!');
        return;
    }

    const data = gameData[selectedGameKey];
    let accountValid = true;

    data.inputs.forEach(inp => {
        const el = document.getElementById(`input_${inp.id}`);
        if(!el || !el.value.trim()) accountValid = false;
    });

    if(!accountValid) {
        alert('Mohon isi Data Akun game Anda secara lengkap!');
        return;
    }

    if(!selectedItem) {
        alert('Silakan pilih Nominal Top Up / Item!');
        return;
    }
    if(selectedItem.stock === 0) {
        alert('Stok produk sedang habis. Silakan pilih produk lain.');
        return;
    }

    if(!selectedPayment) {
        alert('Silakan pilih Metode Pembayaran!');
        return;
    }

    const waNum = document.getElementById('inputWhatsapp').value.trim();
    if(!waNum) {
        alert('Masukkan nomor WhatsApp Anda untuk bukti pengiriman.');
        return;
    }

    // Fill Confirm Modal Data
    document.getElementById('modalConfirmGame').innerText = gameData[selectedGameKey].name;
    document.getElementById('modalConfirmAccount').innerText = document.getElementById('summaryAccount').innerText;
    document.getElementById('modalConfirmItem').innerText = selectedItem.name;
    document.getElementById('modalConfirmPayment').innerText = selectedPayment.name;
    document.getElementById('modalConfirmWa').innerText = `+62 ${waNum}`;
    document.getElementById('modalConfirmTotal').innerText = document.getElementById('summaryTotal').innerText;

    prepareConfirmModal();
    openModal('confirmModal');
}

// NOTIFIKASI PESANAN DIPROSES
let orderToastTimer = null;
function showOrderToast(trxId) {
    document.getElementById('orderToastDetail').innerText = `Bukti pembayaran diterima. Kode transaksi: ${trxId}`;
    document.getElementById('orderToast').classList.remove('hidden');
    clearTimeout(orderToastTimer);
    orderToastTimer = setTimeout(hideOrderToast, 8000);
}
function hideOrderToast() {
    document.getElementById('orderToast').classList.add('hidden');
}

// POP UP: PESANAN SEDANG DIPROSES
function showOrderPopup(trx) {
    document.getElementById('orderPopupTrx').innerText = trx.id;
    document.getElementById('orderPopupMethod').innerText = trx.method || '-';
    document.getElementById('orderPopupTotal').innerText = trx.total || '-';
    document.getElementById('orderPopupCopyIcon').className = 'fa-regular fa-copy';
    document.getElementById('orderPopup').classList.remove('hidden');
}
function hideOrderPopup() {
    document.getElementById('orderPopup').classList.add('hidden');
}
async function copyOrderId() {
    const id = document.getElementById('orderPopupTrx').innerText;
    try {
        await navigator.clipboard.writeText(id);
        document.getElementById('orderPopupCopyIcon').className = 'fa-solid fa-check text-emerald-400';
    } catch (e) {
        alert('ID Pesanan: ' + id);
    }
}

// POP UP: ORDERAN BERHASIL
function showOrderSuccessPopup(trx) {
    document.getElementById('orderSuccessTrx').innerText = trx.id;
    document.getElementById('orderSuccessMethod').innerText = trx.method || '-';
    document.getElementById('orderSuccessTotal').innerText = trx.total || '-';
    document.getElementById('orderPopup').classList.add('hidden');
    document.getElementById('orderSuccessPopup').classList.remove('hidden');
}
function hideOrderSuccessPopup() {
    document.getElementById('orderSuccessPopup').classList.add('hidden');
}

// MODAL LAMPIRKAN BUKTI + KONFIRMASI DETAIL
let pendingOrder = null;

function setConfirmMessage(text, isError) {
    const el = document.getElementById('confirmMessage');
    el.innerText = text || '';
    el.className = `text-[11px] mb-3 min-h-[1rem] ${isError ? 'text-red-300' : 'text-slate-400'}`;
}

function prepareConfirmModal() {
    pendingOrder = null;
    const isCashPayment = selectedPayment && (selectedPayment.id === 'cash' || selectedPayment.name.toLowerCase() === 'tunai');
    document.getElementById('confirmFormView').classList.remove('hidden');
    document.getElementById('confirmSuccessView').classList.add('hidden');
    document.getElementById('confirmProofInput').value = '';
    setConfirmMessage('');

    document.getElementById('confirmModalDescription').innerText = isCashPayment
        ? 'Pastikan detail pesanan benar. Serahkan uang sesuai total kepada Admin/Warung, lalu konfirmasi pesanan.'
        : 'Periksa detail pesanan, lakukan pembayaran ke tujuan di bawah, lalu lampirkan bukti pembayaran.';
    document.getElementById('confirmCashInstructions').classList.toggle('hidden', !isCashPayment);
    document.getElementById('confirmProofSection').classList.toggle('hidden', isCashPayment);

    const button = document.getElementById('confirmSubmitButton');
    button.disabled = false;
    button.innerText = isCashPayment ? 'Saya Sudah Menyerahkan Uang' : 'Konfirmasi & Kirim Bukti';

    // Data tujuan pembayaran dari server (account / holder / imageUrl),
    // tetap mendukung nama field lama sebagai cadangan.
    const p = selectedPayment;
    const nomor = p.account || p.accountNumber || p.destination || '';
    const nama = p.holder || p.accountName || p.recipient || '';
    const qrSrc = p.imageUrl || p.qrImage || '';

    const detailLines = p.group === 'bank'
        ? [
            `Nama Akun Bank: ${nama || '-'}`,
            `Nama Bank: ${p.bankName || p.name || '-'}`,
            `No. Rekening: ${nomor || '-'}`
        ]
        : [
            nama ? `Penerima: ${nama}` : '',
            nomor ? `Tujuan: ${nomor}` : ''
        ];
    let info = [...detailLines, p.instructions || ''].filter(Boolean).join('\n');

    // Jika admin belum mengisi tujuan pembayaran, beri tahu pembeli
    if (!isCashPayment && !nomor && !nama && !qrSrc) {
        info = 'Tujuan pembayaran belum tersedia. Silakan hubungi Admin sebelum membayar.';
    }

    document.getElementById('confirmPayInfo').innerText = info;
    const qrBox = document.getElementById('confirmQrContainer');
    const qrImg = document.getElementById('confirmQrCode');
    if (qrSrc) {
        qrImg.src = qrSrc;
        qrBox.classList.remove('hidden');
    } else {
        qrImg.removeAttribute('src');
        qrBox.classList.add('hidden');
    }
    document.getElementById('confirmPayInfoBox').classList.toggle('hidden', isCashPayment || (!info && !qrSrc));
}

// KIRIM PESANAN + BUKTI PEMBAYARAN
async function submitFinalOrder() {
    if (isSubmittingOrder) return;

    const isCashPayment = selectedPayment && (selectedPayment.id === 'cash' || selectedPayment.name.toLowerCase() === 'tunai');
    const file = isCashPayment ? null : document.getElementById('confirmProofInput').files[0];
    const allowedProofTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!isCashPayment && !file) {
        setConfirmMessage('Lampirkan Bukti pembayaran terlebih dahulu', true);
        return;
    }
    if (!isCashPayment && (!allowedProofTypes.includes(file.type) || file.size > 4 * 1024 * 1024)) {
        setConfirmMessage('Bukti harus berupa JPG, PNG, WEBP, atau PDF dengan ukuran maksimal 4 MB.', true);
        return;
    }

    isSubmittingOrder = true;
    const button = document.getElementById('confirmSubmitButton');
    button.disabled = true;
    button.innerText = 'Memproses...';
    setConfirmMessage(isCashPayment ? 'Konfirmasi pembayaran tunai sedang dikirim' : 'Pesanan dan Bukti pembayaran sedang dikirim', false);

    try {
        if (!pendingOrder) {
            // HAPUS GENERATE ID ACAK, SERVER YANG AKAN MEMBUAT ID
            const accountStr = document.getElementById('summaryAccount').innerText;
            const totalStr = document.getElementById('summaryTotal').innerText;
            const waNum = "0" + document.getElementById('inputWhatsapp').value.trim();

            const orderData = {
                game: selectedGameKey, // Kirim persis 'mlbb', 'ff', atau 'roblox'
                target: accountStr,
                produk_id: selectedItem.id,
                metode_id: selectedPayment.id,
                wa: waNum
            };

            // Kirim ke Cloudflare
            const saved = await window.saveOrderToFirebase(orderData);
            if (!saved) throw new Error("Gagal menyimpan ke database");

            // AMBIL ID DARI RESPON SERVER CLOUDFLARE (orderId)
            let finalId = "Customer-XXXXPS";
            if (saved.orderId) finalId = saved.orderId;
            else if (typeof saved === 'string') finalId = saved;

            const transaction = {
                id: finalId, // Pakai ID dari Cloudflare
                game: gameData[selectedGameKey].name,
                target: accountStr,
                item: selectedItem.name,
                method: selectedPayment.name,
                status: isCashPayment ? "Pesanan Diproses" : "Menunggu Pembayaran",
                wa: waNum,
                total: totalStr
            };

            pendingOrder = transaction;
        }

        if (!isCashPayment) {
            await window.uploadCustomerPaymentProof(pendingOrder.id, pendingOrder.wa, file);
        }
        pendingOrder.status = 'Pesanan Diproses';
        currentTransaction = pendingOrder;
        transactionsDatabase.push(currentTransaction);

        // Tutup jendela konfirmasi, lalu tampilkan hanya pop-up pesanan diproses.
        closeModal('confirmModal');
        showOrderPopup(currentTransaction);
    } catch (error) {
        console.error('Gagal memproses pesanan:', error);
        const reason = error instanceof Error ? error.message : String(error);
        const note = pendingOrder
            ? ` Pesanan sudah tersimpan dengan kode ${pendingOrder.id}. Coba kirim ulang bukti, atau gunakan Cek Transaksi.`
            : '';
        setConfirmMessage(`${reason}${note}`, true);
        button.disabled = false;
        button.innerText = pendingOrder ? 'Kirim Ulang Bukti' : 'Konfirmasi & Kirim Bukti';
    } finally {
        isSubmittingOrder = false;
    }
}
