/* =====================================================================
   PRINCE STORE — script website
   Semua isi (game, harga, pembayaran, banner, FAQ, dll) dibaca dari
   data/store.json yang diatur lewat Dashboard. DEFAULTS di bawah hanya
   cadangan jika file itu tidak ada. Tidak perlu mengedit file ini.
   ===================================================================== */
const DEFAULTS = {
 "version": 1,
 "store": {
  "name": "PRINCE STORE",
  "brandMain": "PRINCE",
  "brandAccent": ".STORE",
  "adminWA": "6281234567890",
  "heroTitle": "Top Up Game Murah",
  "heroSub": "Mulai dari Rp3.000 — Mobile Legends, Free Fire, Roblox.",
  "footerText": "© 2026 PRINCE STORE. Top up game murah, cepat & aman.",
  "instagram": "",
  "tiktok": "",
  "logo": "logo-header.png",
  "footerLogo": "images/footer-logo.png",
  "announcement": "",
  "open": true,
  "closedMessage": "Toko sedang tutup. Silakan kembali lagi nanti.",
  "whyTitle": "⭐ Kenapa PRINCE.STORE?",
  "favTitle": "🔥 Produk Favorit",
  "gamesTitle": "🎮 Pilih Game"
 },
 "theme": {
  "gold": "#ffd400"
 },
 "slides": [
  {
   "image": "banner.png",
   "game": "",
   "alt": "PRINCE.STORE - Top Up Game & Digital Service"
  },
  {
   "image": "images/banner-ml.jpg",
   "game": "ml",
   "alt": "Top Up Diamond Mobile Legends"
  },
  {
   "image": "images/banner-ff.jpg",
   "game": "ff",
   "alt": "Top Up Diamond Free Fire"
  },
  {
   "image": "images/banner-roblox.jpg",
   "game": "rb",
   "alt": "Top Up Robux Roblox"
  }
 ],
 "promo": {
  "enabled": true,
  "label": "Promo Spesial Hari Ini",
  "g": "ml",
  "i": "ml1"
 },
 "favorites": [
  {
   "g": "ml",
   "i": "ml1"
  },
  {
   "g": "ff",
   "i": "ff1"
  },
  {
   "g": "rb",
   "i": "rb1"
  }
 ],
 "games": [
  {
   "id": "ml",
   "name": "Mobile Legends",
   "badge": "POPULER",
   "sub": "💎 Diamond & WDP",
   "img": "images/ml.jpg",
   "banner": "images/banner-ml.jpg",
   "itemImg": "images/item-ml-diamond.jpg",
   "zone": true,
   "hint": "User ID & Zone ID ada di menu Profil game.",
   "active": true,
   "items": [
    {
     "id": "ml1",
     "n": "Weekly Diamond Pass",
     "p": 28000,
     "old": 30000,
     "img": "images/item-wdp.jpg",
     "active": true
    },
    {
     "id": "ml2",
     "n": "86 Diamond",
     "p": 20000,
     "old": 0,
     "img": "",
     "active": true
    },
    {
     "id": "ml3",
     "n": "172 Diamond",
     "p": 39000,
     "old": 0,
     "img": "",
     "active": true
    },
    {
     "id": "ml4",
     "n": "257 Diamond",
     "p": 58000,
     "old": 0,
     "img": "",
     "active": true
    },
    {
     "id": "ml5",
     "n": "514 Diamond",
     "p": 115000,
     "old": 0,
     "img": "",
     "active": true
    }
   ]
  },
  {
   "id": "ff",
   "name": "Free Fire",
   "badge": "PROMO",
   "sub": "💎 Diamond",
   "img": "images/ff.jpg",
   "banner": "images/banner-ff.jpg",
   "itemImg": "images/item-ff.jpg",
   "zone": false,
   "hint": "Player ID ada di menu Profil game.",
   "active": true,
   "items": [
    {
     "id": "ff1",
     "n": "100 Diamond",
     "p": 15000,
     "old": 17000,
     "img": "",
     "active": true
    },
    {
     "id": "ff2",
     "n": "210 Diamond",
     "p": 30000,
     "old": 0,
     "img": "",
     "active": true
    },
    {
     "id": "ff3",
     "n": "530 Diamond",
     "p": 75000,
     "old": 0,
     "img": "",
     "active": true
    },
    {
     "id": "ff4",
     "n": "1080 Diamond",
     "p": 150000,
     "old": 0,
     "img": "",
     "active": true
    }
   ]
  },
  {
   "id": "rb",
   "name": "Roblox",
   "badge": "VIA USERNAME",
   "sub": "🟩 Robux (tanpa password)",
   "img": "images/roblox.jpg",
   "banner": "images/banner-roblox.jpg",
   "itemImg": "images/item-robux.jpg",
   "zone": false,
   "hint": "Masukkan username Roblox (bukan Display Name).",
   "active": true,
   "items": [
    {
     "id": "rb1",
     "n": "100 Robux",
     "p": 20000,
     "old": 23000,
     "img": "",
     "active": true
    },
    {
     "id": "rb2",
     "n": "400 Robux",
     "p": 75000,
     "old": 0,
     "img": "",
     "active": true
    },
    {
     "id": "rb3",
     "n": "800 Robux",
     "p": 150000,
     "old": 0,
     "img": "",
     "active": true
    }
   ]
  }
 ],
 "payments": [
  {
   "id": "qris",
   "name": "QRIS",
   "logo": "images/pay-qris.png",
   "holder": "PRINCE STORE",
   "dest": "QRIS (semua e-wallet & m-banking)",
   "number": "",
   "fee": 500,
   "qr": "images/qris-pembayaran.png",
   "active": true
  },
  {
   "id": "dana",
   "name": "DANA",
   "logo": "images/pay-dana.png",
   "holder": "NAMA PEMILIK",
   "dest": "DANA",
   "number": "0812-3456-7890",
   "fee": 0,
   "qr": "",
   "active": true
  },
  {
   "id": "gopay",
   "name": "GoPay",
   "logo": "images/pay-gopay.png",
   "holder": "NAMA PEMILIK",
   "dest": "GoPay",
   "number": "0812-3456-7890",
   "fee": 0,
   "qr": "",
   "active": true
  },
  {
   "id": "bank",
   "name": "Transfer Bank",
   "logo": "images/pay-mandiri.png",
   "holder": "NAMA PEMILIK",
   "dest": "Bank Mandiri",
   "number": "1234567890123",
   "fee": 0,
   "qr": "",
   "active": true
  },
  {
   "id": "cash",
   "name": "Tunai",
   "logo": "",
   "holder": "Admin / Kios PRINCE STORE",
   "dest": "Bayar langsung ke admin atau kios",
   "number": "",
   "fee": 0,
   "qr": "",
   "active": true
  }
 ],
 "why": [
  {
   "title": "Harga Terjangkau",
   "text": "Nominal kecil mulai Rp3.000."
  },
  {
   "title": "Proses Cepat",
   "text": "Diproses setelah pembayaran terverifikasi."
  },
  {
   "title": "Aman",
   "text": "Data akun hanya dipakai untuk top up."
  },
  {
   "title": "Bisa Dilacak",
   "text": "Pantau status lewat ID transaksi."
  }
 ],
 "faq": [
  {
   "q": "Bagaimana cara top up?",
   "a": "Pilih game, isi User ID, pilih nominal, pilih metode bayar, isi nomor WhatsApp, lalu tekan \"Beli Sekarang\". Bayar sesuai tujuan yang tampil, lampirkan bukti pembayaran, dan tunggu pesanan diproses."
  },
  {
   "q": "Berapa lama prosesnya?",
   "a": "Biasanya 1–3 menit setelah pembayaran terverifikasi. Saat jam ramai atau server game bermasalah, proses bisa lebih lama."
  },
  {
   "q": "Di mana saya menemukan User ID dan Zone ID?",
   "a": "Mobile Legends: buka Profil, ID ada di bawah nama, Zone ID ada dalam tanda kurung.\nFree Fire: buka Profil, salin Player ID.\nRoblox: pakai username (bukan Display Name) dan tidak perlu password."
  },
  {
   "q": "Apakah saya perlu memberikan password akun?",
   "a": "Tidak. Kami tidak pernah meminta password, kode OTP, atau kode verifikasi. Jika ada yang memintanya atas nama kami, abaikan dan laporkan ke CS."
  },
  {
   "q": "Saya salah memasukkan ID. Apa yang harus dilakukan?",
   "a": "Segera hubungi CS dengan ID transaksi. Jika pesanan belum diproses, data masih bisa diperbaiki. Jika item sudah masuk ke akun lain, pesanan tidak dapat direfund."
  },
  {
   "q": "Pesanan saya belum masuk. Bagaimana?",
   "a": "Cek statusnya lewat menu Cek Transaksi. Jika lebih dari 15 menit belum masuk, hubungi CS dengan ID transaksi dan bukti pembayaran."
  },
  {
   "q": "Metode pembayaran apa saja yang tersedia?",
   "a": "QRIS, DANA, GoPay, transfer Bank Mandiri, dan tunai. Biaya penanganan (jika ada) tampil di ringkasan pesanan sebelum kamu membayar."
  },
  {
   "q": "Bagaimana cara mengecek status pesanan?",
   "a": "Buka Cek Transaksi dan masukkan ID transaksi. Admin memperbarui status pesanan setelah diproses. Jika status belum tampil, hubungi CS dengan ID transaksimu."
  },
  {
   "q": "Bisakah saya meminta refund?",
   "a": "Bisa, untuk kondisi tertentu seperti pesanan gagal diproses atau pembayaran ganda. Selengkapnya ada di halaman Syarat & Refund (link di bagian bawah halaman)."
  }
 ],
 "receipt": {
  "title": "STRUK PEMBELIAN",
  "header": "",
  "footer": "Terima kasih sudah top up di {toko}!",
  "note": "",
  "logo": "",
  "logoSize": "m",
  "showLogo": false,
  "showTime": true,
  "showAkun": true,
  "showPay": true,
  "showWA": false,
  "stamp": true,
  "paper": "80",
  "waTemplate": "*STRUK PEMBELIAN — {toko}*\n────────────────\nID: {id}\nTanggal: {tanggal}\nGame: {game}\nAkun: {akun}\nItem: {item}\nMetode: {bayar}\n*Total: {total}*\nStatus: *{status}* ✅\n────────────────\nTerima kasih sudah top up! 🙏"
 },
 "legal": {
  "updated": "1 November 2026",
  "syarat": "### 1. Layanan\nPRINCE STORE menyediakan layanan top up game (Mobile Legends, Free Fire, Roblox, dan game lain yang tercantum di website). Kami bukan bagian dari, dan tidak berafiliasi resmi dengan, penerbit game mana pun. Semua nama dan logo game adalah milik pemiliknya masing-masing.\n### 2. Data akun\n- Pembeli wajib mengisi User ID, Zone ID (jika ada), atau username dengan benar.\n- Kesalahan pengisian data adalah tanggung jawab pembeli. Periksa kembali sebelum menekan \"Beli Sekarang\".\n- Kami tidak pernah meminta password, kode OTP, atau kode verifikasi akun game kamu. Abaikan permintaan semacam itu atas nama kami.\n### 3. Harga dan pembayaran\n- Harga yang berlaku adalah harga yang tampil saat pesanan dibuat. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan.\n- Total pembayaran dapat mencakup biaya penanganan sesuai metode bayar yang dipilih.\n- Pembayaran harus sesuai total yang tertera dan dikirim ke tujuan pembayaran yang tampil di halaman konfirmasi.\n- Pesanan diproses setelah pembayaran terverifikasi oleh admin.\n### 4. Proses pesanan\n- Estimasi proses 1–3 menit setelah pembayaran terverifikasi.\n- Proses bisa lebih lama saat jam ramai, gangguan server game, atau pemeliharaan sistem penyedia.\n- Status pesanan dapat dicek lewat menu Cek Transaksi memakai ID transaksi.\n### 5. Hal yang dilarang\n- Mengirim bukti pembayaran palsu atau hasil suntingan.\n- Menggunakan layanan untuk penipuan, pencucian uang, atau tindakan melanggar hukum lainnya.\n- Menyalahgunakan layanan untuk melanggar aturan penerbit game.\nPesanan yang melanggar ketentuan ini dapat dibatalkan tanpa pengembalian dana, dan kami berhak menolak pesanan berikutnya.\n### 6. Risiko dari penerbit game\nKebijakan dan sistem game dapat berubah. Kami tidak bertanggung jawab atas pembatasan, pembekuan, atau penghapusan akun yang dilakukan penerbit game, di luar kendali kami.\n### 7. Perubahan ketentuan\nKami dapat memperbarui halaman ini sewaktu-waktu. Versi terbaru selalu tampil di halaman ini beserta tanggal pembaruannya.",
  "refund": "Top up game bersifat digital dan langsung masuk ke akun. Karena itu refund hanya diberikan pada kondisi berikut.\n### Pesanan yang dapat direfund\n- Pembayaran sudah terverifikasi, tetapi pesanan gagal diproses dan tidak dapat kami penuhi.\n- Pembayaran ganda untuk pesanan yang sama (selisih dikembalikan).\n- Produk atau stok tidak tersedia setelah pembayaran dilakukan.\n- Kesalahan sistem dari pihak kami yang menyebabkan item tidak masuk dan tidak bisa diperbaiki.\n### Pesanan yang tidak dapat direfund\n- Salah memasukkan User ID, Zone ID, atau username, sehingga item masuk ke akun lain.\n- Salah memilih nominal atau game.\n- Item sudah berhasil masuk ke akun yang tertera di pesanan.\n- Pembatalan sepihak setelah pesanan diproses.\n- Akun dibekukan, dibatasi, atau dibanned oleh penerbit game.\n- Pesanan yang melanggar Syarat & Ketentuan.\n### Cara mengajukan refund\n1. Hubungi CS Admin lewat WhatsApp maksimal 1×24 jam setelah pembayaran.\n2. Sertakan ID transaksi, bukti pembayaran, dan tangkapan layar kendala yang kamu alami.\n3. Admin akan memeriksa pesananmu dan memberi kepastian jawaban.\n4. Jika disetujui, dana dikembalikan dalam 1–3 hari kerja ke metode pembayaran asal atau sesuai kesepakatan dengan admin."
 }
};

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rp = n => "Rp " + Number(n || 0).toLocaleString("id-ID");
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let CONFIG = DEFAULTS;
const state = { game: null, item: null, pay: null };

