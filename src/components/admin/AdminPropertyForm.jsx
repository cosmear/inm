'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { propertyTypes, provinces } from '@/lib/constants';
import dynamic from 'next/dynamic';

const AdminPropertyMap = dynamic(() => import('@/components/AdminPropertyMap'), {
    ssr: false,
    loading: () => (
        <div className="h-64 sm:h-80 w-full bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-dark/10 shadow-inner z-0 relative">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
        </div>
    )
});

const steps = [
    { id: 1, name: 'Principales' },
    { id: 2, name: 'Ubicación' },
    { id: 3, name: 'Características' },
    { id: 4, name: 'Multimedia y Guardar' }
];

export default function AdminPropertyForm({ 
    initialData, 
    onSubmit, 
    isEditing = false, 
    loading = false 
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState(initialData);

    // Keep form synced if initialData comes late (e.g. from async fetch)
    useEffect(() => {
        setForm(initialData);
    }, [initialData]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleNumberChange = (field, delta) => {
        setForm(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + delta)
        }));
    };

    // Auto-correct 'age' whenever 'operation' changes to 'Proyecto'
    useEffect(() => {
        if (form.operation === 'Proyecto') {
            if (form.age !== 'En construcción' && form.age !== 'Proyecto en pozo') {
                setForm(prev => ({ ...prev, age: 'Proyecto en pozo' }));
            }
        }
    }, [form.operation]);

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
        e.target.value = null;
    };

    const removeImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const moveImage = (index, direction) => {
        setForm(prev => {
            const newImages = [...prev.images];
            if (direction === -1 && index > 0) {
                [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
            } else if (direction === 1 && index < newImages.length - 1) {
                [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
            }
            return { ...prev, images: newImages };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, [e.target.name]: file });
        }
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="bg-cream min-h-screen font-display flex flex-col pt-16">
            {/* Top Navigation Progress */}
            <div className="bg-white border-b border-stone-dark/10 sticky top-[72px] z-10 w-full pt-4">
                <div className="max-w-5xl mx-auto px-2 md:px-6 py-4 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-1/2 left-4 right-4 md:left-6 md:right-6 h-0.5 bg-stone-dark/10 pointer-events-none -translate-y-1/2 rounded-full z-0"></div>
                    <div
                        className="absolute top-1/2 left-4 md:left-6 h-0.5 bg-primary pointer-events-none -translate-y-1/2 transition-all duration-300 rounded-full z-0"
                        style={{ width: `calc(${((currentStep - 1) / 3) * 100}% - 32px)` }}
                    ></div>

                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-1 md:gap-2 bg-white px-2 md:px-4 z-10 shrink-0">
                            <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentStep >= step.id ? 'bg-primary text-white' : 'bg-stone-dark/10 text-stone-dark/40'}`}>
                                {currentStep > step.id ? '✓' : step.id}
                            </div>
                            <span className={`text-[10px] uppercase tracking-wider font-medium hidden md:block ${currentStep >= step.id ? 'text-primary' : 'text-stone-dark/40'}`}>{step.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <main className="grow max-w-5xl mx-auto px-6 py-12 w-full flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar */}
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

                <div className="grow w-full">
                    <h1 className="text-2xl font-serif text-stone-dark mb-8 flex items-center gap-3">
                        {isEditing ? (
                            <><span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-xl">edit</span> Editando Propiedad</>
                        ) : (
                            <><span className="material-symbols-outlined text-green-500 bg-green-50 p-2 rounded-xl">add_circle</span> ¡Hola, empecemos a crear tu aviso!</>
                        )}
                    </h1>

                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-dark/5 min-h-[400px] flex flex-col justify-between">
                        <div className="space-y-8 grow">

                            {/* Step 1: Operación y Tipo */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-lg font-medium text-stone-dark mb-4">
                                        {isEditing ? 'Revisá la operación y tipo' : 'Contanos, ¿qué querés publicar?'}
                                    </h2>

                                    <div>
                                        <label className="text-xs font-medium text-stone-dark/60 block mb-3">Tipo de operación</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-stone-dark/20 border border-stone-dark/20 rounded-xl overflow-hidden w-full md:w-fit">
                                            {['Venta', 'Alquiler', 'Temporada', 'Proyecto'].map(op => (
                                                <button
                                                    key={op}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, operation: op })}
                                                    className={`w-full px-4 py-3 md:py-2.5 text-sm font-medium transition-colors ${form.operation === op ? 'text-primary bg-orange-50' : 'text-stone-dark/70 bg-white hover:bg-stone-50'}`}
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
                                                onChange={(e) => setForm({ ...form, type: e.target.value, subtipo: '' })}
                                                className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                            >
                                                <option value="">Seleccioná el tipo</option>
                                                {Object.keys(propertyTypes).map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Subtipo {isEditing ? '' : 'de propiedad'}</label>
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
                                        <label className="text-xs font-medium text-stone-dark/60 block mb-2">{isEditing ? 'Dirección exacta' : 'Ingresá calle y altura'}</label>
                                        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder={isEditing ? '' : "Ingresá una dirección"} className="w-full bg-white border border-stone-dark/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Provincia</label>
                                            <select name="provincia" value={form.provincia} onChange={handleChange} className="w-full bg-white border border-stone-dark/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none">
                                                <option value="">Seleccioná una provincia</option>
                                                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Ciudad</label>
                                            <input type="text" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder={isEditing ? '' : "Ingresá la ciudad o barrio"} className="w-full bg-white border border-stone-dark/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <AdminPropertyMap
                                            location={form.location}
                                            ciudad={form.ciudad}
                                            provincia={form.provincia}
                                            initialLat={form.lat}
                                            initialLng={form.lng}
                                            onCoordinatesChange={(newLat, newLng) => {
                                                setForm(prev => ({ ...prev, lat: newLat, lng: newLng }));
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Características */}
                            {currentStep === 3 && (
                                <div className="space-y-10 animate-fade-in">
                                    <div className="pt-2">
                                        <h3 className="font-serif text-xl text-stone-dark mb-6">Antigüedad</h3>
                                        <div className="space-y-4 max-w-lg">
                                            {(form.operation === 'Proyecto' 
                                                ? [
                                                    { id: 'en_construccion', label: 'En construcción', value: 'En construcción' },
                                                    { id: 'en_pozo', label: 'Proyecto en pozo', value: 'Proyecto en pozo' }
                                                ] 
                                                : [
                                                    { id: 'a_estrenar', label: 'A estrenar', value: 'A estrenar' },
                                                    { id: 'anos_antiguedad', label: 'Años de antigüedad', value: 'Años de antigüedad' },
                                                    { id: 'en_construccion', label: 'En construcción', value: 'En construcción' }
                                                ]
                                            ).map((option) => (
                                                <div key={option.id} className="flex items-center gap-4">
                                                    <label className="flex items-center gap-3 cursor-pointer text-sm text-stone-dark group">
                                                        <input type="radio" name="age" value={option.value} checked={form.age === option.value} onChange={handleChange} className="w-5 h-5 accent-[#F06C00] cursor-pointer" />
                                                        {option.label}
                                                    </label>
                                                    {form.age === 'Años de antigüedad' && option.value === 'Años de antigüedad' && (
                                                        <input type="number" name="age_years" value={form.age_years} onChange={handleChange} className="w-24 bg-white border border-stone-dark/20 rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <hr className="border-stone-dark/10" />

                                    <div className="grid grid-cols-2 gap-y-8 gap-x-6 max-w-lg">
                                        {[
                                            { label: 'Ambientes', field: 'ambientes', labelSuffix: isEditing ? '' : ' (opcional)' },
                                            { label: 'Dormitorios', field: 'bedrooms', labelSuffix: isEditing ? '' : ' (opcional)' },
                                            { label: 'Baños', field: 'bathrooms', labelSuffix: isEditing ? '' : ' (opcional)' },
                                            { label: 'Toilettes', field: 'toilettes', labelSuffix: isEditing ? '' : ' (opcional)' },
                                            { label: 'Cocheras', field: 'cocheras', labelSuffix: isEditing ? '' : ' (opcional)' },
                                        ].map(item => (
                                            <div key={item.field}>
                                                <label className="text-xs font-medium text-stone-dark/60 block mb-3">{item.label}{item.labelSuffix}</label>
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
                                                <label className="text-xs font-medium text-stone-dark/60 block mb-2">{isEditing ? 'Cubierta' : 'Superficie cubierta'}</label>
                                                <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                    <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">m2</span>
                                                    <input type="number" name="area_covered" value={form.area_covered} onChange={handleChange} placeholder={isEditing ? '' : "0"} className="w-full px-4 py-3 text-sm outline-none bg-transparent" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-medium text-stone-dark/60 block mb-2">{isEditing ? 'Total' : 'Superficie total'}</label>
                                                <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                    <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">m2</span>
                                                    <input type="number" name="area" value={form.area} onChange={handleChange} placeholder={isEditing ? '' : "0"} className="w-full px-4 py-3 text-sm outline-none bg-transparent" />
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
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Imágenes {isEditing ? '(Agregar más)' : '(Podés seleccionar varias) *'}</label>
                                            <input type="file" accept="image/*" multiple onChange={handleMultipleFileChange} className="block w-full text-sm text-stone-dark/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-white border border-stone-dark/20 rounded-xl cursor-pointer transition-colors" />

                                            {form.images.length > 0 && (
                                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-dark/10">
                                                    {form.images.map((img, idx) => (
                                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-stone-dark/10 bg-white shadow-sm flex flex-col">
                                                            <img src={img instanceof File ? URL.createObjectURL(img) : img} alt={`Img ${idx + 1}`} className="w-full h-full object-cover" />

                                                            {/* Controls Overlay */}
                                                            <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-colors pointer-events-none"></div>

                                                            <div className="absolute inset-0 flex flex-col justify-between p-1.5 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                                                <div className="flex justify-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(idx)}
                                                                        className="bg-white/90 hover:bg-red-500 hover:text-white text-stone-dark rounded-sm size-6 flex items-center justify-center shadow-sm backdrop-blur-md transition-colors"
                                                                        title="Eliminar imagen"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                                                    </button>
                                                                </div>

                                                                <div className="flex justify-between w-full">
                                                                    {idx > 0 ? (
                                                                        <button type="button" onClick={() => moveImage(idx, -1)} className="bg-white/90 hover:bg-white text-stone-dark size-6 rounded-sm flex items-center justify-center shadow-sm backdrop-blur-md transition-colors" title="Mover a la izquierda">
                                                                            <span className="material-symbols-outlined text-[18px] leading-none">chevron_left</span>
                                                                        </button>
                                                                    ) : <div></div>}
                                                                    {idx < form.images.length - 1 ? (
                                                                        <button type="button" onClick={() => moveImage(idx, 1)} className="bg-white/90 hover:bg-white text-stone-dark size-6 rounded-sm flex items-center justify-center shadow-sm backdrop-blur-md transition-colors" title="Mover a la derecha">
                                                                            <span className="material-symbols-outlined text-[18px] leading-none">chevron_right</span>
                                                                        </button>
                                                                    ) : <div></div>}
                                                                </div>
                                                            </div>

                                                            {idx === 0 && (
                                                                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[9px] text-center py-0.5 font-bold uppercase tracking-wider">
                                                                    Portada
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {!isEditing && form.images.length === 0 && (
                                                <p className="text-[#C10015] text-[10px] mt-1 ml-1">Debes incluir al menos una imagen.</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Video de YouTube (URL)</label>
                                            <input type="text" name="video_url" value={form.video_url} onChange={handleChange} placeholder={isEditing ? '' : "Opcional: https://youtube.com/..."} className="w-full bg-white border border-stone-dark/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />

                                            {!isEditing && (
                                                <div className="mt-8">
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
                                            )}
                                        </div>
                                    </div>

                                    <hr className="my-6 border-stone-dark/10" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {!isEditing && (
                                            <div className="md:col-span-2">
                                                <h3 className="font-serif text-xl text-stone-dark mb-6">Describí la propiedad</h3>
                                                <p className="text-stone-dark/60 text-sm mb-6 -mt-4">Asegurate de incluir el tipo de propiedad y el tipo de operación de tu aviso.</p>
                                            </div>
                                        )}
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Título *</label>
                                            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder={isEditing ? '' : "Completá el título de tu aviso"} className="w-full bg-white border border-stone-dark/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" required />
                                            {!isEditing && !form.title && <p className="text-[#C10015] text-[10px] mt-1.5 ml-1">Agregá un título a tu aviso.</p>}
                                        </div>
                                        <div className="md:col-span-2 mb-4 relative">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Descripción *</label>
                                            <textarea name="description" value={form.description} onChange={handleChange} placeholder={isEditing ? '' : "Escribí un mínimo de 150 caracteres."} className="w-full min-h-[140px] bg-white border border-stone-dark/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y transition-all" required></textarea>
                                            {!isEditing && <span className="absolute bottom-3 right-4 text-xs font-medium text-stone-dark/40">{form.description.length}</span>}
                                            {!isEditing && form.description.length < 150 && <p className="text-[#C10015] text-[10px] mt-1.5 ml-1">Escribí un mínimo de 150 caracteres.</p>}
                                        </div>

                                        <div className="md:col-span-2 pt-6 border-t border-stone-dark/10">
                                            <h3 className="font-serif text-xl text-stone-dark mb-6">Precio</h3>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Precio de la propiedad *</label>
                                            <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">US$</span>
                                                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder={isEditing ? '' : "0"} className="w-full px-4 py-3 text-sm outline-none bg-transparent" required />
                                            </div>
                                            {!isEditing && !form.price && <p className="text-[#C10015] text-[10px] mt-1.5 ml-1">Ingresá el precio de la propiedad.</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Expensas {isEditing ? '' : '(opcional)'}</label>
                                            <div className="flex bg-white border border-stone-dark/20 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                                <span className="bg-stone-50 px-4 py-3 text-stone-dark/60 text-sm border-r border-stone-dark/20">$</span>
                                                <input type="number" name="expenses" value={form.expenses} onChange={handleChange} placeholder={isEditing ? '' : "0"} className="w-full px-4 py-3 text-sm outline-none bg-transparent" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 mt-2 border-b border-stone-dark/10 pb-6 mb-2">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" name="credit_apt" checked={form.credit_apt} onChange={(e) => setForm({ ...form, credit_apt: e.target.checked })} className="w-5 h-5 accent-[#F06C00] cursor-pointer rounded border-stone-dark/20" />
                                                <span className="text-sm font-medium text-stone-dark">Apto crédito</span>
                                            </label>
                                        </div>

                                        <div className="md:col-span-2 pt-2">
                                            <label className="text-xs font-medium text-stone-dark/60 block mb-2">Amenities {isEditing ? '' : 'opcionales (Separados por coma)'}</label>
                                            <input type="text" name="amenities" value={form.amenities} onChange={handleChange} placeholder={isEditing ? '' : "Ej: Pileta, Gimnasio, Parrilla"} className="w-full bg-white border border-stone-dark/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                        </div>

                                        <div className="md:col-span-2 pt-6 border-t border-stone-dark/10">
                                            <h3 className="font-serif text-xl text-stone-dark mb-6">Estado de Publicación</h3>
                                            <p className="text-stone-dark/60 text-sm mb-6 -mt-4">Define si la propiedad es visible al público y qué etiqueta de estado tiene.</p>

                                            <div className="w-full md:w-1/2">
                                                <label className="text-xs font-medium text-stone-dark/60 block mb-2">Estado *</label>
                                                <select
                                                    name="status"
                                                    value={form.status}
                                                    onChange={handleChange}
                                                    className="w-full bg-white border border-stone-dark/20 text-stone-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                                >
                                                    <option value="published">🟢 Publicada (Visible y Activa)</option>
                                                    <option value="draft">🔘 Borrador (Oculta al público)</option>
                                                    <option value="reserved">🟡 Reservada (Visible con listón)</option>
                                                    <option value="sold">🔴 Vendida (Visible con listón)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="mt-10 pt-6 pb-20 md:pb-0 border-t border-stone-dark/10 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                            {currentStep > 1 ? (
                                <button type="button" onClick={handleBack} className="text-sm font-medium text-stone-dark/70 hover:text-primary flex items-center gap-1 transition-colors w-full justify-center md:justify-start md:w-auto">
                                    <span className="material-symbols-outlined text-lg">chevron_left</span> Atrás
                                </button>
                            ) : <div className="hidden md:block"></div>}

                            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                                <Link href="/admin/dashboard" className="px-6 py-2.5 rounded-xl border border-stone-dark/20 text-stone-dark text-sm font-medium hover:bg-stone-50 transition-colors w-full text-center md:w-auto">
                                    {isEditing ? 'Cancelar' : 'Guardar y salir'}
                                </Link>

                                {currentStep < 4 ? (
                                    <button type="button" onClick={handleNext} disabled={currentStep === 1 && !form.type} className="px-8 py-2.5 rounded-xl bg-[#F06C00] hover:bg-[#D96100] disabled:opacity-50 text-white text-sm font-medium shadow-sm transition-colors w-full md:w-auto">
                                        Continuar
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={handleSubmitClick} 
                                        disabled={loading || !form.title || !form.price || !form.description || form.images.length === 0} 
                                        className="px-8 py-2.5 rounded-xl bg-[#F06C00] hover:bg-[#D96100] disabled:opacity-50 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors w-full md:w-auto"
                                    >
                                        {loading ? (isEditing ? 'Guardando...' : 'Publicando...') : (isEditing ? 'Guardar Cambios' : 'Publicar Aviso')}
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
