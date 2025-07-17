// src/components/PhotoCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Fotoğraf verisinin tipini belirliyoruz
interface Fotograf {
    id: string;
    baslik: string;
    gorsel: string;
    tarih: string;
}

interface PhotoCardProps {
    fotograf: Fotograf;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ fotograf }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Link 
                to={`/fotograf/${fotograf.id}`} 
                className="block bg-dark-anthracite rounded-lg overflow-hidden group border border-metallic-gray/30 hover:border-cyber-purple/70 transition-all duration-300 shadow-lg hover:shadow-cyber-purple/20"
            >
                <div className="overflow-hidden">
                    <img
                        src={fotograf.gorsel}
                        alt={fotograf.baslik}
                        className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                </div>
                <div className="p-5">
                    <h3 className="text-xl font-orbitron font-bold text-light-gray truncate">{fotograf.baslik}</h3>
                    <p className="text-metallic-gray mt-2 text-sm font-mono">{fotograf.tarih}</p>
                </div>
            </Link>
        </motion.div>
    );
};

export default PhotoCard;