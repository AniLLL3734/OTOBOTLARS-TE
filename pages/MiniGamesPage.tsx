import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { OYUN_SEMBOLERI } from '../constants';
import type { OyunKarti } from '../types';
import HtmlGamePlayer from '../components/HtmlGamePlayer';

// ============================================================================
// OYUN 1: Mistik Hafıza
// ============================================================================
const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
}

const generateCards = (): OyunKarti[] => {
    const cards = OYUN_SEMBOLERI.concat(OYUN_SEMBOLERI).map((sembol, index) => ({ id: index, sembol, eslesti: false }));
    return shuffleArray(cards);
};

const MemoryCard: React.FC<{ card: OyunKarti; isFlipped: boolean; onClick: (id: number) => void; }> = ({ card, isFlipped, onClick }) => (
    <div className="w-full h-full aspect-square perspective-1000 cursor-pointer" onClick={() => onClick(card.id)}>
        <motion.div className="relative w-full h-full preserve-3d" animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.5 }}>
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-metallic-gray/10 border-2 border-metallic-gray/30 rounded-lg">
                <span className="text-4xl font-orbitron text-cyber-purple animate-glimmer">?</span>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-cyber-purple/20 border-2 border-cyber-purple rounded-lg">
                <span className="text-4xl md:text-5xl">{card.sembol}</span>
            </div>
        </motion.div>
    </div>
);

