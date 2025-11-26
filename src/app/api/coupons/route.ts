// src/app/api/coupons/route.ts - API quản lý mã giảm giá
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Lấy danh sách coupon
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active");

    let sql = "SELECT * FROM coupons WHERE 1=1";
    const params: any[] = [];

    if (active === "true") {
      sql +=
        " AND is_active = TRUE AND (valid_until IS NULL OR valid_until > NOW())";
    }

    sql += " ORDER BY created_at DESC";

    const coupons = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    console.error("Coupons GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải mã giảm giá",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Tạo coupon mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      valid_until,
    } = body;

    const sql = `
      INSERT INTO coupons (
        code, description, discount_type, discount_value,
        min_order_amount, max_discount_amount, usage_limit, valid_until
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      code,
      description || null,
      discount_type,
      discount_value,
      min_order_amount || 0,
      max_discount_amount || null,
      usage_limit || null,
      valid_until || null,
    ]);

    return NextResponse.json({
      success: true,
      message: "Tạo mã giảm giá thành công",
    });
  } catch (error: any) {
    console.error("Coupons POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tạo mã giảm giá",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
