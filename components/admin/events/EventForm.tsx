"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DateTimePicker from "@/components/admin/form/DateTimePicker";
import PremiumSelect from "@/components/admin/form/PremiumSelect";
import TimePicker from "@/components/admin/form/TimePicker";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";

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

const eventFormSchema = z
  .object({
    title: z.string().optional().default(""),
    location: z.string().optional().default(""),
    description: z.string().optional().default(""),
    date: z.string().min(1, "Event date is required"),
    time: z.string().min(1, "Event time is required"),
    capacity: z.coerce.number().int().min(1, "Capacity is required"),
    priceMale: z.coerce.number().min(0, "Price male is required"),
    priceFemale: z.coerce.number().min(0, "Price female is required"),
    bookingDeadline: z.string().min(1, "Booking date time is required"),
    featuredImage: z.string().optional().default(""),
    status: z.enum(["draft", "published"]).default("draft"),
    language: z.string().optional().default("en"),
    translations: z.object({
      en: z.object({
        title: z.string().min(2, "English title is required"),
        description: z.string().optional().default(""),
        location: z.string().min(2, "English location is required"),
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
        message: "Event date cannot be in the past",
      });
    }

    if (deadline && deadline <= now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bookingDeadline"],
        message: "Booking deadline cannot be in the past",
      });
    }

    if (eventStart && deadline && deadline >= eventStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bookingDeadline"],
        message: "Booking must close before event starts",
      });
    }
  });

type EventFormValues = z.infer<typeof eventFormSchema>;

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

const formatSuggestionDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function EventForm({ initialData, eventId }: EventFormProps) {
  const router = useRouter();
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hr">("en");
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);
  const formMode = eventId ? "Update" : "Create";

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
  const { setValue, trigger } = form;

  useEffect(() => {
    if (!eventDate && !eventTime && !bookingDeadline) return;
    void trigger(["date", "time", "bookingDeadline"]);
  }, [bookingDeadline, eventDate, eventTime, trigger]);

  useEffect(() => {
    if (!appliedSuggestion) return;

    const timeoutId = window.setTimeout(() => {
      setAppliedSuggestion(false);
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [appliedSuggestion]);

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
        toast.error(data?.error?.formErrors?.[0] || "Failed to save event");
        return;
      }
      toast.success(eventId ? "Event updated" : "Event created");
      router.push("/admin/events");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const langKey = activeLanguage;
  const cardClass = "obsidian-panel relative overflow-hidden rounded-[34px] p-6 md:p-8 lg:p-9";
  const fieldLabelClass = "text-[11px] uppercase tracking-[0.28em] text-white/40";
  const inputClass = "obsidian-input min-h-[56px] w-full px-4 py-3 text-[15px]";
  const panelEyebrowClass = "text-[11px] uppercase tracking-[0.32em] text-[#F2CA50]/55";
  const panelTitleClass = "font-serif text-[2rem] tracking-[-0.04em] text-[#f4edd9] md:text-[2.2rem]";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-14">
      <div className="pointer-events-none absolute inset-x-0 top-24 h-80 bg-[radial-gradient(circle_at_20%_20%,rgba(242,202,80,0.08),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.03),transparent_26%)]" />
      <section className="obsidian-panel relative overflow-hidden rounded-[36px] px-6 py-8 md:px-9 md:py-10 xl:mr-6">
        <div className="absolute -right-8 top-4 h-32 w-32 rounded-full bg-[#F2CA50]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-40 bg-[linear-gradient(90deg,rgba(242,202,80,0.08),transparent)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className={panelEyebrowClass}>{formMode} Experience</p>
            <div className="space-y-2">
              <h2 className="font-serif text-[2.6rem] leading-[0.96] tracking-[-0.05em] text-[#f4edd9] md:text-[3.9rem]">
                Event Curation Suite
              </h2>
              <p className="max-w-xl text-[15px] leading-8 text-white/58 md:text-base">
                Shape every detail of the evening with a rich editorial layout, polished scheduling, and translation-aware content.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[420px] xl:translate-y-5">
            <div className="obsidian-surface rounded-[26px] px-5 py-5 sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Signature</p>
              <p className="mt-2 max-w-sm text-sm leading-7 text-[#f4edd9]">
                A luxury event workspace for editorial content, polished pricing, and precise release timing.
              </p>
            </div>
            <div className="obsidian-surface rounded-[24px] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Publishing</p>
              <p className="mt-2 text-sm text-[#f4edd9]">{form.watch("status") === "published" ? "Ready to go live" : "Refining in draft"}</p>
            </div>
            <div className="obsidian-surface rounded-[24px] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Language</p>
              <p className="mt-2 text-sm text-[#f4edd9]">{activeLanguage === "en" ? "English primary" : "Croatian variant"}</p>
            </div>
            <div className="obsidian-surface rounded-[24px] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Form State</p>
              <p className="mt-2 text-sm text-[#f4edd9]">{form.formState.isValid ? "Validated" : "Needs attention"}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
        <div className="space-y-10 xl:col-span-7 xl:pr-6">
          <section className={cardClass}>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-lg space-y-2">
                <p className={panelEyebrowClass}>Editorial Details</p>
                <h3 className={panelTitleClass}>Set the story for the event</h3>
                <p className="text-sm leading-7 text-white/55">
                  Use layered content and timing controls to make the event feel intentional from first glance to final booking.
                </p>
              </div>
              <div className="obsidian-surface inline-flex w-full max-w-sm flex-wrap gap-2 rounded-[26px] p-2.5 md:translate-x-4">
                <button
                  type="button"
                  onClick={() => setActiveLanguage("en")}
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${activeLanguage === "en" ? "obsidian-chip-active" : "obsidian-chip"}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguage("hr")}
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${activeLanguage === "hr" ? "obsidian-chip-active" : "obsidian-chip"}`}
                >
                  Croatian
                </button>
              </div>
            </div>

            <div className="mt-10 grid gap-x-6 gap-y-6 md:grid-cols-2">
              <div className="space-y-2 md:translate-y-2">
                <label className={fieldLabelClass}>Title</label>
                <input
                  {...form.register(`translations.${langKey}.title` as const)}
                  className={inputClass}
                  placeholder="Elite Speed Dating"
                />
                {form.formState.errors.translations?.[langKey]?.title ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.translations?.[langKey]?.title?.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className={fieldLabelClass}>Location</label>
                <input
                  {...form.register(`translations.${langKey}.location` as const)}
                  className={inputClass}
                  placeholder="Zagreb, Croatia"
                />
                {form.formState.errors.translations?.[langKey]?.location ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.translations?.[langKey]?.location?.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className={fieldLabelClass}>Event Date</label>
                <Controller
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <DateTimePicker
                      mode="date"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select event date"
                      disablePast
                    />
                  )}
                />
                {form.formState.errors.date ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.date.message}</p>
                ) : null}
              </div>
              <div className="space-y-2 md:translate-y-3">
                <label className={fieldLabelClass}>Event Time</label>
                <Controller
                  control={form.control}
                  name="time"
                  render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
                />
                {form.formState.errors.time ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.time.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className={fieldLabelClass}>Event Capacity</label>
                <input
                  type="number"
                  min={1}
                  {...form.register("capacity", { valueAsNumber: true })}
                  className={inputClass}
                />
                {form.formState.errors.capacity ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.capacity.message}</p>
                ) : null}
              </div>
              <div className="space-y-2 md:-translate-y-2">
                <label className={fieldLabelClass}>Booking Date Time</label>
                <Controller
                  control={form.control}
                  name="bookingDeadline"
                  render={({ field }) => {
                    const showSuggestion = !field.value && !!suggestedBookingDeadline;

                    return (
                      <div className="space-y-3">
                        <DateTimePicker
                          mode="datetime"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select booking close time"
                          disablePast
                          helperText="Booking closes before the event starts"
                          maxDateTime={eventStart ? new Date(eventStart.getTime() - 60 * 1000) : null}
                          minDateTime={new Date()}
                        />
                        {showSuggestion ? (
                          <div
                            className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm transition-all duration-300 ${
                              appliedSuggestion ? "translate-x-1 text-[#f7db88]" : "text-[#F2CA50]/72"
                            }`}
                          >
                            <span className="text-white/42">Suggested:</span>
                            <span>{formatSuggestionDateTime(suggestedBookingDeadline)}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setValue("bookingDeadline", suggestedBookingDeadline, {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                });
                                setAppliedSuggestion(true);
                              }}
                              className="ml-1 text-xs uppercase tracking-[0.22em] text-[#f4edd9]/72 transition hover:text-[#fff3d0] focus:outline-none"
                            >
                              {appliedSuggestion ? "Applied" : "Apply"}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  }}
                />
                {form.formState.errors.bookingDeadline ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.bookingDeadline.message}</p>
                ) : null}
              </div>
            </div>
          </section>

          <section className={`${cardClass} xl:translate-x-10`}>
            <div className="absolute right-0 top-10 h-28 w-28 rounded-full bg-[#F2CA50]/5 blur-3xl" />
            <div className="space-y-2">
              <p className={panelEyebrowClass}>Monetisation</p>
              <h3 className={panelTitleClass}>Price the experience with clarity</h3>
            </div>
            <div className="mt-8 grid gap-x-6 gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className={fieldLabelClass}>Event Price Male</label>
                <input
                  type="number"
                  min={0}
                  {...form.register("priceMale", { valueAsNumber: true })}
                  className={inputClass}
                />
                {form.formState.errors.priceMale ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.priceMale.message}</p>
                ) : null}
              </div>
              <div className="space-y-2 md:translate-y-3">
                <label className={fieldLabelClass}>Event Price Female</label>
                <input
                  type="number"
                  min={0}
                  {...form.register("priceFemale", { valueAsNumber: true })}
                  className={inputClass}
                />
                {form.formState.errors.priceFemale ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.priceFemale.message}</p>
                ) : null}
              </div>
            </div>
          </section>

          <section className={`${cardClass} md:translate-x-4 xl:-translate-x-3`}>
            <div className="absolute bottom-2 left-3 h-24 w-24 rounded-full bg-white/5 blur-3xl" />
            <div className="space-y-2">
              <p className={panelEyebrowClass}>Narrative</p>
              <h3 className={panelTitleClass}>Describe the atmosphere</h3>
            </div>
            <div className="mt-8">
              <Controller
                control={form.control}
                name={`translations.${langKey}.description` as const}
                render={({ field }) => <RichTextEditor value={field.value || ""} onChange={field.onChange} />}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-8 xl:col-span-5 xl:pt-16">
          <section className={`${cardClass} xl:sticky xl:top-24 xl:-ml-4`}>
            <div className="absolute -left-10 top-14 h-32 w-32 rounded-full bg-[#F2CA50]/6 blur-3xl" />
            <div className="space-y-8">
              <div className="space-y-2">
                <p className={panelEyebrowClass}>Release Control</p>
                <h3 className={panelTitleClass}>Finalize the presentation</h3>
              </div>

              <div className="obsidian-surface rounded-[28px] p-6">
                <label className={fieldLabelClass}>Status</label>
                <div className="mt-3">
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <PremiumSelect
                        value={field.value}
                        onChange={(nextValue) => field.onChange(nextValue as "draft" | "published")}
                        placeholder="Select status"
                        options={[
                          { label: "Draft", value: "draft" },
                          { label: "Published", value: "published" },
                        ]}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="obsidian-surface rounded-[28px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className={fieldLabelClass}>Featured Image</p>
                    <p className="text-sm leading-7 text-white/50">
                      Build anticipation with a striking image that sets the tone before guests ever click through.
                    </p>
                  </div>
                  <span className="obsidian-chip rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em]">Visual</span>
                </div>
                <div className="mt-5">
                  <Controller
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <div className="space-y-4">
                        <ImageUploader value={field.value} onChange={field.onChange} />
                        <input
                          type="text"
                          placeholder="Or paste image URL"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="obsidian-surface rounded-[28px] p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/events")}
                    className="obsidian-ghost-button rounded-[1.1rem] px-5 py-4 text-sm font-medium uppercase tracking-[0.22em]"
                  >
                    Back to List
                  </button>
                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                    className="obsidian-primary-button rounded-[1.1rem] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Event"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
