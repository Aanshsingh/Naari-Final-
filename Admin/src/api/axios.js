// admin/src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://naari-final-3.onrender.com",
  withCredentials: true,
});

export default api;