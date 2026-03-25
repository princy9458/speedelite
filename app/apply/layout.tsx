import { redirect } from 'next/navigation';

export default function RootApplyLayout({ children }: { children: React.ReactNode }) {
  redirect('/en/apply/select-event');
  return <>{children}</>;
}
