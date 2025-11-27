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

    // Lấy thông tin coupon hiện tại
    const currentCoupon: any = await query(
      "SELECT * FROM coupons WHERE id = ?",
      [id]
    );

    if (!currentCoupon || currentCoupon.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy mã giảm giá",
        },
        { status: 404 }
      );
    }

    // Merge dữ liệu mới với dữ liệu hiện tại
    const updatedData = {
      ...currentCoupon[0],
      ...body,
    };

    const sql = `
      UPDATE coupons 
      SET description = ?, 
          discount_value = ?, 
          min_order_amount = ?,
          max_discount_amount = ?, 
          usage_limit = ?, 
          valid_until = ?,
          is_active = ?,
          show_in_popup = ?,
          popup_priority = ?,
          popup_badge = ?,
          popup_gradient = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await query(sql, [
      updatedData.description,
      updatedData.discount_value,
      updatedData.min_order_amount,
      updatedData.max_discount_amount,
      updatedData.usage_limit,
      updatedData.valid_until,
      updatedData.is_active,
      updatedData.show_in_popup || false,
      updatedData.popup_priority || 999,
      updatedData.popup_badge || null,
      updatedData.popup_gradient || null,
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
