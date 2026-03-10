import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function verifyToken(req) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export async function GET(request, { params }) {
    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const [rows] = await pool.query(`SELECT * FROM publications WHERE id = ?`, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const admin = verifyToken(request);
    if (!admin) {
        return NextResponse.json({ error: 'Access denied.' }, { status: 401 });
    }

    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await pool.query(`DELETE FROM publications WHERE id = ?`, [id]);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const admin = verifyToken(request);
    if (!admin) {
        return NextResponse.json({ error: 'Access denied.' }, { status: 401 });
    }

    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const data = await request.json();

        // Handle images array, fallback to empty array
        const imagesList = data.images && Array.isArray(data.images) ? data.images : (data.image_url ? [data.image_url] : []);
        const imagesJson = JSON.stringify(imagesList);

        // Use first image as main image_url for backwards compatibility
        const mainImageUrl = imagesList.length > 0 ? imagesList[0] : '';

        const [result] = await pool.query(
            `UPDATE publications 
             SET title=?, description=?, price=?, image_url=?, images=?, location=?, type=?, operation=?, bedrooms=?, bathrooms=?, area=?, amenities=?, featured=?, subtipo=?, provincia=?, ciudad=?, area_covered=?, ambientes=?, toilettes=?, cocheras=?, video_url=?, plan_url=?, age=?, expenses=?, credit_apt=?
             WHERE id=?`,
            [data.title, data.description, data.price, mainImageUrl, imagesJson, data.location, data.type, data.operation, data.bedrooms, data.bathrooms, data.area, data.amenities, data.featured ? 1 : 0, data.subtipo, data.provincia, data.ciudad, data.area_covered, data.ambientes, data.toilettes, data.cocheras, data.video_url, data.plan_url, data.age, data.expenses, data.credit_apt ? 1 : 0, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Property updated' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
