'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import AdminPropertyForm from '@/components/admin/AdminPropertyForm';

const emptyFormState = {
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
    images: [],
    video_url: '',
    plan_url: '',
    title: '',
    description: '',
    price: '',
    amenities: '',
    status: 'published'
};

export default function EditarPropiedad() {
    const { token, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [fetchingBaseData, setFetchingBaseData] = useState(true);
    const [initialData, setInitialData] = useState(emptyFormState);

    useEffect(() => {
        if (!authLoading && !token) {
            router.replace('/admin/login');
        }
    }, [token, authLoading, router]);

    useEffect(() => {
        if (id && token) {
            fetchPropertyData();
        }
    }, [id, token]);

    const fetchPropertyData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications/${id}`);
            if (!res.ok) throw new Error("Propiedad no encontrada");
            const data = await res.json();

            let parsedImages = [];
            if (data.images) {
                try {
                    parsedImages = JSON.parse(data.images);
                } catch (e) {
                    parsedImages = typeof data.images === 'string' ? [data.images] : [];
                }
            } else if (data.image_url) {
                parsedImages = [data.image_url];
            }

            setInitialData({
                operation: data.operation || 'Venta',
                type: data.type || '',
                subtipo: data.subtipo || '',
                location: data.location || '',
                provincia: data.provincia || '',
                ciudad: data.ciudad || '',
                lat: data.lat || null,
                lng: data.lng || null,
                ambientes: data.ambientes || 0,
                bedrooms: data.bedrooms || 0,
                bathrooms: data.bathrooms || 0,
                toilettes: data.toilettes || 0,
                cocheras: data.cocheras || 0,
                age: (data.age === 'A estrenar' || data.age === 'En construcción') ? data.age : 'Años de antigüedad',
                age_years: (data.age !== 'A estrenar' && data.age !== 'En construcción') ? parseInt(data.age) || 0 : 0,
                area_covered: data.area_covered || '',
                area: data.area || '',
                expenses: data.expenses || '',
                credit_apt: data.credit_apt === 1 || data.credit_apt === true,
                images: parsedImages,
                video_url: data.video_url || '',
                plan_url: data.plan_url || '',
                title: data.title || '',
                description: data.description || '',
                price: data.price || '',
                amenities: data.amenities || '',
                status: data.status || 'published'
            });

        } catch (err) {
            alert(err.message);
            router.push('/admin/dashboard');
        } finally {
            setFetchingBaseData(false);
        }
    };

    const uploadFiles = async (filesArray) => {
        if (!filesArray || filesArray.length === 0) return [];
        const filesToUpload = filesArray.filter(f => f instanceof File);
        const existingUrls = filesArray.filter(f => typeof f === 'string');
        if (filesToUpload.length === 0) return existingUrls;

        const formData = new FormData();
        filesToUpload.forEach(file => { formData.append('files', file); });

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/upload?token=${token}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'x-access-token': token },
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
            const finalImageUrls = await uploadFiles(formData.images);
            const finalPlanUrl = await uploadSingleFile(formData.plan_url);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications/${id}?token=${token}`, {
                method: 'PUT',
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
                alert('¡Publicación actualizada exitosamente!');
                router.push('/admin/dashboard');
            } else {
                alert('Error al actualizar la publicación.');
            }
        } catch (err) {
            console.error(err);
            alert(`Error al guardar cambios: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || fetchingBaseData) {
        return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }
    if (!token) return null;

    return (
        <AdminPropertyForm 
            initialData={initialData}
            onSubmit={handleSubmit}
            isEditing={true}
            loading={loading}
        />
    );
}
