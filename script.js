const carousel = document.getElementById('carousel');
const slides = [...document.querySelectorAll('.slide')];
const buttons = [...document.querySelectorAll('.abtn')];
const headerTitle = document.querySelector('.title');
const bgShapes = [...document.querySelectorAll('.bg-shape')];

let activeIndex = 0;

function setActive(index) {
    if (index === activeIndex) return;
    buttons[activeIndex].classList.remove('active');
    buttons[activeIndex].removeAttribute('aria-current');
    buttons[index].classList.add('active');
    buttons[index].setAttribute('aria-current', 'page');
    if (headerTitle) headerTitle.textContent = slides[index].dataset.title;
    activeIndex = index;
}

function goTo(index) {
    const x = slides[index].offsetLeft - carousel.offsetLeft;
    carousel.scrollTo({ left: x, behavior: 'smooth' });
    setActive(index);
}

buttons.forEach(btn => btn.addEventListener('click', () => {
    goTo(parseInt(btn.dataset.index, 10));
}));

// Sync active button while swiping — cheap index math, no layout reads in loop
let ticking = false;
carousel.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        const slideWidth = carousel.clientWidth;
        const nearest = Math.max(0, Math.min(
            slides.length - 1,
            Math.round(carousel.scrollLeft / slideWidth)
        ));
        setActive(nearest);
        ticking = false;
    });
}, { passive: true });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(Math.max(0, activeIndex - 1));
    else if (e.key === 'ArrowRight') goTo(Math.min(slides.length - 1, activeIndex + 1));
});

// Parallax — skip on touch/no-hover devices
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let parallaxRaf = null;
let lastX = 0, lastY = 0;

function runParallax() {
    parallaxRaf = null;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < bgShapes.length; i++) {
        const speed = (i + 1) * 20;
        const xOffset = (cx - lastX) / speed;
        const yOffset = (cy - lastY) / speed;
        const rotate = i === 0 ? -15 : 0;
        bgShapes[i].style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${rotate}deg)`;
    }
}

if (canHover && bgShapes.length) {
    document.addEventListener('mousemove', (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!parallaxRaf) parallaxRaf = requestAnimationFrame(runParallax);
    }, { passive: true });
}

// Unified resize handler (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const x = slides[activeIndex].offsetLeft - carousel.offsetLeft;
        carousel.scrollTo({ left: x, behavior: 'auto' });
        bgShapes.forEach(s => { s.style.transform = ''; });
    }, 150);
}, { passive: true });

// Init
if (headerTitle) headerTitle.textContent = slides[0].dataset.title;
