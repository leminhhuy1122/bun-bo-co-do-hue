// src/app/api/menu/[id]/route.ts - API chi tiết món ăn
import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { syncMenuToJson } from "@/lib/syncMenu";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const item = await queryOne("SELECT * FROM menu_items WHERE id = ?", [id]);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy món ăn" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error("Menu Item API Error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải món ăn", details: error.message },
      { status: 500 }
    );
  }
}

// Cập nhật món (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    const sql = `
      UPDATE menu_items 
      SET name = ?, description = ?, price = ?, category = ?, 
          image_url = ?, is_available = ?, is_featured = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await query(sql, [
      name,
      description,
      price,
      category,
      image || null,
      available ?? true,
      popular ?? false,
      id,
    ]);

    // Sync to menu.json for homepage
    await syncMenuToJson();

    return NextResponse.json({
      success: true,
      message: "Cập nhật món thành công",
    });
  } catch (error: any) {
    console.error("Menu PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật món",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Xóa món (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await query("DELETE FROM menu_items WHERE id = ?", [id]);

    // Sync to menu.json for homepage
    await syncMenuToJson();

    return NextResponse.json({
      success: true,
      message: "Xóa món thành công",
    });
  } catch (error: any) {
    console.error("Menu DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa món", details: error.message },
      { status: 500 }
    );
  }
}
