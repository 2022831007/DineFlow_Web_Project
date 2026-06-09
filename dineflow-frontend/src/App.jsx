import React, { useState, useEffect } from "react";
import WaiterDashboard from "./pages/WaiterDashboard";
import TableSelection from "./pages/TableSelection";
import DineInOrder from "./pages/DineInOrder";
import KitchenDashboard from "./pages/KitchenDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import AdminPanel from "./pages/admin/AdminPanel";

function App() {
  const [activeView, setActiveView] = useState("main"); // "main", "admin", "cashier"

  // Toggle layout overrides on the #root node when entering/exiting full screen mode
  useEffect(() => {
    const rootEl = document.getElementById("root");
    if (rootEl) {
      if (activeView === "admin" || activeView === "cashier") {
        rootEl.classList.add("admin-mode-active");
      } else {
        rootEl.classList.remove("admin-mode-active");
      }
    }
  }, [activeView]);

  if (activeView === "admin") {
    return <AdminPanel onBack={() => setActiveView("main")} />;
  }

  if (activeView === "cashier") {
    return <CashierDashboard onBack={() => setActiveView("main")} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>🍽 DineFlow Restaurant System</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setActiveView("cashier")}
            style={{
              background: "#00C896",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            💰 Go to Cashier Dashboard
          </button>
          <button
            onClick={() => setActiveView("admin")}
            style={{
              background: "#FF2D78",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ⚙️ Go to Admin Dashboard
          </button>
        </div>
      </div>

      <WaiterDashboard />
      <hr />
      <TableSelection />
      <hr />
      <DineInOrder />
      <hr />
      <KitchenDashboard />
    </div>
  );
}

export default App;