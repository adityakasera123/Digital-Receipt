import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRemainingReturnDays } from "../../utils/returnUtils";

export default function ReturnAlerts({ receipts }) {
  const navigate = useNavigate();

  const alerts = receipts || [];

  return (
    <div className="card-surface transition-theme p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-secondary">
          <RotateCcw className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-primary">
            Return Alerts
          </h3>
          <p className="text-sm text-secondary">
            Products that need attention soon
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-default bg-surface-secondary p-6 text-center">
          <p className="font-medium text-primary">
            No return alerts right now
          </p>
          <p className="mt-1 text-sm text-secondary">
            Products nearing their return deadline will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((receipt) => {
            const days = getRemainingReturnDays(receipt.returnEndDate);

            return (
             <button
  key={receipt.id}
  onClick={() =>
    navigate(`/receipts/${receipt.id}`, {
      state: { from: "/dashboard" },
    })
  }
  className="w-full rounded-3xl border border-default bg-surface p-5 text-left transition-theme hover:bg-surface-secondary"
>
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/20">
        <RotateCcw className="h-5 w-5 text-orange-600 dark:text-orange-400" />
      </div>

      <div>
        <p className="text-lg font-semibold text-primary">
          {receipt.productName}
        </p>
        <p className="text-sm text-secondary">
          {receipt.platform}
        </p>
      </div>
    </div>

    <span className="inline-flex items-center rounded-full bg-[#F5E7B2] px-4 py-2 text-sm font-semibold text-[#B45309]">
  {days === 0
    ? "Last day"
    : `${days} day${days === 1 ? "" : "s"} left`}
</span>
  </div>
</button>
            );
          })}
        </div>
      )}
    </div>
  );
}