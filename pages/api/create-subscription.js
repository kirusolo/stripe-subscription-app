import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    if (req.method != "POST") return res.status(400);
    const { name, email, paymentMethod } = req.body;
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });
    // Create a product
    const product = await stripe.products.create({
      name: "Monthly subscription",
    });
    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "usd",
            product: product.id,
            unit_amount: "500",
            recurring: {
              interval: "month",
            },
          },
        },
      ],

      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });
    // Send back the client secret for payment
    res.json({
      message: "Subscription successfully initiated",
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// // api/create-subscription.js
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { id } = req.body;

//       // Create a subscription
//       const subscription = await stripe.subscriptions.create({
//         customer: process.env.STRIPE_CUSTOMER_ID, // Replace with your customer ID
//         items: [
//           {
//             price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID, // Replace with your subscription price ID
//           },
//         ],
//         default_payment_method: id,
//       });

//       res.status(200).json({ message: "Subscription successful!" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "An error occurred" });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }
