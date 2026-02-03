document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider'); // контейнер слайдов
  if (!slider) return; // на всякий случай проверка

  const slides = slider.children;
  let index = 0;
  let autoScroll = null;
  const INTERVAL = 3000; // 3 секунды

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

  slider.addEventListener('pointerdown', stopAuto);
  slider.addEventListener('touchstart', stopAuto);
  slider.addEventListener('wheel', stopAuto);

  slider.addEventListener('pointerup', startAuto);
  slider.addEventListener('mouseleave', startAuto);

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

  startAuto();
});