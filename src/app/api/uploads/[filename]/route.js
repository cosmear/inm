import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const filename = (await params).filename;

        // Define path to the file
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        // Read the file from the local file system
        const buffer = await readFile(filePath);

        // Determine content-type based on extension
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.pdf') contentType = 'application/pdf';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (e) {
        console.error("Error serving static file:", e);
        return new NextResponse('File not found', { status: 404 });
    }
}
