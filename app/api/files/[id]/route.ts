import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";

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
