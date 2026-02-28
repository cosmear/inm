import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const [rows] = await pool.query("SELECT * FROM admins WHERE username = ?", [username]);
        const admin = rows[0];

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ token });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
