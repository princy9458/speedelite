"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter } from "@/i18n/routing";
import { Check, CheckCircle2, ChevronDown, Loader2, Paperclip, Upload, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import ProgressSteps from "@/components/apply/ProgressSteps";
import ApplySidebar from "@/components/apply/ApplySidebar";
import PortalPopover from "@/components/admin/form/PortalPopover";
import {
  applicationFormFields,
  type ApplicationFieldConfig,
  type ApplicationFieldId,
} from "@/lib/forms/application-form";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore, type BookingFormData } from "@/lib/stores/bookingStore";
import { cn } from "@/lib/utils";

const inputBaseClassName =
  "w-full rounded-[16px] border-none bg-white/[0.03] px-4 py-3.5 text-sm text-[#E5E2E1] placeholder:text-white/20 transition duration-300 focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 shadow-inner";

const areaBaseClassName =
  "min-h-[140px] resize-none rounded-[20px] px-4 py-4 leading-7";

const fieldSurfaceClassName =
  "rounded-[32px] bg-[#1a1a1a]/40 backdrop-blur-3xl p-6 shadow-[0_32px_64px_rgba(0,0,0,0.4)] sm:p-10 border-t border-white/[0.05]";

const getFieldClassName = (hasError: boolean) =>
  cn(
    inputBaseClassName,
    hasError
      ? "bg-red-500/10 shadow-[inset_0_0_0_1px_rgba(184,59,83,0.5)]"
      : "hover:bg-white/[0.05]"
  );

