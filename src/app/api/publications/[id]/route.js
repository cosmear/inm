import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const extractFilenamesFromUrls = (urls) => {
    return urls
        .filter(url => url && typeof url === 'string' && url.includes('/storage/v1/object/public/propiedades/'))
        .map(url => {
            const parts = url.split('/');
            return decodeURIComponent(parts[parts.length - 1]);
        });
};

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

import { verifyAdminToken } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const [rows] = await pool.query(`SELECT * FROM publications WHERE id = ?`, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
        return NextResponse.json({ error: 'Access denied.' }, { status: 401 });
    }

    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        // Retrieve existing files to delete from bucket
        const [rows] = await pool.query(`SELECT images, plan_url FROM publications WHERE id = ?`, [id]);
        if (rows.length > 0) {
            const prop = rows[0];
            let allUrls = [];
            try {
                if (prop.images) {
                    const parsed = typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images;
                    if (Array.isArray(parsed)) allUrls.push(...parsed);
                }
            } catch (e) {}
            if (prop.plan_url) allUrls.push(prop.plan_url);
            
            const filesToDelete = extractFilenamesFromUrls(allUrls);
            if (filesToDelete.length > 0) {
                const { error } = await supabaseAdmin.storage.from('propiedades').remove(filesToDelete);
                if (error) console.error("Error deleting files from Supabase:", error);
            }
        }

        await pool.query(`DELETE FROM publications WHERE id = ?`, [id]);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
        return NextResponse.json({ error: 'Access denied.' }, { status: 401 });
    }

    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const data = await request.json();

        // 1. Get current files to find any deleted images
        const [rows] = await pool.query(`SELECT images, plan_url FROM publications WHERE id = ?`, [id]);
        if (rows.length > 0) {
            const oldProp = rows[0];
            let oldUrls = [];
            try {
                if (oldProp.images) {
                    const parsed = typeof oldProp.images === 'string' ? JSON.parse(oldProp.images) : oldProp.images;
                    if (Array.isArray(parsed)) oldUrls.push(...parsed);
                }
            } catch(e) {}
            if (oldProp.plan_url) oldUrls.push(oldProp.plan_url);

            // 2. Get incoming files
            const incomingImages = data.images && Array.isArray(data.images) ? data.images : (data.image_url ? [data.image_url] : []);
            let newUrls = [...incomingImages];
            if (data.plan_url) newUrls.push(data.plan_url);

            // 3. Find missing URLs
            const missingUrls = oldUrls.filter(url => !newUrls.includes(url));
            const filesToDelete = extractFilenamesFromUrls(missingUrls);

            // 4. Delete missing files from bucket
            if (filesToDelete.length > 0) {
                const { error } = await supabaseAdmin.storage.from('propiedades').remove(filesToDelete);
                if (error) console.error("Error deleting orphaned files from Supabase:", error);
            }
        }

        // Handle images array, fallback to empty array
        const imagesList = data.images && Array.isArray(data.images) ? data.images : (data.image_url ? [data.image_url] : []);
        const imagesJson = JSON.stringify(imagesList);

        // Use first image as main image_url for backwards compatibility
        const mainImageUrl = imagesList.length > 0 ? imagesList[0] : '';

        const [result] = await pool.query(
            `UPDATE publications 
             SET title=?, description=?, price=?, image_url=?, images=?, location=?, type=?, operation=?, bedrooms=?, bathrooms=?, area=?, amenities=?, featured=?, subtipo=?, provincia=?, ciudad=?, area_covered=?, ambientes=?, toilettes=?, cocheras=?, video_url=?, plan_url=?, age=?, expenses=?, credit_apt=?, status=?, lat=?, lng=?
             WHERE id=?`,
            [data.title, data.description, data.price, mainImageUrl, imagesJson, data.location, data.type, data.operation, data.bedrooms, data.bathrooms, data.area, data.amenities, data.featured ? 1 : 0, data.subtipo, data.provincia, data.ciudad, data.area_covered, data.ambientes, data.toilettes, data.cocheras, data.video_url, data.plan_url, data.age, data.expenses, data.credit_apt ? 1 : 0, data.status || 'published', data.lat || null, data.lng || null, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Property updated' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
