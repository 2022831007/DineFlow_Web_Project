import WaiterDashboard from "./pages/WaiterDashboard";
import TableSelection from "./pages/TableSelection";
import DineInOrder from "./pages/DineInOrder";
import KitchenDashboard from "./pages/KitchenDashboard";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🍽 DineFlow Restaurant System</h1>

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