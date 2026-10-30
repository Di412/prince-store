// --- FORMAT WAKTU (zona WITA) ---
const DASH_TZ = 'Asia/Makassar';
const DASH_TZ_LABEL = 'WITA';

function waktuParts(value, monthStyle) {
    if (!value) return null;
    let v = value;
    // created_at dari database = UTC tanpa penanda zona ("2026-10-30 10:44:32"); anggap UTC
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(v.trim())) {
        v = v.trim().replace(' ', 'T') + 'Z';
    }
    const d = v instanceof Date ? v : new Date(v);
    if (isNaN(d.getTime())) return null;
    const p = {};
    new Intl.DateTimeFormat('id-ID', {
        timeZone: DASH_TZ, day: '2-digit', month: monthStyle || '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(d).forEach(x => { p[x.type] = x.value; });
    return p;
}
// 17.44 WITA
function formatJamWITA(v) {
    const p = waktuParts(v);
    return p ? `${p.hour}.${p.minute} ${DASH_TZ_LABEL}` : '-';
}
// 30/10/2026, 17.44 WITA
function formatTanggalJamWITA(v) {
    const p = waktuParts(v);
    return p ? `${p.day}/${p.month}/${p.year}, ${p.hour}.${p.minute} ${DASH_TZ_LABEL}` : '-';
}
// 30 Okt, 17.44 WITA
function formatTanggalPendekWITA(v) {
    const p = waktuParts(v, 'short');
    return p ? `${parseInt(p.day, 10)} ${p.month}, ${p.hour}.${p.minute} ${DASH_TZ_LABEL}` : '-';
}

// --- VARIABEL GLOBAL ---
function getProofUrl(order) {
    if (!order) return '';
    return order.proof_url || order.bukti_url || order.proofUrl
        || order.bukti_pembayaran || order.bukti || order.proof
        || order.proof_file || order.file_bukti || '';
}
let globalOrdersData = [];

// --- 1. FUNGSI LOAD PESANAN ---
const ACTIVE_STATUS = ['Menunggu Pembayaran', 'Diproses', 'Masalah Transaksi'];
const STATUS_COLOR = { 'Menunggu Pembayaran':'#f59e0b', 'Diproses':'#3b82f6', 'Masalah Transaksi':'#ef4444', 'Selesai':'#10b981', 'Sukses':'#10b981' };
async function loadOrders() {
    const ordWait = document.getElementById('ord-wait');
    if (ordWait) ordWait.innerHTML = '<p class="note">Memuat data pesanan...</p>';

    try {
        const orders = await apiFetch('/api/admin/orders');
        globalOrdersData = orders; 
        renderOrderList(globalOrdersData);
        updateHeroSummary();
        renderFinancialReport();
    } catch (error) {
        if (ordWait) ordWait.innerHTML = `<p class="error">Gagal: ${error.message}</p>`;
        throw error;
    }
}

// --- 2. FUNGSI RINGKASAN PESANAN DI KOTAK KUNING ---
function updateHeroSummary() {
    const data = globalOrdersData || [];
    const st = o => (o.status || '').trim();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };

    set('st-total',   data.length);
    set('st-proses',  data.filter(o => st(o) === 'Diproses').length);
    set('st-bayar',   data.filter(o => st(o) === 'Menunggu Pembayaran').length);
    set('st-selesai', data.filter(o => ['Selesai', 'Sukses'].includes(st(o))).length);
}

