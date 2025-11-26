// src/app/api/menu/route.ts - API lấy thực đơn từ database
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { syncMenuToJson } from "@/lib/syncMenu";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const available = searchParams.get("available");

    let sql = `
      SELECT 
        id,
        name,
        description,
        price,
        category,
        image_url as image,
        is_featured as popular,
        0 as spicy_level,
        is_available as available
      FROM menu_items 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    if (featured === "true") {
      sql += " AND is_featured = TRUE";
    }

    if (available !== "false") {
      sql += " AND is_available = TRUE";
    }

    sql += " ORDER BY is_featured DESC, sold_count DESC, name ASC";

    const items = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: items,
      count: Array.isArray(items) ? items.length : 0,
    });
  } catch (error: any) {
    console.error("Menu API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải thực đơn",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Thêm món mới (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      category,
      image,
      popular,
      spicy_level,
      available,
    } = body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const sql = `
      INSERT INTO menu_items 
      (name, slug, description, price, category, image_url, is_available, is_featured, preparation_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      name,
      slug,
      description,
      price,
      category,
      image || null,
      available ?? true,
      popular ?? false,
      15, // default preparation time
    ]);

    // Sync to menu.json for homepage
    await syncMenuToJson();

    return NextResponse.json({
      success: true,
      message: "Thêm món thành công",
      data: result,
    });
  } catch (error: any) {
    console.error("Menu POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể thêm món", details: error.message },
      { status: 500 }
    );
  }
}
