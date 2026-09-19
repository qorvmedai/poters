/**
 * ═══════════════════════════════════════════════════════════════
 * THE PORTERS CLAN — Interaction Engine
 * ═══════════════════════════════════════════════════════════════
 * Handles all scroll animations, hero entrance, mobile menu,
 * FAQ accordion, people carousel, testimonial rail, counters,
 * and smooth scrolling.
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ─── CONFIGURATION ───────────────────────────────────────────
  const CONFIG = {
    communityImages: [
      'community-members/pch-1.jpg',
      'community-members/pch-2.jpg',
      'community-members/pch-3.jpg',
      'community-members/pch-4.jpg',
      'community-members/pch-5.jpg',
      'community-members/pch-6.jpg',
      'community-members/pch-7.jpg',
      'community-members/pch-8.jpg',
      'community-members/pch-9.jpg',
      'community-members/pch-10.jpg',
      'community-members/pch-11.jpg',
      'community-members/pch-12.jpg',
      'community-members/pch-13.jpg',
      'community-members/pch-15.jpg',
      'community-members/pch-16.jpg',
      'community-members/pch-17.jpg',
      'community-members/pch-18.jpg',
      'community-members/pch-19.jpg',
      'community-members/pch-21.jpg',
      'community-members/pch-22.jpg',
      'community-members/pch-23.jpg',
    ],
    carouselInterval: 3500,
    revealThreshold: 0.15,
    counterDuration: 2000,
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── UTILITY ─────────────────────────────────────────────────
  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }

  // ─── 1. HERO ENTRANCE SEQUENCE ──────────────────────────────
  function initHeroEntrance() {
    const heroLines = $$('.hero-line');
    const heroBody = $('.hero-body');
    const heroCTAs = $('.hero-ctas');
    const heroLabel = $('#hero .section-label');

    if (prefersReducedMotion) {
      // Show everything immediately
      [heroLabel, ...heroLines, heroBody, heroCTAs].forEach((el) => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      return;
    }

    // Set initial states
    const elements = [heroLabel, ...heroLines, heroBody, heroCTAs];
    elements.forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'none';
      }
    });

    // Stagger animation
    requestAnimationFrame(() => {
      const delays = [200, 400, 600, 800, 1000, 1200];
      elements.forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
          el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delays[i] || 1200);
      });
    });
  }

  // ─── 2. SCROLL-TRIGGERED REVEAL ──────────────────────────────
  function initScrollReveal() {
    // Collect all elements that should animate on scroll
    const revealSelectors = [
      '#about .section-label',
      '#about h2',
      '#about .about-content',
      '#about .about-visual img',
      '#about .stats-row',
      '#about .stat-badge',
      '#mission .section-label',
      '#mission .mission-transform',
      '#mission .mission-body',
      '#who .section-label',
      '#who h2',
      '.who-card',
      '#clarity .section-label',
      '#clarity h2',
      '#clarity .clarity-content > p:first-child',
      '.clarity-day',
      '#clarity .clarity-visual',
      '#clarity .btn',
      '#bridge .bridge-word',
      '#cells .section-label',
      '#cells h2',
      '#cells > .section-container > p',
      '.cell-block',
      '#community .section-label',
      '#community h2',
      '#why-join .section-label',
      '#why-join h2',
      '.why-item',
      '#experience .section-label',
      '#experience h2',
      '#experience > .section-container > p',
      '.photo-grid img',
      '#testimonials .section-label',
      '#testimonials h2',
      '#impact .section-label',
      '#impact h2',
      '.impact-grid > div',
      '#stories .section-label',
      '#stories h2',
      '.story-card',
      '#faq .section-label',
      '#faq h2',
      '.faq-item',
      '#cta h2',
      '#cta p',
      '#cta .cta-buttons',
      '#contact .section-label',
      '#contact h2',
      '.contact-methods',
    ];

    const revealElements = [];
    revealSelectors.forEach((sel) => {
      $$(sel).forEach((el) => revealElements.push(el));
    });

    if (prefersReducedMotion) {
      revealElements.forEach((el) => {
        el.classList.add('revealed');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Set initial state for all reveal elements
    revealElements.forEach((el) => {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add stagger delay for grouped items
            const el = entry.target;
            const parent = el.parentElement;
            if (parent) {
              const siblings = $$(`.${el.classList[0]}`, parent);
              const index = siblings.indexOf(el);
              if (index > 0) {
                el.style.transitionDelay = `${index * 100}ms`;
              }
            }
            el.classList.add('revealed');
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: CONFIG.revealThreshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // ─── 3. HEADER SCROLL BEHAVIOR ──────────────────────────────
  function initHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }

        // Hide/show header on scroll direction
        if (scrollY > lastScroll && scrollY > 400) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }

        lastScroll = scrollY;
        ticking = false;
      });
    });
  }

  // ─── 4. MOBILE MENU ─────────────────────────────────────────
  function initMobileMenu() {
    const hamburger = $('.nav-hamburger');
    const mobileMenu = $('.mobile-menu');
    const menuLinks = $$('.mobile-menu a');

    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
      const isOpen = mobileMenu.classList.toggle('mobile-menu--open');
      hamburger.classList.toggle('nav-hamburger--active');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('mobile-menu--open')) {
          toggleMenu();
        }
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
        toggleMenu();
      }
    });
  }

  // ─── 5. SMOOTH SCROLL ───────────────────────────────────────
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = $(targetId);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      });
    });
  }

  // ─── 6. ACTIVE NAV TRACKING ─────────────────────────────────
  function initActiveNavTracking() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-links a, .mobile-menu a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ─── 7. MISSION TEXT TRANSFORM ──────────────────────────────
  function initMissionTransform() {
    const missionSection = $('#mission');
    const beforeText = $('.mission-before');
    const afterText = $('.mission-after');

    if (!missionSection || !beforeText || !afterText) return;

    if (prefersReducedMotion) {
      beforeText.style.opacity = '0';
      afterText.style.opacity = '1';
      return;
    }

    // Initial state
    afterText.style.opacity = '0';
    afterText.style.transform = 'translateY(20px)';
    afterText.style.position = 'absolute';
    afterText.style.top = '0';
    afterText.style.left = '0';
    afterText.style.width = '100%';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger the transform after a short delay
            setTimeout(() => {
              beforeText.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              beforeText.style.opacity = '0';
              beforeText.style.transform = 'translateY(-20px)';

              setTimeout(() => {
                afterText.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                afterText.style.opacity = '1';
                afterText.style.transform = 'translateY(0)';
              }, 400);
            }, 600);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(missionSection);
  }

  // ─── 8. COMMUNITY PORTRAIT CAROUSEL ─────────────────────────
  function initCommunityCarousel() {
    const portrait = $('.community-portrait');
    if (!portrait) return;

    const activeImg = $('.community-active-img', portrait);
    if (!activeImg) return;

    const images = CONFIG.communityImages;
    let currentIndex = 0;
    let intervalId = null;
    let isPaused = false;

    // Preload all images
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    function crossfadeTo(index) {
      if (prefersReducedMotion) {
        activeImg.src = images[index];
        activeImg.alt = `Community member portrait ${index + 1}`;
        return;
      }

      activeImg.style.transition = 'opacity 0.8s ease';
      activeImg.style.opacity = '0';

      setTimeout(() => {
        activeImg.src = images[index];
        activeImg.alt = `Community member portrait ${index + 1}`;
        activeImg.style.opacity = '1';
      }, 800);
    }

    function next() {
      currentIndex = (currentIndex + 1) % images.length;
      crossfadeTo(currentIndex);
    }

    function startCarousel() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!isPaused) next();
      }, CONFIG.carouselInterval);
    }

    // Pause on hover (desktop) / tap (mobile)
    portrait.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    portrait.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    portrait.addEventListener('click', () => {
      next();
    });

    // Only start when in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCarousel();
          } else {
            if (intervalId) clearInterval(intervalId);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(portrait);
  }

  // ─── 9. FAQ ACCORDION ───────────────────────────────────────
  function initFAQAccordion() {
    const faqItems = $$('.faq-item');

    faqItems.forEach((item) => {
      const button = $('button', item);
      const answer = $('.faq-answer', item);

      if (!button || !answer) return;

      // Set initial state
      answer.style.maxHeight = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = prefersReducedMotion ? 'none' : 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      answer.style.paddingTop = '0';
      answer.style.paddingBottom = '0';

      button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        // Close all other items
        faqItems.forEach((otherItem) => {
          const otherBtn = $('button', otherItem);
          const otherAnswer = $('.faq-answer', otherItem);
          if (otherItem !== item && otherBtn && otherAnswer) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherAnswer.setAttribute('aria-hidden', 'true');
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.paddingTop = '0';
            otherAnswer.style.paddingBottom = '0';
            otherItem.classList.remove('faq-item--open');
          }
        });

        // Toggle current
        if (isOpen) {
          button.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
          answer.style.maxHeight = '0';
          answer.style.paddingTop = '0';
          answer.style.paddingBottom = '0';
          item.classList.remove('faq-item--open');
        } else {
          button.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
          answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
          answer.style.paddingTop = '16px';
          answer.style.paddingBottom = '24px';
          item.classList.add('faq-item--open');
        }
      });

      // Keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
  }

  // ─── 10. TESTIMONIAL RAIL DRAG SCROLL ───────────────────────
  function initTestimonialRail() {
    const rail = $('.testimonial-rail');
    if (!rail) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    rail.addEventListener('mousedown', (e) => {
      isDown = true;
      rail.classList.add('testimonial-rail--dragging');
      startX = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
    });

    rail.addEventListener('mouseleave', () => {
      isDown = false;
      rail.classList.remove('testimonial-rail--dragging');
    });

    rail.addEventListener('mouseup', () => {
      isDown = false;
      rail.classList.remove('testimonial-rail--dragging');
    });

    rail.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - startX) * 1.5;
      rail.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX;
    let touchScrollLeft;

    rail.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = rail.scrollLeft;
    }, { passive: true });

    rail.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      const walk = (touchStartX - x) * 1.2;
      rail.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });
  }

  // ─── 11. COUNTER ANIMATION ──────────────────────────────────
  function initCounterAnimation() {
    const impactItems = $$('.impact-grid > div');
    if (!impactItems.length) return;

    // Parse numbers from text content
    const counters = impactItems.map((el) => {
      const text = el.textContent.trim();
      const match = text.match(/(\d+)/);
      const suffix = text.replace(/\d+/, '').trim();
      return {
        el,
        target: match ? parseInt(match[1], 10) : 0,
        suffix,
        originalText: text,
      };
    });

    if (prefersReducedMotion) return; // Numbers already visible

    // Set to 0 initially
    counters.forEach((c) => {
      if (c.target > 0) {
        c.el.textContent = '0' + c.suffix;
      }
    });

    function animateCounter(counter) {
      const duration = CONFIG.counterDuration;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easedProgress * counter.target);

        counter.el.textContent = current + counter.suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.el.textContent = counter.originalText;
        }
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = counters.find((c) => c.el === entry.target);
            if (counter && counter.target > 0) {
              animateCounter(counter);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c.el));
  }

  // ─── 12. BRIDGE WORDS STAGGER ───────────────────────────────
  function initBridgeAnimation() {
    const bridgeWords = $$('.bridge-word');
    if (!bridgeWords.length || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bridgeWords.forEach((word, i) => {
              setTimeout(() => {
                word.classList.add('bridge-word--visible');
              }, i * 300);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe($('#bridge'));
  }

  // ─── 13. CLARITY TIMELINE PROGRESSIVE REVEAL ────────────────
  function initClarityTimeline() {
    const days = $$('.clarity-day');
    if (!days.length || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('clarity-day--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    days.forEach((day) => observer.observe(day));
  }

  // ─── 14. WHO CARDS HOVER EFFECT ──────────────────────────────
  function initWhoCards() {
    const cards = $$('.who-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('who-card--hovered');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('who-card--hovered');
      });
    });
  }

  // ─── 15. PHOTO GRID PARALLAX ────────────────────────────────
  function initPhotoGrid() {
    const photos = $$('.photo-grid img');
    if (!photos.length || prefersReducedMotion) return;

    photos.forEach((photo) => {
      photo.addEventListener('mouseenter', () => {
        photo.style.transform = 'scale(1.03)';
        photo.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      photo.addEventListener('mouseleave', () => {
        photo.style.transform = 'scale(1)';
      });
    });
  }

  // ─── 16. YEAR UPDATE ────────────────────────────────────────
  function updateYear() {
    const yearEl = $('.footer-bottom p');
    if (yearEl) {
      yearEl.innerHTML = yearEl.innerHTML.replace('2024', new Date().getFullYear());
    }
  }

  // ─── INITIALIZE ──────────────────────────────────────────────
  function init() {
    initHeroEntrance();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavTracking();
    initScrollReveal();
    initMissionTransform();
    initCommunityCarousel();
    initFAQAccordion();
    initTestimonialRail();
    initCounterAnimation();
    initBridgeAnimation();
    initClarityTimeline();
    initWhoCards();
    initPhotoGrid();
    updateYear();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
