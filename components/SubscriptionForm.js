// components/PaymentForm.js
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import axios from "axios";

function PaymentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = async () => {
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card: elements.getElement(CardElement),
        type: "card",
      });

      const response = await axios.post("/api/create-subscription", {
        name,
        email,
        paymentMethod: paymentMethod.paymentMethod.id,
      });

      if (response.data.message === "Subscription successful!") {
        alert("Payment Successful! Subscription active.");
      } else {
        alert("Payment unsuccessful! Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed! " + err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{ width: "40%", padding: "20px", backgroundColor: "#ffffff" }}
      >
        <div style={{ marginBottom: "20px" }}>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          Email:{" "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <CardElement />
        </div>
        <div>
          <button onClick={createSubscription}>Subscribe - 5 usd</button>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;

// // components/SubscriptionForm.js
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import axios from "axios";
// import React, { useState } from "react";

// function SubscriptionForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card: elements.getElement(CardElement),
//     });

//     if (!error) {
//       const { id } = paymentMethod;

//       console.log("Payment Method ID:", id);

//       try {
//         const response = await axios.post("/api/create-subscription", { id });

//         console.log("Subscription Response:", response.data);

//         if (response.data.message === "Subscription successful!") {
//           alert("Subscription successful! You are now subscribed.");
//         } else {
//           alert("Subscription failed. Please try again.");
//         }
//       } catch (error) {
//         console.error("Subscription Error:", error);
//         alert("An error occurred. Please try again. Error: " + error.message);
//       }
//     } else {
//       console.log("Payment Method Error:", error);
//       alert("Card validation error. Please check your card details.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement />
//       <button type="submit">Subscribe</button>
//     </form>
//   );
// }

// export default SubscriptionForm;
