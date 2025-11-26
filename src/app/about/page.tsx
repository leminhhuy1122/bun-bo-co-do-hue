export default function AboutPage() {
  return (
    <div className="py-12 bg-gradient-to-br from-hue-cream to-white">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-hue-redDark mb-6">
            Về Bún Bò Huế Cố Đô
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Câu chuyện về hương vị truyền thống và niềm đam mê ẩm thực Huế
          </p>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <img
              src="/images/nha-hang-bun-bo.jpg"
              alt="Restaurant"
              className="w-full h-80 object-cover"
            />
            <div className="p-12">
              <h2 className="font-display text-3xl font-bold text-hue-redDark mb-6">
                Khởi Nguồn Từ Niềm Đam Mê
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Ra đời từ năm <strong className="text-hue-red">2009</strong>,
                  Bún Bò Huế Cố Đô được thành lập bởi đầu bếp Nguyễn Văn Minh -
                  người có hơn 20 năm kinh nghiệm trong nghệ thuật nấu nướng món
                  ăn Huế truyền thống.
                </p>
                <p>
                  Với mong muốn mang hương vị chính gốc của xứ Huế đến với thực
                  khách, chúng tôi không ngừng nghiên cứu và cải tiến công thức
                  nấu nước dùng, từ việc lựa chọn xương ống bò tươi ngon nhất,
                  cho đến cách chế biến sa tế và mắm ruốc theo đúng bí quyết gia
                  truyền.
                </p>
                <p>
                  Sau <strong className="text-hue-red">15 năm</strong> hoạt
                  động, chúng tôi tự hào đã phục vụ hơn{" "}
                  <strong className="text-hue-red">50,000 khách hàng</strong>
                  với hơn{" "}
                  <strong className="text-hue-red">200,000 tô bún</strong> được
                  bán ra mỗi năm.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-display text-4xl font-bold text-hue-redDark text-center mb-12">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="font-bold text-2xl text-hue-redDark mb-4">
                Chất Lượng
              </h3>
              <p className="text-gray-600">
                Nguyên liệu tươi mới mỗi ngày, quy trình chế biến nghiêm ngặt,
                đảm bảo hương vị đúng chuẩn Huế xưa.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="font-bold text-2xl text-hue-redDark mb-4">
                Tâm Huyết
              </h3>
              <p className="text-gray-600">
                Mỗi tô bún được nấu bằng cả tấm lòng, như cách chúng tôi phục vụ
                gia đình mình.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="font-bold text-2xl text-hue-redDark mb-4">
                Truyền Thống
              </h3>
              <p className="text-gray-600">
                Giữ gìn và phát huy bản sắc ẩm thực Huế, mang đến trải nghiệm ẩm
                thực chân thực nhất.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="font-display text-4xl font-bold text-hue-redDark text-center mb-12">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Nguyễn Văn Minh", role: "Đầu Bếp Trưởng", emoji: "👨‍🍳" },
              { name: "Trần Thị Lan", role: "Quản Lý Nhà Hàng", emoji: "👩‍💼" },
              { name: "Lê Văn Hùng", role: "Đầu Bếp Phó", emoji: "👨‍🍳" },
              { name: "Phạm Thị Hoa", role: "Bếp Trưởng Ca", emoji: "👩‍🍳" },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
              >
                <div className="text-6xl mb-3">{member.emoji}</div>
                <h3 className="font-bold text-lg text-hue-redDark">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-hue-red to-hue-redDark text-white rounded-3xl shadow-2xl p-12">
          <h2 className="font-display text-4xl font-bold text-center mb-12">
            Thành Tích Của Chúng Tôi
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-hue-gold mb-2">15+</div>
              <div className="text-hue-cream">Năm Kinh Nghiệm</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-hue-gold mb-2">50K+</div>
              <div className="text-hue-cream">Khách Hàng Hài Lòng</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-hue-gold mb-2">200K+</div>
              <div className="text-hue-cream">Tô Bún/Năm</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-hue-gold mb-2">
                ⭐ 4.8
              </div>
              <div className="text-hue-cream">Đánh Giá Trung Bình</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
