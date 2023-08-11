// pages/subscribe.js
require("dotenv").config();

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionForm from "../components/SubscriptionForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function Subscribe() {
  return (
    <div>
      <h1>Subscribe to Premium</h1>
      <Elements stripe={stripePromise}>
        <SubscriptionForm />
      </Elements>
    </div>
  );
}

export default Subscribe;
