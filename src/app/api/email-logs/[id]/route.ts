import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete email log
    await query(`DELETE FROM email_logs WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "Email log deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting email log:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete email log",
      },
      { status: 500 }
    );
  }
}
