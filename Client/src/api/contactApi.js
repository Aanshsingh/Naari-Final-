// client/src/api/contactApi.js
import api from "./axios";

export const submitContactFormApi = (data) => api.post("/contact", data);

