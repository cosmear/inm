'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                login(data.token);
                router.push('/admin/dashboard');
            } else {
                setError('Credenciales inválidas o error de servidor');
            }
        } catch (err) {
            setError('Credenciales inválidas o error de servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream selection:bg-primary selection:text-white flex flex-col pt-20">
            <main className="flex items-center justify-center flex-grow p-6">
                <div className="glass-card p-10 md:p-14 rounded-[48px] max-w-lg w-full relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <div className="relative z-10 text-center mb-12">
                        <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Boutique Real Estate</span>
                        <h2 className="font-serif text-4xl text-stone-dark leading-tight">Acceso Privado</h2>
                        <p className="text-stone-light text-sm mt-3">Gestion de listados y propiedades exclusivas.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest mb-8 border border-red-100 flex items-center gap-3">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-3 transition-colors group-focus-within:text-stone-dark">Usuario</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-cream/40 border-stone-dark/10 rounded-2xl px-6 py-4 text-stone-dark transition-all focus:bg-white focus:ring-0 focus:border-primary outline-none"
                                    placeholder="Nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-3 transition-colors group-focus-within:text-stone-dark">Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-cream/40 border-stone-dark/10 rounded-2xl px-6 py-4 text-stone-dark transition-all focus:bg-white focus:ring-0 focus:border-primary outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-[24px] transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    <span>Ingresar al Sistema</span>
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">login</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
