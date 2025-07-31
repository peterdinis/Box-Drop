CREATE TABLE `share_links` (
	`token` text PRIMARY KEY NOT NULL,
	`file_id` text,
	`permission` text,
	`expires_at` text
);
