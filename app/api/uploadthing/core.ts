import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { redis } from "@/lib/redis";
import { formatDate } from "@/utils/format-date";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileSize: "16MB", maxFileCount: 5 },
		"application/msword": { maxFileSize: "8MB", maxFileCount: 5 },
		pdf: { maxFileSize: "8MB", maxFileCount: 5 },
		"application/json": { maxFileSize: "8MB", maxFileCount: 5 },
		"application/javascript": { maxFileSize: "8MB", maxFileCount: 5 },
		"application/node": { maxFileSize: "8MB", maxFileCount: 5 },
		"application/express": { maxFileSize: "16MB", maxFileCount: 5 },
		"video/jpeg": { maxFileSize: "8MB", maxFileCount: 5 },
		"text/css": { maxFileSize: "8MB", maxFileCount: 5 },
		"text/html": { maxFileSize: "8MB", maxFileCount: 5 },
		"text/markdown": { maxFileSize: "8MB", maxFileCount: 5 },
		text: { maxFileSize: "8MB", maxFileCount: 5 },
	})
		.middleware(async () => {
			const { userId } = await auth();
			if (!userId) throw new UploadThingError("Unauthorized");
			return { userId };
		})
		.onUploadComplete(async ({ metadata, file: uploadedFile }) => {
			const { userId } = metadata;
			if (!userId) throw new UploadThingError("Missing userId");

			const redisKey = `default-folder:${userId}`;
			let folderId = await redis.get<string>(redisKey);

			if (!folderId) {
				const folder = await db.query.folders.findFirst({
					where: and(eq(folders.name, "Unasigned"), eq(folders.userId, userId)),
				});

				if (folder) {
					folderId = folder.id;
				} else {
					folderId = crypto.randomUUID();

					await db.insert(folders).values({
						id: folderId,
						name: "Unasigned",
						userId,
						createdAt: new Date(),
					});
				}

				await redis.set(redisKey, folderId);
			}

			const uploadedAt = new Date();

			await db.insert(files).values({
				id: crypto.randomUUID(),
				name: uploadedFile.name,
				url: uploadedFile.ufsUrl,
				folderId: folderId,
				size: uploadedFile.size,
				uploadedAt,
			});

			return {
				uploadedBy: userId,
				uploadedAtFormatted: formatDate(uploadedAt),
			};
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
