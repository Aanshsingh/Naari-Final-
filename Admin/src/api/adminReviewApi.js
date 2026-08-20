// admin/src/api/adminReviewApi.js
import api from "./axios";

export const getAllReviewsAdminApi = (status) => api.get("/reviews/admin/all", { params: { status } });
export const approveReviewApi = (id) => api.patch(`/reviews/admin/${id}/approve`);
export const rejectReviewApi = (id) => api.delete(`/reviews/admin/${id}/reject`);