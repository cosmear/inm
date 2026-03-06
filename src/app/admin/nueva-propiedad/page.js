'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyTypes, provinces } from '@/lib/constants';

const steps = [
    { id: 1, name: 'Principales' },
    { id: 2, name: 'Ubicación' },
    { id: 3, name: 'Características' },
    { id: 4, name: 'Multimedia y Publicar' }
];



export default function NuevaPropiedad() {
    const { token } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        operation: 'Venta',
        type: '',
        subtipo: '',
        location: '',
        provincia: '',
        ciudad: '',
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
        amenities: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!token) router.replace('/admin/login');
        }, 100);
        return () => clearTimeout(timer);
    }, [token, router]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleNumberChange = (field, delta) => {
        setForm(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + delta)
        }));
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleMultipleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setForm(prev => ({
                ...prev,
                images: [...prev.images, ...files]
            }));
        }
        // Reset the input so the same files can be selected again if needed
        e.target.value = null;
    };

    const removeImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, [e.target.name]: file });
        }
    };

    const uploadFiles = async (filesArray) => {
        if (!filesArray || filesArray.length === 0) return [];

        // Filter out files that are already URLs (strings) vs actual File objects
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
            console.error("Upload Error:", errData);
            throw new Error(`Error subiendo archivos: ${errData.details || res.statusText}`);
        }
        const data = await res.json();
        return [...existingUrls, ...(data.urls || [])];
    };

    // For single files like plan_url
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

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            // Upload multiple images
            const finalImageUrls = await uploadFiles(form.images);

            // Upload plan
            const finalPlanUrl = await uploadSingleFile(form.plan_url);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'x-access-token': token
                },
                body: JSON.stringify({
                    ...form,
                    images: finalImageUrls, // Send the array
                    plan_url: finalPlanUrl || '',
                    area: Number(form.area) || 0,
                    area_covered: Number(form.area_covered) || 0,
                    price: Number(form.price) || 0,
                    expenses: Number(form.expenses) || 0,
                    age: form.age === 'Años de antigüedad' ? form.age_years.toString() : form.age
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
        <div className="bg-cream min-h-screen font-display flex flex-col">
            {/* Top Navigation */}
            <div className="bg-white border-b border-stone-dark/10 sticky top-0 z-10 w-full pt-20">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between relative">
                    {/* Progress Bar */}
                    <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-stone-dark/10 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div
                        className="absolute top-1/2 left-6 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-300 rounded-full"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    ></div>

                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentStep >= step.id ? 'bg-primary text-white' : 'bg-stone-dark/10 text-stone-dark/40'
                                }`}>
                                {currentStep > step.id ? '✓' : step.id}
                            </div>
                            <span className={`text-[10px] uppercase tracking-wider font-medium hidden md:block ${currentStep >= step.id ? 'text-primary' : 'text-stone-dark/40'
                                }`}>{step.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full flex flex-col md:flex-row gap-8 items-start">

                {/* Sidebar Menu (Desktop) */}
                <aside className="w-full md:w-64 shrink-0 bg-stone-50 rounded-2xl p-4 hidden md:block border border-stone-dark/5 shadow-sm sticky top-40">
                    <ul className="space-y-2">
                        <li className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${currentStep === 1 ? 'bg-white shadow-sm border-l-2 border-primary text-stone-dark' : 'text-stone-dark/60 hover:bg-stone-100'}`} onClick={() => setCurrentStep(1)}>
                            Operación y tipo
                        </li>
                        <li className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${currentStep === 2 ? 'bg-white shadow-sm border-l-2 border-primary text-stone-dark' : 'text-stone-dark/60 hover:bg-stone-100'}`} onClick={() => setCurrentStep(1 < currentStep ? 2 : currentStep)}>
                            Ubicación
                        </li>
                        <li className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${currentStep === 3 ? 'bg-white shadow-sm border-l-2 border-primary text-stone-dark' : 'text-stone-dark/60 hover:bg-stone-100'}`} onClick={() => setCurrentStep(2 < currentStep ? 3 : currentStep)}>
                            Características
                        </li>
                        <li className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${currentStep === 4 ? 'bg-white shadow-sm border-l-2 border-primary text-stone-dark' : 'text-stone-dark/60 hover:bg-stone-100'}`} onClick={() => setCurrentStep(3 < currentStep ? 4 : currentStep)}>
                            Multimedia
                        </li>
                    </ul>
                </aside>

                {/* Main Content Area */}
                <div className="flex-grow w-full">
                    <h1 className="text-2xl font-serif text-stone-dark mb-8">
                        {currentStep === 1 && '¡Hola, empecemos a crear tu aviso!'}
                        {currentStep === 2 && '¿Dónde está ubicada tu propiedad?'}
                        {currentStep === 3 && 'Características principales'}
                        {currentStep === 4 && 'Detalles y Multimedia'}
                    </h1>

                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-dark/5 min-h-[400px] flex flex-col justify-between">

                        <div className="space-y-8 flex-grow">
                            {/* Step 1: Operación y Tipo */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-lg font-medium text-stone-dark mb-4">Contanos, ¿qué querés publicar?</h2>

                                    <div>
                                        <label className="text-xs font-medium text-stone-dark/60 block mb-3">Tipo de operación</label>
                                        <div className="flex flex-wrap gap-0 border border-stone-dark/20 rounded-xl overflow-hidden w-fit">
                                            {['Venta', 'Alquiler', 'Temporada'].map(op => (
                                                <button
                                                    key={op}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, operation: op })}
                                                    className={`px-6 py-2.5 text-sm font-medium border-r border-stone-dark/20 last:border-r-0 transition-colors ${form.operation === op ? 'text-primary bg-primary/5' : 'text-stone-dark/70 hover:bg-stone-50'}`}
                                                >
                                                    {op}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Tipo de propiedad</label>
                                            <select
                                                name="type"
                                                value={form.type}
                                                onChange={(e) => {
                                                    setForm({ ...form, type: e.target.value, subtipo: '' })
                                                }}
                                                className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                            >
                                                <option value="">Seleccioná el tipo de propiedad</option>
                                                {Object.keys(propertyTypes).map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Subtipo de propiedad</label>
                                            <select
                                                name="subtipo"
                                                value={form.subtipo}
                                                onChange={handleChange}
                                                disabled={!form.type || propertyTypes[form.type]?.length === 0}
                                                className="w-full bg-white border border-stone-dark/20 disabled:bg-stone-100 disabled:opacity-60 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                            >
                                                <option value="">Seleccioná el subtipo</option>
                                                {(propertyTypes[form.type] || []).map(st => (
                                                    <option key={st} value={st}>{st}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Ubicación */}
                            {currentStep === 2 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <label className="text-xs font-medium text-stone-dark/60 block mb-2">Ingresá calle y altura</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            placeholder="Ingresá una dirección"
                                            className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Provincia</label>
                                            <select
                                                name="provincia"
                                                value={form.provincia}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                            >
                                                <option value="">Seleccioná una provincia</option>
                                                {provinces.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Ciudad</label>
                                            <input
                                                type="text"
                                                name="ciudad"
                                                value={form.ciudad}
                                                onChange={handleChange}
                                                placeholder="Ingresá la ciudad o barrio"
                                                className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Características */}
                            {currentStep === 3 && (
                                <div className="space-y-10 animate-fade-in">

                                    <div className="pt-2">
                                        <h3 className="font-serif text-xl text-stone-dark mb-6">Antigüedad</h3>
                                        <div className="space-y-4 max-w-lg">
                                            {[
                                                { id: 'a_estrenar', label: 'A estrenar', value: 'A estrenar' },
                                                { id: 'anos_antiguedad', label: 'Años de antigüedad', value: 'Años de antigüedad' },
                                                { id: 'en_construccion', label: 'En construcción', value: 'En construcción' },
                                            ].map((option) => (
                                                <div key={option.id} className="flex items-center gap-4">
                                                    <label className="flex items-center gap-3 cursor-pointer text-sm text-stone-dark group">
                                                        <input
                                                            type="radio"
                                                            name="age"
                                                            value={option.value}
                                                            checked={form.age === option.value}
                                                            onChange={handleChange}
                                                            className="w-5 h-5 accent-[#F06C00] cursor-pointer"
                                                        />
                                                        {option.label}
                                                    </label>
                                                    {form.age === 'Años de antigüedad' && option.value === 'Años de antigüedad' && (
                                                        <input
                                                            type="number"
                                                            name="age_years"
                                                            value={form.age_years}
                                                            onChange={handleChange}
                                                            className="w-24 bg-white border border-stone-dark/20 rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <hr className="border-stone-dark/10" />

                                    <div className="grid grid-cols-2 gap-y-8 gap-x-6 max-w-lg">
                                        {[
                                            { label: 'Ambientes (opcional)', field: 'ambientes' },
                                            { label: 'Dormitorios (opcional)', field: 'bedrooms' },
                                            { label: 'Baños (opcional)', field: 'bathrooms' },
                                            { label: 'Toilettes (opcional)', field: 'toilettes' },
                                            { label: 'Cocheras (opcional)', field: 'cocheras' },
                                        ].map(item => (
                                            <div key={item.field}>
                                                <label className="text-xs font-medium text-stone-dark/60 block mb-3">{item.label}</label>
                                                <div className="flex items-center gap-3">
                                                    <button type="button" onClick={() => handleNumberChange(item.field, -1)} className="size-8 rounded flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-dark transition-colors">-</button>
                                                    <span className="w-8 text-center text-sm font-medium">{form[item.field]}</span>
                                                    <button type="button" onClick={() => handleNumberChange(item.field, 1)} className="size-8 rounded flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-dark transition-colors">+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-stone-dark/10">
                                        <h3 className="font-serif text-xl text-stone-dark mb-6">Superficie</h3>
                                        <div className="flex flex-col md:flex-row gap-6 max-w-lg">
                                            <div className="flex-1">
                                                <label className="text-xs font-medium text-stone-dark/60 block mb-2">Superficie cubierta</label>
                                                <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                    <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">m2</span>
                                                    <input type="number" name="area_covered" value={form.area_covered} onChange={handleChange} className="w-full px-4 py-3 text-sm outline-none bg-transparent" placeholder="0" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-medium text-stone-dark/60 block mb-2">Superficie total</label>
                                                <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                    <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">m2</span>
                                                    <input type="number" name="area" value={form.area} onChange={handleChange} className="w-full px-4 py-3 text-sm outline-none bg-transparent" placeholder="0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Multimedia y Publicar */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Imágenes (Podés seleccionar varias) *</label>
                                            <div className="flex flex-col gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleMultipleFileChange}
                                                    className="block w-full text-sm text-stone-dark/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer bg-white border border-stone-dark/20 rounded-xl"
                                                />

                                                {form.images.length > 0 && (
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-dark/10">
                                                        {form.images.map((img, idx) => (
                                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-stone-dark/10 bg-white shadow-sm">
                                                                <img
                                                                    src={img instanceof File ? URL.createObjectURL(img) : img}
                                                                    alt={`Preview ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(idx)}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                                    title="Eliminar imagen"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                                </button>
                                                                {idx === 0 && (
                                                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[9px] text-center py-0.5 font-bold uppercase tracking-wider">
                                                                        Portada
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {form.images.length === 0 && (
                                                    <p className="text-[#C10015] text-[10px] mt-1 ml-1">Debes incluir al menos una imagen.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Video de YouTube (URL)</label>
                                            <input type="text" name="video_url" value={form.video_url} onChange={handleChange} placeholder="Opcional: https://youtube.com/..." className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-stone-dark/60 block mb-2">Plano de la propiedad (Opcional)</label>
                                        <div className="flex flex-col gap-3 max-w-md">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="plan_url"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-stone-dark/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-stone-100 file:text-stone-dark hover:file:bg-stone-200 transition-colors cursor-pointer bg-white border border-stone-dark/20 rounded-xl"
                                            />
                                            {form.plan_url && form.plan_url instanceof File && (
                                                <div className="text-xs text-stone-dark/60 line-clamp-1">Seleccionado: {form.plan_url.name}</div>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="my-6 border-stone-dark/10" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <h3 className="font-serif text-xl text-stone-dark mb-6">Describí la propiedad</h3>
                                            <p className="text-stone-dark/60 text-sm mb-6 -mt-4">Asegurate de incluir el tipo de propiedad y el tipo de operación de tu aviso.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Título *</label>
                                            <div className="relative">
                                                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Completá el título de tu aviso" className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" required />
                                            </div>
                                            {!form.title && <p className="text-[#C10015] text-[10px] mt-1.5 ml-1">Agregá un título a tu aviso.</p>}
                                        </div>
                                        <div className="md:col-span-2 mb-4">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Descripción *</label>
                                            <div className="relative">
                                                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Escribí un mínimo de 150 caracteres." className="w-full min-h-[140px] bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y" required></textarea>
                                                <span className="absolute bottom-3 right-4 text-xs font-medium text-stone-dark/40">{form.description.length}</span>
                                            </div>
                                            {form.description.length < 150 && <p className="text-[#C10015] text-[10px] mt-1.5 ml-1">Escribí un mínimo de 150 caracteres.</p>}
                                        </div>

                                        <div className="md:col-span-2 pt-6 border-t border-stone-dark/10">
                                            <h3 className="font-serif text-xl text-stone-dark mb-6">Precio</h3>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Precio de la propiedad *</label>
                                            <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">US$</span>
                                                <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-4 py-3 text-sm outline-none bg-transparent" placeholder="0" required />
                                            </div>
                                            {!form.price && <p className="text-[#C10015] text-[10px] mt-1.5 ml-1">Ingresá el precio de la propiedad.</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Expensas (opcional)</label>
                                            <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">$</span>
                                                <input type="number" name="expenses" value={form.expenses} onChange={handleChange} className="w-full px-4 py-3 text-sm outline-none bg-transparent" placeholder="0" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 mt-2 border-b border-stone-dark/10 pb-6 mb-2">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="credit_apt"
                                                    checked={form.credit_apt}
                                                    onChange={(e) => setForm({ ...form, credit_apt: e.target.checked })}
                                                    className="w-5 h-5 accent-[#F06C00] cursor-pointer rounded border-stone-dark/20"
                                                />
                                                <span className="text-sm font-medium text-stone-dark">Apto crédito</span>
                                            </label>
                                        </div>

                                        <div className="md:col-span-2 pt-2">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Amenities opcionales (Separados por coma)</label>
                                            <input type="text" name="amenities" value={form.amenities} onChange={handleChange} placeholder="Ej: Pileta, Gimnasio, Parrilla" className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="mt-10 pt-6 border-t border-stone-dark/10 flex items-center justify-between">
                            {currentStep > 1 ? (
                                <button type="button" onClick={handleBack} className="text-sm font-medium text-stone-dark/70 hover:text-primary transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    Atrás
                                </button>
                            ) : <div></div>}

                            <div className="flex items-center gap-4">
                                <Link href="/admin/dashboard" className="px-6 py-2.5 rounded-xl border border-stone-dark/20 text-stone-dark text-sm font-medium hover:bg-stone-50 transition-colors">
                                    Guardar y salir
                                </Link>

                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={currentStep === 1 && !form.type}
                                        className="px-8 py-2.5 rounded-xl bg-[#F06C00] hover:bg-[#D96100] disabled:opacity-50 text-white text-sm font-medium shadow-sm transition-colors"
                                    >
                                        Continuar
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading || !form.title || !form.price || !form.description || !form.image_url}
                                        className="px-8 py-2.5 rounded-xl bg-[#F06C00] hover:bg-[#D96100] disabled:opacity-50 text-white text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                                    >
                                        {loading ? 'Publicando...' : 'Publicar Aviso'}
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
