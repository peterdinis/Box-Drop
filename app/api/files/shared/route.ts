import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { files, sharedFiles } from "@/db/schema";

export async function GET(req: NextRequest) {
	try {
		const sharedFiles = await db
			.select()
			.from(files)
			.where(eq(files.isShared, 0));

		return NextResponse.json(sharedFiles, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch shared files:", error);
		return NextResponse.json(
			{ message: "Failed to fetch shared files" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	const { fileId } = await req.json();

	const token = randomUUID();

	await db.insert(sharedFiles).values({
		id: randomUUID(),
		fileId,
		token,
	});

	return NextResponse.json({
		url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`,
	});
}
