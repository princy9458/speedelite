import { z } from "zod";

const imagePathSchema = z
  .string()
  .min(1, "Image is required");

export const bookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  residence: z.string().min(1, "Residence is required"),
  education: z.string().min(1, "Education is required"),
  occupation: z.string().min(1, "Occupation is required"),
  height: z.string().min(1, "Height is required"),
  children: z.string().min(1, "Children field is required"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  short_desc: z.string().min(1, "Short description is required"),
  smoker: z.string().min(1, "Smoker field is required"),
  exercise: z.string().min(1, "Exercise field is required"),
  languages: z.string().min(1, "Language field is required"),
  looking_for: z.string().min(1, "Looking for field is required"),
  sleeping_habits: z.string().min(1, "Sleeping habits are required"),
  outings: z.string().min(1, "Outings field is required"),
  termsAgreement: z.literal(true, {
    errorMap: () => ({ message: "Terms must be accepted" }),
  }),
});

export const bookingPaymentSchema = z.object({
  cardNumber: z.string().min(12, "Card number is required"),
  expiry: z.string().min(4, "Expiry is required"),
  cvc: z.string().min(3, "CVC is required"),
  discountCode: z.string().optional().default(""),
});

export const bookingSubmissionSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  role: z.enum(["lady", "gent"]),
  lang: z.enum(["en", "hr"]).default("en"),
  amountPaid: z.coerce.number().min(0),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("paid"),
  currency: z.string().default("EUR"),
  couponCode: z.string().optional().default(""),
  paymentSummary: z.object({
    last4: z.string().length(4),
    expiry: z.string().min(4),
  }),
  form: bookingFormSchema,
  images: z.object({
    facePhoto: imagePathSchema,
    bodyPhoto: imagePathSchema,
  }),
  interview: z.boolean().default(false), // Added interview field as boolean with default
});

export type BookingSubmissionInput = z.infer<typeof bookingSubmissionSchema>;
