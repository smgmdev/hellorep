import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DataRow {
  [key: string]: string | number | boolean | undefined;
}

interface DetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DataRow | null;
  columns: string[];
}

export function DetailModal({ open, onOpenChange, data, columns }: DetailModalProps) {
  if (!data) return null;

  const primaryColumn = columns[0];
  const title = String(data[primaryColumn] || "Details");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh]" data-testid="modal-detail">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {columns.map((col) => {
              const value = data[col];
              if (value === undefined || value === null || value === "") return null;
              const displayValue = String(value);

              return (
                <div key={col} className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    {formatColumnName(col)}
                  </span>
                  {isStatus(displayValue) ? (
                    <Badge variant={getStatusVariant(displayValue)} className="w-fit">
                      {displayValue}
                    </Badge>
                  ) : isUrl(displayValue) ? (
                    <a
                      href={displayValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 break-all"
                      data-testid={`link-${col}`}
                    >
                      {displayValue}
                    </a>
                  ) : (
                    <span className="font-medium break-words" data-testid={`text-detail-${col}`}>
                      {displayValue}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
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

function isUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}
