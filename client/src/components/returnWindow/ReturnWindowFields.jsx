import { RotateCcw } from "lucide-react";

const platforms = [
  "Amazon",
  "Flipkart",
  "Myntra",
  "Ajio",
  "Apple",
  "Croma",
  "Reliance Digital",
  "Other",
];

const durations = [7, 10, 14, 15, 30];

export default function ReturnWindowFields({ receiptData, onInputChange }) {
  return (
    <div className="space-y-5">
      <label className="flex items-center gap-3 text-sm font-medium text-primary">
        <input
          type="checkbox"
          name="returnTracking"
          checked={receiptData.returnTracking || false}
          onChange={(e) =>
            onInputChange({
              target: {
                name: "returnTracking",
                value: e.target.checked,
                type: "checkbox",
                checked: e.target.checked,
              },
            })
          }
          className="h-4 w-4 rounded border-default text-black focus:ring-black dark:text-white dark:focus:ring-white"
        />
        This purchase has a return window
      </label>

      {receiptData.returnTracking && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Platform</label>
            <select
              name="platform"
              value={receiptData.platform || ""}
              onChange={onInputChange}
              className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
            >
              <option value="">Select platform</option>
              {platforms.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Return Type</label>
            <select
              name="returnType"
              value={receiptData.returnType || "Return"}
              onChange={onInputChange}
              className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
            >
              <option value="Return">Return</option>
              <option value="Replacement">Replacement</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Return Duration</label>
            <select
              name="returnDurationDays"
              value={receiptData.returnDurationDays || 7}
              onChange={onInputChange}
              className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
            >
              {durations.map((days) => (
                <option key={days} value={days}>
                  {days} Days
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Return Start Date</label>
            <input
              type="date"
              name="returnStartDate"
              value={receiptData.returnStartDate || ""}
              onChange={onInputChange}
              className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-primary">Return End Date</label>
            <div className="flex items-center gap-3 rounded-2xl border border-default bg-surface-secondary px-4 py-3 text-primary">
              <RotateCcw className="h-4 w-4 text-secondary" />
              <span>
                {receiptData.returnEndDate || "Auto calculated"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}