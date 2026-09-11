"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/lib/products";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  coupon: string | null;
  discount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "kalvan_cart_v1";
const COUPON_KEY = "kalvan_coupon_v1";

const VALID_COUPONS: Record<string, number> = {
  KALVAN10: 0.1,
  WELCOME150: 150,
};

function sameLine(a: CartItem, productId: string, size: string, color: string) {
  return a.productId === productId && a.size === size && a.color === color;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const savedCoupon = window.localStorage.getItem(COUPON_KEY);
      if (savedCoupon) setCoupon(savedCoupon);
    } catch (e) {
      // ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (coupon) window.localStorage.setItem(COUPON_KEY, coupon);
    else window.localStorage.removeItem(COUPON_KEY);
  }, [coupon, hydrated]);

  const addItem = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => sameLine(i, product.id, size, color));
        if (existing) {
          return prev.map((i) =>
            sameLine(i, product.id, size, color)
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            price: product.price,
            size,
            color,
            quantity,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, size, color)));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            sameLine(i, productId, size, color) ? { ...i, quantity } : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    const rule = VALID_COUPONS[coupon];
    if (!rule) return 0;
    if (rule < 1) return Math.round(subtotal * rule);
    return Math.min(rule, subtotal);
  }, [coupon, subtotal]);

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return { success: false, message: "Enter a coupon code." };
    if (VALID_COUPONS[normalized] === undefined) {
      return { success: false, message: "That code isn't valid." };
    }
    setCoupon(normalized);
    return { success: true, message: "Coupon applied." };
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    coupon,
    discount,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
