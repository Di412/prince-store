/* Data game, item, metode pembayaran, dan state aplikasi */
// DATA GAME, ITEM, DAN METODE PEMBAYARAN (DATA CADANGAN)
const gameData = {
    mlbb: {
        name: "Mobile Legends: Bang Bang",
        thumb: "https://i.pinimg.com/474x/da/8e/e7/da8ee735a4e1a99c906cec8063ef81f7.jpg",
        inputs: [
            { id: "userId", label: "User ID", placeholder: "Contoh: 12345678" },
            { id: "zoneId", label: "Zone ID", placeholder: "Contoh: 1234" }
        ],
        helpText: "User ID dan Zone ID dapat dilihat pada profil game Mobile Legends Anda.",
        items: [
            { id: "ml_86", name: "86 Diamonds", price: 22000, badge: "" },
            { id: "ml_172", name: "172 Diamonds", price: 44000, badge: "" },
            { id: "ml_257", name: "257 Diamonds", price: 66000, badge: "" }
        ]
    },
    ff: {
        name: "Free Fire",
        thumb: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7zKsZhftLavAnEgh3AcGxGAs_m8kL-TXz5E7ztD_FjQ&s=10",
        inputs: [
            { id: "userId", label: "Player ID (FF)", placeholder: "Contoh: 987654321" }
        ],
        helpText: "Player ID dapat ditemukan di bawah nama karakter pada halaman profil game.",
        items: [
            { id: "ff_70", name: "70 Diamonds", price: 10000, badge: "" },
            { id: "ff_140", name: "140 Diamonds", price: 20000, badge: "Best Seller" },
            { id: "ff_355", name: "355 Diamonds", price: 50000, badge: "Bonus" }
        ]
    },
    roblox: {
        name: "Roblox",
        thumb: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Roblox_Logo_2025.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
        inputs: [
            { id: "username", label: "Roblox Username", placeholder: "Contoh: PlayerGamer123" }
        ],
        helpText: "Pastikan penulisan Username Roblox sudah benar sesuai akun Anda.",
        items: [
            { id: "rbx_80", name: "80 Robux", price: 16000, badge: "" },
            { id: "rbx_400", name: "400 Robux", price: 75000, badge: "Hot" },
            { id: "rbx_800", name: "800 Robux", price: 145000, badge: "Best Value" }
        ]
    }
};

const paymentMethods = [
    { id: "qris", name: "Qris", fee: 0, group: "ewallet", icon: "fa-qrcode" },
    { id: "dana", name: "Dana", fee: 1000, group: "ewallet", icon: "fa-wallet" },
    { id: "gopay", name: "Gopay", fee: 1000, group: "ewallet", icon: "fa-wallet" },
    { id: "mandiri", name: "Mandiri", fee: 2500, group: "bank", icon: "fa-building-columns" },
    { id: "cash", name: "Tunai/Cash", fee: 0, group: "pulsa", icon: "fa-money-bill-wave" },
];

// STATE APLIKASI
let selectedGameKey = null;
let selectedItem = null;
let selectedPayment = null;
let currentTransaction = null;
let isSubmittingOrder = false;

// Dummy database untuk fitur lacak pesanan
let transactionsDatabase = [
    { id: "GZ-1002", game: "Mobile Legends", target: "123456 (8888)", item: "250 Diamonds", method: "QRIS", status: "Sukses", wa: "08123456789", total: "Rp 75.000" }
];
