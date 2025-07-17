// App.tsx DOSYASININ DOĞRU HALİ

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import Loader from './components/Loader';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ChatPage from './pages/ChatPage';
import MiniGamesPage from './pages/MiniGamesPage';
import ContactPage from './pages/ContactPage';

// DOĞRU İSİM VE YOL İLE SAYFALARI IMPORT ETME
import EfsaneFotograflar from './pages/EfsaneFotograflar'; 
import FotografDetayPage from './pages/FotografDetayPage';

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
                
                {/* DOĞRU BİLEŞENLERLE ROTALAR */}
                <Route path="/efsane-fotograflar" element={<EfsaneFotograflar />} />
                <Route path="/fotograf/:id" element={<FotografDetayPage />} />
                
                <Route path="/iletisim" element={<ContactPage />} />
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

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