document.addEventListener("DOMContentLoaded", function () {
  const mainCartBlock = document.querySelector(".block-cart-main");
  const mainEmpty = mainCartBlock.querySelector(".main-empty");

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartItems.length === 0) {
    if (mainEmpty) mainEmpty.style.display = "flex";
    updateCheckoutBtn(); // блокируем кнопку сразу
    return;
  }

  if (mainEmpty) mainEmpty.style.display = "none";

  cartItems.forEach(item => {
    const priceNum = parseFloat(String(item.price).replace(",", ".")) * item.quantity;

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
            <div class="main-price">${formatPrice(priceNum)}</div>
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
  updateCheckoutBtn(); // проверяем кнопку после отрисовки
  attachMainCartHandlers();
  syncSingleItemHeight();
});


// ------ УТИЛИТЫ ------

function formatPrice(value) {
  if (!value) value = 0;
  return value.toFixed(2).replace(".", ",") + "€";
}


// ------ КНОПКА К ДОСТАВКЕ ------

function updateCheckoutBtn() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const btn = document.querySelector(".checkout-btn");
  if (!btn) return;

  if (cartItems.length === 0) {
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.4";
    btn.style.cursor = "not-allowed";
  } else {
    btn.style.pointerEvents = "";
    btn.style.opacity = "";
    btn.style.cursor = "";
  }
}


// ------ ОБНОВЛЕНИЕ ИТОГА ------

function updateMainCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cartItems.forEach(item => {
    let priceNumber = parseFloat(String(item.price).replace(",", "."));
    total += priceNumber * item.quantity;
  });

  const totalValue = document.querySelector(".block-summary .total-value");
  if (totalValue) {
    totalValue.textContent = formatPrice(total);
  }
}


// ------ ОБРАБОТЧИКИ ------

function attachMainCartHandlers() {
  document.querySelectorAll(".main-delete").forEach(btn => {
    btn.addEventListener("click", function () {
      const itemEl = this.closest(".main-cart-item");
      const title = itemEl.querySelector(".main-cart-title").innerText.trim();

      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems = cartItems.filter(i => i.title !== title);
      localStorage.setItem("cart", JSON.stringify(cartItems));

      itemEl.remove();
      updateMainCartSummary();
      updateCheckoutBtn(); // обновляем кнопку после удаления

      if (cartItems.length === 0) {
        document.querySelector(".main-empty").style.display = "flex";
      }
    });
  });

  document.querySelectorAll(".main-quantity button").forEach(btn => {
    btn.addEventListener("click", function () {
      const itemEl = this.closest(".main-cart-item");
      const title = itemEl.querySelector(".main-cart-title").innerText.trim();
      const numberEl = itemEl.querySelector(".main-count");
      const priceEl = itemEl.querySelector(".main-price");

      let qty = parseInt(numberEl.innerText);

      if (this.classList.contains("increase")) qty++;
      if (this.classList.contains("decrease") && qty > 1) qty--;

      numberEl.innerText = qty;

      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      cartItems = cartItems.map(i => {
        if (i.title === title) {
          i.quantity = qty;
          const priceNum = parseFloat(String(i.price).replace(",", "."));
          const newTotal = priceNum * qty;
          priceEl.innerText = formatPrice(newTotal);
        }
        return i;
      });

      localStorage.setItem("cart", JSON.stringify(cartItems));
      updateMainCartSummary();
      updateCheckoutBtn(); // на случай если каким-то образом стало 0
    });
  });
}


function syncSingleItemHeight() {
  const blockSummary = document.querySelector(".block-summary");
  const blockCartMain = document.querySelector(".block-cart-main");
  const cartItems = document.querySelectorAll(".main-cart-item");

  if (!blockSummary || !blockCartMain) return;

  if (cartItems.length === 1) {
    const summaryHeight = blockSummary.getBoundingClientRect().height;
    blockCartMain.style.height = summaryHeight + "px";
    cartItems[0].style.height = "100%";
  }
}