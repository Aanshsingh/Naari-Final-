import api from "./axios";

export const getProductsApi = (params) =>
  api.get("/products", { params });

export const getRelatedProductsApi = (categoryId, excludeSlug) =>
  api.get("/products", { params: { category: categoryId, limit: 4 } })
    .then((res) => res.data.data.products.filter((p) => p.slug !== excludeSlug));

    export const getProductBySlugApi = (slug) => api.get(`/products/${slug}`);