import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { files, sharedFiles } from "@/db/schema";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    if (!id) {
		return NextResponse.json({ error: "Missing share id" }, { status: 400 });
	}

    try {
		const sharedList = await db
			.select({
				id: sharedFiles.id,
				token: sharedFiles.token, // ✅ fixed
				createdAt: sharedFiles.createdAt,
				fileId: sharedFiles.fileId,
				fileName: files.name,
				fileUrl: files.url,
				fileSize: files.size,
				fileUploadedAt: files.uploadedAt,
			})
			.from(sharedFiles)
			.leftJoin(files, eq(files.id, sharedFiles.fileId))
			.where(eq(sharedFiles.token, id));

		const shared = sharedList[0]; // ✅ PostgreSQL fix

		if (!shared) {
			return NextResponse.json(
				{ error: "Shared file not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			id: shared.id,
			token: shared.token,
			createdAt: shared.createdAt,
			file: {
				id: shared.fileId,
				name: shared.fileName,
				url: shared.fileUrl,
				size: shared.fileSize,
				uploadedAt: shared.fileUploadedAt,
			},
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
