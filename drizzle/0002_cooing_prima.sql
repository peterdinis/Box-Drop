CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`message` text NOT NULL,
	`read` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`requester_id` text NOT NULL,
	`receiver_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT '"2025-08-09T15:43:19.619Z"',
	FOREIGN KEY (`requester_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_connections`("id", "requester_id", "receiver_id", "status", "created_at") SELECT "id", "requester_id", "receiver_id", "status", "created_at" FROM `connections`;--> statement-breakpoint
DROP TABLE `connections`;--> statement-breakpoint
ALTER TABLE `__new_connections` RENAME TO `connections`;--> statement-breakpoint
PRAGMA foreign_keys=ON;