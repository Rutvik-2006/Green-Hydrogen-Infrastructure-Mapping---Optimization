import { Download, Settings, MapPin, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AppHeader() {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/analysis');
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'hydrogen-infrastructure-analysis.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Analysis data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export analysis data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Settings panel coming soon.",
    });
  };

  return (
    <header className="bg-card border-b border-border shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCog className="text-primary text-2xl" data-testid="logo-icon" />
              <h1 className="text-xl font-semibold text-foreground" data-testid="app-title">
                H2 Infrastructure Mapper
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="text-sm" />
              <span data-testid="region-label">India Region</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleExport}
              className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-export"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Analysis</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSettings}
              className="flex items-center space-x-2"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
