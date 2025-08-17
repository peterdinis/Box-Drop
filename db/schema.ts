import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// TODO: Later migration to postgresql

// -------------------- Folders --------------------

export const folders = sqliteTable("folders", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userId: text("user_id").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
});

export const foldersRelations = relations(folders, ({ many }) => ({
	files: many(files),
}));

// -------------------- Files --------------------

export const files = sqliteTable("files", {
	id: text("id").primaryKey().notNull(),
	folderId: text("folder_id").notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	size: integer("size").notNull(),
	isShared: integer().default(1), // 1 = false 0 = true later fix when we move to PG
	uploadedAt: integer("uploaded_at", { mode: "timestamp" }),
});

export const filesRelations = relations(files, ({ one }) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id],
	}),
}));

export const sharedFiles = sqliteTable("shared_files", {
	id: text("id").primaryKey().notNull(),
	fileId: text("file_id").notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});
