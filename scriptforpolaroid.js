(() => {
    "use strict";
    const photos = [{
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "vince-mosqueda-minerva.jpg",
        caption: "Minerva"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }, {
        src: "mosqueda-v-l-geraldine.jpg",
        caption: "Geraldine"
    }];
  console.log('"Scattered Polaroids — CSS random()" by &Toc on codepen - https://codepen.io/ol-ivier');

    const scene = document.getElementById("scene");
    const badge = document.getElementById("badge");
    if (!scene || !badge) return;
    const supportsRandom = CSS.supports("width", "random(1px, 10px)");
    if (supportsRandom) {
        badge.textContent = "✓ CSS random() active";
        badge.classList.add("ok")
    } else {
        badge.textContent = "⚠ random() not supported — JS fallback";
        badge.classList.add("fallback");
        document.body.classList.add("no-random")
    }
    const MARGIN = 10;
    const MAX_TRIES = 400;
    const OVERLAP_RATIO = 0.25;

    function rand(min, max) {
        return Math.random() * (max - min) + min
    }

    function intersectionArea(a, b) {
        const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (w <= 0 || h <= 0) return 0;
        return w * h
    }

    function overlaps(a, b, margin) {
        const bExpanded = {
            left: b.left - margin,
            top: b.top - margin,
            right: b.right + margin,
            bottom: b.bottom + margin
        };
        const inter = intersectionArea(a, bExpanded);
        if (inter === 0) return !1;
        const areaA = (a.right - a.left) * (a.bottom - a.top);
        const areaB = (bExpanded.right - bExpanded.left) * (bExpanded.bottom - bExpanded.top);
        const ratioA = inter / areaA;
        const ratioB = inter / areaB;
        return ratioA > OVERLAP_RATIO || ratioB > OVERLAP_RATIO
    }

    function findFreePosition(w, h, placed, vw, vh) {
        const minX = 10;
        const maxX = Math.max(minX, vw - w - 10);
        const minY = 70;
        const maxY = Math.max(minY, vh - h - 10);
        for (let i = 0; i < MAX_TRIES; i++) {
            const x = rand(minX, maxX);
            const y = rand(minY, maxY);
            const rect = {
                left: x,
                top: y,
                right: x + w,
                bottom: y + h
            };
            const collides = placed.some(p => overlaps(rect, p, MARGIN));
            if (!collides) return rect
        }
        return null
    }

    function build() {
        scene.innerHTML = "";
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const root = getComputedStyle(document.documentElement);
        const cardW = parseFloat(root.getPropertyValue("--card-w"));
        const cardH = parseFloat(root.getPropertyValue("--card-h"));
        const placed = [];
        let skipped = 0;
        const shuffled = [...photos].sort(() => Math.random() - 0.5);
        shuffled.forEach((photo) => {
            const rect = findFreePosition(cardW, cardH, placed, vw, vh);
            if (!rect) {
                skipped++;
                return
            }
            placed.push(rect);
            const card = document.createElement("figure");
            card.className = "polaroid";
            card.tabIndex = 0;
            card.setAttribute("role", "img");
            card.setAttribute("aria-label", `Polaroid: ${photo.caption}`);
            card.style.setProperty("--x", `${rect.left}px`);
            card.style.setProperty("--y", `${rect.top}px`);
            if (!supportsRandom) {
                card.style.setProperty("--fallback-angle", `${rand(-14, 14)}deg`)
            }
            const img = document.createElement("img");
            img.src = photo.src;
            img.alt = photo.caption;
            img.loading = "lazy";
            img.onerror = () => {
                card.remove()
            };
            const caption = document.createElement("figcaption");
            caption.className = "caption";
            caption.textContent = photo.caption;
            card.append(img, caption);
            scene.appendChild(card)
        });
        if (skipped > 0) {
            console.info(`[polaroids] ${skipped} card(s) not placed due to lack of space.`)
        }
    }
    build();
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 200)
    })
})()