"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import promosData from "@/data/promos.json";
import { Coupon } from "@/types";
import CouponInput from "@/components/CouponInput";
import SuccessModal from "@/components/SuccessModal";
import Toast from "@/components/Toast";

export default function CheckoutPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    getDiscount,
    getFinalTotal,
    clearCart,
  } = useCart();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank" | "momo">(
    "cash"
  );
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItemsCount, setOrderItemsCount] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const coupons = promosData as Coupon[];

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setToast({ message, type });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleApplyCoupon = async (code?: string) => {
    const codeToValidate = code || couponCode;

    if (!codeToValidate.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá");
      showToast("Vui lòng nhập mã giảm giá!", "warning");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      // Call API to validate coupon from database
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToValidate.toUpperCase(),
          orderAmount: getCartTotal(),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setCouponError(data.error || "Không thể kiểm tra mã giảm giá");
        showToast(data.error || "Có lỗi xảy ra!", "error");
        return;
      }

      if (!data.valid) {
        setCouponError(data.message || "Mã giảm giá không hợp lệ");
        showToast(data.message || "Mã giảm giá không hợp lệ!", "error");
        return;
      }

      // Apply coupon with validated discount
      const validatedCoupon: Coupon = {
        code: codeToValidate.toUpperCase(),
        description: data.message || "Mã giảm giá hợp lệ",
        discountType: "fixed", // Server returns calculated discount
        discountValue: data.discount,
        minOrderValue: 0,
        expiryDate: "",
      };

      applyCoupon(validatedCoupon);
      setCouponCode(codeToValidate.toUpperCase());
      setCouponError("");
      showToast(`✅ ${data.message}`, "success");
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponError("Không thể kiểm tra mã giảm giá");
      showToast("Có lỗi xảy ra khi kiểm tra mã!", "error");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (cart.length === 0) {
      showToast("Giỏ hàng trống!", "error");
      return;
    }

    if (!customerInfo.name.trim()) {
      showToast("Vui lòng nhập họ tên!", "warning");
      return;
    }

    if (!customerInfo.phone.trim()) {
      showToast("Vui lòng nhập số điện thoại!", "warning");
      return;
    }

    // Validate phone (10-11 digits)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      showToast("Số điện thoại không hợp lệ! (10-11 số)", "error");
      return;
    }

    // Validate email if provided
    if (
      customerInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
    ) {
      showToast("Email không hợp lệ!", "error");
      return;
    }

    // Generate order number
    const generatedOrderNumber = `ORD${Date.now()}${Math.floor(
      Math.random() * 1000
    )}`;
    setOrderNumber(generatedOrderNumber);

    // Save order to database
    try {
      const orderData = {
        orderNumber: generatedOrderNumber,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        customerAddress: customerInfo.address,
        paymentMethod,
        items: cart.map((item) => ({
          menuItemId: item.menuItem.id,
          menuItemName: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.price,
          toppings: item.toppings || [],
          note: item.note || "",
        })),
        subtotal: getCartTotal(),
        discount: appliedCoupon
          ? appliedCoupon.discountType === "percentage"
            ? (getCartTotal() * appliedCoupon.discountValue) / 100
            : appliedCoupon.discountValue
          : 0,
        total: getFinalTotal(),
        couponCode: appliedCoupon?.code || null,
      };

      console.log("📤 Sending order to API:", orderData);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("📥 Response status:", response.status);

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (data.success) {
        console.log("✅ Order created successfully:", data.data);
        // Save order info BEFORE clearing cart
        setOrderTotal(getFinalTotal());
        setOrderItemsCount(cart.length);
        setOrderPlaced(true);
        setShowSuccessModal(true);
        clearCart();
        showToast("Đặt hàng thành công!", "success");
      } else {
        console.error("❌ Order failed:", data.error);
        showToast(data.error || "Không thể đặt hàng", "error");
      }
    } catch (error) {
      console.error("❌ Order error:", error);
      showToast("Lỗi khi đặt hàng. Vui lòng thử lại!", "error");
    }
  };

  if (orderPlaced) {
    return (
      <>
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.push("/");
          }}
          type="order"
          data={{
            orderNumber: orderNumber,
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerEmail: customerInfo.email,
            total: orderTotal,
            items: orderItemsCount,
          }}
        />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hue-cream to-white p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-6xl">✓</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-hue-redDark mb-4">
              Đặt Hàng Thành Công!
            </h2>
            <p className="text-gray-600 mb-6">
              Mã đơn hàng:{" "}
              <strong className="text-hue-red">{orderNumber}</strong>
              <br />
              Cảm ơn bạn đã đặt hàng tại Bún Bò Huế Cố Đô!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-hue-red text-white py-3 rounded-xl font-bold hover:bg-hue-redDark transition"
              >
                Về Trang Chủ
              </button>
              <button
                onClick={() => router.push("/menu")}
                className="w-full bg-white border-2 border-hue-red text-hue-red py-3 rounded-xl font-bold hover:bg-hue-cream transition"
              >
                Đặt Thêm Món
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hue-cream to-white p-4">
          <div className="text-center">
            <div className="text-8xl mb-4">🍜</div>
            <h2 className="font-display text-3xl font-bold text-hue-redDark mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy thêm món vào giỏ hàng để tiếp tục
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="bg-hue-red text-white px-8 py-4 rounded-xl font-bold hover:bg-hue-redDark transition"
            >
              Xem Thực Đơn
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-br from-hue-cream to-white">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold text-hue-redDark mb-8 text-center">
          Thanh Toán
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-xl mb-4">
                Giỏ Hàng ({cart.length} món)
              </h2>
              <div className="space-y-4">
                {cart.map((item, index) => {
                  const itemTotal =
                    (item.menuItem.price +
                      item.toppings.reduce((sum, t) => sum + t.price, 0)) *
                    item.quantity;
                  return (
                    <div
                      key={index}
                      className="flex gap-4 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={
                          item.menuItem.image ||
                          "https://via.placeholder.com/100"
                        }
                        alt={item.menuItem.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-hue-redDark">
                          {item.menuItem.name}
                        </h3>
                        {item.toppings.length > 0 && (
                          <p className="text-sm text-gray-600">
                            + {item.toppings.map((t) => t.name).join(", ")}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-sm text-gray-500 italic">
                            Ghi chú: {item.note}
                          </p>
                        )}
                        <p className="text-hue-red font-bold mt-1">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-hue-red text-white hover:bg-hue-redDark flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-xl mb-4">Thông Tin Khách Hàng</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <input
                  type="text"
                  placeholder="Họ và tên *"
                  required
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại *"
                  required
                  pattern="[0-9]{10}"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none"
                />
                <textarea
                  placeholder="Địa chỉ giao hàng *"
                  required
                  rows={3}
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none"
                />
                <textarea
                  placeholder="Ghi chú (không bắt buộc)"
                  rows={2}
                  value={customerInfo.note}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, note: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-hue-red outline-none"
                />
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="font-bold text-xl mb-4">Tổng Đơn Hàng</h2>

              {/* Coupon - Enhanced Component */}
              <CouponInput
                onApplyCoupon={handleApplyCoupon}
                appliedCoupon={appliedCoupon}
                onRemoveCoupon={() => {
                  removeCoupon();
                  setCouponCode("");
                  setCouponError("");
                }}
                error={couponError}
                isValidating={isValidatingCoupon}
              />

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Phương Thức Thanh Toán
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <Banknote size={20} className="text-gray-600" />
                    <span>Tiền mặt khi nhận hàng</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <CreditCard size={20} className="text-gray-600" />
                    <span>Chuyển khoản ngân hàng</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <Smartphone size={20} className="text-gray-600" />
                    <span>Ví MoMo</span>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-semibold">
                      -{formatPrice(getDiscount())}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-hue-red border-t pt-3">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(getFinalTotal())}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-hue-red text-white py-4 rounded-xl font-bold text-lg hover:bg-hue-redDark transition mt-6 shadow-lg hover:shadow-xl"
              >
                Đặt Hàng Ngay
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng
              </p>
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
