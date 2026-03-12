'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import AdminPropertyForm from '@/components/admin/AdminPropertyForm';

const initialFormState = {
    operation: 'Venta',
    type: '',
    subtipo: '',
    location: '',
    provincia: '',
    ciudad: '',
    lat: null,
    lng: null,
    ambientes: 0,
    bedrooms: 0,
    bathrooms: 0,
    toilettes: 0,
    cocheras: 0,
    age: 'Años de antigüedad',
    age_years: 0,
    area_covered: '',
    area: '',
    expenses: '',
    credit_apt: false,
    images: [], // Array of File objects or URLs
    video_url: '',
    plan_url: '', // This will hold the File object or local URL
    title: '',
    description: '',
    price: '',
    amenities: '',
    status: 'published'
};

export default function NuevaPropiedad() {
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!token) router.replace('/admin/login');
        }, 100);
        return () => clearTimeout(timer);
    }, [token, router]);

    const uploadFiles = async (filesArray) => {
        if (!filesArray || filesArray.length === 0) return [];

        const filesToUpload = filesArray.filter(f => f instanceof File);
        const existingUrls = filesArray.filter(f => typeof f === 'string');

        if (filesToUpload.length === 0) return existingUrls;

        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('files', file);
        });

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/upload?token=${token}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-access-token': token
            },
            body: formData
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(`Error subiendo archivos: ${errData.details || res.statusText}`);
        }
        const data = await res.json();
        return [...existingUrls, ...(data.urls || [])];
    };

    const uploadSingleFile = async (file) => {
        if (!file || typeof file === 'string') return file;
        const formData = new FormData();
        formData.append('file', file);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/upload?token=${token}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'x-access-token': token },
            body: formData
        });

        if (!res.ok) throw new Error('Error subiendo archivo');
        const data = await res.json();
        return data.urls ? data.urls[0] : data.url;
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            // Upload multiple images
            const finalImageUrls = await uploadFiles(formData.images);
            // Upload plan
            const finalPlanUrl = await uploadSingleFile(formData.plan_url);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'x-access-token': token
                },
                body: JSON.stringify({
                    ...formData,
                    images: finalImageUrls, 
                    plan_url: finalPlanUrl || '',
                    lat: formData.lat,
                    lng: formData.lng,
                    area: Number(formData.area) || 0,
                    area_covered: Number(formData.area_covered) || 0,
                    price: Number(formData.price) || 0,
                    expenses: Number(formData.expenses) || 0,
                    age: formData.age === 'Años de antigüedad' ? formData.age_years.toString() : formData.age
                })
            });

            if (res.ok) {
                alert('¡Publicación creada exitosamente!');
                router.push('/admin/dashboard');
            } else {
                alert('Error al agregar publicación.');
            }
        } catch (err) {
            console.error(err);
            alert(`Error al agregar publicación o subir imágenes: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!token) return null;

    return (
        <AdminPropertyForm 
            initialData={initialFormState}
            onSubmit={handleSubmit}
            isEditing={false}
            loading={loading}
        />
    );
}
