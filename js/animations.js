// Finom megjelenési animációk – nem módosítja a meglévő működést.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 0) Lapok közötti átmenet: kifelé halványulás belső linkeknél
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(h) ||
        a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.protocol !== 'file:' && a.origin !== location.origin) return;
    e.preventDefault();
    document.body.classList.add('cp-leave');
    setTimeout(function () { location.href = a.href; }, 220);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) document.body.classList.remove('cp-leave');
  });

  // 1) Nyitó szekció: elemek egymás utáni belépése betöltéskor
  var introSelectors = [
    '.hero-content > *', '.about-hero > div:first-child > *',
    '.process-header > div:first-child > *', '.catalog-intro > *', '.quote-intro > *'
  ];
  document.querySelectorAll(introSelectors.join(',')).forEach(function (el) {
    el.style.setProperty('--cp-i', Array.prototype.indexOf.call(el.parentNode.children, el));
    el.classList.add('cp-intro');
  });
  document.querySelectorAll('.hero-image-container, .about-hero-image').forEach(function (el) {
    el.classList.add('cp-intro-img');
  });

  // 2) Görgetéskor megjelenő elemek
  if (!('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll([
    '.portfolio-heading', '.product-card', '.stats-footer .stat-item',
    '.about-two-col', '.about-section .section-kicker', '.about-section .section-heading',
    '.value-card', '.timeline-item', '.team-card', '.about-cta > *',
    '.steps .step', '.quality-copy', '.quality-visual',
    '.catalog-card', '.catalog-help', '.quote-form'
  ].join(','));

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (n) {
        return n.classList.contains('cp-pending') || n === el;
      });
      el.style.setProperty('--cp-delay', Math.min(sibs.indexOf(el), 4) * 80 + 'ms');
      el.classList.remove('cp-pending');
      el.classList.add('cp-in');
      el.addEventListener('animationend', function () {
        el.classList.remove('cp-in');
        el.style.removeProperty('--cp-delay');
      }, { once: true });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    el.classList.add('cp-pending');
    io.observe(el);
  });
})();
