import { RefreshCw, Terminal, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TerminalHeaderProps {
  onRefresh: () => void;
  onOpenCommand: () => void;
  isLoading: boolean;
  lastUpdated?: Date | null;
  recordCount: number;
}

export function TerminalHeader({
  onRefresh,
  onOpenCommand,
  isLoading,
  lastUpdated,
  recordCount,
}: TerminalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="flex h-12 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-semibold tracking-tight text-primary" data-testid="text-title">
              DATACONSOLE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="text-primary">//</span>
            <span>v1.0.0</span>
            {lastUpdated && (
              <>
                <span className="text-border">|</span>
                <span>SYNC: {formatTime(lastUpdated)}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {recordCount > 0 && (
            <Badge variant="outline" className="font-mono text-xs hidden sm:inline-flex" data-testid="badge-count">
              {recordCount} REC
            </Badge>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenCommand}
            className="h-8 gap-2 font-mono text-xs"
            data-testid="button-open-command"
          >
            <Command className="h-3 w-3" />
            <span className="hidden sm:inline">CMD</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8"
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
          </Button>
        </div>
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
