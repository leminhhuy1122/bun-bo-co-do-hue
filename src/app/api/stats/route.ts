// src/app/api/stats/route.ts - API thống kê cho dashboard
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Tổng doanh thu hôm nay
    const [todayStats] = await query<any[]>(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE DATE(created_at) = CURDATE() 
      AND order_status != 'cancelled'
    `);

    // Tổng doanh thu tháng này
    const [monthStats] = await query<any[]>(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE MONTH(created_at) = MONTH(CURDATE()) 
      AND YEAR(created_at) = YEAR(CURDATE())
      AND order_status != 'cancelled'
    `);

    // Số đơn hàng theo trạng thái
    const ordersByStatus = await query(`
      SELECT 
        order_status,
        COUNT(*) as count
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
      GROUP BY order_status
    `);

    // Đơn hàng gần đây
    const recentOrders = await query(`
      SELECT 
        id, order_number, customer_name, customer_phone,
        total_amount, order_status, payment_status, created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    // Top món bán chạy
    const topItems = await query(`
      SELECT 
        mi.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE DATE(o.created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      AND o.order_status != 'cancelled'
      GROUP BY mi.id, mi.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Đặt bàn hôm nay
    const [todayReservations] = await query<any[]>(`
      SELECT COUNT(*) as count
      FROM reservations
      WHERE reservation_date = CURDATE()
      AND status NOT IN ('cancelled', 'no-show')
    `);

    return NextResponse.json({
      success: true,
      data: {
        today: {
          revenue: todayStats.revenue,
          orders: todayStats.orders,
          reservations: todayReservations.count,
        },
        month: {
          revenue: monthStats.revenue,
          orders: monthStats.orders,
        },
        ordersByStatus,
        recentOrders,
        topItems,
      },
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải thống kê",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
