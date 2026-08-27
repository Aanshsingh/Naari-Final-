// client/src/api/bannerApi.js
import api from "./axios";

export const getActiveBannersApi = () => api.get("/banners");