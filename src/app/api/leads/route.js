import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { property_id, name, email, phone, message } = await req.json();

        if (!name || !email || !phone || !message) {
            return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // Asegurarnos de que la tabla existe por si la migración no se corrió manualmente
        await connection.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                property_id INT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                message TEXT,
                status ENUM('new', 'contacted', 'discarded') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
            )
        `);

        // Insertar el nuevo lead
        const [result] = await connection.query(
            "INSERT INTO leads (property_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
            [property_id || null, name, email, phone, message]
        );

        connection.release();

        return NextResponse.json({ success: true, leadId: result.insertId }, { status: 201 });
    } catch (error) {
        console.error("Error al guardar lead:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
