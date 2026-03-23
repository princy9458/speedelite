'use client';

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const HowItWorks = () => {
  const t = useTranslations('landing.howItWorks');
  return (
    <section className="py-32 bg-[#0F0F0F]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-serif mb-4">{t('title')}</h2>
        </div>
        
        <div className="space-y-32">
          {/* Step 1 */}
          <div className="relative flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-2/3 relative z-0">
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
                className="w-full aspect-[16/9] object-cover image-pill-right shadow-2xl"
                alt="Step 1"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 lg:-ml-32 relative z-10 card-overlap p-10 md:p-16 rounded-[40px_0_40px_0] shadow-2xl mt-8 lg:mt-0 bg-[#0F0F0F] border border-white/5"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold">{t('step1.title')}</h3>
                  <div className="flex items-center gap-2 text-[#F4D693]">
                    <Clock className="w-6 h-6" />
                    <span className="text-xl font-serif italic">{t('step1.time')}</span>
                  </div>
                </div>
                <ul className="space-y-6">
                  {['p1', 'p2', 'p3'].map((key) => (
                    <li key={key} className="flex items-start gap-4 text-white/80 text-lg leading-relaxed">
                      <ArrowRight className="w-5 h-5 text-[#F4D693] shrink-0 mt-1.5" />
                      <span>{t(`step1.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col lg:flex-row-reverse items-center">
            <div className="w-full lg:w-2/3 relative z-0">
              <img 
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=2069" 
                className="w-full aspect-[16/9] object-cover image-pill-left shadow-2xl"
                alt="Step 2"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 lg:-mr-32 relative z-10 card-overlap p-10 md:p-16 rounded-[0_40px_0_40px] shadow-2xl mt-8 lg:mt-0 bg-[#0F0F0F] border border-white/5"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold">{t('step2.title')}</h3>
                  <div className="flex items-center gap-2 text-[#F4D693]">
                    <Clock className="w-6 h-6" />
                    <span className="text-xl font-serif italic">{t('step2.time')}</span>
                  </div>
                </div>
                <ul className="space-y-6">
                  {['p1', 'p2', 'p3'].map((key) => (
                    <li key={key} className="flex items-start gap-4 text-white/80 text-lg leading-relaxed">
                      <ArrowRight className="w-5 h-5 text-[#F4D693] shrink-0 mt-1.5" />
                      <span>{t(`step2.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
