import { DataCard } from "../DataCard";

export default function DataCardExample() {
  // todo: remove mock functionality
  const mockData = {
    Project: "Brand Redesign",
    Client: "Acme Corp",
    Status: "In Progress",
    Deadline: "Dec 15, 2025",
  };

  const columns = ["Project", "Client", "Status", "Deadline"];

  return (
    <div className="p-4 max-w-sm">
      <DataCard
        data={mockData}
        columns={columns}
        onClick={() => console.log("Card clicked", mockData)}
      />
    </div>
  );
}
