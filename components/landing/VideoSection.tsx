'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

const VideoSection = () => {
  const t = useTranslations('landing.video');
  return (
    <section className="py-24 bg-[#0F0F0F]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif">{t('title')}</h2>
          <p className="text-white/60 text-lg">{t('desc')}</p>
        </div>
        
        <div className="relative max-w-5xl mx-auto group">
          <div className="relative aspect-video rounded-[0_80px_0_80px] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2069" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Atmosphere"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="w-24 h-24 bg-[#F4D693] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(244,214,147,0.4)]">
                <Play className="text-black w-10 h-10 fill-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
