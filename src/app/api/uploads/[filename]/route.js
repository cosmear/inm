import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(request, { params }) {
    try {
        const { filename } = await params;

        if (!filename) {
            return new NextResponse('Filename is required', { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        if (!existsSync(filePath)) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const fileBuffer = await readFile(filePath);

        // Determine content type
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
