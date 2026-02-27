const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

// Database Setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    // Publications table with all professional fields
    db.run(`CREATE TABLE IF NOT EXISTS publications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price INTEGER,
        image_url TEXT,
        location TEXT,
        type TEXT,
        operation TEXT, -- 'Comprar' or 'Alquilar'
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        amenities TEXT, -- JSON string
        featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Admin table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Insert default admin if not exists (admin/admin123)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`, ['admin', hash]);
});

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

// Public: Get all publications with filtering
app.get('/api/publications', (req, res) => {
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

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM admins WHERE username = ?", [username], (err, admin) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Admin: Add publication
app.post('/api/publications', auth, (req, res) => {
    const { title, description, price, image_url, location, type, operation, bedrooms, bathrooms, area, amenities, featured } = req.query; // Fallback to body if not in query
    const data = req.body;
    db.run(`INSERT INTO publications (title, description, price, image_url, location, type, operation, bedrooms, bathrooms, area, amenities, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.title, data.description, data.price, data.image_url, data.location, data.type, data.operation, data.bedrooms, data.bathrooms, data.area, data.amenities, data.featured ? 1 : 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

// Admin: Delete publication
app.delete('/api/publications/:id', auth, (req, res) => {
    db.run(`DELETE FROM publications WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
