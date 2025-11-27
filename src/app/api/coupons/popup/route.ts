// API lấy danh sách coupon hiển thị trong popup
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        id, code, description, discount_type, discount_value,
        min_order_amount, max_discount_amount,
        popup_badge, popup_gradient, popup_priority
      FROM coupons 
      WHERE is_active = TRUE 
        AND show_in_popup = TRUE
        AND (valid_until IS NULL OR valid_until > NOW())
      ORDER BY popup_priority ASC, created_at DESC
      LIMIT 5
    `;

    const coupons = await query(sql);

    return NextResponse.json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    console.error("Popup Coupons GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải mã giảm giá popup",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
