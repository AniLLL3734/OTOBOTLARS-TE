import React from 'react';
import Header from './Header';
import YAPIMCI from './YAPIMCI'; // 1. Yeni component'i import ettik

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-anthracite text-light-gray font-inter">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-dark-anthracite via-black to-[#1a0029] bg-[size:200%_200%] animate-background-pan" />
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="container mx-auto px-4 py-8 md:px-8 md:py-12 flex-grow">
                    {children}
                </main>
                
                {/* 2. <YAPIMCI /> component'ini main etiketinden sonra ekledik */}
                <YAPIMCI />
            </div>
        </div>
    );
};

export default Layout;