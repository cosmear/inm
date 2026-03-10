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
        return { error: "Missing token in headers and query" };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { decoded };
    } catch (err) {
        return { error: `JWT Verification failed: ${err.message}. Token length: ${token.length}. Secret present: ${!!JWT_SECRET}` };
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        let query = "SELECT * FROM publications WHERE 1=1";
        let params = [];

        const operation = searchParams.get('operation');
        const type = searchParams.get('type');
        const subtipo = searchParams.get('subtipo');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const location = searchParams.get('location');
        const provincia = searchParams.get('provincia');
        const ciudad = searchParams.get('ciudad');
        const bedrooms = searchParams.get('bedrooms');
        const ambientes = searchParams.get('ambientes');
        const cocheras = searchParams.get('cocheras');
        const toilettes = searchParams.get('toilettes');
        const amenities = searchParams.getAll('amenities'); // expects ?amenities=Pileta&amenities=Cochera

        // Pagination
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 24; // Default to 24 items per page
        const offset = (page - 1) * limit;

        if (operation) {
            query += " AND operation = ?";
            params.push(operation);
        }
        if (type) {
            query += " AND type = ?";
            params.push(type);
        }
        if (subtipo) {
            query += " AND subtipo = ?";
            params.push(subtipo);
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
        if (provincia) {
            query += " AND provincia = ?";
            params.push(provincia);
        }
        if (ciudad) {
            query += " AND ciudad LIKE ?";
            params.push(`%${ciudad}%`);
        }
        if (bedrooms) {
            query += " AND bedrooms >= ?";
            params.push(parseInt(bedrooms));
        }
        if (ambientes) {
            query += " AND ambientes >= ?";
            params.push(parseInt(ambientes));
        }
        if (cocheras) {
            query += " AND cocheras >= ?";
            params.push(parseInt(cocheras));
        }
        if (toilettes) {
            query += " AND toilettes >= ?";
            params.push(parseInt(toilettes));
        }

        if (amenities && amenities.length > 0) {
            // Check that the features field contains EACH of the requested amenities
            amenities.forEach(amenity => {
                query += " AND amenities LIKE ?";
                params.push(`%${amenity}%`);
            });
        }

        // 1. Get total count for pagination metadata
        const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // 2. Fetch the paginated rows
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [rows] = await pool.query(query, params);

        return NextResponse.json({
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    const authResult = verifyToken(request);
    if (authResult.error) {
        return NextResponse.json({ error: 'Access denied.', details: authResult.error }, { status: 401 });
    }
    const admin = authResult.decoded;

    try {
        const data = await request.json();

        // Handle images array, fallback to empty array
        const imagesList = data.images && Array.isArray(data.images) ? data.images : (data.image_url ? [data.image_url] : []);
        const imagesJson = JSON.stringify(imagesList);

        // Use first image as main image_url for backwards compatibility
        const mainImageUrl = imagesList.length > 0 ? imagesList[0] : '';

        const [result] = await pool.query(
            `INSERT INTO publications (title, description, price, image_url, images, location, type, operation, bedrooms, bathrooms, area, amenities, featured, subtipo, provincia, ciudad, area_covered, ambientes, toilettes, cocheras, video_url, plan_url, age, expenses, credit_apt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.title, data.description, data.price, mainImageUrl, imagesJson, data.location, data.type, data.operation, data.bedrooms, data.bathrooms, data.area, data.amenities, data.featured ? 1 : 0, data.subtipo, data.provincia, data.ciudad, data.area_covered, data.ambientes, data.toilettes, data.cocheras, data.video_url, data.plan_url, data.age, data.expenses, data.credit_apt ? 1 : 0]
        );
        return NextResponse.json({ id: result.insertId });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
