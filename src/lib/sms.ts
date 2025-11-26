// SMS Service - Tích hợp với các nhà cung cấp SMS như Twilio, SMSAPI, Viettel SMS, etc.

interface SMSConfig {
  provider: "twilio" | "viettel" | "vnpt" | "esms" | "speedsms";
  accountSid?: string;
  authToken?: string;
  apiKey?: string;
  secretKey?: string;
  brandName?: string;
}

interface SMSMessage {
  to: string; // Số điện thoại
  message: string;
  type?: "otp" | "notification" | "marketing";
}

// Cấu hình SMS (trong thực tế nên lưu trong biến môi trường)
const SMS_CONFIG: SMSConfig = {
  provider: "esms", // Sử dụng eSMS - popular ở VN
  apiKey: process.env.ESMS_API_KEY || "YOUR_API_KEY",
  secretKey: process.env.ESMS_SECRET_KEY || "YOUR_SECRET_KEY",
  brandName: process.env.SMS_BRAND_NAME || "Baotrixemay",
};

/**
 * Gửi SMS thông báo đơn hàng
 */
export async function sendOrderStatusSMS(
  phoneNumber: string,
  orderNumber: string,
  status: string,
  customerName: string
): Promise<{
  success: boolean;
  message: string;
  messageContent?: string;
  messageId?: string;
}> {
  try {
    // Validate số điện thoại
    if (!isValidVietnamesePhone(phoneNumber)) {
      return {
        success: false,
        message: "Số điện thoại không hợp lệ",
      };
    }

    // Format số điện thoại
    const phone = formatPhoneNumber(phoneNumber);

    // Tạo nội dung SMS theo trạng thái
    const messageContent = generateOrderStatusMessage(
      orderNumber,
      status,
      customerName
    );

    // Gửi SMS
    const result = await sendSMS({
      to: phone,
      message: messageContent,
      type: "notification",
    });

    console.log("📱 SMS sent:", { phone, status, messageId: result.messageId });

    return {
      success: true,
      message: result.simulated
        ? "SMS simulation mode"
        : "Đã gửi SMS thông báo",
      messageContent,
      messageId: result.messageId,
    };
  } catch (error: any) {
    console.error("❌ SMS Error:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi gửi SMS",
    };
  }
}

/**
 * Gửi SMS xác nhận đặt hàng
 */
export async function sendOrderConfirmationSMS(
  phoneNumber: string,
  orderNumber: string,
  totalAmount: number,
  customerName: string
): Promise<{ success: boolean; message: string }> {
  try {
    const phone = formatPhoneNumber(phoneNumber);
    const amount = new Intl.NumberFormat("vi-VN").format(totalAmount);

    const message = `Xin chao ${customerName}! Don hang ${orderNumber} cua ban da duoc dat thanh cong. Tong tien: ${amount}d. Cam on ban da dat hang tai Bun Bo Hue Co Do!`;

    await sendSMS({
      to: phone,
      message,
      type: "notification",
    });

    return {
      success: true,
      message: "Đã gửi SMS xác nhận đơn hàng",
    };
  } catch (error: any) {
    console.error("❌ SMS Error:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi gửi SMS",
    };
  }
}

/**
 * Gửi SMS thông báo đặt bàn
 */
export async function sendReservationSMS(
  phoneNumber: string,
  customerName: string,
  date: string,
  time: string,
  guests: number
): Promise<{ success: boolean; message: string }> {
  try {
    const phone = formatPhoneNumber(phoneNumber);

    const message = `Xin chao ${customerName}! Dat ban cua ban tai Bun Bo Hue Co Do da duoc xac nhan. Ngay: ${date}, Gio: ${time}, So nguoi: ${guests}. Cam on!`;

    await sendSMS({
      to: phone,
      message,
      type: "notification",
    });

    return {
      success: true,
      message: "Đã gửi SMS xác nhận đặt bàn",
    };
  } catch (error: any) {
    console.error("❌ SMS Error:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi gửi SMS",
    };
  }
}

/**
 * Tạo nội dung SMS theo trạng thái đơn hàng
 */
function generateOrderStatusMessage(
  orderNumber: string,
  status: string,
  customerName: string
): string {
  const firstName = customerName.split(" ").pop() || customerName;

  const statusMessages: Record<string, string> = {
    pending: `[BBHCD] Xin chao ${firstName}! Don hang ${orderNumber} dang cho xac nhan. Chung toi se lien he ban som.`,
    confirmed: `[BBHCD] Don hang ${orderNumber} da xac nhan! Chung toi dang chuan bi mon an cho ban. Cam on ${firstName}!`,
    preparing: `[BBHCD] Don hang ${orderNumber} dang chuan bi. Mon an se som giao den ban!`,
    delivering: `[BBHCD] Don hang ${orderNumber} dang giao den ban. Vui long nhan may nhe!`,
    completed: `[BBHCD] Don hang ${orderNumber} da giao xong! Cam on ${firstName}. Hen gap lai!`,
    cancelled: `[BBHCD] Don hang ${orderNumber} da huy. Lien he: 0123456789 neu can ho tro.`,
  };

  return (
    statusMessages[status] ||
    `[BBHCD] Don hang ${orderNumber} cap nhat trang thai.`
  );
}

