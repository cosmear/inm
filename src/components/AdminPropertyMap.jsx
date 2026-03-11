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
    
    // Only move the map when the explicit coordinates change to avoid snapping back if user pans manually
    useEffect(() => {
        if (center && center.length === 2) {
            map.flyTo(center, zoom);
        }
    }, [center[0], center[1], zoom, map]);

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
    const [isGeocoding, setIsGeocoding] = useState(false);
    const markerRef = useRef(null);

    // Track previous props to differentiate user typing vs DB loading
    const addressString = `${location || ''}, ${ciudad || ''}, ${provincia || ''}`;
    const prevAddressRef = useRef(addressString);
    const prevLatRef = useRef(initialLat);

    useEffect(() => {
        const addressChanged = addressString !== prevAddressRef.current;
        const latChanged = initialLat !== prevLatRef.current;

        prevAddressRef.current = addressString;
        prevLatRef.current = initialLat;

        // If both address and lat changed at the exact same time, it's a DB load.
        // Use the loaded coordinates directly, avoid geocoding.
        if (latChanged && addressChanged && initialLat && initialLng) {
            setPosition([initialLat, initialLng]);
            setMapCenter([initialLat, initialLng]);
            return;
        }

        // If only coordinate changed (user dragged marker, or geocoding finished), just update the local map view
        if (!addressChanged && latChanged && initialLat && initialLng) {
            setPosition([initialLat, initialLng]);
            setMapCenter([initialLat, initialLng]);
            return;
        }

        // If ONLY the address changed (or it loaded from DB but had NO previous coordinates), we must Geocode
        if (addressChanged) {
            const hasMeaningfulAddress = location || ciudad || provincia;

            if (!hasMeaningfulAddress) {
                // Address was cleared
                return;
            }

            const fetchCoordinates = async () => {
                setIsGeocoding(true);
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
                            // Notify parent of the newly discovered coordinates
                            if (onCoordinatesChange) onCoordinatesChange(newLat, newLng);
                        }
                    }
                } catch (err) {
                    console.error("Geocoding failed", err);
                } finally {
                    setIsGeocoding(false);
                }
            };
            
            // Add a debounce to avoid hammering the API while typing
            const timeoutId = setTimeout(() => {
                fetchCoordinates();
            }, 1200);
            
            return () => clearTimeout(timeoutId);
        }
    }, [addressString, location, ciudad, provincia, initialLat, initialLng, onCoordinatesChange]);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const latLng = marker.getLatLng();
                    const newLat = latLng.lat;
                    const newLng = latLng.lng;
                    setPosition([newLat, newLng]);
                    // Notify parent, do NOT show to user
                    if (onCoordinatesChange) {
                        onCoordinatesChange(newLat, newLng);
                    }
                }
            },
        }),
        [onCoordinatesChange]
    );

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex items-center justify-between mb-1">
                 <span className="text-xs font-medium text-stone-dark/60">
                    Ajuste fino de ubicación: Arrastrá el pin rojo para marcar la posición exacta
                 </span>
                 {isGeocoding && (
                     <span className="text-xs font-medium text-primary flex items-center gap-1">
                         <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>
                         Actualizando...
                     </span>
                 )}
            </div>
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