// --- 3. FUNGSI MENAMPILKAN KARTU PESANAN ---
// Ganti SELURUH fungsi renderOrderList lama dengan yang ini.
function renderOrderList(ordersToRender) {
    const ordWait = document.getElementById('ord-wait');
    let htmlWaiting = "", htmlDone = "", countWaiting = 0;

    if (!ordersToRender || ordersToRender.length === 0) {
        if (ordWait) ordWait.innerHTML = '<p class="note">Pesanan tidak ditemukan.</p>';
        if(document.getElementById('ord-done')) document.getElementById('ord-done').innerHTML = '';
        return;
    }

    ordersToRender.forEach(order => {
        const dateStr = formatTanggalJamWITA(order.created_at);

        const statusTrim = order.status ? order.status.trim() : "";
        const isActive = ACTIVE_STATUS.includes(statusTrim);          // <-- BARU
        const badgeColor = STATUS_COLOR[statusTrim] || '#64748b';     // <-- BARU
        let actionButton = '';

        if (isActive) {                                               // <-- BARU
            actionButton = `<button onclick="ubahStatus('${order.id_transaksi}', 'Selesai')" style="margin-top:10px; background:#10b981; color:white; padding:8px 15px; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Tandai Selesai</button>`;
        } else {
            actionButton = `<button onclick="hapusRiwayat('${order.id_transaksi}')" style="margin-top:10px; background:#ef4444; color:white; padding:8px 15px; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Hapus Riwayat</button>`;
        }

        const proofUrl = getProofUrl(order);
        const safeId = JSON.stringify(String(order.id_transaksi || ''));
        const safeWa = JSON.stringify(String(order.wa || ''));
        const safeUrl = JSON.stringify(proofUrl);
        const proofButton = order.id_transaksi
            ? `<button onclick='openPaymentProof(${safeId}, ${safeWa}, ${safeUrl})'
                    style="margin-top:10px; margin-right:8px; background:#2563eb; color:white; padding:8px 15px; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">
                    🖼 Lihat Bukti
               </button>`
            : '';

        const card = `
            <div class="order-card" data-order-id="${order.id_transaksi || ''}" style="margin-bottom:10px; padding: 15px; border-radius: 8px;">
                <div style="display:flex; justify-content:space-between;">
                    <b>${order.id_transaksi || '-'}</b>
                    <span class="badge" style="background:${badgeColor}; color:#fff; padding:2px 8px; border-radius:10px; font-size:12px; font-weight:bold;">${statusTrim}</span>
                </div>
                <div style="font-size:0.9rem; margin-top:8px;">
                    <div>Game: <b>${order.game ? order.game.toUpperCase() : '-'}</b> | Target: <b>${order.target || '-'}</b></div>
                    <div>Item ID: ${order.item || '-'} | Metode: ${order.method || '-'}</div>
                    <div>WA: <b>${order.wa || '-'}</b></div>
                    <div style="font-size:0.8rem; margin-top:4px; opacity: 0.7;">${dateStr}</div>
                </div>
                <div style="display:flex; flex-wrap:wrap;">
                    ${proofButton}
                    ${actionButton}
                </div>
            </div>`;

        if (isActive) {                                              
            htmlWaiting += card;
            countWaiting++;
        } else {
            htmlDone += card;
        }
    });

    if(document.getElementById('ord-wait')) document.getElementById('ord-wait').innerHTML = htmlWaiting || '<p class="note">Tidak ada pesanan menunggu.</p>';
    if(document.getElementById('ord-done')) document.getElementById('ord-done').innerHTML = htmlDone || '<p class="note">Belum ada pesanan selesai.</p>';

    if (document.getElementById('home-waiting')) document.getElementById('home-waiting').innerText = countWaiting;
    if (document.getElementById('ord-badge')) {
        const badge = document.getElementById('ord-badge');
        badge.innerText = countWaiting;
        badge.classList.toggle('hide', countWaiting === 0);
    }
}

// --- 4. FUNGSI PENCARIAN PESANAN ---
function filterOrders() {
    const query = document.getElementById('searchOrder').value.toLowerCase();
    const filteredData = globalOrdersData.filter(order => {
        return (
            (order.id_transaksi && order.id_transaksi.toLowerCase().includes(query)) ||
            (order.game && order.game.toLowerCase().includes(query)) ||
            (order.target && order.target.toLowerCase().includes(query)) ||
            (order.wa && order.wa.includes(query))
        );
    });
    renderOrderList(filteredData);
}

// --- 5. FUNGSI UBAH STATUS & HAPUS ---
async function ubahStatus(orderId, statusBaru) {
    if (!confirm(`Ubah status pesanan ${orderId} menjadi ${statusBaru}?`)) return;
    try {
        await apiFetch('/api/admin/update-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId, status: statusBaru })
        });
        alert('Status berhasil diubah!');
        loadOrders();
    } catch (error) { alert('Gagal: ' + error.message); }
}

