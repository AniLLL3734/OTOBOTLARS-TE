
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from '../services/firebase';
import type { SohbetMesaji } from '../types';
import AnimatedPage from '../components/AnimatedPage';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ChatPage: React.FC = () => {
    const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([]);
    const [yeniMesaj, setYeniMesaj] = useState('');
    const [kullaniciAdi, setKullaniciAdi] = useLocalStorage<string>('otobotlar-kullaniciAdi', '');
    const [isKullaniciAdiSet, setIsKullaniciAdiSet] = useState(!!kullaniciAdi);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const q = query(collection(db, "chat"), orderBy("tarih", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMesajlar: SohbetMesaji[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedMesajlar.push({
                    id: doc.id,
                    kullaniciAdi: data.kullaniciAdi,
                    metin: data.metin,
                    tarih: data.tarih ? data.tarih.toDate() : new Date()
                });
            });
            setMesajlar(fetchedMesajlar);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mesajlar]);
    
    const handleKullaniciAdiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (kullaniciAdi.trim()) {
            setIsKullaniciAdiSet(true);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (yeniMesaj.trim() === '') return;
        
        await addDoc(collection(db, "chat"), {
            metin: yeniMesaj,
            kullaniciAdi: kullaniciAdi,
            tarih: serverTimestamp()
        });
        
        setYeniMesaj('');
    };

    if (!isKullaniciAdiSet) {
        return (
            <AnimatedPage>
                <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                    <motion.div 
                        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2 className="text-3xl font-orbitron font-bold text-light-gray mb-4">Frekansa Katıl</h2>
                        <p className="text-metallic-gray mb-6">Diğer gezginlerle bağlantı kurmak için bir çağrı işareti seç.</p>
                        <form onSubmit={handleKullaniciAdiSubmit}>
                            <input
                                type="text"
                                value={kullaniciAdi}
                                onChange={(e) => setKullaniciAdi(e.target.value)}
                                placeholder="Çağrı İşaretin?"
                                className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all text-center"
                                required
                            />
                            <button type="submit" className="mt-6 w-full px-8 py-3 font-orbitron text-sm text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)]">
                                Bağlantı Kur
                            </button>
                        </form>
                    </motion.div>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20 overflow-hidden">
                <header className="p-4 border-b border-metallic-gray/20">
                    <h1 className="text-2xl font-orbitron font-bold text-center">Genel Frekans</h1>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    <AnimatePresence>
                        {mesajlar.map(msg => (
                            <motion.div
                                key={msg.id}
                                className={`flex items-end gap-2 mb-4 ${msg.kullaniciAdi === kullaniciAdi ? 'justify-end' : 'justify-start'}`}
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.kullaniciAdi === kullaniciAdi ? 'bg-cyber-purple/80 text-white rounded-br-none' : 'bg-metallic-gray/20 text-light-gray rounded-bl-none'}`}>
                                    {msg.kullaniciAdi !== kullaniciAdi && (
                                        <p className="text-xs font-bold font-orbitron text-cyber-purple mb-1">{msg.kullaniciAdi}</p>
                                    )}
                                    <p className="break-words">{msg.metin}</p>
                                    <p className="text-xs opacity-60 text-right mt-1">{msg.tarih.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={endOfMessagesRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-metallic-gray/20 flex gap-4">
                    <input
                        type="text"
                        value={yeniMesaj}
                        onChange={(e) => setYeniMesaj(e.target.value)}
                        placeholder="Frekansa bir mesaj gönder..."
                        className="flex-1 bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-2 px-3 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all"
                    />
                    <button type="submit" className="px-6 py-2 font-orbitron text-sm text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)]">
                        Gönder
                    </button>
                </form>
            </div>
        </AnimatedPage>
    );
};

export default ChatPage;
