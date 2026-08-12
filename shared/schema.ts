import { pgTable, text, varchar, boolean, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

// ── Media Patches (public showcase projects) ──────────────────────────────
export const mediaPatches = pgTable("media_patches", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  crewName: text("crew_name").notNull(),
  community: text("community").notNull(),
  mediaType: text("media_type").notNull(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  verificationStatus: text("verification_status").default("pending").notNull(),
  institutionalResponseStatus: text("institutional_response_status").default("pending").notNull(),
  featured: boolean("featured").default(false).notNull(),
  stage: text("stage").default("patch_notes").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

// ── Reboot Projects (in-progress youth investigations) ───────────────────
export const rebootProjects = pgTable("reboot_projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  community: text("community").notNull(),
  informationFailure: text("information_failure"),
  affectedGroup: text("affected_group"),
  missingInfo: text("missing_info"),
  narrativeControllers: text("narrative_controllers"),
  whyItMatters: text("why_it_matters"),
  mediaFormat: text("media_format"),
  powerToRespond: text("power_to_respond"),
  visibility: text("visibility").default("private").notNull(),
  safetyConcerns: text("safety_concerns"),
  currentStage: text("current_stage").default("crash_report").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Contacts ──────────────────────────────────────────────────────────────
export const contacts = pgTable("contacts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  role: text("role").default("youth").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

// ── Legacy (kept for backward compatibility with existing DB) ─────────────
export const projects = pgTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectType: text("project_type"),
  topic: text("topic"),
  audience: text("audience"),
  purpose: text("purpose"),
  synopsis: text("synopsis"),
  script: text("script"),
  storyboard: jsonb("storyboard"),
  teamMembers: jsonb("team_members"),
  tasks: jsonb("tasks"),
  editingNotes: text("editing_notes"),
  reflection: jsonb("reflection"),
  peerReview: jsonb("peer_review"),
  projectLink: text("project_link"),
  projectDescription: text("project_description"),
  currentStep: text("current_step").default("crash_report").notNull(),
});

// ── Zod schemas ───────────────────────────────────────────────────────────
export const mediaTypeEnum = z.enum([
  "article",
  "photo_essay",
  "podcast",
  "short_documentary",
  "social_video_series",
  "interactive_timeline",
  "data_story",
  "community_resource_guide",
  "myth_vs_evidence",
  "digital_zine",
  "public_information_page",
  "campaign_page",
]);

export const verificationStatusEnum = z.enum([
  "verified",
  "partially_verified",
  "pending",
  "disputed",
]);

export const responseStatusEnum = z.enum([
  "responded",
  "action_promised",
  "pending",
  "no_response",
]);

export const rebootStageEnum = z.enum([
  "crash_report",
  "system_trace",
  "red_team_room",
  "build_the_patch",
  "ship_with_receipts",
  "power_ping",
  "patch_notes",
]);

export const insertMediaPatchSchema = z.object({
  title: z.string().min(1),
  crewName: z.string().min(1),
  community: z.string().min(1),
  mediaType: mediaTypeEnum,
  topic: z.string().min(1),
  description: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  verificationStatus: verificationStatusEnum.default("pending"),
  institutionalResponseStatus: responseStatusEnum.default("pending"),
  featured: z.boolean().default(false),
  stage: rebootStageEnum.default("patch_notes"),
});

export const insertRebootProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  community: z.string().min(1, "Community or location is required"),
  informationFailure: z.string().optional(),
  affectedGroup: z.string().optional(),
  missingInfo: z.string().optional(),
  narrativeControllers: z.string().optional(),
  whyItMatters: z.string().optional(),
  mediaFormat: mediaTypeEnum.optional(),
  powerToRespond: z.string().optional(),
  visibility: z.enum(["public", "private", "cohort"]).default("private"),
  safetyConcerns: z.string().optional(),
  currentStage: rebootStageEnum.default("crash_report"),
});

export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  role: z.enum(["youth", "facilitator", "mentor", "educator", "community_partner", "other"]).default("youth"),
});

// ── Types ─────────────────────────────────────────────────────────────────
export type MediaPatch = typeof mediaPatches.$inferSelect;
export type InsertMediaPatch = z.infer<typeof insertMediaPatchSchema>;

export type RebootProject = typeof rebootProjects.$inferSelect;
export type InsertRebootProject = z.infer<typeof insertRebootProjectSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Legacy
export type Project = typeof projects.$inferSelect;
export const insertProjectSchema = z.object({});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export const showcaseProjects = mediaPatches; // alias for backward compat
export type ShowcaseProject = MediaPatch;
export type InsertShowcaseProject = InsertMediaPatch;
export const insertShowcaseProjectSchema = insertMediaPatchSchema;
export const users = {} as any;
export const insertUserSchema = {} as any;
export type InsertUser = any;
export type User = any;