/* ---------- helper data ---------- */
const gameById = id => CONFIG.games.find(g => g.id === id);
const itemsOf = g => (g.items || []).filter(i => i.active !== false);
const shownGames = () => CONFIG.games.filter(g => g.active !== false && itemsOf(g).length);
const shownPays = () => CONFIG.payments.filter(p => p.active !== false);
const itemImg = (g, it) => it.img || g.itemImg || g.img || "";
const isOpen = () => CONFIG.store.open !== false;

function shade(hex, f) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return hex;
  const n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const k = v => Math.max(0, Math.min(255, Math.round(v * f)));
  return "#" + [k(r), k(g), k(b)].map(v => v.toString(16).padStart(2, "0")).join("");
}
function applyTheme(d) {
  const gold = (d.theme && d.theme.gold) || "#ffd400", m = /^#?([0-9a-f]{6})$/i.exec(gold);
  const root = document.documentElement.style;
  root.setProperty("--gold", gold); root.setProperty("--gold-d", shade(gold, .88));
  if (m) { const n = parseInt(m[1], 16); root.setProperty("--gold-rgb", `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`); }
}

/* ---------- muat data ---------- */
async function loadData() {
  let remote = null;
  try {
    const r = await fetch("data/store.json?t=" + Date.now(), { cache: "no-store" });
    if (r.ok) remote = await r.json();
  } catch {}
  const d = Object.assign({}, DEFAULTS, remote || {});
  d.store = Object.assign({}, DEFAULTS.store, (remote && remote.store) || {});
  d.theme = Object.assign({}, DEFAULTS.theme, (remote && remote.theme) || {});
  d.receipt = Object.assign({}, DEFAULTS.receipt, (remote && remote.receipt) || {});
  ["slides", "favorites", "games", "payments", "why", "faq"].forEach(k => { if (!Array.isArray(d[k])) d[k] = DEFAULTS[k]; });
  return d;
}

