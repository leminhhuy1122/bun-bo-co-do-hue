import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete SMS log
    await query(`DELETE FROM sms_logs WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "SMS log deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting SMS log:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete SMS log",
      },
      { status: 500 }
    );
  }
}
