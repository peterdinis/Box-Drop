CREATE TABLE `shared_files` (
	`id` text PRIMARY KEY NOT NULL,
	`file_id` text NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shared_files_token_unique` ON `shared_files` (`token`);