import { randomUUID } from "crypto";
import { db } from ".";
import { files, folders } from "./schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// 1. Create members
	const userId1 = randomUUID();
	const userId2 = randomUUID();

	// 2. Create folders
	const folderId1 = randomUUID();
	const folderId2 = randomUUID();

	await db.insert(folders).values([
		{
			id: folderId1,
			name: "Project A",
			userId: userId1,
			createdAt: new Date(),
		},
		{
			id: folderId2,
			name: "Project B",
			userId: userId2,
			createdAt: new Date(),
		},
	]);

	// 3. Add files
	const fileId1 = randomUUID();
	const fileId2 = randomUUID();

	await db.insert(files).values([
		{
			id: fileId1,
			folderId: folderId1,
			name: "report.pdf",
			url: "https://example.com/report.pdf",
			size: 1024,
			uploadedAt: new Date(),
		},
		{
			id: fileId2,
			folderId: folderId2,
			name: "design.png",
			url: "https://example.com/design.png",
			size: 2048,
			uploadedAt: new Date(),
		},
	]);

	console.log("✅ Seed completed!");
}

seed().catch((err) => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