/* ---------- render halaman ---------- */
function renderStatic() {
  const s = CONFIG.store;
  applyTheme(CONFIG);
  document.title = s.name + " - Top Up Game Murah, Cepat & Aman";
  $("#brandText").innerHTML = esc(s.brandMain) + "<b>" + esc(s.brandAccent) + "</b>";
  if (s.logo) $("#brandLogo").src = s.logo; else $("#brandLogo").hidden = true;
  $("#csLink").href = "https://wa.me/" + String(s.adminWA).replace(/\D/g, "");
  $("#heroTitle").textContent = s.heroTitle;
  $("#heroSub").textContent = s.heroSub;
  $("#favTitle").textContent = s.favTitle || "🔥 Produk Favorit";
  $("#gamesTitle").textContent = s.gamesTitle || "🎮 Pilih Game";
  $("#whyTitle").textContent = s.whyTitle || "";
  $("#footerText").textContent = s.footerText;
  const an = $("#announce"); an.hidden = !s.announcement; an.textContent = s.announcement || "";
  const fl = $("#footerLogo"); if (s.footerLogo) { fl.src = s.footerLogo; fl.alt = s.name; fl.hidden = false; }

  const links = [["syarat-refund.html#syarat", "Syarat & Ketentuan"], ["syarat-refund.html#refund", "Refund"], ["#faq", "FAQ"]];
  if (s.instagram) links.push([s.instagram, "Instagram"]);
  if (s.tiktok) links.push([s.tiktok, "TikTok"]);
  $("#footLinks").innerHTML = links.map(([h, t]) => `<a href="${esc(h)}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ""}>${esc(t)}</a>`).join("");
  $("#payLogos").innerHTML = shownPays().filter(p => p.logo).map(p => `<img src="${esc(p.logo)}" alt="${esc(p.name)}">`).join("");

  $("#whyList").innerHTML = (CONFIG.why || []).map(w => `<div class="card pad"><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div>`).join("");
  $("#whyWrap").hidden = !(CONFIG.why || []).length;
  $("#faqList").innerHTML = (CONFIG.faq || []).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a).replace(/\n/g, "<br>")}</p></details>`).join("");
  $("#faq").hidden = !(CONFIG.faq || []).length;
}

function cardGame(g) {
  const el = document.createElement("div");
  el.className = "card click"; el.tabIndex = 0;
  const min = Math.min(...itemsOf(g).map(i => i.p));
  el.innerHTML = `<img src="${esc(g.img)}" alt="${esc(g.name)}" loading="lazy"><div class="body">` +
    (g.badge ? `<span class="badge">${esc(g.badge)}</span>` : "") +
    `<h3>${esc(g.name)}</h3><p>${esc(g.sub)}</p><p class="price">Mulai ${rp(min)}</p></div>`;
  el.onclick = () => pickGame(g.id);
  el.onkeydown = e => { if (e.key === "Enter") pickGame(g.id); };
  return el;
}
function cardItem(g, it) {
  const el = document.createElement("div");
  el.className = "card click"; el.tabIndex = 0;
  el.innerHTML = `<img src="${esc(itemImg(g, it))}" alt="${esc(g.name)}" loading="lazy"><div class="body"><h3>${esc(g.name)}</h3><p>${esc(it.n)}</p>` +
    `<p><span class="price">${rp(it.p)}</span>${it.old ? `<span class="old">${rp(it.old)}</span>` : ""}</p></div>`;
  el.onclick = () => pickGame(g.id, it.id);
  el.onkeydown = e => { if (e.key === "Enter") pickGame(g.id, it.id); };
  return el;
}
function renderCatalog() {
  const gl = $("#gameList"); gl.innerHTML = "";
  shownGames().forEach(g => gl.appendChild(cardGame(g)));
  const fl = $("#favList"); fl.innerHTML = "";
  (CONFIG.favorites || []).forEach(f => {
    const g = gameById(f.g); if (!g || g.active === false) return;
    const it = itemsOf(g).find(i => i.id === f.i); if (it) fl.appendChild(cardItem(g, it));
  });
  $("#favWrap").hidden = !fl.children.length;

  const p = CONFIG.promo, g = p && gameById(p.g), it = g && itemsOf(g).find(i => i.id === p.i);
  const show = p && p.enabled && g && g.active !== false && it;
  $("#promoWrap").hidden = !show;
  if (show) {
    $("#promoBox").innerHTML = `<img src="${esc(itemImg(g, it))}" alt="${esc(it.n)}"><div class="pad"><small>${esc(p.label)}</small>` +
      `<h3>${esc(g.name)} — ${esc(it.n)}</h3><p><span class="price">${rp(it.p)}</span>${it.old ? `<span class="old">${rp(it.old)}</span>` : ""}</p>` +
      `<button class="btn" id="promoBuy">Beli Sekarang</button></div>`;
    $("#promoBuy").onclick = () => pickGame(g.id, it.id);
  }
}

/* ---------- alur order ---------- */
function pickGame(id, itemId) {
  const g = gameById(id); if (!g) return;
  state.game = g; state.pay = null;
  state.item = itemId ? itemsOf(g).find(i => i.id === itemId) || null : null;
  $("#gameName").textContent = g.name;
  $("#gameBanner").hidden = !g.banner;
  if (g.banner) { $("#gameBanner").src = g.banner; $("#gameBanner").alt = "Banner " + g.name; }
  $("#zoneBox").hidden = !g.zone;
  $("#idHint").textContent = g.hint || "";
  $("#userId").value = ""; $("#zoneId").value = "";
  const cn = $("#closedNote"); cn.hidden = isOpen(); cn.textContent = CONFIG.store.closedMessage || "";
  $("#buyBtn").disabled = !isOpen();
  renderItems(); renderPay(); updateSummary();
  $("#orderSection").hidden = false;
  $("#orderSection").scrollIntoView();
}
$("#changeGame").onclick = () => { $("#orderSection").hidden = true; $("#games").scrollIntoView(); };

function renderItems() {
  const box = $("#itemList"); box.innerHTML = "";
  itemsOf(state.game).forEach(it => {
    const b = document.createElement("button");
    b.className = "opt" + (state.item === it ? " on" : "");
    const im = itemImg(state.game, it);
    b.innerHTML = (im ? `<img src="${esc(im)}" alt="" loading="lazy">` : "") + `<b>${esc(it.n)}</b><span class="price">${rp(it.p)}</span>`;
    b.onclick = () => { state.item = it; renderItems(); updateSummary(); };
    box.appendChild(b);
  });
}
function renderPay() {
  const box = $("#payList"); box.innerHTML = "";
  shownPays().forEach(p => {
    const b = document.createElement("button");
    b.className = "opt" + (state.pay === p ? " on" : "");
    b.innerHTML = `<span class="plogo">${p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}">` : "💵"}</span>` +
      `<b>${esc(p.name)}</b><small>${p.fee ? "+" + rp(p.fee) : "Gratis"}</small>`;
    b.onclick = () => { state.pay = p; renderPay(); updateSummary(); };
    box.appendChild(b);
  });
  const d = $("#payDetail"); d.hidden = !state.pay;
  if (state.pay) { d.innerHTML = payDetailHTML(state.pay); bindCopy(d); }
}
function payDetailHTML(p) {
  const row = (k, v, copy) => v ? `<dt>${k}</dt><dd>${esc(v)}${copy ? ` <button type="button" class="copy" data-copy="${esc(v)}">Salin</button>` : ""}</dd>` : "";
  return `<h4>Tujuan Pembayaran</h4>${p.qr ? `<img class="qr" src="${esc(p.qr)}" alt="QR ${esc(p.name)}" onerror="this.remove()">` : ""}` +
    `<dl>${row("Akun", p.holder)}${row("Tujuan", p.dest)}${row("No. Rekening Tujuan", p.number, true)}</dl>`;
}
function bindCopy(root) {
  root.querySelectorAll("[data-copy]").forEach(b => b.onclick = async () => {
    const v = b.dataset.copy.replace(/[^\d]/g, "");
    try { await navigator.clipboard.writeText(v); b.textContent = "Tersalin ✓"; }
    catch { prompt("Salin nomor ini:", v); }
    setTimeout(() => b.textContent = "Salin", 1800);
  });
}
const account = () => {
  const u = $("#userId").value.trim(), z = $("#zoneId").value.trim();
  return state.game && state.game.zone && z ? `${u} (${z})` : u;
};
function totals() {
  const price = state.item ? state.item.p : 0, fee = state.pay ? (state.pay.fee || 0) : 0;
  return { price, fee, total: price + fee };
}
function updateSummary() {
  const t = totals();
  $("#sGame").textContent = state.game ? state.game.name : "-";
  $("#sAcc").textContent = account() || "-";
  $("#sItem").textContent = state.item ? state.item.n : "-";
  $("#sPay").textContent = state.pay ? state.pay.name : "-";
  $("#sPrice").textContent = rp(t.price); $("#sFee").textContent = rp(t.fee); $("#sTotal").textContent = rp(t.total);
}
["#userId", "#zoneId"].forEach(s => $(s).addEventListener("input", updateSummary));

