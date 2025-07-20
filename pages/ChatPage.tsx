import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from '../services/firebase';
import type { SohbetMesaji } from '../types';
import AnimatedPage from '../components/AnimatedPage';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ChatPage: React.FC = () => {
    const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([]);
    const [yeniMesaj, setYeniMesaj] = useState('');
    
    // Artık kullanıcı adını sadece localStorage'dan okuyoruz. Giriş ekranında set edilmişti.
    // 'otobotlar-kullaniciAdi' anahtarı ve 'kullaniciAdi' değişken adı aynı kalmalı ki sistem çalışsın.
    const [kullaniciAdi] = useLocalStorage<string>('otobotlar-kullaniciAdi', 'Bilinmeyen'); // 'Bilinmeyen' bir fallback değeridir.
    
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    
    // Firestore'dan mesajları dinleyen useEffect hook'u
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

        // Component kaldırıldığında (başka sayfaya geçildiğinde) listener'ı temizle
        return () => unsubscribe();
    }, []);

    // Yeni mesaj geldiğinde sayfanın en altına scroll yap
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mesajlar]);
    
    // Mesaj gönderme fonksiyonu
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (yeniMesaj.trim() === '' || !kullaniciAdi) return;
        
        try {
            await addDoc(collection(db, "chat"), {
                metin: yeniMesaj,
                kullaniciAdi: kullaniciAdi, // Giriş ekranında set edilen kullanıcı adını kullan
                tarih: serverTimestamp()
            });
            
            setYeniMesaj('');
        } catch (error) {
            console.error("Mesaj gönderilirken hata oluştu: ", error);
        }
    };

    // Kullanıcı adı sorma bölümü kaldırıldı, sayfa direkt sohbet arayüzünü render ediyor.
    return (
        <AnimatedPage>
            <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20 overflow-hidden">
                <header className="p-4 border-b border-metallic-gray/20">
                    <h1 className="text-2xl font-orbitron font-bold text-center">Genel Frekans</h1>
                    <p className="text-center text-metallic-gray text-sm">Çağrı İşareti: <span className="text-cyber-purple font-semibold">{kullaniciAdi}</span></p>
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
                                    <p className="text-xs opacity-60 text-right mt-1">{new Date(msg.tarih).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
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
                    <button type="submit" disabled={!yeniMesaj.trim()} className="px-6 py-2 font-orbitron text-sm text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)] disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:border-gray-500">
                        Gönder
                    </button>
                </form>
            </div>
        </AnimatedPage>
    );
};

export default ChatPage;