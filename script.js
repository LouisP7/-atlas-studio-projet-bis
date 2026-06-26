const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = pct + '%';
});

const revealTargets = document.querySelectorAll('.t-card, .cta-inner, .hero-inner, .spotlight-content');
revealTargets.forEach(el => el.classList.add('reveal'));

const spotlightSections = document.querySelectorAll('.spotlight-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));
spotlightSections.forEach(el => observer.observe(el));

const scrollFillTitle = document.getElementById('testimonialsTitle');
if (scrollFillTitle) {
  const words = scrollFillTitle.querySelectorAll('.word');
  const updateScrollFill = () => {
    const rect = scrollFillTitle.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const end = vh * 0.35;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    const litCount = Math.round(progress * words.length);
    words.forEach((word, i) => {
      word.classList.toggle('lit', i < litCount);
    });
  };
  window.addEventListener('scroll', updateScrollFill);
  updateScrollFill();
}
