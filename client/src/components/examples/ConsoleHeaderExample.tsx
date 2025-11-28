import { useState } from "react";
import { ConsoleHeader } from "../ConsoleHeader";

export default function ConsoleHeaderExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  return (
    <ConsoleHeader
      onRefresh={handleRefresh}
      isLoading={isLoading}
      lastUpdated={lastUpdated}
    />
  );
}
