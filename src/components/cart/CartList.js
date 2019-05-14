import React from "react";
import CartItem from "./CartItem";

function CartList({ value }) {
  const { cart } = value;
  console.log(value, cart);

  return (
    <div className="container-fluid">
      {// Loop through cart array and map out the cart items
      cart.map(item => {
        //   Assign each CartItem key an item id, the actual item, and the value of each item
        return <CartItem key={item.id} item={item} value={value} />;
      })}
    </div>
  );
}

export default CartList;
