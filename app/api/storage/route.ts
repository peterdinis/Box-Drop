import { eq, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { files, folders } from "@/db/schema";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");

	if (!userId)
		return NextResponse.json({ error: "Missing userId" }, { status: 400 });

	const userFolders = await db.query.folders.findMany({
		where: eq(folders.userId, userId),
		columns: { id: true },
	});
	const folderIds = userFolders.map((f) => f.id);

	if (folderIds.length === 0) return NextResponse.json({ usedBytes: 0 });

	const total = await db
		.select({ usedBytes: sql<number>`sum(${files.size})` })
		.from(files)
		.where(inArray(files.folderId, folderIds))
		.then((rows) => rows[0]?.usedBytes ?? 0);

	return NextResponse.json({ usedBytes: total });
}
