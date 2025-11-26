// src/app/api/coupons/[id]/route.ts - API chi tiết coupon
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Cập nhật coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const {
      description,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      valid_until,
      is_active,
    } = body;

    const sql = `
      UPDATE coupons 
      SET description = ?, discount_value = ?, min_order_amount = ?,
          max_discount_amount = ?, usage_limit = ?, valid_until = ?,
          is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await query(sql, [
      description,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      valid_until,
      is_active,
      id,
    ]);

    return NextResponse.json({
      success: true,
      message: "Cập nhật mã giảm giá thành công",
    });
  } catch (error: any) {
    console.error("Coupon PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật mã giảm giá",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Xóa coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await query("DELETE FROM coupons WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Xóa mã giảm giá thành công",
    });
  } catch (error: any) {
    console.error("Coupon DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể xóa mã giảm giá",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
