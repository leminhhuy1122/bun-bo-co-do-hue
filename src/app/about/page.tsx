import FloatingCart from "@/components/FloatingCart";

export default function AboutPage() {
  return (
    <>
      <FloatingCart />
      <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-hue-red to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ✨ Kể từ năm 2009
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold bg-gradient-to-r from-hue-redDark via-hue-red to-orange-600 bg-clip-text text-transparent mb-6 leading-tight">
              Bún Bò Huế Cố Đô
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Hành trình 16 năm giữ gìn tinh hoa ẩm thực cố đô Huế
            </p>
          </div>

          {/* Story - Redesigned with luxury style */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Image Side */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-hue-red to-orange-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/nha-hang-bun-bo.jpg"
                    alt="Restaurant"
                    className="w-full h-[400px] md:h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                      <p className="text-white font-bold text-lg">
                        "Hương vị chân thực từ cố đô Huế"
                      </p>
                      <p className="text-white/80 text-sm mt-1">
                        - Đầu bếp Nguyễn Văn Minh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className="space-y-6">
                <div>
                  <span className="text-hue-red font-semibold text-sm tracking-widest uppercase">
                    Câu Chuyện Của Chúng Tôi
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-hue-redDark mt-2 mb-4">
                    Khởi Nguồn Từ{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-hue-red to-orange-600">
                      Niềm Đam Mê
                    </span>
                  </h2>
                </div>

                <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-hue-red to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-hue-redDark mb-2">
                        Ra đời năm 2009
                      </h3>
                      <p className="text-gray-600">
                        Được sáng lập bởi đầu bếp Nguyễn Văn Minh với hơn 20 năm
                        kinh nghiệm trong nghệ thuật nấu nướng món ăn Huế truyền
                        thống.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-hue-redDark mb-2">
                        Công thức gia truyền
                      </h3>
                      <p className="text-gray-600">
                        Nước dùng được ninh từ{" "}
                        <strong className="text-hue-red">
                          8 tiếng đồng hồ
                        </strong>{" "}
                        với xương ống bò tươi ngon, kết hợp sa tế và mắm ruốc
                        đặc biệt tạo nên hương vị đậm đà khó quên.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-hue-redDark mb-2">
                        Thành tựu đáng tự hào
                      </h3>
                      <p className="text-gray-600">
                        Sau <strong className="text-hue-red">16 năm</strong>{" "}
                        hoạt động (2009-2025), chúng tôi tự hào đã phục vụ hơn{" "}
                        <strong className="text-hue-red">
                          50,000+ khách hàng
                        </strong>{" "}
                        với đánh giá{" "}
                        <strong className="text-hue-red">4.8/5 sao</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gradient-to-br from-hue-red to-orange-600 text-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-bold">2009</div>
                      <div className="text-xs mt-1 opacity-90">
                        Năm Thành Lập
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-bold">50K+</div>
                      <div className="text-xs mt-1 opacity-90">Khách Hàng</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-bold">⭐ 4.8</div>
                      <div className="text-xs mt-1 opacity-90">Đánh Giá TB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values - Modern luxury design */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="text-hue-red font-semibold text-sm tracking-widest uppercase">
                Điều Làm Nên Khác Biệt
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-hue-redDark mt-2">
                Giá Trị{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hue-red to-orange-600">
                  Cốt Lõi
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-hue-red">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    ☀️
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-hue-redDark mb-2 sm:mb-3 md:mb-4">
                    Chất Lượng
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                    Nguyên liệu tươi mới mỗi ngày, quy trình chế biến nghiêm
                    ngặt, đảm bảo hương vị đúng chuẩn Huế xưa.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-hue-red">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    💖
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-hue-redDark mb-2 sm:mb-3 md:mb-4">
                    Tâm Huyết
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                    Mỗi tô bún được nấu bằng cả tấm lòng, như cách chúng tôi
                    phục vụ gia đình mình.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-hue-red">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    🏛️
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-hue-redDark mb-2 sm:mb-3 md:mb-4">
                    Truyền Thống
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                    Giữ gìn và phát huy bản sắc ẩm thực Huế, mang đến trải
                    nghiệm ẩm thực chân thực nhất.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats - Redesigned without team section */}
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-hue-red via-orange-600 to-red-900"></div>
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
            <div className="relative p-12 md:p-16">
              <div className="text-center mb-12">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
                  🏆 Thành Tựu Đáng Tự Hào
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                  Hành Trình 16 Năm
                </h2>
                <p className="text-white/80 text-lg mt-3">2009 - 2025</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center max-w-5xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300 mb-2 sm:mb-3">
                    2009
                  </div>
                  <div className="text-white font-semibold text-sm sm:text-base md:text-lg">
                    Năm TL
                  </div>
                  <div className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">
                    16 năm KN
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300 mb-2 sm:mb-3">
                    50K+
                  </div>
                  <div className="text-white font-semibold text-sm sm:text-base md:text-lg">
                    Khách
                  </div>
                  <div className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">
                    Tin tưởng
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300 mb-2 sm:mb-3">
                    200K+
                  </div>
                  <div className="text-white font-semibold text-sm sm:text-base md:text-lg">
                    Tô bún
                  </div>
                  <div className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">
                    Mỗi năm
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300 mb-2 sm:mb-3">
                    ⭐ 4.8
                  </div>
                  <div className="text-white font-semibold text-sm sm:text-base md:text-lg">
                    Đánh giá
                  </div>
                  <div className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">
                    Trung bình
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
