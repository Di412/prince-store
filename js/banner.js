document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('[id^="bannerSlide"]');
  const dots = document.querySelectorAll('#bannerDots .banner-dot');
  
  if (slides.length === 0 || dots.length === 0) return;

  let currentSlide = 0;

  function showSlide(index) {
    // Sembunyikan semua slide
    slides.forEach((slide) => {
      slide.classList.remove('opacity-100');
      slide.classList.add('opacity-0');
    });
    
    // Reset semua dot ke warna abu-abu
    dots.forEach((dot) => {
      dot.classList.remove('bg-white', 'w-8');
      dot.classList.add('bg-slate-600', 'w-2');
    });

    // Tampilkan slide yang aktif
    slides[index].classList.remove('opacity-0');
    slides[index].classList.add('opacity-100');

    // Ubah warna dot yang aktif menjadi putih & memanjang
    dots[index].classList.remove('bg-slate-600', 'w-2');
    dots[index].classList.add('bg-white', 'w-8');
  }

  // Ganti slide setiap 4 detik
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 4000);
});