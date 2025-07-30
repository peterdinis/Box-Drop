import { relations } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const folders = sqliteTable("folders", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userId: text("user_id").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const foldersRelations = relations(folders, ({ many }) => ({
	files: many(files),
	permissions: many(permissions),
}));

export const files = sqliteTable("files", {
	id: text("id").primaryKey().notNull(),
	folderId: text("folder_id").notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	size: integer("size").notNull(), 
	uploadedAt: integer("uploaded_at", { mode: "timestamp" }).defaultNow(),
});

export const filesRelations = relations(files, ({ one }) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id],
	}),
}));

// PERMISSIONS
export const permissions = sqliteTable(
	"permissions",
	{
		folderId: text("folder_id").notNull(),
		userId: text("user_id").notNull(),
		access: text("access", { enum: ["read", "write"] }).notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.folderId, table.userId] }),
	}),
);

export const permissionsRelations = relations(permissions, ({ one }) => ({
	folder: one(folders, {
		fields: [permissions.folderId],
		references: [folders.id],
	}),
	user: one(members, {
		fields: [permissions.userId],
		references: [members.id],
	}),
}));

export const members = sqliteTable("members", {
	id: text("id").primaryKey().notNull(), // Clerk user ID
	email: text("email").notNull(),
	name: text("name").notNull(),
	isAdmin: integer("is_admin", { mode: "boolean" }).default(false).notNull(),
});

export const membersRelations = relations(members, ({ many }) => ({
	permissions: many(permissions),
}));
