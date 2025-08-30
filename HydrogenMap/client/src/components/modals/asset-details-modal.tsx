import { X, MapPin, Factory, Calendar, DollarSign, Zap, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HydrogenAsset } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AssetDetailsModalProps {
  asset: HydrogenAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssetDetailsModal({ asset, isOpen, onClose }: AssetDetailsModalProps) {
  const { toast } = useToast();

  if (!asset) return null;

  const handleAddToAnalysis = () => {
    toast({
      title: "Added to Analysis",
      description: `${asset.name} has been added to your analysis workspace.`,
    });
    onClose();
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-accent/10 text-accent';
      case 'under_construction':
        return 'bg-yellow-500/10 text-yellow-700';
      case 'planned':
        return 'bg-blue-500/10 text-blue-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  // Mock optimization metrics - in a real app, these would be calculated
  const optimizationMetrics = {
    renewableAccess: "Excellent",
    marketProximity: "Good",
    infrastructureScore: 85,
    transportAccess: "Very Good",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="asset-details-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between" data-testid="modal-title">
            <span>{asset.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-modal">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Asset Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2" data-testid="section-asset-info">
                Asset Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Factory className="h-4 w-4 mr-2" />
                    Type:
                  </span>
                  <span className="text-foreground font-medium capitalize" data-testid="text-asset-type">
                    {asset.subtype || asset.type}
                  </span>
                </div>
                {asset.capacity && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Capacity:
                    </span>
                    <span className="text-foreground font-medium" data-testid="text-asset-capacity">
                      {asset.capacity}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={`text-xs ${getStatusColor(asset.status)}`} data-testid="badge-asset-status">
                    {asset.status.replace('_', ' ')}
                  </Badge>
                </div>
                {asset.annualOutput && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Output:</span>
                    <span className="text-foreground font-medium" data-testid="text-annual-output">
                      {asset.annualOutput}
                    </span>
                  </div>
                )}
                {asset.owner && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="text-foreground font-medium" data-testid="text-owner">
                      {asset.owner}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2" data-testid="section-optimization-metrics">
                Optimization Metrics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renewable Access:</span>
                  <span className="text-accent font-medium" data-testid="text-renewable-access">
                    {optimizationMetrics.renewableAccess}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Proximity:</span>
                  <span className="text-primary font-medium" data-testid="text-market-proximity">
                    {optimizationMetrics.marketProximity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Infrastructure Score:</span>
                  <span className="text-secondary font-medium" data-testid="text-infrastructure-score">
                    {optimizationMetrics.infrastructureScore}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Transport Access:
                  </span>
                  <span className="text-accent font-medium" data-testid="text-transport-access">
                    {optimizationMetrics.transportAccess}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location and Investment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span data-testid="text-coordinates">
                  {asset.latitude.toFixed(4)}°N, {asset.longitude.toFixed(4)}°W
                </span>
              </div>
              {asset.operationalDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span data-testid="text-operational-date">
                    Operational since {formatDate(asset.operationalDate)}
                  </span>
                </div>
              )}
            </div>
            
            {asset.investmentCost && (
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                <span data-testid="text-investment-cost">
                  Investment: {formatCurrency(asset.investmentCost)}
                </span>
              </div>
            )}
          </div>

          {asset.description && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground" data-testid="text-description">
                  {asset.description}
                </p>
              </div>
            </>
          )}

          {/* Production Forecast Placeholder */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2" data-testid="section-production-forecast">
              Production Forecast
            </h3>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Factory className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm" data-testid="chart-placeholder">
                  Production trend visualization would appear here
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} data-testid="button-close">
              Close
            </Button>
            <Button onClick={handleAddToAnalysis} data-testid="button-add-to-analysis">
              Add to Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
