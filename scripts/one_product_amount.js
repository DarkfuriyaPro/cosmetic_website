document.addEventListener("DOMContentLoaded", () => {
  const minusBtn = document.querySelector(".down");
  const plusBtn = document.querySelector(".up");
  const numberEl = document.querySelector(".number");
  const priceEl = document.querySelector(".foot-product-desc-price");

  // 💰 Берём базовую цену из HTML (чтобы не писать вручную)
  const basePriceText = priceEl.textContent.trim().replace(/[^\d.,]/g, "");
  const basePrice = parseFloat(basePriceText.replace(",", ".")) || 0;

  let count = 1;

  function updateUI() {
    numberEl.textContent = count;
    priceEl.textContent = (basePrice * count).toFixed(2) + "€";
    minusBtn.disabled = count === 1;
  }

  plusBtn.addEventListener("click", () => {
    count++;
    updateUI();
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      updateUI();
    }
  });

  updateUI();

  // 💡 Добавляем логику "В корзину"
  const addBtn = document.querySelector('.add-product');
  if (!addBtn) return;

  addBtn.addEventListener('click', () => {
    const productCard = document.querySelector('.foot-product');
    if (!productCard) return;

    const productId = productCard.dataset.productId || null;
    const titleEl = productCard.querySelector('.foot-product-desc-title');
    const imgEl = productCard.querySelector('.product-slides img.active');

    const title = titleEl ? titleEl.textContent.trim() : 'Без названия';
    const price = parseFloat(priceEl.textContent.trim().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    const img = imgEl ? imgEl.src : '';
    const quantity = parseInt(numberEl.textContent) || 1;

    // Проверяем, доступны ли функции из shopping_cart.js
    if (typeof window.addProductToCart === 'function' && typeof window.findCartItemIndexByIdOrTitle === 'function') {
      const existingIndex = window.findCartItemIndexByIdOrTitle(productId, title);

      if (existingIndex !== -1) {
        // Товар уже в корзине
        window.showAlreadyInCartPopup && window.showAlreadyInCartPopup();
      } else {
        // Добавляем товар с правильным количеством
        window.addProductToCart({ id: productId, title, price, img, quantity });
      }

      // 🔹 Сразу показываем боковую корзину
      const cart = document.getElementById("shoppingCart");
      if (cart && !cart.classList.contains("open")) {
        toggleCart();
      }

    } else {
      console.error("⚠️ Функции из shopping_cart.js недоступны. Проверь подключение.");
    }
  });
}); // ← ЭТО ЗАКРЫВАЕТ ПЕРВЫЙ addEventListener
