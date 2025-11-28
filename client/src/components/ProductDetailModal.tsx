import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Calendar, User, Tag, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  [key: string]: string | number | boolean | undefined;
}

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  index?: number;
}

export function ProductDetailModal({
  open,
  onOpenChange,
  product,
  index = 0,
}: ProductDetailModalProps) {
  const { toast } = useToast();

  if (!product) return null;

  const title = getFieldValue(product, ["title", "name", "product", "item", "media"]) || `ITEM_${index + 1}`;
  const columns = Object.keys(product);

  const copyToClipboard = () => {
    const text = columns
      .map((col) => `${col}: ${product[col] ?? "—"}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast({
      title: "COPIED",
      description: "Product data copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] font-mono" data-testid="modal-product-detail">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">#{String(index + 1).padStart(3, "0")}</span>
                {getFieldValue(product, ["type", "category"]) && (
                  <Badge variant="outline" className="text-[10px]">
                    {getFieldValue(product, ["type", "category"])}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-primary text-lg font-semibold" data-testid="modal-product-title">
                {title}
              </DialogTitle>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-8 w-8 shrink-0"
              data-testid="button-copy-product"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[65vh]">
          <div className="grid gap-4 pr-4 py-2">
            {columns.map((col) => {
              const value = product[col];
              if (value === undefined || value === null || value === "") return null;
              const displayValue = String(value);
              const isUrl = displayValue.startsWith("http://") || displayValue.startsWith("https://");
              const isLongText = displayValue.length > 100;

              return (
                <div key={col} className={`${isLongText ? "col-span-full" : ""}`}>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
                    {formatColumnName(col)}
                  </label>
                  {isStatus(displayValue) ? (
                    <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusClasses(displayValue)}`}>
                      {displayValue}
                    </span>
                  ) : isUrl ? (
                    <a
                      href={displayValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      data-testid={`link-${col}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      <span className="break-all">{displayValue}</span>
                    </a>
                  ) : isLongText ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap" data-testid={`text-${col}`}>
                      {displayValue}
                    </p>
                  ) : (
                    <span className="text-sm text-foreground" data-testid={`text-${col}`}>
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

function getFieldValue(product: Product, possibleKeys: string[]): string | undefined {
  for (const key of possibleKeys) {
    const lowerKey = key.toLowerCase();
    for (const [k, v] of Object.entries(product)) {
      if (k.toLowerCase().includes(lowerKey) && v !== undefined && v !== null && v !== "") {
        return String(v);
      }
    }
  }
  return undefined;
}

function formatColumnName(col: string): string {
  return col
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function isStatus(value: string): boolean {
  const statusWords = ["active", "inactive", "pending", "completed", "in progress", "done", "cancelled", "approved", "rejected", "draft", "published", "live", "offline", "online", "archived", "review"];
  return statusWords.some((s) => value.toLowerCase().includes(s));
}

function getStatusClasses(value: string): string {
  const lower = value.toLowerCase();
  if (lower.includes("active") || lower.includes("completed") || lower.includes("done") || lower.includes("approved") || lower.includes("live") || lower.includes("published")) {
    return "bg-primary/20 text-primary border border-primary/30";
  }
  if (lower.includes("pending") || lower.includes("in progress") || lower.includes("draft") || lower.includes("review")) {
    return "bg-accent/20 text-accent border border-accent/30";
  }
  if (lower.includes("cancelled") || lower.includes("rejected") || lower.includes("inactive") || lower.includes("archived")) {
    return "bg-destructive/20 text-destructive border border-destructive/30";
  }
  return "bg-secondary text-secondary-foreground";
}
