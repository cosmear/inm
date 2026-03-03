'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Dashboard = () => {
    const [publications, setPublications] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', price: '', image_url: '', location: '',
        type: 'Penthouse', operation: 'Comprar', bedrooms: 1, bathrooms: 1, area: 50, amenities: ''
    });
    const { token, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!token) router.replace('/admin/login');
        }, 100);
        return () => clearTimeout(timer);
    }, [token, router]);

    const fetchPublications = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications`);
            if (res.ok) setPublications(await res.json());
        } catch (err) {
            console.error('Error fetching publications:', err);
        }
    };

    useEffect(() => {
        if (token) fetchPublications();
    }, [token]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

            console.log("TOKEN EN DASHBOARD:", token);

            const res = await fetch(`${apiUrl}/api/publications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const result = await res.json().catch(() => null);
            console.log("STATUS PUBLICATION:", res.status);
            console.log("RESULT PUBLICATION:", result);

            if (res.ok) {
                setForm({
                    title: '',
                    description: '',
                    price: '',
                    image_url: '',
                    location: '',
                    type: 'Penthouse',
                    operation: 'Comprar',
                    bedrooms: 1,
                    bathrooms: 1,
                    area: 50,
                    amenities: ''
                });
                fetchPublications();
            } else {
                alert('Error al agregar publicación.');
            }
        } catch (err) {
            console.error("ERROR HANDLE SUBMIT:", err);
            alert('Error al agregar publicación. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

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
                    <div className="sticky top-32 glass-card p-8 rounded-2xl shadow-glass border border-white/60">
                        <h2 className="font-serif text-3xl text-stone-dark mb-8">Nuevo Anuncio</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Título del Inmueble</label><input type="text" name="title" value={form.title} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all" required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Operación</label><select name="operation" value={form.operation} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all"><option value="Comprar">Venta</option><option value="Alquilar">Alquiler</option></select></div>
                                    <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Tipo</label><select name="type" value={form.type} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all"><option value="Penthouse">Penthouse</option><option value="Casco Histórico">Casco Histórico</option><option value="Villa Moderna">Villa Moderna</option><option value="Viñedo">Viñedo</option></select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Precio (USD)</label><input type="number" name="price" value={form.price} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all" required /></div>
                                    <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Sup. (m²)</label><input type="number" name="area" value={form.area} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all" required /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Dormitorios</label><input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all" required /></div>
                                    <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Baños</label><input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all" required /></div>
                                </div>
                                <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Ubicación</label><input type="text" name="location" value={form.location} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all" required /></div>
                                <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">URL Imagen</label><input type="text" name="image_url" value={form.image_url} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all" required /></div>
                                <div><label className="text-[10px] font-medium uppercase tracking-wider text-stone-dark/60 block mb-2">Descripción Corta</label><textarea name="description" value={form.description} onChange={handleChange} className="w-full bg-white/50 border border-stone-dark/10 rounded-xl px-4 py-3 text-sm focus:border-primary/30 focus:bg-white outline-none transition-all min-h-[100px]" required></textarea></div>
                            </div>
                            <button disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-4 rounded-xl uppercase tracking-wider text-xs shadow-lg disabled:opacity-50 transition-all">{loading ? 'Publicando...' : 'Crear Publicación'}</button>
                        </form>
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
                                    <div className="size-20 rounded-xl overflow-hidden shrink-0 shadow-sm"><img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1.5"><span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 bg-primary/5 text-primary rounded border border-primary/10">{pub.operation}</span><span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 bg-stone-dark/5 text-stone-dark/60 rounded border border-stone-dark/10">{pub.type}</span></div>
                                        <h4 className="font-serif text-xl text-stone-dark line-clamp-1">{pub.title}</h4>
                                        <p className="text-stone-dark/60 text-xs font-medium tracking-wide mt-1">{pub.location} <span className="mx-1">•</span> ${pub.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0"><button onClick={() => handleDelete(pub.id)} className="size-10 rounded-xl bg-red-50/50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 transition-all flex items-center justify-center group/btn"><span className="material-symbols-outlined text-lg group-hover/btn:rotate-12 transition-transform">delete_sweep</span></button></div>
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
