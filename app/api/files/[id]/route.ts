import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const folderId = context.params.id;

  const folder = await db.query.folders.findFirst({
    where: (folders, { eq }) => eq(folders.id, folderId),
    with: {
      files: true,
    },
  });

  if (!folder) {
    return new Response("Not found", { status: 404 });
  }

  return NextResponse.json(folder);
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { id } = context.params;
  const utapi = new UTApi();

  // load all files in folder
  const folderFiles = await db.query.files.findMany({
    where: eq(files.folderId, id),
  });

  const fileKeysToDelete = folderFiles.map((file) => file.id).filter(Boolean);

  if (fileKeysToDelete.length > 0) {
    await utapi.deleteFiles(fileKeysToDelete);
  }

  await db.delete(files).where(eq(files.folderId, id));
  await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));

  return NextResponse.json({ success: true });
}
