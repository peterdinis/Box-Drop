import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { UTApi } from "uploadthing/server";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const authSession = await auth();
	const userId = authSession.userId;
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const { id } = params;

	const folder = await db.query.folders.findFirst({
		where: and(eq(folders.id, id), eq(folders.userId, userId)),
		with: {
			files: true,
		},
	});

	if (!folder) return new Response("Not found", { status: 404 });

	return new Response(JSON.stringify(folder), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const authSession = await auth();
	const userId = authSession.userId;
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const { id } = params;
	const body = await req.json();

	const schema = z.object({ name: z.string().min(1) });
	const parsed = schema.safeParse(body);
	if (!parsed.success)
		return new Response(JSON.stringify({ error: "Invalid name" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});

	await db
		.update(folders)
		.set({ name: parsed.data.name })
		.where(and(eq(folders.id, id), eq(folders.userId, userId)))
		.run();
		
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const authSession = await auth();
  const userId = authSession.userId;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { id } = params;
  const utapi = new UTApi();

  const folderFiles = await db.query.files.findMany({
    where: and(eq(files.folderId, id)),
  });

  const fileKeysToDelete = folderFiles
    .map((file) => file.id)
    .filter(Boolean);

  if (fileKeysToDelete.length > 0) {
    await utapi.deleteFiles(fileKeysToDelete);
  }

  await db
    .delete(files)
    .where(and(eq(files.folderId, id)))
    .run();

  await db
    .delete(folders)
    .where(and(eq(folders.id, id), eq(folders.userId, userId)))
    .run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}