import { like, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { files, folders } from "@/db/schema";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const q = url.searchParams.get("q");

	const parsed = z.string().min(1).safeParse(q);

	if (!parsed.success) {
		return new Response(JSON.stringify({ error: "Missing query param ?q" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const query = `%${q}%`;

	const [folderResults, fileResults] = await Promise.all([
		db.select().from(folders).where(like(folders.name, query)).limit(10),
		db.select().from(files).where(like(files.name, query)).limit(10),
	]);

	return new Response(
		JSON.stringify({
			folders: folderResults,
			files: fileResults,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
}
