// pages/EfsaneFotograflar.tsx DOSYASININ DOĞRU HALİ

import React from 'react';
import { motion } from 'framer-motion';
import { efsaneFotograflar } from '../constants';     // Bir üst klasöre çıkıp constants.ts dosyasını bulur
import AnimatedPage from '../components/AnimatedPage'; // Bir üst klasöre çıkıp components'e girer
import PhotoCard from '../components/PhotoCard';       // Bir üst klasöre çıkıp components'e girer

const EfsaneFotograflar: React.FC = () => {
    return (
        <AnimatedPage>
            <motion.h1
                className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 text-light-gray"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Efsane Fotoğraflar Arşivi
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {efsaneFotograflar.map((fotograf) => (
                    <PhotoCard key={fotograf.id} fotograf={fotograf} />
                ))}
            </div>
        </AnimatedPage>
    );
};

export default EfsaneFotograflar;