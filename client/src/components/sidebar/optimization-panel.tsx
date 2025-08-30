import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { OptimizationCriteria } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function OptimizationPanel() {
  const [investmentRange, setInvestmentRange] = useState("₹10L - ₹50L");
  const [criteria, setCriteria] = useState<OptimizationCriteria>("renewable_proximity");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const generateRecommendations = useMutation({
    mutationFn: async (data: { criteria: OptimizationCriteria; investmentRange: string }) => {
      const response = await apiRequest('POST', '/api/site-recommendations/generate', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-recommendations'] });
      toast({
        title: "Analysis Complete",
        description: "Site recommendations have been generated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate site recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRunOptimization = () => {
    generateRecommendations.mutate({ criteria, investmentRange });
  };

  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium text-foreground mb-3" data-testid="optimization-title">
        Site Optimization
      </h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="investment-range" className="text-xs text-muted-foreground">
            Investment Range
          </Label>
          <Select value={investmentRange} onValueChange={setInvestmentRange}>
            <SelectTrigger data-testid="select-investment-range">
              <SelectValue placeholder="Select investment range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="₹10L - ₹50L">₹10L - ₹50L</SelectItem>
              <SelectItem value="₹50L - ₹100L">₹50L - ₹100L</SelectItem>
              <SelectItem value="₹100L+">₹100L+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="criteria" className="text-xs text-muted-foreground">
            Primary Criteria
          </Label>
          <Select value={criteria} onValueChange={(value: OptimizationCriteria) => setCriteria(value)}>
            <SelectTrigger data-testid="select-criteria">
              <SelectValue placeholder="Select optimization criteria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="renewable_proximity">Renewable Proximity</SelectItem>
              <SelectItem value="market_demand">Market Demand</SelectItem>
              <SelectItem value="cost_optimization">Cost Optimization</SelectItem>
              <SelectItem value="regulatory_zones">Regulatory Zones</SelectItem>
              <SelectItem value="transport_access">Transport Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleRunOptimization}
          disabled={generateRecommendations.isPending}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-run-analysis"
        >
          {generateRecommendations.isPending ? "Running Analysis..." : "Run Site Analysis"}
        </Button>
      </div>
    </div>
  );
}
