import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Fetch all staff members (exclude password)
    const staff = await query(`
      SELECT id, username, full_name, email, phone, role, status, created_at
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
    const { username, password, role, full_name, email, phone } = body;

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

    // Set default values for required fields
    const staffFullName = full_name || username;
    const staffEmail = email || `${username}@bunbohuecodo.vn`;
    const staffRole = role || "staff";

    // Insert new staff member
    const result = await query(
      `INSERT INTO users (username, password, full_name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashedPassword,
        staffFullName,
        staffEmail,
        phone || null,
        staffRole,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Staff member added successfully",
      data: {
        id: (result as any).insertId,
        username,
        full_name: staffFullName,
        email: staffEmail,
        role: staffRole,
      },
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
