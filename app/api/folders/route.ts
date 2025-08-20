import { auth } from "@clerk/nextjs/server";
import { eq, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { formatDate } from "@/utils/format-date";

export async function GET(req: Request) {
	const authSession = await auth();
	const userId = authSession.userId;
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const { searchParams } = new URL(req.url);
	const limit = Number(searchParams.get("limit") || 10);
	const offset = Number(searchParams.get("offset") || 0);

	const allFolders = await db
		.select()
		.from(folders)
		.where(eq(folders.userId, userId))
		.limit(limit)
		.offset(offset);

	const folderIds = allFolders.map((f) => f.id);

	const allFiles = await db
		.select()
		.from(files)
		.where(inArray(files.folderId, folderIds));

	const foldersWithFiles = allFolders.map((folder) => ({
		...folder,
		files: allFiles
			.filter((f) => f.folderId === folder.id)
			.map((file) => ({
				...file,
				uploadedAtFormatted: formatDate(file.uploadedAt as unknown as number),
			})),
		createdAtFormatted: formatDate(folder.createdAt as unknown as number),
	}));

	const result = await db.execute<{ count: string }>(
		sql`SELECT COUNT(*) as count FROM ${folders} WHERE ${folders.userId} = ${userId}`,
	);
	const total = result.rows.length > 0 ? Number(result.rows[0].count) : 0;

	return new Response(
		JSON.stringify({
			items: foldersWithFiles,
			total,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
}

export async function POST(req: Request) {
	const authSession = await auth();
	const userId = authSession.userId;
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const body = await req.json();
	const { name } = body;

	if (!name || typeof name !== "string") {
		return new Response("Invalid folder name", { status: 400 });
	}

	const newFolder = {
		id: nanoid(),
		name,
		userId,
		createdAt: new Date(),
	};

	await db.insert(folders).values(newFolder);

	return new Response(JSON.stringify(newFolder), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
