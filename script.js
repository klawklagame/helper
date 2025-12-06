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

// Parallax Effect with Debouncing
let parallaxRaf = null;
function handleParallax(e) {
  if (parallaxRaf) return;
  
  parallaxRaf = requestAnimationFrame(() => {
    const shapes = document.querySelectorAll('.bg-shape');
    if (shapes.length === 0) {
      parallaxRaf = null;
      return;
    }

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 20;
      const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
      const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
      const rotate = index === 0 ? -15 : 0;
      
      shape.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotate}deg)`;
    });
    
    parallaxRaf = null;
  });
}

document.addEventListener('mousemove', handleParallax, { passive: true });

// Handle window resize for parallax
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Reset parallax on resize
    document.querySelectorAll('.bg-shape').forEach(shape => {
      shape.style.transform = '';
    });
  }, 250);
}, { passive: true });

// Init
goTo(0);