async function hapusRiwayat(orderId) {
    if (!confirm(`Hapus riwayat ${orderId}? Pastikan Anda sudah mendownload Laporan Excel.`)) return;
    try {
        await apiFetch('/api/admin/delete-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId })
        });
        alert('Riwayat berhasil dihapus!');
        loadOrders();
        if (!document.getElementById('dbpanel').classList.contains('hide')) {
            renderTransactionTable(globalOrdersData);
        }
    } catch (error) { alert('Gagal menghapus: ' + error.message); }
}

// --- 6. FUNGSI RENDER TABEL RIWAYAT TRANSAKSI ---
function renderTransactionTable(data) {
    const dbTable = document.getElementById('dbtable');
    if (!dbTable) return;

    if (!data || data.length === 0) {
        dbTable.innerHTML = '<p style="padding:20px;text-align:center;color:var(--muted);">Belum ada riwayat transaksi.</p>';
        return;
    }

    try {
        let html = `<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; text-align:left; font-size:14px; min-width: 600px;">
            <thead>
                <tr style="border-bottom:2px solid var(--line); color:var(--muted);">
                    <th style="padding:12px;">ID Transaksi</th>
                    <th style="padding:12px;">Tanggal</th>
                    <th style="padding:12px;">Game</th>
                    <th style="padding:12px;">Target Akun</th>
                    <th style="padding:12px;">Item</th>
                    <th style="padding:12px;">Status</th>
                </tr>
            </thead>
            <tbody>`;

        data.forEach(o => {
            const dateStr = formatTanggalJamWITA(o.created_at);
            let color = (o.status === 'Selesai' || o.status === 'Sukses') ? 'var(--good)' : 'var(--accent)';

            html += `<tr style="border-bottom:1px solid var(--line-soft);">
                <td style="padding:12px; font-weight:800;">${o.id_transaksi || '-'}</td>
                <td style="padding:12px;">${dateStr}</td>
                <td style="padding:12px; text-transform:uppercase; font-weight:600;">${o.game || '-'}</td>
                <td style="padding:12px;">${o.target || '-'}</td>
                <td style="padding:12px;">${o.nama_produk || o.item || '-'}</td>
                <td style="padding:12px; font-weight:700; color:${color};">${o.status || '-'}</td>
            </tr>`;
        });

        html += `</tbody></table></div>`;
        dbTable.innerHTML = html;
    } catch (err) {
        dbTable.innerHTML = `<p style="padding:20px;text-align:center;color:red;">Terjadi kesalahan: ${err.message}</p>`;
    }
}

// --- 7. FUNGSI DOWNLOAD EXCEL ---
function downloadExcel() {
    if (!globalOrdersData || globalOrdersData.length === 0) {
        alert("Tidak ada data transaksi untuk diunduh.");
        return;
    }
    const laporan = globalOrdersData.filter(o => o.status === "Selesai" || o.status === "Sukses");
    if (laporan.length === 0) {
        alert("Belum ada transaksi berstatus 'Selesai' untuk dijadikan laporan.");
        return;
    }
    const ws = XLSX.utils.json_to_sheet(laporan);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");
    XLSX.writeFile(wb, `Laporan_PrinceStore_${new Date().getTime()}.xlsx`);
}

// --- 8. KATALOG PRODUK ---
let catalogData = [];
let catalogGames = [];
const GAME_LABEL = { ff: 'Free Fire', mlbb: 'Mobile Legends', roblox: 'Roblox' };
const escAttr = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function loadCatalogAdmin() {
    const katList = document.getElementById('kat-list');
    if (katList) katList.innerHTML = '<p class="note">Memuat katalog...</p>';
    try {
        const products = await apiFetch('/api/admin/products');
        catalogData = (products || []).map(p => ({ ...p }));
        renderCatalog();
    } catch (error) {
        if (katList) katList.innerHTML = `<p class="error">Gagal: ${error.message}</p>`;
    }
}

