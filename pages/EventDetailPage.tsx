
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { olaylar } from '../constants';
import AnimatedPage from '../components/AnimatedPage';
import CommentSection from '../components/CommentSection';

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const olay = olaylar.find(o => o.id === id);

    if (!olay) {
        return (
            <AnimatedPage>
                <div className="text-center py-20">
                    <h2 className="text-3xl font-orbitron text-cyber-purple">404</h2>
                    <p className="mt-4 text-metallic-gray">Bu frekansta bir kayıt bulunamadı.</p>
                    <Link to="/olaylar" className="mt-8 inline-block text-cyber-purple hover:underline">
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
                    <Link to="/olaylar" className="text-cyber-purple hover:underline mb-8 block font-orbitron">
                        &larr; Tüm Olaylar
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-light-gray mb-2">{olay.baslik}</h1>
                    <p className="text-metallic-gray font-mono mb-8">{olay.tarih}</p>
                </motion.div>

                <motion.img
                    src={olay.gorsel}
                    alt={olay.baslik}
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
                    <p>{olay.icerik}</p>
                </motion.div>

                <CommentSection topicId={olay.id} />
            </div>
        </AnimatedPage>
    );
};

export default EventDetailPage;
