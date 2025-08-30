import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/header/app-header";
import Sidebar from "@/components/sidebar/sidebar";
import InteractiveMap from "@/components/map/interactive-map";
import AssetDetailsModal from "@/components/modals/asset-details-modal";
import { HydrogenAsset, RenewableSource, DemandCenter, SiteRecommendation } from "@shared/schema";

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState<HydrogenAsset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    plants: true,
    storage: true,
    pipelines: true,
    hubs: false,
    renewables: false,
  });

  const { data: hydrogenAssets = [], isLoading: assetsLoading } = useQuery<HydrogenAsset[]>({
    queryKey: ['/api/hydrogen-assets']
  });

  const { data: renewableSources = [], isLoading: renewablesLoading } = useQuery<RenewableSource[]>({
    queryKey: ['/api/renewable-sources']
  });

  const { data: demandCenters = [], isLoading: demandsLoading } = useQuery<DemandCenter[]>({
    queryKey: ['/api/demand-centers']
  });

  const { data: siteRecommendations = [] } = useQuery<SiteRecommendation[]>({
    queryKey: ['/api/site-recommendations']
  });

  const handleAssetClick = (asset: HydrogenAsset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const handleSiteSelect = (site: SiteRecommendation) => {
    // Center map on selected site - this will be handled by the map component
    console.log("Selected site:", site);
  };

  const isLoading = assetsLoading || renewablesLoading || demandsLoading;

  return (
    <div className="h-screen bg-background font-sans">
      <AppHeader data-testid="app-header" />
      
      <div className="flex h-[calc(100vh-4rem)] pt-0">
        <Sidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          visibleLayers={visibleLayers}
          onLayerToggle={setVisibleLayers}
          hydrogenAssets={hydrogenAssets}
          renewableSources={renewableSources}
          siteRecommendations={siteRecommendations}
          onSiteSelect={handleSiteSelect}
          isLoading={isLoading}
          data-testid="sidebar"
        />
        
        <InteractiveMap
          hydrogenAssets={hydrogenAssets}
          renewableSources={renewableSources}
          demandCenters={demandCenters}
          visibleLayers={visibleLayers}
          onAssetClick={handleAssetClick}
          searchQuery={searchQuery}
          data-testid="interactive-map"
        />
      </div>

      <AssetDetailsModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data-testid="asset-details-modal"
      />
    </div>
  );
}
