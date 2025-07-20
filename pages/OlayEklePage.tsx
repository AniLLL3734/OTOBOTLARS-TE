import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Firestore'dan Timestamp tipini import etmeyi unutmayalım.
import { Timestamp } from 'firebase/firestore'; 
import { olaylar as statikOlaylar } from '../constants'; 
import { db, collection, onSnapshot, query, orderBy, addDoc, doc, deleteDoc } from '../services/firebase';
import AnimatedPage from '../components/AnimatedPage';
import EventCard from '../components/EventCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Arayüzü daha esnek hale getirelim. Alanlar isteğe bağlı olabilir.
interface KullaniciOlay {
    id: string;
    baslik?: string;
    aciklama?: string;
    gorsel?: string;
    yazar?: string;
    tarih?: Timestamp;
}

const EventsPage: React.FC = () => {
    const [kullaniciOlaylari, setKullaniciOlaylari] = useState<KullaniciOlay[]>([]);
    const [onayBekleyenler, setOnayBekleyenler] = useState<KullaniciOlay[]>([]);
    const [kullaniciAdi] = useLocalStorage<string>('otobotlar-kullaniciAdi', '');
    
    const isAdmin = kullaniciAdi.trim() === 'Anıl37';

    useEffect(() => {
        // Onaylanmış kullanıcı olaylarını dinle
        const qOnaylanmis = query(collection(db, "kullaniciOlaylari"), orderBy("tarih", "desc"));
        const unsubOnaylanmis = onSnapshot(qOnaylanmis, (snapshot) => {
            const olaylarList: KullaniciOlay[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setKullaniciOlaylari(olaylarList);
        });

        // Admin ise, onay bekleyenleri de dinle
        let unsubBekleyenler = () => {};
        if (isAdmin) {
            const qBekleyenler = query(collection(db, "onayBekleyenOlaylar"), orderBy("tarih", "desc"));
            unsubBekleyenler = onSnapshot(qBekleyenler, (snapshot) => {
                 const olaylarList: KullaniciOlay[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOnayBekleyenler(olaylarList);
            }, (error) => {
                // Hata durumunu konsolda gösterelim.
                console.error("Onay bekleyenleri çekerken Firebase hatası:", error);
            });
        }
        
        return () => {
            unsubOnaylanmis();
            unsubBekleyenler();
        };
    }, [isAdmin]); // Bağımlılık doğru

    const handleOnayla = async (olay: KullaniciOlay) => {
        // Firestore'a gönderirken `id`'yi ayıklayalım.
        const { id, ...olayVerisi } = olay;
        try {
            await addDoc(collection(db, "kullaniciOlaylari"), olayVerisi);
            await deleteDoc(doc(db, "onayBekleyenOlaylar", id));
        } catch (error) {
            console.error("Onaylama sırasında hata:", error);
        }
    };
    
    const handleReddet = async (olayId: string) => {
        try {
            await deleteDoc(doc(db, "onayBekleyenOlaylar", olayId));
        } catch (error) {
            console.error("Reddetme sırasında hata:", error);
        }
    };

    return (
        <AnimatedPage>
            <div className="py-12 px-4 md:px-0"> {/* Sağdan soldan biraz boşluk ekledik */}
                {/* ONAY BEKLEYENLER BÖLÜMÜ (SADECE ADMİN) */}
                {isAdmin && onayBekleyenler.length > 0 && (
                     <div className="max-w-4xl mx-auto mb-20">
                        <h2 className="text-3xl font-orbitron font-bold text-center mb-8 text-yellow-400">Onay Bekleyen Olaylar</h2>
                        <div className="flex flex-col gap-6">
                            {onayBekleyenler.map((olay) => (
                                <div key={olay.id} className="p-6 bg-gray-800 rounded-lg border border-yellow-500/50 shadow-lg">
                                    <h3 className="text-xl font-bold">{olay.baslik || 'Başlık Belirtilmemiş'}</h3>
                                    <p className="text-sm text-gray-400 mb-2">Yazan: {olay.yazar || 'Bilinmiyor'}</p>
                                    <p className="text-gray-300 whitespace-pre-wrap">{olay.aciklama || 'Açıklama yok.'}</p>
                                    {olay.gorsel && (
                                        <a href={olay.gorsel} target="_blank" rel="noopener noreferrer">
                                            <img src={olay.gorsel} alt={olay.baslik} className="mt-4 rounded-md max-h-48 cursor-pointer"/>
                                        </a>
                                    )}
                                    <div className="flex gap-4 mt-4">
                                        <button onClick={() => handleOnayla(olay)} className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors">Onayla</button>
                                        <button onClick={() => handleReddet(olay.id)} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition-colors">Reddet</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* KULLANICIDAN GELENLER BÖLÜMÜ */}
                {kullaniciOlaylari.length > 0 && (
                    <div className="max-w-5xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 text-light-gray">Sizden Gelenler</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {kullaniciOlaylari.map((olay) => (
                                // BURASI DÜZELTİLDİ: Eksik verilere karşı siteyi korunaklı hale getirdik.
                                <EventCard key={olay.id} olay={{
                                    id: olay.id,
                                    baslik: olay.baslik || 'Başlık Yok',
                                    ozet: olay.aciklama || 'Açıklama yok.',
                                    gorsel: olay.gorsel || '', // EventCard resim yoksa boş string ile başa çıkabilmeli
                                    tarih: olay.yazar || 'Bilinmeyen Yazar' // 'tarih' alanına yazar bilgisini koyuyoruz
                               }} />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* ORİJİNAL OLAYLAR BÖLÜMÜ */}
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 text-light-gray">Kurucu Arşivi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {statikOlaylar.map((olay) => (
                            <EventCard key={olay.id} olay={olay} />
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default EventsPage;