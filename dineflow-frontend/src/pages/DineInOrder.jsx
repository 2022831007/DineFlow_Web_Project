import React from "react";
import { createOrder } from "../api/api";

const DineInOrder = () => {
  const placeOrder = async () => {
    await createOrder({
      table_id: 1,
      items: [{ name: "Burger", qty: 2 }],
    });

    alert("Order Placed!");
  };

  return (
    <div>
      <h2>🍔 Place Order</h2>
      <button onClick={placeOrder}>Send Order</button>
    </div>
  );
};

export default DineInOrder;