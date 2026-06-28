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

const revealTargets = document.querySelectorAll('.t-card, .cta-inner, .hero-inner, .spotlight-content, .process-carousel');
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

const processTrack = document.getElementById('processTrack');
if (processTrack) {
  const processScroll = document.getElementById('processScroll');
  const progressFill = document.getElementById('processProgressFill');
  const rows = Array.from(processTrack.children);
  const dots = Array.from(document.querySelectorAll('.process-dot'));
  const slideCount = rows.length;
  let current = -1;

  const bgBlobs = Array.from(document.querySelectorAll('.process-bg-blob'));
  const watermarks = Array.from(document.querySelectorAll('.process-row-watermark'));
  const iconBadges = Array.from(document.querySelectorAll('.process-chip'));

  const setActive = (index) => {
    if (index === current) return;
    current = index;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    rows.forEach((row, i) => {
      row.classList.remove('is-active');
      if (i === current) {
        void row.offsetWidth;
        row.classList.add('is-active');
      }
    });
  };

  const updateFromScroll = () => {
    const rect = processScroll.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / total));

    // Continuous horizontal parallax: the track tracks scroll 1:1 instead of snapping between slides.
    processTrack.style.transform = `translateX(-${progress * (slideCount - 1) * 100}%)`;

    // Layered parallax: each depth layer moves at its own speed off the same progress value,
    // from slowest (farthest back) to fastest (closest to the viewer).
    const swing = progress - 0.5;
    bgBlobs.forEach((blob, i) => {
      const speed = 140 + i * 90;
      blob.style.transform = `translate3d(${swing * speed}px, ${swing * speed * 0.4}px, 0)`;
    });
    watermarks.forEach((mark) => {
      mark.style.transform = `translateX(${swing * -90}px)`;
    });
    iconBadges.forEach((badge) => {
      badge.style.transform = `translate3d(${swing * 130}px, ${swing * -40}px, 0)`;
    });

    const index = Math.min(slideCount - 1, Math.round(progress * (slideCount - 1)));
    setActive(index);
    if (progressFill) {
      progressFill.style.width = `${progress * 100}%`;
    }
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const rect = processScroll.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const targetY = window.scrollY + rect.top + (i / (slideCount - 1)) * total + 10;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', updateFromScroll, { passive: true });
  updateFromScroll();
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
