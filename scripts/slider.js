document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  if (!slider) return;

  const slides = slider.children;
  let index = 0;
  let autoScroll = null;
  const INTERVAL = 3000;

  // ─── Авто-прокрутка ───────────────────────────────

  function scrollToSlide(i) {
    slider.scrollTo({
      left: slides[i].offsetLeft,
      behavior: 'smooth'
    });
    index = i;
  }

  function startAuto() {
    stopAuto();
    autoScroll = setInterval(() => {
      index = (index + 1) % slides.length;
      scrollToSlide(index);
    }, INTERVAL);
  }

  function stopAuto() {
    if (autoScroll) {
      clearInterval(autoScroll);
      autoScroll = null;
    }
  }

  // ─── Отслеживание текущего слайда при скролле ─────

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
  });

  // ─── Тач / тачпад ─────────────────────────────────

  slider.addEventListener('pointerdown', stopAuto);
  slider.addEventListener('touchstart', stopAuto);
  slider.addEventListener('pointerup', startAuto);

  // ─── Колесо мыши → листает по одному слайду ───────

  slider.addEventListener('wheel', (e) => {
    e.preventDefault();
    stopAuto();

    if (e.deltaY > 0 || e.deltaX > 0) {
      // вниз / вправо → следующий
      index = Math.min(index + 1, slides.length - 1);
    } else {
      // вверх / влево → предыдущий
      index = Math.max(index - 1, 0);
    }

    scrollToSlide(index);

    // возобновляем авто-прокрутку через 2 сек после остановки колеса
    clearTimeout(slider._wheelTimer);
    slider._wheelTimer = setTimeout(startAuto, 2000);
  }, { passive: false });

  // ─── Перетаскивание мышью ─────────────────────────

  let isDown = false;
  let startX;
  let scrollLeftStart;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeftStart = slider.scrollLeft;
    slider.style.cursor = 'grabbing';
    stopAuto();
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
    startAuto();
  });

  slider.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      slider.style.cursor = 'grab';
      startAuto();
    }
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // скорость перетаскивания
    slider.scrollLeft = scrollLeftStart - walk;
  });

  // ─── Старт ────────────────────────────────────────

  startAuto();
});