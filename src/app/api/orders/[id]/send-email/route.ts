import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Lấy thông tin đơn hàng
    const orderResult: any = await query(`SELECT * FROM orders WHERE id = ?`, [
      orderId,
    ]);

    if (!orderResult || orderResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    // Kiểm tra email - ưu tiên customer_email trong bảng orders
    const customerEmail = order.customer_email;

    if (!customerEmail || customerEmail.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Khách hàng chưa có email" },
        { status: 400 }
      );
    }

    // Lấy chi tiết món ăn trong đơn
    const orderItems: any = await query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    // Format order items cho email
    const formattedItems = orderItems.map((item: any) => ({
      name: item.item_name,
      quantity: item.quantity,
      price: item.subtotal || item.item_price * item.quantity,
    }));

    // Gửi email
    const result = await sendOrderConfirmationEmail(
      customerEmail,
      order.order_number,
      order.customer_name,
      formattedItems,
      order.total_amount,
      order.order_status
    );

    // Lưu log gửi email vào database
    const logStatus = result.success ? "sent" : "failed";

    try {
      await query(
        `INSERT INTO email_logs (
          order_id, email, subject, status, error_message, message_id, sent_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          orderId,
          customerEmail,
          `Xác nhận đơn hàng #${order.order_number}`,
          logStatus,
          result.success ? null : result.message,
          result.messageId || null,
        ]
      );

      // Cập nhật trạng thái email_sent trong orders
      if (result.success) {
        await query(
          `UPDATE orders SET email_sent = TRUE, email_sent_at = CURRENT_TIMESTAMP, email_count = email_count + 1 WHERE id = ?`,
          [orderId]
        );
      }
    } catch (logError) {
      console.error("Failed to save email log:", logError);
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi gửi email" },
      { status: 500 }
    );
  }
}
