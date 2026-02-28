import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: "Maison Argent | Luxury Real Estate",
    description: "Redefiniendo el Lujo Argentino",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${inter.variable}`}>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=villa,dashboard,error,login,progress_activity,location_on,bed,shower,square_foot,add_home,delete_sweep,arrow_forward,arrow_outward,search_off,slow_motion_video,logout,send" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-cream text-stone-dark font-display min-h-screen flex flex-col antialiased">
                <AuthProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
