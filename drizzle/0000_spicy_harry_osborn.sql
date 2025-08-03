CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`folder_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`size` integer NOT NULL,
	`uploaded_at` integer
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`is_admin` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`target_id` text NOT NULL,
	`target_type` text NOT NULL,
	`user_id` text NOT NULL,
	`access` text NOT NULL,
	PRIMARY KEY(`user_id`, `target_id`, `target_type`)
);
--> statement-breakpoint
CREATE TABLE `share_links` (
	`token` text PRIMARY KEY NOT NULL,
	`file_id` text,
	`permission` text,
	`expires_at` text
);
