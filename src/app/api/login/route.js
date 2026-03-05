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

        if (!username || !password) {
            return NextResponse.json(
                { error: "Faltan username o password" },
                { status: 400 }
            );
        }

        const [rows] = await pool.query(
            "SELECT * FROM admins WHERE username = ?",
            [username]
        );

        if (!rows || rows.length === 0) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 400 }
            );
        }

        const admin = rows[0];

        if (!admin.password) {
            return NextResponse.json(
                { error: "El usuario no tiene password en la base" },
                { status: 500 }
            );
        }

        const passwordOk = bcrypt.compareSync(password, admin.password);

        if (!passwordOk) {
            return NextResponse.json(
                { error: "Password incorrecta o no está hasheada con bcrypt" },
                { status: 400 }
            );
        }

        const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: "24h" });

        return NextResponse.json({ token });
    } catch (err) {
        console.error("LOGIN ERROR:", err);

        return NextResponse.json(
            {
                error: "LOGIN_BACKEND_ERROR",
                message: err.message,
                code: err.code || null,
                errno: err.errno || null,
                sqlState: err.sqlState || null,
            },
            { status: 500 }
        );
    }
}