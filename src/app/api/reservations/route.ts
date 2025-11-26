// src/app/api/reservations/route.ts - API đặt bàn
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendReservationConfirmationEmail } from "@/lib/email";

// Lấy danh sách đặt bàn
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    let sql = "SELECT * FROM reservations WHERE 1=1";
    const params: any[] = [];

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    if (date) {
      sql += " AND reservation_date = ?";
      params.push(date);
    }

    sql += " ORDER BY reservation_date DESC, reservation_time DESC";

    const reservations = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: reservations,
    });
  } catch (error: any) {
    console.error("Reservations GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải danh sách đặt bàn",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Tạo đặt bàn mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      reservation_date,
      reservation_time,
      number_of_guests,
      special_requests,
    } = body;

    // Tạo reservation number
    const reservationNumber = `RES${Date.now()}${Math.floor(
      Math.random() * 1000
    )}`;

    const sql = `
      INSERT INTO reservations (
        reservation_number, customer_name, customer_phone, customer_email,
        reservation_date, reservation_time, number_of_guests, special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      reservationNumber,
      customer_name,
      customer_phone,
      customer_email || null,
      reservation_date,
      reservation_time,
      number_of_guests,
      special_requests || null,
    ]);

    // Gửi email xác nhận nếu có email
    if (customer_email) {
      try {
        await sendReservationConfirmationEmail(
          customer_email,
          reservationNumber,
          customer_name,
          reservation_date,
          reservation_time,
          number_of_guests,
          special_requests
        );

        // Lưu log email
        await query(
          `INSERT INTO email_logs (reservation_id, email, subject, status) 
           VALUES ((SELECT id FROM reservations WHERE reservation_number = ?), ?, ?, ?)`,
          [
            reservationNumber,
            customer_email,
            `Xác nhận đặt bàn #${reservationNumber} - Bún Bò Huế Cố Đô`,
            "sent",
          ]
        );
      } catch (emailError) {
        console.error("Error sending reservation email:", emailError);
        // Không throw error, vẫn trả về success cho việc đặt bàn
      }
    }

    return NextResponse.json({
      success: true,
      message: "Đặt bàn thành công",
      data: { reservationNumber },
    });
  } catch (error: any) {
    console.error("Reservations POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể đặt bàn", details: error.message },
      { status: 500 }
    );
  }
}
