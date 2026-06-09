import React, { useEffect, useState } from "react";
import { getKitchenOrders, updateDineOrderStatus } from "../api/api";

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKitchenOrders = async () => {
    try {
      setLoading(true);
      const res = await getKitchenOrders();
      if (res.data && res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch kitchen orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const markReady = async (id) => {
    try {
      await updateDineOrderStatus(id, "ready");
      alert(`Order #${id} marked as Ready!`);
      fetchKitchenOrders();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (loading) {
    return <p>Loading kitchen prep queue...</p>;
  }

  return (
    <div style={{ padding: "20px", background: "#f9f9fb", borderRadius: "12px", border: "1px solid #e1e0e6" }}>
      <h2 style={{ color: "#1A0A2E", margin: "0 0 16px" }}>👨‍🍳 Kitchen Dashboard</h2>

      {orders.length === 0 ? (
        <p style={{ color: "#888", fontWeight: "bold" }}>No active orders needing preparation.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {orders.map((o) => (
            <div key={o.id} style={{
              background: "#fff",
              border: "1px solid #e5e4e7",
              borderRadius: "10px",
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: 800, color: "#1A0A2E" }}>Order #{o.id}</span>
                  <span style={{ background: "#FFE8EF", color: "#FF2D78", fontSize: "0.8rem", padding: "2px 8px", borderRadius: "20px", fontWeight: "bold" }}>
                    Table {o.table_number}
                  </span>
                </div>
                <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#666" }}><strong>Status:</strong> {o.status}</p>
                <p style={{ margin: "8px 0", fontSize: "0.95rem", color: "#1A0A2E", lineHeight: "1.4" }}>
                  <strong>Items:</strong> {o.items_summary}
                </p>
                {o.waiter_name && <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#888" }}>Waiter: {o.waiter_name}</p>}
              </div>

              <button
                onClick={() => markReady(o.id)}
                style={{
                  marginTop: "12px",
                  background: "#00C896",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "opacity 0.2s"
                }}
              >
                Mark Ready ✅
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;