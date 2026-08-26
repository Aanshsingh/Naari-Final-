// client/src/api/instagramApi.js
import api from "./axios";

export const getActiveInstagramPostsApi = () => api.get("/instagram-posts");

