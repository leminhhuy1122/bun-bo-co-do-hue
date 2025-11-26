import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if staff member exists and is not an admin
    const staff = await query(`SELECT role FROM users WHERE id = ?`, [id]);

    if (!Array.isArray(staff) || staff.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Staff member not found",
        },
        { status: 404 }
      );
    }

    if ((staff[0] as any).role === "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete admin account",
        },
        { status: 403 }
      );
    }

    // Delete staff member
    await query(`DELETE FROM users WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete staff member",
      },
      { status: 500 }
    );
  }
}
