// src/api/categoryApi.js
import api from "./axios";

export const getCategoriesApi = () => api.get("/categories");

export const getCategoryBySlugApi = (slug) => api.get(`/categories/slug/${slug}`);
