document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    /* =========================================================
       UTILIDAD — Envolver palabras en spans respetando HTML
       Recorre los nodos hijo sin destruir <br>, <span>, etc.
    ========================================================= */
    function wrapWordsPreservingHTML(el) {
        const processNode = (node) => {
            // Nodo de texto → partir en palabras individales
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (!text.trim()) {
                    // Solo espacios/saltos → conservar tal cual
                    return document.createTextNode(text);
                }
                // Dividir respetando espacios entre palabras
                const parts = text.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                parts.forEach((part) => {
                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(part));
                    } else if (part.length > 0) {
                        const span = document.createElement("span");
                        span.className = "gh-word";
                        span.textContent = part;
                        frag.appendChild(span);
                    }
                });
                return frag;
            }

            // Elemento <br> → clonar directamente
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
                return node.cloneNode();
            }

            // Cualquier otro elemento → clonar sin hijos y procesar hijos recursivamente
            if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                node.childNodes.forEach((child) => {
                    clone.appendChild(processNode(child));
                });
                return clone;
            }

            // Cualquier otro nodo (comentarios, etc.) → clonar tal cual
            return node.cloneNode(true);
        };

        const frag = document.createDocumentFragment();
        // Copiar childNodes en array porque el DOM muta al mover nodos
        [...el.childNodes].forEach((child) => {
            frag.appendChild(processNode(child));
        });
        el.innerHTML = "";
        el.appendChild(frag);
    }

    /* =========================================================
       1.  Elementos .effect  —  Animación de palabras elegante
           · Un solo IntersectionObserver para todos
           · Los que entran juntos se escalonan por posición Y
           · Se reinicia cada vez que se vuelve a entrar al viewport
    ========================================================= */
    const effectEls = [...document.querySelectorAll(".effect")];

    // Preparar cada elemento: wrap HTML preservando estructura
    effectEls.forEach((el) => {
        wrapWordsPreservingHTML(el);
    });

    const getWords = (el) => el.querySelectorAll(".gh-word");

    const resetWords = (el) => {
        gsap.set(getWords(el), {
            opacity: 0,
            y: 20,
            color: "#666",
            filter: "blur(4px)",
        });
    };

    const animateWords = (el, delay = 0) => {
        gsap.to(getWords(el), {
            opacity: 1,
            y: 0,
            color: "inherit",   // respeta el color original del elemento
            filter: "blur(0px)",
            stagger: 0.07,
            duration: 1,
            delay: delay,
            ease: "power3.out",
        });
    };

    // Estado inicial: todos ocultos
    effectEls.forEach(resetWords);

    // Micro-cola para acumular entradas que llegan en el mismo frame
    let effectQueue = [];
    let effectTimer = null;

    const flushEffectQueue = () => {
        // Ordenar por posición vertical en pantalla
        effectQueue.sort(
            (a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top,
        );
        effectQueue.forEach((el, i) => {
            resetWords(el);
            animateWords(el, i * 0.2); // 500ms entre cada elemento
        });
        effectQueue = [];
        effectTimer = null;
    };

    const effectObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Agregar a la cola y esperar 20ms para agrupar entradas simultáneas
                    if (!effectQueue.includes(entry.target)) {
                        effectQueue.push(entry.target);
                    }
                    clearTimeout(effectTimer);
                    effectTimer = setTimeout(flushEffectQueue, 20);
                } else {
                    // Al salir: resetear inmediatamente
                    resetWords(entry.target);
                    // Quitar de la cola por si acaso
                    effectQueue = effectQueue.filter((el) => el !== entry.target);
                }
            });
        },
        { threshold: 0.2 },
    );

    effectEls.forEach((el) => effectObserver.observe(el));

    /* =========================================================
       2.  Imágenes .effect-img  —  Animación de iconos elegante
           · Un solo IntersectionObserver para todas
           · Las que entran juntas se escalonan por posición Y
           · Se reinicia cada vez que se vuelve a entrar al viewport
    ========================================================= */
    const imgEls = [...document.querySelectorAll(".effect-img")];

    const resetImg = (img) => {
        gsap.set(img, {
            opacity: 0,
            scale: 0.55,
            rotation: -8,
            y: 16,
            filter: "blur(6px)",
        });
    };

    const animateImg = (img, delay = 0) => {
        gsap.to(img, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            delay: delay,
            ease: "back.out(1.6)",
        });
    };

    imgEls.forEach(resetImg);

    let imgQueue = [];
    let imgTimer = null;

    const flushImgQueue = () => {
        imgQueue.sort(
            (a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top ||
                a.getBoundingClientRect().left - b.getBoundingClientRect().left,
        );
        imgQueue.forEach((img, i) => {
            resetImg(img);
            animateImg(img, i * 0.2); // 200ms entre cada ícono
        });
        imgQueue = [];
        imgTimer = null;
    };

    const imgObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!imgQueue.includes(entry.target)) {
                        imgQueue.push(entry.target);
                    }
                    clearTimeout(imgTimer);
                    imgTimer = setTimeout(flushImgQueue, 20);
                } else {
                    resetImg(entry.target);
                    imgQueue = imgQueue.filter((img) => img !== entry.target);
                }
            });
        },
        { threshold: 0.25 },
    );

    imgEls.forEach((img) => imgObserver.observe(img));

    /* =========================================================
       3.  Hero "SCROLL TO EXPLORE"  —  Float + fade on scroll
    ========================================================= */
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
