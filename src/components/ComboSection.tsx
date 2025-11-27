"use client";

import { Combo, MenuItem } from "@/types";
import Image from "next/image";
import { ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function ComboSection() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu?category=combo")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCombos(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading combos:", err);
        setLoading(false);
      });
  }, []);
  const { addToCart } = useCart();
  const [addedComboId, setAddedComboId] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const calculateDiscount = (price: number) => {
    // Giả sử giá hiển thị đã là giá giảm, tính % giảm dựa vào combo type
    if (price >= 350000) return 29; // Combo 4 người
    if (price >= 150000) return 25; // Combo 2 người
    return 15; // Combo 1 người
  };

  const getOriginalPrice = (price: number) => {
    const discount = calculateDiscount(price);
    return Math.round(price / (1 - discount / 100));
  };

  const handleAddToCart = (combo: any) => {
    // Convert combo to MenuItem format for cart compatibility
    const comboAsMenuItem: MenuItem = {
      id: combo.id.toString(),
      name: combo.name,
      description: combo.description,
      price: combo.price,
      image: combo.image,
      category: "combo",
    };

    addToCart(
      comboAsMenuItem,
      [],
      `Combo - Giá gốc: ${formatPrice(getOriginalPrice(combo.price))}`,
      1
    );
    setAddedComboId(combo.id);

    // Reset animation after 2 seconds
    setTimeout(() => {
      setAddedComboId(null);
    }, 2000);
  };

  return (
    <section className="py-8 sm:py-10 md:py-14 lg:py-16 bg-gradient-to-br from-hue-cream to-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-hue-red text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-bold mb-3 sm:mb-4">
            <Tag size={12} className="sm:hidden" />
            <Tag size={14} className="hidden sm:block md:hidden" />
            <Tag size={16} className="hidden md:block" />
            <span>COMBO TIẾT KIỆM</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-hue-redDark mb-2 sm:mb-3 md:mb-4 px-3 sm:px-4">
            Ưu Đãi Combo Hấp Dẫn
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-3 sm:px-4">
            Đặt combo ngay để nhận ưu đãi giảm giá lên đến 30%
          </p>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full">
              <LoadingSpinner size="lg" message="Đang tải combo..." />
            </div>
          ) : combos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Chưa có combo nào</p>
            </div>
          ) : (
            combos.map((combo) => (
              <div
                key={combo.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1 md:hover:-translate-y-2 active:scale-95"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-44 md:h-52 lg:h-56 overflow-hidden">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* REMOVED ALL BADGES - Không hiển thị bất kỳ badge nào để tránh số 0 */}

                  {/* Discount Badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 bg-hue-red text-white px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-full font-bold text-[10px] sm:text-xs md:text-sm shadow-lg">
                    Giảm {calculateDiscount(combo.price)}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-hue-redDark mb-1.5 sm:mb-2 line-clamp-1">
                    {combo.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4 line-clamp-2">
                    {combo.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-end gap-1.5 sm:gap-2 md:gap-3 mb-2.5 sm:mb-3 md:mb-4">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-hue-red">
                      {formatPrice(combo.price)}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 line-through mb-0.5 sm:mb-1">
                      {formatPrice(getOriginalPrice(combo.price))}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleAddToCart(combo)}
                    className={`w-full ${
                      addedComboId === combo.id
                        ? "bg-green-600"
                        : "bg-hue-red hover:bg-hue-redDark"
                    } text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-bold active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base`}
                  >
                    <ShoppingCart size={16} className="sm:hidden" />
                    <ShoppingCart
                      size={18}
                      className="hidden sm:block md:hidden"
                    />
                    <ShoppingCart size={20} className="hidden md:block" />
                    <span>
                      {addedComboId === combo.id ? "Đã Thêm ✓" : "Đặt Ngay"}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
