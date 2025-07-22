import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import { FiVolume2, FiPlusCircle } from 'react-icons/fi';

// Şarkı verisi için tür tanımı
interface Song {
    id: number;
    title: string;
    artist: string;
    file: string;
}

// Sayfa geçiş animasyonu
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};

const EfsaneSarkilarPage: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [boost, setBoost] = useState(1);
    
    // Ses elementleri için referanslar
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const trackRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Başlangıçta şarkı listesini JSON dosyasından yükle
    useEffect(() => {
        fetch('/sarkilar.json')
            .then(response => response.json())
            .then(data => setSongs(data))
            .catch(error => console.error("Şarkılar yüklenemedi:", error));
    }, []);

    // Volume Boost için gerekli olan Web Audio API kurulumu
    const setupAudioContext = useCallback(() => {
        if (audioRef.current && !audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const gainNode = context.createGain();
            const track = context.createMediaElementSource(audioRef.current);
            track.connect(gainNode).connect(context.destination);
            audioContextRef.current = context;
            gainNodeRef.current = gainNode;
            trackRef.current = track;
            gainNode.gain.value = volume * boost;
        }
    }, [volume, boost]);

    // Oynatma/Duraklatma işlevi
    const togglePlayPause = useCallback(() => {
        if (!audioContextRef.current) {
            setupAudioContext();
        }
        
        if (currentSongIndex === null && songs.length > 0) {
            setCurrentSongIndex(0);
            setIsPlaying(true);
            audioContextRef.current?.resume();
            return;
        }

        const audio = audioRef.current;
        if (!audio) return;
        
        const currentlyPlaying = !isPlaying;
        if (currentlyPlaying) {
            audioContextRef.current?.resume();
            audio.play();
        } else {
            audio.pause();
        }
        setIsPlaying(currentlyPlaying);
    }, [isPlaying, currentSongIndex, songs.length, setupAudioContext]);
    
    // Şarkıyı indekse göre başlatan fonksiyon
    const playSong = useCallback((index: number) => {
        if (!audioContextRef.current) {
            setupAudioContext();
        }
        setCurrentSongIndex(index);
        setIsPlaying(true);
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, [setupAudioContext]);

    // Sonraki şarkıya geçen fonksiyon
    const playNext = useCallback(() => {
        if (songs.length === 0) return;
        setCurrentSongIndex(prev => (prev === null || prev === songs.length - 1) ? 0 : prev + 1);
        setIsPlaying(true);
    }, [songs.length]);

    // Önceki şarkıya geçen fonksiyon
    const playPrev = useCallback(() => {
        if (songs.length === 0) return;
        setCurrentSongIndex(prev => (prev === null || prev === 0) ? songs.length - 1 : prev - 1);
        setIsPlaying(true);
    }, [songs.length]);
    
    // Ses ve boost seviyesi değiştiğinde sesi güncelleyen hook
    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume * boost;
        }
    }, [volume, boost]);

    // Şarkının zamanı ilerledikçe ilerleme çubuğunu güncelleyen hook
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        audio.addEventListener('timeupdate', updateProgress);
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
        };
    }, []);

    // MediaSession API ve şarkı bitince yenisini başlatma hook'u
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if ('mediaSession' in navigator && currentSongIndex !== null) {
            const currentSong = songs[currentSongIndex];
            
            // Medya bilgilerini ayarla (ARTWORK OLMADAN)
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                album: 'OTOBOTLAR8/E ARŞİVİ',
            });
            
            navigator.mediaSession.setActionHandler('play', togglePlayPause);
            navigator.mediaSession.setActionHandler('pause', togglePlayPause);
            navigator.mediaSession.setActionHandler('nexttrack', playNext);
            navigator.mediaSession.setActionHandler('previoustrack', playPrev);
        }

        const handleSongEnd = () => playNext();
        audio.addEventListener('ended', handleSongEnd);
    
        return () => {
          audio.removeEventListener('ended', handleSongEnd);
        };
    }, [currentSongIndex, songs, isPlaying, playNext, playPrev, togglePlayPause]);

    // İlerleme çubuğunda bir yere tıklanmasını yönet
    const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audio.currentTime = audio.duration * percentage;
    };


    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12 min-h-screen"
        >
            <audio
                ref={audioRef}
                src={currentSongIndex !== null ? songs[currentSongIndex].file : ''}
                onLoadedData={() => { if(isPlaying) audioRef.current?.play(); }}
                crossOrigin="anonymous" 
            />

            <div className="text-center mb-12">
                <h1 className="text-5xl font-orbitron font-bold text-light-gray tracking-tighter">EFSANE ŞARKILAR</h1>
                <p className="text-lg text-metallic-gray mt-2">Unutulmaz anların siber-melodik tınıları.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Şarkı Listesi */}
                <div className="md:col-span-1 bg-dark-anthracite/50 border border-metallic-gray/20 rounded-lg p-6 max-h-[60vh] overflow-y-auto">
                    <h2 className="font-orbitron text-cyber-purple text-xl mb-4">Çalma Listesi</h2>
                    <ul>
                        {songs.map((song, index) => (
                            <li
                                key={song.id}
                                onClick={() => playSong(index)}
                                className={`p-3 rounded-md cursor-pointer transition-all duration-300 flex items-center justify-between ${
                                    currentSongIndex === index
                                        ? 'bg-cyber-purple/20 text-cyber-purple'
                                        : 'hover:bg-metallic-gray/20 text-light-gray'
                                }`}
                            >
                                <div>
                                    <p className="font-bold">{song.title}</p>
                                    <p className="text-sm opacity-70">{song.artist}</p>
                                </div>
                                {currentSongIndex === index && isPlaying && <FaPlay className="animate-pulse" />}
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Müzik Çalar Arayüzü */}
                <div className="md:col-span-2 bg-dark-anthracite/70 border border-metallic-gray/20 rounded-lg p-8 flex flex-col justify-center items-center h-full">
                    {currentSongIndex !== null ? (
                        <>
                            <div className="text-center">
                               <h3 className="text-3xl font-orbitron text-light-gray">{songs[currentSongIndex].title}</h3>
                                <p className="text-metallic-gray mt-1">{songs[currentSongIndex].artist}</p>
                            </div>
                            
                            <div className="w-full mt-8">
                                <div onClick={handleProgressScrub} className="bg-metallic-gray/30 rounded-full cursor-pointer h-2 group">
                                    <div style={{ width: `${progress}%`}} className="bg-cyber-purple h-2 rounded-full"></div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-8 text-light-gray text-3xl my-8">
                                <button onClick={playPrev} className="hover:text-cyber-purple transition-colors"><FaBackward /></button>
                                <button onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-cyber-purple text-dark-anthracite flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </button>
                                <button onClick={playNext} className="hover:text-cyber-purple transition-colors"><FaForward /></button>
                            </div>

                            <div className="w-full max-w-xs space-y-4">
                               <div className='flex items-center space-x-3'>
                                    <FiVolume2 className="text-metallic-gray" />
                                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-full h-1 bg-metallic-gray/30 rounded-lg appearance-none cursor-pointer range-sm accent-cyber-purple" />
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <FiPlusCircle className="text-metallic-gray" />
                                    <span className="text-xs text-metallic-gray w-20">Gain Boost</span>
                                    <input type="range" min="1" max="5" step="0.1" value={boost} onChange={e => setBoost(parseFloat(e.target.value))} className="w-full h-1 bg-metallic-gray/30 rounded-lg appearance-none cursor-pointer range-sm accent-cyber-purple" />
                                </div>
                            </div>
                        </>
                    ) : (
                         <div className="text-center text-metallic-gray">
                            <h3 className="font-orbitron text-2xl">Bir şarkı seç</h3>
                            <p>Çalmaya başlamak için listeden bir parça seçin.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default EfsaneSarkilarPage;