import { RotateCcw } from "lucide-react";
import ReturnWindowFields from "./ReturnWindowFields";

export default function ReturnWindowCard(props) {
  return (
    <div className="rounded-3xl border border-default bg-surface p-6 shadow-sm transition-theme">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary">
          <RotateCcw className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary">
            Return Window Information
          </h2>
          <p className="text-sm text-secondary">
            Track return and replacement deadlines for online and offline purchases.
          </p>
        </div>
      </div>

      <ReturnWindowFields {...props} />
    </div>
  );
}