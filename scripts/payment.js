let selectedMethod = null;

document.addEventListener("DOMContentLoaded", () => {

    // Рендерим товары в боковой корзине
    renderSidebarCart(".payment-cart-top", ".total-value");

    // Выбор способа оплаты
    const paymentButtons = document.querySelectorAll(".payment-buttons > div");

    paymentButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            paymentButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (btn.classList.contains("paypal-box")) {
                selectedMethod = "paypal";
            } else if (btn.classList.contains("qr-pay")) {
                selectedMethod = "qr";
            } else if (btn.classList.contains("mastercard-btn")) {
                selectedMethod = "card";
            }
        });
    });

    // Кнопка оплаты
    const payBtn = document.querySelector(".checkout-btn");
    if (!payBtn) return;

    payBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const cart = getCart();
        const delivery = JSON.parse(localStorage.getItem("delivery")) || {};

        if (cart.length === 0) {
            alert("Корзина пустая");
            return;
        }

        if (!selectedMethod) {
            alert("Выберите способ оплаты");
            return;
        }

        // Проверяем, что данные доставки есть
        if (!delivery.firstName) {
            alert("Данные доставки не заполнены");
            window.location.href = "/delivery.html";
            return;
        }

        // QR оплата
        if (selectedMethod === "qr") {
            const qrUrl = document.querySelector(".qr-pay")?.dataset.paymentUrl;
            if (qrUrl && qrUrl !== "STRIPE_PAYMENT_LINK") {
                window.location.href = qrUrl;
            } else {
                alert("QR оплата ещё не настроена");
            }
            return;
        }

        // PayPal
        if (selectedMethod === "paypal") {
            const paypalUrl = document.querySelector(".paypal-box")?.dataset.paymentUrl;
            if (paypalUrl && !paypalUrl.includes("вашаккаунт")) {
                window.location.href = paypalUrl;
                return;
            }
            // PayPal не настроен — падаем на Stripe
        }

        // Stripe
        try {
            payBtn.textContent = "Перенаправление...";
            payBtn.disabled = true;

            const response = await fetch("/.netlify/functions/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart, delivery, method: selectedMethod })
            });

            if (!response.ok) throw new Error("Netlify function error");

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Payment link not received");
            }

        } catch (error) {
            console.error("Payment error:", error);
            alert("Ошибка подключения к платёжной системе");
            payBtn.textContent = "Оплатить";
            payBtn.disabled = false;
        }
    });
});
