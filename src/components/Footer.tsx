"use client";

import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-hue-redDark text-white mt-12 sm:mt-16 md:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-hue-gold">
              Bún Bò Huế Cố Đô
            </h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Hương vị truyền thống Huế xưa, giữ trọn tinh hoa ẩm thực cố đô
              trong từng tô bún.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="#"
                className="hover:text-hue-gold transition p-2 hover:scale-110 active:scale-95"
              >
                <Facebook size={20} className="sm:hidden" />
                <Facebook size={24} className="hidden sm:block" />
              </a>
              <a
                href="#"
                className="hover:text-hue-gold transition p-2 hover:scale-110 active:scale-95"
              >
                <Instagram size={20} className="sm:hidden" />
                <Instagram size={24} className="hidden sm:block" />
              </a>
              <a
                href="#"
                className="hover:text-hue-gold transition p-2 hover:scale-110 active:scale-95"
              >
                <Mail size={20} className="sm:hidden" />
                <Mail size={24} className="hidden sm:block" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-hue-gold">
              Liên Hệ
            </h3>
            <div className="space-y-2.5 sm:space-y-3 text-gray-300 text-sm sm:text-base">
              <div className="flex items-start gap-2">
                <MapPin
                  size={18}
                  className="mt-0.5 sm:mt-1 flex-shrink-0 sm:hidden"
                />
                <MapPin
                  size={20}
                  className="mt-0.5 sm:mt-1 flex-shrink-0 hidden sm:block"
                />
                <span>123 Lê Duẩn, Thành phố Huế, Thừa Thiên Huế</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="sm:hidden flex-shrink-0" />
                <Phone size={20} className="hidden sm:block flex-shrink-0" />
                <a
                  href="tel:0234567890"
                  className="hover:text-hue-gold transition"
                >
                  0234.567.890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="sm:hidden flex-shrink-0" />
                <Mail size={20} className="hidden sm:block flex-shrink-0" />
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
            <h3 className="font-display text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-hue-gold">
              Giờ Mở Cửa
            </h3>
            <div className="space-y-2 text-gray-300 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>Thứ 2 - Thứ 6:</span>
                <span className="font-semibold">6:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thứ 7 - Chủ Nhật:</span>
                <span className="font-semibold">5:30 - 23:00</span>
              </div>
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-hue-red rounded-lg">
                <p className="text-xs sm:text-sm">
                  🎉 Happy Hour: Giảm 15% từ 14:00 - 16:00 mỗi ngày!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-hue-red mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 Bún Bò Huế Cố Đô. Designed with ❤️ in Huế</p>
        </div>
      </div>
    </footer>
  );
}
