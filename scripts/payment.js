let selectedMethod = null;

document.addEventListener("DOMContentLoaded", () => {

    // ===== 1. ЗАГРУЗКА КОРЗИНЫ =====
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.querySelector(".payment-cart-top");
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
        el.classList.add("payment-cart-item");

        el.innerHTML = `
            <img src="${item.img}" alt="">
            <div class="payment-desc">
                <div class="payment-product-title">${item.title}</div>
                <div class="payment-product-price">${item.price}€ × ${item.quantity}</div>
            </div>
        `;

        container.appendChild(el);
    });

    if (totalBox) {
        totalBox.textContent = total.toFixed(2).replace(".", ",") + "€";
    }

    // ===== 2. ВЫБОР МЕТОДА ОПЛАТЫ (ВАЖНО: учитываем ВСЕ кнопки) =====
    const paymentButtons = document.querySelectorAll('.payment-buttons > div');

    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => {

            // Убираем активный класс у всех
            paymentButtons.forEach(b => b.classList.remove('active'));

            // Добавляем активный выбранной кнопке
            btn.classList.add('active');

            // Определяем метод по классу (под твой HTML)
            if (btn.classList.contains('paypal-box')) {
                selectedMethod = 'paypal';
            } else if (btn.classList.contains('qr-pay')) {
                selectedMethod = 'qr';
            } else if (btn.classList.contains('mastercard-btn')) {
                selectedMethod = 'card';
            }
        });
    });

    // ===== 3. КНОПКА "ОПЛАТИТЬ" =====
    const payBtn = document.querySelector('.go-to-pay-btn');

    if (!payBtn) return;

    payBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const delivery = JSON.parse(localStorage.getItem("delivery")) || {};

        // Проверка корзины
        if (cart.length === 0) {
            alert("Корзина пуста");
            return;
        }

        // Проверка выбора метода
        if (!selectedMethod) {
            alert("Выберите способ оплаты");
            return;
        }

        // ===== QR ОПЛАТА (переход по ссылке из HTML) =====
        if (selectedMethod === 'qr') {
            const qrBtn = document.querySelector('.qr-pay');
            const qrUrl = qrBtn?.dataset.paymentUrl;

            if (qrUrl && qrUrl !== "STRIPE_PAYMENT_LINK") {
                window.location.href = qrUrl;
            } else {
                alert("QR оплата пока не настроена");
            }
            return;
        }

        // ===== PAYPAL (прямая ссылка из HTML) =====
        if (selectedMethod === 'paypal') {
            const paypalBtn = document.querySelector('.paypal-box');
            const paypalUrl = paypalBtn?.dataset.paymentUrl;

            if (paypalUrl && !paypalUrl.includes("вашаккаунт")) {
                window.location.href = paypalUrl;
                return;
            }
            // если PayPal не настроен — fallback на Stripe
        }

        // ===== STRIPE CHECKOUT (КАРТА / ОСНОВНАЯ ОПЛАТА) =====
        try {
            payBtn.textContent = "Переход к оплате...";
            payBtn.disabled = true;

            const response = await fetch("/.netlify/functions/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cart: cart,
                    delivery: delivery,
                    method: selectedMethod
                })
            });

            if (!response.ok) {
                throw new Error("Ошибка функции Netlify");
            }

            const data = await response.json();

            if (data.url) {
                // Редирект на Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error("Не получена ссылка оплаты");
            }

        } catch (error) {
            console.error("Ошибка оплаты:", error);
            alert("Ошибка соединения с системой оплаты");

            payBtn.textContent = "Оплатить";
            payBtn.disabled = false;
        }
    });
});