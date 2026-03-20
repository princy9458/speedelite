import EventForm from '@/components/admin/events/EventForm';

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div className="obsidian-panel rounded-[30px] px-6 py-6 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#F2CA50]/55">Create</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#f4edd9] md:text-5xl">Add New Event</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
          Compose an experience that feels deliberate, premium, and ready for a high-trust booking journey.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
