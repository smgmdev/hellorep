import { RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface ConsoleHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: Date | null;
}

export function ConsoleHeader({ onRefresh, isLoading, lastUpdated }: ConsoleHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Database className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold md:text-lg" data-testid="text-title">
              Data Console
            </h1>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground" data-testid="text-last-updated">
                Updated {formatTimeAgo(lastUpdated)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onRefresh}
            disabled={isLoading}
            data-testid="button-refresh"
            aria-label="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
