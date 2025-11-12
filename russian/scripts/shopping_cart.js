// shopping_cart.js (полностью замените им ваш файл)

// ======= УТИЛИТЫ =======
function qs(selector, ctx = document) { return ctx.querySelector(selector); }
function qsa(selector, ctx = document) { return Array.from((ctx || document).querySelectorAll(selector)); }

// ======= ГЛОБАЛЬНОЕ СОСТОЯНИЕ =======
let cartItems = []; // { id, title, price, img, quantity }

// ======= ЗАГРУЗКА И СОХРАНЕНИЕ =======
function loadCartFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(saved)) {
      cartItems = [];
    } else {
      cartItems = saved;
    }
    console.log('loadCartFromStorage ->', cartItems);
  } catch (e) {
    console.error('Ошибка при парсинге cart из localStorage', e);
    cartItems = [];
  }
  renderCart();
}

function saveCartToStorage() {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('saveCartToStorage ->', cartItems);
  } catch (e) {
    console.error('Ошибка при сохранении cart в localStorage', e);
  }
}

// ======= РЕНДЕР КОРЗИНЫ (по cartItems) =======
function renderCart() {
  const shoppingCart = document.getElementById('shoppingCart');
  const cartContainer = shoppingCart.querySelector('.cart-container');
  const emptyState = cartContainer.querySelector('.empty');
  const footer = cartContainer.querySelector('.cart-footer');

  // Удаляем старые .cart-item (не трогаем .empty и .cart-footer)
  qsa('.cart-item', cartContainer).forEach(el => el.remove());

  if (cartItems.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    cartItems.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      if (item.id) cartItem.dataset.productId = String(item.id);

      cartItem.innerHTML = `
      <div class="cart-item-left">
        <div class="cart-item-img">
          <img src="${item.img || ''}" alt="Товар">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title || 'Без названия'}</div>
          <div class="price_quantity">
            <div class="cart-item-price">
              <span class="price-value">${item.price}</span><span>€</span>
            </div>
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease">−</button>
              <span class="quantity-number">${item.quantity}</span>
              <button class="quantity-btn increase">+</button>
            </div>
          </div>
        </div>
      </div>
      <button class="cart-item-remove">
        <img src="/images/trash.png" alt="Удалить">
      </button>
      `;

      cartContainer.insertBefore(cartItem, footer);
    });
  }

  updateCartCount();
  updateTotalPrice();
}

// ======= ПОМОЩНИКИ ДЛЯ ПОИСКА ТОВАРА =======
function findCartItemIndexByIdOrTitle(id, title) {
  if (id) {
    const idx = cartItems.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) return idx;
  }
  // fallback to title match (если id не задан)
  return cartItems.findIndex(i => i.title && i.title.trim() === title.trim());
}

// ======= ДОБАВИТЬ ТОВАР =======
function addProductToCart({ id, title, price, img, quantity = 1 }) {
  // Нормализация данных
  price = (price || '0').toString().replace(/[^\d.,]/g, '').replace(',', '.');
  const priceNum = parseFloat(price) || 0;

  // Проверяем — есть ли уже такой товар в корзине
  const idx = findCartItemIndexByIdOrTitle(id, title);

  if (idx !== -1) {
    // 🔹 Товар уже есть в корзине — просто показываем popup
    console.log('Товар уже в корзине:', cartItems[idx]);
    showAlreadyInCartPopup();
    return;
  }

  // 🔹 Если товара нет — добавляем новый с выбранным количеством
  const newItem = {
    id: id || null,
    title: title || 'Без названия',
    price: priceNum,
    img: img || '',
    quantity: quantity || 1, // ✅ вот здесь количество с кнопок +/−
  };

  cartItems.push(newItem);
  console.log('Добавлен новый товар:', newItem);

  saveCartToStorage();
  renderCart();
  showSnackbar('Товар добавлен в корзину');
}



// ======= УДАЛИТЬ ТОВАР =======
function removeCartItemByElement(el) {
  const cartItem = el.closest('.cart-item');
  if (!cartItem) return;
  const productId = cartItem.dataset.productId;
  if (productId) {
    cartItems = cartItems.filter(i => String(i.id) !== String(productId));
  } else {
    const title = cartItem.querySelector('.cart-item-title')?.innerText?.trim();
    cartItems = cartItems.filter(i => i.title?.trim() !== title);
  }
  saveCartToStorage();
  renderCart();
}

