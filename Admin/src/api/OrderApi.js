// src/admin/api/adminOrderApi.js
import api from "../api/axios";

export const getAllOrdersAdminApi = (status) => api.get("/orders/admin/all", { params: { status } });
export const updateOrderStatusApi = (orderId, status, note) =>
  api.patch(`/orders/admin/${orderId}/status`, { status, note });
export const getOrderStatsApi = () => api.get("/orders/admin/stats");