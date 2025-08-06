import { relations } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef", 21);

// -------------------- Folders --------------------

export const folders = sqliteTable("folders", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userId: text("user_id").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
});

export const foldersRelations = relations(folders, ({ many }) => ({
	files: many(files),
	permissions: many(permissions),
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

export const filesRelations = relations(files, ({ one, many }) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id],
	}),
	permissions: many(permissions),
}));

// -------------------- Share Links --------------------

export const shareLinks = sqliteTable("share_links", {
	token: text("token").primaryKey(),
	fileId: text("file_id"),
	permission: text("permission"),
	expiresAt: text("expires_at"),
});

// -------------------- Permissions --------------------

export const permissions = sqliteTable(
	"permissions",
	{
		targetId: text("target_id").notNull(), // Can be file or folder ID
		targetType: text("target_type", { enum: ["file", "folder"] }).notNull(),
		userId: text("user_id").notNull(),
		access: text("access", { enum: ["read", "write"] }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userId, table.targetId, table.targetType],
		}),
	}),
);

export const permissionsRelations = relations(permissions, ({ one }) => ({
	user: one(members, {
		fields: [permissions.userId],
		references: [members.id],
	}),
}));

// -------------------- Members --------------------

export const members = sqliteTable("members", {
	id: text("id").primaryKey().notNull(),
	email: text("email").notNull(),
	name: text("name").notNull(),
	isAdmin: integer("is_admin", { mode: "boolean" }).default(false).notNull(),
});

export const membersRelations = relations(members, ({ many }) => ({
	permissions: many(permissions),
}));

// -------------------- Connections --------------------

export const connections = sqliteTable("connections", {
	id: text("id")
		.primaryKey()
		.$default(() => nanoid()),
	requesterId: text("requester_id")
		.notNull()
		.references(() => members.id),
	receiverId: text("receiver_id")
		.notNull()
		.references(() => members.id),
	status: text("status", { enum: ["pending", "accepted", "rejected"] })
		.notNull()
		.default("pending"),
	createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const connectionsRelations = relations(connections, ({ one }) => ({
	requester: one(members, {
		fields: [connections.requesterId],
		references: [members.id],
	}),
	receiver: one(members, {
		fields: [connections.receiverId],
		references: [members.id],
	}),
}));
