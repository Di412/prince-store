// ==========================================================
// PRINCE STORE - track.js (Pelacakan pesanan + cetak struk)
// ==========================================================

// Samarkan teks sensitif, contoh: 123456789 -> 12*****89
function maskText(s) {
    s = String(s || '');
    return s.length <= 4 ? s : s.slice(0, 2) + '*'.repeat(s.length - 4) + s.slice(-2);
}

// Samarkan nama, contoh: "Budi Santoso" -> "B**i S*****o"
function maskName(s) {
    return String(s || '').trim().split(/\s+/).filter(Boolean).map(w =>
        w.length <= 2 ? w : w[0] + '*'.repeat(w.length - 2) + w.slice(-1)
    ).join(' ');
}

// Cegah injeksi HTML dari data yang ditampilkan
function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// created_at dari D1 berformat "2026-10-30 01:40:00" (UTC tanpa penanda zona)
// Ditampilkan dalam WITA (Asia/Makassar), sama dengan struk di dashboard.
function formatTanggal(raw) {
    raw = String(raw || '');
    if (!raw) return '-';
    const iso = /Z|[+-]\d\d:?\d\d$/.test(raw) ? raw : raw.replace(' ', 'T') + 'Z';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
}

async function searchTransaction() {
    const orderId = document.getElementById('trackOrderId').value.trim();
    const resultBox = document.getElementById('trackResult');

    if (!orderId) {
        alert("Masukkan ID Pesanan!");
        return;
    }

    resultBox.classList.remove('hidden');
    resultBox.innerHTML = '<p class="text-center text-slate-400">Mencari pesanan...</p>';

    try {
        const order = await window.apiRequest(`/api/orders/${encodeURIComponent(orderId)}`);

        let statusColor = "text-yellow-400";
        const statusTrim = order.status ? order.status.trim() : "";
        const selesai = (statusTrim === "Selesai" || statusTrim === "Sukses");
        if (selesai) statusColor = "text-emerald-400";

        const totalHarga = Number(order.total) || 0;

        // Worker sudah menyamarkan nama, target, dan WA; jangan disamarkan dua kali
        resultBox.innerHTML = `
            <div class="space-y-2 border-b border-slate-700 pb-3 mb-3">
                <div class="flex justify-between"><span class="text-slate-400">ID Pesanan:</span> <span class="font-bold text-white">${escapeHtml(order.id_transaksi)}</span></div>
                ${order.nama ? `<div class="flex justify-between"><span class="text-slate-400">Nama:</span> <span class="text-white">${escapeHtml(order.nama)}</span></div>` : ''}
                <div class="flex justify-between"><span class="text-slate-400">Game:</span> <span class="text-white">${escapeHtml(String(order.game).toUpperCase())}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Target:</span> <span class="text-white">${escapeHtml(order.target)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Item:</span> <span class="text-white">${escapeHtml(order.nama_item)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Status:</span> <span class="${statusColor} font-bold">${escapeHtml(statusTrim)}</span></div>
            </div>
            <div class="flex justify-between items-center mb-4">
                <span class="text-slate-400">Total:</span>
                <span class="font-bold text-neonCyan text-lg">Rp ${totalHarga.toLocaleString('id-ID')}</span>
            </div>
            <div id="printButtonContainer"></div>
        `;

        const container = document.getElementById('printButtonContainer');
        if (selesai) {
            // Data pesanan disimpan di variabel, bukan di atribut HTML
            window.lastOrder = order;
            container.innerHTML = `
                <button onclick="cetakStruk()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-lg text-sm transition-colors mt-2">
                    <i class="fa-solid fa-print mr-1"></i> Cetak Struk Pembelian
                </button>
            `;
        } else {
            container.innerHTML = `
                <p class="text-[11px] text-yellow-400 text-center mt-2">Tunggu admin memproses pesanan Anda untuk mencetak struk.</p>
            `;
        }
    } catch (error) {
        resultBox.innerHTML = `<p class="text-center text-red-400 text-sm">${escapeHtml(error.message)}</p>`;
    }
}

