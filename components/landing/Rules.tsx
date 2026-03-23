'use client';

import React from 'react';
import { Users, Play, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const Rules = () => {
  const t = useTranslations('landing.rules');
  return (
    <section className="py-24 bg-[#0F0F0F]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif">{t('title')}</h2>
          <p className="text-white/60 leading-relaxed text-lg font-sans px-12">
            {t('desc')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: t('r1'), desc: t('r1d') },
            { icon: Play, title: t('r2'), desc: t('r2d') },
            { icon: ShieldCheck, title: t('r3'), desc: t('r3d') }
          ].map((rule, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02 }}
              className="card-gradient p-12 rounded-[40px_0] text-center space-y-8 border border-white/10 shadow-xl"
            >
              <div className="w-20 h-20 flex items-center justify-center mx-auto bg-[#F4D693]/10 rounded-full">
                <rule.icon className="text-[#F4D693] w-10 h-10" />
              </div>
              <h3 className="text-2xl font-sans font-bold tracking-tight">{rule.title}</h3>
              <p className="text-lg text-white/60 leading-relaxed">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rules;
