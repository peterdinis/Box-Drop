import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { files } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const authSession = await auth();
		const userId = authSession.userId;
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const fileId = params.id;
		const body = await req.json();
		const { folderId } = body;

		if (!folderId) {
			return new NextResponse("Missing folderId", { status: 400 });
		}

		await db
			.update(files)
			.set({ folderId })
			.where(and(eq(files.id, fileId)));

		return new NextResponse("File moved", { status: 200 });
	} catch (error) {
		console.error("Error moving file", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}