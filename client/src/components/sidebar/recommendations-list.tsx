import { MapPin, DollarSign, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteRecommendation } from "@shared/schema";

interface RecommendationsListProps {
  recommendations: SiteRecommendation[];
  onSiteSelect: (site: SiteRecommendation) => void;
}

export default function RecommendationsList({
  recommendations,
  onSiteSelect,
}: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-foreground mb-3" data-testid="recommendations-title">
          Recommended Sites
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm" data-testid="no-recommendations-message">
            Run site analysis to see recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-sm font-medium text-foreground mb-3" data-testid="recommendations-title">
        Recommended Sites
      </h3>
      
      <div className="space-y-4">
        {recommendations.map((site) => (
          <div
            key={site.id}
            className="p-3 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSiteSelect(site)}
            data-testid={`recommendation-card-${site.id}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground" data-testid={`text-site-name-${site.id}`}>
                {site.name}
              </h4>
              <div className="optimization-score text-xs text-accent-foreground px-2 py-1 rounded-full font-medium">
                {site.score}%
              </div>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span data-testid={`text-location-${site.id}`}>
                  {site.latitude.toFixed(4)}°N, {site.longitude.toFixed(4)}°W
                </span>
              </div>
              {site.estimatedCost && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span data-testid={`text-cost-${site.id}`}>
                    Est. ₹{(site.estimatedCost / 10000000).toFixed(0)}Cr investment
                  </span>
                </div>
              )}
              {site.timeline && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span data-testid={`text-timeline-${site.id}`}>{site.timeline}</span>
                </div>
              )}
            </div>
            
            {site.tags && site.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {site.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                    data-testid={`badge-tag-${site.id}-${index}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
