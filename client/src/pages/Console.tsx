import { useState, useEffect, useMemo, useCallback } from "react";
import { MediaHeader } from "@/components/MediaHeader";
import { MediaSearchBar } from "@/components/MediaSearchBar";
import { ProductCard, type Product } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { TerminalLoadingState, TerminalSplashLoading } from "@/components/TerminalLoadingState";
import { TerminalEmptyState } from "@/components/TerminalEmptyState";
import { TerminalFooter } from "@/components/TerminalFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { TerminalDataTable } from "@/components/TerminalDataTable";

const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbx0cDSTDNWMB4t-YTyI2oN8u_sraa_ZZOSuyo7mQfQ88QegUBTVzDGR2yG_QjIzFa_bEw/exec";

export default function Console() {
  const [data, setData] = useState<Product[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitial, setIsInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

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
        if (!sortColumn && cols.length > 0) {
          setSortColumn(cols[0]);
        }
      } else {
        setData([]);
        setColumns([]);
      }

      setLastUpdated(new Date());
      toast({
        title: "DATA_SYNC_COMPLETE",
        description: `Loaded ${dataArray.length} records`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load data";
      setError(message);
      toast({
        title: "SYNC_ERROR",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInitial(false);
    }
  }, [sortColumn, toast]);

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
      if (e.key === "v" && !commandOpen && !modalOpen && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setView((v) => (v === "cards" ? "table" : "cards"));
      }
      if (e.key === "/" && !commandOpen && !modalOpen && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        const searchInput = document.querySelector('[data-testid="input-media-search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandOpen, modalOpen, fetchData]);

  const getTitleField = useCallback((product: Product): string => {
    const titleKeys = ["title", "name", "product", "item", "media", "project"];
    for (const key of titleKeys) {
      for (const [k, v] of Object.entries(product)) {
        if (k.toLowerCase().includes(key) && v !== undefined && v !== null && v !== "") {
          return String(v);
        }
      }
    }
    return "";
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    const searchLower = search.toLowerCase();
    return data.filter((product) => {
      const title = getTitleField(product);
      if (title.toLowerCase().includes(searchLower)) {
        return true;
      }
      return columns.some((col) => {
        const value = product[col];
        return value !== undefined && value !== null && String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [data, search, columns, getTitleField]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleProductClick = (product: Product, index: number) => {
    setSelectedProduct(product);
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const currentView = isMobile ? "cards" : view;
  const status = isLoading ? "loading" : error ? "error" : "connected";

  if (isInitial && isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TerminalSplashLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MediaHeader
        onRefresh={fetchData}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        recordCount={data.length}
      />

      <div className="border-b border-border/50 bg-muted/20 px-4 py-3 md:px-6">
        <MediaSearchBar
          value={search}
          onChange={handleSearch}
          onOpenCommand={() => setCommandOpen(true)}
          placeholder="Search by title... (press / to focus)"
          resultCount={filteredData.length}
          totalCount={data.length}
        />
      </div>

      <main className="flex-1 px-4 py-4 md:px-6 overflow-auto">
        <div className="mx-auto max-w-7xl">
          {isLoading && !isInitial ? (
            <TerminalLoadingState variant={currentView} count={6} />
          ) : error ? (
            <TerminalEmptyState
              type="error"
              description={error}
              onAction={fetchData}
              actionLabel="RETRY"
            />
          ) : sortedData.length === 0 ? (
            search ? (
              <TerminalEmptyState
                type="no-results"
                title="NO_MATCHES"
                description={`// No items found matching "${search}"`}
                onAction={() => setSearch("")}
                actionLabel="CLEAR"
              />
            ) : (
              <TerminalEmptyState
                type="no-data"
                onAction={fetchData}
                actionLabel="REFRESH"
              />
            )
          ) : currentView === "cards" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedData.map((product, idx) => (
                <ProductCard
                  key={idx}
                  product={product}
                  index={idx}
                  onClick={() => handleProductClick(product, idx)}
                />
              ))}
            </div>
          ) : (
            <TerminalDataTable
              data={sortedData}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onRowClick={(row, idx) => handleProductClick(row, idx)}
            />
          )}
        </div>
      </main>

      <TerminalFooter
        status={status}
        view={view}
        onViewChange={setView}
        filteredCount={filteredData.length}
        totalCount={data.length}
      />

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        data={data}
        columns={columns}
        onRefresh={fetchData}
        onSearch={handleSearch}
        onViewChange={setView}
        onRowSelect={(row) => {
          const idx = data.indexOf(row);
          handleProductClick(row, idx >= 0 ? idx : 0);
        }}
        onSort={handleSort}
        currentView={view}
      />

      <ProductDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        index={selectedIndex}
      />
    </div>
  );
}
