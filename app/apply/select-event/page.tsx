"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import ProgressSteps from "@/components/apply/ProgressSteps";
import ApplySidebar from "@/components/apply/ApplySidebar";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { Suspense } from "react";

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
<<<<<<< HEAD
    <div className="space-y-12">
      <ProgressSteps steps={t.apply.steps} currentStep={1} />
      
      <div className="rounded-[32px] bg-[#1a1a1a]/40 backdrop-blur-3xl p-8 space-y-8 border-t border-white/[0.05] shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Step 1</p>
          <h1 className="mt-2 text-4xl font-serif text-white">{t.apply.steps[0]}</h1>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => {
                setEventId(event._id);
                router.push("/apply/form");
              }}
              className="group text-left rounded-[28px] bg-white/[0.03] overflow-hidden hover:bg-white/[0.06] transition-all duration-500 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)] flex flex-col h-full border-t border-white/[0.02] relative"
            >
              <div className="h-44 w-full relative overflow-hidden">
                <Image
                  src={event.featuredImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=640&auto=format&fit=crop"}
                  alt={getEventTitle(event)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={events.indexOf(event) < 3}
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-5">
                   <div className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">Upcoming Event</div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl font-serif text-[#E5E2E1] group-hover:text-[#F2CA50] transition-colors leading-tight">{getEventTitle(event)}</h3>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#E5E2E1]/50">
                      <Calendar className="h-3.5 w-3.5 text-[#D4AF37]/70" />
                      <span className="tracking-wide">{new Date(event.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#E5E2E1]/50">
                      <Clock className="h-3.5 w-3.5 text-[#D4AF37]/70" />
                      <span className="tracking-wide">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#E5E2E1]/50">
                      <MapPin className="h-3.5 w-3.5 text-[#D4AF37]/70" />
                      <span className="truncate tracking-wide">{getEventLocation(event)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                   <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-extrabold transition-all group-hover:gap-3">
                     Select Event
                     <div className="h-px w-6 bg-[#D4AF37]/30 transition-all group-hover:w-10 group-hover:bg-[#D4AF37]" />
                   </div>
                </div>
              </div>
            </button>
          ))}
          {events.length === 0 ? (
            <div className="rounded-[28px] bg-white/[0.03] p-8 text-[#E5E2E1]/40 text-sm italic font-serif">
              {t.apply.emptyEvent.description}
            </div>
          ) : null}
=======
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
>>>>>>> 31490afb0a8ab539e02129142ec0b15d0a9b92fe
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
<<<<<<< HEAD
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
      </div>
    }>
=======
    <Suspense fallback={<div>Loading...</div>}>
>>>>>>> 31490afb0a8ab539e02129142ec0b15d0a9b92fe
      <SelectEventContent />
    </Suspense>
  );
}
