'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js/Webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function PropertyMap({ location, ciudad, provincia }) {
    const [coordinates, setCoordinates] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoordinates = async () => {
            setLoading(true);
            try {
                // Construct a search query. 
                const queryParts = [];
                if (location) queryParts.push(location);
                if (ciudad) queryParts.push(ciudad);
                if (provincia) queryParts.push(provincia);
                queryParts.push("Argentina");

                const query = encodeURIComponent(queryParts.join(', '));

                // Nominatim API
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

                const res = await fetch(url, {
                    headers: {
                        'User-Agent': 'InmobiliariaApp/1.0',
                        'Accept-Language': 'es-AR,es'
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    }
                }
            } catch (err) {
                console.error("Geocoding failed", err);
            } finally {
                setLoading(false);
            }
        };

        if (location || ciudad || provincia) {
            fetchCoordinates();
        } else {
            setLoading(false);
        }
    }, [location, ciudad, provincia]);

    if (loading) {
        return <div className="h-64 sm:h-80 w-full bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-dark/10 shadow-inner z-0 relative">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
        </div>;
    }

    if (!coordinates) {
        return <div className="h-64 sm:h-80 w-full bg-stone-100 rounded-2xl flex flex-col items-center justify-center border border-stone-dark/10 shadow-inner text-stone-dark/50 z-0 relative">
            <span className="material-symbols-outlined text-4xl mb-2">location_off</span>
            <p className="text-sm font-medium">Ubicación exacta no encontrada en el mapa</p>
            <p className="text-xs">{location}, {ciudad}</p>
        </div>;
    }

    return (
        <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-stone-dark/20 relative z-0">
            <MapContainer center={coordinates} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={coordinates} zoom={15} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Marker position={coordinates}>
                    <Popup>
                        <div className="font-display font-medium text-stone-dark text-sm">
                            {location} {ciudad ? `, ${ciudad}` : ''}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
