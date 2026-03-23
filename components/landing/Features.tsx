'use client';

import React from 'react';
import { Gift, Utensils, GlassWater, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const FeatureCard = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="card-gradient p-8 rounded-[0_32px] flex flex-col items-center text-center gap-6 border border-white/10 h-full transition-all hover:border-[#F4D693]/30"
  >
    <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl">
      <Icon className="text-[#F4D693] w-10 h-10" />
    </div>
    <h3 className="text-lg font-sans font-bold leading-tight tracking-tight">{title}</h3>
  </motion.div>
);

const Features = () => {
  const t = useTranslations('landing.features');
  return (
    <section className="py-24 bg-[#0F0F0F]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">{t('title')}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <FeatureCard icon={Gift} title={t('f1')} />
          <FeatureCard icon={Utensils} title={t('f2')} />
          <FeatureCard icon={GlassWater} title={t('f3')} />
          <FeatureCard icon={Users} title={t('f4')} />
          <FeatureCard icon={Sparkles} title={t('f5')} />
          <FeatureCard icon={ShieldCheck} title={t('f6')} />
        </div>
      </div>
    </section>
  );
};

export default Features;
