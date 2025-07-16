
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const ContactPage: React.FC = () => {
    const [kullaniciAdi, setKullaniciAdi] = useState('');
    const [mesaj, setMesaj] = useState('');
    const [gonderildi, setGonderildi] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Static site, so we just simulate the submission
        console.log({ kullaniciAdi, mesaj });
        setGonderildi(true);
        setKullaniciAdi('');
        setMesaj('');
        setTimeout(() => setGonderildi(false), 5000);
    };

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto text-center">
                 <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                 >
                    <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-light-gray mb-4">Sinyal Gönder</h1>
                    <p className="text-metallic-gray mb-12">Evrenin boşluğuna bir fısıltı yolla. Belki bir yankı bulur.</p>
                </motion.div>

                {gonderildi ? (
                    <motion.div 
                        className="p-8 bg-cyber-purple/20 border border-cyber-purple rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2 className="text-2xl font-orbitron text-light-gray">Sinyal Gönderildi.</h2>
                        <p className="text-metallic-gray mt-2">Fısıltın boşlukta süzülüyor...</p>
                    </motion.div>
                ) : (
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="space-y-8 p-8 bg-white/5 backdrop-blur-md rounded-lg border border-metallic-gray/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div>
                            <label htmlFor="kullaniciAdi" className="block text-lg font-orbitron text-metallic-gray mb-2 text-left">Çağrı İşaretin?</label>
                            <input
                                id="kullaniciAdi"
                                type="text"
                                value={kullaniciAdi}
                                onChange={(e) => setKullaniciAdi(e.target.value)}
                                className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all"
                                required
                            />
                        </div>
                        <div>
                             <label htmlFor="mesaj" className="block text-lg font-orbitron text-metallic-gray mb-2 text-left">Fısıltın</label>
                            <textarea
                                id="mesaj"
                                value={mesaj}
                                onChange={(e) => setMesaj(e.target.value)}
                                rows={6}
                                className="w-full bg-dark-anthracite/50 border border-metallic-gray/50 rounded-md py-3 px-4 text-light-gray focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all resize-none"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full px-8 py-4 font-orbitron text-lg text-light-gray uppercase tracking-widest bg-cyber-purple/80 border-2 border-cyber-purple rounded-md transition-all duration-300 hover:bg-cyber-purple hover:text-dark-anthracite hover:shadow-[0_0_20px_theme(colors.cyber-purple)]">
                            Boşluğa Bir Fısıltı Yolla
                        </button>
                    </motion.form>
                )}
            </div>
        </AnimatedPage>
    );
};

export default ContactPage;
