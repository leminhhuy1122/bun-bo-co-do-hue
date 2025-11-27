"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import ComboSection from "@/components/ComboSection";
import PromoPopup from "@/components/PromoPopup";
import MenuCard from "@/components/MenuCard";
import MenuModal from "@/components/MenuModal";
import Toast from "@/components/Toast";
import { useCart } from "@/context/CartContext";
import menuData from "@/data/menu.json";
import { MenuItem, Topping } from "@/types";
import { Utensils, Clock, Award, Heart, Star } from "lucide-react";
import Link from "next/link";
import FloatingCart from "@/components/FloatingCart";

export default function HomePage() {
  const { addToCart } = useCart();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get popular dishes
  const popularDishes = menuData
    .filter((item) => item.popular && item.category === "main")
    .slice(0, 3) as MenuItem[];

  const handleViewDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (
    item: MenuItem,
    toppings: Topping[],
    note: string,
    quantity: number
  ) => {
    addToCart(item, toppings, note, quantity);
    setToast({
      message: `Đã thêm ${quantity} ${item.name} vào giỏ hàng!`,
      type: "success",
    });
  };

  return (
    <>
      <FloatingCart />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <PromoPopup />
      <Hero />

      {/* Menu Modal */}
      {selectedItem && (
        <MenuModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Features Section - Elegant Design */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-orange-50/30 to-white relative overflow-hidden">
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23B33A2B' fill-opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 text-[#B33A2B] font-semibold text-sm tracking-widest uppercase">
                <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#B33A2B]"></span>
                Cam kết chất lượng
                <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#B33A2B]"></span>
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Tại Sao Chọn
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B33A2B] to-orange-600">
                {" "}
                Chúng Tôi
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Trải nghiệm ẩm thực đẳng cấp với sự tận tâm trong từng chi tiết
            </p>
          </div>

          {/* Features Grid - 2x2 on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <div className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#B33A2B]/10 to-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Utensils
                    className="text-[#B33A2B]"
                    size={20}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 text-gray-900">
                  Đặc Sản Chính Gốc
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                  Công thức truyền thống Huế xưa, giữ nguyên hương vị đậm đà bản
                  sắc
                </p>
              </div>
            </div>

            <div className="group relative bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#B33A2B]/10 to-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Clock
                    className="text-[#B33A2B]"
                    size={20}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 text-gray-900">
                  Phục Vụ Nhanh Chóng
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                  Giao hàng tận nơi trong 30 phút, đảm bảo món ăn luôn nóng hổi
                </p>
              </div>
            </div>

            <div className="group relative bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#B33A2B]/10 to-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Award
                    className="text-[#B33A2B]"
                    size={20}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 text-gray-900">
                  Chất Lượng Đảm Bảo
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                  Nguyên liệu tươi mới mỗi ngày, an toàn vệ sinh thực phẩm
                </p>
              </div>
            </div>

            <div className="group relative bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#B33A2B]/10 to-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Heart
                    className="text-[#B33A2B]"
                    size={20}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 text-gray-900">
                  50,000+ Yêu Thích
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                  Được hàng ngàn khách hàng tin tưởng và quay lại
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ComboSection />

      {/* Popular Dishes - Premium Design */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-orange-50/20 relative overflow-hidden">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #B33A2B 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-[#B33A2B] text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Star size={16} fill="currentColor" />
              <span className="tracking-wide">MÓN ĂN BÁN CHẠY</span>
              <Star size={16} fill="currentColor" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Món Ăn
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B33A2B] to-orange-600">
                {" "}
                Được Yêu Thích Nhất
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Khám phá những món ăn đặc sắc được hàng ngàn khách hàng lựa chọn
            </p>
          </div>

          {/* Dishes Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {popularDishes.map((dish, index) => (
              <div
                key={dish.id}
                className="opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animationFillMode: "forwards",
                }}
              >
                <MenuCard item={dish} onViewDetail={handleViewDetail} />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#B33A2B] to-orange-600 text-white px-10 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#B33A2B]/20"
            >
              <span>Khám Phá Thực Đơn Đầy Đủ</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section - Premium Restaurant Style */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Elegant Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10L60 40L90 40L65 60L75 90L50 70L25 90L35 60L10 40L40 40Z' fill='%23B33A2B' fill-opacity='0.3'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center gap-2 text-[#B33A2B] font-semibold text-sm tracking-widest uppercase">
                  <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#B33A2B]"></span>
                  Về chúng tôi
                  <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#B33A2B]"></span>
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Câu Chuyện
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B33A2B] to-orange-600">
                  {" "}
                  Của Chúng Tôi
                </span>
              </h2>
            </div>

            {/* Story Content */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
              {/* Text Content */}
              <div className="space-y-6">
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-base md:text-lg">
                    <span className="text-2xl md:text-3xl font-bold text-[#B33A2B] leading-none">
                      Bún Bò Huế Cố Đô
                    </span>
                    <span className="block mt-2">
                      được thành lập từ năm 2009 với tâm huyết mang đến những tô
                      bún bò Huế chính gốc, giữ trọn hương vị truyền thống xứ
                      Huế mộng mơ.
                    </span>
                  </p>

                  <div className="pl-6 border-l-4 border-[#B33A2B]/30">
                    <p className="text-base md:text-lg text-gray-600">
                      Nước dùng được ninh từ xương ống bò trong hơn{" "}
                      <strong className="text-[#B33A2B]">
                        8 tiếng đồng hồ
                      </strong>
                      , kết hợp với sả tươi, mắm ruốc và sa tế đặc biệt tạo nên
                      vị cay nồng đậm đà.
                    </p>
                  </div>

                  <div className="pl-6 border-l-4 border-orange-400/30">
                    <p className="text-base md:text-lg text-gray-600">
                      Với hơn{" "}
                      <strong className="text-[#B33A2B]">
                        15 năm kinh nghiệm
                      </strong>{" "}
                      và{" "}
                      <strong className="text-orange-600">
                        50,000+ khách hàng
                      </strong>{" "}
                      hài lòng, chúng tôi tự hào là điểm đến tin cậy cho những
                      ai yêu ẩm thực Huế.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards - Responsive */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="group bg-gradient-to-br from-[#B33A2B] to-orange-600 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                    2009
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-white/90 font-medium">
                    Năm Thành Lập
                  </div>
                  <div className="mt-2 sm:mt-3 w-12 h-1 bg-white/40 group-hover:w-full transition-all duration-300"></div>
                </div>

                <div className="group bg-gradient-to-br from-orange-500 to-red-600 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                    50K+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-white/90 font-medium">
                    Khách Hàng
                  </div>
                  <div className="mt-2 sm:mt-3 w-12 h-1 bg-white/40 group-hover:w-full transition-all duration-300"></div>
                </div>

                <div className="group bg-gradient-to-br from-amber-500 to-orange-500 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                    15+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-white/90 font-medium">
                    Năm KN
                  </div>
                  <div className="mt-2 sm:mt-3 w-12 h-1 bg-white/40 group-hover:w-full transition-all duration-300"></div>
                </div>

                <div className="group bg-gradient-to-br from-yellow-500 to-orange-600 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center gap-1 mb-1 sm:mb-2">
                    <Star size={18} fill="currentColor" className="sm:hidden" />
                    <Star
                      size={24}
                      fill="currentColor"
                      className="hidden sm:block md:hidden"
                    />
                    <Star
                      size={32}
                      fill="currentColor"
                      className="hidden md:block"
                    />
                    <span className="text-2xl sm:text-3xl md:text-5xl font-bold group-hover:scale-110 transition-transform">
                      4.8
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-white/90 font-medium">
                    Đánh Giá TB
                  </div>
                  <div className="mt-2 sm:mt-3 w-12 h-1 bg-white/40 group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            </div>

            {/* Awards & Recognition */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 md:p-12 rounded-3xl border border-orange-100 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Giải Thưởng & Chứng Nhận
                </h3>
                <p className="text-gray-600">
                  Được công nhận bởi các tổ chức uy tín
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-3xl md:text-4xl mb-2">🏆</div>
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    Top 10 Quán Ăn
                    <br className="hidden md:block" /> Xuất Sắc
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-3xl md:text-4xl mb-2">✅</div>
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    Chứng Nhận
                    <br className="hidden md:block" /> ATTP
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-3xl md:text-4xl mb-2">⭐</div>
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    Món Ăn
                    <br className="hidden md:block" /> 5 Sao
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-3xl md:text-4xl mb-2">❤️</div>
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    Yêu Thích
                    <br className="hidden md:block" /> Nhất 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
