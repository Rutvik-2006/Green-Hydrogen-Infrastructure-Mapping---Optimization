import { Fuel, Database, Activity, MapPin, Sun } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { HydrogenAsset, RenewableSource } from "@shared/schema";

interface LayerControlsProps {
  visibleLayers: Record<string, boolean>;
  onLayerToggle: (layers: Record<string, boolean>) => void;
  hydrogenAssets: HydrogenAsset[];
  renewableSources: RenewableSource[];
}

export default function LayerControls({
  visibleLayers,
  onLayerToggle,
  hydrogenAssets,
  renewableSources,
}: LayerControlsProps) {
  const handleLayerToggle = (layerKey: string, checked: boolean) => {
    onLayerToggle({
      ...visibleLayers,
      [layerKey]: checked,
    });
  };

  const plantsCount = hydrogenAssets.filter(asset => asset.type === 'plant').length;
  const storageCount = hydrogenAssets.filter(asset => asset.type === 'storage').length;
  const pipelinesCount = hydrogenAssets.filter(asset => asset.type === 'pipeline').length;
  const hubsCount = hydrogenAssets.filter(asset => asset.type === 'hub').length;

  const layers = [
    {
      key: 'plants',
      name: 'Hydrogen Plants',
      icon: Fuel,
      color: 'text-primary',
      count: plantsCount,
      checked: visibleLayers.plants,
    },
    {
      key: 'storage',
      name: 'Storage Facilities',
      icon: Database,
      color: 'text-secondary',
      count: storageCount,
      checked: visibleLayers.storage,
    },
    {
      key: 'pipelines',
      name: 'Pipeline Network',
      icon: Activity,
      color: 'text-accent',
      count: `${pipelinesCount} segments`,
      checked: visibleLayers.pipelines,
    },
    {
      key: 'hubs',
      name: 'Distribution Hubs',
      icon: MapPin,
      color: 'text-orange-500',
      count: hubsCount,
      checked: visibleLayers.hubs,
    },
    {
      key: 'renewables',
      name: 'Renewable Sources',
      icon: Sun,
      color: 'text-yellow-500',
      count: renewableSources.length,
      checked: visibleLayers.renewables,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground" data-testid="layer-controls-title">
        Map Layers
      </h3>
      
      {layers.map((layer) => {
        const IconComponent = layer.icon;
        return (
          <div key={layer.key} className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={layer.checked}
                onCheckedChange={(checked) => handleLayerToggle(layer.key, !!checked)}
                className="w-4 h-4"
                data-testid={`checkbox-layer-${layer.key}`}
              />
              <IconComponent className={`${layer.color} text-sm h-4 w-4`} />
              <span className="text-sm text-foreground" data-testid={`text-layer-${layer.key}`}>
                {layer.name}
              </span>
            </label>
            <span className="text-xs text-muted-foreground" data-testid={`count-layer-${layer.key}`}>
              {layer.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
