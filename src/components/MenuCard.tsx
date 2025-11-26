"use client";

import Image from "next/image";
import { MenuItem } from "@/types";
import { Plus, Flame } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
  onViewDetail: (item: MenuItem) => void;
}

export default function MenuCard({ item, onViewDetail }: MenuCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group active:scale-95">
      {/* Image */}
      <div className="relative h-40 md:h-48 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-hue-red to-hue-brown flex items-center justify-center">
            <span className="text-white text-4xl">🍜</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 md:gap-2 flex-wrap">
          {item.popular && (
            <span className="bg-hue-gold text-hue-redDark px-2 py-1 rounded-full text-[10px] md:text-xs font-bold">
              ⭐ Bán Chạy
            </span>
          )}
          {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-0.5">
              {Array(item.spicyLevel).fill("🌶️").join("")}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-display text-lg md:text-xl font-bold text-hue-redDark mb-1 md:mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-lg md:text-2xl font-bold text-hue-red whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => onViewDetail(item)}
            className="bg-hue-red text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-hue-redDark active:scale-95 transition flex items-center gap-1 md:gap-2 text-sm md:text-base font-semibold"
          >
            <Plus size={18} className="md:hidden" />
            <Plus size={20} className="hidden md:block" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
