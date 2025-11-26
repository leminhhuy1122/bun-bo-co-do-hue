"use client";

import { Combo, MenuItem } from "@/types";
import Image from "next/image";
import { ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

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
    <section className="py-12 md:py-16 bg-gradient-to-br from-hue-cream to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-hue-red text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-4">
            <Tag size={14} className="md:hidden" />
            <Tag size={16} className="hidden md:block" />
            <span>COMBO TIẾT KIỆM</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-hue-redDark mb-3 md:mb-4 px-4">
            Ưu Đãi Combo Hấp Dẫn
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
            Đặt combo ngay để nhận ưu đãi giảm giá lên đến 30%
          </p>
        </div>

        {/* Combos Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hue-red mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải combo...</p>
            </div>
          ) : combos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Chưa có combo nào</p>
            </div>
          ) : (
            combos.map((combo) => (
              <div
                key={combo.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 active:scale-95"
              >
                {/* Image */}
                <div className="relative h-44 md:h-56 overflow-hidden">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1 md:gap-2 flex-wrap">
                    {combo.popular && (
                      <span className="bg-hue-gold text-hue-redDark px-2 py-1 rounded-full text-[10px] md:text-xs font-bold">
                        ⭐ Bán Chạy
                      </span>
                    )}
                    {combo.spicyLevel !== undefined && combo.spicyLevel > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-0.5">
                        {Array(combo.spicyLevel).fill("🌶️").join("")}
                      </span>
                    )}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-hue-red text-white px-2 md:px-3 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                    Giảm {calculateDiscount(combo.price)}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-hue-redDark mb-2 line-clamp-1">
                    {combo.name}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 line-clamp-2">
                    {combo.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-end gap-2 md:gap-3 mb-3 md:mb-4">
                    <span className="text-2xl md:text-3xl font-bold text-hue-red">
                      {formatPrice(combo.price)}
                    </span>
                    <span className="text-sm md:text-lg text-gray-400 line-through mb-1">
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
                    } text-white py-2.5 md:py-3 rounded-xl font-bold active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base`}
                  >
                    <ShoppingCart size={18} className="md:hidden" />
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

        {/* Bottom CTA */}
        <div className="text-center mt-8 md:mt-12">
          <div className="inline-block bg-hue-gold text-hue-redDark px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold shadow-lg text-sm md:text-base">
            💝 Miễn phí giao hàng cho đơn từ 150K
          </div>
        </div>
      </div>
    </section>
  );
}
