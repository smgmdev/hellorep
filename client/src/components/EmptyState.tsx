import { FileX2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type?: "no-data" | "no-results" | "error";
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  type = "no-data",
  title,
  description,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  const config = {
    "no-data": {
      icon: FileX2,
      defaultTitle: "No data available",
      defaultDescription: "Pull to refresh or check your data source",
      defaultActionLabel: "Refresh",
    },
    "no-results": {
      icon: Search,
      defaultTitle: "No results found",
      defaultDescription: "Try adjusting your search or filters",
      defaultActionLabel: "Clear search",
    },
    error: {
      icon: RefreshCw,
      defaultTitle: "Something went wrong",
      defaultDescription: "We couldn't load your data. Please try again.",
      defaultActionLabel: "Retry",
    },
  };

  const { icon: Icon, defaultTitle, defaultDescription, defaultActionLabel } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" data-testid="empty-state">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2" data-testid="text-empty-title">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6" data-testid="text-empty-description">
        {description || defaultDescription}
      </p>
      {onAction && (
        <Button onClick={onAction} data-testid="button-empty-action">
          {actionLabel || defaultActionLabel}
        </Button>
      )}
    </div>
  );
}
