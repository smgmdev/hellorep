import { Activity, Wifi, Clock, LayoutGrid, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalFooterProps {
  status: "connected" | "loading" | "error";
  view: "cards" | "table";
  onViewChange: (view: "cards" | "table") => void;
  filteredCount: number;
  totalCount: number;
}

export function TerminalFooter({
  status,
  view,
  onViewChange,
  filteredCount,
  totalCount,
}: TerminalFooterProps) {
  return (
    <footer className="sticky bottom-0 z-40 border-t border-border/50 bg-background/95 backdrop-blur">
      <div className="flex h-10 items-center justify-between px-4 font-mono text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {status === "connected" && (
              <>
                <Wifi className="h-3 w-3 text-primary" />
                <span className="text-primary">LIVE</span>
              </>
            )}
            {status === "loading" && (
              <>
                <Activity className="h-3 w-3 text-accent animate-pulse" />
                <span className="text-accent">SYNCING</span>
              </>
            )}
            {status === "error" && (
              <>
                <Wifi className="h-3 w-3 text-destructive" />
                <span className="text-destructive">OFFLINE</span>
              </>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            {filteredCount === totalCount ? (
              <span>{totalCount} RECORDS</span>
            ) : (
              <span>{filteredCount}/{totalCount} FILTERED</span>
            )}
          </span>
          
          <div className="flex items-center gap-1 border border-border/50 rounded p-0.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onViewChange("cards")}
              className={`h-6 w-6 ${view === "cards" ? "bg-muted" : ""}`}
              data-testid="button-view-cards"
            >
              <LayoutGrid className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onViewChange("table")}
              className={`h-6 w-6 ${view === "table" ? "bg-muted" : ""}`}
              data-testid="button-view-table"
            >
              <TableIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
