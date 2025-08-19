import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { files, sharedFiles } from "@/db/schema";

export async function GET(req: NextRequest) {
  try {
    const results = await db
      .select()
      .from(files)
      .where(eq(files.isShared, true)); // ✅ Boolean not 0/1

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch shared files:", error);
    return NextResponse.json(
      { message: "Failed to fetch shared files" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { fileId } = await req.json();

  const token = randomUUID();

  await db.insert(sharedFiles).values({
    id: randomUUID(),
    fileId,
    token,
  });

  // ✅ Build correct base URL from request
  const { origin } = new URL(req.url);

  return NextResponse.json({
    url: `${origin}/files/${token}`,
  });
}