function renderCatalog() {
    const katList = document.getElementById('kat-list');
    if (!katList) return;

    if (!catalogData.length) {
        katList.innerHTML = '<p class="note">Katalog masih kosong.</p>';
        return;
    }

    const groups = {};
    catalogData.forEach((p, i) => {
        const g = p.game || 'lainnya';
        (groups[g] = groups[g] || []).push(i);
    });
    catalogGames = Object.keys(groups);

    const inputStyle = 'width:100%; box-sizing:border-box; padding:10px 12px; border-radius:8px; border:1px solid var(--line); background:var(--card); color:var(--text); font-size:14px;';

    katList.innerHTML = catalogGames.map((g, gi) => {
        const label = GAME_LABEL[String(g).toLowerCase()] || String(g).toUpperCase();
        
        const rows = groups[g].map(i => {
            const p = catalogData[i];
            return `<div class="kat-grid-row">
                <input id="kat-nama-${i}" type="text" value="${escAttr(p.nama)}" placeholder="Nama produk" oninput="catalogEdit(${i}, 'nama', this.value)" style="${inputStyle}">
                
                <div class="kat-mobile-row">
                    <div>
                        <span style="display:none; font-size:10px; color:var(--muted); margin-bottom:2px;" class="mobile-label">Harga Modal</span>
                        <input type="number" value="${Number(p.harga_modal) || 0}" placeholder="Harga Modal" oninput="catalogEdit(${i}, 'harga_modal', this.value)" style="${inputStyle}" title="Harga Modal (Dari Supplier)">
                    </div>
                    <div>
                        <span style="display:none; font-size:10px; color:var(--muted); margin-bottom:2px;" class="mobile-label">Harga Jual</span>
                        <input type="number" value="${Number(p.harga) || 0}" placeholder="Harga Jual" oninput="catalogEdit(${i}, 'harga', this.value)" style="${inputStyle}" title="Harga Jual ke Pembeli">
                    </div>
                </div>
                
                <div class="kat-mobile-row">
                    <div>
                        <span style="display:none; font-size:10px; color:var(--muted); margin-bottom:2px;" class="mobile-label">Harga Coret</span>
                        <input type="number" value="${Number(p.harga_asli) || 0}" placeholder="Harga Coret" oninput="catalogEdit(${i}, 'harga_asli', this.value)" style="${inputStyle}" title="Harga Asli Sebelum Diskon">
                    </div>
                    <div>
                        <span style="display:none; font-size:10px; color:var(--muted); margin-bottom:2px;" class="mobile-label">Stok</span>
                        <input type="number" value="${p.stok === -1 ? -1 : Number(p.stok) || 0}" placeholder="Stok" oninput="catalogEdit(${i}, 'stok', this.value)" style="${inputStyle}" title="-1 = Tak Terbatas">
                    </div>
                </div>
                
                <div class="kat-mobile-row" style="grid-template-columns: 1fr;">
                    <div>
                        <span style="display:none; font-size:10px; color:var(--muted); margin-bottom:2px;" class="mobile-label">Promo</span>
                        <label class="promo-label" title="Tampilkan di Banner Promo">
                            <input type="checkbox" ${p.is_promo ? 'checked' : ''} onchange="catalogEdit(${i}, 'is_promo', this.checked)"> Promo
                        </label>
                    </div>
                </div>
            </div>`;
        }).join('');

        return `<div class="panel" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:10px; flex-wrap:wrap;">
                <h2 style="margin:0; font-size:1.05rem;">${label}
                    <span style="font-size:.8rem; font-weight:500; color:var(--muted);">(${groups[g].length} produk)</span>
                </h2>
                <button class="pri" onclick="catalogAdd(${gi})">+ Tambah produk</button>
            </div>
            <div class="kat-grid-header">
                <span>Nama Produk</span><span>Harga Modal</span><span>Harga Jual</span><span>Harga Coret</span><span>Stok</span><span>Promo?</span>
            </div>
            ${rows}
        </div>`;
    }).join('');
}

function catalogEdit(i, field, val) {
    if (['harga', 'harga_asli', 'harga_modal', 'stok'].includes(field)) {
        catalogData[i][field] = Number(val);
    } else {
        catalogData[i][field] = val;
    }
    const st = document.getElementById('kat-status');
    if (st) st.textContent = 'Ada perubahan, tekan Simpan.';
}

