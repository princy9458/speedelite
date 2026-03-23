"use client";

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { CalendarDays, Filter, Search } from 'lucide-react';
import Badge from '@/components/admin/Badge';
import GlassCard from '@/components/admin/GlassCard';
import { useTranslations, useLocale } from 'next-intl';

type Booking = {
  _id: string;
  bookingNumber: string;
  createdAt: string;
  amountPaid: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  userDetails?: { firstName?: string; lastName?: string; email?: string };
  event?: {
    _id: string;
    title?: string;
    time?: string;
    date?: string;
    translations?: {
      en?: { title?: string };
      hr?: { title?: string };
    };
  };
};

type EventOption = {
  _id: string;
  title?: string;
  translations?: {
    en?: { title?: string };
    hr?: { title?: string };
  };
};

const getStatusVariant = (status: Booking['paymentStatus']) => {
  if (status === 'paid') return 'success';
  if (status === 'failed') return 'danger';
  if (status === 'refunded') return 'info';
  return 'warning';
};

export default function BookingsAdmin() {
  const t = useTranslations('admin.bookings');
  const locale = useLocale();
  const dateLocale = locale === 'hr' ? 'hr-HR' : 'en-US';
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    eventId: '',
    paymentStatus: 'all',
    date: '',
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch('/api/events?limit=100')
      .then((res) => res.json())
      .then((data) => setEvents(data.data || []));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((current) => ({ ...current, search: searchInput, page: 1 }));
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.eventId) params.set('eventId', filters.eventId);
    if (filters.paymentStatus && filters.paymentStatus !== 'all') params.set('paymentStatus', filters.paymentStatus);
    if (filters.date) params.set('date', filters.date);
    params.set('page', String(filters.page));
    params.set('limit', String(filters.limit));

    setIsLoading(true);
    fetch(`/api/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setIsLoading(false));
  }, [filters]);

  const getEventTitle = (event?: Booking['event'] | EventOption) => {
    if (!event) return '-';
    const titles = event.translations as any;
    return titles?.[locale]?.title || event.title || '-';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{t('eyebrow')}</p>
          <h1 className="text-4xl font-serif gold-text">{t('title')}</h1>
        </div>
        <div className="rounded-full border border-[#F4D693]/20 bg-[#F4D693]/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#F4D693]">
          {t('totalResults')}: {total}
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.7fr))]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/55">
            <Search className="h-4 w-4 text-[#F4D693]" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F4D693]" />
            <select
              value={filters.eventId}
              onChange={(event) => setFilters((current) => ({ ...current, eventId: event.target.value, page: 1 }))}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white/75 focus:border-[#F4D693]/60 focus:outline-none"
            >
              <option value="">{t('filterEvent')}</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {getEventTitle(event)}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F4D693]" />
            <select
              value={filters.paymentStatus}
              onChange={(event) =>
                setFilters((current) => ({ ...current, paymentStatus: event.target.value, page: 1 }))
              }
              className="w-full appearance-none rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white/75 focus:border-[#F4D693]/60 focus:outline-none"
            >
              <option value="all">{t('filterStatus')}</option>
              <option value="pending">{t('statuses.pending')}</option>
              <option value="paid">{t('statuses.paid')}</option>
              <option value="failed">{t('statuses.failed')}</option>
              <option value="refunded">{t('statuses.refunded')}</option>
            </select>
          </div>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F4D693]" />
            <input
              type="date"
              value={filters.date}
              onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value, page: 1 }))}
              className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white/75 focus:border-[#F4D693]/60 focus:outline-none"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50 uppercase tracking-widest text-xs">
              <tr>
                <th className="p-4">{t('table.user')}</th>
                <th className="p-4">{t('table.event')}</th>
                <th className="p-4">{t('table.bookingNumber')}</th>
                <th className="p-4">{t('table.paymentStatus')}</th>
                <th className="p-4">{t('table.amount')}</th>
                <th className="p-4">{t('table.date')}</th>
                <th className="p-4 text-right">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="group border-t border-white/5 transition-colors hover:bg-white/[0.04]">
                  <td className="p-4">
                    <p className="font-semibold text-white">
                      {booking.userDetails?.firstName || '-'} {booking.userDetails?.lastName || ''}
                    </p>
                    <p className="text-xs text-white/45">{booking.userDetails?.email || '-'}</p>
                  </td>
                  <td className="p-4 text-white/60">
                    <p className="font-medium text-white">{getEventTitle(booking.event)}</p>
                    <p className="text-xs text-white/45">
                      {booking.event?.date ? new Date(booking.event.date).toLocaleDateString(dateLocale) : '-'} {booking.event?.time || ''}
                    </p>
                  </td>
                  <td className="p-4 text-[#F4D693]">{booking.bookingNumber}</td>
                  <td className="p-4">
                    <Badge
                      label={t(`statuses.${booking.paymentStatus}`) || booking.paymentStatus}
                      variant={getStatusVariant(booking.paymentStatus)}
                    />
                  </td>
                  <td className="p-4 text-white/70">EUR {booking.amountPaid}</td>
                  <td className="p-4 text-white/50">{new Date(booking.createdAt).toLocaleDateString(dateLocale)}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/bookings/${booking._id}`}
                      className="text-sm text-[#F4D693] opacity-75 transition group-hover:opacity-100 hover:underline"
                    >
                      {t('view')}
                    </Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/50">
                    {t('empty')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between text-sm text-white/55">
        <span>
          {t('totalResults')}: {total}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, page: Math.max(current.page - 1, 1) }))}
            disabled={filters.page <= 1}
            className="rounded-xl border border-white/10 px-4 py-2 transition hover:border-[#F4D693]/40 disabled:opacity-40"
          >
            {t('previous')}
          </button>
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, page: Math.min(current.page + 1, totalPages) }))}
            disabled={filters.page >= totalPages}
            className="rounded-xl border border-white/10 px-4 py-2 transition hover:border-[#F4D693]/40 disabled:opacity-40"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}
