/* Render game, nominal, metode pembayaran, dan ringkasan pesanan */

function selectGame(gameKey) {
    selectedGameKey = gameKey;
    selectedItem = null;
    selectedPayment = null;
    const data = gameData[gameKey];

    document.getElementById('selectedGameName').innerText = data.name;
    document.getElementById('selectedGameThumb').src = data.thumb;
    document.getElementById('selectedGameThumb').alt = `${data.name} icon`;
    document.getElementById('accountHelpText').innerText = data.helpText;

    const inputContainer = document.getElementById('accountInputsContainer');
    inputContainer.innerHTML = '';
    
    if(data.inputs.length === 1) {
        inputContainer.innerHTML = `
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1.5">${data.inputs[0].label}</label>
                <input type="text" id="input_${data.inputs[0].id}" oninput="updateSummary()" placeholder="${data.inputs[0].placeholder}" class="w-full bg-slate-900 border border-cardBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neonCyan">
            </div>
        `;
    } else {
        inputContainer.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1.5">${data.inputs[0].label}</label>
                    <input type="text" id="input_${data.inputs[0].id}" oninput="updateSummary()" placeholder="${data.inputs[0].placeholder}" class="w-full bg-slate-900 border border-cardBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neonCyan">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1.5">${data.inputs[1].label}</label>
                    <input type="text" id="input_${data.inputs[1].id}" oninput="updateSummary()" placeholder="${data.inputs[1].placeholder}" class="w-full bg-slate-900 border border-cardBorder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neonCyan">
                </div>
            </div>
        `;
    }

    renderNominalItems(gameKey);
    renderPayments();
    document.getElementById('topupFormSection').classList.remove('hidden');
    document.getElementById('topupFormSection').scrollIntoView({ behavior: 'smooth' });
    updateSummary();
}

function renderNominalItems(gameKey) {
    const data = gameData[gameKey];
    const nominalGrid = document.getElementById('nominalGrid');
    nominalGrid.innerHTML = '';
    
    data.items.forEach(item => {
        const card = document.createElement('div');
        const soldOut = item.stok === 0;
        
        card.className = `border border-cardBorder rounded-xl p-4 bg-slate-900/60 transition-all duration-200 relative item-card ${soldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neonCyan hover:bg-slate-900'}`;
        card.dataset.itemId = item.id;
        
        if (!soldOut) {
            card.onclick = () => selectNominal(item, card);
        }
        
        // Label Stok Habis atau Badge Promo
        const badgeText = soldOut ? 'Stok Habis' : (item.is_promo ? 'PROMO' : item.badge);
        if (badgeText) {
            const badge = document.createElement('span');
            badge.className = soldOut 
                ? 'absolute top-2 right-2 text-[9px] font-black bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full'
                : 'absolute top-2 right-2 text-[9px] font-black bg-neonCyan/20 text-neonCyan border border-neonCyan/30 px-2 py-0.5 rounded-full';
            badge.textContent = badgeText;
            card.appendChild(badge);
        }
        
        const name = document.createElement('div');
        name.className = 'text-sm font-bold text-white mb-1 pr-8';
        name.textContent = item.name;
        
        const priceContainer = document.createElement('div');
        priceContainer.className = 'flex flex-col';
        
        // Tampilkan Harga Coret (jika ada diskon)
        if (!soldOut && Number(item.harga_asli) > Number(item.price)) {
            const oldPrice = document.createElement('span');
            oldPrice.className = 'text-[10px] line-through text-slate-500';
            oldPrice.textContent = `Rp ${Number(item.harga_asli).toLocaleString('id-ID')}`;
            priceContainer.appendChild(oldPrice);
        }
        
        const price = document.createElement('div');
        price.className = 'text-xs text-neonCyan font-extrabold';
        price.textContent = `Rp ${Number(item.price).toLocaleString('id-ID')}`;
        
        priceContainer.appendChild(price);
        card.append(name, priceContainer);
        nominalGrid.appendChild(card);
    });

    if (selectedGameKey === gameKey && selectedItem) {
        const updatedItem = data.items.find(item => item.id === selectedItem.id);
        selectedItem = updatedItem || null;
        if (selectedItem) {
            const selectedCard = Array.from(nominalGrid.children)
                .find(card => card.dataset.itemId === selectedItem.id);
            if (selectedCard) selectedCard.classList.add('border-neonCyan', 'bg-neonCyan/10');
        }
    }
}

