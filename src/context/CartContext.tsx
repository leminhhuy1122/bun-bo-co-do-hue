"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, MenuItem, Topping, Coupon } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    toppings?: Topping[],
    note?: string,
    quantity?: number
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  appliedCoupon: Coupon | null;
  getDiscount: () => number;
  getFinalTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    item: MenuItem,
    toppings: Topping[] = [],
    note?: string,
    quantity: number = 1
  ) => {
    setCart((prev) => [...prev, { menuItem: item, quantity, toppings, note }]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.menuItem.price * item.quantity;
      const toppingsTotal =
        item.toppings.reduce((sum, topping) => sum + topping.price, 0) *
        item.quantity;
      return total + itemTotal + toppingsTotal;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const applyCoupon = (coupon: Coupon) => {
    const total = getCartTotal();
    if (total >= coupon.minOrderValue) {
      setAppliedCoupon(coupon);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;

    const total = getCartTotal();
    if (total < appliedCoupon.minOrderValue) return 0;

    if (appliedCoupon.discountType === "percentage") {
      const discount = (total * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount
        ? Math.min(discount, appliedCoupon.maxDiscount)
        : discount;
    } else {
      return appliedCoupon.discountValue;
    }
  };

  const getFinalTotal = () => {
    return Math.max(0, getCartTotal() - getDiscount());
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        getDiscount,
        getFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
