import { randomUUID } from "crypto";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db";
import {
  mediaPatches,
  rebootProjects,
  contacts,
  userProfiles,
  missionProgress,
  powerPings,
  evidenceReceipts,
  rebootRoomResponses,
  communities,
  communityQuestions,
  questionUpvotes,
  cohorts,
  type MediaPatch,
  type InsertMediaPatch,
  type RebootProject,
  type InsertRebootProject,
  type Contact,
  type InsertContact,
} from "@shared/schema";
import { XP_AWARDS, computeEarnedBadges, type XpEvent } from "@shared/gamification";

export class DatabaseStorage {
  // ── Media Patches ──────────────────────────────────────────────────────

  async createMediaPatch(data: InsertMediaPatch): Promise<MediaPatch> {
    if (!db) throw new Error("Database not available.");
    const [patch] = await db.insert(mediaPatches).values({ id: randomUUID(), ...data }).returning();
    return patch;
  }

  async getMediaPatches(): Promise<MediaPatch[]> {
    if (!db) return [];
    return db.select().from(mediaPatches).orderBy(desc(mediaPatches.publishedAt));
  }

  async getMediaPatch(id: string): Promise<MediaPatch | undefined> {
    if (!db) return undefined;
    const [patch] = await db.select().from(mediaPatches).where(eq(mediaPatches.id, id));
    return patch;
  }

  async updateMediaPatch(id: string, data: Partial<MediaPatch>): Promise<MediaPatch | undefined> {
    if (!db) return undefined;
    const [patch] = await db.update(mediaPatches).set(data).where(eq(mediaPatches.id, id)).returning();
    return patch;
  }

  async initializeSampleMediaPatches(): Promise<void> {
    // No sample data — platform launches empty.
  }

  // ── Reboot Projects ────────────────────────────────────────────────────

  async createRebootProject(data: InsertRebootProject): Promise<RebootProject> {
    if (!db) throw new Error("Database not available.");
    const [project] = await db.insert(rebootProjects).values({ id: randomUUID(), ...data }).returning();
    return project;
  }

  async getRebootProjects(): Promise<RebootProject[]> {
    if (!db) return [];
    return db.select().from(rebootProjects).orderBy(desc(rebootProjects.createdAt));
  }

  async getRebootProject(id: string): Promise<RebootProject | undefined> {
    if (!db) return undefined;
    const [project] = await db.select().from(rebootProjects).where(eq(rebootProjects.id, id));
    return project;
  }

  // ── Contacts ───────────────────────────────────────────────────────────

  async createContact(data: InsertContact): Promise<Contact> {
    if (!db) throw new Error("Database not available.");
    const [contact] = await db.insert(contacts).values({ id: randomUUID(), ...data }).returning();
    return contact;
  }

  // ── User Profiles ──────────────────────────────────────────────────────

