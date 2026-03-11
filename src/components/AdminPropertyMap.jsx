'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
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

export default function AdminPropertyMap({ location, ciudad, provincia, initialLat, initialLng, onCoordinatesChange }) {
    // Determine initial center. Default to Buenos Aires if nothing is known
    const defaultCenter = [-34.6037, -58.3816];
    
    // Manage local UI state for the marker
    const [position, setPosition] = useState(
        (initialLat && initialLng) ? [initialLat, initialLng] : null
    );
    const [mapCenter, setMapCenter] = useState(
        (initialLat && initialLng) ? [initialLat, initialLng] : defaultCenter
    );
    const [loading, setLoading] = useState(!initialLat);
    const markerRef = useRef(null);

    // Geocode the address if we don't have initial coordinates
    useEffect(() => {
        // Only run geocoding if we lack absolute positioning, but we DO have string data
        if ((!initialLat || !initialLng) && (location || ciudad || provincia)) {
            const fetchCoordinates = async () => {
                setLoading(true);
                try {
                    const queryParts = [];
                    if (location) queryParts.push(location);
                    if (ciudad) queryParts.push(ciudad);
                    if (provincia) queryParts.push(provincia);
                    queryParts.push("Argentina");

                    const query = encodeURIComponent(queryParts.join(', '));
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
                            const newLat = parseFloat(data[0].lat);
                            const newLng = parseFloat(data[0].lon);
                            const newPos = [newLat, newLng];
                            
                            setPosition(newPos);
                            setMapCenter(newPos);
                            // Notify parent
                            if (onCoordinatesChange) onCoordinatesChange(newLat, newLng);
                        }
                    }
                } catch (err) {
                    console.error("Geocoding failed", err);
                } finally {
                    setLoading(false);
                }
            };
            
            // Add a small debounce to avoid hammering the Nominatim API while typing
            const timeoutId = setTimeout(() => {
                fetchCoordinates();
            }, 1000);
            
            return () => clearTimeout(timeoutId);
        } else if (initialLat && initialLng) {
            // If props change from outside (e.g., loaded from DB)
            setPosition([initialLat, initialLng]);
            setMapCenter([initialLat, initialLng]);
            setLoading(false);
        }
    }, [location, ciudad, provincia, initialLat, initialLng, onCoordinatesChange]);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const latLng = marker.getLatLng();
                    const newLat = latLng.lat;
                    const newLng = latLng.lng;
                    setPosition([newLat, newLng]);
                    // Only notify parent, do NOT show to user
                    if (onCoordinatesChange) {
                        onCoordinatesChange(newLat, newLng);
                    }
                }
            },
        }),
        [onCoordinatesChange]
    );

    if (loading) {
        return (
            <div className="h-64 sm:h-80 w-full bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-dark/10 shadow-inner z-0 relative">
                <div className="flex flex-col items-center text-primary">
                     <span className="material-symbols-outlined animate-spin text-3xl mb-2">refresh</span>
                     <span className="text-sm font-medium">Buscando ubicación en el mapa...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-stone-dark/60 block mb-1">
                Ajuste fino de ubicación: Arrastrá el pin rojo para marcar la posición exacta
            </span>
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-stone-dark/20 relative z-0">
                <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <ChangeView center={mapCenter} zoom={15} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    
                    {/* Render marker if we have a position, else use center to force them to drag it */}
                    <Marker
                        draggable={true}
                        eventHandlers={eventHandlers}
                        position={position || mapCenter}
                        ref={markerRef}
                    >
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}
