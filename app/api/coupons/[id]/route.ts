import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Coupon from '@/models/Coupon';
import { couponSchema } from '@/lib/validators/coupon';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const CouponModel = Coupon as any;

export async function GET(_req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const coupon = await CouponModel.findOne({ _id: id });
  if (!coupon) {
    return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  }
  return NextResponse.json(coupon);
}

export async function PUT(req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const coupon = await CouponModel.findOneAndUpdate({ _id: id }, parsed.data, { new: true });
  if (!coupon) {
    return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  }
  return NextResponse.json(coupon);
}

export async function PATCH(req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const parsed = couponSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const coupon = await CouponModel.findOneAndUpdate({ _id: id }, parsed.data, { new: true });
  if (!coupon) {
    return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  }
  return NextResponse.json(coupon);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const coupon = await CouponModel.findOneAndDelete({ _id: id });
  if (!coupon) {
    return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
