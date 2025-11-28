import { useState, useEffect, useCallback } from "react";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { TerminalSplashLoading } from "@/components/TerminalLoadingState";
import { CommandPalette } from "@/components/CommandPalette";
import { useToast } from "@/hooks/use-toast";
import { Command, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Product {
  [key: string]: string | number | boolean | undefined;
}

interface DataSource {
  id: string;
  name: string;
  url: string;
}

const DEFAULT_SOURCES: DataSource[] = [
  {
    id: "media",
    name: "Media",
    url: "https://script.google.com/macros/s/AKfycbx0cDSTDNWMB4t-YTyI2oN8u_sraa_ZZOSuyo7mQfQ88QegUBTVzDGR2yG_QjIzFa_bEw/exec",
  },
];

export default function Console() {
  const [data, setData] = useState<Product[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitial, setIsInitial] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [sources, setSources] = useState<DataSource[]>(DEFAULT_SOURCES);
  const [activeSourceId, setActiveSourceId] = useState<string>("media");
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");

  const { toast } = useToast();

  const activeSource = sources.find((s) => s.id === activeSourceId) || sources[0];

  const fetchData = useCallback(async (sourceUrl?: string) => {
    setIsLoading(true);

    try {
      const url = sourceUrl || activeSource.url;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      let dataArray: Product[] = [];

      if (Array.isArray(result) && result.length > 0) {
        dataArray = result;
      } else if (result.services && Array.isArray(result.services)) {
        dataArray = result.services;
      } else if (result.data && Array.isArray(result.data)) {
        dataArray = result.data;
      }

      if (dataArray.length > 0) {
        const cols = Object.keys(dataArray[0]);
        setColumns(cols);
        setData(dataArray);
      }

      toast({
        title: "DATA_SYNC_COMPLETE",
        description: `Loaded ${dataArray.length} records`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load data";
      toast({
        title: "SYNC_ERROR",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInitial(false);
    }
  }, [activeSource, toast]);

  useEffect(() => {
    fetchData();
  }, [activeSourceId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "r" && !commandOpen && !modalOpen && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        fetchData();
      }
      if (e.key === "," && !commandOpen && !modalOpen && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setSettingsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandOpen, modalOpen, fetchData]);

  const handleProductClick = (product: Product, index: number) => {
    setSelectedProduct(product);
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const handleAddSource = () => {
    if (!newSourceName.trim() || !newSourceUrl.trim()) {
      toast({
        title: "INVALID_INPUT",
        description: "Name and URL are required",
        variant: "destructive",
      });
      return;
    }

    const newSource: DataSource = {
      id: `source_${Date.now()}`,
      name: newSourceName,
      url: newSourceUrl,
    };

    setSources([...sources, newSource]);
    setNewSourceName("");
    setNewSourceUrl("");
    setActiveSourceId(newSource.id);
    toast({
      title: "SOURCE_ADDED",
      description: `${newSourceName} added successfully`,
    });
  };

  const handleRemoveSource = (id: string) => {
    if (sources.length <= 1) {
      toast({
        title: "ERROR",
        description: "Cannot remove the last data source",
        variant: "destructive",
      });
      return;
    }

    setSources(sources.filter((s) => s.id !== id));
    if (activeSourceId === id) {
      setActiveSourceId(sources[0].id);
    }
    toast({
      title: "SOURCE_REMOVED",
      description: "Data source removed",
    });
  };

  if (isInitial && isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TerminalSplashLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      {/* Instruction Screen */}
      <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <Command className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2 max-w-sm">
          <h1 className="font-mono text-2xl font-semibold text-foreground tracking-tight">
            MEDIA_CONSOLE
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {activeSource.name}
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            Press <kbd className="px-2 py-1 rounded bg-muted border border-border text-xs font-medium">⌘K</kbd> or <kbd className="px-2 py-1 rounded bg-muted border border-border text-xs font-medium">CTRL+K</kbd> to search
          </p>
        </div>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>// Press R to refresh</p>
          <p>// Press , (comma) for settings</p>
          <p>// {data.length} items available</p>
        </div>
      </div>

      {/* Command Palette - Only way to search and access data */}
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        data={data}
        columns={columns}
        onRefresh={fetchData}
        onSearch={() => {}}
        onViewChange={() => {}}
        onRowSelect={(row) => {
          const idx = data.indexOf(row);
          handleProductClick(row, idx >= 0 ? idx : 0);
        }}
        onSort={() => {}}
        currentView="cards"
      />

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md font-mono" data-testid="dialog-settings">
          <DialogHeader>
            <DialogTitle className="text-primary">SETTINGS</DialogTitle>
            <DialogDescription>Manage data sources</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Active Source Selection */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">ACTIVE_SOURCE</Label>
              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                      activeSourceId === source.id
                        ? "border-primary/50 bg-primary/10"
                        : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                    onClick={() => setActiveSourceId(source.id)}
                    data-testid={`source-item-${source.id}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{source.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                      </div>
                    </div>
                    {sources.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSource(source.id);
                        }}
                        data-testid={`button-remove-${source.id}`}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Source */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-xs uppercase tracking-wider">ADD_SOURCE</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Source name"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="font-mono text-sm"
                  data-testid="input-source-name"
                />
                <Input
                  placeholder="Google Apps Script URL"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="font-mono text-sm"
                  data-testid="input-source-url"
                />
                <Button
                  onClick={handleAddSource}
                  className="w-full font-mono text-xs"
                  data-testid="button-add-source"
                >
                  ADD_SOURCE
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <ProductDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        index={selectedIndex}
      />

      {/* Settings Button - Bottom Right */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setSettingsOpen(true)}
        className="fixed bottom-4 right-4 h-10 w-10"
        data-testid="button-settings"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
}
