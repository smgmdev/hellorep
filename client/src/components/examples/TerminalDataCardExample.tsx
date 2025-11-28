import { TerminalDataCard } from "../TerminalDataCard";

export default function TerminalDataCardExample() {
  // todo: remove mock functionality
  const mockData = {
    Project: "Brand Redesign",
    Client: "Acme Corp",
    Status: "In Progress",
    Budget: "$12,500",
  };

  const columns = ["Project", "Client", "Status", "Budget"];

  return (
    <div className="p-4 max-w-sm">
      <TerminalDataCard
        data={mockData}
        columns={columns}
        index={0}
        onClick={() => console.log("Card clicked", mockData)}
      />
    </div>
  );
}
