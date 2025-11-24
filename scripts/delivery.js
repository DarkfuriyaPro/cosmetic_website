document.addEventListener("DOMContentLoaded", function () {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.querySelector(".delivery-cart-top");
    const totalBox = document.querySelector(".delivery-price");

    if (!container || !totalBox) return;

    container.innerHTML = ""; // очищаем дефолтные заглушки

    let total = 0;

    cartItems.forEach(item => {
        const priceNum = parseFloat(String(item.price).replace(",", "."));
        const itemTotal = priceNum * item.quantity;
        total += itemTotal;

        const el = document.createElement("div");
        el.classList.add("delivery-cart-item");

        el.innerHTML = `
            <img src="${item.img}" alt="">
            <div class="delivery-desc">
                <div class="delivery-product-title">${item.title}</div>
                <div class="delivery-product-price">${item.price}€ × ${item.quantity}</div>
            </div>
        `;
        container.appendChild(el);
    });

    totalBox.innerHTML = `Стоимость: ${total.toFixed(2).replace(".", ",")}€`;
});
