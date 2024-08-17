"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <div className="flex flex-col min-h-screen">
            {!isLoginPage && <Header />}
            <main className={`flex-grow ${!isLoginPage ? 'pt-16 pb-14' : ''}`}>
                {children}
            </main>
            {!isLoginPage && <Footer />}
        </div>
    );
};

export default Layout;