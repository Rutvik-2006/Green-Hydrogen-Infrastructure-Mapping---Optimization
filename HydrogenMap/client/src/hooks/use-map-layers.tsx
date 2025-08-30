import { useState, useCallback } from "react";

export interface LayerVisibility {
  plants: boolean;
  storage: boolean;
  pipelines: boolean;
  hubs: boolean;
  renewables: boolean;
  demandCenters: boolean;
}

export function useMapLayers(initialState?: Partial<LayerVisibility>) {
  const [visibleLayers, setVisibleLayers] = useState<LayerVisibility>({
    plants: true,
    storage: true,
    pipelines: true,
    hubs: false,
    renewables: false,
    demandCenters: true,
    ...initialState,
  });

  const toggleLayer = useCallback((layerKey: keyof LayerVisibility) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  const setLayerVisibility = useCallback((layerKey: keyof LayerVisibility, visible: boolean) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerKey]: visible,
    }));
  }, []);

  const showAllLayers = useCallback(() => {
    setVisibleLayers({
      plants: true,
      storage: true,
      pipelines: true,
      hubs: true,
      renewables: true,
      demandCenters: true,
    });
  }, []);

  const hideAllLayers = useCallback(() => {
    setVisibleLayers({
      plants: false,
      storage: false,
      pipelines: false,
      hubs: false,
      renewables: false,
      demandCenters: false,
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setVisibleLayers({
      plants: true,
      storage: true,
      pipelines: true,
      hubs: false,
      renewables: false,
      demandCenters: true,
      ...initialState,
    });
  }, [initialState]);

  return {
    visibleLayers,
    setVisibleLayers,
    toggleLayer,
    setLayerVisibility,
    showAllLayers,
    hideAllLayers,
    resetToDefaults,
  };
}
