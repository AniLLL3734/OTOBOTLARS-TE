
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc } from '../services/firebase';
import type { Yorum } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CommentSectionProps {
    topicId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ topicId }) => {
    const [yorumlar, setYorumlar] = useState<Yorum[]>([]);
    const [yeniYorum, setYeniYorum] = useState('');
    const [kullaniciAdi, setKullaniciAdi] = useLocalStorage<string>('otobotlar-kullaniciAdi', '');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!topicId) return;

        const commentsCollectionRef = collection(db, `comments/${topicId}/messages`);
        const q = query(commentsCollectionRef, orderBy('tarih', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedYorumlar = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    kullaniciAdi: data.kullaniciAdi,
                    metin: data.metin,
                    tarih: data.tarih ? data.tarih.toDate() : new Date()
                } as Yorum;
            });
            setYorumlar(fetchedYorumlar);
            setIsLoading(false);
        }, (error) => {
            console.error("Yorumlar alınırken hata:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (yeniYorum.trim() === '' || kullaniciAdi.trim() === '') {
            alert('Çağrı işareti ve yankı boş bırakılamaz.');
            return;
        }

        const commentsCollectionRef = collection(db, `comments/${topicId}/messages`);
        await addDoc(commentsCollectionRef, {
            kullaniciAdi: kullaniciAdi.trim(),
            metin: yeniYorum.trim(),
            tarih: serverTimestamp()
        });
        setYeniYorum('');
    };

    return (
        <div className="mt-12 pt-8 border-t border-metallic-gray/20">
            <h3 className="text-3xl font-orbitron font-bold text-light-gray mb-6">Yankılar</h3>
            
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                         <label htmlFor="kullaniciAdi" className="block text-sm font-orbitron text-metallic-gray mb-2">Çağrı İşaretin?</label>
                         <input
                            id="kullaniciAdi"
                            type="text"
                            value={kullaniciAdi}
                            onChange={(e) => setKullaniciAdi(e.target.value)}
                            placeholder="Örn: GölgeGezgin"
                            className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-2 px-3 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="yeniYorum" className="block text-sm font-orbitron text-metallic-gray mb-2">Yankın</label>
                        <textarea
                            id="yeniYorum"
                            value={yeniYorum}
                            onChange={(e) => setYeniYorum(e.target.value)}
                            placeholder="Bu anıya bir iz bırak..."
                            className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-2 px-3 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all h-24 resize-none"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="mt-4 w-full md:w-auto px-8 py-3 font-orbitron text-sm text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)] disabled:opacity-50 disabled:cursor-not-allowed">
                    Bu Anıya Bir Yankı Bırak
                </button>
            </form>
            
            <div className="space-y-6">
                {isLoading && <p className="text-metallic-gray animate-pulse">Yankılar yükleniyor...</p>}
                <AnimatePresence>
                    {yorumlar.map(yorum => (
                        <motion.div
                            key={yorum.id}
                            className="bg-white/5 p-4 rounded-lg border border-metallic-gray/10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-cyber-purple font-orbitron">{yorum.kullaniciAdi}</p>
                                <p className="text-xs text-metallic-gray">{yorum.tarih.toLocaleString('tr-TR')}</p>
                            </div>
                            <p className="text-light-gray/90">{yorum.metin}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {!isLoading && yorumlar.length === 0 && (
                    <p className="text-metallic-gray text-center py-4">Henüz bir yankı bırakılmamış. İlk fısıltı senden gelsin.</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
