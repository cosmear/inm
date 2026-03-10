'use client';
import React, { useState } from 'react';

const ContactForm = ({ propertyId, propertyTitle }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: propertyTitle ? `Hola, estoy interesado en la propiedad "${propertyTitle}". Por favor envíenme más información.` : ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ property_id: propertyId, ...formData })
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-2">check_circle</span>
                <h3 className="font-serif text-xl text-stone-dark mb-2">¡Consulta enviada!</h3>
                <p className="text-stone-dark/70 text-sm">Nos pondremos en contacto a la brevedad.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-primary text-sm font-semibold hover:underline"
                >
                    Enviar otra consulta
                </button>
            </div>
        );
    }

    return (
        <div className="bg-stone-100 rounded-2xl p-6 shadow-sm border border-stone-200">
            <h3 className="font-serif text-2xl text-stone-dark mb-6">Consultar por esta propiedad</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-dark mb-1">Nombre y Apellido</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Ej. Juan Pérez"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-dark mb-1">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="Ej. 11 1234 5678"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="email" className="block text-sm font-medium text-stone-dark mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-stone-dark mb-1">Mensaje</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                    {status === 'loading' ? (
                        <span className="material-symbols-outlined animate-spin">sync</span>
                    ) : (
                        <span className="material-symbols-outlined">send</span>
                    )}
                    {status === 'loading' ? 'Enviando...' : 'Enviar Consulta'}
                </button>
                {status === 'error' && (
                    <p className="text-red-500 text-sm text-center mt-2">Hubo un error al enviar su consulta. Intente nuevamente.</p>
                )}
            </form>
        </div>
    );
};

export default ContactForm;
