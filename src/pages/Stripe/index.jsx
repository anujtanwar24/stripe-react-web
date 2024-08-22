import { useState } from "react";
import { Box } from "grommet";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import "./stripe.css";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  AUD: "$",
  CAD: "$",
  CHF: "Fr",
  CNY: "¥",
  INR: "₹",
  MXN: "$",
  NZD: "$",
  SEK: "kr",
  ZAR: "R",
  AED: "د.إ",
  BRL: "R$",
  HKD: "$",
  KRW: "₩",
  SGD: "$",
};

const Stripe = ({ formValues }) => {
  const [clientSecret, setClientSecret] = useState(null);

  // Fetch the client secret from your server
  const fetchClientSecret = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formValues.amount,
          currency: formValues.currency,
        }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  };

  // Fetch client secret on component mount
  useState(() => {
    fetchClientSecret();
  }, []);

  const stripePromise = loadStripe(
    "pk_test_5.............................................................................................S"
  );

  return clientSecret && stripePromise ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm values={formValues} />
    </Elements>
  ) : (
    <Box fill align="center" justify="center">
      {/* <Loader /> */}
    </Box>
  );
};

const CheckoutForm = ({ values }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionID, setTransactionID] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        window.parent.postMessage(
          {
            code: "PAYMENT_ERROR_OCCURED_IN_STRIPE",
            errorMessage: error.message,
          },
          "*"
        );
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setTransactionID(paymentIntent.id);
        console.log("Payment successful, Transaction ID:", paymentIntent.id);
      }
    } catch (error) {
      console.error("Error during payment confirmation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    stripe && (
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              `Pay ${values?.currency.toUpperCase()} ${
                currencySymbols[values?.currency.toUpperCase()]
              }${(values?.amount / 100).toFixed(2)}`
            )}
          </span>
        </button>
        {transactionID && <p>Transaction ID: {transactionID}</p>}
      </form>
    )
  );
};

Stripe.propTypes = {
  formValues: PropTypes.shape({
    currency: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
};

CheckoutForm.propTypes = {
  values: PropTypes.shape({
    currency: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
};

export default Stripe;
