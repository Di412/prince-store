/* Slideshow banner */
const bannerSlides = [
    document.getElementById('bannerSlideOne'),
    document.getElementById('bannerSlideTwo'),
    document.getElementById('bannerSlideThree'),
    document.getElementById('bannerSlideFour')
];
const bannerForeground = document.getElementById('bannerForeground');
const bannerOverlay = document.getElementById('bannerOverlay');
const bannerDecoration = document.getElementById('bannerDecoration');
let activeBannerSlide = 0;

setInterval(() => {
    bannerSlides[activeBannerSlide].classList.replace('opacity-80', 'opacity-0');
    activeBannerSlide = (activeBannerSlide + 1) % bannerSlides.length;
    bannerSlides[activeBannerSlide].classList.replace('opacity-0', 'opacity-80');
    const isCustomBanner = activeBannerSlide === 3;
    bannerForeground.classList.toggle('invisible', isCustomBanner);
    bannerOverlay.classList.toggle('invisible', isCustomBanner);
    bannerDecoration.classList.toggle('invisible', isCustomBanner);
}, 5000);