function catalogAdd(gi) {
    catalogData.push({ game: catalogGames[gi], nama: '', harga: 0, harga_asli: 0, harga_modal: 0, stok: -1, is_promo: 0 });
    renderCatalog();
    const el = document.getElementById(`kat-nama-${catalogData.length - 1}`);
    if (el) { el.focus(); el.scrollIntoView({ block: 'center' }); }
    const st = document.getElementById('kat-status');
    if (st) st.textContent = 'Produk baru belum disimpan.';
}

async function saveCatalog() {
    const st = document.getElementById('kat-status');
    const bad = catalogData.find(p => !String(p.nama || '').trim() || !(Number(p.harga) > 0));
    if (bad) { alert('Setiap produk harus punya nama dan harga jual lebih dari 0.'); return; }
    if (!confirm('Simpan perubahan katalog ke website?')) return;

    try {
        if (st) st.textContent = 'Menyimpan...';
        await apiFetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                products: catalogData.map(p => ({ 
                    ...p, 
                    nama: String(p.nama).trim(), 
                    harga: Number(p.harga),
                    harga_asli: Number(p.harga_asli) || 0,
                    harga_modal: Number(p.harga_modal) || 0,
                    stok: p.stok === undefined || p.stok === null ? -1 : Number(p.stok),
                    is_promo: p.is_promo ? 1 : 0
                }))
            })
        });
        await loadCatalogAdmin();
        if (st) st.textContent = 'Tersimpan ✔ Website sudah diperbarui.';
    } catch (error) {
        if (st) st.textContent = 'Gagal menyimpan.';
        alert('Gagal menyimpan: ' + error.message);
    }
}

// --- 9. FUNGSI LAPORAN KEUANGAN (HITUNG MODAL & LABA OTOMATIS) ---
function renderFinancialReport() {
    const completed = globalOrdersData.filter(o => o.status === 'Selesai' || o.status === 'Sukses');
    let totalSales = 0;
    let totalCapital = 0;
    
    let productRecap = {};
    let methodRecap = {};
    let monthlyRecap = {};

    completed.forEach(o => {
        const price = Number(o.harga_produk) || 0;
        const modal = Number(o.modal_produk) || 0; // Mengambil harga modal dari Worker
        
        totalSales += price;
        totalCapital += modal;

        const pName = o.nama_produk || `Item ${o.item}`;
        if(!productRecap[pName]) productRecap[pName] = { qty: 0, total: 0, modal_satuan: modal, harga_satuan: price };
        productRecap[pName].qty += 1;
        productRecap[pName].total += price;
        productRecap[pName].harga_satuan = price;
        productRecap[pName].modal_satuan = modal;

        const method = o.method ? o.method.toUpperCase() : 'UNKNOWN';
        if(!methodRecap[method]) methodRecap[method] = { qty: 0, total: 0 };
        methodRecap[method].qty += 1;
        methodRecap[method].total += price;

        let month = 'Unknown';
        if (o.created_at) {
            const d = new Date(o.created_at);
            if (!isNaN(d.getTime())) month = d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
        }
        if(!monthlyRecap[month]) monthlyRecap[month] = { qty: 0, total: 0 };
        monthlyRecap[month].qty += 1;
        monthlyRecap[month].total += price;
    });

    const grossProfit = totalSales - totalCapital;
    
    const fmtRp = (num) => `Rp ${num.toLocaleString('id-ID')}`;
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    
    setText('k-jual', fmtRp(totalSales));
    setText('k-kotor', fmtRp(grossProfit)); // Laba Kotor
    setText('k-cut', fmtRp(totalCapital));  // Total Pengurang (Modal)
    setText('k-bersih', fmtRp(grossProfit)); // Laba Bersih sementara

    // Rekap Laba Rugi
    renderReportTable('t-lr', ['Keterangan', 'Total'], [
        ['Total Penjualan', fmtRp(totalSales)],
        ['Total Modal', fmtRp(totalCapital)],
        ['Laba Kotor', fmtRp(grossProfit)],
        ['Laba Bersih', fmtRp(grossProfit)]
    ]);

    renderReportTable('t-bulan', ['Bulan', 'Transaksi', 'Pendapatan'],
        Object.keys(monthlyRecap).map(k => [k, monthlyRecap[k].qty, fmtRp(monthlyRecap[k].total)])
    );

    // Rekap Produk (Modal, Jual, Laba)
    renderReportTable('t-produk', ['Produk', 'Harga Modal', 'Harga Jual', 'Terjual', 'Laba Kotor'], 
        Object.keys(productRecap).map(k => {
            const labaPerItem = productRecap[k].harga_satuan - productRecap[k].modal_satuan;
            return [
                k, 
                fmtRp(productRecap[k].modal_satuan), 
                fmtRp(productRecap[k].harga_satuan), 
                productRecap[k].qty, 
                fmtRp(labaPerItem * productRecap[k].qty)
            ];
        })
    );

    renderReportTable('t-metode', ['Metode Bayar', 'Transaksi', 'Pendapatan'],
        Object.keys(methodRecap).map(k => [k, methodRecap[k].qty, fmtRp(methodRecap[k].total)])
    );
}

