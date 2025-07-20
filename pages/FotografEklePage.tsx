import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db, collection, addDoc, serverTimestamp } from '../services/firebase';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../contexts/AuthContext';

// Yeni: Fotoğraf küçültme/sıkıştırma kütüphanesi
import imageCompression from 'browser-image-compression';

// Base64'e çeviren yardımcı fonksiyon (değişiklik yok)
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const FotografEklePage: React.FC = () => {
    const [baslik, setBaslik] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [fotografDosyasi, setFotografDosyasi] = useState<File | null>(null);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [mesaj, setMesaj] = useState('');
    const [hata, setHata] = useState('');
    
    // Yükleme durumu hakkında kullanıcıya daha fazla bilgi vermek için yeni bir state
    const [durumMesaji, setDurumMesaji] = useState('Yüklemek için bir fotoğraf seç');

    const { kullaniciAdi } = useAuth();

    const handleFotografChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const orjinalDosya = e.target.files[0];
            
            // Kullanıcıya dosyanın işlendiğini söyleyelim
            setDurumMesaji('Fotoğraf işleniyor, lütfen bekleyin...');
            setFotografDosyasi(null); // Önceki seçimi temizle

            // Fotoğrafı sıkıştırmak için ayarlar
            const options = {
              maxSizeMB: 1,           // Maksimum 1MB olacak
              maxWidthOrHeight: 1024,   // Maksimum genişlik veya yükseklik 1024px olacak
              useWebWorker: true,     // Performans için
              fileType: 'image/jpeg'  // Tüm resimleri JPEG'e çevirerek boyutu küçült
            }

            try {
              console.log(`Orijinal boyut: ${(orjinalDosya.size / 1024 / 1024).toFixed(2)} MB`);
              const sikistirilmisDosya = await imageCompression(orjinalDosya, options);
              console.log(`Yeni sıkıştırılmış boyut: ${(sikistirilmisDosya.size / 1024 / 1024).toFixed(2)} MB`);
              
              setFotografDosyasi(sikistirilmisDosya);
              setDurumMesaji('Fotoğraf seçildi ve gönderime hazır!');
            } catch (error) {
              console.error('Fotoğraf sıkıştırılırken hata oluştu:', error);
              setHata("Bu fotoğraf işlenemedi. Lütfen farklı bir fotoğraf deneyin.");
              setFotografDosyasi(null);
              setDurumMesaji('Yüklemek için bir fotoğraf seç');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fotografDosyasi) { setHata('Lütfen işlenmesi tamamlanmış bir fotoğraf dosyası seçin.'); return; }
        if (!baslik.trim() || !aciklama.trim()) { setHata('Lütfen başlık ve açıklama alanlarını doldurun.'); return; }

        setYukleniyor(true);
        setHata('');
        setMesaj('');

        try {
            const base64Image = await toBase64(fotografDosyasi);
            
            await addDoc(collection(db, "onayBekleyenFotograflar"), {
                baslik: baslik.trim(),
                aciklama: aciklama.trim(),
                base64Gorsel: base64Image,
                yazar: kullaniciAdi,
                tarih: serverTimestamp()
            });

            setMesaj('Fotoğraf başarıyla onaya gönderildi!');
            setBaslik(''); 
            setAciklama(''); 
            setFotografDosyasi(null);
            setDurumMesaji('Yüklemek için bir fotoğraf seç');
            (document.getElementById('fotografInput') as HTMLInputElement).value = "";
        } catch (error) {
            console.error("Fotoğraf gönderilirken hata oluştu:", error);
            setHata('Bir hata oluştu. Lütfen tekrar dene.');
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <AnimatedPage>
             <div className="max-w-2xl mx-auto py-12 px-4">
                <motion.h1 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-4 text-light-gray" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                    Efsane Bir Fotoğraf Ekle
                </motion.h1>
                <p className="text-center text-metallic-gray mb-8">Gönderen: <span className="text-cyber-purple font-semibold">{kullaniciAdi || "..."}</span></p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20">
                    <div className="text-center p-6 border-2 border-dashed border-metallic-gray/50 rounded-lg">
                        <label htmlFor="fotografInput" className="cursor-pointer text-cyber-purple hover:underline">
                           {durumMesaji}
                        </label>
                        <input id="fotografInput" type="file" onChange={handleFotografChange} accept="image/*" className="hidden" />
                    </div>
                    <input type="text" placeholder="Fotoğrafın Başlığı" value={baslik} onChange={(e) => setBaslik(e.target.value)} className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all" required/>
                    <textarea placeholder="Bu fotoğrafın hikayesini, komik anısını anlat..." rows={5} value={aciklama} onChange={(e) => setAciklama(e.target.value)} className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all resize-none" required/>
                    <button type="submit" disabled={yukleniyor || !fotografDosyasi} className="w-full px-8 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)] disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        {yukleniyor ? 'Gönderiliyor...' : 'Fotoğrafı Onaya Gönder'}
                    </button>
                    {mesaj && <p className="text-green-400 text-center font-semibold mt-4">{mesaj}</p>}
                    {hata && <p className="text-red-400 text-center font-semibold mt-4">{hata}</p>}
                </form>
            </div>
        </AnimatedPage>
    );
};

export default FotografEklePage;