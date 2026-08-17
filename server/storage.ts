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
    const [ping] = await db.update(powerPings)
      .set({ status, responseNotes, respondedAt: ["responded", "action_promised"].includes(status) ? new Date() : undefined })
      .where(eq(powerPings.id, id)).returning();
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

  // ── Legacy aliases ─────────────────────────────────────────────────────

  async getShowcaseProjects(): Promise<MediaPatch[]> {
    return this.getMediaPatches();
  }

  async initializeSampleShowcaseProjects(): Promise<void> {
    return this.initializeSampleMediaPatches();
  }
}

export const storage = new DatabaseStorage();
