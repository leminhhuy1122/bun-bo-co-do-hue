// API để lấy danh sách SMS logs từ database
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Lấy danh sách SMS logs
    const smsLogs = await query(
      `SELECT 
        sl.*,
        o.order_number,
        o.customer_name
      FROM sms_logs sl
      LEFT JOIN orders o ON sl.order_id = o.id
      ORDER BY sl.sent_at DESC
      LIMIT ${limit} OFFSET ${offset}`,
      []
    );

    // Lấy tổng số
    const [{ total }] = await query<any[]>(
      "SELECT COUNT(*) as total FROM sms_logs"
    );

    // Lấy thống kê
    const [stats] = await query<any[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(cost) as total_cost
      FROM sms_logs`
    );

    return NextResponse.json({
      success: true,
      data: smsLogs,
      stats: stats || {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
        total_cost: 0,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("SMS Logs GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải lịch sử SMS",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
