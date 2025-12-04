
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".category-grid");
  const divider = document.querySelector(".divider-categories");
  divider.style.width = grid.scrollWidth + "px";
});
