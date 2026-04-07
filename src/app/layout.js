import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    metadataBase: new URL('https://juliaguillot.com'),
    title: {
        default: "Julia Guillot | Inmobiliaria en San Miguel y Bella Vista",
        template: "%s | Julia Guillot Inmuebles"
    },
    description: "Inmobiliaria experta en San Miguel, Bella Vista y Muñiz. Compra, venta y alquiler de propiedades exclusivas, casas de lujo, departamentos y proyectos en pozo. Tu asesor inmobiliario de confianza para inversiones en Real Estate.",
    keywords: [
        "inmobiliaria San Miguel", "inmobiliaria Bella Vista", "inmobiliaria Muñiz", "propiedades", 
        "venta de casas", "alquiler de departamentos", "propiedades en pozo", "proyectos inmobiliarios", 
        "inversiones en ladrillo", "real estate Argentina", "asesor inmobiliario", "agente inmobiliario", 
        "publicar mi casa", "alquilar", "alquiler temporario", "venta", "comprar", "vender", 
        "comprar inmueble", "vender propiedad", "tasaciones", "Julia Guillot", "Julia Guillot Inmuebles", "inmobiliaria",
        "compraventa propiedades", "venta de casas en San Miguel", "venta de casas en Bella Vista", "venta de casas en Muñiz",
        "alquiler de departamentos en San Miguel", "alquiler de departamentos en Bella Vista", "alquiler de departamentos en Muñiz",
        "venta de casas en San Miguel", "venta de casas en Bella Vista", "venta de casas en Muñiz", "Casas apta credito", 
        "Departamento apto credito"
    ],
    authors: [{ name: 'Julia Guillot' }],
    creator: 'Julia Guillot',
    publisher: 'Julia Guillot Inmuebles',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Julia Guillot | Inmobiliaria',
        description: 'Conectando personas extraordinarias con oportunidades increíbles. Encuentra la propiedad perfecta en San Miguel, Bella Vista y Muñiz.',
        url: 'https://juliaguillot.com',
        siteName: 'Julia Guillot Inmuebles',
        images: [
            {
                url: '/GuillotJuliaLogo.png', // Usado cuando se comparte el enlace por WhatsApp/LinkedIn
                width: 800,
                height: 800,
                alt: 'Logo de Julia Guillot Inmobiliaria',
            },
        ],
        locale: 'es_AR',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/GuillotJuliaLogo.ico' },
            { url: '/GuillotJuliaLogo.png', type: 'image/png' },
        ],
        apple: [
            { url: '/GuillotJuliaLogo.png' }
        ],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${inter.variable}`}>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-cream text-stone-dark font-display min-h-screen flex flex-col antialiased pt-20 md:pt-0">
                <AuthProvider>
                    <Navbar />
                    {children}
                    <Footer />
                    <FloatingWhatsApp />
                </AuthProvider>
            </body>
        </html>
    );
}
