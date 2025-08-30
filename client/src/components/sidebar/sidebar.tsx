import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import LayerControls from "./layer-controls";
import OptimizationPanel from "./optimization-panel";
import RecommendationsList from "./recommendations-list";
import { HydrogenAsset, RenewableSource, SiteRecommendation } from "@shared/schema";

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibleLayers: Record<string, boolean>;
  onLayerToggle: (layers: Record<string, boolean>) => void;
  hydrogenAssets: HydrogenAsset[];
  renewableSources: RenewableSource[];
  siteRecommendations: SiteRecommendation[];
  onSiteSelect: (site: SiteRecommendation) => void;
  isLoading: boolean;
}

export default function Sidebar({
  searchQuery,
  onSearchChange,
  visibleLayers,
  onLayerToggle,
  hydrogenAssets,
  renewableSources,
  siteRecommendations,
  onSiteSelect,
  isLoading,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-80 bg-card border-r border-border flex flex-col overflow-hidden">
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-24" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-80 bg-card border-r border-border flex flex-col overflow-hidden md:relative md:translate-x-0 transition-transform duration-300">
        {/* Search and Filters */}
        <div className="p-4 border-b border-border">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search infrastructure assets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          <LayerControls
            visibleLayers={visibleLayers}
            onLayerToggle={onLayerToggle}
            hydrogenAssets={hydrogenAssets}
            renewableSources={renewableSources}
          />
        </div>
        
        <OptimizationPanel />
        
        <RecommendationsList
          recommendations={siteRecommendations}
          onSiteSelect={onSiteSelect}
        />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-4 left-4 bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-[1000] md:hidden"
        data-testid="button-mobile-menu"
      >
        <Search className="h-5 w-5" />
      </button>
    </>
  );
}
