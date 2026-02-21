let selectedMethod = null;

document.addEventListener("DOMContentLoaded", () => {

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

    // Выбор метода оплаты (твои кнопки)
    const paymentButtons = document.querySelectorAll('.payment-buttons > div');

    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMethod = btn.classList.contains('paypal-box') ? 'paypal' : 'card';
        });
    });

    // Кнопка "Оплатить"
    const payBtn = document.querySelector('.go-to-pay-btn');

    if (payBtn) {
        payBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (!selectedMethod) {
                alert("Выберите способ оплаты");
                return;
            }

            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const delivery = JSON.parse(localStorage.getItem("delivery")) || {};

            if (cart.length === 0) {
                alert("Корзина пуста");
                return;
            }

            try {
                payBtn.textContent = "Переход к оплате...";
                payBtn.style.pointerEvents = "none";

                const response = await fetch("/.netlify/functions/create-checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cart,
                        delivery,
                        method: selectedMethod
                    })
                });

                const data = await response.json();

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    alert("Ошибка создания оплаты");
                    payBtn.style.pointerEvents = "auto";
                    payBtn.textContent = "Оплатить";
                }

            } catch (error) {
                console.error(error);
                alert("Ошибка соединения с сервером оплаты");
                payBtn.style.pointerEvents = "auto";
                payBtn.textContent = "Оплатить";
            }
        });
    }
});
