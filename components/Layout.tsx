
import React from 'react';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-anthracite text-light-gray font-inter">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-dark-anthracite via-black to-[#1a0029] bg-[size:200%_200%] animate-background-pan" />
            <div className="relative z-10">
                <Header />
                <main className="container mx-auto px-4 py-8 md:px-8 md:py-12">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
