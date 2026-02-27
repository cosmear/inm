import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [publications, setPublications] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', price: '', image_url: '', location: '',
        type: 'Penthouse', operation: 'Comprar', bedrooms: 1, bathrooms: 1, area: 50, amenities: ''
    });
    const { token, logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const fetchPublications = async () => {
        try {
            const res = await axios.get('/api/publications');
            setPublications(res.data);
        } catch (err) {
            console.error('Error fetching publications:', err);
        }
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/publications', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setForm({
                title: '', description: '', price: '', image_url: '', location: '',
                type: 'Penthouse', operation: 'Comprar', bedrooms: 1, bathrooms: 1, area: 50, amenities: ''
            });
            fetchPublications();
        } catch (err) {
            alert('Error al agregar publicación. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta publicación de forma permanente?')) return;
        try {
            await axios.delete(`/api/publications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPublications();
        } catch (err) {
            alert('Error al eliminar. Intenta nuevamente.');
        }
    };

    return (
        <div className="bg-cream min-h-screen font-display flex flex-col">
            {/* Admin Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-stone-dark/5">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 text-primary-dark group">
                        <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
                            <span className="material-symbols-outlined !text-[20px]">villa</span>
                        </div>
                        <h1 className="font-serif text-2xl font-medium tracking-tight">Maison Argent <span className="text-[10px] uppercase font-bold tracking-[0.2em] ml-2 text-stone-light/60">Admin</span></h1>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-light hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Form Section */}
                <aside className="lg:col-span-12 xl:col-span-4">
                    <div className="sticky top-32 glass-card p-10 rounded-[40px] shadow-glass border border-white/40">
                        <h2 className="font-serif text-3xl text-stone-dark mb-8">Nuevo Anuncio</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Título del Inmueble</label>
                                    <input type="text" name="title" placeholder="Ej: Penthouse en Recoleta" value={form.title} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-0 focus:border-primary transition-all text-sm outline-none" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Operación</label>
                                        <select name="operation" value={form.operation} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-4 py-3.5 focus:bg-white text-sm outline-none">
                                            <option value="Comprar">Venta</option>
                                            <option value="Alquilar">Alquiler</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Tipo</label>
                                        <select name="type" value={form.type} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-4 py-3.5 focus:bg-white text-sm outline-none">
                                            <option value="Penthouse">Penthouse</option>
                                            <option value="Casco Histórico">Casco Histórico</option>
                                            <option value="Villa Moderna">Villa Moderna</option>
                                            <option value="Viñedo">Viñedo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Precio (USD)</label>
                                        <input type="number" name="price" placeholder="500000" value={form.price} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white text-sm outline-none" required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Sup. (m²)</label>
                                        <input type="number" name="area" placeholder="120" value={form.area} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white text-sm outline-none" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Dormitorios</label>
                                        <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white text-sm outline-none" required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Baños</label>
                                        <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white text-sm outline-none" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Ubicación</label>
                                    <input type="text" name="location" placeholder="Ciudad, Provincia" value={form.location} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white text-sm outline-none" required />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">URL Imagen</label>
                                    <input type="text" name="image_url" placeholder="https://unsplash.com/..." value={form.image_url} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white text-sm outline-none" required />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Descripción Corta</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full bg-cream/30 border-stone-dark/5 rounded-2xl px-5 py-3.5 focus:bg-white text-sm outline-none min-h-[100px]" required></textarea>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-[24px] transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {loading ? 'Publicando...' : 'Crear Publicación'}
                            </button>
                        </form>
                    </div>
                </aside>

                {/* List Section */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                    <div className="flex items-end justify-between border-b border-stone-dark/5 pb-8">
                        <div>
                            <h2 className="font-serif text-4xl text-stone-dark">Listados Activos</h2>
                            <p className="text-stone-light text-sm mt-2">Tienes {publications.length} propiedades publicadas</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {publications.map(pub => (
                            <div key={pub.id} className="glass-card p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-8 w-full">
                                    <div className="size-24 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                                        <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-md">{pub.operation}</span>
                                            <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-stone-dark/5 text-stone-light rounded-md">{pub.type}</span>
                                        </div>
                                        <h4 className="font-serif text-2xl text-stone-dark line-clamp-1">{pub.title}</h4>
                                        <p className="text-stone-light text-xs font-bold tracking-widest uppercase mt-1">{pub.location} • ${pub.price?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    <button
                                        onClick={() => handleDelete(pub.id)}
                                        className="size-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center group/btn"
                                    >
                                        <span className="material-symbols-outlined text-xl group-hover/btn:rotate-12 transition-transform">delete_sweep</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {publications.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center glass-card rounded-[40px] opacity-40 border-dashed border-2 border-stone-dark/10">
                                <span className="material-symbols-outlined text-6xl mb-4">add_home</span>
                                <p className="font-serif italic text-xl text-stone-dark">Comienza agregando tu primera propiedad</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
