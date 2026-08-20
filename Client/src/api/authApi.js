import api from "./axios";

export const registerApi = (data) => api.post("/auth/register", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const logoutApi = () => api.post("/auth/logout");
export const getCurrentUserApi = () => api.get("/auth/current-user");
export const verifyEmailApi = (token) => api.get(`/auth/verify-email/${token}`);
export const resendVerificationApi = () => api.post("/auth/resend-verification");