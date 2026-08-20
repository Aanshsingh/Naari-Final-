// src/hooks/useLikedProducts.js
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../api/productApi";
import { useWishlistStore } from "../STORE/wishlistStore";

export function useLikedProducts() {
  const { likedIds, toggleLike } = useWishlistStore();

  const query = useQuery({
    queryKey: ["liked-products", likedIds],
    queryFn: async () => {
      if (likedIds.length === 0) return [];
      const res = await getProductsApi({ limit: 50 });
      return res.data.data.products.filter((p) => likedIds.includes(p._id));
    },
  });

  return { ...query, likedIds, toggleLike };
}