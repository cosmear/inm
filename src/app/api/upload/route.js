import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import path from 'path';
import { supabase, supabaseAdmin } from '@/lib/supabaseAdmin';

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

        const uploadedUrls = [];

        // Process all files in parallel
        const uploadPromises = allFilesToProcess.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);
            
            let finalBuffer = buffer;
            let filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            let contentType = file.type;

            try {
                if (isImage) {
                    // Compress and convert to webp using sharp
                    finalBuffer = await sharp(buffer)
                        .webp({ quality: 80 })
                        .toBuffer();
                    filename += '.webp';
                    contentType = 'image/webp';
                } else {
                    const originalExt = path.extname(file.name);
                    filename += originalExt;
                }

                // Upload to Supabase Storage using the Admin client to bypass RLS
                const { data: uploadData, error: uploadError } = await supabaseAdmin
                    .storage
                    .from('propiedades')
                    .upload(filename, finalBuffer, {
                        contentType: contentType,
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    throw uploadError;
                }

                // Get public URL (Safe to use normal client or admin client here, 
                // but we fetch the URL as an anonymous user to ensure it's truly public)
                const { data: { publicUrl } } = supabaseAdmin
                    .storage
                    .from('propiedades')
                    .getPublicUrl(filename);

                return publicUrl;
                
            } catch (err) {
                console.error("Error processing/uploading file:", file.name, err);
                throw err;
            }
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
