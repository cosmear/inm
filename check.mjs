import mysql from 'mysql2/promise';
import fs from 'fs';

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length) env[key.trim()] = vals.join('=').trim();
    });

    const connection = await mysql.createConnection({
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        port: Number(env.DB_PORT || 3306)
    });

    try {
        const [rows] = await connection.query("DESCRIBE properties");
        console.log("SCHEMA:", JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}

run();
