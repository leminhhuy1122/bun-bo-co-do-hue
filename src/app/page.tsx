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

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#B33A2B] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-16 animate-fadeInUp">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B33A2B] to-orange-600 mb-3 md:mb-4 px-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-gray-600 text-sm md:text-lg px-4">
              Cam kết mang đến trải nghiệm ẩm thực tuyệt vời nhất
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="group text-center bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 active:scale-95 md:hover:-translate-y-4 border-2 border-transparent hover:border-orange-400">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#B33A2B] to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/50">
                <Utensils className="text-white" size={24} />
                <Utensils className="text-white hidden md:block" size={36} />
              </div>
              <h3 className="font-bold text-sm md:text-xl mb-2 md:mb-3 text-[#B33A2B] group-hover:text-orange-600 transition-colors">
                Đặc Sản Chính Gốc
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed hidden sm:block">
                Công thức truyền thống Huế xưa
              </p>
            </div>

            <div className="group text-center bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 active:scale-95 md:hover:-translate-y-4 border-2 border-transparent hover:border-orange-400">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#B33A2B] to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/50">
                <Clock className="text-white md:hidden" size={24} />
                <Clock className="text-white hidden md:block" size={36} />
              </div>
              <h3 className="font-bold text-sm md:text-xl mb-2 md:mb-3 text-[#B33A2B] group-hover:text-orange-600 transition-colors">
                Phục Vụ Nhanh
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed hidden sm:block">
                Giao hàng trong 30 phút
              </p>
            </div>

            <div className="group text-center bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 active:scale-95 md:hover:-translate-y-4 border-2 border-transparent hover:border-orange-400">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#B33A2B] to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/50">
                <Award className="text-white md:hidden" size={24} />
                <Award className="text-white hidden md:block" size={36} />
              </div>
              <h3 className="font-bold text-sm md:text-xl mb-2 md:mb-3 text-[#B33A2B] group-hover:text-orange-600 transition-colors">
                Chất Lượng Đảm Bảo
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed hidden sm:block">
                Nguyên liệu tươi mỗi ngày
              </p>
            </div>

            <div className="group text-center bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 active:scale-95 md:hover:-translate-y-4 border-2 border-transparent hover:border-orange-400">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#B33A2B] to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/50">
                <Heart className="text-white md:hidden" size={24} />
                <Heart className="text-white hidden md:block" size={36} />
              </div>
              <h3 className="font-bold text-sm md:text-xl mb-2 md:mb-3 text-[#B33A2B] group-hover:text-orange-600 transition-colors">
                50K+ Yêu Thích
              </h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed hidden sm:block">
                Được khách hàng tin tưởng
              </p>
            </div>
          </div>
        </div>
      </section>

      <ComboSection />

      {/* Popular Dishes */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-900 via-black to-[#B33A2B] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-red-600 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-16 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-lg shadow-orange-500/50">
              <Star
                size={14}
                className="animate-spin md:hidden"
                style={{ animationDuration: "3s" }}
              />
              <Star
                size={16}
                className="animate-spin hidden md:block"
                style={{ animationDuration: "3s" }}
              />
              <span>BEST SELLER</span>
              <Star
                size={14}
                className="animate-spin md:hidden"
                style={{
                  animationDuration: "3s",
                  animationDirection: "reverse",
                }}
              />
              <Star
                size={16}
                className="animate-spin hidden md:block"
                style={{
                  animationDuration: "3s",
                  animationDirection: "reverse",
                }}
              />
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)] px-4">
              🔥 Món Ăn Bán Chạy 🔥
            </h2>
            <p className="text-gray-300 text-sm md:text-xl max-w-2xl mx-auto px-4">
              Những món được yêu thích nhất tại{" "}
              <span className="text-orange-400 font-bold">
                Bún Bò Huế Cố Đô
              </span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            {popularDishes.map((dish, index) => (
              <div
                key={dish.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <MenuCard item={dish} onViewDetail={handleViewDetail} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-orange-500 via-[#B33A2B] to-red-700 text-white px-6 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/80 transition-all duration-300 active:scale-95 md:hover:scale-110 transform border-2 md:border-4 border-orange-400"
            >
              <span>Xem Toàn Bộ Thực Đơn</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-0 w-72 h-72 bg-[#B33A2B] rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10 lg:p-16 border-2 md:border-4 border-orange-200 relative overflow-hidden animate-fadeInUp">
              {/* Corner Decorations - Hidden on mobile */}
              <div className="hidden md:block absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#B33A2B] rounded-tl-3xl opacity-30"></div>
              <div className="hidden md:block absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#B33A2B] rounded-br-3xl opacity-30"></div>

              <div className="text-center mb-6 md:mb-8">
                <span className="inline-block bg-gradient-to-r from-[#B33A2B] to-orange-600 text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4 shadow-lg">
                  ⭐ VỀ CHÚNG TÔI ⭐
                </span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B33A2B] via-orange-600 to-red-700 mb-3 md:mb-4">
                  Câu Chuyện Của Chúng Tôi
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
              </div>

              <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg relative">
                <p className="pl-4 md:pl-6 border-l-2 md:border-l-4 border-[#B33A2B]">
                  <strong className="text-[#B33A2B] text-lg md:text-xl lg:text-2xl">
                    Bún Bò Huế Cố Đô
                  </strong>{" "}
                  được thành lập từ năm 2009, với mong muốn mang đến cho thực
                  khách những tô bún bò Huế chính gốc nhất, giữ trọn hương vị
                  truyền thống của xứ Huế mộng mơ.
                </p>
                <p className="pl-4 md:pl-6 border-l-2 md:border-l-4 border-orange-500">
                  🔥 Nước dùng được ninh từ xương ống bò trong hơn{" "}
                  <strong className="text-orange-600">8 tiếng đồng hồ</strong>,
                  kết hợp với sả tươi, mắm ruốc và sa tế đặc biệt tạo nên vị cay
                  nồng, đậm đà không thể nào quên.
                </p>
                <p className="pl-4 md:pl-6 border-l-2 md:border-l-4 border-red-600">
                  Với hơn{" "}
                  <strong className="text-[#B33A2B] text-base md:text-xl">
                    15 năm kinh nghiệm
                  </strong>{" "}
                  và{" "}
                  <strong className="text-orange-600 text-base md:text-xl">
                    50,000+ khách hàng hài lòng
                  </strong>
                  , chúng tôi tự hào là một trong những quán bún bò Huế được yêu
                  thích nhất tại thành phố. ⭐
                </p>
              </div>

              {/* Achievement Badges */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 mt-8 md:mt-12">
                <div className="text-center p-3 md:p-6 bg-gradient-to-br from-[#B33A2B] to-orange-600 rounded-xl md:rounded-2xl text-white shadow-xl active:scale-95 md:hover:scale-105 transition-transform">
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                    2009
                  </div>
                  <div className="text-[10px] md:text-sm">Năm Thành Lập</div>
                </div>
                <div className="text-center p-3 md:p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl md:rounded-2xl text-white shadow-xl active:scale-95 md:hover:scale-105 transition-transform">
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                    50K+
                  </div>
                  <div className="text-[10px] md:text-sm">Khách Hàng</div>
                </div>
                <div className="text-center p-3 md:p-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl md:rounded-2xl text-white shadow-xl active:scale-95 md:hover:scale-105 transition-transform">
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                    ⭐ 4.8
                  </div>
                  <div className="text-[10px] md:text-sm">Đánh Giá TB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
