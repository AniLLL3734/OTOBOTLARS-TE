import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaCode } from 'react-icons/fa'; // Hacker teması için bir kod ikonu

const YAPIMCI: React.FC = () => {
    return (
        <motion.footer
            className="relative w-full px-4 py-8 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
        >
            <div className="max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg shadow-lg shadow-green-500/10">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <FaCode className="text-green-400 text-2xl" />
                    <h3 className="font-orbitron text-xl text-green-400 tracking-widest">
                        // SİSTEM MESAJI
                    </h3>
                </div>
                
                <div className="font-mono text-lg text-green-400 h-24 md:h-16 text-center">
                    <TypeAnimation
                        sequence={[
                            '[SİSTEM]: Geliştirici kimliği taranıyor...\n[DURUM]: DOĞRULANDI',
                            2000,
                            '[İSİM]: ANIL\n[GÖREV]: BU ARŞİVİN MİMARI.',
                            2000,
                            '[MOTTO]: "Bazı kodlar, asla unutulmaz..."',
                            3000,
                        ]}
                        wrapper="span"
                        speed={50}
                        style={{ whiteSpace: 'pre-line', display: 'inline-block' }}
                        repeat={Infinity}
                    />
                </div>

                <div className="w-full h-[1px] bg-green-500/20 mt-6"></div>
                <p className="text-center text-xs text-green-500/50 mt-4 font-mono">
                    OTOBOTLAR ARŞİVİ © 2024 - TÜM HAKLARI SAKLIDIR.
                </p>
            </div>
        </motion.footer>
    );
};

export default YAPIMCI;