import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
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
      role: data.role ?? "student",
      foundingCrew: isFoundingCrew,
      language: data.language ?? "en",
    }).returning();
    return profile;
  }

  async getAllUserProfiles() {
    if (!db) return [];
    return db.select().from(userProfiles).orderBy(desc(userProfiles.createdAt));
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
    const [response] = await db.insert(rebootRoomResponses).values({ id: randomUUID(), ...data }).returning();
    return response;
  }

  async getRebootRoomResponses(patchId?: string) {
    if (!db) return [];
    if (patchId) {
      return db.select().from(rebootRoomResponses).where(eq(rebootRoomResponses.patchId, patchId)).orderBy(desc(rebootRoomResponses.createdAt));
    }
    return db.select().from(rebootRoomResponses).orderBy(desc(rebootRoomResponses.createdAt));
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
