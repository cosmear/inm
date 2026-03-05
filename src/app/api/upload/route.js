import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Helper to verify admin token before allowing uploads
function verifyToken(req) {
    let token = null;

    // Try standard Authorization header
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    // Try custom header (less likely to be stripped by shared hosting)
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

export async function POST(request) {
    const authResult = verifyToken(request);
    if (authResult.error) {
        return NextResponse.json({ error: 'Access denied.', details: authResult.error }, { status: 401 });
    }
    const admin = authResult.decoded;

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
