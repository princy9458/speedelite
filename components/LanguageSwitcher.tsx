'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLanguageChange = (nextLocale: string) => {
    router.replace(
      // @ts-expect-error -- pathname might not match exactly with params if there are dynamic segments
      { pathname, params },
      { locale: nextLocale }
    );
  };

  return (
    <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm">
      <button
        onClick={() => handleLanguageChange('hr')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
          locale === 'hr'
            ? 'gold-gradient text-black shadow-lg scale-105'
            : 'text-white/60 hover:text-white'
        }`}
      >
        HR
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
          locale === 'en'
            ? 'gold-gradient text-black shadow-lg scale-105'
            : 'text-white/60 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
