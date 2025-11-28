import { LayoutGrid, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  view: "cards" | "table";
  onChange: (view: "cards" | "table") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-md border p-1 gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onChange("cards")}
        className={`h-8 w-8 toggle-elevate ${view === "cards" ? "toggle-elevated" : ""}`}
        data-testid="button-view-cards"
        aria-label="Card view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onChange("table")}
        className={`h-8 w-8 toggle-elevate ${view === "table" ? "toggle-elevated" : ""}`}
        data-testid="button-view-table"
        aria-label="Table view"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
