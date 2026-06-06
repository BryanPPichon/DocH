document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    let isOpen = false;

    menuBtn.addEventListener("click", () => {
        if (!isOpen) {
            mobileMenu.classList.remove("max-h-0");
            mobileMenu.classList.add("max-h-[500px]");
            isOpen = true;
        } else {
            mobileMenu.classList.remove("max-h-[500px]");
            mobileMenu.classList.add("max-h-0");
            isOpen = false;
        }
    });

    const scrollHint = document.querySelector(".scroll-hint");
    const scrollOval = document.querySelector(".scroll-oval");
    const scrollArrow = document.querySelector(".scroll-arrow");
    const sideCopy = document.querySelector(".hero-side-copy");

    if (window.gsap && scrollHint && scrollOval && scrollArrow) {
        gsap.from(scrollHint, {
            autoAlpha: 0,
            y: 24,
            duration: 1,
            delay: 0.6,
            ease: "power3.out"
        });

        gsap.to(scrollHint, {
            y: -8,
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(scrollOval, {
            boxShadow: "0 0 38px rgba(215,167,149,0.22)",
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(scrollArrow, {
            y: 7,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    if (window.gsap && sideCopy) {
        gsap.from(sideCopy, {
            autoAlpha: 0,
            x: -28,
            duration: 1.1,
            delay: 0.35,
            ease: "power3.out"
        });
    }

    // INGREDIENTS CAROUSEL — infinito, solo next
    (() => {
        const track = document.getElementById("ingr-track");
        const btnNext = document.getElementById("ingr-next");
        if (!track || !btnNext) return;

        const cards = track.querySelectorAll(".ingr-card");
        const total = cards.length;
        let idx = 0;

        const cardW = () => {
            const gap = parseFloat(getComputedStyle(track).gap) || 16;
            return cards[0].getBoundingClientRect().width + gap;
        };

        const go = (animate) => {
            const x = -(idx * cardW());
            animate
                ? gsap.to(track, { x, duration: 0.1, ease: "power3.inOut" })
                : gsap.set(track, { x });
        };

        btnNext.addEventListener("click", () => { idx = (idx + 1) % total; go(true); });

        // Swipe
        let sx = 0;
        track.addEventListener("touchstart", e => { sx = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener("touchend", e => {
            if (sx - e.changedTouches[0].screenX > 40) { idx = (idx + 1) % total; go(true); }
        }, { passive: true });

        // Resize
        let rt;
        window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => go(false), 150); });

        go(false);
    })();
});