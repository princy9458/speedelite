"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, ChevronDown, Loader2, Paperclip, Upload, X, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import ProgressSteps from "@/components/apply/ProgressSteps";
import EventSummaryCard from "@/components/apply/EventSummaryCard";
import PortalPopover from "@/components/admin/form/PortalPopover";
import {
  applicationFormFields,
  type ApplicationFieldConfig,
  type ApplicationFieldId,
} from "@/lib/forms/application-form";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore, type BookingFormData } from "@/lib/stores/bookingStore";
import { cn } from "@/lib/utils";

const inputBaseClassName =
  "w-full rounded-[16px] border bg-[#17120e]/92 px-4 py-3 text-sm text-white placeholder:text-white/34 transition duration-200 focus:border-[#d5ad5b] focus:outline-none focus:ring-4 focus:ring-[#d5ad5b]/10";

const areaBaseClassName =
  "min-h-[136px] resize-none rounded-[20px] px-4 py-4 leading-7";

const fieldSurfaceClassName =
  "rounded-[28px] bg-[linear-gradient(180deg,rgba(22,17,13,0.98),rgba(12,10,8,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-8";

const getFieldClassName = (hasError: boolean) =>
  cn(
    inputBaseClassName,
    hasError
      ? "border-[#b83b53] text-white"
      : "border-white/10 text-white/92 hover:border-white/16"
  );

