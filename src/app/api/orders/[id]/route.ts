// src/app/api/orders/[id]/route.ts - API chi tiết đơn hàng
import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Lấy thông tin đơn hàng
    const order = await queryOne("SELECT * FROM orders WHERE id = ?", [id]);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Lấy chi tiết món
    const items = await query("SELECT * FROM order_items WHERE order_id = ?", [
      id,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items,
      },
    });
  } catch (error: any) {
    console.error("Order Detail Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải đơn hàng",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Cập nhật trạng thái đơn hàng
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { order_status, payment_status } = body;

    let sql = "UPDATE orders SET updated_at = CURRENT_TIMESTAMP";
    const updateParams: any[] = [];

    if (order_status) {
      sql += ", order_status = ?";
      updateParams.push(order_status);
    }

    if (payment_status) {
      sql += ", payment_status = ?";
      updateParams.push(payment_status);
    }

    sql += " WHERE id = ?";
    updateParams.push(id);

    await query(sql, updateParams);

    return NextResponse.json({
      success: true,
      message: "Cập nhật đơn hàng thành công",
    });
  } catch (error: any) {
    console.error("Order PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật đơn hàng",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PUT(request, { params });
}

// Xóa đơn hàng
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Xóa order_items trước (cascade sẽ tự động xóa nhưng để chắc chắn)
    await query("DELETE FROM order_items WHERE order_id = ?", [id]);

    // Xóa order
    const result = await query("DELETE FROM orders WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Xóa đơn hàng thành công",
    });
  } catch (error: any) {
    console.error("Order DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể xóa đơn hàng",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
