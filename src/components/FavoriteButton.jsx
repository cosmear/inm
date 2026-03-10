'use client';
import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ propertyId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.includes(propertyId)) {
            setIsFavorite(true);
        }
    }, [propertyId]);

    const toggleFavorite = () => {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        if (isFavorite) {
            favorites = favorites.filter(id => id !== propertyId);
            setIsFavorite(false);
        } else {
            if (!favorites.includes(propertyId)) {
                favorites.push(propertyId);
            }
            setIsFavorite(true);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Disparar evento para actualizar contadores en otras partes de la UI si existieran
        window.dispatchEvent(new Event('favoritesUpdated'));
    };

    if (!isMounted) return <div className="size-12 rounded-full bg-white/50 animate-pulse"></div>;

    return (
        <button
            onClick={toggleFavorite}
            className={`flex items-center justify-center size-12 rounded-full transition-all shadow-md border backdrop-blur-md hover:scale-110 ${isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white/90 border-stone-200 text-stone-dark/60 hover:text-rose-500'
                }`}
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
            <span className={`material-symbols-outlined text-2xl ${isFavorite ? 'font-variation-fill' : ''}`} style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}>
                favorite
            </span>
        </button>
    );
};

export default FavoriteButton;
