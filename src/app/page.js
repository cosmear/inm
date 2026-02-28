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
            const data = await res.json();
            publications = data.slice(0, 3);
        }
    } catch (err) {
        console.error('Error fetching featured publications:', err);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
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

                    <div className="relative z-10 text-center px-6 max-w-4xl">
                        <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-6 block drop-shadow-md">Inmobiliaria Boutique</span>
                        <h2 className="font-serif text-5xl md:text-8xl text-white mb-10 leading-[0.9] drop-shadow-2xl">
                            Redefiniendo el <br /> <i className="font-normal opacity-90">Lujo Argentino</i>
                        </h2>

                        {/* Search Bar */}
                        <div className="bg-white/10 backdrop-blur-xl p-3 rounded-[32px] border border-white/20 shadow-2xl max-w-3xl mx-auto transform hover:scale-[1.02] transition-transform duration-500">
                            <div className="bg-white rounded-[24px] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-dark/5 overflow-hidden">
                                <Link href="/search?operation=Comprar" className="flex-1 px-8 py-5 hover:bg-primary/5 transition-colors text-left group">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1 group-hover:translate-x-1 transition-transform">Venta</span>
                                    <span className="text-stone-dark font-serif text-xl">Propiedades Exclusivas</span>
                                </Link>
                                <Link href="/search?operation=Alquilar" className="flex-1 px-8 py-5 hover:bg-primary/5 transition-colors text-left group">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1 group-hover:translate-x-1 transition-transform">Alquiler</span>
                                    <span className="text-stone-dark font-serif text-xl">Residencias de Temporada</span>
                                </Link>
                                <Link href="/search" className="bg-primary hover:bg-primary-dark text-white px-10 py-5 flex items-center justify-center gap-3 transition-all active:scale-95">
                                    <span className="font-bold uppercase tracking-widest text-xs">Explorar</span>
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
                            <div className="max-w-xl">
                                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Listados Curados</span>
                                <h3 className="font-serif text-4xl md:text-6xl text-stone-dark leading-tight">
                                    Lo mejor del mercado en un solo lugar
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
