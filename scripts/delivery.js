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

            // Сначала убираем старые красные рамки
            inputs.forEach(input => input.classList.remove("input-error"));

            const deliveryData = {
                firstName: inputs[0]?.value.trim() || "",
                lastName: inputs[1]?.value.trim() || "",
                phone: inputs[2]?.value.trim() || "",
                email: inputs[3]?.value.trim() || "",
                country: select?.value || "Germany",
                city: inputs[4]?.value.trim() || "",
                street: inputs[5]?.value.trim() || "",
                postcode: inputs[6]?.value.trim() || ""
            };

            let hasError = false;

            // 🔥 обязательные поля (можешь менять список)
            const requiredFields = [
                { value: deliveryData.firstName, element: inputs[0] },
                { value: deliveryData.lastName, element: inputs[1] },
                
                { value: deliveryData.email, element: inputs[3] },
                { value: deliveryData.city, element: inputs[4] },
                { value: deliveryData.street, element: inputs[5] },
                { value: deliveryData.postcode, element: inputs[6] },
            ];

            // Проверяем каждое поле
            requiredFields.forEach(field => {
                if (!field.value) {
                    field.element.classList.add("input-error");
                    hasError = true;
                }
            });

            // Если есть ошибки — не пускаем дальше (БЕЗ alert)
            if (hasError) return;

            // Сохраняем в localStorage
            localStorage.setItem("delivery", JSON.stringify(deliveryData));

            // Переход к оплате
            window.location.href = "/payment.html";
        });
    }

    // Убираем красную рамку при вводе
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                input.classList.remove("input-error");
            }
        });
    });


});