function renderReportTable(elementId, headers, rows) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (!rows || rows.length === 0) {
        el.innerHTML = '<p style="color:var(--muted);font-size:14px;">Belum ada data transaksi selesai.</p>';
        return;
    }

    let html = `<table style="width:100%; border-collapse:collapse; text-align:left; font-size:14px;"><thead><tr style="border-bottom:2px solid var(--line);">`;
    headers.forEach(h => html += `<th style="padding:12px; color:var(--muted);">${h}</th>`);
    html += `</tr></thead><tbody>`;

    rows.forEach(row => {
        html += `<tr style="border-bottom:1px solid var(--line-soft);">`;
        row.forEach(cell => html += `<td style="padding:12px;">${cell}</td>`);
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    el.innerHTML = html;
}

// --- 10. NAVIGASI MENU SIDEBAR ---
document.querySelectorAll('.nav').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetView = e.target.closest('.nav').getAttribute('data-v');
        if (!targetView) return;

        document.querySelectorAll('main section').forEach(s => s.classList.add('hide'));

        let sectionId = 'home';
        if (targetView === 'pesanan') sectionId = 'ord';
        else if (targetView === 'pembayaran') sectionId = 'pay';
        else if (['transaksi', 'biaya', 'refund'].includes(targetView)) sectionId = 'db';
        else if (targetView === 'laporan') sectionId = 'rep';
        else if (targetView === 'katalog') sectionId = 'kat';
        else if (targetView === 'blokir') sectionId = 'blk';

        const targetSection = document.getElementById(`sec-${sectionId}`);
        if (targetSection) targetSection.classList.remove('hide');

        updateHeroSummary();

        if (sectionId === 'db') {
            document.getElementById('bi-box').classList.add('hide');
            document.getElementById('rf-box').classList.add('hide');
            document.getElementById('dbpanel').classList.remove('hide');

            if (targetView === 'biaya') {
                document.getElementById('bi-box').classList.remove('hide');
                document.getElementById('dbpanel').classList.add('hide');
                document.getElementById('dbsel').value = 'biaya';
            } else if (targetView === 'refund') {
                document.getElementById('rf-box').classList.remove('hide');
                document.getElementById('dbpanel').classList.add('hide');
                document.getElementById('dbsel').value = 'refund';
            } else {
                document.getElementById('dbsel').value = 'transaksi';
                if (globalOrdersData && globalOrdersData.length > 0) {
                    renderTransactionTable(globalOrdersData);
                } else {
                    document.getElementById('dbtable').innerHTML = '<p style="padding:20px;text-align:center;">Memuat riwayat...</p>';
                }

                loadOrders().then(() => {
                    renderTransactionTable(globalOrdersData);
                }).catch(err => {
                    document.getElementById('dbtable').innerHTML = `<p style="padding:20px;text-align:center;color:red;">Gagal memuat data: ${err.message}</p>`;
                });
            }
        }

        document.getElementById('ptitle').innerText = e.target.closest('.nav').getAttribute('data-s') || "Dashboard";
        document.querySelectorAll('.nav').forEach(n => n.classList.remove('on'));
        e.target.closest('.nav').classList.add('on');

        const side = document.getElementById('side');
        const scrim = document.getElementById('scrim');
        if(side) side.classList.remove('open');
        if(scrim) scrim.classList.remove('show');

        if (targetView === 'pesanan') loadOrders();
        if (targetView === 'katalog') loadCatalogAdmin();
        if (targetView === 'pembayaran') loadPayments();
        if (targetView === 'laporan') {
            loadOrders().then(() => renderFinancialReport()).catch(err => alert("Gagal memuat laporan: " + err.message));
        }
    });
});