/**
 * Format số điện thoại (loại bỏ ký tự đặc biệt, thêm +84)
 */
function formatPhoneNumber(phone: string): string {
  // Loại bỏ tất cả ký tự không phải số
  let cleaned = phone.replace(/\D/g, "");

  // Nếu bắt đầu bằng 0, thay bằng 84
  if (cleaned.startsWith("0")) {
    cleaned = "84" + cleaned.slice(1);
  }

  // Thêm + nếu chưa có
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
}

/**
 * Gửi SMS qua nhà cung cấp
 */
async function sendSMS(data: SMSMessage): Promise<any> {
  // Kiểm tra nếu có API key thì gửi thật, không thì simulation
  const hasApiKey = SMS_CONFIG.apiKey && SMS_CONFIG.apiKey !== "YOUR_API_KEY";

  // Kiểm tra biến SMS_ENABLED để cho phép gửi SMS thật trong development
  const smsEnabled = process.env.SMS_ENABLED === "true";

  if (!hasApiKey) {
    console.log("📱 [SMS SIMULATION - Không có API Key]", {
      to: data.to,
      message: data.message,
      type: data.type,
      provider: SMS_CONFIG.provider,
      note: "Để gửi SMS thật, hãy thêm ESMS_API_KEY vào .env.local",
    });

    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      messageId: `SIM_${Date.now()}`,
      timestamp: new Date().toISOString(),
      simulated: true,
    };
  }

  if (!smsEnabled) {
    console.log("📱 [SMS SIMULATION - SMS_ENABLED=false]", {
      to: data.to,
      message: data.message,
      type: data.type,
      provider: SMS_CONFIG.provider,
      note: "Để gửi SMS thật, hãy set SMS_ENABLED=true trong .env.local",
    });

    // Giả lập delay của API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      messageId: `SIM_${Date.now()}`,
      timestamp: new Date().toISOString(),
      simulated: true,
    };
  }

  // GỬI SMS THẬT qua eSMS
  try {
    // Kiểm tra brandname hợp lệ (không rỗng và không phải giá trị mặc định)
    const hasBrandname =
      SMS_CONFIG.brandName &&
      SMS_CONFIG.brandName !== "" &&
      SMS_CONFIG.brandName !== "Baotrixemay";

    // SmsType: 2 = Không brandname (số ngẫu nhiên), 8 = Có brandname (CSKH)
    const smsType = hasBrandname ? 8 : 2;

    console.log("📱 [SENDING REAL SMS via eSMS]", {
      to: data.to,
      provider: SMS_CONFIG.provider,
      smsType,
      hasBrandname,
      brandname: hasBrandname ? SMS_CONFIG.brandName : "N/A",
    });

    const payload: any = {
      ApiKey: SMS_CONFIG.apiKey,
      SecretKey: SMS_CONFIG.secretKey,
      Phone: data.to,
      Content: data.message,
      SmsType: smsType,
    };

    // Chỉ thêm Brandname nếu có brandname hợp lệ và SmsType = 8
    if (hasBrandname && smsType === 8) {
      payload.Brandname = SMS_CONFIG.brandName;
    }

    const response = await fetch(
      "http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log("✅ SMS Response:", result);

    // eSMS response codes:
    // 100 = Success
    // 104 = Brandname không tồn tại hoặc chưa được duyệt
    // 99 = Lỗi hệ thống
    if (result.CodeResult === "100") {
      return {
        success: true,
        messageId: result.SMSID,
        timestamp: new Date().toISOString(),
        provider: "esms",
      };
    } else {
      const errorMessages: { [key: string]: string } = {
        "104":
          'Brandname chưa được duyệt hoặc không tồn tại. Vui lòng đăng ký brandname tại esms.vn hoặc set SMS_BRAND_NAME="" để gửi không brandname',
        "99": "Lỗi hệ thống eSMS",
        "101": "Tài khoản không đủ tiền",
        "102": "Tài khoản bị khóa",
      };
      const errorMsg =
        errorMessages[result.CodeResult] ||
        result.ErrorMessage ||
        `Lỗi mã ${result.CodeResult}`;
      throw new Error(`eSMS Error [${result.CodeResult}]: ${errorMsg}`);
    }
  } catch (error: any) {
    console.error("❌ SMS API Error:", error);
    throw error;
  }
}

/**
 * Kiểm tra tính hợp lệ của số điện thoại Việt Nam
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");

  // Số điện thoại VN: 10 số bắt đầu bằng 0, hoặc 11 số bắt đầu bằng 84
  const regex = /^(0|\+?84)(3|5|7|8|9)\d{8}$/;

  return regex.test(phone) || /^84(3|5|7|8|9)\d{8}$/.test(cleaned);
}

/**
 * Test SMS service
 */
export async function testSMSService(): Promise<void> {
  console.log("🧪 Testing SMS Service...");

  const testResult = await sendOrderStatusSMS(
    "0123456789",
    "DH001",
    "confirmed",
    "Nguyen Van A"
  );

  console.log("Test Result:", testResult);
}