// ======= ПОЛОЖИТЬ/УБАВИТЬ КОЛИЧЕСТВО =======
function changeQuantityByElement(el, delta) {
  const cartItem = el.closest('.cart-item');
  if (!cartItem) return;
  const productId = cartItem.dataset.productId;
  let idx = -1;
  if (productId) idx = cartItems.findIndex(i => String(i.id) === String(productId));
  else {
    const title = cartItem.querySelector('.cart-item-title')?.innerText?.trim();
    idx = cartItems.findIndex(i => i.title?.trim() === title);
  }
  if (idx === -1) return;
  cartItems[idx].quantity = Math.max(1, (cartItems[idx].quantity || 1) + delta);
  saveCartToStorage();
  renderCart();
}

// ======= СЧЕТЧИКИ И СУММА =======
function updateCartCount() {
  const uniqueCount = cartItems.length;
  const totalQty = cartItems.reduce((s, it) => s + (parseInt(it.quantity) || 0), 0);

  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) cartCountEl.innerText = uniqueCount;

  const itemsCounter = document.querySelector('.items-counter span');
  if (itemsCounter) itemsCounter.innerText = totalQty;
}

function updateTotalPrice() {
  const total = cartItems.reduce((sum, it) => {
    const price = parseFloat(String(it.price).replace(',', '.')) || 0;
    const qty = parseInt(it.quantity) || 0;
    return sum + price * qty;
  }, 0);
  const amountEl = document.querySelector('.amount-count');
  if (amountEl) {
    amountEl.innerText = (total % 1 === 0 ? Math.round(total) : total.toFixed(2)) + '€';
  }
}

// ======= SNACKBAR (простая подсказка) =======
function showSnackbar(text) {
  const sn = document.getElementById('snackbar');
  if (!sn) return;
  sn.innerText = text;
  sn.classList.add('show');
  setTimeout(() => sn.classList.remove('show'), 1800);
}

function showAlreadyInCartPopup() {
  const popup = document.getElementById('prove_product');
  if (!popup) return;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 1800);
}


// ======= ОБЩИЕ ОБРАБОТЧИКИ (ДЕЛЕГИРОВАНИЕ) =======

document.addEventListener('click', function (e) {
  const target = e.target;

  // Нажатие на кнопку "В корзину"
  const addBtn = target.closest('.add-to-cart, .add-product');
  if (addBtn) {
    const card = addBtn.closest('.card, .foot-product');
    if (!card) return;

    const productId = card.dataset.productId || card.getAttribute('data-product-id') || null;
    const titleEl = card.querySelector('.product-title, .foot-product-desc-title');
    const priceEl = card.querySelector('.product-price .price-value, .foot-product-desc-price .price-value');
    const imgEl = card.querySelector('.product-img img, .product-slides img.active');

    const title = titleEl ? titleEl.innerText.trim() : 'Без названия';
    const price = priceEl ? priceEl.innerText.trim().replace(/[^\d.,]/g, '') : '0';
    const img = imgEl ? imgEl.src : '';

    addProductToCart({ id: productId, title, price, img });
    return;
  }

  // Нажатие на кнопку удаления в корзине
  if (target.closest('.cart-item-remove')) {
    removeCartItemByElement(target);
    return;
  }

  // Нажатие плюс/минус
  if (target.closest('.quantity-btn')) {
    if (target.classList.contains('increase')) {
      changeQuantityByElement(target, 1);
    } else if (target.classList.contains('decrease')) {
      changeQuantityByElement(target, -1);
    }
    return;
  }

  // Клик по иконке корзины (открыть/закрыть)
  const cartIcon = target.closest('.openbtn.cart-icon, .cart-icon');
  if (cartIcon) {
    toggleCart();
    return;
  }
});

// ======= TOGGLE КОРЗИНЫ =======
function toggleCart() {
  const cart = document.getElementById("shoppingCart");
  const main = document.getElementById("main");
  const overlay = document.getElementById("cartOverlay");
  const isOpening = !cart.classList.contains("open");

  cart.classList.toggle("open");
  if (overlay) overlay.classList.toggle("active", isOpening);

  if (isOpening) {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      main.style.marginRight = "0";
    } else {
      main.style.marginRight = "350px";
    }
    renderCart();
  } else {
    main.style.marginRight = "0";
  }
}




// ======= ИНИЦИАЛИЗАЦИЯ =======
document.addEventListener('DOMContentLoaded', function () {
  loadCartFromStorage();

  // если у тебя есть отдельная кнопка "Перейти в корзину", перехватим её, чтобы сохранить перед переходом
  qsa('.go-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      saveCartToStorage();
      // переход с небольшим таймаутом (как у тебя было)
      const href = this.getAttribute('href') || '/russian/consumer_ru/main_cart.html';
      setTimeout(() => window.location.href = href, 100);
    });
  });
});



window.addProductToCart = addProductToCart;
window.findCartItemIndexByIdOrTitle = findCartItemIndexByIdOrTitle;
window.showAlreadyInCartPopup = showAlreadyInCartPopup;