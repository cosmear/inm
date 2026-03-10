import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const connection = await pool.getConnection();

        // Crear tabla de leads si no existe
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
                FOREIGN KEY (property_id) REFERENCES publications(id) ON DELETE SET NULL
            )
        `);

        connection.release();

        return NextResponse.json({ message: "Migración de base de datos exitosa" }, { status: 200 });
    } catch (error) {
        console.error("Error en migración:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
