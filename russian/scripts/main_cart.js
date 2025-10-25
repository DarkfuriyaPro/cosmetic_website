document.addEventListener("DOMContentLoaded", function () {
  const mainCartBlock = document.querySelector(".block-cart-main");
  const mainEmpty = mainCartBlock.querySelector(".main-empty");

  // Загружаем товары из localStorage
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartItems.length === 0) {
    if (mainEmpty) mainEmpty.style.display = "flex"; // показать "корзина пустая"
    return;
  }

  if (mainEmpty) mainEmpty.style.display = "none"; // скрыть пустую корзину

  cartItems.forEach(item => {
    const productEl = document.createElement("div");
    productEl.classList.add("main-cart-item");
    productEl.innerHTML = `
      <div class="main-content-row">
        <div class="main-cart-img">
          <img src="${item.img}" alt="${item.title}">
        </div>
        <div class="main-cart-info">
          <div class="main-cart-title">${item.title}</div>
          <div class="main-price-quantity">
            <div class="main-price">${item.price}</div>
            <div class="main-quantity">
              <button class="decrease">−</button>
              <span class="main-count">${item.quantity}</span>
              <button class="increase">+</button>
            </div>
          </div>
        </div>
      </div>
      <button class="main-delete">
        <img src="/images/trash.png" alt="Удалить">
      </button>
    `;
    mainCartBlock.appendChild(productEl);
  });

  updateMainCartSummary();
  attachMainCartHandlers();
});


// Обновление итоговой суммы
function updateMainCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cartItems.forEach(item => {
    let price = parseFloat(item.price.replace(/[^\d.,]/g, "").replace(",", "."));
    let qty = parseInt(item.quantity);
    total += price * qty;
  });

  const totalBox = document.querySelector(".block-summary .total-box");
  if (totalBox) {
    totalBox.innerHTML = `Итого: <span>${total.toFixed(2)} €</span>`;
  }
}


// Обработчики для удаления и изменения количества
function attachMainCartHandlers() {
  // Удаление товара
  document.querySelectorAll(".main-delete").forEach(btn => {
    btn.addEventListener("click", function () {
      const itemEl = this.closest(".main-cart-item");
      const title = itemEl.querySelector(".main-cart-title").innerText.trim();

      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems = cartItems.filter(i => i.title !== title);
      localStorage.setItem("cart", JSON.stringify(cartItems));

      itemEl.remove();
      updateMainCartSummary();

      if (cartItems.length === 0) {
        document.querySelector(".main-empty").style.display = "flex";
      }
    });
  });

  // Изменение количества
  document.querySelectorAll(".main-quantity button").forEach(btn => {
    btn.addEventListener("click", function () {
      const itemEl = this.closest(".main-cart-item");
      const title = itemEl.querySelector(".main-cart-title").innerText.trim();
      const numberEl = itemEl.querySelector(".main-count");
      let qty = parseInt(numberEl.innerText);

      if (this.classList.contains("increase")) qty++;
      if (this.classList.contains("decrease") && qty > 1) qty--;

      numberEl.innerText = qty;

      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems = cartItems.map(i => {
        if (i.title === title) i.quantity = qty;
        return i;
      });
      localStorage.setItem("cart", JSON.stringify(cartItems));

      updateMainCartSummary();
    });
  });
}
