import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import { useAuth } from '../contexts/AuthContext'; // Auth hook'unu import et

// Bu bileşen artık dışarıdan prop almıyor.
const GirisEkrani: React.FC = () => {
  const { login } = useAuth(); // login fonksiyonunu doğrudan context'ten al
  
  const [cevap, setCevap] = useState('');
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  
  const dogruCevap = "ayşe karakoyun";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKullaniciAdi = kullaniciAdi.trim();
    
    if (!trimmedKullaniciAdi) {
        setHata("Lütfen bir çağrı işareti (adın) gir.");
        return;
    }

    if (cevap.trim().toLowerCase() === dogruCevap) {
      // Doğrudan merkezi 'login' fonksiyonunu çağırıyoruz.
      login(trimmedKullaniciAdi);
    } else {
      setHata("Güvenlik anahtarı yanlış.");
      setCevap('');
    }
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        
        <motion.h1
          className="text-4xl md:text-6xl font-orbitron font-black uppercase tracking-wider text-light-gray"
          initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        >
          <span className="text-cyber-purple">Kimlik</span> Doğrulama
        </motion.h1>

        <motion.p
          className="mt-4 max-w-lg text-lg text-metallic-gray font-inter"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
        >
          Arşive erişmek için çağrı işaretini ve güvenlik anahtarını gir.
        </motion.p>
        
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-sm mt-10 flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* KULLANICI ADI GİRİŞİ */}
          <div>
            <label htmlFor="kullaniciAdi" className="font-orbitron text-xl text-light-gray mb-3 block">
              Çağrı İşareti (Adın)
            </label>
            <input
              id="kullaniciAdi"
              type="text"
              value={kullaniciAdi}
              onChange={(e) => setKullaniciAdi(e.target.value)}
              autoFocus
              placeholder="Adını ve Soyadını yazabilirsin..."
              className="w-full px-4 py-3 bg-dark-anthracite/30 border-2 border-metallic-gray/50 rounded-md text-light-gray font-inter text-center
                         focus:outline-none focus:border-cyber-purple focus:ring-2 focus:ring-cyber-purple/50 transition-all duration-300"
            />
          </div>

          {/* ŞİFRE GİRİŞİ */}
          <div>
            <label htmlFor="soru" className="font-orbitron text-xl text-light-gray mb-3 block">
              Güvenlik Anahtarı
            </label>
            <input
              id="soru"
              type="password"
              value={cevap}
              onChange={(e) => setCevap(e.target.value)}
              placeholder="8/E Sınıfının son sınıf öğretmeni?"
              className="w-full px-4 py-3 bg-dark-anthracite/30 border-2 border-metallic-gray/50 rounded-md text-light-gray font-inter text-center
                         focus:outline-none focus:border-cyber-purple focus:ring-2 focus:ring-cyber-purple/50 transition-all duration-300"
            />
          </div>
          
          <button
            type="submit"
            className="mt-4 w-full px-10 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-cyber-purple/20 border-2 border-cyber-purple rounded-md transition-all duration-300
                       hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_20px_theme(colors.cyber-purple)]"
          >
            Erişim İste
          </button>
          
          {hata && (
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-red-400 font-inter"
            >
              {hata}
            </motion.p>
          )}
        </motion.form>
      </div>
    </AnimatedPage>
  );
};

export default GirisEkrani;