function renderPayments() {
    const groups = { ewallet: [], bank: [], pulsa: [] };
    const allowedPaymentIds = new Set(['qris', 'dana', 'gopay', 'mandiri', 'cash']);
    const methods = (Array.isArray(window.paymentConfiguration)
        ? window.paymentConfiguration
        : paymentMethods
    ).filter(payment => payment && payment.active !== false && allowedPaymentIds.has(String(payment.id).toLowerCase()));
    
    methods.forEach(p => {
        const group = groups[p.group] ? p.group : 'ewallet';
        groups[group].push(p);
    });

    Object.keys(groups).forEach(groupKey => {
        const container = document.getElementById(`payGroup-${groupKey}`);
        if(!container) return;
        container.innerHTML = '';
        groups[groupKey].forEach(pay => {
            const card = document.createElement('div');
            card.className = `cursor-pointer border border-cardBorder hover:border-neonCyan rounded-xl p-3 bg-slate-900 text-center transition-all pay-card`;
            card.onclick = () => selectPaymentMethod(pay, card);
            const icon = document.createElement('i');
            icon.className = `fa-solid ${pay.icon || 'fa-wallet'}`;
            const iconBox = document.createElement('div');
            iconBox.className = 'text-lg text-neonCyan mb-1';
            iconBox.append(icon);
            const name = document.createElement('div');
            name.className = 'text-xs font-bold text-white';
            name.textContent = pay.name;
            const fee = document.createElement('div');
            fee.className = 'text-[10px] text-slate-400 mt-0.5';
            fee.textContent = Number(pay.fee) === 0 ? 'Bebas Admin' : '+Rp ' + Number(pay.fee || 0).toLocaleString('id-ID');
            card.append(iconBox, name, fee);
            container.appendChild(card);
        });
        const groupBox = container.closest('.border');
        if (groupBox) groupBox.classList.toggle('hidden', groups[groupKey].length === 0);
    });
}

function selectNominal(item, element) {
    selectedItem = item;
    document.querySelectorAll('.item-card').forEach(el => el.classList.remove('border-neonCyan', 'bg-neonCyan/10'));
    element.classList.add('border-neonCyan', 'bg-neonCyan/10');
    updateSummary();
}

function selectPaymentMethod(pay, element) {
    selectedPayment = pay;
    document.querySelectorAll('.pay-card').forEach(el => el.classList.remove('border-neonCyan', 'bg-neonCyan/10'));
    element.classList.add('border-neonCyan', 'bg-neonCyan/10');
    updateSummary();
}

function updateSummary() {
    document.getElementById('summaryGame').innerText = selectedGameKey ? gameData[selectedGameKey].name : '-';
    
    let targetAcc = '-';
    if(selectedGameKey) {
        const data = gameData[selectedGameKey];
        if(data.inputs.length === 1) {
            const val = document.getElementById(`input_${data.inputs[0].id}`)?.value;
            if(val) targetAcc = val;
        } else if(data.inputs.length === 2) {
            const val1 = document.getElementById(`input_${data.inputs[0].id}`)?.value;
            const val2 = document.getElementById(`input_${data.inputs[1].id}`)?.value;
            if(val1 && val2) targetAcc = `${val1} (${val2})`;
            else if(val1) targetAcc = val1;
        }
    }
    document.getElementById('summaryAccount').innerText = targetAcc;

    const price = selectedItem ? Number(selectedItem.price) : 0;
    document.getElementById('summaryItem').innerText = selectedItem ? selectedItem.name : '-';
    document.getElementById('summaryPrice').innerText = `Rp ${price.toLocaleString('id-ID')}`;

    const fee = selectedPayment ? Number(selectedPayment.fee) : 0;
    document.getElementById('summaryPayment').innerText = selectedPayment ? selectedPayment.name : '-';
    document.getElementById('summaryFee').innerText = `Rp ${fee.toLocaleString('id-ID')}`;

    const total = price + fee;
    document.getElementById('summaryTotal').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = () => reject(new Error('Gagal membaca file bukti pesanan.'));
        reader.readAsDataURL(file);
    });
}