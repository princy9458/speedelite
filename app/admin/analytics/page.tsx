import { redirect } from 'next/navigation';

export default function AnalyticsRoot() {
  redirect('/en/admin/analytics');
  return null;
}
