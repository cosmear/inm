import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getProperty(id) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/publications/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

export default async function PropertyDetails({ params }) {
    const id = (await params).id;
    const prop = await getProperty(id);

    if (!prop) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center pt-20">
                <h1 className="font-serif text-4xl text-stone-dark mb-4">Propiedad no encontrada</h1>
                <Link href="/search" className="text-primary hover:underline">Volver a la búsqueda</Link>
            </div>
        );
    }

    const {
        title, description, price, type, subtipo, operation, location,
        provincia, ciudad, image_url, plan_url, video_url,
        bedrooms, bathrooms, ambientes, cocheras, toilettes,
        area, area_covered, age, amenities,
        credit_apt, expenses
    } = prop;

    let parsedAmenities = [];
    try {
        if (Array.isArray(amenities)) {
            parsedAmenities = amenities;
        } else if (typeof amenities === 'string' && amenities.trim()) {
            if (amenities.startsWith('[')) {
                parsedAmenities = JSON.parse(amenities);
            } else {
                parsedAmenities = amenities.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
    } catch (e) {
        console.error("Error parsing amenities:", e);
    }

    const displayLocation = (ciudad && provincia) ? `${ciudad}, ${provincia}` : location;

    return (
        <div className="bg-cream min-h-screen pt-24 pb-32">
            <main className="max-w-[1200px] mx-auto px-6 lg:px-12">

                {/* Header Section */}
                <div className="mb-8">
                    <Link href="/search" className="inline-flex items-center gap-2 text-stone-dark/60 hover:text-primary transition-colors text-sm font-medium uppercase tracking-wider mb-6">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Volver a Resultados
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">{operation}</span>
                                <span className="bg-stone-dark/5 text-stone-dark/70 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">{subtipo || type}</span>
                                {credit_apt === 1 && <span className="bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">Apto Crédito</span>}
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-dark mb-2 leading-tight">{title}</h1>
                            <div className="flex items-center gap-2 text-stone-dark/70 font-medium">
                                <span className="material-symbols-outlined text-lg">location_on</span>
                                {displayLocation}
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="font-serif text-4xl md:text-5xl text-primary font-medium tracking-tight whitespace-nowrap">
                                USD {price?.toLocaleString()}
                            </p>
                            {expenses > 0 && <p className="text-sm font-medium text-stone-dark/50 mt-1 uppercase tracking-wider">+ Expensas: ${expenses.toLocaleString()}</p>}
                        </div>
                    </div>
                </div>

                {/* Main Media Gallery */}
                <div className="mb-16 rounded-2xl overflow-hidden shadow-glass border border-white/50 relative">
                    <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-[400px] md:h-[600px] w-full hide-scrollbars relative group">
                        {(() => {
                            // Parse the JSON images array
                            let imagesArray = [];
                            try {
                                if (prop.images) {
                                    imagesArray = typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images;
                                }
                            } catch (e) {
                                console.error("Error parsing images:", e);
                            }

                            // Fallback if no images array, just use the single image_url
                            if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
                                imagesArray = prop.image_url ? [prop.image_url] : [];
                            }

                            const allMedia = [...imagesArray];
                            if (plan_url) allMedia.push({ type: 'plan', url: plan_url });

                            return allMedia.map((media, idx) => {
                                const rawUrl = typeof media === 'string' ? media : media.url;
                                const safeUrl = rawUrl?.startsWith('/uploads/') ? rawUrl.replace('/uploads/', '/api/uploads/') : rawUrl;
                                return (
                                    <div key={idx} className="flex-none w-full md:w-[80%] h-full relative snap-center snap-always border-r-4 border-cream cursor-pointer">
                                        <div className="absolute inset-0 bg-stone-dark/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                                        <img
                                            src={safeUrl}
                                            alt={typeof media === 'string' ? `${title} - Imagen ${idx + 1}` : "Plano de la propiedad"}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                        {typeof media !== 'string' && media.type === 'plan' && (
                                            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 text-xs font-bold text-stone-dark tracking-wider uppercase z-20 shadow-sm pointer-events-none">
                                                Plano Incluido
                                            </div>
                                        )}
                                    </div>
                                )
                            });
                        })()}
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .hide-scrollbars::-webkit-scrollbar { display: none; }
                    .hide-scrollbars { -ms-overflow-style: none; scrollbar-width: none; }
                `}} />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Column (Details) */}
                    <div className="lg:col-span-8 space-y-16 min-w-0">

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-stone-dark/5 shadow-sm">
                            {(area_covered > 0 || area > 0) && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-stone-dark/50 text-[10px] uppercase tracking-wider font-bold">Superficie Cub.</span>
                                    <div className="flex items-center gap-2 text-stone-dark font-serif text-xl">
                                        <span className="material-symbols-outlined text-primary/70">straighten</span>
                                        {area_covered || area} m²
                                    </div>
                                </div>
                            )}
                            {ambientes > 0 && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-stone-dark/50 text-[10px] uppercase tracking-wider font-bold">Ambientes</span>
                                    <div className="flex items-center gap-2 text-stone-dark font-serif text-xl">
                                        <span className="material-symbols-outlined text-primary/70">meeting_room</span>
                                        {ambientes}
                                    </div>
                                </div>
                            )}
                            {bedrooms > 0 && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-stone-dark/50 text-[10px] uppercase tracking-wider font-bold">Dormitorios</span>
                                    <div className="flex items-center gap-2 text-stone-dark font-serif text-xl">
                                        <span className="material-symbols-outlined text-primary/70">bed</span>
                                        {bedrooms}
                                    </div>
                                </div>
                            )}
                            {(bathrooms > 0 || toilettes > 0) && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-stone-dark/50 text-[10px] uppercase tracking-wider font-bold">Baños</span>
                                    <div className="flex items-center gap-2 text-stone-dark font-serif text-xl">
                                        <span className="material-symbols-outlined text-primary/70">shower</span>
                                        {bathrooms + (toilettes > 0 ? 0.5 : 0)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-serif text-3xl text-stone-dark mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">description</span>
                                Descripción
                            </h3>
                            <div className="bg-white border border-stone-dark/5 rounded-2xl p-6 md:p-8 shadow-sm">
                                <div className="prose prose-stone max-w-none prose-p:leading-relaxed prose-p:text-stone-dark/80 whitespace-pre-wrap break-words">
                                    {description}
                                </div>
                            </div>
                        </div>

                        {/* Extended Features Table */}
                        <div>
                            <h3 className="font-serif text-3xl text-stone-dark mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                Características Físicas
                            </h3>
                            <div className="bg-white border border-stone-dark/5 rounded-2xl overflow-hidden shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-dark/5">
                                    <div className="flex justify-between items-center p-4 hover:bg-stone-dark/5 transition-colors">
                                        <span className="text-sm text-stone-dark/60 font-medium">Superficie Total</span>
                                        <span className="font-bold text-stone-dark">{area > 0 ? `${area} m²` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 hover:bg-stone-dark/5 transition-colors">
                                        <span className="text-sm text-stone-dark/60 font-medium">Superficie Cubierta</span>
                                        <span className="font-bold text-stone-dark">{area_covered > 0 ? `${area_covered} m²` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 hover:bg-stone-dark/5 transition-colors border-t border-stone-dark/5">
                                        <span className="text-sm text-stone-dark/60 font-medium">Cocheras</span>
                                        <span className="font-bold text-stone-dark">{cocheras || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 hover:bg-stone-dark/5 transition-colors border-t border-stone-dark/5">
                                        <span className="text-sm text-stone-dark/60 font-medium">Toilettes</span>
                                        <span className="font-bold text-stone-dark">{toilettes || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 hover:bg-stone-dark/5 transition-colors border-t border-stone-dark/5">
                                        <span className="text-sm text-stone-dark/60 font-medium">Antigüedad</span>
                                        <span className="font-bold text-stone-dark">{age && age !== 'A estrenar' && age !== 'En construcción' ? `${age} años` : (age || 'A estrenar')}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 hover:bg-stone-dark/5 transition-colors border-t border-stone-dark/5">
                                        <span className="text-sm text-stone-dark/60 font-medium">Apto Crédito</span>
                                        <span className="font-bold text-stone-dark">{credit_apt === 1 ? 'Sí' : 'No'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        {parsedAmenities.length > 0 && (
                            <div>
                                <h3 className="font-serif text-3xl text-stone-dark mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">local_florist</span>
                                    Amenities y Extras
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {parsedAmenities.map((amenity, index) => (
                                        <div key={index} className="bg-white border border-stone-dark/10 shadow-sm px-4 py-2.5 rounded-xl flex items-center gap-2 group hover:border-primary/40 transition-colors">
                                            <span className="material-symbols-outlined text-primary/50 text-sm group-hover:text-primary transition-colors">check_circle</span>
                                            <span className="text-sm text-stone-dark font-medium">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video Section */}
                        {video_url && (
                            <div>
                                <h3 className="font-serif text-3xl text-stone-dark mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">videocam</span>
                                    Recorrido Virtual
                                </h3>
                                <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-lg border border-stone-dark/10 bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video_url.includes('v=') ? video_url.split('v=')[1]?.split('&')[0] : video_url.split('/').pop()}`}
                                        className="absolute inset-0 w-full h-full"
                                        title="Recorrido Virtual"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column (Contact Widget) */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-32 glass-card p-8 rounded-3xl border border-white/60 shadow-glass">
                            <h4 className="font-serif text-2xl text-stone-dark mb-2">¿Te interesa esta propiedad?</h4>
                            <p className="text-sm text-stone-dark/60 mb-8">Contáctanos hoy mismo para coordinar una visita exclusiva o resolver cualquier duda.</p>

                            <div className="space-y-4">
                                <a href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hola, estoy interesado en tu aviso de "${title}". ¿Podríamos coordinar una visita? ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/propiedad/${id}`)}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] hover:bg-[#1fb355] text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-[#25D366]/20 group">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 group-hover:scale-110 transition-transform">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"></path>
                                    </svg>
                                    <span className="font-bold text-sm uppercase tracking-wider">Contactar por WhatsApp</span>
                                </a>

                                <a href="mailto:info@maisonargent.com" className="w-full bg-stone-dark hover:bg-stone-dark/90 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-stone-dark/20 group">
                                    <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">mail</span>
                                    <span className="font-bold text-sm uppercase tracking-wider">Enviar Correo</span>
                                </a>
                            </div>

                            <div className="mt-8 pt-6 border-t border-stone-dark/10">
                                <p className="text-xs text-stone-dark/40 text-center font-medium">Ref: MA-{id.toString().padStart(4, '0')} • Listado Activo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
