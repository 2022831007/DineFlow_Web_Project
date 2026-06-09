import React, { useEffect, useState } from "react";
import { getTables } from "../api/api";

const TableSelection = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    getTables().then((res) => setTables(res.data.data));
  }, []);

  return (
    <div>
      <h2>🪑 Select Table</h2>

      {tables.map((t) => (
        <button key={t.id} style={{ margin: 10, padding: 10 }}>
          Table {t.table_number}
        </button>
      ))}
    </div>
  );
};

export default TableSelection;