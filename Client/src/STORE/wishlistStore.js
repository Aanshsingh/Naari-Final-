// src/STORE/wishlistStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      likedIds: [],
      toggleLike: (productId) => {
        const isLiked = get().likedIds.includes(productId);
        set({
          likedIds: isLiked
            ? get().likedIds.filter((id) => id !== productId)
            : [...get().likedIds, productId],
        });
      },
      isLiked: (productId) => get().likedIds.includes(productId),
    }),
    { name: "naari-wishlist" }
  )
);

