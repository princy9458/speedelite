'use client';

import React from 'react';
import { Sparkles, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface FooterProps {
  onApply: (role: string) => void;
}

const Footer = ({ onApply }: FooterProps) => {
  const t = useTranslations('landing');
  
  return (
    <footer className="bg-[#0F0F0F] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <img 
  src="/website/se_logo.png" 
  alt="SpeedElite"
  className="h-10 w-auto object-contain"
/>
            </Link>
            <p className="text-white/50 max-w-sm leading-relaxed text-lg">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#F4D693] hover:text-black transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#F4D693] hover:text-black transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#F4D693] hover:text-black transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => onApply('gentleman')}
                className="gold-gradient text-black font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest"
              >
                {t('hero.btnGent')}
              </button>
              <button 
                onClick={() => onApply('lady')}
                className="border border-white/20 text-white font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest hover:bg-white/5"
              >
                {t('hero.btnLady')}
              </button>
            </div>
          </div>
          
          <div className="space-y-8">
            <h4 className="font-serif text-xl font-bold">{t('footer.links')}</h4>
            <ul className="space-y-4 text-white/50 text-base">
              <li><Link href="#" className="hover:text-[#F4D693] transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="#" className="hover:text-[#F4D693] transition-colors">{t('nav.events')}</Link></li>
              <li><Link href="#" className="hover:text-[#F4D693] transition-colors">{t('nav.rules')}</Link></li>
              <li><Link href="#" className="hover:text-[#F4D693] transition-colors">{t('footer.p2')}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-8">
            <h4 className="font-serif text-xl font-bold">{t('footer.newsletter')}</h4>
            <p className="text-white/50 text-base">{t('footer.newsDesc')}</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder={t('footer.placeholder')} 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[#F4D693]/50"
              />
              <button className="gold-gradient text-black px-6 py-3 rounded-lg font-bold text-sm">
                {t('footer.btn')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
          <p className="text-white/30 text-sm">{t('footer.rights')}</p>
          <div className="flex gap-8 text-white/30 text-sm">
            <a href="#" className="hover:text-white transition-colors">{t('footer.p1')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.p2')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.p3')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
