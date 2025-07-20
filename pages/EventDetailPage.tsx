import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// GEREKLİLER: Firebase servislerini ve statik olayları import ediyoruz.
import { db, doc, getDoc } from '../services/firebase';
import { olaylar as statikOlaylar } from '../constants';
import type { Olay } from '../types'; // Olay tipini kullanacağız

import AnimatedPage from '../components/AnimatedPage';

// Bu bileşen veriyi yüklerken gösterilecek.
const DetayYukleniyor: React.FC = () => (
    <div className="text-center py-20">
        <h2 className="text-3xl font-orbitron text-cyber-purple animate-pulse">Kayıt Aranıyor...</h2>
    </div>
);

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [olay, setOlay] = useState<Olay | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // id yoksa işlemi sonlandır.
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchOlayDetayi = async () => {
            setLoading(true);

            // 1. ÖNCE FIREBASE'DEN ARAMAYI DENE ("Sizden Gelenler" için)
            try {
                const docRef = doc(db, 'kullaniciOlaylari', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const veri = docSnap.data();
                    // Firebase verisini 'Olay' tipine uygun hale getir
                    setOlay({
                        id: docSnap.id,
                        baslik: veri.baslik || 'Başlık Yok',
                        ozet: veri.aciklama ? veri.aciklama.substring(0, 150) + '...' : 'Açıklama Yok',
                        icerik: veri.aciklama || 'İçerik bulunamadı.',
                        tarih: veri.yazar || 'Bilinmeyen Yazar',
                        gorsel: veri.gorsel || '',
                    });
                    setLoading(false);
                    return; // Veri bulundu, işlemi bitir.
                }
            } catch (error) {
                console.error("Firebase'den olay detayı çekilirken hata:", error);
            }

            // 2. FIREBASE'DE BULAMAZSAN, 'constants.tsx' İÇİNDE ARA ("Kurucu Arşivi" için)
            const statikOlay = statikOlaylar.find(o => o.id === id);
            if (statikOlay) {
                setOlay(statikOlay);
            } else {
                setOlay(null); // Hiçbir yerde bulunamadı.
            }

            setLoading(false);
        };

        fetchOlayDetayi();
    }, [id]); // id değiştiğinde bu fonksiyonu tekrar çalıştır.

    // Veri yüklenirken...
    if (loading) {
        return <AnimatedPage><DetayYukleniyor /></AnimatedPage>;
    }

    // Hiçbir veri bulunamadıysa 404 göster.
    if (!olay) {
        return (
            <AnimatedPage>
                <div className="text-center py-20">
                    <h2 className="text-4xl font-orbitron text-cyber-purple mb-4">404</h2>
                    <p className="mt-4 text-xl text-metallic-gray">Bu frekansta bir kayıt bulunamadı.</p>
                    <Link to="/olaylar" className="mt-8 inline-block text-lg text-cyber-purple hover:underline">
                        ← Arşive Geri Dön
                    </Link>
                </div>
            </AnimatedPage>
        );
    }

    // Olay bulunduysa detayları göster.
    return (
        <AnimatedPage>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link to="/olaylar" className="text-cyber-purple hover:underline mb-8 block font-orbitron">
                        ← Tüm Olaylar
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-light-gray mb-2">{olay.baslik}</h1>
                    <p className="text-metallic-gray font-mono mb-8">{olay.tarih}</p>
                </motion.div>

                {olay.gorsel && (
                    <motion.img
                        src={olay.gorsel}
                        alt={olay.baslik}
                        className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg shadow-black/30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    />
                )}

                <motion.div
                    // Tailwind Typography (`prose`) ile metni daha okunaklı yapalım
                    className="prose prose-invert prose-lg max-w-none text-light-gray/90 leading-relaxed prose-p:my-4 prose-headings:text-light-gray whitespace-pre-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p>{olay.icerik}</p>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default EventDetailPage;