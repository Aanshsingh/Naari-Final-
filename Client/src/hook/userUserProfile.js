// src/hooks/useUserProfile.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getMyOrdersApi } from "../api/orderApi.js";

export function useUserProfile() {
  const { user, logout } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrdersApi().then((res) => res.data.data),
  });

  return { user, orders, ordersLoading, logout };
}