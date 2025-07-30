import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { folders } from "@/db/schema";

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

	const totalResult = await db.get<{ count: number }>(
		sql`SELECT COUNT(*) as count FROM folders WHERE user_id = ${userId}`,
	);
	const total = totalResult?.count ?? 0;

	// Formátovanie dátumu pomocou date-fns
	function formatDate(timestamp: number): string {
		return format(new Date(timestamp * 1000), "dd.MM.yyyy");
	}

	const foldersWithFormattedDate = allFolders.map((folder) => ({
		...folder,
		createdAtFormatted: formatDate(folder.createdAt as unknown as number),
	}));

	return new Response(
		JSON.stringify({
			items: foldersWithFormattedDate,
			total,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
}
