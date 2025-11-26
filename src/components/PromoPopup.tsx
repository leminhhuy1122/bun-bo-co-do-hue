"use client";

import { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";
import Toast from "./Toast";

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("promoPopupSeen");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("promoPopupSeen", "true");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setToast({ message: `Đã sao chép mã: ${code}`, type: "success" });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl transform animate-scaleIn">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-hue-red transition z-10"
          >
            <X size={28} />
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-hue-red to-hue-redDark text-white p-8 rounded-t-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="font-display text-3xl font-bold mb-2">
                Chào Mừng!
              </h2>
              <p className="text-hue-cream">Ưu đãi đặc biệt dành cho bạn</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            {/* Promo 1 */}
            <div
              className="border-2 border-hue-gold rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleCopyCode("WELCOME2024")}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-hue-red">
                  <Tag size={20} />
                  <span className="font-bold text-lg">WELCOME2024</span>
                </div>
                <span className="bg-hue-gold text-hue-redDark px-3 py-1 rounded-full text-sm font-bold">
                  -20%
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Giảm 20% cho khách hàng mới (đơn từ 100K)
              </p>
            </div>

            {/* Promo 2 */}
            <div
              className="border-2 border-hue-gold rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleCopyCode("COMBO50K")}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-hue-red">
                  <Tag size={20} />
                  <span className="font-bold text-lg">COMBO50K</span>
                </div>
                <span className="bg-hue-gold text-hue-redDark px-3 py-1 rounded-full text-sm font-bold">
                  -50K
                </span>
              </div>
              <p className="text-gray-600 text-sm">Giảm 50K cho đơn từ 200K</p>
            </div>

            {/* Promo 3 */}
            <div
              className="border-2 border-hue-gold rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleCopyCode("HAPPYHOUR")}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-hue-red">
                  <Tag size={20} />
                  <span className="font-bold text-lg">HAPPYHOUR</span>
                </div>
                <span className="bg-hue-gold text-hue-redDark px-3 py-1 rounded-full text-sm font-bold">
                  -15%
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Giảm 15% từ 14h-16h (đơn từ 50K)
              </p>
            </div>

            <p className="text-center text-sm text-gray-500 pt-4">
              👆 Click vào mã để sao chép
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
