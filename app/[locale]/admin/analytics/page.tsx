"use client";

import { useEffect, useState } from 'react';
import GlassCard from '@/components/admin/GlassCard';
import { useTranslations, useLocale } from 'next-intl';

export default function AnalyticsAdmin() {
  const t = useTranslations('admin.analytics');
  const locale = useLocale();
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/events?limit=100').then((res) => res.json()),
      fetch('/api/bookings?limit=200').then((res) => res.json()),
    ]).then(([eventsData, bookingsData]) => {
      setEvents(eventsData.data || []);
      setBookings(bookingsData.data || []);
    });
  }, []);

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalBookings = bookings.length;
  const activeEvents = events.filter((event) => event.status === 'published').length;

  const eventStats = events.map((event) => {
    const eventBookings = bookings.filter((b) => b.event?._id === event._id);
    const revenue = eventBookings.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
    const maleBookings = eventBookings.filter((b) => b.user?.gender === 'gent').length;
    const femaleBookings = eventBookings.filter((b) => b.user?.gender === 'lady').length;

    return {
      ...event,
      totalBookings: eventBookings.length,
      revenue,
      maleBookings,
      femaleBookings,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">{t('eyebrow')}</p>
        <h1 className="text-4xl font-serif gold-text">{t('title')}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard className="p-6">
          <p className="text-white/50 text-sm uppercase tracking-wider mb-2">{t('totalRevenue')}</p>
          <p className="text-3xl font-serif">EUR {totalRevenue}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-white/50 text-sm uppercase tracking-wider mb-2">{t('totalBookings')}</p>
          <p className="text-3xl font-serif">{totalBookings}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-white/50 text-sm uppercase tracking-wider mb-2">{t('publishedEvents')}</p>
          <p className="text-3xl font-serif">{activeEvents}</p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50 uppercase tracking-widest text-xs">
            <tr>
              <th className="p-4">{t('table.event')}</th>
              <th className="p-4">{t('table.date')}</th>
              <th className="p-4">{t('table.bookings')}</th>
              <th className="p-4">{t('table.genderRatio')}</th>
              <th className="p-4">{t('table.revenue')}</th>
            </tr>
          </thead>
          <tbody>
            {eventStats.map((stat) => (
              <tr key={stat._id} className="border-t border-white/5">
                <td className="p-4 font-semibold">{stat.title}</td>
                <td className="p-4 text-white/60">{new Date(stat.date).toLocaleDateString(locale)}</td>
                <td className="p-4 text-white/60">
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#F4D693] h-2 rounded-full"
                      style={{ width: `${Math.min((stat.totalBookings / stat.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-white/50 mt-1 block">{stat.totalBookings} / {stat.capacity}</span>
                </td>
                <td className="p-4 text-white/70">
                  <span className="text-blue-400">{stat.maleBookings}M</span> / <span className="text-pink-400">{stat.femaleBookings}F</span>
                </td>
                <td className="p-4 font-semibold text-[#F4D693]">EUR {stat.revenue}</td>
              </tr>
            ))}
            {eventStats.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/50">
                  {t('noAnalytics')}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