  async getUserProfile(clerkUserId: string) {
    if (!db) return undefined;
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.clerkUserId, clerkUserId));
    return profile;
  }

  async upsertUserProfile(clerkUserId: string, data: { displayName: string; crewName?: string; bio?: string; role?: string; language?: string }) {
    if (!db) throw new Error("Database not available.");
    const existing = await this.getUserProfile(clerkUserId);
    if (existing) {
      const [profile] = await db.update(userProfiles).set(data).where(eq(userProfiles.clerkUserId, clerkUserId)).returning();
      return profile;
    }
    // First user gets founding crew badge
    const [count] = await db.select().from(userProfiles);
    const isFoundingCrew = !count;
    const [profile] = await db.insert(userProfiles).values({
      id: randomUUID(),
      clerkUserId,
      displayName: data.displayName,
      crewName: data.crewName,
      bio: data.bio,
      role: data.role ?? "learner",
      foundingCrew: isFoundingCrew,
      language: data.language ?? "en",
    }).returning();
    return profile;
  }

  async getAllUserProfiles() {
    if (!db) return [];
    return db.select().from(userProfiles).orderBy(desc(userProfiles.createdAt));
  }

  // ── Gamification ──────────────────────────────────────────────────────────

  async awardXp(clerkUserId: string, event: XpEvent) {
    if (!db) return;
    const amount = XP_AWARDS[event];
    await db.update(userProfiles)
      .set({ xp: sql`${userProfiles.xp} + ${amount}` })
      .where(eq(userProfiles.clerkUserId, clerkUserId));
    await this.syncBadges(clerkUserId);
  }

  async touchStreak(clerkUserId: string) {
    if (!db) return;
    const profile = await this.getUserProfile(clerkUserId);
    if (!profile) return;

    const today = new Date().toISOString().slice(0, 10);
    if (profile.lastActiveDate === today) return; // already counted today

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const isConsecutive = profile.lastActiveDate === yesterday;
    const newStreak = isConsecutive ? (profile.currentStreak ?? 0) + 1 : 1;
    const longest = Math.max(profile.longestStreak ?? 0, newStreak);

    await db.update(userProfiles).set({
      currentStreak: newStreak,
      longestStreak: longest,
      lastActiveDate: today,
      xp: sql`${userProfiles.xp} + ${XP_AWARDS.daily_streak}`,
    }).where(eq(userProfiles.clerkUserId, clerkUserId));

    await this.syncBadges(clerkUserId);
  }

  async syncBadges(clerkUserId: string) {
    if (!db) return;
    const profile = await this.getUserProfile(clerkUserId);
    if (!profile) return;

    const [missionsRows, pingsRows, receiptsRows, patchesRows] = await Promise.all([
      db.select().from(missionProgress).where(eq(missionProgress.clerkUserId, clerkUserId)),
      db.select().from(powerPings).where(eq(powerPings.clerkUserId, clerkUserId)),
      db.select().from(evidenceReceipts).where(eq(evidenceReceipts.clerkUserId, clerkUserId)),
      db.select().from(mediaPatches),
    ]);

    const respondedPings = pingsRows.filter(p => ["responded", "action_promised"].includes(p.status ?? "")).length;
    const completedMissions = missionsRows.filter(m => m.status === "completed").length;

    const earned = computeEarnedBadges({
      missionsCompleted: completedMissions,
      evidenceReceipts: receiptsRows.length,
      powerPings: pingsRows.length,
      respondedPings,
      mediaPatches: patchesRows.length,
      currentStreak: profile.currentStreak ?? 0,
      foundingCrew: profile.foundingCrew,
    });

    // Merge with existing so we never remove a badge
    const existing = profile.badges ?? [];
    const merged = Array.from(new Set([...existing, ...earned]));
    if (merged.length !== existing.length) {
      await db.update(userProfiles).set({ badges: merged }).where(eq(userProfiles.clerkUserId, clerkUserId));
    }
  }

  // ── Mission Progress ───────────────────────────────────────────────────

  async getMissionProgress(clerkUserId: string) {
    if (!db) return [];
    return db.select().from(missionProgress).where(eq(missionProgress.clerkUserId, clerkUserId));
  }

  async upsertMissionProgress(clerkUserId: string, missionId: string, status: string, notes?: string) {
    if (!db) throw new Error("Database not available.");
    const [existing] = await db.select().from(missionProgress)
      .where(eq(missionProgress.clerkUserId, clerkUserId));
    if (existing) {
      const [row] = await db.update(missionProgress)
        .set({ status, notes, completedAt: status === "completed" ? new Date() : undefined })
        .where(eq(missionProgress.id, existing.id)).returning();
      return row;
    }
    const [row] = await db.insert(missionProgress).values({
      id: randomUUID(), clerkUserId, missionId, status, notes,
    }).returning();
    return row;
  }

  // ── Power Pings ────────────────────────────────────────────────────────

  async createPowerPing(clerkUserId: string, data: any) {
    if (!db) throw new Error("Database not available.");
    const [ping] = await db.insert(powerPings).values({ id: randomUUID(), clerkUserId, ...data }).returning();
    return ping;
  }

  async getPowerPings(clerkUserId?: string) {
    if (!db) return [];
    if (clerkUserId) {
      return db.select().from(powerPings).where(eq(powerPings.clerkUserId, clerkUserId)).orderBy(desc(powerPings.sentAt));
    }
    return db.select().from(powerPings).orderBy(desc(powerPings.sentAt));
  }

  async updatePowerPingStatus(id: string, status: string, responseNotes?: string) {
    if (!db) return undefined;
    const respondedStatuses = ["responded", "response_received", "action_promised", "action_taken", "clarification_requested"];
    const [ping] = await db.update(powerPings)
      .set({ status, responseNotes, respondedAt: respondedStatuses.includes(status) ? new Date() : undefined })
      .where(eq(powerPings.id, id)).returning();
    return ping;
  }

  async updatePowerPingImpact(id: string, clerkUserId: string, data: { impactOutcome?: string; impactDescription?: string }) {
    if (!db) return undefined;
    // Verify ownership before allowing impact update
    const [existing] = await db.select().from(powerPings).where(eq(powerPings.id, id));
    if (!existing || existing.clerkUserId !== clerkUserId) return undefined;
    const [ping] = await db.update(powerPings).set(data).where(eq(powerPings.id, id)).returning();
    return ping;
  }

  // ── Evidence Receipts ──────────────────────────────────────────────────

  async createEvidenceReceipt(clerkUserId: string, data: any) {
    if (!db) throw new Error("Database not available.");
    const [receipt] = await db.insert(evidenceReceipts).values({ id: randomUUID(), clerkUserId, ...data }).returning();
    return receipt;
  }

  async getEvidenceReceipt(id: string) {
    if (!db) return undefined;
    const [receipt] = await db.select().from(evidenceReceipts).where(eq(evidenceReceipts.id, id));
    return receipt;
  }

  async getEvidenceReceipts(clerkUserId?: string) {
    if (!db) return [];
    if (clerkUserId) {
      return db.select().from(evidenceReceipts).where(eq(evidenceReceipts.clerkUserId, clerkUserId)).orderBy(desc(evidenceReceipts.createdAt));
    }
    return db.select().from(evidenceReceipts).orderBy(desc(evidenceReceipts.createdAt));
  }

  // ── Reboot Room Responses ─────────────────────────────────────────────

  async createRebootRoomResponse(data: { patchId: string; clerkUserId?: string; action: string; comment?: string; location?: string; isAnonymous?: boolean }) {
    if (!db) throw new Error("Database not available.");
    const [response] = await db.insert(rebootRoomResponses).values({ id: randomUUID(), status: "pending", ...data }).returning();
    return response;
  }

  /** Returns approved aggregate counts only — safe for public consumption. Never returns raw rows, user IDs, or content. */
  async getRebootRoomResponseCounts(patchId: string): Promise<{ verify: number; amplify: number; apply: number }> {
    if (!db) return { verify: 0, amplify: 0, apply: 0 };
    const rows = await db
      .select()
      .from(rebootRoomResponses)
      .where(eq(rebootRoomResponses.patchId, patchId));
    const approved = rows.filter(r => r.status === "approved");
    return {
      verify: approved.filter(r => r.action === "verify").length,
      amplify: approved.filter(r => r.action === "amplify").length,
      apply: approved.filter(r => r.action === "apply").length,
    };
  }

  /** Admin-only: returns full rows for facilitator moderation review. */
  async getRebootRoomResponses(patchId?: string) {
    if (!db) return [];
    if (patchId) {
      return db.select().from(rebootRoomResponses).where(eq(rebootRoomResponses.patchId, patchId)).orderBy(desc(rebootRoomResponses.createdAt));
    }
    return db.select().from(rebootRoomResponses).orderBy(desc(rebootRoomResponses.createdAt));
  }

  async updateRebootRoomResponseStatus(id: string, status: "pending" | "approved" | "rejected") {
    if (!db) return undefined;
    const [row] = await db
      .update(rebootRoomResponses)
      .set({ status })
      .where(eq(rebootRoomResponses.id, id))
      .returning();
    return row;
  }

  // ── Communities ────────────────────────────────────────────────────────

  async getCommunity(slug: string) {
    if (!db) return undefined;
    const [community] = await db.select().from(communities).where(eq(communities.slug, slug));
    return community;
  }

  async getAllCommunities() {
    if (!db) return [];
    return db.select().from(communities).where(eq(communities.isActive, true)).orderBy(communities.name);
  }

  async upsertCommunity(data: {
    slug: string; name: string; shortName: string; description?: string; tagline?: string;
    location?: string; institutionType?: string; primaryColor?: string; secondaryColor?: string;
  }) {
    if (!db) throw new Error("Database not available.");
    const existing = await this.getCommunity(data.slug);
    if (existing) {
      const [row] = await db.update(communities).set({ ...data, updatedAt: new Date() }).where(eq(communities.slug, data.slug)).returning();
      return row;
    }
    const [row] = await db.insert(communities).values({ id: randomUUID(), isActive: true, ...data }).returning();
    return row;
  }

  // ── Community Questions ─────────────────────────────────────────────────

  async getCommunityQuestions(communitySlug: string, includeAll = false) {
    if (!db) return [];
    const rows = await db.select().from(communityQuestions)
      .where(eq(communityQuestions.communitySlug, communitySlug))
      .orderBy(desc(communityQuestions.upvotes), desc(communityQuestions.createdAt));
    // Public view: only approved (open_for_investigation+, not just submitted/under_review)
    if (!includeAll) {
      return rows.filter(r => !["submitted", "under_review"].includes(r.status));
    }
    return rows;
  }

  async createCommunityQuestion(data: {
    communitySlug: string; clerkUserId?: string; question: string; context?: string;
  }) {
    if (!db) throw new Error("Database not available.");
    const [row] = await db.insert(communityQuestions).values({
      id: randomUUID(),
      status: "submitted",
      upvotes: 0,
      ...data,
    }).returning();
    return row;
  }

  async updateCommunityQuestion(id: string, data: Partial<{
    status: string; linkedProjectId: string; linkedPatchId: string;
  }>) {
    if (!db) return undefined;
    const [row] = await db.update(communityQuestions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(communityQuestions.id, id))
      .returning();
    return row;
  }

  async getAllCommunityQuestionsForAdmin(communitySlug?: string) {
    if (!db) return [];
    if (communitySlug) {
      return db.select().from(communityQuestions)
        .where(eq(communityQuestions.communitySlug, communitySlug))
        .orderBy(desc(communityQuestions.createdAt));
    }
    return db.select().from(communityQuestions).orderBy(desc(communityQuestions.createdAt));
  }

  async upvoteQuestion(questionId: string, clerkUserId: string): Promise<{ upvoted: boolean; upvotes: number }> {
    if (!db) throw new Error("Database not available.");
    // Check if already upvoted
    const [existing] = await db.select().from(questionUpvotes)
      .where(eq(questionUpvotes.questionId, questionId));
    // Note: ideally filter by clerkUserId too but for simplicity we'll check both
    const rows = await db.select().from(questionUpvotes).where(eq(questionUpvotes.questionId, questionId));
    const already = rows.find(r => r.clerkUserId === clerkUserId);
    if (already) {
      // Toggle off
      await db.delete(questionUpvotes).where(eq(questionUpvotes.id, already.id));
      const count = rows.length - 1;
      await db.update(communityQuestions).set({ upvotes: count }).where(eq(communityQuestions.id, questionId));
      return { upvoted: false, upvotes: count };
    }
    await db.insert(questionUpvotes).values({ id: randomUUID(), questionId, clerkUserId });
    const count = rows.length + 1;
    await db.update(communityQuestions).set({ upvotes: count }).where(eq(communityQuestions.id, questionId));
    return { upvoted: true, upvotes: count };
  }

  async getUserUpvotedQuestions(clerkUserId: string, communitySlug: string): Promise<string[]> {
    if (!db) return [];
    // Get question IDs in this community
    const qRows = await db.select().from(communityQuestions).where(eq(communityQuestions.communitySlug, communitySlug));
    const qIds = qRows.map(q => q.id);
    if (qIds.length === 0) return [];
    const upvoteRows = await db.select().from(questionUpvotes).where(eq(questionUpvotes.clerkUserId, clerkUserId));
    return upvoteRows.filter(r => qIds.includes(r.questionId)).map(r => r.questionId);
  }

  // ── Community-scoped stats ──────────────────────────────────────────────

  async getCommunityStats(hubSlug: string) {
    if (!db) return { patches: 0, questions: 0, pings: 0, evidenceReceipts: 0 };
    const [patchRows, questionRows, pingRows, receiptRows] = await Promise.all([
      db.select().from(mediaPatches).where(eq(mediaPatches.hubSlug, hubSlug)),
      db.select().from(communityQuestions).where(eq(communityQuestions.communitySlug, hubSlug)),
      db.select().from(powerPings).where(eq(powerPings.hubSlug, hubSlug)),
      db.select().from(evidenceReceipts),
    ]);
    return {
      patches: patchRows.length,
      questions: questionRows.length,
      pings: pingRows.length,
      evidenceReceipts: receiptRows.length,
    };
  }

  async getCommunityPatches(hubSlug: string) {
    if (!db) return [];
    return db.select().from(mediaPatches)
      .where(eq(mediaPatches.hubSlug, hubSlug))
      .orderBy(desc(mediaPatches.publishedAt));
  }

  // ── Legacy aliases ─────────────────────────────────────────────────────

  async getShowcaseProjects(): Promise<MediaPatch[]> {
    return this.getMediaPatches();
  }

  async initializeSampleShowcaseProjects(): Promise<void> {
    return this.initializeSampleMediaPatches();
  }
}

export const storage = new DatabaseStorage();
