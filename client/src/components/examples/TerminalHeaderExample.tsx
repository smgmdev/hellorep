import { useState } from "react";
import { TerminalHeader } from "../TerminalHeader";

export default function TerminalHeaderExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  return (
    <TerminalHeader
      onRefresh={handleRefresh}
      onOpenCommand={() => console.log("Open command palette")}
      isLoading={isLoading}
      lastUpdated={lastUpdated}
      recordCount={42}
    />
  );
}
