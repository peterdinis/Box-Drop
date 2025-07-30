import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { files } from "@/db/schema";

export async function GET(req: Request) {
	const authSession = await auth();
	const userId = authSession.userId;
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const allFiles = await db.select().from(files).all();
	return new Response(JSON.stringify(allFiles), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
