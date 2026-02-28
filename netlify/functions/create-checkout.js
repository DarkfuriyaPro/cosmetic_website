const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    // Получаем данные из тела запроса
    const { cart, delivery, method } = JSON.parse(event.body);

    // Формируем товары для Stripe
    const line_items = cart.map(item => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.title },
        unit_amount: Math.round(parseFloat(item.price.replace(",", ".")) * 100),
      },
      quantity: item.quantity,
    }));

    // Формируем метаданные с проверкой на пустые поля
    const metadata = {
      firstName: delivery.firstName || '',
      lastName: delivery.lastName || '',
      phone: delivery.phone || '',
      email: delivery.email || '',
      country: delivery.country || '',
      city: delivery.city || '',
      street: delivery.street || '',
      postcode: delivery.postcode || ''
    };

    // Создаём Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // только карты, PayPal отдельно
      line_items,
      mode: "payment",
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/payment.html`,
      metadata
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};