import { 
  type HydrogenAsset, 
  type InsertHydrogenAsset,
  type RenewableSource,
  type InsertRenewableSource,
  type DemandCenter,
  type InsertDemandCenter,
  type SiteRecommendation,
  type InsertSiteRecommendation,
  type OptimizationCriteria
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Hydrogen Assets
  getHydrogenAssets(): Promise<HydrogenAsset[]>;
  getHydrogenAsset(id: string): Promise<HydrogenAsset | undefined>;
  createHydrogenAsset(asset: InsertHydrogenAsset): Promise<HydrogenAsset>;
  
  // Renewable Sources
  getRenewableSources(): Promise<RenewableSource[]>;
  getRenewableSource(id: string): Promise<RenewableSource | undefined>;
  createRenewableSource(source: InsertRenewableSource): Promise<RenewableSource>;
  
  // Demand Centers
  getDemandCenters(): Promise<DemandCenter[]>;
  getDemandCenter(id: string): Promise<DemandCenter | undefined>;
  createDemandCenter(center: InsertDemandCenter): Promise<DemandCenter>;
  
  // Site Recommendations
  getSiteRecommendations(): Promise<SiteRecommendation[]>;
  generateSiteRecommendations(criteria: OptimizationCriteria, investmentRange: string): Promise<SiteRecommendation[]>;
  createSiteRecommendation(recommendation: InsertSiteRecommendation): Promise<SiteRecommendation>;
}

export class MemStorage implements IStorage {
  private hydrogenAssets: Map<string, HydrogenAsset> = new Map();
  private renewableSources: Map<string, RenewableSource> = new Map();
  private demandCenters: Map<string, DemandCenter> = new Map();
  private siteRecommendations: Map<string, SiteRecommendation> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed hydrogen assets
    const assets: Omit<HydrogenAsset, 'id' | 'created_at'>[] = [
      {
        name: "Jamnagar Green Hydrogen Plant",
        type: "plant",
        subtype: "electrolysis",
        latitude: 22.34516,
        longitude: 69.85960,
        capacity: "200 MW",
        status: "under_construction",
        annualOutput: "18,000 tons H2/year",
        investmentCost: 6250000000,
        operationalDate: new Date('2025-03-01'),
        owner: "Reliance Industries",
        description: "Large-scale green hydrogen production facility at Jamnagar refinery complex"
      },
      {
        name: "Mundra Hydrogen Hub",
        type: "plant",
        subtype: "electrolysis",
        latitude: 22.7460,
        longitude: 69.7000,
        capacity: "300 MW",
        status: "planned",
        annualOutput: "25,000 tons H2/year",
        investmentCost: 10000000000,
        operationalDate: new Date('2026-01-01'),
        owner: "Adani Green Energy",
        description: "Integrated green hydrogen production and export facility at Mundra Port"
      },
      {
        name: "Dahej Storage Terminal",
        type: "storage",
        subtype: null,
        latitude: 21.7294,
        longitude: 72.6642,
        capacity: "800 tons",
        status: "operational",
        annualOutput: null,
        investmentCost: 2900000000,
        operationalDate: new Date('2023-08-15'),
        owner: "GAIL India",
        description: "Industrial hydrogen storage facility at Dahej petrochemical complex"
      },
      {
        name: "Visakhapatnam Storage Hub",
        type: "storage",
        subtype: null,
        latitude: 17.6868,
        longitude: 83.2185,
        capacity: "600 tons",
        status: "under_construction",
        annualOutput: null,
        investmentCost: 2330000000,
        operationalDate: new Date('2024-11-01'),
        owner: "HPCL",
        description: "Coastal hydrogen storage and distribution hub"
      }
    ];

    assets.forEach(asset => {
      const id = randomUUID();
      this.hydrogenAssets.set(id, {
        ...asset,
        id,
        created_at: new Date()
      });
    });

    // Seed renewable sources
    const renewables: Omit<RenewableSource, 'id' | 'created_at'>[] = [
      {
        name: "Bhadla Solar Park",
        type: "solar",
        latitude: 27.4720,
        longitude: 71.9600,
        capacity: "2.25 GW",
        status: "operational",
        owner: "Solar Energy Corporation of India"
      },
      {
        name: "Charanka Solar Park",
        type: "solar",
        latitude: 23.9080,
        longitude: 71.2160,
        capacity: "790 MW",
        status: "operational",
        owner: "Gujarat Solar Park"
      },
      {
        name: "Bhuj Wind Cluster",
        type: "wind",
        latitude: 23.1312,
        longitude: 68.9296,
        capacity: "1.2 GW",
        status: "operational",
        owner: "Kutch Wind Power"
      }
    ];

    renewables.forEach(renewable => {
      const id = randomUUID();
      this.renewableSources.set(id, {
        ...renewable,
        id,
        created_at: new Date()
      });
    });

    // Seed demand centers
    const demands: Omit<DemandCenter, 'id' | 'created_at'>[] = [
      {
        name: "Deendayal Port Authority",
        type: "transportation",
        latitude: 23.017,
        longitude: 70.217,
        annualDemand: 15000,
        priority: "high"
      },
      {
        name: "Tuticorin Port Industrial Complex",
        type: "industrial",
        latitude: 8.7642,
        longitude: 78.1348,
        annualDemand: 10000,
        priority: "high"
      },
      {
        name: "Paradeep Port Steel Hub",
        type: "industrial",
        latitude: 20.2869,
        longitude: 86.6740,
        annualDemand: 12000,
        priority: "medium"
      }
    ];

