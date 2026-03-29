import React from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
    let publications = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/publications`, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            const arr = json.data || json; // Handle new or old format
            publications = arr.slice(0, 3);
        }
    } catch (err) {
        console.error('Error fetching featured publications:', err);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="grow">
                {/* Hero Section */}
                <section className="h-screen relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                            className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite]"
                            alt="Luxury Home"
                        />
                        <div className="absolute inset-0 bg-stone-dark/40 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto">
                        <span className="text-primary font-bold tracking-widest text-3xl md:text-4xl uppercase mb-4 block drop-shadow-md">
                            Julia Guillot - (aquí iría el número de matrícula)
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-10 leading-tight drop-shadow-2xl">
                            Confianza en raíces
                        </h2>

                        {/* Search Bar */}
                        <div className="bg-white/20 backdrop-blur-2xl p-2 rounded-2xl border border-white/30 shadow-2xl w-full max-w-5xl mx-auto transform hover:scale-[1.02] transition-transform duration-500">
                            <div className="bg-white rounded-xl flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-dark/10 overflow-hidden">
                                <Link href="/search?operation=Venta" className="flex-1 px-8 py-4 hover:bg-primary/5 transition-colors text-left group">
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-primary/80 block mb-1 group-hover:translate-x-1 transition-transform">Venta</span>
                                    <span className="text-stone-dark font-serif text-lg md:text-xl">Propiedades Exclusivas</span>
                                </Link>
                                <Link href="/search?operation=Alquiler" className="flex-1 px-8 py-4 hover:bg-primary/5 transition-colors text-left group">
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-primary/80 block mb-1 group-hover:translate-x-1 transition-transform">Alquiler</span>
                                    <span className="text-stone-dark font-serif text-lg md:text-xl">Residencias de Temporada</span>
                                </Link>
                                <Link href="/search" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 flex items-center justify-center gap-2 transition-all active:scale-95">
                                    <span className="font-medium uppercase tracking-wider text-xs">Explorar</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Section */}
                <section className="py-32 bg-cream">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                            <div className="md:max-w-3xl lg:max-w-4xl">
                                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Últimas propiedades</span>
                                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-dark leading-tight">
                                    Propiedades y oportunidades para cada proyecto de vida
                                </h3>
                            </div>
                            <Link href="/search" className="group flex items-center gap-4 text-stone-dark font-bold uppercase tracking-widest text-[10px]">
                                Ver todas las propiedades
                                <div className="size-10 rounded-full border border-stone-dark/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                </div>
                            </Link>
                        </div>

                        {publications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {publications.map(prop => (
                                    <PropertyCard key={prop.id} prop={prop} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center glass-card rounded-3xl opacity-50">
                                <p className="font-serif italic text-stone-dark">No hay propiedades destacadas disponibles.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
