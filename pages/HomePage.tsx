
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const HomePage: React.FC = () => {
    return (
        <AnimatedPage>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
                <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black uppercase tracking-wider text-light-gray"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <span className="text-cyber-purple">Otobotlar</span> Arşivi
                </motion.h1>
                <motion.p
                    className="mt-4 max-w-2xl text-lg md:text-xl text-metallic-gray font-inter"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                    Gerçekliğin sınırlarında gezinen, açıklanamayan ve kaydedilen anıların siber-mistik kasası.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, ease: 'backOut' }}
                >
                    <Link
                        to="/olaylar"
                        className="mt-12 inline-block px-10 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-cyber-purple/20 border-2 border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_20px_theme(colors.cyber-purple)]"
                    >
                        Arşivi Keşfet
                    </Link>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default HomePage;
