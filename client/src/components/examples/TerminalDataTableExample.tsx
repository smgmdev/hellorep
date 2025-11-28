import { useState } from "react";
import { TerminalDataTable, type DataRow } from "../TerminalDataTable";

export default function TerminalDataTableExample() {
  const [sortColumn, setSortColumn] = useState<string>("Project");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // todo: remove mock functionality
  const mockData: DataRow[] = [
    { Project: "Brand Redesign", Client: "Acme Corp", Status: "In Progress", Budget: "$12,500" },
    { Project: "Web App MVP", Client: "TechStart", Status: "Completed", Budget: "$45,000" },
    { Project: "Social Campaign", Client: "GreenLife", Status: "Pending", Budget: "$8,200" },
  ];

  const columns = ["Project", "Client", "Status", "Budget"];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="p-4">
      <TerminalDataTable
        data={mockData}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={(row, idx) => console.log("Row clicked", row, idx)}
      />
    </div>
  );
}
