"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventForm from '@/components/admin/events/EventForm';
import { useTranslations } from 'next-intl';

export default function EditEventPage() {
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations('admin.events');
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then(setEvent);
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="obsidian-panel rounded-[30px] px-6 py-6 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#F2CA50]/55">{t('editLabel')}</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#f4edd9] md:text-5xl">{t('updateEvent')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
          {t('editEventDesc')}
        </p>
      </div>
      {event ? <EventForm eventId={id} initialData={event} /> : <p className="text-white/60">{t('loading')}</p>}
    </div>
  );
}
