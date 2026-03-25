import { redirect } from 'next/navigation';

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  redirect('/en/admin'); // Default redirect to localized version
  return <>{children}</>;
}
