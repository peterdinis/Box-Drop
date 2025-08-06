CREATE TABLE `connections` (
	`id` text PRIMARY KEY NOT NULL,
	`requester_id` text NOT NULL,
	`receiver_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT '"2025-08-06T12:18:43.153Z"',
	FOREIGN KEY (`requester_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
