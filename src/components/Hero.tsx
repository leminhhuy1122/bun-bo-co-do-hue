"use client";

import Link from "next/link";
import { Flame, Star, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#B33A2B] via-[#8B2A1F] to-black text-white overflow-hidden min-h-[85vh] md:min-h-[90vh] lg:min-h-screen flex items-center">
      {/* Animated Background Pattern - Vietnamese Traditional Design */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 4c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6z'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='70' cy='10' r='2'/%3E%3Ccircle cx='10' cy='70' r='2'/%3E%3Ccircle cx='70' cy='70' r='2'/%3E%3Cpath d='M40 0v8m0 64v8M0 40h8m64 0h8'/%3E%3Cpath d='M14 14l5.657 5.657M60.343 14L54.686 19.657M14 66l5.657-5.657M60.343 66L54.686 60.343' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Floating Decorative Elements - Hidden on mobile */}
      <div className="hidden lg:block absolute top-20 left-10 animate-float">
        <Flame className="text-orange-400" size={40} />
      </div>
      <div
        className="hidden lg:block absolute top-40 right-20 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <Star className="text-yellow-400" size={30} />
      </div>
      <div
        className="hidden lg:block absolute bottom-32 left-20 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <Sparkles className="text-orange-300" size={35} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-16 lg:py-20 relative z-10">
        {/* MOBILE LAYOUT: Title → Image → Buttons */}
        <div className="md:hidden">
          {/* Title First on Mobile */}
          <div className="text-center mb-4">
            <h1 className="font-display text-3xl xs:text-4xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] filter brightness-110">
                Bún Bò Huế
              </span>
              <span className="block text-2xl xs:text-3xl mt-2 text-yellow-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] filter brightness-125">
                ⭐ Cố Đô ⭐
              </span>
            </h1>
          </div>

          {/* Image Second on Mobile */}
          <div className="relative animate-slideInRight mb-4">
            {/* Glow Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl blur-2xl opacity-30 animate-pulse"></div>

            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl shadow-orange-500/50 border-2 border-orange-400/30">
              <img
                src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop"
                alt="Bún Bò Huế"
                className="w-full h-[40vh] object-cover"
              />
              {/* Steam effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#B33A2B] via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Floating badges - Mobile */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-white to-orange-100 text-[#B33A2B] p-2.5 rounded-xl shadow-2xl shadow-orange-500/50 z-20 animate-float border-2 border-orange-400">
              <div className="text-xl font-bold">79K</div>
              <div className="text-[9px] font-semibold">Chỉ từ</div>
            </div>

            <div
              className="absolute -bottom-2 -left-2 bg-gradient-to-br from-orange-500 to-red-600 text-white p-2.5 rounded-xl shadow-2xl shadow-red-500/50 z-20 animate-float border-2 border-yellow-400"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-xs font-bold flex items-center gap-1">
                🍜 <span className="hidden xs:inline">Đặc sản Huế</span>
                <span className="xs:hidden">Huế</span>
              </div>
            </div>
          </div>

          {/* Buttons Below Image on Mobile */}
          <div className="text-center space-y-3">
            {/* Buttons - Small & Side by Side on Mobile */}
            <div className="flex gap-2 justify-center px-4">
              <Link
                href="/menu"
                className="flex-1 max-w-[160px] group relative bg-gradient-to-r from-[#B33A2B] to-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-xl hover:shadow-orange-500/50 transition-all duration-300 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  🍜 Thực Đơn
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-[#B33A2B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/reservation"
                className="flex-1 max-w-[160px] group bg-white text-[#B33A2B] px-4 py-2.5 rounded-lg font-semibold text-sm shadow-xl hover:shadow-white/50 transition-all duration-300 active:scale-95 border-2 border-white"
              >
                <span className="flex items-center justify-center gap-1.5">
                  ✨ Đặt Bàn
                </span>
              </Link>
            </div>

            {/* Stats - Mobile Compact */}
            <div className="grid grid-cols-3 gap-2 pt-3 px-2">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg py-2">
                <div className="text-lg font-bold text-yellow-300">15+</div>
                <div className="text-[9px] text-gray-300">Năm</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg py-2">
                <div className="text-lg font-bold text-yellow-300">50K+</div>
                <div className="text-[9px] text-gray-300">Khách</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg py-2">
                <div className="text-lg font-bold text-yellow-300">⭐ 4.8</div>
                <div className="text-[9px] text-gray-300">Đánh giá</div>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT: Original 2-Column Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6 lg:space-y-8 animate-slideInLeft text-center md:text-left">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-glow">
              <Flame size={20} />
              <span className="whitespace-nowrap">
                Khuyến mãi HOT - Giảm 20%
              </span>
              <Flame size={20} />
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] filter brightness-110">
                Bún Bò Huế
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-2 text-yellow-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] filter brightness-125">
                ⭐ Cố Đô ⭐
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-100 leading-relaxed">
              🔥{" "}
              <strong className="text-orange-400">
                Hương vị truyền thống Huế xưa
              </strong>
              , giữ trọn tinh hoa ẩm thực cố đô.
              <br />
              Nước dùng đậm đà từ sả tắc, ớt sa tế cay nồng, thịt bò tươi ngon.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/menu"
                className="group relative bg-gradient-to-r from-[#B33A2B] to-orange-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 active:scale-95 md:hover:scale-105 transform overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🍜 Xem Thực Đơn
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-[#B33A2B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/reservation"
                className="group bg-white text-[#B33A2B] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 active:scale-95 md:hover:scale-105 transform border-3 border-white"
              >
                <span className="flex items-center justify-center gap-2">
                  ✨ Đặt Bàn Ngay
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-orange-500/30">
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  15+
                </div>
                <div className="text-sm text-gray-300 group-hover:text-orange-300 transition-colors mt-1">
                  Năm Kinh Nghiệm
                </div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  50K+
                </div>
                <div className="text-sm text-gray-300 group-hover:text-orange-300 transition-colors mt-1">
                  Khách Hàng
                </div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  ⭐ 4.8
                </div>
                <div className="text-sm text-gray-300 group-hover:text-orange-300 transition-colors mt-1">
                  Đánh Giá
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slideInRight">
            {/* Glow Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl md:rounded-3xl blur-3xl opacity-30 animate-pulse"></div>

            <div className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/50 transform hover:scale-105 md:hover:rotate-1 transition-all duration-500 border-3 lg:border-4 border-orange-400/30">
              <img
                src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop"
                alt="Bún Bò Huế"
                className="w-full h-[380px] lg:h-[480px] object-cover"
              />
              {/* Steam effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#B33A2B] via-transparent to-transparent opacity-60"></div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-all duration-1000"></div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-white to-orange-100 text-[#B33A2B] p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-2xl shadow-orange-500/50 z-20 animate-float border-3 lg:border-4 border-orange-400">
              <div className="text-3xl lg:text-4xl font-bold">79K</div>
              <div className="text-xs font-semibold">Chỉ từ</div>
            </div>

            <div
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-orange-500 to-red-600 text-white p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-2xl shadow-red-500/50 z-20 animate-float border-3 lg:border-4 border-yellow-400"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-base lg:text-lg font-bold flex items-center gap-2">
                🍜 <span>Đặc sản Huế</span>
              </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-20 h-20 border-t-4 border-l-4 border-yellow-400 rounded-tl-3xl opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-20 h-20 border-b-4 border-r-4 border-yellow-400 rounded-br-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
