import { LoadingState } from "../LoadingState";

export default function LoadingStateExample() {
  return (
    <div className="p-4 space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4 text-muted-foreground">Card Loading</h3>
        <LoadingState variant="cards" count={3} />
      </div>
    </div>
  );
}
