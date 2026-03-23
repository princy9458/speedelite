"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { Loader2, Calendar, Clock, Users, Euro, Image as ImageIcon, CheckCircle, ShieldCheck } from "lucide-react";
import DateTimePicker from "@/components/admin/form/DateTimePicker";
import PremiumSelect from "@/components/admin/form/PremiumSelect";
import TimePicker from "@/components/admin/form/TimePicker";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import Badge from "@/components/admin/Badge";
import Card from "@/components/admin/Card";
import Tabs from "@/components/admin/Tabs";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

const combineEventDateTime = (date?: string, time?: string) => {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}:00`);
  return Number.isNaN(value.getTime()) ? null : value;
};

const parseDateTimeValue = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getSuggestedBookingDeadline = (eventDate: string, eventTime?: string) => {
  const eventDay = new Date(`${eventDate}T00:00:00`);
  if (Number.isNaN(eventDay.getTime())) return null;

  const suggestion = new Date(eventDay);
  suggestion.setDate(suggestion.getDate() - 1);
  suggestion.setHours(18, 0, 0, 0);

  const now = new Date();
  if (suggestion > now) {
    return suggestion;
  }

  const fallback = new Date(now);
  fallback.setSeconds(0, 0);
  const minutesToAdd = (15 - (fallback.getMinutes() % 15)) % 15;
  fallback.setMinutes(fallback.getMinutes() + minutesToAdd);

  const eventStart = eventTime ? combineEventDateTime(eventDate, eventTime) : null;
  if (eventStart && fallback >= eventStart) {
    const justBeforeEvent = new Date(eventStart);
    justBeforeEvent.setMinutes(justBeforeEvent.getMinutes() - 15, 0, 0);
    return justBeforeEvent;
  }

  return fallback;
};

const toDateTimeFieldValue = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

type EventFormProps = {
  initialData?: any;
  eventId?: string;
};

const formatDate = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateTime = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return toDateTimeFieldValue(date);
};

export default function EventForm({ initialData, eventId }: EventFormProps) {
  const router = useRouter();
  const t = useTranslations('admin.eventForm');
  const locale = useLocale();
  const [activeLanguage, setActiveLanguage] = useState<string>("en");
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);
  const formMode = eventId ? t('updateEvent') : t('createEvent');

  const eventFormSchema = useMemo(() => z
    .object({
      title: z.string().optional().default(""),
      location: z.string().optional().default(""),
      description: z.string().optional().default(""),
      date: z.string().min(1, t('validation.dateRequired')),
      time: z.string().min(1, t('validation.timeRequired')),
      capacity: z.coerce.number().int().min(1, t('validation.capacityRequired')),
      priceMale: z.coerce.number().min(0, t('validation.priceMaleRequired')),
      priceFemale: z.coerce.number().min(0, t('validation.priceFemaleRequired')),
      bookingDeadline: z.string().min(1, t('validation.deadlineRequired')),
      featuredImage: z.string().optional().default(""),
      status: z.enum(["draft", "published"]).default("draft"),
      language: z.string().optional().default("en"),
      translations: z.object({
        en: z.object({
          title: z.string().min(2, t('validation.titleEnRequired')),
          description: z.string().optional().default(""),
          location: z.string().min(2, t('validation.locationEnRequired')),
        }),
        hr: z.object({
          title: z.string().optional().default(""),
          description: z.string().optional().default(""),
          location: z.string().optional().default(""),
        }),
      }),
    })
    .superRefine((values, ctx) => {
      const eventStart = combineEventDateTime(values.date, values.time);
      const deadline = parseDateTimeValue(values.bookingDeadline);
      const now = new Date();

      if (!eventStart || eventStart <= now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["date"],
          message: t('validation.datePast'),
        });
      }

      if (deadline && deadline <= now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bookingDeadline"],
          message: t('validation.deadlinePast'),
        });
      }

      if (eventStart && deadline && deadline >= eventStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bookingDeadline"],
          message: t('validation.deadlineAfterStart'),
        });
      }
    }), [t]);

  type EventFormValues = z.infer<typeof eventFormSchema>;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      location: initialData?.location || "",
      description: initialData?.description || "",
      date: initialData?.date ? formatDate(initialData.date) : "",
      time: initialData?.time || "",
      capacity: initialData?.capacity || 20,
      priceMale: initialData?.priceMale ?? 60,
      priceFemale: initialData?.priceFemale ?? 0,
      bookingDeadline: initialData?.bookingDeadline ? formatDateTime(initialData.bookingDeadline) : "",
      featuredImage: initialData?.featuredImage || "",
      status: initialData?.status || "draft",
      language: initialData?.language || "en",
      translations: {
        en: {
          title: initialData?.translations?.en?.title || initialData?.title || "",
          description: initialData?.translations?.en?.description || initialData?.description || "",
          location: initialData?.translations?.en?.location || initialData?.location || "",
        },
        hr: {
          title: initialData?.translations?.hr?.title || "",
          description: initialData?.translations?.hr?.description || "",
          location: initialData?.translations?.hr?.location || "",
        },
      },
    },
  });

  const eventDate = form.watch("date");
  const eventTime = form.watch("time");
  const bookingDeadline = form.watch("bookingDeadline");
  const eventStart = useMemo(() => combineEventDateTime(eventDate, eventTime), [eventDate, eventTime]);
  const suggestedBookingDeadline = useMemo(() => {
    if (!eventDate) return null;
    const suggestion = getSuggestedBookingDeadline(eventDate, eventTime);
    return suggestion ? toDateTimeFieldValue(suggestion) : null;
  }, [eventDate, eventTime]);
  
  const { setValue, trigger, formState: { errors, isSubmitting, isValid } } = form;

  useEffect(() => {
    if (!eventDate && !eventTime && !bookingDeadline) return;
    void trigger(["date", "time", "bookingDeadline"]);
  }, [bookingDeadline, eventDate, eventTime, trigger]);

  const onSubmit = async (values: EventFormValues) => {
    const payload = {
      ...values,
      title: values.translations.en.title,
      location: values.translations.en.location,
      description: values.translations.en.description || "",
    };

    try {
      const res = await fetch(eventId ? `/api/events/${eventId}` : "/api/events", {
        method: eventId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error?.formErrors?.[0] || t('errorGeneric'));
        return;
      }
      toast.success(eventId ? t('updateSuccess') : t('saveSuccess'));
      router.refresh();
      router.push("/admin/events");
    } catch {
      toast.error(t('errorGeneric'));
    }
  };

  const langKey = activeLanguage as "en" | "hr";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge label={formMode} variant="info" />
          {form.watch("status") === 'published' ? (
            <Badge label="Live" variant="success" />
          ) : (
            <Badge label="Draft" variant="warning" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="px-4 py-2 text-sm font-medium text-white/40 hover:text-white transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {eventId ? t('updateEvent') : t('createEvent')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card 
            title={t('editorialContent')} 
            description={t('editorialDesc')}
            headerAction={
              <Tabs 
                options={[
                  { label: 'English', value: 'en' },
                  { label: 'Croatian', value: 'hr' }
                ]} 
                value={activeLanguage}
                onChange={setActiveLanguage}
              />
            }
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                    {t('eventTitle')} ({activeLanguage.toUpperCase()})
                  </label>
                  <input
                    {...form.register(`translations.${langKey}.title` as const)}
                    placeholder={t('placeholders.title')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white/20 transition-all outline-none"
                  />
                  {errors.translations?.[langKey]?.title && (
                    <p className="text-xs text-rose-400 mt-1">{errors.translations[langKey].title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                    {t('location')} ({activeLanguage.toUpperCase()})
                  </label>
                  <input
                    {...form.register(`translations.${langKey}.location` as const)}
                    placeholder={t('placeholders.location')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white/20 transition-all outline-none"
                  />
                  {errors.translations?.[langKey]?.location && (
                    <p className="text-xs text-rose-400 mt-1">{errors.translations[langKey].location.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                  {t('atmosphereDesc')}
                </label>
                <div className="rounded-xl border border-white/10 bg-white/[0.01] overflow-hidden">
                  <Controller
                    control={form.control}
                    name={`translations.${langKey}.description` as const}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title={t('schedulingLogistics')} description={t('schedulingDesc')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                  <Calendar className="h-3 w-3 text-white/40" />
                  {t('eventDate')}
                </label>
                <Controller
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <DateTimePicker
                      mode="date"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('placeholders.date')}
                      disablePast
                    />
                  )}
                />
                {errors.date && <p className="text-xs text-rose-400">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                  <Clock className="h-3 w-3 text-white/40" />
                  {t('eventTime')}
                </label>
                <Controller
                  control={form.control}
                  name="time"
                  render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
                />
                {errors.time && <p className="text-xs text-rose-400">{errors.time.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                  <Users className="h-3 w-3 text-white/40" />
                  {t('capacity')}
                </label>
                <input
                  type="number"
                  min={1}
                  {...form.register("capacity", { valueAsNumber: true })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white/20 transition-all outline-none"
                />
                {errors.capacity && <p className="text-xs text-rose-400">{errors.capacity.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                  <ShieldCheck className="h-3 w-3 text-rose-400/60" />
                  {t('bookingDeadline')}
                </label>
                <Controller
                  control={form.control}
                  name="bookingDeadline"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <DateTimePicker
                        mode="datetime"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('placeholders.deadline')}
                        disablePast
                        maxDateTime={eventStart ? new Date(eventStart.getTime() - 60 * 1000) : null}
                      />
                      {!field.value && suggestedBookingDeadline && (
                        <button
                          type="button"
                          onClick={() => {
                            setValue("bookingDeadline", suggestedBookingDeadline, { shouldValidate: true });
                            setAppliedSuggestion(true);
                          }}
                          className={cn(
                            "w-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-dashed rounded-lg transition-all",
                            appliedSuggestion 
                              ? "border-emerald-500/50 text-emerald-400/80 bg-emerald-500/5" 
                              : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                          )}
                        >
                          {appliedSuggestion ? t('suggestionApplied') : t('useSuggested')}
                        </button>
                      )}
                    </div>
                  )}
                />
                {errors.bookingDeadline && <p className="text-xs text-rose-400">{errors.bookingDeadline.message}</p>}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8 lg:sticky lg:top-10 self-start">
          <Card title={t('publishingStatus')}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">{t('status')}</label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <PremiumSelect
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      placeholder={t('status')}
                      options={[
                        { label: t('draftPreview'), value: "draft" },
                        { label: t('publishedLive'), value: "published" },
                      ]}
                    />
                  )}
                />
              </div>
              
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs leading-relaxed text-white/40">
                  {t('statusDesc')}
                </p>
              </div>
            </div>
          </Card>

          <Card title={t('monetization')}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                  <Euro className="h-3 w-3 text-sky-400/60" />
                  {t('malePrice')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    {...form.register("priceMale", { valueAsNumber: true })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-white/20 transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold text-xs">€</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                  <Euro className="h-3 w-3 text-rose-400/60" />
                  {t('femalePrice')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    {...form.register("priceFemale", { valueAsNumber: true })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-white/20 transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold text-xs">€</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title={t('visualAssets')}>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest pl-1">
                <ImageIcon className="h-3 w-3 text-white/40" />
                {t('featuredImage')}
              </label>
              <Controller
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <div className="space-y-4">
                    <ImageUploader value={field.value} onChange={field.onChange} />
                    <input
                      placeholder={t('imagePlaceholder')}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>
                )}
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
