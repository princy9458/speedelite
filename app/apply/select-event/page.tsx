"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import ProgressSteps from "@/components/apply/ProgressSteps";
import ApplySidebar from "@/components/apply/ApplySidebar";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";

function SelectEventContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole, setLang, setEventId, lang, role } = useBookingStore();
  const [events, setEvents] = useState<any[]>([]);
  const t = getDictionary(lang);

  useEffect(() => {
    const r = searchParams.get("role") === "gent" ? "gent" : "lady";
    const l = searchParams.get("lang") === "hr" ? "hr" : "en";
    if (r) setRole(r);
    if (l) setLang(l);

    fetch("/api/events?limit=100&status=published")
      .then((res) => res.json())
      .then((data) => setEvents(data.data || []));
  }, [searchParams, setRole, setLang, role]);

  const handleAutoFill = () => {
    if (events.length > 0) {
      setEventId(events[0]._id);
      router.push("/apply/form");
    }
  };

  const getEventTitle = (event: any) =>
    lang === "hr"
      ? event?.translations?.hr?.title || event?.title
      : event?.translations?.en?.title || event?.title;

  const getEventLocation = (event: any) =>
    lang === "hr"
      ? event?.translations?.hr?.location || event?.location
      : event?.translations?.en?.location || event?.location;

  return (
    <div className="mx-auto max-w-[1240px] space-y-12 pb-20">
      <ProgressSteps steps={t.apply.steps} currentStep={1} />
      
      <div className="flex justify-end">
        <button
          onClick={handleAutoFill}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/40 transition hover:border-[#d5ad5b]/30 hover:bg-white/10 hover:text-[#f0ca7d]"
        >
          <Sparkles className="h-3 w-3 group-hover:animate-pulse" />
          Auto-fill (Testing)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] items-start">
        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]/60">Step 1</p>
            <h1 className="text-4xl font-serif text-white">{t.apply.steps[0]}</h1>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {events.map((event) => (
              <button
                key={event._id}
                onClick={() => {
                  setEventId(event._id);
                  router.push("/apply/form");
                }}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-black/40 text-left transition-all hover:border-[#d5ad5b]/50 hover:shadow-2xl"
              >
                <div className="aspect-video w-full relative">
                  <Image
                    src={event.featuredImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=640&auto=format&fit=crop"}
                    alt={getEventTitle(event)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                     <span className="rounded-full bg-[#d5ad5b] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black">
                       Upcoming
                     </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-serif text-white group-hover:text-[#f0ca7d] transition-colors line-clamp-1">
                    {getEventTitle(event)}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <Calendar className="h-3.5 w-3.5 text-[#d5ad5b]" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <Clock className="h-3.5 w-3.5 text-[#d5ad5b]" />
                      <span>{event.time}h</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <MapPin className="h-3.5 w-3.5 text-[#d5ad5b]" />
                      <span className="truncate">{getEventLocation(event)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {events.length === 0 && (
              <div className="col-span-full rounded-2xl border border-white/10 bg-black/40 p-12 text-center text-white/30 backdrop-blur-xl">
                 <p>{t.apply.emptyEvent.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Universal Sticky Sidebar */}
        <aside className="sticky top-24">
          <ApplySidebar />
        </aside>
      </div>
    </div>
  );
}

export default function SelectEventPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
      </div>
    }>
      <SelectEventContent />
    </Suspense>
  );
}
