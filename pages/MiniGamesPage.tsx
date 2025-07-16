
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { OYUN_SEMBOLERI } from '../constants';
import type { OyunKarti } from '../types';

const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
}

const generateCards = (): OyunKarti[] => {
    const cards = OYUN_SEMBOLERI.concat(OYUN_SEMBOLERI)
        .map((sembol, index) => ({ id: index, sembol, eslesti: false }));
    return shuffleArray(cards);
};

interface CardProps {
    card: OyunKarti;
    isFlipped: boolean;
    onClick: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ card, isFlipped, onClick }) => {
    return (
        <div className="w-full h-full aspect-square perspective-1000 cursor-pointer" onClick={() => onClick(card.id)}>
            <motion.div
                className="relative w-full h-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-metallic-gray/10 border-2 border-metallic-gray/30 rounded-lg">
                     <span className="text-4xl font-orbitron text-cyber-purple animate-glimmer">?</span>
                </div>
                <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-cyber-purple/20 border-2 border-cyber-purple rounded-lg">
                    <span className="text-4xl md:text-5xl">{card.sembol}</span>
                </div>
            </motion.div>
        </div>
    );
};

const MiniGamesPage: React.FC = () => {
    const [kartlar, setKartlar] = useState<OyunKarti[]>(generateCards());
    const [acikKartlar, setAcikKartlar] = useState<number[]>([]);
    const [hamle, setHamle] = useState(0);
    const [oyunBitti, setOyunBitti] = useState(false);

    useEffect(() => {
        if (acikKartlar.length === 2) {
            const [firstId, secondId] = acikKartlar;
            const firstCard = kartlar.find(k => k.id === firstId);
            const secondCard = kartlar.find(k => k.id === secondId);

            if (firstCard && secondCard && firstCard.sembol === secondCard.sembol) {
                setKartlar(prev => prev.map(k => (k.sembol === firstCard.sembol ? { ...k, eslesti: true } : k)));
                setAcikKartlar([]);
            } else {
                setTimeout(() => setAcikKartlar([]), 1000);
            }
            setHamle(prev => prev + 1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acikKartlar]);
    
    useEffect(() => {
        if (kartlar.length > 0 && kartlar.every(k => k.eslesti)) {
            setOyunBitti(true);
        }
    }, [kartlar]);

    const handleCardClick = (id: number) => {
        const clickedCard = kartlar.find(k => k.id === id);
        if (!clickedCard || clickedCard.eslesti || acikKartlar.length >= 2 || acikKartlar.includes(id)) {
            return;
        }
        setAcikKartlar(prev => [...prev, id]);
    };

    const resetGame = () => {
        setKartlar(generateCards());
        setAcikKartlar([]);
        setHamle(0);
        setOyunBitti(false);
    };

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Mistik Hafıza</h1>
                <p className="text-metallic-gray mb-8">Sembollerin ardındaki sırrı çöz. Eşlerini bul ve zihnini test et.</p>
                <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-lg">
                    <p className="font-orbitron">Hamle: <span className="text-cyber-purple">{hamle}</span></p>
                    <button onClick={resetGame} className="px-4 py-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple rounded-md transition-colors">
                        Yeniden Başlat
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {kartlar.map(card => (
                        <Card 
                            key={card.id} 
                            card={card}
                            isFlipped={acikKartlar.includes(card.id) || card.eslesti}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
                 <AnimatePresence>
                    {oyunBitti && (
                        <motion.div 
                            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div 
                                className="p-8 bg-dark-anthracite rounded-lg border-2 border-cyber-purple text-center shadow-2xl shadow-cyber-purple/20"
                                initial={{ scale: 0.5, y: -100 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ type: 'spring' }}
                            >
                                <h2 className="text-3xl font-orbitron text-cyber-purple mb-2">Tebrikler!</h2>
                                <p className="text-light-gray mb-4">Hafıza matrisini {hamle} hamlede çözdün.</p>
                                <button onClick={resetGame} className="px-6 py-2 font-orbitron bg-cyber-purple hover:bg-cyber-purple/80 rounded-md transition-colors">
                                    Tekrar Oyna
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default MiniGamesPage;