    demands.forEach(demand => {
      const id = randomUUID();
      this.demandCenters.set(id, {
        ...demand,
        id,
        created_at: new Date()
      });
    });
  }

  async getHydrogenAssets(): Promise<HydrogenAsset[]> {
    return Array.from(this.hydrogenAssets.values());
  }

  async getHydrogenAsset(id: string): Promise<HydrogenAsset | undefined> {
    return this.hydrogenAssets.get(id);
  }

  async createHydrogenAsset(insertAsset: InsertHydrogenAsset): Promise<HydrogenAsset> {
    const id = randomUUID();
    const asset: HydrogenAsset = {
      ...insertAsset,
      id,
      created_at: new Date(),
      description: insertAsset.description ?? null,
      subtype: insertAsset.subtype ?? null,
      capacity: insertAsset.capacity ?? null,
      annualOutput: insertAsset.annualOutput ?? null,
      investmentCost: insertAsset.investmentCost ?? null,
      operationalDate: insertAsset.operationalDate ?? null,
      owner: insertAsset.owner ?? null
    };
    this.hydrogenAssets.set(id, asset);
    return asset;
  }

  async getRenewableSources(): Promise<RenewableSource[]> {
    return Array.from(this.renewableSources.values());
  }

  async getRenewableSource(id: string): Promise<RenewableSource | undefined> {
    return this.renewableSources.get(id);
  }

  async createRenewableSource(insertSource: InsertRenewableSource): Promise<RenewableSource> {
    const id = randomUUID();
    const source: RenewableSource = {
      ...insertSource,
      id,
      created_at: new Date(),
      owner: insertSource.owner ?? null
    };
    this.renewableSources.set(id, source);
    return source;
  }

  async getDemandCenters(): Promise<DemandCenter[]> {
    return Array.from(this.demandCenters.values());
  }

  async getDemandCenter(id: string): Promise<DemandCenter | undefined> {
    return this.demandCenters.get(id);
  }

  async createDemandCenter(insertCenter: InsertDemandCenter): Promise<DemandCenter> {
    const id = randomUUID();
    const center: DemandCenter = {
      ...insertCenter,
      id,
      created_at: new Date(),
      annualDemand: insertCenter.annualDemand ?? null
    };
    this.demandCenters.set(id, center);
    return center;
  }

  async getSiteRecommendations(): Promise<SiteRecommendation[]> {
    return Array.from(this.siteRecommendations.values());
  }

  async generateSiteRecommendations(
    criteria: OptimizationCriteria, 
    investmentRange: string
  ): Promise<SiteRecommendation[]> {
    // Clear existing recommendations
    this.siteRecommendations.clear();

    // Generate new recommendations based on criteria
    const recommendations = this.calculateOptimalSites(criteria, investmentRange);
    
    recommendations.forEach(rec => {
      const id = randomUUID();
      const recommendation: SiteRecommendation = {
        ...rec,
        id,
        created_at: new Date()
      };
      this.siteRecommendations.set(id, recommendation);
    });

    return recommendations.map(rec => ({
      ...rec,
      id: randomUUID(),
      created_at: new Date()
    }));
  }

  private calculateOptimalSites(
    criteria: OptimizationCriteria,
    investmentRange: string
  ): Omit<SiteRecommendation, 'id' | 'created_at'>[] {
    // Mock optimization algorithm - in reality this would be much more sophisticated
    const potentialSites = [
      {
        name: "Gujarat Industrial Corridor",
        latitude: 23.5,
        longitude: 70.5,
        score: 92,
        estimatedCost: 4580000000,
        timeline: "18 months",
        criteria: [criteria],
        tags: ["High Demand", "Near Renewables"],
        investmentRange
      },
      {
        name: "Tamil Nadu Coastal Hub",
        latitude: 11.5,
        longitude: 79.0,
        score: 87,
        estimatedCost: 4000000000,
        timeline: "24 months",
        criteria: [criteria],
        tags: ["Port Access", "Industrial Zone"],
        investmentRange
      },
      {
        name: "Rajasthan Solar Zone",
        latitude: 26.0,
        longitude: 72.0,
        score: 84,
        estimatedCost: 3500000000,
        timeline: "15 months",
        criteria: [criteria],
        tags: ["Solar Rich", "Government Support"],
        investmentRange
      }
    ];

    // Filter based on investment range
    const [min, max] = this.parseInvestmentRange(investmentRange);
    return potentialSites
      .filter(site => site.estimatedCost >= min && site.estimatedCost <= max)
      .sort((a, b) => b.score - a.score);
  }

  private parseInvestmentRange(range: string): [number, number] {
    switch (range) {
      case "₹10L - ₹50L":
        return [1000000, 5000000];
      case "₹50L - ₹100L":
        return [5000000, 10000000];
      case "₹100L+":
        return [10000000, Infinity];
      default:
        return [0, Infinity];
    }
  }

  async createSiteRecommendation(insertRec: InsertSiteRecommendation): Promise<SiteRecommendation> {
    const id = randomUUID();
    const recommendation: SiteRecommendation = {
      ...insertRec,
      id,
      created_at: new Date(),
      estimatedCost: insertRec.estimatedCost ?? null,
      timeline: insertRec.timeline ?? null,
      criteria: insertRec.criteria ?? null,
      tags: insertRec.tags ?? null,
      investmentRange: insertRec.investmentRange ?? null
    };
    this.siteRecommendations.set(id, recommendation);
    return recommendation;
  }
}

export const storage = new MemStorage();
