import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface DataRow {
  [key: string]: string | number | boolean | undefined;
}

interface TerminalDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DataRow | null;
  columns: string[];
  index?: number;
}

export function TerminalDetailModal({
  open,
  onOpenChange,
  data,
  columns,
  index = 0,
}: TerminalDetailModalProps) {
  const { toast } = useToast();

  if (!data) return null;

  const primaryColumn = columns[0];
  const title = String(data[primaryColumn] || `RECORD_${index + 1}`);

  const copyToClipboard = () => {
    const text = columns
      .map((col) => `${col}: ${data[col] ?? "—"}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Record data has been copied",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] font-mono" data-testid="modal-detail">
        <DialogHeader className="border-b border-border/50 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">#{String(index + 1).padStart(3, "0")}</span>
              <DialogTitle className="text-primary text-sm" data-testid="text-modal-title">
                {title}
              </DialogTitle>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-7 w-7"
              data-testid="button-copy"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4 text-xs">
            {columns.map((col) => {
              const value = data[col];
              if (value === undefined || value === null || value === "") return null;
              const displayValue = String(value);

              return (
                <div key={col} className="flex flex-col gap-1 py-2 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                    {col}
                  </span>
                  {isStatus(displayValue) ? (
                    <span className={`w-fit px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${getStatusClasses(displayValue)}`}>
                      {displayValue}
                    </span>
                  ) : isUrl(displayValue) ? (
                    <a
                      href={displayValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-1 hover:underline break-all"
                      data-testid={`link-${col}`}
                    >
                      {displayValue}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-foreground break-words" data-testid={`text-detail-${col}`}>
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

function isUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}
