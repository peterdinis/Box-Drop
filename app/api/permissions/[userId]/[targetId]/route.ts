import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { permissions } from "@/db/schema";

export async function PATCH(
	req: Request,
	{ params }: { params: { userId: string; targetId: string } },
) {
	const { targetType, access } = await req.json();

	if (
		!["file", "folder"].includes(targetType) ||
		!["read", "write"].includes(access)
	) {
		return NextResponse.json(
			{ error: "Invalid targetType or access" },
			{ status: 400 },
		);
	}

	try {
		const result = await db
			.update(permissions)
			.set({ access })
			.where(
				and(
					eq(permissions.userId, params.userId),
					eq(permissions.targetId, params.targetId),
					eq(permissions.targetType, targetType),
				),
			);

		return NextResponse.json({ message: "Permission updated" });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update permission" },
			{ status: 500 },
		);
	}
}
