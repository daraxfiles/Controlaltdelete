import type { Express } from "express";
import { createServer, type Server } from "http";
import { getAuth } from "@clerk/express";
import { storage } from "./storage";
import { insertRebootProjectSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

// ── Auth middleware ─────────────────────────────────────────────────────────
const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
};

// Admin check — in production, check for admin role in DB
const requireAdmin = async (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  // For now, allow any authenticated user to access admin panel
  // TODO: restrict to role=admin|facilitator once role assignment UI is built
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await storage.initializeSampleMediaPatches();

  // ── Gamification ───────────────────────────────────────────────────────
  // Touch streak on any authenticated profile fetch
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      await storage.touchStreak(req.userId);
      const profile = await storage.getUserProfile(req.userId);
      res.json(profile ?? null);
    } catch {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const { displayName, crewName, bio, role, language } = req.body;
      const profile = await storage.upsertUserProfile(req.userId, { displayName, crewName, bio, role, language });
      await storage.touchStreak(req.userId);
      res.json(profile);
    } catch {
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // ── Media Patches ───────────────────────────────────────────────────────
  app.get("/api/media-patches", async (req, res) => {
    try {
      const patches = await storage.getMediaPatches();
      res.json(patches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Media Patches" });
    }
  });

  app.get("/api/media-patches/:id", async (req, res) => {
    try {
      const patch = await storage.getMediaPatch(req.params.id);
      if (!patch) return res.status(404).json({ error: "Not found" });
      res.json(patch);
    } catch {
      res.status(500).json({ error: "Failed to fetch Media Patch" });
    }
  });

  app.post("/api/media-patches", requireAuth, async (req: any, res) => {
    try {
      const patch = await storage.createMediaPatch(req.body);
      res.status(201).json(patch);
    } catch {
      res.status(500).json({ error: "Failed to create Media Patch" });
    }
  });

  // Legacy alias
  app.get("/api/showcase", async (req, res) => {
    try {
      res.json(await storage.getShowcaseProjects());
    } catch {
      res.status(500).json({ error: "Failed to fetch showcase" });
    }
  });

  // ── Reboot Projects ────────────────────────────────────────────────────
  app.post("/api/projects", requireAuth, async (req: any, res) => {
    try {
      const data = insertRebootProjectSchema.parse(req.body);
      const project = await storage.createRebootProject(data);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError)
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.get("/api/projects", requireAuth, async (req: any, res) => {
    try {
      res.json(await storage.getRebootProjects());
    } catch {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      const project = await storage.getRebootProject(req.params.id);
      if (!project) return res.status(404).json({ error: "Not found" });
      res.json(project);
    } catch {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // ── Contact ────────────────────────────────────────────────────────────
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(data);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError)
        return res.status(400).json({ error: "Invalid contact data", details: error.errors });
      res.status(500).json({ error: "Failed to submit contact" });
    }
  });

  // ── Mission Progress ───────────────────────────────────────────────────
  app.get("/api/mission-progress", requireAuth, async (req: any, res) => {
    try {
      res.json(await storage.getMissionProgress(req.userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch mission progress" });
    }
  });

  app.post("/api/mission-progress", requireAuth, async (req: any, res) => {
    try {
      const { missionId, status, notes } = req.body;
      if (!missionId || !status) return res.status(400).json({ error: "missionId and status required" });
      const row = await storage.upsertMissionProgress(req.userId, missionId, status, notes);
      if (status === "completed") await storage.awardXp(req.userId, "mission_complete");
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to save mission progress" });
    }
  });

  // ── Power Pings ────────────────────────────────────────────────────────
  app.get("/api/power-pings", requireAuth, async (req: any, res) => {
    try {
      res.json(await storage.getPowerPings(req.userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch power pings" });
    }
  });

  app.post("/api/power-pings", requireAuth, async (req: any, res) => {
    try {
      const ping = await storage.createPowerPing(req.userId, req.body);
      await storage.awardXp(req.userId, "power_ping");
      res.status(201).json(ping);
    } catch {
      res.status(500).json({ error: "Failed to create power ping" });
    }
  });

  app.patch("/api/admin/power-pings/:id", requireAdmin, async (req: any, res) => {
    try {
      const ping = await storage.updatePowerPingStatus(req.params.id, req.body.status, req.body.responseNotes);
      res.json(ping);
    } catch {
      res.status(500).json({ error: "Failed to update power ping" });
    }
  });

  // ── Evidence Receipts ──────────────────────────────────────────────────
  app.post("/api/evidence-receipts", requireAuth, async (req: any, res) => {
    try {
      const receipt = await storage.createEvidenceReceipt(req.userId, req.body);
      await storage.awardXp(req.userId, "evidence_receipt");
      res.status(201).json(receipt);
    } catch {
      res.status(500).json({ error: "Failed to create evidence receipt" });
    }
  });

  app.get("/api/evidence-receipts", requireAuth, async (req: any, res) => {
    try {
      res.json(await storage.getEvidenceReceipts(req.userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch evidence receipts" });
    }
  });

  app.get("/api/evidence-receipts/:id", async (req, res) => {
    try {
      const receipt = await storage.getEvidenceReceipt(req.params.id);
      if (!receipt || !receipt.isPublic) return res.status(404).json({ error: "Not found" });
      res.json(receipt);
    } catch {
      res.status(500).json({ error: "Failed to fetch receipt" });
    }
  });

  // ── Reboot Room Responses ──────────────────────────────────────────────
  app.post("/api/reboot-room/respond", async (req, res) => {
    try {
      const auth = getAuth(req);
      const { patchId, action, comment, location, isAnonymous } = req.body;
      if (!patchId || !action) return res.status(400).json({ error: "patchId and action required" });
      const response = await storage.createRebootRoomResponse({
        patchId,
        clerkUserId: auth?.userId ?? undefined,
        action,
        comment,
        location,
        isAnonymous: isAnonymous ?? !auth?.userId,
      });
      if (auth?.userId) await storage.awardXp(auth.userId, "reboot_response");
      res.status(201).json(response);
    } catch {
      res.status(500).json({ error: "Failed to submit response" });
    }
  });

  app.get("/api/reboot-room/responses/:patchId", async (req, res) => {
    try {
      res.json(await storage.getRebootRoomResponses(req.params.patchId));
    } catch {
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  });

  // ── Admin ──────────────────────────────────────────────────────────────
  app.get("/api/admin/patches", requireAdmin, async (req: any, res) => {
    try {
      res.json(await storage.getMediaPatches());
    } catch {
      res.status(500).json({ error: "Failed to fetch patches" });
    }
  });

  app.patch("/api/admin/patches/:id", requireAdmin, async (req: any, res) => {
    try {
      const patch = await storage.updateMediaPatch(req.params.id, req.body);
      res.json(patch);
    } catch {
      res.status(500).json({ error: "Failed to update patch" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req: any, res) => {
    try {
      res.json(await storage.getAllUserProfiles());
    } catch {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/power-pings", requireAdmin, async (req: any, res) => {
    try {
      res.json(await storage.getPowerPings());
    } catch {
      res.status(500).json({ error: "Failed to fetch power pings" });
    }
  });

  return httpServer;
}
