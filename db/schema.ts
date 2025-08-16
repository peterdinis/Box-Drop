import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
	uploadedAt: integer("uploaded_at", { mode: "timestamp" }),
});

export const filesRelations = relations(files, ({ one}) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id],
	}),
}));

// TODO: Maybe new table for files with hash secure url