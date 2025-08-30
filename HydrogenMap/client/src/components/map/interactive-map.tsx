import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { ZoomIn, ZoomOut, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HydrogenAsset, RenewableSource, DemandCenter } from "@shared/schema";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface InteractiveMapProps {
  hydrogenAssets: HydrogenAsset[];
  renewableSources: RenewableSource[];
  demandCenters: DemandCenter[];
  visibleLayers: Record<string, boolean>;
  onAssetClick: (asset: HydrogenAsset) => void;
  searchQuery: string;
}

// Custom marker icons
const createCustomIcon = (color: string, symbol: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${symbol}</div>`,
    iconSize: [24, 24],
    className: 'custom-div-icon'
  });
};

const icons = {
  plant: createCustomIcon('hsl(210, 100%, 40%)', 'H'),
  storage: createCustomIcon('hsl(174, 100%, 20%)', 'S'),
  renewable: createCustomIcon('hsl(122, 39%, 49%)', 'R'),
  demand: createCustomIcon('hsl(0, 84%, 60%)', 'D'),
};

export default function InteractiveMap({
  hydrogenAssets,
  renewableSources,
  demandCenters,
  visibleLayers,
  onAssetClick,
  searchQuery,
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map>(null);
  const [mapCenter] = useState<LatLngExpression>([23.0, 72.0]);

  // Filter assets based on search query
  const filteredAssets = hydrogenAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRenewables = renewableSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, 8);
    }
  };

  // Mock pipeline data - in a real app, this would come from the backend
  const pipelineCoords: LatLngExpression[][] = [
    [[22.34516, 69.85960], [21.7294, 72.6642]],
    [[22.7460, 69.7000], [23.017, 70.217]],
    [[17.6868, 83.2185], [20.2869, 86.6740]]
  ];

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={mapCenter}
        zoom={8}
        className="h-full w-full"
        ref={mapRef}
        data-testid="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hydrogen Plants */}
        {visibleLayers.plants &&
          filteredAssets
            .filter(asset => asset.type === 'plant')
            .map((asset) => (
              <Marker
                key={asset.id}
                position={[asset.latitude, asset.longitude]}
                icon={icons.plant}
                eventHandlers={{
                  click: () => onAssetClick(asset),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-medium text-sm mb-1">{asset.name}</h4>
                    <p className="text-xs text-muted-foreground">Type: {asset.subtype || asset.type}</p>
                    {asset.capacity && (
                      <p className="text-xs text-muted-foreground">Capacity: {asset.capacity}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Status: {asset.status}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {asset.status === 'operational' ? 'Online' : asset.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => onAssetClick(asset)}
                      data-testid={`button-view-details-${asset.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* Storage Facilities */}
        {visibleLayers.storage &&
          filteredAssets
            .filter(asset => asset.type === 'storage')
            .map((asset) => (
              <Marker
                key={asset.id}
                position={[asset.latitude, asset.longitude]}
                icon={icons.storage}
                eventHandlers={{
                  click: () => onAssetClick(asset),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-medium text-sm mb-1">{asset.name}</h4>
                    {asset.capacity && (
                      <p className="text-xs text-muted-foreground">Capacity: {asset.capacity}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Status: {asset.status}</p>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => onAssetClick(asset)}
                      data-testid={`button-view-details-${asset.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* Renewable Sources */}
        {visibleLayers.renewables &&
          filteredRenewables.map((source) => (
            <Marker
              key={source.id}
              position={[source.latitude, source.longitude]}
              icon={icons.renewable}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h4 className="font-medium text-sm mb-1">{source.name}</h4>
                  <p className="text-xs text-muted-foreground">Type: {source.type}</p>
                  <p className="text-xs text-muted-foreground">Capacity: {source.capacity}</p>
                  <p className="text-xs text-muted-foreground">Status: {source.status}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {source.type === 'solar' ? '☀️ Solar' : '💨 Wind'}
                    </Badge>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Demand Centers */}
        {demandCenters.map((center) => (
          <Marker
            key={center.id}
            position={[center.latitude, center.longitude]}
            icon={icons.demand}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h4 className="font-medium text-sm mb-1">{center.name}</h4>
                <p className="text-xs text-muted-foreground">Type: {center.type}</p>
                {center.annualDemand && (
                  <p className="text-xs text-muted-foreground">
                    Annual Demand: {center.annualDemand.toLocaleString()} tons H2/year
                  </p>
                )}
                <div className="mt-2">
                  <Badge
                    variant={center.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {center.priority} priority
                  </Badge>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Pipeline Network */}
        {visibleLayers.pipelines &&
          pipelineCoords.map((coords, index) => (
            <Polyline
              key={index}
              positions={coords}
              color="hsl(122, 39%, 49%)"
              weight={4}
              opacity={0.7}
              dashArray="10, 5"
            />
          ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-card rounded-lg shadow-lg border border-border p-2 space-y-2 z-[1000]">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomIn}
          className="w-8 h-8 p-0"
          data-testid="button-zoom-in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomOut}
          className="w-8 h-8 p-0"
          data-testid="button-zoom-out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCenterMap}
          className="w-8 h-8 p-0"
          data-testid="button-center-map"
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card rounded-lg shadow-lg border border-border p-4 z-[1000] max-w-xs">
        <h4 className="text-sm font-medium text-foreground mb-3" data-testid="legend-title">
          Infrastructure Legend
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Hydrogen Production Plants</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-muted-foreground">Storage Facilities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Pipeline Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-muted-foreground">Distribution Hubs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-muted-foreground">Renewable Energy Sources</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-muted-foreground">Demand Centers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
