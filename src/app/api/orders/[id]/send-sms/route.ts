// API endpoint để gửi SMS thông báo đơn hàng
import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { sendOrderStatusSMS } from "@/lib/sms";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Lấy thông tin đơn hàng
    const order = await queryOne<any>("SELECT * FROM orders WHERE id = ?", [
      orderId,
    ]);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Gửi SMS
    const result = await sendOrderStatusSMS(
      order.customer_phone,
      order.order_number,
      order.order_status,
      order.customer_name
    );

    // Lưu log vào database
    const logStatus = result.success ? "sent" : "failed";
    const messageContent = result.messageContent || "";

    try {
      await query(
        `INSERT INTO sms_logs (
          order_id, phone_number, message_type, message_content,
          status, error_message, provider, message_id, sent_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          orderId,
          order.customer_phone,
          "order_status",
          messageContent,
          logStatus,
          result.success ? null : result.message,
          "esms",
          result.messageId || null,
        ]
      );
    } catch (logError) {
      console.error("Failed to save SMS log:", logError);
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
    console.error("SMS Send Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể gửi SMS",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
