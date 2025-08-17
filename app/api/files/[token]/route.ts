import { db } from "@/db";
import { sharedFiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const share = await db.query.sharedFiles.findFirst({
    where: eq(sharedFiles.token, params.token),
  });

  if (!share) {
    return new NextResponse("Not found", { status: 404 });
  }
  
  return NextResponse.json({
    fileId: share.fileId,
    downloadUrl: `/api/files/${share.fileId}/download`,
  });
}