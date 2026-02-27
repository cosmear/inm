const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

// Initialize MySQL Tables
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS publications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price INT,
                image_url VARCHAR(500),
                location VARCHAR(255),
                type VARCHAR(100),
                operation VARCHAR(50), 
                bedrooms INT,
                bathrooms INT,
                area INT,
                amenities TEXT,
                featured BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE,
                password VARCHAR(255)
            )
        `);

        // Insert default admin if not exists (admin/admin123)
        const [admins] = await pool.query('SELECT * FROM admins WHERE username = ?', ['admin']);
        if (admins.length === 0) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync('admin123', salt);
            await pool.query(`INSERT INTO admins (username, password) VALUES (?, ?)`, ['admin', hash]);
            console.log('Default admin created.');
        }

        console.log('MySQL Database initialized.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
};

initDB();

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send({ error: 'Access denied.' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

// --- Routes ---

// Health check endpoint as requested
app.get("/api/health/db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");
        res.json({ ok: rows[0].ok });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Public: Get all publications with filtering
app.get('/api/publications', async (req, res) => {
    try {
        const { operation, type, minPrice, maxPrice, location, bedrooms } = req.query;
        let query = "SELECT * FROM publications WHERE 1=1";
        let params = [];

        if (operation) {
            query += " AND operation = ?";
            params.push(operation);
        }
        if (type) {
            query += " AND type = ?";
            params.push(type);
        }
        if (minPrice) {
            query += " AND price >= ?";
            params.push(parseInt(minPrice));
        }
        if (maxPrice) {
            query += " AND price <= ?";
            params.push(parseInt(maxPrice));
        }
        if (location) {
            query += " AND location LIKE ?";
            params.push(`%${location}%`);
        }
        if (bedrooms) {
            query += " AND bedrooms >= ?";
            params.push(parseInt(bedrooms));
        }

        query += " ORDER BY created_at DESC";

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await pool.query("SELECT * FROM admins WHERE username = ?", [username]);
        const admin = rows[0];

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Add publication
app.post('/api/publications', auth, async (req, res) => {
    try {
        const data = req.body;
        const [result] = await pool.query(
            `INSERT INTO publications (title, description, price, image_url, location, type, operation, bedrooms, bathrooms, area, amenities, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.title, data.description, data.price, data.image_url, data.location, data.type, data.operation, data.bedrooms, data.bathrooms, data.area, data.amenities, data.featured ? 1 : 0]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete publication
app.delete('/api/publications/:id', auth, async (req, res) => {
    try {
        await pool.query(`DELETE FROM publications WHERE id = ?`, [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Configuración Full-Stack (Servir Frontend desde Node) ---
import path from 'path';
import { fileURLToPath } from 'url';

// Configuramos las variables de directorio de ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apuntamos a la carpeta 'build' dentro de 'client'
const clientBuildPath = path.join(__dirname, '../client/build');

// Servimos los archivos estáticos de React
app.use(express.static(clientBuildPath));

// Cualquier otra ruta que no empiece con /api, devuelve el index.html del React (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
