document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".product-slider");
  if (!slider) return; // если блока нет на странице, ничего не делаем

  const slides = slider.querySelectorAll(".product-slides img");
  const prevBtn = slider.querySelector(".product-prev");
  const nextBtn = slider.querySelector(".product-next");
  const dotsContainer = slider.querySelector(".product-indicators");

  let index = 0;

  // создаём индикаторы
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("button");

  function showSlide(i) {
    slides[index].classList.remove("active");
    dots[index].classList.remove("active");

    index = (i + slides.length) % slides.length;

    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  prevBtn.addEventListener("click", () => showSlide(index - 1));
  nextBtn.addEventListener("click", () => showSlide(index + 1));

  // старт
  showSlide(0);
});
