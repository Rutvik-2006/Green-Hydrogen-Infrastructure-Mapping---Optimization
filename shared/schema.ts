import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hydrogenAssets = pgTable("hydrogen_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // "plant", "storage", "pipeline", "hub"
  subtype: text("subtype"), // "electrolysis", "steam_reforming", etc.
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  capacity: text("capacity"), // e.g., "150 MW", "500 tons"
  status: text("status").notNull(), // "operational", "under_construction", "planned"
  annualOutput: text("annual_output"),
  investmentCost: real("investment_cost"),
  operationalDate: timestamp("operational_date"),
  owner: text("owner"),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

export const renewableSources = pgTable("renewable_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // "solar", "wind", "hydro"
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  capacity: text("capacity").notNull(), // e.g., "2.2 GW"
  status: text("status").notNull(),
  owner: text("owner"),
  created_at: timestamp("created_at").defaultNow(),
});

export const demandCenters = pgTable("demand_centers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // "industrial", "transportation", "residential"
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  annualDemand: real("annual_demand"), // tons H2/year
  priority: text("priority").notNull(), // "high", "medium", "low"
  created_at: timestamp("created_at").defaultNow(),
});

export const siteRecommendations = pgTable("site_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  score: integer("score").notNull(), // 0-100
  estimatedCost: real("estimated_cost"),
  timeline: text("timeline"),
  criteria: text("criteria").array(), // ["renewable_proximity", "market_demand", etc.]
  tags: text("tags").array(),
  investmentRange: text("investment_range"),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertHydrogenAssetSchema = createInsertSchema(hydrogenAssets).omit({
  id: true,
  created_at: true,
});

export const insertRenewableSourceSchema = createInsertSchema(renewableSources).omit({
  id: true,
  created_at: true,
});

export const insertDemandCenterSchema = createInsertSchema(demandCenters).omit({
  id: true,
  created_at: true,
});

export const insertSiteRecommendationSchema = createInsertSchema(siteRecommendations).omit({
  id: true,
  created_at: true,
});

// Types
export type HydrogenAsset = typeof hydrogenAssets.$inferSelect;
export type InsertHydrogenAsset = z.infer<typeof insertHydrogenAssetSchema>;

export type RenewableSource = typeof renewableSources.$inferSelect;
export type InsertRenewableSource = z.infer<typeof insertRenewableSourceSchema>;

export type DemandCenter = typeof demandCenters.$inferSelect;
export type InsertDemandCenter = z.infer<typeof insertDemandCenterSchema>;

export type SiteRecommendation = typeof siteRecommendations.$inferSelect;
export type InsertSiteRecommendation = z.infer<typeof insertSiteRecommendationSchema>;

// Optimization criteria enum
export const OptimizationCriteria = {
  RENEWABLE_PROXIMITY: "renewable_proximity",
  MARKET_DEMAND: "market_demand",
  COST_OPTIMIZATION: "cost_optimization",
  REGULATORY_ZONES: "regulatory_zones",
  TRANSPORT_ACCESS: "transport_access",
} as const;

export type OptimizationCriteria = typeof OptimizationCriteria[keyof typeof OptimizationCriteria];
