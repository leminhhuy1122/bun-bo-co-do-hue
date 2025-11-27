"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function FloatingCart() {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  return (
    <Link
      href="/checkout"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#B33A2B] to-orange-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl hover:shadow-orange-500/50 flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-110 animate-float group"
    >
      <ShoppingCart size={24} className="md:w-7 md:h-7" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 md:w-7 md:h-7 rounded-full text-xs md:text-sm flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
          {cartCount}
        </span>
      )}

      {/* Tooltip cho desktop */}
      <span className="hidden md:block absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Giỏ hàng ({cartCount})
        <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></span>
      </span>
    </Link>
  );
}
