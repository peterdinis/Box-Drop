import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import z from "zod";

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

	// Optionally check result to see if update happened
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

	await db
		.delete(folders)
		.where(and(eq(folders.id, id), eq(folders.userId, userId)))
		.run();

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
