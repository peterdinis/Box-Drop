import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { redis } from "@/lib/redis";

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

			const redisKey = `default-folder:${userId}`;
			let folderId = await redis.get(redisKey);

			if (!folderId) {
				const [folder] = await db
					.select({ id: folders.id })
					.from(folders)
					.where(and(eq(folders.name, "Empty"), eq(folders.userId, userId)))
					.limit(1);

				if (!folder) {
					folderId = crypto.randomUUID();

					await db.insert(folders).values({
						id: folderId,
						name: "Empty",
						userId,
						createdAt: Math.floor(Date.now() / 1000) as unknown as Date,
					});
				} else {
					folderId = folder.id;
				}
				await redis.set(redisKey, folderId);
			}

			await db.insert(files).values({
				id: crypto.randomUUID(),
				name: uploadedFile.name,
				url: uploadedFile.ufsUrl,
				folderId: folderId,
				uploadedAt: Math.floor(Date.now() / 1000) as unknown as Date,
				size: uploadedFile.size,
			});

			return { uploadedBy: userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
