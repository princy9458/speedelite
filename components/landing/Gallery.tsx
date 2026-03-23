'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const Gallery = () => {
  const t = useTranslations('landing.gallery');
  return (
    <section className="py-24 bg-[#0F0F0F]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 max-w-2xl mx-auto">{t('title')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="h-[400px] rounded-[40px_0] overflow-hidden group border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=2070" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt="Gallery 1"
            />
          </div>
          <div className="h-[400px] rounded-[0_40px] overflow-hidden group md:mt-12 border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2070" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt="Gallery 2"
            />
          </div>
          <div className="h-[400px] rounded-[40px_0] overflow-hidden group border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2070" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt="Gallery 3"
            />
          </div>
          <div className="h-[400px] rounded-[0_40px] overflow-hidden group md:mt-12 border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=2069" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt="Gallery 4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
