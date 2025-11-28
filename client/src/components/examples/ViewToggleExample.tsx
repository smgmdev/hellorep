import { useState } from "react";
import { ViewToggle } from "../ViewToggle";

export default function ViewToggleExample() {
  const [view, setView] = useState<"cards" | "table">("cards");

  return (
    <div className="p-4 flex items-center gap-4">
      <ViewToggle view={view} onChange={setView} />
      <span className="text-sm text-muted-foreground">
        Current view: {view}
      </span>
    </div>
  );
}
