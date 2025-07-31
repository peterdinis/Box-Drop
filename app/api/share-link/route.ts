import { db } from "@/db";
import { shareLinks } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { fileId, permission } = await req.json();

    if (!fileId || !permission) {
      return NextResponse.json(
        { error: "Missing fileId or permission" },
        { status: 400 }
      );
    }

    const token = uuidv4(); // generuje unikátny token

    // Ulož link do DB
    await db.insert(shareLinks).values({
      token,
      fileId,
      permission,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${token}`;

    return NextResponse.json({ shareUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate share link" },
      { status: 500 }
    );
  }
}