import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OptimizationCriteria, SiteRecommendation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface OptimizationParams {
  criteria: OptimizationCriteria;
  investmentRange: string;
}

export function useOptimization() {
  const [optimizationParams, setOptimizationParams] = useState<OptimizationParams>({
    criteria: "renewable_proximity",
    investmentRange: "₹10L - ₹50L",
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const generateRecommendations = useMutation({
    mutationFn: async (params: OptimizationParams) => {
      const response = await apiRequest('POST', '/api/site-recommendations/generate', params);
      return response.json() as Promise<SiteRecommendation[]>;
    },
    onSuccess: (recommendations) => {
      queryClient.setQueryData(['/api/site-recommendations'], recommendations);
      toast({
        title: "Analysis Complete",
        description: `Generated ${recommendations.length} site recommendations based on ${optimizationParams.criteria.replace('_', ' ')}.`,
      });
    },
    onError: (error) => {
      console.error('Optimization error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate site recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const runOptimization = useCallback(() => {
    generateRecommendations.mutate(optimizationParams);
  }, [generateRecommendations, optimizationParams]);

  const updateCriteria = useCallback((criteria: OptimizationCriteria) => {
    setOptimizationParams(prev => ({ ...prev, criteria }));
  }, []);

  const updateInvestmentRange = useCallback((investmentRange: string) => {
    setOptimizationParams(prev => ({ ...prev, investmentRange }));
  }, []);

  const updateParams = useCallback((params: Partial<OptimizationParams>) => {
    setOptimizationParams(prev => ({ ...prev, ...params }));
  }, []);

  return {
    optimizationParams,
    setOptimizationParams: updateParams,
    updateCriteria,
    updateInvestmentRange,
    runOptimization,
    isGenerating: generateRecommendations.isPending,
    error: generateRecommendations.error,
  };
}
