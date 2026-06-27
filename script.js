const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  const tryPlay = () => heroVideo.play().catch(() => {});
  tryPlay();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
  ['touchstart', 'click', 'scroll'].forEach(evt => {
    document.addEventListener(evt, tryPlay, { once: true, passive: true });
  });
}

const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  menuPanel.classList.toggle('open');
});

menuPanel.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    menuPanel.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!menuPanel.contains(e.target) && !menuToggle.contains(e.target)) {
    menuToggle.classList.remove('open');
    menuPanel.classList.remove('open');
  }
});

const scrollProgress = document.getElementById('scrollProgress');
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = pct + '%';
  header.classList.toggle('scrolled', window.scrollY > 40);
});

const revealTargets = document.querySelectorAll('.t-card, .cta-inner, .hero-inner, .spotlight-content, .process-step');
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

const projectForm = document.getElementById('projectForm');
if (projectForm) {
  const supabase = window.supabase.createClient(
    'https://srobavwaipcxapnzsmqi.supabase.co',
    'sb_publishable_46ZgtTYyuXnXoPdUUrqEPA_bj-Tou_0'
  );

  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);
    const { error } = await supabase.from('demandes_projet').insert({
      name: formData.get('name'),
      email: formData.get('email'),
      project_type: formData.get('project_type'),
      message: formData.get('message'),
    });

    if (error) {
      projectForm.innerHTML = '<p style="color:#b00020;font-weight:600;text-align:center;">Une erreur est survenue, merci de réessayer ou de nous contacter par e-mail.</p>';
      console.error(error);
      return;
    }

    projectForm.innerHTML = '<p style="color:#081226;font-weight:600;text-align:center;">Merci ! Votre demande a bien été envoyée, nous vous répondons sous 24h.</p>';
  });
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length) {
  const animateStat = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));
}

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
