import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { files } from "@/db/schema";
import { db } from "@/db";

export async function GET(req: NextRequest) {
  try {
    const sharedFiles = await db
      .select()
      .from(files)
      .where(eq(files.isShared, 0));

    return NextResponse.json(sharedFiles, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch shared files:", error);
    return NextResponse.json(
      { message: "Failed to fetch shared files" },
      { status: 500 }
    );
  }
}