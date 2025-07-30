import { eq } from "drizzle-orm";
import { db } from "@/db";
import { files } from "@/db/schema";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const userId = req.headers.get("x-user-id");
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const file = db
		.select()
		.from(files)
		.where(eq(files.id, params.id!))
		.get();

	if (!file) return new Response("Not found", { status: 404 });

	return new Response(JSON.stringify(file), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
