import { useState } from "react";
import { DataTable, type DataRow } from "../DataTable";

export default function DataTableExample() {
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
      <DataTable
        data={mockData}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={(row) => console.log("Row clicked", row)}
      />
    </div>
  );
}
