import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
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
        return { error: `JWT Verification failed: ${err.message}` };
    }
}

export async function POST(request) {
    const authResult = verifyToken(request);
    if (authResult.error) {
        return NextResponse.json({ error: 'Access denied.', details: authResult.error }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        // Use getAll to handle multiple files sent with the same key
        const files = formData.getAll('files');

        // Fallback for single file upload backward compatibility
        const singleFile = formData.get('file');

        const allFilesToProcess = files.length > 0 ? files : (singleFile ? [singleFile] : []);

        if (allFilesToProcess.length === 0) {
            return NextResponse.json({ error: 'No files received.' }, { status: 400 });
        }

        const destinationDirPath = path.join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists
        try {
            await mkdir(destinationDirPath, { recursive: true });
        } catch (dirErr) {
            console.error("Error creating directory:", dirErr);
        }

        const uploadedUrls = [];

        // Process all files in parallel
        await Promise.all(allFilesToProcess.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const extension = path.extname(file.name) || '.jpg';
            const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;
            const relativeUrl = `/uploads/${filename}`;
            const filePath = path.join(destinationDirPath, filename);

            await writeFile(filePath, buffer);
            uploadedUrls.push(relativeUrl);
        }));

        // Return urls array
        return NextResponse.json({ urls: uploadedUrls, success: true });
    } catch (error) {
        console.error("Error uploading files:", error);
        return NextResponse.json({ error: 'Upload failed.', details: error.message }, { status: 500 });
    }
}
