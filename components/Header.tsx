
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Olaylar', path: '/olaylar' },
    { name: 'Mini Oyunlar', path: '/mini-oyunlar' },
    { name: 'Sohbet', path: '/sohbet' },
    { name: 'İletişim', path: '/iletisim' },
];

const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `relative font-orbitron uppercase tracking-widest text-sm transition-colors duration-300 hover:text-cyber-purple ${
                    isActive ? 'text-cyber-purple' : 'text-light-gray'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {children}
                    {isActive && (
                        <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyber-purple"
                            layoutId="underline"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const mobileMenuVariants = {
        open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
        closed: { opacity: 0, y: "-100%", transition: { duration: 0.5 } },
    };

    return (
        <header className="sticky top-0 z-40 bg-dark-anthracite/50 backdrop-blur-lg border-b border-metallic-gray/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <NavLink to="/" className="text-2xl font-orbitron font-bold text-light-gray tracking-tighter">
                        OTOBOTLAR8/E
                    </NavLink>
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavItem key={link.name} to={link.path}>{link.name}</NavItem>
                        ))}
                    </nav>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-light-gray focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden absolute top-full left-0 w-full bg-dark-anthracite/90 backdrop-blur-lg shadow-lg"
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <nav className="flex flex-col items-center space-y-6 py-8">
                            {navLinks.map((link) => (
                                <NavItem key={link.name} to={link.path} onClick={() => setIsOpen(false)}>{link.name}</NavItem>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
