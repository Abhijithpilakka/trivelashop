"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";
import type { SizeKey } from "@/types";

interface CartStore {
  cart: CartItem[];
  wishlist: number[];

  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (index: number) => void;
  changeQty: (index: number, delta: number) => void;
  clearCart: () => void;

  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;

  cartCount: () => number;
}

export const useStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (item) =>
        set((state) => {
          const idx = state.cart.findIndex(
            (x) => x.pid === item.pid && x.size === item.size && x.ver === item.ver
          );
          if (idx >= 0) {
            const next = [...state.cart];
            next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
            return { cart: next };
          }
          return { cart: [...state.cart, { ...item, qty: 1 }] };
        }),

      removeFromCart: (index) =>
        set((state) => ({ cart: state.cart.filter((_, i) => i !== index) })),

      changeQty: (index, delta) =>
        set((state) => {
          const next = [...state.cart];
          next[index] = { ...next[index], qty: Math.max(1, next[index].qty + delta) };
          return { cart: next };
        }),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((x) => x !== id)
            : [...state.wishlist, id],
        })),

      isWishlisted: (id) => get().wishlist.includes(id),

      cartCount: () => get().cart.reduce((s, x) => s + x.qty, 0),
    }),
    { name: "trivela-store" }
  )
);
