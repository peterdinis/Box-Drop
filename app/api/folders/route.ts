import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
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
		sql`SELECT COUNT(*) as count FROM folders WHERE userId = ${userId}`
	);
	const total = totalResult?.count ?? 0;

	return new Response(
		JSON.stringify({
			items: allFolders,
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
	const schema = z.object({ name: z.string().min(1) });
	const parsed = schema.safeParse(body);
	if (!parsed.success)
		return new Response(JSON.stringify({ error: "Invalid name" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});

	const id = nanoid();
	await db.insert(folders).values({ id, name: parsed.data.name, userId }).run();

	return new Response(JSON.stringify({ id, name: parsed.data.name }), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