// FUNGSI MENCETAK STRUK
function cetakStruk() {
    const order = window.lastOrder;
    if (!order) return;

    const date = formatTanggal(order.created_at);
    const methodName = order.method ? String(order.method).toUpperCase() : 'CASH';

    const logoUrl = "https://di412.github.io/prince-store/logo-profil.png";
    const webUrl = "di412.github.io/prince-store";
    const waToko = "0821-1328-9026";

    // Data dari Worker sudah tersamar, langsung ditampilkan
    const namaPembeli = order.nama || '-';
    const pelanggan = order.wa || '-';
    const targetAkun = order.target || '-';

    // 1. Siapkan teks HTML
    const strukHTML = `
        <html>
        <head>
            <title>Struk - ${escapeHtml(order.id_transaksi)}</title>
            <style>
                body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; background: #f3f4f6; }
                .controls { margin-bottom: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
                .controls button { padding: 8px 15px; margin: 0 5px; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 4px; font-weight: bold;}
                .controls button.active { background: #10b981; color: white; border-color: #10b981; }

                .struk { background: white; padding: 15px 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); font-size: 11px; line-height: 1.4; color: black; transition: width 0.3s; }
                .size-58 { width: 58mm; }
                .size-80 { width: 80mm; }

                .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
                .header img { max-height: 45px; margin-bottom: 5px; object-fit: contain; }
                .header h2 { margin: 0; font-size: 16px; letter-spacing: 1px; font-weight: 900;}
                .header p { margin: 2px 0; font-size: 10px; }

                .content { font-size: 11px; }
                .row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px;}
                .row span:last-child { text-align: right; word-break: break-word; }
                .row-title { font-weight: bold; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; margin-top: 10px;}
                .total { font-weight: bold; font-size: 13px; margin-top: 10px; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 8px 0;}
                .lunas { text-align: center; font-weight: bold; font-size: 14px; margin: 10px 0; letter-spacing: 2px; }

                .footer { text-align: center; border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; font-size: 9px; line-height: 1.5; }
                .footer .thanks { font-weight: bold; font-size: 10px; margin-bottom: 2px; }
                .footer .web { margin-top: 5px; font-weight: bold; }
                .footer .company { font-size: 8px; margin-top: 8px; color: #333; font-weight: bold; letter-spacing: 1px;}

                @media print {
                    body { background: white; padding: 0; margin: 0; }
                    .controls { display: none; }
                    .struk { box-shadow: none; padding: 0; margin: 0; width: 100%; max-width: 100%; }
                    @page { margin: 0; }
                }
            </style>
        </head>
        <body>
            <div class="controls">
                <p style="margin:0 0 10px 0; font-family:sans-serif; font-size:14px;">Pilih Ukuran Kertas:</p>
                <button type="button" id="btn58" class="active" onclick="document.getElementById('strukArea').className='struk size-58'; document.getElementById('btn58').classList.add('active'); document.getElementById('btn80').classList.remove('active');">58 mm</button>
                <button type="button" id="btn80" onclick="document.getElementById('strukArea').className='struk size-80'; document.getElementById('btn80').classList.add('active'); document.getElementById('btn58').classList.remove('active');">80 mm</button>
                <br><br>
                <button type="button" onclick="window.print()" style="background:#2563eb; color:white; border:none;">🖨️ Cetak Sekarang</button>
            </div>

            <div class="struk size-58" id="strukArea">
                <div class="header">
                    <img src="${logoUrl}" alt="Logo" style="filter: brightness(0);" onerror="this.style.display='none'">
                    <h2>PRINCE STORE</h2>
                    <p>Top Up Game Termurah &amp; Tercepat</p>
                    <p>WA: ${escapeHtml(waToko)}</p>
                </div>

                <div class="content">
                    <div class="row"><span>Tanggal</span><span>${escapeHtml(date)}</span></div>
                    <div class="row"><span>ID Trx</span><span>${escapeHtml(order.id_transaksi)}</span></div>
                    <div class="row"><span>Nama</span><span>${escapeHtml(namaPembeli)}</span></div>
                    <div class="row"><span>Pelanggan</span><span>${escapeHtml(pelanggan)}</span></div>

                    <div class="row-title">DETAIL PESANAN</div>
                    <div class="row"><span>Game</span><span>${escapeHtml(String(order.game).toUpperCase())}</span></div>
                    <div class="row"><span>Target Akun</span><span>${escapeHtml(targetAkun)}</span></div>
                    <div class="row"><span>Item</span><span>${escapeHtml(order.nama_item)}</span></div>
                    <div class="row"><span>Metode</span><span>${escapeHtml(methodName)}</span></div>

                    <div class="row-title">RINCIAN BIAYA</div>
                    <div class="row"><span>Harga Item</span><span>Rp ${(Number(order.harga_item) || 0).toLocaleString('id-ID')}</span></div>
                    <div class="row"><span>Biaya Admin</span><span>Rp ${(Number(order.biaya_admin) || 0).toLocaleString('id-ID')}</span></div>

                    <div class="row total"><span>TOTAL</span><span>Rp ${(Number(order.total) || 0).toLocaleString('id-ID')}</span></div>

                    <div class="lunas">*** LUNAS ***</div>
                </div>

                <div class="footer">
                    <div class="thanks">Terima kasih telah bertransaksi di PRINCE STORE</div>
                    <div>Simpan Struk Ini untuk menjadi bukti</div>
                    <div class="web">Website: ${escapeHtml(webUrl)}</div>
                    <div class="company">OFFICIAL OF DLANZ COMPANY</div>
                </div>
            </div>
        </body>
        </html>
    `;

    // 2. Ubah teks HTML menjadi file virtual (Blob)
    const blob = new Blob([strukHTML], { type: 'text/html' });
    const blobURL = URL.createObjectURL(blob);

    // 3. Buka jendela baru menggunakan URL virtual tersebut
    const printWindow = window.open(blobURL, '_blank');

    if (!printWindow) {
        alert("Pop-up diblokir oleh browser. Tolong izinkan pop-up untuk situs ini.");
    }
}