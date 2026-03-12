'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Dashboard = () => {
    const [publications, setPublications] = useState([]);
    const { token, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!token) router.replace('/admin/login');
        }, 100);
        return () => clearTimeout(timer);
    }, [token, router]);

    const fetchPublications = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications?limit=1000`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const json = await res.json();
                setPublications(json.data || json);
            }
        } catch (err) {
            console.error('Error fetching publications:', err);
        }
    };

    useEffect(() => {
        if (token) fetchPublications();
    }, [token]);



    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta publicación de forma permanente?')) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchPublications();
            else alert('Error al eliminar. Intenta nuevamente.');
        } catch (err) {
            alert('Error al eliminar. Intenta nuevamente.');
        }
    };

    if (!token) return null;

    return (
        <div className="bg-cream min-h-screen font-display flex flex-col">
            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
                <aside className="lg:col-span-12 xl:col-span-4">
                    <div className="sticky top-32 glass-card p-10 rounded-3xl shadow-glass border border-white/60 text-center flex flex-col items-center justify-center min-h-[300px]">
                        <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">add_home</span>
                        </div>
                        <h2 className="font-serif text-2xl text-stone-dark mb-3">¿Nueva propiedad?</h2>
                        <p className="text-stone-dark/60 text-sm mb-8 px-4">Utiliza nuestro nuevo asistente paso a paso para publicarla fácilmente.</p>
                        <Link href="/admin/nueva-propiedad" className="w-full bg-[#F06C00] hover:bg-[#D96100] text-white font-medium py-4 rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all text-center block mb-4">
                            Crear Nueva Propiedad
                        </Link>

                        <div className="w-full h-px bg-stone-dark/10 my-4"></div>

                        <div className="size-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 mt-2">
                            <span className="material-symbols-outlined text-2xl">contact_mail</span>
                        </div>
                        <h3 className="font-serif text-xl text-stone-dark mb-2">Mensajes de Clientes</h3>
                        <p className="text-stone-dark/60 text-xs mb-6 px-2">Revisa las consultas que te envían desde la web.</p>
                        <Link href="/admin/leads" className="w-full bg-stone-100 hover:bg-stone-200 text-stone-dark font-medium py-3 rounded-xl uppercase tracking-wider text-[11px] transition-all text-center block border border-stone-200">
                            Ver Panel de Consultas
                        </Link>
                    </div>
                </aside>
                <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                    <div className="flex items-end justify-between border-b border-stone-dark/5 pb-8">
                        <div>
                            <h2 className="font-serif text-4xl text-stone-dark">Listados Activos</h2>
                            <p className="text-stone-light text-sm mt-2">Tienes {publications.length} propiedades publicadas</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {publications.map(pub => (
                            <div key={pub.id} className="glass-card p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/30 transition-all">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="size-20 rounded-xl overflow-hidden shrink-0 shadow-sm relative">
                                        <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {pub.status === 'draft' && <div className="absolute top-0 right-0 bg-stone-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">Borrador</div>}
                                        {pub.status === 'reserved' && <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">R</div>}
                                        {pub.status === 'sold' && <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">V</div>}
                                    </div>
                                    <div className="grow">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 bg-primary/5 text-primary rounded border border-primary/10">{pub.operation}</span>
                                            <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 bg-stone-dark/5 text-stone-dark/60 rounded border border-stone-dark/10">{pub.type}</span>
                                            {pub.status === 'draft' && <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 bg-stone-200 text-stone-600 rounded">Borrador</span>}
                                            {pub.status === 'reserved' && <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Reservada</span>}
                                            {pub.status === 'sold' && <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 bg-red-100 text-red-700 rounded">Vendida</span>}
                                        </div>
                                        <h4 className="font-serif text-xl text-stone-dark line-clamp-1">{pub.title}</h4>
                                        <p className="text-stone-dark/60 text-xs font-medium tracking-wide mt-1">{pub.location} <span className="mx-1">•</span> ${pub.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link href={`/admin/editar-propiedad/${pub.id}`} className="size-10 rounded-xl bg-blue-50/50 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-100 transition-all flex items-center justify-center group/btn" title="Editar">
                                        <span className="material-symbols-outlined text-lg group-hover/btn:-rotate-12 transition-transform">edit</span>
                                    </Link>
                                    <button onClick={() => handleDelete(pub.id)} className="size-10 rounded-xl bg-red-50/50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 transition-all flex items-center justify-center group/btn" title="Eliminar">
                                        <span className="material-symbols-outlined text-lg group-hover/btn:rotate-12 transition-transform">delete_sweep</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {publications.length === 0 && <div className="h-48 flex flex-col items-center justify-center glass-card rounded-2xl opacity-60 border-dashed border border-stone-dark/20"><span className="material-symbols-outlined text-4xl mb-4 text-stone-dark/40">add_home</span><p className="font-serif text-lg text-stone-dark/60 tracking-wide">Comienza agregando tu primera propiedad</p></div>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
