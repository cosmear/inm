'use client';
import React from 'react';

const WhatsAppButton = ({ propertyTitle, propertyUrl }) => {
    // Reemplazar con el número de teléfono real (con código de país, ej: 5491100000000)
    const phoneNumber = "5491100000000";

    const message = propertyTitle
        ? `Hola, estoy interesado en la propiedad "${propertyTitle}".\nEnlace: ${propertyUrl}\n¿Podrían darme más información?`
        : "Hola, me gustaría hacer una consulta.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md group border border-[#1ebd5b]/20"
        >
            <span className="material-symbols-outlined text-white text-2xl group-hover:scale-110 transition-transform">chat</span>
            Consultar por WhatsApp
        </a>
    );
};

export default WhatsAppButton;
