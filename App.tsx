import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Giriş ve Layout bileşenleri
import GirisEkrani from './components/GirisEkrani';
import Layout from './components/Layout';
import Loader from './components/Loader';

// Tüm Sayfa bileşenlerini import et
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ChatPage from './pages/ChatPage';
import MiniGamesPage from './pages/MiniGamesPage';
import ContactPage from './pages/ContactPage';
import EfsaneFotograflar from './pages/EfsaneFotograflar';
import FotografDetayPage from './pages/FotografDetayPage';
import OlayEklePage from './pages/OlayEklePage';

const AppRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/olaylar" element={<EventsPage />} />
                <Route path="/olay/:id" element={<EventDetailPage />} />
                <Route path="/sohbet" element={<ChatPage />} />
                <Route path="/mini-oyunlar" element={<MiniGamesPage />} />
                <Route path="/efsane-fotograflar" element={<EfsaneFotograflar />} />
                <Route path="/fotograf/:id" element={<FotografDetayPage />} />
                <Route path="/iletisim" element={<ContactPage />} />
                
                {/* ROTA KONTROLÜ: /olay-ekle yolu doğru şekilde OlayEklePage'e yönlendiriliyor. */}
                <Route path="/olay-ekle" element={<OlayEklePage />} />
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [girisYapildi, setGirisYapildi] = useState(false);

    // Geliştirme için giriş ekranını her seferinde gösterme modu (aktif)
    /*
    useEffect(() => {
        const kayitliGiris = localStorage.getItem('girisYapildi_8E_Anilari');
        const kayitliKullanici = localStorage.getItem('otobotlar-kullaniciAdi');
        
        if (kayitliGiris === 'true' && kayitliKullanici) {
            setGirisYapildi(true);
        }
    }, []);
    */

    useEffect(() => {
        if (girisYapildi) {
            const timer = setTimeout(() => setLoading(false), 2500);
            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, [girisYapildi]);
    
    const handleGirisBasarili = (kullaniciAdi: string) => {
        localStorage.setItem('girisYapildi_8E_Anilari', 'true');
        localStorage.setItem('otobotlar-kullaniciAdi', kullaniciAdi);
        setGirisYapildi(true);
    };

    if (!girisYapildi) {
        return <GirisEkrani onGirisBasarili={handleGirisBasarili} />;
    }
    
    if (loading) {
        return <Loader />;
    }

    return (
        <HashRouter>
            <Layout>
                <AppRoutes />
            </Layout>
        </HashRouter>
    );
};

export default App;