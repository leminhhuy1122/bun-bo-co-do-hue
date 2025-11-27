// src/app/api/orders/route.ts - API quản lý đơn hàng
import { NextRequest, NextResponse } from "next/server";
import { query, transaction } from "@/lib/db";
import type { PoolConnection } from "mysql2/promise";

// Lấy danh sách đơn hàng
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];

    if (status) {
      sql += " AND order_status = ?";
      params.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const orders = await query(sql, params);

    // Lấy total count
    let countSql = "SELECT COUNT(*) as total FROM orders WHERE 1=1";
    const countParams: any[] = [];
    if (status) {
      countSql += " AND order_status = ?";
      countParams.push(status);
    }
    const [{ total }] = await query<any[]>(countSql, countParams);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Orders GET Error:", error);
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

// Tạo đơn hàng mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📥 Received order data:", JSON.stringify(body, null, 2));

    const {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      paymentMethod,
      items,
      subtotal,
      discount,
      total,
      couponCode,
    } = body;

    console.log("📋 Order details:", {
      orderNumber,
      customerName,
      customerPhone,
      itemCount: items?.length,
      total,
    });

    // Transaction: Insert order + order items
    const result = await transaction(async (connection: PoolConnection) => {
      // Insert order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          order_number, customer_name, customer_phone, customer_email,
          delivery_address, order_type, subtotal, discount_amount, 
          delivery_fee, total_amount, coupon_code, payment_method, order_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber,
          customerName,
          customerPhone,
          customerEmail || null,
          customerAddress || null,
          "delivery",
          subtotal,
          discount,
          0,
          total,
          couponCode || null,
          paymentMethod,
          "pending",
        ]
      );

      const orderId = (orderResult as any).insertId;

      // Insert order items
      for (const item of items) {
        const itemTotal = item.price * item.quantity;

        // Convert menuItemId to number, set NULL if invalid
        const menuItemIdNumber =
          typeof item.menuItemId === "number"
            ? item.menuItemId
            : typeof item.menuItemId === "string" &&
              !isNaN(parseInt(item.menuItemId))
            ? parseInt(item.menuItemId)
            : null;

        console.log(
          `Inserting item: ${item.menuItemName}, menuItemId: ${item.menuItemId} -> ${menuItemIdNumber}`
        );

        await connection.execute(
          `INSERT INTO order_items (
            order_id, menu_item_id, item_name, item_price,
            quantity, toppings, subtotal, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            menuItemIdNumber,
            item.menuItemName,
            item.price,
            item.quantity,
            item.toppings.length > 0 ? JSON.stringify(item.toppings) : null,
            itemTotal,
            item.note || null,
          ]
        );
      }

      // Tăng used_count của coupon nếu có
      if (couponCode) {
        await connection.execute(
          `UPDATE coupons 
           SET used_count = COALESCE(used_count, 0) + 1,
               updated_at = CURRENT_TIMESTAMP
           WHERE code = ? AND is_active = TRUE`,
          [couponCode]
        );
        console.log(`📊 Updated coupon usage count for: ${couponCode}`);
      }

      return { orderId, orderNumber };
    });

    console.log("✅ Order created successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Đặt hàng thành công",
      data: result,
    });
  } catch (error: any) {
    console.error("❌ Orders POST Error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tạo đơn hàng",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
