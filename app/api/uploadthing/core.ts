import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/db";
import { files, folders } from "@/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileSize: "16MB", maxFileCount: 5 },
	})
		.middleware(async ({ req }) => {
			const { userId } = await auth();
			if (!userId) throw new UploadThingError("Unauthorized");
			return { userId };
		})
		.onUploadComplete(async ({ metadata, file: uploadedFile }) => {
			const { userId } = metadata;

			// Skús nájsť existujúci "Empty" folder
			let [folder] = await db
				.select({ id: folders.id })
				.from(folders)
				.where(and(eq(folders.name, "Empty"), eq(folders.userId, userId)))
				.limit(1);

			// Ak priečinok neexistuje, vytvor ho
			if (!folder) {
				const newFolderId = crypto.randomUUID();

				await db.insert(folders).values({
					id: newFolderId,
					name: "Empty",
					userId,
					createdAt: new Date(),
				});

				folder = { id: newFolderId };
			}

			// Ulož súbor do databázy
			await db.insert(files).values({
				id: crypto.randomUUID(),
				name: uploadedFile.name,
				url: uploadedFile.ufsUrl,
				folderId: folder.id,
				uploadedAt: new Date(),
				size: uploadedFile.size,
			});

			return { uploadedBy: userId };
		})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
