const track = document.getElementById("carouselTrack");

const nextDesktop =
    document.getElementById("carouselNextDesktop");

const prevMobile =
    document.getElementById("carouselPrevMobile");

const nextMobile =
    document.getElementById("carouselNextMobile");

let currentIndex = 0;

const totalSlides = 3;

function updateCarousel() {

    if (window.innerWidth >= 1024) {

        track.style.transform =
            `translateX(-${currentIndex * 37}%)`;

    } else {

        track.style.transform =
            `translateX(-${currentIndex * 100}%)`;

    }

}

if (nextDesktop) {

    nextDesktop.addEventListener("click", () => {

        currentIndex++;

        if (currentIndex > totalSlides - 1) {

            currentIndex = 0;

        }

        updateCarousel();

    });

}

if (nextMobile) {

    nextMobile.addEventListener("click", () => {

        currentIndex++;

        if (currentIndex > totalSlides - 1) {

            currentIndex = 0;

        }

        updateCarousel();

    });

}

if (prevMobile) {

    prevMobile.addEventListener("click", () => {

        currentIndex--;

        if (currentIndex < 0) {

            currentIndex = totalSlides - 1;

        }

        updateCarousel();

    });

}

window.addEventListener("resize", updateCarousel);

updateCarousel();