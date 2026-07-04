/* ==========================================================================
   INSARA FOUNDATION — SITE SCRIPT
   Shared across every page: mobile menu, dark mode, sticky header,
   scroll reveal, back-to-top, and contact form handling.
   ========================================================================== */

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

  /* ---------------- contact forms (delivers to insarafoundation@gmail.com) ---------------- */
  const AUTO_REPLY_MESSAGES = {
    contact: 'Thank you for contacting INSARA Foundation! We have received your message and will connect with you soon.',
    volunteer: 'Thank you for volunteering with INSARA Foundation! We have received your application and will connect with you soon.',
  };

  const forms = document.querySelectorAll('form[data-formsubmit]');
  forms.forEach(form => {
    if (!form.querySelector('input[name="_autoresponse"]')) {
      const subject = form.querySelector('input[name="_subject"]')?.value || '';
      const type = subject.includes('Volunteer') ? 'volunteer' : 'contact';
      const autoresponse = document.createElement('input');
      autoresponse.type = 'hidden';
      autoresponse.name = '_autoresponse';
      autoresponse.value = AUTO_REPLY_MESSAGES[type];
      form.appendChild(autoresponse);
    }

    const nextField = form.querySelector('input[name="_next"]');
    if (nextField) {
      const page = (location.pathname.split('/').pop() || 'index.html');
      nextField.value = `${location.origin}${location.pathname.replace(/[^/]+$/, page)}?sent=true`;
    }

    if (new URLSearchParams(location.search).get('sent') === 'true') {
      const status = form.querySelector('.form-status');
      if (status) status.classList.add('show');
      history.replaceState(null, '', location.pathname);
    }

    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn && !btn.disabled) {
        btn.disabled = true;
        const label = btn.dataset.label || btn.innerHTML;
        btn.dataset.label = label;
        btn.innerHTML = 'Sending&hellip; <i class="fa-solid fa-spinner fa-spin"></i>';
      }
    });
  });

  /* ---------------- highlight current page in nav ---------------- */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
