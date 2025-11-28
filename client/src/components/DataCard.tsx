import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export interface DataRow {
  [key: string]: string | number | boolean | undefined;
}

interface DataCardProps {
  data: DataRow;
  columns: string[];
  onClick?: () => void;
}

export function DataCard({ data, columns, onClick }: DataCardProps) {
  const primaryColumn = columns[0];
  const secondaryColumns = columns.slice(1, 4);
  
  return (
    <Card
      className={`transition-all ${onClick ? "cursor-pointer hover-elevate" : ""}`}
      onClick={onClick}
      data-testid={`card-data-${String(data[primaryColumn] || "item").replace(/\s+/g, "-").toLowerCase()}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <h3 className="font-medium text-base truncate" data-testid="text-card-title">
          {String(data[primaryColumn] || "—")}
        </h3>
        {onClick && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="space-y-2">
        {secondaryColumns.map((col) => {
          const value = data[col];
          if (value === undefined || value === null || value === "") return null;
          
          return (
            <div key={col} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground truncate">{formatColumnName(col)}</span>
              {isStatus(String(value)) ? (
                <Badge variant={getStatusVariant(String(value))} className="text-xs">
                  {String(value)}
                </Badge>
              ) : (
                <span className="font-medium truncate max-w-[60%] text-right" data-testid={`text-${col}`}>
                  {String(value)}
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
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
