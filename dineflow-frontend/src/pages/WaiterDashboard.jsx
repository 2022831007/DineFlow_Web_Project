import React, { useEffect, useState } from "react";
import { getTables } from "../api/api";

const WaiterDashboard = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    getTables().then((res) => setTables(res.data.data));
  }, []);

  return (
    <div>
      <h2>🍽 Waiter Dashboard</h2>

      {tables.map((t) => (
        <div key={t.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <p>Table: {t.table_number}</p>
          <p>Capacity: {t.capacity}</p>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
  );
};

export default WaiterDashboard;