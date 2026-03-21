import EventForm from '@/components/admin/events/EventForm';

export default function NewEventPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Add New Event</h1>
        <p className="text-sm text-white/40">
          Define the details and schedule for your upcoming elite event experience.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
