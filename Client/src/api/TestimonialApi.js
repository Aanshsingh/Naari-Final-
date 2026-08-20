import api from "./axios";

export const getApprovedTestimonialsApi = () => api.get("/testimonials");
export const submitTestimonialApi = (data) => api.post("/testimonials", data);