import { useState } from "react";

import "./App.css";
import Stripe from "./pages/Stripe";

function App() {
  const [formValues, setFormValues] = useState({
    amount: "",
    currency: "",
  });
  const [showPopUp, setShowPopUp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopUp(true);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            {" "}
            <label>Enter Amount</label>
            <input
              type="number"
              name="amount"
              value={formValues.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            {" "}
            <label>Enter Currency</label>
            <input
              type="text"
              name="currency"
              value={formValues.currency}
              onChange={handleChange}
            />
          </div>
          <div className="card">
            <button type="submit">Pay with Stripe</button>
          </div>
        </form>
      </div>

      {showPopUp && <Stripe formValues={formValues} />}
    </>
  );
}

export default App;
