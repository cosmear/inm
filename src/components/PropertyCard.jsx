'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PropertyCard = ({ prop }) => {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Parse images array robustly
    let images = [];
    try {
        if (prop.images) {
            const parsed = typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images;
            if (Array.isArray(parsed) && parsed.length > 0) {
                images = parsed;
            }
        }
    } catch (e) {
        console.error('Error parsing images array', e);
    }

    // Fallback to image_url if images array is empty
    if (images.length === 0 && prop.image_url) {
        images = [prop.image_url];
    }

    // Fix URLs for hostinger proxy
    const safeImages = images.map(img =>
        (typeof img === 'string' && img.startsWith('/uploads/')) ? img.replace('/uploads/', '/api/uploads/') : (img || '')
    );

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % safeImages.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
    };

    const handleCardClick = (e) => {
        // Only navigate if we didn't click on the carousel controls
        router.push(`/propiedad/${prop.id}`);
    };

    return (
        <article onClick={handleCardClick} className="group cursor-pointer flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/60 shadow-sm transition-all duration-500 hover:shadow-glass hover:-translate-y-1 relative">

            {/* Carousel Container */}
            <div className="relative overflow-hidden aspect-[4/3] bg-stone-100">
                {safeImages.length > 0 ? (
                    <img
                        src={safeImages[currentImageIndex]}
                        alt={`${prop.title} - Imagen ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                        <span className="material-symbols-outlined text-4xl text-stone-400">image_not_supported</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider text-stone-dark shadow-sm border border-white/50">
                    {prop.operation || 'Comprar'}
                </div>
                {prop.featured && (
                    <div className="absolute top-4 right-4 z-20 bg-primary/95 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm border border-primary/50">
                        Exclusivo
                    </div>
                )}

                {/* Navigation Arrows (Only show if multiple images) */}
                {safeImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white/80 backdrop-blur hover:bg-white text-stone-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md border border-stone-dark/10"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white/80 backdrop-blur hover:bg-white text-stone-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md border border-stone-dark/10"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
                            {safeImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Gradient overlay for better dot visibility */}
                {safeImages.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none"></div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow bg-white/20">
                <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-serif text-xl md:text-2xl text-stone-dark group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {prop.title}
                    </h3>
                </div>

                <p className="text-stone-dark/60 font-medium text-xs flex items-center gap-1.5 mb-5 tracking-wide line-clamp-1">
                    <span className="material-symbols-outlined text-[14px] text-primary/70">location_on</span>
                    {prop.ciudad && prop.provincia ? `${prop.ciudad}, ${prop.provincia}` : prop.location}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-stone-dark/10 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-stone-dark/50 font-semibold mb-0.5">Precio</span>
                        <span className="font-serif text-lg md:text-xl text-stone-dark">${prop.price?.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 ml-auto text-stone-dark/70 flex-wrap justify-end">
                        {prop.ambientes > 0 && (
                            <div className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-[16px] text-primary/80">meeting_room</span>
                                <span className="text-[9px] font-medium tracking-tight mt-0.5">{prop.ambientes} amb</span>
                            </div>
                        )}
                        {prop.bedrooms > 0 && (
                            <div className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-[16px] text-primary/80">bed</span>
                                <span className="text-[9px] font-medium tracking-tight mt-0.5">{prop.bedrooms} dor</span>
                            </div>
                        )}
                        {prop.bathrooms > 0 && (
                            <div className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-[16px] text-primary/80">shower</span>
                                <span className="text-[9px] font-medium tracking-tight mt-0.5">{prop.bathrooms} bñ</span>
                            </div>
                        )}
                        {prop.cocheras > 0 && (
                            <div className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-[16px] text-primary/80">directions_car</span>
                                <span className="text-[9px] font-medium tracking-tight mt-0.5">{prop.cocheras} coch</span>
                            </div>
                        )}
                        {(prop.area > 0 || prop.area_covered > 0) && (
                            <div className="flex flex-col items-center border-l border-stone-dark/10 pl-2 md:pl-3">
                                <span className="material-symbols-outlined text-[16px] text-primary/80">square_foot</span>
                                <span className="text-[9px] font-medium tracking-tight mt-0.5">
                                    {prop.area_covered > 0 && prop.area > 0 && prop.area_covered !== prop.area
                                        ? `${prop.area_covered}/${prop.area} `
                                        : `${prop.area_covered || prop.area} `}m²
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PropertyCard;
