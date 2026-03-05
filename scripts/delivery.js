document.addEventListener("DOMContentLoaded", function () {

    // Рендерим товары в боковой корзине
    renderSidebarCart(".delivery-cart-top", ".total-value");

    // Кнопка перехода к оплате
    const payBtn = document.querySelector(".checkout-btn");

    if (payBtn) {
        payBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const inputs = document.querySelectorAll("input");
            const select = document.querySelector("select");

            // Убираем старые красные рамки
            inputs.forEach(input => input.classList.remove("input-error"));

            const deliveryData = {
                firstName: inputs[0]?.value.trim() || "",
                lastName:  inputs[1]?.value.trim() || "",
                phone:     inputs[2]?.value.trim() || "",
                email:     inputs[3]?.value.trim() || "",
                country:   select?.value || "Germany",
                city:      inputs[4]?.value.trim() || "",
                street:    inputs[5]?.value.trim() || "",
                postcode:  inputs[6]?.value.trim() || ""
            };

            // Все обязательные поля включая телефон
            const requiredFields = [
                { value: deliveryData.firstName, element: inputs[0] },
                { value: deliveryData.lastName,  element: inputs[1] },
                { value: deliveryData.phone,     element: inputs[2] },
                { value: deliveryData.email,     element: inputs[3] },
                { value: deliveryData.city,      element: inputs[4] },
                { value: deliveryData.street,    element: inputs[5] },
                { value: deliveryData.postcode,  element: inputs[6] },
            ];

            let hasError = false;
            requiredFields.forEach(field => {
                if (!field.value) {
                    field.element.classList.add("input-error");
                    hasError = true;
                }
            });

            if (hasError) return;

            localStorage.setItem("delivery", JSON.stringify(deliveryData));
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
