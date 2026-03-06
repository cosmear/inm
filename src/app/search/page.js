'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { provinces, propertyTypes } from '@/lib/constants';

const SearchContent = () => {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [filters, setFilters] = useState({
        operation: searchParams.get('operation') || '',
        type: searchParams.get('type') || '',
        subtipo: searchParams.get('subtipo') || '',
        provincia: searchParams.get('provincia') || '',
        ciudad: searchParams.get('ciudad') || '',
        location: searchParams.get('location') || '', // For backward compatibility
        maxPrice: '10000000',
        bedrooms: 0,
        ambientes: 0
    });

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.operation) params.append('operation', filters.operation);
            if (filters.type) params.append('type', filters.type);
            if (filters.subtipo) params.append('subtipo', filters.subtipo);
            if (filters.provincia) params.append('provincia', filters.provincia);
            if (filters.ciudad) params.append('ciudad', filters.ciudad);
            if (filters.location) params.append('location', filters.location);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.bedrooms > 0) params.append('bedrooms', filters.bedrooms);
            if (filters.ambientes > 0) params.append('ambientes', filters.ambientes);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications?${params.toString()}`);
            if (res.ok) setProperties(await res.json());
            else setProperties([]);
        } catch (err) {
            console.error('Error fetching properties:', err);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProperties(); }, [filters]);

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleOperationChange = (op) => setFilters(prev => ({ ...prev, operation: op }));

    const clearFilters = () => setFilters({ operation: '', type: '', subtipo: '', provincia: '', ciudad: '', location: '', maxPrice: '10000000', bedrooms: 0, ambientes: 0 });

    return (
        <div className="bg-cream min-h-screen pt-24 font-display flex flex-col">

            {/* Sticky Horizontal Filter Bar */}
            <div className="sticky top-[72px] md:top-[88px] z-30 bg-white/80 backdrop-blur-md border-b border-stone-dark/10 shadow-sm py-4 mb-8">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-4">

                        {/* Operation Tabs */}
                        <div className="flex bg-stone-100 p-1 rounded-xl shrink-0">
                            {['', 'Venta', 'Alquiler', 'Temporada'].map(op => (
                                <button
                                    key={op || 'Todas'}
                                    onClick={() => handleOperationChange(op)}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${filters.operation === op
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-stone-dark/60 hover:text-stone-dark'
                                        }`}
                                >
                                    {op || 'Todas'}
                                </button>
                            ))}
                        </div>

                        {/* Quick Search Inputs */}
                        <div className="flex-grow flex gap-4 w-full md:w-auto">
                            <select
                                name="provincia"
                                value={filters.provincia}
                                onChange={handleFilterChange}
                                className="w-full md:w-1/2 bg-transparent border-0 rounded-xl px-4 py-3 text-stone-dark focus:ring-2 focus:ring-primary/20 outline-none hover:bg-stone-50 transition-colors font-medium text-sm appearance-none cursor-pointer"
                            >
                                <option value="" className="text-stone-dark/50">Provincia (Todas)</option>
                                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>

                            <div className="h-8 w-px bg-stone-dark/10 self-center hidden md:block"></div>

                            <input
                                type="text"
                                name="ciudad"
                                value={filters.ciudad}
                                onChange={handleFilterChange}
                                placeholder="Ciudad o Barrio..."
                                className="w-full md:w-1/2 bg-transparent border-0 rounded-xl px-4 py-3 text-stone-dark focus:ring-2 focus:ring-primary/20 outline-none hover:bg-stone-50 transition-colors font-medium text-sm"
                            />
                        </div>

                        {/* Toggle Advanced Filters */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${showAdvanced || filters.type || filters.bedrooms > 0 || filters.ambientes > 0 || filters.maxPrice !== '10000000'
                                    ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                                    : 'bg-transparent border-stone-dark/10 text-stone-dark/70 hover:bg-stone-50 font-medium'
                                } text-sm`}
                        >
                            <span className="material-symbols-outlined text-lg">tune</span>
                            Configurar
                        </button>
                    </div>

                    {/* Advanced Filters Panel (Collapsible) */}
                    <div className={`grid transition-all duration-500 ease-in-out ${showAdvanced ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
                        <div className="overflow-hidden">
                            <div className="bg-white rounded-2xl p-6 border border-stone-dark/5 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-dark/60 block mb-3">Tipo de Inmueble</label>
                                    <select name="type" value={filters.type} onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, subtipo: '' }))} className="w-full bg-stone-50 border border-stone-dark/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer">
                                        <option value="">Cualquiera</option>
                                        {Object.keys(propertyTypes).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                {filters.type && propertyTypes[filters.type]?.length > 0 && (
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-dark/60 block mb-3">Subtipo</label>
                                        <select name="subtipo" value={filters.subtipo} onChange={handleFilterChange} className="w-full bg-stone-50 border border-stone-dark/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer">
                                            <option value="">Cualquiera</option>
                                            {propertyTypes[filters.type].map(st => <option key={st} value={st}>{st}</option>)}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-dark/60 block mb-3">Habitaciones (Min)</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map(num => (
                                            <button key={`dor-${num}`} onClick={() => setFilters(f => ({ ...f, bedrooms: num }))} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${filters.bedrooms === num ? 'bg-primary text-white border-primary shadow-md' : 'border-stone-dark/10 text-stone-dark/70 hover:border-primary/50 bg-stone-50'}`}>{num}+</button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-dark/60 block mb-3">Ambientes (Min)</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map(num => (
                                            <button key={`amb-${num}`} onClick={() => setFilters(f => ({ ...f, ambientes: num }))} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${filters.ambientes === num ? 'bg-primary text-white border-primary shadow-md' : 'border-stone-dark/10 text-stone-dark/70 hover:border-primary/50 bg-stone-50'}`}>{num}+</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-dark/60 flex justify-between mb-3">
                                        <span>Precio Máximo</span>
                                        <span className="text-primary font-bold">${parseInt(filters.maxPrice).toLocaleString()}</span>
                                    </label>
                                    <input type="range" name="maxPrice" min="0" max="10000000" step="100000" value={filters.maxPrice} onChange={handleFilterChange} className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                                </div>

                                <div className="lg:col-span-4 flex justify-end mt-2 pt-6 border-t border-stone-dark/5">
                                    <button onClick={clearFilters} className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-stone-dark/50 hover:text-stone-dark transition-colors">Limpiar Filtros</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-32 flex-grow w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-stone-dark/5 pb-8">
                    <div>
                        <h2 className="font-serif text-4xl text-stone-dark leading-tight">Resultados</h2>
                        <p className="text-stone-light text-sm mt-2">{properties.length} propiedades encontradas</p>
                    </div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">slow_motion_video</span>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center glass-card rounded-2xl border border-stone-dark/5">
                        <span className="material-symbols-outlined text-5xl mb-6 text-stone-dark/20">search_off</span>
                        <h3 className="font-serif text-2xl text-stone-dark/80 mb-2">No se encontraron propiedades</h3>
                        <p className="text-stone-dark/50 max-w-sm mx-auto text-sm">Intenta ajustar tu búsqueda modificando la ubicación, el tipo de operación o limpiando los filtros avanzados.</p>
                        <button onClick={clearFilters} className="mt-8 px-6 py-3 bg-stone-dark hover:bg-stone-dark/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md">Ver Todo</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
                        {properties.map(prop => <PropertyCard key={prop.id} prop={prop} />)}
                    </div>
                )}
            </main>
        </div>
    );
};

export default function Search() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center flex items-center justify-center text-primary"><span className="material-symbols-outlined animate-spin mr-3">refresh</span>Cargando Búsqueda...</div>}>
            <SearchContent />
        </Suspense>
    );
}
