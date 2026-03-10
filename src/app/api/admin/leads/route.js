import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req) {
    let token = null;
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    }
    if (!token) token = req.headers.get("x-access-token");
    if (!token) {
        try {
            const url = new URL(req.url);
            token = url.searchParams.get("token");
        } catch (e) { }
    }
    if (!token) return { error: "Missing token" };

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { decoded };
    } catch (err) {
        return { error: `JWT Verification failed: ${err.message}` };
    }
}

export async function GET(request) {
    const authResult = verifyToken(request);
    if (authResult.error) {
        return NextResponse.json({ error: "Access denied.", details: authResult.error }, { status: 401 });
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(`
            SELECT l.*, p.title as property_title 
            FROM leads l
            LEFT JOIN publications p ON l.property_id = p.id
            ORDER BY l.created_at DESC
        `);
        connection.release();
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function PATCH(request) {
    const authResult = verifyToken(request);
    if (authResult.error) {
        return NextResponse.json({ error: "Access denied.", details: authResult.error }, { status: 401 });
    }

    try {
        const { id, status } = await request.json();
        if (!id || !status) {
            return NextResponse.json({ error: "ID y status son requeridos." }, { status: 400 });
        }

        const validStatuses = ['new', 'contacted', 'discarded'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Status inválido." }, { status: 400 });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(`UPDATE leads SET status = ? WHERE id = ?`, [status, id]);
        connection.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Lead actualizado correctamente." });
    } catch (error) {
        console.error("Error updating lead:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
