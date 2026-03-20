import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_FOLDERS = new Set(["events", "bookings"]);

const getUploadDir = (folder: string) => path.join(process.cwd(), "public", "uploads", folder);

const getSafeFileName = (folder: string, originalName: string) => {
  const ext = path.extname(originalName || "").toLowerCase() || ".jpg";
  return `${folder.slice(0, -1)}-${Date.now()}-${randomUUID()}${ext}`;
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const requestedFolder = String(formData.get("folder") || "events");
  const folder = ALLOWED_FOLDERS.has(requestedFolder) ? requestedFolder : "events";
  const uploadDir = getUploadDir(folder);

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large. Max 2MB." }, { status: 400 });
  }

  const ext = path.extname(file.name || "").toLowerCase();
  const typeOk = ALLOWED_MIME.has(file.type);
  const extOk = ALLOWED_EXT.has(ext);
  if (!typeOk && !extOk) {
    return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, or WEBP." }, { status: 400 });
  }

  await fs.mkdir(uploadDir, { recursive: true });
  const fileName = getSafeFileName(folder, file.name);
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${folder}/${fileName}` });
}

export async function DELETE(request: Request) {
  try {
    const { path: fileUrl } = await request.json();
    if (typeof fileUrl !== "string" || !fileUrl.startsWith("/uploads/")) {
      return NextResponse.json({ ok: true });
    }

    const [, , folder] = fileUrl.split("/");
    if (!folder || !ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ ok: true });
    }

    const uploadDir = getUploadDir(folder);
    const fileName = path.basename(fileUrl);
    const filePath = path.join(uploadDir, fileName);
    await fs.unlink(filePath).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
