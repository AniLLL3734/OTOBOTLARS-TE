import React from 'react';
import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './contexts/AuthContext'; 

import Layout from './components/Layout';
import GirisEkrani from './components/GirisEkrani';
import Loader from './components/Loader';

import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ChatPage from './pages/ChatPage';
import MiniGamesPage from './pages/MiniGamesPage';
import ContactPage from './pages/ContactPage';
import EfsaneFotograflar from './pages/EfsaneFotograflar';
import FotografDetayPage from './pages/FotografDetayPage';
import OlayEklePage from './pages/OlayEklePage';
import FotografEklePage from './pages/FotografEklePage';
import EfsaneSarkilarPage from './pages/EfsaneSarkilarPage'; // YENİ SAYFAYI İMPORT ET

const AppContent: React.FC = () => {
    const { girisYapildi } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (girisYapildi) {
            const timer = setTimeout(() => setLoading(false), 1500);
            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, [girisYapildi]);

    if (!girisYapildi) {
        return <GirisEkrani />;
    }

    if (loading) {
        return <Loader />;
    }
    
    return (
        <Layout>
            <AppRoutes />
        </Layout>
    );
};

const AppRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/olay-ekle" element={<OlayEklePage />} />
                <Route path="/olay/:id" element={<EventDetailPage />} />
                <Route path="/olaylar" element={<EventsPage />} />
                <Route path="/sohbet" element={<ChatPage />} />
                <Route path="/mini-oyunlar" element={<MiniGamesPage />} />
                <Route path="/efsane-fotograflar" element={<EfsaneFotograflar />} />
                <Route path="/fotograf/:id" element={<FotografDetayPage />} />
                <Route path="/iletisim" element={<ContactPage />} />
                <Route path="/fotograf-ekle" element={<FotografEklePage />} />
                <Route path="/efsane-sarkilar" element={<EfsaneSarkilarPage />} /> {/* YENİ ROTA */}
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <AppContent />
        </HashRouter>
    </AuthProvider>
  );
};

export default App;