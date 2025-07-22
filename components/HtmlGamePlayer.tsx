import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// SVG ikonları doğrudan bileşen içine ekleyerek dış bağımlılığı azaltıyoruz.
const FullscreenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4-4l-5-5" />
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

// Bileşenin alacağı propların arayüzü
interface HtmlGamePlayerProps {
  game: {
    name: string;
    description: string;
    url: string;
  };
  onBack: () => void;
}

const HtmlGamePlayer: React.FC<HtmlGamePlayerProps> = ({ game, onBack }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const ruffleContainerRef = useRef<HTMLDivElement>(null);

  // Ruffle'ı yüklemek için useEffect
  useEffect(() => {
    // SWF dosyası kontrolü
    if (game.url.toLowerCase().endsWith('.swf')) {
      // Ruffle script'ini dinamik olarak yükle
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
      script.async = true;
      script.onload = () => {
        // Ruffle yüklendiğinde SWF dosyasını oynat
        if (ruffleContainerRef.current && window.RufflePlayer) {
          const ruffle = window.RufflePlayer.newest();
          const player = ruffle.createPlayer();
          player.config = {
            autoplay: 'on',
            quality: 'high',
            letterbox: 'on',
            scale: 'showAll',
          };
          ruffleContainerRef.current.appendChild(player);
          player.load(game.url).catch((error: Error) => {
            console.error('Ruffle yükleme hatası:', error);
          });
        }
      };
      document.body.appendChild(script);

      // Cleanup: Komponent unmount olduğunda script'i ve player'ı kaldır
      return () => {
        if (ruffleContainerRef.current && ruffleContainerRef.current.firstChild) {
          ruffleContainerRef.current.removeChild(ruffleContainerRef.current.firstChild);
        }
        document.body.removeChild(script);
      };
    }
  }, [game.url]);

  // Tam ekran fonksiyonu
  const handleFullScreen = () => {
    if (gameContainerRef.current) {
      if (gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen();
      } else if ((gameContainerRef.current as any).mozRequestFullScreen) {
        (gameContainerRef.current as any).mozRequestFullScreen();
      } else if ((gameContainerRef.current as any).webkitRequestFullscreen) {
        (gameContainerRef.current as any).webkitRequestFullscreen();
      } else if ((gameContainerRef.current as any).msRequestFullscreen) {
        (gameContainerRef.current as any).msRequestFullscreen();
      }
    }
  };

  // Dosya uzantısına göre SWF mi yoksa HTML mi kontrol et
  const isSwf = game.url.toLowerCase().endsWith('.swf');

  return (
    <div className="w-full">
      {/* === BAŞLIK BÖLÜMÜ === */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-cyber-purple tracking-widest">
          OTOBOT OYUN OYNATICI
        </h1>
        <p className="text-lg md:text-xl text-metallic-gray font-light mt-2">{game.name}</p>
      </div>

      {/* === OYUN VE KONTROL PANELİ === */}
      <motion.div
        ref={gameContainerRef}
        className="relative w-full aspect-[16/9] bg-black border-2 border-cyber-purple/50 rounded-lg shadow-2xl shadow-cyber-purple/20 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        {isSwf ? (
          // SWF dosyaları için Ruffle player
          <div
            ref={ruffleContainerRef}
            className="w-full h-full"
            style={{ backgroundColor: '#000' }}
          />
        ) : (
          // HTML oyunlar için mevcut iframe
          <iframe
            src={game.url}
            title={game.name}
            className="w-full h-full"
            allowFullScreen
          />
        )}

        {/* === KONTROL PANELİ === */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-between items-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-2 md:p-3">
            <p className="font-orbitron text-sm md:text-base text-metallic-gray pl-2">
              {game.description}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFullScreen}
                title="Tam Ekran"
                className="flex items-center space-x-2 px-3 py-2 text-xs md:text-sm font-orbitron bg-metallic-gray/20 hover:bg-metallic-gray/40 text-white rounded-md transition-all duration-300"
              >
                <FullscreenIcon />
                <span className="hidden md:inline">TAM EKRAN</span>
              </button>
              <button
                onClick={onBack}
                title="Geri Dön"
                className="flex items-center space-x-2 px-3 py-2 text-xs md:text-sm font-orbitron bg-cyber-purple/80 hover:bg-cyber-purple/100 text-white rounded-md transition-all duration-300"
              >
                <BackIcon />
                <span className="hidden md:inline">GERİ</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-xs text-metallic-gray/70 mt-4 px-2">
        {isSwf
          ? 'SWF oyun kontrolleri için oyun alanına tıklayın. Bazı eski Flash oyunlar tam uyumlu olmayabilir.'
          : 'Oyun kontrolleri çalışmazsa, farenizle oyun alanına bir kez tıklayın.'}
      </p>
    </div>
  );
};

export default HtmlGamePlayer;