import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Falta la variable de entorno JWT_SECRET");
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const [rows] = await pool.query(
            "SELECT * FROM admins WHERE username = ?",
            [username]
        );

        const admin = rows[0];

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            );
        }

        const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: "1h" });

        return NextResponse.json({ token });
    } catch (err) {
        console.error("LOGIN ERROR:", {
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
        });

        return NextResponse.json(
            {
                error: "Database error",
                detail: err.code || err.message,
            },
            { status: 500 }
        );
    }
}