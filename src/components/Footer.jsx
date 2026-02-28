import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-stone-dark text-cream pt-32 pb-12">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-cream/10 pb-20 mb-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-8 text-cream">
                            <span className="material-symbols-outlined !text-[28px]">villa</span>
                            <h2 className="font-serif text-2xl font-medium">Maison Argent</h2>
                        </div>
                        <p className="text-stone-light text-sm leading-relaxed max-w-xs">
                            Conectando personas extraordinarias con propiedades excepcionales a lo largo de toda Argentina.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-8">Navegación</h4>
                        <ul className="space-y-4 text-xs font-bold tracking-widest text-stone-light uppercase">
                            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                            <li><Link href="/search" className="hover:text-white transition-colors">Propiedades</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-8">Oficinas</h4>
                        <ul className="space-y-4 text-sm text-stone-light">
                            <li>Buenos Aires</li>
                            <li>Mendoza</li>
                            <li>Bariloche</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-8">Newsletter</h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex-grow focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="size-12 bg-primary flex items-center justify-center rounded-xl hover:bg-primary-dark transition-all">
                                <span className="material-symbols-outlined text-white">send</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-stone-light/50 gap-4">
                    <p>© 2024 Maison Argent. Todos los derechos reservados.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
