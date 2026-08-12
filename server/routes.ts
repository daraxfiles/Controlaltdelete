import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRebootProjectSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed sample Media Patches on startup
  await storage.initializeSampleMediaPatches();

  // ── Media Patches ──────────────────────────────────────────────────────
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
      if (!patch) {
        res.status(404).json({ error: "Media Patch not found" });
        return;
      }
      res.json(patch);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Media Patch" });
    }
  });

  // Legacy alias
  app.get("/api/showcase", async (req, res) => {
    try {
      const patches = await storage.getShowcaseProjects();
      res.json(patches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch showcase" });
    }
  });

  // ── Reboot Projects ────────────────────────────────────────────────────
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertRebootProjectSchema.parse(req.body);
      const project = await storage.createRebootProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid project data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getRebootProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getRebootProject(req.params.id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // ── Contact ────────────────────────────────────────────────────────────
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid contact data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact" });
      }
    }
  });

  return httpServer;
}
