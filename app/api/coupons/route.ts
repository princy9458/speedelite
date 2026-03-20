import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Coupon from '@/models/Coupon';
import { couponSchema } from '@/lib/validators/coupon';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const pageParam = Number(searchParams.get('page') || 1);
  const limitParam = Number(searchParams.get('limit') || 20);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments(),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const coupon = await Coupon.create(parsed.data);
  return NextResponse.json(coupon, { status: 201 });
}

