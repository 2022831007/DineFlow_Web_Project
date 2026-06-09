import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// 🪑 Tables
export const getTables = () => API.get("/tables");

// 🍔 Orders
export const createOrder = (data) => API.post("/orders", data);
export const getOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}`, { status });

// 🍽 Dine-In & Cashier Portals
export const getDineOrders = () => API.get("/dine-orders");
export const getDineOrderById = (id) => API.get(`/dine-orders/${id}`);
export const updateDineOrderStatus = (id, status) => API.put(`/kitchen/orders/${id}/status`, { status });
export const createDineOrder = (data) => API.post("/dine-orders", data);
export const getKitchenOrders = () => API.get("/kitchen/orders");

// ⚙️ Admin Module Endpoints
// Food Menu CRUD
export const getAdminMenu = () => API.get("/menu?all=true");
export const addMenuItem = (data) => API.post("/menu", data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

// Inventory CRUD
export const getInventory = () => API.get("/inventory");
export const addInventoryItem = (data) => API.post("/inventory", data);
export const updateInventoryItem = (id, data) => API.put(`/inventory/${id}`, data);
export const deleteInventoryItem = (id) => API.delete(`/inventory/${id}`);

// Reviews Moderation
export const getAdminReviews = () => API.get("/reviews/all");
export const updateReviewStatus = (id, status) => API.put(`/reviews/${id}/status`, { status });
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Billing & Dashboard
export const getBills = () => API.get("/orders/billing");
export const createBill = (data) => API.post("/orders/billing", data);
export const payBill = (id) => API.put(`/orders/billing/${id}/pay`);
export const getRecentOrders = () => API.get("/orders/recent");
export const getSalesReport = (from, to) => API.get(`/kitchen/sales-report?from=${from}&to=${to}`);
