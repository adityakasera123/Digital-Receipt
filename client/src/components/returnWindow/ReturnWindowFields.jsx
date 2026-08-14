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
          {/* Platform */}
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

          {/* Return Type */}
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

          {/* Return Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Return Duration
            </label>

            <select
              value={
                receiptData.returnDurationType === "custom"
                  ? "custom"
                  : String(receiptData.returnDurationDays || 7)
              }
              onChange={(e) => {
                if (e.target.value === "custom") {
                  onInputChange({
                    target: {
                      name: "returnDurationType",
                      value: "custom",
                    },
                  });

                  onInputChange({
                    target: {
                      name: "returnDurationDays",
                      value: 7,
                    },
                  });
                } else {
                  onInputChange({
                    target: {
                      name: "returnDurationType",
                      value: "preset",
                    },
                  });

                  onInputChange({
                    target: {
                      name: "returnDurationDays",
                      value: Number(e.target.value),
                    },
                  });
                }
              }}
              className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
            >
              <option value="3">3 Days</option>
              <option value="4">4 Days</option>
              <option value="5">5 Days</option>
              <option value="7">7 Days</option>
              <option value="10">10 Days</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
              <option value="custom">Custom</option>
            </select>

            {receiptData.returnDurationType === "custom" && (
              <div className="pt-3">
                <label className="mb-2 block text-sm font-medium text-primary">
                  Enter custom days
                </label>

                <input
                  type="number"
                  min="1"
                  max="365"
                  name="returnDurationDays"
                  value={receiptData.returnDurationDays || ""}
                  onChange={onInputChange}
                  placeholder="Enter number of days"
                  className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
                />
              </div>
            )}
          </div>

          {/* Return Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Return Start Date
            </label>
            <input
              type="date"
              name="returnStartDate"
              value={receiptData.returnStartDate || ""}
              onChange={onInputChange}
              className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
            />
          </div>

          {/* Optional Delivery Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Delivery Date (Optional)
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={receiptData.deliveryDate || ""}
              onChange={onInputChange}
              className="w-full rounded-2xl border border-default bg-surface px-4 py-3 text-primary transition-theme"
            />
            <p className="text-xs text-secondary">
              Leave empty for offline purchases. If provided, return countdown
              will start from the delivery date.
            </p>
          </div>

          {/* Editable Return End Date */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-primary">
              Return End Date
            </label>

            <div className="relative">
              <RotateCcw className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />

              <input
                type="date"
                name="returnEndDate"
                value={receiptData.returnEndDate || ""}
                onChange={(e) => {
                  onInputChange(e);

                  onInputChange({
                    target: {
                      name: "returnEndDateManual",
                      value: true,
                      type: "checkbox",
                      checked: true,
                    },
                  });
                }}
                className="w-full rounded-2xl border border-default bg-surface px-10 py-3 text-primary transition-theme"
              />
            </div>

            <p className="text-xs text-secondary">
              By default this date is auto-calculated. You can override it
              manually if the store provides a different return deadline.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}