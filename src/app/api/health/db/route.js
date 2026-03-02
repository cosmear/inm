import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");

    return NextResponse.json({
      success: true,
      rows,
    });
  } catch (err) {
    console.error("TEST DB ERROR:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
    });

    return NextResponse.json(
      {
        success: false,
        error: err.message,
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage,
      },
      { status: 500 }
    );
  }
}