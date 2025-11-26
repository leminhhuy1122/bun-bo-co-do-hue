import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Fetch all staff members (exclude password)
    const staff = await query(`
      SELECT id, username, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch staff",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await query(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Username already exists",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new staff member
    const result = await query(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, hashedPassword, role || "staff"]
    );

    return NextResponse.json({
      success: true,
      message: "Staff member added successfully",
      data: { id: (result as any).insertId, username, role: role || "staff" },
    });
  } catch (error: any) {
    console.error("Error adding staff:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add staff member",
      },
      { status: 500 }
    );
  }
}
