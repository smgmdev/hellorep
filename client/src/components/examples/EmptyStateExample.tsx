import { EmptyState } from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="p-4">
      <EmptyState
        type="no-data"
        onAction={() => console.log("Refresh clicked")}
      />
    </div>
  );
}