/* ---------- modal ---------- */
function openModal(id) { $(id).hidden = false; }
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => b.closest(".modal").hidden = true);
function showInfo(title, html) { $("#infoTitle").textContent = title; $("#infoBody").innerHTML = html; openModal("#infoModal"); }

let draft = null;
$("#buyBtn").onclick = () => {
  if (!isOpen()) return alert(CONFIG.store.closedMessage || "Toko sedang tutup.");
  const wa = $("#wa").value.replace(/\D/g, "").replace(/^0/, "");
  if (!account()) return alert("Isi data akun dulu.");
  if (state.game.zone && !$("#zoneId").value.trim()) return alert("Isi Zone ID.");
  if (!state.item) return alert("Pilih produk dulu.");
  if (!state.pay) return alert("Pilih metode pembayaran.");
  if (wa.length < 9) return alert("Nomor WhatsApp tidak valid.");
  const t = totals();
  draft = { game: state.game.name, account: account(), item: state.item.n, pay: state.pay.name, payObj: state.pay, wa: "62" + wa, total: t.total };
  $("#confirmDetail").innerHTML = [["Game", draft.game], ["Akun", draft.account], ["Item", draft.item], ["Pembayaran", draft.pay],
    ["WhatsApp", "+" + draft.wa], ["Total", rp(draft.total)]].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");
  $("#payInfo").innerHTML = payDetailHTML(draft.payObj); bindCopy($("#payInfo"));
  $("#proof").value = "";
  openModal("#confirmModal");
};

