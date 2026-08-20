// admin/src/api/adminSalesApi.js
import api from "./axios";

export const getSalesOverviewApi = () => api.get("/orders/admin/sales-overview");
