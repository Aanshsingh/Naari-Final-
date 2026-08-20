import api from "./axios";


export const getMyOrdersApi = () => {
  return api.get("/orders/mine");
};
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);



