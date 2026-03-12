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

// We don't throw an error immediately during module evaluation so Next.js build can succeed.
// It will throw when trying to create a pool if not provided.
let poolInstance = null;

try {
    if (dbConfig.user && dbConfig.password && dbConfig.database) {
        poolInstance = mysql.createPool(dbConfig);
    }
} catch (error) {
    console.warn("MySQL pool could not be initialized:", error.message);
}

// Proxied pool that will throw the error when a query is actually executed.
export const pool = new Proxy({}, {
    get: function(target, prop) {
        if (!poolInstance) {
            return () => { throw new Error("Faltan variables de entorno de MySQL"); };
        }
        return poolInstance[prop];
    }
});