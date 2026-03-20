'use client';

import { Menu, LogOut, Search } from 'lucide-react';
import { useAdminUiStore } from '@/lib/stores/adminUi';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';

export default function Topbar() {
  const { toggleSidebar, lang, setLang } = useAdminUiStore();
  const router = useRouter();
  const t = getDictionary(lang).admin;

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">{t.title}</p>
          <p className="text-xl font-serif gold-text">{t.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/50 md:flex">
          <Search className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.3em]">{t.command}</span>
        </div>
        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
          {(['hr', 'en'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] transition ${
                lang === code ? 'bg-[#F4D693] text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          {t.logout}
        </button>
      </div>
    </header>
  );
}
