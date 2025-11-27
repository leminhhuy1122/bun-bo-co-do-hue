"use client";

import { useState } from "react";
import { Reservation } from "@/types";
import {
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import SuccessModal from "./SuccessModal";
import Toast from "./Toast";

export default function BookingForm() {
  const [formData, setFormData] = useState<Reservation>({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: 2,
    note: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationNumber, setReservationNumber] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showToast("Vui lòng nhập họ tên!", "warning");
      return;
    }

    if (!formData.phone.trim()) {
      showToast("Vui lòng nhập số điện thoại!", "warning");
      return;
    }

    // Validate phone (10-11 digits)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      showToast("Số điện thoại không hợp lệ! (10-11 số)", "error");
      return;
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast("Email không hợp lệ!", "error");
      return;
    }

    if (!formData.date) {
      showToast("Vui lòng chọn ngày!", "warning");
      return;
    }

    if (!formData.time) {
      showToast("Vui lòng chọn giờ!", "warning");
      return;
    }

    // Check if date is in the past
    const selectedDate = new Date(formData.date + "T" + formData.time);
    const now = new Date();
    if (selectedDate < now) {
      showToast("Vui lòng chọn ngày giờ trong tương lai!", "error");
      return;
    }

    if (formData.guests < 1 || formData.guests > 50) {
      showToast("Số người phải từ 1 đến 50!", "error");
      return;
    }

    // Generate reservation number
    const generatedResNumber = `RES${Date.now()}${Math.floor(
      Math.random() * 1000
    )}`;
    setReservationNumber(generatedResNumber);

    // Here you would send data to backend
    console.log("Reservation:", {
      reservationNumber: generatedResNumber,
      ...formData,
    });

    // Call API to save reservation
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email || null,
          reservation_date: formData.date,
          reservation_time: formData.time,
          number_of_guests: formData.guests,
          special_requests: formData.note || null,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Đặt bàn thất bại");
      }

      // Update with server's reservation number
      setReservationNumber(result.data.reservationNumber);
      setSubmitted(true);
      setShowSuccessModal(true);
      showToast(
        "Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận sớm.",
        "success"
      );
    } catch (error: any) {
      showToast(error.message || "Có lỗi xảy ra khi đặt bàn!", "error");
      console.error("Reservation error:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) : value,
    }));
  };

  if (submitted) {
    return (
      <>
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setSubmitted(false);
            setFormData({
              name: "",
              phone: "",
              email: "",
              date: "",
              time: "",
              guests: 2,
              note: "",
            });
          }}
          type="reservation"
          data={{
            reservationNumber: reservationNumber,
            customerName: formData.name,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            date: new Date(formData.date).toLocaleDateString("vi-VN"),
            time: formData.time,
            guests: formData.guests,
          }}
        />
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-hue-redDark mb-4">
            Đặt bàn thành công!
          </h2>
          <p className="text-gray-600 mb-2">
            Mã đặt bàn:{" "}
            <strong className="text-hue-red">{reservationNumber}</strong>
          </p>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt bàn tại Bún Bò Huế Cố Đô!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-hue-redDark mb-1.5 sm:mb-2 text-center">
          Đặt Bàn
        </h2>
        <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
          Vui lòng điền thông tin để đặt bàn trước
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <User className="inline mr-1.5 sm:mr-2" size={14} />
              Họ và Tên *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:border-hue-red outline-none transition"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <Phone className="inline mr-1.5 sm:mr-2" size={14} />
              Số Điện Thoại *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10,11}"
              title="Vui lòng nhập 10-11 chữ số"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:border-hue-red outline-none transition"
              placeholder="0912345678"
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Nhập 10-11 chữ số
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <Mail className="inline mr-1.5 sm:mr-2" size={14} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:border-hue-red outline-none transition"
              placeholder="email@example.com"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <Calendar className="inline mr-1.5 sm:mr-2" size={14} />
                Ngày *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:border-hue-red outline-none transition"
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Chọn ngày từ hôm nay trở đi
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <Clock className="inline mr-1.5 sm:mr-2" size={14} />
                Giờ *
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                list="time-suggestions"
                placeholder="Chọn giờ"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:border-hue-red outline-none transition"
              />
              <datalist id="time-suggestions">
                <option value="07:00" />
                <option value="08:00" />
                <option value="09:00" />
                <option value="10:00" />
                <option value="11:00" />
                <option value="12:00" />
                <option value="13:00" />
                <option value="14:00" />
                <option value="15:00" />
                <option value="16:00" />
                <option value="17:00" />
                <option value="18:00" />
                <option value="19:00" />
                <option value="20:00" />
                <option value="21:00" />
                <option value="22:00" />
              </datalist>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Giờ mở cửa: 7:00 - 22:00
              </p>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <Users className="inline mr-1.5 sm:mr-2" size={14} />
              Số Người *
            </label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              min="1"
              max="50"
              list="guests-suggestions"
              placeholder="2 người"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:border-hue-red outline-none transition"
            />
            <datalist id="guests-suggestions">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50].map(
                (num) => (
                  <option key={num} value={num} />
                )
              )}
            </datalist>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Đặt bàn cho nhóm lớn (&gt;20 người), vui lòng gọi trực tiếp:
              0901234567
            </p>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              <MessageSquare className="inline mr-1.5 sm:mr-2" size={14} />
              Ghi Chú
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:border-hue-red outline-none transition"
              placeholder="Yêu cầu đặc biệt (ví dụ: bàn gần cửa sổ, có ghế cho trẻ em...)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-hue-red text-white py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-hue-redDark transition shadow-lg hover:shadow-xl active:scale-95"
          >
            Đặt Bàn Ngay
          </button>

          <p className="text-xs sm:text-sm text-gray-500 text-center">
            * Bắt buộc | Chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút
          </p>
        </form>
      </div>
    </>
  );
}