const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
    }, [acikKartlar, kartlar]);

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
                    <button onClick={resetGame} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple rounded-md transition-colors">Yeniden Başlat</button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">Geri</button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {kartlar.map(card => (
                    <MemoryCard key={card.id} card={card} isFlipped={acikKartlar.includes(card.id) || card.eslesti} onClick={handleCardClick} />
                ))}
            </div>
            <AnimatePresence>
                {oyunBitti && (
                    <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="p-8 bg-dark-anthracite rounded-lg border-2 border-cyber-purple text-center shadow-2xl shadow-cyber-purple/20" initial={{ scale: 0.5, y: -100 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring' }}>
                            <h2 className="text-3xl font-orbitron text-cyber-purple mb-2">Tebrikler!</h2>
                            <p className="text-light-gray mb-4">Hafıza matrisini {hamle} hamlede çözdün.</p>
                            <button onClick={resetGame} className="px-6 py-2 font-orbitron bg-cyber-purple hover:bg-cyber-purple/80 rounded-md transition-colors">Tekrar Oyna</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// OYUN 2: X-O Savaşı
// ============================================================================
const calculateWinner = (squares: (string | null)[]): string | null => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
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

const TicTacToe: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
    };

    const status = winner ? (winner === 'Berabere' ? 'Oyun Berabere!' : `Kazanan: ${winner}`) : `Sıradaki: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">X-O Savaşı</h1>
            <p className="text-metallic-gray mb-8">Kadim strateji oyunu. Üç sembolü yan yana getir, kazan!</p>
            <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-lg">
                <p className="font-orbitron text-lg">{status}</p>
                <div>
                    <button onClick={resetGame} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple rounded-md transition-colors">Yeniden Başlat</button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">Geri</button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto">
                {squares.map((value, i) => (
                    <button key={i} className={`w-full aspect-square text-6xl font-bold flex items-center justify-center rounded-lg transition-colors ${value ? (value === 'X' ? 'bg-cyber-purple/30 text-white' : 'bg-metallic-gray/30 text-white') : 'bg-white/5 hover:bg-white/10'}`} onClick={() => handleClick(i)}>
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

const RockPaperScissors: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [playerChoice, setPlayerChoice] = useState<{ name: string; emoji: string } | null>(null);
    const [computerChoice, setComputerChoice] = useState<{ name: string; emoji: string } | null>(null);
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
    };

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
                    <button onClick={resetGame} disabled={!result} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors">Tekrar Oyna</button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">Geri</button>
                </div>
            </div>
            <div className="flex justify-around items-center my-8">
                <div className="text-center">
                    <p className="font-orbitron text-2xl mb-2">SEN</p>
                    <div className="w-32 h-32 text-6xl bg-white/5 rounded-lg flex items-center justify-center">{playerChoice?.emoji}</div>
                </div>
                <p className="text-4xl font-bold">VS</p>
                <div className="text-center">
                    <p className="font-orbitron text-2xl mb-2">RAKİP</p>
                    <div className="w-32 h-32 text-6xl bg-white/5 rounded-lg flex items-center justify-center">{computerChoice?.emoji}</div>
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
// OYUN 4: Siber Yılan
// ============================================================================
const useInterval = (callback: () => void, delay: number | null) => {
    const savedCallback = useRef<() => void>();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        function tick() {
            savedCallback.current!();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

const SnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const BOARD_SIZE = 20;
    const [snake, setSnake] = useState<number[][]>([[10, 10], [10, 9]]);
    const [food, setFood] = useState<number[]>([15, 15]);
    const [direction, setDirection] = useState<number[]>([0, 1]); // right
    const [speed, setSpeed] = useState<number | null>(200);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const createFood = () => {
        let newFood: number[];
        do {
            newFood = [Math.floor(Math.random() * BOARD_SIZE), Math.floor(Math.random() * BOARD_SIZE)];
        } while (snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
        setFood(newFood);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        let newDirection: number[];
        switch (e.key) {
            case "ArrowUp": newDirection = [-1, 0]; break;
            case "ArrowDown": newDirection = [1, 0]; break;
            case "ArrowLeft": newDirection = [0, -1]; break;
            case "ArrowRight": newDirection = [0, 1]; break;
            default: return;
        }
        if (newDirection[0] !== -direction[0] && newDirection[1] !== -direction[1]) {
            setDirection(newDirection);
        }
    };

    const runGame = useCallback(() => {
        if (gameOver) return;
        const newSnake = [...snake];
        const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];
        newSnake.unshift(head);
        if (head[0] < 0 || head[0] >= BOARD_SIZE || head[1] < 0 || head[1] >= BOARD_SIZE) {
            setGameOver(true);
            return;
        }
        if (newSnake.slice(1).some(segment => segment[0] === head[0] && segment[1] === head[1])) {
            setGameOver(true);
            return;
        }
        if (head[0] === food[0] && head[1] === food[1]) {
            setScore(prev => prev + 1);
            createFood();
        } else {
            newSnake.pop();
        }
        setSnake(newSnake);
    }, [snake, direction, food, gameOver]);

    useInterval(runGame, speed);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    const resetGame = () => {
        setSnake([[10, 10], [10, 9]]);
        setFood([15, 15]);
        setDirection([0, 1]);
        setSpeed(200);
        setGameOver(false);
        setScore(0);
    };

    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Siber Yılan</h1>
            <p className="text-metallic-gray mb-8">Klasik yılan oyunu. Yemleri topla, kendine çarpma, büyü!</p>
            <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-lg">
                <p className="font-orbitron">Puan: <span className="text-cyber-purple">{score}</span></p>
                <div>
                    <button onClick={resetGame} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple rounded-md transition-colors">Yeniden Başlat</button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">Geri</button>
                </div>
            </div>
            <div className="relative w-full aspect-square bg-black border-2 border-cyber-purple/50 grid grid-cols-20 grid-rows-20">
                {snake.map((segment, index) => (
                    <div key={index} className="bg-cyber-purple" style={{ gridRowStart: segment[0] + 1, gridColumnStart: segment[1] + 1 }} />
                ))}
                <div className="bg-red-500 animate-pulse" style={{ gridRowStart: food[0] + 1, gridColumnStart: food[1] + 1 }} />
                {gameOver && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                        <h2 className="text-3xl font-orbitron text-red-500">Oyun Bitti</h2>
                        <p className="text-light-gray mt-2">Puan: {score}</p>
                        <button onClick={resetGame} className="mt-4 px-6 py-2 font-orbitron bg-cyber-purple rounded">Tekrar Dene</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// OYUN 5: Kelime Dekoderi (Adam Asmaca)
// ============================================================================
const KELIMELER = ["GELECEK", "TEKNOLOJI", "MATRIKS", "SIBER", "OTOBOT", "HATIRA", "YAPAYZEKA", "ARŞİV", "SINIF"];
const ALFABE = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

const HangmanGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [kelime, setKelime] = useState(() => KELIMELER[Math.floor(Math.random() * KELIMELER.length)]);
    const [tahminler, setTahminler] = useState<string[]>([]);
    const yanlisTahminSayisi = tahminler.filter(harf => !kelime.includes(harf)).length;
    const kazandi = kelime.split('').every(harf => tahminler.includes(harf));
    const kaybetti = yanlisTahminSayisi >= 6;
    const oyunBitti = kazandi || kaybetti;

    const handleGuess = (harf: string) => {
        if (!tahminler.includes(harf) && !oyunBitti) {
            setTahminler(prev => [...prev, harf]);
        }
    };

    const resetGame = () => {
        setKelime(KELIMELER[Math.floor(Math.random() * KELIMELER.length)]);
        setTahminler([]);
    };

    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Kelime Dekoderi</h1>
            <p className="text-metallic-gray mb-8">Gizli kelimeyi, sistem çökmeden önce tahmin et. 6 hakkın var.</p>
            <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-lg">
                <div className="font-orbitron">Kalan Hak: <span className="text-cyber-purple">{6 - yanlisTahminSayisi}</span></div>
                <div>
                    <button onClick={resetGame} className="px-4 py-2 mr-2 text-sm font-orbitron bg-cyber-purple/50 hover:bg-cyber-purple rounded-md transition-colors">Yeni Kelime</button>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-orbitron bg-metallic-gray/30 hover:bg-metallic-gray/50 rounded-md transition-colors">Geri</button>
                </div>
            </div>
            <div className="flex justify-center mb-8">
                <svg height="250" width="200" className="stroke-light-gray stroke-2 fill-none">
                    <line x1="60" y1="230" x2="140" y2="230" />
                    <line x1="100" y1="230" x2="100" y2="30" />
                    <line x1="100" y1="30" x2="160" y2="30" />
                    <line x1="160" y1="30" x2="160" y2="60" />
                    {yanlisTahminSayisi > 0 && <circle cx="160" cy="80" r="20" className="stroke-red-500" />}
                    {yanlisTahminSayisi > 1 && <line x1="160" y1="100" x2="160" y2="160" className="stroke-red-500" />}
                    {yanlisTahminSayisi > 2 && <line x1="160" y1="120" x2="130" y2="150" className="stroke-red-500" />}
                    {yanlisTahminSayisi > 3 && <line x1="160" y1="120" x2="190" y2="150" className="stroke-red-500" />}
                    {yanlisTahminSayisi > 4 && <line x1="160" y1="160" x2="130" y2="190" className="stroke-red-500" />}
                    {yanlisTahminSayisi > 5 && <line x1="160" y1="160" x2="190" y2="190" className="stroke-red-500" />}
                </svg>
            </div>
            <div className="flex justify-center gap-4 text-3xl md:text-4xl font-orbitron tracking-widest mb-8">
                {kelime.split('').map((harf, index) => (
                    <span key={index} className="w-10 h-14 border-b-4 flex items-center justify-center">{tahminler.includes(harf) ? harf : '_'}</span>
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {ALFABE.map(harf => (
                    <button key={harf} onClick={() => handleGuess(harf)} disabled={tahminler.includes(harf)} className="w-12 h-12 text-xl font-bold bg-white/5 hover:bg-cyber-purple/30 rounded disabled:bg-metallic-gray/50 disabled:cursor-not-allowed disabled:text-gray-600 transition-colors">
                        {harf}
                    </button>
                ))}
            </div>
            <AnimatePresence>
                {oyunBitti && (
                    <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="p-8 bg-dark-anthracite rounded-lg text-center border-2 border-cyber-purple">
                            <h2 className={`text-3xl font-orbitron mb-2 ${kazandi ? 'text-green-400' : 'text-red-500'}`}>{kazandi ? 'SİSTEM KIRILDI!' : 'SİSTEM ÇÖKTÜ!'}</h2>
                            <p className="text-light-gray mb-4">Gizli kelime: <span className="font-bold">{kelime}</span></p>
                            <button onClick={resetGame} className="px-6 py-2 font-orbitron bg-cyber-purple rounded">Tekrar Dene</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// ANA SAYFA BİLEŞENİ (OYUN MENÜSÜ)
// ============================================================================
type Game = {
    id: string;
    name: string;
    description: string;
    type: 'react' | 'html';
    component?: React.ReactNode;
    url?: string;
};

const MiniGamesPage: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const games: Game[] = [
        {
            id: 'flappybird',
            type: 'html',
            name: 'Siber Kanat Çırpışı',
            description: 'Engellerin arasından süzül, siber borulardan kaç.',
            url: '/games/flappybird/index.html'
        },
         {
            id: '2048',
            type: 'html',
            name: 'OTOBOT 2048',
            description: 'Sayıları Birleştirerek 2048 e Ulaşmaya Çalış',
            url: '/games/2048/index.html'
        },
        {
  id: 'earntodie2',
  type: 'html',
  name: 'Earn to Die 2',
  description: 'Zombilere karşı arabayla hayatta kal!',
  url: '/games/earntodie2.swf'
},
        { id: 'memory', type: 'react', name: 'Mistik Hafıza', description: 'Sembollerin ardındaki sırrı çöz, zihnini test et.', component: <MemoryGame onBack={() => setSelectedGame(null)} /> },
        { id: 'tictactoe', type: 'react', name: 'X-O Savaşı', description: 'Kadim strateji oyunu. Üçü yan yana getir, kazan.', component: <TicTacToe onBack={() => setSelectedGame(null)} /> },
        { id: 'rockpaperscissors', type: 'react', name: 'Taş-Kağıt-Makas', description: 'Kadim düelloda şansını ve zekanı sına.', component: <RockPaperScissors onBack={() => setSelectedGame(null)} /> },
        { id: 'snake', type: 'react', name: 'Siber Yılan', description: 'Nostaljik atari klasiği. Büyü ve hayatta kal.', component: <SnakeGame onBack={() => setSelectedGame(null)} /> },
        { id: 'hangman', type: 'react', name: 'Kelime Dekoderi', description: 'Gizli kelimeyi, sistem çökmeden önce tahmin et.', component: <HangmanGame onBack={() => setSelectedGame(null)} /> },
    ];

    return (
        <AnimatedPage>
            <div className="max-w-4xl mx-auto text-center">
                <AnimatePresence mode="wait">
                    {selectedGame ? (
                        <motion.div
                            key={selectedGame.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            {selectedGame.type === 'html' && selectedGame.url ? (
                                <HtmlGamePlayer
                                    game={{ name: selectedGame.name, description: selectedGame.description, url: selectedGame.url }}
                                    onBack={() => setSelectedGame(null)}
                                />
                            ) : (
                                selectedGame.component
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="menu" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Oyun Merkezi</h1>
                            <p className="text-metallic-gray mb-8">Hafızanı, stratejini ve şansını test etmek için bir siber-arena seç.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {games.map(game => (
                                    <motion.div
                                        key={game.id}
                                        onClick={() => setSelectedGame(game)}
                                        className="p-6 bg-white/5 border border-metallic-gray/20 rounded-lg cursor-pointer transition-all hover:border-cyber-purple hover:shadow-lg hover:shadow-cyber-purple/20 transform hover:-translate-y-2"
                                        whileHover={{ scale: 1.03 }}
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