import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timestamp, addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'; 
import { olaylar as statikOlaylar } from '../constants'; 
import { db } from '../services/firebase';
import AnimatedPage from '../components/AnimatedPage';
import EventCard from '../components/EventCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
    const [fetchError, setFetchError] = useState<string | null>(null);

    const isAdmin = kullaniciAdi.trim() === 'Anıl37';

    useEffect(() => {
        const qOnaylanmis = query(collection(db, "kullaniciOlaylari"), orderBy("tarih", "desc"));
        const unsubOnaylanmis = onSnapshot(qOnaylanmis, (snapshot) => {
            const olaylarList: KullaniciOlay[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Omit<KullaniciOlay, 'id'> }));
            setKullaniciOlaylari(olaylarList);
        });

        let unsubBekleyenler = () => {};
        if (isAdmin) {
            setFetchError(null);
            const qBekleyenler = query(collection(db, "onayBekleyenOlaylar"), orderBy("tarih", "desc"));
            unsubBekleyenler = onSnapshot(qBekleyenler, (snapshot) => {
                 const olaylarList: KullaniciOlay[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Omit<KullaniciOlay, 'id'> }));
                setOnayBekleyenler(olaylarList);
            }, (error) => {
                console.error("ONAY BEKLEYENLERİ ÇEKERKEN FIREBASE HATASI:", error);
                setFetchError(`Firebase Hatası: ${error.code} - Ayrıntılar için F12 > Console'a bakın.`);
            });
        }
        
        return () => {
            unsubOnaylanmis();
            unsubBekleyenler();
        };
    }, [isAdmin]);

    const handleOnayla = async (olay: KullaniciOlay) => {
        const { id, ...olayVerisi } = olay;
        try {
            await addDoc(collection(db, "kullaniciOlaylari"), olayVerisi);
            await deleteDoc(doc(db, "onayBekleyenOlaylar", id));
        } catch (error) {
            console.error("Onaylama hatası:", error);
        }
    };
    
    const handleReddet = async (olayId: string) => {
        try {
            await deleteDoc(doc(db, "onayBekleyenOlaylar", olayId));
        } catch (error) {
            console.error("Reddetme hatası:", error);
        }
    };

    return (
        <AnimatedPage>
            <div className="py-12 px-4 md:px-0">
                {isAdmin && (
                    <div className="max-w-4xl mx-auto mb-10 p-4 border-2 border-dashed border-red-500 bg-gray-900 rounded-lg">
                        <h4 className="text-lg font-orbitron text-red-400 text-center mb-2">ADMİN HATA AYIKLAMA PANELİ</h4>
                        <p className="text-white"><strong>Okunan Kullanıcı Adı:</strong> <span className="font-mono bg-black p-1 rounded">{kullaniciAdi || 'BOŞ'}</span></p>
                        <p className="text-white"><strong>Admin Olarak Tanındı mı?</strong> <span className="font-mono bg-black p-1 rounded">{isAdmin ? 'EVET' : 'HAYIR'}</span></p>
                        <p className="text-white"><strong>Bulunan Bekleyen Olay Sayısı:</strong> <span className="font-mono bg-black p-1 rounded">{onayBekleyenler.length}</span></p>
                        {fetchError && <p className="text-yellow-400 mt-2"><strong>VERİTABANI HATASI:</strong> {fetchError}</p>}
                    </div>
                )}

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
                
                {kullaniciOlaylari.length > 0 && (
                    <div className="max-w-5xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 text-light-gray">Sizden Gelenler</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {kullaniciOlaylari.map((olay) => (
                                <EventCard key={olay.id} olay={{
                                    id: olay.id,
                                    baslik: olay.baslik || 'Başlık Yok',
                                    ozet: olay.aciklama || 'Açıklama yok.',
                                    gorsel: olay.gorsel || '',
                                    tarih: olay.yazar || 'Bilinmeyen Yazar'
                               }} />
                            ))}
                        </div>
                    </div>
                )}
                
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