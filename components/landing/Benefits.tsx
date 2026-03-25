'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BenefitsProps {
  onApply: (role: 'lady' | 'gentleman') => void;
}

const Benefits = ({ onApply }: BenefitsProps) => {
  const t = useTranslations('landing.benefits');
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-serif text-center mb-24">{t('title')}</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Her */}
          <div className="card-gradient p-12 md:p-16 rounded-[100px_0] border border-white/10 relative group h-full flex flex-col items-center text-center">
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mb-8 shadow-lg">
              <Star className="text-black w-10 h-10 fill-black" />
            </div>
            <h3 className="text-3xl md:text-4xl font-serif italic gold-text mb-10">{t('lady')}</h3>
            <ul className="space-y-8 flex-1">
              {['l1', 'l2', 'l3'].map((key) => (
                <li key={key} className="text-xl text-white/70 leading-relaxed font-sans pb-8 border-b border-white/5 last:border-0 hover:text-white transition-colors">{t(key)}</li>
              ))}
            </ul>
            <button 
              onClick={() => onApply('lady')}
              className="gold-gradient text-black font-bold py-5 px-12 rounded-xl w-full md:w-fit text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg mt-10"
            >
              Apply as a Lady
            </button>
          </div>

          {/* Him */}
          <div className="card-gradient p-12 md:p-16 rounded-[0_100px] border border-white/10 relative group h-full flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8">
              <Star className="text-white w-10 h-10" />
            </div>
            <h3 className="text-3xl md:text-4xl font-serif italic mb-10">{t('gent')}</h3>
            <ul className="space-y-8 flex-1">
              {['g1', 'g2', 'g3'].map((key) => (
                <li key={key} className="text-xl text-white/70 leading-relaxed font-sans pb-8 border-b border-white/5 last:border-0 hover:text-white transition-colors">{t(key)}</li>
              ))}
            </ul>
            <button 
              onClick={() => onApply('gentleman')}
              className="gold-gradient text-black font-bold py-5 px-12 rounded-xl w-full md:w-fit text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg mt-10"
            >
              Apply as a Gentleman
            </button>
          </div>
        </div>
        <p className="text-center mt-16 text-white/40 italic text-lg max-w-2xl mx-auto">{t('note')}</p>
      </div>
    </section>
  );
};

export default Benefits;
