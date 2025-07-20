import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { efsaneFotograflar as statikFotograflar } from '../constants';
import { db, collection, onSnapshot, query, orderBy, deleteDoc, doc } from '../services/firebase';
import AnimatedPage from '../components/AnimatedPage';
import PhotoCard from '../components/PhotoCard';
import { useAuth } from '../contexts/AuthContext';

interface Fotograf { id: string; baslik: string; gorsel: string; tarih: string; }
interface OnayBekleyenFotograf { id: string; baslik?: string; aciklama?: string; base64Gorsel?: string; yazar?: string; }

const EfsaneFotograflar: React.FC = () => {
    const [onayBekleyenler, setOnayBekleyenler] = useState<OnayBekleyenFotograf[]>([]);
    const { kullaniciAdi } = useAuth();
    const isAdmin = kullaniciAdi === 'Anıl37';

    useEffect(() => {
        let unsubBekleyenler = () => {};
        if (isAdmin) {
            const qBekleyenler = query(collection(db, "onayBekleyenFotograflar"), orderBy("tarih", "desc"));
            unsubBekleyenler = onSnapshot(qBekleyenler, (snapshot) => {
                const bekleyenlerList: OnayBekleyenFotograf[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOnayBekleyenler(bekleyenlerList);
            });
        }
        return () => { unsubBekleyenler(); };
    }, [isAdmin]);

    const handleReddet = async (id: string) => { await deleteDoc(doc(db, "onayBekleyenFotograflar", id)); };

    return (
        <AnimatedPage>
             {isAdmin && onayBekleyenler.length > 0 && (
                 <div className="max-w-4xl mx-auto mb-16 p-4 border-2 border-dashed border-yellow-400 rounded-lg">
                    <h2 className="text-2xl font-orbitron text-center text-yellow-400 mb-4">Onay Bekleyen Fotoğraflar</h2>
                    <p className="text-center text-gray-400 mb-4 text-sm">Not: Fotoğrafı indir, `public/images/galeri` klasörüne ekle, sonra `constants.tsx` dosyasına yazıp bu isteği 'Reddet/İşle' butonu ile sil.</p>
                    {onayBekleyenler.map(foto => (
                         <div key={foto.id} className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 bg-gray-800 rounded">
                             <img src={foto.base64Gorsel} className="w-32 h-32 object-cover rounded"/>
                             <div className="flex-1 text-center md:text-left">
                                 <h3 className="font-bold">{foto.baslik}</h3>
                                 <p className="text-sm text-gray-400">{foto.aciklama}</p>
                                 <p className="text-xs text-gray-500 mt-1">Yazan: {foto.yazar}</p>
                             </div>
                             <div className="flex flex-col gap-2 mt-4 md:mt-0">
                                <a href={foto.base64Gorsel} download={`${foto.baslik?.replace(/\s+/g, '-') || 'indir'}.jpg`} className="bg-blue-600 px-4 py-2 rounded text-center text-white hover:bg-blue-500">İndir</a>
                                <button onClick={() => handleReddet(foto.id)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-500">Reddet/İşle</button>
                             </div>
                         </div>
                    ))}
                 </div>
             )}
            <motion.h1 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 text-light-gray" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                Efsane Fotoğraflar Arşivi
            </motion.h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {statikFotograflar.map((fotograf) => ( <PhotoCard key={fotograf.id} fotograf={fotograf} /> ))}
            </div>
        </AnimatedPage>
    );
};

export default EfsaneFotograflar;