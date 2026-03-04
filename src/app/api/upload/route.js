import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Helper to verify admin token before allowing uploads
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

export async function POST(request) {
    const admin = verifyToken(request);
    if (!admin) {
        return NextResponse.json({ error: 'Access denied.' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure a safe, unique filename
        const extension = path.extname(file.name) || '.jpg';
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;
        const relativeUrl = `/uploads/${filename}`;

        // Save to public/uploads
        // In Next.js App Router, process.cwd() is the root of the project
        const destinationDirPath = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(destinationDirPath, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({ url: relativeUrl, success: true });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
    }
}
