import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface DataRow {
  [key: string]: string | number | boolean | undefined;
}

interface TerminalDataTableProps {
  data: DataRow[];
  columns: string[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  onRowClick?: (row: DataRow, index: number) => void;
}

export function TerminalDataTable({
  data,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
}: TerminalDataTableProps) {
  return (
    <div className="rounded-md border border-border/50 overflow-hidden font-mono text-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-border/50 hover:bg-muted/30">
              <TableHead className="w-12 text-muted-foreground font-normal">#</TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className={`whitespace-nowrap text-muted-foreground font-normal uppercase tracking-wider ${
                    onSort ? "cursor-pointer hover:text-foreground transition-colors" : ""
                  }`}
                  onClick={() => onSort?.(col)}
                  data-testid={`header-${col}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col}</span>
                    {sortColumn === col && (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-3 w-3 text-primary" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-primary" />
                      )
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={idx}
                onClick={() => onRowClick?.(row, idx)}
                className={`border-border/30 ${onRowClick ? "cursor-pointer" : ""} hover:bg-muted/20`}
                data-testid={`row-data-${idx}`}
              >
                <TableCell className="text-muted-foreground">
                  {String(idx + 1).padStart(3, "0")}
                </TableCell>
                {columns.map((col) => {
                  const value = row[col];
                  const displayValue = value !== undefined && value !== null ? String(value) : "—";

                  return (
                    <TableCell key={col} className="whitespace-nowrap">
                      {isStatus(displayValue) ? (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${getStatusClasses(displayValue)}`}>
                          {displayValue}
                        </span>
                      ) : (
                        <span data-testid={`text-cell-${col}-${idx}`}>{displayValue}</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function isStatus(value: string): boolean {
  const statusWords = ["active", "inactive", "pending", "completed", "in progress", "done", "cancelled", "approved", "rejected", "draft", "published", "live", "offline", "online"];
  return statusWords.some((s) => value.toLowerCase().includes(s));
}

function getStatusClasses(value: string): string {
  const lower = value.toLowerCase();
  if (lower.includes("active") || lower.includes("completed") || lower.includes("done") || lower.includes("approved") || lower.includes("live") || lower.includes("online")) {
    return "bg-primary/20 text-primary border border-primary/30";
  }
  if (lower.includes("pending") || lower.includes("in progress") || lower.includes("draft")) {
    return "bg-accent/20 text-accent border border-accent/30";
  }
  if (lower.includes("cancelled") || lower.includes("rejected") || lower.includes("inactive") || lower.includes("offline")) {
    return "bg-destructive/20 text-destructive border border-destructive/30";
  }
  return "bg-secondary text-secondary-foreground";
}
