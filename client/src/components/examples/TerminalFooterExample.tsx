import { useState } from "react";
import { TerminalFooter } from "../TerminalFooter";

export default function TerminalFooterExample() {
  const [view, setView] = useState<"cards" | "table">("table");

  return (
    <TerminalFooter
      status="connected"
      view={view}
      onViewChange={setView}
      filteredCount={15}
      totalCount={42}
    />
  );
}
