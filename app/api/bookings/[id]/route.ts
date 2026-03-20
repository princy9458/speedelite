import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const BookingModel = Booking as any;

export async function GET(_req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;

  const booking = await BookingModel.findOne({ _id: id })
    .populate('user')
    .populate('event');

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
}
