const grid = document.querySelector('.category-grid');
  grid.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      grid.scrollLeft += e.deltaY;
    }
  });