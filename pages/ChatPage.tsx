import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from '../services/firebase';
import type { SohbetMesaji } from '../types';
import AnimatedPage from '../components/AnimatedPage';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ChatPage: React.FC = () => {
    const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([]);
    const [yeniMesaj, setYeniMesaj] = useState('');
    
    // YENİDEN DÜZENLENDİ: Artık kullanıcı adı sorma mantığı yok.
    // Direkt localStorage'dan adı okuyoruz. 'Ziyaretçi' bir fallback, olur da bir şey ters giderse diye.
    const [kullaniciAdi] = useLocalStorage<string>('otobotlar-kullaniciAdi', 'Ziyaretçi');
    
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const q = query(collection(db, "chat"), orderBy("tarih", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMesajlar: SohbetMesaji[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    kullaniciAdi: data.kullaniciAdi,
                    metin: data.metin,
                    tarih: data.tarih ? data.tarih.toDate() : new Date()
                };
            });
            setMesajlar(fetchedMesajlar);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Yeni mesajlar geldiğinde en sona kaydır.
        if (mesajlar.length > 0) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [mesajlar]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = yeniMesaj.trim();
        
        // Kullanıcı adı var mı ve mesaj boş mu kontrol et.
        if (trimmedMessage === '' || !kullaniciAdi) return;

        // Kullanıcı arayüzünü anında güncellemek için input'u hemen temizle.
        setYeniMesaj('');

        try {
            await addDoc(collection(db, "chat"), {
                metin: trimmedMessage,
                kullaniciAdi: kullaniciAdi, // Girişte alınan adı kullan.
                tarih: serverTimestamp(),
            });
        } catch (error) {
            console.error("Mesaj gönderilemedi:", error);
            // Hata olursa kullanıcının yazdığı mesajı kaybetmemesi için geri koy.
            setYeniMesaj(trimmedMessage); 
        }
    };

    // Artık 'if' bloğu yok, direkt sohbet ekranı render ediliyor.
    return (
        <AnimatedPage>
            <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20 overflow-hidden">
                <header className="p-4 border-b border-metallic-gray/20 text-center">
                    <h1 className="text-2xl font-orbitron font-bold text-light-gray">Genel Frekans</h1>
                    {kullaniciAdi && <p className="text-metallic-gray text-sm">Çağrı İşareti: <span className="text-cyber-purple font-semibold">{kullaniciAdi}</span></p>}
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    <AnimatePresence>
                        {mesajlar.map((msg) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`flex items-end gap-2 mb-4 ${msg.kullaniciAdi === kullaniciAdi ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.kullaniciAdi === kullaniciAdi ? 'bg-cyber-purple/80 text-white rounded-br-none' : 'bg-metallic-gray/20 text-light-gray rounded-bl-none'}`}>
                                    {msg.kullaniciAdi !== kullaniciAdi && (
                                        <p className="text-xs font-bold font-orbitron text-cyber-purple mb-1">{msg.kullaniciAdi}</p>
                                    )}
                                    <p className="break-words">{msg.metin}</p>
                                    {msg.tarih && <p className="text-xs opacity-60 text-right mt-1">{msg.tarih.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={endOfMessagesRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-metallic-gray/20 flex gap-4">
                    <input type="text" value={yeniMesaj} onChange={(e) => setYeniMesaj(e.target.value)} placeholder="Frekansa bir mesaj gönder..." className="flex-1 bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-2 px-3 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all"/>
                    <button type="submit" disabled={!yeniMesaj.trim()} className="px-6 py-2 font-orbitron text-sm text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)] disabled:opacity-50 disabled:cursor-not-allowed">
                        Gönder
                    </button>
                </form>
            </div>
        </AnimatedPage>
    );
};

export default ChatPage;