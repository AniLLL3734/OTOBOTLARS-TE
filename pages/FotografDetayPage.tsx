// pages/FotografDetayPage.tsx DOSYASININ DOĞRU HALİ

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { efsaneFotograflar } from '../constants';
import AnimatedPage from '../components/AnimatedPage';
import CommentSection from '../components/CommentSection';

const FotografDetayPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const fotograf = efsaneFotograflar.find(f => f.id === id);

    if (!fotograf) {
        return (
            <AnimatedPage>
                <div className="text-center py-20">
                    <h2 className="text-3xl font-orbitron text-cyber-purple">404</h2>
                    <p className="mt-4 text-metallic-gray">Bu görsel arşivde bulunamadı.</p>
                    <Link to="/efsane-fotograflar" className="mt-8 inline-block text-cyber-purple hover:underline">
                        ← Arşive Geri Dön
                    </Link>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <Link to="/efsane-fotograflar" className="text-cyber-purple hover:underline mb-8 block font-orbitron">
                        ← Tüm Fotoğraflar
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-light-gray mb-2">{fotograf.baslik}</h1>
                    <p className="text-metallic-gray font-mono mb-8">{fotograf.tarih}</p>
                </motion.div>

                <motion.img
                    src={fotograf.gorsel}
                    alt={fotograf.baslik}
                    className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg shadow-black/30"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                />

                <motion.div
                    className="prose prose-invert prose-lg max-w-none text-light-gray/90 leading-relaxed prose-p:text-light-gray/90 prose-headings:text-light-gray"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <p>{fotograf.aciklama}</p>
                </motion.div>

                <CommentSection topicId={fotograf.id} />
            </div>
        </AnimatedPage>
    );
};

export default FotografDetayPage;