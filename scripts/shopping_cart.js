// ======= УТИЛИТЫ =======
function qs(selector, ctx = document) { return ctx.querySelector(selector); }
function qsa(selector, ctx = document) { return Array.from((ctx || document).querySelectorAll(selector)); }

// ======= ГЛОБАЛЬНОЕ СОСТОЯНИЕ =======
let cartItems = []; // { id, title, price, img, quantity }

// ======= ЗАГРУЗКА И СОХРАНЕНИЕ =======
function loadCartFromStorage() {
  try {
    const savedRaw = localStorage.getItem('cart');
    const saved = savedRaw ? JSON.parse(savedRaw) : [];
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

  // FIX: если боковой корзины нет на странице — просто обновляем счётчик в header
  if (!shoppingCart) {
    updateCartCount();
    return;
  }

  const cartContainer = shoppingCart.querySelector('.cart-container');
  const emptyState = cartContainer.querySelector('.empty');
  const footer = cartContainer.querySelector('.cart-footer');

  // Удаляем старые .cart-item (не трогаем .empty и .cart-footer)
  qsa('.cart-item', cartContainer).forEach(el => el.remove());

  if (cartItems.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    if (footer) footer.style.display = 'none';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    if (footer) footer.style.display = 'flex';
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
          <span class="price-value">${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span><span>€</span>
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
    const idxById = cartItems.findIndex(i => String(i.id) === String(id));
    if (idxById !== -1) return idxById;
  }
  if (title) {
    return cartItems.findIndex(i => i.title?.trim() === title?.trim());
  }
  return -1;
}

// ======= ДОБАВИТЬ ТОВАР =======
function addProductToCart({ id, title, price, img, quantity = 1 }) {
  loadCartFromStorage();

  price = (price || '0').toString().replace(/[^\d.,]/g, '').replace(',', '.');
  const priceNum = parseFloat(price) || 0;

  const idx = findCartItemIndexByIdOrTitle(id, title);

  if (idx !== -1) {
    showAlreadyInCartPopup();
    return;
  }

  const newItem = {
    id: id || null,
    title: title || 'Без названия',
    price: priceNum,
    img: img || '',
    quantity: quantity || 1,
  };

  cartItems.push(newItem);
  saveCartToStorage();
  renderCart();
  showSnackbar();
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

  // Обновляем все элементы .cart-count на странице
  qsa('.cart-count').forEach(el => {
    el.innerText = uniqueCount;
    // Анимация при изменении
    el.classList.remove('animate');
    void el.offsetWidth; // reflow для перезапуска анимации
    el.classList.add('animate');
  });

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
    if (total === 0) {
      amountEl.innerText = '0€';
      return;
    }
    let formatted;
    if (Number.isInteger(total)) {
      formatted = total.toString();
    } else {
      formatted = total.toFixed(2).replace('.', ',');
    }
    amountEl.innerText = formatted + '€';
  }
}

// ======= SNACKBAR =======
function showSnackbar() {
  const sn = document.getElementById('snackbar');
  if (!sn) return;

  const lang = document.documentElement.lang || 'en';
  const messages = { de: 'Hinzugefügt', ru: 'Добавлено', en: 'Added' };
  sn.innerText = messages[lang] || messages['en'];
  sn.classList.add('show');
  setTimeout(() => sn.classList.remove('show'), 1800);
}

function showAlreadyInCartPopup() {
  const popup = document.getElementById('prove_product');
  if (!popup) return;

  const lang = document.documentElement.lang || 'en';
  const messages = {
    de: 'Das Produkt ist bereits im Warenkorb',
    ru: 'Товар уже в корзине',
    en: 'Product is already in the cart'
  };
  popup.innerText = messages[lang] || messages['en'];
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 1800);
}

// ======= ОБЩИЕ ОБРАБОТЧИКИ (ДЕЛЕГИРОВАНИЕ) =======
document.addEventListener('click', function (e) {
  const target = e.target;

  // Нажатие на кнопку "В корзину"
  const addBtn = target.closest('.add-to-cart');
  if (addBtn) {
    const card = addBtn.closest('.card, .foot-product');
    if (!card) return;

    const productId = card.dataset.productId || card.getAttribute('data-product-id') || null;
    const titleEl = card.querySelector('.product-title, .foot-product-desc-title');
    const priceEl =
      card.querySelector('.product-price .price-value') ||
      card.querySelector('.foot-product-desc-price');
    const imgEl = card.querySelector('.product-img img, .product-slides img.active');

    const title = titleEl ? titleEl.innerText.trim() : 'Без названия';
    const price = priceEl ? priceEl.innerText.trim().replace(/[^\d.,]/g, '') : '0';
    const img = imgEl ? imgEl.src : '';

    addProductToCart({ id: productId, title, price, img });
    return;
  }

  // Удаление из корзины
  if (target.closest('.cart-item-remove')) {
    removeCartItemByElement(target);
    return;
  }

  // Плюс/минус
  if (target.closest('.quantity-btn')) {
    if (target.classList.contains('increase')) {
      changeQuantityByElement(target, 1);
    } else if (target.classList.contains('decrease')) {
      changeQuantityByElement(target, -1);
    }
    return;
  }

  // Открыть/закрыть корзину
  const cartIcon = target.closest('.openbtn.cart-icon, .cart-icon');
  if (cartIcon) {
    toggleCart();
    return;
  }

  // Кнопка назад в боковой корзине
  if (target.closest('.cart-back-btn')) {
    toggleCart();
    return;
  }
});

// ======= TOGGLE КОРЗИНЫ =======
function toggleCart() {
  const cart = document.getElementById("shoppingCart");
  if (!cart) return;
  const main = document.getElementById("main");
  const isOpening = !cart.classList.contains("open");

  cart.classList.toggle("open");

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

  qsa('.go-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      saveCartToStorage();
      const href = this.getAttribute('href') || '/russian/consumer_ru/main_cart.html';
      setTimeout(() => window.location.href = href, 100);
    });
  });
});

window.addProductToCart = addProductToCart;
window.findCartItemIndexByIdOrTitle = findCartItemIndexByIdOrTitle;
window.showAlreadyInCartPopup = showAlreadyInCartPopup;
window.showSnackbar = showSnackbar;