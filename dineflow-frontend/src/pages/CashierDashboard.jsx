import React, { useEffect, useState } from "react";
import { getDineOrders, getDineOrderById, updateDineOrderStatus, getBills, createDineOrder } from "../api/api";

const CashierDashboard = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Filtering and Searching states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Collected revenue state (derived from DB bills)
  const [collectedRevenue, setCollectedRevenue] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);

  // Fetch all active dine-in orders
  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const res = await getDineOrders();
      if (res.data && res.data.success) {
        setOrders(res.data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn("Failed to fetch active dine-in orders:", err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch revenue metrics from billing list
  const fetchRevenueStats = async () => {
    try {
      const res = await getBills();
      if (res.data && res.data.success) {
        const paidBills = res.data.bills.filter(b => b.status === 'Paid');
        const revenue = paidBills.reduce((sum, b) => sum + b.amount, 0);
        setCollectedRevenue(revenue);
        setCompletedOrdersCount(paidBills.length);
      }
    } catch (err) {
      console.warn("Failed to fetch revenue statistics:", err.message);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    fetchRevenueStats();
    const interval = setInterval(() => {
      fetchActiveOrders();
      fetchRevenueStats();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async (orderId) => {
    try {
      const res = await getDineOrderById(orderId);
      if (res.data && res.data.success) {
        setSelectedOrderDetails(res.data.data);
        setPaymentMethod("Cash");
        setIsModalOpen(true);
      }
    } catch (err) {
      alert("Failed to fetch order details: " + err.message);
    }
  };

  const handlePayment = async () => {
    if (!selectedOrderDetails) return;
    try {
      setProcessing(true);

      // Real DB checkout
      const res = await updateDineOrderStatus(selectedOrderDetails.id, "served");
      if (res.data && res.data.success) {
        alert(`Payment of ৳${selectedOrderDetails.total_amount} processed successfully via ${paymentMethod}! Table ${selectedOrderDetails.table_number} is now free.`);
        setIsModalOpen(false);
        setSelectedOrderDetails(null);
        await Promise.all([fetchActiveOrders(), fetchRevenueStats()]);
      }
    } catch (err) {
      alert("Failed to process checkout: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Generate a new walk-in order to test checkouts dynamically
  const generateTestOrder = async () => {
    try {
      const randomTableId = Math.floor(Math.random() * 8) + 1;
      
      const payload = {
        table_id: randomTableId,
        waiter_id: 1, // Sajid Ali (demo waiter seeded in db)
        items: [
          { menu_item_id: 1, quantity: 2, price: 220 }, // Classic Beef Burger
          { menu_item_id: 10, quantity: 1, price: 100 } // Strawberry Milkshake
        ]
      };

      const res = await createDineOrder(payload);
      if (res.data && res.data.success) {
        alert(`Real DB Dine-in Order placed for Table #${randomTableId}! Refreshing order list...`);
        const newOrderId = res.data.order_id;
        await updateDineOrderStatus(newOrderId, "ready");
        await fetchActiveOrders();
      }
    } catch (err) {
      alert("Failed to generate test order: " + (err.response?.data?.message || err.message));
    }
  };

  const printReceipt = () => {
    window.print();
  };

  // Filter active orders based on Search & Status selector
  const filteredOrders = orders.filter(o => {
    const tableNumStr = o.table_number ? String(o.table_number) : "";
    const matchQ =
      tableNumStr.includes(searchQuery) ||
      o.id.toString().includes(searchQuery) ||
      (o.waiter_name && o.waiter_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchQ && matchStatus;
  });

  const readyOrdersCount = orders.filter(o => o.status === "ready").length;

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      color: "#1A0A2E",
      background: "#fff",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      marginTop: "24px"
    }}>
      {/* Header with Explicit Text Colors */}
      <h2 style={{
        fontSize: "1.6rem",
        fontWeight: 900,
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#1A0A2E" // Fixed text color
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "10px", color: "#1A0A2E" }}>
          💰 Cashier Billing Dashboard
        </span>
        {onBack && (
          <button
            onClick={onBack}
            className="no-print"
            style={{
              background: "#1A0A2E",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.95rem"
            }}
          >
            ⬅ Back to Main
          </button>
        )}
      </h2>

      {/* Cashier KPI Cards */}
      <div className="stats-grid no-print" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <h3 style={{ color: "#888" }}>Collected Revenue</h3>
            <div className="stat-value" style={{ color: "#1A0A2E" }}>৳{collectedRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">✅</div>
          <div className="stat-info">
            <h3 style={{ color: "#888" }}>Completed Sales</h3>
            <div className="stat-value" style={{ color: "#1A0A2E" }}>{completedOrdersCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">⏳</div>
          <div className="stat-info">
            <h3 style={{ color: "#888" }}>Active Dine-Ins</h3>
            <div className="stat-value" style={{ color: "#1A0A2E" }}>{orders.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">🔔</div>
          <div className="stat-info">
            <h3 style={{ color: "#888" }}>Ready for Bill</h3>
            <div className="stat-value" style={{ color: isReady => readyOrdersCount > 0 ? "#FF2D78" : "#1A0A2E" }}>{readyOrdersCount}</div>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="admin-card no-print" style={{ marginBottom: "20px", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              className="admin-search"
              placeholder="Search table or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "220px" }}
            />
            <select
              className="admin-search"
              style={{ width: "160px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="ready">Ready for Checkout</option>
              <option value="preparing">Preparing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <button
              onClick={generateTestOrder}
              style={{
                background: "#7B2FFF",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              ⚡ Create Test Order
            </button>
          </div>
        </div>
      </div>

      {/* Active orders list */}
      {loading ? (
        <p style={{ color: "#888", fontWeight: "bold" }}>Loading active orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          padding: "40px",
          textAlign: "center",
          background: "#FFF5F8",
          borderRadius: "12px",
          border: "2px dashed #FF2D78",
          color: "#FF2D78"
        }}>
          <h3 style={{ margin: 0, fontWeight: 800, color: "#FF2D78" }}>No active dine-in orders match your filter!</h3>
          <p style={{ margin: "10px 0 0", color: "#888" }}>You can click "Create Test Order" to add a mock checkout order instantly.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }} className="no-print">
          {filteredOrders.map((o) => {
            const isReady = o.status === "ready";
            return (
              <div
                key={o.id}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "20px",
                  border: isReady ? "2px solid #00C896" : "1px solid #e5e4e7",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{
                      fontWeight: 800,
                      background: "#FF2D78",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "50px",
                      fontSize: "0.85rem"
                    }}>
                      Table {o.table_number}
                    </span>
                    <span style={{
                      fontWeight: 800,
                      background: isReady ? "#E8FFF7" : "#FFFCE8",
                      color: isReady ? "#00C896" : "#B8860B",
                      padding: "4px 10px",
                      borderRadius: "50px",
                      fontSize: "0.8rem",
                      textTransform: "capitalize"
                    }}>
                      {o.status}
                    </span>
                  </div>

                  <p style={{ margin: "4px 0", fontSize: "0.95rem", color: "#1A0A2E" }}>
                    <strong>Order ID:</strong> #{o.id}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "0.95rem", color: "#1A0A2E" }}>
                    <strong>Waiter:</strong> {o.waiter_name || "Self"}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#888" }}>
                    <strong>Time:</strong> {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed #e5e4e7" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ color: "#888", fontWeight: 700 }}>Total:</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#FF2D78" }}>৳{o.total_amount}</span>
                  </div>
                  <button
                    onClick={() => handleCheckout(o.id)}
                    style={{
                      width: "100%",
                      background: isReady ? "#00C896" : "#FF2D78",
                      color: "#fff",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "opacity 0.2s"
                    }}
                  >
                    🧾 Checkout / Bill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bill Receipt Modal */}
      {isModalOpen && selectedOrderDetails && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4000
          }}
          onClick={(e) => e.target.style.position === "fixed" && setIsModalOpen(false)}
        >
          <div
            id="printableReceiptArea"
            style={{
              background: "#fff",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "420px",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              position: "relative",
              color: "#1A0A2E",
              textAlign: "left"
            }}
          >
            {/* Modal Header */}
            <div style={{ borderBottom: "2px dashed #ddd", paddingBottom: "12px", textAlign: "center", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "'Pacifico', cursive", fontSize: "1.8rem", margin: "0 0 4px", color: "#FF2D78" }}>DineFlow</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>Restaurant Checkout Invoice</p>
              <button
                className="no-print"
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "none",
                  border: "none",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  color: "#888"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "0.9rem", color: "#1A0A2E" }}>
                <div>
                  <p style={{ margin: "2px 0" }}><strong>Table:</strong> {selectedOrderDetails.table_number}</p>
                  <p style={{ margin: "2px 0" }}><strong>Order ID:</strong> #{selectedOrderDetails.id}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "2px 0" }}><strong>Date:</strong> {new Date(selectedOrderDetails.created_at).toLocaleDateString()}</p>
                  <p style={{ margin: "2px 0" }}><strong>Waiter:</strong> {selectedOrderDetails.waiter_name || "Self"}</p>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px", color: "#1A0A2E" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd", fontSize: "0.85rem", color: "#888" }}>
                    <th style={{ textAlign: "left", padding: "6px 0" }}>Item</th>
                    <th style={{ textAlign: "center", padding: "6px 0" }}>Qty</th>
                    <th style={{ textAlign: "right", padding: "6px 0" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderDetails.items && selectedOrderDetails.items.map((item, idx) => (
                    <tr key={idx} style={{ fontSize: "0.95rem" }}>
                      <td style={{ padding: "8px 0" }}>
                        {item.item_name}
                        {item.special_note && <div style={{ fontSize: "0.75rem", color: "#FF6B2B" }}>Note: {item.special_note}</div>}
                      </td>
                      <td style={{ textAlign: "center", padding: "8px 0" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right", padding: "8px 0" }}>৳{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop: "2px dashed #ddd", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#1A0A2E" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Total Amount:</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#FF2D78" }}>৳{selectedOrderDetails.total_amount}</span>
              </div>

              {/* Payment Method Selector */}
              <div className="no-print" style={{ marginTop: "20px", background: "#f9f9f9", padding: "12px", borderRadius: "10px" }}>
                <label style={{ display: "block", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "6px", color: "#1A0A2E" }}>Payment Method:</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Cash", "Card", "Mobile"].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      style={{
                        flex: 1,
                        background: paymentMethod === m ? "#FF2D78" : "#fff",
                        color: paymentMethod === m ? "#fff" : "#1A0A2E",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        padding: "6px 0",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.85rem"
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="no-print" style={{ borderTop: "1px solid #ddd", paddingTop: "16px", marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "#f0f0f0",
                  color: "#1A0A2E",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
              <button
                onClick={printReceipt}
                style={{
                  background: "#3b2f6b",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                🖨️ Print
              </button>
              <button
                onClick={handlePayment}
                disabled={processing}
                style={{
                  background: "#00C896",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  opacity: processing ? 0.6 : 1
                }}
              >
                {processing ? "Processing..." : "Paid & Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printing stylesheet */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printableReceiptArea, #printableReceiptArea * { visibility: visible; }
          #printableReceiptArea { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; transform: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CashierDashboard;
