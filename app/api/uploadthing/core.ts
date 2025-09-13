import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { formatDate } from "@/utils/format-date";

const f = createUploadthing();

async function getDefaultFolderId(userId: string): Promise<string> {
	// Look for existing default folder
	const existingFolder = await db.query.folders.findFirst({
		where: and(eq(folders.name, "Unassigned"), eq(folders.userId, userId)),
	});

	if (existingFolder) {
		console.log("Found existing folder:", existingFolder.id);
		return existingFolder.id;
	}

	// Create new default folder if doesn't exist
	const newFolderId = crypto.randomUUID();
	console.log("Creating new folder with ID:", newFolderId);
	
	await db.insert(folders).values({
		id: newFolderId,
		name: "Unassigned",
		userId,
		createdAt: new Date(),
	});
	
	console.log("Successfully created new folder");
	return newFolderId;
}

export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileSize: "16MB", maxFileCount: 5 },
		"application/msword": { maxFileSize: "8MB", maxFileCount: 5 },
		pdf: { maxFileSize: "8MB", maxFileCount: 5 },
		"application/json": { maxFileSize: "8MB", maxFileCount: 5 },
		"application/javascript": { maxFileSize: "8MB", maxFileCount: 5 },
		"application/node": { maxFileSize: "8MB", maxFileCount: 5 },
		"application/express": { maxFileSize: "16MB", maxFileCount: 5 },
		"text/css": { maxFileSize: "8MB", maxFileCount: 5 },
		"text/html": { maxFileSize: "8MB", maxFileCount: 5 },
		"text/markdown": { maxFileSize: "8MB", maxFileCount: 5 },
		text: { maxFileSize: "8MB", maxFileCount: 5 },
		"text/xml": { maxFileSize: "8MB", maxFileCount: 5 },
		video: { maxFileSize: "8MB", maxFileCount: 5 },
		audio: { maxFileSize: "8MB", maxFileCount: 5 },
	})
		.middleware(async () => {
			try {
				console.log("Middleware: Starting authentication check...");
				
				const { userId } = await auth();
				console.log("Auth result - userId:", userId);
				
				if (!userId) {
					console.error("No userId from Clerk auth");
					throw new UploadThingError("Unauthorized: No userId from Clerk");
				}

				console.log("Getting default folder for userId:", userId);
				const folderId = await getDefaultFolderId(userId);
				
				if (!folderId) {
					console.error("Failed to get folder ID for user:", userId);
					throw new UploadThingError("Failed to get default folder ID");
				}

				console.log("Middleware success:", { userId, folderId });
				return { userId, folderId };
				
			} catch (err) {
				console.error("UploadThing middleware error:", err);
				throw new UploadThingError("Middleware failed: " + (err as Error).message);
			}
		})
		.onUploadComplete(async ({ metadata, file: uploadedFile }) => {
			try {
				console.log("onUploadComplete started with metadata:", metadata);
				console.log("uploadedFile:", uploadedFile);
				
				const userId = String(metadata.userId);
				const folderId = String(metadata.folderId);
				
				if (!userId || !folderId) {
					console.error("Missing metadata:", { userId, folderId });
					throw new UploadThingError("Missing metadata");
				}

				const uploadedAt = new Date();
				const fileId = crypto.randomUUID();

				console.log("Inserting file into database:", {
					id: fileId,
					name: uploadedFile.name,
					folderId: folderId,
					size: uploadedFile.size,
				});

				await db.insert(files).values({
					id: String(fileId),
					name: String(uploadedFile.name),
					url: String(uploadedFile.ufsUrl),
					folderId: String(folderId),
					size: Number(uploadedFile.size),
					uploadedAt: uploadedAt,
				});

				console.log("File successfully saved to database:", uploadedFile.name);
				
				return {
					uploadedBy: String(userId),
					uploadedAtFormatted: formatDate(uploadedAt),
				};
			} catch (err) {
				console.error("onUploadComplete error:", err);
				throw new UploadThingError("Failed to save file: " + (err as Error).message);
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;