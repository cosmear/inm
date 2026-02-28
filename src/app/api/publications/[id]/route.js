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
