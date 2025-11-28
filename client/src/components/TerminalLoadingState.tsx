import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Terminal } from "lucide-react";

interface TerminalLoadingStateProps {
  variant?: "cards" | "table";
  count?: number;
}

export function TerminalLoadingState({ variant = "cards", count = 6 }: TerminalLoadingStateProps) {
  if (variant === "table") {
    return (
      <div className="rounded-md border border-border/50 overflow-hidden font-mono text-xs">
        <div className="bg-muted/30 p-3 border-b border-border/50">
          <div className="flex gap-8">
            <Skeleton className="h-3 w-8" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-3 w-20" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="flex gap-8 p-3">
              <Skeleton className="h-3 w-8" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-3 w-20" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="p-3 border-border/50 bg-card/50">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function TerminalSplashLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-mono">
      <Terminal className="h-12 w-12 text-primary mb-4 animate-pulse" />
      <div className="text-sm text-muted-foreground mb-2">INITIALIZING...</div>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
