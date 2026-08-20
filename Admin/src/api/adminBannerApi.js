// admin/src/api/adminBannerApi.js
import api from "./axios";

export const getAllBannersAdminApi = () => api.get("/banners/admin/all");
export const createBannerApi = (data) => api.post("/banners", data);
export const updateBannerApi = (id, data) => api.patch(`/banners/${id}`, data);
export const deleteBannerApi = (id) => api.delete(`/banners/${id}`);
