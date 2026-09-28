/* ==========================================================================
   La humanización también se aisla
   Clínica Meta · Universidad de los Llanos
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Menú móvil ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-principal');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- Huecos de logos ----------
     Si no hay imagen, se muestra el texto de reserva. Al cargar la imagen,
     el marco punteado desaparece automáticamente.                            */
  Array.prototype.forEach.call(document.querySelectorAll('.logo-slot'), function (slot) {
    var img = slot.querySelector('img');
    if (!img) return;

    function loaded() { slot.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth > 0) {
      loaded();
    } else {
      img.addEventListener('load', loaded);
      img.addEventListener('error', function () { slot.classList.remove('is-loaded'); });
    }
  });

  /* ---------- Selector de aviso frontal / reverso (fichas) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-switch]'), function (box) {
    var buttons = box.querySelectorAll('button[data-view]');
    var targets = document.querySelectorAll('[data-panel]');

    function activate(view) {
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-selected', b.getAttribute('data-view') === view ? 'true' : 'false');
      });
      Array.prototype.forEach.call(targets, function (p) {
        var isFor = p.getAttribute('data-panel') === view;
        p.hidden = !isFor;
        Array.prototype.forEach.call(p.querySelectorAll('img'), function (img) {
          if (isFor) img.loading = 'eager';
        });
      });
    }

    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener('click', function () { activate(b.getAttribute('data-view')); });
    });

    var initial = buttons[0] && buttons[0].getAttribute('data-view');
    if (initial) activate(initial);
  });

  /* ---------- Botón de imprimir ficha ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-print]'), function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });

  /* ---------- Año en el pie de página ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Resaltado de la sección visible en el menú ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          a.style.background = (a.getAttribute('href') === id) ? 'var(--brand-050)' : '';
          a.style.color = (a.getAttribute('href') === id) ? 'var(--brand-900)' : '';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }
})();
