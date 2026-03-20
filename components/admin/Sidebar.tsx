'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, LayoutDashboard, TicketCheck, Users, BadgePercent, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminUiStore } from '@/lib/stores/adminUi';
import { getDictionary } from '@/lib/i18n';

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar, lang } = useAdminUiStore();
  const t = getDictionary(lang).admin;
  const navItems = [
    { label: t.nav.dashboard, href: '/admin', icon: LayoutDashboard },
    { label: t.nav.events, href: '/admin/events', icon: CalendarDays },
    { label: t.nav.bookings, href: '/admin/bookings', icon: TicketCheck },
    { label: t.nav.customers, href: '/admin/customers', icon: Users },
    { label: t.nav.coupons, href: '/admin/coupons', icon: BadgePercent },
    { label: t.nav.analytics, href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSidebar}
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-black/70 backdrop-blur-xl px-6 py-8 transition-transform lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 text-2xl font-serif gold-text mb-10">
          {t.panel}
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-10">
          <Link
            href="/"
            className="block rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            {t.backToSite}
          </Link>
        </div>
      </aside>
    </>
  );
}
