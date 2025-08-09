import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";

declare global {
	var io: import("socket.io").Server | undefined;
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { userId, message } = body;

	if (!userId || !message) {
		return NextResponse.json(
			{ error: "Missing userId or message" },
			{ status: 400 },
		);
	}

	// Insert notification into DB
	const newNotification = await db
		.insert(notifications)
		.values({
			userId,
			message,
			read: 0,
			createdAt: new Date(),
		})
		.returning();

	if (global.io) {
		global.io.to(userId).emit("newNotification", newNotification[0]);
	}

	return NextResponse.json(newNotification[0]);
}
