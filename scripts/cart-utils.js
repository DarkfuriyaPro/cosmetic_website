/* =====================================================
   CART-UTILS.JS — общие утилиты для всех checkout страниц
   Подключать ПЕРВЫМ перед delivery.js / payment.js / main_cart.js
===================================================== */

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function formatPrice(value) {
    if (!value) value = 0;
    return value.toFixed(2).replace(".", ",") + "€";
}

function calcTotal(cartItems) {
    return cartItems.reduce((sum, item) => {
        return sum + parseFloat(String(item.price).replace(",", ".")) * item.quantity;
    }, 0);
}

// Рендерит список товаров в боковой панели (delivery / payment)
// containerSelector — куда вставлять, totalSelector — где показывать итог
function renderSidebarCart(containerSelector, totalSelector) {
    const cartItems = getCart();
    const container = document.querySelector(containerSelector);
    const totalBox = document.querySelector(totalSelector);

    if (!container) return;
    container.innerHTML = "";

    cartItems.forEach(item => {
        const el = document.createElement("div");
        el.classList.add("sidebar-cart-item");
        el.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="sidebar-cart-desc">
                <div class="sidebar-product-title">${item.title}</div>
                <div class="sidebar-product-price">${item.price}€ × ${item.quantity}</div>
            </div>
        `;
        container.appendChild(el);
    });

    if (totalBox) {
        totalBox.textContent = formatPrice(calcTotal(cartItems));
    }
}
