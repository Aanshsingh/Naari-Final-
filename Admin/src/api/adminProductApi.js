import api from "./axios";

export const getAllProductsApi = (params) => api.get("/products", { params });
export const createProductApi = (data) => api.post("/products", data);
export const updateProductApi = (id, data) => api.patch(`/products/${id}`, data);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);
