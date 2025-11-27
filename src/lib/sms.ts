// SMS Service - Tích hợp với Infobip (Global SMS Platform)

interface SMSConfig {
  provider: "infobip" | "speedsms" | "esms";
  apiKey?: string; // Infobip API Key
  baseUrl?: string; // Infobip base URL
  from?: string; // Sender ID
  // Legacy configs
  accessToken?: string; // SpeedSMS
  secretKey?: string; // eSMS
  brandName?: string; // eSMS
}

interface SMSMessage {
  to: string; // Số điện thoại
  message: string;
  type?: "otp" | "notification" | "marketing";
}

// Cấu hình SMS (trong thực tế nên lưu trong biến môi trường)
const SMS_CONFIG: SMSConfig = {
  provider: (process.env.SMS_PROVIDER as any) || "infobip",
  apiKey: process.env.INFOBIP_API_KEY || "YOUR_API_KEY",
  baseUrl: process.env.INFOBIP_BASE_URL || "https://api.infobip.com",
  from: process.env.INFOBIP_SENDER || "InfoSMS", // Sender ID
  // Legacy configs (fallback)
  accessToken: process.env.SPEEDSMS_ACCESS_TOKEN,
  secretKey: process.env.ESMS_SECRET_KEY,
  brandName: process.env.SMS_BRAND_NAME || "",
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
 * Format số điện thoại cho các nhà cung cấp SMS
 * Infobip: yêu cầu format +84xxxxxxxxx (E.164)
 * SpeedSMS: chấp nhận 84xxxxxxxxx hoặc 0xxxxxxxxx
 * eSMS: chỉ chấp nhận 84xxxxxxxxx
 */
function formatPhoneNumber(phone: string): string {
  // Loại bỏ tất cả ký tự không phải số
  let cleaned = phone.replace(/\D/g, "");

  // Nếu bắt đầu bằng 0, chuyển thành 84
  if (cleaned.startsWith("0")) {
    cleaned = "84" + cleaned.slice(1);
  }

  // Nếu chưa có 84 ở đầu, thêm vào
  if (!cleaned.startsWith("84")) {
    cleaned = "84" + cleaned;
  }

  // Infobip yêu cầu có dấu + ở đầu (E.164 format)
  if (SMS_CONFIG.provider === "infobip") {
    return "+" + cleaned;
  }

  // Các provider khác không cần +
  return cleaned;
}

/**
 * Gửi SMS qua nhà cung cấp
 */
async function sendSMS(data: SMSMessage): Promise<any> {
  const provider = SMS_CONFIG.provider;

  // Kiểm tra credentials theo provider
  const hasCredentials =
    (provider === "infobip" &&
      SMS_CONFIG.apiKey &&
      SMS_CONFIG.apiKey !== "YOUR_API_KEY") ||
    (provider === "speedsms" &&
      SMS_CONFIG.accessToken &&
      SMS_CONFIG.accessToken !== "YOUR_ACCESS_TOKEN") ||
    (provider === "esms" &&
      SMS_CONFIG.apiKey &&
      SMS_CONFIG.apiKey !== "YOUR_API_KEY");

  // Kiểm tra biến SMS_ENABLED để cho phép gửi SMS thật trong development
  const smsEnabled = process.env.SMS_ENABLED === "true";

  if (!hasCredentials) {
    console.log("📱 [SMS SIMULATION - Không có credentials]", {
      to: data.to,
      message: data.message,
      type: data.type,
      provider,
      note:
        provider === "infobip"
          ? "Để gửi SMS thật, hãy thêm INFOBIP_API_KEY vào .env.local"
          : provider === "speedsms"
          ? "Để gửi SMS thật, hãy thêm SPEEDSMS_ACCESS_TOKEN vào .env.local"
          : "Để gửi SMS thật, hãy thêm ESMS_API_KEY vào .env.local",
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
      provider,
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

  // Gửi SMS thật theo provider
  if (provider === "infobip") {
    return sendInfobipSMS(data);
  } else if (provider === "speedsms") {
    return sendSpeedSMS(data);
  } else if (provider === "esms") {
    return sendESMS(data);
  } else {
    throw new Error(`Provider ${provider} chưa được hỗ trợ`);
  }
}

/**
 * Gửi SMS qua Infobip (Global SMS Platform)
 */
async function sendInfobipSMS(data: SMSMessage): Promise<any> {
  try {
    console.log("📱 [SENDING REAL SMS via Infobip]", {
      to: data.to,
      provider: "infobip",
      from: SMS_CONFIG.from,
      note: "Infobip - Enterprise SMS Gateway",
    });

    // Infobip SMS API v1
    const payload = {
      messages: [
        {
          from: SMS_CONFIG.from,
          destinations: [
            {
              to: data.to,
            },
          ],
          text: data.message,
        },
      ],
    };

    const response = await fetch(`${SMS_CONFIG.baseUrl}/sms/2/text/advanced`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `App ${SMS_CONFIG.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("✅ Infobip Response:", result);

    // Infobip response format:
    // { messages: [{ messageId, status: { groupId, groupName, id, name } }] }
    if (result.messages && result.messages.length > 0) {
      const message = result.messages[0];
      const statusId = message.status?.groupId;

      // Status groups: 1=PENDING, 2=UNDELIVERABLE, 3=DELIVERED, 4=EXPIRED, 5=REJECTED
      if (statusId === 1 || statusId === 3) {
        return {
          success: true,
          messageId: message.messageId,
          timestamp: new Date().toISOString(),
          provider: "infobip",
          status: message.status?.groupName,
        };
      } else {
        const errorMsg = message.status?.description || "SMS sending failed";
        throw new Error(`Infobip Error [${statusId}]: ${errorMsg}`);
      }
    } else {
      throw new Error("Infobip: No messages in response");
    }
  } catch (error: any) {
    console.error("❌ Infobip API Error:", error);
    throw error;
  }
}

/**
 * Gửi SMS qua SpeedSMS (không cần brandname)
 */
async function sendSpeedSMS(data: SMSMessage): Promise<any> {
  try {
    console.log("📱 [SENDING REAL SMS via SpeedSMS]", {
      to: data.to,
      provider: "speedsms",
      note: "SpeedSMS không yêu cầu brandname",
    });

    // SpeedSMS API v5
    const payload = {
      to: [data.to], // Array của số điện thoại
      content: data.message,
      type: data.type === "otp" ? 3 : 2, // 2=CSKH, 3=OTP, 4=Quảng cáo
      sender: "", // Để trống sẽ dùng số ngẫu nhiên
    };

    const response = await fetch("https://api.speedsms.vn/index.php/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SMS_CONFIG.accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("✅ SpeedSMS Response:", result);

    // SpeedSMS response format:
    // { status: "success", data: { ... } }
    // { status: "error", error: { code, message } }
    if (result.status === "success") {
      return {
        success: true,
        messageId: result.data?.tranId || Date.now().toString(),
        timestamp: new Date().toISOString(),
        provider: "speedsms",
      };
    } else {
      const errorMsg =
        result.error?.message || result.message || "Lỗi không xác định";
      throw new Error(`SpeedSMS Error: ${errorMsg}`);
    }
  } catch (error: any) {
    console.error("❌ SpeedSMS API Error:", error);
    throw error;
  }
}

/**
 * Gửi SMS qua eSMS (legacy, cần brandname)
 */
async function sendESMS(data: SMSMessage): Promise<any> {
  try {
    const hasBrandname =
      SMS_CONFIG.brandName && SMS_CONFIG.brandName.trim() !== "";

    const smsType = hasBrandname ? 8 : 2;

    console.log("📱 [SENDING REAL SMS via eSMS]", {
      to: data.to,
      provider: "esms",
      smsType,
      hasBrandname,
      brandname: hasBrandname ? SMS_CONFIG.brandName : "N/A",
      note: "eSMS yêu cầu brandname đã duyệt",
    });

    const payload: any = {
      ApiKey: SMS_CONFIG.apiKey,
      SecretKey: SMS_CONFIG.secretKey,
      Phone: data.to,
      Content: data.message,
      SmsType: smsType,
      IsUnicode: 0,
    };

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

    console.log("✅ eSMS Response:", result);

    if (result.CodeResult === "100") {
      return {
        success: true,
        messageId: result.SMSID,
        timestamp: new Date().toISOString(),
        provider: "esms",
      };
    } else {
      const errorMessages: { [key: string]: string } = {
        "104": "Brandname chưa được duyệt hoặc không tồn tại",
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
    console.error("❌ eSMS API Error:", error);
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
