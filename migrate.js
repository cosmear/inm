import { pool } from "./src/lib/db.js";

async function run() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to database. Creating table `leads`...");
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
        console.log("Migration successful!");
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}
run();
