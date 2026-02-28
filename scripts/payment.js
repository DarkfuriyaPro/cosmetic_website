let selectedMethod = null;

document.addEventListener("DOMContentLoaded", () => {

    // ===== 1. LOAD CART =====
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

    // ===== 2. PAYMENT METHOD SELECTION (IMPORTANT: consider ALL buttons) =====
    const paymentButtons = document.querySelectorAll('.payment-buttons > div');

    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => {

            // Remove active class from all buttons
            paymentButtons.forEach(b => b.classList.remove('active'));

            // Add active class to the selected button
            btn.classList.add('active');

            // Determine the method by class (based on your HTML)
            if (btn.classList.contains('paypal-box')) {
                selectedMethod = 'paypal';
            } else if (btn.classList.contains('qr-pay')) {
                selectedMethod = 'qr';
            } else if (btn.classList.contains('mastercard-btn')) {
                selectedMethod = 'card';
            }
        });
    });

    // ===== 3. PAY BUTTON =====
    const payBtn = document.querySelector('.go-to-pay-btn');

    if (!payBtn) return;

    payBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const delivery = JSON.parse(localStorage.getItem("delivery")) || {};

        // Check cart
        if (cart.length === 0) {
            alert("Cart is empty");
            return;
        }

        // Check payment method selection
        if (!selectedMethod) {
            alert("Please select a payment method");
            return;
        }

        // ===== QR PAYMENT (redirect via HTML link) =====
        if (selectedMethod === 'qr') {
            const qrBtn = document.querySelector('.qr-pay');
            const qrUrl = qrBtn?.dataset.paymentUrl;

            if (qrUrl && qrUrl !== "STRIPE_PAYMENT_LINK") {
                window.location.href = qrUrl;
            } else {
                alert("QR payment is not set up yet");
            }
            return;
        }

        // ===== PAYPAL (direct link from HTML) =====
        if (selectedMethod === 'paypal') {
            const paypalBtn = document.querySelector('.paypal-box');
            const paypalUrl = paypalBtn?.dataset.paymentUrl;

            if (paypalUrl && !paypalUrl.includes("вашаккаунт")) {
                window.location.href = paypalUrl;
                return;
            }
            // if PayPal is not set up — fallback to Stripe
        }

        // ===== STRIPE CHECKOUT (CARD / MAIN PAYMENT) =====
        try {
            payBtn.textContent = "Redirecting to payment...";
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
                throw new Error("Netlify function error");
            }

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error("Payment link not received");
            }

        } catch (error) {
            console.error("Payment error:", error);
            alert("Connection error with payment system");

            payBtn.textContent = "Pay";
            payBtn.disabled = false;
        }
    });
});