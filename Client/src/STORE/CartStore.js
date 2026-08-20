// src/store/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, name, image, price, qty, size }

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.size === item.size
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, qty: i.qty + item.qty }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      updateQty: (productId, size, qty) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, qty } : i
          ),
        });
      },

      removeItem: (productId, size) => {
        set({ items: get().items.filter((i) => !(i.productId === productId && i.size === size)) });
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "naari-cart" } // localStorage key
  )
);
