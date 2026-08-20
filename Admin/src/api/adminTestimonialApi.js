// admin/src/api/adminTestimonialApi.js
import api from "./axios";

export const getAllTestimonialsAdminApi = (status) => api.get("/testimonials/admin/all", { params: { status } });
export const approveTestimonialApi = (id) => api.patch(`/testimonials/admin/${id}/approve`);
export const rejectTestimonialApi = (id) => api.delete(`/testimonials/admin/${id}/reject`);

