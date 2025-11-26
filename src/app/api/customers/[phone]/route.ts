import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { phone: string } }
) {
  try {
    const phone = params.phone;

    // Get customer orders
    const orders = await query(
      `SELECT 
        id, order_number, total_amount, order_status, 
        created_at, delivery_address
      FROM orders 
      WHERE customer_phone = ? 
      ORDER BY created_at DESC`,
      [phone]
    );

    // Get customer reservations
    const reservations = await query(
      `SELECT 
        id, reservation_number, reservation_date, reservation_time,
        number_of_guests, status, special_requests, created_at
      FROM reservations 
      WHERE customer_phone = ? 
      ORDER BY created_at DESC`,
      [phone]
    );

    // Get favorite items (most ordered)
    const favoriteItems = await query(
      `SELECT 
        oi.item_name,
        COUNT(*) as order_count,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.item_price * oi.quantity) as total_spent
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.customer_phone = ?
      GROUP BY oi.item_name
      ORDER BY order_count DESC, total_quantity DESC
      LIMIT 5`,
      [phone]
    );

    return NextResponse.json({
      success: true,
      data: {
        orders,
        reservations,
        favoriteItems,
      },
    });
  } catch (error: any) {
    console.error("Customer detail GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải thông tin khách hàng",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
