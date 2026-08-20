// admin/src/api/adminCategoryApi.js
import api from "./axios";

export const getCategoriesApi = () => api.get("/categories");
export const createCategoryApi = (data) => api.post("/categories", data);
export const updateCategoryApi = (id, data) => api.patch(`/categories/${id}`, data);
export const deleteCategoryApi = (id) => api.delete(`/categories/${id}`);