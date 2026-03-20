import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import User from '@/models/User';
import Booking from '@/models/Booking';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const includeBookings = searchParams.get('includeBookings') === 'true';

  const users = await User.find().sort({ createdAt: -1 });
  if (!includeBookings) {
    return NextResponse.json(users);
  }

  const withCounts = await Promise.all(
    users.map(async (user) => {
      const bookings = await Booking.countDocuments({ user: user._id });
      return { ...user.toObject(), bookings };
    })
  );

  return NextResponse.json(withCounts);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const user = await User.create(body);
  return NextResponse.json(user, { status: 201 });
}

