import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHydrogenAssetSchema, insertRenewableSourceSchema, insertDemandCenterSchema, OptimizationCriteria } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hydrogen Assets
  app.get("/api/hydrogen-assets", async (req, res) => {
    try {
      const assets = await storage.getHydrogenAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hydrogen assets" });
    }
  });

  app.get("/api/hydrogen-assets/:id", async (req, res) => {
    try {
      const asset = await storage.getHydrogenAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hydrogen asset" });
    }
  });

  app.post("/api/hydrogen-assets", async (req, res) => {
    try {
      const validatedData = insertHydrogenAssetSchema.parse(req.body);
      const asset = await storage.createHydrogenAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      res.status(400).json({ message: "Invalid asset data", error });
    }
  });

  // Renewable Sources
  app.get("/api/renewable-sources", async (req, res) => {
    try {
      const sources = await storage.getRenewableSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch renewable sources" });
    }
  });

  app.get("/api/renewable-sources/:id", async (req, res) => {
    try {
      const source = await storage.getRenewableSource(req.params.id);
      if (!source) {
        return res.status(404).json({ message: "Renewable source not found" });
      }
      res.json(source);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch renewable source" });
    }
  });

  app.post("/api/renewable-sources", async (req, res) => {
    try {
      const validatedData = insertRenewableSourceSchema.parse(req.body);
      const source = await storage.createRenewableSource(validatedData);
      res.status(201).json(source);
    } catch (error) {
      res.status(400).json({ message: "Invalid renewable source data", error });
    }
  });

  // Demand Centers
  app.get("/api/demand-centers", async (req, res) => {
    try {
      const centers = await storage.getDemandCenters();
      res.json(centers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demand centers" });
    }
  });

  app.get("/api/demand-centers/:id", async (req, res) => {
    try {
      const center = await storage.getDemandCenter(req.params.id);
      if (!center) {
        return res.status(404).json({ message: "Demand center not found" });
      }
      res.json(center);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demand center" });
    }
  });

  app.post("/api/demand-centers", async (req, res) => {
    try {
      const validatedData = insertDemandCenterSchema.parse(req.body);
      const center = await storage.createDemandCenter(validatedData);
      res.status(201).json(center);
    } catch (error) {
      res.status(400).json({ message: "Invalid demand center data", error });
    }
  });

  // Site Recommendations
  app.get("/api/site-recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getSiteRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site recommendations" });
    }
  });

  app.post("/api/site-recommendations/generate", async (req, res) => {
    try {
      const { criteria, investmentRange } = req.body;
      
      if (!criteria || !Object.values(OptimizationCriteria).includes(criteria)) {
        return res.status(400).json({ message: "Valid optimization criteria required" });
      }
      
      if (!investmentRange) {
        return res.status(400).json({ message: "Investment range required" });
      }

      const recommendations = await storage.generateSiteRecommendations(criteria, investmentRange);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate site recommendations", error });
    }
  });

  // Export functionality
  app.get("/api/export/analysis", async (req, res) => {
    try {
      const [assets, renewables, demands, recommendations] = await Promise.all([
        storage.getHydrogenAssets(),
        storage.getRenewableSources(),
        storage.getDemandCenters(),
        storage.getSiteRecommendations()
      ]);

      const analysisData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalAssets: assets.length,
          totalRenewables: renewables.length,
          totalDemandCenters: demands.length,
          totalRecommendations: recommendations.length
        },
        assets,
        renewables,
        demands,
        recommendations
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=hydrogen-infrastructure-analysis.json');
      res.json(analysisData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export analysis data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
