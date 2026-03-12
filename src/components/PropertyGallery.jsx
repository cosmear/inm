'use client';
import React, { useState, useEffect } from 'react';
import { getSafeImageUrl } from '@/lib/utils';

const PropertyGallery = ({ media, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!media || media.length === 0) return null;

    const currentMedia = media[currentIndex];
    const isPlan = typeof currentMedia !== 'string' && currentMedia.type === 'plan';
    const currentUrl = isPlan ? currentMedia.url : currentMedia;
    const safeUrl = getSafeImageUrl(currentUrl);

    const nextMedia = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const prevMedia = () => {
        setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight') nextMedia();
            if (e.key === 'ArrowLeft') prevMedia();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, media.length]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Carousel Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-glass border border-white/50 bg-stone-100 aspect-video md:aspect-video group">
                <img
                    src={safeUrl}
                    alt={isPlan ? "Plano de la propiedad" : `${title} - Imagen ${currentIndex + 1}`}
                    className="w-full h-full object-contain md:object-cover transition-opacity duration-300 cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
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
                        const safeItemUrl = getSafeImageUrl(itemUrl);

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

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-stone-dark/95 backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Close button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
                        className="absolute top-4 right-4 z-110 text-white/70 hover:text-white p-2 transition-colors bg-stone-dark/30 rounded-full hover:bg-stone-dark/60"
                        aria-label="Cerrar"
                    >
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>

                    {/* Navigation Arrows */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-110 text-white/50 hover:text-white p-2 transition-all hover:scale-110 bg-stone-dark/30 rounded-full hover:bg-stone-dark/60"
                                aria-label="Anterior"
                            >
                                <span className="material-symbols-outlined text-4xl md:text-6xl">chevron_left</span>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-110 text-white/50 hover:text-white p-2 transition-all hover:scale-110 bg-stone-dark/30 rounded-full hover:bg-stone-dark/60"
                                aria-label="Siguiente"
                            >
                                <span className="material-symbols-outlined text-4xl md:text-6xl">chevron_right</span>
                            </button>
                        </>
                    )}

                    {/* Main Image in Lightbox */}
                    <div className="w-full h-full p-0 flex items-center justify-center">
                        <img
                            src={safeUrl}
                            alt={isPlan ? "Plano de la propiedad" : `${title} - Imagen completa ${currentIndex + 1}`}
                            className="w-full h-full object-contain select-none shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Thumbnails Strip inside Lightbox */}
                    {media.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[90vw] z-110">
                            <div
                                className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-4 bg-stone-dark/50 backdrop-blur-lg rounded-2xl border border-white/10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {media.map((item, idx) => {
                                    const isItemPlan = typeof item !== 'string' && item.type === 'plan';
                                    const itemUrl = isItemPlan ? item.url : item;
                                    const safeItemUrl = getSafeImageUrl(itemUrl);

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`relative flex-none w-16 md:w-20 aspect-video rounded-lg overflow-hidden transition-all duration-300 ${currentIndex === idx
                                                    ? 'ring-2 ring-white shadow-lg scale-110 z-10 opacity-100'
                                                    : 'opacity-40 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={safeItemUrl}
                                                alt={`Miniatura ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {isItemPlan && (
                                                <div className="absolute inset-0 bg-stone-dark/60 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-sm">architecture</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PropertyGallery;
