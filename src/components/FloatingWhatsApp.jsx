'use client';
import React from 'react';

const FloatingWhatsApp = () => {
    const phoneNumber = "5491100000000";
    const message = "Hola, me gustaría hacer una consulta.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[90] flex items-center justify-center size-14 md:size-16 bg-[#25D366] hover:bg-[#1ebd5b] text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 group peer"
            aria-label="Contactar por WhatsApp"
        >
            <span className="material-symbols-outlined text-3xl md:text-4xl text-white">chat</span>

            {/* Tooltip visible al hacer hover */}
            <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl text-sm font-semibold text-stone-dark shadow-md border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none origin-right scale-95 group-hover:scale-100">
                Chatea con nosotros
                {/* Flechita del tooltip */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 size-3 bg-white border-r border-t border-stone-200 rotate-45"></div>
            </div>
        </a>
    );
};

export default FloatingWhatsApp;
