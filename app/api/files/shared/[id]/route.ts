import { NextRequest, NextResponse } from "next/server";
import { sharedFiles, files } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;

  if (!token) {
    return NextResponse.json({ error: "Missing share token" }, { status: 400 });
  }

  try {
    const shared = await db
      .select({
        id: sharedFiles.id,
        token: sharedFiles.token,
        createdAt: sharedFiles.createdAt,
        fileId: sharedFiles.fileId,
        fileName: files.name,
        fileUrl: files.url,
        fileSize: files.size,
        fileUploadedAt: files.uploadedAt,
      })
      .from(sharedFiles)
      .leftJoin(files, eq(files.id, sharedFiles.fileId))
      .where(eq(sharedFiles.token, token))
      .get();

    if (!shared) {
      return NextResponse.json({ error: "Shared file not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: shared.id,
      token: shared.token,
      createdAt: shared.createdAt,
      file: {
        id: shared.fileId,
        name: shared.fileName,
        url: shared.fileUrl,
        size: shared.fileSize,
        uploadedAt: shared.fileUploadedAt,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
