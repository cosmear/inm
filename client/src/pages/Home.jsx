import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
    const [publications, setPublications] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const res = await axios.get('/api/publications');
                setPublications(res.data.slice(0, 3)); // Top 3 featured
            } catch (err) {
                console.error('Error fetching publications:', err);
            }
        };
        fetchPublications();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header / Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-cream/80 backdrop-blur-md border-b border-primary/10">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 text-primary-dark group">
                        <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
                            <span className="material-symbols-outlined !text-[20px]">villa</span>
                        </div>
                        <h1 className="font-serif text-2xl font-medium tracking-tight">Maison Argent</h1>
                    </Link>

                    <nav className="flex items-center gap-6 md:gap-10">
                        <Link to="/search?operation=Comprar" className="text-xs font-bold text-stone-dark hover:text-primary uppercase tracking-widest transition-colors">Comprar</Link>
                        <Link to="/search?operation=Alquilar" className="text-xs font-bold text-stone-dark hover:text-primary uppercase tracking-widest transition-colors">Alquilar</Link>
                        {token ? (
                            <Link to="/admin/dashboard" className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">dashboard</span>
                                Dashboard
                            </Link>
                        ) : (
                            <Link to="/admin/login" className="btn-primary !py-2 !px-6 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Admin</Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="h-screen relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                            className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite]"
                            alt="Luxury Home"
                        />
                        <div className="absolute inset-0 bg-stone-dark/40 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-4xl">
                        <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-6 block drop-shadow-md">Inmobiliaria Boutique</span>
                        <h2 className="font-serif text-5xl md:text-8xl text-white mb-10 leading-[0.9] drop-shadow-2xl">
                            Redefiniendo el <br /> <i className="font-normal opacity-90">Lujo Argentino</i>
                        </h2>

                        {/* Search Bar */}
                        <div className="bg-white/10 backdrop-blur-xl p-3 rounded-[32px] border border-white/20 shadow-2xl max-w-3xl mx-auto transform hover:scale-[1.02] transition-transform duration-500">
                            <div className="bg-white rounded-[24px] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-dark/5 overflow-hidden">
                                <Link to="/search?operation=Comprar" className="flex-1 px-8 py-5 hover:bg-primary/5 transition-colors text-left group">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1 group-hover:translate-x-1 transition-transform">Venta</span>
                                    <span className="text-stone-dark font-serif text-xl">Propiedades Exclusivas</span>
                                </Link>
                                <Link to="/search?operation=Alquilar" className="flex-1 px-8 py-5 hover:bg-primary/5 transition-colors text-left group">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1 group-hover:translate-x-1 transition-transform">Alquiler</span>
                                    <span className="text-stone-dark font-serif text-xl">Residencias de Temporada</span>
                                </Link>
                                <Link to="/search" className="bg-primary hover:bg-primary-dark text-white px-10 py-5 flex items-center justify-center gap-3 transition-all active:scale-95">
                                    <span className="font-bold uppercase tracking-widest text-xs">Explorar</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Section */}
                <section className="py-32 bg-cream">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                            <div className="max-w-xl">
                                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Listados Curados</span>
                                <h3 className="font-serif text-4xl md:text-6xl text-stone-dark leading-tight">
                                    Lo mejor del mercado en un solo lugar
                                </h3>
                            </div>
                            <Link to="/search" className="group flex items-center gap-4 text-stone-dark font-bold uppercase tracking-widest text-[10px]">
                                Ver todas las propiedades
                                <div className="size-10 rounded-full border border-stone-dark/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                </div>
                            </Link>
                        </div>

                        {publications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {publications.map(prop => (
                                    <PropertyCard key={prop.id} prop={prop} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center glass-card rounded-3xl opacity-50">
                                <p className="font-serif italic">No hay propiedades destacadas disponibles.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-stone-dark text-cream pt-32 pb-12">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-cream/10 pb-20 mb-12">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-8 text-cream">
                                <span className="material-symbols-outlined !text-[28px]">villa</span>
                                <h2 className="font-serif text-2xl font-medium">Maison Argent</h2>
                            </div>
                            <p className="text-stone-light text-sm leading-relaxed max-w-xs">
                                Conectando personas extraordinarias con propiedades excepcionales a lo largo de toda Argentina.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-8">Navegación</h4>
                            <ul className="space-y-4 text-xs font-bold tracking-widest text-stone-light uppercase">
                                <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                                <li><Link to="/search" className="hover:text-white transition-colors">Propiedades</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-8">Oficinas</h4>
                            <ul className="space-y-4 text-sm text-stone-light">
                                <li>Buenos Aires</li>
                                <li>Mendoza</li>
                                <li>Bariloche</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-primary mb-8">Newsletter</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Tu email"
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex-grow focus:outline-none focus:border-primary transition-colors"
                                />
                                <button className="size-12 bg-primary flex items-center justify-center rounded-xl hover:bg-primary-dark transition-all">
                                    <span className="material-symbols-outlined text-white">send</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-stone-light/50 gap-4">
                        <p>© 2024 Maison Argent. Todos los derechos reservados.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-white transition-colors">Términos</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
