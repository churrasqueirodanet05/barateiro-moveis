// ---------- Endereços accordion ----------
  const toggle = document.getElementById('addrToggle');
  const panel = document.getElementById('addrPanel');
  const chev = document.getElementById('chev');
  if (toggle && panel && chev) {
    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      chev.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ---------- Reduced motion ----------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Reveal on scroll (fade + slide up), com leve stagger ----------
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    let staggerIndex = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Math.min(staggerIndex % 4, 3) * 70;
          staggerIndex++;
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // ---------- Barra de progresso de leitura ----------
  const progressBar = document.getElementById('progressBar');
  let ticking = false;
  function updateProgress(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    progressBar.style.transform = 'scaleX(' + pct + ')';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  // ---------- Parallax sutil no hero ----------
  if (!prefersReduced) {
    const heroImg = document.getElementById('heroImg');
    const heroBox = heroImg.closest('.hero');
    let heroTicking = false;
    function updateParallax(){
      const rect = heroBox.getBoundingClientRect();
      if (rect.bottom > 0) {
        const shift = Math.max(-40, Math.min(0, -rect.top * 0.08));
        heroImg.style.transform = 'scale(1.08) translateY(' + shift + 'px)';
      }
      heroTicking = false;
    }
    window.addEventListener('scroll', () => {
      if (!heroTicking) {
        requestAnimationFrame(updateParallax);
        heroTicking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // ---------- Pausa o vídeo quando sai da tela (economiza recursos) ----------
  const testimonialVideo = document.querySelector('.video-card video');
  if (testimonialVideo && 'IntersectionObserver' in window) {
    const vIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !testimonialVideo.paused) {
          testimonialVideo.pause();
        }
      });
    }, { threshold: 0.05 });
    vIo.observe(testimonialVideo);
  }
