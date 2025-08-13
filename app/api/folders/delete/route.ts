import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function DELETE(req: Request) {
    const { userId } = await auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });
    
    const userFolders = await db.query.folders.findMany({
        where: eq(folders.userId, userId),
    });

    if (userFolders.length === 0) {
        return new Response("No folders to delete", { status: 200 });
    }

    const folderIds = userFolders.map(f => f.id);
    
    const allFiles = await db.query.files.findMany({
        where: inArray(files.folderId, folderIds),
    })

    if (allFiles.length > 0) {
        const utapi = new UTApi();
        await utapi.deleteFiles(allFiles.map(f => f.id));
    }

    await db.delete(files).where(inArray(files.folderId, folderIds));

    await db.delete(folders).where(inArray(folders.id, folderIds));

    return NextResponse.json({
        message: "Bulk delete for folders was completed"
    })
}