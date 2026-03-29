'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();

    const handleHomeClick = (e) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    return (
        <footer className="bg-stone-dark text-cream pt-32 pb-12">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between gap-16 border-b border-cream/10 pb-20 mb-12">
                    <div className="md:max-w-md">
                        <div className="flex items-center gap-3 mb-8 text-cream">
                            <div className="size-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm overflow-hidden">
                                <img src="/GuillotJuliaLogo.webp" alt="Logo Julia Guillot Footer" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="font-serif text-2xl font-medium">Julia Guillot</h2>
                        </div>
                        <p className="text-stone-light text-sm leading-relaxed max-w-sm">
                            Conectando personas extraordinarias con oportunidades increíbles.
                        </p>
                    </div>

                    <div className="md:w-1/3">
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-8">Navegación</h4>
                        <ul className="space-y-4 text-xs font-bold tracking-widest text-stone-light uppercase">
                            <li>
                                <Link 
                                    href="/" 
                                    onClick={handleHomeClick}
                                    className="hover:text-white transition-colors"
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li><Link href="/search" className="hover:text-white transition-colors">Propiedades</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex items-center justify-center text-[10px] uppercase tracking-widest text-stone-light/50">
                    <p>© 2026 Julia Guillot. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
