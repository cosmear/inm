'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { token, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

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
                    <Link href="/search?operation=Venta" className="text-xs font-semibold text-stone-dark hover:text-primary uppercase tracking-wider transition-colors">Comprar</Link>
                    <Link href="/search?operation=Alquiler" className="text-xs font-semibold text-stone-dark hover:text-primary uppercase tracking-wider transition-colors">Alquilar</Link>
                    {token ? (
                        <div className="flex items-center gap-3">
                            <Link href="/admin/dashboard" className="glass-card px-4 py-2 rounded-lg text-[11px] font-semibold text-primary hover:text-primary-dark uppercase tracking-wider transition-all shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">dashboard</span>
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} title="Cerrar Sesión" className="glass-card size-9 rounded-lg text-primary hover:text-white hover:bg-primary uppercase transition-all shadow-sm flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link href="/admin/login" className="!py-2 !px-6 bg-primary hover:bg-primary-dark text-white rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors">Admin</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
