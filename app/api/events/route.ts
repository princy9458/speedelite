import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Event from '@/models/Event';
import { eventSchema } from '@/lib/validators/event';

const EventModel = Event as any;

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim();
  const status = searchParams.get('status');
  const sortByParam = searchParams.get('sortBy') || 'date';
  const allowedSort = ['date', 'createdAt', 'title'];
  const sortBy = allowedSort.includes(sortByParam) ? sortByParam : 'date';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
  const pageParam = Number(searchParams.get('page') || 1);
  const limitParam = Number(searchParams.get('limit') || 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;

  const filter: Record<string, any> = {};
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { 'translations.en.title': { $regex: search, $options: 'i' } },
      { 'translations.hr.title': { $regex: search, $options: 'i' } },
      { 'translations.en.location': { $regex: search, $options: 'i' } },
      { 'translations.hr.location': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    EventModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    EventModel.countDocuments(filter),
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
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const event = await EventModel.create(parsed.data);
  return NextResponse.json(event, { status: 201 });
}

