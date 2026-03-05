import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Falta la variable de entorno JWT_SECRET");
}

// Helper for Auth extraction
function verifyToken(req) {
    let token = null;

    // Try standard Authorization header
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    // Try custom header
    if (!token) {
        token = req.headers.get('x-access-token');
    }

    // Try URL query parameter
    if (!token) {
        try {
            const url = new URL(req.url);
            token = url.searchParams.get('token');
        } catch (e) {
            // Ignore URL parsing errors
        }
    }

    if (!token) {
        console.error("verifyToken: Missing token in headers and query");
        return null;
    }

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("verifyToken: JWT Verification failed:", err.message);
        return null;
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        let query = "SELECT * FROM publications WHERE 1=1";
        let params = [];

        const operation = searchParams.get('operation');
        const type = searchParams.get('type');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const location = searchParams.get('location');
        const bedrooms = searchParams.get('bedrooms');

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
        return NextResponse.json(rows);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    const admin = verifyToken(request);
    if (!admin) {
        return NextResponse.json({ error: 'Access denied.' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const [result] = await pool.query(
            `INSERT INTO publications (title, description, price, image_url, location, type, operation, bedrooms, bathrooms, area, amenities, featured, subtipo, provincia, ciudad, area_covered, ambientes, toilettes, cocheras, video_url, plan_url, age, expenses, credit_apt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.title, data.description, data.price, data.image_url, data.location, data.type, data.operation, data.bedrooms, data.bathrooms, data.area, data.amenities, data.featured ? 1 : 0, data.subtipo, data.provincia, data.ciudad, data.area_covered, data.ambientes, data.toilettes, data.cocheras, data.video_url, data.plan_url, data.age, data.expenses, data.credit_apt ? 1 : 0]
        );
        return NextResponse.json({ id: result.insertId });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
