import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from "@/components/ui/Header";
import Footer from "@/components/Footer";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    // Don't apply layout to admin routes
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // Apply layout to all other routes
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <Header />
        <main className="flex-1">
            {children}
        </main>
        <Footer />
        </div>
    );
    };

export default Layout;