$("#sendProof").onclick = () => {
  const f = $("#proof").files[0];
  if (draft.payObj.id !== "cash") {
    if (!f) return alert("Lampirkan bukti pembayaran.");
    if (f.size > 4 * 1024 * 1024) return alert("Maksimal 4 MB.");
  }
  const id = "TRX" + Date.now().toString(36).toUpperCase();
  const orders = ls.get("orders", {});
  orders[id] = { game: draft.game, item: draft.item, pay: draft.pay, total: draft.total, status: "Menunggu Verifikasi", time: new Date().toLocaleString("id-ID") };
  ls.set("orders", orders);
  $("#confirmModal").hidden = true;
  const msg = `Halo admin ${CONFIG.store.name}, saya order:\nID: ${id}\nGame: ${draft.game}\nAkun: ${draft.account}\nItem: ${draft.item}\n` +
    `Bayar: ${draft.pay}\nTotal: ${rp(draft.total)}\nWA: +${draft.wa}\n` + (f ? "Bukti pembayaran saya lampirkan di chat ini." : "");
  const link = "https://wa.me/" + String(CONFIG.store.adminWA).replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
  showInfo("Pesanan Dibuat",
    `<p>Kode transaksi:</p><h2 class="price">${esc(id)}</h2><p class="sub">Simpan kode ini untuk cek status. Kirim bukti pembayaran ke admin lewat WhatsApp agar pesanan diproses.</p>` +
    `<a class="btn full" target="_blank" rel="noopener" href="${esc(link)}">Kirim ke WhatsApp Admin</a>`);
};

