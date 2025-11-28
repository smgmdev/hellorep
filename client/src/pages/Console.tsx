import { useState, useEffect, useMemo, useCallback } from "react";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { TerminalSplashLoading } from "@/components/TerminalLoadingState";
import { CommandPalette } from "@/components/CommandPalette";
import { useToast } from "@/hooks/use-toast";
import { Command } from "lucide-react";

export interface Product {
  [key: string]: string | number | boolean | undefined;
}

const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbx0cDSTDNWMB4t-YTyI2oN8u_sraa_ZZOSuyo7mQfQ88QegUBTVzDGR2yG_QjIzFa_bEw/exec";

export default function Console() {
  const [data, setData] = useState<Product[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitial, setIsInitial] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(SHEETS_API_URL);
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
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, []);

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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandOpen, modalOpen, fetchData]);

  const handleProductClick = (product: Product, index: number) => {
    setSelectedProduct(product);
    setSelectedIndex(index);
    setModalOpen(true);
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
            Press <kbd className="px-2 py-1 rounded bg-muted border border-border text-xs font-medium">⌘K</kbd> or <kbd className="px-2 py-1 rounded bg-muted border border-border text-xs font-medium">CTRL+K</kbd> to search
          </p>
        </div>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>// Press R to refresh</p>
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

      {/* Detail Modal */}
      <ProductDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        index={selectedIndex}
      />
    </div>
  );
}
