import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(3, 'Code is required').trim().toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  isActive: z.boolean().optional().default(true),
  usageLimit: z.coerce.number().min(0).optional().default(0),
});

export type CouponInput = z.infer<typeof couponSchema>;
