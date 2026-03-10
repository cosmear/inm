import { pool } from "./src/lib/db.js";

async function run() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("DESCRIBE properties");
        console.table(rows);
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
run();
