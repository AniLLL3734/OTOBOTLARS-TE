
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Olay } from '../types';

interface EventCardProps {
    olay: Olay;
}

const EventCard: React.FC<EventCardProps> = ({ olay }) => {
    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <Link to={`/olay/${olay.id}`} className="block group">
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-metallic-gray/20 transition-all duration-300 group-hover:border-cyber-purple group-hover:shadow-[0_0_15px_rgba(157,0,255,0.3)] h-full flex flex-col">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-2xl font-orbitron font-bold text-light-gray group-hover:text-cyber-purple transition-colors duration-300">
                            {olay.baslik}
                        </h3>
                        <span className="text-sm text-metallic-gray font-mono">{olay.tarih}</span>
                    </div>
                    <p className="mt-4 text-metallic-gray flex-grow">{olay.ozet}</p>
                    <div className="mt-4 text-sm font-orbitron text-cyber-purple/80 group-hover:text-cyber-purple transition-colors duration-300 self-start">
                        Detayları Görüntüle →
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default EventCard;
