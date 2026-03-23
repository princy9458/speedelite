"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import ProgressSteps from "@/components/apply/ProgressSteps";
import ApplySidebar from "@/components/apply/ApplySidebar";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/lib/stores/bookingStore";

function SelectEventContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole, setEventId, role } = useBookingStore();
  const [events, setEvents] = useState<any[]>([]);
  const t = useTranslations('apply');
  const locale = useLocale();

  useEffect(() => {
    // Role is still coming from query param initially from landing page
    const r = searchParams.get("role") === "gentleman" ? "gentleman" : "lady";
    if (r) setRole(r);

    fetch("/api/events?limit=100&status=published")
      .then((res) => res.json())
      .then((data) => setEvents(data.data || []));
  }, [searchParams, setRole]);

  const handleAutoFill = () => {
    if (events.length > 0) {
      setEventId(events[0]._id);
      router.push("/apply/form");
    }
  };

  const getEventTitle = (event: any) =>
    locale === "hr"
      ? event?.translations?.hr?.title || event?.title
      : event?.translations?.en?.title || event?.title;

  const getEventLocation = (event: any) =>
    locale === "hr"
      ? event?.translations?.hr?.location || event?.location
      : event?.translations?.en?.location || event?.location;

  return (
    <div className="mx-auto max-w-[1240px] pb-20">
      <div className="flex flex-col items-center">
        <ProgressSteps steps={t.raw('steps')} currentStep={1} />
        
        <div className="mt-4 flex w-full justify-center">
          <button
            onClick={handleAutoFill}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/40 transition hover:border-[#d5ad5b]/30 hover:bg-white/10 hover:text-[#f0ca7d]"
          >
            <Sparkles className="h-3 w-3 group-hover:animate-pulse" />
            Auto-fill (Testing)
          </button>
        </div>

        <div className="mt-16 flex flex-col items-center space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif text-white sm:text-5xl">{t('sidebar.selectEvent')}</h1>
          </div>
          
          <div className="flex w-full justify-center px-4">
            <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="group relative flex flex-col w-full max-w-sm overflow-hidden rounded-[24px] border border-white/10 bg-[#16130D]/60 text-left transition-all hover:border-[#d5ad5b]/50 hover:shadow-2xl backdrop-blur-xl"
                >
                  <div className="aspect-[4/3] w-full relative">
                    <Image
                      src={event.featuredImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=640&auto=format&fit=crop"}
                      alt={getEventTitle(event)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-serif text-white group-hover:text-[#f0ca7d] transition-colors line-clamp-1">
                      {getEventTitle(event)}
                    </h3>
                    
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <Calendar className="h-4 w-4 text-[#d5ad5b]" />
                        <span>{new Date(event.date).toLocaleDateString(locale === 'hr' ? 'hr-HR' : 'en-US')} {event.time}h</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <MapPin className="h-4 w-4 text-[#d5ad5b]" />
                        <span className="truncate">{getEventLocation(event)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEventId(event._id);
                        router.push("/apply/form");
                      }}
                      className="mt-auto w-full rounded-[12px] bg-[linear-gradient(135deg,#E7C873,#D4AF37)] py-3.5 text-sm font-bold text-black shadow-lg transition-all hover:brightness-105 active:scale-[0.98]"
                    >
                      {t('sidebar.apply')}
                    </button>
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <div className="col-span-full rounded-2xl border border-white/10 bg-black/40 p-12 text-center text-white/30 backdrop-blur-xl">
                   <p>{t('emptyEvent.description')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
