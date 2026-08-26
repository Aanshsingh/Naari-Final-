// admin/src/api/adminInstagramApi.js
import api from "./axios";

export const getAllPostsAdminApi = () => api.get("/instagram-posts/admin/all");
export const createInstagramPostApi = (data) => api.post("/instagram-posts", data);
export const deleteInstagramPostApi = (id) => api.delete(`/instagram-posts/${id}`);