/* ---------- lacak pesanan ---------- */
async function findOrder(id) {
  const local = ls.get("orders", {})[id];
  let remote = null;
  try {
    const r = await fetch("data/orders.json?t=" + Date.now(), { cache: "no-store" });
    if (r.ok) remote = ((await r.json()).orders || []).find(o => o.id === id);
  } catch {}
  return local || remote ? Object.assign({}, local, remote) : null;
}
/* ---------- struk ---------- */
const RC_W = { "58": 260, "80": 340, "a6": 430 };
const fillTpl = (tpl, o) => String(tpl || "").replace(/\{(\w+)\}/g, (m, k) => ({ toko: CONFIG.store.name, id: o.id, tanggal: o.time, game: o.game, akun: o.akun || "", item: o.item, bayar: o.pay, total: rp(o.total), status: String(o.status || "").toUpperCase() }[k] ?? m));
function receiptHTML(o) {
  const r = CONFIG.receipt, st = CONFIG.store, rows = [["ID Transaksi", o.id]];
  if (r.showTime) rows.push(["Tanggal", o.time]);
  rows.push(["Game", o.game]);
  if (r.showAkun && o.akun) rows.push(["Akun / ID", o.akun]);
  rows.push(["Item", o.item]);
  if (r.showPay) rows.push(["Metode bayar", o.pay]);
  const lg = r.showLogo ? (r.logo || st.logo) : "", lh = { s: 36, m: 56, l: 84 }[r.logoSize] || 56;
  return `<div class="rc" style="max-width:${RC_W[r.paper] || 340}px">${lg ? `<img class="rc-logo" style="max-height:${lh}px" src="${esc(lg)}" alt="">` : ""}` +
    `<div class="rc-h"><b>${esc(st.name)}</b>${r.header ? `<small>${esc(r.header).replace(/\n/g, "<br>")}</small>` : ""}<span>${esc(r.title)}</span></div><div class="rc-sep"></div>` +
    `<dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl><div class="rc-sep"></div>` +
    `<div class="rc-t"><span>TOTAL</span><b>${rp(o.total)}</b></div>${r.stamp ? `<div class="rc-st">${esc(String(o.status).toUpperCase())}</div>` : ""}` +
    (r.note ? `<p class="rc-n">${esc(r.note).replace(/\n/g, "<br>")}</p>` : "") + `<p class="rc-f">${esc(fillTpl(r.footer, o))}</p></div>`;
}
function printReceipt(o) { $("#receipt").innerHTML = receiptHTML(o); window.print(); }

