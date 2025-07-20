import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AnimatedPage>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
                <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black uppercase tracking-wider text-light-gray"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-cyber-purple">Otobotlar8/E</span> Arşivi
                </motion.h1>
                <motion.p
                    className="mt-4 max-w-2xl text-lg md:text-xl text-metallic-gray font-inter"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Gerçekliğin sınırlarında gezinen, açıklanamayan ve kaydedilen anıların siber-mistik kasası.
                </motion.p>
                <motion.div
                    className="mt-12 flex flex-col sm:flex-row gap-6 items-center flex-wrap justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <button
                        onClick={() => navigate('/olaylar')}
                        className="w-full sm:w-auto inline-block px-8 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-cyber-purple/20 border-2 border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_20px_theme(colors.cyber-purple)]"
                    >
                        Arşivi Keşfet
                    </button>
                    <button
                        onClick={() => navigate('/olay-ekle')}
                        className="w-full sm:w-auto inline-block px-8 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-green-500/20 border-2 border-green-500 rounded-md transition-all duration-300 hover:bg-green-500 hover:text-dark-anthracite hover:shadow-[0_0_20px_theme(colors.green.500)]"
                    >
                        Anı Ekle
                    </button>
                    {/* YENİ BUTON */}
                    <button
                        onClick={() => navigate('/fotograf-ekle')}
                        className="w-full sm:w-auto inline-block px-8 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-blue-500/20 border-2 border-blue-500 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-dark-anthracite hover:shadow-[0_0_20px_theme(colors.blue.500)]"
                    >
                        Fotoğraf Ekle
                    </button>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default HomePage;