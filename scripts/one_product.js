// Найдём элементы
const priceElement = document.querySelector(".foot-product-desc-price");
const option1 = document.querySelector(".option1");
const option2 = document.querySelector(".option2");
const article1 = document.querySelector(".article1");
const article2 = document.querySelector(".article2");

// Цены
const prices = {
  option1: "59,38€",   // 20 мл
  option2: "267,21€"   // 5 x 20 мл
};

function setPrice(option) {
  if (option === "option1") {
    priceElement.textContent = prices.option1;
    option1.classList.add("active");
    option2.classList.remove("active");

    article1.style.display = "block";
    article2.style.display = "none";
  } else {
    priceElement.textContent = "Цена: " + prices.option2;
    option2.classList.add("active");
    option1.classList.remove("active");

    article1.style.display = "none";
    article2.style.display = "block";
  }
}

// Клик по опциям
option1.addEventListener("click", () => setPrice("option1"));
option2.addEventListener("click", () => setPrice("option2"));

// По умолчанию сразу выбрано 20 мл
setPrice("option1");


