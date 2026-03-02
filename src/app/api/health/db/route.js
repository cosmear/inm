import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const config = {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "",
    };

    const connection = await mysql.createConnection(config);
    const [rows] = await connection.query("SELECT 1 AS ok");
    await connection.end();

    return NextResponse.json({
      success: true,
      config: {
        host: config.host,
        port: config.port,
        user: config.user,
        database: config.database,
      },
      rows,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
        code: err.code || null,
        errno: err.errno || null,
        sqlState: err.sqlState || null,
        sqlMessage: err.sqlMessage || null,
      },
      { status: 500 }
    );
  }
}