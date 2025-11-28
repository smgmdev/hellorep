import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export interface DataRow {
  [key: string]: string | number | boolean | undefined;
}

interface TerminalDataCardProps {
  data: DataRow;
  columns: string[];
  index: number;
  onClick?: () => void;
}

export function TerminalDataCard({ data, columns, index, onClick }: TerminalDataCardProps) {
  const primaryColumn = columns[0];
  const secondaryColumns = columns.slice(1, 4);

  return (
    <Card
      className={`p-3 font-mono text-sm border-border/50 bg-card/50 ${
        onClick ? "cursor-pointer hover-elevate" : ""
      }`}
      onClick={onClick}
      data-testid={`card-data-${index}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">#{String(index + 1).padStart(3, "0")}</span>
          <span className="text-primary font-medium truncate" data-testid="text-card-title">
            {String(data[primaryColumn] || "—")}
          </span>
        </div>
        {onClick && <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />}
      </div>

      <div className="space-y-1">
        {secondaryColumns.map((col) => {
          const value = data[col];
          if (value === undefined || value === null || value === "") return null;

          return (
            <div key={col} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground uppercase tracking-wider">
                {col.slice(0, 12)}
              </span>
              {isStatus(String(value)) ? (
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${getStatusClasses(String(value))}`}>
                  {String(value)}
                </span>
              ) : (
                <span className="text-foreground truncate max-w-[60%] text-right" data-testid={`text-${col}`}>
                  {String(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
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
