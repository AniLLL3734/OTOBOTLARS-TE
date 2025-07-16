import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AnimatedPage from '../components/AnimatedPage';
import { 
  FaTerminal, FaUserSecret, FaBrain, FaCogs, FaProjectDiagram, 
  FaReact, FaCodeBranch, FaDatabase, FaShieldAlt 
} from 'react-icons/fa';

const OTOBOT_MEMBERS = [ 'Anıl','Yağız Sun', 'Ahmet Arslan', 'Yusuf Kocabaş', 'Yağız Efe Durmuş' ];

const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="absolute -inset-0.5 text-red-500 blur-sm animate-pulse opacity-75">{text}</span>
    <span className="relative">{text}</span>
  </span>
);

const CreditsPage: React.FC = () => {
  const [log, setLog] = useState<string[]>(['[SYSTEM_LOG]: Çekirdek başlatılıyor...']);

  useEffect(() => {
    const logs = [
      'Bellek modülleri kontrol ediliyor... [OK]',
      'Güvenlik duvarı protokolleri aktif. [AKTİF]',
      'Otobot Operatif Birimi ile bağlantı kuruluyor...',
      'Mimar kimliği doğrulanıyor...',
      'Bağlantı başarılı. Manifesto yükleniyor...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setLog(prev => [...prev, `[SYSTEM_LOG]: ${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: (delay: number = 0) => ({
      opacity: 1,
      transition: { delay, duration: 1 }
    })
  };

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto font-mono relative">
        <div className="relative z-10 p-4 sm:p-8 bg-black/80 backdrop-blur-md border border-cyan-400/30 rounded-lg shadow-xl shadow-cyan-500/15">
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <FaTerminal className="text-cyan-400 text-3xl animate-pulse" />
              <h1 className="text-3xl sm:text-4xl font-orbitron text-cyan-400 tracking-wider">
                <GlitchText text="Proje_Manifesto.log" />
              </h1>
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 mb-8"></div>
          </motion.div>

          {/* SİSTEM MİMARI - VURGULU BÖLÜM */}
          <motion.section 
            className="mb-12 p-6 border-2 border-fuchsia-500 rounded-lg shadow-2xl shadow-fuchsia-500/20 relative bg-black/50"
            variants={sectionVariants} custom={0.2} initial="hidden" animate="visible"
          >
            <div className="flex items-start gap-4">
              <FaBrain className="text-fuchsia-400 text-4xl mt-1" />
              <div>
                <h2 className="text-xl font-bold text-light-gray flex items-center gap-2">SİSTEM MİMARI // GHOST IN THE MACHINE</h2>
                <p className="text-fuchsia-400 text-3xl font-orbitron my-2">ANIL</p>
                <TypeAnimation
                  sequence={[
                    'Bu dijital evrenin tasarımcısı ve kodlayıcısı.\nSatırlarca koddan, anılarla dolu bir arşiv yaratan baş mühendis.\nOtobotların fısıltılarını dünyaya duyuran kişi.', 1000
                  ]}
                  wrapper="p"
                  speed={60}
                  cursor={true}
                  className="text-light-gray/80 whitespace-pre-line"
                />
              </div>
            </div>
          </motion.section>
          
          {/* OTOBOT BİRİMİ */}
          <motion.section 
            className="mb-12"
            variants={sectionVariants} custom={0.5} initial="hidden" animate="visible"
          >
            <h2 className="text-xl font-bold text-light-gray flex items-center gap-2 mb-3">
              <FaUserSecret className="text-orange-500" /> OTOBOT BİRİMİ [OPERATIVES]
            </h2>
            <div className="pl-6 border-l-2 border-orange-500/30 text-orange-400 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              {OTOBOT_MEMBERS.map((member, i) => (
                <motion.div key={member} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.15 }}>
                  {'> '} <span className="text-light-gray">{member}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* TEKNOLOJİ YIĞINI */}
          <motion.section
            className="mb-12"
            variants={sectionVariants} custom={0.8} initial="hidden" animate="visible"
          >
            <h2 className="text-xl font-bold text-light-gray flex items-center gap-2 mb-3">
                <FaCodeBranch className="text-yellow-400" /> TEKNOLOJİ YIĞINI [TECH_STACK]
            </h2>
            <div className="pl-6 border-l-2 border-yellow-400/30 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded"><FaReact className="text-cyan-400"/> React + Vite</div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded"><FaDatabase className="text-amber-500"/> Firebase</div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded">TypeScript</div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded">TailwindCSS</div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded"><FaShieldAlt className="text-green-500"/> Netlify</div>
            </div>
          </motion.section>
          
          {/* SİSTEM LOGLARI */}
          <motion.div 
            className="mt-12"
            variants={sectionVariants} custom={1.2} initial="hidden" animate="visible"
          >
            <div className="bg-black/50 p-4 rounded-md border border-gray-700 h-32 overflow-y-auto text-xs text-green-500/80">
                {log.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
            <p className="text-xs text-cyan-400/60 mt-2 text-center">Tüm Sistemler Nominal | Otobot Arşivi Çevrimiçi</p>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CreditsPage;