document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  if (!slider) return;

  const slides = slider.children;
  let index = 0;
  let autoScroll = null;
  const INTERVAL = 3000;

  // ─── Прокрутка к конкретному слайду ───────────────

  function scrollToSlide(i) {
    slider.scrollTo({
      left: slides[i].offsetLeft,
      behavior: 'smooth'
    });
    index = i;
  }

  // ─── Авто-прокрутка ───────────────────────────────

  function startAuto() {
    stopAuto();
    autoScroll = setInterval(() => {
      index = (index + 1) % slides.length;
      scrollToSlide(index);
    }, INTERVAL);
  }

  function stopAuto() {
    clearInterval(autoScroll);
    autoScroll = null;
  }

  // ─── Обновление индекса при нативном скролле ──────

  slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const dist = Math.abs(slides[i].offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    index = closest;
  }, { passive: true });

  // ─── Колесо мыши → листает по одному слайду ───────

  let wheelTimer = null;

  slider.addEventListener('wheel', (e) => {
    e.preventDefault();
    stopAuto();

    if (e.deltaY > 0 || e.deltaX > 0) {
      index = Math.min(index + 1, slides.length - 1);
    } else {
      index = Math.max(index - 1, 0);
    }

    scrollToSlide(index);

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(startAuto, 2000);
  }, { passive: false });

  // ─── Мобильный свайп пальцем ──────────────────────

  let scrollEndTimer = null;

  slider.addEventListener('touchstart', () => {
    stopAuto();
    clearTimeout(scrollEndTimer);
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      scrollToSlide(index);
      setTimeout(startAuto, 600);
    }, 100);
  }, { passive: true });

  // ─── Старт ────────────────────────────────────────

  startAuto();
});