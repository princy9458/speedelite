import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({ error: "Endpoint removed. Use /api/upload." }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Endpoint removed. Use /api/upload." }, { status: 410 });
}
