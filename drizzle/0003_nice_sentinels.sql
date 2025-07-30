PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_files` (
	`id` text PRIMARY KEY NOT NULL,
	`folder_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`size` integer NOT NULL,
	`uploaded_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_files`("id", "folder_id", "name", "url", "size", "uploaded_at") SELECT "id", "folder_id", "name", "url", "size", "uploaded_at" FROM `files`;--> statement-breakpoint
DROP TABLE `files`;--> statement-breakpoint
ALTER TABLE `__new_files` RENAME TO `files`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_folders`("id", "name", "user_id", "created_at") SELECT "id", "name", "user_id", "created_at" FROM `folders`;--> statement-breakpoint
DROP TABLE `folders`;--> statement-breakpoint
ALTER TABLE `__new_folders` RENAME TO `folders`;