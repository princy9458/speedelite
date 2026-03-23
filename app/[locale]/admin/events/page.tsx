"use client";

import { useEffect, useMemo, useState } from 'react';
import { Link } from '@/i18n/routing';
import { Search, Trash2 } from 'lucide-react';
import GlassCard from '@/components/admin/GlassCard';
import Badge from '@/components/admin/Badge';
import { useAdminUiStore } from '@/lib/stores/adminUi';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';

type EventRow = {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  priceMale: number;
  priceFemale: number;
  status: 'draft' | 'published';
};

export default function EventsAdmin() {
  const { eventFilters, setEventFilters } = useAdminUiStore();
  const t = useTranslations('admin.events');
  const locale = useLocale();
  const dateLocale = locale === 'hr' ? 'hr-HR' : 'en-US';
  
  const [events, setEvents] = useState<EventRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState(eventFilters.search);
  const [isLoading, setIsLoading] = useState(false);
  const [quickEditEvent, setQuickEditEvent] = useState<EventRow | null>(null);
  const [quickEditValues, setQuickEditValues] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    status: "draft",
  });

  const formatDate = (value: string | Date) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEventFilters({ search: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput, setEventFilters]);

  useEffect(() => {
    const params = new URLSearchParams({
      search: eventFilters.search,
      status: eventFilters.status,
      sortBy: eventFilters.sortBy,
      sortOrder: eventFilters.sortOrder,
      page: String(eventFilters.page),
      limit: String(eventFilters.limit),
    });

    setIsLoading(true);
    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data || []);
        setTotalPages(data.totalPages || 1);
        setSelectedIds([]);
      })
      .finally(() => setIsLoading(false));
  }, [eventFilters]);

  const allSelected = useMemo(
    () => events.length > 0 && selectedIds.length === events.length,
    [events, selectedIds]
  );

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : events.map((event) => event._id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(t('bulkDeleteConfirm', { count: selectedIds.length }))) return;
    await fetch('/api/events/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    toast.success(t('deleteSuccess'));
    setEventFilters({ page: 1 });
  };

  const toggleStatus = async (event: EventRow) => {
    const nextStatus = event.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/events/${event._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    setEventFilters({ page: eventFilters.page });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('deleteSuccess'));
    } else {
      toast.error(t('deleteError'));
    }
    setEventFilters({ page: 1 });
  };

  const openQuickEdit = (event: EventRow) => {
    setQuickEditEvent(event);
    setQuickEditValues({
      title: event.title,
      date: formatDate(event.date),
      time: event.time,
      location: event.location,
      status: event.status,
    });
  };

  const saveQuickEdit = async () => {
    if (!quickEditEvent) return;
    const res = await fetch(`/api/events/${quickEditEvent._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quickEditValues.title,
        location: quickEditValues.location,
        date: quickEditValues.date,
        time: quickEditValues.time,
        status: quickEditValues.status,
        translations: {
          [locale]: {
            title: quickEditValues.title,
            location: quickEditValues.location,
          },
        },
      }),
    });
    if (res.ok) {
      toast.success(t('updateSuccess'));
    } else {
      toast.error(t('updateError'));
    }
    setQuickEditEvent(null);
    setEventFilters({ page: eventFilters.page });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{t('eyebrow')}</p>
          <h1 className="text-4xl font-serif gold-text">{t('title')}</h1>
        </div>
        <Link href="/admin/events/new" className="gold-gradient text-black font-bold py-3 px-6 rounded-xl text-sm uppercase tracking-widest">
          {t('addEvent')}
        </Link>
      </div>

      <GlassCard className="p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white/50">
            <Search className="h-4 w-4" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent text-sm text-white/70 focus:outline-none"
              placeholder={t('searchPlaceholder')}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={eventFilters.status}
              onChange={(e) => setEventFilters({ status: e.target.value as any, page: 1 })}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="draft">{t('draft')}</option>
              <option value="published">{t('published')}</option>
            </select>
            <select
              value={`${eventFilters.sortBy}:${eventFilters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(':');
                setEventFilters({ sortBy: sortBy as any, sortOrder: sortOrder as any });
              }}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
            >
              <option value="date:asc">{t('dateSoonest')}</option>
              <option value="date:desc">{t('dateLatest')}</option>
              <option value="createdAt:desc">{t('newest')}</option>
              <option value="title:asc">{t('titleAZ')}</option>
            </select>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-rose-200 hover:text-rose-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {t('bulkDelete')}
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50 uppercase tracking-widest text-xs">
              <tr>
                <th className="p-4">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                <th className="p-4">{t('table.title')}</th>
                <th className="p-4">{t('table.date')}</th>
                <th className="p-4">{t('table.location')}</th>
                <th className="p-4">{t('table.capacity')}</th>
                <th className="p-4">{t('table.pricing')}</th>
                <th className="p-4">{t('table.status')}</th>
                <th className="p-4 text-right">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t border-white/5 group transition-colors hover:bg-white/5">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(event._id)}
                      onChange={() => toggleSelect(event._id)}
                    />
                  </td>
                  <td className="p-4 font-medium">{event.title}</td>
                  <td className="p-4 text-white/60">
                    {new Date(event.date).toLocaleDateString(dateLocale)} - {event.time}
                  </td>
                  <td className="p-4 text-white/60">{event.location}</td>
                  <td className="p-4 text-white/60">{event.capacity}</td>
                  <td className="p-4 text-white/60">EUR {event.priceMale} / EUR {event.priceFemale}</td>
                  <td className="p-4">
                    <button onClick={() => toggleStatus(event)}>
                      <Badge
                        label={t(event.status)}
                        variant={event.status === 'published' ? 'success' : 'warning'}
                      />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link href={`/admin/events/${event._id}`} className="text-[#F4D693] hover:underline">
                        {t('edit')}
                      </Link>
                      <button onClick={() => openQuickEdit(event)} className="text-white/70 hover:underline">
                        {t('quickEdit')}
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="text-rose-300 hover:underline">
                        {t('trash')}
                      </button>
                      <Link href={`/events/${event._id}`} className="text-white/50 hover:underline" target="_blank">
                        {t('view')}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="space-y-3 text-white/60">
                      <p>{t('noEvents')}</p>
                      <Link
                        href="/admin/events/new"
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-[#F4D693] hover:bg-white/5"
                      >
                        {t('addEvent')}
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between text-sm text-white/50">
        <span>
          {t('pageOf', { page: eventFilters.page, totalPages: totalPages })}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setEventFilters({ page: Math.max(eventFilters.page - 1, 1) })}
            disabled={eventFilters.page <= 1}
            className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-40"
          >
            {t('previous')}
          </button>
          <button
            onClick={() => setEventFilters({ page: Math.min(eventFilters.page + 1, totalPages) })}
            disabled={eventFilters.page >= totalPages}
            className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-40"
          >
            {t('next')}
          </button>
        </div>
      </div>

      {quickEditEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="glass-card w-full max-w-2xl rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif">{t('quickEdit')}</h2>
              <button onClick={() => setQuickEditEvent(null)} className="text-white/60 hover:text-white">
                {t('close')}
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={quickEditValues.title}
                onChange={(e) => setQuickEditValues({ ...quickEditValues, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
                placeholder={t('table.title')}
              />
              <input
                value={quickEditValues.location}
                onChange={(e) => setQuickEditValues({ ...quickEditValues, location: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
                placeholder={t('table.location')}
              />
              <input
                type="date"
                value={quickEditValues.date}
                onChange={(e) => setQuickEditValues({ ...quickEditValues, date: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
              />
              <input
                type="time"
                value={quickEditValues.time}
                onChange={(e) => setQuickEditValues({ ...quickEditValues, time: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
              />
              <select
                value={quickEditValues.status}
                onChange={(e) => setQuickEditValues({ ...quickEditValues, status: e.target.value as any })}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
              >
                <option value="draft">{t('draft')}</option>
                <option value="published">{t('published')}</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setQuickEditEvent(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60"
              >
                {t('cancel')}
              </button>
              <button
                onClick={saveQuickEdit}
                className="gold-gradient rounded-xl px-5 py-2 text-sm font-bold text-black"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
