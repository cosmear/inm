'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LeadsDashboard() {
    const { token, loading } = useAuth();
    const router = useRouter();
    const [leads, setLeads] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all'); // all, new, contacted, discarded
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading && !token) {
            router.push('/admin/login');
        } else if (token) {
            fetchLeads();
        }
    }, [token, loading]);

    const fetchLeads = async () => {
        setFetching(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error al obtener consultas");
            const data = await res.json();
            setLeads(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setFetching(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch('/api/admin/leads', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (!res.ok) throw new Error("Error al actualizar estado");

            // Actualizar estado localmente
            setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    if (!token) return null;

    const filteredLeads = filterStatus === 'all' ? leads : leads.filter(l => l.status === filterStatus);

    return (
        <div className="bg-cream min-h-screen pt-24 pb-20">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl text-stone-dark mb-2 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-4xl">contact_mail</span>
                            Gestión de Consultas (CRM)
                        </h1>
                        <p className="text-stone-dark/60">Revisa y administra los mensajes recibidos de tus clientes.</p>
                    </div>
                    <Link href="/admin/dashboard" className="text-stone-dark bg-white border border-stone-200 hover:bg-stone-50 px-4 py-2 rounded-xl transition-all shadow-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Volver al Panel
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-dark/5">

                    {/* Filtros rápidos */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-stone-dark text-white' : 'bg-stone-100 text-stone-dark/70 hover:bg-stone-200'}`}
                        >
                            Todas ({leads.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('new')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'new' ? 'bg-blue-500 text-white' : 'bg-stone-100 text-stone-dark/70 hover:bg-stone-200'}`}
                        >
                            Nuevas ({leads.filter(l => l.status === 'new').length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('contacted')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'contacted' ? 'bg-green-500 text-white' : 'bg-stone-100 text-stone-dark/70 hover:bg-stone-200'}`}
                        >
                            Contactadas ({leads.filter(l => l.status === 'contacted').length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('discarded')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'discarded' ? 'bg-stone-300 text-stone-dark' : 'bg-stone-100 text-stone-dark/70 hover:bg-stone-200'}`}
                        >
                            Descartadas ({leads.filter(l => l.status === 'discarded').length})
                        </button>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

                    {fetching ? (
                        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100">
                            <span className="material-symbols-outlined text-4xl text-stone-300 mb-2">inbox</span>
                            <p className="text-stone-dark/50">No hay consultas en esta categoría.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLeads.map((lead) => (
                                <div key={lead.id} className={`flex flex-col bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${lead.status === 'new' ? 'border-l-4 border-l-blue-500 border-t-stone-200 border-r-stone-200 border-b-stone-200' : 'border-stone-200'}`}>

                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-stone-dark">{lead.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                lead.status === 'contacted' ? 'bg-green-100 text-green-700' :
                                                    'bg-stone-200 text-stone-600'
                                            }`}>
                                            {lead.status === 'new' ? 'Nueva' : lead.status === 'contacted' ? 'Contactado' : 'Descartado'}
                                        </span>
                                    </div>

                                    <div className="text-sm text-stone-dark/70 space-y-1.5 mb-4 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-stone-400">phone</span>
                                            {lead.phone}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-stone-400">mail</span>
                                            <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">{lead.email}</a>
                                        </div>
                                        {lead.property_id && (
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-100">
                                                <span className="material-symbols-outlined text-[16px] text-stone-400">home</span>
                                                <Link href={`/propiedad/${lead.property_id}`} target="_blank" className="font-medium text-primary hover:underline line-clamp-1">
                                                    ID: {lead.property_id} - {lead.property_title || 'Propiedad'}
                                                </Link>
                                            </div>
                                        )}
                                        <div className="mt-3 bg-stone-50 p-3 rounded-xl border border-stone-100 italic text-stone-dark/80 line-clamp-4">
                                            "{lead.message}"
                                        </div>
                                        <div className="text-[10px] text-stone-400 text-right mt-1">
                                            {new Date(lead.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-stone-100">
                                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(lead.name)},%20te%20contacto%20de%20Maison%20Argent%20por%20tu%20consulta.`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium shadow-sm"
                                            onClick={() => { if (lead.status === 'new') handleStatusChange(lead.id, 'contacted') }}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">chat</span>
                                            Contactar por WhatsApp
                                        </a>

                                        <div className="flex gap-2">
                                            {lead.status !== 'contacted' && (
                                                <button
                                                    onClick={() => handleStatusChange(lead.id, 'contacted')}
                                                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-green-200"
                                                >
                                                    Marcar Contactado
                                                </button>
                                            )}
                                            {lead.status !== 'new' && (
                                                <button
                                                    onClick={() => handleStatusChange(lead.id, 'new')}
                                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-blue-200"
                                                >
                                                    Marcar Nuevo
                                                </button>
                                            )}
                                            {lead.status !== 'discarded' && (
                                                <button
                                                    onClick={() => handleStatusChange(lead.id, 'discarded')}
                                                    className="flex-none bg-stone-100 hover:bg-stone-200 text-stone-500 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors border border-stone-200"
                                                    title="Descartar"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
