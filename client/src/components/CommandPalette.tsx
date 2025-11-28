import { useEffect, useState, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  RefreshCw,
  Search,
  LayoutGrid,
  TableIcon,
  ArrowUpDown,
  Terminal,
  FileText,
} from "lucide-react";

export interface DataRow {
  [key: string]: string | number | boolean | undefined;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DataRow[];
  columns: string[];
  onRefresh: () => void;
  onSearch: (query: string) => void;
  onViewChange: (view: "cards" | "table") => void;
  onRowSelect: (row: DataRow) => void;
  onSort: (column: string) => void;
  currentView: "cards" | "table";
}

export function CommandPalette({
  open,
  onOpenChange,
  data,
  columns,
  onRefresh,
  onSearch,
  onViewChange,
  onRowSelect,
  onSort,
  currentView,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  const getTitleField = (row: DataRow): string => {
    const titleKeys = ["title", "name", "product", "item", "media", "project"];
    for (const key of titleKeys) {
      for (const [k, v] of Object.entries(row)) {
        if (k.toLowerCase().includes(key) && v !== undefined && v !== null && v !== "") {
          return String(v);
        }
      }
    }
    return "";
  };

  const getTypeField = (row: DataRow): string => {
    const typeKeys = ["type", "category", "genre", "format"];
    for (const key of typeKeys) {
      for (const [k, v] of Object.entries(row)) {
        if (k.toLowerCase().includes(key) && v !== undefined && v !== null && v !== "") {
          return String(v);
        }
      }
    }
    return "";
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return [];
    const searchLower = search.toLowerCase();
    return data
      .filter((row) => {
        const title = getTitleField(row);
        if (title.toLowerCase().includes(searchLower)) {
          return true;
        }
        return columns.some((col) => {
          const value = row[col];
          return value && String(value).toLowerCase().includes(searchLower);
        });
      });
  }, [data, search, columns]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search by title or type a command..."
        value={search}
        onValueChange={setSearch}
        data-testid="input-command"
      />
      <CommandList>
        {!search && (
          <CommandEmpty>
            <div className="flex flex-col items-center py-6 text-muted-foreground font-mono">
              <Terminal className="h-8 w-8 mb-2 opacity-50" />
              <span className="text-sm">TYPE_TO_SEARCH</span>
              <span className="text-xs text-muted-foreground mt-1">// Search by title or content</span>
            </div>
          </CommandEmpty>
        )}

        {search && filteredData.length === 0 && (
          <CommandEmpty>
            <div className="flex flex-col items-center py-6 text-muted-foreground font-mono">
              <Terminal className="h-8 w-8 mb-2 opacity-50" />
              <span className="text-sm">NO_RESULTS_FOUND</span>
              <span className="text-xs text-muted-foreground mt-1">// Try a different search term</span>
            </div>
          </CommandEmpty>
        )}

        {search && filteredData.length > 0 && (
          <CommandGroup heading={`RESULTS (${filteredData.length})`}>
            {filteredData.map((row, idx) => {
              const title = getTitleField(row);
              const type = getTypeField(row);

              return (
                <CommandItem
                  key={idx}
                  onSelect={() => {
                    onRowSelect(row);
                    onOpenChange(false);
                  }}
                  data-testid={`command-row-${idx}`}
                >
                  <FileText className="mr-2 h-4 w-4 text-chart-2" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="truncate font-medium text-sm">{title || `Item ${idx + 1}`}</span>
                    {type && (
                      <span className="text-muted-foreground text-xs truncate">
                        {type}
                      </span>
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {!search && (
          <>
            <CommandSeparator />
            <CommandGroup heading="COMMANDS">
              <CommandItem
                onSelect={() => {
                  onRefresh();
                  onOpenChange(false);
                }}
                data-testid="command-refresh"
              >
                <RefreshCw className="mr-2 h-4 w-4 text-primary" />
                <span>Refresh Data</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  R
                </kbd>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

function formatColumnName(col: string): string {
  return col
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}
