// Email Service - Gửi email xác nhận đơn hàng
import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Cấu hình Email (đọc từ biến môi trường)
const EMAIL_CONFIG: EmailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
};

// Tạo transporter
let transporter: any = null;

function getTransporter() {
  if (!transporter && EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass) {
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
  }
  return transporter;
}

/**
 * Gửi email xác nhận đơn hàng
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  customerName: string,
  orderItems: any[],
  totalAmount: number,
  orderStatus: string
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    // Validate email
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: "Email không hợp lệ",
      };
    }

    const transport = getTransporter();

    if (!transport) {
      console.log("📧 [EMAIL SIMULATION - Không có cấu hình email]", {
        to: email,
        orderNumber,
        note: "Để gửi email thật, hãy cấu hình EMAIL_USER và EMAIL_PASSWORD trong .env.local",
      });

      return {
        success: true,
        message: "Email simulation mode",
        messageId: `SIM_${Date.now()}`,
      };
    }

    const subject = `Xác nhận đơn hàng #${orderNumber} - Bún Bò Huế Cố Đô`;
    const html = generateOrderEmailHTML(
      orderNumber,
      customerName,
      orderItems,
      totalAmount,
      orderStatus
    );
    const text = generateOrderEmailText(
      orderNumber,
      customerName,
      orderItems,
      totalAmount,
      orderStatus
    );

    console.log("📧 [SENDING EMAIL]", {
      to: email,
      subject,
      from: EMAIL_CONFIG.auth.user,
    });

    const info = await transport.sendMail({
      from: `"Bún Bò Huế Cố Đô" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("✅ Email sent:", info.messageId);

    return {
      success: true,
      message: "Email đã được gửi thành công",
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Email Error:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi gửi email",
    };
  }
}

/**
 * Gửi email thông báo thay đổi trạng thái đơn hàng
 */
