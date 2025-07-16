
import React from 'react';
import { motion } from 'framer-motion';

const LogoIcon = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
            d="M50 10 L90 50 L50 90 L10 50 Z"
            stroke="#9D00FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.circle
            cx="50"
            cy="50"
            r="15"
            stroke="#EAEAEA"
            strokeWidth="3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "backOut" }}
        />
    </svg>
);


const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-dark-anthracite flex flex-col justify-center items-center z-50">
            <LogoIcon />
            <motion.p
                className="font-orbitron text-light-gray mt-4 text-lg tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            >
                SİNYAL ALINIYOR...
            </motion.p>
        </div>
    );
};

export default Loader;
