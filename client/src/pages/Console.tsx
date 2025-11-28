import { useState, useEffect, useMemo } from "react";
import { ConsoleHeader } from "@/components/ConsoleHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataCard, type DataRow } from "@/components/DataCard";
import { DataTable } from "@/components/DataTable";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { DetailModal } from "@/components/DetailModal";
import { ViewToggle } from "@/components/ViewToggle";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbx0cDSTDNWMB4t-YTyI2oN8u_sraa_ZZOSuyo7mQfQ88QegUBTVzDGR2yG_QjIzFa_bEw/exec";

export default function Console() {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(SHEETS_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const result = await response.json();
      
      if (Array.isArray(result) && result.length > 0) {
        const cols = Object.keys(result[0]);
        setColumns(cols);
        setData(result);
        if (!sortColumn && cols.length > 0) {
          setSortColumn(cols[0]);
        }
      } else if (result.data && Array.isArray(result.data)) {
        const cols = Object.keys(result.data[0] || {});
        setColumns(cols);
        setData(result.data);
        if (!sortColumn && cols.length > 0) {
          setSortColumn(cols[0]);
        }
      } else {
        setData([]);
        setColumns([]);
      }
      
      setLastUpdated(new Date());
      toast({
        title: "Data refreshed",
        description: "Successfully loaded latest data from your sheet",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load data";
      setError(message);
      toast({
        title: "Error loading data",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    
    const searchLower = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col];
        return value !== undefined && value !== null && String(value).toLowerCase().includes(searchLower);
      })
    );
  }, [data, search, columns]);

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

  const handleRowClick = (row: DataRow) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const currentView = isMobile ? "cards" : view;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ConsoleHeader
        onRefresh={fetchData}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />
      
      <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search your data..."
              />
            </div>
            <div className="flex items-center gap-3">
              {data.length > 0 && (
                <Badge variant="secondary" className="text-xs" data-testid="badge-count">
                  {filteredData.length} {filteredData.length === 1 ? "record" : "records"}
                </Badge>
              )}
              {!isMobile && <ViewToggle view={view} onChange={setView} />}
            </div>
          </div>

          {isLoading ? (
            <LoadingState variant={currentView} count={6} />
          ) : error ? (
            <EmptyState
              type="error"
              description={error}
              onAction={fetchData}
              actionLabel="Retry"
            />
          ) : sortedData.length === 0 ? (
            search ? (
              <EmptyState
                type="no-results"
                onAction={() => setSearch("")}
                actionLabel="Clear search"
              />
            ) : (
              <EmptyState
                type="no-data"
                onAction={fetchData}
                actionLabel="Refresh"
              />
            )
          ) : currentView === "cards" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedData.map((row, idx) => (
                <DataCard
                  key={idx}
                  data={row}
                  columns={columns}
                  onClick={() => handleRowClick(row)}
                />
              ))}
            </div>
          ) : (
            <DataTable
              data={sortedData}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </main>

      <DetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={selectedRow}
        columns={columns}
      />
    </div>
  );
}
