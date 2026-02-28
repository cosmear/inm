import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");
        return NextResponse.json({ ok: rows[0].ok });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
