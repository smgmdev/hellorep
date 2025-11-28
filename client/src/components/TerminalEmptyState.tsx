import { FileX2, RefreshCw, Search, AlertTriangle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalEmptyStateProps {
  type?: "no-data" | "no-results" | "error";
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function TerminalEmptyState({
  type = "no-data",
  title,
  description,
  onAction,
  actionLabel,
}: TerminalEmptyStateProps) {
  const config = {
    "no-data": {
      icon: Terminal,
      defaultTitle: "NO_DATA_FOUND",
      defaultDescription: "// The data source returned empty. Try refreshing.",
      defaultActionLabel: "REFRESH",
    },
    "no-results": {
      icon: Search,
      defaultTitle: "QUERY_EMPTY",
      defaultDescription: "// No records match your search criteria.",
      defaultActionLabel: "CLEAR",
    },
    error: {
      icon: AlertTriangle,
      defaultTitle: "CONNECTION_ERROR",
      defaultDescription: "// Failed to establish connection to data source.",
      defaultActionLabel: "RETRY",
    },
  };

  const { icon: Icon, defaultTitle, defaultDescription, defaultActionLabel } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center font-mono" data-testid="empty-state">
      <div className="flex h-16 w-16 items-center justify-center rounded border border-border/50 bg-muted/30 mb-4">
        <Icon className={`h-8 w-8 ${type === "error" ? "text-destructive" : "text-muted-foreground"}`} />
      </div>
      <h3 className="text-sm font-medium text-primary mb-1" data-testid="text-empty-title">
        {title || defaultTitle}
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-6" data-testid="text-empty-description">
        {description || defaultDescription}
      </p>
      {onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="font-mono text-xs"
          data-testid="button-empty-action"
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          {actionLabel || defaultActionLabel}
        </Button>
      )}
    </div>
  );
}
