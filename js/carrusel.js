const track = document.getElementById("carouselTrack");

const nextDesktop = document.getElementById("carouselNextDesktop");
const prevMobile = document.getElementById("carouselPrevMobile");
const nextMobile = document.getElementById("carouselNextMobile");

let currentIndex = 0;
const totalSlides = 3;

function updateCarousel() {
    if (window.innerWidth >= 1024) {
        // Desktop: mueve por porcentaje de ancho de slide
        track.style.transform = `translateX(-${currentIndex * 37}%)`;
    } else {
        // Mobile: cada slide ocupa 100%
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
}

// Flecha derecha desktop
if (nextDesktop) {
    nextDesktop.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex > totalSlides - 1) currentIndex = 0;
        updateCarousel();
    });
}

// Flecha derecha mobile
if (nextMobile) {
    nextMobile.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex > totalSlides - 1) currentIndex = 0;
        updateCarousel();
    });
}

// Flecha izquierda mobile
if (prevMobile) {
    prevMobile.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) currentIndex = totalSlides - 1;
        updateCarousel();
    });
}

window.addEventListener("resize", updateCarousel);
updateCarousel();
