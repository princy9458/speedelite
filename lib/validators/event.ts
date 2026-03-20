import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  date: z.coerce.date(),
  time: z.string().min(1, 'Time is required'),
  capacity: z.coerce.number().int().min(1),
  priceMale: z.coerce.number().min(0),
  priceFemale: z.coerce.number().min(0),
  location: z.string().min(2, 'Location is required'),
  bookingDeadline: z.coerce.date(),
  description: z.string().optional().default(''),
  featuredImage: z
    .string()
    .optional()
    .default('')
    .refine(
      (value) =>
        !value ||
        value.startsWith('/') ||
        (() => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        })(),
      'Featured image must be a valid URL or local path'
    ),
  status: z.enum(['draft', 'published']).default('draft'),
  language: z.string().optional().default('en'),
  translations: z
    .object({
      en: z
        .object({
          title: z.string().optional().default(''),
          description: z.string().optional().default(''),
          location: z.string().optional().default(''),
        })
        .optional()
        .default({}),
      hr: z
        .object({
          title: z.string().optional().default(''),
          description: z.string().optional().default(''),
          location: z.string().optional().default(''),
        })
        .optional()
        .default({}),
    })
    .optional()
    .default({}),
});

export type EventInput = z.infer<typeof eventSchema>;
