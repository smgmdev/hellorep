import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Tag, User, Folder, FileText, Link2 } from "lucide-react";

export interface Product {
  [key: string]: string | number | boolean | undefined;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onClick?: () => void;
}

export function ProductCard({ product, index, onClick }: ProductCardProps) {
  const title = getFieldValue(product, ["title", "name", "product", "item", "media"]);
  const description = getFieldValue(product, ["description", "desc", "details", "summary", "notes"]);
  const status = getFieldValue(product, ["status", "state", "stage"]);
  const type = getFieldValue(product, ["type", "category", "genre", "format"]);
  const date = getFieldValue(product, ["date", "created", "released", "published", "timestamp"]);
  const link = getFieldValue(product, ["link", "url", "href", "website"]);
  const author = getFieldValue(product, ["author", "creator", "owner", "by", "artist"]);

  return (
    <Card
      className={`p-4 font-mono border-border/50 bg-card/50 ${onClick ? "cursor-pointer hover-elevate" : ""}`}
      onClick={onClick}
      data-testid={`product-card-${index}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-muted-foreground font-medium">
              #{String(index + 1).padStart(3, "0")}
            </span>
            {type && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                {type}
              </Badge>
            )}
          </div>
          <h3 className="text-sm font-medium text-primary truncate" data-testid="product-title">
            {title || "Untitled"}
          </h3>
        </div>
        {status && (
          <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${getStatusClasses(status)}`}>
            {status}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2" data-testid="product-description">
          {description}
        </p>
      )}

      <div className="space-y-1.5 text-[11px]">
        {author && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-3 w-3 shrink-0" />
            <span className="truncate">{author}</span>
          </div>
        )}
        {date && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{date}</span>
          </div>
        )}
        {link && (
          <a
            href={String(link)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
            data-testid="product-link"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">View Resource</span>
          </a>
        )}
      </div>
    </Card>
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
