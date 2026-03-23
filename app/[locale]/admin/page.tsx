"use client";

import { useEffect, useState } from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import GlassCard from '@/components/admin/GlassCard';
import StatCard from '@/components/admin/StatCard';
import Badge from '@/components/admin/Badge';
import { useTranslations, useLocale } from 'next-intl';

type Overview = {
  totals: { events: number; customers: number; bookings: number };
  bookingsByMonth: { label: string; count: number; revenue: number }[];
  revenueByEvent: { title: string; revenue: number; bookings: number }[];
  recentActivity: Array<{
    _id: string;
    createdAt: string;
    paymentStatus: string;
    amountPaid: number;
    user?: { firstName?: string; lastName?: string; email?: string };
    event?: { title?: string; date?: string; time?: string };
  }>;
};

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const t = useTranslations('admin');
  const locale = useLocale();

  useEffect(() => {
    fetch('/api/dashboard/overview')
      .then((res) => res.json())
      .then(setOverview)
      .catch(() => setOverview(null));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{t('overview')}</p>
          <h1 className="text-4xl font-serif gold-text">{t('analyticsOverview')}</h1>
        </div>
        <Link href="/admin/events/new" className="gold-gradient text-black font-bold py-3 px-6 rounded-xl text-sm uppercase tracking-widest">
          {t('createEvent')}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label={t('totalEvents')} value={overview?.totals.events ?? 0} />
        <StatCard label={t('totalCustomers')} value={overview?.totals.customers ?? 0} />
        <StatCard label={t('totalBookings')} value={overview?.totals.bookings ?? 0} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif">{t('bookingsOverTime')}</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">{t('last6Months')}</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview?.bookingsByMonth || []}>
                <XAxis dataKey="label" stroke="#BFA370" tickLine={false} axisLine={false} />
                <YAxis stroke="#BFA370" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,15,15,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#F4D693" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-serif">{t('revenueByEvent')}</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.revenueByEvent || []}>
                <XAxis dataKey="title" stroke="#BFA370" tickLine={false} axisLine={false} hide />
                <YAxis stroke="#BFA370" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,15,15,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <Bar dataKey="revenue" fill="#C9A965" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif">{t('recentActivity')}</h2>
          <Link href="/admin/bookings" className="text-sm text-[#F4D693] hover:underline">
            {t('viewAll')}
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {(overview?.recentActivity || []).length === 0 ? (
            <p className="text-white/50">{t('noRecentBookings')}</p>
          ) : (
            overview?.recentActivity.map((activity, index) => (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm text-white/60">{t('booking')}</p>
                  <p className="text-lg font-medium">
                    {activity.user?.firstName || t('guest')} {activity.user?.lastName || ''}
                  </p>
                  <p className="text-sm text-white/50">
                    {activity.event?.title || t('event')} - {activity.event?.date ? new Date(activity.event.date).toLocaleDateString(locale === 'hr' ? 'hr-HR' : 'en-US') : t('tbd')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    label={activity.paymentStatus || 'pending'}
                    variant={activity.paymentStatus === 'paid' ? 'success' : 'warning'}
                  />
                  <span className="text-lg font-semibold text-[#F4D693]">EUR {activity.amountPaid}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
