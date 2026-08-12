import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  mediaPatches,
  rebootProjects,
  contacts,
  type MediaPatch,
  type InsertMediaPatch,
  type RebootProject,
  type InsertRebootProject,
  type Contact,
  type InsertContact,
} from "@shared/schema";

export interface IStorage {
  // Media Patches
  createMediaPatch(patch: InsertMediaPatch): Promise<MediaPatch>;
  getMediaPatches(): Promise<MediaPatch[]>;
  getMediaPatch(id: string): Promise<MediaPatch | undefined>;
  initializeSampleMediaPatches(): Promise<void>;

  // Reboot Projects
  createRebootProject(project: InsertRebootProject): Promise<RebootProject>;
  getRebootProjects(): Promise<RebootProject[]>;
  getRebootProject(id: string): Promise<RebootProject | undefined>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;

  // Legacy aliases
  getShowcaseProjects(): Promise<MediaPatch[]>;
  initializeSampleShowcaseProjects(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ── Media Patches ──────────────────────────────────────────────────────

  async createMediaPatch(data: InsertMediaPatch): Promise<MediaPatch> {
    if (!db) throw new Error("Database is not available. Please configure DATABASE_URL.");
    const [patch] = await db
      .insert(mediaPatches)
      .values({ id: randomUUID(), ...data })
      .returning();
    return patch;
  }

  async getMediaPatches(): Promise<MediaPatch[]> {
    if (!db) return [];
    return await db.select().from(mediaPatches);
  }

  async getMediaPatch(id: string): Promise<MediaPatch | undefined> {
    if (!db) return undefined;
    const [patch] = await db.select().from(mediaPatches).where(eq(mediaPatches.id, id));
    return patch;
  }

  async initializeSampleMediaPatches(): Promise<void> {
    // No sample data — the platform launches empty.
    // Patch #001 is unassigned and waiting for the first crew.
    return;
  }

  // ── Reboot Projects ────────────────────────────────────────────────────

  async createRebootProject(data: InsertRebootProject): Promise<RebootProject> {
    if (!db) throw new Error("Database is not available. Please configure DATABASE_URL.");
    const [project] = await db
      .insert(rebootProjects)
      .values({ id: randomUUID(), ...data })
      .returning();
    return project;
  }

  async getRebootProjects(): Promise<RebootProject[]> {
    if (!db) return [];
    return await db.select().from(rebootProjects);
  }

  async getRebootProject(id: string): Promise<RebootProject | undefined> {
    if (!db) return undefined;
    const [project] = await db.select().from(rebootProjects).where(eq(rebootProjects.id, id));
    return project;
  }

  // ── Contacts ───────────────────────────────────────────────────────────

  async createContact(data: InsertContact): Promise<Contact> {
    if (!db) throw new Error("Database is not available. Please configure DATABASE_URL.");
    const [contact] = await db
      .insert(contacts)
      .values({ id: randomUUID(), ...data })
      .returning();
    return contact;
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

// No sample data. The platform launches empty.
// Patch #001 is unassigned and waiting for the first crew.
