// src/app/api/reservations/[id]/route.ts - API chi tiết đặt bàn
import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { sendReservationStatusEmail } from "@/lib/email";

// Cập nhật trạng thái đặt bàn
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { status, table_number } = body;

    // Lấy thông tin đặt bàn trước khi update
    const reservation: any = await queryOne(
      "SELECT * FROM reservations WHERE id = ?",
      [id]
    );

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đặt bàn" },
        { status: 404 }
      );
    }

    let sql = "UPDATE reservations SET updated_at = CURRENT_TIMESTAMP";
    const updateParams: any[] = [];

    if (status) {
      sql += ", status = ?";
      updateParams.push(status);
    }

    if (table_number) {
      sql += ", table_number = ?";
      updateParams.push(table_number);
    }

    sql += " WHERE id = ?";
    updateParams.push(id);

    await query(sql, updateParams);

    // Gửi email nếu có thay đổi trạng thái và có email
    if (status && reservation.customer_email) {
      try {
        await sendReservationStatusEmail(
          reservation.customer_email,
          reservation.reservation_number,
          reservation.customer_name,
          status,
          reservation.reservation_date,
          reservation.reservation_time,
          reservation.number_of_guests
        );

        // Lưu log email
        await query(
          `INSERT INTO email_logs (reservation_id, email, subject, status) 
           VALUES (?, ?, ?, ?)`,
          [
            id,
            reservation.customer_email,
            `Cập nhật đặt bàn #${reservation.reservation_number}`,
            "sent",
          ]
        );
      } catch (emailError) {
        console.error("Error sending reservation status email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật đặt bàn thành công",
    });
  } catch (error: any) {
    console.error("Reservation PATCH Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật đặt bàn",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Xóa đặt bàn
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await query("DELETE FROM reservations WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Xóa đặt bàn thành công",
    });
  } catch (error: any) {
    console.error("Reservation DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể xóa đặt bàn",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
