import { randomUUID } from "crypto";
import { db } from ".";
import { files, folders, members, permissions } from "./schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// 1. Create members
	const userId1 = randomUUID();
	const userId2 = randomUUID();

	await db.insert(members).values([
		{ id: userId1, email: "alice@example.com", name: "Alice", isAdmin: true },
		{ id: userId2, email: "bob@example.com", name: "Bob", isAdmin: false },
	]);

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
	await db.insert(files).values([
		{
			id: randomUUID(),
			folderId: folderId1,
			name: "report.pdf",
			url: "https://example.com/report.pdf",
			size: 1024,
			uploadedAt: new Date(),
		},
		{
			id: randomUUID(),
			folderId: folderId2,
			name: "design.png",
			url: "https://example.com/design.png",
			size: 2048,
			uploadedAt: new Date(),
		},
	]);

	// 4. Set permissions
	await db.insert(permissions).values([
		{
			folderId: folderId1,
			userId: userId2,
			access: "read",
		},
		{
			folderId: folderId2,
			userId: userId1,
			access: "write",
		},
	]);

	console.log("✅ Seed completed!");
}

seed().catch((err) => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
