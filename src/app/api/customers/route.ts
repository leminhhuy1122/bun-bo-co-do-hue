// src/app/api/customers/route.ts - API quản lý khách hàng
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const type = searchParams.get("type") || "all"; // all, new, returning, vip

    // Query to aggregate customer data from orders and reservations
    let sql = `
      SELECT 
        customer_phone as phone,
        MAX(customer_name) as name,
        MAX(customer_email) as email,
        MAX(delivery_address) as address,
        COUNT(DISTINCT CASE WHEN order_id IS NOT NULL THEN order_id END) as total_orders,
        COUNT(DISTINCT CASE WHEN reservation_id IS NOT NULL THEN reservation_id END) as total_reservations,
        COALESCE(SUM(total_amount), 0) as total_spent,
        MIN(created_at) as first_visit,
        MAX(created_at) as last_visit
      FROM (
        SELECT 
          id as order_id, 
          NULL as reservation_id,
          customer_name, 
          customer_phone, 
          customer_email, 
          delivery_address, 
          total_amount, 
          created_at
        FROM orders
        UNION ALL
        SELECT 
          NULL as order_id,
          id as reservation_id,
          customer_name, 
          customer_phone, 
          customer_email,
          NULL as delivery_address,
          0 as total_amount,
          created_at
        FROM reservations
      ) as combined
      WHERE 1=1
    `;

    const params: any[] = [];

    if (search) {
      sql += ` AND (customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ` GROUP BY customer_phone`;

    // Apply type filter in HAVING clause
    if (type === "new") {
      sql += ` HAVING total_orders <= 1`;
    } else if (type === "returning") {
      sql += ` HAVING total_orders >= 2 AND total_spent < 1000000`;
    } else if (type === "vip") {
      sql += ` HAVING total_spent >= 1000000 OR total_orders >= 5`;
    }

    sql += ` ORDER BY total_spent DESC, last_visit DESC`;

    const customers = await query(sql, params);

    // Calculate statistics
    const allCustomersQuery = `
      SELECT 
        customer_phone,
        COUNT(DISTINCT CASE WHEN order_id IS NOT NULL THEN order_id END) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_spent
      FROM (
        SELECT id as order_id, NULL as reservation_id, customer_phone, total_amount FROM orders
        UNION ALL
        SELECT NULL as order_id, id as reservation_id, customer_phone, 0 as total_amount FROM reservations
      ) as combined
      GROUP BY customer_phone
    `;

    const allCustomers: any = await query(allCustomersQuery);

    const stats = {
      total: allCustomers.length,
      new: allCustomers.filter((c: any) => c.total_orders <= 1).length,
      returning: allCustomers.filter(
        (c: any) => c.total_orders >= 2 && Number(c.total_spent) < 1000000
      ).length,
      vip: allCustomers.filter(
        (c: any) => Number(c.total_spent) >= 1000000 || c.total_orders >= 5
      ).length,
      totalRevenue: allCustomers.reduce(
        (sum: number, c: any) => sum + Number(c.total_spent),
        0
      ),
    };

    return NextResponse.json({
      success: true,
      data: customers,
      stats: stats,
    });
  } catch (error: any) {
    console.error("Customers GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải danh sách khách hàng",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
