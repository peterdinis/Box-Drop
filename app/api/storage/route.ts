import { auth } from "@clerk/nextjs/server";
import { eq, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { files, folders } from "@/db/schema";

export async function GET() {
	const authSession = await auth();
	const userId = authSession.userId;
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const userFolders = await db.query.folders.findMany({
		where: eq(folders.userId, userId),
		columns: { id: true },
	});
	const folderIds = userFolders.map((f) => f.id);

	if (folderIds.length === 0) return NextResponse.json({ usedBytes: 0 });

	const rows = await db
		.select({ usedBytes: sql`sum(${files.size})` })
		.from(files)
		.where(inArray(files.folderId, folderIds));

	const usedBytes = rows[0]?.usedBytes;
	const totalBytes = usedBytes ? Number(usedBytes) : 0;

	return NextResponse.json({ usedBytes: totalBytes });
}