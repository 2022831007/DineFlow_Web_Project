import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🪑 Tables
export const getTables = () => API.get("/tables");

// 🍔 Orders
export const createOrder = (data) => API.post("/orders", data);
export const getOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}`, { status });