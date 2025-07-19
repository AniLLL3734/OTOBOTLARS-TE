import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { OYUN_SEMBOLERI } from '../constants';
import type { OyunKarti } from '../types';

// ============================================================================
// OYUN 1: Mistik Hafıza (Mevcut Oyununuz)
// ============================================================================

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

const MemoryCard: React.FC<CardProps> = ({ card, isFlipped, onClick }) => {
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

interface GameProps {
    onBack: () => void;
}

const MemoryGame: React.FC<GameProps> = ({ onBack }) => {
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
         <div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Mistik Hafıza</h1>
            <p className="text-metallic-gray mb-8">Sembollerin ardındaki sırrı çöz. Eşlerini bul ve zihnini test et.</p>
            <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-lg">
                <p className="font-orbitron">Hamle: <span className="text-cyber-purple">{hamle}</span></p>
                <div>
                     <button onClick={resetGame} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple rounded-md transition-colors">
                        Yeniden Başlat
                    </button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">
                        Geri
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {kartlar.map(card => (
                    <MemoryCard 
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
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="p-8 bg-dark-anthracite rounded-lg border-2 border-cyber-purple text-center shadow-2xl shadow-cyber-purple/20"
                            initial={{ scale: 0.5, y: -100 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring' }}
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
    );
};


// ============================================================================
// OYUN 2: X-O Savaşı (Tic-Tac-Toe)
// ============================================================================

const calculateWinner = (squares: (string | null)[]): string | null => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    if (squares.every(square => square !== null)) {
        return 'Berabere';
    }
    return null;
};

const TicTacToe: React.FC<GameProps> = ({ onBack }) => {
    const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const winner = calculateWinner(squares);

    const handleClick = (i: number) => {
        if (winner || squares[i]) return;
        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(newSquares);
        setXIsNext(!xIsNext);
    };
    
    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
    }
    
    const status = winner
        ? winner === 'Berabere' ? 'Oyun Berabere!' : `Kazanan: ${winner}`
        : `Sıradaki: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">X-O Savaşı</h1>
            <p className="text-metallic-gray mb-8">Kadim strateji oyunu. Üç sembolü yan yana getir, kazan!</p>
             <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-lg">
                <p className="font-orbitron text-lg">{status}</p>
                <div>
                     <button onClick={resetGame} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple rounded-md transition-colors">
                        Yeniden Başlat
                    </button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">
                        Geri
                    </button>
                </div>
            </div>
             <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto">
                {squares.map((value, i) => (
                    <button
                        key={i}
                        className={`w-full aspect-square text-6xl font-bold flex items-center justify-center rounded-lg transition-colors 
                        ${value ? (value === 'X' ? 'bg-cyber-purple/30 text-white' : 'bg-metallic-gray/30 text-white') : 'bg-white/5 hover:bg-white/10'}`}
                        onClick={() => handleClick(i)}
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// OYUN 3: Taş-Kağıt-Makas
// ============================================================================

const CHOICES = [
    { name: 'Taş', emoji: '✊', beats: 'Makas' },
    { name: 'Kağıt', emoji: '✋', beats: 'Taş' },
    { name: 'Makas', emoji: '✌️', beats: 'Kağıt' },
];

const RockPaperScissors: React.FC<GameProps> = ({ onBack }) => {
    const [playerChoice, setPlayerChoice] = useState<{name: string, emoji: string} | null>(null);
    const [computerChoice, setComputerChoice] = useState<{name: string, emoji: string} | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handlePlayerChoice = (choiceName: string) => {
        const pChoice = CHOICES.find(c => c.name === choiceName)!;
        const cChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        
        setPlayerChoice(pChoice);
        setComputerChoice(cChoice);
        
        if (pChoice.name === cChoice.name) {
            setResult('Berabere!');
        } else if (pChoice.beats === cChoice.name) {
            setResult('Kazandın!');
        } else {
            setResult('Kaybettin!');
        }
    };
    
    const resetGame = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
    }
    
    return (
        <div>
             <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Taş-Kağıt-Makas</h1>
             <p className="text-metallic-gray mb-8">Kadim düelloda şansını ve stratejini sına.</p>

             <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-lg">
                 <div className="font-orbitron text-lg h-8 flex items-center">
                    <AnimatePresence mode="wait">
                       <motion.div key={result} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          {result}
                       </motion.div>
                    </AnimatePresence>
                 </div>
                 <div>
                      <button onClick={resetGame} disabled={!result} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors">
                        Tekrar Oyna
                     </button>
                     <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">
                         Geri
                     </button>
                 </div>
             </div>

            <div className="flex justify-around items-center my-8">
                 <div className="text-center">
                     <p className="font-orbitron text-2xl mb-2">SEN</p>
                     <div className="w-32 h-32 text-6xl bg-white/5 rounded-lg flex items-center justify-center">
                        {playerChoice?.emoji}
                     </div>
                 </div>
                 <p className="text-4xl font-bold">VS</p>
                 <div className="text-center">
                     <p className="font-orbitron text-2xl mb-2">RAKİP</p>
                     <div className="w-32 h-32 text-6xl bg-white/5 rounded-lg flex items-center justify-center">
                        {computerChoice?.emoji}
                     </div>
                 </div>
            </div>

             <div className="flex justify-center gap-4 mt-8">
                {CHOICES.map(choice => (
                    <button key={choice.name} onClick={() => handlePlayerChoice(choice.name)} disabled={!!result} className="px-6 py-4 font-orbitron text-lg bg-white/10 hover:bg-cyber-purple/40 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all transform hover:scale-105">
                         {choice.emoji} {choice.name}
                     </button>
                ))}
            </div>
        </div>
    );
};


// ============================================================================
// ANA SAYFA BİLEŞENİ (OYUN MENÜSÜ)
// ============================================================================

const MiniGamesPage: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const games = [
        { id: 'memory', name: 'Mistik Hafıza', description: 'Sembollerin ardındaki sırrı çöz.', component: <MemoryGame onBack={() => setSelectedGame(null)} /> },
        { id: 'tictactoe', name: 'X-O Savaşı', description: 'Klasik Tic-Tac-Toe mücadelesi.', component: <TicTacToe onBack={() => setSelectedGame(null)} /> },
        { id: 'rockpaperscissors', name: 'Taş-Kağıt-Makas', description: 'Kadim düelloda şansını sına.', component: <RockPaperScissors onBack={() => setSelectedGame(null)} /> },
    ];
    
    const currentGame = games.find(g => g.id === selectedGame);
    
    return (
        <AnimatedPage>
             <div className="max-w-2xl mx-auto text-center">
                <AnimatePresence mode="wait">
                     {currentGame ? (
                         <motion.div 
                             key={selectedGame}
                             initial={{ opacity: 0, x: 300 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: -300 }}
                             transition={{ duration: 0.5 }}
                         >
                            {currentGame.component}
                         </motion.div>
                     ) : (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Oyun Merkezi</h1>
                             <p className="text-metallic-gray mb-8">Yeteneklerini test etmek için bir oyun seç.</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {games.map(game => (
                                    <motion.div
                                        key={game.id}
                                        onClick={() => setSelectedGame(game.id)}
                                        className="p-6 bg-white/5 border border-metallic-gray/20 rounded-lg cursor-pointer transition-all hover:border-cyber-purple hover:shadow-lg hover:shadow-cyber-purple/20"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <h2 className="text-2xl font-orbitron text-cyber-purple mb-2">{game.name}</h2>
                                        <p className="text-metallic-gray">{game.description}</p>
                                    </motion.div>
                                 ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default MiniGamesPage;