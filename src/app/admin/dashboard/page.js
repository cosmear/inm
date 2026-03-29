'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

async function fetchPublicationsData(token) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/publications?limit=1000`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Error fetching publications');
    }

    const json = await res.json();
    return json.data || json;
}

const Dashboard = () => {
    const [publications, setPublications] = useState([]);
    const [downloadingQrId, setDownloadingQrId] = useState(null);
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!token) router.replace('/admin/login');
        }, 100);
        return () => clearTimeout(timer);
    }, [token, router]);

    useEffect(() => {
        if (!token) return;

        const loadPublications = async () => {
            try {
                const publicationsData = await fetchPublicationsData(token);
                setPublications(publicationsData);
            } catch (err) {
                console.error('Error fetching publications:', err);
            }
        };

        loadPublications();
    }, [token]);

    const getPublicPropertyUrl = (id) => {
        const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '');
        const fallbackBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const baseUrl = configuredBaseUrl || fallbackBaseUrl;

        return `${baseUrl}/propiedad/${id}`;
    };

    const getQrFilename = (title) => {
        const sanitizedTitle = (title || 'propiedad')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return `qr-${sanitizedTitle || 'propiedad'}.png`;
    };

    const handleDownloadQr = async (publication) => {
        setDownloadingQrId(publication.id);

        try {
            const QRCode = (await import('qrcode')).default;
            const qrDataUrl = await QRCode.toDataURL(getPublicPropertyUrl(publication.id), {
                width: 1024,
                margin: 2,
                errorCorrectionLevel: 'H',
                color: {
                    dark: '#1c1917',
                    light: '#ffffff',
                },
            });

            const downloadLink = document.createElement('a');
            downloadLink.href = qrDataUrl;
            downloadLink.download = getQrFilename(publication.title);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
        } catch (error) {
            console.error('Error generating QR:', error);
            alert('No se pudo descargar el QR. Intenta nuevamente.');
        } finally {
            setDownloadingQrId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('\u00BFSeguro que quieres eliminar esta publicaci\u00F3n de forma permanente?')) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/publications/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const publicationsData = await fetchPublicationsData(token);
                setPublications(publicationsData);
            } else {
                alert('Error al eliminar. Intenta nuevamente.');
            }
        } catch (err) {
            alert('Error al eliminar. Intenta nuevamente.');
        }
    };

    if (!token) return null;

    return (
        <div className="bg-cream min-h-screen font-display flex flex-col">
            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
                <aside className="lg:col-span-12 xl:col-span-4 h-full">
                    <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide glass-card p-6 lg:p-8 rounded-3xl shadow-glass border border-white/60 text-center flex flex-col items-center justify-center">
                        <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shrink-0">
                            <span className="material-symbols-outlined text-2xl">add_home</span>
                        </div>
                        <h2 className="font-serif text-xl lg:text-2xl text-stone-dark mb-2">&iquest;Nueva propiedad?</h2>
                        <p className="text-stone-dark/60 text-xs lg:text-sm mb-6 px-2">Utiliza nuestro nuevo asistente paso a paso para publicarla f&aacute;cilmente.</p>
                        <Link href="/admin/nueva-propiedad" className="w-full bg-[#F06C00] hover:bg-[#D96100] text-white font-medium py-3 rounded-xl uppercase tracking-wider text-[11px] lg:text-xs shadow-lg transition-all text-center block shrink-0">
                            Crear Nueva Propiedad
                        </Link>

                        <div className="w-full h-px bg-stone-dark/10 my-6 shrink-0"></div>

                        <div className="size-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 shrink-0">
                            <span className="material-symbols-outlined text-xl">contact_mail</span>
                        </div>
                        <h3 className="font-serif text-lg lg:text-xl text-stone-dark mb-1">Mensajes de Clientes</h3>
                        <p className="text-stone-dark/60 text-[10px] lg:text-xs mb-5 px-2">Revisa las consultas que te env&iacute;an desde la web.</p>
                        <Link href="/admin/leads" className="w-full bg-stone-100 hover:bg-stone-200 text-stone-dark font-medium py-3 rounded-xl uppercase tracking-wider text-[10px] lg:text-[11px] transition-all text-center block border border-stone-200 shrink-0">
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
                        {publications.map((pub) => (
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
                                        <p className="text-stone-dark/60 text-xs font-medium tracking-wide mt-1">{pub.location} <span className="mx-1">&bull;</span> ${pub.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleDownloadQr(pub)}
                                        className="size-10 rounded-xl bg-amber-50/70 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-100 transition-all flex items-center justify-center group/btn disabled:opacity-60 disabled:cursor-wait"
                                        title="Descargar QR"
                                        disabled={downloadingQrId === pub.id}
                                    >
                                        <span className="material-symbols-outlined text-lg group-hover/btn:scale-110 transition-transform">
                                            {downloadingQrId === pub.id ? 'progress_activity' : 'qr_code_2'}
                                        </span>
                                    </button>
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
