import React, { useEffect, useState } from "react";
import { getTables, getAdminMenu, createDineOrder } from "../api/api";

const DineInOrder = () => {
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tablesRes, menuRes] = await Promise.all([
          getTables(),
          getAdminMenu()
        ]);
        if (tablesRes.data && tablesRes.data.success) {
          setTables(tablesRes.data.data);
          if (tablesRes.data.data.length > 0) {
            setSelectedTable(tablesRes.data.data[0].id);
          }
        }
        if (menuRes.data && menuRes.data.success) {
          setMenu(menuRes.data.items);
          if (menuRes.data.items.length > 0) {
            setSelectedItem(menuRes.data.items[0].id);
          }
        }
      } catch (err) {
        console.warn("Failed to load dine-in order data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!selectedTable || !selectedItem || quantity <= 0) {
      alert("Please select a table, an item, and a valid quantity!");
      return;
    }

    const menuItem = menu.find(item => item.id === parseInt(selectedItem, 10));
    if (!menuItem) return;

    try {
      const payload = {
        table_id: parseInt(selectedTable, 10),
        waiter_id: 1, // Default to Sajid Ali (demo waiter seeded in db)
        items: [
          {
            menu_item_id: menuItem.id,
            quantity: parseInt(quantity, 10),
            price: parseFloat(menuItem.price)
          }
        ]
      };

      const res = await createDineOrder(payload);
      if (res.data && res.data.success) {
        alert(`Success! Dine-in Order #${res.data.order_id} placed for Table #${selectedTable}.`);
      }
    } catch (err) {
      alert("Failed to place order: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <p>Loading menu and tables...</p>;
  }

  return (
    <div style={{ padding: "20px", background: "#f9f9fb", borderRadius: "12px", border: "1px solid #e1e0e6", maxWidth: "480px" }}>
      <h2 style={{ color: "#1A0A2E", margin: "0 0 16px" }}>🍔 Place Dine-In Order</h2>
      <form onSubmit={placeOrder}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>Select Table:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            required
          >
            {tables.map(t => (
              <option key={t.id} value={t.id}>
                Table {t.table_number} ({t.status})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>Select Food Item:</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            required
          >
            {menu.map(item => (
              <option key={item.id} value={item.id}>
                {item.emoji} {item.name} - ৳{item.price}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#FF2D78",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Send Dine-In Order 🚀
        </button>
      </form>
    </div>
  );
};

export default DineInOrder;