/* ---------- lacak pesanan ---------- */
async function findOrder(id) {
  const local = ls.get("orders", {})[id];
  let remote = null;
  try {
    const r = await fetch("data/orders.json?t=" + Date.now(), { cache: "no-store" });
    if (r.ok) remote = ((await r.json()).orders || []).find(o => o.id === id);
  } catch {}
  return local || remote ? Object.assign({ id }, local, remote) : null;
}
$("#trackBtn").onclick = () => {
  showInfo("Lacak Status Pesanan", `<label>ID transaksi</label><input id="trackId" placeholder="TRX..."><button class="btn full" id="doTrack">Cari Pesanan</button><div id="trackRes"></div>`);
  
  $("#doTrack").onclick = async () => {
    const id = $("#trackId").value.trim().toUpperCase(), box = $("#trackRes");
    if (!id) return;
    box.innerHTML = `<p class="sub" style="text-align:center;padding:20px;">Mencari...</p>`;
    
    const o = await findOrder(id);
    if (!o) { 
      box.innerHTML = `<p class="sub" style="text-align:center;padding:20px;">Pesanan tidak ditemukan. Jika baru dibuat, tunggu admin memprosesnya.</p>`; 
      return; 
    }

    // Tentukan Class Badge
    let badgeClass = "badge-menunggu";
    if (o.status === "Diproses" || o.status === "Menunggu Pembayaran") badgeClass = "badge-diproses";
    if (o.status === "Selesai") badgeClass = "badge-selesai";
    if (o.status === "Gagal" || o.status === "Refund") badgeClass = "badge-gagal";

    // Logika Timeline
    let tlHTML = `
      <div class="tl-item completed">
        <div class="tl-title">Pesanan diterima</div>
        <div class="tl-time">${o.time}</div>
      </div>
    `;

    if (o.status !== "Menunggu Pembayaran" && o.status !== "Baru") {
      tlHTML += `
        <div class="tl-item completed">
          <div class="tl-title">Pembayaran dikonfirmasi admin</div>
          <div class="tl-time">Terverifikasi</div>
        </div>
      `;
    }

    if (o.status === "Diproses" || o.status === "Selesai") {
      tlHTML += `
        <div class="tl-item ${o.status === 'Diproses' ? 'active' : 'completed'}">
          <div class="tl-title">Sedang diproses</div>
          <div class="tl-desc">Pesanan sedang disiapkan.</div>
        </div>
      `;
    }

    if (o.status === "Selesai") {
      tlHTML += `
        <div class="tl-item active">
          <div class="tl-title">Selesai</div>
          <div class="tl-desc">Pesanan telah berhasil masuk.</div>
        </div>
      `;
    } else if (o.status === "Gagal" || o.status === "Refund") {
      tlHTML += `
        <div class="tl-item active" style="--gold:#ff6b6b">
          <div class="tl-title" style="color:#ff6b6b;">${o.status}</div>
          <div class="tl-desc">Silakan hubungi admin untuk info lebih lanjut.</div>
        </div>
      `;
    } else if (o.status !== "Selesai") {
      tlHTML += `
        <div class="tl-item">
          <div class="tl-title">Selesai</div>
          <div class="tl-time">Menunggu</div>
        </div>
      `;
    }

    // Render HTML
    box.innerHTML = `
      <div class="order-card" style="margin-top:15px;">
        <div class="order-header">
          <div class="order-id">
            <h4>#${esc(o.id)}</h4>
            <p>${esc(o.game)} - ${esc(o.item)}</p>
            <strong>${rp(o.total)}</strong>
          </div>
          <span class="badge-status ${badgeClass}">${esc(o.status)}</span>
        </div>
        <div class="timeline">
          ${tlHTML}
        </div>
        <div class="track-actions">
          <button class="btn" id="btnViewRc">Lihat struk</button>
          <button class="btn-ghost" id="btnDownloadRc">Unduh struk</button>
        </div>
      </div>
    `;

    // Event untuk struk
    if (o.status === "Selesai") {
      $("#btnViewRc").onclick = () => showInfo("Struk Pesanan", receiptHTML(o));
      $("#btnDownloadRc").onclick = () => printReceipt(o);
    } else {
      $("#btnViewRc").disabled = true;
      $("#btnDownloadRc").disabled = true;
      $("#btnViewRc").style.opacity = 0.5;
      $("#btnDownloadRc").style.opacity = 0.5;
    }
  };
};

