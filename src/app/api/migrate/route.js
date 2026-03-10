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

        // Añadir columna status a publications si no existe
        try {
            await connection.query(`
                ALTER TABLE publications 
                ADD COLUMN status ENUM('published', 'draft', 'reserved', 'sold') DEFAULT 'published'
            `);
            console.log("Columna status añadida a publications");
        } catch (error) {
            // Error 1060 es ER_DUP_FIELDNAME (la columna ya existe)
            if (error.errno !== 1060) {
                throw error;
            }
        }

        connection.release();

        return NextResponse.json({ message: "Migración de base de datos exitosa" }, { status: 200 });
    } catch (error) {
        console.error("Error en migración:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
