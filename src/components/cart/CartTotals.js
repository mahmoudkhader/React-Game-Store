import React from "react";
import { Link } from "react-router-dom";
import MyApp from "./PayPalButton";

function CartTotals({ value, history }) {
  const { cartSubtotal, cartTax, cartTotal, clearCart } = value;

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-10 mt-2 ml-sm-5 ml-md-auto col-sm-8 text-right">
            <Link to="/">
              <button
                className="btn btn-outline-danger text-uppercase mb-3 px-5"
                type="button"
                onClick={() => clearCart()}
              >
                clear cart
              </button>
            </Link>
            <h5>
              <span className="text-title">Subtotal: </span>
              <strong>${cartSubtotal}</strong>
            </h5>
            <h5>
              <span className="text-title">Tax: </span>
              <strong>${cartTax}</strong>
            </h5>
            <h5>
              <span className="text-title">Total: </span>
              <strong>${cartTotal}</strong>
            </h5>
            <br />
            <h4>NOTE - This is just a demo</h4>
            <h6>To use the Paypal sandbox, use the following credentials:</h6>
            <h6>Email: paypal-customer@reactgamestore.com</h6>
            <h6>Pass: paypalpass</h6>
            <MyApp total={cartTotal} clearCart={clearCart} history={history} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CartTotals;
