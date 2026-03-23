import EventForm from '@/components/admin/events/EventForm';
import { useTranslations } from 'next-intl';

export default function NewEventPage() {
  const t = useTranslations('admin.events');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white/90">{t('addNewEvent')}</h1>
        <p className="text-sm text-white/40">
          {t('newEventDesc')}
        </p>
      </div>
      <EventForm />
    </div>
  );
}
