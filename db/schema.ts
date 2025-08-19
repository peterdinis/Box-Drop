import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

// -------------------- Tables --------------------

export const folders = pgTable("folders", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const files = pgTable("files", {
	id: text("id").primaryKey().notNull(),
	folderId: text("folder_id")
		.notNull()
		.references(() => folders.id),
	name: text("name").notNull(),
	url: text("url").notNull(),
	size: integer("size").notNull(),
	isShared: boolean("is_shared").default(false).notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: "date" }).defaultNow().notNull(),
});

export const sharedFiles = pgTable("shared_files", {
	id: text("id").primaryKey().notNull(),
	fileId: text("file_id")
		.notNull()
		.references(() => files.id),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
