async function checkPin() {
    const pinInput = document.getElementById('pinInput');
    const errMsg = document.getElementById('authErr');
    const overlay = document.getElementById('authOverlay');
    const password = pinInput.value;

    if (!password) {
        errMsg.innerText = "Password tidak boleh kosong!";
        return;
    }

    errMsg.innerText = "Memeriksa...";

    try {
        const response = await apiFetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });

        if (response.success) {
            localStorage.setItem('admin_token', response.token);
            overlay.style.display = 'none';
            errMsg.innerText = "";
            
            // Memuat data pesanan jika fungsinya ada
            if (typeof loadOrders === 'function') {
                loadOrders();
            }
        }
    } catch (error) {
        errMsg.innerText = error.message || "Password salah!";
        pinInput.value = "";
    }
}

// =========================================================
// FITUR: Cek Login Otomatis Saat Halaman Di-Refresh (Ctrl+Shift+R)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('admin_token');
    const overlay = document.getElementById('authOverlay');

    if (token) {
        // Jika token ada, sembunyikan kotak login
        if (overlay) overlay.style.display = 'none';
        
        // Panggil data pesanan (beri jeda sedikit agar file dashboard-app.js siap)
        setTimeout(() => {
            if (typeof loadOrders === 'function') {
                loadOrders();
            }
        }, 100);
    } else {
        // Jika tidak ada token, pastikan kotak login muncul
        if (overlay) overlay.style.display = 'flex';
    }
});
// =========================================================
// FITUR LOGOUT ADMIN
// =========================================================
function logoutAdmin() {
    if (confirm("Apakah Anda yakin ingin keluar dari Dashboard?")) {
        // Hapus token login dari memori browser
        localStorage.removeItem('admin_token');
        
        // Reload halaman agar kembali ke tampilan login
        window.location.reload();
    }
}