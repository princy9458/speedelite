'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from '@/i18n/routing';

interface NavProps {
  onLogin?: () => void;
}

const Nav = ({ onLogin }: NavProps) => {
  const t = useTranslations('landing.nav');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5">
      <Link href="/" className="flex items-center gap-2">
        <img 
    src="/website/se_logo.png" 
    alt="SpeedElite"
    className="h-10 w-auto object-contain"
  />
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium text-white/70">
        <Link href="#" className="hover:text-[#F4D693] transition-colors">{t('about')}</Link>
        <Link href="#" className="hover:text-[#F4D693] transition-colors">{t('events')}</Link>
        <Link href="#" className="hover:text-[#F4D693] transition-colors">{t('rules')}</Link>
        <Link href="#" className="hover:text-[#F4D693] transition-colors">{t('contact')}</Link>
      </div>
      
      <div className="flex items-center gap-6">
        <LanguageSwitcher />
        <button 
          onClick={onLogin || (() => window.location.href = '/login')}
          className="gold-gradient text-black text-xs uppercase tracking-widest font-bold px-6 py-2.5 btn-shape hover:scale-105 transition-all shadow-lg"
        >
          {t('login')}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
