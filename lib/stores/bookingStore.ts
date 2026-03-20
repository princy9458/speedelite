import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UploadPreview = {
  name: string;
  preview: string;
  url?: string;
  file?: File;
} | null;

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob: string;
  residence: string;
  education: string;
  occupation: string;
  height: string;
  children: string;
  interests: string[];
  short_desc: string;
  smoker: string;
  exercise: string;
  languages: string;
  looking_for: string;
  sleeping_habits: string;
  outings: string;
  termsAgreement: boolean;
};

type UploadState = {
  facePhoto: UploadPreview;
  bodyPhoto: UploadPreview;
};

type ConfirmationData = {
  bookingId: string;
  bookingNumber: string;
  message: string;
} | null;

type PaymentData = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  discountCode: string;
};

type BookingState = {
  role: "lady" | "gent" | null;
  lang: "en" | "hr";
  eventId: string | null;
  formData: BookingFormData;
  uploads: UploadState;
  paymentData: PaymentData;
  confirmation: ConfirmationData;
  setRole: (role: "lady" | "gent") => void;
  setLang: (lang: "en" | "hr") => void;
  setEventId: (eventId: string) => void;
  updateForm: (data: Partial<BookingFormData>) => void;
  updateUpload: (field: keyof UploadState, value: UploadPreview) => void;
  updatePayment: (data: Partial<PaymentData>) => void;
  setConfirmation: (data: ConfirmationData) => void;
  reset: () => void;
};

const initialFormData: BookingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  dob: "",
  residence: "",
  education: "",
  occupation: "",
  height: "",
  children: "",
  interests: [],
  short_desc: "",
  smoker: "",
  exercise: "",
  languages: "",
  looking_for: "",
  sleeping_habits: "",
  outings: "",
  termsAgreement: false,
};

const initialUploads: UploadState = {
  facePhoto: null,
  bodyPhoto: null,
};

const initialPaymentData: PaymentData = {
  cardNumber: "",
  expiry: "",
  cvc: "",
  discountCode: "",
};

const sanitizeUpload = (upload: UploadPreview): UploadPreview => {
  if (!upload) return null;

  return {
    name: upload.name,
    preview: upload.url || upload.preview,
    url: upload.url || upload.preview,
  };
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      role: null,
      lang: "en",
      eventId: null,
      formData: initialFormData,
      uploads: initialUploads,
      paymentData: initialPaymentData,
      confirmation: null,
      setRole: (role) => set({ role }),
      setLang: (lang) => set({ lang }),
      setEventId: (eventId) => set({ eventId }),
      updateForm: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      updateUpload: (field, value) =>
        set((state) => ({ uploads: { ...state.uploads, [field]: value } })),
      updatePayment: (data) => set((state) => ({ paymentData: { ...state.paymentData, ...data } })),
      setConfirmation: (data) => set({ confirmation: data }),
      reset: () =>
        set({
          role: null,
          eventId: null,
          formData: initialFormData,
          uploads: initialUploads,
          paymentData: initialPaymentData,
          confirmation: null,
          lang: get().lang,
        }),
    }),
    {
      name: "speedelite-booking-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        lang: state.lang,
        eventId: state.eventId,
        formData: state.formData,
        uploads: {
          facePhoto: sanitizeUpload(state.uploads.facePhoto),
          bodyPhoto: sanitizeUpload(state.uploads.bodyPhoto),
        },
        paymentData: state.paymentData,
        confirmation: state.confirmation,
      }),
    }
  )
);