export default function ApplyFormPage() {
  const router = useRouter();
  const { eventId, lang, role, formData, uploads, updateForm, updateUpload } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [isUploading, setIsUploading] = useState<{ facePhoto: boolean; bodyPhoto: boolean }>({
    facePhoto: false,
    bodyPhoto: false,
  });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);
  const [fileTouched, setFileTouched] = useState<{ facePhoto: boolean; bodyPhoto: boolean }>({
    facePhoto: false,
    bodyPhoto: false,
  });
  const hasMountedRef = useRef(false);
  const t = getDictionary(lang);

  const formSchema = useMemo(
    () =>
      z.object({
        firstName: z.string().trim().min(1, t.apply.validation.required),
        lastName: z.string().trim().min(1, t.apply.validation.required),
        email: z.string().trim().min(1, t.apply.validation.required).email(t.apply.validation.email),
        mobile: z.string().trim().min(1, t.apply.validation.required).regex(/^\d{6,15}$/, t.apply.validation.mobile),
        dob: z.string().trim().min(1, t.apply.validation.required),
        residence: z.string().trim().min(1, t.apply.validation.required),
        education: z.string().trim().min(1, t.apply.validation.required),
        occupation: z.string().trim().min(1, t.apply.validation.required),
        height: z.string().trim().min(1, t.apply.validation.required).regex(/^\d{2,3}$/, t.apply.validation.height),
        children: z.string().trim().min(1, t.apply.validation.required),
        interests: z.array(z.string()).default([]),
        short_desc: z.string().trim().min(1, t.apply.validation.required),
        smoker: z.string().trim().min(1, t.apply.validation.required),
        exercise: z.string().trim().min(1, t.apply.validation.required),
        languages: z.string().trim().min(1, t.apply.validation.required),
        looking_for: z.string().trim().min(1, t.apply.validation.required),
        sleeping_habits: z.string().trim().min(1, t.apply.validation.required),
        outings: z.string().trim().min(1, t.apply.validation.required),
        termsAgreement: z.boolean().refine((value) => value, t.apply.validation.terms),
      }),
    [t]
  );

  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    values: formData,
  });

  const watchedValues = useWatch({ control: form.control });
  const textFields = applicationFormFields.filter((field) => field.type !== "file" && field.type !== "checkbox");
  const photoFields = applicationFormFields.filter((field) => field.type === "file");

  useEffect(() => {
    const hasStoredProgress =
      Object.values(formData).some((value) =>
        Array.isArray(value) ? value.length > 0 : typeof value === "boolean" ? value : value.trim().length > 0
      ) ||
      !!uploads.facePhoto?.url ||
      !!uploads.bodyPhoto?.url;

    if (!hasStoredProgress) return;

    setShowRestoredNotice(true);
    const timeoutId = window.setTimeout(() => setShowRestoredNotice(false), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [formData, uploads.bodyPhoto?.url, uploads.facePhoto?.url]);

  useEffect(() => {
    if (!eventId) {
      router.push("/apply/select-event");
      return;
    }

    setIsLoadingEvent(true);
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch(() => toast.error(t.apply.loadingEvent))
      .finally(() => setIsLoadingEvent(false));
  }, [eventId, router, t.apply.loadingEvent]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    // BREAK THE LOOP: Only save if watched values differ from stored data
    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(formData);
    if (!hasChanges) return;

    setSaveState("saving");
    const timeoutId = window.setTimeout(async () => {
      try {
        await updateForm(watchedValues as Partial<BookingFormData>);
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 3000);
      } catch {
        setSaveState("error");
      }
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [updateForm, watchedValues, formData]);

  useEffect(() => {
    return () => {
      [uploads.facePhoto?.preview, uploads.bodyPhoto?.preview].forEach((preview) => {
        if (preview?.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [uploads.bodyPhoto?.preview, uploads.facePhoto?.preview]);

  const getOptions = (fieldId: ApplicationFieldId) => {
    const options = t.apply.options[fieldId as keyof typeof t.apply.options];
    return Array.isArray(options) ? options : [];
  };

  const hasFileError = (field: "facePhoto" | "bodyPhoto") =>
    !uploads[field] && (fileTouched[field] || form.formState.submitCount > 0);

  const isStepValid = form.formState.isValid && !!uploads.facePhoto && !!uploads.bodyPhoto;

  const handleFileChange = (field: "facePhoto" | "bodyPhoto", file?: File | null) => {
    setFileTouched((current) => ({ ...current, [field]: true }));
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t.apply.validation.photoSize);
      return;
    }

    if (![
      "image/jpeg",
      "image/png",
    ].includes(file.type)) {
      toast.error(t.apply.validation.photoType);
      return;
    }

    const currentPreview = uploads[field]?.preview;
    if (currentPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(currentPreview);
    }

    // Instant local preview
    const localPreview = URL.createObjectURL(file);
    updateUpload(field, {
      name: file.name,
      preview: localPreview,
    });

    setSaveState("saving");
    setIsUploading((prev) => ({ ...prev, [field]: true }));

    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", "bookings");

    fetch("/api/upload", {
      method: "POST",
      body: payload,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.url) {
          throw new Error(data?.error || t.apply.imageUploadError);
        }

        // Final URL from server
        updateUpload(field, {
          name: file.name,
          preview: data.url,
          url: data.url,
        });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 3000);
      })
      .catch((error) => {
        setSaveState("error");
        toast.error(error instanceof Error ? error.message : t.apply.imageUploadError);
      })
      .finally(() => {
        setIsUploading((prev) => ({ ...prev, [field]: false }));
        // Clean up blob URL
        URL.revokeObjectURL(localPreview);
      });
  };

  const renderField = (field: ApplicationFieldConfig) => {
    const fieldName = field.id as keyof BookingFormData;
    const fieldState = form.getFieldState(fieldName, form.formState);
    const showError = !!fieldState.error && (fieldState.isTouched || form.formState.submitCount > 0);
    const errorMessage = showError ? fieldState.error?.message : null;

    if (field.type === "checkbox-group") {
      return (
        <Controller
          key={field.id}
          control={form.control}
          name="interests"
          render={({ field: controllerField }) => (
            <div className="md:col-span-2">
              <FieldLabel fieldId={field.id} label={t.apply.fields[field.id]} />
              <div className="mt-2">
                <ApplyMultiSelect
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                  onBlur={controllerField.onBlur}
                  options={getOptions(field.id)}
                  placeholder={t.apply.interestsPlaceholder}
                />
              </div>
            </div>
          )}
        />
      );
    }

    if (field.type === "select") {
      return (
        <Controller
          key={field.id}
          control={form.control}
          name={field.id as Exclude<ApplicationFieldId, "interests" | "facePhoto" | "bodyPhoto" | "termsAgreement">}
          render={({ field: controllerField }) => (
            <div>
              <FieldLabel fieldId={field.id} label={t.apply.fields[field.id]} />
              <div className="mt-2">
                <ApplySelect
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                  onBlur={controllerField.onBlur}
                  options={getOptions(field.id)}
                  placeholder={t.common.select}
                  hasError={showError}
                />
              </div>
              {errorMessage ? <FieldError message={errorMessage} /> : null}
            </div>
          )}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <div className="md:col-span-2" key={field.id}>
          <FieldLabel fieldId={field.id} label={t.apply.fields[field.id]} />
          <textarea
            id={field.id}
            {...form.register(fieldName)}
            placeholder={t.apply.placeholders.short_desc}
            className={cn(getFieldClassName(showError), areaBaseClassName, "mt-2")}
          />
          {errorMessage ? <FieldError message={errorMessage} /> : null}
        </div>
      );
    }

    const inputType = field.type === "date" ? "date" : field.type;
    const placeholder =
      t.apply.placeholders[field.id as keyof typeof t.apply.placeholders] ?? t.apply.fields[field.id];

    return (
      <div key={field.id}>
        <FieldLabel fieldId={field.id} label={t.apply.fields[field.id]} />
        <input
          id={field.id}
          type={inputType}
          inputMode={field.id === "mobile" || field.id === "height" ? "numeric" : undefined}
          placeholder={placeholder}
          {...form.register(fieldName)}
          className={cn(getFieldClassName(showError), "mt-2")}
        />
        {errorMessage ? <FieldError message={errorMessage} /> : null}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <ProgressSteps steps={t.apply.steps} currentStep={2} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            const firstNames = ["James", "Robert", "John", "Michael", "David", "William", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth"];
            const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
            const cities = ["New York", "London", "Paris", "Berlin", "Zagreb", "Split", "Dubai", "Tokyo"];
            const occupations = ["Software Engineer", "Architect", "Designer", "Doctor", "Entrepreneur", "Lawyer", "Marketing Expert"];
            const educations = ["Master of Science", "Bachelor of Arts", "PhD", "MBA", "University of Arts"];

            const randomVal = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
            
            const dummyData: BookingFormData = {
              firstName: randomVal(firstNames),
              lastName: randomVal(lastNames),
              email: `user_${Math.floor(Math.random() * 10000)}@example.com`,
              mobile: `+3859${Math.floor(Math.random() * 899999 + 100000)}`,
              dob: "199" + (Math.floor(Math.random() * 9) + 0) + "-0" + (Math.floor(Math.random() * 9) + 1) + "-15",
              residence: randomVal(cities),
              education: randomVal(educations),
              occupation: randomVal(occupations),
              height: (Math.floor(Math.random() * 40) + 160).toString(),
              children: Math.random() > 0.5 ? "None" : "1",
              interests: ["Design", "Travel", "Tech", "Music", "Fitness"].sort(() => 0.5 - Math.random()).slice(0, 3),
              short_desc: "A passionate individual looking for meaningful connections and great conversations in a premium environment.",
              smoker: "No",
              exercise: "Regularly",
              languages: "English, Croatian",
              looking_for: "Serious Relationship",
              sleeping_habits: "Early bird",
              outings: "Dinner & Drinks",
              termsAgreement: true,
            };
            
            form.reset(dummyData);
            updateForm(dummyData);
            
            updateUpload("facePhoto", {
              name: "sample-face.jpg",
              preview: "/uploads/bookings/booking-1774010636631-4b614de1-5711-4842-aaf7-cccbd7b0b042.jpg",
              url: "/uploads/bookings/booking-1774010636631-4b614de1-5711-4842-aaf7-cccbd7b0b042.jpg",
            });
            updateUpload("bodyPhoto", {
              name: "sample-body.jpg",
              preview: "/uploads/bookings/booking-1774010576205-65fa98d1-a591-46ca-94ed-7724701b55cd.jpg",
              url: "/uploads/bookings/booking-1774010576205-65fa98d1-a591-46ca-94ed-7724701b55cd.jpg",
            });
            
            toast.success("Form auto-filled with random data");
          }}
          className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/40 hover:bg-[#d5ad5b]/20 hover:text-[#d5ad5b] hover:border-[#d5ad5b]/30 transition-all flex items-center gap-2 group"
        >
          <Sparkles className="h-3 w-3 group-hover:animate-pulse" />
          Auto-fill (Testing)
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className={fieldSurfaceClassName}>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.34em] text-[#d5ad5b]/75">{t.apply.stepLabel}</p>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">{t.apply.formTitle}</h1>
            <div
              className={cn(
                "flex min-h-[24px] items-center gap-2 text-sm transition-all duration-300",
                showRestoredNotice ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
              )}
            >
              <CheckCircle2 className="h-4 w-4 text-[#d5ad5b]" />
              <span className="text-white/62">Your progress has been restored</span>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit((data) => {
              // Direct save before navigation for total continuity
              updateForm(data);
              setFileTouched({ facePhoto: true, bodyPhoto: true });
              if (!uploads.facePhoto || !uploads.bodyPhoto) {
                toast.error(t.apply.validation.photoRequired);
                return;
              }
              router.push("/apply/payment");
            })}
            className="mt-8 space-y-8"
          >
            <input type="hidden" name="eventID" value={eventId ?? ""} />
            <input type="hidden" name="current_lang" value={lang} />

            <div className="grid gap-5 md:grid-cols-2">
              {textFields.map(renderField)}
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-white/38">{t.apply.photoSectionTitle}</p>
                <div className="flex items-center gap-2 text-sm text-white/55">
                  <Paperclip className="h-4 w-4 text-[#d5ad5b]" />
                  <span>{t.apply.photoHint}</span>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {photoFields.map((field) => {
                  const uploadField = field.id as "facePhoto" | "bodyPhoto";
                  return (
                    <div key={field.id}>
                      <FieldLabel fieldId={field.id} label={t.apply.fields[field.id]} />
                      <div className="mt-2">
                        <ApplyPhotoUpload
                          label={uploadField === "facePhoto" ? t.apply.uploadFace : t.apply.uploadBody}
                          upload={uploads[uploadField]}
                          accept={field.accept ?? []}
                          onChange={(file) => handleFileChange(uploadField, file)}
                          onRemove={() => {
                            const preview = uploads[uploadField]?.preview;
                            if (preview?.startsWith("blob:")) {
                              URL.revokeObjectURL(preview);
                            }
                            setFileTouched((current) => ({ ...current, [uploadField]: true }));
                            updateUpload(uploadField, null);
                          }}
                          helperText={t.apply.dragAndDrop}
                          chooseFileLabel={t.apply.chooseFile}
                          removeLabel={t.apply.removePhoto}
                          hasError={hasFileError(uploadField)}
                          isLoading={isUploading[uploadField]}
                        />
                      </div>
                      {hasFileError(uploadField) ? <FieldError message={t.apply.validation.photoRequired} /> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 text-sm text-white/68">
                <input
                  id="termsAgreement"
                  type="checkbox"
                  {...form.register("termsAgreement")}
                  className={cn(
                    "mt-1 h-4 w-4 rounded border bg-black/50 text-[#d5ad5b]",
                    form.formState.errors.termsAgreement && (form.formState.touchedFields.termsAgreement || form.formState.submitCount > 0)
                      ? "border-[#b83b53]"
                      : "border-white/20"
                  )}
                />
                <span>
                  {t.apply.termsPrefix}{" "}
                  <a href="#" className="text-[#f0ca7d] underline underline-offset-4">
                    {t.apply.termsLink}
                  </a>{" "}
                  {t.apply.and}{" "}
                  <a href="#" className="text-[#f0ca7d] underline underline-offset-4">
                    {t.apply.privacyLink}
                  </a>
                  .
                </span>
              </label>
              {form.formState.errors.termsAgreement &&
              (form.formState.touchedFields.termsAgreement || form.formState.submitCount > 0) ? (
                <FieldError message={form.formState.errors.termsAgreement.message} />
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              <div className="min-h-[28px]">
                <AnimatePresence mode="wait">
                  {saveState !== "idle" && (
                    <motion.div
                      key={saveState}
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                      className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.03] px-3.5 py-1.5 border border-white/[0.05]"
                    >
                      {saveState === "saving" ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#d5ad5b]" />
                          <span className="text-[11px] uppercase tracking-[0.14em] text-[#d5ad5b]/90 font-medium">Saving...</span>
                        </div>
                      ) : saveState === "saved" ? (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#d5ad5b]" />
                          <span className="text-[11px] uppercase tracking-[0.14em] text-white/65 font-medium">All changes saved</span>
                        </div>
                      ) : saveState === "error" ? (
                        <div className="flex items-center gap-2">
                          <X className="h-3.5 w-3.5 text-[#f18395]" />
                          <span className="text-[11px] uppercase tracking-[0.14em] text-[#f18395] font-medium">Failed to save</span>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => router.push("/apply/select-event")}
                className="rounded-[14px] border border-white/12 px-5 py-3 text-sm uppercase tracking-[0.22em] text-white/68 transition hover:border-[#d5ad5b]/60 hover:text-white"
              >
                {t.common.back}
              </button>
              <button
                type="submit"
                disabled={!isStepValid}
                className="rounded-[14px] bg-[linear-gradient(180deg,#d4af37_0%,#f2ca50_100%)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black shadow-[0_16px_36px_rgba(212,175,55,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t.common.nextStep}
              </button>
              </div>
            </div>
          </form>
        </section>

        <div className="lg:pt-4">
          <div className="lg:sticky lg:top-[100px] space-y-4">
            {isLoadingEvent ? (
              <div className="rounded-[28px] bg-white/[0.04] p-5 text-white/50 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                {t.apply.loadingEvent}
              </div>
            ) : (
              <EventSummaryCard lang={lang} role={role} event={event} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ fieldId, label }: { fieldId: ApplicationFieldId; label: string }) {
  return (
    <label htmlFor={fieldId} className="text-[10px] uppercase tracking-[0.28em] text-white/58">
      {label}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-[#f18395]">{message}</p>;
}

type ApplySelectProps = {
  value?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  options: string[];
  placeholder: string;
  hasError?: boolean;
};

function ApplySelect({ value, onChange, onBlur, options, placeholder, hasError }: ApplySelectProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) onBlur();
  }, [onBlur, open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          getFieldClassName(!!hasError),
          "flex min-h-[50px] items-center justify-between text-left"
        )}
      >
        <span className={cn("truncate", value ? "text-white" : "text-white/40")}>{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-white/45 transition", open && "rotate-180")} />
      </button>

      <PortalPopover anchorEl={triggerRef.current} open={open} onClose={() => setOpen(false)} className="max-h-[320px]">
        <div className="max-h-[290px] space-y-1 overflow-y-auto pr-1">
          {options.map((option) => {
            const active = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  onBlur();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-[16px] px-3 py-3 text-left text-sm transition",
                  active
                    ? "bg-[#d5ad5b]/14 text-[#f0ca7d]"
                    : "text-white/72 hover:bg-white/5 hover:text-white"
                )}
              >
                <span>{option}</span>
                {active ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      </PortalPopover>
    </div>
  );
}

type ApplyMultiSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  options: string[];
  placeholder: string;
};

function ApplyMultiSelect({ value, onChange, onBlur, options, placeholder }: ApplyMultiSelectProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) onBlur();
  }, [onBlur, open]);

  const displayValue = value.length ? value.join(", ") : placeholder;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(getFieldClassName(false), "flex min-h-[50px] items-center justify-between text-left")}
      >
        <span className={cn("truncate", value.length ? "text-white" : "text-white/40")}>{displayValue}</span>
        <ChevronDown className={cn("h-4 w-4 text-white/45 transition", open && "rotate-180")} />
      </button>

      <PortalPopover anchorEl={triggerRef.current} open={open} onClose={() => setOpen(false)} className="max-h-[360px]">
        <div className="max-h-[320px] space-y-1 overflow-y-auto pr-1">
          {options.map((option) => {
            const active = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(active ? value.filter((item) => item !== option) : [...value, option]);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-sm transition",
                  active ? "bg-[#d5ad5b]/10 text-white" : "text-white/72 hover:bg-white/5 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition",
                    active ? "border-[#d5ad5b] bg-[#d5ad5b]/18 text-[#f0ca7d]" : "border-white/18 bg-black/30 text-transparent"
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </PortalPopover>
    </div>
  );
}

type ApplyPhotoUploadProps = {
  label: string;
  upload: { name: string; preview: string } | null;
  accept: string[];
  helperText: string;
  chooseFileLabel: string;
  removeLabel: string;
  hasError?: boolean;
  isLoading?: boolean;
  onChange: (file?: File | null) => void;
  onRemove: () => void;
};

function ApplyPhotoUpload({
  label,
  upload,
  accept,
  helperText,
  chooseFileLabel,
  removeLabel,
  hasError,
  isLoading,
  onChange,
  onRemove,
}: ApplyPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        onChange={(event) => onChange(event.target.files?.[0])}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          onChange(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex min-h-[156px] w-full flex-col items-center justify-center rounded-[22px] border border-dashed px-4 py-6 text-center transition relative overflow-hidden",
          hasError
            ? "border-[#b83b53] bg-[#221217]"
            : isDragging
            ? "border-[#d5ad5b] bg-[#20170f]"
            : "border-white/10 bg-[#17120e]/80 hover:border-white/18"
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <Loader2 className="h-6 w-6 animate-spin text-[#d5ad5b]" />
          </div>
        )}
        {upload?.preview ? (
          <div className="flex w-full flex-col items-center gap-3">
            <img src={upload.preview} alt={upload.name} className="h-20 w-20 rounded-[22px] object-cover shadow-[0_12px_32px_rgba(0,0,0,0.35)]" />
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f0ca7d]">{label}</p>
              <p className="text-sm text-white">{upload.name}</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="mb-3 h-5 w-5 text-[#d5ad5b]" />
            <span className="font-medium text-white">{label}</span>
            <span className="mt-2 text-xs uppercase tracking-[0.22em] text-white/40">{helperText}</span>
          </>
        )}
      </button>
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-white/42">
        <span>{chooseFileLabel}</span>
        {upload ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1 text-[#f0ca7d] transition hover:text-[#ffe1a1]"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 text-[#f18395] transition hover:text-[#ff9daf]"
            >
              <X className="h-3 w-3" />
              {removeLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
