import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { connections } from "@/db/schema";

export async function DELETE(_req: Request, props: { params: Promise<{ connectionId: string }> }) {
    const params = await props.params;
    const { connectionId } = params;

    try {
		const deleted = await db
			.delete(connections)
			.where(eq(connections.id, connectionId));

		return NextResponse.json({ success: true, deleted });
	} catch (error) {
		console.error("[DELETE_CONNECTION_ERROR]", error);
		return NextResponse.json(
			{ error: "Failed to delete connection" },
			{ status: 500 },
		);
	}
}