export async function sendOrderStatusEmail(
  email: string,
  orderNumber: string,
  customerName: string,
  status: string,
  statusMessage: string
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    const transport = getTransporter();

    if (!transport) {
      console.log("📧 [EMAIL SIMULATION]", {
        to: email,
        orderNumber,
        status,
      });

      return {
        success: true,
        message: "Email simulation mode",
        messageId: `SIM_${Date.now()}`,
      };
    }

    const subject = `Cập nhật đơn hàng #${orderNumber} - ${statusMessage}`;
    const html = generateStatusEmailHTML(
      orderNumber,
      customerName,
      status,
      statusMessage
    );

    const info = await transport.sendMail({
      from: `"Bún Bò Huế Cố Đô" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: subject,
      html: html,
    });

    console.log("✅ Email sent:", info.messageId);

    return {
      success: true,
      message: "Email đã được gửi thành công",
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Email Error:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi gửi email",
    };
  }
}

/**
 * Tạo HTML cho email xác nhận đơn hàng
 */
function generateOrderEmailHTML(
  orderNumber: string,
  customerName: string,
  orderItems: any[],
  totalAmount: number,
  orderStatus: string
): string {
  const formattedAmount = new Intl.NumberFormat("vi-VN").format(totalAmount);

  const itemsHTML = orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${
        item.name
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat(
        "vi-VN"
      ).format(item.price)}đ</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đơn hàng</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #B33A2B 0%, #8B2E20 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">🍜 Bún Bò Huế Cố Đô</h1>
              <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 15px; opacity: 0.95; letter-spacing: 0.5px;">Hương vị truyền thống Huế xưa</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Xin chào ${customerName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Cảm ơn bạn đã đặt hàng tại <strong>Bún Bò Huế Cố Đô</strong>. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
              </p>
              
              <!-- Order Info -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #333;">Mã đơn hàng:</strong>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="color: #B33A2B; font-weight: bold;">#${orderNumber}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #333;">Trạng thái:</strong>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="background-color: #4CAF50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                        ${getStatusText(orderStatus)}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Order Items -->
              <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 18px;">Chi tiết đơn hàng:</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; color: #333; font-weight: 600; border-bottom: 2px solid #ddd;">Món ăn</th>
                    <th style="padding: 12px; text-align: center; color: #333; font-weight: 600; border-bottom: 2px solid #ddd;">SL</th>
                    <th style="padding: 12px; text-align: right; color: #333; font-weight: 600; border-bottom: 2px solid #ddd;">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; color: #333; border-top: 2px solid #ddd;">
                      Tổng cộng:
                    </td>
                    <td style="padding: 15px; text-align: right; font-weight: bold; color: #B33A2B; font-size: 18px; border-top: 2px solid #ddd;">
                      ${formattedAmount}đ
                    </td>
                  </tr>
                </tfoot>
              </table>
              
              <!-- Note -->
              <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>Lưu ý:</strong> Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng và thời gian giao hàng.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #ddd;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>🍜 Bún Bò Huế Cố Đô</strong>
              </p>
              <p style="margin: 0 0 15px 0; color: #999; font-size: 13px;">
                Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
              </p>
              <div style="margin-top: 15px; line-height: 1.8;">
                <div style="margin: 5px 0;">
                  <a href="tel:0123456789" style="color: #B33A2B; text-decoration: none;">📞 Hotline: 0123.456.789</a>
                </div>
                <div style="margin: 5px 0;">
                  <a href="mailto:leminhhuy1122@gmail.com" style="color: #B33A2B; text-decoration: none;">✉️ Email: leminhhuy1122@gmail.com</a>
                </div>
                <div style="margin: 5px 0; color: #999; font-size: 12px;">
                  🏠 Địa chỉ: Huế, Việt Nam
                </div>
              </div>
              <p style="margin: 20px 0 0 0; color: #ccc; font-size: 11px;">
                © 2025 Bún Bò Huế Cố Đô. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Tạo text thuần cho email xác nhận đơn hàng
 */
function generateOrderEmailText(
  orderNumber: string,
  customerName: string,
  orderItems: any[],
  totalAmount: number,
  orderStatus: string
): string {
  const formattedAmount = new Intl.NumberFormat("vi-VN").format(totalAmount);

  const itemsText = orderItems
    .map(
      (item) =>
        `- ${item.name} x${item.quantity}: ${new Intl.NumberFormat(
          "vi-VN"
        ).format(item.price)}đ`
    )
    .join("\n");

  return `
Bún Bò Huế Cố Đô
==================

Xin chào ${customerName}!

Cảm ơn bạn đã đặt hàng tại Bún Bò Huế Cố Đô.

Mã đơn hàng: #${orderNumber}
Trạng thái: ${getStatusText(orderStatus)}

Chi tiết đơn hàng:
${itemsText}

Tổng cộng: ${formattedAmount}đ

Lưu ý: Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng và thời gian giao hàng.

---
Bún Bò Huế Cố Đô
📞 0123456789
✉️ contact@bunbohuecodo.vn
  `;
}

/**
 * Tạo HTML cho email thông báo trạng thái
 */
function generateStatusEmailHTML(
  orderNumber: string,
  customerName: string,
  status: string,
  statusMessage: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #B33A2B 0%, #8B2E20 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Bún Bò Huế Cố Đô</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Xin chào ${customerName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0;">
                Đơn hàng <strong style="color: #B33A2B;">#${orderNumber}</strong> của bạn đã được cập nhật:
              </p>
              
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 30px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #999; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Trạng thái mới
                </p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #B33A2B;">
                  ${statusMessage}
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 30px 0;">
                Cảm ơn bạn đã tin tưởng Bún Bò Huế Cố Đô!
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
              <p style="margin: 0; color: #999; font-size: 13px;">
                Bún Bò Huế Cố Đô | 📞 0123456789 | ✉️ contact@bunbohuecodo.vn
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Lấy text trạng thái tiếng Việt
 */
function getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: "Đang chờ xác nhận",
    confirmed: "Đã xác nhận",
    preparing: "Đang chuẩn bị",
    delivering: "Đang giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
}

/**
 * Gửi email xác nhận đặt bàn
 */
export async function sendReservationConfirmationEmail(
  email: string,
  reservationNumber: string,
  customerName: string,
  reservationDate: string,
  reservationTime: string,
  numberOfGuests: number,
  specialRequests?: string
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    // Validate email
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: "Email không hợp lệ",
      };
    }

    const transport = getTransporter();

    if (!transport) {
      console.log("📧 [EMAIL SIMULATION - Đặt bàn]", {
        to: email,
        reservationNumber,
        note: "Để gửi email thật, hãy cấu hình EMAIL_USER và EMAIL_PASSWORD trong .env.local",
      });

      return {
        success: true,
        message: "Email simulation mode",
        messageId: `SIM_${Date.now()}`,
      };
    }

    const subject = `Xác nhận đặt bàn #${reservationNumber} - Bún Bò Huế Cố Đô`;
    const html = generateReservationEmailHTML(
      reservationNumber,
      customerName,
      reservationDate,
      reservationTime,
      numberOfGuests,
      specialRequests
    );

    console.log("📧 [SENDING RESERVATION EMAIL]", {
      to: email,
      subject,
      reservationNumber,
    });

    const info = await transport.sendMail({
      from: `"Bún Bò Huế Cố Đô" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: subject,
      html: html,
    });

    console.log("✅ Reservation email sent:", info.messageId);

    return {
      success: true,
      message: "Email đặt bàn đã được gửi thành công",
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Reservation Email Error:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi gửi email đặt bàn",
    };
  }
}

/**
 * Gửi email thông báo thay đổi trạng thái đặt bàn
 */
export async function sendReservationStatusEmail(
  email: string,
  reservationNumber: string,
  customerName: string,
  status: string,
  reservationDate: string,
  reservationTime: string,
  numberOfGuests: number
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    const transport = getTransporter();

    if (!transport) {
      console.log("📧 [EMAIL SIMULATION - Trạng thái đặt bàn]", {
        to: email,
        reservationNumber,
        status,
      });

      return {
        success: true,
        message: "Email simulation mode",
        messageId: `SIM_${Date.now()}`,
      };
    }

    const statusText = getReservationStatusText(status);
    const subject = `Cập nhật đặt bàn #${reservationNumber} - ${statusText}`;
    const html = generateReservationStatusEmailHTML(
      reservationNumber,
      customerName,
      status,
      statusText,
      reservationDate,
      reservationTime,
      numberOfGuests
    );

    const info = await transport.sendMail({
      from: `"Bún Bò Huế Cố Đô" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: subject,
      html: html,
    });

    console.log("✅ Reservation status email sent:", info.messageId);

    return {
      success: true,
      message: "Email cập nhật đặt bàn đã được gửi thành công",
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Reservation Status Email Error:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi gửi email cập nhật đặt bàn",
    };
  }
}

/**
 * Tạo HTML cho email xác nhận đặt bàn
 */
function generateReservationEmailHTML(
  reservationNumber: string,
  customerName: string,
  reservationDate: string,
  reservationTime: string,
  numberOfGuests: number,
  specialRequests?: string
): string {
  const formattedDate = new Date(reservationDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đặt bàn</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #B33A2B 0%, #8B2E20 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">🍽️ Bún Bò Huế Cố Đô</h1>
              <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 15px; opacity: 0.95; letter-spacing: 0.5px;">Hương vị truyền thống Huế xưa</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Xin chào ${customerName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Cảm ơn bạn đã đặt bàn tại <strong>Bún Bò Huế Cố Đô</strong>. Yêu cầu đặt bàn của bạn đã được tiếp nhận và đang chờ xác nhận.
              </p>
              
              <!-- Reservation Info -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td colspan="2" style="padding: 0 0 15px 0; border-bottom: 2px solid #ddd;">
                      <strong style="color: #B33A2B; font-size: 18px;">Mã đặt bàn: #${reservationNumber}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <span style="font-size: 20px; margin-right: 8px;">📅</span>
                      <strong style="color: #333;">Ngày:</strong>
                    </td>
                    <td style="padding: 12px 0; text-align: right;">
                      <span style="color: #555; font-weight: 600;">${formattedDate}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <span style="font-size: 20px; margin-right: 8px;">🕐</span>
                      <strong style="color: #333;">Giờ:</strong>
                    </td>
                    <td style="padding: 12px 0; text-align: right;">
                      <span style="color: #555; font-weight: 600;">${reservationTime}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <span style="font-size: 20px; margin-right: 8px;">👥</span>
                      <strong style="color: #333;">Số khách:</strong>
                    </td>
                    <td style="padding: 12px 0; text-align: right;">
                      <span style="color: #555; font-weight: 600;">${numberOfGuests} người</span>
                    </td>
                  </tr>
                  ${
                    specialRequests
                      ? `
                  <tr>
                    <td colspan="2" style="padding: 15px 0 0 0; border-top: 1px solid #ddd;">
                      <strong style="color: #333;">Yêu cầu đặc biệt:</strong>
                      <p style="margin: 8px 0 0 0; color: #666; font-style: italic;">${specialRequests}</p>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>
              
              <!-- Status -->
              <div style="text-align: center; margin: 30px 0;">
                <span style="background-color: #ffc107; color: #fff; padding: 12px 24px; border-radius: 25px; font-size: 14px; font-weight: bold; display: inline-block;">
                  ⏳ Đang chờ xác nhận
                </span>
              </div>
              
              <!-- Note -->
              <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
                <p style="margin: 0; color: #2e7d32; font-size: 14px; line-height: 1.6;">
                  <strong>Lưu ý:</strong> Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đặt bàn. Vui lòng đến đúng giờ để được phục vụ tốt nhất.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #ddd;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>🍜 Bún Bò Huế Cố Đô</strong>
              </p>
              <p style="margin: 0 0 15px 0; color: #999; font-size: 13px;">
                Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
              </p>
              <div style="margin-top: 15px; line-height: 1.8;">
                <div style="margin: 5px 0;">
                  <a href="tel:0123456789" style="color: #B33A2B; text-decoration: none;">📞 Hotline: 0123.456.789</a>
                </div>
                <div style="margin: 5px 0;">
                  <a href="mailto:leminhhuy1122@gmail.com" style="color: #B33A2B; text-decoration: none;">✉️ Email: leminhhuy1122@gmail.com</a>
                </div>
                <div style="margin: 5px 0; color: #999; font-size: 12px;">
                  🏠 Địa chỉ: Huế, Việt Nam
                </div>
              </div>
              <p style="margin: 20px 0 0 0; color: #ccc; font-size: 11px;">
                © 2025 Bún Bò Huế Cố Đô. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Tạo HTML cho email cập nhật trạng thái đặt bàn
 */
function generateReservationStatusEmailHTML(
  reservationNumber: string,
  customerName: string,
  status: string,
  statusText: string,
  reservationDate: string,
  reservationTime: string,
  numberOfGuests: number
): string {
  const formattedDate = new Date(reservationDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusColors: {
    [key: string]: { bg: string; text: string; icon: string };
  } = {
    confirmed: { bg: "#4caf50", text: "#fff", icon: "✅" },
    completed: { bg: "#2196f3", text: "#fff", icon: "🎉" },
    cancelled: { bg: "#f44336", text: "#fff", icon: "❌" },
  };

  const statusConfig = statusColors[status] || {
    bg: "#ffc107",
    text: "#fff",
    icon: "⏳",
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #B33A2B 0%, #8B2E20 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ Bún Bò Huế Cố Đô</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Xin chào ${customerName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0;">
                Đặt bàn <strong style="color: #B33A2B;">#${reservationNumber}</strong> của bạn đã được cập nhật:
              </p>
              
              <div style="background-color: ${statusConfig.bg}; border-radius: 12px; padding: 30px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: ${statusConfig.text}; font-size: 40px;">
                  ${statusConfig.icon}
                </p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: ${statusConfig.text};">
                  ${statusText}
                </p>
              </div>
              
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: left;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #666;">📅 Ngày:</strong>
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #333;">
                      ${formattedDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #666;">🕐 Giờ:</strong>
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #333;">
                      ${reservationTime}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #666;">👥 Số khách:</strong>
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #333;">
                      ${numberOfGuests} người
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 30px 0;">
                Cảm ơn bạn đã tin tưởng Bún Bò Huế Cố Đô!
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
              <p style="margin: 0; color: #999; font-size: 13px;">
                Bún Bò Huế Cố Đô | 📞 0123456789 | ✉️ leminhhuy1122@gmail.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Lấy text trạng thái đặt bàn tiếng Việt
 */
function getReservationStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: "Đang chờ xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Đã hoàn thành",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
}

/**
 * Kiểm tra cấu hình email
 */
export function isEmailConfigured(): boolean {
  return !!(EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass);
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
