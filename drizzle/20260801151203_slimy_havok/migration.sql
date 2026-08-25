PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_jellydata` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`server_url` text NOT NULL,
	`server_name` text NOT NULL,
	`server_username` text NOT NULL,
	`server_token` text,
	`created_at` integer,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_jellydata_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	CONSTRAINT `jellydata_userId_serverUrl_unique` UNIQUE(`user_id`,`server_url`)
);
--> statement-breakpoint
INSERT INTO `__new_jellydata`(`id`, `user_id`, `server_url`, `server_name`, `server_username`, `server_token`, `created_at`, `updated_at`) SELECT `id`, `user_id`, `server_url`, `server_name`, `server_username`, `server_token`, `created_at`, `updated_at` FROM `jellydata`;--> statement-breakpoint
DROP TABLE `jellydata`;--> statement-breakpoint
ALTER TABLE `__new_jellydata` RENAME TO `jellydata`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `jellydata_userId_idx` ON `jellydata` (`user_id`);