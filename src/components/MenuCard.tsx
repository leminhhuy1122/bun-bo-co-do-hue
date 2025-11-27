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
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group active:scale-95">
      {/* Image */}
      <div className="relative h-36 sm:h-40 md:h-44 lg:h-48 overflow-hidden">
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

        {/* REMOVED ALL BADGES - Không hiển thị bất kỳ badge nào */}
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-3 md:p-4">
        <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-hue-redDark mb-1 md:mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-hue-red whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => onViewDetail(item)}
            className="bg-hue-red text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg hover:bg-hue-redDark active:scale-95 transition flex items-center gap-1 md:gap-2 text-xs sm:text-sm md:text-base font-semibold"
          >
            <Plus size={16} className="sm:hidden" />
            <Plus size={18} className="hidden sm:block md:hidden" />
            <Plus size={20} className="hidden md:block" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