// ── Static missions data ───────────────────────────────────────────────────
export const missions = [
  {
    id: "headline-autopsy",
    title: "Headline Autopsy",
    objective: "Compare how multiple news outlets frame the same event and analyze what gets emphasized or erased.",
    estimatedTime: "3–5 hours",
    skills: ["Media Analysis", "Comparison", "Critical Reading"],
    teamSize: "2–4 members",
    safetyNotes: "Use publicly available news sources only.",
    deliverables: ["Side-by-side headline comparison", "Analysis report", "Visual graphic"],
    difficulty: "beginner",
    category: "analysis",
  },
  {
    id: "missing-from-the-record",
    title: "Missing From the Record",
    objective: "Find a person, place, or issue that is repeatedly overlooked by mainstream media and document why it matters.",
    estimatedTime: "5–8 hours",
    skills: ["Research", "Community Listening", "Evidence Collection"],
    teamSize: "3–5 members",
    safetyNotes: "Obtain consent before interviewing community members.",
    deliverables: ["Research report", "Interview recordings", "Media Patch"],
    difficulty: "intermediate",
    category: "investigation",
  },
  {
    id: "rumor-system-trace",
    title: "Rumor System Trace",
    objective: "Track how a local rumor started, changed, and spread through different platforms and communities.",
    estimatedTime: "4–6 hours",
    skills: ["Source Tracing", "Social Media Analysis", "Verification"],
    teamSize: "2–4 members",
    safetyNotes: "Do not identify or target individuals. Focus on patterns, not people.",
    deliverables: ["System Trace map", "Timeline", "Written analysis"],
    difficulty: "intermediate",
    category: "verification",
  },
  {
    id: "public-document-decoder",
    title: "Public Document Decoder",
    objective: "Turn a difficult public document (budget, policy, report) into an accessible community explainer.",
    estimatedTime: "4–7 hours",
    skills: ["Document Research", "Plain Language Writing", "Design"],
    teamSize: "2–4 members",
    safetyNotes: "Use only publicly available documents.",
    deliverables: ["Explainer article or infographic", "Source citation", "Community guide"],
    difficulty: "beginner",
    category: "translation",
  },
  {
    id: "search-yourself",
    title: "Search Yourself",
    objective: "Investigate what search engines and AI systems say about your community and document gaps, errors, and bias.",
    estimatedTime: "3–5 hours",
    skills: ["Search Skills", "AI Literacy", "Documentation"],
    teamSize: "2–3 members",
    safetyNotes: "Do not input personal identifying information into AI tools.",
    deliverables: ["Search audit report", "AI comparison log", "Recommendations"],
    difficulty: "beginner",
    category: "ai-literacy",
  },
  {
    id: "algorithm-audit",
    title: "Algorithm Audit",
    objective: "Document how different user accounts receive different information about the same topic based on platform personalization.",
    estimatedTime: "5–8 hours",
    skills: ["Data Collection", "Comparison Analysis", "Algorithmic Literacy"],
    teamSize: "3–6 members",
    safetyNotes: "Use school-approved accounts. Do not create fake identities.",
    deliverables: ["Side-by-side comparison data", "Analysis report", "Visual explainer"],
    difficulty: "advanced",
    category: "ai-literacy",
  },
  {
    id: "who-gets-quoted",
    title: "Who Gets Quoted?",
    objective: "Analyze whose voices appear in local news coverage and whose voices are consistently absent.",
    estimatedTime: "4–6 hours",
    skills: ["Quantitative Analysis", "Media Literacy", "Research"],
    teamSize: "2–4 members",
    safetyNotes: "Focus on published public sources only.",
    deliverables: ["Data visualization", "Analysis report", "Counter-narrative pitch"],
    difficulty: "intermediate",
    category: "analysis",
  },
  {
    id: "the-correction-project",
    title: "The Correction Project",
    objective: "Identify an outdated, incomplete, or misleading public narrative and build a verified correction.",
    estimatedTime: "6–10 hours",
    skills: ["Fact-Checking", "Evidence Building", "Publishing"],
    teamSize: "3–5 members",
    safetyNotes: "Verify all claims with at least two independent sources before publishing.",
    deliverables: ["Evidence Receipt", "Correction article", "Power Ping to original source"],
    difficulty: "advanced",
    category: "verification",
  },
  {
    id: "ai-said-what",
    title: "AI Said What?",
    objective: "Test AI tools on questions about local history or community issues and document errors, omissions, and bias.",
    estimatedTime: "4–6 hours",
    skills: ["AI Literacy", "Verification", "Documentation"],
    teamSize: "2–4 members",
    safetyNotes: "Do not input personal information into AI tools. Log all AI use.",
    deliverables: ["AI audit log", "Comparison with verified sources", "Public explainer"],
    difficulty: "intermediate",
    category: "ai-literacy",
  },
  {
    id: "information-desert-map",
    title: "Information Desert Map",
    objective: "Map where people in your community currently get reliable information and identify gaps in access.",
    estimatedTime: "5–8 hours",
    skills: ["Community Research", "Mapping", "Survey Design"],
    teamSize: "3–6 members",
    safetyNotes: "Keep survey responses anonymous. Obtain facilitator approval before distributing surveys.",
    deliverables: ["Community map", "Survey data", "Resource guide"],
    difficulty: "intermediate",
    category: "investigation",
  },
] as const;

export type Mission = typeof missions[number];
