document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Split manualmente las palabras dentro de cada .effect (h2)
    document.querySelectorAll(".effect").forEach((el) => {
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words
            .map(
                (w) =>
                    `<span class="gh-word" style="display:inline-block;white-space:nowrap;margin-right:0.25ch">${w}</span>`,
            )
            .join(" ");

        gsap.set(el.querySelectorAll(".gh-word"), {
            autoAlpha: 1,
            opacity: 0.05,
            color: "#999",
        });

        gsap
            .timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top center",
                    end: "bottom center",
                    scrub: 0.4,
                    // markers: true
                },
            })
            .to(el.querySelectorAll(".gh-word"), {
                opacity: 1,
                y: 0,
                color: "#fff",
                stagger: 0.3,
                duration: 1,
                ease: "power3.out",
            });
    });

    // Split manualmente las palabras dentro de cada .effect2 (párrafos)
    document.querySelectorAll("p.effect2").forEach((p) => {
        const words = p.textContent.trim().split(/\s+/);
        p.innerHTML = words
            .map(
                (w) =>
                    `<span class="gh-word2" style="display:inline-block;white-space:nowrap;margin-right:0.25ch">${w}</span>`,
            )
            .join(" ");

        gsap.set(p.querySelectorAll(".gh-word2"), {
            autoAlpha: 1,
            opacity: 0,
            y: 15,
        });

        gsap.from(p.querySelectorAll(".gh-word2"), {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: p,
                start: "top 80%",
                end: "bottom 60%",
                toggleActions: "play none none reverse",
                // markers: true
            },
        });
    });

    // Animación de flotar y desaparecer para "SCROLL TO EXPLORE"
    const scrollExplore = document.querySelector("#hero .absolute.left-1\\/2");

    if (scrollExplore) {
        gsap.set(scrollExplore, { xPercent: -50, x: 0 });

        gsap.to(scrollExplore, {
            y: -25,
            repeat: -1,
            yoyo: true,
            duration: 1,
            ease: "sine.inOut",
        });

        gsap.to(scrollExplore, {
            opacity: 0,
            scrollTrigger: {
                trigger: "#hero",
                start: "bottom center",
                end: "bottom bottom",
                scrub: true,
            },
        });
    }
});
