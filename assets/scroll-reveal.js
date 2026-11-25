/* One-time entrances, preserving the approved layout and tag rotations. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const selectors = [
    '.goals-top .statement > *', '.goals-aside', '.pill-pile .topic',
    '.section-heading h2 > *', '.section-intro', '.audience-duration',
    '.audience-group', '.experience-heading h2 > *', '.experience-stat',
    '.education-entry', '.training-entry', '.practice-item',
    '.lesson-tools', '.format-title-block > *', '.format-entry',
    '.contact-layout h2 > *', '.contact-details'
  ];
  const elements = [...document.querySelectorAll(selectors.join(','))];
  const marker = document.querySelector('.name-line');
  const corrections = [...document.querySelectorAll('.grammar-correction')];
  let observer;
  const startCorrection = element => {
    element.querySelectorAll('.grammar-correction').forEach(word => word.classList.add('is-correcting'));
  };
  const reveal = element => {
    element.classList.remove('is-reveal-pending');
    startCorrection(element);
    if (observer) observer.unobserve(element);
  };
  const showAll = () => {
    elements.forEach(reveal);
    corrections.forEach(word => word.classList.remove('is-correction-ready', 'is-correcting'));
    if (marker) marker.classList.remove('marker-reveal');
    if (observer) observer.disconnect();
  };
  try {
    if (marker) marker.classList.add('marker-reveal');
    corrections.forEach(word => word.classList.add('is-correction-ready'));
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    elements.forEach(element => {
      if (element.matches('.audience-group,.practice-item,.training-entry,.format-entry + .format-entry')) {
        element.classList.add('line-reveal');
      }
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startCorrection(element);
        return;
      }
      const index = Math.max([...element.parentElement.children].indexOf(element), 0);
      const delay = element.matches('.topic') ? index * 40 : Math.min(index, 3) * 60;
      element.style.setProperty('--reveal-delay', delay + 'ms');
      element.classList.add('scroll-reveal', 'is-reveal-pending');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', event => { if (event.matches) showAll(); });
    window.addEventListener('beforeprint', showAll);
    window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
  } catch { showAll(); }
})();
