import axios from "axios";

const api = axios.create({
  baseURL: "https://naari-final-3.onrender.com/api/v1",
  withCredentials: true,
});

export default api;
