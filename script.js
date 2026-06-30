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

// Hero parallax: video drifts slower than scroll, logo drifts the other way for depth.
const heroVideoSection = document.querySelector('.hero-video');
if (heroVideoSection) {
  const heroLogoEl = heroVideoSection.querySelector('.hero-logo');
  const updateHeroParallax = () => {
    const rect = heroVideoSection.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / window.innerHeight));
    heroVideo.style.transform = `scale(1.12) translateY(${progress * 60}px)`;
    if (heroLogoEl) heroLogoEl.style.transform = `translateY(${progress * -30}px)`;
  };
  window.addEventListener('scroll', updateHeroParallax, { passive: true });
  updateHeroParallax();
}

// FAQ glows drift with scroll for a subtle parallax backdrop.
const testimonialsSection = document.querySelector('.faq');
const testimonialsBlobs = document.querySelectorAll('.testimonials-blob');
if (testimonialsSection && testimonialsBlobs.length) {
  const updateTestimonialsParallax = () => {
    const rect = testimonialsSection.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const swing = center / window.innerHeight;
    testimonialsBlobs.forEach((blob, i) => {
      const speed = 30 + i * 25;
      blob.style.transform = `translate3d(${swing * speed * (i % 2 ? -1 : 1)}px, ${swing * speed}px, 0)`;
    });
  };
  window.addEventListener('scroll', updateTestimonialsParallax, { passive: true });
  updateTestimonialsParallax();
}

// CTA band glow drifts with scroll for a subtle parallax backdrop.
const ctaBand = document.querySelector('.cta-band');
const ctaBlob = document.querySelector('.cta-blob');
if (ctaBand && ctaBlob) {
  const updateCtaParallax = () => {
    const rect = ctaBand.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const swing = center / window.innerHeight;
    ctaBlob.style.transform = `translate3d(${swing * 40}px, ${swing * 60}px, 0)`;
  };
  window.addEventListener('scroll', updateCtaParallax, { passive: true });
  updateCtaParallax();
}

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (item.classList.contains('is-open')) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
  question.addEventListener('click', () => {
    const wasOpen = item.classList.contains('is-open');
    faqItems.forEach(other => {
      other.classList.remove('is-open');
      other.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!wasOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

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

const revealTargets = document.querySelectorAll('.faq-item, .cta-inner, .hero-inner, .spotlight-content, .process-carousel');
revealTargets.forEach(el => el.classList.add('reveal'));

const spotlightSections = document.querySelectorAll('.spotlight-item');
const blurRevealTargets = document.querySelectorAll('.blur-reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px 300px 0px' });

revealTargets.forEach(el => observer.observe(el));
blurRevealTargets.forEach(el => observer.observe(el));
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

const processStack = document.getElementById('processStack');
if (processStack) {
  const processScroll = document.getElementById('processScroll');
  const decks = Array.from(processStack.children);
  const texts = Array.from(document.querySelectorAll('#processTextStack .process-row-text'));
  const slideCount = decks.length;
  let current = -1;

  const bgBlobs = Array.from(document.querySelectorAll('.process-bg-blob'));
  const chips = Array.from(document.querySelectorAll('.process-chip'));

  const depthClasses = ['deck-front', 'deck-mid', 'deck-back'];

  const setActive = (index) => {
    if (index === current) return;
    current = index;
    texts.forEach((text, i) => text.classList.toggle('is-active', i === current));
    // Auto-cycling deck: reorder which card is front/mid/back as the active step changes.
    decks.forEach((deck, i) => {
      const depth = (i - current + slideCount) % slideCount;
      deck.classList.remove(...depthClasses);
      deck.classList.add(depthClasses[depth]);
    });
  };

  const updateFromScroll = () => {
    const rect = processScroll.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / total));

    const index = Math.min(slideCount - 1, Math.round(progress * (slideCount - 1)));
    setActive(index);

    // Layered parallax: background blobs and the front card's chip drift at their own speed.
    const swing = progress - 0.5;
    bgBlobs.forEach((blob, i) => {
      const speed = 140 + i * 90;
      blob.style.transform = `translate3d(${swing * speed}px, ${swing * speed * 0.4}px, 0)`;
    });
    chips.forEach((chip) => {
      chip.style.transform = `translate3d(${swing * 70}px, ${swing * -24}px, 0)`;
    });
  };

  window.addEventListener('scroll', updateFromScroll, { passive: true });
  updateFromScroll();
}

