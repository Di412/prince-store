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
