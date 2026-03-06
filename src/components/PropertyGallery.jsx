'use client';
import React, { useState } from 'react';

const PropertyGallery = ({ media, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!media || media.length === 0) return null;

    const currentMedia = media[currentIndex];
    const isPlan = typeof currentMedia !== 'string' && currentMedia.type === 'plan';
    const currentUrl = isPlan ? currentMedia.url : currentMedia;
    const safeUrl = currentUrl?.startsWith('/uploads/') ? currentUrl.replace('/uploads/', '/api/uploads/') : currentUrl;


    const nextMedia = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const prevMedia = () => {
        setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Carousel Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-glass border border-white/50 bg-stone-100 aspect-[16/9] md:aspect-[21/9] group">
                <img
                    src={safeUrl}
                    alt={isPlan ? "Plano de la propiedad" : `${title} - Imagen ${currentIndex + 1}`}
                    className="w-full h-full object-contain md:object-cover transition-opacity duration-300"
                />

                {isPlan && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 text-sm font-bold text-stone-dark tracking-wider uppercase z-20 shadow-sm pointer-events-none flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">architecture</span>
                        Plano Incluido
                    </div>
                )}

                {/* Navigation Arrows */}
                {media.length > 1 && (
                    <>
                        <button
                            onClick={prevMedia}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-12 md:size-14 rounded-full bg-white/80 backdrop-blur hover:bg-white text-stone-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-stone-dark/10 hover:scale-110"
                            aria-label="Anterior"
                        >
                            <span className="material-symbols-outlined text-2xl">chevron_left</span>
                        </button>
                        <button
                            onClick={nextMedia}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-12 md:size-14 rounded-full bg-white/80 backdrop-blur hover:bg-white text-stone-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-stone-dark/10 hover:scale-110"
                            aria-label="Siguiente"
                        >
                            <span className="material-symbols-outlined text-2xl">chevron_right</span>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails Strip */}
            {media.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2 hide-scrollbar snap-x">
                    {media.map((item, idx) => {
                        const isItemPlan = typeof item !== 'string' && item.type === 'plan';
                        const itemUrl = isItemPlan ? item.url : item;
                        const safeItemUrl = itemUrl?.startsWith('/uploads/') ? itemUrl.replace('/uploads/', '/api/uploads/') : itemUrl;

                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`relative flex-none w-24 md:w-32 aspect-video rounded-xl overflow-hidden snap-start transition-all duration-300 ${currentIndex === idx
                                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-cream shadow-md'
                                        : 'opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={safeItemUrl}
                                    alt={`Miniatura ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {isItemPlan && (
                                    <div className="absolute inset-0 bg-stone-dark/40 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-xl">architecture</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default PropertyGallery;
