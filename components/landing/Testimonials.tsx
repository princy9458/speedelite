'use client';

import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const Testimonials = () => {
  const t = useTranslations('landing.testimonials');
  return (
    <section className="py-24 bg-[#0F0F0F]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-[#F4D693]" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#F4D693]">{t('title')}</span>
          </div>
          <p className="text-3xl md:text-4xl font-serif leading-tight">{t('desc')}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", name: "Ana P.", role: "Participant", textKey: "t1" },
            { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", name: "Marko R.", role: "Participant", textKey: "t2" },
            { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", name: "Ivana S.", role: "Participant", textKey: "t3" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="card-gradient p-10 rounded-[60px_0] border border-white/10 relative space-y-8 h-full"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[#F4D693]/10" />
              <div className="flex items-center gap-4">
                <img src={item.img} className="w-16 h-16 rounded-full object-cover border-2 border-[#F4D693]/30" alt={item.name} />
                <div>
                  <h4 className="font-sans font-bold text-lg">{item.name}</h4>
                  <p className="text-white/40 text-sm uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
              <p className="text-lg text-white/70 italic leading-relaxed">
                "{t(item.textKey)}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
