/* Slider */

  (function () {
    const slider = document.getElementById('mySlider');
    const slidesEl = document.getElementById('slides');
    const slides = Array.from(slidesEl.children);
    const num = slides.length;
    const dotsEl = document.getElementById('dots');
    let index = 0;
    let interval = null;
    const INTERVAL_MS = 2000;

    // build indicators
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', 'slide-' + i);
      btn.dataset.index = i;
      btn.addEventListener('click', () => goTo(i, true));
      dotsEl.appendChild(btn);
    });

    const dots = Array.from(dotsEl.children);

    function update() {
      slidesEl.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.setAttribute('aria-pressed', i === index ? 'true' : 'false'));
      slider.setAttribute(
        'aria-label',
        `Слайд ${index + 1} из ${num}: ${slides[index].querySelector('.caption').textContent}`
      );
    }

    function next() {
      index = (index + 1) % num;
      update();
    }
    function prev() {
      index = (index - 1 + num) % num;
      update();
    }
    function goTo(i, byUser = false) {
      index = i % num;
      update();
      if (byUser) stopAuto();
    }

    // pause-on-hover and focus
    let isPaused = false;
    slider.addEventListener('pointerenter', () => pauseAuto());
    slider.addEventListener('pointerleave', () => resumeAuto());
    slider.addEventListener('focusin', () => pauseAuto());
    slider.addEventListener('focusout', () => resumeAuto());

    // buttons
    document.getElementById('next').addEventListener('click', () => { next(); stopAuto(); });
    document.getElementById('prev').addEventListener('click', () => { prev(); stopAuto(); });

    // keyboard support
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); stopAuto(); }
      if (e.key === 'ArrowLeft') { prev(); stopAuto(); }
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (isPaused) resumeAuto(); else pauseAuto();
        e.preventDefault();
      }
    });
    slider.tabIndex = 0;

    // autoplay with reduced motion respect
    const reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function startAuto() {
      if (reduced) return;
      stopAuto();
      interval = setInterval(next, INTERVAL_MS);
      isPaused = false;
    }
    function stopAuto() { if (interval) { clearInterval(interval); interval = null; isPaused = true; } }
    function pauseAuto() { if (interval) { clearInterval(interval); interval = null; isPaused = true; } }
    function resumeAuto() { if (!reduced && !interval) { interval = setInterval(next, INTERVAL_MS); isPaused = false; } }

    // start
    update();
    startAuto();

    // Expose for debugging
    window.__mySlider = { next, prev, goTo, startAuto, stopAuto };

  })();