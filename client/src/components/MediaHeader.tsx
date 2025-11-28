import { RefreshCw, Database, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MediaHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: Date | null;
  recordCount: number;
}

export function MediaHeader({
  onRefresh,
  isLoading,
  lastUpdated,
  recordCount,
}: MediaHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 border border-primary/20">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="font-mono text-sm font-semibold tracking-tight text-foreground flex items-center gap-2" data-testid="text-title">
              MEDIA_CONSOLE
              <Badge variant="outline" className="font-mono text-[10px] h-5">
                v1.0
              </Badge>
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
              {lastUpdated && (
                <span>SYNC: {formatTime(lastUpdated)}</span>
              )}
              {recordCount > 0 && (
                <>
                  <span className="text-border">|</span>
                  <span className="text-primary">{recordCount} RECORDS</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 gap-2 font-mono text-xs"
          data-testid="button-refresh"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
          <span className="hidden sm:inline">REFRESH</span>
        </Button>
      </div>
    </header>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
