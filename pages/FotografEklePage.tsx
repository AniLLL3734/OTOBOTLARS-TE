import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db, collection, addDoc, serverTimestamp } from '../services/firebase';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../contexts/AuthContext';

// Resmi Base64 formatına çeviren yardımcı fonksiyon
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
    
    const { kullaniciAdi } = useAuth();

    const handleFotografChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFotografDosyasi(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fotografDosyasi) { setHata('Lütfen bir fotoğraf dosyası seç.'); return; }
        if (!baslik.trim() || !aciklama.trim()) { setHata('Lütfen başlık ve açıklama alanlarını doldur.'); return; }

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

            setMesaj('Fotoğraf başarıyla onaya gönderildi! Senin onayından sonra arşive eklenecek.');
            setBaslik(''); 
            setAciklama(''); 
            setFotografDosyasi(null);
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
                            {fotografDosyasi ? "Fotoğraf Seçildi!" : "Yüklemek için bir fotoğraf seç"}
                        </label>
                        <input id="fotografInput" type="file" onChange={handleFotografChange} accept="image/*" className="hidden" required/>
                        {fotografDosyasi && <p className="text-metallic-gray mt-2 text-sm">{fotografDosyasi.name}</p>}
                    </div>
                    <input type="text" placeholder="Fotoğrafın Başlığı" value={baslik} onChange={(e) => setBaslik(e.target.value)} className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all" required/>
                    <textarea placeholder="Bu fotoğrafın hikayesini, komik anısını anlat..." rows={5} value={aciklama} onChange={(e) => setAciklama(e.target.value)} className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all resize-none" required/>
                    <button type="submit" disabled={yukleniyor} className="w-full px-8 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-cyber-purple/80 border border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_15px_theme(colors.cyber-purple)] disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        {yukleniyor ? 'Yükleniyor...' : 'Fotoğrafı Onaya Gönder'}
                    </button>
                    {mesaj && <p className="text-green-400 text-center font-semibold mt-4">{mesaj}</p>}
                    {hata && <p className="text-red-400 text-center font-semibold mt-4">{hata}</p>}
                </form>
            </div>
        </AnimatedPage>
    );
};

export default FotografEklePage;