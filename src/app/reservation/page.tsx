import BookingForm from "@/components/BookingForm";
import FloatingCart from "@/components/FloatingCart";

export default function ReservationPage() {
  return (
    <>
      <FloatingCart />
      <div className="py-12 bg-gradient-to-br from-hue-cream to-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl font-bold text-hue-redDark mb-4">
              Đặt Bàn Trước
            </h1>
            <p className="text-gray-600 text-lg">
              Đảm bảo có chỗ ngồi cho bạn và gia đình
            </p>
          </div>

          <BookingForm />

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-bold text-lg mb-2">Xác Nhận Nhanh</h3>
              <p className="text-gray-600 text-sm">
                Chúng tôi sẽ xác nhận đặt bàn trong vòng 15 phút
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-lg mb-2">Miễn Phí Đặt Bàn</h3>
              <p className="text-gray-600 text-sm">
                Không tính phí đặt bàn trước
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">🍜</div>
              <h3 className="font-bold text-lg mb-2">Ưu Đãi Đặc Biệt</h3>
              <p className="text-gray-600 text-sm">
                Nhận voucher 10% cho lần đặt bàn đầu tiên
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
