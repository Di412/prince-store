/* Konfigurasi Tailwind CDN (dimuat tepat setelah script Tailwind) */
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                yellowBg: '#FFD700',
                cardBg: '#131b2e',
                cardBorder: '#1e293b',
                neonCyan: '#00f0ff',
                neonPurple: '#a855f7',
                gamingOrange: '#ff5e00',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Rajdhani', 'sans-serif'],
            }
        }
    }
}
