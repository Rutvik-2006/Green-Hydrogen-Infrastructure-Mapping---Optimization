import { LatLng, LatLngBounds } from "leaflet";
import { HydrogenAsset, RenewableSource, DemandCenter } from "@shared/schema";

export interface MapBounds {
  northEast: [number, number];
  southWest: [number, number];
}

export class MapUtils {
  /**
   * Calculate the optimal map bounds to fit all assets
   */
  static calculateBounds(
    assets: (HydrogenAsset | RenewableSource | DemandCenter)[]
  ): MapBounds | null {
    if (assets.length === 0) return null;

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    assets.forEach(asset => {
      minLat = Math.min(minLat, asset.latitude);
      maxLat = Math.max(maxLat, asset.latitude);
      minLng = Math.min(minLng, asset.longitude);
      maxLng = Math.max(maxLng, asset.longitude);
    });

    // Add some padding
    const latPadding = (maxLat - minLat) * 0.1;
    const lngPadding = (maxLng - minLng) * 0.1;

    return {
      northEast: [maxLat + latPadding, maxLng + lngPadding],
      southWest: [minLat - latPadding, minLng - lngPadding],
    };
  }

  /**
   * Calculate distance between two points in kilometers
   */
  static calculateDistance(
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

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Find assets within a given radius of a point
   */
  static findAssetsWithinRadius<T extends { latitude: number; longitude: number }>(
    assets: T[],
    centerLat: number,
    centerLng: number,
    radiusKm: number
  ): T[] {
    return assets.filter(asset => {
      const distance = this.calculateDistance(
        centerLat,
        centerLng,
        asset.latitude,
        asset.longitude
      );
      return distance <= radiusKm;
    });
  }

  /**
   * Generate pipeline coordinates between assets
   */
  static generatePipelineNetwork(assets: HydrogenAsset[]): Array<[number, number][]> {
    const pipelines: Array<[number, number][]> = [];
    const plants = assets.filter(asset => asset.type === 'plant');
    const storage = assets.filter(asset => asset.type === 'storage');

    // Connect plants to nearest storage facilities
    plants.forEach(plant => {
      let nearestStorage: HydrogenAsset | null = null;
      let minDistance = Infinity;

      storage.forEach(storageAsset => {
        const distance = this.calculateDistance(
          plant.latitude,
          plant.longitude,
          storageAsset.latitude,
          storageAsset.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestStorage = storageAsset;
        }
      });

      if (nearestStorage !== null && minDistance < 200) { // Only connect if within 200km
        pipelines.push([
          [plant.latitude, plant.longitude],
          [nearestStorage.latitude, nearestStorage.longitude],
        ]);
      }
    });

    return pipelines;
  }

  /**
   * Get the center point of a collection of assets
   */
  static getCenter(
    assets: (HydrogenAsset | RenewableSource | DemandCenter)[]
  ): [number, number] {
    if (assets.length === 0) return [23.0, 72.0]; // Default to India center

    const totalLat = assets.reduce((sum, asset) => sum + asset.latitude, 0);
    const totalLng = assets.reduce((sum, asset) => sum + asset.longitude, 0);

    return [totalLat / assets.length, totalLng / assets.length];
  }

  /**
   * Format coordinates for display
   */
  static formatCoordinates(lat: number, lng: number): string {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const lngDirection = lng >= 0 ? 'E' : 'W';
    
    return `${Math.abs(lat).toFixed(4)}°${latDirection}, ${Math.abs(lng).toFixed(4)}°${lngDirection}`;
  }

  /**
   * Validate coordinates
   */
  static isValidCoordinate(lat: number, lng: number): boolean {
    return (
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      !isNaN(lat) &&
      !isNaN(lng)
    );
  }
}
