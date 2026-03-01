import mysql from "mysql2/promise";

const dbConfig = {
    host: (process.env.DB_HOST || "localhost").trim(),
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER?.trim(),
    password: process.env.DB_PASSWORD?.trim(),
    database: process.env.DB_NAME?.trim(),
    waitForConnections: true,
    connectionLimit: 10,
};

if (!dbConfig.user || !dbConfig.password || !dbConfig.database) {
    throw new Error("Faltan variables de entorno de MySQL");
}

export const pool = mysql.createPool(dbConfig);