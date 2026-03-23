'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface HeroProps {
  onApply: (role: string) => void;
}

const Hero = ({ onApply }: HeroProps) => {
  const t = useTranslations('landing.hero');
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2069" 
          alt="Elite Dinner" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-[#F4D693] w-5 h-5 fill-[#F4D693]" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-[1] text-shadow-gold">
              {t('title')} <br />
              <span className="italic gold-text">{t('subtitle')}</span>
            </h1>
            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-lg font-sans">
              {t('desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onApply('gentleman')}
                className="gold-gradient text-black font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm uppercase tracking-wider"
              >
                {t('btnGent')}
              </button>
              <button 
                onClick={() => onApply('lady')}
                className="bg-transparent border border-white text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm uppercase tracking-wider"
              >
                {t('btnLady')}
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
                className="w-full h-full object-cover"
                alt="Elite couple"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 gold-gradient rounded-full blur-3xl opacity-20" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 gold-gradient rounded-full blur-3xl opacity-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
