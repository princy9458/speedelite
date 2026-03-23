'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface VouchersProps {
  onApply: () => void;
}

const Vouchers = ({ onApply }: VouchersProps) => {
  const t = useTranslations('landing.vouchers');
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="card-gradient p-12 md:p-24 rounded-[0_120px] border border-white/10 flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 gold-gradient rounded-full blur-[120px] opacity-10 -z-10" />
          <div className="flex-1 space-y-10">
            <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight">{t('title')}</h2>
            <p className="text-white/70 text-xl leading-relaxed">{t('desc')}</p>
            <ul className="space-y-8">
              {['i1', 'i2', 'i3'].map((key) => (
                <li key={key} className="flex items-center gap-5 text-xl font-bold">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="text-black w-6 h-6" />
                  </div>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={onApply}
              className="gold-gradient text-black font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl"
            >
              {t('btn')}
            </button>
          </div>
          <div className="flex-1 relative hidden lg:block">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2070" 
                alt="Vouchers" 
                className="rounded-[0_60px] w-full object-cover aspect-square shadow-2xl border border-white/10"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 gold-gradient rounded-full blur-3xl opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vouchers;
