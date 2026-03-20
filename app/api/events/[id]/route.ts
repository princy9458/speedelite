import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Event from '@/models/Event';
import { eventSchema } from '@/lib/validators/event';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const EventModel = Event as any;

export async function GET(_req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const event = await EventModel.findOne({ _id: id });
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const event = await EventModel.findOneAndUpdate({ _id: id }, parsed.data, { new: true });
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PATCH(req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const parsed = eventSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const event = await EventModel.findOneAndUpdate({ _id: id }, parsed.data, { new: true });
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const event = await EventModel.findOneAndDelete({ _id: id });
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
