import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { files, folders, members, permissions } from "@/db/schema";
import { defineAbilitiesFor } from "@/utils/casl-ability";

type RequestBody = {
	targetId: string;
	targetType: "file" | "folder";
	userId: string;
	access: "read" | "write";
};

export async function POST(req: Request) {
	const authSession = await auth();
	const userId = authSession.userId;
	if (!userId) return new Response("Unauthorized", { status: 401 });

	// Najdi aktuálneho používateľa v DB podľa Clerk ID
	const currentUser = await db.query.members.findFirst({
		where: eq(members.id, userId),
	});

	if (!currentUser) {
		return new Response("User not found", { status: 404 });
	}

	const body = (await req.json()) as RequestBody;

	// Nájdi cieľový resource a ownerId (vlastníka)
	let resource: any;

	if (body.targetType === "file") {
		resource = db
			.select({
				id: files.id,
				ownerId: folders.userId,
			})
			.from(files)
			.leftJoin(folders, eq(files.folderId, folders.id))
			.where(eq(files.id, body.targetId))
			.get();
	} else {
		resource = await db.query.folders.findFirst({
			columns: { id: true },
			where: eq(folders.id, body.targetId),
		});
	}

	if (!resource) {
		return new Response("Resource not found", { status: 404 });
	}

	// Definuj schopnosti používateľa (CASL)
	const ability = defineAbilitiesFor(
		currentUser.isAdmin ? "admin" : "user",
		currentUser.id,
	);

	// Skontroluj, či má používateľ právo upravovať (pridávať permissions)
	if (!ability.can("update", resource)) {
		return new Response("Forbidden", { status: 403 });
	}

	// Vlož permission do DB (pozor, schema musí mať targetId a targetType)
	await db.insert(permissions).values({
		targetId: body.targetId,
		targetType: body.targetType,
		userId: body.userId,
		access: body.access,
	});

	return new Response("✅ Permission added", { status: 200 });
}
