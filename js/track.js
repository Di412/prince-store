async function searchTransaction() {
    const orderId = document.getElementById('trackOrderId').value.trim();
    const wa = document.getElementById('trackPhone').value.trim();
    const resultBox = document.getElementById('trackResult');

    if (!orderId || !wa) {
        alert("Masukkan ID Pesanan dan Nomor WhatsApp!");
        return;
    }

    resultBox.classList.remove('hidden');
    resultBox.innerHTML = '<p class="text-center text-slate-400">Mencari pesanan...</p>';

    try {
        const order = await window.apiRequest(`/api/orders/${encodeURIComponent(orderId)}?wa=${encodeURIComponent(wa)}`);
        
        let statusColor = "text-yellow-400";
        let statusTrim = order.status ? order.status.trim() : "";
        if (statusTrim === "Selesai" || statusTrim === "Sukses") statusColor = "text-emerald-400";

        const totalHarga = Number(order.total) || 0;

        resultBox.innerHTML = `
            <div class="space-y-2 border-b border-slate-700 pb-3 mb-3">
                <div class="flex justify-between"><span class="text-slate-400">ID Pesanan:</span> <span class="font-bold text-white">${order.id_transaksi}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Game:</span> <span class="text-white">${order.game.toUpperCase()}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Target:</span> <span class="text-white">${order.target}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Item:</span> <span class="text-white">${order.nama_item}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Status:</span> <span class="${statusColor} font-bold">${statusTrim}</span></div>
            </div>
            <div class="flex justify-between items-center mb-4">
                <span class="text-slate-400">Total:</span> 
                <span class="font-bold text-neonCyan text-lg">Rp ${totalHarga.toLocaleString('id-ID')}</span>
            </div>
            <div id="printButtonContainer"></div>
        `;

        if (statusTrim === "Selesai" || statusTrim === "Sukses") {
            const strukData = encodeURIComponent(JSON.stringify(order));
            document.getElementById('printButtonContainer').innerHTML = `
                <button onclick="cetakStruk('${strukData}')" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-lg text-sm transition-colors mt-2">
                    <i class="fa-solid fa-print mr-1"></i> Cetak Struk Pembelian
                </button>
            `;
        } else {
            document.getElementById('printButtonContainer').innerHTML = `
                <p class="text-[11px] text-yellow-400 text-center mt-2">Tunggu admin memproses pesanan Anda untuk mencetak struk.</p>
            `;
        }
    } catch (error) {
        resultBox.innerHTML = `<p class="text-center text-red-400 text-sm">${error.message}</p>`;
    }
}

// FUNGSI MENCETAK STRUK
function cetakStruk(encodedData) {
    const order = JSON.parse(decodeURIComponent(encodedData));
    const date = new Date(order.created_at).toLocaleString('id-ID');
    const methodName = order.method ? order.method.toUpperCase() : 'CASH';
    
    // =========================================================================
    // SUDAH DISESUAIKAN MENJADI logo-profil.png
    // =========================================================================
    const logoUrl = "https://di412.github.io/prince-store/logo-profil.png"; 
    const webUrl = "di412.github.io/prince-store";

    // 1. Siapkan teks HTML
    const strukHTML = `
        <html>
        <head>
            <title>Struk - ${order.id_transaksi}</title>
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
                .row { display: flex; justify-content: space-between; margin-bottom: 4px;}
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
                    <img src="${logoUrl}" alt="Logo" onerror="this.style.display='none'">
                    <h2>PRINCE STORE</h2>
                    <p>Top Up Game Termurah & Tercepat</p>
                    <p>WA: 0812-3456-7890</p>
                </div>
                
                <div class="content">
                    <div class="row"><span>Tanggal</span><span>${date}</span></div>
                    <div class="row"><span>ID Trx</span><span>${order.id_transaksi}</span></div>
                    <div class="row"><span>Pelanggan</span><span>${order.wa}</span></div>
                    
                    <div class="row-title">DETAIL PESANAN</div>
                    <div class="row"><span>Game</span><span>${order.game.toUpperCase()}</span></div>
                    <div class="row"><span>Target Akun</span><span>${order.target}</span></div>
                    <div class="row"><span>Item</span><span>${order.nama_item}</span></div>
                    <div class="row"><span>Metode</span><span>${methodName}</span></div>

                    <div class="row-title">RINCIAN BIAYA</div>
                    <div class="row"><span>Harga Item</span><span>Rp ${(order.harga_item || 0).toLocaleString('id-ID')}</span></div>
                    <div class="row"><span>Biaya Admin</span><span>Rp ${(order.biaya_admin || 0).toLocaleString('id-ID')}</span></div>
                    
                    <div class="row total"><span>TOTAL</span><span>Rp ${(order.total || 0).toLocaleString('id-ID')}</span></div>
                    
                    <div class="lunas">*** LUNAS ***</div>
                </div>
                
                <div class="footer">
                    <div class="thanks">Terima kasih telah bertransaksi di PRINCE STORE</div>
                    <div>Simpan Struk Ini untuk menjadi bukti</div>
                    <div class="web">Website: ${webUrl}</div>
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
