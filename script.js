/* =============================================
   CRAFT & COUTURE INSTITUTE — JAVASCRIPT
   Handles: Nav scroll, mobile menu, scroll reveal,
            smooth scroll, form submission, animations
   Works for both index.html and couture-pathway.html
   ============================================= */

(function () {
  'use strict';

  // ---- HELPERS ----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ---- NAV: SCROLL STATE ----
  const nav = $('#nav');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ---- MOBILE NAV TOGGLE ----
  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animate hamburger → X
    const spans = $$('span', navToggle);
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav on link click
  $$('a', navLinks).forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      const spans = $$('span', navToggle);
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !nav.contains(e.target)) {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ---- SCROLL REVEAL ----
  const revealEls = $$('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- METRICS COUNT-UP ANIMATION (index.html only) ----
  const metricNums = $$('.metrics__num');
  let metricsAnimated = false;

  function parseNum(el) {
    const text = el.textContent.replace(/[^0-9.]/g, '');
    return parseFloat(text) || 0;
  }

  function animateCount(el, target, duration = 1800) {
    const hasSup = el.querySelector('sup');
    const supText = hasSup ? hasSup.outerHTML : '';
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);

      if (Number.isInteger(target)) {
        el.innerHTML = current + supText;
      } else {
        el.innerHTML = current + supText;
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const metricsSection = $('.metrics');
  if (metricsSection) {
    const metricsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        metricNums.forEach(el => {
          const target = parseNum(el);
          animateCount(el, target);
        });
        metricsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    metricsObserver.observe(metricsSection);
  }

  // ---- SMOOTH SCROLL for anchor links ----
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = $(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navH = nav.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  // ---- CONTACT FORM (index.html) ----
  const contactForm = $('#contactForm');
  const formSuccess = $('#formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate async send
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        formSuccess.classList.add('visible');

        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }, 1200);
    });
  }

  // ---- CONSULTATION FORM (couture-pathway.html) ----
  const cpContactForm = $('#cpContactForm');
  const cpFormSuccess = $('#cpFormSuccess');

  if (cpContactForm) {
    cpContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = cpContactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        cpContactForm.reset();
        btn.textContent = 'Send Consultation Request';
        btn.disabled = false;
        cpFormSuccess.classList.add('visible');
        setTimeout(() => cpFormSuccess.classList.remove('visible'), 5000);
      }, 1200);
    });
  }

  // ---- CARD HOVER: parallax subtle tilt (index.html) ----
  $$('.program-card, .involve-card, .partner-cat').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX =  dy * 2;
      const tiltY = -dx * 2;

      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.3s';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  // ---- CARD HOVER: parallax tilt (couture-pathway.html) ----
  $$('.cp-step, .cp-occasion, .cp-value').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-3px) perspective(800px) rotateX(${dy * 1.5}deg) rotateY(${-dx * 1.5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  // ---- ACTIVE NAV LINK on scroll ----
  const sections = $$('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + nav.offsetHeight + 40;
    let activeId = '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) activeId = sec.id;
    });

    $$('.nav__links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + activeId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- ADD ACTIVE LINK STYLE dynamically ----
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `.nav__links a.active { color: var(--gold-light) !important; }`;
  document.head.appendChild(activeStyle);

  // ---- HERO: staggered entrance (index.html) ----
  const heroContent = $('.hero__content');
  if (heroContent) {
    const children = [...heroContent.children];
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(24px)';
      child.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s`;
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        children.forEach(child => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
      }, 100);
    });
  }

  // ---- CP HERO: staggered entrance (couture-pathway.html) ----
  const cpHeroContent = $('.cp-hero__content');
  if (cpHeroContent) {
    const children = [...cpHeroContent.children];
    children.forEach((child, i) => {
      child.style.opacity   = '0';
      child.style.transform = 'translateY(24px)';
      child.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s`;
    });
    requestAnimationFrame(() => {
      setTimeout(() => {
        children.forEach(child => {
          child.style.opacity   = '1';
          child.style.transform = 'translateY(0)';
        });
      }, 100);
    });
  }

  // ---- THREAD LINE animation (index.html hero) ----
  const thread = $('.hero__thread');
  if (thread) {
    thread.style.opacity = '0';
    thread.style.transition = 'opacity 1.2s ease 0.8s';
    requestAnimationFrame(() => {
      setTimeout(() => { thread.style.opacity = '1'; }, 200);
    });
  }

  // ---- CP THREAD LINE animation (couture-pathway.html) ----
  const cpThread = $('.cp-hero__thread');
  if (cpThread) {
    cpThread.style.opacity    = '0';
    cpThread.style.transition = 'opacity 1.2s ease 0.8s';
    requestAnimationFrame(() => {
      setTimeout(() => { cpThread.style.opacity = '1'; }, 200);
    });
  }

})();
