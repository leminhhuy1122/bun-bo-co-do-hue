import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { role, full_name, email, phone, status } = body;

    // Check if staff member exists
    const staff = await query(`SELECT id, role FROM users WHERE id = ?`, [id]);

    if (!Array.isArray(staff) || staff.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Staff member not found",
        },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }
    if (full_name !== undefined) {
      updates.push("full_name = ?");
      values.push(full_name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 }
      );
    }

    values.push(id);

    // Update staff member
    await query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

    return NextResponse.json({
      success: true,
      message: "Staff member updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update staff member",
      },
      { status: 500 }
    );
  }
}

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
