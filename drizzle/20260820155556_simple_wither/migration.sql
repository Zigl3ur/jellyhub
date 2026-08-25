CREATE TABLE `sso_provider` (
	`id` text PRIMARY KEY,
	`issuer` text NOT NULL,
	`oidc_config` text,
	`saml_config` text,
	`user_id` text,
	`provider_id` text NOT NULL UNIQUE,
	`organization_id` text,
	`domain` text NOT NULL,
	`domain_verified` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_sso_provider_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `sso_provider_userId_idx` ON `sso_provider` (`user_id`);