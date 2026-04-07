'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
    const { token, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [activeOperations, setActiveOperations] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleHomeClick = (e) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const res = await fetch('/api/active-operations');
                if (res.ok) {
                    const data = await res.json();
                    setActiveOperations(data);
                }
            } catch (err) {
                console.error("Failed to fetch active operations:", err);
            }
        };
        fetchOperations();
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-cream/80 backdrop-blur-md border-b border-primary/10">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                <Link href="/" onClick={handleHomeClick} className="flex items-center gap-3 text-primary-dark group">
                    <div className="size-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-sm p-1.5 overflow-hidden border border-stone-200/50">
                        <img src="/GuillotJuliaLogo.webp" alt="Logo Julia Guillot" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="font-serif text-2xl font-medium tracking-tight hidden md:block">Julia Guillot</h1>
                </Link>

                <nav className="hidden md:flex items-center gap-6 md:gap-10">
                    {/* Render standard operations dynamically */}
                    {['Venta', 'Alquiler', 'Temporada'].map(op => {
                        if (activeOperations.includes(op)) {
                            return (
                                <Link key={op} href={`/search?operation=${op}`} className="text-xs font-semibold text-stone-dark hover:text-primary uppercase tracking-wider transition-colors">
                                    {op === 'Venta' ? 'Comprar' : op === 'Alquiler' ? 'Alquilar' : op}
                                </Link>
                            );
                        }
                        return null;
                    })}
                    
                    {/* Render Proyecto conditionally and stacked */}
                    {activeOperations.includes('Proyecto') && (
                        <Link href="/search?operation=Proyecto" className="flex flex-col items-center justify-center text-[10px] md:text-xs font-semibold text-stone-dark hover:text-primary uppercase tracking-wider transition-colors leading-tight text-center">
                            <span>Proyectos</span>
                            <span>Inmobiliarios</span>
                        </Link>
                    )}

                    {token ? (
                        <div className="flex items-center gap-3">
                            <Link href="/admin/leads" className="hidden md:flex glass-card px-4 py-2 rounded-lg text-[11px] font-semibold text-primary hover:text-primary-dark uppercase tracking-wider transition-all shadow-sm items-center gap-2">
                                <span className="material-symbols-outlined text-sm">contact_mail</span>
                                Leads
                            </Link>
                            <Link href="/admin/dashboard" className="glass-card px-4 py-2 rounded-lg text-[11px] font-semibold text-primary hover:text-primary-dark uppercase tracking-wider transition-all shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">dashboard</span>
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} title="Cerrar Sesión" className="glass-card size-9 rounded-lg text-primary hover:text-white hover:bg-primary uppercase transition-all shadow-sm flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link href="/admin/login" className="py-2! px-6! bg-primary hover:bg-primary-dark text-white rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors">Admin</Link>
                    )}
                </nav>

                {/* Mobile Menu Toggle Button */}
                <button 
                    className="md:hidden flex items-center justify-center text-primary p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="material-symbols-outlined text-3xl">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 right-0 w-full bg-cream/95 backdrop-blur-xl border-b border-primary/10 shadow-lg px-6 py-6 flex flex-col gap-5">
                    {['Venta', 'Alquiler', 'Temporada'].map(op => {
                        if (activeOperations.includes(op)) {
                            return (
                                <Link 
                                    key={op} 
                                    href={`/search?operation=${op}`} 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="text-[13px] font-bold text-stone-dark hover:text-primary uppercase tracking-widest transition-colors border-b border-stone-dark/5 pb-3 block"
                                >
                                    {op === 'Venta' ? 'Comprar' : op === 'Alquiler' ? 'Alquilar' : op}
                                </Link>
                            );
                        }
                        return null;
                    })}
                    
                    {activeOperations.includes('Proyecto') && (
                        <Link 
                            href="/search?operation=Proyecto" 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className="text-[13px] font-bold text-stone-dark hover:text-primary uppercase tracking-widest transition-colors border-b border-stone-dark/5 pb-3 block"
                        >
                            Proyectos Inmobiliarios
                        </Link>
                    )}

                    {token ? (
                        <div className="flex flex-col gap-3 mt-2">
                            <Link href="/admin/leads" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-[13px] font-bold text-primary hover:text-primary-dark uppercase py-2">
                                <span className="material-symbols-outlined">contact_mail</span> Leads
                            </Link>
                            <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-[13px] font-bold text-primary hover:text-primary-dark uppercase py-2">
                                <span className="material-symbols-outlined">dashboard</span> Dashboard
                            </Link>
                            <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 text-[13px] font-bold text-red-500 hover:text-red-700 uppercase py-2 text-left">
                                <span className="material-symbols-outlined">logout</span> Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 py-3 w-full bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-center block">
                            Admin
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
