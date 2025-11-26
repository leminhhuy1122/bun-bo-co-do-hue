import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "today";

    // Check if database tables exist
    try {
      await query("SELECT 1 FROM orders LIMIT 1");
    } catch (err: any) {
      // Database tables don't exist yet, return demo data
      console.log("⚠️ Database tables not found, returning demo data");
      return NextResponse.json({
        success: true,
        data: {
          revenue: { total: 0, orders: 0, avgOrderValue: 0, totalDiscount: 0 },
          orders: { total: 0, byStatus: [] },
          reservations: { total: 0, pending: 0, confirmed: 0, completed: 0 },
          customers: { total: 0 },
          topItems: [],
          revenueByDay: [],
          paymentMethods: [],
        },
        message:
          "⚠️ Vui lòng chạy file FULL_DATABASE_SETUP.sql trong phpMyAdmin",
      });
    }

    // Calculate date condition
    let dateCondition = "1=1"; // Default: all time
    const now = new Date();

    if (period === "today") {
      const today = now.toISOString().split("T")[0];
      dateCondition = `DATE(created_at) = '${today}'`;
    } else if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateCondition = `created_at >= '${weekAgo.toISOString().split("T")[0]}'`;
    } else if (period === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateCondition = `created_at >= '${monthAgo.toISOString().split("T")[0]}'`;
    } else if (period === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      dateCondition = `created_at >= '${yearAgo.toISOString().split("T")[0]}'`;
    }

    // 1. DOANH THU: Chỉ tính đơn hàng có trạng thái "completed"
    const revenueStats: any = await query(
      `SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as avg_order_value,
        COALESCE(SUM(discount_amount), 0) as total_discount
      FROM orders 
      WHERE order_status = 'completed' AND ${dateCondition}`
    );

    // 2. ĐỐN HÀNG ĐÃ ĐẶT: Đếm số đơn hàng "completed"
    const completedOrdersCount: any = await query(
      `SELECT COUNT(*) as count
      FROM orders 
      WHERE order_status = 'completed' AND ${dateCondition}`
    );

    // Get all order statuses for breakdown
    const ordersByStatus: any = await query(
      `SELECT 
        order_status,
        COUNT(*) as count
      FROM orders 
      WHERE ${dateCondition}
      GROUP BY order_status`
    );

    // 3. KHÁCH HÀNG ĐÃ ĐẶT: Tổng số khách hàng trong bảng customers
    const customersStats: any = await query(
      `SELECT COUNT(*) as total_customers FROM customers`
    );

    // 4. SỐ BÀN ĐÃ ĐẶT: Đếm reservation có trạng thái "completed"
    const completedReservations: any = await query(
      `SELECT COUNT(*) as count
      FROM reservations 
      WHERE status = 'completed' AND ${dateCondition}`
    );

    // Get all reservation statuses
    const reservationsStats: any = await query(
      `SELECT 
        COUNT(*) as total_reservations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reservations,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_reservations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reservations
      FROM reservations 
      WHERE ${dateCondition}`
    );

    // Get top selling items (only from completed orders)
    const topItems: any = await query(
      `SELECT 
        oi.item_name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.item_price * oi.quantity) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.order_status = 'completed' AND ${dateCondition.replace(
        "created_at",
        "o.created_at"
      )}
      GROUP BY oi.item_name
      ORDER BY total_quantity DESC
      LIMIT 5`
    );

    // Get revenue by day (last 7 days, only completed orders)
    const revenueByDay: any = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE order_status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC`
    );

    // Get payment methods (only from completed orders)
    const paymentMethods: any = await query(
      `SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(total_amount) as total
      FROM orders
      WHERE order_status = 'completed' AND ${dateCondition}
      GROUP BY payment_method`
    );

    return NextResponse.json({
      success: true,
      data: {
        revenue: {
          total: Number(revenueStats[0]?.total_revenue || 0),
          orders: Number(revenueStats[0]?.total_orders || 0),
          avgOrderValue: Number(revenueStats[0]?.avg_order_value || 0),
          totalDiscount: Number(revenueStats[0]?.total_discount || 0),
        },
        orders: {
          total: Number(completedOrdersCount[0]?.count || 0),
          byStatus: ordersByStatus.map((row: any) => ({
            status: row.order_status,
            count: Number(row.count),
          })),
        },
        reservations: {
          total: Number(reservationsStats[0]?.total_reservations || 0),
          pending: Number(reservationsStats[0]?.pending_reservations || 0),
          confirmed: Number(reservationsStats[0]?.confirmed_reservations || 0),
          completed: Number(completedReservations[0]?.count || 0),
        },
        customers: {
          total: Number(customersStats[0]?.total_customers || 0),
        },
        topItems: topItems.map((row: any) => ({
          name: row.item_name,
          quantity: Number(row.total_quantity),
          revenue: Number(row.total_revenue),
        })),
        revenueByDay: revenueByDay.map((row: any) => ({
          date: row.date,
          orders: Number(row.orders),
          revenue: Number(row.revenue),
        })),
        paymentMethods: paymentMethods.map((row: any) => ({
          method: row.payment_method,
          count: Number(row.count),
          total: Number(row.total),
        })),
      },
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải dữ liệu dashboard",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
