"use client";

import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-hue-redDark text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4 text-hue-gold">
              Bún Bò Huế Cố Đô
            </h3>
            <p className="text-gray-300 mb-4">
              Hương vị truyền thống Huế xưa, giữ trọn tinh hoa ẩm thực cố đô
              trong từng tô bún.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-hue-gold transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-hue-gold transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-hue-gold transition">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 text-hue-gold">
              Liên Hệ
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>123 Lê Duẩn, Thành phố Huế, Thừa Thiên Huế</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={20} />
                <a
                  href="tel:0234567890"
                  className="hover:text-hue-gold transition"
                >
                  0234.567.890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={20} />
                <a
                  href="mailto:info@bunbohuecoddo.vn"
                  className="hover:text-hue-gold transition"
                >
                  info@bunbohuecoddo.vn
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 text-hue-gold">
              Giờ Mở Cửa
            </h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Thứ 2 - Thứ 6:</span>
                <span className="font-semibold">6:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thứ 7 - Chủ Nhật:</span>
                <span className="font-semibold">5:30 - 23:00</span>
              </div>
              <div className="mt-4 p-3 bg-hue-red rounded-lg">
                <p className="text-sm">
                  🎉 Happy Hour: Giảm 15% từ 14:00 - 16:00 mỗi ngày!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-hue-red mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Bún Bò Huế Cố Đô. Designed with ❤️ in Huế</p>
        </div>
      </div>
    </footer>
  );
}
