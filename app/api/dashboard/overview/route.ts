import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Event from '@/models/Event';
import User from '@/models/User';
import Booking from '@/models/Booking';

export async function GET() {
  await connectDB();

  const [totalEvents, totalCustomers, totalBookings] = await Promise.all([
    Event.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Booking.countDocuments(),
  ]);

  const recentActivity = await Booking.find()
    .populate('user', 'firstName lastName email')
    .populate('event', 'title date time')
    .sort({ createdAt: -1 })
    .limit(6);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const monthly = await Booking.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$amountPaid' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const bookingsByMonth = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const entry = monthly.find(
      (m) => m._id.year === date.getFullYear() && m._id.month === date.getMonth() + 1
    );
    return {
      label: date.toLocaleString('en-US', { month: 'short' }),
      count: entry?.count || 0,
      revenue: entry?.revenue || 0,
    };
  });

  const revenueByEvent = await Booking.aggregate([
    {
      $group: {
        _id: '$event',
        revenue: { $sum: '$amountPaid' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 6 },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: '_id',
        as: 'event',
      },
    },
    { $unwind: '$event' },
    {
      $project: {
        _id: 0,
        title: '$event.title',
        revenue: 1,
        bookings: 1,
      },
    },
  ]);

  return NextResponse.json({
    totals: { events: totalEvents, customers: totalCustomers, bookings: totalBookings },
    bookingsByMonth,
    revenueByEvent,
    recentActivity,
  });
}

