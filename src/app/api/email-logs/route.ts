import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Lấy danh sách email logs
    const emailLogs: any = await query(
      `SELECT 
        el.*,
        el.email as recipient_email,
        CASE 
          WHEN el.subject LIKE '%Xác nhận đơn hàng%' THEN 'order_confirmation'
          WHEN el.subject LIKE '%trạng thái%' OR el.subject LIKE '%Cập nhật đơn%' THEN 'order_status'
          WHEN el.subject LIKE '%đặt bàn%' OR el.subject LIKE '%Cập nhật đặt bàn%' THEN 'reservation'
          ELSE 'other'
        END as message_type,
        o.order_number,
        o.customer_name,
        r.reservation_number,
        r.customer_name as reservation_customer_name
       FROM email_logs el
       LEFT JOIN orders o ON el.order_id = o.id
       LEFT JOIN reservations r ON el.reservation_id = r.id
       ORDER BY el.sent_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Lấy thống kê
    const [stats]: any = await query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
       FROM email_logs`
    );

    // Lấy tổng số để tính pagination
    const [countResult]: any = await query(
      `SELECT COUNT(*) as total FROM email_logs`
    );
    const totalCount = countResult.total;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: emailLogs,
      stats: {
        total: stats?.total || 0,
        sent: stats?.sent || 0,
        failed: stats?.failed || 0,
        pending: stats?.pending || 0,
      },
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
