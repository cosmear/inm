import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

const JWT_SECRET = process.env.JWT_SECRET;

import { verifyAdminToken } from '@/lib/auth';

export async function POST(request) {
    const authResult = verifyAdminToken(request);
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
        const uploadPromises = allFilesToProcess.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
            const relativeUrl = `/api/uploads/${filename}`;
            const filePath = path.join(destinationDirPath, filename);

            try {
                // Determine if file is an image based on mimetype or extension
                const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);

                if (isImage) {
                    // Compress and convert to webp using sharp
                    await sharp(buffer)
                        .webp({ quality: 80 }) // 80% quality is a very good balance between size and detail
                        .toFile(filePath);
                } else {
                    // For non-images (like PDFs, plans), just write it as standard, keeping original extension
                    const originalExt = path.extname(file.name);
                    const docFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${originalExt}`;
                    const docFilePath = path.join(destinationDirPath, docFilename);
                    const docRelativeUrl = `/api/uploads/${docFilename}`;

                    await writeFile(docFilePath, buffer);
                    return docRelativeUrl;
                }
            } catch (err) {
                console.error("Error processing file:", file.name, err);
                // Fallback to direct write if sharp fails (e.g. damaged image)
                await writeFile(filePath, buffer);
            }

            return relativeUrl;
        });

        const urls = await Promise.all(uploadPromises);
        uploadedUrls.push(...urls);

        // Return urls array
        return NextResponse.json({ urls: uploadedUrls, success: true });
    } catch (error) {
        console.error("Error uploading files:", error);
        return NextResponse.json({ error: 'Upload failed.', details: error.message }, { status: 500 });
    }
}
