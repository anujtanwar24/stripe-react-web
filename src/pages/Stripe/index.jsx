import React, { useState } from "react";
import "./stripe.css";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Pp94zz.........................nn5C8S"
);
const clientSecret = "sk_test_51Pp942GB.............................LMU";
const Stripe = ({ showPopUp, setShowPopUp, formValues }) => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm formValues={formValues} clientSecret={clientSecret} />
    </Elements>
  );
};

const CheckoutForm = ({ formValues, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Create PaymentIntent on the server and get clientSecret
    // const response = await fetch("/create-payment-intent", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     amount: formValues.amount, // amount should be in the smallest currency unit (e.g., cents)
    //     currency: formValues.currency,
    //   }),
    // });

    // const { clientSecret } = await response.json();

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default Stripe;
