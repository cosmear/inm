'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';

const SearchContent = () => {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        operation: searchParams.get('operation') || '',
        type: searchParams.get('type') || '',
        location: searchParams.get('location') || '',
        maxPrice: '10000000',
        bedrooms: 0
    });

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.operation) params.append('operation', filters.operation);
            if (filters.type) params.append('type', filters.type);
            if (filters.location) params.append('location', filters.location);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.bedrooms > 0) params.append('bedrooms', filters.bedrooms);

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

    return (
        <div className="bg-cream min-h-screen pt-24 font-display flex flex-col">
            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 flex-grow w-full">
                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="w-full lg:w-1/4">
                        <div className="sticky top-32 glass-card p-8 rounded-[32px] space-y-10">
                            <div>
                                <h3 className="font-serif text-2xl text-stone-dark mb-8">Refinar Búsqueda</h3>
                                <div className="space-y-6">
                                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-3">Operación</label><select name="operation" value={filters.operation} onChange={handleFilterChange} className="w-full bg-cream/50 border-stone-dark/10 rounded-xl px-4 py-3 text-sm"><option value="">Todas</option><option value="Comprar">Venta</option><option value="Alquilar">Alquiler</option></select></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-3">Tipo</label><select name="type" value={filters.type} onChange={handleFilterChange} className="w-full bg-cream/50 border-stone-dark/10 rounded-xl px-4 py-3 text-sm"><option value="">Cualquiera</option><option value="Penthouse">Penthouse</option><option value="Casco Histórico">Casco Histórico</option><option value="Villa Moderna">Villa Moderna</option><option value="Viñedo">Viñedo</option></select></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-3">Precio Máximo: ${parseInt(filters.maxPrice).toLocaleString()}</label><input type="range" name="maxPrice" min="0" max="10000000" step="100000" value={filters.maxPrice} onChange={handleFilterChange} className="w-full h-1 bg-stone-dark/10 rounded-lg appearance-none cursor-pointer" /></div>
                                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-3">Dormitorios (Mínimo)</label><div className="flex gap-2">{[1, 2, 3, 4].map(num => (<button key={num} onClick={() => setFilters(f => ({ ...f, bedrooms: num }))} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${filters.bedrooms === num ? 'bg-primary text-white border-primary shadow-lg scale-110' : 'border-stone-dark/10 text-stone-dark hover:border-primary'}`}>{num}+</button>))}</div></div>
                                </div>
                            </div>
                            <button onClick={() => setFilters({ operation: '', type: '', location: '', maxPrice: '10000000', bedrooms: 0 })} className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-stone-light hover:text-primary transition-colors border-t border-stone-dark/5">Limpiar Filtros</button>
                        </div>
                    </aside>
                    <div className="w-full lg:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-stone-dark/5 pb-8">
                            <div><h2 className="font-serif text-4xl text-stone-dark leading-tight">Resultados</h2><p className="text-stone-light text-sm mt-2">{properties.length} propiedades encontradas</p></div>
                        </div>
                        {loading ? <div className="h-64 flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">slow_motion_video</span></div> : properties.length === 0 ? <div className="flex flex-col items-center justify-center py-32 text-center glass-card rounded-[40px] opacity-60"><span className="material-symbols-outlined text-6xl mb-6 text-stone-light">search_off</span><h3 className="font-serif text-2xl text-stone-dark">No se encontraron resultados</h3><p className="text-stone-light max-w-xs mx-auto mt-2">Intenta ajustar los criterios de búsqueda para encontrar lo que buscas.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">{properties.map(prop => <PropertyCard key={prop.id} prop={prop} />)}</div>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default function Search() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center">Cargando Búsqueda...</div>}>
            <SearchContent />
        </Suspense>
    );
}
