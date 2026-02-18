const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { cart, delivery } = JSON.parse(event.body);

    if (!cart || cart.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty" })
      };
    }

    // Формируем товары для Stripe
    const line_items = cart.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(parseFloat(item.price.replace(",", ".")) * 100),
      },
      quantity: item.quantity,
    }));

    // Общая сумма
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      mode: "payment",
      line_items,
      customer_email: delivery.email || undefined,
      metadata: {
        name: `${delivery.firstName} ${delivery.lastName}`,
        phone: delivery.phone,
        address: `${delivery.street}, ${delivery.postcode}, ${delivery.city}, ${delivery.country}`
      },
      success_url: "https://ТВОЙ-САЙТ.netlify.app/success.html",
      cancel_url: "https://ТВОЙ-САЙТ.netlify.app/payment.html"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
