import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DataRow {
  [key: string]: string | number | boolean | undefined;
}

interface DataTableProps {
  data: DataRow[];
  columns: string[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  onRowClick?: (row: DataRow) => void;
}

export function DataTable({
  data,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
}: DataTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col} className="whitespace-nowrap">
                  {onSort ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSort(col)}
                      className="-ml-3 h-8 gap-1"
                      data-testid={`button-sort-${col}`}
                    >
                      {formatColumnName(col)}
                      {sortColumn === col ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </Button>
                  ) : (
                    formatColumnName(col)
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer hover-elevate" : ""}
                data-testid={`row-data-${idx}`}
              >
                {columns.map((col) => {
                  const value = row[col];
                  const displayValue = value !== undefined && value !== null ? String(value) : "—";
                  
                  return (
                    <TableCell key={col} className="whitespace-nowrap">
                      {isStatus(displayValue) ? (
                        <Badge variant={getStatusVariant(displayValue)} className="text-xs">
                          {displayValue}
                        </Badge>
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

function formatColumnName(col: string): string {
  return col
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function isStatus(value: string): boolean {
  const statusWords = ["active", "inactive", "pending", "completed", "in progress", "done", "cancelled", "approved", "rejected", "draft", "published"];
  return statusWords.some((s) => value.toLowerCase().includes(s));
}

function getStatusVariant(value: string): "default" | "secondary" | "destructive" | "outline" {
  const lower = value.toLowerCase();
  if (lower.includes("active") || lower.includes("completed") || lower.includes("done") || lower.includes("approved") || lower.includes("published")) {
    return "default";
  }
  if (lower.includes("pending") || lower.includes("in progress") || lower.includes("draft")) {
    return "secondary";
  }
  if (lower.includes("cancelled") || lower.includes("rejected") || lower.includes("inactive")) {
    return "destructive";
  }
  return "outline";
}
