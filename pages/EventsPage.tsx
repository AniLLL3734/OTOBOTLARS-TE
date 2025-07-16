
import React from 'react';
import { motion } from 'framer-motion';
import { olaylar } from '../constants';
import AnimatedPage from '../components/AnimatedPage';
import EventCard from '../components/EventCard';

const EventsPage: React.FC = () => {
    return (
        <AnimatedPage>
            <motion.h1
                className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 text-light-gray"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Olay Arşivi
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {olaylar.map((olay) => (
                    <EventCard key={olay.id} olay={olay} />
                ))}
            </div>
        </AnimatedPage>
    );
};

export default EventsPage;
