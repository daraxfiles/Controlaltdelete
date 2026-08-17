CREATE TABLE "contacts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"role" text DEFAULT 'youth' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_receipts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"project_title" text NOT NULL,
	"main_claims" text NOT NULL,
	"sources" text NOT NULL,
	"interviews" text,
	"documents" text,
	"verification_steps" text NOT NULL,
	"uncertainties" text,
	"conflicts_of_interest" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_patches" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"crew_name" text NOT NULL,
	"community" text NOT NULL,
	"media_type" text NOT NULL,
	"topic" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail_url" text,
	"verification_status" text DEFAULT 'pending' NOT NULL,
	"institutional_response_status" text DEFAULT 'pending' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"stage" text DEFAULT 'patch_notes' NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mission_progress" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"mission_id" text NOT NULL,
	"status" text DEFAULT 'started' NOT NULL,
	"notes" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "power_pings" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"project_title" text NOT NULL,
	"recipient_name" text NOT NULL,
	"recipient_org" text NOT NULL,
	"recipient_role" text NOT NULL,
	"questions" text NOT NULL,
	"patch_url" text,
	"response_deadline" text,
	"status" text DEFAULT 'sent' NOT NULL,
	"response_notes" text,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"project_type" text,
	"topic" text,
	"audience" text,
	"purpose" text,
	"synopsis" text,
	"script" text,
	"storyboard" jsonb,
	"team_members" jsonb,
	"tasks" jsonb,
	"editing_notes" text,
	"reflection" jsonb,
	"peer_review" jsonb,
	"project_link" text,
	"project_description" text,
	"current_step" text DEFAULT 'crash_report' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reboot_projects" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"community" text NOT NULL,
	"information_failure" text,
	"affected_group" text,
	"missing_info" text,
	"narrative_controllers" text,
	"why_it_matters" text,
	"media_format" text,
	"power_to_respond" text,
	"visibility" text DEFAULT 'private' NOT NULL,
	"safety_concerns" text,
	"current_stage" text DEFAULT 'crash_report' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reboot_room_responses" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"patch_id" varchar(36) NOT NULL,
	"clerk_user_id" text,
	"action" text NOT NULL,
	"comment" text,
	"location" text,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"display_name" text NOT NULL,
	"crew_name" text,
	"bio" text,
	"role" text DEFAULT 'youth' NOT NULL,
	"founding_crew" boolean DEFAULT false NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
