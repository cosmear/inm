import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: "Julia Guillot - Inmuebles Boutique",
    description: "Confianza en raíces",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${inter.variable}`}>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-cream text-stone-dark font-display min-h-screen flex flex-col antialiased">
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
