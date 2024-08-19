import React from "react";
import "./stripe.css";

const Stripe = ({ showPopUp, setShowPopUp, formValues }) => {
  console.log(formValues);

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={() => setShowPopUp(false)}>
          &times;
        </span>
        <p>This is a popup message!</p>
      </div>
    </div>
  );
};

export default Stripe;
