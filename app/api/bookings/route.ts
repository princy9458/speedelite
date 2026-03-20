import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import User from '@/models/User';
import { bookingSubmissionSchema } from '@/lib/validators/booking';

const BookingModel = Booking as any;
const UserModel = User as any;
const EventModel = Event as any;

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const pageParam = Number(searchParams.get('page') || 1);
  const limitParam = Number(searchParams.get('limit') || 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;
  const paymentStatus = searchParams.get('paymentStatus');
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');
  const search = searchParams.get('search')?.trim();
  const date = searchParams.get('date');

  const filter: Record<string, any> = {};
  if (paymentStatus && paymentStatus !== 'all') filter.paymentStatus = paymentStatus;
  if (eventId) filter.event = eventId;
  if (userId) filter.user = userId;

  if (date) {
    const dayStart = new Date(date);
    if (!Number.isNaN(dayStart.getTime())) {
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filter.createdAt = {
        $gte: dayStart,
        $lt: dayEnd,
      };
    }
  }

  if (search) {
    const matchedEvents = await (EventModel.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { 'translations.en.title': { $regex: search, $options: 'i' } },
        { 'translations.hr.title': { $regex: search, $options: 'i' } },
      ],
    }).select('_id') as any);

    filter.$or = [
      { bookingNumber: { $regex: search, $options: 'i' } },
      { 'userDetails.firstName': { $regex: search, $options: 'i' } },
      { 'userDetails.lastName': { $regex: search, $options: 'i' } },
      { 'userDetails.email': { $regex: search, $options: 'i' } },
      ...(matchedEvents.length ? [{ event: { $in: matchedEvents.map((item: any) => item._id) } }] : []),
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    BookingModel.find(filter)
      .populate('user')
      .populate('event')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BookingModel.countDocuments(filter),
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
  const parsed = bookingSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const event = await EventModel.findOne({ _id: data.eventId });

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const bookingNumber = `BK-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 9000 + 1000)}`;

  let user = await UserModel.findOne({ email: data.form.email });
  if (!user) {
    user = await UserModel.create({
      firstName: data.form.firstName,
      lastName: data.form.lastName,
      email: data.form.email,
      phone: data.form.mobile,
      gender: data.role,
      role: 'customer',
      dob: data.form.dob,
      residence: data.form.residence,
      education: data.form.education,
      occupation: data.form.occupation,
      height: data.form.height,
      children: data.form.children,
      smoker: data.form.smoker,
      exercise: data.form.exercise,
      languages: data.form.languages,
      lookingFor: data.form.looking_for,
      sleepingHabits: data.form.sleeping_habits,
      outings: data.form.outings,
      shortDescription: data.form.short_desc,
      interests: data.form.interests,
    });
  } else {
    user.firstName = data.form.firstName;
    user.lastName = data.form.lastName;
    user.phone = data.form.mobile;
    user.gender = data.role;
    user.dob = data.form.dob;
    user.residence = data.form.residence;
    user.education = data.form.education;
    user.occupation = data.form.occupation;
    user.height = data.form.height;
    user.children = data.form.children;
    user.smoker = data.form.smoker;
    user.exercise = data.form.exercise;
    user.languages = data.form.languages;
    user.lookingFor = data.form.looking_for;
    user.sleepingHabits = data.form.sleeping_habits;
    user.outings = data.form.outings;
    user.shortDescription = data.form.short_desc;
    user.interests = data.form.interests;
    await user.save();
  }

  const booking = await BookingModel.create({
    bookingNumber,
    user: user._id,
    event: event._id,
    role: data.role,
    language: data.lang,
    amountPaid: data.amountPaid,
    paymentStatus: data.paymentStatus,
    currency: data.currency,
    couponCode: data.couponCode || '',
    userDetails: {
      firstName: data.form.firstName,
      lastName: data.form.lastName,
      email: data.form.email,
      mobile: data.form.mobile,
      dob: data.form.dob,
      residence: data.form.residence,
      education: data.form.education,
      occupation: data.form.occupation,
      height: data.form.height,
    },
    preferences: {
      children: data.form.children,
      interests: data.form.interests,
      shortDescription: data.form.short_desc,
      smoker: data.form.smoker,
      exercise: data.form.exercise,
      languages: data.form.languages,
      lookingFor: data.form.looking_for,
      sleepingHabits: data.form.sleeping_habits,
      outings: data.form.outings,
    },
    images: {
      facePhoto: data.images.facePhoto,
      bodyPhoto: data.images.bodyPhoto,
    },
    paymentSummary: data.paymentSummary,
  });

  return NextResponse.json(
    {
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      message: 'Booking created successfully',
    },
    { status: 201 }
  );
}


