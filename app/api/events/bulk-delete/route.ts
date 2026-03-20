import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Event from '@/models/Event';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: 'No ids provided' }, { status: 400 });
  }
  const result = await Event.deleteMany({ _id: { $in: ids } });
  return NextResponse.json({ deletedCount: result.deletedCount });
}

