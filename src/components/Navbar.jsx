'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

const Navbar = () => {
    const { token } = useAuth();

    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-cream/80 backdrop-blur-md border-b border-primary/10">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 text-primary-dark group">
                    <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
                        <span className="material-symbols-outlined !text-[20px]">villa</span>
                    </div>
                    <h1 className="font-serif text-2xl font-medium tracking-tight">Maison Argent</h1>
                </Link>

                <nav className="flex items-center gap-6 md:gap-10">
                    <Link href="/search?operation=Comprar" className="text-xs font-bold text-stone-dark hover:text-primary uppercase tracking-widest transition-colors">Comprar</Link>
                    <Link href="/search?operation=Alquilar" className="text-xs font-bold text-stone-dark hover:text-primary uppercase tracking-widest transition-colors">Alquilar</Link>
                    {token ? (
                        <Link href="/admin/dashboard" className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">dashboard</span>
                            Dashboard
                        </Link>
                    ) : (
                        <Link href="/admin/login" className="btn-primary !py-2 !px-6 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Admin</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
