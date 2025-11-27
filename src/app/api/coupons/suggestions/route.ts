// API lấy danh sách coupon hiển thị trong gợi ý thanh toán
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        id, code, description, discount_type, discount_value,
        min_order_amount, max_discount_amount,
        suggestion_badge, suggestion_priority
      FROM coupons 
      WHERE is_active = TRUE 
        AND show_in_suggestions = TRUE
        AND (valid_until IS NULL OR valid_until > NOW())
      ORDER BY suggestion_priority ASC, created_at DESC
      LIMIT 6
    `;

    const coupons = await query(sql);

    // Format data for frontend
    const formatted = coupons.map((coupon: any) => ({
      code: coupon.code,
      description:
        coupon.description ||
        `Giảm ${
          coupon.discount_type === "percentage"
            ? `${coupon.discount_value}%`
            : `${(coupon.discount_value / 1000).toFixed(0)}K`
        } cho đơn từ ${(coupon.min_order_amount / 1000).toFixed(0)}K`,
      discount:
        coupon.suggestion_badge ||
        (coupon.discount_type === "percentage"
          ? `${coupon.discount_value}%`
          : `${(coupon.discount_value / 1000).toFixed(0)}K`),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("Suggestion Coupons GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải mã gợi ý",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
