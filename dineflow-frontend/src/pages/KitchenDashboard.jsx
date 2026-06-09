import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../api/api";

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data.data));
  }, []);

  const markReady = async (id) => {
    await updateOrderStatus(id, "ready");
  };

  return (
    <div>
      <h2>👨‍🍳 Kitchen Dashboard</h2>

      {orders.map((o) => (
        <div key={o.id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
          <p>Order ID: {o.id}</p>
          <p>Status: {o.status}</p>

          <button onClick={() => markReady(o.id)}>
            Mark Ready
          </button>
        </div>
      ))}
    </div>
  );
};

export default KitchenDashboard;