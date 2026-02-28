const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { cart, delivery, method } = JSON.parse(event.body);

    const line_items = cart.map(item => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.title },
        unit_amount: Math.round(parseFloat(item.price.replace(",", ".")) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: "payment",
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/payment.html`,
      metadata: {
        ...delivery
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};