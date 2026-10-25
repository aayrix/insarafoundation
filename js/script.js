/* ==========================================================================
   INSARA FOUNDATION — SITE SCRIPT
   Shared across every page: mobile menu, dark mode, sticky header,
   scroll reveal, back-to-top, and contact form handling.
   ========================================================================== */

/* ---------------- welcome intro (shared across all pages) ---------------- */
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('ins-on')) return;
  const intro = document.createElement('div');
  intro.className = 'ins-intro';
  intro.id = 'ins-intro';
  intro.setAttribute('role', 'dialog');
  intro.setAttribute('aria-label', 'INSARA Foundation');
  intro.innerHTML = `<div class="ins-door ins-door--left" aria-hidden="true"></div>
    <div class="ins-door ins-door--right" aria-hidden="true"></div>
    <div class="ins-stage" aria-hidden="true">
      <img class="ins-mark" src="images/logo-sm.png" alt="">
      <div class="ins-word">INSARA</div><div class="ins-sub">Foundation</div>
      <p class="ins-tagline">Inspired by Humanity.<br>Driven by Compassion.</p>
      <div class="ins-meta">Mianwali, Punjab · Est. 2026</div>
    </div><div class="ins-progress" aria-hidden="true"></div>
    <button class="ins-skip" type="button">Skip intro</button>`;
  document.body.prepend(intro);
  const blocked = [...document.body.children].filter(el => el !== intro && !el.inert);
  blocked.forEach(el => { el.inert = true; });
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    intro.remove();
    root.classList.remove('ins-on', 'ins-reveal');
    blocked.forEach(el => { el.inert = false; });
    try { sessionStorage.setItem('insara-intro', '1'); } catch (_) {}
  };
  const leave = () => {
    if (intro.classList.contains('leave')) return;
    root.classList.add('ins-reveal');
    intro.classList.add('leave');
    intro.querySelector('.ins-door--right').addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 1300);
  };
  const timer = setTimeout(leave, 2900);
  intro.addEventListener('click', leave);
  intro.querySelector('.ins-skip').addEventListener('click', e => { e.stopPropagation(); clearTimeout(timer); leave(); });
  window.addEventListener('keydown', e => {
    if (['Escape', 'Enter', ' '].includes(e.key)) { e.preventDefault(); clearTimeout(timer); leave(); }
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- mobile menu ---------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    const closeMenu = () => {
      mobileNav.classList.remove('open');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      document.body.classList.toggle('menu-open', isOpen);
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------------- dark mode (session only, no storage) ---------------- */
  const darkToggle = document.getElementById('dark-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      darkToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    });
  }

  /* ---------------- sticky header + back to top ---------------- */
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    if (window.scrollY > 30) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
    if (backToTop) {
      backToTop.classList.toggle('show', window.scrollY > 500);
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- scroll reveal ---------------- */
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }
/* ---------------- EmailJS forms ---------------- */

const cfg = window.EMAILJS_CONFIG;

if (
  typeof emailjs !== 'undefined' &&
  cfg?.publicKey &&
  cfg?.serviceId
) {
  emailjs.init({
    publicKey: cfg.publicKey
  });

  const forms = document.querySelectorAll('#contact-form');

  forms.forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn =
        form.querySelector('button[type="submit"]');

      const originalText = btn?.innerHTML;

      if (btn) {
        btn.disabled = true;
        btn.innerHTML =
          'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      try {
        // Email to INSARA Foundation
        await emailjs.sendForm(
          cfg.serviceId,
          cfg.adminTemplateId,
          this
        );

        // Auto reply to visitor
        await emailjs.sendForm(
          cfg.serviceId,
          cfg.replyTemplateId,
          this
        );

        const status =
          document.getElementById('form-status');

        if (status) {
          status.classList.add('show');
        }

        this.reset();

      } catch (error) {
        console.error(error);

        alert(
          'Something went wrong. Please try again.'
        );
      }

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  });
}

  /* ---------------- highlight current page in nav ---------------- */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
