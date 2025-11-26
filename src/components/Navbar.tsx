"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Menu,
  X,
  Phone,
  MapPin,
  Flame,
  Home,
  UtensilsCrossed,
  Calendar,
  Info,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { getCartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = getCartItemsCount();
  const pathname = usePathname();

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`bg-gradient-to-r from-gray-900 via-gray-800 to-orange-900 text-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-2xl shadow-orange-500/20 backdrop-blur-md"
          : "shadow-lg"
      }`}
    >
      {/* Top bar - Hidden on mobile for cleaner look */}
      <div className="bg-black bg-opacity-60 py-2 text-sm border-b border-orange-500/20 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a
              href="tel:0234567890"
              className="flex items-center gap-2 hover:text-orange-400 transition-all duration-300 hover:scale-105 group"
            >
              <Phone size={14} className="group-hover:animate-bounce" />
              <span className="font-medium">0234.567.890</span>
            </a>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={14} className="text-orange-400" />
              <span>123 Lê Duẩn, Huế</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-400 font-semibold">
            <Flame size={14} className="animate-pulse" />
            <span>Mở cửa: 6:00 - 22:00 hàng ngày</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Enhanced with animation */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-400 to-[#B33A2B] rounded-full flex items-center justify-center font-bold text-xl md:text-2xl shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300 border-2 border-orange-300">
                <span className="text-white">BBH</span>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl md:text-2xl font-bold group-hover:text-orange-400 transition-colors">
                Bún Bò Huế
              </h1>
              <p className="text-xs text-orange-300">⭐ Cố Đô ⭐</p>
            </div>
          </Link>

          {/* Desktop Menu - Modern style with icons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 ${
                isActive("/")
                  ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                  : "hover:text-orange-400"
              }`}
            >
              <Home size={18} />
              <span>Trang Chủ</span>
            </Link>
            <Link
              href="/menu"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 ${
                isActive("/menu")
                  ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                  : "hover:text-orange-400"
              }`}
            >
              <UtensilsCrossed size={18} />
              <span>Thực Đơn</span>
            </Link>
            <Link
              href="/reservation"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 ${
                isActive("/reservation")
                  ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                  : "hover:text-orange-400"
              }`}
            >
              <Calendar size={18} />
              <span>Đặt Bàn</span>
            </Link>
            <Link
              href="/about"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 ${
                isActive("/about")
                  ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                  : "hover:text-orange-400"
              }`}
            >
              <Info size={18} />
              <span>Về Chúng Tôi</span>
            </Link>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Cart Button - Enhanced */}
            <Link href="/checkout" className="relative group">
              <div className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110">
                <ShoppingCart
                  size={24}
                  className="group-hover:text-orange-400 transition-colors"
                />
                {cartCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
                      {cartCount}
                    </span>
                  </>
                )}
              </div>
            </Link>

            {/* Mobile menu button - Enhanced */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-orange-400" />
              ) : (
                <Menu size={24} className="text-orange-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Redesigned for better UX */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 pt-4 border-t border-orange-500/30">
            {/* Mobile Contact Info */}
            <div className="mb-4 pb-4 border-b border-orange-500/20">
              <a
                href="tel:0234567890"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all mb-2"
              >
                <Phone size={18} className="text-orange-400" />
                <span className="font-medium">0234.567.890</span>
              </a>
              <div className="flex items-center gap-3 p-3 rounded-xl text-gray-300 text-sm">
                <Flame size={18} className="text-orange-400" />
                <span>6:00 - 22:00 hàng ngày</span>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                    : "hover:bg-white/10 hover:text-orange-400"
                }`}
              >
                <Home size={20} />
                <span>Trang Chủ</span>
              </Link>
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive("/menu")
                    ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                    : "hover:bg-white/10 hover:text-orange-400"
                }`}
              >
                <UtensilsCrossed size={20} />
                <span>Thực Đơn</span>
              </Link>
              <Link
                href="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive("/reservation")
                    ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                    : "hover:bg-white/10 hover:text-orange-400"
                }`}
              >
                <Calendar size={20} />
                <span>Đặt Bàn</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive("/about")
                    ? "bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white shadow-lg"
                    : "hover:bg-white/10 hover:text-orange-400"
                }`}
              >
                <Info size={20} />
                <span>Về Chúng Tôi</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
