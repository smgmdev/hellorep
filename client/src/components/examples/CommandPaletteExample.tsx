import { useState } from "react";
import { CommandPalette, type DataRow } from "../CommandPalette";
import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";

export default function CommandPaletteExample() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"cards" | "table">("table");

  // todo: remove mock functionality
  const mockData: DataRow[] = [
    { Project: "Brand Redesign", Client: "Acme Corp", Status: "Active" },
    { Project: "Web App MVP", Client: "TechStart", Status: "Completed" },
    { Project: "Social Campaign", Client: "GreenLife", Status: "Pending" },
  ];

  const columns = ["Project", "Client", "Status"];

  return (
    <div className="p-4">
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="font-mono text-xs gap-2"
      >
        <Command className="h-3 w-3" />
        Open Command Palette
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      </Button>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        data={mockData}
        columns={columns}
        onRefresh={() => console.log("Refresh")}
        onSearch={(q) => console.log("Search:", q)}
        onViewChange={setView}
        onRowSelect={(row) => console.log("Selected:", row)}
        onSort={(col) => console.log("Sort by:", col)}
        currentView={view}
      />
    </div>
  );
}
