import { Search, X, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MediaSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpenCommand?: () => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function MediaSearchBar({
  value,
  onChange,
  onOpenCommand,
  placeholder = "Search by title...",
  resultCount,
  totalCount,
}: MediaSearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 pl-10 pr-10 font-mono text-sm bg-muted/30 border-border/50"
          data-testid="input-media-search"
        />
        {value && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onChange("")}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            data-testid="button-clear-search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {onOpenCommand && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCommand}
          className="h-10 gap-2 font-mono text-xs shrink-0 hidden sm:flex"
          data-testid="button-open-command"
        >
          <Command className="h-3.5 w-3.5" />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
            <span>⌘</span>K
          </kbd>
        </Button>
      )}

      {resultCount !== undefined && totalCount !== undefined && (
        <div className="text-xs text-muted-foreground font-mono shrink-0">
          {resultCount === totalCount ? (
            <span>{totalCount} items</span>
          ) : (
            <span className="text-primary">{resultCount}</span>
          )}
          {resultCount !== totalCount && <span>/{totalCount}</span>}
        </div>
      )}
    </div>
  );
}
