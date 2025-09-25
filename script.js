const carousel = document.getElementById('carousel');
const slides = [...document.querySelectorAll('.slide')];
const buttons = [...document.querySelectorAll('.abtn')];
const headerTitle = document.querySelector('.title');

function goTo(index) {
    const x = slides[index].offsetLeft - carousel.offsetLeft;
    carousel.scrollTo({
        left: x,
        behavior: 'smooth'
    });
    buttons.forEach(b => b.classList.remove('active'));
    buttons[index].classList.add('active');
    headerTitle.textContent = slides[index].dataset.title;
}

// Click buttons to navigate
buttons.forEach(btn => btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.index);
    goTo(idx);
}));

// Sync active button & title while swiping
let ticking = false;
carousel.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        const mid = carousel.scrollLeft + carousel.clientWidth / 2;
        let nearest = 0,
            best = Infinity;
        slides.forEach((s, i) => {
            const center = s.offsetLeft + s.clientWidth / 2;
            const dist = Math.abs(center - mid);
            if (dist < best) {
                best = dist;
                nearest = i
            }
        });
        buttons.forEach(b => b.classList.remove('active'));
        buttons[nearest].classList.add('active');
        headerTitle.textContent = slides[nearest].dataset.title;
        ticking = false;
    });
}, {
    passive: true
});

// Keep current slide centered on resize
window.addEventListener('resize', () => {
    const activeIndex = Math.max(0, buttons.findIndex(b => b.classList.contains('active')));
    goTo(activeIndex);
});

// Init
goTo(0);