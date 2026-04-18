const carousel = document.getElementById('carousel');
const slides = [...document.querySelectorAll('.slide')];
const buttons = [...document.querySelectorAll('.abtn')];

const isGrid = () => window.matchMedia('(min-width: 1024px)').matches;

let activeIndex = 0;

function setActive(index) {
    if (index === activeIndex) return;
    buttons[activeIndex].classList.remove('active');
    buttons[activeIndex].removeAttribute('aria-current');
    buttons[index].classList.add('active');
    buttons[index].setAttribute('aria-current', 'page');
    activeIndex = index;
}

function goTo(index) {
    if (isGrid()) {
        slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        const x = slides[index].offsetLeft - carousel.offsetLeft;
        carousel.scrollTo({ left: x, behavior: 'smooth' });
    }
    setActive(index);
}

buttons.forEach(btn => btn.addEventListener('click', () => {
    goTo(parseInt(btn.dataset.index, 10));
}));

// Sync active button while swiping — only when carousel scrolls horizontally
let ticking = false;
carousel.addEventListener('scroll', () => {
    if (isGrid() || ticking) return;
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

// Re-snap on resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!isGrid()) {
            const x = slides[activeIndex].offsetLeft - carousel.offsetLeft;
            carousel.scrollTo({ left: x, behavior: 'auto' });
        }
    }, 150);
}, { passive: true });
