import { relations, sql } from "drizzle-orm";
import { integer, pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

// -------------------- Folders --------------------

export const folders = pgTable("folders", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: "date" })
		.defaultNow()
		.notNull(),
});

export const foldersRelations = relations(folders, ({ many }) => ({
	files: many(files),
}));

// -------------------- Files --------------------

export const files = pgTable("files", {
	id: text("id").primaryKey().notNull(),
	folderId: text("folder_id").notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	size: integer("size").notNull(),
	isShared: boolean("is_shared").default(false).notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: "date" }).defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id],
	}),
}));

// -------------------- Shared Files --------------------

export const sharedFiles = pgTable("shared_files", {
	id: text("id").primaryKey().notNull(),
	fileId: text("file_id").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at", { mode: "date" })
		.defaultNow()
		.notNull(),
});