/* ---------- carousel banner ---------- */
function initCarousel() {
  const car = $("#carousel"), list = (CONFIG.slides || []).filter(s => s.image);
  if (!list.length) { car.hidden = true; return; }
  car.innerHTML = `<div class="ctrack">${list.map(s => `<a class="slide" href="#games"${s.game ? ` data-game="${esc(s.game)}"` : ""}><img src="${esc(s.image)}" alt="${esc(s.alt || "")}"></a>`).join("")}</div>` +
    `<button class="cbtn prev" aria-label="Banner sebelumnya">&#8249;</button><button class="cbtn next" aria-label="Banner berikutnya">&#8250;</button>` +
    `<div class="dots" id="dots"></div><div class="cbar"><i></i></div>`;
  const track = car.querySelector(".ctrack"), slides = [...track.children], dots = $("#dots"), bar = car.querySelector(".cbar i");
  const DELAY = 4500, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = null, paused = false, moved = false;
  const multi = slides.length > 1;
  if (!multi) car.querySelectorAll(".cbtn,.dots,.cbar").forEach(e => e.hidden = true);
  slides.forEach((s, n) => {
    s.style.setProperty("--bg", `url("${s.querySelector("img").src}")`);
    const d = document.createElement("button"); d.setAttribute("aria-label", "Banner " + (n + 1)); d.onclick = () => go(n); dots.appendChild(d);
  });
  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    slides.forEach((s, k) => s.classList.toggle("on", k === i));
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
    play();
  }
  function play() {
    clearTimeout(timer); bar.classList.remove("run"); bar.style.transition = "none"; bar.style.width = "0";
    if (reduce || paused || !multi) return;
    void bar.offsetWidth; bar.style.transition = ""; bar.style.width = ""; bar.classList.add("run");
    timer = setTimeout(() => go(i + 1), DELAY);
  }
  const pause = v => { paused = v; v ? (clearTimeout(timer), bar.classList.remove("run"), bar.style.width = "0") : play(); };
  car.querySelector(".prev").onclick = () => go(i - 1);
  car.querySelector(".next").onclick = () => go(i + 1);
  car.addEventListener("mouseenter", () => pause(true));
  car.addEventListener("mouseleave", () => pause(false));
  car.addEventListener("focusin", () => pause(true));
  car.addEventListener("focusout", () => pause(false));
  car.addEventListener("keydown", e => { if (e.key === "ArrowLeft") go(i - 1); if (e.key === "ArrowRight") go(i + 1); });
  document.addEventListener("visibilitychange", () => pause(document.hidden));
  let x0 = null;
  car.addEventListener("pointerdown", e => { x0 = e.clientX; moved = false; });
  car.addEventListener("pointerup", e => {
    if (x0 === null) return; const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) { moved = true; go(dx < 0 ? i + 1 : i - 1); }
  });
  slides.forEach(s => s.addEventListener("click", e => {
    if (moved) return e.preventDefault();
    if (s.dataset.game) { e.preventDefault(); pickGame(s.dataset.game); }
  }));
  go(0);
}

/* ---------- mulai ---------- */
(async function boot() {
  CONFIG = await loadData();
  renderStatic();
  renderCatalog();
  initCarousel();
})();
