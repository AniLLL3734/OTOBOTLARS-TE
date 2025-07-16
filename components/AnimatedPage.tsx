
import React from 'react';
import { motion } from 'framer-motion';

const animations = {
    initial: { opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
    animate: { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
    exit: { opacity: 0, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
};

interface AnimatedPageProps {
    children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.75, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
