import stripe from "../utils/stripeUtils.js";

const createStripe = async (item, delivery_fee, discount_code, userId, orderId) => {
  const line_items = item.map((item) => ({
    price_data: {
      currency: "vnd",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * (1 - discount_code / 100)) * 1000,
    },
    quantity: item.quantity,
  }));

  line_items.push({
    price_data: {
      currency: "vnd",
      product_data: { name: "Delivery Fee" },
      unit_amount: delivery_fee * 1000,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/complete-payment?orderId=${orderId}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel?orderId=${orderId}`,
    metadata: {
      userId,
      orderId
    },
  });

  return {
    url: session.url,
  };
};

export default createStripe;
