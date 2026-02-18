let selectedMethod = null;

document.addEventListener("DOMContentLoaded", () => {

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
