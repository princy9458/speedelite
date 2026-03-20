'use client';

import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { usePathname } from 'next/navigation';

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin/login')) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white lg:flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