// --- 11. FITUR MOBILE MENU (HAMBURGER) & DARK MODE ---
document.addEventListener('DOMContentLoaded', () => {
    if(typeof apiFetch === 'function') {
        loadOrders().catch(e => console.log("Gagal load awal:", e));
    }

    const paySave = document.getElementById('pay-save');
    if (paySave) paySave.addEventListener('click', savePayments);

    const menuBtn = document.getElementById('menu');
    const side = document.getElementById('side');
    const scrim = document.getElementById('scrim');

    if (menuBtn && side && scrim) {
        menuBtn.addEventListener('click', () => { side.classList.add('open'); scrim.classList.add('show'); });
        scrim.addEventListener('click', () => { side.classList.remove('open'); scrim.classList.remove('show'); });
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if(document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '☀️ Mode';
            } else {
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '🌙 Mode';
            }
        });

        if(localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeBtn.innerHTML = '☀️ Mode';
        }
    }
});

// --- 12. METODE PEMBAYARAN (edit & simpan ke website) ---
let payData = [];
const payEsc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function loadPayments() {
    const box = document.getElementById('pay-list');
    const st = document.getElementById('pay-status');
    if (box) box.innerHTML = '<p class="note">Memuat metode pembayaran...</p>';
    try {
        const res = await apiFetch('/api/admin/payments');
        payData = (Array.isArray(res) ? res : []).map(m => ({ ...m }));
        renderPayments();
        if (st) st.textContent = '';
    } catch (error) {
        if (box) box.innerHTML = `<p class="error">Gagal memuat: ${error.message}</p>`;
    }
}

function renderPayments() {
    const box = document.getElementById('pay-list');
    if (!box) return;
    const inp = 'width:100%; box-sizing:border-box; padding:10px 12px; border-radius:8px; border:1px solid var(--line); background:var(--card); color:var(--text); font-size:14px;';
    const lbl = 'display:block; font-size:12px; font-weight:700; color:var(--muted); margin-bottom:4px;';

    box.innerHTML = payData.map((m, i) => {
        const isQris = String(m.id).toLowerCase() === 'qris';
        const isCash = String(m.id).toLowerCase() === 'cash';
        return `<div style="border:1px solid var(--line); border-radius:12px; padding:16px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:10px; flex-wrap:wrap;">
                <b style="font-size:1rem;">${payEsc(m.nama)}</b>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:13px;">
                    <input type="checkbox" ${m.aktif ? 'checked' : ''} onchange="payEdit(${i}, 'aktif', this.checked)">
                    Tampilkan di website
                </label>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px;">
                <div><label style="${lbl}">Nama metode</label>
                    <input type="text" value="${payEsc(m.nama)}" maxlength="40" oninput="payEdit(${i}, 'nama', this.value)" style="${inp}"></div>
                <div><label style="${lbl}">Biaya tambahan (Rp)</label>
                    <input type="number" min="0" step="100" value="${Number(m.biaya) || 0}" oninput="payEdit(${i}, 'biaya', this.value)" style="${inp}"></div>
                ${isCash ? '' : `
                <div><label style="${lbl}">${isQris ? 'Keterangan / NMID' : 'Nomor rekening / HP tujuan'}</label>
                    <input type="text" value="${payEsc(m.tujuan)}" maxlength="100" oninput="payEdit(${i}, 'tujuan', this.value)" style="${inp}"></div>
                <div><label style="${lbl}">Atas nama</label>
                    <input type="text" value="${payEsc(m.atas_nama)}" maxlength="60" oninput="payEdit(${i}, 'atas_nama', this.value)" style="${inp}"></div>`}
            </div>
            ${isQris ? `
            <div style="margin-top:14px;">
                <label style="${lbl}">Gambar QRIS</label>
                <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap;">
                    ${m.gambar ? `<img src="${payEsc(m.gambar)}" alt="QRIS" style="width:110px; height:110px; object-fit:contain; background:#fff; border-radius:8px; padding:4px;">`
                               : '<span class="note">Belum ada gambar</span>'}
                    <input type="file" accept="image/*" onchange="payImage(${i}, this)">
                </div>
            </div>` : ''}
        </div>`;
    }).join('');
}

