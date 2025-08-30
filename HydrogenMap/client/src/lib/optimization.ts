import { HydrogenAsset, RenewableSource, DemandCenter, OptimizationCriteria } from "@shared/schema";

export interface SiteScore {
  latitude: number;
  longitude: number;
  score: number;
  factors: {
    renewableProximity: number;
    marketDemand: number;
    costOptimization: number;
    transportAccess: number;
    regulatoryCompliance: number;
  };
}

export class OptimizationEngine {
  private hydrogenAssets: HydrogenAsset[];
  private renewableSources: RenewableSource[];
  private demandCenters: DemandCenter[];

  constructor(
    hydrogenAssets: HydrogenAsset[],
    renewableSources: RenewableSource[],
    demandCenters: DemandCenter[]
  ) {
    this.hydrogenAssets = hydrogenAssets;
    this.renewableSources = renewableSources;
    this.demandCenters = demandCenters;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateRenewableProximity(lat: number, lon: number): number {
    const distances = this.renewableSources.map(source =>
      this.calculateDistance(lat, lon, source.latitude, source.longitude)
    );
    
    const minDistance = Math.min(...distances);
    // Score inversely related to distance, max score at 0km, min score at 200km
    return Math.max(0, 100 - (minDistance / 200) * 100);
  }

  private calculateMarketDemand(lat: number, lon: number): number {
    let totalScore = 0;
    let totalWeight = 0;

    this.demandCenters.forEach(center => {
      const distance = this.calculateDistance(lat, lon, center.latitude, center.longitude);
      const weight = center.annualDemand || 1000;
      const priorityMultiplier = center.priority === 'high' ? 2 : center.priority === 'medium' ? 1.5 : 1;
      
      // Score based on demand and distance
      const proximityScore = Math.max(0, 100 - (distance / 100) * 100);
      const demandScore = proximityScore * priorityMultiplier;
      
      totalScore += demandScore * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private calculateCostOptimization(lat: number, lon: number): number {
    // Mock cost calculation based on distance to existing infrastructure
    const existingAssets = this.hydrogenAssets.filter(asset => asset.status === 'operational');
    
    if (existingAssets.length === 0) return 50; // Neutral score if no existing infrastructure
    
    const distances = existingAssets.map(asset =>
      this.calculateDistance(lat, lon, asset.latitude, asset.longitude)
    );
    
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    
    // Optimal distance is around 50km - close enough for synergy, far enough to avoid competition
    const optimalDistance = 50;
    const deviation = Math.abs(avgDistance - optimalDistance);
    
    return Math.max(0, 100 - (deviation / 100) * 100);
  }

  private calculateTransportAccess(lat: number, lon: number): number {
    // Mock transport access calculation
    // In a real implementation, this would consider highways, ports, rail access
    
    // Simplified calculation based on distance to major hubs (demand centers as proxy)
    const hubDistances = this.demandCenters.map(center =>
      this.calculateDistance(lat, lon, center.latitude, center.longitude)
    );
    
    const minHubDistance = Math.min(...hubDistances);
    return Math.max(0, 100 - (minHubDistance / 150) * 100);
  }

  private calculateRegulatoryCompliance(lat: number, lon: number): number {
    // Mock regulatory compliance score
    // In reality, this would consider zoning laws, environmental regulations, etc.
    
    // For this example, assume higher scores in industrial areas (closer to demand centers)
    return this.calculateMarketDemand(lat, lon) * 0.8; // 80% correlation with market demand
  }

  public calculateSiteScore(
    lat: number,
    lon: number,
    criteria: OptimizationCriteria
  ): SiteScore {
    const factors = {
      renewableProximity: this.calculateRenewableProximity(lat, lon),
      marketDemand: this.calculateMarketDemand(lat, lon),
      costOptimization: this.calculateCostOptimization(lat, lon),
      transportAccess: this.calculateTransportAccess(lat, lon),
      regulatoryCompliance: this.calculateRegulatoryCompliance(lat, lon),
    };

    let weightedScore = 0;
    
    // Apply different weights based on primary criteria
    switch (criteria) {
      case 'renewable_proximity':
        weightedScore = 
          factors.renewableProximity * 0.4 +
          factors.marketDemand * 0.2 +
          factors.costOptimization * 0.2 +
          factors.transportAccess * 0.1 +
          factors.regulatoryCompliance * 0.1;
        break;
      case 'market_demand':
        weightedScore = 
          factors.renewableProximity * 0.2 +
          factors.marketDemand * 0.4 +
          factors.costOptimization * 0.15 +
          factors.transportAccess * 0.15 +
          factors.regulatoryCompliance * 0.1;
        break;
      case 'cost_optimization':
        weightedScore = 
          factors.renewableProximity * 0.2 +
          factors.marketDemand * 0.2 +
          factors.costOptimization * 0.4 +
          factors.transportAccess * 0.1 +
          factors.regulatoryCompliance * 0.1;
        break;
      case 'transport_access':
        weightedScore = 
          factors.renewableProximity * 0.15 +
          factors.marketDemand * 0.25 +
          factors.costOptimization * 0.15 +
          factors.transportAccess * 0.35 +
          factors.regulatoryCompliance * 0.1;
        break;
      default:
        // Equal weighting for other criteria
        weightedScore = Object.values(factors).reduce((a, b) => a + b, 0) / 5;
    }

    return {
      latitude: lat,
      longitude: lon,
      score: Math.round(weightedScore),
      factors,
    };
  }

  public findOptimalSites(
    criteria: OptimizationCriteria,
    numberOfSites: number = 10
  ): SiteScore[] {
    const candidates: SiteScore[] = [];
    
    // Generate candidate sites in a grid pattern around India
    const bounds = {
      minLat: 8.0,
      maxLat: 37.0,
      minLon: 68.0,
      maxLon: 97.0,
    };
    
    const step = 0.2; // Grid resolution in degrees
    
    for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += step) {
      for (let lon = bounds.minLon; lon <= bounds.maxLon; lon += step) {
        // Skip if too close to existing assets
        const tooClose = this.hydrogenAssets.some(asset =>
          this.calculateDistance(lat, lon, asset.latitude, asset.longitude) < 10
        );
        
        if (!tooClose) {
          const score = this.calculateSiteScore(lat, lon, criteria);
          candidates.push(score);
        }
      }
    }
    
    // Sort by score and return top sites
    return candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, numberOfSites);
  }
}
