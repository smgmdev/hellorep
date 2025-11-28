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
  Filter,
  Download,
  Terminal,
  Zap,
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

  const filteredData = useMemo(() => {
    if (!search.trim()) return data.slice(0, 10);
    const searchLower = search.toLowerCase();
    return data
      .filter((row) =>
        columns.some((col) => {
          const value = row[col];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      )
      .slice(0, 10);
  }, [data, search, columns]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const primaryColumn = columns[0] || "item";

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
        data-testid="input-command"
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-6 text-muted-foreground">
            <Terminal className="h-8 w-8 mb-2 opacity-50" />
            <span>No results found.</span>
          </div>
        </CommandEmpty>

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
          <CommandItem
            onSelect={() => {
              onViewChange(currentView === "cards" ? "table" : "cards");
              onOpenChange(false);
            }}
            data-testid="command-toggle-view"
          >
            {currentView === "cards" ? (
              <TableIcon className="mr-2 h-4 w-4 text-primary" />
            ) : (
              <LayoutGrid className="mr-2 h-4 w-4 text-primary" />
            )}
            <span>Switch to {currentView === "cards" ? "Table" : "Grid"} View</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              V
            </kbd>
          </CommandItem>
        </CommandGroup>

        {columns.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="SORT BY">
              {columns.slice(0, 5).map((col) => (
                <CommandItem
                  key={col}
                  onSelect={() => {
                    onSort(col);
                    onOpenChange(false);
                  }}
                  data-testid={`command-sort-${col}`}
                >
                  <ArrowUpDown className="mr-2 h-4 w-4 text-accent" />
                  <span>{formatColumnName(col)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {filteredData.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="DATA">
              {filteredData.map((row, idx) => (
                <CommandItem
                  key={idx}
                  onSelect={() => {
                    onRowSelect(row);
                    onOpenChange(false);
                  }}
                  data-testid={`command-row-${idx}`}
                >
                  <Zap className="mr-2 h-4 w-4 text-chart-2" />
                  <span className="truncate">{String(row[primaryColumn] || `Row ${idx + 1}`)}</span>
                  {columns[1] && row[columns[1]] && (
                    <span className="ml-2 text-muted-foreground text-xs truncate">
                      {String(row[columns[1]])}
                    </span>
                  )}
                </CommandItem>
              ))}
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
