document.addEventListener("DOMContentLoaded", function () {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.querySelector(".delivery-cart-top");
    const totalBox = document.querySelector(".total-value");

    if (container) {
        container.innerHTML = "";
    }

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

    if (totalBox) {
        totalBox.textContent = total.toFixed(2).replace(".", ",") + "€";
    }

    // 🔥 СОХРАНЕНИЕ ДАННЫХ ДОСТАВКИ
    const payBtn = document.querySelector(".go-to-pay-btn");

    if (payBtn) {
        payBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const inputs = document.querySelectorAll("input");
            const select = document.querySelector("select");

            const deliveryData = {
                firstName: inputs[0]?.value || "",
                lastName: inputs[1]?.value || "",
                phone: inputs[2]?.value || "",
                email: inputs[3]?.value || "",
                country: select?.value || "Germany",
                city: inputs[4]?.value || "",
                street: inputs[5]?.value || "",
                postcode: inputs[6]?.value || ""
            };

            // Проверка обязательных полей
            if (!deliveryData.firstName || !deliveryData.lastName || !deliveryData.email) {
                alert("Пожалуйста, заполните обязательные поля");
                return;
            }

            // Сохраняем в localStorage
            localStorage.setItem("delivery", JSON.stringify(deliveryData));

            // Переход к оплате
            window.location.href = "/payment.html";
        });
    }
});