function ApplyFormContent() {
  const router = useRouter();
  const { eventId, role, formData, uploads, updateForm, updateUpload } = useBookingStore();
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);
  const t = useTranslations('apply');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [isUploading, setIsUploading] = useState<{ facePhoto: boolean; bodyPhoto: boolean }>({
    facePhoto: false,
    bodyPhoto: false,
  });
  const [fileTouched, setFileTouched] = useState<{ facePhoto: boolean; bodyPhoto: boolean }>({
    facePhoto: false,
    bodyPhoto: false,
  });
  const [isValidationTriggered, setIsValidationTriggered] = useState(false);
  const hasMountedRef = useRef(false);

  const formSchema = useMemo(
    () =>
      z.object({
        firstName: z.string().trim().min(1, t('validation.required')),
        lastName: z.string().trim().min(1, t('validation.required')),
        email: z.string().trim().min(1, t('validation.required')).email(t('validation.email')),
        mobile: z.string().trim().min(1, t('validation.required')).regex(/^[\d+\s-]{6,20}$/, t('validation.mobile')),
        dob: z.string().trim().min(1, t('validation.required')),
        residence: z.string().trim().min(1, t('validation.required')),
        education: z.string().trim().min(1, t('validation.required')),
        occupation: z.string().trim().min(1, t('validation.required')),
        height: z.string().trim().min(1, t('validation.required')).regex(/^\d{2,3}$/, t('validation.height')),
        children: z.string().trim().min(1, t('validation.required')),
        interests: z.array(z.string()).min(1, t('validation.interestRequired') || "Select at least one interest"),
        short_desc: z.string().trim().min(1, t('validation.required')),
        smoker: z.string().trim().min(1, t('validation.required')),
        exercise: z.string().trim().min(1, t('validation.required')),
        languages: z.string().trim().min(1, t('validation.required')),
        looking_for: z.string().trim().min(1, t('validation.required')),
        sleeping_habits: z.string().trim().min(1, t('validation.required')),
        outings: z.string().trim().min(1, t('validation.required')),
        termsAgreement: z.boolean().refine((value) => value, t('validation.terms')),
      }),
    [t]
  );

  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    values: formData,
  });

  const handleAutoFill = () => {
    const firstNames = ["James", "Robert", "John", "Michael", "David", "William", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    
    const dummyData: BookingFormData = {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `user_${Math.floor(Math.random() * 10000)}@example.com`,
      mobile: `+3859${Math.floor(Math.random() * 899999 + 100000)}`,
      dob: "1995-05-15",
      residence: "Zagreb",
      education: "University Degree",
      occupation: "Software Engineer",
      height: "180",
      children: "None",
      interests: ["Travel", "Tech", "Music"],
      short_desc: "A passionate individual looking for meaningful connections.",
      smoker: "No",
      exercise: "Regularly",
      languages: "English, Croatian",
      looking_for: "Relationship",
      sleeping_habits: "Early bird",
      outings: "Dinner",
      termsAgreement: true,
    };
    
    form.reset(dummyData);
    updateForm(dummyData);
    
    updateUpload("facePhoto", {
      name: "sample-face.jpg",
      preview: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    });
    updateUpload("bodyPhoto", {
      name: "sample-body.jpg",
      preview: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    });
    
    toast.success("Form auto-filled for testing");
  };

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
    // Pre-fetch check
    fetch(`/api/events/${eventId}`).then(r => r.json());
  }, [eventId, router]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        await updateForm(watchedValues as Partial<BookingFormData>);
      } catch (err) {
        console.error("Auto-save failed", err);
      }
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [updateForm, watchedValues]);

  const getOptions = (fieldId: ApplicationFieldId) => {
    const options = t.raw(`options.${fieldId}`);
    return Array.isArray(options) ? options : [];
  };

  const hasFileError = (field: "facePhoto" | "bodyPhoto") =>
    !uploads[field] && (fileTouched[field] || form.formState.submitCount > 0);

  const isStepValid = form.formState.isValid && !!uploads.facePhoto?.url && !!uploads.bodyPhoto?.url;

  const handleFileChange = (field: "facePhoto" | "bodyPhoto", file?: File | null) => {
    setFileTouched((current) => ({ ...current, [field]: true }));
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('validation.photoSize'));
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error(t('validation.photoType'));
      return;
    }

    const localPreview = URL.createObjectURL(file);
    updateUpload(field, { name: file.name, preview: localPreview });

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
        if (!res.ok || !data.url) throw new Error(data?.error || t('imageUploadError'));

        updateUpload(field, { name: file.name, preview: data.url, url: data.url });
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : t('imageUploadError'));
      })
      .finally(() => {
        setIsUploading((prev) => ({ ...prev, [field]: false }));
        URL.revokeObjectURL(localPreview);
      });
  };

  const renderField = (field: ApplicationFieldConfig) => {
    const fieldName = field.id as keyof BookingFormData;
    const fieldState = form.getFieldState(fieldName, form.formState);
    const showError = !!fieldState.error && (fieldState.isTouched || form.formState.submitCount > 0 || isValidationTriggered);
    const errorMessage = showError ? fieldState.error?.message : null;

    if (field.type === "checkbox-group") {
      return (
        <Controller
          key={field.id}
          control={form.control}
          name="interests"
          render={({ field: controllerField }) => (
            <div className="md:col-span-2">
              <FieldLabel fieldId={field.id} label={t(`fields.${field.id}`)} />
              <div className="mt-2 text-white">
                <ApplyMultiSelect
                  id={field.id}
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                  onBlur={controllerField.onBlur}
                  options={getOptions(field.id)}
                  placeholder={t('interestsPlaceholder')}
                  hasError={showError}
                />
              </div>
              {errorMessage ? <FieldError message={errorMessage} /> : null}
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
          name={field.id as any}
          render={({ field: controllerField }) => (
            <div>
              <FieldLabel fieldId={field.id} label={t(`fields.${field.id}`)} />
              <div className="mt-2">
                <ApplySelect
                  id={field.id}
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                  onBlur={controllerField.onBlur}
                  options={getOptions(field.id)}
                  placeholder={tCommon('select')}
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
          <FieldLabel fieldId={field.id} label={t(`fields.${field.id}`)} />
          <textarea
            id={field.id}
            {...form.register(fieldName)}
            placeholder={t(`placeholders.${field.id}`)}
            className={cn(getFieldClassName(showError), areaBaseClassName, "mt-2")}
          />
          {errorMessage ? <FieldError message={errorMessage} /> : null}
        </div>
      );
    }

    const inputType = field.type === "date" ? "date" : field.type;
    const placeholder = t(`placeholders.${field.id}`);

    return (
      <div key={field.id}>
        <FieldLabel fieldId={field.id} label={t(`fields.${field.id}`)} />
        <input
          id={field.id}
          type={inputType}
          placeholder={placeholder}
          {...form.register(fieldName)}
          className={cn(getFieldClassName(showError), "mt-2")}
        />
        {errorMessage ? <FieldError message={errorMessage} /> : null}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-[1240px] space-y-8 pb-20">
      <ProgressSteps steps={t.raw('steps')} currentStep={2} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAutoFill}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/40 transition hover:border-[#d5ad5b]/30 hover:bg-white/10 hover:text-[#f0ca7d]"
        >
          <Sparkles className="h-3 w-3 group-hover:scale-125 transition-transform" />
          Auto-Fill (SpeedElite Testing)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] items-start">
        <section className={cn(fieldSurfaceClassName, "p-10")}>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.34em] text-[#d5ad5b]/75">{t('stepLabel')} 2</p>
            <h1 className="font-serif text-4xl text-white sm:text-5xl">{t('formTitle')}</h1>
            <div
              className={cn(
                "flex min-h-[24px] items-center gap-2 text-sm transition-all duration-300",
                showRestoredNotice ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
              )}
            >
              <CheckCircle2 className="h-4 w-4 text-[#d5ad5b]" />
              <span className="text-white/60">{t('restoredNotice')}</span>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit((data) => {
              updateForm(data);
              setFileTouched({ facePhoto: true, bodyPhoto: true });
              if (!uploads.facePhoto || !uploads.bodyPhoto) {
                toast.error(t('validation.photoRequired'));
                return;
              }
              router.push("/apply/payment");
            })}
            className="mt-8 space-y-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {textFields.map(renderField)}
            </div>

            <div id="photo-section" className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">{t('photoSectionTitle')}</p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Paperclip className="h-4 w-4 text-[#d5ad5b]" />
                  <span>{t('photoHint')}</span>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {photoFields.map((field) => {
                  const uploadField = field.id as "facePhoto" | "bodyPhoto";
                  return (
                    <div key={field.id}>
                      <FieldLabel fieldId={field.id} label={t(`fields.${field.id}`)} />
                      <div className="mt-2">
                        <ApplyPhotoUpload
                          label={uploadField === "facePhoto" ? t('uploadFace') : t('uploadBody')}
                          upload={uploads[uploadField]}
                          accept={field.accept ?? []}
                          onChange={(file) => handleFileChange(uploadField, file)}
                          onRemove={() => updateUpload(uploadField, null)}
                          helperText={t('dragAndDrop')}
                          chooseFileLabel={t('chooseFile')}
                          removeLabel={t('removePhoto')}
                          hasError={hasFileError(uploadField)}
                          isLoading={isUploading[uploadField]}
                        />
                      </div>
                      {hasFileError(uploadField) ? <FieldError message={t('validation.photoRequired')} /> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div id="terms-section">
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  id="termsAgreement"
                  type="checkbox"
                  {...form.register("termsAgreement")}
                  className={cn(
                    "mt-1 h-4 w-4 rounded border bg-black/50 text-[#d5ad5b]",
                    form.formState.errors.termsAgreement && "border-red-500"
                  )}
                />
                <span>
                  {t('termsPrefix')}{" "}
                  <a href="#" className="text-[#f0ca7d] underline underline-offset-4">{t('termsLink')}</a>{" "}
                  {t('and')}{" "}
                  <a href="#" className="text-[#f0ca7d] underline underline-offset-4">{t('privacyLink')}</a>.
                </span>
              </label>
              {form.formState.errors.termsAgreement ? <FieldError message={form.formState.errors.termsAgreement.message} /> : null}
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between py-4 border-t border-white/[0.05] mt-8">
              <button
                type="button"
                onClick={() => router.push("/apply/select-event")}
                className="rounded-[14px] border border-white/10 px-6 py-3.5 text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-[#F2CA50] transition-all"
              >
                {tCommon('back')}
              </button>
              <button
                type="submit"
                onClick={async (e) => {
                  if (!isStepValid) {
                    setIsValidationTriggered(true);
                    const results = await form.trigger();
                    if (!results || !uploads.facePhoto || !uploads.bodyPhoto) {
                      toast.error(t('validation.fixErrors'));
                    }
                  }
                }}
                className={cn(
                  "rounded-[14px] bg-[linear-gradient(180deg,#d4af37_0%,#f2ca50_100%)] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black shadow-lg transition hover:brightness-105",
                  !isStepValid && "opacity-60 grayscale-[0.5]"
                )}
              >
                {tCommon('nextStep')}
              </button>
            </div>
          </form>
        </section>

        <aside className="sticky top-[120px]">
           <ApplySidebar />
        </aside>
      </div>
    </div>
  );
}

export default function ApplyFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin h-8 w-8 text-[#D4AF37]" /></div>}>
      <ApplyFormContent />
    </Suspense>
  );
}

function FieldLabel({ fieldId, label }: { fieldId: ApplicationFieldId; label: string }) {
  return <label htmlFor={fieldId} className="text-[10px] uppercase tracking-[0.28em] text-white/60">{label}</label>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-[#f18395]">{message}</p>;
}

function ApplySelect({ id, value, onChange, onBlur, options, placeholder, hasError }: any) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button ref={triggerRef} type="button" onClick={() => setOpen(!open)} className={cn(getFieldClassName(!!hasError), "flex items-center justify-between")}>
        <span className={cn(value ? "text-white" : "text-white/40")}>{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      <PortalPopover anchorEl={triggerRef.current} open={open} onClose={() => setOpen(false)}>
        <div className="p-1 space-y-1">
          {options.map((opt: string) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); onBlur(); }} className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-sm text-white/80">{opt}</button>
          ))}
        </div>
      </PortalPopover>
    </div>
  );
}

function ApplyMultiSelect({ id, value, onChange, onBlur, options, placeholder, hasError }: any) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button ref={triggerRef} type="button" onClick={() => setOpen(!open)} className={cn(getFieldClassName(!!hasError), "flex items-center justify-between")}>
        <span className={cn("truncate", value.length ? "text-white" : "text-white/40")}>{value.length ? value.join(", ") : placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      <PortalPopover anchorEl={triggerRef.current} open={open} onClose={() => setOpen(false)}>
        <div className="p-1 space-y-1 max-h-[300px] overflow-y-auto">
          {options.map((opt: string) => {
            const active = value.includes(opt);
            return (
              <button key={opt} onClick={() => onChange(active ? value.filter((v: string) => v !== opt) : [...value, opt])} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg text-sm">
                <div className={cn("w-4 h-4 rounded border flex items-center justify-center", active ? "border-[#d5ad5b] bg-[#d5ad5b]/20" : "border-white/10")}>{active && <Check className="h-3 w-3 text-[#d5ad5b]" />}</div>
                <span className={active ? "text-white" : "text-white/60"}>{opt}</span>
              </button>
            );
          })}
        </div>
      </PortalPopover>
    </div>
  );
}

function ApplyPhotoUpload({ label, upload, accept, isLoading, onChange, onRemove, helperText, chooseFileLabel, removeLabel, hasError }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-3">
      <input type="file" ref={inputRef} accept={accept.join(",")} onChange={(e) => onChange(e.target.files?.[0])} className="hidden" />
      <div 
        onClick={() => !upload?.preview && inputRef.current?.click()} 
        className={cn(
          "relative group flex min-h-[200px] w-full flex-col items-center justify-center rounded-[24px] overflow-hidden border transition-all cursor-pointer", 
          hasError ? "border-red-500/50 bg-red-500/5" : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]",
          upload?.preview && "cursor-default"
        )}
      >
        {isLoading && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60"><Loader2 className="animate-spin text-[#d5ad5b]" /></div>}
        {upload?.preview ? (
          <div className="absolute inset-0">
            <img src={upload.preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onRemove(); }} 
              className="absolute top-4 right-4 bg-black/60 p-2 rounded-full hover:bg-black transition-colors z-30"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            <div className="absolute bottom-4 left-4"><p className="text-[10px] uppercase font-bold text-[#d5ad5b]">{label}</p></div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/30">
            <Upload className="h-8 w-8" />
            <p className="text-xs">{chooseFileLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
