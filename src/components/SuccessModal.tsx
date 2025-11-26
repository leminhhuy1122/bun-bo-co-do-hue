// src/components/SuccessModal.tsx - Modal thông báo thành công
"use client";

import {
  CheckCircle,
  X,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "order" | "reservation";
  data: {
    orderNumber?: string;
    reservationNumber?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    date?: string;
    time?: string;
    guests?: number;
    total?: number;
    items?: number;
  };
}

export default function SuccessModal({
  isOpen,
  onClose,
  type,
  data,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-[scale-in_0.3s_ease-out]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
        >
          <X size={20} />
        </button>

        {/* Success Icon */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-[bounce_0.6s_ease-in-out]">
            <CheckCircle size={48} className="text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {type === "order"
              ? "✅ Đặt Món Thành Công!"
              : "🎉 Đặt Bàn Thành Công!"}
          </h2>

          <p className="text-gray-600 text-center">
            {type === "order"
              ? "Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ chuẩn bị món ngay!"
              : "Bàn của bạn đã được đặt. Chúng tôi rất mong được phục vụ bạn!"}
          </p>
        </div>

        {/* Order/Reservation Details */}
        <div className="bg-gradient-to-br from-hue-red/5 to-hue-gold/5 px-6 py-4 space-y-3">
          {/* Order/Reservation Number */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-hue-red/10 rounded-lg flex items-center justify-center">
              {type === "order" ? (
                <Package size={20} className="text-hue-red" />
              ) : (
                <Calendar size={20} className="text-hue-red" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">
                {type === "order" ? "Mã đơn hàng" : "Mã đặt bàn"}
              </p>
              <p className="text-lg font-bold text-hue-red">
                {type === "order" ? data.orderNumber : data.reservationNumber}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">👤</span>
              <span className="font-medium">{data.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-gray-500" />
              <span className="text-gray-700">{data.customerPhone}</span>
            </div>
            {data.customerEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-gray-500" />
                <span className="text-gray-700">{data.customerEmail}</span>
              </div>
            )}
          </div>

          {/* Order Specific Info */}
          {type === "order" && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Số món</p>
                <p className="text-lg font-bold text-gray-900">{data.items}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tổng tiền</p>
                <p className="text-lg font-bold text-hue-red">
                  {new Intl.NumberFormat("vi-VN").format(data.total || 0)}đ
                </p>
              </div>
            </div>
          )}

          {/* Reservation Specific Info */}
          {type === "reservation" && (
            <div className="space-y-2 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-gray-700">
                  {data.date} - {data.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">👥</span>
                <span className="text-gray-700">{data.guests} người</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          {type === "order" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-800 font-medium mb-1">
                📱 Nhận thông báo qua SMS
              </p>
              <p className="text-blue-600 text-xs">
                Chúng tôi sẽ gửi thông báo về tình trạng đơn hàng qua số điện
                thoại của bạn
              </p>
            </div>
          )}

          {type === "reservation" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
              <p className="text-amber-800 font-medium mb-1">
                ⏰ Nhắc nhở trước 1 giờ
              </p>
              <p className="text-amber-600 text-xs">
                Chúng tôi sẽ nhắc bạn trước 1 giờ để đảm bảo bạn không bỏ lỡ đặt
                bàn
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-hue-red to-hue-gold text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition shadow-lg"
          >
            Đóng
          </button>

          <p className="text-center text-xs text-gray-500">
            Cảm ơn bạn đã tin tưởng Bún Bò Huế Cố Đô! ❤️
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
