import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

export async function DELETE(req: Request) {
    const { userId } = await auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    // 1️⃣ Get all folders for this user
    const userFolders = await db.query.folders.findMany({
        where: eq(folders.userId, userId),
    });

    if (userFolders.length === 0) {
        return new Response("No folders to delete", { status: 200 });
    }

    const folderIds = userFolders.map(f => f.id);

    // 2️⃣ Get all files in all folders
    const allFiles = await db.query.files.findMany({
        where: inArray(files.folderId, folderIds),
    });

    // 3️⃣ Delete files from storage (UTApi)
    if (allFiles.length > 0) {
        const utapi = new UTApi();
        await utapi.deleteFiles(allFiles.map(f => f.id));
    }

    // 4️⃣ Delete files from DB
    await db.delete(files).where(inArray(files.folderId, folderIds));

    // 5️⃣ Delete folders from DB
    await db.delete(folders).where(inArray(folders.id, folderIds));

    return new Response("✅ All folders and their files deleted", { status: 200 });
}