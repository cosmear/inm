import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("DESCRIBE properties");
        connection.release();
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
