import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request, context: { params: { id: string } }) {
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

	return new Response(JSON.stringify(folder), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}


export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { userId } = await auth();

	if (!userId) {
		return new Response("Unauthorized", { status: 401 });
	}
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const file = await db.query.files.findFirst({
		where: eq(files.id, params.id),
	});

	if (!file) return new Response("Not found", { status: 404 });
	if (!file.folderId) return new Response("No folder associated", { status: 400 });

	const utapi = new UTApi();
	await utapi.deleteFiles(file.url);

	await db.delete(files).where(eq(files.id, params.id));

	return new Response("✅ File deleted", { status: 200 });
}