function payEdit(i, field, val) {
    payData[i][field] = (field === 'biaya') ? Number(val) : val;
    const st = document.getElementById('pay-status');
    if (st) st.textContent = 'Ada perubahan, tekan Simpan.';
}

function payImage(i, input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Ukuran gambar maksimal 3 MB.'); input.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, 800 / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.round(img.width * scale);
            c.height = Math.round(img.height * scale);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            payData[i].gambar = c.toDataURL('image/png');
            renderPayments();
            const st = document.getElementById('pay-status');
            if (st) st.textContent = 'Gambar diganti, tekan Simpan.';
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
}

async function savePayments() {
    const st = document.getElementById('pay-status');
    if (!payData.length) { alert('Data metode pembayaran belum dimuat.'); return; }
    if (payData.some(m => !String(m.nama || '').trim())) { alert('Nama metode tidak boleh kosong.'); return; }
    if (payData.some(m => !(Number(m.biaya) >= 0))) { alert('Biaya tidak boleh negatif.'); return; }
    if (!payData.some(m => m.aktif)) { alert('Minimal satu metode harus ditampilkan di website.'); return; }
    if (!confirm('Simpan perubahan metode pembayaran ke website?')) return;

    try {
        if (st) st.textContent = 'Menyimpan...';
        await apiFetch('/api/admin/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ methods: payData.map(m => ({ ...m, nama: String(m.nama).trim(), biaya: Number(m.biaya) || 0 })) })
        });
        if (st) st.textContent = 'Tersimpan ✔ Website sudah diperbarui.';
    } catch (error) {
        if (st) st.textContent = 'Gagal menyimpan.';
        alert('Gagal menyimpan: ' + error.message);
    }
}

/* ========================================================
   MODAL BUKTI PEMBAYARAN
   ======================================================== */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const API_BASE = "https://prince-store.prince-store31.workers.dev";

  function openPaymentProof(orderId, wa, directUrl) {
    const modal = $('proofModal');
    if (!modal) return alert('Elemen modal belum ada di dashboard.html');

    modal.hidden = false;
    document.body.classList.add('proof-modal-open');
    $('proofModalMeta').textContent = `Order: ${orderId}`;
    
    $('proofModalBody').innerHTML = `
      <div class="proof-loading">
        <div class="proof-spinner"></div>
        <p>Memuat bukti pembayaran…</p>
      </div>`;

    let finalUrl = directUrl || '';
    if (finalUrl.startsWith('/')) finalUrl = API_BASE + finalUrl;
    if (!finalUrl) finalUrl = `${API_BASE}/api/proof?orderId=${orderId}`;
    if (wa) finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'wa=' + encodeURIComponent(wa);

    const img = new Image();
    img.className = 'proof-image';
    img.style.cursor = 'zoom-in';
    img.onload = () => {
        $('proofModalBody').innerHTML = '';
        $('proofModalBody').appendChild(img);
        $('proofModalMeta').textContent = `Order: ${orderId} • Klik gambar untuk zoom`;
        img.onclick = () => window.open(finalUrl, '_blank');
        const dl = $('proofDownloadBtn');
        dl.href = finalUrl;
        dl.setAttribute('download', `bukti-${orderId}`);
    };
    img.onerror = () => {
        $('proofModalBody').innerHTML = `
          <div class="proof-error">
            <div class="proof-error__icon">⚠️</div>
            <p class="proof-error__msg">Gagal memuat gambar</p>
            <p class="proof-error__hint">Pastikan file benar-benar ada di R2 dan URL Worker sudah benar.</p>
          </div>`;
    };
    img.src = finalUrl;
  }

  function closePaymentProof() {
    const modal = $('proofModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('proof-modal-open');
    $('proofModalBody').innerHTML = '';
  }

  window.openPaymentProof = openPaymentProof;
  window.closePaymentProof = closePaymentProof;
})();