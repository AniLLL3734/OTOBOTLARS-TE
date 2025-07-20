import React, { useState } from 'react';
import { motion } from 'framer-motion';
// ARTIK GEREKLİ DEĞİL: Firebase Storage ile ilgili importlar kaldırıldı.
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, collection, addDoc, serverTimestamp } from '../services/firebase';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../contexts/AuthContext'; // Yeni Auth sistemini kullanıyoruz

const OlayEklePage: React.FC = () => {
    const [baslik, setBaslik] = useState('');
    const [aciklama, setAciklama] = useState('');
    // KALDIRILDI: Resimle ilgili tüm state'ler kaldırıldı.
    // const [resimDosyasi, setResimDosyasi] = useState<File | null>(null);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [mesaj, setMesaj] = useState('');
    const [hata, setHata] = useState('');
    
    // AuthContext'ten kullanıcı adını alıyoruz, bu daha sağlam bir yöntem.
    const { kullaniciAdi } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!kullaniciAdi) {
            setHata('Kullanıcı adı bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }
        if (!baslik.trim() || !aciklama.trim()) {
            setHata('Lütfen başlık ve açıklama alanlarını doldurun.');
            return;
        }

        setYukleniyor(true);
        setHata('');
        setMesaj('');

        try {
            // ARTIK SADECE METİN VERİSİ GÖNDERİYORUZ
            await addDoc(collection(db, "onayBekleyenOlaylar"), {
                baslik: baslik.trim(),
                aciklama: aciklama.trim(),
                gorsel: '', // Görsel alanını şimdilik boş gönderiyoruz.
                yazar: kullaniciAdi,
                tarih: serverTimestamp()
            });

            setMesaj('Anın başarıyla onaya gönderildi! Anıl kontrol ettikten sonra yayınlanacak:)');
            // Formu temizle
            setBaslik('');
            setAciklama('');
        } catch (error) {
            console.error("Anı gönderilirken hata oluştu:", error);
            setHata('Bir hata oluştu. Lütfen tekrar dene.');
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto py-12 px-4">
                <motion.h1
                    className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-4 text-light-gray"
                    initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
                >
                    Arşive Bir Anı Ekle
                </motion.h1>
                <p className="text-center text-metallic-gray mb-8">Gönderen: <span className="text-cyber-purple font-semibold">{kullaniciAdi || "Yükleniyor..."}</span></p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20">
                    <input
                        type="text"
                        placeholder="Olayın Başlığı"
                        value={baslik}
                        onChange={(e) => setBaslik(e.target.value)}
                        className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all"
                    />
                    <textarea
                        placeholder="Bu anıyı detaylarıyla anlat..."
                        rows={10}
                        value={aciklama}
                        onChange={(e) => setAciklama(e.target.value)}
                        className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all resize-none"
                    />
                    
                    {/* KALDIRILDI: Fotoğraf yükleme input'u ve ilgili bölüm kaldırıldı. */}

                    <button type="submit" disabled={yukleniyor} className="w-full px-8 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)] disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        {yukleniyor ? 'Gönderiliyor...' : 'Onaya Gönder'}
                    </button>

                    {mesaj && <p className="text-green-400 text-center font-semibold mt-4">{mesaj}</p>}
                    {hata && <p className="text-red-400 text-center font-semibold mt-4">{hata}</p>}
                </form>
            </div>
        </AnimatedPage>
    );
};

export default OlayEklePage;