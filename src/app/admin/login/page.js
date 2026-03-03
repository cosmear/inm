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
        <div className="min-h-screen bg-cream selection:bg-primary/30 selection:text-stone-dark flex flex-col pt-20">
            <main className="flex items-center justify-center flex-grow p-6">
                <div className="glass-card p-10 md:p-14 rounded-3xl max-w-lg w-full relative overflow-hidden shadow-sm border border-white/60">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                    <div className="relative z-10 text-center mb-10">
                        <span className="text-primary/80 font-semibold tracking-[0.2em] text-[10px] uppercase mb-4 block">Boutique Real Estate</span>
                        <h2 className="font-serif text-3xl md:text-4xl text-stone-dark leading-tight">Acceso Privado</h2>
                        <p className="text-stone-dark/60 text-sm mt-3">Gestión de listados y propiedades exclusivas.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50/50 text-red-500 px-6 py-4 rounded-xl text-[11px] font-medium uppercase tracking-wider mb-8 border border-red-100 flex items-center gap-3">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 mb-2 transition-colors group-focus-within:text-primary">Usuario</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-5 py-3.5 text-sm text-stone-dark transition-all focus:bg-white focus:border-primary/40 outline-none"
                                    placeholder="Nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 mb-2 transition-colors group-focus-within:text-primary">Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-5 py-3.5 text-sm text-stone-dark transition-all focus:bg-white focus:border-primary/40 outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-4 rounded-xl transition-all uppercase tracking-wider text-xs shadow-lg shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-3 group"
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
